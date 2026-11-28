package moe.celery.kenjatime

/** Immutable requests dispatched in deterministic actor order after the controller phase. */
sealed class EntityRequest {
    data class Helper(
        val owner: FightingCharacter, val helperId: Int, val state: Int,
        val offsetX: Int, val offsetY: Int, val face: Int, val keyControl: Boolean,
        val bindTime: Int,val ownPalette: Boolean=false,
        val pauseMoves: CorePauseMoves = CorePauseMoves(),
        val controllerState: Int = owner.stateNo
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
        val priority: Int = 1,val scaleX: Double = 1.0,val scaleY: Double = 1.0,
        val attackMultiplier: Double = hit.capturedAttackMultiplier ?: owner.attackMultiplier,
        val spritePriority: Int = 3,val ownPalette: Boolean=false,
        val pauseMoves: CorePauseMoves = CorePauseMoves(),
        val removal: ProjectileRemoval? = null
    ) : EntityRequest()
}

data class ProjectileRemoval(val hit: Int, val expired: Int, val cancelled: Int, val vx: Int, val vy: Int)

/** Helpers reuse the immutable FighterDefinition, never re-decode or copy sprite resources. */
data class HelperEntity(
    val owner: FightingCharacter,
    val actor: FightingCharacter,
    val helperId: Int,
    val keyControl: Boolean
) {
    internal val root = owner.rootActor()
}

data class ProjectileClash(
    val first: Int,val second: Int,val firstCancelled: Boolean,val secondCancelled: Boolean
)

/** Authored trajectory and finite hit allowance. Positive life permits that
 * many active updates after birth; -1 persists until contact/removal. */
