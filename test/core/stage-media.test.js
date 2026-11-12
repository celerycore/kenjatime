import { test } from "node:test";
import assert from "node:assert/strict";
import { parseStage, StageRuntime } from "../../src/stages.js";
import { videoScale } from "../../src/core/video-source.js";
import { modelDocument } from "../../src/core/model-stage.js";
import { modelFixture } from "../fixtures/core/advanced-stage.js";
const encode = (s) => new TextEncoder().encode(s);
test("video and model stages resolve archive resources, validate transforms and preserve reset epochs", () => {
  const text =
    "[StageInfo]\nlocalcoord=1280,720\n[BGDef]\nmodel=scene.gltf\nmodelscale=2,2,2\n[Model]\noffset=1,2,3\n[BG movie]\ntype=video\npath=\"clip.webm\"\nscalemode=zoomfill\nloop=1\nvolume=40\n";
  const files = {
    "stages/probe.def": encode(text),
    "stages/scene.gltf": encode("{}"),
    "video/clip.webm": new Uint8Array(1),
  };
  const def = parseStage("stages/probe.def", files);
  assert.equal(def.coordinateScale, 0.25);
  assert.equal(def.model.path, "stages/scene.gltf");
  assert.deepEqual(def.model.offset, [1, 2, 3]);
  assert.deepEqual(def.model.scale, [2, 2, 2]);
  assert.equal(def.elements[0].video.path, "video/clip.webm");
  assert.deepEqual(def.diagnostics, []);
  const stage = new StageRuntime(def),
    first = stage.generation;
  stage.reset({ backgrounds: false });
  assert.equal(stage.generation, first);
  stage.reset();
  assert.equal(stage.generation, first + 1);
  assert.throws(
    () =>
      parseStage("stages/probe.def", files, text.replace("2,2,2", "NaN,1,1")),
    /model transform/,
  );
  assert.throws(
    () =>
      parseStage("stages/probe.def", files, text.replace("zoomfill", "bogus")),
    /scalemode/,
  );
});
test("all documented video fit modes preserve aspect or stretch explicitly", () => {
  assert.deepEqual(videoScale("none", 640, 480, 320, 180), [1, 1]);
  assert.deepEqual(videoScale("fit", 640, 480, 320, 180), [0.375, 0.375]);
  assert.deepEqual(videoScale("fitwidth", 640, 480, 320, 180), [0.5, 0.5]);
  assert.deepEqual(videoScale("fitheight", 640, 480, 320, 180), [0.375, 0.375]);
  assert.deepEqual(videoScale("zoomfill", 640, 480, 320, 180), [0.5, 0.5]);
  assert.deepEqual(videoScale("stretch", 640, 480, 320, 180), [0.5, 0.375]);
  assert.deepEqual(videoScale("fit", 0, 480, 320, 180), [0, 0]);
});
test("glTF preflight bounds geometry and rejects cycles, external URLs and invalid transforms", () => {
  const read = (doc) => modelDocument(encode(JSON.stringify(doc)));
  const valid = modelFixture();
  assert.equal(read(valid).meshes.length, 2);
  assert.throws(() => read({ ...valid, nodes: [{ children: [0] }] }), /Cyclic/);
  assert.throws(
    () =>
      read({ ...valid, materials: Array.from({ length: 1025 }, () => ({})) }),
    /materials limit/,
  );
  assert.throws(
    () => read({ ...valid, nodes: [{ translation: [Infinity, 0, 0] }] }),
    /transform/,
  );
  assert.throws(
    () =>
      read({
        ...valid,
        buffers: [{ byteLength: 2, uri: "https://example.com/remote.bin" }],
      }),
    /archive/,
  );
  assert.throws(
    () =>
      read({
        ...valid,
        accessors: [{ type: "VEC3", componentType: 5126, count: 1e9 }],
      }),
    /accessor/,
  );
  assert.throws(
    () =>
      read({ ...valid, extensionsRequired: ["KHR_draco_mesh_compression"] }),
    /decoder/,
  );
  assert.throws(
    () =>
      modelDocument(
        new Uint8Array([0x67, 0x6c, 0x54, 0x46, ...new Uint8Array(8)]),
      ),
    /header/,
  );
});
test("advanced camera controls delay zoom, damp motion, honor disabled movers and keep bottom anchors stable", () => {
  const text =
    "[Camera]\nboundleft=-500\nboundright=500\nboundhigh=-200\nautocenter=1\ntension=0\ntensionvel=.5\nzoomout=.5\nzoomin=1\nstartzoom=.5\nzoomindelay=2\nzoominspeed=.5\nzoomoutspeed=.25\nyscrollspeed=.5\nzoomanchor=bottom\n[StageInfo]\nlocalcoord=320,240\nzoffset=200\n[BGDef]\n";
  const stage = new StageRuntime(
    parseStage("s.def", { "s.def": encode(text) }),
  );
  stage.viewportAspect = 16 / 9;
  const players = [
    { pos: { x: 50, y: -100 } },
    { pos: { x: 150, y: 0 } },
    { pos: { x: 5000, y: -5000 }, moveCamera: { x: false, y: false } },
  ];
  stage.updateCamera(players);
  assert.equal(stage.camera.zoom, 0.5);
  assert.equal(stage.camera.x, 50);
  assert.equal(stage.camera.y, -10);
  stage.updateCamera(players);
  assert.equal(stage.camera.zoom, 0.5);
  stage.updateCamera(players);
  assert.equal(stage.camera.zoom, 0.75);
  assert.equal(stage.camera.x, 87.5);
  // Full-height legacy 4:3 coordinates preserve 40 units to the camera's
  // bottom anchor; the old 320x180 crop incorrectly expected 12.
  assert.equal(stage.view().bottom - stage.camera.y, 40);
  const before = { ...stage.camera };
  stage.updateCamera(players, { advance: false });
  assert.deepEqual(stage.camera, before);
  stage.reset();
  assert.equal(stage.zoomWait, 0);
  assert.equal(stage.camera.zoom, 0.5);
});
