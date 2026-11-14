/** Independently authored CNS numeric compiler. Emits standard WebAssembly;
 * imports only this engine's typed trigger API and ECMAScript math functions.
 * Text is parsed as data; eval, Function, WASI and external engine code are absent.
 */
import {
  parseExpression,
  compileExpression,
  evaluateExpression,
  evaluateTypedExpression,
  BottomError,
  ExpressionError,
  UnsupportedExpressionError,
} from "../expressions.js";

const I = 0x7f,
  F = 0x7d,
  D = 0x7c;
const integerFields = new Set(
  "time stateno prevstateno anim animtime ctrl life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam winko wintime winperfect loseko losetime loseperfect".split(
    " ",
  ),
);
const floatFields = new Set(
  "pos x|pos y|vel x|vel y|p2dist x|p2dist y|p2bodydist x|p2bodydist y|parentdist x|parentdist y|rootdist x|rootdist y|screenpos x|screenpos y|hitvel x|hitvel y|camerapos x|camerapos y|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|frontedge|backedge|frontedgedist|backedgedist|frontedgebodydist|backedgebodydist".split(
    "|",
  ),
);
const integerCalls = new Set(
  "var sysvar animelemtime animelemno animexist selfanimexist projhit projcontact projguarded numprojid playeridexist projcanceltime projcontacttime projguardedtime projhittime numhelper numexplod numtarget ishelper".split(
    " ",
  ),
);
const floatCalls = new Set([
  "fvar",
  "sysfvar",
  "const240p",
  "const480p",
  "const720p",
]);
const stringFields = new Set(
  "name authorname p1name p2name p3name p4name statetype movetype physics p2statetype p2movetype teammode".split(
    " ",
  ),
);
const floatHitVars = new Set(
  "xveladd yveladd xoff yoff zoff xvel yvel yaccel fall.xvel fall.yvel fall.envshake.freq fall.envshake.phase".split(
    " ",
  ),
);
const mathNames = ["sin", "cos", "tan", "asin", "acos", "atan", "exp", "ln"];
const encoder = new TextEncoder();
const u32 = (value) => {
  const bytes = [];
  do {
    const byte = value & 127;
    value >>>= 7;
    bytes.push(byte | (value ? 128 : 0));
  } while (value);
  return bytes;
};
const s32 = (value) => {
  value |= 0;
  const bytes = [];
  while (true) {
    const byte = value & 127;
    value >>= 7;
    const end =
      (value === 0 && !(byte & 64)) || (value === -1 && !!(byte & 64));
    bytes.push(byte | (end ? 0 : 128));
    if (end) return bytes;
  }
};
const str = (value) => {
  const bytes = encoder.encode(value);
  return [...u32(bytes.length), ...bytes];
};
const vector = (parts) => [...u32(parts.length), ...parts.flat()];
const section = (id, bytes) => [id, ...u32(bytes.length), ...bytes];
const iconst = (value) => [0x41, ...s32(value)];
const fconst = (value) => {
  const bytes = new Uint8Array(4);
  new DataView(bytes.buffer).setFloat32(0, value, true);
  return [0x43, ...bytes];
};
const zero64 = [0x44, 0, 0, 0, 0, 0, 0, 0, 0];
const call = (index) => [0x10, ...u32(index)];
const localGet = (index) => [0x20, ...u32(index)],
  localSet = (index) => [0x21, ...u32(index)];
const convert = (node, type) =>
  node.type === type
    ? node.code
    : [...node.code, node.type === I ? (type === F ? 0xb2 : 0xb7) : 0xbb];
const bool = (node) =>
  node.type === I
    ? [...node.code, 0x45, 0x45]
    : [...node.code, ...fconst(0), 0x5c];
const finite = (code) => [...code, ...call(2)];
const typed = (type, code) => ({ type, code });
class NotNumeric extends Error {}
class TypeChanged extends Error {}

