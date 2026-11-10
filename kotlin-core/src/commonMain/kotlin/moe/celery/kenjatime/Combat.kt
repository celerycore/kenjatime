package moe.celery.kenjatime

/** Simulation coordinates use signed 1/256 pixel fixed point. No frame delta times. */
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
    val velocityY: Int = 0,
    val guardDamage: Int = 0,
    val guardFlag: String = "",
    val hitFlag: String = "MAF",
    val priority: Int = 4,
    val priorityType: String = "Hit",
    val defenderPause: Int = hitPause,
    val guardPause: Int = hitPause,
    val guardVelocityX: Int = 0,
    val guardVelocityY: Int = 0,
    val hitTime: Int = 12
)
data class StateController(
    val type: String,
    val params: Map<String, String>,
    val triggerAll: List<String>,
    val triggerGroups: Map<Int, List<String>>
)
data class StateProgram(
    val number: Int,
    val animation: Int?,
    val controllers: List<StateController>,
    val stateType: String? = null,
    val moveType: String? = null,
    val physics: String? = null,
    val control: Boolean? = null,
    val velocityX: Int? = null,
    val velocityY: Int? = null
)
data class MugenConstants(
    val maxLife: Int = 1000,
    val front: Int = 15,
    val back: Int = 15,
    val gravity: Int = Fixed.of(0.7),
    val xScale: Int = Fixed.ONE,
    val yScale: Int = Fixed.ONE
)
data class FighterDefinition(
    val name: String, val animations: Map<Int, AirAction> = emptyMap(),
    val states: Map<Int, StateProgram> = emptyMap(),
    val maxLife: Int = 1000,
    val groundFront: Int = 15,
    val groundBack: Int = 15,
    val airGravity: Int = Fixed.of(0.7),
    val xScale: Int = Fixed.ONE,
    val yScale: Int = Fixed.ONE
) {
    companion object {
        fun fromScript(name: String, air: String, cns: String, cmd: String = ""): FighterDefinition {
            val constants = MugenCnsParser.constants(cns)
            // MUGEN CMD embeds StateDef -1 and controllers AFTER [Command] sections.
            // Motion definitions alone cannot activate any authored combat move.
            val allStates = if (cmd.isBlank()) cns else cns + "\n" + cmd
            return FighterDefinition(
                name, MugenAirParser.parse(air), MugenCnsParser.parse(allStates),
                constants.maxLife, constants.front, constants.back,
                constants.gravity, constants.xScale, constants.yScale
            )
        }
    }
}

object MugenCnsParser {
    /** Read fighter base constants without coupling actors to script text. */
    fun constants(source: String): MugenConstants {
        val script = MugenDefParser.parse(source)
        val size = script.section("Size")
        val movement = script.section("Movement")
        fun fixed(raw: String?, fallback: Int): Int =
            raw?.toDoubleOrNull()?.takeIf { it.isFinite() }?.let {
                Fixed.of(it.coerceIn(0.1,4.0))
            } ?: fallback
        return MugenConstants(
            maxLife = script.section("Data")?.int("life",1000)?.coerceIn(1,100000) ?: 1000,
            front = size?.int("ground.front",15)?.coerceIn(0,200) ?: 15,
            back = size?.int("ground.back",15)?.coerceIn(0,200) ?: 15,
            gravity = movement?.get("yaccel")?.toDoubleOrNull()?.let {
                Fixed.of(it.coerceIn(0.0,4.0))
            } ?: Fixed.of(0.7),
            xScale = fixed(size?.get("xscale"),Fixed.ONE),
            yScale = fixed(size?.get("yscale"),Fixed.ONE)
        )
    }
    private val state = Regex("state\\s+(-?\\d+)(?:\\s*,.*)?", RegexOption.IGNORE_CASE)
    private val statedef = Regex("statedef\\s+(-?\\d+)", RegexOption.IGNORE_CASE)
    /** Preserve the authored order. A [State] with no triggers never activates. */
    fun parse(source: String): Map<Int, StateProgram> {
        val sections = MugenDefParser.parse(source).sections
        val controllers = linkedMapOf<Int, MutableList<StateController>>()
        val metadata = mutableMapOf<Int, MugenSection>()
        var current: Int? = null
        for (section in sections) {
            val d = statedef.matchEntire(section.name)
            if (d != null) {
                current = d.groupValues[1].toInt()
                metadata[current] = section
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
                params["type"] ?: "Null", params.toMap(), all.toList(),
                grouped.mapValues { it.value.toList() }))
        }
        return controllers.mapValues { (n, c) ->
            val m = metadata[n]
            val velocity = m?.get("velset")?.split(",") ?: emptyList()
            StateProgram(n, m?.get("anim")?.toIntOrNull(), c.toList(),
                m?.get("type")?.uppercase(), m?.get("movetype")?.uppercase(),
                m?.get("physics")?.uppercase(), m?.get("ctrl")?.toIntOrNull()?.let { it != 0 },
                velocity.getOrNull(0)?.trim()?.toDoubleOrNull()?.let(Fixed::of),
                velocity.getOrNull(1)?.trim()?.toDoubleOrNull()?.let(Fixed::of))
        }
    }
}

