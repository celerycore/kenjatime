package moe.celery.kenjatime

import kotlin.test.*

class ExpressionParityTest {
    private fun fighter(id: Int = 1) =
        FightingCharacter(FighterDefinition("expression probe"), id)
    private fun check(text: String, fighter: FightingCharacter, diagnostics: MutableSet<String> = linkedSetOf()) =
        CoreExpression.test(text, fighter, diagnostics)

    @Test fun arithmeticPrecedenceBooleanShortCircuitAndFunctions() {
        val f = fighter()
        f.vars[59] = 1
        assertTrue(check("var(59) = 1 && (3 + 2 * 4) = 11", f))
        assertTrue(check("ifelse(var(59), min(5,8), 0) >= 5", f))
        assertTrue(check("abs(-12) + floor(2.75) + ceil(.2) = 15", f))
        assertTrue(check("1 || (1 / 0)", f))
        assertFalse(check("0 && (1 / 0)", f))
        assertFalse(check("0 || 0", f))
        assertFalse(check("var(59) != 1", f))
        assertTrue(check("var(59) <> 0", f))
    }

    @Test fun triggersSupportPostureFacingOpponentAndUnquotedEnums() {
        val a = fighter(1)
        val b = fighter(2)
        DeterministicFight(a,b)
        a.posX = -30*Fixed.ONE
        b.posX = 25*Fixed.ONE
        assertTrue(check("StateType = S && MoveType = I && Facing = 1", a))
        assertTrue(check("p2dist x > 50 && p2bodydist x = 25", a))
        assertTrue(check("p2stateno = 0 && p2life = 1000", a))
        assertTrue(check("Power = 0 && LifeMax = 1000", a))
        assertFalse(check("StateType = A",a))
    }

    @Test fun authoredKfmStatenoRangesEvaluateWithoutDiagnostics() {
        val a = fighter()
        val errors = linkedSetOf<String>()
        a.changeState(240)
        assertTrue(check("(stateno = [200,299]) || (stateno = [400,499])",a,errors))
        assertFalse(check("stateno != [200,299]",a,errors))
        a.changeState(0)
        assertFalse(check("stateno = [200,299]",a,errors))
        assertTrue(errors.isEmpty(),errors.joinToString())
    }

    @Test fun flagMasksUseIntegerOperatorsWithMugenPrecedence() {
        val f = fighter()
        val issues = linkedSetOf<String>()
        f.vars[1] = 6
        assertTrue(check("!(var(1)&1)", f, issues))
        assertTrue(check("(~0 & (4 ^ 2 | 1)) = 7 && 0 ^^ 1", f, issues))
        assertTrue(check("4 | 0 && 0 ^^ 1", f, issues))
        assertFalse(check("0 && 1 | 2", f, issues))
        assertTrue(issues.isEmpty(), issues.joinToString())
        assertFalse(check("1.0 & 1", f, issues))
        assertFalse(check("fvar(0) & 1", f, issues))
        assertEquals(2, issues.size)
    }

    @Test fun randomIsSeededPerActorAndLogicalShortCircuitDoesNotAdvanceIt() {
        val a = fighter()
        val b = fighter()
        val issues = linkedSetOf<String>()
        val samples = mutableSetOf<Double>()
        repeat(32) {
            assertTrue(check("1 || Random", a, issues))
            val next = CoreExpression.number("Random", a, issues)!!
            assertTrue(next in 0.0..999.0)
            assertEquals(next, CoreExpression.number("Random", b, issues))
            samples.add(next)
        }
        assertTrue(samples.size > 1)
        assertTrue(issues.isEmpty(), issues.joinToString())
    }

    @Test fun previousStateTracksEachAcceptedTransition() {
        val f = fighter()
        val issues = linkedSetOf<String>()
        assertTrue(check("PrevStateNo=0", f, issues))
        f.changeState(1023)
        assertTrue(check("StateNo=1023 && PrevStateNo=0", f, issues))
        f.changeState(0)
        assertTrue(check("StateNo=0 && PrevStateNo=1023", f, issues))
        assertFalse(f.enterAuthoredState(9999, f, issues))
        assertTrue(check("PrevStateNo=1023", f, issues))
    }

    @Test fun cpuDifficultyAndOpponentTriggersReadTheCurrentFight() {
        val a = fighter(1)
        val b = fighter(2)
        val fight = DeterministicFight(a, b)
        fight.configureArena(-250, 250)
        a.posX = 100 * Fixed.ONE
        b.vars[2] = 17
        fight.step(cpuLevel = 4)
        assertTrue(check("AILevel=4 && NumEnemy=1 && EnemyNear, Var(2)=17", a, fight.issues))
        assertTrue(check("FrontEdgeDist=150 && BackEdgeBodyDist=350", a, fight.issues))
        fight.step()
        assertTrue(check("AILevel=0", a, fight.issues))
        assertTrue(fight.issues.isEmpty(), fight.issues.toString())
    }

    @Test fun commandExpressionRespectsFacingAndButtonEdge() {
        val command = MugenCommand("QCF_A", MugenCommandParser.parseCommandString("D, DF, F, a"))
        val fighter = FightingCharacter(FighterDefinition("command probe"),1, listOf(command))
        fighter.input.update(InputFrame(Directions.D))
        fighter.input.update(InputFrame(Directions.DF))
        fighter.input.update(InputFrame(Directions.R,setOf('a')))
        assertTrue(check("command = \"QCF_A\"",fighter))
        assertFalse(check("command = \"missing\"",fighter))
    }

    @Test fun unknownAndMaliciousExpressionsFailClosedWithDiagnostics() {
        val f=fighter()
        val errors=linkedSetOf<String>()
        assertFalse(check("__proto__ = 1",f,errors))
        assertFalse(check("1 / 0",f,errors))
        assertFalse(check("(var(1)",f,errors))
        assertFalse(check("missingFunction(4)",f,errors))
        assertTrue(errors.size >= 4)
        assertTrue(errors.all { it.startsWith("Unsupported expression:") })
    }

    @Test fun numericControllerParametersUseRuntimeVariablesAndArithmetic() {
        val script = """
            [Statedef 0]
            type = S
            movetype = I
            ctrl = 1
            [State 0, variable]
            type = VarSet
            trigger1 = Time = 0
            v = 8
            value = 3
            [State 0, velocity]
            type = VelSet
            trigger1 = Time = 0
            x = var(8) * 1.5
            y = -2
            [State 0, power]
            type = PowerAdd
            trigger1 = Time = 0
            value = 100 * var(8)
        """.trimIndent()
        val p=FightingCharacter(FighterDefinition("dynamic",states=MugenCnsParser.parse(script)),1)
        val w=DeterministicFight(p,fighter(2))
        w.step()
        assertEquals(3,p.vars[8])
        assertEquals(Fixed.of(4.5),p.velX)
        assertEquals(Fixed.of(-2.0),p.velY)
        assertEquals(300,p.power)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun cachedExpressionsNeverCaptureOtherFightersMutableState() {
        val a=fighter(1)
        val b=fighter(2)
        a.vars[3]=1
        b.vars[3]=5
        repeat(25) {
            assertTrue(check("var(3)=1",a))
            assertFalse(check("var(3)=1",b))
        }
    }
}
