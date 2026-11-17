package moe.celery.kenjatime

import kotlin.math.abs

/**
 * Opt-in deterministic ground/edge/push policy. It is disabled for headless
 * legacy baseline replay until stage parameters have been explicitly supplied.
 */
data class ArenaRules(
    val left: Int,
    val right: Int,
    val ground: Int = 0,
    val gravity: Int = Fixed.of(0.7),
    val playerHalfWidth: Int = 15 * Fixed.ONE,
    val pushPlayers: Boolean = true,
    val autoFaceIdle: Boolean = false
) {
    init {
        require(left < right && right.toLong()-left.toLong() >= 20L*Fixed.ONE)
        require(gravity in 0..(4*Fixed.ONE))
        require(playerHalfWidth in 0..(100*Fixed.ONE))
    }
    fun step(p1: FightingCharacter,p2: FightingCharacter,frozen1:Boolean,frozen2:Boolean,
             helpers: List<HelperEntity> = emptyList()) {
        if(!frozen1) individual(p1)
        if(!frozen2) individual(p2)
        for(helper in helpers) {
            val p=helper.actor
            if(!p.destroyed && !p.hitPauseThisTick && p.binding == null && p.screenBoundEnabled)clampHorizontal(p)
        }
        if(pushPlayers) {
            val pushers=(listOf(p1,p2)+helpers.map { it.actor }).filter {
                it.playerPushEnabled && it.life>0 && !it.destroyed && it.binding == null
            }
            fun firstSide(actor: FightingCharacter)=actor === p1 || actor.opponent === p2
            for(i in pushers.indices)for(j in i+1 until pushers.size) {
                val a=pushers[i];val b=pushers[j]
                // Helpers inherit their root's opponent in the two-root fight model.
                if(firstSide(a) != firstSide(b))separate(a,b)
            }
        }
        if(autoFaceIdle) {
            if(p1.binding == null && p1.control && p1.stateType=="S")p1.facingRight=p1.posX<=p2.posX
            if(p2.binding == null && p2.control && p2.stateType=="S")p2.facingRight=p2.posX<=p1.posX
        }
    }
    private fun individual(p:FightingCharacter) {
        if(p.binding != null) return
        clampHorizontal(p)
        if(p.advanceFallbackReaction(ground))return
        val physics=p.stateProgram?.physics?.uppercase()
        if(physics=="A" && p.stateType=="A")p.velY+=p.definition.coordinates.fixedToWorld(p.definition.airGravity)
        if(p.posY>=ground && p.velY>0) {
            p.posY=ground
            p.velY=0
            if(p.stateType=="A") {
                val landing=if(p.definition.states.containsKey(52))52 else 0
                p.changeState(landing, p)
            }
        }
    }
    private fun clampHorizontal(p: FightingCharacter) {
        val limits=horizontalLimits(p)
        p.posX=p.posX.coerceIn(limits.first,limits.second)
    }
    internal fun horizontalLimits(p: FightingCharacter): Pair<Int,Int> {
        if(!p.screenBoundEnabled)return Int.MIN_VALUE to Int.MAX_VALUE
        val low=maxOf(left.toLong(),left.toLong()+p.edgeWidthWorld(-1))
        val high=minOf(right.toLong(),right.toLong()-p.edgeWidthWorld(1))
        if(low>high) { val center=((left.toLong()+right)/2).toInt();return center to center }
        return low.toInt() to high.toInt()
    }
    private fun separate(p1:FightingCharacter,p2:FightingCharacter) {
        if(abs(p1.posY.toLong()-p2.posY.toLong())>50L*Fixed.ONE)return
        val diff=p2.posX.toLong()-p1.posX.toLong()
        val forward=if(diff>=0)1 else -1
        val minDistance=p1.playerWidthWorld(forward).toLong()+p2.playerWidthWorld(-forward)
        if(abs(diff)>=minDistance)return
        val penetration=minDistance-abs(diff)
        val limits1=horizontalLimits(p1);val limits2=horizontalLimits(p2)
        val room1=if(p1.positionFrozen)0L else (if(forward>0)p1.posX.toLong()-limits1.first
            else limits1.second.toLong()-p1.posX).coerceAtLeast(0)
        val room2=if(p2.positionFrozen)0L else (if(forward>0)limits2.second.toLong()-p2.posX
            else p2.posX.toLong()-limits2.first).coerceAtLeast(0)
        var travel1=minOf(penetration/2,room1)
        val travel2=minOf(penetration-travel1,room2)
        // Give residual travel to the first actor when the second has less edge room.
        travel1=minOf(penetration-travel2,room1)
        p1.posX=(p1.posX.toLong()-forward*travel1).coerceIn(limits1.first.toLong(),limits1.second.toLong()).toInt()
        p2.posX=(p2.posX.toLong()+forward*travel2).coerceIn(limits2.first.toLong(),limits2.second.toLong()).toInt()
    }
}
