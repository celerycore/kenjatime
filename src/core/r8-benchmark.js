/* Isolated PR #17 R8 residency benchmark. Never imported by the production Core. */
import "./r8-benchmark.css";

const MB = 1024 * 1024;
const number = (value, digits = 1) => Number.isFinite(value) ? value.toFixed(digits) : "—";
const mib = bytes => number((bytes || 0) / MB, 2) + " MiB";
const maxSamples = 36000; // 5 hours at 2Hz, bounded recorder memory.
const fields = [
  "utc", "elapsed_s", "active", "paused", "background", "ticks", "endless_mode", "round_number", "rounds_completed", "p1_wins", "p2_wins",
  "render_fps", "frame_cpu_submit_ms", "simulation_hz", "simulation_ticks", "simulation_backlog_ticks", "simulation_debt",
  "p1_life", "p2_life", "p1_state_no", "p2_state_no", "p1_state_owner_id", "p2_state_owner_id",
  "p1_anim", "p2_anim", "p1_animation_owner_id", "p2_animation_owner_id", "p1_anim_elem", "p2_anim_elem",
  "round_phase", "ko_hold_p1_ticks", "ko_hold_p2_ticks", "resolution_scale",
  "gpu_resident_mib", "r8_index_mib", "palette_rgba_mib", "rgba_mib",
  "raw_rgba_bytes_saved_mib", "gpu_textures", "gpu_evictions",
  "deferred_textures", "missing_frame_textures", "missing_palette_draws",
  "draws", "render_width", "render_height", "js_heap_used_mib",
  "helpers_alive", "helpers_created", "helpers_rejected", "helpers_missing_state",
  "helpers_destroyed", "helpers_hidden", "helpers_submitted",
  "helpers_missing_animation", "helpers_missing_sprite", "helper_state_map",
  "mugen11_p1_duplicate_globals", "mugen11_p2_duplicate_globals",
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
        <div><small>Simulation clock</small><strong data-r8="simulation">—</strong></div>
        <div><small>Tick backlog</small><strong data-r8="backlog">—</strong></div>
        <div><small>Render CPU submit</small><strong data-r8="cpu">—</strong></div>
        <div><small>GPU resident (raw)</small><strong data-r8="resident">—</strong></div>
        <div><small>Indexed R8</small><strong data-r8="indexed">—</strong></div>
        <div><small>Palettes RGBA8</small><strong data-r8="palettes">—</strong></div>
        <div><small>Truecolor RGBA8</small><strong data-r8="rgba">—</strong></div>
        <div><small>Texture evictions</small><strong data-r8="evictions">—</strong></div>
        <div><small>Missing art / palette draws</small><strong data-r8="missing">—</strong></div>
        <div><small>Helper states / spawned</small><strong data-r8="helpers">—</strong></div>
        <div><small>Helper sprite submissions</small><strong data-r8="helperdraws">—</strong></div>
        <div><small>Helper failures</small><strong data-r8="helperfails">—</strong></div>
        <div><small>Duplicate -1/-2/-3 StateDefs P1 / P2</small><strong data-r8="globaldupes">—</strong></div>
        <div><small>Borrowed state owners P1 / P2</small><strong data-r8="borrowed">—</strong></div>
      </div>
      <div class="r8-bench-actions">
        <button type="button" data-r8-start>Start recording</button>
        <button type="button" data-r8-stop disabled>Stop</button>
        <button type="button" data-r8-export disabled>Export CSV</button>
      </div>
      <div class="r8-bench-status" data-r8-status role="status">Select a match, then record while it runs.</div>
      <p class="r8-bench-note">Helper sprite submissions mean a drawable AIR/SFF quad was queued, not necessarily displayed by WebGL. Rejected helpers, duplicate -1/-2/-3 StateDefs and missing state/animation counts help diagnose Tomoka assists. The helper_state_map includes state/animation owner IDs and active bind target/time after the visibility flag. Player state-owner and AIR-owner columns help identify TargetState, ChangeAnim2 and SelfState transitions; they do not prove native MUGEN 1.1 parity. FPS is rendered frames per wall second and is independent of the fixed 60 Hz simulation clock. Tick backlog indicates delayed simulation work, not dropped ticks. CPU submit excludes asynchronous GPU execution. Memory is raw GPU texture allocation estimate, not total VRAM or device RAM. Background/paused samples are excluded from FPS summaries. No uploads or remote telemetry.</p>
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
  element("simulation").textContent = state.simulationHz ? state.simulationHz + " Hz" : "—";
  element("backlog").textContent = state.simulationBacklogTicks ?? "—";
  element("cpu").textContent = number(gpu.frameCpuSubmitMs) + " ms";
  element("resident").textContent = mib(gpu.textureBytes);
  element("indexed").textContent = mib(gpu.indexedTextureBytes);
  element("palettes").textContent = mib(gpu.paletteTextureBytes);
  element("rgba").textContent = mib(gpu.truecolorTextureBytes);
  element("evictions").textContent = String(gpu.textureEvictions || 0);
  element("missing").textContent = (gpu.missingFrameTextures || 0) + " / " + (gpu.missingPaletteDraws || 0);
  element("helpers").textContent = (state.helperFrameStats?.alive ?? "—") + " active / " + (state.helperStats?.created ?? "—") + " spawned";
  element("helperdraws").textContent = (state.helperFrameStats?.submitted ?? "—") + " submitted · " + (state.helperFrameStats?.hidden ?? 0) + " hidden";
  element("helperfails").textContent = (state.helperStats?.rejected ?? "—") + " rejected · " + (state.helperFrameStats?.missingAnimation ?? 0) + " no AIR · " + (state.helperFrameStats?.missingSprite ?? 0) + " no SFF";
  element("globaldupes").textContent = (state.compatibility?.characters?.[0]?.duplicateGlobalStates ?? "—") + " / " + (state.compatibility?.characters?.[1]?.duplicateGlobalStates ?? "—");
  element("borrowed").textContent = (state.players?.[0]?.state ?? "—") + " @" + (state.players?.[0]?.stateOwnerId ?? "—") + " / " + (state.players?.[1]?.state ?? "—") + " @" + (state.players?.[1]?.stateOwnerId ?? "—");
  if (!recording) return;
  const seconds = (now - startedAt) / 1000;
  highest = Math.max(highest, gpu.textureBytes || 0);
  const heap = performance.memory?.usedJSHeapSize;
  const row = [
    new Date().toISOString(), number(seconds, 3), active ? 1 : 0,
    state.paused ? 1 : 0, state.background ? 1 : 0, state.ticks ?? "",
    state.endlessMode ? 1 : 0, state.roundNo ?? "", Math.max(0, (state.roundNo ?? 1) - 1),
    state.roundWins?.player ?? "", state.roundWins?.opponent ?? "",
    Number.isFinite(fps) ? number(fps, 2) : "",
    Number.isFinite(gpu.frameCpuSubmitMs) ? number(gpu.frameCpuSubmitMs, 3) : "",
    state.simulationHz ?? "", state.simulationTicks ?? "", state.simulationBacklogTicks ?? "",
    Number.isFinite(state.simulationDebt) ? number(state.simulationDebt, 3) : "",
    state.players?.[0]?.life ?? "", state.players?.[1]?.life ?? "",
    state.players?.[0]?.state ?? "",state.players?.[1]?.state ?? "",
    state.players?.[0]?.stateOwnerId ?? "",state.players?.[1]?.stateOwnerId ?? "",
    state.players?.[0]?.anim ?? "",state.players?.[1]?.anim ?? "",
    state.players?.[0]?.animationOwnerId ?? "",state.players?.[1]?.animationOwnerId ?? "",
    state.players?.[0]?.animElem ?? "",state.players?.[1]?.animElem ?? "",
    state.roundState ?? "", state.roundKoHoldTicks?.[0] ?? "",
    state.roundKoHoldTicks?.[1] ?? "",
    Number.isFinite(state.resolutionScale) ? number(state.resolutionScale, 2) : "",
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
    state.helperFrameStats?.alive ?? "",state.helperStats?.created ?? "",
    state.helperStats?.rejected ?? "",state.helperStats?.missingState ?? "",
    state.helperStats?.destroyed ?? "",state.helperFrameStats?.hidden ?? "",
    state.helperFrameStats?.submitted ?? "",state.helperFrameStats?.missingAnimation ?? "",
    state.helperFrameStats?.missingSprite ?? "",
    (state.helpers || []).slice(0,56).map(h=>
      [h.id,h.helperId,h.parentId,h.state,h.anim,h.invisible?1:0,
       h.stateOwnerId??"",h.animationOwnerId??"",h.boundTargetId??"",h.bindTime??""].join(":")).join("|"),
    state.compatibility?.characters?.[0]?.duplicateGlobalStates ?? "",
    state.compatibility?.characters?.[1]?.duplicateGlobalStates ?? "",
  ];
  rows.push(row);
  if (rows.length >= maxSamples) { stop("Recorder limit reached"); return; }
  if (Number.isFinite(fps)) { fpsSum += fps; fpsCount++; }
  const average = fpsCount ? fpsSum / fpsCount : NaN;
  status.textContent = "Recording " + number(seconds, 0) + " s · " + rows.length +
    " samples · round " + (state.roundNo || 1) + " · avg " + number(average) + " FPS · peak raw GPU " + mib(highest);
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
