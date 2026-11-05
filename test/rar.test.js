import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {archiveKind} from '../src/archive-kind.js';
import {unpackArchiveBytes} from '../src/archive-reader.js';
import {readArchiveFile,archiveAccept} from '../src/uploads.js';
import {charactersFromFiles,packagePath} from '../src/formats.js';
import {MAX_EXPANDED_BYTES,MAX_ARCHIVE_FILES} from '../src/archive-limits.js';
import {rar4,rar5} from './fixtures/rar-fixtures.js';
import {zipSync,strToU8} from 'fflate';

const definition='[Info]\nname=RAR fixture\n[Files]\nsprite=hero.sff';
const entries=()=>[['Hero/hero.def',definition],['Hero/hero.sff',new Uint8Array([1,2,3])]];

test('ZIP import never loads the RAR decoder or WASM',async()=>{
  let loads=0;const files=await unpackArchiveBytes(zipSync({'hero.def':strToU8(definition)}),{loadWasm:()=>{loads++;throw Error('RAR loader must stay lazy');}});assert.ok(files['hero.def']);assert.equal(loads,0);
});

test('RAR decoding respects Uint8Array and Node Buffer slice boundaries',async()=>{
  for(const make of [rar4,rar5]){
    const data=make(entries()),padded=new Uint8Array(data.length+19);padded.set(data,11);
    for(const view of [padded.subarray(11,11+data.length),Buffer.from(padded.buffer,11,data.length)])assert.equal(charactersFromFiles(await unpackArchiveBytes(view))[0].def.info.name,'RAR fixture');
  }
});

for(const [name,make]of [['RAR4',rar4],['RAR5',rar5]]){
  test(`${name} signatures import independent stored fixtures with case-insensitive nested paths`,async()=>{
    const data=make(entries());assert.equal(archiveKind(data),'rar');const files=await unpackArchiveBytes(data);assert.deepEqual([...files['hero/hero.sff']],[1,2,3]);assert.equal(charactersFromFiles(files)[0].def.info.name,'RAR fixture');
  });
  test(`${name} normalizes contained paths and rejects real traversal before extraction`,async()=>{
    const files=await unpackArchiveBytes(make([['Hero/unused/../hero.def',definition],['Hero\\hero.sff',new Uint8Array([1])]]));assert.equal(charactersFromFiles(files).length,1);
    for(const path of ['../outside.def','Hero/../../outside.def','C:\\outside.def'])await assert.rejects(()=>unpackArchiveBytes(make([[path,'x']])),/Unsafe archive path/);
  });
  test(`${name} rejects conflicting case-normalized files and permits identical duplicates`,async()=>{
    await assert.rejects(()=>unpackArchiveBytes(make([['Hero/A.txt','one'],['hero/a.txt','two']])),/different contents/);
    assert.equal(Object.keys(await unpackArchiveBytes(make([['Hero/A.txt','one'],['hero/a.txt','one']]))).length,1);
  });
  test(`${name} preflights declared expanded size before decompressing payloads`,async()=>{
    await assert.rejects(()=>unpackArchiveBytes(make([['large.bin',new Uint8Array(),{declaredSize:MAX_EXPANDED_BYTES+1}]])),/512 MB expanded/);
  });
  test(`${name} ignores metadata and directory records and releases the decoder for subsequent imports`,async()=>{
    const files=await unpackArchiveBytes(make([['Hero/',null,{directory:true}],['__MACOSX/._hero.def','x'],['Hero/.DS_Store','x'],...entries()]));assert.equal(Object.keys(files).length,2);
    await assert.rejects(()=>unpackArchiveBytes(make([['../x','x']])));assert.equal(charactersFromFiles(await unpackArchiveBytes(make(entries()))).length,1);
  });
}

test('RAR5 Unicode names use NFC matching and preserve asset bytes',async()=>{
  const files=await unpackArchiveBytes(rar5([['日本/hero.def','[Info]\nname=Unicode RAR\n[Files]\nsprite=café.sff'],['日本/cafe\u0301.sff',new Uint8Array([4])]]));assert.equal(charactersFromFiles(files)[0].sprite.path,'日本/café.sff');assert.equal(packagePath('日本/cafe\u0301.sff'),'日本/café.sff');
});

test('mobile RAR MIME/extension variations are identified from content',async()=>{
  for(const [name,type]of [['hero.RAR',''],['cloud-download','application/octet-stream'],['hero.rar','application/vnd.rar']]){
    const bytes=rar5(entries());assert.deepEqual(await readArchiveFile({name,type,size:bytes.length,arrayBuffer:async()=>bytes.buffer}),bytes);
  }
  assert.match(archiveAccept,/\.rar/);assert.match(archiveAccept,/application\/vnd.rar/);assert.equal(archiveKind(new Uint8Array([0x52,0x61,0x72,0x21,0x1a,7,1])),null);
});

test('password-protected and multipart RARs explain how to repackage them',async()=>{
  await assert.rejects(()=>unpackArchiveBytes(rar4([['secret.txt','data',{encrypted:true}]])),/Password-protected/);
  await assert.rejects(()=>unpackArchiveBytes(rar4(entries(),{volume:true})),/Multi-part/);
});

test('damaged payloads and truncated RAR headers fail without blocking the next import',async()=>{
  const broken=rar4([['a.txt','payload']]);broken[broken.length-8]^=255;await assert.rejects(()=>unpackArchiveBytes(broken),/damaged|incomplete|unsupported/);
  await assert.rejects(()=>unpackArchiveBytes(rar5(entries()).slice(0,12)),/damaged|incomplete|unsupported/);
  assert.equal(Object.keys(await unpackArchiveBytes(rar5(entries()))).length,2);
});

test('RAR entry limits reject excessive headers and parallel API imports serialize shared WASM state',async()=>{
  const tooMany=Array.from({length:MAX_ARCHIVE_FILES+1},(_,i)=>[`${i}.txt`,new Uint8Array()]);await assert.rejects(()=>unpackArchiveBytes(rar4(tooMany)),/5,000 files/);
  const [a,b]=await Promise.all([unpackArchiveBytes(rar4([['a.txt','a']])),unpackArchiveBytes(rar5([['b.txt','b']]))]);assert.equal(new TextDecoder().decode(a['a.txt']),'a');assert.equal(new TextDecoder().decode(b['b.txt']),'b');
});

for(const [label,envKey,names]of [['Tomoka','MUGEN_TOMOKA_RAR',['Tomoka Minato']],['Taiga','MUGEN_TAIGA_RAR',['Taiga Aisaka','Taiga Aisaka','Taiga Aisaka']]])test(`${label} supplied compressed RAR5 resolves all character assets`,{skip:!process.env[envKey]||!existsSync(process.env[envKey])},async()=>{
  const bytes=new Uint8Array(readFileSync(process.env[envKey])),files=await unpackArchiveBytes(bytes),characters=charactersFromFiles(files);assert.equal(bytes[6],1);assert.deepEqual(characters.map(c=>c.def.info.name),names);for(const character of characters)assert.deepEqual(character.checks.filter(c=>!c.ok),[]);
});
