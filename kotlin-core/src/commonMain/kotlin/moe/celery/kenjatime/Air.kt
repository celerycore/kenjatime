package moe.celery.kenjatime

import kotlin.math.roundToInt

data class MugenRect(val x1: Int, val y1: Int, val x2: Int, val y2: Int) {
    fun world(x: Int, y: Int, facingRight: Boolean, scale: Int = 256, scaleY: Int = scale): MugenRect {
        val a = x + x1 * (if (facingRight) 1 else -1) * scale
        val b = x + x2 * (if (facingRight) 1 else -1) * scale
        return MugenRect(minOf(a, b), minOf(y + y1 * scaleY, y + y2 * scaleY),
            maxOf(a, b), maxOf(y + y1 * scaleY, y + y2 * scaleY))
    }
    fun intersects(other: MugenRect): Boolean = x1 < other.x2 && x2 > other.x1 &&
        y1 < other.y2 && y2 > other.y1
}
data class AirBox(val attack: Boolean, val rect: MugenRect)
data class AirFrame(
    val group: Int, val sprite: Int, val offsetX: Int, val offsetY: Int,
    val duration: Int, val flip: String = "", val boxes: List<AirBox> = emptyList(),
    val transparency: String = "", val scaleX: Double = 1.0, val scaleY: Double = 1.0,
    val angle: Double = 0.0, internal val interpolation: Int = 0
) {
    internal val blend=CoreTransparency.air(transparency)
    internal val visual = AirVisualFrame(group, sprite, offsetX.toDouble(), offsetY.toDouble(), flip,
        scaleX, scaleY, angle, blend)
}
internal data class AirVisualFrame(
    val group: Int, val sprite: Int, val offsetX: Double, val offsetY: Double, val flip: String,
    val scaleX: Double, val scaleY: Double, val angle: Double, val blend: SpriteBlend?
)

private const val INTERPOLATE_OFFSET = 1
private const val INTERPOLATE_BLEND = 2
private const val INTERPOLATE_SCALE = 4
private const val INTERPOLATE_ANGLE = 8
data class AirAction(val number: Int, val frames: List<AirFrame>, val loopIndex: Int? = null) {
    // Shared by all actors using this immutable action. Trigger reads never
    // rebuild cumulative frame durations or walk an action from its start.
    internal val timing = AirTiming(frames, loopIndex)
}

internal class AirTiming(frames: List<AirFrame>, requestedLoop: Int?) {
    val starts = LongArray(frames.size + 1)
    val infiniteIndex = frames.indexOfFirst { it.duration < 0 }
    val loopIndex = requestedLoop?.takeIf { it in frames.indices } ?: 0
    val duration: Long?
    init {
        for (i in frames.indices) starts[i+1] = starts[i] + frames[i].duration.coerceAtLeast(1)
        duration = if (infiniteIndex < 0) starts.last() else null
    }
    fun elementTime(time: Long, element: Int): Long {
        require(element in 1 until starts.size) { "Animation element out of range: $element" }
        return time - starts[element-1]
    }
    fun elementAt(cycleTime: Long, index: Int, looped: Boolean, offset: Int): Int {
        require(starts.size > 1) { "Animation has no elements" }
        if (offset == 0) return index+1
        require(infiniteIndex < 0 || index <= infiniteIndex) {
            "AnimElemNo offset after bypassing an infinite element is unsupported"
        }
        var time = cycleTime + offset.toLong()
        val end = duration
        if (end != null && (looped || index >= loopIndex || time >= end)) {
            val intro = starts[loopIndex]
            val length = end - intro
            time = intro + ((time-intro) % length + length) % length
        } else require(time >= 0) { "Animation offset precedes its start" }
        // An infinite element owns all future time, even if the AIR text
        // happens to contain additional, normally unreachable elements.
        if (infiniteIndex >= 0 && time >= starts[infiniteIndex]) return infiniteIndex+1
        var low = 0
        var high = starts.lastIndex
        while (low < high) {
            val middle = (low+high) ushr 1
            if (time < starts[middle+1]) high = middle else low = middle+1
        }
        return low+1
    }
}

