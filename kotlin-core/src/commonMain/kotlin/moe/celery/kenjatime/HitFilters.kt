package moe.celery.kenjatime

/** Independent state and attack-class bitsets. The attack-class A wildcard
 * expands N/S/H while its second letter remains strike(A), projectile(P),
 * or throw(T). Empty fields stay empty; they never implicitly mean all. */
internal data class CoreHitAttribute(val states: Int, val attacks: Int) {
    fun matches(other: CoreHitAttribute) = states and other.states != 0 && attacks and other.attacks != 0
    fun complement() = CoreHitAttribute(states xor 7,attacks xor 511)
    companion object {
        private val whitespace=Regex("\\s+")
        private val cache=linkedMapOf<String,CoreHitAttribute>()
        fun parse(raw: String): CoreHitAttribute {
            require(raw.length <= 256) { "Hit attribute is too long" }
            val text=raw.uppercase().replace(whitespace,"")
            return cache[text] ?: run {
                val fields=text.split(',')
                var states=0
                for(c in fields[0]) {
                    val index="SCA".indexOf(c)
                    require(index >= 0) { "Invalid hit attribute state: $c" }
                    states=states or (1 shl index)
                }
                var attacks=0
                for(field in fields.drop(1)) {
                    require(field.length%2 == 0) { "Incomplete hit attack attribute: $field" }
                    for(offset in field.indices step 2) {
                        val category=field[offset]
                        val kind="APT".indexOf(field[offset+1])
                        require(category in "NSHA" && kind >= 0) { "Invalid hit attack attribute: $field" }
                        for(strength in 0..2)if(category == 'A' || category == "NSH"[strength])
                            attacks=attacks or (1 shl (strength*3+kind))
                    }
                }
                CoreHitAttribute(states,attacks).also {
                    if(cache.size >= 512)cache.clear()
                    cache[text]=it
                }
            }
        }
    }
}

/** Two per-actor slots shared by HitBy and NotHitBy. Clocks advance once
 * before controllers on each actor tick, including hitpause. A newly installed
 * time=1 filter therefore covers that tick's entire contact phase. */
internal class CoreHitFilters {
    private data class Slot(val allowed: CoreHitAttribute,var left: Int)
    private val slots=arrayOfNulls<Slot>(2)
    fun remaining(slot: Int): Int = slots.getOrNull(slot)?.left ?: 0
    fun beginTick() {
        for(i in slots.indices) {
            val slot=slots[i] ?: continue
            if(slot.left > 0 && --slot.left == 0)slots[i]=null
        }
    }
    fun allows(hit: HitDefinition,errors: MutableSet<String>): Boolean {
        if(slots.all { it == null })return true
        val attribute=try { CoreHitAttribute.parse(hit.attr) }
        catch(e: IllegalArgumentException) {
            errors.add("Invalid incoming hit attribute: ${e.message}")
            return false
        }
        return slots.all { it == null || it.allowed.matches(attribute) }
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            val keys=listOf("value","value2").filter { it in args }
            require(keys.size == 1) { "Specify exactly one of value or value2" }
            val extra=args.keys-setOf("type","value","value2","time","persistent","ignorehitpause")
            require(extra.isEmpty()) { "Unsupported hit-filter parameters: ${extra.joinToString()}" }
            val attribute=CoreHitAttribute.parse(args.getValue(keys.single()))
            val duration=args["time"]?.let {
                CoreExpression.number(it,actor,errors) ?: throw IllegalArgumentException("Invalid hit-filter duration")
            } ?: 1.0
            require(duration >= -1.0 && duration <= Int.MAX_VALUE.toDouble()) { "Hit-filter time must be -1 or nonnegative" }
            val time=duration.toInt()
            val allowed=if(controller.type.equals("nothitby",true))attribute.complement() else attribute
            // Validate every parameter before replacing the selected slot.
            slots[if(keys.single() == "value")0 else 1]=if(time == 0)null else Slot(allowed,time)
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid ${controller.type}: ${e.message}")
        }
    }
}
