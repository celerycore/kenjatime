package moe.celery.kenjatime

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
        val json = StringBuilder(2048)
        json.append("{\"frame\":").append(fight.frame)
            .append(",\"targetFps\":").append(targetFps(backlog))
            .append(",\"backlog\":").append(backlog.coerceAtLeast(0))
            .append(",\"cameraZoom\":").append(camera?.zoom ?: 1.0)
            .append(",\"helpers\":").append(fight.entities.helpers.size)
            .append(",\"projectiles\":").append(fight.entities.projectiles.size)
            .append(",\"health\":[")
            .append(healthBarWidth(fight.p1.life,fight.p1.definition.maxLife))
            .append(',').append(healthBarWidth(fight.p2.life,fight.p2.definition.maxLife))
            .append("],\"draws\":[")
        fun draw(side: Int, kind: String, x256: Int, y256: Int,
                 facingRight: Boolean, action: AirAnimationPlayer?,
                 definition: FighterDefinition, life: Int) {
            val frame = action?.frame
            val face = if(facingRight) 1 else -1
            val zoom=camera?.zoom ?: 1.0
            // AIR frame offsets are authored in the fighter's localcoord and
            // are applied before the SFF pivot. The old JS renderer ignored
            // them, causing specials and helper animation frames to drift.
            val drawX=pixelX(x256,camera)+
                (frame?.offsetX ?: 0)*320.0/definition.localCoordWidth*
                HORIZONTAL_SCALE*zoom*face
            val drawY=pixelY(y256,camera)+
                (frame?.offsetY ?: 0)*240.0/definition.localCoordHeight*
                VERTICAL_SCALE*zoom
            val flip=frame?.flip?.uppercase() ?: ""
            json.append("{\"side\":").append(side)
                .append(",\"kind\":\"").append(kind).append("\"")
                .append(",\"x\":").append(drawX)
                .append(",\"y\":").append(drawY)
                .append(",\"flipX\":").append(if('H' in flip) -1 else 1)
                .append(",\"flipY\":").append(if('V' in flip) -1 else 1)
                .append(",\"scale\":").append(camera?.zoom ?: 1.0)
                .append(",\"spriteScaleX\":").append(320.0 / definition.localCoordWidth)
                .append(",\"spriteScaleY\":").append(240.0 / definition.localCoordHeight)
                .append(",\"facing\":").append(if(facingRight) 1 else -1)
                .append(",\"action\":").append(action?.action?.number ?: -1)
                .append(",\"elem\":").append((action?.index ?: 0)+1)
                .append(",\"group\":").append(frame?.group ?: -1)
                .append(",\"number\":").append(frame?.sprite ?: -1)
                .append(",\"life\":").append(life)
                .append("},")
        }
        draw(0,"fighter",fight.p1.posX,fight.p1.posY,
            fight.p1.facingRight,fight.p1.animation,fight.p1.definition,fight.p1.life)
        draw(1,"fighter",fight.p2.posX,fight.p2.posY,
            fight.p2.facingRight,fight.p2.animation,fight.p2.definition,fight.p2.life)
        for(helper in fight.entities.helpers) {
            val side = if (helper.owner === fight.p1) 0 else 1
            draw(side,"helper",helper.actor.posX,helper.actor.posY,
                helper.actor.facingRight,helper.actor.animation,
                helper.actor.definition,helper.actor.life)
        }
        for(projectile in fight.entities.projectiles) {
            val side = if(projectile.owner === fight.p1) 0 else 1
            draw(side,"projectile",projectile.x,projectile.y,
                projectile.owner.facingRight,projectile.action,
                projectile.owner.definition,0)
        }
        if(json.last() == ',')json.setLength(json.length-1)
        return json.append("]}").toString()
    }
}
