/** Pure stage draw planning. Perspective is evaluated in the GPU, one quad per
 * visible tile; no per-source-row buffers or texture rewrites are required. */
import {
  parallaxScale,
  tileOffsets,
  backgroundTileStep,
} from "../rendering.js";

export function stageClip(
  element,
  { factor, scale, cameraX, cameraY, cropTop = 0, displayHeight = 240 },
) {
  if (!element.window) return null;
  const [left, top, right, bottom] = element.window;
  const endpoint = element.windowCentered ? 0 : 1;
  if (right - left + endpoint <= 0 || bottom - top + endpoint <= 0) return [];
  const originX = element.windowCentered ? 480 : (960 - 320 * scale) / 2;
  const originY = (540 - displayHeight * scale) / 2;
  const x =
    originX + (left * factor - cameraX * element.windowDelta[0]) * scale;
  const y =
    originY +
    (top * factor - cameraY * element.windowDelta[1] - cropTop) * scale;
  if (
    ![
      x,
      y,
      (right - left + endpoint) * factor * scale,
      (bottom - top + endpoint) * factor * scale,
    ].every(Number.isFinite)
  )
    return [];
  const x1 = Math.max(0, x),
    y1 = Math.max(0, y);
  const x2 = Math.min(960, x + (right - left + endpoint) * factor * scale);
  const y2 = Math.min(540, y + (bottom - top + endpoint) * factor * scale);
  return x2 > x1 && y2 > y1 ? [x1, y1, x2 - x1, y2 - y1] : [];
}

export function stageDrawPlans(
  element,
  sprite,
  frame,
  { x, y, sx, sy, cameraX, cameraY, deltaX, zoom, factor, clip = null },
) {
  if (clip && !clip.length) return [];
  const flipX = (frame.flip || "").includes("H") ? -1 : 1;
  const flipY = (frame.flip || "").includes("V") ? -1 : 1;
  const actualX = sx * (frame.scaleX ?? 1) * flipX;
  let actualY = sy * (frame.scaleY ?? 1) * flipY;
  if (![x, y, actualX, actualY].every(Number.isFinite) || !actualX || !actualY)
    return [];
  let top = { x: 1, delta: 1, y: 1 },
    bottom = top;
  if (element.type === "parallax") {
    top = parallaxScale(element, sprite.w, 0, sprite.h, cameraY / factor);
    bottom = parallaxScale(
      element,
      sprite.w,
      sprite.h - 1,
      sprite.h,
      cameraY / factor,
    );
    sy *= top.y;
    actualY *= top.y;
    if (
      !actualY ||
      ![top.x, bottom.x, top.delta, bottom.delta, actualY].every(
        Number.isFinite,
      )
    )
      return [];
  }
  const axis =
    element.type === "parallax" && element.width ? sprite.w / 2 : sprite.x;
  const edge = (p, tile) => {
    const shift = (-cameraX * deltaX * zoom * (p.delta - 1)) / actualX;
    const step =
      backgroundTileStep(element, sprite.w) * p.x * Math.sign(actualX);
    return [
      axis - axis * p.x + shift + tile * step,
      axis + (sprite.w - axis) * p.x + shift + tile * step,
    ];
  };
  if (![...edge(top, 0), ...edge(bottom, 0)].every(Number.isFinite)) return [];
  const clipLeft = clip?.[0] ?? 0,
    clipRight = clip ? clip[0] + clip[2] : 960;
  const clipTop = clip?.[1] ?? 0,
    clipBottom = clip ? clip[1] + clip[3] : 540;
  const xs = new Set();
  for (const p of [top, bottom]) {
    const [l, r] = edge(p, 0);
    const origin =
      x +
      (frame.x || 0) * sx +
      (Math.min(l * actualX, r * actualX) - axis * actualX);
    for (const tile of tileOffsets(
      origin,
      Math.abs((r - l) * actualX),
      Math.abs(backgroundTileStep(element, sprite.w) * p.x * actualX),
      element.tile[0],
      clipLeft,
      clipRight,
    ))
      xs.add(tile);
  }
  const dy = backgroundTileStep(element, sprite.h, 1) * Math.abs(actualY);
  const y0 = y + (frame.y || 0) * sy;
  const ys = tileOffsets(
    Math.min(y0 - sprite.y * actualY, y0 + (sprite.h - sprite.y) * actualY),
    sprite.h * Math.abs(actualY),
    dy,
    element.tile[1],
    clipTop,
    clipBottom,
  );
  const plans = [];
  for (const iy of ys)
    for (const ix of xs) {
      if (plans.length >= 8192) return plans;
      const warp =
        element.type === "parallax"
          ? [...edge(top, ix), ...edge(bottom, ix)]
          : null;
      const tileX = warp
        ? 0
        : ix * backgroundTileStep(element, sprite.w) * Math.abs(actualX);
      plans.push({
        x: x + tileX,
        y: y + iy * dy,
        sx,
        sy,
        axisX: axis,
        warp,
        clip,
      });
    }
  return plans;
}
