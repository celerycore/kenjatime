package moe.celery.kenjatime

/**
 * A bounded, preallocated flattened state ring for eventual rollback netcode.
 * Storage works today, but is not wired to authoritative matches: full
 * rollback also requires input history, RNG, controllers, helpers, projectiles,
 * animation and round-state snapshots before replay can be safe.
 */
class FixedStateRing(private val frames: Int, private val registerCount: Int) {
    init { require(frames in 2..64); require(registerCount in 1..262144) }
    private val tags = LongArray(frames) { Long.MIN_VALUE }
    private val states = IntArray(frames * registerCount)
    fun store(frame: Long, source: IntArray) {
        require(frame >= 0 && source.size >= registerCount)
        val slot = (frame % frames).toInt()
        source.copyInto(states, slot * registerCount, 0, registerCount)
        tags[slot] = frame
    }
    fun restore(frame: Long, destination: IntArray): Boolean {
        require(destination.size >= registerCount)
        if (frame < 0) return false
        val slot = (frame % frames).toInt()
        if (tags[slot] != frame) return false
        states.copyInto(destination, 0, slot * registerCount, (slot + 1) * registerCount)
        return true
    }
    fun clear() { tags.fill(Long.MIN_VALUE) }
}
