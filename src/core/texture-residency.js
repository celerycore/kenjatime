/**
 * GPU texture cache eviction planner.
 *
 * A texture is never evicted while referenced by the current frame. Resident
 * byte counts represent backing GPU allocations, not compressed SFF sizes.
 * Oldest Map entries are evicted first; callers refresh insertion order on use.
 */
export function planTextureEvictions(textures, residentBytes, requiredBytes, limit, activeIds = new Set(), {coldFirst=false}={}) {
  if (!Number.isSafeInteger(requiredBytes) || requiredBytes < 0 ||
      !Number.isSafeInteger(limit) || limit < 0 || requiredBytes > limit)
    return null;
  let remaining = residentBytes + requiredBytes - limit;
  if (remaining <= 0) return [];
  const result = [];
  // Keep historically visible sprites and permanent stage art resident when
  // streaming effects force memory pressure. This only affects which inactive
  // texture is evicted, never the asset used by a current-frame draw.
  const passes = coldFirst ? [true,false] : [false];
  for(const coldPass of passes) {
    for (const [id, texture] of textures) {
      if (activeIds.has(id) || id === '@white' || id === '@spark') continue;
      const bytes = texture?.userData?.residentBytes ?? texture?.userData?.videoBytes ?? 0;
      if (bytes <= 0) continue;
      const hot = (texture.userData?.visibleFrames||0)>=2;
      if(coldFirst && coldPass===hot)continue;
      result.push(id);
      remaining -= bytes;
      if (remaining <= 0) return result;
    }
  }
  return null; // A single active frame cannot fit; never evict live art.
}
