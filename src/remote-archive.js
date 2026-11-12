import { MAX_ARCHIVE_BYTES, ARCHIVE_LIMIT_MB } from "./archive-limits.js";
import { archiveKind } from "./archive-kind.js";

/** Browser-only download fallback; requires direct HTTPS URL and server CORS. */
export function validateArchiveURL(value, base="https://celerycore.github.io/kenjatime/") {
  let url;
  try { url = new URL(String(value || "").trim(), base); }
  catch { throw Error("Enter a valid HTTPS archive download URL."); }
  const origin = new URL(base).origin;
  if (url.protocol !== "https:" && !(url.protocol === "http:" && url.origin === origin))
    throw Error("The archive must be available through a direct HTTPS download link.");
  if (url.username || url.password)
    throw Error("Do not include login credentials in the archive link.");
  return url;
}
function archiveFilename(url, kind) {
  let name="";
  try { name=decodeURIComponent(url.pathname.split("/").pop()||""); } catch {}
  name=name.replace(/[^a-zA-Z0-9_(). -]/g,"_").replace(/^\.+/,"").slice(0,110);
  const extensions=/\.(zip|rar|7z|tar|tgz|gz|bz2|xz|zst|cab|cpio|iso|ar|xar)$/i;
  if (!extensions.test(name))
    name="imported-archive."+({rar:"rar","7z":"7z",tar:"tar",compressed:"tar.gz",zstd:"tar.zst"}[kind]||"zip");
  return name;
}

/** Direct fetch: no proxy, no cookies, bounded at the existing 128MB limit. */
export async function downloadArchiveFromUrl(value, {
  fetchImpl=fetch,
  base=typeof location === "undefined" ? "https://celerycore.github.io/kenjatime/" : location.href,
  onProgress=()=>{},
  maxBytes=MAX_ARCHIVE_BYTES,
  createFile=(parts,name)=>new File(parts,name,{type:"application/octet-stream"}),
}={}) {
  if (!Number.isInteger(maxBytes) || maxBytes<1 || maxBytes>MAX_ARCHIVE_BYTES) throw Error("Invalid archive size limit.");
  const url=validateArchiveURL(value,base);
  let response;
  try {
    response=await fetchImpl(url.href,{mode:"cors",credentials:"omit",redirect:"follow"});
  } catch {
    throw Error("The archive link cannot be downloaded by this browser (CORS/network). Use a direct public HTTPS download link or choose the file through Drive.");
  }
  if (!response?.ok) throw Error("Archive download failed (HTTP "+(response?.status||"unknown")+").");
  const length=Number(response.headers?.get?.("content-length")||0);
  if (length>maxBytes) throw Error(`Archive exceeds the ${ARCHIVE_LIMIT_MB} MiB size limit.`);
  let size=0, parts=[];
  if (response.body?.getReader) {
    const reader=response.body.getReader();
    try {
      while (true) {
        const packet=await reader.read();
        if(packet.done)break;
        const bytes=packet.value;
        if(!bytes?.byteLength)continue;
        size+=bytes.byteLength;
        if(size>maxBytes){await reader.cancel().catch(()=>{});throw Error(`Archive exceeds the ${ARCHIVE_LIMIT_MB} MiB size limit.`);}
        parts.push(bytes);
        onProgress("Downloading archive: "+(size/1048576).toFixed(1)+" MiB");
      }
    } finally {reader.releaseLock?.();}
  } else {
    const bytes=new Uint8Array(await response.arrayBuffer());
    size=bytes.byteLength;
    if(size>maxBytes)throw Error(`Archive exceeds the ${ARCHIVE_LIMIT_MB} MiB size limit.`);
    parts=[bytes];
  }
  if(!size)throw Error("The archive download is empty.");
  const prefix=new Uint8Array(Math.min(size,1024*1024));let offset=0;
  for(const part of parts) {
    const count=Math.min(part.byteLength,prefix.length-offset);
    if(count<=0)break;
    prefix.set(part.subarray(0,count),offset);offset+=count;
  }
  const kind=archiveKind(prefix);
  if(!kind)throw Error("The link returned a web page or an unsupported format, not a ZIP/RAR/7z/TAR archive.");
  const finalUrl=validateArchiveURL(response.url||url.href,base);
  return createFile(parts,archiveFilename(finalUrl,kind));
}
