package moe.celery.kenjatime

/** Actor-owned numeric maps use the legacy engine's finite single-precision storage. */
internal class CoreNamedMaps(defaults: Map<String,Double> = emptyMap()) {
    private val values=linkedMapOf<String,Double>()
    val size: Int get()=values.size
    init { for((key,value) in defaults)write(key,value,false) }
    fun read(key: String): Double=values[name(key)] ?: 0.0
    fun write(key: String,value: Double,add: Boolean) {
        val key=name(key)
        require(key in values || values.size<MAX_ENTRIES) { "Named map limit exceeded" }
        require(value.isFinite()) { "Nonfinite map input" }
        val result=(value+if(add)values[key] ?: 0.0 else 0.0).toFloat()
        require(result.isFinite()) { "Nonfinite map result" }
        values[key]=if(result==0f)0.0 else result.toDouble()
    }
    fun json(): String=values.entries.joinToString(prefix="{",postfix="}",separator=",") {
        quote(it.key)+":"+it.value
    }
    companion object {
        const val MAX_ENTRIES=4096
        fun name(raw: String): String {
            val key=raw.lowercase()
            require(key.isNotEmpty() && key.length<=128 && '\u0000' !in key) { "Invalid map name" }
            return key
        }
        private fun quote(raw: String): String=buildString {
            append('"')
            for(c in raw)when(c) {
                '"' -> append("\\\"")
                '\\' -> append("\\\\")
                else -> if(c.code<32)append("\\u"+c.code.toString(16).padStart(4,'0')) else append(c)
            }
            append('"')
        }
        fun defaults(source: String): Pair<Map<String,Double>,Set<String>> {
            val maps=CoreNamedMaps();val errors=linkedSetOf<String>()
            for(section in MugenDefParser.parse(source).sectionsNamed("map"))for((key,raw)in section.entries) {
                try {
                    val value=raw.toDoubleOrNull() ?: CoreExpression.constant(raw)
                    maps.write(key,value,false)
                }catch(e: IllegalArgumentException) { errors.add("Invalid Map default ${key.take(128)}: ${e.message}") }
            }
            return maps.values.toMap() to errors
        }
        fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
            try {
                val args=controller.params;val type=controller.type.lowercase()
                require(args.keys.all { it in setOf("type","map","value","persistent","ignorehitpause") }) { "Unsupported map parameter" }
                val key=name(args["map"] ?: throw IllegalArgumentException("Missing map"))
                val raw=args["value"] ?: throw IllegalArgumentException("Missing value")
                val target=if(type.startsWith("root")) {
                    if(actor.parent==null)return
                    actor.rootActor()
                }else actor
                if(target.destroyed)return
                val value=CoreExpression.numericValue(raw,actor,errors) ?: throw IllegalArgumentException("Invalid map value")
                target.namedMaps.write(key,value,type.endsWith("add"))
            }catch(e: IllegalArgumentException) { errors.add("Invalid ${controller.type}: ${e.message}") }
        }
    }
}
