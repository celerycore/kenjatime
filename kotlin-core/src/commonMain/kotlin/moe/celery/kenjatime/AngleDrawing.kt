package moe.celery.kenjatime

/** Persistent angle arithmetic plus a per-tick drawing/scaling assertion. */
internal object CoreAngleDrawing {
    const val MAX_SCALE = 64.0
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val type=controller.type.lowercase()
            val args=controller.params
            val allowed=setOf("type","value","persistent","ignorehitpause")+
                if(type == "angledraw")setOf("scale") else emptySet()
            require(args.keys.all { it in allowed }) { "Unsupported angle parameter" }
            fun number(raw: String): Double = CoreExpression.number(raw,actor,errors)
                ?: throw IllegalArgumentException("Invalid angle expression")
            val value=args["value"]?.let(::number)
            require(type == "angledraw" || value != null) { "Missing value" }
            val angle=when(type) {
                "angleadd" -> actor.drawAngleDegrees+value!!
                "anglemul" -> actor.drawAngleDegrees*value!!
                else -> value ?: actor.drawAngleDegrees
            }
            require(angle.isFinite()) { "Angle result is nonfinite" }
            val scale=if(type == "angledraw" && args["scale"] != null) {
                val parts=CnsArguments.split(args.getValue("scale"))
                require(parts.size == 2) { "AngleDraw scale requires two components" }
                number(parts[0]) to number(parts[1])
            } else 1.0 to 1.0
            require(scale.first in -MAX_SCALE..MAX_SCALE && scale.second in -MAX_SCALE..MAX_SCALE) {
                "AngleDraw scale out of range"
            }
            // Validate the complete request, including arithmetic and both scale axes, before mutation.
            actor.drawAngleDegrees=if(angle == 0.0)0.0 else angle
            if(type == "angledraw") {
                actor.angleDrawEnabled=true
                actor.drawScaleX=scale.first;actor.drawScaleY=scale.second
            }
        }catch(e: IllegalArgumentException) { errors.add("Invalid ${controller.type}: ${e.message}") }
    }
}
