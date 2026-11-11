# Phase 3 — Kotlin/Wasm combat integration and three-package replay harness

Branch: `feature/kotlin-wasm-blueprint-20261111`  
Draft PR: https://github.com/celerycore/kenjatime/pull/14

## Implemented (opt-in, NOT released)
1. `kotlin-engine/src/commonMain/kotlin/kenjatime/core/CombatKernel.kt`: portable struct-of-arrays projectile candidate generator. Stable (creation-order) pairs; strict and inclusive edge behavior; team, freeze, removing and finite-bounds checks; bounded capacity. It does **not** implement hit priority, AIR Clsn narrowphase, or audiovisual effects.
2. `GlobalCombatSchedule`: a six-phase bitmask for `-4,-3,-2,-1,current,+1`. The extra IKEMEN `+1` phase is distinct from normal numeric StateDef 1.
3. `kotlin-engine/src/wasmJsMain/kotlin/kenjatime/core/KenjatimeCombatKernel.kt`: exported Kotlin/Wasm functions, retaining primitive state behind integer handles. Explicit destruction prevents leaks on session close.
4. `src/core/kotlin-wasm-combat.js`, `src/combat.js`, `src/runtime.js`, `src/core/session.js`: optional JS host adapter. With `kotlinCombatBackend`, match startup delegates projectile *candidate enumeration* and ZSS *phase selection* to Kotlin/Wasm. JavaScript remains the authoritative interpreter, exact collision resolver, camera, AI, inputs, projectiles, hit pause and frame renderer. A failure reverts the match to native JS.
5. Tests in `kotlin-engine/src/commonTest/.../CombatKernelTest.kt` and `test/core/kotlin-wasm-combat-bridge.test.js` check kernel candidates, phase masks, strict/inclusive contacts, 65-frame parity in three layouts, and failures. `scripts/core/verify-kotlin-wasm-native.mjs` checks actual compiled-module exports.
6. `scripts/core/verify-character-trio.mjs` is a **real-package-only headless replay runner** with CPU AI vs bundled KFM, optional render packets, per-frame SHA-256 state hashes, nonfinite detection, peak actors/projectiles, repeated runs, optional exhaustive forced-state smoke probes, optional real Wasm-vs-JS parity comparisons, structured JSON output. For a RAR, provide its safely extracted directory.

## Actual uploaded character archives (local preflight)

The user's three original archives were verified in the current working container and **not committed to this repository**:

| Original archive | Character | Verified local DEF references | Required external common states |
|---|---|---:|---|
| RareAkuma(1).zip | Rare Akuma 2026 ZSS | 100% found | `common1.cns` |
| Rare Akuma(1).zip | Rare Akuma 2007 ST | 100% found | `common1.cns` |
| Dark Donald(2).rar | Dark Donald 2011 CNS | 100% found; `OPTION.txt` counted as state code | `common1.cns` |

**This is a source/archive integrity check, NOT a CoreSession simulation pass.** Do not report character gameplay parity or Android FPS before the runner above has processed these actual assets.

## Running the real three-package marathon

```sh
# Extract Dark Donald's RAR as a directory; preserve relative paths.
mkdir -p /tmp/dark-donald-character
bsdtar -xf '/private/Dark Donald(2).rar' -C /tmp/dark-donald-character

npm ci
node scripts/core/verify-character-trio.mjs \
  '/private/RareAkuma(1).zip' \
  '/private/Rare Akuma(1).zip' \
  /tmp/dark-donald-character \
  --ticks=240 --runs=2 --states --render --strict \
  --output=work/core/character-trio-runtime.json

# Run only if the Kotlin/Wasm module has been built and its actual
# JavaScript exports validated. Passing --wasm makes fallback a failed test.
node scripts/core/verify-character-trio.mjs \
  '/private/RareAkuma(1).zip' '/private/Rare Akuma(1).zip' \
  /tmp/dark-donald-character \
  --ticks=240 --runs=2 --states --render --strict \
  --wasm=/absolute/path/to/generated-kotlin-wasm-module.mjs
```

The runner never uploads the three original character archives. It records failures instead of silently substituting KFM. `--states` forces individual states briefly and cannot prove *natural* command reachability or complete fight parity. A GPU/browser/Android run is still mandatory for performance release claims.

## CI distinctions

- Kotlin common JVM and Kotlin/Wasm Node tests check kernel semantics (separate from browser runtime).
- The optional-host JS tests use a clearly named reference shim to test integration behavior; they are not evidence that a WebAssembly binary was loaded.
- The `scripts/core/verify-kotlin-wasm-native.mjs` CI step is specifically designed to import and exercise the **actual** generated .mjs/.wasm artifacts.
- `test/core/character-trio-cli.test.js` creates **synthetic KFM-derived fixtures** to test the marathon command; it does not certify the uploaded characters.
- Existing baseline-vs-feature 16 interaction and 147 KFM trace comparisons verify no introduced divergences. Both branches still have known mismatches to native MUGEN fixtures.

## Outstanding engineering steps

- Execute real-package CPU match replay + forced-state exploration on the three supplied archives with both backends. The local uploaded archives cannot be automatically read by the separate GitHub Actions runner without a user-controlled transfer; original assets remain off-repo.
- Run browser/WebGL2 and mobile/Android full effects+sound+camera tests. Check Dark Donald intro delay, projectile storms and camera tracking, Rare Akuma 2026 -4/+1 helper behavior, and Rare Akuma 2007 command/combo behavior.
- Migrate the remaining full state machine, HitDef/Clsn resolution, command parser and AI into Kotlin only after differential native/JS parity. **This phase migrates the optimized candidate and phase-selection kernels, not the entire combat simulation.**
