package moe.celery.kenjatime

internal data class CoreStatePersistence(val hitDef: Boolean=false,val moveHit: Boolean=false,val hitCount: Boolean=false) {
    companion object {
        fun read(program: StateProgram?,actor: FightingCharacter,errors: MutableSet<String>): CoreStatePersistence = try {
            fun flag(key: String,raw: String?): Boolean {
                if(raw == null)return false
                val value=CoreExpression.number(raw,actor,errors)
                    ?: throw IllegalArgumentException("Invalid $key expression")
                return value != 0.0
            }
            // Evaluate every flag before clearing any of the incoming move data.
            CoreStatePersistence(flag("hitdefpersist",program?.hitDefPersist),
                flag("movehitpersist",program?.moveHitPersist),flag("hitcountpersist",program?.hitCountPersist))
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid StateDef persistence: ${e.message}")
            CoreStatePersistence()
        }
    }
}

internal object CoreHitCounts {
    fun add(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            require(args.keys.all { it in setOf("type","value","persistent","ignorehitpause") }) {
                "Unsupported HitAdd parameter"
            }
            val raw=args["value"] ?: throw IllegalArgumentException("Missing value")
            val amount=CoreExpression.number(raw,actor,errors)
                ?: throw IllegalArgumentException("Invalid value expression")
            require(amount in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) { "HitAdd value out of range" }
            actor.hitCount=(actor.hitCount.toLong()+amount.toInt()).coerceIn(0L,Int.MAX_VALUE.toLong()).toInt()
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid HitAdd: ${e.message}")
        }
    }
}
