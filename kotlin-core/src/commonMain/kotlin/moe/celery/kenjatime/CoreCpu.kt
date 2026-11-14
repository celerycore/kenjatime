package moe.celery.kenjatime

import kotlin.math.abs

/** Deterministic built-in benchmark opponent controller.
 *
 * All choices, command motions and timing are authored in Kotlin/commonMain,
 * run at the exact 60 Hz fight clock, and replay identically on JVM/Wasm.
 * This is not a replacement for MUGEN's authored AI controllers: those still
 * run as parsed CNS states in FightingCharacter.tick().
 */
object CoreCpu {
    private val attacks = arrayOf(
        setOf('a'), setOf('b'), setOf('c'),
        setOf('x'), setOf('y'), setOf('z')
    )
    private val combo = arrayOf(
        setOf('a','b'), setOf('x','y'), setOf('b','c')
    )
    fun input(fighter: FightingCharacter, opponent: FightingCharacter, tick: Long,
              level: Int = 4): InputFrame {
        val difficulty = level.coerceIn(1,8)
        val phase = (tick + fighter.id * 37L).toInt().let { (it % 180 + 180) % 180 }
        val forward = if (fighter.facingRight) Directions.R else Directions.L
        val distance = abs(opponent.posX.toLong() - fighter.posX.toLong()) / Fixed.ONE
        // Slow opposition remains reproducible, with no wall-clock or Math.random calls.
        if (difficulty <= 2 && phase % 20 >= 12) return InputFrame()
        if (opponent.stateType == "A" && distance <= 90 && phase % 30 < 5)
            return InputFrame(Directions.U or forward, attacks[(phase/30)%attacks.size])
        if (distance > 95)
            return InputFrame(forward, if (phase % 24 == 1) attacks[phase%attacks.size] else emptySet())
        // Multi-tick quarter-circle input. The final attack is held for only
        // a few authored CMD frames; MUGEN input-buffer matching owns activation.
        if (phase in 70..87) return when (phase) {
            in 70..75 -> InputFrame(Directions.D)
            in 76..81 -> InputFrame(Directions.D or forward)
            else -> InputFrame(forward, attacks[(phase / 6) % attacks.size])
        }
        if (phase in 130..151) return when (phase) {
            in 130..136 -> InputFrame(Directions.D)
            in 137..142 -> InputFrame(Directions.D or forward)
            else -> InputFrame(forward, combo[(phase / 7)%combo.size])
        }
        if (phase in 28..36) return InputFrame(Directions.U or forward,
            if (phase % 3 == 0) attacks[(phase/3)%attacks.size] else emptySet())
        if (phase % 24 in 0..4) return InputFrame(forward)
        if (phase % 17 in 5..11) return InputFrame(Directions.D,
            attacks[(phase/17)%attacks.size])
        return InputFrame(0, attacks[(phase/9)%attacks.size])
    }
}

/** Never drop combat ticks when reducing presentation; this Kotlin clock is
 * shared by the browser worker and the Android WebView build.
 *
 * `claim` returns the next bounded number of identical 1/60s ticks. Debt
 * stays owed until actually executed, so visually skipping frames does not
 * accelerate animations or ignore authored hitboxes/input.
 */
class CoreTickBudget(private val maximumBatch: Int = 6) {
    init { require(maximumBatch in 1..16) }
    private var epochMs: Double? = null
    var completed: Long = 0L
        private set
    var overdue: Long = 0L
        private set
    var target: Long = 0L
        private set

    fun claim(nowMs: Double): Int {
        if (!nowMs.isFinite()) return 0
        val first = epochMs
        if (first == null || nowMs < first) {
            epochMs = nowMs; target = completed; overdue = 0L
            return 0
        }
        val due = ((nowMs - first) * 60.0 / 1000.0 + 0.000001).toLong()
        target = maxOf(completed, due.coerceAtLeast(0L))
        val owing = (target - completed).coerceAtLeast(0L)
        overdue = owing
        return minOf(maximumBatch.toLong(), owing).toInt()
    }
    fun completedOne() {
        completed++
        overdue = (target - completed).coerceAtLeast(0L)
    }
    fun reset(nowMs: Double) {
        require(nowMs.isFinite())
        epochMs=nowMs; completed=0; overdue=0; target=0
    }
}
