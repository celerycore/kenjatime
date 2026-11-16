package moe.celery.kenjatime

internal object CoreFallDamage {
    fun parse(args: Map<String,String>,actor: FightingCharacter,errors: MutableSet<String>): Int? = try {
        val raw=args["fall.damage"]
        val amount=if(raw == null)0.0 else CoreExpression.number(raw,actor,errors)
            ?: throw IllegalArgumentException("Invalid fall.damage expression")
        require(amount in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) { "fall.damage out of range" }
        amount.toInt()
    }catch(e: IllegalArgumentException) {
        errors.add("Invalid fall damage: ${e.message}");null
    }
    fun apply(actor: FightingCharacter) {
        val data=actor.getHitData
        if(actor.moveType != "H" || !data.received || !data.fall)return
        CoreLifeControllers.applyFall(actor,data.fallDamage,data.fallKill)
        data.fallDamage=0
    }
}
