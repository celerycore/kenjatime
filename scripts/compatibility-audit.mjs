import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {archive,animations,decodeText} from '../src/formats.js';
import {TrainingMatch} from '../src/combat.js';
import {CommandBuffer} from '../src/commands.js';
import {characterCommands} from '../src/cpu.js';
import {COMMON_STATES} from '../src/common.js';
import {stageDefinitions} from '../src/stages.js';
import {compareTrace} from '../src/conformance.js';

const root=fileURLToPath(new URL('../',import.meta.url)),hash=value=>createHash('sha256').update(value).digest('hex');
export function auditCompatibility(args=[]){
  const options={archive:resolve(root,'public/kfm.zip'),scenario:resolve(root,'test/fixtures/compatibility/kfm-punch.json'),output:resolve(root,'work/compatibility-report.json')};
  for(let i=0;i<args.length;i+=2){const key=args[i].replace(/^--/,'');if(!['archive','scenario','output','baseline'].includes(key)||!args[i+1])throw Error('Use --archive ZIP --scenario JSON --output JSON [--baseline JSON].');options[key]=resolve(args[i+1]);}
  if(options.baseline===options.output)throw Error('Output must be different from the baseline file.');
  const bytes=readFileSync(options.archive),scenarioBytes=readFileSync(options.scenario),scenario=JSON.parse(scenarioBytes),characters=archive(new Uint8Array(bytes));
  if(typeof scenario.id!=='string'||!scenario.id||!Array.isArray(scenario.inputs)||!Array.isArray(scenario.samples))throw Error('Scenario requires id, inputs and sample ticks.');
  const wanted=scenario.samples,total=scenario.inputs.reduce((sum,input)=>sum+input.ticks,0);
  if(!Number.isSafeInteger(total)||total<1||total>36000||scenario.inputs.some(input=>!Number.isSafeInteger(input.ticks)||input.ticks<1)||wanted.some(tick=>!Number.isSafeInteger(tick)||tick<0||tick>total)||new Set(wanted).size!==wanted.length)throw Error('Scenario tick counts exceed supported bounds or duplicate samples.');
  const inputKeys=new Set(['U','D','L','R','a','b','c','x','y','z','s']);for(const input of scenario.inputs)for(const side of ['player','opponent'])if(input[side]!==undefined&&(!Array.isArray(input[side])||input[side].some(key=>!inputKeys.has(key))))throw Error('Scenario inputs must contain physical MUGEN input keys.');
  const select=path=>path?characters.find(character=>character.path===path):characters[0],player=select(scenario.player),opponent=scenario.opponent?select(scenario.opponent):player;
  if(!player||!opponent)throw Error('Scenario character definition was not found.');
  const files=player.files,commonPath=Object.keys(files).find(path=>path.endsWith('/data/fightfx.air')||path==='data/fightfx.air');
  const commonAnimations=new Map((commonPath?animations(decodeText(files[commonPath])):[]).map(animation=>[animation.id,animation]));
  const stage=scenario.stage?stageDefinitions(files).find(stage=>stage.path===scenario.stage):null;if(scenario.stage&&!stage)throw Error('Scenario stage was not found.');
  const match=new TrainingMatch(player,{opponentCharacter:opponent,commonText:COMMON_STATES,commonAnimations,initialize:false,stage,pushboxes:scenario.pushboxes!==false,rules:scenario.rules||null});
  for(const [side,setup]of Object.entries(scenario.setup||{})){
    if(!['player','opponent'].includes(side))throw Error('Setup side must be player or opponent.');const fighter=match[side];
    for(const [key,value]of Object.entries(setup)){if(key==='pos'){if(!Number.isFinite(value.x)||!Number.isFinite(value.y))throw Error('Setup positions must be finite.');fighter.pos={...value};}else if(['facing','life','power'].includes(key)&&Number.isFinite(value))fighter[key]=value;else if(key==='stateNo'&&Number.isInteger(value)){if(!fighter.changeState(value))throw Error('Setup state was not found.');}else throw Error('Unsupported scenario setup field: '+key);}
  }
  const buffers=[player,opponent].map(character=>new CommandBuffer(characterCommands(character))),samples=[],fields=fighter=>({stateNo:fighter.stateNo,prevStateNo:fighter.prevStateNo,ctrl:fighter.ctrl,stateType:fighter.stateType,moveType:fighter.moveType,physics:fighter.physics,variables:{int:[...fighter.vars],float:[...fighter.fvars],systemInt:[...fighter.sysvars],systemFloat:[...fighter.sysfvars]},stateOwner:fighter.stateOwner.id,anim:fighter.anim,time:fighter.time,pos:{...fighter.pos},vel:{...fighter.vel},facing:fighter.facing,life:fighter.life,power:fighter.power,coordinateScale:fighter.coordinateScale,hitTime:fighter.hitTime,hitPauseTime:fighter.hitPauseTime,getHitVars:{...fighter.getHitVars},hitCount:fighter.hitCount,uniqHitCount:fighter.uniqHitCount,comboHits:fighter.comboHits,moveContact:fighter.moveContact,moveHit:fighter.moveHit,moveGuarded:fighter.moveGuarded,moveReversed:fighter.moveReversed||0,damageMultipliers:{attack:fighter.attackMultiplier,defence:fighter.defenceMultiplier,fallDefence:fighter._fallDefenceMultiplier},targets:fighter.targets.map(target=>target.id)});
  const capture=()=>{if(wanted.includes(match.ticks))samples.push({tick:match.ticks,player:fields(match.player),opponent:fields(match.opponent),contacts:match.events.map(event=>({type:event.type,attacker:event.attacker.id,defender:event.defender.id,damage:event.damage})),round:match.roundFlow?{roundNo:match.roundFlow.roundNo,phase:match.roundFlow.roundState,wins:{...match.roundFlow.wins}}:null});};
  capture();for(const input of scenario.inputs)for(let tick=0;tick<input.ticks;tick++){const one=new Set(input.player||[]),two=new Set(input.opponent||[]);match.tick(buffers[0].update(one,match.player.facing),buffers[1].update(two,match.opponent.facing),{playerInput:one,opponentInput:two});capture();}
  const report={schemaVersion:1,completeCompatibility:false,combatRules:{...match.combatRules},provenance:{kind:'web-runtime',engine:'MUGEN Web Lab'},archiveSha256:hash(bytes),scenarioSha256:hash(scenarioBytes),scenarioId:scenario.id,scope:'One scripted replay; unvisited character paths are not verified.',characters:[player,opponent].map(character=>({path:character.path,localcoord:character.def.info.localcoord||'320,240'})),inventory:[match.player,match.opponent].map(fighter=>({path:fighter.character.path,states:fighter.program.states.size,controllers:[...fighter.program.controllerTypes].sort(),sources:fighter.program.sources})),diagnostics:match.diagnostics,samples,comparison:{status:'not-run',native:false}};
  if(options.baseline){const baseline=JSON.parse(readFileSync(options.baseline));if(!['native-mugen','web-runtime','synthetic-test'].includes(baseline.provenance?.kind)||baseline.archiveSha256!==report.archiveSha256||baseline.scenarioSha256!==report.scenarioSha256||baseline.scenarioId!==report.scenarioId)throw Error('Baseline provenance, archive or scenario identity does not match.');
    if(baseline.provenance.kind==='native-mugen'&&(!baseline.provenance.version||!baseline.provenance.captureMethod))throw Error('Native baselines require a version and capture method.');
    const result=compareTrace(samples,baseline.samples);report.comparison={status:result.matched?'matched':'different',native:baseline.provenance.kind==='native-mugen',provenance:baseline.provenance,...result};
  }
  mkdirSync(dirname(options.output),{recursive:true});writeFileSync(options.output,JSON.stringify(report,null,2)+'\n');
  return {...report,output:options.output};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{const report=auditCompatibility(process.argv.slice(2));console.log(JSON.stringify({report:report.output,scenario:report.scenarioId,samples:report.samples.length,diagnostics:report.diagnostics.length,comparison:report.comparison.status,nativeComparison:report.comparison.native}));if(report.comparison.status==='different')process.exitCode=1;}
  catch(error){console.error(error.message);process.exitCode=2;}
}
