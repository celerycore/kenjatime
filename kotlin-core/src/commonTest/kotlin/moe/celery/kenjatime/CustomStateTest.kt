package moe.celery.kenjatime

import kotlin.test.*

/** Original synthetic scripts. These are JVM/Wasm contracts, not native captures. */
class CustomStateTest {
    private val air = """
        [Begin Action 0]
        Clsn2Default: 1
        Clsn2[0] = -20,-60,20,0
        0,0,0,0,-1
        [Begin Action 200]
        Clsn1Default: 1
        Clsn1[0] = 0,-60,50,0
        200,0,0,0,-1
        [Begin Action 9100]
        Clsn2Default: 1
        Clsn2[0] = -10,-30,10,0
        5000,0,0,0,3
        5000,1,10,-5,5
    """.trimIndent()
    private val neutral = """
        [Statedef 0]
        type=S
        movetype=I
        anim=0
        ctrl=1
    """.trimIndent()
    private val borrowed = """
        [Statedef 910]
        type=S
        movetype=H
        physics=N
        [State 910, use state owner's AIR on the victim's SFF]
        type=ChangeAnim2
        trigger1=Time=0
        value=9100
        elem=2
        [State 910, write victim variable]
        type=VarSet
        trigger1=Time=0
        v=42
        value=73
        [State 910, continue borrowed state bank]
        type=ChangeState
        trigger1=Time=1
        value=910+1
        [Statedef 911]
        type=S
        movetype=H
        physics=N
        [State 911, restore own bank]
        type=SelfState
        trigger1=Time=1
        value=0
        ctrl=1
    """.trimIndent()
    private fun actor(id: Int, source: String, actions: String = air) =
        FightingCharacter(FighterDefinition.fromScript("fixture-$id", actions, source), id)

    private fun thrower(extraHit: String = "", afterHit: String = ""): FightingCharacter =
        actor(1, neutral + "\n" + """
            [Statedef 200]
            type=S
            movetype=A
            anim=200
            ctrl=0
            [State 200, capture]
            type=HitDef
            trigger1=Time=0
            attr=S, NT
            damage=30
            id=71
            ground.hittime=60
            $extraHit
            $afterHit
        """.trimIndent() + "\n" + borrowed)

    private fun victim(): FightingCharacter = actor(2, neutral + "\n" + """
        [Statedef 910]
        type=S
        movetype=H
        [State 910, conflicting victim program must never execute]
        type=VarSet
        trigger1=1
        v=42
        value=999
    """.trimIndent(), "[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-20,-60,20,0\n0,0,0,0,-1")

    @Test fun actualHitCapturesByIdThenTargetStateRunsBorrowedCnsAndAir() {
        val a = thrower(afterHit = """
            [State 200, move captured target]
            type=TargetState
            trigger1=NumTarget(71)>0 && NumTarget=1
            persistent=0
            id=71
            value=910
        """.trimIndent())
        val b = victim()
        val fight = DeterministicFight(a,b)
        b.posX=20*Fixed.ONE
        a.changeState(200)
        fight.step() // Contact phase captures the victim.
        assertEquals(listOf(b), a.targets(71))
        assertTrue(a.targets(72).isEmpty())
        assertEquals(970,b.life)
        fight.step() // TargetState, then the victim evaluates borrowed CNS.
        assertSame(a,b.stateOwner)
        assertSame(a,b.animationOwner)
        assertEquals(910,b.stateNo)
        assertEquals(73,b.vars[42])
        assertEquals(0,a.vars[42])
        assertEquals(9100,b.animation?.action?.number)
        assertEquals(1,b.animation?.index)
        assertEquals(1.0,CoreExpression.number("InCustomState",b,fight.issues))
        // AIR owner controls geometry; sprite resource side remains the victim.
        val json=CorePresentationPlanner.snapshot(fight,0)
        assertTrue(json.contains("\"side\":1,\"kind\":\"fighter\""),json)
        assertTrue(json.contains("\"group\":5000,\"number\":1"),json)
        fight.step()
        assertEquals(911,b.stateNo)
        assertSame(a,b.stateOwner)
        assertSame(a,b.animationOwner,"StateDef without anim preserves borrowed AIR")
        fight.step()
        fight.step()
        assertEquals(0,b.stateNo)
        assertSame(b,b.stateOwner)
        assertSame(b,b.animationOwner)
        assertEquals(0,b.animation?.action?.number)
        assertTrue(b.control)
        assertEquals(73,b.vars[42])
        assertTrue(a.targets().isEmpty(),"Recovered targets must be retired")
        assertTrue(fight.issues.isEmpty(),fight.issues.joinToString())
    }

