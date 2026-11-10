package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertContentEquals
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue
import kotlin.test.assertFailsWith

class BlueprintPrimitivesTest {
    @Test fun fixed16IsDeterministicAndBridgesLegacyCoordinates() {
        val a = Fixed16.fromRatio(3, 2)
        assertEquals(98304, a.raw)
        assertEquals(196608, (a * Fixed16.fromInt(2)).raw)
        assertEquals(32768, (Fixed16.ONE / Fixed16.fromInt(2)).raw)
        assertEquals(512, Fixed16.fromLegacy8(512).toLegacy8Raw())
        assertEquals(Int.MAX_VALUE, (Fixed16(Int.MAX_VALUE) + Fixed16.ONE).raw)
        assertFailsWith<IllegalArgumentException> { Fixed16.fromRatio(1, 0) }
    }
    @Test fun fractionalClockNeverChangesSimulationStepSize() {
        val clock = RationalTickAccumulator(1, 5)
        val samples = (1..10).map { clock.advance() }
        assertEquals(listOf(false,false,false,false,true,false,false,false,false,true), samples)
    }
    @Test fun flattenedCollisionHonorsFacingAndAllocatesOnlyOnGrowth() {
        val attacking = AirAction(200, listOf(AirFrame(0,0,0,0,-1,boxes=listOf(
            AirBox(true, MugenRect(0,-40,40,-20)))))
        val hurting = AirAction(0, listOf(AirFrame(0,0,0,0,-1,boxes=listOf(
            AirBox(false, MugenRect(-10,-50,10,0)))))
        val p1 = FightingCharacter(FighterDefinition("p1", mapOf(200 to attacking)),1)
        val p2 = FightingCharacter(FighterDefinition("p2", mapOf(0 to hurting)),2)
        p1.changeAnimation(200)
        p2.posX = 20 * Fixed.ONE
        val scratch = FlatCollisionScratch()
        assertTrue(scratch.connects(p1,p2))
        p1.facingRight = false
        assertFalse(scratch.connects(p1,p2))
        p2.posX = -20 * Fixed.ONE
        assertTrue(scratch.connects(p1,p2))
        val box = FlatBoxBuffer()
        box.add(1,4,4,-4,-4)
        assertContentEquals(intArrayOf(1,-4,-4,4,4),box.copyFlat())
    }
    @Test fun broadphaseEliminatesDisjointEntitiesAndKeepsStableOrder() {
        val found = mutableListOf<Pair<Int,Int>>()
        SweepBroadphase().overlaps(4,
            intArrayOf(100,0,13,200), intArrayOf(110,20,30,220)) { a,b ->
            found.add(a to b)
        }
        assertEquals(listOf(1 to 2),found)
    }
    @Test fun registrySharesParsesButDropsLastReference() {
        val registry = SharedAssetRegistry<String>(2)
        var builds = 0
        assertEquals("loaded",registry.acquire("kfm") { builds++; "loaded" })
        assertEquals("loaded",registry.acquire("kfm") { builds++; "unexpected" })
        assertEquals(1,builds)
        assertEquals(2,registry.references("kfm"))
        assertTrue(registry.release("kfm"))
        assertEquals(1,registry.references("kfm"))
        registry.release("kfm")
        assertEquals(0,registry.size)
    }
    @Test fun rollbackRingRejectsOverwrittenFrames() {
        val ring = FixedStateRing(3,4)
        val src = intArrayOf(1,2,3,4)
        val result = IntArray(4)
        ring.store(10,src)
        assertTrue(ring.restore(10,result))
        assertContentEquals(src,result)
        ring.store(13,intArrayOf(9,8,7,6))
        assertFalse(ring.restore(10,result))
        assertTrue(ring.restore(13,result))
        assertContentEquals(intArrayOf(9,8,7,6),result)
    }
    @Test fun recordedInputCanExportBoundedCmdMacro() {
        val history = PackedInputHistory(60)
        history.record(Directions.D,0)
        history.record(Directions.DF,0)
        history.record(Directions.R,1)
        assertTrue(history.exportCmd("qcf").contains("command = D, DF, F, a"))
        assertFailsWith<IllegalArgumentException> { history.exportCmd("bad\nname") }
    }
}
