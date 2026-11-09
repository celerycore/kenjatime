# Rare Akuma, June 21 2026 — independent IKEMEN GO compatibility benchmark

This is a **separate, asset-free** benchmark from the older 2007 Rare Akuma archive in PR #2.
The author release says IKEMEN GO >=0.99 and uses ZSS. The user-supplied
`RareAkuma.zip` SHA-256 is:
`c626441be701eb104f20b5a5673ab9078555bfad17b298256daf4fcb5d9e349b`.

Do not commit or redistribute the character sprite, sound, script, or palette binaries.

## Reproduce

```sh
npm ci
MUGEN_RARE_AKUMA="/path/RareAkuma.zip" npm run benchmark:core:rare-akuma-2026

# Bounded longer smoke probe (run shard 0, then 1 ... through 7):
RARE_AKUMA_TICKS=60 RARE_AKUMA_SHARDS=8 RARE_AKUMA_SHARD=0 \
  CORE_RARE_2026_OUTPUT=work/core/rare-akuma-2026-shard0.json \
  MUGEN_RARE_AKUMA="/path/RareAkuma.zip" npm run benchmark:core:rare-akuma-2026
```

The report includes the **complete original ZIP SFF** per-record decode result,
plus AIR sampling and forced root/helper entry results. Strict mode
`RARE_AKUMA_STRICT=1` fails on engine parse/entry/clock exceptions.
**Source-absent graphics must be classified separately** — do not replace pixels
or claim a full render on a successful ChangeAnim call.

## Verified exploratory observations (the supplied exact archive)

| Check | Result |
| --- | ---: |
| Authored ZSS states | 222 (four negative global states) |
| Nonnegative forced-root state entry and 60 simulation ticks | 218 / 218 |
| Authored helper state spawn and 60 simulation ticks | 54 / 54 |
| Unique AIR action IDs, 120 frame-clock advances each | 327 / 327 |
| Controller type names recognized by Core | 73 / 73 |
| Decoded SFF records | 949 / 956 |
| Embedded PCX records with truncated source RLE | 7 |
| AIR actions entirely referencing absent source sprites | 3: 1338, 8980, 8989 |
| Fully negative/invisible AIR actions | 5: 75, 1605, 1650, 4906, 9999 |
| CPU-vs-KFM deterministic integration run | 3,600 ticks / 102 contacts |
| Peak live helpers / projectiles in that CPU run | 6 / 27 |
| Unhandled runtime exceptions or NaN positions in those probes | 0 |

The seven source-truncated SFF pairs are:
`1005,2` (SFF index 585), `3305,3` (599), `4110,6` (619),
`4110,9` (622), `7181,8` (646), `7200,5` (894), `7200,10` (899).
They are referenced in AIR actions 1005, 1006, 1015, 1025, 3305, 4110,
7181 and 7200. RLE data ends before the height/stride declared by its own PCX
header. This is a distinct issue from missing SFF pairs.

## Core features added for 2026 IKEMEN GO

- ZSS accepts intentionally empty controller parameters including `HitOverride attr`.
- Global StateDef `-4` schedules for fighters/helpers during Pause/SuperPause.
- RootMapSet / RootMapAdd; ModifyPlayer pause windows; VarSet sysv/sysfv.
- Chained IKEMEN trigger redirections; `redirectid: p2, ID` as a single expression.
- ReversalDefAttr; FIfElse; InputTime directional case folding and held/released duration.
- AILevelF, GameMode, InCustomState, Standby (two-player fallback), PauseTime,
  Attack, Defence, SprPriority, ReceivedHits and ReceivedDamage.
- Helper `immortal` and initial `map.*` attributes; AssertSpecial animfreeze.

## Not yet certified for native IKEMEN parity

Successful forced entry proves only bounded **no-exception** execution, not correct
hit timing, sprite pixels, sound, 3D draw order, 60 FPS on mobile, or move-input
reachability. Native IKEMEN GO per-tick captures from this same archive were **not**
provided. The 3,600-tick CPU run still records unresolved missing common fightfx
animations `0`, `1`, `2`, `3`, `60`, and unsupported
`AssertSpecial globalnoshadow`. Some artificially forced root states also report
DestroySelf or Parent errors, as they are helper-context scripts.
The character does not bundle the full MUGEN common1.cns/fightfx resource set;
no substitute source art or common effect assets have been created.

ZSS `+1` global state and full tag-team modes are outside this current
independent Core's tested support, and are not claimed to pass.

## CI

The new asset-free synthetic regression tests run with normal `npm ci` alongside
`npm run test:core` and `npm run test:core:compiled` in the Rare Akuma contract
GitHub Actions workflow. The original ZIP is required for the opt-in benchmark
and is intentionally **not** uploaded to CI.


## Core common-effects integration (this update)

Core now recognizes and renders imported MUGEN/IKEMEN shared effects. The implementation loads
`fightfx.air` and `fightfx.sff` from the selected `fight.def` motif or imported pack,
parses the authentic AIR action IDs, and uses their own SFF graphics for `Explod anim=F...`
and `GameMakeAnim` instead of dropping draw events. `common.snd` can be included for
`PlaySnd value=F...` requests. If the resources are absent, the engine reports them as
missing and does **not** manufacture source artwork.

To use this in the browser, import a ZIP retaining paths:

```
data/fight.def          # recommended (specifies [Files] fightfx.air / fightfx.sff)
data/fightfx.air        # required
data/fightfx.sff        # required
data/common.snd         # optional, for common SFX
```

The library accepts this ZIP even if it contains no character or stage DEF.
Under match setup, select the installed pack in the **Common effects** dropdown.
By default, a matching original effects set from the selected stage or character
package is used if one exists. The package remains separate from RareAkuma.zip.

`AssertSpecial globalnoshadow` is now recognized and propagated as the
match-wide `suppressCharacterShadows` render flag; **Core does not yet
implement native MUGEN/IKEMEN 2D player/Explod shadow rendering**, so shadow
appearance cannot be certified.

The seven truncated PCX records and three absent source animation sprites
are unchanged original-archive findings. The new loader does not and cannot
repair those character-specific pixels. A real IKEMEN GO 0.99+ reference
capture is still required for frame-by-frame collision, effects and audio parity.

## Additional native-behavior bridge

- HitDef contact sparks now select the original common `fightfx` or local
  character AIR action and SFF sprite for hit and guard separately, respecting
  `sparkno`, `guard.sparkno`, local `S` selectors and `sparkxy`. When missing,
  the engine emits a specific diagnostic; its legacy GPU flash is fallback
  presentation **not** native sprite parity.
- HitDef's explicit hit and guard sound pairs are routed to the same character
  or original common sound bank as regular `PlaySnd`.
- `GameMakeAnim` and HitDef impact effects have bounded lifetimes, including
  effects whose AIR actions contain indefinite frames, to avoid an unbounded
  long-fight renderer allocation.
- Standard MUGEN ground-fall recovery states 5200/5201 are included as
  independently authored common states, rather than incorrectly treating
  every fall recovery as the airborne 5210 state. Native per-frame
  compatibility still requires a reference capture.
- The standard IKEMEN tag `StateTag*` values are now available via `Const`
  as constants. This does **not** implement full tag-team gameplay.

The Core test suite, compiled-expression test suite, build and browser
verification run on GitHub Actions for this review branch. These checks are
independent of the opt-in original RareAkuma.zip replay; they do not assert
100% native IKEMEN GO compatibility.
