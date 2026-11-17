package moe.celery.kenjatime

import kotlin.test.*

class ScreenBoundTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=-40,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=0"
    private fun c(params: String="",trigger: String="1",state: Int=0)=
        "[State $state, bounds]\ntype=ScreenBound\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("bounds",air,"$idle\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(a: String="",b: String=""): DeterministicFight {
        val w=DeterministicFight(FightingCharacter(definition(a),1),FightingCharacter(definition(b),2))
        w.configureArena(-100,100,push=false);w.p1.posX=-50*256;w.p2.posX=50*256;return w
    }
    private fun execute(actor: FightingCharacter,params: String="") {
        val ctl=MugenCnsParser.parse("$idle\n${c(params)}").getValue(0).controllers.single()
        CoreScreenBounds.execute(actor,ctl,actor.world!!.issues)
    }
    private val helperState="[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"
    private fun helper(w: DeterministicFight): FightingCharacter {
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,700,0,0,1,false,0)),w.issues)
        return w.entities.helpers.last().actor
    }
    private fun camera()=MugenCamera(CameraConfig(-2000.0,2000.0,-2000.0,0.0,
        width=200,height=200,tension=50.0))
    @Test fun rootsDefaultToBoundsAndBothCameraAxesWhileHelpersOptOut() {
        val w=fight(helperState);val h=helper(w)
        for(p in listOf(w.p1,w.p2)) {assertTrue(p.screenBoundEnabled);assertTrue(p.moveCameraX);assertTrue(p.moveCameraY)}
        assertFalse(h.screenBoundEnabled);assertFalse(h.moveCameraX);assertFalse(h.moveCameraY)
    }
    @Test fun omittedParametersDisableAllThreeFlags() {
        val w=fight();execute(w.p1);assertEquals(CoreScreenBound(false,false,false),w.p1.screenBoundOverride)
    }
    @Test fun dimensionlessExpressionsUseExecutingVariablesAndNonzeroBooleans() {
        val w=fight(c("value=ifelse(var(0),-.5,0)\nmovecamera=max(var(1),2),min(var(2),0)"))
        w.p1.vars[0]=1;w.p1.vars[1]=0;w.p1.vars[2]=-3;w.step()
        assertEquals(CoreScreenBound(true,true,true),w.p1.screenBoundOverride)
    }
    @Test fun aSingleMovecameraComponentDefaultsYToFalse() {
        val w=fight();execute(w.p1,"movecamera=1");assertEquals(CoreScreenBound(false,true,false),w.p1.screenBoundOverride)
    }
    @Test fun aLaterRequestReplacesAllFlagsIncludingOmittedOnes() {
        val w=fight();execute(w.p1,"value=1\nmovecamera=1,1");execute(w.p1,"movecamera=0,1")
        assertEquals(CoreScreenBound(false,false,true),w.p1.screenBoundOverride)
    }
    @Test fun invalidRequestsPreserveTheWholeEarlierAssertion() {
        for(params in listOf("value=unknown","value=1/0","value=1,2","movecamera=","movecamera=,1",
            "movecamera=1,","movecamera=1,2,3","value=0\nmovecamera=1,unknown","movecamera=1,1/0","redirectid=1")) {
            val w=fight();execute(w.p1,"value=1\nmovecamera=1,1");val prior=w.p1.screenBoundOverride
            execute(w.p1,params);assertSame(prior,w.p1.screenBoundOverride,params)
            assertTrue(w.issues.any { it.startsWith("Invalid ScreenBound:") },params)
        }
    }
    @Test fun boundsDisableExpiresBeforeTheNextActiveControllerPass() {
        val w=fight(c(trigger="Time=0"));w.p1.posX=-150*256;w.step()
        assertEquals(-150*256,w.p1.posX);assertFalse(w.p1.screenBoundEnabled);w.step()
        assertEquals(-100*256,w.p1.posX);assertTrue(w.p1.screenBoundEnabled);assertTrue(w.p1.moveCameraX)
    }
    @Test fun persistentZeroRunsOnceAndRearmsOnStateReentry() {
        val w=fight(c("persistent=0"));w.step();assertFalse(w.p1.screenBoundEnabled)
        w.step();assertTrue(w.p1.screenBoundEnabled);w.p1.changeState(0);w.step();assertFalse(w.p1.screenBoundEnabled)
    }
    @Test fun assertionSurvivesHitpauseAndExpiresOnTheFirstActiveTick() {
        val w=fight(c(trigger="Time=0"));w.p1.posX=-150*256;w.step();w.p1.hitPauseLeft=2
        repeat(2){w.step();assertFalse(w.p1.screenBoundEnabled);assertFalse(w.p1.moveCameraX);assertEquals(-150*256,w.p1.posX)}
        w.step();assertTrue(w.p1.screenBoundEnabled);assertEquals(-100*256,w.p1.posX)
    }
    @Test fun ignorehitpauseCanUpdateTheAssertionOnAFrozenActor() {
        val w=fight(c("value=var(0)\nmovecamera=0,1\nignorehitpause=1"));w.p1.hitPauseLeft=2;w.p1.vars[0]=1
        w.step();assertTrue(w.p1.screenBoundEnabled);assertFalse(w.p1.moveCameraX);assertTrue(w.p1.moveCameraY)
        w.p1.vars[0]=0;w.step();assertFalse(w.p1.screenBoundEnabled);assertEquals(0,w.p1.timeInState)
    }
    @Test fun disablingBoundsPreservesVelocityClocksAndAnimation() {
        val w=fight(c("value=0"));w.p1.posX=-100*256;w.p1.velX=-3*256;w.step()
        assertEquals(-103*256,w.p1.posX);assertEquals(-3*256,w.p1.velX);assertEquals(1,w.p1.timeInState)
        assertEquals(1L,w.p1.animation!!.elapsed)
    }
    @Test fun disablingBoundsDoesNotDisableGravityOrLanding() {
        val w=fight("[Statedef 40]\ntype=A\nphysics=A\nanim=0\n"+c(state=40))
        w.p1.changeState(40);w.p1.posX=-150*256;w.p1.posY=-256;w.p1.velY=512;w.step()
        assertEquals(-150*256,w.p1.posX);assertEquals(0,w.p1.posY);assertEquals(0,w.p1.velY);assertEquals(0,w.p1.stateNo)
    }
    @Test fun disablingBoundsIgnoresWidthEdgeInsetsButRetainsBodyWidths() {
        val w=fight(c()+"\n[State 0, insets]\ntype=Width\ntrigger1=1\nedge=80,90\nplayer=10,20")
        w.p1.posX=-150*256;w.step();assertEquals(-150*256,w.p1.posX)
        assertEquals(25*256,w.p1.playerWidthWorld(1));assertEquals(Int.MIN_VALUE to Int.MAX_VALUE,w.arena!!.horizontalLimits(w.p1))
    }
    @Test fun enablingBoundsUsesFacingRelativeEdgeInsets() {
        for(face in listOf(false,true)) {
            val w=fight(c("value=1")+"\n[State 0, insets]\ntype=Width\ntrigger1=1\nedge=10,20")
            w.p1.facingRight=face;w.p1.posX=-150*256;w.step()
            assertEquals((if(face)-80 else -90)*256,w.p1.posX)
        }
    }
    @Test fun pushingCanMoveAnUnboundActorBeyondTheArenaEdge() {
        val w=fight(c("value=0"));w.configureArena(-100,100,push=true)
        w.p1.posX=-99*256;w.p2.posX=-98*256;w.step()
        assertTrue(w.p1.posX < -100*256);assertEquals(30*256,w.p2.posX-w.p1.posX)
    }
    @Test fun boundActorsStillClampWhenTheirOpponentDisablesBounds() {
        val w=fight(c("value=0"));w.p1.posX=-150*256;w.p2.posX=150*256;w.step()
        assertEquals(-150*256,w.p1.posX);assertEquals(100*256,w.p2.posX)
    }
    @Test fun targetBindingsRemainAuthoritativeEvenWhenBoundsAreEnabled() {
        val w=fight(c("value=1"));w.p1.bindTo(w.p2,200*256,0,-1);w.step()
        assertEquals(250*256,w.p1.posX);assertEquals(50*256,w.p2.posX)
    }
    @Test fun unconfiguredArenasDoNotInventPhysicalConstraintsOrACamera() {
        val w=DeterministicFight(FightingCharacter(definition(c("value=1")),1),FightingCharacter(definition(),2))
        w.p1.posX=500*256;w.step();assertEquals(500*256,w.p1.posX);assertNull(w.camera);assertTrue(w.issues.isEmpty())
    }
    @Test fun helperBoundsAreOptInAndExpireBackToTheHelperDefault() {
        val w=fight(helperState+c("value=1","Time=0",700));val h=helper(w);h.posX=150*256;w.step()
        assertEquals(100*256,h.posX);assertTrue(h.screenBoundEnabled)
        h.posX=150*256;w.step();assertEquals(150*256,h.posX);assertFalse(h.screenBoundEnabled)
    }
    @Test fun destroyedOrBoundHelpersAreNotClamped() {
        for(destroyed in listOf(false,true)) {
            val w=fight(helperState+c("value=1",state=700));val h=helper(w)
            if(destroyed)h.destroyed=true else h.bindTo(w.p1,300*256,0,-1)
            h.posX=250*256;w.step();assertTrue(h.posX>100*256)
        }
    }
    @Test fun aHelperBoundsRequestDoesNotChangeItsRootOrSibling() {
        val w=fight(helperState);val a=helper(w);val b=helper(w);execute(a,"value=1\nmovecamera=1,1")
        assertTrue(a.screenBoundEnabled);assertFalse(b.screenBoundEnabled);assertTrue(w.p1.screenBoundEnabled)
        assertFalse(b.moveCameraX);assertNull(w.p1.screenBoundOverride)
    }
    @Test fun xAndYCameraTrackingAreIndependentFromBoundsAndFromEachOther() {
        val w=fight();val cam=camera();w.p1.posX=100*256;w.p2.posX=500*256;w.p1.posY=-600*256;w.p2.posY=-200*256
        execute(w.p1,"value=0\nmovecamera=1,0");execute(w.p2,"value=1\nmovecamera=0,1");cam.update(w.p1,w.p2)
        assertEquals(15.0,cam.x);assertEquals(-30.0,cam.y);assertEquals(.975,cam.zoom,1e-10)
    }
    @Test fun anUntrackedDistantOpponentDoesNotAffectCenterOrZoom() {
        val w=fight();val cam=camera();w.p1.posX=100*256;w.p1.posY=-200*256
        w.p2.posX=5000*256;w.p2.posY=-5000*256;execute(w.p2)
        cam.update(w.p1,w.p2);assertEquals(15.0,cam.x);assertEquals(-30.0,cam.y);assertEquals(.975,cam.zoom,1e-10)
    }
    @Test fun anUntrackedAxisHoldsItsPreviousPositionEvenWhileZoomChanges() {
        val w=fight();val cam=camera();cam.update(w.p1,w.p2);val y=cam.y
        execute(w.p1,"movecamera=1,0");execute(w.p2,"movecamera=1,0");w.p1.posY=-1500*256
        cam.update(w.p1,w.p2);assertEquals(y,cam.y)
    }
    @Test fun noTrackedActorsFreezeBothCameraPositionAndZoom() {
        val w=fight();val cam=camera();w.p2.posX=1000*256;cam.update(w.p1,w.p2)
        val before=Triple(cam.x,cam.y,cam.zoom);execute(w.p1);execute(w.p2)
        repeat(20){cam.update(w.p1,w.p2)};assertEquals(before,Triple(cam.x,cam.y,cam.zoom))
    }
    @Test fun optedInHelpersParticipateInCameraExtentsAndDestroyedHelpersDoNot() {
        val w=fight(helperState);val cam=camera();val h=helper(w);h.posX=1000*256
        execute(w.p1);execute(w.p2);execute(h,"movecamera=1,0");cam.update(w.p1,w.p2,w.entities.helpers)
        assertEquals(150.0,cam.x);val before=cam.x;h.destroyed=true;cam.update(w.p1,w.p2,w.entities.helpers);assertEquals(before,cam.x)
    }
    @Test fun defaultHelpersDoNotInfluenceCameraExtentsOrZoom() {
        val a=fight(helperState);val b=fight(helperState);val ca=camera();val cb=camera()
        helper(a).posX=5000*256;ca.update(a.p1,a.p2,a.entities.helpers);cb.update(b.p1,b.p2)
        assertEquals(Triple(cb.x,cb.y,cb.zoom),Triple(ca.x,ca.y,ca.zoom))
    }
    @Test fun borrowedBanksUseExecutingVariablesWithoutTransferringFlags() {
        for(width in listOf(320,640,1008)) {
            val w=fight();val bank=FightingCharacter(definition(helperState+c("value=var(0)\nmovecamera=var(1),0",state=700),width),3)
            bank.vars[0]=1;w.p1.vars[0]=0;w.p1.vars[1]=1;w.p1.enterAuthoredState(700,bank,w.issues);w.step()
            assertEquals(CoreScreenBound(false,true,false),w.p1.screenBoundOverride);assertNull(bank.screenBoundOverride)
            w.p1.changeState(0);w.step();assertTrue(w.p1.screenBoundEnabled)
        }
    }
    @Test fun disabledBoundsDoNotSuppressOffstageAttackContacts() {
        val w=fight("[Statedef 200]\ntype=S\nphysics=N\nanim=200\n"+c(state=200)+
            "\n[State 200, attack]\ntype=HitDef\ntrigger1=Time=0\ndamage=10",c())
        w.p1.posX=200*256;w.p2.posX=205*256;w.p1.changeState(200);w.step()
        assertEquals(1,w.contacts.size);assertEquals(990,w.p2.life);assertEquals(200*256,w.p1.posX)
    }
    @Test fun inspectionDoesNotResetFlagsMoveTheCameraOrChangeSimulation() {
        val w=fight(c());w.step();val checksum=w.checksum();val flags=w.p1.screenBoundOverride
        val position=Triple(w.camera!!.x,w.camera!!.y,w.camera!!.zoom)
        val plan=CorePresentationPlanner.snapshot(w,12);repeat(10){assertEquals(plan,CorePresentationPlanner.snapshot(w,12))}
        assertEquals(checksum,w.checksum());assertSame(flags,w.p1.screenBoundOverride)
        assertEquals(position,Triple(w.camera!!.x,w.camera!!.y,w.camera!!.zoom))
    }
}
