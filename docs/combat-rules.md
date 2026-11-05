# Combat compatibility: Web Edition 14

This pass implements additional MUGEN combat rules in the browser runtime. Its regression fixtures use the supplied MUGEN 1.1 beta 1 documentation, classic/720p Kung Fu Man files, and independently authored scripts. Passing these checks does not establish full native-engine equivalence.

## Implemented behavior and evidence

| Rule | Behavior exercised by tests |
| --- | --- |
| Guard stun | Holding back can guard another eligible attack while control is zero. Ordinary hitstun cannot guard. Standing/crouching guard posture can change during the knockback phase. Guard sparks/sounds remain separate from unguarded hit palette effects and shakes. |
| HitDef defaults | `air.type` inherits `ground.type`; launching ground hits default `forcestand`; down velocity inherits air velocity; ground guard velocity uses only X; down hit time, slide time and guard control time use their documented defaults. `AttackDist` updates the active HitDef in its creation units. |
| Damage | Base attack/defence, `AttackMulSet`, `DefenceMulSet` and fall defence compose. Positive fractional damage rounds with a one-point minimum; a zero multiplier remains zero. LifeAdd/TargetLifeAdd apply defence to healing as well as damage unless absolute. Kill flags retain one life when requested. |
| Power | Omitted awards use raw HitDef hit damage and the configured attack/get-hit coefficients, including guarded contacts. Integer truncation and default half-sized guard awards are tested separately from actual life damage. A float32 coefficient calculation preserves cases such as `90 * 0.7 = 63`. |
| Engine configuration | `[Rules]` in imported `data/mugen.cfg` supplies `Default.Attack.LifeToPowerMul`, `Default.GetHit.LifeToPowerMul` and `Super.TargetDefenceMul`. Defaults are 0.7, 0.6 and 1.5. Invalid negative/non-finite values are rejected. Shared configuration remains active when a subsequent standalone character is imported. |
| Contact counters | Hit/guard/reversal flags replace stale flags. HitCount advances once per attacking actor per contact tick; UniqHitCount counts contacted victims. `numhits` changes the victim combo total independently of physical GetHitVar(hitcount). HitAdd changes the attacker's counters and latest target's combo total. State persistence rules still control counter resets. |
| Juggling | Normal helpers have separate budgets. A normal attack debits its StateDef juggle cost once per attack group; projectiles debit their `air.juggle` cost through the creator's ledger. Falling before or after contact is considered. NoJuggleCheck bypasses the debit without allowing a later duplicate debit. Destroyed entities release their records. |
| Priority | The Hit/Miss/Dodge matrix and numeric-priority expressions are exercised through collision contacts. Equal-priority lethal attacks trade from the same collision snapshot. Existing chain, single-target, override and defensive-mask tests remain in the suite. |
| Reaction selection | Launches use air hit time; flat downed hits use down hit time. Knockback retains its world direction for both facings and mixed coordinate widths. Hits from behind swap High/Low ground reactions. |
| Fallback states | Guard shake/knockback, ground shake/slide, air shake/flight, trips, downed hits, landing bounces, lying recovery and KO flight have separate phases. A trip lands without the normal bounce. `down.bounce=0` suppresses another bounce after a popped-up down hit. A supplied common-state file continues to take precedence. |
| Falling | Landing/trip entries increase fall count and apply the character's fall-defence multiplier independently of DefenceMulSet. Leaving hit mode resets it. HitFallDamage consumes its amount once, applies defence and cannot revive a KO. HitFallVel requires hit mode and preserves X motion when fall.xvelocity was omitted. |
| Knockout | A lethal hit forces falling, disables air recovery and adds the KO trajectory before lying dead. Ground/air posture, both coordinate widths, nonlethal kill flags and guard KOs have coverage. |

Browser reports and replay samples expose hit/unique/combo counters, contact flags, hit clocks and attack/defence/fall multipliers. Reports also record the resolved combat coefficients. These fields help distinguish damage, state-script and timing failures.

## Legacy quirks and evidence limits

The supplied documentation alone does not specify every executable behavior. The implementation was also checked against the public [Ikemen GO character runtime](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go) as a secondary reference. Ikemen includes extensions and deliberate fixes; it is not a native MUGEN baseline.

Two legacy choices are explicit: ordinary `ground.type=None` / `air.type=None` contacts do not apply the hitpause described by the MUGEN documentation, and `GetHitVar(xveladd/yveladd)` stays zero even when the KO trajectory changes. Both follow the secondary reference's descriptions of MUGEN quirks. Their exact behavior across MUGEN versions, including the None/HitOverride exception, still needs independent native capture. The KO constants also require native trajectory captures. Fall time continues to include hitshake for legacy recovery timing.

Remaining combat work includes exact native phase ordering and rounding boundaries, simultaneous multi-attacker/override/reversal edge cases, None contact side effects and overrides, repeated-bounce recovery shortening/invulnerability, all common-state animation/recovery variants, projectile corner push and post-KO targeting. Team combat additionally requires Simul/Turns support. The fallback common states remain an independently authored subset.

## Reproduce the checks

```sh
npm test
MUGEN_TEST_ARCHIVE=/path/to/mugen-1.1b1.zip npm test
npm run compatibility
```

With Python Playwright, Chromium, and the built site served locally:

```sh
MUGEN_TEST_URL=http://127.0.0.1:5186/kenjatime/ python scripts/verify-combat-rules.py
MUGEN_TEST_URL=http://127.0.0.1:5186/kenjatime/ python scripts/verify-combat.py
```

The first browser check imports a synthetic character with real KFM sprites, configured power coefficients and CMD inputs. It checks normal/guard damage, repeat guard during stun, posture changes, trip/down/bounce phases, KO flight, legacy None contacts and exported reports. The earlier workflow check covers hit chains, forbidden follow-ups, nearest-target throws, liedown input acceleration and air recovery. Neither script executes `mugen.exe`.

Both supplied KFM variants also run scored CPU matches for 4,000 ticks each with their actual common AIR resources and no runtime diagnostics. A separate bounded sweep executes each of their 106 positive states for 30 ticks. Those checks establish exercised browser-runtime paths, not every character path or native parity. See the [compatibility matrix](compatibility-matrix.md) for the remaining engine work and native comparison workflow.
