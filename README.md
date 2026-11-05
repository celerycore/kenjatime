# MUGEN Web Lab

A local-first browser character inspector and two-fighter runtime, developed against the supplied MUGEN 1.1 beta 1 documentation and Kung Fu Man examples. Training and matches execute a subset of the character's CNS/CMD scripts and resolve attacks against AIR collision boxes. Full MUGEN character compatibility remains unfinished.

## Mobile graphics and performance

Web Edition 15 adds Auto/High/Balanced/Low graphics and an opt-in Performance display. Low renders at a 30 FPS target while simulation stays at 60 Hz. All MUGEN entities/effects remain active. Settings persist locally; hidden tabs explicitly pause, and offscreen viewers stop drawing.

The measured seven-scene pass removes sprite/stage pixel readbacks through native Canvas compositing, bounds asset caches, reuses static parallax/draw records, and buffers keyboard/touch/gamepad inputs independently of presentation. See [measurements, exact source changes, test results and deployment instructions](docs/performance-baseline.md). Physical Android performance is still unverified, and the extreme CPU-throttled software-renderer test remains below 30 FPS.

Current source development is on `source/mugen-compatibility`; `source/mobile-performance` preserves the Edition 15 checkpoint. `gh-pages` contains the built site. Build the source branch before deploying.

Web Edition 21 fixes [texture-cache churn and palette processing](docs/fps-performance.md). Forest High p95 render time drops from 130.2 to 18.1 ms in the software-browser reproduction; all seven existing benchmark scenes retain identical pixels/gameplay. Layered PalFX CPU processing is 14.5× faster. The full supplied corpus passes 466 tests. Desktop Brave users should enable graphics acceleration; Balanced targets 60 FPS and Low targets 30 FPS, both with 60 Hz combat simulation.

## Run

Node 22+ recommended. In this directory:

```sh
npm ci
npm run dev
```

Open the development server in your browser. Choose **Load Kung Fu Man sample**, or import/drop a character, stage or full MUGEN distribution ZIP/RAR. Characters and stages in nested folders are discovered automatically. Use **Add stage** for stage-only ZIP/RAR archives. The stage picker remains visible before a fighter is loaded. Uploaded files stay in the browser; the roster and stages clear on reload.

On a phone, tap **Import character / stage / engine** or **browse files** and choose a ZIP or RAR from Files or Downloads. Archive signatures identify ZIP/RAR4/RAR5, so providers with empty or generic MIME types work. The importer handles archive-root slashes, Windows separators, contained `..` segments, Unicode filenames and Apple metadata. References to shared resources outside a standalone archive appear as missing resources; the built-in common-state fallback remains available. Stale absolute resource references can resolve to an adjacent file inside the archive. Entries that escape the archive root and conflicting duplicate files remain blocked, with the offending filename shown. RAR extraction runs in a worker with a same-origin decoder loaded only when needed. Password-protected/multipart RARs, 7z and encrypted ZIPs are unsupported. If a cloud provider cannot read the file, download it to the phone first.

Production assets use relative URLs for GitHub Pages project paths. **Web Arena** at `arena/` shares the current lab's importer, CNS/CMD runtime, renderer, audio and compatibility reports. It offers player-versus-CPU, two-player keyboard/controller, CPU spectator and training modes, plus touch directions and all six MUGEN attack buttons. Touch directions support diagonals, sliding between buttons and independent simultaneous fingers. **Classic Arena** at `arena-classic/` now uses the same corrected runtime and uploader, with its own Classic Arena identity. Build all three entries before deployment.

ZIP/RAR archives up to 128 MB compressed and 512 MB expanded unpack in a dedicated worker, transferring buffers to avoid an additional full copy on the main thread. The 5,000-entry limit, path checks and conflicting-duplicate checks remain in force. Large packages still require enough available device memory. Imports are serialized and a failed import leaves the current roster available.

**Export character scripts** downloads the selected DEF and its available CMD, CNS/state and AIR references, plus file sizes and missing-reference evidence. Sprite and sound banks are omitted, keeping the export small enough for analysis. The result is not a playable character package.

**Character lab** previews AIR actions and SFF sprites. **Training sandbox** offers a stage selector, an opponent selector and standing, guarding, crouching, keyboard or CPU control. Choose **Match · first to 2** to play character intros and scored rounds with a 99-second timer. Training uses manual resets and skips standard intros. Click the stage to focus keyboard input.

