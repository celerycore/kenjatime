package moe.celery.kenjatime

import kotlin.test.*

/** Meter/target ownership contracts, not native team/round-phase certification. */
class PowerTest {
    private val air="[Begin Action 0]\n0,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private val hurt="[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private fun controller(type: String,params: String)="[State 0, meter]\ntype=$type\ntrigger1=1\n$params"
    private fun definition(cap: Int=3000,script: String="",width: Int=320)=FighterDefinition.fromScript(
        "meter",air,"[Data]\npower=$cap\n$idle\n$script\n$hurt",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(script: String="",cap: Int=5000,victimCap: Int=1000,width: Int=320): DeterministicFight =
        DeterministicFight(FightingCharacter(definition(cap,script,width),1),FightingCharacter(definition(victimCap),2)).also {
            it.p2.receiveHit(HitDefinition(id=71),true,attacker=it.p1)
        }
    private fun helper(w: DeterministicFight,owner: FightingCharacter,state: Int=5000): FightingCharacter {
        val before=w.entities.helpers.size
        w.entities.add(listOf(EntityRequest.Helper(owner,9,state,0,0,1,false,0)),w.issues)
        return w.entities.helpers[before].actor
    }

    @Test fun readsAuthoredMaximumAndKeepsSafeDefaultsForMalformedConstants() {
        for((raw,expected) in listOf("6000" to 6000,"0" to 0,"-1" to 0,"2147483647" to Int.MAX_VALUE,
            "unknown" to 3000,"2147483648" to 3000,"1.5" to 3000)) {
            val cns="[Data]\npower=$raw\n$idle"
            assertEquals(expected,MugenCnsParser.constants(cns).maxPower,raw)
            assertEquals(expected,FighterDefinition.fromScript("meter",air,cns).maxPower,raw)
        }
        assertEquals(3000,FighterDefinition.fromScript("default",air,idle).maxPower)
        assertFailsWith<IllegalArgumentException> { FighterDefinition("invalid",maxPower=-1) }
    }
    @Test fun freshMetersStartEmptyAndPowerMaxUsesEachActorsOwnDefinition() {
        val w=fight();assertEquals(0,w.p1.power);assertEquals(0,w.p2.power)
        assertEquals(5000.0,CoreExpression.number("PowerMax",w.p1,w.issues))
        assertEquals(1000.0,CoreExpression.number("PowerMax",w.p2,w.issues))
        w.p1.power=Int.MAX_VALUE;w.p2.power=-1
        assertEquals(5000,w.p1.power);assertEquals(0,w.p2.power)
    }
    @Test fun powerSetReplacesTheMeterAndClampsToConfiguredBounds() {
        for((value,expected) in listOf("1234" to 1234,"-100" to 0,"2147483647" to 5000,"12.9" to 12)) {
            val w=fight(controller("PowerSet","value=$value"));w.p1.power=234
            w.p1.tick(w.issues);assertEquals(expected,w.p1.power,value);assertTrue(w.issues.isEmpty())
        }
    }
    @Test fun powerAddDoesNotWrapAtIntegerLimits() {
        for(cap in listOf(3000,Int.MAX_VALUE)) {
            val w=fight(controller("PowerAdd","value=2147483647"),cap=cap);w.p1.power=cap
            w.p1.tick(w.issues);assertEquals(cap,w.p1.power)
            val drain=fight(controller("PowerAdd","value=-2147483648"),cap=cap);drain.p1.power=cap
            drain.p1.tick(drain.issues);assertEquals(0,drain.p1.power)
        }
    }
    @Test fun zeroCapacityMetersCannotAccumulatePower() {
        for(type in listOf("PowerAdd","PowerSet")) {
            val w=fight(controller(type,"value=100"),cap=0);w.p1.tick(w.issues);assertEquals(0,w.p1.power)
        }
        val w=fight(controller("TargetPowerAdd","value=100"),victimCap=0)
        w.p1.tick(w.issues);assertEquals(0,w.p2.power)
    }
    @Test fun malformedRequestsPreserveEveryMeter() {
        for(type in listOf("PowerAdd","PowerSet","TargetPowerAdd"))for(params in listOf(
            "","value=unknown","value=1/0","value=2147483648","value=-2147483649","value=2,3",
            "value=100\nunsupported=1")) {
            val w=fight(controller(type,params));w.p1.power=234;w.p2.power=345
            w.p1.tick(w.issues);assertEquals(234,w.p1.power,"$type/$params");assertEquals(345,w.p2.power)
            assertTrue(w.issues.any { it.startsWith("Invalid $type:") },"$type/$params")
        }
    }
    @Test fun targetIdsUseCapturedHitIdsAndClampEachSelectedMeter() {
        val w=fight(controller("TargetPowerAdd","id=72\nvalue=6000"))
        val h=helper(w,w.p1);w.p1.captureTarget(h,72);w.p2.power=100
        w.p1.tick(w.issues);assertEquals(5000,w.p1.power);assertEquals(100,w.p2.power)
    }
    @Test fun omittedAndMinusOneIdAffectAllValidCapturedTargets() {
        for(id in listOf("","id=-1")) {
            val w=fight(controller("TargetPowerAdd","value=1500\n$id"))
            val h=helper(w,w.p1);w.p1.captureTarget(h,72)
            w.p1.tick(w.issues);assertEquals(1500,w.p1.power);assertEquals(1000,w.p2.power)
        }
    }
    @Test fun negativeTargetPowerDoesNotCreditTheExecutingPlayer() {
        val w=fight(controller("TargetPowerAdd","value=-400"));w.p1.power=50;w.p2.power=300
        w.p1.tick(w.issues);assertEquals(50,w.p1.power);assertEquals(0,w.p2.power)
    }
    @Test fun targetExpressionsAreEvaluatedOnceInTheExecutingActorsUnits() {
        val w=fight(controller("TargetPowerAdd","id=70+var(0)\nvalue=ifelse(var(0),PowerMax-Power,9)"),width=640)
        w.p1.vars[0]=1;w.p1.power=4500;w.p1.tick(w.issues)
        assertEquals(4500,w.p1.power);assertEquals(500,w.p2.power)
        val all=fight(controller("TargetPowerAdd","value=Power+100"));all.p1.power=100
        val h=helper(all,all.p1);val nested=helper(all,h)
        all.p1.captureTarget(h,72);all.p1.captureTarget(nested,73);all.p1.tick(all.issues)
        assertEquals(500,all.p1.power);assertEquals(200,all.p2.power)
    }
    @Test fun invalidIdCannotPartiallyUpdateSelectedTargets() {
        for(id in listOf("unknown","2147483648","-2147483649","1/0")) {
            val w=fight(controller("TargetPowerAdd","id=$id\nvalue=100"));w.p2.power=300
            w.p1.tick(w.issues);assertEquals(300,w.p2.power)
            assertTrue(w.issues.any { it.startsWith("Invalid TargetPowerAdd:") })
        }
    }
    @Test fun emptyMissingAndStaleTargetsAreHarmless() {
        for(mode in 0..3) {
            val w=fight(controller("TargetPowerAdd","value=100\n${if(mode==0)"id=999" else ""}"));w.p2.power=300
            when(mode) {1->w.p2.life=0;2->w.p2.destroyed=true;3->w.p2.changeState(0)}
            w.p1.tick(w.issues);assertEquals(300,w.p2.power);assertTrue(w.issues.isEmpty())
        }
    }
    @Test fun droppingTargetsPreventsLaterPowerControllersFromReachingThem() {
        val w=fight(controller("TargetDrop","")+"\n"+controller("TargetPowerAdd","value=100"))
        w.p2.power=300;w.p1.tick(w.issues);assertEquals(300,w.p2.power);assertTrue(w.p1.targets().isEmpty())
    }
    @Test fun borrowedStateBanksDoNotReplaceTheActorsOwnMeterOrMaximum() {
        val w=fight("[Statedef 800]\ntype=S\nphysics=N\n"+
            controller("PowerSet","value=PowerMax-100").replace("[State 0,","[State 800,"))
        w.p1.power=400;w.p2.enterAuthoredState(800,w.p1,w.issues);w.p2.tick(w.issues)
        assertEquals(900,w.p2.power);assertEquals(400,w.p1.power)
        assertEquals(1000.0,CoreExpression.number("PowerMax",w.p2,w.issues))
    }
    @Test fun helpersAndNestedHelpersReadAndChangeTheirRootsMeter() {
        val w=fight(controller("PowerAdd","value=100"));w.p1.power=500
        val h=helper(w,w.p1,0);val nested=helper(w,h,0)
        assertEquals(500,nested.power);assertEquals(5000,nested.maxPower)
        h.tick(w.issues);nested.tick(w.issues)
        assertEquals(700,w.p1.power);assertEquals(700,h.power);assertEquals(700,nested.power)
        nested.power=8000;assertEquals(5000,w.p1.power);assertEquals(0,w.p2.power)
        val set=fight(controller("PowerSet","value=PowerMax-1"));helper(set,set.p1,0).tick(set.issues)
        assertEquals(4999,set.p1.power)
    }
    @Test fun eachCapturedHelperAppliesItsOwnDeltaToTheSharedRootMeter() {
        val w=fight(controller("TargetPowerAdd","value=100"));val a=helper(w,w.p2);val b=helper(w,a)
        w.p1.captureTarget(a,72);w.p1.captureTarget(b,73);w.p1.tick(w.issues)
        assertEquals(300,w.p2.power);assertEquals(300,a.power);assertEquals(300,b.power);assertEquals(0,w.p1.power)
    }
    @Test fun helperCaptorsAffectTheirOwnTargetListAndTheOpponentsMeter() {
        val w=fight(controller("TargetPowerAdd","value=100"));val h=helper(w,w.p1,0)
        h.captureTarget(w.p2,71);h.tick(w.issues)
        assertEquals(100,w.p2.power);assertEquals(0,w.p1.power);assertEquals(listOf(w.p2),h.targets())
    }
    @Test fun hitpauseRequiresAuthoredIgnoreHitpause() {
        for(type in listOf("PowerAdd","PowerSet","TargetPowerAdd"))for(ignore in listOf(false,true)) {
            val w=fight(controller(type,"value=100\nignorehitpause=${if(ignore)1 else 0}"));w.p1.hitPauseLeft=2
            w.p1.tick(w.issues)
            assertEquals(if(ignore)100 else 0,if(type=="TargetPowerAdd")w.p2.power else w.p1.power)
        }
    }
    @Test fun persistenceAndLaterTriggersObserveTheMeterWithinTheSamePhase() {
        val script=controller("PowerAdd","value=100\npersistent=0")+"\n"+
            "[State 0, observe]\ntype=VarSet\ntrigger1=Power=100\nv=0\nvalue=PowerMax"
        val w=fight(script);repeat(3){w.p1.tick(w.issues)}
        assertEquals(100,w.p1.power);assertEquals(5000,w.p1.vars[0])
    }
    @Test fun cyclicTargetOwnershipCannotMutateEarlierValidTargets() {
        val w=fight(controller("TargetPowerAdd","value=100"));val h=helper(w,w.p2);h.parent=h
        w.p1.captureTarget(h,72);w.p2.power=300;w.p1.tick(w.issues)
        assertEquals(300,w.p2.power);assertTrue(w.issues.any { it.contains("Cyclic helper parent chain") })
    }
    @Test fun powerChangesAndPresentationReadsDoNotRepeatDamageOrAlterTargetState() {
        val w=fight(controller("TargetPowerAdd","value=100"));w.p2.power=300
        val state=w.p2.stateNo;val life=w.p2.life;val data=w.p2.getHitData
        w.p1.tick(w.issues);val checksum=w.checksum();repeat(8){CorePresentationPlanner.snapshot(w,12)}
        assertEquals(400,w.p2.power);assertEquals(state,w.p2.stateNo);assertEquals(life,w.p2.life)
        assertSame(data,w.p2.getHitData);assertEquals(checksum,w.checksum());assertFalse(w.p1.moveContact)
        val fresh=fight();assertEquals(0,fresh.p1.power);assertEquals(0,fresh.p2.power)
    }
}
