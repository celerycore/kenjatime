package moe.celery.kenjatime

data class ContactSpark(val action: Int, val common: Boolean)
data class ContactSound(val group: Int, val number: Int, val common: Boolean)

/** Offsets are captured in canonical coordinates when the controller runs. */
data class ContactPresentation(
    val spark: ContactSpark? = null,
    val guardSpark: ContactSpark? = null,
    val sound: ContactSound? = null,
    val guardSound: ContactSound? = null,
    val offsetX: Int = 0,
    val offsetY: Int = 0,
) {
    companion object {
        internal val EMPTY = ContactPresentation()
    }
}

internal object CoreContactPresentation {
    val defaultParameters = setOf("sparkno", "guard.sparkno", "hitsound", "guardsound")

    fun capture(
        actor: FightingCharacter,
        args: Map<String, String>,
        errors: MutableSet<String>,
        reversal: Boolean = false,
    ): ContactPresentation {
        val defaults = actor.definition.contactDefaults
        if (defaults.isEmpty() && "sparkxy" !in args && defaultParameters.none { it in args }) {
            return ContactPresentation.EMPTY
        }
        fun integer(raw: String): Int {
            val value = CoreExpression.contactNumber(raw, actor, errors)
                ?: throw IllegalArgumentException("Invalid expression")
            require(value in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) { "Value out of range" }
            return value.toInt()
        }
        fun <T> read(key: String, parse: (String) -> T?): T? {
            val raw = args[key] ?: defaults[key] ?: return null
            return try {
                parse(raw)
            } catch (e: IllegalArgumentException) {
                errors.add("Invalid contact $key: ${e.message}")
                null
            }
        }
        fun spark(key: String) = read(key) {
            val ref = CnsResourceExpression.read(it, defaultCommon = true)
            val id = integer(ref.expression)
            if (id < 0) null else ContactSpark(id, ref.common)
        }
        fun sound(key: String) = read(key) {
            val terms = CnsArguments.split(it)
            require(terms.size <= 2) { "Sound requires a group and optional sample number" }
            val ref = CnsResourceExpression.read(terms.first(), defaultCommon = true)
            val group = integer(ref.expression)
            if (group < 0) return@read null
            val sample = terms.getOrNull(1)?.let(::integer) ?: 0
            if (sample < 0) null else ContactSound(group, sample, ref.common)
        }
        val offset = read("sparkxy") {
            val terms = CnsArguments.split(it)
            require(terms.size <= 2) { "sparkxy requires one or two coordinates" }
            actor.coordinates.toWorld(integer(terms.first()).toDouble()) to
                actor.coordinates.toWorld((terms.getOrNull(1)?.let(::integer) ?: 0).toDouble())
        }
        return ContactPresentation(
            spark("sparkno"), if (reversal) null else spark("guard.sparkno"),
            sound("hitsound"), if (reversal) null else sound("guardsound"),
            offset?.first ?: 0, offset?.second ?: 0,
        )
    }

    private fun bodyPosition(
        attacker: FightingCharacter,
        victim: FightingCharacter,
        presentation: ContactPresentation,
    ): Pair<Long, Long> {
        val towardAttacker = when {
            attacker.posX < victim.posX -> -1
            attacker.posX > victim.posX -> 1
            attacker.facingRight -> -1
            else -> 1
        }
        val front = victim.bodyWidthWorld(towardAttacker)
        val x = victim.posX.toLong() + towardAttacker * (front.toLong() + presentation.offsetX)
        val y = attacker.posY.toLong() + presentation.offsetY
        return x to y
    }

    fun hit(
        fight: DeterministicFight,
        attacker: FightingCharacter,
        victim: FightingCharacter,
        presentation: ContactPresentation,
        guarded: Boolean,
        projectile: CoreProjectile?,
    ) {
        val spark = if (guarded) presentation.guardSpark else presentation.spark
        val sound = if (guarded) presentation.guardSound else presentation.sound
        if (spark == null && sound == null) return
        val face = projectile?.facingRight ?: attacker.facingRight
        val (x, y) = if (projectile == null) bodyPosition(attacker, victim, presentation) else
            projectile.x.toLong() + presentation.offsetX.toLong() * (if (face) 1 else -1) to
                projectile.y.toLong() + presentation.offsetY
        play(fight, attacker, face, spark, sound, x, y)
    }

    fun reversal(
        fight: DeterministicFight,
        reverser: FightingCharacter,
        attacker: FightingCharacter,
        presentation: ContactPresentation,
        incoming: ContactPresentation,
    ) {
        if (presentation.spark == null && presentation.sound == null) return
        val (x, y) = bodyPosition(attacker, reverser, incoming)
        val dx = presentation.offsetX.toLong() * (if (reverser.facingRight) 1 else -1)
        play(fight, reverser, reverser.facingRight, presentation.spark, presentation.sound,
            x + dx, y + presentation.offsetY)
    }

    private fun play(
        fight: DeterministicFight,
        actor: FightingCharacter,
        facingRight: Boolean,
        spark: ContactSpark?,
        sound: ContactSound?,
        x: Long,
        y: Long,
    ) {
        fun fixed(value: Long) = value.coerceIn(Int.MIN_VALUE.toLong(), Int.MAX_VALUE.toLong()).toInt()
        if (spark != null) fight.commonAnimations.contact(actor, spark, fixed(x), fixed(y), facingRight)
        if (sound != null) fight.sounds.contact(actor, sound, fixed(x))
    }
}
