package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

/** Migration contracts derived from the independently authored JS combat rules.
 * These are not claims of native MUGEN parity or real-archive Dark Donald / Akuma runs.
 */
class CombatParityTest {
    private val attackAir = """
        [Begin Action 200]
        Clsn2Default: 1
        Clsn2[0] = -20,-70,20,0
        Clsn1: 1
        Clsn1[0] = 0,-50,45,-15
        200,0,0,0,-1
    """.trimIndent()
    private val hurtAir = """
        [Begin Action 0]
        Clsn2: 1
        Clsn2[0] = -20,-70,20,0
        0,0,0,0,-1
    """.trimIndent()
    private fun fighter(
        id: Int,
        damage: Int = 70,
        priority: Int = 4,
        guardDamage: Int = 8,
        startAttack: Boolean = false,
        extraCns: String = ""
    ): FightingCharacter {
        val air = MugenAirParser.parse(hurtAir + "\n" + attackAir)
        val cns = MugenCnsParser.parse("""
            [Statedef 0]
            type = S
            movetype = I
            ctrl = 1
            anim = 0
            [Statedef 200]
            type = S
            movetype = A
            anim = 200
            ctrl = 0
            [State 200, Hit]
            type = HitDef
            trigger1 = Time = 0
            attr = S, NA
            hitflag = MAF
            guardflag = HL
            damage = $damage
            guard.damage = $guardDamage
            pausetime = 3,4
            ground.velocity = 2,-4
            ground.hittime = 9
            priority = $priority,Hit
            $extraCns
        """.trimIndent())
        val f = FightingCharacter(FighterDefinition("probe$id", air, cns), id)
        if (startAttack) f.changeState(200)
        return f
    }

    @Test fun prioritySuppressesLowerPriorityContact() {
        val a = fighter(1, damage = 91, priority = 6, startAttack = true)
        val b = fighter(2, damage = 22, priority = 2, startAttack = true)
        a.posX = -10 * Fixed.ONE
        b.posX = 10 * Fixed.ONE
        b.facingRight = false
        val fight = DeterministicFight(a, b)
        fight.step()
        assertEquals(1000, a.life)
        assertEquals(909, b.life)
        assertEquals(1, fight.contacts.size)
        assertEquals(1, fight.contacts[0].attacker)
    }

    @Test fun equalPriorityAllowsARealTrade() {
        val a = fighter(1, damage = 80, startAttack = true)
        val b = fighter(2, damage = 50, startAttack = true)
        a.posX = -10 * Fixed.ONE
        b.posX = 10 * Fixed.ONE
        b.facingRight = false
        val fight = DeterministicFight(a, b)
        fight.step()
        assertEquals(950, a.life)
        assertEquals(920, b.life)
        assertEquals(2, fight.contacts.size)
    }

    @Test fun physicalBackGuardsWithoutCmdAlias() {
        val a = fighter(1, startAttack = true)
        val b = fighter(2)
        b.posX = 20 * Fixed.ONE
        val fight = DeterministicFight(a, b)
        fight.step(InputFrame(), InputFrame(Directions.L))
        assertEquals(992, b.life)
        assertEquals(150, b.stateNo)
        assertTrue(fight.contacts[0].guarded)
    }

    @Test fun noGuardWithForwardOrDisabledGuardFlag() {
        val a = fighter(1, startAttack = true)
        val b = fighter(2)
        b.posX = 20 * Fixed.ONE
        val fight = DeterministicFight(a, b)
        fight.step(InputFrame(), InputFrame(Directions.R))
        assertEquals(930, b.life)
        assertFalse(fight.contacts[0].guarded)
    }

    @Test fun hitpauseFreezesBothFightersOnSubsequentTicks() {
        val a = fighter(1, startAttack = true)
        val b = fighter(2)
        b.posX = 20 * Fixed.ONE
        val fight = DeterministicFight(a, b)
        fight.step()
        assertEquals(3, a.hitPauseLeft)
        assertEquals(4, b.hitPauseLeft)
        val t1 = a.timeInState
        val t2 = b.timeInState
        repeat(3) { fight.step() }
        assertEquals(t1, a.timeInState)
        assertEquals(t2, b.timeInState)
        fight.step()
        assertEquals(t2, b.timeInState)
        assertEquals(930, b.life)
    }

    @Test fun oncePerStateAttackDoesNotRehitAfterPause() {
        val a = fighter(1, startAttack = true)
        val b = fighter(2)
        b.posX = 20 * Fixed.ONE
        val fight = DeterministicFight(a, b)
        repeat(30) { fight.step() }
        assertEquals(930, b.life)
        assertEquals(30L, fight.frame)
    }

    @Test fun globalVarSetAndCommandTriggeredTransition() {
        val cns = """
            [Statedef 0]
            type=S
            anim=0
            [Statedef 240]
            type=S
            anim=0
            [Statedef -2]
            [State -2, CPU init]
            type=VarSet
            triggerall=var(59) = 0
            trigger1=1
            v=59
            value=1
            [Statedef -1]
            [State -1, QCF]
            type=ChangeState
            triggerall=var(59)>=1
            trigger1=command = "qcf"
            value=240
        """.trimIndent()
        val cmd = MugenCommand("qcf", MugenCommandParser.parseCommandString("D, DF, F, a"))
        val a = FightingCharacter(FighterDefinition("Dark Donald style input", MugenAirParser.parse(hurtAir),
            MugenCnsParser.parse(cns)), 1, listOf(cmd))
        val b = fighter(2)
        val fight = DeterministicFight(a, b)
        fight.step(InputFrame(Directions.D))
        fight.step(InputFrame(Directions.DF))
        fight.step(InputFrame(Directions.R, setOf('a')))
        assertEquals(1, a.vars[59])
        assertEquals(240, a.stateNo)
    }

    @Test fun repeatedStateSectionsRemainOrdered() {
        val cns = """
            [Statedef 0]
            [State 0, increment once]
            type=VarAdd
            trigger1=Time=0
            v=2
            value=1
            [State 0, increment second time]
            type=VarAdd
            trigger1=Time=0
            v=2
            value=2
        """.trimIndent()
        val f = FightingCharacter(FighterDefinition("multi", states=MugenCnsParser.parse(cns)), 1)
        val w = DeterministicFight(f, fighter(2))
        w.step()
        assertEquals(3, f.vars[2])
        w.step()
        assertEquals(3, f.vars[2])
    }

    @Test fun sameInputsYieldSameChecksumOver600Frames() {
        fun replay(): String {
            val a = fighter(1, startAttack = true)
            val b = fighter(2, startAttack = true)
            a.posX = -20 * Fixed.ONE
            b.posX = 20 * Fixed.ONE
            b.facingRight = false
            val fight = DeterministicFight(a, b)
            repeat(600) { i ->
                val dir = if (i % 7 == 0) Directions.L else if (i % 3 == 0) Directions.R else 0
                fight.step(InputFrame(dir), InputFrame(if (i % 5 == 0) Directions.R else 0))
            }
            return fight.checksum()
        }
        assertEquals(replay(), replay())
    }
}
