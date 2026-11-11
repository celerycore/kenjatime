package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

/** Regression for Dark Donald / Rare Akuma attacking before ROUND 1's FIGHT cue. */
class RoundReadinessRegressionTest {
    private fun aggressiveActor(name: String, id: Int): FightingCharacter {
        val states = MugenCnsParser.parse("""
            [Statedef 0]
            type = S
            movetype = I
            ctrl = 1
            [Statedef -3]
            [State -3, zero-input AI]
            type = ChangeState
            trigger1 = 1
            value = 200
            [Statedef 200]
            type = S
            movetype = A
            ctrl = 0
            [State 200, velocity]
            type = VelSet
            trigger1 = 1
            x = 13
        """.trimIndent())
        return FightingCharacter(FighterDefinition(name, states = states), id)
    }

    @Test fun globalAiCannotMoveAttackOrBufferInputsBeforeFight() {
        val a = aggressiveActor("Rare Akuma", 1)
        val b = aggressiveActor("Dark Donald", 2)
        val fight = DeterministicFight(a, b)
        fight.enableRoundFlow(CoreRoundRules(2, 3, 2, 2, 2, 99))
        a.posX = -70 * Fixed.ONE
        b.posX = 70 * Fixed.ONE
        repeat(7) { index ->
            assertFalse(fight.roundFlow!!.active)
            fight.step(
                InputFrame(Directions.R, setOf('a')),
                InputFrame(Directions.L, setOf('b'))
            )
            assertEquals(0, a.stateNo, "Rare Akuma advanced before FIGHT at tick $index")
            assertEquals(0, b.stateNo, "Dark Donald advanced before FIGHT at tick $index")
            assertEquals(-70 * Fixed.ONE, a.posX)
            assertEquals(70 * Fixed.ONE, b.posX)
            assertEquals(1000, a.life)
            assertEquals(1000, b.life)
            assertTrue(fight.contacts.isEmpty())
            assertEquals(0, fight.entities.helpers.size)
            assertEquals(0, fight.entities.projectiles.size)
        }
        assertTrue(fight.roundFlow!!.active)
        assertEquals(0, a.timeInState, "State script time begins at FIGHT")
        fight.step(InputFrame(), InputFrame())
        assertEquals(200, a.stateNo)
        assertEquals(200, b.stateNo)
    }

    @Test fun mirrorAtZeroLifeEndsAndDoesNotReviveDuringKo() {
        val a = aggressiveActor("Rare Akuma", 1)
        val b = aggressiveActor("Rare Akuma", 2)
        val fight = DeterministicFight(a, b)
        fight.enableRoundFlow(CoreRoundRules(0,0,0,2,2,99))
        repeat(3) { fight.step() }
        assertTrue(fight.roundFlow!!.active)
        a.life = 0
        b.life = 0
        fight.step()
        assertEquals(CoreRoundPhase.KO, fight.roundFlow!!.phase)
        assertEquals(0, fight.roundFlow!!.winner)
        repeat(4) { fight.step() }
        assertEquals(CoreRoundPhase.FINISHED, fight.roundFlow!!.phase)
    }
}
