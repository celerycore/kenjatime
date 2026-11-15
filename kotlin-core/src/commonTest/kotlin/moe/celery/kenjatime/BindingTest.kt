package moe.celery.kenjatime

import kotlin.test.*

/** Synthetic authored attachment scenarios; not native per-tick captures. */
class BindingTest {
    private val air="""
        [Begin Action 0]
        Clsn2Default: 1
        Clsn2[0]=-10,-50,10,0
        0,0,0,0,-1
        [Begin Action 200]
        Clsn1Default: 1
        Clsn1[0]=0,-50,40,0
        200,0,0,0,-1
    """.trimIndent()
    private val neutral="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=1"
    private fun definition(extra: String="")=FighterDefinition.fromScript("binding",air,neutral+"\n"+extra)
    private fun fight(extra: String=""): DeterministicFight {
        val d=definition(extra)
        return DeterministicFight(FightingCharacter(d,1),FightingCharacter(d,2))
    }
    private fun state(type: String, parameters: String="", number: Int=200)="""
        [Statedef $number]
        type=S
        movetype=I
        physics=N
        anim=0
        [State $number, bind]
        type=$type
        trigger1=Time=0
        $parameters
    """.trimIndent()
    private fun helper(fight: DeterministicFight, owner: FightingCharacter=fight.p1,
                       state: Int=0, x: Int=0, y: Int=0, time: Int=0): FightingCharacter {
        fight.entities.add(listOf(EntityRequest.Helper(owner,77,state,x,y,1,false,time)),fight.issues)
        return fight.entities.helpers.last().actor
    }
    private fun capture(owner: FightingCharacter, target: FightingCharacter, id: Int=7) {
        target.receiveHit(HitDefinition(hitTime=600),true)
        owner.captureTarget(target,id)
    }

