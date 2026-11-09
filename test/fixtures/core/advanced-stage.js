/** Original, deliberately small glTF fixture: a red box, floor, light and camera. */
import { BoxGeometry, PerspectiveCamera, DirectionalLight } from "three";
export function modelFixture(animated = false) {
  const buffers = [],
    views = [],
    accessors = [],
    meshes = [];
  let length = 0;
  const add = (array, type, componentType, min, max) => {
    const padding = (4 - (length % 4)) % 4;
    if (padding) {
      buffers.push(new Uint8Array(padding));
      length += padding;
    }
    const bytes = new Uint8Array(
      array.buffer,
      array.byteOffset,
      array.byteLength,
    );
    buffers.push(bytes);
    views.push({ buffer: 0, byteOffset: length, byteLength: bytes.length });
    length += bytes.length;
    accessors.push({
      bufferView: views.length - 1,
      componentType,
      count: array.length / { SCALAR: 1, VEC3: 3 }[type],
      type,
      ...(min ? { min, max } : {}),
    });
    return accessors.length - 1;
  };
  for (const [dimensions, material] of [
    [[1.4, 1.4, 1.4], 0],
    [[8, 0.1, 8], 1],
  ]) {
    const g = new BoxGeometry(...dimensions);
    g.computeBoundingBox();
    const position = add(
        g.attributes.position.array,
        "VEC3",
        5126,
        g.boundingBox.min.toArray(),
        g.boundingBox.max.toArray(),
      ),
      normal = add(g.attributes.normal.array, "VEC3", 5126),
      indices = add(g.index.array, "SCALAR", 5123);
    meshes.push({
      primitives: [
        {
          attributes: { POSITION: position, NORMAL: normal },
          indices,
          material,
        },
      ],
    });
    g.dispose();
  }
  const animations = animated
    ? [
        {
          samplers: [
            {
              input: add(new Float32Array([0, 1, 2]), "SCALAR", 5126, [0], [2]),
              output: add(
                new Float32Array([0, 0.75, 0, 1, 0.75, 0, 0, 0.75, 0]),
                "VEC3",
                5126,
              ),
              interpolation: "LINEAR",
            },
          ],
          channels: [{ sampler: 0, target: { node: 0, path: "translation" } }],
        },
      ]
    : [];
  const bytes = new Uint8Array(length);
  let at = 0;
  for (const b of buffers) {
    bytes.set(b, at);
    at += b.length;
  }
  const camera = new PerspectiveCamera(50, 16 / 9, 0.1, 100);
  camera.position.set(4, 4, 6);
  camera.lookAt(0, 0.4, 0);
  camera.updateMatrix();
  const light = new DirectionalLight();
  light.position.set(-3, 5, -3);
  light.lookAt(0, 0, 0);
  light.updateMatrix();
  return {
    asset: { version: "2.0", generator: "Kenjatime original QA" },
    extensionsUsed: ["KHR_lights_punctual"],
    extensions: {
      KHR_lights_punctual: {
        lights: [{ type: "directional", color: [1, 1, 1], intensity: 3 }],
      },
    },
    scene: 0,
    scenes: [{ nodes: [0, 1, 2, 3] }],
    nodes: [
      { mesh: 0, translation: [0, 0.75, 0] },
      { mesh: 1, extras: { castShadow: 0 } },
      { camera: 0, matrix: camera.matrix.toArray() },
      {
        matrix: light.matrix.toArray(),
        extensions: { KHR_lights_punctual: { light: 0 } },
        extras: {
          shadowMapLeft: -5,
          shadowMapRight: 5,
          shadowMapTop: 5,
          shadowMapBottom: -5,
        },
      },
    ],
    cameras: [
      {
        type: "perspective",
        perspective: { yfov: (50 * Math.PI) / 180, znear: 0.1, zfar: 100 },
      },
    ],
    meshes,
    materials: [
      {
        pbrMetallicRoughness: {
          baseColorFactor: [0.8, 0.05, 0.025, 1],
          metallicFactor: 0,
          roughnessFactor: 1,
        },
      },
      {
        pbrMetallicRoughness: {
          baseColorFactor: [0.7, 0.7, 0.7, 1],
          metallicFactor: 0,
          roughnessFactor: 1,
        },
      },
    ],
    accessors,
    animations,
    bufferViews: views,
    buffers: [
      {
        byteLength: length,
        uri:
          "data:application/octet-stream;base64," +
          btoa(String.fromCharCode(...bytes)),
      },
    ],
  };
}
