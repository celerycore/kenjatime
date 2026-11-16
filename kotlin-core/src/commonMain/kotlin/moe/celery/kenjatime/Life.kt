package moe.celery.kenjatime

import kotlin.math.abs
import kotlin.math.floor

/** Health controllers do not create a new hit or alter the victim's state bank. */
internal object CoreLifeControllers {
    private fun delta(value: Int,target: FightingCharacter,absolute: Boolean,targetControl: Boolean): Long {
        if(value == 0)return 0
        val scaled=if(absolute)value.toDouble() else value.toDouble()*100/target.definition.defence*
            (if(targetControl)target.defenceMultiplier else 1.0)
        if(scaled == 0.0)return 0
        // Symmetric half-away rounding. Tiny damage retains a one-point minimum;
        // tiny healing can round to zero. Keep the wide result until life clamping.
        val magnitude=floor(abs(scaled)+0.5).coerceAtMost(Int.MAX_VALUE.toDouble()).toLong()
        return if(value < 0)-magnitude.coerceAtLeast(1) else magnitude
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val type=controller.type.lowercase()
            val args=controller.params
            val allowed=setOf("type","value","persistent","ignorehitpause")+
                (if(type != "lifeset")setOf("kill","absolute") else emptySet())+
                (if(type == "targetlifeadd")setOf("id") else emptySet())
            require(args.keys.all { it in allowed }) { "Unsupported life-control parameter" }
            fun number(key: String,fallback: Double?=null): Double {
                val raw=args[key] ?: return fallback ?: throw IllegalArgumentException("Missing $key")
                return CoreExpression.number(raw,actor,errors)
                    ?: throw IllegalArgumentException("Invalid $key expression")
            }
            fun integer(key: String,fallback: Int?=null): Int {
                val value=number(key,fallback?.toDouble())
                require(value in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) { "$key out of range" }
                return value.toInt()
            }
            // Evaluate the entire request before applying it to any captured actor.
            val value=integer("value")
            val kill=if(type == "lifeset")true else number("kill",1.0) != 0.0
            val absolute=if(type == "lifeset")true else number("absolute",0.0) != 0.0
            val selected=if(type == "targetlifeadd")actor.targets(integer("id",-1)) else listOf(actor)
            for(target in selected) {
                if(type == "lifeset")target.life=value.coerceIn(0,target.definition.maxLife)
                else {
                    val minimum=if(!kill && target.life > 0)1L else 0L
                    target.life=(target.life.toLong()+delta(value,target,absolute,type == "targetlifeadd"))
                        .coerceIn(minimum,target.definition.maxLife.toLong()).toInt()
                }
            }
        }catch(e: IllegalArgumentException) {
            errors.add("Invalid ${controller.type}: ${e.message}")
        }
    }
}