class FunctionCompiler {
  constructor(trigger) {
    this.trigger = trigger;
    this.locals = [];
  }
  local(type) {
    this.locals.push(type);
    return this.locals.length - 1;
  }
  read(name, args = []) {
    const type =
      floatFields.has(name) || floatCalls.has(name)
        ? F
        : integerFields.has(name) || integerCalls.has(name)
          ? I
          : null;
    if (!type || args.length > 2) throw new NotNumeric();
    const code = [...iconst(this.trigger(name)), ...iconst(args.length)];
    for (let i = 0; i < 2; i++)
      code.push(...(args[i] ? convert(this.node(args[i]), D) : zero64));
    code.push(...call(type === I ? 0 : 1));
    return typed(type, code);
  }
  literal(descriptor, type = I) {
    return typed(type, [
      ...iconst(this.trigger(descriptor)),
      ...iconst(0),
      ...zero64,
      ...zero64,
      ...call(type === I ? 0 : 1),
    ]);
  }
  node(n) {
    if (n.kind === "number") {
      if (n.float && !Number.isFinite(Math.fround(n.value)))
        throw new NotNumeric();
      return typed(
        n.float ? F : I,
        n.float ? fconst(n.value) : iconst(n.value),
      );
    }
    if (n.kind === "name") {
      if (n.name === "pi" || n.name === "e")
        return typed(F, fconst(n.name === "pi" ? Math.PI : Math.E));
      // Random, strings, assignments and redirects stay in the data interpreter.
      // The fast path's trigger imports are pure reads with a stable numeric type.
      return this.read(n.name);
    }
    if (n.kind === "unary") {
      const v = this.node(n.value);
      if (n.op === "+") return v;
      if (n.op === "!") return typed(I, [...bool(v), 0x45]);
      if (n.op === "-")
        return typed(
          v.type,
          v.type === I ? [...iconst(0), ...v.code, 0x6b] : [...v.code, 0x8c],
        );
      if (n.op === "~" && v.type === I)
        return typed(I, [...v.code, ...iconst(-1), 0x73]);
      throw new NotNumeric();
    }
    if (n.kind === "legacyanim")
      return this.binary(
        n.op,
        this.read("animelemtime", [n.element]),
        this.node(n.time),
      );
    if (n.kind === "legacytime") {
      if (n.divisor.value <= 0) throw new NotNumeric();
      return this.binary(
        n.op,
        this.binary("%", this.read("time"), this.node(n.divisor)),
        this.node(n.remainder),
      );
    }
    if (n.kind === "range") {
      const nodes = [this.node(n.left), this.node(n.low), this.node(n.high)],
        type = nodes.some((v) => v.type === F) ? F : I,
        slots = nodes.map(() => this.local(type)),
        code = [];
      nodes.forEach((v, i) =>
        code.push(...convert(v, type), ...localSet(slots[i])),
      );
      const saved = (i) => typed(type, localGet(slots[i]));
      code.push(
        ...this.binary(n.includeLow ? ">=" : ">", saved(0), saved(1)).code,
        ...this.binary(n.includeHigh ? "<=" : "<", saved(0), saved(2)).code,
        0x71,
      );
      if (n.op === "!=") code.push(0x45);
      return typed(I, code);
    }
    if (n.kind === "command") {
      const v = this.literal({ name: "command", args: [n.command] });
      return n.op === "=" ? v : typed(I, [...v.code, 0x45]);
    }
    if (n.kind === "legacyattribute") {
      const v = this.literal({ name: "hitdefattr", args: n.attributes });
      return n.op === "=" ? v : typed(I, [...v.code, 0x45]);
    }
    if (n.kind === "binary") {
      if (
        ["=", "!="].includes(n.op) &&
        n.left.kind === "name" &&
        stringFields.has(n.left.name) &&
        n.right.kind === "string"
      )
        return this.literal({
          name: n.left.name,
          match: n.right.value,
          invert: n.op === "!=",
        });
      return this.binary(n.op, this.node(n.left), this.node(n.right));
    }
    if (n.kind === "call") {
      if (n.name === "cond") {
        const condition = this.node(n.args[0]),
          yes = this.node(n.args[1]),
          no = this.node(n.args[2]);
        if (yes.type !== no.type) throw new NotNumeric();
        return typed(yes.type, [
          ...bool(condition),
          0x04,
          yes.type,
          ...yes.code,
          0x05,
          ...no.code,
          0x0b,
        ]);
      }
      if (
        ["const", "gethitvar"].includes(n.name) &&
        ["name", "string"].includes(n.args[0]?.kind)
      ) {
        const key = n.args[0].name ?? n.args[0].value,
          type =
            n.name === "const"
              ? /^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(
                  key,
                )
                ? F
                : I
              : floatHitVars.has(key)
                ? F
                : I;
        return this.literal({ name: n.name, args: [key] }, type);
      }
      const args = n.args.map((v) => this.node(v));
      if (n.name === "abs") {
        const v = args[0];
        if (v.type === F) return typed(F, [...v.code, 0x8b]);
        const a = this.local(I);
        return typed(I, [
          ...v.code,
          ...localSet(a),
          ...localGet(a),
          ...iconst(0),
          0x48,
          0x04,
          I,
          ...iconst(0),
          ...localGet(a),
          0x6b,
          0x05,
          ...localGet(a),
          0x0b,
        ]);
      }
      if (n.name === "min" || n.name === "max") {
        if (args.some((v) => v.type === F))
          return typed(F, [
            ...convert(args[0], F),
            ...convert(args[1], F),
            n.name === "min" ? 0x96 : 0x97,
          ]);
        const a = this.local(I),
          b = this.local(I);
        return typed(I, [
          ...args[0].code,
          ...localSet(a),
          ...args[1].code,
          ...localSet(b),
          ...localGet(a),
          ...localGet(b),
          n.name === "min" ? 0x48 : 0x4a,
          0x04,
          I,
          ...localGet(a),
          0x05,
          ...localGet(b),
          0x0b,
        ]);
      }
      if (n.name === "ceil" || n.name === "floor")
        return typed(I, [
          ...convert(args[0], F),
          n.name === "ceil" ? 0x8d : 0x8e,
          0xbb,
          ...call(3),
        ]);
      if (n.name === "sqrt")
        return typed(F, finite([...convert(args[0], F), 0x91]));
      if (mathNames.includes(n.name))
        return typed(
          F,
          finite([
            ...convert(args[0], F),
            ...call(4 + mathNames.indexOf(n.name)),
          ]),
        );
      if (n.name === "log")
        return typed(
          F,
          finite([...convert(args[0], F), ...convert(args[1], F), ...call(12)]),
        );
      return this.read(n.name, n.args);
    }
    throw new NotNumeric();
  }
  binary(op, a, b) {
    if (["&&", "||", "^^"].includes(op))
      return typed(I, [
        ...bool(a),
        ...bool(b),
        op === "&&" ? 0x71 : op === "||" ? 0x72 : 0x73,
      ]);
    const type = a.type === F || b.type === F ? F : I,
      code = [...convert(a, type), ...convert(b, type)];
    const compare = {
      "=": [0x46, 0x5b],
      "!=": [0x47, 0x5c],
      "<": [0x48, 0x5d],
      ">": [0x4a, 0x5e],
      "<=": [0x4c, 0x5f],
      ">=": [0x4e, 0x60],
    };
    if (compare[op]) return typed(I, [...code, compare[op][+(type === F)]]);
    const arithmetic = {
      "+": [0x6a, 0x92],
      "-": [0x6b, 0x93],
      "*": [0x6c, 0x94],
    };
    if (arithmetic[op]) {
      code.push(arithmetic[op][+(type === F)]);
      return typed(type, type === F ? finite(code) : code);
    }
    if (op === "/") {
      if (type === F) return typed(F, finite([...code, 0x95]));
      const left = this.local(I),
        right = this.local(I);
      // Signed division wraps INT_MIN/-1 in CNS, rather than trapping as Wasm does.
      return typed(I, [
        ...a.code,
        ...localSet(left),
        ...b.code,
        ...localSet(right),
        ...localGet(left),
        ...iconst(-2147483648),
        0x46,
        ...localGet(right),
        ...iconst(-1),
        0x46,
        0x71,
        0x04,
        I,
        ...iconst(-2147483648),
        0x05,
        ...localGet(left),
        ...localGet(right),
        0x6d,
        0x0b,
      ]);
    }
    if (type === I && ["%", "&", "|", "^"].includes(op))
      return typed(I, [
        ...code,
        { "%": 0x6f, "&": 0x71, "|": 0x72, "^": 0x73 }[op],
      ]);
    throw new NotNumeric();
  }
}
function moduleBytes(functions) {
  const type = (params, result) => [
    0x60,
    ...vector(params.map((v) => [v])),
    1,
    result,
  ];
  const types = [
    type([I, I, D, D], I),
    type([I, I, D, D], F),
    type([F], F),
    type([D], I),
    type([F, F], F),
    type([], I),
    type([], F),
  ];
  const imports = [
    ["readInt", 0],
    ["readFloat", 1],
    ["finite", 2],
    ["wrap", 3],
    ...mathNames.map((n) => [n, 2]),
    ["log", 4],
  ].map(([name, type]) => [...str("host"), ...str(name), 0, ...u32(type)]);
  const exports = functions.map((_, i) => [
    ...str("e" + i),
    0,
    ...u32(imports.length + i),
  ]);
  const bodies = functions.map((f) => {
    const groups = [];
    for (const type of f.locals) {
      const last = groups.at(-1);
      if (last?.[1] === type) last[0]++;
      else groups.push([1, type]);
    }
    const bytes = [
      ...vector(groups.map(([n, t]) => [...u32(n), t])),
      ...f.code,
      0x0b,
    ];
    return [...u32(bytes.length), ...bytes];
  });
  return new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    ...section(1, vector(types)),
    ...section(2, vector(imports)),
    ...section(3, vector(functions.map((f) => u32(f.type === I ? 5 : 6)))),
    ...section(7, vector(exports)),
    ...section(10, vector(bodies)),
  ]);
}

