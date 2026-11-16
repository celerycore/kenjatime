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
