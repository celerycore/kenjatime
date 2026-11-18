package moe.celery.kenjatime

/** Split CNS vectors without splitting commas inside expressions or quotes. */
internal object CnsArguments {
    fun split(raw: String): List<String> {
        require(raw.length <= 4096) { "CNS vector is too long" }
        var depth = 0
        var quote: Char? = null
        var start = 0
        val result = mutableListOf<String>()
        for ((i,c) in raw.withIndex()) {
            if (quote != null) { if(c == quote) quote = null; continue }
            when(c) {
                '\'', '"' -> quote = c
                '(', '[' -> depth++
                ')', ']' -> { depth--; require(depth >= 0) { "Unbalanced CNS vector" } }
                ',' -> if(depth == 0) { result.add(raw.substring(start,i).trim()); start = i+1 }
            }
        }
        require(depth == 0 && quote == null) { "Unbalanced CNS vector" }
        result.add(raw.substring(start).trim())
        return result
    }
}

internal data class CnsResourceExpression(val expression: String, val common: Boolean) {
    companion object {
        private val prefix = Regex("^[sSfF](?=\\s|[\\d(+.\\-])")

        // F selects the common bank and S selects the fighter's bank.
        // Leave expression names such as FVar and Sin intact.
        fun read(raw: String, defaultCommon: Boolean = false): CnsResourceExpression {
            val value = raw.trim()
            val bank = prefix.find(value)?.value?.lowercase()
            return if (bank == null) CnsResourceExpression(value, defaultCommon)
            else CnsResourceExpression(value.drop(1).trimStart(), bank == "f")
        }
    }
}