    @Test fun hitDefP2StateBorrowsAttackerByDefaultAndExplicitZeroUsesVictim() {
        for (borrow in listOf(true,false)) {
            val a=thrower("p2stateno=910\np2getp1state=${if(borrow)1 else 0}")
            val b=victim()
            val fight=DeterministicFight(a,b)
            b.posX=20*Fixed.ONE
            a.changeState(200)
            fight.step()
            assertEquals(910,b.stateNo)
            assertSame(if(borrow)a else b,b.stateOwner)
            fight.step()
            assertEquals(if(borrow)73 else 999,b.vars[42])
            assertTrue(fight.issues.isEmpty(),fight.issues.joinToString())
        }
        val a=thrower("p2stateno=910")
        val b=victim()
        val fight=DeterministicFight(a,b)
        a.changeState(200)
        fight.step()
        assertSame(a,b.stateOwner,"Omitted p2getp1state defaults to borrowing")
    }

    @Test fun guardDoesNotCaptureOrApplyCustomStateAndFlagAloneDoesNotBorrow() {
        val a=thrower("p2stateno=910\nguardflag=H")
        val b=victim()
        val fight=DeterministicFight(a,b)
        b.facingRight=false
        b.posX=20*Fixed.ONE
        a.changeState(200)
        fight.step(b=InputFrame(Directions.R))
        assertTrue(fight.contacts.single().guarded)
        assertEquals(150,b.stateNo)
        assertSame(b,b.stateOwner)
        assertTrue(a.targets().isEmpty())
        val c=thrower("p2getp1state=1")
        val d=victim()
        val other=DeterministicFight(c,d)
        c.changeState(200)
        other.step()
        assertEquals(5000,d.stateNo)
        assertSame(d,d.stateOwner)
    }

    @Test fun targetIdFiltersLiveHelpersAndIgnoresUndocumentedCtrl() {
        val a=actor(1,neutral+"\n"+"""
            [State 0, transfer]
            type=TargetState
            trigger1=Time=0
            id=71
            value=910
            ctrl=0
        """.trimIndent()+"\n"+borrowed)
        val b=victim()
        val fight=DeterministicFight(a,b)
        val helper=actor(3,neutral)
        helper.parent=b;helper.world=fight
        val hit=HitDefinition()
        b.receiveHit(hit,true)
        helper.receiveHit(hit,true)
        b.control=true
        a.captureTarget(b,71)
        a.captureTarget(helper,72)
        a.tick(fight.issues)
        assertSame(a,b.stateOwner)
        assertTrue(b.control,"TargetState ctrl is ignored; absent StateDef ctrl preserves control")
        assertSame(helper,helper.stateOwner)
        assertTrue(fight.issues.any { it.contains("TargetState ctrl") })
        helper.destroyed=true
        assertTrue(a.targets(72).isEmpty())
    }

    @Test fun changeAnimUsesOwnAirAndFailedActionNeverErasesBorrowedAnimation() {
        val a=thrower()
        val b=victim()
        val errors=linkedSetOf<String>()
        assertTrue(b.enterAuthoredState(910,a,errors))
        b.tick(errors)
        assertSame(a,b.animationOwner)
        assertFalse(b.changeAnimation(99999))
        assertFalse(b.changeAnimation(9100,a,3))
        assertSame(a,b.animationOwner)
        assertEquals(1,b.animation?.index)
        assertTrue(b.changeAnimation(0))
        assertSame(b,b.animationOwner)
        assertSame(a,b.stateOwner)
        assertTrue(errors.isEmpty(),errors.joinToString())
    }

    @Test fun customStateSkipsOwnMinusThreeAndMinusOneButRunsOwnMinusTwo() {
        val globals=(-3..-1).joinToString("\n") { n -> """
            [Statedef $n]
            [State $n, marker]
            type=VarAdd
            trigger1=1
            v=${-n}
            value=1
        """.trimIndent() }
        val a=thrower()
        val b=actor(2,neutral+"\n"+globals)
        val errors=linkedSetOf<String>()
        assertTrue(b.enterAuthoredState(910,a,errors))
        b.tick(errors)
        assertEquals(0,b.vars[1])
        assertEquals(1,b.vars[2])
        assertEquals(0,b.vars[3])
        assertEquals(73,b.vars[42])
    }

