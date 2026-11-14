package moe.celery.kenjatime

import kotlin.js.JsExport

/** Thin primitive-only Wasm boundary. Asset import/render/audio remain browser adapters. */
private object Fights {
    var next = 1
    val active = mutableMapOf<Int, DeterministicFight>()
    fun get(handle: Int): DeterministicFight = active[handle] ?: error("Unknown fight handle")
}
/** Kotlin/Wasm is the authoritative engine of the 0.6 web + Android channel. */
@JsExport fun ktCoreVersion(): String = "0.6.0-kotlin-wasm-standard"
@JsExport fun ktCoreCreate(
    name1: String, name2: String, air1: String, air2: String, cns1: String, cns2: String
): Int {
    require(Fights.active.size < 8) { "Too many active fights" }
    return ktCoreCreateWithCommands(name1, name2, air1, air2, cns1, cns2, "", "")

}
@JsExport fun ktCoreCreateWithCommands(
    name1: String, name2: String, air1: String, air2: String,
    cns1: String, cns2: String, cmd1: String, cmd2: String
): Int {
    require(Fights.active.size < 8) { "Too many active fights" }
    val a = FighterDefinition.fromScript(name1, air1, cns1, cmd1)
    val b = FighterDefinition.fromScript(name2, air2, cns2, cmd2)
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
    actor.changeState(newState)
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
        ",\"hitPause\":" + p.hitPauseLeft +
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
@JsExport fun ktCoreClockRelease(handle:Int) {
    ClockHandles.active.remove(handle)
}

/** Render snapshots are read-only: sprite decode, GPU submission and frame
 * dropping do not modify the authored 60Hz fight. Projectiles/helpers use the
 * same AIR definition as their owner. Every entity remains simulated, even
 * if an overloaded mobile renderer cannot display all of them.
 */
@JsExport fun ktCoreVisuals(handle:Int):String {
    val fight=Fights.get(handle)
    val result=StringBuilder(1024)
    result.append("{\"frame\":").append(fight.frame)
        .append(",\"helpers\":").append(fight.entities.helpers.size)
        .append(",\"projectiles\":").append(fight.entities.projectiles.size)
        .append(",\"draws\":[")
    fun actor(p:FightingCharacter,side:Int,kind:String) {
        val air=p.animation
        val sprite=air?.frame
        result.append("{\"side\":").append(side)
            .append(",\"kind\":\"").append(kind).append("\"")
            .append(",\"x\":").append(Fixed.pixels(p.posX))
            .append(",\"y\":").append(Fixed.pixels(p.posY))
            .append(",\"facing\":").append(if(p.facingRight)1 else -1)
            .append(",\"action\":").append(air?.action?.number ?: -1)
            .append(",\"elem\":").append((air?.index ?: 0)+1)
            .append(",\"group\":").append(sprite?.group ?: -1)
            .append(",\"number\":").append(sprite?.sprite ?: -1)
            .append(",\"life\":").append(p.life)
            .append("},")
    }
    actor(fight.p1,0,"fighter")
    actor(fight.p2,1,"fighter")
    for(helper in fight.entities.helpers.take(56)) {
        actor(helper.actor, if(helper.owner===fight.p1)0 else 1, "helper")
    }
    for(projectile in fight.entities.projectiles.take(256)) {
        val sprite=projectile.action.frame
        result.append("{\"side\":").append(if(projectile.owner===fight.p1)0 else 1)
            .append(",\"kind\":\"projectile\"")
            .append(",\"x\":").append(Fixed.pixels(projectile.x))
            .append(",\"y\":").append(Fixed.pixels(projectile.y))
            .append(",\"facing\":").append(if(projectile.owner.facingRight)1 else -1)
            .append(",\"action\":").append(projectile.action.action.number)
            .append(",\"elem\":").append(projectile.action.index+1)
            .append(",\"group\":").append(sprite?.group ?: -1)
            .append(",\"number\":").append(sprite?.sprite ?: -1)
            .append(",\"life\":0},")
    }
    if(result.last() == ',')result.setLength(result.length-1)
    return result.append("]}").toString()
}

fun main() = Unit
