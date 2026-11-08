import {bundleArchiveVolumes} from './archive-volumes.js';
self.onmessage=async({data})=>{
 try{const bytes=await bundleArchiveVolumes(data);self.postMessage({bytes},[bytes.buffer]);}
 catch(error){self.postMessage({error:error.message||String(error)});}
};
