package moe.celery.kenjatime

import kotlin.test.*

class GlobalPauseTest {
    private val idle = "[Statedef 0]\ntype=S\nphysics=N\nanim=0"
    private val air = "[Begin Action 0]\n0,0,0,0,-1\n[Begin Action 10]\n0,1,0,0,1\n0,2,0,0,-1"

    private fun fight(a: String, b: String = "", commands: List<MugenCommand> = emptyList()) =
        DeterministicFight(
            FightingCharacter(FighterDefinition.fromScript("A", air, "$idle\n$a"), 1),
            FightingCharacter(FighterDefinition.fromScript("B", air, "$idle\n$b"), 2, commands)
        ).also { it.p1.posX = -40 * 256; it.p2.posX = 40 * 256 }

    @Test fun pauseStartsNextTickAndHonorsTheOwnersMoveWindow() {
        val w = fight("""
            [State 0, freeze]
            type=Pause
            trigger1=Time=0
            time=3
            movetime=1
        """.trimIndent())
        w.p1.velX = 256
        w.p2.velX = -256
        w.step()
        assertEquals(3, w.pauses.remaining)
        assertEquals(1, w.p2.timeInState)
        w.p2.hitPauseLeft = 2
        w.step()
        assertEquals(2, w.p1.timeInState)
        repeat(2) { w.step() }
        assertEquals(0, w.pauses.remaining)
        assertEquals(-38 * 256, w.p1.posX)
        assertEquals(39 * 256, w.p2.posX)
        assertEquals(2, w.p2.hitPauseLeft)
        w.step()
        assertEquals(3, w.p1.timeInState)
        assertEquals(1, w.p2.hitPauseLeft)
    }

    @Test fun superPausePreemptsAndThenResumesTheNormalPause() {
        val w = fight("""
            [State 0, normal]
            type=Pause
            trigger1=GameTime=0
            time=4
            movetime=4
            pausebg=0
            [State 0, super]
            type=SuperPause
            trigger1=GameTime=1 && PauseTime=4
            time=2
            movetime=1
            anim=S10
            pos=3,-5
            poweradd=120
        """.trimIndent())
        w.step()
        assertFalse(w.pauses.backgroundFrozen)
        w.step()
        assertTrue(w.pauses.backgroundFrozen)
        assertTrue(w.pauses.darken)
        assertEquals(120, w.p1.power)
        assertEquals(-37 * 256, w.pauses.flash!!.x)
        assertEquals(1, w.pauses.flash!!.animation.frame?.sprite)
        w.step()
        assertEquals(2, w.pauses.flash!!.animation.frame?.sprite)
        assertTrue(w.pauses.unhittable(w.p1))
        w.step()
        assertEquals(3, w.pauses.remaining)
        assertFalse(w.pauses.darken)
        assertNull(w.pauses.flash)
        assertFalse(w.pauses.unhittable(w.p1))
        repeat(3) { w.step() }
        assertEquals(1, w.p2.timeInState)
        w.step()
        assertEquals(2, w.p2.timeInState)
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun pauseRequestsDuringSuperPauseWaitAndReplaceTheEarlierNormalPause() {
        val w = fight("""
            [State 0, first]
            type=Pause
            trigger1=GameTime=0
            time=8
            [State 0, super]
            type=SuperPause
            trigger1=GameTime=0
            time=2
            movetime=1
            [State 0, replace]
            type=Pause
            trigger1=GameTime=1
            time=3
        """.trimIndent())
        w.step()
        assertEquals(2, w.pauses.remaining)
        w.step()
        assertEquals(1, w.pauses.remaining)
        w.step()
        assertEquals(3, w.pauses.remaining)
    }

    @Test fun aLateCommandIsBufferedForOneActionableTickAndAHeldEarlyPressDoesNotRepeat() {
        fun setup() = fight("""
            [State 0, freeze]
            type=Pause
            trigger1=Time=0
            time=3
            endcmdbuftime=1
        """.trimIndent(), """
            [State 0, command]
            type=VarAdd
            trigger1=command="go"
            v=0
            value=1
        """.trimIndent(), listOf(MugenCommand("go", MugenCommandParser.parseCommandString("a"))))
        val pressed = InputFrame(buttons = setOf('a'))
        val late = setup()
        repeat(3) { late.step() }
        late.step(b = pressed)
        assertEquals(0, late.p2.vars[0])
        repeat(3) { late.step() }
        assertEquals(1, late.p2.vars[0])
        val early = setup()
        early.step()
        repeat(5) { early.step(b = pressed) }
        assertEquals(0, early.p2.vars[0])
    }

    @Test fun modifyPlayerAndSpawnAllowancesMoveOnlyTheSpecifiedEntities() {
        val w = fight("""
            [State 0, helper]
            type=Helper
            trigger1=Time=0
            stateno=700
            pausemovetime=1
            [State 0, projectile]
            type=Projectile
            trigger1=Time=0
            projanim=0
            projremovetime=10
            pausemovetime=2
            [State 0, effect]
            type=Explod
            trigger1=Time=0
            anim=0
            removetime=-1
            pausemovetime=1
            [State 0, freeze]
            type=Pause
            trigger1=Time=0
            time=3
            [Statedef 700]
            type=S
            physics=N
            anim=0
        """.trimIndent(), """
            [State 0, allowance]
            type=ModifyPlayer
            trigger1=Time=0
            pausemovetime=2
        """.trimIndent())
        w.step()
        repeat(3) { w.step() }
        assertEquals(1, w.p1.timeInState)
        assertEquals(3, w.p2.timeInState)
        assertEquals(1, w.entities.helpers.single().actor.timeInState)
        assertEquals(8, w.entities.projectiles.single().ticksLeft)
        assertEquals(1L, w.effects.all.single().age)
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun malformedRequestsLeaveTimersAndPowerUnchanged() {
        val w = fight("""
            [State 0, invalid super]
            type=SuperPause
            trigger1=Time=0
            time=2
            movetime=3
            poweradd=120
            [State 0, invalid pause]
            type=Pause
            trigger1=Time=0
            pausebg=0
        """.trimIndent())
        w.step()
        assertEquals(0, w.p1.power)
        assertFalse(w.pauses.active)
        assertEquals(2, w.issues.size)
    }

    @Test fun superPauseDefenceAppliesOnlyDuringItsWindowAndLeavesAuthoredDefenceAlone() {
        val w = fight("""
            [State 0, super]
            type=SuperPause
            trigger1=Time=0
            time=1
            p2defmul=2
        """.trimIndent(), "[Statedef 0]\ntype=S\nmovetype=H\nanim=0")
        val hit = HitDefinition(damage = 100)
        w.p1.captureTarget(w.p2, 0)
        w.step()
        assertFalse(w.p1.canReceive(hit))
        assertEquals(50, CoreDamage.contact(hit, w.p1, w.p2, false))
        w.step()
        assertTrue(w.p1.canReceive(hit))
        assertEquals(100, CoreDamage.contact(hit, w.p1, w.p2, false))
        assertEquals(1.0, w.p2.defenceMultiplier)
    }
}
