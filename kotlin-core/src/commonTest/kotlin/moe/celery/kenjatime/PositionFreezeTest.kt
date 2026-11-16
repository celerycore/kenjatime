package moe.celery.kenjatime

import kotlin.test.*

/** Per-tick motion control, independent of explicit placement, clocks and collision eligibility. */
class PositionFreezeTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,2\n0,1,0,0,2\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=1"
    private fun freeze(params: String="",trigger: String="1",state: Int=0)="[State $state, freeze]\ntype=PosFreeze\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("position freeze",air,
        "$idle\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="",other: String="")=DeterministicFight(
        FightingCharacter(definition(extra),1),FightingCharacter(definition(other),2))
    @Test fun omittedValueStopsBothVelocityAxesWithoutChangingVelocity() {
        val w=fight(freeze());w.p1.velX=512;w.p1.velY=-256;w.step()
        assertTrue(w.p1.positionFrozen);assertEquals(0,w.p1.posX);assertEquals(0,w.p1.posY)
        assertEquals(512,w.p1.velX);assertEquals(-256,w.p1.velY)
    }
    @Test fun zeroExplicitlyAllowsMotionWhileNonzeroValuesFreeze() {
        for(raw in listOf("0",".5","-2")) {
            val w=fight(freeze("value=$raw"));w.p1.velX=256;w.step()
            assertEquals(raw!="0",w.p1.positionFrozen);assertEquals(if(raw=="0")256 else 0,w.p1.posX)
        }
    }
    @Test fun freezeExpiresOnTheNextTickUnlessReasserted() {
        val w=fight(freeze(trigger="Time=0"));w.p1.velX=512;w.step();assertEquals(0,w.p1.posX)
        w.step();assertFalse(w.p1.positionFrozen);assertEquals(512,w.p1.posX)
    }
    @Test fun timeAnimationAndAuthoredVelocityUpdatesContinueWhileFrozen() {
        val w=fight("${freeze()}\n[State 0, accelerate]\ntype=VelAdd\ntrigger1=1\ny=.5")
        w.p1.velX=512;w.p1.velY=-256;repeat(3){w.step()}
        assertEquals(0,w.p1.posX);assertEquals(0,w.p1.posY);assertEquals(128,w.p1.velY)
        assertEquals(3,w.p1.timeInState);assertEquals(3L,w.p1.animation!!.elapsed)
    }
    @Test fun explicitPosSetAndPosAddStillPlaceTheActor() {
        val w=fight("[State 0, set]\ntype=PosSet\ntrigger1=Time=0\nx=4\ny=-3\n"+
            "[State 0, add]\ntype=PosAdd\ntrigger1=Time=0\nx=2\ny=1\n${freeze(trigger="Time=0")}")
        w.p1.velX=256;w.p1.velY=256;w.step();assertEquals(1536,w.p1.posX);assertEquals(-512,w.p1.posY)
        w.step();assertEquals(1792,w.p1.posX);assertEquals(-256,w.p1.posY)
    }
    @Test fun aLaterPosFreezeZeroCancelsAnEarlierFreezeInTheSameTick() {
        val w=fight("${freeze()}\n${freeze("value=0")}");w.p1.velX=256;w.step()
        assertFalse(w.p1.positionFrozen);assertEquals(256,w.p1.posX)
    }
    @Test fun nestedExpressionsReadTheExecutingActorsVariables() {
        val w=fight(freeze("value=ifelse(var(0),max(0,.5),0)"));w.p1.velX=256;w.p1.vars[0]=1
        w.step();assertEquals(0,w.p1.posX);w.p1.vars[0]=0;w.step();assertEquals(256,w.p1.posX)
    }
    @Test fun malformedRequestsPreserveAnEarlierValidFlag() {
        for(params in listOf("value=unknown","value=1/0","value=1,0","x=1")) {
            val w=fight("${freeze()}\n${freeze(params)}");w.p1.velX=256;w.step()
            assertTrue(w.p1.positionFrozen);assertEquals(0,w.p1.posX)
            assertTrue(w.issues.any{it.startsWith("Invalid PosFreeze:")})
        }
    }
    @Test fun persistentZeroFreezesOnceAndRearmsOnStateReentry() {
        val w=fight(freeze("persistent=0"));w.p1.velX=256
        w.step();w.step();assertEquals(256,w.p1.posX);w.p1.changeState(0);w.step()
        assertEquals(256,w.p1.posX);assertTrue(w.p1.positionFrozen)
    }
    @Test fun ignorehitpauseControlsFlagExecutionWithoutAdvancingPausedClocks() {
        for(ignore in 0..1) {
            val w=fight(freeze("ignorehitpause=$ignore"));w.p1.velX=256;w.p1.hitPauseLeft=2
            repeat(2){w.step();assertEquals(ignore==1,w.p1.positionFrozen);assertEquals(0,w.p1.posX);assertEquals(0,w.p1.timeInState)}
            w.step();assertTrue(w.p1.positionFrozen);assertEquals(0,w.p1.posX);assertEquals(1,w.p1.timeInState)
        }
    }
    @Test fun anExpiredFlagIsNotKeptJustBecauseHitpauseStarts() {
        val w=fight(freeze(trigger="var(0)"));w.p1.vars[0]=1;w.p1.velX=256;w.step()
        w.p1.vars[0]=0;w.p1.hitPauseLeft=2;repeat(2){w.step();assertFalse(w.p1.positionFrozen);assertEquals(0,w.p1.posX)}
        w.step();assertEquals(256,w.p1.posX)
    }
    @Test fun stateTransitionsDoNotMakeTheFlagPermanent() {
        val w=fight("${freeze(trigger="Time=0")}\n[State 0, next]\ntype=ChangeState\ntrigger1=Time=0\nvalue=200\n"+
            "[Statedef 200]\ntype=S\nphysics=N\nanim=0")
        w.p1.velX=256;w.step();assertEquals(200,w.p1.stateNo);assertTrue(w.p1.positionFrozen)
        w.step();assertFalse(w.p1.positionFrozen);assertEquals(256,w.p1.posX)
    }
    @Test fun aFrozenPlayerPushesOnlyTheOtherPlayerWithinTheConfiguredArena() {
        for(side in 1..2) {
            val w=fight(if(side==1)freeze() else "",if(side==2)freeze() else "")
            w.configureArena(-100,100,push=true);w.p1.posX=-5*256;w.p2.posX=5*256;w.step()
            assertEquals(if(side==1)-5*256 else -25*256,w.p1.posX)
            assertEquals(if(side==2)5*256 else 25*256,w.p2.posX)
        }
    }
    @Test fun twoFrozenPlayersKeepTheirPositionsWhenTheirBodiesOverlap() {
        val w=fight(freeze(),freeze());w.configureArena(-100,100,push=true)
        w.p1.posX=-5*256;w.p2.posX=5*256;w.step()
        assertEquals(-5*256,w.p1.posX);assertEquals(5*256,w.p2.posX)
    }
    @Test fun aPinnedOpponentCannotDisplaceTheFrozenActorPastItsHoldPosition() {
        val w=fight(freeze());w.configureArena(-20,20,push=true)
        w.p1.posX=-5*256;w.p2.posX=5*256;w.step()
        assertEquals(-5*256,w.p1.posX);assertEquals(20*256,w.p2.posX)
    }
    @Test fun arenaGravityUpdatesVelocityWhilePositionRemainsFrozen() {
        val w=fight("[Movement]\nyaccel=.5\n[Statedef 40]\ntype=A\nphysics=A\nanim=0\n"+
            freeze(trigger="var(0)",state=40))
        w.configureArena(-100,100,push=false);w.p1.changeState(40);w.p1.posY=-10*256;w.p1.velY=-2*256;w.p1.vars[0]=1
        repeat(3){w.step()};assertEquals(-10*256,w.p1.posY);assertEquals(-128,w.p1.velY)
        w.p1.vars[0]=0;w.step();assertEquals(-10*256-128,w.p1.posY);assertEquals(0,w.p1.velY)
    }
    @Test fun freezeDoesNotDisableArenaBounds() {
        val w=fight(freeze());w.configureArena(-100,100,push=false);w.p1.posX=200*256;w.step()
        assertEquals(100*256,w.p1.posX);assertTrue(w.p1.positionFrozen)
    }
    @Test fun frozenAttackersStillExecuteHitDefsAndAgeMoveContact() {
        val w=fight("[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n${freeze(state=200)}\n"+
            "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=10")
        w.p1.changeState(200);w.p1.velX=256;w.p2.posX=5*256;w.step()
        assertEquals(990,w.p2.life);assertEquals(0,w.p1.posX);assertEquals(1,w.p1.moveHitTime)
        repeat(2){w.step()};assertEquals(3,w.p1.moveHitTime);assertEquals(990,w.p2.life)
    }
    @Test fun frozenVictimsRemainHittable() {
        val w=fight("[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n"+
            "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=10",freeze())
        w.p1.changeState(200);w.p2.posX=5*256;w.p2.velX=256;w.step()
        assertTrue(w.p2.positionFrozen);assertEquals(990,w.p2.life);assertEquals(5*256,w.p2.posX)
    }
    @Test fun helperFreezeIsIndependentAndBindingsStillFollowTheirAnchor() {
        val extra="[Statedef 200]\ntype=S\nphysics=N\nanim=0\n${freeze(state=200)}\n"+
            "[State 200, bind]\ntype=BindToParent\ntrigger1=Time=0\ntime=-1\npos=2,3"
        val w=fight(extra);w.entities.add(listOf(EntityRequest.Helper(w.p1,9,200,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor;helper.velX=10*256;w.p1.velX=256
        w.step();assertTrue(helper.positionFrozen);assertFalse(w.p1.positionFrozen)
        assertEquals(3*256,helper.posX);assertEquals(3*256,helper.posY)
        w.step();assertEquals(4*256,helper.posX)
    }
    @Test fun borrowedCoordinateBanksDoNotScaleTheBooleanFlagOrRetainedVelocity() {
        val w=fight();val bank=FightingCharacter(definition("[Statedef 200]\ntype=S\nphysics=N\nanim=0\n"+
            freeze("value=var(0)",state=200),640),3)
        w.p1.vars[0]=1;w.p1.velX=256;w.p1.enterAuthoredState(200,bank,w.issues);w.step()
        assertTrue(w.p1.positionFrozen);assertEquals(0,w.p1.posX);assertEquals(256,w.p1.velX)
        w.p1.vars[0]=0;w.step();assertEquals(256,w.p1.posX)
    }
    @Test fun queriesAndPresentationCannotFreezeOrResumeSimulation() {
        val w=fight(freeze());w.p1.velX=256;w.step();val before=w.checksum();val time=w.p1.timeInState
        repeat(8){CorePresentationPlanner.snapshot(w,12)}
        assertTrue(w.p1.positionFrozen);assertEquals(before,w.checksum());assertEquals(time,w.p1.timeInState)
    }
}
