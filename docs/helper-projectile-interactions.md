# Helper/projectile interactions: Web Edition 17

This pass implements guard proximity, helper pushing and camera participation, simultaneous projectile contacts, and projectile pause/removal boundaries. It adds **41 regressions**; all **381 Node tests** pass with both full-distribution KFM variants and no skipped tests. These are web-runtime tests. No independently captured native MUGEN frame trace is available, so exact native equivalence remains unverified.

## Guard proximity

`InGuardDist` includes enemy roots, normal helpers and projectiles. Physical attacks require attack MoveType. Projectile proximity uses `size.proj.attack.dist` by default, an explicit HitDef `guard.dist` when supplied, the projectile's facing and its creation coordinates. Physical default distances, AttackDist overrides and persisted mixed-coordinate HitDefs retain their own units. Distances use strict forward bounds: zero distance, a position behind the attack, the exact outer boundary and nonpositive ranges do not activate proximity guarding.

The team filter follows `affectteam`. Exhausted, invalid and removing shots do not threaten proximity guarding; a live shot in miss-time still can. Projectiles never threaten or hit their root, including friendly-fire configurations. Destroying a helper creator leaves its root-owned projectiles intact.

The world updates the proximity flag in collision detection before applying player contacts. CNS reads the preceding collision pass. This prevents root/helper controller execution order from changing the value within a CNS pass. A helper created in tick N can therefore cause the opponent's CNS guard trigger to read true in tick N+1. Standalone FighterRuntime instances, which have no world collision pass, retain an immediate opponent-only fallback. Guard detection is no longer computed eagerly for every unrelated expression trigger.

## Body pushing and camera

Normal helpers default to no pushing and no camera participation. PlayerPush can enable enemy root/helper or helper/helper pushing. Both participants must allow pushing; size boxes and AIR Clsn2 must overlap. Airborne and lying states are not blanket exclusions. Width overrides, facing, body size, active-state units and wall-constrained displacement are respected. Friendly helpers do not push their root or other friendly helpers. An advancing helper can push a frozen enemy during Pause.

Pairs use stable player IDs and horizontal positions for deterministic processing. This is not a claim that all native coincident-position/multi-body tie rules have been reproduced. Those rules still need native captures.

ScreenBound's `value` and its two `movecamera` flags are independent. A free helper can follow the camera, and a bounded helper can opt out. Horizontal and vertical participation are separate. Destroyed helpers and projectile objects are excluded from camera following. The camera is updated after a body-push displacement so eligible actors affect the same tick's camera. PlayerPush, ScreenBound, camera flags and Width survive hitpause and reset on the next active tick; ordinary global Pause also preserves them.

## Simultaneous contacts

A projectile can hit a root and several enemy helpers in one collision pass. Eligible contacts apply independently, then consume **one** projectile hit quota and start **one** miss-time interval. Rejected chain/filter contacts consume neither. Mixed guarded/unguarded contacts preserve their contact history, damage, power and target effects. The older single-target projectile test now checks simultaneous root/helper damage.

A defender accepts one successful projectile contact in a collision pass. Other overlapping projectiles retain their quotas. This contact immunity remains while the defender is frozen and clears on its next active update. Physical helper/root trades continue to resolve from a shared collision snapshot, including lethal trades.

Projectile cancellation uses cached Clsn2 boxes, then sorts overlapping candidates by distance and stable creation ID. This avoids spending priority on a farther shot merely because it was created first. A cancelled shot does not subsequently damage a player in the same pass. Higher-priority survivors retain attacker hitpause; cancellation clears pause only on the cancelled shot.

## Pause and removal clocks

