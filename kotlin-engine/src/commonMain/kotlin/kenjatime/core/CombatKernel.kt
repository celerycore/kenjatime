package kenjatime.core

/**
 * Exact-envelope **candidate generation only** for projectile clashes.
 *
 * This is deliberately NOT a port of MUGEN HitDef resolution. The JavaScript
 * Core still performs the immutable AIR Clsn2 narrowphase, distance/ID sort,
 * priority negotiation, and timed removal. Preserving that order is essential
 * to the existing native-comparison traces.
 *
 * Primitive struct-of-arrays avoids one JS object allocation per candidate.
 * Collected pairs are ordered by original spawn index (i,j), not by X-axis,
 * so the existing clash order remains deterministic across the JS/Wasm bridge.
 */
class ProjectileClashKernel(val capacity: Int) {
    init { require(capacity in 1..1024) { "Expected 1..1024 projectiles" } }

    private val minX = DoubleArray(capacity)
    private val minY = DoubleArray(capacity)
    private val maxX = DoubleArray(capacity)
    private val maxY = DoubleArray(capacity)
    private val teams = IntArray(capacity)
    private val paused = BooleanArray(capacity)
    private val removing = BooleanArray(capacity)
    private val present = BooleanArray(capacity)
    private val maxPairs = capacity * (capacity - 1) / 2
    private var pairs = IntArray(minOf(maxPairs * 2, 128).coerceAtLeast(2))
    private var count = 0

    var pairCount: Int = 0
        private set
    var examinedPairs: Int = 0
        private set
    var envelopePairs: Int = 0
        private set

    fun clear() {
        count = 0
        pairCount = 0
        examinedPairs = 0
        envelopePairs = 0
    }

    fun add(
        x0: Double, y0: Double, x1: Double, y1: Double,
        team: Int, isFrozen: Boolean, isRemoving: Boolean
    ) {
        require(count < capacity) { "Projectile limit exceeded" }
        val i = count++
        minX[i] = x0; minY[i] = y0; maxX[i] = x1; maxY[i] = y1
        teams[i] = team; paused[i] = isFrozen; removing[i] = isRemoving
        present[i] = x0.isFinite() && y0.isFinite() && x1.isFinite() &&
            y1.isFinite() && x0 <= x1 && y0 <= y1
    }

    private fun append(a: Int, b: Int) {
        val offset = pairCount * 2
        if (offset + 2 > pairs.size) {
            val next = minOf(maxPairs * 2, maxOf(pairs.size * 2, offset + 2))
            require(next > pairs.size) { "Projectile pair limit exceeded" }
            pairs = pairs.copyOf(next)
        }
        pairs[offset] = a
        pairs[offset + 1] = b
        pairCount++
    }

    fun collect(inclusive: Boolean): Int {
        pairCount = 0
        examinedPairs = 0
        envelopePairs = 0
        for (i in 0 until count) {
            if (removing[i] || !present[i]) continue
            for (j in i + 1 until count) {
                if (teams[i] == teams[j] || removing[j] ||
                    paused[i] && paused[j] || !present[j]) continue
                examinedPairs++
                val horizontal = if (inclusive)
                    minX[i] <= maxX[j] && maxX[i] >= minX[j]
                else minX[i] < maxX[j] && maxX[i] > minX[j]
                if (!horizontal) continue
                val vertical = if (inclusive)
                    minY[i] <= maxY[j] && maxY[i] >= minY[j]
                else minY[i] < maxY[j] && maxY[i] > minY[j]
                if (!vertical) continue
                envelopePairs++
                append(i, j)
            }
        }
        return pairCount
    }

    fun left(index: Int): Int {
        require(index in 0 until pairCount)
        return pairs[index * 2]
    }
    fun right(index: Int): Int {
        require(index in 0 until pairCount)
        return pairs[index * 2 + 1]
    }
}

/**
 * Scheduling bitmask for legacy CNS and IKEMEN extended globals. The actual
 * script ASTs, redirections, triggers and mutation remain owned by Core.
 * The caller must recompute the mask after state-changing controllers.
 */
object GlobalCombatSchedule {
    const val PRE_GLOBAL = 1         // StateDef -4
    const val ROOT_GLOBAL = 2        // StateDef -3
    const val OWNER_GLOBAL = 4       // StateDef -2
    const val COMMAND_GLOBAL = 8     // StateDef -1
    const val CURRENT_STATE = 16
    const val POST_GLOBAL = 32       // StateDef +1 (not numeric StateDef 1)

    fun mask(
        root: Boolean, keyCtrl: Boolean, ownsState: Boolean,
        worldPaused: Boolean, initializing: Boolean, destroyed: Boolean
    ): Int {
        if (destroyed) return 0
        var result = PRE_GLOBAL or POST_GLOBAL
        if (worldPaused) return result
        result = result or CURRENT_STATE
        if (root) {
            if (ownsState) result = result or ROOT_GLOBAL
            result = result or OWNER_GLOBAL
        }
        if (keyCtrl && ownsState && !initializing) result = result or COMMAND_GLOBAL
        return result
    }
}
