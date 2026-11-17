package moe.celery.kenjatime

import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.floor
import kotlin.math.sin

internal data class CorePaletteLayer(val add: List<Int>,val mul: List<Int>,val color: Int,val invert: Boolean) {
    val identity: Boolean get()=add.all {it==0} && mul.all {it==256} && color==256 && !invert
    fun json()="{\"add\":[${add.joinToString(",")}],\"mul\":[${mul.joinToString(",")}],\"color\":$color,\"invert\":$invert}"
}
internal data class CorePaletteEffect(val remaining: Int,val add: List<Int>,val mul: List<Int>,
    val color: Int,val invert: Boolean,val amplitude: List<Int>,val period: Int,val age: Long=0) {
    fun resolved(): CorePaletteLayer {
        val wave=if(period==0)0.0 else sin(2*PI*(age%abs(period)).toDouble()/period)
        return CorePaletteLayer(add.indices.map {add[it]+(amplitude[it]*wave).toInt()},mul,color,invert)
    }
}
/** Shared palette families age once per fight tick, independently of actor count or drawing. */
internal class CorePaletteEffects {
    var effect: CorePaletteEffect?=null;private set
    fun beginTick() { effect=effect?.let {if(it.remaining==1)null else it.copy(remaining=if(it.remaining<0)-1 else it.remaining-1,age=it.age+1)} }
    fun replace(next: CorePaletteEffect) {effect=next.takeUnless {it.remaining==0}}
    fun layer(): CorePaletteLayer?=effect?.resolved()?.takeUnless {it.identity}
    fun json(): String {
        val e=effect ?: return "null"
        return "{\"remaining\":${e.remaining},\"age\":${e.age},\"period\":${e.period},\"layer\":${e.resolved().json()}}"
    }
}
internal class CoreFightPalettes(private val fight: DeterministicFight) {
    val all=CorePaletteEffects();val background=CorePaletteEffects()
    fun beginTick() {
        val groups=linkedSetOf(all,background,fight.p1.paletteEffects,fight.p2.paletteEffects)
        for(h in fight.entities.helpers)groups.add(h.actor.paletteEffects)
        for(p in fight.entities.projectiles)groups.add(p.paletteEffects)
        for(e in fight.effects.all)groups.add(e.paletteEffects)
        for(group in groups)group.beginTick()
    }
    fun layers(group: CorePaletteEffects): List<CorePaletteLayer> = listOfNotNull(group.layer(),all.layer())
    fun backgroundLayers(): List<CorePaletteLayer> = listOfNotNull(background.layer(),all.layer())
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            require(args.keys.all {it in setOf("type","persistent","ignorehitpause","time","add","mul","color","invertall","sinadd")}) {"Unsupported palette parameter"}
            fun number(raw: String)=CoreExpression.number(raw,actor,errors) ?: throw IllegalArgumentException("Invalid expression")
            fun integer(raw: String,low: Int,high: Int): Int {
                val n=number(raw);require(n in low.toDouble()..high.toDouble()) {"Palette parameter out of range"};return n.toInt()
            }
            fun vector(key: String,default: List<Int>,low: Int,high: Int): List<Int> {
                val parts=args[key]?.let(CnsArguments::split) ?: return default
                require(parts.size==default.size) {"$key requires ${default.size} components"}
                return parts.map {integer(it,low,high)}
            }
            val time=args["time"]?.let {integer(it,-1,36000)} ?: 0
            val add=vector("add",listOf(0,0,0),-100000,100000)
            val mul=vector("mul",listOf(256,256,256),0,65536)
            val color=args["color"]?.let {integer(it,0,256)} ?: 256
            val invert=args["invertall"]?.let {number(it)!=0.0} ?: false
            val sine=args["sinadd"]?.let(CnsArguments::split)
            require(sine==null || sine.size==4) {"sinadd requires four components"}
            val amplitude=sine?.take(3)?.map {integer(it,-100000,100000)} ?: listOf(0,0,0)
            val period=sine?.get(3)?.let {integer(it,-36000,36000)} ?: 0
            val next=CorePaletteEffect(time,add,mul,color,invert,amplitude,period)
            when(controller.type.lowercase()) {
                "allpalfx" -> all.replace(next)
                "bgpalfx" -> background.replace(next)
                else -> if(actor.ownPalette)actor.paletteEffects.replace(next)
            }
        }catch(e: IllegalArgumentException) {errors.add("Invalid ${controller.type}: ${e.message}")}
    }
    fun colors(): String {
        val layers=backgroundLayers()
        val values=linkedMapOf("backdrop" to listOf(16,35,56),"ground" to listOf(24,62,75),
            "grid" to listOf(70,112,119),"floor" to listOf(83,123,117),"hud" to listOf(11,21,33),
            "life1" to listOf(149,215,143),"life2" to listOf(128,187,240),"names" to listOf(233,242,250))
        fight.environment.color?.let {values["environment"]=listOf(it.red,it.green,it.blue)}
        return values.entries.joinToString(prefix="{",postfix="}",separator=",") {"\"${it.key}\":[${rgb(it.value,layers).joinToString(",")}]"}
    }
    companion object {
        fun rgb(source: List<Int>,layers: List<CorePaletteLayer>): List<Int> {
            var v=source.map {it.toDouble()}
            for(layer in layers) {
                val grey=.299*v[0]+.587*v[1]+.114*v[2]
                v=v.indices.map {i ->
                    var n=if(layer.color==256)v[i] else grey+(v[i]-grey)*layer.color/256
                    if(layer.invert)n=255-n
                    ((n+layer.add[i])*layer.mul[i]/256).coerceIn(0.0,255.0)
                }
            }
            return v.map {floor(it+1e-9).toInt().coerceIn(0,255)}
        }
    }
}
