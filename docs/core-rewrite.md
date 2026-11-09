# Independent engine rewrite: 0.5.7 preview

This branch's default build now produces Kenjatime Core, an independently authored engine with a direct Three.js sprite renderer. It does not load the previous engine VM, GL command bridge, Go runtime, shared engine ZIP or stock engine interface. The original Kenjatime setup and battle interface are used on both platforms. Third-party graphics, codecs, platform libraries and character data retain their notices; see [authorship boundary](../core/ORIGIN.md).

The saved 0.4.5 recovery tags remain available. The preview has a separate website path, Android application ID and IndexedDB library. Resetting the preview was verified to preserve the recovery library and selection. Android's normal build defaults to the separate preview ID, including Android Studio builds.

## Implemented architecture

- Original CNS parser and interpreter, with shared immutable program data and isolated actor variables, palette maps and command buffers.
- Numeric WebAssembly emitted directly from parsed expressions. Integer wrapping, float32 arithmetic, bottom/error handling and lazy conditional behavior are covered by differential tests. Side effects, redirects and other unsupported compilation paths retain the independent interpreter.
- Fixed 60 Hz simulation in a worker; timestamped keyboard, touch and gamepad inputs retain short presses. Unchanged gamepad states avoid repeated cross-thread messages.
- Direct Three.js meshes, indexed sprite textures and separate palette textures. Warm unchanged frames require no pixel uploads. Render resolution is bounded; high device pixel ratios do not automatically multiply the framebuffer size.
- Worker graphics handshake before character-buffer transfer. A failed worker context can fall back without making a second complete character-library copy. Startup cancellation, repeated sessions and context loss release game, audio and graphics resources.
- Separate attack pause and defender hit-shake phases, deferred cross-actor state entry and damage, physical guarding independent of CMD command names, target retirement, inclusive collision edges, float32 movement, projectile repeat-contact clocks and pause allowances. Original common states cover the captured throws, helper/projectile interactions and air recovery without loading reference common-state code.
- One audio context, two concurrent sound decoders, a 32 MiB decoded cache with active-buffer accounting, bounded pending cues, refetch of evicted sound data, and cleanup of replaced stage-media graphs. Tracker PCM uses the existing bounded AudioWorklet queue at the device sample rate.
- Content-based imports and original-byte exports for common archives, tested encryption variants and multipart sets. Android retains its all-files document picker and native archive-save integration.

## Extended scripting and stage update

The 0.5.7 update adds an original match API adapter around the third-party Lua 5.4 VM supplied by wasmoon. Imported `external/mods/*.lua` modules can register `hook.add` callbacks, use archive-local `require`/`dofile`, select players/helpers/targets, query state and alter supported life, power, maps and states. Leading `-` module filenames are excluded from automatic execution. A selection can also supply explicit modules and a per-frame `lua` chunk. These are match scripting APIs, not a screenpack or a replacement state-file syntax. Common Lua 5.1 environment helpers are provided; complete Lua 5.1/5.4 dialect and API parity is not claimed.

Lua has a 32 MiB VM allocation limit, 256 KiB source limit per module, 32 entry modules and a 100,000-instruction budget per call. An exhausted per-frame script is disabled with a diagnostic while the CNS fight continues. Nested protected loops cannot evade the tested budget. File access is confined to the imported virtual archive; host IO and OS libraries are unavailable. Lua VM and binding licenses are included in the distribution.

Video backgrounds support the documented center pivot, six fit modes, archive-relative/default-video-directory paths, looping, volume, transforms, stage windows and normal background layer order. The browser decodes supported media; only one resized bitmap per video layer can be in flight. There are at most four layers, 64 MiB of source media and 1280×720 uploaded frames. Hidden matches keep media playback time while suppressing bitmap capture and GPU drawing. Pause and stage-reset controls stop or rewind media. Browser codec availability and high-quality scaler equivalence remain device-dependent.

glTF 2.0/GLB stages load through Three's public loader and scene API. The adapter implements scene selection, model transforms, embedded/fallback perspective cameras, standard animation clips, punctual lighting, HDR environments, model layer ordering and mesh shadows. GPU sprite passes remain single-pass for ordinary 2D stages. Model stages use separate composition passes; static models reuse their shadow maps instead of regenerating them every frame. Model source/geometry and texture budgets, node/material/accessor limits and cyclic-hierarchy checks reject excessive content. Compressed mesh/texture extensions, animation pointers, outlines and exact cross-layer shadows remain incomplete. Image decoding can allocate memory before the post-load texture budget check.

