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
    val hitTime: Int = 12,
    val id: Int = 0,
    val p2State: Int? = null,
    val p2GetP1State: Boolean = true,
    val stateOwner: FightingCharacter? = null,
    val p1State: Int? = null,
    val airVelocityX: Int = 0,val airVelocityY: Int = 0,
    val airHitTime: Int = 20,val guardHitTime: Int = hitTime,
    val fall: Boolean = false,val airFall: Boolean = fall,
    val guardDefenderPause: Int = guardPause,
    val kill: Boolean = true,val guardKill: Boolean = true,
    val getPower: Int = HitPowerRules.DEFAULT.attacker(damage),
    val givePower: Int = HitPowerRules.DEFAULT.defender(damage),
    val guardGetPower: Int = getPower/2,val guardGivePower: Int = givePower/2,
    /** Projectiles retain the creator's factor; body hits use the live actor. */
    val capturedAttackMultiplier: Double? = null,
    val fallVelocityX: Int? = null,val fallVelocityY: Int = Fixed.of(-4.5)
) {
    init { require(capturedAttackMultiplier == null || capturedAttackMultiplier in 0.0..Float.MAX_VALUE.toDouble()) {
        "Invalid captured attack multiplier"
    } }
}
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
    val velocityX: Double? = null,
    val velocityY: Double? = null,
    val hitDefPersist: String? = null,
    val moveHitPersist: String? = null,
    val hitCountPersist: String? = null
)
data class MugenConstants(
    val maxLife: Int = 1000,
    val front: Int = 15,
    val back: Int = 15,
    val gravity: Int = Fixed.of(0.7),
    val xScale: Int = Fixed.ONE,
    val yScale: Int = Fixed.ONE,
    val headX: Int = 0, val headY: Int = -90*Fixed.ONE,
    val midX: Int = 0, val midY: Int = -60*Fixed.ONE,
    val projectileDoScale: Boolean = false,
    val maxPower: Int = 3000,
    val defence: Int = 100,
    val attack: Int = 100
)
data class FighterDefinition(
    val name: String, val animations: Map<Int, AirAction> = emptyMap(),
    val states: Map<Int, StateProgram> = emptyMap(),
    val maxLife: Int = 1000,
    val groundFront: Int = 15,
    val groundBack: Int = 15,
    val airGravity: Int = Fixed.of(0.7),
    val xScale: Int = Fixed.ONE,
    val yScale: Int = Fixed.ONE,
    val localCoordWidth: Int = 320,
    val localCoordHeight: Int = 240,
    val headX: Int = 0, val headY: Int = -90*Fixed.ONE,
    val midX: Int = 0, val midY: Int = -60*Fixed.ONE,
    val defaultExplodPostype: String = "p1",
    val projectileDoScale: Boolean = false,
    val maxPower: Int = 3000,
    val defence: Int = 100,
    val attack: Int = 100
) {
    init {
        require(localCoordWidth in 160..4096 && localCoordHeight in 120..4096) { "Invalid character localcoord" }
        require(xScale in 0..65536 && yScale in 0..65536) { "Invalid character sprite scale" }
        require(maxPower >= 0) { "Invalid character maximum power" }
        require(defence in 1..100000) { "Invalid character base defence" }
        require(attack in 0..100000) { "Invalid character base attack" }
    }
    val coordinates=MugenCoordinates(localCoordWidth)
    /** Rounded compatibility scale accessors. Collision geometry converts
     * whole coordinates through coordinates.box to retain rational precision. */
    val collisionScaleX: Int
        get() = coordinates.fixedToWorld(xScale)
    val collisionScaleY: Int
        get() = coordinates.fixedToWorld(yScale)
    companion object {
        fun fromScript(name: String, air: String, cns: String, cmd: String = "",
                       defText: String = ""): FighterDefinition {
            val constants = MugenCnsParser.constants(cns)
            // Character localcoord is authored in DEF, not the AIR or CNS.
            // Nu-13 uses 1008x756. Never assume every character is 320x240.
            val info = if(defText.isBlank()) null else MugenDefParser.parse(defText).section("info")
            val local = info?.get("localcoord")?.split(',') ?: emptyList()
            val localWidth=local.getOrNull(0)?.trim()?.toIntOrNull()
                ?.takeIf { it in 160..4096 } ?: 320
            val localHeight=local.getOrNull(1)?.trim()?.toIntOrNull()
                ?.takeIf { it in 120..4096 } ?: 240
            // MUGEN CMD embeds StateDef -1 and controllers AFTER [Command] sections.
            // Motion definitions alone cannot activate any authored combat move.
            val allStates = if (cmd.isBlank()) cns else cns + "\n" + cmd
            val version=info?.get("mugenversion")?.trim()?.trim('"','\'') ?: ""
            val modern=Regex("^1\\.(\\d+)").find(version)?.groupValues?.get(1)?.toIntOrNull()?.let { it >= 1 } ?: false
            return FighterDefinition(
                name, MugenAirParser.parse(air), MugenCnsParser.parse(allStates),
                constants.maxLife, constants.front, constants.back,
                constants.gravity, constants.xScale, constants.yScale,
                localWidth,localHeight,constants.headX,constants.headY,constants.midX,constants.midY,
                if(modern)"none" else "p1",constants.projectileDoScale,constants.maxPower,constants.defence,constants.attack
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
        fun point(key: String, component: Int, fallback: Int): Int = size?.get(key)
            ?.split(',')?.getOrNull(component)?.trim()?.toDoubleOrNull()
            ?.takeIf { it.isFinite() && it in -100000.0..100000.0 }?.let(Fixed::of) ?: fallback
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
            yScale = fixed(size?.get("yscale"),Fixed.ONE),
            headX = point("head.pos",0,0), headY = point("head.pos",1,-90*Fixed.ONE),
            midX = point("mid.pos",0,0), midY = point("mid.pos",1,-60*Fixed.ONE),
            projectileDoScale = size?.get("proj.doscale")?.toDoubleOrNull()
                ?.takeIf { it.isFinite() }?.let { it != 0.0 } ?: false,
            maxPower = script.section("Data")?.int("power",3000)?.coerceAtLeast(0) ?: 3000,
            defence = script.section("Data")?.int("defence",100)?.coerceIn(1,100000) ?: 100,
            attack = script.section("Data")?.int("attack",100)?.coerceIn(0,100000) ?: 100
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
                velocity.getOrNull(0)?.trim()?.toDoubleOrNull()?.takeIf { it.isFinite() },
                velocity.getOrNull(1)?.trim()?.toDoubleOrNull()?.takeIf { it.isFinite() },
                m?.get("hitdefpersist"),m?.get("movehitpersist"),m?.get("hitcountpersist"))
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
    private val commandCache = mutableMapOf<String,Boolean>()
    fun commandActive(name: String): Boolean {
        val normalized = name.lowercase()
        return commandCache.getOrPut(normalized) {
            commands.any { it.name.equals(name,true) && input.matches(it,facingRight) }
        }
    }
    private val entityRequests = mutableListOf<EntityRequest>()
    fun flushEntityRequests(): List<EntityRequest> =
        entityRequests.toList().also { entityRequests.clear() }
    val vars = IntArray(60)
    val fvars = DoubleArray(40)
    val sysVars = IntArray(60)
    val sysFvars = DoubleArray(40)
    var opponent: FightingCharacter? = null
    var world: DeterministicFight? = null
    var moveContact = false
    var moveHit = false
    var moveGuarded = false
    var parent: FightingCharacter? = null
    var binding: ActorBinding? = null
        private set
    internal var hitPauseThisTick = false
        private set
    internal val hitFilters = CoreHitFilters()
    internal val hitOverrides = CoreHitOverrides()
    internal val projectileHistory = CoreProjectileHistory()
    internal var getHitData = CoreGetHitData()
        private set
    fun getHitVar(name: String): Double = when(name) {
        "damage" -> getHitData.damage.toDouble()
        "xvel" -> coordinates.toLocal(getHitData.velocityX)
        "yvel" -> coordinates.toLocal(getHitData.velocityY)
        "hittime" -> getHitData.time.toDouble()
        "hitshaketime" -> hitPauseLeft.toDouble()
        "guarded" -> if(getHitData.guarded)1.0 else 0.0
        "fall" -> if(getHitData.fall)1.0 else 0.0
        "fall.xvel" -> coordinates.toLocal(getHitData.fallVelocityX ?: 0)
        "fall.yvel" -> coordinates.toLocal(getHitData.fallVelocityY)
        else -> throw IllegalArgumentException("Unsupported GetHitVar field: $name")
    }
    fun releaseBinding() { binding = null }
    internal fun canBindTo(anchor: FightingCharacter, source: FightingCharacter): Boolean = bindingProblem(anchor,source) == null
    internal fun bindingProblem(anchor: FightingCharacter, source: FightingCharacter): String? {
        if (world == null || world !== anchor.world) return "Binding actors must belong to the same fight"
        if (destroyed || anchor.destroyed) return "Binding actor or anchor is destroyed"
        if(source.world != null && source.world !== world) return "Binding source must belong to the same fight"
        val seen = mutableSetOf<FightingCharacter>()
        var current: FightingCharacter? = anchor
        while(current != null) {
            if(current === this || !seen.add(current)) return "Cyclic actor binding"
            current = current.binding?.anchor
        }
        return null
    }
    internal fun bindTo(anchor: FightingCharacter, x: Int, y: Int, time: Int, facing: Int = 0) {
        require(time == -1 || time > 0)
        require(canBindTo(anchor,this)) { "Invalid binding anchor" }
        binding = ActorBinding(anchor,x,y,time,facing)
    }
    /** Script ownership and AIR ownership are independent of the victim's
     * immutable character definition, variables, life and SFF resources. */
    var stateOwner: FightingCharacter = this
        private set
    /** Expressions and spatial controllers use the active state owner's
     * coordinates, including own -2 code executed while in a foreign state. */
    val coordinates: MugenCoordinates get() = stateOwner.definition.coordinates
    fun bodyWidthWorld(direction: Int): Int = definition.coordinates.toWorld(
        (if(facingRight == (direction > 0))definition.groundFront else definition.groundBack).toDouble())
    var animationOwner: FightingCharacter = this
        private set
    private var scriptOwner: FightingCharacter = this
    val stateProgram: StateProgram? get() = stateOwner.definition.states[stateNo]
    private val capturedTargets = linkedMapOf<FightingCharacter, Int>()
    fun targets(hitId: Int = -1): List<FightingCharacter> {
        return capturedTargets.filter { (target, id) ->
            target !== this && !target.destroyed && target.life > 0 && target.moveType == "H" &&
                (hitId == -1 || hitId == id)
        }.keys.toList()
    }
    fun captureTarget(target: FightingCharacter, hitId: Int) {
        if (target !== this && !target.destroyed && target.life > 0 && target.moveType == "H")
            capturedTargets[target] = hitId
    }
    var destroyed = false
    var hitCount = 0
    private var randomState = 0x6d2b79f5 xor id
    val asserted: MutableSet<String> = linkedSetOf()
    var life = definition.maxLife
    var attackMultiplier=1.0
        internal set
    var defenceMultiplier=1.0
        internal set
    private var powerValue = 0
    /** Helpers share their root's meter, independent of the active state bank. */
    internal fun powerOwner(): FightingCharacter {
        if(parent == null)return this
        var actor=this
        val seen=mutableSetOf<FightingCharacter>()
        while(actor.parent != null) {
            require(seen.add(actor)) { "Cyclic helper parent chain" }
            actor=actor.parent!!
        }
        return actor
    }
    val maxPower: Int get()=powerOwner().definition.maxPower
    var power: Int
        get()=powerOwner().powerValue
        set(value) {
            val owner=powerOwner()
            owner.powerValue=value.coerceIn(0,owner.definition.maxPower)
        }
    internal fun addPower(value: Int) {
        val owner=powerOwner()
        owner.powerValue=(owner.powerValue.toLong()+value)
            .coerceIn(0L,owner.definition.maxPower.toLong()).toInt()
    }
    var posX = 0
    var posY = 0
    var velX = 0
    var velY = 0
    var facingRight = true
    var stateNo = 0
        private set
    internal var stateRevision = 0L
        private set
    internal var contactStateRevision = 0L
        private set
    internal fun beginContactPhase() { contactStateRevision=stateRevision }
    internal fun followSuccessfulHit(hit: HitDefinition,errors: MutableSet<String>) {
        val next=hit.p1State ?: return
        if(destroyed || life <= 0)return
        enterAuthoredState(next,hit.stateOwner ?: stateOwner,errors)
    }
    var timeInState = 0
        private set
    var hitPauseLeft = 0
    var hitStunLeft = 0
        private set
    /** Only missing own-bank common reactions use the arena fallback. Authored
     * and borrowed states, including HitOverride destinations, retain control. */
    internal var fallbackHitReaction = false
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
    private var carriedHitDef=false
    private val controllerActivation = mutableMapOf<Pair<Int,Int>,Int>()
    internal val initializationIssues: MutableSet<String> = linkedSetOf()
    private var evaluationIssues: MutableSet<String> = initializationIssues
    var animation: AirAnimationPlayer? = null
        private set
    init { changeState(0) }
    fun changeState(state: Int, owner: FightingCharacter = stateOwner,
                    controlOverride: Boolean? = null,
                    errors: MutableSet<String> = world?.issues ?: evaluationIssues) {
        fallbackHitReaction = false
        stateRevision++
        stateOwner = owner
        stateNo = state
        timeInState = 0
        controllerActivation.clear()
        val program = stateProgram
        val persistence=CoreStatePersistence.read(program,this,errors)
        if(!persistence.hitDef) {
            activeHitDef=null
            struck.clear()
        }
        carriedHitDef=persistence.hitDef && activeHitDef != null
        if(!persistence.moveHit) {
            moveContact=false;moveHit=false;moveGuarded=false
        }
        if(!persistence.hitCount)hitCount=0
        val neutralFallback = owner === this && state == 0 && program == null
        stateType = program?.stateType ?: (if (state >= 5000) "S" else stateType)
        moveType = program?.moveType ?: (if (state >= 5000) "H" else "I")
        control = program?.control ?: controlOverride ?: if (neutralFallback) true else control
        program?.velocityX?.let { velX = coordinates.toWorld(it) }
        program?.velocityY?.let { velY = coordinates.toWorld(it) }
        // Missing StateDef anim preserves the current AIR, including a
        // borrowed ChangeAnim2 action. Initial synthetic actors may use 0.
        val newAnim = program?.animation ?: if (neutralFallback || animation == null && state == 0) 0 else null
        if (newAnim != null && newAnim != -1) changeAnimation(newAnim)
    }
    fun changeAnimation(id: Int, owner: FightingCharacter = this, element: Int = 1): Boolean {
        val action = owner.definition.animations[id] ?: return false
        if (element !in 1..action.frames.size) return false
        animation = AirAnimationPlayer(action).also { it.selectElement(element) }
        animationOwner = owner
        return true
    }
    /** State ownership changes the script unit system. Existing physical
     * positions/velocities are already canonical and must never be rescaled. */
    fun enterAuthoredState(state: Int, owner: FightingCharacter,
                           errors: MutableSet<String>, controlOverride: Boolean? = null): Boolean {
        if (state !in owner.definition.states && !(owner === this && state == 0)) {
            errors.add("Missing custom/transition state: $state (owner ${owner.id})")
            return false
        }
        if(owner.world != null && world != null && owner.world !== world) {
            errors.add("State owner belongs to another fight")
            return false
        }
        changeState(state, owner, controlOverride,errors)
        return true
    }
    fun canHit(target: Int): Boolean = activeHitDef != null && !struck.contains(target)
    fun markHit(target: Int) { struck.add(target) }
    fun attackBoxes(): List<MugenRect> = animation?.frame?.boxes
        ?.filter { it.attack }?.map { animationOwner.definition.let { d ->
            d.coordinates.box(it.rect,posX,posY,facingRight,d.xScale,d.yScale) } } ?: emptyList()
    fun hurtBoxes(): List<MugenRect> = animation?.frame?.boxes
        ?.filterNot { it.attack }?.map { animationOwner.definition.let { d ->
            d.coordinates.box(it.rect,posX,posY,facingRight,d.xScale,d.yScale) } } ?: emptyList()
    private fun number(raw: String?, default: Int = 0): Int =
        raw?.let { CoreExpression.number(it, this, evaluationIssues)?.let(coordinates::toWorld) } ?: default
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
            "gravity" -> { velY += definition.coordinates.fixedToWorld(definition.airGravity) }
            "turn" -> { facingRight = !facingRight }
            "posadd" -> { posX += number(args["x"]); posY += number(args["y"]) }
            "posset" -> { posX = number(args["x"], posX); posY = number(args["y"], posY) }
            "ctrlset" -> control = integer(args["value"]) != 0
            "hitby", "nothitby" -> hitFilters.execute(this,c,errors)
            "hitoverride" -> hitOverrides.execute(this,c,errors)
            "hitvelset", "hitfallset", "hitfallvel" -> CoreGetHitControllers.execute(this,c,errors)
            "changestate", "selfstate" -> {
                val next = args["value"]?.let { CoreExpression.number(it, this, errors)?.toInt() }
                val owner = if (c.type.equals("selfstate", true)) this else scriptOwner
                val ctrl = args["ctrl"]?.let { CoreExpression.number(it, this, errors) ?: return false }
                    ?.takeIf { it >= 0 }?.let { it != 0.0 }
                if (next == null) errors.add("Invalid state transition value: " + args["value"])
                else if (enterAuthoredState(next, owner, errors, ctrl)) return true
            }
            "targetstate" -> {
                if ("ctrl" in args) errors.add("TargetState ctrl is not a MUGEN 1.1 parameter; ignored")
                val next = args["value"]?.let { CoreExpression.number(it, this, errors)?.toInt() }
                val wanted = args["id"]?.let {
                    CoreExpression.number(it, this, errors)?.toInt() ?: return false
                } ?: -1
                if (next == null) errors.add("Invalid TargetState value")
                else for (target in targets(wanted))
                    target.enterAuthoredState(next, scriptOwner, errors)
            }
            "targetbind", "bindtoparent", "bindtoroot", "bindtotarget" ->
                CoreBindingControllers.execute(this,c,scriptOwner,errors)
            "targetdrop" -> try {
                require(args.keys.all { it in setOf("type","excludeid","keepone","persistent","ignorehitpause") }) {
                    "Unsupported TargetDrop parameter"
                }
                fun value(raw: String)=CoreExpression.number(raw,this,errors)
                    ?: throw IllegalArgumentException("Invalid TargetDrop expression")
                val requested=args["excludeid"]?.let(::value) ?: -1.0
                require(requested in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) { "Target ID out of range" }
                val exclude=requested.toInt()
                val keepOne=(args["keepone"]?.let(::value) ?: 1.0) != 0.0
                val candidates=if(exclude == -1)emptyList() else targets(exclude)
                val retained=if(keepOne && candidates.size > 1) {
                    // Use the actor's existing seeded random stream, never a
                    // host RNG or a render-time decision.
                    randomState=randomState*1664525+1013904223
                    listOf(candidates[(randomState ushr 1)%candidates.size])
                }else candidates
                capturedTargets.keys.retainAll(retained.toSet())
            }catch(e: IllegalArgumentException) {
                errors.add("Invalid TargetDrop: ${e.message}")
            }
            "targetvelset", "targetveladd", "targetfacing" -> try {
                fun value(raw: String): Double = CoreExpression.number(raw,this,errors)
                    ?: throw IllegalArgumentException("Invalid target-control expression")
                val requestedId=args["id"]?.let(::value) ?: -1.0
                require(requestedId in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) { "Target ID out of range" }
                val id=requestedId.toInt()
                val selected=targets(id)
                if(c.type.equals("targetfacing",true)) {
                    val direction=args["value"]?.let(::value)
                        ?: throw IllegalArgumentException("TargetFacing requires value")
                    require(direction != 0.0) { "TargetFacing requires a nonzero direction" }
                    for(target in selected)target.facingRight=if(direction > 0)facingRight else !facingRight
                }else {
                    // Convert active actor units once. Set follows the player;
                    // Add follows each target, as the controller reference specifies.
                    val x=args["x"]?.let { coordinates.toWorld(value(it)) }
                    val y=args["y"]?.let { coordinates.toWorld(value(it)) }
                    val add=c.type.equals("targetveladd",true)
                    fun bounded(n: Long)=n.coerceIn(Int.MIN_VALUE.toLong(),Int.MAX_VALUE.toLong()).toInt()
                    for(target in selected) {
                        x?.let { target.velX=bounded((if(add)target.velX.toLong() else 0L)+
                            it.toLong()*(if(if(add)target.facingRight else facingRight)1 else -1)) }
                        y?.let { target.velY=bounded((if(add)target.velY.toLong() else 0L)+it) }
                    }
                }
            }catch(e: IllegalArgumentException) {
                errors.add("Invalid ${c.type}: ${e.message}")
            }
            "explod", "modifyexplod", "removeexplod", "explodbindtime" ->
                world?.effects?.execute(this,c,scriptOwner)
            "changeanim", "changeanim2" -> {
                val next = args["value"]?.let { CoreExpression.number(it, this, errors)?.toInt() }
                val owner = if (c.type.equals("changeanim2", true)) stateOwner else this
                val element = args["elem"]?.let {
                    CoreExpression.number(it, this, errors)?.toInt() ?: return false
                } ?: 1
                if (next == null || !changeAnimation(next, owner, element))
                    errors.add("Missing/invalid ${c.type} action or element: " + args["value"])
            }
            "statetypeset" -> {
                args["statetype"]?.uppercase()?.let { stateType = it }
                args["movetype"]?.uppercase()?.let { moveType = it }
            }
            "lifeadd", "lifeset", "targetlifeadd" -> CoreLifeControllers.execute(this,c,errors)
            "attackmulset", "defencemulset" -> CoreDamage.execute(this,c,errors)
            "hitadd" -> CoreHitCounts.add(this,c,errors)
            "assertspecial" -> {
                args["flag"]?.lowercase()?.let { asserted.add(it) }
            }
            "playsnd" -> {
                val pair = (args["value"] ?: "-1,-1").split(',')
                val group = integer(pair.getOrNull(0),-1)
                val sound = integer(pair.getOrNull(1),-1)
                if (group < -1 || sound < 0) errors.add("Invalid PlaySnd group/number")
                else world?.presentation?.add(CorePresentationEvent("playsnd",group,sound,
                    integer(args["channel"],-1)))
            }
            "stopsnd" -> {
                world?.presentation?.add(CorePresentationEvent("stopsnd",
                    channel=integer(args["channel"],-1)))
            }
            "destroyself" -> {
                if (parent == null) errors.add("DestroySelf ignored for a root fighter")
                else {
                    if(integer(args["removeexplods"]) != 0) world?.effects?.remove(this)
                    destroyed = true; return true
                }
            }
            "poweradd", "powerset", "targetpoweradd" -> CorePowerControllers.execute(this,c,errors)
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
            "varset", "varadd", "varmul", "parentvarset", "parentvaradd" -> {
                val operation = c.type.lowercase()
                val target = if (operation.startsWith("parent")) parent else this
                if (target == null) {
                    errors.add("Variable assignment requires a valid parent")
                } else {
                    val altPattern = Regex("^(var|fvar|sysvar|sysfvar)\\s*\\(([^)]+)\\)$")
                    val alternate = args.entries.mapNotNull { (key,value) ->
                        val match = altPattern.matchEntire(key)
                        if (match == null) null else Triple(match.groupValues[1],match.groupValues[2],value)
                    }
                    val defaultKind = when {
                        args.containsKey("sysfv") -> "sysfvar"
                        args.containsKey("sysv") -> "sysvar"
                        args.containsKey("fv") -> "fvar"
                        else -> "var"
                    }
                    val indexKey = when(defaultKind) {
                        "sysfvar" -> "sysfv"; "sysvar" -> "sysv"; "fvar" -> "fv"; else -> "v"
                    }
                    val assignments = if (alternate.isNotEmpty()) alternate else
                        listOf(Triple(defaultKind,args[indexKey] ?: "-1",args["value"] ?: "0"))
                    for ((kind,indexText,valueText) in assignments) {
                        val index = integer(indexText,-1)
                        val value = CoreExpression.number(valueText,this,errors) ?: continue
                        val isFloat = kind.endsWith("fvar")
                        if (isFloat) {
                            val slots = if (kind.startsWith("sys")) target.sysFvars else target.fvars
                            if (index !in slots.indices) { errors.add("Invalid float variable slot");continue }
                            slots[index] = when (operation) {
                                "varadd","parentvaradd" -> slots[index]+value
                                "varmul" -> slots[index]*value
                                else -> value
                            }
                        } else {
                            val slots = if (kind.startsWith("sys")) target.sysVars else target.vars
                            if (index !in slots.indices) { errors.add("Invalid integer variable slot");continue }
                            val numeric=value.toInt()
                            slots[index] = when (operation) {
                                "varadd","parentvaradd" -> slots[index]+numeric
                                "varmul" -> slots[index]*numeric
                                else -> numeric
                            }
                        }
                    }
                }
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
            "projectile" -> try {
                fun value(raw: String): Double = CoreExpression.number(raw,this,errors)
                    ?: throw IllegalArgumentException("Invalid Projectile expression: $raw")
                fun vector(key: String,x: Double=0.0,y: Double=0.0): Pair<Double,Double> {
                    val raw=args[key] ?: return x to y
                    val parts=CnsArguments.split(raw)
                    require(parts.size <= 2) { "Projectile $key requires at most two components" }
                    return value(parts[0]) to (parts.getOrNull(1)?.let(::value) ?: y)
                }
                val position=vector("offset")
                val velocity=vector("velocity")
                val acceleration=vector("accel")
                val multiplier=vector("velmul",1.0,1.0)
                val scale=vector("projscale",1.0,1.0)
                require(scale.first in -CoreProjectile.MAX_SCALE..CoreProjectile.MAX_SCALE &&
                    scale.second in -CoreProjectile.MAX_SCALE..CoreProjectile.MAX_SCALE) {
                    "Projectile scale is outside -64..64"
                }
                val lifetime=args["projremovetime"]?.let(::value) ?: -1.0
                val stageBound=args["projstagebound"]?.let { coordinates.toWorld(value(it)) } ?: 40*Fixed.ONE
                val height=args["projheightbound"]?.let { raw ->
                    val parts=CnsArguments.split(raw)
                    require(parts.size == 2) { "Projectile height bound requires two components" }
                    coordinates.toWorld(value(parts[0])) to coordinates.toWorld(value(parts[1]))
                } ?: (-240*Fixed.ONE to Fixed.ONE)
                require(stageBound >= 0 && height.first <= height.second) { "Invalid Projectile bounds" }
                require(lifetime >= -1.0 && lifetime <= Int.MAX_VALUE.toDouble()) {
                    "Projectile removetime must be -1 or nonnegative"
                }
                fun allowance(key: String,default: Int): Int {
                    val n=args[key]?.let(::value) ?: default.toDouble()
                    require(n >= 0 && n <= Int.MAX_VALUE.toDouble()) { "Projectile $key must be nonnegative" }
                    return n.toInt()
                }
                val hits=allowance("projhits",1)
                val missTime=allowance("projmisstime",0)
                val projectilePriority=allowance("projpriority",1)
                require(projectilePriority >= 1) { "Projectile projpriority must be positive" }
                val removeOnHit=(args["projremove"]?.let(::value) ?: 1.0) != 0.0
                val damage = (args["damage"] ?: args["projdamage"] ?: "0,0").split(',')
                val groundVelocity = (args["ground.velocity"] ?: args["projground.velocity"] ?: "0,0").split(',')
                val airVelocity = (args["air.velocity"] ?: args["projair.velocity"] ?: "0,0").split(',')
                val guardVelocity = (args["guard.velocity"] ?: args["projguard.velocity"] ?: "0,0").split(',')
                val pauses=CoreHitPauses.parse(args,this,errors,true) ?: return false
                val kills=CoreHitKills.parse(args,this,errors) ?: return false
                val hitFlags=CoreHitFlags.parse(args["hitflag"] ?: args["projhitflag"],errors) ?: return false
                val hitDamage=integer(damage.getOrNull(0))
                val powers=CoreHitPowers.parse(args,this,hitDamage,errors) ?: return false
                val fallVelocities=CoreFallVelocities.parse(args,this,errors) ?: return false
                val hit = HitDefinition(
                    attr = args["attr"] ?: args["projattr"] ?: "S, SP",
                    id = integer(args["id"]),
                    damage = hitDamage,
                    guardDamage = integer(damage.getOrNull(1)),
                    guardFlag = (args["guardflag"] ?: args["projguardflag"] ?: "HL").uppercase(),
                    hitFlag = hitFlags,
                    hitPause = pauses.hit.first,
                    defenderPause = pauses.hit.second,
                    guardPause = pauses.guard.first,
                    guardDefenderPause = pauses.guard.second,
                    kill = kills.hit,guardKill = kills.guard,
                    getPower = powers.get.first,guardGetPower = powers.get.second,
                    givePower = powers.give.first,guardGivePower = powers.give.second,
                    fallVelocityX = fallVelocities.x,fallVelocityY = fallVelocities.y,
                    velocityX = number(groundVelocity.getOrNull(0)),
                    velocityY = number(groundVelocity.getOrNull(1)),
                    airVelocityX = number(airVelocity.getOrNull(0)),
                    airVelocityY = number(airVelocity.getOrNull(1)),
                    hitTime = integer(args["ground.hittime"] ?: args["projground.hittime"],12).coerceIn(0,600),
                    airHitTime = integer(args["air.hittime"] ?: args["projair.hittime"],20).coerceIn(0,600),
                    guardHitTime = integer(args["guard.hittime"] ?: args["projguard.hittime"],
                        integer(args["ground.hittime"] ?: args["projground.hittime"],12)).coerceIn(0,600),
                    guardVelocityX = number(guardVelocity.getOrNull(0)),
                    guardVelocityY = number(guardVelocity.getOrNull(1)),
                    fall = integer(args["fall"]) != 0,
                    airFall = integer(args["air.fall"],integer(args["fall"])) != 0,
                    p1State = args["p1stateno"]?.let { integer(it,-1) }?.takeIf { it >= 0 },
                    p2State = args["p2stateno"]?.let { integer(it,-1) }?.takeIf { it >= 0 },
                    p2GetP1State = integer(args["p2getp1state"],1) != 0,
                    stateOwner = scriptOwner
                )
                entityRequests.add(EntityRequest.Projectile(
                    this,
                    integer(args["projid"]),
                    integer(args["projanim"], 0),
                    coordinates.toWorld(position.first),coordinates.toWorld(position.second),
                    coordinates.toWorld(velocity.first),coordinates.toWorld(velocity.second),
                    lifetime.toInt(),hit,
                    accelerationX=coordinates.toWorld(acceleration.first),
                    accelerationY=coordinates.toWorld(acceleration.second),
                    multiplierX=multiplier.first,multiplierY=multiplier.second,
                    stageBound=stageBound,heightTop=height.first,heightBottom=height.second,
                    removeOnHit=removeOnHit,hits=hits,missTime=missTime,priority=projectilePriority,
                    scaleX=scale.first,scaleY=scale.second
                ))
            }catch(e: IllegalArgumentException) {
                errors.add("Invalid Projectile: ${e.message}")
            }
            "hitdef" -> {
                val pauses=CoreHitPauses.parse(args,this,errors) ?: return false
                val kills=CoreHitKills.parse(args,this,errors) ?: return false
                val hitFlags=CoreHitFlags.parse(args["hitflag"],errors) ?: return false
                val hitDamage=integer(args["damage"]?.substringBefore(','))
                val powers=CoreHitPowers.parse(args,this,hitDamage,errors) ?: return false
                val fallVelocities=CoreFallVelocities.parse(args,this,errors) ?: return false
                val velocity = (args["ground.velocity"] ?: "0,0").split(',')
                val airVelocity = (args["air.velocity"] ?: "0,0").split(',')
                val guardVelocity = (args["guard.velocity"] ?: "0,0").split(',')
                val priority = (args["priority"] ?: "4,Hit").split(',')
                val next = HitDefinition(
                    attr = args["attr"] ?: "S, NA",
                    damage = hitDamage,
                    hitPause = pauses.hit.first,
                    velocityX = number(velocity.getOrNull(0)),
                    velocityY = number(velocity.getOrNull(1)),
                    guardDamage = integer(args["guard.damage"] ?: args["damage"]?.substringAfter(',',"0")),
                    guardFlag = (args["guardflag"] ?: "").uppercase().replace(" ", ""),
                    hitFlag = hitFlags,
                    priority = integer(priority.getOrNull(0), 4).coerceIn(1, 7),
                    priorityType = priority.getOrNull(1)?.trim() ?: "Hit",
                    defenderPause = pauses.hit.second,
                    guardPause = pauses.guard.first,
                    guardDefenderPause = pauses.guard.second,
                    kill = kills.hit,guardKill = kills.guard,
                    getPower = powers.get.first,guardGetPower = powers.get.second,
                    givePower = powers.give.first,guardGivePower = powers.give.second,
                    fallVelocityX = fallVelocities.x,fallVelocityY = fallVelocities.y,
                    guardVelocityX = number(guardVelocity.getOrNull(0)),
                    guardVelocityY = number(guardVelocity.getOrNull(1)),
                    hitTime = integer(args["ground.hittime"], 12).coerceIn(0,600),
                    id = integer(args["id"]),
                    p2State = args["p2stateno"]?.let { integer(it, -1) }?.takeIf { it >= 0 },
                    p2GetP1State = integer(args["p2getp1state"], 1) != 0,
                    stateOwner = scriptOwner,
                    p1State = args["p1stateno"]?.let { integer(it,-1) }?.takeIf { it >= 0 },
                    airVelocityX = number(airVelocity.getOrNull(0)),
                    airVelocityY = number(airVelocity.getOrNull(1)),
                    airHitTime = integer(args["air.hittime"],20).coerceIn(0,600),
                    guardHitTime = integer(args["guard.hittime"],integer(args["ground.hittime"],12)).coerceIn(0,600),
                    fall = integer(args["fall"]) != 0,
                    airFall = integer(args["air.fall"],integer(args["fall"])) != 0
                )
                // A valid definition may replace a carried attack once. Repeated
                // evaluation within a state must not reset its struck-target set.
                if (activeHitDef == null || carriedHitDef) {
                    if(carriedHitDef)struck.clear()
                    activeHitDef=next
                    carriedHitDef=false
                }
            }
            else -> errors.add("Unsupported controller: " + c.type)
        }
        return false
    }
    private fun executeState(n: Int, errors: MutableSet<String>, paused: Boolean,
                             owner: FightingCharacter = this): Boolean {
        val p = owner.definition.states[n] ?: return false
        scriptOwner = owner
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
        capturedTargets.keys.removeAll { it.destroyed || it.life <= 0 || it.moveType != "H" }
        asserted.clear()
        commandCache.clear()
        evaluationIssues = errors
        val paused = hitPauseLeft > 0
        hitPauseThisTick = paused
        hitFilters.beginTick()
        hitOverrides.beginTick()
        if (paused) hitPauseLeft--
        if (!paused && hitStunLeft > 0) hitStunLeft--
        if (!paused && getHitData.time >= 0)getHitData.time--
        // Global state controllers participate in the pause only when explicitly opted in.
        val changed = (stateOwner === this && executeState(-3, errors, paused)) ||
            executeState(-2, errors, paused) ||
            (stateOwner === this && executeState(-1, errors, paused)) ||
            executeState(stateNo, errors, paused, stateOwner)
        if (changed || paused) return
        posX += velX
        posY += velY
        timeInState++
        animation?.advance()
        if (hitStunLeft == 0 && (stateNo == 5000 || stateNo in 150..152) &&
            stateNo !in stateOwner.definition.states && life > 0)
            if(!fallbackHitReaction || world?.arena == null)changeState(0, this)
    }
    /** Called after motion by the configured arena. This deliberately bounded
     * missing-state policy is not a replacement for native common-state CNS. */
    internal fun advanceFallbackReaction(ground: Int): Boolean {
        if(!fallbackHitReaction)return false
        if(posY > ground)posY=ground
        if(posY < ground || velY < 0)stateType="A"
        moveType="H"
        if(stateType == "A")velY=(velY.toLong()+definition.coordinates.fixedToWorld(definition.airGravity))
            .coerceIn(Int.MIN_VALUE.toLong(),Int.MAX_VALUE.toLong()).toInt()
        if(posY >= ground && velY >= 0) {
            posY=ground;velY=0
            stateType=if(stateNo == 151)"C" else "S"
            if(life <= 0) { velX=0;control=false }
            else if(hitStunLeft == 0) {
                // Stop inherited knockback before entering idle; an authored
                // idle StateDef can still supply its own velocity/control.
                velX=0
                changeState(0,this,true)
            }
        }
        return true
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
        if (!hitFilters.allows(hit,world?.issues ?: evaluationIssues))return false
        try {
            if(hitOverrides.matching(hit) != null &&
                (hit.p1State != null || hit.p2State != null && hit.p2GetP1State))return false
        }catch(e: IllegalArgumentException) {
            (world?.issues ?: evaluationIssues).add("Invalid incoming hit attribute: ${e.message}")
            return false
        }
        return CoreHitFlags.allows(hit.hitFlag,this,world?.issues ?: evaluationIssues)
    }
    fun receiveHit(hit: HitDefinition, attackerFacingRight: Boolean, guarded: Boolean = false,
                   attacker: FightingCharacter? = null) {
        if(!canReceive(hit))return
        val initialType=stateType
        val override=if(guarded)null else hitOverrides.matching(hit)
        val airborne=!guarded && (stateType == "A" || override?.forceAir == true)
        val damage=CoreDamage.contact(hit,attacker,this,guarded)
        attacker?.addPower(if(guarded)hit.guardGetPower else hit.getPower)
        addPower(if(guarded)hit.guardGivePower else hit.givePower)
        fun facing(value: Int)=(value.toLong()*(if(attackerFacingRight)1 else -1))
            .coerceIn(Int.MIN_VALUE.toLong(),Int.MAX_VALUE.toLong()).toInt()
        val x=facing(if(guarded)hit.guardVelocityX else if(airborne)hit.airVelocityX else hit.velocityX)
        val y=if(guarded)hit.guardVelocityY else if(airborne)hit.airVelocityY else hit.velocityY
        val duration=if(guarded)hit.guardHitTime else if(airborne)hit.airHitTime else hit.hitTime
        getHitData=CoreGetHitData(damage,x,y,guarded,!guarded && (if(airborne)hit.airFall else hit.fall),duration,
            fallVelocityX=hit.fallVelocityX?.let(::facing),fallVelocityY=hit.fallVelocityY,received=true)
        world?.effects?.onHit(this)
        val minimumLife=if(if(guarded)hit.guardKill else hit.kill)0 else 1
        life = (life - damage).coerceAtLeast(minimumLife)
        val resultingState = if (life == 0) 5150 else if (guarded)
            when (stateType) { "A" -> 152; "C" -> 151; else -> 150 }
        else 5000
        if(override != null) {
            velX=x;velY=y
            if(override.forceAir)stateType="A"
            // An override uses the victim's own bank and honors StateDef velset.
            changeState(override.state,this,false)
        }else {
            // Normal hit/guard/KO restores the victim's own state bank.
            changeState(resultingState,this,false)
            velX=x;velY=y
        }
        hitPauseLeft = if (guarded) hit.guardDefenderPause else hit.defenderPause
        hitStunLeft = duration
        if (override == null && !guarded && life > 0 && hit.p2State != null) {
            val owner = if (hit.p2GetP1State) hit.stateOwner ?: attacker else this
            if (owner != null) enterAuthoredState(hit.p2State, owner,
                world?.issues ?: evaluationIssues)
        }
        fallbackHitReaction=override == null && stateOwner === this && stateProgram == null &&
            (stateNo == 5000 || stateNo in 150..152 || stateNo == 5150)
        val arena=world?.arena
        if(fallbackHitReaction && arena != null) {
            stateType=if(initialType == "A" || posY < arena.ground || velY < 0)"A"
                else if(stateNo == 151)"C" else "S"
            moveType="H"
        }
        if (!guarded) attacker?.captureTarget(this, hit.id)
        if(!guarded && attacker != null && hit.p1State != null) {
            val fight=world
            if(fight != null)fight.requestHitState(attacker,hit)
            else attacker.followSuccessfulHit(hit,world?.issues ?: evaluationIssues)
        }
    }
}

data class FightContact(val attacker: Int, val defender: Int, val guarded: Boolean, val damage: Int)
data class CorePresentationEvent(
    val type: String, val group: Int = -1, val number: Int = -1, val channel: Int = -1
)

/** Two-actor deterministic subset, not a full MUGEN contact phase. */
class DeterministicFight(val p1: FightingCharacter, val p2: FightingCharacter) {
    var hitPowerRules=HitPowerRules.DEFAULT
    val issues: MutableSet<String> = linkedSetOf()
    val contacts: MutableList<FightContact> = ArrayList()
    val presentation: MutableList<CorePresentationEvent> = ArrayList()
    val entities = CoreEntities(this)
    val effects = CoreExplods(this)
    private data class PendingHitState(val actor: FightingCharacter,val hit: HitDefinition,val revision: Long)
    private val hitStates=mutableListOf<PendingHitState>()
    private var resolvingContacts=false
    internal fun requestHitState(actor: FightingCharacter,hit: HitDefinition) {
        if(actor.world != null && actor.world !== this) {
            issues.add("HitDef attacker belongs to another fight")
            return
        }
        if(resolvingContacts)hitStates.add(PendingHitState(actor,hit,actor.contactStateRevision))
        else actor.followSuccessfulHit(hit,issues)
    }
    private fun finishContactPhase() {
        resolvingContacts=false
        // Preserve incoming reactions and deaths on trades. For multiple
        // successful shots, the first valid follow-up wins in contact order.
        for(request in hitStates)if(request.actor.stateRevision == request.revision)
            request.actor.followSuccessfulHit(request.hit,issues)
        hitStates.clear()
    }
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
        issues.addAll(p1.initializationIssues);issues.addAll(p2.initializationIssues)
        p1.opponent = p2
        p2.opponent = p1
        p1.world = this
        p2.world = this
    }
    fun step(a: InputFrame = InputFrame(), b: InputFrame = InputFrame()) {
        contacts.clear()
        entities.clashes.clear()
        presentation.clear()
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
        if (allowCombat) entities.advanceHelpers(issues)
        arena?.step(p1,p2,p1Frozen,p2Frozen)
        CoreBindings.resolve(p1,p2,if(allowCombat) entities.helpers else emptyList())
        camera?.update(p1,p2)
        p1.beginContactPhase();p2.beginContactPhase()
        for(helper in entities.helpers)helper.actor.beginContactPhase()
        hitStates.clear()
        resolvingContacts=true
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
            contacts.add(FightContact(p1.id, p2.id, guardB, CoreDamage.contact(ah,p1,p2,guardB)))
        }
        if (bh != null) {
            p2.markHit(p1.id)
            p2.moveContact = true
            p2.moveHit = !guardA
            p2.moveGuarded = guardA
            p2.hitPauseLeft = if (guardA) bh.guardPause else bh.hitPause
            contacts.add(FightContact(p2.id, p1.id, guardA, CoreDamage.contact(bh,p2,p1,guardA)))
        }
        if (ah != null) p2.receiveHit(ah, p1.facingRight, guardB, p1)
        if (bh != null) p1.receiveHit(bh, p2.facingRight, guardA, p2)
        if (allowCombat) entities.resolveContacts(issues)
        finishContactPhase()
        val spawned = p1.flushEntityRequests() + p2.flushEntityRequests()
        entities.add(spawned, issues)
        effects.advance()
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
