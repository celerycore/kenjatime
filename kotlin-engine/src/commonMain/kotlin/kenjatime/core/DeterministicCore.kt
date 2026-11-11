package kenjatime.core

/**
 * 16.16 signed fixed point. This portable wrapper is not used in inner loops;\n * raw IntArray registers avoid boxing on both JVM and Kotlin/Wasm.\n * Operations intentionally wrap Int32 after widened multiplication.
 * Do not convert live MUGEN float32 expressions to fixed point without differential tests.
 */
data class Fixed16(val raw: Int) {
    companion object {
        const val SHIFT = 16
        val ZERO = Fixed16(0)
        val ONE = Fixed16(1 shl SHIFT)
        fun ofInt(value: Int): Fixed16 = Fixed16(value shl SHIFT)
        fun ofRaw(value: Int): Fixed16 = Fixed16(value)
    }
    operator fun plus(other: Fixed16) = Fixed16(raw + other.raw)
    operator fun minus(other: Fixed16) = Fixed16(raw - other.raw)
    operator fun unaryMinus() = Fixed16(-raw)
    operator fun times(other: Fixed16) =
        Fixed16(((raw.toLong() * other.raw.toLong()) shr SHIFT).toInt())
    operator fun div(other: Fixed16): Fixed16 {
        require(other.raw != 0) { "Division by zero" }
        return Fixed16(((raw.toLong() shl SHIFT) / other.raw.toLong()).toInt())
    }
    fun toIntFloor(): Int = raw shr SHIFT
    fun toDouble(): Double = raw.toDouble() / (1 shl SHIFT)
}

/** Fixed-size, allocation-free 5-int collision box buffer: type, x1, y1, x2, y2. */
class CollisionBoxes(maxBoxes: Int) {
    val data = IntArray(maxBoxes * 5)
    var size = 0
        private set
    fun clear() { size = 0 }
    fun add(type: Int, x1: Int, y1: Int, x2: Int, y2: Int) {
        require(size * 5 < data.size) { "Collision box capacity exceeded" }
        require(x1 <= x2 && y1 <= y2) { "Invalid collision bounds" }
        val o = size++ * 5
        data[o] = type; data[o+1] = x1; data[o+2] = y1
        data[o+3] = x2; data[o+4] = y2
    }
}

/**
 * Reuses preallocated primitive arrays for all entity bounding envelopes.
 * Stable insertion sort on minX; callback is invoked only for overlapping envelopes.
 * Inclusive collision edges follow the current Kenjatime compatibility behavior.
 */
class SweepBroadphase(maxEntities: Int) {
    private val minX = IntArray(maxEntities)
    private val maxX = IntArray(maxEntities)
    private val minY = IntArray(maxEntities)
    private val maxY = IntArray(maxEntities)
    private val ids = IntArray(maxEntities)
    private val sorted = IntArray(maxEntities)
    private var count = 0
    fun clear() { count = 0 }
    fun add(id: Int, x1: Int, y1: Int, x2: Int, y2: Int) {
        require(count < ids.size) { "Entity capacity exceeded" }
        require(x1 <= x2 && y1 <= y2)
        val i = count++
        ids[i] = id; minX[i] = x1; maxX[i] = x2
        minY[i] = y1; maxY[i] = y2
    }
    fun overlaps(onPair: (Int, Int) -> Unit) {
        for (i in 0 until count) {
            var j = i
            while (j > 0 && minX[sorted[j - 1]] > minX[i]) {
                sorted[j] = sorted[j - 1]
                j--
            }
            sorted[j] = i
        }
        for (i in 0 until count) {
            val a = sorted[i]
            for (j in i + 1 until count) {
                val b = sorted[j]
                if (minX[b] > maxX[a]) break
                if (maxX[b] >= minX[a] && minY[b] <= maxY[a] && maxY[b] >= minY[a]) {
                    onPair(ids[a], ids[b])
                }
            }
        }
    }
}
