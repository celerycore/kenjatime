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
@JsExport fun ktCoreConfigureHitPower(handle: Int, attackLifeToPower: Double, getHitLifeToPower: Double) {
    Fights.get(handle).hitPowerRules=HitPowerRules(attackLifeToPower,getHitLifeToPower)
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
    actor.power = power
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
        ",\"positionFrozen\":" + p.positionFrozen +
        ",\"namedMapCount\":" + p.namedMaps.size +
        ",\"guardDistance256\":" + p.guardDistance +
        ",\"inGuardDist\":" + p.inGuardDistance +
        ",\"playerPush\":" + p.playerPushEnabled +
        ",\"screenBound\":" + p.screenBoundEnabled +
        ",\"moveCameraX\":" + p.moveCameraX +
        ",\"moveCameraY\":" + p.moveCameraY +
        ",\"widthPlayerFront256\":" + p.widthOffsets.playerFront +
        ",\"widthPlayerBack256\":" + p.widthOffsets.playerBack +
        ",\"widthEdgeFront256\":" + p.widthOffsets.edgeFront +
        ",\"widthEdgeBack256\":" + p.widthOffsets.edgeBack +
        ",\"spritePriority\":" + p.spritePriority +
        ",\"drawAngleDegrees\":" + p.drawAngleDegrees +
        ",\"angleDraw\":" + p.angleDrawEnabled +
        ",\"blendOverride\":" + (p.drawBlend?.json() ?: "null") +
        ",\"drawScaleX\":" + p.drawScaleX +
        ",\"drawScaleY\":" + p.drawScaleY +
        ",\"drawOffsetX256\":" + p.drawOffsetX +
        ",\"drawOffsetY256\":" + p.drawOffsetY +
        ",\"displayOffsetX256\":" + p.displayOffsetX +
        ",\"displayOffsetY256\":" + p.displayOffsetY +
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
        ",\"getHitAnimType\":" + p.getHitData.animationType.code +
        ",\"getHitX256\":" + p.getHitData.velocityX +
        ",\"getHitY256\":" + p.getHitData.velocityY +
        ",\"getHitAccelerationY256\":" + p.getHitData.accelerationY +
        ",\"hitOver\":" + p.hitOver +
        ",\"hitShakeOver\":" + p.hitShakeOver +
        ",\"getHitTime\":" + p.getHitData.time +
        ",\"getHitSlideTime\":" + p.getHitData.slideTime +
        ",\"getHitControlTime\":" + p.getHitData.controlTime +
        ",\"getHitGuarded\":" + p.getHitData.guarded +
        ",\"getHitFall\":" + p.getHitData.fall +
        ",\"getHitReceived\":" + p.getHitData.received +
        ",\"getHitFallX256\":" + p.getHitData.fallVelocityX +
        ",\"getHitFallY256\":" + p.getHitData.fallVelocityY +
        ",\"getHitFallDamage\":" + p.getHitData.fallDamage +
        ",\"getHitFallKill\":" + p.getHitData.fallKill +
        ",\"getHitFallRecover\":" + p.getHitData.fallRecover +
        ",\"getHitFallRecoverTime\":" + p.getHitData.fallRecoverTime +
        ",\"getHitFallTime\":" + p.getHitData.fallTime +
        ",\"getHitFallShakeTime\":" + p.getHitData.fallShake.time +
        ",\"getHitFallShakeFrequency\":" + p.getHitData.fallShake.frequency +
        ",\"getHitFallShakeAmplitude256\":" + p.getHitData.fallShake.amplitude256 +
        ",\"getHitFallShakePhase\":" + p.getHitData.fallShake.phase +
        ",\"canRecover\":" + p.canRecover +
        ",\"fallbackHitReaction\":" + p.fallbackHitReaction +
        ",\"power\":" + p.power +
        ",\"powerMax\":" + p.maxPower +
        ",\"attackMultiplier\":" + p.attackMultiplier +
        ",\"defenceMultiplier\":" + p.defenceMultiplier +
        ",\"moveContact\":" + p.moveContact +
        ",\"moveHit\":" + p.moveHit +
        ",\"moveGuarded\":" + p.moveGuarded +
        ",\"moveReversed\":" + p.moveReversed +
        ",\"moveContactTime\":" + p.moveContactTime +
        ",\"moveHitTime\":" + p.moveHitTime +
        ",\"moveGuardedTime\":" + p.moveGuardedTime +
        ",\"moveReversedTime\":" + p.moveReversedTime +
        ",\"hitCount\":" + p.hitCount +
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
@JsExport fun ktCoreProjectiles(handle: Int): String = Fights.get(handle).entities.projectiles.joinToString(
    prefix="[",postfix="]",separator=","
) { p ->
    "{\"owner\":"+p.owner.id+",\"id\":"+p.projectileId+",\"entityId\":"+p.entityId+
    ",\"x256\":"+p.x+",\"y256\":"+p.y+",\"vx256\":"+p.vx+",\"vy256\":"+p.vy+
    ",\"ax256\":"+p.accelerationX+",\"ay256\":"+p.accelerationY+
    ",\"mulX\":"+p.multiplierX+",\"mulY\":"+p.multiplierY+
    ",\"ticksLeft\":"+p.ticksLeft+",\"hitsLeft\":"+p.hitsLeft+
    ",\"missTimeLeft\":"+p.missTimeLeft+",\"hitPause\":"+p.hitPauseLeft+
    ",\"removeOnHit\":"+p.removeOnHit+",\"priority\":"+p.priority+
    ",\"scaleX\":"+p.scaleX+",\"scaleY\":"+p.scaleY+",\"facing\":"+(if(p.facingRight)1 else -1)+
    ",\"guardDistance256\":"+p.hit.guardDistance+
    ",\"attackMultiplier\":"+p.hit.capturedAttackMultiplier+
    ",\"anim\":"+p.action.action.number+",\"elem\":"+(p.action.index+1)+"}"
}
@JsExport fun ktCoreProjectileClashes(handle: Int): String = Fights.get(handle).entities.clashes.joinToString(
    prefix="[",postfix="]",separator=","
) { c ->
    "{\"first\":"+c.first+",\"second\":"+c.second+
    ",\"firstCancelled\":"+c.firstCancelled+",\"secondCancelled\":"+c.secondCancelled+"}"
}
@JsExport fun ktCoreProjectileHistory(handle: Int,side: Int): String {
    val fight=Fights.get(handle)
    val actor=if(side == 0)fight.p1 else fight.p2
    return actor.projectileHistory.snapshot().joinToString(prefix="[",postfix="]",separator=",") { r ->
        "{\"id\":"+r.id+",\"kind\":\""+r.kind.label+"\",\"tick\":"+r.tick+
        ",\"age\":"+(fight.frame-r.tick)+"}"
    }
}
@JsExport fun ktCoreEvents(handle: Int): String = Fights.get(handle).presentation.joinToString(
    prefix = "[", postfix = "]", separator = ","
) { e ->
    "{\"type\":\"" + e.type + "\",\"group\":" + e.group +
    ",\"number\":" + e.number + ",\"channel\":" + e.channel + (if (e.common) ",\"common\":true" else "") + "}"
}
@JsExport fun ktCoreHelperDiagnostics(handle: Int): String = Fights.get(handle).entities.helperDiagnosticsJson()
@JsExport fun ktCoreIssues(handle: Int): String = Fights.get(handle).issues.joinToString("\n")
@JsExport fun ktCoreCommonAnimations(handle: Int, air: String, scale: Double) {
    val fight = Fights.get(handle)
    try {
        fight.commonAnimations.catalog(air, scale)
    } catch (e: IllegalArgumentException) {
        fight.issues.add("Invalid fightfx catalog: ${e.message}")
    }
}
@JsExport fun ktCoreForceFeedback(handle: Int): String = Fights.get(handle).forceFeedback.json()
@JsExport fun ktCoreSoundCatalog(handle: Int,side: Int,catalog: String): Unit = Fights.get(handle).sounds.catalog(side,catalog)
@JsExport fun ktCoreCommonSoundCatalog(handle: Int, catalog: String): Unit =
    Fights.get(handle).sounds.catalog(COMMON_SOUND_BANK, catalog)
@JsExport fun ktCorePaletteCatalog(handle: Int, side: Int, palettes: String, sprites: String): Unit =
    Fights.get(handle).paletteBanks.catalog(side, palettes, sprites)
@JsExport fun ktCoreSounds(handle: Int): String = Fights.get(handle).sounds.json()
@JsExport fun ktCoreSoundEvents(handle: Int): String = Fights.get(handle).sounds.eventJson()
@JsExport fun ktCoreReversals(handle: Int): String = Fights.get(handle).reversals.json()
@JsExport fun ktCoreRelease(handle: Int): Unit { Fights.active.remove(handle) }
@JsExport fun ktCoreEnvironment(handle: Int): String = Fights.get(handle).environment.json()
@JsExport fun ktCoreAfterImages(handle: Int): String {
    val fight=Fights.get(handle)
    return (listOf(fight.p1,fight.p2)+fight.entities.helpers.map {it.actor}).joinToString(prefix="[",postfix="]",separator=",") {
        "{\"id\":${it.id},\"trail\":${it.afterImages?.json() ?: "null"}}"
    }
}
@JsExport fun ktCorePalettes(handle: Int): String {
    val fight=Fights.get(handle);val groups=mutableListOf<CorePaletteEffects>()
    fun group(value: CorePaletteEffects): Int {
        val index=groups.indexOf(value);if(index>=0)return index
        groups.add(value);return groups.lastIndex
    }
    val actors=(listOf(fight.p1,fight.p2)+fight.entities.helpers.map {it.actor}).joinToString(
        prefix="[",postfix="]",separator=",") {"{\"id\":${it.id},\"ownPalette\":${it.ownPalette},\"group\":${group(it.paletteEffects)}}"}
    val projectiles=fight.entities.projectiles.joinToString(prefix="[",postfix="]",separator=",") {
        "{\"id\":${it.entityId},\"ownPalette\":${it.ownPalette},\"group\":${group(it.paletteEffects)}}"}
    val explods=fight.effects.all.joinToString(prefix="[",postfix="]",separator=",") {
        "{\"sequence\":${it.sequence},\"ownPalette\":${it.config.ownPalette},\"group\":${group(it.paletteEffects)}}"}
    return "{\"all\":${fight.palettes.all.json()},\"background\":${fight.palettes.background.json()},\"actors\":$actors,"+
        "\"projectiles\":$projectiles,\"explods\":$explods,\"groups\":${groups.joinToString(prefix="[",postfix="]",separator=",") {it.json()}}}"
}
/** Debug text is queried separately; regular render snapshots never carry it. */
@JsExport fun ktCoreClipboards(handle: Int): String {
    val fight=Fights.get(handle)
    return (listOf(fight.p1,fight.p2)+fight.entities.helpers.map {it.actor}).joinToString(prefix="[",postfix="]",separator=",") {
        "{\"id\":${it.id},\"rootId\":${it.rootActor().id},\"text\":${MugenQuotedText.quote(it.clipboardText)}}"
    }
}
/** On-demand actor-local sampled and queued input bitmasks; buttons are abcxyzs bits 0..6. */
@JsExport fun ktCoreInputs(handle: Int): String {
    val fight=Fights.get(handle)
    return (listOf(fight.p1,fight.p2)+fight.entities.helpers.map { it.actor }).joinToString(
        prefix="[",postfix="]",separator=",") {
        val input=it.input.latest() ?: InputFrame();val pending=it.pendingAssertedInput
        "{\"id\":${it.id},\"rootId\":${it.rootActor().id},\"directions\":${input.directions},"+
            "\"buttons\":${CoreAssertedInputs.buttonsMask(input)},\"pendingDirections\":${pending.directions},"+
            "\"pendingButtons\":${CoreAssertedInputs.buttonsMask(pending)}}"
    }
}
/** On-demand inspection keeps potentially large maps out of per-frame snapshots. */
@JsExport fun ktCoreNamedMaps(handle: Int): String {
    val fight=Fights.get(handle)
    return (listOf(fight.p1,fight.p2)+fight.entities.helpers.map { it.actor }).joinToString(
        prefix="[",postfix="]",separator=",") { "{\"id\":"+it.id+",\"values\":"+it.namedMaps.json()+"}" }
}
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
