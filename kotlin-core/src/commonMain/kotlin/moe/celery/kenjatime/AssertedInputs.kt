package moe.celery.kenjatime

/** AssertInput queues physical bits for the next input sample, never the current CNS pass. */
internal object CoreAssertedInputs {
    private const val BUTTONS="abcxyzs"
    fun buttonsMask(frame: InputFrame): Int=BUTTONS.withIndex().fold(0) { bits,(i,key) ->
        bits or if(key in frame.buttons)1.shl(i) else 0
    }
    fun sample(actor: FightingCharacter,physical: InputFrame,enabled: Boolean=true) {
        val pending=actor.pendingAssertedInput
        actor.pendingAssertedInput=InputFrame()
        actor.input.update(if(enabled)InputFrame(physical.directions or pending.directions,physical.buttons+pending.buttons) else InputFrame())
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params;val keys=setOf("flag","flag2","flag3")
            require(args.keys.all { it in keys || it in setOf("type","persistent","ignorehitpause") }) {
                "Unsupported AssertInput parameter"
            }
            val flags=keys.mapNotNull { args[it] }
            require(flags.isNotEmpty()) { "Missing input flag" }
            var directions=0;val buttons=mutableSetOf<Char>()
            for(raw in flags) {
                val value=raw.trim();val quoted=value.startsWith('"') || value.endsWith('"')
                require(!quoted || value.length>=2 && value.startsWith('"') && value.endsWith('"')) { "Unbalanced quoted flag" }
                val text=(if(quoted)value.substring(1,value.length-1) else value).trim()
                val tokens=text.split(Regex("[+|,\\s]+"))
                require(tokens.isNotEmpty() && tokens.none { it.isBlank() }) { "Empty input flag" }
                for(token in tokens)when(token) {
                    "U","up" -> directions=directions or Directions.U
                    "D","down" -> directions=directions or Directions.D
                    "L","left" -> directions=directions or Directions.L
                    "R","right" -> directions=directions or Directions.R
                    "F","forward","fwd" -> directions=directions or if(actor.facingRight)Directions.R else Directions.L
                    "B","back" -> directions=directions or if(actor.facingRight)Directions.L else Directions.R
                    "start" -> buttons.add('s')
                    else -> {
                        require(token.length==1 && token[0] in BUTTONS) { "Unsupported input flag: $token" }
                        buttons.add(token[0])
                    }
                }
            }
            // Round cue/KO controllers cannot queue an input to leak into active combat.
            if(actor.roundState != 2 || actor.destroyed)return
            val previous=actor.pendingAssertedInput
            actor.pendingAssertedInput=InputFrame(previous.directions or directions,previous.buttons+buttons)
        }catch(e: IllegalArgumentException) { errors.add("Invalid AssertInput: ${e.message}") }
    }
}
