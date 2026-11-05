import {test} from 'node:test';
import assert from 'node:assert/strict';
import {zipSync,strToU8} from 'fflate';
import {archive,packageFiles} from '../src/formats.js';
import {readZipFile,zipAccept} from '../src/uploads.js';
import {FighterRuntime} from '../src/runtime.js';
import {characterCommands} from '../src/cpu.js';
import {COMMON_STATES} from '../src/common.js';
import {MAX_ZIP_BYTES,MAX_EXPANDED_BYTES} from '../src/archive-limits.js';

const definition='[Info]\nname=Mobile Hero\n[Files]\nsprite=hero.sff\ncns=hero.cns\nstcommon=../data/common1.cns';
test('phone ZIP directory markers, archive-root slashes, Windows separators and contained dot segments import',()=>{
  const files=packageFiles(zipSync({'/':new Uint8Array(),'./':new Uint8Array(),'/Hero/':new Uint8Array(),'/Hero/./hero.def':strToU8(definition),'/Hero/unused/../hero.sff':new Uint8Array([1]),'Hero\\hero.cns':strToU8('[Statedef 0]\ntype=S')}));
  const [c]=archive(zipSync(files));assert.equal(c.path,'hero/hero.def');assert.ok(c.sprite);assert.equal(c.checks.find(check=>check.key==='stcommon').ok,false);
  const f=new FighterRuntime(c,{commonText:COMMON_STATES});assert.equal(f.stateNo,0);assert.deepEqual(f.diagnostics,[]);
});
test('Apple metadata is ignored and decomposed Unicode asset names match character references',()=>{
  const [c]=archive(zipSync({'__MACOSX/._hero.def':new Uint8Array([1]),'.DS_Store':new Uint8Array([2]),'hero/._sprite.sff':new Uint8Array([3]),'hero/hero.def':strToU8('[Info]\nname=Unicode\n[Files]\nsprite=café.sff'),'hero/cafe\u0301.sff':new Uint8Array([4])}));
  assert.equal(c.path,'hero/hero.def');assert.equal(c.sprite.path,'hero/café.sff');assert.equal(Object.keys(c.files).length,2);
});
test('external shared references are reported and adjacent relocated assets can be resolved safely',()=>{
  const [c]=archive(zipSync({'hero.def':strToU8('[Info]\nname=Relocated\n[Files]\nsprite=C:\\mugen\\hero\\hero.sff\ncmd=../../old/hero.cmd\nstcommon=../data/common1.cns\npal1=../../missing.act'),'hero.sff':new Uint8Array([1]),'hero.cmd':strToU8('[Command]\nname=x\ncommand=x'),'data/common1.cns':strToU8('[Statedef 0]\ntype=S')}));
  assert.equal(c.sprite.path,'hero.sff');assert.ok(c.checks.find(check=>check.key==='cmd').ok);assert.equal(characterCommands(c).commands[0].name,'x');
  assert.equal(c.checks.find(check=>check.key==='stcommon').path,'data/common1.cns');const missing=c.checks.find(check=>check.key==='pal1');assert.equal(missing.ok,false);assert.match(missing.message,/outside the ZIP/);
  const [without]=archive(zipSync({'hero.def':strToU8('[Info]\nname=Missing\n[Files]\nsprite=hero.sff\ncmd=../../missing.cmd'),'hero.sff':new Uint8Array([1])}));assert.doesNotThrow(()=>characterCommands(without));
});
test('true root traversal, drive paths and conflicting normalized files remain rejected',()=>{
  for(const path of ['../outside.def','hero/../../outside.def','C:\\outside.def','name\0.def'])assert.throws(()=>packageFiles(zipSync({[path]:new Uint8Array([1])})),/Unsafe archive path/);
  const same=packageFiles(zipSync({'Hero/HERO.CNS':new Uint8Array([1]),'hero/hero.cns':new Uint8Array([1])}));assert.equal(Object.keys(same).length,1);
  assert.throws(()=>packageFiles(zipSync({'Hero/HERO.CNS':new Uint8Array([1]),'hero/hero.cns':new Uint8Array([2])})),/different contents/);
});
test('mobile file providers can omit or mislabel MIME types and extensions; ZIP content identifies the file',async()=>{
  for(const [name,type]of [['HERO.ZIP',''],['cloud-download','application/octet-stream'],['hero.zip','application/x-zip-compressed']]){
    const bytes=zipSync({'hero.def':strToU8(definition)}),file={name,type,size:bytes.length,arrayBuffer:async()=>bytes.buffer};assert.deepEqual(await readZipFile(file),bytes);
  }
  assert.match(zipAccept,/application\/zip/);assert.equal(await readZipFile(null),null);
  await assert.rejects(()=>readZipFile({size:10,arrayBuffer:async()=>strToU8('not a zip').buffer}),/Choose a ZIP/);
  await assert.rejects(()=>readZipFile({size:128*1024*1024+1,arrayBuffer:async()=>{throw Error('should not read');}}),/128 MB/);
  await assert.rejects(()=>readZipFile({size:10,arrayBuffer:async()=>{throw Error('SecurityError');}}),/Download the ZIP to your device/);
});

test('expanded-size and entry-count limits reject before expanding oversized payloads',()=>{
  const bytes=zipSync({'hero.def':strToU8(definition)}),view=new DataView(bytes.buffer);let central=0;
  for(let i=0;i<bytes.length-4;i++)if(view.getUint32(i,true)===0x02014b50){central=i;break;}
  assert.ok(central);view.setUint32(central+24,MAX_EXPANDED_BYTES+1,true);assert.throws(()=>packageFiles(bytes),/512 MB expanded/);
  assert.throws(()=>packageFiles(zipSync(Object.fromEntries(Array.from({length:5001},(_,i)=>['entry'+i,new Uint8Array()])))),/5,000 files/);
  assert.throws(()=>packageFiles({length:MAX_ZIP_BYTES+1}),/128 MB/);
});
