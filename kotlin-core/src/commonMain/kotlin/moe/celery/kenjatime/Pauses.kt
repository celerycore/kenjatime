package moe.celery.kenjatime

/** Number of ticks at the start of each global pause during which an entity can move. */
data class CorePauseMoves(val pause: Int = 0, val superPause: Int = 0) {
    internal companion object {
        fun read(args: Map<String, String>, actor: FightingCharacter, issues: MutableSet<String>,
                 previous: CorePauseMoves = CorePauseMoves()): CorePauseMoves {
            fun readTime(key: String, fallback: Int): Int {
                val raw = args[key] ?: return fallback
                return pauseInt(raw, actor, issues, 0..360000)
            }
            return CorePauseMoves(readTime("pausemovetime", previous.pause),
                readTime("supermovetime", previous.superPause))
        }
    }
}

private fun pauseInt(raw: String, actor: FightingCharacter, issues: MutableSet<String>, range: IntRange): Int {
    val value = CoreExpression.numericValue(raw, actor, issues, "pause")
        ?: throw IllegalArgumentException("Invalid numeric value")
    require(value in range.first.toDouble()..range.last.toDouble()) { "Pause value out of range" }
    return value.toInt()
}

internal data class CoreSuperFlash(
    val owner: FightingCharacter, val x: Int, val y: Int, val facingRight: Boolean,
    val animation: AirAnimationPlayer, val common: Boolean
)

internal class CorePauses {
    private class Window(
        val owner: FightingCharacter, val duration: Int, val moveTime: Int, val commandTime: Int,
        val background: Boolean, val superPause: Boolean, val darken: Boolean, val unhittable: Boolean,
        val targetDefence: Double, val targets: Set<FightingCharacter>, val flash: CoreSuperFlash?
    ) {
        var elapsed = 0
        val remaining get() = duration - elapsed
    }

    private var pause: Window? = null
    private var superPause: Window? = null
    private var nextPause: Window? = null
    private var nextSuper: Window? = null
    private val current get() = superPause ?: pause
    val active get() = current != null
    val remaining get() = current?.remaining ?: 0
    val backgroundFrozen get() = current?.background == true
    val darken get() = superPause?.darken == true
    val flash get() = superPause?.flash

    fun entityFrozen(moves: CorePauseMoves): Boolean {
        val window = current ?: return false
        val allowance = if (window.superPause) moves.superPause else moves.pause
        return window.elapsed >= allowance
    }

    fun frozen(actor: FightingCharacter): Boolean {
        val window = current ?: return false
        return if (window.owner === actor) window.elapsed >= window.moveTime else entityFrozen(actor.pauseMoves)
    }

    fun unhittable(actor: FightingCharacter) = superPause?.let { it.owner === actor && it.unhittable } == true

    fun defence(actor: FightingCharacter): Double {
        val window = superPause ?: return 1.0
        return if (actor in window.targets) window.targetDefence else 1.0
    }

    fun tickActor(actor: FightingCharacter, input: InputFrame, enabled: Boolean, issues: MutableSet<String>) {
        val wasFrozen = actor.globalPauseThisTick
        actor.globalPauseThisTick = frozen(actor)
        if (actor.globalPauseThisTick) {
            actor.input.update(if (enabled) input else InputFrame())
            val window = current!!
            if (enabled && window.remaining <= window.commandTime) {
                for (command in actor.commands) {
                    if (actor.input.matches(command, actor.facingRight)) actor.pauseCommands.add(command.name.lowercase())
                }
            }
            return
        }
        if (wasFrozen) actor.input.discardMovesKeepLastSample()
        CoreAssertedInputs.sample(actor, input, enabled)
        if (!enabled) actor.pauseCommands.clear()
        actor.tick(issues)
        if (!actor.hitPauseThisTick) actor.pauseCommands.clear()
    }

    /** Commit requests after the whole tick, so controller order cannot partially freeze a frame. */
    fun finishTick() {
        current?.let { window ->
            window.elapsed++
            window.flash?.animation?.advance()
            if (window.remaining == 0) {
                if (window.superPause) superPause = null else pause = null
            }
        }
        nextPause?.let { pause = it.takeIf { it.duration > 0 } }
        nextSuper?.let { superPause = it.takeIf { it.duration > 0 } }
        nextPause = null
        nextSuper = null
    }

    fun json(): String = "{\"pause\":${pause?.remaining ?: 0},\"superPause\":${superPause?.remaining ?: 0}," +
        "\"owner\":${current?.owner?.id ?: 0},\"darken\":$darken,\"backgroundFrozen\":$backgroundFrozen}"

