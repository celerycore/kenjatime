package moe.celery.kenjatime

import kotlin.test.*

/** Synthetic reaction contracts, not native throw/armor phase captures. */
class HitOverrideTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nanim=0\nctrl=1"
    private val air="""
        [Begin Action 0]
        Clsn2Default:1
        Clsn2[0]=-10,-40,10,0
        0,0,0,0,-1
        [Begin Action 200]
        Clsn1Default:1
        Clsn1[0]=0,-40,40,0
        200,0,0,0,-1
        [Begin Action 700]
        Clsn2Default:1
        Clsn2[0]=-10,-40,10,0
        700,0,0,0,-1
        [Begin Action 701]
        701,0,0,0,-1
    """.trimIndent()
    private val attack="""
        [Statedef 200]
        type=S
        movetype=A
        anim=200
        [State 200, hit]
        type=HitDef
        trigger1=Time=0
        attr=S,NA
        damage=10,3
        guardflag=HL
        id=7
    """.trimIndent()
    private val reactions="""
        [Statedef 700]
        type=S
        movetype=H
        physics=N
        anim=700
        [Statedef 701]
        type=S
        movetype=H
        physics=N
        anim=701
        [Statedef 40]
        type=A
        physics=N
        anim=0
    """.trimIndent()
    private fun fight(defender: String="",attacker: String="",attackSource: String=attack,width: Int=320): DeterministicFight {
        val a=FighterDefinition.fromScript("attacker",air,"$idle\n$attackSource\n$attacker")
        val b=FighterDefinition.fromScript("defender",air,"$idle\n$reactions\n$defender",
            defText="[Info]\nlocalcoord=$width,${width*3/4}")
        return DeterministicFight(FightingCharacter(a,1),FightingCharacter(b,2)).also {
            it.p2.posX=20*Fixed.ONE;it.p2.facingRight=false
        }
    }
    private fun controller(params: String)=MugenCnsParser.parse(
        "[Statedef 0]\n[State 0, route]\ntype=HitOverride\ntrigger1=1\n$params").getValue(0).controllers.single()
    private fun arm(f: FightingCharacter,params: String="attr=SCA,AA,AP,AT\nstateno=700\ntime=-1",
                    errors: MutableSet<String> = f.world!!.issues) = f.hitOverrides.execute(f,controller(params),errors)
    private fun value(f: FightingCharacter,key: String)=CoreExpression.number("GetHitVar($key)",f,f.world!!.issues)

    @Test fun normalContactRoutesToOwnReactionWithDamageAndTargetCapture() {
        val w=fight();arm(w.p2);w.p1.changeState(200);w.step()
        assertEquals(990,w.p2.life);assertEquals(700,w.p2.stateNo)
        assertSame(w.p2,w.p2.stateOwner);assertSame(w.p2,w.p2.animationOwner)
        assertEquals(700,w.p2.animation!!.action.number)
        assertEquals(10.0,value(w.p2,"damage"));assertEquals(listOf(w.p2),w.p1.targets(7))
        assertEquals(1,w.contacts.size);assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun lowestMatchingSlotWinsAndClearingItRevealsTheNextRoute() {
        val w=fight()
        arm(w.p2,"attr=SCA,AA\nstateno=701\nslot=7\ntime=-1")
        arm(w.p2)
        w.p1.changeState(200);w.step();assertEquals(700,w.p2.stateNo)
        arm(w.p2,"slot=0\ntime=0")
        w.p2.changeState(0);w.p1.changeState(200);w.step()
        assertEquals(701,w.p2.stateNo);assertEquals(-1,w.p2.hitOverrides.remaining(7))
    }

    @Test fun defaultOneTickRouteProtectsTheCurrentContactPhaseOnly() {
        val w=fight("[State 0, route]\ntype=HitOverride\ntrigger1=Time=0\nattr=SCA,AA\nstateno=700")
        w.p1.changeState(200);w.step()
        assertEquals(700,w.p2.stateNo);assertEquals(1,w.p2.hitOverrides.remaining(0))
        w.p1.changeState(200);w.step()
        assertEquals(5000,w.p2.stateNo);assertEquals(0,w.p2.hitOverrides.remaining(0))
    }

    @Test fun finiteOverrideClocksContinueDuringHitpauseAndIndefiniteSlotsRemain() {
        val w=fight("[State 0, finite]\ntype=HitOverride\ntrigger1=Time=0\nattr=SCA,AA\nstateno=700\ntime=3")
        arm(w.p2,"attr=SCA,AP\nstateno=701\nslot=7\ntime=-1")
        w.step();w.p2.hitPauseLeft=4
        for(left in 2 downTo 0) { w.step();assertEquals(left,w.p2.hitOverrides.remaining(0)) }
        assertEquals(1,w.p2.hitPauseLeft);assertEquals(-1,w.p2.hitOverrides.remaining(7))
    }

    @Test fun blankAttributeAndZeroDurationClearOnlyTheSelectedSlot() {
        val w=fight();arm(w.p2)
        arm(w.p2,"attr=SCA,AP\nstateno=701\nslot=1\ntime=-1")
        arm(w.p2,"attr=\nslot=0\ntime=-1")
        assertEquals(0,w.p2.hitOverrides.remaining(0));assertEquals(-1,w.p2.hitOverrides.remaining(1))
        arm(w.p2,"slot=1\ntime=0");assertEquals(0,w.p2.hitOverrides.remaining(1))
    }

    @Test fun malformedRequestsPreserveAnExistingOverride() {
        val w=fight();arm(w.p2)
        for(params in listOf("attr=SCA,XA\nstateno=701","attr=SCA,AA\nstateno=999",
            "attr=SCA,AA","stateno=700","attr=SCA,AA\nstateno=-1",
            "attr=SCA,AA\nstateno=701\nslot=8","attr=SCA,AA\nstateno=701\ntime=-2",
            "attr=SCA,AA\nstateno=701\nforceair=2","attr=SCA,AA\nstateno=701\nslot=unknown",
            "attr=SCA,AA\nstateno=701\nredirectid=2")) {
            val errors=linkedSetOf<String>();arm(w.p2,params,errors)
            assertTrue(errors.any { it.startsWith("Invalid HitOverride:") },params)
            assertEquals(700,w.p2.hitOverrides.matching(HitDefinition())!!.state)
            assertEquals(-1,w.p2.hitOverrides.remaining(0))
        }
    }

    @Test fun hitFiltersRejectContactBeforeAnOverrideCanRun() {
        val w=fight("[State 0, block]\ntype=NotHitBy\ntrigger1=1\nvalue=SCA")
        arm(w.p2);w.p1.changeState(200);w.step()
        assertEquals(1000,w.p2.life);assertEquals(0,w.p2.stateNo)
        assertTrue(w.contacts.isEmpty());assertTrue(w.p1.canHit(w.p2.id))
        assertEquals(0.0,value(w.p2,"damage"))
    }

    @Test fun guardedHitsUseGuardStatesAndGuardHitTimeInsteadOfOverrides() {
        val w=fight(attackSource=attack+"\nguard.hittime=7\nground.hittime=12")
        arm(w.p2);w.p1.changeState(200);w.step(b=InputFrame(Directions.R))
        assertEquals(997,w.p2.life);assertEquals(150,w.p2.stateNo)
        assertEquals(1.0,value(w.p2,"guarded"));assertEquals(3.0,value(w.p2,"damage"))
        assertEquals(7.0,value(w.p2,"hittime"));assertTrue(w.contacts.single().guarded)
    }

    @Test fun matchingForeignStateHitsAreRejectedBeforeDamagePauseAndCapture() {
        val w=fight();arm(w.p2)
        for(hit in listOf(HitDefinition(damage=10,p1State=200),
            HitDefinition(damage=10,p2State=900,p2GetP1State=true,stateOwner=w.p1))) {
            assertFalse(w.p2.canReceive(hit))
            w.p2.receiveHit(hit,true,attacker=w.p1)
            assertEquals(1000,w.p2.life);assertEquals(0,w.p2.stateNo)
            assertEquals(0,w.p2.hitPauseLeft);assertTrue(w.p1.targets().isEmpty())
        }
        assertTrue(w.p2.canReceive(HitDefinition(p2GetP1State=true)),"Flag alone is not a custom-state transfer")
    }

    @Test fun ownBankP2StateDoesNotStealTheOverrideDestination() {
        val w=fight();arm(w.p2)
        val hit=HitDefinition(damage=10,p2State=701,p2GetP1State=false)
        assertTrue(w.p2.canReceive(hit));w.p2.receiveHit(hit,true,attacker=w.p1)
        assertEquals(700,w.p2.stateNo);assertSame(w.p2,w.p2.stateOwner)
    }

    @Test fun nonmatchingOverrideDoesNotBlockAnOrdinaryCustomStateTransfer() {
        val w=fight(attacker="[Statedef 900]\ntype=S\nmovetype=H\nanim=0")
        arm(w.p2,"attr=SCA,AP\nstateno=700\ntime=-1")
        w.p2.receiveHit(HitDefinition(damage=10,p2State=900,stateOwner=w.p1),true,attacker=w.p1)
        assertEquals(990,w.p2.life);assertEquals(900,w.p2.stateNo);assertSame(w.p1,w.p2.stateOwner)
    }

    @Test fun borrowedControllerInstallsVictimsOwnReactionBank() {
        val w=fight(attacker="""
            [Statedef 900]
            type=S
            [State 900, route victim]
            type=HitOverride
            trigger1=Time=0
            attr=SCA,AA
            stateno=700
            time=-1
        """.trimIndent())
        assertTrue(w.p2.enterAuthoredState(900,w.p1,w.issues));w.step()
        w.p2.receiveHit(HitDefinition(damage=10),true,attacker=w.p1)
        assertEquals(700,w.p2.stateNo);assertSame(w.p2,w.p2.stateOwner)
        assertEquals(0,w.p1.hitOverrides.remaining(0));assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun forceAirSelectsAirHitVariablesAndHonorsAuthoredStateDefVelocity() {
        val w=fight("[Statedef 700]\ntype=S\nmovetype=H\nanim=700\nvelset=0,0")
        arm(w.p2,"attr=SCA,AA\nstateno=700\ntime=-1\nforceair=1")
        w.p2.receiveHit(HitDefinition(damage=10,velocityX=2*Fixed.ONE,velocityY=-Fixed.ONE,
            hitTime=4,airVelocityX=5*Fixed.ONE,airVelocityY=-7*Fixed.ONE,airHitTime=19,airFall=true),true)
        assertEquals(5.0,value(w.p2,"xvel"));assertEquals(-7.0,value(w.p2,"yvel"))
        assertEquals(19.0,value(w.p2,"hittime"));assertEquals(1.0,value(w.p2,"fall"))
        assertEquals(0,w.p2.velX);assertEquals(0,w.p2.velY)
        assertEquals("S",w.p2.stateType,"Destination owns its actual StateType")
    }

    @Test fun ordinaryAirHitsSelectAirVelocityAndTimeWithoutForceAir() {
        val w=fight();w.p2.changeState(40);arm(w.p2)
        w.p2.receiveHit(HitDefinition(velocityX=Fixed.ONE,airVelocityX=3*Fixed.ONE,
            airVelocityY=-4*Fixed.ONE,airHitTime=20),false)
        assertEquals(-3.0,value(w.p2,"xvel"));assertEquals(-4.0,value(w.p2,"yvel"))
        assertEquals(20.0,value(w.p2,"hittime"));assertEquals(-3*Fixed.ONE,w.p2.velX)
    }

    @Test fun authoredArmorCanReadDamageAndRecoverWhenHitTimeBecomesNegative() {
        val w=fight("""
            [State 700, armor heal]
            type=LifeAdd
            trigger1=Time=0
            value=GetHitVar(damage)
            [State 700, record velocity]
            type=VarSet
            trigger1=Time=0
            fv=0
            value=GetHitVar(xvel)
            [State 700, recover]
            type=SelfState
            trigger1=GetHitVar(hittime)<0
            value=0
        """.trimIndent())
        arm(w.p2);w.p2.receiveHit(HitDefinition(damage=80,hitTime=1,defenderPause=2,velocityX=Fixed.ONE),true)
        repeat(2) { w.step();assertEquals(920,w.p2.life);assertEquals(1.0,value(w.p2,"hittime")) }
        w.step();assertEquals(1000,w.p2.life);assertEquals(0.0,value(w.p2,"hittime"))
        assertEquals(1.0,w.p2.fvars[0])
        w.step();assertEquals(0,w.p2.stateNo);assertEquals(-1.0,value(w.p2,"hittime"))
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun getHitVelocitiesStayIndependentOfLaterMotionAndUseActiveCoordinateUnits() {
        val w=fight(attacker="[Statedef 900]\ntype=S")
        val high=FightingCharacter(w.p1.definition.copy(localCoordWidth=1008,localCoordHeight=756),9)
        w.p2.receiveHit(HitDefinition(velocityX=2*Fixed.ONE,velocityY=-4*Fixed.ONE),true)
        w.p2.velX=99*Fixed.ONE
        assertEquals(2.0,value(w.p2,"xvel"))
        assertTrue(w.p2.enterAuthoredState(900,high,w.issues))
        assertEquals(6.3,value(w.p2,"xvel"));assertEquals(-12.6,value(w.p2,"yvel"))
        assertTrue(w.p2.enterAuthoredState(0,w.p2,w.issues));assertEquals(2.0,value(w.p2,"xvel"))
    }

    @Test fun unsupportedGetHitFieldsAndDynamicFieldExpressionsAreDiagnosed() {
        val w=fight()
        assertEquals(0.0,value(w.p2,"damage"));assertEquals(-1.0,value(w.p2,"hittime"))
        for(expr in listOf("GetHitVar(groundtype)","GetHitVar()","GetHitVar(var(0))","GetHitVar(damage+1)")) {
            val errors=linkedSetOf<String>()
            assertNull(CoreExpression.number(expr,w.p2,errors));assertTrue(errors.isNotEmpty(),expr)
        }
        assertEquals(0.0,CoreExpression.number("gEtHiTvAr(DaMaGe)",w.p2,w.issues))
    }

    @Test fun helperHitsApplyTheSameOverrideAndKeepTargetOwnershipWithTheHelper() {
        val helper=attack.replace("200","300").replace("anim=300","anim=200").replace("damage=10,3","damage=23,3")
        val w=fight(attacker=helper);arm(w.p2)
        w.entities.add(listOf(EntityRequest.Helper(w.p1,7,300,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor
        w.step();assertEquals(977,w.p2.life);assertEquals(700,w.p2.stateNo)
        assertEquals(listOf(w.p2),h.targets(7));assertTrue(w.p1.targets().isEmpty())
    }

    @Test fun canonicalProjectileHitParametersReachForceAirReactions() {
        val w=fight(attacker="""
            [State 0, projectile]
            type=Projectile
            trigger1=Time=0
            projanim=200
            velocity=1,0
            attr=S,SP
            damage=17,3
            air.velocity=4,-6
            air.hittime=7
            air.fall=1
        """.trimIndent())
        arm(w.p2,"attr=SCA,AP\nstateno=700\ntime=-1\nforceair=1")
        w.step();w.step()
        assertEquals(983,w.p2.life);assertEquals(700,w.p2.stateNo)
        assertEquals(4.0,value(w.p2,"xvel"));assertEquals(-6.0,value(w.p2,"yvel"))
        assertEquals(7.0,value(w.p2,"hittime"));assertEquals(1.0,value(w.p2,"fall"))
        assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun overrideSlotsAndIncomingDataAreNotSharedWithHelpers() {
        val w=fight();arm(w.p2)
        w.entities.add(listOf(EntityRequest.Helper(w.p2,1,0,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor
        assertEquals(0,h.hitOverrides.remaining(0))
        h.receiveHit(HitDefinition(damage=30),true)
        assertEquals(30.0,value(h,"damage"));assertEquals(0.0,value(w.p2,"damage"))
        assertEquals(5000,h.stateNo);assertEquals(-1,w.p2.hitOverrides.remaining(0))
    }

    @Test fun rejectedCustomStateProjectileSurvivesUntilOverrideIsCleared() {
        val w=fight(attacker="""
            [Statedef 900]
            type=S
            movetype=H
            anim=0
            [State 0, foreign projectile]
            type=Projectile
            trigger1=Time=0
            projanim=200
            velocity=1,0
            attr=S,SP
            damage=17,3
            p2stateno=900
        """.trimIndent())
        arm(w.p2,"attr=SCA,AP\nstateno=700\ntime=-1")
        w.step();w.step()
        assertEquals(1000,w.p2.life);assertTrue(w.contacts.isEmpty())
        assertEquals(1,w.entities.projectiles.size)
        assertTrue(w.entities.projectiles.single().canHit(w.p2.id))
        arm(w.p2,"time=0")
        w.step()
        assertEquals(983,w.p2.life);assertEquals(900,w.p2.stateNo)
        assertSame(w.p1,w.p2.stateOwner);assertTrue(w.entities.projectiles.isEmpty())
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun matchingOverrideOwnsTheReactionEvenForLethalDamage() {
        val w=fight();arm(w.p2)
        w.p2.receiveHit(HitDefinition(damage=1000),true)
        assertEquals(0,w.p2.life);assertEquals(700,w.p2.stateNo)
        assertEquals(1000.0,value(w.p2,"damage"))
        w.p1.receiveHit(HitDefinition(damage=1000),false)
        assertEquals(5150,w.p1.stateNo)
    }

    @Test fun ignoredGlobalControllerCanRenewOneTickOverridesThroughoutHitpause() {
        val w=fight(defender="""
            [Statedef -2]
            [State -2, route while frozen]
            type=HitOverride
            trigger1=1
            ignorehitpause=1
            attr=SCA,AA
            stateno=700
        """.trimIndent(),attackSource=attack+"\npausetime=0,3")
        w.p1.changeState(200);w.step()
        repeat(3) {
            w.step();assertEquals(1,w.p2.hitOverrides.remaining(0))
            assertTrue(w.p2.hitPauseThisTick);assertEquals(0,w.p2.timeInState)
            assertEquals(12.0,value(w.p2,"hittime"))
        }
        assertEquals(0.0,value(w.p2,"hitshaketime"))
        w.p1.changeState(200);w.step()
        assertEquals(700,w.p2.stateNo);assertEquals(980,w.p2.life)
    }

    @Test fun repeatedRenderingDoesNotConsumeOverrideOrHitReactionClocks() {
        fun replay(render: Boolean): List<String> {
            val w=fight();arm(w.p2);w.p1.changeState(200)
            return (0 until 60).map {
                w.step()
                if(render)repeat(3){CorePresentationPlanner.snapshot(w,12)}
                w.checksum()+":"+w.p2.hitOverrides.remaining(0)+":"+value(w.p2,"hittime")
            }
        }
        assertEquals(replay(false),replay(true))
    }
}
