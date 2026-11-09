import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TrainingMatch } from '../../src/combat.js';
import { parseSections } from '../../src/runtime.js';
import { explodDrawPriority } from '../../src/explods.js';
import { CoreAudio } from '../../src/core/audio.js';

const encode = value => new TextEncoder().encode(value);
const frame = () => ({group:0,number:0,x:0,y:0,ticks:-1,clsn1:[],clsn2:[]});
function character(script='') {
  const source="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n"+script+"\n[Statedef 300]\ntype=A\nmovetype=I\nphysics=N\nanim=0\n";
  return {path:'c.def',def:{info:{name:'Rare fixture'},files:{cns:'c.cns'}},files:{'c.cns':encode(source)},animations:[{id:0,frames:[frame()]}]};
}
function world(script='') {return new TrainingMatch(character(script),{opponentCharacter:character(),initialize:false,pushboxes:false});}
function control(actor,type,lines=''){
  const section=parseSections('[State Probe]\ntype='+type+'\n'+lines)[0];
  actor.execute({...section,type:type.toLowerCase()});
}
test('legacy HitDef sprpriority applies on hit and explicit p1sprpriority wins',()=>{
  const w=world(),a=w.player,b=w.opponent;
  control(a,'HitDef','attr=S,NA\ndamage=10\npausetime=0,0\nground.velocity=0,0\nsparkno=-1\nsprpriority=5');
  assert.equal(a.hitDef.p1sprpriority,5);
  b.receiveHit(a.hitDef,a);
  assert.equal(a.sprPriority,5);
  assert.ok(!a.diagnostics.some(d=>d.type==='unsupported-hitdef-parameter'&&/sprpriority/.test(d.message)));
  control(a,'HitDef','attr=S,NA\nsprpriority=-2\np1sprpriority=3');
  assert.equal(a.hitDef.p1sprpriority,3);
  b.moveType='I';b.hitPauseTime=0;
  const received=b.receiveHit({...a.hitDef,damage:[0,0],pauseTime:[0,0]},a);
  assert.ok(received);assert.equal(a.sprPriority,3);
});
test('Helper bindtime tracks p2 for its lifetime then releases, with opponent Y origin',()=>{
  const w=world(),a=w.player,b=w.opponent;b.pos.y=20;b.facing=-1;
  control(a,'Helper','stateno=300\nid=7181\npostype=p2\npos=10,-4\nfacing=-1\nbindtime=2');
  const helper=w.entities.find(v=>v.parent);
  assert.ok(helper);assert.deepEqual(helper.pos,{x:b.pos.x-10,y:16});
  assert.equal(helper.facing,1);assert.equal(helper.bound.target,b);
  b.vel.x=2;w.tick();assert.equal(helper.bound.time,1);assert.equal(helper.pos.x,b.pos.x-10);
  w.tick();assert.equal(helper.bound,null);const after=helper.pos.x;
  w.tick();assert.equal(helper.pos.x,after);
  assert.ok(!helper.diagnostics.some(d=>d.type==='unsupported-helper'&&/bindtime/.test(d.message)));
});
test('Helper bindtime -1 is indefinite until anchor destruction; zero is no binding',()=>{
  const w=world(),a=w.player,h=w.spawnHelper(a,{stateno:300,postype:'p2',bindtime:-1,pos:[5,0]});
  w.tick();assert.ok(h.bound);w.opponent.destroyed=true;w.tick();assert.equal(h.bound,null);
  assert.equal(w.spawnHelper(a,{stateno:300,bindtime:0}).bound,null);
  assert.throws(()=>w.spawnHelper(a,{stateno:300,bindtime:-2}),/bindtime/);
});
test('Explod under changes layering, ModifyExplod resets it, ontop wins',()=>{
  const w=world(),a=w.player;
  control(a,'Explod','anim=0\nid=7\nunder=1\nsprpriority=5\nremovetime=-1');
  assert.equal(explodDrawPriority(a.explods[0]),-1000);
  control(a,'ModifyExplod','id=7\nunder=0');
  assert.equal(explodDrawPriority(a.explods[0]),5);
  control(a,'ModifyExplod','id=7\nunder=1\nontop=1');
  assert.equal(explodDrawPriority(a.explods[0]),1000);
  assert.ok(!a.diagnostics.some(d=>d.type==='unsupported-explod-parameter'&&/under/.test(d.message)));
});
test('AssertSpecial nomusic is tick scoped with no unsupported flag',()=>{
  const w=world('[State Music]\ntype=AssertSpecial\ntrigger1=1\nflag=nomusic');
  w.tick();assert.equal(w.player.asserted.has('nomusic'),true);
  assert.ok(!w.player.diagnostics.some(d=>d.type==='unsupported-flag'&&/nomusic/.test(d.message)));
  w.player.changeState(300);w.tick();assert.equal(w.player.asserted.has('nomusic'),false);
});
test('BGM suppression coexists with manual pause without affecting sound playback paths',t=>{
  const previous=globalThis.Audio,elements=[];
  globalThis.Audio=class{constructor(){this.playCount=0;this.pauseCount=0;elements.push(this);}
    play(){this.playCount++;return Promise.resolve();}pause(){this.pauseCount++;}};
  t.after(()=>{if(previous===undefined)delete globalThis.Audio;else globalThis.Audio=previous;});
  let outputPaused=false;
  const output={pause:on=>{outputPaused=on;},status:()=>({paused:outputPaused}),media:()=>({disconnect(){},volume(){}}),close(){}};
  const audio=new CoreAudio(()=>{},{output});
  audio.setMusicSuppressed(true);audio.musicFile({bytes:new Uint8Array([1,2])});
  const music=elements[0];assert.equal(music.playCount,0);assert.ok(music.pauseCount>=1);
  audio.pause(true);audio.setMusicSuppressed(false);assert.equal(music.playCount,0);
  audio.pause(false);assert.equal(music.playCount,1);
  audio.setMusicSuppressed(true);audio.setMusicSuppressed(false);assert.equal(music.playCount,2);
  audio.close();
});
