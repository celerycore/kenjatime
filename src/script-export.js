import {zipSync,strToU8} from 'fflate';

/** Share the chosen character's scripts without redistributing large media banks. */
export function characterScriptArchive(character){
  const paths=new Set([character.path,...character.checks.filter(c=>c.ok&&/^(cmd|cns|anim|stcommon|st\d*)$/.test(c.key)).map(c=>c.path)]);
  const files=Object.create(null);let size=0;
  for(const path of paths){const data=character.files[path];if(!data)continue;size+=data.length;if(size>24*1024*1024)throw Error('Character scripts exceed the 24 MB analysis export limit.');files[path]=data;}
  files['character-analysis.json']=strToU8(JSON.stringify({name:character.def.info.name,author:character.def.info.author,definition:character.path,references:character.checks,archiveFiles:Object.entries(character.files).map(([path,data])=>({path,bytes:data.length})),note:'Script analysis export. Sprites, sound and other binary resources are omitted; this is not a playable character ZIP.'},null,2));
  return zipSync(files);
}
