package moe.celery.kenjatime

import kotlin.test.*

class ClipboardTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nanim=0"
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1"
    private fun c(type: String="DisplayToClipboard",params: String="text=\"hello\"",trigger: String="1",state: Int=0)=
        "[State $state, debug]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("clipboard",air,"$idle\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(a: String="",b: String="")=DeterministicFight(FightingCharacter(definition(a),1),FightingCharacter(definition(b),2))
    private fun execute(actor: FightingCharacter,type: String="DisplayToClipboard",params: String="text=\"hello\"") {
        val ctl=MugenCnsParser.parse("$idle\n${c(type,params)}").getValue(0).controllers.single()
        CoreClipboard.execute(actor,ctl,actor.world!!.issues)
    }
    private fun formatted(format: String,params: String=""): String {
        val w=fight();execute(w.p1,params="text=\"$format\""+if(params.isEmpty())"" else "\nparams=$params")
        assertTrue(w.issues.isEmpty(),w.issues.joinToString());return w.p1.clipboardText
    }
    @Test fun initialClipboardIsEmptyAndPlainDisplayReplacesIt() {
        val w=fight();assertEquals("",w.p1.clipboardText);execute(w.p1);assertEquals("hello",w.p1.clipboardText)
        execute(w.p1,params="text=\"new\"");assertEquals("new",w.p1.clipboardText)
    }
    @Test fun appendStartsANewLineOnlyWhenThereIsExistingText() {
        val w=fight();execute(w.p1,"AppendToClipboard");assertEquals("hello",w.p1.clipboardText)
        execute(w.p1,"AppendToClipboard","text=\"second\"");assertEquals("hello\nsecond",w.p1.clipboardText)
        execute(w.p1,"AppendToClipboard","text=\"\"");assertEquals("hello\nsecond\n",w.p1.clipboardText)
    }
    @Test fun clearAndEmptyDisplayEraseTextWithoutChangingAnyOtherActor() {
        val w=fight();execute(w.p1);execute(w.p2);execute(w.p1,"ClearClipboard","")
        assertEquals("",w.p1.clipboardText);assertEquals("hello",w.p2.clipboardText)
        execute(w.p2,params="text=\"\"");assertEquals("",w.p2.clipboardText)
    }
    @Test fun escapesSemicolonsPercentAndUnicodeArePreserved() {
        assertEquals("quote=\"; path=\\x\n    100% 猫🙂",formatted("quote=\\\"; path=\\\\x\\n\\t100%% 猫🙂"))
    }
    @Test fun quotedTextAndParamsKeepTheirAuthoredSyntaxInCnsOnly() {
        val source="$idle\n${c(params="text=\"a;b=%d\"\nparams=var(0)")}";val ctl=MugenCnsParser.parse(source).getValue(0).controllers.single()
        assertEquals("\"a;b=%d\"",ctl.params["text"]);assertEquals("var(0)",ctl.params["params"])
        assertEquals("a;b=%d",MugenDefParser.parse(source).sections.last().get("text"))
    }
    @Test fun integerWidthPrecisionFlagsAndZeroValuesFollowPrintfRules() {
        assertEquals("+00042| 42|42   |00042||0.",formatted("%+06d|% d|%-5i|%.5d|%.0d|%#.0f","42,42,42,42,0,0.0"))
        assertEquals("  042",formatted("%05.3d","42"))
    }
    @Test fun floatingWidthAlternateFormAndSignsAreSupported() {
        assertEquals("+0001.50|2.|2.00000|1.250e+01",formatted("%+08.2f|%#.0f|%#g|%.3e","1.5,2.0,2.0,12.5"))
    }
    @Test fun everyDocumentedSpecifierFormatsAnAppropriateNumericType() {
        assertEquals("3|3|1.250000|1.250000|1.250000e+00|1.250000E+00",formatted("%d|%i|%f|%F|%e|%E","3,3,1.25,1.25,1.25,1.25"))
        assertEquals("1.25|1.25",formatted("%g|%G","1.25,1.25"))
    }
    @Test fun formatTypeMismatchesUseDefaultFormattingForTheActualType() {
        val w=fight();w.p1.vars[0]=3;w.p1.fvars[0]=4.0
        execute(w.p1,params="text=\"%+08d|%+08f|%d|%f\"\nparams=1.0,1,fvar(0),var(0)")
        assertEquals("1.000000|1|4.000000|3",w.p1.clipboardText)
    }
    @Test fun arithmeticPreservesFloatingTypesEvenWhenTheValueIsIntegral() {
        assertEquals("3.000000|3|2.000000|1",formatted("%f|%f|%d|%f","1+2.0,1+2,2.0*1,2.0>1"))
    }
    @Test fun conditionalFormattingUsesTheChosenBranchTypeAndIsLazy() {
        assertEquals("2|2.000000",formatted("%f|%f","ifelse(0.0,1/0,2),ifelse(1,2.0,1/0)"))
    }
    @Test fun functionsAndSpatialTriggersRetainTheirNumericTypes() {
        assertEquals("1|2|0.000000|2.000000|0.000000",formatted("%f|%f|%f|%f|%f","floor(1.9),ceil(1.2),sin(0),max(1.0,2),Pos X"))
    }
    @Test fun exactBinaryRoundingHandlesDecimalTiesAndCarry() {
        assertEquals("2|4|2.67|1.00|1.2|10.00",formatted("%.0f|%.0f|%.2f|%.2f|%.1f|%.2f","2.5,3.5,2.675,1.005,1.25,9.999"))
    }
    @Test fun signedZeroAndTinyValuesUseStablePortableFormatting() {
        assertEquals("-0.000000|0.000000|4.940656e-324",formatted("%f|%f|%e","-0.0,0.00000001,4.9406564584124654e-324"))
    }
    @Test fun generalFormattingSwitchesAtTheRoundedExponentAndTrimsZeros() {
        assertEquals("0.0001|1e-05|1e+06|10|10.00|1.00E+06",formatted("%g|%g|%g|%.4g|%#.4g|%.2E","0.0001,0.00001,1000000.0,9.99999,9.99999,1000000.0"))
    }
    @Test fun highPrecisionMatchesTheExactBinary64Value() {
        assertEquals("0.10000000000000000555",formatted("%.20f","0.1"))
    }
    @Test fun scientificNumericLiteralsAndMalformedExponentsAreChecked() {
        assertEquals("1000.000000|0.001",formatted("%f|%.3f","1e3,1E-3"))
        for(raw in listOf("1e","1e+","1E--2","1e9999")) {
            val w=fight();execute(w.p1,params="text=\"%f\"\nparams=$raw");assertEquals("",w.p1.clipboardText);assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun upToSixNestedParametersAreEvaluatedInOrder() {
        assertEquals("1 2 3 4 5 6",formatted("%d %d %d %d %d %d","ifelse(1,min(1,2),0),max(1,2),3,4,5,6"))
    }
    @Test fun invalidMessagesCannotReplaceOrAppendToAnExistingClipboard() {
        val invalid=listOf("","text=hello","text='hello'","text=\"bad\\q\"","text=\"bad\\\"","text=\"%s\"\nparams=1",
            "text=\"%lld\"\nparams=1","text=\"%*d\"\nparams=2,3","text=\"%513d\"\nparams=1","text=\"%.21f\"\nparams=1.0",
            "text=\"%d %d\"\nparams=1","text=\"%d\"\nparams=1,2","text=\"%d\"\nparams=unknown","text=\"%f\"\nparams=1/0",
            "text=\"%d\"\nparams=\"123\"","text=\"%d\"\nparams=StateType","text=\"ok\"\nredirectid=2",
            "text=\"%d%d%d%d%d%d%d\"\nparams=1,2,3,4,5,6,7")
        for(type in listOf("DisplayToClipboard","AppendToClipboard"))for(params in invalid) {
            val w=fight();execute(w.p1);execute(w.p1,type,params);assertEquals("hello",w.p1.clipboardText,"$type $params")
            assertTrue(w.issues.any {it.startsWith("Invalid $type:")},params)
        }
    }
    @Test fun invalidClearParametersDoNotEraseTheClipboard() {
        val w=fight();execute(w.p1);execute(w.p1,"ClearClipboard","value=1");assertEquals("hello",w.p1.clipboardText)
        assertTrue(w.issues.isNotEmpty())
    }
    @Test fun rawAndFormattedSizeLimitsAreAtomic() {
        for(params in listOf("text=\"${"x".repeat(8191)}\"","text=\"${"x".repeat(8100)}%512d\"\nparams=1")) {
            val w=fight();execute(w.p1);execute(w.p1,params=params);assertEquals("hello",w.p1.clipboardText);assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun appendKeepsTheNewest8192Characters() {
        val w=fight();execute(w.p1,params="text=\"${"a".repeat(7000)}\"")
        execute(w.p1,"AppendToClipboard","text=\"${"b".repeat(2000)}\"")
        assertEquals("a".repeat(6191)+"\n"+"b".repeat(2000),w.p1.clipboardText);assertEquals(8192,w.p1.clipboardText.length)
    }
    @Test fun jsonEscapingPreservesTextWithoutInterpretingMarkup() {
        assertEquals("\"\\u0000\\u0009\\u000a\\\"\\\\猫\"",CoreClipboard.quote("\u0000\t\n\"\\猫"))
        assertEquals("<img src=x onerror=alert(1)>",formatted("<img src=x onerror=alert(1)>"))
    }
    @Test fun displayAppendAndClearExecuteInAuthoredControllerOrder() {
        val w=fight(listOf(c(params="text=\"one\""),c("AppendToClipboard","text=\"two\""),
            c("ClearClipboard",""),c("AppendToClipboard","text=\"three\"")).joinToString("\n"))
        w.step();assertEquals("three",w.p1.clipboardText)
    }
    @Test fun textPersistsAcrossTicksStateChangesAndHitReactionsUntilCleared() {
        val w=fight(c(trigger="Time=0"));w.step();w.p1.changeState(1234);repeat(3){w.step()}
        assertEquals("hello",w.p1.clipboardText);w.p1.receiveHit(HitDefinition(damage=1),true,attacker=w.p2)
        assertEquals("hello",w.p1.clipboardText)
    }
    @Test fun persistentGatingAndStateReentryApplyToAppend() {
        val w=fight(c("AppendToClipboard","text=\"one\"\npersistent=0"));repeat(3){w.step()};assertEquals("one",w.p1.clipboardText)
        w.p1.changeState(0);w.step();assertEquals("one\none",w.p1.clipboardText)
    }
    @Test fun hitpauseRequiresIgnorehitpauseForNewMessages() {
        for(ignore in 0..1) {
            val w=fight(c("AppendToClipboard","text=\"tick\"\nignorehitpause=$ignore"));w.p1.hitPauseLeft=2
            repeat(2){w.step()};assertEquals(if(ignore==1)"tick\ntick" else "",w.p1.clipboardText)
            w.step();assertEquals(if(ignore==1)"tick\ntick\ntick" else "tick",w.p1.clipboardText)
        }
    }
    @Test fun rootsAndHelpersHaveIndependentClipboards() {
        val w=fight("[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+c(params="text=\"helper\"",state=700))
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,700,0,0,1,false,0)),w.issues);execute(w.p1);w.step()
        assertEquals("hello",w.p1.clipboardText);assertEquals("helper",w.entities.helpers.single().actor.clipboardText);assertEquals("",w.p2.clipboardText)
    }
    @Test fun borrowedBanksUseExecutingVariablesAndKeepTextAfterSelfState() {
        for(width in listOf(320,640,1008)) {
            val w=fight();val bank=FightingCharacter(definition("[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+
                c(params="text=\"%d\"\nparams=var(0)",state=700),width),3)
            bank.vars[0]=3;w.p1.vars[0]=9;w.p1.enterAuthoredState(700,bank,w.issues);w.step();w.p1.changeState(1234,w.p1)
            assertEquals("9",w.p1.clipboardText);assertEquals("",bank.clipboardText)
        }
    }
    @Test fun debuggingNeverChangesPhysicalSimulationAndReadsArePure() {
        val a=fight(c(params="text=\"t=%d pos=%.2f\"\nparams=Time,Pos X"));val b=fight()
        a.p1.velX=256;b.p1.velX=256
        repeat(4){a.step();b.step();assertEquals(b.checksum(),a.checksum())}
        val text=a.p1.clipboardText;val checksum=a.checksum();repeat(10){CoreClipboard.quote(text);CorePresentationPlanner.snapshot(a,12)}
        assertEquals(text,a.p1.clipboardText);assertEquals(checksum,a.checksum())
    }
    @Test fun expressionsKeepTheirExistingValuesWhileAddingTypeMetadata() {
        val w=fight()
        for(raw in listOf("1+2.0","1/2","floor(1.9)","ifelse(0,1/0,2)","max(2,1.5)","1.0=1")) {
            assertEquals(CoreExpression.number(raw,w.p1,w.issues),CoreExpression.debugNumber(raw,w.p1).value,raw)
        }
    }
    @Test fun independentFightsDoNotShareClipboardStateOrFormatterParameters() {
        val a=fight();val b=fight();a.p1.vars[0]=1;b.p1.vars[0]=2
        execute(a.p1,params="text=\"%d\"\nparams=var(0)");execute(b.p1,params="text=\"%d\"\nparams=var(0)")
        assertEquals("1",a.p1.clipboardText);assertEquals("2",b.p1.clipboardText)
    }
}
