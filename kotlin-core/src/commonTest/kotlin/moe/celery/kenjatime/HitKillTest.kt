package moe.celery.kenjatime

import kotlin.test.*

/** Initial-contact lethality flags, not native fall-damage/KO phase captures. */
class HitKillTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nctrl=1\nanim=0"
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private fun attack(params: String)="[Statedef 200]\ntype=S\nphysics=N\nmovetype=A\nanim=200\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=50,50\nguardflag=HL\n$params"
    private fun fight(params: String="",extra: String=""): DeterministicFight {
        val a=FighterDefinition.fromScript("attacker",air,"$idle\n${attack(params)}\n$extra")
        val b=FighterDefinition.fromScript("victim",air,"$idle\n[Statedef 700]\ntype=S\nmovetype=H\nphysics=N\nanim=0")
        return DeterministicFight(FightingCharacter(a,1),FightingCharacter(b,2)).also {
            it.p2.posX=20*Fixed.ONE;it.p2.facingRight=false;it.p2.life=10
        }
    }
    private fun strike(w: DeterministicFight,guarded: Boolean=false) {
        w.p1.changeState(200);w.step(b=InputFrame(if(guarded)Directions.R else 0))
    }
    private fun projectile(params: String)="[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n"+
        "damage=50,50\nguardflag=HL\nprojhits=2\n$params"

    @Test fun omittedFlagsPreserveLethalHitAndGuardDefaults() {
        for(guarded in listOf(false,true)) {
            val w=fight();strike(w,guarded)
            assertEquals(0,w.p2.life);assertEquals(5150,w.p2.stateNo)
        }
    }
    @Test fun hitAndGuardFlagsSelectIndependently() {
        for(kill in 0..1)for(guardKill in 0..1)for(guarded in listOf(false,true)) {
            val w=fight("kill=$kill\nguard.kill=$guardKill");strike(w,guarded)
            val lethal=if(guarded)guardKill==1 else kill==1
            assertEquals(if(lethal)0 else 1,w.p2.life,"$kill/$guardKill guarded=$guarded")
            assertEquals(if(lethal)5150 else if(guarded)150 else 5000,w.p2.stateNo)
        }
    }
    @Test fun oneFlagDoesNotImplicitlyDisableTheOther() {
        val hit=fight("kill=0");strike(hit,true);assertEquals(0,hit.p2.life)
        val guard=fight("guard.kill=0");strike(guard);assertEquals(0,guard.p2.life)
    }
    @Test fun nonzeroBooleanFlagsPermitKO() {
        for(flag in listOf("1","2","-1")) {
            val w=fight("kill=$flag");strike(w);assertEquals(0,w.p2.life)
        }
    }
    @Test fun nestedExpressionsCaptureFlagsWhenTheHitDefIsCreated() {
        val w=fight("kill=ifelse(var(0),0,1)\nguard.kill=max(0,var(1))")
        w.p1.vars[0]=1;w.p1.vars[1]=0;w.p2.posX=1000*Fixed.ONE;w.p1.changeState(200);w.step()
        val hit=w.p1.activeHitDef!!;w.p1.vars[0]=0;w.p1.vars[1]=1
        assertFalse(hit.kill);assertFalse(hit.guardKill)
        w.p2.receiveHit(hit,true,attacker=w.p1);assertEquals(1,w.p2.life)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
    @Test fun repeatedNonlethalDamageNeverDropsBelowOne() {
        val w=fight();val hit=HitDefinition(damage=50,kill=false)
        repeat(5){w.p2.receiveHit(hit,true,attacker=w.p1);assertEquals(1,w.p2.life)}
        assertEquals(5000,w.p2.stateNo)
    }
    @Test fun nonlethalZeroDamageDoesNotHealOrChangeOrdinaryDamageAmounts() {
        val w=fight();w.p2.receiveHit(HitDefinition(damage=3,kill=false),true)
        assertEquals(7,w.p2.life)
        w.p2.receiveHit(HitDefinition(damage=0,kill=false),true);assertEquals(7,w.p2.life)
    }
    @Test fun alreadyDeadActorsCannotBeRevivedByANonlethalHit() {
        val w=fight();w.p2.life=0
        w.p2.receiveHit(HitDefinition(damage=50,kill=false,guardKill=false),true)
        assertEquals(0,w.p2.life);assertTrue(w.p1.targets().isEmpty())
    }
    @Test fun incomingDataAndContactReportsRetainAuthoredDamageWhileLifeIsCapped() {
        val w=fight("kill=0");strike(w)
        assertEquals(1,w.p2.life);assertEquals(50,w.contacts.single().damage)
        assertEquals(50.0,CoreExpression.number("GetHitVar(damage)",w.p2,w.issues))
        assertEquals(1,w.p1.targets().size)
    }
    @Test fun nonlethalThrowCanEnterPairedStatesAndCaptureItsVictim() {
        val w=fight("kill=0\nid=71\np1stateno=800\np2stateno=900",
            "[Statedef 800]\ntype=S\nphysics=N\nanim=0\n[Statedef 900]\ntype=S\nmovetype=H\nphysics=N\nanim=0")
        strike(w)
        assertEquals(1,w.p2.life);assertEquals(800,w.p1.stateNo);assertEquals(900,w.p2.stateNo)
        assertSame(w.p1,w.p2.stateOwner);assertEquals(listOf(w.p2),w.p1.targets(71))
    }
    @Test fun hitOverrideRoutingStillAppliesToNonlethalDamage() {
        val w=fight("kill=0")
        val c=MugenCnsParser.parse("[Statedef 0]\n[State 0, armor]\ntype=HitOverride\ntrigger1=1\nattr=SCA,AA\nstateno=700\ntime=-1")
            .getValue(0).controllers.single()
        w.p2.hitOverrides.execute(w.p2,c,w.issues);strike(w)
        assertEquals(1,w.p2.life);assertEquals(700,w.p2.stateNo);assertSame(w.p2,w.p2.stateOwner)
    }
    @Test fun helperContactsUseTheSameLethalityFlags() {
        val w=fight("kill=0","[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200")
        w.step();w.step();assertEquals(1,w.p2.life)
        assertEquals(1,w.entities.helpers.single().actor.targets().size);assertTrue(w.p1.targets().isEmpty())
    }
    @Test fun projectileHitsRemainNonlethalAcrossTheirFiniteAllowance() {
        val w=fight(extra=projectile("kill=0"));w.step();w.step();assertEquals(1,w.p2.life)
        assertEquals(1,w.entities.projectiles.single().hitsLeft)
        w.step();assertEquals(1,w.p2.life);assertTrue(w.entities.projectiles.isEmpty())
    }
    @Test fun projectileGuardDamageUsesGuardKillIndependently() {
        val w=fight(extra=projectile("kill=1\nguard.kill=0"));w.step()
        repeat(2){w.step(b=InputFrame(Directions.R));assertEquals(1,w.p2.life)}
        assertTrue(w.entities.projectiles.isEmpty());assertEquals(150,w.p2.stateNo)
    }
    @Test fun invalidFlagsCannotReplaceAnExistingHitDef() {
        val w=fight("kill=0","[State 200, invalid]\ntype=HitDef\ntrigger1=Time=1\nguard.kill=unknown")
        w.p2.posX=1000*Fixed.ONE;w.p1.changeState(200);w.step();val hit=w.p1.activeHitDef
        w.step();assertSame(hit,w.p1.activeHitDef)
        assertTrue(w.issues.any { it.startsWith("Invalid hit kill flag:") })
    }
    @Test fun invalidProjectileFlagsNeverQueuePartialEntities() {
        for(params in listOf("kill=unknown","guard.kill=1/0","kill=1,0")) {
            val w=fight(extra=projectile(params));w.step()
            assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.issues.any { it.startsWith("Invalid hit kill flag:") })
        }
    }
    @Test fun aNonlethalContactDoesNotEndTheActiveRound() {
        val w=fight("kill=0");w.enableRoundFlow(CoreRoundRules(introFrames=0,roundCueFrames=0,fightCueFrames=0))
        repeat(3){w.step()};strike(w);assertEquals(CoreRoundPhase.ACTIVE,w.roundFlow!!.phase)
        w.p2.receiveHit(HitDefinition(damage=50),true);w.step();assertEquals(CoreRoundPhase.KO,w.roundFlow!!.phase)
    }
    @Test fun renderingCannotApplyNonlethalDamageAgain() {
        val w=fight("kill=0");strike(w)
        repeat(8){CorePresentationPlanner.snapshot(w,12)}
        assertEquals(1,w.p2.life);assertEquals(1,w.contacts.size);assertEquals(5000,w.p2.stateNo)
    }
}
