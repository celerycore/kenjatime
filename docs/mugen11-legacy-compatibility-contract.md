# Kenjatime Core — legacy M.U.G.E.N 1.1 compatibility contract

**Status:** ADOPTED AS TARGET — **NOT YET CERTIFIED**  
**Baseline:** Elecbyte **M.U.G.E.N 1.1 Beta 1 P1 (2013)**  
**Source:** *Cross-Platform M.U.G.E.N / IKEMEN GO Engine Blueprint*, §1–2, pages 1–2 (provided by project owner).

## 1. Version policy

1. M.U.G.E.N 1.1 is the authoritative *legacy behavior target* for the
   clean-room Kenjatime Core. WinMUGEN/1.0 content is evaluated under the
   1.1 compatibility baseline; an author's DEF `mugenversion` field is
   metadata, not a reason to silently change the engine's physics.
2. Priority when a rule differs: **observed MUGEN 1.1 behavior first**;
   documented 1.1 behavior second; IKEMEN GO behavior only for extensions
   or a separately selected dialect. A MUGEN-compatible trigger must not
   change meaning just because a ZSS file exists.
3. IKEMEN GO ZSS, Lua, extended globals/trigger syntax and tag/simul
   team logic are **additive compatibility areas** with separate coverage
   and testing. They are **not evidence of MUGEN 1.1 parity**.
4. The PDF describes MUGEN Unleashed as a behavioral source for precise
   math and quirks and IKEMEN GO as the open modern extension reference.
   Treat these as **reference specifications**, not code to copy from a
   reverse-engineered proprietary executable. Original Elecbyte source
   has not been released. Respect each project's licensing and do not
   embed copyrighted character packs or engine executables.
5. The project never advertises "100% compatible" without
   independent conformance evidence. Passing Kenjatime vs. Kenjatime
   deterministic replays is useful but **not** native MUGEN parity.

## 2. Acceptance matrix

| Domain | MUGEN 1.1 baseline requirement | Verification gate |
| --- | --- | --- |
| 60 Hz simulation | 1 authored logic step per 1/60 s, independent of render FPS | Deterministic frame-cadence and timing regressions **present**; native trace still pending |
| CNS/CMD | MUGEN 1.1 parsing, state-file order/precedence, trigger short-circuiting, `persistent`, `ignorehitpause`, `-1/-2/-3` execution | Native matched trace suite **pending** |
| Numeric behavior | Float precision and rounding, conversion, velocity/gravity/friction, collision integer boundaries | Native frame-by-frame numerical oracle **pending** |
| Helpers | Controller triggers, IDs, helper ownership, spawn positions, state owner, animation, lifetime, `numhelper`, visibility, helper saturation | Synthetic helper spawning/draw-list regression **added**; genuine Tomoka assists **pending** |
| Projectiles/hitdef | Collision boxes, move priority, hitpause, juggle, guard, custom state interaction | Matched trace and hitbox regression **pending** |
| Round flow | Intros, roundstate, timer, KOs, win/lose and outro controller order | Native timing trace **pending** |
| Files and assets | DEF/AIR/SFF v1/2, palettes ACT, SND, PCX/PNG decoding and native draw/animation semantics | Original-asset pixel comparison and failure log **pending** |
| Camera/stage | 4:3 native-style coordinate parity, backgrounds, stage boundaries, zoom | Original MUGEN 1.1 screenshot/position comparison **pending** |
| IKEMEN extras | Extensions must not redefine a verified MUGEN CNS behavior | Separate IKEMEN tests, **not** counted as MUGEN certification |

`LEGACY_COMPATIBILITY_TARGET` and `CoreSession.capabilities` expose
`mugen-1.1`, `target-unverified`, `nativeMugen11Certified:false`.
They must not become `certified:true` automatically when parsing succeeds.

## 3. Gold-reference capture and comparison

Comparison command:

```sh
node scripts/core/compare-mugen11-traces.mjs \
  /local/reference/mugen11-match.json \
  /local/kenjatime-match.json
```

