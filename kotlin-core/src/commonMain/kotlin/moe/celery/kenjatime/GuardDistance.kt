package moe.celery.kenjatime

/** Proximity is latched after controllers, never recomputed by an expression read. */
internal object CoreGuardDistance {
    private val projectileAttribute=Regex("[SCA],[NSH][ATP]")
    fun validProjectileAttribute(attr: String): Boolean =
        projectileAttribute.matches(attr.filterNot { it.isWhitespace() }.uppercase())
    private fun actors(fight: DeterministicFight)=listOf(fight.p1,fight.p2)+fight.entities.helpers.map { it.actor }
    private fun firstSide(actor: FightingCharacter,fight: DeterministicFight)=actor === fight.p1 || actor.opponent === fight.p2
    private fun inside(x: Int,face: Boolean,range: Int,target: FightingCharacter): Boolean {
        val distance=(target.posX.toLong()-x)*(if(face)1 else -1)
        return distance>0 && distance<range
    }
    fun beginPhase(fight: DeterministicFight,enabled: Boolean) {
        val roster=actors(fight)
        for(actor in roster)actor.inGuardDistance=false
        if(!enabled)return
        for(attacker in roster)if(!attacker.destroyed && attacker.moveType == "A")for(target in roster) {
            if(!target.destroyed && firstSide(attacker,fight) != firstSide(target,fight) &&
                inside(attacker.posX,attacker.facingRight,attacker.guardDistance,target))target.inGuardDistance=true
        }
    }
    fun projectile(fight: DeterministicFight,shot: CoreProjectile,finalTick: Boolean=false) {
        if(shot.cancelled || shot.hitsLeft<=0 || !shot.alive && !finalTick)return
        if(!shot.validGuardAttribute)return
        val first = firstSide(shot.owner, fight)
        latch(shot, if (first) fight.p2 else fight.p1)
        for(helper in fight.entities.helpers) {
            if (first != firstSide(helper.actor, fight)) latch(shot, helper.actor)
        }
    }
    private fun latch(shot: CoreProjectile, target: FightingCharacter) {
        if (!target.inGuardDistance && !target.destroyed &&
            inside(shot.x, shot.facingRight, shot.hit.guardDistance, target)) target.inGuardDistance = true
    }
    fun parse(args: Map<String,String>,actor: FightingCharacter,errors: MutableSet<String>,projectile: Boolean=false): Int? = try {
        val raw=args["guard.dist"] ?: if(projectile)args["projguard.dist"] else null
        if(raw == null) {
            if(projectile)actor.definition.coordinates.fixedToWorld(actor.definition.projectileAttackDistance)
            else actor.guardDistance
        }else value(raw,actor,errors)
    }catch(e: IllegalArgumentException) { errors.add("Invalid guard.dist: ${e.message}");null }
    private fun value(raw: String,actor: FightingCharacter,errors: MutableSet<String>): Int {
        val n=CoreExpression.number(raw,actor,errors) ?: throw IllegalArgumentException("Invalid expression")
        require(n in -100000.0..100000.0) { "Distance out of range" }
        return actor.coordinates.toWorld(n.toInt().coerceAtLeast(0).toDouble())
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            require(controller.params.keys.all { it in setOf("type","value","persistent","ignorehitpause") }) { "Unsupported parameter" }
            val raw=controller.params["value"] ?: throw IllegalArgumentException("Missing value")
            val distance=value(raw,actor,errors)
            actor.guardDistance=distance
            // Preserve the attack window and its struck-target set.
            actor.replaceGuardDistance(distance)
        }catch(e: IllegalArgumentException) { errors.add("Invalid AttackDist: ${e.message}") }
    }
}
