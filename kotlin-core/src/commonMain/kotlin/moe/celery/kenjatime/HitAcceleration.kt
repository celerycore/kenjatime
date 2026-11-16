package moe.celery.kenjatime

/** Per-hit acceleration is captured in canonical units, independently of Movement.yaccel. */
internal object CoreHitAcceleration {
    fun parse(args: Map<String,String>,actor: FightingCharacter,errors: MutableSet<String>): Int? = try {
        args["yaccel"]?.let {
            actor.coordinates.toWorld(CoreExpression.number(it,actor,errors)
                ?: throw IllegalArgumentException("Invalid yaccel expression"))
        } ?: Fixed.of(0.35)
    }catch(e: IllegalArgumentException) {
        errors.add("Invalid hit acceleration: ${e.message}");null
    }
}
