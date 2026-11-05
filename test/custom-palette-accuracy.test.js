import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TrainingMatch} from '../src/combat.js';
import {FighterRuntime,parseSections} from '../src/runtime.js';
import {COMMON_STATES} from '../src/common.js';
import {EffectsState,transformRgba} from '../src/effects.js';
import {characterSpriteBank,paletteOwner} from '../src/palettes.js';
import {sampleFighterAnimation} from '../src/rendering.js';

const bytes=s=>new TextEncoder().encode(s);
const frame=(number,ticks=-1)=>({group:0,number,x:0,y:0,ticks,clsn1:[],clsn2:[[-10,-40,10,0]]});
function spriteFile(){
  const specs=[...Array.from({length:11},(_,i)=>({group:1,number:i+1,colors:4,rgb:i===0?[255,0,0]:i===1?[0,255,0]:[0,0,255]})),{group:2,number:1,colors:2,rgb:[255,255,0]}];
  const paloff=96,dataoff=paloff+specs.length*16,total=dataoff+2+specs.reduce((sum,p)=>sum+p.colors*4,0),b=new Uint8Array(total),v=new DataView(b.buffer),u=(p,n)=>v.setUint32(p,n,true),h=(p,n)=>v.setUint16(p,n,true);
  b.set(bytes('ElecbyteSpr\0'));b[15]=2;u(36,68);u(40,1);u(44,paloff);u(48,specs.length);u(52,dataoff);h(72,2);h(74,1);b[83]=8;u(88,2);b.set([1,1],dataoff);let offset=2;
  for(const [i,p]of specs.entries()){const at=paloff+i*16;h(at,p.group);h(at+2,p.number);h(at+4,p.colors);u(at+8,offset);u(at+12,p.colors*4);for(let c=0;c<p.colors;c++)b.set([...p.rgb,c?255:0],dataoff+offset+c*4);offset+=p.colors*4;}
  return b;
}
function character(script='',width=320,withSprite=false){
  const c={path:'c.def',def:{info:{name:'Accuracy fixture',localcoord:`${width},240`},files:{cns:'c.cns'}},files:{'c.cns':bytes(`[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n[Statedef 300]\ntype=S\nmovetype=I\nphysics=N\nctrl=0\nanim=0\n${script}`)},animations:[{id:0,frames:[frame(0)]},{id:100,frames:[frame(10,2),frame(11,3)]}]};
  if(withSprite){c.sprite={path:'c.sff'};c.def.files.sprite='c.sff';c.files['c.sff']=spriteFile();}return c;
}
function world(script='',options={}){return new TrainingMatch(character(script),{initialize:false,commonText:COMMON_STATES,pushboxes:false,...options});}
function execute(a,type,params=''){a.execute({...parseSections(`[State Test]\ntype=${type}\n${params}`)[0],type:type.toLowerCase()});}
const color=(fx,a)=>[...transformRgba(new Uint8ClampedArray([10,20,30,255]),fx.paletteFor(a))];
function flush(w,fx){for(const a of w._entities){fx.consume(a.events,{entity:a});a.events=[];}}

for(const type of ['ChangeState','SelfState'])test(`${type} control is applied before destination StateDef control, and -1 preserves it`,()=>{
  const w=world('[Statedef 400]\ntype=S\nphysics=N\nctrl=0\n[Statedef 401]\ntype=S\nphysics=N');w.player.ctrl=0;execute(w.player,type,'value=400\nctrl=1');assert.equal(w.player.ctrl,0);
  execute(w.player,type,'value=401\nctrl=1');assert.equal(w.player.ctrl,1);execute(w.player,type,'value=401\nctrl=-1');assert.equal(w.player.ctrl,1);execute(w.player,type,'value=401\nctrl=-0.5');assert.equal(w.player.ctrl,0);
});

test('StateDef anim=-1 and transition anim=-1 retain foreign AIR ownership and its current clock',()=>{
  const a=character('[Statedef 700]\ntype=S\nphysics=N\nanim=-1'),b=character('[Statedef 701]\ntype=S\nphysics=N\nanim=-1',640),w=world('',{opponentCharacter:b});w.player.animations.set(700,{id:700,frames:[frame(70,5)]});
  const victim=w.opponent;victim.changeState(700,undefined,new FighterRuntime(a));const foreign=victim.stateOwner;foreign.animations.set(700,{id:700,frames:[frame(70,5)]});execute(victim,'ChangeAnim2','value=700');victim.advanceAnimation();execute(victim,'SelfState','value=701\nanim=-1');assert.equal(victim.animationOwner,foreign);assert.equal(victim.frameTime,1);assert.equal(victim.coordinateScale,.5);assert.equal(victim.diagnostics.length,0);
});

