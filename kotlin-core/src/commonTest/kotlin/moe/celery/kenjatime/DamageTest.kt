package moe.celery.kenjatime

import kotlin.test.*

/** Immutable base-stat contracts; runtime/fall/super and native phase parity are unverified. */
class DamageTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=1"
    private val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n[Statedef 700]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private fun attack(params: String)="[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=90,20\nguardflag=HL\n$params"
    private fun shot(params: String)="[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n"+
        "damage=90,20\nguardflag=HL\n$params"
    private fun definition(attack: Int=100,defence: Int=100,params: String="",extra: String="",width: Int=320)=
        FighterDefinition.fromScript("damage",air,"[Data]\nattack=$attack\ndefence=$defence\n$idle\n$hurt\n${attack(params)}\n$extra",
            defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(attack: Int=150,defence: Int=200,params: String="",extra: String="",width: Int=320,
                      defenderAttack: Int=100)=DeterministicFight(
        FightingCharacter(definition(attack,params=params,extra=extra,width=width),1),
        FightingCharacter(definition(defenderAttack,defence,params),2)).also {it.p2.posX=5*Fixed.ONE;it.p2.facingRight=false}
    private fun strike(w: DeterministicFight,guarded: Boolean=false) {
        w.p1.changeState(200);w.step(b=InputFrame(if(guarded)Directions.R else 0))
    }
    private fun damage(w: DeterministicFight,expected: Int) {
        assertEquals(expected,w.contacts.single().damage);assertEquals(expected.toDouble(),w.p2.getHitVar("damage"))
    }

    @Test fun parsesBoundedBaseAttackAndPreservesTheDefault() {
        for((raw,expected) in listOf("150" to 150,"0" to 0,"-1" to 0,"100001" to 100000,
            "unknown" to 100,"2147483648" to 100,"1.5" to 100)) {
            val cns="[Data]\nattack=$raw\n$idle"
            assertEquals(expected,MugenCnsParser.constants(cns).attack,raw)
            assertEquals(expected,FighterDefinition.fromScript("damage",air,cns).attack,raw)
        }
        assertEquals(100,FighterDefinition.fromScript("default",air,idle).attack)
        assertFailsWith<IllegalArgumentException> { FighterDefinition("invalid",attack=-1) }
        assertFailsWith<IllegalArgumentException> { FighterDefinition("invalid",attack=100001) }
    }
    @Test fun defaultStatsPreserveExistingHitAndGuardDamage() {
        for(guarded in listOf(false,true)) {
            val w=fight(100,100);strike(w,guarded);val amount=if(guarded)20 else 90
            assertEquals(1000-amount,w.p2.life);damage(w,amount)
        }
    }
    @Test fun hitAndGuardScaleWithTheActualAttackAndDefenceRatio() {
        for(guarded in listOf(false,true)) {
            val w=fight();strike(w,guarded);val amount=if(guarded)15 else 68
            assertEquals(1000-amount,w.p2.life);damage(w,amount)
            assertTrue(w.issues.isEmpty(),w.issues.joinToString())
        }
    }
    @Test fun zeroAttackRetainsTheContactAndReactionWithoutDamage() {
        for(guarded in listOf(false,true)) {
            val w=fight(attack=0);strike(w,guarded);damage(w,0);assertEquals(1000,w.p2.life)
            assertEquals(if(guarded)150 else 5000,w.p2.stateNo)
            assertTrue(w.p1.moveContact);assertEquals(if(guarded)31 else 63,w.p1.power)
        }
    }
    @Test fun zeroAndNegativeAuthoredDamageCannotBecomeMinimumDamage() {
        for(value in listOf(0,-10))for(guarded in listOf(false,true)) {
            val w=fight(params="damage=$value,$value");strike(w,guarded)
            assertEquals(1000,w.p2.life);damage(w,0)
        }
    }
    @Test fun positiveHalfDamageRoundsUpAndTinyDamageRetainsOne() {
        for((attack,defence,base,expected) in listOf(listOf(100,200,3,2),listOf(1,100000,1,1),listOf(100,100,1,1))) {
            val w=fight(attack,defence,"damage=$base");strike(w)
            assertEquals(1000-expected,w.p2.life);damage(w,expected)
        }
    }
    @Test fun extremeProductsSaturateWithoutWrappingAndRespectNonlethalFlags() {
        for(kill in 0..1) {
            val w=fight(100000,1,"damage=2147483647\nkill=$kill");strike(w)
            assertEquals(if(kill==0)1 else 0,w.p2.life);damage(w,Int.MAX_VALUE)
        }
    }
    @Test fun independentLethalFlagsStillSelectTheCorrectLifeFloor() {
        for(kill in 0..1)for(guardKill in 0..1)for(guarded in listOf(false,true)) {
            val w=fight(200,100,"kill=$kill\nguard.kill=$guardKill");w.p2.life=10;strike(w,guarded)
            assertEquals(if((if(guarded)guardKill else kill)==0)1 else 0,w.p2.life)
            damage(w,if(guarded)40 else 180)
        }
    }
    @Test fun damageMetadataIsScaledButRemainsIndependentOfActualLifeLost() {
        val w=fight(200,100,"kill=0");w.p2.life=10;strike(w)
        assertEquals(1,w.p2.life);damage(w,180);assertEquals(90,w.p1.activeHitDef!!.damage)
        assertEquals(63,w.p1.power);assertEquals(54,w.p2.power)
    }
    @Test fun guardPowerStillUsesAuthoredHitDamageRatherThanScaledChip() {
        val w=fight(200,100);strike(w,true);damage(w,40)
        assertEquals(31,w.p1.power);assertEquals(27,w.p2.power)
    }
    @Test fun helperContactsUseTheSameScalingAndReports() {
        val w=fight(extra="[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200")
        w.step();w.step();assertEquals(932,w.p2.life);damage(w,68)
        assertEquals(w.entities.helpers.single().actor.id,w.contacts.single().attacker)
        assertEquals(63,w.p1.power)
    }
    @Test fun helperVictimsUseTheirOwnDefinitionAndIndependentLife() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p2,9,0,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        helper.receiveHit(HitDefinition(damage=90),true,attacker=w.p1)
        assertEquals(932,helper.life);assertEquals(1000,w.p2.life);assertEquals(68.0,helper.getHitVar("damage"))
    }
    @Test fun borrowedAttackerBanksCannotReplaceActualBaseStats() {
        val w=fight(defenderAttack=800)
        w.p1.enterAuthoredState(200,w.p2,w.issues);w.step()
        assertSame(w.p2,w.p1.stateOwner);assertEquals(932,w.p2.life);damage(w,68)
    }
    @Test fun borrowedVictimBanksCannotReplaceItsOwnDefence() {
        val w=fight();w.p2.enterAuthoredState(700,w.p1,w.issues);strike(w)
        assertEquals(932,w.p2.life);damage(w,68);assertSame(w.p2,w.p2.stateOwner)
    }
    @Test fun unknownManualAttackersUseNeutralAttackAgainstTheActualDefence() {
        val w=fight();w.p2.receiveHit(HitDefinition(damage=90),true)
        assertEquals(955,w.p2.life);assertEquals(45.0,w.p2.getHitVar("damage"))
    }
    @Test fun projectileHitsAndGuardsUseCreatorBaseStatsAndVictimDefence() {
        for(guarded in listOf(false,true)) {
            val w=fight(extra=shot(""));w.step();w.step(b=InputFrame(if(guarded)Directions.R else 0))
            val expected=if(guarded)15 else 68;damage(w,expected);assertEquals(1000-expected,w.p2.life)
            assertTrue(w.entities.projectiles.isEmpty())
        }
    }
    @Test fun multiHitProjectilesDoNotCompoundTheScalingIntoTheirDefinition() {
        val w=fight(extra=shot("projhits=3"));w.step();val projectile=w.entities.projectiles.single()
        repeat(3){w.step();damage(w,68)}
        assertEquals(796,w.p2.life);assertEquals(90,projectile.hit.damage)
        assertEquals(189,w.p1.power);assertEquals(162,w.p2.power);assertTrue(w.entities.projectiles.isEmpty())
    }
    @Test fun projectileCreatorBorrowingAnotherBankCannotChangeItsBaseAttack() {
        val w=fight(extra=shot(""),defenderAttack=800);w.step()
        w.p1.enterAuthoredState(700,w.p2,w.issues);w.step()
        assertEquals(932,w.p2.life);damage(w,68)
    }
    @Test fun overrideReactionsRetainScaledIncomingData() {
        val w=fight();val c=MugenCnsParser.parse("[Statedef 0]\n[State 0, override]\ntype=HitOverride\ntrigger1=1\n"+
            "attr=SCA,AA\nstateno=700\ntime=-1").getValue(0).controllers.single()
        w.p2.hitOverrides.execute(w.p2,c,w.issues);strike(w)
        assertEquals(700,w.p2.stateNo);assertEquals(932,w.p2.life);damage(w,68)
    }
    @Test fun rejectedContactsDoNotConsumeTheScaledAttackWindow() {
        val w=fight(params="hitflag=M+");strike(w)
        assertEquals(1000,w.p2.life);assertTrue(w.contacts.isEmpty());assertEquals(0.0,w.p2.getHitVar("damage"))
        assertTrue(w.p1.canHit(w.p2.id));w.p2.changeState(700);w.step();damage(w,68)
    }
    @Test fun tradesKeepBothDamageReportsConsistentAcrossReactionChanges() {
        val w=fight(defenderAttack=200);w.p1.changeState(200);w.p2.changeState(200);w.step()
        assertEquals(listOf(68,180),w.contacts.map { it.damage })
        assertEquals(820,w.p1.life);assertEquals(932,w.p2.life)
        assertEquals(180.0,w.p1.getHitVar("damage"));assertEquals(68.0,w.p2.getHitVar("damage"))
    }
    @Test fun healthControllersKeepTheirDefenceOnlyAndAbsoluteContracts() {
        val w=fight(200,200,extra="[State 0, target health]\ntype=TargetLifeAdd\ntrigger1=1\nvalue=-60\n"+
            "[State 0, self health]\ntype=LifeAdd\ntrigger1=1\nvalue=-60")
        w.p2.receiveHit(HitDefinition(id=71),true,attacker=w.p1);w.p1.tick(w.issues)
        assertEquals(970,w.p2.life);assertEquals(940,w.p1.life)
    }
    @Test fun localCoordinatesAndPresentationCadenceCannotRescaleDamage() {
        for(width in listOf(320,640,1008)) {
            val w=fight(width=width);strike(w);damage(w,68)
            val before=w.checksum();repeat(10){CorePresentationPlanner.snapshot(w,12)}
            assertEquals(before,w.checksum());assertEquals(932,w.p2.life);damage(w,68)
        }
    }
}
