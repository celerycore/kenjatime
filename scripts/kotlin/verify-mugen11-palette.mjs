import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { sff } from '../../src/formats.js';
import { paletteRgba } from '../../src/kotlin/sprite-palette.js';

const [game, modulePath, caseName, expectedPath] = process.argv.slice(2);
const lifecycle = caseName === 'projectile-lifecycle';
assert.ok(expectedPath && (lifecycle || ['hit', 'guard', 'projectile', 'moving-projectile'].includes(caseName)),
    'Pass the prepared game directory, Wasm module, probe case, and native trace.');
const reference = JSON.parse(readFileSync(expectedPath, 'utf8'));
const expected = reference.probes[caseName];
const api = await import(pathToFileURL(resolve(modulePath)).href);
const shared = readFileSync(`${game}/data/common1.cns`, 'latin1');
const file = (side, name) => readFileSync(`${game}/chars/ktpal${side}/${name}`);
const text = (side, name) => file(side, name).toString('latin1');
const both = name => [text(1, name), text(2, name)];
const cns = side => [shared, text(side, 'base.cns').split(/^\[statedef\s/im)[0], text(side, 'probe.st')].join('\n');
const guarded = caseName === 'guard';
const projectile = caseName.endsWith('projectile');
const markers = ['timed', 'expired', 'shot', 'hit', 'clash-left', 'cancelled-left', 'clash-right', 'cancelled-right'];
const windup = ([left]) => left.join(',') === '20,190,70';
const handle = api.ktCoreCreateFromArchives('Palette Probe 1', 'Palette Probe 2',
    ...both('probe.air'), cns(1), cns(2), ...both('probe.cmd'), text(1, 'ktpal1.def'), text(2, 'ktpal2.def'));
try {
    api.ktCoreSetup(handle, -32 * 256, 0, 32 * 256, 0);
    api.ktCoreConfigureArena(handle, -160, 160, 0, false, true);
    const banks = [sff(file(1, 'probe.sff')), sff(file(2, 'probe.sff'))];
    const frames = [], contacts = [], projectileFrames = [], clashes = [];
    for (let tick = 0; tick < 78; tick++) {
        api.ktCoreAdvance(handle, 0, '', guarded ? 8 : 0, '');
        const plan = JSON.parse(api.ktCoreRenderPlan(handle, 0));
        frames.push(banks.map((bank, side) => {
            const draw = plan.draws.find(sprite => sprite.kind === 'fighter' && sprite.side === side);
            const sprite = bank.sprites.findIndex(entry => entry.group === draw.group && entry.number === draw.number);
            const pixel = bank.decode(sprite).rgba.subarray(0, 4);
            return [...paletteRgba(pixel, draw.palFX).subarray(0, 3)];
        }));
        if (lifecycle) {
            const active = JSON.parse(api.ktCoreProjectiles(handle));
            const positions = {};
            for (const draw of plan.draws.filter(draw => draw.kind === 'projectile')) {
                assert.ok(markers[draw.number - 4], `Unrecognized projectile sprite ${draw.number}`);
                if (draw.number % 2 === 1) {
                    const id = 210 + Math.floor((draw.number - 4) / 2) * 10;
                    assert.ok(!active.some(shot => shot.id === id), 'Removal sprite was listed as active');
                }
                const worldX = (draw.axisX - 480) / (1.4 * plan.cameraZoom) + plan.cameraX;
                positions[markers[draw.number - 4]] = Math.round(worldX * 256) / 256;
            }
            projectileFrames.push(positions);
            clashes.push(...JSON.parse(api.ktCoreProjectileClashes(handle)));
        }
        for (const contact of JSON.parse(api.ktCoreContacts(handle))) contacts.push({tick, ...contact});
    }
    assert.equal(api.ktCoreIssues(handle), '');
    assert.equal(contacts.length, 1);
    const {tick: impact, attacker, defender, guarded: wasGuarded, damage} = contacts[0];
    if (lifecycle) {
        assert.deepEqual([defender, wasGuarded, damage], [2, false, 10]);
        const firstWindup = frames.findIndex(windup);
        assert.ok(firstWindup > 0, 'Projectile windup was not rendered.');
        assert.equal(impact, firstWindup);
        assert.equal(clashes.length, 1);
        assert.ok(clashes[0].firstCancelled && clashes[0].secondCancelled);
        assert.equal(api.ktCoreProjectiles(handle), '[]');
        const actual = projectileFrames.slice(firstWindup - 1, firstWindup + 12);
        assert.equal(actual.length, reference.projectileLifecycle.length);
        for (const [frame, native] of reference.projectileLifecycle.entries()) {
            assert.deepEqual(Object.keys(actual[frame]).sort(), Object.keys(native).sort(), `Projectile sprites on frame ${frame - 1}`);
            for (const [sprite, x] of Object.entries(native)) {
                // Native positions come from colored raster extents, including flipped sprite edges.
                assert.ok(Math.abs(actual[frame][sprite] - x) <= 0.5,
                    `${sprite} at frame ${frame - 1}: expected x = ${x}, got ${actual[frame][sprite]}`);
            }
        }
        console.log('Projectile hit, expiry and clash removal frames matched the native executable.');
    } else {
        assert.deepEqual([attacker, defender, wasGuarded, damage], [projectile ? 3 : 1, 2, guarded, guarded ? 2 : 10]);
        if (projectile) {
            const firstWindup = frames.findIndex(windup);
            assert.ok(firstWindup >= 0, 'Projectile windup was not rendered.');
            assert.equal(impact - firstWindup, reference.launchToContactTicks[caseName], `${caseName} launch to contact ticks`);
        }
        for (const [tick, left, right] of expected) {
            assert.deepEqual(frames[impact + tick], [left, right], `${caseName} tick ${tick}`);
        }
        console.log(`${caseName}: ${expected.length} native RGB samples matched on both fighters.`);
    }
} finally {
    api.ktCoreRelease(handle);
}
