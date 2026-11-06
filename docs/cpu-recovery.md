# CPU recovery after a combo: Web Edition 22

The supplied Es report exposes a CPU input-planning gap. Both fighters are at AI level 7, but Es has no recovery input while in hitstun. The generic CPU previously stopped choosing commands whenever `ctrl=0` or `MoveType=H`. A character whose air tech requires a fresh button could therefore miss every recovery opportunity after the opponent stopped hitting.

The captured frame itself is still inside the legitimate recovery lockout: Es is in its own state 5030 with `fall.time=11`, `fall.recovertime=33` and `fall.recover=1`. Its common-state script also requires an appropriate vertical velocity before entering air recovery 5210. A gap between attacks does not automatically make a hit recoverable.

## Correction

`src/cpu.js` now plans recovery inputs during falling hit states once the existing `CanRecover` trigger allows them. It discovers literal command names on recovery transitions in the active state owner's program, including opponent-owned custom states, and sends their actual CMD input sequences. Standard `recovery` commands and individual reachable buttons provide fallbacks. Command lookup includes entries beyond the existing 512-command attack-selection cap.

The planner uses the ordinary command buffer, including remaps, facing, chords, charge motions, releases and retries. CNS remains responsible for the transition, velocity/position gates and state ownership. A new hit that closes the window cancels an unfinished recovery plan. Global pauses freeze the plan. Human-controlled fighters still require human inputs; unrecoverable falls and KOs do not generate recovery requests.

## Supplied-character reproduction

The reduced replay loads the supplied Es DEF/CMD/CNS/AIR export, restores the report's hit state, variables, position, velocity and hit clocks, and substitutes an idle opponent so there are no additional hits. Sprite/sound banks and the exact animation frame/facing were not supplied in the snapshot; the replay starts the reported animation at its first frame with facing +1.

| Input mode | Before | Edition 22 |
| --- | --- | --- |
| CPU level 7 | Misses air tech; lands on tick 69 | Authored air recovery 5210 on tick 26, while airborne |
| Manual `a` every six ticks when permitted | Air recovery on tick 31 | Air recovery on tick 31 |
| No inputs | Lands on tick 69, gets up later | Same behavior |

Ticks are relative to the captured state. `CanRecover` first becomes true on tick 22; the character's velocity condition still applies afterward. The different manual/CPU ticks reflect their different press schedules. This isolates the missing CPU input; it does not replay the complete original Maid Taiga combo or establish native executable parity.

## Validation

The full supplied corpus passes **477 tests, zero failures and zero skips**, including 11 new recovery regressions. They cover disabled CPU, KO, unrecoverable hits, late recovery windows, command caps, remapped/charged inputs, ground-tech conditions, guard input, foreign-state `SelfState`, interrupted plans, pauses, manual recovery and the actual Es script export.

`scripts/verify-cpu-recovery.py` imports independent one-hit launcher fixtures through the built UI. All **18 cases** pass across the lab, Arena and Classic Arena at 390px: normal/foreign-state P1 and P2 CPU recovery, forbidden recovery, and keyboard-driven human recovery. Recovery uses the real custom CMD name `ukemi`; foreign-state tech restores the victim's own program. No browser errors occur. The existing controller checks pass on all three routes using simulated DualSense devices, and the scheduling check retains 60 Hz simulation with 30 FPS Low rendering and buffered brief inputs. No renderer changes are part of this correction.

```sh
npm test
MUGEN_ES_SCRIPTS=/path/to/mugen-character-scripts.zip \
MUGEN_ES_REPORT=/path/to/mugen-compatibility-report.json \
node --test --experimental-test-isolation=none test/cpu-recovery.test.js
npm run build
MUGEN_TEST_BASE=http://127.0.0.1:5186/next/ python scripts/verify-cpu-recovery.py
npm run compatibility
```

The browser check needs Python Playwright and Chromium; `CHROMIUM_PATH` can override its executable. Other supplied-corpus tests require their existing archive environment variables. [Compact evidence](cpu-recovery-evidence.json) records the baseline, replay results and browser cases without redistributing the uploaded scripts.

## Other report findings

Missing common FX/sounds, unavailable Es sound 160,1, redirected `enemynear`/`root` expression diagnostics and Taiga's unsupported `y.accel` HitDef parameter remain separate findings. This CPU fix does not resolve those warnings or claim every character's custom recovery/AI scheme is supported. More complex command expressions, recovery decisions in negative states, character-specific AI and exact native phase ordering still need broader captures and coverage.
