/**
 * Kenjatime's clean-room legacy compatibility contract.
 *
 * The compatibility TARGET is Elecbyte M.U.G.E.N 1.1 Beta 1 P1 behavior.
 * This metadata is NOT a statement that the runtime is conformant yet.
 *
 * IKEMEN GO-specific ZSS/Lua/extended triggers remain additional features;
 * they must never silently redefine an established MUGEN 1.1 rule.
 */
export const LEGACY_COMPATIBILITY_TARGET = Object.freeze({
  id: "mugen-1.1",
  reference: "Elecbyte M.U.G.E.N 1.1 Beta 1 P1 (2013)",
  status: "target-unverified",
  certified: false,
  referenceStrategy: "black-box golden traces from lawful local reference runs",
  extendedDialect: "ikemen-go",
});

/** A DEF version is a declaration by the author, not a successful test. */
export function declaredMugenVersion(character) {
  const value = character?.def?.info?.mugenversion;
  if (value === undefined || value === null) return null;
  const version = String(value).trim();
  return version || null;
}

/** Lightweight, read-only report compiled once per match, not each frame. */
export function legacyCompatibilityReport(characters, programs = new Map()) {
  if (!Array.isArray(characters)) throw Error("Compatibility report requires a character list.");
  return {
    ...LEGACY_COMPATIBILITY_TARGET,
    // An unverified target never becomes 'certified' merely because an
    // imported script parsed without warnings.
    characters: characters.map((character) => {
      const program = programs.get(character);
      const diagnostics = program?.diagnostics || [];
      const sourcePaths = program?.sources || [];
      return {
        path: character?.path || null,
        declaredMugenVersion: declaredMugenVersion(character),
        cnsStateFiles: sourcePaths.filter(path => /\.(?:cns|cmd)$/i.test(path)).length,
        ikemenZssFiles: sourcePaths.filter(path => /\.zss$/i.test(path)).length,
        fatalDiagnostics: diagnostics.filter(d => d.fatal === true).length,
        duplicateGlobalStates: diagnostics.filter(d => d.type === "mugen11-duplicate-global").length,
        unsupportedDiagnostics: diagnostics.filter(d =>
          /^unsupported/.test(d.type || "") || d.type === "missing-file"
        ).length,
        // Parsing and available sources do not prove native behavior parity.
        traceVerified: false,
      };
    }),
  };
}

/** Optional structural state capture for independent MUGEN 1.1 oracle comparison.
 * Never call this in the production per-tick hot path.
 */
export function captureLegacyTraceTick(match) {
  if (!match || !Number.isSafeInteger(match.ticks))
    throw Error("A live Core match with an integer tick count is required.");
  const actors = (match.entities || []).filter(a => !a.destroyed)
    .slice().sort((a, b) => a.id - b.id)
    .map(a => ({
      id: a.id,
      rootId: a.root?.id ?? a.id,
      parentId: a.parent?.id ?? null,
      helperId: a.parent ? a.helperId : null,
      stateNo: a.stateNo,
      stateTime: a.time,
      prevStateNo: a.prevStateNo,
      // State ownership diverges when TargetState or a custom hit places
      // P2 in an attacker's CNS; SelfState must restore P2's own owner.
      stateOwnerId: a.stateOwner?.id ?? a.id,
      anim: a.anim,
      animationOwnerId: a.animationOwner?.id ?? a.id,
      frameIndex: a.frameIndex,
      frameTime: a.frameTime,
      facing: a.facing,
      x: a.pos.x,
      y: a.pos.y,
      vx: a.vel.x,
      vy: a.vel.y,
      life: a.life,
      power: a.power,
      moveType: a.moveType,
      stateType: a.stateType,
      hitPauseTime: a.hitPauseTime,
      ctrl: a.ctrl,
      keyCtrl: !!a.keyCtrl,
      boundTargetId: a.bound?.target?.id ?? null,
      bindTime: a.bound?.time ?? null,
      invisible: !!a.asserted?.has("invisible"),
    }));
  const projectiles = (match.projectiles || []).filter(p => !p.removed)
    .slice().sort((a, b) => a.id - b.id)
    .map(p => ({
      id: p.id,
      ownerId: p.owner?.id ?? null,
      anim: p.anim,
      x: p.pos.x,
      y: p.pos.y,
      vx: p.vel.x,
      vy: p.vel.y,
      time: p.time,
    }));
  return {
    tick: match.ticks,
    roundNo: match.roundFlow?.roundNo ?? 1,
    roundState: match.roundFlow?.roundState ?? 2,
    roundTimeLeft: match.roundFlow?.timeLeft ?? -1,
    actors, projectiles,
  };
}

/** Exact (no tolerance) comparison. Native parity remains unverified until
 * reference captures from the actual target version are supplied.
 */
export function compareLegacyTraces(reference, candidate) {
  if (!Array.isArray(reference?.ticks) || !Array.isArray(candidate?.ticks) ||
      reference.ticks.length === 0 || candidate.ticks.length === 0)
    throw Error("Both traces must contain nonempty ticks arrays.");
  const mismatch = (path, expected, actual) =>
    ({equal:false, path, expected, actual});
  const visit = (expected, actual, path) => {
    if (Object.is(expected, actual)) return null;
    if (expected === null || actual === null ||
        typeof expected !== typeof actual ||
        typeof expected !== "object")
      return mismatch(path, expected, actual);
    const ae = Array.isArray(expected), aa = Array.isArray(actual);
    if (ae !== aa) return mismatch(path, expected, actual);
    if (ae && expected.length !== actual.length)
      return mismatch(path + ".length", expected.length, actual.length);
    const keys = ae ? expected.map((_,i)=>String(i)) :
      [...new Set([...Object.keys(expected), ...Object.keys(actual)])].sort();
    for (const key of keys) {
      if (!Object.hasOwn(expected,key) || !Object.hasOwn(actual,key))
        return mismatch(path+"."+key, expected[key], actual[key]);
      const error=visit(expected[key],actual[key],ae?path+"["+key+"]":path+"."+key);
      if (error) return error;
    }
    return null;
  };
  return visit(reference.ticks,candidate.ticks,"ticks") ||
    {equal:true, comparedTicks:reference.ticks.length};
}
