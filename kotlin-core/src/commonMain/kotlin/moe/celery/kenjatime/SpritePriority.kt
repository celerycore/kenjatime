package moe.celery.kenjatime

/** Persistent actor-owned render metadata, independent of attack/collision priority. */
internal object CoreSpritePriority {
    fun projectile(actor: FightingCharacter,raw: String?,errors: MutableSet<String>): Int? = try {
        val number=raw?.let { CoreExpression.number(it,actor,errors)
            ?: throw IllegalArgumentException("Invalid projsprpriority expression") } ?: 3.0
        require(number in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) { "projsprpriority out of range" }
        number.toInt()
    }catch(e: IllegalArgumentException) {
        errors.add("Invalid projectile sprite priority: ${e.message}");null
    }
    private fun value(actor: FightingCharacter,raw: String,errors: MutableSet<String>): Int {
        val number=CoreExpression.number(raw,actor,errors)
            ?: throw IllegalArgumentException("Invalid value expression")
        require(number in -5.0..5.0) { "Sprite priority must be between -5 and 5" }
        return number.toInt()
    }
    fun enter(actor: FightingCharacter,raw: String?,errors: MutableSet<String>) {
        if(raw == null)return
        try { actor.spritePriority=value(actor,raw,errors) }
        catch(e: IllegalArgumentException) { errors.add("Invalid StateDef sprpriority: ${e.message}") }
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            require(args.keys.all { it in setOf("type","value","persistent","ignorehitpause") }) {
                "Unsupported SprPriority parameter"
            }
            val raw=args["value"] ?: throw IllegalArgumentException("Missing value")
            actor.spritePriority=value(actor,raw,errors)
        }catch(e: IllegalArgumentException) { errors.add("Invalid SprPriority: ${e.message}") }
    }
}
