import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {unzipSync,zipSync} from "fflate";
import {rar4} from "../../test/fixtures/rar-fixtures.js";
import {sff} from "../../src/formats.js";

const all=unzipSync(new Uint8Array(readFileSync("public/kfm.zip")));
const raw=Object.entries(all).filter(([path])=>!path.endsWith("/"));
const script=raw.filter(([path])=>path!=="kfm/kfm.sff"&&
  !/\/ending\.|\/intro\./i.test(path));
const art=[["kfm.sff",all["kfm/kfm.sff"]]];
mkdirSync("test-output",{recursive:true});
// Actual stored RAR4 files generated with an independent header encoder
// from the public KFM fixture, not bundled copyrighted Nu13/Tomoka data.
for(const[name,entries] of [
 ["kotlin-kfm-script.rar",script],["kotlin-kfm-sprite.rar",art],
 ["kotlin-kfm-complete.rar",raw]
]){
 const archive=rar4(entries);
 writeFileSync("test-output/"+name,archive);
 console.log(name,archive.length,"bytes",entries.length,"entries");
}
writeFileSync("test-output/kotlin-kfm.zip",zipSync(Object.fromEntries(raw)));

// Public KFM art plus an explicitly synthetic CNS effect. This exercises
// actual compiled Kotlin -> worker -> Canvas effect painting in the browser.
const effectFiles=Object.fromEntries(raw);
effectFiles["kfm/kfm.cns"]=new TextEncoder().encode(
  new TextDecoder("iso-8859-1").decode(effectFiles["kfm/kfm.cns"])+`
[Statedef -2]
[State -2, Kotlin Explod renderer fixture]
type=Explod
trigger1=NumExplod(701)=0
id=701
anim=0
postype=p1
pos=20,-60
bindtime=-1
removetime=-1
scale=.5,.5
sprpriority=-1
`);
writeFileSync("test-output/kotlin-kfm-explod.zip",zipSync(effectFiles));

// Synthetic coordinate metadata, not a rescaled native character. Public KFM
// art lets Chromium verify that complete pixel transforms come from Kotlin.
const highFiles=Object.fromEntries(raw);
const decoder=new TextDecoder("iso-8859-1"), encoder=new TextEncoder();
highFiles["kfm/kfm.def"]=encoder.encode(decoder.decode(highFiles["kfm/kfm.def"])
  .replace(/^localcoord\s*=.*$/mi,"localcoord=1008,756"));
highFiles["kfm/kfm.cns"]=encoder.encode(decoder.decode(highFiles["kfm/kfm.cns"])
  .replace(/^xscale\s*=.*$/mi,"xscale=3.15")
  .replace(/^yscale\s*=.*$/mi,"yscale=3.15")+`
[Statedef -2]
[State -2, Kotlin high-coordinate renderer fixture]
type=Explod
trigger1=NumExplod(702)=0
id=702
anim=0
postype=p1
pos=31.5,-189
bindtime=-1
removetime=-1
scale=1.575,1.575
sprpriority=-1
`);
writeFileSync("test-output/kotlin-kfm-localcoord.zip",zipSync(highFiles));

// Independently authored scaling fixtures use public KFM sprites. Body Size
// differs deliberately, so the browser catches accidental projectile scaling.
for(const doScale of [0,1]) {
 const projectileFiles=Object.fromEntries(raw);
 projectileFiles["kfm/kfm.def"]=encoder.encode(decoder.decode(projectileFiles["kfm/kfm.def"])
  .replace(/^localcoord\s*=.*$/mi,"localcoord=640,480"));
 projectileFiles["kfm/kfm.cns"]=encoder.encode(`[Size]
xscale=2
yscale=.5
proj.doscale=${doScale}
[Statedef 0]
type=S
physics=N
anim=0
ctrl=0
[Statedef -2]
[State -2, scaled projectile]
type=Projectile
trigger1=Time=0
projid=703
projanim=703
projscale=-1.5,.5
offset=0,-120
velocity=0,0
projremovetime=-1
projhits=0
`);
 projectileFiles["kfm/kfm.air"]=encoder.encode(decoder.decode(projectileFiles["kfm/kfm.air"])+`
[Begin Action 703]
0,0,8,-4,-1
`);
 writeFileSync(`test-output/kotlin-kfm-projectile-${doScale}.zip`,zipSync(projectileFiles));
}

