package moe.celery.kenjatime

enum class HitAnimationType(val code: Int) {
    LIGHT(0),MEDIUM(1),HARD(2),BACK(3),UP(4),DIAGUP(5)
}

/** Static HitDef strings; selected reaction data stays independent of later AIR/state changes. */
internal data class CoreHitAnimations(val ground: HitAnimationType,val air: HitAnimationType,val fall: HitAnimationType) {
    companion object {
        fun parse(args: Map<String,String>,errors: MutableSet<String>): CoreHitAnimations? = try {
            fun type(key: String,default: HitAnimationType): HitAnimationType = args[key]?.let {
                when(it.trim().lowercase()) {
                    "light" -> HitAnimationType.LIGHT
                    "medium","med" -> HitAnimationType.MEDIUM
                    "hard" -> HitAnimationType.HARD
                    "back" -> HitAnimationType.BACK
                    "up" -> HitAnimationType.UP
                    "diagup" -> HitAnimationType.DIAGUP
                    else -> throw IllegalArgumentException("Invalid $key: $it")
                }
            } ?: default
            val ground=type("animtype",HitAnimationType.LIGHT)
            val air=type("air.animtype",ground)
            val fall=type("fall.animtype",if(air == HitAnimationType.UP)HitAnimationType.UP else HitAnimationType.BACK)
            CoreHitAnimations(ground,air,fall)
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid hit animation: ${e.message}");null
        }
        fun select(hit: HitDefinition,airborne: Boolean,falling: Boolean,velocityY: Int): HitAnimationType = when {
            falling -> hit.fallAnimationType
            airborne -> hit.airAnimationType
            hit.animationType.code >= HitAnimationType.BACK.code && velocityY == 0 -> HitAnimationType.HARD
            else -> hit.animationType
        }
    }
}
