/** Controlled replay of the supplied character's own health accounting.
 * This does not emulate Dark Donald or certify that matchup. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { packageFiles, charactersFromFiles } from "../../src/formats.js";
if (!process.env.MUGEN_RARE_AKUMA)
  throw Error("Set MUGEN_RARE_AKUMA to the supplied RareAkuma.zip path.");
const source = resolve(process.env.CORE_BASELINE || ".");
const { CoreSession } = await import(
  pathToFileURL(resolve(source, "src/core/session.js"))
);
const bytes = readFileSync(process.env.MUGEN_RARE_AKUMA),
  files = {
    ...packageFiles(bytes),
    ...packageFiles(readFileSync("public/kfm.zip")),
  };
const character = charactersFromFiles(files).find((c) =>
  String(c.def.info?.name || "").replace(/[^a-z0-9]/gi, "").toLowerCase() === "rareakuma"
)?.path;
if (!character) throw Error("RareAkuma.def is missing.");
const session = new CoreSession(files, {
    character,
    opponent: "kfm/kfm.def",
    mode: "training",
  }),
  actor = session.match.player,
  opponent = session.match.opponent,
  samples = [];
let contact;
try {
  for (let tick = 1; tick <= 140; tick++) {
    if (tick === 6) actor.changeState(0, 1, actor);
    if (tick === 20) {
      actor.hitFilters = [];
      contact = actor.receiveHit(
        {
          attr: "S,NA",
          damage: [100, 0],
          pausetime: [0, 0],
          "ground.type": "High",
          "ground.hittime": 10,
          "ground.velocity": [0, 0],
        },
        opponent,
      );
    }
    session.tick();
    if (tick >= 18)
      samples.push({
        tick,
        life: actor.life,
        ledger: actor.vars[39],
        damageDelta: actor.vars[37],
        damage: actor.getHitVars.damage ?? 0,
        alive: !!actor.alive,
      });
  }
  if (contact?.damage !== 50)
    throw Error("The intended single contact was not exercised.");
  if (
    !process.env.CORE_BASELINE &&
    (!actor.alive ||
      actor.life !== 1961 ||
      samples.filter((s) => s.damageDelta !== 0).length !== 1)
  )
    throw Error("Rare Akuma charged the controlled contact repeatedly.");
  const report = {
    source,
    archiveSha256: createHash("sha256").update(bytes).digest("hex"),
    character,
    contact,
    scope:
      "Unmodified character scripts; training intro skipped at tick 6 and filters cleared for one controlled hit. Dark Donald unavailable; no matchup certification.",
    samples,
  };
  mkdirSync("work/core", { recursive: true });
  const output = process.env.CORE_RARE_OUTPUT || "work/core/rare-health.json";
  writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
  console.log(
    JSON.stringify({
      output,
      contact,
      finalLife: actor.life,
      alive: !!actor.alive,
      chargedTicks: samples.filter((s) => s.damageDelta !== 0).length,
    }),
  );
} finally {
  session.close();
}
