package moe.celery.kenjatime

import kotlin.test.*

class RoundFlowTest {
    @Test fun endlessKnockoutStartsFreshActorsAndKeepsTheClockAndAssets() {
        val definition = FighterDefinition("endless probe")
        val fight = DeterministicFight(FightingCharacter(definition, 1), FightingCharacter(definition, 2))
        fight.configureArena(-250, 250)
        fight.p1.posX = -70 * Fixed.ONE
        fight.p2.posX = 70 * Fixed.ONE
        fight.commonAnimations.catalog("[Begin Action 77]\n3,2,0,0,-1", 0.5)
        fight.enableEndlessRounds(2)
        fight.p1.posX = -250 * Fixed.ONE
        fight.p1.vars[0] = 59
        fight.p2.life = 0
        repeat(2) {
            fight.step()
            assertSame(fight, fight.continueEndlessRounds())
        }
        fight.step()
        val next = fight.continueEndlessRounds()
        assertNotSame(fight, next)
        assertEquals(3L, next.frame)
        assertEquals(2, next.roundNumber)
        assertEquals(1000, next.p2.life)
        assertEquals(-70 * Fixed.ONE, next.p1.posX)
        assertEquals(70 * Fixed.ONE, next.p2.posX)
        assertEquals(0, next.p1.vars[0])
        assertEquals(fight.arena, next.arena)
        assertEquals(0.5, next.commonAnimations.scale)
        assertEquals(3, next.commonAnimations.action(77)?.frames?.single()?.group)
        assertSame(next, next.continueEndlessRounds())
    }
    private fun match():DeterministicFight =
        DeterministicFight(
            FightingCharacter(FighterDefinition("A"),1),
            FightingCharacter(FighterDefinition("B"),2)
        )

    @Test fun normalRoundAnnouncesFightTimesOutThenPlaysKoAndOutro() {
        val fight=match()
        fight.enableRoundFlow(CoreRoundRules(2,2,2,2,2,1))
        assertEquals(CoreRoundPhase.INTRO,fight.roundFlow?.phase)
        repeat(2){fight.step()}
        assertEquals(CoreRoundPhase.ROUND,fight.roundFlow?.phase)
        repeat(2){fight.step()}
        assertEquals(CoreRoundPhase.FIGHT_CUE,fight.roundFlow?.phase)
        repeat(2){fight.step()}
        assertEquals(CoreRoundPhase.ACTIVE,fight.roundFlow?.phase)
        assertEquals(2,fight.roundFlow?.roundState())
        repeat(60){fight.step()}
        assertEquals(CoreRoundPhase.KO,fight.roundFlow?.phase)
        assertEquals(0,fight.roundFlow?.winner)
        assertEquals(0,fight.roundFlow?.remainingTicks)
        repeat(2){fight.step()}
        assertEquals(CoreRoundPhase.OUTRO,fight.roundFlow?.phase)
        repeat(2){fight.step()}
        assertEquals(CoreRoundPhase.FINISHED,fight.roundFlow?.phase)
        assertTrue(fight.roundFlow!!.finished)
        val before=fight.roundFlow?.phaseTime
        repeat(10){fight.step()}
        assertEquals(before,fight.roundFlow?.phaseTime)
    }

    @Test fun lifeDepletionSelectsWinnerOnFirstActiveTick() {
        val fight=match()
        fight.enableRoundFlow(CoreRoundRules(0,0,0,1,1,99))
        repeat(3){fight.step()}
        assertTrue(fight.roundFlow!!.active)
        fight.p2.life=0
        fight.step()
        assertEquals(CoreRoundPhase.KO,fight.roundFlow?.phase)
        assertEquals(1,fight.roundFlow?.winner)
    }

    @Test fun roundPhasesBlockCommandsUntilFightWithoutChangingDefaultTrainingMode() {
        val cmd=MugenCommand("attack",MugenCommandParser.parseCommandString("a"))
        val state = MugenCnsParser.parse("""
            [Statedef 0]
            ctrl=1
            [State 0, attack]
            type=ChangeState
            trigger1=command = "attack"
            value=200
            [Statedef 200]
            anim=200
        """.trimIndent())
        val a=FightingCharacter(FighterDefinition("fighter",states=state),1,listOf(cmd))
        val match=DeterministicFight(a,FightingCharacter(FighterDefinition("dummy"),2))
        match.enableRoundFlow(CoreRoundRules(2,2,2,1,1,99))
        repeat(5){match.step(InputFrame(buttons=setOf('a')))}
        assertEquals(0,a.stateNo)
        match.step()
        assertEquals(CoreRoundPhase.ACTIVE,match.roundFlow?.phase)
        match.step(InputFrame(buttons=setOf('a')))
        assertEquals(200,a.stateNo)
    }
}
