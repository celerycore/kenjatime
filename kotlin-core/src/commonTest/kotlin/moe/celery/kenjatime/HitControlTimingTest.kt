package moe.celery.kenjatime

import kotlin.test.*

/** Captured CNS thresholds, with authored control/slide decisions and unchanged hit clocks. */
class HitControlTimingTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=1"
    private val states="$idle\n[Statedef 400]\ntype=A\nphysics=N\nanim=0\nctrl=1\n"+
        "[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\nctrl=0\n"+
        "[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0\nctrl=0\n"+
        "[Statedef 152]\ntype=S\nmovetype=H\nphysics=N\nanim=0\nctrl=0"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("control timing",air,
        "$states\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="",reaction: String="",width: Int=320)=DeterministicFight(
        FightingCharacter(definition(extra,width),1),FightingCharacter(definition(reaction),2))
    private fun source(params: String)="[Statedef 200]\ntype=S\nphysics=N\nanim=200\n[State 200, hit]\n"+
        "type=HitDef\ntrigger1=Time=0\ndamage=0\n$params"
    private fun packet(w: DeterministicFight): HitDefinition {
        w.p1.changeState(200);w.p1.tick(w.issues);return w.p1.activeHitDef!!
    }
    private fun receive(w: DeterministicFight,hit: HitDefinition,airborne: Boolean=false,guarded: Boolean=true) {
        if(airborne)w.p2.changeState(400)
        w.p2.receiveHit(hit,true,guarded,w.p1)
    }
    private fun query(w: DeterministicFight,key: String)=CoreExpression.number("GetHitVar($key)",w.p2,w.issues)
    @Test fun freshActorsHaveZeroSlideAndControlThresholds() {
        val w=fight();assertEquals(0.0,query(w,"slidetime"));assertEquals(0.0,query(w,"ctrltime"))
    }
    @Test fun defaultChainUsesResolvedGuardHitTimeAndZeroGroundSlide() {
        val w=fight(source("ground.hittime=2\nguard.hittime=5"));val hit=packet(w)
        assertEquals(0,hit.groundSlideTime);assertEquals(5,hit.guardSlideTime)
        assertEquals(5,hit.guardControlTime);assertEquals(5,hit.airGuardControlTime)
    }
    @Test fun existingHitTimeDefaultsRemainTwelveAndFeedTheNewThresholds() {
        val w=fight(source(""));val hit=packet(w)
        assertEquals(12,hit.hitTime);assertEquals(12,hit.guardHitTime);assertEquals(12,hit.guardSlideTime)
        assertEquals(12,hit.guardControlTime);assertEquals(12,hit.airGuardControlTime)
    }
    @Test fun groundSlideDoesNotReplaceTheGuardHitTimeDefaultChain() {
        val w=fight(source("ground.hittime=6\nground.slidetime=9"));val hit=packet(w)
        assertEquals(9,hit.groundSlideTime);assertEquals(6,hit.guardSlideTime);assertEquals(6,hit.guardControlTime)
    }
    @Test fun eachExplicitThresholdOverridesOnlyItsOwnInheritanceBranch() {
        for((params,expected) in listOf("guard.slidetime=3" to listOf(3,3,3),
            "guard.ctrltime=2" to listOf(5,2,2),"airguard.ctrltime=1" to listOf(5,5,1))) {
            val w=fight(source("guard.hittime=5\n$params"));val hit=packet(w)
            assertEquals(expected,listOf(hit.guardSlideTime,hit.guardControlTime,hit.airGuardControlTime))
        }
    }
    @Test fun nestedExpressionsCaptureActorVariablesAtInstallation() {
        val w=fight(source("ground.slidetime=ifelse(var(0),max(1,2),0)\nguard.slidetime=max(2,4)\n"+
            "guard.ctrltime=ifelse(var(0),3,9)\nairguard.ctrltime=min(1,5)"))
        w.p1.vars[0]=1;val hit=packet(w);w.p1.vars[0]=0
        assertEquals(2,hit.groundSlideTime);assertEquals(4,hit.guardSlideTime)
        assertEquals(3,hit.guardControlTime);assertEquals(1,hit.airGuardControlTime)
    }
    @Test fun guardPostureSelectsControlThresholdBeforeReactionMetadataChangesIt() {
        for(airborne in listOf(false,true)) {
            val w=fight();receive(w,HitDefinition(guardSlideTime=4,guardControlTime=3,airGuardControlTime=1),airborne)
            assertEquals("S",w.p2.stateType);assertEquals(4.0,query(w,"slidetime"))
            assertEquals(if(airborne)1.0 else 3.0,query(w,"ctrltime"))
        }
    }
    @Test fun unguardedGroundAndAirHitsCaptureGroundSlideTime() {
        for(airborne in listOf(false,true)) {
            val w=fight();receive(w,HitDefinition(groundSlideTime=7,guardSlideTime=4),airborne,guarded=false)
            assertEquals(7.0,query(w,"slidetime"));assertEquals(0.0,query(w,"ctrltime"))
        }
    }
    @Test fun unguardedHitsPreserveThePreviousGuardControlThreshold() {
        val w=fight();receive(w,HitDefinition(guardControlTime=3));assertEquals(3.0,query(w,"ctrltime"))
        receive(w,HitDefinition(groundSlideTime=7,guardControlTime=20),guarded=false)
        assertEquals(7.0,query(w,"slidetime"));assertEquals(3.0,query(w,"ctrltime"))
    }
    @Test fun thresholdsRemainStaticWhileHitTimeCountsDownAndPauseExpires() {
        val w=fight();receive(w,HitDefinition(guardHitTime=2,guardDefenderPause=2,guardSlideTime=4,guardControlTime=3))
        repeat(6){w.p2.tick(w.issues);assertEquals(4.0,query(w,"slidetime"));assertEquals(3.0,query(w,"ctrltime"))}
        assertEquals(-1,w.p2.getHitData.time);assertEquals(0,w.p2.hitPauseLeft)
    }
    @Test fun authoredCtrlSetWaitsForCompletedActiveGuardTicks() {
        val reaction="[State 150, control]\ntype=CtrlSet\ntrigger1=Time>=GetHitVar(ctrltime)\nvalue=1"
        for(pause in listOf(0,2)) {
            val w=fight(reaction=reaction);receive(w,HitDefinition(guardDefenderPause=pause,guardControlTime=3))
            repeat(pause+3){w.p2.tick(w.issues);assertFalse(w.p2.control)}
            w.p2.tick(w.issues);assertTrue(w.p2.control);assertEquals(3.0,query(w,"ctrltime"))
        }
    }
    @Test fun authoredVelSetStopsSlidingAtTheCapturedThreshold() {
        val w=fight(reaction="[State 150, stop]\ntype=VelSet\ntrigger1=Time>=GetHitVar(slidetime)\nx=0")
        receive(w,HitDefinition(guardVelocityX=512,guardSlideTime=2));repeat(2){w.p2.tick(w.issues)}
        assertEquals(1024,w.p2.posX);assertEquals(512,w.p2.velX)
        w.p2.tick(w.issues);assertEquals(0,w.p2.velX);assertEquals(1024,w.p2.posX)
    }
    @Test fun zeroAndSignedThresholdsPermitImmediateAuthoredConditions() {
        for(time in listOf(0,-2,Int.MIN_VALUE)) {
            val w=fight(source("guard.slidetime=$time\nguard.ctrltime=$time"),
                reaction="[State 150, control]\ntype=CtrlSet\ntrigger1=Time>=GetHitVar(ctrltime)\nvalue=1")
            receive(w,packet(w));assertEquals(time.toDouble(),query(w,"slidetime"))
            w.p2.tick(w.issues);assertTrue(w.p2.control);assertEquals(time.toDouble(),query(w,"ctrltime"))
        }
    }
    @Test fun hitOverAndGuardControlEligibilityAreIndependent() {
        val w=fight(reaction="[State 150, control]\ntype=CtrlSet\ntrigger1=Time>=GetHitVar(ctrltime)\nvalue=1")
        receive(w,HitDefinition(guardHitTime=1,guardControlTime=4));repeat(2){w.p2.tick(w.issues)}
        assertTrue(w.p2.hitOver);assertFalse(w.p2.control)
        repeat(2){w.p2.tick(w.issues)};assertFalse(w.p2.control);w.p2.tick(w.issues);assertTrue(w.p2.control)
    }
    @Test fun thresholdsAloneDoNotAutomaticallyStopMotionOrRestoreControl() {
        val w=fight();receive(w,HitDefinition(guardVelocityX=256,guardSlideTime=0,guardControlTime=0))
        repeat(3){w.p2.tick(w.issues)};assertFalse(w.p2.control);assertEquals(256,w.p2.velX);assertEquals(768,w.p2.posX)
    }
    @Test fun getHitStateChangesKeepThresholdsWhileStateTimeRestarts() {
        val w=fight();receive(w,HitDefinition(guardSlideTime=4,guardControlTime=3));repeat(2){w.p2.tick(w.issues)}
        w.p2.changeState(152);assertEquals(0,w.p2.timeInState)
        assertEquals(4.0,query(w,"slidetime"));assertEquals(3.0,query(w,"ctrltime"))
    }
    @Test fun borrowedBanksAndMixedLocalCoordinatesNeverScaleTickThresholds() {
        for(width in listOf(640,1008)) {
            val w=fight(source("guard.slidetime=4\nguard.ctrltime=3"),width=width);receive(w,packet(w))
            val bank=FightingCharacter(definition(width=width),3);w.p2.enterAuthoredState(150,bank,w.issues)
            assertEquals(4.0,query(w,"slidetime"));assertEquals(3.0,query(w,"ctrltime"))
        }
    }
    @Test fun invalidThresholdsCannotInstallOrReplaceAnAttack() {
        for(key in listOf("ground.slidetime","guard.slidetime","guard.ctrltime","airguard.ctrltime"))
            for(raw in listOf("unknown","1/0","1,2","2147483648","-2147483649")) {
                val w=fight(source("$key=$raw"));w.p1.changeState(200);w.p1.tick(w.issues)
                assertNull(w.p1.activeHitDef);assertTrue(w.issues.any{it.startsWith("Invalid hit control timing:")})
            }
        val w=fight(source("guard.ctrltime=3")+"\n[State 200, invalid]\ntype=HitDef\ntrigger1=Time=1\nairguard.ctrltime=unknown")
        val original=packet(w);w.p1.tick(w.issues);assertSame(original,w.p1.activeHitDef)
    }
    @Test fun invalidProjectileThresholdsCannotQueueAShot() {
        for(key in listOf("ground.slidetime","guard.slidetime","guard.ctrltime","airguard.ctrltime")) {
            val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n$key=unknown")
            w.step();assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun projectileAliasesAndDefaultsUseTheResolvedGuardDuration() {
        val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nprojguard.hittime=7\n"+
            "projground.slidetime=5\nprojguard.slidetime=4\nprojguard.ctrltime=3\nprojairguard.ctrltime=2\nairguard.ctrltime=1")
        w.step();val hit=w.entities.projectiles.single().hit
        assertEquals(7,hit.guardHitTime);assertEquals(5,hit.groundSlideTime);assertEquals(4,hit.guardSlideTime)
        assertEquals(3,hit.guardControlTime);assertEquals(1,hit.airGuardControlTime)
    }
    @Test fun projectileThresholdsRemainCapturedAfterSourceVariablesChange() {
        val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nguard.slidetime=var(0)")
        w.p1.vars[0]=4;w.step();val hit=w.entities.projectiles.single().hit;w.p1.vars[0]=9
        assertEquals(4,hit.guardSlideTime);assertEquals(4,hit.guardControlTime);assertEquals(4,hit.airGuardControlTime)
    }
    @Test fun helperVictimsOwnTheirSlideAndControlData() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p2,9,400,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        helper.receiveHit(HitDefinition(guardSlideTime=4,airGuardControlTime=2),true,true,w.p1)
        assertEquals(4,helper.getHitData.slideTime);assertEquals(2,helper.getHitData.controlTime)
        assertEquals(0,w.p2.getHitData.slideTime);assertEquals(0,w.p2.getHitData.controlTime)
    }
    @Test fun freshGuardContactsReplaceThePriorThresholds() {
        val w=fight();receive(w,HitDefinition(guardSlideTime=4,guardControlTime=3))
        receive(w,HitDefinition(guardSlideTime=8,airGuardControlTime=2),airborne=true)
        assertEquals(8.0,query(w,"slidetime"));assertEquals(2.0,query(w,"ctrltime"))
    }
    @Test fun pureReadsPreserveMotionLifePowerPauseAndReactionData() {
        val w=fight();receive(w,HitDefinition(guardDamage=2,guardSlideTime=4,guardControlTime=3,guardDefenderPause=2))
        val data=w.p2.getHitData.copy();val before=w.checksum();val power=w.p2.power
        repeat(8){query(w,"slidetime");query(w,"ctrltime");CorePresentationPlanner.snapshot(w,12)}
        assertEquals(data,w.p2.getHitData);assertEquals(before,w.checksum());assertEquals(power,w.p2.power)
        assertEquals(998,w.p2.life);assertEquals(2,w.p2.hitPauseLeft)
    }
}
