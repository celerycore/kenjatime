package moe.celery.kenjatime

import kotlin.test.*

/** Authored fall-damage consumption, not automatic landing or native KO phase captures. */
class FallDamageTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private fun hurt(controller: String="")="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n$controller\n"+
        "[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private fun c(params: String="",trigger: String="1")="[State 5000, fall damage]\ntype=HitFallDamage\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",defence: Int=100,width: Int=320,controller: String="")=
        FighterDefinition.fromScript("fall",air,"[Data]\ndefence=$defence\n$idle\n${hurt(controller)}\n$extra",
            defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(defence: Int=100,controller: String="",extra: String="")=DeterministicFight(
        FightingCharacter(definition(extra),1),FightingCharacter(definition(defence=defence,controller=controller),2))
    private fun hit(w: DeterministicFight,amount: Int=30,kill: Boolean=true,fall: Boolean=true,guarded: Boolean=false) {
        w.p2.receiveHit(HitDefinition(fall=fall,fallDamage=amount,fallKill=kill),true,guarded,w.p1)
    }
    private fun execute(actor: FightingCharacter,params: String="") {
        val controller=MugenCnsParser.parse("${hurt()}\n${c(params)}").getValue(5000).controllers.single()
        CoreGetHitControllers.execute(actor,controller,actor.world!!.issues)
    }
    private fun source(params: String)="[Statedef 200]\ntype=S\nphysics=N\nanim=200\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=0\nfall=1\n$params"

    @Test fun defaultFallDamageIsZeroAndFallKillDefaultsIndependentlyToTrue() {
        val w=fight();assertEquals(0.0,w.p2.getHitVar("fall.damage"))
        val packet=HitDefinition(kill=false,guardKill=false,fall=true)
        assertEquals(0,packet.fallDamage);assertTrue(packet.fallKill)
        w.p2.receiveHit(packet,true,attacker=w.p1);execute(w.p2)
        assertEquals(1000,w.p2.life);assertTrue(w.p2.getHitData.fallKill)
    }
    @Test fun capturedDamageIsConsumedOnceAndQueriesBecomeZero() {
        val w=fight();hit(w);assertEquals(30.0,w.p2.getHitVar("fall.damage"))
        execute(w.p2);assertEquals(970,w.p2.life);assertEquals(0.0,w.p2.getHitVar("fall.damage"))
        repeat(4){execute(w.p2)};assertEquals(970,w.p2.life)
    }
    @Test fun fallKillSelectsTheLifeFloorWithoutSelectingAnotherState() {
        for(kill in listOf(false,true)) {
            val w=fight();hit(w,kill=kill);w.p2.life=10;execute(w.p2)
            assertEquals(if(kill)0 else 1,w.p2.life);assertEquals(5000,w.p2.stateNo)
            assertEquals(0,w.p2.getHitData.fallDamage)
        }
    }
    @Test fun authoredKillFlagsRemainIndependentFromFallKill() {
        for(kill in 0..1)for(guardKill in 0..1)for(fallKill in 0..1) {
            val w=fight(extra=source("kill=$kill\nguard.kill=$guardKill\nfall.kill=$fallKill\nfall.damage=30"))
            w.p1.changeState(200);w.p1.tick(w.issues);val packet=w.p1.activeHitDef!!
            w.p2.receiveHit(packet,true,attacker=w.p1);w.p2.life=10;execute(w.p2)
            assertEquals(if(fallKill==1)0 else 1,w.p2.life)
        }
    }
    @Test fun fallDamageUsesVictimsLiveBaseAndRuntimeDefence() {
        val w=fight(defence=200);hit(w,amount=100)
        w.p1.attackMultiplier=7.0;w.p2.defenceMultiplier=.5;execute(w.p2)
        assertEquals(975,w.p2.life);assertEquals(0,w.p2.getHitData.fallDamage)
    }
    @Test fun tinyDamageRetainsOneButTinyHealingCanRoundToZero() {
        for((amount,expected) in listOf(1 to 499,-1 to 500)) {
            val w=fight(defence=100000);hit(w,amount);w.p2.life=500;execute(w.p2)
            assertEquals(expected,w.p2.life);assertEquals(0,w.p2.getHitData.fallDamage)
        }
    }
    @Test fun zeroDefenceFactorConsumesWithoutDamageOrLaterReapplication() {
        val w=fight();hit(w);w.p2.defenceMultiplier=0.0;execute(w.p2)
        assertEquals(1000,w.p2.life);assertEquals(0,w.p2.getHitData.fallDamage)
        w.p2.defenceMultiplier=1.0;execute(w.p2);assertEquals(1000,w.p2.life)
    }
    @Test fun signedFallAmountsCanHealAndClampWithoutNegationOverflow() {
        for((amount,expected) in listOf(-30 to 530,Int.MIN_VALUE to 1000)) {
            val w=fight();hit(w,amount);w.p2.life=500;execute(w.p2)
            assertEquals(expected,w.p2.life);assertEquals(0,w.p2.getHitData.fallDamage)
        }
    }
    @Test fun extremeDefenceFactorsCannotOverflowDamageOrHealingArithmetic() {
        for(amount in listOf(Int.MAX_VALUE,Int.MIN_VALUE))for(kill in listOf(false,true)) {
            val w=fight(defence=1);hit(w,amount,kill);w.p2.life=500
            w.p2.defenceMultiplier=Float.MAX_VALUE.toDouble();execute(w.p2)
            assertEquals(if(amount<0)1000 else if(kill)0 else 1,w.p2.life)
        }
    }
    @Test fun freshRecoveredAndNonfallingActorsLeavePendingDamageAlone() {
        val fresh=fight();fresh.p2.changeState(5000);execute(fresh.p2);assertEquals(1000,fresh.p2.life)
        for(recovered in listOf(false,true)) {
            val w=fight();hit(w,fall=recovered)
            if(recovered)w.p2.changeState(0)
            execute(w.p2);assertEquals(1000,w.p2.life);assertEquals(30,w.p2.getHitData.fallDamage)
        }
    }
    @Test fun changingTheFallFlagDefersConsumptionUntilEnabled() {
        val w=fight();hit(w,fall=false);execute(w.p2)
        val setter=MugenCnsParser.parse("${hurt()}\n[State 5000, enable]\ntype=HitFallSet\ntrigger1=1\nvalue=1")
            .getValue(5000).controllers.single()
        CoreGetHitControllers.execute(w.p2,setter,w.issues);execute(w.p2)
        assertEquals(970,w.p2.life);assertEquals(0,w.p2.getHitData.fallDamage)
    }
    @Test fun guardedContactsDoNotFallUntilExplicitlyEnabled() {
        val w=fight();hit(w,guarded=true);assertFalse(w.p2.getHitData.fall)
        execute(w.p2);assertEquals(1000,w.p2.life);assertEquals(30,w.p2.getHitData.fallDamage)
        assertTrue(w.p2.getHitData.guarded)
    }
    @Test fun aNewAcceptedContactReplacesOldPendingDamageAndKillFlags() {
        val w=fight();hit(w,100,false);hit(w,10,true)
        assertEquals(10,w.p2.getHitData.fallDamage);assertTrue(w.p2.getHitData.fallKill)
        execute(w.p2);assertEquals(990,w.p2.life)
    }
    @Test fun helpersHaveIndependentPendingDamageAndLife() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p2,9,0,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        helper.receiveHit(HitDefinition(fall=true,fallDamage=30),true,attacker=w.p1);execute(helper)
        assertEquals(970,helper.life);assertEquals(1000,w.p2.life)
        assertEquals(0,w.p2.getHitData.fallDamage);assertFalse(w.p2.getHitData.received)
    }
    @Test fun borrowedBanksDoNotRescaleHealthAmountsOrReplaceOwnDefence() {
        val w=fight(defence=200);hit(w,100)
        val bank=FightingCharacter(definition(defence=400,width=640),3)
        w.p2.enterAuthoredState(5000,bank,w.issues);assertEquals(100.0,w.p2.getHitVar("fall.damage"))
        execute(w.p2);assertEquals(950,w.p2.life);assertSame(bank,w.p2.stateOwner)
    }
    @Test fun invalidControllerParametersDoNotConsumeThePendingValue() {
        for(params in listOf("value=1","x=1")) {
            val w=fight();hit(w);execute(w.p2,params)
            assertEquals(1000,w.p2.life);assertEquals(30,w.p2.getHitData.fallDamage)
            assertTrue(w.issues.any { it.startsWith("Invalid HitFallDamage:") })
            execute(w.p2);assertEquals(970,w.p2.life)
        }
    }
    @Test fun invalidAuthoredFallDamageCannotInstallOrReplaceAHitDefinition() {
        for(raw in listOf("unknown","1/0","2147483648","-2147483649","1,2")) {
            val w=fight(extra=source("fall.damage=$raw"));w.p1.changeState(200);w.p1.tick(w.issues)
            assertNull(w.p1.activeHitDef);assertTrue(w.issues.any { it.startsWith("Invalid fall damage:") })
        }
        val w=fight(extra=source("fall.damage=30")+"\n[State 200, invalid]\ntype=HitDef\ntrigger1=Time=1\nfall.damage=unknown")
        w.p1.changeState(200);w.p1.tick(w.issues);val original=w.p1.activeHitDef
        w.p1.tick(w.issues);assertSame(original,w.p1.activeHitDef)
    }
    @Test fun invalidFallKillCannotInstallAnAttackOrQueueAProjectile() {
        val w=fight(extra=source("fall.kill=unknown"));w.p1.changeState(200);w.p1.tick(w.issues)
        assertNull(w.p1.activeHitDef);assertTrue(w.issues.any { it.startsWith("Invalid hit kill flag:") })
        for(params in listOf("fall.damage=unknown","fall.kill=1/0")) {
            val p=fight(extra="[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n$params")
            p.step();assertTrue(p.entities.projectiles.isEmpty());assertTrue(p.issues.isNotEmpty())
        }
    }
    @Test fun nestedDamageAndKillExpressionsAreCapturedAtInstallation() {
        val w=fight(extra=source("fall.damage=ifelse(var(0),max(40,100),20)\nfall.kill=var(1)"))
        w.p1.vars[0]=1;w.p1.vars[1]=0;w.p1.changeState(200);w.p1.tick(w.issues)
        val packet=w.p1.activeHitDef!!;w.p1.vars[0]=0;w.p1.vars[1]=1
        w.p2.receiveHit(packet,true,attacker=w.p1);w.p2.life=50;execute(w.p2)
        assertEquals(1,w.p2.life);assertEquals(100,packet.fallDamage);assertFalse(packet.fallKill)
    }
    @Test fun multiHitProjectilesProvideOneFreshPendingAmountPerContact() {
        val shot="[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nprojhits=3\ndamage=0\nfall=1\nfall.damage=30"
        val w=fight(controller=c(),extra=shot);w.p2.posX=5*Fixed.ONE
        w.step();val projectile=w.entities.projectiles.single();var contacts=0
        repeat(5){w.step();contacts+=w.contacts.size}
        assertEquals(3,contacts);assertEquals(910,w.p2.life);assertEquals(30,projectile.hit.fallDamage)
        assertEquals(0,w.p2.getHitData.fallDamage);assertEquals(0,w.p1.power);assertEquals(0,w.p2.power)
    }
    @Test fun hitpauseAndRepeatedControllersCannotSpendTheSameValueTwice() {
        for(ignore in 0..1) {
            val w=fight(controller=c("ignorehitpause=$ignore"));hit(w);w.p2.hitPauseLeft=2
            w.p2.tick(w.issues);assertEquals(if(ignore==1)970 else 1000,w.p2.life)
            repeat(5){w.p2.tick(w.issues)};assertEquals(970,w.p2.life);assertEquals(0,w.p2.getHitData.fallDamage)
        }
    }
    @Test fun aFreshContactCanRearmDamageAfterPersistentZeroExecution() {
        val w=fight(controller=c("persistent=0"));hit(w);w.p2.tick(w.issues);assertEquals(970,w.p2.life)
        hit(w,20);w.p2.tick(w.issues);assertEquals(950,w.p2.life)
    }
    @Test fun roundFlowObservesFallKoWithoutANewContact() {
        for(kill in listOf(false,true)) {
            val w=fight(controller=c(trigger="var(0)=1"));hit(w,30,kill)
            w.enableRoundFlow(CoreRoundRules(introFrames=0,roundCueFrames=0,fightCueFrames=0));repeat(3){w.step()}
            w.p2.life=20;w.p2.vars[0]=1;w.step()
            assertEquals(if(kill)CoreRoundPhase.KO else CoreRoundPhase.ACTIVE,w.roundFlow!!.phase)
            assertTrue(w.contacts.isEmpty());assertEquals(0,w.p2.getHitData.fallDamage)
        }
    }
    @Test fun fallDamageAndPresentationPreserveOriginalHitDataMotionAndPower() {
        val w=fight();w.p2.receiveHit(HitDefinition(damage=10,velocityX=3*Fixed.ONE,velocityY=-2*Fixed.ONE,
            fall=true,fallDamage=30),true,attacker=w.p1)
        val original=w.p2.getHitData;val time=original.time;val state=w.p2.stateNo;execute(w.p2)
        assertSame(original,w.p2.getHitData);assertEquals(10.0,w.p2.getHitVar("damage"));assertEquals(time,original.time)
        assertEquals(state,w.p2.stateNo);assertEquals(3*Fixed.ONE,w.p2.velX);assertEquals(-2*Fixed.ONE,w.p2.velY)
        assertEquals(7,w.p1.power);assertEquals(6,w.p2.power);assertEquals(960,w.p2.life)
        val checksum=w.checksum();repeat(8){CorePresentationPlanner.snapshot(w,12);w.p2.getHitVar("fall.damage")}
        assertEquals(checksum,w.checksum());assertEquals(960,w.p2.life);assertTrue(w.contacts.isEmpty())
    }
    @Test fun nonlethalConsumptionCannotReviveButSignedHealingIsExplicit() {
        val damage=fight();hit(damage,30,false);damage.p2.life=0;execute(damage.p2)
        assertEquals(0,damage.p2.life);assertEquals(0,damage.p2.getHitData.fallDamage)
        val healing=fight();hit(healing,-30);healing.p2.life=0;execute(healing.p2);assertEquals(30,healing.p2.life)
    }
}
