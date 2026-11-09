import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../../src/formats.js';
import {parseSections} from '../../src/runtime.js';
import {CoreSession} from '../../src/core/session.js';
import {loadCommonEffects,hasCommonEffects} from '../../src/core/common-effects.js';
const encode=text=>new TextEncoder().encode(text);
const base=()=>packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
const fx=(files,prefix='')=>{
  files[prefix+'data/fight.def']=encode('[Info]\nlocalcoord = 1280,720\n[Files]\nfightfx.air = fightfx.air\nfightfx.sff = fightfx.sff\n[FightFx]\nscale = 4\n');
  files[prefix+'data/fightfx.air']=encode('[Begin Action 60]\n0,0,0,0,-1\n');
  files[prefix+'data/fightfx.sff']=files['kfm/kfm.sff'];
  return files;
};
test('Core loads AIR + SFF from fight.def and renders an F-prefixed Explod',()=>{
  const files=fx(base());
  const session=new CoreSession(files,{character:'kfm/kfm.def',opponent:'kfm/kfm.def',mode:'training'});
  try{
    assert.equal(session.commonEffects.animations.has(60),true);
    assert.equal(session.commonEffects.scale,1);
    assert.equal(session.match.player.commonAnimations.get(60).frames.length,1);
    const ctrl=parseSections('[State Fx]\ntype=Explod\ntrigger1=1\nanim=F60\nid=88\nremovetime=-1\n')[0];
    session.match.player.execute({...ctrl,type:'explod'});
    assert.equal(session.match.player.explods[0].common,true);
    session.tick();
    const frame=session.frame();
    assert.ok(frame.draws.some(draw=>draw.texture.startsWith('2:')),'common bank sprite should emit a draw');
    assert.ok(!session.snapshot().diagnostics.some(d=>d.type==='common-effects'));
  }finally{session.close();}
});
test('Active imported motif package takes precedence over unrelated library resources',()=>{
  const files=fx(base(),'imports/stage1/');
  files['data/fightfx.air']=encode('[Begin Action 99]\n0,0,0,0,-1\n');
  files['data/fightfx.sff']=files['kfm/kfm.sff'];
  const loaded=loadCommonEffects(files,{stage:'imports/stage1/stage.def'});
  assert.equal(loaded.paths.air,'imports/stage1/data/fightfx.air');
  assert.equal(loaded.animations.has(60),true);
  assert.equal(loaded.animations.has(99),false);
});
test('Missing source fightfx SFF reports an unavailable resource instead of inventing an image',()=>{
  const files=fx(base());delete files['data/fightfx.sff'];
  const loaded=loadCommonEffects(files);
  assert.equal(loaded.resource,null);
  assert.equal(loaded.animations.size,0);
  assert.equal(loaded.issues[0].type,'fightfx-missing');
});
test('GameMakeAnim uses common AIR, renders behind fighters and retires at the end of its finite action',()=>{
  const files=fx(base());
  files['data/fightfx.air']=encode('[Begin Action 61]\n0,0,0,0,1\n0,1,0,0,1\n');
  files['kfm/kfm.cns']=encode(new TextDecoder().decode(files['kfm/kfm.cns'])+
    '\n[Statedef 9998]\ntype=S\nmovetype=I\nphysics=N\nanim=0\n'+
    '[State Sprite]\ntype=GameMakeAnim\ntrigger1=Time = 0\nvalue=61\nunder=1\npos=0,-10\n');
  const session=new CoreSession(files,{character:'kfm/kfm.def',opponent:'kfm/kfm.def',mode:'training'});
  try{
    assert.equal(session.match.player.changeState(9998),true);
    session.tick();
    assert.equal(session.gameEffects.length,1);
    assert.equal(session.gameEffects[0].frameIndex,0);
    assert.ok(session.frame().draws.some(draw=>draw.texture.startsWith('2:')));
    session.tick();assert.equal(session.gameEffects[0].frameIndex,1);
    session.tick();assert.equal(session.gameEffects.length,0);
  }finally{session.close();}
});

