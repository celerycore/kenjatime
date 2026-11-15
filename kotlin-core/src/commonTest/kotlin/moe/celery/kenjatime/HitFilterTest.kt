package moe.celery.kenjatime

import kotlin.test.*

/** Attribute/clock contracts for the supported subset, not native phase captures. */
class HitFilterTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nmovetype=I\nctrl=1\nanim=0"
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
    """.trimIndent()
    private val attack="""
        [Statedef 200]
        type=S
        movetype=A
        physics=N
        anim=200
        [State 200, attack]
        type=HitDef
        trigger1=Time=0
        attr=S,NA
        damage=10,2
        guardflag=HL
    """.trimIndent()
    private fun definition(extra: String="")=FighterDefinition.fromScript("filter",air,"$idle\n$attack\n$extra")
    private fun fight(defender: String="",owner: String=""): DeterministicFight {
        val w=DeterministicFight(FightingCharacter(definition(owner),1),FightingCharacter(definition(defender),2))
        w.p2.posX=20*Fixed.ONE;w.p2.facingRight=false
        return w
    }
    private fun command(type: String,params: String)=MugenCnsParser.parse(
        "[Statedef 0]\n[State 0, filter]\ntype=$type\ntrigger1=1\n$params").getValue(0).controllers.single()
    private fun set(f: FightingCharacter,type: String="NotHitBy",params: String="value=SCA\ntime=-1",
                    errors: MutableSet<String> = f.world!!.issues) = f.hitFilters.execute(f,command(type,params),errors)
    private fun accepts(f: FightingCharacter,attribute: String)=f.canReceive(HitDefinition(attr=attribute))
    private fun authored(time: Int=1,trigger: String="Time=0",extra: String="")="""
        [State 0, protect]
        type=NotHitBy
        trigger1=$trigger
        value=SCA
        time=$time
        $extra
    """.trimIndent()

    @Test fun hitByMatchesStateAndAttackClassesIncludingCategoryWildcards() {
        val w=fight()
        for(kind in "APT") {
            set(w.p2,"HitBy","value=SC,A$kind\ntime=-1")
            for(state in "SCA")for(strength in "NSH")for(attackKind in "APT")
                assertEquals(state in "SC" && attackKind == kind,
                    accepts(w.p2,"$state,$strength$attackKind"),"$state,$strength$attackKind / $kind")
        }
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun notHitByComplementsStateAndAttackFieldsIndependently() {
        val w=fight()
        set(w.p2,params="value=S,NA\ntime=-1")
        for(attr in listOf("S,SA","C,NA","A,NA"))assertFalse(accepts(w.p2,attr),attr)
        assertTrue(accepts(w.p2,"C,SA"))
        set(w.p2,params="value=,NA,AP\ntime=-1")
        for(attr in listOf("S,NA","C,NP","A,SP","S,HP"))assertFalse(accepts(w.p2,attr),attr)
        assertTrue(accepts(w.p2,"A,HA"))
        assertTrue(accepts(w.p2,"C,HT"))
    }

    @Test fun emptyFieldsDoNotInventImplicitAllowWildcards() {
        val w=fight()
        for(mask in listOf("","SCA",",AA")) {
            set(w.p2,"HitBy","value=$mask\ntime=-1")
            assertFalse(accepts(w.p2,"A,HA"),mask)
        }
        set(w.p2,params="value=\ntime=-1")
        assertTrue(accepts(w.p2,"A,HA"))
        set(w.p2,params="value=SCA\ntime=-1")
        assertFalse(accepts(w.p2,"A,HA"))
    }

    @Test fun bothSlotsIntersectAndOnlySelectedSlotIsReplacedOrCleared() {
        val w=fight()
        set(w.p2,"HitBy","value=SCA,AA,AP\ntime=-1")
        set(w.p2,params="value2=,NA,AP\ntime=-1")
        assertTrue(accepts(w.p2,"S,SA"))
        for(attr in listOf("S,NA","C,NP","A,HT"))assertFalse(accepts(w.p2,attr),attr)
        set(w.p2,"HitBy","value2=S,SA\ntime=-1")
        assertTrue(accepts(w.p2,"S,SA"));assertFalse(accepts(w.p2,"C,SA"))
        set(w.p2,"HitBy","value=\ntime=0")
        assertEquals(0,w.p2.hitFilters.remaining(0))
        assertEquals(-1,w.p2.hitFilters.remaining(1))
        assertFalse(accepts(w.p2,"C,NT"))
        set(w.p2,params="value2=\ntime=0")
        assertTrue(accepts(w.p2,"C,NT"))
    }

    @Test fun defaultOneTickFilterCoversCurrentContactThenExpires() {
        val w=fight("[State 0, one tick]\ntype=NotHitBy\ntrigger1=Time=0\nvalue=SCA")
        w.p1.changeState(200)
        w.step()
        assertEquals(1000,w.p2.life);assertTrue(w.contacts.isEmpty())
        assertEquals(1,w.p2.hitFilters.remaining(0))
        assertTrue(w.p1.canHit(w.p2.id),"Rejected contact must not consume the attack")
        w.step()
        assertEquals(990,w.p2.life);assertEquals(1,w.contacts.size)
        assertEquals(0,w.p2.hitFilters.remaining(0))
    }

    @Test fun finiteDurationHasExactlyThreeProtectedContactPhases() {
        val w=fight(authored(3));w.p1.changeState(200)
        for(left in 3 downTo 1) {
            w.step();assertEquals(left,w.p2.hitFilters.remaining(0))
            assertEquals(1000,w.p2.life);assertTrue(w.contacts.isEmpty())
        }
        w.step();assertEquals(990,w.p2.life)
    }

    @Test fun hitpauseDoesNotFreezeAlreadyInstalledFilterTimers() {
        val w=fight(authored(3));w.p1.posX=-200*Fixed.ONE
        w.step();w.p2.hitPauseLeft=5
        val stateTime=w.p2.timeInState
        for(left in 2 downTo 0) {
            w.step();assertEquals(left,w.p2.hitFilters.remaining(0))
            assertEquals(stateTime,w.p2.timeInState)
            assertTrue(w.p2.hitPauseThisTick)
        }
        assertTrue(accepts(w.p2,"S,NA"))
        assertEquals(2,w.p2.hitPauseLeft)
    }

    @Test fun ignoreHitPauseExplicitlyRenewsFiltersDuringEveryPausedTick() {
        val w=fight(authored(trigger="1",extra="ignorehitpause=1"));w.p2.hitPauseLeft=3
        w.p1.changeState(200)
        repeat(3) {
            w.step();assertEquals(1,w.p2.hitFilters.remaining(0))
            assertEquals(1000,w.p2.life);assertEquals(0,w.p2.timeInState)
        }
        w.step();assertEquals(1000,w.p2.life)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun indefiniteFiltersSurviveTicksAndStateChangesUntilExplicitClearing() {
        val w=fight();set(w.p2)
        w.p1.posX=-200*Fixed.ONE
        repeat(200){w.step()}
        w.p2.changeState(200);w.p2.hitPauseLeft=3
        repeat(3){w.step()}
        assertEquals(-1,w.p2.hitFilters.remaining(0))
        assertFalse(accepts(w.p2,"C,HT"))
        set(w.p2,params="value=\ntime=0")
        assertTrue(accepts(w.p2,"C,HT"))
    }

    @Test fun invalidRequestsLeaveBothExistingSlotsUnchanged() {
        val w=fight()
        set(w.p2,"HitBy","value=SCA,AA\ntime=-1")
        set(w.p2,params="value2=,NA\ntime=-1")
        for(params in listOf("value=X,NA","value=S,XA","value=S,NAX","value=S,NA\nvalue2=A,SA",
            "time=3","value=SCA\ntime=-2","value=SCA\ntime=unknown_variable",
            "value=SCA\nslot=1","value=SCA\nattr=S,NA","value="+"S".repeat(257))) {
            val errors=linkedSetOf<String>()
            set(w.p2,"HitBy",params,errors)
            assertTrue(errors.any { it.startsWith("Invalid HitBy:") },params)
            assertEquals(-1,w.p2.hitFilters.remaining(0));assertEquals(-1,w.p2.hitFilters.remaining(1))
            assertFalse(accepts(w.p2,"S,NA"));assertTrue(accepts(w.p2,"S,SA"))
        }
    }

    @Test fun packedLegacyAttackTokensEqualExplicitCompletePairs() {
        val w=fight()
        set(w.p2,"HitBy","value=SCA,NASAHANPSPHPNTSTHT\ntime=-1")
        for(state in "SCA")for(strength in "NSH")for(kind in "APT")
            assertTrue(accepts(w.p2,"$state,$strength$kind"))
        val errors=linkedSetOf<String>()
        set(w.p2,"HitBy","value=SCA,NASAHANPSPHPNTSTHTQ",errors)
        assertTrue(errors.isNotEmpty())
        assertTrue(accepts(w.p2,"A,HP"))
    }

    @Test fun helperContactsHonorTargetFiltersWithoutConsumingTheirAttack() {
        val helper="[Statedef 300]\ntype=S\nanim=200\n"+
            "[State 300, hit]\ntype=HitDef\ntrigger1=Time=0\nattr=S,NA\ndamage=20"
        val w=fight(authored(2),helper)
        w.entities.add(listOf(EntityRequest.Helper(w.p1,1,300,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor
        repeat(2) { w.step();assertEquals(1000,w.p2.life);assertTrue(h.canHit(w.p2.id)) }
        w.step();assertEquals(980,w.p2.life)
        assertEquals(h.id,w.contacts.single().attacker)
    }

    @Test fun projectileContactsHonorFiltersAndStayAliveUntilAnAllowedContact() {
        val w=fight(authored(2))
        w.entities.add(listOf(EntityRequest.Projectile(w.p1,7,200,0,0,Fixed.ONE,0,20,
            HitDefinition(attr="S,SP",damage=15))),w.issues)
        val p=w.entities.projectiles.single()
        repeat(2) { w.step();assertEquals(1000,w.p2.life);assertTrue(p.canHit(w.p2.id)) }
        assertEquals(18,p.ticksLeft)
        w.step();assertEquals(985,w.p2.life)
        assertEquals(p.entityId,w.contacts.single().attacker)
        assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun filtersRunBeforeGuardDamageAndTargetCapture() {
        val w=fight();w.p1.changeState(200)
        set(w.p2,params="value=,AA\ntime=-1")
        w.step(b=InputFrame(Directions.R))
        assertEquals(1000,w.p2.life);assertTrue(w.contacts.isEmpty());assertTrue(w.p1.targets().isEmpty())
        set(w.p2,params="value=\ntime=0")
        w.step(b=InputFrame(Directions.R))
        assertEquals(998,w.p2.life);assertTrue(w.contacts.single().guarded)
        assertTrue(w.p1.targets().isEmpty())
    }

    @Test fun borrowedStateFiltersBelongToVictimAndSelfStateKeepsRemainingTime() {
        val w=fight(owner="""
            [Statedef 900]
            type=S
            movetype=H
            [State 900, protect victim]
            type=NotHitBy
            trigger1=Time=0
            value=SCA
            time=2
            [State 900, restore]
            type=SelfState
            trigger1=Time=1
            value=0
        """.trimIndent())
        assertTrue(w.p2.enterAuthoredState(900,w.p1,w.issues))
        w.step()
        assertEquals(2,w.p2.hitFilters.remaining(0));assertEquals(0,w.p1.hitFilters.remaining(0))
        w.step()
        assertSame(w.p2,w.p2.stateOwner);assertEquals(1,w.p2.hitFilters.remaining(0))
        w.step();assertEquals(0,w.p2.hitFilters.remaining(0))
    }

    @Test fun helpersDoNotShareParentsMutableHitFilterSlots() {
        val w=fight();set(w.p1)
        w.entities.add(listOf(EntityRequest.Helper(w.p1,1,0,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor
        assertFalse(accepts(w.p1,"S,NA"));assertTrue(accepts(h,"S,NA"))
        set(h,"HitBy","value=\ntime=-1")
        set(w.p1,params="value=\ntime=0")
        assertTrue(accepts(w.p1,"S,NA"));assertFalse(accepts(h,"S,NA"))
    }

    @Test fun helperCannotAttackOnTheFinalFrozenTickEvenWhenCounterReachesZero() {
        val helper="[Statedef 300]\nanim=200\n[State 300, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=20"
        val w=fight(owner=helper);w.p2.posX=200*Fixed.ONE
        w.entities.add(listOf(EntityRequest.Helper(w.p1,1,300,0,0,1,false,0)),w.issues)
        w.step()
        val h=w.entities.helpers.single().actor
        h.hitPauseLeft=1;w.p2.posX=20*Fixed.ONE
        w.step()
        assertEquals(0,h.hitPauseLeft);assertTrue(h.hitPauseThisTick)
        assertEquals(1000,w.p2.life);assertTrue(w.contacts.isEmpty())
        w.step();assertEquals(980,w.p2.life)
    }

    @Test fun presentationDoesNotConsumeFiltersOrAlterReplay() {
        fun replay(render: Boolean): List<String> {
            val w=fight(authored(3));w.p1.changeState(200)
            return (0 until 60).map { i ->
                if(i==1)w.p2.hitPauseLeft=3
                w.step()
                if(render)repeat(3){CorePresentationPlanner.snapshot(w,12)}
                w.checksum()+":"+w.p2.hitFilters.remaining(0)+":"+w.contacts.toList()
            }
        }
        assertEquals(replay(false),replay(true))
    }
}
