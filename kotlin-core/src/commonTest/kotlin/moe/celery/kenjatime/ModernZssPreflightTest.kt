package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

class ModernZssPreflightTest {
    @Test fun modernRareAkumaCommandStateCannotSilentlyBecomeAnEmptyCnsProgram() {
        val zss = """
            [StateDef -1]
            if ishelper(1)
            && pos y
            && stateno = [100,106] {
                changestate{value:6970}
            }
        """.trimIndent()
        val error = assertFailsWith<IllegalArgumentException> {
            FighterDefinition.fromScripts("Rare Akuma 2026","",
                listOf("[Data]\nlife=1000",zss))
        }
        assertTrue(error.message.orEmpty().contains("ZSS"))
    }
    @Test fun legacyMugenControllerHeadersStayAllowed() {
        val legacy = """
            [Statedef 0]
            type = S
            [State 0, legitimate CNS]
            type = ChangeState
            trigger1 = Time >= 10
            value = 20
            [Statedef 20]
            type = S
        """.trimIndent()
        val fighter = FighterDefinition.fromScripts("legacy","",listOf(legacy))
        assertTrue(0 in fighter.states && 20 in fighter.states)
    }
}
