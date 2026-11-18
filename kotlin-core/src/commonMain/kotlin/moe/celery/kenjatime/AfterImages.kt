package moe.celery.kenjatime

/** Immutable sprite data only: history never retains a mutable actor/animation or collision boxes. */
internal data class CoreActorPose(
    val x: Int,val y: Int,val facingRight: Boolean,val definition: FighterDefinition,
    val frame: AirVisualFrame?,val action: Int,val element: Int,val elementTime: Int,val animTime: Long,
    val scaleX: Double,val scaleY: Double,val offsetX: Long,val offsetY: Long,
    val angleDraw: Boolean,val angle: Double,val priority: Int,val capturedAt: Long,
    val paletteRemaps: CorePaletteRemap
) {
    companion object {
        fun capture(actor: FightingCharacter,at: Long): CoreActorPose {
            val animation=actor.animation
            return CoreActorPose(actor.posX,actor.posY,actor.facingRight,actor.animationOwner.definition,
                animation?.visualFrame(),animation?.action?.number ?: -1,
                (animation?.index ?: 0)+1,animation?.tick ?: 0,animation?.remaining ?: 0,
                actor.drawScaleX,actor.drawScaleY,actor.displayOffsetX,actor.displayOffsetY,
                actor.angleDrawEnabled,actor.drawAngleDegrees,actor.spritePriority,at,actor.paletteEffects.remaps)
        }
    }
}
internal data class CoreAfterImageConfig(
    val duration: Int=1,val length: Int=20,val timeGap: Int=1,val frameGap: Int=4,
    val base: CorePaletteLayer=CorePaletteLayer(listOf(30,30,30),listOf(120,120,220),256,false),
    val progressive: CorePaletteLayer=CorePaletteLayer(listOf(10,10,25),listOf(.65*256,.65*256,.75*256),256,false),
    val blend: SpriteBlend=SpriteBlend.NORMAL
)
internal data class CoreAfterImageDraw(val pose: CoreActorPose,val index: Int,val priority: Long,
    val layers: List<CorePaletteLayer>,val blend: SpriteBlend)

