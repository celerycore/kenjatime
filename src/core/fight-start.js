/** PR #17 benchmark round-start sequence, measured in simulation ticks at 60 Hz.
 * The 42-tick FIGHT banner is followed by a 60-tick idle hold.
 * Combat controls are released only after both intervals complete.
 */
export const FIGHT_BANNER_TICKS=42;
export const POST_FIGHT_IDLE_TICKS=60;
export const BENCHMARK_START_LOCK_TICKS=FIGHT_BANNER_TICKS+POST_FIGHT_IDLE_TICKS;

export function fightStartLocked(flow) {
  if (!flow?.rules?.fightStartLockTicks) return false;
  return flow.roundState===1 ||
    (flow.roundState===2 && flow.phaseTime<flow.rules.fightStartLockTicks);
}
