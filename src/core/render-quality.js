/** R8-only presentation resolution presets.
 * Combat still executes at 60 deterministic ticks/sec; only the WebGL
 * framebuffer changes size. The canvas is CSS-scaled to its usual area.
 */
export const R8_PERFORMANCE_SCALE=0.7;
export function normalizeQuality(value){
  return value==='performance'||value==='sharp'?value:'auto';
}
export function qualityStartingScale(value){
  return normalizeQuality(value)==='performance'?R8_PERFORMANCE_SCALE:1;
}
export function nextQuality(value){
  const quality=normalizeQuality(value);
  return quality==='auto'?'performance':quality==='performance'?'sharp':'auto';
}
export function qualityLabel(value){
  const quality=normalizeQuality(value);
  return quality==='performance'?'Performance':quality==='sharp'?'Sharp':'Auto';
}
