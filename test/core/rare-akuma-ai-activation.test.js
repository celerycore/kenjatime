import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../../src/formats.js';
import {legacyAIActivationVariable,authoredAIProgram} from '../../src/cpu.js';
import {parseSections} from '../../src/runtime.js';
import {CoreSession} from '../../src/core/session.js';

const encode=text=>new TextEncoder().encode(text);
const decode=bytes=>new TextDecoder().decode(bytes);
const kfm=()=>packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
function syntheticLegacy(){
 const files=kfm();
 files['kfm/kfm.cmd']=encode(decode(files['kfm/kfm.cmd'])+'\n'+
   '[Statedef -1]\n'+
   '[State -1, human]\ntype=Null\ntriggerall=var(59)<=0\ntrigger1=1\n'+
   '[State -1, cpu]\ntype=Null\ntriggerall=var(59)>=1\ntrigger1=1\n');
 files['kfm/kfm.cns']=encode(decode(files['kfm/kfm.cns'])+'\n'+
   '[Statedef -2]\n'+
   '[State -2, intro clears AI]\ntype=VarSet\ntrigger1=roundstate!=2\nv=59\nvalue=0\n');
 return files;
}
test('Detect authored classic CPU/human branches, not unrelated character variables',()=>{
 const session=new CoreSession(syntheticLegacy(),{mode:'training'});
 try{assert.equal(legacyAIActivationVariable(session.match.player.program),59);}
 finally{session.close();}
 const plain=new CoreSession(kfm(),{mode:'training'});
 try{assert.equal(legacyAIActivationVariable(plain.match.player.program),null);}
 finally{plain.close();}
});
test('Native-style CPU flag survives intro, physical keypresses and round reset without changing human AI',()=>{
 const session=new CoreSession(syntheticLegacy(),{mode:'solo',level:6});
 try{
  const human=session.match.player,cpu=session.match.opponent;
  assert.equal(human.aiLevel,0);assert.equal(cpu.aiLevel,6);
  assert.equal(human.legacyAIFlag,undefined);assert.equal(cpu.legacyAIFlag,59);
  let fightTicks=0,observedInput=0;
  for(let i=0;i<420;i++){
   session.tick();
   if(session.match.roundFlow?.roundState!==2)continue;
   fightTicks++;
   if(fightTicks===1)continue; // The transition edge occurs after fighter tick.
   assert.equal(cpu.vars[59],1,'CPU must retain the author-defined AI path');
   assert.equal(human.vars[59],0,'Human controls must remain unchanged');
   if(session.match.cpus.get(cpu).raw.size)observedInput++;
  }
  assert.ok(fightTicks>100 && observedInput>0);
  session.match.reset();
  for(let i=0;i<90;i++)session.tick();
  assert.equal(session.match.opponent.vars[59],1,'round reset restored CPU-owned AI');
 }finally{session.close();}
});
test('Normal CPU decisions request repeated real jumps and retain authored attacks',()=>{
 const session=new CoreSession(kfm(),{mode:'cpu',level:6});
 try{
  const jumps=[0,0],airborne=[0,0],last=[false,false],up=[0,0],attacks=[0,0];
  for(let i=0;i<1800;i++){
   session.tick();
   for(const [j,p] of [session.match.player,session.match.opponent].entries()){
    const jumping=p.stateNo===40;
    if(jumping&&!last[j])jumps[j]++;
    last[j]=jumping;
    if(p.pos.y < -25 && p.stateType==='A')airborne[j]++;
    if(session.match.cpus.get(p)?.raw.has('U'))up[j]++;
    if(p.moveType==='A')attacks[j]++;
   }
  }
  for(let j=0;j<2;j++){
   assert.ok(jumps[j]>=2,'P'+(j+1)+' had only '+jumps[j]+' normal jumps');
   assert.ok(up[j]>3&&airborne[j]>20,'P'+(j+1)+' never became airborne');
   assert.ok(attacks[j]>30,'P'+(j+1)+' lost attack execution');
  }
 }finally{session.close();}
});
test('Missing legacy Explod artwork is reported as a resource gap without throwing or inventing art',()=>{
 const session=new CoreSession(kfm(),{mode:'training'});
 try{
  const fighter=session.match.player;
  const controller=parseSections('[State Missing]\ntype=Explod\ntrigger1=1\nanim=4128\nid=1234')[0];
  fighter.execute({...controller,type:'explod'});
  assert.equal(fighter.explods.length,0);
  assert.ok(fighter.diagnostics.some(d=>d.type==='missing-animation'&&d.message.includes('4128')));
  assert.ok(!fighter.diagnostics.some(d=>d.type==='controller'));
 }finally{session.close();}
});

test('Authored AI and generic fighters receive separate movement policies',()=>{
 const authored=new CoreSession(syntheticLegacy(),{mode:'cpu',level:6});
 const generic=new CoreSession(kfm(),{mode:'cpu',level:6});
 try{
  assert.equal(authoredAIProgram(authored.match.player.program),true);
  assert.equal(authored.match.cpus.get(authored.match.player).authoredAI,true);
  assert.equal(authoredAIProgram(generic.match.player.program),false);
  assert.equal(generic.match.cpus.get(generic.match.player).authoredAI,false);
  const jumps=[0,0],last=[false,false];
  for(let i=0;i<1800;i++){
    authored.tick();
    for(let j=0;j<2;j++){
      const p=[authored.match.player,authored.match.opponent][j],current=p.stateNo===40;
      if(current&&!last[j])jumps[j]++;
      last[j]=current;
    }
  }
  assert.ok(jumps.every(n=>n>=4),'authored CPUs should jump repeatedly: '+jumps);
 }finally{authored.close();generic.close();}
});
