import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {unzipSync} from 'fflate';
import {CoreSession} from '../../src/core/session.js';
import {normalizePresentation,presentationAspect,presentationViewport,PRESENTATION_NATIVE,PRESENTATION_WIDE} from '../../src/core/presentation.js';

const stageDef=`[Info]
name=Forest 320x240 fixture
[StageInfo]
HIres=1
zoffset=220
[Camera]
boundleft=-140
boundright=140
boundhigh=-170
boundlow=0
verticalfollow=.95
tension=40
floortension=62
[PlayerInfo]
p1startx=-80
p2startx=80
[Bound]
screenleft=15
screenright=15
[BGDef]
spr=../kfm/kfm.sff
`;
const sample=()=>{
  const files=unzipSync(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
  files['stages/forest.def']=new TextEncoder().encode(stageDef);
  return files;
};
const match=(presentation)=>new CoreSession(sample(),{
  character:'kfm/kfm.def',opponent:'kfm/kfm.def',
  stage:'stages/forest.def',mode:'training',presentation,opponentPalette:1,
});
test('presentation presets produce centered native 720x540 and widescreen 960x540 windows',()=>{
  assert.equal(normalizePresentation('invalid'),PRESENTATION_WIDE);
  assert.equal(normalizePresentation(PRESENTATION_NATIVE),PRESENTATION_NATIVE);
  assert.equal(presentationAspect(PRESENTATION_NATIVE),4/3);
  assert.equal(presentationAspect(PRESENTATION_WIDE),16/9);
  assert.deepEqual(presentationViewport(PRESENTATION_NATIVE),{x:120,y:0,width:720,height:540,aspect:4/3});
  assert.deepEqual(presentationViewport(PRESENTATION_WIDE),{x:0,y:0,width:960,height:540,aspect:16/9});
});
test('native 4:3 and 16:9 both preserve original stage height, BG scale, ground and bounds',()=>{
  const s=match(PRESENTATION_NATIVE);
  try{
    const d=s.match.stage.definition;
    assert.equal(d.backgroundScale,0.5,'legacy HIres stage uses half resolution BG sprites');
    assert.equal(d.camera.left,-140);
    assert.equal(d.camera.right,140);
    assert.equal(d.camera.high,-170);
    assert.equal(d.screenLeft,15);
    assert.equal(d.zoffset,220);
    assert.equal(s.match.view.displayHeight,240);
    assert.equal(s.match.view.displayWidth,320);
    assert.equal(s.match.view.groundY,220);
    assert.equal(s.snapshot().presentation,PRESENTATION_NATIVE);
    assert.equal(s.snapshot().viewport.displayWidth,320);
    assert.equal(s.snapshot().viewport.backgroundScale,.5);
    assert.deepEqual(d.starts.map(p=>p.x),[-80,80]);
    assert.equal(s.setPresentation(PRESENTATION_WIDE),PRESENTATION_WIDE);
    assert.equal(s.match.view.displayWidth,426.66666666666663);
    assert.equal(s.snapshot().viewport.displayWidth,426.66666666666663);
    assert.equal(s.match.view.displayHeight,240);
    assert.equal(s.match.view.groundY,220);
    assert.equal(s.match.stage.camera.zoom,1);
    assert.equal(s.setPresentation(PRESENTATION_NATIVE),PRESENTATION_NATIVE);
    assert.equal(s.match.view.displayWidth,320);
    assert.equal(s.setPresentation('bogus'),PRESENTATION_WIDE);
  }finally{s.close()}
});
test('native framing changes apparent camera space, not authored jump apex or vertical follow physics',()=>{
  const observations=[];
  for(const presentation of [PRESENTATION_NATIVE,PRESENTATION_WIDE]){
    const s=match(presentation);
    try{
      s.match.player.pos.x=-80;
      s.match.opponent.pos.x=80;
      s.tick(new Set(['U']));
      const fighter=s.match.player;
      assert.equal(fighter.stateNo,40,'real input enters authored normal jump startup');
      let apex=fighter.pos.y,minScreenY=Infinity,minCameraY=0;
      for(let tick=0;tick<105;tick++){
        s.tick();
        apex=Math.min(apex,fighter.pos.y);
        minScreenY=Math.min(minScreenY,fighter.pos.y-s.match.stage.camera.y);
        minCameraY=Math.min(minCameraY,s.match.stage.camera.y);
      }
      assert.equal(fighter.pos.y,0,'jump lands back at the authored ground');
      assert.ok(apex<-65,'authored jump remains visible');
      assert.ok(minCameraY < 0 && minCameraY >= -170,'stage follows the jump but observes boundhigh');
      observations.push({apex,minScreenY,minCameraY});
    }finally{s.close()}
  }
  assert.deepEqual(observations[0],observations[1]);
});
