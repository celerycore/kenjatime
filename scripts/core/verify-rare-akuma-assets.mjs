/** Read-only audit of original Rare Akuma AIR/SFF assets. No source sprites are invented. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {packageFiles,charactersFromFiles,decodeText} from '../../src/formats.js';
import {parseSections} from '../../src/runtime.js';
import {characterSpriteBank} from '../../src/palettes.js';

if(!process.env.MUGEN_RARE_AKUMA)throw Error('Set MUGEN_RARE_AKUMA to the original Rare Akuma ZIP.');
const bytes=readFileSync(process.env.MUGEN_RARE_AKUMA),files=packageFiles(bytes);
const character=charactersFromFiles(files).find(c=>String(c.def.info?.name||'').replace(/[^a-z0-9]/gi,'').toLowerCase()==='rareakuma');
if(!character)throw Error('Rare Akuma character DEF not found.');
const bank=characterSpriteBank(character),present=new Set(bank.sprites.map(s=>s.group+','+s.number));
const effective=new Map(character.animations.map(a=>[a.id,a]));
const missingGlobal=new Map(),actions=[];
for(const action of effective.values()){
 let valid=0,invisible=0;const missing=new Map();
 for(const frame of action.frames){
  if(frame.group<0){invisible++;continue;}
  const pair=frame.group+','+frame.number;
  if(present.has(pair))valid++;
  else{missing.set(pair,(missing.get(pair)||0)+1);missingGlobal.set(pair,(missingGlobal.get(pair)||0)+1);}
 }
 actions.push({id:action.id,frames:action.frames.length,presentSpriteFrameRefs:valid,negativeSpriteFrameRefs:invisible,
  missingSpriteFrameRefs:[...missing.values()].reduce((a,b)=>a+b,0),
  missingPairs:[...missing].map(([pair,count])=>({pair,count})),
  classification:valid?'partially-renderable':missing.size?'source-sprites-absent':'intentionally-invisible'});
}
const staticUses=new Map(),commonEffects=[],dynamic=[];
const add=(id,info)=>{if(!staticUses.has(id))staticUses.set(id,[]);staticUses.get(id).push(info);};
const direct=v=>{const s=String(v??'').trim();return /^s?-?\d+$/i.test(s)?Number(s.replace(/^s/i,'')):null;};
const keys={changeanim:['value'],changeanim2:['value'],explod:['anim'],modifyexplod:['anim'],
 projectile:['projanim','projhitanim','projremanim','projcancelanim'],superpause:['anim'],
 gamemakeanim:['value'],hitdef:['sparkno','guard.sparkno']};
for(const check of character.checks){
 if(!check.ok||!/^(cns|cmd|st\d*)$/.test(check.key))continue;
 let state=null;
 for(const section of parseSections(decodeText(files[check.path]),check.path)){
  const definition=/^statedef\s+(-?\d+)$/.exec(section.name);
  if(definition){state=Number(definition[1]);
   const value=direct(section.values.anim);
   if(value!==null)add(value,{file:check.path,line:section.line,state,controller:'statedef',parameter:'anim'});
   continue;
  }
  if(!/^state(?:\s|$)/.test(section.name))continue;
  const type=String(section.values.type||'').toLowerCase();
  for(const key of keys[type]||[]){
   const raw=section.values[key];if(raw===undefined)continue;
   const source={file:check.path,line:section.line,state,controller:type,parameter:key,value:raw};
   // Non-S HitDef sparks, GameMakeAnim and non-S SuperPause use common fightfx.
   const common=type==='gamemakeanim'||
    ['hitdef','superpause'].includes(type)&&!/^s\s*-?\d+$/i.test(raw.trim())||
    ['explod','modifyexplod'].includes(type)&&/^f\s*-?\d+$/i.test(raw.trim());
   if(common){commonEffects.push(source);continue;}
   const id=direct(raw);
   if(id===null){dynamic.push({...source,expression:raw});continue;}
   add(id,source);
  }
 }
}
for(const action of actions)action.directStaticReferences=staticUses.get(action.id)||[];
const undefinedCharacterActions=[...staticUses].filter(([id])=>id>=0&&!effective.has(id))
 .map(([id,references])=>({id,references})).sort((a,b)=>a.id-b.id);
const absent=actions.filter(a=>a.classification==='source-sprites-absent');
const report={format:'kenjatime-rare-akuma-asset-audit-v1',character:character.path,
 archiveSha256:createHash('sha256').update(bytes).digest('hex'),
 summary:{totalEffectiveActions:actions.length,renderableActions:actions.filter(a=>a.classification==='partially-renderable').length,
  sourceSpriteAbsentActions:absent.length,intentionallyInvisibleActions:actions.filter(a=>a.classification==='intentionally-invisible').length,
  uniqueMissingSpritePairs:missingGlobal.size,totalMissingSpriteFrameRefs:[...missingGlobal.values()].reduce((a,b)=>a+b,0),
  staticUndefinedAnimationIds:undefinedCharacterActions.length,explicitCommonEffectReferences:commonEffects.length,
  dynamicAnimationExpressions:dynamic.length,uniqueSourceSprites:present.size,sourceSpriteEntries:bank.sprites.length},
 sourceSpriteAbsentActions:absent,partiallyRenderableActionsWithMissingFrames:actions.filter(a=>a.presentSpriteFrameRefs&&a.missingSpriteFrameRefs),
 intentionallyInvisibleActions:actions.filter(a=>a.classification==='intentionally-invisible'),
 missingSpritePairs:[...missingGlobal].map(([pair,frameReferences])=>({pair,frameReferences})).sort((a,b)=>b.frameReferences-a.frameReferences),
 staticallyReferencedUndefinedActions:undefinedCharacterActions,
 explicitCommonEffectReferences:commonEffects,dynamicAnimationExpressions:dynamic,
 limitations:[
  'Missing SFF pairs cannot be decoded from this ZIP; do not invent source pixels.',
  'Negative sprite groups indicate intentionally invisible AIR elements.',
  'Common fightfx AIR/SFF resources are not bundled with the provided character or KFM ZIP.',
  'Dynamic references are listed rather than guessed; no native engine image capture is compared.',
  'An unreferenced static ID may still be reachable via dynamic state logic.'
 ]};
const output=resolve(process.env.CORE_RARE_ASSETS_OUTPUT||'work/core/rare-akuma-assets.json');
mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,summary:report.summary,missingOnlyIDs:absent.map(a=>a.id)}));