/** MUGEN-style bounded ring sampling; called at 60 Hz, never from snapshot/paint. */
internal class CoreAfterImages(val config: CoreAfterImageConfig) {
    var duration=config.duration;private set
    var elapsed=0L;private set
    var records=0L;private set
    var restGap=0;private set
    private val history=ArrayList<CoreActorPose>(config.length)
    val stored: Int get()=history.size
    val active: Boolean get()=duration!=0 && config.length>0 &&
        (duration<0 || elapsed<config.timeGap.toLong()*config.length+duration-1)
    fun retime(time: Int) {duration=if(time==1)0 else time;elapsed=0}
    fun capture(actor: FightingCharacter,at: Long) {
        if(restGap==0) {
            history.add(0,CoreActorPose.capture(actor,at))
            if(history.size>config.length)history.removeAt(history.lastIndex)
            records++;restGap=config.timeGap
        }
        restGap--;elapsed++
    }
    fun draws(actor: FightingCharacter,global: CorePaletteLayer?): List<CoreAfterImageDraw> {
        if(!active)return emptyList()
        // MUGEN's length-slot ring selects one slot closer than IKEMEN's newer length+1 ring.
        val count=minOf(records,(config.length-1).toLong()).toInt()/config.frameGap
        return (0 until count).mapNotNull {index ->
            val distance=(index+1)*config.frameGap
            if(duration>0 && elapsed/config.timeGap-distance >= (duration-2)/config.timeGap+1)return@mapNotNull null
            val pose=history.getOrNull(distance-1)?.takeIf {it.frame!=null} ?: return@mapNotNull null
            val layers=listOfNotNull(config.base.takeUnless {it.identity},
                config.progressive.copy(repeat=index).takeUnless {it.identity},global)
            CoreAfterImageDraw(pose,index,minOf(pose.priority.toLong()-2,actor.spritePriority.toLong()-2)-index,layers,config.blend)
        }
    }
    fun json()="{\"time\":$duration,\"elapsed\":$elapsed,\"records\":$records,\"stored\":$stored,"+
        "\"length\":${config.length},\"timegap\":${config.timeGap},\"framegap\":${config.frameGap},\"restgap\":$restGap}"
    companion object {
        fun finishTick(fight: DeterministicFight) {
            for(actor in listOf(fight.p1,fight.p2)+fight.entities.helpers.map {it.actor}) {
                val trail=actor.afterImages ?: continue
                if(actor.destroyed || !trail.active)actor.afterImages=null
                else if (!actor.globalPauseThisTick) trail.capture(actor,fight.frame+1)
            }
        }
        fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
            try {
                val args=controller.params
                fun number(raw: String)=CoreExpression.number(raw,actor,errors) ?: throw IllegalArgumentException("Invalid expression")
                fun integer(raw: String,low: Int,high: Int): Int {
                    val n=number(raw);require(n in low.toDouble()..high.toDouble()) {"AfterImage parameter out of range"};return n.toInt()
                }
                fun int(key: String,fallback: Int,low: Int,high: Int)=args[key]?.let {integer(it,low,high)} ?: fallback
                val common=setOf("type","persistent","ignorehitpause")
                if(controller.type.equals("afterimagetime",true)) {
                    require(args.keys.all {it in common+setOf("time","value")}) {"Unsupported AfterImageTime parameter"}
                    val raw=args["time"] ?: args["value"] ?: throw IllegalArgumentException("Missing time/value")
                    val time=integer(raw,-1,36000)
                    actor.afterImages?.takeIf {it.active}?.let {it.retime(time);if(!it.active)actor.afterImages=null}
                    return
                }
                require(args.keys.all {it in common+setOf("time","length","timegap","framegap","trans","palcolor","palinvertall",
                    "palbright","palcontrast","palpostbright","paladd","palmul")}) {"Unsupported AfterImage parameter"}
                fun triple(key: String,fallback: List<Int>,high: Int): List<Int> {
                    val parts=args[key]?.let(CnsArguments::split) ?: return fallback
                    require(parts.size==3) {"$key requires three components"};return parts.map {integer(it,0,high)}
                }
                val duration=int("time",1,-1,36000);val length=int("length",20,0,60)
                val gap=int("timegap",1,1,32767);val frameGap=int("framegap",4,1,32767)
                val color=int("palcolor",256,0,256)
                val invert=args["palinvertall"]?.let {number(it)!=0.0} ?: false
                val bright=triple("palbright",listOf(30,30,30),255)
                val contrast=triple("palcontrast",listOf(120,120,220),65536)
                val post=triple("palpostbright",listOf(0,0,0),255)
                val add=triple("paladd",listOf(10,10,25),255)
                val mul=args["palmul"]?.let {raw ->
                    val parts=CnsArguments.split(raw);require(parts.size==3) {"palmul requires three components"}
                    parts.map {val n=number(it);require(n in 0.0..64.0) {"palmul out of range"};n*256}
                } ?: listOf(.65*256,.65*256,.75*256)
                val mode=args["trans"]?.trim()?.removeSurrounding("\"")?.lowercase() ?: "none"
                val blend=when(mode) {"none"->SpriteBlend.NORMAL;"add"->SpriteBlend.ADD;"add1"->SpriteBlend("add",256,128);"sub"->SpriteBlend.SUB
                    else->throw IllegalArgumentException("Unsupported AfterImage trans")}
                val config=CoreAfterImageConfig(duration,length,gap,frameGap,CorePaletteLayer(bright,contrast,color,invert,post),
                    CorePaletteLayer(add,mul,256,false),blend)
                actor.afterImages=if(duration==0 || length==0)null else CoreAfterImages(config)
            }catch(e: IllegalArgumentException) {errors.add("Invalid ${controller.type}: ${e.message}")}
        }
    }
}
