import test from "node:test";
import assert from "node:assert/strict";
import { downloadArchiveFromUrl, validateArchiveURL } from "../../src/remote-archive.js";

const zip = new Uint8Array([0x50,0x4b,0x03,0x04,0,0,0,0]);
const file=(parts,name)=>({parts,name,size:parts.reduce((total,b)=>total+b.byteLength,0)});

test("direct archive URLs require HTTPS without embedded credentials",()=>{
 assert.equal(validateArchiveURL("https://example.org/fighter.rar").pathname,"/fighter.rar");
 for(const uri of ["file:///storage/emulated/0/fighter.zip","http://other.example/x.zip","javascript:alert(1)","https://me:pass@host.example/x.zip"]){
  assert.throws(()=>validateArchiveURL(uri));
 }
});

test("direct URL importer downloads a ZIP with no cookies or proxy",async()=>{
 let fetchCalled=0;
 const out=await downloadArchiveFromUrl("https://files.example/fighter.zip",{
  fetchImpl:async(url,options)=>{
   fetchCalled++;
   assert.equal(url,"https://files.example/fighter.zip");
   assert.equal(options.mode,"cors");
   assert.equal(options.credentials,"omit");
   return new Response(zip,{status:200,headers:{"content-length":String(zip.length)}});
  },
  createFile:file,
 });
 assert.equal(fetchCalled,1);
 assert.equal(out.name,"fighter.zip");
 assert.equal(out.size,zip.length);
});

test("archive link import refuses HTML, unavailable server and oversized stream",async()=>{
 await assert.rejects(downloadArchiveFromUrl("https://files.example/index",{
  fetchImpl:async()=>new Response("<html>login</html>"),createFile:file,
 }),/unsupported format/);
 await assert.rejects(downloadArchiveFromUrl("https://files.example/fighter.zip",{
  fetchImpl:async()=>{throw Error("CORS blocked");},createFile:file,
 }),/CORS\/network/);
 await assert.rejects(downloadArchiveFromUrl("https://files.example/fighter.zip",{
  fetchImpl:async()=>new Response(zip),maxBytes:4,createFile:file,
 }),/size limit/);
});
