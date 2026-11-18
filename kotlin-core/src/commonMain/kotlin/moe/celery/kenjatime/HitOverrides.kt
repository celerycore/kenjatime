package moe.celery.kenjatime

internal data class CoreHitOverride(
    val attribute: CoreHitAttribute,val state: Int,val forceAir: Boolean,var left: Int
)

/** Actor-owned reaction routes. Slot priority is deterministic: lowest matching
 * slot wins. As with hit filters, finite clocks include hitpause ticks. */
internal class CoreHitOverrides {
    private val slots=arrayOfNulls<CoreHitOverride>(8)
    fun remaining(slot: Int): Int = slots.getOrNull(slot)?.left ?: 0
    fun beginTick() {
        for(i in slots.indices) {
            val value=slots[i] ?: continue
            if(value.left > 0 && --value.left == 0)slots[i]=null
        }
    }
    fun matching(hit: HitDefinition): CoreHitOverride? {
        if(slots.all { it == null })return null
        val attribute=CoreHitAttribute.parse(hit.attr)
        return slots.firstOrNull { it != null && it.attribute.matches(attribute) }
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            val extra=args.keys-setOf("type","attr","stateno","slot","time","forceair","persistent","ignorehitpause")
            require(extra.isEmpty()) { "Unsupported HitOverride parameters: ${extra.joinToString()}" }
            fun integer(key: String,fallback: Int): Int = args[key]?.let {
                val n=CoreExpression.number(it,actor,errors) ?: throw IllegalArgumentException("Invalid $key")
                require(n >= Int.MIN_VALUE.toDouble() && n <= Int.MAX_VALUE.toDouble()) { "Out-of-range $key" }
                n.toInt()
            } ?: fallback
            val slot=integer("slot",0)
            val time=integer("time",1)
            val forceAir=integer("forceair",0)
            require(slot in 0..7) { "HitOverride slot must be 0..7" }
            require(time >= -1) { "HitOverride time must be -1 or nonnegative" }
            require(forceAir in 0..1) { "HitOverride forceair must be 0 or 1" }
            val raw=args["attr"]
            val attribute=raw?.let(CoreHitAttribute::parse)
            if(time == 0 || raw != null && raw.isBlank()) {
                slots[slot]=null
                return
            }
            require(attribute != null && args["stateno"] != null) { "HitOverride requires attr and stateno" }
            val state=integer("stateno",-1)
            require(state >= 0 && (state == 0 || state in actor.definition.states)) {
                "HitOverride destination must exist in the actor's own state bank: $state"
            }
            // Invalid parameters never replace a working route.
            slots[slot]=CoreHitOverride(attribute,state,forceAir != 0,time)
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid HitOverride: ${e.message}")
        }
    }
}

/** Incoming velocities are canonical stage units, independent of later VelSet,
 * facing or custom-state coordinate changes. The reaction clock reaches -1. */
internal data class CoreGetHitData(
    val damage: Int=0,val velocityX: Int=0,val velocityY: Int=0,
    val guarded: Boolean=false,var fall: Boolean=false,var time: Int=-1,
    var fallVelocityX: Int?=null,var fallVelocityY: Int=0,val received: Boolean=false,
    var fallDamage: Int=0,val fallKill: Boolean=true,
    val fallRecover: Boolean=false,val fallRecoverTime: Int=4,var fallTime: Int=0,
    val accelerationY: Int=0,val animationType: HitAnimationType=HitAnimationType.LIGHT,
    val slideTime: Int=0,val controlTime: Int=0,
    var fallShake: HitShakeDefinition=HitShakeDefinition(),
    val groundType: Int = 1, val airType: Int = 1
)
