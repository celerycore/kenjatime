// Projectiles attribute chains to their owner; normal helpers remain separate attackers.
export const hitSourceId=attacker=>attacker?.isProjectile?attacker.owner?.id:attacker?.id;
export const singleTargetHit=(hit,attacker)=>!attacker?.isProjectile&&(hit.hitonce===undefined?/^[SCA]\s*,\s*[NSH]T$/i.test(hit.attr||''):Number(hit.hitonce)!==0);

export function allowsHitChain(defender,hit,attacker){
  const previous=defender.hitId??-1,chain=hit.chainid??-1;
  if(chain>=0&&previous!==chain)return false;
  const blocked=Array.isArray(hit.nochainid)?hit.nochainid:[hit.nochainid??-1];
  // A third party's intervening hit removes this attacker's NoChainID restriction.
  if(defender.hitSourceId===hitSourceId(attacker)&&hitSourceId(attacker)!==undefined&&blocked.some(id=>id>=0&&id===previous&&id!==chain))return false;
  return true;
}

export function allowsHitActivation(defender,hit,attacker){
  return allowsHitChain(defender,hit,attacker)&&!(singleTargetHit(hit,attacker)&&attacker?._spentHitDefs?.has(hit));
}

export function claimHitActivation(defender,hit,attacker){
  if(!attacker||!singleTargetHit(hit,attacker))return;
  attacker._spentHitDefs??=new WeakSet();attacker._spentHitDefs.add(hit);
  // Keep the chosen target and its current ID; all previous targets are dropped.
  attacker.targets.splice(0,attacker.targets.length,defender);attacker.targetHitIds.clear();
}

export function recordHitContact(attacker,hit,guarded,{count=true}={}){
  if(!attacker)return;
  attacker.moveContact=1;attacker.moveHit=guarded?0:1;attacker.moveGuarded=guarded?1:0;attacker.moveReversed=0;
  if(guarded||!count||attacker.world?.orderedPhases&&hit.numhits===0)return;
  const tick=attacker.world?.ticks??attacker.gameTime??0;
  if(attacker._lastHitCountTick!==tick){attacker.hitCount=(attacker.hitCount||0)+1;attacker._lastHitCountTick=tick;}
  attacker.uniqHitCount=(attacker.uniqHitCount||0)+1;
}
