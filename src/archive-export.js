// Keep original-volume reads and ZIP construction off the UI/audio thread.
export function exportArchiveVolumes(parts){
 return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./archive-export-worker.js',import.meta.url),{type:'module'});
  const finish=(error,bytes)=>{clearTimeout(timer);worker.terminate();error?reject(error):resolve(bytes);};
  const timer=setTimeout(()=>finish(Error('Archive download took too long. Try again.')),120000);
  worker.onmessage=({data})=>finish(data.error?Error(data.error):null,data.bytes);
  worker.onerror=()=>finish(Error('Could not prepare the archive download. Try again.'));
  worker.postMessage(parts);
 });
}
