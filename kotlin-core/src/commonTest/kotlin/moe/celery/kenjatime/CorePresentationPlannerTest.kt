package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

/** No browser JavaScript should decide MUGEN health, camera or drop ticks. */
class CorePresentationPlannerTest {
    @Test fun frameSkippingOnlyChangesPresentationAndNeverFightTicks() {
        val f=FighterDefinition("fighter")
        val fight=DeterministicFight(FightingCharacter(f,1),FightingCharacter(f,2))
        assertEquals(60,CorePresentationPlanner.targetFps(0))
        assertEquals(60,CorePresentationPlanner.targetFps(1))
        assertEquals(30,CorePresentationPlanner.targetFps(2))
        assertEquals(20,CorePresentationPlanner.targetFps(5))
        assertEquals(12,CorePresentationPlanner.targetFps(12))
        assertEquals(12,CorePresentationPlanner.targetFps(500))
        repeat(600) { tick ->
            fight.step()
            val json=CorePresentationPlanner.snapshot(fight,
                if(tick % 3==0) 120 else 0)
            assertTrue(json.contains("\"frame\":${tick+1}"),"Kotlin match tick was lost")
        }
        assertEquals(600L,fight.frame)
    }

    @Test fun fightingCharacterHealthUsesAuthoredMaxLifeNotOneThousand() {
        val p1=FightingCharacter(FighterDefinition("A",maxLife=1500),1)
        val p2=FightingCharacter(FighterDefinition("B",maxLife=250),2)
        val fight=DeterministicFight(p1,p2)
        fight.configureArena(-250,250)
        assertTrue(CorePresentationPlanner.snapshot(fight,0)
            .contains("\"health\":[376,376]"))
        p1.life=750;p2.life=125
        assertTrue(CorePresentationPlanner.snapshot(fight,12)
            .contains("\"health\":[188,188]"))
        assertEquals(0,CorePresentationPlanner.healthBarWidth(-900,1500))
        assertEquals(376,CorePresentationPlanner.healthBarWidth(90000,1500))
        assertEquals(0,CorePresentationPlanner.healthBarWidth(10,0))
    }

    @Test fun Nu13DefLocalcoordIsParsedInKotlinAndChangesVisualScale() {
        val nu=FighterDefinition.fromScript("Nu-13",
            "[Begin Action 0]\n0,0,0,0,-1","",
            "","[Info]\nlocalcoord = 1008,756;960,720")
        val standard=FighterDefinition.fromScript("Tomoka",
            "[Begin Action 0]\n0,0,0,0,-1","","",
            "[Info]\nname = \"Tomoka\"")
        assertEquals(1008,nu.localCoordWidth)
        assertEquals(756,nu.localCoordHeight)
        assertEquals(320,standard.localCoordWidth)
        assertEquals(240,standard.localCoordHeight)
        val fight=DeterministicFight(FightingCharacter(nu,1),
            FightingCharacter(standard,2))
        fight.configureArena(-250,250)
        val json=CorePresentationPlanner.snapshot(fight,0)
        assertTrue(json.contains("\"spriteScaleX\":0.317460317"),json)
        assertTrue(json.contains("\"spriteScaleY\":0.317460317"),json)
        assertTrue(json.contains("\"spriteScaleX\":1.0"),json)
    }

    @Test fun KotlinCameraAndSpriteAxesDriveVisualPosition() {
        val a=FightingCharacter(FighterDefinition("A"),1)
        val b=FightingCharacter(FighterDefinition("B"),2)
        val fight=DeterministicFight(a,b)
        fight.configureArena(-250,250)
        a.posX=100*Fixed.ONE
        a.posY=-60*Fixed.ONE
        assertEquals(620.0,CorePresentationPlanner.pixelX(a.posX,fight.camera))
        assertEquals(369.0,CorePresentationPlanner.pixelY(a.posY,fight.camera))
        val snapshot=CorePresentationPlanner.snapshot(fight,4)
        assertTrue(snapshot.contains("\"x\":620.0"),snapshot)
        assertTrue(snapshot.contains("\"y\":369.0"),snapshot)
        assertTrue(snapshot.contains("\"targetFps\":30"),snapshot)
        assertTrue(snapshot.contains("\"helpers\":0"),snapshot)
        assertTrue(snapshot.contains("\"projectiles\":0"),snapshot)
        assertTrue(snapshot.contains("\"side\":0"),snapshot)
        assertTrue(snapshot.contains("\"side\":1"),snapshot)
    }
}
