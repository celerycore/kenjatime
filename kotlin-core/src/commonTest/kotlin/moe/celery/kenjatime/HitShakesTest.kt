package moe.celery.kenjatime

import kotlin.test.*

class HitShakesTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private fun c(type: String,params: String="",trigger: String="1",state: Int=0)=
        "[State $state, shake]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("shake",air,"$idle\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(a: String="",b: String="",width: Int=320)=DeterministicFight(
        FightingCharacter(definition(a,width),1),FightingCharacter(definition(b),2))
    private fun attack(params: String)="[Statedef 200]\ntype=S\nphysics=N\nanim=200\n"+
        c("HitDef","damage=10\n$params","Time=0",200)
    private fun packet(w: DeterministicFight): HitDefinition {
        w.p1.changeState(200);w.p1.tick(w.issues);return w.p1.activeHitDef!!
    }
    private fun execute(actor: FightingCharacter,params: String="") {
        val controller=MugenCnsParser.parse("$idle\n${c("FallEnvShake",params)}").getValue(0).controllers.single()
        CoreFallEnvShake.execute(actor,controller,actor.world!!.issues)
    }
    private fun receive(w: DeterministicFight,fall: HitShakeDefinition=HitShakeDefinition(3,0.0,-8*256,90.0),
                        impact: HitShakeDefinition=HitShakeDefinition(),guarded: Boolean=false) {
        w.p2.receiveHit(HitDefinition(impactShake=impact,fallShake=fall),true,guarded,w.p1)
    }
    @Test fun ordinaryAttacksDefaultToNoImpactOrPendingShake() {
        val w=fight(attack(""));val hit=packet(w)
        assertEquals(HitShakeDefinition(),hit.impactShake);assertEquals(HitShakeDefinition(),hit.fallShake)
        w.p2.receiveHit(hit,true,attacker=w.p1);execute(w.p2);assertNull(w.environment.shake)
        assertEquals(0.0,w.p2.getHitVar("fall.envshake.time"));assertTrue(w.issues.isEmpty())
    }
    @Test fun acceptedContactAppliesImpactImmediatelyButDefersFallShake() {
        val w=fight();receive(w,impact=HitShakeDefinition(2,0.0,-5*256,90.0))
        assertEquals(5.0,w.environment.offsetY);assertEquals(3.0,w.p2.getHitVar("fall.envshake.time"))
        execute(w.p2);assertEquals(8.0,w.environment.offsetY);assertEquals(0.0,w.p2.getHitVar("fall.envshake.time"))
    }
    @Test fun consumptionClearsOnlyPendingTimeAndCannotRestartTheClock() {
        val w=fight();receive(w);val before=w.p2.getHitData;execute(w.p2)
        assertSame(before,w.p2.getHitData);w.environment.beginTick();val active=w.environment.shake
        repeat(5){execute(w.p2)};assertSame(active,w.environment.shake)
        assertEquals(0.0,w.p2.getHitVar("fall.envshake.time"));assertEquals(0.0,w.p2.getHitVar("fall.envshake.freq"))
        assertEquals(-8.0,w.p2.getHitVar("fall.envshake.ampl"));assertEquals(90.0,w.p2.getHitVar("fall.envshake.phase"))
    }
    @Test fun fallFlagAndCurrentMoveTypeDoNotGateAnExplicitFallEnvShake() {
        val w=fight();receive(w);assertFalse(w.p2.getHitData.fall)
        w.p2.changeState(0);assertEquals("I",w.p2.moveType);execute(w.p2)
        assertEquals(8.0,w.environment.offsetY);assertEquals(0,w.p2.getHitData.fallShake.time)
    }
    @Test fun freshActorsAndZeroTimeMetadataNeverCancelAnActiveShake() {
        val w=fight();w.environment.startShake(HitShakeDefinition(9));val original=w.environment.shake
        execute(w.p2);receive(w,fall=HitShakeDefinition());execute(w.p2)
        assertSame(original,w.environment.shake)
    }
    @Test fun authoredNestedExpressionsAreCapturedBeforeVariablesChange() {
        val w=fight(attack("envshake.time=ifelse(var(0),3,0)\nenvshake.ampl=-max(5,2)\n"+
            "envshake.freq=var(1)\nfall.envshake.time=var(0)+4\nfall.envshake.ampl=-8\nfall.envshake.phase=450"))
        w.p1.vars[0]=1;w.p1.vars[1]=90;val hit=packet(w);w.p1.vars[0]=0;w.p1.vars[1]=0
        w.p2.receiveHit(hit,false,attacker=w.p1)
        assertEquals(5.0,w.environment.offsetY);assertEquals(5,w.p2.getHitData.fallShake.time)
        execute(w.p2);assertEquals(8.0,w.environment.offsetY);assertEquals(450.0,w.environment.shake!!.phase)
    }
    @Test fun explicitAmplitudeUsesSourceBankExactlyOnceAndQueriesUseRecipientBank() {
        for(width in listOf(320,640,1008)) {
            val w=fight(attack("envshake.time=2\nenvshake.ampl=-20.9\nenvshake.freq=90\n"+
                "fall.envshake.time=3\nfall.envshake.ampl=-20.9\nfall.envshake.freq=90"),width=width)
            val hit=packet(w);val expected=w.p1.coordinates.toWorld(-20.0)
            w.p2.receiveHit(hit,false,attacker=w.p1);assertEquals(expected,w.environment.shake!!.amplitude256)
            assertEquals(expected/256.0,w.p2.getHitVar("fall.envshake.ampl"))
            w.p2.enterAuthoredState(0,w.p1,w.issues)
            assertEquals(w.p1.coordinates.toLocal(expected),w.p2.getHitVar("fall.envshake.ampl"))
            execute(w.p2);assertEquals(expected,w.environment.shake!!.amplitude256)
        }
    }
    @Test fun omittedAmplitudeRemainsCanonicalAtAllSourceResolutions() {
        for(width in listOf(320,640,1008)) {
            val w=fight(attack("envshake.time=2\nenvshake.freq=90\nfall.envshake.time=3\nfall.envshake.freq=90"),width=width)
            val hit=packet(w);w.p2.receiveHit(hit,false,attacker=w.p1);assertEquals(4.0,w.environment.offsetY)
            execute(w.p2);assertEquals(4.0,w.environment.offsetY)
        }
    }
    @Test fun phaseDefaultsFollowFrequencyAndExplicitZeroWins() {
        for(freq in listOf(60,90,180))for(phase in listOf("","\nfall.envshake.phase=0")) {
            val w=fight(attack("fall.envshake.time=2\nfall.envshake.freq=$freq$phase"));val hit=packet(w)
            assertEquals(if(freq>=90 && phase.isEmpty())90.0 else 0.0,hit.fallShake.phase)
        }
    }
    @Test fun guardedContactsApplyImpactButDoNotArmFallMetadata() {
        val w=fight();receive(w,impact=HitShakeDefinition(2,0.0,-5*256,90.0),guarded=true)
        assertEquals(5.0,w.environment.offsetY);assertEquals(0,w.p2.getHitData.fallShake.time)
        execute(w.p2);assertEquals(5.0,w.environment.offsetY)
    }
    @Test fun aGuardPreservesPreviouslyPendingFallDataUntilExplicitConsumption() {
        val w=fight();receive(w);val previous=w.p2.getHitData.fallShake
        receive(w,fall=HitShakeDefinition(9),guarded=true);assertSame(previous,w.p2.getHitData.fallShake)
        execute(w.p2);assertEquals(8.0,w.environment.offsetY)
    }
    @Test fun freshUnguardedContactsReplaceOrClearPendingData() {
        val w=fight();receive(w);receive(w,fall=HitShakeDefinition(5))
        assertEquals(5,w.p2.getHitData.fallShake.time)
        receive(w,fall=HitShakeDefinition());execute(w.p2);assertNull(w.environment.shake)
    }
    @Test fun rejectedHitsDoNotApplyImpactOrReplacePendingFallData() {
        val w=fight();receive(w);val previous=w.p2.getHitData.fallShake
        w.p2.receiveHit(HitDefinition(hitFlag="A",impactShake=HitShakeDefinition(9),fallShake=HitShakeDefinition(9)),true,attacker=w.p1)
        assertSame(previous,w.p2.getHitData.fallShake);assertNull(w.environment.shake)
    }
    @Test fun invalidControllerParametersDoNotConsumeOrReplaceAnyEffect() {
        for(params in listOf("time=1","value=1","redirectid=1")) {
            val w=fight();receive(w);w.environment.startShake(HitShakeDefinition(9));val previous=w.environment.shake
            execute(w.p2,params);assertSame(previous,w.environment.shake);assertEquals(3,w.p2.getHitData.fallShake.time)
            assertTrue(w.issues.any { it.startsWith("Invalid FallEnvShake:") })
        }
    }
    @Test fun invalidMetadataRejectsTheWholeHitDefAndProjectileRequest() {
        for(prefix in listOf("envshake","fall.envshake"))for(params in listOf("time=-1","time=36001","freq=181",
            "ampl=100001","phase=1000001","freq=unknown","ampl=1/0","time=1,2","mul=1")) {
            val bad="$prefix.$params"
            val w=fight(attack(bad));w.p1.changeState(200);w.p1.tick(w.issues)
            assertNull(w.p1.activeHitDef,bad);assertTrue(w.issues.isNotEmpty(),bad)
            val p=fight(c("Projectile","projanim=200\n$bad","Time=0"));p.step()
            assertTrue(p.entities.projectiles.isEmpty(),bad);assertTrue(p.issues.isNotEmpty(),bad)
        }
    }
    @Test fun invalidLaterDefinitionDoesNotDisplaceAValidCarriedAttack() {
        val w=fight(attack("envshake.time=3")+"\n"+c("HitDef","envshake.time=unknown","Time=1",200))
        val original=packet(w);w.p1.tick(w.issues);assertSame(original,w.p1.activeHitDef)
    }
    @Test fun authoredControllerHonorsHitpauseAndIgnorehitpauseWithoutDoubleConsumption() {
        for(ignore in 0..1) {
            val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
                c("FallEnvShake","ignorehitpause=$ignore",state=5000)
            val w=fight(b=hurt);receive(w);w.p2.hitPauseLeft=2;w.step()
            assertEquals(if(ignore==1)0 else 3,w.p2.getHitData.fallShake.time)
            repeat(5){w.step()};assertEquals(0,w.p2.getHitData.fallShake.time);assertNull(w.environment.shake)
        }
    }
    @Test fun pendingDurationDoesNotAgeBeforeTheControllerRuns() {
        val w=fight();receive(w);repeat(12){w.step()}
        assertEquals(3,w.p2.getHitData.fallShake.time);execute(w.p2);assertEquals(3,w.environment.shake!!.remaining)
    }
    @Test fun activeShakeAgesOncePerWorldTickThroughVictimHitpause() {
        val w=fight();receive(w);execute(w.p2);w.p2.hitPauseLeft=9
        w.step();assertEquals(2,w.environment.shake!!.remaining);w.step();assertEquals(1,w.environment.shake!!.remaining)
        w.step();assertNull(w.environment.shake);assertEquals(6,w.p2.hitPauseLeft)
    }
    @Test fun helperConsumptionIsIndependentButUsesTheSameGlobalVisualClock() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p2,9,0,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        helper.receiveHit(HitDefinition(fallShake=HitShakeDefinition(3,0.0,-6*256,90.0)),true,attacker=w.p1)
        execute(helper);assertEquals(6.0,w.environment.offsetY);assertEquals(0,w.p2.getHitData.fallShake.time)
        assertEquals(0,helper.getHitData.fallShake.time);assertFalse(w.p2.getHitData.received)
    }
    @Test fun delayedProjectileRetainsCapturedMetadataAfterCreatorStateAndVariableChanges() {
        val w=fight(c("Projectile","projanim=200\nvelocity=1,0\nprojremovetime=100\n"+
            "envshake.time=var(0)\nenvshake.freq=90\nfall.envshake.time=var(0)+1","Time=0"))
        w.p1.vars[0]=3;w.p2.posX=45*256;w.step();val projectile=w.entities.projectiles.single()
        w.p1.vars[0]=0;w.p1.changeState(999);var contact=false
        repeat(20){w.step();if(w.contacts.isNotEmpty())contact=true}
        assertTrue(contact);assertEquals(3,projectile.hit.impactShake.time);assertEquals(4,w.p2.getHitData.fallShake.time)
        execute(w.p2);assertEquals(4,w.environment.shake!!.remaining)
    }
    @Test fun multiHitProjectilesRearmPendingDataOncePerAcceptedContact() {
        val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+c("FallEnvShake",state=5000)
        val w=fight(c("Projectile","projanim=200\nprojhits=3\nfall.envshake.time=3\nfall.envshake.freq=90","Time=0"),hurt)
        w.p2.posX=5*256;w.step();val projectile=w.entities.projectiles.single();var contacts=0
        repeat(5){w.step();contacts+=w.contacts.size}
        assertEquals(3,contacts);assertEquals(3,projectile.hit.fallShake.time);assertEquals(0,w.p2.getHitData.fallShake.time)
    }
    @Test fun realBodyContactStartsImpactOnContactTickAndFallOnTheNextAuthoredTick() {
        val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+c("FallEnvShake",state=5000)
        val w=fight(attack("envshake.time=2\nenvshake.freq=90\nfall.envshake.time=3\nfall.envshake.freq=90\nfall.envshake.ampl=-8"),hurt)
        w.p2.posX=5*256;w.p1.changeState(200);w.step();assertEquals(1,w.contacts.size)
        assertEquals(4.0,w.environment.offsetY);assertEquals(3,w.p2.getHitData.fallShake.time)
        w.step();assertEquals(8.0,w.environment.offsetY);assertEquals(0,w.p2.getHitData.fallShake.time)
    }
    @Test fun presentationQueriesArePureAndShakeDoesNotChangePhysicalHitData() {
        val w=fight();receive(w);val original=w.p2.getHitData;val checksum=w.checksum();execute(w.p2)
        assertEquals(checksum,w.checksum());assertSame(original,w.p2.getHitData)
        val environment=w.environment.json();repeat(8){CorePresentationPlanner.snapshot(w,12);w.p2.getHitVar("fall.envshake.time")}
        assertEquals(environment,w.environment.json());assertEquals(checksum,w.checksum())
        assertEquals(1000,w.p2.life);assertEquals(0,w.p2.power);assertEquals(0,w.p2.velX)
    }
    @Test fun effectsAndPendingHitDataRemainIsolatedAcrossFights() {
        val a=fight();val b=fight();receive(a);execute(a.p2)
        assertEquals(8.0,a.environment.offsetY);assertNull(b.environment.shake);assertEquals(0,b.p2.getHitData.fallShake.time)
    }
}