// Synthetic layering fixture with public KFM sprites. Actor priority crosses
// a helper, projectile and effect while Chromium records actual Canvas paints.
const priorityFiles=Object.fromEntries(raw);
priorityFiles["kfm/kfm.cns"]=encoder.encode(`[Statedef 0]
type=S
physics=N
anim=0
ctrl=0
sprpriority=2
[Statedef -2]
[State -2, actor priority]
type=SprPriority
triggerall=IsHelper=0
trigger1=1
value=ifelse(Time%60<30,-4,5)
[State -2, helper]
type=Helper
triggerall=IsHelper=0
trigger1=NumHelper=0
stateno=7100
[State -2, projectile]
type=Projectile
triggerall=IsHelper=0
trigger1=Time=0
projanim=0
projhits=0
projremovetime=-1
projsprpriority=0
offset=20,-40
[State -2, effect]
type=Explod
triggerall=IsHelper=0
trigger1=NumExplod(704)=0
id=704
anim=0
postype=p1
pos=0,-60
bindtime=-1
removetime=-1
sprpriority=2
[Statedef 7100]
type=S
physics=N
anim=0
ctrl=0
sprpriority=-3
`);
writeFileSync("test-output/kotlin-kfm-priority.zip",zipSync(priorityFiles));

// Exercise angle arithmetic, mirrored facing, signed scale and AIR offsets
// through imported CNS and real SFF drawImage calls.
const angleFiles=Object.fromEntries(raw);
angleFiles["kfm/kfm.cns"]=encoder.encode(`[Statedef 0]
type=S
physics=N
anim=705
ctrl=0
[Statedef -2]
[State -2, angle set]
type=AngleSet
triggerall=IsHelper=0
trigger1=1
value=ifelse(Time%60<30,30,90)
[State -2, angle add]
type=AngleAdd
triggerall=IsHelper=0
trigger1=1
value=15
[State -2, angle multiply]
type=AngleMul
triggerall=IsHelper=0
trigger1=1
value=2
[State -2, alternate facing]
type=Turn
triggerall=IsHelper=0
trigger1=(Time%60<30 && Facing<0)||(Time%60>=30 && Facing>0)
[State -2, draw angle]
type=AngleDraw
triggerall=IsHelper=0
trigger1=1
scale=2,-.5
`);
angleFiles["kfm/kfm.air"]=encoder.encode(decoder.decode(angleFiles["kfm/kfm.air"])+`
[Begin Action 705]
0,0,8,-4,-1
`);
writeFileSync("test-output/kotlin-kfm-angle.zip",zipSync(angleFiles));

// Repeated fixed placements distinguish disabled push, widened body push and
// expired Width in the real Kotlin worker without browser-side fight logic.
const bodyFiles=Object.fromEntries(raw);
bodyFiles["kfm/kfm.cns"]=encoder.encode(`[Size]
ground.front=15
ground.back=15
air.front=15
air.back=15
[Statedef 0]
type=S
physics=N
anim=706
ctrl=0
[Statedef -2]
[State -2, controlled placement]
type=PosSet
trigger1=1
x=ifelse(Facing=1,-5,5)
y=0
[State -2, alternate push]
type=PlayerPush
trigger1=1
value=(Time%120>=30)&&(Time%120<90)
[State -2, temporary width]
type=Width
trigger1=Time%120<60
player=20,0
edge=20,5
`);
bodyFiles["kfm/kfm.air"]=encoder.encode(decoder.decode(bodyFiles["kfm/kfm.air"])+`
[Begin Action 706]
0,0,0,0,-1
`);
writeFileSync("test-output/kotlin-kfm-body-space.zip",zipSync(bodyFiles));

const guardFiles=Object.fromEntries(raw);
guardFiles["kfm/kfm.cns"]=encoder.encode(`[Statedef 0]
type=S
movetype=I
physics=N
anim=709
ctrl=0
[State 0, attacking side]
type=ChangeState
trigger1=Facing=1
value=200
[State 0, guard proximity read]
type=ChangeAnim
trigger1=1
value=ifelse(InGuardDist,708,709)
[Statedef 200]
type=S
movetype=A
physics=N
anim=709
ctrl=0
[State 200, fixed threat axis]
type=PosSet
trigger1=1
x=0
y=0
[State 200, changing range]
type=AttackDist
trigger1=1
value=ifelse(Time%90<30,1000,0)
`);
guardFiles["kfm/kfm.air"]=encoder.encode(decoder.decode(guardFiles["kfm/kfm.air"])+`
[Begin Action 708]
0,0,0,0,-1
[Begin Action 709]
0,1,0,0,-1
`);
writeFileSync("test-output/kotlin-kfm-guard-distance.zip",zipSync(guardFiles));

