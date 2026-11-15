package moe.celery.kenjatime

import kotlin.test.*

/** Successful-hit follow-ups with deterministic trade protection; not native phase captures. */
class HitFollowStateTest {
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=1\nanim=0"
    private val air="""
        [Begin Action 0]
        Clsn2Default:1
        Clsn2[0]=-10,-40,10,0
        0,0,0,0,-1
        [Begin Action 200]
        Clsn1Default:1
        Clsn1[0]=0,-40,40,0
        Clsn2Default:1
        Clsn2[0]=-10,-40,10,0
        200,0,0,0,-1
        [Begin Action 811]
        Clsn2Default:1
        Clsn2[0]=-10,-40,10,0
        811,0,0,0,-1
        [Begin Action 812]
        812,0,0,0,-1
    """.trimIndent()
    private val states="""
        [Statedef 811]
        type=S
        movetype=A
        physics=N
        anim=811
        ctrl=0
        [Statedef 812]
        type=S
        movetype=A
        anim=812
        [Statedef 820]
        type=S
        movetype=H
        physics=N
        anim=0
    """.trimIndent()
    private fun attack(extra: String="",target: Boolean=true)="""
        [Statedef 200]
        type=S
        movetype=A
        physics=N
        anim=200
        [State 200, hit]
        type=HitDef
        trigger1=Time=0
        attr=S,NT
        damage=10,3
        guardflag=HL
        id=7
        p1stateno=811
        ${if(target)"p2stateno=820" else ""}
        $extra
    """.trimIndent()
    private fun definition(extra: String="",hit: String=attack())=
        FighterDefinition.fromScript("follow",air,"$idle\n$hit\n$states\n$extra")
    private fun fight(a: String="",b: String="",hitA: String=attack(),hitB: String=attack()): DeterministicFight {
        return DeterministicFight(FightingCharacter(definition(a,hitA),1),FightingCharacter(definition(b,hitB),2)).also {
            it.p2.posX=20*Fixed.ONE;it.p2.facingRight=false
        }
    }
    private fun armOverride(w: DeterministicFight) {
        val c=MugenCnsParser.parse("[Statedef 0]\n[State 0, route]\ntype=HitOverride\ntrigger1=1\nattr=SCA,AT\nstateno=0\ntime=-1")
            .getValue(0).controllers.single()
        w.p2.hitOverrides.execute(w.p2,c,w.issues)
    }