Imported stages now use the arena's 320×180 logical view, preserving fighter size on 320×240 stages instead of shrinking the whole scene into a narrow viewport. Explicit `cuthigh`/`cutlow` preserve their ratio; omitted guidelines use an original floor-preserving crop heuristic. Nine immutable native captures cover legacy/wide/HD coordinates, nonzero camera origin, low floors and explicit crop ratios. The comparison checks 9,248 sprite pixels with zero interior differences and 64 pixels within the existing bidirectional one-pixel raster allowance. This does not certify all automatic cropping or moving/mixed-coordinate camera behavior. `autocenter`, zoom-in delay/speeds, tension damping, vertical speed, vertical-follow zoom adjustment and bottom zoom anchoring are also implemented and covered by authored behavior tests; their full native curves remain unverified. `boundhighzoomdelta` reports a remaining gap.

The [0.5.7 evidence](core-stage-health-0.5.7-evidence.json) records worker/main browser runs, visible shadow pixels, animated-model reset pixels, native resolution comparisons and the supplied character replay. The 0.5.6 source, web and APK checkpoints remain available.

The 0.5.6 preview adds an independently authored ZSS parser and bounded interpreter. It supports structured `if`/`else`, blocks, integer `for` loops, `while`, `switch`, `break`/`continue`, numeric locals, functions with numeric arguments/returns, named maps, `persistent` blocks and hitpause inheritance. CNS and ZSS files can be mixed, including the `.cns.zss` fallback. Existing numeric expressions still use the original Wasm compiler where supported, with the independent interpreter for other paths. Map reads preserve float32 semantics; `MapSet` and `MapAdd` also work in CNS.

Three authored native probes retain 30 samples in [the scripting fixture](../test/fixtures/core/zss.json). Both compiled and interpreted paths reproduce those samples. They establish branch selection, local reset, function results, map arithmetic, block persistence, inclusive integer loop bounds, final counter values, switch selection, break/continue and hitpause behavior in the tested configurations. Unsupported Lua state files and extended global scheduling (`-4`/`+1`) now produce explicit startup errors. Newer string locals, all extended controllers and every ZSS dialect are not covered.

Script resources have limits: 64 nested parser levels, 256 locals per scope, 20,000 statements per file, 100,000 combined ZSS statements, 32 function frames, 2,500 loop iterations and 20,000 executed instructions per actor tick. Compilation errors identify the source and line. State transitions stop nested execution; function frames and script ownership are restored even after errors. CNS startup avoids a second parse when no custom constants/maps are present.

The GPU stage path now renders width-based parallax, legacy camera shear, animated perspective metadata and both `window` and centered `maskwindow` clipping. Perspective is evaluated in one fragment-shader pass per visible tile. There are no per-row meshes or repeated texture uploads. A 48-row or 4,096-row perspective sprite needs one draw when untiled; a tested tiled floor needs seven. Both retain zero warm asset uploads. These are draw-count/resource measurements, not phone FPS measurements.

[Five immutable native stage images](../test/fixtures/core/stages/cases.json) cover width-based perspective, tiled perspective, normal windows, centered masks and a stationary preprocessed floor. Production Core/Three rendering matches 33,579 tested colored/edge pixels with zero interior differences; 298 pixels lie on raster edges within the stated one-pixel, bidirectional OpenGL/WebGL allowance. This comparison excludes the native interface and does not certify advanced moving cameras, nonzero camera start offsets or mixed character/stage coordinate systems. A separate numeric test covers the planned camera-shear transform; it is not native-camera certification.

The game no longer auto-pauses on window blur, tab visibility changes or the Android app-state event. A cancellable scheduler uses timer callbacks when unfocused/hidden; hidden presentation stops drawing while fixed-tick simulation and audio requests continue. Elapsed simulation debt is retained and processed in bounded batches. Keyboard, touch and gamepad state is cleared on focus loss. Manual pause remains explicit and is preserved when focus returns. Browser checks inject lifecycle events on worker, main-thread and worker-fallback paths; an independent scheduler test withholds animation frames entirely. Browser timer throttling and Android process suspension still apply; physical background execution is not certified.

## Combat and simulation baseline

