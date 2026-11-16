package moe.celery.kenjatime

import kotlin.test.*

/** Body-space assertions affect arena separation, never AIR attack/hurt geometry. */
class BodySpaceTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-20,-40,20,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=-40,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private fun c(type: String,params: String="",trigger: String="1",state: Int=0)=
        "[State $state, body space]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("body space",air,"$idle\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(a: String="",b: String=""): DeterministicFight {
        val w=DeterministicFight(FightingCharacter(definition(a),1),FightingCharacter(definition(b),2))
        w.configureArena(-100,100);w.p1.posX=-5*256;w.p2.posX=5*256;w.p2.facingRight=false
        return w
    }
    private fun execute(w: DeterministicFight,type: String,params: String) {
        val controller=MugenCnsParser.parse(c(type,params)).getValue(0).controllers.single()
        CoreBodySpace.execute(w.p1,controller,w.issues)
    }
    private fun resetPositions(w: DeterministicFight) { w.p1.posX=-5*256;w.p2.posX=5*256 }
    private fun helper(w: DeterministicFight,offset: Int=70*256): FightingCharacter {
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,700,offset,0,1,false,0)),w.issues)
        return w.entities.helpers.last().actor
    }
    @Test fun rootsPushByDefaultButNewHelpersDoNot() {
        val w=fight("[Statedef 700]\ntype=S\nphysics=N\nanim=0")
        assertTrue(w.p1.playerPushEnabled);assertTrue(w.p2.playerPushEnabled)
        assertFalse(helper(w).playerPushEnabled);assertEquals(CoreWidthOffsets.ZERO,w.p1.widthOffsets)
    }
    @Test fun standaloneArenaRootsDoNotRequireAttachedOpponentLinks() {
        val a=FightingCharacter(definition(),1);val b=FightingCharacter(definition(),2)
        a.posX=-5*256;b.posX=5*256;b.facingRight=false
        ArenaRules(-100*256,100*256).step(a,b,false,false)
        assertEquals(-15*256,a.posX);assertEquals(15*256,b.posX)
    }
    @Test fun disablingEitherRootAllowsOverlapWithoutFreezingMotionOrClocks() {
        for(side in 0..1) {
            val script=c("PlayerPush","value=0")
            val w=if(side==0)fight(script) else fight(b=script)
            w.p1.velX=256;w.step()
            assertEquals(-4*256,w.p1.posX);assertEquals(5*256,w.p2.posX)
            assertEquals(256,w.p1.velX);assertEquals(1,w.p1.timeInState);assertEquals(1L,w.p1.animation?.elapsed)
        }
    }
    @Test fun nonzeroExpressionsAndLaterControllersCanReenablePush() {
        val w=fight("${c("PlayerPush","value=0")}\n${c("PlayerPush","value=ifelse(var(0),-.5,0)")}")
        w.p1.vars[0]=1;w.step();assertTrue(w.p1.playerPushEnabled)
        assertEquals(-15*256,w.p1.posX);assertEquals(15*256,w.p2.posX)
    }
    @Test fun malformedPushRequestsPreserveTheEarlierValidAssertion() {
        for(params in listOf("","value=unknown","value=1/0","value=1,2","value=1\nx=2")) {
            val w=fight();execute(w,"PlayerPush","value=0");execute(w,"PlayerPush",params)
            assertFalse(w.p1.playerPushEnabled);assertTrue(w.issues.any{it.startsWith("Invalid PlayerPush:")})
        }
    }
    @Test fun pushDisableExpiresOnTheNextActiveTick() {
        val w=fight(c("PlayerPush","value=0",trigger="Time=0"));w.step()
        assertEquals(-5*256,w.p1.posX);w.step()
        assertTrue(w.p1.playerPushEnabled);assertEquals(-15*256,w.p1.posX)
    }
    @Test fun persistentZeroPushRearmsOnlyOnStateReentry() {
        val w=fight(c("PlayerPush","value=0\npersistent=0"));w.step();w.step()
        assertTrue(w.p1.playerPushEnabled);resetPositions(w);w.p1.changeState(0);w.step()
        assertFalse(w.p1.playerPushEnabled);assertEquals(-5*256,w.p1.posX)
    }
    @Test fun widthShorthandAddsToBodyWidthsAndAlsoSetsBothEdgeOffsets() {
        val w=fight(c("Width","value=10,-5"));w.step()
        assertEquals(CoreWidthOffsets(10*256,-5*256,10*256,-5*256),w.p1.widthOffsets)
        assertEquals(25*256,w.p1.playerWidthWorld(1));assertEquals(10*256,w.p1.playerWidthWorld(-1))
        assertEquals(-20*256,w.p1.posX);assertEquals(20*256,w.p2.posX)
        assertEquals(-100*256 to 90*256,w.arena!!.horizontalLimits(w.p1))
    }
    @Test fun playerAndEdgePairsHaveIndependentFacingRelativeMeanings() {
        val w=fight(c("Width","player=20,-5\nedge=3,7"));w.step()
        assertEquals(35*256,w.p1.playerWidthWorld(1));assertEquals(10*256,w.p1.playerWidthWorld(-1))
        assertEquals(-93*256 to 97*256,w.arena!!.horizontalLimits(w.p1))
        w.p1.facingRight=false
        assertEquals(10*256,w.p1.playerWidthWorld(1));assertEquals(35*256,w.p1.playerWidthWorld(-1))
        assertEquals(-97*256 to 93*256,w.arena!!.horizontalLimits(w.p1))
    }
    @Test fun omittedWidthPairsDefaultToZeroAndLaterRequestsReplaceAllFourOffsets() {
        for(params in listOf("","player=2,3","edge=4,5")) {
            val w=fight();execute(w,"Width","value=10,20");execute(w,"Width",params)
            val expected=when(params) {
                "player=2,3" -> CoreWidthOffsets(2*256,3*256,0,0)
                "edge=4,5" -> CoreWidthOffsets(0,0,4*256,5*256)
                else -> CoreWidthOffsets.ZERO
            }
            assertEquals(expected,w.p1.widthOffsets);assertTrue(w.issues.isEmpty())
        }
    }
    @Test fun malformedWidthRequestsAreAtomicAcrossAllFourComponents() {
        for(params in listOf("value=","value=1,2,3","value=,2","player=unknown,0",
            "player=2,3\nedge=1,1/0","edge=1,100001","value=2,3\nextra=1")) {
            val w=fight();execute(w,"Width","value=10,20");execute(w,"Width",params)
            assertEquals(CoreWidthOffsets(10*256,20*256,10*256,20*256),w.p1.widthOffsets)
            assertTrue(w.issues.any{it.startsWith("Invalid Width:")})
        }
    }
    @Test fun shorthandCannotBeCombinedWithEitherExplicitPair() {
        for(params in listOf("value=1,2\nplayer=3,4","value=1,2\nedge=3,4")) {
            val w=fight();execute(w,"Width","value=10,20");execute(w,"Width",params)
            assertEquals(10*256,w.p1.widthOffsets.playerFront);assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun integerWidthsTruncateBeforeActiveStateCoordinateConversion() {
        val w=DeterministicFight(FightingCharacter(definition(width=640),1),FightingCharacter(definition(),2))
        execute(w,"Width","value=ifelse(1,1.9,0),min(-2.9,0)")
        assertEquals(CoreWidthOffsets(128,-256,128,-256),w.p1.widthOffsets)
    }
    @Test fun oneComponentWidthDefaultsItsBackOffsetToZero() {
        val w=fight();execute(w,"Width","value=max(10,5)")
        assertEquals(CoreWidthOffsets(10*256,0,10*256,0),w.p1.widthOffsets)
    }
    @Test fun widthExpiresOnTheNextActiveTick() {
        val w=fight(c("Width","player=10,-5",trigger="Time=0"));w.step()
        assertEquals(-20*256,w.p1.posX);resetPositions(w);w.step()
        assertEquals(CoreWidthOffsets.ZERO,w.p1.widthOffsets);assertEquals(-15*256,w.p1.posX)
    }
    @Test fun persistentZeroWidthRearmsOnStateEntry() {
        val w=fight(c("Width","player=10,0\npersistent=0"));w.step();w.step()
        assertEquals(CoreWidthOffsets.ZERO,w.p1.widthOffsets);w.p1.changeState(0);w.step()
        assertEquals(10*256,w.p1.widthOffsets.playerFront)
    }
    @Test fun negativePlayerOffsetsCanShrinkWidthsAllTheWayToZero() {
        val w=fight(c("Width","player=-100,-100"),c("Width","player=-100,-100"))
        w.p1.posX=0;w.p2.posX=0;w.step()
        assertEquals(0,w.p1.playerWidthWorld(1));assertEquals(0,w.p2.playerWidthWorld(-1))
        assertEquals(0,w.p1.posX);assertEquals(0,w.p2.posX)
    }
    @Test fun negativeEdgeOffsetsCannotEscapeTheConfiguredHardStageBounds() {
        val w=fight(c("Width","edge=-20,-30"),c("Width","edge=-20,-30"))
        w.p1.posX=-400*256;w.p2.posX=400*256;w.step()
        assertEquals(-100*256,w.p1.posX);assertEquals(100*256,w.p2.posX)
    }
    @Test fun impossibleEdgeInsetsCollapseSafelyToTheArenaMidpoint() {
        val w=fight(c("Width","edge=500,500"));w.p1.posX=-60*256;w.p2.posX=100*256;w.step()
        assertEquals(0,w.p1.posX);assertEquals(0 to 0,w.arena!!.horizontalLimits(w.p1))
    }
    @Test fun facingAndCoordinateWidthsSelectTheCorrectCanonicalBodySide() {
        for(width in listOf(320,640))for(face in listOf(false,true)) {
            val factor=width/320
            val a=FightingCharacter(definition("[Size]\nground.front=${15*factor}\nground.back=${15*factor}\n"+
                c("Width","player=${10*factor},${-5*factor}"),width),1)
            val w=DeterministicFight(a,FightingCharacter(definition(),2));w.configureArena(-100,100)
            resetPositions(w);a.facingRight=face;w.p2.facingRight=false;w.step()
            assertEquals(Fixed.of(if(face)-20.0 else -12.5),a.posX)
            assertEquals(Fixed.of(if(face)20.0 else 12.5),w.p2.posX)
        }
    }
    @Test fun authoredAirBodyWidthsAreSeparateFromGroundWidthsAndDrawSize() {
        val w=fight("[Size]\nground.front=30\nground.back=10\nair.front=8\nair.back=6\nxscale=4\n"+
            c("Width","player=5,2")+"\n[Statedef 700]\ntype=A\nphysics=N\nanim=0\n"+
            c("Width","player=5,2",state=700));w.step()
        assertEquals(35*256,w.p1.playerWidthWorld(1));assertEquals(12*256,w.p1.playerWidthWorld(-1))
        w.p1.changeState(700);resetPositions(w);w.step()
        assertEquals(13*256,w.p1.playerWidthWorld(1));assertEquals(8*256,w.p1.playerWidthWorld(-1))
        assertEquals(-14*256,w.p1.posX);assertEquals(14*256,w.p2.posX)
    }
    @Test fun bodyDistanceTriggersRetainTheirBaseWidthConvention() {
        val w=fight(c("Width","player=40,30"));w.configureArena(-100,100,push=false)
        w.p1.posX=-50*256;w.p2.posX=50*256;w.step()
        assertTrue(CoreExpression.test("P2BodyDist X=70",w.p1,w.issues));assertTrue(w.issues.isEmpty())
    }
    @Test fun edgeLimitedActorGivesResidualPushTravelToItsOpponent() {
        val w=fight(c("Width","player=5,0\nedge=0,20"));w.p1.posX=-79*256;w.p2.posX=-75*256;w.step()
        assertEquals(-80*256,w.p1.posX);assertEquals(-45*256,w.p2.posX)
    }
    @Test fun reversePairOrderStillUsesEachActorsOwnEdgeRoom() {
        val w=fight(c("Width","player=5,0\nedge=0,20"));w.p1.facingRight=false;w.p2.facingRight=true
        w.p1.posX=79*256;w.p2.posX=75*256;w.step()
        assertEquals(80*256,w.p1.posX);assertEquals(45*256,w.p2.posX)
    }
    @Test fun frozenActorsStayAnchoredWhenWidthIncreasesSeparation() {
        val w=fight("${c("Width","player=20,0")}\n${c("PosFreeze")}")
        w.p1.posX=0;w.step();assertEquals(0,w.p1.posX);assertEquals(50*256,w.p2.posX)
        w.p1.posX=90*256;w.p2.posX=95*256;w.step()
        assertEquals(90*256,w.p1.posX);assertEquals(100*256,w.p2.posX)
    }
    @Test fun bindingsRemainAuthoritativeAndExcludeBoundActorsFromPush() {
        val w=fight(c("Width","value=80,80"));w.p1.bindTo(w.p2,0,0,-1);w.step()
        assertEquals(5*256,w.p2.posX);assertEquals(w.p2.posX,w.p1.posX)
    }
    @Test fun globalPushDisableStillAppliesEdgeInsets() {
        val w=fight("${c("Width","edge=10,20")}\n${c("PlayerPush","value=1")}")
        w.configureArena(-100,100,push=false);w.p1.posX=-100*256;w.p2.posX=-79*256;w.step()
        assertEquals(-80*256,w.p1.posX);assertEquals(-79*256,w.p2.posX)
    }
    @Test fun bodySpaceAssertionsPersistThroughHitpauseThenExpireBeforeActiveControllers() {
        val w=fight("${c("Width","player=10,5",trigger="Time=0")}\n${c("PlayerPush","value=0",trigger="Time=0")}")
        w.step();w.p1.hitPauseLeft=2
        repeat(2) { w.step();assertEquals(10*256,w.p1.widthOffsets.playerFront);assertFalse(w.p1.playerPushEnabled);assertEquals(1,w.p1.timeInState) }
        w.step();assertTrue(w.p1.playerPushEnabled);assertEquals(CoreWidthOffsets.ZERO,w.p1.widthOffsets)
        assertEquals(-15*256,w.p1.posX)
    }
    @Test fun ignorehitpauseCanReplaceBothBodySpaceAssertionsOnFrozenTicks() {
        val w=fight("${c("Width","player=10,0\nignorehitpause=1")}\n${c("PlayerPush","value=0\nignorehitpause=1")}")
        w.p1.hitPauseLeft=2;repeat(2){w.step()}
        assertFalse(w.p1.playerPushEnabled);assertEquals(10*256,w.p1.widthOffsets.playerFront)
        assertEquals(0,w.p1.timeInState);assertEquals(-5*256,w.p1.posX)
    }
    private val helperState="[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"
    @Test fun helperPushIsOptInAndOpposingRootsAreDisplaced() {
        val w=fight(helperState+c("PlayerPush","value=1",state=700)+"\n"+c("Width","player=10,0",state=700))
        w.p1.posX=-70*256;val h=helper(w);w.step()
        assertTrue(h.playerPushEnabled);assertEquals(-70*256,w.p1.posX)
        assertEquals(Fixed.of(-17.5),h.posX);assertEquals(Fixed.of(22.5),w.p2.posX)
    }
    @Test fun defaultHelpersAndSameRootHelpersDoNotPushEachOther() {
        val w=fight(helperState+c("PlayerPush","value=1",state=700));w.p1.posX=-70*256;w.p2.posX=90*256
        val a=helper(w);val b=helper(w);w.step();assertEquals(0,a.posX);assertEquals(0,b.posX)
        val default=fight(helperState);default.p1.posX=-70*256;val h=helper(default);default.step()
        assertEquals(0,h.posX);assertEquals(5*256,default.p2.posX)
    }
    @Test fun frozenHelperAnchorsItsOwnPushWithoutConstrainingTheOwningRoot() {
        val w=fight(helperState+c("PlayerPush","value=1",state=700)+"\n"+
            c("Width","player=10,0",state=700)+"\n"+c("PosFreeze",state=700))
        w.p1.posX=-70*256;val h=helper(w);w.step()
        assertEquals(0,h.posX);assertEquals(40*256,w.p2.posX);assertEquals(-70*256,w.p1.posX)
    }
    @Test fun borrowedBankWidthsConvertOnceAndUseExecutingVariablesWithOwnBaseSize() {
        val w=fight();val bank=FightingCharacter(definition("[Size]\nground.front=80\n"+helperState+
            c("Width","player=var(0),0\nedge=4,6",state=700),640),3)
        w.p1.vars[0]=20;bank.vars[0]=60;w.p1.enterAuthoredState(700,bank,w.issues);w.step()
        assertEquals(10*256,w.p1.widthOffsets.playerFront);assertEquals(25*256,w.p1.playerWidthWorld(1))
        assertEquals(2*256,w.p1.widthOffsets.edgeFront);assertEquals(-20*256,w.p1.posX)
        assertEquals(CoreWidthOffsets.ZERO,bank.widthOffsets)
        w.p1.changeState(0,w.p1);assertEquals(10*256,w.p1.widthOffsets.playerFront)
        w.step();assertEquals(CoreWidthOffsets.ZERO,w.p1.widthOffsets)
    }
    @Test fun disabledPushingDoesNotDisableAttackContactsOrDamage() {
        val w=fight("[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n"+
            c("PlayerPush","value=0",state=200)+"\n"+
            c("HitDef","damage=10",trigger="Time=0",state=200))
        w.p1.changeState(200);w.step();assertEquals(990,w.p2.life);assertEquals(1,w.contacts.size)
        assertEquals(-5*256,w.p1.posX);assertEquals(5*256,w.p2.posX)
    }
    @Test fun bodySpaceChangesDoNotResizeAirBoxesAndPresentationCannotMutateFlags() {
        val w=fight("${c("Width","value=10,20")}\n${c("PlayerPush","value=0")}")
        w.configureArena(-100,100,push=false);val boxes=w.p1.hurtBoxes();w.step()
        assertEquals(boxes,w.p1.hurtBoxes());val before=w.checksum();val offsets=w.p1.widthOffsets
        val plan=CorePresentationPlanner.snapshot(w,12)
        repeat(8){assertEquals(plan,CorePresentationPlanner.snapshot(w,12))}
        assertEquals(before,w.checksum());assertEquals(offsets,w.p1.widthOffsets);assertFalse(w.p1.playerPushEnabled)
    }
}
