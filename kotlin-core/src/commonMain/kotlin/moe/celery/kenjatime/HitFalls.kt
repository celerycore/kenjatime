package moe.celery.kenjatime

internal data class CoreHitFalls(val ground: Boolean,val air: Boolean,val forceNoFall: Boolean) {
    companion object {
        fun parse(args: Map<String,String>,actor: FightingCharacter,errors: MutableSet<String>): CoreHitFalls? = try {
            fun flag(key: String,default: Boolean): Boolean = args[key]?.let {
                (CoreExpression.number(it,actor,errors)
                    ?: throw IllegalArgumentException("Invalid $key expression")) != 0.0
            } ?: default
            val ground=flag("fall",false)
            CoreHitFalls(ground,flag("air.fall",ground),flag("forcenofall",false))
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid hit fall flag: ${e.message}");null
        }
        fun resolve(hit: HitDefinition,victim: FightingCharacter,airborne: Boolean,guarded: Boolean): Boolean {
            if(guarded)return false
            val requested=if(airborne)hit.airFall else hit.fall
            val carried=victim.moveType == "H" && victim.getHitData.received && victim.getHitData.fall
            // Ground fall=1 takes priority over forcenofall, including an explicit air.fall override.
            val clear=hit.forceNoFall && !hit.fall
            return requested || carried && !clear
        }
    }
}
