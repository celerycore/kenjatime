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
  constructor({maxBytes=16*1024*1024,requireRepeat=false,probationLimit=4096}={}){
    if(!Number.isSafeInteger(maxBytes)||maxBytes<0)
      throw new RangeError('Invalid sprite restore cache budget.');
    if(!Number.isSafeInteger(probationLimit)||probationLimit<1)
      throw new RangeError('Invalid sprite cache probation capacity.');
    this.limit=maxBytes;
    this.requireRepeat=!!requireRepeat;
    this.probationLimit=probationLimit;
    this.probation=new Set();
    this.deferredAdmissions=0;this.promotions=0;
    this.entries=new Map();
    this.bytes=0;this.hits=0;this.misses=0;this.evictions=0;this.stores=0;
  }
  get(id){
    const pixels=this.entries.get(id);
    if(!pixels){this.misses++;return null;}
    // LRU refresh is cheap relative to restoring and re-uploading an evicted
    // multi-kilobyte sprite, and only occurs on actual cache re-use.
    this.entries.delete(id);this.entries.set(id,pixels);
    this.hits++;
    return pixels;
  }
  put(id,pixels){
    if(typeof id!=='string'||!(pixels instanceof Uint8Array)||!pixels.length||
       pixels.byteLength>this.limit||!this.limit)
      return false;
    // Streaming animations and large stages request thousands of different
    // evicted sprites only once. Previously every miss was copied into the
    // 16 MiB cache, evicting everything and yielding zero cache hits.
    // Admit a pixel allocation only after this id has been restored twice.
    if(this.requireRepeat && !this.entries.has(id)){
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
    const old=this.entries.get(id);
    if(old){
      this.entries.delete(id);this.bytes-=old.byteLength;
    }
    // Copy the decoder-owned bytes once; banks may clear their decode cache.
    const retained=new Uint8Array(pixels);
    while(this.bytes+retained.byteLength>this.limit){
      const oldest=this.entries.keys().next().value;
      if(oldest===undefined)break;
      const victim=this.entries.get(oldest);
      this.entries.delete(oldest);this.bytes-=victim.byteLength;this.evictions++;
    }
    this.entries.set(id,retained);
    this.bytes+=retained.byteLength;this.stores++;
    return true;
  }
  get stats(){
    return {hits:this.hits,misses:this.misses,stores:this.stores,
      evictions:this.evictions,bytes:this.bytes,entries:this.entries.size,
      budgetBytes:this.limit,deferredAdmissions:this.deferredAdmissions,
      promotions:this.promotions,probationEntries:this.probation.size};
  }
  clear(){
    this.entries.clear();this.probation.clear();this.bytes=0;
  }
}
