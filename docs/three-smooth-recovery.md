# Smooth Three.js recovery point

Saved on 7 November 2026 after the user confirmed that the Three.js renderer
made the game smooth, before changing how a fight opens on phones.

| Component | Recovery tag | Exact commit |
| --- | --- | --- |
| Source | `recovery/three-smooth-2026-11-07` | `cec3ed0069bd119a9f6cf615bc6dd2a009ee18b3` |
| Published web build | `recovery/three-smooth-pages-2026-11-07` | `3fee1b5812619513eefaeac86c06c5bbd2571d9d` |

Both annotated tags are pushed to `celerycore/kenjatime`. The source tag includes
the pinned Three.js renderer, Go/WASM payload, lockfile, build provenance and
verification evidence. The Pages tag contains the exact published web files.

To inspect or rebuild the source without moving an existing branch:

```sh
git fetch origin tag recovery/three-smooth-2026-11-07
git switch -c restore-three-smooth recovery/three-smooth-2026-11-07
npm ci
npm run build
```

The raw WASM SHA-256 is
`c3d789fca51c85d4e70c4af177dd23dba6bfe8fd4a83de379e71652b13503abc`.
The recovery web build contains 48 files. Local offline copies include source
and Pages Git bundles, a web-build ZIP, and a SHA-256 manifest in
`work/recovery/three-smooth-2026-11-07/`. These copies were created before edits;
the pushed tags are the durable repository recovery references.

Subsequent same-page launch changes preserve this renderer and engine binary.
They put fights in the existing preview viewer, remove automatic fullscreen and
orientation requests, and retain the Menu, Pause, sound and quality controls.
