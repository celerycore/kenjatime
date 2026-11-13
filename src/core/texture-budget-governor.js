/**
 * Conservative, bounded GPU-residency expansion for R8's imported 2D art.
 *
 * Repeated eviction/restoration of large indexed sprites forces SFF decoding
 * and WebGL texture allocation even when a phone has spare GPU memory. Begin
 * at the proven 64 MiB budget, permit at most 96 MiB after sustained measured
 * thrash, never allocate the extra memory unless real sprites require it.
 * Custom test/production caps remain unchanged.
 */
export const GPU_MIB = 1024 * 1024;
export class TextureBudgetGovernor {
  constructor({initialBytes=64*GPU_MIB,maxBytes=96*GPU_MIB,
    stepBytes=8*GPU_MIB,windowFrames=45,evictionThreshold=80}={}) {
    if(!Number.isSafeInteger(initialBytes)||initialBytes<=0||
       !Number.isSafeInteger(maxBytes)||maxBytes<initialBytes||
       !Number.isSafeInteger(stepBytes)||stepBytes<=0||
       !Number.isSafeInteger(windowFrames)||windowFrames<1||
       !Number.isSafeInteger(evictionThreshold)||evictionThreshold<1)
      throw new RangeError('Invalid adaptive texture residency bounds.');
    this.currentBytes=initialBytes;this.maxBytes=maxBytes;
    this.stepBytes=stepBytes;this.windowFrames=windowFrames;
    this.evictionThreshold=evictionThreshold;
    this.previousFrames=0;this.previousEvictions=0;this.upgrades=0;
  }
  observe({frames,evictions,residentBytes}){
    if(!Number.isSafeInteger(frames)||frames<0||
       !Number.isSafeInteger(evictions)||evictions<0||
       !Number.isFinite(residentBytes)||residentBytes<0)
      return this.currentBytes;
    if(frames<this.previousFrames||evictions<this.previousEvictions){
      this.previousFrames=frames;this.previousEvictions=evictions;
      return this.currentBytes;
    }
    if(frames-this.previousFrames<this.windowFrames)return this.currentBytes;
    const churn=evictions-this.previousEvictions;
    this.previousFrames=frames;this.previousEvictions=evictions;
    if(churn>=this.evictionThreshold &&
       residentBytes>=this.currentBytes*0.90 &&
       this.currentBytes<this.maxBytes){
      this.currentBytes=Math.min(this.maxBytes,this.currentBytes+this.stepBytes);
      this.upgrades++;
    }
    return this.currentBytes;
  }
}
