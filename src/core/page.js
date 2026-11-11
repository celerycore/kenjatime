import "./browser-test.css";
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
mountSetup(host);
const guide = document.createElement("section");
guide.id = "core-qa-guide";
guide.setAttribute("aria-label", "Kenjatime Core compatibility test guide");
guide.innerHTML = `
  <div class="qa-header">
    <h2>GPU + Camera QA · Ako / Asuna / Forest</h2>
    <span class="qa-state">BROWSER QA PREVIEW</span>
  </div>
  <p>Compare full-height 16:9 widescreen with pillarboxed 4:3 native-style framing. Upload Ako, Asuna and Forest of King Cruel locally; their source jump and sprite scale values are preserved. No character files are hosted here.</p>
  <details open>
    <summary>How to run the compatibility match</summary>
    <ol>
      <li>Use <strong>Import character / archive</strong> to add Ako.zip and Asuna.zip.</li>
      <li>Import Forest of King Cruel.rar using <strong>Add stage</strong> and select it under <strong>Stage</strong>.</li>
      <li>Select Ako vs Asuna. Choose <strong>Screen format</strong> (16:9 or 4:3), then <strong>Fight now</strong>. Use the <strong>Screen</strong> button during the match to compare instantly.</li>
    </ol>
    <p class="qa-note">Character and stage files remain in your browser. Native-style 4:3 reproduces the framing and coordinate aspect, not frame-perfect IKEMEN behavior. Tests do not claim physical-phone frame rates.</p>
    <p class="qa-note">The graphics texture cache evicts inactive sprites automatically to avoid cumulative GPU-budget errors on long matches. This preview stays isolated from the live Kenjatime game.</p>
  </details>`;
document.querySelector(".heading")?.insertAdjacentElement("afterend", guide);
connectCorePlatform(host.diagnostics);
document.title = "Kenjatime Core";
document.querySelector(".notice").textContent =
  "Independent engine preview. Compatibility work is in progress.";
