package moe.celery.kenjatime

import kotlin.test.*

/** Authored timing contracts, not a certification of native pause phases. */
class AnimationTimingTest {
    private fun action(vararg durations: Int, loop: Int? = null) = AirAction(0,
        durations.mapIndexed { i,t -> AirFrame(0,i,0,0,t) },loop)
    private fun actor(action: AirAction = action(2,3,4), script: String = "") =
        FightingCharacter(FighterDefinition("timing",mapOf(action.number to action),
            MugenCnsParser.parse(script)),1)
    private fun value(text: String, actor: FightingCharacter, issues: MutableSet<String> = linkedSetOf()) =
        CoreExpression.number(text,actor,issues)
    private fun test(text: String, actor: FightingCharacter, issues: MutableSet<String> = linkedSetOf()) =
        CoreExpression.test(text,actor,issues)

    @Test fun finiteClockTracksSignedTimeAndDefaultLoopBoundary() {
        val play=AirAnimationPlayer(action(2,3,4))
        val elements=listOf(1,1,2,2,2,3,3,3,3,1,1,2)
        val remaining=listOf(-9,-8,-7,-6,-5,-4,-3,-2,-1,0,-8,-7)
        for(t in elements.indices) {
            assertEquals(elements[t],play.index+1,"element at tick $t")
            assertEquals(remaining[t].toLong(),play.remaining,"AnimTime at tick $t")
            play.advance()
        }
    }

    @Test fun legacyAnimElemIsOnlyTrueAtItsAuthoredTimeNotThroughoutTheSprite() {
        val f=actor()
        val issues=linkedSetOf<String>()
        val start=mutableListOf<Int>()
        val before=mutableListOf<Int>()
        val after=mutableListOf<Int>()
        repeat(9) { t ->
            if(test("AnimElem = 2",f,issues))start.add(t)
            if(test("AnimElem = 3, -1",f,issues))before.add(t)
            if(test("AnimElem = 2, = 1",f,issues))after.add(t)
            assertEquals(t.toDouble()-2,value("AnimElemTime(2)",f,issues))
            assertEquals(t in 2..4,test("AnimElem = 2, >= 0 && AnimElem = 3, < 0",f,issues))
            f.animation!!.advance()
        }
        assertEquals(listOf(2),start)
        assertEquals(listOf(4),before)
        assertEquals(listOf(3),after)
        assertTrue(issues.isEmpty(),issues.joinToString())
    }

    @Test fun comparisonsAndNestedLegacySyntaxUseNormalExpressionPrecedence() {
        val f=actor()
        repeat(3){f.animation!!.advance()}
        val issues=linkedSetOf<String>()
        for(expression in listOf(
            "AnimElem = 2, 1", "AnimElem = +2, +1", "AnimElem = 2, != 0",
            "AnimElem = 2, > 0", "AnimElem = 2, >= 1", "AnimElem = 2, < 2",
            "AnimElem = 2, <= 1", "!(AnimElem = 2)",
            "ifelse((AnimElem = 2, 1), 7, 0) = 7",
            "0 || ((AnimElem = 2, 1) && Time = 0)",
            "AnimElemTime(1+1) = [1,2]"))assertTrue(test(expression,f,issues),expression)
        assertFalse(test("AnimElem = 2, != 1",f,issues))
        assertTrue(issues.isEmpty(),issues.joinToString())
    }

    @Test fun loopSeamReportsZeroRemainingWithoutRefiringFirstElementTrigger() {
        val f=actor(action(2,3))
        assertTrue(test("AnimElem = 1",f))
        repeat(5){f.animation!!.advance()}
        assertEquals(1,f.animation!!.index+1)
        assertTrue(test("AnimTime = 0",f))
        assertFalse(test("AnimElem = 1",f))
        assertEquals(5.0,value("AnimElemTime(1)",f))
        f.animation!!.advance()
        assertFalse(test("AnimTime = 0",f))
        assertEquals(1.0,value("AnimElemTime(1)",f))
        f.animation!!.advance()
        assertTrue(test("AnimElem = 2",f))
    }

