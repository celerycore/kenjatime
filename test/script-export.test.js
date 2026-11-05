import {test} from 'node:test';
import assert from 'node:assert/strict';
import {zipSync,unzipSync,strToU8,strFromU8} from 'fflate';
import {archive} from '../src/formats.js';
import {characterScriptArchive} from '../src/script-export.js';

test('analysis export retains resolved character scripts and reference evidence while omitting media and unrelated characters',()=>{
  const [c]=archive(zipSync({'hero/hero.def':strToU8('[Info]\nname=Study\nauthor=Creator\n[Files]\nsprite=hero.sff\ncmd=hero.cmd\nst=../states/main.txt\nanim=hero.air\nsound=hero.snd\nstcommon=../../missing.cns'),'hero/hero.sff':new Uint8Array([1]),'hero/hero.snd':new Uint8Array([2]),'hero/hero.cmd':strToU8('[Command]\nname=x\ncommand=x'),'states/main.txt':strToU8('[Statedef 0]'),'hero/hero.air':strToU8('[Begin Action 0]\n0,0,0,0,-1'),'unrelated.cns':strToU8('unrelated')}));
  const files=unzipSync(characterScriptArchive(c));assert.deepEqual(Object.keys(files).sort(),['character-analysis.json','hero/hero.air','hero/hero.cmd','hero/hero.def','states/main.txt']);
  const report=JSON.parse(strFromU8(files['character-analysis.json']));assert.equal(report.name,'Study');assert.equal(report.author,'Creator');assert.equal(report.references.find(r=>r.key==='stcommon').ok,false);assert.equal(report.archiveFiles.find(f=>f.path==='hero/hero.sff').bytes,1);assert.match(report.note,/not a playable/);
});
