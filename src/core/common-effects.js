/** Optional MUGEN / IKEMEN common-effect resource loader.
 * Only uses files already imported into the virtual package. A character ZIP
 * does not implicitly include fightfx, and missing assets are never invented.
 */
import {animations, decodeText, ini, packagePath} from '../formats.js';

export const hasCommonEffects = files => Object.keys(files||{}).some(path=>
  /(^|\/)fightfx\.air$/i.test(path) && !!files[path.replace(/\.air$/i,'.sff')]);

const normalize = path => String(path||'').replaceAll('\\','/').toLowerCase();

/** Returns a shared animation map + a plain SFF resource for CoreSession.asset. */
export function loadCommonEffects(files, {fightDef, character, stage, effectsPackage} = {}) {
  const issues=[];
  const chosen=normalize(fightDef);
  // Library imports live under imports/<package-id>/; prefer the active
  // stage's motif, then the active character package.
  const namespaces=[effectsPackage,stage,character].map(value=>/^imports\/[^/]+\//.exec(normalize(value))?.[0]).filter(Boolean);
  const scopePrefixes=[...new Set([...namespaces,''])];
  const defPath = (chosen && files[chosen] && chosen) ||
    scopePrefixes.flatMap(prefix=>[prefix+'data/fight.def',prefix+'fight.def']).find(path=>files[path]);
  let definition=null;
  if(defPath){
    try { definition=ini(decodeText(files[defPath])); }
    catch(error){issues.push({type:'fightfx-config',message:`${defPath}: ${error.message}`});}
  }
  const base=defPath?.slice(0,defPath.lastIndexOf('/')+1) || '';
  const candidatesBase=[base,...scopePrefixes.map(prefix=>prefix+'data/'),...scopePrefixes];
  const reference = (name,fallback) => {
    const candidates=[];
    if(name){
      for(const prefix of candidatesBase){
        try{candidates.push(packagePath(name,prefix,true));}catch{}
      }
      const leaf=normalize(name).split('/').at(-1);
      if(leaf) for(const prefix of scopePrefixes)candidates.push(prefix+'data/'+leaf,prefix+leaf);
    }
    for(const prefix of scopePrefixes)candidates.push(prefix+'data/'+fallback,prefix+fallback);
    return [...new Set(candidates)].find(path=>files[path]);
  };
  const airPath=reference(definition?.files?.['fightfx.air'],'fightfx.air');
  const sffPath=reference(definition?.files?.['fightfx.sff'],'fightfx.sff');
  if(!airPath && !sffPath)return {animations:new Map(),resource:null,issues,paths:null,scale:1};
  if(!airPath || !sffPath){
    issues.push({type:'fightfx-missing',message:`Common effects require both AIR and SFF; available AIR: ${airPath||'none'}, SFF: ${sffPath||'none'}.`});
    return {animations:new Map(),resource:null,issues,paths:{air:airPath,sff:sffPath},scale:1};
  }
  let actions=[];
  try{actions=animations(decodeText(files[airPath]));}
  catch(error){issues.push({type:'fightfx-air',message:`${airPath}: ${error.message}`});}
  const catalog=new Map(actions.map(action=>[action.id,action]));
  const scale=Number(definition?.fightfx?.scale||1),localX=Number(definition?.info?.localcoord?.split(',')[0]||320);
  return {
    animations:catalog,
    resource:catalog.size ? {files,sprite:{path:sffPath}} : null,
    paths:{air:airPath,sff:sffPath,definition:defPath||null},
    scale:Number.isFinite(scale)&&Number.isFinite(localX)&&scale>0&&localX>0 ? scale*320/localX : 1,
    issues,
  };
}
