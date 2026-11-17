package moe.celery.kenjatime

internal data class CoreScreenBound(val bound: Boolean,val moveX: Boolean,val moveY: Boolean)

/** One active-tick assertion. Defaults come from the actor, not its state bank. */
internal object CoreScreenBounds {
    fun beginTick(actor: FightingCharacter,paused: Boolean) {
        if(!paused)actor.screenBoundOverride=null
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            require(args.keys.all { it in setOf("type","value","movecamera","persistent","ignorehitpause") }) {
                "Unsupported ScreenBound parameter"
            }
            fun flag(raw: String)= (CoreExpression.number(raw,actor,errors)
                ?: throw IllegalArgumentException("Invalid boolean expression")) != 0.0
            val bound=args["value"]?.let(::flag) ?: false
            val axes=args["movecamera"]?.let { CnsArguments.split(it) }
            require(axes == null || axes.size in 1..2 && axes.none { it.isBlank() }) {
                "movecamera requires one or two components"
            }
            val moveX=axes?.getOrNull(0)?.let(::flag) ?: false
            val moveY=axes?.getOrNull(1)?.let(::flag) ?: false
            // Invalid later components must not partly replace an earlier assertion.
            actor.screenBoundOverride=CoreScreenBound(bound,moveX,moveY)
        }catch(e: IllegalArgumentException) { errors.add("Invalid ScreenBound: ${e.message}") }
    }
}
