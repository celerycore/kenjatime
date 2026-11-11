import {readArchiveBlob} from './core/blueprint-archive-stream.js';
import {charactersFromFiles} from './formats.js';
import {unpackArchiveBytes} from './archive-reader.js';
import {stageDefinitions} from './stages.js';
import {hasCommonEffects} from './core/common-effects.js';
import {prepareStageSprites} from './stage-sprites.js';
import rarWasmUrl from 'node-unrar-js/esm/js/unrar.wasm?url';
import multiWasmUrl from 'libarchive-wasm/dist/libarchive.wasm?url';
import sevenWasmUrl from '7z-wasm/7zz.wasm?url';

self.onmessage=async({data})=>{
  const password=data.password||'';
  try{
    self.postMessage({progress:'Checking archive…'});
    const bytes=data.blob ? await readArchiveBlob(data.blob, {
      onProgress:({bytes:loaded,total})=>self.postMessage({progress:'Reading archive '+loaded+'/'+total+' bytes'})
    }) : (data.bytes||data);
    const decoderOptions={password,onProgress:progress=>self.postMessage({progress}),loadSevenWasm:async()=>{const response=await fetch(sevenWasmUrl);if(!response.ok)throw Error('The archive decoder could not load.');return response.arrayBuffer();},loadMultiWasm:async()=>{
      const response=await fetch(multiWasmUrl);if(!response.ok)throw Error('The archive decoder could not load. Refresh and try again.');return response.arrayBuffer();
    },loadWasm:async()=>{
      if(typeof WebAssembly==='undefined')throw Error('This browser cannot decode RAR. Update your browser or use ZIP.');
      const response=await fetch(rarWasmUrl);if(!response.ok)throw Error('The RAR decoder could not load. Refresh the page and try again.');return response.arrayBuffer();
    }};
    let files;if(data.parts){const {unpackSevenArchive}=await import('./seven-archive.js');files=await unpackSevenArchive(data.parts,{...decoderOptions,wasmBinary:await decoderOptions.loadSevenWasm()});}
    else files=await unpackArchiveBytes(bytes,decoderOptions);
    self.postMessage({progress:'Checking character and stage definitions…'});
    const characters=charactersFromFiles(files),stages=stageDefinitions(files);
    if(!characters.length&&!stages.length&&!hasCommonEffects(files))throw Error('No character, stage, or complete fightfx AIR/SFF resource set found in the archive.');
    const prepared=data.prepareStageData===false?[]:prepareStageSprites(stages,{onProgress:progress=>self.postMessage({progress})});
    const buffers=[...new Set([...Object.values(files).map(file=>file.buffer),...prepared])];
    self.postMessage({result:{files,characters,stages}},buffers);
  }catch(error){self.postMessage({error:error.message});}
};
