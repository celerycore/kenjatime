import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';

const enc=s=>new TextEncoder().encode(s);
const dec=b=>new TextDecoder().decode(b);
const kfm=()=>packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));

function sameNamedFighters(){
  const files={},source=kfm();
  for(const [scope,id] of [['imports/old/',7100],['imports/new/',7200]]){
    for(const [path,bytes] of Object.entries(source))files[scope+path]=bytes;
    const def=scope+'kfm/kfm.def',state=scope+'kfm/kfm.cns';
    files[def]=enc(dec(source['kfm/kfm.def'])
      .replace('name = "Kung Fu Man"','name = "Rare Akuma"')
      .replace('displayname = "Kung Fu Man"','displayname = "Rare Akuma"'));
    files[state]=enc(dec(source['kfm/kfm.cns'])+
      '\n[Statedef '+id+']\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n');
  }
  return files;
}
test('Same-display-name MUGEN versions isolate states, sprites and inputs in both player orders',()=>{
  const files=sameNamedFighters(),old='imports/old/kfm/kfm.def',recent='imports/new/kfm/kfm.def';
  for(const [first,second,firstID,secondID] of [[old,recent,7100,7200],[recent,old,7200,7100]]){
    const session=new CoreSession(files,{character:first,opponent:second,mode:'training'});
    try{
      const [a,b]=[session.match.player,session.match.opponent];
      assert.equal(a.name,b.name);
      assert.notEqual(a.program,b.program);
      assert.ok(a.program.states.has(firstID));
      assert.ok(!a.program.states.has(secondID));
      assert.ok(b.program.states.has(secondID));
      assert.ok(!b.program.states.has(firstID));
      assert.notEqual(session.match.inputBuffers.get(a),session.match.inputBuffers.get(b));
      assert.equal(a.changeState(firstID),true);
      assert.equal(b.changeState(secondID),true);
      for(let n=0;n<8;n++)session.tick();
      assert.equal(a.stateNo,firstID);
      assert.equal(b.stateNo,secondID);
      const frame=session.frame();
      assert.ok(frame.draws.length>0&&frame.draws.length<=8192);
      assert.ok(!session.snapshot().diagnostics.some(d=>d.type==='unsupported-controller'));
    }finally{session.close()}
  }
});
