import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';
import {TextureBudgetGovernor,GPU_MIB} from '../../src/core/texture-budget-governor.js';

function kfm(){
  return packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
}

test('R8 lazy trigger reads preserve MUGEN 1.1 scalar, AI, target and team semantics',()=>{
  const session=new CoreSession(kfm(),{mode:'cpu',level:6,endless:true});
  try{
    const p=session.match.player,other=session.match.opponent;
    const unchangedContext=p._expressionContext;
    const unchangedTyped=p._typedExpressionContext;
    for(let i=0;i<360;i++){
      session.tick();
      assert.equal(p.resolveTrigger('ailevel'),6);
      assert.equal(p.resolveTrigger('gametime'),session.match.ticks);
      assert.equal(p.resolveTrigger('roundstate'),session.match.roundFlow.roundState);
      assert.equal(p.resolveTrigger('numhelper'),p.ownedHelpers().length);
      assert.equal(p.resolveTrigger('numtarget'),p.targets.filter(t=>!t.destroyed).length);
      assert.equal(p.resolveTrigger('numexplod'),p.explods.length);
      assert.equal(p.resolveTrigger('p2dist x'),(other.pos.x-p.pos.x)*p.facing/p.coordinateScale);
      assert.equal(p.resolveTrigger('p2dist y'),(other.pos.y-p.pos.y)/p.coordinateScale);
      assert.equal(p.resolveTrigger('teammode'),'single');
      assert.equal(p.resolveTrigger('ishometeam'),1);
      assert.equal(p.resolveTrigger('numenemy'),1);
      assert.equal(p.resolveTrigger('tickspersecond'),60);
      assert.equal(p.resolveTrigger('var',[59]),p.vars[59]);
      assert.strictEqual(p._expressionContext,unchangedContext);
      assert.strictEqual(p._typedExpressionContext,unchangedTyped);
    }
  }finally{session.close();}
});

test('Nested numeric expressions preserve stable per-runtime context and restore source metadata',()=>{
  const session=new CoreSession(kfm(),{mode:'training'});
  try{
    const p=session.match.player,original=p.resolveTrigger;
    let visited=false;
    p.resolveTrigger=function(name,args,redirect,scale){
      if(name==='time'){
        visited=true;
        assert.equal(this._evaluationSource,'time+1');
        const nested=this.evaluate('life+2',null,true);
        assert.equal(nested.value,this.life+2);
        assert.equal(this._evaluationSource,'time+1');
      }
      return original.call(this,name,args,redirect,scale);
    };
    assert.equal(p.evaluate('time+1'),p.time+1);
    assert.equal(visited,true);
    assert.equal(p._evaluationSource,null);
    assert.equal(p._evaluationController,null);
  }finally{session.close();}
});

test('Bounded texture governor grows only during sustained near-capacity evictions',()=>{
  const m=new TextureBudgetGovernor();
  assert.equal(m.currentBytes,64*GPU_MIB);
  assert.equal(m.observe({frames:44,evictions:300,residentBytes:64*GPU_MIB}),64*GPU_MIB);
  assert.equal(m.observe({frames:45,evictions:300,residentBytes:30*GPU_MIB}),64*GPU_MIB);
  assert.equal(m.observe({frames:90,evictions:301,residentBytes:64*GPU_MIB}),64*GPU_MIB);
  for(let i=1;i<=4;i++)
    assert.equal(m.observe({frames:90+i*45,evictions:301+i*90,residentBytes:64*GPU_MIB+i*8*GPU_MIB}),
      (64+i*8)*GPU_MIB);
  assert.equal(m.currentBytes,96*GPU_MIB);
  assert.equal(m.upgrades,4);
  assert.equal(m.observe({frames:360,evictions:9999,residentBytes:96*GPU_MIB}),96*GPU_MIB);
});

test('Explicit texture budgets stay bounded instead of widening under pressure',()=>{
  const m=new TextureBudgetGovernor({initialBytes:12*GPU_MIB,maxBytes:12*GPU_MIB});
  assert.equal(m.observe({frames:100,evictions:2000,residentBytes:12*GPU_MIB}),12*GPU_MIB);
  assert.equal(m.upgrades,0);
  assert.equal(m.observe({frames:NaN,evictions:2000,residentBytes:12*GPU_MIB}),12*GPU_MIB);
});
