package moe.celery.kenjatime

/** Immutable requests dispatched in deterministic actor order after the controller phase. */
sealed class EntityRequest {
    data class Helper(
        val owner: FightingCharacter, val helperId: Int, val state: Int,
        val offsetX: Int, val offsetY: Int, val face: Int, val keyControl: Boolean,
        val bindTime: Int
    ) : EntityRequest()
    data class Projectile(
        val owner: FightingCharacter, val projectileId: Int, val animation: Int,
        val offsetX: Int, val offsetY: Int, val vx: Int, val vy: Int,
        val lifeTime: Int, val hit: HitDefinition,
        val facingRight: Boolean = owner.facingRight,
        val accelerationX: Int = 0,val accelerationY: Int = 0,
        val multiplierX: Double = 1.0,val multiplierY: Double = 1.0,
        val stageBound: Int = 40*Fixed.ONE,
        val heightTop: Int = -240*Fixed.ONE,val heightBottom: Int = Fixed.ONE,
        val removeOnHit: Boolean = true,val hits: Int = 1,val missTime: Int = 0,
        val priority: Int = 1
    ) : EntityRequest()
}

/** Helpers reuse the immutable FighterDefinition, never re-decode or copy sprite resources. */
data class HelperEntity(
    val owner: FightingCharacter,
    val actor: FightingCharacter,
    val helperId: Int,
    val keyControl: Boolean
)

data class ProjectileClash(
    val first: Int,val second: Int,val firstCancelled: Boolean,val secondCancelled: Boolean
)

/** Authored trajectory and finite hit allowance. Positive life permits that
 * many active updates after birth; -1 persists until contact/removal. */
class CoreProjectile(
    val owner: FightingCharacter,
    val entityId: Int,
    val projectileId: Int,
    val action: AirAnimationPlayer,
    val hit: HitDefinition,
    var x: Int, var y: Int,
    var vx: Int, var vy: Int,
    var ticksLeft: Int,
    /** Projectile orientation belongs to the projectile, not its creator's
     * later turns or custom-state facing changes. */
    val facingRight: Boolean = owner.facingRight,
    val accelerationX: Int = 0,val accelerationY: Int = 0,
    val multiplierX: Double = 1.0,val multiplierY: Double = 1.0,
    val stageBound: Int = 40*Fixed.ONE,
    val heightTop: Int = -240*Fixed.ONE,val heightBottom: Int = Fixed.ONE,
    val removeOnHit: Boolean = true,hits: Int = 1,val missTime: Int = 0,priority: Int = 1
) {
    init { require(ticksLeft >= -1 && multiplierX.isFinite() && multiplierY.isFinite() &&
        stageBound >= 0 && heightTop <= heightBottom && hits >= 0 && missTime >= 0 && priority >= 1) }
    var priority = priority
        private set
    var cancelled = false
        private set
    var hitsLeft = hits
        private set
    var missTimeLeft = 0
        private set
    var hitPauseLeft = 0
        private set
    val alive: Boolean get() = ticksLeft != 0
    /** False for every frozen tick, including the last one. An active final
     * lifetime update may still contact before the collection retires it. */
    fun step(): Boolean {
        if(!alive)return false
        if(hitPauseLeft > 0) { hitPauseLeft--;return false }
        if(missTimeLeft > 0)missTimeLeft--
        fun bounded(value: Long)=value.coerceIn(Int.MIN_VALUE.toLong(),Int.MAX_VALUE.toLong()).toInt()
        x=bounded(x.toLong()+vx)
        y=bounded(y.toLong()+vy)
        // Move using this tick's velocity, then accelerate and multiply for
        // the next tick. Conversion back to fixed point happens once.
        vx=((vx.toLong()+accelerationX).toDouble()*multiplierX).toInt()
        vy=((vy.toLong()+accelerationY).toDouble()*multiplierY).toInt()
        action.advance()
        if(ticksLeft > 0)ticksLeft--
        return true
    }
    private fun boxes(attack: Boolean): List<MugenRect> = action.frame?.boxes?.filter { it.attack == attack }
        ?.map { owner.definition.let { d ->
            d.coordinates.box(it.rect,x,y,facingRight,d.xScale,d.yScale) } } ?: emptyList()
    fun hitBoxes(): List<MugenRect> = boxes(true)
    fun clashBoxes(): List<MugenRect> = boxes(false)
    fun canHit(id: Int): Boolean = !cancelled && id != owner.id && hitsLeft > 0 && missTimeLeft == 0 && hitPauseLeft == 0
    internal fun canClash(): Boolean = !cancelled && hitsLeft > 0
    internal fun clash(otherPriority: Int) {
        if(priority > otherPriority)priority-- else hitsLeft--
        if(hitsLeft == 0) {
            cancelled=true;ticksLeft=0;hitPauseLeft=0
        } else hitPauseLeft=maxOf(hitPauseLeft,hit.hitPause.coerceAtLeast(0))
    }
    internal fun onContact(guarded: Boolean) {
        // Delay is measured between active contact phases. Zero and one both
        // permit the next active tick; projectile hitpause freezes this clock.
        hitsLeft--
        missTimeLeft=missTime
        hitPauseLeft=(if(guarded)hit.guardPause else hit.hitPause).coerceAtLeast(0)
        if(removeOnHit && hitsLeft == 0)ticksLeft=0
        if(!alive)hitPauseLeft=0
    }
    fun outside(arena: ArenaRules): Boolean =
        x.toLong() < arena.left.toLong()-stageBound && vx < 0 ||
        x.toLong() > arena.right.toLong()+stageBound && vx > 0 ||
        y.toLong() < arena.ground.toLong()+heightTop && vy < 0 ||
        y.toLong() > arena.ground.toLong()+heightBottom && vy > 0
}

