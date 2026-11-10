package moe.celery.kenjatime

/**
 * Each collision box is 5 contiguous integers:
 * [type (Clsn1=1, Clsn2=2), x1, y1, x2, y2].
 * Reused buffers keep the hot contact path free of per-box allocations.
 */
class FlatBoxBuffer(initialBoxes: Int = 16, private val limit: Int = 4096) {
    init { require(initialBoxes in 1..limit) }
    private var data = IntArray(initialBoxes * 5)
    var count: Int = 0
        private set
    fun clear() { count = 0 }
    private fun reserve(next: Int) {
        require(next <= limit) { "AIR collision box budget exceeded" }
        if (next * 5 <= data.size) return
        var size = data.size / 5
        while (size < next) size = minOf(limit, size * 2)
        data = data.copyOf(size * 5)
    }
    fun add(type: Int, x1: Int, y1: Int, x2: Int, y2: Int) {
        reserve(count + 1)
        val offset = 5 * count++
        data[offset] = type
        data[offset + 1] = minOf(x1, x2)
        data[offset + 2] = minOf(y1, y2)
        data[offset + 3] = maxOf(x1, x2)
        data[offset + 4] = maxOf(y1, y2)
    }
    fun load(actor: FightingCharacter, attack: Boolean) {
        clear()
        val frames = actor.animation?.frame?.boxes ?: return
        // Legacy hurt boxes are unscaled; preserve existing contact semantics.
        val sx = if (attack) actor.definition.xScale else Fixed.ONE
        val sy = if (attack) actor.definition.yScale else Fixed.ONE
        val face = if (actor.facingRight) 1 else -1
        for (box in frames) {
            if (box.attack != attack) continue
            val r = box.rect
            add(if (attack) 1 else 2,
                actor.posX + r.x1 * sx * face,
                actor.posY + r.y1 * sy,
                actor.posX + r.x2 * sx * face,
                actor.posY + r.y2 * sy)
        }
    }
    fun loadProjectile(projectile: CoreProjectile) {
        clear()
        val boxes = projectile.action.frame?.boxes ?: return
        val face = if (projectile.owner.facingRight) 1 else -1
        for (box in boxes) {
            if (!box.attack) continue
            val r = box.rect
            add(1, projectile.x + r.x1 * Fixed.ONE * face,
                projectile.y + r.y1 * Fixed.ONE,
                projectile.x + r.x2 * Fixed.ONE * face,
                projectile.y + r.y2 * Fixed.ONE)
        }
    }
    fun intersects(other: FlatBoxBuffer): Boolean {
        for (a in 0 until count) {
            val ai = a * 5
            for (b in 0 until other.count) {
                val bi = b * 5
                if (data[ai + 1] < other.data[bi + 3] &&
                    data[ai + 3] > other.data[bi + 1] &&
                    data[ai + 2] < other.data[bi + 4] &&
                    data[ai + 4] > other.data[bi + 2]) return true
            }
        }
        return false
    }
    fun copyFlat(): IntArray = data.copyOf(count * 5)
}

/** Scratch space is owned by one fight, not shared between matches. */
class FlatCollisionScratch {
    private val attacks = FlatBoxBuffer()
    private val hurts = FlatBoxBuffer()
    fun connects(attacker: FightingCharacter, defender: FightingCharacter): Boolean {
        attacks.load(attacker, true)
        hurts.load(defender, false)
        return attacks.intersects(hurts)
    }
    fun projectileConnects(projectile: CoreProjectile, defender: FightingCharacter): Boolean {
        attacks.loadProjectile(projectile)
        hurts.load(defender, false)
        return attacks.intersects(hurts)
    }
}

/** Stable X-axis insertion sort followed by a non-allocating broadphase callback. */
class SweepBroadphase(maxEntities: Int = 1024) {
    private val indices: IntArray
    init { require(maxEntities in 2..16384); indices = IntArray(maxEntities) }
    fun overlaps(count: Int, minX: IntArray, maxX: IntArray, emit: (Int, Int) -> Unit) {
        require(count in 0..indices.size && minX.size >= count && maxX.size >= count)
        for (i in 0 until count) {
            require(minX[i] <= maxX[i])
            indices[i] = i
        }
        for (i in 1 until count) {
            val entry = indices[i]
            var k = i - 1
            while (k >= 0 && minX[indices[k]] > minX[entry]) {
                indices[k + 1] = indices[k]
                k--
            }
            indices[k + 1] = entry
        }
        for (i in 0 until count) {
            val first = indices[i]
            var j = i + 1
            while (j < count && minX[indices[j]] < maxX[first]) {
                val second = indices[j]
                if (maxX[second] > minX[first]) emit(first, second)
                j++
            }
        }
    }
}
