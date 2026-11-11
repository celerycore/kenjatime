package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

/** Rare Akuma-style synthetic entity contracts, not the original character archive. */
class EntityBehaviorTest {
    private val air = MugenAirParser.parse("""
        [Begin Action 0]
        Clsn2: 1
        Clsn2[0] = -20,-70,20,0
        0,0,0,0,-1
        [Begin Action 200]
        Clsn1: 1
        Clsn1[0] = 0,-45,40,-15
        200,0,0,0,-1
        [Begin Action 300]
        Clsn1: 1
        Clsn1[0] = 0,-45,40,-15
        300,0,0,0,-1
    """.trimIndent())
    private fun actor(id: Int, cns: String): FightingCharacter =
        FightingCharacter(FighterDefinition("entity-fixture", air, MugenCnsParser.parse(cns)), id)
    private val neutral = """
        [Statedef 0]
        type=S
        movetype=I
        anim=0
        ctrl=1
    """.trimIndent()

    @Test fun helperUsesOwnStateAndSharedDefinitions() {
        val owner = actor(1, neutral + "\n" + """
            [State 0, once]
            type=Helper
            trigger1=Time=0
            id=10
            stateno=200
            pos=0,0
            keyctrl=0
            bindtime=2
            [Statedef 200]
            type=S
            movetype=A
            anim=200
            [State 200, helper hit]
            type=HitDef
            trigger1=Time=0
            attr=S, NA
            hitflag=MAF
            damage=30
            pausetime=1,1
        """.trimIndent())
        val victim = actor(2, neutral)
        victim.posX = 20 * Fixed.ONE
        val fight = DeterministicFight(owner, victim)
        fight.step()
        assertEquals(1, fight.entities.helpers.size)
        val helper = fight.entities.helpers.single().actor
        assertTrue(helper.definition === owner.definition, "Shared immutable fighter definition")
        assertTrue(helper.vars !== owner.vars, "Helpers need independent variable storage")
        assertEquals(1000, victim.life)
        fight.step()
        assertEquals(970, victim.life)
        assertTrue(fight.contacts.any { it.attacker == helper.id && it.defender == victim.id })
    }

    @Test fun projectileSpawnsMovesHitsAndIsRetired() {
        val owner = actor(1, neutral + "\n" + """
            [State 0, once]
            type=Projectile
            trigger1=Time=0
            projid=101
            projanim=300
            projdamage=45,3
            projguardflag=HL
            projhitflag=MAF
            projpausetime=0,0
            offset=0,0
            velocity=2,0
            projremovetime=20
        """.trimIndent())
        val victim = actor(2, neutral)
        victim.posX = 20 * Fixed.ONE
        val fight = DeterministicFight(owner, victim)
        fight.step()
        assertEquals(1, fight.entities.projectiles.size)
        assertEquals(1000, victim.life)
        fight.step()
        assertEquals(955, victim.life)
        assertEquals(0, fight.entities.projectiles.size)
    }

    @Test fun configuredEntityLimitsPreventUnboundedHelperAndProjectileClones() {
        val owner = actor(1, neutral + "\n" + """
            [State 0, repeat]
            type=Helper
            trigger1=1
            stateno=0
        """.trimIndent())
        val victim = actor(2, neutral)
        victim.posX = 200 * Fixed.ONE
        val fight = DeterministicFight(owner, victim)
        fight.entities.maxHelpers = 3
        repeat(20) { fight.step() }
        assertEquals(3, fight.entities.helpers.size)
        assertTrue(fight.issues.any { it.contains("Helper resource limit") })
    }

    @Test fun unknownProjectileSpriteNeverCreatesImaginaryArtwork() {
        val owner = actor(1, neutral + "\n" + """
            [State 0, missing asset]
            type=Projectile
            trigger1=Time=0
            projanim=99999
            projdamage=900
        """.trimIndent())
        val fight = DeterministicFight(owner, actor(2, neutral))
        fight.step()
        assertEquals(0, fight.entities.projectiles.size)
        assertTrue(fight.issues.any { it.contains("Projectile animation missing") })
    }
}
