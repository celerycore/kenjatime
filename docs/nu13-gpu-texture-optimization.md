# Nu-13 GPU texture retention regression · November 11, 2026

## Supplied original archive audit (local; files not checked into GitHub)

Archive: `Nu13_Kenjatime_Fixed_Download(1).zip` supplied by the user.
The 18-file ZIP is about 172 MiB compressed and 297 MiB expanded.
The original `Nu-13.sff` is 291,586,766 bytes (~278 MiB) SFF v1 with
**4,585 sprite entries**, of which 4,520 are non-linked PCX sprite entries.

A metadata-only scan of the authored sprite dimensions found:

- **676.2 MiB** potential raw GPU memory if every decoded indexed R8 sprite
  were made resident at once; **2,704.6 MiB** if converted to RGBA8.
- The largest individual PCX sprite is 1,242 × 1,364 (**1.62 MiB** indexed).
- The native standing sprite group 0, image 0 is 309 × 395 (122,055 bytes indexed).
- **64 MiB** was the browser's complete GPU texture budget.
- The previous renderer never evicted an uploaded sprite before closing the match.
  Therefore changing the stage to the built-in training grid could not prevent
  the cumulative character-sprite budget failure.

The audit reflects data in the user's archive, not a claim that every sprite
can or should be loaded simultaneously.

## Fix in the browser engine

1. `gpu-sprite-budget.js` chooses least-recently-used removable textures
   without evicting active fighters, stage model/video allocations, or
   white/spark fallbacks. It does not modify source sprite data.
2. `CoreThreeRenderer` now reclaims GPU textures before the cache reaches
   64 MiB; essential player sprites are admitted before optional effects.
   If instantaneous simultaneous demand cannot fit, an optional texture
   can be deferred instead of crashing the match.
3. Renderer reports evicted/deferred/missing IDs back to `CoreSession`.
   The SFF stays intact; only the frames shown again are decoded/re-uploaded.
4. SFF decoder's existing **16 MiB CPU LRU** now remains useful across
   animation loops rather than being forcibly cleared on each upload.
5. Added diagnostic counters via `window.__kenjatimeCoreBattle?.gpu()`:
   `textureBytes`, `maxTextureBytes`, `spriteEvictions`,
   and `deferredSpriteUploads`.

## Validation

- Deterministic synthetic cache test processes 1,250 distinct Nu-13-like
  frame allocations with LRU recycling and player sprites protected.
- Real bundled Kung Fu Man CoreSession re-uploads evicted sprite/palette
  assets without changing the combat snapshot.
- Separate *metadata-only* cache simulation of all 4,520 original Nu-13
  PCX dimensions stayed at/below 64 MiB (4,235 evictions, no oversized
  original sprites); **this is not a real GPU/Android benchmark**.
- CI builds and Chrome desktop/mobile website QA verify the browser
  integration separately from the copyrighted archive.

## Remaining work

The original Nu-13 full match has not yet been completed in a real
WebGL2 browser and Android device. A ~278 MiB SFF must still be held in
CPU address space during live match playback, so very low-memory mobile
devices can still run out of RAM independently of GPU texture eviction.
Full native MUGEN/IKEMEN GO character/controller/animation parity also
remains an explicit separate goal. Future work: backed-on-disk sprite
source streaming, GPU texture atlas paging, per-device VRAM telemetry,
and full real-character/mobile soak tests. Do not promise universal
compatibility before those are verified.
