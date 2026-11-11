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
      toDataURL: () => "data:image/webp;base64,QUJD",
    });
    const bank = {
      sprites: [{ group: 9000, number: 0 }, { group: 9000, number: 1 }],
      decodeWithPalette(index) {
        attempts.push(index);
        if (index === 1) throw Error("Unavailable large portrait");
        return { w: 2, h: 2, rgba: new Uint8ClampedArray(16) };
      },
      decode(index) {
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
    assert.deepEqual(results, ["data:image/webp;base64,QUJD"]);
    assert.deepEqual(attempts, [1, 0]);
    assert.equal(cleared, true);
  } finally {
    if (previous === undefined) delete globalThis.ImageData;
    else globalThis.ImageData = previous;
  }
});