class AirAnimationPlayer(val action: AirAction) {
    var index = 0
        private set
    var tick = 0
        private set
    var finished = false
        private set
    var elapsed = 0L
        private set
    private var cycleTime = 0L
    private var looped = false
    val frame: AirFrame? get() = action.frames.getOrNull(index)
    internal fun visualFrame(): AirVisualFrame? {
        val current = frame ?: return null
        val flags = current.interpolation
        val visual = current.visual
        if (flags == 0 || current.duration <= 0 || tick == 0) return visual
        val next = (action.frames.getOrNull(index + 1) ?: action.frames[action.timing.loopIndex]).visual
        val fraction = tick.toDouble() / current.duration
        fun sample(flag: Int, from: Double, to: Double) = if (flags and flag != 0) from + (to - from) * fraction else from
        val a = visual.blend
        val b = next.blend
        val blend = if (flags and INTERPOLATE_BLEND != 0 && a?.mode == "add" && b?.mode == "add") {
            SpriteBlend("add",
                sample(INTERPOLATE_BLEND, a.source.toDouble(), b.source.toDouble()).roundToInt(),
                sample(INTERPOLATE_BLEND, a.destination.toDouble(), b.destination.toDouble()).roundToInt())
        } else a
        return visual.copy(
            offsetX = sample(INTERPOLATE_OFFSET, visual.offsetX, next.offsetX),
            offsetY = sample(INTERPOLATE_OFFSET, visual.offsetY, next.offsetY),
            scaleX = sample(INTERPOLATE_SCALE, visual.scaleX, next.scaleX),
            scaleY = sample(INTERPOLATE_SCALE, visual.scaleY, next.scaleY),
            angle = sample(INTERPOLATE_ANGLE, visual.angle, next.angle),
            blend = blend
        )
    }
    /** Signed time from the end; -1 for an indefinite action. At a loop
     * boundary, expose zero for one simulation tick before resuming the loop. */
    val remaining: Long get() = if (frame == null || finished) 0L else
        action.timing.duration?.let { cycleTime-it } ?: -1L
    fun elementTime(element: Int): Long = action.timing.elementTime(elapsed, element)
    fun elementAt(offset: Int): Int = action.timing.elementAt(cycleTime, index, looped, offset)
    fun reset() { index = 0; tick = 0; finished = false; elapsed = 0L; cycleTime = 0L; looped = false }
    fun selectElement(element: Int) {
        require(element in 1..action.frames.size)
        index = element - 1; tick = 0; finished = false
        elapsed = action.timing.starts[index]; cycleTime = elapsed; looped = false
    }
    fun advance() {
        val f = frame ?: return
        // Keep the completed cycle's time visible at the boundary. This is
        // why AnimElem = loopElement does not fire again at the loop seam;
        // authored code can use AnimTime = 0 to detect that tick instead.
        if (finished) elapsed = cycleTime
        finished = false
        elapsed++; cycleTime++
        if (f.duration < 0) { if (tick < Int.MAX_VALUE) tick++; return }
        tick++
        if (tick >= f.duration.coerceAtLeast(1)) {
            tick = 0
            if (index + 1 == action.frames.size) {
                index = action.timing.loopIndex
                cycleTime = action.timing.starts[index]
                finished = true
                looped = true
            } else index++
        }
    }
}

