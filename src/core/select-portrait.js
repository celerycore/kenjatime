import { sff } from "../formats.js";

/** MUGEN/IKEMEN select portraits: 9000,1 (large), then 9000,0 (small). */
export function selectPortraitSpriteIndices(sprites) {
  if (!Array.isArray(sprites)) return [];
  const candidates = [];
  for (const number of [1, 0]) {
    const index = sprites.findIndex(
      (sprite) => sprite.group === 9000 && sprite.number === number,
    );
    if (index >= 0) candidates.push(index);
  }
  return candidates;
}

/**
 * Decode only two tiny HUD thumbnails before original SFF buffers transfer
 * to the graphics worker. Never embed base64 portrait data in frame-state
 * messages: the UI already owns the pictures for the duration of the fight.
 */
export function decodeSelectPortraits(files, fighters = [], {
  maxSize = 320,
  canvasFactory = () => document.createElement("canvas"),
  decoder = sff,
} = {}) {
  const bankCache = new Map();
  const portraits = fighters.slice(0, 2).map((fighter) => {
    const path = fighter?.sprite;
    const bytes = path && files?.[path];
    if (!(bytes instanceof Uint8Array)) return null;
    let bank;
    try {
      if (!bankCache.has(path)) {
        bankCache.set(path, decoder(bytes, { cacheBytes: 2 * 1024 * 1024 }));
      }
      bank = bankCache.get(path);
      for (const index of selectPortraitSpriteIndices(bank.sprites)) {
        try {
          // 9000,x artwork frequently carries a dedicated PCX/SFF palette.
          // Forcing the player's gameplay palette can recolor skin and hair
          // into inverted/false colors. Respect the portrait's native colors
          // for both SFF v1 and v2, regardless of P1/P2 palette selection.
          const sprite = bank.decode(index);
          if (!sprite?.w || !sprite?.h ||
              sprite.w * sprite.h > 4_000_000 ||
              !sprite.rgba || sprite.rgba.byteLength !== sprite.w * sprite.h * 4) {
            continue;
          }
          const source = canvasFactory();
          source.width = sprite.w;
          source.height = sprite.h;
          const ctx = source.getContext("2d");
          if (!ctx) continue;
          ctx.putImageData(new ImageData(sprite.rgba, sprite.w, sprite.h), 0, 0);
          const scale = Math.min(1, maxSize / Math.max(sprite.w, sprite.h));
          const output = canvasFactory();
          output.width = Math.max(1, Math.round(sprite.w * scale));
          output.height = Math.max(1, Math.round(sprite.h * scale));
          const out = output.getContext("2d");
          if (!out) continue;
          out.imageSmoothingEnabled = true;
          out.imageSmoothingQuality = "high";
          out.drawImage(source, 0, 0, output.width, output.height);
          const dataURL = output.toDataURL("image/png");
          // Release short-lived 2D backing stores before moving the match
          // archives into the WebGL/WebGPU worker.
          source.width = source.height = 0;
          output.width = output.height = 0;
          return typeof dataURL === "string" && dataURL.startsWith("data:image/")
            ? dataURL : null;
        } catch {
          // Some imported sprites are corrupt; try 9000,0 before silhouette.
        }
      }
    } catch {
      // Missing/unsupported SFF bank: keep the neutral HUD silhouette.
    }
    return null;
  });
  for (const bank of bankCache.values()) bank.clearDecodedCache?.();
  return portraits;
}