| Player 1 | Player 2 (choose Keyboard P2) | MUGEN input |
| --- | --- | --- |
| Arrow keys | Numpad 8 / 2 / 4 / 6 | Move, jump and crouch; forward/back follow facing |
| Z / X / C | Numpad 7 / 9 / Decimal | x / y / z |
| A / S / D | Numpad 1 / 3 / 5 | a / b / c |
| Enter | Numpad Enter | Start (`s`) |
| R | — | Reset training or restart the match, clearing command history |

Open **Controllers** above the viewer for PS5/DualSense and other browser-standard controllers. Pair the controller through your device's Bluetooth settings or connect USB, then press a face button. P1/P2 assignment is automatic and can be changed; choose **Two players** or **Keyboard / controller P2** for the second player. Default PlayStation mapping is □ = x, △ = y, L1 = z, × = a, ○ = b, R1 = c, Options = Start. Each player can remap buttons and adjust the stick deadzone. Settings persist locally. Disconnects and unfocused windows release controller inputs. Vibration uses browser-exposed actuators; adaptive triggers, controller speakers and LEDs are not implemented. Physical USB/Bluetooth pairing and hardware operation still require device checks.

Moves and combos come from the character's CMD definitions. For the bundled KFM, Z performs a light punch and down, down-forward, forward, Z performs the light Kung Fu Palm. These keys are subject to the character's `[Remap]` section.

Select **CPU** under **P1 control** or **P2 control**, then choose **CPU level** 1–8. Select both to watch a CPU match. Human players return `AILevel = 0`; CPU players return the selected level, including in helpers and after round resets. Character-authored CNS AI can use that trigger. A generic planner also approaches, guards and attempts attacks through the character's CMD buffer, including motions, held buttons, charges and remaps. Difficulty changes reaction delays and command/guard choices. This planner is deterministic and does not reproduce MUGEN's proprietary AI algorithm. Input plans stop during hitpause and global pauses and clear between scored rounds.

The simulation advances at 60 ticks per second at 1× speed. Pause stops simulation; the step button advances one tick, including controller evaluation and command input. Playback speed changes how quickly ticks run. Enable **Collision boxes** to inspect attack and hurt boxes, or toggle **Sound** for character audio. Browser audio starts after an interaction with the page.

**P1 palette** and **P2 palette** select colors independently in training. The choices set each fighter's `PalNo`, carry through round resets, and also apply to the selected character's preview. Embedded SFF palettes and referenced SFF v1 ACT files supply the available choices; missing or malformed palette files appear in the report.

Enable **Debug text** or press **Ctrl+D** on the stage to show each fighter's CNS clipboard. `DisplayToClipboard`, `AppendToClipboard` and `ClearClipboard` maintain independent debug buffers, including formatted numbers and text escapes. The exported report includes these buffers. After a match, the winner's `[Quotes]` text appears below the result banner; `VictoryQuote` requests carry between rounds.

## Script and combat support

