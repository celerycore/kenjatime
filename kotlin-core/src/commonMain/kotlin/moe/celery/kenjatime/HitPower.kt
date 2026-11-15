package moe.celery.kenjatime

/** Standard mugen.cfg rates; adapters can supply configured rates. */
data class HitPowerRules(val attackLifeToPower: Double=0.7,val getHitLifeToPower: Double=0.6) {
    init {
        require(listOf(attackLifeToPower,getHitLifeToPower).all {
            it.isFinite() && it >= 0 && it <= Float.MAX_VALUE.toDouble()
        }) { "Hit power rates must be finite, nonnegative single-precision values" }
    }
    // MUGEN's default product uses single precision before integer truncation.
    fun attacker(damage: Int): Int=(damage.coerceAtLeast(0).toFloat()*attackLifeToPower.toFloat()).toInt()
    fun defender(damage: Int): Int=(damage.coerceAtLeast(0).toFloat()*getHitLifeToPower.toFloat()).toInt()
    companion object { val DEFAULT=HitPowerRules() }
}

internal data class CoreHitPowers(val get: Pair<Int,Int>,val give: Pair<Int,Int>) {
    companion object {
        fun parse(args: Map<String,String>,actor: FightingCharacter,damage: Int,
                  errors: MutableSet<String>): CoreHitPowers? = try {
            val rules=actor.world?.hitPowerRules ?: HitPowerRules.DEFAULT
            fun pair(key: String,fallback: Int): Pair<Int,Int> {
                val raw=args[key] ?: return fallback to fallback/2
                val parts=CnsArguments.split(raw)
                require(parts.size in 1..2) { "$key requires one or two components" }
                fun integer(raw: String): Int {
                    val value=CoreExpression.number(raw,actor,errors)
                        ?: throw IllegalArgumentException("Invalid $key expression")
                    require(value in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) { "$key out of range" }
                    return value.toInt()
                }
                val first=integer(parts[0])
                return first to (parts.getOrNull(1)?.let(::integer) ?: first/2)
            }
            CoreHitPowers(pair("getpower",rules.attacker(damage)),pair("givepower",rules.defender(damage)))
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid hit power: ${e.message}");null
        }
    }
}
