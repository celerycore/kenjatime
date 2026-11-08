// libopenmpt is initialized only for a match containing tracker files. Decode
// bounded blocks on demand through the bounded native-rate PCM mixer, never an entire song to RAM.
const libraryURL=new URL('../node_modules/chiptune3/libopenmpt.worklet.js',import.meta.url);
export async function createModuleMusic(){
 const {default:factory}=await import(/* @vite-ignore */ libraryURL.href);
 const lib=await factory();let active=0;const streams=new Set();
 return{get active(){return active;},close(){for(const stream of [...streams])stream.close();},open(bytes,rate){
  if(!(bytes instanceof Uint8Array)||!bytes.length||bytes.length>128*1024*1024)throw Error('Invalid module music data.');
  if(!Number.isInteger(rate)||rate<8000||rate>192000)throw Error('Invalid module sample rate.');
  const input=lib._malloc(bytes.length);let pointer;
  try{lib.HEAPU8.set(bytes,input);pointer=lib._openmpt_module_create_from_memory(input,bytes.length,0,0,0);}finally{lib._free(input);}
  if(!pointer)throw Error('The module music is damaged or unsupported.');
  const seconds=lib._openmpt_module_get_duration_seconds(pointer),length=Math.min(2147483647,Math.round(seconds*rate));
  if(!Number.isFinite(length)||length<=0){lib._openmpt_module_destroy(pointer);throw Error('Invalid module duration.');}
  lib._openmpt_module_set_repeat_count(pointer,0);
  const buffer=lib._malloc(2048*8);active++;let position=0,heap;
  const stream={length,position:0,pcm:null,read(count){
   if(!pointer)return 0;count=Math.max(0,Math.min(2048,Math.floor(count),length-position));
   const frames=lib._openmpt_module_read_interleaved_float_stereo(pointer,rate,count,buffer);
   if(heap!==lib.HEAPU8.buffer){heap=lib.HEAPU8.buffer;stream.pcm=new Uint8Array(heap,buffer,2048*8);}
   position+=frames;stream.position=position;return frames;
  },seek(sample){
   if(!pointer||!Number.isInteger(sample)||sample<0||sample>length)throw Error('Invalid module seek.');
   const actual=lib._openmpt_module_set_position_seconds(pointer,Math.max(0,sample/rate-.1));position=Math.max(0,Math.round(actual*rate));
   while(position<sample){const n=stream.read(Math.min(2048,sample-position));if(!n)break;}
   stream.position=position;return position;
  },close(){if(!pointer)return;lib._openmpt_module_destroy(pointer);lib._free(buffer);pointer=0;stream.pcm=null;streams.delete(stream);active--;}};
  streams.add(stream);
  return stream;
 }};
}
