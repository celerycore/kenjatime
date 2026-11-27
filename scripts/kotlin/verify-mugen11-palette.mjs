import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { sff } from '../../src/formats.js';
import { paletteRgba } from '../../src/kotlin/sprite-palette.js';

const [game, modulePath, caseName, expectedPath] = process.argv.slice(2);
assert.ok(expectedPath && ['hit', 'guard', 'projectile', 'moving-projectile'].includes(caseName),
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
const handle = api.ktCoreCreateFromArchives('Palette Probe 1', 'Palette Probe 2',
    ...both('probe.air'), cns(1), cns(2), ...both('probe.cmd'), text(1, 'ktpal1.def'), text(2, 'ktpal2.def'));
try {
    api.ktCoreSetup(handle, -32 * 256, 0, 32 * 256, 0);
    api.ktCoreConfigureArena(handle, -160, 160, 0, false, true);
    const banks = [sff(file(1, 'probe.sff')), sff(file(2, 'probe.sff'))];
    const frames = [], contacts = [];
    for (let tick = 0; tick < 78; tick++) {
        api.ktCoreAdvance(handle, 0, '', guarded ? 8 : 0, '');
        const plan = JSON.parse(api.ktCoreRenderPlan(handle, 0));
        frames.push(banks.map((bank, side) => {
            const draw = plan.draws.find(sprite => sprite.kind === 'fighter' && sprite.side === side);
            const sprite = bank.sprites.findIndex(entry => entry.group === draw.group && entry.number === draw.number);
            const pixel = bank.decode(sprite).rgba.subarray(0, 4);
            return [...paletteRgba(pixel, draw.palFX).subarray(0, 3)];
        }));
        for (const contact of JSON.parse(api.ktCoreContacts(handle))) contacts.push({tick, ...contact});
    }
    assert.equal(api.ktCoreIssues(handle), '');
    assert.equal(contacts.length, 1);
    const {tick: impact, attacker, defender, guarded: wasGuarded, damage} = contacts[0];
    assert.deepEqual([attacker, defender, wasGuarded, damage], [projectile ? 3 : 1, 2, guarded, guarded ? 2 : 10]);
    if (projectile) {
        const firstWindup = frames.findIndex(([left]) => left.join(',') === '20,190,70');
        assert.ok(firstWindup >= 0, 'Projectile windup was not rendered.');
        assert.equal(impact - firstWindup, reference.launchToContactTicks[caseName], `${caseName} launch to contact ticks`);
    }
    for (const [tick, left, right] of expected) {
        assert.deepEqual(frames[impact + tick], [left, right], `${caseName} tick ${tick}`);
    }
    console.log(`${caseName}: ${expected.length} native RGB samples matched on both fighters.`);
} finally {
    api.ktCoreRelease(handle);
}
