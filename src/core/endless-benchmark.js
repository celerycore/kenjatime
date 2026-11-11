/**
 * Endurance telemetry for opt-in endless rounds.
 * Samples every 30 seconds, max 720 rolling records + initial baseline.
 * Never retains frame state, sprite buffers, or GPU resources.
 */
export function appendBenchmarkSample(samples, item, limit = 720) {
  if (!Array.isArray(samples) || !Number.isSafeInteger(limit) || limit < 1)
    throw Error("Invalid benchmark sample buffer.");
  samples.push(item);
  if (samples.length > limit) samples.splice(0, samples.length - limit);
  return samples;
}

const mb = value => Number.isFinite(value) ? +(value / 1048576).toFixed(2) : null;
const clock = seconds => {
  const s = Math.max(0, Math.floor(seconds));
  return [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60]
    .map(n => String(n).padStart(2, "0")).join(":");
};
const csvValue = value => value === null || value === undefined ? "" : String(value);

export function mountEndlessBenchmark(host) {
  const panel = document.createElement("section");
  panel.className = "kenjatime-endless-benchmark";
  panel.setAttribute("aria-label", "Endless round benchmark diagnostics");
  panel.innerHTML = '<div class="endless-benchmark-readout"><strong>∞ ENDLESS BENCHMARK</strong>' +
    '<output aria-live="off">Preparing telemetry…</output></div>' +
    '<button type="button" data-export-benchmark>Export CSV</button>' +
    '<small>Samples every 30 seconds (max 720). GPU bytes are renderer estimates, not total VRAM. JS heap is browser-dependent and cannot include all worker memory. Keep the match tab foregrounded.</small>';
  host.append(panel);
  const output = panel.querySelector("output"), samples = [], started = performance.now();
  let first = null, lastSample = -Infinity, lastDisplay = -Infinity, disposed = false;
  const snapshot = () => first && samples[0] !== first ? [first, ...samples] : samples.slice();
  function update(state, gpu) {
    if (disposed || !state) return;
    const now = performance.now();
    const rounds = Math.max(0, (Number(state.roundNo) || 1) - 1 +
      (state.roundState === 3 || state.roundState === 4 ? 1 : 0));
    if (now - lastSample >= 30000) {
      lastSample = now;
      const heapBytes = Number(performance.memory?.usedJSHeapSize);
      const gpuBytes = Number(gpu?.textureBytes);
      const sample = {
        elapsed_s: Math.round((now - started) / 1000),
        completed_rounds: rounds,
        round: state.roundNo ?? 1,
        ticks: state.ticks ?? 0,
        js_heap_mb: mb(Number.isFinite(heapBytes) && heapBytes > 0 ? heapBytes : NaN),
        gpu_texture_mb: mb(Number.isFinite(gpuBytes) ? gpuBytes : NaN),
        gpu_textures: Number.isFinite(gpu?.textures) ? gpu.textures : null,
        gpu_evictions: Number.isFinite(gpu?.spriteEvictions) ? gpu.spriteEvictions : null,
        deferred_sprite_uploads: Number.isFinite(gpu?.deferredSpriteUploads) ? gpu.deferredSpriteUploads : null,
      };
      if (!first) first = sample;
      appendBenchmarkSample(samples, sample);
    }
    if (now - lastDisplay < 1000) return;
    lastDisplay = now;
    const heapBytes = Number(performance.memory?.usedJSHeapSize);
    const gpuBytes = Number(gpu?.textureBytes);
    output.textContent = "Rounds " + rounds + " · " + clock((now - started) / 1000) +
      " · GPU textures " + (Number.isFinite(gpuBytes) ? mb(gpuBytes) + " MB" : "N/A") +
      " (" + (gpu?.textures ?? "N/A") + ")" +
      " · JS heap " + (Number.isFinite(heapBytes) && heapBytes > 0 ? mb(heapBytes) + " MB" : "N/A") +
      " · samples " + samples.length;
  }
  panel.querySelector("[data-export-benchmark]").addEventListener("click", () => {
    const rows = snapshot();
    if (!rows.length) return;
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(","), ...rows.map(row => keys.map(k => csvValue(row[k])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kenjatime-endless-benchmark-" + new Date().toISOString().slice(0,19).replaceAll(":","-") + ".csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  return {
    update, snapshot,
    dispose() { disposed = true; panel.remove(); samples.length = 0; first = null; },
  };
}
