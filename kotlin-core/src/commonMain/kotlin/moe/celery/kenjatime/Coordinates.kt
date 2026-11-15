package moe.celery.kenjatime

import kotlin.math.abs
import kotlin.math.round

/** MUGEN character units scale uniformly by 320/localcoord.x. Height is
 * viewport metadata, not an independent vertical stretch of the character.
 * Authoritative positions/velocities stay in canonical 1/256 stage pixels. */
class MugenCoordinates(val width: Int) {
    init { require(width in 160..4096) { "Invalid character coordinate width" } }
    val scale: Double = 320.0/width
    fun toLocal(worldFixed: Int): Double = toLocal(worldFixed.toLong())
    fun toLocal(worldFixed: Long): Double = worldFixed.toDouble()*width/(320.0*Fixed.ONE)
    fun toWorld(localPixels: Double): Int {
        require(localPixels.isFinite()) { "Nonfinite character coordinate" }
        if(width == 320)return Fixed.of(localPixels)
        val raw=localPixels*Fixed.ONE*320.0/width
        // Prevent an inverse conversion (PosSet x=Pos X) from drifting by a
        // subpixel through floating-point cancellation. All other values keep
        // the existing truncation policy. Tolerance is <1e-6 of a subpixel.
        val nearest=round(raw)
        return (if(abs(raw-nearest)<0.000001)nearest else raw).toInt()
    }
    fun fixedToWorld(localFixed: Int): Int = bounded(localFixed.toLong()*320/width)
    private fun bounded(value: Long) = value.coerceIn(Int.MIN_VALUE.toLong(),Int.MAX_VALUE.toLong()).toInt()
    /** Convert the whole AIR coordinate once, rather than truncating an
     * intermediate scale (e.g. 1008-wide sprites formerly used 81/256). */
    fun box(rect: MugenRect, x: Int, y: Int, right: Boolean,
            xScale: Int=Fixed.ONE, yScale: Int=Fixed.ONE): MugenRect {
        val face=if(right)1 else -1
        fun horizontal(v: Int)=x.toLong()+v.toLong()*xScale*320/width*face
        fun vertical(v: Int)=y.toLong()+v.toLong()*yScale*320/width
        val a=horizontal(rect.x1);val b=horizontal(rect.x2)
        val c=vertical(rect.y1);val d=vertical(rect.y2)
        return MugenRect(bounded(minOf(a,b)),bounded(minOf(c,d)),bounded(maxOf(a,b)),bounded(maxOf(c,d)))
    }
}
