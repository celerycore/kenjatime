package moe.celery.kenjatime

data class MugenRect(val x1: Int, val y1: Int, val x2: Int, val y2: Int) {
    fun world(x: Int, y: Int, facingRight: Boolean, scale: Int = 256): MugenRect {
        val a = x + x1 * (if (facingRight) 1 else -1) * scale
        val b = x + x2 * (if (facingRight) 1 else -1) * scale
        return MugenRect(minOf(a, b), minOf(y + y1 * scale, y + y2 * scale),
            maxOf(a, b), maxOf(y + y1 * scale, y + y2 * scale))
    }
    fun intersects(other: MugenRect): Boolean = x1 < other.x2 && x2 > other.x1 &&
        y1 < other.y2 && y2 > other.y1
}
data class AirBox(val attack: Boolean, val rect: MugenRect)
data class AirFrame(
    val group: Int, val sprite: Int, val offsetX: Int, val offsetY: Int,
    val duration: Int, val flip: String = "", val boxes: List<AirBox> = emptyList()
)
data class AirAction(val number: Int, val frames: List<AirFrame>)
class AirAnimationPlayer(val action: AirAction) {
    var index = 0
        private set
    var tick = 0
        private set
    var finished = false
        private set
    val frame: AirFrame? get() = action.frames.getOrNull(index)
    fun reset() { index = 0; tick = 0; finished = false }
    fun advance() {
        val f = frame ?: return
        if (finished || f.duration < 0) return
        tick++
        if (tick >= f.duration.coerceAtLeast(1)) {
            tick = 0
            if (index + 1 == action.frames.size) {
                index = 0
                finished = true
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
        val default = mutableListOf<AirBox>()
        val pending = mutableListOf<AirBox>()
        var usePending = false
        fun flush() { id?.let { actions[it] = AirAction(it, frames.toList()) }; frames.clear(); default.clear(); pending.clear(); usePending = false }
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
                        pending.removeAll { it.attack == line.startsWith("Clsn1", true) }
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
            if (line.startsWith("Loopstart", true)) continue
            val values = line.split(',').map { it.trim() }
            if (values.size < 5) continue
            val numbers = values.take(5).map { it.toIntOrNull() }
            if (numbers.any { it == null }) continue
            frames.add(AirFrame(numbers[0]!!, numbers[1]!!, numbers[2]!!,
                numbers[3]!!, numbers[4]!!,
                values.getOrNull(5) ?: "", if (usePending) default + pending else default.toList()))
            pending.clear()
            usePending = false
        }
        flush()
        return actions
    }
}
