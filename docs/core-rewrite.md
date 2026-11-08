# Independent engine rewrite: 0.5.4 preview

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

The 0.5.4 update retains hit recoil until its target reaches a boundary, including delayed wall contact after hitpause. Recoil uses a separate decay clock, freezes during hitpause and world pause, and retires without scanning every helper when none is active. Crouching blocks now ignore an attack's force-standing option, held guard exits when the threat ends, and the default idle state stops residual run motion after four ticks. New independently authored probes against an unchanged native executable verify idle stopping at both ordinary and injected higher speeds; the recipe and observations are retained in [the probe](../test/fixtures/core/idle-stop-probe.cns) and [fixture](../test/fixtures/core/idle-stop.json).

CPU profiling identified repeated hit-flag normalization and eligibility checks for attacks with no overlapping collision boxes. Flags are now normalized once per attack in the collision pass, friendly targets are rejected earlier, and the expensive pure eligibility checks run after box overlap is established. Candidate ordering, simultaneous contacts and the preceding-pass guard-distance clock remain unchanged. Existing scalar-trigger and collision-geometry optimizations are retained.

Compared with verified `4a97df4`, exact scenarios increased from 132 to 141 of 147. Differing fields fell from 1,195 to 458 (61.7% fewer); all 132 previous matches remain matching. `npm run compatibility` now requires all 141 plus the 16 interaction scenarios. The other six retain explicit mismatch reports. The 0.5.3 recovery checkpoints and installers remain available. The original native captures are unchanged.

## Verification and measurements

[Machine-readable evidence](core-rewrite-evidence.json) records the result and its limits.

| Check | Result | Scope |
| --- | --- | --- |
| Core tests | 46 passed | Compiler, input phases, replay consistency, resource delivery and audio lifecycle |
| Existing regressions through the compiler | 549 passed, no skips | Supplied character/stage corpus available; compares the independent implementation's own behavior |
| Captured interaction comparison | 16 scenarios, 1,130 ticks, 67,800 field comparisons, zero differences | State, animation clocks, motion, damage/power, hit clocks, falls, targets, proximity and entity counts |
| Larger captured KFM moveset comparison | 141 of 147 scenarios match; 458 field differences remain across 12,854 ticks | Diagnostic report remains failing; it is not presented as full compatibility |
| Browser integration | Worker, main thread and forced worker-GPU failure passed | Two fighters/lifebars, fixed aspect ratio, attacks, decoded audio, same-page play, frozen paused GPU, early cancellation and three repeated sessions per backend |
| Archive integration | 19 import/export cases passed | ZIP, RAR4/5, 7z, TAR variants, CPIO, self-extracting ZIP, AES variants and split ZIP/7z/RAR; bundle reimport and failure recovery |
| Android | 10 startup/picker tests and lint passed | Localhost startup, native provider/save behavior and lifecycle; no physical phone execution |
| APK audit | 7,207,442 bytes | Signed; exact independent web assets; separate application ID; no reference-engine payloads |
| Expression microbenchmark | 124.29 ms interpreter / 65.43 ms compiler, **1.90×** | Median of five 400,000-evaluation host samples; identical checksums, 751-byte numeric module |

The CPU simulation benchmark compares this implementation with `4a97df4`. Each median covers five 2,000-tick samples after warm-up, using the shared independent JS interpreter and authored stationary loads. Attacks miss by design; entity counts and state checksums must remain identical. Graphics, audio and imports are excluded. Baseline and optimized measurements run sequentially without other heavy checks.

| CPU workload | 0.5.3 median | 0.5.4 median | Speedup |
| --- | --- | --- | --- |
| two-fighters | 23.16 ms | 24.09 ms | 0.96× |
| idle-helpers | 122.89 ms | 109.67 ms | 1.12× |
| attacking-helpers | 1423.41 ms | 853.25 ms | 1.67× |
| projectile-load | 880.67 ms | 596.35 ms | 1.48× |

In the final source run, the attacking-helper and projectile loads used 40.1% and 32.3% less CPU time. Idle helpers used 10.8% less. The small two-fighter sample was 4.0% slower, so the measured gain is concentrated in larger attack loads.

Host timings vary and do not predict phone FPS. CI records current workloads without a timing threshold. To compare a saved checkout, set `CORE_BENCH_SOURCE=/path/to/checkout` and `CORE_BENCH_OUTPUT=/path/to/report.json` when running `npm run benchmark:core:combat`.

The microbenchmark compares Kenjatime's interpreter with its compiled backend. It does not measure phone FPS or establish a speed advantage over another complete engine. Browser graphics checks use software WebGL in headless Chromium. Physical Infinix/Brave performance and audible crackle still need device measurements.

## Remaining compatibility work

The remaining six scenarios include four hitpause-animation clock cases and two custom-state body-push position cases with small float32 differences. Native captures are read-only: missing ticks or fields fail the comparator, and expected captures are never replaced with Core output. Its current comparison does not include full helper/projectile subfield traces or palette-pixel comparisons.

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
