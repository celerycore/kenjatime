package moe.celery.kenjatime

internal data class CoreHitPauses(val hit: Pair<Int,Int>,val guard: Pair<Int,Int>) {
    companion object {
        fun parse(args: Map<String,String>,actor: FightingCharacter,errors: MutableSet<String>,projectile: Boolean=false): CoreHitPauses? = try {
            fun pair(key: String,fallback: Pair<Int,Int>): Pair<Int,Int> {
                val raw=args[key] ?: (if(projectile)args["proj$key"] else null) ?: return fallback
                val parts=CnsArguments.split(raw)
                require(parts.size in 1..2) { "$key requires one or two components" }
                fun value(text: String)= (CoreExpression.number(text,actor,errors)
                    ?: throw IllegalArgumentException("Invalid $key expression")).coerceIn(0.0,120.0).toInt()
                val first=value(parts[0])
                return first to (parts.getOrNull(1)?.let(::value) ?: first)
            }
            val hit=pair("pausetime",0 to 0)
            CoreHitPauses(hit,pair("guard.pausetime",hit))
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid hit pause: ${e.message}");null
        }
    }
}
