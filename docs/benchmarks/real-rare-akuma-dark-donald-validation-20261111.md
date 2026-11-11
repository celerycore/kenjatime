# Original Rare Akuma and Dark Donald validation — 2026-11-11

## Source provenance and scope

Ran the three **original user-provided packages** locally against a portable source/dependencies snapshot exported from the feature-branch GitHub Actions run, plus the **actual compiled Kotlin/Wasm executable**. User character archives were **never uploaded to the repository or GitHub Actions**.

Archives used:
- 2026 ZSS: `RareAkuma(1).zip` SHA-256 `c626441be701eb104f20b5a5673ab9078555bfad17b298256daf4fcb5d9e349b`
- 2007 ST: `Rare Akuma(1).zip` SHA-256 `1482540feca04a9dba1eec529e99ea36dceb41730fb3a00a3450de67faa8e08d`
- 2011 CNS: `Dark Donald(2).rar` SHA-256 `26d014d0b0e7d3aadea6512bc2885782ae8703582e6dd68d9490386eb11a5162`

The CI checkout bundle included `SOURCE_COMMIT.txt` = `65d842c4150e510de29bee81ae8d0a07e44923f1` (PR synthetic merge checkout). Its compiled Kotlin/Wasm binary SHA-256 is `816315aac9e4d564695e9b939e5bff06cde6c47ae3cbed22df527c6bbfe5e9b8`.

## Executed results, headless Linux Node

| Character | Original 30-tick startup | Two 360-tick deterministic replays | 960-tick JS/Wasm full-state parity | Forced state entry/tick checks, JS/Wasm |
|---|---|---|---|---:|
| Rare Akuma 2026 | PASS | PASS | PASS | 240 / 240 PASS |
| Rare Akuma 2007 | PASS | PASS | PASS | 157 / 157 PASS |
| Dark Donald | PASS | PASS | PASS | 283 / 283 PASS |

Rendered frame **packets** at 30-tick intervals; renderer/GPU display was not certified. All three entered executable gameplay. Rare Akuma 2026's falling intro (`StateDef 177`) took more than 360 ticks but ended normally; it reached fight phase 2 by tick 960.

### Original-character AI duels — 960 ticks each

| Pair | Full per-tick JS/Wasm state hashes | Active round | Peak projectiles | Result by tick 960 |
|---|---|---|---:|---|
| Rare Akuma 2026 vs Rare Akuma 2007 | Identical | Yes | 16 | Both alive, health 1476 / 1864 |
| Rare Akuma 2007 vs Dark Donald | Identical | Yes | 42 | Dark Donald KO'd the 2007 Akuma |
| Dark Donald vs Rare Akuma 2026 | Identical | Yes | 36 | Both alive, health 881 / 1921 |

The matches exercised real character AI, input, helpers, projectiles and damage/KO resolution. They demonstrate successful Kenjatime execution **but not native MUGEN/IKEMEN accuracy**.

### Resource decoding

| Character | SFF sprite entries decoded | Decode errors | Incomplete original sprite source frames | SND WAV entries parsed |
|---|---:|---:|---:|---:|
| Rare Akuma 2026 | 956/956 | 0 | 7 | 134 |
| Rare Akuma 2007 | 872/872 | 0 | 0 | 89 |
| Dark Donald | 1121/1121 | 0 | 2 | 223 |
| **Total** | **2949/2949** | **0** | **9** | **446** |

SFF sprite decoding and WAV archive parsing succeed. Nine original sprites have incomplete encoded image data and may render with transparent missing pixels. Playback through a real audio device was not tested.

## Remaining compatibility issues

- **2026 Rare Akuma:** Runtime produced three missing shared/character effect animation diagnostics (`Explod F2` and `Explod F60`). This may require correctly imported common fightfx AIR/SFF. A clean comparison against native IKEMEN GO has not been run.
- **2007 Rare Akuma:** No Core diagnostics in the 960-tick KFM scenario, but this is not complete move-by-move native parity.
- **Dark Donald:** 13 diagnostics in the 960-tick KFM scenario, including unsupported `StateDef ownpal`, nonconstant `persistent`, invalid hit-attribute combination, HitDef `gurad.pausetime` not implemented, player-type helper compatibility, and missing `hitdef attr` in authored code. Several require engine behavior fixes or explicit character-dialect emulation.
- True shader/WebGL2, browser performance, and Android gameplay were **not verified**. The local headless Chromium exposed no usable WebGL2 context.
- The original engine already has documented native-capture gaps for KFM; JS/Wasm equivalence does **not** imply MUGEN equivalence.

## Reproducibility

Feature-branch test command (original archives stay local):

```sh
node scripts/core/verify-character-trio.mjs \
  '/private/RareAkuma(1).zip' '/private/Rare Akuma(1).zip' \
  /private/dark-donald-extracted --ticks=960 --runs=2 \
  --states --render --strict \
  --wasm=/absolute/path/to/kenjatime-kotlin-engine.mjs
```

The local validation additionally ran all three original-vs-original pairwise matches and exhaustively decoded the three sprite banks. Full results were supplied as a downloadable local Markdown report and JSON record in the conversation.

**Release status:** Continue using JavaScript as the default. The opt-in Kotlin/Wasm candidate and scheduler integration is strongly validated by headless real-asset differential tests but should not be advertised as native-fidelity gameplay or Android-ready until the remaining gaps are addressed.
