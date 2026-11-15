import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {unzipSync,zipSync} from "fflate";
import {rar4} from "../../test/fixtures/rar-fixtures.js";

const all=unzipSync(new Uint8Array(readFileSync("public/kfm.zip")));
const raw=Object.entries(all).filter(([path])=>!path.endsWith("/"));
const script=raw.filter(([path])=>path!=="kfm/kfm.sff"&&
  !/\/ending\.|\/intro\./i.test(path));
const art=[["kfm.sff",all["kfm/kfm.sff"]]];
mkdirSync("test-output",{recursive:true});
// Actual stored RAR4 files generated with an independent header encoder
// from the public KFM fixture, not bundled copyrighted Nu13/Tomoka data.
for(const[name,entries] of [
 ["kotlin-kfm-script.rar",script],["kotlin-kfm-sprite.rar",art],
 ["kotlin-kfm-complete.rar",raw]
]){
 const archive=rar4(entries);
 writeFileSync("test-output/"+name,archive);
 console.log(name,archive.length,"bytes",entries.length,"entries");
}
writeFileSync("test-output/kotlin-kfm.zip",zipSync(Object.fromEntries(raw)));

// Public KFM art plus an explicitly synthetic CNS effect. This exercises
// actual compiled Kotlin -> worker -> Canvas effect painting in the browser.
const effectFiles=Object.fromEntries(raw);
effectFiles["kfm/kfm.cns"]=new TextEncoder().encode(
  new TextDecoder("iso-8859-1").decode(effectFiles["kfm/kfm.cns"])+`
[Statedef -2]
[State -2, Kotlin Explod renderer fixture]
type=Explod
trigger1=NumExplod(701)=0
id=701
anim=0
postype=p1
pos=20,-60
bindtime=-1
removetime=-1
scale=.5,.5
sprpriority=-1
`);
writeFileSync("test-output/kotlin-kfm-explod.zip",zipSync(effectFiles));
