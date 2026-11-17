package moe.celery.kenjatime

import kotlin.math.abs

/** Exact binary64 -> decimal digits, rounded to nearest with ties to even on all targets. */
internal object CoreDebugDecimal {
    private data class Decimal(val digits: String,val scale: Int) {
        val exponent: Int get()=if(digits=="0")0 else digits.length-scale-1
        fun rounded(places: Int): String {
            val cut=digits.length-scale+places
            if(cut>=digits.length)return digits+"0".repeat(cut-digits.length)
            if(cut<0)return "0"
            val prefix=if(cut==0)"0" else digits.take(cut)
            val next=digits[cut]
            val up=next>'5' || next=='5' && (digits.drop(cut+1).any { it!='0' } || (prefix.last()-'0')%2!=0)
            return if(up)increment(prefix) else prefix
        }
    }
    private val cache=linkedMapOf<Long,Decimal>()
    private fun increment(raw: String): String {
        val out=raw.toCharArray()
        for(i in out.lastIndex downTo 0)if(out[i]!='9') {out[i]++;return out.concatToString()} else out[i]='0'
        return "1"+out.concatToString()
    }
    private fun multiply(raw: String,factor: Int): String {
        val out=CharArray(raw.length);var carry=0
        for(i in raw.lastIndex downTo 0) {val n=(raw[i]-'0')*factor+carry;out[i]=('0'.code+n%10).toChar();carry=n/10}
        return (if(carry==0)"" else carry.toString())+out.concatToString()
    }
    private fun decimal(value: Double): Decimal {
        val bits=abs(value).toBits()
        cache[bits]?.let {return it}
        val exponent=((bits ushr 52) and 2047).toInt()
        val fraction=bits and 0x000fffffffffffffL
        val mantissa=if(exponent==0)fraction else fraction or (1L shl 52)
        var digits=mantissa.toString();val power=if(exponent==0)-1074 else exponent-1023-52
        if(mantissa!=0L)repeat(abs(power)) {digits=multiply(digits,if(power<0)5 else 2)}
        val next=Decimal(digits,if(power<0 && mantissa!=0L)-power else 0)
        if(cache.size>=128)cache.remove(cache.keys.first())
        cache[bits]=next;return next
    }
    fun integer(value: Double): String {
        val absolute=abs(value)
        if(absolute<=9007199254740991.0)return absolute.toLong().toString()
        val d=decimal(value);val cut=d.digits.length-d.scale
        return if(cut<=0)"0" else if(d.scale>0)d.digits.take(cut) else d.digits
    }
    fun fixed(value: Double,precision: Int,point: Boolean=false): String {
        val rounded=decimal(value).rounded(precision).padStart(precision+1,'0')
        return if(precision==0)rounded+if(point)"." else "" else rounded.dropLast(precision)+"."+rounded.takeLast(precision)
    }
    private fun scientificParts(value: Double,precision: Int): Pair<String,Int> {
        val d=decimal(value);var exponent=d.exponent
        var digits=d.rounded(precision-exponent)
        if(digits.length>precision+1) {exponent+=digits.length-precision-1;digits=digits.take(precision+1)}
        return digits.padStart(precision+1,'0') to exponent
    }
    fun scientific(value: Double,precision: Int,point: Boolean=false): String {
        val (digits,exponent)=scientificParts(value,precision)
        return digits.take(1)+(if(precision>0)"."+digits.drop(1) else if(point)"." else "")+
            "e"+(if(exponent<0)"-" else "+")+abs(exponent).toString().padStart(2,'0')
    }
    fun general(value: Double,precision: Int,alternate: Boolean): String {
        val p=precision.coerceAtLeast(1);val exponent=scientificParts(value,p-1).second
        val text=if(exponent< -4 || exponent>=p)scientific(value,p-1,alternate) else fixed(value,(p-exponent-1).coerceAtLeast(0),alternate)
        if(alternate)return text
        val parts=text.split('e');val base=if('.' in parts[0])parts[0].trimEnd('0').trimEnd('.') else parts[0]
        return base+if(parts.size>1)"e"+parts[1] else ""
    }
}

