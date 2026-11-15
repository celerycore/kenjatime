# Kenjatime Kotlin/Wasm combat migration

## Current projectile feedback continuation — November 15, 2026

Continues published main source `b286547`. CNS can now query projectile hit,
guard and cancellation feedback after the shot has disappeared.
`ProjHitTime`, `ProjGuardedTime`, `ProjContactTime` and `ProjCancelTime` take
one numeric ID expression. Zero and negative query IDs select any projectile;
positive IDs filter exactly, without coordinate scaling. Missing, extra,
nonnumeric, nonfinite or overflowing arguments fail closed with diagnostics.

The time functions inspect the latest overall projectile event. A later guard
makes ProjHitTime return -1, even if an older shot hit; a later cancellation
makes ProjContactTime return -1. ProjContactTime accepts hits or guards, while
the other functions require their named event type. A nonmatching type/ID or
no recorded event returns -1. History survives projectile retirement and
actor state/bank changes; queries belong to the executing actor.

Legacy `ProjHit[ID]`, `ProjGuarded[ID]` and `ProjContact[ID]` clauses support
`= value` and `= value, [operator] time`, including dynamic numeric expressions,
all comparison operators, omitted/wildcard IDs and nested boolean expressions.
These predicates can find an older matching ID/kind after a newer event.
Zero inverts the complete time-window result; an absent event never satisfies
a positive predicate merely because the -1 sentinel is less than a cutoff.
Parenthesized aliases such as `ProjHit(7)` and `ProjContact()` expose the
one-tick flag too. Parenthesize a legacy clause when nesting it in a function,
for example `ifelse((ProjHit7 = 1, < 5), 10, 0)`.

Events use the fight's simulation tick. Their age is one after the completed
contact tick, so the next controller phase can react once to the default flag.
World age continues during creator hitpause; `ignorehitpause=1` permits a
paused controller to observe the flag. Each accepted multi-hit contact
refreshes it. Misses, rejected filters/overrides, expiry, bounds cleanup and
surviving clashes do not create feedback. Only terminal clash cancellation
records a cancel event. Same-tick events retain collision-phase order.

Each actor retains only the latest record per ID/kind, with a 4096-entry bound.
Repeated hits do not consume new slots. At the bound, the oldest record is
discarded with a stable resource diagnostic; wildcard caches cannot retain an
evicted kind. Helper-owned shots currently write their creator's independent
history, consistent with existing Kotlin ownership. Native helper-to-root
promotion remains incomplete.

Read-only `ktCoreProjectileHistory(handle, side)` exposes compact records with
ID, kind, original world tick and derived age. Render/camera/history queries
cannot age records, refresh flags or change which event is latest.

Local validation:

- 353 JVM and 348 compiled-Wasm tests pass, including 29 new shared scenarios
  for feedback kinds, latest/remembered events, same-tick ordering, legacy
  expressions, one-tick/follow-up controllers, protection, pause, ownership,
  bounded storage, long ages and replay.
- Exported Wasm checks execute hit/guard → retirement → CNS follow-up, mutual
  cancellation → follow-up, and latest-event timers versus an older legacy hit
  window. Repeated presentation/history reads preserve all feedback.
- Two public KFM 600-tick structural replays match, retaining nine contacts,
  seven fallback recoveries and zero unsupported diagnostics on that trace.
- All 16 adapter/import/download checks and production browser smoke pass,
  including real sprites/effects, mixed-coordinate imports, CSV and mobile layout.

