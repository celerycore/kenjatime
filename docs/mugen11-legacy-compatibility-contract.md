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
