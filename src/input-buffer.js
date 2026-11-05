/** Timestamped physical-source snapshots retain a short press until a simulation tick. */
export class TickInputBuffer {
  constructor(){this.reset();}
  reset(){this.sources=new Map();this.sampled=new Map();this.queue=[];this.offset=0;}
  record(source,keys,time){const next=new Set(keys),previous=this.sources.get(source)||new Set();if(next.size===previous.size&&[...next].every(key=>previous.has(key)))return;this.sources.set(source,next);const event={source,keys:next,time};let index=this.queue.length;while(index>this.offset&&this.queue[index-1].time>time)index--;this.queue.splice(index,0,event);}
  sample(time){
    const pressed=new Set();
    while(this.offset<this.queue.length&&this.queue[this.offset].time<=time){const event=this.queue[this.offset++],previous=this.sampled.get(event.source)||new Set();for(const key of event.keys)if(!previous.has(key))pressed.add(key);this.sampled.set(event.source,event.keys);}
    const held=new Set(pressed);for(const keys of this.sampled.values())for(const key of keys)held.add(key);
    if(this.offset>128){this.queue.splice(0,this.offset);this.offset=0;}return held;
  }
}

/** Standard Gamepad layout. Poll on simulation callbacks, independently of rendering. */
export function gamepadKeys(pad){
  const keys=new Set();if(!pad?.connected||pad.mapping!=='standard')return keys;
  const pressed=index=>!!pad.buttons[index]?.pressed;
  if(pad.axes[0]<-.25||pressed(14))keys.add('L');if(pad.axes[0]>.25||pressed(15))keys.add('R');
  if(pad.axes[1]<-.25||pressed(12))keys.add('U');if(pad.axes[1]>.25||pressed(13))keys.add('D');
  for(const [index,key]of [[0,'a'],[1,'b'],[2,'x'],[3,'y'],[4,'z'],[5,'c'],[9,'s']])if(pressed(index))keys.add(key);return keys;
}
