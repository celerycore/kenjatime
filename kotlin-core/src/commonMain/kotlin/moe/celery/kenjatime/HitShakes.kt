package moe.celery.kenjatime

/** Captured attack metadata. Amplitude is canonical 1/256-pixel stage space. */
data class HitShakeDefinition(
    val time: Int=0,val frequency: Double=60.0,val amplitude256: Int=-4*Fixed.ONE,val phase: Double=0.0
)

internal data class CoreHitShakes(val impact: HitShakeDefinition,val fall: HitShakeDefinition) {
    companion object {
        fun parse(args: Map<String,String>,actor: FightingCharacter,errors: MutableSet<String>): CoreHitShakes? = try {
            fun shake(prefix: String): HitShakeDefinition {
                val allowed=setOf("time","freq","ampl","phase").map { "$prefix.$it" }.toSet()
                require(args.keys.none { it.startsWith("$prefix.") && it !in allowed }) { "Unsupported $prefix parameter" }
                fun bounded(key: String,default: Double,low: Double,high: Double): Double {
                    val n=args["$prefix.$key"]?.let { CoreExpression.number(it,actor,errors)
                        ?: throw IllegalArgumentException("Invalid $prefix.$key expression") } ?: default
                    require(n in low..high) { "$prefix.$key out of range" };return n
                }
                val time=bounded("time",0.0,0.0,36000.0).toInt()
                val frequency=bounded("freq",60.0,0.0,180.0)
                val amplitude=if("$prefix.ampl" in args)
                    actor.coordinates.toWorld(bounded("ampl",-4.0,-100000.0,100000.0).toInt().toDouble()) else -4*Fixed.ONE
                val phase=bounded("phase",if(frequency>=90)90.0 else 0.0,-1000000.0,1000000.0)
                return HitShakeDefinition(time,frequency,amplitude,phase)
            }
            CoreHitShakes(shake("envshake"),shake("fall.envshake"))
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid attack shake: ${e.message}");null
        }
    }
}

/** FallEnvShake consumes pending hit data, including after a state-bank change. */
internal object CoreFallEnvShake {
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        if(controller.params.keys.any { it !in setOf("type","persistent","ignorehitpause") }) {
            errors.add("Invalid FallEnvShake: Unsupported parameter");return
        }
        val pending=actor.getHitData.fallShake
        if(pending.time<=0)return
        val environment=actor.world?.environment ?: return
        environment.startShake(pending)
        actor.getHitData.fallShake=pending.copy(time=0)
    }
}
