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
    fun step(p1: FightingCharacter,p2: FightingCharacter,frozen1:Boolean,frozen2:Boolean) {
        if(!frozen1) individual(p1)
        if(!frozen2) individual(p2)
        if(pushPlayers && p1.life>0 && p2.life>0) separate(p1,p2)
        if(autoFaceIdle) {
            if(p1.control && p1.stateType=="S")p1.facingRight=p1.posX<=p2.posX
            if(p2.control && p2.stateType=="S")p2.facingRight=p2.posX<=p1.posX
        }
    }
    private fun individual(p:FightingCharacter) {
        p.posX=p.posX.coerceIn(left,right)
        val physics=p.definition.states[p.stateNo]?.physics?.uppercase()
        if(physics=="A" && p.stateType=="A")p.velY+=gravity
        if(p.posY>=ground && p.velY>0) {
            p.posY=ground
            p.velY=0
            if(p.stateType=="A") {
                val landing=if(p.definition.states.containsKey(52))52 else 0
                p.changeState(landing)
            }
        }
    }
    private fun separate(p1:FightingCharacter,p2:FightingCharacter) {
        if(abs(p1.posY.toLong()-p2.posY.toLong())>50L*Fixed.ONE)return
        val diff=p2.posX.toLong()-p1.posX.toLong()
        val minDistance=2L*playerHalfWidth
        if(abs(diff)>=minDistance)return
        val forward=if(diff>=0)1 else -1
        val penetration=(minDistance-abs(diff)).toInt()
        val half=penetration/2
        val before1=p1.posX
        val before2=p2.posX
        p1.posX=(p1.posX.toLong()-forward.toLong()*half).coerceIn(left.toLong(),right.toLong()).toInt()
        p2.posX=(p2.posX.toLong()+forward.toLong()*(penetration-half)).coerceIn(left.toLong(),right.toLong()).toInt()
        // If a player is pinned to the screen edge, give the remaining space to the other.
        val delta=(minDistance-abs(p2.posX.toLong()-p1.posX.toLong())).coerceAtLeast(0).toInt()
        if(delta>0) {
            if(p1.posX==before1)p2.posX=(p2.posX.toLong()+forward.toLong()*delta).coerceIn(left.toLong(),right.toLong()).toInt()
            else if(p2.posX==before2)p1.posX=(p1.posX.toLong()-forward.toLong()*delta).coerceIn(left.toLong(),right.toLong()).toInt()
        }
    }
}
