package moe.celery.kenjatime

import kotlin.js.JsExport

/** Thin primitive-only Wasm boundary. Asset import/render/audio remain browser adapters. */
private object Fights {
    var next = 1
    val active = mutableMapOf<Int, DeterministicFight>()
    val assets = SharedAssetRegistry<SharedCharacterAsset>(32)
    val leased = mutableMapOf<Int, Pair<String, String>>()
    fun get(handle: Int): DeterministicFight = active[handle] ?: error("Unknown fight handle")
    fun assetKey(name: String, air: String, cns: String, cmd: String): String =
        name + "\u0000" + air + "\u0000" + cns + "\u0000" + cmd
}
@JsExport fun ktCoreVersion(): String = "0.2.0-wasm-combat-preview"
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
    val key1 = Fights.assetKey(name1, air1, cns1, cmd1)
    val key2 = Fights.assetKey(name2, air2, cns2, cmd2)
    val leftAsset = Fights.assets.acquire(key1) {
        SharedCharacterAsset(FighterDefinition.fromScript(name1, air1, cns1, cmd1),
            MugenCommandParser.parseFile(cmd1))
    }
    try {
        val rightAsset = Fights.assets.acquire(key2) {
            SharedCharacterAsset(FighterDefinition.fromScript(name2, air2, cns2, cmd2),
                MugenCommandParser.parseFile(cmd2))
        }
        try {
            val id = Fights.next++
            val left = FightingCharacter(leftAsset.definition, 1, leftAsset.commands)
            val right = FightingCharacter(rightAsset.definition, 2, rightAsset.commands)
            left.facingRight = true
            right.facingRight = false
            Fights.active[id] = DeterministicFight(left, right)
            Fights.leased[id] = key1 to key2
            return id
        } catch (e: Throwable) {
            Fights.assets.release(key2)
            throw e
        }
    } catch (e: Throwable) {
        Fights.assets.release(key1)
        throw e
    }
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
@JsExport fun ktCoreRelease(handle: Int): Unit {
    Fights.active.remove(handle)
    val lease = Fights.leased.remove(handle) ?: return
    Fights.assets.release(lease.first)
    Fights.assets.release(lease.second)
}
@JsExport fun ktCoreAssetRegistrySize(): Int = Fights.assets.size
@JsExport fun ktCoreReadDef(source: String, section: String, key: String): String? =
    MugenDefParser.parse(source).section(section)?.get(key)

fun main() = Unit
