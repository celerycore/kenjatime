import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles, animations} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';

const files=()=>packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
function session(){return new CoreSession(files(),{character:'kfm/kfm.def',opponent:'kfm/kfm.def',mode:'training'});}
const action=(id,text)=>animations('[Begin Action '+id+']\n'+text)[0];
function effect(s,animation,overrides={}){
  const fx={animation,owner:s.match.player,frameIndex:0,frameTime:0,age:0,maxAge:6,
    pos:{x:0,y:0},facing:1,under:false,...overrides};
  s.gameEffects.push(fx);return fx;
}
test('AIR LoopStart at frame zero is distinct from an unlooped action',()=>{
  const looping=action(9001,'LoopStart\n0,0,0,0,1\n0,1,0,0,1');
  const finite=action(9002,'0,0,0,0,1\n0,1,0,0,1');
  assert.equal(looping.loopStart,0);assert.equal(looping.loopDeclared,true);
  assert.equal(finite.loopStart,0);assert.equal(finite.loopDeclared,false);
  const s=session();try{
    const a=effect(s,looping,{maxAge:4}),b=effect(s,finite,{maxAge:4});
    s.tick();assert.equal(a.frameIndex,1);assert.equal(b.frameIndex,1);
    s.tick();assert.equal(a.frameIndex,0);assert.ok(s.gameEffects.includes(a));
    assert.ok(!s.gameEffects.includes(b));
    s.tick();s.tick();assert.ok(s.gameEffects.includes(a));
    s.tick();assert.equal(s.gameEffects.length,0);
  }finally{s.close();}
});
test('Common effects do not age or advance while their owner is in hitstop',()=>{
  const s=session();try{
    const fx=effect(s,action(9003,'0,0,0,0,1\n0,1,0,0,1'),{maxAge:4});
    const player=s.match.player;player.hitPauseTime=4;
    for(let i=0;i<3;i++){s.tick();assert.equal(fx.age,0);assert.equal(fx.frameIndex,0);}
    player.hitPauseTime=0;s.tick();assert.equal(fx.age,1);assert.equal(fx.frameIndex,1);
  }finally{s.close();}
});
test('Round reset clears stale effects and preserves reusable character assets',()=>{
  const s=session();try{
    effect(s,action(9004,'0,0,0,0,-1'));
    s.sparks.push({x:1,y:2,age:1});
    const before=s.effects;s.effects.all={remaining:20,age:0};
    const gen=s.match.roundGeneration;s.match.reset();
    assert.ok(s.match.roundGeneration>gen);
    s.tick();assert.equal(s.gameEffects.length,0);assert.equal(s.sparks.length,0);
    assert.notEqual(s.effects,before);assert.equal(s.effects.all,null);
    assert.equal(s.roundGeneration,s.match.roundGeneration);
  }finally{s.close();}
});
test('A valid HitDef spark ID with entirely missing source sprites uses visible fallback and diagnostic',()=>{
  const s=session();try{
    const a=s.match.player;
    a.animations.set(9992,action(9992,'64123,5,0,0,1'));
    const original=s.match.tick.bind(s.match);
    s.match.tick=(...args)=>{original(...args);s.match.events.push({type:'hit',attacker:a,
      hitDef:{sparkno:9992,sparkCommon:false},x:a.pos.x,y:a.pos.y,guarded:false});};
    s.tick();assert.equal(s.gameEffects.length,0);
    assert.equal(s.sparks.length,1);
    assert.ok(s.snapshot().diagnostics.some(d=>d.type==='missing-sprite'&&d.message.includes('9992')));
  }finally{s.close();}
});
test('An intentionally invisible HitDef effect does not fabricate sprite art',()=>{
  const s=session();try{
    const a=s.match.player;a.animations.set(9993,action(9993,'-1,0,0,0,-1'));
    const original=s.match.tick.bind(s.match);
    s.match.tick=(...args)=>{original(...args);s.match.events.push({type:'hit',attacker:a,
      hitDef:{sparkno:9993,sparkCommon:false},x:a.pos.x,y:a.pos.y,guarded:false});};
    s.tick();assert.equal(s.sparks.length,0);
    assert.ok(!s.snapshot().diagnostics.some(d=>d.type==='missing-sprite'));
  }finally{s.close();}
});
