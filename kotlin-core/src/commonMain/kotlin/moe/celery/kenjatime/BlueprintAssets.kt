package moe.celery.kenjatime

/** Identical uploaded character scripts can reuse one immutable parse result. */
data class SharedCharacterAsset(
    val definition: FighterDefinition,
    val commands: List<MugenCommand>
)

/**
 * Refcounted registry; no global mutable fighter state is shared.
 * Full source identity keys are deliberately collision-free; entries disappear
 * on last release. Limits also protect untrusted ZIP imports.
 */
class SharedAssetRegistry<T : Any>(private val maxEntries: Int = 64) {
    private class Entry<T>(val value: T, var refs: Int)
    private val entries = mutableMapOf<String, Entry<T>>()
    init { require(maxEntries in 1..65536) }
    fun acquire(id: String, loader: () -> T): T {
        require(id.isNotEmpty() && id.length <= 48 * 1024 * 1024)
        val previous = entries[id]
        if (previous != null) {
            require(previous.refs < Int.MAX_VALUE)
            previous.refs++
            return previous.value
        }
        require(entries.size < maxEntries) { "Asset registry budget exceeded" }
        val value = loader()
        entries[id] = Entry(value, 1)
        return value
    }
    fun release(id: String): Boolean {
        val item = entries[id] ?: return false
        item.refs--
        if (item.refs == 0) entries.remove(id)
        return true
    }
    fun references(id: String): Int = entries[id]?.refs ?: 0
    val size: Int get() = entries.size
}
