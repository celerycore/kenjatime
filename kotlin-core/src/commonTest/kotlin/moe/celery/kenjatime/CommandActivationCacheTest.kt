package moe.celery.kenjatime

import kotlin.test.*

class CommandActivationCacheTest {
    @Test fun cachedCommandsExpireAtTheNextPhysicalInputSample() {
        val cmd=MugenCommand("attack",MugenCommandParser.parseCommandString("a"))
        val source="""
            [Statedef 0]
            ctrl=1
            [State 0, key]
            type=VarAdd
            trigger1=command = "attack"
            v=1
            value=1
        """.trimIndent()
        val actor=FightingCharacter(FighterDefinition("controller",states=MugenCnsParser.parse(source)),1,listOf(cmd))
        val fight=DeterministicFight(actor,FightingCharacter(FighterDefinition("dummy"),2))
        fight.step(InputFrame(buttons=setOf('a')))
        assertEquals(1,actor.vars[1])
        fight.step(InputFrame())
        assertEquals(1,actor.vars[1])
        fight.step(InputFrame(buttons=setOf('a')))
        assertEquals(2,actor.vars[1])
        assertTrue(fight.issues.isEmpty(),fight.issues.joinToString())
    }
}
