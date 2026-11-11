import test from "node:test";
import assert from "node:assert/strict";
import { selectPortraitSpriteIndices, decodeSelectPortraits } from "../../src/core/select-portrait.js";

test("select portrait prefers 9000,1 over 9000,0", () => {
  const sprites = [
    { group: 0, number: 0 },
    { group: 9000, number: 0 },
    { group: 9000, number: 1 },
    { group: 9000, number: 2 },
  ];
  assert.deepEqual(selectPortraitSpriteIndices(sprites), [2, 1]);
  assert.deepEqual(selectPortraitSpriteIndices([{ group: 0, number: 0 }]), []);
});

test("missing select portraits do not display character initials", () => {
  assert.deepEqual(decodeSelectPortraits({}, [
    { sprite: "missing.sff", palette: 1 },
    { sprite: null, palette: 1 },
  ]), [null, null]);
});

test("select portrait decoder falls back to 9000,0 when 9000,1 cannot decode", () => {
  const previous = globalThis.ImageData;
  globalThis.ImageData = class ImageData {
    constructor(data, width, height) {
      this.data = data;
      this.width = width;
      this.height = height;
    }
  };
  try {
    const attempts = [];
    let cleared = false;
    const mockCanvas = () => ({
      width: 0, height: 0,
      getContext: () => ({
        putImageData: () => {},
        drawImage: () => {},
        imageSmoothingEnabled: false,
        imageSmoothingQuality: "low",
      }),
      toDataURL: (format) => {
        assert.equal(format, "image/png");
        return "data:image/png;base64,QUJD";
      },
    });
    const bank = {
      sprites: [{ group: 9000, number: 0 }, { group: 9000, number: 1 }],
      decodeWithPalette() {
        assert.fail("Select portraits must not use the gameplay palette");
      },
      decode(index) {
        attempts.push(index);
        if (index === 1) throw Error("Corrupt large portrait");
        return { w: 2, h: 2, rgba: new Uint8ClampedArray(16) };
      },
      clearDecodedCache() { cleared = true; },
    };
    const results = decodeSelectPortraits(
      { "fighter.sff": new Uint8Array(16) },
      [{ sprite: "fighter.sff", palette: 2 }],
      { decoder: () => bank, canvasFactory: mockCanvas },
    );
    assert.deepEqual(results, ["data:image/png;base64,QUJD"]);
    assert.deepEqual(attempts, [1, 0]);
    assert.equal(cleared, true);
  } finally {
    if (previous === undefined) delete globalThis.ImageData;
    else globalThis.ImageData = previous;
  }
});

test("native 9000,1 RGBA colors survive even when gameplay palette is different", () => {
  const previous = globalThis.ImageData;
  const captured = [];
  globalThis.ImageData = class ImageData {
    constructor(data, width, height) {
      captured.push({rgba: [...data], width, height});
    }
  };
  try {
    const native = new Uint8ClampedArray([240, 42, 20, 255, 14, 70, 224, 255]);
    let paletteRequests = 0;
    const bank = {
      sprites: [{group: 9000, number: 1}],
      decode(index) {
        assert.equal(index, 0);
        return {w: 2, h: 1, rgba: native};
      },
      decodeWithPalette() {
        paletteRequests++;
        // A deliberate inverted-color result to catch palette overrides.
        return {w: 2, h: 1, rgba: new Uint8ClampedArray([15, 213, 235, 255, 241, 185, 31, 255])};
      },
      clearDecodedCache() {},
    };
    const canvas = () => ({
      width: 0, height: 0,
      getContext: () => ({
        putImageData() {},
        drawImage() {},
      }),
      toDataURL(format) {
        assert.equal(format, "image/png");
        return "data:image/png;base64,QUJD";
      },
    });
    const out = decodeSelectPortraits(
      {"same.sff": new Uint8Array(12)},
      [{sprite:"same.sff",palette:12}, {sprite:"same.sff",palette:2}],
      {decoder:()=>bank,canvasFactory:canvas},
    );
    assert.equal(paletteRequests, 0);
    assert.equal(captured.length, 2);
    assert.deepEqual(captured[0].rgba, [...native]);
    assert.deepEqual(captured[1].rgba, [...native]);
    assert.deepEqual(out, ["data:image/png;base64,QUJD", "data:image/png;base64,QUJD"]);
  } finally {
    if (previous === undefined) delete globalThis.ImageData;
    else globalThis.ImageData = previous;
  }
});

test("HUD portrait CSS does not tint or increase contrast of imported artwork", async () => {
  const {readFileSync} = await import("node:fs");
  const css = readFileSync(new URL("../../src/core/hud.css", import.meta.url), "utf8");
  const imageBlock = css.match(/\.kt-reference-hud \.kt-hud-portrait img\s*\{([^}]*)\}/);
  assert.ok(imageBlock);
  assert.match(imageBlock[1], /filter:\s*none;/);
});