/**
 * Separate owning collection. Never shares mutable input, variables or state
 * across clones. Limits are intentionally conservative for mobile browsers.
 */
class CoreEntities(private val match: DeterministicFight) {
    val helpers: MutableList<HelperEntity> = ArrayList()
    val projectiles: MutableList<CoreProjectile> = ArrayList()
    val clashes: MutableList<ProjectileClash> = ArrayList()
    private var nextId = 3
    var maxHelpers = 56
    var maxProjectiles = 256
    private val pendingRequests = mutableListOf<EntityRequest>()

    fun add(requests: List<EntityRequest>, errors: MutableSet<String>) {
        for (request in requests) when (request) {
            is EntityRequest.Helper -> {
                if (helpers.size >= maxHelpers) {
                    errors.add("Helper resource limit exceeded")
                    continue
                }
                val owner = request.owner
                val actor = FightingCharacter(owner.definition, nextId++, if (request.keyControl) owner.commands else emptyList())
                actor.parent = owner
                actor.world = match
                actor.posX = owner.posX + request.offsetX * if (owner.facingRight) 1 else -1
                actor.posY = owner.posY + request.offsetY
                actor.facingRight = if (request.face >= 0) owner.facingRight else !owner.facingRight
                actor.changeState(request.state)
                actor.opponent = if (owner.id == match.p1.id || owner.opponent === match.p2) match.p2 else match.p1
                if (request.bindTime != 0) {
                    if(request.bindTime >= -1 && actor.canBindTo(owner,owner))
                        actor.bindTo(owner,request.offsetX,request.offsetY,request.bindTime)
                    else errors.add("Unsupported initial helper binding")
                }
                helpers.add(HelperEntity(owner, actor, request.helperId, request.keyControl))
            }
            is EntityRequest.Projectile -> {
                if(request.lifeTime < -1 || !request.multiplierX.isFinite() || !request.multiplierY.isFinite() ||
                    request.stageBound < 0 || request.heightTop > request.heightBottom || request.hits < 0 || request.missTime < 0 || request.priority < 1) {
                    errors.add("Invalid Projectile motion, lifetime, hit allowance or priority")
                    continue
                }
                if(request.lifeTime == 0)continue
                if (projectiles.size >= maxProjectiles) {
                    errors.add("Projectile resource limit exceeded")
                    continue
                }
                val action = request.owner.definition.animations[request.animation]
                if (action == null) {
                    errors.add("Projectile animation missing: " + request.animation)
                    continue
                }
                val owner = request.owner
                fun bounded(value: Long)=value.coerceIn(Int.MIN_VALUE.toLong(),Int.MAX_VALUE.toLong()).toInt()
                fun facing(value: Int)=bounded(value.toLong()*if(request.facingRight)1 else -1)
                projectiles.add(CoreProjectile(owner, nextId++, request.projectileId,
                    AirAnimationPlayer(action), request.hit,
                    bounded(owner.posX.toLong()+facing(request.offsetX)),
                    bounded(owner.posY.toLong()+request.offsetY),
                    facing(request.vx),request.vy,request.lifeTime,request.facingRight,
                    facing(request.accelerationX),request.accelerationY,request.multiplierX,request.multiplierY,
                    request.stageBound,request.heightTop,request.heightBottom,
                    request.removeOnHit,request.hits,request.missTime,request.priority))
            }
        }
    }
    fun advanceHelpers(errors: MutableSet<String>) {
        pendingRequests.clear()
        for (helper in helpers.toList()) {
            if (helper.actor.destroyed) continue
            helper.actor.tick(errors)
            if (!helper.actor.destroyed) pendingRequests.addAll(helper.actor.flushEntityRequests())
        }
    }
    fun resolveContacts(errors: MutableSet<String>) {
        if (helpers.isEmpty() && projectiles.isEmpty()) return
        // Special moves can have dozens of helpers/projectiles against the
        // same victim. Reuse its immutable world-space hurtboxes *within this
        // one tick* and invalidate immediately when a hit changes its state.
        // This does not cache across movement, ticks or hit-state transitions.
        val targetHurt = mutableMapOf<FightingCharacter, List<MugenRect>>()
        fun hurt(target: FightingCharacter): List<MugenRect> =
            targetHurt.getOrPut(target) { target.hurtBoxes() }
        val current = helpers.toList()
        for (helper in current) {
            if (helper.actor.destroyed) continue
            val enemy = helper.actor.opponent ?: match.p2
            val hit = helper.actor.activeHitDef
            if (hit != null && !helper.actor.hitPauseThisTick && helper.actor.hitPauseLeft == 0 && enemy.canReceive(hit) &&
                helper.actor.canHit(enemy.id) &&
                helper.actor.attackBoxes().any { a -> hurt(enemy).any { a.intersects(it) } }) {
                val guarded = enemy.blocks(hit)
                helper.actor.markHit(enemy.id)
                helper.actor.moveContact = true
                helper.actor.moveHit = !guarded
                helper.actor.moveGuarded = guarded
                helper.actor.hitPauseLeft = if (guarded) hit.guardPause else hit.hitPause
                match.contacts.add(FightContact(helper.actor.id, enemy.id, guarded,
                    if (guarded) hit.guardDamage else hit.damage))
                enemy.receiveHit(hit, helper.actor.facingRight, guarded, helper.actor)
                targetHurt.remove(enemy) // Next helper sees the new hit animation.
            }
        }
        val phases=mutableListOf<ProjectilePhase>()
        for (projectile in projectiles) {
            if (!projectile.alive) continue
            val arena=match.arena
            if(projectile.hitPauseLeft == 0 && arena != null && projectile.outside(arena)) {
                projectile.ticksLeft=0
                continue
            }
            phases.add(ProjectilePhase(projectile,projectile.step()))
        }
        resolveClashes(phases)
        for(phase in phases) {
            val projectile=phase.projectile
            if(!phase.advanced)continue
            val enemy = projectile.owner.opponent ?: match.p2
            if (!projectile.canHit(enemy.id) || !enemy.canReceive(projectile.hit)) continue
            if (projectile.hitBoxes().any { box -> hurt(enemy).any { box.intersects(it) } }) {
                val guarded = enemy.blocks(projectile.hit)
                match.contacts.add(FightContact(projectile.entityId, enemy.id, guarded,
                    if (guarded) projectile.hit.guardDamage else projectile.hit.damage))
                projectile.owner.projectileHistory.record(projectile.projectileId,
                    if(guarded)ProjectileContactKind.GUARDED else ProjectileContactKind.HIT,match.frame,errors)
                enemy.receiveHit(projectile.hit, projectile.facingRight, guarded, projectile.owner)
                targetHurt.remove(enemy)
                projectile.onContact(guarded)
            }
        }
        helpers.removeAll { it.actor.destroyed }
        projectiles.removeAll { !it.alive }
        add(pendingRequests, errors)
        pendingRequests.clear()
    }

