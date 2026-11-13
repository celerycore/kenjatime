/**
 * Palette index for immutable imported SFF sprite banks.
 *
 * Preserve Array.prototype.find's FIRST matching palette index, including
 * pathological archives with duplicate entries. Build this once when
 * CoreSession first opens a bank, then use O(1) lookup per drawn sprite.
 */
export function firstPaletteByIndex(palettes){
  const result=new Map();
  for(const palette of palettes||[]){
    if(!result.has(palette.index))result.set(palette.index,palette);
  }
  return result;
}
