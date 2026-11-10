# Kenjatime Kotlin/Wasm migration (experimental)

This is an **incremental replacement kernel** based on the uploaded
`mugen_kotlin_engine_blueprint.md`, rebased on the existing
`fix/core-round-intro-outro-sequence-20261110` rewrite. The live JS engine,
existing importers, licensed third-party dependencies, stage renderer and
round-sequence/AI logic remain unchanged until parity gates pass.

## Build and test

From repository root, with JDK 21:

```sh
./android/gradlew -p kotlin-core jvmTest
./android/gradlew -p kotlin-core wasmJsBrowserProductionWebpack
```

Use the generated Kotlin .mjs file with the opt-in
`src/core/kotlin-wasm-backend.js` adapter. The module exposes primitive
`ktCore*` functions and accepts CNS/AIR strings. An application bundler
must serve the generated .mjs **and its .wasm companion** at the expected URL.
No part of the current production fighting runtime automatically loads it.

## Blueprint mapping

| Blueprint section | Kotlin module | State |
| --- | --- | --- |
| 1: architecture | `Combat.kt` | Independent actor instances, 60-tick API, integer subpixel simulation |
| 2: DEF/INI | `Def.kt` | Case-insensitive, ordered repeated sections |
| 3: CMD | `Input.kt` | Motion buffer, facing and button edges; partial modifiers |
| 4: CNS/ST | `Combat.kt` | Simple triggers/controller subset; incomplete |
| 5: Clsn1/Clsn2 | `Air.kt`, `Combat.kt` | AABB attacks, trade snapshot, per-target once |
| 6: SFF/palette | `Assets.kt` | ACT + indexed RGBA expansion; no SFF/PCX decoder |
| 7: camera | `Camera.kt` | Render-only tracking and safe clamping |
| 8: SND | `Assets.kt` | Bounded v1 archive extraction; no audio playback |
| 9: AIR | `Air.kt` | Action frames and collision box defaults; partial AIR |
| 10: master context | `Combat.kt`, `WasmExports.kt` | Initial immutable definitions / independent actor state |

## Compatibility boundary — not full MUGEN or Ikemen GO

Not yet implemented: binary SFF v1/v2 and PCX decompression; state expression
interpreter and most CNS/ZSS controllers; guard/throws/helpers/projectiles;
common state inheritance, character palettes and AIR loopstart semantics;
sound playback; round intro/outro; arcade screenpack and Lua extensions.
An unknown trigger/controller is **reported and skipped**, never silently
treated as true. The reference JS engine must stay active until compatibility
fixtures (including Dark Donald, KFM and Rare Akuma) and real mobile FPS pass.

Kotlin/Wasm is beta; validate target browser support and WASM resource use
before deciding whether to enable it for users. The numeric simulation uses
integer 1/256 pixel positions rather than platform-dependent frame deltas.
The camera intentionally cannot influence the fight checksum.

## Next integration gate

Build WASM in CI, then add differential replay tests against
`test/core/` captures before migrating browser worker ownership. Keep the
current Worker/Three.js renderer and archive UI as adapters rather than
allocating duplicate sprite or archive memory.
