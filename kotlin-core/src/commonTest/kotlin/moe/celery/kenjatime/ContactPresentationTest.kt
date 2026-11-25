package moe.celery.kenjatime

import kotlin.test.*

class ContactPresentationTest {
    private val air = """
        [Begin Action 0]
        Clsn2Default: 1
        Clsn2[0] = -18,-42,18,0
        0,0,0,0,-1
        [Begin Action 200]
        Clsn1Default: 1
        Clsn1[0] = -34,-42,42,0
        Clsn2Default: 1
        Clsn2[0] = -18,-42,18,0
        0,0,0,0,-1
        [Begin Action 810]
        8,0,0,0,1
        8,1,0,0,2
        [Begin Action 811]
        8,2,0,0,4
    """.trimIndent()
    private val sharedAir = """
        [Begin Action 40]
        7,4,0,0,5
        [Begin Action 42]
        LoopStart
        7,6,0,0,3
    """.trimIndent()

    private fun fighter(id: Int, width: Int = 320, controller: String = "type=Null", data: String = "") =
        FightingCharacter(FighterDefinition.fromScript("fighter $id", air, """
            [Data]
            $data
            [Size]
            ground.front=10
            ground.back=13
            [Statedef 0]
            type=S
            anim=0
            ctrl=1
            [Statedef 200]
            type=S
            movetype=A
            physics=N
            anim=200
            ctrl=0
            [State contact]
            trigger1=1
            $controller
        """.trimIndent(), defText = "[Info]\nlocalcoord=$width,240", useAuthoredStateDefs = true), id)

    private fun fight(first: FightingCharacter, second: FightingCharacter): DeterministicFight {
        first.posX = -12 * Fixed.ONE
        second.posX = 12 * Fixed.ONE
        second.facingRight = false
        return DeterministicFight(first, second).also { w ->
            w.commonAnimations.catalog(sharedAir, 1.5)
            w.sounds.catalog(COMMON_SOUND_BANK, "5,0,800,8000;6,0,1200,8000")
            for (side in 0..1) w.sounds.catalog(side, "5,0,2400,8000;6,0,1600,8000")
        }
    }

    @Test fun bodySparkUsesVictimWidthAndSourceUnitsAndAnimatesThroughHitPause() {
        for (side in 1..2) {
            val attacker = fighter(side, 640, """
                type=HitDef
                attr=S,NA
                damage=18,2
                pausetime=5,7
                sparkxy=-4,-16
                hitsound=5,0
            """.trimIndent(), data = "sparkno=S810")
            val victim = fighter(3 - side)
            val w = if (side == 1) fight(attacker, victim) else fight(victim, attacker)
            attacker.posY = -6 * Fixed.ONE
            attacker.changeState(200)
            w.step()
            assertEquals(982, victim.life)
            assertEquals(1, w.contacts.size)
            val spark = w.commonAnimations.all.single()
            assertTrue(spark.contact)
            assertFalse(spark.common)
            assertEquals(810, spark.animation.action.number)
            assertEquals(4 * (if (side == 1) 1 else -1) * Fixed.ONE, spark.x)
            assertEquals(-14 * Fixed.ONE, spark.y)
            assertEquals(side == 1, spark.facingRight)
            assertEquals(side - 1, spark.side)
            assertEquals(0, spark.animation.index)
            val sound = w.sounds.voices.single()
            assertTrue(sound.common)
            assertEquals(800L, sound.sample.frames)
            assertEquals(spark.x / (160.0 * Fixed.ONE), sound.pan)
            assertTrue(w.effects.all.isEmpty())
            w.step()
            assertSame(spark, w.commonAnimations.all.single())
            assertEquals(1, spark.animation.index)
            assertTrue(attacker.hitPauseLeft > 0)
            repeat(2) { w.step() }
            assertTrue(w.commonAnimations.all.isEmpty())
            assertTrue(w.issues.isEmpty(), w.issues.toString())
        }
    }