const mapFiles=Object.fromEntries(raw);
mapFiles["kfm/kfm.cns"]=encoder.encode(`[Map]
counter=.5
own=2.25
seed=1+2
[Statedef 0]
type=S
physics=N
anim=710
ctrl=0
[Statedef -2]
[State -2, reset cycle]
type=MapSet
triggerall=IsHelper=0
trigger1=Time%120=0
map=counter
value=0
[State -2, local increment]
type=MapAdd
triggerall=IsHelper=0
trigger1=1
map=counter
value=.25
[State -2, helper]
type=Helper
triggerall=IsHelper=0
trigger1=NumHelper=0
stateno=700
pos=0,-80
[State -2, named state animation]
type=ChangeAnim
triggerall=IsHelper=0
trigger1=1
value=ifelse(map(counter)>=30,711,710)
[Statedef 700]
type=S
physics=N
anim=710
ctrl=0
[State 700, own state]
type=MapSet
trigger1=Time=0
map=own
value=9
[State 700, own addition]
type=MapAdd
trigger1=1
map=own
value=.125
[State 700, root initialization]
type=RootMapSet
trigger1=Time=0
map=counter
value=1
[State 700, root increment]
type=RootMapAdd
trigger1=1
map=counter
value=.5
`);
mapFiles["kfm/kfm.air"]=encoder.encode(decoder.decode(mapFiles["kfm/kfm.air"])+`
[Begin Action 710]
0,0,0,0,-1
[Begin Action 711]
0,1,0,0,-1
`);
writeFileSync("test-output/kotlin-kfm-named-maps.zip",zipSync(mapFiles));

const environmentFiles=Object.fromEntries(raw);
environmentFiles["kfm/kfm.cns"]=encoder.encode(`[Statedef 0]
type=S
physics=N
anim=712
ctrl=0
[Statedef -2]
[State -2, shake]
type=EnvShake
trigger1=Time%120=0
time=60
freq=90
ampl=-8
[State -2, color layers]
type=EnvColor
trigger1=Time%120<60
value=12,34,56
time=1
under=Time%120<30
[State -2, foreground art]
type=Explod
trigger1=NumExplod(712)=0
id=712
anim=712
postype=none
pos=0,-45
ontop=1
removetime=-1
[State -2, ordinary art]
type=Explod
trigger1=NumExplod(713)=0
id=713
anim=712
postype=none
pos=50,-45
sprpriority=5
removetime=-1
`);
environmentFiles["kfm/kfm.air"]=encoder.encode(decoder.decode(environmentFiles["kfm/kfm.air"])+`
[Begin Action 712]
0,0,0,0,-1
`);
writeFileSync("test-output/kotlin-kfm-environment.zip",zipSync(environmentFiles));

const fallShakeFiles=Object.fromEntries(raw);
fallShakeFiles["kfm/kfm.cns"]=encoder.encode(`[Statedef 0]
type=S
physics=N
anim=714
ctrl=0
[State 0, impact and deferred fall]
type=HitDef
trigger1=Time=0
damage=0
p2stateno=700
envshake.time=90
envshake.freq=0
envshake.phase=90
envshake.ampl=-6
fall.envshake.time=60
fall.envshake.freq=0
fall.envshake.phase=90
fall.envshake.ampl=-12
[State 0, repeat]
type=ChangeState
trigger1=Time=299
value=0
[Statedef 700]
type=S
movetype=H
physics=N
anim=715
ctrl=0
[State 700, borrowed art]
type=ChangeAnim2
trigger1=Time=0
value=715
[State 700, indicate consumption]
type=ChangeAnim2
trigger1=Time=30
value=716
[State 700, deferred fall shake]
type=FallEnvShake
trigger1=Time>=30
[State 700, return]
type=SelfState
trigger1=Time=140
value=0
`);
fallShakeFiles["kfm/kfm.air"]=encoder.encode(decoder.decode(fallShakeFiles["kfm/kfm.air"])+`
[Begin Action 714]
Clsn1Default:1
Clsn1[0]=-500,-60,500,0
0,0,0,-45,-1
[Begin Action 715]
0,0,0,-45,-1
[Begin Action 716]
0,1,0,-45,-1
`);
writeFileSync("test-output/kotlin-kfm-fall-shake.zip",zipSync(fallShakeFiles));

