/** Optional fight viewport, independent of character/state-coordinate physics. */
export const PRESENTATION_WIDE = 'widescreen-16-9';
export const PRESENTATION_NATIVE = 'native-4-3';
export function normalizePresentation(value) {
  return value === PRESENTATION_NATIVE ? PRESENTATION_NATIVE : PRESENTATION_WIDE;
}
export function presentationAspect(value) {
  return normalizePresentation(value) === PRESENTATION_NATIVE ? 4 / 3 : 16 / 9;
}
export function presentationViewport(value, frameWidth = 960, frameHeight = 540) {
  const aspect = presentationAspect(value);
  if (!(frameWidth > 0 && frameHeight > 0)) throw Error('Invalid presentation viewport dimensions.');
  const width = Math.min(frameWidth, frameHeight * aspect);
  const height = width / aspect;
  return { x: (frameWidth - width) / 2, y: (frameHeight - height) / 2, width, height, aspect };
}
