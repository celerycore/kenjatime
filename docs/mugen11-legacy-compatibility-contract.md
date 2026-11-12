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
