package moe.celery.kenjatime

import kotlin.test.*

class PaletteEffectsTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nanim=0"
    private val helperState="[Statedef 700]\ntype=S\nphysics=N\nanim=0"
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=-40,-40,40,0\n200,0,0,0,-1"
    private fun c(type: String="PalFX",params: String="time=3\nadd=10,20,30",trigger: String="1",state: Int=0)=
        "[State $state, palette]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("palette",air,"$idle\n$helperState\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(a: String="",b: String="")=DeterministicFight(FightingCharacter(definition(a),1),FightingCharacter(definition(b),2)).also {it.p2.posX=100*256}
    private fun execute(actor: FightingCharacter,type: String="PalFX",params: String="time=3\nadd=10,20,30") {
        val ctl=MugenCnsParser.parse("$idle\n${c(type,params)}").getValue(0).controllers.single()
        actor.world!!.palettes.execute(actor,ctl,actor.world!!.issues)
    }
    private fun helper(w: DeterministicFight,own: Boolean=false,owner: FightingCharacter=w.p1): FightingCharacter {
        w.entities.add(listOf(EntityRequest.Helper(owner,9,700,0,0,1,false,0,ownPalette=own)),w.issues)
        return w.entities.helpers.last().actor
    }
    private fun group(w: DeterministicFight,type: String)=when(type) {"AllPalFX"->w.palettes.all;"BGPalFX"->w.palettes.background;else->w.p1.paletteEffects}
    private fun rgb(w: DeterministicFight,actor: FightingCharacter=w.p1,source: List<Int> = listOf(100,30,50))=
        CoreFightPalettes.rgb(source,w.palettes.layers(actor.paletteEffects))
    @Test fun rootsHaveIndependentEmptyOwnedPalettesAndUnchangedColors() {
        val w=fight();assertTrue(w.p1.ownPalette);assertTrue(w.p2.ownPalette);assertNotSame(w.p1.paletteEffects,w.p2.paletteEffects)
        assertNull(w.p1.paletteEffects.effect);assertNull(w.palettes.all.effect);assertNull(w.palettes.background.effect)
        assertEquals(listOf(100,30,50),rgb(w));assertTrue(CorePresentationPlanner.snapshot(w,0).contains("\"palFX\":[]"))
    }
    @Test fun defaultZeroDurationCancelsAnEarlierEffectInItsOwnScope() {
        for(type in listOf("PalFX","AllPalFX","BGPalFX")) {
            val w=fight();execute(w.p1,type);assertNotNull(group(w,type).effect);execute(w.p1,type,"");assertNull(group(w,type).effect)
        }
    }
    @Test fun finiteDurationShowsExactlyTheAuthoredNumberOfTicks() {
        for(type in listOf("PalFX","AllPalFX","BGPalFX")) {
            val w=fight(c(type,trigger="Time=0"))
            for(left in 3 downTo 1) {w.step();assertEquals(left,group(w,type).effect!!.remaining);assertEquals((3-left).toLong(),group(w,type).effect!!.age)}
            w.step();assertNull(group(w,type).effect)
        }
    }
    @Test fun indefiniteEffectsKeepAgingAndExplicitZeroStopsOnlyTheSelectedScope() {
        val w=fight();for(type in listOf("PalFX","AllPalFX","BGPalFX"))execute(w.p1,type,"time=-1\nadd=1,2,3")
        repeat(10){w.step()};assertEquals(10L,w.p1.paletteEffects.effect!!.age)
        execute(w.p1,"PalFX","time=0");assertNull(w.p1.paletteEffects.effect);assertNotNull(w.palettes.all.effect);assertNotNull(w.palettes.background.effect)
    }
    @Test fun aNewRequestReplacesAllParametersAndRestartsTheWave() {
        val w=fight();execute(w.p1,params="time=5\nadd=10,20,30\nmul=128,128,128\ncolor=0\ninvertall=1\nsinadd=10,20,30,4")
        w.step();execute(w.p1,params="time=2");val e=w.p1.paletteEffects.effect!!
        assertEquals(0L,e.age);assertEquals(listOf(0,0,0),e.add);assertEquals(listOf(256,256,256),e.mul);assertEquals(256,e.color);assertFalse(e.invert)
    }
    @Test fun integerExpressionsAreCapturedBeforeVariablesChange() {
        val w=fight(c(params="time=var(0)\nadd=ifelse(var(1),10.9,0),20.9,-30.9\nmul=128.9,256,512\ncolor=255.9\ninvertall=-.5",trigger="Time=0"))
        w.p1.vars[0]=3;w.p1.vars[1]=1;w.step();w.p1.vars[1]=0;val e=w.p1.paletteEffects.effect!!
        assertEquals(listOf(10,20,-30),e.add);assertEquals(listOf(128,256,512),e.mul);assertEquals(255,e.color);assertTrue(e.invert)
    }
    @Test fun invalidRequestsCannotPartlyReplaceExistingState() {
        val invalid=listOf("time=-2","time=36001","time=1\nadd=1,2","time=1\nmul=1,2,3,4","time=1\nadd=1,unknown,3",
            "time=1\nadd=100001,0,0","time=1\nmul=-1,0,0","time=1\nmul=65537,0,0","time=1\ncolor=257",
            "time=1\ninvertall=1/0","time=1\nsinadd=1,2,3","time=1\nsinadd=1,2,3,36001","time=1\nsinmul=1,2,3,4")
        for(type in listOf("PalFX","AllPalFX","BGPalFX"))for(params in invalid) {
            val w=fight();execute(w.p1,type);val before=group(w,type).effect;execute(w.p1,type,params)
            assertSame(before,group(w,type).effect,params);assertTrue(w.issues.isNotEmpty(),params)
        }
    }
    @Test fun sineAdditionStartsAtZeroAndAdvancesOncePerTick() {
        val w=fight(c(params="time=5\nsinadd=10,20,30,4",trigger="Time=0"))
        for(expected in listOf(listOf(0,0,0),listOf(10,20,30),listOf(0,0,0),listOf(-10,-20,-30),listOf(0,0,0))) {
            w.step();assertEquals(expected,w.p1.paletteEffects.effect!!.resolved().add)
        }
        w.step();assertNull(w.p1.paletteEffects.effect)
    }
    @Test fun negativeSinePeriodsReverseTheWaveAndZeroDisablesIt() {
        for(period in listOf(-4,0)) {
            val w=fight();execute(w.p1,params="time=4\nsinadd=10,20,30,$period");w.step()
            assertEquals(if(period==0)listOf(0,0,0) else listOf(-10,-20,-30),w.p1.paletteEffects.effect!!.resolved().add)
        }
    }
    @Test fun identityEffectsHaveAClockWithoutAVisualLayer() {
        val w=fight();execute(w.p1,params="time=3");assertNotNull(w.p1.paletteEffects.effect);assertTrue(w.palettes.layers(w.p1.paletteEffects).isEmpty())
    }
    @Test fun grayscaleInvertAddAndMultiplyFollowTheDocumentedOrder() {
        val layer=CorePaletteLayer(listOf(10,0,-10),listOf(256,128,512),0,true)
        assertEquals(listOf(211,100,255),CoreFightPalettes.rgb(listOf(100,30,50),listOf(layer)))
    }
    @Test fun additionPrecedesMultiplicationAndChannelsSaturate() {
        val w=fight();execute(w.p1,params="time=3\nadd=20,-100,1000\nmul=128,256,65536")
        assertEquals(listOf(60,0,255),rgb(w))
    }
    @Test fun colorLevelZeroIsLuminanceAndFullColorIsAnExactIdentity() {
        val w=fight();execute(w.p1,params="time=3\ncolor=0");assertEquals(listOf(53,53,53),rgb(w))
        execute(w.p1,params="time=3\ncolor=256");assertEquals(listOf(100,30,50),rgb(w))
    }
    @Test fun localLayersPrecedeAllPalFxAndBackgroundEffectsDoNotChangeActors() {
        val w=fight();execute(w.p1,params="time=3\nadd=10,0,0")
        execute(w.p1,"AllPalFX","time=3\nmul=128,128,128");execute(w.p1,"BGPalFX","time=3\nadd=0,20,0")
        assertEquals(listOf(55,15,25),rgb(w));assertEquals(listOf(50,15,25),rgb(w,w.p2))
    }
    @Test fun backgroundAndAllEffectsAlsoResolveStageAndHudColors() {
        val w=fight();execute(w.p1,"BGPalFX","time=3\nadd=0,10,0");execute(w.p1,"AllPalFX","time=3\ninvertall=1")
        val colors=w.palettes.colors();assertTrue(colors.contains("\"backdrop\":[239,210,199]"),colors)
        assertTrue(colors.contains("\"life1\":[106,30,112]"),colors)
    }
    @Test fun environmentColorKeepsAuthoredStateWhilePresentationResolvesItsPalette() {
        val w=fight();val ctl=MugenCnsParser.parse("$idle\n[State 0, fill]\ntype=EnvColor\ntrigger1=1\ntime=3\nvalue=40,70,120").getValue(0).controllers.single()
        w.environment.execute(w.p1,ctl,w.issues);execute(w.p1,"AllPalFX","time=3\ninvertall=1")
        assertEquals(40,w.environment.color!!.red);assertTrue(w.palettes.colors().contains("\"environment\":[215,185,135]"))
    }
    @Test fun defaultHelpersShareTheParentsGroupAndOwnpalHelpersStartIndependently() {
        val w=fight();execute(w.p1);val shared=helper(w);val own=helper(w,true)
        assertSame(w.p1.paletteEffects,shared.paletteEffects);assertFalse(shared.ownPalette)
        assertNotSame(w.p1.paletteEffects,own.paletteEffects);assertTrue(own.ownPalette);assertNull(own.paletteEffects.effect)
        assertEquals(listOf(110,50,80),rgb(w,shared));assertEquals(listOf(100,30,50),rgb(w,own))
    }
    @Test fun aSharedPaletteHelperCannotReplaceItsParentsPalFx() {
        val w=fight();execute(w.p1);val h=helper(w);val before=w.p1.paletteEffects.effect
        execute(h,params="time=3\ninvertall=1");assertSame(before,w.p1.paletteEffects.effect);assertTrue(w.issues.isEmpty())
    }
    @Test fun ownpalHelpersCanRunLocalPalFxAndGlobalEffectsStillReachThem() {
        val w=fight();val h=helper(w,true);execute(h,params="time=3\nadd=20,0,0")
        execute(w.p1,"AllPalFX","time=3\nmul=128,128,128")
        assertEquals(listOf(60,15,25),rgb(w,h));assertEquals(listOf(50,15,25),rgb(w))
    }
    @Test fun nestedHelpersFollowTheImmediateParentsPaletteFamily() {
        val w=fight();val parent=helper(w,true);val child=helper(w,owner=parent)
        assertSame(parent.paletteEffects,child.paletteEffects);assertNotSame(w.p1.paletteEffects,child.paletteEffects)
    }
    @Test fun multipleSharingActorsNeverMultiplyClockAdvancement() {
        val w=fight();execute(w.p1,params="time=5\nadd=10,0,0");repeat(3){helper(w)};w.step()
        assertEquals(4,w.p1.paletteEffects.effect!!.remaining);assertEquals(1L,w.p1.paletteEffects.effect!!.age)
    }
    @Test fun hitpauseDoesNotStopTheVisualClocks() {
        val w=fight();execute(w.p1);execute(w.p1,"BGPalFX");execute(w.p1,"AllPalFX");w.p1.hitPauseLeft=5
        repeat(3){w.step()};assertNull(w.p1.paletteEffects.effect);assertNull(w.palettes.all.effect);assertNull(w.palettes.background.effect)
        assertEquals(2,w.p1.hitPauseLeft)
    }
    @Test fun ignorehitpauseControlsReassertionAndPersistentZeroRearmsOnStateEntry() {
        for(ignore in 0..1) {
            val w=fight(c(params="time=3\nignorehitpause=$ignore"));w.p1.hitPauseLeft=2;w.step()
            assertEquals(ignore==1,w.p1.paletteEffects.effect!=null)
        }
        val w=fight(c(params="time=1\npersistent=0"));w.step();w.step();assertNull(w.p1.paletteEffects.effect)
        w.p1.changeState(0);w.step();assertNotNull(w.p1.paletteEffects.effect)
    }
    @Test fun stateChangesDoNotClearPaletteEffects() {
        val w=fight();execute(w.p1);w.p1.changeState(1234);assertNotNull(w.p1.paletteEffects.effect);w.step();assertEquals(2,w.p1.paletteEffects.effect!!.remaining)
    }
    @Test fun creatorDestructionDoesNotResetASurvivingPaletteFamily() {
        val w=fight();val owner=helper(w,true);execute(owner,params="time=4\nadd=10,0,0");val child=helper(w,owner=owner)
        owner.destroyed=true;repeat(2){w.step()};assertEquals(2,child.paletteEffects.effect!!.remaining);assertEquals(listOf(110,30,50),rgb(w,child))
    }
    @Test fun helperOwnpalExpressionsAreCapturedAndInvalidRequestsDoNotSpawn() {
        for(raw in listOf("1","-.5","0")) {
            val w=fight("[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=700\nownpal=$raw")
            w.step();assertEquals(raw!="0",w.entities.helpers.single().actor.ownPalette)
        }
        val w=fight("[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=700\nownpal=unknown")
        w.step();assertTrue(w.entities.helpers.isEmpty());assertTrue(w.issues.isNotEmpty())
    }
    @Test fun projectilesInheritTheCreatorGroupUnlessOwnpalIsSet() {
        for(own in listOf(0,1)) {
            val w=fight(c()+"\n[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nprojremovetime=20\nownpal=$own")
            w.step();val shot=w.entities.projectiles.single()
            assertEquals(own==1,shot.ownPalette)
            if(own==0)assertSame(w.p1.paletteEffects,shot.paletteEffects) else {assertNotSame(w.p1.paletteEffects,shot.paletteEffects);assertNull(shot.paletteEffects.effect)}
        }
    }
    @Test fun explodsInheritTheCreatorGroupUnlessOwnpalIsSet() {
        for(own in listOf(0,1)) {
            val w=fight(c()+"\n[State 0, art]\ntype=Explod\ntrigger1=Time=0\nanim=0\nremovetime=-1\nownpal=$own")
            w.step();val effect=w.effects.all.single()
            assertEquals(own==1,effect.config.ownPalette)
            if(own==0)assertSame(w.p1.paletteEffects,effect.paletteEffects) else assertNull(effect.paletteEffects.effect)
        }
    }
    @Test fun modifyExplodCannotChangePaletteOwnershipAfterBirth() {
        val w=fight("[State 0, art]\ntype=Explod\ntrigger1=Time=0\nid=9\nanim=0\nremovetime=-1\n"+
            "[State 0, unsupported ownership change]\ntype=ModifyExplod\ntrigger1=Time=1\nid=9\nownpal=1")
        w.step();val e=w.effects.all.single();w.step();assertSame(w.p1.paletteEffects,e.paletteEffects);assertFalse(e.config.ownPalette);assertTrue(w.issues.isNotEmpty())
    }
    @Test fun invalidOwnpalExpressionsCannotQueueEffectsOrProjectiles() {
        for(type in listOf("Explod","Projectile")) {
            val params=if(type=="Explod")"anim=0" else "projanim=200"
            val w=fight("[State 0, invalid]\ntype=$type\ntrigger1=Time=0\n$params\nownpal=1/0")
            w.step();assertTrue(w.effects.all.isEmpty());assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun borrowedBanksUseExecutingValuesWithoutRescalingOrTakingOwnership() {
        for(width in listOf(320,640,1008)) {
            val w=fight();val bank=FightingCharacter(definition(c(params="time=3\nadd=var(0),0,0",state=700),width),3)
            bank.vars[0]=99;w.p1.vars[0]=17;w.p1.enterAuthoredState(700,bank,w.issues);w.step()
            assertEquals(listOf(17,0,0),w.p1.paletteEffects.effect!!.add);assertNull(bank.paletteEffects.effect)
        }
    }
    @Test fun localAndGlobalPaletteEffectsNeverChangeContactsOrPhysicalChecksums() {
        val a=fight(c()+"\n"+c("AllPalFX","time=3\ninvertall=1"));val b=fight()
        a.p1.velX=256;b.p1.velX=256;repeat(5){a.step();b.step();assertEquals(b.checksum(),a.checksum());assertEquals(b.p1.hurtBoxes(),a.p1.hurtBoxes())}
    }
    @Test fun repeatedDrawingAndInspectionNeverAgeOrReplaceAnEffect() {
        val w=fight(c(params="time=5\nsinadd=10,20,30,4",trigger="Time=0"));w.step()
        val effect=w.p1.paletteEffects.effect;val checksum=w.checksum();val plan=CorePresentationPlanner.snapshot(w,12)
        repeat(8){assertEquals(plan,CorePresentationPlanner.snapshot(w,12));w.palettes.colors();w.p1.paletteEffects.json()}
        assertSame(effect,w.p1.paletteEffects.effect);assertEquals(checksum,w.checksum())
    }
    @Test fun independentFightsDoNotShareGlobalOrActorPaletteState() {
        val a=fight();val b=fight();execute(a.p1);execute(a.p1,"AllPalFX");execute(a.p1,"BGPalFX")
        assertNull(b.p1.paletteEffects.effect);assertNull(b.palettes.all.effect);assertNull(b.palettes.background.effect)
    }
}
