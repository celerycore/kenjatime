package kenjatime.core

/** Fixed 60-frame history. newest frame is age 0, previous frame age 1. */
class InputHistory(val capacity: Int = 60) {
    init { require(capacity > 0) }
    private val frames = IntArray(capacity)
    private var next = 0
    var size = 0
        private set
    fun push(bits: Int) {
        frames[next] = bits
        next = (next + 1) % capacity
        if (size < capacity) size++
    }
    fun atAge(age: Int): Int {
        require(age in 0 until size)
        return frames[(next - 1 - age + capacity) % capacity]
    }
    /** Motion steps in oldest-to-newest order; every step must occur within maxAge. */
    fun matches(steps: IntArray, maxAge: Int, exact: Boolean = false): Boolean {
        if (steps.isEmpty()) return false
        var index = steps.lastIndex
        val limit = minOf(maxAge, size - 1)
        for (age in 0..limit) {
            val state = atAge(age)
            val expected = steps[index]
            if (if (exact) state == expected else (state and expected) == expected) {
                index--
                if (index < 0) return true
            }
        }
        return false
    }
}

/** Snapshot slots hold full primitive game-state registers, not references to mutable actors. */
class SnapshotRing(val slots: Int, val registerCount: Int) {
    init { require(slots > 0 && registerCount > 0) }
    private val frames = IntArray(slots) { Int.MIN_VALUE }
    private val registers = IntArray(slots * registerCount)
    fun save(frame: Int, state: IntArray) {
        require(frame >= 0 && state.size == registerCount)
        val slot = frame % slots
        state.copyInto(registers, slot * registerCount)
        frames[slot] = frame
    }
    fun restore(frame: Int, destination: IntArray): Boolean {
        require(frame >= 0 && destination.size == registerCount)
        val slot = frame % slots
        if (frames[slot] != frame) return false
        registers.copyInto(destination, 0, slot * registerCount, (slot + 1) * registerCount)
        return true
    }
}

/** Fixed-point tick pacing, keeping integer physics steps distinct from render frequency. */
class TickAccumulator {
    private var fraction: Int = 0
    fun advance(rate: Fixed16): Int {
        require(rate.raw >= 0) { "Negative tick rate" }
        val total = fraction.toLong() + rate.raw.toLong()
        val steps = (total shr Fixed16.SHIFT).toInt()
        fraction = (total and 0xffffL).toInt()
        return steps
    }
    fun reset() { fraction = 0 }
}

/** No per-sample allocation; the timing source remains outside the deterministic simulation. */
class PhaseTelemetry(phaseCount: Int, val samples: Int = 120) {
    init { require(phaseCount > 0 && samples > 0) }
    private val values = DoubleArray(phaseCount * samples)
    private val totals = DoubleArray(phaseCount)
    private val counts = IntArray(phaseCount)
    private val next = IntArray(phaseCount)
    fun record(phase: Int, milliseconds: Double) {
        require(phase in counts.indices && milliseconds >= 0.0)
        val index = phase * samples + next[phase]
        totals[phase] += milliseconds - values[index]
        values[index] = milliseconds
        next[phase] = (next[phase] + 1) % samples
        if (counts[phase] < samples) counts[phase]++
    }
    fun average(phase: Int): Double =
        if (counts[phase] == 0) 0.0 else totals[phase] / counts[phase]
}

/** Deterministic reference counting over immutable parsed assets. */
class AssetRegistry<T : Any> {
    private class Entry<T>(val asset: T, var references: Int)
    private val entries = mutableMapOf<String, Entry<T>>()
    fun acquire(id: String, load: () -> T): T {
        val entry = entries[id]
        if (entry != null) { entry.references++; return entry.asset }
        val loaded = load()
        entries[id] = Entry(loaded, 1)
        return loaded
    }
    fun release(id: String, dispose: (T) -> Unit): Boolean {
        val entry = entries[id] ?: return false
        entry.references--
        if (entry.references == 0) {
            entries.remove(id)
            dispose(entry.asset)
        }
        return true
    }
    fun references(id: String): Int = entries[id]?.references ?: 0
}
