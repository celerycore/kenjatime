package moe.celery.kenjatime

/** Contact eligibility is independent of guardability and attribute filters. */
internal object CoreHitFlags {
    fun parse(raw: String?,errors: MutableSet<String>): String? {
        val flags=(raw ?: "MAF").filterNot { it.isWhitespace() }.uppercase()
        if(flags.none { it in "HLMAFD" } || flags.any { it !in "HLMAFD+-" } || '+' in flags && '-' in flags) {
            errors.add("Invalid hitflag: expected HLMAFD flags with at most one of + or -")
            return null
        }
        return flags
    }

    fun allows(raw: String,actor: FightingCharacter,errors: MutableSet<String>): Boolean {
        val flags=parse(raw,errors) ?: return false
        val gettingHit=actor.moveType == "H"
        // Guard common states also use MoveType H, but are not combo follow-ups.
        val guarding=actor.stateNo == 120 || actor.stateNo in 130..132 ||
            actor.stateNo == 140 || actor.stateNo in 150..155
        if('+' in flags && (!gettingHit || guarding))return false
        if('-' in flags && gettingHit)return false
        return when(actor.stateType) {
            "S" -> 'H' in flags || 'M' in flags
            "C" -> 'L' in flags || 'M' in flags
            "A" -> 'A' in flags && (!gettingHit || !actor.getHitData.fall || 'F' in flags)
            "L" -> 'D' in flags
            else -> false
        }
    }
}