    fun execute(actor: FightingCharacter, controller: StateController, issues: MutableSet<String>) {
        try {
            val type = controller.type.lowercase()
            val args = controller.params
            val common = setOf("type", "persistent", "ignorehitpause")
            if (type == "modifyplayer") {
                require(args.keys.all { it in common || it == "pausemovetime" || it == "supermovetime" }) {
                    "Unsupported ModifyPlayer parameter"
                }
                actor.pauseMoves = CorePauseMoves.read(args, actor, issues, actor.pauseMoves)
                return
            }
            val superPause = type == "superpause"
            val base = common + setOf("time", "movetime", "endcmdbuftime", "pausebg")
            val allowed = if (superPause) base + setOf("anim", "sound", "pos", "darken",
                "p2defmul", "poweradd", "unhittable") else base
            require(args.keys.all { it in allowed }) { "Unsupported pause parameter" }
            fun int(key: String, default: Int, range: IntRange = 0..360000): Int =
                args[key]?.let { pauseInt(it, actor, issues, range) } ?: default
            fun num(raw: String): Double = CoreExpression.numericValue(raw, actor, issues, "pause")
                ?: throw IllegalArgumentException("Invalid numeric value")
            fun flag(key: String, default: Boolean) = args[key]?.let { num(it) != 0.0 } ?: default

            require(superPause || "time" in args) { "Pause requires time" }
            val time = int("time", 30)
            val move = int("movetime", 0, 0..time)
            val buffer = int("endcmdbuftime", 0, 0..time)
            val factor = args["p2defmul"]?.let(::num) ?: 0.0
            require(factor == 0.0 || factor in .0001..10000.0) { "Invalid target defence multiplier" }
            val power = int("poweradd", 0, Int.MIN_VALUE..Int.MAX_VALUE)
            val flash = if (superPause) {
                val ref = CnsResourceExpression.read(args["anim"] ?: "30", defaultCommon = true)
                val id = pauseInt(ref.expression, actor, issues, -1..Int.MAX_VALUE)
                val pos = args["pos"]?.let(CnsArguments::split).orEmpty()
                require(pos.size <= 2) { "Super position requires up to two values" }
                val x = pos.getOrNull(0)?.let { actor.coordinates.toWorld(num(it)) } ?: 0
                val y = pos.getOrNull(1)?.let { actor.coordinates.toWorld(num(it)) } ?: 0
                val action = when {
                    id < 0 -> null
                    ref.common -> actor.world?.commonAnimations?.action(id)
                    else -> actor.definition.animations[id]
                }
                if (action == null && id >= 0 && "anim" in args) {
                    val source = if (ref.common) "fightfx AIR" else "the fighter's AIR"
                    issues.add("Super animation $id is missing from $source")
                }
                action?.let {
                    fun bounded(value: Long) = value.coerceIn(Int.MIN_VALUE.toLong(), Int.MAX_VALUE.toLong()).toInt()
                    val facing = if (actor.facingRight) 1 else -1
                    CoreSuperFlash(actor, bounded(actor.posX.toLong() + x.toLong() * facing),
                        bounded(actor.posY.toLong() + y), actor.facingRight, AirAnimationPlayer(it), ref.common)
                }
            } else null
            val sound = args["sound"]?.let { raw ->
                val parts = CnsArguments.split(raw)
                val ref = CnsResourceExpression.read(parts.first(), defaultCommon = true)
                val group = pauseInt(ref.expression, actor, issues, -1..Int.MAX_VALUE)
                require(parts.size <= 2 && (group == -1 || parts.size == 2)) { "Super sound needs a group and number" }
                if (group == -1) null else {
                    val number = pauseInt(parts[1], actor, issues, 0..Int.MAX_VALUE)
                    val prefix = if (ref.common) "F" else "S"
                    "$prefix$group,$number"
                }
            }
            val window = Window(actor, time, move, buffer, flag("pausebg", true), superPause,
                superPause && flag("darken", true), superPause && flag("unhittable", true),
                if (factor == 0.0) 1.5 else factor, if (superPause) actor.targets().toSet() else emptySet(), flash)
            if (superPause) {
                nextSuper = window
                actor.addPower(power)
                if (sound != null) actor.world?.sounds?.execute(actor,
                    StateController("playsnd", mapOf("value" to sound), emptyList(), emptyMap()), issues)
            } else nextPause = window
        } catch (e: IllegalArgumentException) {
            issues.add("Invalid ${controller.type}: ${e.message}")
        }
    }

}
