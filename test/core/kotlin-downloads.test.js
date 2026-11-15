import {test} from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,existsSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {spawnSync} from "node:child_process";
import {createHash} from "node:crypto";
import {zipSync,unzipSync} from "fflate";

const source="a".repeat(40),other="b".repeat(40);
function fixture() {
  const root=mkdtempSync(join(tmpdir(),"kenjatime-downloads-"));
  const browser=join(root,"browser"),out=join(root,"release"),apk=join(root,"app.apk");
  const files={
    "index.html":Buffer.from("<a href='./kotlin/index.html'>Kotlin</a>"),
    "kotlin/index.html":Buffer.from("<title>Kotlin fixture</title>"),
    "wasm/kenjatime-kotlin-core.wasm":Buffer.from([0,97,115,109]),
    "wasm/kenjatime-kotlin-core.mjs":Buffer.from("export const fixture=true;"),
    "build-info.json":Buffer.from(JSON.stringify({engine:"Kotlin/WASM",sourceCommit:source,
      nativeMugen11ParityCertified:false}))
  };
  for(const [path,data] of Object.entries(files)) {
    const location=join(browser,path);
    mkdirSync(resolve(location,".."),{recursive:true});writeFileSync(location,data);
  }
  function apkWith(changes={}) {
    writeFileSync(apk,zipSync(Object.fromEntries(Object.entries({...files,...changes})
      .map(([path,data])=>["assets/public/"+path,new Uint8Array(data)]))));
  }
  apkWith();
  function run(commit=source) {
    return spawnSync(process.execPath,["scripts/kotlin/package-downloads.mjs",browser,apk,out],{
      encoding:"utf8",env:{...process.env,GITHUB_SHA:commit,GITHUB_REPOSITORY:"celerycore/kenjatime"}
    });
  }
  return {root,browser,out,apk,files,apkWith,run};
}

test("public download package preserves tested APK/browser bytes and exact source identity",()=>{
  const f=fixture();
  try {
    const r=f.run();assert.equal(r.status,0,r.stderr);
    const info=JSON.parse(readFileSync(join(f.out,"release-info.json")));
    assert.equal(info.tag,"kotlin-wasm-"+source.slice(0,12));
    assert.equal(info.sourceCommit,source);
    assert.deepEqual(readFileSync(join(f.out,"kenjatime-kotlin.apk")),readFileSync(f.apk));
    const browser=unzipSync(readFileSync(join(f.out,"kenjatime-kotlin-browser.zip")));
    for(const [path,data] of Object.entries(f.files))assert.deepEqual(Buffer.from(browser[path]),data);
    for(const line of readFileSync(join(f.out,"SHA256SUMS"),"utf8").trim().split("\n")) {
      const [digest,path]=line.split("  ");
      assert.equal(createHash("sha256").update(readFileSync(join(f.out,path))).digest("hex"),digest);
    }
  }finally {rmSync(f.root,{recursive:true,force:true});}
});

test("release preparation rejects another commit's browser artifact before writing outputs",()=>{
  const f=fixture();
  try {
    const r=f.run(other);assert.notEqual(r.status,0);
    assert.match(r.stderr,/Browser artifact must match the release source/);
    assert.equal(existsSync(f.out),false);
  }finally {rmSync(f.root,{recursive:true,force:true});}
});

test("release preparation rejects missing or changed APK engine bytes",()=>{
  const f=fixture();
  try {
    f.apkWith({"wasm/kenjatime-kotlin-core.wasm":Buffer.from([0,97,115,109,1])});
    const r=f.run();assert.notEqual(r.status,0);
    assert.match(r.stderr,/APK and browser artifact differ/);
    assert.equal(existsSync(f.out),false);
    writeFileSync(f.apk,zipSync({}));
    const missing=f.run();assert.notEqual(missing.status,0);
    assert.match(missing.stderr,/APK asset missing/);
    assert.equal(existsSync(f.out),false);
  }finally {rmSync(f.root,{recursive:true,force:true});}
});
