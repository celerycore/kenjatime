/** QA only: the production battle path, original fixture content. */
import { unzipSync } from "fflate";
import { openCoreBattle } from "../../src/core/battle.js";
import { modelFixture } from "../../test/fixtures/core/advanced-stage.js";
import { CoreThreeRenderer } from "../../src/core/three-renderer.js";
import { parseStage } from "../../src/stages.js";
import { CoreSession } from "../../src/core/session.js";
const encode = (s) => new TextEncoder().encode(s);
globalThis.mediaStart = async function (kind) {
  const files = unzipSync(
    new Uint8Array(await (await fetch("/fixtures/kfm.zip")).arrayBuffer()),
  );
  const base =
    "[Info]\nname=Media QA\n[StageInfo]\nlocalcoord=320,180\nzoffset=165\n[Camera]\nboundleft=0\nboundright=0\nboundhigh=0\n[BGDef]\n";
  files["stage/probe.def"] = encode(
    base +
      (kind === "model"
        ? "model=scene.gltf\n"
        : "\n[BG movie]\ntype=video\npath=clip.webm\nloop=1\nvolume=0\nscalemode=stretch\n"),
  );
  if (kind === "model")
    files["stage/scene.gltf"] = encode(JSON.stringify(modelFixture()));
  else
    files["stage/clip.webm"] = new Uint8Array(
      await (await fetch("/fixtures/clip.webm")).arrayBuffer(),
    );
  files["external/mods/qa.lua"] = encode(
    `hook.add('loop','probe',function() assert(player(1));mapSet('luaTicks',map('luaTicks')+1);setPower(123);end)`,
  );
  await openCoreBattle({
    files,
    selection: { mode: "training", stage: "stage/probe.def" },
    onProgress: (message) => {
      globalThis.mediaError = message;
    },
  });
};
globalThis.modelProbe = async function (animated = false) {
  const files = {
    "probe.def": encode(
      "[StageInfo]\nlocalcoord=320,180\n[BGDef]\nmodel=scene.gltf\n",
    ),
    "scene.gltf": encode(JSON.stringify(modelFixture(animated))),
  };
  const canvas = document.createElement("canvas"),
    renderer = new CoreThreeRenderer(canvas, { preserveDrawingBuffer: true });
  document.body.append(canvas);
  try {
    await renderer.loadStage(parseStage("probe.def", files), files);
    const frame = {
      assets: [],
      draws: [],
      sparks: [],
      grid: false,
      model: {
        time: 0,
        camera: { x: 0, y: 0, zoom: 1 },
        coordinateScale: 1,
        start: {},
      },
    };
    renderer.render(frame, { width: 320, height: 180 });
    const shadow = canvas.toDataURL();
    if (animated) {
      frame.model.time = 1;
      renderer.render(frame, { width: 320, height: 180 });
      const moved = canvas.toDataURL(),
        updates = renderer.model.shadowUpdates;
      renderer.render(frame, { width: 320, height: 180 });
      const warmUpdates = renderer.model.shadowUpdates - updates;
      frame.model.time = 0;
      renderer.render(frame, { width: 320, height: 180 });
      return { start: shadow, moved, rewound: canvas.toDataURL(), warmUpdates };
    }
    const lights = [];
    renderer.model.scene.traverse((o) => {
      if (o.isLight)
        lights.push({
          type: o.type,
          cast: o.castShadow,
          map: !!o.shadow?.map,
          layers: o.layers.mask,
        });
      if (o.isMesh) o.castShadow = false;
    });
    renderer.model.shadowDirty = true;
    renderer.render(frame, { width: 320, height: 180 });
    return { shadow, unshadowed: canvas.toDataURL(), lights };
  } finally {
    renderer.close();
    canvas.remove();
  }
};
globalThis.resolutionProbe = async function (testCase, fixture) {
  const files = Object.fromEntries(
    Object.entries(fixture.files).map(([p, b]) => [
      p,
      Uint8Array.from(atob(b), (c) => c.charCodeAt(0)),
    ]),
  );
  files["stages/probe.def"] = encode(testCase.definition);
  files["stages/kenjatime-grid.sff"] = new Uint8Array(
    await (await fetch("/fixtures/pattern.sff")).arrayBuffer(),
  );
  const canvas = document.createElement("canvas"),
    renderer = new CoreThreeRenderer(canvas, { preserveDrawingBuffer: true });
  const session = new CoreSession(files, {
    mode: "training",
    character: "chars/verification-actor/fighter.def",
    opponent: "chars/verification-victim/fighter.def",
    opponentPalette: 2,
    stage: "stages/probe.def",
  });
  try {
    for (let i = 0; i < 8; i++) session.tick();
    renderer.render(session.frame(), { width: 320, height: 180 });
    return {
      png: canvas.toDataURL(),
      view: session.match.view,
      diagnostics: session.snapshot().diagnostics,
    };
  } finally {
    session.close();
    renderer.close();
  }
};
