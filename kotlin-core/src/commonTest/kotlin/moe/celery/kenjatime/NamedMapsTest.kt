package moe.celery.kenjatime

import kotlin.test.*

class NamedMapsTest {
    private val air="[Begin Action 0]\n0,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nanim=0"
    private fun c(type: String,params: String="",trigger: String="1",state: Int=0)=
        "[State $state, map]\ntype=$type\ntrigger1=$trigger\n$params"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("named maps",air,"$idle\n$extra",
        defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="")=DeterministicFight(FightingCharacter(definition(extra),1),FightingCharacter(definition(),2))
    private fun execute(actor: FightingCharacter,type: String,params: String,errors: MutableSet<String>) {
        CoreNamedMaps.execute(actor,MugenCnsParser.parse(c(type,params)).getValue(0).controllers.single(),errors)
    }
    private fun read(actor: FightingCharacter,key: String)=actor.namedMaps.read(key)
    private fun helper(w: DeterministicFight,parent: FightingCharacter=w.p1): FightingCharacter {
        w.entities.add(listOf(EntityRequest.Helper(parent,9,0,0,0,1,false,0)),w.issues)
        return w.entities.helpers.last().actor
    }
    @Test fun missingReadsReturnZeroWithoutAllocatingEntries() {
        val w=fight();repeat(8){assertEquals(0.0,CoreExpression.number("map(missing)",w.p1,w.issues))}
        assertEquals(0,w.p1.namedMaps.size);assertTrue(w.issues.isEmpty())
    }
    @Test fun defaultsAcceptLiteralsConstantExpressionsAndRepeatedCaseInsensitiveKeys() {
        val d=definition("[Map]\nScore=1.25\nother=max(2,3)*2\n[Map]\nSCORE=-2.5\nsmall=1e-4")
        val a=FightingCharacter(d,1);assertEquals(-2.5,read(a,"SCORE"));assertEquals(6.0,read(a,"other"))
        assertEquals(.0001.toFloat().toDouble(),read(a,"small"));assertEquals(3,a.namedMaps.size)
    }
    @Test fun invalidDefaultsDiagnoseWithoutDiscardingValidEntries() {
        val d=definition("[Map]\ngood=3.5\nbad=Time\ninfinite=1e300\nzero=1/0\ntext=word")
        val w=DeterministicFight(FightingCharacter(d,1),FightingCharacter(definition(),2))
        assertEquals(3.5,read(w.p1,"good"));assertEquals(1,w.p1.namedMaps.size)
        assertEquals(4,w.issues.count{it.startsWith("Invalid Map default")})
    }
    @Test fun actorStoresDoNotShareDefinitionOrSiblingMutations() {
        val d=definition("[Map]\nscore=1");val a=FightingCharacter(d,1);val b=FightingCharacter(d,2)
        a.namedMaps.write("score",9.0,false);assertEquals(1.0,read(b,"score"));assertEquals(1.0,d.initialMaps["score"])
    }
    @Test fun setAddAndLaterControllersSeeImmediateActorLocalValues() {
        val w=fight(c("MapSet","map=score\nvalue=1.25")+"\n"+c("MapAdd","map=SCORE\nvalue=-.5")+"\n"+
            c("VarSet","fv=0\nvalue=map(\"score\")"))
        w.step();assertEquals(.75,read(w.p1,"Score"));assertEquals(.75,w.p1.fvars[0]);assertEquals(0.0,read(w.p2,"score"))
    }
    @Test fun quotedBareAndUnicodeNamesReadTheSameOwnedStore() {
        val w=fight();execute(w.p1,"MapSet","map=Counter\nvalue=4.75",w.issues)
        execute(w.p1,"MapSet","map=初期\nvalue=2.5",w.issues)
        for(raw in listOf("map(counter)","map(\"COUNTER\")","map('Counter')"))
            assertEquals(4.75,CoreExpression.number(raw,w.p1,w.issues))
        assertEquals(2.5,CoreExpression.number("map(\"初期\")",w.p1,w.issues))
    }
    @Test fun quotedCommaAndSemicolonNamesStaySingleKeys() {
        val w=fight();execute(w.p1,"MapSet","map=\"combo, first; second\"\nvalue=3.25",w.issues)
        assertEquals(3.25,CoreExpression.number("map(\"combo, first; second\")",w.p1,w.issues));assertTrue(w.issues.isEmpty())
    }
    @Test fun readsRejectWrongArityDynamicOrNumericKeysWithoutInsertion() {
        val w=fight()
        for(raw in listOf("map()","map(1)","map(a,b)","map(var(0))","map(\"\")"))
            assertNull(CoreExpression.number(raw,w.p1,w.issues))
        assertEquals(0,w.p1.namedMaps.size);assertEquals(5,w.issues.size)
    }
    @Test fun numericStoresUseSinglePrecisionAfterEachWriteAndAddition() {
        val w=fight();execute(w.p1,"MapSet","map=precision\nvalue=16777216",w.issues)
        execute(w.p1,"MapAdd","map=precision\nvalue=1",w.issues);assertEquals(16777216.0,read(w.p1,"precision"))
        execute(w.p1,"MapSet","map=fraction\nvalue=.1",w.issues);execute(w.p1,"MapAdd","map=fraction\nvalue=.2",w.issues)
        assertEquals((.1.toFloat().toDouble()+.2).toFloat().toDouble(),read(w.p1,"fraction"))
    }
    @Test fun additionsToMissingKeysStartAtZeroAndSignedZeroIsCanonical() {
        val w=fight();execute(w.p1,"MapAdd","map=missing\nvalue=-2.5",w.issues)
        assertEquals(-2.5,read(w.p1,"missing"));execute(w.p1,"MapSet","map=zero\nvalue=-0",w.issues)
        assertEquals(0.0,read(w.p1,"zero"));assertFalse(w.p1.namedMaps.json().contains("-0.0"))
    }
    @Test fun malformedRequestsLeaveEarlierValuesAndKeyCountUntouched() {
        for(type in listOf("MapSet","MapAdd"))for(params in listOf("map=score","value=2","map=\nvalue=2",
            "map=score\nvalue=unknown","map=score\nvalue=1/0","map=score\nvalue=2\nindex=1",
            "map=${"x".repeat(129)}\nvalue=2","map=a\u0000b\nvalue=2")) {
            val w=fight("[Map]\nscore=3.5");execute(w.p1,type,params,w.issues)
            assertEquals(3.5,read(w.p1,"score"));assertEquals(1,w.p1.namedMaps.size);assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun nonfiniteInputsAndSinglePrecisionOverflowAreAtomic() {
        for(value in listOf(Double.MAX_VALUE,Double.NaN,Double.POSITIVE_INFINITY)) {
            val w=fight("[Map]\nscore=3.5");w.p1.fvars[0]=value
            execute(w.p1,"MapSet","map=score\nvalue=fvar(0)",w.issues)
            assertEquals(3.5,read(w.p1,"score"));assertTrue(w.issues.isNotEmpty())
        }
        val w=fight();w.p1.namedMaps.write("max",Float.MAX_VALUE.toDouble(),false)
        w.p1.fvars[0]=Float.MAX_VALUE.toDouble();execute(w.p1,"MapAdd","map=max\nvalue=fvar(0)",w.issues)
        assertEquals(Float.MAX_VALUE.toDouble(),read(w.p1,"max"));assertTrue(w.issues.isNotEmpty())
    }
    @Test fun boundedCapacityAllowsExistingKeysToBeUpdatedAtTheLimit() {
        val maps=CoreNamedMaps();repeat(4096){maps.write("k$it",it.toDouble(),false)}
        assertFailsWith<IllegalArgumentException>{maps.write("extra",1.0,false)}
        maps.write("K0",.5,true);assertEquals(.5,maps.read("k0"));assertEquals(4096,maps.size)
        assertFailsWith<IllegalArgumentException>{maps.write("x".repeat(128),0.0,false)}
    }
    @Test fun maximumKeyLengthIsAcceptedAndLongerNamesAreRejected() {
        val maps=CoreNamedMaps();maps.write("x".repeat(128),2.0,false)
        assertEquals(2.0,maps.read("X".repeat(128)));assertFailsWith<IllegalArgumentException>{maps.write("x".repeat(129),1.0,false)}
    }
    @Test fun stateChangesAndPersistentZeroDoNotResetOwnedMaps() {
        val w=fight(c("MapAdd","map=score\nvalue=1\npersistent=0"));repeat(3){w.step()}
        assertEquals(1.0,read(w.p1,"score"));w.p1.changeState(0);w.step();assertEquals(2.0,read(w.p1,"score"))
    }
    @Test fun periodicPersistenceUsesTheExistingActivationRules() {
        val w=fight(c("MapAdd","map=score\nvalue=.5\npersistent=2"));repeat(5){w.step()}
        assertEquals(1.5,read(w.p1,"score"))
    }
    @Test fun pauseGatingControlsBothLocalAndRootWrites() {
        for(ignore in 0..1) {
            val w=fight(c("MapAdd","map=score\nvalue=1\nignorehitpause=$ignore"));w.p1.hitPauseLeft=2
            repeat(2){w.step()};assertEquals(if(ignore==1)2.0 else 0.0,read(w.p1,"score"));assertEquals(0,w.p1.timeInState)
            w.step();assertEquals(if(ignore==1)3.0 else 1.0,read(w.p1,"score"))
            val root=fight(c("RootMapAdd","map=score\nvalue=1\nignorehitpause=$ignore"))
            val h=helper(root);h.hitPauseLeft=2;repeat(2){root.step()}
            assertEquals(if(ignore==1)2.0 else 0.0,read(root.p1,"score"));assertEquals(0.0,read(h,"score"))
            root.step();assertEquals(if(ignore==1)3.0 else 1.0,read(root.p1,"score"))
        }
    }
    @Test fun helpersStartFromDefaultsInsteadOfTheParentsCurrentStore() {
        val w=fight("[Map]\nscore=1");w.p1.namedMaps.write("score",9.0,false);val h=helper(w)
        assertEquals(1.0,read(h,"score"));h.namedMaps.write("score",5.0,false)
        assertEquals(9.0,read(w.p1,"score"))
    }
    @Test fun rootControllersOnRootActorsHaveNoEffect() {
        val w=fight("[Map]\nscore=1")
        for(type in listOf("RootMapSet","RootMapAdd"))execute(w.p1,type,"map=score\nvalue=4",w.issues)
        assertEquals(1.0,read(w.p1,"score"));assertTrue(w.issues.isEmpty())
    }
    @Test fun rootControllersWriteTheTopmostRootUsingExecutingHelperExpressions() {
        val w=fight("[Map]\nscore=1");val parent=helper(w);val child=helper(w,parent)
        child.vars[0]=3;child.namedMaps.write("own",.25,false)
        execute(child,"RootMapSet","map=score\nvalue=var(0)+map(own)",w.issues)
        execute(child,"RootMapAdd","map=SCORE\nvalue=1.5",w.issues)
        assertEquals(4.75,read(w.p1,"score"));assertEquals(1.0,read(parent,"score"));assertEquals(1.0,read(child,"score"))
        assertEquals(0.0,read(w.p2,"score"))
    }
    @Test fun destroyedRootsAndCyclicParentChainsCannotReceiveWrites() {
        val w=fight("[Map]\nscore=1");val h=helper(w);w.p1.destroyed=true
        execute(h,"RootMapSet","map=score\nvalue=4",w.issues);assertEquals(1.0,read(w.p1,"score"))
        w.p1.destroyed=false;w.p1.parent=h
        execute(h,"RootMapAdd","map=score\nvalue=4",w.issues);assertEquals(1.0,read(w.p1,"score"));assertTrue(w.issues.isNotEmpty())
    }
    @Test fun borrowedBanksKeepExecutingMapsVariablesAndRootOwnership() {
        val w=fight("[Map]\nscore=1");val h=helper(w)
        val bank=FightingCharacter(definition("[Map]\nscore=90\n[Statedef 700]\ntype=S\nphysics=N\nanim=0\n"+
            c("MapAdd","map=score\nvalue=var(0)+.5",state=700)+"\n"+
            c("RootMapAdd","map=score\nvalue=map(score)",state=700),640),9)
        h.vars[0]=2;bank.vars[0]=50;h.enterAuthoredState(700,bank,w.issues);w.step()
        assertEquals(3.5,read(h,"score"));assertEquals(4.5,read(w.p1,"score"));assertEquals(90.0,read(bank,"score"))
        h.changeState(0,h);assertEquals(3.5,read(h,"score"))
    }
    @Test fun identicalCachedExpressionsRemainActorAndFightSpecific() {
        val a=fight("[Map]\nscore=1");val b=fight("[Map]\nscore=2")
        repeat(3) { assertEquals(1.0,CoreExpression.number("map(score)",a.p1,a.issues));assertEquals(2.0,CoreExpression.number("map(score)",b.p1,b.issues)) }
    }
    @Test fun logicalMapWritesDoNotChangePositionsContactsOrMeters() {
        val a=fight(c("MapAdd","map=score\nvalue=1"));val b=fight()
        repeat(5){a.step();b.step()};assertEquals(b.checksum(),a.checksum());assertEquals(0,a.p1.power)
        assertEquals(b.contacts,a.contacts);assertEquals(5.0,read(a.p1,"score"))
    }
    @Test fun definitionDefaultsAreRestoredByCreatingAFreshFight() {
        val d=definition("[Map]\nscore=1\n"+c("MapAdd","map=score\nvalue=1"))
        val w=DeterministicFight(FightingCharacter(d,1),FightingCharacter(d,2));w.step();w.step()
        assertEquals(3.0,read(w.p1,"score"));assertEquals(1.0,read(FightingCharacter(d,3),"score"))
    }
    @Test fun snapshotEscapingPreservesQuotesBackslashesAndControlCharacters() {
        val maps=CoreNamedMaps();maps.write("a\"b\\c\t",1.25,false)
        assertEquals("{\"a\\\"b\\\\c\\u0009\":1.25}",maps.json())
    }
    @Test fun immutableReadsAndPresentationCannotAddOrResetNamedState() {
        val w=fight(c("MapAdd","map=score\nvalue=.5"));w.step();val before=w.checksum();val json=w.p1.namedMaps.json()
        repeat(8){CoreExpression.number("map(missing)+map(score)",w.p1,w.issues);CorePresentationPlanner.snapshot(w,12)}
        assertEquals(json,w.p1.namedMaps.json());assertEquals(before,w.checksum());assertEquals(1,w.p1.namedMaps.size)
    }
}
