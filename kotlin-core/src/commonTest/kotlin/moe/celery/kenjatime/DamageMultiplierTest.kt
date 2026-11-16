package moe.celery.kenjatime

import kotlin.test.*

/** Runtime factor/capture contracts, not native pause, fall or super phase captures. */
class DamageMultiplierTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0"
    private val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private fun c(type: String,value: String,trigger: String="1",options: String="",state: Int=0)=
        "[State $state, factor]\ntype=$type\ntrigger1=$trigger\nvalue=$value\n$options"
    private fun attack(params: String="",extra: String="")="[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=90,20\nguardflag=HL\n$params\n$extra"
    private fun shot(params: String="")="[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n"+
        "damage=90,20\nguardflag=HL\n$params"
    private fun fight(a: String="",b: String="",params: String="",attackExtra: String="",extra: String="")=
        DeterministicFight(
            FightingCharacter(FighterDefinition.fromScript("attacker",air,
                "[Data]\nattack=150\n$idle\n$a\n$hurt\n${attack(params,attackExtra)}\n$extra"),1),
            FightingCharacter(FighterDefinition.fromScript("victim",air,
                "[Data]\ndefence=200\n$idle\n$b\n$hurt\n${attack(params,attackExtra)}"),2)).also {
            it.p2.posX=5*Fixed.ONE;it.p2.facingRight=false
        }
    private fun set(actor: FightingCharacter,type: String,value: String) {
        val controller=MugenCnsParser.parse("$idle\n${c(type,value)}").getValue(0).controllers.single()
        CoreDamage.execute(actor,controller,actor.world!!.issues)
    }
    private fun strike(w: DeterministicFight,guarded: Boolean=false) {
        w.p1.changeState(200);w.step(b=InputFrame(if(guarded)Directions.R else 0))
    }
    private fun report(w: DeterministicFight,amount: Int) {
        assertEquals(amount,w.contacts.single().damage);assertEquals(amount.toDouble(),w.p2.getHitVar("damage"))
    }

    @Test fun freshActorsStartWithIndependentUnitMultipliers() {
        val w=fight();assertEquals(1.0,w.p1.attackMultiplier);assertEquals(1.0,w.p2.defenceMultiplier)
        set(w.p1,"AttackMulSet","2");set(w.p2,"DefenceMulSet",".25")
        assertEquals(1.0,w.p2.attackMultiplier);assertEquals(1.0,w.p1.defenceMultiplier)
        val fresh=fight();assertEquals(1.0,fresh.p1.attackMultiplier);assertEquals(1.0,fresh.p2.defenceMultiplier)
    }
    @Test fun attackAndDefenceFactorsScaleBothHitAndGuardBeforeRounding() {
        for(guarded in listOf(false,true)) {
            val w=fight(b=c("DefenceMulSet",".25"),attackExtra=c("AttackMulSet","2",state=200))
            strike(w,guarded);val amount=if(guarded)8 else 34
            report(w,amount);assertEquals(1000-amount,w.p2.life)
        }
    }
    @Test fun factorsCombineBeforeTheSingleIntegerRounding() {
        val w=fight(b=c("DefenceMulSet",".5"),params="damage=2",attackExtra=c("AttackMulSet","1.5",state=200))
        strike(w);report(w,1) // 2 * 150/200 * 1.5 * .5 = 1.125; rounding the base first would produce 2.
    }
    @Test fun zeroFactorsSuppressDamageWithoutSuppressingTheContact() {
        for(type in listOf("AttackMulSet","DefenceMulSet")) {
            val w=fight();set(if(type=="AttackMulSet")w.p1 else w.p2,type,"0");strike(w)
            report(w,0);assertEquals(1000,w.p2.life);assertEquals(5000,w.p2.stateNo)
            assertTrue(w.p1.moveHit);assertEquals(63,w.p1.power);assertEquals(54,w.p2.power)
        }
    }
    @Test fun tinyPositiveFactorsRetainOneDamage() {
        val w=fight();set(w.p1,"AttackMulSet",".0000001");strike(w);report(w,1)
    }
    @Test fun nestedExpressionsEvaluateInTheActualActor() {
        val w=fight(a=c("AttackMulSet","ifelse(var(0),max(1,var(1)/2),.5)"))
        w.p1.vars[0]=1;w.p1.vars[1]=4;w.p1.tick(w.issues)
        assertEquals(2.0,w.p1.attackMultiplier);assertEquals(1.0,w.p2.attackMultiplier)
    }
    @Test fun invalidParametersPreserveAnExistingFactor() {
        for(type in listOf("AttackMulSet","DefenceMulSet"))for(params in listOf("","value=unknown","value=-1",
            "value=1/0","value=1,2","value=2\nunsupported=1")) {
            val script=c(type,"1.5")+"\n[State 0, invalid]\ntype=$type\ntrigger1=1\n$params"
            val w=fight(a=script);w.p1.tick(w.issues)
            assertEquals(1.5,if(type=="AttackMulSet")w.p1.attackMultiplier else w.p1.defenceMultiplier)
            assertTrue(w.issues.any { it.startsWith("Invalid $type:") },"$type/$params")
        }
    }
    @Test fun finiteBoundsRejectInvalidFvarsAndAcceptTheLargestFactor() {
        for(value in listOf(Double.NaN,Double.POSITIVE_INFINITY,-1.0,Double.MAX_VALUE)) {
            val w=fight(a=c("AttackMulSet","fvar(0)"));w.p1.fvars[0]=value;w.p1.tick(w.issues)
            assertEquals(1.0,w.p1.attackMultiplier);assertTrue(w.issues.any { it.startsWith("Invalid AttackMulSet:") })
        }
        val w=fight();w.p1.fvars[0]=Float.MAX_VALUE.toDouble();set(w.p1,"AttackMulSet","fvar(0)")
        w.p2.fvars[0]=Float.MAX_VALUE.toDouble();set(w.p2,"DefenceMulSet","fvar(0)")
        strike(w);report(w,Int.MAX_VALUE);assertEquals(0,w.p2.life)
    }
    @Test fun multipliersPersistAcrossStateChangesAndBorrowedBanks() {
        val w=fight();set(w.p1,"AttackMulSet","2");set(w.p2,"DefenceMulSet",".5")
        w.p1.enterAuthoredState(200,w.p2,w.issues);w.step()
        assertSame(w.p2,w.p1.stateOwner);assertEquals(2.0,w.p1.attackMultiplier)
        assertEquals(.5,w.p2.defenceMultiplier);report(w,68)
    }
    @Test fun borrowedControllersChangeTheExecutingActorRatherThanTheBankOwner() {
        val w=fight(attackExtra=c("AttackMulSet","2",state=200))
        w.p2.enterAuthoredState(200,w.p1,w.issues);w.p2.tick(w.issues)
        assertEquals(2.0,w.p2.attackMultiplier);assertEquals(1.0,w.p1.attackMultiplier)
    }
    @Test fun installedBodyHitDefinitionsUseLiveAttackFactors() {
        val w=fight(attackExtra=c("AttackMulSet","2","Time=1",state=200))
        w.p2.posX=1000*Fixed.ONE;w.p1.changeState(200);w.step();val hit=w.p1.activeHitDef
        w.p2.posX=5*Fixed.ONE;w.step();assertSame(hit,w.p1.activeHitDef)
        assertNull(hit!!.capturedAttackMultiplier);report(w,135)
    }
    @Test fun projectileRequestsCaptureBeforeLaterControllersInTheSamePhase() {
        val w=fight(a=c("AttackMulSet","2","Time=0")+"\n"+shot()+"\n"+c("AttackMulSet","7","Time=0"))
        w.step();assertEquals(7.0,w.p1.attackMultiplier)
        assertEquals(2.0,w.entities.projectiles.single().hit.capturedAttackMultiplier)
        w.step();report(w,135);assertEquals(865,w.p2.life)
    }
    @Test fun queuedAndDirectProjectileConstructionRetainTheirCapturedFactor() {
        val w=fight();set(w.p1,"AttackMulSet","2")
        val hit=HitDefinition(damage=90)
        val request=EntityRequest.Projectile(w.p1,1,200,0,0,0,0,-1,hit)
        val direct=CoreProjectile(w.p1,99,99,AirAnimationPlayer(w.p1.definition.animations.getValue(200)),hit,0,0,0,0,-1)
        set(w.p1,"AttackMulSet","7");w.entities.add(listOf(request),w.issues)
        assertEquals(2.0,w.entities.projectiles.single().hit.capturedAttackMultiplier)
        assertEquals(2.0,direct.hit.capturedAttackMultiplier);assertNull(hit.capturedAttackMultiplier)
    }
    @Test fun invalidCapturedFactorsCannotQueueOrConstructProjectileHits() {
        val w=fight()
        for(value in listOf(-1.0,Double.NaN,Double.POSITIVE_INFINITY,Double.MAX_VALUE)) {
            assertFailsWith<IllegalArgumentException> { HitDefinition(capturedAttackMultiplier=value) }
            w.entities.add(listOf(EntityRequest.Projectile(w.p1,1,200,0,0,0,0,-1,HitDefinition(),attackMultiplier=value)),w.issues)
            assertTrue(w.entities.projectiles.isEmpty())
        }
    }
    @Test fun multiHitProjectilesUseCapturedAttackAndLiveVictimDefence() {
        val w=fight(a=c("AttackMulSet","2","Time=0")+"\n"+shot("projhits=3")+"\n"+c("AttackMulSet","7","Time=0"))
        w.step();set(w.p2,"DefenceMulSet",".5");w.step();report(w,68)
        set(w.p2,"DefenceMulSet","2");w.step();report(w,270)
        set(w.p2,"DefenceMulSet","0");w.step();report(w,0)
        assertEquals(662,w.p2.life);assertEquals(189,w.p1.power);assertEquals(162,w.p2.power)
        assertTrue(w.entities.projectiles.isEmpty())
    }
    @Test fun freshHelpersHaveIndependentFactorsAndCanSetTheirOwn() {
        val spawn="[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200"
        val w=fight(a=c("AttackMulSet","2","Time=0")+"\n"+spawn)
        w.step();val helper=w.entities.helpers.single().actor;assertEquals(1.0,helper.attackMultiplier)
        w.step();report(w,68);assertEquals(2.0,w.p1.attackMultiplier)
        val own=fight(a=spawn,attackExtra=c("AttackMulSet","2",state=200));own.step();own.step()
        report(own,135);assertEquals(1.0,own.p1.attackMultiplier)
    }
    @Test fun targetLifeAddUsesRuntimeDefenceButIgnoresAttackAndAbsoluteBypassesIt() {
        for(absolute in 0..1) {
            val w=fight(a=c("AttackMulSet","7")+"\n"+c("TargetLifeAdd","-60",options="absolute=$absolute"))
            w.p2.receiveHit(HitDefinition(id=71),true,attacker=w.p1);set(w.p2,"DefenceMulSet",".5")
            w.p1.tick(w.issues);assertEquals(if(absolute==1)940 else 985,w.p2.life)
        }
    }
    @Test fun lifeAddKeepsTheDocumentedRuntimeDefenceException() {
        val w=fight(a=c("DefenceMulSet",".5")+"\n"+c("LifeAdd","-60"))
        w.p1.tick(w.issues);assertEquals(940,w.p1.life)
    }
    @Test fun zeroAndHugeRuntimeDefenceCannotBreakScriptedHealthArithmetic() {
        for((value,expected) in listOf(-60 to 500,60 to 500)) {
            val w=fight(a=c("TargetLifeAdd",value.toString()))
            w.p2.life=500
            w.p2.receiveHit(HitDefinition(id=71),true,attacker=w.p1);set(w.p2,"DefenceMulSet","0")
            w.p1.tick(w.issues);assertEquals(expected,w.p2.life)
        }
        for((value,expected) in listOf(Int.MAX_VALUE to 1000,Int.MIN_VALUE to 0)) {
            val w=fight(a=c("TargetLifeAdd",value.toString()));w.p2.life=500
            w.p2.receiveHit(HitDefinition(id=71),true,attacker=w.p1)
            w.p2.fvars[0]=Float.MAX_VALUE.toDouble();set(w.p2,"DefenceMulSet","fvar(0)")
            w.p1.tick(w.issues);assertEquals(expected,w.p2.life)
        }
    }
    @Test fun hitpauseAndPersistenceUseTheExistingControllerRules() {
        for(ignore in 0..1) {
            val w=fight(a=c("AttackMulSet","2",options="ignorehitpause=$ignore"));w.p1.hitPauseLeft=2
            w.p1.tick(w.issues);assertEquals(if(ignore==1)2.0 else 1.0,w.p1.attackMultiplier)
        }
        val w=fight(a=c("AttackMulSet","var(0)",options="persistent=0"));w.p1.vars[0]=2;w.p1.tick(w.issues)
        w.p1.vars[0]=7;w.p1.tick(w.issues);assertEquals(2.0,w.p1.attackMultiplier)
    }
    @Test fun laterControllersAndPresentationObserveFactorsWithoutRepeatingDamage() {
        val w=fight(b=c("DefenceMulSet",".5"),attackExtra=c("AttackMulSet","2",state=200));strike(w)
        val checksum=w.checksum();repeat(10){CorePresentationPlanner.snapshot(w,12)}
        report(w,68);assertEquals(checksum,w.checksum());assertEquals(2.0,w.p1.attackMultiplier)
        assertEquals(.5,w.p2.defenceMultiplier);assertEquals(63,w.p1.power);assertEquals(54,w.p2.power)
    }
}
