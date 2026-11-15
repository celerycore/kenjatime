package moe.celery.kenjatime

import kotlin.js.JsExport

/** Thin primitive-only Wasm boundary. Asset import/render/audio remain browser adapters. */
private object Fights {
    var next = 1
    val active = mutableMapOf<Int, DeterministicFight>()
    fun get(handle: Int): DeterministicFight = active[handle] ?: error("Unknown fight handle")
}
/** Kotlin/Wasm is the authoritative engine of the 0.6 web + Android channel. */
@JsExport fun ktCoreVersion(): String = "0.7.0-kotlin-wasm-standard"
@JsExport fun ktCoreCreate(
    name1: String, name2: String, air1: String, air2: String, cns1: String, cns2: String
): Int {
    require(Fights.active.size < 8) { "Too many active fights" }
    return ktCoreCreateWithCommands(name1, name2, air1, air2, cns1, cns2, "", "")

}
@JsExport fun ktCoreCreateWithCommands(
    name1: String, name2: String, air1: String, air2: String,
    cns1: String, cns2: String, cmd1: String, cmd2: String
): Int = ktCoreCreateWithDefinitions(name1,name2,air1,air2,cns1,cns2,cmd1,cmd2,"","")

/** Parse actual MUGEN DEF [Info] inside Kotlin, so different character
 * localcoord (e.g. Nu-13's 1008x756) is not guessed by a JS renderer. */
@JsExport fun ktCoreCreateWithDefinitions(
    name1: String, name2: String, air1: String, air2: String,
    cns1: String, cns2: String, cmd1: String, cmd2: String,
    def1: String, def2: String
): Int {
    require(Fights.active.size < 8) { "Too many active fights" }
    val a = FighterDefinition.fromScript(name1, air1, cns1, cmd1,def1)
    val b = FighterDefinition.fromScript(name2, air2, cns2, cmd2,def2)
    val id = Fights.next++
    val left = FightingCharacter(a, 1, MugenCommandParser.parseFile(cmd1))
    val right = FightingCharacter(b, 2, MugenCommandParser.parseFile(cmd2))
    left.facingRight = true
    right.facingRight = false
    Fights.active[id] = DeterministicFight(left, right)
    return id
}
@JsExport fun ktCoreSetup(handle: Int, p1x256: Int, p1y256: Int, p2x256: Int, p2y256: Int) {
    val fight = Fights.get(handle)
    fight.p1.posX = p1x256; fight.p1.posY = p1y256
    fight.p2.posX = p2x256; fight.p2.posY = p2y256
}
@JsExport fun ktCoreConfigureArena(
    handle: Int, leftPixels: Int, rightPixels: Int, groundPixels: Int,
    pushPlayers: Boolean, autoFaceIdle: Boolean
) {
    Fights.get(handle).configureArena(leftPixels,rightPixels,groundPixels,pushPlayers,autoFaceIdle)
}
@JsExport fun ktCoreDebugForceState(handle: Int, side: Int, newState: Int) {
    val fight = Fights.get(handle)
    val actor = if (side == 0) fight.p1 else fight.p2
    require(newState in actor.definition.states) { "Unknown authored StateDef" }
    actor.changeState(newState, actor)
}
@JsExport fun ktCoreDebugSetFacing(handle: Int, side: Int, facingRight: Boolean) {
    val fight = Fights.get(handle)
    val actor = if (side == 0) fight.p1 else fight.p2
    actor.facingRight = facingRight
}
@JsExport fun ktCoreDebugSetStats(handle: Int, side: Int, life: Int, power: Int) {
    val fight = Fights.get(handle)
    val actor = if (side == 0) fight.p1 else fight.p2
    actor.life = life.coerceIn(0, actor.definition.maxLife)
    actor.power = power.coerceIn(0, 3000)
}
@JsExport fun ktCoreEnableRoundFlow(
    handle: Int, introFrames: Int, roundFrames: Int, fightFrames: Int,
    koFrames: Int, outroFrames: Int, timerSeconds: Int
) {
    Fights.get(handle).enableRoundFlow(
        CoreRoundRules(introFrames,roundFrames,fightFrames,koFrames,outroFrames,timerSeconds)
    )
}
@JsExport fun ktCoreRoundState(handle: Int): String =
    Fights.get(handle).roundFlow?.statusJson() ?: "{\"enabled\":false}"
