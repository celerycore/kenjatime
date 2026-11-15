package moe.celery.kenjatime

import kotlin.test.*

/** Synthetic effects contracts; no proprietary artwork or native trace claims. */
class ExplodTest {
    private val air="""
        [Begin Action 0]
        Clsn2Default: 1
        Clsn2[0]=-10,-50,10,0
        0,0,0,0,-1
        [Begin Action 100]
        Clsn1Default: 1
        Clsn1[0]=-20,-50,20,0
        10,0,2,-3,1
        10,1,0,0,2
        [Begin Action 200]
        20,0,0,0,-1
    """.trimIndent()
    private val neutral="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=1"
    private fun fight(extra: String="", def: String=""): DeterministicFight {
        val d=FighterDefinition.fromScript("effects",air,neutral+"\n"+extra,defText=def)
        val rival=FighterDefinition.fromScript("rival",air,neutral,defText=def)
        return DeterministicFight(FightingCharacter(d,1),FightingCharacter(rival,2))
    }
    private fun execute(w: DeterministicFight, type: String="Explod", parameters: String="anim=200\nid=7\nremovetime=-1",
                        owner: FightingCharacter=w.p1) {
        val c=MugenCnsParser.parse("[State 0, effect]\ntype=$type\ntrigger1=1\n$parameters").getValue(0).controllers.single()
        w.effects.execute(owner,c,owner)
    }
    private fun only(w: DeterministicFight)=w.effects.all.single()

