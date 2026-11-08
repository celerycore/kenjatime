import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, relative, isAbsolute } from "node:path";

const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
/** Check Rollup's actual dependency graph, including each separate worker build. */
export function independentBuildBoundary() {
  const root = resolve("."),
    policy = JSON.parse(readFileSync(resolve(root, "core/source-policy.json")));
  return {
    name: "independent-runtime-boundary",
    generateBundle() {
      const sources = {},
        packages = new Set();
      for (const id of this.getModuleIds()) {
        if (id.startsWith("\0")) continue;
        const file = id.split("?")[0].replaceAll("\\", "/");
        if (!isAbsolute(file) || !existsSync(file)) continue;
        if (file.includes("/node_modules/")) {
          const parts = file
            .slice(file.lastIndexOf("/node_modules/") + 14)
            .split("/");
          const name = parts[0].startsWith("@")
            ? parts.slice(0, 2).join("/")
            : parts[0];
          if (!policy.allowedPackages.includes(name))
            this.error("Unreviewed runtime dependency: " + name);
          packages.add(name);
          continue;
        }
        const name = relative(root, file).replaceAll("\\", "/");
        if (
          name.startsWith("../") ||
          isAbsolute(name) ||
          policy.forbiddenProjectPrefixes.some((prefix) =>
            name.startsWith(prefix),
          ) ||
          policy.forbiddenProjectModules.includes(name) ||
          /\.(go|lua|c|cpp|h|wasm)$/i.test(name)
        )
          this.error(
            "External engine source is outside the independent runtime boundary: " +
              name,
          );
        sources[name] = sha(readFileSync(file));
      }
      const graph =
        JSON.stringify(
          {
            sources: Object.fromEntries(Object.entries(sources).sort()),
            thirdPartyPackages: [...packages].sort(),
            scope: policy.scope,
          },
          null,
          2,
        ) + "\n";
      this.emitFile({
        type: "asset",
        fileName: "provenance/modules-" + sha(graph).slice(0, 12) + ".json",
        source: graph,
      });
    },
  };
}
