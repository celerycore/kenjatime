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
    <h2>Rare Akuma · 2007 + 2026 Core testing</h2>
    <span class="qa-state">BROWSER QA PREVIEW</span>
  </div>
  <p>Test both original classic and newer ZSS editions in the independent Core engine. No copyrighted character package is hosted here.</p>
  <details open>
    <summary>How to run the compatibility match</summary>
    <ol>
      <li>Use <strong>Import character / archive</strong> to add the original Rare Akuma 2007 ZIP and the 2026 ZSS ZIP separately.</li>
      <li>Import your verified <strong>original common-effects ZIP</strong> from this chat. Select it under <strong>Common effects</strong>.</li>
      <li>Select one Rare Akuma version in the roster and the other under <strong>Opponent</strong>. Choose <strong>Watch CPU match</strong> or <strong>Training</strong>, then <strong>Fight now</strong>.</li>
    </ol>
    <p class="qa-note">Character and stage files stay in this browser. Known source limitations: old-version missing sprites and seven truncated 2026 PCX records; incomplete sprites remain explicitly diagnosed. This preview is not a frame-by-frame native engine parity certificate.</p>
    <p class="qa-note">The authentic shared-effects resource pack and its source attribution are documented in <a href="https://github.com/celerycore/kenjatime/pull/6" target="_blank" rel="noopener noreferrer">the compatibility implementation and test evidence</a>.</p>
  </details>`;
document.querySelector(".heading")?.insertAdjacentElement("afterend", guide);
connectCorePlatform(host.diagnostics);
document.title = "Kenjatime Core";
document.querySelector(".notice").textContent =
  "Independent engine preview. Compatibility work is in progress.";
