package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertContentEquals

class BinaryArchiveTest {
    private fun put16(bytes: ByteArray, at: Int, value: Int) {
        bytes[at] = value.toByte()
        bytes[at + 1] = (value ushr 8).toByte()
    }
    private fun put32(bytes: ByteArray, at: Int, value: Int) {
        put16(bytes, at, value and 65535)
        put16(bytes, at + 2, value ushr 16)
    }
    @Test fun sndParsesWavPayloadAndRejectsBrokenLinkedOffsets() {
        val snd = ByteArray(512 + 16 + 4)
        "ElecbyteSnd".encodeToByteArray().copyInto(snd)
        put32(snd, 16, 1)
        put32(snd, 20, 512)
        put32(snd, 516, 4)
        put32(snd, 520, 33)
        put32(snd, 524, 2)
        byteArrayOf(1,2,3,4).copyInto(snd, 528)
        val samples = MugenSndParser.parse(snd)
        assertEquals(1, samples.size)
        assertEquals(33, samples[0].group)
        assertEquals(2, samples[0].number)
        assertContentEquals(byteArrayOf(1,2,3,4), samples[0].wav)
        put32(snd, 512, 512)
        assertFailsWith<IllegalArgumentException> { MugenSndParser.parse(snd) }
    }
    @Test fun sffV1PcxPaletteAndLinkedSprite() {
        val pcx = ByteArray(128 + 2 + 769)
        pcx[0] = 10; pcx[2] = 1; pcx[3] = 8; pcx[65] = 1
        pcx[66] = 2 // two-byte scanline for one visible pixel
        pcx[128] = 7; pcx[129] = 0
        pcx[130] = 12
        pcx[131 + 7 * 3] = 200.toByte()
        val secondOffset = 512 + 32 + pcx.size
        val archive = ByteArray(secondOffset + 32)
        "ElecbyteSpr".encodeToByteArray().copyInto(archive)
        archive[15] = 1
        put32(archive, 16, 1)
        put32(archive, 20, 2)
        put32(archive, 24, 512)
        put32(archive, 28, 32)
        put32(archive, 512, secondOffset)
        put32(archive, 516, pcx.size)
        put16(archive, 524, 10)
        put16(archive, 526, 0)
        pcx.copyInto(archive, 544)
        put16(archive, secondOffset + 12, 10)
        put16(archive, secondOffset + 14, 1)
        put16(archive, secondOffset + 16, 0)
        archive[secondOffset + 18] = 1
        val decoded = MugenSffV1(archive)
        assertEquals(2, decoded.entries.size)
        val frame = decoded.decodeByNumber(10, 1)
        assertEquals(1, frame.width)
        assertEquals(1, frame.height)
        assertEquals(7, frame.indices[0].toInt())
        assertEquals(200, frame.rgba()[0].toInt() and 255)
        assertEquals(255, frame.rgba()[3].toInt() and 255)
    }
}
