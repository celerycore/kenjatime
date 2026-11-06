import {test} from 'node:test';
import assert from 'node:assert/strict';
import {stageWithResolvedMusic} from '../src/engine-stage.js';
const enc=s=>new TextEncoder().encode(s),text=b=>new TextDecoder().decode(b);
test('Go stage music resolves flattened, Windows and nested package paths without editing saved sources',()=>{
 const path='imports/a/stages/forest.def',original=enc('[Music]\nbgmusic = sound/Blood heat!.mp3 ; stage track\nround2.bgm = ../sound/second.ogg\nbgmvolume=80\n[BGDef]\nspr=forest.sff'),files={[path]:original,'imports/a/stages/blood heat!.mp3':enc('audio'),'imports/a/sound/second.ogg':enc('second')};
 const result=text(stageWithResolvedMusic(path,files));assert.match(result,/bgmusic = imports\/a\/stages\/blood heat!\.mp3 ; stage track/);assert.match(result,/round2.bgm = imports\/a\/sound\/second.ogg/);assert.match(result,/spr=forest.sff/);assert.equal(files[path],original);
});
test('Go stage music prefers exact resources and never borrows another imported package',()=>{
 const path='imports/a/stage.def',files={[path]:enc('[Music]\nbgmusic=sound\\song.mp3\nround2.bgm=missing.ogg'),'imports/a/sound/song.mp3':enc('exact'),'imports/a/song.mp3':enc('adjacent'),'imports/b/missing.ogg':enc('other')};const result=text(stageWithResolvedMusic(path,files));assert.match(result,/bgmusic=imports\/a\/sound\/song.mp3/);assert.match(result,/round2.bgm=missing.ogg/);
});
