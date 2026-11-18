package moe.celery.kenjatime

internal data class CoreCommonAnimation(
    val animation: AirAnimationPlayer,
    val x: Int,
    val y: Int,
    val facingRight: Boolean,
    val under: Boolean,
    val side: Int,
    val born: Long,
    var age: Int = 0,
)

/** Shared fightfx AIR actions use stage-space sprite scale and capture the
 * executing actor's position once. They are independent of Explod IDs. */
internal class CoreCommonAnimations(private val fight: DeterministicFight) {
    private var actions = emptyMap<Int, AirAction>()
    var scale = 1.0
        private set
    private val effects = mutableListOf<CoreCommonAnimation>()
    // Cosmetic jitter must leave gameplay RNG reproducible when artwork is missing.
    private var jitterState = 0x6d2b79f5
    val all: List<CoreCommonAnimation> get() = effects

    fun action(number: Int): AirAction? = actions[number]

    fun catalog(air: String, scale: Double) {
        require(fight.frame == 0L && effects.isEmpty()) { "Load fightfx before stepping" }
        require(scale.isFinite() && scale > 0 && scale <= 1000) { "Invalid fightfx scale" }
        val parsed = MugenAirParser.parse(air)
        this.scale = scale
        actions = parsed
    }

    fun execute(
        actor: FightingCharacter,
        controller: StateController,
        key: Pair<Int, Int>,
        errors: MutableSet<String>,
    ) {
        try {
            val args = controller.params
            fun number(raw: String): Double =
                CoreExpression.number(raw, actor, errors)?.takeIf { it.isFinite() }
                    ?: throw IllegalArgumentException("Invalid effect parameter")
            fun position(key: String): Pair<Double, Double> {
                val terms = args[key]?.let(CnsArguments::split) ?: return 0.0 to 0.0
                require(terms.size == 2) { "$key requires two coordinates" }
                return number(terms[0]) to number(terms[1])
            }
            val dust = controller.type.equals("makedust", ignoreCase = true)
            val id = if (dust) 120 else args["value"]?.let { number(it).toInt() } ?: 0
            if (id < 0) return
            val spacing = if (dust) args["spacing"]?.let { number(it).toInt() } ?: 3 else 1
            require(spacing >= 1) { "MakeDust spacing must be at least 1" }
            val lastDust = actor.dustTicks[key]
            if (dust && lastDust != null && fight.frame - lastDust < spacing) return
            val pos = position("pos")
            val second = if (dust && "pos2" in args) position("pos2") else null
            val under = dust || args["under"]?.let { number(it) != 0.0 } == true
            val random = if (dust) 0 else args["random"]?.let { number(it).toInt().coerceAtLeast(0) } ?: 0
            if (dust) actor.dustTicks[key] = fight.frame
            val action = actions[id]
            if (action == null) {
                errors.add("Common fightfx animation $id is unavailable")
                return
            }
            spawn(actor, action, pos, under, random)
            if (second != null) spawn(actor, action, second, under, 0)
        } catch (e: IllegalArgumentException) {
            errors.add("Invalid ${controller.type}: ${e.message}")
        }
    }

    private fun spawn(actor: FightingCharacter, action: AirAction, pos: Pair<Double, Double>, under: Boolean, random: Int) {
        fun jitter(): Double {
            if (random == 0) return 0.0
            jitterState = jitterState * 1664525 + 1013904223
            return ((jitterState ushr 1) % 1000 / 999.0 - 0.5) * random
        }
        fun axis(origin: Int, offset: Double): Int = (origin.toLong() + actor.coordinates.toWorld(offset))
            .coerceIn(Int.MIN_VALUE.toLong(), Int.MAX_VALUE.toLong()).toInt()
        val side = if (actor.rootActor() === fight.p1) 0 else 1
        // Jitter is independent on each axis and always in stage orientation.
        val dx = pos.first * (if (actor.facingRight) 1 else -1) + jitter()
        val dy = pos.second + jitter()
        if (effects.size >= 256) effects.removeAt(0)
        effects.add(CoreCommonAnimation(AirAnimationPlayer(action), axis(actor.posX, dx), axis(actor.posY, dy),
            actor.facingRight, under, side, fight.frame))
    }

    fun advance() {
        if (fight.pauses.active) return
        effects.removeAll { effect ->
            if (effect.born == fight.frame) return@removeAll false
            effect.animation.advance()
            ++effect.age > 3600 || effect.animation.finished && effect.animation.action.loopIndex == null
        }
    }
}
