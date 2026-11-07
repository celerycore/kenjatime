# Three.js renderer

The Three.js 0.187.0 adapter consumes the native Go draw ABI and renders ordered
BufferGeometry/RawShaderMaterial batches using shared external GPU resources.
Go owns gameplay and decoded resources. Three owns shader materials, geometry
bindings and draws, including indexed geometry and the final screen quad.

Use the GPU pixel regression, real Go match/presentation checks and the runtime
benchmark before changing this boundary. Framebuffer/resource changes must flush
queued draws. Mesh uniforms and clip state must be snapshotted; transparent draws
must retain their original order. See docs/three-browser-renderer.md.
