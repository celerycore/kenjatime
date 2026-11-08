import { test } from "node:test";
import assert from "node:assert/strict";
import { CoreAudio } from "../../src/core/audio.js";

function fixture(options = {}) {
  const sources = [],
    decodes = [];
  const node = () => ({
    connect() {},
    disconnect() {
      this.disconnected = true;
    },
  });
  const context = {
    destination: {},
    decodeAudioData: async (bytes) => {
      decodes.push(bytes);
      return { length: 4, numberOfChannels: 1 };
    },
    createBufferSource() {
      const source = {
        ...node(),
        playbackRate: { value: 1 },
        start() {
          this.started = true;
        },
        stop() {
          this.stopped = true;
        },
      };
      sources.push(source);
      return source;
    },
    createGain: () => ({ ...node(), gain: { value: 1 } }),
    createStereoPanner: () => ({ ...node(), pan: { value: 0 } }),
  };
  const output = {
    prepare: () => 48000,
    gesture() {},
    pause() {},
    audio() {},
    context: () => context,
    status: () => ({ enabled: true }),
    close() {
      this.closed = true;
    },
  };
  const audio = new CoreAudio(() => {}, { output, ...options });
  return { audio, output, context, sources, decodes };
}
const sound = (key, channel = -1, bytes = true) => ({
  type: "playsnd",
  entity: 1,
  soundKey: key,
  channel,
  ...(bytes ? { bytes: new Uint8Array([1, 2, 3, 4]) } : {}),
});
const turn = () => new Promise((resolve) => setImmediate(resolve));

test("simultaneous voices share one decode; StopSnd cancels pending and active channels", async () => {
  const { audio, decodes, sources } = fixture();
  await Promise.all([
    audio.event(sound("one", 1)),
    audio.event(sound("one", 2)),
  ]);
  assert.equal(decodes.length, 1);
  assert.equal(sources.length, 2);
  assert.equal(audio.status().cacheBytes, 16);
  await audio.event({ type: "stopsnd", entity: 1, channel: -1 });
  assert.equal(audio.voices.size, 0);
  assert.ok(sources.every((s) => s.stopped && s.disconnected));
  audio.close();
  assert.equal(audio.status().cacheBytes, 0);
});

test("evicted sounds can be fetched again; active buffers remain within the memory budget", async () => {
  const f = fixture({ cacheLimit: 32 });
  const requested = [];
  f.audio.requestSound = (key) => {
    requested.push(key);
    f.audio.provideSound({ key, bytes: new Uint8Array([1]) });
  };
  await f.audio.event(sound("one", 1));
  await f.audio.event(sound("two", 2));
  await f.audio.event(sound("three", 3));
  assert.match(f.audio.lastError, /Active sounds/);
  assert.equal(f.audio.cacheBytes, 32);
  f.audio.stop("1:1");
  await f.audio.event(sound("three", 3));
  assert.ok(!f.audio.buffers.has("one"));
  assert.equal(f.audio.cacheBytes, 32);
  f.audio.stop("1:2");
  await f.audio.event(sound("one", 1, false));
  assert.deepEqual(requested, ["one"]);
  assert.equal(f.audio.voices.size, 2);
  assert.equal(f.decodes.length, 5);
  f.audio.close();
});

test("decode bursts are limited to two jobs and closing prevents late playback", async () => {
  const { audio, context, sources } = fixture();
  const releases = [];
  context.decodeAudioData = () =>
    new Promise((resolve) => releases.push(resolve));
  const pending = [1, 2, 3].map((i) => audio.event(sound(String(i), i)));
  await turn();
  assert.equal(releases.length, 2);
  assert.equal(audio.status().decoding, 2);
  await audio.event({ type: "stopsnd", entity: 1, channel: 1 });
  releases.shift()({ length: 4, numberOfChannels: 1 });
  await turn();
  assert.equal(releases.length, 2);
  assert.equal(sources.length, 0);
  audio.close();
  for (const resolve of releases) resolve({ length: 4, numberOfChannels: 1 });
  await Promise.all(pending);
  assert.equal(sources.length, 0);
  assert.equal(audio.cacheBytes, 0);
});

test("a low priority cue cannot replace an existing pending channel", async () => {
  const { audio, sources } = fixture();
  let requested;
  audio.requestSound = (key) => {
    requested = key;
  };
  const first = audio.event(sound("remote", 7, false));
  await audio.event({ ...sound("other", 7), lowpriority: true });
  assert.equal(requested, "remote");
  assert.equal(audio.loading.size, 1);
  audio.provideSound({ key: "remote", bytes: new Uint8Array([1]) });
  await first;
  assert.equal(sources.length, 1);
  audio.close();
});

test("replacing stage music disconnects the old graph and releases its URL", (t) => {
  const saved = globalThis.Audio,
    elements = [],
    graphs = [];
  globalThis.Audio = class {
    constructor(url) {
      this.src = url;
      elements.push(this);
    }
    pause() {
      this.paused = true;
    }
    play() {
      return Promise.resolve();
    }
  };
  t.after(() => {
    if (saved) globalThis.Audio = saved;
    else delete globalThis.Audio;
  });
  const { audio, output } = fixture();
  output.media = () => {
    const graph = {
      volume() {},
      disconnect() {
        this.disconnected = true;
      },
    };
    graphs.push(graph);
    return graph;
  };
  audio.musicFile({ bytes: new Uint8Array([1]) });
  audio.musicFile({ bytes: new Uint8Array([2]) });
  assert.equal(elements[0].paused, true);
  assert.equal(graphs[0].disconnected, true);
  assert.notEqual(elements[0].src, elements[1].src);
  audio.close();
  assert.equal(graphs[1].disconnected, true);
  assert.equal(elements[1].paused, true);
});

test("a full voice budget permits replacing the same channel and cleans a failed source", async () => {
  const { audio, sources, context } = fixture({ maxVoices: 1 });
  await audio.event(sound("one", 1));
  await audio.event(sound("two", 1));
  assert.equal(sources.length, 2);
  assert.equal(sources[0].stopped, true);
  await audio.event(sound("three", 2));
  assert.equal(sources.length, 2);
  const create = context.createBufferSource;
  context.createBufferSource = () => {
    const s = create();
    s.start = () => {
      throw Error("Device source failed");
    };
    return s;
  };
  await audio.event(sound("three", 1));
  assert.equal(audio.voices.size, 0);
  assert.equal(audio.requests.size, 0);
  assert.ok(sources[2].stopped && sources[2].disconnected);
  audio.close();
});