@JsExport fun ktCoreCamera(handle: Int): String {
    val camera = Fights.get(handle).camera
    return if (camera == null) "{\"enabled\":false}" else
        "{\"enabled\":true,\"x\":" + camera.x + ",\"y\":" + camera.y +
        ",\"zoom\":" + camera.zoom + "}"
}
@JsExport fun ktCoreAdvance(
    handle: Int, p1Direction: Int, p1Buttons: String,
    p2Direction: Int, p2Buttons: String
) {
    val fight = Fights.get(handle)
    fight.step(InputFrame(p1Direction, p1Buttons.lowercase().toSet()),
        InputFrame(p2Direction, p2Buttons.lowercase().toSet()))
}
/** Benchmark AI runs in Kotlin, not in the JavaScript UI or renderer. */
@JsExport fun ktCoreAdvanceCpu(handle: Int, level: Int) {
    val fight=Fights.get(handle)
    val sample=CoreCpu.input(fight.p1, fight.p2, fight.frame, level)
    val rival=CoreCpu.input(fight.p2, fight.p1, fight.frame, level)
    fight.step(sample,rival)
}

@JsExport fun ktCoreChecksum(handle: Int): String = Fights.get(handle).checksum()
@JsExport fun ktCoreStep(
    handle: Int, p1Direction: Int, p1Buttons: String,
    p2Direction: Int, p2Buttons: String
): String {
    ktCoreAdvance(handle,p1Direction,p1Buttons,p2Direction,p2Buttons)
    return ktCoreChecksum(handle)
}
@JsExport fun ktCoreSnapshot(handle: Int, side: Int): String {
    val fight = Fights.get(handle)
    val p = if (side == 0) fight.p1 else fight.p2
    return "{\"frame\":" + fight.frame + ",\"life\":" + p.life +
        ",\"x256\":" + p.posX + ",\"y256\":" + p.posY +
        ",\"vx256\":" + p.velX + ",\"vy256\":" + p.velY +
        ",\"state\":" + p.stateNo + ",\"stateTime\":" + p.timeInState +
        ",\"stateOwner\":" + p.stateOwner.id +
        ",\"localCoordWidth\":" + p.coordinates.width +
        ",\"ownLocalCoordWidth\":" + p.definition.localCoordWidth +
        ",\"animationOwner\":" + p.animationOwner.id +
        ",\"anim\":" + (p.animation?.action?.number ?: -1) +
        ",\"animElem\":" + (p.animation?.index?.plus(1) ?: 0) +
        ",\"animElemTime\":" + (p.animation?.tick ?: 0) +
        ",\"animationTime\":" + (p.animation?.elapsed ?: 0L) +
        ",\"animTime\":" + (p.animation?.remaining ?: 0L) +
        ",\"numTargets\":" + p.targets().size +
        ",\"numExplods\":" + fight.effects.count(p) +
        ",\"boundTo\":" + (p.binding?.anchor?.id ?: 0) +
        ",\"bindTime\":" + (p.binding?.ticksLeft ?: 0) +
        ",\"hitPause\":" + p.hitPauseLeft +
        ",\"hitPauseThisTick\":" + p.hitPauseThisTick +
        ",\"hitFilter1Time\":" + p.hitFilters.remaining(0) +
        ",\"hitFilter2Time\":" + p.hitFilters.remaining(1) +
        ",\"hitOverrideTimes\":[" + (0..7).joinToString(",") { p.hitOverrides.remaining(it).toString() } + "]" +
        ",\"getHitDamage\":" + p.getHitData.damage +
        ",\"getHitX256\":" + p.getHitData.velocityX +
        ",\"getHitY256\":" + p.getHitData.velocityY +
        ",\"getHitTime\":" + p.getHitData.time +
        ",\"getHitGuarded\":" + p.getHitData.guarded +
        ",\"getHitFall\":" + p.getHitData.fall +
        ",\"power\":" + p.power +
        ",\"ctrl\":" + (if (p.control) 1 else 0) +
        ",\"facing\":" + (if (p.facingRight) 1 else -1) +
        ",\"stateType\":\"" + p.stateType +
        "\",\"moveType\":\"" + p.moveType + "\"}"
}
@JsExport fun ktCoreContacts(handle: Int): String = Fights.get(handle).contacts.joinToString(
    prefix = "[", postfix = "]", separator = ","
) { c ->
    "{\"attacker\":" + c.attacker + ",\"defender\":" + c.defender +
        ",\"guarded\":" + c.guarded + ",\"damage\":" + c.damage + "}"
}
@JsExport fun ktCoreEntities(handle: Int): String {
    val e = Fights.get(handle).entities
    return "{\"helpers\":" + e.helpers.size + ",\"projectiles\":" + e.projectiles.size + "}"
}
@JsExport fun ktCoreExplods(handle: Int): String = Fights.get(handle).effects.all.joinToString(
    prefix="[",postfix="]",separator=","
) { e ->
    "{\"owner\":"+e.owner.id+",\"id\":"+e.id+",\"sequence\":"+e.sequence+
    ",\"x256\":"+e.x+",\"y256\":"+e.y+",\"vx256\":"+e.velocityX+
    ",\"vy256\":"+e.velocityY+",\"age\":"+e.age+",\"bindTime\":"+e.bindLeft+
    ",\"anim\":"+e.animation.action.number+",\"elem\":"+(e.animation.index+1)+"}"
}
@JsExport fun ktCoreEvents(handle: Int): String = Fights.get(handle).presentation.joinToString(
    prefix = "[", postfix = "]", separator = ","
) { e ->
    "{\"type\":\"" + e.type + "\",\"group\":" + e.group +
    ",\"number\":" + e.number + ",\"channel\":" + e.channel + "}"
}
@JsExport fun ktCoreIssues(handle: Int): String = Fights.get(handle).issues.joinToString("\n")
@JsExport fun ktCoreRelease(handle: Int): Unit { Fights.active.remove(handle) }
@JsExport fun ktCoreReadDef(source: String, section: String, key: String): String? =
    MugenDefParser.parse(source).section(section)?.get(key)


