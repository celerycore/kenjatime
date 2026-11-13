/**
 * Browser document picker for locally stored MUGEN/IKEMEN archives.
 * Keep a single-file request as default: Android OEM browsers may route
 * unrestricted multi-file requests to a gallery/media provider.
 * This cannot install or force an unavailable Android storage provider.
 */
export const archiveDocumentAccept = [
  ".zip", ".rar", ".7z", ".tar", ".tgz", ".tar.gz", ".tar.bz2",
  ".tar.xz", ".tar.zst", ".gz", ".bz2", ".xz", ".zst",
  ".001", ".z01", ".r00", ".r01",
  "application/zip", "application/x-zip-compressed",
  "application/vnd.rar", "application/x-rar-compressed",
  "application/x-7z-compressed", "application/x-tar",
  "application/gzip", "application/x-gzip",
  "application/octet-stream",
].join(",");

export function archivePickerConfig({ multiple = false, allFiles = false } = {}) {
  return {
    accept: allFiles ? "*/*" : archiveDocumentAccept,
    multiple: multiple === true,
  };
}

export function pickArchiveDocuments(options = {}, doc = document) {
  const config = archivePickerConfig(options);
  // Run synchronously from the click handler: user activation is required
  // on Android for opening a browser file chooser.
  return new Promise((resolve) => {
    const input = doc.createElement("input");
    input.type = "file";
    input.id = "engine-archive-file";
    input.accept = config.accept;
    input.multiple = config.multiple;
    input.setAttribute("aria-hidden", "true");
    input.tabIndex = -1;
    // Offscreen rather than display:none for WebView file-input reliability.
    input.style.cssText = "position:fixed;left:-10000px;top:0;width:1px;height:1px;opacity:0;pointer-events:none";
    let finished = false;
    const complete = (files) => {
      if (finished) return;
      finished = true;
      input.remove();
      resolve(files && files.length ? files : null);
    };
    input.onchange = () => complete(Array.from(input.files || []));
    input.oncancel = () => complete(null);
    doc.body.append(input);
    try { input.click(); } catch { complete(null); }
  });
}
