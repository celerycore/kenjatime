/** Browser-native stage video. Only a single resized bitmap per layer can be
 * outstanding; hidden matches keep playback time without capturing frames. */
export class CoreVideos {
  constructor({ deliver, audio, warn = () => {} }) {
    this.deliver = deliver;
    this.audio = audio;
    this.warn = warn;
    this.layers = new Map();
    this.urls = new Map();
    this.closed = false;
  }
  open(data) {
    this.remove(data.id);
    if (this.closed) return;
    if (this.layers.size >= 4) {
      this.warn("Stage video-layer limit (4) exceeded.");
      return;
    }
    let source = this.urls.get(data.path);
    if (!source) {
      if (!(data.bytes instanceof Uint8Array)) return;
      source = { url: URL.createObjectURL(new Blob([data.bytes])), refs: 0 };
      this.urls.set(data.path, source);
    }
    source.refs++;
    const video = document.createElement("video");
    video.playsInline = true;
    video.preload = "auto";
    video.loop = !!data.loop;
    video.muted = data.volume === 0;
    video.style.display = "none";
    video.setAttribute("aria-hidden", "true");
    document.body.append(video);
    const { bytes, ...metadata } = data;
    const state = {
      ...metadata,
      video,
      playing: false,
      visible: true,
      captureVisible: true,
      pending: false,
      scheduled: false,
      frames: 0,
      lastTime: -1,
      closed: false,
    };
    this.layers.set(data.id, state);
    state.audio = this.audio?.media(video);
    state.audio?.volume((data.volume ?? 100) / 100);
    video.onloadeddata = () => this.play(state);
    video.onerror = () => {
      state.error = video.error?.code || "decode";
      this.warn(`Stage video cannot be decoded by this browser: ${data.path}`);
    };
    video.src = source.url;
  }
  play(state) {
    if (state.closed || state.error) return;
    if (state.playing) {
      state.video
        .play()
        .then(() => this.schedule(state))
        .catch((error) => {
          if (error.name === "NotAllowedError" && !state.video.muted) {
            state.video.muted = true;
            state.video
              .play()
              .then(() => this.schedule(state))
              .catch(() => {});
            this.warn("Tap the arena to enable stage video audio.");
          }
        });
    } else state.video.pause();
  }
  schedule(state) {
    if (
      state.closed ||
      state.scheduled ||
      state.pending ||
      !state.playing ||
      !state.visible ||
      !state.captureVisible
    )
      return;
    state.scheduled = true;
    const next = () => {
      state.scheduled = false;
      if (state.video.currentTime !== state.lastTime) this.capture(state);
      else this.schedule(state);
    };
    if (state.video.requestVideoFrameCallback)
      state.callback = state.video.requestVideoFrameCallback(next);
    else state.raf = requestAnimationFrame(next);
  }
  async capture(state) {
    if (
      state.closed ||
      state.pending ||
      !state.playing ||
      !state.visible ||
      !state.captureVisible
    )
      return;
    const video = state.video,
      w = video.videoWidth,
      h = video.videoHeight;
    if (!w || !h) {
      this.schedule(state);
      return;
    }
    state.pending = true;
    state.lastTime = video.currentTime;
    try {
      const scale = Math.min(1, 1280 / w, 720 / h),
        width = Math.max(1, Math.round(w * scale)),
        height = Math.max(1, Math.round(h * scale));
      const bitmap = await createImageBitmap(video, {
        resizeWidth: width,
        resizeHeight: height,
        resizeQuality: state.filter === "neighbor" ? "pixelated" : "low",
      });
      if (state.closed || this.closed) {
        bitmap.close();
        return;
      }
      state.frames++;
      this.deliver(
        {
          type: "video-frame",
          id: state.id,
          bitmap,
          time: state.lastTime,
          sourceWidth: w,
          sourceHeight: h,
          filter: state.filter,
        },
        [bitmap],
      );
    } catch (error) {
      state.pending = false;
      this.warn("Stage video frame could not decode: " + error.message);
    }
  }
  control(data) {
    const s = this.layers.get(data.id);
    if (!s) return;
    if (data.reset) {
      s.video.currentTime = 0;
      s.lastTime = -1;
    }
    if (data.playing !== undefined) s.playing = !!data.playing;
    if (data.visible !== undefined) s.visible = !!data.visible;
    if (data.captureVisible !== undefined)
      s.captureVisible = !!data.captureVisible;
    this.play(s);
  }
  ack(id) {
    const s = this.layers.get(id);
    if (s) {
      s.pending = false;
      this.schedule(s);
    }
  }
  gesture() {
    for (const s of this.layers.values()) {
      s.video.muted = s.volume === 0;
      this.play(s);
    }
  }
  status() {
    return {
      layers: this.layers.size,
      frames: [...this.layers.values()].reduce((n, s) => n + s.frames, 0),
      inFlight: [...this.layers.values()].filter((s) => s.pending).length,
      videos: [...this.layers.values()].map((s) => ({
        id: s.id,
        time: s.video.currentTime,
        paused: s.video.paused,
        frames: s.frames,
        error: s.error || null,
      })),
    };
  }
  remove(id) {
    const s = this.layers.get(id);
    if (!s) return;
    s.closed = true;
    s.video.pause();
    if (s.callback) s.video.cancelVideoFrameCallback?.(s.callback);
    cancelAnimationFrame(s.raf);
    s.audio?.disconnect();
    s.video.removeAttribute("src");
    s.video.load();
    s.video.remove();
    this.layers.delete(id);
    const source = this.urls.get(s.path);
    if (source && !--source.refs) {
      URL.revokeObjectURL(source.url);
      this.urls.delete(s.path);
    }
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    for (const id of [...this.layers.keys()]) this.remove(id);
  }
}

export function videoScale(mode, width, height, targetWidth, targetHeight) {
  if (
    ![width, height, targetWidth, targetHeight].every(
      (n) => Number.isFinite(n) && n > 0,
    )
  )
    return [0, 0];
  const x = targetWidth / width,
    y = targetHeight / height;
  const ratio =
    mode === "fit"
      ? Math.min(x, y)
      : mode === "fitwidth"
        ? x
        : mode === "fitheight"
          ? y
          : mode === "zoomfill"
            ? Math.max(x, y)
            : 1;
  return mode === "stretch" ? [x, y] : [ratio, ratio];
}
