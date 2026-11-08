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
connectCorePlatform(host.diagnostics);
document.title = "Kenjatime Core";
document.querySelector(".notice").textContent =
  "Independent engine preview. Compatibility work is in progress.";
