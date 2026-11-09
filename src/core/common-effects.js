/** Resolve authentic MUGEN/IKEMEN common effects from ONE imported package.
 * Pairing AIR from one installation with SFF from another silently produces
 * incorrect hit sparks. A selected effects pack must be atomic.
 */
import {animations, decodeText, ini, packagePath} from '../formats.js';

const normalize=path=>String(path||'').replaceAll('\\','/').toLowerCase();
const namespace=path=>/^imports\/[^/]+\//.exec(normalize(path))?.[0]??'';
const leaf=path=>normalize(path).split('/').at(-1);

export const hasCommonEffects=files=>Object.keys(files||{}).some(path=>
  /(^|\/)fightfx\.air$/i.test(path)&&!!files[path.replace(/\.air$/i,'.sff')]);

const empty=(issues,paths=null,soundPath=null)=>({
  animations:new Map(),resource:null,soundPath,issues,paths,scale:1,
});

/** Select a complete AIR/SFF pair from a single namespace, with optional SND. */
export function loadCommonEffects(files,{fightDef,character,stage,effectsPackage}={}){
  const issues=[];
  const explicit=effectsPackage?namespace(effectsPackage):null;
  const selectedFightDef=normalize(fightDef);
  const scopes=explicit!==null?[explicit]:[...new Set([
    selectedFightDef?namespace(selectedFightDef):null,
    namespace(stage)||null,namespace(character)||null,'',
  ].filter(x=>x!==null))];
  let incomplete=null;
  for(const scope of scopes){
    const preferredDef=selectedFightDef&&files[selectedFightDef]&&
      namespace(selectedFightDef)===scope?selectedFightDef:null;
    const defPath=preferredDef||[scope+'data/fight.def',scope+'fight.def'].find(p=>files[p]);
    let def=null;
    if(defPath)try{def=ini(decodeText(files[defPath]));}
    catch(error){issues.push({type:'fightfx-config',message:defPath+': '+error.message});}
    const base=defPath?.slice(0,defPath.lastIndexOf('/')+1)||scope+'data/';
    const resource=(name,fallback)=>{
      const candidates=[];
      if(name){
        for(const prefix of [base,scope+'data/',scope]){
          try{candidates.push(packagePath(name,prefix,true));}
          catch{/* Malformed paths must not escape the chosen package. */}
        }
        if(leaf(name))candidates.push(scope+'data/'+leaf(name),scope+leaf(name));
      }
      candidates.push(scope+'data/'+fallback,scope+fallback);
      return [...new Set(candidates)].find(p=>p.startsWith(scope)&&files[p])||null;
    };
    const air=resource(def?.files?.['fightfx.air'],'fightfx.air');
    const sff=resource(def?.files?.['fightfx.sff'],'fightfx.sff');
    const snd=resource(def?.files?.['common.snd'],'common.snd');
    if(!air&&!sff)continue;
    if(!air||!sff){incomplete??={air,sff,snd,defPath,scope};continue;}
    let actions;
    try{actions=animations(decodeText(files[air]));}
    catch(error){
      issues.push({type:'fightfx-air',message:air+': '+error.message});
      return empty(issues,{air,sff,definition:defPath||null,scope},snd);
    }
    const catalog=new Map(actions.map(a=>[a.id,a]));
    const factor=Number(def?.fightfx?.scale||1);
    const localX=Number(def?.info?.localcoord?.split(',')[0]||320);
    const scale=Number.isFinite(factor)&&factor>0&&Number.isFinite(localX)&&localX>0
      ?factor*320/localX:1;
    return{
      animations:catalog,
      resource:catalog.size?{files,sprite:{path:sff}}:null,
      soundPath:snd,
      paths:{air,sff,definition:defPath||null,scope},scale,issues,
    };
  }
  if(incomplete){
    issues.push({type:'fightfx-missing',
      message:'The '+(incomplete.scope||'root')+' effects pack is incomplete: AIR '+
        (incomplete.air||'missing')+'; SFF '+(incomplete.sff||'missing')+
        '. Do not combine files from different packs.'});
    return empty(issues,{air:incomplete.air,sff:incomplete.sff,
      definition:incomplete.defPath,scope:incomplete.scope},incomplete.snd);
  }
  if(explicit!==null)issues.push({type:'fightfx-missing',
    message:'Selected common-effects pack '+explicit+
      ' contains no fightfx.air/fightfx.sff pair.'});
  return empty(issues);
}
