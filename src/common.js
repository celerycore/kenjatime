// Independently authored common-state subset. Character-supplied common states
// take precedence. These defaults are deliberately not a copy of common1.cns.
const state = (number, properties, controllers = '') => `
[Statedef ${number}]
${properties}
${controllers}
`;
const controller = (type, parameters, trigger = '1') => `
[State 0, ${type}]
type = ${type}
trigger1 = ${trigger}
${parameters}
`;
const change = (target, trigger, ctrl = 1) => controller('ChangeState', `value = ${target}\nctrl = ${ctrl}`, trigger);
const anim = (value, trigger = 'time = 0') => controller('ChangeAnim', `value = ${value}`, `(${trigger}) && selfanimexist(${value})`);

export function commonStates({orderedPhases=false}={}){return [
  state(0, 'type = S\nmovetype = I\nphysics = S\nctrl = 1',
    anim(0, 'anim != 0') + controller('VelSet', 'y = 0', 'time = 0')+(orderedPhases?controller('VelSet','x=0','abs(vel x)<const(movement.stand.friction.threshold)'):'')),
  state(10, 'type = C\nmovetype = I\nphysics = C'+(orderedPhases?'\nvelset=0,0':''),
    anim(10) + change(11, 'animtime = 0 || !selfanimexist(10)')),
  state(11, 'type = C\nmovetype = I\nphysics = C\nctrl = 1', anim(11)),
  state(12, 'type = S\nmovetype = I\nphysics = S',
    anim(12) + change(0, 'animtime = 0 || !selfanimexist(12)')),
  state(20, 'type = S\nmovetype = I\nphysics = S\nctrl = 1',
    controller('VelSet', 'x = const(velocity.walk.fwd.x)', 'command = "holdfwd"') +
    controller('VelSet', 'x = const(velocity.walk.back.x)', 'command = "holdback"') +
    anim(20, 'vel x > 0 && anim != 20') + anim(21, 'vel x < 0 && anim != 21')),
  state(40, 'type = S\nmovetype = I\nphysics = S\nctrl = 0',
    anim(40) + controller('VelSet', 'x = ifelse(command = "holdfwd", const(velocity.jump.fwd.x), ifelse(command = "holdback", const(velocity.jump.back.x), const(velocity.jump.neu.x)))\ny = const(velocity.jump.y)', 'animtime = 0 || !selfanimexist(40)') +
    change(50, 'animtime = 0 || !selfanimexist(40)')),
  state(45, 'type = A\nmovetype = I\nphysics = A\nctrl = 1',
    controller('VelSet', 'x = ifelse(command = "holdfwd", const(velocity.airjump.fwd.x), ifelse(command = "holdback", const(velocity.airjump.back.x), const(velocity.airjump.neu.x)))\ny = const(velocity.airjump.y)', 'time = 0') + change(50, 'time > 0')),
  state(50, 'type = A\nmovetype = I\nphysics = A\nctrl = 1',
    anim('ifelse(vel x = 0, 41, ifelse(vel x > 0, 42, 43))') + change(52, 'pos y >= 0 && vel y > 0', 0)),
  state(51, 'type = A\nmovetype = I\nphysics = A'),
  state(52, 'type = S\nmovetype = I\nphysics = S\nctrl = 0'+(orderedPhases?'\nvelset=0,0\nanim=47':''),
    anim(47) + controller('PosSet', 'y = 0', 'time = 0') + controller('VelSet', 'y = 0', 'time = 0') + (orderedPhases?controller('CtrlSet','value=1','time>=3'):'') + change(0, 'time >= 3 && (animtime = 0 || !selfanimexist(47))')),
  state(100, 'type = S\nmovetype = I\nphysics = '+(orderedPhases?'S':'N')+'\nctrl = 1',
    anim(100) + controller('VelSet', 'x = const(velocity.run.fwd.x)') + controller('AssertSpecial', 'flag = nowalk\nflag2 = noautoturn') + change(0, 'command != "holdfwd"')),
  state(105, 'type = A\nmovetype = I\nphysics = A\nctrl = 0',
    anim(105) + (orderedPhases?controller('CtrlSet','value=1','time>=2'):'') + controller('VelSet', 'x = const(velocity.run.back.x)\ny = const(velocity.run.back.y)', 'time = 0') + change(orderedPhases?106:52, 'pos y >= 0 && vel y > 0', 0)),
  ...(orderedPhases?[state(106,'type=S\nmovetype=I\nphysics=S\nctrl=0',anim(47)+controller('PosSet','y=0')+controller('VelSet','y=0')+controller('VelSet','x=0','abs(vel x)<const(movement.stand.friction.threshold)')+change(0,'time>=7'))]:[]),
  // Guard entry/hold states use ordinary CNS transitions; the combat layer
  // decides whether each HitDef may be guarded in the fighter's posture.
  ...[[120, 'S', orderedPhases?120:130], [130, 'S', 130], [131, 'C', 131], [132, 'A', 132], [140, 'S', 130]].map(([id, posture, action]) =>
    state(id, `type = ${posture}\nmovetype = I\nphysics = ${posture}\nctrl = 1${posture === 'A' ? '' : '\nvelset = 0,0'}`,
      anim(action) + change(posture === 'A' ? 50 : posture === 'C' ? 11 : 0, 'command != "holdback"') + (orderedPhases && id===120 ? change(130, 'animtime=0 || !selfanimexist(120)') : ''))),
  ...[[150,'S',150,151],[152,'C',151,153],[154,'A',152,155]].map(([id,posture,action,next])=>
    state(id,`type=${posture}\nmovetype=H\nphysics=N\nctrl=0\nvelset=0,0`,anim(action)+change(next,'hitshakeover',0))),
  ...[[151,'S',150],[153,'C',151],[155,'A',152]].map(([id,posture,action])=>
    state(id,`type=${posture}\nmovetype=H\nphysics=${posture==='A'?'N':posture}\nctrl=0`,anim(action)+controller('HitVelSet','x=1\ny=1','time=0')+
      controller('CtrlSet','value=1','time>=gethitvar(ctrltime)')+
      (posture==='A'?controller('Gravity','')+change(52,'pos y>=0 && vel y>0',0)+change(132,'time>=gethitvar(ctrltime)'):
        controller('VelSet','x=0','time>=gethitvar(slidetime)||hitover')+
        controller('StateTypeSet','statetype=C\nphysics=C','command="holddown"')+controller('StateTypeSet','statetype=S\nphysics=S','command!="holddown"')+
        controller('ChangeState','value=ifelse(statetype=C,131,130)\nctrl=1','hitover')))),
  ...[[5000,'S','ifelse(gethitvar(groundtype)=2,5010,5000)'],[5010,'C','5020'],[5020,'A','5030']].map(([id,posture,base])=>{
    const flight='5030+gethitvar(animtype)',special='5050+gethitvar(animtype)-3';
    const action=orderedPhases?`ifelse(gethitvar(animtype)>=3,ifelse(selfanimexist(${special}),${special},5030),ifelse((gethitvar(fall)||gethitvar(yvel)!=0)&&selfanimexist(${flight}),${flight},${base}+gethitvar(animtype)))`:`ifelse(gethitvar(animtype)>=3,5030,${base}+gethitvar(animtype))`;
    return state(id,`type=${posture}\nmovetype=H\nphysics=N\nctrl=0\nvelset=0,0`,
      controller('ChangeAnim',`value=${action}`,`time=0 && selfanimexist(${action})`)+
      (orderedPhases?controller('StateTypeSet','statetype=A','gethitvar(yvel)!=0 || pos y!=0'):'')+
      controller('ChangeState',`value=${posture==='A'?'5030':`ifelse(gethitvar(fall)||gethitvar(yvel)!=0||pos y!=0,5030,${id+1})`}\nctrl=0`,'hitshakeover'));
  }),
  ...[[5001,'S'],[5011,'C']].map(([id,posture])=>state(id,`type=${posture}\nmovetype=H\nphysics=${posture}\nctrl=0`,
    (orderedPhases?anim('anim'):'')+controller('HitVelSet','x=1','time=0')+controller('VelMul','x=.6','time>=gethitvar(slidetime)')+
    (orderedPhases?anim('anim+5','animtime=0 && (anim=[5000,5002] || anim=[5010,5012] || anim=[5020,5022])'):'')+
    controller('VelSet','x=0','hitover')+controller('DefenceMulSet','value=1','hitover')+change(0,'hitover'))),
  ...[5030,5035].map(id=>{
    const accelerate=controller('VelAdd','y=gethitvar(yaccel)',id===5030?'time>0':orderedPhases?'time>0 || prevstateno!=5030':'1');
    const transition=controller('ChangeState','value=ifelse(gethitvar(fall),5050,5040)\nctrl=0','hitover || (vel y>0 && pos y>=0)')+
      (id===5030?(orderedPhases?controller('ChangeState','value=ifelse(anim=[5050,5059],5050,5035)\nctrl=0','animtime=0'):change(5035,'animtime=0',0)):controller('ChangeState','value=ifelse(gethitvar(fall),5050,5040)\nctrl=0','animtime=0 || !selfanimexist(5035)'));
    return state(id,'type=A\nmovetype=H\nphysics=N\nctrl=0',
      (id===5030?(orderedPhases?anim('anim'):'')+controller('HitVelSet','x=1\ny=1','time=0'):anim(5035))+
      accelerate+transition);
  }),
  state(5040,'type=A\nmovetype=H\nphysics=N\nctrl=1',anim(5040)+controller('VelAdd','y=gethitvar(yaccel)')+
    change(5050,'!alive',0)+change(52,'pos y>=0 && vel y>0',0)+change(50,'animtime=0 || !selfanimexist(5040)')),
  state(5050,'type=A\nmovetype=H\nphysics=N\nctrl=0',(orderedPhases?anim('5050+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)','(time=0 && anim=5030) || (animtime=0 && (anim<5050 || anim>5069))')+anim('anim+10','vel y>Const240p(-2) && anim=[5051,5052]'):anim(5050))+
    controller('SelfState','value=5210','alive && CanRecover && command="recovery"')+
    change(5100,orderedPhases?'vel y>0 && pos y>=ifelse(anim=5050 || anim=5035,const(movement.air.gethit.groundlevel),0)':'pos y>=0 && vel y>0',0)+controller('VelAdd','y=gethitvar(yaccel)',orderedPhases?'time>0 || (prevstateno!=5030 && prevstateno!=5035)':'1')),
  state(5070,'type=A\nmovetype=H\nphysics=N\nctrl=0\nvelset=0,0',anim(5070)+change(5071,'hitshakeover',0)),
  state(5071,'type=A\nmovetype=H\nphysics=N\nctrl=0',
    controller('HitVelSet','x=1\ny=1','time=0')+controller('VelAdd','y=gethitvar(yaccel)')+change(5110,'vel y>0 && pos y>=const(movement.air.gethit.trip.groundlevel)',0)),
  state(5080,'type=L\nmovetype=H\nphysics=N\nctrl=0\nvelset=0,0',anim(5080)+change(5030,'hitshakeover && gethitvar(yvel)!=0',0)+change(5081,'hitshakeover && gethitvar(yvel)=0',0)),
  state(5081,'type=L\nmovetype=H\nphysics=C\nctrl=0',
    controller('HitVelSet','x=1','time=0')+controller('VelSet','x=0','hitover')+change(5110,'hitover',0)),
  state(5100, 'type = L\nmovetype = H\nphysics = N\nctrl = 0'+(orderedPhases?'':'\nvelset = 0,0'),
    controller('PosSet', 'y = 0')+(orderedPhases?controller('PosFreeze','value=1')+controller('VelMul','x=.75','time=0')+controller('VelSet','y=0','time=0'):'')+
    controller('HitFallDamage','',orderedPhases?'time=3':'time=0')+controller('FallEnvShake','','time=0')+
    anim(orderedPhases?'ifelse(selfanimexist(5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)),5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0),5100)':5100)+
    change(5110,'time>=1 && gethitvar(fall.yvel)=0',0)+change(5101,'time>=1 && (animtime=0 || time>=12 || !selfanimexist(5100))',0)),
  state(5101,'type=L\nmovetype=H\nphysics=N\nctrl=0',anim(5160)+controller('HitFallVel','','time=0')+
    controller('PosSet','y=const(movement.down.bounce.offset.y)','time=0')+controller('PosAdd','x=const(movement.down.bounce.offset.x)','time=0')+
    (orderedPhases?controller('PosFreeze','value=1','time=0'):'')+
    controller('VelAdd','y=const(movement.down.bounce.yaccel)',orderedPhases?'time>0':'1')+change(5110,'time>0 && vel y>0 && pos y>=const(movement.down.bounce.groundlevel)',0)),
  state(5110, 'type = L\nmovetype = H\nphysics = N\nctrl = 0',
    controller('PosSet','y=0','time=0')+controller('VelSet','y=0','time=0')+
    (orderedPhases?anim('ifelse(selfanimexist(5170),5170,5110)')+anim(5110,'animtime=0 && anim!=5110')+controller('VelMul','x=const(movement.stand.friction)')+controller('VelSet','x=0','abs(vel x)<const(movement.down.friction.threshold)'):anim(5110))+
    change(5150, '!alive', 0) + change(5120, 'time>=1 && gethitvar(recovertime)<=0', 0)),
  state(5120, (orderedPhases?'type=L\nphysics=N':'type=S\nphysics=S')+'\nmovetype=I\nctrl=0',
    anim(5120) + controller('SelfState','value=0\nctrl=1','animtime = 0 || !selfanimexist(5120)')),
  state(5150, 'type = L\nmovetype = H\nphysics = N\nctrl = 0\nvelset = 0,0', anim(5110)),
  state(5210,'type=A\nmovetype=I\nphysics=N\nctrl=0',anim(5210)+controller('PosFreeze','value=1','time<4')+
    controller('VelMul',orderedPhases?'x=const(velocity.air.gethit.airrecover.mul.x)\ny=const(velocity.air.gethit.airrecover.mul.y)':'x=.5\ny=.2','time=4')+
    controller('VelAdd',orderedPhases?'x=const(velocity.air.gethit.airrecover.add.x)\ny=const(velocity.air.gethit.airrecover.add.y)':'y=Const240p(-4.5)','time=4')+
    controller('NotHitBy','value=SCA',orderedPhases?'time<20':'time<4')+
    (orderedPhases?controller('VelAdd','y=const(movement.air.gethit.airrecover.yaccel)','time>=4')+controller('CtrlSet','value=1','time>=20')+change(52,'pos y>=0 && vel y>0',0):change(50,'time>=4'))),
].join('\n');}
export const COMMON_STATES=commonStates();

export const COMMON_LIMITATIONS = 'Built-in common states cover basic movement, guarding and hit recovery. Supply the original common state file in a full engine ZIP for its scripted states. Engine-level rules still have compatibility gaps.';
