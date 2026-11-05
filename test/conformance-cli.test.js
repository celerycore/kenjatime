import {test} from 'node:test';
import assert from 'node:assert/strict';
import {auditCompatibility} from '../scripts/compatibility-audit.mjs';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

test('audit CLI replays real CMD input, compares regression baselines and preserves mismatching evidence',()=>{
  const folder=mkdtempSync(join(tmpdir(),'mugen-conformance-')),file=join(folder,'trace.json'),comparison=join(folder,'comparison.json');
  try{
    auditCompatibility(['--output',file]);const baseline=JSON.parse(readFileSync(file));
    assert.equal(baseline.samples.at(-1).opponent.life,977);assert.equal(baseline.comparison.native,false);
    assert.deepEqual(baseline.combatRules,{attackLifeToPower:.7,getHitLifeToPower:.6,superTargetDefence:1.5});
    assert.ok(baseline.samples.some(sample=>sample.player.uniqHitCount===1));
    assert.equal(baseline.samples.at(-1).player.uniqHitCount,0);
    assert.equal(typeof baseline.samples.at(-1).opponent.damageMultipliers.fallDefence,'number');
    auditCompatibility(['--baseline',file,'--output',comparison]);assert.equal(JSON.parse(readFileSync(comparison)).comparison.status,'matched');
    baseline.samples.at(-1).opponent.life=1000;baseline.samples[0].player.variables.int[0]=123;writeFileSync(file,JSON.stringify(baseline));
    assert.equal(auditCompatibility(['--baseline',file,'--output',comparison]).comparison.status,'different');
    const differences=JSON.parse(readFileSync(comparison)).comparison;assert.equal(differences.native,false);assert.ok(differences.differences.some(item=>item.path==='opponent.life'));assert.ok(differences.differences.some(item=>item.path==='player.variables.int.0'));
    const original=readFileSync(file,'utf8');assert.throws(()=>auditCompatibility(['--baseline',file,'--output',file]),/different from/);assert.equal(readFileSync(file,'utf8'),original);
    baseline.provenance={kind:'native-mugen'};writeFileSync(file,JSON.stringify(baseline));assert.throws(()=>auditCompatibility(['--baseline',file,'--output',comparison]),/version and capture method/);
  }finally{rmSync(folder,{recursive:true,force:true});}
});
