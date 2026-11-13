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

/** R8 browser battles should begin in the mobile preset on actual touch
 * devices, not silently at full 960x540 when the user forgets to tap Visuals.
 * This does not change simulation speed, script timing or hitboxes.
 * Desktop and coarse-pointer-free computers retain Auto by default.
 */
export function defaultQualityForDevice({
  coarsePointer=false,touchPoints=0,viewportWidth=0,
}={}){
  return coarsePointer ||
    (Number(touchPoints)>0 && Number(viewportWidth)>0 && viewportWidth<=900)
    ? 'performance' : 'auto';
}