The basic query contracts follow the
[Elecbyte projectile trigger references](https://network.mugenguild.com/justnopoint/1.1docs/trigger.html#projcontacttime).
Native pause/contact ordering, helper ownership and complete round-reset
semantics remain unverified. Native MUGEN character parity and physical-phone
performance are not certified. Main CI checks browser/APK asset identity and
anonymous permanent downloads before publication.

## Projectile clash continuation — November 15, 2026

Continues published main source `289eab1`. Opposing projectiles now clash using
their AIR Clsn2 boxes, launch-facing and own-resource coordinate scale. Clsn1
attack boxes alone do not cancel another projectile. Friendly shots, including
shots from different helpers on one side, do not clash. Zero or exhausted hit
allowances remain nonattacking and cannot cancel another shot.

`projpriority` is captured as a positive integer, defaults to one, and remains
independent of HitDef priority and localcoord. A higher-priority shot spends one
priority; the lower-priority shot spends one hit. Equal priorities each spend
one hit. Default single-hit shots therefore cancel each other. Multi-hit shots
can absorb clashes until their hit allowance is exhausted. Cancellation ignores
`projremove=0` and clears only the cancelled projectile's hitpause.

All existing projectiles finish their movement/AIR phase before clash geometry
is captured. World-space bounding rectangles reject separated pairs before
checking individual boxes. Candidates sort by squared world distance, then
stable creation IDs. Each pair resolves once; cancelled shots cannot enter a
later pair or damage a fighter in that phase. This global nearest-pair policy
is deterministic and has synthetic coverage; native cancellation-chain order
has not been certified. Geometry retains the existing strict-overlap policy.

Own hitpause and contact miss delay do not make a projectile immune to clashes.
Survivors preserve the greater of their current pause and authored hitpause.
That pause blocks fighter contact through the last frozen tick; a survivor
with zero pause can still hit a fighter after clash resolution. Clashes do not
damage fighters, capture targets or set their MoveHit/MoveContact flags.
New births wait for the next projectile phase, bound-removed shots cannot
clash, and a final positive lifetime update remains eligible before retirement.

`ktCoreProjectiles` adds current `priority`. Read-only
`ktCoreProjectileClashes` reports participating entity IDs and cancellation
outcomes for the latest simulation tick. These events clear at the next tick,
including inactive round phases. Snapshot, camera and render queries cannot
reorder clashes, spend priority/hits or retain stale events.

Local validation:

- 324 JVM and 319 compiled-Wasm tests pass, including 29 new shared scenarios
  for priorities, allowances, friendly/helper sides, Clsn2 geometry, scaling,
  shared movement, pause/delay, nearest/tied pairs, expiry, events and replay.
- Exported Wasm checks execute mutual cancellation, priority spending, a
  three-shot nearest-pair chain and a surviving shot's later fighter contact.
  Repeated render/camera/snapshot queries preserve budgets and events.
- Two public KFM 600-tick structural replays match, retaining nine contacts,
  seven fallback recoveries and zero unsupported diagnostics on that trace.
- All 16 adapter/import/download checks and production browser smoke pass,
  including real sprites/effects, mixed-coordinate imports, CSV and mobile layout.

The basic single-hit priority contract follows the
[Elecbyte Projectile reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#projectile).
Native multi-hit cancellation, edge contact, pause and simultaneous-contact
phases remain unverified. Projectile removal/cancel animations, reflections,
contacts against helpers/team modes, native helper-to-root ownership,
screen-edge bounds, scaling and complete Pause/SuperPause remain incomplete.
Physical-phone performance remains unverified. Main CI checks browser/APK asset
identity and anonymous permanent public downloads before publication.

## Multi-hit projectile continuation — November 15, 2026

Continues published main source `e260ef5`. Projectile now captures authored
`projhits`, `projmisstime` and `projremove` expressions at creation. Hit counts
and delays remain integers independent of character localcoord. Negative,
nonfinite, unknown or overflowing allowances are diagnosed before queuing an
entity. The defaults retain one hit, no miss delay and removal on exhaustion.

Each accepted hit or guard consumes one hit from the projectile's allowance.
Rejected HitBy/NotHitBy or HitOverride contacts, misses and dead opponents do
not spend hits or start pause/delay clocks. Zero hits produces a nonattacking
projectile. A multi-hit shot can hit the same opponent again after its delay;
there is no permanent per-target latch. In the supported root-opponent contact
model, a delay of three permits contacts at active phases 1, 4 and 7. Zero and
one both permit contact at the next active phase, with at most one contact per
projectile per phase.

`projremove=0` retains the shot after exhaustion, with its motion, AIR clock,
rendering and NumProj/NumProjID presence intact. It cannot regain hits when its
creator changes variables or state. Lifetime and stage/height cleanup still
retire it. Any nonzero remove flag retires on the final allowed contact; final
contact removal remains immediate, as in the previous single-contact model.

Surviving projectiles now use their own HitDef hit/guard pause. This freezes
movement, acceleration/multipliers, AIR, positive lifetime, miss delay and
bound checks through the last frozen tick. Creator hitpause neither freezes
nor extends a projectile's independent clock. Defender pause remains governed
by the existing hit/guard reaction rules. The final active lifetime update can
still contact before retirement. Removal-animation and final-hit pause visuals
remain incomplete.

`ktCoreProjectiles` adds read-only `hitsLeft`, `missTimeLeft`, `hitPause` and
`removeOnHit` fields. Same-ID shots, helper-owned shots and separate fights
keep independent allowance and clock state. Presentation queries cannot
advance clocks or rearm an exhausted shot.

Local validation:

- 295 JVM and 290 compiled-Wasm tests pass, including 27 new common scenarios
  for repeat hits, delays, guards, protection, independent pause, expiry/bounds,
  helpers, target capture, coordinates, validation, resources and replay.
- Exported Wasm tests execute hit → projectile pause → miss delay → repeated
  contact, finite allowance exhaustion, optional hit removal and eventual
  lifetime retirement. Repeated render/camera/snapshot queries preserve clocks.
- Two public KFM 600-tick structural replays match, retaining nine contacts,
  seven fallback recoveries and zero unsupported diagnostics on that trace.
- All 16 adapter/import/download checks and production browser smoke pass,
  including real sprites/effects, mixed-coordinate imports, CSV and mobile layout.

The authored parameters follow the
[Elecbyte Projectile reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#projectile).
This is synthetic JVM/Wasm coverage, not native tick-for-tick certification.
Projectile clashes, contacts against helpers/team modes, native helper-to-root
ownership, screen-edge bounds, removal animations/scaling, complete guard pause
and global Pause/SuperPause behavior remain incomplete. Physical-phone
performance remains unverified. Main CI checks browser/APK asset identity and
anonymous permanent public downloads before publication.

## Projectile trajectory/lifetime continuation — November 15, 2026

Continues published main source `ef69133`. Projectile now captures authored
`accel` and `velmul` at creation, including nested CNS vector expressions.
Offset, velocity and acceleration convert from the active state owner's units
to canonical fixed point once; velocity multipliers remain dimensionless.
Launch-facing mirrors horizontal offset, velocity and acceleration, and later
creator turns do not change the trajectory or hit direction.

Each update moves by the current velocity, then computes
`nextVelocity = (velocity + accel) * velmul`, truncating to fixed point once.
Positions and velocities saturate instead of wrapping on overflow. This update
convention retains the existing linear path when accel is zero and velmul is
one; native combined-motion and contact-phase parity remain unverified.

The default `projremovetime` is now -1, rather than an artificial 60-tick cap.
Explicit -1 persists until contact or bounds cleanup; zero creates no entity
and consumes no resource slot. Positive values permit that many movement and
contact updates after birth, including contact on the final update, with no
3600-tick clamp. Invalid lifetime, trajectory or bounds expressions are
diagnosed before queuing an entity. The default `projanim` is action zero.

Configured arenas retire outward-moving shots beyond `projstagebound` or
`projheightbound` before the next movement/contact phase. Defaults are a
40-stage-pixel horizontal margin and heights -240..1 relative to arena ground;
explicit bounds convert from active script units. Returning offstage shots
remain live. Headless matches without an arena have no invented bounds. The
visual camera cannot influence cleanup, trajectory or lifetime.

`ktCoreProjectiles` exposes read-only identity, position, velocity, captured
acceleration/multipliers, launch-facing, animation and remaining-life snapshots.
Skipped or repeated presentation queries do not advance those values.

Local validation:

- 268 JVM and 263 compiled-Wasm tests pass, including 26 new shared scenarios
  for motion, nested expressions, coordinate scaling, overflow, lifetimes,
  hitpause, rejected/final-tick contacts, bounds, resource budgets and replay.
- Exported Wasm checks exercise acceleration/multipliers, a same-tick creator
  turn, indefinite/zero/finite life, mixed-coordinate bounds and returning
  shots. Repeated snapshot, render and camera queries preserve projectile state.
- Two public KFM 600-tick structural replays match, retaining nine contacts,
  seven fallback recoveries and zero unsupported diagnostics on that trace.
- All 16 adapter/import/download checks and production browser smoke pass,
  including real sprite/effect painting, mixed-coordinate imports, CSV and the
  360px layout.

Screen-edge `projedgebound`, projectile clashes, multi-hit/`projremove=0`,
removal/hit animations, projectile scaling and complete pause behavior remain
incomplete. The single-contact retirement model is unchanged. Full native
projectile/ownership phase parity and physical-phone performance remain open.
Main CI verifies browser/APK asset identity and anonymous release downloads.

## Successful-hit follow-up continuation — November 15, 2026

Continues published main source `fd0e2d1`. HitDef `p1stateno` now moves the
attacker to its authored follow-up after a successful unguarded contact. P2's
reaction and target capture happen first, so paired throws can enter P1's
attack state and P2's borrowed get-hit state, then use TargetBind and SelfState
to attach and release the captured victim. StateDef metadata applies at the
contact boundary; follow-up controllers start at the next actor phase and
respect the existing hitpause clock.

Follow-ups use the HitDef's captured script/state owner, including helpers,
borrowed states and delayed projectile hits after the creator changes banks.
Projectiles transition their creator. Their standard HitDef `id` is now
captured independently of ProjID, allowing hit-ID-specific TargetBind from the
follow-up. Guards, misses, hit filters and matching HitOverride protection do
not trigger the follow-up. Missing destinations are diagnosed after contact
without changing the attacker or repeating the damage. Negative destinations
disable the follow-up; an explicit zero can return to own/source-bank idle.

World contacts queue follow-ups until root, helper and projectile contacts
finish. Per-actor state revisions preserve incoming reactions, state steals and
KO on trades. The first valid follow-up wins if multiple hits request different
destinations for one unchanged actor. Dead or destroyed creators cannot reenter
a state. Direct hit API calls outside the world contact phase apply immediately
after victim capture. This deterministic policy has synthetic tests; its exact
ordering has not been certified against a new native capture.

Local validation:

- 242 JVM and 237 compiled-Wasm tests pass, including 22 new common scenarios
  for paired states, capture/binding/release, guard/miss/protection, hitpause,
  priorities, trades/KO, helpers, projectiles, banks, coordinates and replay.
- Exported Wasm tests execute p1stateno + p2stateno → capture → TargetBind →
  SelfState release, guarded contacts without follow-up, paired trades, and
  Projectile hit-ID-specific binding. Repeated render queries preserve state.
- Two public KFM 600-tick structural replays match, retaining nine contacts,
  seven fallback recoveries and zero unsupported diagnostics on that trace.
- All 16 adapter/import/download checks and production browser smoke pass,
  including real sprite/effect painting, mixed-coordinate imports, CSV and the
  360px layout.

The basic success/guard contract follows the
[Elecbyte HitDef reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitdef).
Authors should supply an attack follow-up and a get-hit victim state as that
reference specifies. Full native throw timing, alternate MoveType behavior,
reversal/projectile-clash interactions and contact/state-entry ordering remain
open. This change does not certify native character parity or physical-phone
performance. Main CI still verifies browser/APK asset identity and anonymous
release downloads.

## Missing-state arena recovery continuation — November 15, 2026

Continues published main source `c15c7ce`. Fixes indefinite knockback drift when
a character lacks common hit states. Previously a missing state 5000 recovered
to standing idle as soon as hitstun expired while keeping its upward velocity;
without authored air physics it could then drift thousands of stage pixels
away. The configured arena now supplies a bounded fallback for missing own
states 5000, 150..152 and 5150.

Launched fallback reactions use the character's own coordinate-scaled gravity.
They stay in reaction until both landing and hitstun completion. Floor crossings
clamp to the configured ground, including nonzero ground heights. Recovery
stops inherited knockback before entering own idle, whose authored velocity and
control still take precedence. Missing guard states preserve their grounded,
crouched or airborne type during reaction. Missing KO reactions settle at the
floor with zero motion and no control, without reviving the fighter.

The fallback is explicitly marked at hit receipt and cleared by state entry.
Authored common states, foreign custom states and HitOverride destinations do
not use it. Bindings retain position/gravity authority until release. Hitpause
freezes fallback movement and gravity through the last frozen tick. Headless
matches without an arena keep the earlier movement policy. Read-only Wasm
snapshots expose `fallbackHitReaction`; rendering does not advance the policy.

Local validation:

- 220 JVM and 215 compiled-Wasm tests pass, including 20 new common scenarios
  for flight, landing, hitstun, hitpause, guard/KO, bindings, authored states,
  coordinate scaling, late arena configuration and deterministic replay.
- Exported Wasm tests execute launch → hitpause → landing on a nonzero floor →
  stable idle, missing KO settling, and projectile-induced fallback recovery.
- Two public KFM 600-tick structural replays match. The trace now records nine
  contacts and seven completed fallback recoveries, with zero unsupported
  diagnostics. Maximum defender height is 17,424 fixed-point units (68.0625
  stage pixels). Each observed fallback-to-idle transition checks grounded
  position and zero inherited velocity. Additional defender snapshots are part
  of this verification loop; its timing is not comparable to earlier samples.
- All 16 adapter/import/download checks and the production browser smoke pass,
  including actual sprite/effect painting, mixed-coordinate import, CSV export
  and the 360px layout.

This is an opt-in arena recovery policy for missing common states.
It does not implement native air recovery, fall bounces, liedown animations,
complete guard/KO transitions or native phase parity. Authored gravity still
applies, including an explicit zero acceleration. Full helper physics and
physical-phone performance remain open. The existing main CI/public release
flow continues to verify browser/APK asset identity and anonymous downloads.

## Hit-override and incoming-data continuation — November 15, 2026

Continues published main source `e02cf41`. Kotlin now executes `HitOverride`
through eight actor-owned reaction slots. The lowest matching slot selects a
destination in the defender's own state bank, including when a borrowed state
installs the route. Positive durations count actor ticks including hitpause,
the default lasts one contact phase, -1 persists, and zero or an empty attr
clears the selected slot. Invalid slots, attributes, destinations, durations
or unsupported parameters leave the previous route intact. Helpers do not
share their parent's mutable routes or incoming-hit data.

Matching overrides reject hits requesting a P1 state transition or a foreign
P2 state before damage, pause, effects removal or target capture. A bare
p2getp1state flag without a P2 destination does not trigger this protection.
Unmatched routes leave existing custom-state behavior intact. Normal guarded
contacts use guard states. Rejected projectiles remain alive and can connect
after the matching route is cleared. Override destinations also handle lethal
hits; complete KO/round-flow phase parity remains open.

`forceair` selects incoming air velocity, hit time and fall metadata. Destination
StateDef type, animation and velocity still control the reaction itself. Both
ordinary hits and overrides retain the captured hit data separately from later
physical motion. `GetHitVar` now supports damage, xvel, yvel, hittime,
hitshaketime, guarded and fall. Velocity queries use the active state's units;
the reaction time freezes in hitpause and counts down to -1. Authored armor
states can restore damage and recover using these expressions. Unknown fields
and dynamic field-name expressions produce diagnostics.

HitDefs now parse air.velocity, air.hittime, air.fall, fall and guard.hittime.
Projectiles accept the corresponding standard HitDef parameter names, including
attr, damage, guard/hit flags, pausetime, ground/air/guard velocity and hit time,
plus target-state metadata; the earlier proj-prefixed aliases remain supported.
P1 destination metadata is used for override protection, while actual ordinary
p1stateno transitions remain explicitly unsupported. Read-only Wasm snapshots
expose the eight route timers and captured incoming-hit data.

Local validation:

- 200 JVM and 195 compiled-Wasm tests pass, including 24 new common scenarios
  covering route priority, expiry/renewal, clearing, own-bank transitions,
  protection, armor, guard/air data, helper/projectile contacts and replay.
- Actual exported Wasm tests execute own-state armor with forceair and
  GetHitVar recovery, rejected foreign-state contact followed by explicit
  route clearing, and standard Projectile parameters driving an override.
  Repeated presentation snapshots preserve all reaction clocks.
- Two 600-tick public KFM structural replays match, with three contacts and zero
  unsupported diagnostics on that trace. This is not native common-state parity.
- All 16 adapter/import/download checks and the production browser smoke pass,
  including real sprite/effect painting, mixed-coordinate import, CSV and the
  360px layout.

The basic contracts follow the
[Elecbyte controller reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitoverride)
and [GetHitVar reference](https://network.mugenguild.com/justnopoint/1.1docs/trigger.html#gethitvar).
The other GetHitVar fields, ground/air reaction types, fall/bounce/recovery
physics, complete guardstun and native per-tick ordering remain incomplete.
Attribute-state quirks, native KO/throw interactions and physical-phone
performance remain unverified. Main CI still verifies browser/APK asset identity
and anonymous public downloads before releasing a build.

## Hit-vulnerability continuation — November 15, 2026

Continues published main source `9c69e93`. Kotlin now executes `HitBy` and
`NotHitBy` through two per-actor attribute slots. `value` selects the first
slot and `value2` the second; a controller must specify exactly one. Active
slots intersect. State masks and attack-class masks remain separate, including
NotHitBy's independent complements, empty fields, N/S/H strength classes and
AA/AP/AT category wildcards. Complete packed legacy pairs are accepted;
malformed pairs, unknown state letters and unsupported parameters are diagnosed
before replacing the previous slot.

Default time=1 protects the current contact phase. Positive durations count
actor ticks, -1 persists, and zero explicitly clears the selected slot. Filter
timers continue during hitpause; `ignorehitpause=1` lets authored controllers
renew them while paused. State transitions retain remaining filter time.
Helpers have independent slots even when they share an immutable definition.
The basic controller contract follows the
[Elecbyte 1.1 controller reference](https://arcade.blackrocket.com/apps/2022/38/HQ/1/mugen-1.1b1/docs/sctrls.html#hitby).

Filtering happens in the shared incoming-contact check, before guard chip,
damage, hitpause or target capture. Rejected root/helper attacks remain
available; rejected projectile contacts do not retire the projectile or stop
its movement/lifetime clock. Normal HitDef `damage=hit,guard` now supplies
guard damage; the earlier explicit `guard.damage` override remains supported.

The per-tick hitpause snapshot is shared by binding/effect clocks and helper
contact gating. A helper cannot attack on its last frozen tick merely because
its remaining pause counter was decremented to zero. Read-only Wasm actor
snapshots expose `hitPauseThisTick`, `hitFilter1Time` and `hitFilter2Time`.

Local validation:

- 176 JVM and 171 compiled-Wasm tests pass, including 18 new common scenarios
  for mask combinations, exact lifetimes, hitpause renewal/expiry, slot clearing,
  bad requests, helper/projectile contacts, guards, custom states and replay.
- Exported Wasm tests execute timed protection → expiry → guarded contact with
  authored chip damage, indefinite protection → explicit clearing → hit, and
  helper state re-entry with all frozen contact ticks preserved. Repeated
  render queries leave filter clocks unchanged.
- Two 600-tick public KFM structural replays match, with three contacts and zero
  unsupported diagnostics on that trace. This remains separate from native
  common-state physics and original-character timing parity.
- All 16 adapter/import/download checks and the production browser smoke pass,
  including actual sprite/effect painting, mixed-coordinate import, CSV export
  and the 360px layout.

Matching currently uses the incoming HitDef's authored attribute fields.
Native actual-attacker-state quirks and exact per-tick phase parity still need
capture comparison. Ikemen's extended attr/slot syntax and time values below
-1 are explicitly unsupported. This does not implement HitOverride, global
pause/superpause, full guardstun, juggling, native throws or physical-phone FPS.
The established main CI and public release flow continue to verify browser/APK
asset identity and anonymous downloads.

## Public-download and projectile continuation — November 15, 2026

Continues published main source `95b6257`. Public `main` and its CI run return
HTTP 200, but CI artifact downloads require Actions access and expire after
retention. The user reported a source/CI-download 404. Successful main builds
now publish commit-pinned development releases containing the Android APK,
browser bundle, build metadata and SHA-256 checksums. Downloads do not depend
on an authenticated Actions session. Release drafts publish only after every
asset uploads, and pull requests cannot invoke publication. Preparation checks
the exact source SHA and compares all non-hidden browser assets to their APK
counterparts before producing downloads. CI also downloads every published
asset without authentication and verifies its checksum. Existing website
deployment is unchanged. GitHub's default-branch setting remains `gh-pages` because the
connected integration lacks repository administration permission; source work
continues on `main`.

Kotlin projectiles now retain their own launch-facing direction. The Projectile
controller captures it before deferred entity creation, so a later Turn in the
same controller tick cannot reverse spawn offset, velocity, hitboxes or sprite
facing. Later creator turns also leave existing shots unchanged. Projectile
knockback uses this captured direction; independently fired opposite shots and
helper-owned shots remain independent. This does not add projectile clashes,
multi-hit behavior or native frame-phase parity.

Local validation: 158 JVM tests and 153 compiled-Wasm tests pass, including
eight new shared projectile-facing scenarios. Exported Wasm tests execute
Projectile → same-tick creator Turn → forward collision → directional
knockback and retirement. The bundled KFM 600-tick replay remains deterministic
with three contacts and zero unsupported diagnostics on that trace.
All 16 adapter/import/download checks and packaged-browser checks pass. Release
preparation also succeeds on the previous green CI's real browser/APK pair;
negative tests reject wrong-source, missing-engine and changed-engine artifacts.

## Main-branch promotion — November 15, 2026

The user explicitly designated the Kotlin/WASM rewrite as the new `main`.
This continuation promotes coordinate-space source `0333280` and its preceding
AIR timing, custom-state, binding and effect work. The earlier publication hold
is superseded by that instruction. GitHub's previous default was `gh-pages`;
that branch and its published website remain separate from source promotion.

Standard `dev`, `build`, `test` and Android commands now select Kotlin/WASM.
`npm test` executes JVM/Wasm tests, adapter/import checks, exported ABI tests
and deterministic KFM replay. `npm run build` compiles Wasm before packaging
the browser app. Explicit `*:core` and `*:reference` commands retain access to
the earlier JavaScript engine. Package/lockfile metadata and the README now
identify the Kotlin application; native parity remains explicitly unverified.

The default development server redirects `/` to the Kotlin UI and loads the
compiled engine from `dist-kotlin/wasm`. The production worker keeps its
deployment-relative Wasm path, including installation under a subdirectory.

The new **Kotlin/WASM Main** workflow follows the checked-out push/PR commit
instead of a pinned feature branch. It tests portable Kotlin and the actual
browser UI, generates required import fixtures, and passes the tested browser
artifact to an Android job. The APK verifier compares the embedded Wasm and
browser assets byte-for-byte. Workflow permissions are read-only; CI creates
downloadable artifacts without publishing the website.

Local checks pass: 150 JVM tests, 145 compiled-Wasm tests, 13 adapter/import
checks, exported Wasm scenarios and deterministic 600-tick KFM replay. Both
the packaged browser verifier and a real `npm run dev` match render actual
sprites with the Kotlin runtime. Native MUGEN/IKEMEN parity and physical-phone
performance remain open; changing the source default does not certify them.

## Coordinate-space continuation — November 15, 2026

Continues local effects source `6ea3c82`. Supported spatial controllers now
convert authored character units into the canonical fixed-point stage space.
The active state owner's localcoord width determines Pos/Vel/P2Dist expression
units, StateDef velocity, position/velocity controllers, HitDef velocities,
helper/projectile offsets, binding offsets and Explod motion. Transfers between
320-wide and 1008-wide states preserve existing physical positions and
velocities; SelfState restores the actor's own script units. Own -2 controllers
retain the active state's units while using their own state/resource namespace.

Character scaling is uniform `320/localcoord.width` on both axes. Localcoord
height remains viewport metadata. Body widths, gravity and Head/Mid anchor
constants use the actor's own definition. AIR boxes use their animation owner's
coordinates and Size scales, with one rational conversion per coordinate;
1008-wide geometry no longer truncates an intermediate 81/256 scale. Push
separation and P2BodyDist select each actor's facing-dependent body width.

Render plans expose complete `pixelScaleX`/`pixelScaleY`, combining authored
coordinate/Size or effect scales, stage projection and camera zoom. Canvas uses
these transforms directly. AIR offsets and sprite pixels now share a transform;
the adapter's arbitrary sprite magnification/cap is removed. Effect scale is
independent of fighter Size. Read-only Wasm snapshots expose active and own
localcoord widths. Scale-only ModifyExplod patches preserve stored spatial
values even after the creator changes state coordinate systems.

Local validation:

- 150 JVM and 145 compiled-Wasm tests pass, including 15 new common coordinate
  scenarios covering inverse conversion without drift, equivalent replays,
  mixed-resolution custom states, HitDef/TargetState, bindings, helpers,
  projectiles, effects, collision precision, gravity, landing and rendering.
- Exported ESM/Wasm tests exercise a 1008-wide attacker capturing a 320-wide
  victim, foreign-state entry, TargetBind, SelfState and complete pixel scales.
  Repeated render snapshots preserve the simulation state.
- Two 600-tick public KFM structural replays match, with three contacts and zero
  unsupported diagnostics on that trace. This does not establish native physics
  or common-state recovery parity.
- 13 adapter/import checks, production Wasm/browser builds and Chromium smoke
  pass. Public KFM art with synthetic 1008x756 metadata reaches actual Canvas
  effect painting with Kotlin's planned transforms. Standard effects, RAR
  companion import, CSV export and the 360px Android layout also pass.

The earlier 320x240 guards on state transfers, bindings and effects are removed
for this supported subset. Existing horizontal movement/facing conventions and
partial common-state physics still need native capture comparison. Original
Nu-13/Tomoka fights, complete localcoord-dependent triggers/controllers, native
phase parity, physical-phone performance and a new APK remain unverified.
Advanced Explod resource/viewport/palette/pause limitations still apply.
Source remains local; PR publication awaits explicit authorization following
the earlier automatic approval rejection.

## Explod continuation — November 15, 2026

Continues local binding source `59f67fe`. Kotlin now owns the basic
`Explod`, `ModifyExplod`, `RemoveExplod`, `ExplodBindTime` and `NumExplod`
paths. Effects use the creator's own AIR/SFF resource bank, including helpers;
their animation, movement, acceleration, lifetime and binding are independent
of fighter collision geometry. A global budget bounds live effects to 512.

Supported positioning is `p1`, `p2` and stage-relative `none`, with mirrored
facing, vertical facing, scale, sprite priority and ontop ordering. DEF version
metadata selects the legacy p1 default or the MUGEN 1.1 none default. Bound
effects follow final actor axes. Finite bind times expire, zero releases,
and -1 remains bound. Birth frames and animation resets preserve the first
AIR element; ModifyExplod preserves total age and the removal deadline.
Default removetime=-2 retires on animation completion, -1 persists, positive
values count simulation ticks, and zero retires before presentation.

Creation, modification, count and removal are owner-scoped. Candidate patches
validate before any selected effect changes. Effects can opt into owner
hitpause; removeongethit responds to hit/guard contacts. Helper destruction
detaches surviving effects; DestroySelf removeexplods=1 removes them. Common
argument splitting is shared with the binding controllers.

Render plans own effect order, frame, coordinates, flips and scale. The Canvas
adapter paints those commands without applying fighter-size magnification to
effects. Zero scale stays zero. Repeated rendering and skipped presentation
do not advance effects. New read-only Wasm `ktCoreExplods` snapshots and
per-actor `numExplods` expose the effect lifecycle.

Local validation:

- 135 JVM and 130 compiled-Wasm tests pass: 20 new common effects scenarios
  plus original KFM state 191 wood-effect creation, motion and retirement.
- Actual exported Wasm tests exercise birth frames, motion, layers, lifetime,
  ModifyExplod, zero scale, ExplodBindTime, removal and read-only snapshots.
- Two 600-tick KFM fight replays match, with three contacts and zero unsupported
  diagnostics on that trace. Forced state 191 still exposes the separate,
  unimplemented common F5 audio expression; its Explod paths succeed.
- 13 adapter/import checks and the browser build pass. Chromium imports public
  KFM art with a synthetic CNS effect and paints actual Explod sprites; its
  Canvas transform matches Kotlin's authored scale. RAR companion import,
  CSV export and the 360px Android layout also pass.

This is a bounded effects subset. Creators/source scripts require 320x240
coordinates, scale is limited to 0..64, and viewport postypes, common F animation
banks, palettes, blend modes, rotation and advanced pause parameters produce
explicit diagnostics. Native per-tick phase parity, physical-phone performance
and a new APK remain unverified. This source is committed locally; GitHub
publication still awaits explicit approval after automatic review blocked PR
creation.

## Actor-binding continuation — November 15, 2026

Continues the tested AIR timing source `79b0c96`. Adds `TargetBind`,
`BindToParent`, `BindToRoot` and `BindToTarget` to Kotlin/commonMain. These
controllers support hit-ID selection, mirrored offsets, Foot/Head/Mid target
anchors, parent/root facing, finite durations, indefinite `time=-1`, and
explicit release with `time=0`. Head and mid points come from authored CNS
`[Size] head.pos` / `mid.pos`; their defaults are (0,-90) / (0,-60).

Helpers now advance after root controllers and before the shared binding
and contact phase. Attachments resolve recursively from anchors to children
after movement/arena policy and before root/helper collisions. This phase
change ensures collision geometry and render plans use the same attached
positions. Bound actors keep their stored velocity, state and animation
clocks; attachments override arena push, clamp, gravity and landing while
active. The duration clock freezes in the bound actor's hitpause. Anchors
can still move while that actor is paused. Deleted anchors release followers.

Validation precedes target mutation: missing anchors, malformed expressions,
cycles, cross-fight references and unsupported coordinates are diagnosed.
All-target requests preflight their full selection. The existing initial
helper-binding extension now preserves spawn offsets instead of snapping to
zero. Nested P1-owned helpers/projectiles use the P1 sprite resource side.
Wasm snapshots expose read-only `boundTo` and `bindTime` fields.

Local validation:

- 114 JVM and 110 compiled-Wasm tests pass, including 17 new common binding
  scenarios for lifetime, release, facing, nesting, hitpause, contacts, invalid
  requests and deterministic replay under skipped presentation.
- Exported ESM/Wasm tests execute HitDef capture → TargetBind → release, plus
  actual Helper → BindToParent → projected sprite → release. Repeated render
  snapshots do not consume binding time.
- Two 600-tick real bundled KFM replays match, with three contacts and zero
  unsupported diagnostics on this trace.
- 13 adapter/import checks, browser build and Chromium smoke pass for actual
  sprites, RAR companion extraction, CSV and the 360px Android layout.

Bindings currently require 320x240 coordinates for executor/source/anchor;
nonstandard or mixed-localcoord binding requests fail with a diagnostic.
The shared actor phase and pause-lifetime policy have synthetic coverage,
not a new native capture. Full helper destruction/inheritance, native throw
parity and physical-device measurements remain open. This continuation is
committed locally; external PR publication still awaits explicit approval.

## AIR timing continuation — November 15, 2026

Continues the custom-state work in draft PR #78. Kotlin now implements
`AnimElem = n[, operator t]`, `AnimElemTime`, `AnimElemNo`, signed `AnimTime`,
`AnimExist` and `SelfAnimExist`. The old `AnimElem = n` interpretation tested
the current sprite number for its whole duration; it now tests the authored
element start time. KFM's original `AnimElem = 3, -1` restores control one
tick before element 3. Its original `AnimTime = 0` exits state 1052.

AIR actions share immutable cumulative timing metadata. Each actor keeps an
independent tick/cycle clock, honors LoopStart (or loops to element 1 when
omitted), and exposes zero remaining time for one tick at each finite loop
boundary. Infinite elements hold their sprite while elapsed time advances.
ChangeAnim/ChangeAnim2 element selection initializes the correct time origin.
Snapshot/render-plan timing fields are read-only. Invalid elements, absent
animations and malformed legacy syntax produce diagnostics and fail closed.

The timing contract follows the [MUGEN trigger reference](https://network.mugenguild.com/justnopoint/1.0docs/trigger.html),
including the exception that an element-start trigger does not re-fire at the
loop seam; `AnimTime = 0` detects that seam. This is documented-semantics and
synthetic coverage, not a new native capture or full pause-phase certification.

Validation:

- 97 JVM tests and 93 compiled-Wasm tests pass, including 14 new common timing
  tests and a test executing KFM's original state 1052 from `public/kfm.zip`.
- The exported Wasm ABI checks negative element offsets, one-tick PosAdd,
  signed remaining time, render snapshots, looping and recovery transitions.
- Two real KFM 600-tick replays are deterministic, with three contacts and
  zero unsupported diagnostics on this trace (previously one AnimElem error).
- Focused adapter/import checks, browser build and Chromium smoke pass for
  real sprites, RAR companion import, CSV and the 360px Android layout.

Remaining timing limits: zero-duration AIR frames retain the existing
one-tick normalization; full native display/logic clock separation during
ChangeAnim in hitpause is unimplemented. A nonzero AnimElemNo offset after an
explicit element jump beyond an earlier infinite frame is diagnosed rather
than guessed. Mixed-localcoord custom states, native combat parity, a new APK
and physical-phone performance are outside this source milestone.

## Custom-state continuation — November 15, 2026

Based on the separate Kotlin/Wasm 0.7 channel in draft PR #77. That channel
owns combat, AI, clock and render planning in Kotlin and shares its Wasm
module between browser and Android. The production JavaScript site remains
separate. The Phase III section below is historical, not the status of the
current Kotlin browser adapter.

This continuation adds captured HitDef targets, `TargetState`, `ChangeAnim2`
and real `SelfState` ownership restoration. Borrowed CNS executes on the
victim's variables and uses the script owner's state bank. AIR ownership is
independent of sprite-resource ownership. `ChangeState` remains in the
borrowed bank; `ChangeAnim` selects the victim's own AIR. Own -2 controllers
continue during custom states; own -3/-1 are suppressed. Optional HitDef
`p2stateno`/`p2getp1state` applies the same path to root and helper hits.

`CustomStateTest` is a shared JVM/Wasm synthetic contract suite, not an
Elecbyte reference capture. Transfers with different DEF localcoord values
are explicitly rejected with a diagnostic. This does **not** establish
Nu-13/Tomoka throw parity, general CNS/ZSS completeness or phone performance.
No new deployment or Android release is implied by these source changes.

Validation of this continuation:

- 82 JVM tests and 79 compiled-Wasm tests pass, including 13 new common
  custom-state regressions (the other three tests are JVM archive checks).
- Exported Wasm ABI executes an actual HitDef → TargetState → ChangeAnim2 →
  ChangeState → SelfState sequence with observable script/AIR owner IDs.
- The 600-tick real bundled KFM smoke replays deterministically and records
  three contacts. One unsupported `AnimElem = 3, -1` expression remains;
  this is structural execution evidence, not complete KFM gameplay parity.
- Browser build and headless Chromium smoke pass: actual SFF sprites,
  Wasm-backed RAR companion imports, CSV export and Android 360px layout.
  This run did not build or install a new APK or test physical-phone FPS.

## Historical Phase III (review-only)

PR: https://github.com/celerycore/kenjatime/pull/12

**Production engine is unchanged.** This is an experimental deterministic
combat runtime, not a completed MUGEN / Ikemen GO clone. The browser app must
continue using its JavaScript CoreSession until the release gates below pass.

## Implemented and exercised

- Kotlin Multiplatform Gradle project: JVM conformance tests, real Node-hosted
  Kotlin/Wasm tests, browser Wasm compilation and actual ESM/Wasm ABI calls.
- Independent fighter state, 60 Hz simulation, 1/256-pixel position math,
  deterministic seeded random variables, bounded resource counts.
- MUGEN .DEF, .AIR (including LoopStart), .CMD and partial .CNS/.ST import.
  Critically, CMD [StateDef -1] move-selection controllers now load alongside
  CNS/ST state programs, not just the physical motion-command definitions.
- Authored fighter [Data], [Size] and [Movement] constants (life, body widths,
  sprite scales, basic gravity). Multiple fighter definitions stay isolated.
- Cached and bounded CNS expressions (variable references, math, Boolean
  operators, commands, state comparisons and inclusive [a,b] ranges).
  Unknown expressions produce diagnostics and evaluate false.
- CMD default timings, directional input edges, same-frame F+a, released
  charge requirements, buffer windows and double-tap recognition (partial CMD).
- Simple StateDef controllers, per-state persistent scheduling and
  ignorehitpause. Guard/block, contact priorities, trades, hitpause,
  authored hit definitions, life/power, some utility controllers and events.
- Alternate var()/fvar()/sysvar()/sysfvar() assignments, simple parent
  variables and integer/float variable isolation.
- Bounded helper/projectile foundations and clean destruction. Helpers share
  immutable definitions but not mutable actor data.
- Optional stage bounds, player push, gravity, landing, and visual-only
  camera tracking; optional first-round INTRO/ROUND/FIGHT/KO/OUTRO state machine.
- Presentation event queue for PlaySnd/StopSnd. **Actual audio playback is
  still a browser adapter responsibility.**
- Opt-in JS adapter: setup, stage, round flow, snapshots, contact/events,
  resource counts, checksum debug, and fast advance without string allocation
  on every simulation tick. No switch to the live Three.js renderer/worker.

## Real KFM evidence — not native parity

The CI repository contains the original bundled `public/kfm.zip`.
Its DEF/CMD/CNS/ST/AIR sources are parsed, including CMD -1 controllers.
A 600-tick two-fighter simulation on compiled Kotlin/Wasm directly exercises
KFM's authored inputs and a forced state 200 move. This runs the character's
scripts; it does **not** reproduce the original native 147-scenario suite.

A successful historical run, [42913647525](https://github.com/celerycore/kenjatime/actions/runs/42913647525), recorded:

- 600 ticks; 152 non-idle player frames, three contact events.
- Zero unsupported-runtime diagnostics on that tested input path.
- Two separately constructed Wasm fights replayed to an identical checksum.
- 0.4733 ms/simulation tick in a hosted GitHub runner **for that particular
  input trace**, not a mobile FPS benchmark, and not render/audio cost.

Later commits add a per-tick command-activation cache and a zero-string-allocation
advance API. Use a fresh CI artifact/benchmark to evaluate their final
performance. No universal native timing or command reachability is claimed.

## Character compatibility gates

| Character | Verified on this migration | Not yet proven |
| --- | --- | --- |
| KFM | Real repo ZIP parses and executes authored states inside compiled Kotlin/Wasm; deterministic replay | All 147 native gameplay scenarios, every animation/hitbox and recovery, full common-state exactness |
| Dark Donald | Isolated command, priority, hitpause, camera and round-sequence tests; optionally parse extracted original scripts | Original uploaded RAR is not in this Git checkout; real intro/air combo/AI/camera full battle not run under Kotlin |
| Rare Akuma | 60-type authored controller inventory compared with Kotlin implemented subset; synthetic helper/projectile and variable contracts | Original archives absent from this checkout; 2007/2026 ZSS/complex helpers/projectiles/full effects and AI cannot be certified |

**Important reference discrepancy:** Existing JavaScript Core's strict native
comparison currently matches **1 of 147** KFM captured scenarios, and the
16-interaction suite reports guard/position differences. CI runs these audits
as visible *nonblocking diagnostics*. Passing a JavaScript test or running
an authored Kotlin move does not certify Kotlin/native MUGEN parity.

## Remaining release-blocking work

1. Full CNS/ST/ZSS expression and controller semantics (hit overrides,
   juggling, throws, target state/binds, actual KFM hit and KO common states,
   recovery, full pause/superpause and entity lifetime rules).
2. Exact command motion semantics (all modifiers, persistent buffers, remaps
   and physical facing-crossing edge cases), gameplay-side AI.
3. SFF v2 sprite decode, full AIR extension semantics, original effect
   packs, renderer/audio adapter and browser match worker integration.
4. Native-capture *tick-for-tick* comparisons on KFM 147 cases, Dark Donald,
   both Rare Akuma versions, intros/KO/outros, helpers and projectiles.
5. Physical Android GPU/CPU/memory and input-latency measurements at or
   better than the current deployed JavaScript engine.

## Reproduce the independent tests

```sh
./android/gradlew -p kotlin-core jvmTest
./android/gradlew -p kotlin-core wasmJsNodeTest
./android/gradlew -p kotlin-core wasmJsBrowserProductionWebpack
node --test test/core/kotlin-wasm-backend.test.js test/core/kotlin-parity-status.test.js
node --experimental-wasm-modules scripts/core/verify-kotlin-wasm-module.mjs
node --experimental-wasm-modules scripts/core/benchmark-kotlin-wasm.mjs
```

For local extracted original source-only checks:

```sh
KENJATIME_DARK_DONALD_DIR=/path/to/extracted/dark-donald \
KENJATIME_RARE_AKUMA_DIR=/path/to/extracted/rare-akuma \
  ./android/gradlew -p kotlin-core jvmTest
```

These source-only checks are **not** full character execution parity. Do not
merge to production or enable a default Kotlin battle until the strict gates
are actually passed. Every unsupported controller and resource gap must
remain visible.
