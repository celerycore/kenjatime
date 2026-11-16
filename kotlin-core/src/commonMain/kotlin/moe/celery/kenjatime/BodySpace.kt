package moe.celery.kenjatime

/** Canonical offsets: state-bank conversion happens once when Width executes. */
internal data class CoreWidthOffsets(
    val playerFront: Int=0,val playerBack: Int=0,val edgeFront: Int=0,val edgeBack: Int=0
) {
    companion object { val ZERO=CoreWidthOffsets() }
}

/** One active-tick body-space assertions, retained while the actor is in hitpause. */
internal object CoreBodySpace {
    fun beginTick(actor: FightingCharacter,paused: Boolean) {
        if(!paused) { actor.playerPushOverride=null;actor.widthOffsets=CoreWidthOffsets.ZERO }
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params
            val push=controller.type.equals("playerpush",true)
            val allowed=setOf("type","value","persistent","ignorehitpause")+
                if(push)emptySet() else setOf("player","edge")
            require(args.keys.all { it in allowed }) { "Unsupported body-space parameter" }
            fun number(raw: String)=CoreExpression.number(raw,actor,errors)
                ?: throw IllegalArgumentException("Invalid numeric expression")
            if(push) {
                val raw=args["value"] ?: throw IllegalArgumentException("Missing value")
                actor.playerPushOverride=number(raw) != 0.0
            }else {
                require(args["value"] == null || args["player"] == null && args["edge"] == null) {
                    "Width value cannot be combined with player or edge"
                }
                fun pair(raw: String?): Pair<Int,Int> {
                    if(raw == null)return 0 to 0
                    val parts=CnsArguments.split(raw)
                    require(parts.size in 1..2) { "Width requires one or two components" }
                    fun offset(raw: String): Int {
                        val n=number(raw)
                        require(n in -100000.0..100000.0) { "Width component out of range" }
                        return actor.coordinates.toWorld(n.toInt().toDouble())
                    }
                    return offset(parts[0]) to (parts.getOrNull(1)?.let(::offset) ?: 0)
                }
                val common=args["value"]?.let { pair(it) }
                val player=common ?: pair(args["player"])
                val edge=common ?: pair(args["edge"])
                // Evaluate all four axes before replacing an earlier valid assertion.
                actor.widthOffsets=CoreWidthOffsets(player.first,player.second,edge.first,edge.second)
            }
        }catch(e: IllegalArgumentException) { errors.add("Invalid ${controller.type}: ${e.message}") }
    }
}
