package kenjatime.core

import kotlin.test.*

class CombatKernelTest {
    @Test fun sameTeamAndPausedPairsAreExcluded() {
        val k = ProjectileClashKernel(8)
        k.add(0.0, 0.0, 10.0, 10.0, 1, false, false)
        k.add(5.0, 5.0, 15.0, 15.0, 1, false, false)
        k.add(5.0, 5.0, 15.0, 15.0, 2, false, false)
        k.add(5.0, 5.0, 15.0, 15.0, 2, true, true)
        assertEquals(2, k.collect(true)) // (0,2) and (1,2)
        assertEquals(0, k.left(0)); assertEquals(2, k.right(0))
        assertEquals(1, k.left(1)); assertEquals(2, k.right(1))
        assertEquals(2, k.envelopePairs)
    }

    @Test fun strictAndInclusiveEdgesAreDistinct() {
        val k = ProjectileClashKernel(3)
        k.add(0.0, 0.0, 10.0, 10.0, 1, false, false)
        k.add(10.0, 2.0, 12.0, 4.0, 2, false, false)
        assertEquals(0, k.collect(false))
        assertEquals(1, k.collect(true))
        assertEquals(0, k.left(0)); assertEquals(1, k.right(0))
    }

    @Test fun pairsStayInOriginalCreationOrder() {
        val k = ProjectileClashKernel(6)
        for (i in 0..5) k.add(0.0, 0.0, 10.0, 10.0, i%2, false, false)
        val n = k.collect(true)
        assertEquals(9, n)
        val pairs = (0 until n).map { k.left(it) to k.right(it) }
        assertEquals(listOf(
            0 to 1, 0 to 3, 0 to 5,
            1 to 2, 1 to 4,
            2 to 3, 2 to 5,
            3 to 4, 4 to 5
        ), pairs)
        assertEquals(n, k.examinedPairs)
        assertEquals(n, k.envelopePairs)
    }

    @Test fun boundingRejectsNonFiniteAndRespectsCapacity() {
        val k = ProjectileClashKernel(2)
        k.add(Double.NaN, 0.0, 10.0, 10.0, 1, false, false)
        k.add(0.0, 0.0, 10.0, 10.0, 2, false, false)
        assertEquals(0, k.collect(true))
        assertFailsWith<IllegalArgumentException> {
            k.add(0.0, 0.0, 1.0, 1.0, 1, false, false)
        }
        k.clear()
        k.add(0.0, 0.0, 10.0, 10.0, 1, false, false)
        k.add(0.0, 0.0, 10.0, 10.0, 2, false, false)
        assertEquals(1, k.collect(true))
    }

    @Test fun globalScheduleHandlesPausedHelpersAndStandalonePlusOne() {
        val s = GlobalCombatSchedule
        assertEquals(63, s.mask(true,true,true,false,false,false))
        assertEquals(1 or 32, s.mask(false,false,false,true,true,false))
        assertEquals(1 or 16 or 32, s.mask(false,false,false,false,false,false))
        assertEquals(0, s.mask(true,true,true,false,false,true))
        assertEquals(1 or 2 or 4 or 16 or 32,
            s.mask(true,false,true,false,false,false))
        assertEquals(1 or 2 or 4 or 16 or 32,
            s.mask(true,true,true,false,true,false))
    }
}
