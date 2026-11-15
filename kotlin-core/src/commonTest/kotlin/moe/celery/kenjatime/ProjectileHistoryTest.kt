package moe.celery.kenjatime

import kotlin.test.*

/** Authored feedback contracts; native pause/contact-phase parity is unverified. */
class ProjectileHistoryTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nctrl=1\nanim=0"
    private val air="""
        [Begin Action 0]
        Clsn2Default:1
        Clsn2[0]=-10,-40,10,0
        0,0,0,0,-1
        [Begin Action 200]
        Clsn1Default:1
        Clsn1[0]=-10,-40,30,0
        Clsn2Default:1
        Clsn2[0]=-10,-40,10,0
        200,0,0,0,-1
        [Begin Action 201]
        Clsn1Default:1
        Clsn1[0]=-10,-40,30,0
        201,0,0,0,-1
    """.trimIndent()
    private fun fight(extra: String="",width: Int=320): DeterministicFight {
        val owner=FighterDefinition.fromScript("history",air,"$idle\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
        val target=FighterDefinition.fromScript("target",air,idle)
        return DeterministicFight(FightingCharacter(owner,1),FightingCharacter(target,2)).also {
            it.p2.posX=20*Fixed.ONE;it.p2.facingRight=false
        }
    }
    private fun value(text: String,f: FightingCharacter): Double =
        assertNotNull(CoreExpression.number(text,f,f.world!!.issues),text)
    private fun source(params: String="")="[State 0, fire]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nprojid=7\ndamage=10,2\n$params"
    private fun spawn(w: DeterministicFight,id: Int=7,owner: FightingCharacter=w.p1,x: Int=0,
                      hits: Int=1,miss: Int=0,priority: Int=1,life: Int=-1,speed: Int=0,anim: Int=200,
                      hit: HitDefinition=HitDefinition(damage=10,guardDamage=2,guardFlag="HL",defenderPause=0)):
        CoreProjectile {
        val offset=(x*Fixed.ONE-owner.posX)*(if(owner.facingRight)1 else -1)
        w.entities.add(listOf(EntityRequest.Projectile(owner,id,anim,offset,0,speed*Fixed.ONE,0,life,hit,
            hits=hits,missTime=miss,priority=priority)),w.issues)
        return w.entities.projectiles.last()
    }
    private fun command(type: String,params: String)=MugenCnsParser.parse(
        "[Statedef 0]\n[State 0, command]\ntype=$type\ntrigger1=1\n$params").getValue(0).controllers.single()

    @Test fun noEventUsesMinusOneTimersAndFalseOneTickFlags() {
        val w=fight()
        for(name in listOf("Hit","Contact","Guarded","Cancel"))assertEquals(-1.0,value("Proj${name}Time(0)",w.p1))
        for(name in listOf("Hit","Contact","Guarded")) {
            assertEquals(0.0,value("Proj$name(7)",w.p1))
            assertEquals(1.0,value("Proj${name}7 = 0",w.p1))
        }
        assertTrue(w.p1.projectileHistory.snapshot().isEmpty());assertTrue(w.issues.isEmpty())
    }

    @Test fun hitFeedbackOutlivesTheProjectileAndUsesTheCompletedTickAge() {
        val w=fight();spawn(w);w.step()
        assertTrue(w.entities.projectiles.isEmpty());assertEquals(990,w.p2.life)
        assertEquals(1.0,value("ProjHitTime(7)",w.p1));assertEquals(1.0,value("ProjContactTime(7)",w.p1))
        assertEquals(-1.0,value("ProjGuardedTime(7)",w.p1));assertEquals(-1.0,value("ProjCancelTime(7)",w.p1))
        repeat(10){w.step()};assertEquals(11.0,value("ProjHitTime(7)",w.p1))
        assertEquals(1,w.p1.projectileHistory.snapshot().size)
    }

    @Test fun guardFeedbackIsAContactWithoutBeingAHit() {
        val w=fight();spawn(w);w.step(b=InputFrame(Directions.R))
        assertEquals(998,w.p2.life);assertEquals(1.0,value("ProjGuardedTime(7)",w.p1))
        assertEquals(1.0,value("ProjContactTime(7)",w.p1));assertEquals(-1.0,value("ProjHitTime(7)",w.p1))
        assertEquals(1.0,value("ProjGuarded7 = 1",w.p1));assertEquals(1.0,value("ProjContact7 = 1",w.p1))
        assertEquals(0.0,value("ProjHit7 = 1",w.p1));assertTrue(w.p1.targets().isEmpty())
    }

    @Test fun cancellationIsRecordedOnlyForTheCancelledShots() {
        val w=fight();w.p1.posX=-100*Fixed.ONE;w.p2.posX=100*Fixed.ONE
        spawn(w,id=17,priority=3);spawn(w,id=27,owner=w.p2)
        w.step();assertEquals(-1.0,value("ProjCancelTime(17)",w.p1))
        assertEquals(1.0,value("ProjCancelTime(27)",w.p2));assertEquals(-1.0,value("ProjContactTime(0)",w.p2))
        assertEquals(0.0,value("ProjContact(0)",w.p2));assertTrue(w.contacts.isEmpty())
    }

    @Test fun survivingMultiHitClashesDoNotRecordCancellationUntilExhaustion() {
        val w=fight();w.p1.posX=-100*Fixed.ONE;w.p2.posX=100*Fixed.ONE
        spawn(w,priority=4);spawn(w,id=8,owner=w.p2,hits=2)
        w.step();assertEquals(-1.0,value("ProjCancelTime(8)",w.p2))
        w.step();assertEquals(1.0,value("ProjCancelTime(8)",w.p2));assertEquals(1,w.p2.projectileHistory.snapshot().size)
    }

    @Test fun timeFunctionsDescribeOnlyTheLatestOverallContactTypeAndId() {
        val w=fight();spawn(w,id=7);w.step()
        w.p2.changeState(0);spawn(w,id=8);w.step(b=InputFrame(Directions.R))
        assertEquals(-1.0,value("ProjHitTime(7)",w.p1));assertEquals(-1.0,value("ProjContactTime(7)",w.p1))
        assertEquals(1.0,value("ProjGuardedTime(8)",w.p1));assertEquals(1.0,value("ProjContactTime(0)",w.p1))
        // Legacy windows still find the older matching hit, not just the last event.
        assertEquals(1.0,value("ProjHit7 = 1, < 5",w.p1));assertEquals(1.0,value("ProjContact7 = 1, 2",w.p1))
    }

    @Test fun latestCancellationSuppressesEarlierTimeQueriesButPreservesLegacyWindows() {
        val w=fight();spawn(w);w.step()
        w.p1.posX=-100*Fixed.ONE;w.p2.posX=100*Fixed.ONE
        spawn(w,id=9);spawn(w,id=19,owner=w.p2);w.step()
        assertEquals(-1.0,value("ProjHitTime(7)",w.p1));assertEquals(-1.0,value("ProjContactTime(0)",w.p1))
        assertEquals(1.0,value("ProjCancelTime(9)",w.p1));assertEquals(1.0,value("ProjHit7 = 1, 2",w.p1))
    }

    @Test fun zeroAndNegativeQueryIdsSelectAnyProjectileWithoutScalingTheId() {
        val w=fight(width=1008);spawn(w,id=1008,x=20);w.step()
        for(id in listOf("1008","0","-1","-2147483648","var(0)+1008"))
            assertEquals(1.0,value("ProjHitTime($id)",w.p1),id)
        assertEquals(-1.0,value("ProjHitTime(320)",w.p1));assertEquals(1.0,value("ProjHit0 = 1",w.p1))
    }

    @Test fun samePhaseClashThenFighterContactMakesTheLaterHitTheLatestEvent() {
        val w=fight();w.p1.posX=-100*Fixed.ONE;w.p2.posX=100*Fixed.ONE
        spawn(w,id=7);spawn(w,id=8,owner=w.p2);spawn(w,id=9,x=100,anim=201)
        w.step()
        assertEquals(listOf(ProjectileContactKind.CANCEL,ProjectileContactKind.HIT),w.p1.projectileHistory.snapshot().map { it.kind })
        assertEquals(-1.0,value("ProjCancelTime(7)",w.p1));assertEquals(1.0,value("ProjHitTime(9)",w.p1))
        assertEquals(1.0,value("ProjContact9 = 1",w.p1));assertEquals(990,w.p2.life)
    }

    @Test fun samePhaseGuardAndHitKeepBothLegacyFlagsButOnlyTheLastTimeType() {
        val w=fight();spawn(w,id=7,anim=201)
        spawn(w,id=8,anim=201,hit=HitDefinition(damage=10,guardFlag=""))
        w.step(b=InputFrame(Directions.R))
        assertEquals(listOf(7,8),w.p1.projectileHistory.snapshot().map { it.id })
        assertEquals(1.0,value("ProjGuarded7 = 1",w.p1));assertEquals(1.0,value("ProjHit8 = 1",w.p1))
        assertEquals(-1.0,value("ProjGuardedTime(7)",w.p1));assertEquals(1.0,value("ProjHitTime(8)",w.p1))
    }

    @Test fun legacyDefaultFlagIsVisibleForOneFollowingControllerPhase() {
        val w=fight(source()+"\n[State 0, count]\ntype=VarAdd\ntrigger1=ProjHit7 = 1\nv=0\nvalue=1")
        w.step();assertEquals(0,w.p1.vars[0])
        w.step();assertEquals(0,w.p1.vars[0]);assertEquals(1.0,value("ProjHit(7)",w.p1))
        w.step();assertEquals(1,w.p1.vars[0]);assertEquals(0.0,value("ProjHit7 = 1",w.p1))
        repeat(5){w.step()};assertEquals(1,w.p1.vars[0])
    }

    @Test fun authoredFeedbackCanEnterAFollowUpAfterTheShotDisappears() {
        val w=fight(source()+"""

            [State 0, follow]
            type=ChangeState
            trigger1=ProjContact7 = 1
            value=800
            [Statedef 800]
            type=S
            physics=N
            anim=0
        """.trimIndent())
        w.step();w.step();assertTrue(w.entities.projectiles.isEmpty());assertEquals(0,w.p1.stateNo)
        w.step();assertEquals(800,w.p1.stateNo);assertEquals(2.0,value("ProjHitTime(7)",w.p1))
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun multihitRefreshesOneRecordAndTriggersOnceForEachAcceptedHit() {
        val w=fight(source("projhits=3\nprojmisstime=3")+
            "\n[State 0, count]\ntype=VarAdd\ntrigger1=ProjHit7 = 1\nv=0\nvalue=1")
        repeat(10){w.step()}
        assertEquals(970,w.p2.life);assertEquals(3,w.p1.vars[0])
        assertEquals(1,w.p1.projectileHistory.snapshot().size);assertEquals(3.0,value("ProjHitTime(7)",w.p1))
    }

    @Test fun legacyComparisonsSupportEveryTimeOperatorAndNeverTreatMinusOneAsAnEvent() {
        val w=fight();spawn(w);w.step();w.step()
        for(clause in listOf("2","= 2","== 2","!= 1","<> 1","< 3","<= 2","> 1",">= 2"))
            assertEquals(1.0,value("ProjHit7 = 1, $clause",w.p1),clause)
        assertEquals(1.0,value("ProjContact7 = 0, < 2",w.p1))
        for(op in listOf("=","!=","<>","<","<=",">",">=")) {
            assertEquals(0.0,value("ProjHit999 = 1, $op 10",w.p1),op)
            assertEquals(1.0,value("ProjHit999 = 0, $op 10",w.p1),op)
        }
    }

    @Test fun dynamicClausesNestedFunctionsAndBooleanPrecedenceRemainWhole() {
        val w=fight();spawn(w);w.step();w.step();w.p1.vars[0]=1;w.p1.vars[1]=2
        for(text in listOf("pRoJhIt7 = var(0), <= var(1)","ProjContact = 1, < max(2,3)",
            "!(ProjHit7 = 0, < 5)","ifelse((ProjHit7 = 1, 2), 9, 0) = 9",
            "0 || ((ProjHit7 = 1, > 1) && Time > 0)","ProjHitTime(7) = [1,3]"))
            assertEquals(1.0,value(text,w.p1),text)
        assertEquals(0.0,value("ProjHit7 = 1 && ProjContact7 = 0",w.p1))
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun parenthesizedAliasesUseTheMatchingHistoryAndOptionalWildcardId() {
        val w=fight();spawn(w);w.step()
        for(text in listOf("ProjHit()","ProjHit(7)","ProjContact()","ProjContact(-1)"))assertEquals(1.0,value(text,w.p1))
        assertEquals(0.0,value("ProjGuarded()",w.p1));assertEquals(0.0,value("ProjHit(8)",w.p1))
        w.step();assertEquals(0.0,value("ProjHit(7)",w.p1))
    }

    @Test fun malformedTriggersFailClosedInsteadOfChangingAuthoredState() {
        val w=fight();spawn(w);w.step()
        for(text in listOf("ProjHitTime()","ProjHitTime(1,2)","ProjContactTime(1/0)",
            "ProjGuardedTime(unknown)","ProjHitTime(\"bad\")","ProjHitTime(2147483648)",
            "ProjHit7 = 1,","ProjHit2147483648 = 1","ProjHit7 = unknown",
            "ProjHit7 = 1, < 1/0","ProjHit7 = 1, < \"bad\"","ProjHit(1,2)","ProjHitTime")) {
            val issues=linkedSetOf<String>()
            assertNull(CoreExpression.number(text,w.p1,issues),text)
            assertTrue(issues.any { it.startsWith("Unsupported expression:") },text)
        }
        val guarded=fight("[State 0, invalid]\ntype=ChangeState\ntrigger1=ProjHit7 = 1, < unknown\nvalue=800\n[Statedef 800]\nanim=0")
        guarded.step();assertEquals(0,guarded.p1.stateNo)
    }

    @Test fun rejectedFiltersAndOverrideProtectionDoNotCreateFeedback() {
        val filtered=fight();filtered.p2.hitFilters.execute(filtered.p2,command("NotHitBy","value=SCA\ntime=-1"),filtered.issues)
        spawn(filtered);repeat(3){filtered.step()}
        assertEquals(1000,filtered.p2.life);assertEquals(-1.0,value("ProjContactTime(0)",filtered.p1))
        assertTrue(filtered.p1.projectileHistory.snapshot().isEmpty())
        val overridden=fight();overridden.p2.hitOverrides.execute(overridden.p2,
            command("HitOverride","attr=SCA,AP\nstateno=0\ntime=-1"),overridden.issues)
        spawn(overridden,hit=HitDefinition(attr="S,SP",damage=10,p2State=900))
        overridden.step();assertTrue(overridden.p1.projectileHistory.snapshot().isEmpty())
    }

    @Test fun expiryStageRemovalAndMissesAreNotCancellationsOrContacts() {
        val w=fight();w.p2.posX=500*Fixed.ONE;spawn(w,life=1);w.step()
        assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.p1.projectileHistory.snapshot().isEmpty())
        w.configureArena(-100,100,push=false);spawn(w,x=141,speed=1);w.step()
        assertTrue(w.entities.projectiles.isEmpty());assertEquals(-1.0,value("ProjCancelTime(0)",w.p1))
    }

    @Test fun actorHitpauseDoesNotStopWorldAgeAndIgnoreHitpauseCanReadTheFlag() {
        val w=fight(source()+"\n[State 0, count while paused]\ntype=VarAdd\ntrigger1=ProjHit7 = 1\nignorehitpause=1\nv=0\nvalue=1")
        w.step();w.step();w.p1.hitPauseLeft=5
        repeat(5){w.step()}
        assertEquals(1,w.p1.vars[0]);assertEquals(6.0,value("ProjHitTime(7)",w.p1))
    }

    @Test fun stateAndForeignBankChangesRetainTheExecutingActorsHistory() {
        val w=fight("[Statedef 800]\nanim=0\nphysics=N")
        spawn(w);w.step();w.p1.enterAuthoredState(800,w.p1,w.issues)
        assertEquals(1.0,value("ProjHitTime(7)",w.p1))
        w.p2.enterAuthoredState(800,w.p1,w.issues)
        assertEquals(-1.0,value("ProjHitTime(7)",w.p2));assertSame(w.p1,w.p2.stateOwner)
        assertEquals(1.0,value("ProjHitTime(7)",w.p1))
    }

    @Test fun helperShotHistoryStaysWithItsCurrentCreatorWithoutSharingRootStorage() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p1,9,0,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        spawn(w,id=17,owner=helper);w.step()
        assertEquals(1.0,value("ProjHitTime(17)",helper));assertEquals(-1.0,value("ProjHitTime(0)",w.p1))
        assertTrue(w.p1.projectileHistory.snapshot().isEmpty());assertEquals(1,helper.projectileHistory.snapshot().size)
    }

    @Test fun opposingRootsAndNewFightsKeepIndependentHistories() {
        val w=fight();spawn(w,id=17,anim=201,x=20);spawn(w,id=27,owner=w.p2,anim=201)
        w.step();assertEquals(990,w.p1.life);assertEquals(990,w.p2.life)
        assertEquals(1.0,value("ProjHitTime(17)",w.p1));assertEquals(-1.0,value("ProjHitTime(27)",w.p1))
        assertEquals(1.0,value("ProjHitTime(27)",w.p2));assertEquals(-1.0,value("ProjHitTime(17)",w.p2))
        val other=fight();assertTrue(other.p1.projectileHistory.snapshot().isEmpty())
    }

    @Test fun everyDistinctIdKindRetainsOnlyItsLatestRecordAndRecencyOrder() {
        val h=CoreProjectileHistory();val issues=linkedSetOf<String>()
        h.record(7,ProjectileContactKind.HIT,0,issues);h.record(7,ProjectileContactKind.GUARDED,1,issues)
        h.record(8,ProjectileContactKind.HIT,2,issues);h.record(7,ProjectileContactKind.HIT,3,issues)
        assertEquals(listOf(7,8,7),h.snapshot().map { it.id })
        assertEquals(listOf(1L,2L,3L),h.snapshot().map { it.tick })
        assertEquals(3,h.snapshot().size);assertEquals(2L,h.latestAge(ProjectileContactKind.HIT,8,4))
        assertEquals(-1L,h.time(ProjectileContactKind.HIT,8,4));assertEquals(1L,h.time(null,0,4))
    }

    @Test fun repeatedSameIdContactsDoNotConsumeNewHistorySlots() {
        val h=CoreProjectileHistory();val issues=linkedSetOf<String>()
        repeat(5000){h.record(7,ProjectileContactKind.HIT,it.toLong(),issues)}
        assertEquals(1,h.snapshot().size);assertEquals(1L,h.time(ProjectileContactKind.HIT,7,5000))
        assertTrue(issues.isEmpty())
    }

    @Test fun distinctIdsEvictOldestRecordsAtTheBoundAndDiagnoseOnce() {
        val h=CoreProjectileHistory();val issues=linkedSetOf<String>()
        for(i in 1..CoreProjectileHistory.LIMIT+3)h.record(i,ProjectileContactKind.HIT,i.toLong(),issues)
        assertEquals(CoreProjectileHistory.LIMIT,h.snapshot().size);assertEquals(4,h.snapshot().first().id)
        assertEquals(-1L,h.latestAge(ProjectileContactKind.HIT,1,10000))
        assertEquals(1,issues.size);assertTrue(issues.single().contains("resource limit"))
    }

    @Test fun evictingTheLastRecordOfAKindCannotLeaveAStaleWildcardFlag() {
        for(kind in listOf(ProjectileContactKind.HIT,ProjectileContactKind.GUARDED)) {
            val h=CoreProjectileHistory();val issues=linkedSetOf<String>()
            h.record(1,kind,0,issues)
            for(i in 1..CoreProjectileHistory.LIMIT)h.record(i+1,ProjectileContactKind.CANCEL,i.toLong(),issues)
            assertEquals(-1L,h.latestAge(kind,0,10000));assertEquals(-1L,h.latestAge(null,0,10000))
            assertEquals(CoreProjectileHistory.LIMIT,h.snapshot().size)
        }
    }

    @Test fun longWorldAgesDoNotWrapAtTheIntegerBoundary() {
        val h=CoreProjectileHistory();h.record(7,ProjectileContactKind.HIT,0,linkedSetOf())
        assertEquals(2147483648L,h.time(ProjectileContactKind.HIT,7,2147483648L))
        assertEquals(-1L,h.time(ProjectileContactKind.GUARDED,7,2147483648L))
    }

    @Test fun snapshotsRenderingAndSkippedDrawsDoNotAgeOrRewriteHistory() {
        fun replay(render: Boolean): List<String> {
            val w=fight(source("projhits=3\nprojmisstime=3"))
            return (0 until 20).map {
                w.step()
                val history=w.p1.projectileHistory.snapshot()
                if(render)repeat(4) {
                    CorePresentationPlanner.snapshot(w,12)
                    assertEquals(history,w.p1.projectileHistory.snapshot())
                }
                "${w.checksum()}:$history:${value("ProjHitTime(0)",w.p1)}:${value("ProjHit7 = 1, < 5",w.p1)}"
            }
        }
        assertEquals(replay(false),replay(true))
    }
}
