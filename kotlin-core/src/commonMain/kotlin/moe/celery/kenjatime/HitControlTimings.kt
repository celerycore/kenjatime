package moe.celery.kenjatime

/** Captured CNS thresholds, not countdown clocks. Signed values allow immediate conditions. */
internal data class CoreHitControlTimings(val groundSlide: Int,val guardSlide: Int,val guardControl: Int,val airGuardControl: Int) {
    companion object {
        fun parse(args: Map<String,String>,actor: FightingCharacter,guardHitTime: Int,
            errors: MutableSet<String>,projectile: Boolean=false): CoreHitControlTimings? = try {
            fun value(key: String,default: Int): Int {
                val raw=args[key] ?: (if(projectile)args["proj$key"] else null) ?: return default
                val number=CoreExpression.number(raw,actor,errors)
                    ?: throw IllegalArgumentException("Invalid $key expression")
                require(number in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) { "$key out of range" }
                return number.toInt()
            }
            val groundSlide=value("ground.slidetime",0)
            val guardSlide=value("guard.slidetime",guardHitTime)
            val guardControl=value("guard.ctrltime",guardSlide)
            CoreHitControlTimings(groundSlide,guardSlide,guardControl,value("airguard.ctrltime",guardControl))
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid hit control timing: ${e.message}");null
        }
    }
}
