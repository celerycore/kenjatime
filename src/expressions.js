/**
 * Bounded, data-only MUGEN CNS expression interpreter. Character text is never
 * passed to JavaScript's eval/Function. Entity triggers belong to the runtime:
 * resolve(name, args, redirect) must return a number/string or throw.
 *
 * Old AnimElem clauses compare AnimElemTime(N); old TimeMod clauses compare
 * Time % divisor. Their arguments are integer literals, as in MUGEN 1.1.
 * Redirects are {name, args}; they apply to the immediately following trigger,
 * not the remainder of an arithmetic expression. Missing targets must throw.
 */

export class ExpressionError extends Error {
  constructor(message, source = '') {
    super(message);
    this.name = 'ExpressionError';
    this.source = source;
  }
}

export class UnsupportedExpressionError extends ExpressionError {
  constructor(message, source = '') {
    super(message, source);
    this.name = 'UnsupportedExpressionError';
  }
}

/** Native MUGEN "bottom": invalid numeric/target data, false at a trigger boundary. */
export class BottomError extends ExpressionError {
  constructor(message, source = '') {
    super(message, source);
    this.name = 'BottomError';
    this.bottom = true;
  }
}

const MAX_SOURCE = 8192;
const MAX_TOKENS = 2048;
const MAX_DEPTH = 96;
const MAX_STEPS = 8192;
const cache = new Map();
const precedence = {
  '||': 1, '^^': 2, '&&': 3, '|': 4, '^': 5, '&': 6,
  ':=': 7, '=': 8, '!=': 8, '<': 9, '>': 9, '<=': 9, '>=': 9,
  '+': 10, '-': 10, '*': 11, '/': 11, '%': 11, '**': 12,
};
const comparisons = new Set(['=', '!=', '<', '<=', '>', '>=']);
const redirects = new Set(['parent', 'root', 'helper', 'target', 'partner', 'enemy', 'enemynear', 'playerid', 'p2']);
const axes = new Set(['pos', 'vel', 'p2dist', 'p2bodydist', 'parentdist', 'rootdist', 'screenpos', 'hitvel', 'camerapos']);
const enums = new Set(['s', 'c', 'a', 'h', 'l', 'i', 'n', 'v', 'u']);
const symbolArguments = new Set(['const', 'gethitvar','stagevar']);
const floatHitVars=new Set(['xveladd','yveladd','xoff','yoff','zoff','xvel','yvel','yaccel','fall.xvel','fall.yvel','fall.envshake.freq','fall.envshake.phase']);
const floatTriggers = /^(?:fvar|sysfvar|const240p|const480p|const720p|pos [xy]|vel [xy]|p2dist [xy]|p2bodydist [xy]|parentdist [xy]|rootdist [xy]|screenpos [xy]|hitvel [xy]|camerapos [xy]|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|(?:front|back)edge(?:body)?dist|frontedge|backedge)$/;
const floatConstant=name=>/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(name);
const mathFunctions = {
  abs: [1, Math.abs], ceil: [1, Math.ceil], floor: [1, Math.floor],
  exp: [1, Math.exp], ln: [1, Math.log], log: [2, (base, value) => Math.log(value) / Math.log(base)],
  sin: [1, Math.sin], cos: [1, Math.cos], tan: [1, Math.tan],
  asin: [1, Math.asin], acos: [1, Math.acos], atan: [1, Math.atan],
  sqrt: [1, Math.sqrt], min: [2, Math.min], max: [2, Math.max],
};
const oneArgument=new Set(['var','fvar','sysvar','sysfvar','animelemtime','animelemno','animexist','selfanimexist','const','const240p','const480p','const720p','gethitvar','stagevar','numprojid','playeridexist','projcanceltime','projcontacttime','projguardedtime','projhittime']);
const optionalArgument=new Set(['numhelper','numexplod','numtarget','ishelper']);
const nameClauses=new Set(['name','authorname','p1name','p2name','p3name','p4name']);
const noArguments=new Set('time stateno prevstateno anim animtime ctrl statetype movetype physics life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id name authorname p1name p2name p3name p4name win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam teammode leftedge rightedge topedge bottomedge frontedge backedge frontedgedist backedgedist frontedgebodydist backedgebodydist gamewidth gameheight screenwidth screenheight camerazoom winko wintime winperfect loseko losetime loseperfect random pi e'.split(' '));

