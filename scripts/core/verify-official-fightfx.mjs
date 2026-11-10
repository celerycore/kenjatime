/** Verify the genuine IKEMEN GO screenpack common fx without modifying it.
 * Usage: MUGEN_OFFICIAL_FIGHTFX_ZIP=... node scripts/core/verify-official-fightfx.mjs
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {packageFiles,sff} from '../../src/formats.js';
import {CoreSession} from '../../src/core/session.js';
import {loadCommonEffects} from '../../src/core/common-effects.js';

const assetPath=process.env.MUGEN_OFFICIAL_FIGHTFX_ZIP;
if(!assetPath)throw Error('Set MUGEN_OFFICIAL_FIGHTFX_ZIP to the original IKEMEN GO fightfx ZIP.');
const zip=readFileSync(assetPath),raw=packageFiles(zip);
const fileRoot='imports/official-fx/',files={};
for(const [key,bytes] of Object.entries(raw))files[fileRoot+key]=bytes;
const kfm=packageFiles(readFileSync(new URL('../../public/kfm.zip',import.meta.url)));
Object.assign(files,kfm);
const assets=loadCommonEffects(files,{effectsPackage:fileRoot});
const required=[0,1,2,40],output=resolve(process.env.FIGHTFX_VERIFY_OUTPUT||'work/core/official-fightfx-verify.json');
const report={
  kind:'official-ikemen-go-fightfx-core-verification-v1',
  originalZipSha256:createHash('sha256').update(zip).digest('hex'),
  origin:'ikemen-engine/Ikemen-GO-Screenpack data/ pinned source',
  paths:assets.paths,
  soundPath:assets.soundPath,
  scale:assets.scale,
  authoredAnimations:assets.animations.size,
  required:[],
  issues:[...assets.issues],
};
if(!assets.resource)throw Error('Original source pack has no resolved AIR/SFF pair: '+JSON.stringify(assets.issues));
const bank=sff(files[assets.paths.sff]),indices=new Map(bank.sprites.map((sprite,i)=>[sprite.group+','+sprite.number,i]));
for(const id of required){
  const action=assets.animations.get(id);
  const entry={id,exists:!!action,frames:action?.frames.length||0,
    expectedSprites:0,presentSprites:0,decodedSprites:0,decodeFailures:[],draws:0,valid:false};
  if(action){
    for(const frame of action.frames){
      if(frame.group<0)continue;
      entry.expectedSprites++;
      const index=indices.get(frame.group+','+frame.number);
      if(index===undefined)continue;
      entry.presentSprites++;
      try{
        const sprite=bank.decodeIndexed?.(index)||bank.decode(index);
        if(!sprite.w||!sprite.h)throw Error('Empty sprite');
        entry.decodedSprites++;
      }catch(error){entry.decodeFailures.push({pair:frame.group+','+frame.number,message:error.message});}
    }
  }
  report.required.push(entry);
}
const session=new CoreSession(files,{character:'kfm/kfm.def',opponent:'kfm/kfm.def',
  mode:'training',effectsPackage:fileRoot});
try{
  // Trigger a real Core HitDef contact-event path for the original sparks.
  // Each hit must produce a common action render packet, not the generic
  // fallback. This intentionally doesn't claim native attack timing parity.
  for(const entry of report.required){
    const attacker=session.match.player;
    const original=session.match.tick.bind(session.match);
    session.match.tick=(...args)=>{
      original(...args);
      const guarded=entry.id===40;
      session.match.events.push({type:guarded?'guard':'hit',attacker,
        defender:session.match.opponent,
        hitDef:guarded?{'guard.sparkno':40,guardSparkCommon:true}:{
          sparkno:entry.id,sparkCommon:true},
        guarded,typeNone:false,x:attacker.pos.x,y:attacker.pos.y});
    };
    session.tick();session.match.tick=original;
    const render=session.frame();
    // The common bank is resolved via the exact common effects resource.
    const id=session.bankIds.get(session.commonEffects.resource);
    const prefix=id+':';
    entry.draws=render.draws.filter(draw=>String(draw.texture).startsWith(prefix)).length;
    entry.valid=entry.exists&&entry.presentSprites>0&&entry.decodedSprites>0&&
      entry.draws>0&&session.gameEffects.some(e=>e.animation.id===entry.id);
    session.gameEffects.length=0;session.sparks.length=0;
  }
  report.sessionIssues=session.snapshot().diagnostics;
}finally{session.close();}
report.allRequiredRendered=report.required.every(e=>e.valid);
mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({output,summary:{
  actionIds:report.required.map(e=>e.id),verified:report.required.filter(e=>e.valid).length,
  spriteCount:bank.sprites.length,renderCounts:report.required.map(e=>e.draws),
  issues:report.issues.length,allRequiredRendered:report.allRequiredRendered,
}}));
if(!report.allRequiredRendered)process.exitCode=1;
