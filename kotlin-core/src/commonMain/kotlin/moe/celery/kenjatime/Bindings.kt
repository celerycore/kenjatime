package moe.celery.kenjatime

/** Per-actor attachment. Offsets are fixed-point world units; sprite data,
 * variables and the anchor's own movement remain independent. */
class ActorBinding internal constructor(
    val anchor: FightingCharacter, val offsetX: Int, val offsetY: Int,
    var ticksLeft: Int, val facing: Int
)

object CoreBindings {
    /** Called once after actor movement/arena policy and before contacts.
     * Resolve anchors before children, regardless of actor iteration order. */
    fun resolve(first: FightingCharacter, second: FightingCharacter, helpers: List<HelperEntity>) {
        if(first.binding == null && second.binding == null && helpers.none { it.actor.binding != null }) return
        val actors = listOf(first,second) + helpers.map { it.actor }
        val active = actors.toSet()
        val visited = mutableSetOf<FightingCharacter>()
        fun visit(actor: FightingCharacter) {
            if (actor !in active || !visited.add(actor) || actor.destroyed) return
            val binding = actor.binding ?: return
            val anchor = binding.anchor
            if (anchor.destroyed) { actor.releaseBinding(); return }
            visit(anchor)
            fun bounded(value: Long) = value.coerceIn(Int.MIN_VALUE.toLong(),Int.MAX_VALUE.toLong()).toInt()
            actor.posX = bounded(anchor.posX.toLong() + binding.offsetX.toLong() * if(anchor.facingRight)1 else -1)
            actor.posY = bounded(anchor.posY.toLong() + binding.offsetY)
            if (binding.facing != 0) actor.facingRight = if(binding.facing > 0) anchor.facingRight else !anchor.facingRight
            if (!actor.bindingClockPaused && binding.ticksLeft > 0 && --binding.ticksLeft == 0)
                actor.releaseBinding()
        }
        for (actor in actors) visit(actor)
    }
}

/** CNS binding parameters are evaluated on the executing actor. Validate
 * the entire request before mutating any selected target or attachment. */
object CoreBindingControllers {
    private fun arguments(raw: String): List<String> {
        require(raw.length <= 4096) { "Binding position is too long" }
        var depth = 0
        var quote: Char? = null
        var start = 0
        val result = mutableListOf<String>()
        for ((i,c) in raw.withIndex()) {
            if (quote != null) { if(c == quote) quote = null; continue }
            when(c) {
                '\'', '"' -> quote = c
                '(', '[' -> depth++
                ')', ']' -> { depth--; require(depth >= 0) { "Unbalanced binding position" } }
                ',' -> if(depth == 0) { result.add(raw.substring(start,i).trim()); start = i+1 }
            }
        }
        require(depth == 0 && quote == null) { "Unbalanced binding position" }
        result.add(raw.substring(start).trim())
        return result
    }
    fun execute(actor: FightingCharacter, controller: StateController,
                source: FightingCharacter, errors: MutableSet<String>) {
        try {
            val type = controller.type.lowercase()
            val args = controller.params
            fun number(raw: String): Double = CoreExpression.number(raw,actor,errors)
                ?: throw IllegalArgumentException("Invalid binding expression: $raw")
            fun integer(key: String, fallback: Int) = args[key]?.let { number(it).toInt() } ?: fallback
            val time = integer("time",1)
            require(time >= -1) { "Binding time must be -1, 0 or positive" }
            val wanted = integer("id",-1)
            val position = arguments(args["pos"] ?: "0,0")
            require(position.size <= if(type == "bindtotarget")3 else 2) { "Invalid binding position arity" }
            val x = Fixed.of(number(position[0]))
            val y = Fixed.of(number(position.getOrNull(1) ?: "0"))
            val point = (position.getOrNull(2) ?: "foot").trim('"','\'').lowercase()
            require(point in setOf("foot","head","mid")) { "Binding anchor must be Foot, Head or Mid" }
            val facing = integer("facing",0)
            require(facing in -1..1) { "Binding facing must be -1, 0 or 1" }
            require(facing == 0 || type in setOf("bindtoparent","bindtoroot")) {
                "Facing is supported only by BindToParent/BindToRoot"
            }
            if (type in setOf("bindtoparent","bindtoroot") && actor.parent == null) return
            var root = actor
            if (type == "bindtoroot") {
                val seen = mutableSetOf<FightingCharacter>()
                while(root.parent != null) {
                    require(seen.add(root)) { "Cyclic helper parent chain" }
                    root = root.parent!!
                }
            }
            val selected = if(type in setOf("targetbind","bindtotarget")) actor.targets(wanted) else emptyList()
            if (type == "targetbind") {
                // Preflight every target before applying an all-target request.
                for(target in selected) if(time != 0)
                    target.bindingProblem(actor,source)?.let { throw IllegalArgumentException(it) }
                for(target in selected) {
                    if(time == 0) target.releaseBinding() else target.bindTo(actor,x,y,time)
                }
                return
            }
            val anchor = when(type) {
                "bindtoparent" -> actor.parent!!
                "bindtoroot" -> root
                else -> selected.firstOrNull() ?: throw IllegalArgumentException("BindToTarget has no matching live target")
            }
            if (time == 0) { actor.releaseBinding(); return }
            actor.bindingProblem(anchor,source)?.let { throw IllegalArgumentException(it) }
            val offsetX = when(point) { "head" -> anchor.definition.headX; "mid" -> anchor.definition.midX; else -> 0 }
            val offsetY = when(point) { "head" -> anchor.definition.headY; "mid" -> anchor.definition.midY; else -> 0 }
            val sumX = x.toLong()+offsetX
            val sumY = y.toLong()+offsetY
            require(sumX in Int.MIN_VALUE.toLong()..Int.MAX_VALUE.toLong() &&
                sumY in Int.MIN_VALUE.toLong()..Int.MAX_VALUE.toLong()) { "Binding offset overflow" }
            actor.bindTo(anchor,sumX.toInt(),sumY.toInt(),time,facing)
        } catch(e: IllegalArgumentException) {
            errors.add("Invalid ${controller.type}: ${e.message}")
        }
    }
}
