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
