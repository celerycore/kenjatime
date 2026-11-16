package moe.celery.kenjatime

import kotlin.test.*

/** Accepted contacts carry only an active get-hit fall, with explicit authored clearing. */
class HitFallCarryTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=1"
    private val states="$idle\n[Statedef 400]\ntype=A\nmovetype=I\nphysics=N\nanim=0\n"+
        "[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 5001]\ntype=A\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 152]\ntype=A\nmovetype=H\nphysics=N\nanim=0"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("fall carry",air,
        "$states\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="")=DeterministicFight(FightingCharacter(definition(extra),1),FightingCharacter(definition(),2))
    private fun source(params: String)="[Statedef 200]\ntype=S\nphysics=N\nanim=200\n[State 200, hit]\n"+
        "type=HitDef\ntrigger1=Time=0\ndamage=0\n$params"
    private fun packet(w: DeterministicFight): HitDefinition {
        w.p1.changeState(200);w.p1.tick(w.issues);return w.p1.activeHitDef!!
    }
    private fun prime(w: DeterministicFight,airborne: Boolean=false) {
        w.p2.receiveHit(HitDefinition(fall=true),true,attacker=w.p1)
        if(airborne)w.p2.changeState(5001)
    }
    private fun setFall(w: DeterministicFight,value: Int) {
        val c=MugenCnsParser.parse("[Statedef 5000]\n[State 5000, flag]\ntype=HitFallSet\ntrigger1=1\nvalue=$value")
            .getValue(5000).controllers.single()
        CoreGetHitControllers.execute(w.p2,c,w.issues)
    }
    @Test fun defaultFlagsDoNotStartANewFallOrRequestClearing() {
        val w=fight(source(""));val hit=packet(w)
        assertFalse(hit.fall);assertFalse(hit.airFall);assertFalse(hit.forceNoFall)
        w.p2.receiveHit(hit,true,attacker=w.p1);assertFalse(w.p2.getHitData.fall)
    }
    @Test fun activeFallsCarryAcrossOrdinaryGroundAndAirFollowUps() {
        for(airborne in listOf(false,true)) {
            val w=fight();prime(w,airborne);w.p2.receiveHit(HitDefinition(),true,attacker=w.p1)
            assertTrue(w.p2.getHitData.fall);assertEquals(1.0,CoreExpression.number("HitFall",w.p2,w.issues))
        }
    }
    @Test fun forceNoFallClearsAnActiveFallForEitherIncomingPosture() {
        for(airborne in listOf(false,true)) {
            val w=fight();prime(w,airborne)
            w.p2.receiveHit(HitDefinition(forceNoFall=true),true,attacker=w.p1)
            assertFalse(w.p2.getHitData.fall);assertEquals(0.0,w.p2.getHitVar("fall"))
        }
    }
    @Test fun groundFallTakesPriorityOverForceNoFall() {
        for(airborne in listOf(false,true)) {
            val w=fight();prime(w,airborne)
            w.p2.receiveHit(HitDefinition(fall=true,forceNoFall=true),true,attacker=w.p1)
            assertTrue(w.p2.getHitData.fall)
        }
    }
    @Test fun explicitAirFallCanStartANewFallAfterForcedClearing() {
        val w=fight();w.p2.changeState(400)
        w.p2.receiveHit(HitDefinition(fall=false,airFall=true,forceNoFall=true),true,attacker=w.p1)
        assertTrue(w.p2.getHitData.fall)
    }
    @Test fun airFallZeroSuppressesANewAirFallWithoutClearingAnExistingOne() {
        for(previous in listOf(false,true)) {
            val w=fight();if(previous)prime(w,true) else w.p2.changeState(400)
            w.p2.receiveHit(HitDefinition(fall=true,airFall=false,forceNoFall=true),true,attacker=w.p1)
            assertEquals(previous,w.p2.getHitData.fall)
        }
    }
    @Test fun guardsAlwaysClearFallEvenWhenTheAttackRequestsOne() {
        for(airborne in listOf(false,true)) {
            val w=fight();prime(w,airborne)
            w.p2.receiveHit(HitDefinition(fall=true,airFall=true),true,true,w.p1)
            assertFalse(w.p2.getHitData.fall);assertTrue(w.p2.getHitData.guarded)
        }
    }
    @Test fun recoveredActorsDoNotCarryStaleFallDataIntoANewHit() {
        val w=fight();prime(w);w.p2.changeState(0)
        assertTrue(w.p2.getHitData.fall);assertEquals("I",w.p2.moveType)
        w.p2.receiveHit(HitDefinition(),true,attacker=w.p1);assertFalse(w.p2.getHitData.fall)
    }
    @Test fun anUninitializedGetHitStateDoesNotCarryAnUnreceivedFlag() {
        val w=fight();w.p2.changeState(5000);w.p2.getHitData.fall=true
        assertFalse(w.p2.getHitData.received)
        w.p2.receiveHit(HitDefinition(),true,attacker=w.p1);assertFalse(w.p2.getHitData.fall)
    }
    @Test fun aCarriedFallUsesTheNewContactsAnimationAndReactionParameters() {
        val w=fight();prime(w);repeat(2){w.p2.tick(w.issues)}
        w.p2.receiveHit(HitDefinition(fallDamage=30,fallKill=false,fallRecover=false,fallRecoverTime=9,
            fallVelocityY=-2048,fallAnimationType=HitAnimationType.UP,hitTime=7),true,attacker=w.p1)
        assertTrue(w.p2.getHitData.fall);assertEquals(30,w.p2.getHitData.fallDamage);assertFalse(w.p2.getHitData.fallKill)
        assertFalse(w.p2.getHitData.fallRecover);assertEquals(9,w.p2.getHitData.fallRecoverTime)
        assertEquals(0,w.p2.getHitData.fallTime);assertEquals(-2048,w.p2.getHitData.fallVelocityY)
        assertEquals(4.0,w.p2.getHitVar("animtype"));assertEquals(7,w.p2.getHitData.time)
    }
    @Test fun clearingFallGatesPendingDamageAndRecoveryWithoutDeletingTheirMetadata() {
        val w=fight();prime(w)
        w.p2.receiveHit(HitDefinition(forceNoFall=true,fallDamage=30,fallRecoverTime=0),true,attacker=w.p1)
        assertFalse(w.p2.canRecover);CoreFallDamage.apply(w.p2)
        assertEquals(1000,w.p2.life);assertEquals(30,w.p2.getHitData.fallDamage)
        setFall(w,1);assertTrue(w.p2.canRecover);CoreFallDamage.apply(w.p2);assertEquals(970,w.p2.life)
    }
    @Test fun clearingFallSelectsTheNewNonfallingAnimation() {
        val w=fight();prime(w)
        w.p2.receiveHit(HitDefinition(forceNoFall=true,animationType=HitAnimationType.MEDIUM,
            fallAnimationType=HitAnimationType.UP),true,attacker=w.p1)
        assertEquals(1.0,w.p2.getHitVar("animtype"));assertFalse(w.p2.getHitData.fall)
    }
    @Test fun hitFallSetCanEndOrEnableFallBeforeAnotherAcceptedContact() {
        for(value in listOf(0,1)) {
            val w=fight();prime(w);setFall(w,value)
            w.p2.receiveHit(HitDefinition(),true,attacker=w.p1)
            assertEquals(value==1,w.p2.getHitData.fall)
        }
    }
    @Test fun fallingAirTargetsStillRequireHitflagFBeforeForceNoFallCanApply() {
        val w=fight();prime(w,true);val original=w.p2.getHitData
        w.p2.receiveHit(HitDefinition(hitFlag="A",forceNoFall=true),true,attacker=w.p1)
        assertSame(original,w.p2.getHitData);assertTrue(w.p2.getHitData.fall)
        w.p2.receiveHit(HitDefinition(hitFlag="AF",forceNoFall=true),true,attacker=w.p1)
        assertFalse(w.p2.getHitData.fall)
    }
    @Test fun rejectedDeadTargetsKeepTheirPreviousFallData() {
        val w=fight();prime(w);w.p2.life=0;val original=w.p2.getHitData
        w.p2.receiveHit(HitDefinition(forceNoFall=true),true,attacker=w.p1)
        assertSame(original,w.p2.getHitData);assertTrue(w.p2.getHitData.fall)
    }
    @Test fun numericBooleanExpressionsUseNonzeroValuesAndAreCapturedAtInstallation() {
        val w=fight(source("fall=ifelse(var(0),.5,0)\nair.fall=-2\nforcenofall=var(1)"))
        w.p1.vars[0]=1;w.p1.vars[1]=1;val hit=packet(w);w.p1.vars[0]=0;w.p1.vars[1]=0
        assertTrue(hit.fall);assertTrue(hit.airFall);assertTrue(hit.forceNoFall)
    }
    @Test fun omittedAirFallInheritsTheResolvedBooleanGroundFlag() {
        for(raw in listOf("0",".5","-2")) {
            val w=fight(source("fall=$raw"));val hit=packet(w)
            assertEquals(raw!="0",hit.fall);assertEquals(hit.fall,hit.airFall)
        }
    }
    @Test fun invalidBooleanFlagsCannotInstallOrReplaceAWorkingAttack() {
        for(key in listOf("fall","air.fall","forcenofall"))for(raw in listOf("unknown","1/0","1,0")) {
            val w=fight(source("$key=$raw"));w.p1.changeState(200);w.p1.tick(w.issues)
            assertNull(w.p1.activeHitDef);assertTrue(w.issues.any{it.startsWith("Invalid hit fall flag:")})
        }
        val w=fight(source("fall=1")+"\n[State 200, invalid]\ntype=HitDef\ntrigger1=Time=1\nforcenofall=unknown")
        val original=packet(w);w.p1.tick(w.issues);assertSame(original,w.p1.activeHitDef)
    }
    @Test fun invalidFallFlagsCannotQueueAProjectile() {
        for(key in listOf("fall","air.fall","forcenofall")) {
            val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n$key=unknown")
            w.step();assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun projectilePacketsRetainTheirCapturedClearingFlag() {
        val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nforcenofall=var(0)")
        w.p1.vars[0]=1;w.step();val hit=w.entities.projectiles.single().hit;w.p1.vars[0]=0
        assertTrue(hit.forceNoFall);prime(w);w.p2.receiveHit(hit,true,attacker=w.p1);assertFalse(w.p2.getHitData.fall)
    }
    @Test fun helperVictimsCarryAndClearFallWithoutEditingRootData() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p2,9,0,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        helper.receiveHit(HitDefinition(fall=true),true,attacker=w.p1)
        helper.receiveHit(HitDefinition(),true,attacker=w.p1);assertTrue(helper.getHitData.fall)
        helper.receiveHit(HitDefinition(forceNoFall=true),true,attacker=w.p1);assertFalse(helper.getHitData.fall)
        assertFalse(w.p2.getHitData.received);assertFalse(w.p2.getHitData.fall)
    }
    @Test fun borrowedBanksAndFacingChangesCannotChangeCarryOrClearingRules() {
        val w=fight();prime(w);val bank=FightingCharacter(definition(width=640),3)
        w.p2.enterAuthoredState(5001,bank,w.issues);w.p2.facingRight=false
        w.p2.receiveHit(HitDefinition(),false,attacker=w.p1);assertTrue(w.p2.getHitData.fall)
        w.p2.receiveHit(HitDefinition(forceNoFall=true),false,attacker=w.p1);assertFalse(w.p2.getHitData.fall)
    }
    @Test fun hitpauseAndPureReadsCannotCarryOrClearFlagsWithoutAnotherContact() {
        val w=fight();prime(w);w.p2.hitPauseLeft=2;val data=w.p2.getHitData.copy();val before=w.checksum()
        repeat(8){w.p2.getHitVar("fall");CorePresentationPlanner.snapshot(w,12)}
        assertEquals(data,w.p2.getHitData);assertEquals(before,w.checksum());assertEquals(2,w.p2.hitPauseLeft)
        w.p2.receiveHit(HitDefinition(forceNoFall=true),true,attacker=w.p1)
        assertFalse(w.p2.getHitData.fall);assertEquals(1000,w.p2.life);assertEquals(0,w.p1.power);assertEquals(0,w.p2.power)
    }
}