test('AnimExist follows ChangeAnim/ChangeAnim2 independently of state ownership; SelfAnimExist stays local',()=>{
  const w=world('[Statedef 700]\ntype=S\nphysics=N',{opponentCharacter:character('',640)}),a=w.player,b=w.opponent;a.animations.set(700,{id:700,frames:[frame(70)]});b.animations.set(800,{id:800,frames:[frame(80)]});b.changeState(700,undefined,a);
  assert.equal(b.evaluate('AnimExist(800)'),1);assert.equal(b.evaluate('AnimExist(700)'),0);execute(b,'ChangeAnim2','value=700');assert.equal(b.evaluate('AnimExist(700)'),1);assert.equal(b.evaluate('SelfAnimExist(700)'),0);assert.equal(b.evaluate('SelfAnimExist(800)'),1);
  execute(b,'SelfState','value=0\nanim=-1');assert.equal(b.evaluate('AnimExist(700)'),0); // StateDef 0 selects local action 0.
});

test('a foreign AIR retained after SelfState still supplies AnimExist until a local ChangeAnim',()=>{
  const w=world('[Statedef 700]\ntype=S\nphysics=N',{opponentCharacter:character('[Statedef 701]\ntype=U\nphysics=N',640)}),a=w.player,b=w.opponent;a.animations.set(700,{id:700,frames:[frame(70)]});b.changeState(700,undefined,a);execute(b,'ChangeAnim2','value=700');execute(b,'SelfState','value=701');assert.equal(b.stateOwner,b);assert.equal(b.evaluate('AnimExist(700)'),1);assert.equal(sampleFighterAnimation(b).number,70);execute(b,'ChangeAnim','value=0');assert.equal(b.evaluate('AnimExist(700)'),0);
});

for(const type of ['ChangeAnim','ChangeAnim2'])test(`${type} invalid elements select the first frame; negative actions use action zero with a diagnostic`,()=>{
  const w=world();for(const elem of [-4,0,3,99]){execute(w.player,type,`value=100\nelem=${elem}`);assert.equal(w.player.frameIndex,0);}execute(w.player,type,'value=100\nelem=2');assert.equal(w.player.frameIndex,1);execute(w.player,type,'value=-2');assert.equal(w.player.anim,0);assert.ok(w.player.diagnostics.some(d=>d.type==='animation-value'));
});

test('failed foreign state transitions preserve ownership, coordinates, control and animation',()=>{
  const w=world('[Statedef 700]\ntype=S\nphysics=N',{opponentCharacter:character('',640)}),b=w.opponent;b.changeState(700,undefined,w.player);const before=[b.stateOwner,b.coordinateScale,b.ctrl,b.animationOwner,b.anim];execute(b,'SelfState','value=999\nctrl=1\nanim=100');assert.deepEqual([b.stateOwner,b.coordinateScale,b.ctrl,b.animationOwner,b.anim],before);
});

test('negative-state and foreign positive-state controller persistence use distinct controller identities',()=>{
  const a=character('[Statedef 700]\ntype=S\nphysics=N\n[State Foreign]\ntype=VarAdd\ntrigger1=1\npersistent=0\nv=0\nvalue=10'),b=character('[Statedef -2]\n[State Own]\ntype=VarAdd\ntrigger1=1\npersistent=0\nv=1\nvalue=1',640),w=world('',{opponentCharacter:b});const owner=new FighterRuntime(a);owner.program.states.get(700).controllers[0].id=w.opponent.program.states.get(-2).controllers[0].id;w.opponent.changeState(700,undefined,owner);w.tick();w.tick();assert.equal(w.opponent.vars[0],10);assert.equal(w.opponent.vars[1],1);
});

