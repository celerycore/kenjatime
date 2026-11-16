package moe.celery.kenjatime

import kotlin.test.*

/** Authored recoil physics and the existing reaction clocks, not automatic common-state gravity. */
class HitAccelerationTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private val hurt="[Statedef 5000]\ntype=A\nmovetype=H\nphysics=N\nanim=0"
    private val guard="[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 152]\ntype=A\nmovetype=H\nphysics=N\nanim=0"
    private val accel="[State 5000, authored gravity]\ntype=VelAdd\ntrigger1=HitShakeOver\ny=GetHitVar(yaccel)"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("acceleration",air,
        "$idle\n$hurt\n$guard\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="",reaction: String="",sourceWidth: Int=320,victimWidth: Int=320)=DeterministicFight(
        FightingCharacter(definition(extra,sourceWidth),1),FightingCharacter(definition(reaction,victimWidth),2))
    private fun source(params: String)="[Statedef 200]\ntype=S\nphysics=N\nanim=200\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=0\n$params"
    private fun packet(w: DeterministicFight): HitDefinition {
        w.p1.changeState(200);w.p1.tick(w.issues);return w.p1.activeHitDef!!
    }
    private fun hit(w: DeterministicFight,acceleration: Int=128,pause: Int=0,time: Int=2,guarded: Boolean=false)=
        w.p2.receiveHit(HitDefinition(hitAccelerationY=acceleration,defenderPause=pause,guardDefenderPause=pause,
            hitTime=time,guardHitTime=time,airHitTime=time),true,guarded,w.p1)
    private fun query(actor: FightingCharacter,expression: String)=CoreExpression.number(expression,actor,actor.world!!.issues)
    @Test fun omittedAccelerationHasACanonicalDefaultAcrossSourceCoordinates() {
        for(width in listOf(320,640,1008)) {
            val w=fight(source(""),sourceWidth=width);val hit=packet(w)
            assertEquals(Fixed.of(.35),hit.hitAccelerationY)
            w.p2.receiveHit(hit,true,attacker=w.p1);assertEquals(Fixed.of(.35)/256.0,query(w.p2,"GetHitVar(yaccel)"))
        }
    }
    @Test fun movementGravityDoesNotReplaceHitAccelerationDefaults() {
        val w=fight("[Movement]\nyaccel=2\n${source("")}")
        assertEquals(Fixed.of(2.0),w.p1.definition.airGravity);assertEquals(Fixed.of(.35),packet(w).hitAccelerationY)
    }
    @Test fun equivalentAuthoredAccelerationsConvertOnceAcrossSourceWidths() {
        for(width in listOf(320,640,1008)) {
            val w=fight(source("yaccel=${.5*width/320}"),sourceWidth=width)
            assertEquals(128,packet(w).hitAccelerationY)
        }
    }
    @Test fun zeroAndNegativeAccelerationAreDistinctFromTheOmittedDefault() {
        for((raw,expected) in listOf("0" to 0,"-0.5" to -128)) {
            val w=fight(source("yaccel=$raw"));assertEquals(expected,packet(w).hitAccelerationY)
            w.p2.receiveHit(w.p1.activeHitDef!!,true,attacker=w.p1)
            assertEquals(expected/256.0,query(w.p2,"GetHitVar(yaccel)"))
        }
    }
    @Test fun nestedExpressionsAreCapturedBeforeSourceVariablesChange() {
        val w=fight(source("yaccel=ifelse(var(0),max(.25,.5),.75)"))
        w.p1.vars[0]=1;val hit=packet(w);w.p1.vars[0]=0
        w.p2.receiveHit(hit,true,attacker=w.p1);assertEquals(.5,query(w.p2,"GetHitVar(yaccel)"))
    }
    @Test fun authoredAccelerationDoesNotDependOnImpactOrLaterFacing() {
        for(facing in listOf(false,true)) {
            val w=fight();w.p2.receiveHit(HitDefinition(hitAccelerationY=128),facing,attacker=w.p1)
            w.p2.facingRight=!facing;assertEquals(.5,query(w.p2,"GetHitVar(yaccel)"))
        }
    }
    @Test fun guardAndAirReactionsCaptureTheSamePerHitAcceleration() {
        for(type in listOf("S","A"))for(guarded in listOf(false,true)) {
            val w=fight();w.p2.changeState(if(type=="A")5000 else 0);hit(w,guarded=guarded)
            assertEquals(128,w.p2.getHitData.accelerationY);assertEquals(.5,query(w.p2,"GetHitVar(yaccel)"))
        }
    }
    @Test fun freshActorsHaveNoIncomingAccelerationAndExpiredClocks() {
        val w=fight();assertEquals(0.0,query(w.p2,"GetHitVar(yaccel)"))
        assertEquals(1.0,query(w.p2,"HitOver"));assertEquals(1.0,query(w.p2,"HitShakeOver"))
    }
    @Test fun accelerationIsAvailableDuringHitpauseWithoutAutomaticallyChangingVelocity() {
        val w=fight();hit(w,pause=3)
        repeat(4){w.p2.tick(w.issues);assertEquals(.5,query(w.p2,"GetHitVar(yaccel)"));assertEquals(0,w.p2.velY)}
    }
    @Test fun authoredVelAddAppliesCapturedAccelerationOncePerActiveTick() {
        val w=fight(reaction="$hurt\n$accel")
        w.p2.receiveHit(HitDefinition(hitAccelerationY=128,velocityY=-512),true,attacker=w.p1)
        for(expected in listOf(-384,-256,-128,0)) {w.p2.tick(w.issues);assertEquals(expected,w.p2.velY)}
        assertEquals(-768,w.p2.posY);assertEquals(1000,w.p2.life);assertEquals(0,w.p2.power)
    }
    @Test fun normalControllersWaitThroughTheFinalFrozenTick() {
        val w=fight(reaction="$hurt\n$accel");hit(w,pause=2)
        repeat(2){w.p2.tick(w.issues);assertEquals(0,w.p2.velY)}
        assertTrue(w.p2.hitShakeOver);w.p2.tick(w.issues);assertEquals(128,w.p2.velY)
    }
    @Test fun ignorehitpauseObserversSeeTheExistingClockBoundary() {
        val w=fight(reaction="$hurt\n[State 5000, observe]\ntype=VarSet\ntrigger1=1\nignorehitpause=1\nv=0\n"+
            "value=HitShakeOver*100+HitOver*10+GetHitVar(hittime)")
        hit(w,pause=2,time=2);w.p2.tick(w.issues);assertEquals(2,w.p2.vars[0])
        w.p2.tick(w.issues);assertEquals(102,w.p2.vars[0]);w.p2.tick(w.issues);assertEquals(101,w.p2.vars[0])
        w.p2.tick(w.issues);assertEquals(100,w.p2.vars[0]);w.p2.tick(w.issues);assertEquals(109,w.p2.vars[0])
    }
    @Test fun hitOverBecomesTrueOnlyBelowZeroAndStopsAtMinusOne() {
        val w=fight();hit(w,time=2);assertFalse(w.p2.hitOver)
        for(expected in listOf(1,0,-1,-1)) {
            w.p2.tick(w.issues);assertEquals(expected,w.p2.getHitData.time)
            assertEquals(if(expected<0)1.0 else 0.0,query(w.p2,"HitOver"))
        }
    }
    @Test fun zeroHitTimeStillAllowsItsZeroBoundaryBeforeExpiry() {
        val w=fight();hit(w,time=0);assertEquals(0.0,query(w.p2,"HitOver"))
        w.p2.tick(w.issues);assertEquals(1.0,query(w.p2,"HitOver"))
    }
    @Test fun hitOverCanDriveAnAuthoredRecoveryWithoutAnotherContact() {
        val w=fight(reaction="$hurt\n[State 5000, recover]\ntype=SelfState\ntrigger1=HitOver\nvalue=0")
        hit(w,time=2);repeat(2){w.p2.tick(w.issues);assertEquals(5000,w.p2.stateNo)}
        w.p2.tick(w.issues);assertEquals(0,w.p2.stateNo);assertTrue(w.contacts.isEmpty())
    }
    @Test fun guardedAndAirClocksUseTheirSelectedDuration() {
        for(type in listOf("S","A"))for(guarded in listOf(false,true)) {
            val w=fight();w.p2.changeState(if(type=="A")5000 else 0)
            w.p2.receiveHit(HitDefinition(hitTime=2,airHitTime=4,guardHitTime=3),true,guarded,w.p1)
            val duration=if(guarded)3 else if(type=="A")4 else 2
            repeat(duration){w.p2.tick(w.issues);assertFalse(w.p2.hitOver)}
            w.p2.tick(w.issues);assertTrue(w.p2.hitOver)
        }
    }
    @Test fun borrowedBanksQueryAndApplyAccelerationInTheirActiveUnits() {
        for(width in listOf(640,1008)) {
            val w=fight();hit(w);val bank=FightingCharacter(definition("$hurt\n$accel",width),3)
            w.p2.enterAuthoredState(5000,bank,w.issues)
            assertEquals(.5*width/320,query(w.p2,"GetHitVar(yaccel)"))
            w.p2.tick(w.issues);assertEquals(128,w.p2.velY);assertEquals(128,w.p2.getHitData.accelerationY)
            w.p2.changeState(5000,w.p2);assertEquals(.5,query(w.p2,"GetHitVar(yaccel)"))
        }
    }
    @Test fun aNewAcceptedContactReplacesAccelerationAndRestartsReactionClocks() {
        val w=fight();hit(w,acceleration=128,time=0);w.p2.tick(w.issues);assertTrue(w.p2.hitOver)
        hit(w,acceleration=-256,pause=2,time=4)
        assertEquals(-1.0,query(w.p2,"GetHitVar(yaccel)"));assertFalse(w.p2.hitOver);assertFalse(w.p2.hitShakeOver)
    }
    @Test fun helpersOwnTheirIncomingAccelerationAndClocks() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p2,9,0,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        helper.receiveHit(HitDefinition(hitAccelerationY=128,hitTime=2),true,attacker=w.p1)
        assertEquals(.5,query(helper,"GetHitVar(yaccel)"));assertFalse(helper.hitOver)
        assertEquals(0.0,query(w.p2,"GetHitVar(yaccel)"));assertTrue(w.p2.hitOver)
    }
    @Test fun invalidAccelerationCannotInstallOrReplaceAWorkingHitDefinition() {
        for(raw in listOf("unknown","1/0",".5,1")) {
            val w=fight(source("yaccel=$raw"));w.p1.changeState(200);w.p1.tick(w.issues)
            assertNull(w.p1.activeHitDef);assertTrue(w.issues.any{it.startsWith("Invalid hit acceleration:")})
        }
        val w=fight(source("yaccel=.5")+"\n[State 200, invalid]\ntype=HitDef\ntrigger1=Time=1\nyaccel=unknown")
        val original=packet(w);w.p1.tick(w.issues);assertSame(original,w.p1.activeHitDef)
    }
    @Test fun projectileRequestValidationPrecedesQueuing() {
        for(raw in listOf("unknown","1/0",".5,1")) {
            val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nyaccel=$raw")
            w.step();assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun projectileCapturesHitAccelerationSeparatelyFromItsOwnMotion() {
        val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\naccel=0,2\nyaccel=1",sourceWidth=640)
        w.step();val projectile=w.entities.projectiles.single()
        assertEquals(128,projectile.hit.hitAccelerationY);assertEquals(256,projectile.accelerationY)
    }
    @Test fun extremeAuthoredAccelerationSaturatesCanonicalStorage() {
        for((raw,expected) in listOf("100000000000000000000" to Int.MAX_VALUE,"-100000000000000000000" to Int.MIN_VALUE)) {
            val w=fight(source("yaccel=$raw"));assertEquals(expected,packet(w).hitAccelerationY)
        }
    }
    @Test fun presentationAndQueriesCannotAdvanceMotionClocksOrPendingFallDamage() {
        val w=fight();w.p2.receiveHit(HitDefinition(hitAccelerationY=128,fall=true,fallDamage=30,defenderPause=2),true,attacker=w.p1)
        val original=w.p2.getHitData.copy();val before=w.checksum()
        repeat(8){query(w.p2,"HitOver+HitShakeOver+GetHitVar(yaccel)");CorePresentationPlanner.snapshot(w,12)}
        assertEquals(original,w.p2.getHitData);assertEquals(before,w.checksum());assertEquals(2,w.p2.hitPauseLeft)
    }
}
