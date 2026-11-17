/** Apply Kotlin-resolved palette layers to straight RGBA bytes; alpha is unchanged. */
let scratch=new Uint8ClampedArray(0);
export function paletteRgba(source,layers){
  if(scratch.length<source.length)scratch=new Uint8ClampedArray(source.length);
  const output=scratch.subarray(0,source.length),colors=new Map();
  for(let p=0;p<source.length;p+=4){
    const alpha=source[p+3];output[p+3]=alpha;
    if(alpha===0){output[p]=source[p];output[p+1]=source[p+1];output[p+2]=source[p+2];continue}
    const key=(source[p]<<16)|(source[p+1]<<8)|source[p+2];
    let rgb=colors.get(key);
    if(!rgb){
      rgb=[source[p],source[p+1],source[p+2]];
      for(const layer of layers){
       for(let iteration=0;iteration<(layer.repeat??1);iteration++){
        const grey=.299*rgb[0]+.587*rgb[1]+.114*rgb[2];
        rgb=rgb.map((channel,i)=>{
          let n=layer.color===256?channel:grey+(channel-grey)*layer.color/256;
          if(layer.invert)n=255-n;
          return Math.max(0,Math.min(255,(n+layer.add[i])*layer.mul[i]/256+(layer.post?.[i]??0)));
        });
       }
      }
      rgb=rgb.map(n=>Math.max(0,Math.min(255,Math.floor(n+1e-9))));
      if(colors.size<4096)colors.set(key,rgb);
    }
    output[p]=rgb[0];output[p+1]=rgb[1];output[p+2]=rgb[2];
  }
  return output;
}
/** Describe authored palette IDs without decoding any sprite pixels. */
export function paletteCatalog(bank) {
  const palettes = new Map();
  for (const palette of bank.palettes) {
    const key = palette.group + "," + palette.number;
    if (palette.colors > 0 && palette.colors <= 256 && !palettes.has(key)) {
      palettes.set(key, key + "," + Math.ceil(Math.log2(palette.colors)));
    }
  }
  const sprites = new Map();
  const bases = new Map();
  function baseIndex(start) {
    let index = start;
    const visited = new Set();
    while (bank.sprites[index] && !bases.has(index) && !visited.has(index)) {
      visited.add(index);
      const sprite = bank.sprites[index];
      if (sprite.length) {
        bases.set(index, index);
        break;
      }
      index = sprite.link;
    }
    const base = bases.get(index) ?? -1;
    for (const link of visited) bases.set(link, base);
    return base;
  }
  const seen = new Set();
  for (const [index, sprite] of bank.sprites.entries()) {
    const key = sprite.group + "," + sprite.number;
    if (seen.has(key)) continue;
    seen.add(key);
    const base = bank.sprites[baseIndex(index)];
    if (!base) continue;
    const indexed = bank.version === 1 || base.format === 10 ||
      (base.format < 10 && [5, 8].includes(base.depth));
    if (!indexed) continue;
    const palette = bank.palettes[bank.version === 1 ? base.palette : sprite.palette];
    if (!palette) continue;
    const source = palette.group + "," + palette.number;
    if (palettes.has(source)) sprites.set(key, key + "," + source);
  }
  return {
    palettes: [...palettes.values()].join(";"),
    sprites: [...sprites.values()].join(";"),
  };
}