    @Test fun loopStartReplaysOnlyItsTailAndQueriesWrapInEitherDirection() {
        val f=actor(action(2,3,4,loop=1))
        val errors=linkedSetOf<String>()
        assertNull(value("AnimElemNo(-1)",f,errors))
        assertTrue(errors.any{it.contains("precedes its start")})
        repeat(3){f.animation!!.advance()}
        for((offset,element) in listOf(0 to 2,2 to 3,6 to 2,-5 to 3))
            assertEquals(element.toDouble(),value("AnimElemNo($offset)",f))
        // Large offsets must wrap arithmetically, without stepping frames.
        assertEquals(2.0,value("AnimElemNo(2147483647)",f))
        assertEquals(3.0,value("AnimElemNo(-2147483648)",f))
        repeat(6){f.animation!!.advance()}
        assertEquals(2,f.animation!!.index+1)
        assertTrue(test("AnimTime = 0",f))
        assertFalse(test("AnimElem = 2",f))
        assertEquals(2.0,value("AnimElemNo(-5)",f))
    }

    @Test fun indefiniteElementHoldsSpriteWhileItsElapsedTimeKeepsAdvancing() {
        val f=actor(action(2,-1,3))
        repeat(102){f.animation!!.advance()}
        assertEquals(2,f.animation!!.index+1)
        assertEquals(100,f.animation!!.tick)
        assertEquals(100.0,value("AnimElemTime(2)",f))
        assertEquals(-1.0,value("AnimTime",f))
        assertEquals(2.0,value("AnimElemNo(1000000)",f))
        assertFalse(f.animation!!.finished)
    }

    @Test fun elementSelectionAndSameActionResetSetNewIndependentTimeOrigins() {
        val shared=action(2,3,4)
        val a=actor(shared)
        val b=actor(shared)
        assertTrue(a.changeAnimation(0,element=3))
        assertEquals(5L,a.animation!!.elapsed)
        assertEquals(0.0,value("AnimElemTime(3)",a))
        assertEquals(-4.0,value("AnimTime",a))
        assertEquals(0L,b.animation!!.elapsed)
        a.animation!!.advance()
        assertEquals(1.0,value("AnimElemTime(3)",a))
        assertTrue(a.changeAnimation(0))
        assertEquals(0L,a.animation!!.elapsed)
        assertEquals(-9.0,value("AnimTime",a))
        a.animation!!.advance()
        a.animation!!.reset()
        assertEquals(0L,a.animation!!.elapsed)
        assertEquals(1,a.animation!!.index+1)
        assertEquals(0L,b.animation!!.elapsed)
    }

    @Test fun explicitJumpBeyondInfiniteElementReportsCurrentSpriteAndDiagnosesUnsupportedOffsets() {
        val f=actor(action(2,-1,3))
        val errors=linkedSetOf<String>()
        assertTrue(f.changeAnimation(0,element=3))
        assertEquals(0.0,value("AnimElemTime(3)",f,errors))
        assertEquals(3.0,value("AnimElemNo(0)",f,errors))
        assertNull(value("AnimElemNo(1)",f,errors))
        assertTrue(errors.any { it.contains("bypassing an infinite element") })
    }

    @Test fun animationExistenceUsesOwnAndBorrowedAirBanksWithoutChangingClocks() {
        val owner=FightingCharacter(FighterDefinition("owner",mapOf(7 to action(3,4).copy(number=7)),
            MugenCnsParser.parse("""
                [Statedef 910]
                type=S
                movetype=H
                [State 910, borrowed action]
                type=ChangeAnim2
                trigger1=Time=0
                value=7
                elem=2
            """.trimIndent())),2)
        val f=actor(action(2,-1))
        val errors=linkedSetOf<String>()
        assertTrue(f.enterAuthoredState(910,owner,errors))
        f.tick(errors)
        assertEquals(7,f.animation!!.action.number)
        assertSame(owner,f.animationOwner)
        assertTrue(test("AnimExist(7) && !SelfAnimExist(7)",f,errors))
        assertTrue(test("!AnimExist(0) && SelfAnimExist(0)",f,errors))
        assertEquals(1.0,value("AnimElemTime(2)",f,errors))
        assertTrue(errors.isEmpty(),errors.joinToString())
    }

