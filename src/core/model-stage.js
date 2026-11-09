/** Original glTF stage adapter using Three's public loader and scene APIs. */
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import {
  LoadingManager,
  Scene,
  Group,
  PerspectiveCamera,
  HemisphereLight,
  AnimationMixer,
  LoopOnce,
  LoopRepeat,
  PCFShadowMap,
  SRGBColorSpace,
  EquirectangularReflectionMapping,
  DataTexture,
  RGBAFormat,
  HalfFloatType,
  AdditiveBlending,
  SubtractiveBlending,
  MultiplyBlending,
  NormalBlending,
} from "three";
import { packagePath, decodeText } from "../formats.js";
const MiB = 1024 * 1024;
const components = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16,
};
const sizes = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

export function modelDocument(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length > 64 * MiB)
    throw Error("Model source limit (64 MiB) exceeded.");
  let document;
  if (
    bytes.length >= 12 &&
    new DataView(bytes.buffer, bytes.byteOffset).getUint32(0, true) ===
      0x46546c67
  ) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (
      view.getUint32(4, true) !== 2 ||
      view.getUint32(8, true) !== bytes.length
    )
      throw Error("Invalid GLB header.");
    let at = 12;
    while (at + 8 <= bytes.length) {
      const size = view.getUint32(at, true),
        type = view.getUint32(at + 4, true);
      at += 8;
      if (size > bytes.length - at) throw Error("Truncated GLB chunk.");
      if (type === 0x4e4f534a) {
        if (document) throw Error("Duplicate GLB JSON chunk.");
        document = JSON.parse(
          new TextDecoder().decode(bytes.subarray(at, at + size)).trim(),
        );
      }
      at += size;
    }
    if (at !== bytes.length || !document)
      throw Error("Missing GLB JSON document.");
  } else document = JSON.parse(decodeText(bytes));
  if (document.asset?.version !== "2.0")
    throw Error("Only glTF 2.0 models are supported.");
  for (const [key, limit] of Object.entries({
    nodes: 4096,
    meshes: 1024,
    textures: 64,
    materials: 1024,
    accessors: 16384,
    bufferViews: 16384,
    buffers: 128,
    animations: 256,
    images: 64,
    scenes: 64,
    skins: 256,
  })) {
    if (
      document[key] !== undefined &&
      (!Array.isArray(document[key]) || document[key].length > limit)
    )
      throw Error(`Model ${key} limit (${limit}) exceeded.`);
  }
  if (
    (document.nodes?.length || 0) > 4096 ||
    (document.meshes?.length || 0) > 1024 ||
    (document.textures?.length || 0) > 64
  )
    throw Error("Model node, mesh or texture budget exceeded.");
  const nodes = document.nodes || [],
    visiting = new Set(),
    visited = new Set();
  function visit(index) {
    if (!Number.isInteger(index) || !nodes[index])
      throw Error("Invalid model node reference.");
    if (visiting.has(index)) throw Error("Cyclic model node hierarchy.");
    if (visited.has(index)) return;
    visiting.add(index);
    const node = nodes[index];
    for (const key of ["matrix", "translation", "rotation", "scale"])
      if (
        node[key] &&
        (!Array.isArray(node[key]) ||
          !node[key].every(Number.isFinite) ||
          node[key].length !==
            { matrix: 16, translation: 3, rotation: 4, scale: 3 }[key])
      )
        throw Error("Invalid model transform.");
    for (const child of node.children || []) visit(child);
    visiting.delete(index);
    visited.add(index);
  }
  for (let i = 0; i < nodes.length; i++) visit(i);
  let vertexBytes = 0,
    bufferBytes = 0;
  for (const a of document.accessors || []) {
    const n = components[a.type] * sizes[a.componentType] * a.count;
    if (
      !Number.isSafeInteger(a.count) ||
      a.count < 0 ||
      a.count > 1000000 ||
      !Number.isFinite(n)
    )
      throw Error("Invalid or excessive model accessor.");
    vertexBytes += n;
  }
  for (const b of document.buffers || []) {
    if (!Number.isSafeInteger(b.byteLength) || b.byteLength < 0)
      throw Error("Invalid model buffer size.");
    bufferBytes += b.byteLength;
  }
  if (vertexBytes > 64 * MiB || bufferBytes > 64 * MiB)
    throw Error("Model geometry budget (64 MiB) exceeded.");
  const required = new Set(document.extensionsRequired || []);
  for (const ext of [
    "KHR_draco_mesh_compression",
    "EXT_meshopt_compression",
    "KHR_texture_basisu",
    "KHR_animation_pointer",
  ])
    if (required.has(ext))
      throw Error(
        `Model extension ${ext} requires an additional decoder or animation adapter.`,
      );
  for (const resource of [
    ...(document.images || []),
    ...(document.buffers || []),
  ])
    if (resource.uri) {
      const uri = String(resource.uri);
      if (
        /^[a-z][a-z0-9+.-]*:/i.test(uri) &&
        !/^data:(?:image\/(?:png|jpeg|webp)|application\/(?:octet-stream|gltf-buffer));base64,/i.test(
          uri,
        )
      )
        throw Error(
          "Model resources must be embedded or present in the imported archive.",
        );
    }
  return document;
}

