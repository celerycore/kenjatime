import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { decodeText, packageFiles } from "../../src/formats.js";
import { availableKotlinFighters } from "../../src/kotlin/archive-import.js";

// Exercise the compiled Kotlin entry points with an independently supplied
// reference distribution. Only read the packaged assets and documentation.
const archivePath = process.argv[2];
assert.ok(archivePath, "Pass the path to the MUGEN 1.1b1 ZIP after building dist-kotlin.");
const bytes = readFileSync(archivePath);
const files = packageFiles(bytes);
const paths = Object.keys(files);
const executable = paths.find(path => /(^|\/)mugen\.exe$/.test(path));
assert.ok(executable, "Missing the reference distribution's mugen.exe");
const root = executable.slice(0, -"mugen.exe".length);
const documentation = name => decodeText(files[`${root}docs/${name}.html`]);
const headings = name => [...documentation(name).matchAll(/<h2><a class="toc-backref" href="[^"]+">([^<]+)<\/a><\/h2>/g)]
    .map(match => match[1]);
const stock = availableKotlinFighters(files, "mugen11-reference");
const variants = ["kfm", "kfm720"].map(name => {
    const fighter = stock.ready.find(item => item.definitionName === name);
    assert.ok(fighter, `Could not import ${name}: ${JSON.stringify(stock.missing)}`);
    assert.match(fighter.cns, /\[statedef 40\]/i, `${name} is missing data/common1.cns`);
    return fighter;
});

const api = await import("../../dist-kotlin/wasm/kenjatime-kotlin-core.mjs");
assert.equal(typeof api.ktCoreCreateFromArchives, "function", "Build the production Kotlin/Wasm engine first");
function runMatch(left, right, separation, sample) {
    const handle = api.ktCoreCreateFromArchives(left.name, right.name,
        left.air, right.air, left.cns, right.cns, left.cmd, right.cmd, left.defText, right.defText);
    try {
        api.ktCoreSetup(handle, -separation * 256, 0, separation * 256, 0);
        api.ktCoreConfigureArena(handle, -250, 250, 0, false, true);
        return sample(handle);
    } finally {
        api.ktCoreRelease(handle);
    }
}

function replay(handle, frames, inputs) {
    const sides = [[], []];
    for (let tick = 0; tick < frames; tick++) {
        const [left, right] = inputs(tick);
        api.ktCoreAdvance(handle, left, "", right, "");
        for (let side = 0; side < sides.length; side++) {
            sides[side].push(JSON.parse(api.ktCoreSnapshot(handle, side)));
        }
    }
    return sides;
}

const statesSeen = frames => frames.map(frame => frame.state).filter((state, tick, states) => state !== states[tick - 1]);
function groundedMovement(left, right) {
    return runMatch(left, right, 90, handle => {
        const movement = replay(handle, 68, tick => {
            if (tick < 11) return [8, 4];
            if (tick >= 18 && tick < 28) return [4, 8];
            if (tick >= 36 && tick < 56) return [2, 2];
            return [0, 0];
        });
        return movement.map((frames, side) => {
            const states = statesSeen(frames);
            assert.deepEqual(states, [20, 0, 20, 0, 10, 11, 12, 0]);
            const start = frames[0].x256;
            const forward = (frames[10].x256 - start) * (side === 0 ? 1 : -1) / 256;
            const back = (frames[27].x256 - frames[18].x256) * (side === 0 ? -1 : 1) / 256;
            assert.ok(forward > 15 && back > 10, `Mirrored walk motion must use authored velocities: ${forward}, ${back}`);
            assert.equal(frames[10].anim, 20);
            assert.equal(frames[27].anim, 21);
            return { states, forward, back };
        });
    });
}

const locomotion = groundedMovement(...variants);
const bundledFiles = packageFiles(readFileSync(new URL("../../public/kfm.zip", import.meta.url)));
const bundled = availableKotlinFighters(bundledFiles, "bundled").ready[0];
assert.ok(bundled);
const bundledLocomotion = groundedMovement(bundled, bundled);

const jumps = runMatch(...variants, 70, handle => {
    const sides = [{ states: [], apex: 0 }, { states: [], apex: 0 }];
    for (let tick = 0; tick < 100; tick++) {
        const directions = tick === 0 ? 1 : 0; // Up on the first common-state tick.
        api.ktCoreAdvance(handle, directions, "", directions, "");
        for (let side = 0; side < sides.length; side++) {
            const actor = JSON.parse(api.ktCoreSnapshot(handle, side));
            const result = sides[side];
            if (result.states.at(-1) !== actor.state) result.states.push(actor.state);
            result.apex = Math.min(result.apex, actor.y256 / 256);
        }
    }
    for (const result of sides) {
        assert.deepEqual(result.states, [40, 50, 52, 0]);
        assert.ok(result.apex < -10, "The authored jump must rise above the stage floor");
    }
    return sides;
});

const airJumps = runMatch(...variants, 70, handle => {
    const motion = replay(handle, 150, tick => {
        const up = tick < 17 || tick === 18 || tick === 35 ? 1 : 0;
        return [up, up];
    });
    return motion.map(frames => {
        const states = statesSeen(frames);
        assert.deepEqual(states, [40, 50, 45, 50, 52, 0]);
        assert.equal(frames[18].state, 45);
        assert.equal(frames[35].state, 50);
        return { states, apex: Math.min(...frames.map(frame => frame.y256 / 256)) };
    });
});

const guard = runMatch(...variants, 12, handle => {
    const defenderStates = [];
    const guardedContacts = [];
    for (let tick = 0; tick < 100; tick++) {
        api.ktCoreAdvance(handle, 0, tick === 0 ? "x" : "", tick < 34 ? 8 : 0, "");
        defenderStates.push(JSON.parse(api.ktCoreSnapshot(handle, 1)));
        guardedContacts.push(...JSON.parse(api.ktCoreContacts(handle)));
    }
    const states = statesSeen(defenderStates);
    assert.ok(states.includes(120) && states.includes(150) && states.includes(140), states.join(","));
    assert.equal(states.at(-1), 0);
    assert.equal(guardedContacts.length, 1);
    assert.equal(guardedContacts[0].guarded, true);
    assert.equal(defenderStates.at(-1).life, 1000);
    return { states, contacts: guardedContacts };
});

const punches = variants.map((_, attacker) => runMatch(...variants, 14, handle => {
    let damage = 0;
    for (let tick = 0; tick < 35; tick++) {
        api.ktCoreAdvance(handle, 0, tick === 0 && attacker === 0 ? "x" : "",
            0, tick === 0 && attacker === 1 ? "x" : "");
        for (const contact of JSON.parse(api.ktCoreContacts(handle))) {
            assert.equal(contact.attacker, attacker + 1);
            assert.equal(contact.defender, 2 - attacker);
            damage += contact.damage;
        }
    }
    const life = JSON.parse(api.ktCoreSnapshot(handle, 1 - attacker)).life;
    assert.equal(damage, 23);
    assert.equal(life, 977);
    return { attacker: attacker + 1, damage, defenderLife: life };
}));

console.log(JSON.stringify({
    evidence: "Kotlin/Wasm replay using the original sample assets and scripts",
    nativeExecutableCompared: false,
    archiveSha256: createHash("sha256").update(bytes).digest("hex"),
    files: paths.length,
    executable,
    documentedControllers: headings("sctrls").length,
    documentedTriggers: headings("trigger").length,
    fighters: variants.map(fighter => fighter.definitionPath),
    locomotion,
    bundledLocomotion,
    jumps,
    airJumps,
    guard,
    punches
}, null, 2));
