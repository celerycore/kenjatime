package moe.celery.kenjatime

import kotlin.test.*

/** Captured animation selection for authored get-hit CNS, not complete common-state playback. */
class HitAnimationTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1\n"+
        (5000..5005).joinToString("\n"){"[Begin Action $it]\n$it,0,0,0,-1"}
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private val states="$idle\n$hurt\n[Statedef 400]\ntype=A\nmovetype=I\nphysics=N\nanim=0\n"+
        "[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n[Statedef 152]\ntype=A\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 700]\ntype=A\nmovetype=H\nphysics=N\nanim=0"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("hit animation",air,
        "$states\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="",reaction: String="",width: Int=320)=DeterministicFight(
        FightingCharacter(definition(extra,width),1),FightingCharacter(definition(reaction),2))
    private fun source(params: String)="[Statedef 200]\ntype=S\nphysics=N\nanim=200\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=0\n$params"
    private fun packet(w: DeterministicFight): HitDefinition {
        w.p1.changeState(200);w.p1.tick(w.issues);return w.p1.activeHitDef!!
    }
    private fun query(actor: FightingCharacter)=CoreExpression.number("GetHitVar(animtype)",actor,actor.world!!.issues)
    @Test fun omittedTypesDefaultToLightWithInheritedAirAndBackFall() {
        val w=fight(source(""));val hit=packet(w)
        assertEquals(HitAnimationType.LIGHT,hit.animationType);assertEquals(hit.animationType,hit.airAnimationType)
        assertEquals(HitAnimationType.BACK,hit.fallAnimationType);assertEquals(0.0,query(w.p2))
    }
    @Test fun allSixStaticNamesMapToTheirNativeIntegerCodes() {
        for((name,type) in listOf("light","medium","hard","back","up","diagup").zip(HitAnimationType.entries)) {
            val w=fight(source("animtype=$name\nair.animtype=$name\nfall.animtype=$name"));val hit=packet(w)
            assertEquals(type,hit.animationType);assertEquals(type,hit.airAnimationType);assertEquals(type,hit.fallAnimationType)
        }
    }
    @Test fun caseWhitespaceAndMedAliasAreAccepted() {
        val w=fight(source("animtype= MeD \nair.animtype= UP \nfall.animtype= DiAgUp "));val hit=packet(w)
        assertEquals(HitAnimationType.MEDIUM,hit.animationType);assertEquals(HitAnimationType.UP,hit.airAnimationType)
        assertEquals(HitAnimationType.DIAGUP,hit.fallAnimationType)
    }
    @Test fun omittedAirTypeInheritsEachAuthoredGroundType() {
        for(name in listOf("light","medium","hard","back","up","diagup")) {
            val w=fight(source("animtype=$name"));val hit=packet(w);assertEquals(hit.animationType,hit.airAnimationType)
        }
    }
    @Test fun omittedFallTypeDefaultsToUpOnlyWhenAirTypeIsUp() {
        for(name in listOf("light","medium","hard","back","up","diagup")) {
            val w=fight(source("air.animtype=$name"));val hit=packet(w)
            assertEquals(if(name=="up")HitAnimationType.UP else HitAnimationType.BACK,hit.fallAnimationType)
        }
    }
    @Test fun groundBackUpAndDiagUpCollapseToHardWithoutVerticalKnockback() {
        for(type in HitAnimationType.entries)for(vy in listOf(0,-512)) {
            val w=fight();w.p2.receiveHit(HitDefinition(animationType=type,velocityY=vy),true,attacker=w.p1)
            assertEquals((if(type.code>=3 && vy==0)2 else type.code).toDouble(),query(w.p2))
        }
    }
    @Test fun anInitiallyAirborneVictimUsesAirTypeBeforeTheReactionChangesPosture() {
        val w=fight();w.p2.changeState(400)
        w.p2.receiveHit(HitDefinition(animationType=HitAnimationType.LIGHT,airAnimationType=HitAnimationType.DIAGUP),true,attacker=w.p1)
        assertEquals("S",w.p2.stateType);assertEquals(5.0,query(w.p2))
    }
    @Test fun currentAcceptedFallFlagTakesPrecedenceOverGroundAndAirTypes() {
        for(airborne in listOf(false,true)) {
            val w=fight();if(airborne)w.p2.changeState(400)
            w.p2.receiveHit(HitDefinition(fall=true,animationType=HitAnimationType.LIGHT,
                airAnimationType=HitAnimationType.MEDIUM,fallAnimationType=HitAnimationType.UP),true,attacker=w.p1)
            assertTrue(w.p2.getHitData.fall);assertEquals(4.0,query(w.p2))
        }
    }
    @Test fun airFallControlsSelectionIndependentlyOfGroundFall() {
        for(airFall in listOf(false,true)) {
            val w=fight();w.p2.changeState(400)
            w.p2.receiveHit(HitDefinition(fall=true,airFall=airFall,airAnimationType=HitAnimationType.MEDIUM,
                fallAnimationType=HitAnimationType.DIAGUP),true,attacker=w.p1)
            assertEquals(if(airFall)5.0 else 1.0,query(w.p2))
        }
    }
    @Test fun guardingDisablesFallAndUsesTheInitialPostureForAnimationSelection() {
        for(airborne in listOf(false,true)) {
            val w=fight();if(airborne)w.p2.changeState(400)
            w.p2.receiveHit(HitDefinition(fall=true,animationType=HitAnimationType.MEDIUM,
                airAnimationType=HitAnimationType.UP,fallAnimationType=HitAnimationType.DIAGUP),true,true,w.p1)
            assertFalse(w.p2.getHitData.fall);assertEquals(if(airborne)4.0 else 1.0,query(w.p2))
        }
    }
    @Test fun forceAirOverrideSelectsAirAnimationInTheVictimsOwnBank() {
        val w=fight(reaction="[State 0, override]\ntype=HitOverride\ntrigger1=Time=0\nattr=S,NA\nstateno=700\nforceair=1")
        w.p2.tick(w.issues)
        w.p2.receiveHit(HitDefinition(animationType=HitAnimationType.LIGHT,airAnimationType=HitAnimationType.UP),true,attacker=w.p1)
        assertEquals(700,w.p2.stateNo);assertSame(w.p2,w.p2.stateOwner);assertEquals(4.0,query(w.p2))
    }
    @Test fun authoredChangeAnimUsesTheCapturedCodeOnTheNextReactionTick() {
        val w=fight(reaction="$hurt\n[State 5000, reaction]\ntype=ChangeAnim\ntrigger1=Time=0\nvalue=5000+GetHitVar(animtype)")
        w.p2.receiveHit(HitDefinition(animationType=HitAnimationType.MEDIUM),true,attacker=w.p1)
        assertEquals(0,w.p2.animation!!.action.number);w.p2.tick(w.issues)
        assertEquals(5001,w.p2.animation!!.action.number);assertEquals(1.0,query(w.p2))
    }
    @Test fun laterAnimationAndPostureChangesCannotRewriteTheCapturedType() {
        val w=fight();w.p2.receiveHit(HitDefinition(animationType=HitAnimationType.HARD),true,attacker=w.p1)
        w.p2.changeState(400);assertEquals(2.0,query(w.p2));assertEquals(0,w.p2.animation!!.action.number)
    }
    @Test fun hitFallSetEditsTheFallFlagWithoutReselectingCapturedAnimation() {
        val w=fight();w.p2.receiveHit(HitDefinition(animationType=HitAnimationType.MEDIUM),true,attacker=w.p1)
        val c=MugenCnsParser.parse("$hurt\n[State 5000, flag]\ntype=HitFallSet\ntrigger1=1\nvalue=1").getValue(5000).controllers.single()
        CoreGetHitControllers.execute(w.p2,c,w.issues);assertTrue(w.p2.getHitData.fall);assertEquals(1.0,query(w.p2))
    }
    @Test fun facingAndBorrowedLocalCoordinatesCannotMirrorOrScaleAnimationCodes() {
        for(width in listOf(640,1008))for(facing in listOf(false,true)) {
            val w=fight();w.p2.receiveHit(HitDefinition(animationType=HitAnimationType.MEDIUM),facing,attacker=w.p1)
            val bank=FightingCharacter(definition(width=width),3);w.p2.enterAuthoredState(700,bank,w.issues)
            w.p2.facingRight=!facing;assertEquals(1.0,query(w.p2))
        }
    }
    @Test fun invalidNamesCannotInstallOrReplaceAWorkingHitDefinition() {
        for(key in listOf("animtype","air.animtype","fall.animtype"))for(value in listOf("unknown","3","light,hard","ifelse(1,light,hard)")) {
            val w=fight(source("$key=$value"));w.p1.changeState(200);w.p1.tick(w.issues)
            assertNull(w.p1.activeHitDef);assertTrue(w.issues.any{it.startsWith("Invalid hit animation:")})
        }
        val w=fight(source("animtype=hard")+"\n[State 200, invalid]\ntype=HitDef\ntrigger1=Time=1\nfall.animtype=unknown")
        val original=packet(w);w.p1.tick(w.issues);assertSame(original,w.p1.activeHitDef)
    }
    @Test fun invalidProjectileAnimationNamesCannotQueueAShot() {
        for(key in listOf("animtype","air.animtype","fall.animtype")) {
            val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n$key=unknown")
            w.step();assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun projectileCapturesTypesBeforeItsCreatorChangesStateBanks() {
        val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nanimtype=medium\nair.animtype=up\nfall.animtype=diagup")
        w.step();val hit=w.entities.projectiles.single().hit;w.p1.changeState(400)
        assertEquals(HitAnimationType.MEDIUM,hit.animationType);assertEquals(HitAnimationType.UP,hit.airAnimationType)
        assertEquals(HitAnimationType.DIAGUP,hit.fallAnimationType)
    }
    @Test fun aNewAcceptedContactReplacesThePreviousAnimationSelection() {
        val w=fight();w.p2.receiveHit(HitDefinition(animationType=HitAnimationType.HARD),true,attacker=w.p1)
        w.p2.receiveHit(HitDefinition(animationType=HitAnimationType.MEDIUM),true,attacker=w.p1)
        assertEquals(1.0,query(w.p2))
    }
    @Test fun helperVictimsKeepTheirOwnCapturedAnimationData() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p2,9,0,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        helper.receiveHit(HitDefinition(animationType=HitAnimationType.HARD),true,attacker=w.p1)
        assertEquals(2.0,query(helper));assertEquals(0.0,query(w.p2));assertFalse(w.p2.getHitData.received)
    }
    @Test fun multiHitProjectilesChooseFromEachVictimsCurrentIncomingPosture() {
        val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nprojhits=2\n"+
            "damage=0\nanimtype=medium\nair.animtype=up",reaction="$hurt\ntype=A")
        w.p2.posX=5*Fixed.ONE;w.step();w.step();assertEquals(1.0,query(w.p2))
        w.step();w.step();assertEquals(4.0,query(w.p2))
    }
    @Test fun rejectedContactsLeavePreviouslyCapturedAnimationUntouched() {
        val w=fight();w.p2.receiveHit(HitDefinition(animationType=HitAnimationType.HARD),true,attacker=w.p1)
        w.p2.receiveHit(HitDefinition(animationType=HitAnimationType.LIGHT,hitFlag="A"),true,attacker=w.p1)
        assertEquals(2.0,query(w.p2))
    }
    @Test fun captureAndReadOnlyPresentationDoNotCreateAnExtraHitOrChangeLifeAndPower() {
        val w=fight();w.p2.receiveHit(HitDefinition(damage=10,animationType=HitAnimationType.MEDIUM),true,attacker=w.p1)
        val data=w.p2.getHitData.copy();val before=w.checksum();val power=w.p2.power
        repeat(8){query(w.p2);CorePresentationPlanner.snapshot(w,12)}
        assertEquals(data,w.p2.getHitData);assertEquals(before,w.checksum());assertEquals(990,w.p2.life)
        assertEquals(power,w.p2.power);assertTrue(w.contacts.isEmpty());assertEquals(0,w.p2.animation!!.action.number)
    }
}
