import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {packageFiles} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';
import {firstPaletteByIndex} from '../../src/core/palette-index.js';

test('First-match indexed SFF palette lookup preserves duplicate palette precedence',()=>{
  const first={index:5,group:1,number:1,colors:[1,2,3]};
  const duplicate={index:5,group:1,number:2,colors:[6,7,8]};
  const another={index:9,group:2,number:1,colors:[9]};
  const bank=[first,duplicate,another];
  const indexed=firstPaletteByIndex(bank);
  assert.strictEqual(indexed.get(5),bank.find(p=>p.index===5));
  assert.strictEqual(indexed.get(9),bank.find(p=>p.index===9));
  assert.equal(indexed.get(12),undefined);
  assert.equal(indexed.size,2);
});

test('KFM CoreSession SFF palette index matches the original linear search on every bank sprite',()=>{
  const files=packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
  const session=new CoreSession(files,{mode:'cpu',level:6,endless:true});
  try{
    session.tick();session.frame();
    assert.ok(session.banks.size>0,'sprite banks are loaded');
    for(const [resource,bank] of session.banks){
      const indexed=session.paletteIndices.get(resource);
      assert.ok(indexed instanceof Map);
      for(const sprite of bank.sprites){
        const old=bank.palettes?.find(p=>p.index===sprite.palette);
        assert.strictEqual(indexed.get(sprite.palette),old);
      }
    }
    // New palette index lives only for the duration of this match.
    assert.ok(session.paletteIndices.size>0);
  }finally{session.close();}
  assert.equal(session.paletteIndices.size,0);
});

test('Palette map remains stable when list and expected palette are absent',()=>{
  assert.equal(firstPaletteByIndex().size,0);
  assert.equal(firstPaletteByIndex([]).size,0);
});
