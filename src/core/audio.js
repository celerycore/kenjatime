import { createEngineAudio } from "../engine-audio.js";

const MiB = 1024 * 1024;
const bounded = (value, min, max, fallback) =>
  Number.isFinite(Number(value))
    ? Math.max(min, Math.min(max, Number(value)))
    : fallback;

/** Bounded decoded voice cache and two parallel decoders, sharing one context.
 * A cache miss asks the simulation for the original sound data again. Active
 * buffers stay accounted for until the last source releases them.
 */
export class CoreAudio {
  constructor(
    notify,
    {
      output,
      requestSound,
      cacheLimit = 32 * MiB,
      maxSoundBytes = 16 * MiB,
      maxVoices = 128,
      maxPending = 32,
    } = {},
  ) {
    this.output = output || createEngineAudio(notify);
    this.requestSound = requestSound;
    this.cacheLimit = cacheLimit;
    this.maxSoundBytes = maxSoundBytes;
    this.maxVoices = maxVoices;
    this.maxPending = maxPending;
    this.buffers = new Map();
    this.loading = new Map();
    this.waitingData = new Map();
    this.voices = new Map();
    this.requests = new Map();
    this.decodeQueue = [];
    this.decoding = 0;
    this.queuedBytes = 0;
    this.cacheBytes = 0;
    this.free = 0;
    this.closed = false;
    this.lastError = null;
  }

  prepare() {
    const rate = this.output.prepare();
    this.output.gesture();
    return rate || 48000;
  }

  status() {
    return {
      ...this.output.status(),
      voices: this.voices.size,
      cacheBytes: this.cacheBytes,
      cachedSounds: this.buffers.size,
      decoding: this.decoding,
      pendingSounds: this.loading.size,
      queuedBytes: this.queuedBytes,
      lastError: this.lastError,
    };
  }

  pause(on) {
    this.output.pause(on);
    if (this.music) {
      if (on) this.music.pause();
      else this.music.play().catch(() => {});
    }
  }

  mute(enabled) {
    this.output.audio(enabled);
  }

  stop(channel) {
    this.requests.delete(channel);
    const voice = this.voices.get(channel);
    if (!voice) return;
    this.voices.delete(channel);
    voice.source.onended = null;
    try {
      voice.source.stop();
    } catch {
      /* Already ended. */
    }
    voice.source.disconnect();
    voice.gain.disconnect();
    voice.pan?.disconnect();
  }

  provideSound({ key, bytes, error }) {
    const waiting = this.waitingData.get(key);
    if (!waiting) return;
    this.waitingData.delete(key);
    clearTimeout(waiting.timer);
    if (error) waiting.reject(Error(error));
    else waiting.resolve(bytes);
  }