const boundsFiles=Object.fromEntries(raw);
boundsFiles["kfm/kfm.cns"]=encoder.encode(`[Statedef 0]
type=S
physics=N
anim=717
ctrl=0
[State 0, initially outside arena]
type=PosSet
trigger1=Time=0
x=Facing*300
[State 0, edge and camera policy]
type=ScreenBound
trigger1=1
value=Time>=60
movecamera=0,Time>=60 && Time<120
[State 0, raise the camera target once tracking is enabled]
type=PosSet
trigger1=Time=60
y=-120
[State 0, camera follows]
type=ChangeAnim
trigger1=Time=60
value=718
[State 0, camera frozen]
type=ChangeAnim
trigger1=Time=120
value=719
`);
boundsFiles["kfm/kfm.air"]=encoder.encode(decoder.decode(boundsFiles["kfm/kfm.air"])+`
[Begin Action 717]
0,0,0,0,-1
[Begin Action 718]
0,0,0,-45,-1
[Begin Action 719]
0,1,0,-45,-1
`);
writeFileSync("test-output/kotlin-kfm-screen-bound.zip",zipSync(boundsFiles));

const inputFiles=Object.fromEntries(raw);
inputFiles["kfm/kfm.cmd"]=encoder.encode(`[Command]
name="pressed"
command=F+a
[Command]
name="held"
command=/F+a
[Command]
name="helper_button"
command=/b
`);
inputFiles["kfm/kfm.cns"]=encoder.encode(`[Statedef 0]
type=S
physics=N
anim=720
ctrl=0
[State 0, authored input]
type=AssertInput
trigger1=Time%120<60
flag=F
flag2=a
[State 0, remember real press]
type=VarSet
trigger1=command="pressed"
v=0
value=Time+20
[State 0, command-driven pose]
type=ChangeAnim
trigger1=1
value=ifelse(command="helper_button",727,ifelse(Time<var(0),721,ifelse(command="held",722,723)))
[State 0, keyctrl helper]
type=Helper
trigger1=Time=0
stateno=700
keyctrl=1
pos=0,-90
[Statedef 700]
type=S
physics=N
anim=725
ctrl=0
[State 700, own input]
type=AssertInput
trigger1=1
flag=b
[State 700, isolated command-driven pose]
type=ChangeAnim
trigger1=1
value=ifelse(command="held",727,ifelse(command="helper_button",726,725))
`);
inputFiles["kfm/kfm.air"]=encoder.encode(decoder.decode(inputFiles["kfm/kfm.air"])+`
[Begin Action 720]
0,0,0,-45,-1
[Begin Action 721]
0,0,0,-45,-1
[Begin Action 722]
0,1,0,-45,-1
[Begin Action 723]
0,2,0,-45,-1
[Begin Action 725]
0,0,0,-45,-1
[Begin Action 726]
0,1,0,-45,-1
[Begin Action 727]
0,2,0,-45,-1
`);
writeFileSync("test-output/kotlin-kfm-assert-input.zip",zipSync(inputFiles));

const blendFiles=Object.fromEntries(raw);
const blendModes=[['none'],['add'],['addalpha'],['add1'],['add','128,128'],['sub'],['default'],null,['add','0,256'],['add','0,0']];
blendFiles['kfm/kfm.cns']=encoder.encode(`[Statedef 0]
type=S
physics=N
anim=728
ctrl=0
[State 0, flat pixel reference]
type=EnvColor
trigger1=1
value=40,70,120
under=1
time=1
[State 0, phase]
type=SprPriority
trigger1=1
value=floor((Time%400)/40)-5
`+blendModes.map((spec,index)=>spec?`[State 0, blend ${index}]
type=Trans
trigger1=floor((Time%400)/40)=${index}
trans=${spec[0]}
${spec[1]?`alpha=${spec[1]}`:''}
`:'').join(''));
blendFiles['kfm/kfm.air']=encoder.encode(decoder.decode(blendFiles['kfm/kfm.air'])+`
[Begin Action 728]
0,0,0,-45,-1,,AS64D192
`);
writeFileSync('test-output/kotlin-kfm-trans.zip',zipSync(blendFiles));
const blendBank=sff(all['kfm/kfm.sff']);
const blendSprite=blendBank.decodeWithPalette(blendBank.sprites.findIndex(s=>s.group===0&&s.number===0),1,1);
const blendSamples=[],seenColors=new Set();
for(let y=2;y<blendSprite.h-2;y++)for(let x=2;x<blendSprite.w-2;x++){
  const offset=(y*blendSprite.w+x)*4,color=[...blendSprite.rgba.slice(offset,offset+4)],key=color.join(',');
  if(seenColors.has(key))continue;
  let uniform=true;
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){
    const p=((y+dy)*blendSprite.w+x+dx)*4;
    if(color.some((c,i)=>blendSprite.rgba[p+i]!==c))uniform=false;
  }
  if(!uniform)continue;
  seenColors.add(key);blendSamples.push({x,y,rgba:color});
}
if(!blendSamples.some(s=>s.rgba[3]===0)||blendSamples.filter(s=>s.rgba[3]===255).length<2)throw Error('KFM blend fixture needs transparent and distinct opaque interior pixels');
writeFileSync('test-output/kotlin-trans-samples.json',JSON.stringify({axisX:blendSprite.x,axisY:blendSprite.y,samples:blendSamples}));

