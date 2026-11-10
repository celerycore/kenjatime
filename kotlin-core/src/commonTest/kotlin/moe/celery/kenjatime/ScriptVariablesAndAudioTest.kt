package moe.celery.kenjatime

import kotlin.test.*

class ScriptVariablesAndAudioTest {
    @Test fun alternateVariableAssignmentsWorkForIntegerFloatAndSystemSlots() {
        val source = """
            [Statedef 0]
            ctrl=1
            [State 0, alternate]
            type=VarSet
            trigger1=Time=0
            var(12)=3
            fvar(2)=0.75
            sysvar(0)=9
            sysfvar(4)=1.25
            [State 0, add]
            type=VarAdd
            trigger1=Time=0
            var(12)=2
            [State 0, multiply]
            type=VarMul
            trigger1=Time=0
            v=12
            value=3
        """.trimIndent()
        val a=FightingCharacter(FighterDefinition("variables",states=MugenCnsParser.parse(source)),1)
        val b=FightingCharacter(FighterDefinition("dummy"),2)
        val w=DeterministicFight(a,b)
        w.step()
        assertEquals(15,a.vars[12])
        assertEquals(0.75,a.fvars[2])
        assertEquals(9,a.sysVars[0])
        assertEquals(1.25,a.sysFvars[4])
        assertEquals(0,b.vars[12])
        assertTrue(CoreExpression.test("sysvar(0) = 9 && fvar(2) > .7",a,w.issues))
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun soundControllersEmitEventsWithoutAllocatingAudioInSimulation() {
        val source = """
            [Statedef 0]
            [State 0, sound]
            type=PlaySnd
            trigger1=Time=0
            value=4,2
            channel=3
            [State 0, stop]
            type=StopSnd
            trigger1=Time=0
            channel=7
        """.trimIndent()
        val a=FightingCharacter(FighterDefinition("audio",states=MugenCnsParser.parse(source)),1)
        val w=DeterministicFight(a,FightingCharacter(FighterDefinition("dummy"),2))
        w.step()
        assertEquals(listOf("playsnd","stopsnd"),w.presentation.map{it.type})
        assertEquals(4,w.presentation[0].group)
        assertEquals(2,w.presentation[0].number)
        assertEquals(3,w.presentation[0].channel)
        assertEquals(7,w.presentation[1].channel)
        w.step()
        assertTrue(w.presentation.isEmpty())
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
}
