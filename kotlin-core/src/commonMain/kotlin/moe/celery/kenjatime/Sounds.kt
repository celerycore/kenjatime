package moe.celery.kenjatime

import kotlin.math.ceil

internal data class CoreSoundSample(val group: Int,val number: Int,val frames: Long,val rate: Int)
internal data class CoreSoundVoice(val id: Long,val actor: FightingCharacter,val side: Int,val sample: CoreSoundSample,
    val channel: Int,val gain: Double,val frequency: Double,val loop: Boolean,var pan: Double,var remaining: Int,var age: Long=0) {
    fun json()="{\"voice\":$id,\"actor\":${actor.id},\"side\":$side,\"group\":${sample.group},\"number\":${sample.number},"+
        "\"channel\":$channel,\"gain\":$gain,\"frequency\":$frequency,\"loop\":$loop,\"pan\":$pan,\"remaining\":$remaining,\"age\":$age}"
}

/** Logical audio belongs to Kotlin; platform decoders supply immutable sample frame/rate metadata. */
internal class CoreSounds(private val fight: DeterministicFight) {
    private val banks=arrayOfNulls<Map<Pair<Int,Int>,CoreSoundSample>>(2)
    val voices=mutableListOf<CoreSoundVoice>()
    val events=mutableListOf<String>()
    private var nextVoice=1L
    fun catalog(side: Int,text: String) {
        require(side in 0..1 && fight.frame==0L && voices.isEmpty()) {"Sound catalogs must be loaded before stepping"}
        require(text.length<=512*1024) {"Sound catalog is too large"}
        val samples=linkedMapOf<Pair<Int,Int>,CoreSoundSample>()
        if(text.isNotEmpty())for(row in text.split(';')) {
            val parts=row.split(',');require(parts.size==4) {"Invalid sound catalog row"}
            val group=parts[0].toIntOrNull();val number=parts[1].toIntOrNull()
            val frames=parts[2].toLongOrNull();val rate=parts[3].toIntOrNull()
            require(group!=null && group>=0 && number!=null && number>=0 && frames!=null && frames in 1..Int.MAX_VALUE.toLong() &&
                rate!=null && rate in 1000..384000 && frames.toDouble()/rate<=3600) {"Invalid sound sample metadata"}
            val key=group to number;require(key !in samples && samples.size<4096) {"Duplicate or excessive sound catalog"}
            samples[key]=CoreSoundSample(group,number,frames,rate)
        }
        banks[side]=samples
    }
    private fun stop(voice: CoreSoundVoice) {
        if(voices.remove(voice))events.add("{\"type\":\"stop\",\"voice\":${voice.id}}")
    }
    fun stopChannel(actor: FightingCharacter,channel: Int) {
        for(voice in voices.toList())if(channel==-1 || voice.actor===actor && voice.channel==channel)stop(voice)
    }
    fun beginTick() {
        events.clear()
        for(voice in voices.toList()) {
            voice.age++
            if(!voice.loop && --voice.remaining==0)stop(voice)
        }
    }
    fun finishTick() {
        if(voices.isEmpty())return
        val live=setOf(fight.p1,fight.p2)+fight.entities.helpers.map {it.actor}
        for(voice in voices.toList())if(voice.actor.destroyed || voice.actor !in live)stop(voice)
    }
    fun json()=voices.joinToString(prefix="[",postfix="]",separator=","){it.json()}
    fun eventJson()=events.joinToString(prefix="[",postfix="]",separator=",")
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params;val type=controller.type.lowercase()
            val common=setOf("type","persistent","ignorehitpause","channel")
            val allowed=when(type) {"stopsnd"->common;"sndpan"->common+setOf("pan","abspan")
                else->common+setOf("value","volumescale","volume","lowpriority","freqmul","loop","pan","abspan")}
            require(args.keys.all {it in allowed}) {"Unsupported sound parameter"}
            fun number(raw: String)=CoreExpression.number(raw,actor,errors) ?: throw IllegalArgumentException("Invalid expression")
            fun integer(raw: String,low: Int,high: Int): Int {
                val n=number(raw);require(n in low.toDouble()..high.toDouble()) {"Sound parameter out of range"};return n.toInt()
            }
            val channel=args["channel"]?.let {integer(it,if(type=="sndpan")0 else -1,255)}
                ?: if(type=="playsnd")-1 else throw IllegalArgumentException("Missing channel")
            if(type=="stopsnd") {
                fight.presentation.add(CorePresentationEvent(type,channel=channel));stopChannel(actor,channel);return
            }
            require(!("pan" in args && "abspan" in args)) {"pan and abspan are mutually exclusive"}
            require(type!="sndpan" || "pan" in args || "abspan" in args) {"SndPan requires pan or abspan"}
            val absolute="abspan" in args
            val offset=args[if(absolute)"abspan" else "pan"]?.let {integer(it,-100000,100000)} ?: 0
            val worldOffset=actor.coordinates.toWorld(offset.toDouble()).toDouble()/Fixed.ONE
            val pan=(if(absolute)worldOffset else actor.posX.toDouble()/Fixed.ONE+
                worldOffset*(if(actor.facingRight)1 else -1)-(fight.camera?.x ?: 0.0)).div(160).coerceIn(-1.0,1.0)
            if(type=="sndpan") {
                fight.presentation.add(CorePresentationEvent(type,channel=channel))
                voices.firstOrNull {it.actor===actor && it.channel==channel}?.let {
                    it.pan=pan;events.add("{\"type\":\"pan\",\"voice\":${it.id},\"pan\":$pan}")
                };return
            }
            val pair=args["value"]?.let(CnsArguments::split) ?: throw IllegalArgumentException("Missing value")
            require(pair.size==2) {"PlaySnd value requires two components"}
            val prefix=Regex("^[sSfF](?=\\s|[\\d(+.\\-])").find(pair[0].trim())?.value
            require(prefix?.lowercase()!="f") {"Common F sound bank is not available"}
            val group=integer(if(prefix!=null)pair[0].trim().drop(1) else pair[0],0,Int.MAX_VALUE)
            val sound=integer(pair[1],0,Int.MAX_VALUE)
            require(!("volume" in args && "volumescale" in args)) {"volume and volumescale are mutually exclusive"}
            val gain=if("volume" in args)(integer(args.getValue("volume"),-256,256)+256)/256.0 else args["volumescale"]?.let {
                val n=number(it);require(n in 0.0..100.0) {"volumescale out of range"};n/100
            } ?: 1.0
            val frequency=args["freqmul"]?.let {number(it).also {n->require(n in .0625..16.0) {"freqmul out of range"}}} ?: 1.0
            val loop=args["loop"]?.let {number(it)!=0.0} ?: false
            val low=args["lowpriority"]?.let {number(it)!=0.0} ?: false
            // Preserve the original public metadata queue independently of asset availability.
            fight.presentation.add(CorePresentationEvent(type,group,sound,channel))
            val side=if(actor.rootActor()===fight.p1)0 else 1
            val bank=banks[side] ?: return
            val sample=bank[group to sound] ?: run {errors.add("Missing sound $group,$sound for player ${side+1}");return}
            val old=if(channel>=0)voices.firstOrNull {it.actor===actor && it.channel==channel} else null
            if(old!=null && low)return
            require(voices.size-(if(old!=null)1 else 0)<128 && voices.count {it.actor===actor}-(if(old!=null)1 else 0)<32) {"Sound voice limit exceeded"}
            old?.let(::stop)
            val ticks=ceil(sample.frames*60.0/sample.rate/frequency-1e-10).toInt().coerceAtLeast(1)
            val voice=CoreSoundVoice(nextVoice++,actor,side,sample,channel,gain,frequency,loop,pan,if(loop)-1 else ticks)
            voices.add(voice);events.add("{\"type\":\"play\",\"data\":${voice.json()}}")
        }catch(e: IllegalArgumentException) {errors.add("Invalid ${controller.type}: ${e.message}")}
    }
}