    @Test fun creationIsVisibleToNumExplodLaterInTheSameControllerPhase() {
        val w=fight("""
            [State 0, create]
            type=Explod
            trigger1=Time=0
            anim=200
            id=7
            [State 0, query]
            type=VarSet
            trigger1=Time=0
            v=0
            value=NumExplod(7)
        """.trimIndent())
        w.step()
        assertEquals(1,w.p1.vars[0])
        assertEquals(1,w.effects.count(w.p1))
        assertEquals(0L,only(w).age)
        assertEquals(0L,only(w).animation.elapsed)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun defaultRemovalKeepsTheFirstFrameThenRetiresAtFirstAnimationEnd() {
        val w=fight()
        execute(w,parameters="anim=100\nid=7")
        w.step()
        assertEquals(0,only(w).animation.index)
        assertEquals(0L,only(w).age)
        w.step()
        assertEquals(1,only(w).animation.index)
        w.step()
        assertEquals(1,only(w).animation.index)
        w.step()
        assertTrue(w.effects.all.isEmpty())
    }

    @Test fun positiveAndZeroRemovalTimesAndIndefiniteFiniteAnimationsAreDistinct() {
        val finite=fight()
        execute(finite,parameters="anim=100\nremovetime=2")
        finite.step();assertEquals(1,finite.effects.all.size)
        finite.step();assertEquals(1,finite.effects.all.size)
        finite.step();assertEquals(0,finite.effects.all.size)
        val zero=fight()
        execute(zero,parameters="anim=200\nremovetime=0")
        assertEquals(1,zero.effects.all.size)
        zero.step();assertTrue(zero.effects.all.isEmpty())
        val forever=fight()
        execute(forever,parameters="anim=100\nremovetime=-1")
        repeat(10){forever.step()}
        assertEquals(1,forever.effects.all.size)
        assertEquals(9L,only(forever).age)
    }

    @Test fun unboundVelocityAndAccelerationUseCapturedFacingWithoutFollowingTurns() {
        val w=fight()
        w.p1.posX=10*Fixed.ONE;w.p1.facingRight=false
        execute(w,parameters="anim=200\npos=5,-8\nbindtime=0\nvelocity=2,-3\naccel=1,1\nremovetime=-1")
        w.step()
        assertEquals(5*Fixed.ONE,only(w).x)
        assertEquals(-8*Fixed.ONE,only(w).y)
        w.p1.posX=100*Fixed.ONE;w.p1.facingRight=true
        w.step()
        assertEquals(3*Fixed.ONE,only(w).x)
        assertEquals(-11*Fixed.ONE,only(w).y)
        assertEquals(3*Fixed.ONE,only(w).velocityX)
        assertEquals(-2*Fixed.ONE,only(w).velocityY)
        assertFalse(only(w).facingRight)
        w.step()
        assertEquals(0,only(w).x)
        assertEquals(-13*Fixed.ONE,only(w).y)
    }

    @Test fun timedBindingUsesFinalActorPositionsThenReleasesIntoMotion() {
        val w=fight()
        w.p1.velX=Fixed.ONE
        execute(w,parameters="anim=200\npos=10,0\nbindtime=2\nvel=2,0\nremovetime=-1")
        w.step()
        assertEquals(11*Fixed.ONE,only(w).x)
        assertEquals(1,only(w).bindLeft)
        w.step()
        assertEquals(12*Fixed.ONE,only(w).x)
        assertEquals(0,only(w).bindLeft)
        w.step()
        assertEquals(14*Fixed.ONE,only(w).x)
    }

    @Test fun p2BindingUsesOpponentAxesButRetainsCreatorsArtAndRenderScale() {
        val w=fight()
        w.p2.posX=50*Fixed.ONE;w.p2.posY=-10*Fixed.ONE;w.p2.facingRight=false
        execute(w,parameters="anim=100\npostype=p2\npos=5,-6\nbindtime=-1\nfacing=1\nvfacing=-1\nscale=.5,2\nremovetime=-1")
        w.step()
        assertEquals(45*Fixed.ONE,only(w).x)
        assertEquals(-16*Fixed.ONE,only(w).y)
        val json=CorePresentationPlanner.snapshot(w,0)
        assertTrue(json.contains("\"side\":0,\"kind\":\"explod\""),json)
        assertTrue(json.contains("\"spriteScaleX\":0.5"),json)
        assertTrue(json.contains("\"spriteScaleY\":2.0"),json)
        assertTrue(json.contains("\"flipY\":-1"),json)
        assertTrue(json.contains("\"group\":10,\"number\":0"),json)
    }

    @Test fun defVersionSelectsLegacyP1VersusModernNoneDefaultPosition() {
        for((version,expected) in listOf("1.0" to 60,"1.1" to 10)) {
            val w=fight(def="[Info]\nmugenversion=$version")
            w.p1.posX=50*Fixed.ONE
            execute(w,parameters="anim=200\npos=10,0\nremovetime=-1")
            w.step()
            assertEquals(expected*Fixed.ONE,only(w).x,version)
        }
    }

    @Test fun modifyPreservesAgeAndUnchangedAnimationClockAndValidatesAllMatches() {
        val w=fight()
        repeat(2){execute(w,parameters="anim=100\nid=7\nremovetime=-1")}
        w.step();w.step()
        val clocks=w.effects.all.map{it.animation}
        execute(w,"ModifyExplod","id=7\nscale=2,1\npos=min(4,8),ifelse(1,-9,0)")
        for((index,e) in w.effects.all.withIndex()) {
            assertSame(clocks[index],e.animation)
            assertEquals(1L,e.age)
            assertEquals(2.0,e.config.scaleX)
            assertEquals(4*Fixed.ONE,e.x)
            assertEquals(-9*Fixed.ONE,e.y)
        }
        val old=w.effects.all.map{it.config}
        execute(w,"ModifyExplod","id=7\nanim=999\nscale=3,3")
        assertEquals(old,w.effects.all.map{it.config})
        assertTrue(w.issues.any{it.contains("animation missing")})
    }

    @Test fun changingAnimationDoesNotRestartTheOverallRemovalDeadline() {
        val w=fight()
        execute(w,parameters="anim=100\nid=7\nremovetime=3")
        w.step();w.step()
        execute(w,"ModifyExplod","id=7\nanim=200")
        assertEquals(1L,only(w).age)
        assertEquals(200,only(w).animation.action.number)
        assertEquals(0L,only(w).animation.elapsed)
        w.step();assertEquals(1,w.effects.all.size)
        w.step();assertTrue(w.effects.all.isEmpty())
    }

    @Test fun modifiedAnimationKeepsItsOneTickFirstFrameVisibleWithoutResettingAge() {
        val w=fight()
        execute(w)
        w.step();w.step()
        execute(w,"ModifyExplod","id=7\nanim=100")
        w.step()
        assertEquals(2L,only(w).age)
        assertEquals(0,only(w).animation.index)
        assertEquals(0L,only(w).animation.elapsed)
        w.step()
        assertEquals(3L,only(w).age)
        assertEquals(1,only(w).animation.index)
    }

    @Test fun explodBindTimeSelectsIdsAndSupportsReleaseAndValueAlias() {
        val w=fight()
        execute(w,parameters="anim=200\nid=7\nbindtime=-1\nremovetime=-1")
        execute(w,parameters="anim=200\nid=8\nbindtime=-1\nremovetime=-1")
        w.step()
        execute(w,"ExplodBindTime","id=7\ntime=0")
        assertEquals(listOf(0,-1),w.effects.all.map{it.bindLeft})
        w.p1.posX=10*Fixed.ONE
        w.step()
        assertEquals(0,w.effects.all[0].x)
        assertEquals(10*Fixed.ONE,w.effects.all[1].x)
        execute(w,"ExplodBindTime","id=7\nvalue=-1")
        w.step()
        assertEquals(10*Fixed.ONE,w.effects.all[0].x)
        execute(w,"ExplodBindTime","id=7\ntime=-2")
        assertEquals(-1,w.effects.all[0].bindLeft)
        assertTrue(w.issues.any{it.contains("duration")})
    }

    @Test fun countsAndRemovalsAreOwnerScopedAndMinusOneCountIsAnExactId() {
        val w=fight()
        execute(w);execute(w,parameters="anim=200\nremovetime=-1")
        execute(w,owner=w.p2)
        assertEquals(2.0,CoreExpression.number("NumExplod",w.p1,w.issues))
        assertEquals(1.0,CoreExpression.number("NumExplod(7)",w.p1,w.issues))
        assertEquals(1.0,CoreExpression.number("NumExplod(-1)",w.p1,w.issues))
        assertFalse(CoreExpression.test("NumExplod(7,8)",w.p1,w.issues))
        execute(w,"RemoveExplod","id=7")
        assertEquals(1,w.effects.count(w.p1))
        assertEquals(1,w.effects.count(w.p2))
        execute(w,"RemoveExplod","")
        assertEquals(0,w.effects.count(w.p1))
        assertEquals(1,w.effects.count(w.p2))
    }

    @Test fun removeOnGetHitRespondsToContactsIncludingGuardAndNotJustMoveType() {
        for(guarded in listOf(false,true)) {
            val w=fight()
            execute(w,parameters="anim=200\nid=7\nremoveongethit=1\nremovetime=-1")
            execute(w,parameters="anim=200\nid=8\nremovetime=-1")
            execute(w,owner=w.p2)
            w.p1.changeState(5000)
            assertEquals(2,w.effects.count(w.p1))
            w.p1.receiveHit(HitDefinition(),true,guarded)
            assertEquals(0,w.effects.count(w.p1,7))
            assertEquals(1,w.effects.count(w.p1,8))
            assertEquals(1,w.effects.count(w.p2))
        }
    }

    @Test fun hitpauseFreezesOnlyEffectsThatOptIntoItWhileBindingsStillFollow() {
        val w=fight()
        execute(w,parameters="anim=200\nid=7\nbindtime=-1\nignorehitpause=0\nremovetime=-1")
        execute(w,parameters="anim=200\nid=8\nbindtime=-1\nremovetime=-1")
        w.step()
        w.p1.hitPauseLeft=2
        w.p1.posX=20*Fixed.ONE
        repeat(2){w.step()}
        val frozen=w.effects.all.first{it.id==7}
        val active=w.effects.all.first{it.id==8}
        assertEquals(0L,frozen.age)
        assertEquals(2L,active.age)
        assertEquals(20*Fixed.ONE,frozen.x)
        assertEquals(0L,frozen.animation.elapsed)
        assertEquals(2L,active.animation.elapsed)
        w.step()
        assertEquals(1L,frozen.age)
    }

    @Test fun helperEffectsCanOutliveCreatorAndDestroySelfCanRemoveThemExplicitly() {
        for(remove in listOf(0,1)) {
            val w=fight("""
                [Statedef 300]
                anim=0
                [State 300, effect]
                type=Explod
                trigger1=Time=0
                anim=200
                bindtime=-1
                velocity=2,0
                removetime=-1
                [State 300, retire]
                type=DestroySelf
                trigger1=Time=1
                removeexplods=$remove
            """.trimIndent())
            w.entities.add(listOf(EntityRequest.Helper(w.p1,3,300,20*Fixed.ONE,0,1,false,0)),w.issues)
            val h=w.entities.helpers.single().actor
            w.step();assertEquals(1,w.effects.count(h))
            w.step();assertTrue(w.entities.helpers.isEmpty())
            assertEquals(if(remove==0)1 else 0,w.effects.count(h))
            if(remove==0) {
                assertEquals(22*Fixed.ONE,only(w).x)
                assertEquals(0,only(w).bindLeft)
                assertTrue(CorePresentationPlanner.snapshot(w,0).contains("\"side\":0,\"kind\":\"explod\""))
            }
        }
    }

    @Test fun resourceLimitRejectsAdditionalEffectsWithoutReplacingExistingOnes() {
        val w=fight()
        w.effects.maximum=2
        repeat(6){execute(w)}
        assertEquals(2,w.effects.all.size)
        assertEquals(listOf(1L,2L),w.effects.all.map{it.sequence})
        assertTrue(w.issues.any{it.contains("resource limit")})
    }

    @Test fun missingArtworkAndUnsupportedParamsFailButHighResolutionOffsetsConvert() {
        val bad=listOf("anim=999","anim=F72","anim=200\npostype=front","anim=200\nspace=screen",
            "anim=200\ntrans=add","anim=200\nbindtime=-2","anim=200\nremovetime=-3",
            "anim=200\nscale=-1,1","anim=200\nfacing=0","anim=200\npos=1,2,3",
            "anim=200\npos=max(1,2),unknown","anim=200\nvelocity=1,2\nvel=3,4")
        for(parameters in bad) {
            val w=fight()
            execute(w,parameters=parameters)
            assertTrue(w.effects.all.isEmpty(),parameters)
            assertTrue(w.issues.isNotEmpty(),parameters)
        }
        val high=fight(def="[Info]\nlocalcoord=1008,756")
        execute(high,parameters="anim=200\npos=1008,756\nremovetime=-1")
        high.step()
        assertEquals(320*Fixed.ONE,only(high).x)
        assertEquals(240*Fixed.ONE,only(high).y)
        assertTrue(high.issues.isEmpty(),high.issues.joinToString())
    }

    @Test fun priorityAndOnTopOrderingAreStableAndDoNotReorderSimulationStorage() {
        val w=fight()
        execute(w,parameters="anim=200\nid=1\nsprpriority=2")
        execute(w,parameters="anim=200\nid=2\nsprpriority=-2")
        execute(w,parameters="anim=200\nid=3\nontop=1\nsprpriority=-100")
        execute(w,parameters="anim=200\nid=4\nsprpriority=2147483647")
        w.step()
        val plan=CorePresentationPlanner.snapshot(w,0)
        assertTrue(plan.indexOf("\"effectId\":2")<plan.indexOf("\"kind\":\"fighter\""),plan)
        assertTrue(plan.indexOf("\"effectId\":1")<plan.indexOf("\"effectId\":4"),plan)
        assertTrue(plan.indexOf("\"effectId\":4")<plan.indexOf("\"effectId\":3"),plan)
        assertEquals(listOf(1,2,3,4),w.effects.all.map{it.id})
    }

    @Test fun zeroScaleStaysZeroAndEffectsNeverContributeCollisionBoxes() {
        val w=fight("[State 0, armed but without a player attack box]\ntype=HitDef\ntrigger1=Time=0\ndamage=200")
        execute(w,parameters="anim=100\nid=7\nscale=0,0\nremovetime=-1")
        repeat(8){w.step();assertTrue(w.contacts.isEmpty())}
        assertEquals(1000,w.p2.life)
        val plan=CorePresentationPlanner.snapshot(w,0)
        assertTrue(plan.contains("\"spriteScaleX\":0.0"),plan)
        assertTrue(plan.contains("\"spriteScaleY\":0.0"),plan)
    }

    @Test fun presentationSkippingAndRepeatedQueriesDoNotChangeEffectReplay() {
        fun replay(presentEvery: Int): List<String> {
            val w=fight("""
                [State 0, replenish]
                type=Explod
                trigger1=NumExplod(7)=0
                anim=100
                id=7
                velocity=1,-2
                accel=0,.5
                removetime=12
            """.trimIndent())
            return (0 until 600).map { tick ->
                w.step()
                if(tick%presentEvery==0)repeat(3){CorePresentationPlanner.snapshot(w,12)}
                w.checksum()+w.effects.all.joinToString { "${it.sequence}:${it.age}:${it.x}:${it.y}:${it.animation.index}" }
            }
        }
        assertEquals(replay(1),replay(5))
    }
}
