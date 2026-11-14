import {charactersFromFiles,decodeText,packagePath} from "../formats.js";
import {unpackArchive,readArchiveFile} from "../uploads.js";

/** Kotlin standard's archive adapter: all combat remains in Kotlin/WASM.
 *
 * Use Kenjatime's REAL archive worker (RAR, 7z, ZIP) so the proper Wasm
 * decoder URLs are bundled into the web and Android assets. Do not call
 * unpackArchiveBytes on the UI thread for RAR: without explicit Wasm bytes
 * node-unrar-js will attempt a broken relative fetch in Capacitor WebView.
 */
export async function readInstalledArchive(file,onProgress=()=>{}){
  const bytes=await readArchiveFile(file);
  const result=await unpackArchive(bytes,{
    onProgress,
    prepareStageData:false,
    allowAssetOnly:true,
  });
  if(!result?.files||!Object.keys(result.files).length)
    throw Error("Archive contains no importable files.");
  return result.files;
}
const bname=p=>p.replaceAll("\\","/").split("/").at(-1)?.toLowerCase()||"";
const copyLabel=s=>String(s||"").replace(/[\r\n\t]/g," ").trim().slice(0,150);

/** Split MUGEN distributions can provide Nu-13 scripts in one archive and
 * Nu-13.sff in another. Resolve only an unambiguous matching real SFF file;
 * never generate fake art, add empty CNS scripts, or make unsupported ZSS
 * characters appear fully compatible.
 */
export function joinImportedResources(entries){
  const merged=Object.create(null);
  for(const {files} of entries)for(const [name,bytes]of Object.entries(files)){
    if(!(bytes instanceof Uint8Array))throw Error("Invalid extracted resource");
    if(Object.hasOwn(merged,name)){
      const old=merged[name];
      if(old.length!==bytes.length||old.some((b,i)=>b!==bytes[i]))
        throw Error("Conflicting MUGEN resource name across archives: "+name);
    }else merged[name]=bytes;
  }
  const list=charactersFromFiles(merged);
  const available=new Map();
  for(const path of Object.keys(merged)){
    const key=bname(path);
    if(!available.has(key))available.set(key,[]);
    available.get(key).push(path);
  }
  for(const fighter of list){
    for(const check of fighter.checks){
      if(check.ok || check.key!=="sprite"||!check.path)continue;
      const candidates=available.get(bname(check.path))||[];
      if(candidates.length!==1)continue;
      // Keep the original bytes untouched; the alias only repairs the
      // missing directory component in a companion user-supplied package.
      merged[check.path]=merged[candidates[0]];
    }
  }
  return merged;
}
export function availableKotlinFighters(files,source){
  const candidates=charactersFromFiles(files);
  const ready=[],missing=[];
  for(const fighter of candidates){
    const relevant=fighter.checks.filter(c=>c.key==="sprite"||c.key==="anim"||
      c.key==="cmd"||/^(cns|st\d*|stcommon)$/.test(c.key));
    const absent=relevant.filter(c=>!c.ok);
    const name=copyLabel(fighter.def.info?.displayname||
      fighter.def.info?.name||fighter.path);
    if(absent.length){
      missing.push({name,files:absent.map(c=>c.value)});
      continue;
    }
    const path=key=>fighter.checks.find(c=>c.key===key&&c.ok)?.path;
    const scripts=fighter.checks.filter(c=>c.ok&&
      /^(cns|st\d*|stcommon)$/.test(c.key)).map(c=>c.path);
    if(!scripts.length){
      missing.push({name,files:["CNS/ST scripts"]});continue;
    }
    if(scripts.some(p=>p.toLowerCase().endsWith(".zss"))){
      missing.push({name,files:["ZSS state support (not yet implemented in Kotlin)"]});
      continue;
    }
    // Reject only unsupported features explicitly rather than replacing
    // these authored moves with fake neutral states.
    const sprites=files[path("sprite")];
    ready.push({
      id:source+":"+fighter.path,
      name,source,
      air:decodeText(files[path("anim")]),
      cns:[...new Set(scripts)].map(p=>decodeText(files[p])).join("\n"),
      cmd:path("cmd")?decodeText(files[path("cmd")]):"",
      spriteBytes:sprites,
      imageCache:new Map(),decodedBytes:0,bank:null,index:null,
      unavailable:false,warning:null,
    });
  }
  return {ready,missing};
}
