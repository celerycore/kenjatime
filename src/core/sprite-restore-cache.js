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
  constructor({maxBytes=16*1024*1024}={}){
    if(!Number.isSafeInteger(maxBytes)||maxBytes<0)
      throw new RangeError('Invalid sprite restore cache budget.');
    this.limit=maxBytes;
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
      budgetBytes:this.limit};
  }
  clear(){
    this.entries.clear();this.bytes=0;
  }
}
