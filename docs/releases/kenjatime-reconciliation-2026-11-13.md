# Kenjatime R8 Mega Update — release reconciliation (2026-11-13)

## Scope and source of truth
- Production GitHub Pages default branch: `gh-pages`.
- R8 isolated source: `feature/r8-benchmark-preview-20261112`; **never** replace `/arcade/`, `/core-test/`, or site root.
- Planned Mega Update: PR #44 merged as `8827bc7f17d9cd811bfdf314efc48cf6cced87c5`, manifest `releases/kenjatime-mega-2026-11-13.json`.
- Last observed public R8 metadata (before this change): `sourceCommit=82478a57384af17d2feb569c76da228c9bf8b595`, without `releaseId`. There were 88 R8 source commits not reflected in that published metadata.
- `gh-pages` deploy success is not R8 publication success. Dedicated R8 publisher run 43293303877 failed in `npm run build:core` **after** the unit suite passed.

## Confirmed failed release gate
- The Vite bundle completed, but `scripts/core/audit-build.mjs` rejected `assets/runtime-DtOtM7K2.js` solely because its raw text contained the term `ikemen`.
- The now-shared Core/R8 compatibility contract explicitly declares `extendedDialect: "ikemen-go"`. Such a string is metadata, **not** imported external engine code.
- Fix: the post-bundle scanner distinguishes an actual external engine binary/path/adapter from legitimate compatibility vocabulary. The independent Vite dependency-graph boundary remains active; known external engine payloads and host entrypoints are still rejected.
- Regression fixtures test both allowed descriptions and disallowed imports/payloads.

## Cross-version decisions
- `src/runtime.js` blob `41f993e7a70c11c3b9b89e36be9de623c84b49f0` was identical on the R8 and Kotlin/WASM blueprint branches when audited.
- R8 `src/combat.js` is intentionally different from standard Core, preserving benchmark-specific FIGHT-banner/1-second freeze and performance behavior; do not blindly sync it.
- Current production `arcade/assets/core-portrait-native-palette-safe-v2.js` received a separate SFF v1 ACT palette hotfix on `gh-pages` after PR #45 (PR #49). PR #48's **source-level** SFF v1 PCX-reference ACT auto-order implementation and tests are now applied to this R8 reconciliation branch without importing production's compiled JS. They remain distinct implementations until real character and worker rendering checks confirm equivalent output.
- `engine-preview/release.json` still refers to `0.5.8-core-preview` and is a separately scoped preview. Do not relabel it as the Mega Update.
- Kotlin/WASM remains experimental. Do not replace the JS Core based only on successful synthetic tests.
- The release's MUGEN 1.1 compliance and native TargetState/HitDef/Helper semantics remain **unverified** absent independent reference traces.

## Verification required after this patch
1. All Core, SFF v1 ACT palette and audit policy tests green; `npm run build:core` completes including `audit-build.mjs`.
2. Browser KFM startup + fight, R8 CSV export and Android archive input tests green.
3. Only `r8-benchmark/` changes in the Pages publish commit and site/root/arcade checksums remain the same.
4. Published `r8-benchmark/build-info.json` exactly reports `sourceCommit` equal to the new R8 branch merge commit, `releaseId=kenjatime-mega-2026-11-13`, and the expected feature flags.
5. Original Tomoka, Nu-13, Rare Akuma, palette selection and live phone FPS still require real-asset/device verification; a passing CI suite is not enough to claim native MUGEN parity.

If any gate fails, keep the last known working public R8 preview rather than overwriting the production arcade.
