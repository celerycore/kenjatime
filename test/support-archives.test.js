import {test} from 'node:test';
import assert from 'node:assert/strict';
import SevenZip from '7z-wasm';
import {zipSync,strToU8} from 'fflate';
import {unpackArchiveBytes} from '../src/archive-reader.js';
import {unpackSevenArchive} from '../src/seven-archive.js';
import {archiveVolumePlan,bundleArchiveVolumes} from '../src/archive-volumes.js';
import {readArchiveFiles} from '../src/uploads.js';
import {readFileSync} from 'node:fs';
import {crc32,rar4Volumes} from './fixtures/rar-fixtures.js';

const payload=strToU8('[Info]\nname=Encrypted fixture\n'+'0123456789'.repeat(1000));
async function archive(type,options=[]){
 const z=await SevenZip({print:()=>{},printErr:()=>{}});z.FS.writeFile('hero.def',payload);
 assert.equal(z.callMain(['a','-t'+type,...(options.some(o=>o.startsWith('-mx='))?[]:['-mx=0']),'-bd','-bsp0',...options,'archive.'+type,'hero.def']),0);
 return z.FS.readdir('/').filter(p=>p.startsWith('archive.')).map(name=>({name,bytes:z.FS.readFile(name)}));
}
for(const method of ['ZipCrypto','AES128','AES192','AES256'])test('encrypted ZIP '+method+' extracts with password and rejects a wrong password',async()=>{
 const [p]=await archive('zip',['-mem='+method,'-psecret']);
 assert.deepEqual((await unpackArchiveBytes(p.bytes,{password:'secret'}))['hero.def'],payload);
 await assert.rejects(()=>unpackArchiveBytes(p.bytes,{password:'incorrect'}),/password/i);
 const damaged=p.bytes.slice(),header=new DataView(damaged.buffer,damaged.byteOffset,damaged.byteLength),dataOffset=30+header.getUint16(26,true)+header.getUint16(28,true);damaged[dataOffset+32]^=1;
 await assert.rejects(()=>unpackArchiveBytes(damaged,{password:'secret'}),/password|damaged|signature|invalid/i);
});
test('7z AES encrypted headers and split ZIP/7z volumes preserve bytes in arbitrary selection order',async()=>{
 for(const type of ['7z','zip']){
  const parts=await archive(type,['-psecret',...(type==='7z'?['-mhe=on']:['-mem=AES256']),'-v1k']);assert.ok(parts.length>2);
  assert.deepEqual((await unpackSevenArchive(parts.reverse(),{password:'secret'}))['hero.def'],payload);
  const bundled=await bundleArchiveVolumes(parts);assert.deepEqual((await unpackArchiveBytes(bundled,{password:'secret'}))['hero.def'],payload);
  await assert.rejects(()=>unpackSevenArchive(parts,{password:'incorrect'}),/password/i);
 }
});
test('multipart validation rejects missing, mixed, duplicate and oversized selections before reading',async()=>{
 const p=name=>({name,size:1,arrayBuffer:()=>{throw Error('must not read');}});
 assert.throws(()=>archiveVolumePlan([p('a.7z.001'),p('a.7z.003')]),/missing/i);
 assert.throws(()=>archiveVolumePlan([p('a.part1.rar'),p('b.part2.rar')]),/one multipart/i);
 assert.throws(()=>archiveVolumePlan([p('a.rar'),p('A.RAR')]),/Duplicate/);
 await assert.rejects(()=>readArchiveFiles([{...p('a.7z.001'),size:128*1024*1024},p('a.7z.002')]),/together exceed/);
 assert.equal(archiveVolumePlan([p('hero.r00'),p('hero.rar')]).first,'hero.rar');
 assert.equal(archiveVolumePlan([p('hero.z01'),p('hero.zip')]).first,'hero.zip');
});
test('7-Zip fallback retains traversal, duplicate and expanded-size defenses',async()=>{
 await assert.rejects(()=>unpackSevenArchive([{name:'bad.zip',bytes:zipSync({'../outside.def':payload})}]),/Unsafe/);
 await assert.rejects(()=>unpackSevenArchive([{name:'bad.zip',bytes:zipSync({'hero.def':payload,'HERO.DEF':strToU8('different')})}]),/Duplicate/);
});
test('RAR4 files continue across native volume boundaries and retain following entries',async()=>{
 const parts=rar4Volumes([['hero.def',payload],['folder/last.txt','last file']]);const files=await unpackSevenArchive(parts.reverse());assert.deepEqual(files['hero.def'],payload);assert.equal(new TextDecoder().decode(files['folder/last.txt']),'last file');
});
test('pinned compressed RAR5 multivolume files match libarchive reference CRCs',async()=>{
 const root=new URL('./fixtures/support-rar/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',root)));
 const parts=manifest.fixtures.filter(f=>f.file.startsWith('test_read_format_rar5_multiarchive.part')).map(f=>({name:f.file,bytes:readFileSync(new URL(f.file,root))}));const files=await unpackSevenArchive(parts.reverse());
 assert.equal(crc32(files['home/antek/temp/build/unrar5/libarchive/bin/bsdcat_test']),0x35277473);assert.equal(crc32(files['home/antek/temp/build/unrar5/libarchive/bin/bsdtar_test']),0xe59665f8);
});
for(const format of ['rar4','rar5'])for(const variant of ['encrypted_filenames','solid_encrypted'])test(format+' AES '+variant+' decrypts actual pinned archive payloads',async()=>{
 const bytes=readFileSync(new URL('./fixtures/support-rar/test_read_format_'+format+'_'+variant+'.rar',import.meta.url));const files=await unpackArchiveBytes(bytes,{password:'password'});
 for(const name of ['a.txt','b.txt','c.txt','d.txt'])assert.equal(new TextDecoder().decode(files[name]),'This is from '+name);
 await assert.rejects(()=>unpackArchiveBytes(bytes,{password:'wrong'}),/password|damaged/i);
});
test('compressed ZIP AES and LZMA2 7z AES retain their passwords',async()=>{
 for(const type of ['zip','7z']){const password=type==='zip'?'compressed passphrase':'日本語 passphrase';const [part]=await archive(type,['-mx=5','-p'+password,...(type==='zip'?['-mem=AES256']:['-mhe=on'])]);assert.deepEqual((await unpackArchiveBytes(part.bytes,{password}))['hero.def'],payload);}
});
test('independent Pyzipper AES-256 fixture accepts UTF-8 passwords and rejects incorrect passwords',async()=>{
 const bytes=readFileSync(new URL('./fixtures/media/zip-aes-unicode.zip',import.meta.url));
 assert.equal(new TextDecoder().decode((await unpackArchiveBytes(bytes,{password:'日本語 passphrase'}))['hero.def']),'[Info]\nname=Unicode encryption fixture\n');
 await assert.rejects(()=>unpackArchiveBytes(bytes,{password:'wrong'}),/password/i);
});

test('legacy RAR/r00 names retain cross-volume payloads',async()=>{
 const parts=rar4Volumes([['hero.def',payload]]).map((p,i)=>({...p,name:'legacy.'+(i?'r'+String(i-1).padStart(2,'0'):'rar')}));
 assert.deepEqual((await unpackSevenArchive(parts.reverse()))['hero.def'],payload);
});
