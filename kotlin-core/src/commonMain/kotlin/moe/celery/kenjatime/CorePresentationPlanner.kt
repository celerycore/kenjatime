package moe.celery.kenjatime

import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/** Kotlin/Wasm owns visual planning and frame-skip policy. The host only
 * paints immutable commands on Canvas/WebGL and decodes user-owned SFF art.
 *
 * Presentation is read-only. In particular, sprite counts, camera tracking,
 * viewport projection and skipped draws can NEVER modify a fighter, hitbox,
 * state, command buffer, round timer or the authoritative 60 Hz fight tick.
 */
object CorePresentationPlanner {
    const val WIDTH = 960
    const val HEIGHT = 540
    private const val FLOOR = 435.0
    private const val HORIZONTAL_SCALE = 1.4
    private const val VERTICAL_SCALE = 1.1

    /** The only source of adaptive visible-frame cadence. In debt, prefer
     * a complete Kotlin 60 Hz simulation over displaying duplicate snapshots.
     * This is a presentation target and never changes fight.step cadence.
     */
    fun targetFps(backlog: Long): Int = when {
        backlog >= 12L -> 12
        backlog >= 5L -> 20
        backlog >= 2L -> 30
        else -> 60
    }
    fun pixelX(x256: Int, camera: MugenCamera?): Double {
        val world = Fixed.pixels(x256)
        return WIDTH * 0.5 + (world - (camera?.x ?: 0.0)) *
            HORIZONTAL_SCALE * (camera?.zoom ?: 1.0)
    }
    fun pixelY(y256: Int, camera: MugenCamera?): Double {
        val world = Fixed.pixels(y256)
        return FLOOR + (world - (camera?.y ?: 0.0)) *
            VERTICAL_SCALE * (camera?.zoom ?: 1.0)
    }
    fun healthBarWidth(life: Int, maxLife: Int, fullWidth: Int = 376): Int {
        if (maxLife <= 0 || fullWidth < 0) return 0
        return ((life.toDouble() / maxLife) * fullWidth)
            .coerceIn(0.0, fullWidth.toDouble()).toInt()
    }
    /** Allocate one JSON document per *presented frame*, never per fight
     * tick. Kotlin owns the roster/actor state and camera projection. */
    fun snapshot(fight: DeterministicFight, backlog: Long): String {
        val camera = fight.camera
        val stageOffsetY=fight.environment.offsetY*VERTICAL_SCALE*(camera?.zoom ?: 1.0)
        val json = StringBuilder(2048)
        json.append("{\"frame\":").append(fight.frame)
            .append(",\"roundNumber\":").append(fight.roundNumber)
            .append(",\"targetFps\":").append(targetFps(backlog))
            .append(",\"backlog\":").append(backlog.coerceAtLeast(0))
            .append(",\"cameraZoom\":").append(camera?.zoom ?: 1.0)
            .append(",\"cameraX\":").append(camera?.x ?: 0.0)
            .append(",\"cameraY\":").append(camera?.y ?: 0.0)
            .append(",\"stageOffsetY\":").append(stageOffsetY)
            .append(",\"environment\":").append(fight.environment.json())
            .append(",\"pause\":").append(fight.pauses.json())
            .append(",\"paletteColors\":").append(fight.palettes.colors())
            .append(",\"helpers\":").append(fight.entities.helpers.size)
            .append(",\"projectiles\":").append(fight.entities.projectiles.size)
            .append(",\"explods\":").append(fight.effects.all.size)
            .append(",\"health\":[")
            .append(healthBarWidth(fight.p1.life,fight.p1.definition.maxLife))
            .append(',').append(healthBarWidth(fight.p2.life,fight.p2.definition.maxLife))
            .append("],\"draws\":[")
        fun draw(side: Int, kind: String, x256: Int, y256: Int,
                 facingRight: Boolean, action: AirAnimationPlayer?,
                 definition: FighterDefinition, life: Int, effect: CoreExplod? = null,projectile: CoreProjectile? = null,priority: Long = 0,actor: FightingCharacter? = null,
                 pose: CoreActorPose?=actor?.let {CoreActorPose.capture(it,fight.frame)},trail: CoreAfterImageDraw?=null,ownerId: Int=0,commonScale: Double?=null) {
            if(fight.environment.color?.under == false && effect?.config?.onTop != true && kind != "superpause")return
            val frame = if(pose!=null)pose.frame else action?.visualFrame()
            val blend=trail?.blend ?: actor?.drawBlend ?: frame?.blend ?: SpriteBlend.NORMAL
            val face = if(facingRight) 1 else -1
            val zoom=camera?.zoom ?: 1.0
            val effectScaleX=effect?.config?.scaleX ?: 1.0
            val effectScaleY=effect?.config?.scaleY ?: 1.0
            val baseScaleX=commonScale?.times(effectScaleX) ?: definition.coordinates.scale*(projectile?.scaleX ?:
                (effectScaleX*if(effect == null)definition.xScale.toDouble()/Fixed.ONE else 1.0))*(pose?.scaleX ?: 1.0)
            val baseScaleY=commonScale?.times(effectScaleY) ?: definition.coordinates.scale*(projectile?.scaleY ?:
                (effectScaleY*if(effect == null)definition.yScale.toDouble()/Fixed.ONE else 1.0))*(pose?.scaleY ?: 1.0)
            val spriteScaleX = baseScaleX * (frame?.scaleX ?: 1.0)
            val spriteScaleY = baseScaleY * (frame?.scaleY ?: 1.0)
            val pixelScaleX=spriteScaleX*HORIZONTAL_SCALE*zoom
            val pixelScaleY=spriteScaleY*VERTICAL_SCALE*zoom
            // Rotate in canonical stage space, then project each pixel axis. This preserves
            // a rigid stage rotation despite the viewport's unequal X/Y pixel scales.
            val angleDrawRotation = if (pose?.angleDraw == true) (pose.angle % 360) * face else 0.0
            val rotation = angleDrawRotation + ((frame?.angle ?: 0.0) % 360) * face
            val radians=rotation*PI/180
            val c=cos(radians);val s=sin(radians)
            val vf=effect?.config?.verticalFacing ?: 1
            val offsetX=(frame?.offsetX ?: 0.0)*spriteScaleX*face
            val offsetY=(frame?.offsetY ?: 0.0)*spriteScaleY*vf
            val axisX=pixelX(x256,camera);val axisY=pixelY(y256,camera)+stageOffsetY
            val displayOffsetX=pose?.offsetX ?: 0L
            val displayOffsetY=pose?.offsetY ?: 0L
            // The AIR element angle rotates the sprite about its shifted axis.
            val shiftRadians = angleDrawRotation * PI / 180
            val shiftCos = cos(shiftRadians)
            val shiftSin = sin(shiftRadians)
            val drawX=axisX+(displayOffsetX.toDouble()/Fixed.ONE+shiftCos*offsetX+shiftSin*offsetY)*HORIZONTAL_SCALE*zoom
            val drawY=axisY+(displayOffsetY.toDouble()/Fixed.ONE-shiftSin*offsetX+shiftCos*offsetY)*VERTICAL_SCALE*zoom
            val flip=frame?.flip?.uppercase() ?: ""
            val flipX=if('H' in flip)-1 else 1
            val flipY=(if('V' in flip)-1 else 1)*vf
            fun cleanZero(value: Double)=if(value == 0.0)0.0 else value
            val matrixA=cleanZero(c*pixelScaleX*face*flipX)
            val matrixB=cleanZero(-s*spriteScaleX*VERTICAL_SCALE*zoom*face*flipX)
            val matrixC=cleanZero(s*spriteScaleY*HORIZONTAL_SCALE*zoom*flipY)
            val matrixD=cleanZero(c*pixelScaleY*flipY)
            val ownDefinition = if (side == 0) fight.p1.definition else fight.p2.definition
            val otherDefinition = if (side == 0) fight.p2.definition else fight.p1.definition
            val spriteSide = if (definition !== ownDefinition && definition === otherDefinition) 1 - side else side
            json.append("{\"side\":").append(side)
                .append(",\"kind\":\"").append(kind).append("\"")
                .append(",\"spriteSide\":").append(spriteSide)
                .append(",\"x\":").append(drawX)
                .append(",\"y\":").append(drawY)
                .append(",\"axisX\":").append(axisX)
                .append(",\"axisY\":").append(axisY)
                .append(",\"displayOffsetX256\":").append(displayOffsetX)
                .append(",\"displayOffsetY256\":").append(displayOffsetY)
                .append(",\"transformA\":").append(matrixA)
                .append(",\"transformB\":").append(matrixB)
                .append(",\"transformC\":").append(matrixC)
                .append(",\"transformD\":").append(matrixD)
                .append(",\"rotationDegrees\":").append(cleanZero(rotation))
                .append(",\"angleDraw\":").append(pose?.angleDraw == true)
                .append(",\"flipX\":").append(flipX)
                .append(",\"flipY\":").append(flipY)
                .append(",\"scale\":").append(camera?.zoom ?: 1.0)
                .append(",\"spriteScaleX\":").append(spriteScaleX)
                .append(",\"spriteScaleY\":").append(spriteScaleY)
                .append(",\"pixelScaleX\":").append(pixelScaleX)
                .append(",\"pixelScaleY\":").append(pixelScaleY)
                .append(",\"facing\":").append(if(facingRight) 1 else -1)
                .append(",\"action\":").append(pose?.action ?: action?.action?.number ?: -1)
                .append(",\"elem\":").append(pose?.element ?: ((action?.index ?: 0)+1))
                .append(",\"elemTime\":").append(pose?.elementTime ?: action?.tick ?: 0)
                .append(",\"animTime\":").append(pose?.animTime ?: action?.remaining ?: 0L)
                .append(",\"group\":").append(frame?.group ?: -1)
                .append(",\"number\":").append(frame?.sprite ?: -1)
                .append(",\"life\":").append(life)
                .append(",\"sprpriority\":").append(priority)
            if(actor != null)json.append(",\"stateNo\":").append(actor.stateNo)
            if (commonScale != null) json.append(",\"common\":true")
            if(effect != null)json.append(",\"effectId\":").append(effect.id)
                .append(",\"effectSequence\":").append(effect.sequence)
            if(trail != null)json.append(",\"afterimageOwnerId\":").append(ownerId)
                .append(",\"historyIndex\":").append(trail.index)
                .append(",\"captureFrame\":").append(trail.pose.capturedAt)
            if (frame != null && commonScale == null) {
                val remaps = pose?.paletteRemaps ?: projectile?.paletteEffects?.remaps
                    ?: effect?.paletteEffects?.remaps ?: emptyMap()
                fight.paletteBanks.resolve(spriteSide, frame.group, frame.sprite, remaps)?.let {
                    json.append(",\"remapPalette\":").append(it.json())
                }
            }
            val paletteLayers = when {
                trail != null -> trail.layers
                kind == "superpause" || kind == "gameanim" -> listOfNotNull(fight.palettes.all.layer())
                else -> fight.palettes.layers(actor?.paletteEffects ?: projectile?.paletteEffects
                    ?: effect?.paletteEffects ?: fight.p1.paletteEffects)
            }
            json
                .append(",\"blend\":").append(blend.json())
                .append(",\"palFX\":").append(paletteLayers
                    .joinToString(prefix="[",postfix="]",separator=",") {it.json()})
                .append("},")
        }
        data class PlannedDraw(val priority: Long,val order: Int,val append: () -> Unit)
        val planned=ArrayList<PlannedDraw>()
        fun enqueue(priority: Long,append: () -> Unit) { planned.add(PlannedDraw(priority,planned.size,append)) }
        fun actorDraw(side: Int,kind: String,actor: FightingCharacter) {
            if("invisible" in actor.asserted)return
            val priority=actor.spritePriority.toLong()
            for(trail in actor.afterImages?.draws(actor,fight.palettes.all.layer()).orEmpty().asReversed())enqueue(trail.priority) {
                val pose=trail.pose
                draw(side,"afterimage",pose.x,pose.y,pose.facingRight,null,pose.definition,0,
                    priority=trail.priority,pose=pose,trail=trail,ownerId=actor.id)
            }
            enqueue(priority) { draw(side,kind,actor.posX,actor.posY,actor.facingRight,actor.animation,
                actor.animationOwner.definition,actor.life,priority=priority,actor=actor) }
        }
        actorDraw(0,"fighter",fight.p1)
        actorDraw(1,"fighter",fight.p2)
        for(helper in fight.entities.helpers)actorDraw(if(helper.actor.opponent === fight.p2)0 else 1,"helper",helper.actor)
        for(projectile in fight.entities.projectiles)enqueue(projectile.spritePriority.toLong()) {
            draw(if(projectile.owner.opponent === fight.p2)0 else 1,"projectile",projectile.x,projectile.y,
                projectile.facingRight,projectile.action,projectile.owner.definition,0,projectile=projectile,priority=projectile.spritePriority.toLong())
        }
        for(effect in fight.effects.all)enqueue(effect.drawPriority) {
            draw(if(effect.owner.opponent === fight.p2)0 else 1,"explod",effect.x,effect.y,
                effect.facingRight,effect.animation,effect.owner.definition,0,effect,priority=effect.drawPriority,
                commonScale=fight.commonAnimations.scale.takeIf { effect.config.commonAnimation })
        }
        for (effect in fight.commonAnimations.all) {
            val priority = if (effect.under) Int.MIN_VALUE.toLong() - 2 else Int.MAX_VALUE.toLong()
            enqueue(priority) {
                val definition = if (effect.side == 0) fight.p1.definition else fight.p2.definition
                val kind = if (effect.contact) "spark" else "gameanim"
                draw(effect.side, kind, effect.x, effect.y, effect.facingRight, effect.animation,
                    definition, 0, priority = priority, commonScale = fight.commonAnimations.scale.takeIf { effect.common })
            }
        }
        fight.pauses.flash?.let { flash ->
            val priority = Int.MAX_VALUE.toLong() + 2
            enqueue(priority) {
                draw(if (flash.owner.rootActor() === fight.p1) 0 else 1, "superpause",
                    flash.x, flash.y, flash.facingRight, flash.animation, flash.owner.definition, 0, priority = priority,
                    commonScale = fight.commonAnimations.scale.takeIf { flash.common })
            }
        }
        planned.sortWith(compareBy<PlannedDraw>{it.priority}.thenBy{it.order})
        for(item in planned)item.append()
        if(json.last() == ',')json.setLength(json.length-1)
        return json.append("]}").toString()
    }
}
