package moe.celery.kenjatime

import kotlin.math.*

/** Bounded, cached, immutable CNS expression trees. Unknown syntax fails closed. */
object CoreExpression {
    private data class Token(val value: String, val type: Char)
    private sealed interface Node { fun read(f: FightingCharacter): Value }
    private data class Value(val n: Double? = null, val s: String? = null,
                             val range: Pair<Double,Double>? = null) {
        fun number(): Double = n ?: s?.toDoubleOrNull() ?: 0.0
        fun bool() = number() != 0.0
        fun string() = s ?: (n?.toString() ?: "")
        companion object { fun num(d: Double) = Value(n=d); fun str(s: String) = Value(s=s) }
    }
    private data class Literal(val v: Value): Node { override fun read(f: FightingCharacter) = v }
    private data class InclusiveRange(val lower: Node, val upper: Node): Node {
        override fun read(f:FightingCharacter) =
            Value(range=Pair(lower.read(f).number(),upper.read(f).number()))
    }
    private data class Variable(val key: String): Node {
        override fun read(f: FightingCharacter): Value {
            val p = f.opponent
            val v = when (key) {
                "time" -> f.timeInState.toDouble()
                "stateno" -> f.stateNo.toDouble()
                "life" -> f.life.toDouble()
                "lifemax" -> f.definition.maxLife.toDouble()
                "power" -> f.power.toDouble()
                "powermax" -> 3000.0
                "ctrl" -> if (f.control) 1.0 else 0.0
                "facing" -> if (f.facingRight) 1.0 else -1.0
                "pos x" -> Fixed.pixels(f.posX)
                "pos y" -> Fixed.pixels(f.posY)
                "vel x" -> Fixed.pixels(f.velX)
                "vel y" -> Fixed.pixels(f.velY)
                "p2dist x" -> p?.let { Fixed.pixels(it.posX-f.posX) * if(f.facingRight)1 else -1 } ?: 0.0
                "p2dist y" -> p?.let { Fixed.pixels(it.posY-f.posY) } ?: 0.0
                "p2bodydist x" -> p?.let {
                    val ahead=Fixed.pixels(it.posX-f.posX)*(if(f.facingRight)1 else -1)
                    ahead - (f.definition.groundFront+it.definition.groundBack)
                } ?: 0.0
                "p2bodydist y" -> p?.let { Fixed.pixels(it.posY-f.posY) } ?: 0.0
                "p2stateno" -> p?.stateNo?.toDouble() ?: 0.0
                "p2life" -> p?.life?.toDouble() ?: 0.0
                "anim" -> f.animation?.action?.number?.toDouble() ?: -1.0
                "animelem" -> f.animation?.index?.plus(1)?.toDouble() ?: 0.0
                "animtime" -> if (f.animation?.finished == true) 0.0 else -1.0
                "roundstate" -> f.roundState.toDouble()
                "alive" -> if (f.life>0) 1.0 else 0.0
                "ishelper" -> if (f.parent!=null) 1.0 else 0.0
                "hitcount" -> f.hitCount.toDouble()
                "movecontact" -> if (f.moveContact) 1.0 else 0.0
                "movehit" -> if (f.moveHit) 1.0 else 0.0
                "moveguarded" -> if (f.moveGuarded) 1.0 else 0.0
                "numhelper" -> f.world?.entities?.helpers?.count { it.owner===f }?.toDouble() ?: 0.0
                "numproj" -> f.world?.entities?.projectiles?.count { it.owner===f }?.toDouble() ?: 0.0
                "inguarddist" -> if (p!=null && abs(p.posX.toLong()-f.posX.toLong()) <= 90L*Fixed.ONE) 1.0 else 0.0
                "true" -> 1.0
                "false" -> 0.0
                else -> {
                    if (key in setOf("s","c","a","h","i","l","n","u","p")) return Value.str(key)
                    if (key=="statetype") return Value.str(f.stateType)
                    if (key=="movetype") return Value.str(f.moveType)
                    if (key=="p2statetype") return Value.str(p?.stateType ?: "")
                    if (key=="p2movetype") return Value.str(p?.moveType ?: "")
                    if (key=="command") return Value.str("@command")
                    throw IllegalArgumentException("Unsupported identifier: " + key)
                }
            }
            return Value.num(v)
        }
    }
    private data class FunctionCall(val name:String,val args:List<Node>): Node {
        override fun read(f: FightingCharacter): Value {
            fun a(i:Int): Double = args.getOrNull(i)?.read(f)?.number()
                ?: throw IllegalArgumentException("Missing argument for "+name)
            fun idx(i:Int)=a(i).toInt()
            val v=when(name) {
                "var" -> f.vars.getOrNull(idx(0))?.toDouble() ?: 0.0
                "fvar" -> f.fvars.getOrNull(idx(0)) ?: 0.0
                "sysvar" -> f.sysVars.getOrNull(idx(0))?.toDouble() ?: 0.0
                "sysfvar" -> f.sysFvars.getOrNull(idx(0)) ?: 0.0
                "abs" -> abs(a(0))
                "floor" -> floor(a(0))
                "ceil" -> ceil(a(0))
                "sin" -> sin(a(0)*PI/180.0)
                "cos" -> cos(a(0)*PI/180.0)
                "min" -> min(a(0),a(1))
                "max" -> max(a(0),a(1))
                "ifelse" -> if(a(0)!=0.0) a(1) else a(2)
                "numhelper" -> f.world?.entities?.helpers?.count {
                    it.owner===f && (args.isEmpty() || it.helperId==idx(0))
                }?.toDouble() ?: 0.0
                "numprojid" -> f.world?.entities?.projectiles?.count {
                    it.owner===f && it.projectileId==idx(0)
                }?.toDouble() ?: 0.0
                else -> throw IllegalArgumentException("Unsupported function: "+name)
            }
            return Value.num(v)
        }
    }
    private data class Unary(val op:String,val x:Node): Node {
        override fun read(f:FightingCharacter):Value {
            val n=x.read(f).number()
            return Value.num(when(op) { "-"->-n; "+"->n; "!"->if(n==0.0)1.0 else 0.0
                else -> throw IllegalArgumentException("Bad unary operator") })
        }
    }
    private data class Binary(val op:String,val x:Node,val y:Node):Node {
        override fun read(f:FightingCharacter):Value {
            val a=x.read(f)
            if(op=="&&"&&!a.bool())return Value.num(0.0)
            if(op=="||"&&a.bool())return Value.num(1.0)
            val b=y.read(f)
            val left=a.number();val right=b.number()
            val comparison:Boolean?=when(op) {
                "&&"->a.bool()&&b.bool()
                "||"->a.bool()||b.bool()
                "=","=="-> if(b.range!=null) left>=b.range.first && left<=b.range.second
                    else if(a.s=="@command")
                    f.commandActive(b.string())
                    else if(a.s!=null||b.s!=null) a.string().equals(b.string(),true) else left==right
                "!=","<>"-> if(b.range!=null) left<b.range.first || left>b.range.second
                    else if(a.s=="@command")
                    !f.commandActive(b.string())
                    else if(a.s!=null||b.s!=null) !a.string().equals(b.string(),true) else left!=right
                "<"->left<right
                ">"->left>right
                "<="->left<=right
                ">="->left>=right
                else->null
            }
            if(comparison!=null)return Value.num(if(comparison)1.0 else 0.0)
            return Value.num(when(op) {
                "+"->left+right
                "-"->left-right
                "*"->left*right
                "/"->if(right==0.0)throw IllegalArgumentException("Divide by zero") else left/right
                "%"->if(right==0.0)throw IllegalArgumentException("Modulo by zero") else left%right
                else->throw IllegalArgumentException("Unsupported operator: "+op)
            })
        }
    }
    private class Parser(val tokens:List<Token>) {
        var cursor=0;var depth=0
        fun peek():String=tokens.getOrNull(cursor)?.value ?: ""
        fun consume():Token=tokens.getOrNull(cursor++)?:throw IllegalArgumentException("Unexpected end")
        fun accept(s:String):Boolean {
            if(peek().equals(s,true)){cursor++;return true}
            return false
        }
        fun expect(s:String){if(!accept(s))throw IllegalArgumentException("Expected "+s)}
        fun parse():Node{
            val node=or()
            if(cursor!=tokens.size)throw IllegalArgumentException("Trailing token "+peek())
            return node
        }
        fun or():Node{var n=and();while(accept("||")||accept("or"))n=Binary("||",n,and());return n}
        fun and():Node{var n=compare();while(accept("&&")||accept("and"))n=Binary("&&",n,compare());return n}
        fun compare():Node{
            var n=plus()
            while(peek() in setOf("=","==","!=","<>","<",">","<=",">=")){
                val op=consume().value;n=Binary(op,n,plus())
            }
            return n
        }
        fun plus():Node{var n=mul();while(peek()=="+"||peek()=="-")n=Binary(consume().value,n,mul());return n}
        fun mul():Node{var n=unary();while(peek()=="*"||peek()=="/"||peek()=="%")n=Binary(consume().value,n,unary());return n}
        fun unary():Node=if(peek() in setOf("+","-","!"))Unary(consume().value,unary())else primary()
        fun primary():Node{
            if(accept("[")){
                val low=or();expect(",")
                val high=or();expect("]")
                return InclusiveRange(low,high)
            }
            if(accept("(")){
                if(++depth>32)throw IllegalArgumentException("Expression nesting limit")
                val n=or();expect(")");depth--;return n
            }
            val t=consume()
            if(t.type=='n')return Literal(Value.num(t.value.toDouble()))
            if(t.type=='s')return Literal(Value.str(t.value))
            if(t.type!='i')throw IllegalArgumentException("Invalid token "+t.value)
            var name=t.value.lowercase()
            if(name in setOf("pos","vel","p2dist","p2bodydist") &&
                (peek().equals("x",true)||peek().equals("y",true)))
                name+=" "+consume().value.lowercase()
            if(accept("(")){
                if(++depth>32)throw IllegalArgumentException("Expression nesting limit")
                val args=mutableListOf<Node>()
                if(!accept(")")) {
                    do { args.add(or()) } while(accept(","))
                    expect(")")
                }
                depth--;return FunctionCall(name,args)
            }
            return Variable(name)
        }
    }
    private fun tokenize(source:String):List<Token> {
        require(source.length<=1024){"CNS expression too long"}
        val result=ArrayList<Token>();var i=0
        while(i<source.length){
            val c=source[i]
            if(c.isWhitespace()){i++;continue}
            if(c=='"'||c=='\''){
                val start=++i
                while(i<source.length&&source[i]!=c)i++
                require(i<source.length){"Unclosed string"}
                result.add(Token(source.substring(start,i),'s'));i++
            }else if(c.isDigit() || c=='.' && source.getOrNull(i+1)?.isDigit()==true){
                val start=i
                while(i<source.length&&(source[i].isDigit()||source[i]=='.'))i++
                val raw=source.substring(start,i)
                require(raw.toDoubleOrNull()!=null){"Malformed number"}
                result.add(Token(raw,'n'))
            }else if(c.isLetter()||c=='_'){
                val start=i++
                while(i<source.length&&(source[i].isLetterOrDigit()||source[i]=='_'||source[i]=='.'))i++
                result.add(Token(source.substring(start,i),'i'))
            }else{
                val pair=source.substring(i,min(source.length,i+2))
                val op=if(pair in setOf("&&","||","!=","==","<=",">=","<>")){i+=2;pair}
                    else {require(c in "[]()+-*/%,=<>!"){"Unsupported character"};i++;c.toString()}
                result.add(Token(op,'o'))
            }
            require(result.size<=256){"Too many expression tokens"}
        }
        return result
    }
    private val cache=linkedMapOf<String,Node>()
    private fun parse(s:String):Node=cache[s]?:Parser(tokenize(s)).parse().also{
        if(cache.size>=4096)cache.clear()
        cache[s]=it
    }
    fun number(raw:String,actor:FightingCharacter,errors:MutableSet<String>):Double?=try{
        val n=parse(raw.trim()).read(actor).number()
        if(!n.isFinite())throw IllegalArgumentException("Nonfinite")
        n
    }catch(e:IllegalArgumentException){
        errors.add("Unsupported expression: "+raw.take(100)+" ("+e.message+")")
        null
    }
    fun test(raw:String,actor:FightingCharacter,errors:MutableSet<String>):Boolean=
        number(raw,actor,errors)?.let{it!=0.0}?:false
}