Rare Akuma's own health ledger reads `GetHitVar(damage)`. The previous runtime retained this value indefinitely, so its scripts could charge a single hit repeatedly. Incoming damage now clears after one controller evaluation pass, including hitpause. An immutable native probe reproduces 55 observations through both compiled and interpreted execution. Duplicate CNS parameters also retain the first occurrence, matching a separate native probe; Rare Akuma's `StateTypeSet` followed by `type=L` no longer becomes an unsupported controller named `L`.

With the supplied, unmodified Rare Akuma scripts, one controlled 100-point attack becomes 50 damage after defence. The 0.5.6 checkout eventually reaches zero health by tick 140. The corrected runtime charges the ledger once, reaches 1,950 life and then the character's normal regeneration reaches 1,961 by tick 140. Intro state and attack filters are explicitly bypassed for this isolated test; this is not a Dark Donald simulation. The exact attached Dark Donald archive exceeds the transfer tool's 32 MiB limit, and the provided download site's host is blocked by the workspace network proxy. That exact matchup remains unverified.

The 0.5.5 update closes all six remaining differences in the recorded KFM moveset comparison. All 147 scenarios now match across 12,854 ticks and 771,240 root-field comparisons. All 16 recorded interaction scenarios also remain matching. `npm run compatibility` and `npm run verify:core:movesets` now require the complete captured baseline; the native captures and numeric tolerances are unchanged. The 0.5.4 installers and checkpoint tags remain available for recovery.

Animation handling now separates controller reads, the externally reported clock, and the sprite selected for rendering during hitpause. A reset selects its requested sprite immediately while the reported clock can remain one tick before that element. Pause/resume, repeated resets, redirected reads, loop boundaries and reset-to-first-element are covered by independently authored native probes. Loop elapsed-time reset occurs after the controller pass. The renderer consumes the selected sprite rather than interpreting the reported clock as a draw cursor.

Body pushing now rounds projected edges at the proper phase and rechecks reciprocal contact after displacement. The second check includes current hurt-box overlap; a ground-width body can already have separated those boxes even when size edges retain a tiny float32 penetration. Additional native observations cover positive/negative positions, standing/air/lying victims, width overrides and a deliberately widened hurt box. Existing stage-limit and wall-transfer behavior remains covered.

An immutable animation-timing cache replaces repeated array slices, duration maps and scans in trigger reads. Element-time reads use prefix offsets; relative element lookups use binary search. Infinite hold frames retain finite offsets for explicit jumps to later elements. The earlier contact-scan and scalar-trigger optimizations remain in place.

The [animation observations](../test/fixtures/core/animation-pause.json) retain seven authored probe recipes and 154 selected samples, including sprite dimensions and axis offsets. The [body-push observations](../test/fixtures/core/body-push.json) retain six authored probe recipes and 41 samples. Both fixtures identify the unmodified native executable and capture hashes. These observations cover the stated configurations and do not establish every controller combination or multi-actor ordering.

Encrypted ZIP imports also report the correct password-or-damage error when a ZipCrypto header collision reaches CRC verification. A pinned authored archive reproduces the former intermittent error and verifies that a later correct-password import still succeeds.

## Verification and measurements

[Current update evidence](core-stage-health-0.5.7-evidence.json) and the [0.5.6 baseline evidence](core-rewrite-evidence.json) record results and their limits.

| Check | Result | Scope |
| --- | --- | --- |
| Core tests | 69 passed | Compiler, combat, Lua budgets/APIs, camera controls, media parsing and lifecycle |
| Existing regressions through the compiler | 550 passed, no skips | Supplied character/stage corpus available; compares the independent implementation's own behavior |
| Captured interaction comparison | 16 scenarios, 1,130 ticks, 67,800 field comparisons, zero differences | State, animation clocks, motion, damage/power, hit clocks, falls, targets, proximity and entity counts |
| Larger captured KFM moveset comparison | 147 of 147 scenarios match; zero differences across 12,854 ticks | Strict complete-capture gate passes; it is not presented as universal compatibility |
| Browser integration | Worker, main thread and forced worker-GPU failure passed | Two fighters/lifebars, fixed aspect ratio, attacks, decoded audio, same-page play, frozen paused GPU, focus/visibility continuation, input release, early cancellation and three repeated sessions per backend |
| Archive integration | 19 import/export cases passed | ZIP, RAR4/5, 7z, TAR variants, CPIO, self-extracting ZIP, AES variants and split ZIP/7z/RAR; bundle reimport and failure recovery |
| Android | 10 startup/picker tests and lint passed | Localhost startup, native provider/save behavior and lifecycle; no physical phone execution |
| APK audit | See current update evidence | Same signing certificate; exact independent web assets; separate application ID; no reference-engine payloads |
| Expression microbenchmark | 124.29 ms interpreter / 65.43 ms compiler, **1.90×** | Median of five 400,000-evaluation host samples; identical checksums, 751-byte numeric module |

