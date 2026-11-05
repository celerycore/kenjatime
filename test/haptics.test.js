import {test} from 'node:test';
import assert from 'node:assert/strict';
import {forceFeedbackParameters,feedbackMotors,ForceFeedbackState} from '../src/haptics.js';
import {FighterRuntime} from '../src/runtime.js';

test('ForceFeedback parses constants and rejects arithmetic, invalid waveforms and malformed envelopes',()=>{
  assert.deepEqual(forceFeedbackParameters({}),{waveform:'sine',time:60,self:1,freq:[128,0,0,0],ampl:[128,0,0,0]});
  for(const values of [{time:'30+30'},{time:'1.2'},{self:'2'},{waveform:'triangle'},{ampl:'1,2,3,4,5'},{freq:'1.5'}])assert.throws(()=>forceFeedbackParameters(values));
});

test('Waveforms select native motors while amplitude follows the cubic tick envelope',()=>{
  const effect={waveform:'sinesquare',ampl:[64,8,2,-.1],age:3};const expected=(64+8*3+2*9-.1*27)/255;
  assert.deepEqual(feedbackMotors(effect),{strongMagnitude:expected,weakMagnitude:expected});
  assert.equal(feedbackMotors({...effect,waveform:'sine'}).weakMagnitude,0);assert.equal(feedbackMotors({...effect,waveform:'square'}).strongMagnitude,0);
  assert.equal(feedbackMotors({...effect,ampl:[1000,0,0,0]}).strongMagnitude,1);assert.equal(feedbackMotors({...effect,ampl:[-100,0,0,0]}).weakMagnitude,0);
});

test('Rumble routes to self or opponent pads, stops on expiry/off and resets both motors',()=>{
  const calls=[],pads=[0,1].map(pad=>({vibrationActuator:{playEffect:(kind,value)=>{calls.push({pad,kind,...value});return Promise.resolve();},reset:()=>calls.push({pad,reset:true})}}));
  const state=new ForceFeedbackState({getGamepads:()=>pads}),entity={root:{teamSide:1}},event={type:'forcefeedback',...forceFeedbackParameters({waveform:'square',time:'2',self:'0',ampl:'255'})};
  state.consume([event],{entity});assert.equal(calls[0].pad,1);assert.equal(calls[0].weakMagnitude,1);assert.equal(calls[0].strongMagnitude,0);
  state.advance();assert.equal(state.effects.size,1);state.advance();assert.equal(state.effects.size,0);assert.deepEqual(calls.at(-1),{pad:1,reset:true});
  state.consume([{...event,self:1}],{entity});state.consume([{...event,self:1,waveform:'off'}],{entity});assert.equal(state.effects.size,0);assert.equal(calls.at(-1).pad,0);
});

test('Missing hardware remains a valid controller path and rejected actuator promises are contained',async()=>{
  const state=new ForceFeedbackState();state.getGamepads=()=>[];state.consume([{type:'forcefeedback',...forceFeedbackParameters({})}],{entity:{teamSide:1}});state.advance();state.stop();assert.equal(state.effects.size,0);
  const issues=[],failing=new ForceFeedbackState({getGamepads:()=>[{vibrationActuator:{playEffect:()=>Promise.reject(Error('Disconnected'))}}],onIssue:m=>issues.push(m)});
  failing.consume([{type:'forcefeedback',...forceFeedbackParameters({})}],{entity:{teamSide:1}});await Promise.resolve();assert.equal(issues.length,1);assert.match(issues[0],/Disconnected/);
});

test('Character ForceFeedback controllers dispatch usable events and invalid constants produce diagnostics',()=>{
  const cns='[Statedef 0]\nphysics=N\n[State Rumble]\ntype=ForceFeedback\ntrigger1=time=0\nwaveform=sinesquare\ntime=12\nampl=255,-2\n[State Bad]\ntype=ForceFeedback\ntrigger1=time=0\ntime=6*2';
  const c={path:'c.def',def:{info:{},files:{cns:'c.cns'}},files:{'c.cns':new TextEncoder().encode(cns)},animations:[]};
  const f=new FighterRuntime(c);f.tick();const events=f.events.filter(e=>e.type==='forcefeedback');assert.equal(events.length,1);assert.equal(events[0].time,12);assert.deepEqual(events[0].ampl,[255,-2,0,0]);assert.ok(f.diagnostics.some(d=>d.message.includes('numeric constants')));
});
