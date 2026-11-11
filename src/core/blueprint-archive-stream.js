/**
 * Worker-side bounded streaming Blob/File ingestion, avoiding a full copy on
 * the UI thread. Archive decoders currently require contiguous input, so the
 * final allocation still happens inside the worker (not zero-copy decoding).
 */
export async function readArchiveBlob(blob,{maxBytes=256*1024*1024,onProgress=()=>{},signal}={}){
  if(!blob || typeof blob.stream!=="function")throw TypeError("Blob/File stream required");
  if(!Number.isSafeInteger(maxBytes)||maxBytes<1||blob.size>maxBytes)
    throw RangeError("Archive size limit exceeded");
  const reader=blob.stream().getReader();
  const chunks=[];let used=0;
  try{
    for(;;){
      if(signal?.aborted)throw Error("Archive import aborted");
      const {value,done}=await reader.read();
      if(done)break;
      if(!(value instanceof Uint8Array))throw TypeError("Unsupported Blob stream chunk");
      used+=value.byteLength;
      if(used>maxBytes)throw RangeError("Archive size limit exceeded");
      chunks.push(value);
      onProgress({bytes:used,total:blob.size});
    }
  }finally{
    reader.releaseLock();
  }
  const result=new Uint8Array(used);let offset=0;
  for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.byteLength;}
  return result;
}
