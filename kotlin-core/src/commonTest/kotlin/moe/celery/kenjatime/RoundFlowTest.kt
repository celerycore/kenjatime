package moe.celery.kenjatime

import kotlin.test.*

class RoundFlowTest {
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