    @Test fun malformedOrOutOfRangeQueriesFailClosedEvenUnderNegation() {
        val f=actor()
        val errors=linkedSetOf<String>()
        for(expression in listOf(
            "AnimElem = 0", "AnimElem = 4, != 0", "!(AnimElem = 4)",
            "AnimElem = var(0)", "AnimElem = 2, >=", "AnimElem = 2.5",
            "AnimElemTime(0) != 0", "AnimElemTime(-1)", "AnimElemTime(4)",
            "AnimElemTime()", "AnimElemTime(1,2)", "AnimElemNo()",
            "AnimElemNo(1,2)", "AnimExist()", "SelfAnimExist(0,1)")) {
            assertFalse(test(expression,f,errors),expression)
        }
        val missing=FightingCharacter(FighterDefinition("no AIR"),3)
        assertFalse(test("AnimElemTime(1) != 0",missing,errors))
        assertFalse(test("AnimElemNo(0)",missing,errors))
        assertEquals(0.0,value("AnimTime",missing))
        assertTrue(errors.size>=15,errors.joinToString())
    }

    @Test fun hitpauseFreezesAnimationClockAndTimingTriggeredHitDefFiresOnResume() {
        val f=actor(script="""
            [Statedef 0]
            type=S
            anim=0
            [State 0, scheduled attack]
            type=HitDef
            trigger1=AnimElem = 2
            damage=20
            [State 0, pause observer]
            type=VarSet
            trigger1=1
            ignorehitpause=1
            v=0
            value=AnimElemTime(2)
        """.trimIndent())
        val fight=DeterministicFight(f,FightingCharacter(FighterDefinition("dummy"),2))
        fight.step()
        assertEquals(1L,f.animation!!.elapsed)
        f.hitPauseLeft=3
        repeat(3){fight.step();assertEquals(1L,f.animation!!.elapsed);assertEquals(-1,f.vars[0])}
        assertNull(f.activeHitDef)
        fight.step() // Advance to element 2; controllers see it on the next tick.
        assertNull(f.activeHitDef)
        fight.step()
        assertEquals(20,f.activeHitDef?.damage)
        assertTrue(fight.issues.isEmpty(),fight.issues.joinToString())
    }

    @Test fun signedAnimTimeEnablesEarlyRecoveryAndEndOfActionControllers() {
        val f=actor(script="""
            [Statedef 0]
            anim=0
            ctrl=0
            [State 0, recover a tick early]
            type=CtrlSet
            trigger1=AnimTime = -1
            value=1
            [State 0, exit at end]
            type=ChangeState
            trigger1=AnimTime = 0
            value=10
            [Statedef 10]
            ctrl=1
        """.trimIndent())
        val fight=DeterministicFight(f,FightingCharacter(FighterDefinition("dummy"),2))
        repeat(8){fight.step();assertFalse(f.control)}
        fight.step()
        assertTrue(f.control)
        assertEquals(0,f.stateNo)
        fight.step()
        assertEquals(10,f.stateNo)
        assertTrue(fight.issues.isEmpty(),fight.issues.joinToString())
    }

    @Test fun presentationQueriesAndSkippedDrawsNeverAdvanceAnimationOrControllerTime() {
        fun replay(presentEvery: Int): List<String> {
            val f=actor(script="""
                [Statedef 0]
                anim=0
                [State 0, count element starts]
                type=VarAdd
                trigger1=AnimElem = 2
                v=0
                value=1
            """.trimIndent())
            val fight=DeterministicFight(f,FightingCharacter(FighterDefinition("dummy"),2))
            return (0 until 600).map { tick ->
                fight.step()
                if(tick%presentEvery==0)repeat(3){CorePresentationPlanner.snapshot(fight,12)}
                "${fight.checksum()}:${f.animation!!.elapsed}:${f.animation!!.remaining}:${f.vars[0]}"
            }
        }
        assertEquals(replay(1),replay(5))
    }

    @Test fun emptyAndZeroDurationActionsRemainBoundedAndReportInvalidElements() {
        val empty=AirAnimationPlayer(action())
        repeat(3){empty.advance()}
        assertEquals(0L,empty.remaining)
        assertFailsWith<IllegalArgumentException>{empty.elementAt(0)}
        // Preserve the interpreter's existing one-tick normalization for 0.
        val zero=AirAnimationPlayer(action(0,0))
        zero.advance()
        assertEquals(1,zero.index)
        zero.advance()
        assertEquals(0,zero.index)
        assertEquals(0L,zero.remaining)
    }
}
