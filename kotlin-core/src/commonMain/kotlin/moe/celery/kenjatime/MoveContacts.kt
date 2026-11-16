package moe.celery.kenjatime

/** Body/helper move-contact state is independent of struck targets and projectile history. */
internal object CoreMoveContacts {
    fun reset(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            require(controller.params.keys.all { it in setOf("type","persistent","ignorehitpause") }) {
                "Unsupported MoveHitReset parameter"
            }
            actor.clearMoveContact()
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid MoveHitReset: ${e.message}")
        }
    }
}
