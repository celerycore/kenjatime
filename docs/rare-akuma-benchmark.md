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

The author's AIR references **492 SFF sprite pairs missing from this archive**, repeats action IDs 1330 and 7101, and directly references undefined action 5111. These are source-archive observations, not necessarily engine bugs. Capture native rendering before implementing a fallback; do not invent sprites.

## Run the Core smoke benchmark

From the Kenjatime Core repository root, after npm ci:

    MUGEN_RARE_AKUMA="/absolute/path/Rare Akuma.zip" npm run benchmark:core:rare-akuma

This creates a per-state, per-helper and per-action report at **work/core/rare-akuma-coverage.json**.

Set RARE_AKUMA_TICKS=5 to change the smoke window from its 2-tick default (accepted range 1..8). Enable RARE_AKUMA_STRICT=1 to return a nonzero exit on unsupported controllers, compilation blockers and failed smoke probes.

Run the isolated one-hit health-ledger regression as well:

    MUGEN_RARE_AKUMA="/absolute/path/Rare Akuma.zip" npm run verify:core:rare-akuma-health

The latter deliberately skips intro and attack filters for one controlled 100-point attack reduced to 50 by defence. The previous Core 0.5.8 evidence expects one damage-ledger charge and 1,961 final life after regeneration at tick 140. It does not simulate Dark Donald.

## Coverage levels and limitations

1. **State smoke:** each of the 134 nonnegative authored states is forced after a match reset, then stepped. Global -1/-2/-3 execute via normal ticks and are reported separately. Forced entry does not prove that CMD can naturally reach the state.
2. **Helper smoke:** all 24 authored helper-state definitions are spawned with valid parent/root, then stepped. A script-directed DestroySelf is not a failure. The full contexts of all 45 Helper controllers are not exhaustively reproduced.
3. **Animation smoke:** every unique authored AIR action is selected via ChangeAnim, a Core draw packet is generated, and at least one present source sprite is decoded where available. This does not compare all frame timing, color or pixel output.
4. **Controller recognition:** parser diagnostics and missing controller names are exposed. Every controller parameter and every trigger expression is not certified.
5. **Native comparison:** **not yet performed for this archive**. KFM's existing 147 verified scenarios and 16 interaction probes must not be relabeled as Rare Akuma parity.
6. **Performance:** no physical mobile GPU, audio or memory benchmark is included.

Promotion to full compatibility requires original MUGEN or IKEMEN GO captures using this exact ZIP, with both facings, command paths, hit/guard/KO, reversals, helper ownership, projectile collisions, sprite/palette identity, and cleanup compared tick by tick against Core.

The existing website and recovery engine remain untouched until this review branch is validated.
