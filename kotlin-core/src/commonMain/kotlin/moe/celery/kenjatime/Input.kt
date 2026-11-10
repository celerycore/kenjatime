package moe.celery.kenjatime

object Directions {
    const val NONE = 0
    const val U = 1
    const val D = 2
    const val L = 4
    const val R = 8
    const val DF = D or R
    const val DB = D or L
    const val UF = U or R
    const val UB = U or L
    fun facing(mask: Int, right: Boolean): Int {
        if (right) return mask
        val l = mask and L != 0
        val r = mask and R != 0
        return (mask and (L or R).inv()) or (if (l) R else 0) or (if (r) L else 0)
    }
}
data class InputFrame(val directions: Int = 0, val buttons: Set<Char> = emptySet())
data class CommandStep(
    val direction: Int = 0,
    val buttons: Set<Char> = emptySet(),
    val release: Boolean = false,
    val held: Boolean = false,
    val fourWay: Boolean = false,
    val strict: Boolean = false,
    val minHold: Int = 1
)
data class MugenCommand(val name: String, val steps: List<CommandStep>, val timeBuffer: Int = 15, val bufferTime: Int = 1)

object MugenCommandParser {
    private val buttons = "abcxyzs"
    fun parseCommandString(command: String): List<CommandStep> = command.split(',').mapNotNull { token ->
        val raw = token.trim()
        if (raw.isEmpty()) return@mapNotNull null
        val release = '~' in raw
        val held = '/' in raw
        val fourWay = '$' in raw
        val strict = '>' in raw
        val delay = Regex("~(\\d+)").find(raw)?.groupValues?.get(1)?.toIntOrNull() ?: 1
        val clean = raw.replace(Regex("[~/>$\\d ]"), "")
        // CMD directions are uppercase; lowercase b is an attack button.
        val direction = clean.filter { it in "UDFB" }
        val dir = when {
            "DF" in direction -> Directions.DF
            "DB" in direction -> Directions.DB
            "UF" in direction -> Directions.UF
            "UB" in direction -> Directions.UB
            "D" in direction -> Directions.D
            "U" in direction -> Directions.U
            "F" in direction -> Directions.R
            "B" in direction -> Directions.L
            else -> 0
        }
        val keys = clean.filter { it in buttons }.toSet()
        CommandStep(dir, keys, release, held, fourWay, strict, delay.coerceAtLeast(1))
    }
}

/** Newest frame at index zero; this buffer belongs to exactly one fighter. */
class InputBuffer(private val capacity: Int = 60) {
    private val history = ArrayList<InputFrame>()
    init { require(capacity in 1..360) }
    fun clear() = history.clear()
    fun update(frame: InputFrame) {
        history.add(0, frame)
        if (history.size > capacity) history.removeAt(history.lastIndex)
    }
    fun matches(command: MugenCommand, isFacingRight: Boolean): Boolean {
        if (command.steps.isEmpty() || history.isEmpty()) return false
        val limit = minOf(history.size, command.timeBuffer.coerceAtLeast(1))
        var cursor = 0
        for (step in command.steps.asReversed()) {
            var found = false
            while (cursor < limit) {
                if (matchesStep(step, cursor, isFacingRight)) {
                    cursor++
                    found = true
                    break
                }
                cursor++
            }
            if (!found) return false
        }
        return true
    }
    private fun matchesStep(step: CommandStep, index: Int, facingRight: Boolean): Boolean {
        val current = history[index]
        val older = history.getOrNull(index + 1) ?: InputFrame()
        val expected = Directions.facing(step.direction, facingRight)
        val directionMatches = expected == 0 || if (step.fourWay) {
            // $D matches D, DF, DB; normal D requires D and excludes U.
            current.directions and expected == expected
        } else current.directions and expected == expected &&
            (expected and Directions.D == 0 || current.directions and Directions.U == 0) &&
            (expected and Directions.U == 0 || current.directions and Directions.D == 0)
        if (!directionMatches) return false
        if (step.release) {
            val before = step.buttons.all { it in older.buttons }
            val after = step.buttons.any { it !in current.buttons }
            if (step.buttons.isNotEmpty()) return before && after
            return expected != 0 && older.directions and expected == expected &&
                current.directions and expected != expected
        }
        if (!current.buttons.containsAll(step.buttons)) return false
        if (step.held) {
            for (i in index until minOf(history.size, index + step.minHold)) {
                if (!history[i].buttons.containsAll(step.buttons)) return false
            }
        }
        // Button steps must be a press event rather than auto-firing every held tick.
        return step.buttons.isEmpty() || step.held || step.buttons.any { it !in older.buttons }
    }
}
