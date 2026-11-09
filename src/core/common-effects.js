/** Optional MUGEN / IKEMEN common-effect resource loader.
 * Only uses files already imported into the virtual package. A character ZIP
 * does not implicitly include fightfx, and missing assets are never invented.
 */
import {animations, decodeText, ini, packagePath} from '../formats.js';

const normalize = path => String(path||'').replaceAll('\\','/').toLowerCase();

/** Returns a shared animation map + a plain SFF resource for CoreSession.asset. */
export function loadCommonEffects(files, {fightDef} = {}) {
  const issues=[];
  const chosen=normalize(fightDef);
  const defPath = (chosen && files[chosen] && chosen) ||
    ['data/fight.def','fight.def'].find(path=>files[path]);
  let definition=null;
  if(defPath){
    try { definition=ini(decodeText(files[defPath])); }
    catch(error){issues.push({type:'fightfx-config',message:`${defPath}: ${error.message}`});}
  }
  const base=defPath?.slice(0,defPath.lastIndexOf('/')+1) || '';
  const reference = (name,fallback) => {
    const candidates=[];
    if(name){
      for(const prefix of [base, '', 'data/']){
        try{candidates.push(packagePath(name,prefix,true));}catch{}
      }
      const leaf=normalize(name).split('/').at(-1);
      if(leaf) candidates.push('data/'+leaf,leaf);
    }
    candidates.push('data/'+fallback,fallback);
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
