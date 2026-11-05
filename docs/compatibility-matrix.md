# Character compatibility work queue

The target is native MUGEN character behavior, starting with the supplied MUGEN 1.1 beta 1 documentation. Recognition of a controller name is not evidence that every parameter or timing interaction works. The automated corpus includes classic/720p KFM, independently authored CNS/CMD/AIR fixtures, supplied Tomoka/Taiga import packs, a Shiki script/report replay and the Forest stage. Coverage is scoped to the exercised paths.

| Area | Current evidence | Remaining work |
| --- | --- | --- |
| Rendering performance / scheduling | Native Canvas blend composition, byte-bounded LRU assets, static parallax reuse, fixed 60 Hz ticks with retained debt, timestamped inputs and graphics presets have unit/browser coverage. See [measured performance](performance-baseline.md). | Physical Android profiling, extreme effect batching, dynamic BGPalFX cost and wider native visual comparisons. |
| Guard / damage / power | Guard during stun, posture changes, kill flags, rounded/scaled damage and healing, raw-damage power awards, CFG coefficients and super-pause defence are covered. See [combat rules](combat-rules.md). | Native rounding/phase captures, full guard/pause edge cases and remaining options. |
| Hit counters / priority / juggling | Distinct HitCount/UniqHitCount/combo totals, HitAdd target selection, full Hit/Miss/Dodge matrix, lethal trades, helper budgets and projectile-only juggle costs are tested. | Simultaneous multi-attacker/native override/reversal interactions and team combat. |
| HitDef `chainID` / `nochainID` | Collision and direct-contact tests cover matching IDs, two exclusions, intervening third parties, rejected contacts and projectile ownership. | Native frame captures for simultaneous multi-attacker interactions. |
| HitDef `hitonce` | Tests cover nearest eligible target, throws' default, explicit override, guarded contacts, target/ID dropping and persistence. Projectile lifetime retains `projhits` behavior. | Native traces for reversal/override and team interactions. |
| Hit clocks / `CanRecover` | Tests cover fall time during hitshake, global-pause freezing, zero-to-minus-one hit-time expiry and recovery permission. | Exact native phase ordering across every controller/state transition. |
| Liedown recovery | Engine countdown and automatic 5110→5120 transition, fresh physical-input acceleration, held-input handling and KO exclusion are tested. | Exact native random sequence, repeated-bounce shortening and configuration/version edge cases. |
| GetHitVar / KO | IDs, posture type, physical impact count, fall count, recovery clocks and mixed-unit vectors have focused tests. KO forces falling/non-recovery and adds flight velocity; legacy velocity-add getters remain zero. | Native trajectory/phase captures and version-specific quirks; see [combat evidence limits](combat-rules.md#legacy-quirks-and-evidence-limits). |
| Common hit states / falling | Imported `common1.cns` runs. Stock recovery defaults now support legacy characters that omit modern constants; Shiki script/report and foreign-state browser reproductions land and recover. Fallback shake/slide/flight, guard, trip/down/bounce, lying and recovery phases are tested. Fall damage is consumed once and fall defence stacks/reset independently. | Full native animation/recovery variants, repeated-bounce recovery shortening/invulnerability and exact native timing. |
| Expressions / triggers | Signed 32-bit integers, single-precision floats, promotion, eager bottom propagation, conditional evaluation, native argument counts, name/type clauses, missing-player rules and mixed units are tested. | Native numeric boundary/transcendental captures, broader constant/trigger/version inventory and real-character cases. |
| Controller execution / parameters | Constant-only universal flags, contiguous trigger groups, required basic parameters, parameter bottom-to-zero, once-per-activation target/range values, alternate variable indices, state-entry persistence expressions and HitOverride cancellation have focused coverage. [Edition 18](custom-state-palette-accuracy.md) adds controller-identity persistence, destination ctrl ordering, Width defaults and animation fallbacks. | Remaining conditional parameters/defaults and native phase/version captures. See also [script semantics](script-semantics.md). |
| Bindings / helpers | Lifecycle, orphan effects, binding, helper input and mixed units have coverage. Enemy helper body pushing, Clsn2/size overlap, wall displacement, independent camera axes and hitpause-preserved flags are tested. See [entity edges](helper-projectile-edges.md) and [interactions](helper-projectile-interactions.md). | Native multi-body coincidence/corner ties, deprecated player-type helpers, palette/version quirks and broader character captures. |
| Guard proximity | Collision-pass InGuardDist covers roots, helpers and projectiles, facing/strict forward bounds, affectteam, inactive/exhausted/removing shots, defaults/AttackDist and creation/state units. CNS reads the preceding collision pass. | Independent native phase/version captures and broader real-character cases. |
| Projectiles | Simultaneous root/helper contacts share one quota/cooldown; per-defender projectile contact immunity, nearest Clsn2 clashes, pending hit removal, advancing pause allowances, boundary/loop expiry and finite/infinite removal have unit/browser coverage. Ownership, IDs, shadows and earlier lifecycle cases remain covered. See [interactions](helper-projectile-interactions.md). | Native frame offsets, cancellation chains/expiry collision quirks, zero-duration AIR elements, pause-spawn behavior, foreign sprite/palette ownership, reflections and version captures. |
| Custom states / mixed units | 320/640/1280 fixtures and supplied KFM throws cover ownership, restoration, units, AIR offsets and collisions. Edition 18 tests retained foreign AIR, AnimExist/SelfAnimExist, control precedence and separate victim SFF/palette pixels. See [accuracy pass](custom-state-palette-accuracy.md). | Wider character corpus and native per-frame comparisons. |
| Palettes / visual effects | SFF/ACT, fresh independent PalFX, working-palette families, creator-owned projectile colors, validated/nontransitive remaps, palette limits, blending, afterimages, Explods and XYZ rotations have unit/browser coverage. See [accuracy pass](custom-state-palette-accuracy.md). | All native ordering/sharing/media variants and edge cases. |
| Physical controllers | Standard USB/Bluetooth Gamepad API inputs, DualSense labels, player assignment, remaps/deadzone persistence, sparse/reconnected devices, two-player combat and ForceFeedback routing have unit/simulated-browser coverage. See [stages/controllers](stages-controllers.md). | Physical PS5/Android/USB/Bluetooth checks, hardware/browser mappings and haptics; adaptive triggers/LEDs/speakers are not implemented. |
| Teams | Single mode works. | Simul/Turns, real partners/enemy lists, team targeting, scoring and persistence. |
| Stage / match integration | Bounded stages/camera/zoom and scored two-player rounds are tested. Edition 20 adds a visible stage library/Add stage chooser, legacy hires background scale and adjacent packed music resolution. Forest of King Cruel sprites/animation/MP3 and equivalent low/hires camera pixels have browser coverage. See [stages/controllers](stages-controllers.md). | Remaining native stage/camera options, complete configuration and motifs. |
| Version compatibility | 1.1 examples and selected legacy defaults work. | Systematic WinMUGEN/1.0/1.1 differences; no blanket legacy certification. |
| Loading / performance | ZIP/RAR4/RAR5 imports retain 128 MiB compressed/512 MiB expanded/5,000-entry bounds. Worker decoding, transferred buffers, mobile providers, real Tomoka/Taiga archives, 40.56 MiB RAR and 55.56 MiB ZIP fixtures are verified on the shared Classic Arena too. See [Edition 19](rar-classic-landing.md). Sprite/effect caches remain bounded. | Streaming archive reads, lazy media decoding, larger real-character stress profiles and physical-device memory checks. |
| Native engine comparison | Replay exporter and field-by-field baseline comparator are available. | No independently captured native-engine baseline is bundled; native execution is not part of this tool. |

## Repeatable workflow

1. Reduce a character failure to a replay with the original files or a clearly labelled synthetic fixture.
2. Identify the native version, parameter defaults and expected behavior from the native docs and captured native play.
3. Implement the behavior, preserving failed-contact and pause/state semantics.
4. Add a regression that exercises import → CMD → CNS → collision/clock → reported result. Check browser rendering when affected.
5. Replay the same inputs in native MUGEN. Compare sampled frames and record differences before claiming native equivalence.
6. Update this matrix with evidence and any remaining interactions. A clean replay is evidence only for its exercised paths.

## Replay and compare

Run the bundled walking/light-punch scenario:

```sh
npm run compatibility -- --output work/kfm-current.json
```

Use a full distribution or another character pack and an explicit scenario:

```sh
npm run compatibility -- --archive /path/to/mugen.zip --scenario /path/to/scenario.json --output work/current.json
```

Scenarios use the format in `test/fixtures/compatibility/kfm-punch.json`. Optional `player`, `opponent` and `stage` fields select exact normalized archive paths. `setup` can set each side's `stateNo`, `pos`, `facing`, `life` and `power`; optional `rules` enable scored rounds. Input keys are physical `U D L R a b c x y z s`, sampled once per simulation tick through the real CMD buffers. Tick 0 starts at the configured controllable state, after native intros have been aligned separately.

The report includes archive/scenario SHA-256 hashes, source inventory, resolved combat coefficients, diagnostics, per-frame fighter/hit variables, counters/damage multipliers, contacts and provenance. To compare it with a previously captured baseline:

```sh
npm run compatibility -- --archive /path/to/mugen.zip --scenario /path/to/scenario.json --baseline /path/to/reference.json --output work/comparison.json
```

Baselines use the report's `archiveSha256`, `scenarioSha256` and `scenarioId`, plus `samples` containing the fields actually captured. Every sample needs a unique tick and captured fighter/contact/round data. Numeric tolerance is 0.000001. The command exits 1 for differences and 2 for invalid input; it refuses to overwrite the baseline.

Native references require `provenance: {"kind":"native-mugen","version":"1.1b1","captureMethod":"description of the independent native capture"}`. Use the same character/common files, local coordinates, stage/round settings, input sequence and tick alignment in both engines. Web reports retain `kind: "web-runtime"`; synthetic expectations use `kind: "synthetic-test"`. Do not relabel a web report as a native capture. No replay result sets `completeCompatibility` to true.

The comparator can validate a web regression without a native executable. Native comparison remains pending until an independent native capture is supplied; this command does not launch `mugen.exe`.

## Browser combat check

With the dev server running, Python Playwright installed, and Chromium available:

```sh
python scripts/verify-combat.py
python scripts/verify-combat-rules.py
```

`CHROMIUM_PATH` overrides `/usr/bin/chromium`; `MUGEN_TEST_URL` overrides `http://127.0.0.1:5173/`. This check builds an independent combat-script fixture using the bundled KFM sprites, imports it through the UI, presses keyboard controls, downloads reports and verifies chains, forbidden follow-ups, nearest-target throws, liedown input acceleration and air recovery. Results and a screenshot go into ignored `work/`. It also checks browser errors and 390px layout. The fixture is a synthetic regression, not a native engine capture.

The combat-rules browser check additionally covers configured power, repeated guarding during stun, posture changes, trip/down/bounce phases, KO flight and legacy None contacts. Its default URL is `http://127.0.0.1:5186/kenjatime/`; set `MUGEN_TEST_URL` for a different server.