The native reference must be captured independently from a legitimately
obtained **M.U.G.E.N 1.1 Beta 1 P1** installation or equivalent
user-provided verified evidence. The comparison tool **does not** supply
or run that binary. Both inputs have `{"ticks":[...]}` structure.
Capture fields are defined in `captureLegacyTraceTick(match)`:
tick/round timing, all actors including **helper IDs/parent IDs**,
states and animation frame indexes, positions and velocities, life/power,
hitpause/visibility, and projectile coordinates.

Use the same character archives and exact versions, selected palettes,
stage, game speed, random seed, initial health, input stream and
round/AI settings. The comparator stops at the **first exact mismatch**
and exits nonzero. A mismatch is actionable; a match is *evidence*, not
by itself certification or proof of the reference's authenticity.

**Important:** Native coordinate origins, fixed/float precision,
ordering and asset provenance must be normalized explicitly by the
capture adapters, not massaged by the comparator or tolerance defaults.
Do not quietly round away differences to get a green build.

## 4. Priority characters and regression scenarios

1. **Tomoka** (both owner-supplied archive variants): compare authored
   helper triggers and visible assist animations to native 1.1, then
   ensure rendered sprite and palette exist. Some controllers are
   intentionally invisible; a missing visible assist requires evidence
   of where the pipeline failed.
2. **Kung Fu Man**: stable smoke, basic CNS/animation/physics and
   random-seeded state replay. Synthetic fixtures alone are not proof
   of Tomoka or native behavior.
3. **Dark Donald and Rare Akuma**: helper/projectile-heavy AI, intros,
   custom states, unexpected KO/health behavior and effect density.
   Test original versions, not renamed or simplified substitutes.
4. Track distinct native-1.1 and IKEMEN-GO expectations where they
   disagree. Do not apply an IKEMEN-specific workaround globally.

## 5. Release gates

A MUGEN 1.1 native-parity claim requires documented oracle provenance,
per-tick trace equality in representative matches, helper lifecycle
coverage, original sprite/audio output comparison, and real-device
regression results. Keep unresolved rules visible in the compatibility
audit rather than claiming success. Kotlin/Wasm remains experimental
until its behavior matches the proven JavaScript baseline.

The shipping arcade remains a separate release until these tests pass.


## 6. State and helper parity milestone (November 12, 2026)

- **Corrected:** MUGEN 1.1 Helper `postype=p2` now spawns from P2 X/facing
  but retains the spawning player's Y origin; single-component offsets no
  longer fail during vector unpacking. Projectile semantics are unchanged.
- **Compatibility extension:** When a nonstandard `bindtime` is used with
  `postype=p2`, the helper retains its original Y on the first bound tick,
  then follows the target's later Y motion without teleportation.
- **Verified by tests:** Normal helpers do not run root `-3` or `-2`;
  only helpers with `keyctrl=1` inherit root `-1`. A ChangeState
  controller skips remaining old-state controllers; the new state executes
  within the same logic tick. `persistent=0` only fires once per state
  entry. Root-owned and nested helper IDs/counts remain distinct.
- **Runtime diagnostics:** `CoreSession.snapshot()` exposes
  `helperStats` (attempted, created, rejected, missingState, destroyed,
  peak), `helperFrameStats` (alive, hidden, submitted, missingAnimation,
  missingSprite), and `helpers` (ID, helper ID, parent, root, active
  StateDef/animation/frame and world coordinates). These are intended to
  distinguish failed spawn/state execution from actual drawing faults.
  Last-frame sprite submission **does not** prove WebGL actually displayed
  an indexed texture; also check the renderer's missing-texture/palette
  counters.
- **Owner-supplied Tomoka assets:** Static review of two locally provided
  archive variants confirms helper-rich scripts and authored assist states.
  TornilloOxidado's variant uses standard controller types in the scanned
  scripts. Infantry00's variant includes three `Zoom` controller usages
  that are not implemented by the current Core. These are documented
  gaps; neither archive has been verified against a native MUGEN 1.1
  frame-by-frame runtime oracle. Keep the original archives unmodified and
  outside GitHub.

### Interpreting helper counters

1. `attempted=0`: State controller conditions or move selection never
   requested a helper. Check the authored negative states, trigger results,
   game mode and AI commands.
2. `attempted>created`: Creation failed. Check `rejected`,
   `missingState` and emitted controller diagnostics.
