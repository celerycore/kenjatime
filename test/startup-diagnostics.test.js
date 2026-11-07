import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createStartupDiagnostics} from '../src/startup-diagnostics.js';
import {libraryDeadline} from '../src/library-recovery.js';

function memory(){const map=new Map();return{getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};}
test('startup reports preserve phase timings and interrupted launch history without leaking payloads',()=>{
 const storage=memory();let time=0;
 const first=createStartupDiagnostics({storage,now:()=>time,wall:()=>0});
 const step=first.begin('library-open');time=80;step.note({fromVersion:1,toVersion:2,password:'secret',archiveName:'private.rar',payload:new Uint8Array(100)});first.persist();first.dispose();
 const second=createStartupDiagnostics({storage,now:()=>time,wall:()=>1000});second.metrics({packages:25});time=110;second.finish('ready');second.persist();
 const report=second.snapshot();assert.equal(report.sessions[1].status,'interrupted');assert.equal(report.sessions[1].phases[0].durationMs,80);assert.equal(report.sessions[0].elapsedMs,30);assert.equal(report.sessions[0].metrics.packages,25);
 assert.ok(!JSON.stringify(report).includes('secret'));assert.ok(!JSON.stringify(report).includes('private.rar'));assert.ok(!JSON.stringify(report).includes('payload'));
 second.dispose();
});
test('startup phase failures distinguish timeouts and blocked upgrades without retaining error messages',async()=>{
 const d=createStartupDiagnostics({storage:memory()});
 await assert.rejects(()=>d.measure('library-open',()=>libraryDeadline(new Promise(()=>{}),'contains private filename',5)),/private filename/);
 const block=d.begin('library-read');block.fail(Object.assign(Error('private archive name'),{code:'library-blocked'}));d.finish('degraded');
 const report=d.snapshot();assert.equal(report.sessions[0].phases[0].status,'timed-out');assert.equal(report.sessions[0].phases[1].status,'blocked');assert.ok(!JSON.stringify(report).includes('private'));
 d.dispose();
});
test('diagnostics remain bounded and usable with full or damaged report storage',()=>{
 const d=createStartupDiagnostics({storage:{getItem:()=>'{bad json',setItem(){throw Error('quota');}}});
 for(let i=0;i<200;i++)d.begin('library-open').end();d.persist();assert.equal(d.snapshot().sessions[0].phases.length,48);assert.equal(d.snapshot().sessions[0].persistenceAvailable,false);d.dispose();
 const storage=memory();for(let i=0;i<6;i++){const r=createStartupDiagnostics({storage});r.finish();r.persist();r.dispose();}
 const last=createStartupDiagnostics({storage});assert.equal(last.snapshot().sessions.length,3);last.dispose();
});
