package moe.celery.kenjatime

/** Immutable authored parameters, separate from the per-effect clock/motion. */
data class ExplodConfig(
    val animation: Int, val postype: String = "p1",
    val offsetX: Int = 0, val offsetY: Int = 0,
    val velocityX: Int = 0, val velocityY: Int = 0,
    val accelerationX: Int = 0, val accelerationY: Int = 0,
    val bindTime: Int = 1, val removeTime: Int = -2,
    val facing: Int = 1, val verticalFacing: Int = 1,
    val scaleX: Double = 1.0, val scaleY: Double = 1.0,
    val priority: Int = 0, val onTop: Boolean = false,
    val removeOnHit: Boolean = false, val ignoreHitPause: Boolean = true
)

/** Explods are visual entities. They never participate in Clsn contacts. */
class CoreExplod internal constructor(
    val owner: FightingCharacter, val id: Int, val sequence: Long,
    config: ExplodConfig, val bornAt: Long, action: AirAction
) {
    var config = config; internal set
    var animation = AirAnimationPlayer(action); internal set
    internal var animationResetAt = bornAt
    var x = 0; internal set
    var y = 0; internal set
    var velocityX = config.velocityX; internal set
    var velocityY = config.velocityY; internal set
    var age = 0L; internal set
    var bindLeft = config.bindTime; internal set
    var facingRight = config.facing > 0; internal set
    internal var anchor: FightingCharacter? = null
    internal var initialPosition = true
    val drawPriority: Long get() = if(config.onTop) Int.MAX_VALUE.toLong()+1 else config.priority.toLong()
}