    private data class ProjectilePhase(val projectile: CoreProjectile,val advanced: Boolean)
    private data class ClashBody(val projectile: CoreProjectile,val boxes: List<MugenRect>,val bounds: MugenRect)
    private data class ClashPair(val a: ClashBody,val b: ClashBody,val distance: Double)

    private fun resolveClashes(phases: List<ProjectilePhase>) {
        // No clash geometry or pair allocations for one-sided projectile streams.
        val eligible=phases.filter { it.projectile.canClash() }
        fun left(p: CoreProjectile)=p.owner.opponent === match.p2
        if(eligible.none { left(it.projectile) } || eligible.none { !left(it.projectile) })return
        val bodies=eligible.mapNotNull { phase ->
            val p=phase.projectile
            val boxes=p.clashBoxes()
            if(boxes.isEmpty())null else ClashBody(p,boxes,MugenRect(
                boxes.minOf { it.x1 },boxes.minOf { it.y1 },boxes.maxOf { it.x2 },boxes.maxOf { it.y2 }))
        }.sortedBy { it.projectile.entityId }
        val pairs=mutableListOf<ClashPair>()
        for(i in bodies.indices)for(j in i+1 until bodies.size) {
            val a=bodies[i];val b=bodies[j]
            if(left(a.projectile) == left(b.projectile) || !a.bounds.intersects(b.bounds))continue
            if(!a.boxes.any { x -> b.boxes.any(x::intersects) })continue
            // Double distance avoids Long overflow at opposite fixed-point limits.
            val dx=a.projectile.x.toDouble()-b.projectile.x
            val dy=a.projectile.y.toDouble()-b.projectile.y
            pairs.add(ClashPair(a,b,dx*dx+dy*dy))
        }
        pairs.sortWith(compareBy<ClashPair> { it.distance }
            .thenBy { it.a.projectile.entityId }.thenBy { it.b.projectile.entityId })
        for(pair in pairs) {
            val a=pair.a.projectile;val b=pair.b.projectile
            if(!a.canClash() || !b.canClash())continue
            val ap=a.priority;val bp=b.priority
            a.clash(bp);b.clash(ap)
            if(a.cancelled)a.owner.projectileHistory.record(a.projectileId,ProjectileContactKind.CANCEL,match.frame,match.issues)
            if(b.cancelled)b.owner.projectileHistory.record(b.projectileId,ProjectileContactKind.CANCEL,match.frame,match.issues)
            clashes.add(ProjectileClash(a.entityId,b.entityId,a.cancelled,b.cancelled))
        }
    }
}
