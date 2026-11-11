# Kotlin/Wasm Blueprint — Kenjatime implementation ledger

Source: user-supplied `kotlin_wasm_mugen_engine_blueprint.pdf` (7 pages, 10 sections).
Base: `rewrite/kotlin-wasm-core-20261111`; branch:
`feature/blueprint-deterministic-primitives-20261111`.

This is a **review branch**, not a production backend replacement. The existing
JavaScript fight worker, Three.js stage renderer, RAR/ZIP asset logic, and
Capacitor Android activity stay authoritative until parity and performance gates
are met. A feature being implemented is **not** proof of MUGEN compatibility.

| Section | This branch | Validation still needed |
| --- | --- | --- |
| 1 Benchmarking | Existing KFM Kotlin/Wasm smoke and Rare Akuma inventory; new primitives tests | Actual original Rare Akuma / Hazama / Slayer / Donald archives, complete replay traces, mobile entity stress |
| 2 R8 rendering | Existing Three.js R8 palette shader; new independent low-level WebGL2 palette renderer and indexed shader, bounded GPU textures | Pixel-for-pixel KFM/Dark Donald/Rare Akuma images and mobile GPU profiling |
| 3 Asset ingestion | Connected browser File/Blob stream import through archive Worker with existing 128MiB UI cap and 256MiB worker safety cap; Kotlin immutable definition/command refcounts, release on fight close | True incremental decompression, physical memory budgets, all archive types and security fuzzing |
| 4 Collision | Flat five-int boxes connected to root fighter contact phase and helper/projectile phase; reusable scratch; stable 1D broadphase primitive | Full multi-entity scheduler/broadphase wiring and native MUGEN collision semantics |
| 5 Fixed point | `Fixed16` 16.16 operations, saturation, conversion from legacy 1/256 coordinates | Full simulation switch, compiled CNS expression parity and fixed16 overflow audit |
| 6 Rollback | Preallocated integer state ring, separately tracked presentation smoothing | Complete snapshot of every mutable actor/AI/helper/projectile/round state, authoritative replay + network transport |
| 7 Input | Packed 60-frame history, capture during matches, export bounded .cmd macro through Wasm API | Exact MUGEN modifiers, facing transitions, full activation replay |
| 8 Presentation | FBO background desaturation/tint, separate full-bright indexed character pass, parallax and shadow skew; rational slow-motion clock primitive | End-to-end renderer wiring, palette and blend parity, tick-accurate slow-motion in gameplay |
| 9 Telemetry | Reusable typed-array O(1) rolling phase timer in JavaScript | Wire all timing phases to actual worker and native-memory zero-copy map |
| 10 CI / Android | Kotlin/Wasm build/test workflow, new blueprint JS test, separate secure HTTPS WebViewAssetLoader activity and packaging script | Actual Android APK building with staged Wasm and physical FPS/OPFS input-latency testing |

## Implementation and QA order

1. Build `./android/gradlew -p kotlin-core jvmTest wasmJsNodeTest wasmJsBrowserProductionWebpack`.
2. Run `node --test test/core/blueprint-foundations.test.js test/core/kotlin-wasm-backend.test.js`.
3. Run `node --experimental-wasm-modules scripts/core/verify-kotlin-wasm-module.mjs`.
4. Run `node --experimental-wasm-modules scripts/core/benchmark-kotlin-wasm.mjs`.
5. Stage WebView build: `node scripts/core/package-kotlin-android.mjs`; use Android Studio/Gradle for physical build validation.
6. Acquire original Dark Donald, Rare Akuma, Hazama and Slayer archives and native reference traces; compare **each simulation tick**, including intros, camera, hitstun, AI, KO, helper and projectile lifetimes.
7. Collect before/after browser and physical Android performance data under dense effects, comparing at least 60 FPS frame-time distributions, GPU memory and input latency.

## Release blockers

- Replacing the legacy 1/256 runtime with 16.16 changes authored controller timing/physics and demands new native parity captures.
- Current rollback data ring is **storage only**; no network protocol or authoritative rewind is enabled.
- R8 WebGL2 pipeline is an opt-in stand-alone renderer; existing Three.js remains deployed.
- The new Android activity is intentionally not exposed as a launcher. It is an internal preview reachable after explicit app integration. Secure HTTPS origin does not guarantee every WebView implements OPFS.
- Existing `MIGRATION_STATUS.md` notes KFM native JS baseline failure (1/147 strict) and absence of original Dark Donald and Rare Akuma archives; these are still unresolved.

## Sanity checks

Do not infer that a compiled Kotlin test establishes native MUGEN equivalence.
Do not turn on the Kotlin browser backend by default while real character/Android
performance tests are absent. Every newly unsupported controller must produce
an explicit diagnostic instead of being silently accepted.
