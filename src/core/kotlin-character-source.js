/**
 * Adapt a character safely unpacked by Kenjatime's ZIP/RAR importers
 * to the opt-in Kotlin/Wasm text ABI. Never run untrusted ZSS as CNS.
 * Does not mutate files, decode sprites, load common1.cns, or install a match.
 */
// Standalone text decoding mirrors formats.decodeText without loading the ZIP
// decoder into the lightweight opt-in combat bridge.
function decodeText(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xfe)
    return new TextDecoder("utf-16le").decode(bytes);
  if (bytes[0] === 0xfe && bytes[1] === 0xff)
    return new TextDecoder("utf-16be").decode(bytes);
  try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
  catch { return new TextDecoder("windows-1252").decode(bytes); }
}

const STATE_KEY = /^(cns|st\d*)$/i;
const ZSS_DECLARATION = /^\s*\[\s*(?:statedef\s+-?\d+\s*;|function\s+\w+\s*\()/im;
const MAX_SCRIPT_BYTES = 16 * 1024 * 1024;
// This vocabulary mirrors the implemented Kotlin subset, not full controller
// semantics; parameters, timing, targeting and effects may remain incomplete.
const CORE_CONTROLLER_TYPES = new Set([
  "null","velset","veladd","posadd","posset","ctrlset","changestate",
  "selfstate","changeanim","statetypeset","lifeadd","poweradd","varset",
  "varadd","helper","projectile","hitdef","velmul","gravity","turn",
  "lifeset","hitadd","assertspecial","destroyself","varrandom",
  "varrangeset","parentvarset","varmul","parentvaradd","playsnd","stopsnd"
]);
function auditLegacyStates(sources) {
  const states = new Map(), controllers = new Set();
  for (const text of sources) {
    let inController = false;
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.split(";")[0].trim();
      const state = /^\[\s*statedef\s+(-?\d+)\s*\]$/i.exec(line);
      if (state) {
        const id = Number(state[1]);
        states.set(id,(states.get(id) ?? 0)+1);
        inController = false;
        continue;
      }
      const header = /^\[\s*([^\]]+)\s*\]$/.exec(line);
      if (header) {
        inController = /^state\s+-?\d+\s*,/i.test(header[1]);
        continue;
      }
      if (inController) {
        const type = /^type\s*=\s*([a-z0-9_]+)/i.exec(line);
        if (type) controllers.add(type[1].toLowerCase());
      }
    }
  }
  return {
    stateCount: states.size,
    duplicates: [...states].filter(([,count]) => count > 1).map(([id,count])=>({id,count})),
    unsupported: [...controllers].filter(type=>!CORE_CONTROLLER_TYPES.has(type)).sort(),
    supported: [...controllers].filter(type=>CORE_CONTROLLER_TYPES.has(type)).sort(),
  };
}

export function kotlinFighterFromImportedCharacter(character) {
  if (!character?.def?.files || !character?.files || !Array.isArray(character.checks))
    throw new TypeError("A parsed Kenjatime character package is required");
  const index = character.files;
  const byKey = key => character.checks.find(check => check.key.toLowerCase() === key);
  const failures = [];
  const warnings = [];
  function text(check) {
    if (!check?.path || !check.ok || !Object.hasOwn(index, check.path)) {
      failures.push("Missing authored " + (check?.key ?? "script") + ": " + (check?.value ?? "unknown"));
      return "";
    }
    const bytes = index[check.path];
    if (!(bytes instanceof Uint8Array) || bytes.length > MAX_SCRIPT_BYTES) {
      failures.push("Invalid or oversized " + check.key + " script");
      return "";
    }
    return decodeText(bytes);
  }
  const keySet = new Set();
  const references = character.checks.filter(check => STATE_KEY.test(check.key));
  const stateFiles = [];
  for (const ref of references) {
    const path = ref.path?.toLowerCase();
    if (path && keySet.has(path)) {
      warnings.push("Repeated state reference ignored: " + ref.value);
      continue;
    }
    if (path) keySet.add(path);
    if (path?.endsWith(".zss")) {
      failures.push("Structured ZSS script requires the existing JS interpreter: " + ref.value);
      continue;
    }
    const source = text(ref);
    if (source && ZSS_DECLARATION.test(source)) {
      failures.push("Structured ZSS declaration cannot be interpreted by Kotlin: " + ref.value);
      continue;
    }
    if (source) stateFiles.push(source);
  }
  const common = byKey("stcommon");
  if (common && !common.ok) {
    if (String(common.value).replaceAll("\\", "/").toLowerCase().endsWith("common1.cns"))
      warnings.push("common1.cns is supplied by the MUGEN runtime, not by this archive; Kotlin common-state parity is incomplete");
    else failures.push("Missing required shared state file: " + common.value);
  }
  const cmdReference = byKey("cmd");
  if (cmdReference?.path?.endsWith(".zss"))
    failures.push("ZSS CMD state program requires the JS interpreter");
  const cmd = text(cmdReference);
  const air = text(byKey("anim"));
  if (!byKey("cns")) failures.push("Missing [Files] cns reference");
  if (stateFiles.length === 0) failures.push("No supported authored CNS/ST sources");
  if (stateFiles.join("\n").length > MAX_SCRIPT_BYTES)
    failures.push("Combined CNS/ST scripts exceed the Kotlin parser's 16 MiB limit");
  const audit = auditLegacyStates([...stateFiles,cmd]);
  if (audit.duplicates.length)
    warnings.push("Repeated StateDef IDs need authored load-order validation: " +
      audit.duplicates.map(item=>item.id+" ("+item.count+")").join(", "));
  if (audit.unsupported.length)
    warnings.push("Kotlin/Wasm currently lacks " + audit.unsupported.length +
      " authored controller types; unsupported branches will be reported at runtime");
  // Fail before constructing any Wasm handle: no silent idle fighter fallback.
  if (failures.length)
    throw new Error("Kotlin/Wasm character preflight failed: " + [...new Set(failures)].join("; "));
  return {
    name: String(character.def.info?.displayname || character.def.info?.name || character.path || "Unknown"),
    air,
    cns: stateFiles.join("\n"),
    cmd,
    warnings,
    sourceFiles: references.filter(c => c.path).map(c => c.path),
    supportedControllerTypes: audit.supported,
    unsupportedControllerTypes: audit.unsupported,
    duplicateStateDefs: audit.duplicates,
    stateDeclarationCount: audit.stateCount,
    productionReady: false,
    requiresNativeParity: true,
  };
}
