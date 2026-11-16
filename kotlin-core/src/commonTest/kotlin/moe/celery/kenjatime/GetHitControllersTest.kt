package moe.celery.kenjatime

import kotlin.test.*

/** Captured reaction velocities, not native common-state/bounce phase certification. */
class GetHitControllersTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 700]\ntype=A\nmovetype=H\nphysics=N\nanim=0"
    private fun c(type: String,params: String,state: Int=5000)=
        "[State $state, reaction]\ntype=$type\ntrigger1=1\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("reaction",air,"$idle\n$hurt\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="",width: Int=320)=DeterministicFight(
        FightingCharacter(definition(width=width),1),FightingCharacter(definition(extra),2))
    private fun execute(actor: FightingCharacter,type: String,params: String="") {
        val controller=MugenCnsParser.parse("$hurt\n${c(type,params,700)}").getValue(700).controllers.single()
        CoreGetHitControllers.execute(actor,controller,actor.world!!.issues)
    }
    private fun hit(w: DeterministicFight,fall: Boolean=false,face: Boolean=true,guarded: Boolean=false) {
        w.p2.receiveHit(HitDefinition(velocityX=3*Fixed.ONE,velocityY=-2*Fixed.ONE,
            guardVelocityX=Fixed.ONE,guardVelocityY=-Fixed.ONE,fall=fall),face,guarded,w.p1)
    }
    private fun source(params: String)="[Statedef 200]\ntype=S\nphysics=N\nanim=200\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=10\n$params"

    @Test fun hitVelSetRestoresOnlyRequestedAxesFromCapturedData() {
        for(x in 0..1)for(y in 0..1) {
            val w=fight();hit(w);w.p2.velX=9*Fixed.ONE;w.p2.velY=8*Fixed.ONE
            execute(w.p2,"HitVelSet","x=$x\ny=$y")
            assertEquals((if(x==1)3 else 9)*Fixed.ONE,w.p2.velX)
            assertEquals((if(y==1)-2 else 8)*Fixed.ONE,w.p2.velY)
        }
    }
    @Test fun omittedAxesAndNestedNonzeroFlagsWorkWithoutScalingVelocity() {
        val w=fight();hit(w);w.p2.vars[0]=1;w.p2.velY=8*Fixed.ONE
        execute(w.p2,"HitVelSet","x=ifelse(var(0),2,0)")
        assertEquals(3*Fixed.ONE,w.p2.velX);assertEquals(8*Fixed.ONE,w.p2.velY)
    }
    @Test fun restoringVelocityDoesNotFollowLaterFacingChanges() {
        for(face in listOf(false,true)) {
            val w=fight();hit(w,face=face);w.p2.facingRight=!w.p2.facingRight;w.p2.velX=0
            execute(w.p2,"HitVelSet","x=1\ny=1")
            assertEquals((if(face)3 else -3)*Fixed.ONE,w.p2.velX)
        }
    }
    @Test fun guardedContactsRetainTheirOwnCapturedVelocities() {
        val w=fight();hit(w,guarded=true);w.p2.velX=0;w.p2.velY=0
        execute(w.p2,"HitVelSet","x=1\ny=1")
        assertEquals(Fixed.ONE,w.p2.velX);assertEquals(-Fixed.ONE,w.p2.velY);assertTrue(w.p2.getHitData.guarded)
    }
    @Test fun freshAndRecoveredActorsCannotApplyStoredReactions() {
        for(received in listOf(false,true)) {
            val w=fight();if(received)hit(w)
            w.p2.changeState(if(received)0 else 700);w.p2.velX=9*Fixed.ONE;w.p2.velY=8*Fixed.ONE
            execute(w.p2,"HitVelSet","x=1\ny=1");execute(w.p2,"HitFallSet","value=1\nxvel=4\nyvel=-6")
            execute(w.p2,"HitFallVel")
            assertEquals(9*Fixed.ONE,w.p2.velX);assertEquals(8*Fixed.ONE,w.p2.velY);assertFalse(w.p2.getHitData.fall)
        }
    }
    @Test fun fallDefaultsPreserveXAndUseCanonicalVerticalBounce() {
        val w=fight();hit(w,fall=true);assertNull(w.p2.getHitData.fallVelocityX)
        w.p2.velX=9*Fixed.ONE;w.p2.velY=0;execute(w.p2,"HitFallVel")
        assertEquals(9*Fixed.ONE,w.p2.velX);assertEquals(Fixed.of(-4.5),w.p2.velY)
        assertEquals(0.0,w.p2.getHitVar("fall.xvel"));assertEquals(-4.5,w.p2.getHitVar("fall.yvel"))
    }
    @Test fun fallVelocityRequiresAnEnabledFallFlag() {
        val w=fight();hit(w);w.p2.velX=9*Fixed.ONE;w.p2.velY=8*Fixed.ONE
        execute(w.p2,"HitFallVel");assertEquals(8*Fixed.ONE,w.p2.velY)
        execute(w.p2,"HitFallSet","value=1");execute(w.p2,"HitFallVel")
        assertEquals(Fixed.of(-4.5),w.p2.velY)
    }
    @Test fun fallSetChangesOnlySpecifiedFieldsAndCanDisableFalling() {
        val w=fight();hit(w,fall=true);execute(w.p2,"HitFallSet","xvel=4")
        assertTrue(w.p2.getHitData.fall);assertEquals(4*Fixed.ONE,w.p2.getHitData.fallVelocityX)
        assertEquals(Fixed.of(-4.5),w.p2.getHitData.fallVelocityY)
        execute(w.p2,"HitFallSet","value=-1\nyvel=-6")
        assertTrue(w.p2.getHitData.fall);assertEquals(-6*Fixed.ONE,w.p2.getHitData.fallVelocityY)
        execute(w.p2,"HitFallSet","value=0");w.p2.velY=8*Fixed.ONE;execute(w.p2,"HitFallVel")
        assertEquals(8*Fixed.ONE,w.p2.velY)
    }
    @Test fun explicitZeroFallXIsDistinctFromAnOmittedX() {
        val w=fight();hit(w,fall=true);execute(w.p2,"HitFallSet","xvel=0")
        w.p2.velX=9*Fixed.ONE;execute(w.p2,"HitFallVel")
        assertEquals(0,w.p2.velX);assertEquals(0,w.p2.getHitData.fallVelocityX)
    }
    @Test fun hitDefFallVelocitiesCaptureNestedExpressionsInAuthorUnits() {
        val a=FightingCharacter(definition(source("fall=1\nfall.xvelocity=ifelse(var(0),8,4)\nfall.yvelocity=-max(6,10)"),640),1)
        val w=DeterministicFight(a,FightingCharacter(definition(),2));a.vars[0]=1;a.changeState(200);a.tick(w.issues)
        val hit=a.activeHitDef!!;a.vars[0]=0;w.p2.receiveHit(hit,true,attacker=a)
        execute(w.p2,"HitFallVel");assertEquals(4*Fixed.ONE,w.p2.velX);assertEquals(-5*Fixed.ONE,w.p2.velY)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
    @Test fun authoredFallXMirrorsOnceUsingTheImpactFacing() {
        for(face in listOf(false,true)) {
            val w=fight();w.p2.receiveHit(HitDefinition(fall=true,fallVelocityX=4*Fixed.ONE),face,attacker=w.p1)
            w.p2.facingRight=!face;execute(w.p2,"HitFallVel")
            assertEquals((if(face)4 else -4)*Fixed.ONE,w.p2.velX)
        }
    }
    @Test fun borrowedBanksDoNotRescaleCapturedVelocitiesAndFallSetUsesActiveUnits() {
        val w=fight();hit(w,fall=true)
        val bank=FightingCharacter(definition(width=640),3);w.p2.enterAuthoredState(700,bank,w.issues)
        w.p2.velX=0;execute(w.p2,"HitVelSet","x=1\ny=1")
        assertEquals(3*Fixed.ONE,w.p2.velX);assertEquals(-2*Fixed.ONE,w.p2.velY)
        execute(w.p2,"HitFallSet","xvel=6\nyvel=-10");execute(w.p2,"HitFallVel")
        assertEquals(3*Fixed.ONE,w.p2.velX);assertEquals(-5*Fixed.ONE,w.p2.velY)
        assertEquals(6.0,w.p2.getHitVar("fall.xvel"));assertEquals(-10.0,w.p2.getHitVar("fall.yvel"))
    }
    @Test fun defaultBounceDoesNotDependOnSourceOrDestinationLocalCoordinates() {
        for(width in listOf(320,640,1280)) {
            val a=FightingCharacter(definition(source("fall=1"),width),1)
            val b=FightingCharacter(definition(width=width),2);val w=DeterministicFight(a,b)
            a.changeState(200);a.tick(w.issues);b.receiveHit(a.activeHitDef!!,true,attacker=a)
            execute(b,"HitFallVel");assertEquals(Fixed.of(-4.5),b.velY)
            assertEquals(-4.5*width/320,b.getHitVar("fall.yvel"))
        }
    }
    @Test fun invalidControllerComponentsCannotPartiallyEditReactionData() {
        for((type,params) in listOf("HitVelSet" to "x=1\ny=unknown","HitVelSet" to "z=1",
            "HitFallSet" to "value=2\nxvel=4","HitFallSet" to "value=0\nxvel=4\nyvel=unknown",
            "HitFallVel" to "x=1")) {
            val w=fight();hit(w,fall=true);val data=w.p2.getHitData.copy()
            w.p2.velX=9*Fixed.ONE;w.p2.velY=8*Fixed.ONE;execute(w.p2,type,params)
            assertEquals(data,w.p2.getHitData);assertEquals(9*Fixed.ONE,w.p2.velX);assertEquals(8*Fixed.ONE,w.p2.velY)
            assertTrue(w.issues.any { it.startsWith("Invalid $type:") })
        }
    }
    @Test fun invalidFallParametersCannotReplaceAnExistingHitDefOrQueueAProjectile() {
        val a=FightingCharacter(definition(source("fall.xvelocity=4")+
            "\n[State 200, invalid]\ntype=HitDef\ntrigger1=Time=1\nfall.yvelocity=unknown"),1)
        val w=DeterministicFight(a,FightingCharacter(definition(),2));a.changeState(200);a.tick(w.issues)
        val original=a.activeHitDef;a.tick(w.issues);assertSame(original,a.activeHitDef)
        assertTrue(w.issues.any { it.startsWith("Invalid fall velocity:") })
        val bad="[State 0, invalid shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nfall.xvelocity=1/0"
        val p=DeterministicFight(FightingCharacter(definition(bad),1),FightingCharacter(definition(),2))
        p.step();assertTrue(p.entities.projectiles.isEmpty());assertTrue(p.issues.any { it.startsWith("Invalid fall velocity:") })
    }
    @Test fun aNewContactReplacesPreviousFallOverrides() {
        val w=fight();hit(w,fall=true);execute(w.p2,"HitFallSet","xvel=9\nyvel=-6")
        hit(w);assertFalse(w.p2.getHitData.fall);assertNull(w.p2.getHitData.fallVelocityX)
        assertEquals(Fixed.of(-4.5),w.p2.getHitData.fallVelocityY)
    }
    @Test fun helperReactionDataAndVelocitiesAreIndependentOfTheRoot() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p2,9,0,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor;h.receiveHit(HitDefinition(fall=true),true,attacker=w.p1)
        execute(h,"HitFallSet","xvel=4\nyvel=-6");execute(h,"HitFallVel")
        assertEquals(4*Fixed.ONE,h.velX);assertEquals(-6*Fixed.ONE,h.velY)
        assertEquals(0,w.p2.velX);assertEquals(0,w.p2.velY);assertFalse(w.p2.getHitData.received)
    }
    @Test fun forcedAirOverridesRetainAirKnockbackAndFallMetadata() {
        val w=fight();val controller=MugenCnsParser.parse("$idle\n[State 0, override]\ntype=HitOverride\ntrigger1=1\n"+
            "attr=SCA,AA\nstateno=700\nforceair=1\ntime=-1").getValue(0).controllers.single()
        w.p2.hitOverrides.execute(w.p2,controller,w.issues)
        w.p2.receiveHit(HitDefinition(airVelocityX=6*Fixed.ONE,airVelocityY=-8*Fixed.ONE,airFall=true),true,attacker=w.p1)
        assertTrue(w.p2.getHitData.fall);w.p2.velX=0;w.p2.velY=0
        execute(w.p2,"HitVelSet","x=1\ny=1");assertEquals(6*Fixed.ONE,w.p2.velX);assertEquals(-8*Fixed.ONE,w.p2.velY)
        execute(w.p2,"HitFallVel");assertEquals(6*Fixed.ONE,w.p2.velX);assertEquals(Fixed.of(-4.5),w.p2.velY)
    }
    @Test fun extremeIncomingAndFallXMirrorWithoutWrapping() {
        val w=fight();w.p2.receiveHit(HitDefinition(velocityX=Int.MIN_VALUE,fall=true,fallVelocityX=Int.MIN_VALUE),false)
        assertEquals(Int.MAX_VALUE,w.p2.getHitData.velocityX);assertEquals(Int.MAX_VALUE,w.p2.getHitData.fallVelocityX)
    }
    @Test fun hitpauseAndPersistenceUseOrdinaryControllerRules() {
        for(ignore in 0..1) {
            val w=fight(c("HitVelSet","x=1\ny=1\nignorehitpause=$ignore"));hit(w)
            w.p2.velX=9*Fixed.ONE;w.p2.hitPauseLeft=2;w.p2.tick(w.issues)
            assertEquals((if(ignore==1)3 else 9)*Fixed.ONE,w.p2.velX)
        }
        val w=fight(c("HitVelSet","x=1\npersistent=0"));hit(w);w.p2.tick(w.issues)
        w.p2.velX=9*Fixed.ONE;w.p2.tick(w.issues);assertEquals(9*Fixed.ONE,w.p2.velX)
    }
    @Test fun controllersAndPresentationCannotRepeatDamagePowerOrContacts() {
        val w=fight();w.p2.receiveHit(HitDefinition(damage=10,fall=true),true,attacker=w.p1)
        val life=w.p2.life;val power=w.p2.power;val damage=w.p2.getHitVar("damage")
        execute(w.p2,"HitFallSet","xvel=4\nyvel=-6");execute(w.p2,"HitFallVel")
        val checksum=w.checksum();repeat(8){CorePresentationPlanner.snapshot(w,12)}
        assertEquals(checksum,w.checksum());assertEquals(life,w.p2.life);assertEquals(power,w.p2.power)
        assertEquals(damage,w.p2.getHitVar("damage"));assertTrue(w.contacts.isEmpty())
    }
}
