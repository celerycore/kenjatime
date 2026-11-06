import {charactersFromFiles} from './formats.js';
import {unpackArchiveBytes} from './archive-reader.js';
import {stageDefinitions} from './stages.js';
import {prepareStageSprites} from './stage-sprites.js';
import rarWasmUrl from 'node-unrar-js/esm/js/unrar.wasm?url';

self.onmessage=async({data:bytes})=>{
  try{
    self.postMessage({progress:'Checking archive…'});
    const files=await unpackArchiveBytes(bytes,{onProgress:progress=>self.postMessage({progress}),loadWasm:async()=>{
      if(typeof WebAssembly==='undefined')throw Error('This browser cannot decode RAR. Update your browser or use ZIP.');
      const response=await fetch(rarWasmUrl);if(!response.ok)throw Error('The RAR decoder could not load. Refresh the page and try again.');return response.arrayBuffer();
    }});
    self.postMessage({progress:'Checking character and stage definitions…'});
    const characters=charactersFromFiles(files),stages=stageDefinitions(files);
    if(!characters.length&&!stages.length)throw Error('No character or stage DEF found in the archive.');
    const prepared=prepareStageSprites(stages,{onProgress:progress=>self.postMessage({progress})});
    const buffers=[...new Set([...Object.values(files).map(file=>file.buffer),...prepared])];
    self.postMessage({result:{files,characters,stages}},buffers);
  }catch(error){self.postMessage({error:error.message});}
};
