/** Optional 2026 IKEMEN GO ZSS Rare Akuma compatibility probe. Original ZIP is external. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {packageFiles,charactersFromFiles} from '../../src/formats.js';
import {parseProgram,supportedControllers} from '../../src/runtime.js';
import {CoreSession} from '../../src/core/session.js';
import {characterSpriteBank} from '../../src/palettes.js';
if(!process.env.MUGEN_RARE_AKUMA)throw Error('Set MUGEN_RARE_AKUMA to original June 2026 RareAkuma.zip');
const zip=readFileSync(process.env.MUGEN_RARE_AKUMA),files=packageFiles(zip);
const rare=charactersFromFiles(files).find(c=>String(c.def.info?.name||'').toLowerCase()==='rare akuma');
if(!rare)throw Error('2026 Rare Akuma DEF is not in this ZIP');
const program=parseProgram(rare,{constantsFromCnsOnly:true});
if(!program.states.has(-4))throw Error('Expected IKEMEN GO global state -4; this is not the 2026 benchmark archive');
const ticks=Number(process.env.RARE_AKUMA_TICKS||8);
if(!Number.isSafeInteger(ticks)||ticks<1||ticks>120)throw Error('RARE_AKUMA_TICKS must be 1..120');
const shards=Number(process.env.RARE_AKUMA_SHARDS||1),shard=Number(process.env.RARE_AKUMA_SHARD||0);
if(!Number.isSafeInteger(shards)||shards<1||shards>32||!Number.isSafeInteger(shard)||shard<0||shard>=shards)throw Error('Invalid shard');
const assets=characterSpriteBank(rare),spritePairs=new Set(assets.sprites.map(s=>s.group+','+s.number));
const effectiveActions=new Map(rare.animations.map(a=>[a.id,a]));
const report={format:'kenjatime-rare-akuma-2026-ikemen-v1',version:rare.def.info.versiondate,
 archiveSha256:createHash('sha256').update(zip).digest('hex'),shards,shard,ticks,
 states:[],helpers:[],animations:[],sprites:[],cpu:null,
 authoredStates:[...program.states.keys()].sort((a,b)=>a-b),
 controllerTypes:[...program.controllerTypes].sort(),parseDiagnostics:program.diagnostics,
 limitations:['Forced entry is not natural move reachability','No native IKEMEN frame parity','Missing SFF images are original archive defects','Shared fightfx/common1.cns not bundled by character']};
for(let i=0;i<assets.sprites.length;i++){
 const p=assets.sprites[i],entry={i,pair:p.group+','+p.number,error:null};
 try{const d=assets.decodeIndexed?.(i)||assets.decode(i);if(!d.w||!d.h||(!d.indices&&!d.rgba))throw Error('Empty decoded image');}
 catch(e){entry.error=e.message;}
 report.sprites.push(entry);
}
const all={...packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url))),...files};
const session=new CoreSession(all,{character:rare.path,opponent:'kfm/kfm.def',mode:'training'});
const finite=a=>[a.pos.x,a.pos.y,a.vel.x,a.vel.y,a.life,a.power].every(Number.isFinite);
try{
 for(const action of effectiveActions.values()){
  const missing=action.frames.filter(fr=>fr.group>=0&&!spritePairs.has(fr.group+','+fr.number)).map(fr=>fr.group+','+fr.number);
  const result={id:action.id,frames:action.frames.length,missingPairs:missing,visibleFrames:action.frames.filter(fr=>fr.group>=0).length,
   changed:false,clockTicks:0,error:null};
  try{
   session.match.reset();const a=session.match.player;result.changed=a.changeAnimation(action.id);
   session.frame();
   for(let i=0;i<120;i++){a.advanceAnimation();result.clockTicks++;if(a.frameIndex<0||a.frameIndex>=action.frames.length)throw Error('Animation frame cursor out of bounds');}
  }catch(e){result.error=e.message;}
  report.animations.push(result);
 }
 let i=0;
 for(const [id,definition] of program.states){
  if(id<0)continue;
  if(i++%shards!==shard)continue;
  const result={id,source:definition.source,ticks:0,diagnostics:[],error:null};
  try{
   session.match.reset();const actor=session.match.player;actor.power=actor.maxPower;
   const before=session.match.diagnostics.length;
   if(!actor.changeState(id,0,actor))throw Error('Cannot enter state');
   for(let t=0;t<ticks;t++){session.tick();result.ticks++;if(!finite(actor))throw Error('Non-finite root actor');}
   result.diagnostics=session.match.diagnostics.slice(before);
  }catch(e){result.error=e.message;}
  report.states.push(result);
 }
 i=0;
 for(const [id,definition] of program.states){
  if(!definition.source.toLowerCase().endsWith('helper.zss'))continue;
  if(i++%shards!==shard)continue;
  const result={id,ticks:0,diagnostics:[],error:null};
  try{
   session.match.reset();const before=session.match.diagnostics.length;
   const helper=session.match.spawnHelper(session.match.player,{id,stateno:id,keyctrl:0});
   if(!helper)throw Error('Cannot spawn helper');
   for(let t=0;t<ticks;t++){session.tick();result.ticks++;if(!helper.destroyed&&!finite(helper))throw Error('Non-finite helper');}
   result.diagnostics=session.match.diagnostics.slice(before);
  }catch(e){result.error=e.message;}
  report.helpers.push(result);
 }
}finally{session.close();}
report.summary={
 authoredStates:report.authoredStates.length,negativeGlobals:report.authoredStates.filter(n=>n<0).length,
 stateCount:report.states.length,statePass:report.states.filter(s=>s.ticks===ticks&&!s.error).length,
 helperCount:report.helpers.length,helperPass:report.helpers.filter(s=>s.ticks===ticks&&!s.error).length,
 animationCount:report.animations.length,animationPass:report.animations.filter(a=>a.changed&&a.clockTicks===120&&!a.error).length,
 spriteCount:report.sprites.length,spriteDecodeFailures:report.sprites.filter(s=>s.error),
 unsupportedControllers:report.controllerTypes.filter(t=>!supportedControllers.has(t)),
 fatalParseDiagnostics:report.parseDiagnostics.filter(d=>d.fatal)};
const out=resolve(process.env.CORE_RARE_2026_OUTPUT||'work/core/rare-akuma-2026.json');
mkdirSync(dirname(out),{recursive:true});writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({out,summary:report.summary}));
if(process.env.RARE_AKUMA_STRICT==='1'&&(report.summary.statePass!==report.summary.stateCount||
 report.summary.helperPass!==report.summary.helperCount||
 report.summary.animationPass!==report.summary.animationCount||
 report.summary.unsupportedControllers.length||report.summary.fatalParseDiagnostics.length))process.exitCode=1;
