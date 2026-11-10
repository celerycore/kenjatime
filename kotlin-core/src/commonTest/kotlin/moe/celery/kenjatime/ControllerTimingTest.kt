package moe.celery.kenjatime

import kotlin.test.*

class ControllerTimingTest {
    @Test fun persistentZeroFiresOncePerStateAndResetsOnReentry() {
        val source = """
            [Statedef 0]
            type=S
            [State 0, one-shot]
            type=VarAdd
            trigger1=1
            persistent=0
            v=3
            value=5
            [State 0, every second]
            type=VarAdd
            trigger1=1
            persistent=2
            v=4
            value=1
        """.trimIndent()
        val a=FightingCharacter(FighterDefinition("timing",states=MugenCnsParser.parse(source)),1)
        val w=DeterministicFight(a,FightingCharacter(FighterDefinition("dummy"),2))
        repeat(5) { w.step() }
        assertEquals(5,a.vars[3])
        assertEquals(3,a.vars[4])
        a.changeState(0)
        w.step()
        assertEquals(10,a.vars[3])
        assertEquals(4,a.vars[4])
    }

    @Test fun ignoreHitPauseControllersRunButTimeAnimationAndPositionRemainFrozen() {
        val source = """
            [Statedef 0]
            type=S
            [State 0, allowed]
            type=VarAdd
            trigger1=1
            ignorehitpause=1
            v=1
            value=1
            [State 0, blocked]
            type=VarAdd
            trigger1=1
            v=2
            value=1
        """.trimIndent()
        val a=FightingCharacter(FighterDefinition("timing",states=MugenCnsParser.parse(source)),1)
        val w=DeterministicFight(a,FightingCharacter(FighterDefinition("dummy"),2))
        a.velX=Fixed.ONE
        a.hitPauseLeft=3
        repeat(3){w.step()}
        assertEquals(3,a.vars[1])
        assertEquals(0,a.vars[2])
        assertEquals(0,a.posX)
        assertEquals(0,a.timeInState)
        assertEquals(0,a.hitPauseLeft)
        w.step()
        assertEquals(4,a.vars[1])
        assertEquals(1,a.vars[2])
        assertEquals(Fixed.ONE,a.posX)
        assertEquals(1,a.timeInState)
    }

    @Test fun ignoredControllersCanStillTriggerDuringHitPauseThroughGlobalStates() {
        val source = """
            [Statedef 0]
            [Statedef -2]
            [State -2, pause condition]
            type=VarSet
            trigger1=Time = 0 && var(5) = 0
            ignorehitpause=1
            v=5
            value=99
        """.trimIndent()
        val a=FightingCharacter(FighterDefinition("global",states=MugenCnsParser.parse(source)),1)
        val w=DeterministicFight(a,FightingCharacter(FighterDefinition("dummy"),2))
        a.hitPauseLeft=2
        w.step()
        assertEquals(99,a.vars[5])
        assertEquals(0,a.timeInState)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
}
