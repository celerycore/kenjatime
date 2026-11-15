package moe.celery.kenjatime

import kotlin.test.*

/** Separate hit/guard clocks in the supported contact phase, not native parity. */
class GuardPauseTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nctrl=1\nanim=0"
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private fun attack(params: String)="[Statedef 200]\ntype=S\nphysics=N\nmovetype=A\nanim=200\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=10,2\nguardflag=HL\n$params"
    private fun fight(params: String="",extra: String=""): DeterministicFight {
        val d=FighterDefinition.fromScript("attacker",air,"$idle\n${attack(params)}\n$extra")
        return DeterministicFight(FightingCharacter(d,1),FightingCharacter(FighterDefinition.fromScript("defender",air,idle),2)).also {
            it.p2.posX=20*Fixed.ONE;it.p2.facingRight=false
        }
    }
    private fun contact(w: DeterministicFight,guard: Boolean=true) {
        w.p1.changeState(200);w.step(b=InputFrame(if(guard)Directions.R else 0))
    }
    private fun projectile(params: String)="[State 0, projectile]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n"+
        "damage=10,2\nguardflag=HL\nprojhits=2\nprojmisstime=10\nvelocity=1,0\n$params"

    @Test fun guardedRootAttacksUseIndependentAuthoredPauseComponents() {
        val w=fight("pausetime=7,9\nguard.pausetime=2,5");contact(w)
        assertEquals(2,w.p1.hitPauseLeft);assertEquals(5,w.p2.hitPauseLeft);assertEquals(998,w.p2.life)
        assertEquals(5.0,CoreExpression.number("GetHitVar(hitshaketime)",w.p2,w.issues))
    }
    @Test fun unguardedContactsRetainTheOrdinaryPausePair() {
        val w=fight("pausetime=7,9\nguard.pausetime=2,5");contact(w,false)
        assertEquals(7,w.p1.hitPauseLeft);assertEquals(9,w.p2.hitPauseLeft);assertEquals(990,w.p2.life)
    }
    @Test fun omittedGuardPairInheritsBothOrdinaryComponents() {
        val w=fight("pausetime=2,5");contact(w)
        assertEquals(2,w.p1.hitPauseLeft);assertEquals(5,w.p2.hitPauseLeft)
    }
    @Test fun zeroOnEitherSideDoesNotFreezeTheOtherClock() {
        for((a,b) in listOf(0 to 5,5 to 0,0 to 0)) {
            val w=fight("guard.pausetime=$a,$b");contact(w)
            assertEquals(a,w.p1.hitPauseLeft);assertEquals(b,w.p2.hitPauseLeft)
        }
    }
    @Test fun clocksResumeIndependentlyThroughEachLastFrozenTick() {
        val w=fight("guard.pausetime=2,5");contact(w)
        val attackerTime=w.p1.timeInState
        repeat(2){w.step();assertTrue(w.p1.hitPauseThisTick);assertEquals(attackerTime,w.p1.timeInState)}
        assertEquals(0,w.p1.hitPauseLeft);assertEquals(3,w.p2.hitPauseLeft)
        w.step();assertFalse(w.p1.hitPauseThisTick);assertTrue(w.p2.hitPauseThisTick)
        assertEquals(attackerTime+1,w.p1.timeInState);assertEquals(0,w.p2.timeInState)
        repeat(2){w.step()};assertTrue(w.p2.hitPauseThisTick);assertEquals(0,w.p2.hitPauseLeft)
        w.step();assertFalse(w.p2.hitPauseThisTick);assertEquals(1,w.p2.timeInState)
    }
    @Test fun nestedExpressionsAndVariablesStayIntactAndCaptureAtHitDefCreation() {
        val w=fight("pausetime=ifelse(var(0),7,1),max(8,9)\nguard.pausetime=min(2,4),ifelse(1,5,0)")
        w.p1.vars[0]=1;contact(w);val hit=w.p1.activeHitDef!!
        w.p1.vars[0]=0
        assertEquals(7,hit.hitPause);assertEquals(9,hit.defenderPause)
        assertEquals(2,hit.guardPause);assertEquals(5,hit.guardDefenderPause)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
    @Test fun scalarPauseRetainsMirroredPairShorthand() {
        val w=fight("pausetime=3\nguard.pausetime=4");contact(w)
        assertEquals(4,w.p1.hitPauseLeft);assertEquals(4,w.p2.hitPauseLeft)
        assertEquals(3,w.p1.activeHitDef!!.defenderPause)
    }
    @Test fun pauseLimitsApplyToBothComponents() {
        val w=fight("pausetime=-2,200\nguard.pausetime=200,-2");contact(w)
        assertEquals(120,w.p1.hitPauseLeft);assertEquals(0,w.p2.hitPauseLeft)
        assertEquals(0,w.p1.activeHitDef!!.hitPause);assertEquals(120,w.p1.activeHitDef!!.defenderPause)
    }
    @Test fun invalidHitDefPauseLeavesThePreviousAttackIntact() {
        val w=fight("pausetime=2,5","[State 200, malformed]\ntype=HitDef\ntrigger1=Time=1\npausetime=1,2,3")
        w.p2.posX=1000*Fixed.ONE;w.p1.changeState(200);w.step();val original=w.p1.activeHitDef
        w.step();assertSame(original,w.p1.activeHitDef);assertTrue(w.issues.any { it.startsWith("Invalid hit pause:") })
    }
    @Test fun malformedProjectilePauseCannotCreateAPartialEntity() {
        for(raw in listOf("1,2,3","ifelse(1,2,3","unknown,1","1/0,2","1,")) {
            val w=fight(extra=projectile("guard.pausetime=$raw"));w.step()
            assertTrue(w.entities.projectiles.isEmpty(),raw)
            assertTrue(w.issues.any { it.startsWith("Invalid hit pause:") },raw)
        }
    }
    @Test fun helperGuardPauseFreezesTheHelperAndDefenderSeparately() {
        val w=fight("guard.pausetime=2,5","[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200")
        w.step();w.step(b=InputFrame(Directions.R))
        val h=w.entities.helpers.single().actor
        assertEquals(2,h.hitPauseLeft);assertEquals(5,w.p2.hitPauseLeft);assertEquals(0,w.p1.hitPauseLeft)
    }
    @Test fun projectileGuardPauseUsesItsOwnClockAndTheDefendersSeparateClock() {
        val w=fight(extra=projectile("pausetime=7,9\nguard.pausetime=2,5"))
        w.step();w.step(b=InputFrame(Directions.R));val p=w.entities.projectiles.single()
        assertEquals(2,p.hitPauseLeft);assertEquals(5,w.p2.hitPauseLeft);assertEquals(0,w.p1.hitPauseLeft)
        val x=p.x;repeat(2){w.step();assertEquals(x,p.x)}
        w.step();assertEquals(x+Fixed.ONE,p.x);assertEquals(2,w.p2.hitPauseLeft)
    }
    @Test fun projectileAliasesAreAcceptedButStandardNamesTakePrecedence() {
        val w=fight(extra=projectile("projpausetime=7,9\nprojguard.pausetime=3,6\nguard.pausetime=2,5"))
        w.step();w.step(b=InputFrame(Directions.R))
        assertEquals(2,w.entities.projectiles.single().hitPauseLeft);assertEquals(5,w.p2.hitPauseLeft)
    }
    @Test fun directHitDefinitionsKeepExplicitGuardDefaultsCompatible() {
        val w=fight();w.p2.receiveHit(HitDefinition(guardPause=3),true,true,w.p1)
        assertEquals(3,w.p2.hitPauseLeft)
        w.p2.receiveHit(HitDefinition(guardPause=3,guardDefenderPause=6),true,true,w.p1)
        assertEquals(6,w.p2.hitPauseLeft)
    }
    @Test fun renderQueriesCannotConsumeEitherGuardClock() {
        val w=fight("guard.pausetime=2,5");contact(w)
        repeat(10){CorePresentationPlanner.snapshot(w,12)}
        assertEquals(2,w.p1.hitPauseLeft);assertEquals(5,w.p2.hitPauseLeft)
    }
}
