// World positions use the 320-wide baseline; script offsets use the creator's
// coordinate system. Shared by Helper, Projectile and visual spawn controllers.
export function spawnPosition(owner, spec = {}, projectile = false) {
  const coordinate = owner.coordinateScale || 1;
  const offset = spec[projectile ? 'offset' : 'pos'];
  // MUGEN permits an omitted offset; preserve the X component when only
  // one offset is authored rather than destructuring a non-iterable number.
  const [x = 0, y = 0] = Array.isArray(offset)
    ? offset : offset === undefined ? [0, 0] : [offset, 0];
  const type = String(spec.postype || 'p1').toLowerCase();
  const left = owner.world?.view.left ?? owner.world?.leftBound??-160, right = owner.world?.view.right ?? owner.world?.rightBound??160;
  // MUGEN 1.1 falls back to the spawner's axis if P2 does not exist.
  // A destroyed opponent is no longer a valid P2 spawn anchor.
  const opponent = owner.opponent && !owner.opponent.destroyed
    ? owner.opponent : owner;
  let origin = owner.pos.x, ground = owner.pos.y, direction = owner.facing, facing = owner.facing;
  if (type === 'p2') {
    origin = opponent.pos.x;
    // MUGEN 1.1 Helper postype=p2 uses P2's X axis and facing, but its
    // Y offset is relative to the *spawning player's* Y position.
    // Keep projectile positioning unchanged: it has separate semantics.
    if (projectile) ground = opponent.pos.y;
    else direction = facing = opponent.facing;
  }
  else if (type === 'front') origin = owner.facing > 0 ? right : left;
  else if (type === 'back') { origin = owner.facing > 0 ? left : right; if (!projectile) direction = owner.facing; }
  else if (type === 'left' || type === 'right') { origin = type === 'left' ? left : right; if (!projectile) direction = facing = 1; }
  else if (type !== 'p1') throw Error(`Unsupported spawn postype: ${type}`);
  return {pos: {x: origin + Number(x) * coordinate * direction, y: ground + Number(y) * coordinate}, facing: facing * (Number(spec.facing ?? 1) < 0 ? -1 : 1)};
}