The CPU simulation benchmark compares this implementation with `9604143`. Each median covers five 2,000-tick samples after warm-up, using the shared independent JS interpreter and authored stationary loads. Attacks miss by design; entity counts and state checksums must remain identical. Graphics, audio and imports are excluded. Measurements run sequentially without other heavy checks.

| CPU workload | 0.5.4 median | 0.5.5 median | Speedup |
| --- | --- | --- | --- |
| two-fighters | 24.46 ms | 17.92 ms | 1.37× |
| idle-helpers | 94.76 ms | 100.49 ms | 0.94× |
| attacking-helpers | 800.56 ms | 800.23 ms | 1.00× |
| projectile-load | 552.81 ms | 536.06 ms | 1.03× |

The separate animation benchmark performs 20,000 evaluations of three animation triggers per sample, with five samples per action length. It changes the queried element and relative offset, includes finite loop offsets, uses the same independent interpreter for both versions, and requires identical checksums. It excludes full match simulation, graphics and audio.

| Action length | 0.5.4 median | 0.5.5 median | Speedup |
| --- | --- | --- | --- |
| 24 | 13.14 ms | 3.68 ms | 3.57× |
| 1024 | 148.85 ms | 4.48 ms | 33.26× |

The 0.5.6 host regression sample compares against `065a8ee` with the same five-sample workloads and identical state checksums: two fighters 17.54 → 19.95 ms, idle helpers 111.63 → 108.86 ms, attacking helpers 845.70 → 835.22 ms, and projectiles 571.03 → 595.89 ms per 2,000 ticks. These mixed results do not establish an overall CPU speedup for this feature update.

Host timings vary and do not predict phone FPS. CI records current workloads without a timing threshold. To compare a saved checkout, set `CORE_BENCH_SOURCE=/path/to/checkout`; the combat and animation commands accept `CORE_BENCH_OUTPUT` and `CORE_ANIMATION_BENCH_OUTPUT` respectively for their reports.

The earlier expression-compiler microbenchmark compares Kenjatime's interpreter with its compiled backend. It does not measure phone FPS or establish a speed advantage over another complete engine. Browser graphics checks use software WebGL in headless Chromium. Physical Infinix/Brave performance and audible crackle still need device measurements.

## Remaining compatibility work

The recorded combat baseline has no remaining mismatches. Broader interoperability still requires more character/stage families. Native captures are read-only: missing ticks or fields fail the comparator, and expected captures are never replaced with Core output. Its current comparison does not include full helper/projectile subfield traces or palette-pixel comparisons.

Complete Lua APIs/dialect parity and character-state Lua files, newer ZSS extensions and extended global scheduling, exact video/3D native parity, compressed model extensions, outlines and cross-layer shadows, advanced moving/mixed-coordinate stage cameras, advanced environment effects, authored common hit/sound resources and long afterimage palette chains remain incomplete or unverified. The renderer currently uses procedural contact sparks and caps per-sprite palette processing at eight layers. Resource budgets produce diagnostics rather than implying support for arbitrarily large content. Common archive support does not imply every compression method or encryption scheme ever used.

The historical integration files remain as recovery/verification material in this repository. The standalone distribution excludes them; build graph manifests and hashes are emitted alongside it. This is a migration checkpoint, not the completion of universal character/stage support.

## Run and reproduce

```sh
npm ci
npm run dev
npm run build
npm test
npm run compatibility
npm run verify:core:movesets
npm run diagnose:core:movesets
npm run benchmark:core:combat
npm run benchmark:core:animation
npm run verify:core:browser
CORE_MAIN=1 npm run verify:core:browser
CORE_WORKER_FAIL=1 npm run verify:core:browser
npm run verify:core:archives
npm run verify:core:stages
npm run android:core:debug
ANDROID_HOME=/path/to/sdk python scripts/core/verify-android.py
```

Browser scripts require Python Playwright and Chromium; stage pixel verification also requires Pillow. Android requires JDK 21 and SDK/build-tools 36. Existing corpus tests additionally use the `MUGEN_*` archive environment variables; absent local corpus files are reported as skips. The CI workflow builds both preview targets, strictly checks every captured scenario and retains comparison and benchmark evidence.
