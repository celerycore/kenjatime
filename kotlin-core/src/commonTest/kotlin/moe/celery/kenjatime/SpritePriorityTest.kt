package moe.celery.kenjatime

import kotlin.test.*

/** Actor-owned render metadata and stable mixed-kind painter order. */
class SpritePriorityTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private fun priority(value: String="0",options: String="")="[State 0, priority]\ntype=SprPriority\ntrigger1=1\nvalue=$value\n$options"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("priority",air,
        "$idle\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="",other: String="")=DeterministicFight(
        FightingCharacter(definition(extra),1),FightingCharacter(definition(other),2))
    private fun actorIndex(plan: String,side: Int)=plan.indexOf("\"side\":$side,\"kind\":\"fighter\"")
    private fun effect(w: DeterministicFight,id: Int,priority: Int,onTop: Boolean=false) {
        val c=MugenCnsParser.parse("[State 0, effect]\ntype=Explod\ntrigger1=1\nanim=0\nid=$id\nremovetime=-1\n"+
            "sprpriority=$priority\nontop=${if(onTop)1 else 0}").getValue(0).controllers.single()
        w.effects.execute(w.p1,c,w.p1)
    }
    @Test fun freshActorsDefaultToZeroAndExposeTheReadOnlyTrigger() {
        val w=fight();assertEquals(0,w.p1.spritePriority)
        assertEquals(0.0,CoreExpression.number("SprPriority",w.p1,w.issues))
    }
    @Test fun controllerAcceptsTheDocumentedIntegerRange() {
        for(value in -5..5) {
            val w=fight(priority(value.toString()));w.step();assertEquals(value,w.p1.spritePriority)
        }
    }
    @Test fun controllerExpressionsReadExecutingActorVariables() {
        val w=fight(priority("ifelse(var(0),max(2,4),-3)"));w.p1.vars[0]=1;w.step()
        assertEquals(4,w.p1.spritePriority);w.p1.vars[0]=0;w.step();assertEquals(-3,w.p1.spritePriority)
    }
    @Test fun omittedStateDefPriorityPreservesThePreviousValueAcrossEntry() {
        val w=fight("sprpriority=3\n[Statedef 200]\ntype=S\nphysics=N\nanim=0")
        assertEquals(3,w.p1.spritePriority);w.p1.changeState(200);assertEquals(3,w.p1.spritePriority)
        w.step();assertEquals(3,w.p1.spritePriority)
    }
    @Test fun stateDefExpressionsEvaluateWithDestinationTimeZeroAndActorVariables() {
        val w=fight("[Statedef 200]\ntype=S\nphysics=N\nanim=0\nsprpriority=ifelse(Time=0,var(0),-5)")
        w.p1.vars[0]=4;w.p1.changeState(200);assertEquals(4,w.p1.spritePriority)
        assertEquals("ifelse(Time=0,var(0),-5)",w.p1.stateProgram!!.spritePriority)
    }
    @Test fun malformedControllersPreserveAnEarlierValidPriority() {
        for(raw in listOf("unknown","1/0","6","-6","1,2")) {
            val w=fight("${priority("2")}\n${priority(raw)}");w.step()
            assertEquals(2,w.p1.spritePriority);assertTrue(w.issues.any{it.startsWith("Invalid SprPriority:")})
        }
        for(params in listOf("x=1","")) {
            val w=fight("${priority("2")}\n[State 0, invalid]\ntype=SprPriority\ntrigger1=1\n$params")
            w.step();assertEquals(2,w.p1.spritePriority);assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun invalidStateDefPriorityPreservesValueButCompletesTheTransition() {
        val w=fight("sprpriority=2\n[Statedef 200]\ntype=S\nphysics=N\nanim=0\nsprpriority=unknown")
        w.p1.changeState(200);assertEquals(200,w.p1.stateNo);assertEquals(2,w.p1.spritePriority)
        assertTrue(w.issues.any{it.startsWith("Invalid StateDef sprpriority:")})
    }
    @Test fun initialStateDefDiagnosticsRemainAvailableAfterWorldAttachment() {
        val w=fight("sprpriority=8");assertEquals(0,w.p1.spritePriority)
        assertTrue(w.issues.any{it.startsWith("Invalid StateDef sprpriority:")})
    }
    @Test fun laterControllersOverrideEarlierPrioritiesWithoutResettingEachTick() {
        val w=fight("${priority("-2")}\n${priority("5")}");repeat(3){w.step();assertEquals(5,w.p1.spritePriority)}
    }
    @Test fun persistentZeroRearmsOnlyWhenTheActorReentersItsState() {
        val w=fight(priority("var(0)","persistent=0"));w.p1.vars[0]=2;w.step()
        w.p1.vars[0]=-3;w.step();assertEquals(2,w.p1.spritePriority)
        w.p1.changeState(0);w.step();assertEquals(-3,w.p1.spritePriority)
    }
    @Test fun hitpausePreservesPriorityAndHonorsIgnorehitpauseExecution() {
        for(ignore in 0..1) {
            val w=fight(priority("3","ignorehitpause=$ignore"));w.p1.spritePriority=2;w.p1.hitPauseLeft=2
            repeat(2){w.step();assertEquals(if(ignore==1)3 else 2,w.p1.spritePriority)}
            w.step();assertEquals(3,w.p1.spritePriority)
        }
    }
    @Test fun painterOrderChangesWhenActorPrioritiesCross() {
        val w=fight(priority("var(0)"),priority("var(0)"));w.p1.vars[0]=-2;w.p2.vars[0]=3;w.step()
        var plan=CorePresentationPlanner.snapshot(w,0);assertTrue(actorIndex(plan,0)<actorIndex(plan,1),plan)
        w.p1.vars[0]=5;w.p2.vars[0]=-5;w.step();plan=CorePresentationPlanner.snapshot(w,0)
        assertTrue(actorIndex(plan,1)<actorIndex(plan,0),plan)
    }
    @Test fun equalActorPrioritiesRetainStableRosterOrder() {
        val w=fight(priority("2"),priority("2"));w.step()
        val plan=CorePresentationPlanner.snapshot(w,0);assertTrue(actorIndex(plan,0)<actorIndex(plan,1),plan)
        assertEquals(plan,CorePresentationPlanner.snapshot(w,0))
    }
    @Test fun effectsInterleaveWithActorsAndOnTopStillRendersLast() {
        val w=fight(priority("-4"),priority("2"));effect(w,7,-2);effect(w,8,Int.MAX_VALUE);effect(w,9,-5,true);w.step()
        val plan=CorePresentationPlanner.snapshot(w,0)
        assertTrue(actorIndex(plan,0)<plan.indexOf("\"effectId\":7"),plan)
        assertTrue(plan.indexOf("\"effectId\":7")<actorIndex(plan,1),plan)
        assertTrue(actorIndex(plan,1)<plan.indexOf("\"effectId\":8"),plan)
        assertTrue(plan.indexOf("\"effectId\":8")<plan.indexOf("\"effectId\":9"),plan)
        assertEquals(listOf(7,8,9),w.effects.all.map{it.id})
    }
    @Test fun helperPriorityBelongsToTheHelperRatherThanItsRoot() {
        val w=fight("${priority("5")}\n[Statedef 200]\ntype=S\nphysics=N\nanim=0\nsprpriority=-3")
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,200,0,0,1,false,0)),w.issues);w.step()
        val helper=w.entities.helpers.single().actor;assertEquals(-3,helper.spritePriority);assertEquals(5,w.p1.spritePriority)
        val plan=CorePresentationPlanner.snapshot(w,0)
        assertTrue(plan.indexOf("\"kind\":\"helper\"")<actorIndex(plan,0),plan)
        assertEquals(helper,w.entities.helpers.single().actor)
    }
    @Test fun borrowedBankEntryReadsTheActorsVariablesAndDoesNotScalePriority() {
        val w=fight();val bank=FightingCharacter(definition("[Statedef 200]\ntype=S\nphysics=N\nanim=0\nsprpriority=var(0)",640),3)
        bank.vars[0]=-5;w.p1.vars[0]=4;w.p1.enterAuthoredState(200,bank,w.issues)
        assertEquals(4,w.p1.spritePriority);assertEquals(0,bank.spritePriority)
        w.p1.changeState(0,w.p1);assertEquals(4,w.p1.spritePriority)
    }
    @Test fun defaultProjectilesUseTheirOwnThreeDrawPriorityRatherThanOwnerPriority() {
        val w=fight("${priority("5")}\n[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=0\nprojhits=0\nprojremovetime=-1")
        w.step();val plan=CorePresentationPlanner.snapshot(w,0)
        assertTrue(plan.indexOf("\"kind\":\"projectile\"")<actorIndex(plan,0),plan)
        assertEquals(1,w.entities.projectiles.size);assertEquals(1,w.entities.projectiles.single().priority)
        assertEquals(3,w.entities.projectiles.single().spritePriority)
    }
    @Test fun projectileSpritePriorityCapturesExpressionsWithoutChangingClashPriority() {
        val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=0\nprojhits=0\nprojsprpriority=var(0)\nprojpriority=4")
        w.p1.vars[0]=-4;w.step();w.p1.vars[0]=5
        val shot=w.entities.projectiles.single();assertEquals(-4,shot.spritePriority);assertEquals(4,shot.priority)
        val plan=CorePresentationPlanner.snapshot(w,0);assertTrue(plan.indexOf("\"kind\":\"projectile\"")<actorIndex(plan,0),plan)
    }
    @Test fun invalidProjectilePriorityCannotQueueAShot() {
        for(raw in listOf("unknown","1/0","1,2","2147483648","-2147483649")) {
            val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=0\nprojsprpriority=$raw")
            w.step();assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.issues.any{it.startsWith("Invalid projectile sprite priority:")})
        }
    }
    @Test fun projectileIntegerBoundsStayBelowOntopEffectsWithoutOverflow() {
        for(value in listOf(Int.MIN_VALUE,Int.MAX_VALUE)) {
            val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=0\nprojhits=0\nprojsprpriority=$value")
            effect(w,9,0,true);w.step();val plan=CorePresentationPlanner.snapshot(w,0)
            assertEquals(value,w.entities.projectiles.single().spritePriority)
            assertTrue(plan.indexOf("\"kind\":\"projectile\"")<plan.indexOf("\"effectId\":9"),plan)
        }
    }
    @Test fun visualPriorityDoesNotChangeHitDamageOrCollisionPriority() {
        fun replay(priority: Int): DeterministicFight {
            val w=fight("[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\nsprpriority=$priority\n"+
                "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=10\npriority=4,Hit")
            w.p1.changeState(200);w.p2.posX=5*256;w.step();return w
        }
        val low=replay(-5);val high=replay(5);assertEquals(low.checksum(),high.checksum())
        assertEquals(990,high.p2.life);assertEquals(4,high.p1.activeHitDef!!.priority)
    }
    @Test fun purePresentationDoesNotMutatePrioritiesOrSimulationOrder() {
        val w=fight(priority("3"),priority("-2"));effect(w,7,0);w.step()
        val before=w.checksum();val effects=w.effects.all.toList();val plan=CorePresentationPlanner.snapshot(w,12)
        repeat(8){assertEquals(plan,CorePresentationPlanner.snapshot(w,12));CoreExpression.number("SprPriority",w.p1,w.issues)}
        assertEquals(before,w.checksum());assertEquals(3,w.p1.spritePriority);assertEquals(effects,w.effects.all)
    }
}