export class WasmExpressions {
  constructor(
    sources = [],
    { maxFunctions = 4096, maxBytes = 2 * 1024 * 1024 } = {},
  ) {
    if (
      !Number.isInteger(maxFunctions) ||
      maxFunctions < 0 ||
      maxFunctions > 16384 ||
      !Number.isInteger(maxBytes) ||
      maxBytes < 0 ||
      maxBytes > 16 * 1024 * 1024
    )
      throw RangeError("Invalid numeric compilation budget.");
    this.context = null;
    this.entries = new Map();
    // Non-numeric authored expressions cannot be compiled to Wasm. Cache
    // their already-validated AST executors once per match rather than
    // repeating a second global AST-cache lookup ~1.5M times per 90 s.
    this.fallbackExecutors=new Map();
    this.fallbackCacheHits=0;
    this.triggers = [];
    this.counts = {
      wasm: 0,
      // Direct script reads bypass the Wasm/JS boundary without changing the
      // compiled numeric expression's f32/i32 return type.
      direct: 0,
      interpreted: 0,
      deoptimized: 0,
      compiled: 0,
      bytes: 0,
    };
    const triggerIds = new Map(),
      functions = [],
      pending = [];
    const trigger = (descriptor) => {
      const key = JSON.stringify(descriptor);
      if (!triggerIds.has(key)) {
        triggerIds.set(key, this.triggers.length);
        this.triggers.push(
          typeof descriptor === "string" ? { name: descriptor } : descriptor,
        );
      }
      return triggerIds.get(key);
    };
    let codeBytes = 0;
    for (const source of new Set(sources)) {
      if (
        typeof source !== "string" ||
        !source.trim() ||
        functions.length >= maxFunctions
      )
        continue;
      try {
        const builder = new FunctionCompiler(trigger),
          ast = parseExpression(source),
          node = builder.node(ast);
        if ((codeBytes += node.code.length) > maxBytes) break;
        // Only direct variable reads with a static integer index qualify.
        // For every other numeric expression use the existing Wasm compiler.
        // Parse the AST once rather than trusting an approximate regex.
        const variableNames = ['var','fvar','sysvar','sysfvar'];
        const variable = ast.kind==='call' &&
          variableNames.includes(ast.name) &&
          ast.args?.length===1 && ast.args[0].kind==='number' &&
          !ast.args[0].float && Number.isSafeInteger(ast.args[0].value)
          ? {name:ast.name,args:[ast.args[0].value]} : null;
        const scalar = ast.kind==='name' &&
          ast.name!=='pi' && ast.name!=='e'
          ? {name:ast.name,args:[]} : null;
        pending.push({ source, type: node.type,
          direct: variable||scalar });
        functions.push({ ...node, locals: builder.locals });
      } catch (error) {
        if (
          !(error instanceof NotNumeric) &&
          !(error instanceof ExpressionError)
        )
          throw error;
      }
    }
    if (!functions.length) return;
    const read = (id, count, a, b, floating) => {
      if (typeof this.context.resolve !== "function")
        throw new UnsupportedExpressionError(
          "Trigger resolution is unavailable.",
        );
      const descriptor = this.triggers[id],
        value = this.context.resolve(
          descriptor.name,
          descriptor.args || (count === 0 ? [] : count === 1 ? [a] : [a, b]),
          null,
        );
      let n = value;
      if (descriptor.match !== undefined) {
        if (value?.absent) n = +descriptor.invert;
        else if (typeof value === "string")
          n = +((value === descriptor.match) !== !!descriptor.invert);
        else throw new TypeChanged();
      }
      if (typeof value === "boolean") n = +value;
      else if (value && typeof value.value === "number") {
        if (!floating && (value.type === "float" || value.float))
          throw new TypeChanged();
        n = value.value;
      }
      if (typeof n !== "number") throw new TypeChanged();
      if (!Number.isFinite(n))
        throw new BottomError("Expression produced a non-finite number.");
      if (!floating && !Number.isInteger(n)) throw new TypeChanged();
      if (floating) {
        n = Math.fround(n);
        if (!Number.isFinite(n))
          throw new BottomError("Expression produced a non-finite number.");
        return n;
      }
      return n | 0;
    };
    const host = {
      // Wasm imports call these millions of times in complex CNS AI.
      // Fixed arity avoids a rest-parameter array and spread for every read.
      readInt: (id,count,a,b) => read(id,count,a,b,false),
      readFloat: (id,count,a,b) => read(id,count,a,b,true),
      finite: (value) => {
        if (!Number.isFinite(value))
          throw new BottomError("Expression produced a non-finite number.");
        return value;
      },
      wrap: (value) => value | 0,
    };
    for (const name of mathNames)
      host[name] = Math[name === "ln" ? "log" : name];
    host.log = (base, value) => Math.log(value) / Math.log(base);
    this.binary = moduleBytes(functions);
    const instance = new WebAssembly.Instance(
      new WebAssembly.Module(this.binary),
      { host },
    );
    pending.forEach((p, i) =>
      this.entries.set(p.source, { ...p, run: instance.exports["e" + i] }),
    );
    this.counts.compiled = this.entries.size;
    this.counts.bytes = this.binary.length;
  }
  evaluate(source, context = {}) {
    const entry = this.entries.get(source);
    if (!entry) {
      this.counts.interpreted++;
      let executor=this.fallbackExecutors.get(source);
      if(!executor) {
        executor=compileExpression(source);
        if(this.fallbackExecutors.size>=4096)
          this.fallbackExecutors.delete(this.fallbackExecutors.keys().next().value);
        this.fallbackExecutors.set(source,executor);
      }else this.fallbackCacheHits++;
      return executor(context);
    }
    const previous = this.context;
    this.context = context;
    try {
      let value;
      if(entry.direct && typeof context.resolve==='function'){
        // Typed MUGEN single-value reads, including static var/fvar and
        // numeric scalar triggers, are overwhelmingly frequent in helpers/AI.
        // Their numeric result already has the declared integer/f32 type;
        // avoid Wasm trampoline+host import overhead. Unusual results
        // delegate to the unchanged Wasm/deoptimization path.
        const raw=context.resolve(entry.direct.name,entry.direct.args,null);
        if(typeof raw==='number' && Number.isFinite(raw) &&
          (entry.type===F || Number.isInteger(raw))){
          value=entry.type===F?Math.fround(raw):raw|0;
          if(!Number.isFinite(value))
            throw new BottomError('Expression produced a non-finite number.');
          this.counts.direct++;
        } else {
          value=entry.run();
          this.counts.wasm++;
        }
      } else {
        value=entry.run();
        this.counts.wasm++;
      }
      return context.typedResult ? { value, float: entry.type === F } : value;
    } catch (error) {
      if (error instanceof TypeChanged) {
        this.entries.delete(source);
        this.counts.deoptimized++;
        return (
          context.typedResult ? evaluateTypedExpression : evaluateExpression
        )(source, context);
      }
      if (error instanceof WebAssembly.RuntimeError)
        throw new BottomError("Invalid numeric operation.", source);
      if (error instanceof ExpressionError) {
        if (!error.source) error.source = source;
        throw error;
      }
      if (error?.bottom) throw new BottomError(error.message, source);
      throw new ExpressionError(
        error?.message || "Trigger evaluation failed.",
        source,
      );
    } finally {
      this.context = previous;
    }
  }
  get stats() {
    return {...this.counts,activeFunctions:this.entries.size,
      fallbackExecutors:this.fallbackExecutors.size,
      fallbackCacheHits:this.fallbackCacheHits};
  }
}
