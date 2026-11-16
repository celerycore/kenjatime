package moe.celery.kenjatime

import kotlin.test.*

/** Elapsed move results and explicit reset, independent of attack rearming and manual HitCount. */
class MoveContactTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=1"
    private val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private fun attack(state: Int=200,params: String="",controllers: String="")="[Statedef $state]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n"+
        "[State $state, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=10,2\nguardflag=HLA\n$params\n$controllers"
    private fun reset(params: String="",trigger: String="MoveContact")="[State 200, reset]\ntype=MoveHitReset\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("move contacts",air,
        "$idle\n$hurt\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(params: String="",controllers: String="",extra: String="")=DeterministicFight(
        FightingCharacter(definition("${attack(params=params,controllers=controllers)}\n$extra"),1),FightingCharacter(definition(),2)).also {
            it.p2.posX=5*Fixed.ONE;it.p2.facingRight=false
        }
    private fun strike(w: DeterministicFight,guarded: Boolean=false) {
        w.p1.changeState(200);w.step(b=InputFrame(if(guarded)Directions.R else 0))
    }
    private fun execute(actor: FightingCharacter,params: String="") {
        val c=MugenCnsParser.parse("$idle\n${reset(params)}").getValue(200).controllers.single()
        CoreMoveContacts.reset(actor,c,actor.world!!.issues)
    }
    private fun query(actor: FightingCharacter,name: String)=CoreExpression.number(name,actor,actor.world!!.issues)
    @Test fun freshMoveResultsAreZero() {
        val w=fight();for(name in listOf("MoveContact","MoveHit","MoveGuarded"))assertEquals(0.0,query(w.p1,name))
    }
    @Test fun bodyHitStartsAtOneAndAdvancesOncePerActiveActorTick() {
        val w=fight();strike(w);assertEquals(1,w.p1.moveContactTime);assertEquals(1.0,query(w.p1,"MoveHit"))
        for(expected in 2..5){w.step();assertEquals(expected,w.p1.moveContactTime);assertEquals(expected.toDouble(),query(w.p1,"MoveHit"))}
        assertEquals(0.0,query(w.p1,"MoveGuarded"));assertEquals(990,w.p2.life)
    }
    @Test fun guardedContactsAdvanceOnlyContactAndGuardedResults() {
        val w=fight();strike(w,true);repeat(3){w.step(b=InputFrame(Directions.R))}
        assertEquals(4.0,query(w.p1,"MoveContact"));assertEquals(4.0,query(w.p1,"MoveGuarded"))
        assertEquals(0.0,query(w.p1,"MoveHit"));assertEquals(998,w.p2.life)
    }
    @Test fun cnsSeesOneOnItsFirstActivePhaseThenTheClockAdvances() {
        val w=fight(controllers="[State 200, observe]\ntype=VarSet\ntrigger1=MoveContact\nv=0\nvalue=MoveContact")
        strike(w);w.step();assertEquals(1,w.p1.vars[0]);assertEquals(2,w.p1.moveContactTime)
        w.step();assertEquals(2,w.p1.vars[0]);assertEquals(3,w.p1.moveContactTime)
    }
    @Test fun hitpauseFreezesContactAgeThroughItsFinalFrozenTick() {
        for(pause in listOf(1,3)) {
            val w=fight(params="pausetime=$pause,0");strike(w)
            repeat(pause){w.step();assertEquals(1,w.p1.moveContactTime)}
            assertEquals(0,w.p1.hitPauseLeft);w.step();assertEquals(2,w.p1.moveContactTime)
        }
    }
    @Test fun ignorehitpauseObserversReadTheFrozenContactAge() {
        val w=fight(params="pausetime=2,0",controllers="[State 200, observe]\ntype=VarSet\ntrigger1=MoveHit\nignorehitpause=1\nv=0\nvalue=MoveHit")
        strike(w);repeat(2){w.step();assertEquals(1,w.p1.vars[0]);assertEquals(1,w.p1.moveContactTime)}
        w.step();assertEquals(1,w.p1.vars[0]);assertEquals(2,w.p1.moveContactTime)
    }
    @Test fun resetClearsFlagsAndTimersWithoutChangingAttackTargetsOrHitCount() {
        val w=fight();strike(w);w.p1.hitCount=7;w.p1.hitPauseLeft=2
        val hit=w.p1.activeHitDef;val targets=w.p1.targets();val life=w.p2.life;val power=w.p1.power
        execute(w.p1)
        assertFalse(w.p1.moveContact);assertFalse(w.p1.moveHit);assertFalse(w.p1.moveGuarded)
        assertEquals(0,w.p1.moveContactTime);assertEquals(0,w.p1.moveContactTicks);assertSame(hit,w.p1.activeHitDef)
        assertEquals(targets,w.p1.targets());assertFalse(w.p1.canHit(w.p2.id));assertEquals(7,w.p1.hitCount)
        assertEquals(2,w.p1.hitPauseLeft);assertEquals(life,w.p2.life);assertEquals(power,w.p1.power)
    }
    @Test fun clearingAMoveResultCannotRearmItsSpentHitDefinition() {
        val w=fight();strike(w);execute(w.p1);repeat(5){w.step();assertTrue(w.contacts.isEmpty())}
        assertEquals(990,w.p2.life);assertEquals(0,w.p1.moveContactTime)
    }
    @Test fun aFreshAttackCanStartANewClockAfterReset() {
        val w=fight(extra=attack(300));strike(w);execute(w.p1);w.p1.changeState(300);w.step()
        assertEquals(980,w.p2.life);assertEquals(1,w.p1.moveHitTime)
    }
    @Test fun invalidParametersPreserveAllMoveResultData() {
        for(params in listOf("value=0","x=1","time=1")) {
            val w=fight();strike(w);w.step();execute(w.p1,params)
            assertEquals(2,w.p1.moveContactTime);assertTrue(w.p1.moveHit)
            assertTrue(w.issues.any{it.startsWith("Invalid MoveHitReset:")})
        }
    }
    @Test fun resetUsesNormalIgnorehitpauseExecutionRules() {
        for(ignore in 0..1) {
            val w=fight(params="pausetime=2,0",controllers=reset("ignorehitpause=$ignore"));strike(w);w.step()
            assertEquals(if(ignore==1)0 else 1,w.p1.moveContactTime)
            repeat(3){w.step()};assertEquals(0,w.p1.moveContactTime)
        }
    }
    @Test fun persistentZeroResetRearmsOnStateReentry() {
        val w=fight(controllers=reset("persistent=0"));repeat(2){strike(w);w.step();assertEquals(0,w.p1.moveContactTime)}
        assertEquals(980,w.p2.life)
    }
    @Test fun statePersistencePreservesOrClearsTheWholeElapsedResult() {
        for(persist in 0..1) {
            val w=fight(extra="[Statedef 300]\ntype=S\nmovetype=A\nphysics=N\nanim=200\nmovehitpersist=$persist")
            strike(w);repeat(3){w.step()};assertEquals(4,w.p1.moveContactTime);w.p1.changeState(300)
            assertEquals(if(persist==1)4 else 0,w.p1.moveContactTime)
            w.step();assertEquals(if(persist==1)5 else 0,w.p1.moveContactTime)
        }
    }
    @Test fun resetOverridesCarriedMoveResultsWithoutResettingStateTime() {
        val w=fight(extra="[Statedef 300]\ntype=S\nmovetype=A\nphysics=N\nanim=200\nmovehitpersist=1\n${reset().replace("[State 200, reset]","[State 300, reset]")}")
        strike(w);w.p1.changeState(300);w.step();assertEquals(0,w.p1.moveContactTime);assertEquals(1,w.p1.timeInState)
    }
    @Test fun aNewGuardContactReplacesAnOldHitResultWithAgeOne() {
        val w=fight(extra=attack(300).replace("anim=200\n[State 300", "anim=200\nmovehitpersist=1\n[State 300"));strike(w);repeat(2){w.step()};w.p2.changeState(0);w.p1.changeState(300);w.step(b=InputFrame(Directions.R))
        assertEquals(1,w.p1.moveContactTime);assertEquals(1,w.p1.moveGuardedTime);assertEquals(0,w.p1.moveHitTime)
    }
    @Test fun helperContactsHaveIndependentClocksAndResetDoesNotAffectTheRoot() {
        val w=fight(extra="[State 0, spawn]\ntype=Helper\ntrigger1=Time=0\nstateno=200")
        w.step();w.step();val helper=w.entities.helpers.single().actor
        assertEquals(1,helper.moveHitTime);assertEquals(0,w.p1.moveHitTime)
        w.step();assertEquals(2,helper.moveHitTime);execute(helper);assertEquals(0,helper.moveContactTime)
        assertEquals(0,w.p1.moveContactTime);assertFalse(helper.canHit(w.p2.id))
    }
    @Test fun projectileContactsAndHistoryRemainIndependentOfMoveHitReset() {
        val w=fight(extra="[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nprojid=7\ndamage=10")
        w.step();w.step();assertEquals(0,w.p1.moveContactTime)
        val age=w.p1.projectileHistory.time(ProjectileContactKind.HIT,7,w.frame)
        execute(w.p1);assertEquals(age,w.p1.projectileHistory.time(ProjectileContactKind.HIT,7,w.frame));assertEquals(990,w.p2.life)
    }
    @Test fun borrowedBanksUseTheActorsOwnResultAndDoNotScaleAge() {
        val w=fight();strike(w);w.step();val bank=FightingCharacter(definition("[Statedef 300]\ntype=S\nmovetype=A\nphysics=N\nanim=200\nmovehitpersist=1",640),3)
        w.p1.enterAuthoredState(300,bank,w.issues);assertEquals(2.0,query(w.p1,"MoveHit"))
        execute(w.p1);assertEquals(0,w.p1.moveHitTime);assertEquals(0,bank.moveHitTime)
    }
    @Test fun elapsedResultsSaturateInsteadOfWrapping() {
        val w=fight();strike(w);w.p1.moveContactTicks=Int.MAX_VALUE-1
        repeat(3){w.step()};assertEquals(Int.MAX_VALUE,w.p1.moveContactTime);assertEquals(Int.MAX_VALUE,w.p1.moveHitTime)
        execute(w.p1);assertEquals(0,w.p1.moveContactTime)
    }
    @Test fun pureReadsCannotAgeResetOrRepeatAContact() {
        val w=fight();strike(w);val before=w.checksum();val age=w.p1.moveContactTime;val power=w.p1.power
        repeat(8){query(w.p1,"MoveHit+MoveContact+MoveGuarded");CorePresentationPlanner.snapshot(w,12)}
        assertEquals(age,w.p1.moveContactTime);assertEquals(before,w.checksum());assertEquals(power,w.p1.power);assertEquals(990,w.p2.life)
    }
}
