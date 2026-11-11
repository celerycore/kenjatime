/**
 * Decide which non-visible GPU sprite textures may be evicted to admit a new
 * sprite. This planner does not touch WebGL and is deterministic/testable.
 *
 * entries: array of { id, bytes, lastUsedFrame }. Only candidate sprite
 * textures are listed; stage videos and model assets stay outside this cache.
 */
export function planSpriteEvictions(entries, {
  requiredBytes, residentBytes, maxBytes, pinned = new Set(),
} = {}) {
  if (!Number.isSafeInteger(requiredBytes) || requiredBytes < 0 ||
      !Number.isFinite(residentBytes) || residentBytes < 0 ||
      !Number.isFinite(maxBytes) || maxBytes < 0)
    throw Error('Invalid GPU texture accounting.');
  if (requiredBytes > maxBytes) return { fits:false, oversized:true, evictions:[] };
  if (residentBytes + requiredBytes <= maxBytes)
    return { fits:true, oversized:false, evictions:[] };
  const needed = residentBytes + requiredBytes - maxBytes;
  const candidates = entries
    .filter(e => !pinned.has(e.id) && e.bytes > 0)
    .sort((a,b)=>(a.lastUsedFrame??0)-(b.lastUsedFrame??0) ||
      String(a.id).localeCompare(String(b.id)));
  const evictions = [];
  let freed = 0;
  for (const item of candidates) {
    evictions.push(item.id);
    freed += item.bytes;
    if (freed >= needed) break;
  }
  if (freed < needed) return { fits:false, oversized:false, evictions:[] };
  return { fits:true, oversized:false, evictions };
}