- Ordered CNS state definitions and repeated trigger keys, including negative states; `triggerall` conditions and numbered trigger groups; controller persistence and hitpause handling.
- A bounded expression interpreter, without JavaScript `eval`, for arithmetic, comparisons, intervals, logic, variables, math functions, animation/time triggers, character constants and supported player redirections.
- CMD motions, facing-relative directions, simultaneous buttons, held inputs, releases, charge times, strict sequences, double taps, remapping and command buffering. Duplicate command names preserve alternative motions.
- State/animation changes, control and state type, velocity/position operations, variables, life/power, supported hit filters, HitDefs, target operations and basic character-bank Explods. Individual controller options still have gaps.
- Shared `HitBy`/`NotHitBy` `value`/`value2` slots, independent state/attack masks, wildcard attack classes and intersecting active filters. `HitOverride` supports eight slots, permanent `time=-1`, precedence, force-air gethit variables and rejection of matching foreign state-stealing attacks. `ChangeState`/`SelfState` accept `anim`, with destination Statedef animation taking precedence.
- HitDef `chainID`/`nochainID` contact restrictions and `hitonce`, including throws' default, nearest eligible targets and dropping other targets. Projectile chains use the root owner's identity while projectile hit limits remain governed by `projhits` and spacing.
- Fall recovery has an independent elapsed clock, including hitshake; hit time reaches -1 for `HitOver`. Liedown recovery counts down, accepts fresh physical inputs for faster recovery, and enters get-up state 5120 without requiring a character-authored transition. Basic fallback air recovery is available. Remaining KO/bounce/native timing edges are tracked below.
- `BindToTarget` supports target-ID selection and axis/head/mid anchors across coordinate systems. Native `e` and Single-mode `IsHomeTeam` are available.
- `AILevel` for human/CPU control and native `TeamMode = Single` / `TeamMode != Simul` comparisons in the current two-fighter mode. Missing partner redirections evaluate to bottom.
- Independent Helper runtimes, parent/root/helper/target/player-ID redirection, shared root power, helper input inheritance, size overrides and destruction. Helper variables are independent; root helper counts include descendants.
- Projectile movement, acceleration, scaling, hit limits, spacing, expiry/removal animations, priority cancellation, ownership and `NumProjID`/`Proj*Time`/legacy `ProjHit123` conditions. Projectiles created by helpers belong to their root.
- Foreign CNS ownership through `TargetState` and HitDef custom states, including different character local coordinates; attacker AIR with victim sprites through `ChangeAnim2`; and `SelfState` restoration. ReversalDef checks attack-box contacts and matching attack attributes.
- `Pause`/`SuperPause` scheduling, per-entity movement allowances, command buffering near pause end, temporary target defence, power cost, unhittability and super charge effects. SuperPause preempts an ordinary pause without consuming its remaining time.
- AIR `Clsn1` attack boxes against `Clsn2` hurt boxes, facing and character/local-coordinate scaling. Damage requires a valid HitDef and actual box overlap. One-tick attacks, priority, guarding, downed/falling hit flags, damage scaling, juggle budgets, hitpause, knockback, recovery, power gain and KO/reset behavior are implemented within the training model.
- `PalFX`/`AllPalFX`/`BGPalFX`, `AfterImage`/`AfterImageTime`, `EnvColor`, `EnvShake`/`FallEnvShake`, indexed SFF v1/v2 `RemapPal`, AngleDraw/Trans, and character/common-bank Explods. Palette mappings are independent, limited to eight active entries, and apply to matching indexed color depths. Afterimages retain their captured remaps. AIR offset/scale/angle/additive-coefficient interpolation and RGB addition/subtraction use the documented coefficients, including A1 = AS256D128.
- Explod stage/screen spaces, legacy postypes, player/helper binding IDs, binding-time changes, velocity/acceleration, facing/vertical flip, combined X/Y/Z rotation, transparency and basic shadows. Bindings resolve after all player updates; screen effects retain their size and position through camera movement and zoom. One-tick frames and the final animation frame render before removal. Hitpause, Pause and SuperPause allowances run independently of the owner; `removeongethit` and legacy `supermove` affect lifetime. Own-palette effects capture the local PalFX and remaps at creation while global palette effects remain live.
- Native camera-relative `Pos X`/`PosSet X`, with `Pos X + CameraPos X` yielding an absolute stage position. Stage-space Explods accept that absolute position; screen-space effects use `ScreenWidth`/`ScreenHeight` units without camera zoom.
- Character SND `PlaySnd`/`StopSnd`/`SndPan` playback, with basic channels, volume, frequency and looping. Common sounds, hit sparks and super charge effects load from `data/common.snd` and `data/fightfx.*` when supplied in an engine ZIP.
- Stage DEF/SFF assets, AIR background animations, background/foreground layers, normal/animated tiling, position links, velocity and sinusoidal motion, masking windows, transparency and parallax. Ordered BG controllers support animation, visibility, enable, position, velocity and sine changes, ID selection and looping.
- Stage player starts, physical and screen bounds, a bounded camera with vertical following and zoom, stage local coordinates, floor offsets, shadows and reflections. Camera/edge/game-space triggers and `StageVar` use the selected stage; `ScreenBound` controls camera participation. Backgrounds honor pause settings and `resetbg` across rounds.
- Two-player round phases, intros, KO/double KO, timeout scoring by life percentage, win poses, first-to-N scoring and automatic next rounds. `RoundState`, `RoundNo`, `RoundsExisted`, `Win*`, `Lose*`, `DrawGame` and `MatchOver` expose results to character scripts. Intro, `TimerFreeze`, `RoundNotOver` and `NoKO` assertions affect round progression. Power and variables above configured persistence indices carry between rounds; helpers and projectiles are cleared.
- Stage music with browser-supported Web Audio codecs, volume and sample-based loop points. WAV, Ogg, FLAC, MP3 and ADTS headers preserve the source sample rate when the browser resamples playback. Missing files, unsupported codecs such as MIDI and unresolved custom loops are reported. Shared engine sounds and effects remain available when another character ZIP is imported in the same session.
- Legacy `MakeDust` and `GameMakeAnim` create common fightfx animations with facing-relative positions, spacing, random offsets and drawing order. Missing common animations are reported. `ForceFeedback` accepts the documented constant parameters and drives compatible browser gamepad actuators, with self/opponent routing, motor selection and amplitude envelopes. A compatible connected device is required; single-motor devices share the sine/square output. Frequency is ignored as documented by MUGEN.
- Fighter corner push when a hit lands at a boundary, with separate ground/air/down/guard offsets, inherited defaults, hitpause and friction. HitDef `mindist`, `maxdist` and `snap` apply signed positions in the attacker's coordinates. Falling-hit animations support `fall.animtype` and the native `Med` spelling; `HitFallDamage` honors `fall.kill`.

