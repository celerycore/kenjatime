import {sff,decodeAct,packagePath} from './formats.js';

const banks=new WeakMap();

// Projectile combat ownership is its root; palette ownership is its creator's
// family and can survive destruction of an independent helper.
export function paletteOwner(entity){
 let current=entity,depth=0;
 while(current&&depth++<256){
  if(current.ownPal||current.ownpal)return current;
  const next=current.paletteParent||current.parent||current.owner;
  if(!next||next===current)return current;
  current=next;
 }
 return current;
}

export const copyPaletteRemaps=remaps=>new Map([...(remaps||[])].map(([key,pair])=>[key,[...pair]]));

export function normalizePalFX(event){
 const result={...event};
 for(const [key,defaults]of [['add',[0,0,0]],['mul',[256,256,256]],['sinadd',[0,0,0,0]]])if(result[key]!==undefined){
  const values=Array.isArray(result[key])?result[key]:[result[key]];
  result[key]=defaults.map((fallback,i)=>{const n=Math.trunc(Number(values[i]??fallback));return key==='mul'?Math.max(0,n):n;});
 }
 if(result.time!==undefined)result.time=Math.trunc(Number(result.time));
 if(result.color!==undefined)result.color=Math.max(0,Math.min(256,Math.trunc(Number(result.color))));
 if(result.invertall!==undefined)result.invertall=+!!result.invertall;
 return result;
}

export function remapAllPalettes(remaps,character,value){
 const pair=Array.isArray(value)?value:[value],dest=[Math.trunc(Number(pair[0]??-1)),Math.trunc(Number(pair[1]??0))];
 if(dest[0]===-1)return;
 if(dest[0]<0||dest[1]<0)throw Error('Invalid RemapPal palette pair.');
 validatePaletteRemap(character,[-1,0],dest);remaps.clear();remaps.set('*',dest);
}

export function validatePaletteRemap(character,source,dest){
 if(!character.sprite?.path||!character.files?.[character.sprite.path])return;
 const bank=characterSpriteBank(character),find=pair=>bank.palettes.find(p=>p.group===pair[0]&&p.number===pair[1]);
 const target=find(dest);if(!target)throw Error(`RemapPal destination palette ${dest.join(',')} does not exist.`);
 if(source[0]!==-1){
  const from=find(source);if(!from)throw Error(`RemapPal source palette ${source.join(',')} does not exist.`);
  if(from.colors&&target.colors&&Math.ceil(Math.log2(from.colors))!==Math.ceil(Math.log2(target.colors)))throw Error('RemapPal source and destination color depths differ.');
 }
}

export function characterSpriteBank(character){
 if(banks.has(character))return banks.get(character);
 const diagnostics=[],externalPalettes=new Map(),files=character.files,base=character.path.slice(0,character.path.lastIndexOf('/')+1);
 for(const [key,value]of Object.entries(character.def.files||{}))if(/^pal\d+$/.test(key)&&value){
  try{const number=Number(key.slice(3));if(number<1||number>256)throw Error(`Invalid palette number ${number}.`);const check=character.checks?.find(c=>c.key===key);let path;if(check)path=check.ok?check.path:null;else{try{path=packagePath(value,base,true);}catch{path=null;}}if(!path||!files[path])throw Error(`Palette file is missing from the ZIP: ${value}`);decodeAct(files[path]);externalPalettes.set(number,files[path]);}
  catch(error){diagnostics.push({type:'palette',source:character.path,line:0,message:error.message});}
 }
 const bank=sff(files[character.sprite.path],{externalPalettes});
 bank.diagnostics=diagnostics;bank.selectablePalettes=[...new Set((bank.palettes||[]).filter(p=>p.group===1&&p.number>=1&&p.number<=12).map(p=>p.number))].sort((a,b)=>a-b);
 if(!bank.selectablePalettes.length)bank.selectablePalettes=[1];
 const preferred=String(character.def.info?.['pal.defaults']||'1').split(',').map(Number);bank.defaultPalette=preferred.find(p=>bank.selectablePalettes.includes(p))??bank.selectablePalettes[0];
 banks.set(character,bank);return bank;
}
