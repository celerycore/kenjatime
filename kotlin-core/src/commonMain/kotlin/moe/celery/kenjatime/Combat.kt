package moe.celery.kenjatime

/** All simulation coordinates/velocities are fixed-point: 1 pixel = 256 units. */
object Fixed {
    const val ONE = 256
    fun of(value: Double): Int = (value * ONE).toInt()
    fun pixels(value: Int): Double = value.toDouble() / ONE
}
data class HitDefinition(
    val attr: String = "S, NA",
    val damage: Int = 0,
    val hitPause: Int = 0,
    val velocityX: Int = 0,
    val velocityY: Int = 0
)
data class StateController(
    val type: String,
    val params: Map<String, String>,
    val triggerAll: List<String>,
    val triggerGroups: Map<Int, List<String>>
)
data class StateProgram(val number: Int, val animation: Int?, val controllers: List<StateController>)
data class FighterDefinition(
    val name: String, val animations: Map<Int, AirAction> = emptyMap(),
    val states: Map<Int, StateProgram> = emptyMap(),
    val maxLife: Int = 1000
)
object MugenCnsParser {
    private val state = Regex("state\\s+(-?\\d+)\\s*,.*", RegexOption.IGNORE_CASE)
    private val statedef = Regex("statedef\\s+(-?\\d+)", RegexOption.IGNORE_CASE)
    fun parse(source: String): Map<Int, StateProgram> {
        val sections = MugenDefParser.parse(source).sections
        val controllers = linkedMapOf<Int, MutableList<StateController>>()
        val animations = mutableMapOf<Int, Int?>()
        var current: Int? = null
        for (section in sections) {
            val d = statedef.matchEntire(section.name)
            if (d != null) {
                current = d.groupValues[1].toInt()
                animations[current] = section.get("anim")?.toIntOrNull()
                controllers.getOrPut(current) { mutableListOf() }
                continue
            }
            val s = state.matchEntire(section.name) ?: continue
            val stateNo = s.groupValues[1].toInt()
            if (stateNo != current && stateNo !in controllers) controllers[stateNo] = mutableListOf()
            val grouped = linkedMapOf<Int, MutableList<String>>()
            val all = mutableListOf<String>()
            val params = linkedMapOf<String, String>()
            for ((key, value) in section.entries) {
                if (key == "triggerall") all.add(value)
                else if (key.startsWith("trigger") && key.drop(7).toIntOrNull() != null) {
                    grouped.getOrPut(key.drop(7).toInt()) { mutableListOf() }.add(value)
                } else params[key] = value
            }
            controllers.getOrPut(stateNo) { mutableListOf() }.add(StateController(
                params["type"] ?: "Null", params.toMap(), all.toList(), grouped.mapValues { it.value.toList() }))
        }
        return controllers.mapValues { (n, c) -> StateProgram(n, animations[n], c.toList()) }
    }
}

