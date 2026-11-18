package moe.celery.kenjatime

import kotlin.math.abs
import kotlin.test.*

class ArenaSimulationTest {
    @Test fun archiveMotionAndKnockbackMirrorAtBothBackEdges() {
        val cns = """
            [Movement]
            air.gethit.groundlevel=10
            [Statedef 0]
            type=S
            anim=0
            [Statedef 20]
            type=S
            velset=3,0
            [State move forward]
            type=PosAdd
            trigger1=Time=0
            x=2
            [Statedef 5000]
            type=A
            movetype=H
            physics=N
            [State choose hit animation]
            type=ChangeAnim
            trigger1=Time=0
            trigger1=GetHitVar(groundtype)=2
            value=12
            [State gravity]
            type=VelAdd
            trigger1=1
            y=2
            [State landing]
            type=ChangeState
            trigger1=vel y>0 && pos y>=Const(movement.air.gethit.groundlevel)
            value=5100
            [Statedef 5100]
            type=L
            physics=N
            velset=0,0
            anim=13
            [State floor]
            type=PosSet
            trigger1=1
            y=0
            [Statedef 52]
            type=S
        """.trimIndent()
        val air = "[Begin Action 0]\n0,0,0,0,-1\n[Begin Action 12]\n12,0,0,0,-1\n[Begin Action 13]\n13,0,0,0,-1"
        val definition = FighterDefinition.fromScript("mirrored", air, cns, useAuthoredStateDefs = true)
        for (direction in listOf(-1, 1)) {
            val fighter = FightingCharacter(definition, 1)
            val victim = FightingCharacter(definition, 2)
            val fight = DeterministicFight(fighter, victim)
            fight.configureArena(-100, 100, push = false)
            fighter.facingRight = direction > 0
            victim.facingRight = direction < 0
            fighter.changeState(20)
            fight.step()
            assertEquals(direction * 5 * Fixed.ONE, fighter.posX)
            assertEquals(3.0, CoreExpression.number("Vel X", fighter, fight.issues))
            victim.posX = direction * 98 * Fixed.ONE
            victim.receiveHit(HitDefinition(damage=10, velocityX= -5 * Fixed.ONE,
                velocityY= -4 * Fixed.ONE, groundHitType=2), fighter.facingRight, attacker=fighter)
            assertEquals(direction * 5 * Fixed.ONE, victim.velX)
            fight.step()
            assertEquals(direction * 100 * Fixed.ONE, victim.posX)
            assertEquals(12, victim.animation?.action?.number)
            repeat(12) { fight.step() }
            assertEquals(5100, victim.stateNo)
            assertEquals(13, victim.animation?.action?.number)
            assertEquals(0, victim.posY)
            assertTrue(fight.issues.isEmpty(), fight.issues.toString())
        }
    }
    private val airStates = MugenCnsParser.parse("""
        [Statedef 0]
        type=S
        physics=S
        ctrl=1
        [Statedef 40]
        type=A
        physics=A
        ctrl=0
        velset=0,-4
        [Statedef 52]
        type=S
        physics=S
        ctrl=0
    """.trimIndent())
    private fun fight():DeterministicFight {
        val def=FighterDefinition("stage",states=airStates)
        return DeterministicFight(FightingCharacter(def,1),FightingCharacter(def,2))
    }

    @Test fun noStageConfigurationPreservesPureSimulationBaseline() {
        val w=fight()
        w.p1.changeState(40)
        repeat(5){w.step()}
        assertEquals(Fixed.of(-4.0),w.p1.velY)
        assertNull(w.camera)
    }

    @Test fun enabledArenaAddsAirGravityAndLandsIntoState52() {
        val w=fight()
        w.configureArena(-180,180,0)
        w.p1.changeState(40)
        w.p1.posX=-30*Fixed.ONE
        w.p2.posX=30*Fixed.ONE
        w.step()
        assertTrue(w.p1.posY<0)
        assertTrue(w.p1.velY>Fixed.of(-4.0))
        repeat(80){w.step()}
        assertEquals(0,w.p1.posY)
        assertEquals(52,w.p1.stateNo)
        assertEquals(0,w.p1.velY)
    }

    @Test fun edgeClampAndSymmetricPushRespectStageBounds() {
        val w=fight()
        w.configureArena(-150,150,0,push=true)
        w.p1.posX=-10*Fixed.ONE
        w.p2.posX=10*Fixed.ONE
        w.step()
        assertTrue(abs(w.p2.posX-w.p1.posX)>=30*Fixed.ONE)
        w.p1.posX=-400*Fixed.ONE
        w.p2.posX=400*Fixed.ONE
        w.step()
        assertEquals(-150*Fixed.ONE,w.p1.posX)
        assertEquals(150*Fixed.ONE,w.p2.posX)
    }

    @Test fun cameraTracksAirborneCharactersWithoutAffectingFightChecksum() {
        val a=fight()
        val b=fight()
        a.configureArena(-200,200,0)
        b.configureArena(-200,200,0)
        a.p1.posY=-200*Fixed.ONE
        b.p1.posY=-200*Fixed.ONE
        repeat(20){a.step();b.step()}
        assertTrue(a.camera!!.y < -10.0)
        assertEquals(a.checksum(),b.checksum())
    }
}