An independently authored common-state subset supplies basic standing, walking, crouching, jumping, guarding and hit recovery when the character package omits shared engine states. A supplied `stcommon` file takes precedence over matching fallback states. Engine archives resolve `common1.cns` from the character folder or the archive's engine-root `data/` directory. Loading the original shared scripts does not fill missing engine behavior.

When present, state 5900 initializes the root characters before input-driven transitions. Training skips the standard state 190/191 intro after initialization by default; the `TrainingMatch` API can set `skipIntro:false`. Helper creation uses its requested state rather than running root initialization. Limits default to 56 live helpers per match, 256 projectiles and 512 Explods per entity; attempts to exceed limits produce diagnostics.

Explod `angle`, `xangle` and `yangle` accept degrees in both `Explod` and `ModifyExplod`. Rotations apply in Z, Y, X order and project orthographically around the sprite axis. Combined axes retain the resulting shear; turns past 90 degrees show the reversed texture, while an exactly edge-on sprite has no visible area. AIR offsets/scales/angles, both facing flags, palette effects, transparency, shadows and viewport clipping compose with this transform. Use a per-tick `ModifyExplod` controller to animate the angles. Invalid angle parameters produce controller diagnostics and leave an existing effect unchanged.

Custom states use the defining character's coordinate width, including when that character is itself in someone else's states. State entry and `SelfState` preserve shared world positions, velocity, bindings and corner push. Spatial gethit variables, Width overrides and attack distance convert into the new state units; damage, timers, variables and other scalars retain their values. Position, velocity, camera, body-distance, dimensional `Const` and redirected spatial triggers use the caller's active units. `Const240p`/`Const480p`/`Const720p` use width ratios, so `Const240p(3)` returns 12 in 1280x720 coordinates.

Sprite pixels and default body widths keep the victim's own units. Foreign AIR offsets and collision rectangles use the animation author's units and scale constants. Afterimages retain that conversion, while Explods, projectiles, hit definitions and shakes capture the relevant creation units so later state changes preserve their motion and effect scale. Helpers return to their own character's units, with spatial size overrides converted from the creating script. Reports include the active/base scales, state/animation owner IDs, velocity and gethit variables for inspecting these transitions.

## Compatibility reports

The report below the stage lists unsupported controllers found when scripts load and reports unsupported triggers, expressions, missing resources and incomplete effects as their code paths run. Entries include the script and line where available. **Download report** exports JSON with both fighters' current states, AI levels, commands, palettes, active/rendered Explods, the selected stage and camera, round scores and collected issues.

Unknown syntax and failed trigger expressions do not become unconditional success. Exercise different moves and input paths to discover additional gaps. A clean report or passing package check does not certify native MUGEN behavior.

Web Edition 13 adds the [shared CNS execution rules](docs/script-semantics.md): signed 32-bit integer/single-precision float expressions, native bottom handling, constant-only controller flags, contiguous trigger numbering, basic required-parameter checks, once-per-activation target/range expressions, alternate variable indices, and expression-based state-entry persistence flags. Reports now include working/system variables and control/type/physics fields. Individual controller options and exact native phase ordering still require further work and native comparisons.

