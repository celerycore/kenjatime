/** Package the SAME compiled Kotlin/WASM dist-kotlin into Android's WebView.
 * No independent JavaScript combat path, no source builds in this copy step.
 */
import {createRequire} from "node:module";
import {readFileSync,writeFileSync,existsSync} from "node:fs";
import {resolve} from "node:path";
const require=createRequire(import.meta.url);
const {loadConfig}=require("@capacitor/cli/dist/config.js");
const {copy}=require("@capacitor/cli/dist/tasks/copy.js");
const {updateAndroid}=require("@capacitor/cli/dist/android/update.js");
if(!existsSync("dist-kotlin/wasm/kenjatime-kotlin-core.wasm"))
  throw Error("Compile/package Kotlin/WASM browser build before Android copy.");
const target=JSON.parse(readFileSync("capacitor.kotlin.config.json"));
const config=await loadConfig();
config.app.extConfig=target;config.app.appId=target.appId;
config.app.appName=target.appName;config.app.webDir=target.webDir;
config.app.webDirAbs=resolve(target.webDir);
await copy(config,"android");
await updateAndroid(config);
const settings="android/capacitor.settings.gradle";
writeFileSync(settings,readFileSync(settings,"utf8").replace(
  /new File\('[^']*node_modules\//g,"new File('../node_modules/"
));
console.log("Copied Kotlin/WASM fight app to Android assets.");
