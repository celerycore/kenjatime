import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';

const sample=()=>packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));

test('Core player 1 and player 2 both jump from physical Up input',()=>{
  for(const side of [0,1]){
    const session=new CoreSession(sample(),{mode:'training',opponentPalette:1});
    try{
      const step=keys=>side===0?session.tick(new Set(keys)):session.tick(new Set(),new Set(keys));
      step(['U']);
      const actor=side===0?session.match.player:session.match.opponent;
      assert.equal(actor.stateNo,40,'Up must enter authored jump startup for P'+(side+1));
      const visited=new Set([actor.stateNo]);let apex=actor.pos.y;
      for(let i=0;i<110;i++){
        step([]);visited.add(actor.stateNo);apex=Math.min(apex,actor.pos.y);
      }
      for(const state of [40,50,52,0])
        assert.ok(visited.has(state),'P'+(side+1)+' did not reach '+state);
      assert.ok(apex < -40,'P'+(side+1)+' was not visibly airborne ('+apex+')');
      assert.equal(actor.pos.y,0);
    }finally{session.close()}
  }
});

test('Both CPUs issue Up and reach normal jump/airborne states without sacrificing combat',()=>{
  const session=new CoreSession(sample(),{mode:'cpu',level:4,opponentPalette:1});
  try{
    const metrics=[0,1].map(()=>({up:0,jumpStart:0,airborne:0,minY:0}));
    for(let i=0;i<1800;i++){
      session.tick();
      for(const [side,actor] of [session.match.player,session.match.opponent].entries()){
        const m=metrics[side],cpu=session.match.cpus.get(actor);
        if(cpu?.raw.has('U'))m.up++;
        if(actor.stateNo===40)m.jumpStart++;
        if(actor.stateType==='A'&&actor.pos.y<-10)m.airborne++;
        m.minY=Math.min(m.minY,actor.pos.y);
      }
    }
    for(const [side,m] of metrics.entries()){
      assert.ok(m.up>0,'CPU P'+(side+1)+' never pressed physical Up');
      assert.ok(m.jumpStart>0,'CPU P'+(side+1)+' never entered state 40');
      assert.ok(m.airborne>0&&m.minY<-40,'CPU P'+(side+1)+' never rose into the air');
    }
    assert.ok(session.match.player.life<1000&&session.match.opponent.life<1000,
      'Normal jumps must not eliminate ordinary combat');
  }finally{session.close()}
});
