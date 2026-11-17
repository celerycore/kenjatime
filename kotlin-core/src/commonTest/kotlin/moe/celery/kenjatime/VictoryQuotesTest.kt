package moe.celery.kenjatime

import kotlin.test.*

class VictoryQuotesTest {
    private val quotes = """
        [Quotes]
        victory0 = "Default"
        victory5 = "Clean round; well played.\n\"Again?\""
    """.trimIndent()

    private fun match(left: String = quotes, right: String = quotes): DeterministicFight {
        val p1 = FightingCharacter(FighterDefinition.fromScript("Left", "", left), 1)
        val p2 = FightingCharacter(FighterDefinition.fromScript("Right", "", right), 2)
        return DeterministicFight(p1, p2).also {
            it.enableRoundFlow(CoreRoundRules(0, 0, 0, 1, 2, 1))
        }
    }

    @Test fun winnerMaySelectAQuoteDuringOutro() {
        val script = """
            $quotes
            [Statedef 0]
            [State 0, select after the round]
            type = VictoryQuote
            trigger1 = Win
            value = 4 + 1
        """.trimIndent()
        val fight = match(left = script, right = """[Quotes]
            victory5 = "Different fighter"
        """.trimIndent())
        repeat(3) { fight.step() }
        assertTrue(fight.roundFlow!!.active)
        fight.p2.life = 0
        fight.step()
        assertNull(fight.roundFlow!!.victoryQuote)
        assertEquals(1.0, CoreExpression.number("Win", fight.p1, fight.issues))
        assertEquals(1.0, CoreExpression.number("Lose", fight.p2, fight.issues))
        repeat(3) { fight.step() }
        assertEquals("Clean round; well played.\n\"Again?\"", fight.roundFlow!!.victoryQuote)
        val status = fight.roundFlow!!.statusJson()
        repeat(5) { fight.step(); assertEquals(status, fight.roundFlow!!.statusJson()) }
        assertTrue(fight.issues.isEmpty())
    }

    @Test fun tiesAndFightersWithoutQuotesHaveNoQuote() {
        val tie = match()
        repeat(66) { tie.step() }
        assertEquals(0, tie.roundFlow!!.winner)
        assertNull(tie.roundFlow!!.victoryQuote)
        assertEquals(1.0, CoreExpression.number("DrawGame", tie.p2, tie.issues))
        assertEquals(0.0, CoreExpression.number("Win", tie.p2, tie.issues))
        assertEquals(0.0, CoreExpression.number("Lose", tie.p1, tie.issues))

        val noQuotes = match(right = "")
        noQuotes.p1.life = 0
        repeat(7) { noQuotes.step() }
        assertEquals(2, noQuotes.roundFlow!!.winner)
        assertNull(noQuotes.roundFlow!!.victoryQuote)
    }

    @Test fun missingAndOutOfRangeSelectionsUseStableFallback() {
        val results = listOf(2, 99, 100, -1).map { index ->
            val fight = match()
            fight.p2.life = 0
            fight.p1.victoryQuoteIndex = index
            repeat(7) { fight.step() }
            fight.roundFlow!!.victoryQuote
        }
        assertEquals(1, results.toSet().size)
        assertTrue(results.first() in match().p1.definition.victoryQuotes.values)
    }

    @Test fun helperAndInvalidRequestsLeaveRootSelectionAlone() {
        val fight = match(left = quotes + "\n" + """
            [Statedef 0]
            [State 0, pick]
            type = VictoryQuote
            trigger1 = Time = 0
            value = 5
            [State 0, malformed]
            type = VictoryQuote
            trigger1 = Time = 0
            value = unknown
            [State 0, helper]
            type = Helper
            trigger1 = Time = 0
            stateno = 700
            [Statedef 700]
            [State 700, no quote]
            type = VictoryQuote
            trigger1 = 1
            value = 0
        """.trimIndent())
        repeat(5) { fight.step() }
        assertEquals(5, fight.p1.victoryQuoteIndex)
        assertEquals(-1, fight.entities.helpers.single().actor.victoryQuoteIndex)
        assertTrue(fight.issues.any { it.startsWith("Invalid VictoryQuote:") })
    }

    @Test fun malformedOrEmptyQuotesDoNotReplaceValidTextUnexpectedly() {
        val (entries, errors) = CoreVictoryQuotes.read("""
            [Quotes]
            victory0 = "Ready."
            victory0 = "Unclosed
            victory99 = " "
            victory100 = "Out of range"
        """.trimIndent())
        assertEquals(mapOf(0 to "Ready."), entries)
        assertEquals(1, errors.size)
    }
}
