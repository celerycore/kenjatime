import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {FONT_VARIANTS,normalizeFont,mountArcadeChrome} from "../../src/core/kenja-arcade.js";

const read = path => readFileSync(new URL("../../"+path,import.meta.url),"utf8");

test("arcade display fonts are selectable and unknown saved preferences fail safely",()=>{
  assert.deepEqual(Object.keys(FONT_VARIANTS),["slash","condensed","digital","industrial"]);
  assert.equal(normalizeFont("digital"),"digital");
  assert.equal(normalizeFont("unknown"),"slash");
  assert.equal(normalizeFont(""),"slash");
  assert.equal(typeof mountArcadeChrome,"function");
});
test("browser Core still uses the original local archive importer and fight launcher",()=>{
  const page=read("src/core/page.js"),setup=read("src/native-setup.js");
  assert.match(page,/mountSetup\(host\)/);
  assert.match(page,/mountArcadeChrome\(\)/);
  assert.match(page,/openCoreBattle/);
  for(const path of ["pickArchive","stage-select","effects-select","opponent-select","fight-now","library-items","drop","palettes"]) {
    if(path==="palettes")assert.match(setup,/palette-select/);
    else assert.ok(setup.includes(path),"original workflow missing "+path);
  }
  assert.match(setup,/native\('launch',match\)/);
  assert.match(setup,/engineHost\.importFile\(files/);
  assert.match(page,/loadBuiltin/);
});
test("future Gart and Edelweiss portraits are advertising, not playable engine data",()=>{
  const chrome=read("src/core/kenja-arcade.js");
  assert.match(chrome,/These fighters are not installed yet/);
  assert.match(chrome,/GART BERNSTEIN/);
  assert.match(chrome,/EDELWEISS/);
  assert.doesNotMatch(chrome,/new FighterRuntime|new TrainingMatch|installPackage/);
});
test("arcade HUD changes do not require modifying round or combat simulation",()=>{
  const css=read("src/core/kenja-arcade.css"),page=read("src/core/page.js");
  assert.match(css,/\.kenja-arcade \.core-hud/);
  assert.match(css,/\.kenja-arcade \.core-round/);
  assert.match(css,/\.kenja-arcade \.core-announcement/);
  assert.match(page,/kenja-arcade\.css/);
});
