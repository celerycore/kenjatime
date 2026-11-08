export const hitVariableNames=new Set(['xveladd','yveladd','type','animtype','airtype','groundtype','damage','hitcount','fallcount','hitshaketime','hittime','slidetime','ctrltime','recovertime','xoff','yoff','zoff','xvel','yvel','yaccel','hitid','chainid','guarded','isbound','fall','fall.damage','fall.xvel','fall.yvel','fall.recover','fall.time','fall.recovertime','fall.kill','fall.envshake.time','fall.envshake.freq','fall.envshake.ampl','fall.envshake.phase']);

export function initialHitVariables(actor){
  return {type:0,hitid:-1,chainid:0,hitcount:0,fallcount:0,hittime:-1,recovertime:actor.constant('data.liedown.time'),
    xveladd:0,yveladd:0,zoff:0,fall:0,'fall.time':0,'fall.recover':actor.world?.orderedPhases?0:1,'fall.recovertime':4};
}

const keys=new Set(['a','b','c','x','y','z','s','U','D','L','R']);
export function sampleRecoveryInput(actor,input,commands){
  const raw=input===null?new Set([...commands].filter(key=>keys.has(key))):new Set([...input].filter(key=>keys.has(key)));
  if(input===null)for(const [command,key]of [['holdup','U'],['holddown','D'],['holdfwd',actor.facing<0?'L':'R'],['holdback',actor.facing<0?'R':'L']])if(commands.has(command))raw.add(key);
  actor._recoveryPressed=[...raw].some(key=>!actor._previousInput.has(key));actor._previousInput=raw;actor.rawInput=raw;
}

/** Engine hit clocks are independent of CNS state Time and global pause clocks. */
export function advanceHitState(actor,{hitPaused=false}={}){
  const vars=actor.getHitVars;
  if(actor.moveType==='H'){
    if(vars.fall)vars['fall.time']=(vars['fall.time']||0)+1;
    if(!hitPaused){
      if(actor.hitTime>=0)actor.hitTime--;
      if([5070,5100].includes(actor.stateNo)&&actor._fallEntry!==actor._entrySerial){vars.fallcount=(vars.fallcount||0)+1;actor._fallEntry=actor._entrySerial;actor._fallDefenceMultiplier*=actor.constant('data.fall.defence_mul');}
      if(actor.stateNo===5110)vars.recovertime=Math.max(0,(vars.recovertime??actor.constant('data.liedown.time'))-1);
    }
    if(actor._recoveryPressed&&actor.alive&&(actor.stateType==='L'||vars.fallcount>0)&&vars.recovertime>0){
      const limit=Math.max(1,Math.ceil(vars.recovertime/2));vars.recovertime=Math.max(0,vars.recovertime-1-Math.floor(actor.resolveTrigger('random')/1000*limit));
    }
  }else{
    actor.comboHits=0;
    actor.hitTime=-1;actor.hitId=actor.hitId<0?-1:0;actor.hitSourceId=undefined;
    vars.fall=0;vars.fallcount=0;if(!actor.world?.orderedPhases)vars['fall.time']=0;vars['fall.envshake.time']=0;
    actor._fallDefenceMultiplier=1;
    vars.recovertime=actor.constant('data.liedown.time');
  }
  vars.hittime=actor.hitTime;vars.hitid=actor.hitId;vars.chainid=Math.max(0,actor.hitId);
}