internal object CoreClipboard {
    const val LIMIT=8192
    private data class Spec(val flags: String,val width: Int,val precision: Int?,val kind: Char)
    private data class Part(val text: String?=null,val spec: Spec?=null)
    private data class Format(val parts: List<Part>,val count: Int)
    private val conversion=Regex("%([-+ #0]*)(\\d*)(?:\\.(\\d*))?([difFeEgG])")
    private val formats=linkedMapOf<String,Format>()
    private fun decode(raw: String): String {
        require(raw.length<=LIMIT && raw.length>=2 && raw.first()=='"' && raw.last()=='"') { "text must be double quoted and at most 8192 characters" }
        return buildString {
            var i=1
            while(i<raw.lastIndex) {
                val c=raw[i++]
                require(c!='"') { "Unescaped quote" }
                if(c!='\\')append(c) else {
                    require(i<raw.lastIndex) { "Incomplete escape" }
                    append(when(val escaped=raw[i++]) {
                        'n' -> "\n";'t' -> "    ";'\\' -> "\\";'"' -> "\""
                        else -> throw IllegalArgumentException("Unsupported escape: $escaped")
                    })
                }
            }
        }
    }
    private fun compile(raw: String): Format {
        formats[raw]?.let {return it}
        val text=decode(raw);val parts=mutableListOf<Part>();var count=0;var start=0;var i=0
        while(i<text.length) {
            if(text[i]!='%') {i++;continue}
            parts.add(Part(text=text.substring(start,i)))
            if(text.getOrNull(i+1)=='%') {parts.add(Part(text="%"));i+=2;start=i;continue}
            val match=conversion.find(text,i)?.takeIf {it.range.first==i} ?: throw IllegalArgumentException("Unsupported format specifier")
            val width=match.groupValues[2].let {if(it.isEmpty())0 else it.toIntOrNull() ?: throw IllegalArgumentException("Invalid width")}
            val precision=match.groups[3]?.value?.let {if(it.isEmpty())0 else it.toIntOrNull() ?: throw IllegalArgumentException("Invalid precision")}
            require(width<=512 && (precision==null || precision<=20)) { "Format width/precision exceeds bounds" }
            require(++count<=6) { "At most six params are supported" }
            parts.add(Part(spec=Spec(match.groupValues[1],width,precision,match.groupValues[4][0])))
            i=match.range.last+1;start=i
        }
        parts.add(Part(text=text.substring(start)))
        val next=Format(parts,count);if(formats.size>=256)formats.remove(formats.keys.first());formats[raw]=next;return next
    }
    private fun number(spec: Spec,n: CoreDebugNumber): String {
        val integer=spec.kind in "di"
        // MUGEN displays a mismatched type with default formatting for its actual type.
        val s=if(integer==n.floating)Spec("",0,null,if(n.floating)'f' else 'd') else spec
        val value=abs(n.value);val isInt=s.kind in "di"
        var body=when(s.kind.lowercaseChar()) {
            'd','i' -> if(s.precision==0 && value==0.0)"" else CoreDebugDecimal.integer(value).padStart(s.precision ?: 0,'0')
            'f' -> CoreDebugDecimal.fixed(value,s.precision ?: 6,'#' in s.flags)
            'e' -> CoreDebugDecimal.scientific(value,s.precision ?: 6,'#' in s.flags)
            else -> CoreDebugDecimal.general(value,s.precision ?: 6,'#' in s.flags)
        }
        if(s.kind in "FEG")body=body.uppercase()
        val negative=if(isInt)n.value<0 else n.value.toBits()<0
        val sign=if(negative)"-" else if('+' in s.flags)"+" else if(' ' in s.flags)" " else ""
        if('0' in s.flags && '-' !in s.flags && (!isInt || s.precision==null))return sign+body.padStart((s.width-sign.length).coerceAtLeast(0),'0')
        val text=sign+body;return if('-' in s.flags)text.padEnd(s.width) else text.padStart(s.width)
    }
    fun execute(actor: FightingCharacter,controller: StateController,errors: MutableSet<String>) {
        try {
            val args=controller.params;val type=controller.type.lowercase();val clear=type=="clearclipboard"
            require(args.keys.all {it in setOf("type","persistent","ignorehitpause") || !clear && it in setOf("text","params")}) { "Unsupported clipboard parameter" }
            if(clear) {actor.clipboardText="";return}
            val format=compile(args["text"] ?: throw IllegalArgumentException("Missing text"))
            val raw=args["params"]?.takeIf {it.isNotBlank()}?.let(CnsArguments::split) ?: emptyList()
            require(raw.size==format.count) { "Format requires ${format.count} params, received ${raw.size}" }
            val values=raw.map {CoreExpression.debugNumber(it,actor)};var index=0
            val next=buildString {for(part in format.parts)append(part.text ?: number(part.spec!!,values[index++]))}
            require(next.length<=LIMIT) { "Formatted text exceeds 8192 characters" }
            actor.clipboardText=(if(type=="appendtoclipboard" && actor.clipboardText.isNotEmpty())actor.clipboardText+"\n"+next else next).takeLast(LIMIT)
        }catch(e: IllegalArgumentException) {errors.add("Invalid ${controller.type}: ${e.message}")}
    }
    fun quote(text: String): String=buildString {
        append('"')
        for(c in text)when(c) {
            '"' -> append("\\\"");'\\' -> append("\\\\")
            else -> if(c.code<32)append("\\u"+c.code.toString(16).padStart(4,'0')) else append(c)
        }
        append('"')
    }
}