const clipboardFiles=Object.fromEntries(raw);
clipboardFiles['kfm/kfm.cns']=encoder.encode(String.raw`[Statedef 0]
type=S
physics=N
anim=730
ctrl=0
[State 0, integer]
type=VarSet
trigger1=Time=0
v=0
value=42
[State 0, floating value]
type=VarSet
trigger1=Time=0
fv=0
value=1.25
[State 0, display]
type=DisplayToClipboard
trigger1=Time%240=0
text="root=%d f=%.2f\n\tquote=\"; 猫 <img id=clipboard-injected src=x onerror=alert(1)> 100%%"
params=var(0),fvar(0)
[State 0, append]
type=AppendToClipboard
trigger1=Time%240=30
text="line=%d"
params=Time%240
[State 0, clear]
type=ClearClipboard
trigger1=Time%240=90
[State 0, append after clear]
type=AppendToClipboard
trigger1=Time%240=150
text="after clear"
[State 0, helper]
type=Helper
trigger1=Time=0
stateno=700
pos=0,-80
[Statedef 700]
type=S
physics=N
anim=730
ctrl=0
[State 700, own message]
type=DisplayToClipboard
trigger1=Time=0
text="helper=%d"
params=var(0)
`);
clipboardFiles['kfm/kfm.air']=encoder.encode(decoder.decode(clipboardFiles['kfm/kfm.air'])+`
[Begin Action 730]
0,0,0,-45,-1
`);
writeFileSync('test-output/kotlin-kfm-clipboard.zip',zipSync(clipboardFiles));

const paletteFiles=Object.fromEntries(raw);
const palettePhases=[{}, {PalFX:'add=20,-30,10'}, {PalFX:'mul=128,256,0'}, {PalFX:'color=0'}, {PalFX:'invertall=1'},
  {PalFX:'sinadd=64,0,-64,16'}, {BGPalFX:'add=15,20,-10'}, {AllPalFX:'invertall=1'},
  {PalFX:'add=10,0,0',BGPalFX:'add=0,20,0',AllPalFX:'mul=128,128,128'}, {}];
paletteFiles['kfm/kfm.cns']=encoder.encode(`[Statedef 0]
type=S
physics=N
anim=731
ctrl=0
[State 0, phase]
type=SprPriority
trigger1=1
value=floor((Time%600)/60)-5
`+['PalFX','AllPalFX','BGPalFX'].map(type=>`[State 0, clear ${type}]
type=${type}
triggerall=Facing=1
trigger1=Time%600=0
time=0
`).join('')+palettePhases.map((phase,index)=>Object.entries(phase).map(([type,params])=>`[State 0, ${type} phase ${index}]
type=${type}
triggerall=Facing=1
trigger1=Time%600=${index*60}
time=60
${params}
`).join('')).join('')+[0,1].map(own=>`[State 0, palette helper ${own}]
type=Helper
triggerall=Facing=1
trigger1=Time=0
stateno=${700+own}
ownpal=${own}
pos=${own?200:-150},-100
`).join('')+`[Statedef 700]
type=S
physics=N
anim=732
ctrl=0
[Statedef 701]
type=S
physics=N
anim=733
ctrl=0
`);
paletteFiles['kfm/kfm.air']=encoder.encode(decoder.decode(paletteFiles['kfm/kfm.air'])+[731,732,733].map(n=>`
[Begin Action ${n}]
0,0,0,-45,-1
`).join(''));
writeFileSync('test-output/kotlin-kfm-palette.zip',zipSync(paletteFiles));

