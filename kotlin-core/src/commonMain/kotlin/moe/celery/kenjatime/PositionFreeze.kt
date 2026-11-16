package moe.celery.kenjatime

/** A per-tick movement flag, independent of clocks, velocity and explicit position controllers. */
internal object CorePositionFreeze {
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            require(args.keys.all { it in setOf("type","value","persistent","ignorehitpause") }) {
                "Unsupported PosFreeze parameter"
            }
            val value=args["value"]?.let {
                CoreExpression.number(it,actor,errors) ?: throw IllegalArgumentException("Invalid value expression")
            } ?: 1.0
            actor.positionFrozen=value != 0.0
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid PosFreeze: ${e.message}")
        }
    }
}