test('Common-effect-only archives are recognized without character or stage files',()=>{
 const files=fx(base(),'imports/fxpack/');
 assert.equal(hasCommonEffects(files),true);
 const loaded=loadCommonEffects(files,{effectsPackage:'imports/fxpack/'});
 assert.equal(loaded.paths.sff,'imports/fxpack/data/fightfx.sff');
 assert.equal(loaded.animations.has(60),true);
});
test('AssertSpecial globalnoshadow is accepted and exposed as a match-wide render flag',()=>{
 const session=new CoreSession(base(),{character:'kfm/kfm.def',opponent:'kfm/kfm.def',mode:'training'});
 try{
  const ctrl=parseSections('[State Flag]\ntype=AssertSpecial\ntrigger1=1\nflag=globalnoshadow')[0];
  session.match.player.execute({...ctrl,type:'assertspecial'});
  assert.equal(session.frame().suppressCharacterShadows,true);
  assert.ok(!session.match.player.diagnostics.some(d=>d.type==='unsupported-flag'));
  session.tick();assert.equal(session.frame().suppressCharacterShadows,false);
 }finally{session.close();}
});
test('Original common.snd path is resolved independently of character SND and kept in the effect package namespace',()=>{
 const files=fx(base(),'imports/fxpack/');
 files['imports/fxpack/data/common.snd']=files['kfm/kfm.snd'];
 const loaded=loadCommonEffects(files,{effectsPackage:'imports/fxpack/'});
 assert.equal(loaded.soundPath,'imports/fxpack/data/common.snd');
 assert.equal(loaded.animations.has(60),true);
});

test('Core uses original common HitDef spark sprite and sound rather than generic GPU spark',()=>{
 const session=new CoreSession(fx(base()),{character:'kfm/kfm.def',opponent:'kfm/kfm.def',mode:'training'});
 try {
  const player=session.match.player;
  const original=session.match.tick.bind(session.match);
  session.match.tick=(...args)=>{
   original(...args);
   session.match.events.push({type:'hit',attacker:player,defender:session.match.opponent,
     hitDef:{sparkno:60,sparkCommon:true,sparkxy:[0,-6],hitsound:[7,2],hitSoundCommon:true},
     x:player.pos.x,y:player.pos.y,guarded:false,typeNone:false});
  };
  session.tick();
  assert.equal(session.gameEffects.length,1);
  assert.equal(session.gameEffects[0].animation.id,60);
  assert.equal(session.sparks.length,0);
  assert.ok(session.frame().draws.some(draw=>draw.texture.startsWith('2:')));
  assert.ok(session.events.some(e=>e.type==='playsnd'&&e.common===true&&e.group===7&&e.number===2));
  session.match.tick=original;
  for(let i=0;i<121;i++)session.tick();
  assert.equal(session.gameEffects.length,0,'Infinite source action must not retain impact sparks forever');
 }finally{session.close();}
});
test('Core draws authored local S sparks and reports missing shared effects rather than silently inventing original pixels',()=>{
 const session=new CoreSession(base(),{character:'kfm/kfm.def',opponent:'kfm/kfm.def',mode:'training'});
 try {
  const player=session.match.player;
  const original=session.match.tick.bind(session.match);
  let contact={type:'guard',attacker:player,defender:session.match.opponent,
    hitDef:{'guard.sparkno':0,guardSparkCommon:false,sparkxy:[0,0]},x:0,y:0,guarded:true};
  session.match.tick=(...args)=>{original(...args);session.match.events.push(contact);};
  session.tick();
  assert.equal(session.gameEffects.length,1);
  assert.equal(session.sparks.length,0);
  contact={...contact,hitDef:{'guard.sparkno':60,guardSparkCommon:true}};
  session.tick();
  assert.equal(session.sparks.length,1,'Preserve fallback flash when original F sprite unavailable');
  assert.ok(session.snapshot().diagnostics.some(d=>d.type==='missing-animation'));
 }finally{session.close();}
});
