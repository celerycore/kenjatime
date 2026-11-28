import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { performance } from 'node:perf_hooks';

const [before, after, mode = 'guard'] = process.argv.slice(2);
assert.ok(before && after && ['guard', 'clash'].includes(mode),
    'Pass paths to equivalent baseline and candidate Wasm modules, followed by optional guard or clash mode.');
const clashes = mode === 'clash';
const modules = await Promise.all([before, after].map(path => import(pathToFileURL(resolve(path)).href)));
const air = `[Begin Action 0]
Clsn2Default: 1
Clsn2[0] = -12,-48,12,0
0,0,0,0,-1
[Begin Action 1]
Clsn1Default: 1
Clsn1[0] = -8,-24,8,0
Clsn2Default: 1
Clsn2[0] = -8,-24,8,0
0,1,0,0,-1`;
const idle = '[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=0';
const frames = 800;
const warmup = 250;
const trials = 7;

function run(api, projectiles) {
    const count = clashes ? projectiles / 2 : projectiles;
    const cns = idle + Array.from({length: count}, (_, id) => `\n[State 0, shot ${id}]
type=Projectile
trigger1=Time=0
projid=${id + 1}
projanim=1
offset=${clashes ? -64 - id * 18 : id % 12},0
velocity=0.03125,0
projremovetime=-1
attr=S, SP
guard.dist=${clashes ? 0 : 192}
`).join('');
    const fight = api.ktCoreCreateFromArchives('Projectile stream', 'Target', air, air, cns, clashes ? cns : idle,
        '', '', '', '');
    try {
        api.ktCoreSetup(fight, -64 * 256, 0, 64 * 256, 0);
        const advance = () => api.ktCoreAdvance(fight, 0, '', 0, '');
        for (let tick = 0; tick < warmup; tick++) advance();
        const start = performance.now();
        for (let tick = 0; tick < frames; tick++) advance();
        const elapsed = performance.now() - start;
        const shots = api.ktCoreProjectiles(fight);
        const defender = api.ktCoreSnapshot(fight, 1);
        assert.equal(JSON.parse(shots).length, projectiles);
        assert.equal(JSON.parse(defender).inGuardDist, !clashes);
        assert.equal(api.ktCoreProjectileClashes(fight), '[]');
        assert.equal(api.ktCoreContacts(fight), '[]');
        assert.equal(api.ktCoreIssues(fight), '');
        return {msPerTick: elapsed / frames, state: [api.ktCoreChecksum(fight), api.ktCoreSnapshot(fight, 0), defender, shots]};
    } finally {
        api.ktCoreRelease(fight);
    }
}

for (const projectiles of [16, 256]) {
    const samples = [[], []];
    for (let trial = 0; trial < trials; trial++) {
        // Alternate order to balance warmup and changes in CPU load.
        const first = trial % 2;
        const results = [];
        results[first] = run(modules[first], projectiles);
        results[1 - first] = run(modules[1 - first], projectiles);
        assert.deepEqual(results[0].state, results[1].state);
        for (const [index, result] of results.entries()) samples[index].push(result.msPerTick);
    }
    const [baseline, candidate] = samples.map(sample => sample.sort((a, b) => a - b)[Math.floor(trials / 2)]);
    console.log(`${projectiles} moving projectiles, ${clashes ? 'two teams' : 'one team'}, ${frames} ticks per trial, ${trials} trials. ` +
        `Median ${baseline.toFixed(3)} → ${candidate.toFixed(3)} ms/tick (${(baseline / candidate).toFixed(2)}×). ` +
        'Final states match.');
}
