/** Keep uploaded textures in the surface LRU; decoded pixels belong to the bank's
 * own bounded cache. Otherwise large animated sprites retain each pixel bank
 * twice and evict the same textures on every frame. */
function opaquePixels(decoded){
  const rgba=new Uint8ClampedArray(decoded.rgba);
  for(let i=3;i<rgba.length;i+=4)if(!decoded.indices||decoded.indices[(i-3)/4]===0)rgba[i]=255;
  return rgba;
}

function pixelReader(bank,index,remap,opaque,indices=false){
  return()=>{
    const decoded=remap?bank.decodeWithPalette(index,...remap):bank.decode(index);
    return indices?decoded.indices:opaque?opaquePixels(decoded):decoded.rgba;
  };
}

export function spritePalette(bank,index){
  const seen=new Set();let sp=bank.sprites[index];
  while(sp&&sp.palette===undefined&&!sp.length&&!seen.has(sp)){seen.add(sp);sp=bank.sprites[sp.link];}
  return bank.palettes?.[sp?.palette];
}

export function createSpriteSurface(bank,index,{key,remap=null,opaque=false,onPaletteError=()=>{},createCanvas=()=>document.createElement('canvas'),createImageData=(rgba,w,h)=>new ImageData(rgba,w,h)}={}){
  let decoded;
  try{decoded=remap?bank.decodeWithPalette(index,...remap):bank.decode(index);}
  catch(error){if(!remap)throw error;onPaletteError(error);remap=null;decoded=bank.decode(index);}
  const {rgba,indices,...metadata}=decoded,indexed=bank.version===1||!!indices,opaqueMode=opaque&&indexed;
  const canvas=createCanvas();canvas.width=decoded.w;canvas.height=decoded.h;
  canvas.getContext('2d').putImageData(createImageData(opaqueMode?opaquePixels(decoded):rgba,decoded.w,decoded.h),0,0);
  const result={...metadata,canvas,key,indexed};
  Object.defineProperties(result,{rgba:{get:pixelReader(bank,index,remap,opaqueMode)},indices:{get:pixelReader(bank,index,remap,opaqueMode,true)}});
  return result;
}
