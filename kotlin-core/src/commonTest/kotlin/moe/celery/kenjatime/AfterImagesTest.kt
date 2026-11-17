package moe.celery.kenjatime

import kotlin.test.*

class AfterImagesTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nanim=0"
    private val air="[Begin Action 0]\n0,0,0,0,2\n0,1,3,-5,2,H\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-50,50,0\n200,0,0,0,-1"
    private fun c(params: String="time=-1\nlength=12\nframegap=3",type: String="AfterImage",trigger: String="Time=0",state: Int=0)=
        "[State $state, trail]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun definition(script: String="",width: Int=320)=FighterDefinition.fromScript("trail",air,"$idle\n$script",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(script: String="",other: String="")=DeterministicFight(FightingCharacter(definition(script),1),FightingCharacter(definition(other),2))
        .also {it.p2.posX=200*256}
    private fun execute(a: FightingCharacter,params: String="time=-1\nlength=12\nframegap=3",type: String="AfterImage") {
        val ctl=MugenCnsParser.parse("$idle\n${c(params,type)}").getValue(0).controllers.single()
        CoreAfterImages.execute(a,ctl,a.world!!.issues)
    }
    private fun draws(w: DeterministicFight,a: FightingCharacter=w.p1)=a.afterImages?.draws(a,w.palettes.all.layer()).orEmpty()
    @Test fun noControllerMeansNoHistoryOrAfterimageDraws() {
        val w=fight();repeat(3){w.step()};assertNull(w.p1.afterImages);assertTrue(draws(w).isEmpty())
        assertFalse(CorePresentationPlanner.snapshot(w,0).contains("\"kind\":\"afterimage\""))
    }
    @Test fun defaultsMatchDocumentedPaletteCapacityAndSampling() {
        val w=fight();execute(w.p1,"");val cfg=w.p1.afterImages!!.config
        assertEquals(1,cfg.duration);assertEquals(20,cfg.length);assertEquals(1,cfg.timeGap);assertEquals(4,cfg.frameGap)
        assertEquals(listOf(30,30,30),cfg.base.add);assertEquals(listOf(120,120,220),cfg.base.mul)
        assertEquals(listOf(10,10,25),cfg.progressive.add);assertEquals(listOf(.65*256,.65*256,.75*256),cfg.progressive.mul)
        assertEquals(SpriteBlend.NORMAL,cfg.blend)
    }
    @Test fun mugenLengthTwelveGapThreeSamplesTicksTwoFiveAndEight() {
        val w=fight(c());w.p1.velX=256
        for(t in 1..15) {
            w.step();val expectedCount=minOf(t,11)/3
            assertEquals(expectedCount,draws(w).size,"tick $t")
            for((index,d)in draws(w).withIndex())assertEquals((t-(index+1)*3+1).toLong(),d.pose.capturedAt)
        }
    }
    @Test fun lengthOneCannotSamplePastItsMugenRing() {
        val w=fight(c("time=-1\nlength=1\nframegap=1"));repeat(5){w.step();assertTrue(draws(w).isEmpty());assertEquals(1,w.p1.afterImages!!.stored)}
    }
    @Test fun maximumCapacityBoundsHistoryAndVisibleImages() {
        val w=fight(c("time=-1\nlength=60\nframegap=1"));repeat(150){w.step()}
        assertEquals(60,w.p1.afterImages!!.stored);assertEquals(59,draws(w).size)
        assertEquals(58,draws(w).last().layers[1].repeat)
    }
    @Test fun largeFrameGapNeverInventsHistory() {
        val w=fight(c("time=-1\nlength=3\nframegap=32767"));repeat(8){w.step()};assertTrue(draws(w).isEmpty());assertEquals(3,w.p1.afterImages!!.stored)
    }
    @Test fun timeGapCapturesOnItsOwnSimulationCadence() {
        val w=fight(c("time=-1\nlength=12\nframegap=2\ntimegap=3"))
        for(t in 1..12) {w.step();assertEquals(((t-1)/3+1).toLong(),w.p1.afterImages!!.records)}
        assertEquals(listOf(7L,1L),draws(w).map {it.pose.capturedAt})
    }
    @Test fun finiteTrailsDrainTheirHistoricalFramesBeforeRemoval() {
        val w=fight(c("time=3\nlength=5\nframegap=1"))
        val captured=mutableListOf<List<Long>>()
        repeat(9){w.step();captured.add(draws(w).map {it.pose.capturedAt})}
        assertEquals(listOf(listOf(1L),listOf(2L,1L),listOf(2L,1L),listOf(2L,1L),listOf(2L),emptyList(),emptyList(),emptyList(),emptyList()),captured)
        assertNull(w.p1.afterImages)
    }
    @Test fun defaultOneTickDurationNeverDrawsInventedPastPoses() {
        val w=fight(c(""));repeat(25){w.step();assertTrue(draws(w).isEmpty())};assertNull(w.p1.afterImages)
    }
    @Test fun zeroDurationAndZeroLengthCancelImmediately() {
        for(params in listOf("time=0","time=-1\nlength=0")) {
            val w=fight(c());repeat(4){w.step()};assertTrue(draws(w).isNotEmpty());execute(w.p1,params);assertNull(w.p1.afterImages)
        }
    }
    @Test fun newAfterImageReplacesAllParametersAndDiscardsEarlierHistory() {
        val w=fight(c());repeat(5){w.step()};execute(w.p1,"time=-1")
        val trail=w.p1.afterImages!!;assertEquals(0L,trail.records);assertEquals(0,trail.stored);assertEquals(4,trail.config.frameGap)
        assertTrue(draws(w).isEmpty());w.step();assertEquals(1,trail.stored)
    }
    @Test fun invalidRequestsPreserveConfigClocksAndHistoryAtomically() {
        for(params in listOf("time=-2","time=36001","time=-1\nlength=61","time=-1\nlength=-1","time=-1\ntimegap=0",
            "time=-1\nframegap=32768","time=-1\npalcolor=257","time=-1\npalbright=1,2","time=-1\npalcontrast=-1,0,0",
            "time=-1\npalpostbright=0,256,0","time=-1\npaladd=0,unknown,0","time=-1\npalmul=1,1/0,1",
            "time=-1\npalmul=1,65,1","time=-1\npalmul=-.1,1,1","time=-1\ntrans=addalpha","time=-1\nredirectid=2")) {
            val w=fight(c());repeat(4){w.step()};val trail=w.p1.afterImages;val before=trail!!.json();execute(w.p1,params)
            assertSame(trail,w.p1.afterImages,params);assertEquals(before,trail.json(),params);assertTrue(w.issues.isNotEmpty(),params)
        }
    }
    @Test fun expressionsAreCapturedWithFiniteIntegerAndBooleanConversions() {
        val w=fight();w.p1.vars[0]=7
        execute(w.p1,"time=var(0)\nlength=10.9\ntimegap=2.9\nframegap=3.9\npalcolor=128.9\npalinvertall=-.5\npalbright=var(0),1,2\npalmul=.5,1,2")
        w.p1.vars[0]=99;val cfg=w.p1.afterImages!!.config
        assertEquals(7,cfg.duration);assertEquals(10,cfg.length);assertEquals(2,cfg.timeGap);assertEquals(3,cfg.frameGap)
        assertEquals(128,cfg.base.color);assertTrue(cfg.base.invert);assertEquals(listOf(7,1,2),cfg.base.add);assertEquals(listOf(128.0,256.0,512.0),cfg.progressive.mul)
    }
    @Test fun afterImageTimeCanExtendWithoutDiscardingStoredPosesOrSamplingPhase() {
        val w=fight(c("time=4\nlength=12\nframegap=1\ntimegap=3"));repeat(4){w.step()}
        val trail=w.p1.afterImages!!;val records=trail.records;val rest=trail.restGap;val stored=trail.stored
        execute(w.p1,"time=-1","AfterImageTime");assertSame(trail,w.p1.afterImages);assertEquals(0L,trail.elapsed)
        assertEquals(records,trail.records);assertEquals(rest,trail.restGap);assertEquals(stored,trail.stored)
        repeat(50){w.step()};assertNotNull(w.p1.afterImages)
    }
    @Test fun afterImageTimeValueAliasAndTimePrecedence() {
        val w=fight(c());w.step();execute(w.p1,"value=8","AfterImageTime");assertEquals(8,w.p1.afterImages!!.duration)
        execute(w.p1,"time=9\nvalue=unknown","AfterImageTime");assertEquals(9,w.p1.afterImages!!.duration)
    }
    @Test fun afterImageTimeOneAndZeroStopAndInactiveRetimeDoesNothing() {
        for(time in 0..1) {
            val w=fight(c());repeat(5){w.step()};execute(w.p1,"time=$time","AfterImageTime");assertNull(w.p1.afterImages)
            execute(w.p1,"time=-1","AfterImageTime");assertNull(w.p1.afterImages);assertTrue(w.issues.isEmpty())
        }
    }
    @Test fun malformedRetimePreservesTheEarlierTrail() {
        for(params in listOf("","time=1/0","value=-2","time=3\nlength=20","time=3\nredirectid=2")) {
            val w=fight(c());w.step();val prior=w.p1.afterImages;val before=prior!!.json();execute(w.p1,params,"AfterImageTime")
            assertSame(prior,w.p1.afterImages);assertEquals(before,prior.json());assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun immutablePosesKeepPastMotionFacingAnimationAndOffsets() {
        val w=fight(c("time=-1\nlength=8\nframegap=2"));w.p1.velX=256;w.step()
        val old=CoreActorPose.capture(w.p1,1);w.p1.facingRight=false;w.p1.posY=-20*256;w.step()
        val pose=draws(w).single().pose
        assertEquals(old,pose);assertTrue(pose.frame!!.boxes.isEmpty());assertEquals(0,pose.frame.sprite);assertEquals(1,pose.element)
        assertFalse(w.p1.facingRight);assertEquals(1,w.p1.animation!!.frame!!.sprite)
    }
    @Test fun angleDrawAndSignedScaleAreCapturedRatherThanReadFromCurrentActor() {
        val script=c("time=-1\nlength=8\nframegap=2")+"\n"+c("value=45","AngleSet")+"\n"+c("scale=-2,.5","AngleDraw")+"\n"+c("x=5\ny=-7","Offset")
        val w=fight(script);w.step();val first=CoreActorPose.capture(w.p1,1);w.step();val pose=draws(w).single().pose
        assertEquals(first,pose);assertTrue(pose.angleDraw);assertEquals(45.0,pose.angle);assertEquals(-2.0,pose.scaleX);assertEquals(.5,pose.scaleY)
        assertEquals(5L*256,pose.offsetX);assertEquals(-7L*256,pose.offsetY)
    }
    @Test fun trailsSurviveStateChangesWhileNewRequestsResetThem() {
        val w=fight(c());repeat(4){w.step()};val trail=w.p1.afterImages
        w.p1.changeState(900);w.step();assertSame(trail,w.p1.afterImages);assertTrue(draws(w).isNotEmpty())
    }
    @Test fun visualRecordingContinuesThroughHitpauseWithoutAdvancingStateTime() {
        val w=fight(c());w.step();w.p1.hitPauseLeft=4
        repeat(4){w.step()};assertEquals(1,w.p1.timeInState);assertEquals(5L,w.p1.afterImages!!.records);assertEquals(5L,w.p1.afterImages!!.elapsed)
    }
    @Test fun persistentAndIgnorehitpauseGateControllerRequests() {
        for(ignore in 0..1) {
            val w=fight(c("time=-1\nignorehitpause=$ignore"));w.p1.hitPauseLeft=2;w.step();assertEquals(ignore==1,w.p1.afterImages!=null)
        }
        val w=fight(c("time=-1\npersistent=0",trigger="1"));repeat(5){w.step()};assertEquals(5L,w.p1.afterImages!!.records)
        w.p1.changeState(0);w.step();assertEquals(1L,w.p1.afterImages!!.records)
    }
    @Test fun helpersHaveIndependentHistoriesEvenWhenSharingPalettes() {
        val w=fight(c()+"\n[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+c("time=-1\nlength=8\nframegap=2",state=700))
        w.entities.add(listOf(EntityRequest.Helper(w.p1,7,700,0,0,1,false,0)),w.issues);repeat(6){w.step()}
        val helper=w.entities.helpers.single().actor
        assertNotSame(w.p1.afterImages,helper.afterImages);assertSame(w.p1.paletteEffects,helper.paletteEffects)
        assertEquals(2,draws(w).size);assertEquals(3,draws(w,helper).size)
    }
    @Test fun destroyingAHelperRemovesItsTrailFromPlans() {
        val w=fight("[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+c(state=700))
        w.entities.add(listOf(EntityRequest.Helper(w.p1,7,700,0,0,1,false,0)),w.issues);repeat(4){w.step()}
        val helper=w.entities.helpers.single().actor;assertTrue(draws(w,helper).isNotEmpty());helper.destroyed=true;w.step()
        assertFalse(CorePresentationPlanner.snapshot(w,0).contains("\"kind\":\"afterimage\""))
    }
    @Test fun afterimageBlendOverridesLiveAirAndTransIndependently() {
        val expected=mapOf("none" to SpriteBlend.NORMAL,"add" to SpriteBlend.ADD,"add1" to SpriteBlend("add",256,128),"sub" to SpriteBlend.SUB)
        for((mode,blend)in expected) {
            val w=fight(c("time=-1\nframegap=1\ntrans=\"${mode.uppercase()}\"")+"\n"+c("trans=sub","Trans",trigger="1"));w.step()
            assertEquals(blend,draws(w).single().blend);assertEquals(SpriteBlend.SUB,w.p1.drawBlend)
        }
    }
    @Test fun postBrightnessOccursBeforeClampAndProgressionUsesVisibleRank() {
        val w=fight(c("time=-1\nlength=12\nframegap=3\npalbright=0,0,0\npalcontrast=128,256,512\npalpostbright=10,20,30\npaladd=10,0,0\npalmul=.5,1,1"))
        repeat(9){w.step()};val rows=draws(w)
        assertEquals(listOf(60,50,130),CoreFightPalettes.rgb(listOf(100,30,50),rows[0].layers))
        assertEquals(listOf(35,50,130),CoreFightPalettes.rgb(listOf(100,30,50),rows[1].layers))
        assertEquals(listOf(22,50,130),CoreFightPalettes.rgb(listOf(100,30,50),rows[2].layers))
        assertEquals(2,rows[2].layers[1].repeat)
    }
    @Test fun trailsUseTheirOwnPaletteThenCurrentGlobalEffects() {
        val w=fight(c()+"\n"+c("time=-1\nadd=99,0,0","PalFX")+"\n"+c("time=-1\nmul=128,128,128","AllPalFX"));repeat(3){w.step()}
        val layers=draws(w).single().layers;assertEquals(2,layers.size);assertEquals(listOf(30,30,30),layers[0].add)
        assertEquals(listOf(128,128,128),layers[1].mul)
    }
    @Test fun priorityUsesPastPoseAndStaysBelowCurrentActorAtIntEndpoints() {
        val w=fight(c("time=-1\nlength=8\nframegap=1"));w.p1.spritePriority=Int.MAX_VALUE;w.step()
        w.p1.spritePriority=Int.MIN_VALUE;w.step();val rows=draws(w)
        assertTrue(rows.all {it.priority<Int.MIN_VALUE.toLong()});assertEquals(Int.MIN_VALUE.toLong()-3,rows[1].priority)
    }
    @Test fun borrowedAnimationAndStateBanksRetainTheirCapturedVisualCoordinates() {
        for(width in listOf(320,640,1008)) {
            val w=fight(c("time=-1\nlength=8\nframegap=2")+"\n[Statedef 901]\ntype=S\nphysics=N\nanim=0");w.step()
            val bank=FightingCharacter(definition("[Statedef 900]\ntype=S\nphysics=N\nanim=200\n"+
                c("value=200","ChangeAnim2",state=900)+"\n"+c("value=901","SelfState",trigger="Time=2",state=900),width),3)
            w.p1.enterAuthoredState(900,bank,w.issues);repeat(3){w.step()}
            val poses=draws(w).map {it.pose};assertTrue(poses.any {it.definition===bank.definition});assertTrue(poses.any {it.definition===w.p1.definition})
        }
    }
    @Test fun renderSuppressionDoesNotStopRecordingOrChangePureReads() {
        val w=fight(c()+"\n"+c("time=10\nvalue=1,2,3\nunder=0","EnvColor"));repeat(5){w.step()}
        assertEquals(5L,w.p1.afterImages!!.records);val trail=w.p1.afterImages!!.json();val checksum=w.checksum()
        repeat(10){assertFalse(CorePresentationPlanner.snapshot(w,12).contains("\"kind\":\"afterimage\""));w.p1.afterImages!!.json()}
        assertEquals(trail,w.p1.afterImages!!.json());assertEquals(checksum,w.checksum())
    }
    @Test fun renderingAtDifferentCadencesDoesNotAdvanceOrResampleHistories() {
        val w=fight(c());repeat(7){w.step()};val rows=draws(w);val before=w.p1.afterImages!!.json();val checksum=w.checksum()
        for(backlog in listOf(0L,2L,5L,12L))repeat(5){CorePresentationPlanner.snapshot(w,backlog);assertEquals(rows,draws(w))}
        assertEquals(before,w.p1.afterImages!!.json());assertEquals(checksum,w.checksum())
    }
    @Test fun visualTrailsNeverChangeCombatStateAndFightsStayIndependent() {
        val w=fight(c());val other=fight();w.p1.velX=256;other.p1.velX=256
        repeat(20){w.step();other.step();assertEquals(other.checksum(),w.checksum());assertEquals(other.p1.hurtBoxes(),w.p1.hurtBoxes())}
        assertNull(other.p1.afterImages);assertEquals(20L,w.p1.afterImages!!.records)
    }
    private fun ghost(plan: String)=plan.substringAfter("\"kind\":\"afterimage\"").substringBefore("\"blend\"")
    private fun field(json: String,key: String)=Regex("\\\"$key\\\":(-?[0-9.Ee+-]+)").find(json)!!.groupValues[1].toDouble()
    @Test fun historicalTransformMatchesTheOriginalActorProjection() {
        val w=fight(c("time=-1\nlength=8\nframegap=2")+"\n"+c("value=37","AngleSet")+"\n"+c("scale=-2,.5","AngleDraw"))
        w.p1.velX=256;w.step();val original=CorePresentationPlanner.snapshot(w,0).substringAfter("\"kind\":\"fighter\"")
        w.p1.facingRight=false;w.step();val history=ghost(CorePresentationPlanner.snapshot(w,0))
        for(key in listOf("x","y","transformA","transformB","transformC","transformD","rotationDegrees","facing","spriteScaleX","spriteScaleY"))
            assertEquals(field(original,key),field(history,key),key)
    }
    @Test fun currentCameraProjectsHistoricalWorldPositionsWithoutRecapturingThem() {
        val w=fight(c("time=-1\nlength=8\nframegap=2"));w.configureArena(-1000,1000,push=false)
        w.p1.velX=256;repeat(3){w.step()};val poses=draws(w).map {it.pose};val history=ghost(CorePresentationPlanner.snapshot(w,0))
        assertEquals(CorePresentationPlanner.pixelX(poses.last().x,w.camera),field(history,"axisX"))
        assertEquals(CorePresentationPlanner.pixelY(poses.last().y,w.camera),field(history,"axisY"))
        assertEquals(poses,draws(w).map {it.pose})
    }
}
