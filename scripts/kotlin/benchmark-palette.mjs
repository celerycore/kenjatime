import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { packageFiles, sff } from '../../src/formats.js';
import { paletteRgba } from '../../src/kotlin/sprite-palette.js';

const baseline = process.argv[2];
assert.ok(baseline, 'Pass a baseline Git ref to compare its palette transform.');
const source = execFileSync('git', ['show', `${baseline}:src/kotlin/sprite-palette.js`]);
const { paletteRgba: original } = await import('data:text/javascript;base64,' + source.toString('base64'));

const files = packageFiles(readFileSync(new URL('../../public/kfm.zip', import.meta.url)));
const kfm = sff(files[Object.keys(files).find(name => name.endsWith('/kfm.sff'))]);
const sprites = kfm.sprites.slice(10, 46).map((_, index) => kfm.decode(index + 10).rgba);
let seed = 20261127;
const trueColor = Uint8ClampedArray.from({length: 256 * 256 * 4}, (_, index) => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return index % 33 === 0 && index % 4 === 3 ? 0 : seed >>> 24;
});
const layers = [
    { add: [64, -32, 32], mul: [192, 320, 256], color: 256, invert: false },
    { add: [-31, 22, 5], mul: [240, 180, 288], post: [1.5, -2, 3], color: 160, invert: true, repeat: 2 },
];

function measure(transform, images, batches) {
    const start = performance.now();
    for (let batch = 0; batch < batches; batch++) {
        for (const image of images) transform(image, layers);
    }
    return (performance.now() - start) / batches;
}

const median = values => values.toSorted((a, b) => a - b)[Math.floor(values.length / 2)];
for (const [name, images, batches] of [
    ['KFM sprites', sprites, 28],
    ['Synthetic true-color', [trueColor], 14],
]) {
    for (const image of images) assert.deepEqual(paletteRgba(image, layers), original(image, layers));
    const before = [], after = [];
    measure(original, images, 10);
    measure(paletteRgba, images, 10);
    for (let trial = 0; trial < 11; trial++) {
        if (trial % 2 === 0) before.push(measure(original, images, batches));
        after.push(measure(paletteRgba, images, batches));
        if (trial % 2 === 1) before.push(measure(original, images, batches));
    }
    const beforeMs = median(before);
    const afterMs = median(after);
    console.log(JSON.stringify({name, pixels: images.reduce((n, image) => n + image.length / 4, 0),
        beforeMs, afterMs, speedup: beforeMs / afterMs, differentBytes: 0}));
}
