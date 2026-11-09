# Rare Akuma compatibility benchmark (opt-in)

The user-supplied Rare Akuma ZIP is a complex WinMUGEN character by Phantom.of.the.Server. **The binary and its character art, scripts and sounds are not committed.** Keep the ZIP locally.

## Source inventory

The uploaded ZIP SHA-256 is 1482540feca04a9dba1eec529e99ea36dceb41730fb3a00a3450de67faa8e08d.
It contains **Rare Akuma/Rare Akuma.def** (spaces are significant). Its original source has:

| Component | Count |
| --- | ---: |
| Authored Statedef sections including -1/-2/-3 | 137 |
| State controllers / distinct types | 1,032 / 60 |
| Authored helper states | 24 |
| Helper / Projectile creation controllers | 45 / 3 |
| Commands | 150 |
| AIR action headers / unique IDs / frame rows | 309 / 307 / 2,215 |
| SFF sprite records / linked records | 872 / 42 |
| Palette references | 12 |

All 60 controller names occur in the Core supported-controller registry. That does not prove all parameters, triggers, redirects or timing are correct.

The author's raw AIR references **492 missing SFF sprite instances** (480 in the 307 effective last-wins AIR actions), repeats action IDs 1330 and 7101, and directly references undefined character actions 4128, 4210, 5111, 6051 and 6052. These are source-archive observations, not necessarily engine bugs. Capture native rendering before implementing a fallback; do not invent sprites.

## Run the Core smoke benchmark

From the Kenjatime Core repository root, after npm ci:

    MUGEN_RARE_AKUMA="/absolute/path/Rare Akuma.zip" npm run benchmark:core:rare-akuma

This creates a per-state, per-helper and per-action report at **work/core/rare-akuma-coverage.json**.

Set RARE_AKUMA_TICKS=5 to change the smoke window from its 2-tick default (accepted range 1..8). Enable RARE_AKUMA_STRICT=1 to return a nonzero exit on unsupported controllers, compilation blockers and failed smoke probes.

Run the isolated one-hit health-ledger regression as well:

    MUGEN_RARE_AKUMA="/absolute/path/Rare Akuma.zip" npm run verify:core:rare-akuma-health

The latter deliberately skips intro and attack filters for one controlled 100-point attack. This exact archive has defence=100; the contact deals 100 and Rare Akuma finishes at 1,911 life after regeneration at tick 140, with one damage-ledger charge. It does not simulate Dark Donald.

## Coverage levels and limitations

1. **State smoke:** each of the 134 nonnegative authored states is forced after a match reset, then stepped. Global -1/-2/-3 execute via normal ticks and are reported separately. Forced entry does not prove that CMD can naturally reach the state.
2. **Helper smoke:** all 24 authored helper-state definitions are spawned with valid parent/root, then stepped. A script-directed DestroySelf is not a failure. The full contexts of all 45 Helper controllers are not exhaustively reproduced.
3. **Animation smoke:** every unique authored AIR action is selected via ChangeAnim, a Core draw packet is generated, and at least one present source sprite is decoded where available. This does not compare all frame timing, color or pixel output.
4. **Controller recognition:** parser diagnostics and missing controller names are exposed. Every controller parameter and every trigger expression is not certified.
5. **Native comparison:** **not yet performed for this archive**. KFM's existing 147 verified scenarios and 16 interaction probes must not be relabeled as Rare Akuma parity.
6. **Performance:** no physical mobile GPU, audio or memory benchmark is included.

Promotion to full compatibility requires original MUGEN or IKEMEN GO captures using this exact ZIP, with both facings, command paths, hit/guard/KO, reversals, helper ownership, projectile collisions, sprite/palette identity, and cleanup compared tick by tick against Core.

The existing website and recovery engine remain untouched until this review branch is validated.

## Rare Akuma Core 0.5.8 compatibility fixes (review branch)

- Pre-2002 HitDef `sprpriority` aliases `p1sprpriority`. Explicit modern p1sprpriority wins, and drawing priority changes on a successful hit or guard.
- Rare Akuma's nonstandard Helper `bindtime` is an opt-in timed P1/P2 spawn-anchor attachment: `0` disables binding, `-1` is indefinite, and a destroyed anchor releases the helper. Native parity for nonstandard Helper bindtime remains unverified.
- Nonstandard Explod `under=1` draws behind fighter layers unless `ontop=1` is also set. Official MUGEN specifies under for GameMakeAnim, not Explod; this is a compatibility extension.
- AssertSpecial `nomusic` suppresses stage BGM each asserted tick, including module streaming, without pausing sound effects or overriding the user pause switch.
- Duplicate AIR IDs resolve last-wins in the benchmark, matching runtime. Controlled health check expects 100 damage and 1,911 life after scripted regeneration.

## Original character asset audit

Run `MUGEN_RARE_AKUMA="/absolute/path/Rare Akuma.zip" npm run audit:core:rare-akuma-assets`.

The report `work/core/rare-akuma-assets.json` separates 244 actions with at least one SFF sprite, 20 invisible actions using negative sprite groups, and 43 actions with no source SFF pair. There are 290 distinct missing sprite pairs and 480 missing references across the effective AIR definitions. The raw AIR count including duplicate actions is 492. None of these 43 actions has a *direct fixed* controller animation reference, but some may still be reached dynamically.

Five statically referenced character animations are undefined: 4128 (Explod), 4210 (Explod), 5111 (ChangeAnim), 6051 (Explod), 6052 (Explod). Common HitDef sparks, GameMakeAnim, and other fightfx effects require separate MUGEN common-effect resources. Those assets are not included in the supplied character or KFM archives and the Core preview currently lacks a bundled common fightfx bank.

Do not invent substitute source images or claim native visual parity. The engine's Core compatibility changes were tested under Node 22 with a local test-only decompression adapter because npm dependencies could not be installed here; GitHub CI is the authoritative standard-dependency test gate.
