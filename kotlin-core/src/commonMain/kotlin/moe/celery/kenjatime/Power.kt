package moe.celery.kenjatime

internal object CorePowerControllers {
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val type=controller.type.lowercase()
            val args=controller.params
            val allowed=setOf("type","value","persistent","ignorehitpause")+
                if(type == "targetpoweradd")setOf("id") else emptySet()
            require(args.keys.all { it in allowed }) { "Unsupported power-control parameter" }
            fun integer(key: String,fallback: Int?=null): Int {
                val raw=args[key] ?: return fallback
                    ?: throw IllegalArgumentException("Missing $key")
                val value=CoreExpression.number(raw,actor,errors)
                    ?: throw IllegalArgumentException("Invalid $key expression")
                require(value in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) { "$key out of range" }
                return value.toInt()
            }
            // Evaluate and validate the complete request before changing any meter.
            val value=integer("value")
            val owners=if(type == "targetpoweradd")actor.targets(integer("id",-1)).map { it.powerOwner() }
                else listOf(actor.powerOwner())
            for(owner in owners) {
                if(type == "powerset")owner.power=value else owner.addPower(value)
            }
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid ${controller.type}: ${e.message}")
        }
    }
}
