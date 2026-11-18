package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertTrue

class SharedAssetBanksTest {
    private val fighterAir = "[Begin Action 0]\n0,0,0,0,-1\n[Begin Action 30]\n0,1,0,0,-1"
    private val commonAir = "[Begin Action 30]\n777,0,0,0,1\n777,1,0,0,-1"
    private val idle = "[Statedef 0]\nphysics=N\nanim=0\nctrl=0"

    private fun controller(type: String, tick: Int, arguments: String) =
        "[State 0, $type]\ntype=$type\ntrigger1=GameTime=$tick\n$arguments\n"

    private fun fight(left: String = "", right: String = "", common: Boolean = true): DeterministicFight {
        fun actor(id: Int, script: String) = FightingCharacter(
            FighterDefinition.fromScript("fighter $id", fighterAir, "$idle\n$script",
                defText = "[Info]\nlocalcoord=640,480"), id,
        )
        return DeterministicFight(actor(1, left), actor(2, right)).also {
            it.p1.posX = -40 * 256
            it.p2.posX = 40 * 256
            it.p2.facingRight = false
            it.sounds.catalog(0, "0,0,800,8000")
            it.sounds.catalog(1, "0,0,1600,8000")
            if (common) {
                it.commonAnimations.catalog(commonAir, 0.75)
                it.sounds.catalog(COMMON_SOUND_BANK, "0,0,2400,8000")
            }
        }
    }

    @Test fun commonExplodPreservesBankAndClockAcrossSparseModification() {
        val w = fight(right =
            controller("Explod", 0, "anim=F30\nid=71\nscale=2,0.5\nremovetime=-1\npos=16,-8") +
            controller("ModifyExplod", 1, "id=71\nsprpriority=3") +
            controller("ModifyExplod", 2, "id=71\nanim=F0") +
            controller("ModifyExplod", 3, "id=71\nanim=S30"))
        w.step()
        val effect = w.effects.all.single()
        assertEquals(32 * 256, effect.x)
        assertEquals(-4 * 256, effect.y)
        assertTrue(effect.config.commonAnimation)
        assertEquals(777, effect.animation.frame?.group)
        val plan = CorePresentationPlanner.snapshot(w, 0).substringAfter("\"kind\":\"explod\"")
        assertTrue(plan.contains("\"spriteScaleX\":1.5") && plan.contains("\"spriteScaleY\":0.375"))
        assertTrue(plan.contains("\"common\":true"))
        w.step()
        assertEquals(3, effect.config.priority)
        assertEquals(1, effect.animation.index)
        w.step()
        assertTrue(effect.config.commonAnimation)
        assertTrue(w.issues.any { it.contains("Explod animation missing: F0") })
        w.step()
        assertFalse(effect.config.commonAnimation)
        assertEquals(0, effect.animation.frame?.group)
        assertEquals(0, effect.animation.index)
    }

    @Test fun sharedSoundBorrowsTheSampleWhileChannelAndPanBelongToActor() {
        val w = fight(
            controller("PlaySnd", 0, "value=S0,0\nchannel=3") +
                controller("PlaySnd", 1, "value=F max(0,FVar(1)),0\nchannel=3") +
                controller("SndPan", 2, "channel=3\nabspan=-160") +
                controller("StopSnd", 3, "channel=3"),
            controller("PlaySnd", 1, "value=F0,0\nchannel=3"),
        )
        w.step()
        assertEquals(6, w.sounds.voices.single().remaining)
        assertFalse(w.sounds.voices.single().common)
        w.step()
        assertEquals(listOf(0, 1), w.sounds.voices.map { it.side })
        assertTrue(w.sounds.voices.all { it.common && it.remaining == 18 })
        assertEquals(listOf(-0.25, 0.25), w.sounds.voices.map { it.pan })
        assertTrue(w.presentation.all { it.common })
        w.step()
        assertEquals(listOf(-0.5, 0.25), w.sounds.voices.map { it.pan })
        w.step()
        assertEquals(1, w.sounds.voices.single().side)
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun superPauseUsesTheDefaultCommonFlashAndUnprefixedCommonSound() {
        val w = fight(right = controller("SuperPause", 0, "time=2\nsound=0,0\npos=12,-8"))
        w.step()
        val flash = w.pauses.flash!!
        assertTrue(flash.common)
        assertEquals(34 * 256, flash.x)
        assertEquals(-4 * 256, flash.y)
        assertEquals(777, flash.animation.frame?.group)
        assertEquals(30, flash.animation.action.number)
        assertTrue(w.sounds.voices.single().common)
        assertEquals(1, w.sounds.voices.single().side)
        w.step()
        assertEquals(1, flash.animation.frame?.sprite)
        w.step()
        assertNull(w.pauses.flash)
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun missingSharedMediaDoesNotCancelPauseOrPower() {
        val w = fight(controller("SuperPause", 0, "time=2\nanim=F30\nsound=0,0\npoweradd=30"), common = false)
        w.step()
        assertEquals(2, w.pauses.remaining)
        assertEquals(30, w.p1.power)
        assertNull(w.pauses.flash)
        assertTrue(w.sounds.voices.isEmpty())
        assertTrue(w.issues.any { it.contains("fightfx AIR") })
        assertTrue(w.issues.any { it.contains("common.snd") })
    }

    @Test fun disabledMediaAndFighterSoundKeepTheirExistingBehavior() {
        val w = fight(controller("SuperPause", 0, "time=1\nanim=-1\nsound=S0,0"))
        w.step()
        assertNull(w.pauses.flash)
        assertFalse(w.sounds.voices.single().common)
        assertEquals(6, w.sounds.voices.single().remaining)
        val silent = fight(controller("SuperPause", 0, "time=1\nsound=-1,0"))
        silent.step()
        assertTrue(silent.pauses.flash!!.common)
        assertTrue(silent.sounds.voices.isEmpty())
    }
}