export class ModelStage {
  static async load(
    definition,
    files,
    renderer,
    { textureBudget = 32 * MiB } = {},
  ) {
    const spec = definition.model;
    if (!spec?.path) return null;
    const bytes = files[spec.path],
      json = modelDocument(bytes),
      base = spec.path.slice(0, spec.path.lastIndexOf("/") + 1),
      urls = new Map();
    const manager = new LoadingManager();
    manager.setURLModifier((url) => {
      if (url.startsWith("blob:") || url.startsWith("data:")) return url;
      const path = packagePath(
        decodeURIComponent(url.split(/[?#]/)[0]),
        base,
        true,
      );
      if (!files[path]) throw Error(`Model resource is missing: ${path}`);
      if (!urls.has(path))
        urls.set(path, URL.createObjectURL(new Blob([files[path]])));
      return urls.get(path);
    });
    let gltf;
    try {
      gltf = await new GLTFLoader(manager).parseAsync(
        bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength,
        ),
        "",
      );
    } finally {
      for (const url of urls.values()) URL.revokeObjectURL(url);
    }
    const scene = gltf.scenes[spec.scene];
    if (!scene) {
      disposeScene(gltf);
      throw Error(`Model scene ${spec.scene} does not exist.`);
    }
    const result = new ModelStage(definition, gltf, scene, renderer, json);
    try {
      await result.initialize(files, textureBudget);
      return result;
    } catch (error) {
      result.close();
      throw error;
    }
  }
  constructor(definition, gltf, scene, renderer, json) {
    this.definition = definition;
    this.gltf = gltf;
    this.scene = scene;
    this.renderer = renderer;
    this.json = json;
    this.closed = false;
    this.lastTime = -1;
    this.shadowUpdates = 0;
    this.layers = new Set();
    this.actions = [];
    this.textureBytes = 0;
  }
  async initialize(files, budget) {
    const spec = this.definition.model;
    this.scene.updateMatrixWorld(true);
    const embedded = this.gltf.cameras.find((c) => c.isPerspectiveCamera);
    this.camera = embedded
      ? embedded.clone()
      : new PerspectiveCamera(60, 16 / 9, 0.1, 1000);
    if (embedded)
      embedded.matrixWorld.decompose(
        this.camera.position,
        this.camera.quaternion,
        this.camera.scale,
      );
    else this.camera.position.set(0, 0, 240 / (2 * Math.tan(Math.PI / 6)));
    if (spec.camera.fov > 0) this.camera.fov = spec.camera.fov;
    if (spec.camera.near > 0) this.camera.near = spec.camera.near;
    if (spec.camera.far > 0) this.camera.far = spec.camera.far;
    if (this.camera.near <= 0 || this.camera.far <= this.camera.near)
      throw Error("Invalid model camera clipping range.");
    this.camera.position.y += spec.camera.yShift;
    this.origin = this.camera.position.clone();
    const root = new Group();
    root.position.fromArray(spec.offset);
    root.rotation.set(...spec.rotation.map((n) => (n * Math.PI) / 180));
    root.scale.fromArray(spec.scale);
    root.add(this.scene);
    this.root = root;
    // A separate scene keeps sprite state and model lighting independent.
    this.world = new Scene();
    this.world.add(root);
    let lights = 0,
      shadowLights = 0;
    const textures = new Set();
    this.scene.traverse((object) => {
      const chain = [];
      for (
        let ancestor = object;
        ancestor && ancestor !== this.root;
        ancestor = ancestor.parent
      )
        chain.unshift(ancestor.userData || {});
      const extras = Object.assign({}, ...chain);
      if (object.isMesh || object.isLine || object.isPoints) {
        const layer = clamp(
          Number.isFinite(+extras.layerNumber)
            ? Math.trunc(+extras.layerNumber)
            : 0,
          -1,
          1,
        );
        object.layers.set(layer + 1);
        this.layers.add(layer);
        object.castShadow =
          extras.castShadow !== 0 && extras.castShadow !== false;
        object.receiveShadow = true;
        for (const material of Array.isArray(object.material)
          ? object.material
          : [object.material])
          if (material) {
            if (extras.disableZTest) material.depthTest = false;
            if (extras.disableZWrite) material.depthWrite = false;
            material.blending =
              {
                ADD: AdditiveBlending,
                SUB: SubtractiveBlending,
                MUL: MultiplyBlending,
                NONE: NormalBlending,
              }[String(extras.trans || "NONE").toUpperCase()] ?? NormalBlending;
            if (material.blending !== NormalBlending) {
              material.transparent = true;
              material.depthWrite = false;
            }
            for (const value of Object.values(material))
              if (value?.isTexture) textures.add(value);
          }
      }
      if (object.isLight) {
        lights++;
        object.layers.enableAll();
        if (
          object.shadow &&
          extras.castShadow !== 0 &&
          extras.castShadow !== false &&
          shadowLights++ < 4
        ) {
          object.castShadow = true;
          object.shadow.mapSize.set(512, 512);
          object.shadow.normalBias = Math.max(0, +extras.shadowMapBias || 0.02);
          object.shadow.bias = -0.0001;
          const c = object.shadow.camera;
          for (const [name, key] of [
            ["near", "Near"],
            ["far", "Far"],
            ["left", "Left"],
            ["right", "Right"],
            ["bottom", "Bottom"],
            ["top", "Top"],
          ])
            if (Number.isFinite(+extras["shadowMap" + key]))
              c[name] = +extras["shadowMap" + key];
          c.layers.enableAll();
          c.updateProjectionMatrix();
        }
      }
    });
    if (!lights) this.world.add(new HemisphereLight(0xffffff, 0x555555, 1));
    for (const texture of textures) {
      const image = texture.image;
      if (image?.width && image?.height) {
        if (image.width > 4096 || image.height > 4096)
          throw Error("Model texture dimension limit (4096) exceeded.");
        this.textureBytes +=
          image.width *
          image.height *
          4 *
          (texture.generateMipmaps ? 4 / 3 : 1);
      }
    }
    if (spec.environment) {
      const data = new RGBELoader().parse(
        files[spec.environment].buffer.slice(
          files[spec.environment].byteOffset,
          files[spec.environment].byteOffset +
            files[spec.environment].byteLength,
        ),
      );
      if (data.width > 4096 || data.height > 4096)
        throw Error("Model environment dimension limit exceeded.");
      this.environment = new DataTexture(
        data.data,
        data.width,
        data.height,
        RGBAFormat,
        HalfFloatType,
      );
      this.environment.mapping = EquirectangularReflectionMapping;
      this.environment.needsUpdate = true;
      this.world.environment = this.environment;
      this.world.environmentIntensity = spec.environmentIntensity;
      this.textureBytes += data.data.byteLength;
    }
    if (this.textureBytes > budget)
      throw Error("Model texture budget exceeded.");
    this.mixer = new AnimationMixer(this.scene);
    this.gltf.animations.forEach((clip, index) => {
      const extras = this.json.animations?.[index]?.extras || {};
      if (
        extras.enabled === "0" ||
        extras.enabled === "false" ||
        extras.enabled === false ||
        extras.enabled === 0
      )
        return;
      const action = this.mixer.clipAction(clip),
        loops = Number.isFinite(+extras.loopCount)
          ? Math.trunc(+extras.loopCount)
          : -1;
      action.setLoop(
        loops === 0 ? LoopOnce : LoopRepeat,
        loops < 0 ? Infinity : Math.max(1, loops),
      );
      action.clampWhenFinished = loops >= 0;
      action.play();
      this.actions.push(action);
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.shadowDirty = true;
  }
  update(frame) {
    const time = Number.isFinite(frame.time) ? Math.max(0, frame.time) : 0;
    if (time < this.lastTime)
      for (const action of this.actions) action.reset().play();
    if (time !== this.lastTime && this.actions.length) {
      this.mixer.setTime(time);
      this.shadowDirty = true;
    }
    this.lastTime = time;
    const camera = frame.camera || {},
      start = frame.start || {},
      factor = frame.coordinateScale || 1;
    this.camera.position.copy(this.origin);
    this.camera.position.x += ((camera.x || 0) - (start.startX || 0)) / factor;
    this.camera.position.y -= ((camera.y || 0) - (start.startY || 0)) / factor;
    this.camera.aspect =
      this.renderer.domElement.width / this.renderer.domElement.height;
    this.camera.zoom = camera.zoom || 1;
    this.camera.updateProjectionMatrix();
  }
  render(layer) {
    if (!this.layers.has(layer)) return;
    const renderer = this.renderer,
      space = renderer.outputColorSpace,
      sort = renderer.sortObjects;
    renderer.setScissorTest(false);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.sortObjects = true;
    this.camera.layers.set(layer + 1);
    if (this.shadowDirty) {
      renderer.shadowMap.needsUpdate = true;
      this.shadowUpdates++;
      this.shadowDirty = false;
    }
    try {
      renderer.render(this.world, this.camera);
    } finally {
      renderer.outputColorSpace = space;
      renderer.sortObjects = sort;
    }
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    this.mixer?.stopAllAction();
    this.mixer?.uncacheRoot(this.scene);
    disposeScene(this.gltf);
    this.environment?.dispose();
    for (const object of this.scene.children) this.scene.remove(object);
  }
}

function disposeScene(gltf) {
  const geometries = new Set(),
    materials = new Set(),
    textures = new Set(),
    images = new Set();
  for (const scene of gltf.scenes || [])
    scene.traverse((o) => {
      if (o.geometry) geometries.add(o.geometry);
      for (const m of Array.isArray(o.material)
        ? o.material
        : o.material
          ? [o.material]
          : [])
        materials.add(m);
      if (o.isLight) o.shadow?.dispose();
    });
  for (const material of materials)
    for (const value of Object.values(material))
      if (value?.isTexture) textures.add(value);
  for (const texture of textures) {
    if (texture.image?.close) images.add(texture.image);
    texture.dispose();
  }
  for (const image of images) image.close();
  for (const material of materials) material.dispose();
  for (const geometry of geometries) geometry.dispose();
}
