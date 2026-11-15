package moe.celery.kenjatime

import kotlin.test.*

/** Contact power contracts; native global/team/round ordering is unverified. */
class HitPowerTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=1"
    private val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private fun attack(params: String)="[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=90,2\nguardflag=HL\n$params"
    private fun shot(params: String)="[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n"+
        "projhits=3\nprojremovetime=20\ndamage=90,2\nguardflag=HL\n$params"
    private fun fight(params: String="",extra: String=""): DeterministicFight {
        val a=FighterDefinition.fromScript("attacker",air,"[Data]\npower=5000\n$idle\n$hurt\n${attack(params)}\n$extra")
        val b=FighterDefinition.fromScript("victim",air,"[Data]\npower=3000\n$idle\n$hurt\n[Statedef 700]\ntype=S\nmovetype=H\nphysics=N\nanim=0")
        return DeterministicFight(FightingCharacter(a,1),FightingCharacter(b,2)).also {
            it.p2.posX=20*Fixed.ONE;it.p2.facingRight=false
        }
    }
    private fun strike(w: DeterministicFight,guarded: Boolean=false) {
        w.p1.changeState(200);w.step(b=InputFrame(if(guarded)Directions.R else 0))
    }
    private fun powers(w: DeterministicFight,a: Int,b: Int) { assertEquals(a,w.p1.power);assertEquals(b,w.p2.power) }

    @Test fun defaultSuccessfulContactUsesSinglePrecisionDamageProducts() {
        val w=fight();strike(w);powers(w,63,54)
        assertEquals(910,w.p2.life);assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
    @Test fun guardDefaultsHalveHitPowerAndDoNotUseChipDamage() {
        val w=fight();strike(w,true);powers(w,31,27);assertEquals(998,w.p2.life)
    }
    @Test fun explicitHitAndGuardPairsSelectIndependently() {
        for(guarded in listOf(false,true)) {
            val w=fight("getpower=81,13\ngivepower=57,19");strike(w,guarded)
            powers(w,if(guarded)13 else 81,if(guarded)19 else 57)
        }
    }
    @Test fun singletonPairsDefaultToHalfWithIntegerTruncation() {
        for((value,expected) in listOf(81 to 40,-81 to -40)) {
            val w=fight("getpower=$value\ngivepower=$value");w.p1.power=100;w.p2.power=100
            strike(w,true);powers(w,100+expected,100+expected)
        }
    }
    @Test fun explicitZeroDisablesOnlyTheRequestedChannel() {
        val get=fight("getpower=0");strike(get);powers(get,0,54)
        val give=fight("givepower=0");strike(give);powers(give,63,0)
        val both=fight("getpower=0,0\ngivepower=0,0");strike(both,true);powers(both,0,0)
    }
    @Test fun nestedExpressionsAndRulesAreCapturedWhenTheAttackIsCreated() {
        val w=fight("getpower=ifelse(var(0),81,9),max(11,var(1))\ngivepower=PowerMax/100,min(20,30)")
        w.p1.vars[0]=1;w.p1.vars[1]=13;w.p2.posX=1000*Fixed.ONE;w.p1.changeState(200);w.step()
        val hit=w.p1.activeHitDef!!;w.p1.vars[0]=0;w.p1.vars[1]=0;w.hitPowerRules=HitPowerRules(0.0,0.0)
        w.p2.receiveHit(hit,true,attacker=w.p1);powers(w,81,50)
        assertEquals(13,hit.guardGetPower);assertEquals(20,hit.guardGivePower)
    }
    @Test fun fightRulesAreIsolatedAndOnlyAffectNewDefinitions() {
        val w=fight();w.hitPowerRules=HitPowerRules(0.5,0.25);w.p2.posX=1000*Fixed.ONE
        w.p1.changeState(200);w.step();val hit=w.p1.activeHitDef!!
        w.hitPowerRules=HitPowerRules(0.0,0.0);w.p2.receiveHit(hit,true,attacker=w.p1);powers(w,45,22)
        val other=fight();strike(other);powers(other,63,54)
        w.p1.changeState(200);w.p1.tick(w.issues)
        assertEquals(0,w.p1.activeHitDef!!.getPower);assertEquals(0,w.p1.activeHitDef!!.givePower)
    }
    @Test fun invalidRuleValuesCannotReplaceTheActiveRules() {
        val w=fight();val before=w.hitPowerRules
        for(value in listOf(-1.0,Double.NaN,Double.POSITIVE_INFINITY,Double.MAX_VALUE)) {
            assertFailsWith<IllegalArgumentException> { w.hitPowerRules=HitPowerRules(value,0.6) }
            assertFailsWith<IllegalArgumentException> { w.hitPowerRules=HitPowerRules(0.7,value) }
            assertSame(before,w.hitPowerRules)
        }
        val largest=HitPowerRules(Float.MAX_VALUE.toDouble(),Float.MAX_VALUE.toDouble())
        assertEquals(Int.MAX_VALUE,largest.attacker(Int.MAX_VALUE));assertEquals(0,largest.defender(0))
        assertEquals(0,HitPowerRules.DEFAULT.attacker(-1))
    }
    @Test fun negativeAndExtremeDeltasRespectEachMetersBoundsWithoutWrapping() {
        val credit=fight("getpower=2147483647\ngivepower=2147483647");credit.p1.power=100;credit.p2.power=100
        strike(credit);powers(credit,5000,3000)
        val drain=fight("getpower=-2147483648\ngivepower=-2147483648");drain.p1.power=100;drain.p2.power=100
        strike(drain);powers(drain,0,0)
    }
    @Test fun zeroDamageHasZeroDefaultsButCanCarryExplicitPower() {
        val w=fight("damage=0,0");strike(w);powers(w,0,0)
        val explicit=fight("damage=0,0\ngetpower=20\ngivepower=30");strike(explicit);powers(explicit,20,30)
    }
    @Test fun rejectedImmunityAndPostureContactsCannotChangeMeters() {
        val flags=fight("hitflag=M+");strike(flags);powers(flags,0,0);assertTrue(flags.contacts.isEmpty())
        val w=fight()
        val c=MugenCnsParser.parse("[Statedef 0]\n[State 0, immune]\ntype=NotHitBy\ntrigger1=1\nvalue=SCA\ntime=-1")
            .getValue(0).controllers.single()
        w.p2.hitFilters.execute(w.p2,c,w.issues);strike(w);powers(w,0,0)
    }
    @Test fun oneHitWindowAndPresentationReadsCannotAwardPowerAgain() {
        val w=fight();strike(w);val checksum=w.checksum()
        repeat(8){CorePresentationPlanner.snapshot(w,12)};powers(w,63,54);assertEquals(checksum,w.checksum())
        repeat(3){w.step()};powers(w,63,54)
    }
    @Test fun helperAttacksCreditTheActualRootsMeter() {
        val w=fight("getpower=17\ngivepower=19","[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200")
        w.step();w.step();powers(w,17,19);assertEquals(17,w.entities.helpers.single().actor.power)
    }
    @Test fun helperVictimsCreditTheirRootAndNotTheAttacker() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p2,9,0,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor;h.receiveHit(HitDefinition(damage=90),true,attacker=w.p1)
        powers(w,63,54);assertEquals(54,h.power)
    }
    @Test fun borrowedHitDefinitionBanksCannotReceiveTheActualAttackersCredit() {
        val w=fight("getpower=81\ngivepower=57")
        w.p2.enterAuthoredState(200,w.p1,w.issues);w.p2.tick(w.issues)
        val hit=w.p2.activeHitDef!!;assertSame(w.p1,hit.stateOwner)
        w.p1.receiveHit(hit,false,attacker=w.p2);powers(w,57,81)
    }
    @Test fun overrideReactionsStillAwardOneAcceptedContactsPower() {
        val w=fight();val c=MugenCnsParser.parse("[Statedef 0]\n[State 0, override]\ntype=HitOverride\ntrigger1=1\n"+
            "attr=SCA,AA\nstateno=700\ntime=-1").getValue(0).controllers.single()
        w.p2.hitOverrides.execute(w.p2,c,w.issues);strike(w);powers(w,63,54);assertEquals(700,w.p2.stateNo)
    }
    @Test fun pairedThrowFollowupsObserveBothUpdatedMeters() {
        val observe="[State 800, observe]\ntype=VarSet\ntrigger1=Time=0\nv=0\nvalue=Power"
        val w=fight("getpower=81\ngivepower=57\np1stateno=800\np2stateno=900",
            "[Statedef 800]\ntype=S\nphysics=N\n$observe\n[Statedef 900]\ntype=S\nmovetype=H\nphysics=N\n"+
            observe.replace("[State 800,","[State 900,"))
        strike(w);powers(w,81,57);w.step();assertEquals(81,w.p1.vars[0]);assertEquals(57,w.p2.vars[0])
    }
    @Test fun lethalAndNonlethalContactsUseAuthoredDamageForPowerDefaults() {
        for(kill in 0..1) {
            val w=fight("kill=$kill");w.p2.life=5;strike(w);powers(w,63,54)
            assertEquals(if(kill==0)1 else 0,w.p2.life)
        }
    }
    @Test fun everyAcceptedProjectileHitAwardsPowerOnceThroughItsAllowance() {
        val w=fight(extra=shot("getpower=17\ngivepower=19\npausetime=1,2"));w.step()
        var hits=0
        repeat(12) {
            w.step();hits+=w.contacts.size
            powers(w,hits*17,hits*19)
            repeat(3){CorePresentationPlanner.snapshot(w,12)};powers(w,hits*17,hits*19)
        }
        assertEquals(3,hits);assertTrue(w.entities.projectiles.isEmpty())
    }
    @Test fun projectileGuardUsesItsIndependentGuardAmounts() {
        val w=fight(extra=shot("getpower=81,13\ngivepower=57,19"));w.step()
        repeat(3){w.step(b=InputFrame(Directions.R))};powers(w,39,57)
        assertEquals(994,w.p2.life);assertTrue(w.entities.projectiles.isEmpty())
    }
    @Test fun expiredRejectedAndCancelledProjectilesCannotAwardPower() {
        for(params in listOf("projremovetime=0","hitflag=M+")) {
            val w=fight(extra=shot(params));repeat(3){w.step()};powers(w,0,0)
        }
        val w=fight(extra=shot("projhits=1"));w.entities.add(listOf(EntityRequest.Projectile(w.p2,2,0,-20*Fixed.ONE,0,
            0,0,-1,HitDefinition(damage=90))),w.issues)
        w.step();w.entities.projectiles.first().x=0;w.step()
        assertTrue(w.entities.clashes.isNotEmpty());powers(w,0,0)
    }
    @Test fun invalidPowerCannotInstallOrReplaceAHitDefinition() {
        val w=fight("getpower=81","[State 200, invalid]\ntype=HitDef\ntrigger1=Time=1\ngivepower=unknown")
        w.p2.posX=1000*Fixed.ONE;w.p1.changeState(200);w.step();val before=w.p1.activeHitDef
        w.step();assertSame(before,w.p1.activeHitDef);assertTrue(w.issues.any { it.startsWith("Invalid hit power:") })
        val first=fight("getpower=1,2,3");strike(first);assertNull(first.p1.activeHitDef);powers(first,0,0)
    }
    @Test fun invalidProjectilePowerNeverQueuesAPartialEntity() {
        for(params in listOf("getpower=unknown","givepower=1/0","getpower=1,2,3","givepower=2147483648",
            "getpower=,2","givepower=1,")) {
            val w=fight(extra=shot(params));w.step();assertTrue(w.entities.projectiles.isEmpty());powers(w,0,0)
            assertTrue(w.issues.any { it.startsWith("Invalid hit power:") },params)
        }
    }
    @Test fun simultaneousTradesAwardEachActorsGetAndIncomingGiveAmounts() {
        val w=fight("getpower=81\ngivepower=57")
        w.p2.enterAuthoredState(200,w.p1,w.issues);w.p1.changeState(200);w.step()
        assertEquals(2,w.contacts.size);powers(w,138,138)
    }
}