test('custom states run own -2, skip own -3/-1, and restore negative states after SelfState',()=>{
  const c=character('[Statedef -3]\n[State Three]\ntype=VarAdd\ntrigger1=1\nv=3\nvalue=1\n[Statedef -2]\n[State Two]\ntype=VarAdd\ntrigger1=1\nv=2\nvalue=1\n[Statedef -1]\n[State One]\ntype=VarAdd\ntrigger1=1\nv=1\nvalue=1'),w=world('[Statedef 700]\ntype=S\nphysics=N',{opponentCharacter:c}),b=w.opponent;b.changeState(700,undefined,w.player);w.tick();assert.deepEqual([b.vars[1],b.vars[2],b.vars[3]],[0,1,0]);execute(b,'SelfState','value=0');w.tick();assert.deepEqual([b.vars[1],b.vars[2],b.vars[3]],[1,2,1]);
});

test('HitDefAttr requires attack MoveType and supports attribute masks and inversion',()=>{
  const w=world();execute(w.player,'HitDef','attr=S,NA');assert.equal(w.player.evaluate('HitDefAttr = SCA, AA'),0);w.player.moveType='A';assert.equal(w.player.evaluate('HitDefAttr = SCA, AA'),1);assert.equal(w.player.evaluate('HitDefAttr != S, SA'),1);assert.equal(w.player.evaluate('HitDefAttr = C, NA'),0);w.player.moveType='H';assert.equal(w.player.evaluate('HitDefAttr != SCA, AA'),1);
});

test('Width omitted parameters are zero, shorthand sets both bars, and mixed syntax is rejected atomically',()=>{
  const w=world();execute(w.player,'Width','edge=7,9');assert.deepEqual(w.player.width,{front:0,back:0,edge:[7,9]});execute(w.player,'Width','player=11,13');assert.deepEqual(w.player.width,{front:11,back:13,edge:[0,0]});execute(w.player,'Width','value=23');assert.deepEqual(w.player.width,{front:23,back:0,edge:[23,0]});execute(w.player,'Width','value=17,19');assert.deepEqual(w.player.width,{front:17,back:19,edge:[17,19]});assert.throws(()=>execute(w.player,'Width','value=3,4\nedge=5,6'),/cannot be combined/);assert.equal(w.player.width.front,17);
});

for(const facing of [1,-1])test(`body/edge distance triggers honor Width, enemy facing and custom-state units (${facing})`,()=>{
  const w=world('[Statedef 700]\ntype=S\nphysics=N',{opponentCharacter:character('',640)}),a=w.player,b=w.opponent;a.pos.x=0;a.facing=facing;b.pos.x=50*facing;b.facing=-facing;execute(a,'Width','player=9,3\nedge=5,2');execute(b,'Width','player=20,8\nedge=0,0');assert.equal(a.evaluate('P2BodyDist X'),31);b.facing=facing;assert.equal(a.evaluate('P2BodyDist X'),37);b.pos.x=-50*facing;assert.equal(a.evaluate('P2BodyDist X'),-49);
  assert.equal(a.evaluate('FrontEdgeBodyDist'),155);assert.equal(a.evaluate('BackEdgeBodyDist'),158);b.changeState(700,undefined,a);execute(b,'Width','player=20,8');b.pos.x=50*facing;b.facing=-facing;assert.equal(a.evaluate('P2BodyDist X'),21);
});

test('ownpal helpers and Explods copy remaps with fresh PalFX; global PalFX still reaches them',()=>{
  const w=world(),fx=new EffectsState(),p=w.player;execute(p,'RemapPal','source=1,1\ndest=1,2');execute(p,'PalFX','time=3\nadd=100,0,0');const h=w.spawnHelper(p,{stateno:300,ownpal:1});execute(p,'Explod','anim=0\nownpal=1\nremovetime=10');const e=p.explods[0];flush(w,fx);assert.deepEqual(color(fx,h),[10,20,30,255]);assert.deepEqual(color(fx,e),[10,20,30,255]);assert.deepEqual(h.paletteRemaps.get('1,1'),[1,2]);assert.deepEqual(e.paletteRemaps.get('1,1'),[1,2]);execute(p,'AllPalFX','time=3\nadd=0,10,0');flush(w,fx);assert.deepEqual(color(fx,h),[10,30,30,255]);
});

