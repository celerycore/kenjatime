/** Kenjatime Core: independent, fixed-tick combat plus compiled numeric scripts.
 * Rendering, archive codecs and platform input are separate adapters.
 */
import { charactersFromFiles, decodeText, sff } from "../formats.js";
import {normalizePresentation,presentationAspect} from "./presentation.js";
import {loadCommonEffects} from "./common-effects.js";
import { parseProgram } from "../runtime.js";
import { legacyCompatibilityReport } from "./legacy-compatibility.js";
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
import { BENCHMARK_START_LOCK_TICKS } from "./fight-start.js";

export function programExpressions(programs) {
  const sources = new Set();
  for (const p of programs) {
    for (const source of p.zssExpressions || []) sources.add(source);
    // Extended IKEMEN globals may contain multiple CNS/ZSS definitions.
    // Flatten each part when precompiling numeric expressions.
    for (const state of p.states.values())
      for (const definition of state.globalParts||[state])
        for (const section of [definition, ...(definition.controllers||[])])
          for (const entry of section.entries||[]) {
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
    this.presentation = normalizePresentation(selection.presentation);
    this.characters = charactersFromFiles(files);
    this.commonEffects = loadCommonEffects(files, {fightDef:selection.fightDef, effectsPackage:selection.effectsPackage, character:selection.character, stage:selection.stage});
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
    this.legacyCompatibility = legacyCompatibilityReport([p1,p2],programs);
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
      cameraFollow: true,
      kotlinCombatBackend: selection.kotlinCombatBackend || null,
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
          : { roundsToWin: 2, preIntro: 0, introHold: 60, overTime: 60,
              resultTime: 120, maxIntroTime: 900, maxOutroTime: 300,
              endless: selection.endless === true,
              fightStartLockTicks: BENCHMARK_START_LOCK_TICKS },
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
    this.paletteFallbacks = new Map();
    this.sent = new Set();
    this.assets = [];
    this.events = [];
    this.sparks = [];
    this.gameEffects = [];
    this.helperFrameStats={alive:0,hidden:0,submitted:0,missingAnimation:0,missingSprite:0};
    this.roundGeneration = this.match.roundGeneration;
    this.issues = new Map(this.commonEffects.issues.map(d=>[d.type+":"+d.message,d]));
    this.closed = false;
    this.videoSprites = new Map();
    if (this.match.stage) this.match.stage.viewportAspect = presentationAspect(this.presentation);
    this.modelReady = false;
    this.lua = null;
    this.luaModules = luaModules(files, selection);
    this.capabilities = {
      format: "kenjatime-core-coverage-v1",
      engine: "Kenjatime Core",
      independentRuntime: true,
      universalCompatibility: false,
      legacyCompatibilityTarget:this.legacyCompatibility.id,
      legacyCompatibilityReference:this.legacyCompatibility.reference,
      legacyCompatibilityStatus:this.legacyCompatibility.status,
      nativeMugen11Certified:false,
      ikemenExtensions:"additional-not-baseline",
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
  /** Update the stage-camera viewport without changing any authored fighter physics. */
  setPresentation(value) {
    this.presentation = normalizePresentation(value);
    if (this.match.stage) this.match.stage.viewportAspect = presentationAspect(this.presentation);
    return this.presentation;
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
  syncRoundGeneration() {
    if (this.roundGeneration === this.match.roundGeneration) return;
    this.roundGeneration = this.match.roundGeneration;
    // All transient world effects belong to the previous round's actors.
    // Keep decoded sprites/textures cached for the next round.
    this.gameEffects = [];
    this.sparks = [];
    this.events = [];
    this.effects = new EffectsState();
  }
  tick(left = new Set(), right = new Set()) {
    if (this.closed) throw Error("Match is closed.");
    this.syncRoundGeneration();
    const match = this.match,
      paused = (e) => match.isFrozen(e) || e.hitPauseTime > 0;
    this.effects.advance({ paused });
    this.gameEffects = this.gameEffects.filter(fx=>{
      if (!fx.animation.frames.length) return false;
      // Pause and hitstop freeze effect clocks, including their max lifetime.
      if (fx.owner && paused(fx.owner)) return true;
      if (++fx.age > (fx.maxAge ?? 3600)) return false;
      const frame=fx.animation.frames[fx.frameIndex];
      if(frame.ticks<0) return true;
      if(++fx.frameTime>=Math.max(1,frame.ticks)){
        fx.frameTime=0;
        if(++fx.frameIndex>=fx.animation.frames.length){
          if(fx.animation.loopDeclared || fx.animation.loopStart>0)
            fx.frameIndex=fx.animation.loopStart;
          else return false;
        }
      }
      return true;
    });
    match.tick(new Set(), new Set(), {
      playerInput: left,
      opponentInput: right,
    });
    this.syncRoundGeneration();
    this.lua?.step();
    this.commands = [
      match.inputBuffers.get(match.player),
      match.inputBuffers.get(match.opponent),
    ];
    for (const entity of match.eventEntities) {
      this.effects.consume(entity.events, { entity });
      for (const event of entity.events) {
        if (event.type === 'gameanim') {
          const animation=this.commonEffects.animations.get(event.anim);
          if (animation && this.commonEffects.resource){
            if(this.gameEffects.length>=256)this.gameEffects.shift();
            this.gameEffects.push({animation,frameIndex:0,frameTime:0,age:0,owner:entity,pos:event.pos,facing:event.facing,under:event.under});
          }else this.issue('common-effects',`GameMakeAnim ${event.anim} requires imported fightfx AIR/SFF.`);
        }
        if (["playsnd", "stopsnd", "sndpan"].includes(event.type))
          this.events.push({
            ...cloneEvent(event, entity.id),
            character: entity.character.path,
          });
      }
    }
    for (const event of match.presentationEvents)
      this.effects.consume([event], { entity: event.entity || event.owner });
    // Use the exact HitDef hit/guard spark AIR & SFF action rather than a
    // generic GPU flash whenever the authored resources are available.
    for (const hit of match.events) {
      if(hit.typeNone)continue;
      const attacker=hit.attacker?.isProjectile ? hit.attacker.owner : hit.attacker;
      const definition=hit.hitDef||{},guarded=!!hit.guarded;
      const no=Number(guarded?definition['guard.sparkno']:definition.sparkno),
        common=guarded?definition.guardSparkCommon!==false:definition.sparkCommon!==false,
        catalog=common?this.commonEffects.animations:attacker?.animations,
        resource=common?this.commonEffects.resource:attacker?.character,
        animation=catalog?.get(no),
        offset=Array.isArray(definition.sparkxy)?definition.sparkxy:[0,0],
        factor=definition.coordinateScale??attacker?.coordinateScale??1;
      let rendered=false;
      if(Number.isFinite(no)&&no>=0&&animation?.frames?.length&&resource&&attacker){
        // An action ID can exist while every referenced sprite is absent from
        // the original SFF. Keep this distinct from successful rendering.
        // Negative AIR sprite groups are intentionally invisible.
        const visible=animation.frames.filter(frame=>frame.group>=0);
        let sourceAvailable=true;
        if(visible.length){
          try{
            this.bank(resource);
            const indices=this.indices.get(resource);
            sourceAvailable=visible.some(frame=>indices.has(frame.group+','+frame.number));
          }catch(error){sourceAvailable=false;this.issue('sprite',error.message);}
        }
        if(!sourceAvailable){
          this.issue('missing-sprite',`HitDef ${guarded?'guard ':''}spark ${common?'F':''}${no} contains no source sprites in its SFF.`);
        }else {
        if(this.gameEffects.length>=256)this.gameEffects.shift();
        this.gameEffects.push({animation,resource,scale:common?this.commonEffects.scale:baseScale(attacker),
          frameIndex:0,frameTime:0,age:0,maxAge:120,owner:attacker,under:false,
          pos:{x:hit.x+(offset[0]||0)*factor*attacker.facing,
            y:attacker.pos.y+(offset[1]||0)*factor},facing:attacker.facing});
        rendered=true;
        }
      }else if(Number.isFinite(no)&&no>=0)
        this.issue('missing-animation',`HitDef ${guarded?'guard ':''}spark ${common?'F':''}${no} is unavailable from imported assets.`);
      if(!rendered)this.sparks.push({x:hit.x,y:hit.y,age:0,guarded});
      const snd=guarded?definition.guardsound:definition.hitsound;
      const pair=Array.isArray(snd)?snd:[snd,0];
      if(attacker&&pair[0]!==undefined&&Number.isFinite(Number(pair[0]))&&Number(pair[0])>=0)
        this.events.push({type:'playsnd',group:Number(pair[0]),number:Number(pair[1]||0),
          common:guarded?definition.guardSoundCommon!==false:definition.hitSoundCommon!==false,
          channel:-1,character:attacker.character.path,entity:attacker.id});
    }
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
    // MUGEN AIR group -1 is intentionally sprite-less; not missing source art.
    if(!frame || frame.group < 0)return null;
    try {
      const bank = this.bank(resource),
        index = this.indices
          .get(resource)
          .get(frame.group + "," + frame.number);
      if (index === undefined) {
        this.issue('missing-sprite', (resource?.sprite?.path||resource?.path||'unidentified bank')+
          ': AIR sprite '+frame.group+','+frame.number+' is absent from source SFF.');
        return null;
      }
      const bankId = this.bankIds.get(resource),
        id = bankId + ":" + index;
      let sprite = this.spriteMetadata.get(id);
      if (!sprite) {
        const decoded = bank.decodeForDisplay?.(index) || bank.decodeIndexed?.(index) || bank.decode(index),
          indexed = !!decoded.indices;
        if(decoded.sourceIncomplete)this.issue('sprite-incomplete',
          (resource?.sprite?.path||resource?.path||'SFF')+' sprite '+frame.group+','+frame.number+
          ': original PCX contains '+decoded.decodedPrefixPixels+'/'+decoded.totalSourcePixels+
          ' encoded pixels. Remaining pixels are transparent; replace source art for native parity.');
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
          role: "palette",
        });
        // A missing authored palette can use this per-palette 1 KiB fallback
        // when GPU eviction later requires it again.
        this.paletteFallbacks.set(paletteId, pixels.slice());
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
  /** Reconstruct only images explicitly missing from the active GPU frame. */
  restoreAssets(ids) {
    const assets = [];
    if (this.closed) return assets;
    const resources = new Map([...this.bankIds].map(([resource, id]) => [String(id), resource]));
    for (const id of new Set(ids || [])) {
      if (typeof id !== 'string' || id.startsWith('@')) continue;
      const split = id.indexOf(':'),resource = resources.get(id.slice(0, split));
      if (split < 1 || !resource) continue;
      const bank = this.banks.get(resource);
      if (!bank) continue;
      try {
        if (id.includes(':pal:')) {
          const pair = id.slice(id.indexOf(':pal:') + 5).split(',').map(Number);
          if (pair.length !== 2 || pair.some(n => !Number.isSafeInteger(n))) continue;
          const pixels = this.paletteFallbacks.get(id) || bank.paletteColors(...pair);
          if (!pixels || pixels.length < 1024) continue;
          assets.push({id,width:256,height:1,indexed:false,role:"palette",pixels:new Uint8Array(pixels.slice(0,1024))});
        } else {
          const index = Number(id.slice(split+1)), meta = this.spriteMetadata.get(id);
          if (!Number.isSafeInteger(index) || index < 0 || !meta) continue;
          const decoded = bank.decodeForDisplay?.(index) || bank.decodeIndexed?.(index) || bank.decode(index);
          const pixels = meta.indexed ? decoded.indices : decoded.rgba;
          if (!pixels || pixels.length !== meta.w * meta.h * (meta.indexed ? 1 : 4)) continue;
          assets.push({id,width:meta.w,height:meta.h,indexed:meta.indexed,pixels:new Uint8Array(pixels)});
          bank.clearDecodedCache?.();
        }
      } catch (error) {
        this.issue('texture-restore', 'Could not restore sprite ' + id + ': ' + error.message);
      }
    }
    return assets;
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
      scale = Math.min(960 / (v.displayWidth || 320), 540 / (v.displayHeight || 240)),
      camera = m.cameraRuntime.camera,
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
    const helperFrameStats={alive:0,hidden:0,submitted:0,missingAnimation:0,missingSprite:0};
    for (const actor of [...m.renderEntities, ...m.drawProjectiles]) {
      if(actor.parent&&!actor.destroyed){
        helperFrameStats.alive++;
        if(actor.asserted.has("invisible"))helperFrameStats.hidden++;
      }
      if (!actor.destroyed && !actor.asserted.has("invisible"))
        layers.push({ priority: actor.sprPriority || 0, actor });
      for (const effect of actor.drawExplods || [])
        layers.push({
          priority: explodDrawPriority(effect),
          actor,
          effect,
        });
    }
    for(const gameEffect of this.gameEffects)
      layers.push({priority:gameEffect.under?-1000:1000,gameEffect});
    layers.sort((a, b) => a.priority - b.priority);
    for (const { actor, effect, gameEffect } of layers) {
      if(gameEffect){
        const pos=world(gameEffect.pos),unit=zoom*(gameEffect.scale??this.commonEffects.scale);
        this.quad(draws,gameEffect.resource||this.commonEffects.resource,sampleAnimation(gameEffect.animation,gameEffect.frameIndex,gameEffect.frameTime),{
          ...pos,sx:unit,sy:unit,facing:gameEffect.facing,remaps:null,palette:this.effects.paletteFor(gameEffect.owner)
        });
        continue;
      }
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
      const visibleFrame=sampleFighterAnimation(actor);
      const drawn=this.quad(draws, actor.character, visibleFrame, {
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
      if(actor.parent&&!actor.destroyed){
        if(!visibleFrame)helperFrameStats.missingAnimation++;
        else if(!drawn)helperFrameStats.missingSprite++;
        else helperFrameStats.submitted++;
      }
    }
    this.helperFrameStats=helperFrameStats;
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
      // Expose IKEMEN match-wide shadow suppression until sprite shadows are implemented.
      suppressCharacterShadows:m.entities.some(a=>a.asserted.has('globalnoshadow')),
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
    const stage = this.match.stage, view = this.match.view;
    return {
      engine: "Kenjatime Core",
      compatibility: this.legacyCompatibility,
      presentation: this.presentation,
      viewport: stage ? {
        displayWidth: view.displayWidth, displayHeight: view.displayHeight,
        left: view.left, right: view.right, top: view.top, bottom: view.bottom,
        cameraX: stage.camera.x, cameraY: stage.camera.y, zoom: stage.camera.zoom,
        backgroundScale: stage.definition.backgroundScale,
        screenLeft: stage.definition.screenLeft, screenRight: stage.definition.screenRight,
      } : null,
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
      helperStats: {...this.match.helperStats},
      helperFrameStats: {...this.helperFrameStats},
      helpers:this.match.entities.filter(a=>a.parent).map(a=>({
        id:a.id,helperId:a.helperId,parentId:a.parent?.id,
        rootId:a.root?.id,state:a.stateNo,anim:a.anim,
        stateOwnerId:a.stateOwner?.id ?? a.id,
        animationOwnerId:a.animationOwner?.id ?? a.id,
        boundTargetId:a.bound?.target?.id ?? null,
        bindTime:a.bound?.time ?? null,
        frame:a.frameIndex,x:a.pos.x,y:a.pos.y,
        invisible:a.asserted.has("invisible")
      })),
      roundState: this.match.roundFlow?.roundState ?? 2,
      roundNo: this.match.roundFlow?.roundNo ?? 1,
      roundPhaseTime: this.match.roundFlow?.phaseTime ?? 0,
      roundTimeLeft: this.match.roundFlow?.timeLeft ?? -1,
      roundKoHoldTicks: [...(this.match.roundFlow?.zeroLifeNoKOTicks || [0, 0])],
      endlessMode: this.match.roundFlow?.rules.endless === true,
      roundWins: {...(this.match.roundFlow?.wins || {player:0,opponent:0})},
      roundWinner: this.match.roundFlow?.roundWinner ?? null,
      roundReason: this.match.roundFlow?.reason ?? null,
      matchOver: this.match.roundFlow?.matchOver ?? false,
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
    if(this.closed)return;
    this.lua?.close();
    try{this.match?.kotlinCombatKernel?.dispose?.();}finally{if(this.match)this.match.kotlinCombatKernel=null;}
    this.closed = true;
    for (const b of this.banks.values()) b.clearDecodedCache();
    this.banks.clear();
    this.sent.clear();
    this.paletteFallbacks.clear();
    this.gameEffects=[];
    this.events = [];
  }
}
