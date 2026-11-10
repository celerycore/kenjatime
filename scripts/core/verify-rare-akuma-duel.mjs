/** Cross-generation Rare Akuma CPU/render regression. Character ZIPs remain external. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {performance} from 'node:perf_hooks';
import {packageFiles,charactersFromFiles} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';

const ticks=Number(process.env.RARE_DUEL_TICKS||3600);
const interval=Number(process.env.RARE_DUEL_FRAME_INTERVAL||120);
if(!Number.isSafeInteger(ticks)||ticks<1||ticks>18000||
  !Number.isSafeInteger(interval)||interval<1||interval>18000)
  throw Error('RARE_DUEL_TICKS and RARE_DUEL_FRAME_INTERVAL must be integers in 1..18000.');
const archives=[process.env.MUGEN_RARE_AKUMA_OLD,process.env.MUGEN_RARE_AKUMA_2026];
if(archives.some(x=>!x))throw Error('Set both MUGEN_RARE_AKUMA_OLD and MUGEN_RARE_AKUMA_2026.');
const files={},report={format:'kenjatime-rare-akuma-cross-generation-v1',
  ticks,frameInterval:interval,inputArchives:[],matches:[],
  limitations:['CPU stress is not native MUGEN/IKEMEN frame parity.',
    'Source images remain unchanged; transparent recovery is a diagnostic fallback.',
    'Both characters reside in separate virtual asset namespaces.']};
for(let i=0;i<2;i++){
  const bytes=readFileSync(resolve(archives[i])),entries=packageFiles(bytes);
  const characters=charactersFromFiles(entries),prefix=i?'imports/rare-2026/':'imports/rare-2007/';
  if(characters.length!==1||String(characters[0].def.info?.name||'').toLowerCase()!=='rare akuma')
    throw Error('Expected exactly one Rare Akuma in '+archives[i]);
  const version=String(characters[0].def.info?.versiondate||'');
  if(i===0&&!version.includes('2007')||i===1&&!version.includes('2026'))
    throw Error('Old/new Rare Akuma release labels are reversed or incorrect.');
  for(const [key,data]of Object.entries(entries)){
    const target=prefix+key;
    if(Object.hasOwn(files,target))throw Error('Duplicate virtual path '+target);
    files[target]=data;
  }
  report.inputArchives.push({version,sha256:createHash('sha256').update(bytes).digest('hex'),
    character:prefix+characters[0].path,files:Object.keys(entries).length});
}
const fxPath=process.env.MUGEN_FIGHTFX_PACK;
if(fxPath){
  const bytes=readFileSync(resolve(fxPath));
  for(const [key,data]of Object.entries(packageFiles(bytes)))files['imports/selected-fightfx/'+key]=data;
  report.commonEffectsSha256=createHash('sha256').update(bytes).digest('hex');
}
const finite=a=>[a.pos.x,a.pos.y,a.vel.x,a.vel.y,a.life,a.power].every(Number.isFinite);
for(const [index,order]of [[0,[0,1]],[1,[1,0]]]){
  const selection={character:report.inputArchives[order[0]].character,
    opponent:report.inputArchives[order[1]].character,mode:'cpu',level:4,
    ...(fxPath?{effectsPackage:'imports/selected-fightfx/'}:{})};
  const session=new CoreSession(files,selection);
  const result={order:index?'2026-v-2007':'2007-v-2026',ticksCompleted:0,
    contacts:0,maxHelpers:0,maxProjectiles:0,maxDraws:0,renderFrames:0,newAssets:0,
    playerSamples:[],resourceDiagnostics:[],runtimeDiagnostics:[],roundStates:[],error:null,
    cpuUpTicks:[0,0],jumpStarts:[0,0],airborneTicks:[0,0],
    authoredAIActiveTicks:[0,0],authoredAILegacyFlag:[null,null]};
  const runtimeIssues=new Map(),resourceIssues=new Map(),roundStates=new Set();
  const wasJumping=[false,false];
  const start=performance.now();
  try{
    for(let tick=1;tick<=ticks;tick++){
      session.tick();result.ticksCompleted=tick;
      result.contacts+=session.match.events.filter(e=>['hit','guard','reversal'].includes(e.type)).length;
      for(const [side,actor] of [session.match.player,session.match.opponent].entries()){
        if(session.match.cpus.get(actor)?.raw.has('U'))result.cpuUpTicks[side]++;
        if(actor.legacyAIFlag!==undefined){
          result.authoredAILegacyFlag[side]=actor.legacyAIFlag;
          if(actor.vars[actor.legacyAIFlag]>=1&&session.match.roundFlow?.roundState===2)
            result.authoredAIActiveTicks[side]++;
        }
        const jumping=actor.stateNo===40;
        if(jumping&&!wasJumping[side])result.jumpStarts[side]++;
        wasJumping[side]=jumping;
        if(actor.stateType==='A'&&actor.pos.y < -10)result.airborneTicks[side]++;
      }
      result.maxHelpers=Math.max(result.maxHelpers,session.match.entities.filter(e=>e.parent).length);
      result.maxProjectiles=Math.max(result.maxProjectiles,session.match.projectiles.length);
      roundStates.add(session.match.roundFlow?.roundState??2);
      for(const actor of session.match.entities)if(!finite(actor))
        throw Error('Tick '+tick+': non-finite actor '+actor.name+', id '+actor.id+', state '+actor.stateNo);
      if(tick===1||tick===ticks||tick%interval===0){
        const frame=session.frame();
        if(!Array.isArray(frame.draws)||!Array.isArray(frame.assets))throw Error('Invalid render packet');
        result.maxDraws=Math.max(result.maxDraws,frame.draws.length);
        result.newAssets+=frame.assets.length;result.renderFrames++;
        result.playerSamples.push({tick,players:session.snapshot().players.map(p=>({
          id:p.id,life:p.life,state:p.state,anim:p.anim,time:p.time,position:[p.x,p.y]}))});
        for(const issue of session.snapshot().diagnostics){
          const key=JSON.stringify(issue);
          (['sprite','sprite-incomplete','missing-sprite','missing-animation',
            'common-effects','fightfx-missing','fightfx-air','palette','missing-file'].includes(issue.type)
            ?resourceIssues:runtimeIssues).set(key,issue);
        }
      }
    }
  }catch(error){result.error=String(error?.stack||error);}
  finally{session.close();}
  result.wallTimeMs=Math.round((performance.now()-start)*100)/100;
  result.roundStates=[...roundStates].sort((a,b)=>a-b);
  result.resourceDiagnostics=[...resourceIssues.values()];
  result.runtimeDiagnostics=[...runtimeIssues.values()];
  report.matches.push(result);
}
report.summary={
  bothOrdersCompleted:report.matches.every(m=>m.ticksCompleted===ticks&&!m.error),
  bothVersionsJumped:report.matches.every(m=>m.jumpStarts.every(n=>n>0)&&m.airborneTicks.every(n=>n>0)),
  totalContacts:report.matches.reduce((n,m)=>n+m.contacts,0),
  maxHelpers:Math.max(...report.matches.map(m=>m.maxHelpers)),
  maxProjectiles:Math.max(...report.matches.map(m=>m.maxProjectiles)),
  runtimeDiagnosticKinds:[...new Set(report.matches.flatMap(m=>m.runtimeDiagnostics.map(d=>d.type)))],
  legacyAIActivated:report.matches.every(m=>m.authoredAIActiveTicks.some(n=>n>500)),
  resourceDiagnosticKinds:[...new Set(report.matches.flatMap(m=>m.resourceDiagnostics.map(d=>d.type)))],
  errors:report.matches.filter(m=>m.error).map(m=>({order:m.order,error:m.error})),
};
const output=resolve(process.env.RARE_DUEL_OUTPUT||'work/core/rare-akuma-dual-compat.json');
mkdirSync(dirname(output),{recursive:true});
writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,versions:report.inputArchives.map(a=>a.version),
  summary:report.summary,results:report.matches.map(m=>({
    order:m.order,contacts:m.contacts,maxHelpers:m.maxHelpers,
    maxProjectiles:m.maxProjectiles,maxDraws:m.maxDraws,newAssets:m.newAssets,
    renderFrames:m.renderFrames,cpuUpTicks:m.cpuUpTicks,jumpStarts:m.jumpStarts,
    airborneTicks:m.airborneTicks,authoredAIActiveTicks:m.authoredAIActiveTicks,
    authoredAILegacyFlag:m.authoredAILegacyFlag,wallTimeMs:m.wallTimeMs}))}));
if(process.env.RARE_DUEL_STRICT==='1'&&
  (!report.summary.bothOrdersCompleted||report.summary.runtimeDiagnosticKinds.length||
   process.env.RARE_DUEL_REQUIRE_JUMPS==='1'&&!report.summary.bothVersionsJumped ||
   process.env.RARE_DUEL_REQUIRE_AUTHORED_AI==='1'&&!report.summary.legacyAIActivated))process.exitCode=1;
