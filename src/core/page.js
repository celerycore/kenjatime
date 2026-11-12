import "./browser-test.css";
import "./r8-benchmark.js";
import { connectCorePlatform } from "./platform.js";
import { mountSetup } from "../native-setup.js";
import { createLibraryHost } from "../library-host.js";
import { unpackArchiveBytes } from "../archive-reader.js";
import { openCoreBattle } from "./battle.js";
const sampleURL = new URL("../../public/kfm.zip", import.meta.url),
  creditsURL = new URL("../NOTICES.txt", document.baseURI);
const host = createLibraryHost({
  loadBuiltin: async () => {
    const response = await fetch(sampleURL);
    if (!response.ok) throw Error("The included fighter could not load.");
    return unpackArchiveBytes(new Uint8Array(await response.arrayBuffer()));
  },
  battle: openCoreBattle,
  creditsUrl: creditsURL,
  extraStages: [
    {
      id: "builtin/grid",
      name: "Training grid",
      fileName: "Built in",
      packageName: "Included sample",
    },
  ],
});
document.body.dataset.r8Benchmark = 'true';
mountSetup(host);
const guide = document.createElement("section");
guide.id = "core-qa-guide";
guide.setAttribute("aria-label", "Kenjatime Core compatibility test guide");
guide.innerHTML = `
  <div class="qa-header">
    <h2>PR #17 · Indexed R8 GPU Benchmark</h2>
    <span class="qa-state">R8 MEMORY / PALETTE QA</span>
  </div>
  <p>Run the PR #17 indexed R8 renderer with live GPU residency statistics and downloadable CSV recordings. The default Kung Fu Man fixture is included. Import large characters and stages locally to test texture recovery, palette swaps, and long-run stability. Character archives are never uploaded to our server.</p>
  <details open>
    <summary>How to benchmark</summary>
    <ol>
      <li>Use <strong>Import character / archive</strong> to add Ako.zip and Asuna.zip.</li>
      <li>Import Forest of King Cruel.rar using <strong>Add stage</strong> and select it under <strong>Stage</strong>.</li>
      <li>Select Ako vs Asuna. Choose <strong>Screen format</strong> (16:9 or 4:3), then <strong>Fight now</strong>. Use the <strong>Screen</strong> button during the match to compare instantly.</li>
    </ol>
    <p class="qa-note"><strong>MUGEN 1.1 helper testing:</strong> Import your Tomoka archive, select the character's exact DEF, and try a visible assist during a match. Open <strong>R8 GPU BENCHMARK</strong> to inspect Helpers spawned / active, sprite submissions, rejected or missing-state helpers. Export CSV to capture each helper's ID, active StateDef, animation and invisible flag. A submitted sprite is not proof of GPU display.</p>
    <p class="qa-note">Character and stage files remain in your browser. Native-style 4:3 reproduces the framing and coordinate aspect, not frame-perfect behavior from external fighting-game engines. Tests do not claim physical-phone frame rates.</p>
    <p class="qa-note">The graphics texture cache evicts inactive sprites automatically. Raw GPU texture bytes are estimates; measurements do not represent total VRAM. This preview contains PR #17, not the production arcade.</p>
  </details>`;
document.querySelector(".heading")?.insertAdjacentElement("afterend", guide);
connectCorePlatform(host.diagnostics);
document.title = "Kenjatime Core · PR #17 R8 Benchmark";
document.querySelector(".notice").textContent =
  "Isolated Indexed R8 Benchmark · PR #17. Not the production engine.";
