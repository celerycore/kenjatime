// Distances are measured in world coordinates, using the attack's coordinate
// system (which can differ from the current foreign state of its creator).
export function threatensGuard(attacker, defender) {
  const hit=attacker.hitDef;
  if(attacker===defender||attacker.destroyed||!hit||attacker.moveType!=='A')return false;
  if(attacker.isProjectile){
    if(attacker.removed||attacker.removing||attacker.remainingHits<=0||attacker.owner===defender)return false;
    if(!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(hit.attr??'').trim()))return false;
  }
  const team=String(hit.affectteam??'E').trim().toUpperCase(),friendly=!!(attacker.world&&defender.world&&attacker.teamSide===defender.teamSide);
  if(team==='E'&&friendly||team==='F'&&!friendly)return false;
  const scale=hit.coordinateScale??attacker.coordinateScale??1;
  let range;
  if(hit['guard.dist']!==undefined)range=hit['guard.dist']*scale;
  else if(attacker.isProjectile)range=attacker.guardDistance;
  else if(attacker.attackDist!==undefined)range=attacker.attackDist*attacker.coordinateScale;
  else range=attacker.constant('size.attack.dist')*attacker.coordinateScale;
  const dx=(defender.pos.x-attacker.pos.x)*attacker.facing;
  return dx>0&&dx<range;
}

export function inGuardDistance(defender, attackers) {
  for(const attacker of attackers)if(threatensGuard(attacker,defender))return true;
  return false;
}
