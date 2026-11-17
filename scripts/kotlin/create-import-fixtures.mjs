import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
import {unzipSync,zipSync} from "fflate";
import {rar4} from "../../test/fixtures/rar-fixtures.js";

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
