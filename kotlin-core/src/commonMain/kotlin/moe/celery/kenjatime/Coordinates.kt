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
            xScale: Int=Fixed.ONE, yScale: Int=Fixed.ONE): MugenRect =
        box(rect,x.toLong(),y.toLong(),right,xScale,yScale)
    /** Keep translated axes wide until each complete vertex is saturated. */
    internal fun box(rect: MugenRect, x: Long, y: Long, right: Boolean,
            xScale: Int=Fixed.ONE, yScale: Int=Fixed.ONE): MugenRect {
        val face=if(right)1 else -1
        fun horizontal(v: Int)=x+v.toLong()*xScale*320/width*face
        fun vertical(v: Int)=y+v.toLong()*yScale*320/width
        val a=horizontal(rect.x1);val b=horizontal(rect.x2)
        val c=vertical(rect.y1);val d=vertical(rect.y2)
        return MugenRect(bounded(minOf(a,b)),bounded(minOf(c,d)),bounded(maxOf(a,b)),bounded(maxOf(c,d)))
    }
    /** Dimensionless authored projectile scales need not fit the fighter's
     * 1/256 Size metadata. Truncate each complete offset once before adding
     * the world axis; saturate before addition to avoid Long overflow. */
    fun scaledBox(rect: MugenRect,x: Int,y: Int,right: Boolean,scaleX: Double,scaleY: Double): MugenRect =
        scaledBoxOffsets(rect, right, scaleX, scaleY).translate(x, y, ::MugenRect)

    internal fun scaledBoxOffsets(rect: MugenRect, right: Boolean, scaleX: Double, scaleY: Double): ScaledBoxOffsets {
        require(scaleX.isFinite() && scaleY.isFinite())
        fun offset(value: Int, factor: Double, face: Int) =
            (value.toDouble()*factor*Fixed.ONE*320/width*face).toLong()
        val face = if (right) 1 else -1
        val a = offset(rect.x1, scaleX, face); val b = offset(rect.x2, scaleX, face)
        val c = offset(rect.y1, scaleY, 1); val d = offset(rect.y2, scaleY, 1)
        return ScaledBoxOffsets(minOf(a, b), minOf(c, d), maxOf(a, b), maxOf(c, d))
    }
}

/** Scaling is fixed for a projectile's current AIR element. Only its origin moves. */
internal class ScaledBoxOffsets(private val left: Long, private val top: Long,
                                private val right: Long, private val bottom: Long) {
    inline fun <T> translate(x: Int, y: Int, result: (Int, Int, Int, Int) -> T): T =
        result(translateAxis(x, left), translateAxis(y, top), translateAxis(x, right), translateAxis(y, bottom))

    private fun translateAxis(origin: Int, offset: Long): Int {
        val bounded = offset.coerceIn(Int.MIN_VALUE.toLong() - origin, Int.MAX_VALUE.toLong() - origin)
        return (origin + bounded).toInt()
    }
}
