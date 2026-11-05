# Controller, trigger and palette accuracy: Web Edition 18

This pass corrects shared controller rules and custom-state/palette ownership. All **411 Node tests** pass with the full supplied MUGEN example archive, including **30 new regressions**, with no skips. Independent native executable frame captures remain unavailable; this is tested web behavior rather than complete MUGEN certification.

## Controllers and triggers

- **ChangeState / SelfState:** the controller's integer `ctrl` is applied before destination StateDef processing. A destination `ctrl` can replace it. Controller `ctrl=-1` preserves control; fractional inputs are converted to integers first. Training's explicit standard-intro skip still gives control after entering its idle state.
- **StateDef animation:** `anim=-1` preserves the current animation and clock, including foreign AIR ownership. Controller transition `anim=-1` also preserves it unless the destination explicitly selects another action.
- **ChangeAnim / ChangeAnim2:** an out-of-range `elem` starts at element 1. Negative action numbers fall back to action 0 with a diagnostic. A missing positive action retains the previous animation and reports the missing resource.
- **Persistence:** counters use controller-object identity. Two different character programs can assign the same numeric controller ID without consuming each other's persistence counter while own negative states and foreign positive states run in the same tick.
- **AnimExist:** looks in the current animation bank, independently of state ownership. `SelfAnimExist` continues to inspect the character's own AIR. A victim can restore its own states while retaining a foreign animation; subsequent ChangeAnim selects local AIR again.
- **HitDefAttr:** requires attack MoveType and uses the same state/attack masks as the hit filters, including wildcard attack classes and logical inversion.
- **Width:** omitted player/edge components default to zero. `value` sets both bars; combining it with `player` or `edge` is rejected before changing widths. Integer component conversion and one-component defaults are covered.
- **Body/edge triggers:** `P2BodyDist X` uses active Width values, the opponent's facing/front/back side, signed distance and mixed state units. FrontEdgeBodyDist/BackEdgeBodyDist use the edge width bar. Pushing, screen constraints and triggers share the same world-width conversion.

Tests also cover own State -2 during foreign states, suppression of own -3/-1, restoration after SelfState, rejected state changes and coordinate restoration. Existing classic/720p KFM throws remain covered.

## Working palettes

An independent helper or Explod copies its creator's remaps with a **fresh local PalFX**. It no longer freezes the creator's active tint indefinitely. Global AllPalFX continues to affect independent objects. A helper with `ownpal=0` ignores its own PalFX controller; it follows its shared working palette. RemapPal still changes a shared working palette. A hit's palette effect addresses the actual working-palette owner.

Projectile combat ownership remains with the root. Palette ownership follows the creator's palette family, which may be an independent helper. A shared projectile follows that family's remaps and PalFX; an own-palette projectile copies its creator's remaps and starts without local PalFX. Surviving projectile visuals retain a destroyed independent creator's palette effect until its lifetime expires. Cleanup keeps only palette owners required by current visuals.

RemapPal now:

- Converts pairs to integers and defaults an omitted item number to zero.
- Validates source/destination existence and matching indexed color depth when SFF metadata is available. Failed changes retain the working mappings and report the problem. Bare script-only fixtures cannot validate absent sprite data.
- Supports one-source identity/removal exceptions beneath an all-palettes mapping, without undoing unrelated remaps.
- Keeps mappings nontransitive and enforces eight active mappings while permitting replacement/removal.
- Validates helper/projectile/Explod `remappal` destinations. An invalid optional remap reports a palette diagnostic and retains the valid creation palette rather than dropping the entity.

PalFX/AllPalFX/BGPalFX integer fields are normalized, partial add/mul/sine vectors receive independent defaults, multiplication stays nonnegative and color level is clamped to 0–256. Negative sine periods reverse the waveform. Palette banks are reused across validation and rendering, retaining the existing decoded-cache bounds.

Browser reports add `paletteState` with local effect descriptors, working remaps, own-palette flags and selected palette numbers. `PalNo` remains the selected character palette; a RemapPal change does not rewrite it.

## Evidence

`test/custom-palette-accuracy.test.js` uses independent CNS/AIR/SFF fixtures, differing coordinate sizes and actual palette tables. Two older tests that expected inherited frozen PalFX were corrected. The orphan-tint browser fixture now explicitly requests `ownpal=1` for its independently tinted helper. The Width fixture uses the documented separate player/edge syntax.

`scripts/verify-custom-palettes.py` imports two separate characters through the browser UI, selects the victim's second palette, runs a throw/custom state, and exports reports and pixels. It verifies:

- The victim uses foreign state/AIR owner 1 at coordinate scale 1 while keeping **81 cyan pixels** from its own SFF and selected palette 2.
- SelfState restores state owner 2 and coordinate scale 0.5 while retaining foreign AIR owner 1. Destination StateDef control is 0. A later ChangeAnim restores local AIR.
- An independent helper starts with neutral local PalFX. Shared and independent projectiles copy the creator's green remap; only the shared projectile receives its local teal tint.
- Palette colors remain visible after helper destruction and return to green when the tint expires.
- No browser errors or failed requests, and no horizontal overflow at 390px.

All seven benchmark scenes retain identical simulation/entity behavior hashes and zero routine pixel readbacks. Five retain pixel-identical output. The custom/combined scenes intentionally change because their `ownpal=1` Explods now start without the old frozen parent tint; maximum channel changes are 43/39, confined to the effect region. The strict Edition 17 pixel comparator flags those two corrected scenes. Current headless render p95 is 13.9 ms for entities and 46.7 ms for combined; these are uncontrolled-host CPU measurements, not phone FPS or a speedup claim. Low mode records 65 simulation ticks over roughly 1.1 seconds at 30 rendered FPS.

Compact results, full-example state sweeps and performance checks are recorded in [accuracy evidence](custom-state-palette-evidence.json).

```sh
MUGEN_TEST_ARCHIVE=/path/to/mugen-1.1b1.zip npm test
npm run compatibility
npm run build
MUGEN_TEST_URL=http://127.0.0.1:5173/ python scripts/verify-custom-palettes.py
```

## References and remaining limits

The supplied MUGEN 1.1 beta 1 controller/trigger documentation is the primary reference for Width, PalFX, RemapPal, helper/Explod ownpal, body distances and HitDefAttr. The public [Ikemen GO character runtime](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/char.go) and [controller implementation](https://github.com/ikemen-engine/Ikemen-GO/blob/develop/src/bytecode.go) provide secondary evidence for undocumented animation-bank selection, state-entry control order, element fallback and fresh/shared PalFX behavior. Ikemen extensions are not being claimed as MUGEN support.

Remaining work includes native numeric/phase/version captures, every controller's conditional parameters, zero-duration AIR/animation-loop queries, negative-state persistence across transitions, legacy air/lying edge-distance offsets, unusual invalid-state behavior, duplicate/linked/private palette quirks, transparency and blend/palette ordering, afterimage variants, lifebar/motif integration and wider real-character packs. `completeCompatibility` remains false.
