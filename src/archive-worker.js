import {packageFiles,charactersFromFiles} from './formats.js';
import {stageDefinitions} from './stages.js';

self.onmessage=({data:bytes})=>{
  try{
    self.postMessage({progress:'Unpacking ZIP…'});
    const files=packageFiles(bytes);
    self.postMessage({progress:'Checking character and stage definitions…'});
    const characters=charactersFromFiles(files),stages=stageDefinitions(files);
    if(!characters.length&&!stages.length)throw Error('No character or stage DEF found in the ZIP.');
    const buffers=[...new Set(Object.values(files).map(file=>file.buffer))];
    self.postMessage({result:{files,characters,stages}},buffers);
  }catch(error){self.postMessage({error:error.message});}
};
