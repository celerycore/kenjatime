package moe.celery.kenjatime

data class SffV1Entry(
    val group: Int, val sprite: Int, val axisX: Int, val axisY: Int,
    val linkedIndex: Int, val samePalette: Boolean,
    val dataOffset: Int, val dataLength: Int
)
data class IndexedSprite(
    val group: Int, val sprite: Int, val axisX: Int, val axisY: Int,
    val width: Int, val height: Int, val indices: ByteArray, val palette: MugenPalette
) {
    fun rgba(override: MugenPalette? = null): ByteArray =
        IndexedSprites.rgba(indices, width, height, override ?: palette)
}
private data class PcxIndexed(
    val width: Int, val height: Int, val indices: ByteArray, val palette: MugenPalette?
)

/**
 * SFF 1.01 linked-list container and common single-plane 8-bit PCX decoding.
 * Never decodes SFF2 by accident. Handles indexed pixels and palette overrides
 * separately, avoiding per-costume copies of the original indexed sprite.
 */
class MugenSffV1(private val source: ByteArray) {
    val entries: List<SffV1Entry>
    private val sharedPalette: Boolean
    init {
        require(source.size in 512..(256 * 1024 * 1024)) { "Invalid SFF length" }
        require(source.copyOfRange(0, 11).decodeToString() == "ElecbyteSpr") { "Invalid SFF magic" }
        require((source[15].toInt() and 255) != 2) { "SFF2 requires its own decoder" }
        val count = u32(20).toInt()
        require(count in 0..100_000) { "Invalid SFF sprite count" }
        val header = u32(28).toInt()
        require(header in 32..512) { "Invalid SFF subheader size" }
        sharedPalette = source[32].toInt() != 0
        val result = ArrayList<SffV1Entry>()
        val seen = mutableSetOf<Int>()
        var off = u32(24).toInt()
        while (off != 0 && result.size < count) {
            require(off >= 512 && off.toLong() + header <= source.size && seen.add(off)) {
                "Invalid or cyclic SFF sprite offsets"
            }
            val length = u32(off + 4).toInt()
            require(length >= 0 && off.toLong() + header + length <= source.size) {
                "SFF sprite payload outside archive"
            }
            result.add(SffV1Entry(
                group = u16(off + 12), sprite = u16(off + 14),
                axisX = i16(off + 8), axisY = i16(off + 10),
                linkedIndex = u16(off + 16), samePalette = source[off + 18].toInt() != 0,
                dataOffset = off + header, dataLength = length
            ))
            off = u32(off).toInt()
        }
        entries = result.toList()
    }
    fun find(group: Int, sprite: Int): Int =
        entries.indexOfFirst { it.group == group && it.sprite == sprite }
    fun decodeByNumber(group: Int, sprite: Int, palette: MugenPalette? = null): IndexedSprite {
        val index = find(group, sprite)
        require(index >= 0) { "SFF sprite not found" }
        return decode(index, palette)
    }
    fun decode(index: Int, palette: MugenPalette? = null): IndexedSprite =
        decodeInternal(index, palette, mutableSetOf())
    private fun decodeInternal(index: Int, override: MugenPalette?, visited: MutableSet<Int>): IndexedSprite {
        require(index in entries.indices && visited.add(index)) { "Invalid or cyclic linked sprite" }
        val entry = entries[index]
        val pixels: PcxIndexed = if (entry.dataLength == 0) {
            require(entry.linkedIndex < index) { "Linked SFF sprite must reference an earlier entry" }
            val other = decodeInternal(entry.linkedIndex, override, visited)
            PcxIndexed(other.width, other.height, other.indices, other.palette)
        } else pcx(entry.dataOffset, entry.dataLength)
        val resolved = override ?: if (entry.samePalette || (sharedPalette && index > 0)) {
            // A shared color table is inherited from the last data-owning entry.
            previousPalette(index) ?: pixels.palette
        } else pixels.palette ?: previousPalette(index)
        require(resolved != null) { "No palette for indexed PCX sprite" }
        return IndexedSprite(entry.group, entry.sprite, entry.axisX, entry.axisY,
            pixels.width, pixels.height, pixels.indices, resolved)
    }
    private fun previousPalette(index: Int): MugenPalette? {
        for (i in index - 1 downTo 0) {
            val entry = entries[i]
            if (entry.dataLength > 0) {
                val at = entry.dataOffset + entry.dataLength - 769
                if (at >= entry.dataOffset + 128 && (source[at].toInt() and 255) == 12)
                    return MugenPalette.fromAct(source.copyOfRange(at + 1, at + 769))
            }
        }
        return null
    }
    private fun pcx(offset: Int, length: Int): PcxIndexed {
        require(length >= 128) { "Truncated PCX header" }
        fun byte(at: Int): Int = source[offset + at].toInt() and 255
        fun word(at: Int): Int = byte(at) or (byte(at + 1) shl 8)
        require(byte(0) == 10 && byte(2) == 1 && byte(3) == 8 && byte(65) == 1) {
            "Only RLE 8-bit single-plane PCX is supported"
        }
        val width = word(8) - word(4) + 1
        val height = word(10) - word(6) + 1
        val stride = word(66)
        require(width in 1..8192 && height in 1..8192 &&
            width.toLong() * height <= 16_777_216 &&
            stride in width..16384 && stride.toLong() * height <= 16_777_216) {
            "Invalid PCX dimensions"
        }
        val expanded = ByteArray(stride * height)
        var read = offset + 128
        val end = offset + length
        var written = 0
        while (written < expanded.size) {
            require(read < end) { "Truncated PCX RLE" }
            val op = source[read++].toInt() and 255
            val run = if ((op and 0xC0) == 0xC0) op and 0x3F else 1
            require(run > 0 && written + run <= expanded.size) { "Invalid PCX RLE run" }
            val value = if (run != 1 || op >= 0xC0) {
                require(read < end) { "Truncated PCX repeated color" }
                source[read++]
            } else op.toByte()
            repeat(run) { expanded[written++] = value }
        }
        val pixels = ByteArray(width * height)
        for (y in 0 until height)
            expanded.copyInto(pixels, y * width, y * stride, y * stride + width)
        val paletteIndex = end - 769
        val palette = if (paletteIndex >= offset + 128 &&
            (source[paletteIndex].toInt() and 255) == 12)
            MugenPalette.fromAct(source.copyOfRange(paletteIndex + 1, end)) else null
        return PcxIndexed(width, height, pixels, palette)
    }
    private fun u16(i: Int): Int =
        (source[i].toInt() and 255) or ((source[i + 1].toInt() and 255) shl 8)
    private fun i16(i: Int): Int = u16(i).let { if (it >= 32768) it - 65536 else it }
    private fun u32(i: Int): Long =
        (source[i].toLong() and 255) or
            ((source[i + 1].toLong() and 255) shl 8) or
            ((source[i + 2].toLong() and 255) shl 16) or
            ((source[i + 3].toLong() and 255) shl 24)
}
