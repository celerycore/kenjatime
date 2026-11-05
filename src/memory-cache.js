/** Byte-bounded least-recently-used cache. Oversized values remain caller-owned. */
export class MemoryLRU {
  constructor({maxBytes=16*1024*1024,maxEntries=512,sizeOf=value=>value?.rgba?.byteLength||0}={}){this.maxBytes=maxBytes;this.maxEntries=maxEntries;this.sizeOf=sizeOf;this.entries=new Map();this.bytes=0;this.hits=0;this.misses=0;this.evictions=0;}
  get size(){return this.entries.size;}
  has(key){return this.entries.has(key);}
  get(key){const entry=this.entries.get(key);if(!entry){this.misses++;return undefined;}this.hits++;this.entries.delete(key);this.entries.set(key,entry);return entry.value;}
  set(key,value){this.delete(key);const bytes=Math.max(0,this.sizeOf(value)||0);if(bytes>this.maxBytes||this.maxEntries<1)return this;this.entries.set(key,{value,bytes});this.bytes+=bytes;while(this.bytes>this.maxBytes||this.size>this.maxEntries){this.delete(this.entries.keys().next().value);this.evictions++;}return this;}
  delete(key){const entry=this.entries.get(key);if(!entry)return false;this.bytes-=entry.bytes;return this.entries.delete(key);}
  clear(){this.entries.clear();this.bytes=0;}
}
