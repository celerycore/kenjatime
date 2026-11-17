package moe.celery.kenjatime

import kotlin.random.Random

internal object CoreVictoryQuotes {
    private val quoteKey = Regex("victory([0-9]{1,2})")

    fun read(source: String): Pair<Map<Int, String>, Set<String>> {
        val quotes = linkedMapOf<Int, String>()
        val issues = linkedSetOf<String>()
        for (section in MugenDefParser.parse(source, preserveQuotes = true).sectionsNamed("quotes")) {
            for ((key, raw) in section.entries) {
                val index = quoteKey.matchEntire(key)?.groupValues?.get(1)?.toInt() ?: continue
                try {
                    val quote = MugenQuotedText.decode(raw)
                    if (quote.isBlank()) quotes.remove(index) else quotes[index] = quote
                } catch (e: IllegalArgumentException) {
                    issues.add("Invalid victory quote $index: ${e.message}")
                }
            }
        }
        return quotes to issues
    }

    fun execute(actor: FightingCharacter, controller: StateController, errors: MutableSet<String>) {
        if (actor.parent != null) return
        try {
            require(controller.params.keys.all { it in setOf("type", "value", "persistent", "ignorehitpause") }) {
                "Unsupported parameter"
            }
            val raw = controller.params["value"]
            val value = if (raw == null) -1.0 else CoreExpression.numericValue(raw, actor, errors, "VictoryQuote")
                ?: throw IllegalArgumentException("Invalid value expression")
            actor.victoryQuoteIndex = value.toInt().takeIf { it in 0..99 } ?: -1
        } catch (e: IllegalArgumentException) {
            errors.add("Invalid VictoryQuote: ${e.message}")
        }
    }

    fun select(actor: FightingCharacter, remainingTicks: Int): String? {
        val quotes = actor.definition.victoryQuotes
        if (quotes.isEmpty()) return null
        quotes[actor.victoryQuoteIndex]?.let { return it }
        // This selection cannot advance the actor's combat RNG.
        val keys = quotes.keys.sorted()
        val random = Random(actor.id * 65537 + remainingTicks)
        return quotes.getValue(keys[random.nextInt(keys.size)])
    }
}