function tokenize(source) {
  if (typeof source !== 'string') throw new ExpressionError('Expression must be text.');
  if (source.length > MAX_SOURCE) throw new ExpressionError(`Expression exceeds ${MAX_SOURCE} characters.`);
  const tokens = [];
  let offset = 0;
  while (offset < source.length) {
    if (/\s/.test(source[offset])) { offset++; continue; }
    const start = offset;
    const rest = source.slice(offset);
    let match;
    if (source[offset] === '"') {
      offset++;
      let value = '';
      let closed = false;
      while (offset < source.length) {
        const ch = source[offset++];
        if (ch === '"') { closed = true; break; }
        // CNS names use literal backslashes; only a quoted quote is escaped.
        if (ch === '\\' && source[offset] === '"') { value += '"'; offset++; }
        else value += ch;
      }
      if (!closed) throw new ExpressionError(`Unterminated string at ${start}.`, source);
      tokens.push({ type: 'string', value, position: start });
    } else if ((match = rest.match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/))) {
      const value = Number(match[0]);
      if (!Number.isFinite(value)) throw new ExpressionError(`Invalid number at ${start}.`, source);
      tokens.push({ type: 'number', value, float: /[.eE]/.test(match[0]), position: start });
      offset += match[0].length;
    } else if ((match = rest.match(/^[a-z_][a-z0-9_.]*/i))) {
      tokens.push({ type: 'name', value: match[0].toLowerCase(), position: start });
      offset += match[0].length;
    } else if ((match = rest.match(/^(?:\*\*|:=|<=|>=|!=|&&|\|\||\^\^|[+\-*/%!~&|^=<>()[\],])/))) {
      tokens.push({ type: 'operator', value: match[0], position: start });
      offset += match[0].length;
    } else throw new UnsupportedExpressionError(`Unsupported token at ${start}: ${source[offset]}`, source);
    if (tokens.length > MAX_TOKENS) throw new ExpressionError(`Expression exceeds ${MAX_TOKENS} tokens.`, source);
  }
  tokens.push({ type: 'end', value: '', position: offset });
  return tokens;
}

