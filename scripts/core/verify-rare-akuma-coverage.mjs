/** Read-only, opt-in Rare Akuma smoke benchmark. Not native MUGEN parity. 
 * MUGEN_RARE_AKUMA='/path/Rare Akuma.zip' node scripts/core/verify-rare-akuma-coverage.mjs
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {packageFiles,charactersFromFiles,decodeText} from '../../src/formats.js';
import {parseSections,supportedControllers} from '../../src/runtime.js';
import {CoreSession} from '../../src/core/session.js';

if(!process.env.MUGEN_RARE_AKUMA) throw Error('Set MUGEN_RARE_AKUMA to your local Rare Akuma ZIP.');
const ticks=Number(process.env.RARE_AKUMA_TICKS||2);
if(!Number.isSafeInteger(ticks)||ticks<1||ticks>8) throw Error('RARE_AKUMA_TICKS must be 1..8.');
const archive=readFileSync(process.env.MUGEN_RARE_AKUMA);
const rareFiles=packageFiles(archive);
const rare=charactersFromFiles(rareFiles).find(c=>
  String(c.def.info?.name||'').replace(/[^a-z0-9]/gi,'').toLowerCase()==='rareakuma');
if(!rare) throw Error('No playable [Info] name=Rare Akuma in this archive.');
const files={...packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url))),...rareFiles};
const authored=new Map(), types=new Map(), spawnSites=[];
for(const check of rare.checks){
  if(!check.ok||!/^(?:cns|cmd|st\d*)$/.test(check.key)) continue;
  let state=null;
  for(const section of parseSections(decodeText(rareFiles[check.path]),check.path)){
    const definition=/^statedef\s+(-?\d+)$/.exec(section.name);
    if(definition){
      state=Number(definition[1]);
      if(authored.has(state)) throw Error('Duplicate authored state '+state);
      authored.set(state,{file:check.path,line:section.line});
    }else if(/^state(?:\s|$)/.test(section.name)&&state!==null){
      const type=String(section.values.type||'').replace(/^"|"$/g,'').toLowerCase();
      types.set(type,(types.get(type)||0)+1);
      if(type==='helper')spawnSites.push({state,file:check.path,line:section.line,
        target:/^-?\d+$/.test(section.values.stateno||'')?Number(section.values.stateno):null});
    }
  }
}
const report={
  format:'kenjatime-core-rare-akuma-coverage-v1',
  archiveSha256:createHash('sha256').update(archive).digest('hex'),
  archiveBytes:archive.length,
  character:rare.path,
  ticksPerProbe:ticks,
  sourceResources:rare.checks.map(({key,path,ok})=>({key,path,ok})),
  controllerTypes:[...types.keys()].sort(),
  unsupportedControllers:[...types.keys()].filter(t=>!supportedControllers.has(t)).sort(),
  authoredStateIds:[...authored.keys()].sort((a,b)=>a-b),
  spawnSites,
  parseDiagnostics:[],
  states:[],
  helpers:[],
  animations:[],
  limitations:[
    'Short forced state/helper entry is not full natural command/trigger reachability.',
    'Global -1/-2/-3 run through tick scheduling and cannot be entered through ChangeState.',
    'Missing AIR sprite references belong to the supplied source archive.',
    'No official MUGEN or IKEMEN native Rare Akuma per-frame reference is compared.',
    'No browser GPU FPS, visual pixel or real-device sound verification is performed.'
  ]
};
const session=new CoreSession(files,{character:rare.path,opponent:'kfm/kfm.def',mode:'training'});
try{
  const actor=session.match.player,resource=actor.character;
  report.parseDiagnostics=[...actor.program.diagnostics];
  for(const id of authored.keys())if(!actor.program.states.has(id))
    report.parseDiagnostics.push({type:'missing-compiled-state',id});
  session.bank(resource);
  const spritePairs=session.indices.get(resource);
  // Map agrees with FighterRuntime: the last duplicate AIR action wins.
  const effectiveAnimations=new Map(resource.animations.map(action=>[action.id,action]));
  for(const action of effectiveAnimations.values()){
    const result={id:action.id,frames:action.frames.length,missingSourceSprites:0,
      decodedSample:false,changed:false,packet:false,error:null};
    const present=[];
    for(const frame of action.frames){
      if(frame.group<0)continue;
      if(!spritePairs.has(frame.group+','+frame.number))result.missingSourceSprites++;
      else present.push(frame);
    }
    try{
      if(present.length){
        const decoded=session.asset(resource,present[0],new Map());
        result.decodedSample=!!decoded&&decoded.w>0&&decoded.h>0;
      }
      session.match.reset();
      result.changed=session.match.player.changeAnimation(action.id);
      result.packet=Array.isArray(session.frame()?.draws);
    }catch(error){result.error=String(error?.stack||error);}
    report.animations.push(result);
    session.assets=[];
  }
  for(const [id,origin] of authored){
    if(id<0){report.states.push({id,...origin,mode:'scheduled',passed:null});continue;}
    const result={id,...origin,mode:'forced-root',passed:false,finalState:null,
      helpers:0,projectiles:0,error:null};
    try{
      session.match.reset();
      const player=session.match.player;
      player.life=player.maxLife;
      player.power=player.maxPower;
      if(!player.changeState(id,0,player))throw Error('ChangeState rejected '+id);
      for(let n=0;n<ticks;n++)session.tick();
      result.passed=true;
      result.finalState=player.stateNo;
      result.helpers=session.match.entities.filter(p=>p.parent).length;
      result.projectiles=session.match.projectiles.length;
    }catch(error){result.error=String(error?.stack||error);}
    report.states.push(result);
  }
  const helperFile=rare.checks.find(c=>c.key==='st4'&&c.ok)?.path;
  const ids=[...authored].filter(([,origin])=>origin.file===helperFile).map(([id])=>id).sort((a,b)=>a-b);
  for(const id of ids){
    const result={id,created:false,ticked:false,authorDestroyed:false,error:null};
    try{
      session.match.reset();
      const helper=session.match.spawnHelper(session.match.player,{id,stateno:id,keyctrl:0});
      if(!helper)throw Error('SpawnHelper returned null');
      result.created=true;
      for(let n=0;n<ticks;n++)session.tick();
      result.ticked=true;
      result.authorDestroyed=!!helper.destroyed; // intentional DestroySelf is not failure
    }catch(error){result.error=String(error?.stack||error);}
    report.helpers.push(result);
  }
}finally{session.close();}
const failingDiagnostics=report.parseDiagnostics.filter(d=>d.fatal||d.type==='unsupported-controller'||d.type==='missing-compiled-state');
report.summary={
  authoredStates:report.authoredStateIds.length,
  globalScheduledStates:report.states.filter(x=>x.mode==='scheduled').length,
  statesSmokePassed:report.states.filter(x=>x.mode==='forced-root'&&x.passed).length,
  statesAttempted:report.states.filter(x=>x.mode==='forced-root').length,
  helperSmokePassed:report.helpers.filter(x=>x.ticked).length,
  helpersAttempted:report.helpers.length,
  uniqueAnimations:report.animations.length,
  animationsAccepted:report.animations.filter(x=>x.changed&&x.packet&&!x.error).length,
  animationsWithMissingSourceSprites:report.animations.filter(x=>x.missingSourceSprites>0).length,
  animationsWithDecodedSample:report.animations.filter(x=>x.decodedSample).length,
  recognizedControllerTypes:report.controllerTypes.length-report.unsupportedControllers.length,
  unsupportedControllerTypes:report.unsupportedControllers.length,
  fatalOrUnsupportedParseDiagnostics:failingDiagnostics.length,
  stateFailures:report.states.filter(x=>x.error).length,
  helperFailures:report.helpers.filter(x=>x.error).length,
  animationFailures:report.animations.filter(x=>x.error).length
};
const output=resolve(process.env.CORE_RARE_COVERAGE_OUTPUT||'work/core/rare-akuma-coverage.json');
mkdirSync(dirname(output),{recursive:true});
writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,archiveSha256:report.archiveSha256,summary:report.summary}));
if(process.env.RARE_AKUMA_STRICT==='1'&&(
  report.summary.statesSmokePassed!==report.summary.statesAttempted||
  report.summary.helperSmokePassed!==report.summary.helpersAttempted||
  report.summary.animationsAccepted!==report.summary.uniqueAnimations||
  report.summary.unsupportedControllerTypes||failingDiagnostics.length))
  process.exitCode=1;