3. `created>0` with active helpers but `submitted=0`: Inspect explicit
   `AssertSpecial invisible`, missing AIR frames and missing SFF sprites.
4. `submitted>0` but no visible assist: Inspect palette bindings, GPU
   residency, current animation transparency, world coordinates and stage
   foreground layering.

**Release status:** State/helper synthetic regressions pass; exact MUGEN 1.1
native parity and original Tomoka assist playback remain unverified.


## 7. State-controller persistence and global-state audit (November 12, 2026)

**Confirmed from Elecbyte's 2013 MUGEN 1.1 CNS documentation:**

- `persistent=0` triggers only on the first successful evaluation during each
  state entry. `persistent=1` triggers on every successful evaluation.
- `persistent=N` for N greater than 1 triggers on every Nth successful
  evaluation (**N, 2N, 3N**, not 1, N+1, 2N+1). False trigger evaluations
  must not advance the counter; re-entering a StateDef restarts its counters.
- Duplicate ordinary global StateDefs `-1`, `-2`, `-3` are potentially
  nonportable under MUGEN 1.1. The parser now reports
  `mugen11-duplicate-global`, and the compatibility report publishes
  `duplicateGlobalStates`. The Core's current duplicate-state precedence
  has deliberately not been changed without matched native evidence.
  IKEMEN GO extensions `-4` and `+1` remain distinct and are not
  conflated with MUGEN 1.1 legacy global states.
- `Helper postype=p2`: if P2 is missing or destroyed, spawn relative
  to the caller instead, and report `missing-player`. Normal P2 X/facing
  and P1 Y semantics remain unchanged. No proprietary MUGEN binary is
  bundled or run.

Regression fixture:
`node --test test/core/mugen11-state-helper-parity.test.js`

**Scope limitation:** These tests verify the documented per-controller
behavior in Kenjatime's synthetic matches. A verified MUGEN 1.1 reference
runtime trace for Tomoka, Rare Akuma and KFM is still needed before any
native-behavior conformance certification.


## 8. Helper bindings and parent-variable parity (November 12, 2026)

- `BindToParent`, `BindToRoot`, `BindToTarget` and `TargetBind`
  now treat `time=0` as zero remaining binding ticks. An existing
  attachment is released instead of becoming permanent. `time=-1`
  remains indefinitely bound and positive times remain finite.
- `ParentVarSet` and `ParentVarAdd` may write the immediate parent's
  ordinary integer/float work variables, but MUGEN 1.1 explicitly
  prohibits `sysvar`/`sysfvar` assignment in these controllers.
  The Core now rejects forbidden mixed controllers atomically with a
  `mugen11-parentvar-system` diagnostic, without partially modifying
  parent variables.
- Synthetic nested helper tests cover recursive and non-recursive
  `DestroySelf`, immediate detachment of bound children, preservation
  of surviving helper identity and `NumHelper` behavior.
- Custom-state regression confirms that a borrowed `ChangeState`
  stays in the attacker-supplied CNS, while `SelfState` returns the
  victim to its own state data.
- Optional native-oracle tick traces now record `stateOwnerId`,
  `animationOwnerId`, `ctrl`, `keyCtrl`, `boundTargetId`, and
  `bindTime` per actor. These are specifically for comparison of
  invisible assists and borrowed states. Existing reference JSON files
  need equivalent native fields to compare exactly.

**Tests:** `node --test test/core/mugen11-binding-parentvar-parity.test.js`.

These tests verify documented behavior in synthetic Core fixtures, not
complete matching to a native MUGEN 1.1 executable. Verified original
Tomoka, Rare Akuma, and other helper-heavy native traces are still required.


## 9. Native TargetState / SelfState / ChangeAnim2 comparison gate (November 12, 2026)

- A **documented mismatch was corrected**: `TargetState` accepts
  `value` and optional hit `ID` in Elecbyte 1.1, **not** `ctrl`. The
  Core ignores authored `ctrl=` with a compatibility diagnostic rather
  than changing captured P2 control. Destroyed targets cannot be
  transitioned before end-of-frame cleanup.