  soundData(event) {
    if (event.bytes) return Promise.resolve(event.bytes);
    if (!this.requestSound)
      return Promise.reject(Error("Sound data is unavailable."));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.waitingData.delete(event.soundKey);
        reject(Error("Sound data request timed out."));
      }, 10000);
      timer.unref?.();
      this.waitingData.set(event.soundKey, { resolve, reject, timer });
      this.requestSound(event.soundKey);
    });
  }

  decode(bytes, context) {
    if (
      !(bytes instanceof Uint8Array) ||
      !bytes.length ||
      bytes.byteLength > this.maxSoundBytes
    )
      return Promise.reject(Error("Encoded sound exceeds the voice limit."));
    if (this.queuedBytes + bytes.byteLength > this.maxSoundBytes)
      return Promise.reject(Error("Sound decode queue is full."));
    return new Promise((resolve, reject) => {
      this.decodeQueue.push({ bytes, context, resolve, reject });
      this.queuedBytes += bytes.byteLength;
      this.pump();
    });
  }

  pump() {
    while (!this.closed && this.decoding < 2 && this.decodeQueue.length) {
      const job = this.decodeQueue.shift();
      this.queuedBytes -= job.bytes.byteLength;
      this.decoding++;
      Promise.resolve()
        .then(() => {
          if (this.closed) throw Error("Audio is closed.");
          return job.context.decodeAudioData(
            job.bytes.buffer.slice(
              job.bytes.byteOffset,
              job.bytes.byteOffset + job.bytes.byteLength,
            ),
          );
        })
        .then(job.resolve, job.reject)
        .finally(() => {
          this.decoding--;
          this.pump();
        });
    }
  }

  reserve(key, buffer) {
    const bytes = buffer.length * buffer.numberOfChannels * 4;
    if (
      !Number.isSafeInteger(bytes) ||
      bytes <= 0 ||
      bytes > this.maxSoundBytes ||
      bytes > this.cacheLimit
    )
      throw Error("Decoded sound exceeds the voice cache limit.");
    const active = new Set([...this.voices.values()].map((v) => v.key));
    for (const [old, row] of this.buffers) {
      if (this.cacheBytes + bytes <= this.cacheLimit) break;
      if (active.has(old)) continue;
      this.cacheBytes -= row.bytes;
      this.buffers.delete(old);
    }
    if (this.cacheBytes + bytes > this.cacheLimit)
      throw Error("Active sounds fill the voice cache.");
    this.buffers.set(key, { buffer, bytes });
    this.cacheBytes += bytes;
    return buffer;
  }

  load(event, context) {
    const key = event.soundKey,
      cached = this.buffers.get(key);
    if (cached) {
      this.buffers.delete(key);
      this.buffers.set(key, cached);
      return Promise.resolve(cached.buffer);
    }
    if (this.loading.has(key)) return this.loading.get(key);
    if (this.loading.size >= this.maxPending)
      return Promise.reject(Error("Too many pending sounds."));
    const promise = this.soundData(event)
      .then((bytes) => {
        if (this.closed) throw Error("Audio is closed.");
        return this.decode(bytes, context);
      })
      .then((buffer) => {
        if (this.closed) throw Error("Audio is closed.");
        return this.reserve(key, buffer);
      })
      .finally(() => this.loading.delete(key));
    this.loading.set(key, promise);
    return promise;
  }

  async event(event) {
    const prefix = event.entity + ":",
      channel = prefix + (event.channel ?? -1);
    if (event.type === "stopsnd") {
      for (const key of new Set([
        ...this.voices.keys(),
        ...this.requests.keys(),
      ]))
        if (event.channel === -1 ? key.startsWith(prefix) : key === channel)
          this.stop(key);
      return;
    }
    if (event.type === "sndpan") {
      const voice = this.voices.get(channel);
      if (voice?.pan)
        voice.pan.pan.value = bounded(
          (event.abspan ?? event.pan ?? 0) / 240,
          -1,
          1,
          0,
        );
      return;
    }
    if (
      event.type !== "playsnd" ||
      this.closed ||
      !this.output.status().enabled
    )
      return;
    const context = this.output.context();
    if (!context) return;
    const active =
      (event.channel ?? -1) < 0 ? prefix + "free" + this.free++ : channel;
    if (
      !this.voices.has(active) &&
      !this.requests.has(active) &&
      this.voices.size + this.requests.size >= this.maxVoices
    )
      return;
    if (
      event.lowpriority &&
      (this.voices.has(active) || this.requests.has(active))
    )
      return;
    this.stop(active);
    const request = {};
    let createdSource;
    this.requests.set(active, request);
    try {
      const buffer = await this.load(event, context);
      if (
        this.closed ||
        this.requests.get(active) !== request ||
        !this.buffers.has(event.soundKey)
      )
        return;
      const source = context.createBufferSource(),
        gain = context.createGain();
      createdSource = source;
      const pan = context.createStereoPanner?.();
      source.buffer = buffer;
      source.loop = !!event.loop;
      source.playbackRate.value = bounded(
        event.freqMul ?? event.freqmul ?? 1,
        0.01,
        16,
        1,
      );
      gain.gain.value = bounded(
        event.volumeScale !== undefined
          ? event.volumeScale / 100
          : 1 + (event.volume || 0) / 256,
        0,
        4,
        1,
      );
      source.connect(gain);
      if (pan) {
        pan.pan.value = bounded(
          (event.abspan ?? event.pan ?? 0) / 240,
          -1,
          1,
          0,
        );
        gain.connect(pan);
        pan.connect(context.destination);
      } else gain.connect(context.destination);
      this.requests.delete(active);
      this.voices.set(active, { source, gain, pan, key: event.soundKey });
      source.onended = () => {
        if (this.voices.get(active)?.source === source)
          this.voices.delete(active);
        source.disconnect();
        gain.disconnect();
        pan?.disconnect();
      };
      source.start();
    } catch (error) {
      if (createdSource && this.voices.get(active)?.source === createdSource)
        this.stop(active);
      if (!this.closed) this.lastError = error.message;
    } finally {
      if (this.requests.get(active) === request) this.requests.delete(active);
    }
  }

  musicFile({ bytes, volume = 100, loop = true }) {
    if (this.closed) return;
    this.music?.pause();
    this.musicNode?.disconnect();
    if (this.url) URL.revokeObjectURL(this.url);
    this.url = URL.createObjectURL(new Blob([bytes]));
    this.music = new Audio(this.url);
    this.music.loop = loop;
    this.musicNode = this.output.media(this.music);
    this.musicNode?.volume(bounded(volume / 100, 0, 1, 1));
    if (!this.output.status().paused) this.music.play().catch(() => {});
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    for (const channel of new Set([
      ...this.voices.keys(),
      ...this.requests.keys(),
    ]))
      this.stop(channel);
    for (const waiting of this.waitingData.values()) {
      clearTimeout(waiting.timer);
      waiting.reject(Error("Audio is closed."));
    }
    this.waitingData.clear();
    for (const job of this.decodeQueue) job.reject(Error("Audio is closed."));
    this.decodeQueue = [];
    this.queuedBytes = 0;
    this.music?.pause();
    this.musicNode?.disconnect();
    if (this.url) URL.revokeObjectURL(this.url);
    this.output.close();
    this.buffers.clear();
    this.cacheBytes = 0;
  }
}
