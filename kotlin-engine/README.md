# Kenjatime Kotlin/WASM deterministic core — migration foundation

This is a **new, opt-in standalone Kotlin Multiplatform module**. It does not replace the browser combat engine, alter the original KFM captures, or promise MUGEN compatibility. The source of truth is the supplied seven-page *Kotlin/WASM Fighting Game Engine Blueprint*.

## Implemented in this branch

- Common Kotlin 16.16 `Fixed16` integer arithmetic with widened multiplication/division.
- Flat five-integer collision box buffer and stable insertion-sort X-axis sweep broadphase with inclusive Y/X intersections.
- Fixed-size 60-frame input bitmask history and ordered motion scanner.
- Preallocated integer snapshot ring with stale/overwritten frame detection.
- Fixed-point simulation tick accumulator for cinematic time scaling.
- Allocation-free rolling telemetry storage (the time source is injected externally).
- Reference-counted asset registry with final-release disposal.
- Portable `commonTest` coverage for the above.

## Run tests

From `kotlin-engine/`, with a compatible JDK/Gradle installation:

```sh
gradle jvmTest
gradle wasmJsNodeTest
```

No Gradle wrapper was added; do not treat the above commands as proof they passed. Node/Wasm compilation and browser integration need CI verification before this module is merged.

## Safety and numerical compatibility

The current Core uses native MUGEN-like float32 state/trigger semantics. It must **not** be switched to 16.16 by a global search/replace: doing so would change timing, movement, command evaluation and damage for imported characters. Use a feature-gated adapter, compare independent output traces frame-by-frame for KFM, Dark Donald and Rare Akuma, then migrate only validated paths.

The ring stores flat registers supplied by its caller. The caller must serialize all mutable fighter/helper/projectile variables, PRNG state, input buffers, hit pause, physics, commands and target IDs before rollback can be considered correct. Do not capture mutable object references. Replay must suppress external audio/UI/network effects until confirmed.

The input matcher demonstrates ordered bitmask scanning, not full MUGEN CMD syntax (release edges, charge, simultaneous keys, priority and negative-edge semantics remain separate work).

The broadphase only culls candidate entity pairs; exact Clsn1/Clsn2 overlap checks, hit rules and MUGEN coordinate transforms still belong to combat resolution.

## Blueprint progress matrix

| PDF section | State | Next integration |
|---|---|---|
| 1. Stress tests | Pending | Rare Akuma multi-helper workload; Hazama/Slayer AST fixtures; hostile redirect sandbox |
| 2. WebGL2/WebGPU | Existing indexed Three.js rendering; new wrapper pending | Validate R8 palette index, shader UV formula and browser GPU fallback |
| 3. Streaming assets | Existing archive import; Kotlin registry foundation | JS worker chunk-transfer and shared immutable AST ownership |
| 4. Collision | Primitive boxes and sweep foundation | Wire into active collision resolution with parity traces |
| 5. Fixed-point determinism | Arithmetic foundation | Differential tests against native float32 CNS triggers |
| 6. Rollback | State ring foundation | Full-state serializer, prediction, resimulation, hash and visual blend |
| 7. Inputs | History and motion-scanner foundation | Native CMD syntax, exact releases, priority and macro export |
| 8. Presentation | Tick pacing foundation | FBO background-only dimmer, shadow shear, shader parallax |
| 9. Telemetry | Rolling metric foundation | Phase timings from host and visible DevTools panel |
| 10. CI/Android | Pending | Headless Kotlin tests, Core capture regression gate, WebViewAssetLoader audit |

## Required compatibility gates

1. `npm run verify:core:interactions`
2. `npm run verify:core:movesets`
3. `npm run benchmark:core:combat`
4. KFM/Dark Donald/Rare Akuma deterministic frame hashes (new)
5. Android physical-device performance and startup tests (new)
6. Rollback replay/late-input divergence tests (new)

The old Core remains the fallback until the new pipelines satisfy those gates.
