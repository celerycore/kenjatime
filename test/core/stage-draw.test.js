import { test } from "node:test";
import assert from "node:assert/strict";
import { stageClip, stageDrawPlans } from "../../src/core/stage-draw.js";
import { parseStage } from "../../src/stages.js";
const encode = (text) => new TextEncoder().encode(text);
function element(text = "") {
  const files = {
    "stage.def": encode(
      "[Info]\nname=test\n[BGDef]\nspr=test.sff\n[BG Test]\n" + text,
    ),
    "test.sff": new Uint8Array([0]),
  };
  return parseStage("stage.def", files).elements[0];
}
const sprite = { w: 64, h: 48, x: 32, y: 0 };
const view = {
  x: 480,
  y: 330,
  sx: 3,
  sy: 3,
  cameraX: 0,
  cameraY: 0,
  deltaX: 1,
  zoom: 3,
  factor: 1,
};
test("stage clipping honors inclusive window endpoints, centered masks, local coordinates and moving windows", () => {
  const options = {
    factor: 1,
    scale: 3,
    cameraX: 20,
    cameraY: -10,
    displayHeight: 180,
  };
  assert.deepEqual(
    stageClip(element("window=30,115,290,150"), options),
    [90, 345, 783, 108],
  );
  assert.deepEqual(
    stageClip(element("maskwindow=-100,115,100,150"), options),
    [180, 345, 600, 105],
  );
  assert.deepEqual(
    stageClip(element("window=0,0,319,239"), {
      ...options,
      scale: 2.25,
      displayHeight: 240,
    }),
    [120, 0, 720, 540],
  );
  assert.deepEqual(
    stageClip(element("window=60,100,140,150\nwindowdelta=1,0.5"), {
      ...options,
      factor: 0.5,
      cropTop: 10,
    }),
    [30, 135, 121.5, 76.5],
  );
  assert.deepEqual(stageClip(element("window=100,20,10,40"), options), []);
  assert.equal(stageClip(element(""), options), null);
});
test("perspective tiles use one bounded draw each regardless of source height and preserve moving-camera shear", () => {
  const width = element("type=parallax\nwidth=64,128");
  const plan = stageDrawPlans(width, sprite, {}, view);
  assert.equal(plan.length, 1);
  assert.deepEqual(plan[0].warp, [0, 64, -32, 96]);
  assert.equal(plan[0].axisX, 32);
  const tall = stageDrawPlans(width, { ...sprite, h: 4096 }, {}, view);
  assert.equal(tall.length, 1);
  assert.deepEqual(tall[0].warp, plan[0].warp);
  const shear = stageDrawPlans(
    element("type=parallax\nxscale=0.5,1.5"),
    sprite,
    {},
    { ...view, cameraX: 40 },
  );
  assert.deepEqual(shear[0].warp, [20, 84, -20, 44]);
  const tiles = stageDrawPlans(
    element("type=parallax\nwidth=64,128\ntile=1,0"),
    sprite,
    {},
    view,
  );
  assert.ok(tiles.length > 1 && tiles.length < 20);
  for (const q of tiles) assert.ok(q.warp.every(Number.isFinite));
  const flipped = stageDrawPlans(width, sprite, { flip: "H" }, view);
  assert.deepEqual(flipped[0].warp, plan[0].warp);
  assert.deepEqual(
    stageDrawPlans(width, sprite, {}, { ...view, clip: [] }),
    [],
  );
  assert.deepEqual(
    stageDrawPlans(width, sprite, {}, { ...view, sx: Infinity }),
    [],
  );
  const lots = stageDrawPlans(
    element("tile=1,1"),
    { w: 1, h: 1, x: 0, y: 0 },
    {},
    view,
  );
  assert.equal(lots.length, 8192);
});
