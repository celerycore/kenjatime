/** Kenjatime Core: independent, fixed-tick combat plus compiled numeric scripts.
 * Rendering, archive codecs and platform input are separate adapters.
 */
import { charactersFromFiles, decodeText, sff } from "../formats.js";
import {loadCommonEffects} from "./common-effects.js";
import { parseProgram } from "../runtime.js";
import { TrainingMatch } from "../combat.js";
import { commonStates } from "../common.js";
const CORE_COMMON_STATES = commonStates({ orderedPhases: true });
import { parseCommands, CommandBuffer } from "../commands.js";
import { splitArguments } from "../expressions.js";
import { EffectsState } from "../effects.js";
import { characterSpriteBank } from "../palettes.js";
import { baseScale } from "../coordinates.js";
import {
  sampleFighterAnimation,
  sampleAnimation,
  spriteRotation,
  blendCoefficients,
  tileOffsets,
  backgroundTileStep,
} from "../rendering.js";
import { stageDefinitions } from "../stages.js";
import { WasmExpressions } from "./wasm-expressions.js";
import { stageClip, stageDrawPlans } from "./stage-draw.js";
import { explodDrawPriority } from "../explods.js";
import { luaModules, LuaMatch } from "./lua-match.js";
import { videoScale } from "./video-source.js";

