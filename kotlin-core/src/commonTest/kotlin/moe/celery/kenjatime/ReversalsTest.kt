package moe.celery.kenjatime

import kotlin.test.*

class ReversalsTest {
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=0"
    private val attack="[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\nctrl=0"
    private val counter="[Statedef 300]\ntype=S\nmovetype=A\nphysics=N\nanim=200\nctrl=0"
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,50,0\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n200,0,0,0,-1"
    private fun c(type: String="ReversalDef",params: String="reversal.attr=SCA,AA,AP,AT",state: Int=300,trigger: String="Time=0")=
        "[State $state, controller]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun def(script: String="",width: Int=320,art: String=air)=FighterDefinition.fromScript("reversal",art,
        "$idle\n$attack\n$counter\n$script",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(params: String="reversal.attr=SCA,AA,AP,AT",hit: String="attr=S,NA\ndamage=80",left: String="",right: String="",art: String=air)=
        DeterministicFight(FightingCharacter(def(c(params=params)+"\n$left",art=art),1),
            FightingCharacter(def(c("HitDef",hit,200)+"\n$right",art=art),2)).also {
                it.p2.posX=20*256;it.p2.facingRight=false;it.p1.changeState(300);it.p2.changeState(200)
            }
    private fun execute(a: FightingCharacter,params: String="reversal.attr=SCA,AA,AP,AT",source: FightingCharacter=a) {
        val ctl=MugenCnsParser.parse("$counter\n${c(params=params)}").getValue(300).controllers.single()
        CoreReversals.execute(a,ctl,source,a.world!!.issues)
    }
    @Test fun successfulReversalCancelsAttackWithoutDamagePowerOrHitStun() {
        val w=fight();w.step();assertEquals(listOf(CoreReversalContact(1,2,0)),w.reversals.contacts)
        assertTrue(w.contacts.isEmpty());assertEquals(1000,w.p1.life);assertEquals(1000,w.p2.life)
        assertEquals(0,w.p1.power);assertEquals(0,w.p2.power);assertEquals(0,w.p2.hitStunLeft)
        assertTrue(w.p1.moveHit);assertTrue(w.p2.moveReversed);assertTrue(w.p2.hitDefReversed);assertFalse(w.p2.canHit(1))
    }
    @Test fun strikeProjectileAndThrowAttributeClassesUseTheCapturedHitDef() {
        for(attr in listOf("S,NA","C,SP","A,HT","S,HA")) {
            val w=fight(hit="attr=$attr\ndamage=80");w.step();assertEquals(1,w.reversals.contacts.size,attr)
        }
    }
    @Test fun mismatchedStateAndAttackClassesAllowOrdinaryDamage() {
        for(attr in listOf("C,NA","S,SA","A,HT")) {
            val w=fight("reversal.attr=S,NA",hit="attr=$attr\ndamage=80");w.step()
            assertTrue(w.reversals.contacts.isEmpty());assertEquals(920,w.p1.life);assertEquals(1,w.contacts.size)
        }
    }
    @Test fun attributeStateUsesHitDefinitionRatherThanCurrentAttackerPosture() {
        val w=fight("reversal.attr=A,NA",hit="attr=A,NA\ndamage=80");w.step();assertEquals("S",w.p2.stateType);assertEquals(1,w.reversals.contacts.size)
    }
    @Test fun attackBoxesCanReverseWithoutEitherActorHavingHurtBoxes() {
        val w=fight(art=air.replace("Clsn2Default:1\nClsn2[0]=-10,-40,10,0\n",""));w.step()
        assertTrue(w.p1.hurtBoxes().isEmpty());assertTrue(w.p2.hurtBoxes().isEmpty());assertEquals(1,w.reversals.contacts.size)
    }
    @Test fun hurtBoxOverlapCannotReplaceMissingAttackBoxes() {
        val w=fight(art=air.replace("Clsn1Default:1\nClsn1[0]=0,-40,50,0\n",""));w.step()
        assertTrue(w.reversals.contacts.isEmpty());assertTrue(w.contacts.isEmpty())
    }
    @Test fun touchingEdgesAndNonoverlappingBoxesDoNotReverse() {
        for(x in listOf(100,101)) {
            val w=fight();w.p2.posX=x*256;w.step();assertTrue(w.reversals.contacts.isEmpty())
        }
    }
    @Test fun mirroredSidesUseRealFacingAndWorldCollisionBoxes() {
        val w=fight();w.p1.posX=20*256;w.p1.facingRight=false;w.p2.posX=0;w.p2.facingRight=true;w.step()
        assertEquals(1,w.reversals.contacts.size);assertTrue(w.p2.hitDefReversed)
    }
    @Test fun reversalBypassesVictimHitFiltersAndHitOverrideRouting() {
        val extra=c("NotHitBy","value=SCA,AA,AP,AT\ntime=-1",200)+"\n"+
            c("HitOverride","attr=SCA,AA,AP,AT\ntime=-1\nstateno=900",200)+"\n[Statedef 900]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
        val w=fight(right=extra);w.step();assertEquals(1,w.reversals.contacts.size);assertEquals(200,w.p2.stateNo)
    }
    @Test fun alreadyUsedAttacksCannotBeReversedAgainstTheSameOpponent() {
        val w=fight();w.p2.tick(w.issues);w.p2.markHit(1);w.step();assertTrue(w.reversals.contacts.isEmpty());assertEquals(1000,w.p1.life)
    }
    @Test fun activeHitPauseOnEitherParticipantDefersReversal() {
        for(side in 0..1) {
            val w=fight(left=c(params="reversal.attr=S,NA\nignorehitpause=1",trigger="1"),right=c("HitDef","attr=S,NA\ndamage=80",200,trigger="1"),
                art=air.replace("Clsn2Default:1\nClsn2[0]=-10,-40,10,0\n",""))
            (if(side==0)w.p1 else w.p2).hitPauseLeft=2;w.step();assertTrue(w.reversals.contacts.isEmpty());w.step();assertTrue(w.reversals.contacts.isEmpty())
            w.step();assertEquals(1,w.reversals.contacts.size)
        }
    }
    @Test fun reversalPausePairsAreIndependentAndDoNotAdvanceContactClocks() {
        val w=fight("reversal.attr=S,NA\npausetime=2,4");w.step();assertEquals(2,w.p1.hitPauseLeft);assertEquals(4,w.p2.hitPauseLeft)
        repeat(2){w.step();assertEquals(1,w.p1.moveHitTime);assertEquals(1,w.p2.moveReversedTime)}
        w.step();assertEquals(2,w.p1.moveHitTime);assertEquals(1,w.p2.moveReversedTime)
        w.step();assertEquals(1,w.p2.moveReversedTime);w.step();assertEquals(2,w.p2.moveReversedTime)
    }
    @Test fun pauseExpressionsUseExistingNestedPairParsingAndBounds() {
        val w=fight("reversal.attr=S,NA\npausetime=ifelse(var(0),3,2),max(4,5)");w.p1.vars[0]=1;w.step()
        assertEquals(3,w.p1.hitPauseLeft);assertEquals(5,w.p2.hitPauseLeft)
        val other=fight("reversal.attr=S,NA\npausetime=-2,999");other.step();assertEquals(0,other.p1.hitPauseLeft);assertEquals(120,other.p2.hitPauseLeft)
    }
    @Test fun moveReversedIsExclusiveAndSharesTheExistingElapsedClock() {
        val w=fight();w.step();for(name in listOf("MoveContact","MoveHit","MoveGuarded"))assertEquals(0.0,CoreExpression.number(name,w.p2,w.issues))
        assertEquals(1.0,CoreExpression.number("MoveReversed",w.p2,w.issues));w.step();assertEquals(2.0,CoreExpression.number("MoveReversed",w.p2,w.issues))
        w.p2.recordMoveContact(true);assertFalse(w.p2.moveReversed);assertEquals(1,w.p2.moveGuardedTime)
    }
    @Test fun moveHitResetClearsReversedResultWithoutRearmingTheCancelledAttack() {
        val w=fight();w.step();w.p2.clearMoveContact();assertEquals(0,w.p2.moveReversedTime);assertFalse(w.p2.canHit(1))
        repeat(3){w.step();assertEquals(1000,w.p1.life);assertTrue(w.reversals.contacts.isEmpty())}
    }
    @Test fun noStateTransferLeavesOriginalStateAndGetHitDataUntouched() {
        val w=fight();val before=w.p2.getHitData.copy();w.step();assertEquals(200,w.p2.stateNo);assertEquals(before,w.p2.getHitData)
        assertEquals(listOf(w.p2),w.p1.targets());assertEquals(1,w.p1.targets(0).size)
    }
    @Test fun reversalTargetsCanBeBoundAndDroppedWithoutAHitReaction() {
        val extra=c("TargetBind","time=2\npos=7,-9",300,trigger="NumTarget>0")+"\n"+c("TargetDrop","keepone=0",300,trigger="Time=2")
        val w=fight(left=extra);w.step();w.step();assertEquals(7*256,w.p2.posX);assertEquals(-9*256,w.p2.posY)
        assertEquals(1,w.p1.targets().size);w.step();assertTrue(w.p1.targets().isEmpty())
    }
    @Test fun recoveringTargetStateChangesReleaseNonHitReversalTargets() {
        val w=fight();w.step();assertEquals(1,w.p1.targets().size);w.p2.changeState(0);assertTrue(w.p1.targets().isEmpty())
    }
    @Test fun customStateTransfersUseTheExecutingStateBankAndPreserveRequestedResults() {
        val states="[Statedef 910]\ntype=S\nmovetype=A\nphysics=N\nanim=0\nmovehitpersist=1\n"+
            "[Statedef 911]\ntype=S\nmovetype=H\nphysics=N\nanim=0\nmovehitpersist=1"
        val w=fight("reversal.attr=S,NA\nid=71\np1stateno=910\np2stateno=911",left=states);w.step()
        assertEquals(910,w.p1.stateNo);assertEquals(911,w.p2.stateNo);assertSame(w.p1,w.p2.stateOwner)
        assertEquals(1,w.p1.moveHitTime);assertEquals(1,w.p2.moveReversedTime);assertEquals(listOf(w.p2),w.p1.targets(71));assertEquals(1000,w.p1.life)
    }
    @Test fun destinationStatePersistenceCanResetMoveResults() {
        val states="[Statedef 910]\ntype=S\nphysics=N\nanim=0\n[Statedef 911]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
        val w=fight("reversal.attr=S,NA\np1stateno=910\np2stateno=911",left=states);w.step()
        assertEquals(0,w.p1.moveHitTime);assertEquals(0,w.p2.moveReversedTime);assertEquals(1,w.p1.targets().size)
    }
    @Test fun ownP2StateRoutingAndMissingDestinationsAreAtomicAtContact() {
        val own="[Statedef 911]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
        val w=fight("reversal.attr=S,NA\np2getp1state=0\np2stateno=911",right=own);w.step();assertEquals(911,w.p2.stateNo);assertSame(w.p2,w.p2.stateOwner)
        val bad=fight("reversal.attr=S,NA\np2getp1state=0\np2stateno=911");bad.step()
        assertTrue(bad.reversals.contacts.isEmpty());assertFalse(bad.p2.hitDefReversed);assertEquals(920,bad.p1.life);assertTrue(bad.issues.any {it.startsWith("Missing ReversalDef target state")})
    }
    @Test fun malformedRequestsCannotReplaceAWorkingWindow() {
        val bad=listOf("","reversal.attr=","reversal.attr=S","reversal.attr=,NA","reversal.attr=Z,NA","reversal.attr=S,ZZ",
            "reversal.attr=S,NA\nid=-1","reversal.attr=S,NA\npausetime=1,unknown","reversal.attr=S,NA\np1stateno=999",
            "reversal.attr=S,NA\np2stateno=999","reversal.attr=S,NA\np2getp1state=1/0","reversal.attr=S,NA\ndamage=99",
            "reversal.attr=S,NA\nsparkno=1","reversal.attr=S,NA\nhitsound=1,0","reversal.attr=S,NA\nredirectid=2")
        for(params in bad) {
            val w=fight();execute(w.p1);val prior=w.p1.activeReversal;execute(w.p1,params)
            assertSame(prior,w.p1.activeReversal,params);assertTrue(w.issues.isNotEmpty(),params)
        }
    }
    @Test fun reversalAndHitDefShareAnExclusiveAttackWindow() {
        val w=fight(left=c("HitDef","attr=S,NA\ndamage=10",300));w.p2.changeState(0);w.step();assertNull(w.p1.activeReversal);assertNotNull(w.p1.activeHitDef)
        val other=fight();other.step();execute(other.p2);assertNull(other.p2.activeHitDef);assertNotNull(other.p2.activeReversal)
    }
    @Test fun repeatedControllersDoNotRearmSpentReversalsOrNeutralizedHitDefs() {
        val w=fight(left=c(params="reversal.attr=S,NA",trigger="1"),right=c("HitDef","attr=S,NA\ndamage=80",200,trigger="1"))
        w.step();repeat(5){w.step();assertTrue(w.reversals.contacts.isEmpty());assertEquals(1000,w.p1.life);assertTrue(w.p2.hitDefReversed)}
    }
    @Test fun stateEntryRearmsBothWindowsAndHitDefPersistRetainsThem() {
        val w=fight();w.step();val original=w.p1.activeReversal
        val state=StateProgram(400,null,emptyList(),hitDefPersist="1",moveHitPersist="1")
        val a=FightingCharacter(w.p1.definition.copy(states=w.p1.definition.states+ (400 to state)),3)
        val pair=DeterministicFight(a,FightingCharacter(w.p2.definition,4));execute(a);val before=a.activeReversal;a.changeState(400);assertSame(before,a.activeReversal)
        execute(a,"reversal.attr=A,HT");assertNotSame(before,a.activeReversal)
        w.p1.changeState(300);w.p2.changeState(200);w.step();assertNotSame(original,w.p1.activeReversal);assertEquals(1,w.reversals.contacts.size)
        assertTrue(pair.issues.isEmpty())
    }
    @Test fun neutralizedWindowsStayInactiveThroughPersistentStateEntry() {
        val w=fight(right="[Statedef 400]\ntype=S\nmovetype=A\nphysics=N\nhitdefpersist=1");w.step();w.p2.changeState(400)
        assertTrue(w.p2.hitDefReversed);assertFalse(w.p2.canHit(1));w.step();assertEquals(1000,w.p1.life)
    }
    @Test fun stateChangesResetReversalAndContactDataByDefault() {
        val w=fight();w.step();w.p1.changeState(0);w.p2.changeState(0)
        assertNull(w.p1.activeReversal);assertFalse(w.p2.hitDefReversed);assertEquals(0,w.p1.moveHitTime);assertEquals(0,w.p2.moveReversedTime)
    }
    @Test fun persistentAndIgnorehitpauseGateReversalRequests() {
        for(ignore in 0..1) {
            val w=fight("reversal.attr=S,NA\nignorehitpause=$ignore");w.p2.changeState(0);w.p1.hitPauseLeft=1;w.step();assertEquals(ignore==1,w.p1.activeReversal!=null)
        }
        val w=fight("reversal.attr=S,NA\npersistent=0",left=c("VarAdd","v=0\nvalue=1",300,trigger="MoveHit"));w.step();w.step();assertEquals(1,w.p1.vars[0])
    }
    @Test fun sameSideAndInactiveOrDeadActorsNeverProduceReversals() {
        val w=fight();w.p2.life=0;w.step();assertTrue(w.reversals.contacts.isEmpty())
        val idleFight=fight();idleFight.p2.changeState(0);idleFight.step();assertTrue(idleFight.reversals.contacts.isEmpty())
        val helperFight=fight();helperFight.p2.changeState(0)
        helperFight.entities.add(listOf(EntityRequest.Helper(helperFight.p1,9,200,0,0,1,false,0)),helperFight.issues)
        helperFight.step();assertTrue(helperFight.reversals.contacts.isEmpty())
    }
    @Test fun rootReversesOpposingHelperAttacksWithoutDamagingTheRealRoot() {
        val w=fight();w.p2.changeState(0)
        w.entities.add(listOf(EntityRequest.Helper(w.p2,9,200,0,0,1,false,0)),w.issues);w.step()
        val helper=w.entities.helpers.single().actor;assertEquals(helper.id,w.reversals.contacts.single().attacker);assertTrue(helper.moveReversed)
        assertEquals(1,w.p1.targets().size);assertEquals(1000,w.p2.life)
    }
    @Test fun helpersReverseRootAttacksWithIndependentContactResults() {
        val w=fight();w.p1.changeState(0)
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,300,0,0,1,false,0)),w.issues);w.step()
        val helper=w.entities.helpers.single().actor;assertEquals(helper.id,w.reversals.contacts.single().reverser);assertEquals(1,helper.moveHitTime)
        assertEquals(0,w.p1.moveHitTime);assertEquals(1000,w.p1.life);assertTrue(w.p2.moveReversed)
    }
    @Test fun helperReversalTargetsAreCleanedUpAfterDestruction() {
        val w=fight();w.p2.changeState(0);w.entities.add(listOf(EntityRequest.Helper(w.p2,9,200,0,0,1,false,0)),w.issues);w.step()
        w.entities.helpers.single().actor.destroyed=true;assertTrue(w.p1.targets().isEmpty());w.step();assertTrue(w.p1.targets().isEmpty())
    }
    @Test fun simultaneousReversersUseStableDistanceThenActorIdSelection() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p1,9,300,0,0,1,false,0)),w.issues);w.step()
        assertEquals(1,w.reversals.contacts.size);assertEquals(1,w.reversals.contacts.single().reverser)
    }
    @Test fun simultaneousOpposingReversalWindowsHaveNoOrdinaryDamage() {
        val w=fight(right=c(params="reversal.attr=S,NA",state=200));w.step()
        assertTrue(w.reversals.contacts.isEmpty());assertTrue(w.contacts.isEmpty());assertEquals(1000,w.p1.life);assertEquals(1000,w.p2.life)
    }
    @Test fun borrowedBanksUseExecutingValuesAndRetainCapturedSourceOwnership() {
        val w=fight();w.p2.changeState(0);val bank=FightingCharacter(def("[Statedef 910]\ntype=S\nphysics=N\nanim=0",1008),3)
        w.p1.vars[0]=7;bank.vars[0]=99;execute(w.p1,"reversal.attr=S,NA\nid=var(0)\np1stateno=910",bank)
        val rev=w.p1.activeReversal!!;assertEquals(7,rev.id);assertSame(bank,rev.source)
    }
    @Test fun foreignFightBanksCannotInstallAReversal() {
        val w=fight();val other=fight();execute(w.p1,source=other.p1);assertNull(w.p1.activeReversal);assertTrue(w.issues.isNotEmpty())
    }
    @Test fun idReadsTheExecutingActorAcrossHelpersAndBorrowedStateBanks() {
        val w=fight("reversal.attr=S,NA\nid=ID");w.step();assertEquals(1,w.p1.activeReversal!!.id)
        assertEquals(2.0,CoreExpression.number("ID",w.p2,w.issues))
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,300,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor;helper.enterAuthoredState(300,w.p1,w.issues);w.step()
        assertEquals(3.0,CoreExpression.number("ID",helper,w.issues));assertEquals(3,helper.activeReversal!!.id)
        assertSame(w.p1,helper.activeReversal!!.source);assertTrue(w.issues.isEmpty())
    }
    @Test fun mixedCoordinatesAndDisplayOffsetsUseCanonicalAttackGeometry() {
        for(width in listOf(320,640,1008))for(face in listOf(true,false)) {
            val factor=width/320.0;val art=air.replace("0,-40,50,0","0,${-40*factor},${50*factor},0")
            // AIR coordinates are integers; choose a box that has exact integer bounds in every bank.
            val integerArt=art.replace("0,${-40*factor},${50*factor},0","0,${(-40*factor).toInt()},${(50*factor).toInt()},0")
            val a=FightingCharacter(def(c()+"\n"+c("Offset","x=${5*factor}",300,trigger="1"),width,integerArt),1);val b=FightingCharacter(def(c("HitDef","attr=S,NA\ndamage=80",200)),2)
            val w=DeterministicFight(a,b);a.changeState(300);b.changeState(200);a.facingRight=face;b.facingRight=!face
            a.posX=if(face)0 else 20*256;b.posX=if(face)20*256 else 0;w.step();assertEquals(1,w.reversals.contacts.size)
        }
    }
    @Test fun displayOffsetCanCreateAnAttackOverlapThatWasAbsentInBodySpace() {
        val w=fight(left=c("Offset","x=150",300,trigger="1"));w.p2.posX=200*256;w.step()
        assertEquals(1,w.reversals.contacts.size);assertEquals(1000,w.p1.life);assertEquals(150L*256,w.p1.displayOffsetX)
    }
    @Test fun realProjectileEntitiesRemainOutsideTheBodyReversalSubset() {
        val w=fight(right=c("Projectile","projanim=200\nprojremovetime=10\nvelocity=0,0\nattr=S,NP\ndamage=15",0));w.p2.changeState(0)
        repeat(2){w.step()};assertTrue(w.reversals.contacts.isEmpty());assertEquals(985,w.p1.life)
    }
    @Test fun inspectionAndDifferentPresentationCadencesCannotCreateOrRepeatContacts() {
        val w=fight();w.step();val before=w.reversals.json();val checksum=w.checksum()
        repeat(5){for(backlog in listOf(0L,2L,5L,12L)){CorePresentationPlanner.snapshot(w,backlog);assertEquals(before,w.reversals.json())}}
        assertEquals(checksum,w.checksum());w.step();assertTrue(w.reversals.contacts.isEmpty())
    }
    @Test fun independentFightsAndUnrelatedProjectilesDoNotShareReversalContacts() {
        val w=fight();val other=fight();w.step();assertTrue(other.reversals.contacts.isEmpty());assertNull(other.p1.activeReversal)
        assertEquals(0,w.p1.hitCount);assertEquals(0,w.p2.hitCount);assertTrue(w.p2.projectileHistory.snapshot().isEmpty())
    }
}
