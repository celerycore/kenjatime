# Kenjatime Kotlin/Wasm combat migration: Phase II

This report is tied to draft PR #12. It describes **ported foundations**, not a
playable replacement for the JavaScript Core 0.5.8. Production remains unchanged.

## Ported from the current independent JS combat rules

- Per-fighter mutable state with shared read-only parsed data and deterministic
  60 Hz fixed-point movement (1/256 pixel units).
- Ordered StateDef and State controllers, simple trigger groups, `var`/`fvar`
  comparisons, `power`, `p2dist`, command triggers and key state controllers.
- Physically held back input for standing/crouching/air guard eligibility.
  Guard damage, contact events, hitpause and the first recovery fallback.
- Frozen geometry before contact resolution; two attacks can trade, or a
  higher-priority strike can win. Target contact is retained per attack state.
- Helper requests: bounded by default to 56 live helpers, immutable shared
  definitions, independent variable and input buffers, simple bind duration.
- Projectile requests: bounded to 256, linear velocity, authored AIR attack
  boxes, one-target contact and timeout cleanup.
- AIR `LoopStart`, non-looping final-frame retention, PCX/SFF v1 decoding,
  palette, SND v1 archive and visual-only camera primitives.
- Browser bridge remains **opt-in**. No production worker/runtime switch.

These are minimal or subset implementations. Their presence does not imply
parity with all controller parameters or MUGEN edge cases.

## Character validation matrix

| Target | Evidence currently runnable | What is still missing |
| --- | --- | --- |
| KFM | JVM uses the real repo `public/kfm.zip`; commands, AIR, CNS/ST and DEF are parsed and a deterministic 360-tick replay is repeated | Kotlin must be compared **tick for tick** with 147 native KFM scenarios, including actual attack/guard/recovery outputs |
| Dark Donald | Synthetic command-buffer, guard, hitpause, state transition and new entity contracts; opt-in test accepts extracted original directory | The uploaded original RAR isn't tracked in the repo. No original Kotlin match or real intro/camera/combo parity has been run |
| Rare Akuma | The repo retains an inventory of 60 original controller types, 137 states, 45 helper-spawn controllers and three projectile controllers (2007 source). Kotlin coverage audit computes the subset and reports missing controllers; synthetic helper/projectile contracts run | Original full ZIP/RAR isn't tracked in the repo. Most controller types, full 2007/2026 ZSS support, helpers, native AI and visual effect parity are not certified |

The existing JavaScript engine has a separate native-capture comparison job.
The strict JavaScript reference baseline was measured again in CI run
`42888689492`: **1/147 KFM native scenarios matched**, and the 16-interaction
comparison returned a nonzero exit status with guard-position differences.
These existing JavaScript differences do **not** prove Kotlin is better or
worse. Both native-capture comparisons are intentionally marked as
nonblocking *diagnostics* in the draft workflow, and their failures remain in
the job logs. The JS Rare Akuma inventory/synthetic tests passed, but no
original Rare Akuma archive was run by Kotlin.

Kotlin native capture parity is still **not measured**. No native baseline
has been silently replaced or regenerated to make a test pass.

## Reproduce tests

```sh
./android/gradlew -p kotlin-core jvmTest
./android/gradlew -p kotlin-core wasmJsNodeTest
./android/gradlew -p kotlin-core wasmJsBrowserProductionWebpack
node --test test/core/kotlin-wasm-backend.test.js test/core/kotlin-parity-status.test.js
node --experimental-wasm-modules scripts/core/verify-kotlin-wasm-module.mjs
```

The last command uses the raw generated Kotlin ESM module; it does not
benchmark the rendering or sound pipeline.

For source-only smoke runs on locally extracted original character packages:

```sh
KENJATIME_DARK_DONALD_DIR=/path/to/unpacked-dark-donald \
KENJATIME_RARE_AKUMA_DIR=/path/to/unpacked-rare-akuma \
  ./android/gradlew -p kotlin-core jvmTest
```

A source-only parse smoke is **not** a full original-character fight. Original
character assets remain external to this repository.

## Strict gates before turning on Kotlin matches

1. Original KFM, Dark Donald and Rare Akuma archive imports, no missing required
   states/assets, and explicit unsupported-controller diagnostics.
2. Authoritative per-frame comparison of input, state, animation clocks,
   helper/projectile IDs, life, power, guard, hitpause, camera target and
   collision/contact events against native captures and the existing JS engine.
3. Stateful character support: ZSS/expressions, hit overrides, actual hit
   fall/recovery/KO, throw/target bindings, helper hierarchies, repeating
   projectiles and pause/superpause semantics.
4. Intro / ROUND 1 / FIGHT / KO / OUTRO state sequencing, camera jump panning,
   mobile controls and renderer/audio integration with the same offscreen
   fallback as the existing JavaScript worker.
5. Physical Android FPS, memory consumption, load/cancel cycles and cold-start
   timing at least as good as the retained JavaScript baseline.

No silent fallback or automatic production enablement is permitted before these
checks pass. This branch is deliberately review-only.
