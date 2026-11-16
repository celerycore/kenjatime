package moe.celery.kenjatime

internal data class CoreHitVelocity(val x: Int,val y: Int)

/** Resolve authored defaults before fixed-point conversion, including aerial guard factors. */
internal data class CoreHitVelocities(val ground: CoreHitVelocity,val air: CoreHitVelocity,
    val guard: CoreHitVelocity,val airGuard: CoreHitVelocity) {
    companion object {
        fun parse(args: Map<String,String>,actor: FightingCharacter,errors: MutableSet<String>,projectile: Boolean=false): CoreHitVelocities? = try {
            fun vector(key: String,default: Pair<Double,Double>): Pair<Double,Double> {
                val raw=args[key] ?: (if(projectile)args["proj$key"] else null) ?: return default
                val parts=CnsArguments.split(raw)
                require(parts.size in 1..2 && parts.all { it.isNotBlank() }) { "Invalid $key vector" }
                fun value(index: Int): Double = parts.getOrNull(index)?.let {
                    CoreExpression.number(it,actor,errors) ?: throw IllegalArgumentException("Invalid $key expression")
                } ?: 0.0
                return value(0) to value(1)
            }
            val ground=vector("ground.velocity",0.0 to 0.0)
            val air=vector("air.velocity",0.0 to 0.0)
            val guard=vector("guard.velocity",ground.first to 0.0)
            val airGuard=vector("airguard.velocity",air.first*1.5 to air.second/2)
            fun canonical(value: Pair<Double,Double>)=CoreHitVelocity(actor.coordinates.toWorld(value.first),actor.coordinates.toWorld(value.second))
            CoreHitVelocities(canonical(ground),canonical(air),canonical(guard),canonical(airGuard))
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid hit velocity: ${e.message}");null
        }
    }
}
