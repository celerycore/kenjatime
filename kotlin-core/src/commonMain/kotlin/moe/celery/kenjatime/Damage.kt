package moe.celery.kenjatime

import kotlin.math.floor

/** Base-stat scaling only; runtime, fall and super multipliers are separate work. */
internal object CoreDamage {
    fun contact(hit: HitDefinition,attacker: FightingCharacter?,defender: FightingCharacter,guarded: Boolean): Int {
        val amount=(if(guarded)hit.guardDamage else hit.damage).coerceAtLeast(0)
        val attack=attacker?.definition?.attack ?: 100
        if(amount == 0 || attack == 0)return 0
        val scaled=amount.toDouble()*attack/defender.definition.defence
        // Positive half values round up; small but nonzero damage retains one.
        // Double arithmetic avoids intermediate Int overflow; conversion saturates.
        return floor(scaled+0.5).toInt().coerceAtLeast(1)
    }
}