const remapFiles = Object.fromEntries(raw);
remapFiles['kfm/kfm.air'] = paletteFiles['kfm/kfm.air'];
remapFiles['kfm/kfm.cns'] = encoder.encode(`[Statedef 0]
type = S
physics = N
anim = 731
[State 0, phase]
type = SprPriority
trigger1 = 1
value = floor(Time / 60)
[State 0, specific]
type = RemapPal
triggerall = ID = 1
trigger1 = Time = 60
source = 1,1
dest = 1,2
[State 0, wildcard]
type = RemapPal
triggerall = ID = 1
trigger1 = Time = 120
dest = 1,3
[State 0, effect after remap]
type = PalFX
triggerall = ID = 1
trigger1 = Time = 120
time = 60
add = 15,20,0
[State 0, restore authored palette]
type = RemapPal
triggerall = ID = 1
trigger1 = Time = 180
source = 1,1
[State 0, clear]
type = RemapPal
triggerall = ID = 1
trigger1 = Time = 240
` + [0, 1].map(own => `[State 0, helper]
type = Helper
triggerall = ID = 1
trigger1 = Time = 0
stateno = ${700 + own}
ownpal = ${own}
pos = ${own ? 200 : -150},-100
`).join('') + `[Statedef 700]
type = S
physics = N
anim = 732
[Statedef 701]
type = S
physics = N
anim = 733
`);
writeFileSync('test-output/kotlin-kfm-remappal.zip', zipSync(remapFiles));

const pauseFiles = Object.fromEntries(raw);
pauseFiles['kfm/kfm.air'] = encoder.encode(decoder.decode(pauseFiles['kfm/kfm.air']) + `
[Begin Action 772]
0,0,0,-25,-1
`);
pauseFiles['kfm/kfm.cns'] = encoder.encode(`[Statedef 0]
type=S
physics=N
anim=0
velset=1,0
[State 0, super freeze]
type=SuperPause
triggerall=ID=1
trigger1=GameTime=0
time=60
anim=S772
pos=70,0
poweradd=140
`);
writeFileSync('test-output/kotlin-kfm-superpause.zip', zipSync(pauseFiles));

const afterimageFiles=Object.fromEntries(raw);
const trailPhase=(phase,trans='none',duration=-1)=>`[State 0, trail phase ${phase}]
type=AfterImage
trigger1=Time%600=${phase*60}
time=${duration}
length=4
timegap=4
framegap=1
trans=${trans}
palbright=20,0,0
palcontrast=128,256,0
palpostbright=5,10,0
palcolor=${phase===4?0:256}
palinvertall=${phase===4?1:0}
paladd=10,0,0
palmul=.5,1,1
`;
afterimageFiles['kfm/kfm.cns']=encoder.encode(`[Statedef 0]
type=S
physics=N
anim=740
ctrl=0
[State 0, phase]
type=SprPriority
trigger1=1
value=floor((Time%600)/60)-5
[State 0, separated historical positions]
type=PosSet
trigger1=1
x=ifelse(Time%16<4,-220,ifelse(Time%16<8,-80,ifelse(Time%16<12,60,200)))
[State 0, alternate facing]
type=Turn
triggerall=Time>0
trigger1=Time%8=0
`+[0,1,2,3,4,6,8].map(phase=>trailPhase(phase,({1:'add',2:'add1',3:'sub'})[phase]||'none',phase===8?8:-1)).join('')+`
[State 0, current global palette]
type=AllPalFX
trigger1=Time%600=240
time=60
mul=128,256,128
[State 0, stop zero]
type=AfterImageTime
trigger1=Time%600=300
time=0
[State 0, stop one]
type=AfterImageTime
trigger1=Time%600=420
value=1
[State 0, independent helper]
type=Helper
trigger1=Time=0
stateno=700
pos=520,-80
[Statedef 700]
type=S
physics=N
anim=741
ctrl=0
[State 700, own history]
type=AfterImage
trigger1=Time=0
time=-1
length=8
framegap=2
palbright=0,0,0
palcontrast=256,256,256
paladd=0,0,0
palmul=1,1,1
`);
afterimageFiles['kfm/kfm.air']=encoder.encode(decoder.decode(afterimageFiles['kfm/kfm.air'])+[740,741].map(n=>`
[Begin Action ${n}]
0,0,0,-85,-1
`).join(''));
writeFileSync('test-output/kotlin-kfm-afterimage.zip',zipSync(afterimageFiles));

