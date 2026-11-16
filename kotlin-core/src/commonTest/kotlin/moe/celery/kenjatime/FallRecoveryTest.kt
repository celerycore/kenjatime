package moe.celery.kenjatime

import kotlin.test.*

/** Authored air-recovery decisions, independent of automatic common-state physics. */
class FallRecoveryTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private val hurt="[Statedef 5000]\ntype=A\nmovetype=H\nphysics=N\nanim=0"
    private val guard="[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("recovery",air,
        "$idle\n$hurt\n$guard\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="",reaction: String="")=DeterministicFight(
        FightingCharacter(definition(extra),1),FightingCharacter(definition(reaction),2))
    private fun hit(w: DeterministicFight,enabled: Boolean=true,time: Int=4,fall: Boolean=true,guarded: Boolean=false)=
        w.p2.receiveHit(HitDefinition(fall=fall,airFall=fall,fallRecover=enabled,fallRecoverTime=time),true,guarded,w.p1)
    private fun source(params: String)="[Statedef 200]\ntype=S\nphysics=N\nanim=200\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=0\nfall=1\n$params"
    private fun query(actor: FightingCharacter,expression: String)=CoreExpression.number(expression,actor,actor.world!!.issues)
    private fun setFall(actor: FightingCharacter,enabled: Int) {
        val c=MugenCnsParser.parse("$hurt\n[State 5000, flag]\ntype=HitFallSet\ntrigger1=1\nvalue=$enabled")
            .getValue(5000).controllers.single()
        CoreGetHitControllers.execute(actor,c,actor.world!!.issues)
    }
    @Test fun freshActorsDoNotReportARecoveryOrFall() {
        val w=fight();assertFalse(w.p2.canRecover)
        assertEquals(0.0,query(w.p2,"CanRecover"));assertEquals(0.0,query(w.p2,"HitFall"))
        assertEquals(0.0,query(w.p2,"GetHitVar(fall.time)"));assertEquals(0.0,query(w.p2,"GetHitVar(fall.recover)"))
    }
    @Test fun authoredDefaultsPermitRecoveryAfterFourActiveReactionTicks() {
        val w=fight(source(""));w.p1.changeState(200);w.p1.tick(w.issues)
        val packet=w.p1.activeHitDef!!;assertTrue(packet.fallRecover);assertEquals(4,packet.fallRecoverTime)
        w.p2.receiveHit(packet,true,attacker=w.p1)
        assertFalse(w.p2.canRecover);assertEquals(1.0,query(w.p2,"HitFall"))
        repeat(3){w.p2.tick(w.issues);assertFalse(w.p2.canRecover)}
        w.p2.tick(w.issues);assertTrue(w.p2.canRecover)
        assertEquals(4.0,query(w.p2,"GetHitVar(fall.time)"));assertEquals(4.0,query(w.p2,"GetHitVar(fall.recovertime)"))
    }
    @Test fun disabledRecoveryStillTracksElapsedFallTime() {
        val w=fight();hit(w,enabled=false,time=1);repeat(8){w.p2.tick(w.issues)}
        assertEquals(8,w.p2.getHitData.fallTime);assertFalse(w.p2.canRecover)
        assertEquals(0.0,query(w.p2,"GetHitVar(fall.recover)"));assertEquals(1.0,query(w.p2,"HitFall"))
    }
    @Test fun zeroAndNegativeThresholdsAllowImmediateAuthoredRecovery() {
        for(time in listOf(0,-1,Int.MIN_VALUE)) {
            val w=fight();hit(w,time=time);assertTrue(w.p2.canRecover);assertEquals(0,w.p2.getHitData.fallTime)
            assertEquals(time.toDouble(),query(w.p2,"GetHitVar(fall.recovertime)"))
        }
    }
    @Test fun hitpauseDoesNotSpendRecoveryTimeIncludingItsFinalFrozenTick() {
        val w=fight();hit(w,time=2);w.p2.hitPauseLeft=3
        repeat(3){w.p2.tick(w.issues);assertEquals(0,w.p2.getHitData.fallTime);assertFalse(w.p2.canRecover)}
        w.p2.tick(w.issues);assertFalse(w.p2.canRecover);w.p2.tick(w.issues);assertTrue(w.p2.canRecover)
    }
    @Test fun ignorehitpauseControllersSeeTheFrozenRecoveryClock() {
        val w=fight(reaction="$hurt\n[State 5000, observe]\ntype=VarSet\ntrigger1=1\nignorehitpause=1\nv=0\nvalue=GetHitVar(fall.time)")
        hit(w,time=2);w.p2.hitPauseLeft=2;repeat(2){w.p2.tick(w.issues);assertEquals(0,w.p2.vars[0])}
        w.p2.tick(w.issues);assertEquals(1,w.p2.vars[0]);w.p2.tick(w.issues);assertEquals(2,w.p2.vars[0])
    }
    @Test fun canRecoverDrivesAnAuthoredTransitionAtTheThreshold() {
        val w=fight(reaction="$hurt\n[State 5000, recover]\ntype=SelfState\ntrigger1=HitFall && CanRecover\nvalue=5200\n"+
            "[Statedef 5200]\ntype=A\nmovetype=I\nphysics=N\nanim=0\nctrl=1")
        hit(w,time=3);repeat(2){w.p2.tick(w.issues);assertEquals(5000,w.p2.stateNo)}
        w.p2.tick(w.issues);assertEquals(5200,w.p2.stateNo);assertTrue(w.p2.control)
        assertFalse(w.p2.canRecover);assertEquals(3,w.p2.getHitData.fallTime)
        w.p2.tick(w.issues);assertEquals(3,w.p2.getHitData.fallTime)
    }
    @Test fun disablingAndReenablingFallPausesButDoesNotResetItsClock() {
        val w=fight();hit(w,time=3);w.p2.tick(w.issues);setFall(w.p2,0)
        repeat(5){w.p2.tick(w.issues)};assertEquals(1,w.p2.getHitData.fallTime);assertFalse(w.p2.canRecover)
        assertEquals(0.0,query(w.p2,"HitFall"));setFall(w.p2,1)
        w.p2.tick(w.issues);assertFalse(w.p2.canRecover);w.p2.tick(w.issues);assertTrue(w.p2.canRecover)
    }
    @Test fun nonfallingHitsDoNotAdvanceUntilHitFallSetEnablesThem() {
        val w=fight();hit(w,time=2,fall=false);repeat(3){w.p2.tick(w.issues)}
        assertEquals(0,w.p2.getHitData.fallTime);assertFalse(w.p2.canRecover)
        setFall(w.p2,1);repeat(2){w.p2.tick(w.issues)};assertTrue(w.p2.canRecover)
    }
    @Test fun guardedContactsRequireAnExplicitFallFlagToStartTheClock() {
        val w=fight();hit(w,time=2,guarded=true);repeat(4){w.p2.tick(w.issues)}
        assertTrue(w.p2.getHitData.guarded);assertFalse(w.p2.canRecover);assertEquals(0,w.p2.getHitData.fallTime)
        setFall(w.p2,1);repeat(2){w.p2.tick(w.issues)};assertTrue(w.p2.canRecover)
    }
    @Test fun aNewHitReplacesRecoveryPermissionThresholdAndElapsedTime() {
        val w=fight();hit(w,time=1);repeat(5){w.p2.tick(w.issues)};assertTrue(w.p2.canRecover)
        hit(w,enabled=false,time=9);assertEquals(0,w.p2.getHitData.fallTime);assertFalse(w.p2.canRecover)
        assertEquals(9,w.p2.getHitData.fallRecoverTime);assertFalse(w.p2.getHitData.fallRecover)
    }
    @Test fun aGuardContactAlsoStartsAFreshPendingClock() {
        val w=fight();hit(w,time=1);w.p2.tick(w.issues);hit(w,time=2,guarded=true)
        assertEquals(0,w.p2.getHitData.fallTime);assertFalse(w.p2.canRecover);assertFalse(w.p2.getHitData.fall)
    }
    @Test fun getHitStateChangesDoNotConfuseStateTimeWithFallTime() {
        val w=fight(reaction="[Statedef 5001]\ntype=A\nmovetype=H\nphysics=N\nanim=0")
        hit(w,time=4);repeat(2){w.p2.tick(w.issues)};w.p2.changeState(5001)
        assertEquals(0,w.p2.timeInState);assertEquals(2,w.p2.getHitData.fallTime)
        repeat(2){w.p2.tick(w.issues)};assertEquals(2,w.p2.timeInState);assertTrue(w.p2.canRecover)
    }
    @Test fun nonHitStatesFreezeStoredDataAndCannotRecover() {
        val w=fight();hit(w,time=1);w.p2.tick(w.issues);w.p2.changeState(0)
        repeat(4){w.p2.tick(w.issues)};assertEquals(1,w.p2.getHitData.fallTime);assertFalse(w.p2.canRecover)
        w.p2.changeState(5000);assertTrue(w.p2.canRecover)
    }
    @Test fun deadVictimsCannotEnterAnAuthoredRecovery() {
        val w=fight();hit(w,time=0);w.p2.life=0
        assertFalse(w.p2.canRecover);assertEquals(0.0,query(w.p2,"CanRecover"))
    }
    @Test fun recoveryQueriesAndPresentationCannotAdvanceTheClock() {
        val w=fight();hit(w);val before=w.checksum()
        repeat(10){query(w.p2,"CanRecover+HitFall+GetHitVar(fall.time)");CorePresentationPlanner.snapshot(w,12)}
        assertEquals(0,w.p2.getHitData.fallTime);assertEquals(before,w.checksum());assertTrue(w.contacts.isEmpty())
    }
    @Test fun thresholdsAndClockRemainScalarsInBorrowedCoordinateBanks() {
        val w=fight();hit(w,time=4);repeat(2){w.p2.tick(w.issues)}
        val bank=FightingCharacter(definition(width=640),3);w.p2.enterAuthoredState(5000,bank,w.issues)
        assertEquals(4.0,query(w.p2,"GetHitVar(fall.recovertime)"));assertEquals(2.0,query(w.p2,"GetHitVar(fall.time)"))
        repeat(2){w.p2.tick(w.issues)};assertTrue(w.p2.canRecover);assertSame(bank,w.p2.stateOwner)
    }
    @Test fun helperRecoveryDataIsIndependentOfItsRoot() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p2,9,0,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        helper.receiveHit(HitDefinition(fall=true,fallRecoverTime=2),true,attacker=w.p1)
        repeat(2){helper.tick(w.issues)};assertTrue(helper.canRecover);assertFalse(w.p2.canRecover)
        assertEquals(0,w.p2.getHitData.fallTime);assertEquals(1000,w.p2.life)
    }
    @Test fun invalidRecoveryValuesCannotInstallOrReplaceAnAttack() {
        for(params in listOf("fall.recover=unknown","fall.recover=1/0","fall.recovertime=unknown","fall.recovertime=1,2",
            "fall.recovertime=2147483648","fall.recovertime=-2147483649")) {
            val w=fight(source(params));w.p1.changeState(200);w.p1.tick(w.issues)
            assertNull(w.p1.activeHitDef);assertTrue(w.issues.any{it.startsWith("Invalid fall recovery:")})
        }
        val w=fight(source("fall.recovertime=6")+"\n[State 200, invalid]\ntype=HitDef\ntrigger1=Time=1\nfall.recover=unknown")
        w.p1.changeState(200);w.p1.tick(w.issues);val original=w.p1.activeHitDef
        w.p1.tick(w.issues);assertSame(original,w.p1.activeHitDef)
    }
    @Test fun invalidRecoveryValuesCannotQueueAProjectile() {
        for(params in listOf("fall.recover=unknown","fall.recovertime=1/0","fall.recovertime=2147483648")) {
            val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n$params")
            w.step();assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun nestedExpressionsAreCapturedBeforeSourceVariablesChange() {
        val w=fight(source("fall.recover=var(0)\nfall.recovertime=ifelse(var(1),max(2,6),4)"))
        w.p1.vars[0]=-2;w.p1.vars[1]=1;w.p1.changeState(200);w.p1.tick(w.issues)
        val packet=w.p1.activeHitDef!!;w.p1.vars[0]=0;w.p1.vars[1]=0
        w.p2.receiveHit(packet,true,attacker=w.p1)
        assertTrue(w.p2.getHitData.fallRecover);assertEquals(6,w.p2.getHitData.fallRecoverTime)
        repeat(6){w.p2.tick(w.issues)};assertTrue(w.p2.canRecover)
    }
    @Test fun aMultiHitProjectileResetsTheClockOnEveryAcceptedContact() {
        val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nprojhits=3\nprojmisstime=1\n"+
            "damage=0\nfall=1\nfall.recovertime=2")
        w.p2.posX=5*Fixed.ONE;w.step();val packet=w.entities.projectiles.single().hit;var contacts=0
        repeat(5){w.step();if(w.contacts.isNotEmpty()){contacts++;assertEquals(0,w.p2.getHitData.fallTime)}}
        assertEquals(3,contacts);assertEquals(2,packet.fallRecoverTime);assertTrue(packet.fallRecover)
        repeat(2){w.step()};assertTrue(w.p2.canRecover);assertEquals(0,w.p1.power);assertEquals(0,w.p2.power)
    }
    @Test fun anAuthoredProjectileCapturesDefaultRecoveryValues() {
        val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200")
        w.step();val packet=w.entities.projectiles.single().hit
        assertTrue(packet.fallRecover);assertEquals(4,packet.fallRecoverTime)
    }
    @Test fun elapsedTimeSaturatesRatherThanWrappingAtIntMax() {
        val w=fight();hit(w,time=Int.MAX_VALUE);w.p2.getHitData.fallTime=Int.MAX_VALUE-1
        repeat(3){w.p2.tick(w.issues)};assertEquals(Int.MAX_VALUE,w.p2.getHitData.fallTime);assertTrue(w.p2.canRecover)
    }
    @Test fun recoveryEligibilityDoesNotConsumeDamageOrChangeMotionPowerAndState() {
        val w=fight();w.p2.receiveHit(HitDefinition(fall=true,fallDamage=30,fallRecoverTime=1),true,attacker=w.p1)
        w.p2.tick(w.issues);assertTrue(w.p2.canRecover)
        assertEquals(30,w.p2.getHitData.fallDamage);assertEquals(1000,w.p2.life);assertEquals(5000,w.p2.stateNo)
        assertEquals(0,w.p1.power);assertEquals(0,w.p2.power);assertEquals(0,w.p2.velX);assertEquals(0,w.p2.velY)
    }
}
