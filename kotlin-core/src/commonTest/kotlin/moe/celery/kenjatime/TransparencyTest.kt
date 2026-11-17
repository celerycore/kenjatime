package moe.celery.kenjatime

import kotlin.test.*

class TransparencyTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=-40,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private fun c(params: String,trigger: String="1",state: Int=0)=
        "[State $state, transparency]\ntype=Trans\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",source: String=air,width: Int=320)=FighterDefinition.fromScript("trans",source,"$idle\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(a: String="",b: String="",source: String=air)=DeterministicFight(
        FightingCharacter(definition(a,source),1),FightingCharacter(definition(b),2))
    private fun execute(w: DeterministicFight,params: String) {
        val ctl=MugenCnsParser.parse("$idle\n${c(params)}").getValue(0).controllers.single()
        CoreTransparency.execute(w.p1,ctl,w.issues)
    }
    private fun blend(w: DeterministicFight,kind: String="fighter")=Regex("\\\"kind\\\":\\\"$kind\\\"[^}]*?\\\"blend\\\":(\\{[^}]+})")
        .find(CorePresentationPlanner.snapshot(w,0))!!.groupValues[1]
    private fun transparentAir(flag: String)=air.replace("0,0,0,0,-1","0,0,0,0,-1,H,$flag")
    @Test fun ordinaryAirUsesNormalBlendingWithoutAnOverride() {
        val w=fight();assertNull(w.p1.drawBlend);assertEquals(SpriteBlend.NORMAL.json(),blend(w))
    }
    @Test fun airParserRetainsTransparencySeparateFromFlipAndCollisionBoxes() {
        val frame=MugenAirParser.parse(transparentAir("AS128D64")).getValue(0).frames.single()
        assertEquals("H",frame.flip);assertEquals("AS128D64",frame.transparency)
        assertEquals(SpriteBlend("add",128,64),frame.blend);assertEquals(1,frame.boxes.size)
    }
    @Test fun allSupportedAirFlagsResolveIncludingCaseAndZeroPaddedAlphas() {
        for((raw,expected) in listOf("" to SpriteBlend.NORMAL,"A" to SpriteBlend.ADD,"a1" to SpriteBlend("add",256,128),
            "S" to SpriteBlend.SUB,"as000d256" to SpriteBlend("add",0,256),"AS256D000" to SpriteBlend("add",256,0))) {
            val w=fight(source=transparentAir(raw));assertEquals(expected.json(),blend(w),raw);assertTrue(w.issues.isEmpty(),raw)
        }
    }
    @Test fun invalidAirFlagsAreDiagnosedOnceAndUseASafeNormalFallback() {
        for(raw in listOf("unknown","AS257D0","AS1D-1","AS1D","AS9999D0")) {
            val w=fight(source=transparentAir(raw));assertEquals(SpriteBlend.NORMAL.json(),blend(w))
            assertTrue(w.issues.any { it.startsWith("Unsupported AIR transparency in action 0:") })
            val issues=w.issues.toSet();repeat(4){CorePresentationPlanner.snapshot(w,12)};assertEquals(issues,w.issues)
        }
    }
    @Test fun controllerDefaultsCoverEveryDocumentedMode() {
        val expected=mapOf("default" to null,"none" to SpriteBlend.NORMAL,"add" to SpriteBlend.ADD,
            "addalpha" to SpriteBlend("add",256,0),"add1" to SpriteBlend("add",256,128),"sub" to SpriteBlend.SUB)
        for((mode,result)in expected) {
            val w=fight();execute(w,"trans=$mode");assertEquals(result,w.p1.drawBlend,mode)
            assertEquals((result ?: SpriteBlend.NORMAL).json(),blend(w),mode)
        }
    }
    @Test fun defaultRestoresAirAfterAnEarlierControllerOverride() {
        val w=fight(source=transparentAir("AS32D64"));execute(w,"trans=none");execute(w,"trans=default")
        assertNull(w.p1.drawBlend);assertEquals(SpriteBlend("add",32,64).json(),blend(w))
    }
    @Test fun noneOverridesAdditiveAndSubtractiveAir() {
        for(raw in listOf("A","A1","S","AS64D128")) {
            val w=fight(source=transparentAir(raw));execute(w,"trans=none");assertEquals(SpriteBlend.NORMAL.json(),blend(w))
        }
    }
    @Test fun allAdditiveAliasesAcceptExplicitSourceAndDestinationAlphas() {
        for(mode in listOf("add","addalpha","add1")) {
            val w=fight();execute(w,"trans=$mode\nalpha=32,192");assertEquals(SpriteBlend("add",32,192),w.p1.drawBlend)
        }
    }
    @Test fun integerAlphaExpressionsTruncateAfterValidation() {
        val w=fight();w.p1.vars[0]=128;execute(w,"trans=add\nalpha=ifelse(var(0),var(0)+.9,0),min(64.9,100)")
        assertEquals(SpriteBlend("add",128,64),w.p1.drawBlend)
    }
    @Test fun zeroAndFullAlphaEndpointsAreKeptExactly() {
        for(source in listOf(0,256))for(destination in listOf(0,256)) {
            val w=fight();execute(w,"trans=add\nalpha=$source,$destination")
            assertEquals(SpriteBlend("add",source,destination),w.p1.drawBlend)
        }
    }
    @Test fun alphaDoesNotChangeTheFixedNoneSubOrDefaultModes() {
        for(mode in listOf("none","sub","default")) {
            val w=fight();execute(w,"trans=$mode\nalpha=1,2")
            assertEquals(when(mode){"none" -> SpriteBlend.NORMAL;"sub" -> SpriteBlend.SUB;else -> null},w.p1.drawBlend)
        }
    }
    @Test fun quotedCaseInsensitiveModeNamesAreSupported() {
        val w=fight();execute(w,"trans=\"AdD1\"");assertEquals(SpriteBlend("add",256,128),w.p1.drawBlend)
    }
    @Test fun invalidRequestsPreserveTheWholePreviousOverride() {
        for(params in listOf("","trans=unknown","trans=\"add","trans=add\nalpha=1","trans=add\nalpha=1,2,3",
            "trans=add\nalpha=,2","trans=add\nalpha=1,","trans=add\nalpha=257,2","trans=add\nalpha=-.1,2",
            "trans=none\nalpha=1/0,2","trans=add\nalpha=128,unknown","trans=sub\nredirectid=2")) {
            val w=fight();execute(w,"trans=add\nalpha=32,64");val prior=w.p1.drawBlend;execute(w,params)
            assertSame(prior,w.p1.drawBlend,params);assertTrue(w.issues.any{it.startsWith("Invalid Trans:")},params)
        }
    }
    @Test fun lastValidControllerWinsWhileInvalidLaterControllersDoNotPartlyApply() {
        val w=fight("${c("trans=none")}\n${c("trans=add1\nalpha=64,128")}\n${c("trans=add\nalpha=256,unknown")}")
        w.step();assertEquals(SpriteBlend("add",64,128),w.p1.drawBlend)
    }
    @Test fun controllerOverrideExpiresBeforeTheNextActiveControllerPass() {
        val w=fight(c("trans=none","Time=0"),source=transparentAir("A"));w.step()
        assertEquals(SpriteBlend.NORMAL.json(),blend(w));w.step();assertNull(w.p1.drawBlend);assertEquals(SpriteBlend.ADD.json(),blend(w))
    }
    @Test fun persistentZeroRearmsOnStateEntry() {
        val w=fight(c("trans=sub\npersistent=0"));w.step();assertEquals(SpriteBlend.SUB,w.p1.drawBlend)
        w.step();assertNull(w.p1.drawBlend);w.p1.changeState(0);w.step();assertEquals(SpriteBlend.SUB,w.p1.drawBlend)
    }
    @Test fun mugen11TickResetAlsoAppliesDuringHitpause() {
        val w=fight(c("trans=sub","Time=0"),source=transparentAir("A"));w.step();w.p1.hitPauseLeft=2
        repeat(2){w.step();assertNull(w.p1.drawBlend);assertEquals(SpriteBlend.ADD.json(),blend(w));assertEquals(1,w.p1.timeInState)}
    }
    @Test fun ignorehitpauseCanReassertAnOverrideOnEveryPausedTick() {
        val w=fight(c("trans=add\nalpha=var(0),128\nignorehitpause=1"));w.p1.hitPauseLeft=2
        for(alpha in listOf(32,64)){w.p1.vars[0]=alpha;w.step();assertEquals(SpriteBlend("add",alpha,128),w.p1.drawBlend)}
        assertEquals(0,w.p1.timeInState)
    }
    @Test fun airTransparencyAdvancesWithFramesAndRemainsOnThePausedFrame() {
        val source="[Begin Action 0]\n0,0,0,0,2,,A\n0,0,0,0,-1,,S"
        val w=fight(source=source);w.step();assertEquals(SpriteBlend.ADD.json(),blend(w));w.p1.hitPauseLeft=2
        repeat(2){w.step();assertEquals(SpriteBlend.ADD.json(),blend(w))};w.step();assertEquals(SpriteBlend.SUB.json(),blend(w))
    }
    @Test fun aSameTickStateChangeDoesNotClearAnAlreadyExecutedOverride() {
        val w=fight(c("trans=sub"));w.step();w.p1.changeState(200);assertEquals(SpriteBlend.SUB.json(),blend(w))
        w.step();assertEquals(SpriteBlend.NORMAL.json(),blend(w))
    }
    @Test fun helpersHaveTheirOwnOverrideWithoutChangingTheirRoots() {
        val w=fight("[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+c("trans=sub",state=700))
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,700,0,0,1,false,0)),w.issues);w.step()
        assertNull(w.p1.drawBlend);assertEquals(SpriteBlend.NORMAL.json(),blend(w));assertEquals(SpriteBlend.SUB.json(),blend(w,"helper"))
    }
    @Test fun ownerTransDoesNotPropagateIntoProjectilesOrExplods() {
        val w=fight(c("trans=sub")+"\n[State 0, effect]\ntype=Explod\ntrigger1=Time=0\nanim=0\nremovetime=-1\n"+
            "[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nprojremovetime=10")
        w.p2.posX=100*256;w.step();assertEquals(SpriteBlend.SUB.json(),blend(w))
        assertEquals(SpriteBlend.NORMAL.json(),blend(w,"projectile"));assertEquals(SpriteBlend.NORMAL.json(),blend(w,"explod"))
    }
    @Test fun projectileAndExplodAirFlagsAreResolvedIndependently() {
        val source=air.replace("200,0,0,0,-1","200,0,0,0,-1,,AS64D192")
        val w=fight("[State 0, effect]\ntype=Explod\ntrigger1=Time=0\nanim=200\nremovetime=-1\n"+
            "[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nprojremovetime=10",source=source)
        w.p2.posX=100*256;w.step();assertEquals(SpriteBlend("add",64,192).json(),blend(w,"projectile"))
        assertEquals(SpriteBlend("add",64,192).json(),blend(w,"explod"))
    }
    @Test fun borrowedBankExpressionsUseTheExecutingActorWithoutCoordinateScaling() {
        for(width in listOf(320,640,1008)) {
            val w=fight();val bank=FightingCharacter(definition("[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+
                c("trans=add\nalpha=var(0),128",state=700),width=width),3)
            bank.vars[0]=32;w.p1.vars[0]=64;w.p1.enterAuthoredState(700,bank,w.issues);w.step()
            assertEquals(SpriteBlend("add",64,128),w.p1.drawBlend);assertNull(bank.drawBlend)
        }
    }
    @Test fun borrowedAnimationFlagsFollowAnimationOwnershipAfterSelfState() {
        val w=fight();val bank=FightingCharacter(definition("[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+
            "[State 700, art]\ntype=ChangeAnim2\ntrigger1=Time=0\nvalue=0",source=transparentAir("S")),3)
        w.p1.enterAuthoredState(700,bank,w.issues);w.step();assertEquals(SpriteBlend.SUB.json(),blend(w))
        w.p1.changeState(1234,w.p1);assertSame(bank,w.p1.animationOwner);assertEquals(SpriteBlend.SUB.json(),blend(w))
    }
    @Test fun fullyTransparentSpritesRemainPhysicalAndCanConnectAnAttack() {
        val w=fight("[Statedef 200]\ntype=S\nphysics=N\nanim=200\n"+c("trans=add\nalpha=0,256",state=200)+
            "\n[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=10")
        w.p1.posX=0;w.p2.posX=5*256;w.p1.changeState(200);w.step()
        assertEquals(990,w.p2.life);assertEquals(1,w.contacts.size);assertEquals(SpriteBlend("add",0,256).json(),blend(w))
    }
    @Test fun transparencyNeverChangesGeometryMovementPowerOrPhysicalChecksums() {
        val a=fight(c("trans=sub"));val b=fight();a.p1.velX=256;b.p1.velX=256
        repeat(5){a.step();b.step();assertEquals(b.checksum(),a.checksum());assertEquals(b.p1.hurtBoxes(),a.p1.hurtBoxes())}
        assertEquals(b.p1.power,a.p1.power);assertEquals(b.p1.animation!!.elapsed,a.p1.animation!!.elapsed)
    }
    @Test fun readOnlyPresentationDoesNotClearOrAgeAnOverride() {
        val w=fight(c("trans=add1"));w.step();val state=w.p1.drawBlend;val checksum=w.checksum()
        val json=CorePresentationPlanner.snapshot(w,12);repeat(8){assertEquals(json,CorePresentationPlanner.snapshot(w,12))}
        assertSame(state,w.p1.drawBlend);assertEquals(checksum,w.checksum())
    }
    @Test fun separateFightsDoNotShareTransparencyState() {
        val a=fight();val b=fight();execute(a,"trans=sub");assertNull(b.p1.drawBlend);assertEquals(SpriteBlend.NORMAL.json(),blend(b))
    }
}