    @Test fun successfulThrowEntersBothAuthoredBanksAndRetainsCapturedTarget() {
        val w=fight();w.p1.changeState(200);w.step()
        assertEquals(811,w.p1.stateNo);assertEquals("A",w.p1.moveType)
        assertSame(w.p1,w.p1.stateOwner);assertEquals(811,w.p1.animation!!.action.number)
        assertEquals(820,w.p2.stateNo);assertSame(w.p1,w.p2.stateOwner)
        assertEquals("H",w.p2.moveType);assertEquals(990,w.p2.life)
        assertEquals(listOf(w.p2),w.p1.targets(7))
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun p1DestinationDoesNotRequireACustomP2State() {
        val w=fight(hitA=attack(target=false));w.p1.changeState(200);w.step()
        assertEquals(811,w.p1.stateNo);assertEquals(5000,w.p2.stateNo)
        assertSame(w.p2,w.p2.stateOwner)
    }

    @Test fun guardDoesNotFollowP1StateAndRetainsGuardedContactFlag() {
        val w=fight();w.p1.changeState(200);w.step(b=InputFrame(Directions.R))
        assertEquals(200,w.p1.stateNo);assertTrue(w.p1.moveGuarded)
        assertEquals(150,w.p2.stateNo);assertEquals(997,w.p2.life)
        assertTrue(w.contacts.single().guarded);assertTrue(w.p1.targets().isEmpty())
    }

    @Test fun missedAttackDoesNotFollowP1State() {
        val w=fight();w.p2.posX=200*Fixed.ONE;w.p1.changeState(200);w.step()
        assertEquals(200,w.p1.stateNo);assertEquals(1000,w.p2.life)
    }

    @Test fun hitOverrideRejectsTheThrowBeforeEitherParticipantChangesState() {
        val w=fight();armOverride(w);w.p1.changeState(200);w.step()
        assertEquals(200,w.p1.stateNo);assertEquals(0,w.p2.stateNo)
        assertEquals(1000,w.p2.life);assertTrue(w.contacts.isEmpty());assertTrue(w.p1.canHit(w.p2.id))
    }

    @Test fun hitFilterRejectionDoesNotConsumeTheFollowup() {
        val w=fight(b="[State 0, immune]\ntype=NotHitBy\ntrigger1=Time=0\nvalue=SCA")
        w.p1.changeState(200);w.step()
        assertEquals(200,w.p1.stateNo);assertTrue(w.p1.canHit(w.p2.id))
        w.step();assertEquals(811,w.p1.stateNo);assertEquals(990,w.p2.life)
    }

    @Test fun hitpausePreservesNewStateEntryUntilTheNextUnfrozenControllerTick() {
        val w=fight(a="[State 811, observe]\ntype=VarAdd\ntrigger1=Time=0\nv=0\nvalue=1",
            hitA=attack("pausetime=2,3"))
        w.p1.changeState(200);w.step()
        assertEquals(811,w.p1.stateNo);assertEquals(0,w.p1.timeInState);assertEquals(2,w.p1.hitPauseLeft)
        assertEquals(0,w.p1.vars[0])
        repeat(2){w.step();assertEquals(0,w.p1.timeInState);assertEquals(0,w.p1.vars[0])}
        w.step();assertEquals(1,w.p1.vars[0]);assertEquals(1,w.p1.timeInState)
    }

    @Test fun pairedThrowCanBindItsCapturedVictimAndReleaseThroughSelfState() {
        val w=fight(a="""
            [State 811, attach]
            type=TargetBind
            trigger1=Time=0
            id=7
            pos=20,-5
            time=2
            [State 820, release]
            type=SelfState
            trigger1=Time=2
            value=0
        """.trimIndent())
        w.p1.changeState(200);w.step();w.step()
        assertEquals(w.p1.posX+20*Fixed.ONE,w.p2.posX);assertEquals(-5*Fixed.ONE,w.p2.posY)
        assertEquals(1,w.p2.binding!!.ticksLeft)
        w.step();w.step()
        assertSame(w.p2,w.p2.stateOwner);assertEquals(0,w.p2.stateNo)
        assertNull(w.p2.binding);assertTrue(w.p1.targets().isEmpty())
    }

    @Test fun missingDestinationIsDiagnosedWithoutRepeatedDamageOrChangingP1() {
        val w=fight(hitA=attack("p1stateno=999"));w.p1.changeState(200)
        repeat(3){w.step()}
        assertEquals(200,w.p1.stateNo);assertEquals(990,w.p2.life)
        assertTrue(w.issues.any { it.contains("Missing custom/transition state: 999") })
    }

    @Test fun negativeDestinationDisablesFollowupAndZeroCanReturnToIdle() {
        for(destination in listOf(-1,0)) {
            val w=fight(hitA=attack("p1stateno=$destination"));w.p1.changeState(200);w.step()
            assertEquals(if(destination == -1)200 else 0,w.p1.stateNo)
            assertEquals(990,w.p2.life);assertTrue(w.issues.isEmpty(),w.issues.joinToString())
        }
    }

    @Test fun directHitApiAppliesP1StateAfterCapturingP2() {
        val w=fight();w.p1.changeState(200)
        w.p2.receiveHit(HitDefinition(damage=10,id=7,p1State=811,p2State=820,stateOwner=w.p1),true,attacker=w.p1)
        assertEquals(811,w.p1.stateNo);assertEquals(820,w.p2.stateNo)
        assertEquals(listOf(w.p2),w.p1.targets(7))
    }

    @Test fun tradesPreserveIncomingGetHitStatesInsteadOfAttackerFollowups() {
        val w=fight(hitA=attack(target=false),hitB=attack(target=false))
        w.p1.changeState(200);w.p2.changeState(200);w.step()
        assertEquals(2,w.contacts.size)
        assertEquals(5000,w.p1.stateNo);assertEquals(5000,w.p2.stateNo)
        assertEquals(990,w.p1.life);assertEquals(990,w.p2.life)
    }

    @Test fun lethalTradeCannotReviveTheAttackerThroughItsFollowup() {
        val w=fight(hitA=attack("damage=1000",target=false),hitB=attack("damage=1000",target=false))
        w.p1.changeState(200);w.p2.changeState(200);w.step()
        assertEquals(0,w.p1.life);assertEquals(0,w.p2.life)
        assertEquals(5150,w.p1.stateNo);assertEquals(5150,w.p2.stateNo)
    }

    @Test fun winningPriorityCanFollowWhileLosingAttackCannot() {
        val w=fight(hitA=attack("priority=6,Hit",target=false),hitB=attack("priority=2,Hit",target=false))
        w.p1.changeState(200);w.p2.changeState(200);w.step()
        assertEquals(1,w.contacts.size)
        assertEquals(811,w.p1.stateNo);assertEquals(5000,w.p2.stateNo)
    }

    @Test fun helperOwnedThrowFollowsTheHelperAndKeepsHelperAsVictimsOwner() {
        val helperAttack=attack().replace("200","300").replace("anim=300","anim=200")
        val w=fight(a=helperAttack)
        w.entities.add(listOf(EntityRequest.Helper(w.p1,7,300,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor
        w.step()
        assertEquals(811,h.stateNo);assertEquals(0,w.p1.stateNo)
        assertSame(h,w.p2.stateOwner);assertEquals(listOf(w.p2),h.targets(7))
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun canonicalProjectileContactFollowsItsOwner() {
        val w=fight(a="""
            [State 0, projectile]
            type=Projectile
            trigger1=Time=0
            projanim=200
            velocity=1,0
            damage=17
            id=7
            p1stateno=811
            p2stateno=820
        """.trimIndent())
        w.step();w.step()
        assertEquals(811,w.p1.stateNo);assertEquals(983,w.p2.life)
        assertSame(w.p1,w.p2.stateOwner);assertTrue(w.entities.projectiles.isEmpty())
        assertEquals(listOf(w.p2),w.p1.targets(7))
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun projectileFollowupCannotCancelOwnersIncomingHitInTheSamePhase() {
        val w=fight(hitB=attack("p1stateno=-1",target=false))
        w.entities.add(listOf(EntityRequest.Projectile(w.p1,1,200,0,0,0,0,20,
            HitDefinition(damage=15,p1State=811,stateOwner=w.p1))),w.issues)
        w.p2.changeState(200);w.step()
        assertEquals(990,w.p1.life);assertEquals(985,w.p2.life)
        assertEquals(5000,w.p1.stateNo);assertEquals(5000,w.p2.stateNo)
    }

    @Test fun firstValidFollowupWinsForMultipleProjectilesFromOneOwner() {
        for(destinations in listOf(listOf(811,812),listOf(999,811))) {
            val w=fight()
            for(destination in destinations)w.entities.add(listOf(EntityRequest.Projectile(w.p1,1,200,0,0,0,0,20,
                HitDefinition(damage=5,p1State=destination,stateOwner=w.p1))),w.issues)
            w.step();assertEquals(990,w.p2.life);assertEquals(811,w.p1.stateNo)
            assertEquals(2,w.contacts.size)
            if(999 in destinations)assertTrue(w.issues.any { it.contains("Missing custom/transition state: 999") })
        }
    }

    @Test fun capturedStateBankSurvivesCreatorsReturnToOwnStatesBeforeProjectileImpact() {
        val w=fight(a="[State 811, own bank]\ntype=VarSet\ntrigger1=Time=0\nv=1\nvalue=11",
            b="[State 811, foreign bank]\ntype=VarSet\ntrigger1=Time=0\nv=1\nvalue=77")
        w.entities.add(listOf(EntityRequest.Projectile(w.p1,1,200,0,0,0,0,20,
            HitDefinition(damage=5,p1State=811,stateOwner=w.p2))),w.issues)
        w.p1.changeState(0,w.p1);w.step()
        assertSame(w.p2,w.p1.stateOwner);w.step()
        assertEquals(77,w.p1.vars[1]);assertEquals(0,w.p2.vars[1])
    }

    @Test fun mixedCoordinateFollowupKeepsPositionAndUsesCapturedBanksVelocityUnits() {
        val w=fight()
        val high=FightingCharacter(definition().copy(localCoordWidth=1008,localCoordHeight=756,
            states=MugenCnsParser.parse("[Statedef 811]\ntype=S\nmovetype=A\nvelset=3.15,-6.3")),9)
        w.p1.posX=-12*Fixed.ONE
        w.p2.receiveHit(HitDefinition(damage=5,p1State=811,stateOwner=high),true,attacker=w.p1)
        assertSame(high,w.p1.stateOwner);assertEquals(-12*Fixed.ONE,w.p1.posX)
        assertEquals(Fixed.ONE,w.p1.velX);assertEquals(-2*Fixed.ONE,w.p1.velY)
    }

    @Test fun destroyedProjectileCreatorDoesNotReenterAState() {
        val w=fight()
        w.entities.add(listOf(EntityRequest.Helper(w.p1,1,0,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor
        w.entities.add(listOf(EntityRequest.Projectile(h,1,200,0,0,0,0,20,
            HitDefinition(damage=5,p1State=811,stateOwner=h))),w.issues)
        h.destroyed=true;w.step()
        assertEquals(995,w.p2.life);assertEquals(0,h.stateNo)
    }

    @Test fun repeatedPresentationCannotAlterPairedTransitionsOrContactOrder() {
        fun replay(render: Boolean): List<String> {
            val w=fight();w.p1.changeState(200)
            return (0 until 60).map {
                w.step()
                if(render)repeat(3){CorePresentationPlanner.snapshot(w,12)}
                w.checksum()+":"+w.p1.stateOwner.id+":"+w.p2.stateOwner.id+":"+w.contacts.toList()
            }
        }
        assertEquals(replay(false),replay(true))
    }
}
