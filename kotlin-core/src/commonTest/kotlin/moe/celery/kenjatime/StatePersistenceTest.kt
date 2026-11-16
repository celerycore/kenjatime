package moe.celery.kenjatime

import kotlin.test.*

/** State-entry contracts for the current boolean contact/manual-counter subset. */
class StatePersistenceTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0"
    private val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private val attack="[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n"+
        "[State 200, counter]\ntype=HitAdd\ntrigger1=Time=0\nvalue=7\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=90,20\nguardflag=HL\nground.velocity=3,0"
    private fun destination(flags: String="",controllers: String="",anim: Int=200)=
        "[Statedef 300]\ntype=S\nmovetype=A\nphysics=N\nanim=$anim\n$flags\n$controllers"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("persistent",air,
        "$idle\n$hurt\n$attack\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(flags: String="",controllers: String="",anim: Int=200)=DeterministicFight(
        FightingCharacter(definition(destination(flags,controllers,anim)),1),FightingCharacter(definition(),2)).also {
        it.p2.posX=5*Fixed.ONE;it.p2.facingRight=false
    }
    private fun strike(w: DeterministicFight,guarded: Boolean=false) {
        w.p1.changeState(200);w.step(b=InputFrame(if(guarded)Directions.R else 0))
    }
    private fun add(actor: FightingCharacter,value: String,options: String="") {
        val c=MugenCnsParser.parse("$idle\n[State 0, count]\ntype=HitAdd\ntrigger1=1\nvalue=$value\n$options")
            .getValue(0).controllers.single()
        CoreHitCounts.add(actor,c,actor.world!!.issues)
    }

    @Test fun parserRetainsIndependentRawPersistenceExpressions() {
        val p=MugenCnsParser.parse(destination("hitdefpersist=var(0)\nmovehitpersist=ifelse(var(1),1,0)\nhitcountpersist=2"))
            .getValue(300)
        assertEquals("var(0)",p.hitDefPersist);assertEquals("ifelse(var(1),1,0)",p.moveHitPersist)
        assertEquals("2",p.hitCountPersist);assertNull(MugenCnsParser.parse(idle).getValue(0).hitDefPersist)
    }
    @Test fun allFlagCombinationsIndependentlyPreserveOrResetTheirData() {
        for(hit in 0..1)for(move in 0..1)for(count in 0..1)for(guarded in listOf(false,true)) {
            val w=fight("hitdefpersist=$hit\nmovehitpersist=$move\nhitcountpersist=$count");strike(w,guarded)
            val original=w.p1.activeHitDef;assertEquals(7,w.p1.hitCount);w.p1.changeState(300)
            assertEquals(if(hit==1)original else null,w.p1.activeHitDef)
            assertEquals(move==1,w.p1.moveContact);assertEquals(move==1 && !guarded,w.p1.moveHit)
            assertEquals(move==1 && guarded,w.p1.moveGuarded);assertEquals(if(count==1)7 else 0,w.p1.hitCount)
            if(hit==1)assertFalse(w.p1.canHit(w.p2.id),"Preserving an attack must preserve its spent window")
        }
    }
    @Test fun omittedFlagsResetAttackContactAndManualCounter() {
        val w=fight();strike(w);w.p1.changeState(300)
        assertNull(w.p1.activeHitDef);assertFalse(w.p1.moveContact);assertFalse(w.p1.moveHit)
        assertEquals(0,w.p1.hitCount);assertEquals(0.0,CoreExpression.number("HitCount",w.p1,w.issues))
    }
    @Test fun anUnspentPreservedAttackCanHitAfterTheTransition() {
        val w=fight("hitdefpersist=1");w.p2.posX=1000*Fixed.ONE;w.p1.changeState(200);w.step()
        val original=w.p1.activeHitDef;w.p1.changeState(300);w.p2.posX=5*Fixed.ONE;w.step()
        assertSame(original,w.p1.activeHitDef);assertEquals(910,w.p2.life);assertEquals(1,w.contacts.size)
    }
    @Test fun spentPreservedAttacksCannotHitTheSameVictimAgain() {
        val w=fight("hitdefpersist=1\nmovehitpersist=1");strike(w);w.p1.changeState(300)
        repeat(3){w.step()};assertEquals(910,w.p2.life);assertTrue(w.contacts.isEmpty());assertTrue(w.p1.moveHit)
    }
    @Test fun repeatedSameStateTransitionsCannotRearmWithoutANewHitDefinition() {
        val w=fight("hitdefpersist=1");strike(w)
        repeat(3){w.p1.changeState(300);w.step();assertTrue(w.contacts.isEmpty())}
        assertEquals(910,w.p2.life)
        w.p1.changeState(200);w.step();assertEquals(820,w.p2.life)
    }
    @Test fun aValidNewStateHitDefinitionReplacesTheCarryOnce() {
        val next="[State 300, replacement]\ntype=HitDef\ntrigger1=1\ndamage=5"
        val w=fight("hitdefpersist=1",next);strike(w);val original=w.p1.activeHitDef
        w.p1.changeState(300);w.step();assertNotSame(original,w.p1.activeHitDef)
        assertEquals(5,w.p1.activeHitDef!!.damage);assertEquals(905,w.p2.life)
        w.step();assertEquals(905,w.p2.life);assertTrue(w.contacts.isEmpty())
    }
    @Test fun invalidReplacementCannotDestroyOrRearmThePreservedAttack() {
        val next="[State 300, invalid]\ntype=HitDef\ntrigger1=1\nguard.kill=unknown"
        val w=fight("hitdefpersist=1",next);strike(w);val original=w.p1.activeHitDef
        w.p1.changeState(300);w.step();assertSame(original,w.p1.activeHitDef)
        assertEquals(910,w.p2.life);assertTrue(w.contacts.isEmpty())
        assertTrue(w.issues.any { it.startsWith("Invalid hit kill flag:") })
    }
    @Test fun preservationDoesNotCreateAttackBoxesInANonAttackingAnimation() {
        val w=fight("hitdefpersist=1",anim=0);w.p2.posX=1000*Fixed.ONE;w.p1.changeState(200);w.step()
        w.p1.changeState(300);w.p2.posX=5*Fixed.ONE;w.step();assertEquals(1000,w.p2.life)
        assertNotNull(w.p1.activeHitDef);w.p1.changeAnimation(200);w.step();assertEquals(910,w.p2.life)
    }
    @Test fun flagsEvaluateBeforeAnyIncomingMoveDataIsCleared() {
        val w=fight("hitdefpersist=HitCount>0\nmovehitpersist=0\nhitcountpersist=0");strike(w)
        val original=w.p1.activeHitDef;w.p1.changeState(300)
        assertSame(original,w.p1.activeHitDef);assertFalse(w.p1.moveContact);assertEquals(0,w.p1.hitCount)
    }
    @Test fun destinationStateTimeAndActorVariablesAreVisibleDuringEvaluation() {
        val w=fight("hitdefpersist=Time=0 && StateNo=300 && var(0)\n"+
            "movehitpersist=ifelse(MoveHit,1,0)\nhitcountpersist=MoveContact")
        strike(w);w.p1.vars[0]=1;w.p1.changeState(300)
        assertNotNull(w.p1.activeHitDef);assertTrue(w.p1.moveHit);assertEquals(7,w.p1.hitCount)
    }
    @Test fun borrowedDestinationFlagsUseTheExecutingActorsVariables() {
        val w=fight();val owner=FightingCharacter(definition(destination("hitdefpersist=var(0)\nmovehitpersist=1\nhitcountpersist=1"),640),3)
        strike(w);w.p1.vars[0]=1;owner.vars[0]=0;val original=w.p1.activeHitDef
        w.p1.enterAuthoredState(300,owner,w.issues)
        assertSame(original,w.p1.activeHitDef);assertSame(w.p1,original!!.stateOwner)
        assertSame(owner,w.p1.stateOwner);assertEquals(7,w.p1.hitCount);assertTrue(w.p1.moveHit)
    }
    @Test fun preservedMixedCoordinateKnockbackIsNotConvertedAgain() {
        val w=fight();w.p2.posX=1000*Fixed.ONE;w.p1.changeState(200);w.step()
        val owner=FightingCharacter(definition(destination("hitdefpersist=1"),640),3)
        w.p1.enterAuthoredState(300,owner,w.issues);w.p2.posX=5*Fixed.ONE;w.step()
        assertEquals(3*Fixed.ONE,w.p2.velX);assertEquals(90,w.contacts.single().damage)
    }
    @Test fun invalidPersistenceDisablesAllCarriesWhileEnteringTheDestination() {
        for(flag in listOf("hitdefpersist","movehitpersist","hitcountpersist"))for(value in listOf("unknown","1/0","1,0")) {
            val w=fight("hitdefpersist=1\nmovehitpersist=1\nhitcountpersist=1\n$flag=$value")
            strike(w);val errors=if(value=="unknown")linkedSetOf<String>() else w.issues
            if(value=="unknown")assertTrue(w.p1.enterAuthoredState(300,w.p1,errors)) else w.p1.changeState(300)
            assertEquals(300,w.p1.stateNo);assertNull(w.p1.activeHitDef);assertFalse(w.p1.moveContact)
            assertEquals(0,w.p1.hitCount);assertTrue(errors.any { it.startsWith("Invalid StateDef persistence:") })
        }
    }
    @Test fun invalidInitialStateFlagsRemainVisibleAfterFightCreation() {
        val a=FightingCharacter(definition("[Statedef 0]\ntype=S\nanim=0\nhitdefpersist=unknown"),1)
        val w=DeterministicFight(a,FightingCharacter(definition(),2))
        assertTrue(w.issues.any { it.startsWith("Invalid StateDef persistence:") })
    }
    @Test fun nonzeroFlagsPreserveWithoutReevaluatingUntilAnotherEntry() {
        val w=fight("hitdefpersist=var(0)\nmovehitpersist=-1\nhitcountpersist=2");strike(w)
        w.p1.vars[0]=1;w.p1.changeState(300);val original=w.p1.activeHitDef
        w.p1.vars[0]=0;w.step();assertSame(original,w.p1.activeHitDef);assertEquals(7,w.p1.hitCount)
        w.p1.changeState(300);assertNull(w.p1.activeHitDef)
    }
    @Test fun hitAddUsesWideArithmeticAndNestedExpressions() {
        val w=fight();add(w.p1,"2147483647");add(w.p1,"2147483647");assertEquals(Int.MAX_VALUE,w.p1.hitCount)
        add(w.p1,"-2147483648");assertEquals(0,w.p1.hitCount)
        w.p1.vars[0]=4;add(w.p1,"ifelse(var(0),var(0)+3,0)");assertEquals(7,w.p1.hitCount)
    }
    @Test fun invalidHitAddRequestsPreserveTheCounter() {
        for(params in listOf("","value=unknown","value=1/0","value=2147483648","value=-2147483649",
            "value=1,2","value=1\nunsupported=1")) {
            val w=fight();w.p1.hitCount=7
            val c=MugenCnsParser.parse("$idle\n[State 0, add]\ntype=HitAdd\ntrigger1=1\n$params").getValue(0).controllers.single()
            CoreHitCounts.add(w.p1,c,w.issues);assertEquals(7,w.p1.hitCount)
            assertTrue(w.issues.any { it.startsWith("Invalid HitAdd:") })
        }
    }
    @Test fun preservedCountersAreVisibleToDestinationControllers() {
        val c="[State 300, observe]\ntype=VarSet\ntrigger1=HitCount=7 && MoveHit\nv=0\nvalue=1"
        val w=fight("movehitpersist=1\nhitcountpersist=1",c);strike(w);w.p1.changeState(300);w.p1.tick(w.issues)
        assertEquals(1,w.p1.vars[0]);assertNull(w.p1.activeHitDef)
    }
    @Test fun helpersOwnTheirPreservedStateDataAndManualCounters() {
        val w=fight("hitdefpersist=1\nmovehitpersist=1\nhitcountpersist=1")
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,200,0,0,1,false,0)),w.issues);w.step()
        val helper=w.entities.helpers.single().actor;assertTrue(helper.moveHit);assertEquals(7,helper.hitCount)
        helper.changeState(300);assertNotNull(helper.activeHitDef);assertTrue(helper.moveHit)
        assertEquals(7,helper.hitCount);assertEquals(0,w.p1.hitCount);assertFalse(w.p1.moveHit)
    }
    @Test fun ownerStateTransitionsDoNotRetireIndependentProjectiles() {
        val shot="[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\ndamage=10"
        val w=DeterministicFight(FightingCharacter(definition(shot+"\n"+destination()),1),FightingCharacter(definition(),2))
        w.p2.posX=5*Fixed.ONE;w.step();val projectile=w.entities.projectiles.single()
        w.p1.changeState(300);w.step();assertEquals(990,w.p2.life);assertEquals(10,w.contacts.single().damage)
        assertEquals(1.0,projectile.hit.capturedAttackMultiplier)
    }
    @Test fun hitPauseStateTransitionsApplyFlagsAndRenderingCannotMutateThem() {
        val w=fight("hitdefpersist=1\nmovehitpersist=1\nhitcountpersist=1");strike(w);w.p1.hitPauseLeft=2
        w.p1.changeState(300);val original=w.p1.activeHitDef;val checksum=w.checksum()
        repeat(8){CorePresentationPlanner.snapshot(w,12)}
        assertEquals(checksum,w.checksum());assertSame(original,w.p1.activeHitDef)
        assertTrue(w.p1.moveHit);assertEquals(7,w.p1.hitCount);assertEquals(2,w.p1.hitPauseLeft)
    }
}
