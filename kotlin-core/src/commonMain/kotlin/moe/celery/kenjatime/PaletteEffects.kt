package moe.celery.kenjatime

import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.floor
import kotlin.math.sin

internal data class CorePaletteLayer(val add: List<Int>,val mul: List<Number>,val color: Int,val invert: Boolean,
    val post: List<Int> = listOf(0,0,0),val repeat: Int=1) {
    val identity: Boolean get()=repeat==0 || (add.all {it==0} && mul.all {it.toDouble()==256.0} && color==256 && !invert && post.all {it==0})
    fun json()="{\"add\":[${add.joinToString(",")}],\"mul\":[${mul.joinToString(",")}],\"color\":$color,\"invert\":$invert"+
        (if(post.any {it!=0})",\"post\":[${post.joinToString(",")}]" else "")+
        (if(repeat!=1)",\"repeat\":$repeat" else "")+"}"
}
data class CorePaletteEffect(val remaining: Int,val add: List<Int>,val mul: List<Int>,
    val color: Int,val invert: Boolean,val amplitude: List<Int>,val period: Int,val age: Long=0) {
    internal fun resolved(): CorePaletteLayer {
        val wave=if(period==0)0.0 else sin(2*PI*(age%abs(period)).toDouble()/period)
        return CorePaletteLayer(add.indices.map {add[it]+(amplitude[it]*wave).toInt()},mul,color,invert)
    }

    companion object {
        internal fun read(args: Map<String, String?>, number: (String) -> Double): CorePaletteEffect {
            fun integer(raw: String, low: Int, high: Int): Int {
                val value = number(raw)
                require(value in low.toDouble()..high.toDouble()) { "Palette parameter out of range" }
                return value.toInt()
            }
            fun vector(key: String, default: List<Int>, low: Int, high: Int): List<Int> {
                val parts = args[key]?.let(CnsArguments::split) ?: return default
                require(parts.size == default.size) { "$key requires ${default.size} components" }
                return parts.map { integer(it, low, high) }
            }
            val time = args["time"]?.let { integer(it, -1, 36000) } ?: 0
            val add = vector("add", listOf(0, 0, 0), -100000, 100000)
            val mul = vector("mul", listOf(256, 256, 256), 0, 65536)
            val color = args["color"]?.let { integer(it, 0, 256) } ?: 256
            val invert = args["invertall"]?.let { number(it) != 0.0 } ?: false
            val sine = args["sinadd"]?.let(CnsArguments::split)
            require(sine == null || sine.size == 4) { "sinadd requires four components" }
            val amplitude = sine?.take(3)?.map { integer(it, -100000, 100000) } ?: listOf(0, 0, 0)
            val period = sine?.get(3)?.let { integer(it, -36000, 36000) } ?: 0
            return CorePaletteEffect(time, add, mul, color, invert, amplitude, period)
        }

        internal fun captureImpact(
            args: Map<String, String>, actor: FightingCharacter, errors: MutableSet<String>,
        ): CorePaletteEffect? {
            val time = args["palfx.time"] ?: return null
            val params = mapOf("time" to time, "add" to args["palfx.add"], "mul" to args["palfx.mul"])
            return try {
                read(params) { raw ->
                    CoreExpression.contactNumber(raw, actor, errors) ?: throw IllegalArgumentException("Invalid expression")
                }.takeUnless { it.remaining == 0 }
            } catch (e: IllegalArgumentException) {
                errors.add("Invalid impact PalFX: ${e.message}")
                null
            }
        }
    }
}
/** Shared palette families age once per fight tick, independently of actor count or drawing. */
internal class CorePaletteEffects {
    var remaps: CorePaletteRemap = emptyMap()
    fun copyRemaps() = CorePaletteEffects().also { it.remaps = remaps }
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
        val groups=linkedSetOf<CorePaletteEffects>()
        val pauses = fight.pauses
        if (!pauses.backgroundFrozen) groups.addAll(listOf(all, background))
        for (actor in listOf(fight.p1, fight.p2)) if (!pauses.frozen(actor)) groups.add(actor.paletteEffects)
        for(h in fight.entities.helpers) if (!pauses.frozen(h.actor)) groups.add(h.actor.paletteEffects)
        for(p in fight.entities.projectiles) if (!pauses.entityFrozen(p.pauseMoves)) groups.add(p.paletteEffects)
        for(e in fight.effects.all) if (!pauses.entityFrozen(e.config.pauseMoves)) groups.add(e.paletteEffects)
        for(group in groups)group.beginTick()
    }
    fun layers(group: CorePaletteEffects): List<CorePaletteLayer> = listOfNotNull(group.layer(),all.layer())
    fun backgroundLayers(): List<CorePaletteLayer> = listOfNotNull(background.layer(),all.layer())
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            require(args.keys.all {it in setOf("type","persistent","ignorehitpause","time","add","mul","color","invertall","sinadd")}) {"Unsupported palette parameter"}
            val next = CorePaletteEffect.read(args) { raw ->
                CoreExpression.number(raw, actor, errors) ?: throw IllegalArgumentException("Invalid expression")
            }
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
              repeat(layer.repeat) {
                val grey=.299*v[0]+.587*v[1]+.114*v[2]
                v=v.indices.map {i ->
                    var n=if(layer.color==256)v[i] else grey+(v[i]-grey)*layer.color/256
                    if(layer.invert)n=255-n
                    ((n+layer.add[i])*layer.mul[i].toDouble()/256+layer.post[i]).coerceIn(0.0,255.0)
                }
              }
            }
            return v.map {floor(it+1e-9).toInt().coerceIn(0,255)}
        }
    }
}
