package moe.celery.kenjatime

import kotlin.math.PI
import kotlin.math.sin

internal data class CoreEnvironmentColor(val red: Int,val green: Int,val blue: Int,val remaining: Int,val under: Boolean)
internal data class CoreEnvironmentShake(val remaining: Int,val frequency: Double,val amplitude256: Int,val phase: Double,val age: Int=0)

/** Visual clocks advance once per fight tick, independently of drawing and actor hitpause. */
internal class CoreEnvironmentEffects {
    var color: CoreEnvironmentColor?=null; private set
    var shake: CoreEnvironmentShake?=null; private set
    val offsetY: Double get() {
        val s=shake ?: return 0.0
        val value=-s.amplitude256.toDouble()/Fixed.ONE*sin(((s.phase%360+s.frequency*s.age)%360)*PI/180)
        return if(value==0.0)0.0 else value
    }
    fun beginTick() {
        color=color?.let { if(it.remaining<0)it else if(it.remaining<=1)null else it.copy(remaining=it.remaining-1) }
        shake=shake?.let { if(it.remaining<=1)null else it.copy(remaining=it.remaining-1,age=it.age+1) }
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params;val isColor=controller.type.equals("envcolor",true)
            val allowed=setOf("type","persistent","ignorehitpause","time")+
                if(isColor)setOf("value","under") else setOf("freq","ampl","phase")
            require(args.keys.all{it in allowed}) { "Unsupported environment parameter" }
            fun number(raw: String)=CoreExpression.number(raw,actor,errors) ?: throw IllegalArgumentException("Invalid expression")
            fun bounded(raw: String,low: Double,high: Double): Double {
                val n=number(raw);require(n in low..high) { "Environment parameter out of range" };return n
            }
            if(isColor) {
                val parts=args["value"]?.let { CnsArguments.split(it) } ?: listOf("255","255","255")
                require(parts.size==3) { "EnvColor requires three color components" }
                val rgb=parts.map { bounded(it,0.0,255.0).toInt() }
                val duration=args["time"]?.let { bounded(it,-1.0,36000.0).toInt() } ?: 1
                val under=args["under"]?.let { number(it)!=0.0 } ?: false
                val next=CoreEnvironmentColor(rgb[0],rgb[1],rgb[2],duration,under)
                color=next.takeUnless{duration==0}
            }else {
                val duration=bounded(args["time"] ?: throw IllegalArgumentException("Missing time"),0.0,36000.0).toInt()
                val frequency=args["freq"]?.let { bounded(it,0.0,180.0) } ?: 60.0
                val amplitude=args["ampl"]?.let { actor.coordinates.toWorld(bounded(it,-100000.0,100000.0).toInt().toDouble()) } ?: -4*Fixed.ONE
                val phase=args["phase"]?.let { bounded(it,-1000000.0,1000000.0) } ?: if(frequency>=90)90.0 else 0.0
                val next=CoreEnvironmentShake(duration,frequency,amplitude,phase)
                shake=next.takeUnless{duration==0}
            }
        }catch(e: IllegalArgumentException) { errors.add("Invalid ${controller.type}: ${e.message}") }
    }
    fun json(): String {
        val c=color;val s=shake
        val colorJson=if(c==null)"null" else "{\"red\":${c.red},\"green\":${c.green},\"blue\":${c.blue},\"remaining\":${c.remaining},\"under\":${c.under}}"
        val shakeJson=if(s==null)"null" else "{\"remaining\":${s.remaining},\"frequency\":${s.frequency},\"amplitude256\":${s.amplitude256},\"phase\":${s.phase},\"age\":${s.age}}"
        return "{\"color\":$colorJson,\"shake\":$shakeJson,\"offsetY\":$offsetY}"
    }
}