const soundFiles=Object.fromEntries(raw);
const soundControl=(name,type,time,params)=>`[State 0, ${name}]
type=${type}
triggerall=ID=1
trigger1=Time%400=${time}
${params}
`;
soundFiles['kfm/kfm.cns']=encoder.encode(`[Statedef 0]
type=S
physics=N
anim=760
ctrl=0
[State 0, sound phase]
type=SprPriority
trigger1=1
value=floor((Time%400)/40)-4
`+soundControl('left loop','PlaySnd',0,'value=0,0\nchannel=3\nloop=1\nabspan=-160')+
soundControl('right pan','SndPan',40,'channel=3\nabspan=160')+
soundControl('low priority','PlaySnd',80,'value=0,1\nchannel=3\nloop=1\nlowpriority=1\nvolumescale=50')+
soundControl('replace','PlaySnd',120,'value=0,1\nchannel=3\nloop=1\nvolumescale=50\nfreqmul=2\nabspan=0')+
soundControl('stop own','StopSnd',160,'channel=3')+
soundControl('root right','PlaySnd',200,'value=0,0\nchannel=3\nloop=1\nabspan=160')+
soundControl('helper left','Helper',200,'stateno=700\npos=100,-100')+
soundControl('stop root only','StopSnd',240,'channel=3')+
soundControl('stop everyone','StopSnd',280,'channel=-1')+
soundControl('finite sound','PlaySnd',320,'value=0,4\nchannel=4')+
soundControl('restart loop','PlaySnd',360,'value=0,0\nchannel=3\nloop=1\nabspan=0')+`
[Statedef 700]
type=S
physics=N
anim=760
ctrl=0
[State 700, own channel]
type=PlaySnd
trigger1=Time=0
value=0,0
channel=3
loop=1
abspan=-160
`);
soundFiles['kfm/kfm.air']=encoder.encode(decoder.decode(soundFiles['kfm/kfm.air'])+`
[Begin Action 760]
0,0,0,-45,-1
`);
writeFileSync('test-output/kotlin-kfm-sound.zip',zipSync(soundFiles));

const victoryFiles = Object.fromEntries(raw);
victoryFiles['kfm/kfm.cns'] = encoder.encode(`[Quotes]
victory0 = "Fallback"
victory5 = "Good round; <strong>rematch</strong>!\\nReady?"
[Statedef 0]
type = S
physics = N
anim = 0
[State 0, manual hits]
type = HitCount
trigger1 = Time = 0
value = 5
[State 0, add]
type = HitAdd
trigger1 = Time = 1
value = 2
[State 0, finish]
type = LifeSet
trigger1 = RoundState = 2 && ID = 2
value = 0
[State 0, select]
type = VictoryQuote
trigger1 = Win && HitCount = 7
value = 5
`);
writeFileSync('test-output/kotlin-kfm-victory.zip', zipSync(victoryFiles));

for(const side of [0,1]) {
 const files=Object.fromEntries(raw),reverser=side+1;
 files['kfm/kfm.cns']=encoder.encode(`[Statedef 0]
type=S
movetype=A
physics=N
anim=750
ctrl=0
[State 0, counter]
type=ReversalDef
triggerall=ID=${reverser}
trigger1=Time=0
reversal.attr=S,NA
id=77
pausetime=3,5
p1stateno=910
p2stateno=911
[State 0, enemy attack]
type=HitDef
triggerall=ID!=${reverser}
trigger1=Time=0
attr=S,NA
damage=900
[Statedef 910]
type=S
movetype=A
physics=N
anim=751
ctrl=0
movehitpersist=1
[State 910, counter evidence]
type=DisplayToClipboard
trigger1=1
text="role=counter id=%d hit=%d reversed=%d custom=%d targets=%d"
params=ID,MoveHit,MoveReversed,InCustomState,NumTarget
[Statedef 911]
type=S
movetype=H
physics=N
anim=752
ctrl=0
movehitpersist=1
[State 911, borrowed animation]
type=ChangeAnim2
trigger1=Time=0
value=752
[State 911, victim evidence]
type=DisplayToClipboard
trigger1=1
text="role=victim id=%d hit=%d reversed=%d custom=%d targets=%d"
params=ID,MoveHit,MoveReversed,InCustomState,NumTarget
`);
 files['kfm/kfm.air']=encoder.encode(decoder.decode(files['kfm/kfm.air'])+[750,751,752].map(n=>`
[Begin Action ${n}]
Clsn1Default:1
Clsn1[0]=0,-80,200,0
Clsn2Default:1
Clsn2[0]=-10,-80,10,0
0,0,0,${n===752?-85:-45},-1
`).join(''));
 writeFileSync(`test-output/kotlin-kfm-reversal-${side}.zip`,zipSync(files));
}