| Boundary | Implemented result |
| --- | --- |
| A quota-exhausting hit applies attacker hitpause | Mark hit removal pending, stop further attacks, retain the impact frame and keep the full pause. |
| Each following paused tick, including the tick that decrements hitpause to zero | Keep projectile position, lifetime, animation and miss-time fixed. |
| First active tick after pending hitpause/global Pause | Begin the selected removal action and apply removal velocity, in creation units and facing. |
| Final finite removal frame | Draw the frame once while excluding the removed shot from active collision/NumProj; release its visible snapshot on the next tick. |
| Unchanged removal action | Continue its existing clock; a hit on its last frame does not restart it after hitpause. |
| Lifetime/bounds removal | Check the current position before movement and switch to removal velocity before the removal tick's movement. |
| Stage/height boundary | Retire outward travel beyond the bound; allow a returning shot to enter. Screen-edge bounds remain unconditional. |
| `projremovetime=-1` / `<=-2` | Keep looping / remove after the active action's first completed cycle. |
| Missing positive removal action | Report it and retain the current action. Infinite or zero-total-time removal actions are released. |
| Projectile Pause/SuperPause movement allowance | Age both counters on advancing lifetime ticks, including before a pause begins. Hitpause and global freeze hold them; another pause does not replenish them. A newly applied contact hitpause does not consume allowance. |

Reports add `interactionState` for push/screen/camera/proximity/contact-immunity flags. Projectile reports expose advancing age, pending/started removal and remaining movement allowances. This supports frame inspection without putting implementation details in the arena controls.

## Verification and sources

`test/helper-projectile-interactions.test.js` covers both facings, mixed coordinates, friendly filtering/root immunity, guard flag latency, body boxes/walls, camera axes, hitpause-preserved flags, simultaneous/rejected/lethal contacts, multiple-projectile immunity, nearest clashes, allowance exhaustion and finite/infinite removal boundaries.

`scripts/verify-helper-projectile-interactions.py` imports independently authored CNS/CMD/AIR/SFF/stage files through the built browser app and exports reports. Observed results:

- Guard CNS values change **0 → 1** across the creation/collision boundary.
- One projectile damages an enemy root and helper to **990 / 990** together.
- Its **two** subsequent hitpause ticks retain position, age and **324 red pixels**, with no green removal pixels.
- The one-tick removal action displays **324 green pixels**, then disappears.
- Helper camera Y changes **−60 → 0**, and ground body separation is **32** world units.
- No browser errors/failed requests; the 390px layout stays within the viewport.

Existing lifecycle/palette/shadow, combat, mobile file-provider/FileReader fallback, unsafe ZIP rejection, large worker import, touch and arena checks also pass. Both supplied KFM variants complete 106-state × 30-tick sweeps and input sequences with zero diagnostics or uncaught exceptions. The compatibility replay has ten samples and zero diagnostics; it is not a native comparison. Compact results are in [interaction evidence](helper-projectile-interaction-evidence.json).

All seven 90-frame performance scenes retain identical behavior hashes and pixel-identical output against Edition 16, with zero routine readbacks. Headless render p95 is 15.9 ms for the entity scene and 36.6 ms for the combined scene; these are uncontrolled-host CPU draw measurements, not physical-phone FPS or a speedup claim. The Low cadence check records 66 simulation ticks over roughly 1.1 seconds at 30 rendered FPS. Hidden-tab suspension, offscreen simulation, cache/settings persistence and input buffering pass. The extreme 4× CPU-throttled combined scene selects Auto Low but still averages about 8.45 FPS across adaptation, so physical Android performance remains unverified.

The supplied MUGEN 1.1 beta 1 trigger/state-controller docs are primary references for InGuardDist, AttackDist, PlayerPush, ScreenBound, Projectile and Pause/SuperPause. The public [Ikemen GO character runtime](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go) is a secondary reference for forward proximity bounds, collision-pass guard flags, Clsn2 pushing, projectile contact grouping/immunity, distance sorting and pause/removal clocks. It contains intentional differences and extensions; no Ikemen-specific 3D/team/push-priority parameters were added by this pass.

```sh
MUGEN_TEST_ARCHIVE=/path/to/mugen-1.1b1.zip npm test
npm run compatibility
npm run build
MUGEN_TEST_URL=http://127.0.0.1:5173/ python scripts/verify-helper-projectile-interactions.py
```

Native MUGEN 1.0/1.1 and WinMUGEN captures remain necessary to settle exact same-frame draw/contact offsets, zero-duration AIR elements, newly spawned entities during pauses, multi-body coincidence/corner ties, cancellation chains, expiry-time collision quirks and legacy timing differences. Foreign sprite/palette ownership, reflections, deprecated player-type helpers and Simul/Turns also remain outside this pass. The engine continues to report `completeCompatibility: false`.