test('a shared helper PalFX controller is ignored while independent helper PalFX remains local',()=>{
  const w=world(),fx=new EffectsState(),shared=w.spawnHelper(w.player,{stateno:300}),own=w.spawnHelper(w.player,{stateno:300,ownpal:1});execute(shared,'PalFX','time=4\nadd=100,0,0');execute(own,'PalFX','time=4\nadd=0,100,0');flush(w,fx);assert.deepEqual(color(fx,shared),[10,20,30,255]);assert.deepEqual(color(fx,w.player),[10,20,30,255]);assert.deepEqual(color(fx,own),[10,120,30,255]);
});

test('shared palette effects applied by a hit resolve to the actual working palette owner',()=>{
  const w=world(),fx=new EffectsState(),h=w.spawnHelper(w.player,{stateno:300});fx.consume([{type:'palfx',time:2,add:[100,0,0]}],{entity:h});assert.equal(paletteOwner(h),w.player);assert.deepEqual(color(fx,w.player),[110,20,30,255]);assert.deepEqual(color(fx,h),[110,20,30,255]);fx.advance();fx.advance();assert.deepEqual(color(fx,h),[10,20,30,255]);
});

test('helper-created projectiles share the creator palette family, and ownpal projectiles copy remaps without PalFX',()=>{
  const w=world(),fx=new EffectsState(),h=w.spawnHelper(w.player,{stateno:300,ownpal:1});execute(h,'RemapPal','source=1,1\ndest=1,2');execute(h,'PalFX','time=4\nadd=0,100,0');const shared=w.spawnProjectile(h,{projanim:0}),own=w.spawnProjectile(h,{projanim:0,ownpal:1});flush(w,fx);assert.equal(shared.owner,w.player);assert.equal(paletteOwner(shared),h);assert.deepEqual(shared.paletteRemaps.get('1,1'),[1,2]);assert.deepEqual(own.paletteRemaps.get('1,1'),[1,2]);assert.deepEqual(color(fx,shared),[10,120,30,255]);assert.deepEqual(color(fx,own),[10,20,30,255]);execute(h,'RemapPal','source=1,1\ndest=1,3');assert.deepEqual(shared.paletteRemaps.get('1,1'),[1,3]);assert.deepEqual(own.paletteRemaps.get('1,1'),[1,2]);
});

test('projectiles retain an independent destroyed creator palette until their visuals are retired',()=>{
  const w=world(),fx=new EffectsState(),h=w.spawnHelper(w.player,{stateno:300,ownpal:1});execute(h,'PalFX','time=3\nadd=0,100,0');const p=w.spawnProjectile(h,{projanim:0});flush(w,fx);execute(h,'DestroySelf');w.tick();fx.cleanup([...w.entities,p]);assert.equal(fx.palettes.has(h),true);assert.deepEqual(color(fx,p),[10,120,30,255]);fx.advance();fx.advance();fx.advance();assert.deepEqual(color(fx,p),[10,20,30,255]);fx.cleanup(w.entities);assert.equal(fx.palettes.size,0);
});

test('nested shared helpers stop palette inheritance at their nearest independent ancestor',()=>{
  const w=world(),fx=new EffectsState(),a=w.spawnHelper(w.player,{stateno:300,ownpal:1}),b=w.spawnHelper(a,{stateno:300}),c=w.spawnHelper(b,{stateno:300});execute(a,'PalFX','time=5\nadd=0,100,0');execute(w.player,'PalFX','time=5\nadd=100,0,0');flush(w,fx);assert.equal(paletteOwner(c),a);assert.deepEqual(color(fx,c),[10,120,30,255]);
});

test('RemapPal validates source/destination existence and color depth before changing working mappings',()=>{
  const w=world('',{opponentCharacter:character('',320,true)}),p=w.opponent;execute(p,'RemapPal','source=1,1\ndest=1,2');const before=[...p.paletteRemaps];for(const parameters of ['source=9,9\ndest=1,2','source=1,1\ndest=9,9','source=1,1\ndest=2,1','source=-2,0\ndest=1,2'])assert.throws(()=>execute(p,'RemapPal',parameters),/RemapPal/);assert.deepEqual([...p.paletteRemaps],before);
});

