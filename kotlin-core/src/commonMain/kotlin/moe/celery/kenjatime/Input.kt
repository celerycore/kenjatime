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
    fun parseFile(source: String): List<MugenCommand> {
        val script = MugenDefParser.parse(source)
        val defaults = script.section("Defaults")
        val defaultTime = defaults?.int("command.time",15)?.coerceIn(1,360) ?: 15
        val defaultBuffer = defaults?.int("command.buffer.time",1)?.coerceIn(1,30) ?: 1
        return script.sectionsNamed("Command").take(4096).mapNotNull { section ->
            val name = section.get("name") ?: return@mapNotNull null
            val command = section.get("command") ?: return@mapNotNull null
            val steps = parseCommandString(command)
            if (steps.isEmpty() || steps.size > 64) return@mapNotNull null
            MugenCommand(name, steps,
                section.int("time", defaultTime).coerceIn(1, 360),
                section.int("buffer.time", defaultBuffer).coerceIn(1, 30))
        }
    }
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
class InputBuffer(private val capacity: Int = 360) {
    private val history = ArrayList<InputFrame>()
    init { require(capacity in 1..360) }
    fun clear() = history.clear()
    fun latest(): InputFrame? = history.firstOrNull()
    fun update(frame: InputFrame) {
        history.add(0, frame)
        if (history.size > capacity) history.removeAt(history.lastIndex)
    }
    fun matches(command: MugenCommand, isFacingRight: Boolean): Boolean {
        if (command.steps.isEmpty() || history.isEmpty()) return false
        val limit = minOf(history.size, command.timeBuffer.coerceAtLeast(1))
        var cursor = 0
        var newerStep: CommandStep? = null
        for (step in command.steps.asReversed()) {
            var found = false
            // The final input must be fresh; older motion history may fill the rest.
            val searchLimit = if (newerStep == null)
                minOf(limit, command.bufferTime.coerceAtLeast(1)) else limit
            while (cursor < searchLimit) {
                if (matchesStep(step, cursor, isFacingRight)) {
                    val sameFrameAsButton = newerStep?.let {
                        it.buttons.isNotEmpty() && it.direction == 0 && !it.release && step.direction != 0
                    } ?: false
                    if (!sameFrameAsButton) cursor++
                    newerStep = step
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
            current.directions and expected == expected
        } else {
            // Ordinary D/B/F/U require the exact direction, not a diagonal.
            current.directions == expected
        }
        if (!directionMatches) return false
        if (step.release) {
            val heldBefore = if (step.buttons.isNotEmpty())
                step.buttons.all { it in older.buttons }
                else expected != 0 && older.directions and expected == expected
            val releasedNow = if (step.buttons.isNotEmpty())
                step.buttons.any { it !in current.buttons }
                else expected != 0 && current.directions and expected != expected
            if (!heldBefore || !releasedNow) return false
            // For ~N symbols, an uninterrupted hold lasting N preceding samples is required.
            for (past in (index+1) until (index+1+step.minHold)) {
                val sample = history.getOrNull(past) ?: return false
                if (step.buttons.isNotEmpty()) {
                    if (!sample.buttons.containsAll(step.buttons)) return false
                } else if (sample.directions and expected != expected) return false
            }
            return true
        }
        if (!current.buttons.containsAll(step.buttons)) return false
        if (step.held) {
            for (i in index until minOf(history.size, index + step.minHold)) {
                if (!history[i].buttons.containsAll(step.buttons)) return false
            }
        }
        // Button steps must be a press event rather than auto-firing every held tick.
        if (step.held) return true
        val buttonPressed = step.buttons.any { it !in older.buttons }
        if (step.direction != 0 && step.buttons.isEmpty()) {
            val previousDirectionMatches = if (step.fourWay)
                older.directions and expected == expected else older.directions == expected
            return !previousDirectionMatches
        }
        return step.buttons.isEmpty() || buttonPressed
    }
}