/** AIR ClsnDefault applies until replaced, ClsnN applies only to the next frame. */
object MugenAirParser {
    private val actionHeader = Regex("\\[Begin\\s+Action\\s+(-?\\d+)]", RegexOption.IGNORE_CASE)
    private val boxHeader = Regex("Clsn([12])(Default)?\\s*:\\s*(\\d+)", RegexOption.IGNORE_CASE)
    private val boxLine = Regex("Clsn([12])\\s*\\[\\s*(\\d+)\\s*]\\s*=\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*,\\s*(-?\\d+)", RegexOption.IGNORE_CASE)
    private val interpolationLine = Regex("Interpolate\\s+(Offset|Blend|Scale|Angle)", RegexOption.IGNORE_CASE)
    fun parse(source: String): Map<Int, AirAction> {
        require(source.length <= 16_777_216)
        val actions = linkedMapOf<Int, AirAction>()
        var id: Int? = null
        val frames = mutableListOf<AirFrame>()
        var loopIndex: Int? = null
        val defaults = arrayOfNulls<Array<AirBox?>>(2)
        val pending = arrayOfNulls<Array<AirBox?>>(2)
        val definitions = arrayOfNulls<Array<AirBox?>>(2)
        var loopInterpolation = 0
        fun flush() {
            if (loopInterpolation != 0 && frames.isNotEmpty()) {
                val last = frames.last()
                frames[frames.lastIndex] = last.copy(interpolation = last.interpolation or loopInterpolation)
            }
            id?.let { actions[it] = AirAction(it, frames.toList(), loopIndex) }
            frames.clear()
            defaults.fill(null); pending.fill(null); definitions.fill(null)
            loopIndex = null
            loopInterpolation = 0
        }
        for (raw in source.lineSequence()) {
            val line = raw.substringBefore(';').trim()
            if (line.isEmpty()) continue
            val header = actionHeader.matchEntire(line)
            if (header != null) { flush(); id = header.groupValues[1].toInt(); continue }
            if (id == null) continue
            if (line.startsWith("Clsn", true)) {
                val declaration = boxHeader.matchEntire(line)
                if (declaration != null) {
                    val kind = declaration.groupValues[1].toInt() - 1
                    val count = declaration.groupValues[3].toIntOrNull()?.takeIf { it <= 1024 } ?: 0
                    val boxes = arrayOfNulls<AirBox>(count)
                    definitions[kind] = boxes
                    if (declaration.groupValues[2].isNotEmpty()) {
                        defaults[kind] = boxes
                        pending[kind] = null
                    } else pending[kind] = boxes
                } else {
                    val match = boxLine.matchEntire(line) ?: continue
                    val kind = match.groupValues[1].toInt() - 1
                    val boxes = definitions[kind] ?: continue
                    val index = match.groupValues[2].toIntOrNull() ?: continue
                    if (index in boxes.indices) {
                        val coordinates = match.groupValues.drop(3).map { it.toIntOrNull() }
                        if (coordinates.any { it == null }) continue
                        boxes[index] = AirBox(kind == 0, MugenRect(
                            coordinates[0]!!, coordinates[1]!!, coordinates[2]!!, coordinates[3]!!))
                    }
                }
                continue
            }
            if (line.equals("Loopstart", true)) { loopIndex = frames.size; continue }
            val interpolation = interpolationLine.matchEntire(line)
            if (interpolation != null) {
                val flag = when (interpolation.groupValues[1].lowercase()) {
                    "offset" -> INTERPOLATE_OFFSET
                    "blend" -> INTERPOLATE_BLEND
                    "scale" -> INTERPOLATE_SCALE
                    else -> INTERPOLATE_ANGLE
                }
                if (frames.isEmpty()) loopInterpolation = loopInterpolation or flag
                else {
                    val last = frames.last()
                    frames[frames.lastIndex] = last.copy(interpolation = last.interpolation or flag)
                }
                continue
            }
            val values = line.split(',').map { it.trim() }
            if (values.size < 5) continue
            val numbers = values.take(5).map { it.toIntOrNull() }
            if (numbers.any { it == null }) continue
            val boxes = (pending[0] ?: defaults[0])?.filterNotNull().orEmpty() +
                (pending[1] ?: defaults[1])?.filterNotNull().orEmpty()
            fun number(index: Int, fallback: Double): Double = values.getOrNull(index)?.toDoubleOrNull()
                ?.takeIf { it.isFinite() && kotlin.math.abs(it) <= Float.MAX_VALUE } ?: fallback
            frames.add(AirFrame(numbers[0]!!, numbers[1]!!, numbers[2]!!,
                numbers[3]!!, numbers[4]!!,
                values.getOrNull(5) ?: "", boxes,
                values.getOrNull(6) ?: "", number(7, 1.0), number(8, 1.0), number(9, 0.0)))
            pending.fill(null)
        }
        flush()
        return actions
    }
}
