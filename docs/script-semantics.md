# CNS execution semantics — Web Edition 13

This pass targets shared script rules documented in the supplied MUGEN 1.1 beta 1 `cns.html`, `sctrls.html` and `trigger.html`. The tests are documentation-based regressions and imported-character checks. They are not independently captured native-engine comparisons.

## Implemented and checked

- Expressions use signed 32-bit integer arithmetic and single-precision float literals/results. Integer multiplication retains its low bits; integer exponent overflow saturates at the documented maximum. Mixed numeric comparisons and intervals promote their operands. Float and system-float variable storage is single precision.
- Native arithmetic faults produce bottom. Bottom propagates through eager operands and argument lists while later valid assignment side effects still run. `Cond` evaluates only its selected branch; a bottom condition stops its branches. `IfElse` evaluates all three arguments and isolates bottom only in the unused branch. Unsupported syntax remains an error.
- Bottom is false at a trigger boundary. Numeric controller parameters instead receive zero and produce a source diagnostic, including vector components, HitDef fields and clipboard parameters. Unknown triggers or malformed expressions do not silently become zero-valued parameters.
- Trigger groups run in contiguous numeric order beginning with `trigger1`. Duplicate lines within a group are AND conditions; groups are OR conditions. `triggerall` and group evaluation short-circuit between lines. Groups beyond a numbering gap are ignored and reported.
- `persistent` and `ignorehitpause` accept integer constants, not expressions. Invalid flags disable the affected controller and are reported. Persistence resets on state entry. Hitpause allowances do not bypass global Pause/SuperPause freezing.
- Controllers run in section order. Negative states run -3, -2, -1 before the current positive state, with helper/custom-state restrictions. A transition stops the remainder of its controller block; destination time-zero controllers execute in the same tick. Transition loops remain bounded.
- Required parameters are checked for supported basic controllers, including inherited ChangeAnim2/SelfState and alternate variable assignments. HitOverride cancellation is conditional: an empty attribute or zero duration can clear its slot without a destination state. This covers the supplied KFM cancellation syntax.
- Numeric parameters requested repeatedly by one controller activation are cached for that activation. Target operations evaluate their shared value/vector parameters once, then apply them to the selected targets. `VarRangeSet` evaluates its value once for the entire range.
- Alternate variable targets retain comparisons and assignment operators inside the index expression. Integer VarAdd casts its operand before adding it. `VarRandom` supports the documented one-value range shorthand and inclusive bounds; its generator is not certified against native MUGEN's random sequence.
- State-entry hit/move/count persistence flags accept expressions. Their values are read before the previous hit information is cleared. Type/movetype/physics `U` preserves the corresponding previous setting.
- Legacy name/type comparisons form boolean clauses within surrounding arithmetic. P1Name aliases Name; absent P2/P3/P4 names never match even an empty string. Missing P2 state/distance data produces bottom. FrontEdge/BackEdge honor facing. Native function argument counts are checked, including inside unused conditional branches.
- Life/power controller amounts use integer coercion. LifeAdd and TargetLifeAdd support `absolute` damage and the documented kill defaults. Zero-valued TargetFacing leaves facing unchanged.
- Browser reports and replay snapshots include control/type/physics and working/system variable arrays for further comparison.

## Verification

`test/script-semantics.test.js` exercises these rules with independent CNS fixtures. The broader suite checks existing commands, combat, custom states, mixed coordinates, helpers, projectiles, effects and rounds. A 30-tick sweep of each of the 106 positive states in both supplied KFM variants completes without uncaught errors or runtime diagnostics.

`python scripts/verify-script-semantics.py` imports a fixture using KFM sprites, runs CMD transitions, checks exported variable values and clipboard text, and verifies expected source diagnostics. It requires Playwright, Chromium and a running server; use `MUGEN_TEST_URL` and `CHROMIUM_PATH` to override its defaults. The other browser checks cover combat recovery, phone file providers and the arena's large worker import/touch controls.

## Remaining before exact script compatibility can be claimed

- Audit each controller's remaining optional parameters, defaults and conditional requirements; name recognition and shared validation do not establish every controller's engine effect.
- Compare native phase ordering during state changes, simultaneous attacks, hitpause and nested Pause/SuperPause interactions. Negative-state persistence and unusual state-entry side effects need native captures.
- Verify boundary numeric conversions, overflow and transcendental results across native versions. Engine world/physics arithmetic is a separate concern from the expression interpreter's 32-bit arithmetic.
- Add a broader character corpus and version-specific WinMUGEN/1.0/1.1 cases. Shiki R's contents remain uninspected until its scripts are accessible.
- Supply independent native MUGEN replay baselines. The comparison command can compare captured fields, but does not launch the Windows engine or certify full compatibility.
