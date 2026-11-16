package moe.celery.kenjatime

/** Authored recovery permission and tick threshold; neither is a spatial quantity. */
internal data class CoreFallRecovery(val enabled: Boolean,val time: Int) {
    companion object {
        fun parse(args: Map<String,String>,actor: FightingCharacter,errors: MutableSet<String>): CoreFallRecovery? = try {
            fun number(key: String,default: Double): Double = args[key]?.let {
                CoreExpression.number(it,actor,errors)
                    ?: throw IllegalArgumentException("Invalid $key expression")
            } ?: default
            val enabled=number("fall.recover",1.0) != 0.0
            val time=number("fall.recovertime",4.0)
            require(time in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) { "fall.recovertime out of range" }
            CoreFallRecovery(enabled,time.toInt())
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid fall recovery: ${e.message}");null
        }
        fun advance(actor: FightingCharacter,paused: Boolean) {
            val data=actor.getHitData
            if(!paused && actor.moveType == "H" && data.received && data.fall && data.fallTime < Int.MAX_VALUE)
                data.fallTime++
        }
    }
}