    @Test fun missingOrMixedLocalcoordTransfersDoNotMutateVictim() {
        val a=thrower()
        val b=victim()
        val errors=linkedSetOf<String>()
        assertFalse(b.enterAuthoredState(99999,a,errors))
        assertEquals(0,b.stateNo)
        assertSame(b,b.stateOwner)
        val hi=FightingCharacter(a.definition.copy(localCoordWidth=1008,localCoordHeight=756),3)
        assertFalse(b.enterAuthoredState(910,hi,errors))
        assertEquals(0,b.stateNo)
        assertSame(b,b.stateOwner)
        assertTrue(errors.any { it.contains("Missing custom/transition state") })
        assertTrue(errors.any { it.contains("mixed-localcoord custom state") })
    }

    @Test fun helperHitOwnsItsVictimStateAndTargetsStayOnHelper() {
        val a=thrower("p2stateno=910\nid=88")
        val b=victim()
        val fight=DeterministicFight(a,b)
        fight.entities.add(listOf(EntityRequest.Helper(a,10,200,0,0,1,false,0)),fight.issues)
        val helper=fight.entities.helpers.single().actor
        fight.step() // The helper's authored HitDef makes actual contact.
        assertTrue(fight.contacts.any { it.attacker == helper.id && it.defender == b.id })
        assertSame(helper,b.stateOwner)
        assertEquals(listOf(b),helper.targets(88))
        assertTrue(a.targets().isEmpty())
        assertSame(a,helper.parent)
    }

    @Test fun replayRemainsIdenticalWithSkippedPresentation() {
        fun replay(presentEvery: Int): List<String> {
            val a=thrower("p2stateno=910")
            val b=victim()
            val fight=DeterministicFight(a,b)
            a.changeState(200)
            return (0 until 120).map { tick ->
                fight.step()
                if(tick%presentEvery==0)CorePresentationPlanner.snapshot(fight,120)
                "${fight.checksum()}:${b.stateOwner.id}:${b.animationOwner.id}:${b.vars[42]}"
            }
        }
        assertEquals(replay(1),replay(5))
    }

    @Test fun landingUsesBorrowedPhysicsAndReturnsToVictimsOwnLandingState() {
        val a=actor(1,neutral+"\n[Statedef 910]\ntype=A\nmovetype=H\nphysics=A")
        val b=actor(2,neutral+"\n[Statedef 52]\ntype=S\nmovetype=I\nanim=0\nctrl=1")
        val fight=DeterministicFight(a,b)
        fight.configureArena(-250,250,push=false)
        assertTrue(b.enterAuthoredState(910,a,fight.issues))
        b.posY=Fixed.ONE
        b.velY=Fixed.ONE
        fight.step()
        assertEquals(52,b.stateNo)
        assertSame(b,b.stateOwner)
        assertTrue(b.control)
        assertEquals(0,b.posY)
    }

    @Test fun changeAnim2GeometryUsesAirOwnersScaleAndOrdinaryHitRestoresOwnBank() {
        val base=thrower()
        val a=FightingCharacter(base.definition.copy(xScale=Fixed.ONE/2),1)
        val b=victim()
        val fight=DeterministicFight(a,b)
        assertTrue(b.enterAuthoredState(910,a,fight.issues))
        b.tick(fight.issues)
        assertEquals(10*Fixed.ONE,b.hurtBoxes().single().let { it.x2-it.x1 })
        b.receiveHit(HitDefinition(damage=5),true)
        assertSame(b,b.stateOwner,"Ordinary hits must not look up state 5000 in the thrower")
        assertEquals(5000,b.stateNo)
        assertEquals(995,b.life)
        // State entry without anim preserves current AIR until an authored
        // hit-state ChangeAnim chooses one; no invented common-state art.
        assertSame(a,b.animationOwner)
    }

    @Test fun selfStatePreservesExistingNeutralFallbackForCharactersWithoutCommonStateZero() {
        val a=thrower()
        // Real KFM's own CNS omits StateDef 0; common-state integration is
        // incomplete, so its pre-existing neutral fallback must remain usable.
        val b=actor(2,"[Statedef 200]\ntype=S\nanim=200\nctrl=0")
        val fight=DeterministicFight(a,b)
        assertTrue(b.enterAuthoredState(911,a,fight.issues))
        b.control=false
        repeat(2) { b.tick(fight.issues) }
        assertEquals(0,b.stateNo)
        assertSame(b,b.stateOwner)
        assertSame(b,b.animationOwner)
        assertEquals(0,b.animation?.action?.number)
        assertTrue(b.control)
        assertTrue(fight.issues.isEmpty(),fight.issues.joinToString())
    }
}
