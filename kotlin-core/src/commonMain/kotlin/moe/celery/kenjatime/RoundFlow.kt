package moe.celery.kenjatime

/** Logic-only 60 Hz sequence. Rendering of ROUND/FIGHT/KO text belongs to the UI. */
enum class CoreRoundPhase { INTRO, ROUND, FIGHT_CUE, ACTIVE, KO, OUTRO, FINISHED }

data class CoreRoundRules(
    val introFrames: Int = 90,
    val roundCueFrames: Int = 45,
    val fightCueFrames: Int = 30,
    val koFrames: Int = 60,
    val outroFrames: Int = 90,
    val timerSeconds: Int = 99
) {
    init {
        require(introFrames in 0..3600 && roundCueFrames in 0..3600)
        require(fightCueFrames in 0..3600 && koFrames in 0..3600 && outroFrames in 0..3600)
        require(timerSeconds in 1..3600)
    }
}

/** One round. Multiple-round match orchestration is a separate compatibility gate. */
class CoreRoundFlow(val rules: CoreRoundRules = CoreRoundRules()) {
    var phase = CoreRoundPhase.INTRO
        private set
    var phaseTime = 0
        private set
    var remainingTicks = rules.timerSeconds * 60
        private set
    var winner = -1 // -1 undecided; 0 tie; 1 player one; 2 player two
        private set

    val active: Boolean get() = phase == CoreRoundPhase.ACTIVE
    val finished: Boolean get() = phase == CoreRoundPhase.FINISHED
    fun roundState(): Int = when (phase) {
        CoreRoundPhase.INTRO,CoreRoundPhase.ROUND,CoreRoundPhase.FIGHT_CUE -> 1
        CoreRoundPhase.ACTIVE -> 2
        else -> 3
    }
    private fun advance(to:CoreRoundPhase) { phase=to;phaseTime=0 }
    fun step(p1:FightingCharacter,p2:FightingCharacter) {
        if(finished)return
        phaseTime++
        when(phase) {
            CoreRoundPhase.INTRO -> if(phaseTime>=rules.introFrames)advance(CoreRoundPhase.ROUND)
            CoreRoundPhase.ROUND -> if(phaseTime>=rules.roundCueFrames)advance(CoreRoundPhase.FIGHT_CUE)
            CoreRoundPhase.FIGHT_CUE -> if(phaseTime>=rules.fightCueFrames)advance(CoreRoundPhase.ACTIVE)
            CoreRoundPhase.ACTIVE -> {
                remainingTicks--
                if(p1.life<=0 || p2.life<=0 || remainingTicks<=0) {
                    winner=when {
                        p1.life==p2.life -> 0
                        p1.life>p2.life -> 1
                        else -> 2
                    }
                    advance(CoreRoundPhase.KO)
                }
            }
            CoreRoundPhase.KO -> if(phaseTime>=rules.koFrames)advance(CoreRoundPhase.OUTRO)
            CoreRoundPhase.OUTRO -> if(phaseTime>=rules.outroFrames)advance(CoreRoundPhase.FINISHED)
            CoreRoundPhase.FINISHED -> {}
        }
    }
    fun statusJson():String = "{\"phase\":\"" + phase.name + "\",\"phaseTime\":" + phaseTime +
        ",\"roundState\":" + roundState() + ",\"timerTicks\":" + remainingTicks +
        ",\"winner\":" + winner + ",\"finished\":" + finished + "}"
}
