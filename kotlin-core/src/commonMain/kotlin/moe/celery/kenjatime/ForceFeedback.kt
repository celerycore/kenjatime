package moe.celery.kenjatime

private enum class RumbleWave(val strong: Boolean, val weak: Boolean) {
    SINE(true, false),
    SQUARE(false, true),
    SINESQUARE(true, true),
    OFF(false, false),
}

private data class RumbleEffect(
    val wave: RumbleWave,
    val duration: Int,
    val amplitude: List<Double>,
    var age: Int = 0,
) {
    fun magnitude(): Double {
        val (a, b, c, d) = amplitude
        val t = age.toDouble()
        return ((a + t * (b + t * (c + t * d))) / 255.0).coerceIn(0.0, 1.0)
    }
}

/** Resolve routing, replacement, expiry and the envelope on simulation ticks.
 * The host receives only final motor strengths or a reset for each side. */
internal class CoreForceFeedback(private val fight: DeterministicFight) {
    private val effects = arrayOfNulls<RumbleEffect>(2)
    private val reset = BooleanArray(2)
    private val constant = Regex("[+-]?(?:[0-9]+(?:\\.[0-9]*)?|\\.[0-9]+)(?:[eE][+-]?[0-9]+)?")

    fun beginTick() {
        for (side in effects.indices) {
            reset[side] = false
            val effect = effects[side] ?: continue
            if (++effect.age >= effect.duration) stop(side)
        }
    }

    private fun stop(side: Int) {
        effects[side] = null
        reset[side] = true
    }
    fun resetMotors() { for (side in effects.indices) stop(side) }

    fun execute(actor: FightingCharacter, controller: StateController, errors: MutableSet<String>) {
        try {
            val args = controller.params
            val waveform = args["waveform"]?.trim()?.removeSurrounding("\"")?.lowercase() ?: "sine"
            val wave = RumbleWave.entries.firstOrNull { it.name.lowercase() == waveform }
                ?: throw IllegalArgumentException("Invalid waveform $waveform")
            fun number(raw: String): Double {
                val trimmed = raw.trim()
                require(constant.matches(trimmed)) { "Parameters require numeric constants" }
                return trimmed.toDoubleOrNull()?.takeIf { it.isFinite() }
                    ?: throw IllegalArgumentException("Parameters require finite constants")
            }
            fun integer(raw: String, range: IntRange): Int {
                val value = number(raw)
                val integer = value.toInt()
                require(integer in range && integer.toDouble() == value) { "Integer parameter out of range" }
                return integer
            }
            fun coefficients(key: String): List<Double> {
                val terms = args[key]?.split(',')?.map(::number) ?: listOf(128.0)
                require(terms.size <= 4 && terms[0] % 1 == 0.0) { "Invalid $key coefficients" }
                return List(4) { terms.getOrElse(it) { 0.0 } }
            }
            val duration = integer(args["time"] ?: "60", 0..360000)
            val self = integer(args["self"] ?: "1", 0..1) == 1
            coefficients("freq") // Accepted and validated as documented. MUGEN ignores it.
            val amplitude = coefficients("ampl")
            val ownSide = if (actor.rootActor() === fight.p1) 0 else 1
            val side = if (self) ownSide else 1 - ownSide
            if (wave == RumbleWave.OFF || duration == 0) stop(side)
            else {
                effects[side] = RumbleEffect(wave, duration, amplitude)
                reset[side] = false
            }
        } catch (e: IllegalArgumentException) {
            errors.add("Invalid ForceFeedback: ${e.message}")
        }
    }

    fun json(): String {
        if (effects.all { it == null } && reset.none { it }) return "[]"
        return effects.indices.mapNotNull { side ->
            val effect = effects[side]
            if (effect == null) {
                if (reset[side]) "{\"side\":$side,\"reset\":true}" else null
            } else {
                val magnitude = effect.magnitude()
                val strong = if (effect.wave.strong) magnitude else 0.0
                val weak = if (effect.wave.weak) magnitude else 0.0
                "{\"side\":$side,\"strongMagnitude\":$strong,\"weakMagnitude\":$weak}"
            }
        }.joinToString(prefix = "[", postfix = "]")
    }
}