class CoreExplods(private val fight: DeterministicFight) {
    private val effects = mutableListOf<CoreExplod>()
    val all: List<CoreExplod> get() = effects
    var maximum = 512
    private var nextSequence = 1L
    fun count(owner: FightingCharacter, id: Int? = null): Int =
        effects.count { it.owner === owner && (id == null || it.id == id) }
    fun remove(owner: FightingCharacter, id: Int = -1) {
        effects.removeAll { it.owner === owner && (id == -1 || it.id == id) }
    }
    fun onHit(owner: FightingCharacter) {
        effects.removeAll { it.owner === owner && it.config.removeOnHit }
    }
    private fun bounded(value: Long) = value.coerceIn(Int.MIN_VALUE.toLong(),Int.MAX_VALUE.toLong()).toInt()
    private fun position(effect: CoreExplod) {
        val c=effect.config
        effect.anchor=when(c.postype) { "p1" -> effect.owner; "p2" -> effect.owner.opponent; else -> null }
        require(c.postype != "p2" || effect.anchor?.destroyed == false) { "Explod P2 is unavailable" }
        val anchor=effect.anchor
        effect.facingRight=if(anchor == null) c.facing > 0 else (c.facing > 0) == anchor.facingRight
        effect.x=bounded((anchor?.posX?.toLong() ?: 0L)+c.offsetX.toLong()*if(anchor?.facingRight != false)1 else -1)
        effect.y=bounded((anchor?.posY?.toLong() ?: 0L)+c.offsetY)
        effect.bindLeft=if(anchor == null)0 else c.bindTime
        effect.initialPosition=anchor != null
    }
    private fun config(actor: FightingCharacter, args: Map<String,String>, old: ExplodConfig?): ExplodConfig {
        fun number(raw: String): Double = CoreExpression.number(raw,actor,fight.issues)
            ?: throw IllegalArgumentException("Invalid Explod expression: $raw")
        fun integer(key: String, fallback: Int) = args[key]?.let { number(it).toInt() } ?: fallback
        fun vector(key: String, fallback: Pair<Double,Double>): Pair<Double,Double> {
            val raw=args[key] ?: return fallback
            val components=CnsArguments.split(raw)
            require(components.size <= 2) { "Explod $key requires at most two components" }
            return number(components[0]) to number(components.getOrNull(1) ?: if(key == "scale")"1" else "0")
        }
        fun spatial(key: String, x: Int, y: Int): Pair<Int,Int> {
            if(key !in args)return x to y
            val local=vector(key,0.0 to 0.0)
            return actor.coordinates.toWorld(local.first) to actor.coordinates.toWorld(local.second)
        }
        args["anim"]?.let {
            require(!Regex("(?i)^f(?=\\s|[\\d(+.-])").containsMatchIn(it.trim())) {
                "Common F animation sources are not implemented for Explod"
            }
        }
        val anim=args["anim"]?.let { number(it).toInt() } ?: old?.animation
            ?: throw IllegalArgumentException("Explod requires anim")
        require(actor.definition.animations[anim]?.frames?.isNotEmpty() == true) { "Explod animation missing: $anim" }
        val base=old ?: ExplodConfig(anim,postype=actor.definition.defaultExplodPostype)
        val postype=args["postype"]?.trim()?.trim('"','\'')?.lowercase() ?: base.postype
        require(postype in setOf("p1","p2","none")) { "Unsupported Explod postype: $postype" }
        require(postype != "p2" || actor.opponent?.destroyed == false) { "Explod P2 is unavailable" }
        val pos=spatial("pos",base.offsetX,base.offsetY)
        val velocityKey=if("vel" in args) "vel" else "velocity"
        require(!("vel" in args && "velocity" in args)) { "Explod has both vel and velocity" }
        val velocity=spatial(velocityKey,base.velocityX,base.velocityY)
        val accel=spatial("accel",base.accelerationX,base.accelerationY)
        val scale=vector("scale",base.scaleX to base.scaleY)
        require(scale.first in 0.0..64.0 && scale.second in 0.0..64.0) { "Explod scale is outside 0..64" }
        val bind=integer("bindtime",base.bindTime)
        val remove=integer("removetime",base.removeTime)
        require(bind >= -1 && remove >= -2) { "Invalid Explod bindtime/removetime" }
        val facing=integer("facing",base.facing)
        val vertical=integer("vfacing",base.verticalFacing)
        require(facing in listOf(-1,1) && vertical in listOf(-1,1)) { "Explod facing/vfacing must be -1 or 1" }
        return base.copy(animation=anim,postype=postype,offsetX=pos.first,offsetY=pos.second,
            velocityX=velocity.first,velocityY=velocity.second,
            accelerationX=accel.first,accelerationY=accel.second,
            bindTime=bind,removeTime=remove,facing=facing,verticalFacing=vertical,
            scaleX=scale.first,scaleY=scale.second,priority=integer("sprpriority",base.priority),
            onTop=integer("ontop",if(base.onTop)1 else 0) != 0,
            removeOnHit=integer("removeongethit",if(base.removeOnHit)1 else 0) != 0,
            ignoreHitPause=integer("ignorehitpause",if(base.ignoreHitPause)1 else 0) != 0)
    }
    fun execute(actor: FightingCharacter, controller: StateController, source: FightingCharacter) {
        try {
            require(actor.world === fight && (source.world == null || source.world === fight)) {
                "Explod owner/source belongs to another fight"
            }
            val type=controller.type.lowercase()
            val args=controller.params
            val common=setOf("type","persistent","ignorehitpause","id")
            val allowed=when(type) {
                "removeexplod" -> common
                "explodbindtime" -> common+setOf("time","value")
                else -> common+setOf("anim","postype","pos","vel","velocity","accel","bindtime","removetime",
                    "facing","vfacing","scale","sprpriority","ontop","removeongethit")
            }
            require(args.keys.all { it in allowed }) { "Unsupported Explod parameter: ${args.keys.first { it !in allowed }}" }
            fun integer(raw: String) = CoreExpression.number(raw,actor,fight.issues)?.toInt()
                ?: throw IllegalArgumentException("Invalid Explod expression: $raw")
            val id=args["id"]?.let(::integer) ?: -1
            if(type == "removeexplod") { remove(actor,id); return }
            val matches=effects.filter { it.owner === actor && (id == -1 || it.id == id) }
            if(type == "explodbindtime") {
                require(!("time" in args && "value" in args)) { "ExplodBindTime has both time and value" }
                val time=integer(args["time"] ?: args["value"] ?: "1")
                require(time >= -1) { "Invalid ExplodBindTime duration" }
                for(e in matches) e.bindLeft=if(e.anchor == null)0 else time
                return
            }
            if(type == "modifyexplod") {
                // No selected effect changes until every candidate validates.
                val changes=matches.map { it to config(actor,args,it.config) }
                for((e,c) in changes) {
                    e.config=c
                    if("anim" in args) {
                        e.animation=AirAnimationPlayer(actor.definition.animations.getValue(c.animation))
                        e.animationResetAt=fight.frame
                    }
                    if("vel" in args || "velocity" in args) { e.velocityX=c.velocityX; e.velocityY=c.velocityY }
                    if("pos" in args || "postype" in args) position(e)
                    else {
                        if("bindtime" in args) e.bindLeft=if(e.anchor == null)0 else c.bindTime
                        if("facing" in args) e.facingRight=if(e.anchor == null)c.facing > 0 else (c.facing > 0) == e.anchor!!.facingRight
                    }
                }
            } else {
                val c=config(actor,args,null)
                require(effects.size < maximum.coerceIn(0,512)) { "Explod resource limit exceeded" }
                val e=CoreExplod(actor,id,nextSequence++,c,fight.frame,actor.definition.animations.getValue(c.animation))
                position(e)
                effects.add(e)
            }
        } catch(e: IllegalArgumentException) {
            fight.issues.add("Invalid ${controller.type}: ${e.message}")
        }
    }
    /** One simulation update per fight tick; queries and skipped renders do
     * not participate. Birth frames show the original first AIR element. */
    fun advance() {
        if(effects.isEmpty()) return
        val iterator=effects.iterator()
        while(iterator.hasNext()) {
            val e=iterator.next()
            val c=e.config
            if(c.removeTime == 0) { iterator.remove(); continue }
            val frozen=e.owner.hitPauseThisTick && !c.ignoreHitPause && !e.owner.destroyed
            val born=e.bornAt == fight.frame
            var anchor=e.anchor
            if(anchor?.destroyed == true) { e.anchor=null; e.bindLeft=0; e.initialPosition=false; anchor=null }
            val bound=anchor != null && (e.initialPosition || e.bindLeft != 0)
            if(bound) {
                e.x=bounded(anchor.posX.toLong()+c.offsetX.toLong()*if(anchor.facingRight)1 else -1)
                e.y=bounded(anchor.posY.toLong()+c.offsetY)
                e.facingRight=(c.facing > 0) == anchor.facingRight
            }
            if(frozen) continue
            if(!born) {
                if(!bound) {
                    e.x=bounded(e.x.toLong()+e.velocityX.toLong()*if(e.facingRight)1 else -1)
                    e.y=bounded(e.y.toLong()+e.velocityY)
                }
                e.velocityX=bounded(e.velocityX.toLong()+c.accelerationX)
                e.velocityY=bounded(e.velocityY.toLong()+c.accelerationY)
                e.age++
                if(e.animationResetAt != fight.frame)e.animation.advance()
            }
            e.initialPosition=false
            if(e.bindLeft > 0)e.bindLeft--
            if(c.removeTime > 0 && e.age >= c.removeTime || c.removeTime == -2 && e.animation.finished)
                iterator.remove()
        }
    }
}
