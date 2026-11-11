package kenjatime.core

import kotlin.test.*

class DeterministicCoreTest {
    @Test fun fixedArithmetic() {
        assertEquals(2.5, (Fixed16.ofInt(2) + Fixed16.ofRaw(32768)).toDouble())
        assertEquals(-1.5, (Fixed16.ofInt(-3) * Fixed16.ofRaw(32768)).toDouble())
        assertEquals(1.5, (Fixed16.ofInt(3) / Fixed16.ofInt(2)).toDouble())
        assertEquals(-2, Fixed16.ofRaw(-98304).toIntFloor())
    }
    @Test fun broadphaseIsStableAndInclusive() {
        val sweep = SweepBroadphase(5)
        sweep.add(1, 0, 0, 10, 10)
        sweep.add(2, 10, 3, 15, 6)
        sweep.add(3, 20, 0, 30, 10)
        sweep.add(4, 7, 20, 12, 25)
        val pairs = mutableListOf<Pair<Int, Int>>()
        sweep.overlaps { a, b -> pairs.add(a to b) }
        assertEquals(listOf(1 to 2), pairs)
    }
    @Test fun historyFindsReverseMotionWithinWindow() {
        val input = InputHistory()
        input.push(1); input.push(3); input.push(2); input.push(16)
        assertTrue(input.matches(intArrayOf(1, 3, 2, 16), 8))
        assertFalse(input.matches(intArrayOf(1, 3, 2, 16), 2))
    }
    @Test fun rollbackSnapshotsWrapSafely() {
        val snapshots = SnapshotRing(3, 2)
        val dest = intArrayOf(0, 0)
        snapshots.save(0, intArrayOf(7, 8))
        snapshots.save(1, intArrayOf(9, 10))
        snapshots.save(3, intArrayOf(11, 12))
        assertFalse(snapshots.restore(0, dest))
        assertTrue(snapshots.restore(3, dest))
        assertContentEquals(intArrayOf(11, 12), dest)
    }
    @Test fun cinematicSlowMotionDoesNotChangeFixedStep() {
        val ticks = TickAccumulator()
        val rate = Fixed16.ofRaw(13107) // approximately 0.2
        var steps = 0
        repeat(10) { steps += ticks.advance(rate) }
        assertEquals(1, steps) // truncated 16.16 accumulation
    }
    @Test fun sharedAssetsAreDisposedOnlyAfterFinalRelease() {
        val registry = AssetRegistry<String>()
        var loads = 0
        var disposals = 0
        registry.acquire("kfm") { loads++; "asset" }
        registry.acquire("kfm") { loads++; "wrong" }
        assertEquals(1, loads)
        registry.release("kfm") { disposals++ }
        assertEquals(0, disposals)
        registry.release("kfm") { disposals++ }
        assertEquals(1, disposals)
    }
    @Test fun telemetryMaintainsRollingMean() {
        val t = PhaseTelemetry(2, 2)
        t.record(0, 2.0); t.record(0, 4.0); t.record(0, 8.0)
        assertEquals(6.0, t.average(0))
    }
}
