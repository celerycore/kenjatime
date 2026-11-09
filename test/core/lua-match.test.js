import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { unzipSync } from "fflate";
import { CoreSession } from "../../src/core/session.js";
import { LuaMatch, luaModules } from "../../src/core/lua-match.js";
const encode = (s) => new TextEncoder().encode(s);
const files = () =>
  unzipSync(readFileSync(new URL("../../public/kfm.zip", import.meta.url)));

test("Lua modules, match hooks, redirects and numeric state APIs run through the original adapter", async () => {
  const f = files();
  f["external/mods/-helper.lua"] = encode(
    "return {twice=function(n) return n*2 end}",
  );
  f["external/mods/main.lua"] = encode(`
local helper=require('external.mods.-helper')
assert(require('external.mods.-helper')==helper)
assert(io==nil and os==nil and debug==nil and js==nil)
hook.add('loop','health',function()
  assert(player(1)); assert(type(alive())=='boolean');assert(type(getHitVar('fall'))=='boolean')
  setLife(life()-1);mapSet('ticks',map('ticks')+1)
  assert(not playerId(999999));assert(playerNo()==1)
  assert(p2());mapSet('other',helper.twice(map('other')+0.5))
end)
hook.add('loop#training','mode',function() player(1);setPower(77) end)
hook.add('loop','replace',function() error('replaced hook ran') end)
hook.stop('loop','replace')
hook.add('loop','replace',function() player(1);mapSet('replaced',1,'add') end)
hook.add('answer','one',function() return false end)
hook.add('answer','two',function() error('runFirst ignored false') end)
assert(hook.runFirst('answer')==false)
assert(loadstring('return 3+0.5')()==3.5)
local function env() return custom end
setfenv(env,{custom=33});assert(env()==33 and getfenv(env).custom==33)
`);
  const s = new CoreSession(f, { mode: "training" });
  await s.initializeScripts();
  for (let i = 0; i < 10; i++) s.tick();
  assert.equal(s.match.player.life, 990);
  assert.equal(s.match.player.power, 77);
  assert.equal(s.match.player.maps.get("ticks"), 10);
  assert.equal(s.match.player.maps.get("replaced"), 10);
  assert.equal(s.match.opponent.maps.get("other"), 1023);
  assert.deepEqual([...s.issues.values()], []);
  assert.ok(s.lua.engine.global.getMemoryUsed() < 1024 * 1024);
  s.close();
  assert.ok(s.lua.closed);
});

test("Lua protected loops cannot evade the instruction limit; a later match still works", async () => {
  const s = new CoreSession(files(), { mode: "training" }),
    lua = await LuaMatch.create(s, { instructions: 5000 });
  lua.load();
  lua.run(
    'hook.add("loop","bad",function() while true do pcall(function() while true do end end) end end)',
  );
  lua.step();
  assert.ok(lua.closed);
  assert.match([...s.issues.values()][0].message, /instruction budget/);
  s.tick();
  const next = await LuaMatch.create(s);
  assert.equal(next.run("return 2147483647+1"), 2147483648);
  next.close();
  s.close();
});

test("Lua memory and virtual file access remain bounded; dead characters cannot be revived with setLife", async () => {
  const s = new CoreSession(files(), { mode: "training" }),
    lua = await LuaMatch.create(s, { memoryLimit: 128 * 1024 });
  lua.load();
  assert.throws(() => lua.run('return string.rep("x",1024*1024)'), /memory/);
  assert.throws(
    () => lua.run('return dofile("../../outside.lua")'),
    /outside|path|file/i,
  );
  assert.equal(
    lua.run(
      "return io==nil and os==nil and debug==nil and package.loadlib==nil",
    ),
    true,
  );
  lua.run("player(1);setLife(0);setLife(500)");
  assert.equal(s.match.player.life, 0);
  lua.close();
  s.close();
  assert.throws(
    () => luaModules({}, { modules: ["../outside.lua"] }),
    /path|outside|escapes/i,
  );
});
