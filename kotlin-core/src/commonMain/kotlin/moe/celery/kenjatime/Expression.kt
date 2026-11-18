package moe.celery.kenjatime

import kotlin.math.*

internal data class CoreDebugNumber(val value: Double,val floating: Boolean)

/** Bounded, cached, immutable CNS expression trees. Unknown syntax fails closed. */
object CoreExpression {
    private data class Token(val value: String, val type: Char)
    private sealed interface Node { fun read(f: FightingCharacter): Value }
    private data class Value(val n: Double? = null, val s: String? = null,
                             val range: Pair<Double,Double>? = null,val floating: Boolean=false) {
        fun number(): Double = n ?: s?.toDoubleOrNull() ?: 0.0
        fun bool() = number() != 0.0
        fun string() = s ?: (n?.toString() ?: "")
        fun bitwiseInteger(): Int {
            require(!floating && n != null && n in Int.MIN_VALUE.toDouble()..Int.MAX_VALUE.toDouble()) {
                "Bitwise operators require 32-bit integers"
            }
            return n.toInt()
        }
        companion object { fun num(d: Double,floating: Boolean=d%1.0!=0.0) = Value(n=d,floating=floating); fun str(s: String) = Value(s=s) }
    }
    private data class Redirect(val name: String, val argument: Node?, val value: Node) : Node {
        override fun read(f: FightingCharacter): Value {
            val index = argument?.let { numeric(it, f, "Redirect argument").toInt() } ?: 0
            val actor = when (name) {
                "root" -> f.rootActor()
                "parent" -> f.parent
                "helper" -> f.world?.entities?.findHelper(f, index)
                "enemy", "enemynear" -> f.opponent.takeIf { index == 0 }
                else -> null
            }
            require(actor != null && !actor.destroyed) { "Unavailable $name redirect" }
            return value.read(actor)
        }
    }
    private val redirects = setOf("parent", "root", "helper", "enemy", "enemynear")
    private data class Literal(val v: Value): Node { override fun read(f: FightingCharacter) = v }
    private fun numeric(node: Node,f: FightingCharacter,label: String): Double {
        val n=node.read(f).n ?: throw IllegalArgumentException("$label requires a numeric expression")
        require(n.isFinite()) { "Nonfinite $label" }
        return n
    }
    private fun projectileKind(name: String): ProjectileContactKind? = when(name.removePrefix("proj").removeSuffix("time")) {
        "hit" -> ProjectileContactKind.HIT
        "guarded" -> ProjectileContactKind.GUARDED
        "cancel" -> ProjectileContactKind.CANCEL
        "contact" -> null
        else -> throw IllegalArgumentException("Unknown projectile trigger")
    }
    private val projectilePredicate = Regex("proj(hit|contact|guarded)(\\d*)")
    private data class ProjectilePredicate(val kind: ProjectileContactKind?,val id: Int,
        val expected: Node,val op: String,val limit: Node): Node {
        override fun read(f: FightingCharacter): Value {
            val wanted=numeric(expected,f,"Projectile trigger value") != 0.0
            val cutoff=numeric(limit,f,"Projectile trigger time")
            val age=f.projectileHistory.latestAge(kind,id,f.world?.frame ?: 0L)
            val comparison=when(op) {
                "=","==" -> age.toDouble() == cutoff
                "!=","<>" -> age.toDouble() != cutoff
                "<" -> age < cutoff
                "<=" -> age <= cutoff
                ">" -> age > cutoff
                ">=" -> age >= cutoff
                else -> error("Invalid projectile time comparison")
            }
            return Value.num(if((age >= 0 && comparison) == wanted)1.0 else 0.0)
        }
    }
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
                "prevstateno" -> f.previousStateNo.toDouble()
                "random" -> f.nextRandom(1000).toDouble()
                "ailevel" -> (f.world?.cpuLevel ?: 0).toDouble()
                "numenemy" -> if (p != null && !p.destroyed) 1.0 else 0.0
                "life" -> f.life.toDouble()
                "lifemax" -> f.definition.maxLife.toDouble()
                "power" -> f.power.toDouble()
                "powermax" -> f.maxPower.toDouble()
                "ctrl" -> if (f.control) 1.0 else 0.0
                "facing" -> if (f.facingRight) 1.0 else -1.0
                "pos x" -> f.coordinates.toLocal(f.posX)
                "pos y" -> f.coordinates.toLocal(f.posY)
                "vel x" -> f.coordinates.toLocal(f.authoredHorizontal(f.velX))
                "vel y" -> f.coordinates.toLocal(f.velY)
                "p2dist x" -> p?.let { f.coordinates.toLocal(it.posX.toLong()-f.posX) * if(f.facingRight)1 else -1 } ?: 0.0
                "p2dist y" -> p?.let { f.coordinates.toLocal(it.posY.toLong()-f.posY) } ?: 0.0
                "p2bodydist x" -> p?.let {
                    val direction=if(f.facingRight)1 else -1
                    val ahead=(it.posX.toLong()-f.posX)*direction
                    f.coordinates.toLocal(ahead-f.bodyWidthWorld(direction)-it.bodyWidthWorld(-direction))
                } ?: 0.0
                "p2bodydist y" -> p?.let { f.coordinates.toLocal(it.posY.toLong()-f.posY) } ?: 0.0
                "p2stateno" -> p?.stateNo?.toDouble() ?: 0.0
                "p2life" -> p?.life?.toDouble() ?: 0.0
                "anim" -> f.animation?.action?.number?.toDouble() ?: -1.0
                "animelem" -> f.animation?.index?.plus(1)?.toDouble() ?: 0.0
                "animtime" -> f.animation?.remaining?.toDouble() ?: 0.0
                "roundstate" -> f.roundState.toDouble()
                "pausetime" -> (f.world?.pauses?.remaining ?: 0).toDouble()
                "gametime" -> (f.world?.frame ?: 0L).toDouble()
                "win", "lose" -> {
                    val fight = f.world
                    val winner = fight?.roundFlow?.winner ?: -1
                    val side = if (f.rootActor() === fight?.p1) 1 else 2
                    if (winner > 0 && (winner == side) == (key == "win")) 1.0 else 0.0
                }
                "drawgame" -> if (f.world?.roundFlow?.winner == 0) 1.0 else 0.0
                "alive" -> if (f.life>0) 1.0 else 0.0
                "ishelper" -> if (f.parent!=null) 1.0 else 0.0
                "incustomstate" -> if (f.stateOwner !== f) 1.0 else 0.0
                "numtarget" -> f.targets().size.toDouble()
                "hitcount" -> f.hitCount.toDouble()
                "sprpriority" -> f.spritePriority.toDouble()
                "hitfall" -> if(f.getHitData.fall)1.0 else 0.0
                "hitover" -> if(f.hitOver)1.0 else 0.0
                "hitshakeover" -> if(f.hitShakeOver)1.0 else 0.0
                "canrecover" -> if(f.canRecover)1.0 else 0.0
                "movecontact" -> f.moveContactTime.toDouble()
                "movehit" -> f.moveHitTime.toDouble()
                "moveguarded" -> f.moveGuardedTime.toDouble()
                "movereversed" -> f.moveReversedTime.toDouble()
                "hitpausetime" -> f.hitPauseLeft.toDouble()
                "id" -> f.id.toDouble()
                "numhelper" -> f.world?.entities?.countHelpers(f)?.toDouble() ?: 0.0
                "numproj" -> f.world?.entities?.projectiles?.count { it.owner===f }?.toDouble() ?: 0.0
                "numexplod" -> f.world?.effects?.count(f)?.toDouble() ?: 0.0
                "frontedgedist", "backedgedist", "frontedgebodydist", "backedgebodydist" -> {
                    val direction = if (key.startsWith("front") == f.facingRight) 1 else -1
                    val arena = f.world?.arena
                    val viewEdge = f.world?.camera?.let { camera ->
                        Fixed.of(camera.x + direction * camera.config.width / (2.0 * camera.zoom))
                    }
                    val edge = if (direction > 0) minOf(arena?.right ?: 160 * Fixed.ONE,
                        viewEdge ?: Int.MAX_VALUE)
                    else maxOf(arena?.left ?: -160 * Fixed.ONE,
                        viewEdge ?: Int.MIN_VALUE)
                    val body = if ("body" in key) f.edgeWidthWorld(direction) else 0
                    return Value.num(f.coordinates.toLocal((edge.toLong() - f.posX) * direction - body), true)
                }
                "inguarddist" -> if(f.inGuardDistance)1.0 else 0.0
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
            return Value.num(v,key in setOf("pos x","pos y","vel x","vel y","p2dist x","p2dist y","p2bodydist x","p2bodydist y") || v%1.0!=0.0)
        }
    }
    private data class FunctionCall(val name:String,val args:List<Node>): Node {
        override fun read(f: FightingCharacter): Value {
            var floating=false
            fun a(i:Int): Double {
                val value=args.getOrNull(i)?.read(f) ?: throw IllegalArgumentException("Missing argument for "+name)
                floating=floating || value.floating;return value.number()
            }
            if (name == "cond") {
                require(args.size == 3) { "Cond requires three arguments" }
                return args[if (args[0].read(f).bool()) 1 else 2].read(f)
            }
            if(name=="ifelse") {
                val selected=args.getOrNull(if(a(0)!=0.0)1 else 2)?.read(f)
                    ?: throw IllegalArgumentException("Missing argument for ifelse")
                return Value.num(selected.number(),selected.floating)
            }
            fun idx(i:Int)=a(i).toInt()
            val v=when(name) {
                "const" -> {
                    val key = (args.singleOrNull() as? Variable)?.key
                        ?: throw IllegalArgumentException("Const requires one named field")
                    val constants = f.stateOwner.definition.scriptConstants
                    constants[key] ?: when (key) {
                        "movement.air.gethit.groundlevel" -> 0.0
                        "data.liedown.time" -> 60.0
                        else -> throw IllegalArgumentException("Unknown character constant: $key")
                    }
                }
                "const240p", "const480p", "const720p" -> {
                    require(args.size == 1) { "$name requires one argument" }
                    val referenceScale = when (name) { "const240p" -> 1; "const480p" -> 2; else -> 4 }
                    a(0)/(referenceScale*f.coordinates.scale)
                }
                "map" -> {
                    require(args.size==1) { "Map requires one name" }
                    val key=when(val arg=args[0]) {
                        is Variable -> arg.key
                        is Literal -> arg.v.s ?: throw IllegalArgumentException("Map name must be text")
                        else -> throw IllegalArgumentException("Dynamic map names are unsupported")
                    }
                    f.namedMaps.read(key)
                }
                "projhittime","projguardedtime","projcontacttime","projcanceltime",
                "projhit","projguarded","projcontact" -> {
                    val timed=name.endsWith("time")
                    require(args.size == 1 || !timed && args.isEmpty()) { "$name requires ${if(timed)"one" else "zero or one"} argument" }
                    val requested=if(args.isEmpty())0.0 else numeric(args[0],f,name)
                    require(requested <= Int.MAX_VALUE.toDouble()) { "Projectile ID out of range" }
                    val id=requested.toInt().coerceAtLeast(0)
                    val kind=projectileKind(name)
                    val now=f.world?.frame ?: 0L
                    val age=if(timed)f.projectileHistory.time(kind,id,now) else f.projectileHistory.latestAge(kind,id,now)
                    if(timed)age.toDouble() else if(age in 0L..1L)1.0 else 0.0
                }
                "gethitvar" -> {
                    require(args.size == 1 && args[0] is Variable) { "GetHitVar requires one named field" }
                    f.getHitVar((args[0] as Variable).key)
                }
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
                "animelemtime", "animelemno", "animexist", "selfanimexist" -> {
                    require(args.size == 1) { "$name requires one argument" }
                    val argument = idx(0)
                    when (name) {
                        "animexist" -> if (argument in f.animationOwner.definition.animations) 1.0 else 0.0
                        "selfanimexist" -> if (argument in f.definition.animations) 1.0 else 0.0
                        else -> {
                            val animation = f.animation ?: throw IllegalArgumentException("Animation has no elements")
                            if (name == "animelemtime") animation.elementTime(argument).toDouble()
                            else animation.elementAt(argument).toDouble()
                        }
                    }
                }
                "numhelper" -> {
                    require(args.size <= 1) { "NumHelper requires zero or one argument" }
                    val id = if (args.isEmpty()) 0 else numeric(args[0], f, name).toInt()
                    f.world?.entities?.countHelpers(f, id)?.toDouble() ?: 0.0
                }
                "ishelper" -> {
                    require(args.size <= 1) { "IsHelper requires zero or one argument" }
                    val matches = if (args.isEmpty()) f.parent != null
                        else f.world?.entities?.isHelper(f, numeric(args[0], f, name).toInt()) == true
                    if (matches) 1.0 else 0.0
                }
                "numprojid" -> f.world?.entities?.projectiles?.count {
                    it.owner===f && it.projectileId==idx(0)
                }?.toDouble() ?: 0.0
                "numtarget" -> f.targets(if (args.isEmpty()) -1 else idx(0)).size.toDouble()
                "numexplod" -> {
                    require(args.size <= 1) { "NumExplod requires zero or one argument" }
                    f.world?.effects?.count(f,if(args.isEmpty())null else idx(0))?.toDouble() ?: 0.0
                }
                else -> throw IllegalArgumentException("Unsupported function: "+name)
            }
            val resultFloating=when(name) {
                "map","fvar","sysfvar","sin","cos" -> true
                "abs","min","max" -> floating
                "gethitvar" -> (args[0] as Variable).key in setOf("xvel","yvel","yaccel","fall.xvel","fall.yvel",
                    "fall.envshake.freq","fall.envshake.ampl","fall.envshake.phase")
                else -> false
            }
            return Value.num(v,resultFloating || v%1.0!=0.0)
        }
    }
    private data class Unary(val op:String,val x:Node): Node {
        override fun read(f:FightingCharacter):Value {
            val value=x.read(f);val n=value.number()
            if(op == "~")return Value.num(value.bitwiseInteger().inv().toDouble())
            return Value.num(when(op) { "-"->-n; "+"->n; "!"->if(n==0.0)1.0 else 0.0
                else -> throw IllegalArgumentException("Bad unary operator") },op!="!" && value.floating)
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
                "^^"->a.bool()!=b.bool()
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
            val result=when(op) {
                "+"->left+right
                "-"->left-right
                "*"->left*right
                "/"->if(right==0.0)throw IllegalArgumentException("Divide by zero") else left/right
                "%"->if(right==0.0)throw IllegalArgumentException("Modulo by zero") else left%right
                "&"->(a.bitwiseInteger() and b.bitwiseInteger()).toDouble()
                "|"->(a.bitwiseInteger() or b.bitwiseInteger()).toDouble()
                "^"->(a.bitwiseInteger() xor b.bitwiseInteger()).toDouble()
                else->throw IllegalArgumentException("Unsupported operator: "+op)
            }
            return Value.num(result,a.floating || b.floating || result%1.0!=0.0)
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
        fun signedInteger(): Node {
            val sign = if(accept("-")) -1 else { accept("+"); 1 }
            val token = consume()
            val integer = token.value.toLongOrNull()
            require(token.type == 'n' && integer != null && integer * sign in Int.MIN_VALUE.toLong()..Int.MAX_VALUE.toLong()) {
                "AnimElem requires integer constants; use AnimElemTime for expressions"
            }
            return Literal(Value.num((integer * sign).toDouble()))
        }
        fun parse():Node{
            val node=or()
            if(cursor!=tokens.size)throw IllegalArgumentException("Trailing token "+peek())
            return node
        }
        fun or():Node{var n=logicalXor();while(accept("||")||accept("or"))n=Binary("||",n,logicalXor());return n}
        fun logicalXor():Node{var n=and();while(accept("^^"))n=Binary("^^",n,and());return n}
        fun and():Node{var n=bitOr();while(accept("&&")||accept("and"))n=Binary("&&",n,bitOr());return n}
        fun bitOr():Node{var n=bitXor();while(accept("|"))n=Binary("|",n,bitXor());return n}
        fun bitXor():Node{var n=bitAnd();while(accept("^"))n=Binary("^",n,bitAnd());return n}
        fun bitAnd():Node{var n=compare();while(accept("&"))n=Binary("&",n,compare());return n}
        fun compare():Node{
            var n=plus()
            while(peek() in setOf("=","==","!=","<>","<",">","<=",">=")){
                val op=consume().value;n=Binary(op,n,plus())
            }
            return n
        }
        fun plus():Node{var n=mul();while(peek()=="+"||peek()=="-")n=Binary(consume().value,n,mul());return n}
        fun mul():Node{var n=unary();while(peek()=="*"||peek()=="/"||peek()=="%")n=Binary(consume().value,n,unary());return n}
        fun unary():Node=if(peek() in setOf("+","-","!","~"))Unary(consume().value,unary())else primary()
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
            if(t.type=='n')return Literal(Value.num(t.value.toDouble(),t.value.any { it=='.'||it=='e'||it=='E' }))
            if(t.type=='s')return Literal(Value.str(t.value))
            if(t.type!='i')throw IllegalArgumentException("Invalid token "+t.value)
            var name=t.value.lowercase()
            val projectile=projectilePredicate.matchEntire(name)
            if(projectile != null && (accept("=") || accept("=="))) {
                val suffix=projectile.groupValues[2]
                val id=if(suffix.isEmpty())0 else suffix.toIntOrNull()
                    ?: throw IllegalArgumentException("Projectile ID out of range")
                val expected=plus()
                var op="<="
                var limit: Node=Literal(Value.num(1.0))
                if(accept(",")) {
                    op=if(peek() in setOf("=","==","!=","<>","<",">","<=",">="))consume().value else "="
                    limit=plus()
                }
                return ProjectilePredicate(projectileKind("proj"+projectile.groupValues[1]),id,expected,op,limit)
            }
            // Legacy AnimElem is a time comparison, not a comparison with
            // the currently displayed element number. Parse its comma here;
            // parentheses delimit a legacy trigger nested in a function.
            if (name == "animelem" && accept("=")) {
                val element = signedInteger()
                var op = "="
                var time: Node = Literal(Value.num(0.0))
                if (accept(",")) {
                    if (peek() in setOf("=", "==", "!=", "<>", "<", ">", "<=", ">=")) op = consume().value
                    time = signedInteger()
                }
                return Binary(op, FunctionCall("animelemtime", listOf(element)), time)
            }
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
                if (name in redirects && accept(",")) {
                    require(name != "parent" && name != "root" && args.size <= 1) {
                        "Invalid $name redirect arguments"
                    }
                    val value = unary()
                    depth--
                    return Redirect(name, args.firstOrNull(), value)
                }
                depth--;return FunctionCall(name,args)
            }
            if (name in redirects && accept(",")) {
                require(++depth <= 32) { "Expression nesting limit" }
                val value = unary()
                depth--
                return Redirect(name, null, value)
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
                if(source.getOrNull(i) in listOf('e','E')) {
                    i++;if(source.getOrNull(i) in listOf('+','-'))i++
                    val exponentStart=i
                    while(source.getOrNull(i)?.isDigit()==true)i++
                    require(i>exponentStart) {"Malformed exponent"}
                }
                val raw=source.substring(start,i)
                require(raw.toDoubleOrNull()!=null){"Malformed number"}
                result.add(Token(raw,'n'))
            }else if(c.isLetter()||c=='_'){
                val start=i++
                while(i<source.length&&(source[i].isLetterOrDigit()||source[i]=='_'||source[i]=='.'))i++
                result.add(Token(source.substring(start,i),'i'))
            }else{
                val pair=source.substring(i,min(source.length,i+2))
                val op=if(pair in setOf("&&","||","^^","!=","==","<=",">=","<>")){i+=2;pair}
                    else {require(c in "[]()+-*/%,=<>!~&|^"){"Unsupported character"};i++;c.toString()}
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
    fun numericValue(raw: String, actor: FightingCharacter, errors: MutableSet<String>, label: String = "map"): Double? =
        try {
            numeric(parse(raw.trim()), actor, "$label value")
        } catch (e: IllegalArgumentException) {
            errors.add("Unsupported $label expression: ${raw.take(100)} (${e.message})")
            null
        }
    internal fun debugNumber(raw: String,actor: FightingCharacter): CoreDebugNumber {
        val value=parse(raw.trim()).read(actor)
        val n=value.n ?: throw IllegalArgumentException("Clipboard params require numeric expressions")
        require(n.isFinite()) { "Nonfinite clipboard parameter" }
        return CoreDebugNumber(n,value.floating)
    }
    private val constantActor by lazy { FightingCharacter(FighterDefinition("constant expression"),0) }
    fun constant(raw: String): Double {
        val node=parse(raw.trim())
        fun constant(n: Node): Boolean=when(n) {
            is Literal -> n.v.n!=null
            is Unary -> constant(n.x)
            is Binary -> constant(n.x)&&constant(n.y)
            is FunctionCall -> n.name in setOf("abs","floor","ceil","sin","cos","min","max","ifelse","cond")&&n.args.all{constant(it)}
            else -> false
        }
        require(constant(node)) { "Map default requires a numeric constant expression" }
        return numeric(node,constantActor,"Map default")
    }
    fun test(raw:String,actor:FightingCharacter,errors:MutableSet<String>):Boolean=
        number(raw,actor,errors)?.let{it!=0.0}?:false
}
