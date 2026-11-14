/** Original Kenjatime sprite renderer. Uses Three's public scene API directly;
 * indexed pixels and palettes are separate textures, never per-frame RGBA copies.
 */
import {planTextureEvictions} from "./texture-residency.js";
import {TextureBudgetGovernor, GPU_MIB} from "./texture-budget-governor.js";
import {visibleArenaDraws} from "./quad-visibility.js";
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  RawShaderMaterial,
  DataTexture,
  Texture,
  LinearFilter,
  RedFormat,
  RGBAFormat,
  UnsignedByteType,
  NearestFilter,
  ClampToEdgeWrapping,
  CustomBlending,
  OneFactor,
  OneMinusSrcAlphaFactor,
  AddEquation,
  ReverseSubtractEquation,
  LinearSRGBColorSpace,
  NoColorSpace,
  GLSL3,
  DoubleSide,
} from "three";
const vertex = `precision highp float;
in vec3 position;in vec2 uv;uniform mat4 projectionMatrix,modelViewMatrix;uniform vec2 size,warpBounds;uniform bool warped;out vec2 texUV,localPoint;
void main(){texUV=uv;localPoint=position.xy*size;if(warped)localPoint.x=mix(warpBounds.x,warpBounds.y,position.x);gl_Position=projectionMatrix*modelViewMatrix*vec4(localPoint,0.,1.);}`;
const fragment = `precision highp float;
uniform sampler2D image,palette;uniform bool indexed,maskZero;uniform vec2 coefficients;uniform float opacity;
uniform bool warped;uniform vec4 warpEdges;uniform vec2 size;uniform int fxCount;uniform vec3 fxAdd[8],fxMul[8],fxPost[8];uniform vec2 fxColorInvert[8];in vec2 texUV,localPoint;out vec4 result;
void main(){vec2 sampleUV=texUV;if(warped){vec2 edges=mix(warpEdges.xy,warpEdges.zw,clamp(localPoint.y/size.y,0.,1.));float span=edges.y-edges.x;if(abs(span)<.00001)discard;float u=(localPoint.x-edges.x)/span;if(u<0.||u>=1.)discard;sampleUV=vec2(u,localPoint.y/size.y);}vec4 color;if(indexed){int i=int(floor(texture(image,sampleUV).r*255.+.5));if(i==0&&maskZero)discard;color=texelFetch(palette,ivec2(i,0),0);if(i==0)color.a=1.;}else{color=texture(image,sampleUV);}if(color.a<=0.)discard;
vec3 rgb=color.rgb*255.;for(int i=0;i<8;i++){if(i>=fxCount)break;float grey=dot(rgb,vec3(.299,.587,.114));rgb=mix(vec3(grey),rgb,fxColorInvert[i].x);if(fxColorInvert[i].y>.5)rgb=255.-rgb;rgb=clamp((rgb+fxAdd[i])*fxMul[i]+fxPost[i],0.,255.);}
rgb=floor(rgb+.00001)/255.;float coverage=color.a*opacity;result=vec4(rgb*coefficients.x*coverage,coverage*(1.-coefficients.y));}`;
const gridFragment = `precision highp float;uniform float ground;in vec2 texUV;out vec4 result;
void main(){vec2 p=vec2(texUV.x*960.,texUV.y*540.);vec3 color=vec3(.047,.067,.106);float h=ground-105.;if(p.y>h){float distance=p.y-h+16.;float x=(p.x-480.)*100./distance;float lines=min(abs(fract(x/80.+.5)-.5)*distance/100.,abs(fract(log(distance/16.)*3.)-.5)*distance*.18);color=mix(vec3(.105,.153,.215),color,smoothstep(.35,1.1,lines));}if(abs(p.y-ground)<.6)color=vec3(.27,.38,.33);result=vec4(color,1.);}`;
const fxArrays = () => ({
  add: Array.from({ length: 8 }, () => [0, 0, 0]),
  mul: Array.from({ length: 8 }, () => [1, 1, 1]),
  post: Array.from({ length: 8 }, () => [0, 0, 0]),
  color: Array.from({ length: 8 }, () => [1, 0]),
});
export class CoreThreeRenderer {
  constructor(
    canvas,
    { maxTextureBytes = 64 * 1024 * 1024, preserveDrawingBuffer = false } = {},
  ) {
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer,
    });
    this.renderer.debug.onShaderError = (gl, program) => {
      throw Error(
        "Sprite shader could not compile: " + gl.getProgramInfoLog(program),
      );
    };
    this.renderer.outputColorSpace = LinearSRGBColorSpace;
    this.renderer.sortObjects = false;
    this.renderer.setClearColor(0x0c111b, 1);
    this.canvas = canvas;
    this.contextLost = (event) => {
      event.preventDefault();
      this.lost = true;
    };
    canvas.addEventListener("webglcontextlost", this.contextLost);
    this.limit = maxTextureBytes;
    // Only the default 64 MiB R8 cache may expand, and never above 96 MiB.
    // Explicitly constrained renderers keep their exact caller-supplied cap.
    this.textureBudgetGovernor = new TextureBudgetGovernor({
      initialBytes:this.limit,
      maxBytes:maxTextureBytes===64*GPU_MIB?96*GPU_MIB:this.limit,
    });
    this.textureBytes = 0;
    // Raw resident pixel bytes by format; video/model allocations are tracked separately.
    this.textureBreakdown = { indexed: 0, palette: 0, rgba: 0 };
    this.textures = new Map();
    this.evictedTextures = 0;
    this.recycledTextures = 0;
    this.deferredTextures = 0;
    this.slots = [];
    this.frames = 0;
    this.scene = new Scene();
    this.camera = new OrthographicCamera(0, 960, 0, 540, -10, 10);
    this.camera.position.z = 1;
    this.geometry = new BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0], 3),
    );
    this.geometry.setAttribute(
      "uv",
      new Float32BufferAttribute([0, 0, 1, 0, 0, 1, 1, 1], 2),
    );
    this.geometry.setIndex([0, 1, 2, 2, 1, 3]);
    const material = new RawShaderMaterial({
      glslVersion: GLSL3,
      vertexShader: vertex,
      fragmentShader: gridFragment,
      uniforms: {
        size: { value: [960, 540] },
        ground: { value: 450 },
        warped: { value: false },
        warpBounds: { value: [0, 0] },
      },
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
    });
    this.grid = new Mesh(this.geometry, material);
    this.grid.frustumCulled = false;
    this.scene.add(this.grid);
    this.upload({
      id: "@white",
      width: 1,
      height: 1,
      indexed: false,
      pixels: new Uint8Array([255, 255, 255, 255]),
    });
    const pixels = new Uint8Array(8 * 8 * 4);
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++)
        if (x === 3 || y === 3 || Math.abs(x - 3) === Math.abs(y - 3)) {
          const i = (y * 8 + x) * 4;
          pixels.set([255, 240, 130, 255], i);
        }
    this.upload({ id: "@spark", width: 8, height: 8, pixels });
  }
  /** Reserve raw GPU backing bytes, never evicting the current visible frame. */
  makeRoomFor(requiredBytes, activeIds = new Set()) {
    const evictions = planTextureEvictions(
      this.textures, this.textureBytes, requiredBytes, this.limit, activeIds,
    );
    if (!evictions) return false;
    for (const id of evictions) {
      const old = this.textures.get(id);
      if (!old) continue;
      const bytes = old.userData?.residentBytes ?? old.userData?.videoBytes ?? 0;
      const kind = old.userData?.kind;
      old.dispose();
      this.textureBytes -= bytes;
      this.textureBreakdown ||= { indexed: 0, palette: 0, rgba: 0, video: 0 };
      const counter = kind === "indexed8" ? "indexed" :
        kind === "rgba8" ? "rgba" :
        kind === "palette" ? "palette" :
        kind === "video" ? "video" : null;
      if (counter) this.textureBreakdown[counter] =
        Math.max(0, (this.textureBreakdown[counter] || 0) - bytes);
      this.textures.delete(id);
      this.evictedTextures++;
    }
    return true;
  }
  /** Rebind an inactive, same-size GPU DataTexture instead of allocating and
   * destroying an identical WebGL texture each time huge SFF frames churn.
   * Only exact type and dimensions may be reused: never convert indexed R8,
   * 256x1 palettes or RGBA pixels into one another. */
  recycleTexture(asset,kind,pixels,activeIds) {
    for(const [oldId,texture] of this.textures) {
      if(oldId==='@white'||oldId==='@spark'||activeIds.has(oldId))continue;
      if(texture.userData.kind!==kind ||
         texture.userData.residentBytes!==pixels.length ||
         texture.image?.width!==asset.width ||
         texture.image?.height!==asset.height)continue;
      // The DataTexture and its GL allocation retain their original format.
      // Replacing the pixel backing and marking it dirty uses Three's texture
      // update path; a current-frame draw never holds this old ID.
      texture.image.data=pixels;
      texture.needsUpdate=true;
      this.textures.delete(oldId);
      this.textures.set(asset.id,texture);
      this.evictedTextures++;
      this.recycledTextures=(this.recycledTextures||0)+1;
      return true;
    }
    return false;
  }
  upload(asset, activeIds = new Set()) {
    if (this.textures.has(asset.id)) return true;
    const isPalette = asset.role === "palette" ||
      (!asset.indexed && typeof asset.id === "string" && asset.id.includes(":pal:"));
    const kind = isPalette ? "palette" : asset.indexed ? "indexed8" : "rgba8";
    const pixels = asset.pixels;
    const expected = asset.width * asset.height * (kind === "indexed8" ? 1 : 4);
    if (
      !Number.isSafeInteger(asset.width) ||
      !Number.isSafeInteger(asset.height) ||
      asset.width < 1 ||
      asset.height < 1
    )
      throw Error("Invalid GPU asset dimensions.");
    if (
      asset.width > this.renderer.capabilities.maxTextureSize ||
      asset.height > this.renderer.capabilities.maxTextureSize
    )
      throw Error("Sprite exceeds this graphics device’s texture limit.");
    if (!Number.isSafeInteger(expected) ||
        !(pixels instanceof Uint8Array) || pixels.length !== expected)
      throw Error("Invalid GPU asset dimensions.");
    if (isPalette && (asset.indexed || asset.width !== 256 || asset.height !== 1))
      throw Error("A GPU palette must be a 256x1 RGBA8 texture.");
    if(this.textureBytes+pixels.length>this.limit &&
       this.recycleTexture(asset,kind,pixels,activeIds))return true;
    if (!this.makeRoomFor(pixels.length, activeIds)) {
      // An oversized visible frame is deferred, never a reason to stop combat.
      this.deferredTextures++;
      return false;
    }
    const texture = new DataTexture(
      pixels,
      asset.width,
      asset.height,
      kind === "indexed8" ? RedFormat : RGBAFormat,
      UnsignedByteType,
    );
    // Explicit WebGL2 formats: indices are GL_R8, palette/truecolor are GL_RGBA8.
    // Do not color-convert index or palette bytes; the shader applies PalFX later.
    texture.internalFormat = kind === "indexed8" ? "R8" : "RGBA8";
    texture.colorSpace = NoColorSpace;
    texture.minFilter = texture.magFilter = NearestFilter;
    texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
    texture.generateMipmaps = false;
    texture.flipY = false;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;
    texture.userData.residentBytes = pixels.length;
    texture.userData.kind = kind;
    this.textures.set(asset.id, texture);
    this.textureBytes += pixels.length;
    this.textureBreakdown ||= { indexed: 0, palette: 0, rgba: 0 };
    this.textureBreakdown[kind === "indexed8" ? "indexed" : kind === "palette" ? "palette" : "rgba"] += pixels.length;
    return true;
  }
  /** Reject missing or mismatched palettes instead of sampling white/undefined texels. */
  resolveDrawTextures(draw) {
    const image = this.textures.get(draw.texture);
    if (!image) return null;
    const kind = image.userData.kind;
    if (draw.indexed) {
      if (kind !== "indexed8") return null;
      const palette = this.textures.get(draw.palette);
      return palette?.userData.kind === "palette" ? { image, palette } : null;
    }
    if (kind === "indexed8" || kind === "palette") return null;
    return { image, palette: this.textures.get("@white") };
  }
  slot(index) {
    if (this.slots[index]) return this.slots[index];
    const arrays = fxArrays(),
      material = new RawShaderMaterial({
        glslVersion: GLSL3,
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          image: { value: null },
          palette: { value: null },
          indexed: { value: false },
          maskZero: { value: true },
          size: { value: [1, 1] },
          warped: { value: false },
          warpEdges: { value: [0, 1, 0, 1] },
          warpBounds: { value: [0, 1] },
          coefficients: { value: [1, 0] },
          opacity: { value: 1 },
          fxCount: { value: 0 },
          fxAdd: { value: arrays.add.flat() },
          fxMul: { value: arrays.mul.flat() },
          fxPost: { value: arrays.post.flat() },
          fxColorInvert: { value: arrays.color.flat() },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: CustomBlending,
        blendSrc: OneFactor,
        blendDst: OneMinusSrcAlphaFactor,
        blendEquation: AddEquation,
        blendEquationAlpha: AddEquation,
        blendSrcAlpha: OneFactor,
        blendDstAlpha: OneMinusSrcAlphaFactor,
      });
    material.side = DoubleSide;
    material.forceSinglePass = true;
    const mesh = new Mesh(this.geometry, material);
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.onBeforeRender = () => {
      const clip = mesh.userData.clip,
        r = this.renderer,
        k = this.canvas.width / 960;
      r.setScissorTest(!!clip);
      if (clip)
        r.setScissor(
          clip[0] * k,
          (540 - clip[1] - clip[3]) * k,
          clip[2] * k,
          clip[3] * k,
        );
      material.uniformsNeedUpdate = true;
    };
    this.scene.add(mesh);
    this.slots[index] = mesh;
    return mesh;
  }
  updateVideo(data) {
    const bitmap = data.bitmap;
    try {
      if (this.closed || this.lost) return false;
      const bytes = bitmap.width * bitmap.height * 4;
      if (
        bitmap.width < 1 ||
        bitmap.height < 1 ||
        bitmap.width > 1280 ||
        bitmap.height > 720
      )
        throw Error("Invalid stage video frame dimensions.");
      let texture = this.textures.get(data.id);
      if (texture && texture.userData.kind !== "video")
        throw Error("Stage video texture ID conflicts with an existing sprite.");
      const old = texture?.userData.videoBytes || 0;
      // Replace an existing video in place: reserve only its growth. Preserve
      // the last displayed frame and the video being updated during eviction.
      const protectedIds = new Set(this.activeTextureIds || []);
      protectedIds.add(data.id);
      if (!this.makeRoomFor(Math.max(0, bytes - old), protectedIds)) {
        // Temporary memory pressure must not permanently disable a video or
        // cause an error that ends the match. A later frame can try again.
        this.deferredVideoFrames = (this.deferredVideoFrames || 0) + 1;
        return false;
      }
      if (!texture) {
        texture = new Texture();
        texture.generateMipmaps = false;
        texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
        texture.flipY = false;
        this.textures.set(data.id, texture);
      }
      texture.minFilter = texture.magFilter =
        data.filter === "neighbor" ? NearestFilter : LinearFilter;
      texture.image = bitmap;
      texture.needsUpdate = true;
      this.renderer.initTexture(texture);
      texture.userData.videoBytes = bytes;
      texture.userData.kind = "video";
      this.textureBytes += bytes - old;
      this.textureBreakdown ||= { indexed: 0, palette: 0, rgba: 0, video: 0 };
      this.textureBreakdown.video = (this.textureBreakdown.video || 0) + bytes - old;
      this.videoUploads = (this.videoUploads || 0) + 1;
      return true;
    } finally {
      bitmap?.close();
    }
  }
  async loadStage(definition, files) {
    if (!definition?.model?.path || this.closed) return false;
    const { ModelStage } = await import("./model-stage.js");
    if (this.closed) return false;
    const model = await ModelStage.load(definition, files, this.renderer, {
      textureBudget: Math.min(32 * 1024 * 1024, this.limit - this.textureBytes),
    });
    if (this.closed) {
      model?.close();
      return false;
    }
    this.model = model;
    this.textureBytes += model?.textureBytes || 0;
    return !!model;
  }
  render(frame, { width = 960, height = 540, restoreAssets = null } = {}) {
    if (this.closed) return;
    if (this.lost)
      throw Error(
        "Graphics context was lost. Start the match again from your library.",
      );
    if (this.canvas.width !== width || this.canvas.height !== height)
      this.renderer.setSize(width, height, false);
    // Cull logical 960x540 offscreen quads BEFORE texture upload and LRU
    // pinning. The user can lose 4000+ GPU textures per 90s on large stages;
    // art outside the arena must not evict visible sprites.
    const visibility=visibleArenaDraws(frame.draws);
    const visibleDraws=visibility.visible;
    // Frame residency is determined by visible draws, not by every animation
    // ever visited during this match. Imported character SFFs can contain
    // hundreds of MiB of sprites even when only a handful are visible.
    const activeTextures = new Set(['@white', '@spark']);
    for (const draw of visibleDraws) {
      if (draw.texture) activeTextures.add(draw.texture);
      if (draw.indexed && draw.palette) activeTextures.add(draw.palette);
    }
    // Also protect these IDs when asynchronous stage-video updates arrive
    // between presentation frames.
    this.activeTextureIds = activeTextures;
    for (const asset of frame.assets || [])
      if (activeTextures.has(asset.id)) this.upload(asset, activeTextures);
    let missing = [...activeTextures].filter(id => !this.textures.has(id));
    if (missing.length && restoreAssets) {
      // CoreSession retains compressed banks and can reconstruct evicted image
      // data without keeping a second large RGBA cache in JavaScript memory.
      for (const asset of restoreAssets(missing) || [])
        if (activeTextures.has(asset.id)) this.upload(asset, activeTextures);
      missing = missing.filter(id => !this.textures.has(id));
    }
    // Refresh LRU by visible-use order after upload. An active texture is
    // pinned for the whole render; a previous frame's art may be evicted.
    for (const id of activeTextures) {
      const tex = this.textures.get(id);
      if (tex) { this.textures.delete(id); this.textures.set(id, tex); }
    }
    this.missingFrameTextures = missing.length;
    this.missingPaletteDraws = 0;
    this.grid.visible = !!frame.grid;
    this.grid.material.uniforms.ground.value = frame.ground || 450;
    const draws = visibleDraws.concat(
      (frame.sparks || []).map((s) => {
        const scale = (12 - s.age) * 0.3 + 1;
        return {
          texture: "@spark",
          indexed: false,
          width: 8,
          height: 8,
          matrix: [scale, 0, 0, scale, s.x - 4 * scale, s.y - 4 * scale],
          blend: { mode: "add", source: 1, destination: 1 },
          alpha: (12 - s.age) / 12,
        };
      }),
    );
    for (let i = 0; i < Math.max(draws.length, this.slots.length); i++) {
      if (i >= draws.length) {
        this.slots[i].visible = false;
        continue;
      }
      const q = draws[i],
        mesh = this.slot(i),
        u = mesh.material.uniforms;
      mesh.visible = true;
      mesh.layers.set((q.pass ?? 1) + 1);
      const bindings = this.resolveDrawTextures(q);
      if (!bindings) {
        // Never sample an indexed sprite through a missing or unrelated
        // palette. Preserve the match and restore the asset on a future frame.
        if (q.indexed && this.textures.has(q.texture)) this.missingPaletteDraws++;
        mesh.visible = false;
        continue;
      }
      u.image.value = bindings.image;
      u.palette.value = bindings.palette;
      u.indexed.value = !!q.indexed;
      u.maskZero.value = q.mask !== false;
      u.size.value[0] = q.width;
      u.size.value[1] = q.height;
      u.warped.value = !!q.warp;
      if (q.warp) {
        for (let n = 0; n < 4; n++) u.warpEdges.value[n] = q.warp[n];
        u.warpBounds.value[0] = Math.min(...q.warp);
        u.warpBounds.value[1] = Math.max(...q.warp);
      }
      u.opacity.value = q.alpha ?? 1;
      u.coefficients.value[0] = q.blend?.source ?? 1;
      u.coefficients.value[1] = q.blend?.destination ?? 0;
      const [a, b, c, d, x, y] = q.matrix;
      mesh.matrix.set(a, c, 0, x, b, d, 0, y, 0, 0, 1, 0, 0, 0, 0, 1);
      mesh.matrixWorldNeedsUpdate = true;
      mesh.userData.clip = q.clip;
      mesh.material.blendEquation =
        q.blend?.mode === "subtract" ? ReverseSubtractEquation : AddEquation;
      const fx = q.palFX || [];
      u.fxCount.value = Math.min(8, fx.length);
      for (let n = 0; n < u.fxCount.value; n++) {
        const effect = fx[n],
          sin = effect.sinadd || [],
          wave = sin[3]
            ? Math.sin((2 * Math.PI * (effect.age || 0)) / sin[3])
            : 0;
        u.fxColorInvert.value[n * 2] = (effect.color ?? 256) / 256;
        u.fxColorInvert.value[n * 2 + 1] = effect.invertall ? 1 : 0;
        for (let axis = 0; axis < 3; axis++) {
          u.fxAdd.value[n * 3 + axis] =
            (effect.add?.[axis] || 0) + (sin[axis] || 0) * wave;
          u.fxMul.value[n * 3 + axis] = (effect.mul?.[axis] ?? 256) / 256;
          u.fxPost.value[n * 3 + axis] = effect.postadd?.[axis] || 0;
        }
      }
    }
    this.renderer.setScissorTest(false);
    if (this.model && frame.model) {
      this.renderer.autoClear = false;
      this.renderer.clear();
      this.model.update(frame.model);
      for (const layer of [-1, 0, 1, 2]) {
        if (layer < 1) this.model.render(layer);
        if (layer === 2) this.model.render(1);
        this.camera.layers.set(layer + 1);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setScissorTest(false);
      }
      this.renderer.autoClear = true;
    } else {
      this.camera.layers.enableAll();
      this.renderer.render(this.scene, this.camera);
    }
    this.renderer.setScissorTest(false);
    this.frames++;
    this.limit=this.textureBudgetGovernor.observe({
      frames:this.frames,evictions:this.evictedTextures,
      residentBytes:this.textureBytes,
    });
    this.stats = {
      backend: "Kenjatime Core · Three.js",
      frames: this.frames,
      draws: draws.length,
      submittedDraws: (frame.draws?.length||0)+(frame.sparks?.length||0),
      offscreenCulledDraws:visibility.culled,
      textureBytes: this.textureBytes,
      textureBudgetBytes: this.limit,
      textureBudgetUpgrades: this.textureBudgetGovernor.upgrades,
      textures: this.textures.size,
      textureEvictions: this.evictedTextures,
      recycledTextures: this.recycledTextures || 0,
      deferredTextures: this.deferredTextures,
      missingFrameTextures: this.missingFrameTextures || 0,
      missingPaletteDraws: this.missingPaletteDraws || 0,
      indexedTextureBytes: this.textureBreakdown?.indexed || 0,
      paletteTextureBytes: this.textureBreakdown?.palette || 0,
      truecolorTextureBytes: this.textureBreakdown?.rgba || 0,
      videoTextureBytes: this.textureBreakdown?.video || 0,
      deferredVideoFrames: this.deferredVideoFrames || 0,
      // Raw index bytes saved versus expanding the same images to RGBA8.
      indexedRawBytesSaved: (this.textureBreakdown?.indexed || 0) * 3,
      width,
      height,
      videoUploads: this.videoUploads || 0,
      model: !!this.model,
      shadowUpdates: this.model?.shadowUpdates || 0,
    };
    return this.stats;
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    this.model?.close();
    this.canvas.removeEventListener("webglcontextlost", this.contextLost);
    for (const texture of this.textures.values()) texture.dispose();
    for (const mesh of this.slots) mesh.material.dispose();
    this.grid.material.dispose();
    this.geometry.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.textures.clear();
    this.activeTextureIds?.clear();
  }
}
