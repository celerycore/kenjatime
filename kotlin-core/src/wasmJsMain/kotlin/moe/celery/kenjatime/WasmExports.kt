package moe.celery.kenjatime

import kotlin.js.JsExport

/** Thin primitive-only Wasm boundary. Asset import/render/audio remain browser adapters. */
private object Fights {
    var next = 1
    val active = mutableMapOf<Int, DeterministicFight>()
    fun get(handle: Int): DeterministicFight = active[handle] ?: error("Unknown fight handle")
}
@JsExport fun ktCoreVersion(): String = "0.1.0-wasm-foundation"
@JsExport fun ktCoreCreate(
    name1: String, name2: String, air1: String, air2: String, cns1: String, cns2: String
): Int {
    require(Fights.active.size < 8) { "Too many active fights" }
    val a = FighterDefinition(name1, MugenAirParser.parse(air1), MugenCnsParser.parse(cns1))
    val b = FighterDefinition(name2, MugenAirParser.parse(air2), MugenCnsParser.parse(cns2))
    val id = Fights.next++
    Fights.active[id] = DeterministicFight(FightingCharacter(a, 1), FightingCharacter(b, 2))
    return id
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
        ",\"hitPause\":" + p.hitPauseLeft + "}"
}
@JsExport fun ktCoreIssues(handle: Int): String = Fights.get(handle).issues.joinToString("\n")
@JsExport fun ktCoreRelease(handle: Int): Unit { Fights.active.remove(handle) }
@JsExport fun ktCoreReadDef(source: String, section: String, key: String): String? =
    MugenDefParser.parse(source).section(section)?.get(key)

fun main() = Unit
