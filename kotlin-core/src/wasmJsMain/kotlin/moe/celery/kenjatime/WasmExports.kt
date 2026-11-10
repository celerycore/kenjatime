package moe.celery.kenjatime

import kotlin.js.JsExport

/** Thin primitive-only Wasm boundary. Asset import/render/audio remain browser adapters. */
private object Fights {
    var next = 1
    val active = mutableMapOf<Int, DeterministicFight>()
    fun get(handle: Int): DeterministicFight = active[handle] ?: error("Unknown fight handle")
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
    val a = FighterDefinition.fromScript(name1, air1, cns1)
    val b = FighterDefinition.fromScript(name2, air2, cns2)
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
@JsExport fun ktCoreCamera(handle: Int): String {
    val camera = Fights.get(handle).camera
    return if (camera == null) "{\"enabled\":false}" else
        "{\"enabled\":true,\"x\":" + camera.x + ",\"y\":" + camera.y +
        ",\"zoom\":" + camera.zoom + "}"
}
@JsExport fun ktCoreStep(
    handle: Int, p1Direction: Int, p1Buttons: String,
    p2Direction: Int, p2Buttons: String
): String {
    val fight = Fights.get(handle)
    fight.step(InputFrame(p1Direction, p1Buttons.lowercase().toSet()),
        InputFrame(p2Direction, p2Buttons.lowercase().toSet()))
    return fight.checksum()
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
@JsExport fun ktCoreIssues(handle: Int): String = Fights.get(handle).issues.joinToString("\n")
@JsExport fun ktCoreRelease(handle: Int): Unit { Fights.active.remove(handle) }
@JsExport fun ktCoreReadDef(source: String, section: String, key: String): String? =
    MugenDefParser.parse(source).section(section)?.get(key)

fun main() = Unit
