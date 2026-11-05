const clamp=v=>Math.max(0,Math.min(1,v));
const constant=raw=>{
  if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(String(raw).trim()))throw Error('ForceFeedback parameters require numeric constants.');
  const n=Number(raw);if(!Number.isFinite(n))throw Error('ForceFeedback requires finite constants.');return n;
};

export function forceFeedbackParameters(values){
  const waveform=String(values.waveform??'sine').replace(/^"(.*)"$/,'$1').toLowerCase();
  if(!['sine','square','sinesquare','off'].includes(waveform))throw Error(`Invalid ForceFeedback waveform ${waveform}.`);
  const time=constant(values.time??60),self=constant(values.self??1);
  if(!Number.isInteger(time)||time<0||time>360000||![0,1].includes(self))throw Error('Invalid ForceFeedback time or self parameter.');
  const result={waveform,time,self};
  for(const key of ['freq','ampl']){
    const terms=String(values[key]??'128').split(',').map(constant);
    if(terms.length>4||!Number.isInteger(terms[0]))throw Error(`Invalid ForceFeedback ${key} coefficients.`);
    result[key]=Array.from({length:4},(_,i)=>terms[i]??0);
  }
  return result;
}

/** Native frequency is ignored; waveform chooses the large and/or small rumble motor. */
export function feedbackMotors(effect){
  const t=effect.age??0,[a,b,c,d]=effect.ampl,amplitude=clamp((a+t*(b+t*(c+t*d)))/255);
  return{strongMagnitude:effect.waveform==='sine'||effect.waveform==='sinesquare'?amplitude:0,weakMagnitude:effect.waveform==='square'||effect.waveform==='sinesquare'?amplitude:0};
}

export class ForceFeedbackState{
  constructor({getGamepads=()=>globalThis.navigator?.getGamepads?.()||[],onIssue=()=>{}}={}){this.getGamepads=getGamepads;this.onIssue=onIssue;this.effects=new Map();this.issues=new Set();}
  report(message){if(!this.issues.has(message)){this.issues.add(message);this.onIssue(message);}}
  actuator(pad){try{const device=this.getGamepads()[pad];return device?.vibrationActuator||device?.hapticActuators?.[0];}catch(error){this.report(`Gamepad feedback: ${error.message}`);return null;}}
  invoke(fn){try{const pending=fn();pending?.catch?.(error=>this.report(`Gamepad feedback: ${error.message}`));}catch(error){this.report(`Gamepad feedback: ${error.message}`);}}
  reset(pad){const actuator=this.actuator(pad);if(!actuator)return;this.invoke(()=>actuator.reset?actuator.reset():actuator.playEffect?actuator.playEffect('dual-rumble',{duration:0,strongMagnitude:0,weakMagnitude:0}):actuator.pulse?.(0,0));}
  write(pad,effect){
    const actuator=this.actuator(pad);if(!actuator)return;const motors=feedbackMotors(effect);
    if(actuator.playEffect)this.invoke(()=>actuator.playEffect('dual-rumble',{duration:34,startDelay:0,...motors}));
    else if(actuator.pulse){this.report('This gamepad exposes one haptic motor; sine and square feedback share that motor.');this.invoke(()=>actuator.pulse(Math.max(motors.strongMagnitude,motors.weakMagnitude),34));}
  }
  consume(events,{entity}={}){
    for(const event of events||[])if(event.type==='forcefeedback'){
      const side=entity?.root?.teamSide??entity?.teamSide??1,pad=(event.self?side:3-side)-1;
      if(event.waveform==='off'||event.time<=0){this.effects.delete(pad);this.reset(pad);}
      else{const effect={...event,age:0};this.effects.set(pad,effect);this.write(pad,effect);}
    }
  }
  advance(){for(const [pad,effect]of this.effects){if(++effect.age>=effect.time){this.effects.delete(pad);this.reset(pad);}else this.write(pad,effect);}}
  stop(){for(const pad of this.effects.keys())this.reset(pad);this.effects.clear();}
}