Web Edition 14 adds the [combat rules pass](docs/combat-rules.md): continued guarding during guard stun, separate helper/projectile juggle costs, HitDef defaults, damage/healing scaling, configurable power awards, distinct hit counters, and trip/down/bounce/KO reactions. Reports include combat coefficients, counters, hit clocks and damage multipliers. Native captures are still needed for exact phase/rounding behavior, legacy quirks and the remaining combat interactions.

Web Edition 16 fixes [helper/projectile edge cases](docs/helper-projectile-edges.md): DestroySelf/orphan Explods and bindings, helper-relative inputs, multi-hit/persistent projectile quotas, paused hit spacing, Clsn2 cancellation, finite removal frames, IDs and stage shadows. Reports expose helper relationships, orphan effects and projectile state. The new cases have unit/browser coverage; native timing/version comparisons remain pending.

Web Edition 17 adds [helper/projectile interactions](docs/helper-projectile-interactions.md): complete root/helper/projectile guard-proximity scanning, helper body pushing and camera axes, simultaneous contacts, projectile contact immunity, preserved hitpause flags and deferred removal, movement-allowance clocks and boundary handling. The 381-test suite and browser fixtures cover these paths; exact native frame/version parity still needs captured comparisons.

Web Edition 18 improves [controller/trigger and custom-state palette accuracy](docs/custom-state-palette-accuracy.md): destination control ordering, animation-bank triggers, persistence isolation, Width/body distances, fresh independent PalFX, creator-family projectile palettes, and validated/nontransitive remaps. The 411-test suite includes 30 new cases; a two-character browser fixture verifies foreign AIR with the victim's own cyan sprites and palette. Native frame/version parity remains unverified.

Web Edition 19 adds [RAR4/RAR5 uploads, the shared Classic Arena build and landing defaults](docs/rar-classic-landing.md). Tomoka and all three supplied Taiga variants import on all routes; large RAR/FileReader/ZIP/touch checks pass. Missing native recovery constants exposed by Shiki R's fall report are supplied, with actual-script and browser landing regressions. The full local corpus passes 438 tests.

Web Edition 20 adds [stage import and PS5/controller setup](docs/stages-controllers.md). Forest of King Cruel imports with all 84 sprites, two animated fire layers and its packed 88-second MP3; legacy hires backgrounds and relocated music references are handled. Stage and simulated DualSense flows pass on all three pages. The full corpus passes 455 tests.

Full compatibility still requires substantial engine work, including:

- Every option and edge case of the implemented controllers. Common resources are available only when imported, and browser gamepad capabilities limit physical feedback.
- Remaining native effect ordering and palette-sharing edge cases. The implemented effects and palette snapshots do not establish complete native visual parity.
- Exact native hit ordering, multi-character hit chains, corner-push interactions with projectiles and moving cameras, fall/ground recovery, remaining defensive-filter edge cases and every HitDef option. Basic juggle budgets and fighter corner push are implemented; the wider combat model still has gaps.
- Exact native camera movement and zoom, every background rendering edge case, mixed stage/character coordinate conventions and all stage options. The current camera and parallax renderer implement a bounded subset; imported stages do not certify native visual parity.
- Simul/Turns teams, complete native match configuration and lifebar motifs, exact native AI behavior, and menus/storyboards. The UI supports two fighters with scripted training, CPU control or scored rounds; it does not reproduce the native game frontend.

The Windows `mugen.exe` and DLLs are not executed in the browser. Importing a full distribution supplies its character and data files to this runtime; it does not run the native engine.

## File formats and import limits

- Case-insensitive DEF/file references, nested directories, safe in-archive relative references, UTF-8/UTF-16 and legacy Windows text decoding.
- AIR actions, frame durations, loop starts, per-frame/default collision boxes, offsets, horizontal/vertical flips, scale and angle fields, with linear interpolation of supported visual parameters. Sprite transforms do not transform AIR collision boxes.
- SFF v1 indexed 8-bit PCX, shared/private palettes, linked sprite metadata and referenced ACT palettes with native color order; SFF v2 indexed raw, RLE8, RLE5 and LZ5 sprites; linked sprites/palettes; SFF 2.1 palette alpha and PNG8/PNG24/PNG32 payloads using non-interlaced PNG with 8-bit channels. Other encodings are reported when encountered.
- SND linked WAV samples, decoded for playback by Web Audio.
- ZIP limits: 128 MB compressed, 512 MB expanded and 5,000 entries. Entries escaping the archive root and conflicting normalized duplicates are rejected; byte-identical duplicates are coalesced. Unpacking and definition discovery run in a worker; sprite decoding and runtime initialization still run on the main thread.

