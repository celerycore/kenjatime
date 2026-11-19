package moe.celery.kenjatime

import kotlin.test.*

class CommonMovementTest {
    private val air = listOf(
        0 to -1, 10 to 3, 11 to -1, 12 to 2, 20 to -1, 21 to -1, 40 to 3, 41 to -1,
        42 to -1, 43 to -1, 47 to 5, 120 to 2, 121 to 2, 130 to -1, 131 to -1, 140 to 3, 141 to 3
    ).joinToString("\n") { (action, duration) -> "[Begin Action $action]\n0,0,0,0,$duration" }
    private val cmd = """
        [Command]
        name="holdfwd"
        command=/${'$'}F
        [Command]
        name="holdback"
        command=/${'$'}B
        [Command]
        name="holddown"
        command=/${'$'}D
    """.trimIndent()

    private fun fight(cns: String): DeterministicFight {
        val definition = FighterDefinition.fromScript("test fighter", air, cns, cmd,
            "[Files]\nstcommon=common1.cns", useAuthoredStateDefs = true)
        val first = FightingCharacter(definition, 1, MugenCommandParser.parseFile(cmd))
        val second = FightingCharacter(definition, 2, first.commands)
        first.posX = -90 * Fixed.ONE
        second.posX = 90 * Fixed.ONE
        second.facingRight = false
        return DeterministicFight(first, second).also { it.configureArena(-250, 250, push = false) }
    }

    @Test fun archiveRootsWalkAndCrouchWithSharedMovementDefaults() {
        val w = fight("[Velocity]\nwalk.fwd=2")
        repeat(6) { w.step(InputFrame(Directions.R), InputFrame(Directions.L)) }
        assertEquals(20, w.p1.stateNo)
        assertEquals(20, w.p2.stateNo)
        assertEquals(-80 * Fixed.ONE, w.p1.posX)
        assertEquals(80 * Fixed.ONE, w.p2.posX)
        assertEquals(Fixed.of(1.7), w.p1.velX)
        w.step()
        assertEquals(0, w.p1.stateNo)
        w.step(InputFrame(Directions.D))
        assertEquals(10, w.p1.stateNo)
        repeat(6) { w.step(InputFrame(Directions.D)) }
        assertEquals(11, w.p1.stateNo)
        w.step()
        assertEquals(12, w.p1.stateNo)
        repeat(4) { w.step() }
        assertEquals(0, w.p1.stateNo)
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun airJumpUsesAnUpEdgeAndResetsItsAllowanceOnLanding() {
        val w = fight("[Movement]\nairjump.num=1\nairjump.height=35\nyaccel=.44")
        fun enterAirJump() {
            repeat(17) { w.step(InputFrame(Directions.U)) }
            assertEquals(50, w.p1.stateNo)
            assertTrue(w.p1.posY < -35 * Fixed.ONE)
            w.step()
            w.step(InputFrame(Directions.U))
            assertEquals(45, w.p1.stateNo)
            repeat(5) { w.step() }
            assertEquals(50, w.p1.stateNo)
            assertTrue(w.p1.velY < 0)
            w.step(InputFrame(Directions.U))
            assertEquals(50, w.p1.stateNo)
        }
        enterAirJump()
        repeat(160) { w.step() }
        assertEquals(0, w.p1.stateNo)
        assertEquals(0, w.p1.posY)
        enterAirJump()
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun authoredRunRespectsNoWalkAndStateEntryPreservesPostureAndPhysics() {
        val w = fight("""
            [Statedef 20]
            type=S
            velset=5,0
            [Statedef 100]
            type=S
            physics=S
            [State disable auto walk]
            type=AssertSpecial
            trigger1=1
            flag=NoWalk
            [Statedef 101]
            type=C
            physics=C
            [Statedef 600]
            type=U
            movetype=U
            physics=U
            facep2=1
            velset=4,0
            [State disable friction]
            type=StateTypeSet
            trigger1=Time=1
            physics=N
        """.trimIndent())
        w.p1.changeState(101)
        assertEquals("C", w.p1.stateType)
        w.p1.facingRight = false
        w.p1.changeState(600)
        assertTrue(w.p1.facingRight)
        assertEquals("C", w.p1.stateType)
        assertEquals("C", w.p1.physics)
        assertEquals(4 * Fixed.ONE, w.p1.velX)
        w.step(InputFrame(Directions.D))
        assertEquals((4 * Fixed.ONE * .82).toInt(), w.p1.velX)
        val slowed = w.p1.velX
        w.step(InputFrame(Directions.D))
        assertEquals("N", w.p1.physics)
        assertEquals(slowed, w.p1.velX)

        w.p1.changeState(20)
        assertEquals(5 * Fixed.ONE, w.p1.velX, "the imported StateDef replaces the default")
        w.p1.changeState(100)
        repeat(4) { w.step(InputFrame(Directions.R)) }
        assertEquals(100, w.p1.stateNo)
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun guardEntryUsesLatchedProximityAndGuardEndReturnsToNeutral() {
        val w = fight("""
            [Statedef 200]
            type=S
            movetype=A
            physics=N
            ctrl=0
        """.trimIndent())
        w.p1.posX = -45 * Fixed.ONE
        w.p2.posX = 45 * Fixed.ONE
        w.p1.changeState(200)
        w.step(b = InputFrame(Directions.R))
        assertTrue(w.p2.inGuardDistance)
        w.step(b = InputFrame(Directions.R))
        assertEquals(120, w.p2.stateNo)
        assertEquals("S", w.p2.stateType)
        repeat(5) { w.step(b = InputFrame(Directions.R)) }
        assertEquals(130, w.p2.stateNo)
        w.step()
        assertEquals(140, w.p2.stateNo)
        repeat(6) { w.step() }
        assertEquals(0, w.p2.stateNo)
        assertTrue(w.p2.control)
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }
}
