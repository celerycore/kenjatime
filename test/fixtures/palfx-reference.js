// Preserve the preceding implementation as an independent regression oracle
// for operation order, channel clamping and final truncation, not native proof.
export function referencePalFx(rgba,palette){
  const clamp=(v,lo=0,hi=255)=>Math.max(lo,Math.min(hi,v));
  const triple=(v,f)=>Array.isArray(v)?v.slice(0,3).map((n,i)=>Number(n??f[i])):[...f];
  const layers=palette?.layers||(palette?[palette]:[]),out=new Uint8ClampedArray(rgba);
  for(let p=0;p<out.length;p+=4){
    if(!out[p+3])continue;let rgb=[out[p],out[p+1],out[p+2]];
    for(const fx of layers){
      const color=clamp(fx.color??256,0,256)/256,grey=rgb[0]*.299+rgb[1]*.587+rgb[2]*.114;
      const add=triple(fx.add,[0,0,0]),mul=triple(fx.mul,[256,256,256]),sin=fx.sinadd||[0,0,0,0],wave=sin[3]?Math.sin(2*Math.PI*(fx.age||0)/sin[3]):0;
      rgb=rgb.map((v,i)=>{v=grey+(v-grey)*color;if(fx.invertall)v=255-v;return clamp((v+add[i]+Number(sin[i]||0)*wave)*mul[i]/256+Number(fx.postadd?.[i]||0));});
    }
    for(let c=0;c<3;c++)out[p+c]=Math.trunc(rgb[c]+1e-8);
  }
  return out;
}