class CoreProjectile(
    val owner: FightingCharacter,
    val entityId: Int,
    val projectileId: Int,
    action: AirAnimationPlayer,
    hit: HitDefinition,
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
    val removeOnHit: Boolean = true,hits: Int = 1,val missTime: Int = 0,priority: Int = 1,
    /** Captured effective scale: projscale, optionally multiplied by own Size. */
    val scaleX: Double = 1.0,val scaleY: Double = 1.0,val spritePriority: Int = 3,val ownPalette: Boolean=false,
    val pauseMoves: CorePauseMoves = CorePauseMoves(),
    private val removal: ProjectileRemoval? = null
) {
    var action = action
        private set
    internal val paletteEffects=if(ownPalette)owner.paletteEffects.copyRemaps() else owner.paletteEffects
    val hit=hit.copy(capturedAttackMultiplier=hit.capturedAttackMultiplier ?: owner.attackMultiplier)
    internal val validGuardAttribute = CoreGuardDistance.validProjectileAttribute(this.hit.attr)
    companion object {
        const val MAX_SCALE = 64.0
        // FighterDefinition bounds its fixed-point Size factors to 256.
        private const val MAX_EFFECTIVE_SCALE = MAX_SCALE*256.0
    }
    init { require(ticksLeft >= -1 && multiplierX.isFinite() && multiplierY.isFinite() &&
        stageBound >= 0 && heightTop <= heightBottom && hits >= 0 && missTime >= 0 && priority >= 1 &&
        scaleX in -MAX_EFFECTIVE_SCALE..MAX_EFFECTIVE_SCALE && scaleY in -MAX_EFFECTIVE_SCALE..MAX_EFFECTIVE_SCALE) }
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
    private var advancedOnce = false
    private var removedByHit = false
    private var nextRemovalAction: AirAction? = null
    val alive: Boolean get() = ticksLeft != 0
    /** False for every frozen tick, including the last one. An active final
     * lifetime update may still contact before the collection retires it. */
    fun step(): Boolean {
        if(!alive)return false
        if(hitPauseLeft > 0) { hitPauseLeft--;return false }
        if(missTimeLeft > 0)missTimeLeft--
        move()
        // Move using this tick's velocity, then accelerate and multiply for
        // the next tick. Conversion back to fixed point happens once.
        vx=((vx.toLong()+accelerationX).toDouble()*multiplierX).toInt()
        vy=((vy.toLong()+accelerationY).toDouble()*multiplierY).toInt()
        if (!owner.definition.authoredCns || advancedOnce) action.advance()
        advancedOnce = true
        if(ticksLeft > 0)ticksLeft--
        return true
    }
    private fun move() {
        x = (x.toLong() + vx).coerceIn(Int.MIN_VALUE.toLong(), Int.MAX_VALUE.toLong()).toInt()
        y = (y.toLong() + vy).coerceIn(Int.MIN_VALUE.toLong(), Int.MAX_VALUE.toLong()).toInt()
    }
    private fun boxes(attack: Boolean): List<MugenRect> {
        val authored = action.frame?.boxes ?: return emptyList()
        val coords = owner.definition.coordinates
        return buildList {
            for (box in authored) {
                if (box.attack != attack) continue
                val rect = coords.scaledBox(box.rect, x, y, facingRight, scaleX, scaleY)
                if (rect.x1 < rect.x2 && rect.y1 < rect.y2) add(rect)
            }
        }
    }
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
        if(removeOnHit && hitsLeft == 0) {
            removedByHit = true
            ticksLeft = 0
        }
        if(!alive)hitPauseLeft=0
    }
    internal fun beginRemoval(errors: MutableSet<String>): Boolean {
        val spec = removal ?: return false
        val animation = when {
            cancelled -> spec.cancelled
            removedByHit -> spec.hit
            else -> spec.expired
        }
        if (animation < 0) return false
        val next = owner.definition.animations[animation]
        if (next == null || next.frames.isEmpty()) {
            errors.add("Projectile removal animation missing: $animation")
            return false
        }
        // The active pose is still displayed on the tick that removed the shot.
        nextRemovalAction = next.takeUnless { it === action.action }
        vx = spec.vx
        vy = spec.vy
        return nextRemovalAction != null || !action.finished
    }
    internal fun advanceRemoval(): Boolean {
        nextRemovalAction?.let {
            action = AirAnimationPlayer(it)
            nextRemovalAction = null
            return true
        }
        action.advance()
        if (action.finished) return false
        move()
        return true
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
    internal val projectileRemovals: MutableList<CoreProjectile> = ArrayList()
    val clashes: MutableList<ProjectileClash> = ArrayList()
    private var nextId = 3
    var maxHelpers = 56
    var maxProjectiles = 256
    private val pendingRequests = mutableListOf<EntityRequest>()
    private data class BlockedHelper(val side: Int, val actor: Int, val controllerState: Int, val id: Int, val startState: Int)
    private var blockedHelperSpawns = 0L
    private var lastBlockedHelper: BlockedHelper? = null

    internal fun countHelpers(actor: FightingCharacter, id: Int = 0): Int {
        val root = actor.rootActor()
        return helpers.count { it.root === root && !it.actor.destroyed && (id <= 0 || it.helperId == id) }
    }

    internal fun isHelper(actor: FightingCharacter, id: Int): Boolean =
        helpers.any { it.actor === actor && !it.actor.destroyed && it.helperId == id }

    internal fun findHelper(actor: FightingCharacter, id: Int): FightingCharacter? {
        val root = actor.rootActor()
        return helpers.firstOrNull { it.root === root && !it.actor.destroyed && (id <= 0 || it.helperId == id) }?.actor
    }

    internal fun destroyHelper(actor: FightingCharacter, recursive: Boolean, removeExplods: Boolean) {
        actor.destroyed = true
        if (removeExplods) match.effects.remove(actor)
        if (!recursive) return
        for (helper in helpers) {
            val descendants = generateSequence(helper.owner) { it.parent }.take(helpers.size + 1)
            if (descendants.any { it === actor }) {
                helper.actor.destroyed = true
                if (removeExplods) match.effects.remove(helper.actor)
            }
        }
    }

    internal fun helperDiagnosticsJson(): String {
        val groups = helpers.filterNot { it.actor.destroyed }
            .groupingBy { Triple(it.root.id, it.helperId, it.actor.stateNo) }.eachCount()
        val active = groups.entries.joinToString(prefix = "[", postfix = "]") { (group, count) ->
            val (side, id, state) = group
            "{\"side\":$side,\"id\":$id,\"state\":$state,\"count\":$count}"
        }
        val blocked = lastBlockedHelper?.let {
            "{\"side\":${it.side},\"actor\":${it.actor}," +
                "\"controllerState\":${it.controllerState},\"id\":${it.id},\"startState\":${it.startState}}"
        } ?: "null"
        return "{\"limit\":$maxHelpers,\"blockedSpawns\":$blockedHelperSpawns,\"lastBlocked\":$blocked,\"active\":$active}"
    }

    fun add(requests: List<EntityRequest>, errors: MutableSet<String>) {
        for (request in requests) when (request) {
            is EntityRequest.Helper -> {
                val owner = request.owner
                if (owner.destroyed) continue
                if (request.state < 0 || request.state != 0 && request.state !in owner.definition.states) {
                    errors.add("Missing Helper start state: ${request.state}")
                    continue
                }
                if (helpers.size >= maxHelpers) {
                    errors.add("Helper resource limit exceeded")
                    blockedHelperSpawns++
                    lastBlockedHelper = BlockedHelper(owner.rootActor().id, owner.id, request.controllerState,
                        request.helperId, request.state)
                    continue
                }
                val actor = FightingCharacter(owner.definition, nextId++, if (request.keyControl) owner.rootActor().commands else emptyList())
                actor.parent = owner
                actor.ownPalette=request.ownPalette
                actor.pauseMoves = request.pauseMoves
                actor.paletteEffects = if (request.ownPalette) owner.paletteEffects.copyRemaps() else owner.paletteEffects
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
                val owner = request.owner
                val scaleX=request.scaleX*if(owner.definition.projectileDoScale)owner.definition.xScale.toDouble()/Fixed.ONE else 1.0
                val scaleY=request.scaleY*if(owner.definition.projectileDoScale)owner.definition.yScale.toDouble()/Fixed.ONE else 1.0
                if(request.lifeTime < -1 || !request.multiplierX.isFinite() || !request.multiplierY.isFinite() ||
                    request.stageBound < 0 || request.heightTop > request.heightBottom || request.hits < 0 || request.missTime < 0 || request.priority < 1 ||
                    request.scaleX !in -CoreProjectile.MAX_SCALE..CoreProjectile.MAX_SCALE ||
                    request.scaleY !in -CoreProjectile.MAX_SCALE..CoreProjectile.MAX_SCALE || !scaleX.isFinite() || !scaleY.isFinite() ||
                    request.attackMultiplier !in 0.0..Float.MAX_VALUE.toDouble()) {
                    errors.add("Invalid Projectile motion, lifetime, hit allowance, priority, scale or attack multiplier")
                    continue
                }
                if(request.lifeTime == 0)continue
                if (projectiles.size + projectileRemovals.size >= maxProjectiles) {
                    errors.add("Projectile resource limit exceeded")
                    continue
                }
                val action = request.owner.definition.animations[request.animation]
                if (action == null) {
                    errors.add("Projectile animation missing: " + request.animation)
                    continue
                }
                fun bounded(value: Long)=value.coerceIn(Int.MIN_VALUE.toLong(),Int.MAX_VALUE.toLong()).toInt()
                fun facing(value: Int)=bounded(value.toLong()*if(request.facingRight)1 else -1)
                projectiles.add(CoreProjectile(owner, nextId++, request.projectileId,
                    AirAnimationPlayer(action), request.hit.copy(capturedAttackMultiplier=request.attackMultiplier),
                    bounded(owner.posX.toLong()+facing(request.offsetX)),
                    bounded(owner.posY.toLong()+request.offsetY),
                    facing(request.vx),request.vy,request.lifeTime,request.facingRight,
                    facing(request.accelerationX),request.accelerationY,request.multiplierX,request.multiplierY,
                    request.stageBound,request.heightTop,request.heightBottom,
                    request.removeOnHit,request.hits,request.missTime,request.priority,scaleX,scaleY,request.spritePriority,
                    request.ownPalette,request.pauseMoves,request.removal?.let { it.copy(vx = facing(it.vx)) }))
            }
        }
    }
    fun clearHelperInputs() {
        for(helper in helpers) {
            helper.actor.pendingAssertedInput=InputFrame()
            helper.actor.pauseCommands.clear()
            helper.actor.input.clear()
        }
    }
    fun advanceHelpers(errors: MutableSet<String>,p1Input: InputFrame=InputFrame(),p2Input: InputFrame=InputFrame()) {
        pendingRequests.clear()
        for (helper in helpers.toList()) {
            if (helper.actor.destroyed) continue
            val physical=if(!helper.keyControl)InputFrame() else if(helper.actor.rootActor() === match.p1)p1Input else p2Input
            helper.actor.roundState=match.p1.roundState
            match.pauses.tickActor(helper.actor, physical, true, errors, helperKeyControl = helper.keyControl)
            if (!helper.actor.destroyed) pendingRequests.addAll(helper.actor.flushEntityRequests())
        }
    }
    private fun dispatchLaunchProjectiles(requests: List<EntityRequest>, errors: MutableSet<String>): List<EntityRequest> {
        if (requests.isEmpty()) return requests
        val (projectiles, deferred) = requests.partition {
            it is EntityRequest.Projectile && it.owner.definition.mugen11Timing
        }
        if (projectiles.isEmpty()) return requests
        add(projectiles, errors)
        return deferred
    }

    internal fun addLaunchProjectiles(roots: List<EntityRequest>, errors: MutableSet<String>): List<EntityRequest> {
        // MUGEN 1.1 projectiles move and can hit in the same tick as their controller.
        val deferred = dispatchLaunchProjectiles(pendingRequests, errors)
        if (deferred !== pendingRequests) {
            pendingRequests.clear()
            pendingRequests.addAll(deferred)
        }
        return dispatchLaunchProjectiles(roots, errors)
    }

    fun resolveContacts(errors: MutableSet<String>) {
        projectileRemovals.removeAll { !match.pauses.entityFrozen(it.pauseMoves) && !it.advanceRemoval() }
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
            if (helper.actor.destroyed || helper.actor.globalPauseThisTick) continue
            val enemy = helper.actor.opponent ?: match.p2
            val hit = helper.actor.activeHitDef
            if (hit != null && !helper.actor.hitPauseThisTick && helper.actor.hitPauseLeft == 0 && enemy.canReceive(hit) &&
                helper.actor.canHit(enemy.id) &&
                helper.actor.attackBoxes().any { a -> hurt(enemy).any { a.intersects(it) } }) {
                val guarded = enemy.blocks(hit)
                helper.actor.markHit(enemy.id)
                helper.actor.recordMoveContact(guarded)
                helper.actor.hitPauseLeft = if (guarded) hit.guardPause else hit.hitPause
                match.contacts.add(FightContact(helper.actor.id, enemy.id, guarded,
                    CoreDamage.contact(hit,helper.actor,enemy,guarded)))
                enemy.receiveHit(hit, helper.actor.facingRight, guarded, helper.actor)
                targetHurt.remove(enemy) // Next helper sees the new hit animation.
            }
        }
        val phases=mutableListOf<ProjectilePhase>()
        for (projectile in projectiles) {
            if (!projectile.alive || match.pauses.entityFrozen(projectile.pauseMoves)) continue
            val arena=match.arena
            if(projectile.hitPauseLeft == 0 && arena != null && projectile.outside(arena)) {
                projectile.ticksLeft=0
                continue
            }
            phases.add(ProjectilePhase(projectile,projectile.step()))
        }
        resolveClashes(phases)
        for(phase in phases)CoreGuardDistance.projectile(match,phase.projectile,phase.advanced)
        for(phase in phases) {
            val projectile=phase.projectile
            if(!phase.advanced)continue
            val enemy = projectile.owner.opponent ?: match.p2
            if (!projectile.canHit(enemy.id) || !enemy.canReceive(projectile.hit)) continue
            if (projectile.hitBoxes().any { box -> hurt(enemy).any { box.intersects(it) } }) {
                val guarded = enemy.blocks(projectile.hit)
                match.contacts.add(FightContact(projectile.entityId, enemy.id, guarded,
                    CoreDamage.contact(projectile.hit,projectile.owner,enemy,guarded)))
                projectile.owner.projectileHistory.record(projectile.projectileId,
                    if(guarded)ProjectileContactKind.GUARDED else ProjectileContactKind.HIT,match.frame,errors)
                enemy.receiveHit(projectile.hit, projectile.facingRight, guarded, projectile.owner, projectile)
                targetHurt.remove(enemy)
                projectile.onContact(guarded)
            }
        }
        helpers.removeAll { it.actor.destroyed }
        projectiles.removeAll {
            if (it.alive) false else {
                if (it.beginRemoval(errors)) projectileRemovals.add(it)
                true
            }
        }
        add(pendingRequests, errors)
        pendingRequests.clear()
    }

    private data class ProjectilePhase(val projectile: CoreProjectile,val advanced: Boolean)
    private data class ClashBody(val projectile: CoreProjectile, val boxes: List<MugenRect>, val bounds: MugenRect,
                                 val leftSide: Boolean)
    private data class ClashPair(val a: ClashBody,val b: ClashBody,val distance: Double)

    private fun resolveClashes(phases: List<ProjectilePhase>) {
        // No clash geometry or pair allocations for one-sided projectile streams.
        var sides = 0
        for (phase in phases) {
            val p = phase.projectile
            if (!p.canClash()) continue
            sides = sides or (if (p.owner.opponent === match.p2) 1 else 2)
            if (sides == 3) break
        }
        if (sides != 3) return
        val bodies=phases.mapNotNull { phase ->
            val p=phase.projectile
            if (!p.canClash()) return@mapNotNull null
            val boxes=p.clashBoxes()
            if(boxes.isEmpty())null else ClashBody(p,boxes,MugenRect(
                boxes.minOf { it.x1 },boxes.minOf { it.y1 },boxes.maxOf { it.x2 },boxes.maxOf { it.y2 }),
                p.owner.opponent === match.p2)
        }.sortedBy { it.bounds.x1 }
        val pairs=mutableListOf<ClashPair>()
        for(i in bodies.indices)for(j in i+1 until bodies.size) {
            val a=bodies[i];val b=bodies[j]
            // Every later left edge is at least this far right.
            if (b.bounds.x1 >= a.bounds.x2) break
            if(a.leftSide == b.leftSide || !a.bounds.intersects(b.bounds))continue
            if(!a.boxes.any { x -> b.boxes.any(x::intersects) })continue
            // Double distance avoids Long overflow at opposite fixed-point limits.
            val dx=a.projectile.x.toDouble()-b.projectile.x
            val dy=a.projectile.y.toDouble()-b.projectile.y
            val distance = dx*dx + dy*dy
            // Range order must not change the contact IDs or distance tie-breaks.
            pairs.add(if (a.projectile.entityId < b.projectile.entityId) ClashPair(a,b,distance) else ClashPair(b,a,distance))
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
