/** Use the pinned platform tooling with the independent distribution config.
 * The stable config remains unchanged; the APK uses its own application ID.
 */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
const require = createRequire(import.meta.url);
const { loadConfig } = require("@capacitor/cli/dist/config.js");
const { copy } = require("@capacitor/cli/dist/tasks/copy.js");
const { updateAndroid } = require("@capacitor/cli/dist/android/update.js");
const preview = JSON.parse(readFileSync("capacitor.core.config.json"));
const config = await loadConfig();
config.app.extConfig = preview;
config.app.appId = preview.appId;
config.app.appName = preview.appName;
config.app.webDir = preview.webDir;
config.app.webDirAbs = resolve(preview.webDir);
await copy(config, "android");
await updateAndroid(config);
// Node resolves symlinked workspace dependencies to their real paths. Generated
// Gradle settings must still be portable to a normal npm ci checkout.
const settings = "android/capacitor.settings.gradle";
writeFileSync(
  settings,
  readFileSync(settings, "utf8").replace(
    /new File\('[^']*node_modules\//g,
    "new File('../node_modules/",
  ),
);