class Parser {
  constructor(source) {
    this.source = source;
    this.tokens = tokenize(source);
    this.index = 0;
    this.depth = 0;
  }
  peek(ahead = 0) { return this.tokens[this.index + ahead] || this.tokens.at(-1); }
  take() { return this.tokens[this.index++]; }
  accept(value) { if (this.peek().value !== value) return false; this.index++; return true; }
  expect(value) { if (!this.accept(value)) this.fail(`Expected "${value}"`); }
  fail(message) { throw new ExpressionError(`${message} at ${this.peek().position}.`, this.source); }
  signedInteger() {
    const sign = this.accept('-') ? -1 : (this.accept('+'), 1);
    const token = this.take();
    if (token.type !== 'number' || token.float) this.fail('Expected an integer literal');
    return { kind: 'number', value: sign * token.value, float: false };
  }
  parse(minimum = 0) {
    if (++this.depth > MAX_DEPTH) this.fail(`Expression nesting exceeds ${MAX_DEPTH}`);
    let left = this.prefix();
    for (;;) {
      const op = this.peek().value;
      const level = precedence[op];
      if (level === undefined || level < minimum) break;
      this.take();
      if ((op === '=' || op === '!=') && (this.peek().value === '[' || this.isOpenInterval())) {
        const open = this.take().value;
        const low = this.parse();
        this.expect(',');
        const high = this.parse();
        const close = this.take().value;
        if (close !== ']' && close !== ')') this.fail('Expected an interval endpoint');
        left = { kind: 'range', op, left, low, high, includeLow: open === '[', includeHigh: close === ']' };
      } else {
        const right = this.parse(level + (op === ':=' ? 0 : 1));
        if (op === ':=') {
          if (left.kind !== 'call' || !['var', 'fvar'].includes(left.name) || left.args.length !== 1) this.fail('Assignment requires var(index) or fvar(index)');
          left = { kind: 'assign', left, right };
        } else left = { kind: 'binary', op, left, right };
      }
    }
    this.depth--;
    return left;
  }
  isOpenInterval() {
    if (this.peek().value !== '(') return false;
    // A parenthesized redirected trigger also contains a top-level comma;
    // prefer a valid grouping before interpreting that comma as an interval.
    const savedIndex = this.index, savedDepth = this.depth;
    try { this.prefix(); return false; }
    catch { /* A two-endpoint interval is not a valid grouping. */ }
    finally { this.index = savedIndex; this.depth = savedDepth; }
    let depth = 0;
    for (let i = this.index; i < this.tokens.length; i++) {
      const value = this.tokens[i].value;
      if (value === '(' || value === '[') depth++;
      else if (value === ')' || value === ']') { if (--depth === 0) return false; }
      else if (value === ',' && depth === 1) return true;
    }
    return false;
  }
  prefix() {
    const token = this.take();
    if (token.type === 'number') return { kind: 'number', value: token.value, float: token.float };
    if (token.type === 'string') return { kind: 'string', value: token.value };
    if (['+', '-', '!', '~'].includes(token.value)) return { kind: 'unary', op: token.value, value: this.parse(13) };
    if (token.value === '(') { const value = this.parse(); this.expect(')'); return value; }
    if (token.type !== 'name') this.fail('Expected a value');
    const name = token.value;
    if(nameClauses.has(name)&&['=','!='].includes(this.peek().value)){
      const op=this.take().value,value=this.take();if(value.type!=='string')this.fail(`${name} comparison requires a quoted name`);
      return {kind:'binary',op,left:{kind:'name',name},right:{kind:'string',value:value.value}};
    }
    if(['statetype','movetype','p2statetype','p2movetype'].includes(name)&&['=','!='].includes(this.peek().value)&&this.peek(1).type==='name'&&enums.has(this.peek(1).value)){
      const op=this.take().value,value=this.take().value;return {kind:'binary',op,left:{kind:'name',name},right:{kind:'string',value:value.toUpperCase()}};
    }
    if(name==='teammode'&&['=','!='].includes(this.peek().value)){
      const op=this.take().value,mode=this.take();
      if(mode.type!=='name'||!['single','simul','turns'].includes(mode.value))this.fail('TeamMode requires Single, Simul or Turns');
      return {kind:'binary',op,left:{kind:'name',name},right:{kind:'string',value:mode.value}};
    }
    const projectile = name.match(/^proj(hit|contact|guarded)(\d*)$/);
    if (projectile && this.accept('=')) {
      const expected = this.signedInteger();
      if (![0,1].includes(expected.value)) this.fail('Projectile condition requires 0 or 1');
      let op = '=', time = {kind:'number',value:1,float:false};
      if (this.accept(',')) { if (comparisons.has(this.peek().value)) op = this.take().value; time = this.signedInteger(); }
      return {kind:'legacyprojectile',name:`proj${projectile[1]}time`,id:Number(projectile[2] || 0),expected:expected.value,op,time};
    }
    if (name === 'command' && ['=', '!='].includes(this.peek().value)) {
      const op = this.take().value, command = this.take();
      if (command.type !== 'string') this.fail('Command comparison requires a quoted name');
      return { kind: 'command', op, command: command.value };
    }
    if (name === 'animelem' && this.accept('=')) {
      const element = this.signedInteger();
      let op = '=', time = { kind: 'number', value: 0, float: false };
      if (this.accept(',')) {
        if (comparisons.has(this.peek().value)) op = this.take().value;
        time = this.signedInteger();
      }
      return { kind: 'legacyanim', element, op, time };
    }
    if (name === 'timemod' && comparisons.has(this.peek().value)) {
      const op = this.take().value, divisor = this.signedInteger();
      this.expect(',');
      return { kind: 'legacytime', op, divisor, remainder: this.signedInteger() };
    }
    if (name === 'hitdefattr' && ['=', '!='].includes(this.peek().value)) {
      const op = this.take().value, state = this.take();
      if (state.type !== 'name' || !/^[sca]+$/.test(state.value)) this.fail('HitDefAttr requires state letters S, C or A');
      const attributes = [state.value.toUpperCase()];
      this.expect(',');
      do {
        const attribute = this.take();
        if (attribute.type !== 'name' || !/^[nsha][atp]$/.test(attribute.value)) this.fail('HitDefAttr requires attack attributes such as NA or ST');
        attributes.push(attribute.value.toUpperCase());
      } while (this.peek().value === ',' && this.peek(1).type === 'name' && /^[nsha][atp]$/.test(this.peek(1).value) && this.accept(','));
      return { kind: 'legacyattribute', op, attributes };
    }
    let node;
    if (this.accept('(')) {
      const args = [];
      if (!this.accept(')')) {
        do { args.push(this.parse()); } while (this.accept(','));
        this.expect(')');
      }
      if((oneArgument.has(name)||optionalArgument.has(name))&&args.length!==1)this.fail(`${name} requires one argument`);
      if(noArguments.has(name)&&args.length)this.fail(`${name} requires no arguments`);
      const arity=Object.hasOwn(mathFunctions,name)?mathFunctions[name][0]:['cond','ifelse'].includes(name)?3:null;
      if(arity!==null&&args.length!==arity)this.fail(`${name} requires ${arity} argument(s)`);
      node = { kind: 'call', name, args };
    } else {
      if(oneArgument.has(name))this.fail(`${name} requires a parameter list`);
      let fullName = name;
      if (axes.has(name) && this.peek().type === 'name' && /^[xy]$/.test(this.peek().value)) fullName += ' ' + this.take().value;
      node = { kind: 'name', name: fullName };
    }
    if (redirects.has(name) && this.accept(',')) {
      return { kind: 'redirect', target: node, value: this.prefix() };
    }
    return node;
  }
}

