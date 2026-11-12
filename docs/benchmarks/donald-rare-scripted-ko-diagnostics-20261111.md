# Original Dark Donald 2011 versus Rare Akuma 2026: scripted death and CPU jumps

Date: 2026-11-11  
Source branch: `release/gpu-camera-js-fallback-20261111` (draft release PR #16)  
Online isolated test: https://celerycore.github.io/kenjatime/donald-rare-qa/

## Scope and evidence

The **original** archived Dark Donald, Rare Akuma 2026, and Rare Akuma 2007 character sources were loaded privately into Kenjatime's JavaScript Core. The source packages were **never uploaded or committed**. Their character scripts were exercised in actual headless CPU matches; the observations below are **not** native IKEMEN frame-by-frame oracle traces.

### Abrupt death observed and reproduced

In an original Rare Akuma 2026 versus Dark Donald 2011 headless matchup, Rare Akuma was hit before the kill, entered state 5000 (hitstun), and immediately entered a **Donald-owned foreign state** due to a Dark Donald `TargetState` controller.

The actual authored controller source is `Donald3.cns`, line 2738, `TargetState` with a randomly selected state `ifelse(random<500,10047,113)`. In the reproduced event it selects **state 10047**, which Dark Donald implements in `Donald2.cns`. At `Donald2.cns` line 9913, an authored `LifeSet` sets Rare Akuma's life to 0. That transitions the victim into a custom KO/death presentation including state 944. The observed life change was **1790 → 0**.

This is an **authored instant-death move**, not GPU texture corruption, a giant accidental HitDef damage value, or a missing sprite. However, whether the native game chooses that controller and state at exactly the same rate is **not yet proven**. Kenjatime retains the original move to preserve semantics instead of silently balancing it.

Rare Akuma 2026 has a separate self-destructive power move in its own ZSS script (state family 4900), but **that was not the source of the reproduced sudden death**.

### Why jumping can look rare

The AI can generate Up input, but a fighter may be in an authored attack/controller state that prevents a neutral jump from executing before the Up request expires. This distinction was observed by instrumenting `CpuController.chooseJump`, state transitions, and actual Up-input windows with the original source packages.

In one 1800-tick original Rare Akuma 2026 vs Dark Donald baseline, Rare Akuma requested 7 jumps and entered the jump state on 4 occasions; Dark Donald requested 10 and successfully jumped only twice. The precise counts depend on AI RNG, character ordering, round transitions and scripts.

Kenjatime now keeps an at-most-two-retry short-lived Up intent for a CPU fighter **when the first physical Up was missed**, only when its normal `canJump` guard allows a retry. It never forces state 40, adds no artificial jump velocity, never weakens authored attacks, and does not guarantee frequent jumping for over-scripted boss characters. A local matched asset replay showed some additional accepted jumps for Dark Donald but not a universal increase; counts are not a substitute for native-engine AI input parity.

### Diagnostic features

- `src/runtime.js`: when authored `LifeSet`/`LifeAdd` drops a living fighter to zero in active gameplay, records the existing cause, actor/state owner, source filename/line, prior health, and whether the state is foreign-owned, without changing combat semantics.
- `src/core/session.js`: includes `scriptedKoCount` and `lastScriptedKO` in match snapshots.
- `src/core/endless-benchmark.js`: exports `scripted_ko_total` and `last_scripted_ko` columns in future CSVs. An authored Donald KO should appear similar to `Donald -> Rare Akuma -> lifeset -> state 10047`.
- `src/cpu.js`: bounded authored-AI Up retries; no forced movement or new attack tuning.
- `test/core/donald-akuma-scripted-ko.test.js`: synthetic state-owner attribution, one-time KO accounting, and capped Up retries. CI passed: https://github.com/celerycore/kenjatime/actions/runs/43045216923.
- New isolated staging build published/verified: https://github.com/celerycore/kenjatime/actions/runs/43045774407.

## Further testing

Use the staging site on a real Android phone, import the user-owned original archives, and watch Dark Donald against Rare Akuma 2026 in CPU/Endless mode. Export a new benchmark CSV, then compare scripted KO counts, round progression, GPU memory, touch, screen size, and jump attempts. Native IKEMEN input replay is required to conclude that Dark Donald's high-power moves fire at the intended rate.

The source release PR is **draft**. Do not promote changes to the live `/arcade/` site or enable Kotlin/WASM by default until physical QA and compatibility gates pass.
