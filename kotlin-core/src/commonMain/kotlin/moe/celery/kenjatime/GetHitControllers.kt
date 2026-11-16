package moe.celery.kenjatime

internal data class CoreFallVelocities(val x: Int?,val y: Int) {
    companion object {
        fun parse(args: Map<String,String>,actor: FightingCharacter,errors: MutableSet<String>): CoreFallVelocities? = try {
            fun velocity(key: String): Int? = args[key]?.let {
                actor.coordinates.toWorld(CoreExpression.number(it,actor,errors)
                    ?: throw IllegalArgumentException("Invalid $key expression"))
            }
            CoreFallVelocities(velocity("fall.xvelocity"),velocity("fall.yvelocity") ?: Fixed.of(-4.5))
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid fall velocity: ${e.message}");null
        }
    }
}

internal object CoreGetHitControllers {
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val type=controller.type.lowercase()
            val args=controller.params
            val allowed=setOf("type","persistent","ignorehitpause")+when(type) {
                "hitvelset" -> setOf("x","y")
                "hitfallset" -> setOf("value","xvel","yvel")
                else -> emptySet()
            }
            require(args.keys.all { it in allowed }) { "Unsupported get-hit controller parameter" }
            fun number(key: String): Double? = args[key]?.let {
                CoreExpression.number(it,actor,errors) ?: throw IllegalArgumentException("Invalid $key expression")
            }
            // Validate the whole request before editing any velocity or hit data.
            val x=if(type=="hitvelset") (number("x") ?: 0.0) != 0.0 else false
            val y=if(type=="hitvelset") (number("y") ?: 0.0) != 0.0 else false
            val flag=if(type=="hitfallset")number("value")?.toInt() ?: -1 else -1
            require(flag in -1..1) { "HitFallSet value must be -1, 0 or 1" }
            val fallX=if(type=="hitfallset")number("xvel")?.let(actor.coordinates::toWorld) else null
            val fallY=if(type=="hitfallset")number("yvel")?.let(actor.coordinates::toWorld) else null
            val data=actor.getHitData
            if(actor.moveType != "H" || !data.received)return
            when(type) {
                "hitvelset" -> {
                    if(x)actor.velX=data.velocityX
                    if(y)actor.velY=data.velocityY
                }
                "hitfallset" -> {
                    if(flag >= 0)data.fall=flag != 0
                    fallX?.let { data.fallVelocityX=it }
                    fallY?.let { data.fallVelocityY=it }
                }
                "hitfallvel" -> if(data.fall) {
                    data.fallVelocityX?.let { actor.velX=it }
                    actor.velY=data.fallVelocityY
                }
                "hitfalldamage" -> if(data.fall)CoreFallDamage.apply(actor)
            }
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid ${controller.type}: ${e.message}")
        }
    }
}
