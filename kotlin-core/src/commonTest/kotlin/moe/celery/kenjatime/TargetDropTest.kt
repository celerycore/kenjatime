package moe.celery.kenjatime

import kotlin.test.*

/** Capture lifetime contracts, not native random-selection/throw phase captures. */
class TargetDropTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nanim=0\n[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private fun control(params: String,extra: String="")="[State 0, drop]\ntype=TargetDrop\ntrigger1=1\n$params\n$extra"
    private fun fight(params: String="",extra: String=""): DeterministicFight {
        val a=FighterDefinition.fromScript("captor","[Begin Action 0]\n0,0,0,0,-1","$idle\n${control(params,extra)}")
        val b=FighterDefinition.fromScript("victim","[Begin Action 0]\n0,0,0,0,-1",idle)
        return DeterministicFight(FightingCharacter(a,1),FightingCharacter(b,2)).also {
            it.p2.receiveHit(HitDefinition(id=71),true,attacker=it.p1)
        }
    }
    private fun helper(w: DeterministicFight,id: Int=71): FightingCharacter {
        w.entities.add(listOf(EntityRequest.Helper(w.p2,9,5000,0,0,1,false,0)),w.issues)
        return w.entities.helpers.last().actor.also { w.p1.captureTarget(it,id) }
    }
    @Test fun defaultDropsAllCapturedTargetsWithoutChangingVictims() {
        val w=fight();helper(w,72);w.p2.velX=3*Fixed.ONE
        w.p1.tick(w.issues)
        assertTrue(w.p1.targets().isEmpty());assertEquals(5000,w.p2.stateNo)
        assertEquals(1000,w.p2.life);assertEquals(3*Fixed.ONE,w.p2.velX)
    }
    @Test fun explicitMinusOneDropsAllEvenWithKeepOneDisabled() {
        val w=fight("excludeid=-1\nkeepone=0");helper(w);w.p1.tick(w.issues)
        assertTrue(w.p1.targets().isEmpty())
    }
    @Test fun keepOneZeroRetainsEveryMatchingIdAndDropsOthers() {
        val w=fight("excludeid=71\nkeepone=0");val same=helper(w);val other=helper(w,72)
        w.p1.tick(w.issues)
        assertEquals(listOf(w.p2,same),w.p1.targets());assertFalse(other in w.p1.targets())
        assertEquals(2.0,CoreExpression.number("NumTarget(71)",w.p1,w.issues))
    }
    @Test fun defaultKeepOnePicksExactlyOneMatchingLiveActor() {
        val w=fight("excludeid=71");val candidates=listOf(w.p2,helper(w),helper(w));helper(w,72)
        w.p1.tick(w.issues);assertEquals(1,w.p1.targets().size)
        assertTrue(w.p1.targets().single() in candidates);assertEquals(1,w.p1.targets(71).size)
    }
    @Test fun nonzeroKeepFlagsSelectOneAndMissingExcludeMatchesDropAll() {
        for(flag in listOf("1","2","-1")) {
            val w=fight("excludeid=71\nkeepone=$flag");helper(w);w.p1.tick(w.issues)
            assertEquals(1,w.p1.targets().size)
        }
        val w=fight("keepone=0");w.p1.tick(w.issues);assertTrue(w.p1.targets().isEmpty())
    }
    @Test fun noMatchingExcludeDropsAllAndEmptyListsAreHarmless() {
        val w=fight("excludeid=999");w.p1.tick(w.issues);w.p1.tick(w.issues)
        assertTrue(w.p1.targets().isEmpty());assertTrue(w.issues.isEmpty())
    }
    @Test fun nestedExpressionsUseTheExecutingActorsVariables() {
        val w=fight("excludeid=70+var(0)\nkeepone=ifelse(var(1),0,1)");helper(w)
        w.p1.vars[0]=1;w.p1.vars[1]=1;w.p1.tick(w.issues)
        assertEquals(2,w.p1.targets().size);assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
    @Test fun invalidArgumentsPreserveEveryCapture() {
        for(params in listOf("excludeid=unknown","excludeid=2147483648","keepone=1/0","id=71")) {
            val w=fight(params);helper(w);val before=w.p1.targets()
            w.p1.tick(w.issues);assertEquals(before,w.p1.targets(),params)
            assertTrue(w.issues.any { it.startsWith("Invalid TargetDrop:") },params)
        }
    }
    @Test fun deadDestroyedAndRecoveredTargetsCannotBeRetained() {
        for(mode in 0..2) {
            val w=fight("excludeid=71\nkeepone=0");helper(w,72)
            when(mode){0->w.p2.life=0;1->w.p2.destroyed=true;else->w.p2.changeState(0)}
            w.p1.tick(w.issues);assertTrue(w.p1.targets().isEmpty())
        }
    }
    @Test fun droppingStopsLaterTargetControllersInTheSamePhase() {
        val w=fight(extra="[State 0, launch]\ntype=TargetVelSet\ntrigger1=1\nx=5")
        w.p1.tick(w.issues);assertEquals(0,w.p2.velX);assertTrue(w.p1.targets().isEmpty())
    }
    @Test fun captureCanBeAcquiredAgainAfterAnExplicitDrop() {
        val w=fight();w.p1.tick(w.issues);assertTrue(w.p1.targets().isEmpty())
        w.p2.receiveHit(HitDefinition(id=72),true,attacker=w.p1)
        assertEquals(listOf(w.p2),w.p1.targets(72));assertTrue(w.p1.targets(71).isEmpty())
    }
    @Test fun droppingDoesNotCancelAnIndependentBindingLifetime() {
        val w=fight();w.p2.bindTo(w.p1,10*Fixed.ONE,0,2)
        w.p1.tick(w.issues);assertTrue(w.p1.targets().isEmpty());assertNotNull(w.p2.binding)
        CoreBindings.resolve(w.p1,w.p2,emptyList());assertEquals(10*Fixed.ONE,w.p2.posX)
        CoreBindings.resolve(w.p1,w.p2,emptyList());assertNull(w.p2.binding)
    }
    @Test fun anotherCaptorsTargetListIsNotShared() {
        val w=fight();val h=helper(w)
        h.captureTarget(w.p2,71);w.p1.tick(w.issues)
        assertTrue(w.p1.targets().isEmpty());assertEquals(listOf(w.p2),h.targets())
    }
    @Test fun ignoredHitpauseControlsWhetherDropExecutes() {
        for(ignore in listOf(0,1)) {
            val w=fight("ignorehitpause=$ignore");w.p1.hitPauseLeft=2;w.p1.tick(w.issues)
            assertEquals(if(ignore==1)0 else 1,w.p1.targets().size)
        }
    }
    @Test fun seededSelectionIsReproducibleAndPresentationCannotChooseAgain() {
        fun run(render: Boolean): List<Int> {
            val w=fight("excludeid=71")
            return (0 until 12).map {
                helper(w);helper(w);w.p1.tick(w.issues)
                val chosen=w.p1.targets().single().id
                if(render)repeat(4){CorePresentationPlanner.snapshot(w,12);assertEquals(chosen,w.p1.targets().single().id)}
                chosen
            }
        }
        assertEquals(run(false),run(true))
    }
}
