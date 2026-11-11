import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { setKenjatimeHudPortrait } from "../../src/core/hud-skin.js";

/* SVGElement.hidden may not reflect to an HTML hidden attribute, so our
 * fake SVG deliberately supports only the cross-browser attribute API. */
function mockPortraitFrame() {
  const attributes = new Map();
  const classes = new Set();
  const silhouette = {
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
    hasAttribute: (name) => attributes.has(name),
  };
  const image = {
    hidden: true,
    src: "",
    onerror: null,
    removeAttribute(name) {
      if (name === "src") this.src = "";
    },
  };
  const frame = {
    classList: {
      add: name => classes.add(name),
      remove: name => classes.delete(name),
      contains: name => classes.has(name),
    },
    querySelector: selector => selector === "img" ? image : selector === "svg" ? silhouette : null,
  };
  return { frame, image, silhouette, classes };
}

test("MUGEN/IKEMEN select portraits hide generic green silhouettes, including SVG implementations without a .hidden reflection", () => {
  const {frame,image,silhouette} = mockPortraitFrame();
  const source = "data:image/webp;base64,UklGRg==";
  setKenjatimeHudPortrait(frame, source);
  assert.equal(image.src, source);
  assert.equal(image.hidden, false);
  assert.equal(silhouette.hasAttribute("hidden"), true);
  assert.equal(frame.classList.contains("kt-hud-has-image"), true);
});

test("missing or invalid portrait shows silhouette, while valid portrait recovers on the next update", () => {
  const {frame,image,silhouette} = mockPortraitFrame();
  setKenjatimeHudPortrait(frame, "data:image/png;base64,AA==");
  setKenjatimeHudPortrait(frame, null);
  assert.equal(image.hidden, true);
  assert.equal(image.src, "");
  assert.equal(silhouette.hasAttribute("hidden"), false);
  assert.equal(frame.classList.contains("kt-hud-has-image"), false);
  setKenjatimeHudPortrait(frame, "data:image/png;base64,BB==");
  assert.equal(image.hidden, false);
  assert.equal(silhouette.hasAttribute("hidden"), true);
});

test("broken portrait triggers silhouette fallback without leaving stale artwork", () => {
  const {frame,image,silhouette} = mockPortraitFrame();
  setKenjatimeHudPortrait(frame, "data:image/png;base64,AA==");
  image.onerror();
  assert.equal(image.hidden, true);
  assert.equal(image.src, "");
  assert.equal(silhouette.hasAttribute("hidden"), false);
  assert.equal(frame.classList.contains("kt-hud-has-image"), false);
});

test("late error from an older portrait never obscures a newer portrait", () => {
  const {frame,image,silhouette} = mockPortraitFrame();
  setKenjatimeHudPortrait(frame, "data:image/png;base64,AA==");
  const staleError = image.onerror;
  setKenjatimeHudPortrait(frame, "data:image/png;base64,BB==");
  staleError();
  assert.equal(image.src, "data:image/png;base64,BB==");
  assert.equal(image.hidden, false);
  assert.equal(silhouette.hasAttribute("hidden"), true);
});

test("HUD CSS makes image-visible state override any remaining SVG fallback rules", () => {
  const css = readFileSync(new URL("../../src/core/hud.css", import.meta.url), "utf8");
  assert.match(css, /\.kt-hud-portrait\.kt-hud-has-image svg\s*\{\s*display:\s*none !important;/);
  assert.match(css, /\.kt-hud-portrait svg\[hidden\]\s*\{\s*display:\s*none !important;/);
});
