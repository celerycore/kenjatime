package moe.celery.kenjatime

internal data class CoreReversalDefinition(val attribute: CoreHitAttribute,val id: Int,
    val pause: Pair<Int,Int>,val p1State: Int?,val p2State: Int?,val p2OwnState: Boolean,
    val source: FightingCharacter, val presentation: ContactPresentation)
internal data class CoreReversalContact(val reverser: Int,val attacker: Int,val id: Int) {
    fun json()="{\"reverser\":$reverser,\"attacker\":$attacker,\"id\":$id}"
}

/** Reversals run before ordinary body/helper contacts and never create damage contacts. */
internal class CoreReversals(private val fight: DeterministicFight) {
    val contacts=mutableListOf<CoreReversalContact>()
    private fun actors()=listOf(fight.p1,fight.p2)+fight.entities.helpers.map {it.actor}
    private fun firstSide(actor: FightingCharacter)=actor===fight.p1 || actor.opponent===fight.p2
    private fun ready(actor: FightingCharacter)=!actor.destroyed && actor.life>0 &&
        !actor.hitPauseThisTick && !actor.globalPauseThisTick && actor.hitPauseLeft==0
    private fun eligible(reverser: FightingCharacter,attacker: FightingCharacter): Boolean {
        val reversal=reverser.activeReversal ?: return false
        val hit=attacker.activeHitDef ?: return false
        if(!ready(reverser) || !ready(attacker) || fight.pauses.unhittable(attacker) ||
            !reverser.canReverse(attacker.id) || !attacker.canHit(reverser.id))return false
        val attr=try {CoreHitAttribute.parse(hit.attr)} catch(e: IllegalArgumentException) {
            fight.issues.add("Invalid reversed attack attribute: ${e.message}");return false
        }
        return reversal.attribute.matches(attr)
    }
    fun resolve() {
        val roster=actors()
        if(roster.none {it.activeReversal!=null})return
        data class Candidate(val reverser: FightingCharacter,val attacker: FightingCharacter,val distance: Double)
        val candidates=ArrayList<Candidate>()
        val boxes=mutableMapOf<FightingCharacter,List<MugenRect>>()
        fun attacks(actor: FightingCharacter)=boxes.getOrPut(actor){actor.attackBoxes()}
        for(reverser in roster)if(reverser.activeReversal!=null)for(attacker in roster) {
            if(firstSide(reverser)==firstSide(attacker) || !eligible(reverser,attacker))continue
            if(!attacks(reverser).any {a->attacks(attacker).any {a.intersects(it)}})continue
            val x=attacker.posX.toDouble()-reverser.posX;val y=attacker.posY.toDouble()-reverser.posY
            candidates.add(Candidate(reverser,attacker,x*x+y*y))
        }
        candidates.sortWith(compareBy<Candidate>{it.distance}.thenBy {it.reverser.id}.thenBy {it.attacker.id})
        val used=mutableSetOf<FightingCharacter>()
        for(candidate in candidates) {
            val a=candidate.reverser;val b=candidate.attacker
            if(a in used || !eligible(a,b))continue
            val reversal=a.activeReversal!!
            val p2Bank=if(reversal.p2OwnState)b else reversal.source
            // A missing custom destination cannot partly consume either attack window.
            if(reversal.p2State?.let {it !in p2Bank.definition.states && !(it==0 && p2Bank===b)}==true) {
                fight.issues.add("Missing ReversalDef target state: ${reversal.p2State} (owner ${p2Bank.id})");continue
            }
            CoreContactPresentation.reversal(fight, a, b, reversal.presentation, b.activeHitDef!!.presentation)
            a.markHit(b.id);a.recordMoveContact(false)
            b.neutralizeAttack();b.recordMoveReversed()
            reversal.p2State?.let {b.enterAuthoredState(it,p2Bank,fight.issues,false)}
            reversal.p1State?.let {a.enterAuthoredState(it,reversal.source,fight.issues)}
            a.captureReversalTarget(b,reversal.id)
            a.hitPauseLeft=reversal.pause.first;b.hitPauseLeft=reversal.pause.second
            contacts.add(CoreReversalContact(a.id,b.id,reversal.id));used.add(a)
        }
    }
    fun json(): String {
        val rows=actors().joinToString(prefix="[",postfix="]",separator=",") {a ->
            "{\"id\":${a.id},\"active\":${a.activeReversal!=null},\"neutralized\":${a.hitDefReversed},"+
                "\"moveHit\":${a.moveHitTime},\"moveReversed\":${a.moveReversedTime},\"pause\":${a.hitPauseLeft},"+
                "\"state\":${a.stateNo},\"stateOwner\":${a.stateOwner.id},\"targets\":${a.targets().size}}"
        }
        return "{\"contacts\":${contacts.joinToString(prefix="[",postfix="]",separator=","){it.json()}},\"actors\":$rows}"
    }
    companion object {
        fun execute(actor: FightingCharacter,controller: StateController,source: FightingCharacter,errors: MutableSet<String>) {
            try {
                val args=controller.params
                require(args.keys.all {it in setOf("type","persistent","ignorehitpause","reversal.attr","pausetime","p1stateno","p2stateno","p2getp1state","id",
                    "sparkno","sparkxy","hitsound")}) {
                    "Unsupported ReversalDef parameter"
                }
                val attribute=CoreHitAttribute.parse(args["reversal.attr"] ?: throw IllegalArgumentException("Missing reversal.attr"))
                require(attribute.states!=0 && attribute.attacks!=0) {"reversal.attr requires state and attack attributes"}
                fun value(raw: String)=CoreExpression.number(raw,actor,errors) ?: throw IllegalArgumentException("Invalid expression")
                fun int(key: String,fallback: Int,low: Int): Int {
                    val n=args[key]?.let(::value) ?: return fallback
                    require(n in low.toDouble()..Int.MAX_VALUE.toDouble()) {"$key out of range"};return n.toInt()
                }
                val id=int("id",0,0)
                val p1=int("p1stateno",-1,-1).takeIf {it>=0};val p2=int("p2stateno",-1,-1).takeIf {it>=0}
                val own=args["p2getp1state"]?.let {value(it)==0.0} ?: false
                require(source.world==null || source.world===actor.world) {"Reversal state bank belongs to another fight"}
                require(p1==null || p1 in source.definition.states || p1==0 && source===actor) {"Missing ReversalDef p1 state: $p1"}
                require(p2==null || own || p2 in source.definition.states || p2==0 && source===actor) {"Missing ReversalDef p2 state: $p2"}
                val pause=CoreHitPauses.parse(args,actor,errors)?.hit ?: throw IllegalArgumentException("Invalid pausetime")
                actor.installReversal {
                    CoreReversalDefinition(attribute,id,pause,p1,p2,own,source,
                        CoreContactPresentation.capture(actor, args, errors, reversal = true))
                }
            }catch(e: IllegalArgumentException) {errors.add("Invalid ReversalDef: ${e.message}")}
        }
    }
}
