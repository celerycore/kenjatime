/** Original Kenjatime sprite renderer. Uses Three's public scene API directly;
 * indexed pixels and palettes are separate textures, never per-frame RGBA copies.
 */
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  RawShaderMaterial,
  DataTexture,
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
  GLSL3,
  DoubleSide,
} from "three";
const vertex = `precision highp float;
in vec3 position;in vec2 uv;uniform mat4 projectionMatrix,modelViewMatrix;uniform vec2 size,warpBounds;uniform bool warped;out vec2 texUV,localPoint;
void main(){texUV=uv;localPoint=position.xy*size;if(warped)localPoint.x=mix(warpBounds.x,warpBounds.y,position.x);gl_Position=projectionMatrix*modelViewMatrix*vec4(localPoint,0.,1.);}`;
const fragment = `precision highp float;
uniform sampler2D image,palette;uniform bool indexed,maskZero;uniform vec2 coefficients;uniform float opacity;
uniform bool warped;uniform vec4 warpEdges;uniform vec2 size;uniform int fxCount;uniform vec3 fxAdd[8],fxMul[8],fxPost[8];uniform vec2 fxColorInvert[8];in vec2 texUV,localPoint;out vec4 result;
void main(){vec2 sampleUV=texUV;if(warped){vec2 edges=mix(warpEdges.xy,warpEdges.zw,clamp(localPoint.y/size.y,0.,1.));float span=edges.y-edges.x;if(abs(span)<.00001)discard;float u=(localPoint.x-edges.x)/span;if(u<0.||u>=1.)discard;sampleUV=vec2(u,localPoint.y/size.y);}vec4 color=texture(image,sampleUV);if(indexed){float i=floor(color.r*255.+.5);color=texture(palette,vec2((i+.5)/256.,.5));if(i<.5){if(maskZero)discard;color.a=1.;}}if(color.a<=0.)discard;
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
    this.textureBytes = 0;
    this.textures = new Map();
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
  upload(asset) {
    if (this.textures.has(asset.id)) return;
    const pixels = asset.pixels,
      expected = asset.width * asset.height * (asset.indexed ? 1 : 4);
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
    if (!(pixels instanceof Uint8Array) || pixels.length !== expected)
      throw Error("Invalid GPU asset dimensions.");
    if (this.textureBytes + pixels.length > this.limit)
      throw Error(
        "GPU texture budget exceeded. Close this match or use a smaller stage.",
      );
    const texture = new DataTexture(
      pixels,
      asset.width,
      asset.height,
      asset.indexed ? RedFormat : RGBAFormat,
      UnsignedByteType,
    );
    texture.minFilter = texture.magFilter = NearestFilter;
    texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
    texture.generateMipmaps = false;
    texture.flipY = false;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;
    this.textures.set(asset.id, texture);
    this.textureBytes += pixels.length;
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
  render(frame, { width = 960, height = 540 } = {}) {
    if (this.closed) return;
    if (this.lost)
      throw Error(
        "Graphics context was lost. Start the match again from your library.",
      );
    if (this.canvas.width !== width || this.canvas.height !== height)
      this.renderer.setSize(width, height, false);
    for (const asset of frame.assets || []) this.upload(asset);
    this.grid.visible = !!frame.grid;
    this.grid.material.uniforms.ground.value = frame.ground || 450;
    const draws = frame.draws.concat(
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
      const image = this.textures.get(q.texture);
      if (!image) throw Error("GPU texture was not delivered: " + q.texture);
      u.image.value = image;
      u.palette.value =
        this.textures.get(q.palette) || this.textures.get("@white");
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
    this.renderer.render(this.scene, this.camera);
    this.renderer.setScissorTest(false);
    this.frames++;
    this.stats = {
      backend: "Kenjatime Core · Three.js",
      frames: this.frames,
      draws: draws.length,
      textureBytes: this.textureBytes,
      textures: this.textures.size,
      width,
      height,
    };
    return this.stats;
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    this.canvas.removeEventListener("webglcontextlost", this.contextLost);
    for (const texture of this.textures.values()) texture.dispose();
    for (const mesh of this.slots) mesh.material.dispose();
    this.grid.material.dispose();
    this.geometry.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.textures.clear();
  }
}
