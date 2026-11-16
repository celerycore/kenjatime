package moe.celery.kenjatime

internal data class CoreHitKills(val hit: Boolean,val guard: Boolean,val fall: Boolean=true) {
    companion object {
        fun parse(args: Map<String,String>,actor: FightingCharacter,errors: MutableSet<String>): CoreHitKills? = try {
            fun flag(key: String): Boolean {
                val raw=args[key] ?: return true
                val value=CoreExpression.number(raw,actor,errors)
                    ?: throw IllegalArgumentException("Invalid $key expression")
                return value != 0.0
            }
            CoreHitKills(flag("kill"),flag("guard.kill"),flag("fall.kill"))
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid hit kill flag: ${e.message}");null
        }
    }
}
