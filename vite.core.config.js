import { defineConfig } from "vite";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { independentBuildBoundary } from "./scripts/core/build-isolation.mjs";

const version = "0.5.5-core-preview",
  revision = createHash("sha256");
for (const path of [
  ...readdirSync('src',{recursive:true}).filter(p=>/\.(js|css)$/.test(p)).sort().map(p=>'src/'+p),
  "core/source-policy.json",
  "capacitor.core.config.json",
  "package-lock.json",
])
  revision.update(readFileSync(path));
const lzma = () => ({
  name: "archive-lzma-module",
  enforce: "pre",
  transform(code, id) {
    if (!id.replaceAll("\\", "/").endsWith("/lzma/src/lzma-d.js")) return;
    return code
      .replace(
        'if (typeof onmessage != "undefined" && (typeof window == "undefined" || typeof window.document == "undefined")) {',
        "if (false) {",
      )
      .replace(
        "this.LZMA = this.LZMA_WORKER = LZMA;",
        "export default {LZMA_WORKER:LZMA};",
      );
  },
});
export default defineConfig({
  base: "./",
  publicDir: false,
  define: {
    __KENJATIME_APP_VERSION__: JSON.stringify(version),
    __KENJATIME_STARTUP_REVISION__: JSON.stringify(
      revision.digest("hex").slice(0, 16),
    ),
  },
  plugins: [
    lzma(),
    independentBuildBoundary(),
    {
      name: "core-entry",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "index.html",
          source: readFileSync("core/start.html", "utf8"),
        });
      },
    },
  ],
  worker: { format: "es", plugins: () => [lzma(), independentBuildBoundary()] },
  build: {
    outDir: "dist-core",
    manifest: true,
    rollupOptions: { input: { core: "core/index.html" } },
  },
});
