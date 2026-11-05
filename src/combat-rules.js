import {decodeText,ini} from './formats.js';

export const DEFAULT_COMBAT_RULES=Object.freeze({attackLifeToPower:.7,getHitLifeToPower:.6,superTargetDefence:1.5});

export function combatRules(files={},overrides={}){
  const path=Object.keys(files).find(path=>/(?:^|\/)data\/mugen\.cfg$/i.test(path));
  const rules=path?ini(decodeText(files[path])).rules||{}:{};
  const result={...DEFAULT_COMBAT_RULES};
  for(const [key,native]of [['attackLifeToPower','default.attack.lifetopowermul'],['getHitLifeToPower','default.gethit.lifetopowermul'],['superTargetDefence','super.targetdefencemul']]){
    const value=Number(overrides[key]??rules[native]??result[key]);
    if(!Number.isFinite(value)||value<0)throw Error(`Invalid combat rule ${native}.`);result[key]=value;
  }
  return result;
}

/** Positive scaled damage retains a one-point minimum; zero multipliers stay zero. */
export function scaledDamage(amount,attacker,defender,{absolute=false}={}){
  let value=Number(amount);if(!Number.isFinite(value))throw Error('Damage must be finite.');
  if(!absolute){
    const attack=attacker?Math.max(0,attacker.constant('data.attack')/100*(attacker.attackMultiplier??1)):1;
    const defence=Math.max(.01,defender.constant('data.defence')/100);
    value*=attack*Math.max(0,defender.defenceMultiplier??1)*Math.max(0,defender._fallDefenceMultiplier??1)/defence;
  }
  return value>0?Math.max(1,Math.round(value)):Math.round(value);
}

export function hitPower(hit,rules=DEFAULT_COMBAT_RULES){
  const base=Math.max(0,Math.trunc(hit.damage?.[0]||0));
  const values=(raw,multiplier)=>{const pair=Array.isArray(raw)?raw:raw===undefined?[Math.trunc(Math.fround(Math.fround(base)*Math.fround(multiplier)))]:[raw];const first=Math.trunc(pair[0]||0);return[first,Math.trunc(pair[1]??first/2)];};
  return{get:values(hit.getpower,rules.attackLifeToPower),give:values(hit.givepower,rules.getHitLifeToPower)};
}

/** KO launch constants in the shared 320-wide space; see combat documentation. */
export function koVelocity(x,y,posture,scale=1){
  const oldX=x,oldY=y;if(posture!=='L'){
    if(posture!=='A'&&y===0)x*=.66;
    if(x)x+=Math.sign(x)*2.5/scale;
    if(y<=0)y=Math.min(y-2/scale,(posture==='A'?-3:-6)/scale);
  }
  return{x,y,xadd:x-oldX,yadd:y-oldY};
}
