/** Prepare permanent, public downloads from a tested CI artifact pair.
 * Publication is separate; this step verifies source identity and APK bytes. */
import assert from "node:assert/strict";
import {readFileSync,readdirSync,mkdirSync,writeFileSync,copyFileSync} from "node:fs";
import {resolve,join} from "node:path";
import {createHash} from "node:crypto";
import {zipSync,unzipSync} from "fflate";

const [browserArg,apkArg,outArg]=process.argv.slice(2);
assert.ok(browserArg&&apkArg&&outArg,"Usage: package-downloads.mjs <browser directory> <APK> <output directory>");
const browser=resolve(browserArg),apk=resolve(apkArg),out=resolve(outArg);
const info=JSON.parse(readFileSync(join(browser,"build-info.json"),"utf8"));
const source=process.env.GITHUB_SHA||info.sourceCommit;
assert.match(source,/^[0-9a-f]{40}$/,"Public builds require an exact source commit");
assert.equal(info.sourceCommit,source,"Browser artifact must match the release source");
assert.equal(info.engine,"Kotlin/WASM");
assert.equal(info.nativeMugen11ParityCertified,false);
const binary=readFileSync(apk),entries=unzipSync(binary);
for(const path of ["kotlin/index.html","wasm/kenjatime-kotlin-core.wasm",
  "wasm/kenjatime-kotlin-core.mjs","build-info.json"]) {
  assert.ok(entries["assets/public/"+path],"APK asset missing: "+path);
  assert.deepEqual(Buffer.from(entries["assets/public/"+path]),readFileSync(join(browser,path)),
    "APK and browser artifact differ: "+path);
}
assert.deepEqual(Array.from(readFileSync(join(browser,"wasm/kenjatime-kotlin-core.wasm")).subarray(0,4)),[0,97,115,109]);
const files={};
function collect(directory,prefix="") {
  for(const entry of readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
    const name=prefix+entry.name,local=join(directory,entry.name);
    if(entry.isDirectory())collect(local,name+"/");
    else {
      assert.ok(entry.isFile(),"Unexpected browser artifact entry: "+name);
      files[name]=new Uint8Array(readFileSync(local));
    }
  }
}
collect(browser);
assert.ok(files["index.html"]&&files["kotlin/index.html"],"Browser entry points missing");
for(const [path,data] of Object.entries(files)) {
  // Android's asset packager excludes hidden build metadata such as .vite.
  if(path.split("/").some(part=>part.startsWith(".")))continue;
  assert.ok(entries["assets/public/"+path],"APK asset missing: "+path);
  assert.deepEqual(Buffer.from(entries["assets/public/"+path]),Buffer.from(data),
    "APK and browser artifact differ: "+path);
}
mkdirSync(out,{recursive:true});
copyFileSync(apk,join(out,"kenjatime-kotlin.apk"));
writeFileSync(join(out,"kenjatime-kotlin-browser.zip"),zipSync(files,{level:6}));
copyFileSync(join(browser,"build-info.json"),join(out,"build-info.json"));
const assets=["kenjatime-kotlin.apk","kenjatime-kotlin-browser.zip","build-info.json"];
writeFileSync(join(out,"SHA256SUMS"),assets.map(name=>
  createHash("sha256").update(readFileSync(join(out,name))).digest("hex")+"  "+name).join("\n")+"\n");
assets.push("SHA256SUMS");
const tag="kotlin-wasm-"+source.slice(0,12);
const repository=process.env.GITHUB_REPOSITORY||"celerycore/kenjatime";
assert.match(repository,/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);
const base=`https://github.com/${repository}/releases/download/${tag}`;
writeFileSync(join(out,"RELEASE_NOTES.md"),`Kotlin/WASM development build from [${source.slice(0,7)}](https://github.com/${repository}/commit/${source}).

- [Android APK](${base}/kenjatime-kotlin.apk)
- [Browser bundle](${base}/kenjatime-kotlin-browser.zip) (unzip and serve over HTTP)
- [SHA-256 checksums](${base}/SHA256SUMS)

These public assets do not require GitHub Actions access and do not expire with CI artifacts.
The APK and browser bundle contain identical tested Kotlin/WASM assets.
Native MUGEN/IKEMEN parity and physical-phone performance remain unverified.
`);
const release={tag,sourceCommit:source,assets};
writeFileSync(join(out,"release-info.json"),JSON.stringify(release,null,2)+"\n");
console.log(JSON.stringify(release));
