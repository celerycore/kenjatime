import { mountTouchControls } from "../touch-controls.js";
import { gamepadKeys } from "../input-buffer.js";
import { CoreAudio } from "./audio.js";
import { CoreVideos } from "./video-source.js";
import "./battle.css";
import "./hud.css";
let active;
const p1 = {
  ArrowUp: "U",
  ArrowDown: "D",
  ArrowLeft: "L",
  ArrowRight: "R",
  KeyZ: "a",
  KeyX: "b",
  KeyC: "c",
  KeyA: "x",
  KeyS: "y",
  KeyD: "z",
  Enter: "s",
};
const p2 = {
  KeyI: "U",
  KeyK: "D",
  KeyJ: "L",
  KeyL: "R",
  Numpad1: "a",
  Numpad2: "b",
  Numpad3: "c",
  Numpad4: "x",
  Numpad5: "y",
  Numpad6: "z",
};
export async function openCoreBattle({
  files,
  selection,
  onProgress = () => {},
}) {
  active?.close();
  const viewer = document.querySelector(".viewer"),
    stage = viewer?.querySelector(".stage");
  if (!stage) throw Error("The arena viewer is unavailable.");
  const host = document.createElement("section");
  host.className = "kenjatime-battle";
  host.setAttribute("aria-label", "Kenjatime arena");
  host.innerHTML =
    '<div class="kenjatime-battle-screen"><canvas width="960" height="540" aria-label="Fighting arena"></canvas><div class="core-hud"><div data-player="0"><b></b><meter min="0" max="1000" value="1000"></meter><small></small></div><span class="core-round">ROUND 1</span><div data-player="1"><b></b><meter min="0" max="1000" value="1000"></meter><small></small></div></div><p class="kenjatime-battle-status" role="status">Preparing your match…</p></div><div class="kenjatime-battle-bar"><button class="secondary" data-menu>Menu</button><button class="secondary" data-pause>Pause</button><button class="secondary" data-sound>Sound on</button><button class="secondary" data-quality>Visuals: Auto</button></div>';
  stage.append(host);
  viewer.classList.add("kenjatime-viewer-playing");
  viewer.closest(".workspace")?.classList.add("kenjatime-workspace-playing");
  let worker,
    runtime,
    cancelPrepare,
    paused = false,
    closed = false,
    ready = false,
    focused = document.hasFocus(),
    appActive = true,
    state,
    gpu,
    backend,
    raf,
    quality = "auto",
    enabled = true;
  const keyboard = [new Set(), new Set()];
  const lastPadKeys = [null, null];
  const send = (message, transfer = []) => {
    if (closed) return;
    if (worker) worker.postMessage(message, transfer);
    else runtime?.control(message);
  };
  const input = (side, keys, source = "keyboard") =>
    send({
      type: "input",
      side,
      keys: [...keys],
      source,
      time: performance.timeOrigin + performance.now(),
    });
  const audio = new CoreAudio(
      (status) => {
        const button = host.querySelector("[data-sound]");
        if (button)
          button.textContent = !status.enabled
            ? "Sound off"
            : status.paused
              ? "Sound paused"
              : status.running
                ? "Sound on"
                : "Enable sound";
      },
      { requestSound: (key) => send({ type: "sound-request", key }) },
    ),
    sampleRate = audio.prepare();
  const videos = new CoreVideos({
    deliver: send,
    audio: audio.output,
    warn: (message) => send({ type: "media-warning", message }),
  });
  let resolve, reject;
  const started = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  started.catch(() => {});
  const touch = mountTouchControls(
    host.querySelector(".kenjatime-battle-screen"),
    (keys) => input(0, keys, "touch"),
  );
  touch.panel.hidden = false;
  function update(data) {
    if (closed) return;
    if (data.type === "video-init") {
      videos.open(data);
      return;
    }
    if (data.type === "video-control") {
      videos.control(data);
      return;
    }
    if (data.type === "video-ack") {
      videos.ack(data.id);
      return;
    }
    if (data.type === "audio-init") {
      audio.output
        .init(data.sampleRate, (port) =>
          send({ type: "audio-port", port }, [port]),
        )
        .catch((error) => onProgress(error.message));
      return;
    }
    if (data.type === "sound-data") {
      audio.provideSound(data);
      return;
    }
    if (data.type === "sound") {
      void audio.event(data.event);
      return;
    }
    if (data.type === "music") {
      audio.musicFile(data);
      return;
    }
    if (data.type === "music-suppression") {
      audio.setMusicSuppressed(data.value);
      return;
    }
    if (data.type === "ready") {
      ready = true;
      host.querySelector("[role=status]").hidden = true;
      resolve();
      return;
    }
    if (data.type === "error") {
      if (!ready) reject(Error(data.message));
      close();
      onProgress(data.message);
      return;
    }
    if (data.type === "state") {
      state = data.state;
      gpu = data.gpu;
      window.__kenjatimeCoreState = state;
      for (const [side, actor] of state.players.entries()) {
        const row = host.querySelector(`[data-player="${side}"]`);
        row.querySelector("b").textContent = actor.name;
        row.querySelector("meter").max = actor.maxLife;
        row.querySelector("meter").value = actor.life;
        row.querySelector("small").textContent =
          `${actor.life} / ${actor.maxLife} · POWER ${actor.power}`;
      }
      host.querySelector(".core-round").textContent =
        selection.mode === "training"
          ? "TRAINING"
          : state.roundState < 2
            ? "READY"
            : "FIGHT";
    }
  }
  function pause(value = !paused) {
    paused = !!value;
    keyboard.forEach((k) => k.clear());
    lastPadKeys.fill(null);
    touch.reset();
    send({ type: "pause", value: paused });
    audio.pause(paused);
    host.querySelector("[data-pause]").textContent = paused
      ? "Resume"
      : "Pause";
    window.dispatchEvent(
      new CustomEvent("kenjatime:battle", { detail: { active: true, paused } }),
    );
  }
  function keys(event) {
    if (event.repeat) return;
    const side = p1[event.code] ? 0 : p2[event.code] ? 1 : -1;
    if (side < 0) return;
    event.preventDefault();
    const key = (side ? p2 : p1)[event.code];
    event.type === "keydown"
      ? keyboard[side].add(key)
      : keyboard[side].delete(key);
    input(side, keyboard[side]);
    if (event.type === "keydown") audio.output.gesture();
  }
  const releaseInputs = () => {
      keyboard.forEach((k, side) => {
        k.clear();
        input(side, k);
      });
      touch.reset();
      lastPadKeys.fill(null);
      send({ type: "release-inputs" });
    },
    visibility = () => {
      const hidden = document.hidden || !appActive;
      if (hidden) releaseInputs();
      send({ type: "visibility", hidden, focused });
    },
    appState = (e) => {
      appActive = !!e.detail.active;
      visibility();
    },
    blur = () => {
      focused = false;
      releaseInputs();
      visibility();
    },
    focus = () => {
      focused = true;
      lastPadKeys.fill(null);
      visibility();
      audio.output.gesture();
    };
  function pads() {
    if (closed) return;
    const devices = Array.from(
      focused && appActive && !document.hidden
        ? navigator.getGamepads?.() || []
        : [],
    ).filter((p) => p?.connected);
    for (let side = 0; side < 2; side++) {
      const keys = gamepadKeys(devices[side]),
        signature = [...keys].join(",");
      if (signature !== lastPadKeys[side]) {
        input(side, keys, "gamepad");
        lastPadKeys[side] = signature;
      }
    }
    raf = requestAnimationFrame(pads);
  }
  function close() {
    if (closed) return;
    send({ type: "stop" });
    closed = true;
    cancelPrepare?.();
    worker?.terminate();
    runtime?.stop();
    videos.close();
    audio.close();
    touch.dispose();
    cancelAnimationFrame(raf);
    window.removeEventListener("keydown", keys);
    window.removeEventListener("keyup", keys);
    window.removeEventListener("blur", blur);
    window.removeEventListener("focus", focus);
    window.removeEventListener("kenjatime:app-state", appState);
    document.removeEventListener("visibilitychange", visibility);
    host.remove();
    viewer.classList.remove("kenjatime-viewer-playing");
    viewer
      .closest(".workspace")
      ?.classList.remove("kenjatime-workspace-playing");
    delete window.__kenjatimeCoreState;
    if (window.__kenjatimeCoreBattle?.host === host)
      delete window.__kenjatimeCoreBattle;
    window.dispatchEvent(
      new CustomEvent("kenjatime:battle", {
        detail: { active: false, paused: true },
      }),
    );
    if (!ready) reject(Error("Match cancelled."));
    if (active?.host === host) active = null;
  }
  host.addEventListener("pointerdown", () => {
    audio.output.gesture();
    videos.gesture();
  });
  host.querySelector("[data-menu]").onclick = close;
  host.querySelector("[data-pause]").onclick = () => pause();
  host.querySelector("[data-sound]").onclick = () => {
    enabled = audio.output.status().running ? false : true;
    audio.mute(enabled);
  };
  host.querySelector("[data-quality]").onclick = () => {
    quality = quality === "auto" ? "sharp" : "auto";
    send({ type: "quality", value: quality });
    host.querySelector("[data-quality]").textContent =
      "Visuals: " + (quality === "auto" ? "Auto" : "Sharp");
  };
  window.addEventListener("keydown", keys);
  window.addEventListener("keyup", keys);
  window.addEventListener("blur", blur);
  window.addEventListener("focus", focus);
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("kenjatime:app-state", appState);
  const api = {
    host,
    close,
    pause,
    input,
    snapshot: () => state,
    gpu: () => gpu,
    backend: () => backend,
    audioStatus: () => audio.status(),
    videoStatus: () => videos.status(),
  };
  active = api;
  window.__kenjatimeCoreBattle = api;
  window.dispatchEvent(
    new CustomEvent("kenjatime:battle", {
      detail: { active: true, paused: false },
    }),
  );
  host.scrollIntoView({ block: "start", behavior: "instant" });
  let canvas = host.querySelector("canvas");
  try {
    if (
      typeof canvas.transferControlToOffscreen === "function" &&
      typeof OffscreenCanvas !== "undefined"
    ) {
      try {
        worker = new Worker(new URL("./worker.js", import.meta.url), {
          type: "module",
        });
        // Confirm graphics before transferring any character bytes. Failed worker
        // graphics can then fall back without a second full library copy.
        await new Promise((yes, no) => {
          const timer = setTimeout(
            () => finish(Error("Worker graphics startup timed out.")),
            15000,
          );
          function finish(error) {
            clearTimeout(timer);
            cancelPrepare = null;
            error ? no(error) : yes();
          }
          cancelPrepare = () => finish(Error("Match cancelled."));
          worker.onmessage = ({ data }) => {
            if (data.type === "renderer-ready") finish();
            else if (data.type === "renderer-unavailable")
              finish(Error(data.message));
          };
          worker.onerror = (event) => {
            event.preventDefault();
            finish(Error(event.message || "Worker graphics are unavailable."));
          };
          try {
            const offscreen = canvas.transferControlToOffscreen();
            worker.postMessage({ type: "prepare", canvas: offscreen }, [
              offscreen,
            ]);
          } catch (error) {
            finish(error);
          }
        });
        if (closed) throw Error("Match cancelled.");
        backend = "worker";
        worker.onmessage = ({ data }) => update(data);
        worker.onerror = (event) =>
          update({
            type: "error",
            message: event.message || "The game worker stopped.",
          });
        worker.postMessage(
          { type: "start", files, selection, sampleRate, quality },
          [...new Set(Object.values(files).map((bytes) => bytes.buffer))],
        );
      } catch (error) {
        worker?.terminate();
        worker = null;
        if (closed) throw error;
        const replacement = canvas.cloneNode(false);
        canvas.replaceWith(replacement);
        canvas = replacement;
        onProgress("Using main-thread graphics on this device.");
      }
    }
    if (!worker) {
      backend = "main";
      const { createCoreRuntime } = await import("./runtime.js");
      if (closed) throw Error("Match cancelled.");
      runtime = createCoreRuntime(update);
      await runtime.start({ files, selection, canvas, sampleRate, quality });
    }
    pads();
    visibility();
    await started;
  } catch (error) {
    close();
    throw error;
  }
  return api;
}
