/** Sparse zero-run encoding for SFF indexed-R8 sprites. 0 is transparent.
 * Literal token 0..127 followed by token+1 bytes; zero-run token 128..255
 * advances token-127 bytes. No lossy color transform or palette expansion. */
export function packSparseR8(pixels) {
  const buffer=new Uint8Array(pixels.length+Math.ceil(pixels.length/128)+16);
  let read=0,write=0;
  while(read<pixels.length) {
    let zeros=0;
    while(read+zeros<pixels.length && zeros<128 && pixels[read+zeros]===0)zeros++;
    if(zeros>=3) {
      buffer[write++]=127+zeros;
      read+=zeros;
      continue;
    }
    const header=write++;
    let count=0;
    while(read<pixels.length && count<128) {
      if(pixels[read]===0 && pixels[read+1]===0 && pixels[read+2]===0)break;
      buffer[write++]=pixels[read++];
      count++;
    }
    buffer[header]=count-1;
  }
  return buffer.subarray(0,write);
}

export function unpackSparseR8(encoded, pixelCount) {
  const pixels=new Uint8Array(pixelCount);
  let source=0,target=0;
  while(source<encoded.length) {
    const token=encoded[source++];
    const count=(token&127)+1;
    if(target+count>pixelCount)throw new RangeError('Corrupt R8 restore-cache run.');
    if(token&128)target+=count; // Uint8Array is initialized to transparent 0
    else {
      if(source+count>encoded.length)
        throw new RangeError('Corrupt R8 restore-cache literal.');
      for(let i=0;i<count;i++)pixels[target++]=encoded[source++];
    }
  }
  if(target!==pixelCount)throw new RangeError('Incomplete R8 restore-cache data.');
  return pixels;
}

function likelySparseR8(pixels) {
  // Odd sampling stride avoids aliasing power-of-two sprite widths and
  // repeated 8/16-byte patterns (common in indexed PCX/SFF art).
  const step=Math.max(1,Math.floor(pixels.length/64))|1;
  let sampled=0,zeros=0;
  for(let i=0;i<pixels.length && sampled<64;i+=step) {
    sampled++;
    if(pixels[i]===0)zeros++;
  }
  return sampled>=16 && zeros*4>=sampled;
}

/**
 * Bounded worker-side cache for sprite pixels redecoded after GPU LRU eviction.
 *
 * Unlike keeping every imported SFF sprite expanded in memory, only sprites
 * that were actually evicted and then requested again are admitted. Indexed
 * pixels remain R8 bytes: no expensive 4x RGBA expansion.
 *
 * Keys are session-local "bank:index" identities. The cache is owned by the
 * CoreSession and released when that match closes; no character assets leak
 * across imports. Textures use immutable byte arrays; draws never mutate them.
 */
