/* Isolated PR #17 R8 residency benchmark. Never imported by the production Core. */
import "./r8-benchmark.css";

const MB = 1024 * 1024;
const number = (value, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : "—";
const mib = bytes => number((bytes || 0) / MB, 2) + " MiB";
const maxSamples = 36000; // 5 hours at 2Hz, bounded recorder memory.
const fields = [
  "utc", "elapsed_s", "active", "paused", "background", "ticks",
  "render_fps", "frame_cpu_submit_ms", "simulation_debt",
  "gpu_resident_mib", "r8_index_mib", "palette_rgba_mib", "rgba_mib",
  "raw_rgba_bytes_saved_mib", "gpu_textures", "gpu_evictions",
  "deferred_textures", "missing_frame_textures", "missing_palette_draws",
  "draws", "render_width", "render_height", "js_heap_used_mib",
];
const panel = document.createElement("aside");
panel.id = "kenjatime-r8-benchmark";
panel.setAttribute("aria-label", "Indexed R8 GPU benchmark");
panel.innerHTML = `
  <details>
    <summary>R8 GPU BENCHMARK <span>PR #17</span></summary>
    <div class="r8-bench-content">
      <p>Live GPU residency estimates for the actual match. Works with bundled Kung Fu Man or your own locally imported fighters and stages.</p>
      <div class="r8-bench-readings" aria-live="off">
        <div><small>Rendered FPS</small><strong data-r8="fps">—</strong></div>
        <div><small>Render CPU submit</small><strong data-r8="cpu">—</strong></div>
        <div><small>GPU resident (raw)</small><strong data-r8="resident">—</strong></div>
        <div><small>Indexed R8</small><strong data-r8="indexed">—</strong></div>
        <div><small>Palettes RGBA8</small><strong data-r8="palettes">—</strong></div>
        <div><small>Truecolor RGBA8</small><strong data-r8="rgba">—</strong></div>
        <div><small>Texture evictions</small><strong data-r8="evictions">—</strong></div>
        <div><small>Missing art / palette draws</small><strong data-r8="missing">—</strong></div>
      </div>
      <div class="r8-bench-actions">
        <button type="button" data-r8-start>Start recording</button>
        <button type="button" data-r8-stop disabled>Stop</button>
        <button type="button" data-r8-export disabled>Export CSV</button>
      </div>
      <div class="r8-bench-status" data-r8-status role="status">Select a match, then record while it runs.</div>
      <p class="r8-bench-note">FPS is rendered frames per wall second. CPU submit excludes asynchronous GPU execution. Memory is raw GPU texture allocation estimate, not total VRAM or device RAM. Background/paused samples are excluded from FPS summaries. No uploads or remote telemetry.</p>
    </div>
  </details>`;
document.body.append(panel);
const details = panel.querySelector("details");
details.open = window.innerWidth >= 1000;
const element = key => panel.querySelector('[data-r8="' + key + '"]');
const startButton = panel.querySelector("[data-r8-start]");
const stopButton = panel.querySelector("[data-r8-stop]");
const exportButton = panel.querySelector("[data-r8-export]");
const status = panel.querySelector("[data-r8-status]");
let recording = false, rows = [], startedAt = 0, previous = null, highest = 0, lastDisplayedFrames = 0;
let fpsSum = 0, fpsCount = 0;

function current() {
  const battle = window.__kenjatimeCoreBattle;
  const gpu = battle?.gpu();
  const state = battle?.snapshot();
  return battle && gpu && state ? {gpu, state} : null;
}
function stop(reason = "Stopped") {
  recording = false;
  stopButton.disabled = true;
  startButton.disabled = false;
  exportButton.disabled = rows.length === 0;
  status.textContent = reason + " · " + rows.length + " samples recorded. Export CSV to inspect long runs.";
}
function start() {
  if (!current()) {
    status.textContent = "Launch a fight first (CPU vs CPU is useful for long stress runs).";
    return;
  }
  rows = [];
  previous = null;
  highest = 0;
  fpsSum = 0; fpsCount = 0;
  startedAt = performance.now();
  recording = true;
  startButton.disabled = true;
  stopButton.disabled = false;
  exportButton.disabled = true;
  status.textContent = "Recording GPU and frame statistics every 500 ms. Keep this tab foregrounded.";
}
function sample() {
  const now = performance.now(), match = current();
  if (!match) {
    previous = null;
    lastDisplayedFrames = 0;
    if (recording) stop("Match ended");
    return;
  }
  const {gpu, state} = match;
  const active = !state.paused && !state.background && !document.hidden;
  const elapsed = previous ? (now - previous.time) / 1000 : 0;
  const frames = Math.max(0, gpu.frames - (previous?.frames ?? gpu.frames));
  const fps = active && previous && previous.active && elapsed > 0 ? frames / elapsed : NaN;
  previous = {time: now, frames: gpu.frames, active};
  lastDisplayedFrames = gpu.frames;
  element("fps").textContent = Number.isFinite(fps) ? number(fps) : "—";
  element("cpu").textContent = number(gpu.frameCpuSubmitMs) + " ms";
  element("resident").textContent = mib(gpu.textureBytes);
  element("indexed").textContent = mib(gpu.indexedTextureBytes);
  element("palettes").textContent = mib(gpu.paletteTextureBytes);
  element("rgba").textContent = mib(gpu.truecolorTextureBytes);
  element("evictions").textContent = String(gpu.textureEvictions || 0);
  element("missing").textContent = (gpu.missingFrameTextures || 0) + " / " + (gpu.missingPaletteDraws || 0);
  if (!recording) return;
  const seconds = (now - startedAt) / 1000;
  highest = Math.max(highest, gpu.textureBytes || 0);
  const heap = performance.memory?.usedJSHeapSize;
  const row = [
    new Date().toISOString(), number(seconds, 3), active ? 1 : 0,
    state.paused ? 1 : 0, state.background ? 1 : 0, state.ticks ?? "",
    Number.isFinite(fps) ? number(fps, 2) : "",
    Number.isFinite(gpu.frameCpuSubmitMs) ? number(gpu.frameCpuSubmitMs, 3) : "",
    Number.isFinite(state.simulationDebt) ? number(state.simulationDebt, 3) : "",
    number((gpu.textureBytes || 0) / MB, 3),
    number((gpu.indexedTextureBytes || 0) / MB, 3),
    number((gpu.paletteTextureBytes || 0) / MB, 3),
    number((gpu.truecolorTextureBytes || 0) / MB, 3),
    number((gpu.indexedRawBytesSaved || 0) / MB, 3),
    gpu.textures ?? "", gpu.textureEvictions ?? "",
    gpu.deferredTextures ?? "", gpu.missingFrameTextures ?? "",
    gpu.missingPaletteDraws ?? "", gpu.draws ?? "",
    gpu.width ?? "", gpu.height ?? "",
    heap ? number(heap / MB, 3) : "",
  ];
  rows.push(row);
  if (rows.length >= maxSamples) { stop("Recorder limit reached"); return; }
  if (Number.isFinite(fps)) { fpsSum += fps; fpsCount++; }
  const average = fpsCount ? fpsSum / fpsCount : NaN;
  status.textContent = "Recording " + number(seconds, 0) + " s · " + rows.length +
    " samples · avg " + number(average) + " FPS · peak raw GPU " + mib(highest);
}
function csv() {
  const lines = [fields.join(","), ...rows.map(row => row.map(value =>
    '"' + String(value).replaceAll('"','""') + '"').join(","))];
  return lines.join("\r\n") + "\r\n";
}
function downloadCsv() {
  if (!rows.length) return;
  const blob = new Blob([csv()], {type: "text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kenjatime-r8-pr17-benchmark-" + new Date().toISOString().replaceAll(":", "-") + ".csv";
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
startButton.addEventListener("click", start);
stopButton.addEventListener("click", () => stop());
exportButton.addEventListener("click", downloadCsv);
window.addEventListener("kenjatime:battle", ({detail}) => {
  if (!detail.active) {
    previous = null;
    if (recording) stop("Match closed");
  }
});
setInterval(sample, 500);
export const r8Benchmark = {
  start, stop, csv,
  snapshot: () => ({ recording, samples: rows.length, maxResidentBytes: highest, frames: lastDisplayedFrames }),
};
window.__kenjatimeR8Benchmark = r8Benchmark;