test('RemapPal is nontransitive, and wildcard resets can exempt one source without clearing other sources',()=>{
  const c=character('',320,true),w=new TrainingMatch(c,{initialize:false,pushboxes:false}),p=w.player,bank=characterSpriteBank(c);execute(p,'RemapPal','source=1,1\ndest=1,2');execute(p,'RemapPal','source=1,2\ndest=1,3');assert.deepEqual([...bank.decodeWithPalette(0,...p.paletteRemaps.get('1,1')).rgba.slice(0,4)],[0,255,0,255]);
  execute(p,'RemapPal','source=-1,0\ndest=1,3');execute(p,'RemapPal','source=1,1\ndest=-1,0');assert.deepEqual(p.paletteRemaps.get('*'),[1,3]);assert.deepEqual(p.paletteRemaps.get('1,1'),[1,1]);execute(p,'RemapPal','source=-1,0\ndest=-1,0');assert.equal(p.paletteRemaps.size,0);
});

test('real palette catalog enforces eight remaps, permits replacement and frees removed slots',()=>{
  const w=new TrainingMatch(character('',320,true),{initialize:false,pushboxes:false}),p=w.player;for(let i=1;i<=8;i++)execute(p,'RemapPal',`source=1,${i}\ndest=1,11`);execute(p,'RemapPal','source=1,9\ndest=1,11');assert.equal(p.paletteRemaps.size,8);assert.ok(p.diagnostics.some(d=>d.type==='resource-limit'));execute(p,'RemapPal','source=1,8\ndest=-1,0');execute(p,'RemapPal','source=1,9\ndest=1,11');assert.equal(p.paletteRemaps.size,8);assert.ok(p.paletteRemaps.has('1,9'));
});

test('palette banks are reused across validation and browser rendering, while separate characters stay isolated',()=>{
  const a=character('',320,true),b=character('',320,true);assert.equal(characterSpriteBank(a),characterSpriteBank(a));assert.notEqual(characterSpriteBank(a),characterSpriteBank(b));
});

for(const type of ['PalFX','AllPalFX','BGPalFX'])test(`${type} coerces integer parameters and fills omitted vector components independently`,()=>{
  const w=world(),fx=new EffectsState();execute(w.player,type,'time=2.9\nadd=20.9\nmul=128.9,-2\ncolor=300.2\nsinadd=40.9,0,0,4.9');const event=w.player.events.at(-1);assert.equal(event.time,2);assert.deepEqual(event.add,[20,0,0]);assert.deepEqual(event.mul,[128,0,256]);assert.deepEqual(event.sinadd,[40,0,0,4]);assert.equal(event.color,256);flush(w,fx);const palette=type==='BGPalFX'?fx.backgroundPalette:fx.paletteFor(w.player);assert.deepEqual([...transformRgba(new Uint8ClampedArray([100,120,140,255]),palette)],[60,0,140,255]);
});

test('negative sine periods run the reverse wave, without changing alpha',()=>{
  const fx=new EffectsState(),p={};fx.consume([{type:'palfx',time:5,sinadd:[40,0,0,-4]}],{entity:p});fx.advance();assert.deepEqual(color(fx,p),[0,20,30,255]);
});

test('one-component RemapPal pairs default the item number to zero',()=>{
  const w=world();execute(w.player,'RemapPal','source=1\ndest=2');assert.deepEqual([...w.player.paletteRemaps],[['1,0',[2,0]]]);execute(w.player,'RemapPal','source=1,0\ndest=-1,-99');assert.equal(w.player.paletteRemaps.size,0);
});

test('invalid helper/projectile/Explod remappal keeps its valid creation palette and reports the error',()=>{
  const w=new TrainingMatch(character('',320,true),{initialize:false,pushboxes:false}),p=w.player;execute(p,'RemapPal','source=1,1\ndest=1,2');const h=w.spawnHelper(p,{stateno:300,ownpal:1,remappal:[9,9]}),shot=w.spawnProjectile(p,{projanim:0,ownpal:1,remappal:[9,9]});execute(p,'Explod','anim=0\nownpal=1\nremappal=9,9');const e=p.explods[0];for(const actor of [h,shot,e])assert.deepEqual(actor.paletteRemaps.get('1,1'),[1,2]);assert.ok(h.diagnostics.some(d=>d.type==='palette'));assert.ok(shot.diagnostics.some(d=>d.type==='palette'));assert.ok(p.diagnostics.some(d=>d.type==='palette'));assert.equal(w.projectiles.length,1);assert.equal(p.explods.length,1);
});
