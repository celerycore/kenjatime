/** Synthetic CLI smoke test ONLY; never replaces the three real archives. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {unzipSync} from 'fflate';

const root=fileURLToPath(new URL('../../',import.meta.url));
const decode=bytes=>new TextDecoder().decode(bytes);
const encode=str=>new TextEncoder().encode(str);
test('Three-package runtime CLI accepts distinct self-contained KFM-derived fixtures',()=>{
  const tmp=mkdtempSync(join(tmpdir(),'kenjatime-trio-fixture-'));
  try{
    const source=unzipSync(readFileSync(resolve(root,'public/kfm.zip')));
    const key=Object.keys(source).find(name=>name.toLowerCase()==='kfm/kfm.def');
    assert.ok(key,'bundled KFM DEF must be present');
    const paths=[];
    for(const [folder,name] of [['rare2026','Rare Akuma'],['rare2007','Rare Akuma'],['donald','Dark Donald']]){
      const dir=join(tmp,folder);mkdirSync(dir,{recursive:true});paths.push(dir);
      for(const [original,data] of Object.entries(source)){
        if(!original.toLowerCase().startsWith('kfm/')||original.endsWith('/'))continue;
        const rel=original.slice(4),dest=join(dir,rel);
        mkdirSync(dirname(dest),{recursive:true});
        if(original===key){
          const text=decode(data);
          assert.match(text,/^\s*name\s*=/im);
          writeFileSync(dest,encode(text.replace(/^(\s*name\s*=).*$/im,'$1 "'+name+'"')));
        }else writeFileSync(dest,data);
      }
    }
    // Exercise the optional matched fightfx import with synthetic assets.
    // Actual official engine art stays outside the repository.
    const effects=join(tmp,'native-fx');
    mkdirSync(effects);
    writeFileSync(join(effects,'fightfx.air'),encode(
      '[Begin Action 2]\\n0,0,0,0,-1\\n[Begin Action 60]\\n0,0,0,0,-1\\n'
    ));
    writeFileSync(join(effects,'fightfx.sff'),source['kfm/kfm.sff']);
    const output=join(tmp,'results.json');
    const child=spawnSync(process.execPath,[
      resolve(root,'scripts/core/verify-character-trio.mjs'),...paths,
      '--ticks=2','--runs=1','--render','--fightfx-dir='+effects,'--output='+output,'--strict'
    ],{cwd:root,encoding:'utf8',timeout:120000,maxBuffer:1048576*4});
    assert.equal(child.status,0,[child.stdout,child.stderr].join('\n').slice(-5000));
    const report=JSON.parse(readFileSync(output,'utf8'));
    assert.equal(report.results.length,3);
    assert.ok(report.matchedFightFx?.sha256?.['fightfx.air']);
    assert.ok(report.matchedFightFx?.sha256?.['fightfx.sff']);
    for(const item of report.results){
      assert.equal(item.deterministic,true,item.label);
      assert.equal(item.runs.length,1);
      assert.equal(item.runs[0].pass,true);
      assert.equal(item.runs[0].renderedFrames,1);
    }
  }finally{rmSync(tmp,{recursive:true,force:true});}
});
