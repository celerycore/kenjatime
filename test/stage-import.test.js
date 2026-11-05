import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {parseStage,stageDefinitions,StageRuntime} from '../src/stages.js';
import {unpackArchiveBytes} from '../src/archive-reader.js';
import {sff} from '../src/formats.js';

const enc=s=>new TextEncoder().encode(s);
function stage(text,files={},path='pack/arena.def'){
  files={...files,[path]:enc('[Info]\nname=Test\n[BGDef]\nspr=arena.sff\n'+text)};
  return parseStage(path,files);
}

test('Flat stage packs resolve adjacent music and sprites with original engine folder prefixes',()=>{
  const s=stage('[Music]\nbgmusic=sound/Blood heat!.mp3',{'pack/arena.sff':enc('sff'),'pack/blood heat!.mp3':enc('audio')});
  assert.equal(s.music.path,'pack/blood heat!.mp3');assert.equal(s.sprite.path,'pack/arena.sff');assert.deepEqual(s.diagnostics,[]);
});

test('Exact stage/engine resource paths take priority over relocated adjacent files',()=>{
  const files={'engine/stages/arena.sff':enc('sff'),'engine/sound/song.mp3':enc('correct'),'engine/stages/song.mp3':enc('adjacent')};
  const s=stage('[Music]\nbgmusic=sound/song.mp3',files,'engine/stages/arena.def');
  assert.equal(s.music.path,'engine/sound/song.mp3');
});

test('Missing stage music cannot pick an unrelated stage by filename',()=>{
  const s=stage('[Music]\nbgmusic=sound/song.mp3',{'other/song.mp3':enc('wrong'),'pack/arena.sff':enc('sff')});
  assert.equal(s.music.path,null);assert.match(s.diagnostics[0].message,/Stage music is missing/);
});

test('Legacy hires applies to backgrounds without changing fighter starts, floor, camera or localcoord',()=>{
  const s=stage('[StageInfo]\nhires=1\nzoffset=220\n[PlayerInfo]\np1startx=-80\np2startx=80\n[Camera]\nboundleft=-140\nboundright=140\nboundhigh=-170');
  const r=new StageRuntime(s);r.updateCamera([{pos:{x:500,y:-500}},{pos:{x:600,y:0}}]);
  assert.equal(s.backgroundScale,.5);assert.equal(s.coordinateScale,1);assert.deepEqual(s.starts.map(p=>p.x),[-80,80]);
  assert.equal(r.view().groundY,220);assert.equal(r.camera.x,140);assert.equal(r.camera.y,-100);
  assert.equal(stage('[StageInfo]\nhires=0').backgroundScale,1);
});

test('Modern stage music volume overrides the documented legacy signed volume offset',()=>{
  assert.equal(stage('[Music]\nbgvolume=255').music.volume,199.609375);
  assert.equal(stage('[Music]\nbgvolume=-255').music.volume,.390625);
  assert.equal(stage('[Music]\nbgvolume=999').music.volume,199.609375);
  assert.equal(stage('[Music]\nbgvolume=255\nbgmvolume=70').music.volume,70);
  assert.equal(stage('[Music]\nbgvolume=legacy_plugin\nbgmvolume=70').music.volume,70);
  assert.equal(stage('[Music]').music.volume,100);
});

const actual=process.env.MUGEN_FOREST_RAR;
test('Supplied Forest of King Cruel RAR resolves all background frames and music',{skip:!actual||!existsSync(actual)},async()=>{
  const files=await unpackArchiveBytes(new Uint8Array(readFileSync(actual))),stages=stageDefinitions(files);
  assert.equal(stages.length,1);const s=stages[0];assert.equal(s.name,'Forest of King Cruel');
  assert.equal(s.backgroundScale,.5);assert.equal(s.elements.length,66);assert.equal(s.animations.length,2);assert.deepEqual(s.diagnostics,[]);
  assert.equal(s.music.path,'blood heat!.mp3');const bank=sff(files[s.sprite.path]);assert.equal(bank.sprites.length,84);
  for(let i=0;i<bank.sprites.length;i++){const sp=bank.decode(i);assert.equal(sp.rgba.length,sp.w*sp.h*4);}
  const keys=new Set(bank.sprites.map(sp=>`${sp.group},${sp.number}`));
  for(const e of s.elements){const frames=e.animated?s.animations.find(a=>a.id===e.anim).frames:[{group:e.spriteno[0],number:e.spriteno[1]}];for(const f of frames)assert.ok(keys.has(`${f.group},${f.number}`));}
});
