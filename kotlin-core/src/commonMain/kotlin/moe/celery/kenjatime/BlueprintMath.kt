package moe.celery.kenjatime

/**
 * Deterministic signed 16.16 arithmetic for the next-generation combat kernel.
 * Saturation is intentional: malformed CNS expressions cannot wrap world coordinates.
 * Conversion from source decimals belongs at character load time, not inside ticks.
 *
 * This is a new opt-in representation. Existing Fixed (1/256 pixel) remains the
 * authoritative game simulation until native capture parity has been established.
 */
@JvmInline
value class Fixed16(val raw: Int) {
    companion object {
        const val SHIFT = 16
        const val SCALE = 1 shl SHIFT
        val ZERO = Fixed16(0)
        val ONE = Fixed16(SCALE)
        fun fromInt(value: Int): Fixed16 {
            require(value in -32768..32767) { "16.16 integer outside representable range" }
            return Fixed16(value shl SHIFT)
        }
        fun fromRatio(numerator: Int, denominator: Int): Fixed16 {
            require(denominator != 0)
            return Fixed16(saturate((numerator.toLong() shl SHIFT) / denominator))
        }
        /** Use only when compiling external data, never during simulation. */
        fun fromDouble(value: Double): Fixed16 {
            require(value.isFinite())
            val scaled = value * SCALE.toDouble()
            require(scaled >= Int.MIN_VALUE.toDouble() && scaled <= Int.MAX_VALUE.toDouble())
            return Fixed16(scaled.toInt())
        }
        fun fromLegacy8(raw256: Int): Fixed16 {
            require(raw256 in -8_388_608..8_388_607)
            return Fixed16(raw256 shl 8)
        }
        private fun saturate(v: Long): Int =
            v.coerceIn(Int.MIN_VALUE.toLong(), Int.MAX_VALUE.toLong()).toInt()
    }
    operator fun plus(other: Fixed16): Fixed16 =
        Fixed16((raw.toLong() + other.raw).coerceIn(Int.MIN_VALUE.toLong(), Int.MAX_VALUE.toLong()).toInt())
    operator fun minus(other: Fixed16): Fixed16 =
        Fixed16((raw.toLong() - other.raw).coerceIn(Int.MIN_VALUE.toLong(), Int.MAX_VALUE.toLong()).toInt())
    operator fun times(other: Fixed16): Fixed16 =
        Fixed16(((raw.toLong() * other.raw.toLong()) shr SHIFT)
            .coerceIn(Int.MIN_VALUE.toLong(), Int.MAX_VALUE.toLong()).toInt())
    operator fun div(other: Fixed16): Fixed16 {
        require(other.raw != 0)
        return Fixed16(((raw.toLong() shl SHIFT) / other.raw)
            .coerceIn(Int.MIN_VALUE.toLong(), Int.MAX_VALUE.toLong()).toInt())
    }
    fun toLegacy8Raw(): Int = raw shr 8
    fun toDouble(): Double = raw.toDouble() / SCALE
}

/** Fractional simulation clock: no floating-point delta in the deterministic tick. */
class FixedTickAccumulator(private val rate: Fixed16 = Fixed16.ONE) {
    init { require(rate.raw in 0..Fixed16.SCALE) }
    private var remainder = 0
    fun advance(): Boolean {
        remainder += rate.raw
        if (remainder < Fixed16.SCALE) return false
        remainder -= Fixed16.SCALE
        return true
    }
    fun reset() { remainder = 0 }
    fun remainderRaw(): Int = remainder
}
