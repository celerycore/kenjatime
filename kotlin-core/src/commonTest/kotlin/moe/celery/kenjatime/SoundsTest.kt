package moe.celery.kenjatime

import kotlin.test.*

class SoundsTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nanim=0\nctrl=0"
    private val helper="[Statedef 700]\ntype=S\nphysics=N\nanim=0\nctrl=0"
    private val air="[Begin Action 0]\n0,0,0,0,-1"
    private val catalog="0,0,800,8000;0,1,1600,8000;2,3,2400,8000"
    private fun c(type: String="PlaySnd",params: String="value=0,0\nchannel=3",trigger: String="Time=0",state: Int=0)=
        "[State $state, sound]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun definition(script: String="",width: Int=320)=FighterDefinition.fromScript("sound",air,"$idle\n$helper\n$script",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(script: String="",loaded: Boolean=true)=DeterministicFight(FightingCharacter(definition(script),1),FightingCharacter(definition(),2)).also {
        it.p2.posX=100*256;if(loaded){it.sounds.catalog(0,catalog);it.sounds.catalog(1,catalog)}
    }
    private fun execute(a: FightingCharacter,params: String="value=0,0\nchannel=3",type: String="PlaySnd") {
        val controller=MugenCnsParser.parse("$idle\n${c(type,params)}").getValue(0).controllers.single()
        a.world!!.sounds.execute(a,controller,a.world!!.issues)
    }
    private fun voice(w: DeterministicFight)=w.sounds.voices.single()
    @Test fun legacyMetadataQueueStillWorksWithoutLoadingAPlatformSoundCatalog() {
        val w=fight(loaded=false);execute(w.p1);assertTrue(w.sounds.voices.isEmpty());assertEquals(listOf(CorePresentationEvent("playsnd",0,0,3)),w.presentation)
        assertTrue(w.issues.isEmpty())
    }
    @Test fun catalogsValidateAtomicallyAndCannotChangeAfterTheFirstTick() {
        for(text in listOf("0,0,0,8000","0,0,1,0","-1,0,1,8000","0,-1,1,8000","0,0,1,8000;0,0,2,8000","0,0,1","0,0,999999999999,8000")) {
            val w=fight();assertFailsWith<IllegalArgumentException>{w.sounds.catalog(0,text)};execute(w.p1);assertEquals(6,voice(w).remaining)
        }
        val w=fight();w.step();assertFailsWith<IllegalArgumentException>{w.sounds.catalog(0,catalog)}
    }
    @Test fun voicesCaptureDefaultsAndOwnResourceSide() {
        val w=fight();execute(w.p2,"value=0,0");val v=voice(w)
        assertEquals(-1,v.channel);assertEquals(1,v.side);assertEquals(1.0,v.gain);assertEquals(1.0,v.frequency);assertFalse(v.loop)
        assertEquals(.625,v.pan);assertEquals(6,v.remaining);assertEquals(0L,v.age)
    }
    @Test fun finiteVoicesLastTheAuthoredSampleDurationRoundedUpToTicks() {
        val w=fight(c());for(left in 6 downTo 1){w.step();assertEquals(left,voice(w).remaining);assertEquals((6-left).toLong(),voice(w).age)}
        w.step();assertTrue(w.sounds.voices.isEmpty());assertTrue(w.sounds.eventJson().contains("\"type\":\"stop\""))
    }
    @Test fun fractionalSampleTicksRoundUpWithoutLosingShortSamples() {
        val w=fight(c());w.sounds.catalog(0,"0,0,801,8000");w.step();assertEquals(7,voice(w).remaining)
        val short=fight(c());short.sounds.catalog(0,"0,0,1,8000");short.step();assertEquals(1,voice(short).remaining)
    }
    @Test fun frequencyControlsLogicalLifetimeAndLoopsDoNotExpire() {
        for((frequency,ticks)in listOf(.5 to 12,2.0 to 3,16.0 to 1)) {
            val w=fight();execute(w.p1,"value=0,0\nfreqmul=$frequency");assertEquals(ticks,voice(w).remaining)
        }
        val w=fight(c(params="value=0,0\nloop=1"));repeat(100){w.step()};assertEquals(-1,voice(w).remaining);assertEquals(99L,voice(w).age)
    }
    @Test fun replacingAnExplicitChannelStopsTheOldVoiceBeforeStartingItsReplacement() {
        val w=fight();execute(w.p1);val first=voice(w).id;execute(w.p1,"value=0,1\nchannel=3")
        assertEquals(first+1,voice(w).id);assertEquals(1,voice(w).sample.number);assertEquals(1,w.sounds.voices.size)
        assertTrue(w.sounds.events[1].contains("\"type\":\"stop\""));assertTrue(w.sounds.events[2].contains("\"type\":\"play\""))
    }
    @Test fun lowPriorityCannotInterruptAnExistingExplicitChannel() {
        val w=fight();execute(w.p1);val first=voice(w);execute(w.p1,"value=0,1\nchannel=3\nlowpriority=-.5")
        assertSame(first,voice(w));assertEquals(1,w.sounds.events.size)
    }
    @Test fun autoChannelsAllowConcurrentVoicesWithoutClaimingNamedChannels() {
        val w=fight();repeat(3){execute(w.p1,"value=0,0\nlowpriority=1")};assertEquals(3,w.sounds.voices.size)
        execute(w.p1,"channel=0","StopSnd");assertEquals(3,w.sounds.voices.size);assertTrue(w.sounds.voices.all {it.channel==-1})
    }
    @Test fun volumeScaleAndLegacyVolumeAreCapturedIndependentlyOfFutureVariables() {
        val w=fight();w.p1.fvars[0]=12.5;execute(w.p1,"value=0,0\nvolumescale=fvar(0)");w.p1.fvars[0]=99.0;assertEquals(.125,voice(w).gain)
        execute(w.p1,"channel=-1","StopSnd");execute(w.p1,"value=0,0\nvolume=-40");assertEquals(216/256.0,voice(w).gain)
    }
    @Test fun zeroVolumeStillOwnsAChannelAndExpiresNormally() {
        val w=fight(c(params="value=0,0\nchannel=3\nvolumescale=0"));w.step();assertEquals(0.0,voice(w).gain);repeat(6){w.step()};assertTrue(w.sounds.voices.isEmpty())
    }
    @Test fun ownSPrefixAndNestedExpressionsSelectActualSamplePairs() {
        val w=fight();execute(w.p1,"value=S ifelse(1,2,0),max(1,3)\nchannel=3");assertEquals(2,voice(w).sample.group);assertEquals(3,voice(w).sample.number)
    }
    @Test fun invalidPlayRequestsPreserveExistingVoicesAndDoNotEmitHardwareEvents() {
        val bad=listOf("","value=0","value=0,0,0","value=F5,2","value=0,unknown","value=-1,0","value=0,0\nchannel=-2",
            "value=0,0\nchannel=256","value=0,0\nvolumescale=101","value=0,0\nvolume=-257","value=0,0\nvolume=0\nvolumescale=100",
            "value=0,0\nfreqmul=0","value=0,0\nfreqmul=.01","value=0,0\nfreqmul=17","value=0,0\nloop=1/0",
            "value=0,0\nlowpriority=unknown","value=0,0\npan=1\nabspan=2","value=0,0\npan=100001","value=0,0\nredirectid=2")
        for(params in bad){val w=fight();execute(w.p1);val first=voice(w);val events=w.sounds.eventJson();execute(w.p1,params)
            assertSame(first,voice(w),params);assertEquals(events,w.sounds.eventJson(),params);assertTrue(w.issues.isNotEmpty(),params)}
    }
    @Test fun unavailableSamplesDoNotStopEarlierChannelOwners() {
        val w=fight();execute(w.p1);val first=voice(w);execute(w.p1,"value=99,99\nchannel=3")
        assertSame(first,voice(w));assertTrue(w.issues.any {it.startsWith("Missing sound")})
    }
    @Test fun relativePanUsesCapturedPositionAndFacing() {
        val w=fight();w.p1.posX=80*256;execute(w.p1,"value=0,0\nchannel=3\npan=40");assertEquals(.75,voice(w).pan)
        w.p1.facingRight=false;execute(w.p1,"channel=3\npan=40","SndPan");assertEquals(.25,voice(w).pan)
    }
    @Test fun absolutePanDoesNotDependOnActorPositionOrFacingAndClampsAtSpeakers() {
        val w=fight();w.p1.posX=-999*256;w.p1.facingRight=false;execute(w.p1,"value=0,0\nchannel=3\nabspan=80");assertEquals(.5,voice(w).pan)
        for((p,expected)in listOf(-999 to -1.0,999 to 1.0,0 to 0.0)) {execute(w.p1,"channel=3\nabspan=$p","SndPan");assertEquals(expected,voice(w).pan)}
    }
    @Test fun movementDoesNotInventNewPanEventsWithoutAnAuthoredSndPan() {
        val w=fight();execute(w.p1);w.p1.posX=80*256;w.step();assertEquals(0.0,voice(w).pan);assertTrue(w.sounds.events.isEmpty())
        execute(w.p1,"channel=3\npan=0","SndPan");assertEquals(.5,voice(w).pan)
    }
    @Test fun mixedBankPanCoordinatesAreConvertedExactlyOnce() {
        for(width in listOf(320,640,1008))for(face in listOf(true,false)) {
            val w=fight();val bank=FightingCharacter(definition(width=width),3);w.p1.enterAuthoredState(700,bank,w.issues)
            w.p1.posX=80*256;w.p1.facingRight=face;execute(w.p1,"value=0,0\nchannel=3\npan=${40*width/320}")
            assertEquals(if(face).75 else .25,voice(w).pan);assertEquals(0,voice(w).side)
        }
    }
    @Test fun absolutePanStaysIndependentOfCameraTracking() {
        val w=fight();w.configureArena(-1000,1000,push=false);execute(w.p1,"value=0,0\nchannel=3\nabspan=80")
        w.p1.posX=300*256;w.p2.posX=400*256;repeat(4){w.camera!!.update(w.p1,w.p2)}
        execute(w.p1,"channel=3\nabspan=80","SndPan");assertEquals(.5,voice(w).pan)
    }
    @Test fun missingPanChannelsAreNoOpsWhileMalformedPansAreAtomic() {
        val w=fight();execute(w.p1);val before=voice(w).pan
        execute(w.p1,"channel=7\nabspan=160","SndPan");assertEquals(before,voice(w).pan)
        for(params in listOf("pan=1","channel=3","channel=-1\npan=0","channel=3\npan=0\nabspan=0","channel=3\npan=unknown")) {
            execute(w.p1,params,"SndPan");assertEquals(before,voice(w).pan)
        }
        assertTrue(w.issues.isNotEmpty())
    }
    @Test fun explicitStopsAreActorLocalAndGlobalMinusOneStopsBothSides() {
        val w=fight();execute(w.p1);execute(w.p2);execute(w.p1,"channel=3","StopSnd")
        assertSame(w.p2,voice(w).actor);execute(w.p1,"channel=-1","StopSnd");assertTrue(w.sounds.voices.isEmpty())
    }
    @Test fun malformedStopsCannotClearAnExistingVoice() {
        val w=fight();execute(w.p1);for(params in listOf("","channel=unknown","channel=-2","channel=-1\nvalue=0"))execute(w.p1,params,"StopSnd")
        assertEquals(1,w.sounds.voices.size);assertTrue(w.issues.isNotEmpty())
    }
    @Test fun helperChannelsAreIndependentWhileTheirSamplesUseTheRealRootBank() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p1,9,700,0,0,1,false,0)),w.issues);val h=w.entities.helpers.single().actor
        execute(w.p1);execute(h);assertEquals(2,w.sounds.voices.size);assertTrue(w.sounds.voices.all {it.side==0})
        execute(w.p1,"channel=3","StopSnd");assertSame(h,voice(w).actor)
    }
    @Test fun borrowedScriptsNeverTakeTheVictimsSoundResourceBank() {
        val script=c(params="value=0,0",state=700);val a=FightingCharacter(definition(),1);val bank=FightingCharacter(definition(script),2)
        val w=DeterministicFight(a,bank);w.sounds.catalog(0,"0,0,800,8000");w.sounds.catalog(1,"0,0,1600,8000")
        a.enterAuthoredState(700,bank,w.issues);w.step();assertEquals(0,voice(w).side);assertEquals(6,voice(w).remaining)
    }
    @Test fun helperDestructionStopsOnlyItsOwnVoices() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p1,9,700,0,0,1,false,0)),w.issues);val h=w.entities.helpers.single().actor
        execute(w.p1,"value=0,0\nloop=1");execute(h,"value=0,0\nloop=1");h.destroyed=true;w.step()
        assertSame(w.p1,voice(w).actor);assertTrue(w.sounds.eventJson().contains("\"type\":\"stop\""))
    }
    @Test fun hitReceptionStopsReservedVoiceZeroWithoutSilencingOtherChannelsOrPlayers() {
        val w=fight();execute(w.p1,"value=0,0\nchannel=0\nloop=1");execute(w.p1,"value=0,0\nchannel=1\nloop=1");execute(w.p2,"value=0,0\nchannel=0\nloop=1")
        w.p1.receiveHit(HitDefinition(damage=1),false,attacker=w.p2)
        assertEquals(2,w.sounds.voices.size);assertFalse(w.sounds.voices.any {it.actor===w.p1&&it.channel==0})
    }
    @Test fun hitpauseDoesNotFreezePlayingSoundLifetimes() {
        val w=fight(c());w.step();w.p1.hitPauseLeft=10;repeat(6){w.step()};assertTrue(w.sounds.voices.isEmpty());assertEquals(1,w.p1.timeInState)
    }
    @Test fun guardReceptionKeepsTheReservedVoiceChannelPlaying() {
        val w=fight();execute(w.p1,"value=0,0\nchannel=0\nloop=1");val before=voice(w)
        w.p1.receiveHit(HitDefinition(damage=1),false,true,w.p2);assertSame(before,voice(w));assertEquals(1000,w.p1.life)
    }
    @Test fun stateChangesDoNotStopPlayingLoopsAndRequestGatingRemainsActorLocal() {
        val w=fight(c(params="value=0,0\nloop=1\npersistent=0",trigger="1"));repeat(4){w.step()};assertEquals(1,w.sounds.voices.size)
        w.p1.changeState(700);w.step();assertEquals(1,w.sounds.voices.size);w.p1.changeState(0);w.step();assertEquals(2,w.sounds.voices.size)
        for(ignore in 0..1){val paused=fight(c(params="value=0,0\nignorehitpause=$ignore"));paused.p1.hitPauseLeft=1;paused.step();assertEquals(ignore,paused.sounds.voices.size)}
    }
    @Test fun actorVoiceCapPreservesEarlierOwnersButAllowsNamedReplacement() {
        val w=fight();execute(w.p1,"value=0,0\nchannel=3\nloop=1");repeat(31){execute(w.p1,"value=0,0\nloop=1")}
        execute(w.p1,"value=0,0\nloop=1");assertEquals(32,w.sounds.voices.size);assertTrue(w.issues.any {it.contains("voice limit")})
        execute(w.p1,"value=0,1\nchannel=3\nloop=1");assertEquals(32,w.sounds.voices.size);assertEquals(1,w.sounds.voices.single {it.channel==3}.sample.number)
    }
    @Test fun soundEventsAndInspectionArePureAndNeverChangePhysics() {
        val a=fight(c(params="value=0,0\nchannel=3\nloop=1"));val b=fight();a.p1.velX=256;b.p1.velX=256
        repeat(9){a.step();b.step();assertEquals(b.checksum(),a.checksum());val before=a.sounds.json();val events=a.sounds.eventJson()
            repeat(4){CorePresentationPlanner.snapshot(a,12);assertEquals(before,a.sounds.json());assertEquals(events,a.sounds.eventJson())}}
        assertEquals(1L,voice(a).id)
    }
    @Test fun independentFightsNeverShareVoicesEventsOrGlobalStops() {
        val a=fight();val b=fight();execute(a.p1);execute(b.p1);execute(a.p1,"channel=-1","StopSnd")
        assertTrue(a.sounds.voices.isEmpty());assertEquals(1,b.sounds.voices.size);assertEquals(1L,voice(b).id)
    }
    @Test fun fightVoiceCapDoesNotConsumeSlotsOrStopExistingOwners() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p1,9,700,0,0,1,false,0),EntityRequest.Helper(w.p2,9,700,0,0,1,false,0)),w.issues)
        for(a in listOf(w.p1,w.p2)+w.entities.helpers.map {it.actor}) {
            execute(a,"value=0,0\nchannel=3\nloop=1");repeat(31){execute(a,"value=0,0\nloop=1")}
        }
        assertEquals(128,w.sounds.voices.size)
        w.entities.add(listOf(EntityRequest.Helper(w.p1,10,700,0,0,1,false,0)),w.issues);execute(w.entities.helpers.last().actor)
        assertEquals(128,w.sounds.voices.size);assertTrue(w.issues.any {it.contains("voice limit")})
        execute(w.p1,"value=0,1\nchannel=3\nloop=1");assertEquals(128,w.sounds.voices.size);assertEquals(129L,w.sounds.voices.last().id)
    }
    @Test fun emptyRegisteredBanksAndExcessiveCatalogsCannotInventPlayableSamples() {
        val w=fight();w.sounds.catalog(0,"");execute(w.p1);assertTrue(w.sounds.voices.isEmpty());assertTrue(w.issues.any {it.startsWith("Missing sound")})
        val excessive=(0..4096).joinToString(";"){"$it,0,800,8000"}
        assertFailsWith<IllegalArgumentException>{w.sounds.catalog(0,excessive)};execute(w.p1);assertTrue(w.sounds.voices.isEmpty())
    }
}