/** Small explicit trigger subset. Unknown expressions fail closed and are reported. */
object CoreTriggers {
    fun test(expr: String, actor: FightingCharacter, errors: MutableSet<String>): Boolean {
        val e = expr.trim().removeSurrounding("(" , ")").trim()
        if (e.contains("||")) return e.split("||").any { test(it, actor, errors) }
        if (e.contains("&&")) return e.split("&&").all { test(it, actor, errors) }
        if (e.equals("1") || e.equals("true", true)) return true
        if (e.equals("0") || e.equals("false", true)) return false
        val m = Regex("(?i)^(time|stateno|life|pos x|pos y|vel x|vel y|ctrl)\\s*(=|!=|<=|>=|<|>)\\s*(-?\\d+)$").matchEntire(e)
        if (m != null) {
            val x = when (m.groupValues[1].lowercase()) {
                "time" -> actor.timeInState
                "stateno" -> actor.stateNo
                "life" -> actor.life
                "pos x" -> actor.posX / Fixed.ONE
                "pos y" -> actor.posY / Fixed.ONE
                "vel x" -> actor.velX / Fixed.ONE
                "vel y" -> actor.velY / Fixed.ONE
                else -> if (actor.control) 1 else 0
            }
            val y = m.groupValues[3].toInt()
            return when (m.groupValues[2]) {
                "=" -> x == y
                "!=" -> x != y
                "<=" -> x <= y
                ">=" -> x >= y
                "<" -> x < y
                else -> x > y
            }
        }
        val command = Regex("(?i)^command\\s*=\\s*\"?([a-z0-9_ +-]+)\"?$").matchEntire(e)
        if (command != null) return actor.commands.any {
            it.name.equals(command.groupValues[1], true) && actor.input.matches(it, actor.facingRight)
        }
        errors.add("Unsupported trigger: " + e.take(160))
        return false
    }
    fun controllerEnabled(c: StateController, fighter: FightingCharacter, errors: MutableSet<String>): Boolean {
        if (!c.triggerAll.all { test(it, fighter, errors) }) return false
        return c.triggerGroups.isEmpty() || c.triggerGroups.values.any { group -> group.all { test(it, fighter, errors) } }
    }
}
class FightingCharacter(
    val definition: FighterDefinition,
    val id: Int,
    val commands: List<MugenCommand> = emptyList()
) {
    val input = InputBuffer()
    var life = definition.maxLife
    var posX = 0
    var posY = 0
    var velX = 0
    var velY = 0
    var facingRight = true
    var stateNo = 0
        private set
    var timeInState = 0
        private set
    var hitPauseLeft = 0
    var control = true
    var activeHitDef: HitDefinition? = null
        private set
    private var attackGeneration = 0
    private val struck = mutableSetOf<Int>()
    var animation: AirAnimationPlayer? = null
        private set
    init { changeState(0) }
    fun changeState(state: Int) {
        stateNo = state
        timeInState = 0
        control = state < 5000
        activeHitDef = null
        struck.clear()
        val a = definition.states[state]?.animation ?: state
        animation = definition.animations[a]?.let(::AirAnimationPlayer)
    }
    fun canHit(target: Int): Boolean = activeHitDef != null && !struck.contains(target)
    fun markHit(target: Int) { struck.add(target) }
    fun attackBoxes(): List<MugenRect> = animation?.frame?.boxes
        ?.filter { it.attack }?.map { it.rect.world(posX, posY, facingRight) } ?: emptyList()
    fun hurtBoxes(): List<MugenRect> = animation?.frame?.boxes
        ?.filterNot { it.attack }?.map { it.rect.world(posX, posY, facingRight) } ?: emptyList()
    private fun numeric(raw: String?, default: Int = 0): Int = raw?.trim()?.toDoubleOrNull()?.let(Fixed::of) ?: default
    fun tick(errors: MutableSet<String>) {
        if (hitPauseLeft > 0) { hitPauseLeft--; return }
        val program = definition.states[stateNo]
        if (program != null) for (c in program.controllers) {
            if (!CoreTriggers.controllerEnabled(c, this, errors)) continue
            when (c.type.lowercase()) {
                "null" -> {}
                "velset" -> {
                    velX = numeric(c.params["x"], velX); velY = numeric(c.params["y"], velY)
                }
                "veladd" -> {
                    velX += numeric(c.params["x"]); velY += numeric(c.params["y"])
                }
                "posadd" -> {
                    posX += numeric(c.params["x"]); posY += numeric(c.params["y"])
                }
                "ctrlset" -> control = (c.params["value"]?.trim() ?: "0") != "0"
                "changestate", "selfstate" -> {
                    val next = c.params["value"]?.trim()?.toIntOrNull()
                    if (next == null) errors.add("Non-constant ChangeState: " + c.params["value"])
                    else { changeState(next); break }
                }
                "hitdef" -> {
                    val pause = (c.params["pausetime"] ?: "0").substringBefore(',').trim().toIntOrNull() ?: 0
                    val vel = (c.params["ground.velocity"] ?: "0,0").split(',')
                    activeHitDef = HitDefinition(c.params["attr"] ?: "S, NA",
                        c.params["damage"]?.substringBefore(',')?.trim()?.toIntOrNull() ?: 0,
                        pause.coerceIn(0, 120), numeric(vel.getOrNull(0)), numeric(vel.getOrNull(1)))
                    attackGeneration++
                    struck.clear()
                }
                else -> errors.add("Unsupported controller: " + c.type)
            }
        }
        posX += velX
        posY += velY
        timeInState++
        animation?.advance()
    }
    fun receiveHit(hit: HitDefinition, attackerFacingRight: Boolean) {
        life = (life - hit.damage.coerceAtLeast(0)).coerceAtLeast(0)
        changeState(if (life == 0) 5150 else 5000)
        velX = hit.velocityX * if (attackerFacingRight) 1 else -1
        velY = hit.velocityY
        hitPauseLeft = hit.hitPause
    }
}
class DeterministicFight(val p1: FightingCharacter, val p2: FightingCharacter) {
    val issues: MutableSet<String> = linkedSetOf()
    var frame: Long = 0
        private set
    init { require(p1.id != p2.id) }
    fun step(a: InputFrame = InputFrame(), b: InputFrame = InputFrame()) {
        p1.input.update(a); p2.input.update(b)
        val p1Frozen = p1.hitPauseLeft > 0
        val p2Frozen = p2.hitPauseLeft > 0
        p1.tick(issues); p2.tick(issues)
        // Resolve both attacks from the same pre-hit snapshot; trades are supported.
        val aHits = !p1Frozen && p1.canHit(p2.id) && connects(p1, p2)
        val bHits = !p2Frozen && p2.canHit(p1.id) && connects(p2, p1)
        val ah = if (aHits) p1.activeHitDef else null
        val bh = if (bHits) p2.activeHitDef else null
        if (ah != null) { p1.markHit(p2.id); p1.hitPauseLeft = ah.hitPause }
        if (bh != null) { p2.markHit(p1.id); p2.hitPauseLeft = bh.hitPause }
        if (ah != null) p2.receiveHit(ah, p1.facingRight)
        if (bh != null) p1.receiveHit(bh, p2.facingRight)
        frame++
    }
    private fun connects(attacker: FightingCharacter, defender: FightingCharacter): Boolean {
        val attacks = attacker.attackBoxes()
        val hurt = defender.hurtBoxes()
        return attacks.any { a -> hurt.any { h -> a.intersects(h) } }
    }
    fun checksum(): String = listOf(frame, p1.life, p1.posX, p1.posY, p1.velX, p1.velY,
        p1.stateNo, p1.timeInState, p2.life, p2.posX, p2.posY, p2.velX, p2.velY,
        p2.stateNo, p2.timeInState).joinToString(":")
}
