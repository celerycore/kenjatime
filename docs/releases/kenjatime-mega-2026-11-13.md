# Kenjatime Mega Update — MUGEN 1.1 + R8

**Bundle:** `kenjatime-mega-2026-11-13`  
**Release source:** `feature/r8-benchmark-preview-20261112`  
**Main Core parity baseline:** `feature/kotlin-wasm-blueprint-20261111`  
**Published preview:** `https://celerycore.github.io/kenjatime/r8-benchmark/core/index.html`  
**Certification:** **MUGEN 1.1 native parity NOT VERIFIED**.

## What "one Mega Update" means

The compatibility fixes were already individually merged through PRs #22–#43.
This release combines those source changes and the existing R8 performance
pipeline into **one tested release bundle**, governed by
`releases/kenjatime-mega-2026-11-13.json`. It does not rewrite existing
GitHub history, delete review records, or merge the experimental R8
renderer wholesale over the production arcade.

The shared `src/runtime.js`, native parity compatibility contract, and
HitDef state regression fixture were synchronized from the current main
Core development baseline. R8-specific `src/combat.js` pre-fight freeze,
GPU-residency renderer, importer, CoreSession and benchmark UI were
retained; they must **not** be replaced by their non-R8 equivalents.

## Consolidated MUGEN 1.1 compatibility

| Area | Implemented and regression-tested |
| --- | --- |
| State scheduling | Root -1/-2/-3 behavior, keyctrl gating, ordered ChangeState, controller persistent=N, duplicate global StateDef audit |
| Foreign state and AIR | TargetState hit-ID selection, SelfState recovery, ChangeAnim2 action/element ownership, attacker versus victim state owner |
| HitDef / throws | p1stateno, p2stateno, p2getp1state, orphan P2 flag, HitOverride precedence, authored destination movetype, queued state entry |
| Helper semantics | Nested parent/root, helper spawn and postype=p2, ParentVarSet/Add restrictions, BindToParent/Root/Target, TargetBind, DestroySelf |
| Target semantics | Live NumTarget, Target(ID), destroyed-target exclusion, TargetDrop keepone random eligible target with seeded replay |
| Visual/round timing | Helper AIR/SFF visibility diagnostics, 60 Hz fixed simulation, R8 round/FIGHT freeze and post-banner hold |

## R8 features preserved in this release

Indexed R8 GPU textures and palette residency, adaptive resolution,
Android-friendly archive import with large characters, memory-budget
telemetry, missing sprite counters, Endless Mode/KO/reset stress
benchmarking, full 60 FPS simulation diagnostics, per-player and
per-helper state/AIR owner and hitpause/queued-StateDef CSV fields,
a verified browser test, and **R8-only** Pages publication.

Private Tomoka, Rare Akuma, Dark Donald and Nu-13 archive files are
**not** part of the source release.

## Single release manifest

`releases/kenjatime-mega-2026-11-13.json` is now the source for
published `build-info.json`'s feature list, release ID, date and
explicit `nativeMugen11Certified:false` /
`productionArcadeUpdated:false` flags. This prevents code and
published feature names from drifting apart. The integration tests
confirm that the manifest, runtime behavior and R8-only infrastructure
all exist together.

### Validation gates

The GitHub R8 pipeline requires:

1. `node --test test/core/mugen11-mega-integration.test.js`
   — combined TargetState → ChangeAnim2 → borrowed ChangeState →
   SelfState; helper ParentVarSet/binding/HitDef; deterministic
   TargetDrop; renderer/Android/fight-start preservation.
2. All focused MUGEN 1.1, KFM/legacy, GPU residency, mobile importer,
   hitpause, round/start tests, plus the **complete Core suite**.
3. Browser KFM smoke and benchmark/CSV export checks.
4. Production Pages file checksums; only `/r8-benchmark/` may
   be changed by the R8 workflow.
5. Public `/r8-benchmark/build-info.json` must identify the exact
   merged R8 source SHA and this release ID before the site is
   declared updated.

## Not yet proven

- No actual Elecbyte **M.U.G.E.N 1.1 Beta 1 P1** native reference
  trace for the new throw, HitDef, hitpause or helper-state scenarios
  has been supplied. The optional comparator and original native
  test inputs are tools, **not evidence that native runs occurred**.
- MUGEN's bit-exact random-number stream and contact timing remain
  unverified even when synthetic regressions pass.
- Original Tomoka assist display and Nu-13/Rare Akuma real-device
  performance still need archive tests after a new preview deployment.
- A merged source PR does **not** prove GitHub Pages published the
  latest assets. Verify both the GitHub Actions R8 publish result and
  the live SHA; older public builds are not to be called the Mega Update.

## Scope protection

Production `/arcade/`, site root, and `/core-test/` are intentionally
unchanged. This is a consolidated **R8 preview mega-release**, with
main Core MUGEN 1.1 parity synchronized at the shared runtime level.
