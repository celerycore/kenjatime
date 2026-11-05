import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ControllerManager,controllerName} from '../src/gamepads.js';
import {gamepadKeys,TickInputBuffer} from '../src/input-buffer.js';
import {ForceFeedbackState} from '../src/haptics.js';

function pad(index=0,pressed=[],axes=[0,0]){return{index,id:'Sony Wireless Controller (Vendor: 054c Product: 0ce6)',connected:true,mapping:'standard',axes,buttons:Array.from({length:18},(_,i)=>({pressed:pressed.includes(i),value:pressed.includes(i)?1:0}))};}

test('PS5 USB/Bluetooth identifiers and DualSense Edge receive PlayStation labels',()=>{
  for(const id of ['DualSense Wireless Controller','054c:0ce6','054c:0df2'])assert.equal(controllerName({id}),'PS5 DualSense');
  assert.equal(controllerName({id:'Sony DualShock 4'}),'PlayStation controller');assert.equal(controllerName({id:'Xbox Wireless Controller'}),'Xbox controller');
});

test('DualSense face buttons, shoulders and Options map to native MUGEN inputs',()=>{
  assert.deepEqual([...gamepadKeys(pad(2,[0,1,2,3,4,5,9]))].sort(),['a','b','c','s','x','y','z']);
  assert.deepEqual([...gamepadKeys(pad(2,[12,15]))],['R','U']);
});

test('D-pad overrides stick drift, opposite D-pad directions cancel and deadzone is configurable',()=>{
  assert.deepEqual([...gamepadKeys(pad(0,[14],[.9,.1]))],['L']);
  assert.equal(gamepadKeys(pad(0,[14,15],[.9,.1])).size,0);
  assert.equal(gamepadKeys(pad(0,[],[.3,.2]),{deadzone:.4}).size,0);
  assert.deepEqual([...gamepadKeys(pad(0,[],[.6,-.6]),{deadzone:.4})],['R','U']);
});

test('Trigger pressure and user remaps work without trusting unknown button actions',()=>{
  const p=pad();p.buttons[7]={pressed:false,value:.8};assert.deepEqual([...gamepadKeys(p,{buttons:{7:'z',0:'bogus'}})],['z']);
  const raw={...pad(0,[2]),mapping:''};assert.equal(gamepadKeys(raw).size,0);assert.deepEqual([...gamepadKeys(raw,{customLayout:true,buttons:{2:'b'}})],['b']);
});

test('Automatic player roles fill sparse browser slots and keep P2 when P1 disconnects',()=>{
  const p1=pad(2),p2=pad(5);let devices=[null,null,p1,null,null,p2];const m=new ControllerManager({getGamepads:()=>devices});
  assert.deepEqual(m.poll(),[p1,p2]);devices=[null,null,null,null,null,p2];assert.deepEqual(m.poll(),[null,p2]);
  devices[2]=p1;assert.deepEqual(m.poll(),[p1,p2]);
});

test('Explicit assignments reserve devices before automatic choices and never share a pad',()=>{
  const a=pad(2),b=pad(5),m=new ControllerManager({getGamepads:()=>[a,b],settings:[{}, {device:'2'}]});
  assert.deepEqual(m.poll(),[b,a]);m.configure(0,{device:'2'});assert.deepEqual(m.assigned(),[a,b]);
  m.configure(0,{device:'none'});assert.equal(m.assigned()[0],null);
});

test('Settings persist per player, reset independently and tolerate malformed saved values',()=>{
  const saved=[],m=new ControllerManager({getGamepads:()=>[pad()],settings:[null,{deadzone:100,buttons:{2:'INVALID'}}],onSave:s=>saved.push(JSON.stringify(s))});
  m.configure(0,{deadzone:.4,buttons:{2:'z'}});assert.equal(m.settings[0].buttons[2],'z');assert.equal(m.settings[1].buttons[2],'x');
  const restored=new ControllerManager({settings:JSON.parse(saved.at(-1))});assert.equal(restored.settings[0].deadzone,.4);assert.equal(restored.settings[0].buttons[2],'z');
  m.resetMapping(0);assert.equal(m.settings[0].buttons[2],'x');assert.equal(m.settings[1].deadzone,.9);
});

test('Unmapped gamepads require opt-in and denied Gamepad API access clears held input',()=>{
  let denied=false;const raw={...pad(3,[2]),mapping:''},m=new ControllerManager({getGamepads:()=>{if(denied)throw Error('Denied');return[raw];}});
  m.poll();assert.equal(m.keys(0).size,0);m.configure(0,{customLayout:true});assert.deepEqual([...m.keys(0)],['x']);
  denied=true;m.poll();assert.equal(m.keys(0).size,0);assert.match(m.error,/unavailable/);
});

test('Browsers without Gamepad API provide a visible capability result',()=>{
  const m=new ControllerManager();assert.deepEqual(m.poll(),[null,null]);assert.match(m.error,/does not support the Gamepad API/);
});

test('Disconnecting a pad drops queued/held pad actions while preserving keyboard and touch',()=>{
  const b=new TickInputBuffer();b.record('keyboard',['a'],0);b.record('touch',['b'],0);b.record('gamepad',['R','x'],1);b.clearSource('gamepad');
  assert.deepEqual([...b.sample(2)].sort(),['a','b']);b.record('gamepad',['z'],3);b.sample(4);b.clearSource('gamepad');assert.deepEqual([...b.sample(5)].sort(),['a','b']);
});

test('Native ForceFeedback follows assigned player roles instead of physical browser slot numbers',()=>{
  const calls=[],a=pad(2),b=pad(5);for(const p of [a,b])p.vibrationActuator={playEffect:()=>calls.push(p.index),reset:()=>{}};
  const m=new ControllerManager({getGamepads:()=>[null,null,a,null,null,b],settings:[{device:'5'},{device:'2'}]});m.poll();
  const h=new ForceFeedbackState({getGamepads:()=>m.assigned()});h.consume([{type:'forcefeedback',waveform:'sine',time:2,self:1,ampl:[128,0,0,0]}],{entity:{teamSide:1}});assert.deepEqual(calls,[5]);
});
