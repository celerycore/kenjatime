package moe.celery.kenjatime

import kotlin.test.*

class CommandParityExtendedTest {
    @Test fun regularDirectionalPressDoesNotMatchDiagonalButDollarDoes() {
        val b=InputBuffer()
        b.update(InputFrame(Directions.DF))
        assertFalse(b.matches(MugenCommand("down",MugenCommandParser.parseCommandString("D")),true))
        assertTrue(b.matches(MugenCommand("tolerant",MugenCommandParser.parseCommandString("$"+"D")),true))
    }

    @Test fun chargedReleaseNeedsMinimumUninterruptedHold() {
        val b=InputBuffer()
        repeat(25) { b.update(InputFrame(Directions.L)) }
        b.update(InputFrame())
        val tooLong=MugenCommand("charge",MugenCommandParser.parseCommandString("~30B"),360)
        val enough=MugenCommand("short",MugenCommandParser.parseCommandString("~20B"),360)
        assertFalse(b.matches(tooLong,true))
        assertTrue(b.matches(enough,true))
    }

    @Test fun commandFileDefaultsApplyToAllRepeatedSections() {
        val commands = MugenCommandParser.parseFile("""
            [Defaults]
            command.time=31
            command.buffer.time=4
            [Command]
            name = "first"
            command = D, DF, F, a
            [Command]
            name = "first"
            command = D, DF, F, b
            buffer.time=6
        """.trimIndent())
        assertEquals(2,commands.size)
        assertEquals("first",commands[0].name)
        assertEquals("first",commands[1].name)
        assertEquals(31,commands[0].timeBuffer)
        assertEquals(4,commands[0].bufferTime)
        assertEquals(6,commands[1].bufferTime)
    }

    @Test fun duplicateDirectionalButtonsNeedReleaseBeforeSecondPress() {
        val cmd=MugenCommand("double",MugenCommandParser.parseCommandString("F, F"),30)
        val b=InputBuffer()
        b.update(InputFrame(Directions.R))
        repeat(3) { b.update(InputFrame(Directions.R)) }
        assertFalse(b.matches(cmd,true))
        b.update(InputFrame())
        b.update(InputFrame(Directions.R))
        assertTrue(b.matches(cmd,true))
    }
}
