// Authored animation clocks. Definitions are shared immutable AIR data; only
// the actor's cursor changes. Keep cumulative durations out of trigger reads.
const timings = new WeakMap();
export function animationTiming(animation) {
  const frames = animation?.frames;
  if (!frames?.length) return null;
  let timing = timings.get(animation);
  if (timing?.frames === frames && timing.length === frames.length)
    return timing;
  const offsets = new Float64Array(frames.length + 1),
    lookupOffsets = new Float64Array(frames.length + 1);
  for (let i = 0; i < frames.length; i++) {
    offsets[i + 1] = offsets[i] + Math.max(1, frames[i].ticks);
    lookupOffsets[i + 1] =
      lookupOffsets[i] +
      (frames[i].ticks < 0 ? Infinity : Math.max(1, frames[i].ticks));
  }
  const loopStart = animation.loopStart ?? animation.loopstart ?? 0;
  timing = {
    frames,
    length: frames.length,
    offsets,
    lookupOffsets,
    duration: lookupOffsets[frames.length],
    loopStart,
    intro: lookupOffsets[loopStart],
  };
  timings.set(animation, timing);
  return timing;
}

function invalid(message) {
  const error = new Error(message);
  error.bottom = true;
  throw error;
}

export function animationElementTime(animation, clock, element) {
  const timing = animationTiming(animation),
    index = element - 1;
  if (!timing || index < 0 || index >= timing.length)
    invalid(`Animation element out of range: ${element}`);
  return clock.animationTime - timing.offsets[index];
}

export function animationElementAt(animation, clock, offset = 0) {
  const timing = animationTiming(animation);
  if (!timing) invalid("Animation has no elements");
  let time = clock.animationCycleTime + offset;
  if (
    Number.isFinite(timing.duration) &&
    (clock.animationLooped ||
      clock.frameIndex >= timing.loopStart ||
      time >= timing.duration)
  ) {
    const loopDuration = timing.duration - timing.intro;
    time =
      timing.intro +
      ((((time - timing.intro) % loopDuration) + loopDuration) % loopDuration);
  } else if (time < 0) invalid("Animation offset precedes its start");
  // An upper-bound lookup handles long actions without rebuilding durations or
  // walking every preceding element on each controller trigger.
  let low = 0,
    high = timing.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (time < timing.lookupOffsets[middle + 1]) high = middle;
    else low = middle + 1;
  }
  return low < timing.length ? low + 1 : undefined;
}

export function animationRemaining(animation, clock) {
  const timing = animationTiming(animation);
  if (!timing || clock.animationEnded) return 0;
  return Number.isFinite(timing.duration)
    ? clock.animationCycleTime - timing.duration
    : -1;
}

export function captureAnimationClock(actor) {
  return {
    anim: actor.anim,
    animationOwner: actor.animationOwner,
    frameIndex: actor.frameIndex,
    frameTime: actor.frameTime,
    animationTime: actor.animationTime,
    animationCycleTime: actor.animationCycleTime,
    animationLooped: actor.animationLooped,
    animationEnded: actor.animationEnded,
  };
}

export function restoreAnimationClock(actor, clock) {
  actor.anim = clock.anim;
  actor.animationOwner = clock.animationOwner;
  actor.frameIndex = clock.frameIndex;
  actor.frameTime = clock.frameTime;
  actor.animationTime = clock.animationTime;
  actor.animationCycleTime = clock.animationCycleTime;
  actor.animationLooped = clock.animationLooped;
  actor.animationEnded = clock.animationEnded;
}
