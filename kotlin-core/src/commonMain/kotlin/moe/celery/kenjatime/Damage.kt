package moe.celery.kenjatime

import kotlin.math.floor

/** Base and runtime damage factors, including active super-pause defence. */
internal object CoreDamage {
    fun hitValues(args: Map<String, String>, actor: FightingCharacter, errors: MutableSet<String>,
                  projectile: Boolean = false): Pair<Int, Int>? = try {
        val raw = args["damage"] ?: if (projectile) args["projdamage"] else null
        val values = raw?.let(CnsArguments::split).orEmpty()
        require(values.size <= 2) { "Damage requires one or two components" }
        fun evaluate(value: String?): Int = value?.let {
            CoreExpression.numericValue(it, actor, errors, "damage")?.toInt()
                ?: throw IllegalArgumentException("Invalid damage expression")
        } ?: 0
        val guardOverride = if (projectile) null else args["guard.damage"]
        evaluate(values.firstOrNull()) to evaluate(guardOverride ?: values.getOrNull(1))
    } catch (e: IllegalArgumentException) {
        errors.add("Invalid damage: ${e.message}")
        null
    }

    fun contact(hit: HitDefinition,attacker: FightingCharacter?,defender: FightingCharacter,guarded: Boolean): Int {
        val amount=(if(guarded)hit.guardDamage else hit.damage).coerceAtLeast(0)
        val attack=attacker?.definition?.attack ?: 100
        val attackMultiplier=hit.capturedAttackMultiplier ?: attacker?.attackMultiplier ?: 1.0
        val defenceMultiplier=defender.defenceMultiplier / (defender.world?.pauses?.defence(defender) ?: 1.0)
        if(amount == 0 || attack == 0 || attackMultiplier == 0.0 || defenceMultiplier == 0.0)return 0
        val scaled=amount.toDouble()*attack*attackMultiplier*defenceMultiplier/defender.definition.defence
        // Positive half values round up; small but nonzero damage retains one.
        // Double arithmetic avoids intermediate Int overflow; conversion saturates.
        return floor(scaled+0.5).toInt().coerceAtLeast(1)
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            require(args.keys.all { it in setOf("type","value","persistent","ignorehitpause") }) {
                "Unsupported damage-multiplier parameter"
            }
            val raw=args["value"] ?: throw IllegalArgumentException("Missing value")
            val value=CoreExpression.number(raw,actor,errors)
                ?: throw IllegalArgumentException("Invalid value expression")
            require(value in 0.0..Float.MAX_VALUE.toDouble()) { "Multiplier must be finite and nonnegative" }
            if(controller.type.equals("attackmulset",true))actor.attackMultiplier=value
            else actor.defenceMultiplier=value
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid ${controller.type}: ${e.message}")
        }
    }
}
