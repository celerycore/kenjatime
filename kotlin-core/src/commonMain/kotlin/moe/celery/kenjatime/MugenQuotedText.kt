package moe.celery.kenjatime

/** Authored CNS strings and their representation at the JSON boundary. */
internal object MugenQuotedText {
    fun decode(raw: String): String {
        require(raw.length<=8192 && raw.length>=2 && raw.first()=='"' && raw.last()=='"') { "text must be double quoted and at most 8192 characters" }
        return buildString {
            var i=1
            while(i<raw.lastIndex) {
                val c=raw[i++]
                require(c!='"') { "Unescaped quote" }
                if(c!='\\')append(c) else {
                    require(i<raw.lastIndex) { "Incomplete escape" }
                    append(when(val escaped=raw[i++]) {
                        'n' -> "\n";'t' -> "    ";'\\' -> "\\";'"' -> "\""
                        else -> throw IllegalArgumentException("Unsupported escape: $escaped")
                    })
                }
            }
        }
    }
    fun quote(text: String): String=buildString {
        append('"')
        for(c in text)when(c) {
            '"' -> append("\\\"");'\\' -> append("\\\\")
            else -> if(c.code<32)append("\\u"+c.code.toString(16).padStart(4,'0')) else append(c)
        }
        append('"')
    }
}
