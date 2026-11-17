package moe.celery.kenjatime

import kotlin.test.*

/** Display/collision translations stay separate from logical positions and sprite transforms. */
class DisplayOffsetTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 100]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,8,-4,-1,HV\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,20,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private fun c(type: String="Offset",params: String="",trigger: String="1",state: Int=0)=
        "[State $state, display]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("offset",air,"$idle\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(a: String="",b: String=""): DeterministicFight {
        val w=DeterministicFight(FightingCharacter(definition(a),1),FightingCharacter(definition(b),2))
        w.p2.posX=100*256;w.p2.facingRight=false;return w
    }
    private fun execute(w: DeterministicFight,params: String) {
        val ctl=MugenCnsParser.parse(c(params=params)).getValue(0).controllers.single()
        CoreDisplayOffset.execute(w.p1,ctl,w.issues)
    }
    private fun draw(w: DeterministicFight,kind: String="fighter"): Map<String,Double> {
        val json=CorePresentationPlanner.snapshot(w,0).substringAfter("\"kind\":\"$kind\"").substringBefore('}')
        return Regex("\\\"([A-Za-z0-9]+)\\\":(-?[0-9.Ee+\\-]+)").findAll(json)
            .associate { it.groupValues[1] to it.groupValues[2].toDouble() }
    }
    private fun near(expected: Double,actual: Double)=assertEquals(expected,actual,1e-8)
    @Test fun newActorsHaveNoAuthoredOrTransientDisplayOffset() {
        val w=fight();assertEquals(0,w.p1.drawOffsetX);assertEquals(0,w.p1.drawOffsetY)
        assertEquals(0L,w.p1.displayOffsetX);assertEquals(0L,w.p1.displayOffsetY)
    }
    @Test fun authoredDrawOffsetsAcceptFractionalAndNegativeComponents() {
        val d=definition("[Size]\ndraw.offset=3.5,-4.25")
        assertEquals(896,d.drawOffsetX);assertEquals(-1088,d.drawOffsetY)
        val actor=FightingCharacter(d,1);assertEquals(896L,actor.displayOffsetX);assertEquals(-1088L,actor.displayOffsetY)
    }
    @Test fun invalidAuthoredComponentsFallBackIndependently() {
        for(raw in listOf("unknown,5.5","100001,5.5","1e300,5.5")) {
            val d=definition("[Size]\ndraw.offset=$raw");assertEquals(0,d.drawOffsetX);assertEquals(1408,d.drawOffsetY)
        }
        assertEquals(0,definition("[Size]\ndraw.offset=3.5").drawOffsetY)
    }
    @Test fun ownSizeMirrorsWithFacingWhileControllerOffsetsStayWorldAligned() {
        for(face in listOf(false,true)) {
            val w=fight("[Size]\ndraw.offset=4,-3\n"+c(params="x=20\ny=-5"));w.p1.facingRight=face;w.step()
            assertEquals(if(face)24*256L else 16*256L,w.p1.displayOffsetX);assertEquals(-8*256L,w.p1.displayOffsetY)
            near(480+(if(face)24 else 16)*1.4,draw(w).getValue("x"));near(426.2,draw(w).getValue("y"))
            assertEquals(0,w.p1.posX);assertEquals(0,w.p1.posY)
        }
    }
    @Test fun sparseAxesAndEmptyControllersRetainEarlierAssertionsWithinTheTick() {
        val w=fight();execute(w,"x=30\ny=-10");execute(w,"y=5");execute(w,"")
        assertEquals(30*256,w.p1.drawOffsetX);assertEquals(5*256,w.p1.drawOffsetY)
        execute(w,"x=0");assertEquals(0,w.p1.drawOffsetX);assertEquals(5*256,w.p1.drawOffsetY)
    }
    @Test fun transientOffsetsExpireButAuthoredSizeOffsetsRemain() {
        val w=fight("[Size]\ndraw.offset=4,-3\n"+c(params="x=10\ny=20",trigger="Time=0"));w.step()
        assertEquals(14*256L,w.p1.displayOffsetX);assertEquals(17*256L,w.p1.displayOffsetY)
        w.step();assertEquals(0,w.p1.drawOffsetX);assertEquals(4*256L,w.p1.displayOffsetX);assertEquals(-3*256L,w.p1.displayOffsetY)
    }
    @Test fun stateEntryDoesNotTurnATransientOffsetIntoAPermanentOne() {
        val w=fight(c(params="x=20")+"\n[Statedef 300]\ntype=S\nphysics=N\nanim=0")
        w.step();w.p1.changeState(300);assertEquals(20*256,w.p1.drawOffsetX)
        w.step();assertEquals(0,w.p1.drawOffsetX)
    }
    @Test fun nestedExpressionsReadExecutingActorVariables() {
        val w=fight(c(params="x=ifelse(var(0),max(20.5,10),0)\ny=min(-3.5,4)"));w.p1.vars[0]=1;w.step()
        assertEquals(Fixed.of(20.5),w.p1.drawOffsetX);assertEquals(Fixed.of(-3.5),w.p1.drawOffsetY)
    }
    @Test fun invalidRequestsPreserveBothEarlierValidAxes() {
        for(params in listOf("x=unknown","x=100\ny=1/0","x=1,2","x=100001","y=-100001",
            "x=1e300","x=1\nvalue=3","z=1")) {
            val w=fight();execute(w,"x=30\ny=-10");execute(w,params)
            assertEquals(30*256,w.p1.drawOffsetX);assertEquals(-10*256,w.p1.drawOffsetY)
            assertTrue(w.issues.any{it.startsWith("Invalid Offset:")})
        }
    }
    @Test fun extremeFiniteBoundsAreAcceptedWithoutWrapping() {
        val w=fight();execute(w,"x=100000\ny=-100000")
        assertEquals(100000*256,w.p1.drawOffsetX);assertEquals(-100000*256,w.p1.drawOffsetY)
        assertTrue(w.issues.isEmpty());assertTrue(draw(w).getValue("x").isFinite())
    }
    @Test fun fractionalControllerCoordinatesConvertOnceThroughTheActiveBank() {
        val w=DeterministicFight(FightingCharacter(definition(width=640),1),FightingCharacter(definition(),2))
        execute(w,"x=7.25\ny=-3.5");assertEquals(928,w.p1.drawOffsetX);assertEquals(-448,w.p1.drawOffsetY)
    }
    @Test fun angleAndDrawingScaleDoNotRotateOrScaleTheDisplayTranslation() {
        val w=fight("[Size]\ndraw.offset=4,-3\nxscale=2\nyscale=.5\n"+
            c(params="x=10\ny=5")+"\n"+c("AngleDraw","value=90\nscale=3,-2"));w.step()
        val d=draw(w);near(499.6,d.getValue("x"));near(437.2,d.getValue("y"))
        near(-6.6,d.getValue("transformB"));near(-1.4,d.getValue("transformC"))
        assertEquals(MugenRect(-6*256,-18*256,34*256,2*256),w.p1.hurtBoxes().single())
    }
    @Test fun airFrameOffsetsRotateAfterTheDisplayTranslationAndDoNotMoveBoxes() {
        val w=fight("[Size]\ndraw.offset=4,-3\n[Statedef 300]\ntype=S\nphysics=N\nanim=100\n"+
            c(params="x=10\ny=5",state=300)+"\n"+c("AngleDraw","value=90",state=300))
        w.p1.changeState(300);w.step();val d=draw(w)
        near(494.0,d.getValue("x"));near(428.4,d.getValue("y"))
        assertEquals(MugenRect(4*256,-38*256,24*256,2*256),w.p1.hurtBoxes().single())
    }
    @Test fun borrowedAnimationsKeepOwnSizeOffsetAndExecutingBankUnitsSeparate() {
        val w=fight("[Size]\ndraw.offset=4,-3");val bank=FightingCharacter(definition(
            "[Size]\ndraw.offset=80,40\nxscale=2\n[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+
            c(params="x=var(0)\ny=10",state=700)+"\n"+c("ChangeAnim2","value=100",state=700),640),3)
        w.p1.vars[0]=20;bank.vars[0]=60;w.p1.enterAuthoredState(700,bank,w.issues);w.step()
        assertSame(bank,w.p1.animationOwner);assertEquals(10*256,w.p1.drawOffsetX)
        assertEquals(14*256L,w.p1.displayOffsetX);assertEquals(2*256L,w.p1.displayOffsetY)
        assertEquals(MugenRect(4*256,-18*256,24*256,2*256),w.p1.hurtBoxes().single())
        assertEquals(0,bank.drawOffsetX);w.p1.changeState(0,w.p1);w.step();assertEquals(4*256L,w.p1.displayOffsetX)
    }
    @Test fun helpersKeepIndependentOffsetsWhileSharingOwnAuthoredSizeMetadata() {
        val w=fight("[Size]\ndraw.offset=4,-3\n"+c(params="x=20")+
            "\n[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+c(params="x=-5\ny=3",state=700))
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,700,10*256,0,1,false,0)),w.issues);w.step()
        val h=w.entities.helpers.single().actor
        assertEquals(24*256L,w.p1.displayOffsetX);assertEquals(-256L,h.displayOffsetX);assertEquals(0L,h.displayOffsetY)
        assertEquals(10*256,h.posX);near(480+9*1.4,draw(w,"helper").getValue("x"))
    }
    private fun attack(extra: String="")="[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n"+
        extra+"\n"+c("HitDef","damage=10",trigger="Time=0",state=200)
    @Test fun translatedBodyAttackBoxesCanHitWithoutChangingTheAttackerAxis() {
        for(shift in listOf(false,true)) {
            val w=fight(attack(if(shift)c(params="x=20",state=200) else ""));w.p2.posX=30*256;w.p1.changeState(200);w.step()
            assertEquals(if(shift)990 else 1000,w.p2.life);assertEquals(if(shift)1 else 0,w.contacts.size)
            assertEquals(0,w.p1.posX);assertEquals(30*256,w.p2.posX)
        }
    }
    @Test fun translatedHurtBoxesCanBeHitWithoutChangingTheVictimAxis() {
        val w=fight(attack(),c(params="x=-20"));w.p2.posX=30*256;w.p1.changeState(200);w.step()
        assertEquals(990,w.p2.life);assertEquals(30*256,w.p2.posX);assertEquals(-20*256,w.p2.drawOffsetX)
    }
    @Test fun helperAttacksUseTheirOwnTranslatedBoxes() {
        val w=fight(attack(c(params="x=20",state=200)));w.p2.posX=30*256
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,200,0,0,1,false,0)),w.issues);w.step()
        assertEquals(990,w.p2.life);assertEquals(w.entities.helpers.single().actor.id,w.contacts.single().attacker)
        assertEquals(0,w.p1.drawOffsetX);assertEquals(0,w.entities.helpers.single().actor.posX)
    }
    @Test fun arenaPushingAndCameraStillUseLogicalAxesAndBodyWidths() {
        val a=fight(c(params="x=1000\ny=-1000"));val b=fight()
        for(w in listOf(a,b)) { w.configureArena(-100,100);w.p1.posX=-5*256;w.p2.posX=5*256;w.step() }
        assertEquals(b.checksum(),a.checksum());assertEquals(-15*256,a.p1.posX);assertEquals(15*256,a.p2.posX)
        assertEquals(b.camera!!.x,a.camera!!.x);assertEquals(b.camera!!.y,a.camera!!.y)
        assertTrue(CoreExpression.test("Pos X=-15 && P2Dist X=30 && P2BodyDist X=0",a.p1,a.issues))
    }
    @Test fun positionFreezeDoesNotPreventDisplayOrCollisionTranslation() {
        val w=fight(c("PosFreeze")+"\n"+c(params="x=20"));w.p1.velX=256;w.step()
        assertEquals(0,w.p1.posX);assertEquals(256,w.p1.velX);assertEquals(10*256,w.p1.hurtBoxes().single().x1)
    }
    @Test fun bindingOffsetsRemainRelativeToLogicalAnchorPositions() {
        val w=fight(c(params="x=100")+"\n[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+
            c(params="x=-5",state=700)+"\n"+c("BindToParent","pos=10,0\ntime=-1",state=700))
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,700,0,0,1,false,0)),w.issues);w.p1.velX=256;w.step()
        val h=w.entities.helpers.single().actor;assertEquals(256,w.p1.posX);assertEquals(11*256,h.posX)
        near(480+6*1.4,draw(w,"helper").getValue("x"))
    }
    @Test fun hitpauseClearsTransientOffsetUnlessAnOptedInControllerReassertsIt() {
        for(ignore in 0..1) {
            val w=fight("[Size]\ndraw.offset=4,-3\n"+c(params="x=Time+15\nignorehitpause=$ignore"))
            w.step();assertEquals(15*256,w.p1.drawOffsetX);w.p1.hitPauseLeft=2
            repeat(2) { w.step();assertEquals(if(ignore==1)16*256 else 0,w.p1.drawOffsetX);assertEquals(1,w.p1.timeInState) }
            assertEquals((if(ignore==1)20 else 4)*256L,w.p1.displayOffsetX)
            w.step();assertEquals(16*256,w.p1.drawOffsetX)
        }
    }
    @Test fun persistentZeroOffsetRearmsOnStateReentry() {
        val w=fight(c(params="x=15\npersistent=0"));w.step();w.step();assertEquals(0,w.p1.drawOffsetX)
        w.p1.changeState(0);w.step();assertEquals(15*256,w.p1.drawOffsetX)
    }
    @Test fun boundP1ExplodsFollowTheTranslatedDisplayOrigin() {
        val w=fight("[Size]\ndraw.offset=4,-3\n"+c(params="x=20\ny=10",trigger="Time=0")+"\n"+
            c("Explod","anim=0\npos=5,6\npostype=p1\nbindtime=-1\nremovetime=-1",trigger="Time=0"))
        w.p1.posX=10*256;w.step();val e=w.effects.all.single()
        assertEquals(39*256,e.x);assertEquals(13*256,e.y)
        w.step();assertEquals(19*256,e.x);assertEquals(3*256,e.y)
        w.p1.facingRight=false;w.step();assertEquals(256,e.x);assertEquals(3*256,e.y)
    }
    @Test fun unboundP2ExplodsCaptureDisplayPositionWhileBoundOnesKeepFollowing() {
        val w=fight(c("Explod","id=1\nanim=0\npostype=p2\nbindtime=0\nremovetime=-1",trigger="Time=0")+"\n"+
            c("Explod","id=2\nanim=0\npostype=p2\nbindtime=-1\nremovetime=-1",trigger="Time=0"),
            c(params="x=-10*(Time+1)\ny=2"))
        w.step();assertTrue(w.effects.all.all{it.x==90*256 && it.y==2*256})
        w.step();assertEquals(90*256,w.effects.all.first{it.id==1}.x);assertEquals(80*256,w.effects.all.first{it.id==2}.x)
    }
    @Test fun absoluteEffectsAndProjectilesDoNotInheritActorDisplayOffsets() {
        val w=fight("[Size]\ndraw.offset=4,-3\n"+c(params="x=20\ny=10")+"\n"+
            c("Explod","anim=0\npostype=none\npos=5,6\nremovetime=-1",trigger="Time=0")+"\n"+
            c("Projectile","projanim=0\nprojhits=0\noffset=20,0\nvelocity=0,0\nprojremovetime=-1",trigger="Time=0"))
        w.step();assertEquals(5*256,w.effects.all.single().x);assertEquals(6*256,w.effects.all.single().y)
        assertEquals(20*256,w.entities.projectiles.single().x);near(0.0,draw(w,"projectile").getValue("displayOffsetX256"))
    }
    @Test fun collisionVerticesSaturateAfterTheCompleteWideOriginTranslation() {
        val wideAir="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-1024,-2,-1023,-1\n0,0,0,0,-1"
        val d=FighterDefinition.fromScript("wide origin",wideAir,idle)
        val w=DeterministicFight(FightingCharacter(d,1),FightingCharacter(d,2));w.p1.posX=Int.MAX_VALUE-256
        execute(w,"x=512");val box=w.p1.hurtBoxes().single()
        assertEquals(Int.MAX_VALUE-131328,box.x1);assertEquals(Int.MAX_VALUE-131072,box.x2)
        execute(w,"x=100000");assertEquals(Int.MAX_VALUE,w.p1.hurtBoxes().single().x1)
        w.p1.posX=Int.MIN_VALUE;execute(w,"x=-100000");assertEquals(Int.MIN_VALUE,w.p1.hurtBoxes().single().x2)
    }
    @Test fun presentationReadsCannotClearOffsetsOrChangeLogicalState() {
        val w=fight(c(params="x=15\ny=-5"));w.step();val before=w.checksum();val time=w.p1.timeInState
        val plan=CorePresentationPlanner.snapshot(w,12);repeat(8){assertEquals(plan,CorePresentationPlanner.snapshot(w,12))}
        assertEquals(15*256,w.p1.drawOffsetX);assertEquals(-5*256,w.p1.drawOffsetY)
        assertEquals(before,w.checksum());assertEquals(time,w.p1.timeInState)
    }
}
