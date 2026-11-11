package moe.celery.kenjatime

import kotlin.math.abs
import kotlin.test.*

class ArenaSimulationTest {
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
