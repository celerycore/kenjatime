package moe.celery.kenjatime

import kotlin.test.*

class PaletteRemapsTest {
    private val base = CorePaletteId(1, 1)
    private val blue = CorePaletteId(1, 2)
    private val red = CorePaletteId(1, 3)
    private val catalog = "1,1,8;1,2,8;1,3,8;2,1,5"
    private fun fight(): DeterministicFight {
        val a = FighterDefinition.fromScript("A", "[Begin Action 0]\n0,0,0,0,-1",
            "[Statedef 0]\nanim=0\n[Statedef 700]\nanim=0")
        return DeterministicFight(FightingCharacter(a, 1), FightingCharacter(a, 2)).also {
            it.paletteBanks.catalog(0, catalog, "0,0,1,1;0,1,1,2;0,2,2,1")
            it.paletteBanks.catalog(1, "1,1,8;1,2,5", "0,0,1,1")
        }
    }

    private fun apply(fight: DeterministicFight, actor: FightingCharacter, args: Map<String, String>) {
        fight.paletteBanks.execute(actor, StateController("remappal", args, emptyList(), emptyMap()), fight.issues)
    }

    private fun palette(fight: DeterministicFight, sprite: Int, actor: FightingCharacter = fight.p1) =
        fight.paletteBanks.resolve(if (actor.rootActor() === fight.p1) 0 else 1, 0, sprite, actor.paletteEffects.remaps)

    @Test fun specificMappingsResolveOnceAndRejectOtherDepthsAndBanks() {
        val w = fight()
        apply(w, w.p1, mapOf("source" to "ifelse(1,1,2),1", "dest" to "1,2"))
        apply(w, w.p1, mapOf("source" to "1,2", "dest" to "1,3"))
        assertEquals(blue, palette(w, 0))
        assertEquals(red, palette(w, 1))
        apply(w, w.p1, mapOf("source" to "1,1", "dest" to "2,1"))
        apply(w, w.p2, mapOf("source" to "1,1", "dest" to "1,2"))
        assertEquals(blue, palette(w, 0))
        assertNull(palette(w, 0, w.p2))
        assertTrue(w.issues.any { "depths differ" in it })
    }

    @Test fun wildcardClearsPriorRulesAndSupportsReturningOneSpriteToItsBasePalette() {
        val w = fight()
        apply(w, w.p1, mapOf("source" to "1,2", "dest" to "1,3"))
        apply(w, w.p1, mapOf("dest" to "1,2"))
        assertEquals(blue, palette(w, 0))
        assertNull(palette(w, 1))
        assertNull(palette(w, 2))
        assertNull(palette(w, 3))
        apply(w, w.p1, mapOf("source" to "1,1"))
        assertNull(palette(w, 0))
        assertEquals(base, w.p1.paletteEffects.remaps[base])
        apply(w, w.p1, emptyMap())
        assertTrue(w.p1.paletteEffects.remaps.isEmpty())
    }

    @Test fun limitsAndInvalidAssignmentsKeepThePreviousValidMappings() {
        val w = fight()
        val keys = (1..10).joinToString(";") { "1,$it,8" }
        w.paletteBanks.catalog(0, keys, "0,0,1,1")
        for (i in 1..9) apply(w, w.p1, mapOf("source" to "1,$i", "dest" to "1,10"))
        assertEquals(8, w.p1.paletteEffects.remaps.size)
        assertFalse(CorePaletteId(1, 9) in w.p1.paletteEffects.remaps)
        val old = w.p1.paletteEffects.remaps
        for (bad in listOf("1,99", "-2,0", "1,2,3", "1,1/0")) {
            apply(w, w.p1, mapOf("source" to "1,1", "dest" to bad))
            assertSame(old, w.p1.paletteEffects.remaps)
        }
        assertFailsWith<IllegalArgumentException> { w.paletteBanks.catalog(0, keys, "0,0,1,99") }
        assertEquals(CorePaletteId(1, 10), palette(w, 0))
    }

    @Test fun helperFamiliesAndSavedPosesPreservePaletteOwnership() {
        val w = fight()
        apply(w, w.p1, mapOf("source" to "1,1", "dest" to "1,2"))
        val pose = CoreActorPose.capture(w.p1, 0)
        for (own in listOf(false, true)) {
            w.entities.add(listOf(EntityRequest.Helper(w.p1, 9, 700, 0, 0, 1, false, 0, ownPalette = own)), w.issues)
        }
        val (shared, independent) = w.entities.helpers.map { it.actor }
        apply(w, shared, mapOf("source" to "1,1", "dest" to "1,3"))
        assertEquals(red, palette(w, 0))
        assertEquals(red, palette(w, 0, shared))
        assertEquals(blue, palette(w, 0, independent))
        assertEquals(blue, w.paletteBanks.resolve(0, 0, 0, pose.paletteRemaps))
        val checksum = w.checksum()
        assertTrue(CorePresentationPlanner.snapshot(w, 0).contains("\"remapPalette\":[1,3]"))
        assertEquals(checksum, w.checksum())
    }
}
