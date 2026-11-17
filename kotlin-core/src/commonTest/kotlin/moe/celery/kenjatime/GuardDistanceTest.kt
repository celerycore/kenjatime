package moe.celery.kenjatime

import kotlin.test.*

class GuardDistanceTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,20,0\n0,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private val attacking="[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=0"
    private fun c(type: String,params: String="",trigger: String="1",state: Int=200)=
        "[State $state, proximity]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("guard range",air,"$idle\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(a: String="",b: String=""): DeterministicFight {
        val w=DeterministicFight(FightingCharacter(definition("$attacking\n$a"),1),FightingCharacter(definition(b),2))
        w.p1.changeState(200);w.p2.posX=100*256;w.p2.facingRight=false;return w
    }
    private fun execute(w: DeterministicFight,type: String,params: String) {
        val ctl=MugenCnsParser.parse(c(type,params)).getValue(200).controllers.single()
        if(type=="AttackDist")CoreGuardDistance.execute(w.p1,ctl,w.issues)
    }
    private fun shot(params: String="")=c("Projectile","projanim=0\nprojhits=1\nvelocity=0,0\nprojremovetime=-1\n$params",trigger="Time=0",state=0)
    @Test fun defaultsAreAuthoredInOwnCharacterCoordinates() {
        val d=definition("[Size]\nattack.dist=200\nproj.attack.dist=120",640)
        val w=DeterministicFight(FightingCharacter(d,1),FightingCharacter(definition(),2))
        assertEquals(100*256,w.p1.guardDistance);assertFalse(w.p2.inGuardDistance)
        assertEquals(120*256,d.projectileAttackDistance)
    }
    @Test fun idleNearbyPlayersDoNotThreatenGuard() {
        val w=fight();w.p1.changeState(0);w.p2.posX=20*256;w.step();assertFalse(w.p2.inGuardDistance)
    }
    @Test fun attackMoveTypeUsesDefaultRangeEvenBeforeAHitDef() {
        val w=fight();w.step();assertTrue(w.p2.inGuardDistance);assertFalse(w.p1.inGuardDistance)
    }
    @Test fun bothFacingsUseStrictForwardDistanceAndExcludeTheAxis() {
        for(face in listOf(false,true))for(distance in listOf(-1,0,59,60,61)) {
            val w=fight(c("AttackDist","value=60"));w.p1.facingRight=face
            w.p2.posX=distance*256*(if(face)1 else -1);w.step()
            assertEquals(distance in 1..59,w.p2.inGuardDistance)
        }
    }
    @Test fun guardDistanceIsHorizontalAndIgnoresSpriteAndBodyOffsets() {
        val w=fight(c("AttackDist","value=101")+"\n"+c("Offset","x=1000\ny=-1000"))
        w.p2.posY=-500*256;w.step();assertTrue(w.p2.inGuardDistance)
        assertEquals(0,w.p1.posX);assertEquals(100*256,w.p2.posX)
    }
    @Test fun explicitHitDefDistanceAndAttackDistComposeInControllerOrder() {
        val w=fight(c("HitDef","guard.dist=1",trigger="Time=0")+"\n"+c("AttackDist","value=101",trigger="Time=0"))
        w.step();assertEquals(101*256,w.p1.activeHitDef!!.guardDistance);assertTrue(w.p2.inGuardDistance)
        w.step();assertTrue(w.p2.inGuardDistance)
    }
    @Test fun attackDistBeforeHitDefSuppliesItsOmittedDistance() {
        val w=fight(c("AttackDist","value=101")+"\n"+c("HitDef","damage=10",trigger="Time=0"))
        w.step();assertEquals(101*256,w.p1.activeHitDef!!.guardDistance);assertTrue(w.p2.inGuardDistance)
    }
    @Test fun explicitHitDefDistanceOverridesAnEarlierAttackDist() {
        val w=fight(c("AttackDist","value=101",trigger="Time=0")+"\n"+c("HitDef","guard.dist=30",trigger="Time=0"))
        w.step();assertEquals(30*256,w.p1.guardDistance);assertFalse(w.p2.inGuardDistance)
    }
    @Test fun negativeAndZeroRangesDisableProximity() {
        for(value in listOf(-30,0)) {
            val w=fight(c("AttackDist","value=$value"));w.p2.posX=256;w.step()
            assertEquals(0,w.p1.guardDistance);assertFalse(w.p2.inGuardDistance)
        }
    }
    @Test fun malformedAttackDistPreservesTheCurrentDefinitionAndRange() {
        for(params in listOf("","value=unknown","value=1/0","value=100001","value=1,2","value=3\nx=2")) {
            val w=fight(c("HitDef","guard.dist=50",trigger="Time=0"));w.step();val hit=w.p1.activeHitDef
            execute(w,"AttackDist",params);assertSame(hit,w.p1.activeHitDef);assertEquals(50*256,w.p1.guardDistance)
            assertTrue(w.issues.any{it.startsWith("Invalid AttackDist:")})
        }
    }
    @Test fun invalidHitDefDistanceDoesNotReplaceAnExistingAttack() {
        val w=fight(c("HitDef","guard.dist=50",trigger="Time=0")+"\n"+
            c("HitDef","guard.dist=unknown",trigger="Time=1"));w.step();val hit=w.p1.activeHitDef;w.step()
        assertSame(hit,w.p1.activeHitDef);assertTrue(w.issues.any{it.startsWith("Invalid guard.dist:")})
    }
    @Test fun expressionsAndIntegerTruncationUseActiveStateCoordinates() {
        val d=definition("$attacking\n"+c("AttackDist","value=ifelse(var(0),201.9,10)"),640)
        val w=DeterministicFight(FightingCharacter(d,1),FightingCharacter(definition(),2))
        w.p1.vars[0]=1;w.p1.changeState(200);w.p2.posX=100*256;w.step()
        assertEquals(Fixed.of(100.5),w.p1.guardDistance);assertTrue(w.p2.inGuardDistance)
    }
    @Test fun stateEntryResetsRangeUnlessHitDefPersistenceIsRequested() {
        for(persist in 0..1) {
            val w=fight(c("HitDef","guard.dist=60",trigger="Time=0")+
                "\n[Statedef 300]\ntype=S\nmovetype=A\nphysics=N\nanim=0\nhitdefpersist=$persist")
            w.step();w.p1.changeState(300);assertEquals((if(persist==1)60 else 160)*256,w.p1.guardDistance)
        }
    }
    @Test fun controllerReadsSeePreviousPassRegardlessOfWhichRootAttacks() {
        for(side in 0..1) {
            val observe=c("VarSet","v=0\nvalue=InGuardDist",state=0)
            val d=definition("$observe\n$attacking\n"+c("VarSet","v=0\nvalue=InGuardDist"))
            val w=DeterministicFight(FightingCharacter(d,1),FightingCharacter(d,2))
            w.p1.posX=0;w.p2.posX=100*256;w.p2.facingRight=false
            val attacker=if(side==0)w.p1 else w.p2;val defender=if(side==0)w.p2 else w.p1
            attacker.changeState(200);w.step();assertEquals(0,defender.vars[0]);assertTrue(defender.inGuardDistance)
            w.step();assertEquals(1,defender.vars[0]);attacker.changeState(0)
            w.step();assertEquals(1,defender.vars[0]);assertFalse(defender.inGuardDistance)
            w.step();assertEquals(0,defender.vars[0])
        }
    }
    @Test fun attackDistDoesNotRearmAlreadyStruckTargets() {
        val w=fight("[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n"+
            c("HitDef","damage=10\nground.velocity=0,0",trigger="Time=0")+"\n"+c("AttackDist","value=200"))
        w.p2.posX=5*256;w.step();assertEquals(990,w.p2.life);assertFalse(w.p1.canHit(w.p2.id))
        repeat(3){w.step()};assertEquals(990,w.p2.life);assertFalse(w.p1.canHit(w.p2.id))
    }
    @Test fun hitpauseGatesControllerWritesButRetainsTheCurrentRange() {
        for(ignore in 0..1) {
            val w=fight(c("AttackDist","value=Time+50\nignorehitpause=$ignore"));w.step();w.p1.hitPauseLeft=2
            repeat(2){w.step()};assertEquals((if(ignore==1)51 else 50)*256,w.p1.guardDistance)
            assertEquals(1,w.p1.timeInState);w.step();assertEquals(51*256,w.p1.guardDistance)
        }
    }
    @Test fun persistentZeroAttackDistRearmsOnStateEntry() {
        val w=fight(c("AttackDist","value=Time+50\npersistent=0"));repeat(3){w.step()}
        assertEquals(50*256,w.p1.guardDistance);w.p1.changeState(200);w.step();assertEquals(50*256,w.p1.guardDistance)
    }
    @Test fun borrowedBankRangeUsesExecutingVariablesWithoutReplacingOwnDefaults() {
        val w=fight();val bank=FightingCharacter(definition("[Size]\nattack.dist=400\n$attacking\n"+
            c("AttackDist","value=var(0)"),640),3)
        w.p1.vars[0]=202;bank.vars[0]=60;w.p1.enterAuthoredState(200,bank,w.issues);w.step()
        assertEquals(101*256,w.p1.guardDistance);assertTrue(w.p2.inGuardDistance)
        w.p1.changeState(0,w.p1);assertEquals(160*256,w.p1.guardDistance)
    }
    @Test fun helpersThreatenOpposingRootsAndHelpersButNotTheirOwnSide() {
        val w=fight();w.p1.changeState(0)
        w.entities.add(listOf(EntityRequest.Helper(w.p1,1,200,0,0,1,false,0),
            EntityRequest.Helper(w.p2,2,0,0,0,1,false,0)),w.issues);w.step()
        assertTrue(w.p2.inGuardDistance);assertTrue(w.entities.helpers[1].actor.inGuardDistance)
        assertFalse(w.p1.inGuardDistance);assertFalse(w.entities.helpers[0].actor.inGuardDistance)
        w.entities.helpers[0].actor.destroyed=true;w.step();assertFalse(w.p2.inGuardDistance)
    }
    @Test fun projectileDefaultsAndStrictBoundsWorkOnBirthAndAfterward() {
        val d=definition(shot());val p=FightingCharacter(d,1);val v=FightingCharacter(definition(),2)
        val world=DeterministicFight(p,v);v.posX=89*256;world.step();assertTrue(v.inGuardDistance)
        v.posX=90*256;world.step();assertFalse(v.inGuardDistance);v.posX=0;world.step();assertFalse(v.inGuardDistance)
    }
    @Test fun projectilesCaptureTheirOwnRangeAndLaunchFacing() {
        val d=definition("[Size]\nproj.attack.dist=240\n"+shot()+"\n"+
            c("AttackDist","value=1",state=0)+"\n"+c("Turn",state=0),640)
        val w=DeterministicFight(FightingCharacter(d,1),FightingCharacter(definition(),2));w.p2.posX=100*256
        // Turn after queuing the projectile must not rotate its captured orientation.
        w.step();assertTrue(w.p2.inGuardDistance);assertEquals(120*256,w.entities.projectiles.single().hit.guardDistance)
        w.step();assertTrue(w.p2.inGuardDistance)
    }
    @Test fun explicitProjectileRangeUsesActiveUnitsAndSupportsAlias() {
        for(key in listOf("guard.dist","projguard.dist")) {
            val d=definition(shot("$key=202"),640)
            val w=DeterministicFight(FightingCharacter(d,1),FightingCharacter(definition(),2));w.p2.posX=100*256;w.step()
            assertTrue(w.p2.inGuardDistance);assertEquals(101*256,w.entities.projectiles.single().hit.guardDistance)
        }
    }
    @Test fun exhaustedInvalidAndZeroRangeProjectilesDoNotThreaten() {
        for(params in listOf("projhits=0","attr=invalid","guard.dist=0","guard.dist=-1","projremovetime=0")) {
            val d=definition(shot(params));val w=DeterministicFight(FightingCharacter(d,1),FightingCharacter(definition(),2))
            w.p2.posX=20*256;w.step();assertFalse(w.p2.inGuardDistance,params)
        }
    }
    @Test fun projectileMovementPauseAndFinalLifetimeParticipateInThePass() {
        val d=definition(shot("velocity=10,0\nprojremovetime=1\nguard.dist=15\nprojhits=2\nprojremove=0\npausetime=2,0"))
        val w=DeterministicFight(FightingCharacter(d,1),FightingCharacter(definition(),2));w.p2.posX=20*256
        w.step();assertFalse(w.p2.inGuardDistance);w.entities.projectiles.single().onContact(false)
        repeat(2){w.step();assertFalse(w.p2.inGuardDistance);assertEquals(0,w.entities.projectiles.single().x)}
        w.step();assertTrue(w.p2.inGuardDistance)
        w.step();assertFalse(w.p2.inGuardDistance)
    }
    @Test fun readOnlyExpressionsAndPlansCannotRefreshOrClearTheLatch() {
        val w=fight();w.step();w.p1.changeState(0);val before=w.checksum()
        repeat(8){assertTrue(CoreExpression.test("InGuardDist",w.p2,w.issues));CorePresentationPlanner.snapshot(w,12)}
        assertTrue(w.p2.inGuardDistance);assertEquals(before,w.checksum());w.step();assertFalse(w.p2.inGuardDistance)
    }
}
