package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class LegacyPresentationControllersTest {
    private val fightFx = """
        [Begin Action 0]
        1,0,0,0,1
        1,1,0,0,1
        [Begin Action 120]
        2,0,0,0,1
        2,1,0,0,1
    """.trimIndent()

    private fun controller(type: String, params: String = "", trigger: String = "1") =
        "[State 0, $type]\ntype=$type\ntrigger1=$trigger\n$params\n"

    private fun fight(left: String = "", right: String = ""): DeterministicFight {
        fun fighter(id: Int, script: String) = FightingCharacter(
            FighterDefinition.fromScript("fighter $id", "[Begin Action 0]\n0,0,0,0,-1",
                "[Statedef 0]\nphysics=N\nctrl=0\nanim=0\n$script",
                defText = "[Info]\nlocalcoord=1280,720"), id,
        )
        return DeterministicFight(fighter(1, left), fighter(2, right)).also {
            it.commonAnimations.catalog(fightFx, 0.75)
            it.p2.facingRight = false
            it.p2.posX = Fixed.of(10.0)
        }
    }

    @Test fun dustSpawnsTwoFacingRelativeCloudsAndRearmsOnStateEntry() {
        val w = fight(right = controller("MakeDust", "pos=8,-4\npos2=-8,0"))
        w.step()
        val spawned = w.commonAnimations.all
        assertEquals(listOf(8 * 256, 12 * 256), spawned.map { it.x })
        assertEquals(listOf(-256, 0), spawned.map { it.y })
        assertTrue(spawned.all { it.under && it.side == 1 && !it.facingRight })
        w.step()
        assertEquals(listOf(1, 1), spawned.map { it.animation.index })
        w.step()
        assertTrue(spawned.isEmpty())
        w.step()
        assertEquals(2, spawned.size)
        w.p2.changeState(0)
        w.step()
        assertEquals(4, spawned.size)
    }

    @Test fun gameAnimationUsesIndependentDeterministicJitterAndSharedArtScale() {
        val script = controller("GameMakeAnim", "pos=20,-10\nrandom=40", "Time=0")
        val a = fight(left = script)
        val b = fight(left = script)
        a.step()
        b.step()
        val effect = a.commonAnimations.all.single()
        val replay = b.commonAnimations.all.single()
        assertEquals(effect.x to effect.y, replay.x to replay.y)
        assertTrue(effect.x in 0..2560)
        assertTrue(effect.y in -1920..640)
        assertFalse(effect.under)
        val snapshot = CorePresentationPlanner.snapshot(a, 0)
        assertTrue(snapshot.indexOf("\"kind\":\"gameanim\"") > snapshot.lastIndexOf("\"kind\":\"fighter\""))
        assertTrue(snapshot.substringAfter("\"kind\":\"gameanim\"").contains("\"spriteScaleX\":0.75"))
    }

    @Test fun loopingEffectsSurviveCycleBoundariesButFreezeThroughGlobalPause() {
        val script = controller("GameMakeAnim", "value=10", "Time=0") +
            controller("Pause", "time=2", "Time=0")
        val w = fight(left = script)
        w.commonAnimations.catalog("[Begin Action 10]\nLoopStart\n1,0,0,0,1\n", 1.0)
        w.step()
        val fx = w.commonAnimations.all.single()
        repeat(2) { w.step(); assertEquals(0, fx.age) }
        w.step()
        assertEquals(1, fx.age)
        assertTrue(fx.animation.finished)
        assertEquals(fx, w.commonAnimations.all.single())
    }

    @Test fun effectDiagnosticsCoverMissingBankAndRejectInvalidSpacing() {
        val w = fight(left = controller("MakeDust", "spacing=0"), right = controller("GameMakeAnim", "value=99"))
        w.step()
        assertTrue(w.commonAnimations.all.isEmpty())
        assertTrue(w.issues.any { it.contains("spacing") })
        assertTrue(w.issues.any { it.contains("fightfx animation 99") })
    }

    @Test fun rumbleUsesActorSideAndCubicEnvelopeUntilExpiry() {
        val w = fight(right = controller("ForceFeedback", "self=0\nwaveform=sinesquare\nampl=50,20,5,1\ntime=3",
            "Time=0"))
        w.step()
        assertEquals("[{\"side\":0,\"strongMagnitude\":${50.0 / 255},\"weakMagnitude\":${50.0 / 255}}]",
            w.forceFeedback.json())
        w.step()
        assertTrue(w.forceFeedback.json().contains((76.0 / 255).toString()))
        w.step()
        assertTrue(w.forceFeedback.json().contains((118.0 / 255).toString()))
        w.step()
        assertEquals("[{\"side\":0,\"reset\":true}]", w.forceFeedback.json())
        w.step()
        assertEquals("[]", w.forceFeedback.json())
    }

    @Test fun invalidRumbleDoesNotClobberActiveMotorsAndOffClearsThem() {
        val w = fight(left = controller("ForceFeedback", "waveform=square\nampl=999\ntime=5", "Time=0") +
            controller("ForceFeedback", "time=2+3", "Time=1") +
            controller("ForceFeedback", "waveform=off", "Time=2"))
        repeat(2) {
            w.step()
            assertEquals("[{\"side\":0,\"strongMagnitude\":0.0,\"weakMagnitude\":1.0}]", w.forceFeedback.json())
        }
        assertTrue(w.issues.any { it.contains("require numeric constants") })
        w.step()
        assertEquals("[{\"side\":0,\"reset\":true}]", w.forceFeedback.json())
    }
}
