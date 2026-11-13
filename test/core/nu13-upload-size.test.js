import test from "node:test";
import assert from "node:assert/strict";
import { MAX_ARCHIVE_BYTES, MAX_EXPANDED_BYTES, ARCHIVE_LIMIT_MB } from "../../src/archive-limits.js";
import { archiveVolumePlan } from "../../src/archive-volumes.js";
import { readZipFile, readArchiveFiles } from "../../src/uploads.js";
import { packageFiles } from "../../src/formats.js";
import { downloadArchiveFromUrl } from "../../src/remote-archive.js";

const NU13_ZIP_SIZE=180639014, NU13_RAR_SIZE=149821803;

test("previously supplied Nu-13 archives fit 256 MiB cap without raising expanded 512 MiB bound",()=>{
  assert.equal(ARCHIVE_LIMIT_MB,256);
  assert.equal(MAX_ARCHIVE_BYTES,256*1024*1024);
  assert.equal(MAX_EXPANDED_BYTES,512*1024*1024);
  for(const size of [NU13_ZIP_SIZE,NU13_RAR_SIZE]) {
    assert.ok(size>128*1024*1024 && size<MAX_ARCHIVE_BYTES);
    assert.equal(archiveVolumePlan([{name:"Nu-13.zip",size}]).total,size);
  }
});
test("multipart total larger than 256 MiB is rejected before reading",async()=>{
 const part=(name,size)=>({name,size,async arrayBuffer(){throw Error("Should not read");}});
 const volumes=[part("nu13.part01.rar",MAX_ARCHIVE_BYTES-1),part("nu13.part02.rar",2)];
 assert.throws(()=>archiveVolumePlan(volumes),/256 MiB/);
 await assert.rejects(readArchiveFiles(volumes),/256 MiB/);
});
test("oversize single ZIP fails before allocating",async()=>{
 let read=false;
 await assert.rejects(readZipFile({name:"oversize.zip",size:MAX_ARCHIVE_BYTES+1,async arrayBuffer(){read=true;throw Error("Unexpected read");}}),/256 (MB|MiB)/);
 assert.equal(read,false);
 assert.throws(()=>packageFiles({length:MAX_ARCHIVE_BYTES+1}),/256 (MB|MiB)/);
});
test("remote 257 MiB Content-Length is rejected before body access",async()=>{
 let accessed=false;
 await assert.rejects(downloadArchiveFromUrl("https://example.org/too-big.zip",{
  fetchImpl:async()=>({ok:true,url:"https://example.org/too-big.zip",headers:{get:()=>String(MAX_ARCHIVE_BYTES+1)},body:{getReader(){accessed=true;throw Error("should not read");}}}),
 }),/256 MiB/);
 assert.equal(accessed,false);
});
