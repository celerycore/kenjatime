package moe.celery.kenjatime

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
    val transparency: String = ""
) {
    internal val blend=CoreTransparency.air(transparency)
}
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
    private val boxLine = Regex("Clsn([12])\\[(\\d+)]\\s*=\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*,\\s*(-?\\d+)\\s*,\\s*(-?\\d+)", RegexOption.IGNORE_CASE)
    fun parse(source: String): Map<Int, AirAction> {
        require(source.length <= 16_777_216)
        val actions = linkedMapOf<Int, AirAction>()
        var id: Int? = null
        val frames = mutableListOf<AirFrame>()
        var loopIndex: Int? = null
        val default = mutableListOf<AirBox>()
        val pending = mutableListOf<AirBox>()
        var usePending = false
        val overridden = mutableSetOf<Boolean>()
        fun flush() {
            id?.let { actions[it] = AirAction(it, frames.toList(), loopIndex) }
            frames.clear(); default.clear(); pending.clear(); overridden.clear()
            usePending = false; loopIndex = null
        }
        for (raw in source.lineSequence()) {
            val line = raw.substringBefore(';').trim()
            if (line.isEmpty()) continue
            val header = actionHeader.matchEntire(line)
            if (header != null) { flush(); id = header.groupValues[1].toInt(); continue }
            if (id == null) continue
            if (line.startsWith("Clsn", true)) {
                when {
                    line.startsWith("Clsn1Default:", true) || line.startsWith("Clsn2Default:", true) -> {
                        default.removeAll { it.attack == line.startsWith("Clsn1", true) }
                    }
                    line.startsWith("Clsn1:", true) || line.startsWith("Clsn2:", true) -> {
                        usePending = true
                        val attacking = line.startsWith("Clsn1", true)
                        overridden.add(attacking)
                        pending.removeAll { it.attack == attacking }
                    }
                    else -> {
                        val m = boxLine.matchEntire(line)
                        if (m != null) {
                            val box = AirBox(m.groupValues[1] == "1", MugenRect(
                                m.groupValues[3].toInt(), m.groupValues[4].toInt(),
                                m.groupValues[5].toInt(), m.groupValues[6].toInt()))
                            if (usePending) pending.add(box) else default.add(box)
                        }
                    }
                }
                continue
            }
            if (line.equals("Loopstart", true)) { loopIndex = frames.size; continue }
            val values = line.split(',').map { it.trim() }
            if (values.size < 5) continue
            val numbers = values.take(5).map { it.toIntOrNull() }
            if (numbers.any { it == null }) continue
            frames.add(AirFrame(numbers[0]!!, numbers[1]!!, numbers[2]!!,
                numbers[3]!!, numbers[4]!!,
                values.getOrNull(5) ?: "", if (usePending) default.filterNot { it.attack in overridden } + pending else default.toList(),
                values.getOrNull(6) ?: ""))
            pending.clear()
            overridden.clear()
            usePending = false
        }
        flush()
        return actions
    }
}
