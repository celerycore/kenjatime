package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class HelperLifecycleTest {
    private fun fight(script: String): DeterministicFight {
        val air = "[Begin Action 0]\n0,0,0,0,-1"
        val idle = "[Statedef 0]\nphysics=N\nanim=0\nctrl=0"
        val definition = FighterDefinition.fromScript("helper fixture", air, "$idle\n$script")
        val opponent = FighterDefinition.fromScript("opponent", air, idle)
        return DeterministicFight(FightingCharacter(definition, 1), FightingCharacter(opponent, 2))
    }

    @Test fun zeroAndNegativeHelperIdsCountTheWholePlayerFamily() {
        val match = fight("""
            [Statedef -2]
            [State -2, root watcher with wildcard ID]
            type=Helper
            trigger1=NumHelper(0)=0
            id=71
            stateno=700
            pausemovetime=99999999
            supermovetime=99999999
            [Statedef 700]
            physics=N
            anim=0
            [State 700, nested helper]
            type=Helper
            trigger1=Time=0
            id=72
            stateno=701
            [Statedef 701]
            physics=N
            anim=0
        """.trimIndent())
        repeat(70) { match.step() }
        assertEquals(listOf(71,72), match.entities.helpers.map { it.helperId })
        fun eval(actor: FightingCharacter, expression: String) =
            CoreExpression.number(expression, actor, match.issues)
        val child = match.entities.helpers.last().actor
        match.entities.helpers.first().actor.let {
            assertEquals(CorePauseMoves(99999999, 99999999), it.pauseMoves)
            it.vars[0] = 4
        }
        assertEquals(2.0, eval(match.p1, "NumHelper"))
        assertEquals(2.0, eval(child, "NumHelper(-1)"))
        assertEquals(1.0, eval(match.p1, "NumHelper(72)"))
        assertEquals(1.0, eval(child, "IsHelper(72)"))
        assertEquals(1.0, eval(match.p1, "Command = \"missing\" || Helper(71), Var(0)>0"))
        assertEquals(0.0, eval(match.p2, "NumHelper(0)"))
        assertTrue(match.issues.isEmpty(), match.issues.toString())
        assertEquals(null, eval(match.p2, "Helper(71), Var(0)"))
    }

    @Test fun parentAndRootConditionsAllowRecursiveHelperCleanup() {
        val match = fight("""
            [Statedef -2]
            [State -2, spawn once]
            type=Helper
            trigger1=GameTime=0
            id=71
            stateno=700
            [Statedef 700]
            physics=N
            anim=0
            [State 700, child]
            type=Helper
            trigger1=Time=0
            id=72
            stateno=701
            [State 700, cleanup when root reaches final state]
            type=DestroySelf
            triggerall=IsHelper(71)
            trigger1=Root, StateNo=5
            recursive=1
            [Statedef 701]
            physics=N
            anim=0
            [State 701, read parent time]
            type=VarSet
            trigger1=1
            v=0
            value=1+(Parent, Time)
            [Statedef 5]
            physics=N
            anim=0
        """.trimIndent())
        repeat(4) { match.step() }
        val child = match.entities.helpers.last().actor
        assertEquals(4, child.vars[0])
        match.p1.changeState(5)
        match.step()
        assertTrue(match.entities.helpers.isEmpty())
        assertTrue(child.destroyed)
        assertTrue(match.issues.isEmpty(), match.issues.toString())
    }

    @Test fun invalidHelperParametersCannotCreateDefaultStateClones() {
        val match = fight("""
            [Statedef -2]
            [State -2, unsupported ID expression]
            type=Helper
            trigger1=1
            id=Unimplemented()
            [State -2, nonexistent state]
            type=Helper
            trigger1=1
            id=99
            stateno=777
            [State -2, valid vector]
            type=Helper
            trigger1=GameTime=0
            id=72
            stateno=700
            pos=ifelse(1,23,2),-15
            [Statedef 700]
            physics=N
            anim=0
        """.trimIndent())
        repeat(8) { match.step() }
        val actor = match.entities.helpers.single().actor
        assertEquals(23*Fixed.ONE, actor.posX)
        assertEquals(-15*Fixed.ONE, actor.posY)
        assertTrue(match.issues.contains("Missing Helper start state: 777"))
        assertFalse(match.issues.contains("Helper resource limit exceeded"))
    }

    @Test fun limitDiagnosticsIdentifyTheGlobalControllerAndCurrentHelperState() {
        val match = fight("""
            [Statedef -2]
            [State -2, allowed]
            type=Helper
            trigger1=1
            id=71
            stateno=700
            [State -2, denied]
            type=Helper
            trigger1=1
            id=72
            stateno=701
            [Statedef 700]
            physics=N
            anim=0
            [Statedef 701]
            physics=N
            anim=0
        """.trimIndent())
        match.entities.maxHelpers = 1
        match.step()
        val json = match.entities.helperDiagnosticsJson()
        assertTrue(json.contains("\"blockedSpawns\":1"))
        assertTrue(json.contains("\"controllerState\":-2,\"id\":72,\"startState\":701"))
        assertTrue(json.contains("\"side\":1,\"id\":71,\"state\":700,\"count\":1"))
    }
}
