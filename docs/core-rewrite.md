# Independent engine rewrite: 0.5.3 preview

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

## Combat and simulation update

The 0.5.3 update keeps animations running through deferred state changes when no animation reset was requested, corrects fall reaction defaults and guard/trip transitions, preserves physical velocity during Turn, and rounds binding positions at the original simulation phase. Queued state entry can now recover after a previous tick reaches the state-change budget. These are original implementation changes; existing native captures remain unchanged.

Common scalar and argument trigger reads now bypass allocation of the unused world/animation snapshot. The reads stay live through helper/target redirects and share the same numeric semantics. The previous collision-scan optimization remains in place.

An additional 120 observations from an unchanged official native executable cover four edge triggers, both facings, fractional inside/outside positions, Width changes, standing/airborne actors and coordinate widths 320/1280. They verify quantization, the aerial inset and the previous-Width read phase independently of collision widths. The authored probe recipe and capture provenance are retained beside the read-only numeric fixture. Other camera/zoom profiles are not established by this probe. See the [authored probe](../test/fixtures/core/edge-probe.cns) and [numeric observations](../test/fixtures/core/edge-triggers.json).

Compared with verified `d543cb5`, exact scenarios increased from 103 to 132 of 147. Differing fields fell from 5,422 to 1,195 (78.0% fewer); all 103 previous matches remain matching. `npm run compatibility` now requires all 132 plus the 16 interaction scenarios. The other 15 retain explicit mismatch reports. The 0.5.2 recovery checkpoints and installers remain available.

## Verification and measurements

[Machine-readable evidence](core-rewrite-evidence.json) records the result and its limits.

| Check | Result | Scope |
| --- | --- | --- |
| Core tests | 41 passed | Compiler, input phases, replay consistency, resource delivery and audio lifecycle |
| Existing regressions through the compiler | 549 passed, no skips | Supplied character/stage corpus available; compares the independent implementation's own behavior |
| Captured interaction comparison | 16 scenarios, 1,130 ticks, 67,800 field comparisons, zero differences | State, animation clocks, motion, damage/power, hit clocks, falls, targets, proximity and entity counts |
| Larger captured KFM moveset comparison | 132 of 147 scenarios match; 1,195 field differences remain across 12,854 ticks | Diagnostic report remains failing; it is not presented as full compatibility |
| Browser integration | Worker, main thread and forced worker-GPU failure passed | Two fighters/lifebars, fixed aspect ratio, attacks, decoded audio, same-page play, frozen paused GPU, early cancellation and three repeated sessions per backend |
| Archive integration | 19 import/export cases passed | ZIP, RAR4/5, 7z, TAR variants, CPIO, self-extracting ZIP, AES variants and split ZIP/7z/RAR; bundle reimport and failure recovery |
| Android | 10 startup/picker tests and lint passed | Localhost startup, native provider/save behavior and lifecycle; no physical phone execution |
| APK audit | 6,958,458 bytes | Signed; exact independent web assets; separate application ID; no reference-engine payloads |
| Expression microbenchmark | 124.29 ms interpreter / 65.43 ms compiler, **1.90×** | Median of five 400,000-evaluation host samples; identical checksums, 751-byte numeric module |

The CPU simulation benchmark compares this implementation with `d543cb5`. Each median covers five 2,000-tick samples after warm-up, using the shared independent JS interpreter and authored stationary loads. Attacks miss by design; entity counts and state checksums must remain identical. Graphics, audio and imports are excluded.

| CPU workload | 0.5.2 median | 0.5.3 median | Speedup |
| --- | --- | --- | --- |
| two-fighters | 31.21 ms | 19.78 ms | 1.58× |
| idle-helpers | 116.79 ms | 124.10 ms | 0.94× |
| attacking-helpers | 1616.43 ms | 1466.20 ms | 1.10× |
| projectile-load | 986.51 ms | 997.83 ms | 0.99× |

The two-fighter sample used 36.6% less CPU time. The attacking-helper sample also improved; idle-helper and projectile samples were slightly slower in this run. Host timings vary and do not predict phone FPS. CI records current workloads without a timing threshold. To compare a saved checkout, set `CORE_BENCH_SOURCE=/path/to/checkout` and `CORE_BENCH_OUTPUT=/path/to/report.json` when running `npm run benchmark:core:combat`.

The microbenchmark compares Kenjatime's interpreter with its compiled backend. It does not measure phone FPS or establish a speed advantage over another complete engine. Browser graphics checks use software WebGL in headless Chromium. Physical Infinix/Brave performance and audible crackle still need device measurements.

## Remaining compatibility work

The remaining 15 scenarios include wall recoil, idle stopping after a run, hitpause animation clocks and small custom-state position differences. Native captures are read-only: missing ticks or fields fail the comparator, and expected captures are never replaced with Core output. Its current comparison does not include full helper/projectile subfield traces or palette-pixel comparisons.

Extended scripting languages, video composition, model stages/shadows, exact parallax/window behavior, advanced environment effects, authored common hit/sound resources and long afterimage palette chains remain incomplete or unverified. The renderer currently uses procedural contact sparks and caps per-sprite palette processing at eight layers. Resource budgets produce diagnostics rather than implying support for arbitrarily large content. Common archive support does not imply every compression method or encryption scheme ever used.

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
npm run verify:core:browser
CORE_MAIN=1 npm run verify:core:browser
CORE_WORKER_FAIL=1 npm run verify:core:browser
npm run verify:core:archives
npm run android:core:debug
ANDROID_HOME=/path/to/sdk python scripts/core/verify-android.py
```

Browser scripts require Python Playwright and Chromium. Android requires JDK 21 and SDK/build-tools 36. Existing corpus tests additionally use the `MUGEN_*` archive environment variables; absent local corpus files are reported as skips. The new CI workflow builds both preview targets and retains the wider moveset mismatch report as evidence.
