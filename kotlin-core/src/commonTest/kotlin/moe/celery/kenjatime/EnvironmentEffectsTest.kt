package moe.celery.kenjatime

import kotlin.test.*
import kotlin.math.sin
import kotlin.math.PI

class EnvironmentEffectsTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n0,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nanim=0"
    private fun c(type: String,params: String="",trigger: String="1",state: Int=0)=
        "[State $state, environment]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("environment",air,"$idle\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(a: String="",b: String="")=DeterministicFight(FightingCharacter(definition(a),1),FightingCharacter(definition(b),2))
    private fun execute(w: DeterministicFight,type: String,params: String) {
        val ctl=MugenCnsParser.parse(c(type,params)).getValue(0).controllers.single()
        w.environment.execute(w.p1,ctl,w.issues)
    }
    private fun near(expected: Double,actual: Double)=assertEquals(expected,actual,1e-8)
    private fun plan(w: DeterministicFight)=CorePresentationPlanner.snapshot(w,0)
    private fun field(json: String,key: String)=Regex("\\\"$key\\\":(-?[0-9.Ee+\\-]+)").find(json)!!.groupValues[1].toDouble()
    @Test fun newFightsHaveNoColorOrShake() {
        val w=fight();assertNull(w.environment.color);assertNull(w.environment.shake);assertEquals(0.0,w.environment.offsetY)
        assertEquals("{\"color\":null,\"shake\":null,\"offsetY\":0.0}",w.environment.json())
    }
    @Test fun defaultColorIsWhiteOverTheSceneForExactlyOneTick() {
        val w=fight(c("EnvColor",trigger="Time=0"));w.step()
        assertEquals(CoreEnvironmentColor(255,255,255,1,false),w.environment.color)
        assertFalse(plan(w).contains("\"kind\":\"fighter\""));w.step()
        assertNull(w.environment.color);assertTrue(plan(w).contains("\"kind\":\"fighter\""))
    }
    @Test fun finiteColorDurationHasTheAuthoredNumberOfVisibleTicks() {
        val w=fight(c("EnvColor","time=3\nvalue=12,34,56",trigger="Time=0"))
        for(remaining in 3 downTo 1){w.step();assertEquals(remaining,w.environment.color!!.remaining)}
        w.step();assertNull(w.environment.color)
    }
    @Test fun indefiniteColorPersistsUntilAnExplicitZeroDuration() {
        val w=fight(c("EnvColor","time=-1",trigger="Time=0"));repeat(10){w.step()}
        assertEquals(-1,w.environment.color!!.remaining);execute(w,"EnvColor","time=0");assertNull(w.environment.color)
    }
    @Test fun colorExpressionsAndBooleanUnderUseTheExecutingActorsVariables() {
        val w=fight(c("EnvColor","value=ifelse(var(0),12,0),max(34,2),min(56,255)\ntime=var(1)\nunder=-.5"))
        w.p1.vars[0]=1;w.p1.vars[1]=4;w.step();assertEquals(CoreEnvironmentColor(12,34,56,4,true),w.environment.color)
        assertTrue(plan(w).contains("\"kind\":\"fighter\""))
    }
    @Test fun colorIntegerParametersTruncateAfterValidation() {
        val w=fight();execute(w,"EnvColor","value=12.9,34.9,56.9\ntime=2.9\nunder=0")
        assertEquals(CoreEnvironmentColor(12,34,56,2,false),w.environment.color)
    }
    @Test fun invalidColorRequestsPreserveTheWholeEarlierEffect() {
        for(params in listOf("value=1,2","value=1,2,3,4","value=1,unknown,3","value=-1,2,3","value=256,2,3",
            "time=-2","time=36001","under=1/0","value=2,3,4\nfreq=90")) {
            val w=fight();execute(w,"EnvColor","value=12,34,56\ntime=-1\nunder=1");val previous=w.environment.color
            execute(w,"EnvColor",params);assertSame(previous,w.environment.color);assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun defaultShakeUsesDegreesPerTickAndTheCanonicalAmplitude() {
        val w=fight(c("EnvShake","time=3",trigger="Time=0"));w.step();near(0.0,w.environment.offsetY)
        assertEquals(-4*256,w.environment.shake!!.amplitude256);assertEquals(60.0,w.environment.shake!!.frequency)
        w.step();near(4*sin(PI/3),w.environment.offsetY);w.step();near(4*sin(2*PI/3),w.environment.offsetY)
        w.step();assertNull(w.environment.shake);near(0.0,w.environment.offsetY)
    }
    @Test fun highFrequencyDefaultsToNinetyDegreesAndExplicitPhaseOverridesIt() {
        for(freq in listOf(89.9,90.0,180.0)) {
            val w=fight();execute(w,"EnvShake","time=2\nfreq=$freq")
            assertEquals(if(freq>=90)90.0 else 0.0,w.environment.shake!!.phase)
            near(if(freq>=90)4.0 else 0.0,w.environment.offsetY)
            execute(w,"EnvShake","time=2\nfreq=$freq\nphase=0");near(0.0,w.environment.offsetY)
        }
    }
    @Test fun signedAmplitudeAndWrappedPhaseChooseTheInitialDirection() {
        for(amplitude in listOf(-8,8))for(phase in listOf(-90,90,450)) {
            val w=fight();execute(w,"EnvShake","time=3\nfreq=0\nampl=$amplitude\nphase=$phase")
            near(-amplitude*sin(phase*PI/180),w.environment.offsetY)
        }
    }
    @Test fun zeroFrequencyCanHoldAConstantVisualDisplacement() {
        val w=fight(c("EnvShake","time=3\nfreq=0\nphase=90",trigger="Time=0"))
        repeat(3){w.step();near(4.0,w.environment.offsetY)};w.step();near(0.0,w.environment.offsetY)
    }
    @Test fun zeroAmplitudeHasAClockButNoVisualDisplacement() {
        val w=fight();execute(w,"EnvShake","time=3\nampl=0\nphase=90")
        assertNotNull(w.environment.shake);near(0.0,w.environment.offsetY)
    }
    @Test fun explicitAmplitudesUseActiveCoordinatesWhileDefaultsStayResolutionIndependent() {
        for(width in listOf(320,640,1008)) {
            val w=DeterministicFight(FightingCharacter(definition(width=width),1),FightingCharacter(definition(),2))
            execute(w,"EnvShake","time=3\nfreq=90");near(4.0,w.environment.offsetY)
            execute(w,"EnvShake","time=3\nfreq=90\nampl=-8.9")
            near(-w.p1.coordinates.toWorld(-8.0)/256.0,w.environment.offsetY)
        }
    }
    @Test fun zeroDurationCancelsShakeWithoutCancelingColor() {
        val w=fight();execute(w,"EnvColor","time=-1");execute(w,"EnvShake","time=3\nfreq=90")
        execute(w,"EnvShake","time=0");assertNull(w.environment.shake);assertNotNull(w.environment.color)
        execute(w,"EnvShake","time=3");execute(w,"EnvColor","time=0");assertNotNull(w.environment.shake)
    }
    @Test fun invalidShakeRequestsPreserveClockPhaseAndAmplitude() {
        for(params in listOf("","time=-1","time=36001","time=3\nfreq=-1","time=3\nfreq=181",
            "time=3\nampl=100001","time=3\nphase=1000001","time=3\nphase=unknown","time=3\nmul=.5")) {
            val w=fight();execute(w,"EnvShake","time=5\nfreq=90\nampl=-8");val previous=w.environment.shake
            execute(w,"EnvShake",params);assertSame(previous,w.environment.shake);assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun visualClocksContinueDuringBothActorsHitpause() {
        val w=fight(c("EnvColor","time=3",trigger="Time=0")+"\n"+c("EnvShake","time=3\nfreq=90",trigger="Time=0"))
        w.step();w.p1.hitPauseLeft=3;w.p2.hitPauseLeft=3
        w.step();assertEquals(2,w.environment.color!!.remaining);assertEquals(1,w.environment.shake!!.age)
        w.step();assertEquals(1,w.environment.color!!.remaining);w.step()
        assertNull(w.environment.color);assertNull(w.environment.shake);assertEquals(1,w.p1.timeInState)
    }
    @Test fun ignorehitpauseControlsWhetherControllersCanReplaceEffects() {
        for(ignore in 0..1) {
            val w=fight(c("EnvColor","time=ifelse(Time=0,3,0)\nignorehitpause=$ignore")+"\n"+
                c("EnvShake","time=ifelse(Time=0,3,0)\nignorehitpause=$ignore"))
            w.step();w.p1.hitPauseLeft=2;w.step()
            assertEquals(ignore==0,w.environment.color!=null);assertEquals(ignore==0,w.environment.shake!=null)
        }
    }
    @Test fun persistenceZeroRearmsOnStateEntryWithoutRenderParticipation() {
        val w=fight(c("EnvColor","persistent=0"));w.step();assertNotNull(w.environment.color)
        w.step();assertNull(w.environment.color);w.p1.changeState(0);w.step();assertNotNull(w.environment.color)
    }
    @Test fun stateEntryDoesNotResetGlobalVisualLifetimes() {
        val w=fight(c("EnvColor","time=5",trigger="Time=0")+"\n[Statedef 300]\ntype=S\nphysics=N\nanim=0")
        w.step();w.p1.changeState(300);w.step();assertEquals(4,w.environment.color!!.remaining)
    }
    @Test fun lastValidActorOrHelperRequestWinsInControllerOrder() {
        val w=fight(c("EnvColor","value=12,0,0\ntime=5"),c("EnvColor","value=0,34,0\ntime=5"))
        w.step();assertEquals(34,w.environment.color!!.green)
        val d=definition("[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+c("EnvColor","value=0,0,56\ntime=5",state=700))
        val h=FightingCharacter(d,3);h.parent=w.p1;h.world=w;h.opponent=w.p2;h.changeState(700)
        w.entities.helpers.add(HelperEntity(w.p1,h,9,false));w.step();assertEquals(56,w.environment.color!!.blue)
        h.destroyed=true;w.p1.changeState(300);w.p2.changeState(300);w.step();assertEquals(4,w.environment.color!!.remaining)
    }
    @Test fun borrowedBanksEvaluateExecutingVariablesIntoTheActualFightsEffect() {
        val w=fight();val bank=FightingCharacter(definition("[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+
            c("EnvShake","time=3\nfreq=0\nphase=90\nampl=var(0)",state=700),640),3)
        w.p1.vars[0]=-8;bank.vars[0]=-60;w.p1.enterAuthoredState(700,bank,w.issues);w.step()
        near(4.0,w.environment.offsetY);assertEquals(-4*256,w.environment.shake!!.amplitude256)
    }
    @Test fun differentFightsDoNotShareEnvironmentState() {
        val a=fight();val b=fight();execute(a,"EnvColor","time=-1");execute(a,"EnvShake","time=3\nfreq=90")
        assertNull(b.environment.color);assertNull(b.environment.shake);near(0.0,b.environment.offsetY)
    }
    private fun mixedScene(): DeterministicFight {
        val w=fight("[Statedef 700]\ntype=S\nphysics=N\nanim=0")
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,700,0,0,1,false,0)),w.issues)
        val ordinary=c("Explod","id=1\nanim=0\nremovetime=-1\nsprpriority=5")
        val top=c("Explod","id=2\nanim=0\nremovetime=-1\nontop=1")
        for(raw in listOf(ordinary,top))w.effects.execute(w.p1,MugenCnsParser.parse(raw).getValue(0).controllers.single(),w.p1)
        return w
    }
    @Test fun overColorKeepsOnlyOnTopExplodsInThePainterQueue() {
        val w=mixedScene();execute(w,"EnvColor","value=12,34,56\ntime=-1")
        val p=plan(w);assertFalse(p.contains("\"kind\":\"fighter\""));assertFalse(p.contains("\"kind\":\"helper\""))
        assertFalse(p.contains("\"effectId\":1,"));assertTrue(p.contains("\"effectId\":2,"))
        assertEquals(2,w.effects.all.size);assertEquals(1,w.entities.helpers.size)
    }
    @Test fun underColorRetainsAllActorsAndOrdinaryEffects() {
        val w=mixedScene();execute(w,"EnvColor","under=1\ntime=-1");val p=plan(w)
        assertTrue(p.contains("\"kind\":\"fighter\""));assertTrue(p.contains("\"kind\":\"helper\""));assertTrue(p.contains("\"effectId\":1,"))
    }
    @Test fun shakeUsesViewportScaleOnceAndLeavesCameraAndPhysicsAlone() {
        val a=fight(c("EnvShake","time=3\nfreq=90",trigger="Time=0"));val b=fight()
        for(w in listOf(a,b)){w.configureArena(-2000,2000);w.p1.posX=-900*256;w.p2.posX=900*256;w.step()}
        val expected=4*1.1*a.camera!!.zoom
        near(expected,field(plan(a),"stageOffsetY"));near(expected,field(plan(a),"axisY")-field(plan(b),"axisY"))
        assertEquals(b.checksum(),a.checksum());assertEquals(b.camera!!.y,a.camera!!.y)
    }
    @Test fun colorAndShakeCannotPreventHitsOrAlterCombatState() {
        fun replay(visual: Boolean): DeterministicFight {
            val extra=if(visual)c("EnvColor","time=5",state=200)+"\n"+c("EnvShake","time=5\nfreq=90",state=200) else ""
            val w=fight("[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n$extra\n"+
                c("HitDef","damage=10",trigger="Time=0",state=200))
            w.p1.changeState(200);w.p2.posX=5*256;w.step();return w
        }
        val a=replay(true);val b=replay(false);assertEquals(b.checksum(),a.checksum());assertEquals(b.contacts,a.contacts)
        assertEquals(990,a.p2.life);assertEquals(b.p1.attackBoxes(),a.p1.attackBoxes());assertEquals(b.p2.hurtBoxes(),a.p2.hurtBoxes())
    }
    @Test fun repeatedPresentationReadsNeverAgeEitherVisualEffect() {
        val w=fight(c("EnvColor","time=5\nunder=1")+"\n"+c("EnvShake","time=5\nfreq=90"));w.step()
        val json=w.environment.json();val p=plan(w);val checksum=w.checksum()
        repeat(8){assertEquals(p,plan(w));assertEquals(json,w.environment.json())};assertEquals(checksum,w.checksum())
    }
}
