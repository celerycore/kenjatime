package moe.celery.kenjatime

/** MUGEN files can contain repeated [State ...] sections, so never flatten them into a Map. */
data class MugenSection(val name: String, val entries: List<Pair<String, String>>) {
    fun get(key: String): String? = entries.lastOrNull { it.first.equals(key, true) }?.second
    fun all(key: String): List<String> = entries.filter { it.first.equals(key, true) }.map { it.second }
    fun int(key: String, default: Int = 0): Int = get(key)?.trim()?.toIntOrNull() ?: default
}
data class MugenDefFile(val sections: List<MugenSection>) {
    fun section(name: String): MugenSection? = sections.firstOrNull { it.name.equals(name, true) }
    fun sectionsNamed(name: String): List<MugenSection> = sections.filter { it.name.equals(name, true) }
}
/** Parse quoted semicolons, '=' and ':' assignments and duplicate sections without losing ordering. */
object MugenDefParser {
    fun parse(content: String): MugenDefFile {
        require(content.length <= 16_777_216) { "MUGEN script exceeds 16 MiB" }
        val result = ArrayList<MugenSection>()
        var section: String? = null
        var entries = ArrayList<Pair<String, String>>()
        fun flush() {
            val name = section
            if (name != null) result.add(MugenSection(name, entries.toList()))
            entries = ArrayList()
        }
        for (raw in content.removePrefix("\uFEFF").lineSequence()) {
            var quote = '\u0000'
            val line = StringBuilder()
            for (c in raw) {
                if (quote == '\u0000' && (c == '"' || c == '\'')) quote = c
                else if (quote == c) quote = '\u0000'
                if (c == ';' && quote == '\u0000') break
                line.append(c)
            }
            val stripped = line.toString().trim()
            if (stripped.isEmpty()) continue
            if (stripped.startsWith("[") && stripped.endsWith("]")) {
                flush()
                section = stripped.substring(1, stripped.length - 1).trim().lowercase()
                continue
            }
            if (section == null) continue
            val index = stripped.indexOfFirst { it == '=' || it == ':' }
            if (index < 1) continue
            val key = stripped.substring(0, index).trim().lowercase()
            val value = stripped.substring(index + 1).trim().removeSurrounding("\"").removeSurrounding("'")
            if (key.isNotEmpty()) entries.add(key to value)
        }
        flush()
        return MugenDefFile(result)
    }
}
