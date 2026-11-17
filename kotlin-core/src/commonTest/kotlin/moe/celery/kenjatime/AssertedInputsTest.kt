package moe.celery.kenjatime

import kotlin.test.*

class AssertedInputsTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=-40,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=1"
    private val commands=listOf("poke" to "a","held" to "/a","release" to "~a","together" to "F+a",
        "forward" to "F","heldB" to "/b","motion" to "D,DF,F,a").map {
        MugenCommand(it.first,MugenCommandParser.parseCommandString(it.second))
    }
    private fun c(params: String,trigger: String="1",state: Int=0)=
        "[State $state, asserted]\ntype=AssertInput\ntrigger1=$trigger\n$params"
    private fun count(command: String,v: Int=0,state: Int=0,extra: String="")=
        "[State $state, command]\ntype=VarAdd\ntrigger1=command=\"$command\"\nv=$v\nvalue=1\n$extra"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("assert",air,"$idle\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(a: String="",b: String="")=DeterministicFight(
        FightingCharacter(definition(a),1,commands),FightingCharacter(definition(b),2,commands))
    private fun execute(actor: FightingCharacter,params: String) {
        val ctl=MugenCnsParser.parse("$idle\n${c(params)}").getValue(0).controllers.single()
        CoreAssertedInputs.execute(actor,ctl,actor.world!!.issues)
    }
    private fun latest(actor: FightingCharacter)=actor.input.latest() ?: InputFrame()
    private val helperState="[Statedef 700]\ntype=S\nphysics=N\nanim=0\nctrl=1\n"
    private fun helper(w: DeterministicFight,owner: FightingCharacter=w.p1,key: Boolean=true): FightingCharacter {
        w.entities.add(listOf(EntityRequest.Helper(owner,9,700,0,0,1,key,0)),w.issues)
        return w.entities.helpers.last().actor
    }
    @Test fun newActorsHaveNoQueuedOrSampledInput() {
        val w=fight();assertEquals(InputFrame(),w.p1.pendingAssertedInput);assertNull(w.p1.input.latest())
        w.step();assertEquals(InputFrame(),latest(w.p1));assertTrue(w.issues.isEmpty())
    }
    @Test fun assertedButtonsBecomeCommandsOnTheNextSampleOnly() {
        val w=fight("${c("flag=a","Time=0")}\n${count("poke")}")
        w.step();assertEquals(0,w.p1.vars[0]);assertEquals(setOf('a'),w.p1.pendingAssertedInput.buttons)
        w.step();assertEquals(1,w.p1.vars[0]);assertEquals(setOf('a'),latest(w.p1).buttons)
        w.step();assertEquals(1,w.p1.vars[0]);assertEquals(emptySet(),latest(w.p1).buttons)
    }
    @Test fun continuousAssertionIsOnePressWithHeldSamplesAndOneRelease() {
        val w=fight("${c("flag=a","Time<3")}\n${count("poke")}\n${count("held",1)}\n${count("release",2)}")
        repeat(6){w.step()};assertEquals(1,w.p1.vars[0]);assertEquals(3,w.p1.vars[1]);assertEquals(1,w.p1.vars[2])
    }
    @Test fun assertionsUnionWithPhysicalButtonsAndDirectionsWithoutReplacingThem() {
        val w=fight(c("flag=F\nflag2=a","Time=0"));w.step();w.step(InputFrame(Directions.D,setOf('b')))
        assertEquals(Directions.DF,latest(w.p1).directions);assertEquals(setOf('a','b'),latest(w.p1).buttons)
    }
    @Test fun repeatedControllersUnionFlagsAndDoNotCreateDuplicateButtonPresses() {
        val w=fight("${c("flag=a")}\n${c("flag=a\nflag2=F")}\n${count("together")}")
        repeat(4){w.step()};assertEquals(1,w.p1.vars[0]);assertEquals(setOf('a'),latest(w.p1).buttons)
    }
    @Test fun forwardAndBackResolveToPhysicalBitsAtControllerExecution() {
        for(face in listOf(false,true))for(flag in listOf("F","B")) {
            val w=fight();w.p1.facingRight=face;execute(w.p1,"flag=$flag");w.p1.facingRight=!face;w.step()
            assertEquals(if((flag=="F")==face)Directions.R else Directions.L,latest(w.p1).directions)
        }
    }
    @Test fun absoluteDirectionsAreIndependentOfFacing() {
        for(face in listOf(false,true)) {
            val w=fight();w.p1.facingRight=face;execute(w.p1,"flag=L\nflag2=U");w.step()
            assertEquals(Directions.UB,latest(w.p1).directions)
        }
    }
    @Test fun allSevenButtonsAndLiteralAliasesUseTheSameBits() {
        val w=fight();execute(w.p1,"flag=a+b+c+x+y+z+s");w.step()
        assertEquals("abcxyzs".toSet(),latest(w.p1).buttons);assertEquals(127,CoreAssertedInputs.buttonsMask(latest(w.p1)))
        execute(w.p1,"flag=forward\nflag2=up\nflag3=start");w.step()
        assertEquals(Directions.UF,latest(w.p1).directions);assertEquals(setOf('s'),latest(w.p1).buttons)
    }
    @Test fun quotedListsAndAllSupportedSeparatorsAreLiteral() {
        val w=fight();execute(w.p1,"flag=\"F + a | b, c\"");w.step()
        assertEquals(Directions.R,latest(w.p1).directions);assertEquals(setOf('a','b','c'),latest(w.p1).buttons)
    }
    @Test fun malformedFlagsNeverPartlyReplaceOrAddToAnEarlierQueue() {
        for(params in listOf("","flag=","flag=\"\"","flag=F+unknown","flag=a\nflag2=unknown","flag=a\nredirectid=2",
            "flag=1","flag=var(0)","flag=F+","flag=\"","flag=\"a","flag=a\"","flag=d","flag4=a")) {
            val w=fight();execute(w.p1,"flag=b");val prior=w.p1.pendingAssertedInput
            execute(w.p1,params);assertSame(prior,w.p1.pendingAssertedInput,params)
            assertTrue(w.issues.any { it.startsWith("Invalid AssertInput:") },params)
        }
    }
    @Test fun inputQueueDoesNotInvalidateACommandAlreadyReadInTheCurrentTick() {
        val w=fight("${count("poke")}\n${c("flag=a","Time=0")}\n${count("poke",1)}")
        w.step();assertEquals(0,w.p1.vars[0]);assertEquals(0,w.p1.vars[1])
        w.step();assertEquals(1,w.p1.vars[0]);assertEquals(1,w.p1.vars[1])
    }
    @Test fun stateTransitionsDoNotClearAnAlreadyQueuedInput() {
        val w=fight(c("flag=a","Time=0"));w.step();w.p1.changeState(1234);w.step()
        assertEquals(setOf('a'),latest(w.p1).buttons);assertEquals(InputFrame(),w.p1.pendingAssertedInput)
    }
    @Test fun persistentZeroRearmsOnlyOnStateEntry() {
        val w=fight(c("flag=a\npersistent=0"));repeat(3){w.step()};assertEquals(InputFrame(),latest(w.p1))
        w.p1.changeState(0);w.step();w.step();assertEquals(setOf('a'),latest(w.p1).buttons)
    }
    @Test fun queuedInputsAreSampledAndConsumedThroughHitpause() {
        val w=fight("${c("flag=a","Time=0")}\n${count("poke",extra="ignorehitpause=1")}")
        w.step();w.p1.hitPauseLeft=2;w.step();assertEquals(1,w.p1.vars[0]);assertEquals(setOf('a'),latest(w.p1).buttons)
        w.step();assertEquals(1,w.p1.vars[0]);assertEquals(InputFrame(),latest(w.p1));assertEquals(1,w.p1.timeInState)
    }
    @Test fun ignorehitpauseControlsWhetherNewAssertionsAreQueuedOnPausedTicks() {
        for(ignore in 0..1) {
            val w=fight(c("flag=a\nignorehitpause=$ignore"));w.p1.hitPauseLeft=2;w.step()
            assertEquals(if(ignore==1)setOf('a') else emptySet(),w.p1.pendingAssertedInput.buttons)
            w.step();assertEquals(if(ignore==1)setOf('a') else emptySet(),latest(w.p1).buttons)
        }
    }
    @Test fun aQueuedButtonAndPhysicalPressOfTheSameButtonCountAsOnePress() {
        val w=fight("${c("flag=a","Time=0")}\n${count("poke")}");w.step();w.step(InputFrame(buttons=setOf('a')))
        w.step(InputFrame(buttons=setOf('a')));assertEquals(1,w.p1.vars[0])
    }
    @Test fun rootsNeverReceiveEachOthersQueuedInputs() {
        val w=fight(c("flag=a"),c("flag=b"));w.step();w.step()
        assertEquals(setOf('a'),latest(w.p1).buttons);assertEquals(setOf('b'),latest(w.p2).buttons)
    }
    @Test fun helperKeyctrlReceivesRawPhysicalInputFromItsActualRoot() {
        val w=fight(helperState,helperState);val a=helper(w);val b=helper(w,w.p2)
        w.step(InputFrame(Directions.R,setOf('a')),InputFrame(Directions.L,setOf('b')))
        assertEquals(InputFrame(Directions.R,setOf('a')),latest(a));assertEquals(InputFrame(Directions.L,setOf('b')),latest(b))
    }
    @Test fun rootAssertionsDoNotLeakIntoKeyctrlHelpers() {
        val w=fight(helperState+"\n"+c("flag=a"));val h=helper(w);w.step();w.step()
        assertEquals(setOf('a'),latest(w.p1).buttons);assertEquals(emptySet(),latest(h).buttons)
    }
    @Test fun helperAssertionsRemainIndependentFromRootAndSibling() {
        val w=fight(helperState);val a=helper(w);val b=helper(w);execute(a,"flag=b");w.step(InputFrame(buttons=setOf('a')))
        assertEquals(setOf('a','b'),latest(a).buttons);assertEquals(setOf('a'),latest(b).buttons)
        assertEquals(setOf('a'),latest(w.p1).buttons)
    }
    @Test fun aNonKeyctrlHelperDoesNotReceivePhysicalInputButCanQueueItsOwnBits() {
        val w=fight(helperState);val h=helper(w,key=false);execute(h,"flag=b");w.step(InputFrame(buttons=setOf('a')))
        assertEquals(setOf('b'),latest(h).buttons);assertFalse(h.commandActive("heldB"));assertTrue(h.commands.isEmpty())
    }
    @Test fun nestedKeyctrlHelpersUseRootCommandsEvenWhenTheirParentHasKeyctrlOff() {
        val w=fight(helperState);val a=helper(w,key=false);val nested=helper(w,a,key=true)
        w.step(InputFrame(buttons=setOf('a')));assertEquals(setOf('a'),latest(nested).buttons)
        assertTrue(nested.commandActive("poke"));assertTrue(a.commands.isEmpty())
    }
    @Test fun helperCommandsObserveAssertedButtonsOnTheNextHelperTick() {
        val w=fight(helperState+c("flag=a","Time=0",700)+"\n"+count("poke",state=700))
        val h=helper(w);w.step();assertEquals(0,h.vars[0]);w.step();assertEquals(1,h.vars[0])
        assertEquals(0,w.p1.vars[0]);assertTrue(w.issues.isEmpty())
    }
    @Test fun destroyedHelpersDoNotSampleOrReplayQueuedInputs() {
        val w=fight(helperState);val h=helper(w);execute(h,"flag=a");h.destroyed=true;w.step()
        assertNull(h.input.latest());assertTrue(w.entities.helpers.none { it.actor === h })
    }
    @Test fun inactiveRoundPhasesDiscardPendingAndPhysicalInputs() {
        val w=fight();execute(w.p1,"flag=a");w.enableRoundFlow(CoreRoundRules(introFrames=2,roundCueFrames=1,fightCueFrames=1))
        w.step(InputFrame(buttons=setOf('b')));assertEquals(InputFrame(),latest(w.p1));assertEquals(InputFrame(),w.p1.pendingAssertedInput)
        repeat(4){w.step()};assertEquals(InputFrame(),latest(w.p1))
    }
    @Test fun inactiveControllersCannotQueueInputsThatLeakIntoCombat() {
        val w=fight(c("flag=a","RoundState!=2"));w.enableRoundFlow(CoreRoundRules(introFrames=1,roundCueFrames=1,fightCueFrames=1))
        repeat(5){w.step()};assertEquals(InputFrame(),latest(w.p1));assertEquals(InputFrame(),w.p1.pendingAssertedInput)
    }
    @Test fun inactiveRoundPhasesAlsoClearHelperInputHistoryAndQueues() {
        val w=fight(helperState);val h=helper(w);w.step(InputFrame(buttons=setOf('a')));execute(h,"flag=b")
        w.enableRoundFlow(CoreRoundRules(introFrames=2));w.step();assertNull(h.input.latest());assertEquals(InputFrame(),h.pendingAssertedInput)
    }
    @Test fun oppositeDirectionBitsAreRetainedLikeExistingPhysicalInputSamples() {
        val w=fight();execute(w.p1,"flag=F+B\nflag2=U+D");w.step()
        assertEquals(Directions.U or Directions.D or Directions.L or Directions.R,latest(w.p1).directions)
    }
    @Test fun motionCommandsCombineMultipleAssertedSamplesWithAFinalButton() {
        val w=fight("${c("flag=D","Time=0")}\n${c("flag=D+F","Time=1")}\n"+
            "${c("flag=F+a","Time=2")}\n${count("motion")}")
        repeat(3){w.step()};assertEquals(0,w.p1.vars[0]);w.step();assertEquals(1,w.p1.vars[0])
    }
    @Test fun borrowedBanksQueueForTheExecutingActorWithoutCoordinateScaling() {
        for(width in listOf(320,640,1008)) {
            val w=fight();val bank=FightingCharacter(definition(helperState+c("flag=F+a","Time=0",700),width),3)
            w.p2.facingRight=false;w.p2.enterAuthoredState(700,bank,w.issues);w.step();w.step()
            assertEquals(InputFrame(Directions.L,setOf('a')),latest(w.p2));assertEquals(InputFrame(),bank.pendingAssertedInput)
            assertEquals(InputFrame(),latest(w.p1));assertTrue(w.issues.isEmpty())
        }
    }
    @Test fun inspectionAndPresentationCannotConsumeTheQueueOrResampleInput() {
        val w=fight(c("flag=F+a","Time=0"));w.step();val pending=w.p1.pendingAssertedInput;val sampled=latest(w.p1);val checksum=w.checksum()
        repeat(10){CorePresentationPlanner.snapshot(w,12);CoreAssertedInputs.buttonsMask(w.p1.pendingAssertedInput)}
        assertSame(pending,w.p1.pendingAssertedInput);assertEquals(sampled,latest(w.p1));assertEquals(checksum,w.checksum())
    }
    @Test fun separateFightsDoNotShareAssertedInputs() {
        val a=fight();val b=fight();execute(a.p1,"flag=a");a.step();b.step()
        assertEquals(setOf('a'),latest(a.p1).buttons);assertEquals(InputFrame(),latest(b.p1))
    }
    @Test fun assertedBackCanGuardAnAcceptedContactOnTheNextTick() {
        val attack="[Statedef 200]\ntype=S\nphysics=N\nanim=200\n[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\n"+
            "damage=10,2\nguardflag=HL"
        val w=fight(attack,c("flag=B","Time=0"));w.p1.posX=0;w.p2.posX=5*256;w.p2.facingRight=false
        w.step();w.p1.changeState(200);w.step();assertEquals(1,w.contacts.size);assertTrue(w.contacts.single().guarded)
        assertEquals(998,w.p2.life);assertEquals(Directions.R,latest(w.p2).directions)
    }
}
