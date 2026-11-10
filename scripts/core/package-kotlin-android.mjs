/**
 * Stage a compiled Kotlin/Wasm ESM module into the optional Android WebView
 * AssetLoader shell. Never replaces the Capacitor production web app.
 */
import {readdirSync,mkdirSync,copyFileSync,writeFileSync} from "node:fs";
import {join,dirname,resolve} from "node:path";
const sourceRoot=resolve(process.argv[2]||"kotlin-core/build");
const destination=resolve(process.argv[3]||"android/app/src/main/assets/www");
function find(folder,depth=0){
  if(depth>12)return [];
  const out=[];
  for(const entry of readdirSync(folder,{withFileTypes:true})){
    const path=join(folder,entry.name);
    if(entry.isDirectory() && entry.name!=="node_modules")out.push(...find(path,depth+1));
    else if(entry.isFile() && entry.name==="kenjatime-kotlin-core.mjs")out.push(path);
  }
  return out;
}
const choices=find(sourceRoot);
const esm=choices.find(path=>path.includes("productionExecutable"))??choices[0];
if(!esm)throw Error("Build the Kotlin/Wasm executable before packaging Android assets");
mkdirSync(destination,{recursive:true});
const companions=readdirSync(dirname(esm)).filter(x=>x.startsWith("kenjatime-kotlin-core."));
for(const filename of companions)copyFileSync(join(dirname(esm),filename),join(destination,filename));
if(!companions.some(x=>x.endsWith(".wasm")))throw Error("Missing Kotlin/Wasm companion binary");
writeFileSync(join(destination,"index.html"),[
  "<!doctype html><html lang='en'><head>",
  "<meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>",
  "<title>Kenjatime Kotlin/Wasm Shell</title>",
  "</head><body style='font:16px sans-serif;background:#101623;color:#eaf0ff;padding:1.5rem'>",
  "<h1>Kenjatime — Kotlin/Wasm Preview</h1>",
  "<p>This independent diagnostic does not replace the production fighting game.</p>",
  "<pre id='result'>Loading combat module…</pre>",
  "<script type='module' src='./preview.mjs'></script></body></html>"
].join("\n"));
writeFileSync(join(destination,"preview.mjs"),[
  "const out=document.getElementById('result');",
  "try {",
  "  const imported=await import('./kenjatime-kotlin-core.mjs');",
  "  const initialized=typeof imported.default==='function'?await imported.default():imported.default;",
  "  const api=[imported,initialized,initialized?.exports].find(x=>x&&typeof x.ktCoreCreate==='function');",
  "  if(!api) throw Error('Compiled Kotlin/Wasm API missing');",
  "  const a='[Begin Action 0]\\nClsn2:1\\nClsn2[0]=-10,-70,10,0\\n0,0,0,0,-1';",
  "  const c='[Statedef 0]\\ntype=S\\nanim=0\\nctrl=1';",
  "  const h=api.ktCoreCreate('KFM shell','CPU shell',a,a,c,c);",
  "  try { api.ktCoreAdvance(h,0,'',0,''); out.textContent='Wasm ready: '+api.ktCoreVersion()+'\\n'+api.ktCoreChecksum(h); }",
  "  finally { api.ktCoreRelease(h); }",
  "} catch (err) { out.textContent='Wasm loading failed: '+err.message; }"
].join("\n"));
console.log("Staged "+companions.join(", ")+" into "+destination);
