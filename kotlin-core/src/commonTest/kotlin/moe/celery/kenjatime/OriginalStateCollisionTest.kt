package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class OriginalStateCollisionTest {
    @Test fun duplicateStateDefsAreReportedWithoutDroppingOtherStates() {
        val scripts = """
            [Statedef -3]
            [State -3, a]
            type=VarSet
            trigger1=1
            v=1
            value=3
            [Statedef 3503]
            [Statedef -3]
            [State -3, b]
            type=VarAdd
            trigger1=1
            v=1
            value=1
            [Statedef 3503]
            [Statedef 0]
        """.trimIndent()
        assertEquals(mapOf(-3 to 2,3503 to 2),MugenCnsParser.duplicateStateDefs(scripts))
        assertTrue(0 in MugenCnsParser.parse(scripts))
        assertEquals(2,MugenCnsParser.parse(scripts)[-3]?.controllers?.size)
    }
}