/** All time debt and 60Hz scheduling accounting is owned by Kotlin/Wasm.
 * The browser and Android WebView only provide monotonic performance.now().
 */
private object ClockHandles {
    var next=1
    val active=mutableMapOf<Int,CoreTickBudget>()
    fun get(handle:Int)=active[handle] ?: error("Unknown Kotlin clock handle")
}
@JsExport fun ktCoreClockCreate(maxBatch:Int=6):Int {
    require(ClockHandles.active.size<8)
    val id=ClockHandles.next++
    ClockHandles.active[id]=CoreTickBudget(maxBatch)
    return id
}
@JsExport fun ktCoreClockClaim(handle:Int,nowMilliseconds:Double):Int =
    ClockHandles.get(handle).claim(nowMilliseconds)
@JsExport fun ktCoreClockCompletedOne(handle:Int) {
    ClockHandles.get(handle).completedOne()
}
@JsExport fun ktCoreClockDebt(handle:Int):Double =
    ClockHandles.get(handle).overdue.toDouble()
@JsExport fun ktCoreClockTicks(handle:Int):Double =
    ClockHandles.get(handle).completed.toDouble()
@JsExport fun ktCoreClockReset(handle:Int,nowMilliseconds:Double) {
    ClockHandles.get(handle).reset(nowMilliseconds)
}
@JsExport fun ktCoreClockResume(handle:Int,nowMilliseconds:Double) {
    ClockHandles.get(handle).resume(nowMilliseconds)
}
@JsExport fun ktCoreClockRelease(handle:Int) {
    ClockHandles.active.remove(handle)
}

/** Kotlin is the sole owner of camera projection, visual entities and
 * frame-skip policy. JavaScript only paints the immutable plan.
 */
@JsExport fun ktCorePresentationFps(debtTicks: Double): Int =
    CorePresentationPlanner.targetFps(
        if(debtTicks.isFinite()) debtTicks.toLong().coerceAtLeast(0) else 0L
    )
@JsExport fun ktCoreRenderPlan(handle: Int, debtTicks: Double): String =
    CorePresentationPlanner.snapshot(
        Fights.get(handle),
        if(debtTicks.isFinite()) debtTicks.toLong().coerceAtLeast(0) else 0L
    )
/** Legacy Kotlin snapshot API retained for older Kotlin-only tests. */
@JsExport fun ktCoreVisuals(handle: Int): String =
    CorePresentationPlanner.snapshot(Fights.get(handle), 0L)

fun main() = Unit
