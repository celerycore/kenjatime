package moe.celery.kenjatime

import kotlin.test.*

/** Opt-in arena fallback contracts; these do not certify native common states. */
class FallbackReactionTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nctrl=1\nanim=0"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript(
        "fallback",air,"$idle\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="",arena: Boolean=true,ground: Int=0,width: Int=320): DeterministicFight {
        val d=definition(extra,width)
        return DeterministicFight(FightingCharacter(d,1),FightingCharacter(d,2)).also {
            it.p1.posX=-100*Fixed.ONE;it.p2.posX=100*Fixed.ONE
            it.p1.posY=ground*Fixed.ONE;it.p2.posY=ground*Fixed.ONE
            if(arena)it.configureArena(-250,250,ground,push=false)
        }
    }
    private fun launch(w: DeterministicFight,time: Int=3,pause: Int=0,damage: Int=10)=w.p2.receiveHit(
        HitDefinition(damage=damage,velocityX=2*Fixed.ONE,velocityY=-4*Fixed.ONE,
            hitTime=time,defenderPause=pause),true,attacker=w.p1)

    @Test fun launchedFallbackReceivesGravityLandsAndStopsInsteadOfDriftingForever() {
        val w=fight();launch(w)
        assertTrue(w.p2.fallbackHitReaction);assertEquals("A",w.p2.stateType)
        var airborne=false
        repeat(120) {
            w.step();airborne=airborne || w.p2.posY<0
            assertTrue(w.p2.posY<=0,"Fallback must stay above the arena floor")
        }
        assertTrue(airborne);assertEquals(990,w.p2.life)
        assertEquals(0,w.p2.posY);assertEquals(0,w.p2.velX);assertEquals(0,w.p2.velY)
        assertEquals(0,w.p2.stateNo);assertTrue(w.p2.control);assertFalse(w.p2.fallbackHitReaction)
        val x=w.p2.posX
        repeat(120){w.step()};assertEquals(x,w.p2.posX)
    }

    @Test fun expiredHitstunDoesNotReturnAnAirborneFallbackToStandingIdle() {
        val w=fight();launch(w,time=1)
        w.step()
        assertEquals(0,w.p2.hitStunLeft);assertTrue(w.p2.posY<0)
        assertEquals(5000,w.p2.stateNo);assertEquals("A",w.p2.stateType);assertFalse(w.p2.control)
        repeat(100){w.step()};assertEquals(0,w.p2.stateNo)
    }

    @Test fun landingDoesNotSkipRemainingHitstunOrEnterAuthoredJumpLandingState() {
        val w=fight("[Statedef 52]\ntype=S\nanim=0\nctrl=1")
        w.p2.receiveHit(HitDefinition(velocityY=-Fixed.ONE,hitTime=50),true)
        repeat(20){w.step()}
        assertEquals(0,w.p2.posY);assertTrue(w.p2.hitStunLeft>0)
        assertEquals(5000,w.p2.stateNo);assertEquals("S",w.p2.stateType)
        assertFalse(w.p2.control)
        repeat(30){w.step()};assertEquals(0,w.p2.stateNo);assertTrue(w.p2.control)
    }

    @Test fun groundedFallbackStopsHorizontalKnockbackWhenStunExpires() {
        val w=fight()
        w.p2.receiveHit(HitDefinition(velocityX=3*Fixed.ONE,hitTime=4),true)
        repeat(3){w.step();assertEquals(5000,w.p2.stateNo)}
        w.step();assertEquals(0,w.p2.stateNo);assertEquals(0,w.p2.velX)
        assertEquals(112*Fixed.ONE,w.p2.posX)
    }

    @Test fun hitpauseFreezesMotionGravityAndRecoveryIncludingFinalPausedTick() {
        val w=fight();launch(w,time=1,pause=3)
        repeat(3) {
            w.step();assertEquals(0,w.p2.posY);assertEquals(-4*Fixed.ONE,w.p2.velY)
            assertEquals(1,w.p2.hitStunLeft);assertEquals(5000,w.p2.stateNo)
        }
        assertEquals(0,w.p2.hitPauseLeft);assertTrue(w.p2.hitPauseThisTick)
        w.step();assertEquals(-4*Fixed.ONE,w.p2.posY);assertTrue(w.p2.velY>-4*Fixed.ONE)
    }

    @Test fun nonzeroArenaGroundIsUsedForLandingAndRecovery() {
        val w=fight(ground=40);launch(w)
        repeat(100){w.step();assertTrue(w.p2.posY<=40*Fixed.ONE)}
        assertEquals(40*Fixed.ONE,w.p2.posY);assertEquals(0,w.p2.stateNo)
    }

    @Test fun headlessSimulationRetainsItsExistingUnconfiguredMotionPolicy() {
        val w=fight(arena=false);launch(w,time=1)
        w.step();assertEquals(0,w.p2.stateNo);assertEquals(-4*Fixed.ONE,w.p2.velY)
        repeat(20){w.step()}
        assertEquals(-84*Fixed.ONE,w.p2.posY)
        assertNull(w.arena)
    }

    @Test fun explicitOwnHitStateKeepsAuthoredPhysicsAndDoesNotUseFallback() {
        val w=fight("[Statedef 5000]\ntype=A\nphysics=N\nmovetype=H\nanim=0")
        launch(w,time=1)
        assertFalse(w.p2.fallbackHitReaction)
        repeat(20){w.step()}
        assertEquals(5000,w.p2.stateNo);assertEquals(-80*Fixed.ONE,w.p2.posY)
        assertEquals(-4*Fixed.ONE,w.p2.velY)
    }

    @Test fun foreignReactionStateKeepsItsAuthorsPhysics() {
        val w=fight("[Statedef 900]\ntype=A\nphysics=N\nmovetype=H\nanim=0")
        w.p2.receiveHit(HitDefinition(velocityY=-4*Fixed.ONE,hitTime=1,p2State=900,stateOwner=w.p1),true,attacker=w.p1)
        assertFalse(w.p2.fallbackHitReaction);assertSame(w.p1,w.p2.stateOwner)
        repeat(20){w.step()}
        assertEquals(900,w.p2.stateNo);assertEquals(-80*Fixed.ONE,w.p2.posY)
    }

    @Test fun hitOverrideReactionKeepsControlOfItsOwnGravityAndVelocity() {
        val w=fight("[Statedef 700]\ntype=A\nphysics=N\nmovetype=H\nanim=0\nvelset=0,-2")
        val c=MugenCnsParser.parse("[Statedef 0]\n[State 0, override]\ntype=HitOverride\ntrigger1=1\nattr=SCA,AA\nstateno=700\ntime=-1")
            .getValue(0).controllers.single()
        w.p2.hitOverrides.execute(w.p2,c,w.issues)
        launch(w,time=1);repeat(20){w.step()}
        assertFalse(w.p2.fallbackHitReaction);assertEquals(700,w.p2.stateNo)
        assertEquals(-40*Fixed.ONE,w.p2.posY);assertEquals(-2*Fixed.ONE,w.p2.velY)
    }

    @Test fun bindingsKeepPositionAndGravityAuthorityUntilReleased() {
        val w=fight();launch(w,time=1)
        w.p2.bindTo(w.p1,10*Fixed.ONE,-20*Fixed.ONE,-1)
        repeat(10){w.step()}
        assertEquals(-20*Fixed.ONE,w.p2.posY);assertEquals(-4*Fixed.ONE,w.p2.velY)
        assertEquals(5000,w.p2.stateNo)
        w.p2.releaseBinding();repeat(100){w.step()}
        assertEquals(0,w.p2.posY);assertEquals(0,w.p2.stateNo)
    }

    @Test fun missingKoReactionFallsToGroundAndStaysDeadWithoutSliding() {
        val w=fight();launch(w,damage=1000)
        assertEquals(5150,w.p2.stateNo);assertTrue(w.p2.fallbackHitReaction)
        repeat(120){w.step()}
        assertEquals(0,w.p2.life);assertEquals(5150,w.p2.stateNo)
        assertEquals(0,w.p2.posY);assertEquals(0,w.p2.velX);assertEquals(0,w.p2.velY)
        assertFalse(w.p2.control)
    }

    @Test fun missingAirGuardLandsWithoutDroppingItsRemainingGuardTime() {
        val w=fight("[Statedef 40]\ntype=A\nphysics=N\nanim=0")
        w.p2.changeState(40);w.p2.posY=-10*Fixed.ONE
        w.p2.receiveHit(HitDefinition(guardDamage=2,guardHitTime=50,guardVelocityX=Fixed.ONE),true,guarded=true)
        assertEquals(152,w.p2.stateNo)
        repeat(20){w.step()}
        assertEquals(0,w.p2.posY);assertEquals(152,w.p2.stateNo);assertTrue(w.p2.hitStunLeft>0)
        repeat(30){w.step()};assertEquals(0,w.p2.stateNo);assertEquals(0,w.p2.velX)
    }

    @Test fun missingCrouchGuardPreservesCrouchedTypeDuringItsReaction() {
        val w=fight("[Statedef 10]\ntype=C\nphysics=N\nanim=0")
        w.p2.changeState(10)
        w.p2.receiveHit(HitDefinition(guardHitTime=4),true,guarded=true)
        w.step();assertEquals(151,w.p2.stateNo);assertEquals("C",w.p2.stateType)
        repeat(3){w.step()};assertEquals(0,w.p2.stateNo);assertEquals("S",w.p2.stateType)
    }

    @Test fun recoveryHonorsAuthoredIdleVelocityAndExplicitControl() {
        val w=fight("[Statedef 0]\ntype=S\nphysics=N\nanim=0\nctrl=0\nvelset=1,0")
        w.p2.receiveHit(HitDefinition(velocityX=3*Fixed.ONE,hitTime=1),true)
        w.step()
        assertEquals(0,w.p2.stateNo);assertEquals(Fixed.ONE,w.p2.velX)
        assertFalse(w.p2.control);assertFalse(w.p2.fallbackHitReaction)
    }

    @Test fun equivalentCharacterCoordinateSpacesProduceTheSameFallbackTrajectory() {
        fun replay(width: Int): List<String> {
            val w=fight("[Movement]\nyaccel=${0.5*width/320}",width=width)
            launch(w,pause=2)
            return (0 until 120).map { w.step();w.checksum() }
        }
        assertEquals(replay(320),replay(640))
    }

    @Test fun scriptStateChangesCanExitFallbackWithoutArenaForcingThemBack() {
        val w=fight("[Statedef 800]\ntype=A\nphysics=N\nanim=0\nvelset=0,-1")
        launch(w);assertTrue(w.p2.enterAuthoredState(800,w.p2,w.issues))
        repeat(20){w.step()}
        assertFalse(w.p2.fallbackHitReaction);assertEquals(800,w.p2.stateNo)
        assertEquals(-20*Fixed.ONE,w.p2.posY)
    }

    @Test fun configuringArenaAfterImpactCanResolveAnExistingFallback() {
        val w=fight(arena=false);launch(w,time=30)
        w.step();w.configureArena(-250,250,push=false)
        repeat(120){w.step()}
        assertEquals(0,w.p2.posY);assertEquals(0,w.p2.stateNo);assertEquals(0,w.p2.velY)
    }

    @Test fun largeDownwardStepClampsToFloorWithoutBypassingLongHitstun() {
        val w=fight();w.p2.posY=-Fixed.ONE
        w.p2.receiveHit(HitDefinition(airVelocityY=100*Fixed.ONE,airHitTime=50,hitTime=50,
            velocityY=100*Fixed.ONE),true)
        w.step();assertEquals(0,w.p2.posY);assertEquals(0,w.p2.velY)
        assertEquals(5000,w.p2.stateNo);assertTrue(w.p2.hitStunLeft>0)
    }

    @Test fun skippedPresentationCannotChangeFallbackClocksOrRecovery() {
        fun replay(render: Boolean): List<String> {
            val w=fight();launch(w,pause=3)
            return (0 until 120).map {
                w.step()
                if(render)repeat(3){CorePresentationPlanner.snapshot(w,12)}
                w.checksum()+":"+w.p2.fallbackHitReaction+":"+w.p2.hitStunLeft
            }
        }
        assertEquals(replay(false),replay(true))
    }
}
