package moe.celery.kenjatime

internal data class CorePaletteId(val group: Int, val number: Int) {
    fun json() = "[$group,$number]"
}

/** A snapshot can share the map because controllers replace it instead of editing it. */
internal typealias CorePaletteRemap = Map<CorePaletteId?, CorePaletteId>

internal class CoreFightPaletteBanks(private val fight: DeterministicFight) {
    private data class Bank(
        val depths: Map<CorePaletteId, Int>,
        val sprites: Map<CorePaletteId, CorePaletteId>
    )

    private val banks = arrayOfNulls<Bank>(2)
    fun copyCatalogs(previous: CoreFightPaletteBanks) { previous.banks.copyInto(banks) }

    fun catalog(side: Int, paletteRows: String, spriteRows: String) {
        require(side in 0..1 && fight.frame == 0L) { "Palette catalogs must be loaded before stepping" }
        fun rows(text: String, columns: Int): List<List<Int>> {
            require(text.length <= 512 * 1024) { "Palette catalog exceeds its size limit" }
            if (text.isEmpty()) return emptyList()
            val lines = text.split(';', limit = 20001)
            require(lines.size <= 20000) { "Too many palette catalog rows" }
            return lines.map { row ->
                val values = row.split(',', limit = columns + 1)
                require(values.size == columns) { "Invalid palette catalog row" }
                values.map {
                    it.toIntOrNull()?.takeIf { value -> value in 0..65535 }
                        ?: throw IllegalArgumentException("Invalid palette catalog value")
                }
            }
        }
        val depths = linkedMapOf<CorePaletteId, Int>()
        for ((group, number, depth) in rows(paletteRows, 3)) {
            require(depth in 0..8) { "Invalid palette depth" }
            require(depths.put(CorePaletteId(group, number), depth) == null) { "Duplicate palette" }
        }
        val sprites = linkedMapOf<CorePaletteId, CorePaletteId>()
        for ((group, number, paletteGroup, paletteNumber) in rows(spriteRows, 4)) {
            val palette = CorePaletteId(paletteGroup, paletteNumber)
            require(palette in depths) { "Unknown sprite palette" }
            require(sprites.put(CorePaletteId(group, number), palette) == null) { "Duplicate sprite" }
        }
        banks[side] = Bank(depths, sprites)
    }

    fun resolve(side: Int, group: Int, number: Int, remaps: CorePaletteRemap): CorePaletteId? {
        if (remaps.isEmpty()) return null
        val bank = banks[side] ?: return null
        val source = bank.sprites[CorePaletteId(group, number)] ?: return null
        val dest = remaps[source] ?: remaps[null] ?: return null
        return dest.takeIf { it != source && bank.depths[it] == bank.depths[source] }
    }

    fun execute(actor: FightingCharacter, controller: StateController, errors: MutableSet<String>) {
        try {
            val params = controller.params
            require(params.keys.all { it in setOf("type", "source", "dest", "persistent", "ignorehitpause") }) {
                "Unsupported parameter"
            }
            fun pair(key: String): CorePaletteId? {
                val raw = params[key] ?: return null
                val parts = CnsArguments.split(raw)
                require(parts.size in 1..2) { "$key needs one or two values" }
                val values = parts.mapIndexed { i, part ->
                    val value = CoreExpression.numericValue(part, actor, errors, "RemapPal")
                        ?: throw IllegalArgumentException("Invalid $key expression")
                    val minimum = if (i == 0) -1.0 else 0.0
                    require(value in minimum..65535.0) { "$key is out of range" }
                    value.toInt()
                }
                return if (values[0] == -1) null else CorePaletteId(values[0], values.getOrElse(1) { 0 })
            }
            val source = pair("source")
            val dest = pair("dest")
            val side = if (actor.rootActor() === fight.p1) 0 else 1
            val depths = banks[side]?.depths.orEmpty()
            require(source == null || source in depths) { "Unknown source palette ${source?.json()}" }
            require(dest == null || dest in depths) { "Unknown destination palette ${dest?.json()}" }
            require(source == null || dest == null || depths[source] == depths[dest]) { "Palette depths differ" }

            val effects = actor.paletteEffects
            if (source == null) {
                effects.remaps = if (dest == null) emptyMap() else mapOf(null to dest)
                return
            }
            val current = effects.remaps
            val reset = dest == null || source == dest
            val next = if (reset && null !in current) current - source else current + (source to (dest ?: source))
            require(next.size <= 8) { "At most eight palette mappings are supported" }
            effects.remaps = next
        } catch (e: IllegalArgumentException) {
            errors.add("Invalid RemapPal: ${e.message}")
        }
    }
}
