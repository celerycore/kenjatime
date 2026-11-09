/** Original match API adapter around a standalone Lua VM. Character files and
 * modules are data; no reference engine or default screenpack scripts load. */
import { decodeText, packagePath } from "../formats.js";
let factoryPromise;
const MiB = 1024 * 1024;
const finite = (value) => {
  if (typeof value !== "number" || !Number.isFinite(value))
    throw Error("Expected a finite Lua number.");
  return value;
};
const int = (value) => Math.trunc(finite(value));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const queryNames =
  "aiLevel alive anim animElemNo animElemTime animExist animTime authorName backEdge backEdgeBodyDist backEdgeDist cameraZoom canRecover command const const240p const480p const720p ctrl drawGame facing fvar gameHeight gameTime gameWidth getHitVar hitCount hitFall hitOver hitPauseTime hitShakeOver id inGuardDist isHelper isHomeTeam life lifeMax lose map matchNo moveContact moveGuarded moveHit moveReversed moveType name numEnemy numExplod numHelper numPartner numProj numProjId numTarget p2Life p2MoveType p2StateNo p2StateType palNo physics playerIdExist power powerMax prevStateNo random roundNo roundState roundsExisted screenHeight screenWidth stateNo stateType sysfvar sysvar teamMode teamSide ticksPerSecond uniqHitCount var win".split(
    " ",
  );
const booleans = new Set(
  "alive animExist canRecover ctrl drawGame hitFall hitOver hitShakeOver inGuardDist isHelper isHomeTeam lose playerIdExist win".split(
    " ",
  ),
);
const axes = {
  cameraPos: "camerapos",
  pos: "pos",
  vel: "vel",
  screenPos: "screenpos",
  hitVel: "hitvel",
  p2Dist: "p2dist",
  p2BodyDist: "p2bodydist",
  parentDist: "parentdist",
  rootDist: "rootdist",
};

export function luaModules(files, selection = {}) {
  if (selection.modules !== undefined && !Array.isArray(selection.modules))
    throw Error("Lua modules must be an array of archive paths.");
  const result = Object.keys(files)
    .filter(
      (p) =>
        /(?:^|\/)external\/mods\/[^/]+\.lua$/i.test(p) &&
        !p.split("/").at(-1).startsWith("-"),
    )
    .sort();
  for (const path of selection.modules || []) {
    const p = packagePath(path);
    if (!files[p]) throw Error(`Lua module is missing: ${p}`);
    if (!result.includes(p)) result.push(p);
  }
  if (result.length > 32) throw Error("Lua module limit (32) exceeded.");
  return result;
}

const bootstrap = `
local rawload, dbg = load, debug
function print(...)
  local parts={}
  for i=1,select('#',...) do parts[i]=tostring(select(i,...)) end
  __kenja_print(table.concat(parts,'\t'))
end
local hooks, required = {}, {}
hook = {}
function hook.add(list, name, fn)
  assert(type(list)=="string" and type(name)=="string" and type(fn)=="function", "Invalid hook registration")
  local group=hooks[list]
  if not group then group={order={},items={},known={}};hooks[list]=group end
  if not group.known[name] then assert(#group.order<1024,"Hook limit exceeded");group.order[#group.order+1]=name;group.known[name]=true end
  group.items[name]=fn
end
function hook.stop(list,name) local g=hooks[list];if g then g.items[name]=nil end end
local function runhooks(first,list,...)
  local g=hooks[list];if not g then return end
  local count=#g.order
  for i=1,count do local fn=g.items[g.order[i]];if fn then local v=fn(...);if first and v~=nil then return v end end end
end
function hook.run(list,...) runhooks(false,list,...) end
function hook.runFirst(list,...) return runhooks(true,list,...) end
function load(chunk,name,mode,env)
  assert(type(chunk)=="string","Only text Lua chunks are supported")
  return rawload(chunk,name or "module","t",env or _G)
end
loadstring=load
unpack=table.unpack
table.getn=function(t) return #t end
math.mod=math.fmod
math.log10=function(x) return math.log(x,10) end
local function envslot(fn)
  for i=1,256 do local name,value=dbg.getupvalue(fn,i);if not name then return end;if name=="_ENV" then return i,value end end
end
function getfenv(fn)
  if fn==nil then fn=1 end
  if fn==0 then return _G end
  if type(fn)=="number" then local frame=dbg.getinfo(fn+1,"f");fn=frame and frame.func end
  if type(fn)~="function" then error("Invalid environment target") end
  local _,env=envslot(fn);return env or _G
end
function setfenv(fn,env)
  assert(type(env)=="table","Expected environment table")
  if type(fn)=="number" then local frame=dbg.getinfo(fn+1,"f");fn=frame and frame.func end
  assert(type(fn)=="function","Invalid environment target")
  local i=envslot(fn)
  if i then local function fresh() return env end;dbg.upvaluejoin(fn,i,fresh,1) end
  return fn
end
function loadfile(path)
  local ok,source=pcall(__kenja_read,path,false)
  if not ok then return nil,source end
  return load(source,"@"..path,"t")
end
function dofile(path) local fn,err=loadfile(path);if not fn then error(err) end;return fn() end
package={loaded={},preload={}}
function require(name)
  if package.loaded[name]~=nil then return package.loaded[name] end
  assert(not required[name],"Recursive module load: "..name)
  required[name]=true
  local fn=package.preload[name]
  if not fn then local source=__kenja_read(name,true);local err;fn,err=load(source,"@"..name,"t");if not fn then error(err) end end
  local value=fn(name);required[name]=nil
  if value==nil then value=true end;package.loaded[name]=value;return value
end
io=nil;os=nil;debug=nil;collectgarbage=nil
function __kenja_tick()
  hook.run("loop");hook.run("loop#"..gameMode())
  if type(loop)=="function" then loop() end
  if __kenja_frame then __kenja_frame() end
end
`;

