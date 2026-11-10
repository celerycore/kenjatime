/**
 * Explicit opt-in bridge for the Kotlin/Wasm migration track.
 * This does NOT silently replace the existing JS MUGEN interpreter.
 * Build: ./android/gradlew -p kotlin-core wasmJsBrowserProductionWebpack
 * Supply the .mjs URL emitted by that build to loadKotlinCore().
 */
export async function loadKotlinCore(moduleUrl) {
  if (!moduleUrl || typeof moduleUrl !== "string")
    throw new Error("A built Kotlin/Wasm .mjs module URL is required");
  const imported = await import(/* @vite-ignore */ moduleUrl);
  const api = imported.default;
  if (!api || typeof api.ktCoreCreate !== "function")
    throw new Error("Kotlin/Wasm exports were not found");
  return {
    version: api.ktCoreVersion(),
    create({ player1, player2 }) {
      const handle = api.ktCoreCreate(
        player1.name, player2.name,
        player1.air ?? "", player2.air ?? "",
        player1.cns ?? "", player2.cns ?? "",
      );
      let closed = false;
      return {
        step(a = {}, b = {}) {
          if (closed) throw new Error("Fight released");
          return api.ktCoreStep(handle, a.directions ?? 0, a.buttons ?? "",
            b.directions ?? 0, b.buttons ?? "");
        },
        snapshot(side = 0) {
          if (closed) throw new Error("Fight released");
          return JSON.parse(api.ktCoreSnapshot(handle, side));
        },
        issues() { return api.ktCoreIssues(handle).split("\n").filter(Boolean); },
        close() { if (!closed) { closed = true; api.ktCoreRelease(handle); } },
      };
    },
  };
}