export function programExpressions(programs) {
  const sources = new Set();
  for (const p of programs) {
    for (const source of p.zssExpressions || []) sources.add(source);
    for (const state of p.states.values())
      for (const section of [state, ...state.controllers])
        for (const entry of section.entries) {
          sources.add(entry.value);
          try {
            for (const part of splitArguments(entry.value)) sources.add(part);
          } catch {}
        }
  }
  return sources;
}
const cloneEvent = (event, id) => {
  const out = { entity: id };
  for (const [k, v] of Object.entries(event))
    if (
      v === null ||
      ["number", "string", "boolean"].includes(typeof v) ||
      Array.isArray(v)
    )
      out[k] = v;
  return out;
};
const constant = (a, n, f = 0) => {
  try {
    return a.constant(n);
  } catch {
    return f;
  }
};
export class CoreSession {
  constructor(files, selection = {}) {
    this.files = files;
    this.selection = selection;
    this.characters = charactersFromFiles(files);
    this.commonEffects = loadCommonEffects(files, {fightDef:selection.fightDef, character:selection.character, stage:selection.stage});
    const p1 =
        this.characters.find((c) => c.path === selection.character) ||
        this.characters[0],
      p2 = this.characters.find((c) => c.path === selection.opponent) || p1;
    if (!p1 || !p2) throw Error("No playable character definition found.");
    const programs = new Map(
      [...new Set([p1, p2])].map((c) => [
        c,
        parseProgram(c, {
          commonText: CORE_COMMON_STATES,
          constantsFromCnsOnly: true,
        }),
      ]),
    );
    for (const program of programs.values()) {
      const error = program.diagnostics.find((d) => d.fatal);
      if (error) throw Error(`${error.source}:${error.line}: ${error.message}`);
    }
    this.expressions = new WasmExpressions(
      programExpressions(programs.values()),
    );
    this.commands = [p1, p2].map((c) => {
      const path = c.checks.find((k) => k.key === "cmd" && k.ok)?.path;
      return new CommandBuffer(
        parseCommands(path ? decodeText(files[path]) : ""),
      );
    });
    const stage =
      selection.stage && selection.stage !== "builtin/grid"
        ? stageDefinitions(files).find((s) => s.path === selection.stage)
        : null;
    if (stage?.invalid) throw Error("Stage definition could not be parsed.");
    this.match = new TrainingMatch(p1, {
      opponentCharacter: p2,
      commonText: CORE_COMMON_STATES,
      commonAnimations: this.commonEffects.animations,
      programs,
      manageInputs: true,
      orderedPhases: true,
      expressionEvaluator: (s, c) => this.expressions.evaluate(s, c),
      stage,
      playerPalette: selection.palette || 1,
      opponentPalette: selection.opponentPalette || 2,
      skipIntro: selection.mode === "training",
      playerAILevel: selection.mode === "cpu" ? selection.level || 4 : 0,
      opponentAILevel: ["solo", "cpu"].includes(selection.mode)
        ? selection.level || 4
        : 0,
      rules:
        selection.mode === "training"
          ? null
          : { roundsToWin: 2, preIntro: 0, introHold: 30 },
    });
    this.commands = [
      this.match.inputBuffers.get(this.match.player),
      this.match.inputBuffers.get(this.match.opponent),
    ];
    this.effects = new EffectsState();
    this.banks = new Map();
    this.indices = new Map();
    this.bankIds = new Map();
    this.spriteMetadata = new Map();
    this.sent = new Set();
    this.assets = [];
    this.events = [];
    this.sparks = [];
    this.issues = new Map(this.commonEffects.issues.map(d=>[d.type+":"+d.message,d]));
    this.closed = false;
    this.videoSprites = new Map();
    if (this.match.stage) this.match.stage.viewportAspect = 16 / 9;
    this.modelReady = false;
    this.lua = null;
    this.luaModules = luaModules(files, selection);
    this.capabilities = {
      format: "kenjatime-core-coverage-v1",
      engine: "Kenjatime Core",
      independentRuntime: true,
      universalCompatibility: false,
      compiledNumericExpressions: true,
      scriptInterpreter: true,
      luaMatchHooks: true,
      stageVideo: true,
      gltfStageModels: true,
      knownGaps: [
        "Lua APIs beyond match hooks, extended global states and newer ZSS extensions",
        "Compressed glTF extensions, animation pointers and cross-layer model shadows",
        "Video codecs unavailable on the device",
        "Advanced stage camera offsets and mixed-coordinate camera parity",
        "Afterimage palette chains beyond eight layers",
        "Unverified character families and extended controller combinations",
      ],
    };
  }
  issue(type, message) {
    const key = type + ":" + message;
    if (this.issues.size < 2000) this.issues.set(key, { type, message });
  }
  async initializeScripts() {
    if (
      this.closed ||
      this.lua ||
      (!this.luaModules.length && !this.selection.lua)
    )
      return;
    const lua = await LuaMatch.create(this);
    if (this.closed) {
      lua.close();
      return;
    }
    try {
      lua.load();
      this.lua = lua;
    } catch (error) {
      lua.close();
      throw error;
    }
  }
  tick(left = new Set(), right = new Set()) {
    if (this.closed) throw Error("Match is closed.");
    const match = this.match,
      paused = (e) => match.isFrozen(e) || e.hitPauseTime > 0;
    this.effects.advance({ paused });
    match.tick(new Set(), new Set(), {
      playerInput: left,
      opponentInput: right,
    });
    this.lua?.step();
    this.commands = [
      match.inputBuffers.get(match.player),
      match.inputBuffers.get(match.opponent),
    ];
    for (const entity of match.eventEntities) {
      this.effects.consume(entity.events, { entity });
      for (const event of entity.events)
        if (["playsnd", "stopsnd", "sndpan"].includes(event.type))
          this.events.push({
            ...cloneEvent(event, entity.id),
            character: entity.character.path,
          });
    }
    for (const event of match.presentationEvents)
      this.effects.consume([event], { entity: event.entity || event.owner });
    for (const hit of match.events)
      this.sparks.push({ x: hit.x, y: hit.y, age: 0, guarded: hit.guarded });
    this.sparks = this.sparks.filter((s) => ++s.age < 12);
    if (this.sparks.length > 256)
      this.sparks.splice(0, this.sparks.length - 256);
    this.effects.capture([...match.entities, ...match.drawProjectiles], {
      paused,
    });
    this.effects.cleanup(match.entities);
    return this;
  }
  bank(resource) {
    if (!this.banks.has(resource)) {
      const bank = resource.def?.files
        ? characterSpriteBank(resource)
        : sff(resource.files[resource.sprite.path]);
      this.banks.set(resource, bank);
      this.bankIds.set(resource, this.banks.size);
      this.indices.set(
        resource,
        new Map(bank.sprites.map((s, i) => [s.group + "," + s.number, i])),
      );
    }
    return this.banks.get(resource);
  }
  asset(resource, frame, remaps) {
    try {
      const bank = this.bank(resource),
        index = this.indices
          .get(resource)
          .get(frame.group + "," + frame.number);
      if (index === undefined) return null;
      const bankId = this.bankIds.get(resource),
        id = bankId + ":" + index;
      let sprite = this.spriteMetadata.get(id);
      if (!sprite) {
        const decoded = bank.decodeIndexed?.(index) || bank.decode(index),
          indexed = !!decoded.indices;
        sprite = {
          w: decoded.w,
          h: decoded.h,
          x: decoded.x || 0,
          y: decoded.y || 0,
          palette: decoded.palette,
          indexed,
          colors: decoded.colors,
        };
        this.assets.push({
          id,
          width: sprite.w,
          height: sprite.h,
          indexed,
          pixels: new Uint8Array(indexed ? decoded.indices : decoded.rgba),
        });
        this.sent.add(id);
        this.spriteMetadata.set(id, sprite);
        bank.clearDecodedCache();
      }
      const indexed = sprite.indexed,
        meta = bank.sprites[index],
        palette = bank.palettes?.find(
          (p) => p.index === (sprite.palette ?? meta.palette),
        );
      let pair = palette ? [palette.group, palette.number] : [1, 1];
      pair = remaps?.get(pair.join(",")) || remaps?.get("*") || pair;
      const paletteId = bankId + ":pal:" + pair.join(",");
      if (indexed && !this.sent.has(paletteId)) {
        let colors;
        try {
          colors = bank.paletteColors(...pair);
        } catch {
          colors = sprite.colors;
          if (!colors) throw Error("Sprite palette is missing.");
          this.issue(
            "palette",
            "Requested palette " + pair.join(",") + " is unavailable.",
          );
        }
        const pixels = new Uint8Array(1024);
        pixels.set(colors.subarray(0, 1024));
        this.assets.push({
          id: paletteId,
          width: 256,
          height: 1,
          pixels,
          indexed: false,
        });
        this.sent.add(paletteId);
      }
      return {
        id,
        paletteId,
        indexed,
        w: sprite.w,
        h: sprite.h,
        x: sprite.x || 0,
        y: sprite.y || 0,
      };
    } catch (error) {
      this.issue("sprite", error.message);
      return null;
    }
  }
  quad(
    draws,
    resource,
    frame,
    {
      x = 0,
      y = 0,
      sx = 1,
      sy = 1,
      facing = 1,
      angle = 0,
      xangle = 0,
      yangle = 0,
      remaps = null,
      palette = null,
      trans = null,
      mask = true,
      alpha = 1,
      clip = null,
      corners = null,
      axisX = null,
      warp = null,
      sprite = null,
      axisY = null,
      pass = 1,
    } = {},
  ) {
    if (!frame || draws.length >= 8192) return;
    const sp = sprite || this.asset(resource, frame, remaps);
    if (!sp) return;
    sx *= facing;
    const rot = spriteRotation((frame.angle || 0) + angle, xangle, yangle),
      fx = (frame.flip || "").includes("H") ? -1 : 1,
      fy = (frame.flip || "").includes("V") ? -1 : 1;
    const a = sx * fx * (frame.scaleX ?? 1) * rot.a,
      b = sy * fy * (frame.scaleY ?? 1) * rot.b,
      c = sx * fx * (frame.scaleX ?? 1) * rot.c,
      d = sy * fy * (frame.scaleY ?? 1) * rot.d;
    if (![a, b, c, d, x, y, alpha].every(Number.isFinite)) {
      this.issue(
        "render-transform",
        "A non-finite sprite transform was skipped.",
      );
      return;
    }
    if (palette?.layers?.length > 8)
      this.issue(
        "palette-limit",
        "This preview can render eight palette layers per sprite.",
      );
    let blend = frame.blend || "";
    if (typeof trans === "string") blend = trans;
    else if (trans && trans.mode !== "default")
      blend =
        trans.mode === "sub"
          ? "S"
          : trans.mode === "none"
            ? ""
            : trans.mode === "add1"
              ? "A1"
              : `AS${trans.alpha?.[0] ?? 256}D${trans.alpha?.[1] ?? 256}`;
    draws.push({
      texture: sp.id,
      palette: sp.paletteId,
      indexed: sp.indexed,
      width: sp.w,
      height: sp.h,
      matrix: [
        a,
        b,
        c,
        d,
        x + (frame.x || 0) * sx - a * (axisX ?? sp.x) - c * (axisY ?? sp.y),
        y + (frame.y || 0) * sy - b * (axisX ?? sp.x) - d * (axisY ?? sp.y),
      ],
      blend: blendCoefficients(blend),
      mask,
      alpha,
      palFX: palette?.layers || [],
      clip,
      corners,
      warp,
      pass,
    });
    return sp;
  }
  frame() {
    const m = this.match,
      v = m.view,
      scale = Math.min(960 / 320, 540 / (v.displayHeight || 240)),
      camera = m.stage?.camera || { x: 0, y: 0, zoom: 1 },
      ground =
        (540 - (v.displayHeight || 240) * scale) / 2 +
        (v.groundY || 200) * scale,
      zoom = scale * camera.zoom,
      draws = [];
    this.assets = [];
    const world = (p) => ({
      x: 480 + (p.x - camera.x) * zoom,
      y: ground + (p.y - camera.y) * zoom,
    });
    const stageLayer = (layer) => {
      const stage = m.stage;
      if (!stage) return;
      const def = stage.definition,
        backgroundScale = def.backgroundScale || 1,
        factor = def.coordinateScale * backgroundScale,
        cameraX = camera.x * backgroundScale,
        cameraY = camera.y * backgroundScale;
      for (const [index, e] of stage.elements.entries()) {
        if (draws.length >= 8192) {
          this.issue("resource-limit", "Visible quad budget exceeded.");
          break;
        }
        if (e.layer !== layer || !e.enabled || !e.visible || e.type === "dummy")
          continue;
        const frame =
            e.type === "video"
              ? { x: 0, y: 0 }
              : e.animated
                ? sampleAnimation(
                    stage.animations.get(e.anim),
                    e.drawFrameIndex ?? e.frameIndex,
                    e.drawFrameTime ?? e.frameTime,
                  )
                : stage.frame(e),
          position = stage.position(index);
        if (!frame) continue;
        const sp =
          e.type === "video"
            ? this.videoSprites.get(e.video.key)
            : this.asset(def, frame);
        if (!sp) continue;
        const z = 1 + (camera.zoom - 1) * e.zoomDelta,
          sx =
            factor *
            scale *
            z *
            def.xscale *
            (e.scaleStart[0] + (cameraY / factor) * e.scaleDelta[0]),
          sy =
            factor *
            scale *
            z *
            def.yscale *
            (e.scaleStart[1] + (cameraY / factor) * e.scaleDelta[1]);
        const x =
            480 + (position.x * factor - cameraX * position.delta[0]) * zoom,
          y =
            ground +
            (position.y * factor -
              (v.zoffset || 0) -
              cameraY * position.delta[1]) *
              zoom;
        const clip = stageClip(e, {
          factor,
          scale,
          cameraX,
          cameraY,
          cropTop: v.cropTop,
          displayHeight: v.displayHeight,
        });
        if (e.type === "video") {
          if (clip && !clip.length) continue;
          const [vx, vy] = videoScale(
            e.video.scaleMode,
            sp.w,
            sp.h,
            e.window
              ? e.window[2] - e.window[0] + (e.windowCentered ? 0 : 1)
              : def.localcoord[0],
            e.window
              ? e.window[3] - e.window[1] + (e.windowCentered ? 0 : 1)
              : def.localcoord[1],
          );
          this.quad(draws, null, frame, {
            sprite: sp,
            x: 480 + (position.x * factor - cameraX * position.delta[0]) * zoom,
            y: 270 + (position.y * factor - cameraY * position.delta[1]) * zoom,
            sx: sx * vx,
            sy: sy * vy,
            axisX: sp.w / 2,
            axisY: sp.h / 2,
            clip,
            pass: layer === 1 ? 2 : layer,
            angle: e.angle,
            xangle: e.xangle,
            yangle: e.yangle,
            palette: this.effects.backgroundPalette,
            mask: false,
          });
          continue;
        }
        for (const plan of stageDrawPlans(e, sp, frame, {
          x,
          y,
          sx,
          sy,
          cameraX,
          cameraY,
          deltaX: position.delta[0],
          zoom,
          factor,
          clip,
        })) {
          if (draws.length >= 8192) {
            this.issue("resource-limit", "Visible quad budget exceeded.");
            break;
          }
          this.quad(draws, def, frame, {
            ...plan,
            pass: layer === 1 ? 2 : layer,
            angle: e.angle,
            xangle: e.xangle,
            yangle: e.yangle,
            mask: e.mask,
            trans: e.transSpecified ? { mode: e.trans, alpha: e.alpha } : null,
            palette: this.effects.backgroundPalette,
          });
        }
      }
    };
    stageLayer(-1);
    stageLayer(0);
    const layers = [];
    for (const actor of [...m.renderEntities, ...m.drawProjectiles]) {
      if (!actor.destroyed && !actor.asserted.has("invisible"))
        layers.push({ priority: actor.sprPriority || 0, actor });
      for (const effect of actor.drawExplods || [])
        layers.push({
          priority: explodDrawPriority(effect),
          actor,
          effect,
        });
    }
    layers.sort((a, b) => a.priority - b.priority);
    for (const { actor, effect } of layers) {
      if (effect) {
        const resource = effect.common ? this.commonEffects.resource : actor.character;
        if (!resource) {
          this.issue("common-effects", "Character requested an unavailable shared effect sprite bank.");
          continue;
        }
        const pos =
            effect.space === "screen"
              ? { x: effect.pos.x * scale, y: effect.pos.y * scale }
              : world(effect.pos),
          unit = (effect.coordinateScale ?? baseScale(actor)) * zoom *
            (effect.common ? this.commonEffects.scale : 1);
        this.quad(
          draws,
          resource,
          sampleAnimation(
            effect.animation,
            effect.frameIndex,
            effect.frameTime,
          ),
          {
            ...pos,
            sx: unit * (effect.scale?.[0] ?? 1),
            sy: unit * (effect.scale?.[1] ?? 1) * (effect.vfacing || 1),
            facing: effect.facing,
            angle: effect.angle || 0,
            xangle: effect.xangle || 0,
            yangle: effect.yangle || 0,
            remaps: effect.common ? null : effect.ownpal ? effect.paletteRemaps : actor.paletteRemaps,
            palette: this.effects.paletteFor(effect.source || actor),
            trans: effect.trans,
          },
        );
        continue;
      }
      for (const trail of this.effects.trailsFor(actor)) {
        const pos = world({
            x: trail.pos.x + (trail.drawOffset?.x || 0),
            y: trail.pos.y + (trail.drawOffset?.y || 0),
          }),
          unit = zoom * trail.coordinateScale;
        this.quad(draws, trail.character, trail.frame, {
          ...pos,
          sx: unit * trail.sizeX * (trail.drawScale.x ?? 1),
          sy: unit * trail.sizeY * (trail.drawScale.y ?? 1),
          facing: trail.facing,
          angle: trail.angle,
          remaps: trail.paletteRemaps,
          palette: trail.palette,
          trans: trail.trans,
        });
      }
      const pos = world({
        x:
          actor.pos.x +
          (actor.drawOffset?.x || 0) +
          constant(actor, "size.draw.offset.x") *
            baseScale(actor) *
            actor.facing,
        y:
          actor.pos.y +
          (actor.drawOffset?.y || 0) +
          constant(actor, "size.draw.offset.y") * baseScale(actor),
      });
      this.quad(draws, actor.character, sampleFighterAnimation(actor), {
        ...pos,
        sx:
          zoom *
          baseScale(actor) *
          constant(actor, "size.xscale", 1) *
          (actor.drawScale?.x ?? 1),
        sy:
          zoom *
          baseScale(actor) *
          constant(actor, "size.yscale", 1) *
          (actor.drawScale?.y ?? 1),
        facing: actor.facing,
        angle: actor.angleDraw ? actor.angle : 0,
        remaps: actor.paletteRemaps,
        palette: this.effects.paletteFor(actor),
        trans: actor.trans,
      });
    }
    stageLayer(1);
    const sparks = this.sparks.map((s) => ({
      ...world(s),
      age: s.age,
      guarded: s.guarded,
    }));
    return {
      width: 960,
      height: 540,
      draws,
      assets: this.assets,
      sparks,
      model: this.modelReady
        ? {
            time: m.stage.time / 60,
            camera: { ...camera },
            coordinateScale: m.stage.definition.coordinateScale,
            start: m.stage.definition.camera,
          }
        : null,
      ground,
      grid:
        !m.stage ||
        (!m.stage.definition.sprite &&
          !this.modelReady &&
          !this.videoSprites.size),
      players: [m.player, m.opponent].map((a) => ({
        id: a.id,
        name: a.name,
        x: a.pos.x,
        y: a.pos.y,
        life: a.life,
        maxLife: a.maxLife,
        power: a.power,
        maxPower: a.maxPower,
        state: a.stateNo,
        time: a.time,
        anim: a.anim,
      })),
      ticks: m.ticks,
      roundState: m.roundFlow?.roundState ?? 2,
      paused: false,
      expressions: this.expressions.stats,
    };
  }
  snapshot() {
    return {
      engine: "Kenjatime Core",
      players: [this.match.player, this.match.opponent].map((a) => ({
        id: a.id,
        name: a.name,
        x: a.pos.x,
        y: a.pos.y,
        life: a.life,
        maxLife: a.maxLife,
        power: a.power,
        maxPower: a.maxPower,
        state: a.stateNo,
        time: a.time,
        anim: a.anim,
      })),
      ticks: this.match.ticks,
      roundState: this.match.roundFlow?.roundState ?? 2,
      expressions: this.expressions.stats,
      capabilities: this.capabilities,
      diagnostics: [...this.match.diagnostics, ...this.issues.values()],
    };
  }
  drainEvents() {
    const events = this.events;
    this.events = [];
    return events;
  }
  close() {
    this.lua?.close();
    this.closed = true;
    for (const b of this.banks.values()) b.clearDecodedCache();
    this.banks.clear();
    this.sent.clear();
    this.events = [];
  }
}
