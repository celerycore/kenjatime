package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class AirLoopTest {
    @Test fun loopStartReturnsToNamedFrameNotActionBeginning() {
        val action = MugenAirParser.parse("""
            [Begin Action 100]
            100,0,0,0,2
            Loopstart
            100,1,0,0,2
            100,2,0,0,2
        """.trimIndent()).getValue(100)
        assertEquals(1, action.loopIndex)
        val play = AirAnimationPlayer(action)
        repeat(2) { play.advance() }
        assertEquals(1, play.index)
        repeat(2) { play.advance() }
        assertEquals(2, play.index)
        repeat(2) { play.advance() }
        assertEquals(1, play.index)
        assertTrue(!play.finished)
    }

    @Test fun finiteActionRetainsLastSpriteAfterCompletion() {
        val action = MugenAirParser.parse("""
            [Begin Action 200]
            200,0,0,0,1
            200,1,0,0,2
        """.trimIndent()).getValue(200)
        val play = AirAnimationPlayer(action)
        repeat(50) { play.advance() }
        assertEquals(1, play.index)
        assertEquals(1, play.frame?.sprite)
        assertTrue(play.finished)
    }
}
