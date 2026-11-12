/**
 * Original, synthetic MUGEN 1.1 custom-state scenario.
 *
 * This is a Kenjatime fixture, NOT data captured from the native Elecbyte
 * executable. Identical author scripts and frames must be reproduced in a
 * lawful MUGEN 1.1 Beta 1 P1 installation for a real native oracle.
 */
import {TrainingMatch} from "../../../src/combat.js";
import {parseSections} from "../../../src/runtime.js";
import {captureLegacyTraceTick} from "../../../src/core/legacy-compatibility.js";

export const MUGEN11_TARGETSTATE_SCENARIO="targetstate-selfstate-changeanim2-v1";
const encode=value=>new TextEncoder().encode(value);
const frame=(group,number,ticks=-1)=>({
  group,number,x:0,y:0,ticks,clsn1:[],clsn2:[[-10,-15,10,0]],
});
const attackerCns=`
[Statedef 0]
type = S
movetype = I
physics = N
anim = 0
ctrl = 1

[Statedef 910]
type = S
movetype = H
physics = N
[State 910, Owner AIR action]
type = ChangeAnim2
trigger1 = Time = 0
value = 9100
elem = 2
[State 910, Owner state marker]
type = VarSet
trigger1 = Time = 0
v = 42
value = 73
[State 910, Continue borrowed CNS]
type = ChangeState
trigger1 = Time = 1
value = 911

[Statedef 911]
type = S
movetype = H
physics = N
[State 911, Return victim to own CNS]
type = SelfState
trigger1 = Time = 1
value = 0
`;
const victimCns=`
[Statedef 0]
type = S
movetype = I
physics = N
anim = 0
ctrl = 1

[Statedef 910]
type = S
movetype = I
physics = N
anim = 0
[State 910, Must NOT execute in borrowed state]
type = VarSet
trigger1 = 1
v = 42
value = 999
`;
function character(name,cns,extraAnimations=[]){
  return {
    path:`mugen11-${name}.def`,
    def:{info:{name,mugenversion:"1.1"},files:{cns:`${name}.cns`}},
    files:{[`${name}.cns`]:encode(cns)},
    animations:[
      {id:0,frames:[frame(0,0,-1)]},
      ...extraAnimations,
    ],
  };
}
const action9100={id:9100,frames:[frame(5000,0,3),frame(5000,1,5)]};

export function makeMugen11CustomStateScenario(){
  const attacker=character("attacker",attackerCns,[action9100]);
  const victim=character("victim",victimCns);
  const match=new TrainingMatch(attacker,{
    opponentCharacter:victim,initialize:false,orderedPhases:true,
    manageInputs:false,pushboxes:false,
  });
  // A distinct, nested target (P2-owned helper) ensures ID filtering cannot
  // silently apply TargetState to every target. The actual scripts remain
  // original synthetic fixtures and are NOT a Tomoka clone.
  const helper=match.spawnHelper(match.opponent,{id:72,stateno:0,keyctrl:0});
  match.player.targets=[match.opponent,helper];
  match.player.targetHitIds.set(match.opponent.id,71);
  match.player.targetHitIds.set(helper.id,72);
  return {match,attacker:match.player,victim:match.opponent,helper};
}
export function executeMugen11TargetState(actor,{id=71,value=910,ctrl=null}={}){
  const values=`id=${id}\nvalue=${value}`+(ctrl===null?"":`\nctrl=${ctrl}`);
  const section=parseSections(`[State 0, native TargetState probe]
type=TargetState
trigger1=1
${values}
`)[0];
  actor.execute({...section,type:"targetstate"});
}

const role=(actor,match)=>{
  if(actor===match.player)return "p1";
  if(actor===match.opponent)return "p2";
  if(actor.parent)return (actor.root===match.player?"p1-helper-":"p2-helper-")+actor.helperId;
  return "other";
};
export function captureMugen11TargetStateProjection(match,phase="after_tick"){
  const trace=captureLegacyTraceTick(match);
  return {
    tick:trace.tick,phase,
    actors:match.entities.slice().sort((a,b)=>a.id-b.id).map(a=>({
      role:role(a,match),
      stateNo:a.stateNo,stateTime:a.time,
      anim:a.anim,animElem:a.frameIndex+1,
      ctrl:a.ctrl,
      stateOwner:role(a.stateOwner||a,match),
      animationOwner:role(a.animationOwner||a,match),
      var42:a.vars[42],
    })),
  };
}
export function runMugen11TargetStateScenario({ticks=5,ctrl=0}={}){
  if(!Number.isInteger(ticks)||ticks<1||ticks>120)throw Error("Tick count must be 1..120");
  const {match,attacker}=makeMugen11CustomStateScenario();
  const observations=[captureMugen11TargetStateProjection(match,"before_controller")];
  executeMugen11TargetState(attacker,{ctrl});
  observations.push(captureMugen11TargetStateProjection(match,"after_controller"));
  for(let i=0;i<ticks;i++){
    match.tick();
    observations.push(captureMugen11TargetStateProjection(match));
  }
  return {scenario:MUGEN11_TARGETSTATE_SCENARIO,source:"kenjatime-synthetic",
    nativeMugen11Verified:false,ticks:observations};
}