- Original synthetic attacker/victim and P2-owned helper fixtures now
  test ID filtering, borrowed state ownership, `ChangeAnim2` selecting
  P1 AIR action 9100 element 2, borrowed `ChangeState` continuity and
  `SelfState` returning P2 to its own StateDef 0 and AIR.
- `npm run verify:core:mugen11-customstate` tests these rules and
  native **evidence validator logic**. A separate CLI exports a
  deterministic, clearly labeled **Kenjatime synthetic candidate**
  timeline; it cannot generate native MUGEN observations.
- A lawful native 1.1 probe is documented in
  `docs/mugen11-targetstate-native-oracle.md`. Its original CNS/AIR
  appendices are in `test/native-mugen11-targetstate/`. Compare only
  observations genuinely collected from native MUGEN 1.1 Beta 1 P1;
  the optional oracle gate requires executable/asset SHA-256 provenance
  and does exact observed-field comparisons by actor role/tick/phase.
- **No native executable or native trace is available in the supplied
  resources.** Therefore the actual native comparison, original
  Tomoka assist playback parity and complete MUGEN 1.1 conformance
  remain **UNVERIFIED**. Mock provenance tests never count as proof,
  and a single matching reference never certifies the whole engine.

## 10. StateDef facing and same-tick target lifecycle (November 12, 2026)

- **Refinement, not a new feature:** Core already executed the MUGEN 1.1
  `StateDef facep2` entry operation. It now avoids using a destroyed
  opponent and leaves facing unchanged if P1/P2 X axes are identical
  (the direction is undefined at equal X). This also applies to
  attacker-owned borrowed states and helpers spawned into such states.
- **Live target counts:** `NumTarget` with no ID now excludes targets
  destroyed earlier in the same tick, matching the existing filtered
  `NumTarget(ID)` behavior. The target ID redirection, `BindToTarget`,
  and `TargetDrop` also skip dead targets immediately, so a destroyed
  first target does not hide a surviving helper with the same target ID.
- **Regression:** `node --test
  test/core/mugen11-facep2-target-lifecycle.test.js` tests state entry
  facing on either side, omitted/zero `facep2`, overlapping actors,
  missing/dead P2, borrowed victim state ownership, helper entry,
  pre-cleanup target counts and target selection.
- Official Elecbyte docs: CNS 1.1 `facep2` (state entry) and Trigger
  Reference 1.1 `NumTarget` (current living targets). Tests validate
  these edge cases in Kenjatime synthetic fixtures; no independent
  native screenshot/trace is bundled. Full MUGEN 1.1 parity remains
  **UNVERIFIED**.


## 11. TargetDrop random retention for multi-victim helpers (November 12, 2026)

Elecbyte's MUGEN 1.1 `TargetDrop` documentation specifies
`keepone = 1` retains **one randomly chosen target** when multiple
captured opponents share the requested `excludeID`. Kenjatime previously
retained the first target every time, which biased multi-hit grab/assist
behavior toward the oldest target.

- `TargetDrop` now chooses a member of the matching live-target set
  using the actor's seeded deterministic random trigger.
- With `keepone=0`, all matching live targets are retained; with
  `keepone=1` and zero or one candidate, no RNG draw is consumed.
- The controller still drops target-ID mappings for all unselected targets.
- Synthetic regression scenarios verify random selection across multiple
  seeds, deterministic replay for identical seeds, single-target and
  no-target behavior, `keepone=0`, and proper helper target-ID cleanup.
- The choice is **randomized according to the documented behavior** but
  the generator's bit-exact native MUGEN 1.1 RNG stream and consumption
  schedule have **not** been independently validated. A native oracle
  capture is still required before claiming RNG parity.

**Test:** `node --test test/core/mugen11-targetdrop-selection.test.js`

**Reference:** Elecbyte 2013 MUGEN 1.1 State Controller Reference,
`TargetDrop` section.


## 12. HitDef p2stateno / p2getp1state ownership and HitOverride (November 12, 2026)

**Documentation-backed:** Elecbyte's 2013 1.1 HitDef rules define `p2stateno`
as a custom hit-state entry point. By default P2 reads P1's CNS and
animation resources. Explicit `p2getp1state=0` instead selects P2's
own state bank. **Without a valid `p2stateno`, `p2getp1state` must be
ignored**. The previous Kenjatime `HitOverride` eligibility check could
reject an ordinary hit because an orphan `p2getp1state=1` was authored.