export class SpriteRestoreCache {
  constructor({maxBytes=16*1024*1024,requireRepeat=false,probationLimit=4096,
    hotBytes=0,hotMaxSpriteBytes=1024*1024}={}){
    if(!Number.isSafeInteger(maxBytes)||maxBytes<0)
      throw new RangeError('Invalid sprite restore cache budget.');
    if(!Number.isSafeInteger(probationLimit)||probationLimit<1)
      throw new RangeError('Invalid sprite cache probation capacity.');
    if(!Number.isSafeInteger(hotBytes)||hotBytes<0||
       !Number.isSafeInteger(hotMaxSpriteBytes)||hotMaxSpriteBytes<1)
      throw new RangeError('Invalid raw sprite hot cache budget.');
    this.limit=maxBytes;
    this.hotLimit=hotBytes;
    this.hotMaxSpriteBytes=hotMaxSpriteBytes;
    this.hot=new Map();
    this.hotBytes=0;this.hotHits=0;this.hotStores=0;
    this.hotEvictions=0;
    this.requireRepeat=!!requireRepeat;
    this.probationLimit=probationLimit;
    this.probation=new Set();
    this.deferredAdmissions=0;this.promotions=0;
    this.entries=new Map();
    this.bytes=0;this.hits=0;this.misses=0;this.evictions=0;this.stores=0;
    this.compressedEntries=0;this.rawBytesSaved=0;this.decompressions=0;
  }
  get(id){
    const entry=this.entries.get(id);
    if(!entry){this.misses++;return null;}
    // LRU refresh is cheap relative to restoring and re-uploading an evicted
    // multi-kilobyte sprite, and only occurs on actual cache re-use.
    this.entries.delete(id);this.entries.set(id,entry);
    this.hits++;
    if(entry.compressed) {
      const hot=this.hot.get(id);
      if(hot){
        this.hot.delete(id);this.hot.set(id,hot);
        this.hotHits++;
        return hot;
      }
      this.decompressions++;
      const pixels=unpackSparseR8(entry.data,entry.originalBytes);
      if(this.hotLimit && pixels.length<=this.hotMaxSpriteBytes &&
         pixels.length<=this.hotLimit){
        while(this.hotBytes+pixels.length>this.hotLimit){
          const oldest=this.hot.keys().next().value;
          if(oldest===undefined)break;
          const old=this.hot.get(oldest);
          this.hot.delete(oldest);this.hotBytes-=old.byteLength;
          this.hotEvictions++;
        }
        this.hot.set(id,pixels);
        this.hotBytes+=pixels.length;
        this.hotStores++;
      }
      return pixels;
    }
    return entry.data;
  }
  put(id,pixels,{indexed=false,preload=false}={}){
    if(typeof id!=='string'||!(pixels instanceof Uint8Array)||!pixels.length||
       pixels.byteLength>this.limit||!this.limit)
      return false;
    // Streaming animations and large stages request thousands of different
    // evicted sprites only once. Previously every miss was copied into the
    // 16 MiB cache, evicting everything and yielding zero cache hits.
    // Admit a pixel allocation only after this id has been restored twice.
    if(this.requireRepeat && !preload && !this.entries.has(id)){
      if(!this.probation.has(id)){
        this.probation.add(id);
        if(this.probation.size>this.probationLimit)
          this.probation.delete(this.probation.values().next().value);
        this.deferredAdmissions++;
        return false;
      }
      this.probation.delete(id);
      this.promotions++;
    }
    // Offline startup warmup may admit a sprite on its first visit. Combat
    // still honors the existing second-chance policy for non-preloaded art.
    if(preload)this.probation.delete(id);
    // An overwrite makes previous uncompressed bytes obsolete.
    this.removeHot(id);
    const old=this.entries.get(id);
    if(old){
      this.entries.delete(id);this.bytes-=old.data.byteLength;
      if(old.compressed){
        this.compressedEntries--;
        this.rawBytesSaved-=old.originalBytes-old.data.byteLength;
      }
    }
    // Large MUGEN SFF R8 images frequently consist mostly of transparent
    // index-zero padding. Compact that padding rather than retaining hundreds
    // of rarely reused expanded sprites. Fallback is an immutable raw copy.
    let compressed=false, retained;
    if(indexed && pixels.length>=1024 && likelySparseR8(pixels)){
      const packed=packSparseR8(pixels);
      if(packed.length<=pixels.length*0.75){
        retained=new Uint8Array(packed);
        compressed=true;
      }
    }
    if(!retained)retained=new Uint8Array(pixels);
    while(this.bytes+retained.byteLength>this.limit){
      const oldest=this.entries.keys().next().value;
      if(oldest===undefined)break;
      const victim=this.entries.get(oldest);
      this.entries.delete(oldest);this.bytes-=victim.data.byteLength;
      this.removeHot(oldest);
      if(victim.compressed){
        this.compressedEntries--;
        this.rawBytesSaved-=victim.originalBytes-victim.data.byteLength;
      }
      this.evictions++;
    }
    this.entries.set(id,{data:retained,originalBytes:pixels.length,compressed});
    this.bytes+=retained.byteLength;this.stores++;
    if(compressed){
      this.compressedEntries++;
      this.rawBytesSaved+=pixels.length-retained.byteLength;
    }
    return true;
  }
  /** Inspect preloaded immutable bytes without moving LRU order or inflating
   * combat cache hit/miss counters. Used only during NOW LOADING GPU warmup. */
  peek(id){
    const entry=this.entries.get(id);
    if(!entry)return null;
    return entry.compressed
      ? unpackSparseR8(entry.data,entry.originalBytes):entry.data;
  }
  removeHot(id){
    const old=this.hot.get(id);
    if(!old)return;
    this.hot.delete(id);
    this.hotBytes=Math.max(0,this.hotBytes-old.byteLength);
  }
  get stats(){
    return {hits:this.hits,misses:this.misses,stores:this.stores,
      evictions:this.evictions,bytes:this.bytes,entries:this.entries.size,
      budgetBytes:this.limit,deferredAdmissions:this.deferredAdmissions,
      promotions:this.promotions,probationEntries:this.probation.size,
      compressedEntries:this.compressedEntries,rawBytesSaved:this.rawBytesSaved,
      decompressions:this.decompressions,
      hotBytes:this.hotBytes,hotBudgetBytes:this.hotLimit,
      hotEntries:this.hot.size,hotHits:this.hotHits,
      hotStores:this.hotStores,hotEvictions:this.hotEvictions};
  }
  clear(){
    this.entries.clear();this.probation.clear();this.bytes=0;
    this.hot.clear();this.hotBytes=0;
    this.compressedEntries=0;this.rawBytesSaved=0;
  }
}