    @Test fun finiteTargetBindTracksFinalAnchorPositionThenResumesStoredVelocity() {
        val w=fight(state("TargetBind","id=7\ntime=2\npos=20,-15"))
        val a=w.p1;val b=w.p2
        capture(a,b)
        a.changeState(200);a.velX=Fixed.ONE
        b.velX=8*Fixed.ONE;b.velY=4*Fixed.ONE
        w.step()
        assertEquals(21*Fixed.ONE,b.posX)
        assertEquals(-15*Fixed.ONE,b.posY)
        assertEquals(1,b.binding?.ticksLeft)
        assertSame(a,b.binding?.anchor)
        w.step()
        assertEquals(22*Fixed.ONE,b.posX)
        assertNull(b.binding)
        assertEquals(8*Fixed.ONE,b.velX)
        w.step()
        assertEquals(30*Fixed.ONE,b.posX)
        assertEquals(-11*Fixed.ONE,b.posY)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun defaultDurationBindsForOneTickAndIdSelectsOnlyCapturedVictims() {
        val w=fight(state("TargetBind","id=7\npos=12,-3"))
        val other=helper(w,owner=w.p2)
        capture(w.p1,w.p2,7);capture(w.p1,other,8)
        other.posX=99*Fixed.ONE
        w.p1.changeState(200)
        w.step()
        assertEquals(12*Fixed.ONE,w.p2.posX)
        assertNull(w.p2.binding)
        assertEquals(99*Fixed.ONE,other.posX)
        assertNull(other.binding)
    }

    @Test fun targetBindWithoutIdBindsAllLiveTargetsAndKeepsTheirFacing() {
        val w=fight(state("TargetBind","time=-1\npos=9,0"))
        val h=helper(w,owner=w.p2)
        val stale=helper(w,owner=w.p2)
        capture(w.p1,w.p2,7);capture(w.p1,h,8);capture(w.p1,stale,9)
        stale.destroyed=true
        w.p1.changeState(200)
        w.p1.facingRight=false
        w.p2.facingRight=true
        w.step()
        assertEquals(-9*Fixed.ONE,w.p2.posX)
        assertEquals(-9*Fixed.ONE,h.posX)
        assertTrue(w.p2.facingRight)
        assertEquals(-1,w.p2.binding?.ticksLeft)
        assertNull(stale.binding)
    }

    @Test fun parentAndRootBindingsFollowNestedAnchorsInAnyCollectionOrder() {
        val extra=state("BindToParent","time=-1\npos=12,-8\nfacing=1")+"\n"+
            state("BindToRoot","time=3\npos=5,-3\nfacing=-1",201)
        val w=fight(extra)
        val parent=helper(w,state=200)
        val child=helper(w,owner=parent,state=200)
        w.entities.helpers.reverse()
        w.p1.posX=40*Fixed.ONE;w.p1.posY=-10*Fixed.ONE;w.p1.velX=Fixed.ONE
        w.p1.facingRight=false
        w.step()
        assertEquals(29*Fixed.ONE,parent.posX)
        assertEquals(17*Fixed.ONE,child.posX)
        assertEquals(-26*Fixed.ONE,child.posY)
        assertFalse(child.facingRight)
        child.changeState(201)
        w.step()
        assertSame(w.p1,child.binding?.anchor)
        assertEquals(37*Fixed.ONE,child.posX)
        assertEquals(-13*Fixed.ONE,child.posY)
        assertTrue(child.facingRight)
        assertEquals(2,child.binding?.ticksLeft,"Each binding clock advances once despite recursive resolution")
        val plan=CorePresentationPlanner.snapshot(w,0)
        assertEquals(2,Regex("\"side\":0,\"kind\":\"helper\"").findAll(plan).count(),plan)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun bindToTargetUsesHitIdHeadMidAndNestedExpressionArguments() {
        val points="[Size]\nhead.pos=5,-70\nmid.pos=-2,-40\n"
        val w=fight(points+state("BindToTarget",
            "id=7\ntime=-1\npos=ifelse(var(0),12,3),max(-8,-3),Head")+"\n"+
            state("BindToTarget","id=7\ntime=-1\npos=0,0,\"Mid\"",201))
        val h=helper(w,state=200)
        h.vars[0]=1
        capture(h,w.p2)
        w.p2.posX=50*Fixed.ONE;w.p2.posY=-10*Fixed.ONE;w.p2.facingRight=false
        w.step()
        assertEquals(33*Fixed.ONE,h.posX)
        assertEquals(-83*Fixed.ONE,h.posY)
        assertSame(w.p2,h.binding?.anchor)
        h.changeState(201)
        w.step()
        assertEquals(52*Fixed.ONE,h.posX)
        assertEquals(-50*Fixed.ONE,h.posY)
        assertEquals(5*Fixed.ONE,w.p2.definition.headX)
        assertEquals(-40*Fixed.ONE,w.p2.definition.midY)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun zeroDurationReleasesWithoutFollowingAndDoesNotBecomeIndefinite() {
        for(type in listOf("BindToParent","BindToRoot","BindToTarget")) {
            val w=fight(state(type,"time=-1\nid=7\npos=10,0")+"\n"+
                state(type,"time=0\nid=7",201))
            val h=helper(w,state=200)
            capture(h,w.p2)
            w.step()
            assertNotNull(h.binding,type)
            val before=h.posX
            h.velX=2*Fixed.ONE
            h.changeState(201)
            w.p1.velX=30*Fixed.ONE;w.p2.velX=30*Fixed.ONE
            w.step()
            assertNull(h.binding,type)
            assertEquals(before+2*Fixed.ONE,h.posX,type)
        }
    }

    @Test fun targetBindTimeZeroReleasesOnlyMatchingTarget() {
        val w=fight(state("TargetBind","time=0\nid=7"))
        val h=helper(w,owner=w.p2)
        capture(w.p1,w.p2,7);capture(w.p1,h,8)
        w.p2.bindTo(w.p1,0,0,-1)
        h.bindTo(w.p1,0,0,-1)
        w.p1.changeState(200)
        w.step()
        assertNull(w.p2.binding)
        assertNotNull(h.binding)
    }

    @Test fun helperBirthBindingPreservesAuthoredOffsetInsteadOfSnappingToZero() {
        val w=fight()
        val h=helper(w,x=15*Fixed.ONE,y=-7*Fixed.ONE,time=2)
        w.p1.velX=2*Fixed.ONE
        w.step()
        assertEquals(17*Fixed.ONE,h.posX)
        assertEquals(-7*Fixed.ONE,h.posY)
        w.step()
        assertEquals(19*Fixed.ONE,h.posX)
        assertNull(h.binding)
    }

    @Test fun destroyedParentReleasesOrphanAndClearsReferencesBeforeContactPhase() {
        val w=fight()
        val parent=helper(w)
        val child=helper(w,owner=parent,x=10*Fixed.ONE)
        child.bindTo(parent,10*Fixed.ONE,0,-1)
        child.velX=2*Fixed.ONE
        parent.destroyed=true
        w.step()
        assertNull(child.binding)
        assertEquals(12*Fixed.ONE,child.posX)
        assertTrue(w.entities.helpers.any{it.actor === child})
        assertFalse(w.entities.helpers.any{it.actor === parent})
    }

    @Test fun hitpauseFreezesBindingDurationButFollowerTracksItsMovingAnchor() {
        val w=fight()
        val h=helper(w)
        h.bindTo(w.p1,5*Fixed.ONE,0,2)
        h.hitPauseLeft=2
        w.p1.velX=Fixed.ONE
        repeat(2) { t ->
            w.step()
            assertEquals((6+t)*Fixed.ONE,h.posX)
            assertEquals(2,h.binding?.ticksLeft)
            assertEquals(0L,h.animation?.elapsed)
        }
        w.step()
        assertEquals(1,h.binding?.ticksLeft)
        w.step()
        assertNull(h.binding)
    }

    @Test fun bindingsOverridePushGravityLandingAndScreenClampForTheirDuration() {
        val w=fight()
        w.configureArena(-10,10,push=true,autoFace=true)
        capture(w.p1,w.p2)
        w.p2.bindTo(w.p1,30*Fixed.ONE,-5*Fixed.ONE,-1)
        w.p2.velY=4*Fixed.ONE
        w.step()
        assertEquals(0,w.p1.posX,"Bound victims must not push the anchor away")
        assertEquals(30*Fixed.ONE,w.p2.posX,"Attachments can extend beyond stage bounds")
        assertEquals(-5*Fixed.ONE,w.p2.posY)
        assertEquals(4*Fixed.ONE,w.p2.velY)
        assertEquals(5000,w.p2.stateNo)
    }

    @Test fun rootAndHelperHitsUseBoundPositionsForCollisionInTheSameTick() {
        val hit="""
            [State 200, attack]
            type=HitDef
            trigger1=Time=0
            damage=20
            [State 200, attack animation]
            type=ChangeAnim
            trigger1=Time=0
            value=200
        """.trimIndent()
        val roots=fight(state("TargetBind","id=7\ntime=-1\npos=30,0")+"\n"+hit)
        capture(roots.p1,roots.p2)
        roots.p2.posX=200*Fixed.ONE
        roots.p1.changeState(200)
        roots.step()
        assertEquals(980,roots.p2.life)
        assertTrue(roots.contacts.any{it.attacker==1 && it.defender==2})
        val helpers=fight(state("BindToParent","time=-1\npos=30,0")+"\n"+hit)
        val h=helper(helpers,state=200)
        helpers.p2.posX=35*Fixed.ONE
        helpers.step()
        assertEquals(980,helpers.p2.life)
        assertTrue(helpers.contacts.any{it.attacker==h.id && it.defender==2})
    }

    @Test fun invalidParametersCannotReplaceExistingBindingsOrMutateSelectedTargets() {
        val invalid=listOf("time=-2", "time=unknown", "id=unknown", "pos=1,unknown", "pos=(1,2",
            "pos=1,2,3", "facing=2", "facing=1")
        for(parameters in invalid) {
            val w=fight(state("TargetBind",parameters))
            capture(w.p1,w.p2)
            w.p2.bindTo(w.p1,7*Fixed.ONE,0,-1)
            val existing=w.p2.binding
            w.p1.changeState(200)
            w.step()
            assertSame(existing,w.p2.binding,parameters)
            assertTrue(w.issues.isNotEmpty(),parameters)
        }
    }

    @Test fun cyclesAndCrossFightAnchorsFailButMixedCoordinateBindingsAreAllowed() {
        val w=fight()
        w.p1.bindTo(w.p2,0,0,-1)
        assertFailsWith<IllegalArgumentException>{w.p2.bindTo(w.p1,0,0,-1)}
        assertNull(w.p2.binding)
        assertFailsWith<IllegalArgumentException>{w.p1.bindTo(w.p1,0,0,-1)}
        assertFailsWith<IllegalArgumentException>{w.p1.bindTo(fight().p2,0,0,-1)}
        val high=FightingCharacter(definition().copy(localCoordWidth=1008,localCoordHeight=756),3)
        high.world=w
        high.bindTo(w.p2,0,0,-1)
        assertSame(w.p2,high.binding?.anchor)
    }

    @Test fun allTargetRequestIsAtomicWhenOneTargetBelongsToAnotherFight() {
        val w=fight(state("TargetBind","time=-1\npos=5,0"))
        val high=FightingCharacter(definition().copy(localCoordWidth=1008,localCoordHeight=756),3)
        high.world=fight()
        capture(w.p1,w.p2);capture(w.p1,high)
        w.p1.changeState(200)
        w.step()
        assertNull(w.p2.binding)
        assertNull(high.binding)
        assertTrue(w.issues.any{it.contains("same fight")})
    }

    @Test fun missingTargetsAndCyclicHelperParentChainsProduceDiagnostics() {
        val missing=fight(state("BindToTarget","id=99\ntime=-1"))
        val h=helper(missing,state=200)
        missing.step()
        assertNull(h.binding)
        assertTrue(missing.issues.any{it.contains("no matching live target")})
        val cycle=fight(state("BindToRoot","time=-1"))
        val a=helper(cycle,state=200);val b=helper(cycle,owner=a)
        a.parent=b
        cycle.step()
        assertNull(a.binding)
        assertTrue(cycle.issues.any{it.contains("Cyclic helper parent chain")})
    }

    @Test fun skippedPresentationAndRepeatedReadsNeverChangeBindingLifetimeOrReplay() {
        fun replay(presentEvery: Int): List<String> {
            val w=fight(state("BindToParent","time=40\npos=8,-4"))
            val h=helper(w,state=200)
            w.p1.velX=Fixed.ONE
            return (0 until 120).map { tick ->
                w.step()
                if(tick%presentEvery==0)repeat(3){CorePresentationPlanner.snapshot(w,12)}
                "${w.checksum()}:${h.posX}:${h.posY}:${h.binding?.ticksLeft}:${h.timeInState}"
            }
        }
        assertEquals(replay(1),replay(5))
    }
}
