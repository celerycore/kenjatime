package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlin.test.assertFalse

class ControllerSubsetTest {
    @Test fun utilityControllersModifyOnlyThisFighterAndAssertFlagsExpire() {
        val states = MugenCnsParser.parse("""
            [Statedef 0]
            type=S
            ctrl=1
            [State 0, vars]
            type=VarRangeSet
            trigger1=Time=0
            first=2
            last=5
            value=8
            [State 0, randomized]
            type=VarRandom
            trigger1=Time=0
            v=9
            range=4
            [State 0, turn]
            type=Turn
            trigger1=Time=0
            [State 0, scale velocity]
            type=VelMul
            trigger1=Time=0
            x=.5
            y=1
            [State 0, preserve life]
            type=LifeSet
            trigger1=Time=0
            value=888
            [State 0, mute]
            type=AssertSpecial
            trigger1=Time=0
            flag=nomusic
        """.trimIndent())
        val actor = FightingCharacter(FighterDefinition("utility",states=states),1)
        actor.velX = 2 * Fixed.ONE
        val opponent = FightingCharacter(FighterDefinition("untouched"),2)
        val fight = DeterministicFight(actor,opponent)
        fight.step()
        assertFalse(actor.facingRight)
        assertEquals(888,actor.life)
        assertEquals(Fixed.ONE,actor.velX)
        assertEquals(8,actor.vars[2])
        assertEquals(8,actor.vars[5])
        assertTrue(actor.vars[9] in 0..4)
        assertTrue("nomusic" in actor.asserted)
        assertEquals(1000,opponent.life)
        fight.step()
        assertFalse("nomusic" in actor.asserted)
    }

    @Test fun helperParentVarAndDestroySelfRetireBoundedState() {
        val source = """
            [Statedef 0]
            ctrl=1
            [State 0, create]
            type=Helper
            trigger1=Time=0
            id=2
            stateno=200
            [Statedef 200]
            type=S
            [State 200, set parent]
            type=ParentVarSet
            trigger1=Time=0
            v=11
            value=123
            [State 200, retire]
            type=DestroySelf
            trigger1=Time=1
        """.trimIndent()
        val actor = FightingCharacter(FighterDefinition("parent",states=MugenCnsParser.parse(source)),1)
        val fight = DeterministicFight(actor, FightingCharacter(FighterDefinition("victim"),2))
        fight.step()
        assertEquals(1,fight.entities.helpers.size)
        fight.step()
        assertEquals(123,actor.vars[11])
        fight.step()
        assertEquals(0,fight.entities.helpers.size)
    }
}
