# Browser rendering backend

`render_webgl.go` and `render_webgl_cmdbuf.go` derive from the MIT-licensed
energyjp/ikemen-go-web renderer at commit
`96324a1c8aaaa5c0cb7756aebeb4b572588523ee`. The upstream license is distributed
in `public/engine/LICENSE.txt`. `scripts/build-go-engine.py` copies these
maintained overrides into the pinned Go source before compiling it, and records
source checksums in the shipped provenance. Native engine libraries are unchanged.

`submit.js` consumes the Go command stream synchronously from exported WASM
memory. It refreshes typed-array views after memory growth, packs dynamic sprite
and font vertices into reusable streams, and preserves the original ordered GL
operations. Draws are never sorted by texture. Direct resource/model calls flush
the stream first. The scalar-uniform cache and command encoding originated in
the upstream renderer; this implementation adds matrix caching and replaces its
copied JS command buffer and per-sprite vertex uploads.

The default output blits the scene framebuffer directly to the canvas. Actual
postprocessing retains the original shader path. Custom sprite fragment shaders,
grab passes, font rendering and indexed models keep their existing interfaces.
Texture/resource uploads still use scratch arrays. This is a rewrite of the
browser rendering backend, not the MUGEN simulation or a claim of new native
media capabilities.

`test/go-gpu.test.js` compares semantic draws with the upstream interpreter,
including memory growth, deferred geometry and model bindings.
`python scripts/verify-go-gpu.py` compares pixels on real WebGL2 across all 30
opcodes, mixed blend modes, transforms, clipping, fonts and indexed geometry.
`python scripts/benchmark-go-webgl.py` measures real Go matches. See
`docs/go-webgl-renderer.md` for results and measurement limits.