/** Intentionally bounded expression subset; unsupported script branches fail closed. */
object CoreTriggers {
    private val commandPattern = Regex("""(?i)^command\s*=\s*["']?([a-z0-9_ +.-]+)["']?$""")
    private val comparison = Regex(
        """(?i)^(time|stateno|life|power|pos x|pos y|vel x|vel y|ctrl|p2dist x|p2dist y|roundstate|var\(\d+\)|fvar\(\d+\)|statetype|movetype)\s*(=|!=|<=|>=|<|>)\s*("?[a-z]+?"?|-?\d+(?:\.\d+)?)$"""
    )
    fun test(expr: String, actor: FightingCharacter, errors: MutableSet<String>): Boolean =
        CoreExpression.test(expr, actor, errors)

    fun controllerEnabled(c: StateController, fighter: FightingCharacter, errors: MutableSet<String>): Boolean {
        if (c.triggerGroups.isEmpty()) return false
        if (!c.triggerAll.all { test(it, fighter, errors) }) return false
        return c.triggerGroups.values.any { group -> group.all { test(it, fighter, errors) } }
    }
}

class FightingCharacter(
    val definition: FighterDefinition,
    val id: Int,
    val commands: List<MugenCommand> = emptyList()
) {
    val input = InputBuffer()
    private val entityRequests = mutableListOf<EntityRequest>()
    fun flushEntityRequests(): List<EntityRequest> =
        entityRequests.toList().also { entityRequests.clear() }
    val vars = IntArray(60)
    val fvars = DoubleArray(40)
    var opponent: FightingCharacter? = null
    var world: DeterministicFight? = null
    var moveContact = false
    var moveHit = false
    var moveGuarded = false
    var parent: FightingCharacter? = null
    var destroyed = false
    var hitCount = 0
    private var randomState = 0x6d2b79f5 xor id
    val asserted: MutableSet<String> = linkedSetOf()
    var life = definition.maxLife
    var power = 0
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
    var hitStunLeft = 0
        private set
    var roundState = 2
    var stateType = "S"
        private set
    var moveType = "I"
        private set
    var control = true
    var activeHitDef: HitDefinition? = null
        private set
    private val struck = mutableSetOf<Int>()
    private val controllerActivation = mutableMapOf<Pair<Int,Int>,Int>()
    private var evaluationIssues: MutableSet<String> = linkedSetOf()
    var animation: AirAnimationPlayer? = null
        private set
    init { changeState(0) }
    fun changeState(state: Int) {
        val oldAnim = animation?.action?.number
        stateNo = state
        timeInState = 0
        control = state < 5000
        activeHitDef = null
        struck.clear()
        controllerActivation.clear()
        moveContact = false
        moveHit = false
        moveGuarded = false
        val program = definition.states[state]
        stateType = program?.stateType ?: (if (state >= 5000) "S" else stateType)
        moveType = program?.moveType ?: (if (state >= 5000) "H" else "I")
        control = program?.control ?: control
        program?.velocityX?.let { velX = it }
        program?.velocityY?.let { velY = it }
        val newAnim = program?.animation ?: state
        if (oldAnim != newAnim || animation == null)
            animation = definition.animations[newAnim]?.let(::AirAnimationPlayer)
    }
    fun changeAnimation(id: Int) {
        animation = definition.animations[id]?.let(::AirAnimationPlayer)
    }
    fun canHit(target: Int): Boolean = activeHitDef != null && !struck.contains(target)
    fun markHit(target: Int) { struck.add(target) }
    fun attackBoxes(): List<MugenRect> = animation?.frame?.boxes
        ?.filter { it.attack }?.map { it.rect.world(posX, posY, facingRight, definition.xScale, definition.yScale) } ?: emptyList()
    fun hurtBoxes(): List<MugenRect> = animation?.frame?.boxes
        ?.filterNot { it.attack }?.map { it.rect.world(posX, posY, facingRight) } ?: emptyList()
    private fun number(raw: String?, default: Int = 0): Int =
        raw?.let { CoreExpression.number(it, this, evaluationIssues)?.let(Fixed::of) } ?: default
    private fun integer(raw: String?, default: Int = 0): Int =
        raw?.let { CoreExpression.number(it, this, evaluationIssues)?.toInt() } ?: default
    private fun runController(c: StateController, errors: MutableSet<String>): Boolean {
        val args = c.params
        when (c.type.lowercase()) {
            "null" -> {}
            "velset" -> { velX = number(args["x"], velX); velY = number(args["y"], velY) }
            "veladd" -> { velX += number(args["x"]); velY += number(args["y"]) }
            "velmul" -> {
                val x = args["x"]?.trim()?.toDoubleOrNull() ?: 1.0
                val y = args["y"]?.trim()?.toDoubleOrNull() ?: 1.0
                velX = (velX * x).toInt()
                velY = (velY * y).toInt()
            }
            "gravity" -> { velY += Fixed.of(0.7) }
            "turn" -> { facingRight = !facingRight }
            "posadd" -> { posX += number(args["x"]); posY += number(args["y"]) }
            "posset" -> { posX = number(args["x"], posX); posY = number(args["y"], posY) }
            "ctrlset" -> control = integer(args["value"]) != 0
            "changestate", "selfstate" -> {
                val next = args["value"]?.trim()?.toIntOrNull()
                if (next == null) errors.add("Non-constant ChangeState: " + args["value"])
                else { changeState(next); return true }
            }
            "changeanim" -> {
                val next = args["value"]?.trim()?.toIntOrNull()
                if (next != null) changeAnimation(next) else errors.add("Non-constant ChangeAnim")
            }
            "statetypeset" -> {
                args["statetype"]?.uppercase()?.let { stateType = it }
                args["movetype"]?.uppercase()?.let { moveType = it }
            }
            "lifeadd" -> {
                life = (life + integer(args["value"])).coerceIn(0, definition.maxLife)
            }
            "lifeset" -> { life = integer(args["value"],life).coerceIn(0, definition.maxLife) }
            "hitadd" -> { hitCount = (hitCount + integer(args["value"])).coerceAtLeast(0) }
            "assertspecial" -> {
                args["flag"]?.lowercase()?.let { asserted.add(it) }
            }
            "destroyself" -> {
                if (parent == null) errors.add("DestroySelf ignored for a root fighter")
                else { destroyed = true; return true }
            }
            "poweradd" -> { power = (power + integer(args["value"])).coerceIn(0, 3000) }
            "varrandom" -> {
                val index = integer(args["v"], -1)
                if (index in vars.indices) {
                    randomState = randomState * 1664525 + 1013904223
                    val upper = integer(args["range"], 1000).coerceIn(0, 1_000_000)
                    vars[index] = (randomState ushr 1) % (upper + 1)
                } else errors.add("Unsupported VarRandom slot")
            }
            "varrangeset" -> {
                val first = integer(args["first"], 0).coerceIn(0, vars.lastIndex)
                val last = integer(args["last"], vars.lastIndex).coerceIn(0, vars.lastIndex)
                if (first <= last) for (slot in first..last) vars[slot] = integer(args["value"])
            }
            "parentvarset" -> {
                val index = integer(args["v"], -1)
                val parentVars = parent?.vars
                if (parentVars == null || index !in parentVars.indices)
                    errors.add("ParentVarSet requires valid helper parent/slot")
                else parentVars[index] = integer(args["value"])
            }
            "varset", "varadd" -> {
                val index = integer(args["v"], -1)
                val value = integer(args["value"])
                if (index in vars.indices) {
                    vars[index] = if (c.type.equals("varadd", true)) vars[index] + value else value
                } else errors.add("Unsupported VarSet/VarAdd slot: " + args["v"])
            }
            "helper" -> {
                val offset = (args["pos"] ?: "0,0").split(',')
                entityRequests.add(EntityRequest.Helper(
                    this,
                    integer(args["id"]),
                    integer(args["stateno"]),
                    number(offset.getOrNull(0)),
                    number(offset.getOrNull(1)),
                    integer(args["facing"], 1),
                    integer(args["keyctrl"]) != 0,
                    integer(args["bindtime"])
                ))
            }
            "projectile" -> {
                val position = (args["offset"] ?: "0,0").split(',')
                val velocity = (args["velocity"] ?: "0,0").split(',')
                val damage = (args["projdamage"] ?: "0,0").split(',')
                val groundVelocity = (args["projground.velocity"] ?: "0,0").split(',')
                val pause = (args["projpausetime"] ?: "0,0").split(',')
                val hit = HitDefinition(
                    attr = args["projattr"] ?: "S, SP",
                    damage = integer(damage.getOrNull(0)),
                    guardDamage = integer(damage.getOrNull(1)),
                    guardFlag = (args["projguardflag"] ?: "HL").uppercase(),
                    hitFlag = (args["projhitflag"] ?: "MAF").uppercase(),
                    hitPause = integer(pause.getOrNull(0)),
                    defenderPause = integer(pause.getOrNull(1)),
                    velocityX = number(groundVelocity.getOrNull(0)),
                    velocityY = number(groundVelocity.getOrNull(1))
                )
                entityRequests.add(EntityRequest.Projectile(
                    this,
                    integer(args["projid"]),
                    integer(args["projanim"], -1),
                    number(position.getOrNull(0)), number(position.getOrNull(1)),
                    number(velocity.getOrNull(0)), number(velocity.getOrNull(1)),
                    integer(args["projremovetime"], 60),
                    hit
                ))
            }
            "hitdef" -> {
                val pause = (args["pausetime"] ?: "0,0").split(',')
                val velocity = (args["ground.velocity"] ?: "0,0").split(',')
                val guardVelocity = (args["guard.velocity"] ?: "0,0").split(',')
                val priority = (args["priority"] ?: "4,Hit").split(',')
                val next = HitDefinition(
                    attr = args["attr"] ?: "S, NA",
                    damage = integer(args["damage"]?.substringBefore(',')),
                    hitPause = integer(pause.getOrNull(0)).coerceIn(0, 120),
                    velocityX = number(velocity.getOrNull(0)),
                    velocityY = number(velocity.getOrNull(1)),
                    guardDamage = integer(args["guard.damage"]),
                    guardFlag = (args["guardflag"] ?: "").uppercase().replace(" ", ""),
                    hitFlag = (args["hitflag"] ?: "MAF").uppercase().replace(" ", ""),
                    priority = integer(priority.getOrNull(0), 4).coerceIn(1, 7),
                    priorityType = priority.getOrNull(1)?.trim() ?: "Hit",
                    defenderPause = integer(pause.getOrNull(1), integer(pause.getOrNull(0))).coerceIn(0,120),
                    guardPause = integer((args["guard.pausetime"] ?: args["pausetime"])?.substringBefore(','), integer(pause.getOrNull(0))).coerceIn(0,120),
                    guardVelocityX = number(guardVelocity.getOrNull(0)),
                    guardVelocityY = number(guardVelocity.getOrNull(1)),
                    hitTime = integer(args["ground.hittime"], 12).coerceIn(0,600)
                )
                // A controller evaluated every tick must not reset a target's struck set.
                // State entry starts a new contact window; multi-hit/HitOnce need further parity.
                if (activeHitDef == null) activeHitDef = next
            }
            else -> errors.add("Unsupported controller: " + c.type)
        }
        return false
    }
    private fun executeState(n: Int, errors: MutableSet<String>, paused: Boolean): Boolean {
        val p = definition.states[n] ?: return false
        for ((index, controller) in p.controllers.withIndex()) {
            val opts = controller.params
            if (paused && opts["ignorehitpause"]?.trim() != "1") continue
            if (!CoreTriggers.controllerEnabled(controller, this, errors)) continue
            val persistence = opts["persistent"]?.trim()?.toIntOrNull() ?: 1
            val key = n to index
            val activations = controllerActivation[key] ?: 0
            // persistent=0: first valid activation only; persistent=N: every Nth.
            val allow = persistence != 0 || activations == 0
            controllerActivation[key] = activations + 1
            if (!allow || persistence > 1 && activations % persistence != 0) continue
            if (runController(controller, errors)) return true
        }
        return false
    }
    fun tick(errors: MutableSet<String>) {
        if (destroyed) return
        asserted.clear()
        evaluationIssues = errors
        val paused = hitPauseLeft > 0
        if (paused) hitPauseLeft--
        if (!paused && hitStunLeft > 0) hitStunLeft--
        // Global state controllers participate in the pause only when explicitly opted in.
        val changed = executeState(-3, errors, paused) ||
            executeState(-2, errors, paused) ||
            executeState(-1, errors, paused) ||
            executeState(stateNo, errors, paused)
        if (changed || paused) return
        posX += velX
        posY += velY
        timeInState++
        animation?.advance()
        if (hitStunLeft == 0 && (stateNo == 5000 || stateNo in 150..152) &&
            stateNo !in definition.states && life > 0)
            changeState(0)
    }
    fun blocks(hit: HitDefinition): Boolean {
        if (!control && stateNo !in 150..152) return false
        val backwards = if (facingRight) Directions.L else Directions.R
        if (input.latest()?.directions?.and(backwards) != backwards) return false
        val flag = hit.guardFlag
        return when (stateType) {
            "A" -> 'A' in flag
            "C" -> 'L' in flag || 'M' in flag
            else -> 'H' in flag || 'M' in flag
        }
    }
    fun canReceive(hit: HitDefinition): Boolean {
        if (life <= 0) return false
        val flags = hit.hitFlag
        return when (stateType) {
            "L" -> 'D' in flags
            "A" -> 'A' in flags || 'F' in flags
            else -> flags.any { it == 'H' || it == 'L' || it == 'M' }
        }
    }
    fun receiveHit(hit: HitDefinition, attackerFacingRight: Boolean, guarded: Boolean = false) {
        life = (life - if (guarded) hit.guardDamage.coerceAtLeast(0) else hit.damage.coerceAtLeast(0)).coerceAtLeast(0)
        val resultingState = if (life == 0) 5150 else if (guarded)
            when (stateType) { "A" -> 152; "C" -> 151; else -> 150 }
        else 5000
        changeState(resultingState)
        velX = (if (guarded) hit.guardVelocityX else hit.velocityX) *
            if (attackerFacingRight) 1 else -1
        velY = if (guarded) hit.guardVelocityY else hit.velocityY
        hitPauseLeft = if (guarded) hit.guardPause else hit.defenderPause
        hitStunLeft = hit.hitTime
    }
}

