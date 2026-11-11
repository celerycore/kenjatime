# Phase 2 — Dark Donald stress + Rare Akuma ZSS globals
Date: 2026-11-11
Branch: `feature/kotlin-wasm-blueprint-20261111`
Draft review: https://github.com/celerycore/kenjatime/pull/14

## Scope and source
The user supplied the legacy `Rare Akuma(1).zip` (2007), `RareAkuma(1).zip` (2026 ZSS), and `Dark Donald(2).rar`. These original archives are not in GitHub and have **not** been copied into the repository or Actions. Archive inventory was performed locally and is separate from actual Core runtime measurements.

## Implemented code changes
1. Dark Donald-class projectile loads: `ProjectileConstants` uses a small per-projectile overlay backed by the creator's program constants. The actor's character constants are not copied per projectile. Immutable projectile bounds are precomputed at spawn.
2. Projectile clashes: `TrainingMatch` now preallocates a four-number envelope per projectile using `Float64Array`, skips pairwise detailed Clsn2 intersection when bounding envelopes cannot intersect, and exposes diagnostic `projectileClashStats` counters.
3. 2026 ZSS: extends the existing global state `-4` scheduler to append multiple definitions from CNS/ZSS files, and implements distinct post-state `+1` scheduling. Both run through world pause and for helpers without keyctrl. The fixed 20,000-step ZSS tick budget is retained; Wasm expression collection traverses all composite declarations.
4. Legacy isolation: normal numeric `StateDef 1` remains separate from the literal `StateDef +1`. Existing `-1/-2/-3` and positive duplicate-state precedence are left unchanged; this is an intentional compatibility boundary.

## Executed validation
GitHub Actions `Kenjatime Core Stress Regression` ran the new four projectile optimization tests and four extended-global scheduling tests successfully. The existing ZSS fixtures also passed after removing an obsolete test that assumed +1 was invalid. This suite includes a baseline-vs-branch regression comparison.

### Synthetic comparison (same GitHub-hosted runner, Node 22, three samples; not Dark Donald FPS)

| Stress case | Unmodified engine median ms/tick | Optimized engine median ms/tick | Pre-optimization constants entries | Optimized entries |
|---|---:|---:|---:|---:|
| 64 spread-out projectiles | 0.4252 | 0.4713 | 5,248 | 256 |
| 256 spread-out projectiles | 0.9595 | 0.7305 | 20,992 | 1,024 |
| 64 dense projectiles | 0.5574 | 0.5521 | 5,248 | 256 |

This particular 256-projectile sample improved median CPU tick time by about 24%; no consistent speedup is claimed for the other two workloads. The overlay stores four override entries rather than copying 82 default/character entries per projectile. Heap measurements are noisy and are **not** a dependable per-character memory budget. Simulation checksums remained identical across repeats *within each branch*. Native frame parity remains separately unverified for these character assets.

### Pre-existing baseline limitation

The unmodified `rewrite/kotlin-wasm-core-20261111` branch itself failed the existing native-oracle comparisons: 2,110 differing fields across 16 interaction cases and only 1 / 147 KFM verified cases matched. These results were independently confirmed in a separate baseline checkout; they cannot be attributed to this phase-2 patch. A new `compare-baseline-traces.mjs` gate compares per-case differences between baseline and feature branch to identify introduced regressions. Do **not** label the existing 147 scenarios fully passing until the original native oracle comparison is repaired.

## Still required before merge/release

- Run headless `CoreSession` benchmarks against **all three original uploaded archives**, including the extracted RAR package, controlled state/helper probes, and repeatable checksums. The repository has `scripts/core/benchmark-character-packages.mjs` as an opt-in runner for locally supplied files.
- Test actual Dark Donald introductions, projectile effects, AI, audio decoding, GPU render stability and pause/resume on Android phone.
- Test actual Rare Akuma 2026 state `-4` and ZSS helpers against native IKEMEN GO traces. This uploaded character currently contains `-4` in `States/System.zss`; `+1` is proactive dialect support, not proof this character uses it.
- Validate all legacy 2007 Rare Akuma ST/CMD states, effects, AI and combo behavior against a native reference. Keep normal state precedence unchanged until compared.
- Full Kotlin/WASM combat state integration is **not yet performed**. The optional Kotlin foundation module is independent of the active JavaScript Core, and is being compiled in a separate CI job.
- Re-establish native KFM/interactions baseline, no gaps, then measure browser/physical-device frame timing, memory, native output.