## Development and validation

```sh
npm test
npm run build
```

The prioritized [compatibility matrix and replay workflow](docs/compatibility-matrix.md) tracks implemented paths, partial behavior and pending native evidence. `npm run compatibility` exports the bundled KFM input replay; `--baseline` compares captured fields and reports timing/value differences. Web regressions and native-engine captures retain separate provenance.

`python scripts/verify-combat.py` optionally checks the imported combat fixture through browser controls and report downloads; it requires a running dev server, Python Playwright and Chromium. Setup and outputs are described in the matrix.

`python scripts/verify-mobile-import.py` checks phone-sized touch file pickers, generic MIME types, FileReader fallback, failed-import retries, blocked escaping entries and actual imported KFM combat. Both browser scripts accept `MUGEN_TEST_URL` and `CHROMIUM_PATH`. Serve a production build under `/kenjatime/` and set that URL to check project-path assets and the sample download. These are emulated mobile checks, not physical Safari/Android device verification.

`python scripts/verify-arena.py` checks the built arena using a 55 MB stored ZIP, worker imports with a running UI timer, native touch input, a real scripted collision hit, multi-finger release/cancel, sliding across D-pad gaps, script-only exports and CPU mode. Set `MUGEN_ARENA_URL` to the built `arena/` URL. Its default is `http://127.0.0.1:5184/kenjatime/arena/`.

`python scripts/verify-script-semantics.py` imports typed-expression and trigger fixtures, executes CMD input and checks clipboard output, source diagnostics and the exported variable arrays. Its default production-check URL is `http://127.0.0.1:5186/kenjatime/`; override it with `MUGEN_TEST_URL`.

To run the Node tests directly with test-file isolation disabled:

```sh
node --test --experimental-test-isolation=none
```

Tests cover format decoding and malformed inputs, palette remapping, expression semantics, command recognition, controller execution, helper/projectile lifecycles, foreign ownership, pauses, palette/afterimage/blending math, collision combat, stage parsing/controllers/camera and round progression. Real KFM integration checks include walk/idle, jump/landing, the light punch's scripted 23 damage, out-of-range attacks, mirrored quarter-circle inputs and the throw's scripted 78 damage with state ownership restoration. Set `MUGEN_TEST_ARCHIVE` to a local native distribution ZIP to also run its stage asset audit. These checks validate the implemented subset, not universal character compatibility.

Controller checks also exercise legacy common animations, clipboard formatting and malformed inputs, quote persistence, gamepad amplitude envelopes, mirrored corner push, signed hit positioning and fall damage. The supplied classic and 720p KFM variants complete a 30-tick sweep of each of their 106 positive states without exceptions or compatibility diagnostics. This bounded sweep does not establish native equivalence or cover every path through those states. Browser verification covers the imported scripts through rendered effects, debug text, a two-round victory quote and a simulated gamepad actuator; physical rumble still depends on the user's hardware.

Explod tests cover binding order, helpers created later in the tick, stage/screen coordinates, animation removal, pauses, palette ownership and malformed inputs. Browser pixel checks confirm ACT colors, independent palette selections, local/global palette effects, rotated transparent sprites, and screen anchoring while the camera scrolls and zooms. Both native KFM variants also change palettes visibly, and the sample's 23-damage punch and zero-damage guard still pass in the browser.

Rotation tests compare the projected transform with independent 3D vector rotations, including angle wrapping, quarter/half turns and combined axes. Browser checks sample 50 texture points across tilted sprites, rear-facing images, mirrored/scaled AIR frames, additive/subtractive blending, clipping and `ModifyExplod` updates; they also check edge-on visibility and rotated shadows.

Defensive checks cover shared filter slots, native state/attack masks, expiration during hitpause, permanent overrides, force-air variables, foreign-state restrictions and state-change animation precedence. CPU checks run planned inputs through the real CMD matcher on both sides, including remaps and charge releases; verify pause behavior, helper AI levels and round resets; and require actual KFM collision damage. Both supplied native KFM variants also complete an 8,000-tick CPU run with hits, guards and round advancement without runtime diagnostics. Browser checks verify CPU control, human `AILevel=0`, imported CNS AI winning two scored rounds, report exports and controls at 390px width. The standalone sample still reports its existing AIR warnings and missing shared effects/audio; importing an engine distribution supplies common resources.

