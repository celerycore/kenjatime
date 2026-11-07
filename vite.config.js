import {defineConfig} from 'vite';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

// Public engine payloads need the same cache revision as their frame/runtime.
const engineRevision=createHash('sha256');
for(const path of ['public/engine/core.zip','public/engine/ikemen.wasm.bin','public/engine/wasm_exec.js','engine/index.html','engine/webgl/submit.js','engine/three/submit.js','engine/webgl/render-target.js','src/engine-frame.js','src/engine-runtime.js','src/engine-worker.js','src/engine-audio.js','src/pcm-worklet.js','src/engine-fs.js','package-lock.json'])engineRevision.update(readFileSync(new URL(path,import.meta.url)));
const appVersion=readFileSync(new URL('android/app/build.gradle',import.meta.url),'utf8').match(/versionName\s+"([^"]+)"/)[1];
const startupRevision=createHash('sha256');for(const path of ['src/startup-diagnostics.js','src/browser-engine-host.js','src/native-setup.js','src/library-recovery.js','src/main.js','src/mobile.js','android/app/build.gradle','android/app/src/main/java/io/github/celerycore/kenjatime/MainActivity.java','android/app/src/main/java/io/github/celerycore/kenjatime/ArenaDevicePlugin.java','capacitor.config.json'])startupRevision.update(readFileSync(new URL(path,import.meta.url)));

// The pinned LZMA decoder ships as a classic-worker/CJS script. Expose its
// decoder as an ES module without replacing our archive worker's message handler.
const lzmaModule=()=>({name:'lzma-module',enforce:'pre',transform(code,id){
  if(!id.replaceAll('\\','/').endsWith('/lzma/src/lzma-d.js'))return;
  const exportLine='this.LZMA = this.LZMA_WORKER = LZMA;';if(!code.includes(exportLine))throw Error('Unexpected pinned LZMA module.');
  return code.replace('if (typeof onmessage != "undefined" && (typeof window == "undefined" || typeof window.document == "undefined")) {','if (false) {').replace(exportLine,'export default {LZMA_WORKER:LZMA};');
}});

// Keep assets and the sample archive usable on GitHub Pages project URLs.
export default defineConfig({base:'./',define:{__KENJATIME_ENGINE_REVISION__:JSON.stringify(engineRevision.digest('hex').slice(0,16)),__KENJATIME_APP_VERSION__:JSON.stringify(appVersion),__KENJATIME_STARTUP_REVISION__:JSON.stringify(startupRevision.digest('hex').slice(0,16))},plugins:[lzmaModule()],build:{manifest:true,rollupOptions:{input:{lab:'index.html',arena:'arena/index.html',classic:'arena-classic/index.html',mobile:'mobile/index.html',native:'native-ui/index.html',engine:'engine/index.html'}}},worker:{format:'es',plugins:()=>[lzmaModule()]}});