/** Splits a controller's comma-separated values while respecting quotes/ranges. */
export function splitArguments(source) {
  if (typeof source !== 'string' || source.length > MAX_SOURCE) throw new ExpressionError('Invalid or oversized argument list.');
  const result = [];
  let depth = 0, quote = false, escaped=false, start = 0;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '"' && !escaped) quote = !quote;
    escaped=ch==='\\'&&!escaped;
    if (quote) continue;
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') { if (--depth < 0) throw new ExpressionError('Unbalanced argument list.'); }
    else if (ch === ',' && depth === 0) { result.push(source.slice(start, i).trim()); start = i + 1; }
  }
  if (quote || depth) throw new ExpressionError('Unbalanced argument list.');
  result.push(source.slice(start).trim());
  return result;
}

export function parseExpression(source) {
  const parser = new Parser(source);
  const ast = parser.parse();
  if (parser.peek().type !== 'end') parser.fail('Unexpected token');
  const freeze=node=>{for(const value of Object.values(node)){if(Array.isArray(value)){value.forEach(item=>item&&typeof item==='object'&&freeze(item));Object.freeze(value);}else if(value&&typeof value==='object')freeze(value);}return Object.freeze(node);};
  return freeze(ast);
}

export function compileExpression(source) {
  if (cache.has(source)) return cache.get(source);
  const ast = parseExpression(source);
  const compiled = context => execute(ast, context || {}, source);
  // A caller cannot mutate a shared AST. The closure is the cached artifact.
  if (cache.size >= 512) cache.delete(cache.keys().next().value);
  cache.set(source, compiled);
  return compiled;
}

export function evaluateExpression(source, context = {}) {
  return compileExpression(source)(context);
}

export function evaluateTypedExpression(source, context = {}) {
  return compileExpression(source)({...context,typedResult:true});
}

const numeric = (value, float = false) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new BottomError('Expression produced a non-finite number.');
  const result=float?Math.fround(value):value|0;
  if(!Number.isFinite(result))throw new BottomError('Expression produced a non-finite number.');
  return { value:result, float };
};
const integer = value => numeric(value,false);
function number(value) {
  if(value.bottom)throw value.error;
  if (typeof value.value !== 'number') throw new BottomError('A numeric value is required.');
  return value.value;
}
function boolean(value) { return number(value) !== 0; }
function compare(op, a, b) {
  if(a.bottom||b.bottom)throw (a.bottom?a:b).error;
  if(a.absent||b.absent){if(!['=','!='].includes(op))throw new ExpressionError('Only equality comparisons are allowed for strings.');return integer(+(op==='!='));}
  if (typeof a.value !== typeof b.value) throw new BottomError('Cannot compare a string with a number.');
  if (typeof a.value === 'string' && !['=', '!='].includes(op)) throw new ExpressionError('Only equality comparisons are allowed for strings.');
  if(typeof a.value==='number'&&(a.float||b.float)){a={value:Math.fround(a.value)};b={value:Math.fround(b.value)};}
  switch (op) {
    case '=': return integer(Number(a.value === b.value));
    case '!=': return integer(Number(a.value !== b.value));
    case '<': return integer(Number(a.value < b.value));
    case '<=': return integer(Number(a.value <= b.value));
    case '>': return integer(Number(a.value > b.value));
    case '>=': return integer(Number(a.value >= b.value));
  }
}

