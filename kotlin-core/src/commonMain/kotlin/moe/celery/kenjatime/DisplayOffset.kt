package moe.celery.kenjatime

/** Offset is a per-tick world-axis translation, separate from AIR frame offsets/rotation. */
internal object CoreDisplayOffset {
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            require(args.keys.all { it in setOf("type","x","y","persistent","ignorehitpause") }) {
                "Unsupported Offset parameter"
            }
            fun axis(raw: String): Int {
                val n=CoreExpression.number(raw,actor,errors)
                    ?: throw IllegalArgumentException("Invalid offset expression")
                require(n in -100000.0..100000.0) { "Offset out of range" }
                return actor.coordinates.toWorld(n)
            }
            val x=args["x"]?.let(::axis) ?: actor.drawOffsetX
            val y=args["y"]?.let(::axis) ?: actor.drawOffsetY
            // Sparse axes retain an earlier assertion; validate both before mutation.
            actor.drawOffsetX=x;actor.drawOffsetY=y
        }catch(e: IllegalArgumentException) { errors.add("Invalid Offset: ${e.message}") }
    }
}
