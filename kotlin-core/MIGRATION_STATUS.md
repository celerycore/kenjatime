# Kenjatime Kotlin/Wasm combat migration

## Current victory quote and hit count continuation — November 18, 2026

Continues published main source `a4f2cd0`. VictoryQuote selects from
`victory0` through `victory99` in the executing fighter's CNS `[Quotes]`
sections. Omitted, out-of-range and missing indexes select a deterministic
fallback from the available quotes. Helpers leave the root's selection alone.
Quoted text uses the same escapes as clipboard text.

The winner can select a quote during the outro with Win. Lose and DrawGame
also read the recorded round result. Kotlin resolves the quote when the
existing single-round flow finishes. The browser shows the result and
displays the quote as text. Ties and fighters without quotes have no quote.
Starting another match clears the previous quote.

HitCount sets a signed 32-bit manual count from a numeric expression,
truncating fractional values toward zero. It shares the HitCount trigger
and StateDef hitcountpersist rules with HitAdd. HitAdd retains its existing
nonnegative saturation rules. Invalid assignments preserve the count.

Verification passed on 1,306 JVM, 1,301 Wasm and 32 adapter tests. The
exported Wasm checks cover both winning sides, draws and signed manual
counts. Chromium exercises the selected quote in a completed match,
preserves literal markup in the text and clears it on restart. Both
600-tick KFM replays match the previous combat checksum.

Controller-name coverage reaches 90 of 97 (92.8%), up from 88 of 97
(90.7%). Seven types remain (7.2%): Pause, SuperPause, RemapPal, MakeDust,
GameMakeAnim, ForceFeedback and ModifyPlayer. The Elecbyte 1.1 overlap is
83 of 89 (93.3%). Overall engine completion also requires broader parameter
coverage, multi-round and team flow, automatic combo counts, and native
timing and behavior verification.

## Previous sound channel continuation — November 18, 2026

Continues published main source `0305157`. SndPan updates a playing actor's
named sound channel. PlaySnd and StopSnd now control playback of samples from
imported SND files. Kotlin resolves voice ownership, channel priority, volume,
pitch, looping, duration and panning. The browser scans asset headers, decodes
samples and plays them using the resolved Web Audio parameters.

PlaySnd captures value, channel, volumescale or legacy volume, lowpriority,
freqmul, loop, and pan or abspan. Own S-prefixed values and nested numeric
expressions are supported. Explicit channels belong to individual actors. Automatic -1
voices are independent and do not claim named channels. A lower-priority
request cannot interrupt an occupied named channel. Invalid parameters preserve
existing voices atomically. Missing registered samples are diagnosed without
stopping an earlier channel owner. Helpers own separate channels and use their
real root's SND resources, including while executing borrowed state banks.

Relative pan captures actor position and facing plus one active-bank coordinate
conversion, relative to the current camera center. Absolute pan is independent
of actor position/facing/camera. Kotlin maps canonical +/-160 to the left/right
speakers and clamps to -1..1. Scripts use SndPan to update a sound as an actor
moves. StopSnd on a named channel stops that actor's voice. Channel -1 stops
every voice in the fight. An unguarded hit stops the voice on channel zero.
Destroying a helper cleans up its voices. Samples continue playing across state
changes and hitpause. Persistent and ignorehitpause gate controller execution.

Platforms register immutable original sample frame/rate catalogs before the
first tick. Finite lifetimes use ceil(frames*60/rate/freqmul). Loops persist until
stopped. Portable users without catalogs retain the original ktCoreEvents
request metadata. ktCoreSounds and ktCoreSoundEvents expose pure voice/event
inspection. The worker forwards events after every simulation tick, including
ticks whose render snapshots are skipped. Kotlin advances audio on the simulation
clock. Sound controllers leave combat checksums unchanged in the replay tests.

The adapter reads the bundled KFM's twelve real PCM WAV samples, accepting both
zero and EOF SND terminators and older unpadded final WAV chunks. Imported sound
files remain optional. Decoding happens on demand with two concurrent decoders
and at most 32 queued requests. Active buffers stay pinned within a shared
32 MiB cache with up to 256 entries. Decoded output is limited to 16 MiB before
decoding, accounting for resampling. Stop-before-decode and match-generation
checks prevent late/stale playback. The Sound checkbox mutes the output without
changing Kotlin voices, UI pause suspends the audio context with the fight,
and reset releases hardware voices and cached buffers.

Validation

- 1301 JVM and 1296 compiled-Wasm tests pass, including 34 new common cases for
  catalogs, durations, volume/pitch/loops, priority/replacement, captured pan,
  mixed banks, helper ownership, stops, hit cleanup, hitpause/persistence,
  destruction, resource bounds, pure inspection and physical independence.
- Exported Wasm checks 288 coordinate/side/facing/pan/pitch/loop sequences,
  six root/helper channel lifecycles and six borrowed-bank routes. Tests cover
  low-priority preservation, ordered replacement/stop packets, original sample
  lifetimes, correct resource banks and checksums unchanged by inspection.
- All 32 adapter/import/download tests pass. Sixteen new cases cover original
  KFM WAV metadata, PCM/float formats, odd data/pointers, malformed assets,
  unchanged source bytes, pending-pan updates, stop/decode races, generation
  isolation, shared buffers, decoder concurrency, pinned cache limits, oversized
  decode rejection and mute/pause/natural hardware cleanup.
- Production Chromium checks pass. Ten imported KFM audio phases measure actual
  left/right output signals and resolved StereoPanner/Gain/PlaybackRate values,
  testing panning, priority, pitch, volume, replacement, helper separation,
  global stop and finite expiry. UI pause, mute/unmute and reset are verified.
  Prior sprite/import/clipboard/CSV/mobile-layout scenarios pass.
- Two 600-tick KFM replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and power 485/415.

Measured controller-name coverage is 88 of 97 in the live legacy JavaScript
registry (90.7%), up from 87 of 97 (89.7%). Nine names remain outside the Kotlin
contract. Elecbyte 1.1 overlap is 82 of 89 (92.1%). Whole engine completion
also requires work on parameters, expressions, physics, effects, AI, teams,
physical phone performance and native behavior parity.
Common F sound banks, compressed WAV codecs, full native channel counts/stealing,
attenuation/pan/gain/round/pause phases, hardware latency/audio focus and physical
phone output remain incomplete or unverified. Current limits are 32 voices per
actor and 128 per fight, named channels 0..255, pitch .0625..16, volumescale
0..100, legacy volume -256..256 and authored pan -100000..100000. Asset limits
are 4096 samples and 32 MiB per SND bank. Supported WAVs use mono or stereo
integer PCM at 8/16/24/32 bits or float32.

