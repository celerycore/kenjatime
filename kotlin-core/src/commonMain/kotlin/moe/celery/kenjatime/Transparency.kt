package moe.celery.kenjatime

/** Final sprite blend in documented 0..256 alpha units. */
data class SpriteBlend(val mode: String,val source: Int,val destination: Int) {
    companion object {
        val NORMAL=SpriteBlend("normal",256,0)
        val ADD=SpriteBlend("add",256,256)
        val SUB=SpriteBlend("sub",256,256)
    }
    internal fun json()="{\"mode\":\"$mode\",\"source\":$source,\"destination\":$destination}"
}

internal object CoreTransparency {
    private val weighted=Regex("as(\\d{1,3})d(\\d{1,3})",RegexOption.IGNORE_CASE)
    fun air(raw: String): SpriteBlend? {
        return when(raw.trim().lowercase()) {
            "" -> SpriteBlend.NORMAL
            "a" -> SpriteBlend.ADD
            "a1" -> SpriteBlend("add",256,128)
            "s" -> SpriteBlend.SUB
            else -> weighted.matchEntire(raw.trim())?.let {
                val source=it.groupValues[1].toInt();val destination=it.groupValues[2].toInt()
                if(source in 0..256 && destination in 0..256)SpriteBlend("add",source,destination) else null
            }
        }
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            require(args.keys.all { it in setOf("type","trans","alpha","persistent","ignorehitpause") }) { "Unsupported Trans parameter" }
            val mode=args["trans"]?.trim()?.removeSurrounding("\"")?.lowercase()
                ?: throw IllegalArgumentException("Missing trans")
            require(mode in setOf("default","none","add","addalpha","add1","sub")) { "Unsupported trans mode" }
            val alpha=args["alpha"]?.let {
                val parts=CnsArguments.split(it);require(parts.size==2) { "alpha requires two components" }
                parts.map { raw ->
                    val n=CoreExpression.number(raw,actor,errors) ?: throw IllegalArgumentException("Invalid alpha expression")
                    require(n in 0.0..256.0) { "Alpha out of range" };n.toInt()
                }
            }
            actor.drawBlend=when(mode) {
                "default" -> null
                "none" -> SpriteBlend.NORMAL
                "sub" -> SpriteBlend.SUB
                else -> SpriteBlend("add",alpha?.get(0) ?: 256,alpha?.get(1) ?: when(mode) { "addalpha" -> 0;"add1" -> 128;else -> 256 })
            }
        }catch(e: IllegalArgumentException) { errors.add("Invalid Trans: ${e.message}") }
    }
}
