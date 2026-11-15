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
        val lifeTime: Int, val hit: HitDefinition
    ) : EntityRequest()
}

/** Helpers reuse the immutable FighterDefinition, never re-decode or copy sprite resources. */
data class HelperEntity(
    val owner: FightingCharacter,
    val actor: FightingCharacter,
    val helperId: Int,
    val keyControl: Boolean
)

/** A minimal linear projectile and per-target single-contact model. */
class CoreProjectile(
    val owner: FightingCharacter,
    val entityId: Int,
    val projectileId: Int,
    val action: AirAnimationPlayer,
    val hit: HitDefinition,
    var x: Int, var y: Int,
    var vx: Int, var vy: Int,
    var ticksLeft: Int
) {
    private val targets = mutableSetOf<Int>()
    val alive: Boolean get() = ticksLeft > 0
    fun step() {
        x += vx
        y += vy
        action.advance()
        ticksLeft--
    }
    fun hitBoxes(): List<MugenRect> = action.frame?.boxes?.filter { it.attack }
        ?.map { it.rect.world(x, y, owner.facingRight,
            owner.definition.collisionScaleX,owner.definition.collisionScaleY) } ?: emptyList()
    fun canHit(id: Int): Boolean = id !in targets
    fun markHit(id: Int) { targets.add(id) }
}

/**
 * Separate owning collection. Never shares mutable input, variables or state
 * across clones. Limits are intentionally conservative for mobile browsers.
 */
class CoreEntities(private val match: DeterministicFight) {
    val helpers: MutableList<HelperEntity> = ArrayList()
    val projectiles: MutableList<CoreProjectile> = ArrayList()
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
                projectiles.add(CoreProjectile(owner, nextId++, request.projectileId,
                    AirAnimationPlayer(action), request.hit,
                    owner.posX + request.offsetX * if (owner.facingRight) 1 else -1,
                    owner.posY + request.offsetY,
                    request.vx * if (owner.facingRight) 1 else -1,
                    request.vy, request.lifeTime.coerceIn(1,3600)))
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
            if (hit != null && helper.actor.hitPauseLeft == 0 && enemy.canReceive(hit) &&
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
        for (projectile in projectiles) {
            if (!projectile.alive) continue
            projectile.step()
            val enemy = projectile.owner.opponent ?: match.p2
            if (!projectile.canHit(enemy.id) || !enemy.canReceive(projectile.hit)) continue
            if (projectile.hitBoxes().any { box -> hurt(enemy).any { box.intersects(it) } }) {
                val guarded = enemy.blocks(projectile.hit)
                projectile.markHit(enemy.id)
                match.contacts.add(FightContact(projectile.entityId, enemy.id, guarded,
                    if (guarded) projectile.hit.guardDamage else projectile.hit.damage))
                enemy.receiveHit(projectile.hit, projectile.owner.facingRight, guarded, projectile.owner)
                targetHurt.remove(enemy)
                projectile.ticksLeft = 0
            }
        }
        helpers.removeAll { it.actor.destroyed }
        projectiles.removeAll { !it.alive }
        add(pendingRequests, errors)
        pendingRequests.clear()
    }
}