for(const width of [320,640]) {
 const f=width/320,files=Object.fromEntries(raw);
 files["kfm/kfm.def"]=encoder.encode(decoder.decode(files["kfm/kfm.def"])
  .replace(/^localcoord\s*=.*$/mi,`localcoord=${width},${width*3/4}`));
 files["kfm/kfm.cns"]=encoder.encode(`[Size]
draw.offset=${20*f},${-10*f}
xscale=1.5
yscale=.5
[Statedef 0]
type=S
physics=N
anim=707
ctrl=0
[Statedef -2]
[State -2, face]
type=Turn
trigger1=(Time%120<30 && Facing<0)||(Time%120>=30 && Facing>0)
[State -2, translation]
type=Offset
trigger1=Time%120<60
x=ifelse(Time%120<30,${7.25*f},${-12.5*f})
y=ifelse(Time%120<30,${-3.5*f},${6.25*f})
[State -2, independent rotation]
type=AngleDraw
trigger1=1
value=90
scale=2,-.5
[State -2, attached effect]
type=Explod
trigger1=NumExplod(707)=0
id=707
anim=0
postype=p1
bindtime=-1
removetime=-1
`);
 files["kfm/kfm.air"]=encoder.encode(decoder.decode(files["kfm/kfm.air"])+`
[Begin Action 707]
0,0,8,-4,-1
`);
 writeFileSync(`test-output/kotlin-kfm-offset-${width}.zip`,zipSync(files));
}

// Give the authored common effect a sprite group absent from the fighter SFF.
const fightFxBytes=all["kfm/kfm.sff"].slice();
const fightFxTable=new DataView(fightFxBytes.buffer,fightFxBytes.byteOffset,fightFxBytes.byteLength);
const fightFxSprite=sff(fightFxBytes).sprites.findIndex(sprite=>sprite.group===0&&sprite.number===0);
if(fightFxBytes[15]!==2||fightFxSprite<0)throw Error("Shared effect fixture requires the KFM SFF v2 sprite");
fightFxTable.setUint16(fightFxTable.getUint32(36,true)+fightFxSprite*28,777,true);
writeFileSync("test-output/kotlin-fightfx.zip",zipSync({
  "installation/data/fight.def":encoder.encode("[Info]\nlocalcoord=640,480\n[FightFx]\nscale=1\n"),
  "installation/data/fightfx.sff":fightFxBytes,
  "installation/data/fightfx.air":encoder.encode("[Begin Action 30]\n777,0,0,0,-1\n[Begin Action 52]\n777,0,0,0,55\n[Begin Action 120]\n777,0,0,0,12\n")
}));
const sharedSoundBank=all["kfm/kfm.snd"].slice();
const sharedSoundHeader=new DataView(sharedSoundBank.buffer,sharedSoundBank.byteOffset,sharedSoundBank.byteLength);
sharedSoundHeader.setInt32(sharedSoundHeader.getUint32(20,true)+8,777,true);
writeFileSync("test-output/kotlin-common-sound.zip",zipSync({"installation/data/common.snd":sharedSoundBank}));
const sharedEffectFiles=Object.fromEntries(raw);
sharedEffectFiles["kfm/kfm.cns"]=encoder.encode(`
[Statedef 0]
type=S
physics=N
anim=0
ctrl=0
[State 0, shared foreground]
type=GameMakeAnim
trigger1=Time=0 && Facing=1
value=52
pos=25,-25
[State 0, shared background]
type=MakeDust
trigger1=Time<35 && Facing=1
pos=20,-25
pos2=-20,-25
spacing=18
[State 0, opponent rumble]
type=ForceFeedback
trigger1=Time=0 && Facing=1
waveform=sinesquare
ampl=140,5
time=20
self=0
[State 0, common Explod]
type=Explod
trigger1=GameTime=65
id=777
anim=F52
pos=18,-25
scale=1.5,2
removetime=-1
[State 0, common voice]
type=PlaySnd
trigger1=GameTime=65
value=F777,0
channel=7
loop=1
[State 0, common super flash and sound]
type=SuperPause
trigger1=GameTime=90
time=35
sound=777,0
pos=25,-50
`);
writeFileSync("test-output/kotlin-kfm-shared-effects.zip",zipSync(sharedEffectFiles));
