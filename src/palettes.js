import {sff,decodeAct,packagePath} from './formats.js';

export function characterSpriteBank(character){
 const diagnostics=[],externalPalettes=new Map(),files=character.files,base=character.path.slice(0,character.path.lastIndexOf('/')+1);
 for(const [key,value]of Object.entries(character.def.files||{}))if(/^pal\d+$/.test(key)&&value){
  try{const number=Number(key.slice(3));if(number<1||number>256)throw Error(`Invalid palette number ${number}.`);const check=character.checks?.find(c=>c.key===key);let path;if(check)path=check.ok?check.path:null;else{try{path=packagePath(value,base,true);}catch{path=null;}}if(!path||!files[path])throw Error(`Palette file is missing from the ZIP: ${value}`);externalPalettes.set(number,decodeAct(files[path]));}
  catch(error){diagnostics.push({type:'palette',source:character.path,line:0,message:error.message});}
 }
 const bank=sff(files[character.sprite.path],{externalPalettes});
 bank.diagnostics=diagnostics;bank.selectablePalettes=[...new Set((bank.palettes||[]).filter(p=>p.group===1&&p.number>=1&&p.number<=12).map(p=>p.number))].sort((a,b)=>a-b);
 if(!bank.selectablePalettes.length)bank.selectablePalettes=[1];
 const preferred=String(character.def.info?.['pal.defaults']||'1').split(',').map(Number);bank.defaultPalette=preferred.find(p=>bank.selectablePalettes.includes(p))??bank.selectablePalettes[0];
 return bank;
}