data class FightContact(val attacker: Int, val defender: Int, val guarded: Boolean, val damage: Int)

/** Two-actor deterministic subset, not a full MUGEN contact phase. */
class DeterministicFight(val p1: FightingCharacter, val p2: FightingCharacter) {
    val issues: MutableSet<String> = linkedSetOf()
    val contacts: MutableList<FightContact> = ArrayList()
    val entities = CoreEntities(this)
    var roundFlow: CoreRoundFlow? = null
        private set
    fun enableRoundFlow(rules: CoreRoundRules = CoreRoundRules()) {
        roundFlow = CoreRoundFlow(rules)
    }
    var arena: ArenaRules? = null
        private set
    var camera: MugenCamera? = null
        private set
    fun configureArena(leftPixels:Int,rightPixels:Int,groundPixels:Int=0,push:Boolean=true,
                       autoFace:Boolean=false) {
        require(leftPixels in -100_000..100_000 && rightPixels in -100_000..100_000)
        arena = ArenaRules(leftPixels*Fixed.ONE,rightPixels*Fixed.ONE,
            groundPixels*Fixed.ONE,pushPlayers=push,autoFaceIdle=autoFace)
        camera = MugenCamera(CameraConfig(
            left=leftPixels.toDouble(),right=rightPixels.toDouble(),
            top=(groundPixels-600).toDouble(),bottom=groundPixels.toDouble()))
    }
    var frame: Long = 0
        private set
    init {
        require(p1.id != p2.id)
        p1.opponent = p2
        p2.opponent = p1
        p1.world = this
        p2.world = this
    }
    fun step(a: InputFrame = InputFrame(), b: InputFrame = InputFrame()) {
        contacts.clear()
        val sequence = roundFlow
        p1.roundState = sequence?.roundState() ?: 2
        p2.roundState = sequence?.roundState() ?: 2
        if (sequence?.finished == true) { frame++; return }
        val allowCombat = sequence == null || sequence.active
        p1.input.update(if (allowCombat) a else InputFrame())
        p2.input.update(if (allowCombat) b else InputFrame())
        val p1Frozen = p1.hitPauseLeft > 0
        val p2Frozen = p2.hitPauseLeft > 0
        p1.tick(issues)
        p2.tick(issues)
        arena?.step(p1,p2,p1Frozen,p2Frozen)
        camera?.update(p1,p2)
        // Contact candidates collected before mutating either fighter: genuine trades.
        var ab = allowCombat && !p1Frozen && p1.canHit(p2.id) && p2.canReceive(p1.activeHitDef!!) && connects(p1, p2)
        var ba = allowCombat && !p2Frozen && p2.canHit(p1.id) && p1.canReceive(p2.activeHitDef!!) && connects(p2, p1)
        if (ab && ba) {
            val x = p1.activeHitDef!!
            val y = p2.activeHitDef!!
            if (x.priority > y.priority) ba = false
            else if (y.priority > x.priority) ab = false
            else if (x.priorityType.equals("dodge", true) || y.priorityType.equals("dodge", true)) {
                ab = false; ba = false
            } else {
                if (!x.priorityType.equals("hit", true)) ab = false
                if (!y.priorityType.equals("hit", true)) ba = false
            }
        }
        val ah = if (ab) p1.activeHitDef else null
        val bh = if (ba) p2.activeHitDef else null
        val guardB = ah != null && p2.blocks(ah)
        val guardA = bh != null && p1.blocks(bh)
        if (ah != null) {
            p1.markHit(p2.id)
            p1.moveContact = true
            p1.moveHit = !guardB
            p1.moveGuarded = guardB
            p1.hitPauseLeft = if (guardB) ah.guardPause else ah.hitPause
            contacts.add(FightContact(p1.id, p2.id, guardB, if (guardB) ah.guardDamage else ah.damage))
        }
        if (bh != null) {
            p2.markHit(p1.id)
            p2.moveContact = true
            p2.moveHit = !guardA
            p2.moveGuarded = guardA
            p2.hitPauseLeft = if (guardA) bh.guardPause else bh.hitPause
            contacts.add(FightContact(p2.id, p1.id, guardA, if (guardA) bh.guardDamage else bh.damage))
        }
        if (ah != null) p2.receiveHit(ah, p1.facingRight, guardB)
        if (bh != null) p1.receiveHit(bh, p2.facingRight, guardA)
        if (allowCombat) entities.step(issues)
        val spawned = p1.flushEntityRequests() + p2.flushEntityRequests()
        entities.add(spawned, issues)
        sequence?.step(p1,p2)
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
