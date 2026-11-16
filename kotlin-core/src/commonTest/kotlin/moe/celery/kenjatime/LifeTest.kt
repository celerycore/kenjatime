package moe.celery.kenjatime

import kotlin.test.*

/** Scripted health/capture contracts, not native damage or KO phase certification. */
class LifeTest {
    private val air="[Begin Action 0]\n0,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private fun controller(type: String,params: String)="[State 0, health]\ntype=$type\ntrigger1=1\n$params"
    private fun definition(script: String="",defence: Int=100,width: Int=320)=FighterDefinition.fromScript("health",air,
        "[Data]\nlife=1000\ndefence=$defence\n$idle\n$script\n$hurt",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(script: String="",defence: Int=100,width: Int=320)=DeterministicFight(
        FightingCharacter(definition(script,width=width),1),FightingCharacter(definition(defence=defence),2)).also {
        it.p2.receiveHit(HitDefinition(id=71),true,attacker=it.p1)
    }
    private fun helper(w: DeterministicFight,owner: FightingCharacter): FightingCharacter {
        val before=w.entities.helpers.size
        w.entities.add(listOf(EntityRequest.Helper(owner,9,5000,0,0,1,false,0)),w.issues)
        return w.entities.helpers[before].actor
    }

    @Test fun readsBoundedBaseDefenceAndPreservesTheDefault() {
        for((raw,expected) in listOf("200" to 200,"0" to 1,"-1" to 1,"100001" to 100000,
            "unknown" to 100,"2147483648" to 100,"1.5" to 100)) {
            val script="[Data]\ndefence=$raw\n$idle"
            assertEquals(expected,MugenCnsParser.constants(script).defence,raw)
            assertEquals(expected,FighterDefinition.fromScript("health",air,script).defence,raw)
        }
        assertEquals(100,FighterDefinition.fromScript("default",air,idle).defence)
        assertFailsWith<IllegalArgumentException> { FighterDefinition("invalid",defence=0) }
    }
    @Test fun lifeAddHonorsNonlethalFlagsAndDoesNotWrap() {
        for(kill in 0..1) {
            val w=fight(controller("LifeAdd","value=-2147483648\nkill=$kill"));w.p1.life=50
            w.p1.tick(w.issues);assertEquals(if(kill==0)1 else 0,w.p1.life)
        }
        val heal=fight(controller("LifeAdd","value=2147483647"));heal.p1.life=50
        heal.p1.tick(heal.issues);assertEquals(1000,heal.p1.life)
    }
    @Test fun lifeAddUsesOwnBaseDefenceUnlessAbsoluteIsEnabled() {
        for(absolute in 0..1)for(value in listOf(-100,100)) {
            val p=FightingCharacter(definition(controller("LifeAdd","value=$value\nabsolute=$absolute"),200),1)
            p.life=500;p.tick(linkedSetOf())
            assertEquals(500+if(absolute==1)value else value/2,p.life)
        }
    }
    @Test fun targetDamageDefaultsToLethalWithoutChangingReactionState() {
        val w=fight(controller("TargetLifeAdd","value=-2000"));w.p1.tick(w.issues)
        assertEquals(0,w.p2.life);assertEquals(5000,w.p2.stateNo);assertSame(w.p2,w.p2.stateOwner)
        assertTrue(w.p1.targets().isEmpty());assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
    @Test fun nonlethalTargetDamageRetainsTheCaptureAndDoesNotRepeatAHit() {
        val w=fight(controller("TargetLifeAdd","value=-2000\nkill=0"));val data=w.p2.getHitData
        w.p1.tick(w.issues);assertEquals(1,w.p2.life);assertEquals(listOf(w.p2),w.p1.targets(71))
        assertSame(data,w.p2.getHitData);assertEquals(0,w.p1.power);assertEquals(0,w.p2.power)
        assertFalse(w.p1.moveContact);assertTrue(w.contacts.isEmpty());assertEquals(0,w.p2.hitPauseLeft)
        assertEquals(5000,w.p2.stateNo)
    }
    @Test fun eachSelectedTargetUsesItsOwnBaseDefence() {
        val w=fight(controller("TargetLifeAdd","value=-100"),defence=200)
        val h=helper(w,w.p1);w.p1.captureTarget(h,72);w.p1.tick(w.issues)
        assertEquals(950,w.p2.life);assertEquals(900,h.life);assertEquals(1000,w.p1.life)
    }
    @Test fun absoluteTargetChangesBypassDefenceForDamageAndHealing() {
        for(value in listOf(-100,100)) {
            val w=fight(controller("TargetLifeAdd","value=$value\nabsolute=1"),defence=200)
            w.p2.life=500;w.p1.tick(w.issues);assertEquals(500+value,w.p2.life)
        }
    }
    @Test fun idFilteringUsesCapturedHitIdsAndMinusOneSelectsAll() {
        for(id in listOf("","id=-1","id=72")) {
            val w=fight(controller("TargetLifeAdd","value=-100\n$id"));val h=helper(w,w.p1)
            w.p1.captureTarget(h,72);w.p1.tick(w.issues)
            assertEquals(if(id=="id=72")1000 else 900,w.p2.life);assertEquals(900,h.life)
        }
    }
    @Test fun nestedExpressionsUseTheExecutingActorWithoutCoordinateConversion() {
        val w=fight(controller("TargetLifeAdd","id=70+var(0)\nvalue=-ifelse(var(0),max(40,60),10)\nkill=var(1)"),width=640)
        w.p1.vars[0]=1;w.p2.life=50;w.p1.tick(w.issues);assertEquals(1,w.p2.life)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
    @Test fun missingDeadDestroyedRecoveredAndDroppedTargetsCannotChangeLife() {
        for(mode in 0..4) {
            val script=if(mode==4)controller("TargetDrop","")+"\n" else ""
            val w=fight(script+controller("TargetLifeAdd","value=100\n${if(mode==0)"id=999" else ""}"))
            w.p2.life=500
            when(mode){1->w.p2.life=0;2->w.p2.destroyed=true;3->w.p2.changeState(0)}
            val before=w.p2.life;w.p1.tick(w.issues);assertEquals(before,w.p2.life)
        }
    }
    @Test fun killingATargetRemovesItFromLaterTargetControllersImmediately() {
        for(kill in 0..1) {
            val w=fight(controller("TargetLifeAdd","value=-2000\nkill=$kill")+"\n"+
                controller("TargetPowerAdd","value=100"))
            w.p1.tick(w.issues);assertEquals(if(kill==0)100 else 0,w.p2.power)
        }
    }
    @Test fun borrowedBanksDoNotReplaceTheVictimsOwnDefenceOrLifeLimit() {
        val w=fight("[Statedef 800]\ntype=S\nphysics=N\n"+
            controller("TargetLifeAdd","value=-100").replace("[State 0,","[State 800,"),defence=200)
        w.p2.enterAuthoredState(800,w.p1,w.issues)
        w.p1.receiveHit(HitDefinition(id=71),true,attacker=w.p2);w.p2.tick(w.issues)
        assertEquals(900,w.p1.life);assertEquals(1000,w.p2.life);assertSame(w.p1,w.p2.stateOwner)
    }
    @Test fun helperLifeIsIndependentOfItsRootAndHelpersOwnTheirCaptures() {
        val w=fight(controller("TargetLifeAdd","value=-100"));val victim=helper(w,w.p2)
        w.p1.captureTarget(victim,72);w.p1.tick(w.issues)
        assertEquals(900,victim.life);assertEquals(900,w.p2.life);assertEquals(1000,w.p1.life)
        val captor=helper(w,w.p1);captor.changeState(0);captor.captureTarget(w.p2,71);captor.tick(w.issues)
        assertEquals(800,w.p2.life);assertEquals(1000,w.p1.life);assertEquals(900,victim.life)
    }
    @Test fun invalidRequestsPreserveAllLives() {
        for(type in listOf("LifeAdd","LifeSet","TargetLifeAdd"))for(params in listOf("","value=unknown",
            "value=1/0","value=2147483648","value=-2147483649","value=2,3","value=-100\nunsupported=1")) {
            val w=fight(controller(type,params));w.p1.life=500;w.p2.life=600;w.p1.tick(w.issues)
            assertEquals(500,w.p1.life,"$type/$params");assertEquals(600,w.p2.life)
            assertTrue(w.issues.any { it.startsWith("Invalid $type:") },"$type/$params")
        }
    }
    @Test fun invalidTargetIdsAndFlagsCannotPartiallyDamageTargets() {
        for(params in listOf("id=unknown","id=2147483648","kill=unknown","absolute=1/0")) {
            val w=fight(controller("TargetLifeAdd","value=-100\n$params"));val h=helper(w,w.p1)
            w.p1.captureTarget(h,72);w.p1.tick(w.issues)
            assertEquals(1000,w.p2.life);assertEquals(1000,h.life)
            assertTrue(w.issues.any { it.startsWith("Invalid TargetLifeAdd:") })
        }
    }
    @Test fun lifeSetClampsWithoutDefenceScalingAndRejectsExtraFlags() {
        for((value,expected) in listOf("2147483647" to 1000,"-1" to 0,"123.9" to 123)) {
            val p=FightingCharacter(definition(controller("LifeSet","value=$value"),200),1)
            p.life=500;p.tick(linkedSetOf());assertEquals(expected,p.life)
        }
        val w=fight(controller("LifeSet","value=1\nkill=0"));w.p1.tick(w.issues)
        assertEquals(1000,w.p1.life);assertTrue(w.issues.any { it.startsWith("Invalid LifeSet:") })
    }
    @Test fun roundingUsesSymmetricHalvesAndRetainsTinyDamage() {
        for((value,defence,expected) in listOf(Triple(-3,200,498),Triple(3,200,502),
            Triple(-1,100000,499),Triple(1,100000,500),Triple(0,100000,500))) {
            val w=fight(controller("TargetLifeAdd","value=$value"),defence=defence)
            w.p2.life=500;w.p1.tick(w.issues);assertEquals(expected,w.p2.life,"$value/$defence")
        }
    }
    @Test fun extremeScaledValuesSaturateLifeWithoutIntegerWrap() {
        for((value,expected) in listOf(Int.MAX_VALUE to 1000,Int.MIN_VALUE to 0)) {
            val w=fight(controller("TargetLifeAdd","value=$value"),defence=1)
            w.p2.life=500;w.p1.tick(w.issues);assertEquals(expected,w.p2.life)
        }
    }
    @Test fun aNonlethalFloorCannotReviveButExplicitHealingCan() {
        val damage=fight(controller("LifeAdd","value=-100\nkill=0"));damage.p1.life=0
        damage.p1.tick(damage.issues);assertEquals(0,damage.p1.life)
        val zero=fight(controller("LifeAdd","value=0\nkill=0"));zero.p1.life=0
        zero.p1.tick(zero.issues);assertEquals(0,zero.p1.life)
        val heal=fight(controller("LifeAdd","value=100"));heal.p1.life=0
        heal.p1.tick(heal.issues);assertEquals(100,heal.p1.life)
    }
    @Test fun hitpauseAndPersistenceControlWhenScriptedDamageRuns() {
        for(ignore in 0..1) {
            val w=fight(controller("TargetLifeAdd","value=-100\nignorehitpause=$ignore\npersistent=0"))
            w.p1.hitPauseLeft=2;repeat(4){w.p1.tick(w.issues)};assertEquals(900,w.p2.life)
            val paused=fight(controller("TargetLifeAdd","value=-100\nignorehitpause=$ignore"))
            paused.p1.hitPauseLeft=2;paused.p1.tick(paused.issues)
            assertEquals(if(ignore==1)900 else 1000,paused.p2.life)
        }
    }
    @Test fun nonlethalThrowDamageKeepsItsBorrowedVictimAndAppliesBinding() {
        val script="[Statedef 211]\ntype=S\nmovetype=A\nphysics=N\nanim=0\n"+
            "[State 211, bind]\ntype=TargetBind\ntrigger1=Time<6\ntime=1\npos=20,0\n"+
            "[State 211, damage]\ntype=TargetLifeAdd\ntrigger1=Time=3\nvalue=-60\nkill=0\n"+
            "[Statedef 700]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
        val w=fight(script);w.p2.life=50;w.p2.enterAuthoredState(700,w.p1,w.issues);w.p1.changeState(211)
        w.p1.velX=Fixed.ONE
        repeat(4){w.step()};assertEquals(1,w.p2.life);assertSame(w.p1,w.p2.stateOwner)
        assertEquals(700,w.p2.stateNo);assertEquals(listOf(w.p2),w.p1.targets())
        assertEquals(w.p1.posX+20*Fixed.ONE,w.p2.posX);assertNull(w.p2.binding)
        val checksum=w.checksum();repeat(8){CorePresentationPlanner.snapshot(w,12)}
        assertEquals(checksum,w.checksum());assertEquals(1,w.p2.life);assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
    @Test fun roundFlowObservesLethalTargetLifeChangesWithoutANewContact() {
        for(kill in 0..1) {
            val w=fight(controller("TargetLifeAdd","value=-100\nkill=$kill\ntrigger1=var(0)=1"))
            w.enableRoundFlow(CoreRoundRules(introFrames=0,roundCueFrames=0,fightCueFrames=0));repeat(3){w.step()}
            w.p2.life=50;w.p1.vars[0]=1;w.step()
            assertEquals(if(kill==0)CoreRoundPhase.ACTIVE else CoreRoundPhase.KO,w.roundFlow!!.phase)
            assertTrue(w.contacts.isEmpty())
        }
    }
}
