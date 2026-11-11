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
    requiresNativeParity: true,
  };
}
