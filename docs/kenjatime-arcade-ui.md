# Kenjatime Arcade UI — browser presentation standard

This branch is a **presentation-only redesign** of the independent browser fighting
engine. Existing Core archive import, local package library, MUGEN fighter/stage
selection, optional common effects, controller mapping, gamepads, training,
versus/CPU battles, palettes and battle simulation remain in place.

## Visual identity

- Gart Bernstein: lime-green twin-tails, pink ribbons, white beret, smug
  arcade-fighter expression, leverless controller; source art is the
  user-provided Kenjatime app icon.
- Edelweiss: cold silver-haired assassin, blue/red heterochromia, ice-blue
  winter-battle accents and Glacial Blade identity; source art is the
  previously generated Kenjatime versus UI mockup.
- Global palette: lime \`#B8FF16\`, pink \`#FF188C\`, ice \`#5BE5FF\`,
  ink \`#07110B\`, white \`#F5FFF3\`. Ice is a fighter-specific accent,
  not a replacement of the game's global green palette.
- Linework: thick black / dark borders, sharp slashes, asymmetrical panels,
  halftone texture, highly legible cel-shaded arcade visuals. CSS shadows and
  gradients; no new compositor/rendering loop.
- Font variants (selectable in header, saved to localStorage):
  Slash Circuit = Russo One, Arcade Condensed = Teko,
  Digital Arena = Oxanium, Neon Industrial = Rajdhani.
  Fonts are optional browser-hosted webfonts with system fallbacks.
- HUD: angular green healthbars, ice accent on rival frame, bold centered
  timer, oversized FIGHT / KO lettering and pink slash accents. Existing
  per-tick battle state and update handlers are not modified.
- Favicon: derived from the user's supplied Kenjatime Gart image.

## Gameplay boundary

**Kenjatime is an engine, not a fixed-character fighting game.**
Players continue to import character and stage archives into a device-local
library and select the assets they own. Preserve multi-volume archives,
stage dependency handling, local library storage, controllers and game modes.

MUGEN 1.0/1.1, legacy MUGEN, and IKEMEN GO including ZSS are compatibility
targets, not certified blanket guarantees. The default browser runtime is
the existing independent JavaScript Core. Kotlin/Wasm remains experimental.
Do not add a fake archive, pretend to interpret unsupported controllers,
or silently accept an incompatible character as fully operational.

**Future planned default fighters:** Kenjatime Gart and Kenjatime Edelweiss.
The portraits included in this branch are branded *concept artwork only*;
they are not playable characters, MUGEN archives, spritesheets or move lists.
When the core supports their actual authored fighter packages and stages,
provide those only with explicit art/animation/audio content and engine tests.
Do not silently turn their concept portraits into fake fighter slots.

## Release / QA

This branch publishes only to \`/kenjatime/arcade/\` and does not change
the GitHub Pages homepage, PR #12, or PR #13. To consider the new UI the
default, verify both mobile and desktop viewport layout, uploads (ZIP/RAR/
7z/TAR/split volumes where supported), original Dark Donald and both Rare
Akuma builds under the existing runtime, stage selection, gameplay/rounds,
controller input, 60fps performance and character-archive persistence.

Smoke suite:
\`node --test test/core/kenja-arcade.test.js test/core/round-readiness.test.js test/core/session.test.js test/rounds.test.js\`

Standalone build:
\`npm run build:core\`

Browser QA:
\`python scripts/core/verify-kenja-arcade.py\` (requires Playwright/Chromium)
