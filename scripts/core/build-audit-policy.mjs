/** Shared, narrow post-bundle checks. Vite also enforces the module graph
 * against core/source-policy.json before this file is called.
 * Compatibility vocabulary (e.g. "ikemen-go") is NOT an engine binary.
 */
const bootstrap = /kenjatimeEngineSnapshot|kenjatimeAudioPull|\bGOGC\b|\bgo\.importObject\b/i;
const payloadReference =
  /(?:^|[\\/])(?:ikemen[^\\/\s"'\x60]*\.(?:wasm(?:\.bin)?|exe|zip|js)|wasm_exec\.js|core\.zip)(?=$|[?#&"'\x60\s])/i;

export function hasExternalEngineReference(content) {
  return bootstrap.test(content) || payloadReference.test(content);
}

export function isExternalEnginePayloadPath(path) {
  return /(?:^|[\\/])(?:core\.zip|ikemen[^\\/]*|wasm_exec\.js)$/i.test(path);
}
