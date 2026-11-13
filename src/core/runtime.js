import { CoreSession } from "./session.js";
import {normalizePresentation} from "./presentation.js";
import { CoreThreeRenderer } from "./three-renderer.js";
import { FrameClock, SIMULATION_HZ } from "../frame-clock.js";
import { TickInputBuffer } from "../input-buffer.js";
import { soundArchive } from "../formats.js";
import { FrameScheduler } from "./frame-scheduler.js";
import { AdaptiveResolution } from "./adaptive-resolution.js";
import { framePacing, nextTickEstimate } from "./frame-pacing.js";
/** Worker-owned simulation/renderer. The UI owns only input, audio sinks and HUD. */
export function createCoreRuntime(emit) {
  let session,
    renderer,
    closed = false,
    started = false,
    paused = false,
    dirty = true,
    hidden = false,
    focused = true,
    lastState = -Infinity,
    scale = 1,
    quality = "auto",
    audioPort,
    moduleDecoder,
    moduleStream,
    moduleVolume = 1,
    musicLoop = true,
    musicSuppressed = false,
    // Per-callback measurements stay out of the simulation state/hash.
    simulationCpuMs = 0,
    simulationTickCpuMs = 0,
    simulationBatchTicks = 0,
    estimatedTickMs = 2,
    renderWithBacklogCount = 0,
    lastRenderTargetFps = 60,
    lastBatchLimit = 4;
  const clock = new FrameClock(),
    inputs = [new TickInputBuffer(), new TickInputBuffer()],
    sounds = new Map(),
    sentSounds = new Set(),
    soundKeys = new Map(),
    adaptiveResolution = new AdaptiveResolution();
  const videoStates = new Map(),
    failedVideos = new Set();
  function syncVideos() {
    const stage = session?.match.stage;
    if (!stage) return;
    const world = session.match,
      bgPaused = !!(
        world.superPause?.remaining > 0 ||
        (world.pause?.remaining > 0 && world.pause.pausebg !== 0)
      );
    for (const e of stage.elements)
      if (e.video) {
        const value = {
          type: "video-control",
          id: e.video.key,
          playing:
            !paused && !bgPaused && e.enabled && !failedVideos.has(e.video.key),
          visible: e.visible,
          captureVisible: !hidden,
          epoch: stage.generation || 0,
        };
        const signature = JSON.stringify(value),
          previous = videoStates.get(value.id);
        if (previous?.signature !== signature) {
          value.reset = previous && previous.epoch !== value.epoch;
          videoStates.set(value.id, { signature, epoch: value.epoch });
          emit(value);
        }
      }
  }
  const scheduler = new FrameScheduler(frame);
  const schedule = () =>
    scheduler.schedule({
      timer: hidden || !focused,
      catchUp: !paused && clock.debt >= 1,
      idle: paused,
    });
  function audio(buffer) {
    const data = new Float32Array(buffer);
    data.fill(0);
    if (moduleStream && !paused && !musicSuppressed) {
      let filled = 0;
      while (filled < data.length / 2) {
        let n = moduleStream.read(Math.min(2048, data.length / 2 - filled));
        if (!n) {
          if (!musicLoop) break;
          moduleStream.seek(0);
          n = moduleStream.read(Math.min(2048, data.length / 2 - filled));
          if (!n) break;
        }
        data.set(
          new Float32Array(
            moduleStream.pcm.buffer,
            moduleStream.pcm.byteOffset,
            n * 2,
          ),
          filled * 2,
        );
        filled += n;
      }
      if (moduleVolume !== 1)
        for (let i = 0; i < data.length; i++) data[i] *= moduleVolume;
    }
    audioPort?.postMessage({ buffer }, [buffer]);
  }
  function soundEvents() {
    for (const event of session.drainEvents()) {
      if (event.type === "playsnd")
        try {
          const character = session.characters.find(
              (c) => c.path === event.character,
            ),
            path = event.common ? session.commonEffects.soundPath : character?.checks.find(
              (c) => c.key === "sound" && c.ok,
            )?.path;
          if (!path) {
            if (event.common) session.issue('common-sound','Common sound requested, but the imported pack has no common.snd.');
            continue;
          }
          if (!sounds.has(path))
            sounds.set(path, soundArchive(session.files[path]));
          const group = event.group ?? event.value?.[0],
            number = event.number ?? event.value?.[1];
          event.soundKey = path + ":" + group + "," + number;
          soundKeys.set(event.soundKey, { path, group, number });
          if (!sentSounds.has(event.soundKey)) {
            const bytes = sounds.get(path).get(group, number);
            if (!bytes) continue;
            event.bytes = bytes.slice();
            sentSounds.add(event.soundKey);
          }
        } catch (error) {
          session.issue("sound", error.message);
          continue;
        }
      emit({ type: "sound", event }, event.bytes ? [event.bytes.buffer] : []);
    }
  }
  function syncMusicSuppression() {
    // AssertSpecial flags are recreated each simulation tick. Send an edge
    // rather than a constant stream of messages to the browser audio sink.
    const suppressed = session.match.entities.some(actor =>
      !actor.destroyed && actor.asserted.has('nomusic'));
    if (suppressed !== musicSuppressed) {
      musicSuppressed = suppressed;
      emit({ type: 'music-suppression', value: suppressed });
    }
  }
  function frame(time) {
    if (closed) return;
    try {
      // Keep the clock in its monotonic relative microsecond timebase.
      // The physical input queue uses epoch timestamps from the UI;
      // convert only the exact rational tick sample boundary.
      // R8: keep expensive imported character scripts in short bounded
      // simulation batches, leaving time for a visible frame between them.
      // No elapsed simulation tick is skipped: clock.debt is retained.
      const plan = framePacing(clock.debt, estimatedTickMs);
      clock.maxTicks = plan.batchLimit;
      lastBatchLimit = plan.batchLimit;
      const simulationStart = performance.now();
      simulationBatchTicks = clock.advance(time, { running: !paused }, (sample) => {
        const inputDeadline = performance.timeOrigin + sample;
        session.tick(
          inputs[0].sample(inputDeadline),
          inputs[1].sample(inputDeadline),
        );
        syncMusicSuppression();
        soundEvents();
      });
      simulationCpuMs = performance.now() - simulationStart;
      simulationTickCpuMs = simulationBatchTicks > 0
        ? simulationCpuMs / simulationBatchTicks : 0;
      if (simulationBatchTicks > 0)
        estimatedTickMs = nextTickEstimate(estimatedTickMs, simulationTickCpuMs);
      syncVideos();
      // Never gate all rendering behind clock.debt < 1. On heavy matches
      // that debt stays positive indefinitely and produces *zero frames*
      // while audio and combat continue. Draw at 30 FPS opportunistically
      // during catch-up, and return to the regular 60 FPS when caught up.
      const presentation = framePacing(clock.debt, estimatedTickMs);
      lastRenderTargetFps = presentation.renderFps;
      if (
        !hidden &&
        (!paused || dirty) &&
        clock.renderDue(time, presentation.renderFps)
      ) {
        if (presentation.backlog) renderWithBacklogCount++;
        const start = performance.now(),
          packet = session.frame();
        renderer.render(packet, {
          width: Math.round(960 * scale),
          height: Math.round(540 * scale),
          restoreAssets: ids => session.restoreAssets(ids),
        });
        const elapsed = performance.now() - start;
        // CPU-side packet build + GL submission time; NOT a GPU completion timer.
        if (renderer.stats) renderer.stats.frameCpuSubmitMs = elapsed;
        dirty = false;
        if (quality === "auto") {
          scale = adaptiveResolution.observe(time, elapsed, {
            // Resolution is not the bottleneck while scripts accumulate
            // tick debt. Avoid needless scaling down on CPU-heavy matches.
            eligible: !packet.assets.length && !paused && !hidden && focused &&
              !presentation.backlog,
          });
        }
      }
      if (time - lastState >= 100) {
        lastState = time;
        emit({
          type: "state",
          state: {
            ...session.snapshot(),
            paused,
            background: hidden,
            focused,
            simulationDebt: clock.debt,
            simulationHz: SIMULATION_HZ,
            simulationTicks: clock.tickCount,
            simulationBacklogTicks: Math.floor(clock.debt),
            simulationCpuMs,
            simulationTickCpuMs,
            simulationBatchTicks,
            simulationBatchLimit: lastBatchLimit,
            renderTargetFps: lastRenderTargetFps,
            renderWithBacklogCount,
            resolutionScale: scale,
          },
          gpu: renderer.stats,
        });
      }
      schedule();
    } catch (error) {
      emit({ type: "error", message: error.message });
      stop();
    }
  }
  async function start({
    files,
    selection,
    canvas,
    sampleRate = 48000,
    quality: value = "auto",
  }) {
    quality = value;
    if (!renderer) prepare(canvas);
    session = new CoreSession(files, selection);
    await session.initializeScripts();
    if (closed) return;
    try {
      session.modelReady = await renderer.loadStage(
        session.match.stage?.definition,
        files,
      );
    } catch (error) {
      if (!closed) session.issue("stage-model", error.message);
    }
    if (closed) return;
    let videoBytes = 0;
    const videoPaths = new Set();
    for (const e of session.match.stage?.elements || [])
      if (e.video?.path) {
        const bytes = videoPaths.has(e.video.path)
          ? null
          : files[e.video.path]?.slice();
        if (bytes) videoBytes += bytes.length;
        if (videoBytes > 64 * 1024 * 1024) {
          failedVideos.add(e.video.key);
          session.issue(
            "stage-video",
            "Stage video source budget (64 MiB) exceeded.",
          );
          continue;
        }
        videoPaths.add(e.video.path);
        emit(
          { type: "video-init", id: e.video.key, ...e.video, bytes },
          bytes ? [bytes.buffer] : [],
        );
      }
    const music = session.match.stage?.definition.music;
    if (music?.path && files[music.path]) {
      if (/\.(mod|xm|it|s3m)$/i.test(music.path)) {
        const { createModuleMusic } = await import("../module-music.js");
        if (closed) return;
        const decoder = await createModuleMusic();
        if (closed) {
          decoder.close();
          return;
        }
        moduleDecoder = decoder;
        moduleStream = moduleDecoder.open(files[music.path], sampleRate);
        moduleVolume = Math.max(0, Math.min(2, music.volume / 100));
        musicLoop = music.loop;
        emit({ type: "audio-init", sampleRate });
      } else {
        const bytes = files[music.path].slice();
        emit(
          {
            type: "music",
            bytes,
            path: music.path,
            volume: music.volume,
            loop: music.loop,
          },
          [bytes.buffer],
        );
      }
    }
    if (closed) return;
    started = true;
    emit({ type: "ready", capabilities: session.capabilities });
    schedule();
  }
  function control(data) {
    if (closed) {
      if (data.type === "video-frame") data.bitmap?.close();
      return;
    }
    if (data.type === "video-frame") {
      try {
        if (renderer.updateVideo(data))
          session.videoSprites.set(data.id, {
            id: data.id,
            w: data.sourceWidth,
            h: data.sourceHeight,
            x: 0,
            y: 0,
            indexed: false,
          });
        dirty = true;
      } catch (error) {
        failedVideos.add(data.id);
        session.issue("stage-video", error.message);
      }
      emit({ type: "video-ack", id: data.id });
      return;
    }
    if (data.type === "media-warning") {
      session?.issue("stage-video", String(data.message));
      return;
    }
    if (data.type === "visibility") {
      hidden = !!data.hidden;
      focused = data.focused !== false;
      if (!hidden) dirty = true;
      adaptiveResolution.suspend();
      if (started) syncVideos();
      if (started) schedule();
      return;
    }
    if (data.type === "release-inputs") {
      inputs.forEach((i) => i.reset());
      return;
    }
    if (data.type === "sound-request") {
      try {
        const spec = soundKeys.get(data.key),
          bytes =
            spec &&
            sounds.get(spec.path)?.get(spec.group, spec.number)?.slice();
        if (!bytes) throw Error("Sound is unavailable.");
        emit({ type: "sound-data", key: data.key, bytes }, [bytes.buffer]);
      } catch (error) {
        emit({ type: "sound-data", key: data.key, error: error.message });
      }
      return;
    }
    if (data.type === "input" && Array.isArray(data.keys))
      inputs[data.side === 1 ? 1 : 0].record(
        data.source || "keyboard",
        data.keys,
        data.time ?? performance.timeOrigin + performance.now(),
      );
    if (data.type === "pause") {
      paused = !!data.value;
      inputs.forEach((i) => i.reset());
      clock.suspend();
      adaptiveResolution.suspend();
      dirty = true;
      if (started) schedule();
    }
    if (data.type === "presentation") {
      if (session) session.setPresentation(normalizePresentation(data.value));
      dirty = true;
      if (started) schedule();
      return;
    }
    if (data.type === "quality") {
      quality = data.value;
      scale = 1;
      adaptiveResolution.reset();
      dirty = true;
    }
    if (data.type === "audio-port") {
      audioPort = data.port;
      audioPort.onmessage = ({ data }) => {
        if (
          !closed &&
          data.buffer instanceof ArrayBuffer &&
          data.buffer.byteLength === 8192
        )
          audio(data.buffer);
      };
      audioPort.start();
    }
    if (data.type === "stop") stop();
  }
  function stop() {
    if (closed) return;
    closed = true;
    scheduler.cancel();
    audioPort?.close();
    moduleDecoder?.close();
    session?.close();
    renderer?.close();
    audioPort = moduleDecoder = moduleStream = session = renderer = null;
    sounds.clear();
    sentSounds.clear();
    soundKeys.clear();
    inputs.forEach((i) => i.reset());
  }
  function prepare(canvas) {
    if (closed) throw Error("Match cancelled.");
    if (!renderer) renderer = new CoreThreeRenderer(canvas);
  }
  return {
    start,
    prepare,
    control,
    stop,
    snapshot: () => session?.snapshot(),
    get gpu() {
      return renderer?.stats;
    },
  };
}
