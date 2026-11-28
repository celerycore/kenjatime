let scratch = new Uint8ClampedArray(0);
const clampChannel = value => Math.max(0, Math.min(255, value));

/** Apply Kotlin-resolved palette layers to straight RGBA bytes; alpha is unchanged. */
export function paletteRgba(source, layers) {
  if (scratch.length < source.length) scratch = new Uint8ClampedArray(source.length);
  const output = scratch.subarray(0, source.length);
  const colors = new Map();
  let previousKey = -1;
  let previousRgb = 0;
  for (let p = 0; p < source.length; p += 4) {
    const alpha = source[p + 3];
    output[p + 3] = alpha;
    if (alpha === 0) {
      output[p] = source[p];
      output[p + 1] = source[p + 1];
      output[p + 2] = source[p + 2];
      continue;
    }
    const key = (source[p] << 16) | (source[p + 1] << 8) | source[p + 2];
    let rgb = previousRgb;
    if (key !== previousKey) {
      rgb = colors.get(key);
      if (rgb === undefined) {
        let red = key >> 16;
        let green = (key >> 8) & 255;
        let blue = key & 255;
        for (const {color, invert, add, mul, post, repeat} of layers) {
          for (let iteration = 0; iteration < (repeat ?? 1); iteration++) {
            if (color !== 256) {
              const grey = .299 * red + .587 * green + .114 * blue;
              red = grey + (red - grey) * color / 256;
              green = grey + (green - grey) * color / 256;
              blue = grey + (blue - grey) * color / 256;
            }
            if (invert) {
              red = 255 - red;
              green = 255 - green;
              blue = 255 - blue;
            }
            red = clampChannel((red + add[0]) * mul[0] / 256 + (post?.[0] ?? 0));
            green = clampChannel((green + add[1]) * mul[1] / 256 + (post?.[1] ?? 0));
            blue = clampChannel((blue + add[2]) * mul[2] / 256 + (post?.[2] ?? 0));
          }
        }
        rgb = (Math.floor(red + 1e-9) << 16) | (Math.floor(green + 1e-9) << 8) | Math.floor(blue + 1e-9);
        if (colors.size < 4096) colors.set(key, rgb);
      }
      previousKey = key;
      previousRgb = rgb;
    }
    output[p] = rgb >> 16;
    output[p + 1] = (rgb >> 8) & 255;
    output[p + 2] = rgb & 255;
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
