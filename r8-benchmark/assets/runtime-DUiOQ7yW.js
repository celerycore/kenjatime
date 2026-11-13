const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-CoWh3Mjc.js","./core-D4aOvGxP.js","./core-DJfXUo-H.css","./model-stage-BiLw1IvL.js"])))=>i.map(i=>d[i]);
import{f as pr,g as ou,h as lu,r as cu,c as Lo,i as br,j as hu,S as uu,k as du,F as _l,l as fu,m as pu,o as mu,q as gu,t as Vt,v as Jc,w as $r,x as _u,E as Kr,y as vl,z as xl,B as ts,U as vu,_ as No,C as Da,D as xu,G as yu,H as Su,J as Mu,K as bu,L as yl,N as Eu,O as Tu,P as wu,Q as Au,R as Ru,T as Sl,V as Cu}from"./core-D4aOvGxP.js";const Pu=Object.freeze({id:"mugen-1.1",reference:"Elecbyte M.U.G.E.N 1.1 Beta 1 P1 (2013)",status:"target-unverified",certified:!1,referenceStrategy:"black-box golden traces from lawful local reference runs",extendedDialect:"ikemen-go"});function Iu(s){var i,n;const e=(n=(i=s==null?void 0:s.def)==null?void 0:i.info)==null?void 0:n.mugenversion;return e==null?null:String(e).trim()||null}function Lu(s,e=new Map){if(!Array.isArray(s))throw Error("Compatibility report requires a character list.");return{...Pu,characters:s.map(t=>{const i=e.get(t),n=(i==null?void 0:i.diagnostics)||[],r=(i==null?void 0:i.sources)||[];return{path:(t==null?void 0:t.path)||null,declaredMugenVersion:Iu(t),cnsStateFiles:r.filter(a=>/\.(?:cns|cmd)$/i.test(a)).length,ikemenZssFiles:r.filter(a=>/\.zss$/i.test(a)).length,fatalDiagnostics:n.filter(a=>a.fatal===!0).length,duplicateGlobalStates:n.filter(a=>a.type==="mugen11-duplicate-global").length,unsupportedDiagnostics:n.filter(a=>/^unsupported/.test(a.type||"")||a.type==="missing-file").length,traceVerified:!1}})}}const vn=(s,e=[0,0])=>Array.isArray(s)?[Number(s[0]??e[0]),Number(s[1]??e[1])]:s===void 0?[...e]:[Number(s),e[1]];class Nu extends Map{constructor(e){super(),this.base=e}get(e){var t;return super.has(e)?super.get(e):(t=this.base)==null?void 0:t.get(e)}has(e){var t;return super.has(e)||!!((t=this.base)!=null&&t.has(e))}}class is{constructor(e,t,{id:i}={}){var o;this.creator=e,this.owner=e.root||e,this.root=this.owner,this.isProjectile=!0,this.world=e.world,this.id=i,this.projId=Math.max(0,Math.trunc(t.projid??0)),this.teamSide=e.teamSide,this.character=e.character,this.coordinateScale=e.coordinateScale,this.baseCoordinateScale=this.coordinateScale,this.paletteParent=pr(e),this.guardDistance=e.constant("size.proj.attack.dist")*e.coordinateScale,this.animations=e.animations,this.program={...e.program,constants:new Nu(e.program.constants)},this.spec=t,this.events=[],this.diagnostics=[],this.asserted=new Set,Number(t.projid)<0&&this.diagnostic("projectile-id","Negative ProjID was clamped to 0."),Object.assign(this,ou(e,t,!0));const n=vn(t.projscale,[1,1]),r=e.constant("size.proj.doscale")!==0;this.program.constants.set("size.xscale",n[0]*(r?e.constant("size.xscale"):1)),this.program.constants.set("size.yscale",n[1]*(r?e.constant("size.yscale"):1)),this.program.constants.set("size.draw.offset.x",0),this.program.constants.set("size.draw.offset.y",0);const a=vn(t.velocity);if(this.vel={x:a[0]*this.coordinateScale,y:a[1]*this.coordinateScale},this.accel=vn(t.accel).map(l=>l*this.coordinateScale),this.velmul=vn(t.velmul,[1,1]),this.heightBounds=vn(t.projheightbound,[-240/this.coordinateScale,1/this.coordinateScale]).map(l=>l*this.coordinateScale),this.edgeBound=(t.projedgebound??40/this.coordinateScale)*this.coordinateScale,this.stageBound=(t.projstagebound??40/this.coordinateScale)*this.coordinateScale,this.removeTime=t.projremovetime??-1,this.anim=Math.trunc(t.projanim??0),this.frameIndex=0,this.frameTime=0,this.collisionFrame=null,this.hitDef=t.hitDef,this.proximityHitDef=t.hitDef,this.hitPauseTime=0,this.hitCount=0,this.moveType="A",this.stateType=(((o=this.hitDef)==null?void 0:o.attr)||"S")[0].toUpperCase(),this.priority=Math.max(1,Math.trunc(t.projpriority??1)),this.sprPriority=t.projsprpriority??3,this.remainingHits=Math.max(0,Math.trunc(t.projhits??1)),this.missTime=Math.max(0,Math.trunc(t.projmisstime??0)),this.pauseMoveTime=Math.max(0,t.pausemovetime||0),this.superMoveTime=Math.max(0,t.supermovetime||0),this.ownPal=!!t.ownpal,this.time=0,this.removing=!1,this.removed=!1,this.activeTicks=0,this.nextHitAge=0,this.drawVisible=!0,this._inTick=!1,this._paletteRemaps=lu(e.paletteRemaps),this.ownPal&&t.remappal!==void 0)try{cu(this._paletteRemaps,this.character,t.remappal)}catch(l){this.diagnostic("palette",l.message)}this.attackMultiplier=e.attackMultiplier,this.animations.has(this.anim)||(this.diagnostic("missing-animation",`Projectile animation ${this.anim} does not exist.`),this.removed=!0)}get currentFrame(){var e;return((e=this.animations.get(this.anim))==null?void 0:e.frames[this.frameIndex])||null}get life(){return this.removed||this.removing?0:1}get power(){return this.owner.power}set power(e){this.owner.power=e}get maxPower(){return this.owner.maxPower}get targets(){return this.owner.targets}get targetHitIds(){return this.owner.targetHitIds}get paletteRemaps(){return this.ownPal?this._paletteRemaps:this.paletteParent.paletteRemaps}constant(e){const t=this.program.constants.get(e);return Array.isArray(t)?t[0]:t}changeState(){return this.diagnostic("unsupported-projectile","A projectile cannot enter a player state."),!1}diagnostic(e,t){this.diagnostics.some(i=>i.message===t)||this.diagnostics.push({type:e,message:t,source:this.spec.source,line:this.spec.line})}record(e){var i;const t=this.owner.projectileHistory;t.push({type:e,projId:this.projId,tick:((i=this.world)==null?void 0:i.ticks)??this.time});for(let n=t.length-2;n>=0;n--)t[n].type===e&&t[n].projId===this.projId&&t.splice(n,1);t.length>4096&&(t.shift(),this.diagnostic("resource-limit","Projectile history exceeded 4096 distinct ID/event pairs."))}canHit(){return!this.removed&&!this.removing&&!!this.hitDef&&this.activeTicks>=this.nextHitAge&&this.remainingHits>0}onContact({guarded:e=!1,defer:t=!1}={}){this.record(e?"guarded":"hit"),this._contactPending=!0,this.hitPauseTime>0&&(this._holdCollisionFrame=!0),t||this.finishContacts()}finishContacts(){var e;this._contactPending&&(this._contactPending=!1,this.remainingHits--,this.nextHitAge=this.activeTicks+((e=this.world)!=null&&e.orderedPhases?Math.max(1,this.missTime):this.missTime+1),this.spec.projremove!==0&&this.remainingHits<=0&&this.remove("hit"))}cancel(){!this.removing&&!this.removed&&(this.record("cancel"),this.hitPauseTime=0,this.remove("cancel"))}clash(e){var t,i;this.priority>e.priority?this.priority--:this.remainingHits--,this.remainingHits<=0?this.cancel():this.hitPauseTime=Math.max(this.hitPauseTime,((i=(t=this.hitDef)==null?void 0:t.pauseTime)==null?void 0:i[0])||0)}remove(e="expire"){if(!(this.removing||this.removed)){if(this.removing=!0,this.hitDef=null,this.removalReason=e,this._removeAtLoopEnd=this._loopedThisTick,this.hitPauseTime>0){this._holdCollisionFrame=!0;return}this.beginRemoval()}}beginRemoval(){var l;this.removalStarted=!0;const e=this.removalReason,t=this.spec.projhitanim??-1,i=this.spec.projremanim??t,n=e==="hit"?t:e==="cancel"?this.spec.projcancelanim??i:i,r=vn(this.spec.remvelocity);if(this.vel={x:r[0]*this.coordinateScale,y:r[1]*this.coordinateScale},n<0){this.removed=!0,this.drawVisible=!1;return}let a=!1;if(this.animations.has(n)?Math.trunc(n)!==this.anim&&(a=!0,this._loopedThisTick=!1,this.anim=Math.trunc(n),this.frameIndex=this.frameTime=0):this.diagnostic("missing-animation",`Projectile removal animation ${n} does not exist; retaining action ${this.anim}.`),(a||!this.collisionFrame)&&(this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime),!a&&this._removeAtLoopEnd&&this._inTick){this.removed=!0,this.drawVisible=!1;return}const o=((l=this.animations.get(this.anim))==null?void 0:l.frames)||[];if(o.some(c=>c.ticks<0)||o.reduce((c,h)=>c+h.ticks,0)<=0){this.removed=!0,this.drawVisible=!1;return}this.drawVisible=!!this.collisionFrame,a&&!this._inTick?this.advanceFrame():!a&&!this._inTick&&this._loopedThisTick&&(this.removed=!0)}advanceFrame(){const e=this.currentFrame,t=this.animations.get(this.anim);e&&e.ticks>=0&&++this.frameTime>=Math.max(1,e.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=t.frames.length&&(this._loopedThisTick=!0,this.animationLooped=!0,this.removing&&(this.removed=!0),this.frameIndex=t.loopStart||0))}tick({paused:e=!1}={}){var t,i,n;if(this.events=[],this._activeThisTick=!1,this.removed){this.drawVisible=!1;return}if(!e){if(this.drawVisible=!0,this._holdCollisionFrame||this.captureFrame(),this.hitPauseTime>0){this.hitPauseTime--;return}if(this._holdCollisionFrame=!1,this._inTick=!0,this._loopedThisTick=!1,this.removing&&!this.removalStarted&&this.beginRemoval(),!this.removing){const r=this.heightBounds,a=this.edgeBound,o=this.stageBound,l=((t=this.world)==null?void 0:t.leftBound)??-160,c=((i=this.world)==null?void 0:i.rightBound)??160,h=(n=this.world)==null?void 0:n.view,f=(h==null?void 0:h.left)??l,u=(h==null?void 0:h.right)??c,d=this.removeTime,m=this.vel.x*this.facing;(d>=0&&this.time>=d||d<=-2&&this.animationLooped||this.pos.x<f-a||this.pos.x>u+a||m<0&&this.pos.x<l-o||m>0&&this.pos.x>c+o||this.vel.y<0&&this.pos.y<r[0]||this.vel.y>0&&this.pos.y>r[1])&&this.remove()}this.removed||(this.captureFrame(),this._activeThisTick=!0,this.activeTicks++,this.pos.x+=this.vel.x*this.facing,this.pos.y+=this.vel.y,this.removing||(this.vel.x=(this.vel.x+this.accel[0])*this.velmul[0],this.vel.y=(this.vel.y+this.accel[1])*this.velmul[1]),this.advanceFrame(),this.time++),this._inTick=!1}}finishMovementAllowance({paused:e=!1}={}){var t,i,n;if(!(e||!this._activeThisTick||this._hitPausedThisTick||this.hitPauseTime>0)){if((t=this.world)!=null&&t.orderedPhases){((i=this.world.pause)==null?void 0:i.remaining)>0&&(this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1)),((n=this.world.superPause)==null?void 0:n.remaining)>0&&(this.superMoveTime=Math.max(0,this.superMoveTime-1));return}this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1),this.superMoveTime=Math.max(0,this.superMoveTime-1)}}captureFrame(){this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime}}const Du=s=>{if(s[0].life<=0&&s[1].life<=0)return"draw";if(s[0].life<=0)return"opponent";if(s[1].life<=0)return"player";const e=s[0].life*s[1].maxLife-s[1].life*s[0].maxLife;return e===0?"draw":e>0?"player":"opponent"};class Uu{constructor({roundsToWin:e=2,roundTime:t=99,preIntro:i=30,introHold:n=30,overTime:r=60,resultTime:a=90,maxIntroTime:o=900,maxOutroTime:l=300,autoAdvance:c=!0,endless:h=!1,maxNoKOTime:f=180,fightStartLockTicks:u=0}={}){for(const[d,m]of Object.entries({roundsToWin:e,roundTime:t,preIntro:i,introHold:n,overTime:r,resultTime:a,maxIntroTime:o,maxOutroTime:l,maxNoKOTime:f,fightStartLockTicks:u}))if(!Number.isFinite(m)||m<0)throw Error(`Invalid match rule ${d}.`);if(e<1||e>99||t>3600||o>36e3||l>36e3||f<1||f>36e3||u>36e3)throw Error("Match rule exceeds supported bounds.");this.rules={roundsToWin:Math.trunc(e),roundTime:t,preIntro:Math.trunc(i),introHold:Math.trunc(n),overTime:Math.trunc(r),resultTime:Math.trunc(a),maxIntroTime:Math.trunc(o),maxOutroTime:Math.trunc(l),maxNoKOTime:Math.trunc(f),fightStartLockTicks:Math.trunc(u),autoAdvance:c,endless:h===!0},this.roundNo=1,this.roundsExisted=0,this.wins={player:0,opponent:0},this.matchOver=!1,this.roundWinner=null,this.reason=null,this.startRound()}startRound(){this.roundState=0,this.phaseTime=0,this.timeLeft=this.rules.endless?-1:this.rules.roundTime?Math.round(this.rules.roundTime*60):-1,this.roundWinner=null,this.reason=null,this._awarded=!1,this.zeroLifeNoKOTicks=[0,0]}step({players:e,paused:t=!1,intro:i=!1,introPending:n=!1,victoryPending:r=!1,roundNotOver:a=!1,timerFreeze:o=!1,noKO:l=[!1,!1]}={}){const c=[];if(t)return c;if(this.roundState===0)return this.phaseTime++,this.phaseTime<this.rules.preIntro||n&&this.phaseTime<this.rules.maxIntroTime||(this.roundState=1,this.phaseTime=0,c.push({type:"round",roundNo:this.roundNo})),c;if(this.roundState===1)return this.phaseTime++,this.phaseTime>=this.rules.introHold&&(!i||this.phaseTime>=this.rules.maxIntroTime)&&(this.roundState=2,this.phaseTime=0,c.push({type:"fight",roundNo:this.roundNo})),c;if(this.roundState===2){if(this.phaseTime++,this.phaseTime<=this.rules.fightStartLockTicks)return c;const h=e.some((f,u)=>f.life>0?(this.zeroLifeNoKOTicks[u]=0,!1):l[u]?(this.zeroLifeNoKOTicks[u]++,this.zeroLifeNoKOTicks[u]>=this.rules.maxNoKOTime):(this.zeroLifeNoKOTicks[u]=0,!0));return!o&&this.timeLeft>0&&this.timeLeft--,(h||this.timeLeft===0)&&(this.roundWinner=Du(e),this.reason=h?e.every(f=>f.life<=0)?"double-ko":"ko":"time",this.roundState=3,this.phaseTime=0,c.push({type:"round-over",winner:this.roundWinner,reason:this.reason})),c}if(this.roundState===3)return this.phaseTime++,a&&this.phaseTime<this.rules.maxOutroTime||this.phaseTime>=this.rules.overTime&&(!this._awarded&&this.roundWinner!=="draw"&&(this.wins[this.roundWinner]++,this._awarded=!0),this.matchOver=!this.rules.endless&&Object.values(this.wins).some(h=>h>=this.rules.roundsToWin),this.roundState=4,this.phaseTime=0,c.push({type:"result",winner:this.roundWinner,reason:this.reason,matchOver:this.matchOver})),c;if(this.roundState===4&&!this.matchOver&&this.rules.autoAdvance){this.phaseTime++;const h=this.phaseTime>=this.rules.resultTime,f=!r&&!a||this.phaseTime>=this.rules.maxOutroTime;h&&f&&(this.roundNo++,this.roundsExisted++,this.startRound(),c.push({type:"next-round",roundNo:this.roundNo}))}return c}}const Ht=["a","b","c","x","y","z","s"],ms=["U","D","B","F","UB","UF","DB","DF"],Fu=new Set(["U","D","L","R",...Ht]),Er=3600,Ml=128,bl=4096;function Ou(s){let e=null;for(let t=0;t<s.length;t++){const i=s[t];if((i==='"'||i==="'")&&(!e||e===i))e=e?null:i;else if(i===";"&&!e)return s.slice(0,t).trim()}return s.trim()}function Zr(s){const e=s.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);return e?e[1]??e[2]:s}function Bu(s){let e=s.replace(/\s/g,"");if(!e)throw Error("Empty command symbol.");const t={source:s,strict:!1,hold:!1,release:!1,charge:0,tolerant:!1},i=new Set;for(;/^[>\/~$]/.test(e);){const r=e[0];if(i.has(r))throw Error(`Repeated ${r} modifier in ${s}.`);if(i.add(r),e=e.slice(1),r===">"&&(t.strict=!0),r==="/"&&(t.hold=!0),r==="$"&&(t.tolerant=!0),r==="~"){t.release=!0;const a=e.match(/^\d+/);if(a){if(t.charge=Number(a[0]),!Number.isSafeInteger(t.charge)||t.charge>Er)throw Error(`Charge duration exceeds the ${Er}-tick runtime limit.`);e=e.slice(a[0].length)}}}if(t.hold&&t.release)throw Error(`Hold and release cannot be combined in ${s}.`);const n=e.split("+");if(n.some(r=>!r)||new Set(n).size!==n.length)throw Error(`Invalid simultaneous input ${s}.`);if(n.length===1&&ms.includes(n[0]))t.kind="direction",t.keys=n,t.key=(t.tolerant?"$":"")+n[0];else if(n.every(r=>Ht.includes(r))){if(t.tolerant)throw Error(`The $ modifier is only valid on directions: ${s}.`);t.kind="button",t.keys=n}else if(n.filter(r=>ms.includes(r)).length===1&&n.every(r=>ms.includes(r)||Ht.includes(r)))t.kind="chord",t.keys=n.map(r=>ms.includes(r)&&t.tolerant?"$"+r:r);else throw Error(`Unsupported command symbol ${s}. Directions are uppercase and buttons are lowercase.`);return t}function ku(s){const e=s.split(",").map(Bu),t=[];for(const i of e){const n=t.at(-1);(n==null?void 0:n.kind)==="direction"&&i.kind==="direction"&&n.key===i.key&&!n.hold&&!n.release&&!i.hold&&!i.release?(t.push({...i,source:`>~${i.key}`,strict:!0,release:!0,charge:0}),t.push({...i,strict:!0})):t.push(i)}if(t.length>Ml)throw Error(`Command exceeds the ${Ml}-symbol runtime limit.`);return t}function Do(s){const e=[];let t;for(const[c,h]of String(s).replace(/^\uFEFF|^ï»¿/,"").split(/\r?\n/).entries()){const f=Ou(h),u=f.match(/^\[([^\]]+)\]$/);if(u)t={name:u[1].trim().toLowerCase(),line:c+1,values:{}},e.push(t);else if(t){const d=f.indexOf("=");d>0&&(t.values[f.slice(0,d).trim().toLowerCase()]=f.slice(d+1).trim())}}const i=[],n={time:15,bufferTime:1},r=Object.fromEntries(Ht.map(c=>[c,c])),a=(c,h,f=Zr(c.values.name??""))=>{i.push({kind:"command",name:f,line:c.line,message:h})};function o(c,h,f,u,d){if(c==null)return h;if(!/^[-+]?\d+$/.test(c.trim())||!Number.isSafeInteger(Number(c)))throw Error(`${u} must be an integer.`);const m=Math.max(1,Number(c));if(m>d){if(u==="buffer.time"||u==="command.buffer.time")return d;throw Error(`${u} exceeds the ${d}-tick runtime limit.`)}return m}for(const c of e){if(c.name==="defaults")try{n.time=o(c.values["command.time"],n.time,c,"command.time",Er),n.bufferTime=o(c.values["command.buffer.time"],n.bufferTime,c,"command.buffer.time",30)}catch(h){a(c,h.message)}if(c.name==="remap")for(const[h,f]of Object.entries(c.values)){const u=Zr(f);!Ht.includes(h)||u&&!Ht.includes(u)?a(c,`Unsupported button remap ${h} = ${f}.`):r[h]=u}}const l=[];for(const c of e){if(c.name!=="command")continue;if(l.length>=bl){a(c,`Command count exceeds the ${bl}-command runtime limit.`);break}const{values:h}=c,f=Zr(h.name??"");try{if(!f)throw Error("Command is missing its name.");if(!h.command)throw Error("Command is missing its input sequence.");const u=ku(h.command);l.push({name:f,command:h.command,sequence:u,time:o(h.time,n.time,c,"time",Er),bufferTime:o(h["buffer.time"],n.bufferTime,c,"buffer.time",30),line:c.line,holdOnly:u.every(d=>d.hold)})}catch(u){a(c,u.message,f)}}return{commands:l,defaults:n,remap:r,diagnostics:i}}function zu(s,e,t){const i=new Set;s.has("U")!==s.has("D")&&i.add(s.has("U")?"U":"D"),s.has("L")!==s.has("R")&&i.add(s.has(e<0?"L":"R")?"F":"B");for(const n of Ht)s.has(n)&&t[n]&&i.add(t[n]);return i}function Hu(s){const e=new Set(Ht.filter(i=>s.has(i))),t=(s.has("U")?"U":s.has("D")?"D":"")+(s.has("B")?"B":s.has("F")?"F":"");t&&e.add(t);for(const i of ms)[...i].every(n=>s.has(n))&&e.add("$"+i);return e}function Vu(s){return s.kind==="direction"?[s.key]:s.keys}function Us(s,e){const t=Vu(s);return s.hold?t.every(i=>e.held.has(i)):s.release?t.every(i=>e.released.has(i)&&(e.previousDurations.get(i)??0)>=s.charge):t.every(i=>s.kind==="chord"&&!Ht.includes(i)?e.held.has(i):e.pressed.has(i))}function Gu(s){if(s.hold)return[];const e=s.release?"release:":"press:";return s.kind==="chord"?s.keys.filter(t=>Ht.includes(t)||s.release).map(t=>e+(Ht.includes(t)?t:"direction")):s.kind==="direction"?[e+"direction"]:s.keys.map(t=>e+t)}function El(s,e,t){if(s.kind==="chord"){const i=new Set;for(const n of s.keys)if(Ht.includes(n))for(const r of Ht)t[r]===n&&i.add(r);else for(const r of n.replace("$",""))i.add(r==="F"?e.facing<0?"L":"R":r==="B"?e.facing<0?"R":"L":r);return i}return s.kind==="button"?new Set(Ht.filter(i=>s.keys.includes(t[i]))):new Set([...s.keys[0]].map(i=>i==="F"?e.facing<0?"L":"R":i==="B"?e.facing<0?"R":"L":i))}class xs{constructor(e={commands:[]}){typeof e=="string"&&(e=Do(e)),this.commands=e.commands??[],this.remap=e.remap??Object.fromEntries(Ht.map(t=>[t,t])),this.diagnostics=[...e.diagnostics??[]],this.historyLimit=Math.max(1,...this.commands.map(t=>t.time+1)),this.reset()}reset(){this.tick=-1,this.history=[],this.buffered=new Map,this.active=new Set,this.previous={raw:new Set,held:new Set,durations:new Map}}update(e,t=1){this.tick++;const i=new Set([...e].filter(l=>Fu.has(l))),n=Hu(zu(i,t,this.remap)),r=this.previous,a={tick:this.tick,raw:i,facing:t,held:n,pressed:new Set([...n].filter(l=>!r.held.has(l))),released:new Set([...r.held].filter(l=>!n.has(l))),previousDurations:r.durations,durations:new Map([...n].map(l=>[l,(r.durations.get(l)??0)+1])),changes:new Set([...i,...r.raw].filter(l=>i.has(l)!==r.raw.has(l)))};this.previous=a,this.history.push(a),this.history.length>this.historyLimit&&this.history.shift(),this.active=new Set;let o=25e4;for(const l of this.commands){if(l.holdOnly){l.sequence.every(h=>Us(h,a))&&this.active.add(l.name);continue}if(l.sequence.every(h=>!h.hold||Us(h,a))&&Us(l.sequence.at(-1),a)&&this.matchSequence(l,()=>--o>=0)&&this.buffered.set(l.name,this.tick+l.bufferTime-1),(this.buffered.get(l.name)??-1)>=this.tick&&this.active.add(l.name),o<0){this.diagnostics.some(h=>h.message==="Input matching work limit reached.")||this.diagnostics.push({kind:"command",message:"Input matching work limit reached."});break}}for(const[l,c]of this.buffered)c<this.tick&&this.buffered.delete(l);return this.active}matchSequence(e,t){const i=this.history.length-1,n=this.tick-e.time;let r=i,a=null,o=new Set;for(let l=e.sequence.length-1;l>=0;l--){const c=e.sequence[l],h=Gu(c);let f=-1;for(let u=r;u>=0&&this.history[u].tick>=n;u--){if(!t())return!1;if(u<r&&(o=new Set),!(!Us(c,this.history[u])||h.some(d=>o.has(d)))&&!(a!=null&&a.symbol.strict&&!this.strictBetween(u,a.index,c,a.symbol))){f=u;break}}if(f<0)return!1;f!==r&&(o=new Set);for(const u of h)o.add(u);r=f,a={index:f,symbol:c}}return!0}strictBetween(e,t,i,n){const r=this.history[t],a=El(n,r,this.remap);if(e===t){for(const o of El(i,r,this.remap))a.add(o);return[...r.changes].every(o=>a.has(o))}for(let o=e+1;o<t;o++)if(this.history[o].changes.size)return!1;return[...r.changes].every(o=>a.has(o))}}const Tl=["a","b","c","x","y","z","s"];function Ua(s){return Number.isFinite(Number(s))?Math.max(0,Math.min(8,Math.trunc(Number(s)))):0}function Jr(s){var t,i,n,r,a,o;let e=(i=(t=s.checks)==null?void 0:t.find(l=>l.key==="cmd"&&l.ok))==null?void 0:i.path;if(!e&&((r=(n=s.def)==null?void 0:n.files)!=null&&r.cmd))try{e=Lo(s.def.files.cmd,((a=s.path)==null?void 0:a.slice(0,s.path.lastIndexOf("/")+1))||"",!0)}catch{}return Do(e&&((o=s.files)!=null&&o[e])?br(s.files[e]):"")}function wl(s){const e=[];let t=new Set,i=new Set,n=new Set;const r=(a=1,o=[])=>{const l=new Set([...t,...i,...o]),c=e.at(-1);c&&l.size===c.keys.size&&[...l].every(h=>c.keys.has(h))?c.duration+=a:e.push({keys:l,duration:a}),n=l};r();for(const a of s.sequence)if(a.kind==="direction"){const o=new Set(a.keys[0]);a.release?(t=o,r(Math.max(1,a.charge)),t=new Set,r()):(!a.hold&&o.size===t.size&&[...o].every(l=>t.has(l))&&(t=new Set,r()),t=o,r())}else if(a.release){r(Math.max(1,a.charge),a.keys);for(const o of a.keys)i.delete(o);r()}else{if(a.keys.some(o=>n.has(o))&&!a.hold&&r(),a.hold)for(const o of a.keys)i.add(o);r(1,a.keys)}return t=new Set,i=new Set,r(),e}function jc(s){var t,i,n,r;const e=((i=(t=s==null?void 0:s.states)==null?void 0:t.get(-3))==null?void 0:i.controllers)||[];for(const a of e){if(a.type!=="varset")continue;const o=Object.entries(a.values||{}).find(([u])=>/^var\s*\(\s*\d+\s*\)$/.test(u)),l=Number(o?/^var\s*\(\s*(\d+)\s*\)$/.exec(o[0])[1]:(n=a.values)==null?void 0:n.v);if(!Number.isInteger(l)||l<0||l>=60)continue;const c=(a.entries||[]).filter(u=>/^trigger(?:all|[1-9]\d*)$/.test(u.key)).map(u=>u.value).join(`
`);if(!/\bcommand\s*=\s*["']AI\d+["']/i.test(c))continue;const h=u=>(u.entries||[]).some(d=>{if(!/^trigger(?:all|[1-9]\d*)$/.test(d.key))return!1;const m=String(d.value).replace(/\s+/g,"").toLowerCase();return m.includes("var("+l+")!=0")||m.includes("var("+l+")>0")||m.includes("var("+l+")>=1")});if(e.filter(u=>["changestate","selfstate"].includes(u.type)&&h(u)).length<2)continue;const f=Number(o?o[1]:(r=a.values)==null?void 0:r.value);return{index:l,value:Number.isFinite(f)&&f>0?f:1}}return null}function Tr(s){var e;return((e=jc(s))==null?void 0:e.index)??null}function Wu(s,e){const t=jc(s);return(t==null?void 0:t.index)===e?t.value:1}function Qc(s){var r,a;const e=(r=s==null?void 0:s.states)==null?void 0:r.get(-1);if(!((a=e==null?void 0:e.controllers)!=null&&a.length))return Tr(s);const t=e.controllers.flatMap(o=>(o.entries||[]).filter(l=>/^trigger(?:all|[1-9]\d*)$/.test(l.key)).map(l=>l.value)).join(`
`),i=[...t.matchAll(/\bvar\s*\(\s*(\d{1,2})\s*\)\s*(?:>=|>)\s*1\b/gi)].map(o=>+o[1]),n=new Set([...t.matchAll(/\bvar\s*\(\s*(\d{1,2})\s*\)\s*<=\s*0\b/gi)].map(o=>+o[1]));return i.find(o=>o<60&&n.has(o))??Tr(s)}function Xu(s){var i;if(Qc(s)!==null)return!0;const e=(i=s==null?void 0:s.states)==null?void 0:i.get(-1);return[...((e==null?void 0:e.controllers)||[]).flatMap(n=>(n.entries||[]).filter(r=>/^trigger(?:all|[1-9]\d*)$/.test(r.key)).map(r=>r.value)),...(s==null?void 0:s.zssExpressions)||[]].some(n=>/\bailevel\b/i.test(String(n)))}class qu{constructor(e,{level:t=4,seed:i=1831565813,authoredAI:n=!1,nativeAI:r=!1}={}){var o;this.level=Ua(t),this.authoredAI=!!n,this.nativeAI=!!r,this.seed=i>>>0||1,this.buffer=new xs(e),this.inverse=new Map;for(const l of Tl){const c=((o=e.remap)==null?void 0:o[l])??l;c&&!this.inverse.has(c)&&this.inverse.set(c,l)}const a=e.commands.filter(l=>l.sequence.every(c=>c.kind!=="button"||c.keys.every(h=>this.inverse.has(h))));this.attacks=a.filter(l=>!l.holdOnly&&l.sequence.some(c=>c.kind==="button"&&c.keys.some(h=>h!=="s"))).slice(0,512),this.byName=new Map;for(const l of a)this.byName.has(l.name)||this.byName.set(l.name,[]),this.byName.get(l.name).push(l);this.recoveries=a.filter(l=>l.name.toLowerCase()==="recovery"),this.recoveryNames=new WeakMap,this.recoveryButton=0,this.recovering=!1,this.normal=this.attacks.filter(l=>l.sequence.length===1&&!l.sequence[0].release),this.special=this.attacks.filter(l=>!this.normal.includes(l)),this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.lastCommand=null,this.jumpWait=this.authoredAI?18+this.seed%31:170+this.seed%115}random(){let e=this.seed;return e^=e<<13,e^=e>>>17,e^=e<<5,this.seed=e>>>0,this.seed/4294967296}physical(e,t){return new Set([...e].map(i=>i==="F"?t<0?"L":"R":i==="B"?t<0?"R":"L":this.inverse.get(i)||i))}queue(e,t){this.plan=[{keys:new Set(e),duration:t}],this.index=0,this.remaining=0}chooseRecovery(e){var a;const t=(a=e.stateOwner)==null?void 0:a.program.states.get(e.stateNo);let i=t&&this.recoveryNames.get(t);if(t&&!i){i=new Set;for(const o of t.controllers){if(!["changestate","selfstate"].includes(o.type))continue;const l=o.entries.filter(c=>/^trigger(?:all|[1-9]\d*)$/.test(c.key)).map(c=>c.value).join(`
`);if(/\bcanrecover\b/i.test(l))for(const c of l.matchAll(/\bcommand\s*=\s*"([^"\\]*)"/gi))i.add(c[1])}this.recoveryNames.set(t,i)}const n=[...i||[]].flatMap(o=>this.byName.get(o)||[]),r=n.length?n:this.recoveries;if(r.length){const o=r[Math.floor(this.random()*r.length)];this.lastCommand=o.name,this.plan=wl(o),this.index=0,this.remaining=0}else{const o=Tl.filter(l=>l!=="s"&&this.inverse.has(l));o.length&&this.queue([o[this.recoveryButton++%o.length]],1)}}canJump(e){var t,i;return e.ctrl&&e.moveType!=="H"&&e.stateType==="S"&&e.pos.y>=-.01&&((t=e.program)==null?void 0:t.states.has(40))&&!((i=e.asserted)!=null&&i.has("nojump"))}chooseJump(e,t){const i=Math.abs(t.pos.x-e.pos.x),n=e.coordinateScale||1,r=e.constant("size.ground.front")*n+t.constant("size.ground.front")*(t.coordinateScale||1)+20*n,a=i>r||this.random()<.65,o=!a&&this.random()<.25;return this.queue(a?["U","F"]:o?["U","B"]:["U"],3+Math.floor(this.random()*3)),this.lastCommand=a?"jump-forward":o?"jump-back":"jump-neutral",this.jumpWait=this.authoredAI?Math.max(40,115-this.level*10)+Math.floor(this.random()*35):Math.max(260,500-this.level*20)+Math.floor(this.random()*85),!0}choose(e,t){if(!e.ctrl||e.moveType==="H")return;const i=Math.abs(t.pos.x-e.pos.x),n=e.coordinateScale||1,r=e.constant("size.ground.front")*n+t.constant("size.ground.front")*(t.coordinateScale||1)+20*n;if(this.canJump(e)&&this.jumpWait<=0){this.chooseJump(e,t);return}if(i>r){this.queue(["F"],4+Math.floor(this.random()*9));return}if(t.moveType==="A"&&this.random()<.12+.07*this.level){this.queue(this.random()<.3?["D","B"]:["B"],4+this.level);return}if(this.attacks.length){const a=this.special.length&&this.random()<.08+.055*this.level?this.special:this.normal.length?this.normal:this.attacks,o=a[Math.floor(this.random()*a.length)];this.lastCommand=o.name,this.plan=wl(o),this.index=0,this.remaining=0}else this.queue([],2)}tick(e,t,{paused:i=!1,enabled:n=!0}={}){var r,a;if(this.nativeAI){if(!this.level||!n||!e.alive||!(t!=null&&t.alive))this.plan=[],this.index=0,this.remaining=0,this.raw=new Set;else if(!i){this.jumpWait>0&&this.jumpWait--,this.index>=this.plan.length&&this.jumpWait<=0&&e.moveType==="I"&&[0,20,100].includes(e.stateNo)&&this.canJump(e)&&this.chooseJump(e,t);const o=this.plan[this.index];o?(this.remaining<=0&&(this.remaining=o.duration),this.raw=this.physical(o.keys,e.facing),--this.remaining<=0&&this.index++):this.raw=new Set}return this.buffer.update(this.raw,e.facing)}if(!this.level||!n||!e.alive||!(t!=null&&t.alive))this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.recovering=!1;else if(!i){this.jumpWait>0&&this.jumpWait--;const o=e.moveType==="H"&&!!((r=e.getHitVars)!=null&&r.fall);o!==this.recovering&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=o?10-this.level:0,this.raw=new Set,this.recovering=o);const l=o&&["A","L"].includes(e.stateType)&&!!((a=e.resolveTrigger)!=null&&a.call(e,"canrecover"));o&&!l&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=10-this.level,this.raw=new Set),this.authoredAI&&!o&&this.jumpWait<=0&&this.canJump(e)&&this.index>=this.plan.length&&(this.chooseJump(e,t),this.cooldown=0),this.index>=this.plan.length&&(this.cooldown>0?this.cooldown--:o?(l&&this.chooseRecovery(e),this.cooldown=14-this.level):(this.choose(e,t),this.cooldown=Math.max(1,15-this.level*1.5)));const c=this.plan[this.index];c?(this.remaining<=0&&(this.remaining=c.duration),this.raw=this.physical(c.keys,e.facing),--this.remaining<=0&&this.index++):this.raw=new Set}return this.buffer.update(this.raw,e.facing)}}const fn=(s,e=0)=>Number.isFinite(Number(s))?Number(s):e,Fa=s=>String(s??"").toUpperCase().replace(/\s/g,"");function Bn(s,e,t){var r;const i=(r=s.program)==null?void 0:r.constants,n=i instanceof Map?i.get(e):i==null?void 0:i[e];return n===void 0?t:fn(n,t)}function Ai(s,e="clsn1",t=s.collisionFrame??s.currentFrame){var h,f,u,d;if(!t||!Array.isArray(t[e]))return[];const i=Jc(s),n=Vt(i),r=s.facing<0?-1:1,a=Bn(i,"size.xscale",1)*n*r,o=Bn(i,"size.yscale",1)*n,l=fn((h=s.pos)==null?void 0:h.x)+Bn(s,"size.draw.offset.x",0)*Vt(s)*r+fn((f=s.drawOffset)==null?void 0:f.x),c=fn((u=s.pos)==null?void 0:u.y)+Bn(s,"size.draw.offset.y",0)*Vt(s)+fn((d=s.drawOffset)==null?void 0:d.y);return t[e].filter(m=>Array.isArray(m)&&m.length>=4&&m.slice(0,4).every(x=>Number.isFinite(Number(x)))).map(m=>{const x=l+Number(m[0])*a,g=l+Number(m[2])*a,p=c+Number(m[1])*o,M=c+Number(m[3])*o;return[Math.min(x,g),Math.min(p,M),Math.max(x,g),Math.max(p,M)]})}function Yu(s,e,t=!1){return t?s[0]<=e[2]&&s[2]>=e[0]&&s[1]<=e[3]&&s[3]>=e[1]:s[0]<e[2]&&s[2]>e[0]&&s[1]<e[3]&&s[3]>e[1]}function xn(s,e,t=!1){for(const i of s)for(const n of e)if(Yu(i,n,t))return[Math.max(i[0],n[0]),Math.max(i[1],n[1]),Math.min(i[2],n[2]),Math.min(i[3],n[3])];return null}function $u(s,e){var i;const t=e.moveType==="H";return s.includes("+")&&!t||s.includes("-")&&t?!1:e.stateType==="L"?s.includes("D"):e.stateType==="A"?s.includes(e.moveType==="H"&&((i=e.getHitVars)!=null&&i.fall)?"F":"A"):s.includes("M")||s.includes(e.stateType==="C"?"L":"H")}function Ku(s,e,t,i){var l,c,h,f;const n=t.moveType==="H"&&!!((l=t.getHitVars)!=null&&l.guarded);if(!t.ctrl&&!n||t.moveType==="H"&&!n||!["S","C","A"].includes(t.stateType)||(c=e.asserted)!=null&&c.has("unguardable"))return!1;const r=t.stateType==="A"?"noairguard":t.stateType==="C"?"nocrouchguard":"nostandguard";if((h=t.asserted)!=null&&h.has(r))return!1;const a=new Set([...i].map(u=>String(u).toLowerCase()));if(!((f=t.world)!=null&&f.manageInputs?t.movementHeld("holdback"):a.has("holdback")))return!1;const o=Fa(s.guardFlag??s.guardflag);return t.stateType==="A"?o.includes("A"):t.stateType==="C"?/[LM]/.test(o):/[HM]/.test(o)}function Al(s){const e=Array.isArray(s.priority)?s.priority:String(s.priority??"4,Hit").split(","),t=String(e[1]??"Hit").trim().toLowerCase();return{level:Math.max(1,Math.min(7,fn(e[0],4))),type:["hit","miss","dodge"].includes(t)?t:"hit"}}function Zu(s){if(s.length<2)return s;const e=Al(s[0].hit),t=Al(s[1].hit);return e.level!==t.level?[s[e.level>t.level?0:1]]:e.type==="dodge"||t.type==="dodge"?[]:e.type==="miss"&&t.type==="miss"?[]:s.filter((i,n)=>(n?t:e).type==="hit")}class Ju{constructor(e,{commonText:t="",commonAnimations:i=new Map,opponentCharacter:n=e,leftBound:r=-150,rightBound:a=150,pushboxes:o=!0,maxHelpers:l=56,maxProjectiles:c=256,initialize:h=!0,skipIntro:f=!0,stage:u=null,rules:d=null,combatRules:m={},playerPalette:x=1,opponentPalette:g=1,playerAILevel:p=0,opponentAILevel:M=0,expressionEvaluator:T=null,programs:b=null,manageInputs:R=!1,orderedPhases:S=!1,cameraFollow:_=!1,kotlinCombatBackend:E=null}={}){if(this.expressionEvaluator=T,this.programs=b,this.manageInputs=R,this.orderedPhases=S,this.combatRules=hu(e.files,m),!Number.isFinite(r)||!Number.isFinite(a)||r>=a)throw Error("Invalid training stage bounds.");this.character=e,this.opponentCharacter=n,this.commonText=t,this.leftBound=r,this.rightBound=a,this.pushboxes=o,this.commonAnimations=i,this.maxHelpers=Math.min(256,Math.max(0,l)),this.maxProjectiles=Math.min(1024,Math.max(0,c)),this.kotlinCombatKernel=(E==null?void 0:E.createProjectileKernel(this.maxProjectiles))??null,this.initialize=h,this.skipIntro=f,this.playerPalette=x,this.opponentPalette=g,this.playerAILevel=Ua(p),this.opponentAILevel=Ua(M),this.stage=u?new uu(u):null,this.cameraRuntime=this.stage||new du,this.cameraFollow=!!_,this.rules=d,this.gameMode=d?"versus":"training",this.stage&&(this.leftBound=u.leftBound,this.rightBound=u.rightBound),this.reset()}reset({preserveMatch:e=!1}={}){var n,r,a,o;const t=e?{players:[this.player,this.opponent],flow:this.roundFlow,ticks:this.ticks,diagnostics:this.diagnostics}:null;this.roundFlow=(t==null?void 0:t.flow)||(this.rules?new Uu(this.rules):null),this._benchmarkStartHeld=!1,this.roundGeneration=(this.roundGeneration||0)+1,this.stage?this.stage.reset({backgrounds:!e||this.stage.definition.resetBG}):this.cameraRuntime.reset();const i=((n=this.stage)==null?void 0:n.definition.starts)||[{x:-70,y:0,facing:1},{x:70,y:0,facing:-1}];this.player=new _l(this.character,{world:this,program:(r=this.programs)==null?void 0:r.get(this.character),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[0],facing:i[0].facing,id:1,teamSide:1,paletteNo:this.playerPalette,aiLevel:this.playerAILevel}),this.opponent=new _l(this.opponentCharacter,{world:this,program:(a=this.programs)==null?void 0:a.get(this.opponentCharacter),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[1],facing:i[1].facing,id:2,teamSide:2,paletteNo:this.opponentPalette,aiLevel:this.opponentAILevel});for(const l of[this.player,this.opponent])if(l.aiLevel>0){const c=Qc(l.program);c!==null&&(l.legacyAIFlag=c,l.legacyAIValue=Wu(l.program,Tr(l.program)),l.vars[c]=l.legacyAIValue)}if(this.player.teamSide=1,this.opponent.teamSide=2,this.player.opponent=this.opponent,this.opponent.opponent=this.player,this._entities=[this.player,this.opponent],this.projectiles=[],this.nextEntityId=3,this._projectileClashBounds||(this._projectileClashBounds=new Float64Array(this.maxProjectiles*4)),this.projectileClashStats={pairsVisited:0,narrowphaseCalls:0},this.orphanEffectOwners=[],this.renderEntities=[...this._entities],this.drawProjectiles=[],this.helperCommands=new Map,this.helperStats={attempted:0,created:0,rejected:0,missingState:0,destroyed:0,peak:0},this.usedHits=new Map,this.juggles=new Map,this.cornerPushActors=new Set,this.archivedDiagnostics=[],this.archivedDiagnosticKeys=new Set,this.pendingPauses=[],this.pause=null,this.superPause=null,this.commandBuffers=new Map,this.presentationEvents=[],this.eventEntities=[],this.pendingCombatEffects=[],this.activeActor=null,this.contactPhase=!1,this.inputBuffers=new Map,this.inputProfiles=new Map,this.manageInputs)for(const l of this._entities)this.inputProfiles.has(l.character)||this.inputProfiles.set(l.character,Jr(l.character)),this.inputBuffers.set(l,new xs(this.inputProfiles.get(l.character)));this.events=[],this.cpus=new Map;for(const l of this._entities)if(l.aiLevel){const c=Jr(l.character);this.cpus.set(l,new qu(c,{level:l.aiLevel,authoredAI:Xu(l.program),nativeAI:Tr(l.program)!==null,seed:1831565813^l.id*2654435769^(((o=this.roundFlow)==null?void 0:o.roundNo)||1)}));for(const h of c.diagnostics)l.diagnostic("command",h.message,{source:l.character.def.files.cmd,line:h.line})}if(this.ticks=(t==null?void 0:t.ticks)||0,this.winner=null,t){this.archiveDiagnostics(t.diagnostics);for(const[l,c]of[this.player,this.opponent].entries()){const h=t.players[l];c.power=h.power,c.victoryQuoteIndex=h.victoryQuoteIndex;const f=Math.max(0,Math.min(60,Math.trunc(c.program.constants.get("data.intpersistindex")??60))),u=Math.max(0,Math.min(40,Math.trunc(c.program.constants.get("data.floatpersistindex")??40)));c.vars.set(h.vars.subarray(f),f),c.fvars.set(h.fvars.subarray(u),u)}}if(this.syncEnvironment(),this.initialize){for(const l of this._entities)if(l.program.states.has(5900))l._initializing=!0,l.options.skipIntro=this.skipIntro,l.changeState(5900);else if(this.roundFlow&&!this.skipIntro){const c=l.program.states.has(190)?190:l.program.states.has(191)?191:null;c!==null&&l.changeState(c,0,l)}}return this}get diagnostics(){var i;const e=[...this.archivedDiagnostics,...((i=this.stage)==null?void 0:i.diagnostics)||[],...this.entities.flatMap(n=>n.diagnostics||[]),...this.orphanEffectOwners.flatMap(n=>n.diagnostics||[]),...this.projectiles.flatMap(n=>n.diagnostics||[]),...[...this.cpus||new Map].flatMap(([n,r])=>r.buffer.diagnostics.map(a=>({...a,source:n.character.def.files.cmd})))],t=new Set;return e.filter(n=>{const r=typeof n=="string"?n:JSON.stringify(n);return t.has(r)?!1:(t.add(r),!0)})}get entities(){return this._entities.filter(e=>!e.destroyed)}get view(){return this.cameraRuntime.view()}get matchOver(){var e;return((e=this.roundFlow)==null?void 0:e.matchOver)||!1}syncEnvironment(){for(const e of this._entities||[])e.cameraPos=this.cameraRuntime.camera,e.cameraZoom=this.cameraRuntime.camera.zoom,this.roundFlow&&(e.roundState=this.roundFlow.roundState,e.roundNo=this.roundFlow.roundNo,e.roundsExisted=this.roundFlow.roundsExisted)}findPlayer(e){return this.entities.find(t=>t.id===e)}spawnHelper(e,t){this.helperStats.attempted++;const i=this.entities.filter(r=>r.parent).length;if(i>=this.maxHelpers)return this.helperStats.rejected++,e.diagnostic("resource-limit",`Helper limit (${this.maxHelpers}) reached.`),null;const n=e.createHelper(t,{id:this.nextEntityId++});return n.destroyed?(this.helperStats.rejected++,n.diagnostics.some(r=>r.type==="missing-state")&&this.helperStats.missingState++,this.archiveDiagnostics(n.diagnostics)):(this._entities.push(n),this.helperStats.created++,this.helperStats.peak=Math.max(this.helperStats.peak,i+1),n.keyCtrl&&this.helperCommands.set(n,new xs(Jr(n.root.character))),this.syncEnvironment()),n}spawnProjectile(e,t){if(this.projectiles.length>=this.maxProjectiles)return e.diagnostic("resource-limit",`Projectile limit (${this.maxProjectiles}) reached.`),null;const i=new is(e,t,{id:this.nextEntityId++});if(i.removed)return this.archiveDiagnostics(i.diagnostics),i;const n=Object.fromEntries(Object.entries(t).filter(([r])=>r.startsWith("afterimage.")).map(([r,a])=>[r.slice(11),a]));return Object.keys(n).length&&this.presentationEvents.push({...n,type:"afterimage",entity:i}),this.projectiles.push(i),i}retireEffects(e,{removeExplods:t=!1}={}){var i;if(!e._effectsDetached){if(e._effectsDetached=!0,t)e.explods=[],e.drawExplods=[];else if(e.drawExplods=[],e.explods.length){for(const n of e.explods)n.orphaned=!0;this.orphanEffectOwners.push(e)}for(const n of new Set([...this._entities,...this.orphanEffectOwners]))((i=n.bound)==null?void 0:i.target)===e&&(n.bound=null),fu(n,e)}}destroyHelper(e,{recursive:t=!1,removeExplods:i=!1}={}){const n=[e];if(t)for(const r of this._entities){let a=r.parent,o=0;for(;a&&o++<256;){if(a===e){n.push(r);break}a=a.parent}}for(const r of n)r.destroyed=!0;for(const r of n)this.retireEffects(r,{removeExplods:i})}requestPause(e,t){const i=Math.max(0,Math.trunc(t.time));if(!Number.isFinite(i)||i>36e4){e.diagnostic("resource-limit","Pause time must be between 0 and 360000 ticks.");return}const n={...t,owner:e,time:i,remaining:i,elapsed:0,moved:new Map,movetime:Math.max(0,Math.min(i,t.movetime||0)),endcmdbuftime:Math.max(0,Math.min(i,t.endcmdbuftime||0))};this.pendingPauses.push(n),t.type==="superpause"&&(e.power=Math.max(0,Math.min(e.maxPower,e.power+(t.poweradd||0))),this.presentationEvents.push({...n,type:"superpause"}))}isFrozen(e){var n,r;const t=((n=this.superPause)==null?void 0:n.remaining)>0?this.superPause:((r=this.pause)==null?void 0:r.remaining)>0?this.pause:null;if(!t)return!1;const i=e===t.owner?t.movetime:t.type==="superpause"?e.superMoveTime||0:e.pauseMoveTime||0;return e.isProjectile?i<=0:(t.moved.get(e)||0)>=i}isSuperUnhittable(e){var t;return((t=this.superPause)==null?void 0:t.remaining)>0&&this.superPause.owner===e&&this.superPause.unhittable!==0}advancePause(){var i,n;const e=((i=this.superPause)==null?void 0:i.remaining)>0?this.superPause:((n=this.pause)==null?void 0:n.remaining)>0?this.pause:null,t=r=>{for(const[a,{before:o,applied:l}]of(r==null?void 0:r.defence)||[])a.defenceMultiplier===l&&(a.defenceMultiplier=o)};if(e){for(const r of[...this.entities,...this.projectiles])!this.isFrozen(r)&&!r._hitPausedThisTick&&e.moved.set(r,(e.moved.get(r)||0)+1);e.remaining--,e.elapsed++,e.remaining||t(e)}for(const r of this.pendingPauses){const a=r.type==="superpause"?"superPause":"pause";if(t(this[a]),this[a]=r,a==="superPause"&&r.remaining>0){const o=r.p2defmul>0?r.p2defmul:this.combatRules.superTargetDefence||1.5;r.defence=new Map;for(const l of r.owner.targets){const c=l.defenceMultiplier,h=c/o;r.defence.set(l,{before:c,applied:h}),l.defenceMultiplier=h}}}this.pendingPauses=[]}tick(e=new Set,t=new Set,{playerInput:i=null,opponentInput:n=null}={}){var $,A,k,X,H,ne,q,ee,B,ae,be,z,ie,he,Te,se,Ae;if(this.orderedPhases){for(const C of this.pendingCombatEffects){const{defender:N,attacker:ye,damage:Ne,minimum:oe,get:Ie,give:Oe}=C;N.life=Math.max(oe,Math.min(N.maxLife,N.life-Ne)),ye&&(ye.power=Math.max(0,Math.min(ye.maxPower,ye.power+Ie)),N.power=Math.max(0,Math.min(N.maxPower,N.power+Oe)))}this.pendingCombatEffects=[];for(const C of this._entities)C._projectedLife=void 0}this.events=[],this.presentationEvents=[],e=e instanceof Set?e:new Set(e),t=t instanceof Set?t:new Set(t);const r=(($=this.superPause)==null?void 0:$.remaining)>0||((A=this.pause)==null?void 0:A.remaining)>0&&this.pause.pausebg!==0,a=((k=this.superPause)==null?void 0:k.remaining)>0||((X=this.pause)==null?void 0:X.remaining)>0,o=((H=this.pause)==null?void 0:H.remaining)>0?this.pause:null,l=((ne=this.superPause)==null?void 0:ne.remaining)>0?this.superPause:null;this.syncEnvironment();const c=pu(this.roundFlow);if(!c&&this._benchmarkStartHeld){this._benchmarkStartHeld=!1;for(const C of[this.player,this.opponent])C.stateNo===0&&((ee=(q=C.program.states.get(0))==null?void 0:q.values)==null?void 0:ee.ctrl)===void 0&&(C.ctrl=1);this.commandBuffers.clear()}if(((ae=(B=this.roundFlow)==null?void 0:B.rules)==null?void 0:ae.fightStartLockTicks)>0&&this.roundFlow.roundState===2&&!c)for(const C of[this.player,this.opponent]){if(C.aiLevel<=0||C.stateNo!==0||C.ctrl||C.moveType!=="I"||C.stateType!=="S"||C._initializing||C.hitPauseTime>0||C.stateOwner!==C){C._r8IdleControlWait=0;continue}const N=C.program.states.get(0);if(((be=N==null?void 0:N.values)==null?void 0:be.ctrl)!==void 0||((N==null?void 0:N.controllers)||[]).some(Ne=>{var oe;return Ne.type==="ctrlset"&&/^0(?:\.0+)?$/.test(String(((oe=Ne.values)==null?void 0:oe.value)||"").trim())})){C._r8IdleControlWait=0;continue}C._r8IdleControlWait=(C._r8IdleControlWait||0)+1,C._r8IdleControlWait>=30&&(C._r8IdleControlWait=0,C.ctrl=1,C.r8IdleControlRecoveries=(C.r8IdleControlRecoveries||0)+1,C.diagnostic("r8-control-recovery","Idle CPU control restored after 30 active frames in StateDef 0; verify native MUGEN 1.1 behavior before production."))}if(!c&&(!this.roundFlow||this.roundFlow.roundState===2))for(const C of[this.player,this.opponent])C.aiLevel>0&&C.legacyAIFlag!==void 0&&C.vars[C.legacyAIFlag]<=0&&(C.vars[C.legacyAIFlag]=C.legacyAIValue||1);this.cpus.has(this.player)&&(e=this.cpus.get(this.player).tick(this.player,this.opponent,{paused:this.isFrozen(this.player)||this.player.hitPauseTime>0,enabled:!c&&(!this.roundFlow||this.roundFlow.roundState===2)})),this.cpus.has(this.opponent)&&(t=this.cpus.get(this.opponent).tick(this.opponent,this.player,{paused:this.isFrozen(this.opponent)||this.opponent.hitPauseTime>0,enabled:!c&&(!this.roundFlow||this.roundFlow.roundState===2)})),this.cpus.has(this.player)&&(i=this.cpus.get(this.player).raw),this.cpus.has(this.opponent)&&(n=this.cpus.get(this.opponent).raw),c&&(e=new Set,t=new Set,i=new Set,n=new Set,this.commandBuffers.clear());const h=new Set([...this.entities,...this.projectiles].filter(C=>C.hitPauseTime>0)),f=new Set,u=[];for(let C=0;C<this._entities.length;C++){const N=this._entities[C];if(N.destroyed)continue;if(u.push(N),c){N.events=[],N.commands=new Set,N.asserted.clear(),(z=N.pendingAssertedInputs)==null||z.clear(),N.vel.x=0,N.vel.y=0,N.parent||(N.currentFrame&&N.advanceAnimation(),N.collisionFrame=N.currentFrame,N.collisionAnimationOwner=N.animationOwner),N.time++,N.gameTime++;continue}let ye=N.root===this.player?e:t,Ne=N.root===this.player?i:n;if(this.manageInputs&&N.keyCtrl){Ne=new Set(Ne||[]);for(const Oe of N.pendingAssertedInputs)Ne.add(Oe==="F"?N.facing===1?"R":"L":Oe==="B"?N.facing===1?"L":"R":Oe);this.isFrozen(N)||N.pendingAssertedInputs.clear(),this.inputBuffers.has(N)||this.inputBuffers.set(N,new xs(this.inputProfiles.get(N.root.character))),ye=this.inputBuffers.get(N).update(Ne,N.facing)}else N.parent&&N.keyCtrl&&Ne!==null&&(ye=this.helperCommands.get(N).update(Ne,N.facing));(!N.keyCtrl||this.roundFlow&&this.roundFlow.roundState!==2)&&(ye=new Set);const oe=N.teamSide===this.player.teamSide?this.opponent:this.player,Ie=this.isFrozen(N);if(N._hitPausedThisTick=N.hitPauseTime>0,!Ie&&!N._hitPausedThisTick&&(N._projectileContactShield=!1),Ie){f.add(N);const Oe=((ie=this.superPause)==null?void 0:ie.remaining)>0?this.superPause:this.pause;if(Oe&&Oe.remaining<=Oe.endcmdbuftime){this.commandBuffers.has(N)||this.commandBuffers.set(N,new Set);for(const Pe of ye)this.commandBuffers.get(N).add(Pe)}}else this.commandBuffers.has(N)&&(ye=new Set([...ye,...this.commandBuffers.get(N)]),this.commandBuffers.delete(N));this.activeActor=N;try{N.tick({commands:ye,opponent:oe,paused:Ie,input:N.keyCtrl?Ne:new Set})}finally{this.activeActor=null}}for(const C of this.projectiles){const N=this.isFrozen(C);N&&f.add(C),C._hitPausedThisTick=C.hitPauseTime>0,C.tick({paused:N})}if(this.stage)for(const C of this.entities)C.screenBound!==!1&&(C.pos.x=Math.max(this.leftBound,Math.min(this.rightBound,C.pos.x)));(this.stage||this.cameraFollow)&&this.cameraRuntime.updateCamera(this.entities,{advance:!a}),this.syncEnvironment(),this.stage&&this.stage.tick({paused:r}),this.orderedPhases&&this.advanceCornerPush(f),this.constrainPositions()&&((this.stage||this.cameraFollow)&&this.cameraRuntime.updateCamera(this.entities,{advance:!1}),this.syncEnvironment(),this.constrainPositions({push:!1}));const m=this.entities;for(const C of m)if(C.moveType!=="H"&&C.stateType!=="L")for(const N of this.juggles.values())N.delete(C.id);const x=this.projectiles.filter(C=>!C.removed&&!C.removing),g=x.map(C=>Ai(C,"clsn2")),p=this._projectileClashBounds;this.projectileClashStats.pairsVisited=0,this.projectileClashStats.narrowphaseCalls=0;for(let C=0;C<g.length;C++){const N=C*4,ye=g[C];let Ne=1/0,oe=1/0,Ie=-1/0,Oe=-1/0;for(const Pe of ye)Pe[0]<Ne&&(Ne=Pe[0]),Pe[1]<oe&&(oe=Pe[1]),Pe[2]>Ie&&(Ie=Pe[2]),Pe[3]>Oe&&(Oe=Pe[3]);p[N]=Ne,p[N+1]=oe,p[N+2]=Ie,p[N+3]=Oe}const M=this.kotlinCombatKernel;let T=-1,b=0;if(M)try{M.clear();for(let C=0;C<x.length;C++){const N=C*4,ye=x[C];M.add(p[N],p[N+1],p[N+2],p[N+3],ye.teamSide,f.has(ye),ye.removing)}if(T=M.collect(this.orderedPhases),!Number.isInteger(T)||T<0)throw Error("Invalid projectile pair count");this.projectileClashStats.pairsVisited=M.examinedPairs()}catch(C){this.kotlinCombatKernel=null;try{(he=M.dispose)==null||he.call(M)}catch{}this.player.diagnostic("kotlin-wasm-fallback",String((C==null?void 0:C.message)||C)),T=-1,this.projectileClashStats.pairsVisited=0}for(let C=0;C<x.length;C++){const N=x[C];if(N.removing||!g[C].length){if(T>=0)for(;b<T&&M.left(b)===C;)b++;continue}const ye=[];if(T>=0)for(;b<T&&M.left(b)===C;){const oe=M.right(b++),Ie=x[oe];!Ie||Ie.removing||N.teamSide===Ie.teamSide||f.has(N)&&f.has(Ie)||(this.projectileClashStats.narrowphaseCalls++,xn(g[C],g[oe],this.orderedPhases)&&ye.push(Ie))}else for(let oe=C+1;oe<x.length;oe++){const Ie=x[oe];if(N.teamSide===Ie.teamSide||Ie.removing||f.has(N)&&f.has(Ie))continue;this.projectileClashStats.pairsVisited++;const Oe=C*4,Pe=oe*4,rt=this.orderedPhases;!(rt?p[Oe]<=p[Pe+2]&&p[Oe+2]>=p[Pe]:p[Oe]<p[Pe+2]&&p[Oe+2]>p[Pe])||!(rt?p[Oe+1]<=p[Pe+3]&&p[Oe+3]>=p[Pe+1]:p[Oe+1]<p[Pe+3]&&p[Oe+3]>p[Pe+1])||(this.projectileClashStats.narrowphaseCalls++,xn(g[C],g[oe],rt)&&ye.push(Ie))}const Ne=oe=>(oe.pos.x-N.pos.x)**2+(oe.pos.y-N.pos.y)**2;ye.sort((oe,Ie)=>Ne(oe)-Ne(Ie)||oe.id-Ie.id);for(const oe of ye){if(N.removing)break;oe.removing||(N.clash(oe),oe.clash(N))}}const R=this.orderedPhases?this.projectiles.filter(C=>!C.removed||C.drawVisible):x,S=[...m,...R];for(const C of m)C.inGuardDistance=mu(C,S);const _=[],E=new Set;for(const C of m)if(!(!C.reversalDef||f.has(C)||h.has(C)||this.roundFlow&&this.roundFlow.roundState!==2))for(const N of m){const ye=C.reversalDef;if(!ye)break;const Ne=N.hitDef;if(!Ne||N===C||N.teamSide===C.teamSide||h.has(N)||E.has(N)||!C.attributeMatches(ye["reversal.attr"],Ne.attr)||((Te=this.usedHits.get(C))==null?void 0:Te.get(N.id))===ye.serial)continue;const oe=xn(Ai(C),Ai(N),this.orderedPhases);if(!oe)continue;const Ie=N.receiveHit(ye,C);Ie.rejected||(this.applyCornerPush(C,N,Ie.cornerPush,ye.coordinateScale),N.moveContact=N.moveHit=N.moveGuarded=0,N.moveReversed=1,N.hitDef=null,E.add(N),this.usedHits.has(C)||this.usedHits.set(C,new Map),this.usedHits.get(C).set(N.id,ye.serial),this.events.push({type:"reversal",attacker:C,defender:N,hitDef:ye,damage:Ie.damage,guarded:!1,x:(oe[0]+oe[2])/2,y:(oe[1]+oe[3])/2,tick:this.ticks}))}const O=m.length>2?new Map:null;for(const C of[...m,...x]){if(this.winner||this.roundFlow&&this.roundFlow.roundState!==2||C.destroyed||f.has(C)||E.has(C)||h.has(C)||C.life<=0||C.moveType!=="A")continue;const N=C.hitDef;if(!N||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(N.attr??"").trim()))continue;const ye=Fa(N.hitFlag??N.hitflag??"MAF");if(!/[HLAMFD]/.test(ye)||ye.includes("+")&&ye.includes("-"))continue;const Ne=Fa(N.affectteam??"E"),oe=N.serial??N,Ie=this.usedHits.get(C);let Oe;for(const Pe of[...m].sort((rt,$e)=>Math.abs(rt.pos.x-C.pos.x)-Math.abs($e.pos.x-C.pos.x))){if(C===Pe||C.isProjectile&&C.owner===Pe||Pe.life<=0||h.has(Pe))continue;const rt=C.teamSide===Pe.teamSide;if(Ne==="E"&&rt||Ne==="F"&&!rt||!$u(ye,Pe)||(C instanceof is?!C.canHit(Pe,this.ticks):(Ie==null?void 0:Ie.get(Pe.id))===oe))continue;if(Oe??(Oe=Ai(C)),!Oe.length)break;let $e=O==null?void 0:O.get(Pe);$e||($e=Ai(Pe,"clsn2"),O==null||O.set(Pe,$e));const Xe=xn(Oe,$e,this.orderedPhases);if(!Xe||typeof Pe.canBeHit=="function"&&!Pe.canBeHit(N,C)||String(N[Pe.stateType==="A"?"air.type":"ground.type"]??N["ground.type"]??"high").toLowerCase()!=="none"&&!this.canJuggle(C,Pe,N))continue;const Ot=this.manageInputs||Pe.parent?Pe.commands:Pe===this.player?e:t;_.push({attacker:C,defender:Pe,hit:N,activation:oe,overlap:Xe,wasFalling:Pe.stateType==="L"||Pe.stateType==="A"&&Pe.moveType==="H"&&!!((se=Pe.getHitVars)!=null&&se.fall),guarded:Ku(N,C,Pe,Ot)})}}const I=_.filter(C=>{const N=_.find(ye=>ye.attacker===C.defender&&ye.defender===C.attacker);return!N||Zu([C,N]).includes(C)}),D=new Set;for(const C of I){if(C.attacker instanceof is&&(C.defender._projectileContactShield||!C.attacker.canHit()))continue;let N;this.contactPhase=!0;try{N=C.defender.receiveHit(C.hit,C.attacker,{guarded:C.guarded})}finally{this.contactPhase=!1}N!=null&&N.rejected||(this.applyCornerPush(C.attacker,C.defender,N.cornerPush,C.hit.coordinateScale),!C.guarded&&!N.typeNone&&this.recordJuggle(C.attacker,C.defender,C.hit,{wasFalling:C.wasFalling}),this.usedHits.has(C.attacker)||this.usedHits.set(C.attacker,new Map),this.usedHits.get(C.attacker).set(C.defender.id,C.activation),C.attacker instanceof is&&(C.defender._projectileContactShield=!0,C.attacker.onContact({guarded:C.guarded,defer:!0}),D.add(C.attacker)),this.events.push({type:C.guarded?"guard":"hit",attacker:C.attacker,defender:C.defender,hitDef:C.hit,damage:(N==null?void 0:N.damage)??0,guarded:C.guarded,typeNone:!!N.typeNone,x:(C.overlap[0]+C.overlap[2])/2,y:(C.overlap[1]+C.overlap[3])/2,tick:this.ticks}))}for(const C of D)C.finishContacts();for(const C of this.projectiles)C.finishMovementAllowance({paused:f.has(C)});for(const C of this.entities)C.updateExplods({hitPaused:h.has(C),pause:o,superPause:l});for(const C of this._entities)C.destroyed&&!C._effectsDetached&&this.retireEffects(C);for(const C of this.orphanEffectOwners)C.updateExplods({pause:o,superPause:l});this.orphanEffectOwners=this.orphanEffectOwners.filter(C=>C.explods.length||C.drawExplods.length),this.drawProjectiles=this.projectiles.filter(C=>C.drawVisible),this.eventEntities=[...u,...this.projectiles],this.cleanupEntities(),this.advancePause(),this.ticks++;const U=C=>this.entities.some(N=>N.asserted.has(C));if(!this.roundFlow&&!U("noko")&&(this.player.life<=0||this.opponent.life<=0)&&(this.winner=this.player.life<=0&&this.opponent.life<=0?"draw":this.player.life<=0?"opponent":"player"),this.roundFlow){const C=this.roundFlow,N=[this.player,this.opponent],ye=U("intro"),Ne=$e=>$e.stateNo===5900||$e.stateNo>=190&&$e.stateNo<=199||$e.asserted.has("intro"),oe=C.roundState===0&&C.phaseTime>=60&&N.every($e=>!Ne($e)||$e.stateNo>=190&&$e.stateNo<=199&&$e.animationTime===0),Ie=N.some(Ne)&&!oe,Oe=C.roundWinner==="player"?this.player:C.roundWinner==="opponent"?this.opponent:null,Pe=!!Oe&&Oe.stateNo>=180&&Oe.stateNo<=189&&!Oe.animationEnded,rt=C.step({players:N,paused:a,intro:ye,introPending:Ie,victoryPending:Pe,roundNotOver:U("roundnotover"),timerFreeze:U("timerfreeze"),noKO:N.map(()=>U("noko"))});this.syncEnvironment();for(const $e of rt){if($e.type==="round"&&C.rules.fightStartLockTicks>0){this._benchmarkStartHeld=!0;for(const Xe of[this.player,this.opponent])Xe.program.states.has(0)&&Xe.changeState(0,1,Xe),Xe.animations.has(0)&&Xe.changeAnimation(0),Xe.vel.x=0,Xe.vel.y=0,Xe.pos.y=0,Xe.asserted.clear();this.commandBuffers.clear()}if($e.type==="fight"&&!C.rules.fightStartLockTicks)for(const Xe of N)Xe.stateNo===0&&(Xe.ctrl=1);if($e.type==="round-over"&&(this.winner=$e.winner),$e.type==="result")for(const Xe of N){const Lt=$e.winner===(Xe===this.player?"player":"opponent")?180:$e.reason==="time"?170:null;Lt!==null&&Xe.program.states.has(Lt)&&Xe.changeState(Lt,0,Xe)}$e.type==="next-round"&&this.reset({preserveMatch:!0}),this.presentationEvents.push({...$e,type:"round",event:$e.type})}C.matchOver&&C.roundWinner!=="draw"&&((Ae=this[C.roundWinner])==null||Ae.selectVictoryQuote())}return this.events}cleanupEntities(){var t;const e=this._entities.filter(i=>i.destroyed);this.helperStats.destroyed+=e.filter(i=>i.parent).length;for(const i of e)i._effectsDetached||this.retireEffects(i);for(const i of[...e,...this.projectiles.filter(n=>n.removed)]){this.archiveDiagnostics(i.diagnostics),this.usedHits.delete(i),this.cornerPushActors.delete(i),this.commandBuffers.delete(i),this.inputBuffers.delete(i),this.helperCommands.delete(i),this.juggles.delete(i);for(const n of this.juggles.values())n.delete(i.id)}this._entities=this._entities.filter(i=>!i.destroyed),this.projectiles=this.projectiles.filter(i=>!i.removed);for(const i of this._entities){i.helpers=i.helpers.filter(n=>!n.destroyed),i.targets=i.targets.filter(n=>!n.destroyed&&(!this.orderedPhases||n.moveType==="H"));for(const n of i.targetHitIds.keys())i.targets.some(r=>r.id===n)||i.targetHitIds.delete(n);(t=i.bound)!=null&&t.target.destroyed&&(i.bound=null)}this.renderEntities=[...this._entities,...this.orphanEffectOwners].sort((i,n)=>i.id-n.id)}archiveDiagnostics(e){for(const t of e){const i=JSON.stringify(t);this.archivedDiagnosticKeys.has(i)||(this.archivedDiagnosticKeys.add(i),this.archivedDiagnostics.push(t))}}canJuggle(e,t,i){var c,h,f;if((c=(e.isProjectile?e.creator:e).asserted)!=null&&c.has("nojugglecheck")||!(t.stateType==="L"||t.stateType==="A"&&t.moveType==="H"&&((h=t.getHitVars)==null?void 0:h.fall)))return!0;const r=e.isProjectile?e.owner:e,a=(f=this.juggles.get(r))==null?void 0:f.get(t.id),o=(a==null?void 0:a.remaining)??r.constant("data.airjuggle"),l=e.isProjectile?i["air.juggle"]||0:(a==null?void 0:a.group)===i.juggleGroup?0:i.juggleCost||0;return o>=l}recordJuggle(e,t,i,{wasFalling:n=!1}={}){var h,f;if(!n&&!((h=t.getHitVars)!=null&&h.fall)&&t.stateType!=="L")return;const r=e.isProjectile?e.owner:e;this.juggles.has(r)||this.juggles.set(r,new Map);const a=this.juggles.get(r),o=a.get(t.id),l=(f=(e.isProjectile?e.creator:e).asserted)==null?void 0:f.has("nojugglecheck"),c=l?0:e.isProjectile?i["air.juggle"]||0:(o==null?void 0:o.group)===i.juggleGroup?0:i.juggleCost||0;a.set(t.id,{remaining:Math.max(0,((o==null?void 0:o.remaining)??r.constant("data.airjuggle"))-c),group:i.juggleGroup})}bodyWidth(e,t,i=!1){return gu(e,t,{edge:i})}horizontalLimits(e){var a,o;const t=l=>{var c,h;return fn((h=(c=e.width)==null?void 0:c.edge)==null?void 0:h[e.facing===l?0:1])*e.coordinateScale},i=this.view;let n=this.orderedPhases?Math.max(this.leftBound,i.left+(((a=this.stage)==null?void 0:a.definition.screenLeft)||0)+t(-1)):this.stage?Math.max(this.leftBound,i.left+Math.max(this.stage.definition.screenLeft,this.bodyWidth(e,-1,!0))):this.leftBound+this.bodyWidth(e,-1,!0),r=this.orderedPhases?Math.min(this.rightBound,i.right-(((o=this.stage)==null?void 0:o.definition.screenRight)||0)-t(1)):this.stage?Math.min(this.rightBound,i.right-Math.max(this.stage.definition.screenRight,this.bodyWidth(e,1,!0))):this.rightBound-this.bodyWidth(e,1,!0);return n>r&&(n=r=(this.leftBound+this.rightBound)/2),{min:n,max:r}}applyCornerPush(e,t,i=0,n=e.coordinateScale){if(e instanceof is)return;if(this.orderedPhases){const l=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);e.cornerPush=Math.fround(i*n*l),e.cornerPushTarget=e.cornerPush?t:null,e.cornerPushSide=l,e.cornerPush?this.cornerPushActors.add(e):this.cornerPushActors.delete(e);return}if(!i||t.screenBound===!1)return;const{min:r,max:a}=this.horizontalLimits(t),o=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);(o>0?t.pos.x<a-.01:t.pos.x>r+.01)||(e.cornerPush=i*n*o)}advanceCornerPush(e){for(const t of this.cornerPushActors){if(!t.cornerPush||t.destroyed){this.cornerPushActors.delete(t),t.cornerPushTarget=null;continue}if(e.has(t)||t._hitPausedThisTick)continue;const i=t.cornerPushTarget;if(i&&!i.destroyed&&i.screenBound!==!1){const{min:n,max:r}=this.horizontalLimits(i);(t.cornerPushSide>0?i.pos.x>=r:i.pos.x<=n)&&(t.pos.x=Math.fround(t.pos.x+t.cornerPush))}t.cornerPush=Math.fround(t.cornerPush*Math.fround(.7)),Math.abs(t.cornerPush)<t.coordinateScale&&(t.cornerPush=0),t.cornerPush||(t.cornerPushTarget=null,this.cornerPushActors.delete(t))}}constrainPositions({push:e=!0}={}){const t=this.entities,i=new Map(t.map(o=>[o,this.horizontalLimits(o)])),n=o=>{if(o.screenBound!==!1){const{min:l,max:c}=i.get(o);o.pos.x=Math.max(l,Math.min(c,o.pos.x))}};if(t.forEach(n),!this.pushboxes||!e)return!1;let r=!1;const a=t.filter(o=>o.playerPush!==!1).sort((o,l)=>o.id-l.id);for(let o=0;o<a.length;o++)for(let l=o+1;l<a.length;l++){const c=a[o],h=a[l];if(c.teamSide===h.teamSide)continue;const f=c.pos.y-Bn(c,"size.height",60)*Vt(c),u=h.pos.y-Bn(h,"size.height",60)*Vt(h);if(f>=h.pos.y||u>=c.pos.y||!xn(Ai(c,"clsn2"),Ai(h,"clsn2")))continue;const[d,m]=c.pos.x<=h.pos.x?[c,h]:[h,c],x=this.bodyWidth(d,1),g=this.bodyWidth(m,-1);for(let p=0;p<(this.orderedPhases?2:1);p++){const M=d.pos.x+x,T=m.pos.x-g,b=this.orderedPhases?Math.fround(Math.fround(M)-Math.fround(T)):d.pos.x+x-m.pos.x+g;if(b<=0||p&&!xn(Ai(c,"clsn2"),Ai(h,"clsn2")))break;const R=d.screenBound===!1?1/0:Math.max(0,d.pos.x-i.get(d).min),S=m.screenBound===!1?1/0:Math.max(0,i.get(m).max-m.pos.x),_=Math.min(b/2,R),E=Math.min(b-_,S),O=d.pos.x,I=m.pos.x;if(d.pos.x-=Math.min(b-E,R),m.pos.x+=E,this.orderedPhases&&(d.pos.x=Math.fround(d.pos.x),m.pos.x=Math.fround(m.pos.x)),n(d),n(m),r=!0,d.pos.x===O&&m.pos.x===I)break}}return r}}const it=(s,e,t="")=>`
[Statedef ${s}]
${e}
${t}
`,xe=(s,e,t="1")=>`
[State 0, ${s}]
type = ${s}
trigger1 = ${t}
${e}
`,ot=(s,e,t=1)=>xe("ChangeState",`value = ${s}
ctrl = ${t}`,e),je=(s,e="time = 0")=>xe("ChangeAnim",`value = ${s}`,`(${e}) && selfanimexist(${s})`);function eh({orderedPhases:s=!1}={}){return[it(0,`type = S
movetype = I
physics = S
ctrl = 1`,je(0,"anim != 0")+xe("VelSet","y = 0","time = 0")+(s?xe("VelSet","x=0","time>=4 || abs(vel x)<const(movement.stand.friction.threshold)"):"")),it(10,`type = C
movetype = I
physics = C`+(s?`
velset=0,0`:""),je(10)+ot(11,"animtime = 0 || !selfanimexist(10)")),it(11,`type = C
movetype = I
physics = C
ctrl = 1`,je(11)),it(12,`type = S
movetype = I
physics = S`,je(12)+ot(0,"animtime = 0 || !selfanimexist(12)")),it(20,`type = S
movetype = I
physics = S
ctrl = 1`,xe("VelSet","x = const(velocity.walk.fwd.x)",'command = "holdfwd"')+xe("VelSet","x = const(velocity.walk.back.x)",'command = "holdback"')+je(20,"vel x > 0 && anim != 20")+je(21,"vel x < 0 && anim != 21")),it(40,`type = S
movetype = I
physics = S
ctrl = 0`,je(40)+xe("VelSet",`x = ifelse(command = "holdfwd", const(velocity.jump.fwd.x), ifelse(command = "holdback", const(velocity.jump.back.x), const(velocity.jump.neu.x)))
y = const(velocity.jump.y)`,"animtime = 0 || !selfanimexist(40)")+ot(50,"animtime = 0 || !selfanimexist(40)")),it(45,`type = A
movetype = I
physics = A
ctrl = 1`,xe("VelSet",`x = ifelse(command = "holdfwd", const(velocity.airjump.fwd.x), ifelse(command = "holdback", const(velocity.airjump.back.x), const(velocity.airjump.neu.x)))
y = const(velocity.airjump.y)`,"time = 0")+ot(50,"time > 0")),it(50,`type = A
movetype = I
physics = A
ctrl = 1`,je("ifelse(vel x = 0, 41, ifelse(vel x > 0, 42, 43))")+ot(52,"pos y >= 0 && vel y > 0",0)),it(51,`type = A
movetype = I
physics = A`),it(52,`type = S
movetype = I
physics = S
ctrl = 0`+(s?`
velset=0,0
anim=47`:""),je(47)+xe("PosSet","y = 0","time = 0")+xe("VelSet","y = 0","time = 0")+(s?xe("CtrlSet","value=1","time>=3"):"")+ot(0,"time >= 3 && (animtime = 0 || !selfanimexist(47))")),it(100,`type = S
movetype = I
physics = `+(s?"S":"N")+`
ctrl = 1`,je(100)+xe("VelSet","x = const(velocity.run.fwd.x)")+xe("AssertSpecial",`flag = nowalk
flag2 = noautoturn`)+ot(0,'command != "holdfwd"')),it(105,`type = A
movetype = I
physics = A
ctrl = 0`,je(105)+(s?xe("CtrlSet","value=1","time>=2"):"")+xe("VelSet",`x = const(velocity.run.back.x)
y = const(velocity.run.back.y)`,"time = 0")+ot(s?106:52,"pos y >= 0 && vel y > 0",0)),...s?[it(106,`type=S
movetype=I
physics=S
ctrl=0`,je(47)+xe("PosSet","y=0")+xe("VelSet","y=0")+xe("VelSet","x=0","abs(vel x)<const(movement.stand.friction.threshold)")+ot(0,"time>=7"))]:[],...s?[it(120,`type=U
movetype=I
physics=U
ctrl=1`,je("ifelse(statetype=A,122,ifelse(statetype=C,121,120))")+xe("VelSet",`x=0
y=0`,"statetype!=A")+xe("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'command!="holdback"')+xe("ChangeState",`value=ifelse(statetype=A,132,ifelse(statetype=C,131,130))
ctrl=1`,"animtime=0 || !selfanimexist(ifelse(statetype=A,122,ifelse(statetype=C,121,120)))")),it(140,`type=U
movetype=I
physics=U
ctrl=1`,je("ifelse(statetype=A,142,ifelse(statetype=C,141,140))")+xe("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'animtime=0 || command!="holdback"'))]:[],...[[120,"S",130],[130,"S",130],[131,"C",131],[132,"A",132],[140,"S",130]].filter(([e])=>!s||e!==120&&e!==140).map(([e,t,i])=>it(e,`type = ${t}
movetype = I
physics = ${t}
ctrl = 1${t==="A"?"":`
velset = 0,0`}`,je(i)+(s?ot(140,"!inguarddist"):"")+ot(t==="A"?50:t==="C"?11:0,'command != "holdback"'))),...[[150,"S",150,151],[152,"C",151,153],[154,"A",152,155]].map(([e,t,i,n])=>it(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,je(i)+ot(n,"hitshakeover",0))),...[[151,"S",150],[153,"C",151],[155,"A",152]].map(([e,t,i])=>it(e,`type=${t}
movetype=H
physics=${t==="A"?"N":t}
ctrl=0`,je(i)+xe("HitVelSet",`x=1
y=1`,"time=0")+xe("CtrlSet","value=1","time>=gethitvar(ctrltime)")+(t==="A"?xe("Gravity","")+ot(52,"pos y>=0 && vel y>0",0)+ot(132,"time>=gethitvar(ctrltime)"):xe("VelSet","x=0","time>=gethitvar(slidetime)||hitover")+xe("StateTypeSet",`statetype=C
physics=C`,'command="holddown"')+xe("StateTypeSet",`statetype=S
physics=S`,'command!="holddown"')+xe("ChangeState",`value=${s?"ifelse(inguarddist,ifelse(statetype=C,131,130),140)":"ifelse(statetype=C,131,130)"}
ctrl=1`,"hitover")))),...[[5e3,"S","ifelse(gethitvar(groundtype)=2,5010,5000)"],[5010,"C","5020"],[5020,"A","5030"]].map(([e,t,i])=>{const n="5030+gethitvar(animtype)",r="5050+gethitvar(animtype)-3",a=s?`ifelse(gethitvar(animtype)>=3,ifelse(gethitvar(animtype)=3,5030,ifelse(selfanimexist(${r}),${r},5030)),ifelse((gethitvar(fall)||gethitvar(yvel)!=0)&&selfanimexist(${n}),${n},${i}+gethitvar(animtype)))`:`ifelse(gethitvar(animtype)>=3,5030,${i}+gethitvar(animtype))`;return it(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,xe("ChangeAnim",`value=${a}`,`time=0 && selfanimexist(${a})`)+(s?xe("StateTypeSet","statetype=A","gethitvar(yvel)!=0 || pos y!=0"):"")+xe("ChangeState",`value=${t==="A"?"5030":`ifelse(gethitvar(fall)||gethitvar(yvel)!=0||pos y!=0,5030,${e+1})`}
ctrl=0`,"hitshakeover"))}),...[[5001,"S"],[5011,"C"]].map(([e,t])=>it(e,`type=${t}
movetype=H
physics=${t}
ctrl=0`,(s?je("anim"):"")+xe("HitVelSet","x=1","time=0")+xe("VelMul","x=.6","time>=gethitvar(slidetime)")+(s?je("anim+5","animtime=0 && (anim=[5000,5002] || anim=[5010,5012] || anim=[5020,5022])"):"")+xe("VelSet","x=0","hitover")+xe("DefenceMulSet","value=1","hitover")+ot(0,"hitover"))),...[5030,5035].map(e=>{const t=xe("VelAdd","y=gethitvar(yaccel)",e===5030?"time>0":s?"time>0 || prevstateno!=5030":"1"),i=xe("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"hitover || (vel y>0 && pos y>=0)")+(e===5030?s?xe("ChangeState",`value=ifelse(anim=[5050,5059],5050,5035)
ctrl=0`,"animtime=0"):ot(5035,"animtime=0",0):xe("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"animtime=0 || !selfanimexist(5035)"));return it(e,`type=A
movetype=H
physics=N
ctrl=0`,(e===5030?(s?je("ifelse(gethitvar(fall),anim,5030)"):"")+xe("HitVelSet",`x=1
y=1`,"time=0"):je(5035))+t+i)}),it(5040,`type=A
movetype=H
physics=N
ctrl=1`,je(5040)+xe("VelAdd","y=gethitvar(yaccel)")+ot(5050,"!alive",0)+ot(52,"pos y>=0 && vel y>0",0)+ot(50,"animtime=0 || !selfanimexist(5040)")),it(5050,`type=A
movetype=H
physics=N
ctrl=0`,(s?je("5050+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)","(time=0 && anim=5030 && animtime=-1) || (animtime=0 && (anim<5050 || anim>5069))")+je("anim+10","vel y>Const240p(-2) && anim=[5051,5052]"):je(5050))+xe("SelfState","value=5210",'alive && CanRecover && command="recovery"')+ot(5100,s?"vel y>0 && pos y>=ifelse(anim=5050 || anim=5035,const(movement.air.gethit.groundlevel),0)":"pos y>=0 && vel y>0",0)+xe("VelAdd","y=gethitvar(yaccel)",s?"time>0 || (prevstateno!=5030 && prevstateno!=5035)":"1")),it(5070,`type=A
movetype=H
physics=N
ctrl=0
velset=0,0`,je(5070)+ot(5071,"hitshakeover",0)),it(5071,`type=A
movetype=H
physics=N
ctrl=0`,(s?je("anim"):"")+xe("HitVelSet",`x=1
y=1`,"time=0")+xe("VelAdd","y=gethitvar(yaccel)",s?"time>0":"1")+ot(5110,"vel y>0 && pos y>=const(movement.air.gethit.trip.groundlevel)",0)),it(5080,`type=L
movetype=H
physics=N
ctrl=0
velset=0,0`,je(5080)+ot(5030,"hitshakeover && gethitvar(yvel)!=0",0)+ot(5081,"hitshakeover && gethitvar(yvel)=0",0)),it(5081,`type=L
movetype=H
physics=C
ctrl=0`,xe("HitVelSet","x=1","time=0")+xe("VelSet","x=0","hitover")+ot(5110,"hitover",0)),it(5100,`type = L
movetype = H
physics = N
ctrl = 0`+(s?"":`
velset = 0,0`),xe("PosSet","y = 0")+(s?xe("PosFreeze","value=1")+xe("VelMul","x=.75","time=0")+xe("VelSet","y=0","time=0"):"")+xe("HitFallDamage","",s?"time=3":"time=0")+xe("FallEnvShake","","time=0")+je(s?"ifelse(selfanimexist(5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)),5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0),5100)":5100)+ot(5110,"time>=1 && gethitvar(fall.yvel)=0",0)+ot(5101,"time>=1 && (animtime=0 || time>=12 || !selfanimexist(5100))",0)),it(5101,`type=L
movetype=H
physics=N
ctrl=0`,je(5160)+xe("HitFallVel","","time=0")+xe("PosSet","y=const(movement.down.bounce.offset.y)","time=0")+xe("PosAdd","x=const(movement.down.bounce.offset.x)","time=0")+(s?xe("PosFreeze","value=1","time=0"):"")+xe("VelAdd","y=const(movement.down.bounce.yaccel)",s?"time>0":"1")+ot(5110,"time>0 && vel y>0 && pos y>=const(movement.down.bounce.groundlevel)",0)),it(5110,`type = L
movetype = H
physics = N
ctrl = 0`,xe("PosSet","y=0","time=0")+xe("VelSet","y=0","time=0")+(s?je("ifelse(selfanimexist(5170),5170,5110)")+je(5110,"animtime=0 && anim!=5110")+xe("VelMul","x=const(movement.stand.friction)")+xe("VelSet","x=0","abs(vel x)<const(movement.down.friction.threshold)"):je(5110))+ot(5150,"!alive",0)+ot(5120,"time>=1 && gethitvar(recovertime)<=0",0)),it(5120,(s?`type=L
physics=N`:`type=S
physics=S`)+`
movetype=I
ctrl=0`,je(5120)+xe("SelfState",`value=0
ctrl=1`,"animtime = 0 || !selfanimexist(5120)")),it(5150,`type = L
movetype = H
physics = N
ctrl = 0
velset = 0,0`,je(5110)),it(5200,`type=A
movetype=H
physics=N
ctrl=0`,je(5050,"anim=5035 && animtime=0")+xe("VelAdd","y=gethitvar(yaccel)","time>0")+xe("SelfState",`value=5201
ctrl=0`,"vel y>0 && pos y>=const(movement.air.gethit.groundrecover.groundlevel)")),it(5201,`type=A
movetype=H
physics=A
ctrl=0
anim=5200`,xe("Turn","","time=0 && p2dist x<const720p(-20)")+xe("VelSet",`x=const(velocity.air.gethit.groundrecover.x)
y=const(velocity.air.gethit.groundrecover.y)`,"time=0")+xe("PosSet","y=0","time=0")+xe("NotHitBy",`value=SCA
time=1`)+xe("PalFX",`time=3
add=128,128,128`,"time=0")+xe("Explod",`anim=F60
pos=0,0
sprpriority=-10`,"time=0")+ot(52,"vel y>0 && pos y>=0",1)),it(5210,`type=A
movetype=I
physics=N
ctrl=0`,je(5210)+xe("PosFreeze","value=1","time<4")+xe("VelMul",s?`x=const(velocity.air.gethit.airrecover.mul.x)
y=const(velocity.air.gethit.airrecover.mul.y)`:`x=.5
y=.2`,"time=4")+xe("VelAdd",s?`x=const(velocity.air.gethit.airrecover.add.x)
y=const(velocity.air.gethit.airrecover.add.y)`:"y=Const240p(-4.5)","time=4")+xe("NotHitBy","value=SCA",s?"time<20":"time<4")+(s?xe("VelAdd","y=const(movement.air.gethit.airrecover.yaccel)","time>=4")+xe("CtrlSet","value=1","time>=20")+ot(52,"pos y>=0 && vel y>0",0):ot(50,"time>=4")))].join(`
`)}eh();function Oa(s=""){if(s=String(s).toUpperCase(),s==="S"||s==="SUB")return{mode:"subtract",source:1,destination:1};if(s==="A"||s==="ADD")return{mode:"add",source:1,destination:1};if(s==="A1"||s==="ADD1")return{mode:"add",source:1,destination:.5};const e=/^AS([\d.]+)D([\d.]+)$/.exec(s);return e?{mode:"add",source:Math.max(0,Math.min(256,+e[1]))/256,destination:Math.max(0,Math.min(256,+e[2]))/256}:{mode:"normal",source:1,destination:0}}function ju(s=0,e=0,t=0){const i=h=>{if(typeof h!="number"||!Number.isFinite(h))throw Error("Sprite angles must be finite numbers.");const f=h%360*Math.PI/180,u=d=>Math.abs(d)<1e-12?0:Math.abs(1-Math.abs(d))<1e-12?Math.sign(d):d;return[u(Math.cos(f)),u(Math.sin(f))]},[n,r]=i(s),[a,o]=i(e),[l,c]=i(t);return{a:l*n,b:o*c*n-a*r,c:l*r,d:a*n+o*c*r}}function mr(s,e,t=0){var l;const i=s==null?void 0:s.frames[e];if(!i)return null;if(!((l=i.interpolate)!=null&&l.length)||i.ticks<=0)return i;const n=s.frames[e+1]||s.frames[s.loopStart||0];if(!n)return i;const r=Math.max(0,Math.min(1,t/i.ticks)),a={...i},o=(c,h)=>c+(h-c)*r;for(const c of i.interpolate)if(c==="offset"&&(a.x=o(i.x,n.x),a.y=o(i.y,n.y)),c==="scale"&&(a.scaleX=o(i.scaleX??1,n.scaleX??1),a.scaleY=o(i.scaleY??1,n.scaleY??1)),c==="angle"&&(a.angle=o(i.angle||0,n.angle||0)),c==="blend"){const h=Oa(i.blend),f=Oa(n.blend);h.mode==="add"&&f.mode==="add"&&(a.blend=`AS${o(h.source,f.source)*256}D${o(h.destination,f.destination)*256}`)}return a}function th(s){var r;const e=mr(s.collisionAnimation??s.animation??((r=s.animations)==null?void 0:r.get(s.anim)),s.collisionFrameIndex??s.frameIndex,s.collisionFrameTime??s.frameTime)??s.collisionFrame??s.currentFrame;if(!e)return null;const t=Jc(s);if(t===s)return e;const i=(a,o)=>{var l,c;return((c=(l=a.program)==null?void 0:l.constants)==null?void 0:c.get(o))??1},n=(a,o)=>{const l=Vt(s)*i(s,o);return l?(e[a]||0)*Vt(t)*i(t,o)/l:0};return{...e,x:n("x","size.xscale"),y:n("y","size.yscale")}}function Rl(s,e,t,i,n,r,a=256){if(!i)return[0];if(!Number.isFinite(t)||t<=0||!Number.isFinite(e)||e<=0)return[];let o=i===1?Math.floor((n-s-e)/t):0,l=i===1?Math.ceil((r-s)/t):Math.max(0,Math.trunc(i)-1);return Math.max(0,l-o+1)>a&&(l=o+a-1),Array.from({length:Math.max(0,l-o+1)},(h,f)=>o+f)}function Fs(s,e,t=0){return s.animated?s.spacing[t]:e+s.spacing[t]}function Cl(s,e,t,i,n=0){const r=i>1?t/(i-1):0,a=s.width?s.width[0]/e:s.xscale[0],o=s.width?s.width[1]/e:s.xscale[1],l=a+(o-a)*r,c=s.yScaleStart+n*s.yScaleDelta;return{x:s.width?l:1,delta:s.width?a?l/a:1:l,y:c>0?1/c:0}}const Qu=(s,e)=>Array.isArray(s)?s.slice(0,3).map((t,i)=>Number(t??e[i])):[...e],ed=(s,e=0,t=255)=>Math.max(e,Math.min(t,s)),yn=(s,e={})=>({...e,...s,age:0,remaining:s.time??e.time??1}),Xt=s=>s&&(s.remaining<0||s.remaining>0);function jr(s){s&&(s.age++,s.remaining>0&&s.remaining--)}class Pl{constructor(){this.palettes=new Map,this.afterimages=new Map,this.all=null,this.background=null,this.shake=null,this.environment=null,this.diagnostics=[]}advance({paused:e=()=>!1,backgroundPaused:t=!1}={}){for(const[i,n]of this.palettes)e(i)||jr(n),Xt(n)||this.palettes.delete(i);for(const[i,n]of this.afterimages)e(i)||jr(n),Xt(n)||this.afterimages.delete(i);if(!t)for(const i of[this.all,this.background,this.shake,this.environment])jr(i)}consume(e,{entity:t}={}){for(const i of e||[]){const n=String(i.type).toLowerCase();if(n==="palfx"&&t){const r=pr(t),a=yn($r(i));Xt(a)?this.palettes.set(r,a):this.palettes.delete(r)}else if(n==="allpalfx")this.all=yn($r(i));else if(n==="bgpalfx")this.background=yn($r(i));else if(n==="envshake"){const r=i.coordinateScale??(t==null?void 0:t.coordinateScale)??1;this.shake=yn(i,{time:0,freq:60,ampl:-4/r,phase:i.freq>=90?90:0,coordinateScale:r})}else if(n==="envcolor")this.environment=yn(i,{value:[255,255,255],under:0});else if(n==="palettesnapshot"&&i.target)i.target.paletteSnapshot={layers:[],key:"[]"};else if(n==="afterimage"&&t){const r=yn(i,{time:1,length:20,timegap:1,framegap:4,palcolor:256,palbright:[30,30,30],palcontrast:[120,120,220],palpostbright:[0,0,0],paladd:[10,10,25],palmul:[.65,.65,.75],trans:"none"});r.length=ed(Math.trunc(r.length),0,60),r.timegap=Math.max(1,Math.trunc(r.timegap)),r.framegap=Math.max(1,Math.trunc(r.framegap)),r.frames=[],Xt(r)&&r.length?this.afterimages.set(t,r):this.afterimages.delete(t)}else if(n==="afterimagetime"&&this.afterimages.has(t)){const r=this.afterimages.get(t);r.remaining=i.time??i.value??0,Xt(r)||this.afterimages.delete(t)}}}capture(e,{paused:t=()=>!1}={}){for(const i of e){const n=this.afterimages.get(i);if(!Xt(n)||t(i)||n.age%n.timegap!==0||n.lastAge===n.age)continue;const r=th(i);r&&(n.lastAge=n.age,n.frames.unshift({entity:i,frame:{...r},pos:{...i.pos},facing:i.facing,coordinateScale:Vt(i),character:i.character,drawScale:{...i.drawScale},drawOffset:{...i.drawOffset},angle:i.angleDraw?i.angle:0,sizeX:i.constant("size.xscale"),sizeY:i.constant("size.yscale"),paletteRemaps:new Map(i.paletteRemaps)}),n.frames.length=Math.min(n.frames.length,n.length))}}paletteFor(e,{ownpal:t=(e==null?void 0:e.ownPal)??(e==null?void 0:e.ownpal),ignoreLocal:i=!1,includeAll:n=!0}={}){const r=i?null:t?e:pr(e),a=this.palettes.get(r);let o=Xt(a)?[a]:[];return o=[...o,...n&&Xt(this.all)?[this.all]:[]].map(l=>Object.fromEntries(Object.entries(l).map(([c,h])=>[c,Array.isArray(h)?[...h]:h]))),{layers:o,key:JSON.stringify(o.map(({add:l,mul:c,sinadd:h,color:f,invertall:u,age:d})=>({add:l,mul:c,sinadd:h,color:f,invertall:u,age:h?d:0})))}}get backgroundPalette(){const e=[this.background,this.all].filter(Xt);return{layers:e,key:JSON.stringify(e)}}get cameraOffset(){if(!Xt(this.shake))return{x:0,y:0};const e=this.shake;return{x:0,y:-Number(e.ampl)*e.coordinateScale*Math.sin((Number(e.phase)+e.age*Number(e.freq))*Math.PI/180)}}get environmentColor(){return Xt(this.environment)?this.environment:null}trailsFor(e){const t=this.afterimages.get(e);if(!Xt(t))return[];const i=[];for(let n=0;n<t.frames.length;n+=t.framegap){const r=[{color:t.palcolor,invertall:t.palinvertall,add:t.palbright,mul:t.palcontrast,postadd:t.palpostbright}];for(let a=0;a<n;a++)r.push({add:t.paladd,mul:Qu(t.palmul,[1,1,1]).map(o=>o*256)});Xt(this.all)&&r.push(this.all),i.push({...t.frames[n],palette:{layers:r,key:JSON.stringify(r)},trans:t.trans})}return i.reverse()}cleanup(e,{paletteOwners:t=e}={}){const i=new Set(e),n=new Set;for(const r of t){const a=pr(r);a&&n.add(a)}for(const r of this.palettes.keys())n.has(r)||this.palettes.delete(r);for(const r of this.afterimages.keys())i.has(r)||this.afterimages.delete(r)}}const Ge=127,Ze=125,Fn=124,td=new Set("time stateno prevstateno anim animtime ctrl life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam winko wintime winperfect loseko losetime loseperfect".split(" ")),id=new Set("pos x|pos y|vel x|vel y|p2dist x|p2dist y|p2bodydist x|p2bodydist y|parentdist x|parentdist y|rootdist x|rootdist y|screenpos x|screenpos y|hitvel x|hitvel y|camerapos x|camerapos y|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|frontedge|backedge|frontedgedist|backedgedist|frontedgebodydist|backedgebodydist".split("|")),nd=new Set("var sysvar animelemtime animelemno animexist selfanimexist projhit projcontact projguarded numprojid playeridexist projcanceltime projcontacttime projguardedtime projhittime numhelper numexplod numtarget ishelper".split(" ")),sd=new Set(["fvar","sysfvar","const240p","const480p","const720p"]),rd=new Set("name authorname p1name p2name p3name p4name statetype movetype physics p2statetype p2movetype teammode".split(" ")),ad=new Set("xveladd yveladd xoff yoff zoff xvel yvel yaccel fall.xvel fall.yvel fall.envshake.freq fall.envshake.phase".split(" ")),wr=["sin","cos","tan","asin","acos","atan","exp","ln"],od=new TextEncoder,di=s=>{const e=[];do{const t=s&127;s>>>=7,e.push(t|(s?128:0))}while(s);return e},ld=s=>{s|=0;const e=[];for(;;){const t=s&127;s>>=7;const i=s===0&&!(t&64)||s===-1&&!!(t&64);if(e.push(t|(i?0:128)),i)return e}},Qr=s=>{const e=od.encode(s);return[...di(e.length),...e]},ln=s=>[...di(s.length),...s.flat()],ns=(s,e)=>[s,...di(e.length),...e],jt=s=>[65,...ld(s)],Ba=s=>{const e=new Uint8Array(4);return new DataView(e.buffer).setFloat32(0,s,!0),[67,...e]},ea=[68,0,0,0,0,0,0,0,0],On=s=>[16,...di(s)],Qt=s=>[32,...di(s)],Sn=s=>[33,...di(s)],oi=(s,e)=>s.type===e?s.code:[...s.code,s.type===Ge?e===Ze?178:183:187],Os=s=>s.type===Ge?[...s.code,69,69]:[...s.code,...Ba(0),92],ss=s=>[...s,...On(2)],mt=(s,e)=>({type:s,code:e});class Zi extends Error{}class rs extends Error{}class cd{constructor(e){this.trigger=e,this.locals=[]}local(e){return this.locals.push(e),this.locals.length-1}read(e,t=[]){const i=id.has(e)||sd.has(e)?Ze:td.has(e)||nd.has(e)?Ge:null;if(!i||t.length>2)throw new Zi;const n=[...jt(this.trigger(e)),...jt(t.length)];for(let r=0;r<2;r++)n.push(...t[r]?oi(this.node(t[r]),Fn):ea);return n.push(...On(i===Ge?0:1)),mt(i,n)}literal(e,t=Ge){return mt(t,[...jt(this.trigger(e)),...jt(0),...ea,...ea,...On(t===Ge?0:1)])}node(e){var t;if(e.kind==="number"){if(e.float&&!Number.isFinite(Math.fround(e.value)))throw new Zi;return mt(e.float?Ze:Ge,e.float?Ba(e.value):jt(e.value))}if(e.kind==="name")return e.name==="pi"||e.name==="e"?mt(Ze,Ba(e.name==="pi"?Math.PI:Math.E)):this.read(e.name);if(e.kind==="unary"){const i=this.node(e.value);if(e.op==="+")return i;if(e.op==="!")return mt(Ge,[...Os(i),69]);if(e.op==="-")return mt(i.type,i.type===Ge?[...jt(0),...i.code,107]:[...i.code,140]);if(e.op==="~"&&i.type===Ge)return mt(Ge,[...i.code,...jt(-1),115]);throw new Zi}if(e.kind==="legacyanim")return this.binary(e.op,this.read("animelemtime",[e.element]),this.node(e.time));if(e.kind==="legacytime"){if(e.divisor.value<=0)throw new Zi;return this.binary(e.op,this.binary("%",this.read("time"),this.node(e.divisor)),this.node(e.remainder))}if(e.kind==="range"){const i=[this.node(e.left),this.node(e.low),this.node(e.high)],n=i.some(l=>l.type===Ze)?Ze:Ge,r=i.map(()=>this.local(n)),a=[];i.forEach((l,c)=>a.push(...oi(l,n),...Sn(r[c])));const o=l=>mt(n,Qt(r[l]));return a.push(...this.binary(e.includeLow?">=":">",o(0),o(1)).code,...this.binary(e.includeHigh?"<=":"<",o(0),o(2)).code,113),e.op==="!="&&a.push(69),mt(Ge,a)}if(e.kind==="command"){const i=this.literal({name:"command",args:[e.command]});return e.op==="="?i:mt(Ge,[...i.code,69])}if(e.kind==="legacyattribute"){const i=this.literal({name:"hitdefattr",args:e.attributes});return e.op==="="?i:mt(Ge,[...i.code,69])}if(e.kind==="binary")return["=","!="].includes(e.op)&&e.left.kind==="name"&&rd.has(e.left.name)&&e.right.kind==="string"?this.literal({name:e.left.name,match:e.right.value,invert:e.op==="!="}):this.binary(e.op,this.node(e.left),this.node(e.right));if(e.kind==="call"){if(e.name==="cond"){const n=this.node(e.args[0]),r=this.node(e.args[1]),a=this.node(e.args[2]);if(r.type!==a.type)throw new Zi;return mt(r.type,[...Os(n),4,r.type,...r.code,5,...a.code,11])}if(["const","gethitvar"].includes(e.name)&&["name","string"].includes((t=e.args[0])==null?void 0:t.kind)){const n=e.args[0].name??e.args[0].value,r=e.name==="const"?/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(n)?Ze:Ge:ad.has(n)?Ze:Ge;return this.literal({name:e.name,args:[n]},r)}const i=e.args.map(n=>this.node(n));if(e.name==="abs"){const n=i[0];if(n.type===Ze)return mt(Ze,[...n.code,139]);const r=this.local(Ge);return mt(Ge,[...n.code,...Sn(r),...Qt(r),...jt(0),72,4,Ge,...jt(0),...Qt(r),107,5,...Qt(r),11])}if(e.name==="min"||e.name==="max"){if(i.some(a=>a.type===Ze))return mt(Ze,[...oi(i[0],Ze),...oi(i[1],Ze),e.name==="min"?150:151]);const n=this.local(Ge),r=this.local(Ge);return mt(Ge,[...i[0].code,...Sn(n),...i[1].code,...Sn(r),...Qt(n),...Qt(r),e.name==="min"?72:74,4,Ge,...Qt(n),5,...Qt(r),11])}return e.name==="ceil"||e.name==="floor"?mt(Ge,[...oi(i[0],Ze),e.name==="ceil"?141:142,187,...On(3)]):e.name==="sqrt"?mt(Ze,ss([...oi(i[0],Ze),145])):wr.includes(e.name)?mt(Ze,ss([...oi(i[0],Ze),...On(4+wr.indexOf(e.name))])):e.name==="log"?mt(Ze,ss([...oi(i[0],Ze),...oi(i[1],Ze),...On(12)])):this.read(e.name,e.args)}throw new Zi}binary(e,t,i){if(["&&","||","^^"].includes(e))return mt(Ge,[...Os(t),...Os(i),e==="&&"?113:e==="||"?114:115]);const n=t.type===Ze||i.type===Ze?Ze:Ge,r=[...oi(t,n),...oi(i,n)],a={"=":[70,91],"!=":[71,92],"<":[72,93],">":[74,94],"<=":[76,95],">=":[78,96]};if(a[e])return mt(Ge,[...r,a[e][+(n===Ze)]]);const o={"+":[106,146],"-":[107,147],"*":[108,148]};if(o[e])return r.push(o[e][+(n===Ze)]),mt(n,n===Ze?ss(r):r);if(e==="/"){if(n===Ze)return mt(Ze,ss([...r,149]));const l=this.local(Ge),c=this.local(Ge);return mt(Ge,[...t.code,...Sn(l),...i.code,...Sn(c),...Qt(l),...jt(-2147483648),70,...Qt(c),...jt(-1),70,113,4,Ge,...jt(-2147483648),5,...Qt(l),...Qt(c),109,11])}if(n===Ge&&["%","&","|","^"].includes(e))return mt(Ge,[...r,{"%":111,"&":113,"|":114,"^":115}[e]]);throw new Zi}}function hd(s){const e=(a,o)=>[96,...ln(a.map(l=>[l])),1,o],t=[e([Ge,Ge,Fn,Fn],Ge),e([Ge,Ge,Fn,Fn],Ze),e([Ze],Ze),e([Fn],Ge),e([Ze,Ze],Ze),e([],Ge),e([],Ze)],i=[["readInt",0],["readFloat",1],["finite",2],["wrap",3],...wr.map(a=>[a,2]),["log",4]].map(([a,o])=>[...Qr("host"),...Qr(a),0,...di(o)]),n=s.map((a,o)=>[...Qr("e"+o),0,...di(i.length+o)]),r=s.map(a=>{const o=[];for(const c of a.locals){const h=o.at(-1);(h==null?void 0:h[1])===c?h[0]++:o.push([1,c])}const l=[...ln(o.map(([c,h])=>[...di(c),h])),...a.code,11];return[...di(l.length),...l]});return new Uint8Array([0,97,115,109,1,0,0,0,...ns(1,ln(t)),...ns(2,ln(i)),...ns(3,ln(s.map(a=>di(a.type===Ge?5:6)))),...ns(7,ln(n)),...ns(10,ln(r))])}class ud{constructor(e=[],{maxFunctions:t=4096,maxBytes:i=2*1024*1024}={}){if(!Number.isInteger(t)||t<0||t>16384||!Number.isInteger(i)||i<0||i>16*1024*1024)throw RangeError("Invalid numeric compilation budget.");this.context=null,this.entries=new Map,this.triggers=[],this.counts={wasm:0,interpreted:0,deoptimized:0,compiled:0,bytes:0};const n=new Map,r=[],a=[],o=u=>{const d=JSON.stringify(u);return n.has(d)||(n.set(d,this.triggers.length),this.triggers.push(typeof u=="string"?{name:u}:u)),n.get(d)};let l=0;for(const u of new Set(e))if(!(typeof u!="string"||!u.trim()||r.length>=t))try{const d=new cd(o),m=d.node(_u(u));if((l+=m.code.length)>i)break;a.push({source:u,type:m.type}),r.push({...m,locals:d.locals})}catch(d){if(!(d instanceof Zi)&&!(d instanceof Kr))throw d}if(!r.length)return;const c=(u,d,m,x,g)=>{if(typeof this.context.resolve!="function")throw new vu("Trigger resolution is unavailable.");const p=this.triggers[u],M=this.context.resolve(p.name,p.args||(d===0?[]:d===1?[m]:[m,x]),null);let T=M;if(p.match!==void 0)if(M!=null&&M.absent)T=+p.invert;else if(typeof M=="string")T=+(M===p.match!=!!p.invert);else throw new rs;if(typeof M=="boolean")T=+M;else if(M&&typeof M.value=="number"){if(!g&&(M.type==="float"||M.float))throw new rs;T=M.value}if(typeof T!="number")throw new rs;if(!Number.isFinite(T))throw new ts("Expression produced a non-finite number.");if(!g&&!Number.isInteger(T))throw new rs;if(g){if(T=Math.fround(T),!Number.isFinite(T))throw new ts("Expression produced a non-finite number.");return T}return T|0},h={readInt:(...u)=>c(...u,!1),readFloat:(...u)=>c(...u,!0),finite:u=>{if(!Number.isFinite(u))throw new ts("Expression produced a non-finite number.");return u},wrap:u=>u|0};for(const u of wr)h[u]=Math[u==="ln"?"log":u];h.log=(u,d)=>Math.log(d)/Math.log(u),this.binary=hd(r);const f=new WebAssembly.Instance(new WebAssembly.Module(this.binary),{host:h});a.forEach((u,d)=>this.entries.set(u.source,{...u,run:f.exports["e"+d]})),this.counts.compiled=this.entries.size,this.counts.bytes=this.binary.length}evaluate(e,t={}){const i=this.entries.get(e);if(!i)return this.counts.interpreted++,(t.typedResult?vl:xl)(e,t);const n=this.context;this.context=t;try{const r=i.run();return this.counts.wasm++,t.typedResult?{value:r,float:i.type===Ze}:r}catch(r){if(r instanceof rs)return this.entries.delete(e),this.counts.deoptimized++,(t.typedResult?vl:xl)(e,t);throw r instanceof WebAssembly.RuntimeError?new ts("Invalid numeric operation.",e):r instanceof Kr?(r.source||(r.source=e),r):r!=null&&r.bottom?new ts(r.message,e):new Kr((r==null?void 0:r.message)||"Trigger evaluation failed.",e)}finally{this.context=n}}get stats(){return{...this.counts,activeFunctions:this.entries.size}}}function dd(s,{factor:e,scale:t,cameraX:i,cameraY:n,cropTop:r=0,displayHeight:a=240}){if(!s.window)return null;const[o,l,c,h]=s.window,f=s.windowCentered?0:1;if(c-o+f<=0||h-l+f<=0)return[];const u=s.windowCentered?480:(960-320*t)/2,d=(540-a*t)/2,m=u+(o*e-i*s.windowDelta[0])*t,x=d+(l*e-n*s.windowDelta[1]-r)*t;if(![m,x,(c-o+f)*e*t,(h-l+f)*e*t].every(Number.isFinite))return[];const g=Math.max(0,m),p=Math.max(0,x),M=Math.min(960,m+(c-o+f)*e*t),T=Math.min(540,x+(h-l+f)*e*t);return M>g&&T>p?[g,p,M-g,T-p]:[]}function fd(s,e,t,{x:i,y:n,sx:r,sy:a,cameraX:o,cameraY:l,deltaX:c,zoom:h,factor:f,clip:u=null}){if(u&&!u.length)return[];const d=(t.flip||"").includes("H")?-1:1,m=(t.flip||"").includes("V")?-1:1,x=r*(t.scaleX??1)*d;let g=a*(t.scaleY??1)*m;if(![i,n,x,g].every(Number.isFinite)||!x||!g)return[];let p={x:1,delta:1,y:1},M=p;if(s.type==="parallax"&&(p=Cl(s,e.w,0,e.h,l/f),M=Cl(s,e.w,e.h-1,e.h,l/f),a*=p.y,g*=p.y,!g||![p.x,M.x,p.delta,M.delta,g].every(Number.isFinite)))return[];const T=s.type==="parallax"&&s.width?e.w/2:e.x,b=(A,k)=>{const X=-o*c*h*(A.delta-1)/x,H=Fs(s,e.w)*A.x*Math.sign(x);return[T-T*A.x+X+k*H,T+(e.w-T)*A.x+X+k*H]};if(![...b(p,0),...b(M,0)].every(Number.isFinite))return[];const R=(u==null?void 0:u[0])??0,S=u?u[0]+u[2]:960,_=(u==null?void 0:u[1])??0,E=u?u[1]+u[3]:540,O=new Set;for(const A of[p,M]){const[k,X]=b(A,0),H=i+(t.x||0)*r+(Math.min(k*x,X*x)-T*x);for(const ne of Rl(H,Math.abs((X-k)*x),Math.abs(Fs(s,e.w)*A.x*x),s.tile[0],R,S))O.add(ne)}const I=Fs(s,e.h,1)*Math.abs(g),D=n+(t.y||0)*a,U=Rl(Math.min(D-e.y*g,D+(e.h-e.y)*g),e.h*Math.abs(g),I,s.tile[1],_,E),$=[];for(const A of U)for(const k of O){if($.length>=8192)return $;const X=s.type==="parallax"?[...b(p,k),...b(M,k)]:null,H=X?0:k*Fs(s,e.w)*Math.abs(x);$.push({x:i+H,y:n+A*I,sx:r,sy:a,axisX:T,warp:X,clip:u})}return $}let Il;const pd=1024*1024,ih=s=>{if(typeof s!="number"||!Number.isFinite(s))throw Error("Expected a finite Lua number.");return s},li=s=>Math.trunc(ih(s)),Ll=(s,e,t)=>Math.max(e,Math.min(t,s)),md="aiLevel alive anim animElemNo animElemTime animExist animTime authorName backEdge backEdgeBodyDist backEdgeDist cameraZoom canRecover command const const240p const480p const720p ctrl drawGame facing fvar gameHeight gameTime gameWidth getHitVar hitCount hitFall hitOver hitPauseTime hitShakeOver id inGuardDist isHelper isHomeTeam life lifeMax lose map matchNo moveContact moveGuarded moveHit moveReversed moveType name numEnemy numExplod numHelper numPartner numProj numProjId numTarget p2Life p2MoveType p2StateNo p2StateType palNo physics playerIdExist power powerMax prevStateNo random roundNo roundState roundsExisted screenHeight screenWidth stateNo stateType sysfvar sysvar teamMode teamSide ticksPerSecond uniqHitCount var win".split(" "),gd=new Set("alive animExist canRecover ctrl drawGame hitFall hitOver hitShakeOver inGuardDist isHelper isHomeTeam lose playerIdExist win".split(" ")),_d={cameraPos:"camerapos",pos:"pos",vel:"vel",screenPos:"screenpos",hitVel:"hitvel",p2Dist:"p2dist",p2BodyDist:"p2bodydist",parentDist:"parentdist",rootDist:"rootdist"};function nh(s,e={}){if(e.modules!==void 0&&!Array.isArray(e.modules))throw Error("Lua modules must be an array of archive paths.");const t=Object.keys(s).filter(i=>/(?:^|\/)external\/mods\/[^/]+\.lua$/i.test(i)&&!i.split("/").at(-1).startsWith("-")).sort();for(const i of e.modules||[]){const n=Lo(i);if(!s[n])throw Error(`Lua module is missing: ${n}`);t.includes(n)||t.push(n)}if(t.length>32)throw Error("Lua module limit (32) exceeded.");return t}const vd=`
local rawload, dbg = load, debug
function print(...)
  local parts={}
  for i=1,select('#',...) do parts[i]=tostring(select(i,...)) end
  __kenja_print(table.concat(parts,'	'))
end
local hooks, required = {}, {}
hook = {}
function hook.add(list, name, fn)
  assert(type(list)=="string" and type(name)=="string" and type(fn)=="function", "Invalid hook registration")
  local group=hooks[list]
  if not group then group={order={},items={},known={}};hooks[list]=group end
  if not group.known[name] then assert(#group.order<1024,"Hook limit exceeded");group.order[#group.order+1]=name;group.known[name]=true end
  group.items[name]=fn
end
function hook.stop(list,name) local g=hooks[list];if g then g.items[name]=nil end end
local function runhooks(first,list,...)
  local g=hooks[list];if not g then return end
  local count=#g.order
  for i=1,count do local fn=g.items[g.order[i]];if fn then local v=fn(...);if first and v~=nil then return v end end end
end
function hook.run(list,...) runhooks(false,list,...) end
function hook.runFirst(list,...) return runhooks(true,list,...) end
function load(chunk,name,mode,env)
  assert(type(chunk)=="string","Only text Lua chunks are supported")
  return rawload(chunk,name or "module","t",env or _G)
end
loadstring=load
unpack=table.unpack
table.getn=function(t) return #t end
math.mod=math.fmod
math.log10=function(x) return math.log(x,10) end
local function envslot(fn)
  for i=1,256 do local name,value=dbg.getupvalue(fn,i);if not name then return end;if name=="_ENV" then return i,value end end
end
function getfenv(fn)
  if fn==nil then fn=1 end
  if fn==0 then return _G end
  if type(fn)=="number" then local frame=dbg.getinfo(fn+1,"f");fn=frame and frame.func end
  if type(fn)~="function" then error("Invalid environment target") end
  local _,env=envslot(fn);return env or _G
end
function setfenv(fn,env)
  assert(type(env)=="table","Expected environment table")
  if type(fn)=="number" then local frame=dbg.getinfo(fn+1,"f");fn=frame and frame.func end
  assert(type(fn)=="function","Invalid environment target")
  local i=envslot(fn)
  if i then local function fresh() return env end;dbg.upvaluejoin(fn,i,fresh,1) end
  return fn
end
function loadfile(path)
  local ok,source=pcall(__kenja_read,path,false)
  if not ok then return nil,source end
  return load(source,"@"..path,"t")
end
function dofile(path) local fn,err=loadfile(path);if not fn then error(err) end;return fn() end
package={loaded={},preload={}}
function require(name)
  if package.loaded[name]~=nil then return package.loaded[name] end
  assert(not required[name],"Recursive module load: "..name)
  required[name]=true
  local fn=package.preload[name]
  if not fn then local source=__kenja_read(name,true);local err;fn,err=load(source,"@"..name,"t");if not fn then error(err) end end
  local value=fn(name);required[name]=nil
  if value==nil then value=true end;package.loaded[name]=value;return value
end
io=nil;os=nil;debug=nil;collectgarbage=nil
function __kenja_tick()
  hook.run("loop");hook.run("loop#"..gameMode())
  if type(loop)=="function" then loop() end
  if __kenja_frame then __kenja_frame() end
end
`;class Uo{static async create(e,{factory:t,memoryLimit:i=32*pd,instructions:n=1e5}={}){t||(Il??(Il=No(async()=>{const{LuaFactory:o}=await import("./index-CoWh3Mjc.js").then(l=>l.i);return{LuaFactory:o}},__vite__mapDeps([0,1,2]),import.meta.url).then(({LuaFactory:o})=>{var l;return new o(typeof process<"u"&&((l=process.versions)!=null&&l.node)?void 0:new URL(""+new URL("glue-Dlydm7r2.wasm",import.meta.url).href,import.meta.url).href)})),t=await Il);const r=await t.createEngine({openStandardLibs:!0,injectObjects:!1,enableProxy:!1,traceAllocations:!0}),a=new Uo(e,r,n);r.global.setMemoryMax(i);try{return a.install(),a.run(vd,"<match API>"),a}catch(o){throw a.close(),o}}constructor(e,t,i){this.session=e,this.engine=t,this.actor=e.match.player,this.instructions=i,this.fuel=i,this.closed=!1,this.source="<module>",this.hookPointer=0}install(){const e=this.engine.global,t=(r,a)=>e.set(r,a),i=()=>{if(!this.actor||this.actor.destroyed)throw Error("Lua player selection is unavailable.");return this.actor};for(const r of md)t(r,(...a)=>{const o=i().resolveTrigger(r.toLowerCase(),a),l=o&&typeof o=="object"&&"float"in o?o.value:o;if(!["number","string","boolean"].includes(typeof l))throw Error(`Lua query ${r} requires an unsupported result type.`);return gd.has(r)||r==="getHitVar"&&["fall","fall.recover","fall.kill","guarded","isbound"].includes(String(a[0]).toLowerCase())?!!l:l});for(const[r,a]of Object.entries(_d))for(const o of["X","Y"])t(r+o,()=>i().resolveTrigger(a+" "+o.toLowerCase()));const n=r=>(...a)=>{const o=r(...a);return!o||o.destroyed?!1:(this.actor=o,!0)};t("player",n(r=>[this.session.match.player,this.session.match.opponent][li(r)-1])),t("playerId",n(r=>this.session.match.findPlayer(li(r)))),t("playerIndex",n(r=>this.session.match.entities[li(r)-1])),t("parent",n(()=>i().parent)),t("root",n(()=>i().root)),t("stateOwner",n(()=>i().stateOwner)),t("p2",n(()=>i().opponent)),t("enemy",n((r=0)=>li(r)===0?i().opponent:null)),t("enemyNear",n((r=0)=>li(r)===0?i().opponent:null)),t("helper",n(r=>i().ownedHelpers().find(a=>r===void 0||a.helperId===li(r)))),t("helperIndex",n(r=>i().ownedHelpers()[li(r)-1])),t("target",n(r=>i().targets.find(a=>r===void 0||r===-1||i().targetHitIds.get(a.id)===li(r)))),t("partner",()=>!1),t("setLife",r=>{const a=i();a.alive&&(a.life=Ll(li(r),0,a.maxLife))}),t("setPower",r=>{const a=i();a.power=Ll(li(r),0,a.maxPower)}),t("changeState",r=>{const a=i(),o=li(r);return o===-1?(a.destroyed=!0,!1):a.program.states.has(o)?(a.changeState(o,void 0,a),!0):!1}),t("mapSet",(r,a,o)=>i().setMap(String(r),ih(a),o==="add")),t("playerBufReset",()=>{var a,o;const r=i();(a=this.session.match.inputBuffers.get(r))==null||a.reset(),(o=this.session.match.helperCommands.get(r))==null||o.reset()}),t("playerNo",()=>this.session.match.entities.indexOf(i())+1),t("stateOwnerPlayerNo",()=>this.session.match.entities.indexOf(i().stateOwner)+1),t("animPlayerNo",()=>this.session.match.entities.indexOf(i().animationOwner)+1),t("pauseTime",()=>{var r;return((r=this.session.match.pause)==null?void 0:r.remaining)||0}),t("superPauseTime",()=>{var r;return((r=this.session.match.superPause)==null?void 0:r.remaining)||0}),t("gameMode",()=>this.session.selection.mode==="training"?"training":"versus"),t("matchOver",()=>this.session.match.matchOver),t("localCoordX",()=>{var r,a,o;return((o=(a=(r=i().character.def)==null?void 0:r.info)==null?void 0:a.localcoord)==null?void 0:o.split(",").map(Number)[0])||320}),t("localCoordY",()=>{var r,a,o;return((o=(a=(r=i().character.def)==null?void 0:r.info)==null?void 0:a.localcoord)==null?void 0:o.split(",").map(Number)[1])||240}),t("isAsserted",r=>i().asserted.has(String(r).toLowerCase())),t("inCustomState",()=>i().stateOwner!==i()),t("inCustomAnim",()=>i().animationOwner!==i()),t("__kenja_print",r=>this.session.issue("lua-output",String(r).slice(0,512))),t("__kenja_read",(r,a)=>{let o=String(r);a&&(o=o.replaceAll(".","/")+".lua");const l=["",...this.modules.map(u=>u.includes("/external/mods/")?u.slice(0,u.indexOf("/external/mods/")+1):u.slice(0,u.lastIndexOf("/")+1))],h=[...new Set(l.map(u=>Lo(o,u)))].find(u=>this.session.files[u]);if(!h)throw Error(`Lua file is missing: ${o}`);const f=this.session.files[h];if(f.length>256*1024)throw Error("Lua source limit (256 KiB) exceeded.");return br(f)}),this.modules=nh(this.session.files,this.session.selection),this.hookPointer=e.lua.module.addFunction(()=>{if(this.fuel-=1e3,this.fuel<0){const r=Error("Lua instruction budget exceeded.");throw r.luaBudget=!0,r}},"vii"),e.lua.lua_sethook(e.address,this.hookPointer,8,1e3)}run(e,t="<module>"){if(e.length>256*1024)throw Error("Lua source limit (256 KiB) exceeded.");this.fuel=this.instructions,this.source=t;try{return this.engine.doStringSync(e)}catch(i){throw Error(`${t}: ${i.message}`)}finally{this.engine.global.setTop(0)}}load(){for(const e of this.modules)this.run(br(this.session.files[e]),e);this.session.selection.lua&&this.run("local fn,err=load("+JSON.stringify(String(this.session.selection.lua))+',"<fight lua>","t");assert(fn,err);__kenja_frame=fn',"<fight lua>")}step(){if(!this.closed){this.fuel=this.instructions;try{const e=this.engine.global;e.lua.lua_getglobal(e.address,"__kenja_tick"),e.runSync(),e.setTop(0)}catch(e){this.session.issue("lua-runtime",e.message),this.close()}}}close(){if(this.closed)return;this.closed=!0;const e=this.engine.global;e.lua.lua_sethook(e.address,0,0,0),e.close(),this.hookPointer&&e.lua.module.removeFunction(this.hookPointer)}}const Nl=eh({orderedPhases:!0});function xd(s){const e=new Set;for(const t of s){for(const i of t.zssExpressions||[])e.add(i);for(const i of t.states.values())for(const n of i.globalParts||[i])for(const r of[n,...n.controllers||[]])for(const a of r.entries||[]){e.add(a.value);try{for(const o of Ru(a.value))e.add(o)}catch{}}}return e}const yd=(s,e)=>{const t={entity:e};for(const[i,n]of Object.entries(s))(n===null||["number","string","boolean"].includes(typeof n)||Array.isArray(n))&&(t[i]=n);return t},Bs=(s,e,t=0)=>{try{return s.constant(e)}catch{return t}};class Sd{constructor(e,t={}){this.files=e,this.selection=t,this.presentation=Da(t.presentation),this.characters=xu(e),this.commonEffects=yu(e,{fightDef:t.fightDef,effectsPackage:t.effectsPackage,character:t.character,stage:t.stage});const i=this.characters.find(o=>o.path===t.character)||this.characters[0],n=this.characters.find(o=>o.path===t.opponent)||i;if(!i||!n)throw Error("No playable character definition found.");const r=new Map([...new Set([i,n])].map(o=>[o,Su(o,{commonText:Nl,constantsFromCnsOnly:!0})]));for(const o of r.values()){const l=o.diagnostics.find(c=>c.fatal);if(l)throw Error(`${l.source}:${l.line}: ${l.message}`)}this.legacyCompatibility=Lu([i,n],r),this.expressions=new ud(xd(r.values())),this.commands=[i,n].map(o=>{var c;const l=(c=o.checks.find(h=>h.key==="cmd"&&h.ok))==null?void 0:c.path;return new xs(Do(l?br(e[l]):""))});const a=t.stage&&t.stage!=="builtin/grid"?Mu(e).find(o=>o.path===t.stage):null;if(a!=null&&a.invalid)throw Error("Stage definition could not be parsed.");this.match=new Ju(i,{opponentCharacter:n,commonText:Nl,commonAnimations:this.commonEffects.animations,programs:r,manageInputs:!0,orderedPhases:!0,cameraFollow:!0,kotlinCombatBackend:t.kotlinCombatBackend||null,expressionEvaluator:(o,l)=>this.expressions.evaluate(o,l),stage:a,playerPalette:t.palette||1,opponentPalette:t.opponentPalette||2,skipIntro:t.mode==="training",playerAILevel:t.mode==="cpu"?t.level||4:0,opponentAILevel:["solo","cpu"].includes(t.mode)?t.level||4:0,rules:t.mode==="training"?null:{roundsToWin:2,preIntro:0,introHold:60,overTime:60,resultTime:120,maxIntroTime:900,maxOutroTime:300,endless:t.endless===!0,fightStartLockTicks:bu}}),this.commands=[this.match.inputBuffers.get(this.match.player),this.match.inputBuffers.get(this.match.opponent)],this.effects=new Pl,this.banks=new Map,this.indices=new Map,this.bankIds=new Map,this.spriteMetadata=new Map,this.paletteFallbacks=new Map,this.sent=new Set,this.assets=[],this.events=[],this.sparks=[],this.gameEffects=[],this.helperFrameStats={alive:0,hidden:0,submitted:0,missingAnimation:0,missingSprite:0},this.roundGeneration=this.match.roundGeneration,this.issues=new Map(this.commonEffects.issues.map(o=>[o.type+":"+o.message,o])),this.closed=!1,this.videoSprites=new Map,this.match.stage&&(this.match.stage.viewportAspect=yl(this.presentation)),this.modelReady=!1,this.lua=null,this.luaModules=nh(e,t),this.capabilities={format:"kenjatime-core-coverage-v1",engine:"Kenjatime Core",independentRuntime:!0,universalCompatibility:!1,legacyCompatibilityTarget:this.legacyCompatibility.id,legacyCompatibilityReference:this.legacyCompatibility.reference,legacyCompatibilityStatus:this.legacyCompatibility.status,nativeMugen11Certified:!1,ikemenExtensions:"additional-not-baseline",compiledNumericExpressions:!0,scriptInterpreter:!0,luaMatchHooks:!0,stageVideo:!0,gltfStageModels:!0,knownGaps:["Lua APIs beyond match hooks, extended global states and newer ZSS extensions","Compressed glTF extensions, animation pointers and cross-layer model shadows","Video codecs unavailable on the device","Advanced stage camera offsets and mixed-coordinate camera parity","Afterimage palette chains beyond eight layers","Unverified character families and extended controller combinations"]}}setPresentation(e){return this.presentation=Da(e),this.match.stage&&(this.match.stage.viewportAspect=yl(this.presentation)),this.presentation}issue(e,t){const i=e+":"+t;this.issues.size<2e3&&this.issues.set(i,{type:e,message:t})}async initializeScripts(){if(this.closed||this.lua||!this.luaModules.length&&!this.selection.lua)return;const e=await Uo.create(this);if(this.closed){e.close();return}try{e.load(),this.lua=e}catch(t){throw e.close(),t}}syncRoundGeneration(){this.roundGeneration!==this.match.roundGeneration&&(this.roundGeneration=this.match.roundGeneration,this.gameEffects=[],this.sparks=[],this.events=[],this.effects=new Pl)}tick(e=new Set,t=new Set){var r,a,o;if(this.closed)throw Error("Match is closed.");this.syncRoundGeneration();const i=this.match,n=l=>i.isFrozen(l)||l.hitPauseTime>0;this.effects.advance({paused:n}),this.gameEffects=this.gameEffects.filter(l=>{if(!l.animation.frames.length)return!1;if(l.owner&&n(l.owner))return!0;if(++l.age>(l.maxAge??3600))return!1;const c=l.animation.frames[l.frameIndex];if(c.ticks<0)return!0;if(++l.frameTime>=Math.max(1,c.ticks)&&(l.frameTime=0,++l.frameIndex>=l.animation.frames.length))if(l.animation.loopDeclared||l.animation.loopStart>0)l.frameIndex=l.animation.loopStart;else return!1;return!0}),i.tick(new Set,new Set,{playerInput:e,opponentInput:t}),this.syncRoundGeneration(),(r=this.lua)==null||r.step(),this.commands=[i.inputBuffers.get(i.player),i.inputBuffers.get(i.opponent)];for(const l of i.eventEntities){this.effects.consume(l.events,{entity:l});for(const c of l.events){if(c.type==="gameanim"){const h=this.commonEffects.animations.get(c.anim);h&&this.commonEffects.resource?(this.gameEffects.length>=256&&this.gameEffects.shift(),this.gameEffects.push({animation:h,frameIndex:0,frameTime:0,age:0,owner:l,pos:c.pos,facing:c.facing,under:c.under})):this.issue("common-effects",`GameMakeAnim ${c.anim} requires imported fightfx AIR/SFF.`)}["playsnd","stopsnd","sndpan"].includes(c.type)&&this.events.push({...yd(c,l.id),character:l.character.path})}}for(const l of i.presentationEvents)this.effects.consume([l],{entity:l.entity||l.owner});for(const l of i.events){if(l.typeNone)continue;const c=(a=l.attacker)!=null&&a.isProjectile?l.attacker.owner:l.attacker,h=l.hitDef||{},f=!!l.guarded,u=Number(f?h["guard.sparkno"]:h.sparkno),d=f?h.guardSparkCommon!==!1:h.sparkCommon!==!1,m=d?this.commonEffects.animations:c==null?void 0:c.animations,x=d?this.commonEffects.resource:c==null?void 0:c.character,g=m==null?void 0:m.get(u),p=Array.isArray(h.sparkxy)?h.sparkxy:[0,0],M=h.coordinateScale??(c==null?void 0:c.coordinateScale)??1;let T=!1;if(Number.isFinite(u)&&u>=0&&((o=g==null?void 0:g.frames)!=null&&o.length)&&x&&c){const S=g.frames.filter(E=>E.group>=0);let _=!0;if(S.length)try{this.bank(x);const E=this.indices.get(x);_=S.some(O=>E.has(O.group+","+O.number))}catch(E){_=!1,this.issue("sprite",E.message)}_?(this.gameEffects.length>=256&&this.gameEffects.shift(),this.gameEffects.push({animation:g,resource:x,scale:d?this.commonEffects.scale:Vt(c),frameIndex:0,frameTime:0,age:0,maxAge:120,owner:c,under:!1,pos:{x:l.x+(p[0]||0)*M*c.facing,y:c.pos.y+(p[1]||0)*M},facing:c.facing}),T=!0):this.issue("missing-sprite",`HitDef ${f?"guard ":""}spark ${d?"F":""}${u} contains no source sprites in its SFF.`)}else Number.isFinite(u)&&u>=0&&this.issue("missing-animation",`HitDef ${f?"guard ":""}spark ${d?"F":""}${u} is unavailable from imported assets.`);T||this.sparks.push({x:l.x,y:l.y,age:0,guarded:f});const b=f?h.guardsound:h.hitsound,R=Array.isArray(b)?b:[b,0];c&&R[0]!==void 0&&Number.isFinite(Number(R[0]))&&Number(R[0])>=0&&this.events.push({type:"playsnd",group:Number(R[0]),number:Number(R[1]||0),common:f?h.guardSoundCommon!==!1:h.hitSoundCommon!==!1,channel:-1,character:c.character.path,entity:c.id})}return this.sparks=this.sparks.filter(l=>++l.age<12),this.sparks.length>256&&this.sparks.splice(0,this.sparks.length-256),this.effects.capture([...i.entities,...i.drawProjectiles],{paused:n}),this.effects.cleanup(i.entities),this}bank(e){var t;if(!this.banks.has(e)){const i=(t=e.def)!=null&&t.files?Eu(e):Tu(e.files[e.sprite.path]);this.banks.set(e,i),this.bankIds.set(e,this.banks.size),this.indices.set(e,new Map(i.sprites.map((n,r)=>[n.group+","+n.number,r])))}return this.banks.get(e)}asset(e,t,i){var n,r,a,o,l;if(!t||t.group<0)return null;try{const c=this.bank(e),h=this.indices.get(e).get(t.group+","+t.number);if(h===void 0)return this.issue("missing-sprite",(((n=e==null?void 0:e.sprite)==null?void 0:n.path)||(e==null?void 0:e.path)||"unidentified bank")+": AIR sprite "+t.group+","+t.number+" is absent from source SFF."),null;const f=this.bankIds.get(e),u=f+":"+h;let d=this.spriteMetadata.get(u);if(!d){const T=((r=c.decodeForDisplay)==null?void 0:r.call(c,h))||((a=c.decodeIndexed)==null?void 0:a.call(c,h))||c.decode(h),b=!!T.indices;T.sourceIncomplete&&this.issue("sprite-incomplete",(((o=e==null?void 0:e.sprite)==null?void 0:o.path)||(e==null?void 0:e.path)||"SFF")+" sprite "+t.group+","+t.number+": original PCX contains "+T.decodedPrefixPixels+"/"+T.totalSourcePixels+" encoded pixels. Remaining pixels are transparent; replace source art for native parity."),d={w:T.w,h:T.h,x:T.x||0,y:T.y||0,palette:T.palette,indexed:b,colors:T.colors},this.assets.push({id:u,width:d.w,height:d.h,indexed:b,pixels:new Uint8Array(b?T.indices:T.rgba)}),this.sent.add(u),this.spriteMetadata.set(u,d),c.clearDecodedCache()}const m=d.indexed,x=c.sprites[h],g=(l=c.palettes)==null?void 0:l.find(T=>T.index===(d.palette??x.palette));let p=g?[g.group,g.number]:[1,1];p=(i==null?void 0:i.get(p.join(",")))||(i==null?void 0:i.get("*"))||p;const M=f+":pal:"+p.join(",");if(m&&!this.sent.has(M)){let T;try{T=c.paletteColors(...p)}catch{if(T=d.colors,!T)throw Error("Sprite palette is missing.");this.issue("palette","Requested palette "+p.join(",")+" is unavailable.")}const b=new Uint8Array(1024);b.set(T.subarray(0,1024)),this.assets.push({id:M,width:256,height:1,pixels:b,indexed:!1,role:"palette"}),this.paletteFallbacks.set(M,b.slice()),this.sent.add(M)}return{id:u,paletteId:M,indexed:m,w:d.w,h:d.h,x:d.x||0,y:d.y||0}}catch(c){return this.issue("sprite",c.message),null}}restoreAssets(e){var n,r,a;const t=[];if(this.closed)return t;const i=new Map([...this.bankIds].map(([o,l])=>[String(l),o]));for(const o of new Set(e||[])){if(typeof o!="string"||o.startsWith("@"))continue;const l=o.indexOf(":"),c=i.get(o.slice(0,l));if(l<1||!c)continue;const h=this.banks.get(c);if(h)try{if(o.includes(":pal:")){const f=o.slice(o.indexOf(":pal:")+5).split(",").map(Number);if(f.length!==2||f.some(d=>!Number.isSafeInteger(d)))continue;const u=this.paletteFallbacks.get(o)||h.paletteColors(...f);if(!u||u.length<1024)continue;t.push({id:o,width:256,height:1,indexed:!1,role:"palette",pixels:new Uint8Array(u.slice(0,1024))})}else{const f=Number(o.slice(l+1)),u=this.spriteMetadata.get(o);if(!Number.isSafeInteger(f)||f<0||!u)continue;const d=((n=h.decodeForDisplay)==null?void 0:n.call(h,f))||((r=h.decodeIndexed)==null?void 0:r.call(h,f))||h.decode(f),m=u.indexed?d.indices:d.rgba;if(!m||m.length!==u.w*u.h*(u.indexed?1:4))continue;t.push({id:o,width:u.w,height:u.h,indexed:u.indexed,pixels:new Uint8Array(m)}),(a=h.clearDecodedCache)==null||a.call(h)}}catch(f){this.issue("texture-restore","Could not restore sprite "+o+": "+f.message)}}return t}quad(e,t,i,{x:n=0,y:r=0,sx:a=1,sy:o=1,facing:l=1,angle:c=0,xangle:h=0,yangle:f=0,remaps:u=null,palette:d=null,trans:m=null,mask:x=!0,alpha:g=1,clip:p=null,corners:M=null,axisX:T=null,warp:b=null,sprite:R=null,axisY:S=null,pass:_=1}={}){var H,ne,q;if(!i||e.length>=8192)return;const E=R||this.asset(t,i,u);if(!E)return;a*=l;const O=ju((i.angle||0)+c,h,f),I=(i.flip||"").includes("H")?-1:1,D=(i.flip||"").includes("V")?-1:1,U=a*I*(i.scaleX??1)*O.a,$=o*D*(i.scaleY??1)*O.b,A=a*I*(i.scaleX??1)*O.c,k=o*D*(i.scaleY??1)*O.d;if(![U,$,A,k,n,r,g].every(Number.isFinite)){this.issue("render-transform","A non-finite sprite transform was skipped.");return}((H=d==null?void 0:d.layers)==null?void 0:H.length)>8&&this.issue("palette-limit","This preview can render eight palette layers per sprite.");let X=i.blend||"";return typeof m=="string"?X=m:m&&m.mode!=="default"&&(X=m.mode==="sub"?"S":m.mode==="none"?"":m.mode==="add1"?"A1":`AS${((ne=m.alpha)==null?void 0:ne[0])??256}D${((q=m.alpha)==null?void 0:q[1])??256}`),e.push({texture:E.id,palette:E.paletteId,indexed:E.indexed,width:E.w,height:E.h,matrix:[U,$,A,k,n+(i.x||0)*a-U*(T??E.x)-A*(S??E.y),r+(i.y||0)*o-$*(T??E.x)-k*(S??E.y)],blend:Oa(X),mask:x,alpha:g,palFX:(d==null?void 0:d.layers)||[],clip:p,corners:M,warp:b,pass:_}),E}frame(){var d,m,x,g,p,M,T,b,R;const e=this.match,t=e.view,i=Math.min(960/(t.displayWidth||320),540/(t.displayHeight||240)),n=e.cameraRuntime.camera,r=(540-(t.displayHeight||240)*i)/2+(t.groundY||200)*i,a=i*n.zoom,o=[];this.assets=[];const l=S=>({x:480+(S.x-n.x)*a,y:r+(S.y-n.y)*a}),c=S=>{const _=e.stage;if(!_)return;const E=_.definition,O=E.backgroundScale||1,I=E.coordinateScale*O,D=n.x*O,U=n.y*O;for(const[$,A]of _.elements.entries()){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}if(A.layer!==S||!A.enabled||!A.visible||A.type==="dummy")continue;const k=A.type==="video"?{x:0,y:0}:A.animated?mr(_.animations.get(A.anim),A.drawFrameIndex??A.frameIndex,A.drawFrameTime??A.frameTime):_.frame(A),X=_.position($);if(!k)continue;const H=A.type==="video"?this.videoSprites.get(A.video.key):this.asset(E,k);if(!H)continue;const ne=1+(n.zoom-1)*A.zoomDelta,q=I*i*ne*E.xscale*(A.scaleStart[0]+U/I*A.scaleDelta[0]),ee=I*i*ne*E.yscale*(A.scaleStart[1]+U/I*A.scaleDelta[1]),B=480+(X.x*I-D*X.delta[0])*a,ae=r+(X.y*I-(t.zoffset||0)-U*X.delta[1])*a,be=dd(A,{factor:I,scale:i,cameraX:D,cameraY:U,cropTop:t.cropTop,displayHeight:t.displayHeight});if(A.type==="video"){if(be&&!be.length)continue;const[z,ie]=Au(A.video.scaleMode,H.w,H.h,A.window?A.window[2]-A.window[0]+(A.windowCentered?0:1):E.localcoord[0],A.window?A.window[3]-A.window[1]+(A.windowCentered?0:1):E.localcoord[1]);this.quad(o,null,k,{sprite:H,x:480+(X.x*I-D*X.delta[0])*a,y:270+(X.y*I-U*X.delta[1])*a,sx:q*z,sy:ee*ie,axisX:H.w/2,axisY:H.h/2,clip:be,pass:S===1?2:S,angle:A.angle,xangle:A.xangle,yangle:A.yangle,palette:this.effects.backgroundPalette,mask:!1});continue}for(const z of fd(A,H,k,{x:B,y:ae,sx:q,sy:ee,cameraX:D,cameraY:U,deltaX:X.delta[0],zoom:a,factor:I,clip:be})){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}this.quad(o,E,k,{...z,pass:S===1?2:S,angle:A.angle,xangle:A.xangle,yangle:A.yangle,mask:A.mask,trans:A.transSpecified?{mode:A.trans,alpha:A.alpha}:null,palette:this.effects.backgroundPalette})}}};c(-1),c(0);const h=[],f={alive:0,hidden:0,submitted:0,missingAnimation:0,missingSprite:0};for(const S of[...e.renderEntities,...e.drawProjectiles]){S.parent&&!S.destroyed&&(f.alive++,S.asserted.has("invisible")&&f.hidden++),!S.destroyed&&!S.asserted.has("invisible")&&h.push({priority:S.sprPriority||0,actor:S});for(const _ of S.drawExplods||[])h.push({priority:wu(_),actor:S,effect:_})}for(const S of this.gameEffects)h.push({priority:S.under?-1e3:1e3,gameEffect:S});h.sort((S,_)=>S.priority-_.priority);for(const{actor:S,effect:_,gameEffect:E}of h){if(E){const U=l(E.pos),$=a*(E.scale??this.commonEffects.scale);this.quad(o,E.resource||this.commonEffects.resource,mr(E.animation,E.frameIndex,E.frameTime),{...U,sx:$,sy:$,facing:E.facing,remaps:null,palette:this.effects.paletteFor(E.owner)});continue}if(_){const U=_.common?this.commonEffects.resource:S.character;if(!U){this.issue("common-effects","Character requested an unavailable shared effect sprite bank.");continue}const $=_.space==="screen"?{x:_.pos.x*i,y:_.pos.y*i}:l(_.pos),A=(_.coordinateScale??Vt(S))*a*(_.common?this.commonEffects.scale:1);this.quad(o,U,mr(_.animation,_.frameIndex,_.frameTime),{...$,sx:A*(((d=_.scale)==null?void 0:d[0])??1),sy:A*(((m=_.scale)==null?void 0:m[1])??1)*(_.vfacing||1),facing:_.facing,angle:_.angle||0,xangle:_.xangle||0,yangle:_.yangle||0,remaps:_.common?null:_.ownpal?_.paletteRemaps:S.paletteRemaps,palette:this.effects.paletteFor(_.source||S),trans:_.trans});continue}for(const U of this.effects.trailsFor(S)){const $=l({x:U.pos.x+(((x=U.drawOffset)==null?void 0:x.x)||0),y:U.pos.y+(((g=U.drawOffset)==null?void 0:g.y)||0)}),A=a*U.coordinateScale;this.quad(o,U.character,U.frame,{...$,sx:A*U.sizeX*(U.drawScale.x??1),sy:A*U.sizeY*(U.drawScale.y??1),facing:U.facing,angle:U.angle,remaps:U.paletteRemaps,palette:U.palette,trans:U.trans})}const O=l({x:S.pos.x+(((p=S.drawOffset)==null?void 0:p.x)||0)+Bs(S,"size.draw.offset.x")*Vt(S)*S.facing,y:S.pos.y+(((M=S.drawOffset)==null?void 0:M.y)||0)+Bs(S,"size.draw.offset.y")*Vt(S)}),I=th(S),D=this.quad(o,S.character,I,{...O,sx:a*Vt(S)*Bs(S,"size.xscale",1)*(((T=S.drawScale)==null?void 0:T.x)??1),sy:a*Vt(S)*Bs(S,"size.yscale",1)*(((b=S.drawScale)==null?void 0:b.y)??1),facing:S.facing,angle:S.angleDraw?S.angle:0,remaps:S.paletteRemaps,palette:this.effects.paletteFor(S),trans:S.trans});S.parent&&!S.destroyed&&(I?D?f.submitted++:f.missingSprite++:f.missingAnimation++)}this.helperFrameStats=f,c(1);const u=this.sparks.map(S=>({...l(S),age:S.age,guarded:S.guarded}));return{width:960,height:540,draws:o,assets:this.assets,sparks:u,model:this.modelReady?{time:e.stage.time/60,camera:{...n},coordinateScale:e.stage.definition.coordinateScale,start:e.stage.definition.camera}:null,ground:r,suppressCharacterShadows:e.entities.some(S=>S.asserted.has("globalnoshadow")),grid:!e.stage||!e.stage.definition.sprite&&!this.modelReady&&!this.videoSprites.size,players:[e.player,e.opponent].map(S=>({id:S.id,name:S.name,x:S.pos.x,y:S.pos.y,life:S.life,maxLife:S.maxLife,power:S.power,maxPower:S.maxPower,state:S.stateNo,time:S.time,anim:S.anim})),ticks:e.ticks,roundState:((R=e.roundFlow)==null?void 0:R.roundState)??2,paused:!1,expressions:this.expressions.stats}}snapshot(){var i,n,r,a,o,l,c,h,f,u;const e=this.match.stage,t=this.match.view;return{engine:"Kenjatime Core",compatibility:this.legacyCompatibility,presentation:this.presentation,viewport:e?{displayWidth:t.displayWidth,displayHeight:t.displayHeight,left:t.left,right:t.right,top:t.top,bottom:t.bottom,cameraX:e.camera.x,cameraY:e.camera.y,zoom:e.camera.zoom,backgroundScale:e.definition.backgroundScale,screenLeft:e.definition.screenLeft,screenRight:e.definition.screenRight}:null,players:[this.match.player,this.match.opponent].map(d=>{var m,x,g,p,M,T,b,R,S,_;return{id:d.id,name:d.name,x:d.pos.x,y:d.pos.y,facing:d.facing,liveTargets:d.targets.filter(E=>!E.destroyed).length,life:d.life,maxLife:d.maxLife,power:d.power,maxPower:d.maxPower,state:d.stateNo,time:d.time,moveType:d.moveType,aiLevel:d.aiLevel,ctrl:d.ctrl,r8IdleControlRecoveries:d.r8IdleControlRecoveries||0,stateTime:d.time,velX:d.vel.x,velY:d.vel.y,cpuMode:this.match.cpus.has(d)?this.match.cpus.get(d).nativeAI?"native-cns":this.match.cpus.get(d).authoredAI?"authored-ailevel":"generic":"human",cpuLastCommand:((m=this.match.cpus.get(d))==null?void 0:m.lastCommand)??"",cpuRawInput:[...((x=this.match.cpus.get(d))==null?void 0:x.raw)??[]].sort().join("+"),cpuMatchedCommands:((M=(p=(g=this.match.cpus.get(d))==null?void 0:g.buffer)==null?void 0:p.active)==null?void 0:M.size)??0,legacyAIFlag:d.legacyAIFlag??null,legacyAIValue:d.legacyAIFlag===void 0?null:d.vars[d.legacyAIFlag],controllerDiagnostics:d.diagnostics.filter(E=>["controller","parameter-bottom","missing-state","state-loop","unsupported-controller","unsupported-trigger"].includes(E.type)).length,hitPauseTime:d.hitPauseTime,pendingStateNo:((T=d._pendingStateEntry)==null?void 0:T.number)??null,pendingStateOwnerId:((R=(b=d._pendingStateEntry)==null?void 0:b.owner)==null?void 0:R.id)??null,anim:d.anim,animElem:d.frameIndex+1,stateOwnerId:((S=d.stateOwner)==null?void 0:S.id)??d.id,animationOwnerId:((_=d.animationOwner)==null?void 0:_.id)??d.id}}),ticks:this.match.ticks,helperStats:{...this.match.helperStats},helperFrameStats:{...this.helperFrameStats},helpers:this.match.entities.filter(d=>d.parent).map(d=>{var m,x,g,p,M,T,b,R,S,_;return{id:d.id,helperId:d.helperId,parentId:(m=d.parent)==null?void 0:m.id,rootId:(x=d.root)==null?void 0:x.id,state:d.stateNo,anim:d.anim,moveType:d.moveType,hitPauseTime:d.hitPauseTime,pendingStateNo:((g=d._pendingStateEntry)==null?void 0:g.number)??null,pendingStateOwnerId:((M=(p=d._pendingStateEntry)==null?void 0:p.owner)==null?void 0:M.id)??null,stateOwnerId:((T=d.stateOwner)==null?void 0:T.id)??d.id,animationOwnerId:((b=d.animationOwner)==null?void 0:b.id)??d.id,boundTargetId:((S=(R=d.bound)==null?void 0:R.target)==null?void 0:S.id)??null,bindTime:((_=d.bound)==null?void 0:_.time)??null,frame:d.frameIndex,x:d.pos.x,y:d.pos.y,facing:d.facing,liveTargets:d.targets.filter(E=>!E.destroyed).length,invisible:d.asserted.has("invisible")}}),roundState:((i=this.match.roundFlow)==null?void 0:i.roundState)??2,roundNo:((n=this.match.roundFlow)==null?void 0:n.roundNo)??1,roundPhaseTime:((r=this.match.roundFlow)==null?void 0:r.phaseTime)??0,roundTimeLeft:((a=this.match.roundFlow)==null?void 0:a.timeLeft)??-1,roundKoHoldTicks:[...((o=this.match.roundFlow)==null?void 0:o.zeroLifeNoKOTicks)||[0,0]],endlessMode:((l=this.match.roundFlow)==null?void 0:l.rules.endless)===!0,roundWins:{...((c=this.match.roundFlow)==null?void 0:c.wins)||{player:0,opponent:0}},roundWinner:((h=this.match.roundFlow)==null?void 0:h.roundWinner)??null,roundReason:((f=this.match.roundFlow)==null?void 0:f.reason)??null,matchOver:((u=this.match.roundFlow)==null?void 0:u.matchOver)??!1,expressions:this.expressions.stats,capabilities:this.capabilities,diagnostics:[...this.match.diagnostics,...this.issues.values()]}}drainEvents(){const e=this.events;return this.events=[],e}close(){var e,t,i,n;if(!this.closed){(e=this.lua)==null||e.close();try{(n=(i=(t=this.match)==null?void 0:t.kotlinCombatKernel)==null?void 0:i.dispose)==null||n.call(i)}finally{this.match&&(this.match.kotlinCombatKernel=null)}this.closed=!0;for(const r of this.banks.values())r.clearDecodedCache();this.banks.clear(),this.sent.clear(),this.paletteFallbacks.clear(),this.gameEffects=[],this.events=[]}}}function Md(s,e,t,i,n=new Set){var o,l;if(!Number.isSafeInteger(t)||t<0||!Number.isSafeInteger(i)||i<0||t>i)return null;let r=e+t-i;if(r<=0)return[];const a=[];for(const[c,h]of s){if(n.has(c)||c==="@white"||c==="@spark")continue;const f=((o=h==null?void 0:h.userData)==null?void 0:o.residentBytes)??((l=h==null?void 0:h.userData)==null?void 0:l.videoBytes)??0;if(!(f<=0)&&(a.push(c),r-=f,r<=0))return a}return null}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Fo="187",bd=0,Dl=1,Ed=2,gr=1,Td=2,gs=3,pn=0,Wt=1,fi=2,Hn=0,ys=1,Ul=2,Fl=3,Ol=4,sh=5,Di=100,wd=101,rh=102,Ad=103,Rd=104,Cd=200,ka=201,Pd=202,Id=203,ah=204,Ar=205,Ld=206,Nd=207,Dd=208,Ud=209,Fd=210,Od=211,Bd=212,kd=213,zd=214,za=0,Ha=1,Va=2,bs=3,Ga=4,Wa=5,Xa=6,qa=7,oh=0,Hd=1,Vd=2,ki=0,lh=1,ch=2,hh=3,uh=4,dh=5,fh=6,ph=7,Bl="attached",Gd="detached",mh=300,Wn=301,Es=302,ta=303,ia=304,Ya=1e3,$t=1001,$a=1002,bt=1003,Wd=1004,ks=1005,Ct=1006,na=1007,Oi=1008,Gt=1009,gh=1010,_h=1011,Ts=1012,Oo=1013,Mi=1014,ni=1015,bi=1016,Bo=1017,ko=1018,Xn=1020,vh=35902,xh=35899,yh=1021,Sh=1022,si=1023,en=1026,Qi=1027,kr=1028,zo=1029,mn=1030,Ho=1031,Vo=1033,_r=33776,vr=33777,xr=33778,yr=33779,Ka=35840,Za=35841,Ja=35842,ja=35843,Qa=36196,eo=37492,to=37496,io=37488,no=37489,Rr=37490,so=37491,ro=37808,ao=37809,oo=37810,lo=37811,co=37812,ho=37813,uo=37814,fo=37815,po=37816,mo=37817,go=37818,_o=37819,vo=37820,xo=37821,yo=36492,So=36494,Mo=36495,bo=36283,Eo=36284,Cr=36285,To=36286,Xd=2200,qd=2201,Yd=2202,Pr=2300,wo=2301,sa=2302,kl=2303,kn=2400,zn=2401,Ir=2402,Go=2500,$d=2501,Gv=0,Wv=1,Xv=2,Kd=3200,Ao=0,Zd=1,Ui="",ti="srgb",ws="srgb-linear",Lr="linear",ht="srgb",ra=7680,Jd=519,jd=512,Qd=513,ef=514,Mh=515,tf=516,nf=517,bh=518,Eh=519,Th=35044,Nr="300 es",mi=2e3,As=2001;function sf(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function rf(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Rs(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function af(){const s=Rs("canvas");return s.style.display="block",s}const zl={};function Dr(...s){const e="THREE."+s.shift();console.log(e,...s)}function wh(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function De(...s){s=wh(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function ke(...s){s=wh(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function Vn(...s){const e=s.join(" ");e in zl||(zl[e]=!0,De(...s))}function of(s,e,t){return new Promise(function(i,n){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:n();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const lf={[za]:za,[Va]:Xa,[Ga]:Ga,[bs]:Wa,[Ha]:Ha,[Xa]:Va,[qa]:qa,[Wa]:bs};class nn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const n=i[e];if(n!==void 0){const r=n.indexOf(t);r!==-1&&n.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const n=i.slice(0);for(let r=0,a=n.length;r<a;r++)n[r].call(this,e);e.target=null}}}const Ut=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Hl=1234567;const Ss=Math.PI/180,qn=180/Math.PI;function Ei(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ut[s&255]+Ut[s>>8&255]+Ut[s>>16&255]+Ut[s>>24&255]+"-"+Ut[e&255]+Ut[e>>8&255]+"-"+Ut[e>>16&15|64]+Ut[e>>24&255]+"-"+Ut[t&63|128]+Ut[t>>8&255]+"-"+Ut[t>>16&255]+Ut[t>>24&255]+Ut[i&255]+Ut[i>>8&255]+Ut[i>>16&255]+Ut[i>>24&255]).toLowerCase()}function Je(s,e,t){return Math.max(e,Math.min(t,s))}function Wo(s,e){return(s%e+e)%e}function cf(s,e,t,i,n){return i+(s-e)*(n-i)/(t-e)}function hf(s,e,t){return s!==e?(t-s)/(e-s):0}function Ms(s,e,t){return(1-t)*s+t*e}function uf(s,e,t,i){return Ms(s,e,1-Math.exp(-t*i))}function df(s,e=1){return e-Math.abs(Wo(s,e*2)-e)}function ff(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function pf(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function mf(s,e){return s+Math.floor(Math.random()*(e-s+1))}function gf(s,e){return s+Math.random()*(e-s)}function _f(s){return s*(.5-Math.random())}function vf(s){s!==void 0&&(Hl=s);let e=Hl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function xf(s){return s*Ss}function yf(s){return s*qn}function Sf(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function Mf(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Ah(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function bf(s,e,t,i,n){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),h=a((e+i)/2),f=r((e-i)/2),u=a((e-i)/2),d=r((i-e)/2),m=a((i-e)/2);switch(n){case"XYX":s.set(o*h,l*f,l*u,o*c);break;case"YZY":s.set(l*u,o*h,l*f,o*c);break;case"ZXZ":s.set(l*f,l*u,o*h,o*c);break;case"XZX":s.set(o*h,l*m,l*d,o*c);break;case"YXY":s.set(l*d,o*h,l*m,o*c);break;case"ZYZ":s.set(l*m,l*d,o*h,o*c);break;default:De("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function zr(s){switch(s.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Xo(s,e){if(e.constructor===Float32Array)return s;const t=zr(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(s/t,-1)}function qo(s,e){if(e.constructor===Float32Array)return s;const t=zr(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(s*t)}const qv={DEG2RAD:Ss,RAD2DEG:qn,generateUUID:Ei,clamp:Je,euclideanModulo:Wo,mapLinear:cf,inverseLerp:hf,lerp:Ms,damp:uf,pingpong:df,smoothstep:ff,smootherstep:pf,randInt:mf,randFloat:gf,randFloatSpread:_f,seededRandom:vf,degToRad:xf,radToDeg:yf,isPowerOfTwo:Sf,ceilPowerOfTwo:Mf,floorPowerOfTwo:Ah,setQuaternionFromProperEuler:bf,normalize:qo,denormalize:Xo},il=class il{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6],this.y=n[1]*t+n[4]*i+n[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),n=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*n+e.x,this.y=r*n+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};il.prototype.isVector2=!0;let st=il;class yi{constructor(e=0,t=0,i=0,n=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=n}static slerpFlat(e,t,i,n,r,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],f=i[n+3],u=r[a+0],d=r[a+1],m=r[a+2],x=r[a+3];if(f!==x||l!==u||c!==d||h!==m){let g=l*u+c*d+h*m+f*x;g<0&&(u=-u,d=-d,m=-m,x=-x,g=-g);let p=1-o;if(g<.9995){const M=Math.acos(g),T=Math.sin(M);p=Math.sin(p*M)/T,o=Math.sin(o*M)/T,l=l*p+u*o,c=c*p+d*o,h=h*p+m*o,f=f*p+x*o}else{l=l*p+u*o,c=c*p+d*o,h=h*p+m*o,f=f*p+x*o;const M=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=M,c*=M,h*=M,f*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,n,r,a){const o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],f=r[a],u=r[a+1],d=r[a+2],m=r[a+3];return e[t]=o*m+h*f+l*d-c*u,e[t+1]=l*m+h*u+c*f-o*d,e[t+2]=c*m+h*d+o*u-l*f,e[t+3]=h*m-o*f-l*u-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,n){return this._x=e,this._y=t,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,n=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),f=o(r/2),u=l(i/2),d=l(n/2),m=l(r/2);switch(a){case"XYZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"YXZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"ZXY":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"ZYX":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"YZX":this._x=u*h*f+c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f-u*d*m;break;case"XZY":this._x=u*h*f-c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f+u*d*m;break;default:De("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,n=Math.sin(i);return this._x=e.x*n,this._y=e.y*n,this._z=e.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],n=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],u=i+o+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-n)*d}else if(i>o&&i>f){const d=2*Math.sqrt(1+i-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(n+a)/d,this._z=(r+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-i-f);this._w=(r-c)/d,this._x=(n+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-i-o);this._w=(a-n)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Je(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const n=Math.min(1,t/i);return this.slerp(e,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,n=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+n*c-r*l,this._y=n*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,n=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,n=-n,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+n*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+n*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(n*Math.sin(e),n*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const nl=class nl{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Vl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Vl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*n,this.y=r[1]*t+r[4]*i+r[7]*n,this.z=r[2]*t+r[5]*i+r[8]*n,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*n+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*n+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*n+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*n+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,n=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*n-o*i),h=2*(o*t-r*n),f=2*(r*i-a*t);return this.x=t+l*c+a*f-o*h,this.y=i+l*h+o*c-r*f,this.z=n+l*f+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,n=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*n,this.y=r[1]*t+r[5]*i+r[9]*n,this.z=r[2]*t+r[6]*i+r[10]*n,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,n=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=n*l-r*o,this.y=r*a-i*l,this.z=i*o-n*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return aa.copy(this).projectOnVector(e),this.sub(aa)}reflect(e){return this.sub(aa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,n=this.z-e.z;return t*t+i*i+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const n=Math.sin(t)*e;return this.x=n*Math.sin(i),this.y=Math.cos(t)*e,this.z=n*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),n=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=n,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};nl.prototype.isVector3=!0;let Y=nl;const aa=new Y,Vl=new yi,sl=class sl{constructor(e,t,i,n,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,l,c)}set(e,t,i,n,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=n,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],u=i[2],d=i[5],m=i[8],x=n[0],g=n[3],p=n[6],M=n[1],T=n[4],b=n[7],R=n[2],S=n[5],_=n[8];return r[0]=a*x+o*M+l*R,r[3]=a*g+o*T+l*S,r[6]=a*p+o*b+l*_,r[1]=c*x+h*M+f*R,r[4]=c*g+h*T+f*S,r[7]=c*p+h*b+f*_,r[2]=u*x+d*M+m*R,r[5]=u*g+d*T+m*S,r[8]=u*p+d*b+m*_,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+n*r*c-n*a*l}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*a-o*c,u=o*l-h*r,d=c*r-a*l,m=t*f+i*u+n*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;return e[0]=f*x,e[1]=(n*c-h*i)*x,e[2]=(o*i-n*a)*x,e[3]=u*x,e[4]=(h*t-n*l)*x,e[5]=(n*r-o*t)*x,e[6]=d*x,e[7]=(i*l-c*t)*x,e[8]=(a*t-i*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,n,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-n*c,n*l,-n*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Vn("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(oa.makeScale(e,t)),this}rotate(e){return Vn("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(oa.makeRotation(-e)),this}translate(e,t){return Vn("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(oa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<9;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};sl.prototype.isMatrix3=!0;let He=sl;const oa=new He,Gl=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Wl=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ef(){const s={enabled:!0,workingColorSpace:ws,spaces:{},convert:function(n,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ht&&(n.r=zi(n.r),n.g=zi(n.g),n.b=zi(n.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[r].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ht&&(n.r=Gn(n.r),n.g=Gn(n.g),n.b=Gn(n.b))),n},workingToColorSpace:function(n,r){return this.convert(n,this.workingColorSpace,r)},colorSpaceToWorking:function(n,r){return this.convert(n,r,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Ui?Lr:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,r=this.workingColorSpace){return n.fromArray(this.spaces[r].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,r,a){return n.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return s.define({[ws]:{primaries:e,whitePoint:i,transfer:Lr,toXYZ:Gl,fromXYZ:Wl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ti},outputColorSpaceConfig:{drawingBufferColorSpace:ti}},[ti]:{primaries:e,whitePoint:i,transfer:ht,toXYZ:Gl,fromXYZ:Wl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ti}}}),s}const nt=Ef();function zi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Gn(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Mn;class Tf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Mn===void 0&&(Mn=Rs("canvas")),Mn.width=e.width,Mn.height=e.height;const n=Mn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),i=Mn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Rs("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const n=i.getImageData(0,0,e.width,e.height),r=n.data;for(let a=0;a<r.length;a++)r[a]=zi(r[a]/255)*255;return i.putImageData(n,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(zi(t[i]/255)*255):t[i]=zi(t[i]);return{data:t,width:e.width,height:e.height}}else return De("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let wf=0;class Yo{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:wf++}),this.uuid=Ei(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let r;if(Array.isArray(n)){r=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?r.push(la(n[a].image)):r.push(la(n[a]))}else r=la(n);i.url=r}return t||(e.images[this.uuid]=i),i}}function la(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Tf.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(De("Texture: Unable to serialize Texture."),{})}let Af=0;const ca=new Y;class It extends nn{constructor(e=It.DEFAULT_IMAGE,t=It.DEFAULT_MAPPING,i=$t,n=$t,r=Ct,a=Oi,o=si,l=Gt,c=It.DEFAULT_ANISOTROPY,h=Ui){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Af++}),this.uuid=Ei(),this.name="",this.source=new Yo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new st(0,0),this.repeat=new st(1,1),this.center=new st(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ca).x}get height(){return this.source.getSize(ca).y}get depth(){return this.source.getSize(ca).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){De(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){De(`Texture.setValues(): property '${t}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==mh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ya:e.x=e.x-Math.floor(e.x);break;case $t:e.x=e.x<0?0:1;break;case $a:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ya:e.y=e.y-Math.floor(e.y);break;case $t:e.y=e.y<0?0:1;break;case $a:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}It.DEFAULT_IMAGE=null;It.DEFAULT_MAPPING=mh;It.DEFAULT_ANISOTROPY=1;const rl=class rl{constructor(e=0,t=0,i=0,n=1){this.x=e,this.y=t,this.z=i,this.w=n}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,n){return this.x=e,this.y=t,this.z=i,this.w=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,n=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*n+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*n+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*n+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*n+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,n,r;const l=e.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],m=l[9],x=l[2],g=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+x)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,b=(d+1)/2,R=(p+1)/2,S=(h+u)/4,_=(f+x)/4,E=(m+g)/4;return T>b&&T>R?T<.01?(i=0,n=.707106781,r=.707106781):(i=Math.sqrt(T),n=S/i,r=_/i):b>R?b<.01?(i=.707106781,n=0,r=.707106781):(n=Math.sqrt(b),i=S/n,r=E/n):R<.01?(i=.707106781,n=.707106781,r=0):(r=Math.sqrt(R),i=_/r,n=E/r),this.set(i,n,r,t),this}let M=Math.sqrt((g-m)*(g-m)+(f-x)*(f-x)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(f-x)/M,this.z=(u-h)/M,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this.w=Je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this.w=Je(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};rl.prototype.isVector4=!0;let dt=rl;class Rf extends nn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ct,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t),this.textures=[];const n=i.count;for(let r=0;r<n;r++)this.textures[r]=new It({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Ct,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let n=0,r=this.textures.length;n<r;n++)this.textures[n].image.width=e,this.textures[n].image.height=t,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const n=Object.assign({},e.textures[t].image);this.textures[t].source=new Yo(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Si extends Rf{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Rh extends It{constructor(e=null,t=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=bt,this.minFilter=bt,this.wrapR=$t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Cf extends It{constructor(e=null,t=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:n},this.magFilter=bt,this.minFilter=bt,this.wrapR=$t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Br=class Br{constructor(e,t,i,n,r,a,o,l,c,h,f,u,d,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,n,r,a,o,l,c,h,f,u,d,m,x,g)}set(e,t,i,n,r,a,o,l,c,h,f,u,d,m,x,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=n,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Br().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,n=1/bn.setFromMatrixColumn(e,0).length(),r=1/bn.setFromMatrixColumn(e,1).length(),a=1/bn.setFromMatrixColumn(e,2).length();return t[0]=i[0]*n,t[1]=i[1]*n,t[2]=i[2]*n,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,n=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const u=a*h,d=a*f,m=o*h,x=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=d+m*c,t[5]=u-x*c,t[9]=-o*l,t[2]=x-u*c,t[6]=m+d*c,t[10]=a*l}else if(e.order==="YXZ"){const u=l*h,d=l*f,m=c*h,x=c*f;t[0]=u+x*o,t[4]=m*o-d,t[8]=a*c,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=d*o-m,t[6]=x+u*o,t[10]=a*l}else if(e.order==="ZXY"){const u=l*h,d=l*f,m=c*h,x=c*f;t[0]=u-x*o,t[4]=-a*f,t[8]=m+d*o,t[1]=d+m*o,t[5]=a*h,t[9]=x-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const u=a*h,d=a*f,m=o*h,x=o*f;t[0]=l*h,t[4]=m*c-d,t[8]=u*c+x,t[1]=l*f,t[5]=x*c+u,t[9]=d*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const u=a*l,d=a*c,m=o*l,x=o*c;t[0]=l*h,t[4]=x-u*f,t[8]=m*f+d,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=d*f+m,t[10]=u-x*f}else if(e.order==="XZY"){const u=a*l,d=a*c,m=o*l,x=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=u*f+x,t[5]=a*h,t[9]=d*f-m,t[2]=m*f-d,t[6]=o*h,t[10]=x*f+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Pf,e,If)}lookAt(e,t,i){const n=this.elements;return qt.subVectors(e,t),qt.lengthSq()===0&&(qt.z=1),qt.normalize(),Xi.crossVectors(i,qt),Xi.lengthSq()===0&&(Math.abs(i.z)===1?qt.x+=1e-4:qt.z+=1e-4,qt.normalize(),Xi.crossVectors(i,qt)),Xi.normalize(),zs.crossVectors(qt,Xi),n[0]=Xi.x,n[4]=zs.x,n[8]=qt.x,n[1]=Xi.y,n[5]=zs.y,n[9]=qt.y,n[2]=Xi.z,n[6]=zs.z,n[10]=qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,n=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],u=i[9],d=i[13],m=i[2],x=i[6],g=i[10],p=i[14],M=i[3],T=i[7],b=i[11],R=i[15],S=n[0],_=n[4],E=n[8],O=n[12],I=n[1],D=n[5],U=n[9],$=n[13],A=n[2],k=n[6],X=n[10],H=n[14],ne=n[3],q=n[7],ee=n[11],B=n[15];return r[0]=a*S+o*I+l*A+c*ne,r[4]=a*_+o*D+l*k+c*q,r[8]=a*E+o*U+l*X+c*ee,r[12]=a*O+o*$+l*H+c*B,r[1]=h*S+f*I+u*A+d*ne,r[5]=h*_+f*D+u*k+d*q,r[9]=h*E+f*U+u*X+d*ee,r[13]=h*O+f*$+u*H+d*B,r[2]=m*S+x*I+g*A+p*ne,r[6]=m*_+x*D+g*k+p*q,r[10]=m*E+x*U+g*X+p*ee,r[14]=m*O+x*$+g*H+p*B,r[3]=M*S+T*I+b*A+R*ne,r[7]=M*_+T*D+b*k+R*q,r[11]=M*E+T*U+b*X+R*ee,r[15]=M*O+T*$+b*H+R*B,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],n=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],u=e[10],d=e[14],m=e[3],x=e[7],g=e[11],p=e[15],M=l*d-c*u,T=o*d-c*f,b=o*u-l*f,R=a*d-c*h,S=a*u-l*h,_=a*f-o*h;return t*(x*M-g*T+p*b)-i*(m*M-g*R+p*S)+n*(m*T-x*R+p*_)-r*(m*b-x*S+g*_)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],n=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-i*(r*h-o*l)+n*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const n=this.elements;return e.isVector3?(n[12]=e.x,n[13]=e.y,n[14]=e.z):(n[12]=e,n[13]=t,n[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],n=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],u=e[10],d=e[11],m=e[12],x=e[13],g=e[14],p=e[15],M=t*o-i*a,T=t*l-n*a,b=t*c-r*a,R=i*l-n*o,S=i*c-r*o,_=n*c-r*l,E=h*x-f*m,O=h*g-u*m,I=h*p-d*m,D=f*g-u*x,U=f*p-d*x,$=u*p-d*g,A=M*$-T*U+b*D+R*I-S*O+_*E;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/A;return e[0]=(o*$-l*U+c*D)*k,e[1]=(n*U-i*$-r*D)*k,e[2]=(x*_-g*S+p*R)*k,e[3]=(u*S-f*_-d*R)*k,e[4]=(l*I-a*$-c*O)*k,e[5]=(t*$-n*I+r*O)*k,e[6]=(g*b-m*_-p*T)*k,e[7]=(h*_-u*b+d*T)*k,e[8]=(a*U-o*I+c*E)*k,e[9]=(i*I-t*U-r*E)*k,e[10]=(m*S-x*b+p*M)*k,e[11]=(f*b-h*S-d*M)*k,e[12]=(o*O-a*D-l*E)*k,e[13]=(t*D-i*O+n*E)*k,e[14]=(x*T-m*R-g*M)*k,e[15]=(h*R-f*T+u*M)*k,this}scale(e){const t=this.elements,i=e.x,n=e.y,r=e.z;return t[0]*=i,t[4]*=n,t[8]*=r,t[1]*=i,t[5]*=n,t[9]*=r,t[2]*=i,t[6]*=n,t[10]*=r,t[3]*=i,t[7]*=n,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],n=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,n))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),n=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,n,r,a){return this.set(1,i,r,0,e,1,a,0,t,n,1,0,0,0,0,1),this}compose(e,t,i){const n=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,f=o+o,u=r*c,d=r*h,m=r*f,x=a*h,g=a*f,p=o*f,M=l*c,T=l*h,b=l*f,R=i.x,S=i.y,_=i.z;return n[0]=(1-(x+p))*R,n[1]=(d+b)*R,n[2]=(m-T)*R,n[3]=0,n[4]=(d-b)*S,n[5]=(1-(u+p))*S,n[6]=(g+M)*S,n[7]=0,n[8]=(m+T)*_,n[9]=(g-M)*_,n[10]=(1-(u+x))*_,n[11]=0,n[12]=e.x,n[13]=e.y,n[14]=e.z,n[15]=1,this}decompose(e,t,i){const n=this.elements;e.x=n[12],e.y=n[13],e.z=n[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=bn.set(n[0],n[1],n[2]).length();const o=bn.set(n[4],n[5],n[6]).length(),l=bn.set(n[8],n[9],n[10]).length();r<0&&(a=-a),ci.copy(this);const c=1/a,h=1/o,f=1/l;return ci.elements[0]*=c,ci.elements[1]*=c,ci.elements[2]*=c,ci.elements[4]*=h,ci.elements[5]*=h,ci.elements[6]*=h,ci.elements[8]*=f,ci.elements[9]*=f,ci.elements[10]*=f,t.setFromRotationMatrix(ci),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,n,r,a,o=mi,l=!1){const c=this.elements,h=2*r/(t-e),f=2*r/(i-n),u=(t+e)/(t-e),d=(i+n)/(i-n);let m,x;if(l)m=r/(a-r),x=a*r/(a-r);else if(o===mi)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===As)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,n,r,a,o=mi,l=!1){const c=this.elements,h=2/(t-e),f=2/(i-n),u=-(t+e)/(t-e),d=-(i+n)/(i-n);let m,x;if(l)m=1/(a-r),x=a/(a-r);else if(o===mi)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===As)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let n=0;n<16;n++)if(t[n]!==i[n])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Br.prototype.isMatrix4=!0;let Qe=Br;const bn=new Y,ci=new Qe,Pf=new Y(0,0,0),If=new Y(1,1,1),Xi=new Y,zs=new Y,qt=new Y,Xl=new Qe,ql=new yi;class tn{constructor(e=0,t=0,i=0,n=tn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=n}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,n=this._order){return this._x=e,this._y=t,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const n=e.elements,r=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],f=n[2],u=n[6],d=n[10];switch(t){case"XYZ":this._y=Math.asin(Je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Je(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Je(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:De("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Xl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Xl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ql.setFromEuler(this),this.setFromQuaternion(ql,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}tn.DEFAULT_ORDER="XYZ";class Ch{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Lf=0;const Yl=new Y,En=new yi,Ri=new Qe,Hs=new Y,as=new Y,Nf=new Y,Df=new yi,$l=new Y(1,0,0),Kl=new Y(0,1,0),Zl=new Y(0,0,1),Jl={type:"added"},Uf={type:"removed"},Tn={type:"childadded",child:null},ha={type:"childremoved",child:null};class xt extends nn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Lf++}),this.uuid=Ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xt.DEFAULT_UP.clone();const e=new Y,t=new tn,i=new yi,n=new Y(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new Qe},normalMatrix:{value:new He}}),this.matrix=new Qe,this.matrixWorld=new Qe,this.matrixAutoUpdate=xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ch,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return En.setFromAxisAngle(e,t),this.quaternion.multiply(En),this}rotateOnWorldAxis(e,t){return En.setFromAxisAngle(e,t),this.quaternion.premultiply(En),this}rotateX(e){return this.rotateOnAxis($l,e)}rotateY(e){return this.rotateOnAxis(Kl,e)}rotateZ(e){return this.rotateOnAxis(Zl,e)}translateOnAxis(e,t){return Yl.copy(e).applyQuaternion(this.quaternion),this.position.add(Yl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis($l,e)}translateY(e){return this.translateOnAxis(Kl,e)}translateZ(e){return this.translateOnAxis(Zl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ri.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Hs.copy(e):Hs.set(e,t,i);const n=this.parent;this.updateWorldMatrix(!0,!1),as.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ri.lookAt(as,Hs,this.up):Ri.lookAt(Hs,as,this.up),this.quaternion.setFromRotationMatrix(Ri),n&&(Ri.extractRotation(n.matrixWorld),En.setFromRotationMatrix(Ri),this.quaternion.premultiply(En.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Jl),Tn.child=e,this.dispatchEvent(Tn),Tn.child=null):ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Uf),ha.child=e,this.dispatchEvent(ha),ha.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ri.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ri.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ri),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Jl),Tn.child=e,this.dispatchEvent(Tn),Tn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const n=this.children;for(let r=0,a=n.length;r<a;r++)n[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,e,Nf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,Df,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,n=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*n,r[13]+=i-r[1]*t-r[5]*i-r[9]*n,r[14]+=n-r[2]*t-r[6]*i-r[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,n=t.length;i<n;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,n.name=this.name,n.castShadow=this.castShadow,n.receiveShadow=this.receiveShadow,n.visible=this.visible,n.frustumCulled=this.frustumCulled,n.renderOrder=this.renderOrder,n.static=this.static,n.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(e),n.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));n.material=o}else n.material=r(e.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),f=a(e.shapes),u=a(e.skeletons),d=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),u.length>0&&(i.skeletons=u),d.length>0&&(i.animations=d),m.length>0&&(i.nodes=m)}return i.object=n,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const n=e.children[i];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}xt.DEFAULT_UP=new Y(0,1,0);xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Vs extends xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ff={type:"move"};class ua{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Vs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Vs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Vs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let n=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const x of e.hand.values()){const g=t.getJointPose(x,i),p=this._getHandJoint(c,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,m=.005;c.inputState.pinching&&u>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(n=t.getPose(e.targetRaySpace,i),n===null&&r!==null&&(n=r),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ff)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Vs;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Ph={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qi={h:0,s:0,l:0},Gs={h:0,s:0,l:0};function da(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ke{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const n=e;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ti){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,nt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,n=nt.workingColorSpace){return this.r=e,this.g=t,this.b=i,nt.colorSpaceToWorking(this,n),this}setHSL(e,t,i,n=nt.workingColorSpace){if(e=Wo(e,1),t=Je(t,0,1),i=Je(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=da(a,r,e+1/3),this.g=da(a,r,e),this.b=da(a,r,e-1/3)}return nt.colorSpaceToWorking(this,n),this}setStyle(e,t=ti){function i(r){r!==void 0&&parseFloat(r)<1&&De("Color: Alpha component of "+e+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:De("Color: Unknown color model "+e)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=n[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);De("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ti){const i=Ph[e.toLowerCase()];return i!==void 0?this.setHex(i,t):De("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zi(e.r),this.g=zi(e.g),this.b=zi(e.b),this}copyLinearToSRGB(e){return this.r=Gn(e.r),this.g=Gn(e.g),this.b=Gn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ti){return nt.workingToColorSpace(Ft.copy(this),e),Math.round(Je(Ft.r*255,0,255))*65536+Math.round(Je(Ft.g*255,0,255))*256+Math.round(Je(Ft.b*255,0,255))}getHexString(e=ti){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=nt.workingColorSpace){nt.workingToColorSpace(Ft.copy(this),t);const i=Ft.r,n=Ft.g,r=Ft.b,a=Math.max(i,n,r),o=Math.min(i,n,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case i:l=(n-r)/f+(n<r?6:0);break;case n:l=(r-i)/f+2;break;case r:l=(i-n)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=nt.workingColorSpace){return nt.workingToColorSpace(Ft.copy(this),t),e.r=Ft.r,e.g=Ft.g,e.b=Ft.b,e}getStyle(e=ti){nt.workingToColorSpace(Ft.copy(this),e);const t=Ft.r,i=Ft.g,n=Ft.b;return e!==ti?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(e,t,i){return this.getHSL(qi),this.setHSL(qi.h+e,qi.s+t,qi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(qi),e.getHSL(Gs);const i=Ms(qi.h,Gs.h,t),n=Ms(qi.s,Gs.s,t),r=Ms(qi.l,Gs.l,t);return this.setHSL(i,n,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,n=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*n,this.g=r[1]*t+r[4]*i+r[7]*n,this.b=r[2]*t+r[5]*i+r[8]*n,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ft=new Ke;Ke.NAMES=Ph;class Of extends xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new tn,this.environmentIntensity=1,this.environmentRotation=new tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const hi=new Y,Ci=new Y,fa=new Y,Pi=new Y,wn=new Y,An=new Y,jl=new Y,pa=new Y,ma=new Y,ga=new Y,_a=new dt,va=new dt,xa=new dt;class pi{constructor(e=new Y,t=new Y,i=new Y){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,n){n.subVectors(i,t),hi.subVectors(e,t),n.cross(hi);const r=n.lengthSq();return r>0?n.multiplyScalar(1/Math.sqrt(r)):n.set(0,0,0)}static getBarycoord(e,t,i,n,r){hi.subVectors(n,t),Ci.subVectors(i,t),fa.subVectors(e,t);const a=hi.dot(hi),o=hi.dot(Ci),l=hi.dot(fa),c=Ci.dot(Ci),h=Ci.dot(fa),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,d=(c*l-o*h)*u,m=(a*h-o*l)*u;return r.set(1-d-m,m,d)}static containsPoint(e,t,i,n){return this.getBarycoord(e,t,i,n,Pi)===null?!1:Pi.x>=0&&Pi.y>=0&&Pi.x+Pi.y<=1}static getInterpolation(e,t,i,n,r,a,o,l){return this.getBarycoord(e,t,i,n,Pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Pi.x),l.addScaledVector(a,Pi.y),l.addScaledVector(o,Pi.z),l)}static getInterpolatedAttribute(e,t,i,n,r,a){return _a.setScalar(0),va.setScalar(0),xa.setScalar(0),_a.fromBufferAttribute(e,t),va.fromBufferAttribute(e,i),xa.fromBufferAttribute(e,n),a.setScalar(0),a.addScaledVector(_a,r.x),a.addScaledVector(va,r.y),a.addScaledVector(xa,r.z),a}static isFrontFacing(e,t,i,n){return hi.subVectors(i,t),Ci.subVectors(e,t),hi.cross(Ci).dot(n)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,n){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[n]),this}setFromAttributeAndIndices(e,t,i,n){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,n),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return hi.subVectors(this.c,this.b),Ci.subVectors(this.a,this.b),hi.cross(Ci).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return pi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return pi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,n,r){return pi.getInterpolation(e,this.a,this.b,this.c,t,i,n,r)}containsPoint(e){return pi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return pi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,n=this.b,r=this.c;let a,o;wn.subVectors(n,i),An.subVectors(r,i),pa.subVectors(e,i);const l=wn.dot(pa),c=An.dot(pa);if(l<=0&&c<=0)return t.copy(i);ma.subVectors(e,n);const h=wn.dot(ma),f=An.dot(ma);if(h>=0&&f<=h)return t.copy(n);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),t.copy(i).addScaledVector(wn,a);ga.subVectors(e,r);const d=wn.dot(ga),m=An.dot(ga);if(m>=0&&d<=m)return t.copy(r);const x=d*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(An,o);const g=h*m-d*f;if(g<=0&&f-h>=0&&d-m>=0)return jl.subVectors(r,n),o=(f-h)/(f-h+(d-m)),t.copy(n).addScaledVector(jl,o);const p=1/(g+x+u);return a=x*p,o=u*p,t.copy(i).addScaledVector(wn,a).addScaledVector(An,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class sn{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ui.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ui.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ui.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ui):ui.fromBufferAttribute(r,a),ui.applyMatrix4(e.matrixWorld),this.expandByPoint(ui);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ws.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ws.copy(i.boundingBox)),Ws.applyMatrix4(e.matrixWorld),this.union(Ws)}const n=e.children;for(let r=0,a=n.length;r<a;r++)this.expandByObject(n[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ui),ui.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(os),Xs.subVectors(this.max,os),Rn.subVectors(e.a,os),Cn.subVectors(e.b,os),Pn.subVectors(e.c,os),Yi.subVectors(Cn,Rn),$i.subVectors(Pn,Cn),cn.subVectors(Rn,Pn);let t=[0,-Yi.z,Yi.y,0,-$i.z,$i.y,0,-cn.z,cn.y,Yi.z,0,-Yi.x,$i.z,0,-$i.x,cn.z,0,-cn.x,-Yi.y,Yi.x,0,-$i.y,$i.x,0,-cn.y,cn.x,0];return!ya(t,Rn,Cn,Pn,Xs)||(t=[1,0,0,0,1,0,0,0,1],!ya(t,Rn,Cn,Pn,Xs))?!1:(qs.crossVectors(Yi,$i),t=[qs.x,qs.y,qs.z],ya(t,Rn,Cn,Pn,Xs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ui).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ui).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ii),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Ii=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],ui=new Y,Ws=new sn,Rn=new Y,Cn=new Y,Pn=new Y,Yi=new Y,$i=new Y,cn=new Y,os=new Y,Xs=new Y,qs=new Y,hn=new Y;function ya(s,e,t,i,n){for(let r=0,a=s.length-3;r<=a;r+=3){hn.fromArray(s,r);const o=n.x*Math.abs(hn.x)+n.y*Math.abs(hn.y)+n.z*Math.abs(hn.z),l=e.dot(hn),c=t.dot(hn),h=i.dot(hn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Fi=Bf();function Bf(){const s=new ArrayBuffer(4),e=new Float32Array(s),t=new Uint32Array(s),i=new Uint32Array(512),n=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(i[l]=0,i[l|256]=32768,n[l]=24,n[l|256]=24):c<-14?(i[l]=1024>>-c-14,i[l|256]=1024>>-c-14|32768,n[l]=-c-1,n[l|256]=-c-1):c<=15?(i[l]=c+15<<10,i[l|256]=c+15<<10|32768,n[l]=13,n[l|256]=13):c<128?(i[l]=31744,i[l|256]=64512,n[l]=24,n[l|256]=24):(i[l]=31744,i[l|256]=64512,n[l]=13,n[l|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:n,mantissaTable:r,exponentTable:a,offsetTable:o}}function kf(s){Math.abs(s)>65504&&De("DataUtils.toHalfFloat(): Value out of range."),s=Je(s,-65504,65504),Fi.floatView[0]=s;const e=Fi.uint32View[0],t=e>>23&511;return Fi.baseTable[t]+((e&8388607)>>Fi.shiftTable[t])}function zf(s){const e=s>>10;return Fi.uint32View[0]=Fi.mantissaTable[Fi.offsetTable[e]+(s&1023)]+Fi.exponentTable[e],Fi.floatView[0]}class Yv{static toHalfFloat(e){return kf(e)}static fromHalfFloat(e){return zf(e)}}const St=new Y,Ys=new st;let Hf=0;class Hi extends nn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Hf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Th,this.updateRanges=[],this.gpuType=ni,this.version=0,this._normalizationScale=e!==void 0?zr(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let n=0,r=this.itemSize;n<r;n++)this.array[e+n]=t.array[i+n];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ys.fromBufferAttribute(this,t),Ys.applyMatrix3(e),this.setXY(t,Ys.x,Ys.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyMatrix3(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyMatrix4(e),this.setXYZ(t,St.x,St.y,St.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.applyNormalMatrix(e),this.setXYZ(t,St.x,St.y,St.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)St.fromBufferAttribute(this,t),St.transformDirection(e),this.setXYZ(t,St.x,St.y,St.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this}setXYZW(e,t,i,n,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),n=this._normalize(n),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=n,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Xo(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):qo(e,this.array)}}class Ih extends Hi{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Lh extends Hi{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Kt extends Hi{constructor(e,t,i){super(new Float32Array(e),t,i)}}const Vf=new sn,ls=new Y,Sa=new Y;class Vi{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Vf.setFromPoints(e).getCenter(i);let n=0;for(let r=0,a=e.length;r<a;r++)n=Math.max(n,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(n),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ls.subVectors(e,this.center);const t=ls.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),n=(i-this.radius)*.5;this.center.addScaledVector(ls,n/i),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Sa.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ls.copy(e.center).add(Sa)),this.expandByPoint(ls.copy(e.center).sub(Sa))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Gf=0;const ei=new Qe,Ma=new xt,In=new Y,Yt=new sn,cs=new sn,Rt=new Y;class Ti extends nn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Gf++}),this.uuid=Ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(sf(e)?Lh:Ih)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new He().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ei.makeRotationFromQuaternion(e),this.applyMatrix4(ei),this}rotateX(e){return ei.makeRotationX(e),this.applyMatrix4(ei),this}rotateY(e){return ei.makeRotationY(e),this.applyMatrix4(ei),this}rotateZ(e){return ei.makeRotationZ(e),this.applyMatrix4(ei),this}translate(e,t,i){return ei.makeTranslation(e,t,i),this.applyMatrix4(ei),this}scale(e,t,i){return ei.makeScale(e,t,i),this.applyMatrix4(ei),this}lookAt(e){return Ma.lookAt(e),Ma.updateMatrix(),this.applyMatrix4(Ma.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(In).negate(),this.translate(In.x,In.y,In.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let n=0,r=e.length;n<r;n++){const a=e[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Kt(i,3))}else{const i=Math.min(e.length,t.count);for(let n=0;n<i;n++){const r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&De("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,n=t.length;i<n;i++){const r=t[i];Yt.setFromBufferAttribute(r),this.morphTargetsRelative?(Rt.addVectors(this.boundingBox.min,Yt.min),this.boundingBox.expandByPoint(Rt),Rt.addVectors(this.boundingBox.max,Yt.max),this.boundingBox.expandByPoint(Rt)):(this.boundingBox.expandByPoint(Yt.min),this.boundingBox.expandByPoint(Yt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new Y,1/0);return}if(e){const i=this.boundingSphere.center;if(Yt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];cs.setFromBufferAttribute(o),this.morphTargetsRelative?(Rt.addVectors(Yt.min,cs.min),Yt.expandByPoint(Rt),Rt.addVectors(Yt.max,cs.max),Yt.expandByPoint(Rt)):(Yt.expandByPoint(cs.min),Yt.expandByPoint(cs.max))}Yt.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)Rt.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(Rt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Rt.fromBufferAttribute(o,c),l&&(In.fromBufferAttribute(e,c),Rt.add(In)),n=Math.max(n,i.distanceToSquared(Rt))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,n=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new Hi(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(i.count);for(let O=0;O<i.count;O++)o[O]=new Y,l[O]=new Y;const h=new Y,f=new Y,u=new Y,d=new st,m=new st,x=new st,g=new Y,p=new Y;function M(O,I,D){c[O]=c[I]=c[D]=1,h.fromBufferAttribute(i,O),f.fromBufferAttribute(i,I),u.fromBufferAttribute(i,D),d.fromBufferAttribute(r,O),m.fromBufferAttribute(r,I),x.fromBufferAttribute(r,D),f.sub(h),u.sub(h),m.sub(d),x.sub(d);const U=1/(m.x*x.y-x.x*m.y);isFinite(U)&&(g.copy(f).multiplyScalar(x.y).addScaledVector(u,-m.y).multiplyScalar(U),p.copy(u).multiplyScalar(m.x).addScaledVector(f,-x.x).multiplyScalar(U),o[O].add(g),o[I].add(g),o[D].add(g),l[O].add(p),l[I].add(p),l[D].add(p))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let O=0,I=T.length;O<I;++O){const D=T[O],U=D.start,$=D.count;for(let A=U,k=U+$;A<k;A+=3)M(e.getX(A+0),e.getX(A+1),e.getX(A+2))}const b=new Y,R=new Y,S=new Y,_=new Y;function E(O){S.fromBufferAttribute(n,O),_.copy(S);const I=o[O];b.copy(I),b.sub(S.multiplyScalar(S.dot(I))).normalize(),R.crossVectors(_,I);const U=R.dot(l[O])<0?-1:1;a.setXYZW(O,b.x,b.y,b.z,U)}for(let O=0,I=i.count;O<I;++O)c[O]&&E(O);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Hi(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,d=i.count;u<d;u++)i.setXYZ(u,0,0,0);const n=new Y,r=new Y,a=new Y,o=new Y,l=new Y,c=new Y,h=new Y,f=new Y;if(e)for(let u=0,d=e.count;u<d;u+=3){const m=e.getX(u+0),x=e.getX(u+1),g=e.getX(u+2);n.fromBufferAttribute(t,m),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,g),h.subVectors(a,r),f.subVectors(n,r),h.cross(f),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,d=t.count;u<d;u+=3)n.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),f.subVectors(n,r),h.cross(f),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Rt.fromBufferAttribute(e,t),Rt.normalize(),e.setXYZ(t,Rt.x,Rt.y,Rt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h);let d=0,m=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?d=l[x]*o.data.stride+o.offset:d=l[x]*h;for(let p=0;p<h;p++)u[m++]=c[d++]}return new Hi(u,h,f)}if(this.index===null)return De("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ti,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=e(u,i);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const n={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(e.data))}h.length>0&&(n[l]=h,r=!0)}r&&(e.data.morphAttributes=n,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const n=e.attributes;for(const c in n){const h=n[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class $v{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Th,this.updateRanges=[],this.version=0,this.uuid=Ei()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let n=0,r=this.stride;n<r;n++)this.array[e+n]=t.array[i+n];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=Ql(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);const i=new this.array.constructor(e.arrayBuffers[t]),n=new this.constructor(i,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=Ql(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));const i={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return i.usage=this.usage,i}}function Ql(s){return s.buffer._uuid===void 0&&(s.buffer._uuid=Ei()),s.byteOffset===0&&s.byteLength===s.buffer.byteLength?s.buffer._uuid:s.buffer._uuid+":"+s.byteOffset+":"+s.byteLength}const kt=new Y;class Nh{constructor(e,t,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=n,this._normalizationScale=e!==void 0?zr(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this}setXYZW(e,t,i,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),n=this._normalize(n),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=n,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Dr("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[n+r])}return new Hi(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Nh(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Dr("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[n+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Xo(e,this.data.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):qo(e,this.data.array)}}const ba=new Y,Wf=new Y,Xf=new He;class Ji{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,n){return this.normal.set(e,t,i),this.constant=n,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const n=ba.subVectors(i,t).cross(Wf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(n,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const n=e.delta(ba),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(n,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Xf.getNormalMatrix(e),n=this.coplanarPoint(ba).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let qf=0;class _n extends nn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:qf++}),this.uuid=Ei(),this.name="",this.type="Material",this.blending=ys,this.side=pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ah,this.blendDst=Ar,this.blendEquation=Di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ke(0,0,0),this.blendAlpha=0,this.depthFunc=bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ra,this.stencilZFail=ra,this.stencilZPass=ra,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){De(`Material: parameter '${t}' has value of undefined.`);continue}const n=this[t];if(n===void 0){De(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector2&&i&&i.isVector2||n&&n.isEuler&&i&&i.isEuler||n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=n(e.textures),a=n(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ke().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Ji().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new st().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new st().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const n=t.length;i=new Array(n);for(let r=0;r!==n;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Li=new Y,Ea=new Y,$s=new Y,Ks=new Y;class Hr{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Li)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Li.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Li.copy(this.origin).addScaledVector(this.direction,t),Li.distanceToSquared(e))}distanceSqToSegment(e,t,i,n){Ea.copy(e).add(t).multiplyScalar(.5),$s.copy(t).sub(e).normalize(),Ks.copy(this.origin).sub(Ea);const r=e.distanceTo(t)*.5,a=-this.direction.dot($s),o=Ks.dot(this.direction),l=-Ks.dot($s),c=Ks.lengthSq(),h=Math.abs(1-a*a);let f,u,d,m;if(h>0)if(f=a*l-o,u=a*o-l,m=r*h,f>=0)if(u>=-m)if(u<=m){const x=1/h;f*=x,u*=x,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-m?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=m?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),n&&n.copy(Ea).addScaledVector($s,u),d}intersectSphere(e,t){if(e.radius<0)return null;Li.subVectors(e.center,this.origin);const i=Li.dot(this.direction),n=Li.dot(Li)-i*i,r=e.radius*e.radius;if(n>r)return null;const a=Math.sqrt(r-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,n,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,n=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,n=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),i>a||r>n||((r>i||isNaN(i))&&(i=r),(a<n||isNaN(n))&&(n=a),f>=0?(o=(e.min.z-u.z)*f,l=(e.max.z-u.z)*f):(o=(e.max.z-u.z)*f,l=(e.min.z-u.z)*f),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,t)}intersectsBox(e){return this.intersectBox(e,Li)!==null}intersectTriangle(e,t,i,n,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,f=e.x-a.x,u=e.y-a.y,d=e.z-a.z,m=t.x-a.x,x=t.y-a.y,g=t.z-a.z,p=i.x-a.x,M=i.y-a.y,T=i.z-a.z,b=Math.abs(l),R=Math.abs(c),S=Math.abs(h);let _,E,O,I,D,U,$,A,k,X,H,ne;if(b>=R&&b>=S?(O=l,U=f,k=m,ne=p,l>=0?(_=c,E=h,I=u,D=d,$=x,A=g,X=M,H=T):(_=h,E=c,I=d,D=u,$=g,A=x,X=T,H=M)):R>=S?(O=c,U=u,k=x,ne=M,c>=0?(_=h,E=l,I=d,D=f,$=g,A=m,X=T,H=p):(_=l,E=h,I=f,D=d,$=m,A=g,X=p,H=T)):(O=h,U=d,k=g,ne=T,h>=0?(_=l,E=c,I=f,D=u,$=m,A=x,X=p,H=M):(_=c,E=l,I=u,D=f,$=x,A=m,X=M,H=p)),O===0)return null;const q=_/O,ee=E/O,B=1/O,ae=I-q*U,be=D-ee*U,z=$-q*k,ie=A-ee*k,he=X-q*ne,Te=H-ee*ne,se=he*ie-Te*z,Ae=ae*Te-be*he,C=z*be-ie*ae;if(n){if(se<0||Ae<0||C<0)return null}else if((se<0||Ae<0||C<0)&&(se>0||Ae>0||C>0))return null;const N=se+Ae+C;if(N===0)return null;const ye=B*(se*U+Ae*k+C*ne);return(N>0?ye<0:ye>0)?null:this.at(ye/N,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Yf extends _n{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.combine=oh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ec=new Qe,un=new Hr,Zs=new Vi,tc=new Y,Js=new Y,js=new Y,Qs=new Y,Ta=new Y,er=new Y,ic=new Y,tr=new Y;class ri extends xt{constructor(e=new Ti,t=new Yf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,n=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(n,e);const o=this.morphTargetInfluences;if(r&&o){er.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(Ta.fromBufferAttribute(f,e),a?er.addScaledVector(Ta,h):er.addScaledVector(Ta.sub(t),h))}t.add(er)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,n=this.material,r=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Zs.copy(i.boundingSphere),Zs.applyMatrix4(r),un.copy(e.ray).recast(e.near),!(Zs.containsPoint(un.origin)===!1&&(un.intersectSphere(Zs,tc)===null||un.origin.distanceToSquared(tc)>(e.far-e.near)**2))&&(ec.copy(r).invert(),un.copy(e.ray).applyMatrix4(ec),!(i.boundingBox!==null&&un.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,un)))}_computeIntersections(e,t,i){let n;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=u.length;m<x;m++){const g=u[m],p=a[g.materialIndex],M=Math.max(g.start,d.start),T=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let b=M,R=T;b<R;b+=3){const S=o.getX(b),_=o.getX(b+1),E=o.getX(b+2);n=ir(this,p,e,i,c,h,f,S,_,E),n&&(n.faceIndex=Math.floor(b/3),n.face.materialIndex=g.materialIndex,t.push(n))}}else{const m=Math.max(0,d.start),x=Math.min(o.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){const M=o.getX(g),T=o.getX(g+1),b=o.getX(g+2);n=ir(this,a,e,i,c,h,f,M,T,b),n&&(n.faceIndex=Math.floor(g/3),t.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=u.length;m<x;m++){const g=u[m],p=a[g.materialIndex],M=Math.max(g.start,d.start),T=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let b=M,R=T;b<R;b+=3){const S=b,_=b+1,E=b+2;n=ir(this,p,e,i,c,h,f,S,_,E),n&&(n.faceIndex=Math.floor(b/3),n.face.materialIndex=g.materialIndex,t.push(n))}}else{const m=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){const M=g,T=g+1,b=g+2;n=ir(this,a,e,i,c,h,f,M,T,b),n&&(n.faceIndex=Math.floor(g/3),t.push(n))}}}}function $f(s,e,t,i,n,r,a,o){let l;if(e.side===Wt?l=i.intersectTriangle(a,r,n,!0,o):l=i.intersectTriangle(n,r,a,e.side===pn,o),l===null)return null;tr.copy(o),tr.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(tr);return c<t.near||c>t.far?null:{distance:c,point:tr.clone(),object:s}}function ir(s,e,t,i,n,r,a,o,l,c){s.getVertexPosition(o,Js),s.getVertexPosition(l,js),s.getVertexPosition(c,Qs);const h=$f(s,e,t,i,Js,js,Qs,ic);if(h){const f=new Y;pi.getBarycoord(ic,Js,js,Qs,f),n&&(h.uv=pi.getInterpolatedAttribute(n,o,l,c,f,new st)),r&&(h.uv1=pi.getInterpolatedAttribute(r,o,l,c,f,new st)),a&&(h.normal=pi.getInterpolatedAttribute(a,o,l,c,f,new Y),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new Y,materialIndex:0};pi.getNormal(Js,js,Qs,u.normal),h.face=u,h.barycoord=f}return h}const hs=new dt,nc=new dt,sc=new dt,Kf=new dt,rc=new Qe,nr=new Y,wa=new Vi,ac=new Qe,Aa=new Hr;class Kv extends ri{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Bl,this.bindMatrix=new Qe,this.bindMatrixInverse=new Qe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new sn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,nr),this.boundingBox.expandByPoint(nr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Vi),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,nr),this.boundingSphere.expandByPoint(nr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){const i=this.material,n=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wa.copy(this.boundingSphere),wa.applyMatrix4(n),e.ray.intersectsSphere(wa)!==!1&&(ac.copy(n).invert(),Aa.copy(e.ray).applyMatrix4(ac),!(this.boundingBox!==null&&Aa.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Aa)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new dt,t=this.geometry.attributes.skinWeight;for(let i=0,n=t.count;i<n;i++){e.fromBufferAttribute(t,i);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Bl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Gd?this.bindMatrixInverse.copy(this.bindMatrix).invert():De("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,n=this.geometry;nc.fromBufferAttribute(n.attributes.skinIndex,e),sc.fromBufferAttribute(n.attributes.skinWeight,e),t.isVector4?(hs.copy(t),t.set(0,0,0,0)):(hs.set(t.x,t.y,t.z,1),t.set(0,0,0)),hs.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=sc.getComponent(r);if(a!==0){const o=nc.getComponent(r);rc.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(Kf.copy(hs).applyMatrix4(rc),a)}}return t.isVector4&&(t.w=hs.w),t.applyMatrix4(this.bindMatrixInverse)}}class Zf extends xt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Yn extends It{constructor(e=null,t=1,i=1,n,r,a,o,l,c=bt,h=bt,f,u){super(null,a,o,l,c,h,n,r,f,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const oc=new Qe,Jf=new Qe;class Dh{constructor(e=[],t=[]){this.uuid=Ei(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){De("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,n=this.bones.length;i<n;i++)this.boneInverses.push(new Qe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new Qe;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,n=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Jf;oc.multiplyMatrices(o,t[r]),oc.toArray(i,r*16)}n!==null&&(n.needsUpdate=!0)}clone(){return new Dh(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new Yn(t,e,e,si,ni);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const n=this.bones[t];if(n.name===e)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,n=e.bones.length;i<n;i++){const r=e.bones[i];let a=t[r];a===void 0&&(De("Skeleton: No bone found with UUID:",r),a=new Zf),this.bones.push(a),this.boneInverses.push(new Qe().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let n=0,r=t.length;n<r;n++){const a=t[n];e.bones.push(a.uuid);const o=i[n];e.boneInverses.push(o.toArray())}return e}}class lc extends Hi{constructor(e,t,i,n=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ln=new Qe,cc=new Qe,sr=[],hc=new sn,jf=new Qe,us=new ri,ds=new Vi;class Zv extends ri{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new lc(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,jf)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new sn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ln),hc.copy(e.boundingBox).applyMatrix4(Ln),this.boundingBox.union(hc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Vi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ln),ds.copy(e.boundingSphere).applyMatrix4(Ln),this.boundingSphere.union(ds)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,n=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(e,t){const i=this.matrixWorld,n=this.count;if(us.geometry=this.geometry,us.material=this.material,us.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ds.copy(this.boundingSphere),ds.applyMatrix4(i),e.ray.intersectsSphere(ds)!==!1))for(let r=0;r<n;r++){this.getMatrixAt(r,Ln),cc.multiplyMatrices(i,Ln),us.matrixWorld=cc,us.raycast(e,sr);for(let a=0,o=sr.length;a<o;a++){const l=sr[a];l.instanceId=r,l.object=this,t.push(l)}sr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new lc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new Yn(new Float32Array(n*this.count),n,this.count,kr,ni));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=n*e;return r[l]=o,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const dn=new Vi,Qf=new st(.5,.5),rr=new Y;class Cs{constructor(e=new Ji,t=new Ji,i=new Ji,n=new Ji,r=new Ji,a=new Ji){this.planes=[e,t,i,n,r,a]}set(e,t,i,n,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(n),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=mi,i=!1){const n=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],m=r[8],x=r[9],g=r[10],p=r[11],M=r[12],T=r[13],b=r[14],R=r[15];if(n[0].setComponents(c-a,d-h,p-m,R-M).normalize(),n[1].setComponents(c+a,d+h,p+m,R+M).normalize(),n[2].setComponents(c+o,d+f,p+x,R+T).normalize(),n[3].setComponents(c-o,d-f,p-x,R-T).normalize(),i)n[4].setComponents(l,u,g,b).normalize(),n[5].setComponents(c-l,d-u,p-g,R-b).normalize();else if(n[4].setComponents(c-l,d-u,p-g,R-b).normalize(),t===mi)n[5].setComponents(c+l,d+u,p+g,R+b).normalize();else if(t===As)n[5].setComponents(l,u,g,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),dn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),dn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(dn)}intersectsSprite(e){dn.center.set(0,0,0);const t=Qf.distanceTo(e.center);return dn.radius=.7071067811865476+t,dn.applyMatrix4(e.matrixWorld),this.intersectsSphere(dn)}intersectsSphere(e){const t=this.planes,i=e.center,n=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<n)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const n=t[i];if(rr.x=n.normal.x>0?e.max.x:e.min.x,rr.y=n.normal.y>0?e.max.y:e.min.y,rr.z=n.normal.z>0?e.max.z:e.min.z,n.distanceToPoint(rr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const uc=new Qe;class $o{constructor(){this.coordinateSystem=mi,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,i=this._frustums;for(let n=0;n<t.length;n++){const r=t[n];uc.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[n]===void 0&&(i[n]=new Cs),i[n].setFromProjectionMatrix(uc,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,i=e._frustums;for(let n=0;n<e._count;n++)t[n]===void 0&&(t[n]=new Cs),t[n].copy(i[n]);return this._count=e._count,this}clone(){return new $o().copy(this)}}class ep extends _n{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ur=new Y,Fr=new Y,dc=new Qe,fs=new Hr,ar=new Vi,Ra=new Y,fc=new Y;class Uh extends xt{constructor(e=new Ti,t=new ep){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let n=1,r=t.count;n<r;n++)Ur.fromBufferAttribute(t,n-1),Fr.fromBufferAttribute(t,n),i[n]=i[n-1],i[n]+=Ur.distanceTo(Fr);e.setAttribute("lineDistance",new Kt(i,1))}else De("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,n=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ar.copy(i.boundingSphere),ar.applyMatrix4(n),ar.radius+=r,e.ray.intersectsSphere(ar)===!1)return;dc.copy(n).invert(),fs.copy(e.ray).applyMatrix4(dc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){const d=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let x=d,g=m-1;x<g;x+=c){const p=h.getX(x),M=h.getX(x+1),T=or(this,e,fs,l,p,M,x);T&&t.push(T)}if(this.isLineLoop){const x=h.getX(m-1),g=h.getX(d),p=or(this,e,fs,l,x,g,m-1);p&&t.push(p)}}else{const d=Math.max(0,a.start),m=Math.min(u.count,a.start+a.count);for(let x=d,g=m-1;x<g;x+=c){const p=or(this,e,fs,l,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){const x=or(this,e,fs,l,m-1,d,m-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function or(s,e,t,i,n,r,a){const o=s.geometry.attributes.position;if(Ur.fromBufferAttribute(o,n),Fr.fromBufferAttribute(o,r),t.distanceSqToSegment(Ur,Fr,Ra,fc)>i)return;Ra.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Ra);if(!(c<e.near||c>e.far))return{distance:c,point:fc.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const pc=new Y,mc=new Y;class Jv extends Uh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let n=0,r=t.count;n<r;n+=2)pc.fromBufferAttribute(t,n),mc.fromBufferAttribute(t,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+pc.distanceTo(mc);e.setAttribute("lineDistance",new Kt(i,1))}else De("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class jv extends Uh{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class tp extends _n{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ke(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const gc=new Qe,Ro=new Hr,lr=new Vi,cr=new Y;class Qv extends xt{constructor(e=new Ti,t=new tp){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,n=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),lr.copy(i.boundingSphere),lr.applyMatrix4(n),lr.radius+=r,e.ray.intersectsSphere(lr)===!1)return;gc.copy(n).invert(),Ro.copy(e.ray).applyMatrix4(gc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){const u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let m=u,x=d;m<x;m++){const g=c.getX(m);cr.fromBufferAttribute(f,g),_c(cr,g,l,n,e,t,this)}}else{const u=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let m=u,x=d;m<x;m++)cr.fromBufferAttribute(f,m),_c(cr,m,l,n,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const n=t[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=n.length;r<a;r++){const o=n[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function _c(s,e,t,i,n,r,a){const o=Ro.distanceSqToPoint(s);if(o<t){const l=new Y;Ro.closestPointToPoint(s,l),l.applyMatrix4(i);const c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class Fh extends It{constructor(e=[],t=Wn,i,n,r,a,o,l,c,h){super(e,t,i,n,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class $n extends It{constructor(e,t,i=Mi,n,r,a,o=bt,l=bt,c,h=en,f=1){if(h!==en&&h!==Qi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:f};super(u,n,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Yo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Oh extends $n{constructor(e,t=Mi,i=Wn,n,r,a=bt,o=bt,l,c=en){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,i,n,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Bh extends It{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ps extends Ti{constructor(e=1,t=1,i=1,n=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:n,heightSegments:r,depthSegments:a};const o=this;n=Math.floor(n),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,d=0;m("z","y","x",-1,-1,i,t,e,a,r,0),m("z","y","x",1,-1,i,t,-e,a,r,1),m("x","z","y",1,1,e,i,t,n,a,2),m("x","z","y",1,-1,e,i,-t,n,a,3),m("x","y","z",1,-1,e,t,i,n,r,4),m("x","y","z",-1,-1,e,t,-i,n,r,5),this.setIndex(l),this.setAttribute("position",new Kt(c,3)),this.setAttribute("normal",new Kt(h,3)),this.setAttribute("uv",new Kt(f,2));function m(x,g,p,M,T,b,R,S,_,E,O){const I=b/_,D=R/E,U=b/2,$=R/2,A=S/2,k=_+1,X=E+1;let H=0,ne=0;const q=new Y;for(let ee=0;ee<X;ee++){const B=ee*D-$;for(let ae=0;ae<k;ae++){const be=ae*I-U;q[x]=be*M,q[g]=B*T,q[p]=A,c.push(q.x,q.y,q.z),q[x]=0,q[g]=0,q[p]=S>0?1:-1,h.push(q.x,q.y,q.z),f.push(ae/_),f.push(1-ee/E),H+=1}}for(let ee=0;ee<E;ee++)for(let B=0;B<_;B++){const ae=u+B+k*ee,be=u+B+k*(ee+1),z=u+(B+1)+k*(ee+1),ie=u+(B+1)+k*ee;l.push(ae,be,ie),l.push(be,z,ie),ne+=6}o.addGroup(d,ne,O),d+=ne,u+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ps(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Vr extends Ti{constructor(e=1,t=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:n};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,f=e/o,u=t/l,d=[],m=[],x=[],g=[];for(let p=0;p<h;p++){const M=p*u-a;for(let T=0;T<c;T++){const b=T*f-r;m.push(b,-M,0),x.push(0,0,1),g.push(T/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<o;M++){const T=M+c*p,b=M+c*(p+1),R=M+1+c*(p+1),S=M+1+c*p;d.push(T,b,S),d.push(b,R,S)}this.setIndex(d),this.setAttribute("position",new Kt(m,3)),this.setAttribute("normal",new Kt(x,3)),this.setAttribute("uv",new Kt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vr(e.width,e.height,e.widthSegments,e.heightSegments)}}function Kn(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const n=s[t][i];if(vc(n))n.isRenderTargetTexture?(De("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=n.clone();else if(Array.isArray(n))if(vc(n[0])){const r=[];for(let a=0,o=n.length;a<o;a++)r[a]=n[a].clone();e[t][i]=r}else e[t][i]=n.slice();else e[t][i]=n}}return e}function zt(s){const e={};for(let t=0;t<s.length;t++){const i=Kn(s[t]);for(const n in i)e[n]=i[n]}return e}function vc(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function ip(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function kh(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:nt.workingColorSpace}const np={clone:Kn,merge:zt};var sp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class gn extends _n{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sp,this.fragmentShader=rp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Kn(e.uniforms),this.uniformsGroups=ip(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?t.uniforms[n]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[n]={type:"m4",value:a.toArray()}:t.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const n=e.uniforms[i];switch(this.uniforms[i]={},n.type){case"t":this.uniforms[i].value=t[n.value]||null;break;case"c":this.uniforms[i].value=new Ke().setHex(n.value);break;case"v2":this.uniforms[i].value=new st().fromArray(n.value);break;case"v3":this.uniforms[i].value=new Y().fromArray(n.value);break;case"v4":this.uniforms[i].value=new dt().fromArray(n.value);break;case"m3":this.uniforms[i].value=new He().fromArray(n.value);break;case"m4":this.uniforms[i].value=new Qe().fromArray(n.value);break;default:this.uniforms[i].value=n.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Co extends gn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ap extends _n{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ao,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ex extends ap{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new st(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Je(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Ke(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ke(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ke(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return Vn('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){Vn('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class op extends _n{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Kd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class lp extends _n{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function ji(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function _s(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}function cp(s){function e(n,r){return s[n]-s[r]}const t=s.length,i=new Array(t);for(let n=0;n!==t;++n)i[n]=n;return i.sort(e),i}function xc(s,e,t){const i=s.length,n=new s.constructor(i);for(let r=0,a=0;a!==i;++r){const o=t[r]*e;for(let l=0;l!==e;++l)n[a++]=s[o+l]}return n}function hp(s,e,t,i){let n=1,r=s[0];for(;r!==void 0&&r[i]===void 0;)r=s[n++];if(r===void 0)return;let a=r[i];if(a!==void 0)if(Array.isArray(a))do a=r[i],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[n++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[i],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[n++];while(r!==void 0);else do a=r[i],a!==void 0&&(e.push(r.time),t.push(a)),r=s[n++];while(r!==void 0)}class Is{constructor(e,t,i,n){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,n=t[i],r=t[i-1];e:{t:{let a;i:{n:if(!(e<n)){for(let o=i+2;;){if(n===void 0){if(e<r)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=n,n=t[++i],e<n)break t}a=t.length;break i}if(!(e>=r)){const o=t[1];e<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(n=r,r=t[--i-1],e>=r)break t}a=i,i=0;break i}break e}for(;i<a;){const o=i+a>>>1;e<t[o]?a=o:i=o+1}if(n=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,n)}return this.interpolate_(i,r,e,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,n=this.valueSize,r=e*n;for(let a=0;a!==n;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class up extends Is{constructor(e,t,i,n){super(e,t,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:kn,endingEnd:kn}}intervalChanged_(e,t,i){const n=this.parameterPositions;let r=e-2,a=e+1,o=n[r],l=n[a];if(o===void 0)switch(this.getSettings_().endingStart){case zn:r=e,o=2*t-i;break;case Ir:r=n.length-2,o=t+n[r]-n[r+1];break;default:r=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case zn:a=e,l=2*i-t;break;case Ir:a=1,l=i+n[1]-n[0];break;default:a=e-1,l=t}const c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,i,n){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,m=(i-t)/(n-t),x=m*m,g=x*m,p=-u*g+2*u*x-u*m,M=(1+u)*g+(-1.5-2*u)*x+(-.5+u)*m+1,T=(-1-d)*g+(1.5+d)*x+.5*m,b=d*g-d*x;for(let R=0;R!==o;++R)r[R]=p*a[h+R]+M*a[c+R]+T*a[l+R]+b*a[f+R];return r}}class zh extends Is{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(n-t),f=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*f+a[l+u]*h;return r}}class dp extends Is{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e){return this.copySampleValue_(e-1)}}class fp extends Is{interpolate_(e,t,i,n){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,f=this.outTangents;if(!h||!f){const m=(i-t)/(n-t),x=1-m;for(let g=0;g!==o;++g)r[g]=a[c+g]*x+a[l+g]*m;return r}const u=o*2,d=e-1;for(let m=0;m!==o;++m){const x=a[c+m],g=a[l+m],p=d*u+m*2,M=f[p],T=f[p+1],b=e*u+m*2,R=h[b],S=h[b+1],_=mp(i,t,M,R,n);r[m]=Hh(_,x,T,S,g)}return r}}function Hh(s,e,t,i,n){const r=1-s;return r*r*r*e+3*r*r*s*t+3*r*s*s*i+s*s*s*n}function pp(s,e,t,i,n){const r=1-s;return 3*r*r*(t-e)+6*r*s*(i-t)+3*s*s*(n-i)}function mp(s,e,t,i,n){let r=(s-e)/(n-e);for(let a=0;a<8;a++){const o=Hh(r,e,t,i,n)-s;if(Math.abs(o)<1e-10)break;const l=pp(r,e,t,i,n);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class gi{constructor(e,t,i,n){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ji(t,this.TimeBufferType),this.values=ji(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:ji(e.times,Array),values:ji(e.values,Array)};const n=e.getInterpolation();n!==e.DefaultInterpolation&&(i.interpolation=n),_s(e.settings)&&(i.settings={inTangents:ji(e.settings.inTangents,Array),outTangents:ji(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new dp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new zh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new up(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new fp(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Pr:t=this.InterpolantFactoryMethodDiscrete;break;case wo:t=this.InterpolantFactoryMethodLinear;break;case sa:t=this.InterpolantFactoryMethodSmooth;break;case kl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return De("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Pr;case this.InterpolantFactoryMethodLinear:return wo;case this.InterpolantFactoryMethodSmooth:return sa;case this.InterpolantFactoryMethodBezier:return kl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]+=e;_s(this.settings)&&(yc(this.settings.inTangents,e),yc(this.settings.outTangents,e))}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,n=t.length;i!==n;++i)t[i]*=e;_s(this.settings)&&(Sc(this.settings.inTangents,e),Sc(this.settings.outTangents,e))}return this}trim(e,t){const i=this.times,n=i.length;let r=0,a=n-1;for(;r!==n&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==n){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(ke("KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,n=this.values,r=i.length;r===0&&(ke("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=i[o];if(typeof l=="number"&&isNaN(l)){ke("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){ke("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(n!==void 0&&rf(n))for(let o=0,l=n.length;o!==l;++o){const c=n[o];if(isNaN(c)){ke("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===sa,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(n)l=!0;else{const f=o*i,u=f-i,d=f+i;for(let m=0;m!==i;++m){const x=t[f+m];if(x!==t[u+m]||x!==t[d+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const f=o*i,u=a*i;for(let d=0;d!==i;++d)t[u+d]=t[f+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,n=new i(this.name,e,t);return n.createInterpolant=this.createInterpolant,_s(this.settings)&&(n.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),n}}function yc(s,e){for(let t=0,i=s.length;t!==i;t+=2)s[t]+=e}function Sc(s,e){for(let t=0,i=s.length;t!==i;t+=2)s[t]*=e}gi.prototype.ValueTypeName="";gi.prototype.TimeBufferType=Float32Array;gi.prototype.ValueBufferType=Float32Array;gi.prototype.DefaultInterpolation=wo;class Zn extends gi{constructor(e,t,i){super(e,t,i)}}Zn.prototype.ValueTypeName="bool";Zn.prototype.ValueBufferType=Array;Zn.prototype.DefaultInterpolation=Pr;Zn.prototype.InterpolantFactoryMethodLinear=void 0;Zn.prototype.InterpolantFactoryMethodSmooth=void 0;class Vh extends gi{constructor(e,t,i,n){super(e,t,i,n)}}Vh.prototype.ValueTypeName="color";class Ko extends gi{constructor(e,t,i,n){super(e,t,i,n)}}Ko.prototype.ValueTypeName="number";class gp extends Is{constructor(e,t,i,n){super(e,t,i,n)}interpolate_(e,t,i,n){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(n-t);let c=e*o;for(let h=c+o;c!==h;c+=4)yi.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Zo extends gi{constructor(e,t,i,n){super(e,t,i,n)}InterpolantFactoryMethodLinear(e){return new gp(this.times,this.values,this.getValueSize(),e)}}Zo.prototype.ValueTypeName="quaternion";Zo.prototype.InterpolantFactoryMethodSmooth=void 0;class Jn extends gi{constructor(e,t,i){super(e,t,i)}}Jn.prototype.ValueTypeName="string";Jn.prototype.ValueBufferType=Array;Jn.prototype.DefaultInterpolation=Pr;Jn.prototype.InterpolantFactoryMethodLinear=void 0;Jn.prototype.InterpolantFactoryMethodSmooth=void 0;class Gh extends gi{constructor(e,t,i,n){super(e,t,i,n)}}Gh.prototype.ValueTypeName="vector";class Mc{constructor(e="",t=-1,i=[],n=Go){this.name=e,this.tracks=i,this.duration=t,this.blendMode=n,this.uuid=Ei(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,n=1/(e.fps||1);for(let a=0,o=i.length;a!==o;++a)t.push(vp(i[a]).scale(n));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],i=e.tracks,n={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=i.length;r!==a;++r)t.push(gi.toJSON(i[r]));return n}static CreateFromMorphTargetSequence(e,t,i,n){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=cp(l);l=xc(l,1,h),c=xc(c,1,h),!n&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Ko(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/i))}return new this(e,-1,a)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const n=e;i=n.geometry&&n.geometry.animations||n.animations}for(let n=0;n<i.length;n++)if(i[n].name===t)return i[n];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const n={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const f=h[1];let u=n[f];u||(n[f]=u=[]),u.push(c)}}const a=[];for(const o in n)a.push(this.CreateFromMorphTargetSequence(o,n[o],t,i));return a}resetDuration(){const e=this.tracks;let t=0;for(let i=0,n=e.length;i!==n;++i){const r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function _p(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ko;case"vector":case"vector2":case"vector3":case"vector4":return Gh;case"color":return Vh;case"quaternion":return Zo;case"bool":case"boolean":return Zn;case"string":return Jn}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function vp(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=_p(s.type);if(s.times===void 0){const i=[],n=[];hp(s.keys,i,n,"value"),s.times=i,s.values=n}let t;return e.parse!==void 0?t=e.parse(s):t=new e(s.name,s.times,s.values,s.interpolation),_s(s.settings)&&(t.settings={inTangents:ji(s.settings.inTangents,Float32Array),outTangents:ji(s.settings.outTangents,Float32Array)}),t}const Bi={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(bc(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!bc(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function bc(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class xp{constructor(e,t,i){const n=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,r===!1&&n.onStart!==void 0&&n.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,n.onProgress!==void 0&&n.onProgress(h,a,o),a===o&&(r=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(h){n.onError!==void 0&&n.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){const f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){const d=c[f],m=c[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const yp=new xp;class jn{constructor(e){this.manager=e!==void 0?e:yp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(n,r){i.load(e,n,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}}jn.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ni={};class Sp extends Error{constructor(e,t){super(e),this.response=t}}class Mp extends jn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,n){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Bi.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Ni[e]!==void 0){Ni[e].push({onLoad:t,onProgress:i,onError:n});return}Ni[e]=[],Ni[e].push({onLoad:t,onProgress:i,onError:n});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&De("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Ni[e],f=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=u?parseInt(u):0,m=d!==0;let x=0;const g=new ReadableStream({start(p){M();function M(){f.read().then(({done:T,value:b})=>{if(T)p.close();else{x+=b.byteLength;const R=new ProgressEvent("progress",{lengthComputable:m,loaded:x,total:d});for(let S=0,_=h.length;S<_;S++){const E=h[S];E.onProgress&&E.onProgress(R)}p.enqueue(b),M()}},T=>{p.error(T)})}}});return new Response(g)}else throw new Sp(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const f=/charset="?([^;"\s]*)"?/i.exec(o),u=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(u);return c.arrayBuffer().then(m=>d.decode(m))}}}).then(c=>{Bi.add(`file:${e}`,c);const h=Ni[e];delete Ni[e];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onLoad&&d.onLoad(c)}}).catch(c=>{const h=Ni[e];if(h===void 0)throw this.manager.itemError(e),c;delete Ni[e];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Nn=new WeakMap;class bp extends jn{constructor(e){super(e)}load(e,t,i,n){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Bi.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let f=Nn.get(a);f===void 0&&(f=[],Nn.set(a,f)),f.push({onLoad:t,onError:n})}return a}const o=Rs("img");function l(){h(),t&&t(this);const f=Nn.get(this)||[];for(let u=0;u<f.length;u++){const d=f[u];d.onLoad&&d.onLoad(this)}Nn.delete(this),r.manager.itemEnd(e)}function c(f){h(),n&&n(f),Bi.remove(`image:${e}`);const u=Nn.get(this)||[];for(let d=0;d<u.length;d++){const m=u[d];m.onError&&m.onError(f)}Nn.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Bi.add(`image:${e}`,o),r.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}}class tx extends jn{constructor(e){super(e)}load(e,t,i,n){const r=this,a=new Yn,o=new Mp(this.manager);return o.setPriority(this.priority),o.setCache(this.cache),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(l){let c;try{c=r.parse(l)}catch(h){n!==void 0?n(h):ke(h);return}r._applyTexData(a,c),t&&t(a,c)},i,n),a}createDataTexture(e){const t=new Yn;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:$t,e.wrapT=t.wrapT!==void 0?t.wrapT:$t,e.magFilter=t.magFilter!==void 0?t.magFilter:Ct,e.minFilter=t.minFilter!==void 0?t.minFilter:Ct,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=Oi),t.mipmapCount===1&&(e.minFilter=Ct),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}}class ix extends jn{constructor(e){super(e)}load(e,t,i,n){const r=new It,a=new bp(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},i,n),r}}class Gr extends xt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ke(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class nx extends Gr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Ca=new Qe,Ec=new Y,Tc=new Y;class Jo{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new st(512,512),this.mapType=Gt,this.map=null,this.mapPass=null,this.matrix=new Qe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Cs,this._frameExtents=new st(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Ec.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ec),Tc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Tc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,n){Ca.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Ca,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=n?n.z/r.x:1,o=n?n.w/r.y:1,l=n?n.x/r.x:0,c=n?n.y/r.y:0;e.coordinateSystem===As||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Ca)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const hr=new Y,ur=new yi,_i=new Y;class Wh extends xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Qe,this.projectionMatrix=new Qe,this.projectionMatrixInverse=new Qe,this.coordinateSystem=mi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(hr,ur,_i),_i.x===1&&_i.y===1&&_i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(hr,ur,_i.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(hr,ur,_i),_i.x===1&&_i.y===1&&_i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(hr,ur,_i.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Ki=new Y,wc=new st,Ac=new st;class ii extends Wh{constructor(e=50,t=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=qn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ss*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return qn*2*Math.atan(Math.tan(Ss*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ki.x,Ki.y).multiplyScalar(-e/Ki.z),Ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ki.x,Ki.y).multiplyScalar(-e/Ki.z)}getViewSize(e,t){return this.getViewBounds(e,wc,Ac),t.subVectors(Ac,wc)}setViewOffset(e,t,i,n,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ss*.5*this.fov)/this.zoom,i=2*t,n=this.aspect*i,r=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*n/l,t-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+n,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Ep extends Jo{constructor(){super(new ii(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,i=qn*2*e.angle*this.focus,n=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(i!==t.fov||n!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=n,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class sx extends Gr{constructor(e,t,i=0,n=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.distance=i,this.angle=n,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Ep}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Tp extends Jo{constructor(){super(new ii(90,1,.5,500)),this.isPointLightShadow=!0}}class rx extends Gr{constructor(e,t,i=0,n=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new Tp}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class jo extends Wh{constructor(e=-1,t=1,i=1,n=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=n,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,n,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=n,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=n+t,l=n-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class wp extends Jo{constructor(){super(new jo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ax extends Gr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xt.DEFAULT_UP),this.updateMatrix(),this.target=new xt,this.shadow=new wp}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class ox{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Pa=new WeakMap;class lx extends jn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&De("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&De("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,n){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Bi.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{Pa.has(a)===!0?(n&&n(Pa.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}const o={};o.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",o.headers=this.requestHeader,o.priority=this.priority,o.cache=this.cache,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Bi.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){n&&n(c),Pa.set(l,c),Bi.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Bi.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Dn=-90,Un=1;class Po extends xt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new ii(Dn,Un,e,t);n.layers=this.layers,this.add(n);const r=new ii(Dn,Un,e,t);r.layers=this.layers,this.add(r);const a=new ii(Dn,Un,e,t);a.layers=this.layers,this.add(a);const o=new ii(Dn,Un,e,t);o.layers=this.layers,this.add(o);const l=new ii(Dn,Un,e,t);l.layers=this.layers,this.add(l);const c=new ii(Dn,Un,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,n,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===mi)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===As)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=e.getRenderTarget(),u=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.mipmapsAutoUpdate=x,e.setRenderTarget(i,5,n),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,u,d),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Ap extends ii{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}class Rp{constructor(e,t,i){this.binding=e,this.valueSize=i;let n,r,a;switch(t){case"quaternion":n=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":n=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:n=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=n,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const i=this.buffer,n=this.valueSize,r=e*n+n;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==n;++o)i[r+o]=i[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(i,r,0,o,n)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,i=this.valueSize,n=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,n,0,e,i),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,i=this.buffer,n=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(i,n,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(i,n,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(i[l]!==i[l+t]){o.setValue(i,n);break}}saveOriginalState(){const e=this.binding,t=this.buffer,i=this.valueSize,n=i*this._origIndex;e.getValue(t,n);for(let r=i,a=n;r!==a;++r)t[r]=t[n+r%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let i=e;i<t;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[t+i]=this.buffer[e+i]}_select(e,t,i,n,r){if(n>=.5)for(let a=0;a!==r;++a)e[t+a]=e[i+a]}_slerp(e,t,i,n){yi.slerpFlat(e,t,e,t,e,i,n)}_slerpAdditive(e,t,i,n,r){const a=this._workIndex*r;yi.multiplyQuaternionsFlat(e,a,e,t,e,i),yi.slerpFlat(e,t,e,t,e,a,n)}_lerp(e,t,i,n,r){const a=1-n;for(let o=0;o!==r;++o){const l=t+o;e[l]=e[l]*a+e[i+o]*n}}_lerpAdditive(e,t,i,n,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[i+a]*n}}}const Qo="\\[\\]\\.:\\/",Cp=new RegExp("["+Qo+"]","g"),el="[^"+Qo+"]",Pp="[^"+Qo.replace("\\.","")+"]",Ip=/((?:WC+[\/:])*)/.source.replace("WC",el),Lp=/(WCOD+)?/.source.replace("WCOD",Pp),Np=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",el),Dp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",el),Up=new RegExp("^"+Ip+Lp+Np+Dp+"$"),Fp=["material","materials","bones","map"];class Op{constructor(e,t,i){const n=i||ut.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,n)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,n=this._bindings[i];n!==void 0&&n.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let n=this._targetGroup.nCachedObjects_,r=i.length;n!==r;++n)i[n].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class ut{constructor(e,t,i){this.path=t,this.parsedPath=i||ut.parseTrackName(t),this.node=ut.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new ut.Composite(e,t,i):new ut(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Cp,"")}static parseTrackName(e){const t=Up.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){const r=i.nodeName.substring(n+1);Fp.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=i(o.children);if(l)return l}return null},n=i(e.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)e[t++]=i[n]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let n=0,r=i.length;n!==r;++n)i[n]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,n=t.propertyName;let r=t.propertyIndex;if(e||(e=ut.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){De("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[n];if(a===void 0){const c=t.nodeName;ke("PropertyBinding: Trying to update property for track: "+c+"."+n+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(n==="morphTargetInfluences"){if(!e.geometry){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ut.Composite=Op;ut.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ut.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ut.prototype.GetterByBindingType=[ut.prototype._getValue_direct,ut.prototype._getValue_array,ut.prototype._getValue_arrayElement,ut.prototype._getValue_toArray];ut.prototype.SetterByBindingTypeAndVersioning=[[ut.prototype._setValue_direct,ut.prototype._setValue_direct_setNeedsUpdate,ut.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_array,ut.prototype._setValue_array_setNeedsUpdate,ut.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_arrayElement,ut.prototype._setValue_arrayElement_setNeedsUpdate,ut.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_fromArray,ut.prototype._setValue_fromArray_setNeedsUpdate,ut.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Bp{constructor(e,t,i=null,n=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=i,this.blendMode=n;const r=t.tracks,a=r.length,o=new Array(a),l={endingStart:kn,endingEnd:kn};for(let c=0;c!==a;++c){const h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=qd,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,i=!1){if(e.fadeOut(t),this.fadeIn(t),i===!0){const n=this._clip.duration,r=e._clip.duration,a=r/n,o=n/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,i=!1){return e.crossFadeFrom(this,t,i)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,i){const n=this._mixer,r=n.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=n._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+i,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,i,n){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*i;l<0||i===0?t=0:(this._startTime=null,t=i*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case $d:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case Go:default:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulate(n,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const i=this._weightInterpolant;if(i!==null){const n=i.evaluate(e)[0];t*=n,e>i.parameterPositions[1]&&(this.stopFading(),n===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const i=this._timeScaleInterpolant;if(i!==null){const n=i.evaluate(e)[0];t*=n,e>i.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,i=this.loop;let n=this.time+e,r=this._loopCount;const a=i===Yd;if(e===0)return r===-1?n:a&&(r&1)===1?t-n:n;if(i===Xd){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(n>=t)n=t;else if(n<0)n=0;else{this.time=n;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),n>=t||n<0){const o=Math.floor(n/t);n-=t*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,n=e>0?t:0,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=n,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=n;if(a&&(r&1)===1)return t-n}return n}_setEndings(e,t,i){const n=this._interpolantSettings;i?(n.endingStart=zn,n.endingEnd=zn):(e?n.endingStart=this.zeroSlopeAtStart?zn:kn:n.endingStart=Ir,t?n.endingEnd=this.zeroSlopeAtEnd?zn:kn:n.endingEnd=Ir)}_scheduleFading(e,t,i){const n=this._mixer,r=n.time;let a=this._weightInterpolant;a===null&&(a=n._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=i,this}}const kp=new Float32Array(1);class cx extends nn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){const i=e._localRoot||this._root,n=e._clip.tracks,r=n.length,a=e._propertyBindings,o=e._interpolants,l=i.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let f=0;f!==r;++f){const u=n[f],d=u.name;let m=h[d];if(m!==void 0)++m.referenceCount,a[f]=m;else{if(m=a[f],m!==void 0){m._cacheIndex===null&&(++m.referenceCount,this._addInactiveBinding(m,l,d));continue}const x=t&&t._propertyBindings[f].binding.parsedPath;m=new Rp(ut.create(i,d,x),u.ValueTypeName,u.getValueSize()),++m.referenceCount,this._addInactiveBinding(m,l,d),a[f]=m}o[f].resultBuffer=m.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const i=(e._localRoot||this._root).uuid,n=e._clip.uuid,r=this._actionsByClip[n];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,n,i)}const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const r=t[i];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const r=t[i];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,i){const n=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=n.length,n.push(e),a.actionByRoot[i]=e}_removeInactiveAction(e){const t=this._actions,i=t[t.length-1],n=e._cacheIndex;i._cacheIndex=n,t[n]=i,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const f=o.actionByRoot,u=(e._localRoot||this._root).uuid;delete f[u],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let i=0,n=t.length;i!==n;++i){const r=t[i];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,i=e._cacheIndex,n=this._nActiveActions++,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_takeBackAction(e){const t=this._actions,i=e._cacheIndex,n=--this._nActiveActions,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_addInactiveBinding(e,t,i){const n=this._bindingsByRootAndName,r=this._bindings;let a=n[t];a===void 0&&(a={},n[t]=a),a[i]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,i=e.binding,n=i.rootNode.uuid,r=i.path,a=this._bindingsByRootAndName,o=a[n],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[n]}_lendBinding(e){const t=this._bindings,i=e._cacheIndex,n=this._nActiveBindings++,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_takeBackBinding(e){const t=this._bindings,i=e._cacheIndex,n=--this._nActiveBindings,r=t[n];e._cacheIndex=n,t[n]=e,r._cacheIndex=i,t[i]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let i=e[t];return i===void 0&&(i=new zh(new Float32Array(2),new Float32Array(2),1,kp),i.__cacheIndex=t,e[t]=i),i}_takeBackControlInterpolant(e){const t=this._controlInterpolants,i=e.__cacheIndex,n=--this._nActiveControlInterpolants,r=t[n];e.__cacheIndex=n,t[n]=e,r.__cacheIndex=i,t[i]=r}clipAction(e,t,i){const n=t||this._root,r=n.uuid;let a=typeof e=="string"?Mc.findByName(n,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(i===void 0&&(a!==null?i=a.blendMode:i=Go),l!==void 0){const f=l.actionByRoot[r];if(f!==void 0&&f.blendMode===i)return f;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new Bp(this,a,t,i);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(e,t){const i=t||this._root,n=i.uuid,r=typeof e=="string"?Mc.findByName(i,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[n]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let i=t-1;i>=0;--i)e[i].stop();return this}update(e){e*=this.timeScale;const t=this._actions,i=this._nActiveActions,n=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==i;++c)t[c]._update(n,e,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,i=e.uuid,n=this._actionsByClip,r=n[i];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,f=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,f._cacheIndex=h,t[h]=f,t.pop(),this._removeInactiveBindingsForAction(c)}delete n[i]}}uncacheRoot(e){const t=e.uuid,i=this._actionsByClip;for(const a in i){const o=i[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const n=this._bindingsByRootAndName,r=n[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const i=this.existingAction(e,t);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}}function Rc(s,e,t,i){const n=zp(i);switch(t){case yh:return s*e;case kr:return s*e/n.components*n.byteLength;case zo:return s*e/n.components*n.byteLength;case mn:return s*e*2/n.components*n.byteLength;case Ho:return s*e*2/n.components*n.byteLength;case Sh:return s*e*3/n.components*n.byteLength;case si:return s*e*4/n.components*n.byteLength;case Vo:return s*e*4/n.components*n.byteLength;case _r:case vr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case xr:case yr:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Za:case ja:return Math.max(s,16)*Math.max(e,8)/4;case Ka:case Ja:return Math.max(s,8)*Math.max(e,8)/2;case Qa:case eo:case io:case no:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case to:case Rr:case so:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ro:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ao:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case oo:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case lo:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case co:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case ho:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case uo:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case fo:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case po:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case mo:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case go:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case _o:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case vo:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case xo:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case yo:case So:case Mo:return Math.ceil(s/4)*Math.ceil(e/4)*16;case bo:case Eo:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Cr:case To:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function zp(s){switch(s){case Gt:case gh:return{byteLength:1,components:1};case Ts:case _h:case bi:return{byteLength:2,components:1};case Bo:case ko:return{byteLength:2,components:4};case Mi:case Oo:case ni:return{byteLength:4,components:1};case vh:case xh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Fo}}));typeof window<"u"&&(window.__THREE__?De("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Fo);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Xh(){let s=null,e=!1,t=null,i=null;function n(r,a){i=s.requestAnimationFrame(n),t(r,a)}return{start:function(){e!==!0&&t!==null&&s!==null&&(i=s.requestAnimationFrame(n),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Hp(s){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const h=l.array,f=l.updateRanges;if(s.bindBuffer(c,o),f.length===0)s.bufferSubData(c,0,h);else{f.sort((d,m)=>d.start-m.start);let u=0;for(let d=1;d<f.length;d++){const m=f[u],x=f[d];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++u,f[u]=x)}f.length=u+1;for(let d=0,m=f.length;d<m;d++){const x=f[d];s.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:r,update:a}}var Vp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Gp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Wp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Xp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Yp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,$p=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Kp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Zp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Jp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,jp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Qp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,em=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,tm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,im=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,nm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,sm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,rm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,am=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,om=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,lm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,cm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,hm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,um=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,dm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,fm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,pm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,mm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,gm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_m="gl_FragColor = linearToOutputTexel( gl_FragColor );",vm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,xm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,ym=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Sm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Mm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,bm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Em=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Tm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,wm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Am=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Rm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Cm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Pm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Im=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Lm=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Nm=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Dm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Um=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Fm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Om=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Bm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,km=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,zm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Hm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Vm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Gm=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Wm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ym=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$m=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Km=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Zm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Jm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Qm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,eg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,tg=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ig=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ng=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,sg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ag=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,og=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,hg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,ug=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,fg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,pg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,mg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,_g=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,yg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Sg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Mg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Eg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Tg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,wg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ag=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Cg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Pg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ig=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Lg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ng=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Dg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ug=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Og=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,kg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,zg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Hg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wg=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,$g=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Kg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Zg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Jg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,jg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,e0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,t0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,i0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,n0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,s0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,r0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,a0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,o0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,l0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,c0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,h0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,u0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,d0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,p0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,g0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,_0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,v0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,x0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,y0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ye={alphahash_fragment:Vp,alphahash_pars_fragment:Gp,alphamap_fragment:Wp,alphamap_pars_fragment:Xp,alphatest_fragment:qp,alphatest_pars_fragment:Yp,aomap_fragment:$p,aomap_pars_fragment:Kp,batching_pars_vertex:Zp,batching_vertex:Jp,begin_vertex:jp,beginnormal_vertex:Qp,bsdfs:em,iridescence_fragment:tm,bumpmap_pars_fragment:im,clipping_planes_fragment:nm,clipping_planes_pars_fragment:sm,clipping_planes_pars_vertex:rm,clipping_planes_vertex:am,color_fragment:om,color_pars_fragment:lm,color_pars_vertex:cm,color_vertex:hm,common:um,defaultnormal_vertex:dm,displacementmap_pars_vertex:fm,displacementmap_vertex:pm,emissivemap_fragment:mm,emissivemap_pars_fragment:gm,colorspace_fragment:_m,colorspace_pars_fragment:vm,envmap_fragment:xm,envmap_common_pars_fragment:ym,envmap_pars_fragment:Sm,envmap_pars_vertex:Mm,envmap_physical_pars_fragment:Nm,envmap_vertex:bm,fog_vertex:Em,fog_pars_vertex:Tm,fog_fragment:wm,fog_pars_fragment:Am,gradientmap_pars_fragment:Rm,lightmap_pars_fragment:Cm,lights_lambert_fragment:Pm,lights_lambert_pars_fragment:Im,lights_pars_begin:Lm,lights_toon_fragment:Dm,lights_toon_pars_fragment:Um,lights_phong_fragment:Fm,lights_phong_pars_fragment:Om,lights_physical_fragment:Bm,lights_physical_pars_fragment:km,lights_fragment_begin:zm,lights_fragment_maps:Hm,lights_fragment_end:Vm,lightprobes_pars_fragment:Gm,logdepthbuf_fragment:Wm,logdepthbuf_pars_fragment:Xm,logdepthbuf_pars_vertex:qm,logdepthbuf_vertex:Ym,map_fragment:$m,map_pars_fragment:Km,map_particle_fragment:Zm,map_particle_pars_fragment:Jm,metalnessmap_fragment:jm,metalnessmap_pars_fragment:Qm,morphinstance_vertex:eg,morphcolor_vertex:tg,morphnormal_vertex:ig,morphtarget_pars_vertex:ng,morphtarget_vertex:sg,normal_fragment_begin:rg,normal_fragment_maps:ag,normal_pars_fragment:og,normal_pars_vertex:lg,normal_vertex:cg,normalmap_pars_fragment:hg,clearcoat_normal_fragment_begin:ug,clearcoat_normal_fragment_maps:dg,clearcoat_pars_fragment:fg,iridescence_pars_fragment:pg,opaque_fragment:mg,packing:gg,premultiplied_alpha_fragment:_g,project_vertex:vg,dithering_fragment:xg,dithering_pars_fragment:yg,roughnessmap_fragment:Sg,roughnessmap_pars_fragment:Mg,shadowmap_pars_fragment:bg,shadowmap_pars_vertex:Eg,shadowmap_vertex:Tg,shadowmask_pars_fragment:wg,skinbase_vertex:Ag,skinning_pars_vertex:Rg,skinning_vertex:Cg,skinnormal_vertex:Pg,specularmap_fragment:Ig,specularmap_pars_fragment:Lg,tonemapping_fragment:Ng,tonemapping_pars_fragment:Dg,transmission_fragment:Ug,transmission_pars_fragment:Fg,uv_pars_fragment:Og,uv_pars_vertex:Bg,uv_vertex:kg,worldpos_vertex:zg,background_vert:Hg,background_frag:Vg,backgroundCube_vert:Gg,backgroundCube_frag:Wg,cube_vert:Xg,cube_frag:qg,depth_vert:Yg,depth_frag:$g,distance_vert:Kg,distance_frag:Zg,equirect_vert:Jg,equirect_frag:jg,linedashed_vert:Qg,linedashed_frag:e0,meshbasic_vert:t0,meshbasic_frag:i0,meshlambert_vert:n0,meshlambert_frag:s0,meshmatcap_vert:r0,meshmatcap_frag:a0,meshnormal_vert:o0,meshnormal_frag:l0,meshphong_vert:c0,meshphong_frag:h0,meshphysical_vert:u0,meshphysical_frag:d0,meshtoon_vert:f0,meshtoon_frag:p0,points_vert:m0,points_frag:g0,shadow_vert:_0,shadow_frag:v0,sprite_vert:x0,sprite_frag:y0},Me={common:{diffuse:{value:new Ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new st(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new Ke(16777215)},opacity:{value:1},center:{value:new st(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},xi={basic:{uniforms:zt([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:zt([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new Ke(0)},envMapIntensity:{value:1}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:zt([Me.common,Me.specularmap,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,Me.lights,{emissive:{value:new Ke(0)},specular:{value:new Ke(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:zt([Me.common,Me.envmap,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.roughnessmap,Me.metalnessmap,Me.fog,Me.lights,{emissive:{value:new Ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:zt([Me.common,Me.aomap,Me.lightmap,Me.emissivemap,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.gradientmap,Me.fog,Me.lights,{emissive:{value:new Ke(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:zt([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,Me.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:zt([Me.points,Me.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:zt([Me.common,Me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:zt([Me.common,Me.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:zt([Me.common,Me.bumpmap,Me.normalmap,Me.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:zt([Me.sprite,Me.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distance:{uniforms:zt([Me.common,Me.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distance_vert,fragmentShader:Ye.distance_frag},shadow:{uniforms:zt([Me.lights,Me.fog,{color:{value:new Ke(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};xi.physical={uniforms:zt([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new st(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new He},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new Ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new st},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new Ke(0)},specularColor:{value:new Ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new st},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};const dr={r:0,b:0,g:0},S0=new Qe,qh=new He;qh.set(-1,0,0,0,1,0,0,0,1);function M0(s,e,t,i,n,r){const a=new Ke(0);let o=n===!0?0:1,l,c,h=null,f=0,u=null;function d(M){let T=M.isScene===!0?M.background:null;if(T&&T.isTexture){const b=M.backgroundBlurriness>0;T=e.get(T,b)}return T}function m(M){let T=!1;const b=d(M);b===null?g(a,o):b&&b.isColor&&(g(b,1),T=!0);const R=s.xr.getEnvironmentBlendMode();R==="additive"?t.buffers.color.setClear(0,0,0,1,r):R==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function x(M,T){const b=d(T);b&&b.isCubeTexture?(c===void 0&&(c=new ri(new Ps(1,1,1),new gn({name:"BackgroundCubeMaterial",uniforms:Kn(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:Wt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(R,S,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=b,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(S0.makeRotationFromEuler(T.backgroundRotation)).transpose(),b.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(qh),c.material.toneMapped=nt.getTransfer(b.colorSpace)!==ht,(h!==b||f!==b.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=b,f=b.version,u=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new ri(new Vr(2,2),new gn({name:"BackgroundMaterial",uniforms:Kn(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=nt.getTransfer(b.colorSpace)!==ht,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||f!==b.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=b,f=b.version,u=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function g(M,T){M.getRGB(dr,kh(s)),t.buffers.color.setClear(dr.r,dr.g,dr.b,T,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,T=1){a.set(M),o=T,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,g(a,o)},render:m,addToRenderList:x,dispose:p}}function b0(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},n=u(null);let r=n,a=!1;function o(D,U,$,A,k){let X=!1;const H=f(D,A,$,U);r!==H&&(r=H,c(r.object)),X=d(D,A,$,k),X&&m(D,A,$,k),k!==null&&e.update(k,s.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,b(D,U,$,A),k!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function l(){return s.createVertexArray()}function c(D){return s.bindVertexArray(D)}function h(D){return s.deleteVertexArray(D)}function f(D,U,$,A){const k=A.wireframe===!0;let X=i[U.id];X===void 0&&(X={},i[U.id]=X);const H=D.isInstancedMesh===!0?D.id:0;let ne=X[H];ne===void 0&&(ne={},X[H]=ne);let q=ne[$.id];q===void 0&&(q={},ne[$.id]=q);let ee=q[k];return ee===void 0&&(ee=u(l()),q[k]=ee),ee}function u(D){const U=[],$=[],A=[];for(let k=0;k<t;k++)U[k]=0,$[k]=0,A[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:$,attributeDivisors:A,object:D,attributes:{},index:null}}function d(D,U,$,A){const k=r.attributes,X=U.attributes;let H=0;const ne=$.getAttributes();for(const q in ne)if(ne[q].location>=0){const B=k[q];let ae=X[q];if(ae===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(ae=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(ae=D.instanceColor)),B===void 0||B.attribute!==ae||ae&&B.data!==ae.data)return!0;H++}return r.attributesNum!==H||r.index!==A}function m(D,U,$,A){const k={},X=U.attributes;let H=0;const ne=$.getAttributes();for(const q in ne)if(ne[q].location>=0){let B=X[q];B===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(B=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(B=D.instanceColor));const ae={};ae.attribute=B,B&&B.data&&(ae.data=B.data),k[q]=ae,H++}r.attributes=k,r.attributesNum=H,r.index=A}function x(){const D=r.newAttributes;for(let U=0,$=D.length;U<$;U++)D[U]=0}function g(D){p(D,0)}function p(D,U){const $=r.newAttributes,A=r.enabledAttributes,k=r.attributeDivisors;$[D]=1,A[D]===0&&(s.enableVertexAttribArray(D),A[D]=1),k[D]!==U&&(s.vertexAttribDivisor(D,U),k[D]=U)}function M(){const D=r.newAttributes,U=r.enabledAttributes;for(let $=0,A=U.length;$<A;$++)U[$]!==D[$]&&(s.disableVertexAttribArray($),U[$]=0)}function T(D,U,$,A,k,X,H){H===!0?s.vertexAttribIPointer(D,U,$,k,X):s.vertexAttribPointer(D,U,$,A,k,X)}function b(D,U,$,A){x();const k=A.attributes,X=$.getAttributes(),H=U.defaultAttributeValues;for(const ne in X){const q=X[ne];if(q.location>=0){let ee=k[ne];if(ee===void 0&&(ne==="instanceMatrix"&&D.instanceMatrix&&(ee=D.instanceMatrix),ne==="instanceColor"&&D.instanceColor&&(ee=D.instanceColor)),ee!==void 0){const B=ee.normalized,ae=ee.itemSize,be=e.get(ee);if(be===void 0)continue;const z=be.buffer,ie=be.type,he=be.bytesPerElement,Te=ie===s.INT||ie===s.UNSIGNED_INT||ee.gpuType===Oo;if(ee.isInterleavedBufferAttribute){const se=ee.data,Ae=se.isInterleavedBuffer===!0?se.stride:se.itemSize,C=ee.offset;if(se.isInstancedInterleavedBuffer||se.isInstancedBufferAttribute){for(let N=0;N<q.locationSize;N++)p(q.location+N,se.meshPerAttribute);D.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let N=0;N<q.locationSize;N++)g(q.location+N);s.bindBuffer(s.ARRAY_BUFFER,z);for(let N=0;N<q.locationSize;N++)T(q.location+N,ae/q.locationSize,ie,B,Ae*he,(C+ae/q.locationSize*N)*he,Te)}else{if(ee.isInstancedBufferAttribute){for(let se=0;se<q.locationSize;se++)p(q.location+se,ee.meshPerAttribute);D.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let se=0;se<q.locationSize;se++)g(q.location+se);s.bindBuffer(s.ARRAY_BUFFER,z);for(let se=0;se<q.locationSize;se++)T(q.location+se,ae/q.locationSize,ie,B,ae*he,ae/q.locationSize*se*he,Te)}}else if(H!==void 0){const B=H[ne];if(B!==void 0)switch(B.length){case 2:s.vertexAttrib2fv(q.location,B);break;case 3:s.vertexAttrib3fv(q.location,B);break;case 4:s.vertexAttrib4fv(q.location,B);break;default:s.vertexAttrib1fv(q.location,B)}}}}M()}function R(){O();for(const D in i){const U=i[D];for(const $ in U){const A=U[$];for(const k in A){const X=A[k];for(const H in X)h(X[H].object),delete X[H];delete A[k]}}delete i[D]}}function S(D){if(i[D.id]===void 0)return;const U=i[D.id];for(const $ in U){const A=U[$];for(const k in A){const X=A[k];for(const H in X)h(X[H].object),delete X[H];delete A[k]}}delete i[D.id]}function _(D){for(const U in i){const $=i[U];for(const A in $){const k=$[A];if(k[D.id]===void 0)continue;const X=k[D.id];for(const H in X)h(X[H].object),delete X[H];delete k[D.id]}}}function E(D){for(const U in i){const $=i[U],A=D.isInstancedMesh===!0?D.id:0,k=$[A];if(k!==void 0){for(const X in k){const H=k[X];for(const ne in H)h(H[ne].object),delete H[ne];delete k[X]}delete $[A],Object.keys($).length===0&&delete i[U]}}}function O(){I(),a=!0,r!==n&&(r=n,c(r.object))}function I(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:O,resetDefaultState:I,dispose:R,releaseStatesOfGeometry:S,releaseStatesOfObject:E,releaseStatesOfProgram:_,initAttributes:x,enableAttribute:g,disableUnusedAttributes:M}}function E0(s,e,t){let i;function n(l){i=l}function r(l,c){s.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];t.update(u,i,1)}this.setMode=n,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function T0(s,e,t,i){let n;function r(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");n=s.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(_){return!(_!==si&&i.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){const E=_===bi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(_!==Gt&&_!==ni&&!E&&i.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(De("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),u=t.logarithmicDepthBuffer===!0&&f===!1;t.reversedDepthBuffer===!0&&f===!1&&De("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&f===!0&&De("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),T=s.getParameter(s.MAX_VARYING_VECTORS),b=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),R=s.getParameter(s.MAX_SAMPLES),S=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:M,maxVaryings:T,maxFragmentUniforms:b,maxSamples:R,samples:S}}function w0(s){const e=this;let t=null,i=0,n=!1,r=!1;const a=new Ji,o=new He,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||i!==0||n;return n=u,i=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){t=h(f,u,0)},this.setState=function(f,u,d){const m=f.clippingPlanes,x=f.clipIntersection,g=f.clipShadows,p=s.get(f);if(!n||m===null||m.length===0||r&&!g)r?h(null):c();else{const M=r?0:i,T=M*4;let b=p.clippingState||null;l.value=b,b=h(m,u,T,d);for(let R=0;R!==T;++R)b[R]=t[R];p.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(f,u,d,m){const x=f!==null?f.length:0;let g=null;if(x!==0){if(g=l.value,m!==!0||g===null){const p=d+x*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<p)&&(g=new Float32Array(p));for(let T=0,b=d;T!==x;++T,b+=4)a.copy(f[T]).applyMatrix4(M,o),a.normal.toArray(g,b),g[b+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}class tl extends Si{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},n=[i,i,i,i,i,i];this.texture=new Fh(n),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new Ps(5,5,5),r=new gn({name:"CubemapFromEquirect",uniforms:Kn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Wt,blending:Hn});r.uniforms.tEquirect.value=t;const a=new ri(n,r),o=t.minFilter;return t.minFilter===Oi&&(t.minFilter=Ct),new Po(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,n=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,n);e.setRenderTarget(r)}}const Cc=256,A0=3,R0=20,Yh=256,$h=16,C0=3,P0=new Y,I0=new Ke;class Or{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Po(1,10,null),this._boxMesh=new ri(new Ps(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,n=100,r={}){const{size:a=256,position:o=P0}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);const f=l.autoClear,u=l.autoClearColor,d=l.autoClearDepth,m=l.autoClearStencil,x=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,x===null&&(e.background=l.getClearColor(I0));const g=new Po(i,n,h);return g.position.copy(o),g.update(l,e),l.autoClear=f,l.autoClearColor=u,l.autoClearDepth=d,l.autoClearStencil=m,e.background=x,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Lc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ic(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Cc,Ah(e))}_fromTexture(e,t){e.mapping===Wn||e.mapping===Es?this._setSize(e.image.length===0?Cc:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,t=Pc(e,!1,!1),i=Math.log2(e)-A0;for(let n=0;n<=i;n++)t.texture.mipmaps.push({width:e>>n,height:e>>n});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=Pc(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){const n=this._boxMesh,r=this._cubeCamera;n.material=i,r.renderTarget=e,r.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,n),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===Wn||e.mapping===Es?(this._cubemapMaterial===null&&(this._cubemapMaterial=Lc()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Ic()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=L0(),this._integrationMaterial=N0());const t=this._cubeSize,i=e.texture.mipmaps.length-1,n=this._ggxMaterial.uniforms;n.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/$h);for(let a=0;a<=i;a++){const o=Or.lodToRoughness(a,i);if(a>i-C0)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(Yh*Math.pow(o,4)))+.5:0;n.roughness.value=o,n.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=D0());const i=this._blurMaterial,n=i.uniforms,r=this._sourceTarget;n.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,n.envMap.value=r.texture,this._renderCube(e,0,i),n.envMap.value=e.texture,this._renderCube(r,0,i)}}function Pc(s,e,t){return new tl(s,{minFilter:Oi,generateMipmaps:e,type:bi,colorSpace:ws,depthBuffer:t})}function Ls(s,e,t){return new gn({name:s,uniforms:e,vertexShader:Ye.cube_vert,fragmentShader:t,side:Wt,blending:Hn,depthTest:!1,depthWrite:!1})}function L0(){return Ls("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Yh}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function N0(){return Ls("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:$h}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function D0(){return Ls("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${R0}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Ic(){return Ls("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Lc(){return Ls("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function U0(s){let e=new WeakMap,t=new WeakMap,i=null;function n(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===ta||d===ia)if(e.has(u)){const m=e.get(u).texture;return o(m,u.mapping)}else{const m=u.image;if(m&&m.height>0){const x=new tl(m.height);return x.fromEquirectangularTexture(s,u),e.set(u,x),u.addEventListener("dispose",c),o(x.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture&&u.isPMREMTexture!==!0){const d=u.mapping,m=d===ta||d===ia,x=d===Wn||d===Es;if(m||x){let g=t.get(u);const p=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return i===null&&(i=new Or(s)),g=m?i.fromEquirectangular(u,g):i.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,t.set(u,g),g.texture;if(g!==void 0)return g.texture;{const M=u.image;return m&&M&&M.height>0||x&&M&&l(M)?(i===null&&(i=new Or(s)),g=m?i.fromEquirectangular(u):i.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,t.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function o(u,d){return d===ta?u.mapping=Wn:d===ia&&(u.mapping=Es),u}function l(u){let d=0;const m=6;for(let x=0;x<m;x++)u[x]!==void 0&&d++;return d===m}function c(u){const d=u.target;d.removeEventListener("dispose",c);const m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function h(u){const d=u.target;d.removeEventListener("dispose",h);const m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:f}}function F0(s){const e={};function t(i){if(e[i]!==void 0)return e[i];const n=s.getExtension(i);return e[i]=n,n}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const n=t(i);return n===null&&Vn("WebGLRenderer: "+i+" extension not supported."),n}}}function O0(s,e,t,i){const n={},r=new WeakMap,a=new FinalizationRegistry(m=>delete n[m]);function o(m){l(m.target)}function l(m){m.index!==null&&e.remove(m.index);for(const g in m.attributes)e.remove(m.attributes[g]);m.removeEventListener("dispose",o),delete n[m.id],a.unregister(m);const x=r.get(m);x&&(e.remove(x),r.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function c(m,x){return n[x.id]!==void 0||(x.addEventListener("dispose",o),n[x.id]=new WeakRef(x),a.register(x,x.id,x),t.memory.geometries++),x}function h(m){const x=m.attributes;for(const g in x)e.update(x[g],s.ARRAY_BUFFER)}function f(m){const x=m.index,g=m.attributes.position;let p=0;if(g===void 0)return;const M=x!==null?x.array.length:g.array.length/3-1,T=g.count>=65535?Lh:Ih,b=new T(Math.ceil(M/3)*6,1),R=b.array;if(x!==null){const _=x.array;p=x.version;for(let E=0,O=0;E<M;E+=3){const I=_[E+0],D=_[E+1],U=_[E+2];R[O++]=I,R[O++]=D,R[O++]=D,R[O++]=U,R[O++]=U,R[O++]=I}}else{p=g.version;for(let _=0,E=0;_<M;_+=3){const O=_+0,I=_+1,D=_+2;R[E++]=O,R[E++]=I,R[E++]=I,R[E++]=D,R[E++]=D,R[E++]=O}}b.version=p;const S=r.get(m);S&&e.remove(S),r.set(m,b)}function u(m){const x=r.get(m);if(x){const g=m.index;g!==null&&x.version<g.version&&f(m)}else f(m);return r.get(m)}function d(){for(const m in n){const x=n[m].deref();x!==void 0&&l(x)}}return{get:c,update:h,getWireframeAttribute:u,dispose:d}}function B0(s,e,t){let i;function n(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,u){s.drawElements(i,u,r,f*a),t.update(u,i,1)}function c(f,u,d){d!==0&&(s.drawElementsInstanced(i,u,r,f*a,d),t.update(u,i,d))}function h(f,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,f,0,d);let x=0;for(let g=0;g<d;g++)x+=u[g];t.update(x,i,1)}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function k0(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:ke("WebGLInfo: Unknown draw mode:",a);break}}function n(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:n,update:i}}function z0(s,e,t){const i=new WeakMap,n=new dt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==f){let O=function(){_.dispose(),i.delete(o),o.removeEventListener("dispose",O)};u!==void 0&&u.texture.dispose();const d=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let T=0;d===!0&&(T=1),m===!0&&(T=2),x===!0&&(T=3);let b=o.attributes.position.count*T,R=1;b>e.maxTextureSize&&(R=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const S=new Float32Array(b*R*4*f),_=new Rh(S,b,R,f);_.type=ni,_.needsUpdate=!0;const E=T*4;for(let I=0;I<f;I++){const D=g[I],U=p[I],$=M[I],A=b*R*4*I;for(let k=0;k<D.count;k++){const X=k*E;d===!0&&(n.fromBufferAttribute(D,k),S[A+X+0]=n.x,S[A+X+1]=n.y,S[A+X+2]=n.z,S[A+X+3]=0),m===!0&&(n.fromBufferAttribute(U,k),S[A+X+4]=n.x,S[A+X+5]=n.y,S[A+X+6]=n.z,S[A+X+7]=0),x===!0&&(n.fromBufferAttribute($,k),S[A+X+8]=n.x,S[A+X+9]=n.y,S[A+X+10]=n.z,S[A+X+11]=$.itemSize===4?n.w:1)}}u={count:f,texture:_,size:new st(b,R)},i.set(o,u),o.addEventListener("dispose",O)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let d=0;for(let x=0;x<c.length;x++)d+=c[x];const m=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(s,"morphTargetBaseInfluence",m),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function H0(s,e,t,i,n){let r=new WeakMap;function a(c){const h=n.render.frame,f=c.geometry,u=e.get(c,f);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const V0={[lh]:"LINEAR_TONE_MAPPING",[ch]:"REINHARD_TONE_MAPPING",[hh]:"CINEON_TONE_MAPPING",[uh]:"ACES_FILMIC_TONE_MAPPING",[fh]:"AGX_TONE_MAPPING",[ph]:"NEUTRAL_TONE_MAPPING",[dh]:"CUSTOM_TONE_MAPPING"};function G0(s,e,t,i,n,r){const a=new Si(e,t,{type:s,depthBuffer:n,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const h=new Ti;h.setAttribute("position",new Kt([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Kt([0,2,0,0,2,0],2));const f=new Co({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new ri(h,f),d=new jo(-1,1,1,-1,0,1);let m=null,x=null,g=!1,p,M=null,T=[],b=!1;this.setSize=function(R,S){a.setSize(R,S),o!==null&&o.setSize(R,S),l!==null&&l.setSize(R,S);for(let _=0;_<T.length;_++){const E=T[_];E.setSize&&E.setSize(R,S)}},this.setEffects=function(R){T=R,b=T.length>0&&T[0].isRenderPass===!0;const S=a.width,_=a.height;T.length>0&&o===null&&(o=new Si(S,_,{type:bi,depthBuffer:!1,stencilBuffer:!1}),l=new Si(S,_,{type:bi,depthBuffer:!1,stencilBuffer:!1}));const E=n===!0&&T.some(O=>O.needsDepthTexture===!0);E!==(a.depthTexture!==null)&&(E===!0&&c===null&&(c=new $n(S,_),r===!0&&(c.format=Qi,c.type=Xn)),a.dispose(),a.depthTexture=E?c:null,a.resolveDepthBuffer=E,a.storeMultisampledDepthBuffer=E);for(let O=0;O<T.length;O++){const I=T[O];I.setSize&&I.setSize(S,_),E&&I.needsDepthTexture===!0&&I.setDepthTexture&&I.setDepthTexture(c)}},this.begin=function(R,S){if(g||R.toneMapping===ki&&T.length===0)return!1;if(M=S,S!==null){const _=S.width,E=S.height;(a.width!==_||a.height!==E)&&this.setSize(_,E)}return b===!1&&R.setRenderTarget(a),p=R.toneMapping,R.toneMapping=ki,!0},this.hasRenderPass=function(){return b},this.end=function(R,S){R.toneMapping=p,g=!0;let _=a,E=o;for(let O=0;O<T.length;O++){const I=T[O];I.enabled!==!1&&(I.render(R,E,_,S),I.needsSwap!==!1&&(_=E,E=E===o?l:o))}if(m!==R.outputColorSpace||x!==R.toneMapping){m=R.outputColorSpace,x=R.toneMapping,f.defines={},nt.getTransfer(m)===ht&&(f.defines.SRGB_TRANSFER="");const O=V0[x];O&&(f.defines[O]=""),f.needsUpdate=!0}f.uniforms.tDiffuse.value=_.texture,R.setRenderTarget(M),R.render(u,d),M=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),f.dispose()}}const Kh=new It,Zh=new $n(1,1),Jh=new Oh(1),jh=new Rh,Qh=new Cf,eu=new Fh,Nc=[],Dc=[],Uc=new Float32Array(16),Fc=new Float32Array(9),Oc=new Float32Array(4);function Qn(s,e,t){const i=s[0];if(i<=0||i>0)return s;const n=e*t;let r=Nc[n];if(r===void 0&&(r=new Float32Array(n),Nc[n]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Et(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function Tt(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function Wr(s,e){let t=Dc[e];t===void 0&&(t=new Int32Array(e),Dc[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function W0(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function X0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;s.uniform2fv(this.addr,e),Tt(t,e)}}function q0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Et(t,e))return;s.uniform3fv(this.addr,e),Tt(t,e)}}function Y0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;s.uniform4fv(this.addr,e),Tt(t,e)}}function $0(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,i))return;Oc.set(i),s.uniformMatrix2fv(this.addr,!1,Oc),Tt(t,i)}}function K0(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,i))return;Fc.set(i),s.uniformMatrix3fv(this.addr,!1,Fc),Tt(t,i)}}function Z0(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(Et(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Tt(t,e)}else{if(Et(t,i))return;Uc.set(i),s.uniformMatrix4fv(this.addr,!1,Uc),Tt(t,i)}}function J0(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function j0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;s.uniform2iv(this.addr,e),Tt(t,e)}}function Q0(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;s.uniform3iv(this.addr,e),Tt(t,e)}}function e_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;s.uniform4iv(this.addr,e),Tt(t,e)}}function t_(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function i_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Et(t,e))return;s.uniform2uiv(this.addr,e),Tt(t,e)}}function n_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Et(t,e))return;s.uniform3uiv(this.addr,e),Tt(t,e)}}function s_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Et(t,e))return;s.uniform4uiv(this.addr,e),Tt(t,e)}}function Xr(s){return s.version===0&&(s.compareFunction=Eh,s.needsUpdate=!0),s}function r_(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let r;this.type===s.SAMPLER_2D_SHADOW?r=Xr(Zh):r=Kh,t.setTexture2D(e||r,n)}function a_(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture3D(e||Qh,n)}function o_(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n);let r;this.type===s.SAMPLER_CUBE_SHADOW?r=Xr(Jh):r=eu,t.setTextureCube(e||r,n)}function l_(s,e,t){const i=this.cache,n=t.allocateTextureUnit();i[0]!==n&&(s.uniform1i(this.addr,n),i[0]=n),t.setTexture2DArray(e||jh,n)}function c_(s){switch(s){case 5126:return W0;case 35664:return X0;case 35665:return q0;case 35666:return Y0;case 35674:return $0;case 35675:return K0;case 35676:return Z0;case 5124:case 35670:return J0;case 35667:case 35671:return j0;case 35668:case 35672:return Q0;case 35669:case 35673:return e_;case 5125:return t_;case 36294:return i_;case 36295:return n_;case 36296:return s_;case 35678:case 36198:case 36298:case 36306:case 35682:return r_;case 35679:case 36299:case 36307:return a_;case 35680:case 36300:case 36308:case 36293:return o_;case 36289:case 36303:case 36311:case 36292:return l_}}function h_(s,e){s.uniform1fv(this.addr,e)}function u_(s,e){const t=Qn(e,this.size,2);s.uniform2fv(this.addr,t)}function d_(s,e){const t=Qn(e,this.size,3);s.uniform3fv(this.addr,t)}function f_(s,e){const t=Qn(e,this.size,4);s.uniform4fv(this.addr,t)}function p_(s,e){const t=Qn(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function m_(s,e){const t=Qn(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function g_(s,e){const t=Qn(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function __(s,e){s.uniform1iv(this.addr,e)}function v_(s,e){s.uniform2iv(this.addr,e)}function x_(s,e){s.uniform3iv(this.addr,e)}function y_(s,e){s.uniform4iv(this.addr,e)}function S_(s,e){s.uniform1uiv(this.addr,e)}function M_(s,e){s.uniform2uiv(this.addr,e)}function b_(s,e){s.uniform3uiv(this.addr,e)}function E_(s,e){s.uniform4uiv(this.addr,e)}function T_(s,e,t){const i=this.cache,n=e.length,r=Wr(t,n);Et(i,r)||(s.uniform1iv(this.addr,r),Tt(i,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=Xr(Zh):a=Kh;for(let o=0;o!==n;++o)t.setTexture2D(e[o]||a,r[o])}function w_(s,e,t){const i=this.cache,n=e.length,r=Wr(t,n);Et(i,r)||(s.uniform1iv(this.addr,r),Tt(i,r));for(let a=0;a!==n;++a)t.setTexture3D(e[a]||Qh,r[a])}function A_(s,e,t){const i=this.cache,n=e.length,r=Wr(t,n);Et(i,r)||(s.uniform1iv(this.addr,r),Tt(i,r));let a;this.type===s.SAMPLER_CUBE_SHADOW?a=Xr(Jh):a=eu;for(let o=0;o!==n;++o)t.setTextureCube(e[o]||a,r[o])}function R_(s,e,t){const i=this.cache,n=e.length,r=Wr(t,n);Et(i,r)||(s.uniform1iv(this.addr,r),Tt(i,r));for(let a=0;a!==n;++a)t.setTexture2DArray(e[a]||jh,r[a])}function C_(s){switch(s){case 5126:return h_;case 35664:return u_;case 35665:return d_;case 35666:return f_;case 35674:return p_;case 35675:return m_;case 35676:return g_;case 5124:case 35670:return __;case 35667:case 35671:return v_;case 35668:case 35672:return x_;case 35669:case 35673:return y_;case 5125:return S_;case 36294:return M_;case 36295:return b_;case 36296:return E_;case 35678:case 36198:case 36298:case 36306:case 35682:return T_;case 35679:case 36299:case 36307:return w_;case 35680:case 36300:case 36308:case 36293:return A_;case 36289:case 36303:case 36311:case 36292:return R_}}class P_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=c_(t.type)}}class I_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=C_(t.type)}}class L_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const n=this.seq;for(let r=0,a=n.length;r!==a;++r){const o=n[r];o.setValue(e,t[o.id],i)}}}const Ia=/(\w+)(\])?(\[|\.)?/g;function Bc(s,e){s.seq.push(e),s.map[e.id]=e}function N_(s,e,t){const i=s.name,n=i.length;for(Ia.lastIndex=0;;){const r=Ia.exec(i),a=Ia.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){Bc(t,c===void 0?new P_(o,s,e):new I_(o,s,e));break}else{let f=t.map[o];f===void 0&&(f=new L_(o),Bc(t,f)),t=f}}}class Sr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);N_(o,l,this)}const n=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?n.push(a):r.push(a);n.length>0&&(this.seq=n.concat(r))}setValue(e,t,i,n){const r=this.map[t];r!==void 0&&r.setValue(e,i,n)}setOptional(e,t,i){const n=t[i];n!==void 0&&this.setValue(e,i,n)}static upload(e,t,i,n){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,n)}}static seqWithValue(e,t){const i=[];for(let n=0,r=e.length;n!==r;++n){const a=e[n];a.id in t&&i.push(a)}return i}}function kc(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const D_=37297;let U_=0;function F_(s,e){const t=s.split(`
`),i=[],n=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=n;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const zc=new He;function O_(s){nt._getMatrix(zc,nt.workingColorSpace,s);const e=`mat3( ${zc.elements.map(t=>t.toFixed(4))} )`;switch(nt.getTransfer(s)){case Lr:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return De("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Hc(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+F_(s.getShaderSource(e),o)}else return r}function B_(s,e){const t=O_(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const k_={[lh]:"Linear",[ch]:"Reinhard",[hh]:"Cineon",[uh]:"ACESFilmic",[fh]:"AgX",[ph]:"Neutral",[dh]:"Custom"};function z_(s,e){const t=k_[e];return t===void 0?(De("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const fr=new Y;function H_(){nt.getLuminanceCoefficients(fr);const s=fr.x.toFixed(4),e=fr.y.toFixed(4),t=fr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function V_(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vs).join(`
`)}function G_(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function W_(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const r=s.getActiveAttrib(e,n),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function vs(s){return s!==""}function Vc(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function Gc(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const X_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Io(s){return s.replace(X_,q_)}function q_(s,e){const t=Ye[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Io(t)}const Y_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Wc(s){return s.replace(Y_,$_)}function $_(s,e,t,i){let n="";for(let r=parseInt(e);r<parseInt(t);r++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return n}function Xc(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const K_={[gr]:"SHADOWMAP_TYPE_PCF",[gs]:"SHADOWMAP_TYPE_VSM"};function Z_(s){return K_[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const J_={[Es]:"ENVMAP_MODE_REFRACTION"};function j_(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":J_[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Q_={[oh]:"ENVMAP_BLENDING_MULTIPLY",[Hd]:"ENVMAP_BLENDING_MIX",[Vd]:"ENVMAP_BLENDING_ADD"};function ev(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Q_[s.combine]||"ENVMAP_BLENDING_NONE"}function tv(s,e,t,i){const n=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Z_(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=j_(t),f=ev(t),u=V_(t),d=G_(r),m=n.createProgram();let x,g,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(vs).join(`
`),x.length>0&&(x+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d].filter(vs).join(`
`),g.length>0&&(g+=`
`)):(x=[Xc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vs).join(`
`),g=[Xc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,d,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ki?"#define TONE_MAPPING":"",t.toneMapping!==ki?Ye.tonemapping_pars_fragment:"",t.toneMapping!==ki?z_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,B_("linearToOutputTexel",t.outputColorSpace),H_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vs).join(`
`)),a=Io(a),a=Vc(a,t),a=Gc(a,t),o=Io(o),o=Vc(o,t),o=Gc(o,t),a=Wc(a),o=Wc(o),t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,x=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,g=["#define varying in",t.glslVersion===Nr?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Nr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const M=p+x+a,T=p+g+o,b=kc(n,n.VERTEX_SHADER,M),R=kc(n,n.FRAGMENT_SHADER,T);n.attachShader(m,b),n.attachShader(m,R),t.index0AttributeName!==void 0?n.bindAttribLocation(m,0,t.index0AttributeName):t.hasPositionAttribute===!0&&n.bindAttribLocation(m,0,"position"),n.linkProgram(m);function S(I){if(s.debug.checkShaderErrors){const D=n.getProgramInfoLog(m)||"",U=n.getShaderInfoLog(b)||"",$=n.getShaderInfoLog(R)||"",A=D.trim(),k=U.trim(),X=$.trim();let H=!0,ne=!0;if(n.getProgramParameter(m,n.LINK_STATUS)===!1)if(H=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(n,m,b,R);else{const q=Hc(n,b,"vertex"),ee=Hc(n,R,"fragment");ke("WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(m,n.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+A+`
`+q+`
`+ee)}else A!==""?De("WebGLProgram: Program Info Log:",A):(k===""||X==="")&&(ne=!1);ne&&(I.diagnostics={runnable:H,programLog:A,vertexShader:{log:k,prefix:x},fragmentShader:{log:X,prefix:g}})}n.deleteShader(b),n.deleteShader(R),_=new Sr(n,m),E=W_(n,m)}let _;this.getUniforms=function(){return _===void 0&&S(this),_};let E;this.getAttributes=function(){return E===void 0&&S(this),E};let O=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return O===!1&&(O=n.getProgramParameter(m,D_)),O},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=U_++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=R,this}let iv=0;class nv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const n=this._getShaderCacheForMaterial(e);return n.has(t)===!1&&(n.add(t),t.usedTimes++),n.has(i)===!1&&(n.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new sv(e),t.set(e,i)),i}}class sv{constructor(e){this.id=iv++,this.code=e,this.usedTimes=0}}function rv(s){return s===mn||s===Rr||s===Cr}function av(s,e,t,i,n,r){const a=new Ch,o=new nv,l=new Set,c=[],h=new Map,f=i.logarithmicDepthBuffer,u={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(_){return l.add(_),_===0?"uv":`uv${_}`}function m(_,E,O,I,D,U){const $=I.fog,A=D.geometry,k=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,X=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,H=e.get(_.envMap||k,X),ne=u[_.type];let q=i.precision;_.precision!==null&&(q=i.getMaxPrecision(_.precision),q!==_.precision&&De("WebGLProgram.getParameters:",_.precision,"not supported, using",q,"instead."));const ee=A.morphAttributes.position||A.morphAttributes.normal||A.morphAttributes.color,B=ee!==void 0?ee.length:0;let ae=0;A.morphAttributes.position!==void 0&&(ae=1),A.morphAttributes.normal!==void 0&&(ae=2),A.morphAttributes.color!==void 0&&(ae=3);let be,z,ie,he;if(ne){const Se=xi[ne];be=Se.vertexShader,z=Se.fragmentShader}else{be=_.vertexShader,z=_.fragmentShader;const Se=o.getVertexShaderStage(_),ct=o.getFragmentShaderStage(_);o.update(_,Se,ct),ie=Se.id,he=ct.id}const Te=s.getRenderTarget(),se=s.state.buffers.depth.getReversed(),Ae=D.isInstancedMesh===!0,C=D.isBatchedMesh===!0,N=!!_.map,ye=!!_.matcap,Ne=!!H,oe=Ne&&H.isPMREMTexture===!0,Ie=!!_.aoMap,Oe=!!_.lightMap,Pe=!!_.bumpMap&&_.wireframe===!1,rt=!!_.normalMap,$e=!!_.displacementMap,Xe=!!_.emissiveMap,Ot=!!_.metalnessMap,Lt=!!_.roughnessMap,Zt=_.anisotropy>0,F=_.clearcoat>0,Jt=_.diffuseRoughness>0,gt=_.dispersion>0,_t=_.retroreflectivity>0,ve=_.iridescence>0,Mt=_.sheen>0,Be=_.transmission>0,ze=Zt&&!!_.anisotropyMap,w=F&&!!_.clearcoatMap,v=F&&!!_.clearcoatNormalMap,G=F&&!!_.clearcoatRoughnessMap,re=Jt&&!!_.diffuseRoughnessMap,te=ve&&!!_.iridescenceMap,ue=ve&&!!_.iridescenceThicknessMap,ge=Mt&&!!_.sheenColorMap,J=Mt&&!!_.sheenRoughnessMap,j=!!_.specularMap,fe=!!_.specularColorMap,P=!!_.specularIntensityMap,Q=Be&&!!_.transmissionMap,Z=Be&&!!_.thicknessMap,pe=!!_.gradientMap,ce=!!_.alphaMap,de=_.alphaTest>0,Ue=!!_.alphaHash,qe=!!_.extensions;let le=ki;_.toneMapped&&(Te===null||Te.isXRRenderTarget===!0)&&(le=s.toneMapping);const Fe=oe?H.isCompressedCubeTexture?H.image[0].mipmaps:H.mipmaps:null,We={shaderID:ne,shaderType:_.type,shaderName:_.name,vertexShader:be,fragmentShader:z,defines:_.defines,customVertexShaderID:ie,customFragmentShaderID:he,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:q,batching:C,batchingColor:C&&D._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&D.instanceColor!==null,instancingMorph:Ae&&D.morphTexture!==null,outputColorSpace:Te===null?s.outputColorSpace:Te.isXRRenderTarget===!0?Te.texture.colorSpace:nt.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:N,matcap:ye,envMap:Ne,envMapMode:Ne&&H.mapping,envMapPMREM:oe,envMapMaxLod:oe?Fe.length-1:null,envMapSize:oe?Fe[0].width:null,aoMap:Ie,lightMap:Oe,bumpMap:Pe,normalMap:rt,displacementMap:$e,emissiveMap:Xe,normalMapObjectSpace:rt&&_.normalMapType===Zd,normalMapTangentSpace:rt&&_.normalMapType===Ao,packedNormalMap:rt&&_.normalMapType===Ao&&rv(_.normalMap.format),metalnessMap:Ot,roughnessMap:Lt,anisotropy:Zt,anisotropyMap:ze,clearcoat:F,clearcoatMap:w,clearcoatNormalMap:v,clearcoatRoughnessMap:G,diffuseRoughness:Jt,diffuseRoughnessMap:re,dispersion:gt,retroreflection:_t,iridescence:ve,iridescenceMap:te,iridescenceThicknessMap:ue,sheen:Mt,sheenColorMap:ge,sheenRoughnessMap:J,specularMap:j,specularColorMap:fe,specularIntensityMap:P,transmission:Be,transmissionMap:Q,thicknessMap:Z,gradientMap:pe,opaque:_.transparent===!1&&_.blending===ys&&_.alphaToCoverage===!1,alphaMap:ce,alphaTest:de,alphaHash:Ue,combine:_.combine,mapUv:N&&d(_.map.channel),aoMapUv:Ie&&d(_.aoMap.channel),lightMapUv:Oe&&d(_.lightMap.channel),bumpMapUv:Pe&&d(_.bumpMap.channel),normalMapUv:rt&&d(_.normalMap.channel),displacementMapUv:$e&&d(_.displacementMap.channel),emissiveMapUv:Xe&&d(_.emissiveMap.channel),metalnessMapUv:Ot&&d(_.metalnessMap.channel),roughnessMapUv:Lt&&d(_.roughnessMap.channel),anisotropyMapUv:ze&&d(_.anisotropyMap.channel),clearcoatMapUv:w&&d(_.clearcoatMap.channel),clearcoatNormalMapUv:v&&d(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:G&&d(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:re&&d(_.diffuseRoughnessMap.channel),iridescenceMapUv:te&&d(_.iridescenceMap.channel),iridescenceThicknessMapUv:ue&&d(_.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&d(_.sheenColorMap.channel),sheenRoughnessMapUv:J&&d(_.sheenRoughnessMap.channel),specularMapUv:j&&d(_.specularMap.channel),specularColorMapUv:fe&&d(_.specularColorMap.channel),specularIntensityMapUv:P&&d(_.specularIntensityMap.channel),transmissionMapUv:Q&&d(_.transmissionMap.channel),thicknessMapUv:Z&&d(_.thicknessMap.channel),alphaMapUv:ce&&d(_.alphaMap.channel),vertexTangents:!!A.attributes.tangent&&(rt||Zt),vertexNormals:!!A.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!A.attributes.color&&A.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!A.attributes.uv&&(N||ce),fog:!!$,useFog:_.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||A.attributes.normal===void 0&&rt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:se,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:A.attributes.position!==void 0,morphTargets:A.morphAttributes.position!==void 0,morphNormals:A.morphAttributes.normal!==void 0,morphColors:A.morphAttributes.color!==void 0,morphTargetsCount:B,morphTextureStride:ae,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:U.filter(Se=>Se.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&O.length>0,shadowMapType:s.shadowMap.type,toneMapping:le,decodeVideoTexture:N&&_.map.isVideoTexture===!0&&nt.getTransfer(_.map.colorSpace)===ht,decodeVideoTextureEmissive:Xe&&_.emissiveMap.isVideoTexture===!0&&nt.getTransfer(_.emissiveMap.colorSpace)===ht,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===fi,flipSided:_.side===Wt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:qe&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(qe&&_.extensions.multiDraw===!0||C)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return We.vertexUv1s=l.has(1),We.vertexUv2s=l.has(2),We.vertexUv3s=l.has(3),l.clear(),We}function x(_){const E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(const O in _.defines)E.push(O),E.push(_.defines[O]);return _.isRawShaderMaterial===!1&&(g(E,_),p(E,_),E.push(s.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function g(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapPMREM),_.push(E.envMapMaxLod),_.push(E.envMapSize),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.diffuseRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.numSunLights),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numSunLightShadows),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.numLightProbeGrids),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function p(_,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.diffuseRoughness&&a.enable(25),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function M(_){const E=u[_.type];let O;if(E){const I=xi[E];O=np.clone(I.uniforms)}else O=_.uniforms;return O}function T(_,E){let O=h.get(E);return O!==void 0?++O.usedTimes:(O=new tv(s,E,_,n),c.push(O),h.set(E,O)),O}function b(_){if(--_.usedTimes===0){const E=c.indexOf(_);c[E]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function R(_){o.remove(_)}function S(){o.dispose()}return{getParameters:m,getProgramCacheKey:x,getUniforms:M,acquireProgram:T,releaseProgram:b,releaseShaderCache:R,programs:c,dispose:S}}function ov(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function i(a){s.delete(a)}function n(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:i,update:n,dispose:r}}function lv(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function qc(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Yc(){const s=[];let e=0;const t=[],i=[],n=[];function r(){e=0,t.length=0,i.length=0,n.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,m,x,g,p){let M=s[e];return M===void 0?(M={id:u.id,object:u,geometry:d,material:m,materialVariant:a(u),groupOrder:x,renderOrder:u.renderOrder,z:g,group:p},s[e]=M):(M.id=u.id,M.object=u,M.geometry=d,M.material=m,M.materialVariant=a(u),M.groupOrder=x,M.renderOrder=u.renderOrder,M.z=g,M.group=p),e++,M}function l(u,d,m,x,g,p,M){M.reversedDepth===!0&&(g=-g);const T=o(u,d,m,x,g,p);m.transmission>0?i.push(T):m.transparent===!0?n.push(T):t.push(T)}function c(u,d,m,x,g,p){const M=o(u,d,m,x,g,p);m.transmission>0?i.unshift(M):m.transparent===!0?n.unshift(M):t.unshift(M)}function h(u,d){t.length>1&&t.sort(u||lv),i.length>1&&i.sort(d||qc),n.length>1&&n.sort(d||qc)}function f(){for(let u=e,d=s.length;u<d;u++){const m=s[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:n,init:r,push:l,unshift:c,finish:f,sort:h}}function cv(){let s=new WeakMap;function e(i,n){const r=s.get(i);let a;return r===void 0?(a=new Yc,s.set(i,[a])):n>=r.length?(a=new Yc,r.push(a)):a=r[n],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function hv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new Y,color:new Ke};break;case"SpotLight":t={position:new Y,direction:new Y,color:new Ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Y,color:new Ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Y,skyColor:new Ke,groundColor:new Ke};break;case"RectAreaLight":t={color:new Ke,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return s[e.id]=t,t}}}function uv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let dv=0;function fv(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function pv(s){const e=new hv,t=uv(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new Y);const n=new Y,r=new Qe,a=new Qe;function o(c){let h=0,f=0,u=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let d=0,m=0,x=0,g=0,p=0,M=0,T=0,b=0,R=0,S=0,_=0,E=0,O=0,I=0;c.sort(fv);for(let U=0,$=c.length;U<$;U++){const A=c[U],k=A.color,X=A.intensity,H=A.distance;let ne=null;if(A.shadow&&A.shadow.map&&(A.shadow.map.texture.format===mn?ne=A.shadow.map.texture:ne=A.shadow.map.depthTexture||A.shadow.map.texture),A.isAmbientLight)h+=k.r*X,f+=k.g*X,u+=k.b*X;else if(A.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(A.sh.coefficients[q],X);I++}else if(A.isSunLight){const q=e.get(A);if(q.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const ee=A.shadow,B=t.get(A);B.shadowIntensity=ee.intensity,B.shadowBias=ee.bias,B.shadowNormalBias=ee.normalBias,B.shadowRadius=ee.radius,B.shadowMapSize.copy(ee.mapSize).multiply(ee.getFrameExtents()),i.sunShadow[m]=B,i.sunShadowMap[m]=ne;const ae=ee.getViewportCount();for(let be=0;be<ae;be++)i.sunShadowMatrix[x+be]=ee.getMatrix(be),i.sunShadowCascade[x+be]=ee._cascadeData[be];x+=ae,m++}i.sun[d]=q,d++}else if(A.isDirectionalLight){const q=e.get(A);if(q.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const ee=A.shadow,B=t.get(A);B.shadowIntensity=ee.intensity,B.shadowBias=ee.bias,B.shadowNormalBias=ee.normalBias,B.shadowRadius=ee.radius,B.shadowMapSize=ee.mapSize,i.directionalShadow[g]=B,i.directionalShadowMap[g]=ne,i.directionalShadowMatrix[g]=A.shadow.matrix,R++}i.directional[g]=q,g++}else if(A.isSpotLight){const q=e.get(A);q.position.setFromMatrixPosition(A.matrixWorld),q.color.copy(k).multiplyScalar(X),q.distance=H,q.coneCos=Math.cos(A.angle),q.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),q.decay=A.decay,i.spot[M]=q;const ee=A.shadow;if(A.map&&(i.spotLightMap[E]=A.map,E++,ee.updateMatrices(A),A.castShadow&&O++),i.spotLightMatrix[M]=ee.matrix,A.castShadow){const B=t.get(A);B.shadowIntensity=ee.intensity,B.shadowBias=ee.bias,B.shadowNormalBias=ee.normalBias,B.shadowRadius=ee.radius,B.shadowMapSize=ee.mapSize,i.spotShadow[M]=B,i.spotShadowMap[M]=ne,_++}M++}else if(A.isRectAreaLight){const q=e.get(A);q.color.copy(k).multiplyScalar(X),q.halfWidth.set(A.width*.5,0,0),q.halfHeight.set(0,A.height*.5,0),i.rectArea[T]=q,T++}else if(A.isPointLight){const q=e.get(A);if(q.color.copy(A.color).multiplyScalar(A.intensity),q.distance=A.distance,q.decay=A.decay,A.castShadow){const ee=A.shadow,B=t.get(A);B.shadowIntensity=ee.intensity,B.shadowBias=ee.bias,B.shadowNormalBias=ee.normalBias,B.shadowRadius=ee.radius,B.shadowMapSize=ee.mapSize,B.shadowCameraNear=ee.camera.near,B.shadowCameraFar=ee.camera.far,i.pointShadow[p]=B,i.pointShadowMap[p]=ne,i.pointShadowMatrix[p]=A.shadow.matrix,S++}i.point[p]=q,p++}else if(A.isHemisphereLight){const q=e.get(A);q.skyColor.copy(A.color).multiplyScalar(X),q.groundColor.copy(A.groundColor).multiplyScalar(X),i.hemi[b]=q,b++}}T>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Me.LTC_FLOAT_1,i.rectAreaLTC2=Me.LTC_FLOAT_2):(i.rectAreaLTC1=Me.LTC_HALF_1,i.rectAreaLTC2=Me.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=u;const D=i.hash;(D.sunLength!==d||D.directionalLength!==g||D.pointLength!==p||D.spotLength!==M||D.rectAreaLength!==T||D.hemiLength!==b||D.numSunShadows!==m||D.numDirectionalShadows!==R||D.numPointShadows!==S||D.numSpotShadows!==_||D.numSpotMaps!==E||D.numLightProbes!==I)&&(i.sun.length=d,i.directional.length=g,i.spot.length=M,i.rectArea.length=T,i.point.length=p,i.hemi.length=b,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=R,i.directionalShadowMap.length=R,i.directionalShadowMatrix.length=R,i.pointShadow.length=S,i.pointShadowMap.length=S,i.pointShadowMatrix.length=S,i.spotShadow.length=_,i.spotShadowMap.length=_,i.spotLightMatrix.length=_+E-O,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=O,i.numLightProbes=I,D.sunLength=d,D.directionalLength=g,D.pointLength=p,D.spotLength=M,D.rectAreaLength=T,D.hemiLength=b,D.numSunShadows=m,D.numDirectionalShadows=R,D.numPointShadows=S,D.numSpotShadows=_,D.numSpotMaps=E,D.numLightProbes=I,i.version=dv++)}function l(c,h){let f=0,u=0,d=0,m=0,x=0,g=0;const p=h.matrixWorldInverse;for(let M=0,T=c.length;M<T;M++){const b=c[M];if(b.isSunLight){const R=i.sun[f];R.direction.setFromMatrixPosition(b.matrixWorld),R.direction.transformDirection(p),f++}else if(b.isDirectionalLight){const R=i.directional[u];R.direction.setFromMatrixPosition(b.matrixWorld),n.setFromMatrixPosition(b.target.matrixWorld),R.direction.sub(n),R.direction.transformDirection(p),u++}else if(b.isSpotLight){const R=i.spot[m];R.position.setFromMatrixPosition(b.matrixWorld),R.position.applyMatrix4(p),R.direction.setFromMatrixPosition(b.matrixWorld),n.setFromMatrixPosition(b.target.matrixWorld),R.direction.sub(n),R.direction.transformDirection(p),m++}else if(b.isRectAreaLight){const R=i.rectArea[x];R.position.setFromMatrixPosition(b.matrixWorld),R.position.applyMatrix4(p),a.identity(),r.copy(b.matrixWorld),r.premultiply(p),a.extractRotation(r),R.halfWidth.set(b.width*.5,0,0),R.halfHeight.set(0,b.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),x++}else if(b.isPointLight){const R=i.point[d];R.position.setFromMatrixPosition(b.matrixWorld),R.position.applyMatrix4(p),d++}else if(b.isHemisphereLight){const R=i.hemi[g];R.direction.setFromMatrixPosition(b.matrixWorld),R.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:i}}function $c(s){const e=new pv(s),t=[],i=[],n=[];function r(f){h.camera=f,t.length=0,i.length=0,n.length=0}function a(f){f.isLightProbeGrid?n.push(f):t.push(f)}function o(f){i.push(f)}function l(){e.setup(t),n.sort((f,u)=>f.priority-u.priority||f.id-u.id)}function c(f){e.setupView(t,f)}const h={lightsArray:t,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function mv(s){let e=new WeakMap;function t(n,r=0){const a=e.get(n);let o;return a===void 0?(o=new $c(s),e.set(n,[o])):r>=a.length?(o=new $c(s),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const gv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_v=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,vv=[new Y(1,0,0),new Y(-1,0,0),new Y(0,1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1)],xv=[new Y(0,-1,0),new Y(0,-1,0),new Y(0,0,1),new Y(0,0,-1),new Y(0,-1,0),new Y(0,-1,0)],Kc=new Qe,ps=new Y,La=new Y;function yv(s,e,t){let i=new Cs;const n=new st,r=new st,a=new dt,o=new op,l=new lp,c={},h=t.maxTextureSize,f={[pn]:Wt,[Wt]:pn,[fi]:fi},u=new gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new st},radius:{value:4}},vertexShader:gv,fragmentShader:_v}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const m=new Ti;m.setAttribute("position",new Hi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new ri(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gr;let p=this.type;this.render=function(S,_,E){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;this.type===Td&&(De("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=gr);const O=s.getRenderTarget(),I=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),U=s.state;U.setBlending(Hn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const $=p!==this.type;$&&_.traverse(function(A){A.material&&(Array.isArray(A.material)?A.material.forEach(k=>k.needsUpdate=!0):A.material.needsUpdate=!0)});for(let A=0,k=S.length;A<k;A++){const X=S[A],H=X.shadow;if(H===void 0){De("WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;n.copy(H.mapSize);const ne=H.getFrameExtents();n.multiply(ne),r.copy(H.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(r.x=Math.floor(h/ne.x),n.x=r.x*ne.x,H.mapSize.x=r.x),n.y>h&&(r.y=Math.floor(h/ne.y),n.y=r.y*ne.y,H.mapSize.y=r.y));const q=s.state.buffers.depth.getReversed();if(H.camera._reversedDepth=q,H.map===null||$===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===gs){if(X.isPointLight){De("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Si(n.x,n.y,{format:mn,type:bi,minFilter:Ct,magFilter:Ct,generateMipmaps:!1}),H.map.texture.name=X.name+".shadowMap",H.map.depthTexture=new $n(n.x,n.y,ni),H.map.depthTexture.name=X.name+".shadowMapDepth",H.map.depthTexture.format=en,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=bt,H.map.depthTexture.magFilter=bt}else X.isPointLight?(H.map=new tl(n.x),H.map.depthTexture=new Oh(n.x,Mi)):(H.map=new Si(n.x,n.y),H.map.depthTexture=new $n(n.x,n.y,Mi)),H.map.depthTexture.name=X.name+".shadowMap",H.map.depthTexture.format=en,this.type===gr?(H.map.depthTexture.compareFunction=q?bh:Mh,H.map.depthTexture.minFilter=Ct,H.map.depthTexture.magFilter=Ct):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=bt,H.map.depthTexture.magFilter=bt);H.camera.updateProjectionMatrix()}H.map.isWebGLCubeRenderTarget!==!0&&(H.map.width!==n.x||H.map.height!==n.y)&&H.map.setSize(n.x,n.y);const ee=H.map.isWebGLCubeRenderTarget?6:H.getViewportCount();X.isPointLight!==!0&&H.updateMatrices(X,E);const B=(H.camera.layers.mask&4294967294)!==0?H.camera.layers:E.layers;for(let ae=0;ae<ee;ae++){const be=H.getCamera(ae);if(X.isPointLight){const z=H.camera,ie=H.matrix,he=X.distance||z.far;he!==z.far&&(z.far=he,z.updateProjectionMatrix()),ps.setFromMatrixPosition(X.matrixWorld),z.position.copy(ps),La.copy(z.position),La.add(vv[ae]),z.up.copy(xv[ae]),z.lookAt(La),z.updateMatrixWorld(),ie.makeTranslation(-ps.x,-ps.y,-ps.z),Kc.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),H._frustum.setFromProjectionMatrix(Kc,z.coordinateSystem,z.reversedDepth)}if(H.map.isWebGLCubeRenderTarget)s.setRenderTarget(H.map,ae),s.clear();else{ae===0&&(s.setRenderTarget(H.map),s.clear());const z=H.getViewport(ae);a.set(r.x*z.x,r.y*z.y,r.x*z.z,r.y*z.w),U.viewport(a)}i=H.getFrustum(ae),b(_,E,be,X,B,this.type)}H.isPointLightShadow!==!0&&this.type===gs&&M(H,E),H.needsUpdate=!1}p=this.type,g.needsUpdate=!1,s.setRenderTarget(O,I,D)};function M(S,_){const E=e.update(x);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null?S.mapPass=new Si(n.x,n.y,{format:mn,type:bi}):(S.mapPass.width!==S.map.width||S.mapPass.height!==S.map.height)&&S.mapPass.setSize(S.map.width,S.map.height),u.uniforms.shadow_pass.value=S.map.depthTexture,u.uniforms.resolution.value.set(S.map.width,S.map.height),u.uniforms.radius.value=S.radius,s.setRenderTarget(S.mapPass),s.clear(),s.renderBufferDirect(_,null,E,u,x,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value.set(S.map.width,S.map.height),d.uniforms.radius.value=S.radius,s.setRenderTarget(S.map),s.clear(),s.renderBufferDirect(_,null,E,d,x,null)}function T(S,_,E,O){let I=null;const D=E.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(D!==void 0)I=D;else if(I=E.isPointLight===!0?l:o,s.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){const U=I.uuid,$=_.uuid;let A=c[U];A===void 0&&(A={},c[U]=A);let k=A[$];k===void 0&&(k=I.clone(),A[$]=k,_.addEventListener("dispose",R)),I=k}if(I.visible=_.visible,I.wireframe=_.wireframe,O===gs?I.side=_.shadowSide!==null?_.shadowSide:_.side:I.side=_.shadowSide!==null?_.shadowSide:f[_.side],I.alphaMap=_.alphaMap,I.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,I.map=_.map,I.clipShadows=_.clipShadows,I.clippingPlanes=_.clippingPlanes,I.clipIntersection=_.clipIntersection,I.displacementMap=_.displacementMap,I.displacementScale=_.displacementScale,I.displacementBias=_.displacementBias,I.wireframeLinewidth=_.wireframeLinewidth,I.linewidth=_.linewidth,E.isPointLight===!0&&I.isMeshDistanceMaterial===!0){const U=s.properties.get(I);U.light=E}return I}function b(S,_,E,O,I,D){if(S.visible===!1)return;if(S.layers.test(I)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&D===gs)&&(!S.frustumCulled||S.intersectsFrustum(i))){S.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,S.matrixWorld);const A=e.update(S),k=S.material;if(Array.isArray(k)){const X=A.groups;for(let H=0,ne=X.length;H<ne;H++){const q=X[H],ee=k[q.materialIndex];if(ee&&ee.visible){const B=T(S,ee,O,D);S.onBeforeShadow(s,S,_,E,A,B,q),s.renderBufferDirect(E,null,A,B,S,q),S.onAfterShadow(s,S,_,E,A,B,q)}}}else if(k.visible){const X=T(S,k,O,D);S.onBeforeShadow(s,S,_,E,A,X,null),s.renderBufferDirect(E,null,A,X,S,null),S.onAfterShadow(s,S,_,E,A,X,null)}}const $=S.children;for(let A=0,k=$.length;A<k;A++)b($[A],_,E,O,I,D)}function R(S){S.target.removeEventListener("dispose",R);for(const E in c){const O=c[E],I=S.target.uuid;I in O&&(O[I].dispose(),delete O[I])}}}function Sv(s,e){function t(){let P=!1;const Q=new dt;let Z=null;const pe=new dt(0,0,0,0);return{setMask:function(ce){Z!==ce&&!P&&(s.colorMask(ce,ce,ce,ce),Z=ce)},setLocked:function(ce){P=ce},setClear:function(ce,de,Ue,qe,le){le===!0&&(ce*=qe,de*=qe,Ue*=qe),Q.set(ce,de,Ue,qe),pe.equals(Q)===!1&&(s.clearColor(ce,de,Ue,qe),pe.copy(Q))},reset:function(){P=!1,Z=null,pe.set(-1,0,0,0)}}}function i(){let P=!1,Q=!1,Z=null,pe=null,ce=null;return{setReversed:function(de){if(Q!==de){const Ue=e.get("EXT_clip_control");de?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT),Q=de;const qe=ce;ce=null,this.setClear(qe)}},getReversed:function(){return Q},setTest:function(de){de?se(s.DEPTH_TEST):Ae(s.DEPTH_TEST)},setMask:function(de){Z!==de&&!P&&(s.depthMask(de),Z=de)},setFunc:function(de){if(Q&&(de=lf[de]),pe!==de){switch(de){case za:s.depthFunc(s.NEVER);break;case Ha:s.depthFunc(s.ALWAYS);break;case Va:s.depthFunc(s.LESS);break;case bs:s.depthFunc(s.LEQUAL);break;case Ga:s.depthFunc(s.EQUAL);break;case Wa:s.depthFunc(s.GEQUAL);break;case Xa:s.depthFunc(s.GREATER);break;case qa:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}pe=de}},setLocked:function(de){P=de},setClear:function(de){ce!==de&&(ce=de,Q&&(de=1-de),s.clearDepth(de))},reset:function(){P=!1,Z=null,pe=null,ce=null,Q=!1}}}function n(){let P=!1,Q=null,Z=null,pe=null,ce=null,de=null,Ue=null,qe=null,le=null;return{setTest:function(Fe){P||(Fe?se(s.STENCIL_TEST):Ae(s.STENCIL_TEST))},setMask:function(Fe){Q!==Fe&&!P&&(s.stencilMask(Fe),Q=Fe)},setFunc:function(Fe,We,Se){(Z!==Fe||pe!==We||ce!==Se)&&(s.stencilFunc(Fe,We,Se),Z=Fe,pe=We,ce=Se)},setOp:function(Fe,We,Se){(de!==Fe||Ue!==We||qe!==Se)&&(s.stencilOp(Fe,We,Se),de=Fe,Ue=We,qe=Se)},setLocked:function(Fe){P=Fe},setClear:function(Fe){le!==Fe&&(s.clearStencil(Fe),le=Fe)},reset:function(){P=!1,Q=null,Z=null,pe=null,ce=null,de=null,Ue=null,qe=null,le=null}}}const r=new t,a=new i,o=new n;let l={};const c=new WeakMap;let h={},f={},u={},d=new WeakMap,m=[],x=null,g=!1,p=null,M=null,T=null,b=null,R=null,S=null,_=null,E=new Ke(0,0,0),O=0,I=!1,D=null,U=null,$=null,A=null,k=null;const X=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,ne=0;const q=s.getParameter(s.VERSION);q.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(q)[1]),H=ne>=1):q.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),H=ne>=2);let ee=null,B={};const ae=s.getParameter(s.SCISSOR_BOX),be=s.getParameter(s.VIEWPORT),z=new dt().fromArray(ae),ie=new dt().fromArray(be);function he(P,Q,Z,pe){const ce=new Uint8Array(4),de=s.createTexture();s.bindTexture(P,de),s.texParameteri(P,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(P,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ue=0;Ue<Z;Ue++)P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY?s.texImage3D(Q,0,s.RGBA,1,1,pe,0,s.RGBA,s.UNSIGNED_BYTE,ce):s.texImage2D(Q+Ue,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ce);return de}const Te={};Te[s.TEXTURE_2D]=he(s.TEXTURE_2D,s.TEXTURE_2D,1),Te[s.TEXTURE_CUBE_MAP]=he(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Te[s.TEXTURE_2D_ARRAY]=he(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Te[s.TEXTURE_3D]=he(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),se(s.DEPTH_TEST),a.setFunc(bs),Pe(!1),rt(Dl),se(s.CULL_FACE),Ie(Hn);function se(P){h[P]!==!0&&(s.enable(P),h[P]=!0)}function Ae(P){h[P]!==!1&&(s.disable(P),h[P]=!1)}function C(P,Q){return u[P]!==Q?(s.bindFramebuffer(P,Q),u[P]=Q,P===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=Q),P===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=Q),!0):!1}function N(P,Q){let Z=m,pe=!1;if(P){Z=d.get(Q),Z===void 0&&(Z=[],d.set(Q,Z));const ce=P.textures;if(Z.length!==ce.length||Z[0]!==s.COLOR_ATTACHMENT0){for(let de=0,Ue=ce.length;de<Ue;de++)Z[de]=s.COLOR_ATTACHMENT0+de;Z.length=ce.length,pe=!0}}else Z[0]!==s.BACK&&(Z[0]=s.BACK,pe=!0);pe&&s.drawBuffers(Z)}function ye(P){return x!==P?(s.useProgram(P),x=P,!0):!1}const Ne={[Di]:s.FUNC_ADD,[wd]:s.FUNC_SUBTRACT,[rh]:s.FUNC_REVERSE_SUBTRACT};Ne[Ad]=s.MIN,Ne[Rd]=s.MAX;const oe={[Cd]:s.ZERO,[ka]:s.ONE,[Pd]:s.SRC_COLOR,[ah]:s.SRC_ALPHA,[Fd]:s.SRC_ALPHA_SATURATE,[Dd]:s.DST_COLOR,[Ld]:s.DST_ALPHA,[Id]:s.ONE_MINUS_SRC_COLOR,[Ar]:s.ONE_MINUS_SRC_ALPHA,[Ud]:s.ONE_MINUS_DST_COLOR,[Nd]:s.ONE_MINUS_DST_ALPHA,[Od]:s.CONSTANT_COLOR,[Bd]:s.ONE_MINUS_CONSTANT_COLOR,[kd]:s.CONSTANT_ALPHA,[zd]:s.ONE_MINUS_CONSTANT_ALPHA};function Ie(P,Q,Z,pe,ce,de,Ue,qe,le,Fe){if(P===Hn){g===!0&&(Ae(s.BLEND),g=!1);return}if(g===!1&&(se(s.BLEND),g=!0),P!==sh){if(P!==p||Fe!==I){if((M!==Di||R!==Di)&&(s.blendEquation(s.FUNC_ADD),M=Di,R=Di),Fe)switch(P){case ys:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ul:s.blendFunc(s.ONE,s.ONE);break;case Fl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Ol:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:ke("WebGLState: Invalid blending: ",P);break}else switch(P){case ys:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ul:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Fl:ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ol:ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ke("WebGLState: Invalid blending: ",P);break}T=null,b=null,S=null,_=null,E.set(0,0,0),O=0,p=P,I=Fe}return}ce=ce||Q,de=de||Z,Ue=Ue||pe,(Q!==M||ce!==R)&&(s.blendEquationSeparate(Ne[Q],Ne[ce]),M=Q,R=ce),(Z!==T||pe!==b||de!==S||Ue!==_)&&(s.blendFuncSeparate(oe[Z],oe[pe],oe[de],oe[Ue]),T=Z,b=pe,S=de,_=Ue),(qe.equals(E)===!1||le!==O)&&(s.blendColor(qe.r,qe.g,qe.b,le),E.copy(qe),O=le),p=P,I=!1}function Oe(P,Q){P.side===fi?Ae(s.CULL_FACE):se(s.CULL_FACE);let Z=P.side===Wt;Q&&(Z=!Z),Pe(Z),P.blending===ys&&P.transparent===!1?Ie(Hn):Ie(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),a.setFunc(P.depthFunc),a.setTest(P.depthTest),a.setMask(P.depthWrite),r.setMask(P.colorWrite);const pe=P.stencilWrite;o.setTest(pe),pe&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),Xe(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?se(s.SAMPLE_ALPHA_TO_COVERAGE):Ae(s.SAMPLE_ALPHA_TO_COVERAGE)}function Pe(P){D!==P&&(P?s.frontFace(s.CW):s.frontFace(s.CCW),D=P)}function rt(P){P!==bd?(se(s.CULL_FACE),P!==U&&(P===Dl?s.cullFace(s.BACK):P===Ed?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ae(s.CULL_FACE),U=P}function $e(P){P!==$&&(H&&s.lineWidth(P),$=P)}function Xe(P,Q,Z){P?(se(s.POLYGON_OFFSET_FILL),(A!==Q||k!==Z)&&(A=Q,k=Z,a.getReversed()&&(Q=-Q,Z=-Z),s.polygonOffset(Q,Z))):Ae(s.POLYGON_OFFSET_FILL)}function Ot(P){P?se(s.SCISSOR_TEST):Ae(s.SCISSOR_TEST)}function Lt(P){P===void 0&&(P=s.TEXTURE0+X-1),ee!==P&&(s.activeTexture(P),ee=P)}function Zt(P,Q,Z){Z===void 0&&(ee===null?Z=s.TEXTURE0+X-1:Z=ee);let pe=B[Z];pe===void 0&&(pe={type:void 0,texture:void 0},B[Z]=pe),(pe.type!==P||pe.texture!==Q)&&(ee!==Z&&(s.activeTexture(Z),ee=Z),s.bindTexture(P,Q||Te[P]),pe.type=P,pe.texture=Q)}function F(){const P=B[ee];P!==void 0&&P.type!==void 0&&(s.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function Jt(){try{s.compressedTexImage2D(...arguments)}catch(P){ke("WebGLState:",P)}}function gt(){try{s.compressedTexImage3D(...arguments)}catch(P){ke("WebGLState:",P)}}function _t(){try{s.texSubImage2D(...arguments)}catch(P){ke("WebGLState:",P)}}function ve(){try{s.texSubImage3D(...arguments)}catch(P){ke("WebGLState:",P)}}function Mt(){try{s.compressedTexSubImage2D(...arguments)}catch(P){ke("WebGLState:",P)}}function Be(){try{s.compressedTexSubImage3D(...arguments)}catch(P){ke("WebGLState:",P)}}function ze(){try{s.texStorage2D(...arguments)}catch(P){ke("WebGLState:",P)}}function w(){try{s.texStorage3D(...arguments)}catch(P){ke("WebGLState:",P)}}function v(){try{s.texImage2D(...arguments)}catch(P){ke("WebGLState:",P)}}function G(){try{s.texImage3D(...arguments)}catch(P){ke("WebGLState:",P)}}function re(P){return f[P]!==void 0?f[P]:s.getParameter(P)}function te(P,Q){f[P]!==Q&&(s.pixelStorei(P,Q),f[P]=Q)}function ue(P){z.equals(P)===!1&&(s.scissor(P.x,P.y,P.z,P.w),z.copy(P))}function ge(P){ie.equals(P)===!1&&(s.viewport(P.x,P.y,P.z,P.w),ie.copy(P))}function J(P,Q){let Z=c.get(Q);Z===void 0&&(Z=new WeakMap,c.set(Q,Z));let pe=Z.get(P);pe===void 0&&(pe=s.getUniformBlockIndex(Q,P.name),s.uniformBlockBinding(Q,pe,pe),Z.set(P,pe))}function j(P,Q,Z){const ce=c.get(Q).get(P);l[ce]!==Z&&(s.bindBufferBase(s.UNIFORM_BUFFER,ce,Z),l[ce]=Z)}function fe(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},f={},ee=null,B={},u={},l={},d=new WeakMap,m=[],x=null,g=!1,p=null,M=null,T=null,b=null,R=null,S=null,_=null,E=new Ke(0,0,0),O=0,I=!1,D=null,U=null,$=null,A=null,k=null,z.set(0,0,s.canvas.width,s.canvas.height),ie.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:se,disable:Ae,bindFramebuffer:C,drawBuffers:N,useProgram:ye,setBlending:Ie,setMaterial:Oe,setFlipSided:Pe,setCullFace:rt,setLineWidth:$e,setPolygonOffset:Xe,setScissorTest:Ot,activeTexture:Lt,bindTexture:Zt,unbindTexture:F,compressedTexImage2D:Jt,compressedTexImage3D:gt,texImage2D:v,texImage3D:G,pixelStorei:te,getParameter:re,updateUBOMapping:J,uniformBlockBinding:j,texStorage2D:ze,texStorage3D:w,texSubImage2D:_t,texSubImage3D:ve,compressedTexSubImage2D:Mt,compressedTexSubImage3D:Be,scissor:ue,viewport:ge,reset:fe}}function Mv(s,e,t,i,n,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new st,h=new WeakMap,f=new Set;let u;const d=new WeakMap,m=new Set,x=new FinalizationRegistry(w=>m.delete(w));let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(w,v){return g?new OffscreenCanvas(w,v):Rs("canvas")}function M(w,v,G){let re=1;const te=ze(w);if((te.width>G||te.height>G)&&(re=G/Math.max(te.width,te.height)),re<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const ue=Math.floor(re*te.width),ge=Math.floor(re*te.height);u===void 0&&(u=p(ue,ge));const J=v?p(ue,ge):u;return J.width=ue,J.height=ge,J.getContext("2d").drawImage(w,0,0,ue,ge),De("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+ue+"x"+ge+")."),J}else return"data"in w&&De("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),w;return w}function T(w){return w.generateMipmaps}function b(w){s.generateMipmap(w)}function R(w){return w.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?s.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function S(w,v,G,re,te,ue=!1){if(w!==null){if(s[w]!==void 0)return s[w];De("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let ge;re&&(ge=e.get("EXT_texture_norm16"),ge||De("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=v;if(v===s.RED&&(G===s.FLOAT&&(J=s.R32F),G===s.HALF_FLOAT&&(J=s.R16F),G===s.UNSIGNED_BYTE&&(J=s.R8),G===s.UNSIGNED_SHORT&&ge&&(J=ge.R16_EXT),G===s.SHORT&&ge&&(J=ge.R16_SNORM_EXT)),v===s.RED_INTEGER&&(G===s.UNSIGNED_BYTE&&(J=s.R8UI),G===s.UNSIGNED_SHORT&&(J=s.R16UI),G===s.UNSIGNED_INT&&(J=s.R32UI),G===s.BYTE&&(J=s.R8I),G===s.SHORT&&(J=s.R16I),G===s.INT&&(J=s.R32I)),v===s.RG&&(G===s.FLOAT&&(J=s.RG32F),G===s.HALF_FLOAT&&(J=s.RG16F),G===s.UNSIGNED_BYTE&&(J=s.RG8),G===s.UNSIGNED_SHORT&&ge&&(J=ge.RG16_EXT),G===s.SHORT&&ge&&(J=ge.RG16_SNORM_EXT)),v===s.RG_INTEGER&&(G===s.UNSIGNED_BYTE&&(J=s.RG8UI),G===s.UNSIGNED_SHORT&&(J=s.RG16UI),G===s.UNSIGNED_INT&&(J=s.RG32UI),G===s.BYTE&&(J=s.RG8I),G===s.SHORT&&(J=s.RG16I),G===s.INT&&(J=s.RG32I)),v===s.RGB_INTEGER&&(G===s.UNSIGNED_BYTE&&(J=s.RGB8UI),G===s.UNSIGNED_SHORT&&(J=s.RGB16UI),G===s.UNSIGNED_INT&&(J=s.RGB32UI),G===s.BYTE&&(J=s.RGB8I),G===s.SHORT&&(J=s.RGB16I),G===s.INT&&(J=s.RGB32I)),v===s.RGBA_INTEGER&&(G===s.UNSIGNED_BYTE&&(J=s.RGBA8UI),G===s.UNSIGNED_SHORT&&(J=s.RGBA16UI),G===s.UNSIGNED_INT&&(J=s.RGBA32UI),G===s.BYTE&&(J=s.RGBA8I),G===s.SHORT&&(J=s.RGBA16I),G===s.INT&&(J=s.RGBA32I)),v===s.RGB&&(G===s.UNSIGNED_SHORT&&ge&&(J=ge.RGB16_EXT),G===s.SHORT&&ge&&(J=ge.RGB16_SNORM_EXT),G===s.UNSIGNED_INT_5_9_9_9_REV&&(J=s.RGB9_E5),G===s.UNSIGNED_INT_10F_11F_11F_REV&&(J=s.R11F_G11F_B10F)),v===s.RGBA){const j=ue?Lr:nt.getTransfer(te);G===s.FLOAT&&(J=s.RGBA32F),G===s.HALF_FLOAT&&(J=s.RGBA16F),G===s.UNSIGNED_BYTE&&(J=j===ht?s.SRGB8_ALPHA8:s.RGBA8),G===s.UNSIGNED_SHORT&&ge&&(J=ge.RGBA16_EXT),G===s.SHORT&&ge&&(J=ge.RGBA16_SNORM_EXT),G===s.UNSIGNED_SHORT_4_4_4_4&&(J=s.RGBA4),G===s.UNSIGNED_SHORT_5_5_5_1&&(J=s.RGB5_A1)}return(J===s.R16F||J===s.R32F||J===s.RG16F||J===s.RG32F||J===s.RGBA16F||J===s.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function _(w,v){let G;return w?v===null||v===Mi||v===Xn?G=s.DEPTH24_STENCIL8:v===ni?G=s.DEPTH32F_STENCIL8:v===Ts&&(G=s.DEPTH24_STENCIL8,De("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Mi||v===Xn?G=s.DEPTH_COMPONENT24:v===ni?G=s.DEPTH_COMPONENT32F:v===Ts&&(G=s.DEPTH_COMPONENT16),G}function E(w,v){return T(w)===!0||w.isFramebufferTexture&&w.minFilter!==bt&&w.minFilter!==Ct?Math.log2(Math.max(v.width,v.height))+1:w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?v.mipmaps.length:1}function O(w){const v=new WeakRef(w);i.get(w).__ref=v,m.add(v),x.register(w,v,v)}function I(w){const v=i.get(w).__ref;v!==void 0&&(m.delete(v),x.unregister(v))}function D(w){$(w.target)}function U(w){A(w.target)}function $(w){w.removeEventListener("dispose",D),I(w),X(w),w.isVideoTexture&&h.delete(w),w.isHTMLTexture&&f.delete(w)}function A(w){w.removeEventListener("dispose",U),I(w),ne(w)}function k(){for(const w of m){const v=w.deref();v!==void 0&&(v.isRenderTarget===!0?A(v):$(v))}m.clear(),f.clear()}function X(w){const v=i.get(w);if(v.__webglInit===void 0)return;const G=w.source,re=d.get(G);if(re){const te=re[v.__cacheKey];te.usedTimes--,te.usedTimes===0&&H(w),Object.keys(re).length===0&&d.delete(G)}i.remove(w)}function H(w){const v=i.get(w);s.deleteTexture(v.__webglTexture);const G=w.source,re=d.get(G);delete re[v.__cacheKey],a.memory.textures--}function ne(w){const v=i.get(w);v.__depthDisposeCallback&&v.__depthDisposeCallback();const G=w.depthTexture;if(G&&G.renderTarget===w&&$(G),w.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(v.__webglFramebuffer[te]))for(let ue=0;ue<v.__webglFramebuffer[te].length;ue++)s.deleteFramebuffer(v.__webglFramebuffer[te][ue]);else s.deleteFramebuffer(v.__webglFramebuffer[te]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[te])}else{if(Array.isArray(v.__webglFramebuffer))for(let te=0;te<v.__webglFramebuffer.length;te++)s.deleteFramebuffer(v.__webglFramebuffer[te]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let te=0;te<v.__webglColorRenderbuffer.length;te++)v.__webglColorRenderbuffer[te]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[te]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const re=w.textures;for(let te=0,ue=re.length;te<ue;te++){const ge=i.get(re[te]);ge.__webglTexture&&(s.deleteTexture(ge.__webglTexture),a.memory.textures--),i.remove(re[te])}i.remove(w)}let q=0;function ee(){q=0}function B(){return q}function ae(w){q=w}function be(){const w=q;return w>=n.maxTextures&&De("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+n.maxTextures),q+=1,w}function z(w){const v=[];return v.push(w.wrapS),v.push(w.wrapT),v.push(w.wrapR||0),v.push(w.magFilter),v.push(w.minFilter),v.push(w.anisotropy),v.push(w.internalFormat),v.push(w.format),v.push(w.type),v.push(w.generateMipmaps),v.push(w.mipmapsAutoUpdate),v.push(w.premultiplyAlpha),v.push(w.flipY),v.push(w.unpackAlignment),v.push(w.colorSpace),v.join()}function ie(w,v){const G=i.get(w);if(w.isVideoTexture&&Mt(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&G.__version!==w.version){const re=w.image;if(re===null)De("WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)De("WebGLRenderer: Texture marked for update but image is incomplete");else{Oe(G,w,v);return}}else w.isExternalTexture&&(G.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,G.__webglTexture,s.TEXTURE0+v)}function he(w,v){const G=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&G.__version!==w.version){Oe(G,w,v);return}else w.isExternalTexture&&(G.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,G.__webglTexture,s.TEXTURE0+v)}function Te(w,v){const G=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&G.__version!==w.version){Oe(G,w,v);return}t.bindTexture(s.TEXTURE_3D,G.__webglTexture,s.TEXTURE0+v)}function se(w,v){const G=i.get(w);if(w.version>0&&G.__version!==w.version){Pe(G,w,v);return}t.bindTexture(s.TEXTURE_CUBE_MAP,G.__webglTexture,s.TEXTURE0+v)}const Ae={[Ya]:s.REPEAT,[$t]:s.CLAMP_TO_EDGE,[$a]:s.MIRRORED_REPEAT},C={[bt]:s.NEAREST,[Wd]:s.NEAREST_MIPMAP_NEAREST,[ks]:s.NEAREST_MIPMAP_LINEAR,[Ct]:s.LINEAR,[na]:s.LINEAR_MIPMAP_NEAREST,[Oi]:s.LINEAR_MIPMAP_LINEAR},N={[jd]:s.NEVER,[Eh]:s.ALWAYS,[Qd]:s.LESS,[Mh]:s.LEQUAL,[ef]:s.EQUAL,[bh]:s.GEQUAL,[tf]:s.GREATER,[nf]:s.NOTEQUAL};function ye(w,v){if(v.type===ni&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Ct||v.magFilter===na||v.magFilter===ks||v.magFilter===Oi||v.minFilter===Ct||v.minFilter===na||v.minFilter===ks||v.minFilter===Oi)&&De("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(w,s.TEXTURE_WRAP_S,Ae[v.wrapS]),s.texParameteri(w,s.TEXTURE_WRAP_T,Ae[v.wrapT]),(w===s.TEXTURE_3D||w===s.TEXTURE_2D_ARRAY)&&s.texParameteri(w,s.TEXTURE_WRAP_R,Ae[v.wrapR]),s.texParameteri(w,s.TEXTURE_MAG_FILTER,C[v.magFilter]),s.texParameteri(w,s.TEXTURE_MIN_FILTER,C[v.minFilter]),v.compareFunction&&(s.texParameteri(w,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(w,s.TEXTURE_COMPARE_FUNC,N[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===bt||v.minFilter!==ks&&v.minFilter!==Oi||v.type===ni&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");s.texParameterf(w,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,n.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function Ne(w,v){let G=!1;w.__webglInit===void 0&&(w.__webglInit=!0,v.addEventListener("dispose",D),O(v));const re=v.source;let te=d.get(re);te===void 0&&(te={},d.set(re,te));const ue=z(v);if(ue!==w.__cacheKey){te[ue]===void 0&&(te[ue]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,G=!0),te[ue].usedTimes++;const ge=te[w.__cacheKey];ge!==void 0&&(te[w.__cacheKey].usedTimes--,ge.usedTimes===0&&H(v)),w.__cacheKey=ue,w.__webglTexture=te[ue].texture}return G}function oe(w,v,G){return Math.floor(Math.floor(w/G)/v)}function Ie(w,v,G,re){const ue=w.updateRanges;if(ue.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,v.width,v.height,G,re,v.data);else{ue.sort((P,Q)=>P.start-Q.start);let ge=0;for(let P=1;P<ue.length;P++){const Q=ue[ge],Z=ue[P],pe=Q.start+Q.count,ce=oe(Z.start,v.width,4),de=oe(Q.start,v.width,4);Z.start<=pe+1&&ce===de&&oe(Z.start+Z.count-1,v.width,4)===ce?Q.count=Math.max(Q.count,Z.start+Z.count-Q.start):(++ge,ue[ge]=Z)}ue.length=ge+1;const J=t.getParameter(s.UNPACK_ROW_LENGTH),j=t.getParameter(s.UNPACK_SKIP_PIXELS),fe=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,v.width);for(let P=0,Q=ue.length;P<Q;P++){const Z=ue[P],pe=Math.floor(Z.start/4),ce=Math.ceil(Z.count/4),de=pe%v.width,Ue=Math.floor(pe/v.width),qe=ce,le=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,de),t.pixelStorei(s.UNPACK_SKIP_ROWS,Ue),t.texSubImage2D(s.TEXTURE_2D,0,de,Ue,qe,le,G,re,v.data)}w.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,J),t.pixelStorei(s.UNPACK_SKIP_PIXELS,j),t.pixelStorei(s.UNPACK_SKIP_ROWS,fe)}}function Oe(w,v,G){let re=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(re=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(re=s.TEXTURE_3D);const te=Ne(w,v),ue=v.source;t.bindTexture(re,w.__webglTexture,s.TEXTURE0+G);const ge=i.get(ue);if(ue.version!==ge.__version||te===!0){if(t.activeTexture(s.TEXTURE0+G),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){const le=nt.getPrimaries(nt.workingColorSpace),Fe=v.colorSpace===Ui?null:nt.getPrimaries(v.colorSpace),We=v.colorSpace===Ui||le===Fe?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,We)}t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment);let j=M(v.image,!1,n.maxTextureSize);j=Be(v,j);const fe=r.convert(v.format,v.colorSpace),P=r.convert(v.type);let Q=S(v.internalFormat,fe,P,v.normalized,v.colorSpace,v.isVideoTexture);ye(re,v);let Z;const pe=v.mipmaps,ce=v.isVideoTexture!==!0,de=ge.__version===void 0||te===!0,Ue=ue.dataReady,qe=E(v,j);if(v.isDepthTexture)Q=_(v.format===Qi,v.type),de&&(ce?t.texStorage2D(s.TEXTURE_2D,1,Q,j.width,j.height):t.texImage2D(s.TEXTURE_2D,0,Q,j.width,j.height,0,fe,P,null));else if(v.isDataTexture)if(pe.length>0){ce&&de&&t.texStorage2D(s.TEXTURE_2D,qe,Q,pe[0].width,pe[0].height);for(let le=0,Fe=pe.length;le<Fe;le++)Z=pe[le],ce?Ue&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,Z.width,Z.height,fe,P,Z.data):t.texImage2D(s.TEXTURE_2D,le,Q,Z.width,Z.height,0,fe,P,Z.data);v.generateMipmaps=!1}else ce?(de&&t.texStorage2D(s.TEXTURE_2D,qe,Q,j.width,j.height),Ue&&Ie(v,j,fe,P)):t.texImage2D(s.TEXTURE_2D,0,Q,j.width,j.height,0,fe,P,j.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){ce&&de&&t.texStorage3D(s.TEXTURE_2D_ARRAY,qe,Q,pe[0].width,pe[0].height,j.depth);for(let le=0,Fe=pe.length;le<Fe;le++)if(Z=pe[le],v.format!==si)if(fe!==null)if(ce){if(Ue)if(v.layerUpdates.size>0){const We=Rc(Z.width,Z.height,v.format,v.type);for(const Se of v.layerUpdates){const ct=Z.data.subarray(Se*We/Z.data.BYTES_PER_ELEMENT,(Se+1)*We/Z.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,Se,Z.width,Z.height,1,fe,ct)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,0,Z.width,Z.height,j.depth,fe,Z.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,le,Q,Z.width,Z.height,j.depth,0,Z.data,0,0);else De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ce?Ue&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,0,Z.width,Z.height,j.depth,fe,P,Z.data):t.texImage3D(s.TEXTURE_2D_ARRAY,le,Q,Z.width,Z.height,j.depth,0,fe,P,Z.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{ce&&de&&t.texStorage2D(s.TEXTURE_2D,qe,Q,pe[0].width,pe[0].height);for(let le=0,Fe=pe.length;le<Fe;le++)Z=pe[le],v.format!==si?fe!==null?ce?Ue&&t.compressedTexSubImage2D(s.TEXTURE_2D,le,0,0,Z.width,Z.height,fe,Z.data):t.compressedTexImage2D(s.TEXTURE_2D,le,Q,Z.width,Z.height,0,Z.data):De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ce?Ue&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,Z.width,Z.height,fe,P,Z.data):t.texImage2D(s.TEXTURE_2D,le,Q,Z.width,Z.height,0,fe,P,Z.data)}else if(v.isDataArrayTexture)if(ce){if(de&&t.texStorage3D(s.TEXTURE_2D_ARRAY,qe,Q,j.width,j.height,j.depth),Ue)if(v.layerUpdates.size>0){const le=Rc(j.width,j.height,v.format,v.type);for(const Fe of v.layerUpdates){const We=j.data.subarray(Fe*le/j.data.BYTES_PER_ELEMENT,(Fe+1)*le/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Fe,j.width,j.height,1,fe,P,We)}v.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,fe,P,j.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Q,j.width,j.height,j.depth,0,fe,P,j.data);else if(v.isData3DTexture)ce?(de&&t.texStorage3D(s.TEXTURE_3D,qe,Q,j.width,j.height,j.depth),Ue&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,fe,P,j.data)):t.texImage3D(s.TEXTURE_3D,0,Q,j.width,j.height,j.depth,0,fe,P,j.data);else if(v.isFramebufferTexture){if(de)if(ce)t.texStorage2D(s.TEXTURE_2D,qe,Q,j.width,j.height);else{let le=j.width,Fe=j.height;for(let We=0;We<qe;We++)t.texImage2D(s.TEXTURE_2D,We,Q,le,Fe,0,fe,P,null),le>>=1,Fe>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in s){const le=s.canvas;if(le.hasAttribute("layoutsubtree")||le.setAttribute("layoutsubtree","true"),j.parentNode!==le){le.appendChild(j),f.add(v),le.onpaint=Fe=>{const We=Fe.changedElements;for(const Se of f)We.includes(Se.image)&&(Se.needsUpdate=!0)},le.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,j);else{const We=s.RGBA,Se=s.RGBA,ct=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,We,Se,ct,j)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(pe.length>0){if(ce&&de){const le=ze(pe[0]);t.texStorage2D(s.TEXTURE_2D,qe,Q,le.width,le.height)}for(let le=0,Fe=pe.length;le<Fe;le++)Z=pe[le],ce?Ue&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,fe,P,Z):t.texImage2D(s.TEXTURE_2D,le,Q,fe,P,Z);v.generateMipmaps=!1}else if(ce){if(de){const le=ze(j);t.texStorage2D(s.TEXTURE_2D,qe,Q,le.width,le.height)}Ue&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,fe,P,j)}else t.texImage2D(s.TEXTURE_2D,0,Q,fe,P,j);T(v)&&v.mipmapsAutoUpdate===!0&&b(re),ge.__version=ue.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function Pe(w,v,G){if(v.image.length!==6)return;const re=Ne(w,v),te=v.source;t.bindTexture(s.TEXTURE_CUBE_MAP,w.__webglTexture,s.TEXTURE0+G);const ue=i.get(te);if(te.version!==ue.__version||re===!0){t.activeTexture(s.TEXTURE0+G);const ge=nt.getPrimaries(nt.workingColorSpace),J=v.colorSpace===Ui?null:nt.getPrimaries(v.colorSpace),j=v.colorSpace===Ui||ge===J?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const fe=v.isCompressedTexture||v.image[0].isCompressedTexture,P=v.image[0]&&v.image[0].isDataTexture,Q=[];for(let Se=0;Se<6;Se++)!fe&&!P?Q[Se]=M(v.image[Se],!0,n.maxCubemapSize):Q[Se]=P?v.image[Se].image:v.image[Se],Q[Se]=Be(v,Q[Se]);const Z=Q[0],pe=r.convert(v.format,v.colorSpace),ce=r.convert(v.type);let de=S(v.internalFormat,pe,ce,v.normalized,v.colorSpace);const Ue=v.isVideoTexture!==!0,qe=ue.__version===void 0||re===!0,le=te.dataReady;let Fe=E(v,Z);ye(s.TEXTURE_CUBE_MAP,v);let We;if(v.isDepthTexture){if(de=_(v.format===Qi,v.type),qe)if(Ue)t.texStorage2D(s.TEXTURE_CUBE_MAP,1,de,Z.width,Z.height);else for(let Se=0;Se<6;Se++)t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,de,Z.width,Z.height,0,pe,ce,null)}else if(fe){Ue&&qe&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Fe,de,Z.width,Z.height);for(let Se=0;Se<6;Se++){We=Q[Se].mipmaps;for(let ct=0;ct<We.length;ct++){const wt=We[ct];v.format!==si?pe!==null?Ue?le&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,ct,0,0,wt.width,wt.height,pe,wt.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,ct,de,wt.width,wt.height,0,wt.data):De("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?le&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,ct,0,0,wt.width,wt.height,pe,ce,wt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,ct,de,wt.width,wt.height,0,pe,ce,wt.data)}}}else{if(We=v.mipmaps,Ue&&qe){We.length>0&&Fe++;const Se=ze(Q[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Fe,de,Se.width,Se.height)}for(let Se=0;Se<6;Se++)if(P){Ue?le&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,0,0,Q[Se].width,Q[Se].height,pe,ce,Q[Se].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,de,Q[Se].width,Q[Se].height,0,pe,ce,Q[Se].data);for(let ct=0;ct<We.length;ct++){const Gi=We[ct].image[Se].image;Ue?le&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,ct+1,0,0,Gi.width,Gi.height,pe,ce,Gi.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,ct+1,de,Gi.width,Gi.height,0,pe,ce,Gi.data)}}else{Ue?le&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,0,0,pe,ce,Q[Se]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,0,de,pe,ce,Q[Se]);for(let ct=0;ct<We.length;ct++){const wt=We[ct];Ue?le&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,ct+1,0,0,pe,ce,wt.image[Se]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Se,ct+1,de,pe,ce,wt.image[Se])}}}T(v)&&v.mipmapsAutoUpdate===!0&&b(s.TEXTURE_CUBE_MAP),ue.__version=te.version,v.onUpdate&&v.onUpdate(v)}w.__version=v.version}function rt(w,v,G,re,te,ue){const ge=r.convert(G.format,G.colorSpace),J=r.convert(G.type),j=S(G.internalFormat,ge,J,G.normalized,G.colorSpace),fe=i.get(v),P=i.get(G);if(P.__renderTarget=v,!fe.__hasExternalTextures){const Q=Math.max(1,v.width>>ue),Z=Math.max(1,v.height>>ue);te===s.TEXTURE_3D||te===s.TEXTURE_2D_ARRAY?t.texImage3D(te,ue,j,Q,Z,v.depth,0,ge,J,null):t.texImage2D(te,ue,j,Q,Z,0,ge,J,null)}t.bindFramebuffer(s.FRAMEBUFFER,w),ve(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,re,te,P.__webglTexture,0,_t(v)):(te===s.TEXTURE_2D||te>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,re,te,P.__webglTexture,ue),t.bindFramebuffer(s.FRAMEBUFFER,null)}function $e(w,v,G){if(s.bindRenderbuffer(s.RENDERBUFFER,w),v.depthBuffer){const re=v.depthTexture,te=re&&re.isDepthTexture?re.type:null,ue=_(v.stencilBuffer,te),ge=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;ve(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,_t(v),ue,v.width,v.height):G?s.renderbufferStorageMultisample(s.RENDERBUFFER,_t(v),ue,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,ue,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ge,s.RENDERBUFFER,w)}else{const re=v.textures;for(let te=0;te<re.length;te++){const ue=re[te],ge=r.convert(ue.format,ue.colorSpace),J=r.convert(ue.type),j=S(ue.internalFormat,ge,J,ue.normalized,ue.colorSpace);ve(v)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,_t(v),j,v.width,v.height):G?s.renderbufferStorageMultisample(s.RENDERBUFFER,_t(v),j,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,j,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Xe(w,v,G){const re=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,w),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const te=i.get(v.depthTexture);te.__renderTarget=v;const ue=re?v.depthTexture.image[0]:v.depthTexture.image;(!te.__webglTexture||ue.width!==v.width||ue.height!==v.height)&&(ue.width=v.width,ue.height=v.height,v.depthTexture.needsUpdate=!0),re?se(v.depthTexture,0):ie(v.depthTexture,0);const ge=te.__webglTexture,J=_t(v),j=re?s.TEXTURE_CUBE_MAP_POSITIVE_X+G:s.TEXTURE_2D,fe=v.depthTexture.format===Qi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(v.depthTexture.format===en)ve(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,fe,j,ge,0,J):s.framebufferTexture2D(s.FRAMEBUFFER,fe,j,ge,0);else if(v.depthTexture.format===Qi)ve(v)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,fe,j,ge,0,J):s.framebufferTexture2D(s.FRAMEBUFFER,fe,j,ge,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ot(w){const v=i.get(w),G=w.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==w.depthTexture){const re=w.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),re){const te=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,re.removeEventListener("dispose",te)};re.addEventListener("dispose",te),v.__depthDisposeCallback=te}v.__boundDepthTexture=re}if(w.depthTexture&&!v.__autoAllocateDepthBuffer)if(G)for(let re=0;re<6;re++)Xe(v.__webglFramebuffer[re],w,re);else w.texture.mipmaps.length>0?Xe(v.__webglFramebuffer[0],w,0):Xe(v.__webglFramebuffer,w,0);else if(G){v.__webglDepthbuffer=[];for(let re=0;re<6;re++)if(t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[re]),v.__webglDepthbuffer[re]===void 0)v.__webglDepthbuffer[re]=s.createRenderbuffer(),$e(v.__webglDepthbuffer[re],w,!1);else{const te=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ue=v.__webglDepthbuffer[re];s.bindRenderbuffer(s.RENDERBUFFER,ue),s.framebufferRenderbuffer(s.FRAMEBUFFER,te,s.RENDERBUFFER,ue)}}else if(w.texture.mipmaps.length>0?t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),$e(v.__webglDepthbuffer,w,!1);else{const te=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ue=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ue),s.framebufferRenderbuffer(s.FRAMEBUFFER,te,s.RENDERBUFFER,ue)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Lt(w,v,G){const re=i.get(w);v!==void 0&&rt(re.__webglFramebuffer,w,w.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),G!==void 0&&Ot(w)}function Zt(w){const v=w.texture,G=i.get(w),re=i.get(v);w.addEventListener("dispose",U),O(w);const te=w.textures,ue=w.isWebGLCubeRenderTarget===!0,ge=te.length>1;if(ge||(re.__webglTexture===void 0&&(re.__webglTexture=s.createTexture()),re.__version=v.version,a.memory.textures++),ue){G.__webglFramebuffer=[];for(let J=0;J<6;J++)if(v.mipmaps.length>0){G.__webglFramebuffer[J]=[];for(let j=0;j<v.mipmaps.length;j++)G.__webglFramebuffer[J][j]=s.createFramebuffer()}else G.__webglFramebuffer[J]=s.createFramebuffer()}else{if(v.mipmaps.length>0){G.__webglFramebuffer=[];for(let J=0;J<v.mipmaps.length;J++)G.__webglFramebuffer[J]=s.createFramebuffer()}else G.__webglFramebuffer=s.createFramebuffer();if(ge)for(let J=0,j=te.length;J<j;J++){const fe=i.get(te[J]);fe.__webglTexture===void 0&&(fe.__webglTexture=s.createTexture(),a.memory.textures++)}if(w.samples>0&&ve(w)===!1){G.__webglMultisampledFramebuffer=s.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let J=0;J<te.length;J++){const j=te[J];G.__webglColorRenderbuffer[J]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,G.__webglColorRenderbuffer[J]);const fe=r.convert(j.format,j.colorSpace),P=r.convert(j.type),Q=S(j.internalFormat,fe,P,j.normalized,j.colorSpace,w.isXRRenderTarget===!0),Z=_t(w);s.renderbufferStorageMultisample(s.RENDERBUFFER,Z,Q,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+J,s.RENDERBUFFER,G.__webglColorRenderbuffer[J])}s.bindRenderbuffer(s.RENDERBUFFER,null),w.depthBuffer&&(G.__webglDepthRenderbuffer=s.createRenderbuffer(),$e(G.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ue){t.bindTexture(s.TEXTURE_CUBE_MAP,re.__webglTexture),ye(s.TEXTURE_CUBE_MAP,v);for(let J=0;J<6;J++)if(v.mipmaps.length>0)for(let j=0;j<v.mipmaps.length;j++)rt(G.__webglFramebuffer[J][j],w,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,j);else rt(G.__webglFramebuffer[J],w,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);T(v)?b(s.TEXTURE_CUBE_MAP):v.mipmaps.length>0&&s.texParameteri(s.TEXTURE_CUBE_MAP,s.TEXTURE_MAX_LEVEL,v.mipmaps.length-1),t.unbindTexture()}else if(ge){for(let J=0,j=te.length;J<j;J++){const fe=te[J],P=i.get(fe);let Q=s.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(Q=w.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Q,P.__webglTexture),ye(Q,fe),rt(G.__webglFramebuffer,w,fe,s.COLOR_ATTACHMENT0+J,Q,0),T(fe)&&b(Q)}t.unbindTexture()}else{let J=s.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(J=w.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(J,re.__webglTexture),ye(J,v),v.mipmaps.length>0)for(let j=0;j<v.mipmaps.length;j++)rt(G.__webglFramebuffer[j],w,v,s.COLOR_ATTACHMENT0,J,j);else rt(G.__webglFramebuffer,w,v,s.COLOR_ATTACHMENT0,J,0);T(v)?b(J):v.mipmaps.length>0&&s.texParameteri(J,s.TEXTURE_MAX_LEVEL,v.mipmaps.length-1),t.unbindTexture()}w.depthBuffer&&Ot(w)}function F(w){const v=w.textures;for(let G=0,re=v.length;G<re;G++){const te=v[G];if(T(te)&&te.mipmapsAutoUpdate===!0){const ue=R(w),ge=i.get(te).__webglTexture;t.bindTexture(ue,ge),b(ue),t.unbindTexture()}}}const Jt=[];function gt(w){if(w.samples>0){if(ve(w)===!1){const v=w.textures,G=w.width,re=w.height;let te=s.COLOR_BUFFER_BIT;const ue=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ge=i.get(w),J=v.length>1;if(J)for(let fe=0;fe<v.length;fe++)t.bindFramebuffer(s.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ge.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer),w.texture.mipmaps.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ge.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let fe=0;fe<v.length;fe++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(te|=s.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(te|=s.STENCIL_BUFFER_BIT)),J){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ge.__webglColorRenderbuffer[fe]);const P=i.get(v[fe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,P,0)}s.blitFramebuffer(0,0,G,re,0,0,G,re,te,s.NEAREST),l===!0&&(Jt.length=0,Jt.push(s.COLOR_ATTACHMENT0+fe),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&Jt.push(ue),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Jt))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),J)for(let fe=0;fe<v.length;fe++){t.bindFramebuffer(s.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.RENDERBUFFER,ge.__webglColorRenderbuffer[fe]);const P=i.get(v[fe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ge.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.TEXTURE_2D,P,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&l){const v=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function _t(w){return Math.min(n.maxSamples,w.samples)}function ve(w){const v=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Mt(w){const v=a.render.frame;h.get(w)!==v&&(h.set(w,v),w.update())}function Be(w,v){const G=w.colorSpace,re=w.format,te=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||G!==ws&&G!==Ui&&(nt.getTransfer(G)===ht?(re!==si||te!==Gt)&&De("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ke("WebGLTextures: Unsupported texture color space:",G)),v}function ze(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=be,this.resetTextureUnits=ee,this.getTextureUnits=B,this.setTextureUnits=ae,this.setTexture2D=ie,this.setTexture2DArray=he,this.setTexture3D=Te,this.setTextureCube=se,this.rebindTextures=Lt,this.setupRenderTarget=Zt,this.updateRenderTargetMipmap=F,this.updateMultisampleRenderTarget=gt,this.setupDepthRenderbuffer=Ot,this.setupFrameBufferTexture=rt,this.useMultisampledRTT=ve,this.dispose=k}function bv(s,e){function t(i,n=Ui){let r;const a=nt.getTransfer(n);if(i===Gt)return s.UNSIGNED_BYTE;if(i===Bo)return s.UNSIGNED_SHORT_4_4_4_4;if(i===ko)return s.UNSIGNED_SHORT_5_5_5_1;if(i===vh)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===xh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(i===gh)return s.BYTE;if(i===_h)return s.SHORT;if(i===Ts)return s.UNSIGNED_SHORT;if(i===Oo)return s.INT;if(i===Mi)return s.UNSIGNED_INT;if(i===ni)return s.FLOAT;if(i===bi)return s.HALF_FLOAT;if(i===yh)return s.ALPHA;if(i===Sh)return s.RGB;if(i===si)return s.RGBA;if(i===en)return s.DEPTH_COMPONENT;if(i===Qi)return s.DEPTH_STENCIL;if(i===kr)return s.RED;if(i===zo)return s.RED_INTEGER;if(i===mn)return s.RG;if(i===Ho)return s.RG_INTEGER;if(i===Vo)return s.RGBA_INTEGER;if(i===_r||i===vr||i===xr||i===yr)if(a===ht)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===_r)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===yr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===_r)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===xr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===yr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ka||i===Za||i===Ja||i===ja)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Ka)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Za)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ja)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ja)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Qa||i===eo||i===to||i===io||i===no||i===Rr||i===so)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Qa||i===eo)return a===ht?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===to)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===io)return r.COMPRESSED_R11_EAC;if(i===no)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Rr)return r.COMPRESSED_RG11_EAC;if(i===so)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===ro||i===ao||i===oo||i===lo||i===co||i===ho||i===uo||i===fo||i===po||i===mo||i===go||i===_o||i===vo||i===xo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ro)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ao)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===oo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===lo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===co)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ho)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===uo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===fo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===po)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===mo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===go)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===_o)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===vo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===xo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===yo||i===So||i===Mo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===yo)return a===ht?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===So)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Mo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===bo||i===Eo||i===Cr||i===To)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===bo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Eo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Cr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===To)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Xn?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:t}}const Ev=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Tv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class wv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Bh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new gn({vertexShader:Ev,fragmentShader:Tv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ri(new Vr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Av extends nn{constructor(e,t){super();const i=this;let n=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,m=null;const x=typeof XRWebGLBinding<"u",g=new wv,p={},M=t.getContextAttributes();let T=null,b=null;const R=[],S=[],_=new st;let E=null,O=null;const I=new ii;I.viewport=new dt;const D=new ii;D.viewport=new dt;const U=[I,D],$=new Ap;let A=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(z){let ie=R[z];return ie===void 0&&(ie=new ua,R[z]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(z){let ie=R[z];return ie===void 0&&(ie=new ua,R[z]=ie),ie.getGripSpace()},this.getHand=function(z){let ie=R[z];return ie===void 0&&(ie=new ua,R[z]=ie),ie.getHandSpace()};function X(z){const ie=S.indexOf(z.inputSource);if(ie===-1)return;const he=R[ie];he!==void 0&&(he.update(z.inputSource,z.frame,c||a),he.dispatchEvent({type:z.type,data:z.inputSource}))}function H(){n.removeEventListener("select",X),n.removeEventListener("selectstart",X),n.removeEventListener("selectend",X),n.removeEventListener("squeeze",X),n.removeEventListener("squeezestart",X),n.removeEventListener("squeezeend",X),n.removeEventListener("end",H),n.removeEventListener("inputsourceschange",ne);for(let z=0;z<R.length;z++){const ie=S[z];ie!==null&&(S[z]=null,R[z].disconnect(ie))}A=null,k=null,g.reset();for(const z in p)delete p[z];if(e.setRenderTarget(T),d=null,u=null,f=null,n=null,b=null,be.stop(),i.isPresenting=!1,e.setPixelRatio(E),e.setSize(_.width,_.height,!1),O!==null){const z=O.camera;z.fov=O.fov,z.zoom=O.zoom,z.updateProjectionMatrix(),O=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(z){r=z,i.isPresenting===!0&&De("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(z){o=z,i.isPresenting===!0&&De("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(z){c=z},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(n,t)),f},this.getFrame=function(){return m},this.getSession=function(){return n},this.setSession=async function(z){if(n=z,n!==null){if(T=e.getRenderTarget(),n.addEventListener("select",X),n.addEventListener("selectstart",X),n.addEventListener("selectend",X),n.addEventListener("squeeze",X),n.addEventListener("squeezestart",X),n.addEventListener("squeezeend",X),n.addEventListener("end",H),n.addEventListener("inputsourceschange",ne),M.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(_),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let he=null,Te=null,se=null;M.depth&&(se=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,he=M.stencil?Qi:en,Te=M.stencil?Xn:Mi);const Ae={colorFormat:t.RGBA8,depthFormat:se,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Ae),n.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),b=new Si(u.textureWidth,u.textureHeight,{format:si,type:Gt,depthTexture:new $n(u.textureWidth,u.textureHeight,Te,void 0,void 0,void 0,void 0,void 0,void 0,he),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const he={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(n,t,he),n.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),b=new Si(d.framebufferWidth,d.framebufferHeight,{format:si,type:Gt,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),be.setContext(n),be.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ne(z){for(let ie=0;ie<z.removed.length;ie++){const he=z.removed[ie],Te=S.indexOf(he);Te>=0&&(S[Te]=null,R[Te].disconnect(he))}for(let ie=0;ie<z.added.length;ie++){const he=z.added[ie];let Te=S.indexOf(he);if(Te===-1){for(let Ae=0;Ae<R.length;Ae++)if(Ae>=S.length){S.push(he),Te=Ae;break}else if(S[Ae]===null){S[Ae]=he,Te=Ae;break}if(Te===-1)break}const se=R[Te];se&&se.connect(he)}}function q(z,ie){ie===null?z.matrixWorld.copy(z.matrix):z.matrixWorld.multiplyMatrices(ie.matrixWorld,z.matrix),z.matrixWorldInverse.copy(z.matrixWorld).invert()}this.updateCamera=function(z){if(n===null)return;let ie=z.near,he=z.far;g.texture!==null&&(g.depthNear>0&&(ie=g.depthNear),g.depthFar>0&&(he=g.depthFar)),$.near=D.near=I.near=ie,$.far=D.far=I.far=he,(A!==$.near||k!==$.far)&&(n.updateRenderState({depthNear:$.near,depthFar:$.far}),A=$.near,k=$.far),$.layers.mask=z.layers.mask|6,I.layers.mask=$.layers.mask&-5,D.layers.mask=$.layers.mask&-3;const Te=z.parent,se=$.cameras;q($,Te);for(let Ae=0;Ae<se.length;Ae++)q(se[Ae],Te);$.projectionMatrix.copy(I.projectionMatrix),$.projectionMatrixInverse.copy(I.projectionMatrixInverse),O===null&&z.isPerspectiveCamera&&(O={camera:z,fov:z.fov,zoom:z.zoom}),ee(z,$,Te)};function ee(z,ie,he){he===null?z.matrix.copy(ie.matrixWorld):(z.matrix.copy(he.matrixWorld),z.matrix.invert(),z.matrix.multiply(ie.matrixWorld)),z.matrix.decompose(z.position,z.quaternion,z.scale),z.updateMatrixWorld(!0),z.projectionMatrix.copy(ie.projectionMatrix),z.projectionMatrixInverse.copy(ie.projectionMatrixInverse),z.isPerspectiveCamera&&(z.fov=qn*2*Math.atan(1/z.projectionMatrix.elements[5]),z.zoom=1)}this.getCamera=function(){return $},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(z){l=z,u!==null&&(u.fixedFoveation=z),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=z)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh($)},this.getCameraTexture=function(z){return p[z]};let B=null;function ae(z,ie){if(h=ie.getViewerPose(c||a),m=ie,h!==null){const he=h.views;d!==null&&(e.setRenderTargetFramebuffer(b,d.framebuffer),e.setRenderTarget(b));let Te=!1;he.length!==$.cameras.length&&($.cameras.length=0,Te=!0);for(let N=0;N<he.length;N++){const ye=he[N];let Ne=null;if(d!==null)Ne=d.getViewport(ye);else{const Ie=f.getViewSubImage(u,ye);Ne=Ie.viewport,N===0&&(e.setRenderTargetTextures(b,Ie.colorTexture,Ie.depthStencilTexture),e.setRenderTarget(b))}let oe=U[N];oe===void 0&&(oe=new ii,oe.layers.enable(N),oe.viewport=new dt,U[N]=oe),oe.matrix.fromArray(ye.transform.matrix),oe.matrix.decompose(oe.position,oe.quaternion,oe.scale),oe.projectionMatrix.fromArray(ye.projectionMatrix),oe.projectionMatrixInverse.copy(oe.projectionMatrix).invert(),oe.viewport.set(Ne.x,Ne.y,Ne.width,Ne.height),N===0&&($.matrix.copy(oe.matrix),$.matrix.decompose($.position,$.quaternion,$.scale)),Te===!0&&$.cameras.push(oe)}const se=n.enabledFeatures;if(se&&se.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&x){f=i.getBinding();const N=f.getDepthInformation(he[0]);N&&N.isValid&&N.texture&&g.init(N,n.renderState)}if(se&&se.includes("camera-access")&&x){e.state.unbindTexture(),f=i.getBinding();for(let N=0;N<he.length;N++){const ye=he[N].camera;if(ye){let Ne=p[ye];Ne||(Ne=new Bh,p[ye]=Ne);const oe=f.getCameraImage(ye);Ne.sourceTexture=oe}}}}for(let he=0;he<R.length;he++){const Te=S[he],se=R[he];Te!==null&&se!==void 0&&se.update(Te,ie,c||a)}B&&B(z,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),m=null}const be=new Xh;be.setAnimationLoop(ae),this.setAnimationLoop=function(z){B=z},this.dispose=function(){}}}const Rv=new Qe,tu=new He;tu.set(-1,0,0,0,1,0,0,0,1);function Cv(s,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,kh(s)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function n(g,p,M,T,b){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),f(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),u(g,p),p.isMeshPhysicalMaterial&&d(g,p,b)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,M,T):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Wt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Wt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const M=e.get(p),T=M.envMap,b=M.envMapRotation;T&&(g.envMap.value=T,g.envMapRotation.value.setFromMatrix4(Rv.makeRotationFromEuler(b)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(tu),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,M,T){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*M,g.scale.value=T*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function u(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,M){g.ior.value=p.ior,p.diffuseRoughness>0&&(g.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(g.diffuseRoughnessMap.value=p.diffuseRoughnessMap,t(p.diffuseRoughnessMap,g.diffuseRoughnessMapTransform))),p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Wt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,g.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){const M=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function Pv(s,e,t,i){let n={},r={};function a(M,T){const b=T.program;i.uniformBlockBinding(M,b,n[M.id])}function o(M,T){let b=n[M.id];b===void 0&&(m(M),b=l(M),n[M.id]=b,M.addEventListener("dispose",g));const R=T.program;i.updateUBOMapping(M,R);const S=e.render.frame;r[M.id]!==S&&(c(M),r[M.id]=S)}function l(M){const T=s.createBuffer(),b=M.__size,R=M.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,b,R),s.bindBuffer(s.UNIFORM_BUFFER,null),T}function c(M){const T=n[M.id],b=M.uniforms,R=M.__cache;s.bindBuffer(s.UNIFORM_BUFFER,T);for(let S=0,_=b.length;S<_;S++){const E=b[S];if(Array.isArray(E))for(let O=0,I=E.length;O<I;O++)h(E[O],S,O,R);else h(E,S,0,R)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function h(M,T,b,R){if(u(M,T,b,R)===!0){const S=M.__offset,_=M.value;if(Array.isArray(_)){let E=0;for(let O=0;O<_.length;O++){const I=_[O],D=x(I,!0);f(I,M.__data,E),E+=D.storage/Float32Array.BYTES_PER_ELEMENT}}else f(_,M.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,S,M.__data)}}function f(M,T,b){typeof M=="number"||typeof M=="boolean"?T[b]=M:M.isMatrix3?(T[b]=M.elements[0],T[b+1]=M.elements[1],T[b+2]=M.elements[2],T[b+3]=0,T[b+4]=M.elements[3],T[b+5]=M.elements[4],T[b+6]=M.elements[5],T[b+7]=0,T[b+8]=M.elements[6],T[b+9]=M.elements[7],T[b+10]=M.elements[8],T[b+11]=0):ArrayBuffer.isView(M)?T.set(M.subarray(0,T.length-b),b):M.toArray(T,b)}function u(M,T,b,R){const S=M.value,_=T+"_"+b;if(Array.isArray(S)){R[_]===void 0&&(R[_]=[]);const E=R[_];let O=!1;for(let I=0;I<S.length;I++)d(S[I],E,I)===!0&&(O=!0);return O}return d(S,R,_)}function d(M,T,b){if(T[b]===void 0)return typeof M=="number"||typeof M=="boolean"?T[b]=M:ArrayBuffer.isView(M)?T[b]=M.slice():T[b]=M.clone(),!0;{const R=T[b];if(typeof M=="number"||typeof M=="boolean"){if(R!==M)return T[b]=M,!0}else{if(ArrayBuffer.isView(M))return!0;if(R.equals(M)===!1)return R.copy(M),!0}}return!1}function m(M){const T=M.uniforms;let b=0;const R=16;for(let _=0,E=T.length;_<E;_++){const O=Array.isArray(T[_])?T[_]:[T[_]];for(let I=0,D=O.length;I<D;I++){const U=O[I],$=Array.isArray(U.value)?U.value:[U.value],A=Array.isArray(T[_])||Array.isArray(U.value);let k=b;for(let H=0,ne=$.length;H<ne;H++){const q=$[H],ee=x(q,A),B=b%R,ae=B%ee.boundary,be=B+ae;b+=ae,be!==0&&R-be<ee.storage&&(b+=R-be),H===0&&(k=b),b+=ee.storage}const X=U.type==="int"?Int32Array:U.type==="uint"?Uint32Array:Float32Array;U.__data=new X((b-k)/Float32Array.BYTES_PER_ELEMENT),U.__offset=k}}const S=b%R;return S>0&&(b+=R-S),M.__size=b,M.__cache={},this}function x(M,T){const b={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(b.boundary=4,b.storage=4):M.isVector2?(b.boundary=8,b.storage=8):M.isVector3||M.isColor?(b.boundary=16,b.storage=12):M.isVector4?(b.boundary=16,b.storage=16):M.isMatrix3?(b.boundary=16,b.storage=48):M.isMatrix4?(b.boundary=16,b.storage=64):M.isTexture?De("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(b.boundary=16,b.storage=M.byteLength):De("WebGLRenderer: Unsupported uniform value type.",M),T===!0&&(b.boundary=16,b.storage=Math.ceil(b.storage/16)*16),b}function g(M){const T=M.target;T.removeEventListener("dispose",g),s.deleteBuffer(n[T.id]),delete n[T.id],delete r[T.id]}function p(){for(const M in n)s.deleteBuffer(n[M]);n={},r={}}return{bind:a,update:o,dispose:p}}const Iv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let vi=null;function Lv(){return vi===null&&(vi=new Yn(Iv,16,16,mn,bi),vi.name="DFG_LUT",vi.minFilter=Ct,vi.magFilter=Ct,vi.wrapS=$t,vi.wrapT=$t,vi.generateMipmaps=!1,vi.needsUpdate=!0),vi}class Nv{constructor(e={}){const{canvas:t=af(),context:i=null,depth:n=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=Gt}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const x=d,g=new Set([Vo,Ho,zo]),p=new Set([Gt,Mi,Ts,Xn,Bo,ko]),M=new Uint32Array(4),T=new Int32Array(4),b={textures:[],min:[],max:[],resolution:[]};let R=null,S=null;const _=[],E=[];let O=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ki,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const I=this;let D=!1,U=null,$=null,A=null,k=null;this._outputColorSpace=ti;let X=0,H=0,ne=null,q=-1,ee=null;const B=new dt,ae=new dt;let be=null;const z=new Ke(0);let ie=0,he=t.width,Te=t.height,se=1,Ae=null,C=null;const N=new dt(0,0,he,Te),ye=new dt(0,0,he,Te);let Ne=!1;const oe=new Cs,Ie=new $o;let Oe=!1,Pe=!1;const rt=new Qe,$e=new Y,Xe=new dt,Ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Lt=!1;function Zt(){return ne===null?se:1}let F=i;function Jt(y,L){return t.getContext(y,L)}let gt,_t,ve,Mt,Be,ze,w,v,G,re,te,ue,ge,J,j,fe,P,Q,Z,pe,ce,de,Ue;try{const y={alpha:!0,depth:n,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Fo}`),t.addEventListener("webglcontextlost",Fe,!1),t.addEventListener("webglcontextrestored",We,!1),t.addEventListener("webglcontextcreationerror",Se,!1),F===null){const L="webgl2";if(F=Jt(L,y),F===null)throw Jt(L)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}qe()}catch(y){throw t.removeEventListener("webglcontextlost",Fe,!1),t.removeEventListener("webglcontextrestored",We,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),ke("WebGLRenderer: "+y.message),y}function qe(){gt=new F0(F),gt.init(),ce=new bv(F,gt),_t=new T0(F,gt,e,ce),ve=new Sv(F,gt),_t.reversedDepthBuffer&&u&&ve.buffers.depth.setReversed(!0),$=F.createFramebuffer(),A=F.createFramebuffer(),k=F.createFramebuffer(),Mt=new k0(F),Be=new ov,ze=new Mv(F,gt,ve,Be,_t,ce,Mt),w=new U0(I),v=new Hp(F),de=new b0(F,v),G=new O0(F,v,Mt,de),re=new H0(F,G,v,de,Mt),Q=new z0(F,_t,ze),j=new w0(Be),te=new av(I,w,gt,_t,de,j),ue=new Cv(I,Be),ge=new cv,J=new mv(gt),P=new M0(I,w,ve,re,m,l),fe=new yv(I,re,_t),Ue=new Pv(F,Mt,_t,ve),Z=new E0(F,gt,Mt),pe=new B0(F,gt,Mt),Mt.programs=te.programs,I.capabilities=_t,I.extensions=gt,I.properties=Be,I.renderLists=ge,I.shadowMap=fe,I.state=ve,I.info=Mt}x!==Gt&&(O=new G0(x,t.width,t.height,o,n,r));const le=new Av(I,F);this.xr=le,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const y=gt.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=gt.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return se},this.setPixelRatio=function(y){y!==void 0&&(se=y,this.setSize(he,Te,!1))},this.getSize=function(y){return y.set(he,Te)},this.setSize=function(y,L,K=!0){if(le.isPresenting){De("WebGLRenderer: Can't change size while VR device is presenting.");return}he=y,Te=L,t.width=Math.floor(y*se),t.height=Math.floor(L*se),K===!0&&(t.style.width=y+"px",t.style.height=L+"px"),O!==null&&O.setSize(t.width,t.height),this.setViewport(0,0,y,L)},this.getDrawingBufferSize=function(y){return y.set(he*se,Te*se).floor()},this.setDrawingBufferSize=function(y,L,K){he=y,Te=L,se=K,t.width=Math.floor(y*K),t.height=Math.floor(L*K),this.setViewport(0,0,y,L)},this.setEffects=function(y){if(x===Gt){ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let L=0;L<y.length;L++)if(y[L].isOutputPass===!0){De("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}O.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(B)},this.getViewport=function(y){return y.copy(N)},this.setViewport=function(y,L,K,V){y.isVector4?N.set(y.x,y.y,y.z,y.w):N.set(y,L,K,V),ve.viewport(B.copy(N).multiplyScalar(Zt()).round())},this.getScissor=function(y){return y.copy(ye)},this.setScissor=function(y,L,K,V){y.isVector4?ye.set(y.x,y.y,y.z,y.w):ye.set(y,L,K,V),ve.scissor(ae.copy(ye).multiplyScalar(Zt()).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(y){ve.setScissorTest(Ne=y)},this.setOpaqueSort=function(y){Ae=y},this.setTransparentSort=function(y){C=y},this.getClearColor=function(y){return y.copy(P.getClearColor())},this.setClearColor=function(){P.setClearColor(...arguments)},this.getClearAlpha=function(){return P.getClearAlpha()},this.setClearAlpha=function(){P.setClearAlpha(...arguments)},this.clear=function(y=!0,L=!0,K=!0){let V=0;if(y){let W=!1;if(ne!==null){const _e=ne.texture.format;W=g.has(_e)}if(W){const _e=ne.texture.type,we=p.has(_e),me=P.getClearColor(),Ee=P.getClearAlpha(),Le=me.r,Ve=me.g,et=me.b;we?(M[0]=Le,M[1]=Ve,M[2]=et,M[3]=Ee,F.clearBufferuiv(F.COLOR,0,M)):(T[0]=Le,T[1]=Ve,T[2]=et,T[3]=Ee,F.clearBufferiv(F.COLOR,0,T))}else V|=F.COLOR_BUFFER_BIT}L&&(V|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(V|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),V!==0&&F.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),U=y},this.dispose=function(){t.removeEventListener("webglcontextlost",Fe,!1),t.removeEventListener("webglcontextrestored",We,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),P.dispose(),ge.dispose(),J.dispose(),ze.dispose(),Be.dispose(),w.dispose(),re.dispose(),G.dispose(),de.dispose(),Ue.dispose(),te.dispose(),le.dispose(),le.removeEventListener("sessionstart",ol),le.removeEventListener("sessionend",ll),rn.stop()};function Fe(y){y.preventDefault(),Dr("WebGLRenderer: Context Lost."),D=!0}function We(){Dr("WebGLRenderer: Context Restored."),D=!1;const y=Mt.autoReset,L=fe.enabled,K=fe.autoUpdate,V=fe.needsUpdate,W=fe.type;qe(),Mt.autoReset=y,fe.enabled=L,fe.autoUpdate=K,fe.needsUpdate=V,fe.type=W}function Se(y){ke("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function ct(y){const L=y.target;L.removeEventListener("dispose",ct),wt(L)}function wt(y){Gi(y),Be.remove(y)}function Gi(y){const L=Be.get(y).programs;L!==void 0&&(L.forEach(function(K){te.releaseProgram(K)}),y.isShaderMaterial&&te.releaseShaderCache(y))}this.renderBufferDirect=function(y,L,K,V,W,_e){L===null&&(L=Ot);const we=W.isMesh&&W.matrixWorld.determinantAffine()<0,me=su(y,L,K,V,W);ve.setMaterial(V,we);let Ee=K.index,Le=1;if(V.wireframe===!0){if(Ee=G.getWireframeAttribute(K),Ee===void 0)return;Le=2}const Ve=K.drawRange,et=K.attributes.position;let Re=Ve.start*Le,tt=(Ve.start+Ve.count)*Le;_e!==null&&(Re=Math.max(Re,_e.start*Le),tt=Math.min(tt,(_e.start+_e.count)*Le)),Ee!==null?(Re=Math.max(Re,0),tt=Math.min(tt,Ee.count)):et!=null&&(Re=Math.max(Re,0),tt=Math.min(tt,et.count));const yt=tt-Re;if(yt<0||yt===1/0)return;de.setup(W,V,me,K,Ee);let pt,ft=Z;if(Ee!==null&&(pt=v.get(Ee),ft=pe,ft.setIndex(pt)),W.isMesh)V.wireframe===!0?(ve.setLineWidth(V.wireframeLinewidth*Zt()),ft.setMode(F.LINES)):ft.setMode(F.TRIANGLES);else if(W.isLine){let Nt=V.linewidth;Nt===void 0&&(Nt=1),ve.setLineWidth(Nt*Zt()),W.isLineSegments?ft.setMode(F.LINES):W.isLineLoop?ft.setMode(F.LINE_LOOP):ft.setMode(F.LINE_STRIP)}else W.isPoints?ft.setMode(F.POINTS):W.isSprite&&ft.setMode(F.TRIANGLES);if(W.isBatchedMesh)if(gt.get("WEBGL_multi_draw"))ft.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Nt=W._multiDrawStarts,Ce=W._multiDrawCounts,Bt=W._multiDrawCount,lt=Ee?v.get(Ee).bytesPerElement:1,an=Be.get(V).currentProgram.getUniforms();for(let Dt=0;Dt<Bt;Dt++)an.setValue(F,"_gl_DrawID",Dt),ft.render(Nt[Dt]/lt,Ce[Dt])}else if(W.isInstancedMesh)ft.renderInstances(Re,yt,W.count);else if(K.isInstancedBufferGeometry){const Nt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Ce=Math.min(K.instanceCount,Nt);ft.renderInstances(Re,yt,Ce)}else ft.render(Re,yt)};function al(y,L,K,V){U!==null&&y.isNodeMaterial&&U.setObject(V,y),Oe===!0&&j.setState(y,K,!1),y.transparent===!0&&y.side===fi&&y.forceSinglePass===!1?(y.side=Wt,y.needsUpdate=!0,es(y,L,V),y.side=pn,y.needsUpdate=!0,es(y,L,V),y.side=fi):es(y,L,V)}this.compile=function(y,L,K=null){K===null&&(K=y),U!==null&&U.renderStart(y,L,K),S=J.get(K),S.init(L),E.push(S),K.traverseVisible(function(W){W.isLight&&W.layers.test(L.layers)&&(S.pushLight(W),W.castShadow&&S.pushShadow(W))}),y!==K&&y.traverseVisible(function(W){W.isLight&&W.layers.test(L.layers)&&(S.pushLight(W),W.castShadow&&S.pushShadow(W))}),S.setupLights(),U!==null&&U.updateLights(S.state.lightsArray),Pe=this.localClippingEnabled,Oe=j.init(this.clippingPlanes,Pe),Oe===!0&&j.setGlobalState(this.clippingPlanes,L),U!==null&&fe.render(S.state.shadowsArray,K,L);const V=new Set;return y.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const _e=W.material;if(_e)if(Array.isArray(_e))for(let we=0;we<_e.length;we++){const me=_e[we];al(me,K,L,W),V.add(me)}else al(_e,K,L,W),V.add(_e)}),S=E.pop(),U!==null&&U.renderEnd(),V},this.compileAsync=function(y,L,K=null){const V=this.compile(y,L,K);return new Promise(W=>{function _e(){if(V.forEach(function(we){const Ee=Be.get(we).currentProgram;(Ee===void 0||Ee.isReady())&&V.delete(we)}),V.size===0){W(y);return}setTimeout(_e,10)}gt.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let qr=null;function iu(y){qr&&qr(y)}function ol(){rn.stop()}function ll(){rn.start()}const rn=new Xh;rn.setAnimationLoop(iu),typeof self<"u"&&rn.setContext(self),this.setAnimationLoop=function(y){qr=y,le.setAnimationLoop(y),y===null?rn.stop():rn.start()},le.addEventListener("sessionstart",ol),le.addEventListener("sessionend",ll),this.render=function(y,L){if(L!==void 0&&L.isCamera!==!0){ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;U!==null&&U.renderStart(y,L);const K=le.enabled===!0&&le.isPresenting===!0,V=O!==null&&(ne===null||K)&&O.begin(I,ne);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(O===null||O.isCompositing()===!1)&&(le.cameraAutoUpdate===!0&&le.updateCamera(L),L=le.getCamera()),y.isScene===!0&&y.onBeforeRender(I,y,L,ne),S=J.get(y,E.length),S.init(L),S.state.textureUnits=ze.getTextureUnits(),E.push(S),rt.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),L.isArrayCamera?Ie.setFromArrayCamera(L):oe.setFromProjectionMatrix(rt,mi,L.reversedDepth),Pe=this.localClippingEnabled,Oe=j.init(this.clippingPlanes,Pe),R=ge.get(y,_.length),R.init(),_.push(R),this.info.render.frame++,le.enabled===!0&&le.isPresenting===!0){const we=I.xr.getDepthSensingMesh();we!==null&&Yr(we,L,-1/0,I.sortObjects)}Yr(y,L,0,I.sortObjects),R.finish(),U!==null&&U.updateLights(S.state.lightsArray),I.sortObjects===!0&&R.sort(Ae,C),Lt=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,Lt&&P.addToRenderList(R,y),this.info.autoReset===!0&&this.info.reset(),Oe===!0&&j.beginShadows();const W=S.state.shadowsArray;if(fe.render(W,y,L),Oe===!0&&j.endShadows(),(V&&O.hasRenderPass())===!1){const we=R.opaque,me=R.transmissive;if(S.setupLights(),L.isArrayCamera){const Ee=L.cameras;if(me.length>0)for(let Le=0,Ve=Ee.length;Le<Ve;Le++){const et=Ee[Le];hl(we,me,y,et)}Lt&&P.render(y);for(let Le=0,Ve=Ee.length;Le<Ve;Le++){const et=Ee[Le];cl(R,y,et,et.viewport)}}else me.length>0&&hl(we,me,y,L),Lt&&P.render(y),cl(R,y,L)}ne!==null&&H===0&&(ze.updateMultisampleRenderTarget(ne),ze.updateRenderTargetMipmap(ne)),V&&O.end(I),y.isScene===!0&&y.onAfterRender(I,y,L),de.resetDefaultState(),q=-1,ee=null,E.pop(),E.length>0?(S=E[E.length-1],ze.setTextureUnits(S.state.textureUnits),Oe===!0&&j.setGlobalState(I.clippingPlanes,S.state.camera)):S=null,_.pop(),_.length>0?R=_[_.length-1]:R=null,U!==null&&U.renderEnd()};function Yr(y,L,K,V){if(y.visible===!1)return;if(y.layers.test(L.layers)){if(y.isGroup)K=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(L);else if(y.isLight)S.pushLight(y),y.castShadow&&S.pushShadow(y);else if(y.isSprite){const we=L.isArrayCamera?Ie:oe;if(!y.frustumCulled||y.intersectsFrustum(we)){V&&Xe.setFromMatrixPosition(y.matrixWorld).applyMatrix4(rt);const me=re.update(y),Ee=y.material;Ee.visible&&R.push(y,me,Ee,K,Xe.z,null,L)}}else if(y.isMesh||y.isLine||y.isPoints){const we=L.isArrayCamera?Ie:oe;if(!y.frustumCulled||y.intersectsFrustum(we)){const me=re.update(y),Ee=y.material;if(V&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Xe.copy(y.boundingSphere.center)):(me.boundingSphere===null&&me.computeBoundingSphere(),Xe.copy(me.boundingSphere.center)),Xe.applyMatrix4(y.matrixWorld).applyMatrix4(rt)),Array.isArray(Ee)){const Le=me.groups;for(let Ve=0,et=Le.length;Ve<et;Ve++){const Re=Le[Ve],tt=Ee[Re.materialIndex];tt&&tt.visible&&R.push(y,me,tt,K,Xe.z,Re,L)}}else Ee.visible&&R.push(y,me,Ee,K,Xe.z,null,L)}}}const _e=y.children;for(let we=0,me=_e.length;we<me;we++)Yr(_e[we],L,K,V)}function cl(y,L,K,V){const{opaque:W,transmissive:_e,transparent:we}=y;S.setupLightsView(K),Oe===!0&&j.setGlobalState(I.clippingPlanes,K),V&&ve.viewport(B.copy(V)),W.length>0&&Ns(W,L,K),_e.length>0&&Ns(_e,L,K),we.length>0&&Ns(we,L,K),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function hl(y,L,K,V){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[V.id]===void 0){const Re=gt.has("EXT_color_buffer_half_float")||gt.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[V.id]=new Si(1,1,{generateMipmaps:!0,type:Re?bi:Gt,minFilter:Oi,samples:Math.max(4,_t.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:nt.workingColorSpace})}const _e=S.state.transmissionRenderTarget[V.id],we=V.viewport||B;_e.setSize(we.z*I.transmissionResolutionScale,we.w*I.transmissionResolutionScale);const me=I.getRenderTarget(),Ee=I.getActiveCubeFace(),Le=I.getActiveMipmapLevel();I.setRenderTarget(_e),I.getClearColor(z),ie=I.getClearAlpha(),ie<1&&I.setClearColor(16777215,.5),I.clear(),Lt&&P.render(K);const Ve=I.toneMapping;I.toneMapping=ki;const et=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),S.setupLightsView(V),Oe===!0&&j.setGlobalState(I.clippingPlanes,V),Ns(y,K,V),ze.updateMultisampleRenderTarget(_e),ze.updateRenderTargetMipmap(_e),gt.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let tt=0,yt=L.length;tt<yt;tt++){const pt=L[tt],{object:ft,geometry:Nt,material:Ce,group:Bt}=pt;if(Ce.side===fi&&ft.layers.test(V.layers)){const lt=Ce.side;Ce.side=Wt,Ce.needsUpdate=!0,ul(ft,K,V,Nt,Ce,Bt),Ce.side=lt,Ce.needsUpdate=!0,Re=!0}}Re===!0&&(ze.updateMultisampleRenderTarget(_e),ze.updateRenderTargetMipmap(_e))}I.setRenderTarget(me,Ee,Le),I.setClearColor(z,ie),et!==void 0&&(V.viewport=et),I.toneMapping=Ve}function Ns(y,L,K){const V=L.isScene===!0?L.overrideMaterial:null;for(let W=0,_e=y.length;W<_e;W++){const we=y[W],{object:me,geometry:Ee,group:Le}=we;let Ve=we.material;Ve.allowOverride===!0&&V!==null&&(Ve=V),me.layers.test(K.layers)&&ul(me,L,K,Ee,Ve,Le)}}function ul(y,L,K,V,W,_e){U!==null&&W.isNodeMaterial&&U.setObject(y,W),y.onBeforeRender(I,L,K,V,W,_e),y.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),W.onBeforeRender(I,L,K,V,y,_e),W.transparent===!0&&W.side===fi&&W.forceSinglePass===!1?(W.side=Wt,W.needsUpdate=!0,I.renderBufferDirect(K,L,V,W,y,_e),W.side=pn,W.needsUpdate=!0,I.renderBufferDirect(K,L,V,W,y,_e),W.side=fi):I.renderBufferDirect(K,L,V,W,y,_e),y.onAfterRender(I,L,K,V,W,_e)}function dl(y){let L=0;for(const K of y)K.texture!==null&&L++;return L}function es(y,L,K){L.isScene!==!0&&(L=Ot);const V=Be.get(y),W=S.state.lights,_e=S.state.shadowsArray,we=W.state.version,me=te.getParameters(y,W.state,_e,L,K,S.state.lightProbeGridArray),Ee=te.getProgramCacheKey(me);let Le=V.programs;V.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?L.environment:null,V.fog=L.fog;const Ve=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;V.envMap=w.get(y.envMap||V.environment,Ve),V.envMapRotation=V.environment!==null&&y.envMap===null?L.environmentRotation:y.envMapRotation,Le===void 0&&(y.addEventListener("dispose",ct),Le=new Map,V.programs=Le,V.programVariants=new Map);let et=Le.get(Ee);if(et!==void 0){if(V.currentProgram===et&&V.lightsStateVersion===we)return pl(y,me),et}else me.uniforms=te.getUniforms(y),U!==null&&y.isNodeMaterial&&U.build(y,K,me),y.onBeforeCompile(me,I),et=te.acquireProgram(me,Ee),Le.set(Ee,et),V.uniforms=me.uniforms;const Re=V.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Re.clippingPlanes=j.uniform),pl(y,me),V.needsLights=au(y),V.lightsStateVersion=we,V.needsLights&&(Re.ambientLightColor.value=W.state.ambient,Re.lightProbe.value=W.state.probe,Re.sunLights.value=W.state.sun,Re.sunLightShadows.value=W.state.sunShadow,Re.directionalLights.value=W.state.directional,Re.directionalLightShadows.value=W.state.directionalShadow,Re.spotLights.value=W.state.spot,Re.spotLightShadows.value=W.state.spotShadow,Re.rectAreaLights.value=W.state.rectArea,Re.ltc_1.value=W.state.rectAreaLTC1,Re.ltc_2.value=W.state.rectAreaLTC2,Re.pointLights.value=W.state.point,Re.pointLightShadows.value=W.state.pointShadow,Re.hemisphereLights.value=W.state.hemi,Re.sunShadowMatrix.value=W.state.sunShadowMatrix,Re.sunShadowCascade.value=W.state.sunShadowCascade,Re.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Re.spotLightMatrix.value=W.state.spotLightMatrix,Re.spotLightMap.value=W.state.spotLightMap,Re.pointShadowMatrix.value=W.state.pointShadowMatrix),V.numLightProbeGrids=dl(S.state.lightProbeGridArray),V.currentProgram=et,V.uniformsList=null,et}function nu(y,L,K,V,W){const _e=Be.get(y),we=_e.currentProgram.id+","+V+","+W;let me=_e.programVariants.get(we);return me===void 0?(me=es(y,L,K),_e.programVariants.set(we,me)):(_e.currentProgram=me,_e.uniformsList=null,_e.outputColorSpace=V,_e.toneMapping=W),me}function fl(y){if(y.uniformsList===null){const L=y.currentProgram.getUniforms();y.uniformsList=Sr.seqWithValue(L.seq,y.uniforms)}return y.uniformsList}function pl(y,L){const K=Be.get(y);K.outputColorSpace=L.outputColorSpace,K.batching=L.batching,K.batchingColor=L.batchingColor,K.instancing=L.instancing,K.instancingColor=L.instancingColor,K.instancingMorph=L.instancingMorph,K.skinning=L.skinning,K.morphTargets=L.morphTargets,K.morphNormals=L.morphNormals,K.morphColors=L.morphColors,K.morphTargetsCount=L.morphTargetsCount,K.numClippingPlanes=L.numClippingPlanes,K.numIntersection=L.numClipIntersection,K.vertexAlphas=L.vertexAlphas,K.vertexTangents=L.vertexTangents,K.toneMapping=L.toneMapping}function su(y,L,K,V,W){L.isScene!==!0&&(L=Ot),ze.resetTextureUnits();const _e=L.fog,we=V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial?L.environment:null,me=ne===null?I.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:nt.workingColorSpace,Ee=V.isMeshStandardMaterial||V.isMeshLambertMaterial&&!V.envMap||V.isMeshPhongMaterial&&!V.envMap,Le=w.get(V.envMap||we,Ee),Ve=V.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,et=!!K.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Re=!!K.morphAttributes.position,tt=!!K.morphAttributes.normal,yt=!!K.morphAttributes.color;let pt=ki;V.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(pt=I.toneMapping);const ft=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Nt=ft!==void 0?ft.length:0,Ce=Be.get(V),Bt=S.state.lights;if(Oe===!0&&(Pe===!0||y!==ee)){const vt=y===ee&&V.id===q;j.setState(V,y,vt)}let lt=!1,an=!1;V.version===Ce.__version?Ce.needsLights&&Ce.lightsStateVersion!==Bt.state.version||W.isBatchedMesh&&Ce.batching===!1||!W.isBatchedMesh&&Ce.batching===!0||W.isBatchedMesh&&Ce.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&Ce.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&Ce.instancing===!1||!W.isInstancedMesh&&Ce.instancing===!0||W.isSkinnedMesh&&Ce.skinning===!1||!W.isSkinnedMesh&&Ce.skinning===!0||W.isInstancedMesh&&Ce.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Ce.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Ce.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Ce.instancingMorph===!1&&W.morphTexture!==null||Ce.envMap!==Le||V.fog===!0&&Ce.fog!==_e||Ce.numClippingPlanes!==void 0&&(Ce.numClippingPlanes!==j.numPlanes||Ce.numIntersection!==j.numIntersection)||Ce.vertexAlphas!==Ve||Ce.vertexTangents!==et||Ce.morphTargets!==Re||Ce.morphNormals!==tt||Ce.morphColors!==yt||Ce.morphTargetsCount!==Nt||Ce.numLightProbeGrids!==dl(S.state.lightProbeGridArray)?lt=!0:(Ce.outputColorSpace!==me||Ce.toneMapping!==pt)&&(an=!0):(lt=!0,Ce.__version=V.version);let Dt=Ce.currentProgram;(lt===!0||an===!0)&&(Dt=an===!0?nu(V,L,W,me,pt):es(V,L,W),U&&V.isNodeMaterial&&U.onUpdateProgram(V,Dt,Ce));let Ds=!1,Wi=!1,on=!1;const at=Dt.getUniforms(),Pt=Ce.uniforms;if(ve.useProgram(Dt.program)&&(Ds=!0,Wi=!0,on=!0),V.id!==q&&(q=V.id,Wi=!0),Ds||ee!==y){ve.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),at.setValue(F,"projectionMatrix",y.projectionMatrix),at.setValue(F,"viewMatrix",y.matrixWorldInverse);const At=at.map.cameraPosition;At!==void 0&&At.setValue(F,$e.setFromMatrixPosition(y.matrixWorld)),_t.logarithmicDepthBuffer&&at.setValue(F,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&at.setValue(F,"isOrthographic",y.isOrthographicCamera===!0),ee!==y&&(ee=y,Wi=!0,on=!0)}if(Ce.needsLights&&(Bt.state.sunShadowMap.length>0&&at.setValue(F,"sunShadowMap",Bt.state.sunShadowMap,ze),Bt.state.directionalShadowMap.length>0&&at.setValue(F,"directionalShadowMap",Bt.state.directionalShadowMap,ze),Bt.state.spotShadowMap.length>0&&at.setValue(F,"spotShadowMap",Bt.state.spotShadowMap,ze),Bt.state.pointShadowMap.length>0&&at.setValue(F,"pointShadowMap",Bt.state.pointShadowMap,ze)),W.isSkinnedMesh){at.setOptional(F,W,"bindMatrix"),at.setOptional(F,W,"bindMatrixInverse");const vt=W.skeleton;vt&&(vt.boneTexture===null&&vt.computeBoneTexture(),at.setValue(F,"boneTexture",vt.boneTexture,ze))}W.isBatchedMesh&&(at.setOptional(F,W,"batchingTexture"),at.setValue(F,"batchingTexture",W._matricesTexture,ze),at.setOptional(F,W,"batchingIdTexture"),at.setValue(F,"batchingIdTexture",W._indirectTexture,ze),at.setOptional(F,W,"batchingColorTexture"),W._colorsTexture!==null&&at.setValue(F,"batchingColorTexture",W._colorsTexture,ze));const ai=K.morphAttributes;if((ai.position!==void 0||ai.normal!==void 0||ai.color!==void 0)&&Q.update(W,K,Dt),(Wi||Ce.receiveShadow!==W.receiveShadow)&&(Ce.receiveShadow=W.receiveShadow,at.setValue(F,"receiveShadow",W.receiveShadow)),(V.isMeshStandardMaterial||V.isMeshLambertMaterial||V.isMeshPhongMaterial)&&V.envMap===null&&L.environment!==null&&(Pt.envMapIntensity.value=L.environmentIntensity),Pt.dfgLUT!==void 0&&(Pt.dfgLUT.value=Lv()),Wi){if(at.setValue(F,"toneMappingExposure",I.toneMappingExposure),Ce.needsLights&&ru(Pt,on),_e&&V.fog===!0&&ue.refreshFogUniforms(Pt,_e),ue.refreshMaterialUniforms(Pt,V,se,Te,S.state.transmissionRenderTarget[y.id]),Ce.needsLights&&Ce.numLightProbeGrids>0){const vt=b;let At=0;for(const wi of S.state.lightProbeGridArray)wi.texture!==null&&(vt.textures[At]=wi.texture,vt.min[At]=wi.boundingBox.min,vt.max[At]=wi.boundingBox.max,vt.resolution[At]=wi.resolution,At++);for(const wi in vt)vt[wi].length=At;Pt.probesSH.value=vt.textures,Pt.probesMin.value=vt.min,Pt.probesMax.value=vt.max,Pt.probesResolution.value=vt.resolution}Sr.upload(F,fl(Ce),Pt,ze)}if(V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(Sr.upload(F,fl(Ce),Pt,ze),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&at.setValue(F,"center",W.center),at.setValue(F,"modelViewMatrix",W.modelViewMatrix),at.setValue(F,"normalMatrix",W.normalMatrix),at.setValue(F,"modelMatrix",W.matrixWorld),V.uniformsGroups!==void 0){const vt=V.uniformsGroups;for(let At=0,wi=vt.length;At<wi;At++){const gl=vt[At];Ue.update(gl,Dt),Ue.bind(gl,Dt)}}return Dt}function ru(y,L){y.ambientLightColor.needsUpdate=L,y.lightProbe.needsUpdate=L,y.sunLights.needsUpdate=L,y.sunLightShadows.needsUpdate=L,y.directionalLights.needsUpdate=L,y.directionalLightShadows.needsUpdate=L,y.pointLights.needsUpdate=L,y.pointLightShadows.needsUpdate=L,y.spotLights.needsUpdate=L,y.spotLightShadows.needsUpdate=L,y.rectAreaLights.needsUpdate=L,y.hemisphereLights.needsUpdate=L}function au(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(y,L,K){const V=Be.get(y);V.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),Be.get(y.texture).__webglTexture=L,Be.get(y.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:K,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,L){const K=Be.get(y);K.__webglFramebuffer=L,K.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(y,L=0,K=0){ne=y,X=L,H=K;let V=null,W=!1,_e=!1;if(y){const me=Be.get(y);if(me.__useDefaultFramebuffer!==void 0){ve.bindFramebuffer(F.FRAMEBUFFER,me.__webglFramebuffer),B.copy(y.viewport),ae.copy(y.scissor),be=y.scissorTest,ve.viewport(B),ve.scissor(ae),ve.setScissorTest(be),q=-1;return}else if(me.__webglFramebuffer===void 0)ze.setupRenderTarget(y);else if(me.__hasExternalTextures)ze.rebindTextures(y,Be.get(y.texture).__webglTexture,Be.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const Ve=y.depthTexture;if(me.__boundDepthTexture!==Ve){if(Ve!==null&&Be.has(Ve)&&(y.width!==Ve.image.width||y.height!==Ve.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ze.setupDepthRenderbuffer(y)}}const Ee=y.texture;(Ee.isData3DTexture||Ee.isDataArrayTexture||Ee.isCompressedArrayTexture)&&(_e=!0);const Le=Be.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Le[L])?V=Le[L][K]:V=Le[L],W=!0):y.samples>0&&ze.useMultisampledRTT(y)===!1?V=Be.get(y).__webglMultisampledFramebuffer:Array.isArray(Le)?V=Le[K]:V=Le,B.copy(y.viewport),ae.copy(y.scissor),be=y.scissorTest}else B.copy(N).multiplyScalar(se).floor(),ae.copy(ye).multiplyScalar(se).floor(),be=Ne;if(K!==0&&(V=$),ve.bindFramebuffer(F.FRAMEBUFFER,V)&&ve.drawBuffers(y,V),ve.viewport(B),ve.scissor(ae),ve.setScissorTest(be),W){const me=Be.get(y.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+L,me.__webglTexture,K)}else if(_e){const me=L;for(let Ee=0;Ee<y.textures.length;Ee++){const Le=Be.get(y.textures[Ee]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Ee,Le.__webglTexture,K,me)}}else if(y!==null&&K!==0){const me=Be.get(y.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,me.__webglTexture,K)}q=-1};function ml(y){const L=Be.get(y);return(L.__readFormat!==y.format||L.__readType!==y.type)&&(L.__readFormat=y.format,L.__readType=y.type,L.__formatReadable=_t.textureFormatReadable(y.format),L.__typeReadable=_t.textureTypeReadable(y.type)),L}this.readRenderTargetPixels=function(y,L,K,V,W,_e,we,me=0){if(!(y&&y.isWebGLRenderTarget)){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=Be.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&we!==void 0&&(Ee=Ee[we],Array.isArray(Ee)&&(Ee=Ee[0])),Ee){ve.bindFramebuffer(F.FRAMEBUFFER,Ee);try{const Le=y.textures[me],Ve=Le.format,et=Le.type;y.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+me);const Re=ml(Le);if(Re.__formatReadable===!1){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Re.__typeReadable===!1){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=y.width-V&&K>=0&&K<=y.height-W&&F.readPixels(L,K,V,W,ce.convert(Ve),ce.convert(et),_e)}finally{const Le=ne!==null?Be.get(ne).__webglFramebuffer:null;ve.bindFramebuffer(F.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(y,L,K,V,W,_e,we,me=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=Be.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&we!==void 0&&(Ee=Ee[we],Array.isArray(Ee)&&(Ee=Ee[0])),Ee)if(L>=0&&L<=y.width-V&&K>=0&&K<=y.height-W){ve.bindFramebuffer(F.FRAMEBUFFER,Ee);const Le=y.textures[me],Ve=Le.format,et=Le.type;y.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+me);const Re=ml(Le);if(Re.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Re.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const tt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,tt),F.bufferData(F.PIXEL_PACK_BUFFER,_e.byteLength,F.STREAM_READ),F.readPixels(L,K,V,W,ce.convert(Ve),ce.convert(et),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);const yt=ne!==null?Be.get(ne).__webglFramebuffer:null;ve.bindFramebuffer(F.FRAMEBUFFER,yt);const pt=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await of(F,pt,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,tt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,_e),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(tt),F.deleteSync(pt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,L=null,K=0){const V=Math.pow(2,-K),W=Math.floor(y.image.width*V),_e=Math.floor(y.image.height*V),we=L!==null?L.x:0,me=L!==null?L.y:0;ze.setTexture2D(y,0),F.copyTexSubImage2D(F.TEXTURE_2D,K,0,0,we,me,W,_e),ve.unbindTexture()},this.copyTextureToTexture=function(y,L,K=null,V=null,W=0,_e=0){let we,me,Ee,Le,Ve,et,Re,tt,yt;const pt=y.isCompressedTexture?y.mipmaps[_e]:y.image;if(K!==null)we=K.max.x-K.min.x,me=K.max.y-K.min.y,Ee=K.isBox3?K.max.z-K.min.z:1,Le=K.min.x,Ve=K.min.y,et=K.isBox3?K.min.z:0;else{const at=Math.pow(2,-W);we=Math.floor(pt.width*at),me=Math.floor(pt.height*at),y.isDataArrayTexture?Ee=pt.depth:y.isData3DTexture?Ee=Math.floor(pt.depth*at):Ee=1,Le=0,Ve=0,et=0}V!==null?(Re=V.x,tt=V.y,yt=V.z):(Re=0,tt=0,yt=0);const ft=ce.convert(L.format),Nt=ce.convert(L.type);let Ce;L.isData3DTexture?(ze.setTexture3D(L,0),Ce=F.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(ze.setTexture2DArray(L,0),Ce=F.TEXTURE_2D_ARRAY):(ze.setTexture2D(L,0),Ce=F.TEXTURE_2D),ve.activeTexture(F.TEXTURE0),ve.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,L.flipY),ve.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),ve.pixelStorei(F.UNPACK_ALIGNMENT,L.unpackAlignment);const Bt=ve.getParameter(F.UNPACK_ROW_LENGTH),lt=ve.getParameter(F.UNPACK_IMAGE_HEIGHT),an=ve.getParameter(F.UNPACK_SKIP_PIXELS),Dt=ve.getParameter(F.UNPACK_SKIP_ROWS),Ds=ve.getParameter(F.UNPACK_SKIP_IMAGES);ve.pixelStorei(F.UNPACK_ROW_LENGTH,pt.width),ve.pixelStorei(F.UNPACK_IMAGE_HEIGHT,pt.height),ve.pixelStorei(F.UNPACK_SKIP_PIXELS,Le),ve.pixelStorei(F.UNPACK_SKIP_ROWS,Ve),ve.pixelStorei(F.UNPACK_SKIP_IMAGES,et);const Wi=y.isDataArrayTexture||y.isData3DTexture,on=L.isDataArrayTexture||L.isData3DTexture;if(y.isDepthTexture){const at=Be.get(y),Pt=Be.get(L),ai=Be.get(at.__renderTarget),vt=Be.get(Pt.__renderTarget);ve.bindFramebuffer(F.READ_FRAMEBUFFER,ai.__webglFramebuffer),ve.bindFramebuffer(F.DRAW_FRAMEBUFFER,vt.__webglFramebuffer);for(let At=0;At<Ee;At++)Wi&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Be.get(y).__webglTexture,W,et+At),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Be.get(L).__webglTexture,_e,yt+At)),F.blitFramebuffer(Le,Ve,Le+we,Ve+me,Re,tt,Re+we,tt+me,F.DEPTH_BUFFER_BIT,F.NEAREST);ve.bindFramebuffer(F.READ_FRAMEBUFFER,null),ve.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(W!==0||y.isRenderTargetTexture||Be.has(y)){const at=Be.get(y),Pt=Be.get(L);ve.bindFramebuffer(F.READ_FRAMEBUFFER,A),ve.bindFramebuffer(F.DRAW_FRAMEBUFFER,k);for(let ai=0;ai<Ee;ai++)Wi?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,at.__webglTexture,W,et+ai):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,at.__webglTexture,W),on?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Pt.__webglTexture,_e,yt+ai):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Pt.__webglTexture,_e),W!==0?F.blitFramebuffer(Le,Ve,Le+we,Ve+me,Re,tt,Re+we,tt+me,F.COLOR_BUFFER_BIT,F.NEAREST):on?F.copyTexSubImage3D(Ce,_e,Re,tt,yt+ai,Le,Ve,we,me):F.copyTexSubImage2D(Ce,_e,Re,tt,Le,Ve,we,me);ve.bindFramebuffer(F.READ_FRAMEBUFFER,null),ve.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else on?y.isDataTexture||y.isData3DTexture?F.texSubImage3D(Ce,_e,Re,tt,yt,we,me,Ee,ft,Nt,pt.data):L.isCompressedArrayTexture?F.compressedTexSubImage3D(Ce,_e,Re,tt,yt,we,me,Ee,ft,pt.data):F.texSubImage3D(Ce,_e,Re,tt,yt,we,me,Ee,ft,Nt,pt):y.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,_e,Re,tt,we,me,ft,Nt,pt.data):y.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,_e,Re,tt,pt.width,pt.height,ft,pt.data):F.texSubImage2D(F.TEXTURE_2D,_e,Re,tt,we,me,ft,Nt,pt);ve.pixelStorei(F.UNPACK_ROW_LENGTH,Bt),ve.pixelStorei(F.UNPACK_IMAGE_HEIGHT,lt),ve.pixelStorei(F.UNPACK_SKIP_PIXELS,an),ve.pixelStorei(F.UNPACK_SKIP_ROWS,Dt),ve.pixelStorei(F.UNPACK_SKIP_IMAGES,Ds),_e===0&&L.generateMipmaps===!0&&L.mipmapsAutoUpdate===!0&&F.generateMipmap(Ce),ve.unbindTexture()},this.initRenderTarget=function(y){Be.get(y).__webglFramebuffer===void 0&&ze.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?ze.setTextureCube(y,0):y.isData3DTexture?ze.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?ze.setTexture2DArray(y,0):ze.setTexture2D(y,0),ve.unbindTexture()},this.resetState=function(){X=0,H=0,ne=null,ve.reset(),de.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=nt._getDrawingBufferColorSpace(e),t.unpackColorSpace=nt._getUnpackColorSpace()}}const Zc=`precision highp float;
in vec3 position;in vec2 uv;uniform mat4 projectionMatrix,modelViewMatrix;uniform vec2 size,warpBounds;uniform bool warped;out vec2 texUV,localPoint;
void main(){texUV=uv;localPoint=position.xy*size;if(warped)localPoint.x=mix(warpBounds.x,warpBounds.y,position.x);gl_Position=projectionMatrix*modelViewMatrix*vec4(localPoint,0.,1.);}`,Dv=`precision highp float;
uniform sampler2D image,palette;uniform bool indexed,maskZero;uniform vec2 coefficients;uniform float opacity;
uniform bool warped;uniform vec4 warpEdges;uniform vec2 size;uniform int fxCount;uniform vec3 fxAdd[8],fxMul[8],fxPost[8];uniform vec2 fxColorInvert[8];in vec2 texUV,localPoint;out vec4 result;
void main(){vec2 sampleUV=texUV;if(warped){vec2 edges=mix(warpEdges.xy,warpEdges.zw,clamp(localPoint.y/size.y,0.,1.));float span=edges.y-edges.x;if(abs(span)<.00001)discard;float u=(localPoint.x-edges.x)/span;if(u<0.||u>=1.)discard;sampleUV=vec2(u,localPoint.y/size.y);}vec4 color;if(indexed){int i=int(floor(texture(image,sampleUV).r*255.+.5));if(i==0&&maskZero)discard;color=texelFetch(palette,ivec2(i,0),0);if(i==0)color.a=1.;}else{color=texture(image,sampleUV);}if(color.a<=0.)discard;
vec3 rgb=color.rgb*255.;for(int i=0;i<8;i++){if(i>=fxCount)break;float grey=dot(rgb,vec3(.299,.587,.114));rgb=mix(vec3(grey),rgb,fxColorInvert[i].x);if(fxColorInvert[i].y>.5)rgb=255.-rgb;rgb=clamp((rgb+fxAdd[i])*fxMul[i]+fxPost[i],0.,255.);}
rgb=floor(rgb+.00001)/255.;float coverage=color.a*opacity;result=vec4(rgb*coefficients.x*coverage,coverage*(1.-coefficients.y));}`,Uv=`precision highp float;uniform float ground;in vec2 texUV;out vec4 result;
void main(){vec2 p=vec2(texUV.x*960.,texUV.y*540.);vec3 color=vec3(.047,.067,.106);float h=ground-105.;if(p.y>h){float distance=p.y-h+16.;float x=(p.x-480.)*100./distance;float lines=min(abs(fract(x/80.+.5)-.5)*distance/100.,abs(fract(log(distance/16.)*3.)-.5)*distance*.18);color=mix(vec3(.105,.153,.215),color,smoothstep(.35,1.1,lines));}if(abs(p.y-ground)<.6)color=vec3(.27,.38,.33);result=vec4(color,1.);}`,Fv=()=>({add:Array.from({length:8},()=>[0,0,0]),mul:Array.from({length:8},()=>[1,1,1]),post:Array.from({length:8},()=>[0,0,0]),color:Array.from({length:8},()=>[1,0])});class Ov{constructor(e,{maxTextureBytes:t=64*1024*1024,preserveDrawingBuffer:i=!1}={}){this.renderer=new Nv({canvas:e,alpha:!1,antialias:!1,powerPreference:"high-performance",preserveDrawingBuffer:i}),this.renderer.debug.onShaderError=(a,o)=>{throw Error("Sprite shader could not compile: "+a.getProgramInfoLog(o))},this.renderer.outputColorSpace=ws,this.renderer.sortObjects=!1,this.renderer.setClearColor(790811,1),this.canvas=e,this.contextLost=a=>{a.preventDefault(),this.lost=!0},e.addEventListener("webglcontextlost",this.contextLost),this.limit=t,this.textureBytes=0,this.textureBreakdown={indexed:0,palette:0,rgba:0},this.textures=new Map,this.evictedTextures=0,this.deferredTextures=0,this.slots=[],this.frames=0,this.scene=new Of,this.camera=new jo(0,960,0,540,-10,10),this.camera.position.z=1,this.geometry=new Ti,this.geometry.setAttribute("position",new Kt([0,0,0,1,0,0,0,1,0,1,1,0],3)),this.geometry.setAttribute("uv",new Kt([0,0,1,0,0,1,1,1],2)),this.geometry.setIndex([0,1,2,2,1,3]);const n=new Co({glslVersion:Nr,vertexShader:Zc,fragmentShader:Uv,uniforms:{size:{value:[960,540]},ground:{value:450},warped:{value:!1},warpBounds:{value:[0,0]}},side:fi,depthTest:!1,depthWrite:!1});this.grid=new ri(this.geometry,n),this.grid.frustumCulled=!1,this.scene.add(this.grid),this.upload({id:"@white",width:1,height:1,indexed:!1,pixels:new Uint8Array([255,255,255,255])});const r=new Uint8Array(256);for(let a=0;a<8;a++)for(let o=0;o<8;o++)if(o===3||a===3||Math.abs(o-3)===Math.abs(a-3)){const l=(a*8+o)*4;r.set([255,240,130,255],l)}this.upload({id:"@spark",width:8,height:8,pixels:r})}upload(e,t=new Set){if(this.textures.has(e.id))return!0;const i=e.role==="palette"||!e.indexed&&typeof e.id=="string"&&e.id.includes(":pal:"),n=i?"palette":e.indexed?"indexed8":"rgba8",r=e.pixels,a=e.width*e.height*(n==="indexed8"?1:4);if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1)throw Error("Invalid GPU asset dimensions.");if(e.width>this.renderer.capabilities.maxTextureSize||e.height>this.renderer.capabilities.maxTextureSize)throw Error("Sprite exceeds this graphics device’s texture limit.");if(!Number.isSafeInteger(a)||!(r instanceof Uint8Array)||r.length!==a)throw Error("Invalid GPU asset dimensions.");if(i&&(e.indexed||e.width!==256||e.height!==1))throw Error("A GPU palette must be a 256x1 RGBA8 texture.");if(this.textureBytes+r.length>this.limit){const l=Md(this.textures,this.textureBytes,r.length,this.limit,t);if(!l)return this.deferredTextures++,!1;for(const c of l){const h=this.textures.get(c);if(!h)continue;h.dispose(),this.textureBytes-=h.userData.residentBytes||h.userData.videoBytes||0;const f=h.userData.kind;this.textureBreakdown||(this.textureBreakdown={indexed:0,palette:0,rgba:0}),f==="indexed8"?this.textureBreakdown.indexed-=h.userData.residentBytes:f==="palette"?this.textureBreakdown.palette-=h.userData.residentBytes:f==="rgba8"&&(this.textureBreakdown.rgba-=h.userData.residentBytes),this.textures.delete(c),this.evictedTextures++}}const o=new Yn(r,e.width,e.height,n==="indexed8"?kr:si,Gt);return o.internalFormat=n==="indexed8"?"R8":"RGBA8",o.colorSpace=Ui,o.minFilter=o.magFilter=bt,o.wrapS=o.wrapT=$t,o.generateMipmaps=!1,o.flipY=!1,o.unpackAlignment=1,o.needsUpdate=!0,o.userData.residentBytes=r.length,o.userData.kind=n,this.textures.set(e.id,o),this.textureBytes+=r.length,this.textureBreakdown||(this.textureBreakdown={indexed:0,palette:0,rgba:0}),this.textureBreakdown[n==="indexed8"?"indexed":n==="palette"?"palette":"rgba"]+=r.length,!0}resolveDrawTextures(e){const t=this.textures.get(e.texture);if(!t)return null;const i=t.userData.kind;if(e.indexed){if(i!=="indexed8")return null;const n=this.textures.get(e.palette);return(n==null?void 0:n.userData.kind)==="palette"?{image:t,palette:n}:null}return i==="indexed8"||i==="palette"?null:{image:t,palette:this.textures.get("@white")}}slot(e){if(this.slots[e])return this.slots[e];const t=Fv(),i=new Co({glslVersion:Nr,vertexShader:Zc,fragmentShader:Dv,uniforms:{image:{value:null},palette:{value:null},indexed:{value:!1},maskZero:{value:!0},size:{value:[1,1]},warped:{value:!1},warpEdges:{value:[0,1,0,1]},warpBounds:{value:[0,1]},coefficients:{value:[1,0]},opacity:{value:1},fxCount:{value:0},fxAdd:{value:t.add.flat()},fxMul:{value:t.mul.flat()},fxPost:{value:t.post.flat()},fxColorInvert:{value:t.color.flat()}},transparent:!0,depthTest:!1,depthWrite:!1,blending:sh,blendSrc:ka,blendDst:Ar,blendEquation:Di,blendEquationAlpha:Di,blendSrcAlpha:ka,blendDstAlpha:Ar});i.side=fi,i.forceSinglePass=!0;const n=new ri(this.geometry,i);return n.matrixAutoUpdate=!1,n.frustumCulled=!1,n.onBeforeRender=()=>{const r=n.userData.clip,a=this.renderer,o=this.canvas.width/960;a.setScissorTest(!!r),r&&a.setScissor(r[0]*o,(540-r[1]-r[3])*o,r[2]*o,r[3]*o),i.uniformsNeedUpdate=!0},this.scene.add(n),this.slots[e]=n,n}updateVideo(e){const t=e.bitmap;try{if(this.closed||this.lost)return!1;const i=t.width*t.height*4;if(t.width<1||t.height<1||t.width>1280||t.height>720)throw Error("Invalid stage video frame dimensions.");let n=this.textures.get(e.id);const r=(n==null?void 0:n.userData.videoBytes)||0;if(this.textureBytes-r+i>this.limit)throw Error("GPU texture budget exceeded by stage video.");return n||(n=new It,n.generateMipmaps=!1,n.wrapS=n.wrapT=$t,n.flipY=!1,this.textures.set(e.id,n)),n.minFilter=n.magFilter=e.filter==="neighbor"?bt:Ct,n.image=t,n.needsUpdate=!0,this.renderer.initTexture(n),n.userData.videoBytes=i,this.textureBytes+=i-r,this.videoUploads=(this.videoUploads||0)+1,!0}finally{t==null||t.close()}}async loadStage(e,t){var r;if(!((r=e==null?void 0:e.model)!=null&&r.path)||this.closed)return!1;const{ModelStage:i}=await No(async()=>{const{ModelStage:a}=await import("./model-stage-BiLw1IvL.js");return{ModelStage:a}},__vite__mapDeps([3,1,2]),import.meta.url);if(this.closed)return!1;const n=await i.load(e,t,this.renderer,{textureBudget:Math.min(32*1024*1024,this.limit-this.textureBytes)});return this.closed?(n==null||n.close(),!1):(this.model=n,this.textureBytes+=(n==null?void 0:n.textureBytes)||0,!!n)}render(e,{width:t=960,height:i=540,restoreAssets:n=null}={}){var l,c,h,f,u,d,m,x,g,p,M;if(this.closed)return;if(this.lost)throw Error("Graphics context was lost. Start the match again from your library.");(this.canvas.width!==t||this.canvas.height!==i)&&this.renderer.setSize(t,i,!1);const r=new Set(["@white","@spark"]);for(const T of e.draws||[])T.texture&&r.add(T.texture),T.indexed&&T.palette&&r.add(T.palette);for(const T of e.assets||[])r.has(T.id)&&this.upload(T,r);let a=[...r].filter(T=>!this.textures.has(T));if(a.length&&n){for(const T of n(a)||[])r.has(T.id)&&this.upload(T,r);a=a.filter(T=>!this.textures.has(T))}for(const T of r){const b=this.textures.get(T);b&&(this.textures.delete(T),this.textures.set(T,b))}this.missingFrameTextures=a.length,this.missingPaletteDraws=0,this.grid.visible=!!e.grid,this.grid.material.uniforms.ground.value=e.ground||450;const o=e.draws.concat((e.sparks||[]).map(T=>{const b=(12-T.age)*.3+1;return{texture:"@spark",indexed:!1,width:8,height:8,matrix:[b,0,0,b,T.x-4*b,T.y-4*b],blend:{mode:"add",source:1,destination:1},alpha:(12-T.age)/12}}));for(let T=0;T<Math.max(o.length,this.slots.length);T++){if(T>=o.length){this.slots[T].visible=!1;continue}const b=o[T],R=this.slot(T),S=R.material.uniforms;R.visible=!0,R.layers.set((b.pass??1)+1);const _=this.resolveDrawTextures(b);if(!_){b.indexed&&this.textures.has(b.texture)&&this.missingPaletteDraws++,R.visible=!1;continue}if(S.image.value=_.image,S.palette.value=_.palette,S.indexed.value=!!b.indexed,S.maskZero.value=b.mask!==!1,S.size.value[0]=b.width,S.size.value[1]=b.height,S.warped.value=!!b.warp,b.warp){for(let k=0;k<4;k++)S.warpEdges.value[k]=b.warp[k];S.warpBounds.value[0]=Math.min(...b.warp),S.warpBounds.value[1]=Math.max(...b.warp)}S.opacity.value=b.alpha??1,S.coefficients.value[0]=((l=b.blend)==null?void 0:l.source)??1,S.coefficients.value[1]=((c=b.blend)==null?void 0:c.destination)??0;const[E,O,I,D,U,$]=b.matrix;R.matrix.set(E,I,0,U,O,D,0,$,0,0,1,0,0,0,0,1),R.matrixWorldNeedsUpdate=!0,R.userData.clip=b.clip,R.material.blendEquation=((h=b.blend)==null?void 0:h.mode)==="subtract"?rh:Di;const A=b.palFX||[];S.fxCount.value=Math.min(8,A.length);for(let k=0;k<S.fxCount.value;k++){const X=A[k],H=X.sinadd||[],ne=H[3]?Math.sin(2*Math.PI*(X.age||0)/H[3]):0;S.fxColorInvert.value[k*2]=(X.color??256)/256,S.fxColorInvert.value[k*2+1]=X.invertall?1:0;for(let q=0;q<3;q++)S.fxAdd.value[k*3+q]=(((f=X.add)==null?void 0:f[q])||0)+(H[q]||0)*ne,S.fxMul.value[k*3+q]=(((u=X.mul)==null?void 0:u[q])??256)/256,S.fxPost.value[k*3+q]=((d=X.postadd)==null?void 0:d[q])||0}}if(this.renderer.setScissorTest(!1),this.model&&e.model){this.renderer.autoClear=!1,this.renderer.clear(),this.model.update(e.model);for(const T of[-1,0,1,2])T<1&&this.model.render(T),T===2&&this.model.render(1),this.camera.layers.set(T+1),this.renderer.render(this.scene,this.camera),this.renderer.setScissorTest(!1);this.renderer.autoClear=!0}else this.camera.layers.enableAll(),this.renderer.render(this.scene,this.camera);return this.renderer.setScissorTest(!1),this.frames++,this.stats={backend:"Kenjatime Core · Three.js",frames:this.frames,draws:o.length,textureBytes:this.textureBytes,textures:this.textures.size,textureEvictions:this.evictedTextures,deferredTextures:this.deferredTextures,missingFrameTextures:this.missingFrameTextures||0,missingPaletteDraws:this.missingPaletteDraws||0,indexedTextureBytes:((m=this.textureBreakdown)==null?void 0:m.indexed)||0,paletteTextureBytes:((x=this.textureBreakdown)==null?void 0:x.palette)||0,truecolorTextureBytes:((g=this.textureBreakdown)==null?void 0:g.rgba)||0,indexedRawBytesSaved:(((p=this.textureBreakdown)==null?void 0:p.indexed)||0)*3,width:t,height:i,videoUploads:this.videoUploads||0,model:!!this.model,shadowUpdates:((M=this.model)==null?void 0:M.shadowUpdates)||0},this.stats}close(){var e;if(!this.closed){this.closed=!0,(e=this.model)==null||e.close(),this.canvas.removeEventListener("webglcontextlost",this.contextLost);for(const t of this.textures.values())t.dispose();for(const t of this.slots)t.material.dispose();this.grid.material.dispose(),this.geometry.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.textures.clear()}}}const Mr=60,Na=1e6;class Bv{constructor({maxTicks:e=12}={}){if(!Number.isInteger(e)||e<1||e>1024)throw Error("Invalid maximum simulation ticks per callback.");this.maxTicks=e,this.reset()}reset(){this.tickCount=0,this.lastRender=null,this.suspend()}suspend(){this.last=null,this.lastUs=null,this.epochUs=null,this.elapsedUs=0,this.epochTicks=0,this.speed=null,this.debt=0,this.lastRender=null}advance(e,{running:t=!0,speed:i=1}={},n=()=>{}){if(!Number.isFinite(e)||!Number.isFinite(i)||i<=0)throw Error("Invalid frame clock time or speed.");const r=Math.round(e*1e3);if(!Number.isSafeInteger(r))throw Error("Frame clock timestamp is out of range.");const a=this.lastUs===null?r:Math.max(this.lastUs,r);if(!t)return this.suspend(),this.lastUs=a,this.epochUs=a,this.speed=i,this.last=a/1e3,0;if(this.lastUs===null||this.speed!==i)return this.suspend(),this.lastUs=a,this.epochUs=a,this.speed=i,this.last=a/1e3,0;const o=a-this.lastUs;this.lastUs=a,this.last=a/1e3,this.elapsedUs+=o*i;const l=Math.floor(this.elapsedUs*Mr/Na),c=Math.min(this.maxTicks,Math.max(0,l-this.epochTicks));for(let h=0;h<c;h++){const f=this.epochTicks+1,u=this.epochUs+Math.ceil(f*Na/(Mr*i));n(u/1e3),this.epochTicks++,this.tickCount++}return this.debt=Math.max(0,this.elapsedUs*Mr/Na-this.epochTicks),c}renderDue(e,t=60){return this.lastRender===null||e-this.lastRender>=1e3/t-.25?(this.lastRender=e,!0):!1}}class kv{constructor(e,t=globalThis){this.callback=e,this.host=t,this.handle=null,this.timer=!1}schedule({timer:e=!1,catchUp:t=!1,idle:i=!1}={}){this.cancel(),this.timer=e||t||i||typeof this.host.requestAnimationFrame!="function";const n=r=>{this.handle=null,this.callback(r)};this.handle=this.timer?this.host.setTimeout(()=>n(this.host.performance.now()),t?0:i?100:1e3/60):this.host.requestAnimationFrame(n)}cancel(){this.handle!==null&&(this.timer?this.host.clearTimeout(this.handle):this.host.cancelAnimationFrame(this.handle),this.handle=null)}}class zv{constructor({minScale:e=.5,maxScale:t=1,windowMs:i=1500}={}){this.minScale=e,this.maxScale=t,this.windowMs=i,this.reset()}reset(){this.scale=this.maxScale,this.suspend()}suspend(){this.first=null,this.frames=0,this.cpuMs=0,this.lastFps=null}observe(e,t,{eligible:i=!0}={}){if(!i||!Number.isFinite(e)||!Number.isFinite(t))return this.suspend(),this.scale;if(this.first===null)return this.first=e,this.frames=1,this.cpuMs=t,this.scale;this.frames++,this.cpuMs+=t;const n=e-this.first;if(n<this.windowMs)return this.scale;const r=(this.frames-1)*1e3/Math.max(n,1),a=this.cpuMs/this.frames;return this.lastFps=r,r<42||a>18?this.scale=Math.max(this.minScale,this.scale-.1):r<53||a>15?this.scale=Math.max(this.minScale,this.scale-.07):r<57?this.scale=Math.max(this.minScale,this.scale-.03):r>=59.2&&a<11&&(this.scale=Math.min(this.maxScale,this.scale+.02)),this.scale=Math.round(this.scale*100)/100,this.first=null,this.frames=0,this.cpuMs=0,this.scale}}function Hv(s){let e,t,i=!1,n=!1,r=!1,a=!0,o=!1,l=!0,c=-1/0,h=1,f="auto",u,d,m,x=1,g=!0,p=!1;const M=new Bv,T=[new Sl,new Sl],b=new Map,R=new Set,S=new Map,_=new zv,E=new Map,O=new Set;function I(){var z,ie;const B=e==null?void 0:e.match.stage;if(!B)return;const ae=e.match,be=((z=ae.superPause)==null?void 0:z.remaining)>0||((ie=ae.pause)==null?void 0:ie.remaining)>0&&ae.pause.pausebg!==0;for(const he of B.elements)if(he.video){const Te={type:"video-control",id:he.video.key,playing:!r&&!be&&he.enabled&&!O.has(he.video.key),visible:he.visible,captureVisible:!o,epoch:B.generation||0},se=JSON.stringify(Te),Ae=E.get(Te.id);(Ae==null?void 0:Ae.signature)!==se&&(Te.reset=Ae&&Ae.epoch!==Te.epoch,E.set(Te.id,{signature:se,epoch:Te.epoch}),s(Te))}}const D=new kv(X),U=()=>D.schedule({timer:o||!l,catchUp:!r&&M.debt>=1,idle:r});function $(B){const ae=new Float32Array(B);if(ae.fill(0),m&&!r&&!p){let be=0;for(;be<ae.length/2;){let z=m.read(Math.min(2048,ae.length/2-be));if(!z&&(!g||(m.seek(0),z=m.read(Math.min(2048,ae.length/2-be)),!z)))break;ae.set(new Float32Array(m.pcm.buffer,m.pcm.byteOffset,z*2),be*2),be+=z}if(x!==1)for(let z=0;z<ae.length;z++)ae[z]*=x}u==null||u.postMessage({buffer:B},[B])}function A(){var B,ae,be;for(const z of e.drainEvents()){if(z.type==="playsnd")try{const ie=e.characters.find(Ae=>Ae.path===z.character),he=z.common?e.commonEffects.soundPath:(B=ie==null?void 0:ie.checks.find(Ae=>Ae.key==="sound"&&Ae.ok))==null?void 0:B.path;if(!he){z.common&&e.issue("common-sound","Common sound requested, but the imported pack has no common.snd.");continue}b.has(he)||b.set(he,Cu(e.files[he]));const Te=z.group??((ae=z.value)==null?void 0:ae[0]),se=z.number??((be=z.value)==null?void 0:be[1]);if(z.soundKey=he+":"+Te+","+se,S.set(z.soundKey,{path:he,group:Te,number:se}),!R.has(z.soundKey)){const Ae=b.get(he).get(Te,se);if(!Ae)continue;z.bytes=Ae.slice(),R.add(z.soundKey)}}catch(ie){e.issue("sound",ie.message);continue}s({type:"sound",event:z},z.bytes?[z.bytes.buffer]:[])}}function k(){const B=e.match.entities.some(ae=>!ae.destroyed&&ae.asserted.has("nomusic"));B!==p&&(p=B,s({type:"music-suppression",value:B}))}function X(B){if(!i)try{if(M.advance(B,{running:!r},ae=>{const be=performance.timeOrigin+ae;e.tick(T[0].sample(be),T[1].sample(be)),k(),A()}),I(),!o&&M.debt<1&&(!r||a)&&M.renderDue(B,60)){const ae=performance.now(),be=e.frame();t.render(be,{width:Math.round(960*h),height:Math.round(540*h),restoreAssets:ie=>e.restoreAssets(ie)});const z=performance.now()-ae;t.stats&&(t.stats.frameCpuSubmitMs=z),a=!1,f==="auto"&&(h=_.observe(B,z,{eligible:!be.assets.length&&!r&&!o&&l}))}B-c>=100&&(c=B,s({type:"state",state:{...e.snapshot(),paused:r,background:o,focused:l,simulationDebt:M.debt,simulationHz:Mr,simulationTicks:M.tickCount,simulationBacklogTicks:Math.floor(M.debt),resolutionScale:h},gpu:t.stats})),U()}catch(ae){s({type:"error",message:ae.message}),q()}}async function H({files:B,selection:ae,canvas:be,sampleRate:z=48e3,quality:ie="auto"}){var Ae,C,N,ye,Ne;if(f=ie,t||ee(be),e=new Sd(B,ae),await e.initializeScripts(),i)return;try{e.modelReady=await t.loadStage((Ae=e.match.stage)==null?void 0:Ae.definition,B)}catch(oe){i||e.issue("stage-model",oe.message)}if(i)return;let he=0;const Te=new Set;for(const oe of((C=e.match.stage)==null?void 0:C.elements)||[])if((N=oe.video)!=null&&N.path){const Ie=Te.has(oe.video.path)?null:(ye=B[oe.video.path])==null?void 0:ye.slice();if(Ie&&(he+=Ie.length),he>64*1024*1024){O.add(oe.video.key),e.issue("stage-video","Stage video source budget (64 MiB) exceeded.");continue}Te.add(oe.video.path),s({type:"video-init",id:oe.video.key,...oe.video,bytes:Ie},Ie?[Ie.buffer]:[])}const se=(Ne=e.match.stage)==null?void 0:Ne.definition.music;if(se!=null&&se.path&&B[se.path])if(/\.(mod|xm|it|s3m)$/i.test(se.path)){const{createModuleMusic:oe}=await No(async()=>{const{createModuleMusic:Oe}=await import("./module-music-C2Wy91BT.js");return{createModuleMusic:Oe}},[],import.meta.url);if(i)return;const Ie=await oe();if(i){Ie.close();return}d=Ie,m=d.open(B[se.path],z),x=Math.max(0,Math.min(2,se.volume/100)),g=se.loop,s({type:"audio-init",sampleRate:z})}else{const oe=B[se.path].slice();s({type:"music",bytes:oe,path:se.path,volume:se.volume,loop:se.loop},[oe.buffer])}i||(n=!0,s({type:"ready",capabilities:e.capabilities}),U())}function ne(B){var ae,be,z;if(i){B.type==="video-frame"&&((ae=B.bitmap)==null||ae.close());return}if(B.type==="video-frame"){try{t.updateVideo(B)&&e.videoSprites.set(B.id,{id:B.id,w:B.sourceWidth,h:B.sourceHeight,x:0,y:0,indexed:!1}),a=!0}catch(ie){O.add(B.id),e.issue("stage-video",ie.message)}s({type:"video-ack",id:B.id});return}if(B.type==="media-warning"){e==null||e.issue("stage-video",String(B.message));return}if(B.type==="visibility"){o=!!B.hidden,l=B.focused!==!1,o||(a=!0),_.suspend(),n&&I(),n&&U();return}if(B.type==="release-inputs"){T.forEach(ie=>ie.reset());return}if(B.type==="sound-request"){try{const ie=S.get(B.key),he=ie&&((z=(be=b.get(ie.path))==null?void 0:be.get(ie.group,ie.number))==null?void 0:z.slice());if(!he)throw Error("Sound is unavailable.");s({type:"sound-data",key:B.key,bytes:he},[he.buffer])}catch(ie){s({type:"sound-data",key:B.key,error:ie.message})}return}if(B.type==="input"&&Array.isArray(B.keys)&&T[B.side===1?1:0].record(B.source||"keyboard",B.keys,B.time??performance.timeOrigin+performance.now()),B.type==="pause"&&(r=!!B.value,T.forEach(ie=>ie.reset()),M.suspend(),_.suspend(),a=!0,n&&U()),B.type==="presentation"){e&&e.setPresentation(Da(B.value)),a=!0,n&&U();return}B.type==="quality"&&(f=B.value,h=1,_.reset(),a=!0),B.type==="audio-port"&&(u=B.port,u.onmessage=({data:ie})=>{!i&&ie.buffer instanceof ArrayBuffer&&ie.buffer.byteLength===8192&&$(ie.buffer)},u.start()),B.type==="stop"&&q()}function q(){i||(i=!0,D.cancel(),u==null||u.close(),d==null||d.close(),e==null||e.close(),t==null||t.close(),u=d=m=e=t=null,b.clear(),R.clear(),S.clear(),T.forEach(B=>B.reset()))}function ee(B){if(i)throw Error("Match cancelled.");t||(t=new Ov(B))}return{start:H,prepare:ee,control:ne,stop:q,snapshot:()=>e==null?void 0:e.snapshot(),get gpu(){return t==null?void 0:t.stats}}}const hx=Object.freeze(Object.defineProperty({__proto__:null,createCoreRuntime:Hv},Symbol.toStringTag,{value:"Module"}));export{Mc as $,ut as A,Ti as B,Ke as C,ax as D,Kv as E,Mp as F,ri as G,Jv as H,Zv as I,Uh as J,jv as K,jn as L,ex as M,ks as N,xt as O,rx as P,yi as Q,Ya as R,ti as S,Gv as T,Qv as U,st as V,Vs as W,ii as X,qv as Y,jo as Z,Dh as _,Xv as a,Zf as a0,Pr as a1,wo as a2,It as a3,Gh as a4,Ko as a5,Zo as a6,nt as a7,pn as a8,Is as a9,sn as aa,Vi as ab,tx as ac,bi as ad,ni as ae,Yv as af,xp as ag,Of as ah,ys as ai,Ol as aj,Fl as ak,Ul as al,nx as am,Yn as an,si as ao,ta as ap,cx as aq,Xd as ar,qd as as,gr as at,hx as au,Wv as b,ox as c,ws as d,sx as e,Qe as f,Y as g,lc as h,ix as i,lx as j,Hi as k,$v as l,Nh as m,Oi as n,na as o,Wd as p,Ct as q,bt as r,$a as s,$t as t,tp as u,_n as v,ep as w,ap as x,fi as y,Yf as z};
