import {existsSync,mkdirSync,readdirSync,copyFileSync,readFileSync,writeFileSync,statSync} from "node:fs";
import {join,dirname} from "node:path";
import assert from "node:assert/strict";

const build="kotlin-core/build",out="dist-kotlin/wasm";
function locate(root,depth=0){
  if(depth>14||!existsSync(root))return [];
  const candidates=[];
  for(const item of readdirSync(root,{withFileTypes:true})){
    const full=join(root,item.name);
    if(item.isDirectory()&&!["node_modules",".gradle"].includes(item.name))
      candidates.push(...locate(full,depth+1));
    else if(item.isFile()&&item.name==="kenjatime-kotlin-core.mjs")
      candidates.push(full);
  }
  return candidates;
}
const found=locate(build).sort((a,b)=>{
  const priority=s=>s.includes("productionExecutable")?3:s.includes("production")?2:s.includes("development")?1:0;
  return priority(b)-priority(a);
});
assert.ok(found.length,"No compiled Kotlin/WASM .mjs. Run ./android/gradlew -p kotlin-core wasmJsBrowserProductionWebpack first.");
const directory=dirname(found[0]);
const parts=readdirSync(directory).filter(name=>name.startsWith("kenjatime-kotlin-core")&&
  /\.(mjs|wasm|js|map)$/.test(name));
assert.ok(parts.some(n=>n.endsWith(".wasm")),"Kotlin/WASM companion is missing");
assert.ok(parts.includes("kenjatime-kotlin-core.mjs"),"Kotlin/WASM ESM companion missing");
mkdirSync(out,{recursive:true});
for(const name of parts)copyFileSync(join(directory,name),join(out,name));
const binary=readFileSync(join(out,"kenjatime-kotlin-core.wasm"));
assert.deepEqual(Array.from(binary.subarray(0,4)),[0,97,115,109],"Invalid Kotlin/WASM magic");
// Capacitor requires a root index.html even when appStartPath points at
// /kotlin/index.html. Preserve the same Kotlin-only build for web and APK.
assert.ok(existsSync("dist-kotlin/kotlin/index.html"),"Kotlin app HTML missing");
writeFileSync("dist-kotlin/index.html",
  '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./kotlin/index.html"><title>Kenjatime Kotlin</title></head><body><a href="./kotlin/index.html">Open Kotlin/WASM engine</a></body></html>');
const files=readdirSync(out).map(name=>({name,bytes:statSync(join(out,name)).size}));
const metadata={
  engine:"Kotlin/WASM",channel:"kotlin-standard",
  sourceCommit:process.env.GITHUB_SHA||"local-build",
  browserAndAndroidUseSameWasm:true,
  nativeMugen11ParityCertified:false,
  physicalAndroidPerformanceVerified:false,
  files
};
writeFileSync("dist-kotlin/build-info.json",JSON.stringify(metadata,null,2)+"\n");
console.log("Kotlin engine bundled into browser/Android: "+JSON.stringify(metadata));
