package moe.celery.kenjatime

import kotlin.test.*

class ControllerTimingTest {
    @Test fun aLaterAuthoredStateReplacesTheCommonDefinitionAsAUnit() {
        val common = "[Statedef 170]\nanim=0\n[State common]\ntype=VarSet\ntrigger1=1\nv=1\nvalue=5000"
        val custom = "[Statedef 170]\nanim=170\n[State custom]\ntype=VarSet\ntrigger1=1\nv=1\nvalue=170"
        val state = MugenCnsParser.parse("$common\n$custom", useAuthoredStateDefs=true).getValue(170)
        assertEquals(170, state.animation)
        assertEquals("170", state.controllers.single().params["value"])
    }
    @Test fun temporaryGrowthControllerStaysWithItsStateDefEvenWithAGlobalLabel() {
        val source = """
            [Statedef -2]
            [State startup]
            type=Helper
            trigger1=GameTime=0
            id=60
            stateno=600
            [Statedef 0]
            anim=0
            [State idle counter]
            type=VarAdd
            trigger1=1
            v=0
            value=1
            [Statedef 600]
            anim=0
            [State -2, grow the effect]
            type=AngleDraw
            trigger1=1
            scale=2+Time*.01,2+Time*.01
            [State cleanup]
            type=DestroySelf
            trigger1=Time=4
        """.trimIndent()
        val air = "[Begin Action 0]\n0,0,0,0,-1"
        val definition = FighterDefinition.fromScript("growth probe", air, source, useAuthoredStateDefs = true)
        val actor = FightingCharacter(definition, 1)
        val fight = DeterministicFight(actor, FightingCharacter(FighterDefinition("dummy"), 2))
        repeat(2) { fight.step() }
        assertEquals(2.0, fight.entities.helpers.single().actor.drawScaleX)
        assertEquals(1.0, actor.drawScaleX)
        repeat(598) {
            fight.step()
            assertEquals(1.0, actor.drawScaleX)
            assertEquals(0, actor.stateNo)
        }
        assertEquals(600, actor.vars[0])
        assertTrue(fight.entities.helpers.isEmpty())
        assertTrue(fight.issues.isEmpty(), fight.issues.toString())
    }

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
