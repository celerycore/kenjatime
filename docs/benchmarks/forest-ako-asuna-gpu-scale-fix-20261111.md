# Forest of King Cruel / Ako / Asuna — GPU budget and MUGEN camera fix

Date: 2026-11-11  
Branch: `feature/kotlin-wasm-blueprint-20261111` — draft PR #14.  
Status: tested patch, **not deployed**. The Kotlin/Wasm candidate engine remains off by default.

## Reproduction from actual original user uploads

| Archive | Source details |
|---|---|
| `Forest of King Cruel.rar` | 66 BG sections (64 static + 2 animated), 84 SFF entries; `HIres=1`, `zoffset=220`, `verticalfollow=.95`, `boundhigh=-170`, `tension=40`, no `localcoord` override; 1200×864 large sprite frames |
| `Ako.zip` | 2,332 SFF sprites, `size.xscale=.315`, `size.yscale=.315`, `velocity.jump.neu=0,-8.4`, `movement.yaccel=.44` |
| `Asuna.zip` | 899 SFF sprites, same .315 sprite scale, neutral jump -8.4, gravity .44 |

Original formats were not changed or committed.

The old Three.js renderer uploaded each sprite on first appearance and **never evicted** it. A long match or animation-heavy character therefore accumulated textures until the fixed `64 MiB` upload cap threw the fatal `GPU texture budget exceeded. Close this match or use a smaller stage.` exception. The match worker interpreted it as fatal and closed the match.

## Fix implemented

1. `src/core/texture-residency.js`: deterministic oldest-first eviction planner. The current frame's sprites, palettes, `@white`, and `@spark` are pinned.
2. `src/core/three-renderer.js`: evicts old, inactive WebGL `DataTexture` allocations when approaching the cap; updates per-frame LRU usage, re-uploads previously seen textures on demand, exposes eviction and missing-texture counters. An extreme frame that cannot fit does **not** crash the fight: only the offending image is skipped, preserving simulation.
3. `src/core/session.js`: `restoreAssets(ids)` reconstructs evicted SFF fighter/stage sprites and palette textures from already-imported archive banks without storing a second unbounded RGBA copy; renderer obtains them through `src/core/runtime.js`.
4. `src/stages.js` and `src/core/session.js`: on a 16:9 surface, the legacy stage now retains its authored `240` logical-unit height while widening the horizontal fight view from 320 to **426⅔**. The previous forced 320×180 crop magnified fighters by ~33%. Explicit `cuthigh/cutlow` guidance and genuine 16:9 localcoord remain honored.
5. **No edits to physics:** authored sprite x/y scales .315, neutral jump -8.4 and gravity .44 are unchanged. Expected continuous-time apex is ~80 logical units. IKEMEN stage verticalfollow=.95 can move the camera during a jump, reducing its apparent screen displacement, which is not a jump-physics bug.

## Actual user-asset validation — offline headless Node

The patch was exported from the **exact tested feature-branch** GitHub Actions checkout and run locally with the user's archives. Tests below use real CoreSession, SFF decoding, actual `CoreThreeRenderer.upload()` and a stubbed GPU capability provider, **not a real WebGL context**.

| Scenario | GPU budget | Simulation/draw frames | Resident peak | Evictions | Recovered images | Missing visible textures |
|---|---:|---:|---:|---:|---:|---:|
| CPU match Ako vs Asuna on Forest | 64 MiB | 1200 | 45.58 MiB | 0 | 0 | 0 |
| Same deterministic CPU match | 12 MiB | 1200 | 12.00 MiB | 1862 | 1530 | 0 |
| Forced original animation action sweep | 64 MiB | 1990 | 63.96 MiB | 511 | 22 | 0 |

Both 1200-tick CPU runs produced identical deterministic match-state hash:
`79f1879d32482f7b1836fcce33f2eee560eab6414f7aa265a7c73f6a5e5084b2`.
The 1990 sampled character animation frames generated 102.92 MiB of cumulative image data, which would exceed the previous non-evicting budget.

Real WebGL2 was unavailable in this local Chromium build even with SwiftShader flags, so **physical GPU / Android phone FPS and visual continuity need user-device verification**.

### Native IKEMEN GO comparison

The supplied original stage and both characters ran under the official IKEMEN GO v1.0.0 Linux executable on a software-rendered Xvfb display. The native engine presented the 4:3 match picture pillarboxed, whereas the fixed Kenjatime mode deliberately uses a wider 16:9 horizontal view, keeping the vertical 240-unit character scale. This is *MUGEN-like vertical framing*, not a claim of pixel-identical native aspect policy.

The in-game screenshot is retained locally as private QA evidence, not checked in. See MUGEN 1.1 background documentation for explicit localcoord, zoom and crop fields: https://network.mugenguild.com/justnopoint/1.1docs/bgs.html

## Tests, build and release status

- Core CI tests pass, including `gpu-residency-regression.test.js`, `legacy-stage-viewport-regression.test.js`, original KFM interaction and stress regression gates. See https://github.com/celerycore/kenjatime/actions/runs/43022545615
- Downloadable *non-deployed* browser preview build (requires the user to import their three original archives themselves): https://github.com/celerycore/kenjatime/actions/runs/43023493926
- Original stage/character package files were not embedded in the preview artifact.
- Keep draft PR #14 unmerged and the Kotlin/Wasm backend disabled by default until full live WebGL device smoke testing and original assets' on-device user acceptance are complete.
