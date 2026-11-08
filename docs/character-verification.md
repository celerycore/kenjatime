# Character verification against native IKEMEN

The shipping Go/WASM worker and Three.js renderer now have an independent
character verification suite. It runs the same resources and timed command
inputs in the official Linux IKEMEN GO 1.0.0 executable and the built browser
app. The retired JavaScript `TrainingMatch` interpreter is not involved.

## Coverage and results

| Group | Scenarios | Compared simulation frames | Result |
| --- | ---: | ---: | --- |
| Classic Elecbyte CNS KFM | 147 | 12,854 | No differences; all planned move paths exercised |
| Official 720p CNS KFM | 147 | 12,857 | No differences; all planned move paths exercised |
| Authored combat interactions | 16 | 1,130 | No differences in quiet replay; four guard-distance frame differences under load |
| All 12 selected palettes, paired across both fighters | 6 | 48 | No differences; exact expected solid-color samples |

Each KFM plan covers all 36 literal CMD entry branches, both facings, duplicate
motion alternatives, standing/crouching/air attacks, specials and supers,
forward/back throws, a three-move chain and four insufficient-power refusals.
Eligible attacks also run at far spacing and against a guard attempt. This is
curated CMD entry coverage, not every possible cancel, timing, matchup or AI path.

The interaction fixture exercises direct hits and guarding; mirrored throws;
foreign states and `ChangeAnim2`; `AnimExist` versus `SelfAnimExist`; restoration
of the victim's own state/animation; helper attacks, guard proximity and inert
body pushing; projectile hit/guard/removal, simultaneous damage and cancellation;
pause allowances; a projectile outliving its helper; air recovery; `RemapPal`,
PalFX expiration and independent/inherited helper/projectile palettes.
Coverage checks reject unentered moves, missing contacts, wrong damage, unfinished
entities, missing recovery and absent ownership transitions, even when two traces
otherwise match. Both synthetic throws inflict their expected 60 damage.

The report compares every consecutive captured simulation tick. Fields include
states, animation elements/times, state and animation owners, life/power, control,
hit/guard/pause/recovery clocks, targets, variables, positions/velocities, facing,
helper identities/lifetimes, projectile identities/contact clocks/pause allowances,
palette selection/remapping and PalFX. Integers, booleans, ownership and clocks
must match exactly. Only coordinates/velocities allow an absolute `1e-5`
rounding tolerance. Missing/null fields, missing ticks, truncated cases,
different resources/inputs and an unpinned reference are rejected.

See [machine-readable evidence](character-verification-evidence.json) for native
release/executable hashes, input/resource hashes, capture results and corpus
inventory. Native baselines are committed under
[`test/fixtures/character-verification/native`](../test/fixtures/character-verification/native).

## Findings

**Disappearing projectile pixels are fixed in web/Android 0.4.4.** Discovering
an external index buffer's size changed a cached sprite VAO's element binding.
The lookup now restores the binding while retaining geometry/material reuse.
The new GPU regression fails before the fix with a missing green sprite and GL
error 1282; afterward both sprites and error status match the independent raw
WebGL path. The native framebuffer and browser now agree for both projectile
colors in the palette-ownership scene, including all six fighter/helper/shot
sample points. No new allocation loop or per-frame binding query was added.

**Projectile-retirement guard proximity remains open.** In a run under concurrent
load, the palette lifecycle scene cleared the opponent's `InGuardDist` at tick
40 in native IKEMEN and tick 44 in the browser. All other captured fields matched,
including the projectile count becoming zero at tick 37. The comparison reports
all four boolean differences; it does not apply a timing tolerance or discard
the field. Source inspection finds projectile animation advancement inside
`Projectile.cueDraw`, while `System.cueDraw` returns early for skipped render
frames. That is a concrete lead for a separate simulation/rendering timing fix;
this update does not change Go combat scheduling to conceal the discrepancy.
The interactions CI job is explicitly advisory until this timing gap is resolved;
the runner itself still exits unsuccessfully when it reproduces a difference.

## Reproduce

Use Node 22+, Python 3.12+, Chromium/Playwright and Pillow:

```sh
npm ci
npm run build
pip install playwright pillow
python -m playwright install --with-deps chromium
npm run test:characters
npm run verify:characters -- --profile full --browser-only
```

Browser replay uses independently captured, read-only native baselines. It
checks the full production worker/Three path, not an alternate diagnostic
renderer. Groups continue after comparison failures, and the final exit status
remains nonzero if any group fails. Results, raw traces and screenshots go to
`work/character-verification/`. CI runs groups separately and uploads evidence
even for failures.

For a fresh independent native capture, Linux also needs X11, a C compiler and
the SDL/OpenGL dependencies required by the official release:

```sh
xvfb-run -a npm run verify:characters -- --profile full
# Or use an existing display:
npm run verify:characters -- --group interactions --display :93
```

The first run downloads the official Linux release and requires SHA-256
`cc533c1a2ab84d63cbf9126d9dcb3f2dcc1a41c6206f2da419b0c91084f193e4`.
The executable is unmodified. A QA-only Common.Lua callback captures native
fields; an SDL swap hook reads its actual framebuffer for the pixel fixtures.
The browser mounts the same files in its real worker filesystem and returns
its own report and canvas pixels. Release, executable, raw capture, plan and
resource hashes identify what ran. GPU raw-reference mode is diagnostic only
and cannot publish conformance baselines.

Use `--write-baselines --baseline-dir work/new-native-reference` to capture new
references for review. The runner refuses to overwrite references, publish from
a browser-only/diagnostic run, or bless native captures with unexercised expected
moves. Inspect browser differences separately: a valid native reference can be
saved even when the browser comparison fails. Never regenerate references from
browser output to make a test pass.

Only neutral preparation states are forced. Tested moves use timed QA-only
`AssertInput` controllers and the original CMD/state code. KFM's opponent copy
changes only backward walking speed to zero for the stationary guard dummy.
The mirrored back throw uses a crouching victim, within the authored throw's
standing/crouching eligibility. QA input blocks occupy a separate injected
global state and unused literal variable slots. Characters with an existing
`-2` state are refused until an adapter preserves their authored global code.
Charged motions require explicit timed recipes instead of automatic conversion.

## Remaining character work

```sh
npm run inventory:characters -- --archive /path/to/character.rar
```

The source inventory also reads ZIPs and reports original script hashes,
duplicate command bindings, literal/expression-valued state entries, helpers,
projectiles, palette controllers, declared external ACT files and missing
resources. Embedded SFF palette verification is explicitly marked pending.
It never executes the uploaded scripts and never labels source counts as
runtime compatibility.

KFM, the supplied Tomoka RAR and the supplied Taiga RAR produced five definition
inventories. Tomoka has 132 command-entry controllers and 222 helper controllers;
the three Taiga definitions have 132/98/24 command entries. Their existing `-2`
states need preservation adapters, curated input/recovery plans and independent
native captures before claiming complete moveset verification. Script/report
snapshots for other supplied characters remain historical evidence.

The independent executable tested here is IKEMEN, not native MUGEN. Native
WinMUGEN/1.0/1.1 comparisons remain to be captured. The reference stage has a
fixed 320×240 camera, so these results do not certify scrolling/zooming cameras,
teams, every stage option or every character palette/blend variant. Entity
detail capture is bounded at 32 helpers/projectiles per fighter; these fixtures
use at most two. No physical Infinix/Android execution, audio improvement or
phone FPS measurement is claimed by this suite. Android packaging tests verify
that the APK contains the exact tested browser assets.
