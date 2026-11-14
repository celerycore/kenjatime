package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class KotlinStandardTest {
    @Test fun slowRendererNeverDiscardsAuthoritativeTickDebt() {
        val clock = CoreTickBudget(maximumBatch = 4)
        assertEquals(0, clock.claim(0.0))
        assertEquals(4, clock.claim(1000.0))
        repeat(4) { clock.completedOne() }
        assertEquals(56L, clock.overdue)
        var total = 4
        while (clock.claim(1000.0) > 0) {
            val batch = clock.claim(1000.0)
            repeat(batch) { clock.completedOne(); total++ }
        }
        assertEquals(60,total)
        assertEquals(0L,clock.overdue)
        assertEquals(0,clock.claim(1000.0))
        assertEquals(1,clock.claim(1017.0))
        clock.completedOne()
        assertEquals(61L,clock.completed)
    }

    @Test fun fixedClockResetsWithoutAdvancingFightOnPause() {
        val clock = CoreTickBudget(6)
        clock.claim(0.0)
        assertEquals(6,clock.claim(400.0))
        repeat(6) { clock.completedOne() }
        clock.reset(2000.0)
        assertEquals(0L,clock.overdue)
        assertEquals(0L,clock.completed)
        assertEquals(0,clock.claim(2000.0))
        assertEquals(1,clock.claim(2017.0))
    }

    @Test fun benchmarkAiPerformsDeterministicMovementAndQcfSpecialMotions() {
        val a=FightingCharacter(FighterDefinition("A"),1)
        val b=FightingCharacter(FighterDefinition("B"),2)
        a.opponent=b
        b.opponent=a
        b.posX=50*Fixed.ONE
        val one=(0L..400L).map { CoreCpu.input(a,b,it,4) }
        val two=(0L..400L).map { CoreCpu.input(a,b,it,4) }
        assertEquals(one,two)
        assertTrue(one.any{it.directions==Directions.D})
        assertTrue(one.any{it.directions==(Directions.D or Directions.R)})
        assertTrue(one.any{it.buttons.isNotEmpty()})
        assertTrue(one.any{it.directions==(Directions.U or Directions.R)})
    }

    @Test fun kotlinCpuReplayIsChecksumIdenticalAt600Ticks() {
        val air=MugenAirParser.parse(
            "[Begin Action 0]\nClsn2:1\nClsn2[0]=-10,-55,10,0\n0,0,0,0,-1")
        fun run():String {
            val f=FighterDefinition("original",animations=air)
            val fight=DeterministicFight(FightingCharacter(f,1),FightingCharacter(f,2))
            fight.configureArena(-150,150)
            fight.p1.posX = -70*Fixed.ONE
            fight.p2.posX = 70*Fixed.ONE
            fight.p1.facingRight=true
            fight.p2.facingRight=false
            repeat(600) {
                fight.step(CoreCpu.input(fight.p1,fight.p2,fight.frame,4),
                    CoreCpu.input(fight.p2,fight.p1,fight.frame,4))
            }
            assertEquals(600L,fight.frame)
            return fight.checksum()
        }
        assertEquals(run(),run())
    }
}
