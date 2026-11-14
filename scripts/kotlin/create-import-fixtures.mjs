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
