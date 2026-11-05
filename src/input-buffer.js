/** Timestamped physical-source snapshots retain a short press until a simulation tick. */
export class TickInputBuffer {
  constructor(){this.reset();}
  reset(){this.sources=new Map();this.sampled=new Map();this.queue=[];this.offset=0;}
  clearSource(source){this.sources.delete(source);this.sampled.delete(source);this.queue=this.queue.slice(this.offset).filter(event=>event.source!==source);this.offset=0;}
  record(source,keys,time){const next=new Set(keys),previous=this.sources.get(source)||new Set();if(next.size===previous.size&&[...next].every(key=>previous.has(key)))return;this.sources.set(source,next);const event={source,keys:next,time};let index=this.queue.length;while(index>this.offset&&this.queue[index-1].time>time)index--;this.queue.splice(index,0,event);}
  sample(time){
    const pressed=new Set();
    while(this.offset<this.queue.length&&this.queue[this.offset].time<=time){const event=this.queue[this.offset++],previous=this.sampled.get(event.source)||new Set();for(const key of event.keys)if(!previous.has(key))pressed.add(key);this.sampled.set(event.source,event.keys);}
    const held=new Set(pressed);for(const keys of this.sampled.values())for(const key of keys)held.add(key);
    if(this.offset>128){this.queue.splice(0,this.offset);this.offset=0;}return held;
  }
}

export const DEFAULT_GAMEPAD_BUTTONS=Object.freeze({0:'a',1:'b',2:'x',3:'y',4:'z',5:'c',9:'s'});
/** Standard USB/Bluetooth layout; custom layouts require an explicit opt-in. */
export function gamepadKeys(pad,{deadzone=.25,buttons=DEFAULT_GAMEPAD_BUTTONS,customLayout=false}={}){
  const keys=new Set();if(!pad?.connected||pad.mapping!=='standard'&&!customLayout)return keys;
  const pressed=index=>{const b=pad.buttons?.[index];return typeof b==='number'?b>=.5:!!b?.pressed||b?.value>=.5;};
  deadzone=Number.isFinite(deadzone)?Math.max(.1,Math.min(.9,deadzone)):.25;
  // A deliberate D-pad press takes priority over stick drift on that axis.
  for(const [axis,negative,positive,minus,plus]of [[0,14,15,'L','R'],[1,12,13,'U','D']]){
    const n=pressed(negative),p=pressed(positive),value=pad.axes?.[axis]||0;
    if(n||p){if(n&&!p)keys.add(minus);if(p&&!n)keys.add(plus);}
    else{if(value < -deadzone)keys.add(minus);if(value > deadzone)keys.add(plus);}
  }
  for(const [index,key]of Object.entries(buttons))if(['a','b','c','x','y','z','s'].includes(key)&&pressed(+index))keys.add(key);
  return keys;
}
