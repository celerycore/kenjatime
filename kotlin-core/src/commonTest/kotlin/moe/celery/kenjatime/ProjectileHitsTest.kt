package moe.celery.kenjatime

import kotlin.test.*

/** Finite contact allowances and active-tick clocks, not native phase captures. */
class ProjectileHitsTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nctrl=1\nanim=0"
    private val air="""
        [Begin Action 0]
        Clsn2Default:1
        Clsn2[0]=-10,-40,10,0
        0,0,0,0,-1
        [Begin Action 200]
        Clsn1Default:1
        Clsn1[0]=0,-40,80,0
        200,0,0,0,2
        200,1,0,0,3
    """.trimIndent()
    private fun fight(extra: String="",width: Int=320): DeterministicFight {
        val owner=FighterDefinition.fromScript("owner",air,"$idle\n$extra",
            defText="[Info]\nlocalcoord=$width,${width*3/4}")
        val target=FighterDefinition.fromScript("target",air,idle)
        return DeterministicFight(FightingCharacter(owner,1),FightingCharacter(target,2)).also {
            it.p2.posX=20*Fixed.ONE;it.p2.facingRight=false
        }
    }
    private fun source(params: String)="[State 0, fire]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\ndamage=10,2\n$params"
    private fun spawn(w: DeterministicFight,hits: Int=1,remove: Boolean=true,miss: Int=0,
                      life: Int=-1,pause: Int=0,vx: Int=0,ax: Int=0,
                      owner: FightingCharacter=w.p1,hit: HitDefinition=HitDefinition(
                          attr="S,SP",id=71,damage=10,guardDamage=2,guardFlag="HL",hitPause=pause,defenderPause=0)):
        CoreProjectile {
        w.entities.add(listOf(EntityRequest.Projectile(owner,7,200,0,0,vx,0,life,hit,
            accelerationX=ax,removeOnHit=remove,hits=hits,missTime=miss)),w.issues)
        return w.entities.projectiles.last()
    }
    private fun filter(w: DeterministicFight,time: Int) {
        val command=MugenCnsParser.parse("[Statedef 0]\n[State 0, filter]\ntype=NotHitBy\ntrigger1=1\nvalue=SCA\ntime=$time")
            .getValue(0).controllers.single()
        w.p2.hitFilters.execute(w.p2,command,w.issues)
    }

    @Test fun defaultAllowanceRetainsSingleContactRetirement() {
        val w=fight();val p=spawn(w)
        w.step();assertEquals(990,w.p2.life);assertEquals(0,p.hitsLeft)
        assertFalse(p.alive);assertTrue(w.entities.projectiles.isEmpty())
        repeat(10){w.step()};assertEquals(990,w.p2.life)
    }

    @Test fun authoredHitCountAllowsRepeatedContactsThenRetires() {
        val w=fight(source("projhits=3"));w.step()
        val p=w.entities.projectiles.single()
        assertEquals(3,p.hitsLeft);assertEquals(1000,w.p2.life)
        for(i in 1..3) {
            w.step();assertEquals(1000-10*i,w.p2.life);assertEquals(3-i,p.hitsLeft)
            assertEquals(1,w.contacts.size)
        }
        assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun delayCountsActiveContactPhasesWithNoSameTickRepeat() {
        for(delay in listOf(0,1,2,5)) {
            val w=fight();val p=spawn(w,hits=3,miss=delay)
            val phases=mutableListOf<Int>()
            repeat(15) { i -> w.step();if(w.contacts.isNotEmpty())phases.add(i+1) }
            val interval=maxOf(1,delay)
            assertEquals(listOf(1,1+interval,1+2*interval),phases,"delay=$delay")
            assertEquals(970,w.p2.life);assertEquals(0,p.hitsLeft)
        }
    }

    @Test fun disabledRemovalKeepsExhaustedProjectileWithoutRearmingIt() {
        val w=fight(source("projhits=2\nprojremove=0\nvelocity=1,0"));w.step()
        val p=w.entities.projectiles.single()
        repeat(12){w.step()}
        assertEquals(980,w.p2.life);assertEquals(0,p.hitsLeft)
        assertTrue(p.alive);assertFalse(p.canHit(w.p2.id));assertFalse(p.removeOnHit)
        assertEquals(12*Fixed.ONE,p.x);assertEquals(-1,p.ticksLeft)
        assertEquals(0.0,CoreExpression.number("NumProjID(7)",w.p1,w.issues))
        // This shot has the authored default ProjID zero.
        assertEquals(1.0,CoreExpression.number("NumProjID(0)",w.p1,w.issues))
    }

    @Test fun everyNonzeroRemoveFlagRetiresWhenTheAllowanceIsSpent() {
        for(flag in listOf("1","2","-1")) {
            val w=fight(source("projhits=2\nprojremove=$flag"))
            repeat(3){w.step()}
            assertEquals(980,w.p2.life);assertTrue(w.entities.projectiles.isEmpty(),flag)
        }
    }

    @Test fun zeroHitsCanAnimateButCannotDamageOrPause() {
        val w=fight();val p=spawn(w,hits=0,life=4,pause=3,vx=Fixed.ONE)
        repeat(3){w.step();assertEquals(1000,w.p2.life);assertTrue(w.contacts.isEmpty())}
        assertEquals(3*Fixed.ONE,p.x);assertEquals(0,p.hitPauseLeft);assertTrue(p.alive)
        w.step();assertFalse(p.alive);assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun rejectedHitFilterContactsDoNotSpendHitsOrStartDelayOrPause() {
        val w=fight();val p=spawn(w,hits=2,miss=3,pause=2);filter(w,-1)
        repeat(4) {
            w.step();assertEquals(1000,w.p2.life);assertEquals(2,p.hitsLeft)
            assertEquals(0,p.missTimeLeft);assertEquals(0,p.hitPauseLeft)
        }
        filter(w,0);w.step()
        assertEquals(990,w.p2.life);assertEquals(1,p.hitsLeft)
        assertEquals(3,p.missTimeLeft);assertEquals(2,p.hitPauseLeft)
    }

    @Test fun matchingOverrideRejectionLeavesTheFullAllowanceAvailable() {
        val w=fight("[Statedef 900]\ntype=S\nphysics=N\nanim=0")
        val command=MugenCnsParser.parse("[Statedef 0]\n[State 0, override]\ntype=HitOverride\ntrigger1=1\nattr=SCA,AP\nstateno=0\ntime=-1")
            .getValue(0).controllers.single()
        w.p2.hitOverrides.execute(w.p2,command,w.issues)
        val p=spawn(w,hits=3,miss=2,hit=HitDefinition(attr="S,SP",damage=10,p2State=900))
        repeat(3){w.step()}
        assertEquals(1000,w.p2.life);assertEquals(3,p.hitsLeft);assertEquals(0,p.missTimeLeft)
        val clear=command.copy(params=command.params+mapOf("time" to "0"))
        w.p2.hitOverrides.execute(w.p2,clear,w.issues)
        w.step();assertEquals(990,w.p2.life);assertEquals(2,p.hitsLeft);assertEquals(900,w.p2.stateNo)
    }

    @Test fun guardedContactsConsumeHitsAndUseGuardDamage() {
        val w=fight();val p=spawn(w,hits=3,miss=2)
        repeat(5){w.step(b=InputFrame(Directions.R))}
        assertEquals(994,w.p2.life);assertEquals(0,p.hitsLeft);assertFalse(p.alive)
        assertTrue(w.contacts.single().guarded);assertEquals(0,w.p1.targets().size)
        assertFalse(w.p1.moveContact);assertFalse(w.p1.moveHit)
    }

    @Test fun guardThenHitShareOneFiniteAllowance() {
        val w=fight();val p=spawn(w,hits=2)
        w.step(b=InputFrame(Directions.R));assertEquals(998,w.p2.life);assertEquals(1,p.hitsLeft)
        w.step();assertEquals(988,w.p2.life);assertEquals(0,p.hitsLeft)
        assertFalse(w.contacts.single().guarded);assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun projectileHitpauseFreezesTrajectoryAnimationLifetimeAndMissDelay() {
        val w=fight();val p=spawn(w,hits=2,miss=3,pause=2,life=20,vx=Fixed.ONE,ax=Fixed.ONE)
        w.step();assertEquals(990,w.p2.life);assertEquals(19,p.ticksLeft)
        val held=listOf(p.x,p.y,p.vx,p.vy,p.action.index,p.action.tick,p.ticksLeft,p.missTimeLeft)
        for(left in 1 downTo 0) {
            w.step();assertEquals(left,p.hitPauseLeft);assertTrue(w.contacts.isEmpty())
            assertEquals(held,listOf(p.x,p.y,p.vx,p.vy,p.action.index,p.action.tick,p.ticksLeft,p.missTimeLeft))
        }
        w.step();assertEquals(990,w.p2.life);assertEquals(2,p.missTimeLeft)
        assertEquals(3*Fixed.ONE,p.x);assertEquals(3*Fixed.ONE,p.vx);assertEquals(18,p.ticksLeft)
        w.step();assertEquals(990,w.p2.life)
        w.step();assertEquals(980,w.p2.life);assertFalse(p.alive)
    }

    @Test fun projectilePauseDoesNotFreezeItsCreatorOrRequireDefenderPause() {
        val w=fight();val p=spawn(w,hits=2,pause=3)
        w.step();assertEquals(0,w.p1.hitPauseLeft);assertEquals(0,w.p2.hitPauseLeft)
        val time=w.p1.timeInState
        repeat(3){w.step();assertTrue(w.contacts.isEmpty())}
        assertEquals(time+3,w.p1.timeInState);assertEquals(0,p.hitPauseLeft)
        assertEquals(990,w.p2.life)
        w.step();assertEquals(980,w.p2.life);assertFalse(p.alive)
    }

    @Test fun guardContactUsesProjectileGuardPause() {
        val w=fight();val p=spawn(w,hits=2,hit=HitDefinition(
            damage=10,guardDamage=2,guardFlag="HL",hitPause=1,guardPause=3))
        w.step(b=InputFrame(Directions.R));assertEquals(3,p.hitPauseLeft)
        repeat(3){w.step(b=InputFrame(Directions.R));assertTrue(w.contacts.isEmpty())}
        assertEquals(998,w.p2.life)
        w.step(b=InputFrame(Directions.R));assertEquals(996,w.p2.life);assertFalse(p.alive)
    }

    @Test fun creatorHitpauseDoesNotAddToTheProjectilesOwnPause() {
        val w=fight();val p=spawn(w,hits=2,pause=1);w.p1.hitPauseLeft=5
        w.step();assertEquals(1,p.hitPauseLeft)
        w.step();assertEquals(0,p.hitPauseLeft);assertEquals(990,w.p2.life)
        w.step();assertEquals(980,w.p2.life);assertEquals(2,w.p1.hitPauseLeft)
        assertEquals(0,w.p1.timeInState);assertFalse(p.alive)
    }

    @Test fun positiveLifetimeCountsActiveUpdatesAndFinalUpdateCanStillHit() {
        val w=fight();val p=spawn(w,hits=2,remove=false,pause=3,life=2)
        w.step();assertEquals(1,p.ticksLeft);assertEquals(1,p.hitsLeft)
        repeat(3){w.step();assertEquals(1,p.ticksLeft);assertTrue(w.contacts.isEmpty())}
        w.step();assertEquals(980,w.p2.life);assertEquals(0,p.ticksLeft)
        assertEquals(0,p.hitsLeft);assertEquals(0,p.hitPauseLeft);assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun disabledHitRemovalDoesNotDisableStageCleanup() {
        val w=fight();val p=spawn(w,remove=false,vx=10*Fixed.ONE)
        w.configureArena(-100,100,push=false)
        repeat(20){w.step()}
        assertEquals(990,w.p2.life);assertEquals(0,p.hitsLeft)
        assertTrue(w.entities.projectiles.isEmpty());assertFalse(p.alive)
    }

    @Test fun frozenProjectileDefersBoundsChecksUntilItCanAdvance() {
        val w=fight();w.p1.posX=80*Fixed.ONE;w.p2.posX=90*Fixed.ONE
        val p=spawn(w,hits=2,pause=2,vx=Fixed.ONE)
        w.step();assertEquals(2,p.hitPauseLeft)
        w.configureArena(-20,20,push=false)
        repeat(2){w.step();assertTrue(p.alive);assertEquals(81*Fixed.ONE,p.x)}
        w.step();assertFalse(p.alive);assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun delayAgesWhileNoHurtboxOverlapsRatherThanWaitingForASecondCollision() {
        val w=fight();val p=spawn(w,hits=2,miss=3)
        w.step();w.p2.posX=200*Fixed.ONE
        repeat(3){w.step()};assertEquals(0,p.missTimeLeft);assertEquals(1,p.hitsLeft)
        w.p2.posX=20*Fixed.ONE;w.step()
        assertEquals(980,w.p2.life);assertFalse(p.alive)
    }

    @Test fun sameIdProjectilesHaveIndependentAllowancesAndClocks() {
        val w=fight();val first=spawn(w,hits=2,miss=3,pause=2)
        w.step();val second=spawn(w,hits=3,miss=1)
        w.step();assertEquals(980,w.p2.life)
        assertEquals(1,first.hitsLeft);assertEquals(2,second.hitsLeft)
        assertEquals(1,first.hitPauseLeft);assertEquals(0,second.hitPauseLeft)
        assertEquals(3,first.missTimeLeft);assertEquals(1,second.missTimeLeft)
        assertNotEquals(first.entityId,second.entityId);assertEquals(first.projectileId,second.projectileId)
    }

    @Test fun helperShotKeepsItsOwnAllowanceAndDoesNotPauseTheRoot() {
        val w=fight()
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,0,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        val p=spawn(w,hits=2,pause=1,owner=helper)
        w.step();w.step();w.step()
        assertEquals(980,w.p2.life);assertFalse(p.alive)
        assertEquals(0,w.p1.hitPauseLeft);assertEquals(0,helper.hitPauseLeft)
        assertEquals(1,helper.targets(71).size);assertEquals(0,w.p1.targets().size)
    }

    @Test fun capturedExpressionsAndIntegerAllowancesDoNotScaleWithLocalcoord() {
        val w=fight(source("projhits=var(0)\nprojmisstime=ifelse(var(1),2,4)\nprojremove=var(2)\nvelocity=2,0"),width=640)
        w.p1.vars[0]=3;w.p1.vars[1]=1;w.p1.vars[2]=0;w.step()
        val p=w.entities.projectiles.single()
        w.p1.vars[0]=30;w.p1.vars[1]=0;w.p1.vars[2]=1
        assertEquals(3,p.hitsLeft);assertEquals(2,p.missTime);assertFalse(p.removeOnHit)
        assertEquals(Fixed.ONE,p.vx)
        repeat(5){w.step()}
        assertEquals(970,w.p2.life);assertEquals(0,p.hitsLeft);assertTrue(p.alive)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun invalidAuthoredAllowancesNeverQueuePartialEntities() {
        for(params in listOf("projhits=-1","projmisstime=-1","projhits=unknown",
            "projmisstime=1/0","projremove=unknown","projhits=2147483648","projmisstime=2147483648")) {
            val w=fight(source(params));w.step()
            assertTrue(w.entities.projectiles.isEmpty(),params)
            assertTrue(w.issues.any { it.startsWith("Invalid Projectile:") },params)
        }
    }

    @Test fun invalidRequestsDoNotConsumeTheRemainingResourceSlot() {
        val w=fight();w.entities.maxProjectiles=1
        val request=EntityRequest.Projectile(w.p1,7,200,0,0,0,0,-1,HitDefinition())
        w.entities.add(listOf(request.copy(hits=-1),request.copy(missTime=-1),request),w.issues)
        assertEquals(1,w.entities.projectiles.size)
        assertTrue(w.issues.any { it.startsWith("Invalid Projectile") })
        assertFalse(w.issues.any { it.contains("resource limit") })
    }

    @Test fun largeFiniteAllowancesAreNotArtificiallyClamped() {
        val w=fight(source("projhits=5000\nprojmisstime=5000"));w.step()
        val p=w.entities.projectiles.single();w.step()
        assertEquals(4999,p.hitsLeft);assertEquals(5000,p.missTimeLeft)
        repeat(10){w.step()};assertEquals(4999,p.hitsLeft);assertEquals(4990,p.missTimeLeft)
    }

    @Test fun repeatedContactsKeepOneTargetCapturePerVictimAndHitId() {
        val w=fight();spawn(w,hits=4)
        repeat(4){w.step();assertEquals(1,w.p1.targets(71).size)}
        assertEquals(960,w.p2.life);assertSame(w.p2,w.p1.targets(71).single())
        assertFalse(w.p1.moveContact);assertFalse(w.p1.moveHit)
    }

    @Test fun deadTargetCannotSpendTheRemainingProjectileAllowance() {
        val w=fight();val p=spawn(w,hits=3,remove=false,hit=HitDefinition(damage=1000))
        w.step();assertEquals(0,w.p2.life);assertEquals(2,p.hitsLeft)
        repeat(8){w.step();assertTrue(w.contacts.isEmpty())}
        assertEquals(2,p.hitsLeft);assertTrue(p.alive)
    }

    @Test fun presentationAndSkippedDrawsCannotAdvanceOrRearmContactClocks() {
        fun replay(render: Boolean): List<String> {
            val w=fight();val p=spawn(w,hits=4,remove=false,miss=3,pause=2,life=30,vx=Fixed.ONE)
            return (0 until 45).map {
                w.step()
                if(render)repeat(3){CorePresentationPlanner.snapshot(w,12)}
                "${w.checksum()}:${p.x}:${p.vx}:${p.hitsLeft}:${p.missTimeLeft}:${p.hitPauseLeft}:${p.ticksLeft}:${p.action.index}:${p.action.tick}"
            }
        }
        assertEquals(replay(false),replay(true))
    }
}
