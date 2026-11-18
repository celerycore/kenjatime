package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class HelperStateIsolationTest {
    private fun fight(script: String): DeterministicFight {
        val air = "[Begin Action 0]\n0,0,0,0,-1"
        val idle = "[Statedef 0]\nphysics=N\nanim=0\nctrl=0"
        val fighter = FighterDefinition.fromScript("helper fixture", air, "$idle\n$script")
        val opponent = FighterDefinition.fromScript("idle", air, idle)
        return DeterministicFight(FightingCharacter(fighter, 1), FightingCharacter(opponent, 2))
    }

    @Test fun rootGlobalWatchersDoNotMultiplyThroughTheirHelpers() {
        val match = fight("""
            [Statedef -3]
            [State -3, first watched helper]
            type=Helper
            trigger1=NumHelper(71)=0
            id=71
            stateno=700
            [Statedef -2]
            [State -2, second watched helper]
            type=Helper
            trigger1=NumHelper(72)=0
            id=72
            stateno=700
            [Statedef 700]
            physics=N
            anim=0
            [State 700, ordinary behavior]
            type=VarAdd
            trigger1=1
            v=4
            value=1
        """.trimIndent())
        repeat(120) {
            match.step()
            assertEquals(listOf(71, 72), match.entities.helpers.map { it.helperId })
        }
        assertTrue(match.entities.helpers.all { it.owner === match.p1 && it.actor.vars[4] == 119 })
        assertTrue(match.issues.isEmpty(), match.issues.toString())
    }

    @Test fun keyctrlHelpersInheritStateMinusOneAndMaySpawnChildrenFromPositiveStates() {
        val match = fight("""
            [Statedef -1]
            [State -1, command state marker]
            type=VarAdd
            trigger1=1
            v=5
            value=1
            [Statedef -2]
            [State -2, helper without key control]
            type=Helper
            trigger1=Time=0
            id=81
            stateno=700
            [State -2, helper with key control]
            type=Helper
            trigger1=Time=0
            id=82
            stateno=700
            keyctrl=1
            [Statedef 700]
            physics=N
            anim=0
            [State 700, legitimate nested helper]
            type=Helper
            trigger1=Time=0
            id=83
            stateno=701
            keyctrl=1
            [Statedef 701]
            physics=N
            anim=0
        """.trimIndent())
        repeat(4) { match.step() }
        assertEquals(4, match.p1.vars[5])
        val helpers = match.entities.helpers
        assertEquals(listOf(81, 82, 83, 83), helpers.map { it.helperId })
        assertEquals(listOf(0, 3, 2, 2), helpers.map { it.actor.vars[5] })
        assertEquals(listOf(helpers[0].actor, helpers[1].actor), helpers.drop(2).map { it.owner })
        assertTrue(match.issues.isEmpty(), match.issues.toString())
    }
}
