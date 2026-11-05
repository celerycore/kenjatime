import {spawnPosition} from './entities.js';

const vector = (value, fallback = [0,0]) => Array.isArray(value) ? [Number(value[0] ?? fallback[0]),Number(value[1] ?? fallback[1])] : value === undefined ? [...fallback] : [Number(value),fallback[1]];

/** A projectile is not a helper: it has an AIR clock and a HitDef, but no CNS state machine. */
export class ProjectileRuntime {
  constructor(creator, spec, {id} = {}) {
    this.creator = creator; this.owner = creator.root || creator; this.root = this.owner;
    this.isProjectile=true;
    this.world = creator.world; this.id = id; this.projId = Math.trunc(spec.projid ?? 0);
    this.teamSide = creator.teamSide; this.character = creator.character; this.coordinateScale = creator.coordinateScale;
    this.baseCoordinateScale=this.coordinateScale;
    this.animations = creator.animations; this.program = {...creator.program,constants:new Map(creator.program.constants)};
    this.spec = spec; this.events = []; this.diagnostics = []; this.asserted = new Set();
    Object.assign(this,spawnPosition(creator,spec,true));
    const scale = vector(spec.projscale,[1,1]), doscale = creator.constant('size.proj.doscale') !== 0;
    this.program.constants.set('size.xscale',scale[0] * (doscale ? creator.constant('size.xscale') : 1));
    this.program.constants.set('size.yscale',scale[1] * (doscale ? creator.constant('size.yscale') : 1));
    this.program.constants.set('size.draw.offset.x',0); this.program.constants.set('size.draw.offset.y',0);
    const velocity = vector(spec.velocity); this.vel = {x:velocity[0]*this.coordinateScale,y:velocity[1]*this.coordinateScale};
    this.accel = vector(spec.accel).map(v=>v*this.coordinateScale); this.velmul = vector(spec.velmul,[1,1]);
    this.anim = Math.trunc(spec.projanim ?? 0); this.frameIndex = 0; this.frameTime = 0; this.collisionFrame = null;
    this.hitDef = spec.hitDef; this.hitPauseTime = 0; this.hitCount = 0;
    this.moveType = 'A'; this.stateType = (this.hitDef?.attr || 'S')[0].toUpperCase();
    this.priority = Math.max(1,Math.trunc(spec.projpriority ?? 1)); this.sprPriority = spec.projsprpriority ?? 3;
    this.remainingHits = Math.max(1,Math.trunc(spec.projhits ?? 1)); this.missTime = Math.max(0,Math.trunc(spec.projmisstime ?? 0));
    this.pauseMoveTime = Math.max(0,spec.pausemovetime || 0); this.superMoveTime = Math.max(0,spec.supermovetime || 0);
    this.ownPal = !!spec.ownpal; this.time = 0; this.removing = false; this.removed = false; this.nextHitTick = 0;
    this._paletteRemaps=new Map(this.owner.paletteRemaps);if(this.ownPal&&spec.remappal&&spec.remappal[0]!==-1){this._paletteRemaps.clear();this._paletteRemaps.set('*',spec.remappal);}
    this.attackMultiplier = creator.attackMultiplier;
    if (!this.animations.has(this.anim)) { this.diagnostic('missing-animation',`Projectile animation ${this.anim} does not exist.`); this.removed = true; }
    if (spec.projshadow) this.diagnostic('unsupported-projectile','Projectile shadows are not rendered.');
  }
  get currentFrame() { return this.animations.get(this.anim)?.frames[this.frameIndex] || null; }
  get life() { return this.removed || this.removing ? 0 : 1; }
  get power() { return this.owner.power; } set power(value) { this.owner.power = value; }
  get maxPower() { return this.owner.maxPower; }
  get targets(){return this.owner.targets;}
  get targetHitIds(){return this.owner.targetHitIds;}
  get paletteRemaps(){return this.ownPal?this._paletteRemaps:this.owner.paletteRemaps;}
  constant(name) { const value = this.program.constants.get(name); return Array.isArray(value) ? value[0] : value; }
  changeState() { this.diagnostic('unsupported-projectile','A projectile cannot enter a player state.'); return false; }
  diagnostic(type,message) {
    if (!this.diagnostics.some(d=>d.message === message)) this.diagnostics.push({type,message,source:this.spec.source,line:this.spec.line});
  }
  record(type) {
    const history = this.owner.projectileHistory;
    history.push({type,projId:this.projId,tick:this.world?.ticks ?? this.time});
    // Keep the last record of each kind and ID. Time triggers remain valid after removal.
    for (let i=history.length-2;i>=0;i--) if (history[i].type === type && history[i].projId === this.projId) history.splice(i,1);
    if (history.length > 4096) { history.shift(); this.diagnostic('resource-limit','Projectile history exceeded 4096 distinct ID/event pairs.'); }
  }
  canHit(_defender,tick = this.world?.ticks ?? this.time) { return !this.removed && !this.removing && !!this.hitDef && tick >= this.nextHitTick && this.remainingHits > 0; }
  onContact({guarded = false,tick = this.world?.ticks ?? this.time} = {}) {
    this.record(guarded ? 'guarded' : 'hit'); this.remainingHits--; this.nextHitTick = tick + this.missTime + 1;
    if (this.spec.projremove !== 0 || this.remainingHits <= 0) this.remove('hit');
  }
  cancel() { if (!this.removing && !this.removed) { this.record('cancel'); this.remove('cancel'); } }
  remove(reason = 'expire') {
    if (this.removing || this.removed) return;
    this.removing = true; this.hitDef = null; this.hitPauseTime = 0;
    const hitAnim = this.spec.projhitanim ?? -1, remAnim = this.spec.projremanim ?? hitAnim;
    const anim = reason === 'hit' ? hitAnim : reason === 'cancel' ? this.spec.projcancelanim ?? remAnim : remAnim;
    const velocity = vector(this.spec.remvelocity); this.vel = {x:velocity[0]*this.coordinateScale,y:velocity[1]*this.coordinateScale};
    if (anim < 0 || !this.animations.has(anim)) { this.removed = true; return; }
    this.anim = Math.trunc(anim); this.frameIndex = this.frameTime = 0;
    this.collisionFrame = this.currentFrame;
    this.collisionAnimation=this.animations.get(this.anim);this.collisionFrameIndex=this.frameIndex;this.collisionFrameTime=this.frameTime;
  }
  tick({paused = false} = {}) {
    this.events = [];
    if (paused || this.removed) return;
    this.collisionFrame = this.currentFrame;
    this.collisionAnimation=this.animations.get(this.anim);this.collisionFrameIndex=this.frameIndex;this.collisionFrameTime=this.frameTime;
    if (this.hitPauseTime > 0) { this.hitPauseTime--; return; }
    this.pos.x += this.vel.x * this.facing; this.pos.y += this.vel.y;
    if (!this.removing) {
      this.vel.x = (this.vel.x + this.accel[0]) * this.velmul[0]; this.vel.y = (this.vel.y + this.accel[1]) * this.velmul[1];
      const height = vector(this.spec.projheightbound,[-240/this.coordinateScale,1/this.coordinateScale]).map(v=>v*this.coordinateScale);
      const edge = (this.spec.projedgebound ?? 40/this.coordinateScale)*this.coordinateScale;
      const stage = (this.spec.projstagebound ?? 40/this.coordinateScale)*this.coordinateScale;
      const left = this.world?.leftBound ?? -160, right = this.world?.rightBound ?? 160,screenLeft=this.world?.view.left??left,screenRight=this.world?.view.right??right;
      if ((this.spec.projremovetime ?? -1) >= 0 && this.time >= this.spec.projremovetime || this.pos.x < Math.max(left-stage,screenLeft-edge) || this.pos.x > Math.min(right+stage,screenRight+edge) || this.pos.y < height[0] || this.pos.y > height[1]) this.remove();
    }
    const frame = this.currentFrame, animation = this.animations.get(this.anim);
    if (frame && frame.ticks >= 0 && ++this.frameTime >= Math.max(1,frame.ticks)) {
      this.frameTime = 0; this.frameIndex++;
      if (this.frameIndex >= animation.frames.length) {
        if (this.removing) this.removed = true;
        this.frameIndex = animation.loopStart || 0;
      }
    }
    this.time++;
  }
}
