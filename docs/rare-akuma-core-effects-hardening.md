# Rare Akuma dual-version Core effects hardening

This change adds four Core engine fixes on top of draft PR #4, without changing or redistributing either original Rare Akuma archive.

1. AIR now records whether LoopStart was explicitly present at frame 0. Unlooped finite actions terminate; explicitly looped effects run until their bounded lifecycle ends.
2. Hitstop and pause freeze the transient effect's frame cursor and age.
3. A roundGeneration change clears previous-round GameMakeAnim, authored impact effects, fallback hit flashes, palette trails, and pending sound events, while preserving reusable decoded sprite resources.
4. A HitDef spark action ID with no referenced source sprite in its SFF emits a missing-sprite diagnostic and uses the existing generic impact flash. Intentionally invisible AIR frames do not receive fabricated art.

Five asset-independent tests in test/core/rare-akuma-hardening.test.js exercise these cases.

## Rerun using both supplied original archives

The patched dual-version strict benchmark completed 3,600 / 3,600 ticks in both CPU player orders, with 107 and 91 combat contacts respectively, 31 sampled render packets each, zero runtime diagnostic categories, and zero exceptions.

Each archive's independent bounded smoke probes also passed: 2007 134/134 nonnegative states, 24/24 helper states, 307/307 animations; 2026 218/218 states, 54/54 helper states, 327/327 animations.

Original resource gaps remain: absent 2007 SFF sprite references, seven truncated 2026 PCX sprites, and unbundled fightfx action resources F0/F1/F2/F40. This update does not manufacture or replace source artwork.

## Validation

Local original-archive benchmarks used a temporary offline ZIP adapter because npm registry access was unavailable. GitHub Actions executes the standard npm ci, Core tests, compiled-runtime tests, production build and browser verification on the draft branch. Original character ZIPs are intentionally excluded from repository and CI.

This is not native MUGEN/IKEMEN tick-by-tick parity certification.
