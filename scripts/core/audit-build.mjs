/** Fail closed if the independent distribution pulls in an external engine. */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, relative } from "node:path";
const root = resolve("dist-core"),
  files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
}
walk(root);
const forbidden =
  /ikemen|wasm_exec|kenjatimeEngineSnapshot|kenjatimeAudioPull|GOGC|go\.importObject/i;
for (const path of files) {
  if (
    /\.(js|html|json|css|txt)$/.test(path) &&
    forbidden.test(readFileSync(path, "utf8"))
  )
    throw Error("External engine reference in " + relative(root, path));
  if (/(?:^|\/)(?:core\.zip|ikemen[^/]*|wasm_exec\.js)$/.test(path))
    throw Error("External engine payload in " + path);
}
const manifest = JSON.parse(readFileSync(resolve(root, ".vite/manifest.json"))),
  sources = Object.values(manifest)
    .map((v) => v.src)
    .filter(Boolean);
for (const p of sources)
  if (
    /engine\/(?:browser|webgl|three)|src\/(?:engine-runtime|go-battle|engine-fs)\./.test(
      p,
    )
  )
    throw Error("External engine adapter in independent build: " + p);
const notices = [
  "Kenjatime Core: independent runtime preview. Universal compatibility is not yet certified.",
  "The included sample character belongs to its credited authors; character scripts are input data, not the engine implementation.",
];
for (const [pkg, file] of [
  ["wasmoon", "LICENSE"],
  ["three", "LICENSE"],
  ["fflate", "LICENSE"],
  ["fzstd", "LICENSE"],
  ["node-unrar-js", "LICENSE.md"],
  ["7z-wasm", "License.txt"],
  ["@zip.js/zip.js", "LICENSE"],
  ["lzma", "LICENSE"],
  ["chiptune3", "LICENSE"],
  ["@capacitor/core", "LICENSE"],
  ["@capacitor/app", "LICENSE"],
  ["@capacitor/filesystem", "LICENSE"],
  ["@capacitor/share", "LICENSE"],
  ["@capacitor/synapse", "LICENSE.md"],
]) {
  let text;
  try {
    text = readFileSync("node_modules/" + pkg + "/" + file, "utf8");
  } catch {
    throw Error("Missing third-party license: " + pkg + "/" + file);
  }
  notices.push("\n" + pkg + "\n" + text);
}
notices.push(
  readFileSync("core/lua-LICENSE.txt", "utf8"),
  readFileSync("public/third-party-archives.txt", "utf8"),
  readFileSync("public/licenses/unrar-license.txt", "utf8"),
);
notices.push(
  "\nMatching 7-Zip sources: https://github.com/celerycore/kenjatime/raw/refs/heads/android-builds/downloads/kenjatime-archive-codec-source.zip",
);
// Reuse the exact permissive decoder notice already recorded from its C API.
notices.push(
  readFileSync("core/decoder-notices.txt", "utf8"),
  "\nlibarchive-wasm 1.2.0 (https://github.com/ofk/libarchive-wasm)\n" +
    readFileSync("core/libarchive-wasm-LICENSE.txt", "utf8"),
);
writeFileSync(root + "/NOTICES.txt", notices.join("\n\n"));
files.push(resolve(root, "NOTICES.txt"));
const graphs = files.filter((p) => p.includes("/provenance/modules-"));
if (graphs.length < 3) throw Error("Missing worker dependency-graph evidence.");
const record = {
  engine: "Kenjatime Core",
  independentRuntime: true,
  externalEnginePayloads: false,
  universalCompatibility: false,
  thirdPartyLibraries: true,
  files: Object.fromEntries(
    files
      .filter((p) => !p.includes("/.vite/"))
      .map((p) => [
        relative(root, p).replaceAll("\\", "/"),
        {
          bytes: statSync(p).size,
          sha256: createHash("sha256").update(readFileSync(p)).digest("hex"),
        },
      ]),
  ),
  scope:
    "Build-isolation audit; does not establish behavioral parity or originality of imported character data.",
};
writeFileSync(
  root + "/provenance.json",
  JSON.stringify(record, null, 2) + "\n",
);
console.log(
  "PASS independent build isolation:",
  Object.keys(record.files).length,
  "files",
);