export class LuaMatch {
  static async create(
    session,
    { factory, memoryLimit = 32 * MiB, instructions = 100000 } = {},
  ) {
    if (!factory) {
      factoryPromise ??= import("wasmoon").then(
        ({ LuaFactory }) =>
          new LuaFactory(
            typeof process !== "undefined" && process.versions?.node
              ? undefined
              : new URL(
                  "../../node_modules/wasmoon/dist/glue.wasm",
                  import.meta.url,
                ).href,
          ),
      );
      factory = await factoryPromise;
    }
    const engine = await factory.createEngine({
      openStandardLibs: true,
      injectObjects: false,
      enableProxy: false,
      traceAllocations: true,
    });
    const result = new LuaMatch(session, engine, instructions);
    engine.global.setMemoryMax(memoryLimit);
    try {
      result.install();
      result.run(bootstrap, "<match API>");
      return result;
    } catch (error) {
      result.close();
      throw error;
    }
  }
  constructor(session, engine, instructions) {
    this.session = session;
    this.engine = engine;
    this.actor = session.match.player;
    this.instructions = instructions;
    this.fuel = instructions;
    this.closed = false;
    this.source = "<module>";
    this.hookPointer = 0;
  }
  install() {
    const global = this.engine.global,
      api = (name, fn) => global.set(name, fn),
      selected = () => {
        if (!this.actor || this.actor.destroyed)
          throw Error("Lua player selection is unavailable.");
        return this.actor;
      };
    for (const name of queryNames)
      api(name, (...args) => {
        const value = selected().resolveTrigger(name.toLowerCase(), args);
        const n =
          value && typeof value === "object" && "float" in value
            ? value.value
            : value;
        if (!["number", "string", "boolean"].includes(typeof n))
          throw Error(`Lua query ${name} requires an unsupported result type.`);
        return booleans.has(name) ||
          (name === "getHitVar" &&
            [
              "fall",
              "fall.recover",
              "fall.kill",
              "guarded",
              "isbound",
            ].includes(String(args[0]).toLowerCase()))
          ? !!n
          : n;
      });
    for (const [prefix, trigger] of Object.entries(axes))
      for (const axis of ["X", "Y"])
        api(prefix + axis, () =>
          selected().resolveTrigger(trigger + " " + axis.toLowerCase()),
        );
    const select =
      (fn) =>
      (...args) => {
        const next = fn(...args);
        if (!next || next.destroyed) return false;
        this.actor = next;
        return true;
      };
    api(
      "player",
      select(
        (n) =>
          [this.session.match.player, this.session.match.opponent][int(n) - 1],
      ),
    );
    api(
      "playerId",
      select((n) => this.session.match.findPlayer(int(n))),
    );
    api(
      "playerIndex",
      select((n) => this.session.match.entities[int(n) - 1]),
    );
    api(
      "parent",
      select(() => selected().parent),
    );
    api(
      "root",
      select(() => selected().root),
    );
    api(
      "stateOwner",
      select(() => selected().stateOwner),
    );
    api(
      "p2",
      select(() => selected().opponent),
    );
    api(
      "enemy",
      select((n = 0) => (int(n) === 0 ? selected().opponent : null)),
    );
    api(
      "enemyNear",
      select((n = 0) => (int(n) === 0 ? selected().opponent : null)),
    );
    api(
      "helper",
      select((id) =>
        selected()
          .ownedHelpers()
          .find((h) => id === undefined || h.helperId === int(id)),
      ),
    );
    api(
      "helperIndex",
      select((n) => selected().ownedHelpers()[int(n) - 1]),
    );
    api(
      "target",
      select((id) =>
        selected().targets.find(
          (t) =>
            id === undefined ||
            id === -1 ||
            selected().targetHitIds.get(t.id) === int(id),
        ),
      ),
    );
    api("partner", () => false);
    api("setLife", (value) => {
      const a = selected();
      if (a.alive) a.life = clamp(int(value), 0, a.maxLife);
    });
    api("setPower", (value) => {
      const a = selected();
      a.power = clamp(int(value), 0, a.maxPower);
    });
    api("changeState", (value) => {
      const a = selected(),
        n = int(value);
      if (n === -1) {
        a.destroyed = true;
        return false;
      }
      if (!a.program.states.has(n)) return false;
      a.changeState(n, undefined, a);
      return true;
    });
    api("mapSet", (name, value, type) =>
      selected().setMap(String(name), finite(value), type === "add"),
    );
    api("playerBufReset", () => {
      const a = selected();
      this.session.match.inputBuffers.get(a)?.reset();
      this.session.match.helperCommands.get(a)?.reset();
    });
    api("playerNo", () => this.session.match.entities.indexOf(selected()) + 1);
    api(
      "stateOwnerPlayerNo",
      () => this.session.match.entities.indexOf(selected().stateOwner) + 1,
    );
    api(
      "animPlayerNo",
      () => this.session.match.entities.indexOf(selected().animationOwner) + 1,
    );
    api("pauseTime", () => this.session.match.pause?.remaining || 0);
    api("superPauseTime", () => this.session.match.superPause?.remaining || 0);
    api("gameMode", () =>
      this.session.selection.mode === "training" ? "training" : "versus",
    );
    api("matchOver", () => this.session.match.matchOver);
    api(
      "localCoordX",
      () =>
        selected().character.def?.info?.localcoord?.split(",").map(Number)[0] ||
        320,
    );
    api(
      "localCoordY",
      () =>
        selected().character.def?.info?.localcoord?.split(",").map(Number)[1] ||
        240,
    );
    api("isAsserted", (flag) =>
      selected().asserted.has(String(flag).toLowerCase()),
    );
    api("inCustomState", () => selected().stateOwner !== selected());
    api("inCustomAnim", () => selected().animationOwner !== selected());
    api("__kenja_print", (value) =>
      this.session.issue("lua-output", String(value).slice(0, 512)),
    );
    api("__kenja_read", (name, module) => {
      let path = String(name);
      if (module) path = path.replaceAll(".", "/") + ".lua";
      const roots = [
        "",
        ...this.modules.map((p) =>
          p.includes("/external/mods/")
            ? p.slice(0, p.indexOf("/external/mods/") + 1)
            : p.slice(0, p.lastIndexOf("/") + 1),
        ),
      ];
      const candidates = [
        ...new Set(roots.map((base) => packagePath(path, base))),
      ];
      const found = candidates.find((p) => this.session.files[p]);
      if (!found) throw Error(`Lua file is missing: ${path}`);
      const bytes = this.session.files[found];
      if (bytes.length > 256 * 1024)
        throw Error("Lua source limit (256 KiB) exceeded.");
      return decodeText(bytes);
    });
    this.modules = luaModules(this.session.files, this.session.selection);
    this.hookPointer = global.lua.module.addFunction(() => {
      this.fuel -= 1000;
      if (this.fuel < 0) {
        const e = Error("Lua instruction budget exceeded.");
        e.luaBudget = true;
        throw e;
      }
    }, "vii");
    global.lua.lua_sethook(global.address, this.hookPointer, 8, 1000);
  }
  run(source, name = "<module>") {
    if (source.length > 256 * 1024)
      throw Error("Lua source limit (256 KiB) exceeded.");
    this.fuel = this.instructions;
    this.source = name;
    try {
      return this.engine.doStringSync(source);
    } catch (error) {
      throw Error(`${name}: ${error.message}`);
    } finally {
      this.engine.global.setTop(0);
    }
  }
  load() {
    for (const path of this.modules)
      this.run(decodeText(this.session.files[path]), path);
    if (this.session.selection.lua)
      this.run(
        "local fn,err=load(" +
          JSON.stringify(String(this.session.selection.lua)) +
          ',"<fight lua>","t");assert(fn,err);__kenja_frame=fn',
        "<fight lua>",
      );
  }
  step() {
    if (this.closed) return;
    this.fuel = this.instructions;
    try {
      const global = this.engine.global;
      global.lua.lua_getglobal(global.address, "__kenja_tick");
      global.runSync();
      global.setTop(0);
    } catch (error) {
      this.session.issue("lua-runtime", error.message);
      this.close();
    }
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    const global = this.engine.global;
    global.lua.lua_sethook(global.address, 0, 0, 0);
    global.close();
    if (this.hookPointer) global.lua.module.removeFunction(this.hookPointer);
  }
}
