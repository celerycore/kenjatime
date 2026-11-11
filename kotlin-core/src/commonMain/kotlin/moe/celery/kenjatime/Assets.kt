package moe.celery.kenjatime

data class Rgba(val r: Int, val g: Int, val b: Int, val a: Int = 255)
data class MugenPalette(val colors: List<Rgba>) {
    init { require(colors.size == 256) }
    companion object {
        /** ACT palette = 768 RGB bytes; palette entry zero may be transparent for indexed sprites. */
        fun fromAct(bytes: ByteArray, transparentIndex: Int = 0): MugenPalette {
            require(bytes.size >= 768) { "Truncated ACT palette" }
            val rgb = (0 until 256).map { i ->
                Rgba(bytes[i * 3].toInt() and 255, bytes[i * 3 + 1].toInt() and 255,
                    bytes[i * 3 + 2].toInt() and 255, if (i == transparentIndex) 0 else 255)
            }
            return MugenPalette(rgb)
        }
    }
}
/** Index-to-RGBA expansion is palette-only; PCX/SFF decompression is NOT implemented here. */
object IndexedSprites {
    fun rgba(indices: ByteArray, width: Int, height: Int, palette: MugenPalette): ByteArray {
        require(width > 0 && height > 0 && width.toLong() * height <= 16_777_216L)
        require(indices.size == width * height)
        val output = ByteArray(indices.size * 4)
        for (i in indices.indices) {
            val color = palette.colors[indices[i].toInt() and 255]
            val p = i * 4
            output[p] = color.r.toByte(); output[p + 1] = color.g.toByte()
            output[p + 2] = color.b.toByte(); output[p + 3] = color.a.toByte()
        }
        return output
    }
}
data class MugenSoundSample(val group: Int, val number: Int, val wav: ByteArray)
object MugenSndParser {
    private fun u32(bytes: ByteArray, offset: Int): Long {
        require(offset >= 0 && offset + 4 <= bytes.size) { "Truncated SND header" }
        return (bytes[offset].toLong() and 255) or
            ((bytes[offset + 1].toLong() and 255) shl 8) or
            ((bytes[offset + 2].toLong() and 255) shl 16) or
            ((bytes[offset + 3].toLong() and 255) shl 24)
    }
    fun parse(bytes: ByteArray): List<MugenSoundSample> {
        require(bytes.size >= 24 && bytes.size <= 256 * 1024 * 1024) { "SND size unsupported" }
        require(bytes.copyOfRange(0, 11).decodeToString() == "ElecbyteSnd") { "Invalid SND magic" }
        val count = u32(bytes, 16).toInt()
        require(count in 0..100_000) { "Invalid SND sample count" }
        var next = u32(bytes, 20).toInt()
        val visited = mutableSetOf<Int>()
        val result = ArrayList<MugenSoundSample>()
        while (next != 0 && result.size < count) {
            require(next >= 24 && next + 16 <= bytes.size && visited.add(next)) { "Corrupt SND linked offsets" }
            val offset = u32(bytes, next).toInt()
            val length = u32(bytes, next + 4).toInt()
            val group = u32(bytes, next + 8).toInt()
            val number = u32(bytes, next + 12).toInt()
            require(length >= 0 && next.toLong() + 16 + length <= bytes.size) { "Invalid SND data length" }
            result.add(MugenSoundSample(group, number, bytes.copyOfRange(next + 16, next + 16 + length)))
            next = offset
        }
        return result
    }
}