- Corrected the pre-hit override eligibility condition: borrowed P1
  state protection now applies only when `p2stateno >= 0` and the
  corresponding `p2getp1state` is not zero. A bare `p2getp1state=1`
  does not turn an ordinary HitDef into a custom state.
- Existing foreign hit-state execution retains the HitDef's **actual
  executing state owner**, which may be a nested helper rather than the
  root fighter; `p2getp1state=0` continues to pick P2's own CNS.
- New synthetic fixtures check default foreign state ownership,
  local-victim override, helper attacker ownership, the orphan-flag case,
  live HitOverride precedence, and safe missing-state rejection.
- Elecbyte's 1.1 HitOverride documentation separately describes
  protection against attack HitDefs with `p1stateno` or an active
  foreign-state takeover. That protection remains in place.
- **Native parity remains unverified:** tests exercise a synthetic
  Kenjatime match and no native M.U.G.E.N 1.1 executable is run or
  included. P1/P2 custom state timing, native hitpause, and
  hit/collision-specific trace matching remain separate work.

**Test:** `node --test test/core/mugen11-hitdef-p2-customstate.test.js`.

## 13. Successful HitDef P1 transitions and authored destination movetype (November 13, 2026)

The MUGEN 1.1 HitDef reference specifies that `p1stateno` changes the
successful attacker's state to an attack state (`movetype=A`) and
`p2stateno` enters P2 into a custom get-hit state (`movetype=H`)
using P1 state data by default. Those are **authoring requirements**,
not a license for the engine to force the destination to `H` after
the authored StateDef has already executed.

- Previously `receiveHit()` called `changeState()`, then unconditionally
  reset the victim's `moveType` to `H` even if the new StateDef
  explicitly specified `movetype=I` or `A`. This corrupted
  intentionally nonstandard `HitOverride`/armor states.
- After a successful immediate state entry, the destination
  `StateDef movetype` now remains authoritative. If the state is missing,
  retain a conservative `H` fallback and a diagnostic.
- Ordered 60 Hz simulation may defer actual state entry until the next
  actor phase. Until that occurs, the victim remains temporarily
  `movetype=H`, then adopts the requested StateDef's own movetype.
- Regression coverage validates successful `p1stateno`, no attacker
  transition on guard, normal hit-state `H`, explicit custom state
  `I/A`, `HitOverride` armor `I`, a helper-owned HitDef whose
  animation is selected through `ChangeAnim2`, and ordered-phase entry.

**Test:** `node --test test/core/mugen11-hitdef-p1stateno-movetype.test.js`.

Native Elecbyte 1.1 tick-for-tick `p1stateno` / `p2stateno`
animation and hitpause timing remains **UNVERIFIED** until original
reference traces are captured independently.


## 14. HitDef P1/P2 throw oracle trace fields (November 13, 2026)

`captureLegacyTraceTick(match)` remains an **opt-in diagnostic API**,
never invoked as a permanent production per-frame sampler. It now includes
the following per-actor fields beyond state and animation ownership:

- `hitShakeTime`, `hitTime`, and `hitId` describe the received hit
  and allow comparing observable MUGEN `GetHitVar` / hitpause values.
- `pendingStateNo` and `pendingStateOwnerId` identify deferred
  custom hit-state entry in Kenjatime's 60 Hz ordered phase scheduler.
  **These are internal diagnostic fields, NOT values directly observable
  in native MUGEN**. They must be excluded from any native-reference
  comparison unless separately instrumented and verified.
- Distinct helper and root owner IDs expose when the hit-defining
  assist, rather than its root, owns P2's borrowed state and AIR.
- Synthetic tests check immediate hitshake/HitID accounting, queued
  P2 state/owner, deferred-entry completion and helper-owned throws.

This improves the evidence capture toolkit but **does not** provide
a reference trace from the real Elecbyte 1.1 Beta 1 P1 runtime.
Actual native contact timing, hitpause and custom AIR frame matching
remain **UNVERIFIED**.
