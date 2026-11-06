import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {unpackArchiveBytes} from '../src/archive-reader.js';
import {charactersFromFiles} from '../src/formats.js';
import {readArchiveFile} from '../src/uploads.js';
const base=new URL('./fixtures/multi-archive/',import.meta.url),expected=JSON.parse(readFileSync(new URL('manifest.json',base))).files,loadMultiWasm=()=>readFileSync(new URL('../node_modules/libarchive-wasm/dist/libarchive.wasm',import.meta.url));
for(const format of ['zip','bzip2.zip','lzma.zip','7z','tar','tar.gz','tar.bz2','tar.xz','tar.zst','cpio'])test(`real ${format} archive preserves every file and detects MUGEN content without filename/MIME`,async()=>{
 const bytes=new Uint8Array(readFileSync(new URL('fighter.'+format,base)));
 const input=await readArchiveFile({name:'cloud-download',type:'application/octet-stream',size:bytes.length,arrayBuffer:async()=>bytes.buffer});
 const files=await unpackArchiveBytes(input,{loadMultiWasm});assert.deepEqual(Object.fromEntries(Object.entries(files).map(([n,b])=>[n,createHash('sha256').update(b).digest('hex')])),expected);assert.equal(charactersFromFiles(files)[0].def.info.name,'Archive Fixture');
});
test('self-extracting ZIP is decoded as data',async()=>{const files=await unpackArchiveBytes(new Uint8Array(readFileSync(new URL('fighter-sfx.zip',base))),{loadMultiWasm});assert.equal(charactersFromFiles(files).length,1);});
for(const name of ['traversal','symlink'])test(`${name} TAR entries are rejected`,async()=>assert.rejects(()=>unpackArchiveBytes(new Uint8Array(readFileSync(new URL(name+'.tar',base))),{loadMultiWasm}),/Unsafe|links/));
