# Stage imports and physical-controller setup: Edition 20

The lab, Web Arena and Classic Arena share the new stage library and controller setup. The complete local corpus passes **455 Node tests**, with the native KFM archive, supplied Tomoka/Taiga RARs, Shiki script/report exports and Forest stage supplied through environment paths. There are **17 new cases** beyond Edition 19. Uploaded assets are not bundled in this repository or the deployed site.

## Forest of King Cruel

The supplied archive contains `Forest_of_King_Cruel.def`, an SFF v2 bank and `Blood heat!.mp3`. All **84 sprites** decode and every referenced background frame exists. The DEF creates **64 normal backgrounds and two ten-frame animated fire layers**. Browser audio decodes the packed MP3 to **88 seconds at 44,100 Hz** and loops it. There are no additional stage/runtime diagnostics in the checked browser flow; the bundled KFM retains its three pre-existing AIR warnings.

Two defects affected this pack:

- Its `hires=1` setting was ignored. Background positions, sprites and camera deltas now use the legacy half-resolution conversion, while player starts, floor position, camera limits and character units retain their stage coordinate system.
- Its music requests `sound/Blood heat!.mp3`, but the MP3 is adjacent to the DEF. Resolution now tries every exact stage/engine path before an adjacent filename fallback. It never searches unrelated stage folders by basename and cannot load files outside the in-memory package. The legacy signed `bgvolume` offset is accepted; explicit modern `bgmvolume` takes priority.

The explicit **Add stage** chooser accepts ZIP/RAR, reports a character-only archive without changing the roster, and loads stages independently of fighters. The stage picker is visible before importing a character. A stage-only import with an existing fighter opens training to show it. Otherwise, load a fighter or the KFM sample to play there. Stages stay available for the current browser session and clear on reload.

`verify-stage-import.py` checks the real RAR on all three pages at a 390px mobile viewport, including Classic FileReader fallback, camera scrolling, background clocks, decoded/playing music, failed-import recovery and no browser/request errors. An independently generated tiled checker stage authored in ordinary and doubled legacy-hires coordinates produces identical pixels at camera X=0 and at an integer clamped X=80. This is a browser regression, not an independent native MUGEN frame capture. Fractional camera rasterization and broader legacy/version combinations remain outside that pixel-equivalence claim.

The supplied MUGEN background documentation defines localcoord, stage geometry and the legacy music volume offset. Its newer StageInfo documentation omits the deprecated hires flag; the public [Ikemen GO stage renderer](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/stage.go) was used as a secondary reference for the half-scale background conversion. Native executable parity is still unverified.

## PS5/DualSense and other controllers

The browser uses the standard **Gamepad API**, with no external driver, network pairing service or WebHID dependency. Pair through the device OS by Bluetooth or connect USB, then press a face button. Open **Controllers** above the viewer to see connection status, choose P1/P2 devices, configure each player's buttons/deadzone or test vibration. P2 needs **Two players** or **Keyboard / controller P2**; CPU and dummy modes retain their intended behavior.

| PlayStation input | Default MUGEN input |
| --- | --- |
| D-pad / left stick | Facing-aware physical directions |
| Square / Triangle / L1 | x / y / z |
| Cross / Circle / R1 | a / b / c |
| Options | Start (`s`) |
| L2 / R2 / Create | Unused; assign an action in settings |

Assignments handle holes in `GamepadList` and reserve explicit choices before automatic ones. Disconnecting P1 does not promote an already assigned P2 into P1. One device belongs to one player. Button maps/deadzones persist per player; resets and malformed saved settings use valid defaults. D-pad presses override analog drift; opposite D-pad directions cancel. Analog trigger values can be mapped to attack buttons.

Controller inputs pass through the same timestamped input buffer and CMD interpreter as keyboard/touch inputs, including short sampled presses between simulation ticks. Disconnects remove pending and held input for that controller source, preserving keyboard/touch input. Unfocused/hidden pages suspend gamepad input. The configuration controls suppress gameplay input while editing their input/select fields.

Unmapped devices do not supply gameplay input automatically. The optional custom-layout setting enables manually assigned buttons with the first two stick axes and conventional D-pad indices; it is not a complete driver database. Prefer standard browser mapping for automatic DualSense support. Unsupported or blocked Gamepad API access produces a visible capability message.

Native CNS ForceFeedback and the vibration test follow the assigned player device rather than assuming browser slots 0/1. They use `vibrationActuator` or a legacy haptic actuator when exposed. Browser/hardware limits still apply. Adaptive triggers, speakers, LEDs and console-specific controller features are not implemented.

`verify-controllers.py` simulates DualSense Gamepad API devices in sparse slots 2 and 5 on all three pages. It verifies P1/P2 KFM attacks (23 damage each), brief presses with the 30 FPS preset, remapping, exclusive assignment, vibration routing, disconnect release, focus suspension, persisted settings, no browser/request errors and no 390px horizontal overflow. **No physical PS5 controller or phone was available**, so USB/Bluetooth transport, hardware mapping, wireless latency and actual actuator output are not certified.

## Reproduce

```sh
npm ci
npm test
npm run build
MUGEN_FOREST_RAR=/path/Forest.rar python scripts/verify-stage-import.py
python scripts/verify-controllers.py
```

Serve the built site under a project path; `MUGEN_TEST_BASE` overrides the scripts' default test URL. Optional corpus paths are `MUGEN_TEST_ARCHIVE`, `MUGEN_TOMOKA_RAR`, `MUGEN_TAIGA_RAR`, `MUGEN_SHIKI_SCRIPTS`, `MUGEN_SHIKI_REPORT` and `MUGEN_FOREST_RAR`. The seven existing Canvas benchmark scenes retain identical pixels and behavior hashes versus Edition 19, with zero routine pixel readbacks. The 30 FPS presentation preset still advances 60 Hz simulation; software-browser timings do not certify physical-phone performance.

Compact results and build hashes are in [release evidence](stages-controllers-evidence.json). Reports continue to state `completeCompatibility: false`.