    @Test fun guardSelectsItsOwnSparkAndSoundDefaultsOnce() {
        val w = fight(fighter(1, controller = """
            type=HitDef
            attr=S,NA
            guardflag=M
            damage=70,3
            sparkno=S810
            hitsound=5,0
        """.trimIndent(), data = "guard.sparkno=40\nguardsound=S6,0"), fighter(2))
        w.p1.changeState(200)
        w.step(b = InputFrame(Directions.R))
        assertTrue(w.contacts.single().guarded)
        assertEquals(997, w.p2.life)
        val spark = w.commonAnimations.all.single()
        assertTrue(spark.common)
        assertEquals(40, spark.animation.action.number)
        assertEquals(2 * Fixed.ONE, spark.x)
        assertFalse(w.sounds.voices.single().common)
        assertEquals(1600L, w.sounds.voices.single().sample.frames)
        assertContains(CorePresentationPlanner.snapshot(w, 0), "\"kind\":\"spark\"")
        w.step(b = InputFrame(Directions.R))
        assertEquals(1, w.commonAnimations.all.size)
        assertTrue(w.contacts.isEmpty())
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun parametersAreCapturedBeforeContactAndMalformedArtDoesNotCancelDamage() {
        val w = fight(fighter(1, controller = """
            type=HitDef
            attr=S,NA
            damage=20
            sparkno=S(810+Var(0))
            hitsound=(not_a_valid_contact_function(6),0
        """.trimIndent()), fighter(2))
        w.p1.posX = -100 * Fixed.ONE
        w.p1.changeState(200)
        w.step()
        assertTrue(w.contacts.isEmpty() && w.commonAnimations.all.isEmpty())
        w.p1.vars[0] = 1
        w.p1.posX = -12 * Fixed.ONE
        w.step()
        assertEquals(980, w.p2.life)
        assertEquals(810, w.commonAnimations.all.single().animation.action.number)
        assertTrue(w.sounds.voices.isEmpty())
        assertTrue(w.issues.any { it.startsWith("Invalid contact hitsound") })
    }

    @Test fun projectileEffectUsesTheShotPositionAndLaunchFacing() {
        val w = fight(fighter(1, controller = """
            type=Projectile
            persistent=0
            attr=S,NP
            projanim=200
            offset=68,-14
            velocity=3,0
            damage=7
            sparkno=S810
            sparkxy=5,-9
            hitsound=S6,0
        """.trimIndent()), fighter(2))
        w.p1.posX = -60 * Fixed.ONE
        w.p1.changeState(200)
        w.step()
        assertTrue(w.commonAnimations.all.isEmpty())
        w.p1.facingRight = false
        w.p1.posY = -50 * Fixed.ONE
        w.step()
        assertEquals(993, w.p2.life)
        val spark = w.commonAnimations.all.single()
        assertTrue(spark.facingRight)
        assertEquals(16 * Fixed.ONE, spark.x)
        assertEquals(-23 * Fixed.ONE, spark.y)
        assertFalse(w.sounds.voices.single().common)
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun hitDefColorsTheDefenderForTheAuthoredDurationDuringHitPause() {
        val w = fight(fighter(1, controller = """
            type=HitDef
            attr=S,NA
            damage=15
            pausetime=5,5
            palfx.time=2
            palfx.add=ifelse(Var(0),64,32),0,-16
            palfx.mul=128,256,256
        """.trimIndent()), fighter(2))
        w.p1.posX = -100 * Fixed.ONE
        w.p1.changeState(200)
        w.step()
        assertTrue(w.contacts.isEmpty())
        assertNull(w.p2.paletteEffects.effect)
        w.p1.vars[0] = 1
        w.p1.posX = -12 * Fixed.ONE
        w.step()
        assertEquals(985, w.p2.life)
        assertNull(w.p1.paletteEffects.effect)
        assertNull(w.palettes.all.effect)
        val layers = w.palettes.layers(w.p2.paletteEffects)
        assertEquals(listOf(66, 80, 44), CoreFightPalettes.rgb(listOf(100, 80, 60), layers))
        assertContains(CorePresentationPlanner.snapshot(w, 0), "\"add\":[32,0,-16]")
        assertEquals(2, w.p2.paletteEffects.effect?.remaining)
        w.step()
        assertEquals(1, w.p2.paletteEffects.effect?.remaining)
        w.step()
        assertNull(w.p2.paletteEffects.effect)
        assertTrue(w.p2.hitPauseLeft > 0)
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun guardAndDisabledOrInvalidEffectsPreserveTheDefendersPalette() {
        for ((params, guarded) in listOf(
            "palfx.time=3\npalfx.add=40,0,0" to true,
            "palfx.time=0" to false,
            "palfx.time=3\npalfx.mul=128,256" to false,
        )) {
            val w = fight(fighter(1, controller = """
                type=HitDef
                attr=S,NA
                damage=10,2
                guardflag=M
                $params
            """.trimIndent()), fighter(2))
            val before = CorePaletteEffect(-1, listOf(0, 20, 0), listOf(256, 256, 256),
                256, false, listOf(0, 0, 0), 0)
            w.p2.paletteEffects.replace(before)
            w.p1.changeState(200)
            w.step(b = if (guarded) InputFrame(Directions.R) else InputFrame())
            assertEquals(guarded, w.contacts.single().guarded)
            assertEquals(if (guarded) 998 else 990, w.p2.life)
            assertEquals(before.copy(age = 1), w.p2.paletteEffects.effect)
            assertEquals("palfx.mul" in params, w.issues.any { it.startsWith("Invalid impact PalFX") })
        }
    }

    @Test fun projectileCapturesPaletteAtLaunchAndStartsItsClockAtContact() {
        val w = fight(fighter(1, controller = """
            type=Projectile
            persistent=0
            attr=S,NP
            projanim=200
            offset=68,-14
            velocity=3,0
            damage=7
            palfx.time=3
            palfx.add=Var(0),20,30
        """.trimIndent()), fighter(2))
        w.p1.posX = -60 * Fixed.ONE
        w.p1.vars[0] = 10
        w.p1.changeState(200)
        w.step()
        assertNull(w.p2.paletteEffects.effect)
        w.p1.vars[0] = 90
        w.step()
        assertEquals(993, w.p2.life)
        assertEquals(listOf(10, 20, 30), w.p2.paletteEffects.effect?.add)
        assertEquals(3, w.p2.paletteEffects.effect?.remaining)
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun randomContactExpressionsPreserveCombatRandomAcrossRedirects() {
        val w = fight(fighter(1), fighter(2))
        val baseline = fight(fighter(1), fighter(2))
        val input = mapOf("sparkno" to "S(ifelse(Random%2,810,811))",
            "hitsound" to "S6,(enemynear,Random)%2")
        val cues = List(12) { CoreContactPresentation.capture(w.p1, input, w.issues) }
        assertEquals(setOf(810, 811), cues.mapNotNull { it.spark?.action }.toSet())
        assertEquals(setOf(0, 1), cues.mapNotNull { it.sound?.number }.toSet())
        repeat(12) {
            assertEquals(baseline.p1.nextRandom(1000), w.p1.nextRandom(1000))
            assertEquals(baseline.p2.nextRandom(1000), w.p2.nextRandom(1000))
        }
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun reversalOffsetsTheIncomingSparkAndNeutralizesItsEffects() {
        val w = fight(fighter(1, controller = """
            type=ReversalDef
            reversal.attr=S,NA
            sparkno=F42
            sparkxy=4,-7
            hitsound=5,0
        """.trimIndent()), fighter(2, controller = """
            type=HitDef
            attr=S,NA
            damage=100
            sparkno=S811
            sparkxy=-3,-16
            hitsound=S6,0
        """.trimIndent()))
        w.p2.posY = -8 * Fixed.ONE
        w.p1.changeState(200)
        w.p2.changeState(200)
        w.step()
        assertEquals(1, w.reversals.contacts.size)
        assertTrue(w.contacts.isEmpty())
        val spark = w.commonAnimations.all.single()
        assertEquals(42, spark.animation.action.number)
        assertEquals(-Fixed.ONE, spark.x)
        assertEquals(-31 * Fixed.ONE, spark.y)
        assertTrue(w.sounds.voices.single().common)
        repeat(3) { w.step() }
        assertTrue(w.commonAnimations.all.isEmpty())
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }
}