function execute(ast, context, source) {
  let steps = 0;
  const resolve = (name, args, redirect) => {
    if (typeof context.resolve !== 'function') throw new UnsupportedExpressionError(`Unsupported trigger: ${name}.`, source);
    const value = context.resolve(name, args, redirect);
    if (typeof value === 'number') return numeric(value, floatTriggers.test(name)||name==='gethitvar'&&floatHitVars.has(String(args[0]).toLowerCase())||name==='const'&&floatConstant(String(args[0]).toLowerCase())||!Number.isInteger(value));
    if (typeof value === 'boolean') return integer(Number(value));
    if (typeof value === 'string') return { value };
    if(value?.absent)return {value:'',absent:true};
    // Optional explicit type lets a runtime distinguish 1.0 from 1.
    if (value && typeof value.value === 'number') return numeric(value.value, value.type === 'float' || value.float);
    throw new UnsupportedExpressionError(`Trigger ${name} returned no supported value.`, source);
  };
  const run = (node, redirect = null) => {
    if (++steps > MAX_STEPS) throw new ExpressionError('Expression evaluation budget exceeded.', source);
    try{
    switch (node.kind) {
      case 'number': return numeric(node.value, node.float);
      case 'string': return { value: node.value };
      case 'name':
        if (node.name === 'pi') return numeric(Math.PI, true);
        if (node.name === 'e') return numeric(Math.E,true);
        if (enums.has(node.name)) return { value: node.name.toUpperCase() };
        return resolve(node.name, [], redirect);
      case 'unary': {
        const v = run(node.value, redirect), n = number(v);
        if (node.op === '+') return v;
        if (node.op === '-') return numeric(-n, v.float);
        if (node.op === '!') return integer(Number(n === 0));
        if (v.float) throw new BottomError('Bitwise operators require integers.', source);
        return integer(~n);
      }
      case 'redirect': {
        if (redirect) throw new UnsupportedExpressionError('Recursive trigger redirection is unsupported by MUGEN 1.1.', source);
        const args = node.target.args?.map(arg => number(run(arg))) || [];
        return run(node.value, { name: node.target.name, args });
      }
      case 'assign': {
        if (redirect) throw new ExpressionError('Variable assignment cannot be redirected.', source);
        if (typeof context.assign !== 'function') throw new UnsupportedExpressionError('Variable assignment is unavailable.', source);
        const args = node.left.args.map(arg => number(run(arg)));
        const rhs = run(node.right), value = number(rhs);
        const assigned = node.left.name === 'var' ? Math.trunc(value)|0 : Math.fround(value);
        const stored = context.assign(node.left.name, args, assigned);
        return numeric(typeof stored === 'number' ? stored : assigned, node.left.name === 'fvar');
      }
      case 'range': {
        const values=[run(node.left,redirect),run(node.low,redirect),run(node.high,redirect)],floating=values.some(value=>value.float);
        const [value,low,high]=values.map(value=>floating?Math.fround(number(value)):number(value));
        const within = (node.includeLow ? value >= low : value > low) && (node.includeHigh ? value <= high : value < high);
        return integer(Number(node.op === '=' ? within : !within));
      }
      case 'legacyanim':
        return compare(node.op, resolve('animelemtime', [node.element.value], redirect), run(node.time, redirect));
      case 'legacytime': {
        const divisor = node.divisor.value;
        if (divisor <= 0) throw new ExpressionError('TimeMod divisor must be positive.', source);
        return compare(node.op, integer(number(resolve('time', [], redirect)) % divisor), run(node.remainder, redirect));
      }
      case 'legacyprojectile': {
        const age = resolve(node.name,[node.id],redirect);
        const matched = number(age) >= 0 && boolean(compare(node.op,age,run(node.time,redirect)));
        return integer(Number(node.expected ? matched : !matched));
      }
      case 'legacyattribute': {
        const matches = boolean(resolve('hitdefattr', node.attributes, redirect));
        return integer(Number(node.op === '=' ? matches : !matches));
      }
      case 'command': {
        const active = boolean(resolve('command', [node.command], redirect));
        return integer(Number(node.op === '=' ? active : !active));
      }
      case 'call': {
        if (node.name === 'cond' || node.name === 'ifelse') {
          if (node.args.length !== 3) throw new ExpressionError(`${node.name} requires three arguments.`, source);
          const condition = run(node.args[0], redirect);
          if (node.name === 'cond') return run(node.args[boolean(condition) ? 1 : 2], redirect);
          // IfElse evaluates all arguments, even with a bottom condition.
          const values=[run(node.args[1],redirect),run(node.args[2],redirect)];
          for(const value of values)if(value.bottom)context.onWarning?.(value.error);
          const chosen = boolean(condition) ? 0 : 1;
          return values[chosen];
        }
        if (Object.hasOwn(mathFunctions, node.name)) {
          const [arity, fn] = mathFunctions[node.name];
          if (node.args.length !== arity) throw new ExpressionError(`${node.name} requires ${arity} argument(s).`, source);
          const args = node.args.map(arg => run(arg, redirect));
          const result = fn(...args.map(arg=>!['abs','min','max'].includes(node.name)?Math.fround(number(arg)):number(arg)));
          const float = !['ceil', 'floor'].includes(node.name) && (node.name !== 'abs' || args[0].float) && (!['min', 'max'].includes(node.name) || args.some(arg => arg.float));
          return numeric(result, float);
        }
        const values=node.args.map(arg=>symbolArguments.has(node.name)&&arg.kind==='name'?{value:arg.name}:run(arg,redirect));
        const invalid=values.find(value=>value.bottom);if(invalid)throw invalid.error;
        const args=values.map(arg=>arg.value);
        return resolve(node.name, args, redirect);
      }
      case 'binary': {
        const left = run(node.left, redirect), right = run(node.right, redirect);
        if (comparisons.has(node.op)) return compare(node.op, left, right);
        const float = left.float || right.float,a=float?Math.fround(number(left)):number(left),b=float?Math.fround(number(right)):number(right);
        switch (node.op) {
          case '+': return numeric(a + b, float);
          case '-': return numeric(a - b, float);
          case '*': return numeric(float?a*b:Math.imul(a,b), float);
          case '/':
            if (b === 0) throw new BottomError('Division by zero.', source);
            return numeric(float ? a / b : Math.trunc(a / b), float);
          case '%':
            if (float || b === 0) throw new BottomError('Remainder requires integers and a nonzero divisor.', source);
            return integer(a % b);
          case '**': {
            const floating = float || a < 0 || b < 0;
            let value = a ** b;
            if (!floating && value > 2147483647) { value = 2147483647; context.onWarning?.(new ExpressionError('Integer exponent overflow.', source)); }
            return numeric(value, floating);
          }
          case '&&': return integer(Number(a !== 0 && b !== 0));
          case '||': return integer(Number(a !== 0 || b !== 0));
          case '^^': return integer(Number((a !== 0) !== (b !== 0)));
          case '&': case '|': case '^':
            if (float) throw new BottomError('Bitwise operators require integers.', source);
            return integer(node.op === '&' ? a & b : node.op === '|' ? a | b : a ^ b);
          default: throw new UnsupportedExpressionError(`Unsupported operator ${node.op}.`, source);
        }
      }
      default: throw new ExpressionError('Invalid compiled expression.', source);
    }
    }catch(error){if(error?.bottom)return {bottom:true,error};throw error;}
  };
  try { const result=run(ast);if(result.bottom)throw result.error;return context.typedResult?result:result.value; }
  catch (error) {
    if (error instanceof ExpressionError) { if (!error.source) error.source = source; throw error; }
    if (error?.bottom) throw new BottomError(error.message || 'Expression evaluated to bottom.', source);
    throw new ExpressionError(error?.message || 'Trigger evaluation failed.', source);
  }
}
