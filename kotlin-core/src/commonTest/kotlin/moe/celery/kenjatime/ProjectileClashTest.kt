package moe.celery.kenjatime

import kotlin.test.*

/** Shared-phase clash contracts; native cancellation-chain timing is unverified. */
class ProjectileClashTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nctrl=1\nanim=0"
    private val air="""
        [Begin Action 0]
        Clsn2Default:1
        Clsn2[0]=-10,-40,10,0
        0,0,0,0,-1
        [Begin Action 200]
        Clsn1Default:1
        Clsn1[0]=-10,-20,10,0
        Clsn2Default:1
        Clsn2[0]=-10,-20,10,0
        200,0,0,0,2
        200,1,0,0,3
        [Begin Action 201]
        Clsn1Default:1
        Clsn1[0]=-10,-20,10,0
        201,0,0,0,-1
        [Begin Action 202]
        Clsn1Default:1
        Clsn1[0]=100,-20,120,0
        Clsn2Default:1
        Clsn2[0]=-10,-20,10,0
        202,0,0,0,-1
        [Begin Action 203]
        Clsn2Default:2
        Clsn2[0]=-30,-20,-20,0
        Clsn2[1]=20,-20,30,0
        203,0,0,0,-1
        [Begin Action 204]
        Clsn2Default:1
        Clsn2[0]=-5,-20,5,0
        204,0,0,0,-1
        [Begin Action 205]
        205,0,0,0,1
        Clsn2Default:1
        Clsn2[0]=-10,-20,10,0
        205,1,0,0,-1
        [Begin Action 206]
        Clsn2Default:1
        Clsn2[0]=0,-20,20,0
        206,0,0,0,-1
        [Begin Action 207]
        Clsn2Default:2
        Clsn2[0]=-10,-20,10,0
        Clsn2[1]=-5,-15,5,0
        207,0,0,0,-1
    """.trimIndent()
    private fun fight(one: String="",two: String="",width: Int=320): DeterministicFight {
        val a=FighterDefinition.fromScript("left",air,"$idle\n$one",defText="[Info]\nlocalcoord=$width,${width*3/4}")
        val b=FighterDefinition.fromScript("right",air,"$idle\n$two")
        return DeterministicFight(FightingCharacter(a,1),FightingCharacter(b,2)).also {
            it.p1.posX=-100*Fixed.ONE;it.p2.posX=100*Fixed.ONE;it.p2.facingRight=false
        }
    }
    private fun source(params: String)="[State 0, fire]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n$params"
    private fun spawn(w: DeterministicFight,owner: FightingCharacter=w.p1,x: Int=0,y: Int=0,
                      speed: Int=0,priority: Int=1,hits: Int=1,pause: Int=0,miss: Int=0,
                      remove: Boolean=true,life: Int=-1,anim: Int=200,
                      hit: HitDefinition=HitDefinition(damage=10,hitPause=pause,defenderPause=0)):
        CoreProjectile {
        val offset=(x*Fixed.ONE-owner.posX)*(if(owner.facingRight)1 else -1)
        w.entities.add(listOf(EntityRequest.Projectile(owner,7,anim,offset,y*Fixed.ONE-owner.posY,
            speed*Fixed.ONE,0,life,hit,priority=priority,hits=hits,missTime=miss,removeOnHit=remove)),w.issues)
        return w.entities.projectiles.last()
    }

    @Test fun equalDefaultPriorityShotsCancelWithoutDamagingOrCapturingFighters() {
        val w=fight();w.p1.posX=0;w.p2.posX=0
        val a=spawn(w);val b=spawn(w,w.p2)
        w.step()
        assertTrue(a.cancelled);assertTrue(b.cancelled);assertEquals(0,a.hitsLeft);assertEquals(0,b.hitsLeft)
        assertTrue(w.entities.projectiles.isEmpty());assertEquals(1000,w.p1.life);assertEquals(1000,w.p2.life)
        assertTrue(w.contacts.isEmpty());assertTrue(w.p1.targets().isEmpty());assertTrue(w.p2.targets().isEmpty())
        assertFalse(w.p1.moveContact);assertFalse(w.p2.moveHit)
        assertEquals(listOf(ProjectileClash(a.entityId,b.entityId,true,true)),w.entities.clashes)
    }

    @Test fun higherPrioritySpendsOnePriorityWithoutSpendingAHit() {
        for(reverse in listOf(false,true)) {
            val w=fight()
            val weak=if(reverse)spawn(w,w.p2)else null
            val strong=spawn(w,priority=3)
            val other=weak ?: spawn(w,w.p2)
            w.step()
            assertTrue(strong.alive);assertFalse(strong.cancelled);assertEquals(2,strong.priority)
            assertEquals(1,strong.hitsLeft);assertTrue(other.cancelled)
            assertEquals(1,w.entities.projectiles.size);assertEquals(1,w.entities.clashes.size)
        }
    }

    @Test fun projectilePriorityIsIndependentOfHitDefPriority() {
        val w=fight()
        val a=spawn(w,priority=2,hit=HitDefinition(priority=99))
        val b=spawn(w,w.p2,priority=3,hit=HitDefinition(priority=1))
        w.step();assertTrue(a.cancelled);assertTrue(b.alive);assertEquals(2,b.priority)
    }

    @Test fun multipleHitAllowancesAbsorbEqualPriorityClashesOnePerPair() {
        val w=fight();val a=spawn(w,hits=3,anim=207);val b=spawn(w,w.p2,hits=3,anim=207)
        w.step();assertEquals(2,a.hitsLeft);assertEquals(2,b.hitsLeft)
        assertEquals(1,w.entities.clashes.size);assertTrue(a.alive);assertTrue(b.alive)
        w.step();assertEquals(1,a.hitsLeft);assertEquals(1,b.hitsLeft)
        w.step();assertTrue(a.cancelled);assertTrue(b.cancelled);assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun lowerPriorityMultiHitShotSpendsHitsBeforeCancellation() {
        val w=fight();val strong=spawn(w,priority=5);val weak=spawn(w,w.p2,hits=2)
        w.step();assertEquals(4,strong.priority);assertEquals(1,weak.hitsLeft);assertTrue(weak.alive)
        w.step();assertEquals(3,strong.priority);assertTrue(weak.cancelled);assertEquals(1,strong.hitsLeft)
    }

    @Test fun disablingHitRemovalDoesNotPreventCancellation() {
        val w=fight();val a=spawn(w,remove=false);val b=spawn(w,w.p2,remove=false)
        w.step();assertTrue(a.cancelled);assertTrue(b.cancelled);assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun friendlyShotsIncludingDistinctHelpersNeverClash() {
        val w=fight()
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,0,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor
        val shots=listOf(spawn(w),spawn(w),spawn(w,h))
        w.step();assertTrue(w.entities.clashes.isEmpty());assertTrue(shots.all { it.alive && it.hitsLeft == 1 })
    }

    @Test fun helperShotCanClashWithTheOpposingRootShot() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p1,9,0,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor
        val a=spawn(w,h);val b=spawn(w,w.p2)
        w.step();assertTrue(a.cancelled);assertTrue(b.cancelled);assertEquals(1,w.entities.clashes.size)
        assertEquals(1000,h.life);assertEquals(0,h.hitPauseLeft)
    }

    @Test fun clsn1OnlyProjectilesCannotCancelEachOther() {
        val w=fight();val a=spawn(w,anim=201);val b=spawn(w,w.p2,anim=201)
        w.step();assertTrue(a.alive);assertTrue(b.alive);assertTrue(w.entities.clashes.isEmpty())
    }

    @Test fun cancellationUsesClsn2EvenWhenAttackBoxesDoNotOverlap() {
        val w=fight();val a=spawn(w,anim=202);val b=spawn(w,w.p2,anim=202)
        assertFalse(a.hitBoxes().any { x -> b.hitBoxes().any(x::intersects) })
        w.step();assertTrue(a.cancelled);assertTrue(b.cancelled);assertTrue(w.contacts.isEmpty())
    }

    @Test fun separatedOrOnlyTouchingBoxesDoNotClash() {
        for(position in listOf(20,21,500)) {
            val w=fight();val a=spawn(w);val b=spawn(w,w.p2,x=position)
            w.step();assertTrue(a.alive);assertTrue(b.alive);assertTrue(w.entities.clashes.isEmpty())
        }
    }

    @Test fun broadphaseBoundsDoNotFillTheGapsBetweenActualBoxes() {
        val w=fight();val a=spawn(w,anim=203);val b=spawn(w,w.p2,anim=204)
        w.step();assertTrue(a.alive);assertTrue(b.alive);assertTrue(w.entities.clashes.isEmpty())
    }

    @Test fun launchFacingAndLocalcoordControlClashGeometry() {
        val mirrored=fight();mirrored.p1.facingRight=false
        val a=spawn(mirrored,anim=206);val b=spawn(mirrored,mirrored.p2,x=-15,anim=204)
        mirrored.p1.facingRight=true
        mirrored.step();assertTrue(a.cancelled);assertTrue(b.cancelled)
        for(x in listOf(14,15)) {
            val w=fight(width=640);val high=spawn(w);val low=spawn(w,w.p2,x=x)
            w.step();assertEquals(x==14,high.cancelled);assertEquals(x==14,low.cancelled)
        }
    }

    @Test fun authoredPriorityExpressionsAreCapturedAndDimensionless() {
        val w=fight(source("offset=200,0\nprojpriority=ifelse(var(0),3,1)"),source("offset=100,0"),width=640)
        w.p1.vars[0]=1;w.step()
        val strong=w.entities.projectiles.first();assertEquals(3,strong.priority)
        w.p1.vars[0]=0;w.step()
        assertEquals(2,strong.priority);assertEquals(1,w.entities.projectiles.size)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun invalidPrioritiesNeverQueuePartialEntitiesOrConsumeSlots() {
        for(value in listOf("0","-1","unknown","1/0","2147483648")) {
            val w=fight(source("projpriority=$value"));w.step()
            assertTrue(w.entities.projectiles.isEmpty(),value)
            assertTrue(w.issues.any { it.startsWith("Invalid Projectile:") },value)
        }
        val w=fight();w.entities.maxProjectiles=1
        val request=EntityRequest.Projectile(w.p1,1,200,0,0,0,0,-1,HitDefinition())
        w.entities.add(listOf(request.copy(priority=0),request),w.issues)
        assertEquals(1,w.entities.projectiles.size);assertFalse(w.issues.any { it.contains("resource limit") })
    }

    @Test fun maximumPriorityDoesNotOverflowOrGetArtificiallyClamped() {
        val w=fight();val a=spawn(w,priority=Int.MAX_VALUE);spawn(w,w.p2)
        w.step();assertEquals(Int.MAX_VALUE-1,a.priority);assertEquals(1,a.hitsLeft)
    }

    @Test fun everyProjectileMovesBeforeClashGeometryIsCaptured() {
        for(reverse in listOf(false,true)) {
            val w=fight();val a=spawn(w,x=-11,speed=2);val b=spawn(w,w.p2,x=11,speed=2)
            if(reverse)w.entities.projectiles.reverse()
            w.step();assertTrue(a.cancelled);assertTrue(b.cancelled)
            assertEquals(-9*Fixed.ONE,a.x);assertEquals(9*Fixed.ONE,b.x)
        }
    }

    @Test fun updatedAirElementSuppliesClashBoxes() {
        val w=fight();val a=spawn(w,anim=205);val b=spawn(w,w.p2,anim=205)
        assertTrue(a.clashBoxes().isEmpty());assertTrue(b.clashBoxes().isEmpty())
        w.step();assertTrue(a.cancelled);assertTrue(b.cancelled)
    }

    @Test fun survivorWithNoPauseCanHitAFighterAfterClashResolution() {
        val w=fight();w.p1.posX=0;w.p2.posX=0
        val a=spawn(w,priority=3);val b=spawn(w,w.p2)
        w.step();assertEquals(1000,w.p1.life);assertEquals(990,w.p2.life)
        assertFalse(a.cancelled);assertTrue(b.cancelled);assertEquals(a.entityId,w.contacts.single().attacker)
        assertEquals(1,w.p1.targets().size);assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun survivorClashPauseBlocksFighterContactThroughTheLastFrozenTick() {
        val w=fight();w.p1.posX=0;w.p2.posX=0
        val a=spawn(w,priority=3,pause=2);spawn(w,w.p2)
        w.step();assertEquals(2,a.hitPauseLeft);assertEquals(1000,w.p2.life)
        repeat(2){w.step();assertTrue(w.contacts.isEmpty());assertEquals(1000,w.p2.life)}
        w.step();assertEquals(990,w.p2.life);assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun hitpausedShotsCanClashAndCancellationClearsOnlyTheCancelledPause() {
        val w=fight();w.p2.posX=0
        val weak=spawn(w,hits=2,pause=3)
        w.step();assertEquals(1,weak.hitsLeft);assertEquals(3,weak.hitPauseLeft)
        w.p2.posX=100*Fixed.ONE
        val strong=spawn(w,w.p2,priority=3,pause=2)
        w.step();assertTrue(weak.cancelled);assertEquals(0,weak.hitPauseLeft)
        assertTrue(strong.alive);assertEquals(2,strong.hitPauseLeft)
        assertEquals(0,w.p1.hitPauseLeft);assertEquals(0,w.p2.hitPauseLeft)
    }

    @Test fun contactMissDelayDoesNotMakeAProjectileImmuneToClashes() {
        val w=fight();w.p2.posX=0
        val a=spawn(w,hits=2,miss=5);w.step();assertEquals(5,a.missTimeLeft)
        w.p2.posX=100*Fixed.ONE;val b=spawn(w,w.p2)
        w.step();assertTrue(a.cancelled);assertTrue(b.cancelled);assertEquals(4,a.missTimeLeft)
    }

    @Test fun nearestPairResolvesBeforeAFartherShotCreatedEarlier() {
        val w=fight();val a=spawn(w,priority=2)
        val far=spawn(w,w.p2,x=15);val near=spawn(w,w.p2,x=1)
        w.step()
        assertEquals(listOf(near.entityId,far.entityId),w.entities.clashes.map { it.second })
        assertEquals(listOf(false,true),w.entities.clashes.map { it.firstCancelled })
        assertTrue(a.cancelled);assertTrue(near.cancelled);assertTrue(far.cancelled)
    }

    @Test fun equalDistancePairsUseCreationIdsEvenIfTheCollectionIsReordered() {
        for(reverse in listOf(false,true)) {
            val w=fight();val a=spawn(w);val first=spawn(w,w.p2,x=-5);val second=spawn(w,w.p2,x=5)
            if(reverse)w.entities.projectiles.reverse()
            w.step();assertTrue(a.cancelled);assertTrue(first.cancelled);assertTrue(second.alive)
            assertEquals(1,w.entities.clashes.size)
            assertEquals(ProjectileClash(a.entityId,first.entityId,true,true),w.entities.clashes.single())
        }
    }

    @Test fun zeroAndExhaustedHitAllowancesCannotCancelOtherShots() {
        val w=fight();val zero=spawn(w,hits=0);val enemy=spawn(w,w.p2)
        w.step();assertTrue(zero.alive);assertTrue(enemy.alive);assertTrue(w.entities.clashes.isEmpty())
        val used=fight();used.p2.posX=0
        val exhausted=spawn(used,remove=false);used.step();assertEquals(0,exhausted.hitsLeft)
        used.p2.posX=100*Fixed.ONE;val other=spawn(used,used.p2)
        used.step();assertTrue(exhausted.alive);assertTrue(other.alive);assertTrue(used.entities.clashes.isEmpty())
    }

    @Test fun finalLifetimeUpdateCanClashButStageRemovedShotsCannot() {
        val w=fight();val a=spawn(w,life=1);val b=spawn(w,w.p2)
        w.step();assertTrue(a.cancelled);assertTrue(b.cancelled)
        val stage=fight();stage.configureArena(-100,100,push=false)
        val leaving=spawn(stage,x=141,speed=1);val returning=spawn(stage,stage.p2,x=141,speed=1)
        stage.step();assertFalse(leaving.alive);assertFalse(leaving.cancelled);assertTrue(returning.alive)
        assertEquals(140*Fixed.ONE,returning.x);assertTrue(stage.entities.clashes.isEmpty())
    }

    @Test fun newBirthsWaitUntilTheNextProjectilePhaseAndEventsNeverPersistIntoTheNextTick() {
        val w=fight(source("offset=100,0"),source("offset=100,0"))
        w.step();assertEquals(2,w.entities.projectiles.size);assertTrue(w.entities.clashes.isEmpty())
        w.step();assertEquals(1,w.entities.clashes.size);assertTrue(w.entities.projectiles.isEmpty())
        w.enableRoundFlow();w.step();assertTrue(w.entities.clashes.isEmpty())
    }

    @Test fun separatedPairsResolveWithoutInteractingWithOtherClashGroups() {
        val w=fight()
        repeat(16){i->spawn(w,x=i*40,anim=204);spawn(w,w.p2,x=i*40,anim=204)}
        w.step();assertEquals(16,w.entities.clashes.size);assertTrue(w.entities.projectiles.isEmpty())
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun renderingAndSkippedDrawsCannotChangeClashOrderingOrBudgets() {
        fun replay(render: Boolean): List<String> {
            val w=fight();spawn(w,priority=3,hits=4,pause=2,life=30)
            spawn(w,w.p2,x=5,hits=4,pause=1);spawn(w,w.p2,x=-5,hits=2)
            return (0 until 40).map {
                w.step()
                if(render)repeat(3){CorePresentationPlanner.snapshot(w,12)}
                "${w.checksum()}:${w.entities.clashes}:${w.entities.projectiles.map { p ->
                    listOf(p.entityId,p.x,p.priority,p.hitsLeft,p.hitPauseLeft,p.missTimeLeft,p.ticksLeft,p.action.index,p.action.tick) }}"
            }
        }
        assertEquals(replay(false),replay(true))
    }
}
