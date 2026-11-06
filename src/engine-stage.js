import {decodeText,packagePath} from './formats.js';

/** Resolve music inside the selected package without changing the saved DEF. */
export function stageWithResolvedMusic(path,files){
 const base=path.slice(0,path.lastIndexOf('/')+1),match=path.match(/^imports\/[^/]+\//),root=match?.[0]||'';
 const keys=new Map(Object.keys(files).map(p=>[p.toLowerCase(),p]));
 const resolve=name=>{
  name=name.trim().replace(/^"(.*)"$/,'$1').replaceAll('\\','/');if(!name)return null;
  const candidates=[base+name,root+name,...(!match?[name]:[]),base+name.split('/').at(-1)];
  for(const candidate of candidates)try{const p=packagePath(candidate,'',true);if(match&&!p.startsWith(root))continue;const found=keys.get(p.toLowerCase());if(found)return found;}catch{}
  return null;
 };
 let music=false,changed=false;
 const text=decodeText(files[path]).split(/\r?\n/).map(line=>{
  const section=line.match(/^\s*\[([^\]]+)\]/);if(section){music=section[1].trim().toLowerCase()==='music';return line;}if(!music)return line;
  const field=line.match(/^(\s*(?:[\w.-]+\.)?(?:bgmusic|bgm)\s*=\s*)(.*)$/i);if(!field)return line;
  // Prefer an exact filename (including commas) before treating a value as a list.
  let quoted=false,comment=-1;for(let i=0;i<field[2].length;i++){if(field[2][i]==='"')quoted=!quoted;else if(field[2][i]===';'&&!quoted){comment=i;break;}}
  const value=(comment<0?field[2]:field[2].slice(0,comment)).trim(),tail=comment<0?'':' '+field[2].slice(comment);
  const direct=resolve(value);let values;
  if(direct)values=[direct];else{
   const parts=[];let start=0;quoted=false;for(let i=0;i<value.length;i++){if(value[i]==='"')quoted=!quoted;else if(value[i]===','&&!quoted){parts.push(value.slice(start,i));start=i+1;}}parts.push(value.slice(start));
   values=parts.map(part=>resolve(part)||part.trim());
  }
  const rewritten=values.map(v=>/[,;]/.test(v)&&!v.startsWith('"')?'"'+v+'"':v).join(', ');if(rewritten===value)return line;
  changed=true;return field[1]+rewritten+tail;
 }).join('\n');
 return changed?new TextEncoder().encode(text):files[path];
}
