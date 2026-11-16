package moe.celery.kenjatime

import kotlin.test.*

/** Persistent angle arithmetic and per-tick render transforms, with untouched simulation geometry. */
class AngleDrawingTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 100]\n0,0,8,-4,-1\n[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private fun c(type: String,params: String="",trigger: String="1",state: Int=0)="[State $state, angle]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("angle",air,"$idle\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="")=DeterministicFight(FightingCharacter(definition(extra),1),FightingCharacter(definition(),2))
    private fun execute(w: DeterministicFight,type: String,params: String) {
        val controller=MugenCnsParser.parse(c(type,params)).getValue(0).controllers.single()
        CoreAngleDrawing.execute(w.p1,controller,w.issues)
    }
    private fun draw(w: DeterministicFight,kind: String="fighter"): Map<String,Double> {
        val json=CorePresentationPlanner.snapshot(w,0).substringAfter("\"kind\":\"$kind\"").substringBefore('}')
        return Regex("\\\"([A-Za-z]+)\\\":(-?[0-9.Ee+\\-]+)").findAll(json).associate { it.groupValues[1] to it.groupValues[2].toDouble() }
    }
    private fun near(expected: Double,actual: Double)=assertEquals(expected,actual,1e-8)
    @Test fun newActorsHaveZeroAngleAndAnIdentityDrawingAssertion() {
        val w=fight();assertEquals(0.0,w.p1.drawAngleDegrees);assertFalse(w.p1.angleDrawEnabled)
        assertEquals(1.0,w.p1.drawScaleX);assertEquals(1.0,w.p1.drawScaleY)
    }
    @Test fun setAddAndMultiplyComposeInControllerOrderWithoutImplicitDraw() {
        val w=fight("${c("AngleSet","value=15")}\n${c("AngleAdd","value=30")}\n${c("AngleMul","value=2")}")
        w.step();assertEquals(90.0,w.p1.drawAngleDegrees);assertFalse(w.p1.angleDrawEnabled)
        near(0.0,draw(w).getValue("rotationDegrees"));near(1.4,draw(w).getValue("transformA"))
    }
    @Test fun omittedAngleDrawValueUsesThePersistentAngle() {
        val w=fight("${c("AngleSet","value=45",trigger="Time=0")}\n${c("AngleDraw")}");repeat(3){w.step()}
        assertEquals(45.0,w.p1.drawAngleDegrees);assertTrue(w.p1.angleDrawEnabled)
        near(45.0,draw(w).getValue("rotationDegrees"))
    }
    @Test fun angleDrawValueCanExplicitlySetZero() {
        val w=fight("${c("AngleSet","value=45")}\n${c("AngleDraw","value=0")}");w.step()
        assertEquals(0.0,w.p1.drawAngleDegrees);assertTrue(w.p1.angleDrawEnabled)
    }
    @Test fun drawingAndScaleExpireWhileTheStoredAnglePersists() {
        val w=fight(c("AngleDraw","value=45\nscale=2,.5",trigger="Time=0"));w.step()
        assertTrue(w.p1.angleDrawEnabled);assertEquals(2.0,w.p1.drawScaleX)
        w.step();assertFalse(w.p1.angleDrawEnabled);assertEquals(45.0,w.p1.drawAngleDegrees)
        assertEquals(1.0,w.p1.drawScaleX);assertEquals(1.0,w.p1.drawScaleY)
        near(0.0,draw(w).getValue("rotationDegrees"))
    }
    @Test fun stateTransitionsDoNotResetTheStoredAngleOrMakeDrawPermanent() {
        val w=fight("${c("AngleDraw","value=60")}\n[Statedef 200]\ntype=S\nphysics=N\nanim=0")
        w.step();w.p1.changeState(200);assertEquals(60.0,w.p1.drawAngleDegrees)
        w.step();assertEquals(60.0,w.p1.drawAngleDegrees);assertFalse(w.p1.angleDrawEnabled)
    }
    @Test fun nestedExpressionsAndScalePairsReadTheExecutingActorsVariables() {
        val w=fight("${c("AngleSet","value=ifelse(var(0),15,30)")}\n${c("AngleAdd","value=max(10,5)")}\n"+
            "${c("AngleMul","value=min(2,3)")}\n${c("AngleDraw","scale=ifelse(var(0),2,1),min(.5,1)")}")
        w.p1.vars[0]=1;w.step();assertEquals(50.0,w.p1.drawAngleDegrees)
        assertEquals(2.0,w.p1.drawScaleX);assertEquals(.5,w.p1.drawScaleY)
    }
    @Test fun invalidArithmeticOrMissingValuesPreserveTheStoredAngle() {
        for(type in listOf("AngleSet","AngleAdd","AngleMul"))for(params in listOf("","value=unknown","value=1/0","value=1,2","value=2\nscale=1,1")) {
            val w=fight();w.p1.drawAngleDegrees=30.0;execute(w,type,params)
            assertEquals(30.0,w.p1.drawAngleDegrees);assertTrue(w.issues.any{it.startsWith("Invalid $type:")})
        }
    }
    @Test fun arithmeticOverflowFailsBeforeMutatingAnyDrawingState() {
        val w=fight();w.p1.drawAngleDegrees=Double.MAX_VALUE;w.p1.angleDrawEnabled=true
        w.p1.drawScaleX=2.0;execute(w,"AngleMul","value=2")
        assertEquals(Double.MAX_VALUE,w.p1.drawAngleDegrees);assertTrue(w.p1.angleDrawEnabled)
        assertEquals(2.0,w.p1.drawScaleX);assertTrue(w.issues.isNotEmpty())
    }
    @Test fun invalidDrawRequestsPreserveEarlierValidAngleAndBothScales() {
        for(params in listOf("value=unknown","value=60\nscale=1","value=60\nscale=1,2,3","value=60\nscale=1,unknown",
            "value=60\nscale=65,1","value=60\nscale=1,-65","value=60\nx=1")) {
            val w=fight();execute(w,"AngleDraw","value=30\nscale=2,.5");execute(w,"AngleDraw",params)
            assertEquals(30.0,w.p1.drawAngleDegrees);assertTrue(w.p1.angleDrawEnabled)
            assertEquals(2.0,w.p1.drawScaleX);assertEquals(.5,w.p1.drawScaleY);assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun zeroAndSignedDrawingScalesRemainDistinct() {
        val w=fight(c("AngleDraw","value=30\nscale=0,-2"));w.step();val d=draw(w)
        near(0.0,d.getValue("transformA"));near(0.0,d.getValue("transformB"))
        assertTrue(d.getValue("transformC")<0);assertTrue(d.getValue("transformD")<0)
    }
    @Test fun positiveAngleIsCounterclockwiseFacingRightAndMirroredFacingLeft() {
        for(face in listOf(false,true)) {
            val w=fight(c("AngleDraw","value=90"));w.p1.facingRight=face;w.step();val d=draw(w)
            near(if(face)90.0 else -90.0,d.getValue("rotationDegrees"))
            near(0.0,d.getValue("transformA"));near(-1.1,d.getValue("transformB"))
            near(if(face)1.4 else -1.4,d.getValue("transformC"));near(0.0,d.getValue("transformD"))
        }
    }
    @Test fun rotationPrecedesUnequalViewportAxisProjectionAndUsesSpriteSize() {
        val w=fight("[Size]\nxscale=2\nyscale=.5\n${c("AngleDraw","value=90\nscale=3,-2")}")
        w.step();val d=draw(w);near(-6.6,d.getValue("transformB"));near(-1.4,d.getValue("transformC"))
    }
    @Test fun airOffsetsRotateAboutTheActorAxisWithoutMovingTheActor() {
        val w=fight("[Statedef 200]\ntype=S\nphysics=N\nanim=100\n${c("AngleDraw","value=90",state=200)}")
        w.p1.changeState(200);w.step();val d=draw(w)
        near(474.4,d.getValue("x"));near(426.2,d.getValue("y"))
        assertEquals(0,w.p1.posX);assertEquals(0,w.p1.posY)
    }
    @Test fun displayNormalizationDoesNotWrapTheStoredArithmeticAngle() {
        val w=fight(c("AngleDraw","value=450"));w.step()
        assertEquals(450.0,w.p1.drawAngleDegrees);near(90.0,draw(w).getValue("rotationDegrees"))
    }
    @Test fun persistentZeroDrawRearmsOnStateReentry() {
        val w=fight(c("AngleDraw","value=45\npersistent=0"));w.step();assertTrue(w.p1.angleDrawEnabled)
        w.step();assertFalse(w.p1.angleDrawEnabled);w.p1.changeState(0);w.step();assertTrue(w.p1.angleDrawEnabled)
    }
    @Test fun ignorehitpauseGovernsAngleArithmeticAndPerTickDrawAssertion() {
        for(ignore in 0..1) {
            val w=fight("${c("AngleAdd","value=15\nignorehitpause=$ignore")}\n${c("AngleDraw","ignorehitpause=$ignore")}")
            w.p1.hitPauseLeft=2;repeat(2){w.step()}
            assertEquals(if(ignore==1)30.0 else 0.0,w.p1.drawAngleDegrees)
            assertEquals(ignore==1,w.p1.angleDrawEnabled);assertEquals(0,w.p1.timeInState)
            w.step();assertEquals(if(ignore==1)45.0 else 15.0,w.p1.drawAngleDegrees)
        }
    }
    @Test fun helperAnglesAndScalesAreIndependentOfTheRoot() {
        val w=fight("${c("AngleDraw","value=30\nscale=2,2")}\n[Statedef 200]\ntype=S\nphysics=N\nanim=0\n"+
            c("AngleDraw","value=-45\nscale=.5,1",state=200))
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,200,0,0,1,false,0)),w.issues);w.step()
        val helper=w.entities.helpers.single().actor;assertEquals(-45.0,helper.drawAngleDegrees)
        assertEquals(.5,helper.drawScaleX);assertEquals(30.0,w.p1.drawAngleDegrees);assertEquals(2.0,w.p1.drawScaleX)
        near(-45.0,draw(w,"helper").getValue("rotationDegrees"))
    }
    @Test fun borrowedBankUnitsCannotScaleDegreesOrDimensionlessDrawScale() {
        val w=fight();val bank=FightingCharacter(definition("[Statedef 200]\ntype=S\nphysics=N\nanim=0\n"+
            c("AngleDraw","value=var(0)\nscale=2,.5",state=200),640),3)
        w.p1.vars[0]=30;bank.vars[0]=60;w.p1.enterAuthoredState(200,bank,w.issues);w.step()
        assertEquals(30.0,w.p1.drawAngleDegrees);assertEquals(2.0,w.p1.drawScaleX);assertEquals(0.0,bank.drawAngleDegrees)
    }
    @Test fun visualRotationAndScalingCannotAlterHitboxesOrDamage() {
        fun replay(draw: Boolean): DeterministicFight {
            val w=fight("[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n"+
                (if(draw)c("AngleDraw","value=90\nscale=0,-2",state=200) else "")+
                "\n[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=10")
            w.p1.changeState(200);w.p2.posX=5*256;w.step();return w
        }
        val plain=replay(false);val drawn=replay(true)
        assertEquals(plain.p1.attackBoxes(),drawn.p1.attackBoxes());assertEquals(plain.checksum(),drawn.checksum())
        assertEquals(990,drawn.p2.life);assertEquals(1,drawn.contacts.size)
    }
    @Test fun repeatedPresentationCannotAccumulateAnglesOrMutatePhysics() {
        val w=fight("${c("AngleAdd","value=15")}\n${c("AngleDraw")}");w.step()
        val plan=CorePresentationPlanner.snapshot(w,12);val before=w.checksum();val time=w.p1.timeInState
        repeat(8){assertEquals(plan,CorePresentationPlanner.snapshot(w,12))}
        assertEquals(15.0,w.p1.drawAngleDegrees);assertEquals(before,w.checksum());assertEquals(time,w.p1.timeInState)
    }
}