Mixed-coordinate checks cover 320/640/1280-wide state changes, both facings, chained ownership, redirects, spatial constants, hit/fall vectors, bindings, widths, collision geometry, AIR offsets, child entities and effect snapshots. With `MUGEN_TEST_ARCHIVE`, both native KFM variants throw each other in both facings, deal the scripted 78 damage, and restore their own coordinate units without runtime diagnostics. Browser checks import four mixed-coordinate pairings and compare sprite pixels before, during and after a custom state; all retain identical world size and the expected movement and offsets. These checks do not establish every native custom-state edge case.

Core modules expose `archive`/`animations`/`sff`/`soundArchive` in `src/formats.js`, `evaluateExpression` in `src/expressions.js`, `parseCommands`/`CommandBuffer` in `src/commands.js`, `parseProgram`/`FighterRuntime` in `src/runtime.js` and `TrainingMatch` in `src/combat.js`. `src/common.js` contains the fallback state scripts; `src/app-runtime.js` connects the runtime to the browser UI.

`src/projectiles.js` owns projectile lifecycles; `src/entities.js` resolves spawn positions. `src/effects.js` owns presentation-effect clocks and palette operations, and `src/rendering.js` provides deterministic AIR interpolation and pixel blending.

`src/stages.js` exposes `stageDefinitions`, `parseStage` and `StageRuntime`. `src/rounds.js` owns round phases and scoring. `TrainingMatch` accepts optional `stage` and `rules` arguments; omitting `rules` retains training behavior. `packageFiles` and `charactersFromFiles` let callers discover character and stage assets independently.

`src/explods.js` handles Explod controllers, binding, motion and presentation snapshots. `spriteRotation` in `src/rendering.js` projects the combined 3D sprite rotation. `src/palettes.js` builds character sprite banks and palette choices; `decodeAct` in `src/formats.js` decodes external palettes. `TrainingMatch` accepts `playerPalette` and `opponentPalette` options.

`src/hit-filters.js` compiles defensive attribute masks. `src/cpu.js` plans inputs and feeds `CommandBuffer`; `TrainingMatch` accepts `playerAILevel` and `opponentAILevel` (default 0, maximum 8). Reports include each fighter's AI level and active command names.

`src/hit-rules.js` enforces chain and single-target contact rules. `src/hit-state.js` owns recovery clocks and input edges. `TrainingMatch.tick` accepts optional third-argument `{playerInput, opponentInput}` physical-key sets for engine recovery handling; CPU inputs and the browser keyboard supply these automatically. `src/conformance.js` compares replay samples; `scripts/compatibility-audit.mjs` exports and compares archive scenarios.

`src/coordinates.js` separates base character units, active state units and animation ownership. Runtime positions and velocity use shared world units; `coordinateScale` maps active script units to that world, and `baseCoordinateScale` maps the character's original units. `sampleFighterAnimation` in `src/rendering.js` converts foreign AIR offsets for the victim's sprite bank.

`src/debug.js` implements bounded CNS clipboard formatting; `evaluateTypedExpression` preserves the integer/float distinction for debug output. `src/haptics.js` parses force-feedback constants and schedules browser actuator output independently of character state clocks.

## Archive study

The supplied `mugen-1.1b1.zip` contains 217 entries: a Windows executable, supporting DLLs, configuration and Lua helpers, HTML format documentation, stages, and classic/720p Kung Fu Man examples. It does not include the engine's implementation source.

The classic KFM sample uses SFF v2 with 281 sprites, AIR animations, CNS states/constants, CMD commands and SND sounds. Format tests decode every bundled sprite and check animation references, including intentional blank (`-1`) frames.

## Sample attribution

`public/kfm.zip` contains the supplied classic Kung Fu Man character by Elecbyte, including its original readme. That readme licenses KFM under the Creative Commons Noncommercial License; use this bundled sample for noncommercial purposes. The Windows engine and DLLs are not redistributed here. Replace/remove the sample before any use inconsistent with its license. Project code is independent of Elecbyte; no affiliation is implied.
