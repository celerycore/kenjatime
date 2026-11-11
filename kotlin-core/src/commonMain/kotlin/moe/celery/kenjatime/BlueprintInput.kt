package moe.celery.kenjatime

/**
 * 60-frame packed input recorder: direction bits 0..3, buttons bits 4..10.
 * The existing MUGEN CMD matcher remains authoritative while byte-for-byte
 * parity for all modifiers and facing changes is being tested.
 */
class PackedInputHistory(private val capacity: Int = 60) {
    companion object {
        fun buttonMask(buttons: Set<Char>): Int {
            var mask = 0
            for (button in buttons) {
                val index = "abcxyzs".indexOf(button.lowercaseChar())
                if (index >= 0) mask = mask or (1 shl index)
            }
            return mask
        }
    }
    init { require(capacity in 1..360) }
    private val samples = IntArray(capacity)
    private var next = 0
    var count = 0
        private set
    fun record(directionMask: Int, buttonMask: Int) {
        require(directionMask in 0..15 && buttonMask in 0..127)
        samples[next] = directionMask or (buttonMask shl 4)
        next = (next + 1) % capacity
        if (count < capacity) count++
    }
    /** age=0 is newest. */
    fun read(age: Int): Int {
        require(age in 0 until count)
        return samples[(next - 1 - age + capacity) % capacity]
    }
    fun clear() { next = 0; count = 0; samples.fill(0) }
    private fun dirName(mask: Int): String = when (mask) {
        Directions.U -> "U"
        Directions.D -> "D"
        Directions.L -> "B"
        Directions.R -> "F"
        Directions.D or Directions.R -> "DF"
        Directions.D or Directions.L -> "DB"
        Directions.U or Directions.R -> "UF"
        Directions.U or Directions.L -> "UB"
        else -> ""
    }
    /** Debug macro export, not a complete MUGEN-authoritative combo recorder. */
    fun exportCmd(name: String = "kenjatime_macro", time: Int = 145): String {
        require(name.matches(Regex("[A-Za-z_][A-Za-z0-9_]*")))
        require(time in 1..360)
        val tokens = mutableListOf<String>()
        var previousDirection = -1
        var previousButtons = 0
        for (age in (count - 1) downTo 0) {
            val input = read(age)
            val dir = input and 15
            val buttonBits = input ushr 4
            if (dir != previousDirection && dirName(dir).isNotEmpty()) tokens.add(dirName(dir))
            val pushed = buttonBits and previousButtons.inv()
            val buttonNames = "abcxyzs"
            if (pushed != 0) {
                val buttons = buildList {
                    for (i in 0..6) if (pushed and (1 shl i) != 0) add(buttonNames[i].toString())
                }
                if (buttons.isNotEmpty()) tokens.add(buttons.joinToString("+"))
            }
            previousDirection = dir
            previousButtons = buttonBits
        }
        val command = if (tokens.isEmpty()) "a" else tokens.joinToString(", ")
        return "[Command]\nname = \"$name\"\ncommand = $command\ntime = $time\n"
    }
}