Elecbyte controller references for this implementation are
[PlaySnd](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#playsnd),
[SndPan](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#sndpan) and
[StopSnd](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#stopsnd).

## Previous reversal continuation — November 18, 2026

Continues published main source `47a31bc`. ReversalDef now captures a required
reversal.attr state/attack mask and optional id, pausetime, p1stateno,
p2stateno and p2getp1state. Requests validate finite expressions, attributes,
supported keys and known state destinations before changing the attack window.
Pause pairs use the existing nested-expression parser and 0..120 bounds.
State IDs accept -1 to disable a route; target IDs are bounded nonnegative
integers. Borrowed code evaluates the executing actor's variables and retains
the bank that executed the definition for later custom-state ownership.

Reversal contacts resolve before ordinary body/helper damage. They require
opposing active attacks, matching captured HitDef attributes and intersecting
Clsn1 boxes; hurtboxes do not participate. Existing canonical geometry includes
facing, Size/localcoord and display offsets. HitBy/NotHitBy and HitOverride
reaction routes do not prevent an attack from being reversed. Destroyed/dead
actors, hitpaused actors and spent or already neutralized attacks are excluded.
Candidates use deterministic distance/actor-ID order, with at most one success
per reverser per tick. Real projectile entities are outside this subset.

A success neutralizes the enemy attack, records MoveHit for the reverser and
exclusive MoveReversed for the attacker, captures the target ID and applies
independent pauses. It does not apply ordinary damage, power gains, hit stun,
knockback or GetHitVar mutation. Optional p1/p2 state routes use captured bank
ownership; p2getp1state=0 chooses the victim's own bank. Unknown victim-own
destinations reject the contact before either window is consumed. Destination
StateDef movehitpersist controls whether move results survive these transfers.
Reversals can retain a non-gethit attacker as a target until its next state
change, supporting the existing target binding/drop paths without inventing
a hit reaction. Existing gethit-target lifetime rules remain in effect.

HitDef and ReversalDef share an exclusive attack window. The current engine's
state-window policy retains a spent/neutralized window across repeated controller
evaluation; ordinary state entry resets it, hitdefpersist retains it, and a
valid definition can replace a carried window. MoveHitReset clears MoveReversed
with other move flags without rearming an attack. MoveReversed advances once
per active actor tick and freezes in hitpause; normal contact clears it.
The ID expression reads the executing actor's stable ID, including helpers in
borrowed code. ktCoreReversals exposes pure per-tick contacts and actor/window/target metadata;
root snapshots also expose the reversed flag and elapsed trigger value.

Validation:

- 1267 JVM and 1262 compiled-Wasm tests pass, including 42 new common cases for
  attribute classes, attack-only/absent/edge/mirrored geometry, offsets, mixed
  coordinates, pause pairs/clocks, atomic errors, exclusive windows, persistence,
  custom banks, target binding/drop/cleanup, helpers, deterministic competition,
  death, projectile exclusion, pure reads and independent fights.
- Exported Wasm checks 324 mixed-coordinate/side/attribute/geometry/state-route
  scenarios across 320, 640 and 1008-wide banks and 12 root/helper contacts.
  Checks include cancelled damage/power, neutralized windows, captured state
  ownership and canonical destination velocities, pause/result metadata,
  preserved targets and unchanged checksums during inspection.
- All 16 adapter/import/download tests and production Chromium checks pass.
  Imported public KFM sprites exercise both reversal sides, cancelling a
  900-damage enemy attack, painting both follow-up animations and retaining full
  health. Authored clipboard messages verify MoveHit, MoveReversed, targets and
  borrowed custom-state execution through the browser worker. Prior scenarios
  pass.
- Two 600-tick KFM replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and power 485/415.

Measured controller-name coverage is 87 of 97 in the live legacy JavaScript
registry (89.7%), up from 86 of 97 (88.7%); 10 names remain outside the Kotlin
contract. Elecbyte 1.1 overlap is 81 of 89 (91.0%). Overall rewrite completion
remains unmeasured: complete parameters, expressions, physics, effects, AI,
teams, physical-phone performance and native behavior parity still need work.
Projectile reversals, reversal-vs-reversal arbitration, native repeated-controller
replacement/rearming, sparks/hitsound/sparkxy, temporary native invincibility,
native GetHitVar side effects, juggling/teams and exact contact/state/pause
ordering remain incomplete or unverified. Unsupported controller parameters
are diagnosed atomically rather than silently accepted.

Semantics use the [Elecbyte ReversalDef reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#reversaldef)
and [MoveReversed reference](https://network.mugenguild.com/justnopoint/1.1docs/trigger.html#movereversed),
with attack cancellation checked against IKEMEN GO sources. Synthetic contacts
and browser evidence do not certify native frame-for-frame parity.

## Previous afterimage continuation — November 17, 2026

Continues published main source `59b7bd6`. AfterImage now keeps an actor-owned,
bounded history of immutable sprite poses. Captures retain canonical world
position, facing, animation/resource-bank metadata, frame offsets/flips, signed
draw scale, AngleDraw rotation, display offsets and sprite priority. They do not
retain mutable actors/animations or collision boxes. History advances only in
the fight's 60 Hz tick, after controller/motion/contact phases, including actor
hitpause. Skipped draws, hidden sprites and inspection cannot resample it.

Time, length, timegap and framegap control duration and sampling. Defaults are
1, 20, 1 and 4. Time -1 is indefinite; zero time or length clears the history.
The length-slot ring follows MUGEN-style sampling: length 12/framegap 3 selects
recorded-frame offsets 2, 5 and 8. Length 1 has no usable past slot. Capacity
is at most 60 poses per actor and at most 59 visible trails; older poses drain
through the ring after a finite duration. In this compatibility window, the
default time 1 produces no visible trail at timegap 1. Requests replace all
configuration and discard previous history atomically after validation.

AfterImageTime accepts time or its value alias (time takes precedence), retimes
an existing active history without discarding poses or its sampling phase, and
cannot start an absent history. Zero or one stops it, matching the compatibility
stop behavior. Normal persistent/ignorehitpause scheduling gates requests.
State changes retain existing histories. Helpers have separate histories even
when sharing a palette; destroying a helper removes its trails from the plan.
Borrowed animations retain captured visual coordinates after SelfState.

Palette parameters include palcolor, palinvertall, palbright, palcontrast,
palpostbright, paladd and floating palmul. Base luminance/inversion/brightness/
contrast/post-brightness is followed by repeated additive/multiplicative
progression for the visible trail rank, then the current AllPalFX. Live local
PalFX and Trans do not replace the trail's own color/blend. Repeated layers
are compact descriptors rather than growing JSON arrays. Canvas preserves
source alpha and uses existing normal/add/add1/sub painters and bounded caches.
Historical world poses use the current camera and stage shake; Kotlin sorts
them by captured priority, below the current actor, with older trails behind
newer ones. ktCoreAfterImages exposes pure, on-demand clock/capacity metadata.

Validation:

- 1225 JVM and 1220 compiled-Wasm tests pass, including 34 new common cases for
  defaults, ring bounds, sampling, wind-down, duration aliases, atomic failures,
  captured expressions/poses/transforms, helpers/destruction, borrowed banks,
  hitpause/persistence, palette progression, priority endpoints, live camera
  projection and independence from combat/checksum/presentation cadence.
- Exported Wasm checks 288 coordinate/side/gap/duration/blend histories across
  320, 640 and 1008-wide banks, comparing historical transforms and AIR metadata
  against earlier live poses. Six root/helper lifecycles verify independent
  retiming, preserved sampling phase, stop semantics and pure inspection.
- All 16 adapter/import/download tests and production Chromium checks pass.
  Eleven RGBA cases cover post-brightness and 58 repeated floating color layers
  in addition to prior palette math. Imported public KFM sprites verify ten
  timed trail phases, visible history positions, mirroring, base/progressive/
  global color, all four blend modes, zero/one stop, restart, finite expiry,
  continued helper trails, stable paint order and cache bounds. Prior browser
  scenarios pass.
- Two 600-tick KFM replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and power 485/415.

Measured controller-name coverage is 86 of 97 in the live legacy JavaScript
registry (88.7%), up from 84 of 97 (86.6%); 11 names remain outside the Kotlin
contract. Elecbyte 1.1 overlap is 80 of 89 (89.9%). Overall rewrite completion
remains unmeasured: complete parameters, expressions, physics, effects, AI,
teams, physical-phone performance and native behavior parity still need work.
Native capture/pause/round phase parity and palette coefficient accumulation/
rounding/invertblend, the documented nonunit-timegap retime bug, IKEMEN's newer
length+1 ring, projectile/Explod afterimage.* parameters, shaders, shadows and
reflections are not certified by these checks. Duration is bounded to
-1..36000, length to 0..60, gaps to 1..32767, color to 0..256, additive channels
to 0..255, contrast to 0..65536 and floating palmul to 0..64.

Semantics use the [Elecbyte AfterImage reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#afterimage)
and MUGEN compatibility sampling in [IKEMEN GO](https://github.com/ikemen-engine/Ikemen-GO/blob/master/src/char.go).
Synthetic histories and actual Canvas pixels do not certify native frame parity.

## Previous palette effects continuation — November 17, 2026

Continues published main source `40a1a8c`. PalFX, AllPalFX and BGPalFX now
capture finite numeric expressions for time, add, mul, color, invertall and
sinadd. Time defaults to zero (cancel); -1 lasts indefinitely. Positive effects
show for the authored number of ticks, with the first sine sample at age zero.
Each request replaces the whole effect and restarts its wave. Invalid fields,
expressions, counts or bounds preserve an earlier effect atomically. Normal
persistent/ignorehitpause gating controls requests; existing visual clocks
advance once per fight tick through actor hitpause, independently of drawing.

Roots own separate palette families. Helper, Projectile and Explod ownpal
defaults to zero and shares the immediate creator's family; nonzero captures
an independent family. PalFX on a non-owning helper cannot overwrite its
creator's effect. Sharing survives nested helpers and creator destruction,
and every retained family ages only once even when several actors/effects
reference it. ModifyExplod cannot change palette ownership after creation.
Borrowed state banks use executing-actor values without rescaling colors or
changing palette ownership. AllPalFX additionally affects independent families;
BGPalFX affects the current stage and HUD colors without affecting sprites.

Kotlin resolves ordered local-then-global sprite layers and background/HUD-
then-global colors. Each layer mixes luminance, inverts, adds (including the
integer sine contribution), multiplies and clamps RGB; final bytes round down.
The Canvas adapter transforms decoded RGBA without changing alpha, then applies
the existing AIR/Trans blend. Decoded sprites, palette variants and subtraction
masks share a 32 MiB/256-entry per-character LRU budget; a reusable scratch RGBA
buffer is bounded by the existing two-million-pixel sprite limit (8 MiB).
Production painting performs no pixel readback. ktCorePalettes provides pure,
on-demand effect clocks and palette-family ownership inspection.

Validation:

- 1191 JVM and 1186 compiled-Wasm tests pass, including 34 new common tests for
  defaults, expiry/replacement, sine direction, atomic errors, RGB ordering,
  scope composition, hitpause/persistence, borrowed banks, pure reads, ownpal
  families and retained children/projectiles/Explods after creator destruction.
- Exported Wasm checks 108 coordinate/side/scope/duration/wave sequences and
  three retained nested helper/projectile/Explod families across 320, 640 and
  1008-wide state banks. Resolved stage/HUD colors and repeated inspection are
  checked independently of combat checksums.
- All 16 adapter/import/download tests and production Chromium checks pass.
  Nine RGBA cases check color math, saturation, ordering, unchanged source and
  exact alpha preservation. Imported public KFM sprites verify ten timed Canvas
  phases: add, multiply, grayscale, inversion, sine, background/HUD, global and
  combined scopes, own/shared helpers and expiry. Cache bounds and earlier
  browser scenarios pass.
- Two 600-tick KFM replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and power ending
  485/415. Palette requests do not change collision boxes or combat state.

Measured controller-name coverage is 84 of 97 in the live legacy JavaScript
registry (86.6%), up from 81 of 97 (83.5%); 13 names remain outside the Kotlin
contract. Elecbyte 1.1 overlap is 78 of 89 (87.6%). Overall rewrite completion
remains unmeasured: complete parameters, expressions, physics, effects, AI,
teams, physical-phone performance and native behavior parity still need work.
Native combined-shader/rounding parity, palette selection/remaps, automatic
HitDef/Projectile palfx.* effects, global Pause/SuperPause timing, extended
hue/sinmul/sincolor/invertblend/redirectid and complete stage/motif/fallback
visuals are outside this validated subset. Sine periods are bounded to
-36000..36000 (zero disables); duration to -1..36000, additive channels to
-100000..100000, multipliers to 0..65536 and color to 0..256.

Semantics use the [Elecbyte PalFX controller reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#palfx)
and shared-family behavior in IKEMEN GO. Synthetic clocks and actual Canvas
pixel checks do not certify native MUGEN frame-for-frame or shader parity.

## Previous debug clipboard continuation — November 17, 2026

Continues published main source `92fc6e9`. DisplayToClipboard replaces actor
debug text, AppendToClipboard adds a new line to nonempty text, and ClearClipboard
erases it. Text survives state changes and hits; roots/helpers and independent
fights have separate stores. Borrowed banks evaluate the executing actor's
variables without changing text ownership or rescaling dimensionless values.
Persistent/ignorehitpause gating uses the existing controller scheduler.

Formats support d/i/f/F/e/E/g/G, percent escapes, sign/space/zero/left/alternate
flags, widths through 512 and precision through 20, with at most six numeric
params. Quoted text supports newline, four-space tabs, backslash and quote
escapes, semicolons and Unicode. CNS parsing preserves text/params quoting and
escaped quotes during comment scanning. Invalid formats, counts, expressions,
extra keys and size violations preserve the whole earlier message; invalid
ClearClipboard requests cannot erase it. Raw/formatted messages are bounded
at 8192 UTF-16 characters, and appending retains the newest 8192 characters.

Expression values now retain integer/floating type metadata through literals,
variables, arithmetic, comparisons, math functions and the chosen lazy ifelse
branch. Type mismatches use default formatting for the actual type, as described
by the controller reference. Existing numeric calculations are unchanged.
Scientific numeric literals are accepted with checked exponents. Formatting
derives exact decimal digits from binary64 bits and rounds to nearest with ties
to even, avoiding platform-specific toString/toFixed behavior. Compiled formats
and decimal expansions use bounded immutable-value caches.

ktCoreClipboards exposes on-demand actor/root IDs and JSON-escaped text without
advancing simulation. Normal render plans contain no clipboard payload. The
browser's optional CNS debug output panel requests data only while open, shows
root/helper labels and uses textContent for all authored text. Closing the
panel stops updates while simulation continues; reopening reads current text.
Stopping clears the displayed state. No operating-system clipboard is accessed.

Validation:

- 1157 JVM and 1152 compiled-Wasm tests pass, including 32 new cases for display,
  append/clear, quoting/escapes/Unicode, all format families, type propagation,
  mismatch defaults, exact rounding/ties/subnormals, invalid atomic requests,
  bounds, pause/persistence, helper/bank ownership and pure inspection.
- Exported Wasm matches 140 frozen C snprintf cases covering binary64 floats,
  signed int32 values, signs, widths, precision, general/scientific notation,
  negative zero, subnormal and maximum finite values. The reference fixture is
  regenerated by scripts/core/generate-clipboard-oracle.py with LC_NUMERIC=C.
- Wasm also checks six coordinate/side root/helper lifecycles, independent
  stores, JSON escaping and borrowed-bank text retained after SelfState.
- All 16 adapter/import/download tests and production Chromium checks pass.
  Imported public KFM art/CNS verifies visible formatted text, append/clear and
  helper isolation, literal markup, on-demand open/close behavior, continued
  simulation while hidden, reopening and stop cleanup. Prior scenarios pass.
- Two 600-tick KFM replays retain nine contacts, seven fallback recoveries, zero
  unsupported diagnostics, matching physical checksums and power ending 485/415.

Measured controller-name coverage is 81 of 97 in the live legacy JavaScript
registry (83.5%), up from 78 of 97 (80.4%); 16 names remain outside the Kotlin
contract. Elecbyte 1.1 overlap is 75 of 89 (84.3%). Overall rewrite completion
remains unmeasured: full parameters, expressions, physics, effects, AI, teams,
physical-phone performance and native behavior parity still need work. The C
printf reference verifies numeric formatting, not native MUGEN gameplay parity;
side-effecting expressions, native float32 calculations and native/version-specific
formatting or clipboard row limits remain outside this subset.

## Previous Trans/AIR transparency continuation — November 17, 2026

Continues published main source `74b097c`. Trans now resolves default, none,
add, addalpha, add1 and sub into final sprite blend descriptors. Additive modes
accept two finite integer alpha expressions in 0..256, truncating after range
validation. Default alpha pairs are 256/256 for add, 256/0 for addalpha and
256/128 for add1. Sub fixes both alphas at 256; none restores ordinary opaque
sprite painting. Valid alpha arguments on non-additive modes do not change
their fixed behavior. Malformed/unknown parameters preserve an earlier valid
override atomically.

Default clears the controller override and restores the current AIR frame's
blend. AIR now retains and resolves A, A1, S and ASnDm separately from H/V flip
and collision boxes. Unsupported AIR transparency is diagnosed during fighter
initialization with a normal visual fallback. Resolution is cached per immutable
frame. Animation ownership selects the AIR blend, including ChangeAnim2 and
borrowed animations retained after a state-bank return. Helpers have independent
Trans overrides; projectiles and Explods use their own AIR flags without
inheriting the creator's Trans.

Overrides clear before every actor controller pass, including hitpause, matching
the MUGEN 1.1 rule. Standard ignorehitpause can reassert on paused ticks;
persistent gating and same-tick state transitions keep their existing behavior.
WinMUGEN's exception remains outside this contract. Alpha values are
dimensionless and use the executing actor's variables without localcoord scaling.
Rendering/inspection cannot advance animation or clear an override.

Kotlin owns final normal/add/sub descriptors and alpha values for every sprite.
The opaque Canvas host paints additive RGB as clamp(source*S/256 + dest*D/256)
inside the sprite mask, preserving transparent regions. Subtractive RGB is
max(dest-source,0), implemented with masked inversion/addition/inversion.
Subtraction lazily caches white alpha masks under the existing 32 MiB sprite
cache budget. Context state is restored after every paint. No pixel readback is
used by production rendering, and collision geometry, simulation checksums,
movement, health and power remain independent of visibility/blending.

Validation:

- 1125 JVM and 1120 compiled-Wasm tests pass, including 29 new cases for AIR
  parsing/defaults/fallback, every Trans mode and alpha endpoint, expressions,
  atomic errors, expiry, pause, persistent gating, borrowed banks/animations,
  helper/effect isolation, fully transparent attacks and pure reads.
- Exported Wasm checks 72 coordinate/facing/mode/alpha sequences, six AIR flag
  cases and independent fighter/helper/projectile/Explod blend descriptors.
- All 16 adapter/import/download tests and production Chromium checks pass.
  An independent 36-case RGB matrix checks the actual host painter, transparent
  holes, untouched pixels, mirroring and context restoration. Imported public
  KFM art verifies ten timed CNS/AIR modes against decoded source pixel colors
  and a known backdrop, including saturation, subtraction, AIR restoration,
  expiry, invisible sprites and zero/zero alpha. Prior browser checks still pass.
- Two 600-tick KFM replays retain nine contacts, seven fallback recoveries, zero
  unsupported diagnostics, matching physical checksums and power ending 485/415.

Measured controller-name coverage is 78 of 97 in the live legacy JavaScript
registry (80.4%), up from 77 of 97 (79.4%); 19 names remain outside the Kotlin
contract. Elecbyte 1.1 overlap is 72 of 89 (80.9%). Overall rewrite completion
remains unmeasured: full parameters, expressions, physics, effects, AI, teams,
physical-phone performance and native behavior parity still need work. Partial
alpha/rotated-edge native parity, extended AIR metadata, CNS Explod transparency
parameters and palette effects are not certified by these blend checks.

## Previous AssertInput continuation — November 17, 2026

Continues published main source `4294fee`. AssertInput now queues actor-local
input for the next simulation input sample. It supports flag/flag2/flag3,
literal U/D/L/R/F/B directions and a/b/c/x/y/z/s buttons, with quoted lists,
plus/pipe/comma/whitespace separators and the documented literal aliases in
AssertedInputs.kt. Multiple valid requests union their bits. Entire requests
validate before changing the queue; unsupported keys/flags, empty flags and
malformed quotes preserve earlier queued input.

Forward/back resolve to physical left/right at controller execution, using the
executing actor's facing. Later facing or state-bank changes do not reinterpret
those captured bits. Queued inputs merge with the next raw physical sample and
are consumed once, including in hitpause. They never change current-tick command
results or invalidate the command cache during a controller pass. Normal
persistent/ignorehitpause gating governs new requests. Continuous assertions
produce a press, held samples and a release through Kotlin's existing command
buffer, including multi-sample motion commands and guarding.

Input sampling now routes raw physical input to keyctrl helpers from their real
root. Helpers retain independent buffers and assertion queues: a root assertion
does not become a helper's physical input. Nested keyctrl helpers use root CMD
definitions even when their immediate parent has keyctrl disabled. Non-keyctrl
helpers receive no physical input and retain no command definitions, but their
own asserted bits can still be sampled. Destroyed helpers do not sample inputs.
Inactive round phases discard root queues and clear helper buffers/queues;
intro/KO controller requests cannot leak into later active combat.

ktCoreInputs provides on-demand sampled and pending direction/button bitmasks
for roots/helpers, including real-root IDs. Button mask bits 0..6 represent
abcxyzs. Inspection and rendering never consume queues or resample inputs.
No browser-side command or input simulation is added.

This subset retains opposite direction bits like existing physical samples.
Configurable SOCD resolution, input remapping, extra IKEMEN buttons, redirectid,
complete pause/input scheduler phases and native timing parity remain open.
AssertInput is an IKEMEN extension, outside the Elecbyte 1.1 controller list.

Validation:

- 1096 JVM and 1091 compiled-Wasm tests pass, including 33 new cases for queued
  delivery, press/hold/release, motion commands, physical merging, facing,
  invalid atomic requests, command caching, hitpause, state transitions,
  helper/nested-helper isolation, round gating, guarding and pure reads.
- Exported Wasm checks 48 coordinate/facing/side/input sequences, six nested
  helper routing sequences and borrowed-bank assertion followed by SelfState.
- All 16 adapter/import/download tests and production Chromium checks pass.
  Imported public KFM art with synthetic CNS/CMD verifies command-driven press,
  hold and release sprite poses plus simultaneous independent helper input,
  actual Canvas transforms and painted helper sprites. Earlier scenarios pass.
- Two 600-tick KFM replays retain nine contacts, seven fallback recoveries, zero
  unsupported diagnostics, matching physical checksums and power ending 485/415.

Measured controller-name coverage is 77 of 97 in the live legacy JavaScript
registry (79.4%), up from 76 of 97 (78.4%); 20 names remain outside the Kotlin
contract. Elecbyte 1.1 overlap remains 71 of 89 (79.8%). Overall rewrite
completion remains unmeasured: full parameters, expressions, physics, effects,
AI, teams, physical-phone performance and native behavior parity still need work.

## Previous ScreenBound continuation — November 17, 2026

Continues published main source `9bdf2a2`. ScreenBound now controls configured
horizontal arena constraints and independent X/Y camera eligibility. Omitted
value and movecamera components default to false; one movecamera component sets
X only. Finite numeric expressions use the executing actor's variables and
nonzero boolean semantics. Invalid expressions, malformed component lists and
unsupported parameters preserve the entire earlier assertion.

Assertions last one active tick, survive actor hitpause and reset before the
next active controller pass. Standard persistent and ignorehitpause gating
applies. Roots normally constrain to the configured arena and track both axes;
helpers normally do neither. Helper requests affect the helper, including when
executed from a borrowed state bank. Dimensionless flags need no localcoord
conversion. State changes do not prematurely clear the active-tick assertion.

Disabling bounds bypasses configured horizontal limits and Width edge insets,
including during body pushing. Body widths, contact geometry, velocity, gravity,
landing and bindings retain their existing behavior. Opted-in helpers clamp
against the same limits; destroyed, bound or hitpaused helpers skip direct
clamping. No stage/camera is invented for unconfigured headless simulations.

The existing camera follows eligible roots/helpers using per-axis extents for
center and zoom. A single tracked actor excludes an untracked distant opponent;
an untracked axis holds position. With neither axis tracked, position and zoom
hold exactly. Default helpers are excluded, and destroyed helpers cannot affect
tracking. Default two-root behavior retains the preceding camera calculation.
Snapshots expose the three root flags and render plans expose cameraX alongside
cameraY/zoom, without advancing camera or controller lifetimes during reads.

This bounded subset uses existing arena edges. Native screen viewport margins,
MUGEN-version-specific stage bounds, camera tension/zoom phase ordering, teams
and exact native camera/binding behavior remain incomplete or unverified.

Validation:

- 1063 JVM and 1058 compiled-Wasm tests pass, including 30 new cases for defaults,
  atomic invalid requests, expiry, pause, persistent gating, Width/push/binding
  interaction, helper constraints, independent camera axes, zoom, borrowed banks,
  offstage contacts and read-only inspection.
- Exported Wasm checks 48 coordinate/facing/bounds/camera-axis sequences and
  three helper coordinate sequences for opt-in clamping, camera eligibility and
  next-tick expiry.
- All 16 adapter/import/download tests and production Chromium checks pass.
  Imported public KFM art with synthetic CNS verifies actual Canvas transforms
  outside arena limits, re-enabled constraints, camera tracking and frozen
  position/zoom after tracking is disabled. Prior browser scenarios still pass.
- Two 600-tick KFM replays retain nine contacts, seven fallback recoveries, zero
  unsupported diagnostics, matching physical checksums and power ending 485/415.

Measured controller-name coverage is 76 of 97 in the live legacy JavaScript
registry (78.4%), up from 75 of 97 (77.3%); 21 names remain outside the Kotlin
contract. Elecbyte 1.1 overlap is 71 of 89 (79.8%). Overall rewrite completion
remains unmeasured: full parameters, expressions, physics, effects, AI, teams,
physical-phone performance and native behavior parity still need further work.

## Previous attack/fall-shake continuation — November 17, 2026

Continues published main source `7f8be96`. HitDef and Projectile now capture
envshake.time/freq/ampl/phase and fall.envshake.time/freq/ampl/phase as immutable
attack metadata. Every accepted body, helper or projectile contact may start the
impact shake, including a guarded contact. Rejected contacts have no effect.
Zero-time metadata leaves an existing global shake intact. A fresh unguarded
hit replaces pending fall data, including clearing it when no fall shake was
authored; guard preserves the prior pending fall data without arming new data.

FallEnvShake starts the pending fall shake and consumes only its time field.
It requires neither the current MoveType H nor a fall flag, and can execute
after SelfState. GetHitVar supports all four fall.envshake fields. Pending time
does not count down before consumption. Active effects use the existing global
visual clock, including through actor hitpause. Standard persistent and
ignorehitpause gating applies; repeated consumption does not restart the effect.
No automatic common-state landing execution is claimed: the authored controller
must run. Extra controller/shake parameters and invalid numeric metadata are
diagnosed before replacing an attack or queuing a projectile.

Shake units, bounds and defaults match the existing direct EnvShake subset:
time defaults to zero; frequency defaults to 60 degrees/tick; phase defaults to
zero below 90 degrees/tick and 90 at or above it. Default amplitude is -4
canonical pixels. Explicit integer amplitudes convert through the attack's
active state bank exactly once. Incoming fall data retains canonical amplitude;
GetHitVar converts it through the recipient's current bank for queries. Neither
later facing/variable changes nor borrowed-state transitions rescale the effect.

Validation:

- 1033 JVM and 1028 compiled-Wasm tests pass, including 25 new cases for capture,
  contact rejection, guarded contacts, pending replacement, one-shot consumption,
  pause gating, coordinate banks, helper isolation, multi-hit projectiles,
  delayed projectiles, atomic invalid metadata and pure presentation reads.
- Exported Wasm checks 48 coordinate/source/facing/guard/default sequences and
  borrowed-bank GetHitVar queries followed by SelfState consumption.
- All 16 adapter/import/download tests and production browser checks pass.
  Imported public KFM art with synthetic CNS verifies impact displacement,
  deferred fall displacement, expiry, actual Canvas actor transforms and stage
  pixels. Prior browser scenarios remain passing.
- Two 600-tick KFM runs retain nine contacts, seven fallback recoveries, zero
  unsupported diagnostics, matching physical checksums and power ending 485/415.

Measured controller-name coverage is 75 of 97 in the live legacy JavaScript
registry (77.3%), up from 74 of 97 (76.3%); 22 names remain outside the Kotlin
contract. Elecbyte 1.1 overlap is 70 of 89 (78.7%). This is not an overall
rewrite-completion percentage: full parameters, expressions, physics, effects,
AI, teams, physical-phone performance and native behavior parity remain open.

## Previous environment-effects continuation — November 17, 2026

Continues published main source `fd5ecda`. CNS now executes EnvShake and EnvColor.
Each fight owns separate visual state and advances it once at the start of a
simulation tick, before controllers may replace it. Rendering reads never age
effects. Actor hitpause does not stop these global clocks; normal controller
pause gating and ignorehitpause still govern requests. Later valid root/helper
requests win in controller order, while invalid requests preserve the earlier
complete effect. State changes and creator destruction do not reset the clock.

EnvShake requires time and supports frequency, integer amplitude and phase.
Omitted frequency is 60 degrees/tick; phase defaults to zero below 90 degrees/tick
and 90 at or above it. Default amplitude is -4 canonical pixels independently of
character resolution. Explicit integer amplitude converts through the active
state bank. The sine displacement reverses the signed amplitude so a negative
amplitude starts downward. Phase is normalized only for the wave calculation.
New effects present age zero on their creation tick. Zero duration cancels the
shake, and zero frequency with an explicit phase can hold a displacement.

EnvColor defaults to white, one tick and over-scene mode. It accepts three RGB
integer expressions and an under flag. A duration of -1 persists indefinitely;
zero cancels it. Under-color replaces the stage backdrop while retaining normal
draws. Over-color hides roots, helpers, projectiles and ordinary Explods, retaining
OnTop Explods above the solid fill. Simulation entities remain alive and active;
contacts, health, power and clocks continue independently of visibility.

Kotlin emits the global environment descriptor, completed actor/effect positions
and projected stageOffsetY. The Canvas host applies the same displacement to its
stage art, paints the solid color and consumes Kotlin's filtered painter order.
HUD rendering remains above these scene effects. Logical camera coordinates,
movement, binding axes, attack/hurt boxes and guard proximity remain unchanged.
ktCoreEnvironment provides on-demand clock/parameter inspection; render plans
also include cameraY for projection checks.

The bounded subset accepts finite durations up to 36000 ticks, color duration
-1, RGB 0..255, frequency 0..180, amplitude -100000..100000 local pixels and phase
-1000000..1000000 degrees. Extra IKEMEN parameters are diagnosed. Defaults and
nested expressions evaluate on the executing actor; borrowed banks affect only
explicit spatial units, not effect ownership or the default canonical amplitude.

Validation:

- 1008 JVM and 1003 compiled-Wasm tests pass, including 27 new cases for defaults,
  duration/expiry, indefinite color, atomic invalid requests, expressions, phase,
  frequency/amplitude, both hitpause behaviors, persistence, helper precedence,
  borrowed units, fight isolation, OnTop layers, unchanged contacts and pure reads.
- Exported Wasm checks 36 coordinate/frequency/duration/amplitude sequences,
  18 color/visibility sequences across roots/helpers/projectiles/Explods, global
  lifetimes through borrowed states and immutable inspection/presentation.
- All 16 adapter/import/download checks and production browser checks pass.
  Imported public-KFM-art CNS verifies actual Canvas RGB pixels for under/over
  color and expiry, surviving OnTop sprite pixels, decoded painter order and
  projected shake displacement. All prior browser scenarios remain passing.
- Two KFM 600-tick runs retain nine contacts, seven fallback recoveries, zero
  unsupported diagnostics, the preceding physical checksum and matching power
  traces ending at 485/415.

Measured controller-name coverage is now 74 of 97 in the live legacy JavaScript
registry (76.3%), up from 72 of 97 (74.2%); 23 names remain outside the Kotlin
contract. Elecbyte 1.1 overlap is 69 of 89 (77.5%). Name counts do not measure
overall completion: parameters, expressions, physics, effects, AI, teams and
native behavior parity still require further work.

Semantics follow the [EnvShake reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#envshake)
and [EnvColor reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#envcolor).
HitDef/FallEnvShake integration, advanced shake parameters, full stage foreground/
motif layers, global pause policies, native frame parity and physical-phone
performance remain incomplete or unverified. Main CI verifies shared browser/APK
Wasm identity and anonymous permanent downloads before publication.

## Named-map continuation — November 17, 2026

Continues published main source `2d743be`. CNS now executes MapSet, MapAdd,
RootMapSet and RootMapAdd. Stores contain finite single-precision numbers,
matching the existing legacy engine. Addition starts at zero for an unset key;
each complete write/add result is rounded once to float32. Overflow, nonfinite
inputs, invalid names, missing parameters and unsupported options diagnose the
request without replacing an earlier value or inserting a new entry.

Names are case-insensitive, limited to 128 UTF-16 characters and cannot contain
NUL. Each actor can hold 4096 entries; existing keys remain writable at capacity.
Map(name), Map("name") and single-quoted literal names read the executing actor's
store. Missing reads return zero without insertion. Wrong arity, numeric and
computed read keys diagnose unsupported expressions. Map reads are live within
the controller phase, including immediately after earlier writes.

The importer reads repeated Map sections in source order, accepting numeric
literals and bounded constant expressions in the existing grammar. Invalid
defaults diagnose individually while valid defaults remain usable. Actors and
helpers receive independent copies of definition defaults; helpers do not copy
their parent's current mutable values. State entry and borrowed banks preserve
owned maps. Values are dimensionless and do not rescale with localcoord.

Root controllers called by a helper write the topmost actual root's store while
evaluating expressions against the executing helper's variables/maps. They do
not redirect to a borrowed state bank or stop at an intermediate helper. Root
controllers on root actors are no-ops. Destroyed roots cannot receive writes;
cyclic parent chains diagnose instead of mutating a store. Standard controller
persistence and ignorehitpause gating apply to local and root writes.

On-demand ktCoreNamedMaps exports root/helper IDs and stores in stable actor
order, with escaped JSON keys. Regular actor snapshots expose namedMapCount
instead of copying potentially large stores every frame. Read-only expressions,
inspection and presentation do not add entries or reset named state. A fresh
fight starts from definition defaults; complete native round/reset policies
remain separate work.

Validation:

- 981 JVM and 976 compiled-Wasm tests pass, including 27 new cases for defaults,
  expressions, actor isolation, same-phase reads, key forms, float32 rounding,
  invalid/atomic requests, capacity/overflow, persistence, pause, nested helpers,
  root ownership, destroyed/cyclic ancestry, borrowed banks and pure reads.
- Exported Wasm checks 36 coordinate/side/operation/default sequences, four
  nested-root sequences, JSON key round trips, float32 results and a borrowed
  bank/SelfState sequence that preserves the executing actor's store.
- All 16 adapter/import/download checks and production browser checks pass.
  Imported public-KFM-art CNS exercises all four map controllers: helper writes
  advance the root's counter, which changes its painted animation and resets
  through an authored cycle. All prior browser scenarios remain passing.
- Two KFM 600-tick runs retain nine contacts, seven fallback recoveries, zero
  unsupported diagnostics, the preceding physical checksum and matching power
  traces ending at 485/415.

Measured controller-name coverage is now 72 of 97 in the live legacy JavaScript
registry (74.2%), up from 68 of 97 (70.1%); 25 names remain outside the Kotlin
contract. These four are IKEMEN extensions, so the Elecbyte 1.1 reference overlap
remains 67 of 89 (75.3%). Name counts do not quantify overall completion:
parameters, expressions, physics, effects, AI, teams and native parity still
require further work.

Scope follows the existing JavaScript numeric-map implementation and
[IKEMEN map controller ownership](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/bytecode.go).
Indexed/typed maps, computed keys, assignment expressions, parent/team variants,
complete native reset policies and physical-phone performance remain incomplete
or unverified. Main CI verifies shared browser/APK Wasm and anonymous downloads.

## Guard-distance continuation — November 17, 2026

Continues published main source `d999d35`. CNS now executes AttackDist with a
required integer value, nested expressions and active state-bank coordinate
conversion. Negative values floor to zero. Inputs are bounded to -100000..100000
local pixels; invalid values/keys preserve the current range and HitDef.
Updating range preserves the attack window and struck-target set, so it cannot
rearm a spent attack. Standard persistence and ignorehitpause behavior apply.

The importer reads own Size.attack.dist and Size.proj.attack.dist, defaulting
to 160 and 90 local pixels. Body range resets to own defaults on ordinary state
entry and carries through hitdefpersist states. Explicit HitDef guard.dist and
Projectile guard.dist/projguard.dist convert once through active-bank units.
An omitted body HitDef range inherits the current value, including an earlier
AttackDist in the same controller phase. An accepted explicit range replaces
it; ignored same-window HitDefs do not replace it. Projectiles capture their
range and launch facing independently of later creator changes.

InGuardDist now reads a latched proximity result instead of the former fixed
90-pixel absolute-distance approximation. CNS sees the preceding pass, regardless
of which root executes first. After actor movement/bindings, attacking MoveType A
roots/helpers contribute strictly forward distances greater than zero and less
than their range. Temporary drawing offsets, body widths and vertical separation
do not change this X-axis test. Both roots and opposing helpers can receive the
flag; same-side actors do not threaten each other in the two-root team model.

Projectiles contribute after movement/clashes, before contact exhaustion, and on
birth. Paused/miss-delayed shots retain proximity; a final active lifetime tick
may contribute. Canceled, exhausted, zero-range and invalid-attribute projectiles
are excluded. The latch resets each pass; read-only expressions and render plans
cannot refresh it. Snapshot JSON exposes guardDistance256/inGuardDist, and
projectile snapshots expose captured guardDistance256. Physical contact blocking
keeps its separate posture/input rules; automatic common-state guard entry is
still separate work.

Validation:

- 954 JVM and 949 compiled-Wasm tests pass, including 25 new cases for defaults,
  strict boundaries, facing, controller order, invalid/atomic requests, integer
  units, state persistence, hitpause, spent HitDefs, borrowed banks, helper teams,
  projectile capture/movement/pause/final lifetime and immutable latch reads.
- Exported Wasm checks 24 coordinate/attacking-side/range latch sequences,
  eight helper/projectile default captures and a borrowed-bank/SelfState reset.
- All 16 adapter/import/download checks and production browser checks pass.
  Imported public-KFM-art CNS changes a defender's animation from InGuardDist
  as AttackDist alternates between enabled and zero ranges. Actual decoded
  sprite painting is verified alongside all earlier browser scenarios.
- Two KFM 600-tick runs retain nine contacts, seven fallback recoveries, zero
  unsupported diagnostics, the preceding physical checksum and matching power
  traces ending at 485/415.

Measured controller-name coverage is now 68 of 97 in the live legacy JavaScript
registry (70.1%), up from 67 of 97 (69.1%); 29 names remain outside the Kotlin
contract. The Elecbyte 1.1 overlap is 67 of 89 (75.3%). These name counts do not
measure overall rewrite completion: parameters, expressions, physics, effects,
AI, teams and native behavior parity still require further work.

Semantics follow the [Elecbyte AttackDist reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#attackdist)
and existing JavaScript/native-source guard proximity conventions. Complete
affectteam/team rules, common-state automatic guarding, exact native contact/
removal phases and physical-phone performance remain incomplete or unverified.
Main CI verifies shared browser/APK Wasm identity and anonymous public downloads.

## Display-offset continuation — November 17, 2026

Continues published main source `8c88f34`. CNS now executes Offset with optional
x/y expressions. Each supplied axis replaces its current value; omitted axes
retain earlier assertions in the same tick. Empty controllers are no-ops.
Both transient axes reset every tick, including hitpause. Normal controllers
stay gated in hitpause, while ignorehitpause=1 can reassert translation. Standard
controller persistence and state-entry rearming apply. Invalid requests reject
both axes together, preserving an earlier valid assertion. Inputs are bounded
to -100000..100000 local pixels and converted once through the active state
bank into canonical fixed-point coordinates, preserving fractional inputs.

The importer also reads own Size.draw.offset, separately from borrowed state
and animation resources. Its X component mirrors with facing; Offset controller
X remains world-aligned. Y components add directly. The combined translation
shifts sprite origins and body/helper AIR attack/hurt boxes without changing
logical position, velocity, body widths, binding axes or camera tracking.
Rotation, drawing scale and AIR frame offsets remain separate sprite transforms;
they do not rotate/scale the display translation or collision rectangles.

P1/P2 Explods now spawn and bind at the translated display origin. Unbound
effects retain their captured position, and absolute effects/projectiles keep
their independent origins. Collision conversion retains a Long origin until
each complete vertex is saturated, avoiding early-clamp errors near Int limits.
Snapshots expose drawOffsetX256/Y256 and combined displayOffsetX256/Y256.
Render plans include projected axisX/Y and displayOffsetX256/Y256 for inspection;
the Canvas host continues painting Kotlin's completed commands directly.

Validation:

- 929 JVM and 924 compiled-Wasm tests pass, including 28 new cases for authored
  defaults, sparse axes, invalid/atomic requests, fractional units, both facings,
  expiration, pause, persistence, borrowed animations, helper ownership, actual
  attack/hurt contacts, logical bindings, attached/unbound effects, wide origins
  and immutable presentation reads.
- Exported Wasm checks 36 coordinate/facing/angle/offset combinations, attached
  Explods, 20 translated body/helper/projectile contact scenarios, hitpause and
  independent own metadata through a borrowed-animation/SelfState sequence.
- All 16 adapter/import/download checks and production browser checks pass.
  Imported public-KFM-art fixtures verify actual Canvas translation at localcoord
  320/640, both facings, rotation, signed fractional offsets and expiration,
  alongside translated effect anchors and all previous browser checks.
- Two KFM 600-tick runs retain nine contacts, seven fallback recoveries, zero
  unsupported diagnostics, the preceding physical checksum and matching power
  traces ending at 485/415.

Measured controller-name coverage is now 67 of 97 in the live legacy JavaScript
registry (69.1%), up from 66 of 97 (68.0%); 30 names remain outside the Kotlin
contract. The Elecbyte 1.1 reference overlap is 66 of 89 (74.2%). Name counts do
not measure complete parameters, expressions, physics, effects, AI, teams or
native behavior parity. Overall rewrite completion remains unquantified.

Semantics follow the [Elecbyte Offset reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#offset)
and the existing JavaScript/native-source translation conventions. Exact native
collision/attachment phases, WinMUGEN hitpause exceptions, offset-dependent
size-box/Clsn2 push eligibility and physical-phone performance remain unverified.
Main CI verifies browser/APK Wasm identity and anonymous permanent downloads.

## Body-space continuation — November 17, 2026

Continues published main source `d9e5d46`. CNS now executes PlayerPush and Width.
PlayerPush requires a numeric value; zero disables body pushing and nonzero
values enable it. Roots default to enabled, helpers to disabled. Either actor
disabling its push check permits overlap while leaving attack contacts, damage,
velocity, state/animation clocks and arena bounds active.

Width accepts independent player and edge front/back pairs, or value as shorthand
for both pairs. The shorthand cannot be combined with player or edge. Omitted
pairs are zero; a single component defaults its back component to zero. Integer
components truncate before conversion from active state-bank units into canonical
fixed-point offsets. Nested expressions use the executing actor's variables.
Inputs are bounded to -100000..100000 local pixels. Invalid expressions, keys,
conflicting forms or bounds reject the complete request, preserving earlier
valid offsets. Later valid requests replace all four offsets together.

Player widths add signed offsets to the character's own base widths, independent
of the borrowed bank and sprite drawing scale. Effective widths floor at zero.
The CNS importer now honors Size air.front/air.back separately from ground widths;
missing air values retain the existing ground-width fallback. Facing selects the
front or back side. P2BodyDist retains its base-width path without temporary
Width offsets. AIR attack/hurt boxes remain unchanged.

Both assertions reset before each active controller phase and persist through
hitpause. Normal controllers stay gated there, while ignorehitpause=1 may replace
the retained values. Controller persistence and state-entry rearming still apply.
State transitions do not rescale stored canonical offsets or make a one-tick
assertion permanent. Snapshots expose playerPush and widthPlayerFront256,
widthPlayerBack256, widthEdgeFront256 and widthEdgeBack256.

The configured arena now applies each root's facing-relative edge insets when
clamping motion and distributing push travel. Negative insets cannot exceed
the configured hard bounds; crossed insets collapse to the arena midpoint.
The solver gives unused displacement to an opponent with remaining edge room,
using bounded Long arithmetic and no artificial separation when both widths are
zero. PosFreeze actors remain anchored, and bound actors stay excluded.
Global arena push disable still takes precedence without disabling edge insets.

Helpers may opt into pushing opponents using their own flags, widths and freeze
assertion; same-side actors do not push each other. Pair traversal is stable in
root/helper creation order. Helpers retain their default lack of screen bounds.
The arena still uses its bounded 50-pixel vertical eligibility policy; complete
native size-box/Clsn2 push checks, ScreenBound/camera margins, helper screen-bound
opt-in, team modes and corner-push/contact phases remain separate work.

Validation:

- 901 JVM and 896 compiled-Wasm tests pass, including 35 new cases for defaults,
  numeric flags, one-tick lifetime, persistence, invalid requests, independent
  pairs, shorthand, signed/zero widths, integer coordinate conversion, both
  facings, air widths, edge allocation, impossible insets, bindings, freeze,
  hitpause, helper teams, borrowed banks, contacts and pure presentation reads.
- Exported Wasm checks 32 coordinate/facing/width/push combinations through
  expiration, eight edge-inset sequences, retained/replaced hitpause assertions,
  four helper opt-in/freeze sequences and a borrowed-bank/SelfState sequence.
- All 16 adapter/import/download checks and production browser checks pass.
  An imported public-KFM-art fixture verifies actual Canvas actor positions
  through disabled pushing, widened separation and expired Width, with unchanged
  sprite scales. Existing angle, priority, coordinate, import, CSV and mobile
  layout checks remain passing.
- Two KFM 600-tick replays produce nine contacts, seven fallback recoveries,
  zero unsupported diagnostics and identical physical checksums/power traces,
  ending at 485/415 power. Final positions differ slightly from the preceding
  continuation because the authored air widths now participate in pushing.

Measured controller-name coverage is now 66 of 97 in the live legacy JavaScript
registry (68.0%), up from 64 of 97 (66.0%); 31 names remain outside the Kotlin
contract. The Elecbyte 1.1 reference overlap is 65 of 89 (73.0%). These are name
counts, not overall rewrite completion. Complete parameters, expressions,
physics, effects, AI, teams and native behavior parity remain incomplete.

Semantics follow the [Elecbyte Width reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#width)
and [PlayerPush reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#playerpush).
This continuation does not certify native frame parity or physical-phone
performance. Main CI verifies browser/APK Wasm identity and anonymous permanent
downloads before publication.

## Angle-drawing continuation — November 17, 2026

Continues published main source `8c9e795`. CNS now executes AngleSet, AngleAdd,
AngleMul and AngleDraw. Set/Add/Mul require a value and compose in controller
order. Their finite, unwrapped degree value belongs to the executing actor and
persists across ticks and state entry. They do not assert drawing by themselves.
AngleDraw optionally replaces that value and asserts rotation for the current
tick. Omitted scale defaults to 1,1; an explicit scale requires two components,
supports nested expressions and accepts signed or zero values within -64..64.
Malformed requests and arithmetic overflow diagnose without replacing an earlier
valid angle or either scale axis.

The draw assertion and both scale axes reset every actor tick, including
hitpause; the stored angle does not reset. Normal controllers follow hitpause
gating, while ignorehitpause=1 can update the angle and reassert drawing there.
Standard controller persistence applies, including persistent=0 rearming on
state entry. Helpers retain independent angles/scales. Borrowed banks evaluate
the executing actor's variables; degrees and dimensionless draw scales are not
converted through the bank's localcoord.

Kotlin now emits the complete 2x2 sprite transform. Positive angles rotate
counterclockwise facing right, with mirrored rotation facing left. Rotation
operates in canonical stage coordinates before unequal viewport X/Y projection.
Transforms include the animation resource's localcoord and Size, signed drawing
scale, AIR flips and rotated frame offsets about the actor axis. The Canvas
host applies the matrix and SFF sprite pivot directly. Only the display angle
is reduced modulo 360; stored arithmetic remains unwrapped. Actor snapshots
expose drawAngleDegrees, angleDraw, drawScaleX and drawScaleY. Render plans also
expose transformA/B/C/D and rotationDegrees.

Rotation and drawing scale do not change actor positions, velocities, hitboxes,
damage, contacts or clocks. Projectiles and Explods retain their own transforms
without inheriting the creator's actor draw assertion. Presentation reads do
not accumulate angle arithmetic or alter simulation. Stable priority ordering
from the preceding continuation remains in Kotlin.

Validation:

- 866 JVM and 861 compiled-Wasm tests pass, including 21 new cases for arithmetic,
  defaults, expressions, invalid requests, overflow, signed/zero scales, facing,
  coordinate projection, AIR offsets, persistence, hitpause, helpers, borrowed
  banks, unchanged collision/damage and pure reads.
- The exported Wasm ABI checks 64 coordinate/facing/angle/scale/AIR-flip transform
  combinations through active and expired drawing ticks, plus independent
  helpers, hitpause gating and borrowed-bank/SelfState sequences.
- All 16 adapter/import/download checks and production browser checks pass.
  A synthetic public-KFM-art import verifies actual Canvas matrices for both
  facings, oblique rotation and signed scales alongside existing sprite/effect,
  priority-ordering, coordinate, import, CSV and mobile-layout checks.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Measured controller-name coverage is now 64 of 97 in the live legacy JavaScript
registry (66.0%), up from 60 of 97 (61.9%); 33 names remain outside the Kotlin
contract. Against the Elecbyte 1.1 reference the overlap is 63 of 89 (70.8%).
These counts measure controller names, not complete parameters, expressions,
physics, effects, AI, team modes or native parity. Overall rewrite completion
remains unquantified; reaching every controller name would not complete it.

Semantics follow the [Elecbyte angle controller reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#angledraw).
Exact native pivot/flip/negative-scale behavior, WinMUGEN-specific hitpause,
extreme scale support, native frame parity and physical-phone performance remain
unverified. The existing 147-case native KFM parity target is not certified.
Main CI verifies shared browser/APK Wasm identity and anonymous permanent
downloads before publication.

## Sprite-priority continuation — November 17, 2026

Continues published main source `f92fdff`. CNS now executes SprPriority with a
required numeric value in the documented -5..5 range. Nested expressions and
actor variables are supported. The value persists until another controller or
an explicit StateDef sprpriority replaces it; omitted state metadata leaves it
unchanged. StateDef expressions evaluate on entry with the executing actor and
destination Time=0, including borrowed banks. Invalid controller requests or
state metadata preserve the previous value and diagnose the error. Invalid state
metadata does not cancel the transition. Initial diagnostics survive attachment.

The legacy SprPriority expression exposes the current actor value. It is a
scalar render value, independent of localcoord and collision/attack priority.
Helpers own their priority. Standard controller persistence and ignorehitpause
rules apply, and hitpause does not clear the stored value. Actor snapshots
expose spritePriority for inspection.

Projectile now captures projsprpriority, defaulting to the documented value of
three. It accepts signed Int-range expressions and retains them after creator
variables or actor priority change. Invalid values prevent queuing the shot.
This is separate from projpriority, which still controls projectile clashes.
HitDef p1sprpriority/p2sprpriority changes remain separate work.

Kotlin now constructs one stable painter order across roots, helpers,
projectiles and Explods, sorting ascending by visual priority. Higher values
are therefore painted later. Equal values retain deterministic roster/entity/
effect creation order. Explods can sit between actors instead of always being
partitioned around all fighters. OnTop effects retain their wide priority above
Int.MAX_VALUE, including extreme projectile priorities. Sorting never reorders
simulation entity/effect storage. Position, resource ownership, hitboxes,
contacts, clocks, health and power remain independent of this visual metadata.

The Canvas host consumes Kotlin's ordered draw commands directly. Its existing
QA interface now records actual decoded-sprite paint order for verification.
A synthetic public-KFM-art fixture changes root priority across a helper,
projectile and effect; Chromium verifies both resulting paint orders, including
actual drawImage calls rather than only checking planned JSON.

Validation:

- 845 JVM and 840 compiled-Wasm tests pass, including 22 new cases for values,
  expressions, StateDef entry/persistence, invalid requests, controller lifetime,
  pause, dynamic ordering, stable ties, mixed effects, helpers, borrowed banks,
  projectile draw/clash separation, bounds and pure reads.
- Exported Wasm checks 48 mixed actor/helper/projectile/effect and localcoord
  combinations with live actor-priority changes, two projectile-bound/OnTop
  sequences and an actor-owned borrowed-bank/SelfState sequence.
- All 16 adapter/import/download checks and production browser checks pass,
  including the new real Canvas sprite-priority ordering test, sprites/effects,
  scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Measured controller-name coverage is now 60 of 97 in the live legacy JavaScript
registry (61.9%), up from 59 of 97 (60.8%); 37 names remain outside the Kotlin
contract. Against the Elecbyte 1.1 reference the overlap is 59 of 89 (66.3%).
Name counts do not measure parameter completeness, expressions, physics, effects,
AI, team modes or native parity. Overall completion remains unquantified;
covering every controller name alone would not complete the rewrite.

Priority defaults and state persistence follow the
[Elecbyte SprPriority reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#sprpriority)
and [StateDef reference](https://network.mugenguild.com/justnopoint/1.1docs/cns.html#sprpriority).
Native exact tie ordering, HitDef p1/p2 priority changes, full visual effects,
common-state defaults and physical-phone performance remain incomplete or
unverified. These checks do not certify native frame parity. Main CI verifies
shared browser/APK Wasm identity and anonymous permanent downloads before publication.

## Position-freeze continuation — November 16, 2026

Continues published main source `06eb4c6`. CNS now executes PosFreeze to hold
both velocity-driven position axes for the current simulation tick. Omitted
value defaults to true, zero releases the hold and other numeric values enable
it. Nested expressions evaluate on the executing actor each time the controller
runs. A later PosFreeze in the same tick can override an earlier valid value.
Invalid values or unsupported parameters diagnose the request without replacing
an earlier valid flag.

The flag resets at the start of every actor tick, including hitpause. Normal
controllers are skipped in hitpause; ignorehitpause=1 can reassert the flag
there. Hitpause still independently freezes ordinary motion/clocks. Persistent
controllers retain their existing execution rules, so persistent=0 holds only
on its first eligible activation and rearms on state entry. State transitions
do not turn a one-tick flag into a permanent hold.

PosFreeze preserves velocity, State Time, animation progression, move-contact
clocks, authored velocity changes and arena gravity on active ticks. Releasing
the flag resumes integration using current velocity. Explicit PosSet/PosAdd
and resolved bindings remain authoritative placement operations; screen/arena
bounds still apply. The hold is not an invulnerability or animation-freeze flag:
frozen attackers execute HitDefs, frozen victims remain hittable and contacts
retain their normal damage/power/clock behavior.

In the configured two-root arena push policy, a frozen actor stays anchored
while an overlapping movable opponent receives the displacement within stage
bounds. Two frozen actors retain their positions. If the movable opponent is
pinned at an edge, overlap can remain rather than moving the frozen actor or
crossing the bound. Existing bound-actor push exclusions remain unchanged.
Helper body pushing and complete native corner-push behavior remain separate work.

Helpers maintain their own flag and motion. Borrowed banks read the executing
actor's variables, and neither localcoord nor facing rescales a boolean hold or
the already canonical retained velocity. Read-only snapshots and presentation
cannot assert or clear the flag. Wasm actor snapshots expose positionFrozen.

Validation:

- 823 JVM and 818 compiled-Wasm tests pass, including 22 new cases for defaults,
  flags, expiration, clocks, velocity, explicit placement, cancellation,
  expressions, invalid requests, persistence, pause, state transitions, arena
  pushing/bounds/gravity, collision eligibility, helpers, bindings, banks and
  pure presentation.
- Exported Wasm checks 24 localcoord 320/640, hitpause and freeze-mode sequences,
  four arena push-anchor combinations and two helper hold/resume sequences.
  Each verifies active clocks, retained/current velocity and immutable reads.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Measured controller-name coverage is now 59 of 97 in the live legacy JavaScript
registry (60.8%), up from 58 of 97 (59.8%); 38 names remain outside the Kotlin
contract. Against the Elecbyte 1.1 reference the overlap is 58 of 89 (65.2%).
Name counts do not measure parameter completeness, expressions, physics, effects,
AI, team modes or native parity. Overall completion remains unquantified;
covering every controller name alone would not complete the rewrite.

Controller behavior follows the
[Elecbyte PosFreeze reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#posfreeze).
Exact native binding/push/pause ordering, helper body pushing, corner push,
complete common-state physics and physical-phone performance remain incomplete
or unverified. These checks do not certify native frame parity. Main CI verifies
shared browser/APK Wasm identity and anonymous permanent downloads before publication.

## Move-contact timing continuation — November 16, 2026

Continues published main source `e930f68`. CNS now executes MoveHitReset,
clearing the current actor's MoveContact, MoveHit and MoveGuarded flags and
elapsed values. It accepts no controller-specific parameters; invalid fields
preserve the result. Standard trigger, persistence and ignorehitpause rules
apply. Resetting a move result does not clear the active HitDef, its struck-target
set, captured targets, manual HitCount, power, life, state Time or hitpause.
It cannot rearm an already spent attack. A fresh valid attack can contact again.

MoveContact, MoveHit and MoveGuarded now return elapsed tick values instead of
permanent boolean ones. A body/helper contact starts the shared age at one;
the selected hit/guard result receives that age and the other result is zero.
A newer contact replaces the previous result and restarts its age. Existing
boolean actor/snapshot fields remain available for client compatibility.

CNS observes the contact age before its active-tick increment. Hitpause freezes
it through the final frozen tick, so opted-in controllers see one during pause
and ordinary controllers see one on the first active controller phase. The age
then advances once after controllers, including preserved state transitions,
and saturates at Int.MAX_VALUE. This clock is independent of State Time.
MoveHitReset stops further increments until a new accepted body/helper contact.

StateDef movehitpersist now preserves the elapsed result with its flags; normal
state entry clears both. Borrowed state banks operate on the executing actor's
result without coordinate scaling. Helpers keep independent clocks and resets.
Projectile hit/guard history remains independent and does not set parent body
move-contact flags; MoveHitReset cannot erase that history. Read-only queries,
snapshots and presentation cannot age, clear or repeat a contact.

Wasm snapshots expose moveContactTime, moveHitTime and moveGuardedTime alongside
the existing boolean fields. Authored logic can now distinguish MoveHit=1 from
later ticks and explicitly clear a carried result without changing HitCount
or reopening collision eligibility.

Validation:

- 801 JVM and 796 compiled-Wasm tests pass, including 20 new cases for hit/guard
  clocks, controller observation order, pause, reset, spent attack preservation,
  fresh contacts, invalid requests, persistence, helpers, projectile history,
  borrowed banks, saturation and pure reads.
- Exported Wasm checks 24 root/helper, hit/guard, pause and reset-mode sequences;
  two state-persistence sequences; and independent projectile history. Authored
  PowerSet observations verify CNS values before increment/reset while snapshots
  verify resulting clocks, flags, preserved manual counts and absence of repeats.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Measured controller-name coverage is now 58 of 97 in the live legacy JavaScript
registry (59.8%), up from 57 of 97 (58.8%); 39 names remain outside the Kotlin
contract. Against the Elecbyte 1.1 reference the overlap is 57 of 89 (64.0%).
These name counts do not measure parameter completeness, expressions, physics,
effects, AI, team modes or native parity. Overall completion is not quantified;
reaching every controller name alone would not mean the rewrite was complete.

Reset behavior and elapsed triggers follow the
[Elecbyte references](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#movehitreset).
Native contact/state-entry ordering, MoveReversed/ReversalDef, global Pause and
SuperPause, automatic hit/unique/combo counts and complete common-state physics
remain incomplete or unverified. These checks do not certify native frame parity
or physical-phone performance. Main CI verifies shared browser/APK Wasm identity
and anonymous permanent downloads before publication.

## Fall-continuation rewrite — November 16, 2026

Continues published main source `f6128b4`. HitDef and Projectile now capture
forcenofall alongside validated boolean fall and air.fall expressions. Omitted
fall/forcenofall default to false; omitted air.fall inherits fall. Numeric
nonzero values, including fractional values, are true. Expressions evaluate
at attack installation; invalid flags preserve a working HitDef or leave the
projectile queue alone, even when the invalid flag's branch would be unused.

An accepted unguarded follow-up now carries an existing fall only while the
victim is in MoveType H with received hit data. Omitted/zero fall no longer
silently clears that active fall. Forcenofall clears the carried flag unless
fall=1 takes priority. An explicit air.fall=0 can prevent a new aerial fall
while retaining an existing one when forced clearing is disabled; air.fall=1
can request a new aerial fall even after the previous one is cleared. Guards
suppress fall carry. Recovered/non-get-hit actors do not carry stale stored
fall data into the next contact.

Only the active flag carries. New contact data still replaces fall velocities,
pending fall damage/kill permission, recovery permission/threshold and reaction
timers. The fall recovery clock restarts at zero. Animation selection uses the
resolved flag, so a carried fall selects the new packet's fall.animtype, while
a cleared flag selects its nonfalling ground/air reaction. HitFallSet may enable
or disable the flag before another contact without rewriting captured animation.

Contact eligibility runs before fall resolution. Forcenofall cannot bypass
HitBy/NotHitBy, HitOverride state-transfer rejection, dead-target rejection or
the F requirement for hitting an already falling airborne victim. Clearing
fall prevents HitFallDamage/CanRecover from acting through their existing gates;
the new packet's pending metadata remains available if authored HitFallSet later
enables fall. No automatic bounce, recovery, landing damage or KO state is added.

Helpers retain their own fall flag. Projectile packets keep captured clearing
permission after creator variables change. State-bank units and facing cannot
alter the boolean carry/clear rules. Pause and read-only presentation cannot
change the flag without an accepted contact or authored controller. Full native
stale-data clearing outside MoveType H remains separate work.

Validation:

- 781 JVM and 776 compiled-Wasm tests pass, including 23 new cases for carry,
  forced clearing, priority, guard/recovery gates, fresh metadata, animation,
  damage/recovery eligibility, flags, invalid requests, projectiles, helpers,
  borrowed banks, pause and pure reads. The prior fall-velocity reset test now
  verifies carried fall with freshly replaced velocities.
- Exported Wasm checks 168 root/helper/projectile follow-up, source localcoord
  320/640, guard/incoming-posture and flag combinations. Each sequence verifies
  captured animation, pending damage, restarted recovery time and pure reads.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Controller-name progress snapshot: 57 of 97 names in the live legacy JavaScript
registry (58.8%) are listed in the Kotlin contract. Against the Elecbyte 1.1
reference, the overlap is 56 of 89 (62.9%), with VarMul as an extra Kotlin type.
These counts do not measure parameter completeness, triggers, physics, effects
or native parity and are not an overall rewrite-completion percentage.

Flag priority follows the
[Elecbyte HitDef reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitdef),
with active-fall carry also present in IKEMEN's accepted-hit handling. Complete
native guard/KO/reset phases, common-state physics and physical-phone performance
remain incomplete or unverified. This does not certify native frame parity.
Main CI verifies shared browser/APK Wasm identity and anonymous permanent downloads
before publication.

## Slide/control timing continuation — November 16, 2026

Continues published main source `9848b24`. HitDef and Projectile now capture
ground.slidetime, guard.slidetime, guard.ctrltime and airguard.ctrltime.
Ground slide defaults to zero. Guard slide defaults to the resolved guard
hittime; guard control defaults to guard slide; aerial guard control defaults
to ground guard control. Explicit overrides affect only their inheritance
branch. Existing hittime defaults and 0–600 bounds remain unchanged, including
the engine's current twelve-tick ground default.

Numeric expressions evaluate when the attack is installed, including nested
expressions and actor variables. Signed integer thresholds are retained;
zero/negative values permit immediate authored conditions. Out-of-range or
invalid fields diagnose the whole request before replacing a working HitDef
or queuing a projectile. Projectile-prefixed aliases are accepted with standard
names taking precedence. Projectiles keep captured values after creator variables
or state banks change, and helpers retain their own incoming timing data.

GetHitVar(slidetime/ctrltime) exposes captured tick thresholds, not countdowns.
Accepted guards capture guard slide time and choose ground/aerial control time
from the incoming victim posture, before the reaction StateDef changes it.
Unguarded hits capture ground slide time and retain the previous guard-control
threshold (initially zero), following the legacy behavior noted in IKEMEN's
MUGEN compatibility code. Fresh guards replace the old guard thresholds.

Authored VelSet can stop sliding at Time>=GetHitVar(slidetime), while CtrlSet
can restore control at Time>=GetHitVar(ctrltime). State Time advances after
controllers, so a threshold N fires after N completed active state ticks;
zero/negative thresholds fire on the first eligible controller phase. Hitpause
freezes ordinary controllers and State Time, including its final frozen tick.
The existing hittime countdown and HitOver remain independent of these values.

Thresholds are scalar tick quantities across localcoord and borrowed state banks.
State changes restart Time but preserve the captured thresholds. Reading them
never stops motion, changes control, creates another contact or modifies life,
power, hitpause or other reaction data. Wasm snapshots expose getHitSlideTime
and getHitControlTime for inspection. Automatic guard/common-state decisions
and complete native hit-data clearing remain separate work.

Validation:

- 758 JVM and 753 compiled-Wasm tests pass, including 24 new cases for defaults,
  independent overrides, expressions, posture selection, static thresholds,
  authored slide/control decisions, pause, signed bounds, state/bank changes,
  invalid requests, projectile aliases/capture, helpers and pure reads.
- Exported Wasm checks 120 root/helper/projectile, source localcoord 320/640,
  guard posture, inheritance/override/boundary and pause combinations. An
  additional borrowed-bank sequence verifies authored slide stopping and
  SelfState without rescaling tick quantities.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Parameter defaults follow the
[Elecbyte HitDef reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitdef).
Exact native controller/contact phases, guard hitstun, complete timing/reset
semantics, automatic common-state control and physical-phone performance remain
incomplete or unverified. This does not certify native frame parity. Main CI
verifies shared browser/APK Wasm identity and anonymous permanent downloads
before publication.

## Aerial-guard continuation — November 16, 2026

Continues published main source `637034a`. HitDef and Projectile now capture
separate ground-guard and aerial-guard knockback. An accepted guard uses the
victim's posture at contact, before its reaction StateDef can change that
posture. Air guards use airguard.velocity; standing/crouching guards keep
guard.velocity. Unguarded contacts still select their ground/air hit vectors.

Omitted guard.velocity now inherits ground.velocity X with zero Y. Omitted
airguard.velocity defaults to air.velocity X times 1.5 and Y divided by two.
The defaults resolve in authored units before canonical fixed-point conversion,
so subpixel factors do not multiply an already truncated value. Explicit zero
vectors override the defaults. The existing optional ground-guard Y component
is retained as an engine extension; the Elecbyte parameter is horizontal only.

One shared parser now handles ground.velocity, air.velocity, guard.velocity
and airguard.velocity in both controllers. It splits only top-level commas,
so nested numeric expressions work in every component. One-component vectors
use zero Y. Blank components, excess components, unbalanced syntax and invalid
expressions diagnose the complete request before replacing a working HitDef or
queuing a projectile. Existing projectile-prefixed aliases remain accepted,
with standard names taking precedence, including projairguard.velocity.

All components convert once from the executing actor's active state-bank units.
At impact, only the selected X component receives captured attacker/projectile
facing. Later facing or borrowed-bank changes cannot mirror or rescale stored
knockback. GetHitVar(xvel/yvel) reports it in current active units, and HitVelSet
restores that same vector after authored velocity edits. Helpers keep their own
data; projectile packets retain resolved defaults after creator variables change.
Shot velocity/acceleration remain separate from incoming victim knockback.

Vector selection preserves chip damage, authored power, guard pause/hittime,
fall suppression and contact history. Existing pause rules freeze motion through
the final frozen tick. Read-only snapshots and presentation do not create extra
motion, damage or contacts. The existing Wasm getHitX256/getHitY256 fields expose
the selected canonical guard vector without a new client API.

Validation:

- 734 JVM and 729 compiled-Wasm tests pass, including 22 new cases for defaults,
  subpixel conversion, explicit/signed vectors, nested expressions, posture,
  facing, HitVelSet, bank changes, invalid requests, aliases, projectile capture,
  helpers, fresh contacts, chip/power preservation, pause and bounds.
- Exported Wasm checks 144 root/helper/projectile, source localcoord 320/640,
  facing, guard posture, default/explicit/zero vector and pause combinations.
  Each sequence verifies captured/restored axes, motion, chip, power and pure reads.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Defaults follow the
[Elecbyte HitDef reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitdef).
Complete guard control/slide timing, native facing/contact phases, common-state
physics, corner push and air recovery remain incomplete or unverified. These
checks do not certify native frame parity or physical-phone performance. Main
CI verifies shared browser/APK Wasm identity and anonymous permanent downloads
before publication.

## Hit-animation continuation — November 16, 2026

Continues published main source `5c811db`. HitDef and Projectile now capture
animtype, air.animtype and fall.animtype as typed reaction values. Supported
names are Light, Medium (also Med), Hard, Back, Up and DiagUp, ignoring case
and surrounding whitespace. These are static strings, not numeric expressions.
Omitted animtype is Light; omitted air.animtype inherits animtype. Omitted
fall.animtype is Up when the resolved air type is Up, otherwise Back.
Invalid names diagnose the request before replacing a working HitDef or queuing
a projectile, including invalid fields in an unused reaction branch.

GetHitVar(animtype) exposes the selected code: Light=0, Medium=1, Hard=2,
Back=3, Up=4 and DiagUp=5. Selection happens once on each accepted contact,
before the reaction StateDef can change the victim's posture. The newly captured
fall flag selects the fall type, otherwise an initially airborne victim selects
the air type. Force-air HitOverride also uses air selection. Ground reactions
use animtype, with Back/Up/DiagUp reduced to Hard when vertical knockback is
zero. Guarding disables the fall branch and uses the initial standing/air
posture; existing guard velocity handling remains separate work.

The selected code is a scalar across local coordinates and state banks.
Later facing, animation/posture changes and HitFallSet edits cannot reselect it.
A new accepted contact replaces it; rejected contacts and presentation reads
preserve it. Helpers own their captured data. Multi-hit projectiles choose anew
using each incoming victim posture, while keeping the attack's authored types.
Wasm snapshots expose getHitAnimType alongside the existing hit data.

Authored ChangeAnim can choose an own-resource reaction from this query;
ChangeAnim2 selects the corresponding animation from a borrowed state bank.
SelfState then restores the victim's bank/resources without rewriting the
captured code. Reading or selecting the metadata does not itself change the
AIR action, state, motion, hit timers, life, power or contact history. Ordinary
controller persistence and hitpause rules still govern authored animation changes.

Validation:

- 712 JVM and 707 compiled-Wasm tests pass, including 23 new cases for all names,
  inheritance, defaults, ground/air/fall selection, guard and force-air routes,
  authored ChangeAnim, bank/facing changes, invalid requests, helpers,
  projectile capture/fresh contacts and pure reads.
- Exported Wasm checks 210 root/helper/projectile, source localcoord 320/640
  and reaction combinations, including all six codes, launched ground hits,
  guarded air hits and default fall selection. An additional sequence verifies
  ChangeAnim2 and SelfState resource ownership in a borrowed bank.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Names, codes and inheritance follow the
[Elecbyte reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitdef).
The non-launching ground fallback also follows IKEMEN's gethitAnimtype selection.
Complete native fall carry/reset, KO-specific animation updates, exact contact
phases and automatic common-state animation/physics remain incomplete or
unverified. These checks do not certify native frame parity or physical-phone
performance. Main CI verifies shared browser/APK Wasm identity and anonymous
permanent downloads before publication.

## Authored recoil continuation — November 16, 2026

Continues published main source `bb7e935`. HitDef and Projectile now capture
yaccel as a per-hit vertical acceleration. Authored values convert once from
the executing actor's active coordinate bank to canonical 1/256 stage units.
Omission defaults to canonical .35 stage pixels per tick squared, independently
of source localcoord and Movement.yaccel; the existing fixed-point policy stores
that default as 89/256. Explicit zero and signed negative acceleration remain
distinct from omission. Extreme finite values saturate canonical storage.

GetHitVar(yaccel) converts the captured acceleration into the victim's current
active-bank units. Later facing, source-variable changes and borrowed-bank
transitions cannot mirror or rescale the stored value. Guard, air and helper
reactions capture it too. A fresh accepted contact replaces it. Projectile
accel controls the shot's own motion independently of yaccel on its hit packet.
Invalid yaccel expressions preserve an existing HitDef or leave the projectile
queue alone; nested numeric expressions evaluate at attack installation.

CNS can now use HitOver and HitShakeOver. They expose the existing reaction
clock boundaries: HitOver is true when GetHitVar(hittime) is below zero;
HitShakeOver is true when the shared hitpause counter has reached zero. A zero
hittime is still unexpired; its next active tick reaches -1. Hitpause freezes
hittime. The counters update before controllers as before, so an opted-in
ignorehitpause observer sees HitShakeOver on the final frozen tick; normal
controllers wait until the following active tick. These predicates are intended
for authored get-hit states. Outside that scope they expose the same stored
clocks, including initially expired values, rather than a certified native reset.

Authored VelAdd y=GetHitVar(yaccel) can integrate recoil after HitShakeOver;
SelfState guarded by HitOver can select the victim's own recovery state.
There is no automatic acceleration, transition, damage, power or extra contact
from reading a predicate or acceleration. Existing arena fallback gravity still
uses the fighter's Movement.yaccel. Snapshots expose getHitAccelerationY256,
hitOver and hitShakeOver for inspection.

Validation:

- 689 JVM and 684 compiled-Wasm tests pass, including 24 new cases for canonical
  defaults, scalar clocks, signed acceleration, expressions, facing, guard/air
  selection, hitpause, authored motion/recovery, bank changes, helpers,
  invalid requests, projectile motion separation, saturation and pure reads.
- Exported Wasm checks 48 root/helper/projectile, source localcoord 320/640,
  acceleration and hitpause combinations; eight ground/air and hit/guard clock
  sequences; and an authored recoil/SelfState sequence in a borrowed bank.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Defaults follow the
[Elecbyte HitDef reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitdef);
[HitOver](https://network.mugenguild.com/justnopoint/1.1docs/trigger.html#hitover)
and [HitShakeOver](https://network.mugenguild.com/justnopoint/1.1docs/trigger.html#hitshakeover)
are exposed over the current engine clocks. Native subpixel accumulation,
separate hitshake/hitpause clocks, exact controller/reset phases and complete
common-state physics remain unverified. This does not certify native frame parity
or physical-phone performance. Main CI verifies shared browser/APK Wasm identity
and anonymous permanent downloads before publication.

## Fall-recovery continuation — November 16, 2026

Continues published main source `fc27815`. HitDef and Projectile now capture
fall.recover and fall.recovertime, defaulting to enabled and four ticks.
Expressions evaluate once when an attack is installed, including projectile
creation. Invalid flags or out-of-range/non-numeric thresholds preserve a
working HitDef or leave the projectile queue alone. Signed integer thresholds
are retained; zero/negative delays permit immediate eligibility.

GetHitVar(fall.recover/fall.recovertime/fall.time) exposes the permission,
threshold and elapsed fall ticks. HitFall reads the captured fall flag.
CanRecover returns true for a living MoveType H actor with accepted hit data,
fall enabled, recovery permitted and elapsed ticks at least the threshold.
Outside those conditions it returns false. Authored CNS may use these triggers
to select a recovery state; eligibility itself never changes state or motion.

The clock starts at zero on each accepted hit/guard contact. It advances once
before controllers on an unpaused MoveType H tick with the fall flag enabled,
independently of state Time. Hitpause, including its final frozen tick, does
not advance it. Opted-in ignorehitpause controllers observe the frozen value.
HitFallSet can suspend/resume the clock by editing the flag without resetting
elapsed time. Guard contacts initially disable fall. A later accepted contact
replaces the permission/threshold and restarts the clock; a get-hit state/bank
change preserves it. Outside MoveType H the stored clock freezes. Complete
native stale-data clearing and contact/pause ordering remain unverified.

Tick quantities never rescale in mixed or borrowed local coordinates. Helpers
own their recovery data, and multi-hit projectiles restart it on each accepted
contact. The timer saturates at Int.MAX_VALUE. Read-only expression, snapshot
and presentation access cannot advance it. Recovery eligibility preserves pending
fall damage, life, power and contact history. Wasm actor snapshots now expose
getHitFallRecover, getHitFallRecoverTime, getHitFallTime and canRecover.

Validation:

- 665 JVM and 660 compiled-Wasm tests pass, including 25 new cases for defaults,
  permission, thresholds, pause, authored recovery transitions, flag edits,
  guarded/fresh contacts, state/bank changes, helpers, projectile capture,
  invalid input, scalar units, saturation and pure reads.
- Exported Wasm checks 48 root/helper/projectile, localcoord 320/640, permission,
  delay and hitpause combinations. Additional sequences verify deferred guard
  timing and an authored SelfState recovery from a borrowed 640-wide bank to
  the victim's own 320-wide state.
- All 16 adapter/import/download checks and production browser checks pass,
  including actual sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Defaults and recovery delay follow the
[Elecbyte HitDef reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitdef);
[CanRecover](https://network.mugenguild.com/justnopoint/1.1docs/trigger.html#canrecover)
is defined by that reference while falling. The additional inactive/dead gates
above are this engine's bounded behavior outside that scope. Automatic air
recovery, command selection, landing damage, bounce/liedown physics and exact
native pause/reset phases remain incomplete or unverified. These checks do not
certify native frame parity or physical-phone performance. Main CI checks shared
browser/APK Wasm identity and anonymous permanent downloads before publication.

## Fall-damage continuation — November 16, 2026

Continues published main source `a3e4d92`. HitDef and Projectile now capture
fall.damage and an independent fall.kill flag. Omitted amounts default to zero;
omitted fall.kill defaults to true regardless of kill or guard.kill. Numeric
expressions evaluate in the executing actor at attack installation. Invalid
amounts/flags preserve an existing HitDef or leave the projectile queue alone.

CNS HitFallDamage applies the pending amount only when the actor has accepted
hit data, MoveType H and its fall flag enabled. It clears the amount after one
application, including zero-defence and capped-health results. Guard contacts
initially disable falling, so they retain the amount until HitFallSet enables
it. A new accepted contact replaces pending damage and its fall.kill permission;
repeated controllers or presentation reads cannot spend the same value twice.

Fall damage uses the victim's own base defence and current DefenceMulSet factor.
Attacker attack values/factors and borrowed-bank defence do not participate.
The amount remains a health scalar across mixed or borrowed local coordinates.
Nonlethal fall damage floors living victims at one life without reviving a
victim already at zero. Signed negative amounts explicitly heal up to LifeMax;
wide negation and bounded rounding handle Int.MIN_VALUE and extreme defence
factors without wrapping. Tiny damage retains the existing one-point minimum.

GetHitVar(fall.damage) exposes the pending amount and becomes zero after spending.
Wasm actor snapshots expose getHitFallDamage and getHitFallKill. HitFallDamage
preserves the original GetHitVar(damage), velocities, state/bank, hit timers,
power and contact history. Existing persistence and ignorehitpause rules apply.
Round flow observes a resulting zero life, but this controller does not select
another state or create another hit. Helpers retain their own pending data;
each accepted multi-hit projectile contact provides a fresh amount.

Validation:

- 640 JVM and 635 compiled-Wasm tests pass, including 25 new cases for defaults,
  independent kill flags, live defence, one-shot consumption, signed bounds,
  gating, guard data, helpers, borrowed banks, invalid requests, new contacts,
  multi-hit projectiles, pause, persistence, round KO and pure reads.
- Exported Wasm checks 48 root/helper/projectile, localcoord 320/640, defence
  factor and fall.kill combinations, plus signed bounds, deferred guard damage
  and a borrowed-bank scalar/defence sequence.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

The controller follows the authored consumption described in the
[Elecbyte reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitfalldamage),
with pending-amount clearing also present in IKEMEN's hitFallDamage implementation.
Automatic landing damage, ground collision, bounce/recovery, native gating and
rounding details, defence-up behavior and common-state ordering remain incomplete
or unverified. This does not certify native frame parity or physical-phone
performance. Main CI verifies identical browser/APK Wasm assets and anonymous
permanent downloads before publication.

## Get-hit velocity continuation — November 16, 2026

Continues published main source `2d24c44`. CNS now executes HitVelSet,
HitFallSet and HitFallVel. They act only on MoveType H actors with captured
data from an accepted hit/guard contact. HitVelSet restores selected x/y axes
from the original incoming velocities; omitted/zero flags leave axes unchanged.
Later facing or state-bank changes cannot mirror or rescale stored knockback.

HitDef and Projectile now capture fall.xvelocity and fall.yvelocity, including
nested numeric expressions in the executing actor's active units. Omitted fall
X means no horizontal override. Omitted fall Y defaults to canonical -4.5 stage
pixels per tick, independent of source localcoord. Authored fall X uses impact
facing once, including the projectile's captured orientation. Extreme incoming
and fall X mirroring now saturates instead of wrapping Int.MIN_VALUE.

HitFallSet edits the captured fall flag and optional fall x/y velocities.
Value -1/omission preserves the flag; 0 clears it and 1 enables it. Runtime
xvel/yvel convert active state-bank units to canonical world components once.
These edits do not alter original incoming velocities. HitFallVel requires
the captured fall flag; it applies stored Y and applies X only when explicitly
defined. An explicit zero X stops horizontal motion, while omitted X preserves
current motion. Disabling fall prevents application of the bounce velocities.

GetHitVar(fall.xvel/fall.yvel) reports values in the current active units;
undefined X queries return zero. Actor snapshots retain nullable fall X to
distinguish omission from zero and expose whether hit data has been received.
A new accepted contact replaces previous runtime fall edits. Outside MoveType H,
or before any accepted contact, the controllers leave velocities/data alone.
Stale stored data and full native recovery/reset semantics remain separate work.

All controller arguments and both authored fall components are validated before
mutation. Invalid input preserves reaction data, an existing HitDef or the
projectile queue. Existing persistence/ignorehitpause rules apply. The
controllers do not deal damage, award power, create contacts, change state or
automatically perform ground collision, bounce/recovery or fall damage.

Validation:

- 615 JVM and 610 compiled-Wasm tests pass, including 21 new cases for sparse
  axes, guard data, gating, fall defaults/edits, expressions, facing, units,
  invalid requests, fresh contacts, helpers, overrides, bounds and pause.
- Exported Wasm checks 32 root/projectile hit/guard, facing and axis combinations;
  16 fall-default/zero/custom/disabled cases across localcoord 320/640; and
  three borrowed-bank fall-edit/apply sequences. Pure presentation reads cannot
  repeat a reaction or damage.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Parameters and fall defaults follow the
[Elecbyte controller reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitfallset).
Native fall gating/facing quirks, common-state ordering, full hit-data resets and
automatic bounce/recovery remain unverified. These checks do not certify native
frame parity or physical-phone performance. Main CI verifies browser/APK asset
identity and anonymous permanent downloads before publication.

## State persistence continuation — November 16, 2026

Continues published main source `c52cb2b`. StateDef now honors hitdefpersist,
movehitpersist and hitcountpersist independently. Omitted/zero values reset the
body HitDef, boolean move-contact information and existing manual HitCount on
entry. Nonzero values preserve the corresponding data. This also fixes the
previous behavior where HitCount could survive every transition unconditionally.

Preserving a body HitDef retains its original captured parameters, state bank
and struck-target set. A spent attack cannot hit the same victim again merely
because the player entered another state. An unspent attack can connect using
the new state's current collision animation. Preservation never creates attack
boxes or converts canonical knockback again when the state bank uses different
local coordinates.

The first valid authored HitDef executed after carrying an attack may replace
it and open a fresh contact window. Repeated execution of that same current
state's controller retains the existing one-window rule. Invalid replacement
definitions leave the carried attack and its spent targets intact. Independent
projectiles keep their own lifetime and captured attack factors.

Persistence expressions evaluate on entry with the destination bank/state and
Time=0 visible, while previous attack/contact/count data is still available.
All three flags are evaluated before any of that data is cleared. Actor
variables belong to the executing actor, including in a borrowed bank. Failed
expressions diagnose the problem and disable all three carries for that entry;
the transition itself still completes. Initial-state diagnostics are retained
when actors are attached to a fight.

HitAdd now validates its value and parameters and uses wider addition before
clamping the existing manual HitCount to 0–Int.MAX_VALUE. Rendering cannot
increment or reset the count. Actor snapshots expose moveContact, moveHit,
moveGuarded and hitCount so clients can inspect the supported state data.
Automatic HitCount/UniqHitCount contact accounting, numhits/combo display and
elapsed Move* trigger semantics remain separate work; hitcountpersist currently
controls the HitAdd-backed manual counter, not a complete native combo model.

Validation:

- 594 JVM and 589 compiled-Wasm tests pass, including 22 new cases for flag
  combinations, attack windows/replacement, expressions, ownership, units,
  invalid entry, manual counters, helpers, projectiles, pause and pure reads.
- Exported Wasm checks all 16 flag/hit/guard combinations, two unspent carries,
  one replacement window, bounded manual counting and initial diagnostics.
  Destination controllers observe preserved flags/counts in their next phase.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Persistence flag contracts follow the
[Elecbyte StateDef reference](https://network.mugenguild.com/justnopoint/1.1docs/cns.html#hitdefpersist).
Native expression-entry timing, repeated HitDef replacement, move timers and
automatic counter parity remain incomplete or unverified. These checks do not
certify native frame parity or physical-phone performance. Main CI verifies
browser/APK asset identity and anonymous permanent downloads before publication.

## Runtime damage continuation — November 16, 2026

Continues published main source `f8181bf`. CNS now executes AttackMulSet and
DefenceMulSet. They replace the executing actor's runtime damage factors;
ordinary hit and guard damage combines these factors with the existing base
attack/defence ratio before integer rounding. Factors default to one, persist
across state-bank changes and remain independent between actors and helpers.
Fresh actors/fights start with unit factors.

Body hits use the attacker's live factor at contact, including changes after
HitDef installation. Projectiles retain the creator's attack factor captured
when the request is queued. Later controllers in the same actor phase, delayed
entity creation or later state changes cannot alter that projectile's factor.
Direct projectile construction also captures the current creator factor.
Each projectile contact reads the victim's live defence factor. HitDef authored
damage and power defaults remain unchanged; repeated hits cannot compound
scaling into the stored definition.

Zero factors yield zero damage without suppressing accepted reactions,
contacts, hit allowances or authored combat power. Tiny positive damage retains
one point; extreme products saturate before life clamping. Contact reports and
GetHitVar(damage) retain the same scaled nominal amount before life caps and
nonlethal floors. Actor/projectile snapshots expose their factors for inspection,
and presentation reads cannot run controllers or repeat damage.

TargetLifeAdd uses the victim's runtime defence for damage and healing, while
ignoring the executing actor's attack factor. Absolute mode bypasses both base
and runtime defence. LifeAdd retains base-defence scaling and the documented
exception that excludes it from DefenceMulSet. Zero runtime defence cannot
become a one-point scripted hit. Scripted health deltas are bounded before
addition, preventing large healing/damage factors from overflowing Long.

Nested expressions evaluate in the actual actor even in a borrowed bank.
Missing/invalid values, negative/nonfinite factors, values above Float.MAX_VALUE
and unsupported parameters preserve the previous factor. Existing persistence
and ignorehitpause rules apply. Complete native helper inheritance, round reset,
pause/contact ordering, fall/super defence and native metadata accumulation
remain unverified or incomplete.

Validation:

- 572 JVM and 567 compiled-Wasm tests pass, including 21 new cases for factors,
  bounds, rounding, zero/tiny/extreme values, actor ownership, live body attacks,
  projectile capture, helper isolation, scripted health, pause and pure reads.
- Exported Wasm checks 36 root/helper/projectile hit/guard combinations, plus
  a delayed body factor change and projectile request capture followed by two
  different victim defence values. Eight scripted-health cases cover runtime
  defence, absolute mode, zero factors and extreme arithmetic.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Controller parameters and the LifeAdd exception follow the
[Elecbyte reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#defencemulset).
Projectile factor capture follows the
[IKEMEN projectile creation/contact implementation](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go).
These synthetic checks do not certify native frame parity or physical-phone
performance. Main CI verifies browser/APK asset identity and anonymous permanent
downloads before publication.

## Base damage continuation — November 16, 2026

Continues published main source `f3688e8`. Ordinary fighter, helper and
Projectile contacts now scale hit and guard damage by the actual attacker's
own [Data] attack divided by the recipient's own [Data] defence. Default 100/100
stats preserve existing damage. Attack defaults to 100, accepts integer values
bounded to 0–100000, and uses 100 for malformed/non-32-bit input. Zero attack
produces zero damage while retaining accepted contacts and reactions.

All contact paths use one shared pure calculation over immutable base stats.
Positive halves round up, tiny positive damage retains a one-point minimum,
and zero/negative authored damage stays zero. Wider intermediate arithmetic
and saturating integer conversion prevent large products from wrapping. The
existing independent kill/guard.kill life floors remain in effect.

Contact reports and GetHitVar(damage) now expose the same scaled nominal amount,
before life caps or nonlethal floors. The installed HitDef retains authored
damage, so multi-hit projectiles cannot compound their scaling. Combat-power
defaults continue to use authored hit damage rather than scaled damage, chip
damage or actual life lost.

Borrowed state banks cannot replace the actual attacker's base attack or the
recipient's base defence. Helpers use their own immutable definitions and
independent life, while their power meters still share the appropriate root.
Projectiles use the actual creator's base stats, including after that actor
borrows another state bank. Manual incoming hits without an attacker use a
neutral 100 attack. Local coordinates and presentation cadence do not change
the integer health amounts.

Scripted LifeAdd/TargetLifeAdd retain their existing defence-only contracts;
the attacker's base attack does not amplify scripted throw health changes.
Runtime AttackMulSet/DefenceMulSet, fall/super defence, native accumulation and
GetHitVar life-bound semantics remain outside this increment.

Validation:

- 551 JVM and 546 compiled-Wasm tests pass, including 23 new cases for constants,
  hit/guard ratios, rounding, zero/tiny/extreme damage, lethality, power,
  helpers, borrowed banks, projectiles, overrides, rejection, trades and units.
- Exported Wasm checks 36 root/helper/projectile hit/guard combinations with
  default, nondefault, zero, tiny, half and extreme base-stat inputs. It also
  verifies an actual borrowed attack bank uses the executing actor's attack.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Base damage calculation follows the intended attack/defence relationship in
the [IKEMEN damage implementation](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go).
These synthetic checks do not certify native extreme rounding, life-bound
metadata, contact ordering or physical-phone performance. Main CI verifies
browser/APK asset identity and anonymous permanent downloads before publication.

## Scripted health continuation — November 16, 2026

Continues published main source `2aa1b21`. CNS now executes TargetLifeAdd, so
captured throw victims receive their timed scripted damage. HitDef IDs select
targets; omitted ID/-1 selects all valid captures. Dead, destroyed, recovered,
dropped and missing targets remain excluded. Nonlethal damage preserves a living
victim at one life and retains its capture for later throw controllers.

LifeAdd and TargetLifeAdd now honor kill and absolute, defaulting to lethal
and defence-scaled changes. Each recipient uses its own immutable [Data] defence
percentage, even in a borrowed state bank. Absolute changes bypass that scaling.
Health values remain integers, independent of localcoord. Half values round
away from zero; tiny damage retains a one-point minimum, while tiny healing may
round to zero. Healing clamps to the recipient's own maximum life. Wider delta
and addition arithmetic prevent extreme inputs from wrapping or causing a KO
through integer overflow. LifeSet remains unscaled and now validates its value.

Base defence defaults to 100. The constants parser bounds integer values to
1–100000 and defaults malformed or non-32-bit input to 100. This base defence
currently feeds health controllers only: full ordinary HitDef/Projectile damage
scaling, runtime AttackMulSet/DefenceMulSet and fall/super defence remain outside
this increment. TargetLifeAdd applies the recipient's base defence without
applying the executing actor's attack multiplier.

Complete values, flags, IDs and parameter names are checked before changing
life. Invalid requests preserve all selected lives. Nested expressions evaluate
in the executing actor; persistence and ignorehitpause use the existing actor
phase. A living one-life floor does not revive dead actors, while explicit
positive self-healing remains possible. Target death is visible to subsequent
target controllers immediately. Ordinary round flow observes zero life.

Scripted health changes do not create hit contacts, award power, replace
GetHitVar data, add hitpause, select a reaction state or release a binding.
Borrowed throw states and finite bindings continue their normal lifecycle;
presentation reads do not repeat damage. Complete native KO/state transitions
and overflow quirks remain unverified.

Validation:

- 528 JVM and 523 compiled-Wasm tests pass, including 22 new cases for constants,
  healing/damage, flags, IDs, target lifetime, mixed units, borrowed banks,
  helpers, input errors, rounding, overflow, pause, throws and round flow.
- Exported Wasm checks 16 timed-throw combinations across localcoord 320/640,
  defence 100/200, absolute mode and lethal/nonlethal damage. Ten additional
  self-health cases verify LifeAdd/LifeSet scaling, bounds and invalid input.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
- Two KFM 600-tick replays retain nine contacts, seven fallback recoveries,
  zero unsupported diagnostics, matching physical checksums and identical
  power progression ending at 485/415.

Controller parameters follow the
[Elecbyte reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#targetlifeadd).
The defence-only TargetLifeAdd path and symmetric rounding follow the
[IKEMEN life/target-life implementation](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go).
These checks do not certify native frame parity or physical-phone performance.
Main CI verifies browser/APK asset identity and anonymous permanent downloads
before publication.

## Combat power continuation — November 16, 2026

Continues published main source `1bf49f2`. Accepted HitDef and Projectile
contacts now apply getpower to the actual attacker's root meter and givepower
to the defender's root meter. Hit and guard amounts are independent. Explicit
pairs support nested numeric CNS expressions; a single value defaults its
guard amount to half, truncated toward zero. Zero disables that channel and
negative values drain it. Existing meter limits and wider addition arithmetic
prevent overflow or power outside the configured bounds.

Omitted amounts use authored hit damage, independently of guard chip damage or
actual life lost. The standard default rates are 0.7 for the attacker and 0.6
for the defender, with single-precision multiplication before integer
truncation. Guard defaults halve those hit amounts. Each fight can supply
HitPowerRules, also exposed through ktCoreConfigureHitPower; rates must be
finite, nonnegative and within the single-precision range. Imported mugen.cfg
loading and super-specific power rules are not implemented.

Expressions, rates and defaults are captured when CNS installs the attack;
later variable or configuration changes affect future definitions. Invalid
power expressions, extra/missing components and out-of-range integers cannot
install a HitDef or queue a Projectile. Invalid configuration leaves existing
rules intact. Rejected contacts, terminal projectile cancellation, expiry and
presentation reads do not award power. A projectile's frozen ticks cannot repeat
its prior credit. Accepted multi-hit projectile contacts each apply one pair of
deltas.

Helper and nested-helper meters continue to use their actual roots. Borrowed
state banks cannot receive the executing attacker's credit. Power applies to
ordinary, guarded, override, paired-throw, lethal and nonlethal reactions;
follow-up controllers observe the updated meters. Root trades credit both
accepted candidates through the existing shared contact phase.

Validation:

- 506 JVM and 501 compiled-Wasm tests pass, including 24 new cases for defaults,
  explicit pairs, expression/configuration capture, bounds, rejected contacts,
  helpers, custom states, overrides, throws, lethality, projectiles and trades.
- Exported Wasm checks 28 combinations of root/projectile, hit/guard and
  default/explicit/singleton/configured/disabled/drained/capped power. It also
  checks invalid configuration, captured rules and presentation purity.
- The KFM 600-tick replay retains nine contacts, seven fallback recoveries,
  zero unsupported diagnostics and its prior physical checksum. Both meters'
  progression matches across isolated replays, ending at 485/415 power.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.

Defaults and controller parameters follow the
[Elecbyte HitDef reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitdef).
Native extreme-value rounding, same-root/team contact ordering, super-specific
constants and round-end/carry-over rules remain unverified or incomplete.
These checks do not certify native frame parity or physical-phone performance.
Main CI verifies browser/APK asset identity and anonymous permanent downloads
before publication.

## Power meter continuation — November 16, 2026

Continues published main source `203c271`. CNS now executes PowerSet and
TargetPowerAdd alongside PowerAdd. Each root fighter's maximum comes from
[Data] power, with the existing 3000-point default. PowerMax, exported snapshot
powerMax and debug stat setup use that same limit. Positive and negative changes
clamp to the meter bounds; addition uses wider arithmetic so even Int-limit
inputs cannot wrap a full meter to zero.

Helpers and nested helpers read and change their root fighter's meter. Active
or borrowed state banks do not change meter ownership, capacity or numeric units.
TargetPowerAdd uses captured HitDef IDs, with omitted ID/-1 selecting all valid
captures. Each selected target applies one delta, including multiple captured
helpers sharing the same root meter. Draining a target does not credit the
executing player. Dead, destroyed, recovered, dropped and missing targets are
excluded through the existing target tracker.

All expressions and IDs are validated before any meter changes. Nested numeric
expressions evaluate once in the executing actor; fractional integer parameters
truncate toward zero. Missing values, invalid expressions, out-of-range integers,
unsupported parameters or invalid helper ancestry leave meters intact. Ordinary
persistence and ignorehitpause rules apply, and later controllers observe the
new meter within the same actor phase. Power changes do not repeat damage,
capture targets or alter their hit reactions.

The constants parser accepts nonnegative 32-bit integer capacities, normalizes
negative constants to zero, and uses 3000 for missing/malformed/out-of-range
constants. Fresh fights start with empty meters. Round carry-over, native
round-end restrictions, team sharing and automatic HitDef/Projectile
getpower/givepower remain outside this increment.

Validation:

- 482 JVM and 477 compiled-Wasm tests pass, including 21 new cases for constants,
  meter bounds/overflow, invalid input, IDs, target lifetime, borrowed banks,
  nested helper ownership, per-target deltas, pause, persistence and pure reads.
- Exported Wasm checks zero/5000/Int-max capacities, PowerMax expressions,
  PowerSet/PowerAdd, capped debug setup, mixed-coordinate target credit/drain,
  ID filtering, TargetDrop, helper/root sharing and read-only presentation.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
  Two KFM 600-tick structural replays retain nine contacts, seven fallback
  recoveries, zero unsupported diagnostics and matching checksums.

Controller contracts follow the
[Elecbyte reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#targetpoweradd).
Root meter sharing also follows the
[IKEMEN powerOwner/getPower implementation](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go).
These synthetic checks do not certify native frame parity or physical-phone
performance. Main CI verifies browser/APK asset identity and anonymous permanent
downloads before publication.

## Hit eligibility continuation — November 16, 2026

Continues published main source `929c1f9`. HitDef, helper and Projectile contacts
now share posture and gethit eligibility checks. H selects standing victims,
L selects crouching victims, and M selects both. Airborne victims require A;
falling airborne victims in MoveType H additionally require F. D selects lying
victims. Stored fall metadata does not restrict recovered non-gethit actors.

The + modifier requires MoveType H and excludes conventional guard common
states (120, 130–132, 140 and 150–155). The - modifier rejects MoveType H, so
throws cannot combo into an existing hit reaction. Arbitrary authored gethit
state numbers work, including borrowed throw states. Guardability, HitBy,
NotHitBy and HitOverride checks remain separate eligibility requirements.

Rejected contacts cannot damage, pause, capture or change state, set contact
flags or consume a fighter/helper's one-hit window. Projectiles retain their
hit allowance and create no contact history when rejected; their independent
motion/lifetime still advances. A later eligible contact can use the same live
attack. Simultaneous root trade candidates retain the existing shared phase.

Case and whitespace are normalized. Unknown characters, masks with no posture
flags and combined +/- modifiers are diagnosed before installing a HitDef or
queuing a Projectile. Standard hitflag takes precedence over the existing
projhitflag alias. Invalid replacement definitions leave the live attack intact.

Validation:

- 461 JVM and 456 compiled-Wasm tests pass, including 18 new cases covering
  posture, modifiers, guard states, falling data, malformed masks, aliases,
  throw capture, helpers, projectile allowances/history, immunity and trades.
- Exported Wasm checks 34 root/projectile posture/modifier combinations and
  two falling follow-ups, including rejected contact reports, life, damage
  metadata, projectile history/allowances and read-only presentation snapshots.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
  Two KFM 600-tick structural replays retain nine contacts, seven fallback
  recoveries, zero unsupported diagnostics and matching checksums.

The flag contract follows the
[Elecbyte HitDef reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitdef).
Native juggle budgets, customized guard-state detection, fall/common-state
recovery and contact-phase parity remain unverified. Physical-phone performance
is not certified. Main CI verifies browser/APK asset identity and anonymous
permanent downloads before publication.

## Nonlethal hit continuation — November 16, 2026

Continues published main source `d1641da`. HitDef and Projectile now honor
`kill` for successful hits and `guard.kill` for guarded contacts. Disabling
the applicable flag floors the living defender's life at one instead of
entering KO. Both flags default to enabled independently, as specified by the
controller reference; kill=0 does not implicitly disable guard kills.

Nonlethal hits still apply reactions, hitpause, velocity, effects removal,
target capture and successful-hit follow-ups. Paired throw states can retain
their one-life victim rather than losing it to an early KO. Matching HitOverride
routes continue to select their own reaction state. Helper and projectile
contacts use the same life-floor rule. Repeated nonlethal contacts consume
projectile hit allowances normally without reducing life below one.

The floor applies only after a living actor accepts a contact. It cannot revive
dead actors, heal zero-damage contacts, bypass hit filters or suppress ordinary
round/KO behavior when the applicable kill flag is enabled. Existing incoming
GetHitVar(damage) and contact reports retain normalized authored damage rather
than changing into a measure of actual life lost.

Flags use captured numeric CNS expressions, including nested functions and
actor variables. Nonzero permits KO; zero prevents it. Invalid expressions
leave an existing HitDef intact or prevent a Projectile from being queued.
Fall damage/fall.kill and the broader native KO/common-state model remain
outside this implementation.

Validation:

- 443 JVM and 438 compiled-Wasm tests pass, including 18 new scenarios for
  defaults, independent flag combinations, expression capture, repeated hits,
  damage metadata, throw/override paths, helpers, projectiles, invalid input,
  round flow and read-only rendering.
- Exported Wasm checks all eight combinations of root/projectile, hit/guard
  and lethal/nonlethal contact, including reaction states, damage reports and
  projectile retirement. Presentation reads do not repeat damage.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, scaling, imports, CSV and mobile layout.
  Two KFM 600-tick structural replays retain nine contacts, seven fallback
  recoveries, zero unsupported diagnostics and matching checksums.

The default/flag contract follows the
[Elecbyte HitDef reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitdef).
Native fall-damage, guard/KO and simultaneous-contact phase parity remain
unverified. Physical-phone performance is not certified. Main CI verifies
browser/APK asset identity and anonymous permanent downloads before publication.

## Target release continuation — November 16, 2026

Continues published main source `18e378f`. CNS now executes TargetDrop against
the executing actor's captured-target list. Omitted excludeID or -1 drops all
captures. Any other excludeID retains only valid targets with that HitDef ID;
keepone=0 keeps all matches, while the default/nonzero flag keeps at most one.
Missing matches and empty target lists are harmless.

When multiple matches require a choice, selection uses the actor's existing
seeded random stream and stable capture order. This preserves reproducible
JVM/Wasm replay without using host randomness or presentation cadence. The
exact native random sequence and its interaction with other random controllers
remain unverified. A sole match, drop-all or keepone=0 does not consume a choice.

Both expressions and parameter names are validated before changing captures.
Invalid/overflowing IDs, unsupported parameters and failed expressions preserve
the live target list. Nested numeric expressions, ordinary persistence and
ignorehitpause rules are supported. Dead, destroyed and recovered actors cannot
be retained. Each actor/helper owns its list independently.

NumTarget and later target controllers see the change in the same actor phase.
Dropping does not damage, turn, launch, change state or rearm an attack against
the victim. A later successful hit can capture it again. Existing bindings
retain their independent lifetime; authors can release TargetBind with time=0
before dropping, or use a finite binding. Native binding-release coupling still
requires capture evidence.

Validation:

- 425 JVM and 420 compiled-Wasm tests pass, including 15 new cases for drop-all,
  ID retention, keepone, seeded replay, invalid inputs, stale captures, subsequent
  controllers, reacquisition, binding lifetime, ownership and hitpause.
- Exported Wasm performs capture → turn/launch → TargetDrop, checks immediate
  NumTarget visibility, and verifies a later TargetVelSet cannot affect the
  dropped victim or change its hit state.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, projectile scaling, imports, CSV and mobile
  layout. Two KFM 600-tick structural replays retain nine contacts, seven
  fallback recoveries, zero unsupported diagnostics and matching checksums.

The filtering/default contract follows the
[Elecbyte TargetDrop reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#targetdrop).
Native throw, random-selection, binding and contact-phase parity remain
unverified. Physical-phone performance is not certified. Main CI verifies
browser/APK asset identity and anonymous permanent downloads before publication.

## Captured-target motion continuation — November 16, 2026

Continues published main source `fbca90b`. CNS now executes TargetVelSet,
TargetVelAdd and TargetFacing against live captured targets. ID filters use
HitDef target IDs; omission or -1 selects all currently valid targets. Dead,
destroyed or recovered actors are excluded through the existing target tracker.
No matching target is harmless, and omitted velocity axes remain unchanged.

TargetVelSet orients horizontal velocity using the executing player's facing;
TargetVelAdd orients its delta using each target's own facing. Positive Y is
downward. TargetFacing turns victims in the same direction as the player for
a positive value, or the opposite direction for a negative value. A following
TargetVelAdd therefore observes the new target orientation. Facing zero and
missing/invalid values are diagnosed before changing any selected actor.

Velocity expressions evaluate once in the executing actor's active state-owner
units, including borrowed states. Canonical fixed-point values apply directly
to each victim without a second conversion through its localcoord. Nested
expressions and dynamic ID filters are supported. Invalid components leave
all selected targets unchanged; mirrored values and additions saturate instead
of wrapping on overflow. Existing actor hitpause/ignorehitpause and controller
persistence rules govern execution. These controllers do not release bindings
or change the victim's state bank.

Validation:

- 410 JVM and 405 compiled-Wasm tests pass, including 15 new scenarios for
  distinct facing conventions, omitted axes, multiple targets/IDs, borrowed and
  high-coordinate states, nested expressions, invalid values, stale targets,
  saturation, hitpause and read-only rendering.
- Exported Wasm executes HitDef capture → TargetFacing → TargetVelSet →
  TargetVelAdd, verifies mixed-coordinate velocity and checks render purity.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, projectile scaling, archive imports, CSV and
  mobile layout. Two KFM 600-tick structural replays retain nine contacts,
  seven fallback recoveries, zero unsupported diagnostics and matching checksums.

The direction contracts follow the
[Elecbyte target controller references](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#targetvelset).
Changes take effect in the existing sequential actor phase; a victim's later
authored controllers/physics can overwrite them. Native mixed-coordinate,
binding/release and controller/contact ordering remain unverified. Full throw
parity and physical-phone performance are not certified. Main CI verifies
browser/APK asset identity and anonymous permanent downloads before publication.

## Independent guard-pause continuation — November 16, 2026

Continues published main source `de13e91`. Guarded contacts now apply the two
authored `guard.pausetime` components independently. Previously the defender
used the attacker's guard pause too: `guard.pausetime=2,5` froze both sides for
two ticks. It now freezes the attacker for two and the defender for five.
Root and helper attacks pause their actual attacking actor; projectiles pause
their own clock while leaving the creator's clock independent.

When guard.pausetime is omitted, both components inherit the ordinary pausetime
pair. Unguarded contacts keep that ordinary pair. Zero on either side does not
freeze the other. Existing per-tick freeze handling includes each actor's last
frozen tick, and GetHitVar(hitshaketime) reads the defender's correct clock.

Shared parsing preserves nested expressions and evaluates both pairs before
installing a HitDef or queuing a Projectile. Malformed, unknown or nonfinite
expressions fail closed; an invalid replacement leaves the previous HitDef
intact. Standard Projectile parameter names take precedence over the existing
proj-prefixed aliases. Scalar shorthand mirrors its first value to the second;
both components use the supported 0..120 tick normalization. Pause values are
integers and do not scale with character coordinates.

The portable HitDefinition adds guardDefenderPause. Its default retains the
existing direct-constructor guardPause behavior for callers; authored CNS
always fills both guard components explicitly through the shared parser.

Validation:

- 395 JVM and 390 compiled-Wasm tests pass, including 15 new scenarios for
  asymmetric/zero clocks, exact resume timing, defaults, nested expressions,
  validation, helper/projectile ownership and read-only rendering.
- Actual exported Wasm checks exercise root and projectile guarded/unguarded
  contacts, distinct attacker/defender pauses and pure presentation reads.
- All 16 adapter/import/download checks and production browser checks pass,
  including real sprites/effects, projectile scale modes, imports, CSV and the
  360px layout. Two KFM 600-tick structural replays retain nine contacts, seven
  fallback recoveries, zero unsupported diagnostics and matching checksums.

The pair/default contract follows the
[Elecbyte HitDef reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#hitdef).
Native guardstun/common-state, global Pause/SuperPause and contact-phase parity
remain incomplete or unverified. Native character parity and physical-phone
performance are not certified. Main CI verifies browser/APK asset identity and
anonymous permanent downloads before publication.

## Projectile scaling continuation — November 16, 2026

Continues published main source `dc85f28`. Projectile now captures authored
`projscale` expressions and honors own-resource `[Size] proj.doscale`. The
default flag is zero: a projectile no longer inherits body xscale/yscale
automatically. A nonzero flag multiplies the projectile's authored axis
factors by the creator resource's Size factors once. A foreign controller
bank does not replace those resource constants; helper shots share immutable
definitions while retaining their own captured projectile factors.

Scale factors are dimensionless. Own-resource localcoord converts AIR geometry
and sprite pixels to stage space once; active-state units still govern offset,
velocity and acceleration independently. Scale does not change trajectory,
facing, knockback direction, hit allowance, miss delay or lifetime. Nested CNS
expressions are captured at birth and are not reevaluated after variable or
creator-facing changes. Omitted scale defaults to 1,1; a missing second
component defaults to one.

The same effective factors now drive Clsn1 attacks, Clsn2 clashes, sprite
pixels, AIR draw offsets and SFF pivots. Negative factors mirror the relevant
axis independently of launch-facing. Rectangle corners normalize after
reflection. Zero or subpixel-collapsed collision rectangles have no contact
area and cannot hit or cancel another shot. Relative AIR offsets truncate to
fixed point once before adding the world axis. Saturating coordinate
conversion prevents overflow from wrapping a large box across the stage.

Authored factors are bounded to -64..64 per axis, consistent with the bounded
effect renderer's scale budget while allowing reflection. Invalid, nonfinite,
excessive or malformed values are diagnosed before entity creation and do not
consume projectile slots. Body Size composition remains separately bounded by
existing fighter metadata. This is a supported subset, not acceptance of every
native extreme-scale value.

`ktCoreProjectiles` adds captured effective `scaleX`/`scaleY`. Kotlin's render
plan supplies complete signed pixel factors; the browser paints those factors
without recomputing character or projectile scaling. Presentation, camera and
skipped draws cannot alter geometry, scale or combat clocks.

Local validation:

- 380 JVM and 375 compiled-Wasm tests pass, including 27 new shared scenarios
  for Size opt-in/defaults, fractional/high-coordinate transforms, nested
  expressions, reflections, zero-area boxes, hit/clash reach, trajectory,
  resource ownership, validation, saturation and replay.
- Exported Wasm checks compare default versus opted-in body Size, including
  exact projected pixels/AIR offsets and different hit/clash outcomes in
  mixed coordinates. Repeated presentation queries preserve captured scale.
- Chromium imports independently authored CNS/AIR fixtures with public KFM
  SFF art at localcoord 640x480. Both proj.doscale modes paint real mirrored
  sprites, and signed Canvas matrices match Kotlin's supplied transforms.
- All 16 adapter/import/download checks and existing browser checks pass,
  including effects, archive companions, CSV, 1008-coordinate transforms and
  the 360px Android viewport.
- Two public KFM 600-tick structural replays match, retaining nine contacts,
  seven fallback recoveries and zero unsupported diagnostics on that trace.

The basic authored scale contract follows the
[Elecbyte Projectile reference](https://network.mugenguild.com/justnopoint/1.1docs/sctrls.html#projectile).
Native negative/extreme-scale, mixed-coordinate and contact-phase behavior
remain unverified. Removal/cancel animations, screen-edge bounds, native
helper ownership and complete Pause/SuperPause remain incomplete. Native
MUGEN character parity and physical-phone performance are not certified.
Main CI checks browser/APK asset identity and anonymous permanent downloads.

## Projectile feedback continuation — November 15, 2026

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
