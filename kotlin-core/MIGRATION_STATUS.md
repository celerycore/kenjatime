# Kenjatime Kotlin/Wasm combat migration — Phase III (review-only)

PR: https://github.com/celerycore/kenjatime/pull/12

**Production engine is unchanged.** This is an experimental deterministic
combat runtime, not a completed MUGEN / Ikemen GO clone. The browser app must
continue using its JavaScript CoreSession until the release gates below pass.

## Implemented and exercised

- Kotlin Multiplatform Gradle project: JVM conformance tests, real Node-hosted
  Kotlin/Wasm tests, browser Wasm compilation and actual ESM/Wasm ABI calls.
- Independent fighter state, 60 Hz simulation, 1/256-pixel position math,
  deterministic seeded random variables, bounded resource counts.
- MUGEN .DEF, .AIR (including LoopStart), .CMD and partial .CNS/.ST import.
  Critically, CMD [StateDef -1] move-selection controllers now load alongside
  CNS/ST state programs, not just the physical motion-command definitions.
- Authored fighter [Data], [Size] and [Movement] constants (life, body widths,
  sprite scales, basic gravity). Multiple fighter definitions stay isolated.
- Cached and bounded CNS expressions (variable references, math, Boolean
  operators, commands, state comparisons and inclusive [a,b] ranges).
  Unknown expressions produce diagnostics and evaluate false.
- CMD default timings, directional input edges, same-frame F+a, released
  charge requirements, buffer windows and double-tap recognition (partial CMD).
- Simple StateDef controllers, per-state persistent scheduling and
  ignorehitpause. Guard/block, contact priorities, trades, hitpause,
  authored hit definitions, life/power, some utility controllers and events.
- Alternate var()/fvar()/sysvar()/sysfvar() assignments, simple parent
  variables and integer/float variable isolation.
- Bounded helper/projectile foundations and clean destruction. Helpers share
  immutable definitions but not mutable actor data.
- Optional stage bounds, player push, gravity, landing, and visual-only
  camera tracking; optional first-round INTRO/ROUND/FIGHT/KO/OUTRO state machine.
- Presentation event queue for PlaySnd/StopSnd. **Actual audio playback is
  still a browser adapter responsibility.**
- Opt-in JS adapter: setup, stage, round flow, snapshots, contact/events,
  resource counts, checksum debug, and fast advance without string allocation
  on every simulation tick. No switch to the live Three.js renderer/worker.

## Real KFM evidence — not native parity

The CI repository contains the original bundled `public/kfm.zip`.
Its DEF/CMD/CNS/ST/AIR sources are parsed, including CMD -1 controllers.
A 600-tick two-fighter simulation on compiled Kotlin/Wasm directly exercises
KFM's authored inputs and a forced state 200 move. This runs the character's
scripts; it does **not** reproduce the original native 147-scenario suite.

A successful historical run, [42913647525](https://github.com/celerycore/kenjatime/actions/runs/42913647525), recorded:

- 600 ticks; 152 non-idle player frames, three contact events.
- Zero unsupported-runtime diagnostics on that tested input path.
- Two separately constructed Wasm fights replayed to an identical checksum.
- 0.4733 ms/simulation tick in a hosted GitHub runner **for that particular
  input trace**, not a mobile FPS benchmark, and not render/audio cost.

Later commits add a per-tick command-activation cache and a zero-string-allocation
advance API. Use a fresh CI artifact/benchmark to evaluate their final
performance. No universal native timing or command reachability is claimed.

## Character compatibility gates

| Character | Verified on this migration | Not yet proven |
| --- | --- | --- |
| KFM | Real repo ZIP parses and executes authored states inside compiled Kotlin/Wasm; deterministic replay | All 147 native gameplay scenarios, every animation/hitbox and recovery, full common-state exactness |
| Dark Donald | Isolated command, priority, hitpause, camera and round-sequence tests; optionally parse extracted original scripts | Original uploaded RAR is not in this Git checkout; real intro/air combo/AI/camera full battle not run under Kotlin |
| Rare Akuma | 60-type authored controller inventory compared with Kotlin implemented subset; synthetic helper/projectile and variable contracts | Original archives absent from this checkout; 2007/2026 ZSS/complex helpers/projectiles/full effects and AI cannot be certified |

**Important reference discrepancy:** Existing JavaScript Core's strict native
comparison currently matches **1 of 147** KFM captured scenarios, and the
16-interaction suite reports guard/position differences. CI runs these audits
as visible *nonblocking diagnostics*. Passing a JavaScript test or running
an authored Kotlin move does not certify Kotlin/native MUGEN parity.

## Remaining release-blocking work

1. Full CNS/ST/ZSS expression and controller semantics (hit overrides,
   juggling, throws, target state/binds, actual KFM hit and KO common states,
   recovery, full pause/superpause and entity lifetime rules).
2. Exact command motion semantics (all modifiers, persistent buffers, remaps
   and physical facing-crossing edge cases), gameplay-side AI.
3. SFF v2 sprite decode, full AIR extension semantics, original effect
   packs, renderer/audio adapter and browser match worker integration.
4. Native-capture *tick-for-tick* comparisons on KFM 147 cases, Dark Donald,
   both Rare Akuma versions, intros/KO/outros, helpers and projectiles.
5. Physical Android GPU/CPU/memory and input-latency measurements at or
   better than the current deployed JavaScript engine.

## Reproduce the independent tests

```sh
./android/gradlew -p kotlin-core jvmTest
./android/gradlew -p kotlin-core wasmJsNodeTest
./android/gradlew -p kotlin-core wasmJsBrowserProductionWebpack
node --test test/core/kotlin-wasm-backend.test.js test/core/kotlin-parity-status.test.js
node --experimental-wasm-modules scripts/core/verify-kotlin-wasm-module.mjs
node --experimental-wasm-modules scripts/core/benchmark-kotlin-wasm.mjs
```

For local extracted original source-only checks:

```sh
KENJATIME_DARK_DONALD_DIR=/path/to/extracted/dark-donald \
KENJATIME_RARE_AKUMA_DIR=/path/to/extracted/rare-akuma \
  ./android/gradlew -p kotlin-core jvmTest
```

These source-only checks are **not** full character execution parity. Do not
merge to production or enable a default Kotlin battle until the strict gates
are actually passed. Every unsupported controller and resource gap must
remain visible.
