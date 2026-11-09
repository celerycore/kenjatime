/** Test harness only. Renders the production Core session and GPU renderer. */
import { unzipSync } from "fflate";
import { CoreSession } from "../../src/core/session.js";
import { CoreThreeRenderer } from "../../src/core/three-renderer.js";
const encode = (text) => new TextEncoder().encode(text),
  decode = (bytes) => new TextDecoder().decode(bytes);
const resources = Promise.all(
  ["/fixtures/kfm.zip", "/fixtures/pattern.sff"].map(
    async (path) => new Uint8Array(await (await fetch(path)).arrayBuffer()),
  ),
).then(([zip, sprite]) => ({ base: unzipSync(zip), sprite }));
globalThis.renderStage = async function (testCase) {
  const { definition } = testCase;
  const { base, sprite } = await resources;
  const canvas = document.createElement("canvas");
  document.body.replaceChildren(canvas);
  const files = {
    ...base,
    "stage/probe.def": encode(definition),
    "stage/pattern.sff": sprite,
  };
  files["kfm/kfm.cns"] = encode(
    decode(files["kfm/kfm.cns"]) +
      "\n[StateDef -3]\n[State Hide]\ntype=AssertSpecial\ntrigger1=1\nflag=invisible\nflag2=nobardisplay\n" +
      (testCase.positionPlayers === undefined
        ? ""
        : `\n[State Position]\ntype=PosSet\ntrigger1=1\nx=${testCase.positionPlayers}+ifelse(teamside=1,-100,100)\n`),
  );
  const session = new CoreSession(files, {
    mode: "training",
    stage: "stage/probe.def",
  });
  const renderer = new CoreThreeRenderer(canvas, {
    preserveDrawingBuffer: true,
  });
  try {
    for (let i = 0; i < (testCase.ticks || 8); i++) session.tick();
    const frame = session.frame();
    renderer.render(frame, { width: 320, height: 180 });
    const result = {
      png: canvas.toDataURL(),
      camera: session.match.stage.camera,
      draws: frame.draws.map((q) => ({
        matrix: q.matrix,
        warp: q.warp,
        clip: q.clip,
      })),
      warmUploads: session.frame().assets.length,
      diagnostics: session.snapshot().diagnostics,
      stats: renderer.stats,
    };
    return result;
  } finally {
    session.close();
    renderer.close();
  }
};
