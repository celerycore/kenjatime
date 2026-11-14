const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index-BZdoyIol.js","./core-CUwnSZF0.js","./core-DJfXUo-H.css","./model-stage-DypuxApQ.js"])))=>i.map(i=>d[i]);
import{f as mr,g as uu,h as du,r as fu,c as No,i as Er,j as pu,S as mu,k as gu,F as vl,l as _u,m as vu,o as xu,q as yu,t as Gt,v as th,w as Kr,x as Su,E as Zr,y as xl,z as yl,B as vn,U as Mu,_ as Do,C as Ua,D as bu,G as Eu,H as Tu,J as wu,K as Au,L as Sl,N as Ru,O as Cu,P as Pu,Q as Iu,R as Lu,T as Nu,V as Ml,W as bl,X as Du,Y as El}from"./core-CUwnSZF0.js";const Uu=Object.freeze({id:"mugen-1.1",reference:"Elecbyte M.U.G.E.N 1.1 Beta 1 P1 (2013)",status:"target-unverified",certified:!1,referenceStrategy:"black-box golden traces from lawful local reference runs",extendedDialect:"ikemen-go"});function Fu(n){var i,s;const e=(s=(i=n==null?void 0:n.def)==null?void 0:i.info)==null?void 0:s.mugenversion;return e==null?null:String(e).trim()||null}function Ou(n,e=new Map){if(!Array.isArray(n))throw Error("Compatibility report requires a character list.");return{...Uu,characters:n.map(t=>{const i=e.get(t),s=(i==null?void 0:i.diagnostics)||[],r=(i==null?void 0:i.sources)||[];return{path:(t==null?void 0:t.path)||null,declaredMugenVersion:Fu(t),cnsStateFiles:r.filter(a=>/\.(?:cns|cmd)$/i.test(a)).length,ikemenZssFiles:r.filter(a=>/\.zss$/i.test(a)).length,fatalDiagnostics:s.filter(a=>a.fatal===!0).length,duplicateGlobalStates:s.filter(a=>a.type==="mugen11-duplicate-global").length,unsupportedDiagnostics:s.filter(a=>/^unsupported/.test(a.type||"")||a.type==="missing-file").length,traceVerified:!1}})}}const xn=(n,e=[0,0])=>Array.isArray(n)?[Number(n[0]??e[0]),Number(n[1]??e[1])]:n===void 0?[...e]:[Number(n),e[1]];class Bu extends Map{constructor(e){super(),this.base=e}get(e){var t;return super.has(e)?super.get(e):(t=this.base)==null?void 0:t.get(e)}has(e){var t;return super.has(e)||!!((t=this.base)!=null&&t.has(e))}}class is{constructor(e,t,{id:i}={}){var o;this.creator=e,this.owner=e.root||e,this.root=this.owner,this.isProjectile=!0,this.world=e.world,this.id=i,this.projId=Math.max(0,Math.trunc(t.projid??0)),this.teamSide=e.teamSide,this.character=e.character,this.coordinateScale=e.coordinateScale,this.baseCoordinateScale=this.coordinateScale,this.paletteParent=mr(e),this.guardDistance=e.constant("size.proj.attack.dist")*e.coordinateScale,this.animations=e.animations,this.program={...e.program,constants:new Bu(e.program.constants)},this.spec=t,this.events=[],this.diagnostics=[],this.asserted=new Set,Number(t.projid)<0&&this.diagnostic("projectile-id","Negative ProjID was clamped to 0."),Object.assign(this,uu(e,t,!0));const s=xn(t.projscale,[1,1]),r=e.constant("size.proj.doscale")!==0;this.program.constants.set("size.xscale",s[0]*(r?e.constant("size.xscale"):1)),this.program.constants.set("size.yscale",s[1]*(r?e.constant("size.yscale"):1)),this.program.constants.set("size.draw.offset.x",0),this.program.constants.set("size.draw.offset.y",0);const a=xn(t.velocity);if(this.vel={x:a[0]*this.coordinateScale,y:a[1]*this.coordinateScale},this.accel=xn(t.accel).map(l=>l*this.coordinateScale),this.velmul=xn(t.velmul,[1,1]),this.heightBounds=xn(t.projheightbound,[-240/this.coordinateScale,1/this.coordinateScale]).map(l=>l*this.coordinateScale),this.edgeBound=(t.projedgebound??40/this.coordinateScale)*this.coordinateScale,this.stageBound=(t.projstagebound??40/this.coordinateScale)*this.coordinateScale,this.removeTime=t.projremovetime??-1,this.anim=Math.trunc(t.projanim??0),this.frameIndex=0,this.frameTime=0,this.collisionFrame=null,this.hitDef=t.hitDef,this.proximityHitDef=t.hitDef,this.hitPauseTime=0,this.hitCount=0,this.moveType="A",this.stateType=(((o=this.hitDef)==null?void 0:o.attr)||"S")[0].toUpperCase(),this.priority=Math.max(1,Math.trunc(t.projpriority??1)),this.sprPriority=t.projsprpriority??3,this.remainingHits=Math.max(0,Math.trunc(t.projhits??1)),this.missTime=Math.max(0,Math.trunc(t.projmisstime??0)),this.pauseMoveTime=Math.max(0,t.pausemovetime||0),this.superMoveTime=Math.max(0,t.supermovetime||0),this.ownPal=!!t.ownpal,this.time=0,this.removing=!1,this.removed=!1,this.activeTicks=0,this.nextHitAge=0,this.drawVisible=!0,this._inTick=!1,this._paletteRemaps=du(e.paletteRemaps),this.ownPal&&t.remappal!==void 0)try{fu(this._paletteRemaps,this.character,t.remappal)}catch(l){this.diagnostic("palette",l.message)}this.attackMultiplier=e.attackMultiplier,this.animations.has(this.anim)||(this.diagnostic("missing-animation",`Projectile animation ${this.anim} does not exist.`),this.removed=!0)}get currentFrame(){var e;return((e=this.animations.get(this.anim))==null?void 0:e.frames[this.frameIndex])||null}get life(){return this.removed||this.removing?0:1}get power(){return this.owner.power}set power(e){this.owner.power=e}get maxPower(){return this.owner.maxPower}get targets(){return this.owner.targets}get targetHitIds(){return this.owner.targetHitIds}get paletteRemaps(){return this.ownPal?this._paletteRemaps:this.paletteParent.paletteRemaps}constant(e){const t=this.program.constants.get(e);return Array.isArray(t)?t[0]:t}changeState(){return this.diagnostic("unsupported-projectile","A projectile cannot enter a player state."),!1}diagnostic(e,t){this.diagnostics.some(i=>i.message===t)||this.diagnostics.push({type:e,message:t,source:this.spec.source,line:this.spec.line})}record(e){var i;const t=this.owner.projectileHistory;t.push({type:e,projId:this.projId,tick:((i=this.world)==null?void 0:i.ticks)??this.time});for(let s=t.length-2;s>=0;s--)t[s].type===e&&t[s].projId===this.projId&&t.splice(s,1);t.length>4096&&(t.shift(),this.diagnostic("resource-limit","Projectile history exceeded 4096 distinct ID/event pairs."))}canHit(){return!this.removed&&!this.removing&&!!this.hitDef&&this.activeTicks>=this.nextHitAge&&this.remainingHits>0}onContact({guarded:e=!1,defer:t=!1}={}){this.record(e?"guarded":"hit"),this._contactPending=!0,this.hitPauseTime>0&&(this._holdCollisionFrame=!0),t||this.finishContacts()}finishContacts(){var e;this._contactPending&&(this._contactPending=!1,this.remainingHits--,this.nextHitAge=this.activeTicks+((e=this.world)!=null&&e.orderedPhases?Math.max(1,this.missTime):this.missTime+1),this.spec.projremove!==0&&this.remainingHits<=0&&this.remove("hit"))}cancel(){!this.removing&&!this.removed&&(this.record("cancel"),this.hitPauseTime=0,this.remove("cancel"))}clash(e){var t,i;this.priority>e.priority?this.priority--:this.remainingHits--,this.remainingHits<=0?this.cancel():this.hitPauseTime=Math.max(this.hitPauseTime,((i=(t=this.hitDef)==null?void 0:t.pauseTime)==null?void 0:i[0])||0)}remove(e="expire"){if(!(this.removing||this.removed)){if(this.removing=!0,this.hitDef=null,this.removalReason=e,this._removeAtLoopEnd=this._loopedThisTick,this.hitPauseTime>0){this._holdCollisionFrame=!0;return}this.beginRemoval()}}beginRemoval(){var l;this.removalStarted=!0;const e=this.removalReason,t=this.spec.projhitanim??-1,i=this.spec.projremanim??t,s=e==="hit"?t:e==="cancel"?this.spec.projcancelanim??i:i,r=xn(this.spec.remvelocity);if(this.vel={x:r[0]*this.coordinateScale,y:r[1]*this.coordinateScale},s<0){this.removed=!0,this.drawVisible=!1;return}let a=!1;if(this.animations.has(s)?Math.trunc(s)!==this.anim&&(a=!0,this._loopedThisTick=!1,this.anim=Math.trunc(s),this.frameIndex=this.frameTime=0):this.diagnostic("missing-animation",`Projectile removal animation ${s} does not exist; retaining action ${this.anim}.`),(a||!this.collisionFrame)&&(this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime),!a&&this._removeAtLoopEnd&&this._inTick){this.removed=!0,this.drawVisible=!1;return}const o=((l=this.animations.get(this.anim))==null?void 0:l.frames)||[];if(o.some(c=>c.ticks<0)||o.reduce((c,h)=>c+h.ticks,0)<=0){this.removed=!0,this.drawVisible=!1;return}this.drawVisible=!!this.collisionFrame,a&&!this._inTick?this.advanceFrame():!a&&!this._inTick&&this._loopedThisTick&&(this.removed=!0)}advanceFrame(){const e=this.currentFrame,t=this.animations.get(this.anim);e&&e.ticks>=0&&++this.frameTime>=Math.max(1,e.ticks)&&(this.frameTime=0,this.frameIndex++,this.frameIndex>=t.frames.length&&(this._loopedThisTick=!0,this.animationLooped=!0,this.removing&&(this.removed=!0),this.frameIndex=t.loopStart||0))}tick({paused:e=!1}={}){var t,i,s;if(this.events=[],this._activeThisTick=!1,this.removed){this.drawVisible=!1;return}if(!e){if(this.drawVisible=!0,this._holdCollisionFrame||this.captureFrame(),this.hitPauseTime>0){this.hitPauseTime--;return}if(this._holdCollisionFrame=!1,this._inTick=!0,this._loopedThisTick=!1,this.removing&&!this.removalStarted&&this.beginRemoval(),!this.removing){const r=this.heightBounds,a=this.edgeBound,o=this.stageBound,l=((t=this.world)==null?void 0:t.leftBound)??-160,c=((i=this.world)==null?void 0:i.rightBound)??160,h=(s=this.world)==null?void 0:s.view,f=(h==null?void 0:h.left)??l,d=(h==null?void 0:h.right)??c,u=this.removeTime,m=this.vel.x*this.facing;(u>=0&&this.time>=u||u<=-2&&this.animationLooped||this.pos.x<f-a||this.pos.x>d+a||m<0&&this.pos.x<l-o||m>0&&this.pos.x>c+o||this.vel.y<0&&this.pos.y<r[0]||this.vel.y>0&&this.pos.y>r[1])&&this.remove()}this.removed||(this.captureFrame(),this._activeThisTick=!0,this.activeTicks++,this.pos.x+=this.vel.x*this.facing,this.pos.y+=this.vel.y,this.removing||(this.vel.x=(this.vel.x+this.accel[0])*this.velmul[0],this.vel.y=(this.vel.y+this.accel[1])*this.velmul[1]),this.advanceFrame(),this.time++),this._inTick=!1}}finishMovementAllowance({paused:e=!1}={}){var t,i,s;if(!(e||!this._activeThisTick||this._hitPausedThisTick||this.hitPauseTime>0)){if((t=this.world)!=null&&t.orderedPhases){((i=this.world.pause)==null?void 0:i.remaining)>0&&(this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1)),((s=this.world.superPause)==null?void 0:s.remaining)>0&&(this.superMoveTime=Math.max(0,this.superMoveTime-1));return}this.pauseMoveTime=Math.max(0,this.pauseMoveTime-1),this.superMoveTime=Math.max(0,this.superMoveTime-1)}}captureFrame(){this.collisionFrame=this.currentFrame,this.collisionAnimation=this.animations.get(this.anim),this.collisionFrameIndex=this.frameIndex,this.collisionFrameTime=this.frameTime}}const ku=n=>{if(n[0].life<=0&&n[1].life<=0)return"draw";if(n[0].life<=0)return"opponent";if(n[1].life<=0)return"player";const e=n[0].life*n[1].maxLife-n[1].life*n[0].maxLife;return e===0?"draw":e>0?"player":"opponent"};class zu{constructor({roundsToWin:e=2,roundTime:t=99,preIntro:i=30,introHold:s=30,overTime:r=60,resultTime:a=90,maxIntroTime:o=900,maxOutroTime:l=300,autoAdvance:c=!0,endless:h=!1,maxNoKOTime:f=180,fightStartLockTicks:d=0}={}){for(const[u,m]of Object.entries({roundsToWin:e,roundTime:t,preIntro:i,introHold:s,overTime:r,resultTime:a,maxIntroTime:o,maxOutroTime:l,maxNoKOTime:f,fightStartLockTicks:d}))if(!Number.isFinite(m)||m<0)throw Error(`Invalid match rule ${u}.`);if(e<1||e>99||t>3600||o>36e3||l>36e3||f<1||f>36e3||d>36e3)throw Error("Match rule exceeds supported bounds.");this.rules={roundsToWin:Math.trunc(e),roundTime:t,preIntro:Math.trunc(i),introHold:Math.trunc(s),overTime:Math.trunc(r),resultTime:Math.trunc(a),maxIntroTime:Math.trunc(o),maxOutroTime:Math.trunc(l),maxNoKOTime:Math.trunc(f),fightStartLockTicks:Math.trunc(d),autoAdvance:c,endless:h===!0},this.roundNo=1,this.roundsExisted=0,this.wins={player:0,opponent:0},this.matchOver=!1,this.roundWinner=null,this.reason=null,this.startRound()}startRound(){this.roundState=0,this.phaseTime=0,this.timeLeft=this.rules.endless?-1:this.rules.roundTime?Math.round(this.rules.roundTime*60):-1,this.roundWinner=null,this.reason=null,this._awarded=!1,this.zeroLifeNoKOTicks=[0,0]}step({players:e,paused:t=!1,intro:i=!1,introPending:s=!1,victoryPending:r=!1,roundNotOver:a=!1,timerFreeze:o=!1,noKO:l=[!1,!1]}={}){const c=[];if(t)return c;if(this.roundState===0)return this.phaseTime++,this.phaseTime<this.rules.preIntro||s&&this.phaseTime<this.rules.maxIntroTime||(this.roundState=1,this.phaseTime=0,c.push({type:"round",roundNo:this.roundNo})),c;if(this.roundState===1)return this.phaseTime++,this.phaseTime>=this.rules.introHold&&(!i||this.phaseTime>=this.rules.maxIntroTime)&&(this.roundState=2,this.phaseTime=0,c.push({type:"fight",roundNo:this.roundNo})),c;if(this.roundState===2){if(this.phaseTime++,this.phaseTime<=this.rules.fightStartLockTicks)return c;const h=e.some((f,d)=>f.life>0?(this.zeroLifeNoKOTicks[d]=0,!1):l[d]?(this.zeroLifeNoKOTicks[d]++,this.zeroLifeNoKOTicks[d]>=this.rules.maxNoKOTime):(this.zeroLifeNoKOTicks[d]=0,!0));return!o&&this.timeLeft>0&&this.timeLeft--,(h||this.timeLeft===0)&&(this.roundWinner=ku(e),this.reason=h?e.every(f=>f.life<=0)?"double-ko":"ko":"time",this.roundState=3,this.phaseTime=0,c.push({type:"round-over",winner:this.roundWinner,reason:this.reason})),c}if(this.roundState===3)return this.phaseTime++,a&&this.phaseTime<this.rules.maxOutroTime||this.phaseTime>=this.rules.overTime&&(!this._awarded&&this.roundWinner!=="draw"&&(this.wins[this.roundWinner]++,this._awarded=!0),this.matchOver=!this.rules.endless&&Object.values(this.wins).some(h=>h>=this.rules.roundsToWin),this.roundState=4,this.phaseTime=0,c.push({type:"result",winner:this.roundWinner,reason:this.reason,matchOver:this.matchOver})),c;if(this.roundState===4&&!this.matchOver&&this.rules.autoAdvance){this.phaseTime++;const h=this.phaseTime>=this.rules.resultTime,f=!r&&!a||this.phaseTime>=this.rules.maxOutroTime;h&&f&&(this.roundNo++,this.roundsExisted++,this.startRound(),c.push({type:"next-round",roundNo:this.roundNo}))}return c}}const Ht=["a","b","c","x","y","z","s"],ms=["U","D","B","F","UB","UF","DB","DF"],Hu=new Set(["U","D","L","R",...Ht]),Tr=3600,Tl=128,wl=4096;function Vu(n){let e=null;for(let t=0;t<n.length;t++){const i=n[t];if((i==='"'||i==="'")&&(!e||e===i))e=e?null:i;else if(i===";"&&!e)return n.slice(0,t).trim()}return n.trim()}function Jr(n){const e=n.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);return e?e[1]??e[2]:n}function Gu(n){let e=n.replace(/\s/g,"");if(!e)throw Error("Empty command symbol.");const t={source:n,strict:!1,hold:!1,release:!1,charge:0,tolerant:!1},i=new Set;for(;/^[>\/~$]/.test(e);){const r=e[0];if(i.has(r))throw Error(`Repeated ${r} modifier in ${n}.`);if(i.add(r),e=e.slice(1),r===">"&&(t.strict=!0),r==="/"&&(t.hold=!0),r==="$"&&(t.tolerant=!0),r==="~"){t.release=!0;const a=e.match(/^\d+/);if(a){if(t.charge=Number(a[0]),!Number.isSafeInteger(t.charge)||t.charge>Tr)throw Error(`Charge duration exceeds the ${Tr}-tick runtime limit.`);e=e.slice(a[0].length)}}}if(t.hold&&t.release)throw Error(`Hold and release cannot be combined in ${n}.`);const s=e.split("+");if(s.some(r=>!r)||new Set(s).size!==s.length)throw Error(`Invalid simultaneous input ${n}.`);if(s.length===1&&ms.includes(s[0]))t.kind="direction",t.keys=s,t.key=(t.tolerant?"$":"")+s[0];else if(s.every(r=>Ht.includes(r))){if(t.tolerant)throw Error(`The $ modifier is only valid on directions: ${n}.`);t.kind="button",t.keys=s}else if(s.filter(r=>ms.includes(r)).length===1&&s.every(r=>ms.includes(r)||Ht.includes(r)))t.kind="chord",t.keys=s.map(r=>ms.includes(r)&&t.tolerant?"$"+r:r);else throw Error(`Unsupported command symbol ${n}. Directions are uppercase and buttons are lowercase.`);return t}function Wu(n){const e=n.split(",").map(Gu),t=[];for(const i of e){const s=t.at(-1);(s==null?void 0:s.kind)==="direction"&&i.kind==="direction"&&s.key===i.key&&!s.hold&&!s.release&&!i.hold&&!i.release?(t.push({...i,source:`>~${i.key}`,strict:!0,release:!0,charge:0}),t.push({...i,strict:!0})):t.push(i)}if(t.length>Tl)throw Error(`Command exceeds the ${Tl}-symbol runtime limit.`);return t}function Uo(n){const e=[];let t;for(const[c,h]of String(n).replace(/^\uFEFF|^ï»¿/,"").split(/\r?\n/).entries()){const f=Vu(h),d=f.match(/^\[([^\]]+)\]$/);if(d)t={name:d[1].trim().toLowerCase(),line:c+1,values:{}},e.push(t);else if(t){const u=f.indexOf("=");u>0&&(t.values[f.slice(0,u).trim().toLowerCase()]=f.slice(u+1).trim())}}const i=[],s={time:15,bufferTime:1},r=Object.fromEntries(Ht.map(c=>[c,c])),a=(c,h,f=Jr(c.values.name??""))=>{i.push({kind:"command",name:f,line:c.line,message:h})};function o(c,h,f,d,u){if(c==null)return h;if(!/^[-+]?\d+$/.test(c.trim())||!Number.isSafeInteger(Number(c)))throw Error(`${d} must be an integer.`);const m=Math.max(1,Number(c));if(m>u){if(d==="buffer.time"||d==="command.buffer.time")return u;throw Error(`${d} exceeds the ${u}-tick runtime limit.`)}return m}for(const c of e){if(c.name==="defaults")try{s.time=o(c.values["command.time"],s.time,c,"command.time",Tr),s.bufferTime=o(c.values["command.buffer.time"],s.bufferTime,c,"command.buffer.time",30)}catch(h){a(c,h.message)}if(c.name==="remap")for(const[h,f]of Object.entries(c.values)){const d=Jr(f);!Ht.includes(h)||d&&!Ht.includes(d)?a(c,`Unsupported button remap ${h} = ${f}.`):r[h]=d}}const l=[];for(const c of e){if(c.name!=="command")continue;if(l.length>=wl){a(c,`Command count exceeds the ${wl}-command runtime limit.`);break}const{values:h}=c,f=Jr(h.name??"");try{if(!f)throw Error("Command is missing its name.");if(!h.command)throw Error("Command is missing its input sequence.");const d=Wu(h.command);l.push({name:f,command:h.command,sequence:d,time:o(h.time,s.time,c,"time",Tr),bufferTime:o(h["buffer.time"],s.bufferTime,c,"buffer.time",30),line:c.line,holdOnly:d.every(u=>u.hold)})}catch(d){a(c,d.message,f)}}return{commands:l,defaults:s,remap:r,diagnostics:i}}function Xu(n,e,t){const i=new Set;n.has("U")!==n.has("D")&&i.add(n.has("U")?"U":"D"),n.has("L")!==n.has("R")&&i.add(n.has(e<0?"L":"R")?"F":"B");for(const s of Ht)n.has(s)&&t[s]&&i.add(t[s]);return i}function qu(n){const e=new Set(Ht.filter(i=>n.has(i))),t=(n.has("U")?"U":n.has("D")?"D":"")+(n.has("B")?"B":n.has("F")?"F":"");t&&e.add(t);for(const i of ms)[...i].every(s=>n.has(s))&&e.add("$"+i);return e}function Yu(n){return n.kind==="direction"?[n.key]:n.keys}function Fs(n,e){const t=Yu(n);return n.hold?t.every(i=>e.held.has(i)):n.release?t.every(i=>e.released.has(i)&&(e.previousDurations.get(i)??0)>=n.charge):t.every(i=>n.kind==="chord"&&!Ht.includes(i)?e.held.has(i):e.pressed.has(i))}function $u(n){if(n.hold)return[];const e=n.release?"release:":"press:";return n.kind==="chord"?n.keys.filter(t=>Ht.includes(t)||n.release).map(t=>e+(Ht.includes(t)?t:"direction")):n.kind==="direction"?[e+"direction"]:n.keys.map(t=>e+t)}function Al(n,e,t){if(n.kind==="chord"){const i=new Set;for(const s of n.keys)if(Ht.includes(s))for(const r of Ht)t[r]===s&&i.add(r);else for(const r of s.replace("$",""))i.add(r==="F"?e.facing<0?"L":"R":r==="B"?e.facing<0?"R":"L":r);return i}return n.kind==="button"?new Set(Ht.filter(i=>n.keys.includes(t[i]))):new Set([...n.keys[0]].map(i=>i==="F"?e.facing<0?"L":"R":i==="B"?e.facing<0?"R":"L":i))}class xs{constructor(e={commands:[]}){typeof e=="string"&&(e=Uo(e)),this.commands=e.commands??[],this.remap=e.remap??Object.fromEntries(Ht.map(t=>[t,t])),this.diagnostics=[...e.diagnostics??[]],this.historyLimit=Math.max(1,...this.commands.map(t=>t.time+1)),this.reset()}reset(){this.tick=-1,this.history=[],this.buffered=new Map,this.active=new Set,this.previous={raw:new Set,held:new Set,durations:new Map}}update(e,t=1){this.tick++;const i=new Set([...e].filter(l=>Hu.has(l))),s=qu(Xu(i,t,this.remap)),r=this.previous,a={tick:this.tick,raw:i,facing:t,held:s,pressed:new Set([...s].filter(l=>!r.held.has(l))),released:new Set([...r.held].filter(l=>!s.has(l))),previousDurations:r.durations,durations:new Map([...s].map(l=>[l,(r.durations.get(l)??0)+1])),changes:new Set([...i,...r.raw].filter(l=>i.has(l)!==r.raw.has(l)))};this.previous=a,this.history.push(a),this.history.length>this.historyLimit&&this.history.shift(),this.active=new Set;let o=25e4;for(const l of this.commands){if(l.holdOnly){l.sequence.every(h=>Fs(h,a))&&this.active.add(l.name);continue}if(l.sequence.every(h=>!h.hold||Fs(h,a))&&Fs(l.sequence.at(-1),a)&&this.matchSequence(l,()=>--o>=0)&&this.buffered.set(l.name,this.tick+l.bufferTime-1),(this.buffered.get(l.name)??-1)>=this.tick&&this.active.add(l.name),o<0){this.diagnostics.some(h=>h.message==="Input matching work limit reached.")||this.diagnostics.push({kind:"command",message:"Input matching work limit reached."});break}}for(const[l,c]of this.buffered)c<this.tick&&this.buffered.delete(l);return this.active}matchSequence(e,t){const i=this.history.length-1,s=this.tick-e.time;let r=i,a=null,o=new Set;for(let l=e.sequence.length-1;l>=0;l--){const c=e.sequence[l],h=$u(c);let f=-1;for(let d=r;d>=0&&this.history[d].tick>=s;d--){if(!t())return!1;if(d<r&&(o=new Set),!(!Fs(c,this.history[d])||h.some(u=>o.has(u)))&&!(a!=null&&a.symbol.strict&&!this.strictBetween(d,a.index,c,a.symbol))){f=d;break}}if(f<0)return!1;f!==r&&(o=new Set);for(const d of h)o.add(d);r=f,a={index:f,symbol:c}}return!0}strictBetween(e,t,i,s){const r=this.history[t],a=Al(s,r,this.remap);if(e===t){for(const o of Al(i,r,this.remap))a.add(o);return[...r.changes].every(o=>a.has(o))}for(let o=e+1;o<t;o++)if(this.history[o].changes.size)return!1;return[...r.changes].every(o=>a.has(o))}}const Rl=["a","b","c","x","y","z","s"];function Fa(n){return Number.isFinite(Number(n))?Math.max(0,Math.min(8,Math.trunc(Number(n)))):0}function jr(n){var t,i,s,r,a,o;let e=(i=(t=n.checks)==null?void 0:t.find(l=>l.key==="cmd"&&l.ok))==null?void 0:i.path;if(!e&&((r=(s=n.def)==null?void 0:s.files)!=null&&r.cmd))try{e=No(n.def.files.cmd,((a=n.path)==null?void 0:a.slice(0,n.path.lastIndexOf("/")+1))||"",!0)}catch{}return Uo(e&&((o=n.files)!=null&&o[e])?Er(n.files[e]):"")}function Cl(n){const e=[];let t=new Set,i=new Set,s=new Set;const r=(a=1,o=[])=>{const l=new Set([...t,...i,...o]),c=e.at(-1);c&&l.size===c.keys.size&&[...l].every(h=>c.keys.has(h))?c.duration+=a:e.push({keys:l,duration:a}),s=l};r();for(const a of n.sequence)if(a.kind==="direction"){const o=new Set(a.keys[0]);a.release?(t=o,r(Math.max(1,a.charge)),t=new Set,r()):(!a.hold&&o.size===t.size&&[...o].every(l=>t.has(l))&&(t=new Set,r()),t=o,r())}else if(a.release){r(Math.max(1,a.charge),a.keys);for(const o of a.keys)i.delete(o);r()}else{if(a.keys.some(o=>s.has(o))&&!a.hold&&r(),a.hold)for(const o of a.keys)i.add(o);r(1,a.keys)}return t=new Set,i=new Set,r(),e}function ih(n){var t,i,s,r;const e=((i=(t=n==null?void 0:n.states)==null?void 0:t.get(-3))==null?void 0:i.controllers)||[];for(const a of e){if(a.type!=="varset")continue;const o=Object.entries(a.values||{}).find(([d])=>/^var\s*\(\s*\d+\s*\)$/.test(d)),l=Number(o?/^var\s*\(\s*(\d+)\s*\)$/.exec(o[0])[1]:(s=a.values)==null?void 0:s.v);if(!Number.isInteger(l)||l<0||l>=60)continue;const c=(a.entries||[]).filter(d=>/^trigger(?:all|[1-9]\d*)$/.test(d.key)).map(d=>d.value).join(`
`);if(!/\bcommand\s*=\s*["']AI\d+["']/i.test(c))continue;const h=d=>(d.entries||[]).some(u=>{if(!/^trigger(?:all|[1-9]\d*)$/.test(u.key))return!1;const m=String(u.value).replace(/\s+/g,"").toLowerCase();return m.includes("var("+l+")!=0")||m.includes("var("+l+")>0")||m.includes("var("+l+")>=1")});if(e.filter(d=>["changestate","selfstate"].includes(d.type)&&h(d)).length<2)continue;const f=Number(o?o[1]:(r=a.values)==null?void 0:r.value);return{index:l,value:Number.isFinite(f)&&f>0?f:1}}return null}function wr(n){var e;return((e=ih(n))==null?void 0:e.index)??null}function Ku(n,e){const t=ih(n);return(t==null?void 0:t.index)===e?t.value:1}function nh(n){var r,a;const e=(r=n==null?void 0:n.states)==null?void 0:r.get(-1);if(!((a=e==null?void 0:e.controllers)!=null&&a.length))return wr(n);const t=e.controllers.flatMap(o=>(o.entries||[]).filter(l=>/^trigger(?:all|[1-9]\d*)$/.test(l.key)).map(l=>l.value)).join(`
`),i=[...t.matchAll(/\bvar\s*\(\s*(\d{1,2})\s*\)\s*(?:>=|>)\s*1\b/gi)].map(o=>+o[1]),s=new Set([...t.matchAll(/\bvar\s*\(\s*(\d{1,2})\s*\)\s*<=\s*0\b/gi)].map(o=>+o[1]));return i.find(o=>o<60&&s.has(o))??wr(n)}function Zu(n){var i;if(nh(n)!==null)return!0;const e=(i=n==null?void 0:n.states)==null?void 0:i.get(-1);return[...((e==null?void 0:e.controllers)||[]).flatMap(s=>(s.entries||[]).filter(r=>/^trigger(?:all|[1-9]\d*)$/.test(r.key)).map(r=>r.value)),...(n==null?void 0:n.zssExpressions)||[]].some(s=>/\bailevel\b/i.test(String(s)))}class Ju{constructor(e,{level:t=4,seed:i=1831565813,authoredAI:s=!1,nativeAI:r=!1}={}){var o;this.level=Fa(t),this.authoredAI=!!s,this.nativeAI=!!r,this.seed=i>>>0||1,this.buffer=new xs(e),this.inverse=new Map;for(const l of Rl){const c=((o=e.remap)==null?void 0:o[l])??l;c&&!this.inverse.has(c)&&this.inverse.set(c,l)}const a=e.commands.filter(l=>l.sequence.every(c=>c.kind!=="button"||c.keys.every(h=>this.inverse.has(h))));this.attacks=a.filter(l=>!l.holdOnly&&l.sequence.some(c=>c.kind==="button"&&c.keys.some(h=>h!=="s"))).slice(0,512),this.byName=new Map;for(const l of a)this.byName.has(l.name)||this.byName.set(l.name,[]),this.byName.get(l.name).push(l);this.recoveries=a.filter(l=>l.name.toLowerCase()==="recovery"),this.recoveryNames=new WeakMap,this.recoveryButton=0,this.recovering=!1,this.normal=this.attacks.filter(l=>l.sequence.length===1&&!l.sequence[0].release),this.special=this.attacks.filter(l=>!this.normal.includes(l)),this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.lastCommand=null,this.jumpWait=this.authoredAI?18+this.seed%31:170+this.seed%115}random(){let e=this.seed;return e^=e<<13,e^=e>>>17,e^=e<<5,this.seed=e>>>0,this.seed/4294967296}physical(e,t){return new Set([...e].map(i=>i==="F"?t<0?"L":"R":i==="B"?t<0?"R":"L":this.inverse.get(i)||i))}queue(e,t){this.plan=[{keys:new Set(e),duration:t}],this.index=0,this.remaining=0}chooseRecovery(e){var a;const t=(a=e.stateOwner)==null?void 0:a.program.states.get(e.stateNo);let i=t&&this.recoveryNames.get(t);if(t&&!i){i=new Set;for(const o of t.controllers){if(!["changestate","selfstate"].includes(o.type))continue;const l=o.entries.filter(c=>/^trigger(?:all|[1-9]\d*)$/.test(c.key)).map(c=>c.value).join(`
`);if(/\bcanrecover\b/i.test(l))for(const c of l.matchAll(/\bcommand\s*=\s*"([^"\\]*)"/gi))i.add(c[1])}this.recoveryNames.set(t,i)}const s=[...i||[]].flatMap(o=>this.byName.get(o)||[]),r=s.length?s:this.recoveries;if(r.length){const o=r[Math.floor(this.random()*r.length)];this.lastCommand=o.name,this.plan=Cl(o),this.index=0,this.remaining=0}else{const o=Rl.filter(l=>l!=="s"&&this.inverse.has(l));o.length&&this.queue([o[this.recoveryButton++%o.length]],1)}}canJump(e){var t,i;return e.ctrl&&e.moveType!=="H"&&e.stateType==="S"&&e.pos.y>=-.01&&((t=e.program)==null?void 0:t.states.has(40))&&!((i=e.asserted)!=null&&i.has("nojump"))}chooseJump(e,t){const i=Math.abs(t.pos.x-e.pos.x),s=e.coordinateScale||1,r=e.constant("size.ground.front")*s+t.constant("size.ground.front")*(t.coordinateScale||1)+20*s,a=i>r||this.random()<.65,o=!a&&this.random()<.25;return this.queue(a?["U","F"]:o?["U","B"]:["U"],3+Math.floor(this.random()*3)),this.lastCommand=a?"jump-forward":o?"jump-back":"jump-neutral",this.jumpWait=this.authoredAI?Math.max(40,115-this.level*10)+Math.floor(this.random()*35):Math.max(260,500-this.level*20)+Math.floor(this.random()*85),!0}choose(e,t){if(!e.ctrl||e.moveType==="H")return;const i=Math.abs(t.pos.x-e.pos.x),s=e.coordinateScale||1,r=e.constant("size.ground.front")*s+t.constant("size.ground.front")*(t.coordinateScale||1)+20*s;if(this.canJump(e)&&this.jumpWait<=0){this.chooseJump(e,t);return}if(i>r){this.queue(["F"],4+Math.floor(this.random()*9));return}if(t.moveType==="A"&&this.random()<.12+.07*this.level){this.queue(this.random()<.3?["D","B"]:["B"],4+this.level);return}if(this.attacks.length){const a=this.special.length&&this.random()<.08+.055*this.level?this.special:this.normal.length?this.normal:this.attacks,o=a[Math.floor(this.random()*a.length)];this.lastCommand=o.name,this.plan=Cl(o),this.index=0,this.remaining=0}else this.queue([],2)}tick(e,t,{paused:i=!1,enabled:s=!0}={}){var r,a;if(this.nativeAI){if(!this.level||!s||!e.alive||!(t!=null&&t.alive))this.plan=[],this.index=0,this.remaining=0,this.raw=new Set;else if(!i){this.jumpWait>0&&this.jumpWait--,this.index>=this.plan.length&&this.jumpWait<=0&&e.moveType==="I"&&[0,20,100].includes(e.stateNo)&&this.canJump(e)&&this.chooseJump(e,t);const o=this.plan[this.index];o?(this.remaining<=0&&(this.remaining=o.duration),this.raw=this.physical(o.keys,e.facing),--this.remaining<=0&&this.index++):this.raw=new Set}return this.buffer.update(this.raw,e.facing)}if(!this.level||!s||!e.alive||!(t!=null&&t.alive))this.plan=[],this.index=0,this.remaining=0,this.cooldown=0,this.raw=new Set,this.recovering=!1;else if(!i){this.jumpWait>0&&this.jumpWait--;const o=e.moveType==="H"&&!!((r=e.getHitVars)!=null&&r.fall);o!==this.recovering&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=o?10-this.level:0,this.raw=new Set,this.recovering=o);const l=o&&["A","L"].includes(e.stateType)&&!!((a=e.resolveTrigger)!=null&&a.call(e,"canrecover"));o&&!l&&(this.plan=[],this.index=0,this.remaining=0,this.cooldown=10-this.level,this.raw=new Set),this.authoredAI&&!o&&this.jumpWait<=0&&this.canJump(e)&&this.index>=this.plan.length&&(this.chooseJump(e,t),this.cooldown=0),this.index>=this.plan.length&&(this.cooldown>0?this.cooldown--:o?(l&&this.chooseRecovery(e),this.cooldown=14-this.level):(this.choose(e,t),this.cooldown=Math.max(1,15-this.level*1.5)));const c=this.plan[this.index];c?(this.remaining<=0&&(this.remaining=c.duration),this.raw=this.physical(c.keys,e.facing),--this.remaining<=0&&this.index++):this.raw=new Set}return this.buffer.update(this.raw,e.facing)}}const fn=(n,e=0)=>Number.isFinite(Number(n))?Number(n):e,Oa=n=>String(n??"").toUpperCase().replace(/\s/g,"");function kn(n,e,t){var r;const i=(r=n.program)==null?void 0:r.constants,s=i instanceof Map?i.get(e):i==null?void 0:i[e];return s===void 0?t:fn(s,t)}function Ai(n,e="clsn1",t=n.collisionFrame??n.currentFrame){var h,f,d,u;if(!t||!Array.isArray(t[e]))return[];const i=th(n),s=Gt(i),r=n.facing<0?-1:1,a=kn(i,"size.xscale",1)*s*r,o=kn(i,"size.yscale",1)*s,l=fn((h=n.pos)==null?void 0:h.x)+kn(n,"size.draw.offset.x",0)*Gt(n)*r+fn((f=n.drawOffset)==null?void 0:f.x),c=fn((d=n.pos)==null?void 0:d.y)+kn(n,"size.draw.offset.y",0)*Gt(n)+fn((u=n.drawOffset)==null?void 0:u.y);return t[e].filter(m=>Array.isArray(m)&&m.length>=4&&m.slice(0,4).every(v=>Number.isFinite(Number(v)))).map(m=>{const v=l+Number(m[0])*a,g=l+Number(m[2])*a,p=c+Number(m[1])*o,M=c+Number(m[3])*o;return[Math.min(v,g),Math.min(p,M),Math.max(v,g),Math.max(p,M)]})}function ju(n,e,t=!1){return t?n[0]<=e[2]&&n[2]>=e[0]&&n[1]<=e[3]&&n[3]>=e[1]:n[0]<e[2]&&n[2]>e[0]&&n[1]<e[3]&&n[3]>e[1]}function yn(n,e,t=!1){for(const i of n)for(const s of e)if(ju(i,s,t))return[Math.max(i[0],s[0]),Math.max(i[1],s[1]),Math.min(i[2],s[2]),Math.min(i[3],s[3])];return null}function Qu(n,e){var i;const t=e.moveType==="H";return n.includes("+")&&!t||n.includes("-")&&t?!1:e.stateType==="L"?n.includes("D"):e.stateType==="A"?n.includes(e.moveType==="H"&&((i=e.getHitVars)!=null&&i.fall)?"F":"A"):n.includes("M")||n.includes(e.stateType==="C"?"L":"H")}function ed(n,e,t,i){var l,c,h,f;const s=t.moveType==="H"&&!!((l=t.getHitVars)!=null&&l.guarded);if(!t.ctrl&&!s||t.moveType==="H"&&!s||!["S","C","A"].includes(t.stateType)||(c=e.asserted)!=null&&c.has("unguardable"))return!1;const r=t.stateType==="A"?"noairguard":t.stateType==="C"?"nocrouchguard":"nostandguard";if((h=t.asserted)!=null&&h.has(r))return!1;const a=new Set([...i].map(d=>String(d).toLowerCase()));if(!((f=t.world)!=null&&f.manageInputs?t.movementHeld("holdback"):a.has("holdback")))return!1;const o=Oa(n.guardFlag??n.guardflag);return t.stateType==="A"?o.includes("A"):t.stateType==="C"?/[LM]/.test(o):/[HM]/.test(o)}function Pl(n){const e=Array.isArray(n.priority)?n.priority:String(n.priority??"4,Hit").split(","),t=String(e[1]??"Hit").trim().toLowerCase();return{level:Math.max(1,Math.min(7,fn(e[0],4))),type:["hit","miss","dodge"].includes(t)?t:"hit"}}function td(n){if(n.length<2)return n;const e=Pl(n[0].hit),t=Pl(n[1].hit);return e.level!==t.level?[n[e.level>t.level?0:1]]:e.type==="dodge"||t.type==="dodge"?[]:e.type==="miss"&&t.type==="miss"?[]:n.filter((i,s)=>(s?t:e).type==="hit")}class id{constructor(e,{commonText:t="",commonAnimations:i=new Map,opponentCharacter:s=e,leftBound:r=-150,rightBound:a=150,pushboxes:o=!0,maxHelpers:l=56,maxProjectiles:c=256,initialize:h=!0,skipIntro:f=!0,stage:d=null,rules:u=null,combatRules:m={},playerPalette:v=1,opponentPalette:g=1,playerAILevel:p=0,opponentAILevel:M=0,expressionEvaluator:T=null,programs:E=null,manageInputs:R=!1,orderedPhases:b=!1,cameraFollow:_=!1,kotlinCombatBackend:y=null}={}){if(this.expressionEvaluator=T,this.programs=E,this.manageInputs=R,this.orderedPhases=b,this.combatRules=pu(e.files,m),!Number.isFinite(r)||!Number.isFinite(a)||r>=a)throw Error("Invalid training stage bounds.");this.character=e,this.opponentCharacter=s,this.commonText=t,this.leftBound=r,this.rightBound=a,this.pushboxes=o,this.commonAnimations=i,this.maxHelpers=Math.min(256,Math.max(0,l)),this.maxProjectiles=Math.min(1024,Math.max(0,c)),this.kotlinCombatKernel=(y==null?void 0:y.createProjectileKernel(this.maxProjectiles))??null,this.initialize=h,this.skipIntro=f,this.playerPalette=v,this.opponentPalette=g,this.playerAILevel=Fa(p),this.opponentAILevel=Fa(M),this.stage=d?new mu(d):null,this.cameraRuntime=this.stage||new gu,this.cameraFollow=!!_,this.rules=u,this.gameMode=u?"versus":"training",this.stage&&(this.leftBound=d.leftBound,this.rightBound=d.rightBound),this.reset()}reset({preserveMatch:e=!1}={}){var s,r,a,o;const t=e?{players:[this.player,this.opponent],flow:this.roundFlow,ticks:this.ticks,diagnostics:this.diagnostics}:null;this.roundFlow=(t==null?void 0:t.flow)||(this.rules?new zu(this.rules):null),this._benchmarkStartHeld=!1,this.roundGeneration=(this.roundGeneration||0)+1,this.stage?this.stage.reset({backgrounds:!e||this.stage.definition.resetBG}):this.cameraRuntime.reset();const i=((s=this.stage)==null?void 0:s.definition.starts)||[{x:-70,y:0,facing:1},{x:70,y:0,facing:-1}];this.player=new vl(this.character,{world:this,program:(r=this.programs)==null?void 0:r.get(this.character),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[0],facing:i[0].facing,id:1,teamSide:1,paletteNo:this.playerPalette,aiLevel:this.playerAILevel}),this.opponent=new vl(this.opponentCharacter,{world:this,program:(a=this.programs)==null?void 0:a.get(this.opponentCharacter),expressionEvaluator:this.expressionEvaluator,commonAnimations:this.commonAnimations,commonText:this.commonText,position:i[1],facing:i[1].facing,id:2,teamSide:2,paletteNo:this.opponentPalette,aiLevel:this.opponentAILevel});for(const l of[this.player,this.opponent])if(l.aiLevel>0){const c=nh(l.program);c!==null&&(l.legacyAIFlag=c,l.legacyAIValue=Ku(l.program,wr(l.program)),l.vars[c]=l.legacyAIValue)}if(this.player.teamSide=1,this.opponent.teamSide=2,this.player.opponent=this.opponent,this.opponent.opponent=this.player,this._entities=[this.player,this.opponent],this.projectiles=[],this.nextEntityId=3,this._projectileClashBounds||(this._projectileClashBounds=new Float64Array(this.maxProjectiles*4)),this.projectileClashStats={pairsVisited:0,narrowphaseCalls:0},this.orphanEffectOwners=[],this.renderEntities=[...this._entities],this.drawProjectiles=[],this.helperCommands=new Map,this.helperStats={attempted:0,created:0,rejected:0,missingState:0,destroyed:0,peak:0},this.usedHits=new Map,this.juggles=new Map,this.cornerPushActors=new Set,this.archivedDiagnostics=[],this.archivedDiagnosticKeys=new Set,this.pendingPauses=[],this.pause=null,this.superPause=null,this.commandBuffers=new Map,this.presentationEvents=[],this.eventEntities=[],this.pendingCombatEffects=[],this.activeActor=null,this.contactPhase=!1,this.inputBuffers=new Map,this.inputProfiles=new Map,this.manageInputs)for(const l of this._entities)this.inputProfiles.has(l.character)||this.inputProfiles.set(l.character,jr(l.character)),this.inputBuffers.set(l,new xs(this.inputProfiles.get(l.character)));this.events=[],this.cpus=new Map;for(const l of this._entities)if(l.aiLevel){const c=jr(l.character);this.cpus.set(l,new Ju(c,{level:l.aiLevel,authoredAI:Zu(l.program),nativeAI:wr(l.program)!==null,seed:1831565813^l.id*2654435769^(((o=this.roundFlow)==null?void 0:o.roundNo)||1)}));for(const h of c.diagnostics)l.diagnostic("command",h.message,{source:l.character.def.files.cmd,line:h.line})}if(this.ticks=(t==null?void 0:t.ticks)||0,this.winner=null,t){this.archiveDiagnostics(t.diagnostics);for(const[l,c]of[this.player,this.opponent].entries()){const h=t.players[l];c.power=h.power,c.victoryQuoteIndex=h.victoryQuoteIndex;const f=Math.max(0,Math.min(60,Math.trunc(c.program.constants.get("data.intpersistindex")??60))),d=Math.max(0,Math.min(40,Math.trunc(c.program.constants.get("data.floatpersistindex")??40)));c.vars.set(h.vars.subarray(f),f),c.fvars.set(h.fvars.subarray(d),d)}}if(this.syncEnvironment(),this.initialize){for(const l of this._entities)if(l.program.states.has(5900))l._initializing=!0,l.options.skipIntro=this.skipIntro,l.changeState(5900);else if(this.roundFlow&&!this.skipIntro){const c=l.program.states.has(190)?190:l.program.states.has(191)?191:null;c!==null&&l.changeState(c,0,l)}}return this}get diagnostics(){var i;const e=[...this.archivedDiagnostics,...((i=this.stage)==null?void 0:i.diagnostics)||[],...this.entities.flatMap(s=>s.diagnostics||[]),...this.orphanEffectOwners.flatMap(s=>s.diagnostics||[]),...this.projectiles.flatMap(s=>s.diagnostics||[]),...[...this.cpus||new Map].flatMap(([s,r])=>r.buffer.diagnostics.map(a=>({...a,source:s.character.def.files.cmd})))],t=new Set;return e.filter(s=>{const r=typeof s=="string"?s:JSON.stringify(s);return t.has(r)?!1:(t.add(r),!0)})}get entities(){return this._entities.filter(e=>!e.destroyed)}get view(){return this.cameraRuntime.view()}get matchOver(){var e;return((e=this.roundFlow)==null?void 0:e.matchOver)||!1}syncEnvironment(){for(const e of this._entities||[])e.cameraPos=this.cameraRuntime.camera,e.cameraZoom=this.cameraRuntime.camera.zoom,this.roundFlow&&(e.roundState=this.roundFlow.roundState,e.roundNo=this.roundFlow.roundNo,e.roundsExisted=this.roundFlow.roundsExisted)}findPlayer(e){return this.entities.find(t=>t.id===e)}spawnHelper(e,t){this.helperStats.attempted++;const i=this.entities.filter(r=>r.parent).length;if(i>=this.maxHelpers)return this.helperStats.rejected++,e.diagnostic("resource-limit",`Helper limit (${this.maxHelpers}) reached.`),null;const s=e.createHelper(t,{id:this.nextEntityId++});return s.destroyed?(this.helperStats.rejected++,s.diagnostics.some(r=>r.type==="missing-state")&&this.helperStats.missingState++,this.archiveDiagnostics(s.diagnostics)):(this._entities.push(s),this.helperStats.created++,this.helperStats.peak=Math.max(this.helperStats.peak,i+1),s.keyCtrl&&this.helperCommands.set(s,new xs(jr(s.root.character))),this.syncEnvironment()),s}spawnProjectile(e,t){if(this.projectiles.length>=this.maxProjectiles)return e.diagnostic("resource-limit",`Projectile limit (${this.maxProjectiles}) reached.`),null;const i=new is(e,t,{id:this.nextEntityId++});if(i.removed)return this.archiveDiagnostics(i.diagnostics),i;const s=Object.fromEntries(Object.entries(t).filter(([r])=>r.startsWith("afterimage.")).map(([r,a])=>[r.slice(11),a]));return Object.keys(s).length&&this.presentationEvents.push({...s,type:"afterimage",entity:i}),this.projectiles.push(i),i}retireEffects(e,{removeExplods:t=!1}={}){var i;if(!e._effectsDetached){if(e._effectsDetached=!0,t)e.explods=[],e.drawExplods=[];else if(e.drawExplods=[],e.explods.length){for(const s of e.explods)s.orphaned=!0;this.orphanEffectOwners.push(e)}for(const s of new Set([...this._entities,...this.orphanEffectOwners]))((i=s.bound)==null?void 0:i.target)===e&&(s.bound=null),_u(s,e)}}destroyHelper(e,{recursive:t=!1,removeExplods:i=!1}={}){const s=[e];if(t)for(const r of this._entities){let a=r.parent,o=0;for(;a&&o++<256;){if(a===e){s.push(r);break}a=a.parent}}for(const r of s)r.destroyed=!0;for(const r of s)this.retireEffects(r,{removeExplods:i})}requestPause(e,t){const i=Math.max(0,Math.trunc(t.time));if(!Number.isFinite(i)||i>36e4){e.diagnostic("resource-limit","Pause time must be between 0 and 360000 ticks.");return}const s={...t,owner:e,time:i,remaining:i,elapsed:0,moved:new Map,movetime:Math.max(0,Math.min(i,t.movetime||0)),endcmdbuftime:Math.max(0,Math.min(i,t.endcmdbuftime||0))};this.pendingPauses.push(s),t.type==="superpause"&&(e.power=Math.max(0,Math.min(e.maxPower,e.power+(t.poweradd||0))),this.presentationEvents.push({...s,type:"superpause"}))}isFrozen(e){var s,r;const t=((s=this.superPause)==null?void 0:s.remaining)>0?this.superPause:((r=this.pause)==null?void 0:r.remaining)>0?this.pause:null;if(!t)return!1;const i=e===t.owner?t.movetime:t.type==="superpause"?e.superMoveTime||0:e.pauseMoveTime||0;return e.isProjectile?i<=0:(t.moved.get(e)||0)>=i}isSuperUnhittable(e){var t;return((t=this.superPause)==null?void 0:t.remaining)>0&&this.superPause.owner===e&&this.superPause.unhittable!==0}advancePause(){var i,s;const e=((i=this.superPause)==null?void 0:i.remaining)>0?this.superPause:((s=this.pause)==null?void 0:s.remaining)>0?this.pause:null,t=r=>{for(const[a,{before:o,applied:l}]of(r==null?void 0:r.defence)||[])a.defenceMultiplier===l&&(a.defenceMultiplier=o)};if(e){for(const r of[...this.entities,...this.projectiles])!this.isFrozen(r)&&!r._hitPausedThisTick&&e.moved.set(r,(e.moved.get(r)||0)+1);e.remaining--,e.elapsed++,e.remaining||t(e)}for(const r of this.pendingPauses){const a=r.type==="superpause"?"superPause":"pause";if(t(this[a]),this[a]=r,a==="superPause"&&r.remaining>0){const o=r.p2defmul>0?r.p2defmul:this.combatRules.superTargetDefence||1.5;r.defence=new Map;for(const l of r.owner.targets){const c=l.defenceMultiplier,h=c/o;r.defence.set(l,{before:c,applied:h}),l.defenceMultiplier=h}}}this.pendingPauses=[]}tick(e=new Set,t=new Set,{playerInput:i=null,opponentInput:s=null}={}){var W,A,H,G,B,ne,q,J,ie,Te,Fe,K,me,we,De,$,Me;if(this.orderedPhases){for(const C of this.pendingCombatEffects){const{defender:P,attacker:se,damage:ue,minimum:re,get:be,give:Ae}=C;P.life=Math.max(re,Math.min(P.maxLife,P.life-ue)),se&&(se.power=Math.max(0,Math.min(se.maxPower,se.power+be)),P.power=Math.max(0,Math.min(P.maxPower,P.power+Ae)))}this.pendingCombatEffects=[];for(const C of this._entities)C._projectedLife=void 0}this.events=[],this.presentationEvents=[],e=e instanceof Set?e:new Set(e),t=t instanceof Set?t:new Set(t);const r=((W=this.superPause)==null?void 0:W.remaining)>0||((A=this.pause)==null?void 0:A.remaining)>0&&this.pause.pausebg!==0,a=((H=this.superPause)==null?void 0:H.remaining)>0||((G=this.pause)==null?void 0:G.remaining)>0,o=((B=this.pause)==null?void 0:B.remaining)>0?this.pause:null,l=((ne=this.superPause)==null?void 0:ne.remaining)>0?this.superPause:null;this.syncEnvironment();const c=vu(this.roundFlow);if(!c&&this._benchmarkStartHeld){this._benchmarkStartHeld=!1;for(const C of[this.player,this.opponent])C.stateNo===0&&((J=(q=C.program.states.get(0))==null?void 0:q.values)==null?void 0:J.ctrl)===void 0&&(C.ctrl=1);this.commandBuffers.clear()}if(((Te=(ie=this.roundFlow)==null?void 0:ie.rules)==null?void 0:Te.fightStartLockTicks)>0&&this.roundFlow.roundState===2&&!c)for(const C of[this.player,this.opponent]){if(C.aiLevel<=0||C.stateNo!==0||C.ctrl||C.moveType!=="I"||C.stateType!=="S"||C._initializing||C.hitPauseTime>0||C.stateOwner!==C){C._r8IdleControlWait=0;continue}const P=C.program.states.get(0);if(((Fe=P==null?void 0:P.values)==null?void 0:Fe.ctrl)!==void 0||((P==null?void 0:P.controllers)||[]).some(ue=>{var re;return ue.type==="ctrlset"&&/^0(?:\.0+)?$/.test(String(((re=ue.values)==null?void 0:re.value)||"").trim())})){C._r8IdleControlWait=0;continue}C._r8IdleControlWait=(C._r8IdleControlWait||0)+1,C._r8IdleControlWait>=30&&(C._r8IdleControlWait=0,C.ctrl=1,C.r8IdleControlRecoveries=(C.r8IdleControlRecoveries||0)+1,C.diagnostic("r8-control-recovery","Idle CPU control restored after 30 active frames in StateDef 0; verify native MUGEN 1.1 behavior before production."))}if(!c&&(!this.roundFlow||this.roundFlow.roundState===2))for(const C of[this.player,this.opponent])C.aiLevel>0&&C.legacyAIFlag!==void 0&&C.vars[C.legacyAIFlag]<=0&&(C.vars[C.legacyAIFlag]=C.legacyAIValue||1);this.cpus.has(this.player)&&(e=this.cpus.get(this.player).tick(this.player,this.opponent,{paused:this.isFrozen(this.player)||this.player.hitPauseTime>0,enabled:!c&&(!this.roundFlow||this.roundFlow.roundState===2)})),this.cpus.has(this.opponent)&&(t=this.cpus.get(this.opponent).tick(this.opponent,this.player,{paused:this.isFrozen(this.opponent)||this.opponent.hitPauseTime>0,enabled:!c&&(!this.roundFlow||this.roundFlow.roundState===2)})),this.cpus.has(this.player)&&(i=this.cpus.get(this.player).raw),this.cpus.has(this.opponent)&&(s=this.cpus.get(this.opponent).raw),c&&(e=new Set,t=new Set,i=new Set,s=new Set,this.commandBuffers.clear());const h=new Set([...this.entities,...this.projectiles].filter(C=>C.hitPauseTime>0)),f=new Set,d=[];for(let C=0;C<this._entities.length;C++){const P=this._entities[C];if(P.destroyed)continue;if(d.push(P),c){P.events=[],P.commands=new Set,P.asserted.clear(),(K=P.pendingAssertedInputs)==null||K.clear(),P.vel.x=0,P.vel.y=0,P.parent||(P.currentFrame&&P.advanceAnimation(),P.collisionFrame=P.currentFrame,P.collisionAnimationOwner=P.animationOwner),P.time++,P.gameTime++;continue}let se=P.root===this.player?e:t,ue=P.root===this.player?i:s;if(this.manageInputs&&P.keyCtrl){ue=new Set(ue||[]);for(const Ae of P.pendingAssertedInputs)ue.add(Ae==="F"?P.facing===1?"R":"L":Ae==="B"?P.facing===1?"L":"R":Ae);this.isFrozen(P)||P.pendingAssertedInputs.clear(),this.inputBuffers.has(P)||this.inputBuffers.set(P,new xs(this.inputProfiles.get(P.root.character))),se=this.inputBuffers.get(P).update(ue,P.facing)}else P.parent&&P.keyCtrl&&ue!==null&&(se=this.helperCommands.get(P).update(ue,P.facing));(!P.keyCtrl||this.roundFlow&&this.roundFlow.roundState!==2)&&(se=new Set);const re=P.teamSide===this.player.teamSide?this.opponent:this.player,be=this.isFrozen(P);if(P._hitPausedThisTick=P.hitPauseTime>0,!be&&!P._hitPausedThisTick&&(P._projectileContactShield=!1),be){f.add(P);const Ae=((me=this.superPause)==null?void 0:me.remaining)>0?this.superPause:this.pause;if(Ae&&Ae.remaining<=Ae.endcmdbuftime){this.commandBuffers.has(P)||this.commandBuffers.set(P,new Set);for(const Re of se)this.commandBuffers.get(P).add(Re)}}else this.commandBuffers.has(P)&&(se=new Set([...se,...this.commandBuffers.get(P)]),this.commandBuffers.delete(P));this.activeActor=P;try{P.tick({commands:se,opponent:re,paused:be,input:P.keyCtrl?ue:new Set})}finally{this.activeActor=null}}for(const C of this.projectiles){const P=this.isFrozen(C);P&&f.add(C),C._hitPausedThisTick=C.hitPauseTime>0,C.tick({paused:P})}if(this.stage)for(const C of this.entities)C.screenBound!==!1&&(C.pos.x=Math.max(this.leftBound,Math.min(this.rightBound,C.pos.x)));(this.stage||this.cameraFollow)&&this.cameraRuntime.updateCamera(this.entities,{advance:!a}),this.syncEnvironment(),this.stage&&this.stage.tick({paused:r}),this.orderedPhases&&this.advanceCornerPush(f),this.constrainPositions()&&((this.stage||this.cameraFollow)&&this.cameraRuntime.updateCamera(this.entities,{advance:!1}),this.syncEnvironment(),this.constrainPositions({push:!1}));const m=this.entities;for(const C of m)if(C.moveType!=="H"&&C.stateType!=="L")for(const P of this.juggles.values())P.delete(C.id);const v=this.projectiles.filter(C=>!C.removed&&!C.removing),g=v.map(C=>Ai(C,"clsn2")),p=this._projectileClashBounds;this.projectileClashStats.pairsVisited=0,this.projectileClashStats.narrowphaseCalls=0;for(let C=0;C<g.length;C++){const P=C*4,se=g[C];let ue=1/0,re=1/0,be=-1/0,Ae=-1/0;for(const Re of se)Re[0]<ue&&(ue=Re[0]),Re[1]<re&&(re=Re[1]),Re[2]>be&&(be=Re[2]),Re[3]>Ae&&(Ae=Re[3]);p[P]=ue,p[P+1]=re,p[P+2]=be,p[P+3]=Ae}const M=this.kotlinCombatKernel;let T=-1,E=0;if(M)try{M.clear();for(let C=0;C<v.length;C++){const P=C*4,se=v[C];M.add(p[P],p[P+1],p[P+2],p[P+3],se.teamSide,f.has(se),se.removing)}if(T=M.collect(this.orderedPhases),!Number.isInteger(T)||T<0)throw Error("Invalid projectile pair count");this.projectileClashStats.pairsVisited=M.examinedPairs()}catch(C){this.kotlinCombatKernel=null;try{(we=M.dispose)==null||we.call(M)}catch{}this.player.diagnostic("kotlin-wasm-fallback",String((C==null?void 0:C.message)||C)),T=-1,this.projectileClashStats.pairsVisited=0}for(let C=0;C<v.length;C++){const P=v[C];if(P.removing||!g[C].length){if(T>=0)for(;E<T&&M.left(E)===C;)E++;continue}const se=[];if(T>=0)for(;E<T&&M.left(E)===C;){const re=M.right(E++),be=v[re];!be||be.removing||P.teamSide===be.teamSide||f.has(P)&&f.has(be)||(this.projectileClashStats.narrowphaseCalls++,yn(g[C],g[re],this.orderedPhases)&&se.push(be))}else for(let re=C+1;re<v.length;re++){const be=v[re];if(P.teamSide===be.teamSide||be.removing||f.has(P)&&f.has(be))continue;this.projectileClashStats.pairsVisited++;const Ae=C*4,Re=re*4,je=this.orderedPhases;!(je?p[Ae]<=p[Re+2]&&p[Ae+2]>=p[Re]:p[Ae]<p[Re+2]&&p[Ae+2]>p[Re])||!(je?p[Ae+1]<=p[Re+3]&&p[Ae+3]>=p[Re+1]:p[Ae+1]<p[Re+3]&&p[Ae+3]>p[Re+1])||(this.projectileClashStats.narrowphaseCalls++,yn(g[C],g[re],je)&&se.push(be))}const ue=re=>(re.pos.x-P.pos.x)**2+(re.pos.y-P.pos.y)**2;se.sort((re,be)=>ue(re)-ue(be)||re.id-be.id);for(const re of se){if(P.removing)break;re.removing||(P.clash(re),re.clash(P))}}const R=this.orderedPhases?this.projectiles.filter(C=>!C.removed||C.drawVisible):v,b=[...m,...R];for(const C of m)C.inGuardDistance=xu(C,b);const _=[],y=new Set;for(const C of m)if(!(!C.reversalDef||f.has(C)||h.has(C)||this.roundFlow&&this.roundFlow.roundState!==2))for(const P of m){const se=C.reversalDef;if(!se)break;const ue=P.hitDef;if(!ue||P===C||P.teamSide===C.teamSide||h.has(P)||y.has(P)||!C.attributeMatches(se["reversal.attr"],ue.attr)||((De=this.usedHits.get(C))==null?void 0:De.get(P.id))===se.serial)continue;const re=yn(Ai(C),Ai(P),this.orderedPhases);if(!re)continue;const be=P.receiveHit(se,C);be.rejected||(this.applyCornerPush(C,P,be.cornerPush,se.coordinateScale),P.moveContact=P.moveHit=P.moveGuarded=0,P.moveReversed=1,P.hitDef=null,y.add(P),this.usedHits.has(C)||this.usedHits.set(C,new Map),this.usedHits.get(C).set(P.id,se.serial),this.events.push({type:"reversal",attacker:C,defender:P,hitDef:se,damage:be.damage,guarded:!1,x:(re[0]+re[2])/2,y:(re[1]+re[3])/2,tick:this.ticks}))}const N=m.length>2?new Map:null;for(const C of[...m,...v]){if(this.winner||this.roundFlow&&this.roundFlow.roundState!==2||C.destroyed||f.has(C)||y.has(C)||h.has(C)||C.life<=0||C.moveType!=="A")continue;const P=C.hitDef;if(!P||!/^[SCA]\s*,\s*[NSH][ATP]$/i.test(String(P.attr??"").trim()))continue;const se=Oa(P.hitFlag??P.hitflag??"MAF");if(!/[HLAMFD]/.test(se)||se.includes("+")&&se.includes("-"))continue;const ue=Oa(P.affectteam??"E"),re=P.serial??P,be=this.usedHits.get(C);let Ae;for(const Re of[...m].sort((je,We)=>Math.abs(je.pos.x-C.pos.x)-Math.abs(We.pos.x-C.pos.x))){if(C===Re||C.isProjectile&&C.owner===Re||Re.life<=0||h.has(Re))continue;const je=C.teamSide===Re.teamSide;if(ue==="E"&&je||ue==="F"&&!je||!Qu(se,Re)||(C instanceof is?!C.canHit(Re,this.ticks):(be==null?void 0:be.get(Re.id))===re))continue;if(Ae??(Ae=Ai(C)),!Ae.length)break;let We=N==null?void 0:N.get(Re);We||(We=Ai(Re,"clsn2"),N==null||N.set(Re,We));const Ge=yn(Ae,We,this.orderedPhases);if(!Ge||typeof Re.canBeHit=="function"&&!Re.canBeHit(P,C)||String(P[Re.stateType==="A"?"air.type":"ground.type"]??P["ground.type"]??"high").toLowerCase()!=="none"&&!this.canJuggle(C,Re,P))continue;const ct=this.manageInputs||Re.parent?Re.commands:Re===this.player?e:t;_.push({attacker:C,defender:Re,hit:P,activation:re,overlap:Ge,wasFalling:Re.stateType==="L"||Re.stateType==="A"&&Re.moveType==="H"&&!!(($=Re.getHitVars)!=null&&$.fall),guarded:ed(P,C,Re,ct)})}}const I=_.filter(C=>{const P=_.find(se=>se.attacker===C.defender&&se.defender===C.attacker);return!P||td([C,P]).includes(C)}),D=new Set;for(const C of I){if(C.attacker instanceof is&&(C.defender._projectileContactShield||!C.attacker.canHit()))continue;let P;this.contactPhase=!0;try{P=C.defender.receiveHit(C.hit,C.attacker,{guarded:C.guarded})}finally{this.contactPhase=!1}P!=null&&P.rejected||(this.applyCornerPush(C.attacker,C.defender,P.cornerPush,C.hit.coordinateScale),!C.guarded&&!P.typeNone&&this.recordJuggle(C.attacker,C.defender,C.hit,{wasFalling:C.wasFalling}),this.usedHits.has(C.attacker)||this.usedHits.set(C.attacker,new Map),this.usedHits.get(C.attacker).set(C.defender.id,C.activation),C.attacker instanceof is&&(C.defender._projectileContactShield=!0,C.attacker.onContact({guarded:C.guarded,defer:!0}),D.add(C.attacker)),this.events.push({type:C.guarded?"guard":"hit",attacker:C.attacker,defender:C.defender,hitDef:C.hit,damage:(P==null?void 0:P.damage)??0,guarded:C.guarded,typeNone:!!P.typeNone,x:(C.overlap[0]+C.overlap[2])/2,y:(C.overlap[1]+C.overlap[3])/2,tick:this.ticks}))}for(const C of D)C.finishContacts();for(const C of this.projectiles)C.finishMovementAllowance({paused:f.has(C)});for(const C of this.entities)C.updateExplods({hitPaused:h.has(C),pause:o,superPause:l});for(const C of this._entities)C.destroyed&&!C._effectsDetached&&this.retireEffects(C);for(const C of this.orphanEffectOwners)C.updateExplods({pause:o,superPause:l});this.orphanEffectOwners=this.orphanEffectOwners.filter(C=>C.explods.length||C.drawExplods.length),this.drawProjectiles=this.projectiles.filter(C=>C.drawVisible),this.eventEntities=[...d,...this.projectiles],this.cleanupEntities(),this.advancePause(),this.ticks++;const F=C=>this.entities.some(P=>P.asserted.has(C));if(!this.roundFlow&&!F("noko")&&(this.player.life<=0||this.opponent.life<=0)&&(this.winner=this.player.life<=0&&this.opponent.life<=0?"draw":this.player.life<=0?"opponent":"player"),this.roundFlow){const C=this.roundFlow,P=[this.player,this.opponent],se=F("intro"),ue=We=>We.stateNo===5900||We.stateNo>=190&&We.stateNo<=199||We.asserted.has("intro"),re=C.roundState===0&&C.phaseTime>=60&&P.every(We=>!ue(We)||We.stateNo>=190&&We.stateNo<=199&&We.animationTime===0),be=P.some(ue)&&!re,Ae=C.roundWinner==="player"?this.player:C.roundWinner==="opponent"?this.opponent:null,Re=!!Ae&&Ae.stateNo>=180&&Ae.stateNo<=189&&!Ae.animationEnded,je=C.step({players:P,paused:a,intro:se,introPending:be,victoryPending:Re,roundNotOver:F("roundnotover"),timerFreeze:F("timerfreeze"),noKO:P.map(()=>F("noko"))});this.syncEnvironment();for(const We of je){if(We.type==="round"&&C.rules.fightStartLockTicks>0){this._benchmarkStartHeld=!0;for(const Ge of[this.player,this.opponent])Ge.program.states.has(0)&&Ge.changeState(0,1,Ge),Ge.animations.has(0)&&Ge.changeAnimation(0),Ge.vel.x=0,Ge.vel.y=0,Ge.pos.y=0,Ge.asserted.clear();this.commandBuffers.clear()}if(We.type==="fight"&&!C.rules.fightStartLockTicks)for(const Ge of P)Ge.stateNo===0&&(Ge.ctrl=1);if(We.type==="round-over"&&(this.winner=We.winner),We.type==="result")for(const Ge of P){const _t=We.winner===(Ge===this.player?"player":"opponent")?180:We.reason==="time"?170:null;_t!==null&&Ge.program.states.has(_t)&&Ge.changeState(_t,0,Ge)}We.type==="next-round"&&this.reset({preserveMatch:!0}),this.presentationEvents.push({...We,type:"round",event:We.type})}C.matchOver&&C.roundWinner!=="draw"&&((Me=this[C.roundWinner])==null||Me.selectVictoryQuote())}return this.events}cleanupEntities(){var t;const e=this._entities.filter(i=>i.destroyed);this.helperStats.destroyed+=e.filter(i=>i.parent).length;for(const i of e)i._effectsDetached||this.retireEffects(i);for(const i of[...e,...this.projectiles.filter(s=>s.removed)]){this.archiveDiagnostics(i.diagnostics),this.usedHits.delete(i),this.cornerPushActors.delete(i),this.commandBuffers.delete(i),this.inputBuffers.delete(i),this.helperCommands.delete(i),this.juggles.delete(i);for(const s of this.juggles.values())s.delete(i.id)}this._entities=this._entities.filter(i=>!i.destroyed),this.projectiles=this.projectiles.filter(i=>!i.removed);for(const i of this._entities){i.helpers=i.helpers.filter(s=>!s.destroyed),i.targets=i.targets.filter(s=>!s.destroyed&&(!this.orderedPhases||s.moveType==="H"));for(const s of i.targetHitIds.keys())i.targets.some(r=>r.id===s)||i.targetHitIds.delete(s);(t=i.bound)!=null&&t.target.destroyed&&(i.bound=null)}this.renderEntities=[...this._entities,...this.orphanEffectOwners].sort((i,s)=>i.id-s.id)}archiveDiagnostics(e){for(const t of e){const i=JSON.stringify(t);this.archivedDiagnosticKeys.has(i)||(this.archivedDiagnosticKeys.add(i),this.archivedDiagnostics.push(t))}}canJuggle(e,t,i){var c,h,f;if((c=(e.isProjectile?e.creator:e).asserted)!=null&&c.has("nojugglecheck")||!(t.stateType==="L"||t.stateType==="A"&&t.moveType==="H"&&((h=t.getHitVars)==null?void 0:h.fall)))return!0;const r=e.isProjectile?e.owner:e,a=(f=this.juggles.get(r))==null?void 0:f.get(t.id),o=(a==null?void 0:a.remaining)??r.constant("data.airjuggle"),l=e.isProjectile?i["air.juggle"]||0:(a==null?void 0:a.group)===i.juggleGroup?0:i.juggleCost||0;return o>=l}recordJuggle(e,t,i,{wasFalling:s=!1}={}){var h,f;if(!s&&!((h=t.getHitVars)!=null&&h.fall)&&t.stateType!=="L")return;const r=e.isProjectile?e.owner:e;this.juggles.has(r)||this.juggles.set(r,new Map);const a=this.juggles.get(r),o=a.get(t.id),l=(f=(e.isProjectile?e.creator:e).asserted)==null?void 0:f.has("nojugglecheck"),c=l?0:e.isProjectile?i["air.juggle"]||0:(o==null?void 0:o.group)===i.juggleGroup?0:i.juggleCost||0;a.set(t.id,{remaining:Math.max(0,((o==null?void 0:o.remaining)??r.constant("data.airjuggle"))-c),group:i.juggleGroup})}bodyWidth(e,t,i=!1){return yu(e,t,{edge:i})}horizontalLimits(e){var a,o;const t=l=>{var c,h;return fn((h=(c=e.width)==null?void 0:c.edge)==null?void 0:h[e.facing===l?0:1])*e.coordinateScale},i=this.view;let s=this.orderedPhases?Math.max(this.leftBound,i.left+(((a=this.stage)==null?void 0:a.definition.screenLeft)||0)+t(-1)):this.stage?Math.max(this.leftBound,i.left+Math.max(this.stage.definition.screenLeft,this.bodyWidth(e,-1,!0))):this.leftBound+this.bodyWidth(e,-1,!0),r=this.orderedPhases?Math.min(this.rightBound,i.right-(((o=this.stage)==null?void 0:o.definition.screenRight)||0)-t(1)):this.stage?Math.min(this.rightBound,i.right-Math.max(this.stage.definition.screenRight,this.bodyWidth(e,1,!0))):this.rightBound-this.bodyWidth(e,1,!0);return s>r&&(s=r=(this.leftBound+this.rightBound)/2),{min:s,max:r}}applyCornerPush(e,t,i=0,s=e.coordinateScale){if(e instanceof is)return;if(this.orderedPhases){const l=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);e.cornerPush=Math.fround(i*s*l),e.cornerPushTarget=e.cornerPush?t:null,e.cornerPushSide=l,e.cornerPush?this.cornerPushActors.add(e):this.cornerPushActors.delete(e);return}if(!i||t.screenBound===!1)return;const{min:r,max:a}=this.horizontalLimits(t),o=t.pos.x===e.pos.x?e.facing:Math.sign(t.pos.x-e.pos.x);(o>0?t.pos.x<a-.01:t.pos.x>r+.01)||(e.cornerPush=i*s*o)}advanceCornerPush(e){for(const t of this.cornerPushActors){if(!t.cornerPush||t.destroyed){this.cornerPushActors.delete(t),t.cornerPushTarget=null;continue}if(e.has(t)||t._hitPausedThisTick)continue;const i=t.cornerPushTarget;if(i&&!i.destroyed&&i.screenBound!==!1){const{min:s,max:r}=this.horizontalLimits(i);(t.cornerPushSide>0?i.pos.x>=r:i.pos.x<=s)&&(t.pos.x=Math.fround(t.pos.x+t.cornerPush))}t.cornerPush=Math.fround(t.cornerPush*Math.fround(.7)),Math.abs(t.cornerPush)<t.coordinateScale&&(t.cornerPush=0),t.cornerPush||(t.cornerPushTarget=null,this.cornerPushActors.delete(t))}}constrainPositions({push:e=!0}={}){const t=this.entities,i=new Map(t.map(o=>[o,this.horizontalLimits(o)])),s=o=>{if(o.screenBound!==!1){const{min:l,max:c}=i.get(o);o.pos.x=Math.max(l,Math.min(c,o.pos.x))}};if(t.forEach(s),!this.pushboxes||!e)return!1;let r=!1;const a=t.filter(o=>o.playerPush!==!1).sort((o,l)=>o.id-l.id);for(let o=0;o<a.length;o++)for(let l=o+1;l<a.length;l++){const c=a[o],h=a[l];if(c.teamSide===h.teamSide)continue;const f=c.pos.y-kn(c,"size.height",60)*Gt(c),d=h.pos.y-kn(h,"size.height",60)*Gt(h);if(f>=h.pos.y||d>=c.pos.y||!yn(Ai(c,"clsn2"),Ai(h,"clsn2")))continue;const[u,m]=c.pos.x<=h.pos.x?[c,h]:[h,c],v=this.bodyWidth(u,1),g=this.bodyWidth(m,-1);for(let p=0;p<(this.orderedPhases?2:1);p++){const M=u.pos.x+v,T=m.pos.x-g,E=this.orderedPhases?Math.fround(Math.fround(M)-Math.fround(T)):u.pos.x+v-m.pos.x+g;if(E<=0||p&&!yn(Ai(c,"clsn2"),Ai(h,"clsn2")))break;const R=u.screenBound===!1?1/0:Math.max(0,u.pos.x-i.get(u).min),b=m.screenBound===!1?1/0:Math.max(0,i.get(m).max-m.pos.x),_=Math.min(E/2,R),y=Math.min(E-_,b),N=u.pos.x,I=m.pos.x;if(u.pos.x-=Math.min(E-y,R),m.pos.x+=y,this.orderedPhases&&(u.pos.x=Math.fround(u.pos.x),m.pos.x=Math.fround(m.pos.x)),s(u),s(m),r=!0,u.pos.x===N&&m.pos.x===I)break}}return r}}const nt=(n,e,t="")=>`
[Statedef ${n}]
${e}
${t}
`,xe=(n,e,t="1")=>`
[State 0, ${n}]
type = ${n}
trigger1 = ${t}
${e}
`,ot=(n,e,t=1)=>xe("ChangeState",`value = ${n}
ctrl = ${t}`,e),Qe=(n,e="time = 0")=>xe("ChangeAnim",`value = ${n}`,`(${e}) && selfanimexist(${n})`);function sh({orderedPhases:n=!1}={}){return[nt(0,`type = S
movetype = I
physics = S
ctrl = 1`,Qe(0,"anim != 0")+xe("VelSet","y = 0","time = 0")+(n?xe("VelSet","x=0","time>=4 || abs(vel x)<const(movement.stand.friction.threshold)"):"")),nt(10,`type = C
movetype = I
physics = C`+(n?`
velset=0,0`:""),Qe(10)+ot(11,"animtime = 0 || !selfanimexist(10)")),nt(11,`type = C
movetype = I
physics = C
ctrl = 1`,Qe(11)),nt(12,`type = S
movetype = I
physics = S`,Qe(12)+ot(0,"animtime = 0 || !selfanimexist(12)")),nt(20,`type = S
movetype = I
physics = S
ctrl = 1`,xe("VelSet","x = const(velocity.walk.fwd.x)",'command = "holdfwd"')+xe("VelSet","x = const(velocity.walk.back.x)",'command = "holdback"')+Qe(20,"vel x > 0 && anim != 20")+Qe(21,"vel x < 0 && anim != 21")),nt(40,`type = S
movetype = I
physics = S
ctrl = 0`,Qe(40)+xe("VelSet",`x = ifelse(command = "holdfwd", const(velocity.jump.fwd.x), ifelse(command = "holdback", const(velocity.jump.back.x), const(velocity.jump.neu.x)))
y = const(velocity.jump.y)`,"animtime = 0 || !selfanimexist(40)")+ot(50,"animtime = 0 || !selfanimexist(40)")),nt(45,`type = A
movetype = I
physics = A
ctrl = 1`,xe("VelSet",`x = ifelse(command = "holdfwd", const(velocity.airjump.fwd.x), ifelse(command = "holdback", const(velocity.airjump.back.x), const(velocity.airjump.neu.x)))
y = const(velocity.airjump.y)`,"time = 0")+ot(50,"time > 0")),nt(50,`type = A
movetype = I
physics = A
ctrl = 1`,Qe("ifelse(vel x = 0, 41, ifelse(vel x > 0, 42, 43))")+ot(52,"pos y >= 0 && vel y > 0",0)),nt(51,`type = A
movetype = I
physics = A`),nt(52,`type = S
movetype = I
physics = S
ctrl = 0`+(n?`
velset=0,0
anim=47`:""),Qe(47)+xe("PosSet","y = 0","time = 0")+xe("VelSet","y = 0","time = 0")+(n?xe("CtrlSet","value=1","time>=3"):"")+ot(0,"time >= 3 && (animtime = 0 || !selfanimexist(47))")),nt(100,`type = S
movetype = I
physics = `+(n?"S":"N")+`
ctrl = 1`,Qe(100)+xe("VelSet","x = const(velocity.run.fwd.x)")+xe("AssertSpecial",`flag = nowalk
flag2 = noautoturn`)+ot(0,'command != "holdfwd"')),nt(105,`type = A
movetype = I
physics = A
ctrl = 0`,Qe(105)+(n?xe("CtrlSet","value=1","time>=2"):"")+xe("VelSet",`x = const(velocity.run.back.x)
y = const(velocity.run.back.y)`,"time = 0")+ot(n?106:52,"pos y >= 0 && vel y > 0",0)),...n?[nt(106,`type=S
movetype=I
physics=S
ctrl=0`,Qe(47)+xe("PosSet","y=0")+xe("VelSet","y=0")+xe("VelSet","x=0","abs(vel x)<const(movement.stand.friction.threshold)")+ot(0,"time>=7"))]:[],...n?[nt(120,`type=U
movetype=I
physics=U
ctrl=1`,Qe("ifelse(statetype=A,122,ifelse(statetype=C,121,120))")+xe("VelSet",`x=0
y=0`,"statetype!=A")+xe("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'command!="holdback"')+xe("ChangeState",`value=ifelse(statetype=A,132,ifelse(statetype=C,131,130))
ctrl=1`,"animtime=0 || !selfanimexist(ifelse(statetype=A,122,ifelse(statetype=C,121,120)))")),nt(140,`type=U
movetype=I
physics=U
ctrl=1`,Qe("ifelse(statetype=A,142,ifelse(statetype=C,141,140))")+xe("ChangeState",`value=ifelse(statetype=A,50,ifelse(statetype=C,11,0))
ctrl=1`,'animtime=0 || command!="holdback"'))]:[],...[[120,"S",130],[130,"S",130],[131,"C",131],[132,"A",132],[140,"S",130]].filter(([e])=>!n||e!==120&&e!==140).map(([e,t,i])=>nt(e,`type = ${t}
movetype = I
physics = ${t}
ctrl = 1${t==="A"?"":`
velset = 0,0`}`,Qe(i)+(n?ot(140,"!inguarddist"):"")+ot(t==="A"?50:t==="C"?11:0,'command != "holdback"'))),...[[150,"S",150,151],[152,"C",151,153],[154,"A",152,155]].map(([e,t,i,s])=>nt(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,Qe(i)+ot(s,"hitshakeover",0))),...[[151,"S",150],[153,"C",151],[155,"A",152]].map(([e,t,i])=>nt(e,`type=${t}
movetype=H
physics=${t==="A"?"N":t}
ctrl=0`,Qe(i)+xe("HitVelSet",`x=1
y=1`,"time=0")+xe("CtrlSet","value=1","time>=gethitvar(ctrltime)")+(t==="A"?xe("Gravity","")+ot(52,"pos y>=0 && vel y>0",0)+ot(132,"time>=gethitvar(ctrltime)"):xe("VelSet","x=0","time>=gethitvar(slidetime)||hitover")+xe("StateTypeSet",`statetype=C
physics=C`,'command="holddown"')+xe("StateTypeSet",`statetype=S
physics=S`,'command!="holddown"')+xe("ChangeState",`value=${n?"ifelse(inguarddist,ifelse(statetype=C,131,130),140)":"ifelse(statetype=C,131,130)"}
ctrl=1`,"hitover")))),...[[5e3,"S","ifelse(gethitvar(groundtype)=2,5010,5000)"],[5010,"C","5020"],[5020,"A","5030"]].map(([e,t,i])=>{const s="5030+gethitvar(animtype)",r="5050+gethitvar(animtype)-3",a=n?`ifelse(gethitvar(animtype)>=3,ifelse(gethitvar(animtype)=3,5030,ifelse(selfanimexist(${r}),${r},5030)),ifelse((gethitvar(fall)||gethitvar(yvel)!=0)&&selfanimexist(${s}),${s},${i}+gethitvar(animtype)))`:`ifelse(gethitvar(animtype)>=3,5030,${i}+gethitvar(animtype))`;return nt(e,`type=${t}
movetype=H
physics=N
ctrl=0
velset=0,0`,xe("ChangeAnim",`value=${a}`,`time=0 && selfanimexist(${a})`)+(n?xe("StateTypeSet","statetype=A","gethitvar(yvel)!=0 || pos y!=0"):"")+xe("ChangeState",`value=${t==="A"?"5030":`ifelse(gethitvar(fall)||gethitvar(yvel)!=0||pos y!=0,5030,${e+1})`}
ctrl=0`,"hitshakeover"))}),...[[5001,"S"],[5011,"C"]].map(([e,t])=>nt(e,`type=${t}
movetype=H
physics=${t}
ctrl=0`,(n?Qe("anim"):"")+xe("HitVelSet","x=1","time=0")+xe("VelMul","x=.6","time>=gethitvar(slidetime)")+(n?Qe("anim+5","animtime=0 && (anim=[5000,5002] || anim=[5010,5012] || anim=[5020,5022])"):"")+xe("VelSet","x=0","hitover")+xe("DefenceMulSet","value=1","hitover")+ot(0,"hitover"))),...[5030,5035].map(e=>{const t=xe("VelAdd","y=gethitvar(yaccel)",e===5030?"time>0":n?"time>0 || prevstateno!=5030":"1"),i=xe("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"hitover || (vel y>0 && pos y>=0)")+(e===5030?n?xe("ChangeState",`value=ifelse(anim=[5050,5059],5050,5035)
ctrl=0`,"animtime=0"):ot(5035,"animtime=0",0):xe("ChangeState",`value=ifelse(gethitvar(fall),5050,5040)
ctrl=0`,"animtime=0 || !selfanimexist(5035)"));return nt(e,`type=A
movetype=H
physics=N
ctrl=0`,(e===5030?(n?Qe("ifelse(gethitvar(fall),anim,5030)"):"")+xe("HitVelSet",`x=1
y=1`,"time=0"):Qe(5035))+t+i)}),nt(5040,`type=A
movetype=H
physics=N
ctrl=1`,Qe(5040)+xe("VelAdd","y=gethitvar(yaccel)")+ot(5050,"!alive",0)+ot(52,"pos y>=0 && vel y>0",0)+ot(50,"animtime=0 || !selfanimexist(5040)")),nt(5050,`type=A
movetype=H
physics=N
ctrl=0`,(n?Qe("5050+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)","(time=0 && anim=5030 && animtime=-1) || (animtime=0 && (anim<5050 || anim>5069))")+Qe("anim+10","vel y>Const240p(-2) && anim=[5051,5052]"):Qe(5050))+xe("SelfState","value=5210",'alive && CanRecover && command="recovery"')+ot(5100,n?"vel y>0 && pos y>=ifelse(anim=5050 || anim=5035,const(movement.air.gethit.groundlevel),0)":"pos y>=0 && vel y>0",0)+xe("VelAdd","y=gethitvar(yaccel)",n?"time>0 || (prevstateno!=5030 && prevstateno!=5035)":"1")),nt(5070,`type=A
movetype=H
physics=N
ctrl=0
velset=0,0`,Qe(5070)+ot(5071,"hitshakeover",0)),nt(5071,`type=A
movetype=H
physics=N
ctrl=0`,(n?Qe("anim"):"")+xe("HitVelSet",`x=1
y=1`,"time=0")+xe("VelAdd","y=gethitvar(yaccel)",n?"time>0":"1")+ot(5110,"vel y>0 && pos y>=const(movement.air.gethit.trip.groundlevel)",0)),nt(5080,`type=L
movetype=H
physics=N
ctrl=0
velset=0,0`,Qe(5080)+ot(5030,"hitshakeover && gethitvar(yvel)!=0",0)+ot(5081,"hitshakeover && gethitvar(yvel)=0",0)),nt(5081,`type=L
movetype=H
physics=C
ctrl=0`,xe("HitVelSet","x=1","time=0")+xe("VelSet","x=0","hitover")+ot(5110,"hitover",0)),nt(5100,`type = L
movetype = H
physics = N
ctrl = 0`+(n?"":`
velset = 0,0`),xe("PosSet","y = 0")+(n?xe("PosFreeze","value=1")+xe("VelMul","x=.75","time=0")+xe("VelSet","y=0","time=0"):"")+xe("HitFallDamage","",n?"time=3":"time=0")+xe("FallEnvShake","","time=0")+Qe(n?"ifelse(selfanimexist(5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0)),5100+ifelse(gethitvar(animtype)>=3,gethitvar(animtype)-3,0),5100)":5100)+ot(5110,"time>=1 && gethitvar(fall.yvel)=0",0)+ot(5101,"time>=1 && (animtime=0 || time>=12 || !selfanimexist(5100))",0)),nt(5101,`type=L
movetype=H
physics=N
ctrl=0`,Qe(5160)+xe("HitFallVel","","time=0")+xe("PosSet","y=const(movement.down.bounce.offset.y)","time=0")+xe("PosAdd","x=const(movement.down.bounce.offset.x)","time=0")+(n?xe("PosFreeze","value=1","time=0"):"")+xe("VelAdd","y=const(movement.down.bounce.yaccel)",n?"time>0":"1")+ot(5110,"time>0 && vel y>0 && pos y>=const(movement.down.bounce.groundlevel)",0)),nt(5110,`type = L
movetype = H
physics = N
ctrl = 0`,xe("PosSet","y=0","time=0")+xe("VelSet","y=0","time=0")+(n?Qe("ifelse(selfanimexist(5170),5170,5110)")+Qe(5110,"animtime=0 && anim!=5110")+xe("VelMul","x=const(movement.stand.friction)")+xe("VelSet","x=0","abs(vel x)<const(movement.down.friction.threshold)"):Qe(5110))+ot(5150,"!alive",0)+ot(5120,"time>=1 && gethitvar(recovertime)<=0",0)),nt(5120,(n?`type=L
physics=N`:`type=S
physics=S`)+`
movetype=I
ctrl=0`,Qe(5120)+xe("SelfState",`value=0
ctrl=1`,"animtime = 0 || !selfanimexist(5120)")),nt(5150,`type = L
movetype = H
physics = N
ctrl = 0
velset = 0,0`,Qe(5110)),nt(5200,`type=A
movetype=H
physics=N
ctrl=0`,Qe(5050,"anim=5035 && animtime=0")+xe("VelAdd","y=gethitvar(yaccel)","time>0")+xe("SelfState",`value=5201
ctrl=0`,"vel y>0 && pos y>=const(movement.air.gethit.groundrecover.groundlevel)")),nt(5201,`type=A
movetype=H
physics=A
ctrl=0
anim=5200`,xe("Turn","","time=0 && p2dist x<const720p(-20)")+xe("VelSet",`x=const(velocity.air.gethit.groundrecover.x)
y=const(velocity.air.gethit.groundrecover.y)`,"time=0")+xe("PosSet","y=0","time=0")+xe("NotHitBy",`value=SCA
time=1`)+xe("PalFX",`time=3
add=128,128,128`,"time=0")+xe("Explod",`anim=F60
pos=0,0
sprpriority=-10`,"time=0")+ot(52,"vel y>0 && pos y>=0",1)),nt(5210,`type=A
movetype=I
physics=N
ctrl=0`,Qe(5210)+xe("PosFreeze","value=1","time<4")+xe("VelMul",n?`x=const(velocity.air.gethit.airrecover.mul.x)
y=const(velocity.air.gethit.airrecover.mul.y)`:`x=.5
y=.2`,"time=4")+xe("VelAdd",n?`x=const(velocity.air.gethit.airrecover.add.x)
y=const(velocity.air.gethit.airrecover.add.y)`:"y=Const240p(-4.5)","time=4")+xe("NotHitBy","value=SCA",n?"time<20":"time<4")+(n?xe("VelAdd","y=const(movement.air.gethit.airrecover.yaccel)","time>=4")+xe("CtrlSet","value=1","time>=20")+ot(52,"pos y>=0 && vel y>0",0):ot(50,"time>=4")))].join(`
`)}sh();class nd{constructor({maxBytes:e=16*1024*1024,requireRepeat:t=!1,probationLimit:i=4096}={}){if(!Number.isSafeInteger(e)||e<0)throw new RangeError("Invalid sprite restore cache budget.");if(!Number.isSafeInteger(i)||i<1)throw new RangeError("Invalid sprite cache probation capacity.");this.limit=e,this.requireRepeat=!!t,this.probationLimit=i,this.probation=new Set,this.deferredAdmissions=0,this.promotions=0,this.entries=new Map,this.bytes=0,this.hits=0,this.misses=0,this.evictions=0,this.stores=0}get(e){const t=this.entries.get(e);return t?(this.entries.delete(e),this.entries.set(e,t),this.hits++,t):(this.misses++,null)}put(e,t){if(typeof e!="string"||!(t instanceof Uint8Array)||!t.length||t.byteLength>this.limit||!this.limit)return!1;if(this.requireRepeat&&!this.entries.has(e)){if(!this.probation.has(e))return this.probation.add(e),this.probation.size>this.probationLimit&&this.probation.delete(this.probation.values().next().value),this.deferredAdmissions++,!1;this.probation.delete(e),this.promotions++}const i=this.entries.get(e);i&&(this.entries.delete(e),this.bytes-=i.byteLength);const s=new Uint8Array(t);for(;this.bytes+s.byteLength>this.limit;){const r=this.entries.keys().next().value;if(r===void 0)break;const a=this.entries.get(r);this.entries.delete(r),this.bytes-=a.byteLength,this.evictions++}return this.entries.set(e,s),this.bytes+=s.byteLength,this.stores++,!0}get stats(){return{hits:this.hits,misses:this.misses,stores:this.stores,evictions:this.evictions,bytes:this.bytes,entries:this.entries.size,budgetBytes:this.limit,deferredAdmissions:this.deferredAdmissions,promotions:this.promotions,probationEntries:this.probation.size}}clear(){this.entries.clear(),this.probation.clear(),this.bytes=0}}function sd(n){const e=new Map;for(const t of n||[])e.has(t.index)||e.set(t.index,t);return e}function Ba(n=""){if(n=String(n).toUpperCase(),n==="S"||n==="SUB")return{mode:"subtract",source:1,destination:1};if(n==="A"||n==="ADD")return{mode:"add",source:1,destination:1};if(n==="A1"||n==="ADD1")return{mode:"add",source:1,destination:.5};const e=/^AS([\d.]+)D([\d.]+)$/.exec(n);return e?{mode:"add",source:Math.max(0,Math.min(256,+e[1]))/256,destination:Math.max(0,Math.min(256,+e[2]))/256}:{mode:"normal",source:1,destination:0}}function rd(n=0,e=0,t=0){const i=h=>{if(typeof h!="number"||!Number.isFinite(h))throw Error("Sprite angles must be finite numbers.");const f=h%360*Math.PI/180,d=u=>Math.abs(u)<1e-12?0:Math.abs(1-Math.abs(u))<1e-12?Math.sign(u):u;return[d(Math.cos(f)),d(Math.sin(f))]},[s,r]=i(n),[a,o]=i(e),[l,c]=i(t);return{a:l*s,b:o*c*s-a*r,c:l*r,d:a*s+o*c*r}}function gr(n,e,t=0){var l;const i=n==null?void 0:n.frames[e];if(!i)return null;if(!((l=i.interpolate)!=null&&l.length)||i.ticks<=0)return i;const s=n.frames[e+1]||n.frames[n.loopStart||0];if(!s)return i;const r=Math.max(0,Math.min(1,t/i.ticks)),a={...i},o=(c,h)=>c+(h-c)*r;for(const c of i.interpolate)if(c==="offset"&&(a.x=o(i.x,s.x),a.y=o(i.y,s.y)),c==="scale"&&(a.scaleX=o(i.scaleX??1,s.scaleX??1),a.scaleY=o(i.scaleY??1,s.scaleY??1)),c==="angle"&&(a.angle=o(i.angle||0,s.angle||0)),c==="blend"){const h=Ba(i.blend),f=Ba(s.blend);h.mode==="add"&&f.mode==="add"&&(a.blend=`AS${o(h.source,f.source)*256}D${o(h.destination,f.destination)*256}`)}return a}function rh(n){var r;const e=gr(n.collisionAnimation??n.animation??((r=n.animations)==null?void 0:r.get(n.anim)),n.collisionFrameIndex??n.frameIndex,n.collisionFrameTime??n.frameTime)??n.collisionFrame??n.currentFrame;if(!e)return null;const t=th(n);if(t===n)return e;const i=(a,o)=>{var l,c;return((c=(l=a.program)==null?void 0:l.constants)==null?void 0:c.get(o))??1},s=(a,o)=>{const l=Gt(n)*i(n,o);return l?(e[a]||0)*Gt(t)*i(t,o)/l:0};return{...e,x:s("x","size.xscale"),y:s("y","size.yscale")}}function Il(n,e,t,i,s,r,a=256){if(!i)return[0];if(!Number.isFinite(t)||t<=0||!Number.isFinite(e)||e<=0)return[];let o=i===1?Math.floor((s-n-e)/t):0,l=i===1?Math.ceil((r-n)/t):Math.max(0,Math.trunc(i)-1);return Math.max(0,l-o+1)>a&&(l=o+a-1),Array.from({length:Math.max(0,l-o+1)},(h,f)=>o+f)}function Os(n,e,t=0){return n.animated?n.spacing[t]:e+n.spacing[t]}function Ll(n,e,t,i,s=0){const r=i>1?t/(i-1):0,a=n.width?n.width[0]/e:n.xscale[0],o=n.width?n.width[1]/e:n.xscale[1],l=a+(o-a)*r,c=n.yScaleStart+s*n.yScaleDelta;return{x:n.width?l:1,delta:n.width?a?l/a:1:l,y:c>0?1/c:0}}const ad=(n,e)=>Array.isArray(n)?n.slice(0,3).map((t,i)=>Number(t??e[i])):[...e],od=(n,e=0,t=255)=>Math.max(e,Math.min(t,n)),Sn=(n,e={})=>({...e,...n,age:0,remaining:n.time??e.time??1}),qt=n=>n&&(n.remaining<0||n.remaining>0);function Qr(n){n&&(n.age++,n.remaining>0&&n.remaining--)}class Nl{constructor(){this.palettes=new Map,this.afterimages=new Map,this.all=null,this.background=null,this.shake=null,this.environment=null,this.diagnostics=[]}advance({paused:e=()=>!1,backgroundPaused:t=!1}={}){for(const[i,s]of this.palettes)e(i)||Qr(s),qt(s)||this.palettes.delete(i);for(const[i,s]of this.afterimages)e(i)||Qr(s),qt(s)||this.afterimages.delete(i);if(!t)for(const i of[this.all,this.background,this.shake,this.environment])Qr(i)}consume(e,{entity:t}={}){for(const i of e||[]){const s=String(i.type).toLowerCase();if(s==="palfx"&&t){const r=mr(t),a=Sn(Kr(i));qt(a)?this.palettes.set(r,a):this.palettes.delete(r)}else if(s==="allpalfx")this.all=Sn(Kr(i));else if(s==="bgpalfx")this.background=Sn(Kr(i));else if(s==="envshake"){const r=i.coordinateScale??(t==null?void 0:t.coordinateScale)??1;this.shake=Sn(i,{time:0,freq:60,ampl:-4/r,phase:i.freq>=90?90:0,coordinateScale:r})}else if(s==="envcolor")this.environment=Sn(i,{value:[255,255,255],under:0});else if(s==="palettesnapshot"&&i.target)i.target.paletteSnapshot={layers:[],key:"[]"};else if(s==="afterimage"&&t){const r=Sn(i,{time:1,length:20,timegap:1,framegap:4,palcolor:256,palbright:[30,30,30],palcontrast:[120,120,220],palpostbright:[0,0,0],paladd:[10,10,25],palmul:[.65,.65,.75],trans:"none"});r.length=od(Math.trunc(r.length),0,60),r.timegap=Math.max(1,Math.trunc(r.timegap)),r.framegap=Math.max(1,Math.trunc(r.framegap)),r.frames=[],qt(r)&&r.length?this.afterimages.set(t,r):this.afterimages.delete(t)}else if(s==="afterimagetime"&&this.afterimages.has(t)){const r=this.afterimages.get(t);r.remaining=i.time??i.value??0,qt(r)||this.afterimages.delete(t)}}}capture(e,{paused:t=()=>!1}={}){for(const i of e){const s=this.afterimages.get(i);if(!qt(s)||t(i)||s.age%s.timegap!==0||s.lastAge===s.age)continue;const r=rh(i);r&&(s.lastAge=s.age,s.frames.unshift({entity:i,frame:{...r},pos:{...i.pos},facing:i.facing,coordinateScale:Gt(i),character:i.character,drawScale:{...i.drawScale},drawOffset:{...i.drawOffset},angle:i.angleDraw?i.angle:0,sizeX:i.constant("size.xscale"),sizeY:i.constant("size.yscale"),paletteRemaps:new Map(i.paletteRemaps)}),s.frames.length=Math.min(s.frames.length,s.length))}}paletteFor(e,{ownpal:t=(e==null?void 0:e.ownPal)??(e==null?void 0:e.ownpal),ignoreLocal:i=!1,includeAll:s=!0}={}){const r=i?null:t?e:mr(e),a=this.palettes.get(r);let o=qt(a)?[a]:[];return o=[...o,...s&&qt(this.all)?[this.all]:[]].map(l=>Object.fromEntries(Object.entries(l).map(([c,h])=>[c,Array.isArray(h)?[...h]:h]))),{layers:o,key:JSON.stringify(o.map(({add:l,mul:c,sinadd:h,color:f,invertall:d,age:u})=>({add:l,mul:c,sinadd:h,color:f,invertall:d,age:h?u:0})))}}get backgroundPalette(){const e=[this.background,this.all].filter(qt);return{layers:e,key:JSON.stringify(e)}}get cameraOffset(){if(!qt(this.shake))return{x:0,y:0};const e=this.shake;return{x:0,y:-Number(e.ampl)*e.coordinateScale*Math.sin((Number(e.phase)+e.age*Number(e.freq))*Math.PI/180)}}get environmentColor(){return qt(this.environment)?this.environment:null}trailsFor(e){const t=this.afterimages.get(e);if(!qt(t))return[];const i=[];for(let s=0;s<t.frames.length;s+=t.framegap){const r=[{color:t.palcolor,invertall:t.palinvertall,add:t.palbright,mul:t.palcontrast,postadd:t.palpostbright}];for(let a=0;a<s;a++)r.push({add:t.paladd,mul:ad(t.palmul,[1,1,1]).map(o=>o*256)});qt(this.all)&&r.push(this.all),i.push({...t.frames[s],palette:{layers:r,key:JSON.stringify(r)},trans:t.trans})}return i.reverse()}cleanup(e,{paletteOwners:t=e}={}){const i=new Set(e),s=new Set;for(const r of t){const a=mr(r);a&&s.add(a)}for(const r of this.palettes.keys())s.has(r)||this.palettes.delete(r);for(const r of this.afterimages.keys())i.has(r)||this.afterimages.delete(r)}}const Xe=127,Ke=125,On=124,ld=new Set("time stateno prevstateno anim animtime ctrl life lifemax power powermax facing alive gametime hitpausetime hitshakeover hitover movecontact movehit moveguarded movereversed hitcount uniqhitcount numenemy numpartner numproj roundstate roundno matchno teamside teampower tickspersecond ailevel palno id win lose drawgame inguarddist canrecover roundsexisted hitfall ishometeam winko wintime winperfect loseko losetime loseperfect".split(" ")),cd=new Set("pos x|pos y|vel x|vel y|p2dist x|p2dist y|p2bodydist x|p2bodydist y|parentdist x|parentdist y|rootdist x|rootdist y|screenpos x|screenpos y|hitvel x|hitvel y|camerapos x|camerapos y|camerazoom|gamewidth|gameheight|screenwidth|screenheight|leftedge|rightedge|topedge|bottomedge|frontedge|backedge|frontedgedist|backedgedist|frontedgebodydist|backedgebodydist".split("|")),hd=new Set("var sysvar animelemtime animelemno animexist selfanimexist projhit projcontact projguarded numprojid playeridexist projcanceltime projcontacttime projguardedtime projhittime numhelper numexplod numtarget ishelper".split(" ")),ud=new Set(["fvar","sysfvar","const240p","const480p","const720p"]),dd=new Set("name authorname p1name p2name p3name p4name statetype movetype physics p2statetype p2movetype teammode".split(" ")),fd=new Set("xveladd yveladd xoff yoff zoff xvel yvel yaccel fall.xvel fall.yvel fall.envshake.freq fall.envshake.phase".split(" ")),Ar=["sin","cos","tan","asin","acos","atan","exp","ln"],pd=new TextEncoder,di=n=>{const e=[];do{const t=n&127;n>>>=7,e.push(t|(n?128:0))}while(n);return e},md=n=>{n|=0;const e=[];for(;;){const t=n&127;n>>=7;const i=n===0&&!(t&64)||n===-1&&!!(t&64);if(e.push(t|(i?0:128)),i)return e}},ea=n=>{const e=pd.encode(n);return[...di(e.length),...e]},ln=n=>[...di(n.length),...n.flat()],ns=(n,e)=>[n,...di(e.length),...e],jt=n=>[65,...md(n)],ka=n=>{const e=new Uint8Array(4);return new DataView(e.buffer).setFloat32(0,n,!0),[67,...e]},ta=[68,0,0,0,0,0,0,0,0],Bn=n=>[16,...di(n)],Qt=n=>[32,...di(n)],Mn=n=>[33,...di(n)],oi=(n,e)=>n.type===e?n.code:[...n.code,n.type===Xe?e===Ke?178:183:187],Bs=n=>n.type===Xe?[...n.code,69,69]:[...n.code,...ka(0),92],ss=n=>[...n,...Bn(2)],gt=(n,e)=>({type:n,code:e});class Zi extends Error{}class rs extends Error{}class gd{constructor(e){this.trigger=e,this.locals=[]}local(e){return this.locals.push(e),this.locals.length-1}read(e,t=[]){const i=cd.has(e)||ud.has(e)?Ke:ld.has(e)||hd.has(e)?Xe:null;if(!i||t.length>2)throw new Zi;const s=[...jt(this.trigger(e)),...jt(t.length)];for(let r=0;r<2;r++)s.push(...t[r]?oi(this.node(t[r]),On):ta);return s.push(...Bn(i===Xe?0:1)),gt(i,s)}literal(e,t=Xe){return gt(t,[...jt(this.trigger(e)),...jt(0),...ta,...ta,...Bn(t===Xe?0:1)])}node(e){var t;if(e.kind==="number"){if(e.float&&!Number.isFinite(Math.fround(e.value)))throw new Zi;return gt(e.float?Ke:Xe,e.float?ka(e.value):jt(e.value))}if(e.kind==="name")return e.name==="pi"||e.name==="e"?gt(Ke,ka(e.name==="pi"?Math.PI:Math.E)):this.read(e.name);if(e.kind==="unary"){const i=this.node(e.value);if(e.op==="+")return i;if(e.op==="!")return gt(Xe,[...Bs(i),69]);if(e.op==="-")return gt(i.type,i.type===Xe?[...jt(0),...i.code,107]:[...i.code,140]);if(e.op==="~"&&i.type===Xe)return gt(Xe,[...i.code,...jt(-1),115]);throw new Zi}if(e.kind==="legacyanim")return this.binary(e.op,this.read("animelemtime",[e.element]),this.node(e.time));if(e.kind==="legacytime"){if(e.divisor.value<=0)throw new Zi;return this.binary(e.op,this.binary("%",this.read("time"),this.node(e.divisor)),this.node(e.remainder))}if(e.kind==="range"){const i=[this.node(e.left),this.node(e.low),this.node(e.high)],s=i.some(l=>l.type===Ke)?Ke:Xe,r=i.map(()=>this.local(s)),a=[];i.forEach((l,c)=>a.push(...oi(l,s),...Mn(r[c])));const o=l=>gt(s,Qt(r[l]));return a.push(...this.binary(e.includeLow?">=":">",o(0),o(1)).code,...this.binary(e.includeHigh?"<=":"<",o(0),o(2)).code,113),e.op==="!="&&a.push(69),gt(Xe,a)}if(e.kind==="command"){const i=this.literal({name:"command",args:[e.command]});return e.op==="="?i:gt(Xe,[...i.code,69])}if(e.kind==="legacyattribute"){const i=this.literal({name:"hitdefattr",args:e.attributes});return e.op==="="?i:gt(Xe,[...i.code,69])}if(e.kind==="binary")return["=","!="].includes(e.op)&&e.left.kind==="name"&&dd.has(e.left.name)&&e.right.kind==="string"?this.literal({name:e.left.name,match:e.right.value,invert:e.op==="!="}):this.binary(e.op,this.node(e.left),this.node(e.right));if(e.kind==="call"){if(e.name==="cond"){const s=this.node(e.args[0]),r=this.node(e.args[1]),a=this.node(e.args[2]);if(r.type!==a.type)throw new Zi;return gt(r.type,[...Bs(s),4,r.type,...r.code,5,...a.code,11])}if(["const","gethitvar"].includes(e.name)&&["name","string"].includes((t=e.args[0])==null?void 0:t.kind)){const s=e.args[0].name??e.args[0].value,r=e.name==="const"?/^(?:velocity\.|movement\.(?!airjump\.)|size\.[xy]scale$|data\.fall\.defence_mul$)/.test(s)?Ke:Xe:fd.has(s)?Ke:Xe;return this.literal({name:e.name,args:[s]},r)}const i=e.args.map(s=>this.node(s));if(e.name==="abs"){const s=i[0];if(s.type===Ke)return gt(Ke,[...s.code,139]);const r=this.local(Xe);return gt(Xe,[...s.code,...Mn(r),...Qt(r),...jt(0),72,4,Xe,...jt(0),...Qt(r),107,5,...Qt(r),11])}if(e.name==="min"||e.name==="max"){if(i.some(a=>a.type===Ke))return gt(Ke,[...oi(i[0],Ke),...oi(i[1],Ke),e.name==="min"?150:151]);const s=this.local(Xe),r=this.local(Xe);return gt(Xe,[...i[0].code,...Mn(s),...i[1].code,...Mn(r),...Qt(s),...Qt(r),e.name==="min"?72:74,4,Xe,...Qt(s),5,...Qt(r),11])}return e.name==="ceil"||e.name==="floor"?gt(Xe,[...oi(i[0],Ke),e.name==="ceil"?141:142,187,...Bn(3)]):e.name==="sqrt"?gt(Ke,ss([...oi(i[0],Ke),145])):Ar.includes(e.name)?gt(Ke,ss([...oi(i[0],Ke),...Bn(4+Ar.indexOf(e.name))])):e.name==="log"?gt(Ke,ss([...oi(i[0],Ke),...oi(i[1],Ke),...Bn(12)])):this.read(e.name,e.args)}throw new Zi}binary(e,t,i){if(["&&","||","^^"].includes(e))return gt(Xe,[...Bs(t),...Bs(i),e==="&&"?113:e==="||"?114:115]);const s=t.type===Ke||i.type===Ke?Ke:Xe,r=[...oi(t,s),...oi(i,s)],a={"=":[70,91],"!=":[71,92],"<":[72,93],">":[74,94],"<=":[76,95],">=":[78,96]};if(a[e])return gt(Xe,[...r,a[e][+(s===Ke)]]);const o={"+":[106,146],"-":[107,147],"*":[108,148]};if(o[e])return r.push(o[e][+(s===Ke)]),gt(s,s===Ke?ss(r):r);if(e==="/"){if(s===Ke)return gt(Ke,ss([...r,149]));const l=this.local(Xe),c=this.local(Xe);return gt(Xe,[...t.code,...Mn(l),...i.code,...Mn(c),...Qt(l),...jt(-2147483648),70,...Qt(c),...jt(-1),70,113,4,Xe,...jt(-2147483648),5,...Qt(l),...Qt(c),109,11])}if(s===Xe&&["%","&","|","^"].includes(e))return gt(Xe,[...r,{"%":111,"&":113,"|":114,"^":115}[e]]);throw new Zi}}function _d(n){const e=(a,o)=>[96,...ln(a.map(l=>[l])),1,o],t=[e([Xe,Xe,On,On],Xe),e([Xe,Xe,On,On],Ke),e([Ke],Ke),e([On],Xe),e([Ke,Ke],Ke),e([],Xe),e([],Ke)],i=[["readInt",0],["readFloat",1],["finite",2],["wrap",3],...Ar.map(a=>[a,2]),["log",4]].map(([a,o])=>[...ea("host"),...ea(a),0,...di(o)]),s=n.map((a,o)=>[...ea("e"+o),0,...di(i.length+o)]),r=n.map(a=>{const o=[];for(const c of a.locals){const h=o.at(-1);(h==null?void 0:h[1])===c?h[0]++:o.push([1,c])}const l=[...ln(o.map(([c,h])=>[...di(c),h])),...a.code,11];return[...di(l.length),...l]});return new Uint8Array([0,97,115,109,1,0,0,0,...ns(1,ln(t)),...ns(2,ln(i)),...ns(3,ln(n.map(a=>di(a.type===Xe?5:6)))),...ns(7,ln(s)),...ns(10,ln(r))])}class vd{constructor(e=[],{maxFunctions:t=4096,maxBytes:i=2*1024*1024}={}){var d;if(!Number.isInteger(t)||t<0||t>16384||!Number.isInteger(i)||i<0||i>16*1024*1024)throw RangeError("Invalid numeric compilation budget.");this.context=null,this.entries=new Map,this.triggers=[],this.counts={wasm:0,direct:0,interpreted:0,deoptimized:0,compiled:0,bytes:0};const s=new Map,r=[],a=[],o=u=>{const m=JSON.stringify(u);return s.has(m)||(s.set(m,this.triggers.length),this.triggers.push(typeof u=="string"?{name:u}:u)),s.get(m)};let l=0;for(const u of new Set(e))if(!(typeof u!="string"||!u.trim()||r.length>=t))try{const m=new gd(o),v=Su(u),g=m.node(v);if((l+=g.code.length)>i)break;const p=["var","fvar","sysvar","sysfvar"],M=v.kind==="call"&&p.includes(v.name)&&((d=v.args)==null?void 0:d.length)===1&&v.args[0].kind==="number"&&!v.args[0].float&&Number.isSafeInteger(v.args[0].value)?{name:v.name,args:[v.args[0].value]}:null,T=v.kind==="name"&&v.name!=="pi"&&v.name!=="e"?{name:v.name,args:[]}:null;a.push({source:u,type:g.type,direct:M||T}),r.push({...g,locals:m.locals})}catch(m){if(!(m instanceof Zi)&&!(m instanceof Zr))throw m}if(!r.length)return;const c=(u,m,v,g,p)=>{if(typeof this.context.resolve!="function")throw new Mu("Trigger resolution is unavailable.");const M=this.triggers[u],T=this.context.resolve(M.name,M.args||(m===0?[]:m===1?[v]:[v,g]),null);let E=T;if(M.match!==void 0)if(T!=null&&T.absent)E=+M.invert;else if(typeof T=="string")E=+(T===M.match!=!!M.invert);else throw new rs;if(typeof T=="boolean")E=+T;else if(T&&typeof T.value=="number"){if(!p&&(T.type==="float"||T.float))throw new rs;E=T.value}if(typeof E!="number")throw new rs;if(!Number.isFinite(E))throw new vn("Expression produced a non-finite number.");if(!p&&!Number.isInteger(E))throw new rs;if(p){if(E=Math.fround(E),!Number.isFinite(E))throw new vn("Expression produced a non-finite number.");return E}return E|0},h={readInt:(...u)=>c(...u,!1),readFloat:(...u)=>c(...u,!0),finite:u=>{if(!Number.isFinite(u))throw new vn("Expression produced a non-finite number.");return u},wrap:u=>u|0};for(const u of Ar)h[u]=Math[u==="ln"?"log":u];h.log=(u,m)=>Math.log(m)/Math.log(u),this.binary=_d(r);const f=new WebAssembly.Instance(new WebAssembly.Module(this.binary),{host:h});a.forEach((u,m)=>this.entries.set(u.source,{...u,run:f.exports["e"+m]})),this.counts.compiled=this.entries.size,this.counts.bytes=this.binary.length}evaluate(e,t={}){const i=this.entries.get(e);if(!i)return this.counts.interpreted++,(t.typedResult?xl:yl)(e,t);const s=this.context;this.context=t;try{let r;if(i.direct&&typeof t.resolve=="function"){const a=t.resolve(i.direct.name,i.direct.args,null);if(typeof a=="number"&&Number.isFinite(a)&&(i.type===Ke||Number.isInteger(a))){if(r=i.type===Ke?Math.fround(a):a|0,!Number.isFinite(r))throw new vn("Expression produced a non-finite number.");this.counts.direct++}else r=i.run(),this.counts.wasm++}else r=i.run(),this.counts.wasm++;return t.typedResult?{value:r,float:i.type===Ke}:r}catch(r){if(r instanceof rs)return this.entries.delete(e),this.counts.deoptimized++,(t.typedResult?xl:yl)(e,t);throw r instanceof WebAssembly.RuntimeError?new vn("Invalid numeric operation.",e):r instanceof Zr?(r.source||(r.source=e),r):r!=null&&r.bottom?new vn(r.message,e):new Zr((r==null?void 0:r.message)||"Trigger evaluation failed.",e)}finally{this.context=s}}get stats(){return{...this.counts,activeFunctions:this.entries.size}}}function xd(n,{factor:e,scale:t,cameraX:i,cameraY:s,cropTop:r=0,displayHeight:a=240}){if(!n.window)return null;const[o,l,c,h]=n.window,f=n.windowCentered?0:1;if(c-o+f<=0||h-l+f<=0)return[];const d=n.windowCentered?480:(960-320*t)/2,u=(540-a*t)/2,m=d+(o*e-i*n.windowDelta[0])*t,v=u+(l*e-s*n.windowDelta[1]-r)*t;if(![m,v,(c-o+f)*e*t,(h-l+f)*e*t].every(Number.isFinite))return[];const g=Math.max(0,m),p=Math.max(0,v),M=Math.min(960,m+(c-o+f)*e*t),T=Math.min(540,v+(h-l+f)*e*t);return M>g&&T>p?[g,p,M-g,T-p]:[]}function yd(n,e,t,{x:i,y:s,sx:r,sy:a,cameraX:o,cameraY:l,deltaX:c,zoom:h,factor:f,clip:d=null}){if(d&&!d.length)return[];const u=(t.flip||"").includes("H")?-1:1,m=(t.flip||"").includes("V")?-1:1,v=r*(t.scaleX??1)*u;let g=a*(t.scaleY??1)*m;if(![i,s,v,g].every(Number.isFinite)||!v||!g)return[];let p={x:1,delta:1,y:1},M=p;if(n.type==="parallax"&&(p=Ll(n,e.w,0,e.h,l/f),M=Ll(n,e.w,e.h-1,e.h,l/f),a*=p.y,g*=p.y,!g||![p.x,M.x,p.delta,M.delta,g].every(Number.isFinite)))return[];const T=n.type==="parallax"&&n.width?e.w/2:e.x,E=(A,H)=>{const G=-o*c*h*(A.delta-1)/v,B=Os(n,e.w)*A.x*Math.sign(v);return[T-T*A.x+G+H*B,T+(e.w-T)*A.x+G+H*B]};if(![...E(p,0),...E(M,0)].every(Number.isFinite))return[];const R=(d==null?void 0:d[0])??0,b=d?d[0]+d[2]:960,_=(d==null?void 0:d[1])??0,y=d?d[1]+d[3]:540,N=new Set;for(const A of[p,M]){const[H,G]=E(A,0),B=i+(t.x||0)*r+(Math.min(H*v,G*v)-T*v);for(const ne of Il(B,Math.abs((G-H)*v),Math.abs(Os(n,e.w)*A.x*v),n.tile[0],R,b))N.add(ne)}const I=Os(n,e.h,1)*Math.abs(g),D=s+(t.y||0)*a,F=Il(Math.min(D-e.y*g,D+(e.h-e.y)*g),e.h*Math.abs(g),I,n.tile[1],_,y),W=[];for(const A of F)for(const H of N){if(W.length>=8192)return W;const G=n.type==="parallax"?[...E(p,H),...E(M,H)]:null,B=G?0:H*Os(n,e.w)*Math.abs(v);W.push({x:i+B,y:s+A*I,sx:r,sy:a,axisX:T,warp:G,clip:d})}return W}let Dl;const Sd=1024*1024,ah=n=>{if(typeof n!="number"||!Number.isFinite(n))throw Error("Expected a finite Lua number.");return n},li=n=>Math.trunc(ah(n)),Ul=(n,e,t)=>Math.max(e,Math.min(t,n)),Md="aiLevel alive anim animElemNo animElemTime animExist animTime authorName backEdge backEdgeBodyDist backEdgeDist cameraZoom canRecover command const const240p const480p const720p ctrl drawGame facing fvar gameHeight gameTime gameWidth getHitVar hitCount hitFall hitOver hitPauseTime hitShakeOver id inGuardDist isHelper isHomeTeam life lifeMax lose map matchNo moveContact moveGuarded moveHit moveReversed moveType name numEnemy numExplod numHelper numPartner numProj numProjId numTarget p2Life p2MoveType p2StateNo p2StateType palNo physics playerIdExist power powerMax prevStateNo random roundNo roundState roundsExisted screenHeight screenWidth stateNo stateType sysfvar sysvar teamMode teamSide ticksPerSecond uniqHitCount var win".split(" "),bd=new Set("alive animExist canRecover ctrl drawGame hitFall hitOver hitShakeOver inGuardDist isHelper isHomeTeam lose playerIdExist win".split(" ")),Ed={cameraPos:"camerapos",pos:"pos",vel:"vel",screenPos:"screenpos",hitVel:"hitvel",p2Dist:"p2dist",p2BodyDist:"p2bodydist",parentDist:"parentdist",rootDist:"rootdist"};function oh(n,e={}){if(e.modules!==void 0&&!Array.isArray(e.modules))throw Error("Lua modules must be an array of archive paths.");const t=Object.keys(n).filter(i=>/(?:^|\/)external\/mods\/[^/]+\.lua$/i.test(i)&&!i.split("/").at(-1).startsWith("-")).sort();for(const i of e.modules||[]){const s=No(i);if(!n[s])throw Error(`Lua module is missing: ${s}`);t.includes(s)||t.push(s)}if(t.length>32)throw Error("Lua module limit (32) exceeded.");return t}const Td=`
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
`;class Fo{static async create(e,{factory:t,memoryLimit:i=32*Sd,instructions:s=1e5}={}){t||(Dl??(Dl=Do(async()=>{const{LuaFactory:o}=await import("./index-BZdoyIol.js").then(l=>l.i);return{LuaFactory:o}},__vite__mapDeps([0,1,2]),import.meta.url).then(({LuaFactory:o})=>{var l;return new o(typeof process<"u"&&((l=process.versions)!=null&&l.node)?void 0:new URL(""+new URL("glue-Dlydm7r2.wasm",import.meta.url).href,import.meta.url).href)})),t=await Dl);const r=await t.createEngine({openStandardLibs:!0,injectObjects:!1,enableProxy:!1,traceAllocations:!0}),a=new Fo(e,r,s);r.global.setMemoryMax(i);try{return a.install(),a.run(Td,"<match API>"),a}catch(o){throw a.close(),o}}constructor(e,t,i){this.session=e,this.engine=t,this.actor=e.match.player,this.instructions=i,this.fuel=i,this.closed=!1,this.source="<module>",this.hookPointer=0}install(){const e=this.engine.global,t=(r,a)=>e.set(r,a),i=()=>{if(!this.actor||this.actor.destroyed)throw Error("Lua player selection is unavailable.");return this.actor};for(const r of Md)t(r,(...a)=>{const o=i().resolveTrigger(r.toLowerCase(),a),l=o&&typeof o=="object"&&"float"in o?o.value:o;if(!["number","string","boolean"].includes(typeof l))throw Error(`Lua query ${r} requires an unsupported result type.`);return bd.has(r)||r==="getHitVar"&&["fall","fall.recover","fall.kill","guarded","isbound"].includes(String(a[0]).toLowerCase())?!!l:l});for(const[r,a]of Object.entries(Ed))for(const o of["X","Y"])t(r+o,()=>i().resolveTrigger(a+" "+o.toLowerCase()));const s=r=>(...a)=>{const o=r(...a);return!o||o.destroyed?!1:(this.actor=o,!0)};t("player",s(r=>[this.session.match.player,this.session.match.opponent][li(r)-1])),t("playerId",s(r=>this.session.match.findPlayer(li(r)))),t("playerIndex",s(r=>this.session.match.entities[li(r)-1])),t("parent",s(()=>i().parent)),t("root",s(()=>i().root)),t("stateOwner",s(()=>i().stateOwner)),t("p2",s(()=>i().opponent)),t("enemy",s((r=0)=>li(r)===0?i().opponent:null)),t("enemyNear",s((r=0)=>li(r)===0?i().opponent:null)),t("helper",s(r=>i().ownedHelpers().find(a=>r===void 0||a.helperId===li(r)))),t("helperIndex",s(r=>i().ownedHelpers()[li(r)-1])),t("target",s(r=>i().targets.find(a=>r===void 0||r===-1||i().targetHitIds.get(a.id)===li(r)))),t("partner",()=>!1),t("setLife",r=>{const a=i();a.alive&&(a.life=Ul(li(r),0,a.maxLife))}),t("setPower",r=>{const a=i();a.power=Ul(li(r),0,a.maxPower)}),t("changeState",r=>{const a=i(),o=li(r);return o===-1?(a.destroyed=!0,!1):a.program.states.has(o)?(a.changeState(o,void 0,a),!0):!1}),t("mapSet",(r,a,o)=>i().setMap(String(r),ah(a),o==="add")),t("playerBufReset",()=>{var a,o;const r=i();(a=this.session.match.inputBuffers.get(r))==null||a.reset(),(o=this.session.match.helperCommands.get(r))==null||o.reset()}),t("playerNo",()=>this.session.match.entities.indexOf(i())+1),t("stateOwnerPlayerNo",()=>this.session.match.entities.indexOf(i().stateOwner)+1),t("animPlayerNo",()=>this.session.match.entities.indexOf(i().animationOwner)+1),t("pauseTime",()=>{var r;return((r=this.session.match.pause)==null?void 0:r.remaining)||0}),t("superPauseTime",()=>{var r;return((r=this.session.match.superPause)==null?void 0:r.remaining)||0}),t("gameMode",()=>this.session.selection.mode==="training"?"training":"versus"),t("matchOver",()=>this.session.match.matchOver),t("localCoordX",()=>{var r,a,o;return((o=(a=(r=i().character.def)==null?void 0:r.info)==null?void 0:a.localcoord)==null?void 0:o.split(",").map(Number)[0])||320}),t("localCoordY",()=>{var r,a,o;return((o=(a=(r=i().character.def)==null?void 0:r.info)==null?void 0:a.localcoord)==null?void 0:o.split(",").map(Number)[1])||240}),t("isAsserted",r=>i().asserted.has(String(r).toLowerCase())),t("inCustomState",()=>i().stateOwner!==i()),t("inCustomAnim",()=>i().animationOwner!==i()),t("__kenja_print",r=>this.session.issue("lua-output",String(r).slice(0,512))),t("__kenja_read",(r,a)=>{let o=String(r);a&&(o=o.replaceAll(".","/")+".lua");const l=["",...this.modules.map(d=>d.includes("/external/mods/")?d.slice(0,d.indexOf("/external/mods/")+1):d.slice(0,d.lastIndexOf("/")+1))],h=[...new Set(l.map(d=>No(o,d)))].find(d=>this.session.files[d]);if(!h)throw Error(`Lua file is missing: ${o}`);const f=this.session.files[h];if(f.length>256*1024)throw Error("Lua source limit (256 KiB) exceeded.");return Er(f)}),this.modules=oh(this.session.files,this.session.selection),this.hookPointer=e.lua.module.addFunction(()=>{if(this.fuel-=1e3,this.fuel<0){const r=Error("Lua instruction budget exceeded.");throw r.luaBudget=!0,r}},"vii"),e.lua.lua_sethook(e.address,this.hookPointer,8,1e3)}run(e,t="<module>"){if(e.length>256*1024)throw Error("Lua source limit (256 KiB) exceeded.");this.fuel=this.instructions,this.source=t;try{return this.engine.doStringSync(e)}catch(i){throw Error(`${t}: ${i.message}`)}finally{this.engine.global.setTop(0)}}load(){for(const e of this.modules)this.run(Er(this.session.files[e]),e);this.session.selection.lua&&this.run("local fn,err=load("+JSON.stringify(String(this.session.selection.lua))+',"<fight lua>","t");assert(fn,err);__kenja_frame=fn',"<fight lua>")}step(){if(!this.closed){this.fuel=this.instructions;try{const e=this.engine.global;e.lua.lua_getglobal(e.address,"__kenja_tick"),e.runSync(),e.setTop(0)}catch(e){this.session.issue("lua-runtime",e.message),this.close()}}}close(){if(this.closed)return;this.closed=!0;const e=this.engine.global;e.lua.lua_sethook(e.address,0,0,0),e.close(),this.hookPointer&&e.lua.module.removeFunction(this.hookPointer)}}const Fl=sh({orderedPhases:!0});function wd(n){const e=new Set;for(const t of n){for(const i of t.zssExpressions||[])e.add(i);for(const i of t.states.values())for(const s of i.globalParts||[i])for(const r of[s,...s.controllers||[]])for(const a of r.entries||[]){e.add(a.value);try{for(const o of Nu(a.value))e.add(o)}catch{}}}return e}const Ad=(n,e)=>{const t={entity:e};for(const[i,s]of Object.entries(n))(s===null||["number","string","boolean"].includes(typeof s)||Array.isArray(s))&&(t[i]=s);return t},ks=(n,e,t=0)=>{try{return n.constant(e)}catch{return t}};class Rd{constructor(e,t={}){this.files=e,this.selection=t,this.presentation=Ua(t.presentation),this.characters=bu(e),this.commonEffects=Eu(e,{fightDef:t.fightDef,effectsPackage:t.effectsPackage,character:t.character,stage:t.stage});const i=this.characters.find(o=>o.path===t.character)||this.characters[0],s=this.characters.find(o=>o.path===t.opponent)||i;if(!i||!s)throw Error("No playable character definition found.");const r=new Map([...new Set([i,s])].map(o=>[o,Tu(o,{commonText:Fl,constantsFromCnsOnly:!0})]));for(const o of r.values()){const l=o.diagnostics.find(c=>c.fatal);if(l)throw Error(`${l.source}:${l.line}: ${l.message}`)}this.legacyCompatibility=Ou([i,s],r),this.expressions=new vd(wd(r.values()),{maxFunctions:8192,maxBytes:4*1024*1024}),this.commands=[i,s].map(o=>{var c;const l=(c=o.checks.find(h=>h.key==="cmd"&&h.ok))==null?void 0:c.path;return new xs(Uo(l?Er(e[l]):""))});const a=t.stage&&t.stage!=="builtin/grid"?wu(e).find(o=>o.path===t.stage):null;if(a!=null&&a.invalid)throw Error("Stage definition could not be parsed.");this.match=new id(i,{opponentCharacter:s,commonText:Fl,commonAnimations:this.commonEffects.animations,programs:r,manageInputs:!0,orderedPhases:!0,cameraFollow:!0,kotlinCombatBackend:t.kotlinCombatBackend||null,expressionEvaluator:(o,l)=>this.expressions.evaluate(o,l),stage:a,playerPalette:t.palette||1,opponentPalette:t.opponentPalette||2,skipIntro:t.mode==="training",playerAILevel:t.mode==="cpu"?t.level||4:0,opponentAILevel:["solo","cpu"].includes(t.mode)?t.level||4:0,rules:t.mode==="training"?null:{roundsToWin:2,preIntro:0,introHold:60,overTime:60,resultTime:120,maxIntroTime:900,maxOutroTime:300,endless:t.endless===!0,fightStartLockTicks:Au}}),this.commands=[this.match.inputBuffers.get(this.match.player),this.match.inputBuffers.get(this.match.opponent)],this.effects=new Nl,this.banks=new Map,this.indices=new Map,this.paletteIndices=new Map,this.bankIds=new Map,this.spriteMetadata=new Map,this.spriteRestoreCache=new nd({requireRepeat:!0}),this.paletteFallbacks=new Map,this.sent=new Set,this.assets=[],this.events=[],this.sparks=[],this.gameEffects=[],this.helperFrameStats={alive:0,hidden:0,submitted:0,missingAnimation:0,missingSprite:0},this.roundGeneration=this.match.roundGeneration,this.issues=new Map(this.commonEffects.issues.map(o=>[o.type+":"+o.message,o])),this.closed=!1,this.videoSprites=new Map,this.match.stage&&(this.match.stage.viewportAspect=Sl(this.presentation)),this.modelReady=!1,this.lua=null,this.luaModules=oh(e,t),this.capabilities={format:"kenjatime-core-coverage-v1",engine:"Kenjatime Core",independentRuntime:!0,universalCompatibility:!1,legacyCompatibilityTarget:this.legacyCompatibility.id,legacyCompatibilityReference:this.legacyCompatibility.reference,legacyCompatibilityStatus:this.legacyCompatibility.status,nativeMugen11Certified:!1,ikemenExtensions:"additional-not-baseline",compiledNumericExpressions:!0,scriptInterpreter:!0,luaMatchHooks:!0,stageVideo:!0,gltfStageModels:!0,knownGaps:["Lua APIs beyond match hooks, extended global states and newer ZSS extensions","Compressed glTF extensions, animation pointers and cross-layer model shadows","Video codecs unavailable on the device","Advanced stage camera offsets and mixed-coordinate camera parity","Afterimage palette chains beyond eight layers","Unverified character families and extended controller combinations"]}}setPresentation(e){return this.presentation=Ua(e),this.match.stage&&(this.match.stage.viewportAspect=Sl(this.presentation)),this.presentation}issue(e,t){const i=e+":"+t;this.issues.size<2e3&&this.issues.set(i,{type:e,message:t})}async initializeScripts(){if(this.closed||this.lua||!this.luaModules.length&&!this.selection.lua)return;const e=await Fo.create(this);if(this.closed){e.close();return}try{e.load(),this.lua=e}catch(t){throw e.close(),t}}syncRoundGeneration(){this.roundGeneration!==this.match.roundGeneration&&(this.roundGeneration=this.match.roundGeneration,this.gameEffects=[],this.sparks=[],this.events=[],this.effects=new Nl)}tick(e=new Set,t=new Set){var r,a,o;if(this.closed)throw Error("Match is closed.");this.syncRoundGeneration();const i=this.match,s=l=>i.isFrozen(l)||l.hitPauseTime>0;this.effects.advance({paused:s}),this.gameEffects=this.gameEffects.filter(l=>{if(!l.animation.frames.length)return!1;if(l.owner&&s(l.owner))return!0;if(++l.age>(l.maxAge??3600))return!1;const c=l.animation.frames[l.frameIndex];if(c.ticks<0)return!0;if(++l.frameTime>=Math.max(1,c.ticks)&&(l.frameTime=0,++l.frameIndex>=l.animation.frames.length))if(l.animation.loopDeclared||l.animation.loopStart>0)l.frameIndex=l.animation.loopStart;else return!1;return!0}),i.tick(new Set,new Set,{playerInput:e,opponentInput:t}),this.syncRoundGeneration(),(r=this.lua)==null||r.step(),this.commands=[i.inputBuffers.get(i.player),i.inputBuffers.get(i.opponent)];for(const l of i.eventEntities){this.effects.consume(l.events,{entity:l});for(const c of l.events){if(c.type==="gameanim"){const h=this.commonEffects.animations.get(c.anim);h&&this.commonEffects.resource?(this.gameEffects.length>=256&&this.gameEffects.shift(),this.gameEffects.push({animation:h,frameIndex:0,frameTime:0,age:0,owner:l,pos:c.pos,facing:c.facing,under:c.under})):this.issue("common-effects",`GameMakeAnim ${c.anim} requires imported fightfx AIR/SFF.`)}["playsnd","stopsnd","sndpan"].includes(c.type)&&this.events.push({...Ad(c,l.id),character:l.character.path})}}for(const l of i.presentationEvents)this.effects.consume([l],{entity:l.entity||l.owner});for(const l of i.events){if(l.typeNone)continue;const c=(a=l.attacker)!=null&&a.isProjectile?l.attacker.owner:l.attacker,h=l.hitDef||{},f=!!l.guarded,d=Number(f?h["guard.sparkno"]:h.sparkno),u=f?h.guardSparkCommon!==!1:h.sparkCommon!==!1,m=u?this.commonEffects.animations:c==null?void 0:c.animations,v=u?this.commonEffects.resource:c==null?void 0:c.character,g=m==null?void 0:m.get(d),p=Array.isArray(h.sparkxy)?h.sparkxy:[0,0],M=h.coordinateScale??(c==null?void 0:c.coordinateScale)??1;let T=!1;if(Number.isFinite(d)&&d>=0&&((o=g==null?void 0:g.frames)!=null&&o.length)&&v&&c){const b=g.frames.filter(y=>y.group>=0);let _=!0;if(b.length)try{this.bank(v);const y=this.indices.get(v);_=b.some(N=>y.has(N.group+","+N.number))}catch(y){_=!1,this.issue("sprite",y.message)}_?(this.gameEffects.length>=256&&this.gameEffects.shift(),this.gameEffects.push({animation:g,resource:v,scale:u?this.commonEffects.scale:Gt(c),frameIndex:0,frameTime:0,age:0,maxAge:120,owner:c,under:!1,pos:{x:l.x+(p[0]||0)*M*c.facing,y:c.pos.y+(p[1]||0)*M},facing:c.facing}),T=!0):this.issue("missing-sprite",`HitDef ${f?"guard ":""}spark ${u?"F":""}${d} contains no source sprites in its SFF.`)}else Number.isFinite(d)&&d>=0&&this.issue("missing-animation",`HitDef ${f?"guard ":""}spark ${u?"F":""}${d} is unavailable from imported assets.`);T||this.sparks.push({x:l.x,y:l.y,age:0,guarded:f});const E=f?h.guardsound:h.hitsound,R=Array.isArray(E)?E:[E,0];c&&R[0]!==void 0&&Number.isFinite(Number(R[0]))&&Number(R[0])>=0&&this.events.push({type:"playsnd",group:Number(R[0]),number:Number(R[1]||0),common:f?h.guardSoundCommon!==!1:h.hitSoundCommon!==!1,channel:-1,character:c.character.path,entity:c.id})}return this.sparks=this.sparks.filter(l=>++l.age<12),this.sparks.length>256&&this.sparks.splice(0,this.sparks.length-256),this.effects.capture([...i.entities,...i.drawProjectiles],{paused:s}),this.effects.cleanup(i.entities),this}bank(e){var t;if(!this.banks.has(e)){const i=(t=e.def)!=null&&t.files?Ru(e):Cu(e.files[e.sprite.path]);this.banks.set(e,i),this.bankIds.set(e,this.banks.size),this.indices.set(e,new Map(i.sprites.map((s,r)=>[s.group+","+s.number,r]))),this.paletteIndices.set(e,sd(i.palettes))}return this.banks.get(e)}asset(e,t,i){var s,r,a,o,l;if(!t||t.group<0)return null;try{const c=this.bank(e),h=this.indices.get(e).get(t.group+","+t.number);if(h===void 0)return this.issue("missing-sprite",(((s=e==null?void 0:e.sprite)==null?void 0:s.path)||(e==null?void 0:e.path)||"unidentified bank")+": AIR sprite "+t.group+","+t.number+" is absent from source SFF."),null;const f=this.bankIds.get(e),d=f+":"+h;let u=this.spriteMetadata.get(d);if(!u){const T=((r=c.decodeForDisplay)==null?void 0:r.call(c,h))||((a=c.decodeIndexed)==null?void 0:a.call(c,h))||c.decode(h),E=!!T.indices;T.sourceIncomplete&&this.issue("sprite-incomplete",(((o=e==null?void 0:e.sprite)==null?void 0:o.path)||(e==null?void 0:e.path)||"SFF")+" sprite "+t.group+","+t.number+": original PCX contains "+T.decodedPrefixPixels+"/"+T.totalSourcePixels+" encoded pixels. Remaining pixels are transparent; replace source art for native parity."),u={w:T.w,h:T.h,x:T.x||0,y:T.y||0,palette:T.palette,indexed:E,colors:T.colors},this.assets.push({id:d,width:u.w,height:u.h,indexed:E,pixels:new Uint8Array(E?T.indices:T.rgba)}),this.sent.add(d),this.spriteMetadata.set(d,u),c.clearDecodedCache()}const m=u.indexed,v=c.sprites[h],g=(l=this.paletteIndices.get(e))==null?void 0:l.get(u.palette??v.palette);let p=g?[g.group,g.number]:[1,1];p=(i==null?void 0:i.get(p.join(",")))||(i==null?void 0:i.get("*"))||p;const M=f+":pal:"+p.join(",");if(m&&!this.sent.has(M)){let T;try{T=c.paletteColors(...p)}catch{if(T=u.colors,!T)throw Error("Sprite palette is missing.");this.issue("palette","Requested palette "+p.join(",")+" is unavailable.")}const E=new Uint8Array(1024);E.set(T.subarray(0,1024)),this.assets.push({id:M,width:256,height:1,pixels:E,indexed:!1,role:"palette"}),this.paletteFallbacks.set(M,E.slice()),this.sent.add(M)}return{id:d,paletteId:M,indexed:m,w:u.w,h:u.h,x:u.x||0,y:u.y||0}}catch(c){return this.issue("sprite",c.message),null}}restoreAssets(e){var s,r,a;const t=[];if(this.closed)return t;const i=new Map([...this.bankIds].map(([o,l])=>[String(l),o]));for(const o of new Set(e||[])){if(typeof o!="string"||o.startsWith("@"))continue;const l=o.indexOf(":"),c=i.get(o.slice(0,l));if(l<1||!c)continue;const h=this.banks.get(c);if(h)try{if(o.includes(":pal:")){const f=o.slice(o.indexOf(":pal:")+5).split(",").map(Number);if(f.length!==2||f.some(u=>!Number.isSafeInteger(u)))continue;const d=this.paletteFallbacks.get(o)||h.paletteColors(...f);if(!d||d.length<1024)continue;t.push({id:o,width:256,height:1,indexed:!1,role:"palette",pixels:new Uint8Array(d.slice(0,1024))})}else{const f=Number(o.slice(l+1)),d=this.spriteMetadata.get(o);if(!Number.isSafeInteger(f)||f<0||!d)continue;let u=this.spriteRestoreCache.get(o);if(!u){const m=((s=h.decodeForDisplay)==null?void 0:s.call(h,f))||((r=h.decodeIndexed)==null?void 0:r.call(h,f))||h.decode(f);if(u=d.indexed?m.indices:m.rgba,!u||u.length!==d.w*d.h*(d.indexed?1:4))continue;this.spriteRestoreCache.put(o,u),(a=h.clearDecodedCache)==null||a.call(h)}if(u.length!==d.w*d.h*(d.indexed?1:4))continue;t.push({id:o,width:d.w,height:d.h,indexed:d.indexed,pixels:new Uint8Array(u)})}}catch(f){this.issue("texture-restore","Could not restore sprite "+o+": "+f.message)}}return t}quad(e,t,i,{x:s=0,y:r=0,sx:a=1,sy:o=1,facing:l=1,angle:c=0,xangle:h=0,yangle:f=0,remaps:d=null,palette:u=null,trans:m=null,mask:v=!0,alpha:g=1,clip:p=null,corners:M=null,axisX:T=null,warp:E=null,sprite:R=null,axisY:b=null,pass:_=1}={}){var B,ne,q;if(!i||e.length>=8192)return;const y=R||this.asset(t,i,d);if(!y)return;a*=l;const N=rd((i.angle||0)+c,h,f),I=(i.flip||"").includes("H")?-1:1,D=(i.flip||"").includes("V")?-1:1,F=a*I*(i.scaleX??1)*N.a,W=o*D*(i.scaleY??1)*N.b,A=a*I*(i.scaleX??1)*N.c,H=o*D*(i.scaleY??1)*N.d;if(![F,W,A,H,s,r,g].every(Number.isFinite)){this.issue("render-transform","A non-finite sprite transform was skipped.");return}((B=u==null?void 0:u.layers)==null?void 0:B.length)>8&&this.issue("palette-limit","This preview can render eight palette layers per sprite.");let G=i.blend||"";return typeof m=="string"?G=m:m&&m.mode!=="default"&&(G=m.mode==="sub"?"S":m.mode==="none"?"":m.mode==="add1"?"A1":`AS${((ne=m.alpha)==null?void 0:ne[0])??256}D${((q=m.alpha)==null?void 0:q[1])??256}`),e.push({texture:y.id,palette:y.paletteId,indexed:y.indexed,width:y.w,height:y.h,matrix:[F,W,A,H,s+(i.x||0)*a-F*(T??y.x)-A*(b??y.y),r+(i.y||0)*o-W*(T??y.x)-H*(b??y.y)],blend:Ba(G),mask:v,alpha:g,palFX:(u==null?void 0:u.layers)||[],clip:p,corners:M,warp:E,pass:_}),y}frame(){var u,m,v,g,p,M,T,E,R;const e=this.match,t=e.view,i=Math.min(960/(t.displayWidth||320),540/(t.displayHeight||240)),s=e.cameraRuntime.camera,r=(540-(t.displayHeight||240)*i)/2+(t.groundY||200)*i,a=i*s.zoom,o=[];this.assets=[];const l=b=>({x:480+(b.x-s.x)*a,y:r+(b.y-s.y)*a}),c=b=>{const _=e.stage;if(!_)return;const y=_.definition,N=y.backgroundScale||1,I=y.coordinateScale*N,D=s.x*N,F=s.y*N;for(const[W,A]of _.elements.entries()){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}if(A.layer!==b||!A.enabled||!A.visible||A.type==="dummy")continue;const H=A.type==="video"?{x:0,y:0}:A.animated?gr(_.animations.get(A.anim),A.drawFrameIndex??A.frameIndex,A.drawFrameTime??A.frameTime):_.frame(A),G=_.position(W);if(!H)continue;const B=A.type==="video"?this.videoSprites.get(A.video.key):this.asset(y,H);if(!B)continue;const ne=1+(s.zoom-1)*A.zoomDelta,q=I*i*ne*y.xscale*(A.scaleStart[0]+F/I*A.scaleDelta[0]),J=I*i*ne*y.yscale*(A.scaleStart[1]+F/I*A.scaleDelta[1]),ie=480+(G.x*I-D*G.delta[0])*a,Te=r+(G.y*I-(t.zoffset||0)-F*G.delta[1])*a,Fe=xd(A,{factor:I,scale:i,cameraX:D,cameraY:F,cropTop:t.cropTop,displayHeight:t.displayHeight});if(A.type==="video"){if(Fe&&!Fe.length)continue;const[K,me]=Lu(A.video.scaleMode,B.w,B.h,A.window?A.window[2]-A.window[0]+(A.windowCentered?0:1):y.localcoord[0],A.window?A.window[3]-A.window[1]+(A.windowCentered?0:1):y.localcoord[1]);this.quad(o,null,H,{sprite:B,x:480+(G.x*I-D*G.delta[0])*a,y:270+(G.y*I-F*G.delta[1])*a,sx:q*K,sy:J*me,axisX:B.w/2,axisY:B.h/2,clip:Fe,pass:b===1?2:b,angle:A.angle,xangle:A.xangle,yangle:A.yangle,palette:this.effects.backgroundPalette,mask:!1});continue}for(const K of yd(A,B,H,{x:ie,y:Te,sx:q,sy:J,cameraX:D,cameraY:F,deltaX:G.delta[0],zoom:a,factor:I,clip:Fe})){if(o.length>=8192){this.issue("resource-limit","Visible quad budget exceeded.");break}this.quad(o,y,H,{...K,pass:b===1?2:b,angle:A.angle,xangle:A.xangle,yangle:A.yangle,mask:A.mask,trans:A.transSpecified?{mode:A.trans,alpha:A.alpha}:null,palette:this.effects.backgroundPalette})}}};c(-1),c(0);const h=[],f={alive:0,hidden:0,submitted:0,missingAnimation:0,missingSprite:0};for(const b of[...e.renderEntities,...e.drawProjectiles]){b.parent&&!b.destroyed&&(f.alive++,b.asserted.has("invisible")&&f.hidden++),!b.destroyed&&!b.asserted.has("invisible")&&h.push({priority:b.sprPriority||0,actor:b});for(const _ of b.drawExplods||[])h.push({priority:Pu(_),actor:b,effect:_})}for(const b of this.gameEffects)h.push({priority:b.under?-1e3:1e3,gameEffect:b});h.sort((b,_)=>b.priority-_.priority);for(const{actor:b,effect:_,gameEffect:y}of h){if(y){const F=l(y.pos),W=a*(y.scale??this.commonEffects.scale);this.quad(o,y.resource||this.commonEffects.resource,gr(y.animation,y.frameIndex,y.frameTime),{...F,sx:W,sy:W,facing:y.facing,remaps:null,palette:this.effects.paletteFor(y.owner)});continue}if(_){const F=_.common?this.commonEffects.resource:b.character;if(!F){this.issue("common-effects","Character requested an unavailable shared effect sprite bank.");continue}const W=_.space==="screen"?{x:_.pos.x*i,y:_.pos.y*i}:l(_.pos),A=(_.coordinateScale??Gt(b))*a*(_.common?this.commonEffects.scale:1);this.quad(o,F,gr(_.animation,_.frameIndex,_.frameTime),{...W,sx:A*(((u=_.scale)==null?void 0:u[0])??1),sy:A*(((m=_.scale)==null?void 0:m[1])??1)*(_.vfacing||1),facing:_.facing,angle:_.angle||0,xangle:_.xangle||0,yangle:_.yangle||0,remaps:_.common?null:_.ownpal?_.paletteRemaps:b.paletteRemaps,palette:this.effects.paletteFor(_.source||b),trans:_.trans});continue}for(const F of this.effects.trailsFor(b)){const W=l({x:F.pos.x+(((v=F.drawOffset)==null?void 0:v.x)||0),y:F.pos.y+(((g=F.drawOffset)==null?void 0:g.y)||0)}),A=a*F.coordinateScale;this.quad(o,F.character,F.frame,{...W,sx:A*F.sizeX*(F.drawScale.x??1),sy:A*F.sizeY*(F.drawScale.y??1),facing:F.facing,angle:F.angle,remaps:F.paletteRemaps,palette:F.palette,trans:F.trans})}const N=l({x:b.pos.x+(((p=b.drawOffset)==null?void 0:p.x)||0)+ks(b,"size.draw.offset.x")*Gt(b)*b.facing,y:b.pos.y+(((M=b.drawOffset)==null?void 0:M.y)||0)+ks(b,"size.draw.offset.y")*Gt(b)}),I=rh(b),D=this.quad(o,b.character,I,{...N,sx:a*Gt(b)*ks(b,"size.xscale",1)*(((T=b.drawScale)==null?void 0:T.x)??1),sy:a*Gt(b)*ks(b,"size.yscale",1)*(((E=b.drawScale)==null?void 0:E.y)??1),facing:b.facing,angle:b.angleDraw?b.angle:0,remaps:b.paletteRemaps,palette:this.effects.paletteFor(b),trans:b.trans});b.parent&&!b.destroyed&&(I?D?f.submitted++:f.missingSprite++:f.missingAnimation++)}this.helperFrameStats=f,c(1);const d=this.sparks.map(b=>({...l(b),age:b.age,guarded:b.guarded}));return{width:960,height:540,draws:o,assets:this.assets,sparks:d,model:this.modelReady?{time:e.stage.time/60,camera:{...s},coordinateScale:e.stage.definition.coordinateScale,start:e.stage.definition.camera}:null,ground:r,suppressCharacterShadows:e.entities.some(b=>b.asserted.has("globalnoshadow")),grid:!e.stage||!e.stage.definition.sprite&&!this.modelReady&&!this.videoSprites.size,players:[e.player,e.opponent].map(b=>({id:b.id,name:b.name,x:b.pos.x,y:b.pos.y,life:b.life,maxLife:b.maxLife,power:b.power,maxPower:b.maxPower,state:b.stateNo,time:b.time,anim:b.anim})),ticks:e.ticks,roundState:((R=e.roundFlow)==null?void 0:R.roundState)??2,paused:!1,expressions:this.expressions.stats}}snapshot(){var i,s,r,a,o,l,c,h,f,d;const e=this.match.stage,t=this.match.view;return{engine:"Kenjatime Core",compatibility:this.legacyCompatibility,presentation:this.presentation,viewport:e?{displayWidth:t.displayWidth,displayHeight:t.displayHeight,left:t.left,right:t.right,top:t.top,bottom:t.bottom,cameraX:e.camera.x,cameraY:e.camera.y,zoom:e.camera.zoom,backgroundScale:e.definition.backgroundScale,screenLeft:e.definition.screenLeft,screenRight:e.definition.screenRight}:null,players:[this.match.player,this.match.opponent].map(u=>{var m,v,g,p,M,T,E,R,b,_;return{id:u.id,name:u.name,x:u.pos.x,y:u.pos.y,facing:u.facing,liveTargets:u.targets.filter(y=>!y.destroyed).length,life:u.life,maxLife:u.maxLife,power:u.power,maxPower:u.maxPower,state:u.stateNo,time:u.time,moveType:u.moveType,aiLevel:u.aiLevel,ctrl:u.ctrl,r8IdleControlRecoveries:u.r8IdleControlRecoveries||0,stateTime:u.time,velX:u.vel.x,velY:u.vel.y,cpuMode:this.match.cpus.has(u)?this.match.cpus.get(u).nativeAI?"native-cns":this.match.cpus.get(u).authoredAI?"authored-ailevel":"generic":"human",cpuLastCommand:((m=this.match.cpus.get(u))==null?void 0:m.lastCommand)??"",cpuRawInput:[...((v=this.match.cpus.get(u))==null?void 0:v.raw)??[]].sort().join("+"),cpuMatchedCommands:((M=(p=(g=this.match.cpus.get(u))==null?void 0:g.buffer)==null?void 0:p.active)==null?void 0:M.size)??0,legacyAIFlag:u.legacyAIFlag??null,legacyAIValue:u.legacyAIFlag===void 0?null:u.vars[u.legacyAIFlag],controllerDiagnostics:u.diagnostics.filter(y=>["controller","parameter-bottom","missing-state","state-loop","unsupported-controller","unsupported-trigger"].includes(y.type)).length,hitPauseTime:u.hitPauseTime,pendingStateNo:((T=u._pendingStateEntry)==null?void 0:T.number)??null,pendingStateOwnerId:((R=(E=u._pendingStateEntry)==null?void 0:E.owner)==null?void 0:R.id)??null,anim:u.anim,animElem:u.frameIndex+1,stateOwnerId:((b=u.stateOwner)==null?void 0:b.id)??u.id,animationOwnerId:((_=u.animationOwner)==null?void 0:_.id)??u.id}}),ticks:this.match.ticks,helperStats:{...this.match.helperStats},helperFrameStats:{...this.helperFrameStats},helpers:this.match.entities.filter(u=>u.parent).map(u=>{var m,v,g,p,M,T,E,R,b,_;return{id:u.id,helperId:u.helperId,parentId:(m=u.parent)==null?void 0:m.id,rootId:(v=u.root)==null?void 0:v.id,state:u.stateNo,anim:u.anim,moveType:u.moveType,hitPauseTime:u.hitPauseTime,pendingStateNo:((g=u._pendingStateEntry)==null?void 0:g.number)??null,pendingStateOwnerId:((M=(p=u._pendingStateEntry)==null?void 0:p.owner)==null?void 0:M.id)??null,stateOwnerId:((T=u.stateOwner)==null?void 0:T.id)??u.id,animationOwnerId:((E=u.animationOwner)==null?void 0:E.id)??u.id,boundTargetId:((b=(R=u.bound)==null?void 0:R.target)==null?void 0:b.id)??null,bindTime:((_=u.bound)==null?void 0:_.time)??null,frame:u.frameIndex,x:u.pos.x,y:u.pos.y,facing:u.facing,liveTargets:u.targets.filter(y=>!y.destroyed).length,invisible:u.asserted.has("invisible")}}),roundState:((i=this.match.roundFlow)==null?void 0:i.roundState)??2,roundNo:((s=this.match.roundFlow)==null?void 0:s.roundNo)??1,roundPhaseTime:((r=this.match.roundFlow)==null?void 0:r.phaseTime)??0,roundTimeLeft:((a=this.match.roundFlow)==null?void 0:a.timeLeft)??-1,roundKoHoldTicks:[...((o=this.match.roundFlow)==null?void 0:o.zeroLifeNoKOTicks)||[0,0]],endlessMode:((l=this.match.roundFlow)==null?void 0:l.rules.endless)===!0,roundWins:{...((c=this.match.roundFlow)==null?void 0:c.wins)||{player:0,opponent:0}},roundWinner:((h=this.match.roundFlow)==null?void 0:h.roundWinner)??null,roundReason:((f=this.match.roundFlow)==null?void 0:f.reason)??null,matchOver:((d=this.match.roundFlow)==null?void 0:d.matchOver)??!1,expressions:this.expressions.stats,interpreterCache:Iu(),spriteRestoreCache:this.spriteRestoreCache.stats,capabilities:this.capabilities,diagnostics:[...this.match.diagnostics,...this.issues.values()]}}drainEvents(){const e=this.events;return this.events=[],e}close(){var e,t,i,s;if(!this.closed){(e=this.lua)==null||e.close();try{(s=(i=(t=this.match)==null?void 0:t.kotlinCombatKernel)==null?void 0:i.dispose)==null||s.call(i)}finally{this.match&&(this.match.kotlinCombatKernel=null)}this.closed=!0;for(const r of this.banks.values())r.clearDecodedCache();this.banks.clear(),this.paletteIndices.clear(),this.sent.clear(),this.spriteRestoreCache.clear(),this.paletteFallbacks.clear(),this.gameEffects=[],this.events=[]}}}function Cd(n,e,t,i,s=new Set){var o,l;if(!Number.isSafeInteger(t)||t<0||!Number.isSafeInteger(i)||i<0||t>i)return null;let r=e+t-i;if(r<=0)return[];const a=[];for(const[c,h]of n){if(s.has(c)||c==="@white"||c==="@spark")continue;const f=((o=h==null?void 0:h.userData)==null?void 0:o.residentBytes)??((l=h==null?void 0:h.userData)==null?void 0:l.videoBytes)??0;if(!(f<=0)&&(a.push(c),r-=f,r<=0))return a}return null}const ys=1024*1024;class Pd{constructor({initialBytes:e=64*ys,maxBytes:t=96*ys,stepBytes:i=8*ys,windowFrames:s=45,evictionThreshold:r=80}={}){if(!Number.isSafeInteger(e)||e<=0||!Number.isSafeInteger(t)||t<e||!Number.isSafeInteger(i)||i<=0||!Number.isSafeInteger(s)||s<1||!Number.isSafeInteger(r)||r<1)throw new RangeError("Invalid adaptive texture residency bounds.");this.currentBytes=e,this.maxBytes=t,this.stepBytes=i,this.windowFrames=s,this.evictionThreshold=r,this.previousFrames=0,this.previousEvictions=0,this.upgrades=0}observe({frames:e,evictions:t,residentBytes:i}){if(!Number.isSafeInteger(e)||e<0||!Number.isSafeInteger(t)||t<0||!Number.isFinite(i)||i<0)return this.currentBytes;if(e<this.previousFrames||t<this.previousEvictions)return this.previousFrames=e,this.previousEvictions=t,this.currentBytes;if(e-this.previousFrames<this.windowFrames)return this.currentBytes;const s=t-this.previousEvictions;return this.previousFrames=e,this.previousEvictions=t,s>=this.evictionThreshold&&i>=this.currentBytes*.9&&this.currentBytes<this.maxBytes&&(this.currentBytes=Math.min(this.maxBytes,this.currentBytes+this.stepBytes),this.upgrades++),this.currentBytes}}function Id(n,e=960,t=540){if(!n||n.warp)return!0;const i=n.matrix;if(!Array.isArray(i)||i.length!==6||!i.every(Number.isFinite)||!Number.isFinite(n.width)||!Number.isFinite(n.height)||n.width<=0||n.height<=0)return!0;const[s,r,a,o,l,c]=i,h=n.width,f=n.height,d=s*h,u=r*h,m=a*f,v=o*f,g=l+Math.min(0,d)+Math.min(0,m),p=l+Math.max(0,d)+Math.max(0,m),M=c+Math.min(0,u)+Math.min(0,v),T=c+Math.max(0,u)+Math.max(0,v);if(p<-1||g>e+1||T<-1||M>t+1)return!1;if(Array.isArray(n.clip)&&n.clip.length===4){const[E,R,b,_]=n.clip;if([E,R,b,_].every(Number.isFinite)&&(b<=0||_<=0||p<E-1||g>E+b+1||T<R-1||M>R+_+1))return!1}return!0}function Ld(n,e=960,t=540){const i=[];let s=0;for(const r of n||[])Id(r,e,t)?i.push(r):s++;return{visible:i,culled:s}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Oo="187",Nd=0,Ol=1,Dd=2,_r=1,Ud=2,gs=3,pn=0,Xt=1,fi=2,Vn=0,Ss=1,Bl=2,kl=3,zl=4,lh=5,Di=100,Fd=101,ch=102,Od=103,Bd=104,kd=200,za=201,zd=202,Hd=203,hh=204,Rr=205,Vd=206,Gd=207,Wd=208,Xd=209,qd=210,Yd=211,$d=212,Kd=213,Zd=214,Ha=0,Va=1,Ga=2,Es=3,Wa=4,Xa=5,qa=6,Ya=7,uh=0,Jd=1,jd=2,ki=0,dh=1,fh=2,ph=3,mh=4,gh=5,_h=6,vh=7,Hl="attached",Qd="detached",xh=300,Xn=301,Ts=302,ia=303,na=304,$a=1e3,Kt=1001,Ka=1002,Tt=1003,ef=1004,zs=1005,It=1006,sa=1007,Oi=1008,Wt=1009,yh=1010,Sh=1011,ws=1012,Bo=1013,Mi=1014,ni=1015,bi=1016,ko=1017,zo=1018,qn=1020,Mh=35902,bh=35899,Eh=1021,Th=1022,si=1023,en=1026,Qi=1027,zr=1028,Ho=1029,mn=1030,Vo=1031,Go=1033,vr=33776,xr=33777,yr=33778,Sr=33779,Za=35840,Ja=35841,ja=35842,Qa=35843,eo=36196,to=37492,io=37496,no=37488,so=37489,Cr=37490,ro=37491,ao=37808,oo=37809,lo=37810,co=37811,ho=37812,uo=37813,fo=37814,po=37815,mo=37816,go=37817,_o=37818,vo=37819,xo=37820,yo=37821,So=36492,Mo=36494,bo=36495,Eo=36283,To=36284,Pr=36285,wo=36286,tf=2200,nf=2201,sf=2202,Ir=2300,Ao=2301,ra=2302,Vl=2303,zn=2400,Hn=2401,Lr=2402,Wo=2500,rf=2501,nx=0,sx=1,rx=2,af=3200,Ro=0,of=1,Ui="",ti="srgb",As="srgb-linear",Nr="linear",ut="srgb",aa=7680,lf=519,cf=512,hf=513,uf=514,wh=515,df=516,ff=517,Ah=518,Rh=519,Ch=35044,Dr="300 es",mi=2e3,Rs=2001;function pf(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function mf(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Cs(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function gf(){const n=Cs("canvas");return n.style.display="block",n}const Gl={};function Ur(...n){const e="THREE."+n.shift();console.log(e,...n)}function Ph(n){const e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ne(...n){n=Ph(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function ke(...n){n=Ph(n);const e="THREE."+n.shift();{const t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function Gn(...n){const e=n.join(" ");e in Gl||(Gl[e]=!0,Ne(...n))}function _f(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const vf={[Ha]:Ha,[Ga]:qa,[Wa]:Wa,[Es]:Xa,[Va]:Va,[qa]:Ga,[Ya]:Ya,[Xa]:Es};class nn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ft=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Wl=1234567;const Ms=Math.PI/180,Yn=180/Math.PI;function Ei(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ft[n&255]+Ft[n>>8&255]+Ft[n>>16&255]+Ft[n>>24&255]+"-"+Ft[e&255]+Ft[e>>8&255]+"-"+Ft[e>>16&15|64]+Ft[e>>24&255]+"-"+Ft[t&63|128]+Ft[t>>8&255]+"-"+Ft[t>>16&255]+Ft[t>>24&255]+Ft[i&255]+Ft[i>>8&255]+Ft[i>>16&255]+Ft[i>>24&255]).toLowerCase()}function Je(n,e,t){return Math.max(e,Math.min(t,n))}function Xo(n,e){return(n%e+e)%e}function xf(n,e,t,i,s){return i+(n-e)*(s-i)/(t-e)}function yf(n,e,t){return n!==e?(t-n)/(e-n):0}function bs(n,e,t){return(1-t)*n+t*e}function Sf(n,e,t,i){return bs(n,e,1-Math.exp(-t*i))}function Mf(n,e=1){return e-Math.abs(Xo(n,e*2)-e)}function bf(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Ef(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Tf(n,e){return n+Math.floor(Math.random()*(e-n+1))}function wf(n,e){return n+Math.random()*(e-n)}function Af(n){return n*(.5-Math.random())}function Rf(n){n!==void 0&&(Wl=n);let e=Wl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Cf(n){return n*Ms}function Pf(n){return n*Yn}function If(n){return n>0&&Number.isInteger(n)&&2**Math.round(Math.log2(n))===n}function Lf(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Ih(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Nf(n,e,t,i,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+i)/2),h=a((e+i)/2),f=r((e-i)/2),d=a((e-i)/2),u=r((i-e)/2),m=a((i-e)/2);switch(s){case"XYX":n.set(o*h,l*f,l*d,o*c);break;case"YZY":n.set(l*d,o*h,l*f,o*c);break;case"ZXZ":n.set(l*f,l*d,o*h,o*c);break;case"XZX":n.set(o*h,l*m,l*u,o*c);break;case"YXY":n.set(l*u,o*h,l*m,o*c);break;case"ZYZ":n.set(l*m,l*u,o*h,o*c);break;default:Ne("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Hr(n){switch(n.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function qo(n,e){if(e.constructor===Float32Array)return n;const t=Hr(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(n/t,-1)}function Yo(n,e){if(e.constructor===Float32Array)return n;const t=Hr(e);if(t===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(n*t)}const ax={DEG2RAD:Ms,RAD2DEG:Yn,generateUUID:Ei,clamp:Je,euclideanModulo:Xo,mapLinear:xf,inverseLerp:yf,lerp:bs,damp:Sf,pingpong:Mf,smoothstep:bf,smootherstep:Ef,randInt:Tf,randFloat:wf,randFloatSpread:Af,seededRandom:Rf,degToRad:Cf,radToDeg:Pf,isPowerOfTwo:If,ceilPowerOfTwo:Lf,floorPowerOfTwo:Ih,setQuaternionFromProperEuler:Nf,normalize:Yo,denormalize:qo},nl=class nl{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};nl.prototype.isVector2=!0;let rt=nl;class yi{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],f=i[s+3],d=r[a+0],u=r[a+1],m=r[a+2],v=r[a+3];if(f!==v||l!==d||c!==u||h!==m){let g=l*d+c*u+h*m+f*v;g<0&&(d=-d,u=-u,m=-m,v=-v,g=-g);let p=1-o;if(g<.9995){const M=Math.acos(g),T=Math.sin(M);p=Math.sin(p*M)/T,o=Math.sin(o*M)/T,l=l*p+d*o,c=c*p+u*o,h=h*p+m*o,f=f*p+v*o}else{l=l*p+d*o,c=c*p+u*o,h=h*p+m*o,f=f*p+v*o;const M=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=M,c*=M,h*=M,f*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],f=r[a],d=r[a+1],u=r[a+2],m=r[a+3];return e[t]=o*m+h*f+l*u-c*d,e[t+1]=l*m+h*d+c*f-o*u,e[t+2]=c*m+h*u+o*d-l*f,e[t+3]=h*m-o*f-l*d-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),f=o(r/2),d=l(i/2),u=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"YXZ":this._x=d*h*f+c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"ZXY":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f-d*u*m;break;case"ZYX":this._x=d*h*f-c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f+d*u*m;break;case"YZX":this._x=d*h*f+c*u*m,this._y=c*u*f+d*h*m,this._z=c*h*m-d*u*f,this._w=c*h*f-d*u*m;break;case"XZY":this._x=d*h*f-c*u*m,this._y=c*u*f-d*h*m,this._z=c*h*m+d*u*f,this._w=c*h*f+d*u*m;break;default:Ne("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],d=i+o+f;if(d>0){const u=.5/Math.sqrt(d+1);this._w=.25/u,this._x=(h-l)*u,this._y=(r-c)*u,this._z=(a-s)*u}else if(i>o&&i>f){const u=2*Math.sqrt(1+i-o-f);this._w=(h-l)/u,this._x=.25*u,this._y=(s+a)/u,this._z=(r+c)/u}else if(o>f){const u=2*Math.sqrt(1+o-i-f);this._w=(r-c)/u,this._x=(s+a)/u,this._y=.25*u,this._z=(l+h)/u}else{const u=2*Math.sqrt(1+f-i-o);this._w=(a-s)/u,this._x=(r+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Je(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const sl=class sl{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Xl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Xl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),h=2*(o*t-r*s),f=2*(r*i-a*t);return this.x=t+l*c+a*f-o*h,this.y=i+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return oa.copy(this).projectOnVector(e),this.sub(oa)}reflect(e){return this.sub(oa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};sl.prototype.isVector3=!0;let X=sl;const oa=new X,Xl=new yi,rl=class rl{constructor(e,t,i,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],u=i[5],m=i[8],v=s[0],g=s[3],p=s[6],M=s[1],T=s[4],E=s[7],R=s[2],b=s[5],_=s[8];return r[0]=a*v+o*M+l*R,r[3]=a*g+o*T+l*b,r[6]=a*p+o*E+l*_,r[1]=c*v+h*M+f*R,r[4]=c*g+h*T+f*b,r[7]=c*p+h*E+f*_,r[2]=d*v+u*M+m*R,r[5]=d*g+u*T+m*b,r[8]=d*p+u*E+m*_,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*a-o*c,d=o*l-h*r,u=c*r-a*l,m=t*f+i*d+s*u;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/m;return e[0]=f*v,e[1]=(s*c-h*i)*v,e[2]=(o*i-s*a)*v,e[3]=d*v,e[4]=(h*t-s*l)*v,e[5]=(s*r-o*t)*v,e[6]=u*v,e[7]=(i*l-c*t)*v,e[8]=(a*t-i*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Gn("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(la.makeScale(e,t)),this}rotate(e){return Gn("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(la.makeRotation(-e)),this}translate(e,t){return Gn("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(la.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};rl.prototype.isMatrix3=!0;let He=rl;const la=new He,ql=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Yl=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Df(){const n={enabled:!0,workingColorSpace:As,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ut&&(s.r=zi(s.r),s.g=zi(s.g),s.b=zi(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ut&&(s.r=Wn(s.r),s.g=Wn(s.g),s.b=Wn(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ui?Nr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[As]:{primaries:e,whitePoint:i,transfer:Nr,toXYZ:ql,fromXYZ:Yl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ti},outputColorSpaceConfig:{drawingBufferColorSpace:ti}},[ti]:{primaries:e,whitePoint:i,transfer:ut,toXYZ:ql,fromXYZ:Yl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ti}}}),n}const st=Df();function zi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Wn(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let bn;class Uf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{bn===void 0&&(bn=Cs("canvas")),bn.width=e.width,bn.height=e.height;const s=bn.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=bn}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Cs("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=zi(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(zi(t[i]/255)*255):t[i]=zi(t[i]);return{data:t,width:e.width,height:e.height}}else return Ne("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ff=0;class $o{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Ff++}),this.uuid=Ei(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width||0,t.height||0,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ca(s[a].image)):r.push(ca(s[a]))}else r=ca(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function ca(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Uf.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ne("Texture: Unable to serialize Texture."),{})}let Of=0;const ha=new X;class Nt extends nn{constructor(e=Nt.DEFAULT_IMAGE,t=Nt.DEFAULT_MAPPING,i=Kt,s=Kt,r=It,a=Oi,o=si,l=Wt,c=Nt.DEFAULT_ANISOTROPY,h=Ui){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Of++}),this.uuid=Ei(),this.name="",this.source=new $o(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new rt(0,0),this.repeat=new rt(1,1),this.center=new rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ha).x}get height(){return this.source.getSize(ha).y}get depth(){return this.source.getSize(ha).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){Ne(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==xh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $a:e.x=e.x-Math.floor(e.x);break;case Kt:e.x=e.x<0?0:1;break;case Ka:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $a:e.y=e.y-Math.floor(e.y);break;case Kt:e.y=e.y<0?0:1;break;case Ka:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=xh;Nt.DEFAULT_ANISOTROPY=1;const al=class al{constructor(e=0,t=0,i=0,s=1){this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],h=l[4],f=l[8],d=l[1],u=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+u+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,E=(u+1)/2,R=(p+1)/2,b=(h+d)/4,_=(f+v)/4,y=(m+g)/4;return T>E&&T>R?T<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(T),s=b/i,r=_/i):E>R?E<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),i=b/s,r=y/s):R<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),i=_/r,s=y/r),this.set(i,s,r,t),this}let M=Math.sqrt((g-m)*(g-m)+(f-v)*(f-v)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(f-v)/M,this.z=(d-h)/M,this.w=Math.acos((c+u+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this.w=Je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this.w=Je(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};al.prototype.isVector4=!0;let ft=al;class Bf extends nn{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:It,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new ft(0,0,e,t),this.scissorTest=!1,this.viewport=new ft(0,0,e,t),this.textures=[];const s=i.count;for(let r=0;r<s;r++)this.textures[r]=new Nt({width:e,height:t,depth:i.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:It,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new $o(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Si extends Bf{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Lh extends Nt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Tt,this.minFilter=Tt,this.wrapR=Kt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class kf extends Nt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Tt,this.minFilter=Tt,this.wrapR=Kt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const kr=class kr{constructor(e,t,i,s,r,a,o,l,c,h,f,d,u,m,v,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,h,f,d,u,m,v,g)}set(e,t,i,s,r,a,o,l,c,h,f,d,u,m,v,g){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=d,p[3]=u,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new kr().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,i=e.elements,s=1/En.setFromMatrixColumn(e,0).length(),r=1/En.setFromMatrixColumn(e,1).length(),a=1/En.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const d=a*h,u=a*f,m=o*h,v=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=u+m*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=m+u*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,u=l*f,m=c*h,v=c*f;t[0]=d+v*o,t[4]=m*o-u,t[8]=a*c,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=u*o-m,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,u=l*f,m=c*h,v=c*f;t[0]=d-v*o,t[4]=-a*f,t[8]=m+u*o,t[1]=u+m*o,t[5]=a*h,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,u=a*f,m=o*h,v=o*f;t[0]=l*h,t[4]=m*c-u,t[8]=d*c+v,t[1]=l*f,t[5]=v*c+d,t[9]=u*c-m,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,u=a*c,m=o*l,v=o*c;t[0]=l*h,t[4]=v-d*f,t[8]=m*f+u,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=u*f+m,t[10]=d-v*f}else if(e.order==="XZY"){const d=a*l,u=a*c,m=o*l,v=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=d*f+v,t[5]=a*h,t[9]=u*f-m,t[2]=m*f-u,t[6]=o*h,t[10]=v*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(zf,e,Hf)}lookAt(e,t,i){const s=this.elements;return Yt.subVectors(e,t),Yt.lengthSq()===0&&(Yt.z=1),Yt.normalize(),Xi.crossVectors(i,Yt),Xi.lengthSq()===0&&(Math.abs(i.z)===1?Yt.x+=1e-4:Yt.z+=1e-4,Yt.normalize(),Xi.crossVectors(i,Yt)),Xi.normalize(),Hs.crossVectors(Yt,Xi),s[0]=Xi.x,s[4]=Hs.x,s[8]=Yt.x,s[1]=Xi.y,s[5]=Hs.y,s[9]=Yt.y,s[2]=Xi.z,s[6]=Hs.z,s[10]=Yt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],u=i[13],m=i[2],v=i[6],g=i[10],p=i[14],M=i[3],T=i[7],E=i[11],R=i[15],b=s[0],_=s[4],y=s[8],N=s[12],I=s[1],D=s[5],F=s[9],W=s[13],A=s[2],H=s[6],G=s[10],B=s[14],ne=s[3],q=s[7],J=s[11],ie=s[15];return r[0]=a*b+o*I+l*A+c*ne,r[4]=a*_+o*D+l*H+c*q,r[8]=a*y+o*F+l*G+c*J,r[12]=a*N+o*W+l*B+c*ie,r[1]=h*b+f*I+d*A+u*ne,r[5]=h*_+f*D+d*H+u*q,r[9]=h*y+f*F+d*G+u*J,r[13]=h*N+f*W+d*B+u*ie,r[2]=m*b+v*I+g*A+p*ne,r[6]=m*_+v*D+g*H+p*q,r[10]=m*y+v*F+g*G+p*J,r[14]=m*N+v*W+g*B+p*ie,r[3]=M*b+T*I+E*A+R*ne,r[7]=M*_+T*D+E*H+R*q,r[11]=M*y+T*F+E*G+R*J,r[15]=M*N+T*W+E*B+R*ie,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],d=e[10],u=e[14],m=e[3],v=e[7],g=e[11],p=e[15],M=l*u-c*d,T=o*u-c*f,E=o*d-l*f,R=a*u-c*h,b=a*d-l*h,_=a*f-o*h;return t*(v*M-g*T+p*E)-i*(m*M-g*R+p*b)+s*(m*T-v*R+p*_)-r*(m*E-v*b+g*_)}determinantAffine(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-i*(r*h-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],d=e[10],u=e[11],m=e[12],v=e[13],g=e[14],p=e[15],M=t*o-i*a,T=t*l-s*a,E=t*c-r*a,R=i*l-s*o,b=i*c-r*o,_=s*c-r*l,y=h*v-f*m,N=h*g-d*m,I=h*p-u*m,D=f*g-d*v,F=f*p-u*v,W=d*p-u*g,A=M*W-T*F+E*D+R*I-b*N+_*y;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const H=1/A;return e[0]=(o*W-l*F+c*D)*H,e[1]=(s*F-i*W-r*D)*H,e[2]=(v*_-g*b+p*R)*H,e[3]=(d*b-f*_-u*R)*H,e[4]=(l*I-a*W-c*N)*H,e[5]=(t*W-s*I+r*N)*H,e[6]=(g*E-m*_-p*T)*H,e[7]=(h*_-d*E+u*T)*H,e[8]=(a*F-o*I+c*y)*H,e[9]=(i*I-t*F-r*y)*H,e[10]=(m*b-v*E+p*M)*H,e[11]=(f*E-h*b-u*M)*H,e[12]=(o*N-a*D-l*y)*H,e[13]=(t*D-i*N+s*y)*H,e[14]=(v*T-m*R-g*M)*H,e[15]=(h*R-f*T+d*M)*H,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,f=o+o,d=r*c,u=r*h,m=r*f,v=a*h,g=a*f,p=o*f,M=l*c,T=l*h,E=l*f,R=i.x,b=i.y,_=i.z;return s[0]=(1-(v+p))*R,s[1]=(u+E)*R,s[2]=(m-T)*R,s[3]=0,s[4]=(u-E)*b,s[5]=(1-(d+p))*b,s[6]=(g+M)*b,s[7]=0,s[8]=(m+T)*_,s[9]=(g-M)*_,s[10]=(1-(d+v))*_,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return i.set(1,1,1),t.identity(),this;let a=En.set(s[0],s[1],s[2]).length();const o=En.set(s[4],s[5],s[6]).length(),l=En.set(s[8],s[9],s[10]).length();r<0&&(a=-a),ci.copy(this);const c=1/a,h=1/o,f=1/l;return ci.elements[0]*=c,ci.elements[1]*=c,ci.elements[2]*=c,ci.elements[4]*=h,ci.elements[5]*=h,ci.elements[6]*=h,ci.elements[8]*=f,ci.elements[9]*=f,ci.elements[10]*=f,t.setFromRotationMatrix(ci),i.x=a,i.y=o,i.z=l,this}makePerspective(e,t,i,s,r,a,o=mi,l=!1){const c=this.elements,h=2*r/(t-e),f=2*r/(i-s),d=(t+e)/(t-e),u=(i+s)/(i-s);let m,v;if(l)m=r/(a-r),v=a*r/(a-r);else if(o===mi)m=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Rs)m=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=f,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=mi,l=!1){const c=this.elements,h=2/(t-e),f=2/(i-s),d=-(t+e)/(t-e),u=-(i+s)/(i-s);let m,v;if(l)m=1/(a-r),v=a/(a-r);else if(o===mi)m=-2/(a-r),v=-(a+r)/(a-r);else if(o===Rs)m=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=f,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};kr.prototype.isMatrix4=!0;let et=kr;const En=new X,ci=new et,zf=new X(0,0,0),Hf=new X(1,1,1),Xi=new X,Hs=new X,Yt=new X,$l=new et,Kl=new yi;class tn{constructor(e=0,t=0,i=0,s=tn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],d=s[6],u=s[10];switch(t){case"XYZ":this._y=Math.asin(Je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Je(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,u),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,u),this._y=0);break;default:Ne("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return $l.makeRotationFromQuaternion(e),this.setFromRotationMatrix($l,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Kl.setFromEuler(this),this.setFromQuaternion(Kl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}tn.DEFAULT_ORDER="XYZ";class Nh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Vf=0;const Zl=new X,Tn=new yi,Ri=new et,Vs=new X,as=new X,Gf=new X,Wf=new yi,Jl=new X(1,0,0),jl=new X(0,1,0),Ql=new X(0,0,1),ec={type:"added"},Xf={type:"removed"},wn={type:"childadded",child:null},ua={type:"childremoved",child:null};class St extends nn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=Ei(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=St.DEFAULT_UP.clone();const e=new X,t=new tn,i=new yi,s=new X(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new et},normalMatrix:{value:new He}}),this.matrix=new et,this.matrixWorld=new et,this.matrixAutoUpdate=St.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Tn.setFromAxisAngle(e,t),this.quaternion.multiply(Tn),this}rotateOnWorldAxis(e,t){return Tn.setFromAxisAngle(e,t),this.quaternion.premultiply(Tn),this}rotateX(e){return this.rotateOnAxis(Jl,e)}rotateY(e){return this.rotateOnAxis(jl,e)}rotateZ(e){return this.rotateOnAxis(Ql,e)}translateOnAxis(e,t){return Zl.copy(e).applyQuaternion(this.quaternion),this.position.add(Zl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Jl,e)}translateY(e){return this.translateOnAxis(jl,e)}translateZ(e){return this.translateOnAxis(Ql,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ri.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Vs.copy(e):Vs.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),as.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ri.lookAt(as,Vs,this.up):Ri.lookAt(Vs,as,this.up),this.quaternion.setFromRotationMatrix(Ri),s&&(Ri.extractRotation(s.matrixWorld),Tn.setFromRotationMatrix(Ri),this.quaternion.premultiply(Tn.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ec),wn.child=e,this.dispatchEvent(wn),wn.child=null):ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Xf),ua.child=e,this.dispatchEvent(ua),ua.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ri.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ri.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ri),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ec),wn.child=e,this.dispatchEvent(wn),wn.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,e,Gf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(as,Wf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,i=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*i-r[8]*s,r[13]+=i-r[1]*t-r[5]*i-r[9]*s,r[14]+=s-r[2]*t-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,i)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),f=a(e.shapes),d=a(e.skeletons),u=a(e.animations),m=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),u.length>0&&(i.animations=u),m.length>0&&(i.nodes=m)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}St.DEFAULT_UP=new X(0,1,0);St.DEFAULT_MATRIX_AUTO_UPDATE=!0;St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Gs extends St{constructor(){super(),this.isGroup=!0,this.type="Group"}}const qf={type:"move"};class da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Gs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Gs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Gs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const g=t.getJointPose(v,i),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),u=.02,m=.005;c.inputState.pinching&&d>u+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=u-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(qf)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Gs;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const Dh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qi={h:0,s:0,l:0},Ws={h:0,s:0,l:0};function fa(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ze{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ti){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,st.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=st.workingColorSpace){return this.r=e,this.g=t,this.b=i,st.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=st.workingColorSpace){if(e=Xo(e,1),t=Je(t,0,1),i=Je(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=fa(a,r,e+1/3),this.g=fa(a,r,e),this.b=fa(a,r,e-1/3)}return st.colorSpaceToWorking(this,s),this}setStyle(e,t=ti){function i(r){r!==void 0&&parseFloat(r)<1&&Ne("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,t);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ne("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ne("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ti){const i=Dh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ne("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zi(e.r),this.g=zi(e.g),this.b=zi(e.b),this}copyLinearToSRGB(e){return this.r=Wn(e.r),this.g=Wn(e.g),this.b=Wn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ti){return st.workingToColorSpace(Ot.copy(this),e),Math.round(Je(Ot.r*255,0,255))*65536+Math.round(Je(Ot.g*255,0,255))*256+Math.round(Je(Ot.b*255,0,255))}getHexString(e=ti){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=st.workingColorSpace){st.workingToColorSpace(Ot.copy(this),t);const i=Ot.r,s=Ot.g,r=Ot.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case i:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-i)/f+2;break;case r:l=(i-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=st.workingColorSpace){return st.workingToColorSpace(Ot.copy(this),t),e.r=Ot.r,e.g=Ot.g,e.b=Ot.b,e}getStyle(e=ti){st.workingToColorSpace(Ot.copy(this),e);const t=Ot.r,i=Ot.g,s=Ot.b;return e!==ti?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(qi),this.setHSL(qi.h+e,qi.s+t,qi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(qi),e.getHSL(Ws);const i=bs(qi.h,Ws.h,t),s=bs(qi.s,Ws.s,t),r=bs(qi.l,Ws.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ot=new Ze;Ze.NAMES=Dh;class Yf extends St{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new tn,this.environmentIntensity=1,this.environmentRotation=new tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const hi=new X,Ci=new X,pa=new X,Pi=new X,An=new X,Rn=new X,tc=new X,ma=new X,ga=new X,_a=new X,va=new ft,xa=new ft,ya=new ft;class pi{constructor(e=new X,t=new X,i=new X){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),hi.subVectors(e,t),s.cross(hi);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){hi.subVectors(s,t),Ci.subVectors(i,t),pa.subVectors(e,t);const a=hi.dot(hi),o=hi.dot(Ci),l=hi.dot(pa),c=Ci.dot(Ci),h=Ci.dot(pa),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const d=1/f,u=(c*l-o*h)*d,m=(a*h-o*l)*d;return r.set(1-u-m,m,u)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Pi)===null?!1:Pi.x>=0&&Pi.y>=0&&Pi.x+Pi.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,Pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Pi.x),l.addScaledVector(a,Pi.y),l.addScaledVector(o,Pi.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return va.setScalar(0),xa.setScalar(0),ya.setScalar(0),va.fromBufferAttribute(e,t),xa.fromBufferAttribute(e,i),ya.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(va,r.x),a.addScaledVector(xa,r.y),a.addScaledVector(ya,r.z),a}static isFrontFacing(e,t,i,s){return hi.subVectors(i,t),Ci.subVectors(e,t),hi.cross(Ci).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return hi.subVectors(this.c,this.b),Ci.subVectors(this.a,this.b),hi.cross(Ci).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return pi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return pi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return pi.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return pi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return pi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;An.subVectors(s,i),Rn.subVectors(r,i),ma.subVectors(e,i);const l=An.dot(ma),c=Rn.dot(ma);if(l<=0&&c<=0)return t.copy(i);ga.subVectors(e,s);const h=An.dot(ga),f=Rn.dot(ga);if(h>=0&&f<=h)return t.copy(s);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0&&l-h>0)return a=l/(l-h),t.copy(i).addScaledVector(An,a);_a.subVectors(e,r);const u=An.dot(_a),m=Rn.dot(_a);if(m>=0&&u<=m)return t.copy(r);const v=u*c-l*m;if(v<=0&&c>=0&&m<=0)return o=c/(c-m),t.copy(i).addScaledVector(Rn,o);const g=h*m-u*f;if(g<=0&&f-h>=0&&u-m>=0)return tc.subVectors(r,s),o=(f-h)/(f-h+(u-m)),t.copy(s).addScaledVector(tc,o);const p=1/(g+v+d);return a=v*p,o=d*p,t.copy(i).addScaledVector(An,a).addScaledVector(Rn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class sn{constructor(e=new X(1/0,1/0,1/0),t=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ui.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ui.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ui.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ui):ui.fromBufferAttribute(r,a),ui.applyMatrix4(e.matrixWorld),this.expandByPoint(ui);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Xs.copy(i.boundingBox)),Xs.applyMatrix4(e.matrixWorld),this.union(Xs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ui),ui.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(os),qs.subVectors(this.max,os),Cn.subVectors(e.a,os),Pn.subVectors(e.b,os),In.subVectors(e.c,os),Yi.subVectors(Pn,Cn),$i.subVectors(In,Pn),cn.subVectors(Cn,In);let t=[0,-Yi.z,Yi.y,0,-$i.z,$i.y,0,-cn.z,cn.y,Yi.z,0,-Yi.x,$i.z,0,-$i.x,cn.z,0,-cn.x,-Yi.y,Yi.x,0,-$i.y,$i.x,0,-cn.y,cn.x,0];return!Sa(t,Cn,Pn,In,qs)||(t=[1,0,0,0,1,0,0,0,1],!Sa(t,Cn,Pn,In,qs))?!1:(Ys.crossVectors(Yi,$i),t=[Ys.x,Ys.y,Ys.z],Sa(t,Cn,Pn,In,qs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ui).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ui).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ii),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Ii=[new X,new X,new X,new X,new X,new X,new X,new X],ui=new X,Xs=new sn,Cn=new X,Pn=new X,In=new X,Yi=new X,$i=new X,cn=new X,os=new X,qs=new X,Ys=new X,hn=new X;function Sa(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){hn.fromArray(n,r);const o=s.x*Math.abs(hn.x)+s.y*Math.abs(hn.y)+s.z*Math.abs(hn.z),l=e.dot(hn),c=t.dot(hn),h=i.dot(hn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Fi=$f();function $f(){const n=new ArrayBuffer(4),e=new Float32Array(n),t=new Uint32Array(n),i=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(i[l]=0,i[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(i[l]=1024>>-c-14,i[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(i[l]=c+15<<10,i[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(i[l]=31744,i[l|256]=64512,s[l]=24,s[l|256]=24):(i[l]=31744,i[l|256]=64512,s[l]=13,s[l|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function Kf(n){Math.abs(n)>65504&&Ne("DataUtils.toHalfFloat(): Value out of range."),n=Je(n,-65504,65504),Fi.floatView[0]=n;const e=Fi.uint32View[0],t=e>>23&511;return Fi.baseTable[t]+((e&8388607)>>Fi.shiftTable[t])}function Zf(n){const e=n>>10;return Fi.uint32View[0]=Fi.mantissaTable[Fi.offsetTable[e]+(n&1023)]+Fi.exponentTable[e],Fi.floatView[0]}class ox{static toHalfFloat(e){return Kf(e)}static fromHalfFloat(e){return Zf(e)}}const bt=new X,$s=new rt;let Jf=0;class Hi extends nn{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Jf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ch,this.updateRanges=[],this.gpuType=ni,this.version=0,this._normalizationScale=e!==void 0?Hr(e):void 0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)$s.fromBufferAttribute(this,t),$s.applyMatrix3(e),this.setXY(t,$s.x,$s.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):qo(e,this.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Yo(e,this.array)}}class Uh extends Hi{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Fh extends Hi{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Zt extends Hi{constructor(e,t,i){super(new Float32Array(e),t,i)}}const jf=new sn,ls=new X,Ma=new X;class Vi{constructor(e=new X,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):jf.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ls.subVectors(e,this.center);const t=ls.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(ls,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ma.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ls.copy(e.center).add(Ma)),this.expandByPoint(ls.copy(e.center).sub(Ma))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Qf=0;const ei=new et,ba=new St,Ln=new X,$t=new sn,cs=new sn,Pt=new X;class Ti extends nn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Qf++}),this.uuid=Ei(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(pf(e)?Fh:Uh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new He().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ei.makeRotationFromQuaternion(e),this.applyMatrix4(ei),this}rotateX(e){return ei.makeRotationX(e),this.applyMatrix4(ei),this}rotateY(e){return ei.makeRotationY(e),this.applyMatrix4(ei),this}rotateZ(e){return ei.makeRotationZ(e),this.applyMatrix4(ei),this}translate(e,t,i){return ei.makeTranslation(e,t,i),this.applyMatrix4(ei),this}scale(e,t,i){return ei.makeScale(e,t,i),this.applyMatrix4(ei),this}lookAt(e){return ba.lookAt(e),ba.updateMatrix(),this.applyMatrix4(ba.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ln).negate(),this.translate(Ln.x,Ln.y,Ln.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Zt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ne("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new sn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];$t.setFromBufferAttribute(r),this.morphTargetsRelative?(Pt.addVectors(this.boundingBox.min,$t.min),this.boundingBox.expandByPoint(Pt),Pt.addVectors(this.boundingBox.max,$t.max),this.boundingBox.expandByPoint(Pt)):(this.boundingBox.expandByPoint($t.min),this.boundingBox.expandByPoint($t.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Vi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new X,1/0);return}if(e){const i=this.boundingSphere.center;if($t.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];cs.setFromBufferAttribute(o),this.morphTargetsRelative?(Pt.addVectors($t.min,cs.min),$t.expandByPoint(Pt),Pt.addVectors($t.max,cs.max),$t.expandByPoint(Pt)):($t.expandByPoint(cs.min),$t.expandByPoint(cs.max))}$t.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Pt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Pt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Pt.fromBufferAttribute(o,c),l&&(Ln.fromBufferAttribute(e,c),Pt.add(Ln)),s=Math.max(s,i.distanceToSquared(Pt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new Hi(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(i.count);for(let N=0;N<i.count;N++)o[N]=new X,l[N]=new X;const h=new X,f=new X,d=new X,u=new rt,m=new rt,v=new rt,g=new X,p=new X;function M(N,I,D){c[N]=c[I]=c[D]=1,h.fromBufferAttribute(i,N),f.fromBufferAttribute(i,I),d.fromBufferAttribute(i,D),u.fromBufferAttribute(r,N),m.fromBufferAttribute(r,I),v.fromBufferAttribute(r,D),f.sub(h),d.sub(h),m.sub(u),v.sub(u);const F=1/(m.x*v.y-v.x*m.y);isFinite(F)&&(g.copy(f).multiplyScalar(v.y).addScaledVector(d,-m.y).multiplyScalar(F),p.copy(d).multiplyScalar(m.x).addScaledVector(f,-v.x).multiplyScalar(F),o[N].add(g),o[I].add(g),o[D].add(g),l[N].add(p),l[I].add(p),l[D].add(p))}let T=this.groups;T.length===0&&(T=[{start:0,count:e.count}]);for(let N=0,I=T.length;N<I;++N){const D=T[N],F=D.start,W=D.count;for(let A=F,H=F+W;A<H;A+=3)M(e.getX(A+0),e.getX(A+1),e.getX(A+2))}const E=new X,R=new X,b=new X,_=new X;function y(N){b.fromBufferAttribute(s,N),_.copy(b);const I=o[N];E.copy(I),E.sub(b.multiplyScalar(b.dot(I))).normalize(),R.crossVectors(_,I);const F=R.dot(l[N])<0?-1:1;a.setXYZW(N,E.x,E.y,E.z,F)}for(let N=0,I=i.count;N<I;++N)c[N]&&y(N);this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Hi(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,u=i.count;d<u;d++)i.setXYZ(d,0,0,0);const s=new X,r=new X,a=new X,o=new X,l=new X,c=new X,h=new X,f=new X;if(e)for(let d=0,u=e.count;d<u;d+=3){const m=e.getX(d+0),v=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,g),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(i,m),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(m,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,u=t.count;d<u;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Pt.fromBufferAttribute(e,t),Pt.normalize(),e.setXYZ(t,Pt.x,Pt.y,Pt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,d=new c.constructor(l.length*h);let u=0,m=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?u=l[v]*o.data.stride+o.offset:u=l[v]*h;for(let p=0;p<h;p++)d[m++]=c[u++]}return new Hi(d,h,f)}if(this.index===null)return Ne("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ti,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const d=c[h],u=e(d,i);l.push(u)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const u=c[f];h.push(u.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],f=r[c];for(let d=0,u=f.length;d<u;d++)h.push(f[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class lx{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ch,this.updateRanges=[],this.version=0,this.uuid=Ei()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[i+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=ic(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);const i=new this.array.constructor(e.arrayBuffers[t]),s=new this.constructor(i,this.stride);return s.setUsage(this.usage),s}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});const t=ic(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));const i={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return i.usage=this.usage,i}}function ic(n){return n.buffer._uuid===void 0&&(n.buffer._uuid=Ei()),n.byteOffset===0&&n.byteLength===n.buffer.byteLength?n.buffer._uuid:n.buffer._uuid+":"+n.byteOffset+":"+n.byteLength}const kt=new X;class Oh{constructor(e,t,i,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=s,this._normalizationScale=e!==void 0?Hr(e.array):void 0}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=this._denormalize(i)),i}setComponent(e,t,i){return this.normalized&&(i=this._normalize(i)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),i=this._normalize(i),s=this._normalize(s),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){Ur("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Hi(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Oh(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Ur("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const s=i*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){const t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):qo(e,this.data.array)}_normalize(e){const t=this._normalizationScale;return t!==void 0?Math.round(e*t):Yo(e,this.data.array)}}const Ea=new X,ep=new X,tp=new He;class Ji{constructor(e=new X(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Ea.subVectors(i,t).cross(ep.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){const s=e.delta(Ea),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return i===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||tp.getNormalMatrix(e),s=this.coplanarPoint(Ea).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let ip=0;class _n extends nn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ip++}),this.uuid=Ei(),this.name="",this.type="Material",this.blending=Ss,this.side=pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=hh,this.blendDst=Rr,this.blendEquation=Di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ze(0,0,0),this.blendAlpha=0,this.depthFunc=Es,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=lf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=aa,this.stencilZFail=aa,this.stencilZPass=aa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){Ne(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ne(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(i.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(i.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(i.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(i.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ze().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Ji().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new rt().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new rt().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Li=new X,Ta=new X,Ks=new X,Zs=new X;class Vr{constructor(e=new X,t=new X(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Li)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Li.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Li.copy(this.origin).addScaledVector(this.direction,t),Li.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Ta.copy(e).add(t).multiplyScalar(.5),Ks.copy(t).sub(e).normalize(),Zs.copy(this.origin).sub(Ta);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ks),o=Zs.dot(this.direction),l=-Zs.dot(Ks),c=Zs.lengthSq(),h=Math.abs(1-a*a);let f,d,u,m;if(h>0)if(f=a*l-o,d=a*o-l,m=r*h,f>=0)if(d>=-m)if(d<=m){const v=1/h;f*=v,d*=v,u=f*(f+a*d+2*o)+d*(a*f+d+2*l)+c}else d=r,f=Math.max(0,-(a*d+o)),u=-f*f+d*(d+2*l)+c;else d=-r,f=Math.max(0,-(a*d+o)),u=-f*f+d*(d+2*l)+c;else d<=-m?(f=Math.max(0,-(-a*r+o)),d=f>0?-r:Math.min(Math.max(-r,-l),r),u=-f*f+d*(d+2*l)+c):d<=m?(f=0,d=Math.min(Math.max(-r,-l),r),u=d*(d+2*l)+c):(f=Math.max(0,-(a*r+o)),d=f>0?r:Math.min(Math.max(-r,-l),r),u=-f*f+d*(d+2*l)+c);else d=a>0?-r:r,f=Math.max(0,-(a*d+o)),u=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Ta).addScaledVector(Ks,d),u}intersectSphere(e,t){if(e.radius<0)return null;Li.subVectors(e.center,this.origin);const i=Li.dot(this.direction),s=Li.dot(Li)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Li)!==null}intersectTriangle(e,t,i,s,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,f=e.x-a.x,d=e.y-a.y,u=e.z-a.z,m=t.x-a.x,v=t.y-a.y,g=t.z-a.z,p=i.x-a.x,M=i.y-a.y,T=i.z-a.z,E=Math.abs(l),R=Math.abs(c),b=Math.abs(h);let _,y,N,I,D,F,W,A,H,G,B,ne;if(E>=R&&E>=b?(N=l,F=f,H=m,ne=p,l>=0?(_=c,y=h,I=d,D=u,W=v,A=g,G=M,B=T):(_=h,y=c,I=u,D=d,W=g,A=v,G=T,B=M)):R>=b?(N=c,F=d,H=v,ne=M,c>=0?(_=h,y=l,I=u,D=f,W=g,A=m,G=T,B=p):(_=l,y=h,I=f,D=u,W=m,A=g,G=p,B=T)):(N=h,F=u,H=g,ne=T,h>=0?(_=l,y=c,I=f,D=d,W=m,A=v,G=p,B=M):(_=c,y=l,I=d,D=f,W=v,A=m,G=M,B=p)),N===0)return null;const q=_/N,J=y/N,ie=1/N,Te=I-q*F,Fe=D-J*F,K=W-q*H,me=A-J*H,we=G-q*ne,De=B-J*ne,$=we*me-De*K,Me=Te*De-Fe*we,C=K*Fe-me*Te;if(s){if($<0||Me<0||C<0)return null}else if(($<0||Me<0||C<0)&&($>0||Me>0||C>0))return null;const P=$+Me+C;if(P===0)return null;const se=ie*($*F+Me*H+C*ne);return(P>0?se<0:se>0)?null:this.at(se/P,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class np extends _n{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.combine=uh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const nc=new et,un=new Vr,Js=new Vi,sc=new X,js=new X,Qs=new X,er=new X,wa=new X,tr=new X,rc=new X,ir=new X;class ri extends St{constructor(e=new Ti,t=new np){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){tr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(wa.fromBufferAttribute(f,e),a?tr.addScaledVector(wa,h):tr.addScaledVector(wa.sub(t),h))}t.add(tr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Js.copy(i.boundingSphere),Js.applyMatrix4(r),un.copy(e.ray).recast(e.near),!(Js.containsPoint(un.origin)===!1&&(un.intersectSphere(Js,sc)===null||un.origin.distanceToSquared(sc)>(e.far-e.near)**2))&&(nc.copy(r).invert(),un.copy(e.ray).applyMatrix4(nc),!(i.boundingBox!==null&&un.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,un)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,d=r.groups,u=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,v=d.length;m<v;m++){const g=d[m],p=a[g.materialIndex],M=Math.max(g.start,u.start),T=Math.min(o.count,Math.min(g.start+g.count,u.start+u.count));for(let E=M,R=T;E<R;E+=3){const b=o.getX(E),_=o.getX(E+1),y=o.getX(E+2);s=nr(this,p,e,i,c,h,f,b,_,y),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const m=Math.max(0,u.start),v=Math.min(o.count,u.start+u.count);for(let g=m,p=v;g<p;g+=3){const M=o.getX(g),T=o.getX(g+1),E=o.getX(g+2);s=nr(this,a,e,i,c,h,f,M,T,E),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,v=d.length;m<v;m++){const g=d[m],p=a[g.materialIndex],M=Math.max(g.start,u.start),T=Math.min(l.count,Math.min(g.start+g.count,u.start+u.count));for(let E=M,R=T;E<R;E+=3){const b=E,_=E+1,y=E+2;s=nr(this,p,e,i,c,h,f,b,_,y),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{const m=Math.max(0,u.start),v=Math.min(l.count,u.start+u.count);for(let g=m,p=v;g<p;g+=3){const M=g,T=g+1,E=g+2;s=nr(this,a,e,i,c,h,f,M,T,E),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}}function sp(n,e,t,i,s,r,a,o){let l;if(e.side===Xt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===pn,o),l===null)return null;ir.copy(o),ir.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(ir);return c<t.near||c>t.far?null:{distance:c,point:ir.clone(),object:n}}function nr(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,js),n.getVertexPosition(l,Qs),n.getVertexPosition(c,er);const h=sp(n,e,t,i,js,Qs,er,rc);if(h){const f=new X;pi.getBarycoord(rc,js,Qs,er,f),s&&(h.uv=pi.getInterpolatedAttribute(s,o,l,c,f,new rt)),r&&(h.uv1=pi.getInterpolatedAttribute(r,o,l,c,f,new rt)),a&&(h.normal=pi.getInterpolatedAttribute(a,o,l,c,f,new X),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new X,materialIndex:0};pi.getNormal(js,Qs,er,d.normal),h.face=d,h.barycoord=f}return h}const hs=new ft,ac=new ft,oc=new ft,rp=new ft,lc=new et,sr=new X,Aa=new Vi,cc=new et,Ra=new Vr;class cx extends ri{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Hl,this.bindMatrix=new et,this.bindMatrixInverse=new et,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new sn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,sr),this.boundingBox.expandByPoint(sr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Vi),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,sr),this.boundingSphere.expandByPoint(sr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}raycast(e,t){const i=this.material,s=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Aa.copy(this.boundingSphere),Aa.applyMatrix4(s),e.ray.intersectsSphere(Aa)!==!1&&(cc.copy(s).invert(),Ra.copy(e.ray).applyMatrix4(cc),!(this.boundingBox!==null&&Ra.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ra)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new ft,t=this.geometry.attributes.skinWeight;for(let i=0,s=t.count;i<s;i++){e.fromBufferAttribute(t,i);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Hl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Qd?this.bindMatrixInverse.copy(this.bindMatrix).invert():Ne("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,s=this.geometry;ac.fromBufferAttribute(s.attributes.skinIndex,e),oc.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(hs.copy(t),t.set(0,0,0,0)):(hs.set(t.x,t.y,t.z,1),t.set(0,0,0)),hs.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=oc.getComponent(r);if(a!==0){const o=ac.getComponent(r);lc.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(rp.copy(hs).applyMatrix4(lc),a)}}return t.isVector4&&(t.w=hs.w),t.applyMatrix4(this.bindMatrixInverse)}}class ap extends St{constructor(){super(),this.isBone=!0,this.type="Bone"}}class $n extends Nt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Tt,h=Tt,f,d){super(null,a,o,l,c,h,s,r,f,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const hc=new et,op=new et;class Bh{constructor(e=[],t=[]){this.uuid=Ei(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.previousBoneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Ne("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,s=this.bones.length;i<s;i++)this.boneInverses.push(new et)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new et;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,s=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:op;hc.multiplyMatrices(o,t[r]),hc.toArray(i,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new Bh(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new $n(t,e,e,si,ni);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null),this.previousBoneTexture!==null&&(this.previousBoneTexture.dispose(),this.previousBoneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,s=e.bones.length;i<s;i++){const r=e.bones[i];let a=t[r];a===void 0&&(Ne("Skeleton: No bone found with UUID:",r),a=new ap),this.bones.push(a),this.boneInverses.push(new et().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const a=t[s];e.bones.push(a.uuid);const o=i[s];e.boneInverses.push(o.toArray())}return e}}class uc extends Hi{constructor(e,t,i,s=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Nn=new et,dc=new et,rr=[],fc=new sn,lp=new et,us=new ri,ds=new Vi;class hx extends ri{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new uc(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,lp)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new sn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Nn),fc.copy(e.boundingBox).applyMatrix4(Nn),this.boundingBox.union(fc)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Vi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Nn),ds.copy(e.boundingSphere).applyMatrix4(Nn),this.boundingSphere.union(ds)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),this.morphTexture=e.morphTexture!==null?e.morphTexture.clone():null,this.instanceColor=e.instanceColor!==null?e.instanceColor.clone():null,this.count=e.count,this.boundingBox=e.boundingBox!==null?e.boundingBox.clone():null,this.boundingSphere=e.boundingSphere!==null?e.boundingSphere.clone():null,this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,a=e*r+1;for(let o=0;o<i.length;o++)i[o]=s[a+o]}raycast(e,t){const i=this.matrixWorld,s=this.count;if(us.geometry=this.geometry,us.material=this.material,us.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ds.copy(this.boundingSphere),ds.applyMatrix4(i),e.ray.intersectsSphere(ds)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Nn),dc.multiplyMatrices(i,Nn),us.matrixWorld=dc,us.raycast(e,rr);for(let a=0,o=rr.length;a<o;a++){const l=rr[a];l.instanceId=r,l.object=this,t.push(l)}rr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new uc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const i=t.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new $n(new Float32Array(s*this.count),s,this.count,zr,ni));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*e;return r[l]=o,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const dn=new Vi,cp=new rt(.5,.5),ar=new X;class Ps{constructor(e=new Ji,t=new Ji,i=new Ji,s=new Ji,r=new Ji,a=new Ji){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=mi,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],d=r[6],u=r[7],m=r[8],v=r[9],g=r[10],p=r[11],M=r[12],T=r[13],E=r[14],R=r[15];if(s[0].setComponents(c-a,u-h,p-m,R-M).normalize(),s[1].setComponents(c+a,u+h,p+m,R+M).normalize(),s[2].setComponents(c+o,u+f,p+v,R+T).normalize(),s[3].setComponents(c-o,u-f,p-v,R-T).normalize(),i)s[4].setComponents(l,d,g,E).normalize(),s[5].setComponents(c-l,u-d,p-g,R-E).normalize();else if(s[4].setComponents(c-l,u-d,p-g,R-E).normalize(),t===mi)s[5].setComponents(c+l,u+d,p+g,R+E).normalize();else if(t===Rs)s[5].setComponents(l,d,g,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),dn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),dn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(dn)}intersectsSprite(e){dn.center.set(0,0,0);const t=cp.distanceTo(e.center);return dn.radius=.7071067811865476+t,dn.applyMatrix4(e.matrixWorld),this.intersectsSphere(dn)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(ar.x=s.normal.x>0?e.max.x:e.min.x,ar.y=s.normal.y>0?e.max.y:e.min.y,ar.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ar)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const pc=new et;class Ko{constructor(){this.coordinateSystem=mi,this._frustums=[],this._count=0}setFromArrayCamera(e){const t=e.cameras,i=this._frustums;for(let s=0;s<t.length;s++){const r=t[s];pc.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),i[s]===void 0&&(i[s]=new Ps),i[s].setFromProjectionMatrix(pc,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsObject(e))return!0;return!1}intersectsSprite(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSprite(e))return!0;return!1}intersectsSphere(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsSphere(e))return!0;return!1}intersectsBox(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].intersectsBox(e))return!0;return!1}containsPoint(e){const t=this._frustums;for(let i=0;i<this._count;i++)if(t[i].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;const t=this._frustums,i=e._frustums;for(let s=0;s<e._count;s++)t[s]===void 0&&(t[s]=new Ps),t[s].copy(i[s]);return this._count=e._count,this}clone(){return new Ko().copy(this)}}class hp extends _n{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Fr=new X,Or=new X,mc=new et,fs=new Vr,or=new Vi,Ca=new X,gc=new X;class kh extends St{constructor(e=new Ti,t=new hp){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Fr.fromBufferAttribute(t,s-1),Or.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Fr.distanceTo(Or);e.setAttribute("lineDistance",new Zt(i,1))}else Ne("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),or.copy(i.boundingSphere),or.applyMatrix4(s),or.radius+=r,e.ray.intersectsSphere(or)===!1)return;mc.copy(s).invert(),fs.copy(e.ray).applyMatrix4(mc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const u=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let v=u,g=m-1;v<g;v+=c){const p=h.getX(v),M=h.getX(v+1),T=lr(this,e,fs,l,p,M,v);T&&t.push(T)}if(this.isLineLoop){const v=h.getX(m-1),g=h.getX(u),p=lr(this,e,fs,l,v,g,m-1);p&&t.push(p)}}else{const u=Math.max(0,a.start),m=Math.min(d.count,a.start+a.count);for(let v=u,g=m-1;v<g;v+=c){const p=lr(this,e,fs,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=lr(this,e,fs,l,m-1,u,m-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function lr(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(Fr.fromBufferAttribute(o,s),Or.fromBufferAttribute(o,r),t.distanceSqToSegment(Fr,Or,Ca,gc)>i)return;Ca.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(Ca);if(!(c<e.near||c>e.far))return{distance:c,point:gc.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const _c=new X,vc=new X;class ux extends kh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)_c.fromBufferAttribute(t,s),vc.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+_c.distanceTo(vc);e.setAttribute("lineDistance",new Zt(i,1))}else Ne("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class dx extends kh{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class up extends _n{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ze(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const xc=new et,Co=new Vr,cr=new Vi,hr=new X;class fx extends St{constructor(e=new Ti,t=new up){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0?this.morphTargetInfluences=e.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,e.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),cr.copy(i.boundingSphere),cr.applyMatrix4(s),cr.radius+=r,e.ray.intersectsSphere(cr)===!1)return;xc.copy(s).invert(),Co.copy(e.ray).applyMatrix4(xc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,f=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),u=Math.min(c.count,a.start+a.count);for(let m=d,v=u;m<v;m++){const g=c.getX(m);hr.fromBufferAttribute(f,g),yc(hr,g,l,s,e,t,this)}}else{const d=Math.max(0,a.start),u=Math.min(f.count,a.start+a.count);for(let m=d,v=u;m<v;m++)hr.fromBufferAttribute(f,m),yc(hr,m,l,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function yc(n,e,t,i,s,r,a){const o=Co.distanceSqToPoint(n);if(o<t){const l=new X;Co.closestPointToPoint(n,l),l.applyMatrix4(i);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class zh extends Nt{constructor(e=[],t=Xn,i,s,r,a,o,l,c,h){super(e,t,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Kn extends Nt{constructor(e,t,i=Mi,s,r,a,o=Tt,l=Tt,c,h=en,f=1){if(h!==en&&h!==Qi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:f};super(d,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new $o(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Hh extends Kn{constructor(e,t=Mi,i=Xn,s,r,a=Tt,o=Tt,l,c=en){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,i,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Vh extends Nt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Is extends Ti{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let d=0,u=0;m("z","y","x",-1,-1,i,t,e,a,r,0),m("z","y","x",1,-1,i,t,-e,a,r,1),m("x","z","y",1,1,e,i,t,s,a,2),m("x","z","y",1,-1,e,i,-t,s,a,3),m("x","y","z",1,-1,e,t,i,s,r,4),m("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Zt(c,3)),this.setAttribute("normal",new Zt(h,3)),this.setAttribute("uv",new Zt(f,2));function m(v,g,p,M,T,E,R,b,_,y,N){const I=E/_,D=R/y,F=E/2,W=R/2,A=b/2,H=_+1,G=y+1;let B=0,ne=0;const q=new X;for(let J=0;J<G;J++){const ie=J*D-W;for(let Te=0;Te<H;Te++){const Fe=Te*I-F;q[v]=Fe*M,q[g]=ie*T,q[p]=A,c.push(q.x,q.y,q.z),q[v]=0,q[g]=0,q[p]=b>0?1:-1,h.push(q.x,q.y,q.z),f.push(Te/_),f.push(1-J/y),B+=1}}for(let J=0;J<y;J++)for(let ie=0;ie<_;ie++){const Te=d+ie+H*J,Fe=d+ie+H*(J+1),K=d+(ie+1)+H*(J+1),me=d+(ie+1)+H*J;l.push(Te,Fe,me),l.push(Fe,K,me),ne+=6}o.addGroup(u,ne,N),u+=ne,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Is(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Gr extends Ti{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,f=e/o,d=t/l,u=[],m=[],v=[],g=[];for(let p=0;p<h;p++){const M=p*d-a;for(let T=0;T<c;T++){const E=T*f-r;m.push(E,-M,0),v.push(0,0,1),g.push(T/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<o;M++){const T=M+c*p,E=M+c*(p+1),R=M+1+c*(p+1),b=M+1+c*p;u.push(T,E,b),u.push(E,R,b)}this.setIndex(u),this.setAttribute("position",new Zt(m,3)),this.setAttribute("normal",new Zt(v,3)),this.setAttribute("uv",new Zt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gr(e.width,e.height,e.widthSegments,e.heightSegments)}}function Zn(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];if(Sc(s))s.isRenderTargetTexture?(Ne("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone();else if(Array.isArray(s))if(Sc(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][i]=r}else e[t][i]=s.slice();else e[t][i]=s}}return e}function zt(n){const e={};for(let t=0;t<n.length;t++){const i=Zn(n[t]);for(const s in i)e[s]=i[s]}return e}function Sc(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function dp(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Gh(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:st.workingColorSpace}const fp={clone:Zn,merge:zt};var pp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class gn extends _n{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pp,this.fragmentShader=mp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zn(e.uniforms),this.uniformsGroups=dp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const i in e.uniforms){const s=e.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=t[s.value]||null;break;case"c":this.uniforms[i].value=new Ze().setHex(s.value);break;case"v2":this.uniforms[i].value=new rt().fromArray(s.value);break;case"v3":this.uniforms[i].value=new X().fromArray(s.value);break;case"v4":this.uniforms[i].value=new ft().fromArray(s.value);break;case"m3":this.uniforms[i].value=new He().fromArray(s.value);break;case"m4":this.uniforms[i].value=new et().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Po extends gn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class gp extends _n{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ro,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class px extends gp{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new rt(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Je(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Ze(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ze(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ze(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){this._diffuseRoughness>0!=e>0&&this.version++,this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}get iridescenceThicknessRange(){return Gn('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){Gn('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class _p extends _n{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=af,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class vp extends _n{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function ji(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function _s(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}function xp(n){function e(s,r){return n[s]-n[r]}const t=n.length,i=new Array(t);for(let s=0;s!==t;++s)i[s]=s;return i.sort(e),i}function Mc(n,e,t){const i=n.length,s=new n.constructor(i);for(let r=0,a=0;a!==i;++r){const o=t[r]*e;for(let l=0;l!==e;++l)s[a++]=n[o+l]}return s}function yp(n,e,t,i){let s=1,r=n[0];for(;r!==void 0&&r[i]===void 0;)r=n[s++];if(r===void 0)return;let a=r[i];if(a!==void 0)if(Array.isArray(a))do a=r[i],a!==void 0&&(e.push(r.time),t.push(...a)),r=n[s++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[i],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=n[s++];while(r!==void 0);else do a=r[i],a!==void 0&&(e.push(r.time),t.push(a)),r=n[s++];while(r!==void 0)}class Ls{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,s=t[i],r=t[i-1];e:{t:{let a;i:{n:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<r)break n;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(r=s,s=t[++i],e<s)break t}a=t.length;break i}if(!(e>=r)){const o=t[1];e<o&&(i=2,r=o);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=t[--i-1],e>=r)break t}a=i,i=0;break i}break e}for(;i<a;){const o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],r=t[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=e*s;for(let a=0;a!==s;++a)t[a]=i[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Sp extends Ls{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:zn,endingEnd:zn}}intervalChanged_(e,t,i){const s=this.parameterPositions;let r=e-2,a=e+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Hn:r=e,o=2*t-i;break;case Lr:r=s.length-2,o=t+s[r]-s[r+1];break;default:r=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Hn:a=e,l=2*i-t;break;case Lr:a=1,l=i+s[1]-s[0];break;default:a=e-1,l=t}const c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,f=this._offsetNext,d=this._weightPrev,u=this._weightNext,m=(i-t)/(s-t),v=m*m,g=v*m,p=-d*g+2*d*v-d*m,M=(1+d)*g+(-1.5-2*d)*v+(-.5+d)*m+1,T=(-1-u)*g+(1.5+u)*v+.5*m,E=u*g-u*v;for(let R=0;R!==o;++R)r[R]=p*a[h+R]+M*a[c+R]+T*a[l+R]+E*a[f+R];return r}}class Wh extends Ls{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(s-t),f=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*f+a[l+d]*h;return r}}class Mp extends Ls{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class bp extends Ls{interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,f=this.outTangents;if(!h||!f){const m=(i-t)/(s-t),v=1-m;for(let g=0;g!==o;++g)r[g]=a[c+g]*v+a[l+g]*m;return r}const d=o*2,u=e-1;for(let m=0;m!==o;++m){const v=a[c+m],g=a[l+m],p=u*d+m*2,M=f[p],T=f[p+1],E=e*d+m*2,R=h[E],b=h[E+1],_=Tp(i,t,M,R,s);r[m]=Xh(_,v,T,b,g)}return r}}function Xh(n,e,t,i,s){const r=1-n;return r*r*r*e+3*r*r*n*t+3*r*n*n*i+n*n*n*s}function Ep(n,e,t,i,s){const r=1-n;return 3*r*r*(t-e)+6*r*n*(i-t)+3*n*n*(s-i)}function Tp(n,e,t,i,s){let r=(n-e)/(s-e);for(let a=0;a<8;a++){const o=Xh(r,e,t,i,s)-n;if(Math.abs(o)<1e-10)break;const l=Ep(r,e,t,i,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class gi{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ji(t,this.TimeBufferType),this.values=ji(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:ji(e.times,Array),values:ji(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s),_s(e.settings)&&(i.settings={inTangents:ji(e.settings.inTangents,Array),outTangents:ji(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Mp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Wh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Sp(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new bp(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ir:t=this.InterpolantFactoryMethodDiscrete;break;case Ao:t=this.InterpolantFactoryMethodLinear;break;case ra:t=this.InterpolantFactoryMethodSmooth;break;case Vl:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Ne("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ir;case this.InterpolantFactoryMethodLinear:return Ao;case this.InterpolantFactoryMethodSmooth:return ra;case this.InterpolantFactoryMethodBezier:return Vl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e;_s(this.settings)&&(bc(this.settings.inTangents,e),bc(this.settings.outTangents,e))}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e;_s(this.settings)&&(Ec(this.settings.inTangents,e),Ec(this.settings.outTangents,e))}return this}trim(e,t){const i=this.times,s=i.length;let r=0,a=s-1;for(;r!==s&&i[r]<e;)++r;for(;a!==-1&&i[a]>t;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=i.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(ke("KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,s=this.values,r=i.length;r===0&&(ke("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=i[o];if(typeof l=="number"&&isNaN(l)){ke("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){ke("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&mf(s))for(let o=0,l=s.length;o!==l;++o){const c=s[o];if(isNaN(c)){ke("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===ra,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{const f=o*i,d=f-i,u=f+i;for(let m=0;m!==i;++m){const v=t[f+m];if(v!==t[d+m]||v!==t[u+m]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const f=o*i,d=a*i;for(let u=0;u!==i;++u)t[d+u]=t[f+u]}++a}}if(r>0){e[a]=e[r];for(let o=r*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,_s(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}}function bc(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]+=e}function Ec(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}gi.prototype.ValueTypeName="";gi.prototype.TimeBufferType=Float32Array;gi.prototype.ValueBufferType=Float32Array;gi.prototype.DefaultInterpolation=Ao;class Jn extends gi{constructor(e,t,i){super(e,t,i)}}Jn.prototype.ValueTypeName="bool";Jn.prototype.ValueBufferType=Array;Jn.prototype.DefaultInterpolation=Ir;Jn.prototype.InterpolantFactoryMethodLinear=void 0;Jn.prototype.InterpolantFactoryMethodSmooth=void 0;class qh extends gi{constructor(e,t,i,s){super(e,t,i,s)}}qh.prototype.ValueTypeName="color";class Zo extends gi{constructor(e,t,i,s){super(e,t,i,s)}}Zo.prototype.ValueTypeName="number";class wp extends Ls{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(s-t);let c=e*o;for(let h=c+o;c!==h;c+=4)yi.slerpFlat(r,0,a,c-o,a,c,l);return r}}class Jo extends gi{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new wp(this.times,this.values,this.getValueSize(),e)}}Jo.prototype.ValueTypeName="quaternion";Jo.prototype.InterpolantFactoryMethodSmooth=void 0;class jn extends gi{constructor(e,t,i){super(e,t,i)}}jn.prototype.ValueTypeName="string";jn.prototype.ValueBufferType=Array;jn.prototype.DefaultInterpolation=Ir;jn.prototype.InterpolantFactoryMethodLinear=void 0;jn.prototype.InterpolantFactoryMethodSmooth=void 0;class Yh extends gi{constructor(e,t,i,s){super(e,t,i,s)}}Yh.prototype.ValueTypeName="vector";class Tc{constructor(e="",t=-1,i=[],s=Wo){this.name=e,this.tracks=i,this.duration=t,this.blendMode=s,this.uuid=Ei(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,s=1/(e.fps||1);for(let a=0,o=i.length;a!==o;++a)t.push(Rp(i[a]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],i=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=i.length;r!==a;++r)t.push(gi.toJSON(i[r]));return s}static CreateFromMorphTargetSequence(e,t,i,s){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=xp(l);l=Mc(l,1,h),c=Mc(c,1,h),!s&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Zo(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/i))}return new this(e,-1,a)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const s=e;i=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<i.length;s++)if(i[s].name===t)return i[s];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const s={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const f=h[1];let d=s[f];d||(s[f]=d=[]),d.push(c)}}const a=[];for(const o in s)a.push(this.CreateFromMorphTargetSequence(o,s[o],t,i));return a}resetDuration(){const e=this.tracks;let t=0;for(let i=0,s=e.length;i!==s;++i){const r=this.tracks[i];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let i=0;i<this.tracks.length;i++)e.push(this.tracks[i].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Ap(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Zo;case"vector":case"vector2":case"vector3":case"vector4":return Yh;case"color":return qh;case"quaternion":return Jo;case"bool":case"boolean":return Jn;case"string":return jn}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function Rp(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Ap(n.type);if(n.times===void 0){const i=[],s=[];yp(n.keys,i,s,"value"),n.times=i,n.values=s}let t;return e.parse!==void 0?t=e.parse(n):t=new e(n.name,n.times,n.values,n.interpolation),_s(n.settings)&&(t.settings={inTangents:ji(n.settings.inTangents,Float32Array),outTangents:ji(n.settings.outTangents,Float32Array)}),t}const Bi={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(wc(n)||(this.files[n]=e))},get:function(n){if(this.enabled!==!1&&!wc(n))return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};function wc(n){try{const e=n.slice(n.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Cp{constructor(e,t,i){const s=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,r===!1&&s.onStart!==void 0&&s.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){const f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,d=c.length;f<d;f+=2){const u=c[f],m=c[f+1];if(u.global&&(u.lastIndex=0),u.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Pp=new Cp;class Qn{constructor(e){this.manager=e!==void 0?e:Pp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const i=this;return new Promise(function(s,r){i.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}}Qn.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ni={};class Ip extends Error{constructor(e,t){super(e),this.response=t}}class Lp extends Qn{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Bi.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(Ni[e]!==void 0){Ni[e].push({onLoad:t,onProgress:i,onError:s});return}Ni[e]=[],Ni[e].push({onLoad:t,onProgress:i,onError:s});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ne("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Ni[e],f=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),u=d?parseInt(d):0,m=u!==0;let v=0;const g=new ReadableStream({start(p){M();function M(){f.read().then(({done:T,value:E})=>{if(T)p.close();else{v+=E.byteLength;const R=new ProgressEvent("progress",{lengthComputable:m,loaded:v,total:u});for(let b=0,_=h.length;b<_;b++){const y=h[b];y.onProgress&&y.onProgress(R)}p.enqueue(E),M()}},T=>{p.error(T)})}}});return new Response(g)}else throw new Ip(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const f=/charset="?([^;"\s]*)"?/i.exec(o),d=f&&f[1]?f[1].toLowerCase():void 0,u=new TextDecoder(d);return c.arrayBuffer().then(m=>u.decode(m))}}}).then(c=>{Bi.add(`file:${e}`,c);const h=Ni[e];delete Ni[e];for(let f=0,d=h.length;f<d;f++){const u=h[f];u.onLoad&&u.onLoad(c)}}).catch(c=>{const h=Ni[e];if(h===void 0)throw this.manager.itemError(e),c;delete Ni[e];for(let f=0,d=h.length;f<d;f++){const u=h[f];u.onError&&u.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Dn=new WeakMap;class Np extends Qn{constructor(e){super(e)}load(e,t,i,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Bi.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let f=Dn.get(a);f===void 0&&(f=[],Dn.set(a,f)),f.push({onLoad:t,onError:s})}return a}const o=Cs("img");function l(){h(),t&&t(this);const f=Dn.get(this)||[];for(let d=0;d<f.length;d++){const u=f[d];u.onLoad&&u.onLoad(this)}Dn.delete(this),r.manager.itemEnd(e)}function c(f){h(),s&&s(f),Bi.remove(`image:${e}`);const d=Dn.get(this)||[];for(let u=0;u<d.length;u++){const m=d[u];m.onError&&m.onError(f)}Dn.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Bi.add(`image:${e}`,o),r.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}}class mx extends Qn{constructor(e){super(e)}load(e,t,i,s){const r=this,a=new $n,o=new Lp(this.manager);return o.setPriority(this.priority),o.setCache(this.cache),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(l){let c;try{c=r.parse(l)}catch(h){s!==void 0?s(h):ke(h);return}r._applyTexData(a,c),t&&t(a,c)},i,s),a}createDataTexture(e){const t=new $n;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){t.image!==void 0?e.image=t.image:t.data!==void 0&&(e.image.width=t.width,e.image.height=t.height,e.image.data=t.data),e.wrapS=t.wrapS!==void 0?t.wrapS:Kt,e.wrapT=t.wrapT!==void 0?t.wrapT:Kt,e.magFilter=t.magFilter!==void 0?t.magFilter:It,e.minFilter=t.minFilter!==void 0?t.minFilter:It,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.mipmaps!==void 0&&(e.mipmaps=t.mipmaps,e.minFilter=Oi),t.mipmapCount===1&&(e.minFilter=It),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),e.needsUpdate=!0}}class gx extends Qn{constructor(e){super(e)}load(e,t,i,s){const r=new Nt,a=new Np(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},i,s),r}}class Wr extends St{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ze(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class _x extends Wr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Pa=new et,Ac=new X,Rc=new X;class jo{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new rt(512,512),this.mapType=Wt,this.map=null,this.mapPass=null,this.matrix=new et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ps,this._frameExtents=new rt(1,1),this._viewportCount=1,this._viewports=[new ft(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;Ac.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ac),Rc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Rc),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,i,s){Pa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),i.setFromProjectionMatrix(Pa,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=s?s.z/r.x:1,o=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;e.coordinateSystem===Rs||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Pa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const ur=new X,dr=new yi,_i=new X;class $h extends St{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new et,this.projectionMatrix=new et,this.projectionMatrixInverse=new et,this.coordinateSystem=mi,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ur,dr,_i),_i.x===1&&_i.y===1&&_i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ur,dr,_i.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(ur,dr,_i),_i.x===1&&_i.y===1&&_i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ur,dr,_i.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Ki=new X,Cc=new rt,Pc=new rt;class ii extends $h{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Yn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ms*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Yn*2*Math.atan(Math.tan(Ms*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ki.x,Ki.y).multiplyScalar(-e/Ki.z),Ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ki.x,Ki.y).multiplyScalar(-e/Ki.z)}getViewSize(e,t){return this.getViewBounds(e,Cc,Pc),t.subVectors(Pc,Cc)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ms*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Dp extends jo{constructor(){super(new ii(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,i=Yn*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(i!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=i,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class vx extends Wr{constructor(e,t,i=0,s=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.target=new St,this.distance=i,this.angle=s,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Dp}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Up extends jo{constructor(){super(new ii(90,1,.5,500)),this.isPointLightShadow=!0}}class xx extends Wr{constructor(e,t,i=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Up}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Qo extends $h{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Fp extends jo{constructor(){super(new Qo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class yx extends Wr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.target=new St,this.shadow=new Fp}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Sx{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const Ia=new WeakMap;class Mx extends Qn{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Ne("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Ne("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,i,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Bi.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{Ia.has(a)===!0?(s&&s(Ia.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}const o={};o.credentials=this.withCredentials||this.crossOrigin!=="anonymous"?"include":"same-origin",o.headers=this.requestHeader,o.priority=this.priority,o.cache=this.cache,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Bi.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){s&&s(c),Ia.set(l,c),Bi.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Bi.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Un=-90,Fn=1;class Io extends St{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ii(Un,Fn,e,t);s.layers=this.layers,this.add(s);const r=new ii(Un,Fn,e,t);r.layers=this.layers,this.add(r);const a=new ii(Un,Fn,e,t);a.layers=this.layers,this.add(a);const o=new ii(Un,Fn,e,t);o.layers=this.layers,this.add(o);const l=new ii(Un,Fn,e,t);l.layers=this.layers,this.add(l);const c=new ii(Un,Fn,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===mi)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Rs)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.mipmapsAutoUpdate;i.texture.mipmapsAutoUpdate=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(i,1,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,2,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,3,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.mipmapsAutoUpdate=v,e.setRenderTarget(i,5,s),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,d,u),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Op extends ii{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}class Bp{constructor(e,t,i){this.binding=e,this.valueSize=i;let s,r,a;switch(t){case"quaternion":s=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:s=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const i=this.buffer,s=this.valueSize,r=e*s+s;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==s;++o)i[r+o]=i[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(i,r,0,o,s)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,i=this.valueSize,s=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,s,0,e,i),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,i=this.buffer,s=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(i,s,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(i,s,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(i[l]!==i[l+t]){o.setValue(i,s);break}}saveOriginalState(){const e=this.binding,t=this.buffer,i=this.valueSize,s=i*this._origIndex;e.getValue(t,s);for(let r=i,a=s;r!==a;++r)t[r]=t[s+r%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let i=e;i<t;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[t+i]=this.buffer[e+i]}_select(e,t,i,s,r){if(s>=.5)for(let a=0;a!==r;++a)e[t+a]=e[i+a]}_slerp(e,t,i,s){yi.slerpFlat(e,t,e,t,e,i,s)}_slerpAdditive(e,t,i,s,r){const a=this._workIndex*r;yi.multiplyQuaternionsFlat(e,a,e,t,e,i),yi.slerpFlat(e,t,e,t,e,a,s)}_lerp(e,t,i,s,r){const a=1-s;for(let o=0;o!==r;++o){const l=t+o;e[l]=e[l]*a+e[i+o]*s}}_lerpAdditive(e,t,i,s,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[i+a]*s}}}const el="\\[\\]\\.:\\/",kp=new RegExp("["+el+"]","g"),tl="[^"+el+"]",zp="[^"+el.replace("\\.","")+"]",Hp=/((?:WC+[\/:])*)/.source.replace("WC",tl),Vp=/(WCOD+)?/.source.replace("WCOD",zp),Gp=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",tl),Wp=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",tl),Xp=new RegExp("^"+Hp+Vp+Gp+Wp+"$"),qp=["material","materials","bones","map"];class Yp{constructor(e,t,i){const s=i||dt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class dt{constructor(e,t,i){this.path=t,this.parsedPath=i||dt.parseTrackName(t),this.node=dt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new dt.Composite(e,t,i):new dt(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(kp,"")}static parseTrackName(e){const t=Xp.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=i.nodeName.substring(s+1);qp.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=i(o.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=dt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ne("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[s];if(a===void 0){const c=t.nodeName;ke("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}dt.Composite=Yp;dt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};dt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};dt.prototype.GetterByBindingType=[dt.prototype._getValue_direct,dt.prototype._getValue_array,dt.prototype._getValue_arrayElement,dt.prototype._getValue_toArray];dt.prototype.SetterByBindingTypeAndVersioning=[[dt.prototype._setValue_direct,dt.prototype._setValue_direct_setNeedsUpdate,dt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_array,dt.prototype._setValue_array_setNeedsUpdate,dt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_arrayElement,dt.prototype._setValue_arrayElement_setNeedsUpdate,dt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_fromArray,dt.prototype._setValue_fromArray_setNeedsUpdate,dt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class $p{constructor(e,t,i=null,s=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=i,this.blendMode=s;const r=t.tracks,a=r.length,o=new Array(a),l={endingStart:zn,endingEnd:zn};for(let c=0;c!==a;++c){const h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=nf,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,i=!1){if(e.fadeOut(t),this.fadeIn(t),i===!0){const s=this._clip.duration,r=e._clip.duration,a=r/s,o=s/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,i=!1){return e.crossFadeFrom(this,t,i)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,i){const s=this._mixer,r=s.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=s._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+i,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,i,s){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*i;l<0||i===0?t=0:(this._startTime=null,t=i*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case rf:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case Wo:default:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulate(s,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const i=this._weightInterpolant;if(i!==null){const s=i.evaluate(e)[0];t*=s,e>i.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const i=this._timeScaleInterpolant;if(i!==null){const s=i.evaluate(e)[0];t*=s,e>i.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,i=this.loop;let s=this.time+e,r=this._loopCount;const a=i===sf;if(e===0)return r===-1?s:a&&(r&1)===1?t-s:s;if(i===tf){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(s>=t)s=t;else if(s<0)s=0;else{this.time=s;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),s>=t||s<0){const o=Math.floor(s/t);s-=t*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=e>0?t:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=s;if(a&&(r&1)===1)return t-s}return s}_setEndings(e,t,i){const s=this._interpolantSettings;i?(s.endingStart=Hn,s.endingEnd=Hn):(e?s.endingStart=this.zeroSlopeAtStart?Hn:zn:s.endingStart=Lr,t?s.endingEnd=this.zeroSlopeAtEnd?Hn:zn:s.endingEnd=Lr)}_scheduleFading(e,t,i){const s=this._mixer,r=s.time;let a=this._weightInterpolant;a===null&&(a=s._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=i,this}}const Kp=new Float32Array(1);class bx extends nn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){const i=e._localRoot||this._root,s=e._clip.tracks,r=s.length,a=e._propertyBindings,o=e._interpolants,l=i.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let f=0;f!==r;++f){const d=s[f],u=d.name;let m=h[u];if(m!==void 0)++m.referenceCount,a[f]=m;else{if(m=a[f],m!==void 0){m._cacheIndex===null&&(++m.referenceCount,this._addInactiveBinding(m,l,u));continue}const v=t&&t._propertyBindings[f].binding.parsedPath;m=new Bp(dt.create(i,u,v),d.ValueTypeName,d.getValueSize()),++m.referenceCount,this._addInactiveBinding(m,l,u),a[f]=m}o[f].resultBuffer=m.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const i=(e._localRoot||this._root).uuid,s=e._clip.uuid,r=this._actionsByClip[s];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,s,i)}const t=e._propertyBindings;for(let i=0,s=t.length;i!==s;++i){const r=t[i];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let i=0,s=t.length;i!==s;++i){const r=t[i];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,i){const s=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=s.length,s.push(e),a.actionByRoot[i]=e}_removeInactiveAction(e){const t=this._actions,i=t[t.length-1],s=e._cacheIndex;i._cacheIndex=s,t[s]=i,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const f=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete f[d],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let i=0,s=t.length;i!==s;++i){const r=t[i];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,i=e._cacheIndex,s=this._nActiveActions++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_takeBackAction(e){const t=this._actions,i=e._cacheIndex,s=--this._nActiveActions,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_addInactiveBinding(e,t,i){const s=this._bindingsByRootAndName,r=this._bindings;let a=s[t];a===void 0&&(a={},s[t]=a),a[i]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,i=e.binding,s=i.rootNode.uuid,r=i.path,a=this._bindingsByRootAndName,o=a[s],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[s]}_lendBinding(e){const t=this._bindings,i=e._cacheIndex,s=this._nActiveBindings++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_takeBackBinding(e){const t=this._bindings,i=e._cacheIndex,s=--this._nActiveBindings,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=i,t[i]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let i=e[t];return i===void 0&&(i=new Wh(new Float32Array(2),new Float32Array(2),1,Kp),i.__cacheIndex=t,e[t]=i),i}_takeBackControlInterpolant(e){const t=this._controlInterpolants,i=e.__cacheIndex,s=--this._nActiveControlInterpolants,r=t[s];e.__cacheIndex=s,t[s]=e,r.__cacheIndex=i,t[i]=r}clipAction(e,t,i){const s=t||this._root,r=s.uuid;let a=typeof e=="string"?Tc.findByName(s,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(i===void 0&&(a!==null?i=a.blendMode:i=Wo),l!==void 0){const f=l.actionByRoot[r];if(f!==void 0&&f.blendMode===i)return f;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new $p(this,a,t,i);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(e,t){const i=t||this._root,s=i.uuid,r=typeof e=="string"?Tc.findByName(i,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[s]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let i=t-1;i>=0;--i)e[i].stop();return this}update(e){e*=this.timeScale;const t=this._actions,i=this._nActiveActions,s=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==i;++c)t[c]._update(s,e,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,i=e.uuid,s=this._actionsByClip,r=s[i];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,f=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,f._cacheIndex=h,t[h]=f,t.pop(),this._removeInactiveBindingsForAction(c)}delete s[i]}}uncacheRoot(e){const t=e.uuid,i=this._actionsByClip;for(const a in i){const o=i[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const s=this._bindingsByRootAndName,r=s[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const i=this.existingAction(e,t);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}}function Ic(n,e,t,i){const s=Zp(i);switch(t){case Eh:return n*e;case zr:return n*e/s.components*s.byteLength;case Ho:return n*e/s.components*s.byteLength;case mn:return n*e*2/s.components*s.byteLength;case Vo:return n*e*2/s.components*s.byteLength;case Th:return n*e*3/s.components*s.byteLength;case si:return n*e*4/s.components*s.byteLength;case Go:return n*e*4/s.components*s.byteLength;case vr:case xr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case yr:case Sr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ja:case Qa:return Math.max(n,16)*Math.max(e,8)/4;case Za:case ja:return Math.max(n,8)*Math.max(e,8)/2;case eo:case to:case no:case so:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case io:case Cr:case ro:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ao:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case oo:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case lo:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case co:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case ho:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case uo:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case fo:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case po:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case mo:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case go:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case _o:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case vo:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case xo:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case yo:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case So:case Mo:case bo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Eo:case To:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Pr:case wo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Zp(n){switch(n){case Wt:case yh:return{byteLength:1,components:1};case ws:case Sh:case bi:return{byteLength:2,components:1};case ko:case zo:return{byteLength:2,components:4};case Mi:case Bo:case ni:return{byteLength:4,components:1};case Mh:case bh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Oo}}));typeof window<"u"&&(window.__THREE__?Ne("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Oo);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Kh(){let n=null,e=!1,t=null,i=null;function s(r,a){i=n.requestAnimationFrame(s),t(r,a)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function Jp(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=n.HALF_FLOAT:u=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=n.SHORT;else if(c instanceof Uint32Array)u=n.UNSIGNED_INT;else if(c instanceof Int32Array)u=n.INT;else if(c instanceof Int8Array)u=n.BYTE;else if(c instanceof Uint8Array)u=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const h=l.array,f=l.updateRanges;if(n.bindBuffer(c,o),f.length===0)n.bufferSubData(c,0,h);else{f.sort((u,m)=>u.start-m.start);let d=0;for(let u=1;u<f.length;u++){const m=f[d],v=f[u];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++d,f[d]=v)}f.length=d+1;for(let u=0,m=f.length;u<m;u++){const v=f[u];n.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var jp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Qp=`#ifdef USE_ALPHAHASH
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
#endif`,em=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,tm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,im=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,nm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sm=`#ifdef USE_AOMAP
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
#endif`,rm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,am=`#ifdef USE_BATCHING
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
#endif`,om=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hm=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,um=`#ifdef USE_IRIDESCENCE
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
#endif`,dm=`#ifdef USE_BUMPMAP
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
#endif`,fm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,pm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,mm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,gm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_m=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,vm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,xm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,ym=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Sm=`#define PI 3.141592653589793
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
} // validated`,Mm=`vec3 transformedNormal = objectNormal;
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
#endif`,bm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Em=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,wm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Am="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rm=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Cm=`#ifdef USE_ENVMAP
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
#endif`,Pm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Im=`#ifdef USE_ENVMAP
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
#endif`,Lm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Nm=`#ifdef USE_ENVMAP
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
#endif`,Dm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Um=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Fm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Om=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Bm=`#ifdef USE_GRADIENTMAP
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
}`,km=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,zm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Vm=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Gm=`#ifdef USE_ENVMAP
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
#endif`,Wm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Xm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ym=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$m=`PhysicalMaterial material;
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
#endif`,Km=`uniform sampler2D dfgLUT;
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
}`,Zm=`
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
#endif`,Jm=`#if defined( RE_IndirectDiffuse )
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
#endif`,jm=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Qm=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,eg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,tg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ig=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ng=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,sg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,rg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ag=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,og=`#if defined( USE_POINTS_UV )
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
#endif`,lg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,hg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ug=`#if defined( USE_MORPHCOLORS )
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
#endif`,dg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fg=`#ifdef USE_MORPHTARGETS
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
#endif`,pg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,mg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,gg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,_g=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,yg=`#ifdef USE_NORMALMAP
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
#endif`,Sg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Mg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,bg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Eg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Tg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,wg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Ag=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Rg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Cg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Pg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ig=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Lg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ng=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Dg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ug=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Fg=`float getShadowMask() {
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
}`,Og=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Bg=`#ifdef USE_SKINNING
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
#endif`,kg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zg=`#ifdef USE_SKINNING
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
#endif`,Hg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Vg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Gg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Wg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Xg=`#ifdef USE_TRANSMISSION
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
#endif`,qg=`#ifdef USE_TRANSMISSION
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
#endif`,Yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$g=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Kg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Zg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Jg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,jg=`uniform sampler2D t2D;
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
}`,Qg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,e0=`uniform float backgroundBlurriness;
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
}`,t0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,i0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,n0=`#include <common>
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
}`,s0=`#if DEPTH_PACKING == 3200
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
}`,r0=`#define DISTANCE
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
}`,a0=`#define DISTANCE
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
}`,o0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,l0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,c0=`uniform float scale;
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
}`,h0=`uniform vec3 diffuse;
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
}`,u0=`#include <common>
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
}`,d0=`uniform vec3 diffuse;
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
}`,f0=`#define LAMBERT
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
}`,p0=`#define LAMBERT
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
}`,m0=`#define MATCAP
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
}`,g0=`#define MATCAP
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
}`,_0=`#define NORMAL
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
}`,v0=`#define NORMAL
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
}`,x0=`#define PHONG
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
}`,y0=`#define PHONG
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
}`,S0=`#define STANDARD
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
}`,M0=`#define STANDARD
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
}`,b0=`#define TOON
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
}`,E0=`#define TOON
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
}`,T0=`uniform float size;
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
}`,w0=`uniform vec3 diffuse;
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
}`,A0=`#include <common>
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
}`,R0=`uniform vec3 color;
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
}`,C0=`uniform float rotation;
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
}`,P0=`uniform vec3 diffuse;
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
}`,$e={alphahash_fragment:jp,alphahash_pars_fragment:Qp,alphamap_fragment:em,alphamap_pars_fragment:tm,alphatest_fragment:im,alphatest_pars_fragment:nm,aomap_fragment:sm,aomap_pars_fragment:rm,batching_pars_vertex:am,batching_vertex:om,begin_vertex:lm,beginnormal_vertex:cm,bsdfs:hm,iridescence_fragment:um,bumpmap_pars_fragment:dm,clipping_planes_fragment:fm,clipping_planes_pars_fragment:pm,clipping_planes_pars_vertex:mm,clipping_planes_vertex:gm,color_fragment:_m,color_pars_fragment:vm,color_pars_vertex:xm,color_vertex:ym,common:Sm,defaultnormal_vertex:Mm,displacementmap_pars_vertex:bm,displacementmap_vertex:Em,emissivemap_fragment:Tm,emissivemap_pars_fragment:wm,colorspace_fragment:Am,colorspace_pars_fragment:Rm,envmap_fragment:Cm,envmap_common_pars_fragment:Pm,envmap_pars_fragment:Im,envmap_pars_vertex:Lm,envmap_physical_pars_fragment:Gm,envmap_vertex:Nm,fog_vertex:Dm,fog_pars_vertex:Um,fog_fragment:Fm,fog_pars_fragment:Om,gradientmap_pars_fragment:Bm,lightmap_pars_fragment:km,lights_lambert_fragment:zm,lights_lambert_pars_fragment:Hm,lights_pars_begin:Vm,lights_toon_fragment:Wm,lights_toon_pars_fragment:Xm,lights_phong_fragment:qm,lights_phong_pars_fragment:Ym,lights_physical_fragment:$m,lights_physical_pars_fragment:Km,lights_fragment_begin:Zm,lights_fragment_maps:Jm,lights_fragment_end:jm,lightprobes_pars_fragment:Qm,logdepthbuf_fragment:eg,logdepthbuf_pars_fragment:tg,logdepthbuf_pars_vertex:ig,logdepthbuf_vertex:ng,map_fragment:sg,map_pars_fragment:rg,map_particle_fragment:ag,map_particle_pars_fragment:og,metalnessmap_fragment:lg,metalnessmap_pars_fragment:cg,morphinstance_vertex:hg,morphcolor_vertex:ug,morphnormal_vertex:dg,morphtarget_pars_vertex:fg,morphtarget_vertex:pg,normal_fragment_begin:mg,normal_fragment_maps:gg,normal_pars_fragment:_g,normal_pars_vertex:vg,normal_vertex:xg,normalmap_pars_fragment:yg,clearcoat_normal_fragment_begin:Sg,clearcoat_normal_fragment_maps:Mg,clearcoat_pars_fragment:bg,iridescence_pars_fragment:Eg,opaque_fragment:Tg,packing:wg,premultiplied_alpha_fragment:Ag,project_vertex:Rg,dithering_fragment:Cg,dithering_pars_fragment:Pg,roughnessmap_fragment:Ig,roughnessmap_pars_fragment:Lg,shadowmap_pars_fragment:Ng,shadowmap_pars_vertex:Dg,shadowmap_vertex:Ug,shadowmask_pars_fragment:Fg,skinbase_vertex:Og,skinning_pars_vertex:Bg,skinning_vertex:kg,skinnormal_vertex:zg,specularmap_fragment:Hg,specularmap_pars_fragment:Vg,tonemapping_fragment:Gg,tonemapping_pars_fragment:Wg,transmission_fragment:Xg,transmission_pars_fragment:qg,uv_pars_fragment:Yg,uv_pars_vertex:$g,uv_vertex:Kg,worldpos_vertex:Zg,background_vert:Jg,background_frag:jg,backgroundCube_vert:Qg,backgroundCube_frag:e0,cube_vert:t0,cube_frag:i0,depth_vert:n0,depth_frag:s0,distance_vert:r0,distance_frag:a0,equirect_vert:o0,equirect_frag:l0,linedashed_vert:c0,linedashed_frag:h0,meshbasic_vert:u0,meshbasic_frag:d0,meshlambert_vert:f0,meshlambert_frag:p0,meshmatcap_vert:m0,meshmatcap_frag:g0,meshnormal_vert:_0,meshnormal_frag:v0,meshphong_vert:x0,meshphong_frag:y0,meshphysical_vert:S0,meshphysical_frag:M0,meshtoon_vert:b0,meshtoon_frag:E0,points_vert:T0,points_frag:w0,shadow_vert:A0,shadow_frag:R0,sprite_vert:C0,sprite_frag:P0},Se={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},xi={basic:{uniforms:zt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:zt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Ze(0)},envMapIntensity:{value:1}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:zt([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:zt([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:zt([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new Ze(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:zt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:zt([Se.points,Se.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:zt([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:zt([Se.common,Se.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:zt([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:zt([Se.sprite,Se.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distance:{uniforms:zt([Se.common,Se.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distance_vert,fragmentShader:$e.distance_frag},shadow:{uniforms:zt([Se.lights,Se.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};xi.physical={uniforms:zt([xi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new He},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const fr={r:0,b:0,g:0},I0=new et,Zh=new He;Zh.set(-1,0,0,0,1,0,0,0,1);function L0(n,e,t,i,s,r){const a=new Ze(0);let o=s===!0?0:1,l,c,h=null,f=0,d=null;function u(M){let T=M.isScene===!0?M.background:null;if(T&&T.isTexture){const E=M.backgroundBlurriness>0;T=e.get(T,E)}return T}function m(M){let T=!1;const E=u(M);E===null?g(a,o):E&&E.isColor&&(g(E,1),T=!0);const R=n.xr.getEnvironmentBlendMode();R==="additive"?t.buffers.color.setClear(0,0,0,1,r):R==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(n.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function v(M,T){const E=u(T);E&&E.isCubeTexture?(c===void 0&&(c=new ri(new Is(1,1,1),new gn({name:"BackgroundCubeMaterial",uniforms:Zn(xi.backgroundCube.uniforms),vertexShader:xi.backgroundCube.vertexShader,fragmentShader:xi.backgroundCube.fragmentShader,side:Xt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(R,b,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=E,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(I0.makeRotationFromEuler(T.backgroundRotation)).transpose(),E.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Zh),c.material.toneMapped=st.getTransfer(E.colorSpace)!==ut,(h!==E||f!==E.version||d!==n.toneMapping)&&(c.material.needsUpdate=!0,h=E,f=E.version,d=n.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new ri(new Gr(2,2),new gn({name:"BackgroundMaterial",uniforms:Zn(xi.background.uniforms),vertexShader:xi.background.vertexShader,fragmentShader:xi.background.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=st.getTransfer(E.colorSpace)!==ut,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(h!==E||f!==E.version||d!==n.toneMapping)&&(l.material.needsUpdate=!0,h=E,f=E.version,d=n.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function g(M,T){M.getRGB(fr,Gh(n)),t.buffers.color.setClear(fr.r,fr.g,fr.b,T,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,T=1){a.set(M),o=T,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,g(a,o)},render:m,addToRenderList:v,dispose:p}}function N0(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(D,F,W,A,H){let G=!1;const B=f(D,A,W,F);r!==B&&(r=B,c(r.object)),G=u(D,A,W,H),G&&m(D,A,W,H),H!==null&&e.update(H,n.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,E(D,F,W,A),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return n.createVertexArray()}function c(D){return n.bindVertexArray(D)}function h(D){return n.deleteVertexArray(D)}function f(D,F,W,A){const H=A.wireframe===!0;let G=i[F.id];G===void 0&&(G={},i[F.id]=G);const B=D.isInstancedMesh===!0?D.id:0;let ne=G[B];ne===void 0&&(ne={},G[B]=ne);let q=ne[W.id];q===void 0&&(q={},ne[W.id]=q);let J=q[H];return J===void 0&&(J=d(l()),q[H]=J),J}function d(D){const F=[],W=[],A=[];for(let H=0;H<t;H++)F[H]=0,W[H]=0,A[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:W,attributeDivisors:A,object:D,attributes:{},index:null}}function u(D,F,W,A){const H=r.attributes,G=F.attributes;let B=0;const ne=W.getAttributes();for(const q in ne)if(ne[q].location>=0){const ie=H[q];let Te=G[q];if(Te===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(Te=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(Te=D.instanceColor)),ie===void 0||ie.attribute!==Te||Te&&ie.data!==Te.data)return!0;B++}return r.attributesNum!==B||r.index!==A}function m(D,F,W,A){const H={},G=F.attributes;let B=0;const ne=W.getAttributes();for(const q in ne)if(ne[q].location>=0){let ie=G[q];ie===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(ie=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(ie=D.instanceColor));const Te={};Te.attribute=ie,ie&&ie.data&&(Te.data=ie.data),H[q]=Te,B++}r.attributes=H,r.attributesNum=B,r.index=A}function v(){const D=r.newAttributes;for(let F=0,W=D.length;F<W;F++)D[F]=0}function g(D){p(D,0)}function p(D,F){const W=r.newAttributes,A=r.enabledAttributes,H=r.attributeDivisors;W[D]=1,A[D]===0&&(n.enableVertexAttribArray(D),A[D]=1),H[D]!==F&&(n.vertexAttribDivisor(D,F),H[D]=F)}function M(){const D=r.newAttributes,F=r.enabledAttributes;for(let W=0,A=F.length;W<A;W++)F[W]!==D[W]&&(n.disableVertexAttribArray(W),F[W]=0)}function T(D,F,W,A,H,G,B){B===!0?n.vertexAttribIPointer(D,F,W,H,G):n.vertexAttribPointer(D,F,W,A,H,G)}function E(D,F,W,A){v();const H=A.attributes,G=W.getAttributes(),B=F.defaultAttributeValues;for(const ne in G){const q=G[ne];if(q.location>=0){let J=H[ne];if(J===void 0&&(ne==="instanceMatrix"&&D.instanceMatrix&&(J=D.instanceMatrix),ne==="instanceColor"&&D.instanceColor&&(J=D.instanceColor)),J!==void 0){const ie=J.normalized,Te=J.itemSize,Fe=e.get(J);if(Fe===void 0)continue;const K=Fe.buffer,me=Fe.type,we=Fe.bytesPerElement,De=me===n.INT||me===n.UNSIGNED_INT||J.gpuType===Bo;if(J.isInterleavedBufferAttribute){const $=J.data,Me=$.isInterleavedBuffer===!0?$.stride:$.itemSize,C=J.offset;if($.isInstancedInterleavedBuffer||$.isInstancedBufferAttribute){for(let P=0;P<q.locationSize;P++)p(q.location+P,$.meshPerAttribute);D.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let P=0;P<q.locationSize;P++)g(q.location+P);n.bindBuffer(n.ARRAY_BUFFER,K);for(let P=0;P<q.locationSize;P++)T(q.location+P,Te/q.locationSize,me,ie,Me*we,(C+Te/q.locationSize*P)*we,De)}else{if(J.isInstancedBufferAttribute){for(let $=0;$<q.locationSize;$++)p(q.location+$,J.meshPerAttribute);D.isInstancedMesh!==!0&&A._maxInstanceCount===void 0&&(A._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let $=0;$<q.locationSize;$++)g(q.location+$);n.bindBuffer(n.ARRAY_BUFFER,K);for(let $=0;$<q.locationSize;$++)T(q.location+$,Te/q.locationSize,me,ie,Te*we,Te/q.locationSize*$*we,De)}}else if(B!==void 0){const ie=B[ne];if(ie!==void 0)switch(ie.length){case 2:n.vertexAttrib2fv(q.location,ie);break;case 3:n.vertexAttrib3fv(q.location,ie);break;case 4:n.vertexAttrib4fv(q.location,ie);break;default:n.vertexAttrib1fv(q.location,ie)}}}}M()}function R(){N();for(const D in i){const F=i[D];for(const W in F){const A=F[W];for(const H in A){const G=A[H];for(const B in G)h(G[B].object),delete G[B];delete A[H]}}delete i[D]}}function b(D){if(i[D.id]===void 0)return;const F=i[D.id];for(const W in F){const A=F[W];for(const H in A){const G=A[H];for(const B in G)h(G[B].object),delete G[B];delete A[H]}}delete i[D.id]}function _(D){for(const F in i){const W=i[F];for(const A in W){const H=W[A];if(H[D.id]===void 0)continue;const G=H[D.id];for(const B in G)h(G[B].object),delete G[B];delete H[D.id]}}}function y(D){for(const F in i){const W=i[F],A=D.isInstancedMesh===!0?D.id:0,H=W[A];if(H!==void 0){for(const G in H){const B=H[G];for(const ne in B)h(B[ne].object),delete B[ne];delete H[G]}delete W[A],Object.keys(W).length===0&&delete i[F]}}}function N(){I(),a=!0,r!==s&&(r=s,c(r.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:N,resetDefaultState:I,dispose:R,releaseStatesOfGeometry:b,releaseStatesOfObject:y,releaseStatesOfProgram:_,initAttributes:v,enableAttribute:g,disableUnusedAttributes:M}}function D0(n,e,t){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function a(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),t.update(c,i,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let d=0;for(let u=0;u<h;u++)d+=c[u];t.update(d,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function U0(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const _=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(_){return!(_!==si&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(_){const y=_===bi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(_!==Wt&&_!==ni&&!y&&i.convert(_)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ne("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),d=t.logarithmicDepthBuffer===!0&&f===!1;t.reversedDepthBuffer===!0&&f===!1&&Ne("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),t.logarithmicDepthBuffer===!0&&f===!0&&Ne("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const u=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),T=n.getParameter(n.MAX_VARYING_VECTORS),E=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),R=n.getParameter(n.MAX_SAMPLES),b=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:u,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:M,maxVaryings:T,maxFragmentUniforms:E,maxSamples:R,samples:b}}function F0(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new Ji,o=new He,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const u=f.length!==0||d||i!==0||s;return s=d,i=f.length,u},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){t=h(f,d,0)},this.setState=function(f,d,u){const m=f.clippingPlanes,v=f.clipIntersection,g=f.clipShadows,p=n.get(f);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{const M=r?0:i,T=M*4;let E=p.clippingState||null;l.value=E,E=h(m,d,T,u);for(let R=0;R!==T;++R)E[R]=t[R];p.clippingState=E,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(f,d,u,m){const v=f!==null?f.length:0;let g=null;if(v!==0){if(g=l.value,m!==!0||g===null){const p=u+v*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<p)&&(g=new Float32Array(p));for(let T=0,E=u;T!==v;++T,E+=4)a.copy(f[T]).applyMatrix4(M,o),a.normal.toArray(g,E),g[E+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}class il extends Si{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new zh(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Is(5,5,5),r=new gn({name:"CubemapFromEquirect",uniforms:Zn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Xt,blending:Vn});r.uniforms.tEquirect.value=t;const a=new ri(s,r),o=t.minFilter;return t.minFilter===Oi&&(t.minFilter=It),new Io(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}const Lc=256,O0=3,B0=20,Jh=256,jh=16,k0=3,z0=new X,H0=new Ze;class Br{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Io(1,10,null),this._boxMesh=new ri(new Is(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=z0}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),h=this._getSourceTarget(!0);t>0&&(h.texture.mipmapsAutoUpdate=!1);const f=l.autoClear,d=l.autoClearColor,u=l.autoClearDepth,m=l.autoClearStencil,v=e.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,v===null&&(e.background=l.getClearColor(H0));const g=new Io(i,s,h);return g.position.copy(o),g.update(l,e),l.autoClear=f,l.autoClearColor=d,l.autoClearDepth=u,l.autoClearStencil=m,e.background=v,t>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Uc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Dc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Lc,Ih(e))}_fromTexture(e,t){e.mapping===Xn||e.mapping===Ts?this._setSize(e.image.length===0?Lc:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);const i=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(i),i}_allocateTarget(){const e=this._cubeSize,t=Nc(e,!1,!1),i=Math.log2(e)-O0;for(let s=0;s<=i;s++)t.texture.mipmaps.push({width:e>>s,height:e>>s});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){const t=this._cubeSize,i=this._sourceTarget;return(i===null||i.width!==t||e&&i.depthBuffer===!1)&&(i!==null&&i.dispose(),this._sourceTarget=Nc(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,i){const s=this._boxMesh,r=this._cubeCamera;s.material=i,r.renderTarget=e,r.activeMipmapLevel=t;const a=e.width>>t;e.viewport.set(0,0,a,a),r.update(this._renderer,s),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===Xn||e.mapping===Ts?(this._cubemapMaterial===null&&(this._cubemapMaterial=Uc()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Dc()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){this._ggxMaterial===null&&(this._ggxMaterial=V0(),this._integrationMaterial=G0());const t=this._cubeSize,i=e.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(t/jh);for(let a=0;a<=i;a++){const o=Br.lodToRoughness(a,i);if(a>i-k0)r.roughness.value=o,this._renderCube(e,a,this._integrationMaterial);else{const l=o>0?Math.log2(t)+.5*Math.log2(6/(Jh*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(e,a,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=W0());const i=this._blurMaterial,s=i.uniforms,r=this._sourceTarget;s.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,s.envMap.value=r.texture,this._renderCube(e,0,i),s.envMap.value=e.texture,this._renderCube(r,0,i)}}function Nc(n,e,t){return new il(n,{minFilter:Oi,generateMipmaps:e,type:bi,colorSpace:As,depthBuffer:t})}function Ns(n,e,t){return new gn({name:n,uniforms:e,vertexShader:$e.cube_vert,fragmentShader:t,side:Xt,blending:Vn,depthTest:!1,depthWrite:!1})}function V0(){return Ns("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Jh}u

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
	`)}function G0(){return Ns("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:jh}},`

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
	`)}function W0(){return Ns("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${B0}
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
	`)}function Dc(){return Ns("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function Uc(){return Ns("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function X0(n){let e=new WeakMap,t=new WeakMap,i=null;function s(d,u=!1){return d==null?null:u?a(d):r(d)}function r(d){if(d&&d.isTexture){const u=d.mapping;if(u===ia||u===na)if(e.has(d)){const m=e.get(d).texture;return o(m,d.mapping)}else{const m=d.image;if(m&&m.height>0){const v=new il(m.height);return v.fromEquirectangularTexture(n,d),e.set(d,v),d.addEventListener("dispose",c),o(v.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){const u=d.mapping,m=u===ia||u===na,v=u===Xn||u===Ts;if(m||v){let g=t.get(d);const p=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return i===null&&(i=new Br(n)),g=m?i.fromEquirectangular(d,g):i.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),g.texture;if(g!==void 0)return g.texture;{const M=d.image;return m&&M&&M.height>0||v&&M&&l(M)?(i===null&&(i=new Br(n)),g=m?i.fromEquirectangular(d):i.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,t.set(d,g),d.addEventListener("dispose",h),g.texture):null}}}return d}function o(d,u){return u===ia?d.mapping=Xn:u===na&&(d.mapping=Ts),d}function l(d){let u=0;const m=6;for(let v=0;v<m;v++)d[v]!==void 0&&u++;return u===m}function c(d){const u=d.target;u.removeEventListener("dispose",c);const m=e.get(u);m!==void 0&&(e.delete(u),m.dispose())}function h(d){const u=d.target;u.removeEventListener("dispose",h);const m=t.get(u);m!==void 0&&(t.delete(u),m.dispose())}function f(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function q0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Gn("WebGLRenderer: "+i+" extension not supported."),s}}}function Y0(n,e,t,i){const s={},r=new WeakMap,a=new FinalizationRegistry(m=>delete s[m]);function o(m){l(m.target)}function l(m){m.index!==null&&e.remove(m.index);for(const g in m.attributes)e.remove(m.attributes[g]);m.removeEventListener("dispose",o),delete s[m.id],a.unregister(m);const v=r.get(m);v&&(e.remove(v),r.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function c(m,v){return s[v.id]!==void 0||(v.addEventListener("dispose",o),s[v.id]=new WeakRef(v),a.register(v,v.id,v),t.memory.geometries++),v}function h(m){const v=m.attributes;for(const g in v)e.update(v[g],n.ARRAY_BUFFER)}function f(m){const v=m.index,g=m.attributes.position;let p=0;if(g===void 0)return;const M=v!==null?v.array.length:g.array.length/3-1,T=g.count>=65535?Fh:Uh,E=new T(Math.ceil(M/3)*6,1),R=E.array;if(v!==null){const _=v.array;p=v.version;for(let y=0,N=0;y<M;y+=3){const I=_[y+0],D=_[y+1],F=_[y+2];R[N++]=I,R[N++]=D,R[N++]=D,R[N++]=F,R[N++]=F,R[N++]=I}}else{p=g.version;for(let _=0,y=0;_<M;_+=3){const N=_+0,I=_+1,D=_+2;R[y++]=N,R[y++]=I,R[y++]=I,R[y++]=D,R[y++]=D,R[y++]=N}}E.version=p;const b=r.get(m);b&&e.remove(b),r.set(m,E)}function d(m){const v=r.get(m);if(v){const g=m.index;g!==null&&v.version<g.version&&f(m)}else f(m);return r.get(m)}function u(){for(const m in s){const v=s[m].deref();v!==void 0&&l(v)}}return{get:c,update:h,getWireframeAttribute:d,dispose:u}}function $0(n,e,t){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,d){n.drawElements(i,d,r,f*a),t.update(d,i,1)}function c(f,d,u){u!==0&&(n.drawElementsInstanced(i,d,r,f*a,u),t.update(d,i,u))}function h(f,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,r,f,0,u);let v=0;for(let g=0;g<u;g++)v+=d[g];t.update(v,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function K0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:ke("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Z0(n,e,t){const i=new WeakMap,s=new ft;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let d=i.get(o);if(d===void 0||d.count!==f){let N=function(){_.dispose(),i.delete(o),o.removeEventListener("dispose",N)};d!==void 0&&d.texture.dispose();const u=o.morphAttributes.position!==void 0,m=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let T=0;u===!0&&(T=1),m===!0&&(T=2),v===!0&&(T=3);let E=o.attributes.position.count*T,R=1;E>e.maxTextureSize&&(R=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const b=new Float32Array(E*R*4*f),_=new Lh(b,E,R,f);_.type=ni,_.needsUpdate=!0;const y=T*4;for(let I=0;I<f;I++){const D=g[I],F=p[I],W=M[I],A=E*R*4*I;for(let H=0;H<D.count;H++){const G=H*y;u===!0&&(s.fromBufferAttribute(D,H),b[A+G+0]=s.x,b[A+G+1]=s.y,b[A+G+2]=s.z,b[A+G+3]=0),m===!0&&(s.fromBufferAttribute(F,H),b[A+G+4]=s.x,b[A+G+5]=s.y,b[A+G+6]=s.z,b[A+G+7]=0),v===!0&&(s.fromBufferAttribute(W,H),b[A+G+8]=s.x,b[A+G+9]=s.y,b[A+G+10]=s.z,b[A+G+11]=W.itemSize===4?s.w:1)}}d={count:f,texture:_,size:new rt(E,R)},i.set(o,d),o.addEventListener("dispose",N)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let u=0;for(let v=0;v<c.length;v++)u+=c[v];const m=o.morphTargetsRelative?1:1-u;l.getUniforms().setValue(n,"morphTargetBaseInfluence",m),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function J0(n,e,t,i,s){let r=new WeakMap;function a(c){const h=s.render.frame,f=c.geometry,d=e.get(c,f);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const u=c.skeleton;r.get(u)!==h&&(u.update(),r.set(u,h))}return d}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const j0={[dh]:"LINEAR_TONE_MAPPING",[fh]:"REINHARD_TONE_MAPPING",[ph]:"CINEON_TONE_MAPPING",[mh]:"ACES_FILMIC_TONE_MAPPING",[_h]:"AGX_TONE_MAPPING",[vh]:"NEUTRAL_TONE_MAPPING",[gh]:"CUSTOM_TONE_MAPPING"};function Q0(n,e,t,i,s,r){const a=new Si(e,t,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const h=new Ti;h.setAttribute("position",new Zt([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Zt([0,2,0,0,2,0],2));const f=new Po({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),d=new ri(h,f),u=new Qo(-1,1,1,-1,0,1);let m=null,v=null,g=!1,p,M=null,T=[],E=!1;this.setSize=function(R,b){a.setSize(R,b),o!==null&&o.setSize(R,b),l!==null&&l.setSize(R,b);for(let _=0;_<T.length;_++){const y=T[_];y.setSize&&y.setSize(R,b)}},this.setEffects=function(R){T=R,E=T.length>0&&T[0].isRenderPass===!0;const b=a.width,_=a.height;T.length>0&&o===null&&(o=new Si(b,_,{type:bi,depthBuffer:!1,stencilBuffer:!1}),l=new Si(b,_,{type:bi,depthBuffer:!1,stencilBuffer:!1}));const y=s===!0&&T.some(N=>N.needsDepthTexture===!0);y!==(a.depthTexture!==null)&&(y===!0&&c===null&&(c=new Kn(b,_),r===!0&&(c.format=Qi,c.type=qn)),a.dispose(),a.depthTexture=y?c:null,a.resolveDepthBuffer=y,a.storeMultisampledDepthBuffer=y);for(let N=0;N<T.length;N++){const I=T[N];I.setSize&&I.setSize(b,_),y&&I.needsDepthTexture===!0&&I.setDepthTexture&&I.setDepthTexture(c)}},this.begin=function(R,b){if(g||R.toneMapping===ki&&T.length===0)return!1;if(M=b,b!==null){const _=b.width,y=b.height;(a.width!==_||a.height!==y)&&this.setSize(_,y)}return E===!1&&R.setRenderTarget(a),p=R.toneMapping,R.toneMapping=ki,!0},this.hasRenderPass=function(){return E},this.end=function(R,b){R.toneMapping=p,g=!0;let _=a,y=o;for(let N=0;N<T.length;N++){const I=T[N];I.enabled!==!1&&(I.render(R,y,_,b),I.needsSwap!==!1&&(_=y,y=y===o?l:o))}if(m!==R.outputColorSpace||v!==R.toneMapping){m=R.outputColorSpace,v=R.toneMapping,f.defines={},st.getTransfer(m)===ut&&(f.defines.SRGB_TRANSFER="");const N=j0[v];N&&(f.defines[N]=""),f.needsUpdate=!0}f.uniforms.tDiffuse.value=_.texture,R.setRenderTarget(M),R.render(d,u),M=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),f.dispose()}}const Qh=new Nt,eu=new Kn(1,1),tu=new Hh(1),iu=new Lh,nu=new kf,su=new zh,Fc=[],Oc=[],Bc=new Float32Array(16),kc=new Float32Array(9),zc=new Float32Array(4);function es(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Fc[s];if(r===void 0&&(r=new Float32Array(s),Fc[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function wt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function At(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Xr(n,e){let t=Oc[e];t===void 0&&(t=new Int32Array(e),Oc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function e_(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function t_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2fv(this.addr,e),At(t,e)}}function i_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(wt(t,e))return;n.uniform3fv(this.addr,e),At(t,e)}}function n_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4fv(this.addr,e),At(t,e)}}function s_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(wt(t,i))return;zc.set(i),n.uniformMatrix2fv(this.addr,!1,zc),At(t,i)}}function r_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(wt(t,i))return;kc.set(i),n.uniformMatrix3fv(this.addr,!1,kc),At(t,i)}}function a_(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(wt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(wt(t,i))return;Bc.set(i),n.uniformMatrix4fv(this.addr,!1,Bc),At(t,i)}}function o_(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function l_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2iv(this.addr,e),At(t,e)}}function c_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;n.uniform3iv(this.addr,e),At(t,e)}}function h_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4iv(this.addr,e),At(t,e)}}function u_(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function d_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;n.uniform2uiv(this.addr,e),At(t,e)}}function f_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;n.uniform3uiv(this.addr,e),At(t,e)}}function p_(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;n.uniform4uiv(this.addr,e),At(t,e)}}function qr(n){return n.version===0&&(n.compareFunction=Rh,n.needsUpdate=!0),n}function m_(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?r=qr(eu):r=Qh,t.setTexture2D(e||r,s)}function g_(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||nu,s)}function __(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_CUBE_SHADOW?r=qr(tu):r=su,t.setTextureCube(e||r,s)}function v_(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||iu,s)}function x_(n){switch(n){case 5126:return e_;case 35664:return t_;case 35665:return i_;case 35666:return n_;case 35674:return s_;case 35675:return r_;case 35676:return a_;case 5124:case 35670:return o_;case 35667:case 35671:return l_;case 35668:case 35672:return c_;case 35669:case 35673:return h_;case 5125:return u_;case 36294:return d_;case 36295:return f_;case 36296:return p_;case 35678:case 36198:case 36298:case 36306:case 35682:return m_;case 35679:case 36299:case 36307:return g_;case 35680:case 36300:case 36308:case 36293:return __;case 36289:case 36303:case 36311:case 36292:return v_}}function y_(n,e){n.uniform1fv(this.addr,e)}function S_(n,e){const t=es(e,this.size,2);n.uniform2fv(this.addr,t)}function M_(n,e){const t=es(e,this.size,3);n.uniform3fv(this.addr,t)}function b_(n,e){const t=es(e,this.size,4);n.uniform4fv(this.addr,t)}function E_(n,e){const t=es(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function T_(n,e){const t=es(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function w_(n,e){const t=es(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function A_(n,e){n.uniform1iv(this.addr,e)}function R_(n,e){n.uniform2iv(this.addr,e)}function C_(n,e){n.uniform3iv(this.addr,e)}function P_(n,e){n.uniform4iv(this.addr,e)}function I_(n,e){n.uniform1uiv(this.addr,e)}function L_(n,e){n.uniform2uiv(this.addr,e)}function N_(n,e){n.uniform3uiv(this.addr,e)}function D_(n,e){n.uniform4uiv(this.addr,e)}function U_(n,e,t){const i=this.cache,s=e.length,r=Xr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),At(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=qr(eu):a=Qh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function F_(n,e,t){const i=this.cache,s=e.length,r=Xr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||nu,r[a])}function O_(n,e,t){const i=this.cache,s=e.length,r=Xr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),At(i,r));let a;this.type===n.SAMPLER_CUBE_SHADOW?a=qr(tu):a=su;for(let o=0;o!==s;++o)t.setTextureCube(e[o]||a,r[o])}function B_(n,e,t){const i=this.cache,s=e.length,r=Xr(t,s);wt(i,r)||(n.uniform1iv(this.addr,r),At(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||iu,r[a])}function k_(n){switch(n){case 5126:return y_;case 35664:return S_;case 35665:return M_;case 35666:return b_;case 35674:return E_;case 35675:return T_;case 35676:return w_;case 5124:case 35670:return A_;case 35667:case 35671:return R_;case 35668:case 35672:return C_;case 35669:case 35673:return P_;case 5125:return I_;case 36294:return L_;case 36295:return N_;case 36296:return D_;case 35678:case 36198:case 36298:case 36306:case 35682:return U_;case 35679:case 36299:case 36307:return F_;case 35680:case 36300:case 36308:case 36293:return O_;case 36289:case 36303:case 36311:case 36292:return B_}}class z_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=x_(t.type)}}class H_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=k_(t.type)}}class V_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const La=/(\w+)(\])?(\[|\.)?/g;function Hc(n,e){n.seq.push(e),n.map[e.id]=e}function G_(n,e,t){const i=n.name,s=i.length;for(La.lastIndex=0;;){const r=La.exec(i),a=La.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Hc(t,c===void 0?new z_(o,n,e):new H_(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new V_(o),Hc(t,f)),t=f}}}class Mr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);G_(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function Vc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const W_=37297;let X_=0;function q_(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Gc=new He;function Y_(n){st._getMatrix(Gc,st.workingColorSpace,n);const e=`mat3( ${Gc.elements.map(t=>t.toFixed(4))} )`;switch(st.getTransfer(n)){case Nr:return[e,"LinearTransferOETF"];case ut:return[e,"sRGBTransferOETF"];default:return Ne("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Wc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+q_(n.getShaderSource(e),o)}else return r}function $_(n,e){const t=Y_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( ${t[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const K_={[dh]:"Linear",[fh]:"Reinhard",[ph]:"Cineon",[mh]:"ACESFilmic",[_h]:"AgX",[vh]:"Neutral",[gh]:"Custom"};function Z_(n,e){const t=K_[e];return t===void 0?(Ne("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const pr=new X;function J_(){st.getLuminanceCoefficients(pr);const n=pr.x.toFixed(4),e=pr.y.toFixed(4),t=pr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function j_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vs).join(`
`)}function Q_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function ev(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function vs(n){return n!==""}function Xc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,e.numLightProbeGrids)}function qc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const tv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Lo(n){return n.replace(tv,iv)}function iv(n,e){const t=$e[e];if(t===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">");return Lo(t)}const nv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yc(n){return n.replace(nv,sv)}function sv(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function $c(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const rv={[_r]:"SHADOWMAP_TYPE_PCF",[gs]:"SHADOWMAP_TYPE_VSM"};function av(n){return rv[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const ov={[Ts]:"ENVMAP_MODE_REFRACTION"};function lv(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":ov[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const cv={[uh]:"ENVMAP_BLENDING_MULTIPLY",[Jd]:"ENVMAP_BLENDING_MIX",[jd]:"ENVMAP_BLENDING_ADD"};function hv(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":cv[n.combine]||"ENVMAP_BLENDING_NONE"}function uv(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=av(t),c=t.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=lv(t),f=hv(t),d=j_(t),u=Q_(r),m=s.createProgram();let v,g,p=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u].filter(vs).join(`
`),v.length>0&&(v+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u].filter(vs).join(`
`),g.length>0&&(g+=`
`)):(v=[$c(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+t.diffuseRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vs).join(`
`),g=[$c(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,u,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",t.envMapPMREM?"#define ENVMAP_MAX_LOD "+t.envMapMaxLod+".0":"",t.envMapPMREM?"#define ENVMAP_SIZE "+t.envMapSize+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",t.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ki?"#define TONE_MAPPING":"",t.toneMapping!==ki?$e.tonemapping_pars_fragment:"",t.toneMapping!==ki?Z_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,$_("linearToOutputTexel",t.outputColorSpace),J_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vs).join(`
`)),a=Lo(a),a=Xc(a,t),a=qc(a,t),o=Lo(o),o=Xc(o,t),o=qc(o,t),a=Yc(a),o=Yc(o),t.isRawShaderMaterial!==!0&&(p=`#version 300 es
`,v=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,g=["#define varying in",t.glslVersion===Dr?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Dr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const M=p+v+a,T=p+g+o,E=Vc(s,s.VERTEX_SHADER,M),R=Vc(s,s.FRAGMENT_SHADER,T);s.attachShader(m,E),s.attachShader(m,R),t.index0AttributeName!==void 0?s.bindAttribLocation(m,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function b(I){if(n.debug.checkShaderErrors){const D=s.getProgramInfoLog(m)||"",F=s.getShaderInfoLog(E)||"",W=s.getShaderInfoLog(R)||"",A=D.trim(),H=F.trim(),G=W.trim();let B=!0,ne=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(B=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,m,E,R);else{const q=Wc(s,E,"vertex"),J=Wc(s,R,"fragment");ke("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+A+`
`+q+`
`+J)}else A!==""?Ne("WebGLProgram: Program Info Log:",A):(H===""||G==="")&&(ne=!1);ne&&(I.diagnostics={runnable:B,programLog:A,vertexShader:{log:H,prefix:v},fragmentShader:{log:G,prefix:g}})}s.deleteShader(E),s.deleteShader(R),_=new Mr(s,m),y=ev(s,m)}let _;this.getUniforms=function(){return _===void 0&&b(this),_};let y;this.getAttributes=function(){return y===void 0&&b(this),y};let N=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=s.getProgramParameter(m,W_)),N},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=X_++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=E,this.fragmentShader=R,this}let dv=0;class fv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new pv(e),t.set(e,i)),i}}class pv{constructor(e){this.id=dv++,this.code=e,this.usedTimes=0}}function mv(n){return n===mn||n===Cr||n===Pr}function gv(n,e,t,i,s,r){const a=new Nh,o=new fv,l=new Set,c=[],h=new Map,f=i.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function u(_){return l.add(_),_===0?"uv":`uv${_}`}function m(_,y,N,I,D,F){const W=I.fog,A=D.geometry,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?I.environment:null,G=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,B=e.get(_.envMap||H,G),ne=d[_.type];let q=i.precision;_.precision!==null&&(q=i.getMaxPrecision(_.precision),q!==_.precision&&Ne("WebGLProgram.getParameters:",_.precision,"not supported, using",q,"instead."));const J=A.morphAttributes.position||A.morphAttributes.normal||A.morphAttributes.color,ie=J!==void 0?J.length:0;let Te=0;A.morphAttributes.position!==void 0&&(Te=1),A.morphAttributes.normal!==void 0&&(Te=2),A.morphAttributes.color!==void 0&&(Te=3);let Fe,K,me,we;if(ne){const ye=xi[ne];Fe=ye.vertexShader,K=ye.fragmentShader}else{Fe=_.vertexShader,K=_.fragmentShader;const ye=o.getVertexShaderStage(_),ht=o.getFragmentShaderStage(_);o.update(_,ye,ht),me=ye.id,we=ht.id}const De=n.getRenderTarget(),$=n.state.buffers.depth.getReversed(),Me=D.isInstancedMesh===!0,C=D.isBatchedMesh===!0,P=!!_.map,se=!!_.matcap,ue=!!B,re=ue&&B.isPMREMTexture===!0,be=!!_.aoMap,Ae=!!_.lightMap,Re=!!_.bumpMap&&_.wireframe===!1,je=!!_.normalMap,We=!!_.displacementMap,Ge=!!_.emissiveMap,ct=!!_.metalnessMap,_t=!!_.roughnessMap,Vt=_.anisotropy>0,O=_.clearcoat>0,Jt=_.diffuseRoughness>0,vt=_.dispersion>0,xt=_.retroreflectivity>0,ve=_.iridescence>0,Et=_.sheen>0,Be=_.transmission>0,ze=Vt&&!!_.anisotropyMap,w=O&&!!_.clearcoatMap,x=O&&!!_.clearcoatNormalMap,z=O&&!!_.clearcoatRoughnessMap,ae=Jt&&!!_.diffuseRoughnessMap,te=ve&&!!_.iridescenceMap,ce=ve&&!!_.iridescenceThicknessMap,ge=Et&&!!_.sheenColorMap,j=Et&&!!_.sheenRoughnessMap,Q=!!_.specularMap,de=!!_.specularColorMap,L=!!_.specularIntensityMap,ee=Be&&!!_.transmissionMap,Z=Be&&!!_.thicknessMap,fe=!!_.gradientMap,le=!!_.alphaMap,he=_.alphaTest>0,Ue=!!_.alphaHash,Ye=!!_.extensions;let oe=ki;_.toneMapped&&(De===null||De.isXRRenderTarget===!0)&&(oe=n.toneMapping);const Oe=re?B.isCompressedCubeTexture?B.image[0].mipmaps:B.mipmaps:null,qe={shaderID:ne,shaderType:_.type,shaderName:_.name,vertexShader:Fe,fragmentShader:K,defines:_.defines,customVertexShaderID:me,customFragmentShaderID:we,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:q,batching:C,batchingColor:C&&D._colorsTexture!==null,instancing:Me,instancingColor:Me&&D.instanceColor!==null,instancingMorph:Me&&D.morphTexture!==null,outputColorSpace:De===null?n.outputColorSpace:De.isXRRenderTarget===!0?De.texture.colorSpace:st.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:P,matcap:se,envMap:ue,envMapMode:ue&&B.mapping,envMapPMREM:re,envMapMaxLod:re?Oe.length-1:null,envMapSize:re?Oe[0].width:null,aoMap:be,lightMap:Ae,bumpMap:Re,normalMap:je,displacementMap:We,emissiveMap:Ge,normalMapObjectSpace:je&&_.normalMapType===of,normalMapTangentSpace:je&&_.normalMapType===Ro,packedNormalMap:je&&_.normalMapType===Ro&&mv(_.normalMap.format),metalnessMap:ct,roughnessMap:_t,anisotropy:Vt,anisotropyMap:ze,clearcoat:O,clearcoatMap:w,clearcoatNormalMap:x,clearcoatRoughnessMap:z,diffuseRoughness:Jt,diffuseRoughnessMap:ae,dispersion:vt,retroreflection:xt,iridescence:ve,iridescenceMap:te,iridescenceThicknessMap:ce,sheen:Et,sheenColorMap:ge,sheenRoughnessMap:j,specularMap:Q,specularColorMap:de,specularIntensityMap:L,transmission:Be,transmissionMap:ee,thicknessMap:Z,gradientMap:fe,opaque:_.transparent===!1&&_.blending===Ss&&_.alphaToCoverage===!1,alphaMap:le,alphaTest:he,alphaHash:Ue,combine:_.combine,mapUv:P&&u(_.map.channel),aoMapUv:be&&u(_.aoMap.channel),lightMapUv:Ae&&u(_.lightMap.channel),bumpMapUv:Re&&u(_.bumpMap.channel),normalMapUv:je&&u(_.normalMap.channel),displacementMapUv:We&&u(_.displacementMap.channel),emissiveMapUv:Ge&&u(_.emissiveMap.channel),metalnessMapUv:ct&&u(_.metalnessMap.channel),roughnessMapUv:_t&&u(_.roughnessMap.channel),anisotropyMapUv:ze&&u(_.anisotropyMap.channel),clearcoatMapUv:w&&u(_.clearcoatMap.channel),clearcoatNormalMapUv:x&&u(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:z&&u(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ae&&u(_.diffuseRoughnessMap.channel),iridescenceMapUv:te&&u(_.iridescenceMap.channel),iridescenceThicknessMapUv:ce&&u(_.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&u(_.sheenColorMap.channel),sheenRoughnessMapUv:j&&u(_.sheenRoughnessMap.channel),specularMapUv:Q&&u(_.specularMap.channel),specularColorMapUv:de&&u(_.specularColorMap.channel),specularIntensityMapUv:L&&u(_.specularIntensityMap.channel),transmissionMapUv:ee&&u(_.transmissionMap.channel),thicknessMapUv:Z&&u(_.thicknessMap.channel),alphaMapUv:le&&u(_.alphaMap.channel),vertexTangents:!!A.attributes.tangent&&(je||Vt),vertexNormals:!!A.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!A.attributes.color&&A.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!A.attributes.uv&&(P||le),fog:!!W,useFog:_.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||A.attributes.normal===void 0&&je===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:$,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:A.attributes.position!==void 0,morphTargets:A.morphAttributes.position!==void 0,morphNormals:A.morphAttributes.normal!==void 0,morphColors:A.morphAttributes.color!==void 0,morphTargetsCount:ie,morphTextureStride:Te,numSunLights:y.sun.length,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numSunLightShadows:y.sunShadowMap.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:F.filter(ye=>ye.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&N.length>0,shadowMapType:n.shadowMap.type,toneMapping:oe,decodeVideoTexture:P&&_.map.isVideoTexture===!0&&st.getTransfer(_.map.colorSpace)===ut,decodeVideoTextureEmissive:Ge&&_.emissiveMap.isVideoTexture===!0&&st.getTransfer(_.emissiveMap.colorSpace)===ut,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===fi,flipSided:_.side===Xt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:Ye&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ye&&_.extensions.multiDraw===!0||C)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return qe.vertexUv1s=l.has(1),qe.vertexUv2s=l.has(2),qe.vertexUv3s=l.has(3),l.clear(),qe}function v(_){const y=[];if(_.shaderID?y.push(_.shaderID):(y.push(_.customVertexShaderID),y.push(_.customFragmentShaderID)),_.defines!==void 0)for(const N in _.defines)y.push(N),y.push(_.defines[N]);return _.isRawShaderMaterial===!1&&(g(y,_),p(y,_),y.push(n.outputColorSpace)),y.push(_.customProgramCacheKey),y.join()}function g(_,y){_.push(y.precision),_.push(y.outputColorSpace),_.push(y.envMapMode),_.push(y.envMapPMREM),_.push(y.envMapMaxLod),_.push(y.envMapSize),_.push(y.mapUv),_.push(y.alphaMapUv),_.push(y.lightMapUv),_.push(y.aoMapUv),_.push(y.bumpMapUv),_.push(y.normalMapUv),_.push(y.displacementMapUv),_.push(y.emissiveMapUv),_.push(y.metalnessMapUv),_.push(y.roughnessMapUv),_.push(y.anisotropyMapUv),_.push(y.clearcoatMapUv),_.push(y.clearcoatNormalMapUv),_.push(y.clearcoatRoughnessMapUv),_.push(y.diffuseRoughnessMapUv),_.push(y.iridescenceMapUv),_.push(y.iridescenceThicknessMapUv),_.push(y.sheenColorMapUv),_.push(y.sheenRoughnessMapUv),_.push(y.specularMapUv),_.push(y.specularColorMapUv),_.push(y.specularIntensityMapUv),_.push(y.transmissionMapUv),_.push(y.thicknessMapUv),_.push(y.combine),_.push(y.fogExp2),_.push(y.sizeAttenuation),_.push(y.morphTargetsCount),_.push(y.numSunLights),_.push(y.numDirLights),_.push(y.numPointLights),_.push(y.numSpotLights),_.push(y.numSpotLightMaps),_.push(y.numHemiLights),_.push(y.numRectAreaLights),_.push(y.numSunLightShadows),_.push(y.numDirLightShadows),_.push(y.numPointLightShadows),_.push(y.numSpotLightShadows),_.push(y.numSpotLightShadowsWithMaps),_.push(y.numLightProbes),_.push(y.numLightProbeGrids),_.push(y.shadowMapType),_.push(y.toneMapping),_.push(y.numClippingPlanes),_.push(y.numClipIntersection),_.push(y.depthPacking)}function p(_,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.retroreflection&&a.enable(24),y.diffuseRoughness&&a.enable(25),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function M(_){const y=d[_.type];let N;if(y){const I=xi[y];N=fp.clone(I.uniforms)}else N=_.uniforms;return N}function T(_,y){let N=h.get(y);return N!==void 0?++N.usedTimes:(N=new uv(n,y,_,s),c.push(N),h.set(y,N)),N}function E(_){if(--_.usedTimes===0){const y=c.indexOf(_);c[y]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function R(_){o.remove(_)}function b(){o.dispose()}return{getParameters:m,getProgramCacheKey:v,getUniforms:M,acquireProgram:T,releaseProgram:E,releaseShaderCache:R,programs:c,dispose:b}}function _v(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function vv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Kc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Zc(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(d){let u=0;return d.isInstancedMesh&&(u+=2),d.isSkinnedMesh&&(u+=1),u}function o(d,u,m,v,g,p){let M=n[e];return M===void 0?(M={id:d.id,object:d,geometry:u,material:m,materialVariant:a(d),groupOrder:v,renderOrder:d.renderOrder,z:g,group:p},n[e]=M):(M.id=d.id,M.object=d,M.geometry=u,M.material=m,M.materialVariant=a(d),M.groupOrder=v,M.renderOrder=d.renderOrder,M.z=g,M.group=p),e++,M}function l(d,u,m,v,g,p,M){M.reversedDepth===!0&&(g=-g);const T=o(d,u,m,v,g,p);m.transmission>0?i.push(T):m.transparent===!0?s.push(T):t.push(T)}function c(d,u,m,v,g,p){const M=o(d,u,m,v,g,p);m.transmission>0?i.unshift(M):m.transparent===!0?s.unshift(M):t.unshift(M)}function h(d,u){t.length>1&&t.sort(d||vv),i.length>1&&i.sort(u||Kc),s.length>1&&s.sort(u||Kc)}function f(){for(let d=e,u=n.length;d<u;d++){const m=n[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function xv(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new Zc,n.set(i,[a])):s>=r.length?(a=new Zc,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function yv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new X,color:new Ze};break;case"SpotLight":t={position:new X,direction:new X,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new X,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new X,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new X,halfWidth:new X,halfHeight:new X};break}return n[e.id]=t,t}}}function Sv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Mv=0;function bv(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Ev(n){const e=new yv,t=Sv(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new X);const s=new X,r=new et,a=new et;function o(c){let h=0,f=0,d=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let u=0,m=0,v=0,g=0,p=0,M=0,T=0,E=0,R=0,b=0,_=0,y=0,N=0,I=0;c.sort(bv);for(let F=0,W=c.length;F<W;F++){const A=c[F],H=A.color,G=A.intensity,B=A.distance;let ne=null;if(A.shadow&&A.shadow.map&&(A.shadow.map.texture.format===mn?ne=A.shadow.map.texture:ne=A.shadow.map.depthTexture||A.shadow.map.texture),A.isAmbientLight)h+=H.r*G,f+=H.g*G,d+=H.b*G;else if(A.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(A.sh.coefficients[q],G);I++}else if(A.isSunLight){const q=e.get(A);if(q.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const J=A.shadow,ie=t.get(A);ie.shadowIntensity=J.intensity,ie.shadowBias=J.bias,ie.shadowNormalBias=J.normalBias,ie.shadowRadius=J.radius,ie.shadowMapSize.copy(J.mapSize).multiply(J.getFrameExtents()),i.sunShadow[m]=ie,i.sunShadowMap[m]=ne;const Te=J.getViewportCount();for(let Fe=0;Fe<Te;Fe++)i.sunShadowMatrix[v+Fe]=J.getMatrix(Fe),i.sunShadowCascade[v+Fe]=J._cascadeData[Fe];v+=Te,m++}i.sun[u]=q,u++}else if(A.isDirectionalLight){const q=e.get(A);if(q.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const J=A.shadow,ie=t.get(A);ie.shadowIntensity=J.intensity,ie.shadowBias=J.bias,ie.shadowNormalBias=J.normalBias,ie.shadowRadius=J.radius,ie.shadowMapSize=J.mapSize,i.directionalShadow[g]=ie,i.directionalShadowMap[g]=ne,i.directionalShadowMatrix[g]=A.shadow.matrix,R++}i.directional[g]=q,g++}else if(A.isSpotLight){const q=e.get(A);q.position.setFromMatrixPosition(A.matrixWorld),q.color.copy(H).multiplyScalar(G),q.distance=B,q.coneCos=Math.cos(A.angle),q.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),q.decay=A.decay,i.spot[M]=q;const J=A.shadow;if(A.map&&(i.spotLightMap[y]=A.map,y++,J.updateMatrices(A),A.castShadow&&N++),i.spotLightMatrix[M]=J.matrix,A.castShadow){const ie=t.get(A);ie.shadowIntensity=J.intensity,ie.shadowBias=J.bias,ie.shadowNormalBias=J.normalBias,ie.shadowRadius=J.radius,ie.shadowMapSize=J.mapSize,i.spotShadow[M]=ie,i.spotShadowMap[M]=ne,_++}M++}else if(A.isRectAreaLight){const q=e.get(A);q.color.copy(H).multiplyScalar(G),q.halfWidth.set(A.width*.5,0,0),q.halfHeight.set(0,A.height*.5,0),i.rectArea[T]=q,T++}else if(A.isPointLight){const q=e.get(A);if(q.color.copy(A.color).multiplyScalar(A.intensity),q.distance=A.distance,q.decay=A.decay,A.castShadow){const J=A.shadow,ie=t.get(A);ie.shadowIntensity=J.intensity,ie.shadowBias=J.bias,ie.shadowNormalBias=J.normalBias,ie.shadowRadius=J.radius,ie.shadowMapSize=J.mapSize,ie.shadowCameraNear=J.camera.near,ie.shadowCameraFar=J.camera.far,i.pointShadow[p]=ie,i.pointShadowMap[p]=ne,i.pointShadowMatrix[p]=A.shadow.matrix,b++}i.point[p]=q,p++}else if(A.isHemisphereLight){const q=e.get(A);q.skyColor.copy(A.color).multiplyScalar(G),q.groundColor.copy(A.groundColor).multiplyScalar(G),i.hemi[E]=q,E++}}T>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Se.LTC_FLOAT_1,i.rectAreaLTC2=Se.LTC_FLOAT_2):(i.rectAreaLTC1=Se.LTC_HALF_1,i.rectAreaLTC2=Se.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=d;const D=i.hash;(D.sunLength!==u||D.directionalLength!==g||D.pointLength!==p||D.spotLength!==M||D.rectAreaLength!==T||D.hemiLength!==E||D.numSunShadows!==m||D.numDirectionalShadows!==R||D.numPointShadows!==b||D.numSpotShadows!==_||D.numSpotMaps!==y||D.numLightProbes!==I)&&(i.sun.length=u,i.directional.length=g,i.spot.length=M,i.rectArea.length=T,i.point.length=p,i.hemi.length=E,i.sunShadow.length=m,i.sunShadowMap.length=m,i.sunShadowMatrix.length=v,i.sunShadowCascade.length=v,i.directionalShadow.length=R,i.directionalShadowMap.length=R,i.directionalShadowMatrix.length=R,i.pointShadow.length=b,i.pointShadowMap.length=b,i.pointShadowMatrix.length=b,i.spotShadow.length=_,i.spotShadowMap.length=_,i.spotLightMatrix.length=_+y-N,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=N,i.numLightProbes=I,D.sunLength=u,D.directionalLength=g,D.pointLength=p,D.spotLength=M,D.rectAreaLength=T,D.hemiLength=E,D.numSunShadows=m,D.numDirectionalShadows=R,D.numPointShadows=b,D.numSpotShadows=_,D.numSpotMaps=y,D.numLightProbes=I,i.version=Mv++)}function l(c,h){let f=0,d=0,u=0,m=0,v=0,g=0;const p=h.matrixWorldInverse;for(let M=0,T=c.length;M<T;M++){const E=c[M];if(E.isSunLight){const R=i.sun[f];R.direction.setFromMatrixPosition(E.matrixWorld),R.direction.transformDirection(p),f++}else if(E.isDirectionalLight){const R=i.directional[d];R.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(p),d++}else if(E.isSpotLight){const R=i.spot[m];R.position.setFromMatrixPosition(E.matrixWorld),R.position.applyMatrix4(p),R.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),R.direction.sub(s),R.direction.transformDirection(p),m++}else if(E.isRectAreaLight){const R=i.rectArea[v];R.position.setFromMatrixPosition(E.matrixWorld),R.position.applyMatrix4(p),a.identity(),r.copy(E.matrixWorld),r.premultiply(p),a.extractRotation(r),R.halfWidth.set(E.width*.5,0,0),R.halfHeight.set(0,E.height*.5,0),R.halfWidth.applyMatrix4(a),R.halfHeight.applyMatrix4(a),v++}else if(E.isPointLight){const R=i.point[u];R.position.setFromMatrixPosition(E.matrixWorld),R.position.applyMatrix4(p),u++}else if(E.isHemisphereLight){const R=i.hemi[g];R.direction.setFromMatrixPosition(E.matrixWorld),R.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:i}}function Jc(n){const e=new Ev(n),t=[],i=[],s=[];function r(f){h.camera=f,t.length=0,i.length=0,s.length=0}function a(f){f.isLightProbeGrid?s.push(f):t.push(f)}function o(f){i.push(f)}function l(){e.setup(t),s.sort((f,d)=>f.priority-d.priority||f.id-d.id)}function c(f){e.setupView(t,f)}const h={lightsArray:t,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function Tv(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Jc(n),e.set(s,[o])):r>=a.length?(o=new Jc(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const wv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Av=`uniform sampler2D shadow_pass;
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
}`,Rv=[new X(1,0,0),new X(-1,0,0),new X(0,1,0),new X(0,-1,0),new X(0,0,1),new X(0,0,-1)],Cv=[new X(0,-1,0),new X(0,-1,0),new X(0,0,1),new X(0,0,-1),new X(0,-1,0),new X(0,-1,0)],jc=new et,ps=new X,Na=new X;function Pv(n,e,t){let i=new Ps;const s=new rt,r=new rt,a=new ft,o=new _p,l=new vp,c={},h=t.maxTextureSize,f={[pn]:Xt,[Xt]:pn,[fi]:fi},d=new gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new rt},radius:{value:4}},vertexShader:wv,fragmentShader:Av}),u=d.clone();u.defines.HORIZONTAL_PASS=1;const m=new Ti;m.setAttribute("position",new Hi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ri(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_r;let p=this.type;this.render=function(b,_,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;this.type===Ud&&(Ne("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=_r);const N=n.getRenderTarget(),I=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Vn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const W=p!==this.type;W&&_.traverse(function(A){A.material&&(Array.isArray(A.material)?A.material.forEach(H=>H.needsUpdate=!0):A.material.needsUpdate=!0)});for(let A=0,H=b.length;A<H;A++){const G=b[A],B=G.shadow;if(B===void 0){Ne("WebGLShadowMap:",G,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const ne=B.getFrameExtents();s.multiply(ne),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ne.x),s.x=r.x*ne.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ne.y),s.y=r.y*ne.y,B.mapSize.y=r.y));const q=n.state.buffers.depth.getReversed();if(B.camera._reversedDepth=q,B.map===null||W===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===gs){if(G.isPointLight){Ne("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Si(s.x,s.y,{format:mn,type:bi,minFilter:It,magFilter:It,generateMipmaps:!1}),B.map.texture.name=G.name+".shadowMap",B.map.depthTexture=new Kn(s.x,s.y,ni),B.map.depthTexture.name=G.name+".shadowMapDepth",B.map.depthTexture.format=en,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Tt,B.map.depthTexture.magFilter=Tt}else G.isPointLight?(B.map=new il(s.x),B.map.depthTexture=new Hh(s.x,Mi)):(B.map=new Si(s.x,s.y),B.map.depthTexture=new Kn(s.x,s.y,Mi)),B.map.depthTexture.name=G.name+".shadowMap",B.map.depthTexture.format=en,this.type===_r?(B.map.depthTexture.compareFunction=q?Ah:wh,B.map.depthTexture.minFilter=It,B.map.depthTexture.magFilter=It):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Tt,B.map.depthTexture.magFilter=Tt);B.camera.updateProjectionMatrix()}B.map.isWebGLCubeRenderTarget!==!0&&(B.map.width!==s.x||B.map.height!==s.y)&&B.map.setSize(s.x,s.y);const J=B.map.isWebGLCubeRenderTarget?6:B.getViewportCount();G.isPointLight!==!0&&B.updateMatrices(G,y);const ie=(B.camera.layers.mask&4294967294)!==0?B.camera.layers:y.layers;for(let Te=0;Te<J;Te++){const Fe=B.getCamera(Te);if(G.isPointLight){const K=B.camera,me=B.matrix,we=G.distance||K.far;we!==K.far&&(K.far=we,K.updateProjectionMatrix()),ps.setFromMatrixPosition(G.matrixWorld),K.position.copy(ps),Na.copy(K.position),Na.add(Rv[Te]),K.up.copy(Cv[Te]),K.lookAt(Na),K.updateMatrixWorld(),me.makeTranslation(-ps.x,-ps.y,-ps.z),jc.multiplyMatrices(K.projectionMatrix,K.matrixWorldInverse),B._frustum.setFromProjectionMatrix(jc,K.coordinateSystem,K.reversedDepth)}if(B.map.isWebGLCubeRenderTarget)n.setRenderTarget(B.map,Te),n.clear();else{Te===0&&(n.setRenderTarget(B.map),n.clear());const K=B.getViewport(Te);a.set(r.x*K.x,r.y*K.y,r.x*K.z,r.y*K.w),F.viewport(a)}i=B.getFrustum(Te),E(_,y,Fe,G,ie,this.type)}B.isPointLightShadow!==!0&&this.type===gs&&M(B,y),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,n.setRenderTarget(N,I,D)};function M(b,_){const y=e.update(v);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,u.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,u.needsUpdate=!0),b.mapPass===null?b.mapPass=new Si(s.x,s.y,{format:mn,type:bi}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),d.uniforms.shadow_pass.value=b.map.depthTexture,d.uniforms.resolution.value.set(b.map.width,b.map.height),d.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(_,null,y,d,v,null),u.uniforms.shadow_pass.value=b.mapPass.texture,u.uniforms.resolution.value.set(b.map.width,b.map.height),u.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(_,null,y,u,v,null)}function T(b,_,y,N){let I=null;const D=y.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(D!==void 0)I=D;else if(I=y.isPointLight===!0?l:o,n.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){const F=I.uuid,W=_.uuid;let A=c[F];A===void 0&&(A={},c[F]=A);let H=A[W];H===void 0&&(H=I.clone(),A[W]=H,_.addEventListener("dispose",R)),I=H}if(I.visible=_.visible,I.wireframe=_.wireframe,N===gs?I.side=_.shadowSide!==null?_.shadowSide:_.side:I.side=_.shadowSide!==null?_.shadowSide:f[_.side],I.alphaMap=_.alphaMap,I.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,I.map=_.map,I.clipShadows=_.clipShadows,I.clippingPlanes=_.clippingPlanes,I.clipIntersection=_.clipIntersection,I.displacementMap=_.displacementMap,I.displacementScale=_.displacementScale,I.displacementBias=_.displacementBias,I.wireframeLinewidth=_.wireframeLinewidth,I.linewidth=_.linewidth,y.isPointLight===!0&&I.isMeshDistanceMaterial===!0){const F=n.properties.get(I);F.light=y}return I}function E(b,_,y,N,I,D){if(b.visible===!1)return;if(b.layers.test(I)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&D===gs)&&(!b.frustumCulled||b.intersectsFrustum(i))){b.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,b.matrixWorld);const A=e.update(b),H=b.material;if(Array.isArray(H)){const G=A.groups;for(let B=0,ne=G.length;B<ne;B++){const q=G[B],J=H[q.materialIndex];if(J&&J.visible){const ie=T(b,J,N,D);b.onBeforeShadow(n,b,_,y,A,ie,q),n.renderBufferDirect(y,null,A,ie,b,q),b.onAfterShadow(n,b,_,y,A,ie,q)}}}else if(H.visible){const G=T(b,H,N,D);b.onBeforeShadow(n,b,_,y,A,G,null),n.renderBufferDirect(y,null,A,G,b,null),b.onAfterShadow(n,b,_,y,A,G,null)}}const W=b.children;for(let A=0,H=W.length;A<H;A++)E(W[A],_,y,N,I,D)}function R(b){b.target.removeEventListener("dispose",R);for(const y in c){const N=c[y],I=b.target.uuid;I in N&&(N[I].dispose(),delete N[I])}}}function Iv(n,e){function t(){let L=!1;const ee=new ft;let Z=null;const fe=new ft(0,0,0,0);return{setMask:function(le){Z!==le&&!L&&(n.colorMask(le,le,le,le),Z=le)},setLocked:function(le){L=le},setClear:function(le,he,Ue,Ye,oe){oe===!0&&(le*=Ye,he*=Ye,Ue*=Ye),ee.set(le,he,Ue,Ye),fe.equals(ee)===!1&&(n.clearColor(le,he,Ue,Ye),fe.copy(ee))},reset:function(){L=!1,Z=null,fe.set(-1,0,0,0)}}}function i(){let L=!1,ee=!1,Z=null,fe=null,le=null;return{setReversed:function(he){if(ee!==he){const Ue=e.get("EXT_clip_control");he?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT),ee=he;const Ye=le;le=null,this.setClear(Ye)}},getReversed:function(){return ee},setTest:function(he){he?$(n.DEPTH_TEST):Me(n.DEPTH_TEST)},setMask:function(he){Z!==he&&!L&&(n.depthMask(he),Z=he)},setFunc:function(he){if(ee&&(he=vf[he]),fe!==he){switch(he){case Ha:n.depthFunc(n.NEVER);break;case Va:n.depthFunc(n.ALWAYS);break;case Ga:n.depthFunc(n.LESS);break;case Es:n.depthFunc(n.LEQUAL);break;case Wa:n.depthFunc(n.EQUAL);break;case Xa:n.depthFunc(n.GEQUAL);break;case qa:n.depthFunc(n.GREATER);break;case Ya:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}fe=he}},setLocked:function(he){L=he},setClear:function(he){le!==he&&(le=he,ee&&(he=1-he),n.clearDepth(he))},reset:function(){L=!1,Z=null,fe=null,le=null,ee=!1}}}function s(){let L=!1,ee=null,Z=null,fe=null,le=null,he=null,Ue=null,Ye=null,oe=null;return{setTest:function(Oe){L||(Oe?$(n.STENCIL_TEST):Me(n.STENCIL_TEST))},setMask:function(Oe){ee!==Oe&&!L&&(n.stencilMask(Oe),ee=Oe)},setFunc:function(Oe,qe,ye){(Z!==Oe||fe!==qe||le!==ye)&&(n.stencilFunc(Oe,qe,ye),Z=Oe,fe=qe,le=ye)},setOp:function(Oe,qe,ye){(he!==Oe||Ue!==qe||Ye!==ye)&&(n.stencilOp(Oe,qe,ye),he=Oe,Ue=qe,Ye=ye)},setLocked:function(Oe){L=Oe},setClear:function(Oe){oe!==Oe&&(n.clearStencil(Oe),oe=Oe)},reset:function(){L=!1,ee=null,Z=null,fe=null,le=null,he=null,Ue=null,Ye=null,oe=null}}}const r=new t,a=new i,o=new s;let l={};const c=new WeakMap;let h={},f={},d={},u=new WeakMap,m=[],v=null,g=!1,p=null,M=null,T=null,E=null,R=null,b=null,_=null,y=new Ze(0,0,0),N=0,I=!1,D=null,F=null,W=null,A=null,H=null;const G=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,ne=0;const q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(ne=parseFloat(/^WebGL (\d)/.exec(q)[1]),B=ne>=1):q.indexOf("OpenGL ES")!==-1&&(ne=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),B=ne>=2);let J=null,ie={};const Te=n.getParameter(n.SCISSOR_BOX),Fe=n.getParameter(n.VIEWPORT),K=new ft().fromArray(Te),me=new ft().fromArray(Fe);function we(L,ee,Z,fe){const le=new Uint8Array(4),he=n.createTexture();n.bindTexture(L,he),n.texParameteri(L,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(L,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ue=0;Ue<Z;Ue++)L===n.TEXTURE_3D||L===n.TEXTURE_2D_ARRAY?n.texImage3D(ee,0,n.RGBA,1,1,fe,0,n.RGBA,n.UNSIGNED_BYTE,le):n.texImage2D(ee+Ue,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,le);return he}const De={};De[n.TEXTURE_2D]=we(n.TEXTURE_2D,n.TEXTURE_2D,1),De[n.TEXTURE_CUBE_MAP]=we(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),De[n.TEXTURE_2D_ARRAY]=we(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),De[n.TEXTURE_3D]=we(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),$(n.DEPTH_TEST),a.setFunc(Es),Re(!1),je(Ol),$(n.CULL_FACE),be(Vn);function $(L){h[L]!==!0&&(n.enable(L),h[L]=!0)}function Me(L){h[L]!==!1&&(n.disable(L),h[L]=!1)}function C(L,ee){return d[L]!==ee?(n.bindFramebuffer(L,ee),d[L]=ee,L===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=ee),L===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=ee),!0):!1}function P(L,ee){let Z=m,fe=!1;if(L){Z=u.get(ee),Z===void 0&&(Z=[],u.set(ee,Z));const le=L.textures;if(Z.length!==le.length||Z[0]!==n.COLOR_ATTACHMENT0){for(let he=0,Ue=le.length;he<Ue;he++)Z[he]=n.COLOR_ATTACHMENT0+he;Z.length=le.length,fe=!0}}else Z[0]!==n.BACK&&(Z[0]=n.BACK,fe=!0);fe&&n.drawBuffers(Z)}function se(L){return v!==L?(n.useProgram(L),v=L,!0):!1}const ue={[Di]:n.FUNC_ADD,[Fd]:n.FUNC_SUBTRACT,[ch]:n.FUNC_REVERSE_SUBTRACT};ue[Od]=n.MIN,ue[Bd]=n.MAX;const re={[kd]:n.ZERO,[za]:n.ONE,[zd]:n.SRC_COLOR,[hh]:n.SRC_ALPHA,[qd]:n.SRC_ALPHA_SATURATE,[Wd]:n.DST_COLOR,[Vd]:n.DST_ALPHA,[Hd]:n.ONE_MINUS_SRC_COLOR,[Rr]:n.ONE_MINUS_SRC_ALPHA,[Xd]:n.ONE_MINUS_DST_COLOR,[Gd]:n.ONE_MINUS_DST_ALPHA,[Yd]:n.CONSTANT_COLOR,[$d]:n.ONE_MINUS_CONSTANT_COLOR,[Kd]:n.CONSTANT_ALPHA,[Zd]:n.ONE_MINUS_CONSTANT_ALPHA};function be(L,ee,Z,fe,le,he,Ue,Ye,oe,Oe){if(L===Vn){g===!0&&(Me(n.BLEND),g=!1);return}if(g===!1&&($(n.BLEND),g=!0),L!==lh){if(L!==p||Oe!==I){if((M!==Di||R!==Di)&&(n.blendEquation(n.FUNC_ADD),M=Di,R=Di),Oe)switch(L){case Ss:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Bl:n.blendFunc(n.ONE,n.ONE);break;case kl:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case zl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:ke("WebGLState: Invalid blending: ",L);break}else switch(L){case Ss:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Bl:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case kl:ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case zl:ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ke("WebGLState: Invalid blending: ",L);break}T=null,E=null,b=null,_=null,y.set(0,0,0),N=0,p=L,I=Oe}return}le=le||ee,he=he||Z,Ue=Ue||fe,(ee!==M||le!==R)&&(n.blendEquationSeparate(ue[ee],ue[le]),M=ee,R=le),(Z!==T||fe!==E||he!==b||Ue!==_)&&(n.blendFuncSeparate(re[Z],re[fe],re[he],re[Ue]),T=Z,E=fe,b=he,_=Ue),(Ye.equals(y)===!1||oe!==N)&&(n.blendColor(Ye.r,Ye.g,Ye.b,oe),y.copy(Ye),N=oe),p=L,I=!1}function Ae(L,ee){L.side===fi?Me(n.CULL_FACE):$(n.CULL_FACE);let Z=L.side===Xt;ee&&(Z=!Z),Re(Z),L.blending===Ss&&L.transparent===!1?be(Vn):be(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const fe=L.stencilWrite;o.setTest(fe),fe&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Ge(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?$(n.SAMPLE_ALPHA_TO_COVERAGE):Me(n.SAMPLE_ALPHA_TO_COVERAGE)}function Re(L){D!==L&&(L?n.frontFace(n.CW):n.frontFace(n.CCW),D=L)}function je(L){L!==Nd?($(n.CULL_FACE),L!==F&&(L===Ol?n.cullFace(n.BACK):L===Dd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Me(n.CULL_FACE),F=L}function We(L){L!==W&&(B&&n.lineWidth(L),W=L)}function Ge(L,ee,Z){L?($(n.POLYGON_OFFSET_FILL),(A!==ee||H!==Z)&&(A=ee,H=Z,a.getReversed()&&(ee=-ee,Z=-Z),n.polygonOffset(ee,Z))):Me(n.POLYGON_OFFSET_FILL)}function ct(L){L?$(n.SCISSOR_TEST):Me(n.SCISSOR_TEST)}function _t(L){L===void 0&&(L=n.TEXTURE0+G-1),J!==L&&(n.activeTexture(L),J=L)}function Vt(L,ee,Z){Z===void 0&&(J===null?Z=n.TEXTURE0+G-1:Z=J);let fe=ie[Z];fe===void 0&&(fe={type:void 0,texture:void 0},ie[Z]=fe),(fe.type!==L||fe.texture!==ee)&&(J!==Z&&(n.activeTexture(Z),J=Z),n.bindTexture(L,ee||De[L]),fe.type=L,fe.texture=ee)}function O(){const L=ie[J];L!==void 0&&L.type!==void 0&&(n.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function Jt(){try{n.compressedTexImage2D(...arguments)}catch(L){ke("WebGLState:",L)}}function vt(){try{n.compressedTexImage3D(...arguments)}catch(L){ke("WebGLState:",L)}}function xt(){try{n.texSubImage2D(...arguments)}catch(L){ke("WebGLState:",L)}}function ve(){try{n.texSubImage3D(...arguments)}catch(L){ke("WebGLState:",L)}}function Et(){try{n.compressedTexSubImage2D(...arguments)}catch(L){ke("WebGLState:",L)}}function Be(){try{n.compressedTexSubImage3D(...arguments)}catch(L){ke("WebGLState:",L)}}function ze(){try{n.texStorage2D(...arguments)}catch(L){ke("WebGLState:",L)}}function w(){try{n.texStorage3D(...arguments)}catch(L){ke("WebGLState:",L)}}function x(){try{n.texImage2D(...arguments)}catch(L){ke("WebGLState:",L)}}function z(){try{n.texImage3D(...arguments)}catch(L){ke("WebGLState:",L)}}function ae(L){return f[L]!==void 0?f[L]:n.getParameter(L)}function te(L,ee){f[L]!==ee&&(n.pixelStorei(L,ee),f[L]=ee)}function ce(L){K.equals(L)===!1&&(n.scissor(L.x,L.y,L.z,L.w),K.copy(L))}function ge(L){me.equals(L)===!1&&(n.viewport(L.x,L.y,L.z,L.w),me.copy(L))}function j(L,ee){let Z=c.get(ee);Z===void 0&&(Z=new WeakMap,c.set(ee,Z));let fe=Z.get(L);fe===void 0&&(fe=n.getUniformBlockIndex(ee,L.name),n.uniformBlockBinding(ee,fe,fe),Z.set(L,fe))}function Q(L,ee,Z){const le=c.get(ee).get(L);l[le]!==Z&&(n.bindBufferBase(n.UNIFORM_BUFFER,le,Z),l[le]=Z)}function de(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},f={},J=null,ie={},d={},l={},u=new WeakMap,m=[],v=null,g=!1,p=null,M=null,T=null,E=null,R=null,b=null,_=null,y=new Ze(0,0,0),N=0,I=!1,D=null,F=null,W=null,A=null,H=null,K.set(0,0,n.canvas.width,n.canvas.height),me.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:$,disable:Me,bindFramebuffer:C,drawBuffers:P,useProgram:se,setBlending:be,setMaterial:Ae,setFlipSided:Re,setCullFace:je,setLineWidth:We,setPolygonOffset:Ge,setScissorTest:ct,activeTexture:_t,bindTexture:Vt,unbindTexture:O,compressedTexImage2D:Jt,compressedTexImage3D:vt,texImage2D:x,texImage3D:z,pixelStorei:te,getParameter:ae,updateUBOMapping:j,uniformBlockBinding:Q,texStorage2D:ze,texStorage3D:w,texSubImage2D:xt,texSubImage3D:ve,compressedTexSubImage2D:Et,compressedTexSubImage3D:Be,scissor:ce,viewport:ge,reset:de}}function Lv(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new rt,h=new WeakMap,f=new Set;let d;const u=new WeakMap,m=new Set,v=new FinalizationRegistry(w=>m.delete(w));let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(w,x){return g?new OffscreenCanvas(w,x):Cs("canvas")}function M(w,x,z){let ae=1;const te=ze(w);if((te.width>z||te.height>z)&&(ae=z/Math.max(te.width,te.height)),ae<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const ce=Math.floor(ae*te.width),ge=Math.floor(ae*te.height);d===void 0&&(d=p(ce,ge));const j=x?p(ce,ge):d;return j.width=ce,j.height=ge,j.getContext("2d").drawImage(w,0,0,ce,ge),Ne("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+ce+"x"+ge+")."),j}else return"data"in w&&Ne("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),w;return w}function T(w){return w.generateMipmaps}function E(w){n.generateMipmap(w)}function R(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function b(w,x,z,ae,te,ce=!1){if(w!==null){if(n[w]!==void 0)return n[w];Ne("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let ge;ae&&(ge=e.get("EXT_texture_norm16"),ge||Ne("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=x;if(x===n.RED&&(z===n.FLOAT&&(j=n.R32F),z===n.HALF_FLOAT&&(j=n.R16F),z===n.UNSIGNED_BYTE&&(j=n.R8),z===n.UNSIGNED_SHORT&&ge&&(j=ge.R16_EXT),z===n.SHORT&&ge&&(j=ge.R16_SNORM_EXT)),x===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(j=n.R8UI),z===n.UNSIGNED_SHORT&&(j=n.R16UI),z===n.UNSIGNED_INT&&(j=n.R32UI),z===n.BYTE&&(j=n.R8I),z===n.SHORT&&(j=n.R16I),z===n.INT&&(j=n.R32I)),x===n.RG&&(z===n.FLOAT&&(j=n.RG32F),z===n.HALF_FLOAT&&(j=n.RG16F),z===n.UNSIGNED_BYTE&&(j=n.RG8),z===n.UNSIGNED_SHORT&&ge&&(j=ge.RG16_EXT),z===n.SHORT&&ge&&(j=ge.RG16_SNORM_EXT)),x===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&(j=n.RG8UI),z===n.UNSIGNED_SHORT&&(j=n.RG16UI),z===n.UNSIGNED_INT&&(j=n.RG32UI),z===n.BYTE&&(j=n.RG8I),z===n.SHORT&&(j=n.RG16I),z===n.INT&&(j=n.RG32I)),x===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&(j=n.RGB8UI),z===n.UNSIGNED_SHORT&&(j=n.RGB16UI),z===n.UNSIGNED_INT&&(j=n.RGB32UI),z===n.BYTE&&(j=n.RGB8I),z===n.SHORT&&(j=n.RGB16I),z===n.INT&&(j=n.RGB32I)),x===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&(j=n.RGBA8UI),z===n.UNSIGNED_SHORT&&(j=n.RGBA16UI),z===n.UNSIGNED_INT&&(j=n.RGBA32UI),z===n.BYTE&&(j=n.RGBA8I),z===n.SHORT&&(j=n.RGBA16I),z===n.INT&&(j=n.RGBA32I)),x===n.RGB&&(z===n.UNSIGNED_SHORT&&ge&&(j=ge.RGB16_EXT),z===n.SHORT&&ge&&(j=ge.RGB16_SNORM_EXT),z===n.UNSIGNED_INT_5_9_9_9_REV&&(j=n.RGB9_E5),z===n.UNSIGNED_INT_10F_11F_11F_REV&&(j=n.R11F_G11F_B10F)),x===n.RGBA){const Q=ce?Nr:st.getTransfer(te);z===n.FLOAT&&(j=n.RGBA32F),z===n.HALF_FLOAT&&(j=n.RGBA16F),z===n.UNSIGNED_BYTE&&(j=Q===ut?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT&&ge&&(j=ge.RGBA16_EXT),z===n.SHORT&&ge&&(j=ge.RGBA16_SNORM_EXT),z===n.UNSIGNED_SHORT_4_4_4_4&&(j=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(j=n.RGB5_A1)}return(j===n.R16F||j===n.R32F||j===n.RG16F||j===n.RG32F||j===n.RGBA16F||j===n.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function _(w,x){let z;return w?x===null||x===Mi||x===qn?z=n.DEPTH24_STENCIL8:x===ni?z=n.DEPTH32F_STENCIL8:x===ws&&(z=n.DEPTH24_STENCIL8,Ne("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Mi||x===qn?z=n.DEPTH_COMPONENT24:x===ni?z=n.DEPTH_COMPONENT32F:x===ws&&(z=n.DEPTH_COMPONENT16),z}function y(w,x){return T(w)===!0||w.isFramebufferTexture&&w.minFilter!==Tt&&w.minFilter!==It?Math.log2(Math.max(x.width,x.height))+1:w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?x.mipmaps.length:1}function N(w){const x=new WeakRef(w);i.get(w).__ref=x,m.add(x),v.register(w,x,x)}function I(w){const x=i.get(w).__ref;x!==void 0&&(m.delete(x),v.unregister(x))}function D(w){W(w.target)}function F(w){A(w.target)}function W(w){w.removeEventListener("dispose",D),I(w),G(w),w.isVideoTexture&&h.delete(w),w.isHTMLTexture&&f.delete(w)}function A(w){w.removeEventListener("dispose",F),I(w),ne(w)}function H(){for(const w of m){const x=w.deref();x!==void 0&&(x.isRenderTarget===!0?A(x):W(x))}m.clear(),f.clear()}function G(w){const x=i.get(w);if(x.__webglInit===void 0)return;const z=w.source,ae=u.get(z);if(ae){const te=ae[x.__cacheKey];te.usedTimes--,te.usedTimes===0&&B(w),Object.keys(ae).length===0&&u.delete(z)}i.remove(w)}function B(w){const x=i.get(w);n.deleteTexture(x.__webglTexture);const z=w.source,ae=u.get(z);delete ae[x.__cacheKey],a.memory.textures--}function ne(w){const x=i.get(w);x.__depthDisposeCallback&&x.__depthDisposeCallback();const z=w.depthTexture;if(z&&z.renderTarget===w&&W(z),w.isWebGLCubeRenderTarget)for(let te=0;te<6;te++){if(Array.isArray(x.__webglFramebuffer[te]))for(let ce=0;ce<x.__webglFramebuffer[te].length;ce++)n.deleteFramebuffer(x.__webglFramebuffer[te][ce]);else n.deleteFramebuffer(x.__webglFramebuffer[te]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[te])}else{if(Array.isArray(x.__webglFramebuffer))for(let te=0;te<x.__webglFramebuffer.length;te++)n.deleteFramebuffer(x.__webglFramebuffer[te]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let te=0;te<x.__webglColorRenderbuffer.length;te++)x.__webglColorRenderbuffer[te]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[te]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const ae=w.textures;for(let te=0,ce=ae.length;te<ce;te++){const ge=i.get(ae[te]);ge.__webglTexture&&(n.deleteTexture(ge.__webglTexture),a.memory.textures--),i.remove(ae[te])}i.remove(w)}let q=0;function J(){q=0}function ie(){return q}function Te(w){q=w}function Fe(){const w=q;return w>=s.maxTextures&&Ne("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),q+=1,w}function K(w){const x=[];return x.push(w.wrapS),x.push(w.wrapT),x.push(w.wrapR||0),x.push(w.magFilter),x.push(w.minFilter),x.push(w.anisotropy),x.push(w.internalFormat),x.push(w.format),x.push(w.type),x.push(w.generateMipmaps),x.push(w.mipmapsAutoUpdate),x.push(w.premultiplyAlpha),x.push(w.flipY),x.push(w.unpackAlignment),x.push(w.colorSpace),x.join()}function me(w,x){const z=i.get(w);if(w.isVideoTexture&&Et(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&z.__version!==w.version){const ae=w.image;if(ae===null)Ne("WebGLRenderer: Texture marked for update but no image data found.");else if(ae.complete===!1)Ne("WebGLRenderer: Texture marked for update but image is incomplete");else{Ae(z,w,x);return}}else w.isExternalTexture&&(z.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+x)}function we(w,x){const z=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&z.__version!==w.version){Ae(z,w,x);return}else w.isExternalTexture&&(z.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+x)}function De(w,x){const z=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&z.__version!==w.version){Ae(z,w,x);return}t.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+x)}function $(w,x){const z=i.get(w);if(w.version>0&&z.__version!==w.version){Re(z,w,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+x)}const Me={[$a]:n.REPEAT,[Kt]:n.CLAMP_TO_EDGE,[Ka]:n.MIRRORED_REPEAT},C={[Tt]:n.NEAREST,[ef]:n.NEAREST_MIPMAP_NEAREST,[zs]:n.NEAREST_MIPMAP_LINEAR,[It]:n.LINEAR,[sa]:n.LINEAR_MIPMAP_NEAREST,[Oi]:n.LINEAR_MIPMAP_LINEAR},P={[cf]:n.NEVER,[Rh]:n.ALWAYS,[hf]:n.LESS,[wh]:n.LEQUAL,[uf]:n.EQUAL,[Ah]:n.GEQUAL,[df]:n.GREATER,[ff]:n.NOTEQUAL};function se(w,x){if(x.type===ni&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===It||x.magFilter===sa||x.magFilter===zs||x.magFilter===Oi||x.minFilter===It||x.minFilter===sa||x.minFilter===zs||x.minFilter===Oi)&&Ne("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,Me[x.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,Me[x.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,Me[x.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,C[x.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,C[x.minFilter]),x.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,P[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Tt||x.minFilter!==zs&&x.minFilter!==Oi||x.type===ni&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(w,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function ue(w,x){let z=!1;w.__webglInit===void 0&&(w.__webglInit=!0,x.addEventListener("dispose",D),N(x));const ae=x.source;let te=u.get(ae);te===void 0&&(te={},u.set(ae,te));const ce=K(x);if(ce!==w.__cacheKey){te[ce]===void 0&&(te[ce]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,z=!0),te[ce].usedTimes++;const ge=te[w.__cacheKey];ge!==void 0&&(te[w.__cacheKey].usedTimes--,ge.usedTimes===0&&B(x)),w.__cacheKey=ce,w.__webglTexture=te[ce].texture}return z}function re(w,x,z){return Math.floor(Math.floor(w/z)/x)}function be(w,x,z,ae){const ce=w.updateRanges;if(ce.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,z,ae,x.data);else{ce.sort((L,ee)=>L.start-ee.start);let ge=0;for(let L=1;L<ce.length;L++){const ee=ce[ge],Z=ce[L],fe=ee.start+ee.count,le=re(Z.start,x.width,4),he=re(ee.start,x.width,4);Z.start<=fe+1&&le===he&&re(Z.start+Z.count-1,x.width,4)===le?ee.count=Math.max(ee.count,Z.start+Z.count-ee.start):(++ge,ce[ge]=Z)}ce.length=ge+1;const j=t.getParameter(n.UNPACK_ROW_LENGTH),Q=t.getParameter(n.UNPACK_SKIP_PIXELS),de=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let L=0,ee=ce.length;L<ee;L++){const Z=ce[L],fe=Math.floor(Z.start/4),le=Math.ceil(Z.count/4),he=fe%x.width,Ue=Math.floor(fe/x.width),Ye=le,oe=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,he),t.pixelStorei(n.UNPACK_SKIP_ROWS,Ue),t.texSubImage2D(n.TEXTURE_2D,0,he,Ue,Ye,oe,z,ae,x.data)}w.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,j),t.pixelStorei(n.UNPACK_SKIP_PIXELS,Q),t.pixelStorei(n.UNPACK_SKIP_ROWS,de)}}function Ae(w,x,z){let ae=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(ae=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(ae=n.TEXTURE_3D);const te=ue(w,x),ce=x.source;t.bindTexture(ae,w.__webglTexture,n.TEXTURE0+z);const ge=i.get(ce);if(ce.version!==ge.__version||te===!0){if(t.activeTexture(n.TEXTURE0+z),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const oe=st.getPrimaries(st.workingColorSpace),Oe=x.colorSpace===Ui?null:st.getPrimaries(x.colorSpace),qe=x.colorSpace===Ui||oe===Oe?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe)}t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment);let Q=M(x.image,!1,s.maxTextureSize);Q=Be(x,Q);const de=r.convert(x.format,x.colorSpace),L=r.convert(x.type);let ee=b(x.internalFormat,de,L,x.normalized,x.colorSpace,x.isVideoTexture);se(ae,x);let Z;const fe=x.mipmaps,le=x.isVideoTexture!==!0,he=ge.__version===void 0||te===!0,Ue=ce.dataReady,Ye=y(x,Q);if(x.isDepthTexture)ee=_(x.format===Qi,x.type),he&&(le?t.texStorage2D(n.TEXTURE_2D,1,ee,Q.width,Q.height):t.texImage2D(n.TEXTURE_2D,0,ee,Q.width,Q.height,0,de,L,null));else if(x.isDataTexture)if(fe.length>0){le&&he&&t.texStorage2D(n.TEXTURE_2D,Ye,ee,fe[0].width,fe[0].height);for(let oe=0,Oe=fe.length;oe<Oe;oe++)Z=fe[oe],le?Ue&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,de,L,Z.data):t.texImage2D(n.TEXTURE_2D,oe,ee,Z.width,Z.height,0,de,L,Z.data);x.generateMipmaps=!1}else le?(he&&t.texStorage2D(n.TEXTURE_2D,Ye,ee,Q.width,Q.height),Ue&&be(x,Q,de,L)):t.texImage2D(n.TEXTURE_2D,0,ee,Q.width,Q.height,0,de,L,Q.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){le&&he&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ye,ee,fe[0].width,fe[0].height,Q.depth);for(let oe=0,Oe=fe.length;oe<Oe;oe++)if(Z=fe[oe],x.format!==si)if(de!==null)if(le){if(Ue)if(x.layerUpdates.size>0){const qe=Ic(Z.width,Z.height,x.format,x.type);for(const ye of x.layerUpdates){const ht=Z.data.subarray(ye*qe/Z.data.BYTES_PER_ELEMENT,(ye+1)*qe/Z.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,ye,Z.width,Z.height,1,de,ht)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,Z.width,Z.height,Q.depth,de,Z.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,oe,ee,Z.width,Z.height,Q.depth,0,Z.data,0,0);else Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else le?Ue&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,Z.width,Z.height,Q.depth,de,L,Z.data):t.texImage3D(n.TEXTURE_2D_ARRAY,oe,ee,Z.width,Z.height,Q.depth,0,de,L,Z.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{le&&he&&t.texStorage2D(n.TEXTURE_2D,Ye,ee,fe[0].width,fe[0].height);for(let oe=0,Oe=fe.length;oe<Oe;oe++)Z=fe[oe],x.format!==si?de!==null?le?Ue&&t.compressedTexSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,de,Z.data):t.compressedTexImage2D(n.TEXTURE_2D,oe,ee,Z.width,Z.height,0,Z.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):le?Ue&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,Z.width,Z.height,de,L,Z.data):t.texImage2D(n.TEXTURE_2D,oe,ee,Z.width,Z.height,0,de,L,Z.data)}else if(x.isDataArrayTexture)if(le){if(he&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ye,ee,Q.width,Q.height,Q.depth),Ue)if(x.layerUpdates.size>0){const oe=Ic(Q.width,Q.height,x.format,x.type);for(const Oe of x.layerUpdates){const qe=Q.data.subarray(Oe*oe/Q.data.BYTES_PER_ELEMENT,(Oe+1)*oe/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Oe,Q.width,Q.height,1,de,L,qe)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,de,L,Q.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ee,Q.width,Q.height,Q.depth,0,de,L,Q.data);else if(x.isData3DTexture)le?(he&&t.texStorage3D(n.TEXTURE_3D,Ye,ee,Q.width,Q.height,Q.depth),Ue&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,de,L,Q.data)):t.texImage3D(n.TEXTURE_3D,0,ee,Q.width,Q.height,Q.depth,0,de,L,Q.data);else if(x.isFramebufferTexture){if(he)if(le)t.texStorage2D(n.TEXTURE_2D,Ye,ee,Q.width,Q.height);else{let oe=Q.width,Oe=Q.height;for(let qe=0;qe<Ye;qe++)t.texImage2D(n.TEXTURE_2D,qe,ee,oe,Oe,0,de,L,null),oe>>=1,Oe>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in n){const oe=n.canvas;if(oe.hasAttribute("layoutsubtree")||oe.setAttribute("layoutsubtree","true"),Q.parentNode!==oe){oe.appendChild(Q),f.add(x),oe.onpaint=Oe=>{const qe=Oe.changedElements;for(const ye of f)qe.includes(ye.image)&&(ye.needsUpdate=!0)},oe.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,Q);else{const qe=n.RGBA,ye=n.RGBA,ht=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,qe,ye,ht,Q)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(fe.length>0){if(le&&he){const oe=ze(fe[0]);t.texStorage2D(n.TEXTURE_2D,Ye,ee,oe.width,oe.height)}for(let oe=0,Oe=fe.length;oe<Oe;oe++)Z=fe[oe],le?Ue&&t.texSubImage2D(n.TEXTURE_2D,oe,0,0,de,L,Z):t.texImage2D(n.TEXTURE_2D,oe,ee,de,L,Z);x.generateMipmaps=!1}else if(le){if(he){const oe=ze(Q);t.texStorage2D(n.TEXTURE_2D,Ye,ee,oe.width,oe.height)}Ue&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,de,L,Q)}else t.texImage2D(n.TEXTURE_2D,0,ee,de,L,Q);T(x)&&x.mipmapsAutoUpdate===!0&&E(ae),ge.__version=ce.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function Re(w,x,z){if(x.image.length!==6)return;const ae=ue(w,x),te=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+z);const ce=i.get(te);if(te.version!==ce.__version||ae===!0){t.activeTexture(n.TEXTURE0+z);const ge=st.getPrimaries(st.workingColorSpace),j=x.colorSpace===Ui?null:st.getPrimaries(x.colorSpace),Q=x.colorSpace===Ui||ge===j?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);const de=x.isCompressedTexture||x.image[0].isCompressedTexture,L=x.image[0]&&x.image[0].isDataTexture,ee=[];for(let ye=0;ye<6;ye++)!de&&!L?ee[ye]=M(x.image[ye],!0,s.maxCubemapSize):ee[ye]=L?x.image[ye].image:x.image[ye],ee[ye]=Be(x,ee[ye]);const Z=ee[0],fe=r.convert(x.format,x.colorSpace),le=r.convert(x.type);let he=b(x.internalFormat,fe,le,x.normalized,x.colorSpace);const Ue=x.isVideoTexture!==!0,Ye=ce.__version===void 0||ae===!0,oe=te.dataReady;let Oe=y(x,Z);se(n.TEXTURE_CUBE_MAP,x);let qe;if(x.isDepthTexture){if(he=_(x.format===Qi,x.type),Ye)if(Ue)t.texStorage2D(n.TEXTURE_CUBE_MAP,1,he,Z.width,Z.height);else for(let ye=0;ye<6;ye++)t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,he,Z.width,Z.height,0,fe,le,null)}else if(de){Ue&&Ye&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Oe,he,Z.width,Z.height);for(let ye=0;ye<6;ye++){qe=ee[ye].mipmaps;for(let ht=0;ht<qe.length;ht++){const Rt=qe[ht];x.format!==si?fe!==null?Ue?oe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ht,0,0,Rt.width,Rt.height,fe,Rt.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ht,he,Rt.width,Rt.height,0,Rt.data):Ne("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ht,0,0,Rt.width,Rt.height,fe,le,Rt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ht,he,Rt.width,Rt.height,0,fe,le,Rt.data)}}}else{if(qe=x.mipmaps,Ue&&Ye){qe.length>0&&Oe++;const ye=ze(ee[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Oe,he,ye.width,ye.height)}for(let ye=0;ye<6;ye++)if(L){Ue?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,ee[ye].width,ee[ye].height,fe,le,ee[ye].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,he,ee[ye].width,ee[ye].height,0,fe,le,ee[ye].data);for(let ht=0;ht<qe.length;ht++){const Gi=qe[ht].image[ye].image;Ue?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ht+1,0,0,Gi.width,Gi.height,fe,le,Gi.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ht+1,he,Gi.width,Gi.height,0,fe,le,Gi.data)}}else{Ue?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,0,0,fe,le,ee[ye]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,0,he,fe,le,ee[ye]);for(let ht=0;ht<qe.length;ht++){const Rt=qe[ht];Ue?oe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ht+1,0,0,fe,le,Rt.image[ye]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ye,ht+1,he,fe,le,Rt.image[ye])}}}T(x)&&x.mipmapsAutoUpdate===!0&&E(n.TEXTURE_CUBE_MAP),ce.__version=te.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function je(w,x,z,ae,te,ce){const ge=r.convert(z.format,z.colorSpace),j=r.convert(z.type),Q=b(z.internalFormat,ge,j,z.normalized,z.colorSpace),de=i.get(x),L=i.get(z);if(L.__renderTarget=x,!de.__hasExternalTextures){const ee=Math.max(1,x.width>>ce),Z=Math.max(1,x.height>>ce);te===n.TEXTURE_3D||te===n.TEXTURE_2D_ARRAY?t.texImage3D(te,ce,Q,ee,Z,x.depth,0,ge,j,null):t.texImage2D(te,ce,Q,ee,Z,0,ge,j,null)}t.bindFramebuffer(n.FRAMEBUFFER,w),ve(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,ae,te,L.__webglTexture,0,xt(x)):(te===n.TEXTURE_2D||te>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,ae,te,L.__webglTexture,ce),t.bindFramebuffer(n.FRAMEBUFFER,null)}function We(w,x,z){if(n.bindRenderbuffer(n.RENDERBUFFER,w),x.depthBuffer){const ae=x.depthTexture,te=ae&&ae.isDepthTexture?ae.type:null,ce=_(x.stencilBuffer,te),ge=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;ve(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,xt(x),ce,x.width,x.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,xt(x),ce,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,ce,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ge,n.RENDERBUFFER,w)}else{const ae=x.textures;for(let te=0;te<ae.length;te++){const ce=ae[te],ge=r.convert(ce.format,ce.colorSpace),j=r.convert(ce.type),Q=b(ce.internalFormat,ge,j,ce.normalized,ce.colorSpace);ve(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,xt(x),Q,x.width,x.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,xt(x),Q,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,Q,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ge(w,x,z){const ae=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,w),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const te=i.get(x.depthTexture);te.__renderTarget=x;const ce=ae?x.depthTexture.image[0]:x.depthTexture.image;(!te.__webglTexture||ce.width!==x.width||ce.height!==x.height)&&(ce.width=x.width,ce.height=x.height,x.depthTexture.needsUpdate=!0),ae?$(x.depthTexture,0):me(x.depthTexture,0);const ge=te.__webglTexture,j=xt(x),Q=ae?n.TEXTURE_CUBE_MAP_POSITIVE_X+z:n.TEXTURE_2D,de=x.depthTexture.format===Qi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===en)ve(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,de,Q,ge,0,j):n.framebufferTexture2D(n.FRAMEBUFFER,de,Q,ge,0);else if(x.depthTexture.format===Qi)ve(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,de,Q,ge,0,j):n.framebufferTexture2D(n.FRAMEBUFFER,de,Q,ge,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ct(w){const x=i.get(w),z=w.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==w.depthTexture){const ae=w.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),ae){const te=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,ae.removeEventListener("dispose",te)};ae.addEventListener("dispose",te),x.__depthDisposeCallback=te}x.__boundDepthTexture=ae}if(w.depthTexture&&!x.__autoAllocateDepthBuffer)if(z)for(let ae=0;ae<6;ae++)Ge(x.__webglFramebuffer[ae],w,ae);else w.texture.mipmaps.length>0?Ge(x.__webglFramebuffer[0],w,0):Ge(x.__webglFramebuffer,w,0);else if(z){x.__webglDepthbuffer=[];for(let ae=0;ae<6;ae++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[ae]),x.__webglDepthbuffer[ae]===void 0)x.__webglDepthbuffer[ae]=n.createRenderbuffer(),We(x.__webglDepthbuffer[ae],w,!1);else{const te=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=x.__webglDepthbuffer[ae];n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,ce)}}else if(w.texture.mipmaps.length>0?t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),We(x.__webglDepthbuffer,w,!1);else{const te=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ce),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,ce)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function _t(w,x,z){const ae=i.get(w);x!==void 0&&je(ae.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&ct(w)}function Vt(w){const x=w.texture,z=i.get(w),ae=i.get(x);w.addEventListener("dispose",F),N(w);const te=w.textures,ce=w.isWebGLCubeRenderTarget===!0,ge=te.length>1;if(ge||(ae.__webglTexture===void 0&&(ae.__webglTexture=n.createTexture()),ae.__version=x.version,a.memory.textures++),ce){z.__webglFramebuffer=[];for(let j=0;j<6;j++)if(x.mipmaps.length>0){z.__webglFramebuffer[j]=[];for(let Q=0;Q<x.mipmaps.length;Q++)z.__webglFramebuffer[j][Q]=n.createFramebuffer()}else z.__webglFramebuffer[j]=n.createFramebuffer()}else{if(x.mipmaps.length>0){z.__webglFramebuffer=[];for(let j=0;j<x.mipmaps.length;j++)z.__webglFramebuffer[j]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(ge)for(let j=0,Q=te.length;j<Q;j++){const de=i.get(te[j]);de.__webglTexture===void 0&&(de.__webglTexture=n.createTexture(),a.memory.textures++)}if(w.samples>0&&ve(w)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let j=0;j<te.length;j++){const Q=te[j];z.__webglColorRenderbuffer[j]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[j]);const de=r.convert(Q.format,Q.colorSpace),L=r.convert(Q.type),ee=b(Q.internalFormat,de,L,Q.normalized,Q.colorSpace,w.isXRRenderTarget===!0),Z=xt(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,Z,ee,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+j,n.RENDERBUFFER,z.__webglColorRenderbuffer[j])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),We(z.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ce){t.bindTexture(n.TEXTURE_CUBE_MAP,ae.__webglTexture),se(n.TEXTURE_CUBE_MAP,x);for(let j=0;j<6;j++)if(x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)je(z.__webglFramebuffer[j][Q],w,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+j,Q);else je(z.__webglFramebuffer[j],w,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);T(x)?E(n.TEXTURE_CUBE_MAP):x.mipmaps.length>0&&n.texParameteri(n.TEXTURE_CUBE_MAP,n.TEXTURE_MAX_LEVEL,x.mipmaps.length-1),t.unbindTexture()}else if(ge){for(let j=0,Q=te.length;j<Q;j++){const de=te[j],L=i.get(de);let ee=n.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ee=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ee,L.__webglTexture),se(ee,de),je(z.__webglFramebuffer,w,de,n.COLOR_ATTACHMENT0+j,ee,0),T(de)&&E(ee)}t.unbindTexture()}else{let j=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(j=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(j,ae.__webglTexture),se(j,x),x.mipmaps.length>0)for(let Q=0;Q<x.mipmaps.length;Q++)je(z.__webglFramebuffer[Q],w,x,n.COLOR_ATTACHMENT0,j,Q);else je(z.__webglFramebuffer,w,x,n.COLOR_ATTACHMENT0,j,0);T(x)?E(j):x.mipmaps.length>0&&n.texParameteri(j,n.TEXTURE_MAX_LEVEL,x.mipmaps.length-1),t.unbindTexture()}w.depthBuffer&&ct(w)}function O(w){const x=w.textures;for(let z=0,ae=x.length;z<ae;z++){const te=x[z];if(T(te)&&te.mipmapsAutoUpdate===!0){const ce=R(w),ge=i.get(te).__webglTexture;t.bindTexture(ce,ge),E(ce),t.unbindTexture()}}}const Jt=[];function vt(w){if(w.samples>0){if(ve(w)===!1){const x=w.textures,z=w.width,ae=w.height;let te=n.COLOR_BUFFER_BIT;const ce=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ge=i.get(w),j=x.length>1;if(j)for(let de=0;de<x.length;de++)t.bindFramebuffer(n.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ge.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer),w.texture.mipmaps.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ge.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let de=0;de<x.length;de++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(te|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(te|=n.STENCIL_BUFFER_BIT)),j){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ge.__webglColorRenderbuffer[de]);const L=i.get(x[de]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,L,0)}n.blitFramebuffer(0,0,z,ae,0,0,z,ae,te,n.NEAREST),l===!0&&(Jt.length=0,Jt.push(n.COLOR_ATTACHMENT0+de),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&Jt.push(ce),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Jt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),j)for(let de=0;de<x.length;de++){t.bindFramebuffer(n.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,ge.__webglColorRenderbuffer[de]);const L=i.get(x[de]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ge.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.TEXTURE_2D,L,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&l){const x=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function xt(w){return Math.min(s.maxSamples,w.samples)}function ve(w){const x=i.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Et(w){const x=a.render.frame;h.get(w)!==x&&(h.set(w,x),w.update())}function Be(w,x){const z=w.colorSpace,ae=w.format,te=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||z!==As&&z!==Ui&&(st.getTransfer(z)===ut?(ae!==si||te!==Wt)&&Ne("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ke("WebGLTextures: Unsupported texture color space:",z)),x}function ze(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=Fe,this.resetTextureUnits=J,this.getTextureUnits=ie,this.setTextureUnits=Te,this.setTexture2D=me,this.setTexture2DArray=we,this.setTexture3D=De,this.setTextureCube=$,this.rebindTextures=_t,this.setupRenderTarget=Vt,this.updateRenderTargetMipmap=O,this.updateMultisampleRenderTarget=vt,this.setupDepthRenderbuffer=ct,this.setupFrameBufferTexture=je,this.useMultisampledRTT=ve,this.dispose=H}function Nv(n,e){function t(i,s=Ui){let r;const a=st.getTransfer(s);if(i===Wt)return n.UNSIGNED_BYTE;if(i===ko)return n.UNSIGNED_SHORT_4_4_4_4;if(i===zo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Mh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===bh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===yh)return n.BYTE;if(i===Sh)return n.SHORT;if(i===ws)return n.UNSIGNED_SHORT;if(i===Bo)return n.INT;if(i===Mi)return n.UNSIGNED_INT;if(i===ni)return n.FLOAT;if(i===bi)return n.HALF_FLOAT;if(i===Eh)return n.ALPHA;if(i===Th)return n.RGB;if(i===si)return n.RGBA;if(i===en)return n.DEPTH_COMPONENT;if(i===Qi)return n.DEPTH_STENCIL;if(i===zr)return n.RED;if(i===Ho)return n.RED_INTEGER;if(i===mn)return n.RG;if(i===Vo)return n.RG_INTEGER;if(i===Go)return n.RGBA_INTEGER;if(i===vr||i===xr||i===yr||i===Sr)if(a===ut)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===vr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===yr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===vr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===xr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===yr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Sr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Za||i===Ja||i===ja||i===Qa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Za)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ja)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ja)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Qa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===eo||i===to||i===io||i===no||i===so||i===Cr||i===ro)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===eo||i===to)return a===ut?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===io)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===no)return r.COMPRESSED_R11_EAC;if(i===so)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Cr)return r.COMPRESSED_RG11_EAC;if(i===ro)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===ao||i===oo||i===lo||i===co||i===ho||i===uo||i===fo||i===po||i===mo||i===go||i===_o||i===vo||i===xo||i===yo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===ao)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===oo)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===lo)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===co)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ho)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===uo)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===fo)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===po)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===mo)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===go)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===_o)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===vo)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===xo)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===yo)return a===ut?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===So||i===Mo||i===bo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===So)return a===ut?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Mo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===bo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Eo||i===To||i===Pr||i===wo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Eo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===To)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Pr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===wo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===qn?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const Dv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Uv=`
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

}`;class Fv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Vh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new gn({vertexShader:Dv,fragmentShader:Uv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ri(new Gr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Ov extends nn{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,d=null,u=null,m=null;const v=typeof XRWebGLBinding<"u",g=new Fv,p={},M=t.getContextAttributes();let T=null,E=null;const R=[],b=[],_=new rt;let y=null,N=null;const I=new ii;I.viewport=new ft;const D=new ii;D.viewport=new ft;const F=[I,D],W=new Op;let A=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let me=R[K];return me===void 0&&(me=new da,R[K]=me),me.getTargetRaySpace()},this.getControllerGrip=function(K){let me=R[K];return me===void 0&&(me=new da,R[K]=me),me.getGripSpace()},this.getHand=function(K){let me=R[K];return me===void 0&&(me=new da,R[K]=me),me.getHandSpace()};function G(K){const me=b.indexOf(K.inputSource);if(me===-1)return;const we=R[me];we!==void 0&&(we.update(K.inputSource,K.frame,c||a),we.dispatchEvent({type:K.type,data:K.inputSource}))}function B(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",B),s.removeEventListener("inputsourceschange",ne);for(let K=0;K<R.length;K++){const me=b[K];me!==null&&(b[K]=null,R[K].disconnect(me))}A=null,H=null,g.reset();for(const K in p)delete p[K];if(e.setRenderTarget(T),u=null,d=null,f=null,s=null,E=null,Fe.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(_.width,_.height,!1),N!==null){const K=N.camera;K.fov=N.fov,K.zoom=N.zoom,K.updateProjectionMatrix(),N=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,i.isPresenting===!0&&Ne("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,i.isPresenting===!0&&Ne("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return d!==null?d:u},this.getBinding=function(){return f===null&&v&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(K){if(s=K,s!==null){if(T=e.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",B),s.addEventListener("inputsourceschange",ne),M.xrCompatible!==!0&&await t.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(_),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let we=null,De=null,$=null;M.depth&&($=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,we=M.stencil?Qi:en,De=M.stencil?qn:Mi);const Me={colorFormat:t.RGBA8,depthFormat:$,scaleFactor:r};f=this.getBinding(),d=f.createProjectionLayer(Me),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),E=new Si(d.textureWidth,d.textureHeight,{format:si,type:Wt,depthTexture:new Kn(d.textureWidth,d.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,we),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{const we={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,t,we),s.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),E=new Si(u.framebufferWidth,u.framebufferHeight,{format:si,type:Wt,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Fe.setContext(s),Fe.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function ne(K){for(let me=0;me<K.removed.length;me++){const we=K.removed[me],De=b.indexOf(we);De>=0&&(b[De]=null,R[De].disconnect(we))}for(let me=0;me<K.added.length;me++){const we=K.added[me];let De=b.indexOf(we);if(De===-1){for(let Me=0;Me<R.length;Me++)if(Me>=b.length){b.push(we),De=Me;break}else if(b[Me]===null){b[Me]=we,De=Me;break}if(De===-1)break}const $=R[De];$&&$.connect(we)}}function q(K,me){me===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(me.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(s===null)return;let me=K.near,we=K.far;g.texture!==null&&(g.depthNear>0&&(me=g.depthNear),g.depthFar>0&&(we=g.depthFar)),W.near=D.near=I.near=me,W.far=D.far=I.far=we,(A!==W.near||H!==W.far)&&(s.updateRenderState({depthNear:W.near,depthFar:W.far}),A=W.near,H=W.far),W.layers.mask=K.layers.mask|6,I.layers.mask=W.layers.mask&-5,D.layers.mask=W.layers.mask&-3;const De=K.parent,$=W.cameras;q(W,De);for(let Me=0;Me<$.length;Me++)q($[Me],De);W.projectionMatrix.copy(I.projectionMatrix),W.projectionMatrixInverse.copy(I.projectionMatrixInverse),N===null&&K.isPerspectiveCamera&&(N={camera:K,fov:K.fov,zoom:K.zoom}),J(K,W,De)};function J(K,me,we){we===null?K.matrix.copy(me.matrixWorld):(K.matrix.copy(we.matrixWorld),K.matrix.invert(),K.matrix.multiply(me.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(me.projectionMatrix),K.projectionMatrixInverse.copy(me.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Yn*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return W},this.getFoveation=function(){if(!(d===null&&u===null))return l},this.setFoveation=function(K){l=K,d!==null&&(d.fixedFoveation=K),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=K)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(W)},this.getCameraTexture=function(K){return p[K]};let ie=null;function Te(K,me){if(h=me.getViewerPose(c||a),m=me,h!==null){const we=h.views;u!==null&&(e.setRenderTargetFramebuffer(E,u.framebuffer),e.setRenderTarget(E));let De=!1;we.length!==W.cameras.length&&(W.cameras.length=0,De=!0);for(let P=0;P<we.length;P++){const se=we[P];let ue=null;if(u!==null)ue=u.getViewport(se);else{const be=f.getViewSubImage(d,se);ue=be.viewport,P===0&&(e.setRenderTargetTextures(E,be.colorTexture,be.depthStencilTexture),e.setRenderTarget(E))}let re=F[P];re===void 0&&(re=new ii,re.layers.enable(P),re.viewport=new ft,F[P]=re),re.matrix.fromArray(se.transform.matrix),re.matrix.decompose(re.position,re.quaternion,re.scale),re.projectionMatrix.fromArray(se.projectionMatrix),re.projectionMatrixInverse.copy(re.projectionMatrix).invert(),re.viewport.set(ue.x,ue.y,ue.width,ue.height),P===0&&(W.matrix.copy(re.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale)),De===!0&&W.cameras.push(re)}const $=s.enabledFeatures;if($&&$.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){f=i.getBinding();const P=f.getDepthInformation(we[0]);P&&P.isValid&&P.texture&&g.init(P,s.renderState)}if($&&$.includes("camera-access")&&v){e.state.unbindTexture(),f=i.getBinding();for(let P=0;P<we.length;P++){const se=we[P].camera;if(se){let ue=p[se];ue||(ue=new Vh,p[se]=ue);const re=f.getCameraImage(se);ue.sourceTexture=re}}}}for(let we=0;we<R.length;we++){const De=b[we],$=R[we];De!==null&&$!==void 0&&$.update(De,me,c||a)}ie&&ie(K,me),me.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:me}),m=null}const Fe=new Kh;Fe.setAnimationLoop(Te),this.setAnimationLoop=function(K){ie=K},this.dispose=function(){}}}const Bv=new et,ru=new He;ru.set(-1,0,0,0,1,0,0,0,1);function kv(n,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function i(g,p){p.color.getRGB(g.fogColor.value,Gh(n)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,M,T,E){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),f(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&u(g,p,E)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,M,T):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Xt&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Xt&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const M=e.get(p),T=M.envMap,E=M.envMapRotation;T&&(g.envMap.value=T,g.envMapRotation.value.setFromMatrix4(Bv.makeRotationFromEuler(E)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(ru),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,M,T){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*M,g.scale.value=T*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function u(g,p,M){g.ior.value=p.ior,p.diffuseRoughness>0&&(g.diffuseRoughness.value=p.diffuseRoughness,p.diffuseRoughnessMap&&(g.diffuseRoughnessMap.value=p.diffuseRoughnessMap,t(p.diffuseRoughnessMap,g.diffuseRoughnessMapTransform))),p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Xt&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessMinimum,g.iridescenceThicknessMaximum.value=p.iridescenceThicknessMaximum,p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){const M=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function zv(n,e,t,i){let s={},r={};function a(M,T){const E=T.program;i.uniformBlockBinding(M,E,s[M.id])}function o(M,T){let E=s[M.id];E===void 0&&(m(M),E=l(M),s[M.id]=E,M.addEventListener("dispose",g));const R=T.program;i.updateUBOMapping(M,R);const b=e.render.frame;r[M.id]!==b&&(c(M),r[M.id]=b)}function l(M){const T=n.createBuffer(),E=M.__size,R=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,E,R),n.bindBuffer(n.UNIFORM_BUFFER,null),T}function c(M){const T=s[M.id],E=M.uniforms,R=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,T);for(let b=0,_=E.length;b<_;b++){const y=E[b];if(Array.isArray(y))for(let N=0,I=y.length;N<I;N++)h(y[N],b,N,R);else h(y,b,0,R)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function h(M,T,E,R){if(d(M,T,E,R)===!0){const b=M.__offset,_=M.value;if(Array.isArray(_)){let y=0;for(let N=0;N<_.length;N++){const I=_[N],D=v(I,!0);f(I,M.__data,y),y+=D.storage/Float32Array.BYTES_PER_ELEMENT}}else f(_,M.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,b,M.__data)}}function f(M,T,E){typeof M=="number"||typeof M=="boolean"?T[E]=M:M.isMatrix3?(T[E]=M.elements[0],T[E+1]=M.elements[1],T[E+2]=M.elements[2],T[E+3]=0,T[E+4]=M.elements[3],T[E+5]=M.elements[4],T[E+6]=M.elements[5],T[E+7]=0,T[E+8]=M.elements[6],T[E+9]=M.elements[7],T[E+10]=M.elements[8],T[E+11]=0):ArrayBuffer.isView(M)?T.set(M.subarray(0,T.length-E),E):M.toArray(T,E)}function d(M,T,E,R){const b=M.value,_=T+"_"+E;if(Array.isArray(b)){R[_]===void 0&&(R[_]=[]);const y=R[_];let N=!1;for(let I=0;I<b.length;I++)u(b[I],y,I)===!0&&(N=!0);return N}return u(b,R,_)}function u(M,T,E){if(T[E]===void 0)return typeof M=="number"||typeof M=="boolean"?T[E]=M:ArrayBuffer.isView(M)?T[E]=M.slice():T[E]=M.clone(),!0;{const R=T[E];if(typeof M=="number"||typeof M=="boolean"){if(R!==M)return T[E]=M,!0}else{if(ArrayBuffer.isView(M))return!0;if(R.equals(M)===!1)return R.copy(M),!0}}return!1}function m(M){const T=M.uniforms;let E=0;const R=16;for(let _=0,y=T.length;_<y;_++){const N=Array.isArray(T[_])?T[_]:[T[_]];for(let I=0,D=N.length;I<D;I++){const F=N[I],W=Array.isArray(F.value)?F.value:[F.value],A=Array.isArray(T[_])||Array.isArray(F.value);let H=E;for(let B=0,ne=W.length;B<ne;B++){const q=W[B],J=v(q,A),ie=E%R,Te=ie%J.boundary,Fe=ie+Te;E+=Te,Fe!==0&&R-Fe<J.storage&&(E+=R-Fe),B===0&&(H=E),E+=J.storage}const G=F.type==="int"?Int32Array:F.type==="uint"?Uint32Array:Float32Array;F.__data=new G((E-H)/Float32Array.BYTES_PER_ELEMENT),F.__offset=H}}const b=E%R;return b>0&&(E+=R-b),M.__size=E,M.__cache={},this}function v(M,T){const E={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(E.boundary=4,E.storage=4):M.isVector2?(E.boundary=8,E.storage=8):M.isVector3||M.isColor?(E.boundary=16,E.storage=12):M.isVector4?(E.boundary=16,E.storage=16):M.isMatrix3?(E.boundary=16,E.storage=48):M.isMatrix4?(E.boundary=16,E.storage=64):M.isTexture?Ne("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(E.boundary=16,E.storage=M.byteLength):Ne("WebGLRenderer: Unsupported uniform value type.",M),T===!0&&(E.boundary=16,E.storage=Math.ceil(E.storage/16)*16),E}function g(M){const T=M.target;T.removeEventListener("dispose",g),n.deleteBuffer(s[T.id]),delete s[T.id],delete r[T.id]}function p(){for(const M in s)n.deleteBuffer(s[M]);s={},r={}}return{bind:a,update:o,dispose:p}}const Hv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let vi=null;function Vv(){return vi===null&&(vi=new $n(Hv,16,16,mn,bi),vi.name="DFG_LUT",vi.minFilter=It,vi.magFilter=It,vi.wrapS=Kt,vi.wrapT=Kt,vi.generateMipmaps=!1,vi.needsUpdate=!0),vi}class Gv{constructor(e={}){const{canvas:t=gf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1,outputBufferType:u=Wt}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const v=u,g=new Set([Go,Vo,Ho]),p=new Set([Wt,Mi,ws,qn,ko,zo]),M=new Uint32Array(4),T=new Int32Array(4),E={textures:[],min:[],max:[],resolution:[]};let R=null,b=null;const _=[],y=[];let N=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ki,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const I=this;let D=!1,F=null,W=null,A=null,H=null;this._outputColorSpace=ti;let G=0,B=0,ne=null,q=-1,J=null;const ie=new ft,Te=new ft;let Fe=null;const K=new Ze(0);let me=0,we=t.width,De=t.height,$=1,Me=null,C=null;const P=new ft(0,0,we,De),se=new ft(0,0,we,De);let ue=!1;const re=new Ps,be=new Ko;let Ae=!1,Re=!1;const je=new et,We=new X,Ge=new ft,ct={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let _t=!1;function Vt(){return ne===null?$:1}let O=i;function Jt(S,U){return t.getContext(S,U)}let vt,xt,ve,Et,Be,ze,w,x,z,ae,te,ce,ge,j,Q,de,L,ee,Z,fe,le,he,Ue;try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Oo}`),t.addEventListener("webglcontextlost",Oe,!1),t.addEventListener("webglcontextrestored",qe,!1),t.addEventListener("webglcontextcreationerror",ye,!1),O===null){const U="webgl2";if(O=Jt(U,S),O===null)throw Jt(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ye()}catch(S){throw t.removeEventListener("webglcontextlost",Oe,!1),t.removeEventListener("webglcontextrestored",qe,!1),t.removeEventListener("webglcontextcreationerror",ye,!1),ke("WebGLRenderer: "+S.message),S}function Ye(){vt=new q0(O),vt.init(),le=new Nv(O,vt),xt=new U0(O,vt,e,le),ve=new Iv(O,vt),xt.reversedDepthBuffer&&d&&ve.buffers.depth.setReversed(!0),W=O.createFramebuffer(),A=O.createFramebuffer(),H=O.createFramebuffer(),Et=new K0(O),Be=new _v,ze=new Lv(O,vt,ve,Be,xt,le,Et),w=new X0(I),x=new Jp(O),he=new N0(O,x),z=new Y0(O,x,Et,he),ae=new J0(O,z,x,he,Et),ee=new Z0(O,xt,ze),Q=new F0(Be),te=new gv(I,w,vt,xt,he,Q),ce=new kv(I,Be),ge=new xv,j=new Tv(vt),L=new L0(I,w,ve,ae,m,l),de=new Pv(I,ae,xt),Ue=new zv(O,Et,xt,ve),Z=new D0(O,vt,Et),fe=new $0(O,vt,Et),Et.programs=te.programs,I.capabilities=xt,I.extensions=vt,I.properties=Be,I.renderLists=ge,I.shadowMap=de,I.state=ve,I.info=Et}v!==Wt&&(N=new Q0(v,t.width,t.height,o,s,r));const oe=new Ov(I,O);this.xr=oe,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const S=vt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=vt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(S){S!==void 0&&($=S,this.setSize(we,De,!1))},this.getSize=function(S){return S.set(we,De)},this.setSize=function(S,U,Y=!0){if(oe.isPresenting){Ne("WebGLRenderer: Can't change size while VR device is presenting.");return}we=S,De=U,t.width=Math.floor(S*$),t.height=Math.floor(U*$),Y===!0&&(t.style.width=S+"px",t.style.height=U+"px"),N!==null&&N.setSize(t.width,t.height),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(we*$,De*$).floor()},this.setDrawingBufferSize=function(S,U,Y){we=S,De=U,$=Y,t.width=Math.floor(S*Y),t.height=Math.floor(U*Y),this.setViewport(0,0,S,U)},this.setEffects=function(S){if(v===Wt){ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let U=0;U<S.length;U++)if(S[U].isOutputPass===!0){Ne("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}N.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(ie)},this.getViewport=function(S){return S.copy(P)},this.setViewport=function(S,U,Y,k){S.isVector4?P.set(S.x,S.y,S.z,S.w):P.set(S,U,Y,k),ve.viewport(ie.copy(P).multiplyScalar(Vt()).round())},this.getScissor=function(S){return S.copy(se)},this.setScissor=function(S,U,Y,k){S.isVector4?se.set(S.x,S.y,S.z,S.w):se.set(S,U,Y,k),ve.scissor(Te.copy(se).multiplyScalar(Vt()).round())},this.getScissorTest=function(){return ue},this.setScissorTest=function(S){ve.setScissorTest(ue=S)},this.setOpaqueSort=function(S){Me=S},this.setTransparentSort=function(S){C=S},this.getClearColor=function(S){return S.copy(L.getClearColor())},this.setClearColor=function(){L.setClearColor(...arguments)},this.getClearAlpha=function(){return L.getClearAlpha()},this.setClearAlpha=function(){L.setClearAlpha(...arguments)},this.clear=function(S=!0,U=!0,Y=!0){let k=0;if(S){let V=!1;if(ne!==null){const _e=ne.texture.format;V=g.has(_e)}if(V){const _e=ne.texture.type,Ce=p.has(_e),pe=L.getClearColor(),Ee=L.getClearAlpha(),Le=pe.r,Ve=pe.g,tt=pe.b;Ce?(M[0]=Le,M[1]=Ve,M[2]=tt,M[3]=Ee,O.clearBufferuiv(O.COLOR,0,M)):(T[0]=Le,T[1]=Ve,T[2]=tt,T[3]=Ee,O.clearBufferiv(O.COLOR,0,T))}else k|=O.COLOR_BUFFER_BIT}U&&(k|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(k|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&O.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),F=S},this.dispose=function(){t.removeEventListener("webglcontextlost",Oe,!1),t.removeEventListener("webglcontextrestored",qe,!1),t.removeEventListener("webglcontextcreationerror",ye,!1),L.dispose(),ge.dispose(),j.dispose(),ze.dispose(),Be.dispose(),w.dispose(),ae.dispose(),z.dispose(),he.dispose(),Ue.dispose(),te.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",ll),oe.removeEventListener("sessionend",cl),rn.stop()};function Oe(S){S.preventDefault(),Ur("WebGLRenderer: Context Lost."),D=!0}function qe(){Ur("WebGLRenderer: Context Restored."),D=!1;const S=Et.autoReset,U=de.enabled,Y=de.autoUpdate,k=de.needsUpdate,V=de.type;Ye(),Et.autoReset=S,de.enabled=U,de.autoUpdate=Y,de.needsUpdate=k,de.type=V}function ye(S){ke("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function ht(S){const U=S.target;U.removeEventListener("dispose",ht),Rt(U)}function Rt(S){Gi(S),Be.remove(S)}function Gi(S){const U=Be.get(S).programs;U!==void 0&&(U.forEach(function(Y){te.releaseProgram(Y)}),S.isShaderMaterial&&te.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,Y,k,V,_e){U===null&&(U=ct);const Ce=V.isMesh&&V.matrixWorld.determinantAffine()<0,pe=lu(S,U,Y,k,V);ve.setMaterial(k,Ce);let Ee=Y.index,Le=1;if(k.wireframe===!0){if(Ee=z.getWireframeAttribute(Y),Ee===void 0)return;Le=2}const Ve=Y.drawRange,tt=Y.attributes.position;let Pe=Ve.start*Le,it=(Ve.start+Ve.count)*Le;_e!==null&&(Pe=Math.max(Pe,_e.start*Le),it=Math.min(it,(_e.start+_e.count)*Le)),Ee!==null?(Pe=Math.max(Pe,0),it=Math.min(it,Ee.count)):tt!=null&&(Pe=Math.max(Pe,0),it=Math.min(it,tt.count));const Mt=it-Pe;if(Mt<0||Mt===1/0)return;he.setup(V,k,pe,Y,Ee);let mt,pt=Z;if(Ee!==null&&(mt=x.get(Ee),pt=fe,pt.setIndex(mt)),V.isMesh)k.wireframe===!0?(ve.setLineWidth(k.wireframeLinewidth*Vt()),pt.setMode(O.LINES)):pt.setMode(O.TRIANGLES);else if(V.isLine){let Dt=k.linewidth;Dt===void 0&&(Dt=1),ve.setLineWidth(Dt*Vt()),V.isLineSegments?pt.setMode(O.LINES):V.isLineLoop?pt.setMode(O.LINE_LOOP):pt.setMode(O.LINE_STRIP)}else V.isPoints?pt.setMode(O.POINTS):V.isSprite&&pt.setMode(O.TRIANGLES);if(V.isBatchedMesh)if(vt.get("WEBGL_multi_draw"))pt.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Dt=V._multiDrawStarts,Ie=V._multiDrawCounts,Bt=V._multiDrawCount,lt=Ee?x.get(Ee).bytesPerElement:1,an=Be.get(k).currentProgram.getUniforms();for(let Ut=0;Ut<Bt;Ut++)an.setValue(O,"_gl_DrawID",Ut),pt.render(Dt[Ut]/lt,Ie[Ut])}else if(V.isInstancedMesh)pt.renderInstances(Pe,Mt,V.count);else if(Y.isInstancedBufferGeometry){const Dt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Ie=Math.min(Y.instanceCount,Dt);pt.renderInstances(Pe,Mt,Ie)}else pt.render(Pe,Mt)};function ol(S,U,Y,k){F!==null&&S.isNodeMaterial&&F.setObject(k,S),Ae===!0&&Q.setState(S,Y,!1),S.transparent===!0&&S.side===fi&&S.forceSinglePass===!1?(S.side=Xt,S.needsUpdate=!0,ts(S,U,k),S.side=pn,S.needsUpdate=!0,ts(S,U,k),S.side=fi):ts(S,U,k)}this.compile=function(S,U,Y=null){Y===null&&(Y=S),F!==null&&F.renderStart(S,U,Y),b=j.get(Y),b.init(U),y.push(b),Y.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),S!==Y&&S.traverseVisible(function(V){V.isLight&&V.layers.test(U.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),b.setupLights(),F!==null&&F.updateLights(b.state.lightsArray),Re=this.localClippingEnabled,Ae=Q.init(this.clippingPlanes,Re),Ae===!0&&Q.setGlobalState(this.clippingPlanes,U),F!==null&&de.render(b.state.shadowsArray,Y,U);const k=new Set;return S.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const _e=V.material;if(_e)if(Array.isArray(_e))for(let Ce=0;Ce<_e.length;Ce++){const pe=_e[Ce];ol(pe,Y,U,V),k.add(pe)}else ol(_e,Y,U,V),k.add(_e)}),b=y.pop(),F!==null&&F.renderEnd(),k},this.compileAsync=function(S,U,Y=null){const k=this.compile(S,U,Y);return new Promise(V=>{function _e(){if(k.forEach(function(Ce){const Ee=Be.get(Ce).currentProgram;(Ee===void 0||Ee.isReady())&&k.delete(Ce)}),k.size===0){V(S);return}setTimeout(_e,10)}vt.get("KHR_parallel_shader_compile")!==null?_e():setTimeout(_e,10)})};let Yr=null;function au(S){Yr&&Yr(S)}function ll(){rn.stop()}function cl(){rn.start()}const rn=new Kh;rn.setAnimationLoop(au),typeof self<"u"&&rn.setContext(self),this.setAnimationLoop=function(S){Yr=S,oe.setAnimationLoop(S),S===null?rn.stop():rn.start()},oe.addEventListener("sessionstart",ll),oe.addEventListener("sessionend",cl),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;F!==null&&F.renderStart(S,U);const Y=oe.enabled===!0&&oe.isPresenting===!0,k=N!==null&&(ne===null||Y)&&N.begin(I,ne);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(N===null||N.isCompositing()===!1)&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(U),U=oe.getCamera()),S.isScene===!0&&S.onBeforeRender(I,S,U,ne),b=j.get(S,y.length),b.init(U),b.state.textureUnits=ze.getTextureUnits(),y.push(b),je.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),U.isArrayCamera?be.setFromArrayCamera(U):re.setFromProjectionMatrix(je,mi,U.reversedDepth),Re=this.localClippingEnabled,Ae=Q.init(this.clippingPlanes,Re),R=ge.get(S,_.length),R.init(),_.push(R),this.info.render.frame++,oe.enabled===!0&&oe.isPresenting===!0){const Ce=I.xr.getDepthSensingMesh();Ce!==null&&$r(Ce,U,-1/0,I.sortObjects)}$r(S,U,0,I.sortObjects),R.finish(),F!==null&&F.updateLights(b.state.lightsArray),I.sortObjects===!0&&R.sort(Me,C),_t=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,_t&&L.addToRenderList(R,S),this.info.autoReset===!0&&this.info.reset(),Ae===!0&&Q.beginShadows();const V=b.state.shadowsArray;if(de.render(V,S,U),Ae===!0&&Q.endShadows(),(k&&N.hasRenderPass())===!1){const Ce=R.opaque,pe=R.transmissive;if(b.setupLights(),U.isArrayCamera){const Ee=U.cameras;if(pe.length>0)for(let Le=0,Ve=Ee.length;Le<Ve;Le++){const tt=Ee[Le];ul(Ce,pe,S,tt)}_t&&L.render(S);for(let Le=0,Ve=Ee.length;Le<Ve;Le++){const tt=Ee[Le];hl(R,S,tt,tt.viewport)}}else pe.length>0&&ul(Ce,pe,S,U),_t&&L.render(S),hl(R,S,U)}ne!==null&&B===0&&(ze.updateMultisampleRenderTarget(ne),ze.updateRenderTargetMipmap(ne)),k&&N.end(I),S.isScene===!0&&S.onAfterRender(I,S,U),he.resetDefaultState(),q=-1,J=null,y.pop(),y.length>0?(b=y[y.length-1],ze.setTextureUnits(b.state.textureUnits),Ae===!0&&Q.setGlobalState(I.clippingPlanes,b.state.camera)):b=null,_.pop(),_.length>0?R=_[_.length-1]:R=null,F!==null&&F.renderEnd()};function $r(S,U,Y,k){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)Y=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLight)b.pushLight(S),S.castShadow&&b.pushShadow(S);else if(S.isSprite){const Ce=U.isArrayCamera?be:re;if(!S.frustumCulled||S.intersectsFrustum(Ce)){k&&Ge.setFromMatrixPosition(S.matrixWorld).applyMatrix4(je);const pe=ae.update(S),Ee=S.material;Ee.visible&&R.push(S,pe,Ee,Y,Ge.z,null,U)}}else if(S.isMesh||S.isLine||S.isPoints){const Ce=U.isArrayCamera?be:re;if(!S.frustumCulled||S.intersectsFrustum(Ce)){const pe=ae.update(S),Ee=S.material;if(k&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Ge.copy(S.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Ge.copy(pe.boundingSphere.center)),Ge.applyMatrix4(S.matrixWorld).applyMatrix4(je)),Array.isArray(Ee)){const Le=pe.groups;for(let Ve=0,tt=Le.length;Ve<tt;Ve++){const Pe=Le[Ve],it=Ee[Pe.materialIndex];it&&it.visible&&R.push(S,pe,it,Y,Ge.z,Pe,U)}}else Ee.visible&&R.push(S,pe,Ee,Y,Ge.z,null,U)}}}const _e=S.children;for(let Ce=0,pe=_e.length;Ce<pe;Ce++)$r(_e[Ce],U,Y,k)}function hl(S,U,Y,k){const{opaque:V,transmissive:_e,transparent:Ce}=S;b.setupLightsView(Y),Ae===!0&&Q.setGlobalState(I.clippingPlanes,Y),k&&ve.viewport(ie.copy(k)),V.length>0&&Ds(V,U,Y),_e.length>0&&Ds(_e,U,Y),Ce.length>0&&Ds(Ce,U,Y),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function ul(S,U,Y,k){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[k.id]===void 0){const Pe=vt.has("EXT_color_buffer_half_float")||vt.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[k.id]=new Si(1,1,{generateMipmaps:!0,type:Pe?bi:Wt,minFilter:Oi,samples:Math.max(4,xt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:st.workingColorSpace})}const _e=b.state.transmissionRenderTarget[k.id],Ce=k.viewport||ie;_e.setSize(Ce.z*I.transmissionResolutionScale,Ce.w*I.transmissionResolutionScale);const pe=I.getRenderTarget(),Ee=I.getActiveCubeFace(),Le=I.getActiveMipmapLevel();I.setRenderTarget(_e),I.getClearColor(K),me=I.getClearAlpha(),me<1&&I.setClearColor(16777215,.5),I.clear(),_t&&L.render(Y);const Ve=I.toneMapping;I.toneMapping=ki;const tt=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),b.setupLightsView(k),Ae===!0&&Q.setGlobalState(I.clippingPlanes,k),Ds(S,Y,k),ze.updateMultisampleRenderTarget(_e),ze.updateRenderTargetMipmap(_e),vt.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let it=0,Mt=U.length;it<Mt;it++){const mt=U[it],{object:pt,geometry:Dt,material:Ie,group:Bt}=mt;if(Ie.side===fi&&pt.layers.test(k.layers)){const lt=Ie.side;Ie.side=Xt,Ie.needsUpdate=!0,dl(pt,Y,k,Dt,Ie,Bt),Ie.side=lt,Ie.needsUpdate=!0,Pe=!0}}Pe===!0&&(ze.updateMultisampleRenderTarget(_e),ze.updateRenderTargetMipmap(_e))}I.setRenderTarget(pe,Ee,Le),I.setClearColor(K,me),tt!==void 0&&(k.viewport=tt),I.toneMapping=Ve}function Ds(S,U,Y){const k=U.isScene===!0?U.overrideMaterial:null;for(let V=0,_e=S.length;V<_e;V++){const Ce=S[V],{object:pe,geometry:Ee,group:Le}=Ce;let Ve=Ce.material;Ve.allowOverride===!0&&k!==null&&(Ve=k),pe.layers.test(Y.layers)&&dl(pe,U,Y,Ee,Ve,Le)}}function dl(S,U,Y,k,V,_e){F!==null&&V.isNodeMaterial&&F.setObject(S,V),S.onBeforeRender(I,U,Y,k,V,_e),S.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),V.onBeforeRender(I,U,Y,k,S,_e),V.transparent===!0&&V.side===fi&&V.forceSinglePass===!1?(V.side=Xt,V.needsUpdate=!0,I.renderBufferDirect(Y,U,k,V,S,_e),V.side=pn,V.needsUpdate=!0,I.renderBufferDirect(Y,U,k,V,S,_e),V.side=fi):I.renderBufferDirect(Y,U,k,V,S,_e),S.onAfterRender(I,U,Y,k,V,_e)}function fl(S){let U=0;for(const Y of S)Y.texture!==null&&U++;return U}function ts(S,U,Y){U.isScene!==!0&&(U=ct);const k=Be.get(S),V=b.state.lights,_e=b.state.shadowsArray,Ce=V.state.version,pe=te.getParameters(S,V.state,_e,U,Y,b.state.lightProbeGridArray),Ee=te.getProgramCacheKey(pe);let Le=k.programs;k.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?U.environment:null,k.fog=U.fog;const Ve=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;k.envMap=w.get(S.envMap||k.environment,Ve),k.envMapRotation=k.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,Le===void 0&&(S.addEventListener("dispose",ht),Le=new Map,k.programs=Le,k.programVariants=new Map);let tt=Le.get(Ee);if(tt!==void 0){if(k.currentProgram===tt&&k.lightsStateVersion===Ce)return ml(S,pe),tt}else pe.uniforms=te.getUniforms(S),F!==null&&S.isNodeMaterial&&F.build(S,Y,pe),S.onBeforeCompile(pe,I),tt=te.acquireProgram(pe,Ee),Le.set(Ee,tt),k.uniforms=pe.uniforms;const Pe=k.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Pe.clippingPlanes=Q.uniform),ml(S,pe),k.needsLights=hu(S),k.lightsStateVersion=Ce,k.needsLights&&(Pe.ambientLightColor.value=V.state.ambient,Pe.lightProbe.value=V.state.probe,Pe.sunLights.value=V.state.sun,Pe.sunLightShadows.value=V.state.sunShadow,Pe.directionalLights.value=V.state.directional,Pe.directionalLightShadows.value=V.state.directionalShadow,Pe.spotLights.value=V.state.spot,Pe.spotLightShadows.value=V.state.spotShadow,Pe.rectAreaLights.value=V.state.rectArea,Pe.ltc_1.value=V.state.rectAreaLTC1,Pe.ltc_2.value=V.state.rectAreaLTC2,Pe.pointLights.value=V.state.point,Pe.pointLightShadows.value=V.state.pointShadow,Pe.hemisphereLights.value=V.state.hemi,Pe.sunShadowMatrix.value=V.state.sunShadowMatrix,Pe.sunShadowCascade.value=V.state.sunShadowCascade,Pe.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Pe.spotLightMatrix.value=V.state.spotLightMatrix,Pe.spotLightMap.value=V.state.spotLightMap,Pe.pointShadowMatrix.value=V.state.pointShadowMatrix),k.numLightProbeGrids=fl(b.state.lightProbeGridArray),k.currentProgram=tt,k.uniformsList=null,tt}function ou(S,U,Y,k,V){const _e=Be.get(S),Ce=_e.currentProgram.id+","+k+","+V;let pe=_e.programVariants.get(Ce);return pe===void 0?(pe=ts(S,U,Y),_e.programVariants.set(Ce,pe)):(_e.currentProgram=pe,_e.uniformsList=null,_e.outputColorSpace=k,_e.toneMapping=V),pe}function pl(S){if(S.uniformsList===null){const U=S.currentProgram.getUniforms();S.uniformsList=Mr.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function ml(S,U){const Y=Be.get(S);Y.outputColorSpace=U.outputColorSpace,Y.batching=U.batching,Y.batchingColor=U.batchingColor,Y.instancing=U.instancing,Y.instancingColor=U.instancingColor,Y.instancingMorph=U.instancingMorph,Y.skinning=U.skinning,Y.morphTargets=U.morphTargets,Y.morphNormals=U.morphNormals,Y.morphColors=U.morphColors,Y.morphTargetsCount=U.morphTargetsCount,Y.numClippingPlanes=U.numClippingPlanes,Y.numIntersection=U.numClipIntersection,Y.vertexAlphas=U.vertexAlphas,Y.vertexTangents=U.vertexTangents,Y.toneMapping=U.toneMapping}function lu(S,U,Y,k,V){U.isScene!==!0&&(U=ct),ze.resetTextureUnits();const _e=U.fog,Ce=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?U.environment:null,pe=ne===null?I.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:st.workingColorSpace,Ee=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Le=w.get(k.envMap||Ce,Ee),Ve=k.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,tt=!!Y.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Pe=!!Y.morphAttributes.position,it=!!Y.morphAttributes.normal,Mt=!!Y.morphAttributes.color;let mt=ki;k.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(mt=I.toneMapping);const pt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Dt=pt!==void 0?pt.length:0,Ie=Be.get(k),Bt=b.state.lights;if(Ae===!0&&(Re===!0||S!==J)){const yt=S===J&&k.id===q;Q.setState(k,S,yt)}let lt=!1,an=!1;k.version===Ie.__version?Ie.needsLights&&Ie.lightsStateVersion!==Bt.state.version||V.isBatchedMesh&&Ie.batching===!1||!V.isBatchedMesh&&Ie.batching===!0||V.isBatchedMesh&&Ie.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&Ie.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&Ie.instancing===!1||!V.isInstancedMesh&&Ie.instancing===!0||V.isSkinnedMesh&&Ie.skinning===!1||!V.isSkinnedMesh&&Ie.skinning===!0||V.isInstancedMesh&&Ie.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Ie.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Ie.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Ie.instancingMorph===!1&&V.morphTexture!==null||Ie.envMap!==Le||k.fog===!0&&Ie.fog!==_e||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==Q.numPlanes||Ie.numIntersection!==Q.numIntersection)||Ie.vertexAlphas!==Ve||Ie.vertexTangents!==tt||Ie.morphTargets!==Pe||Ie.morphNormals!==it||Ie.morphColors!==Mt||Ie.morphTargetsCount!==Dt||Ie.numLightProbeGrids!==fl(b.state.lightProbeGridArray)?lt=!0:(Ie.outputColorSpace!==pe||Ie.toneMapping!==mt)&&(an=!0):(lt=!0,Ie.__version=k.version);let Ut=Ie.currentProgram;(lt===!0||an===!0)&&(Ut=an===!0?ou(k,U,V,pe,mt):ts(k,U,V),F&&k.isNodeMaterial&&F.onUpdateProgram(k,Ut,Ie));let Us=!1,Wi=!1,on=!1;const at=Ut.getUniforms(),Lt=Ie.uniforms;if(ve.useProgram(Ut.program)&&(Us=!0,Wi=!0,on=!0),k.id!==q&&(q=k.id,Wi=!0),Us||J!==S){ve.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),at.setValue(O,"projectionMatrix",S.projectionMatrix),at.setValue(O,"viewMatrix",S.matrixWorldInverse);const Ct=at.map.cameraPosition;Ct!==void 0&&Ct.setValue(O,We.setFromMatrixPosition(S.matrixWorld)),xt.logarithmicDepthBuffer&&at.setValue(O,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&at.setValue(O,"isOrthographic",S.isOrthographicCamera===!0),J!==S&&(J=S,Wi=!0,on=!0)}if(Ie.needsLights&&(Bt.state.sunShadowMap.length>0&&at.setValue(O,"sunShadowMap",Bt.state.sunShadowMap,ze),Bt.state.directionalShadowMap.length>0&&at.setValue(O,"directionalShadowMap",Bt.state.directionalShadowMap,ze),Bt.state.spotShadowMap.length>0&&at.setValue(O,"spotShadowMap",Bt.state.spotShadowMap,ze),Bt.state.pointShadowMap.length>0&&at.setValue(O,"pointShadowMap",Bt.state.pointShadowMap,ze)),V.isSkinnedMesh){at.setOptional(O,V,"bindMatrix"),at.setOptional(O,V,"bindMatrixInverse");const yt=V.skeleton;yt&&(yt.boneTexture===null&&yt.computeBoneTexture(),at.setValue(O,"boneTexture",yt.boneTexture,ze))}V.isBatchedMesh&&(at.setOptional(O,V,"batchingTexture"),at.setValue(O,"batchingTexture",V._matricesTexture,ze),at.setOptional(O,V,"batchingIdTexture"),at.setValue(O,"batchingIdTexture",V._indirectTexture,ze),at.setOptional(O,V,"batchingColorTexture"),V._colorsTexture!==null&&at.setValue(O,"batchingColorTexture",V._colorsTexture,ze));const ai=Y.morphAttributes;if((ai.position!==void 0||ai.normal!==void 0||ai.color!==void 0)&&ee.update(V,Y,Ut),(Wi||Ie.receiveShadow!==V.receiveShadow)&&(Ie.receiveShadow=V.receiveShadow,at.setValue(O,"receiveShadow",V.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&U.environment!==null&&(Lt.envMapIntensity.value=U.environmentIntensity),Lt.dfgLUT!==void 0&&(Lt.dfgLUT.value=Vv()),Wi){if(at.setValue(O,"toneMappingExposure",I.toneMappingExposure),Ie.needsLights&&cu(Lt,on),_e&&k.fog===!0&&ce.refreshFogUniforms(Lt,_e),ce.refreshMaterialUniforms(Lt,k,$,De,b.state.transmissionRenderTarget[S.id]),Ie.needsLights&&Ie.numLightProbeGrids>0){const yt=E;let Ct=0;for(const wi of b.state.lightProbeGridArray)wi.texture!==null&&(yt.textures[Ct]=wi.texture,yt.min[Ct]=wi.boundingBox.min,yt.max[Ct]=wi.boundingBox.max,yt.resolution[Ct]=wi.resolution,Ct++);for(const wi in yt)yt[wi].length=Ct;Lt.probesSH.value=yt.textures,Lt.probesMin.value=yt.min,Lt.probesMax.value=yt.max,Lt.probesResolution.value=yt.resolution}Mr.upload(O,pl(Ie),Lt,ze)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Mr.upload(O,pl(Ie),Lt,ze),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&at.setValue(O,"center",V.center),at.setValue(O,"modelViewMatrix",V.modelViewMatrix),at.setValue(O,"normalMatrix",V.normalMatrix),at.setValue(O,"modelMatrix",V.matrixWorld),k.uniformsGroups!==void 0){const yt=k.uniformsGroups;for(let Ct=0,wi=yt.length;Ct<wi;Ct++){const _l=yt[Ct];Ue.update(_l,Ut),Ue.bind(_l,Ut)}}return Ut}function cu(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.sunLights.needsUpdate=U,S.sunLightShadows.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function hu(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return ne},this.setRenderTargetTextures=function(S,U,Y){const k=Be.get(S);k.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),Be.get(S.texture).__webglTexture=U,Be.get(S.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:Y,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,U){const Y=Be.get(S);Y.__webglFramebuffer=U,Y.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(S,U=0,Y=0){ne=S,G=U,B=Y;let k=null,V=!1,_e=!1;if(S){const pe=Be.get(S);if(pe.__useDefaultFramebuffer!==void 0){ve.bindFramebuffer(O.FRAMEBUFFER,pe.__webglFramebuffer),ie.copy(S.viewport),Te.copy(S.scissor),Fe=S.scissorTest,ve.viewport(ie),ve.scissor(Te),ve.setScissorTest(Fe),q=-1;return}else if(pe.__webglFramebuffer===void 0)ze.setupRenderTarget(S);else if(pe.__hasExternalTextures)ze.rebindTextures(S,Be.get(S.texture).__webglTexture,Be.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Ve=S.depthTexture;if(pe.__boundDepthTexture!==Ve){if(Ve!==null&&Be.has(Ve)&&(S.width!==Ve.image.width||S.height!==Ve.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ze.setupDepthRenderbuffer(S)}}const Ee=S.texture;(Ee.isData3DTexture||Ee.isDataArrayTexture||Ee.isCompressedArrayTexture)&&(_e=!0);const Le=Be.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Le[U])?k=Le[U][Y]:k=Le[U],V=!0):S.samples>0&&ze.useMultisampledRTT(S)===!1?k=Be.get(S).__webglMultisampledFramebuffer:Array.isArray(Le)?k=Le[Y]:k=Le,ie.copy(S.viewport),Te.copy(S.scissor),Fe=S.scissorTest}else ie.copy(P).multiplyScalar($).floor(),Te.copy(se).multiplyScalar($).floor(),Fe=ue;if(Y!==0&&(k=W),ve.bindFramebuffer(O.FRAMEBUFFER,k)&&ve.drawBuffers(S,k),ve.viewport(ie),ve.scissor(Te),ve.setScissorTest(Fe),V){const pe=Be.get(S.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,pe.__webglTexture,Y)}else if(_e){const pe=U;for(let Ee=0;Ee<S.textures.length;Ee++){const Le=Be.get(S.textures[Ee]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Ee,Le.__webglTexture,Y,pe)}}else if(S!==null&&Y!==0){const pe=Be.get(S.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,pe.__webglTexture,Y)}q=-1};function gl(S){const U=Be.get(S);return(U.__readFormat!==S.format||U.__readType!==S.type)&&(U.__readFormat=S.format,U.__readType=S.type,U.__formatReadable=xt.textureFormatReadable(S.format),U.__typeReadable=xt.textureTypeReadable(S.type)),U}this.readRenderTargetPixels=function(S,U,Y,k,V,_e,Ce,pe=0){if(!(S&&S.isWebGLRenderTarget)){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=Be.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ee=Ee[Ce],Array.isArray(Ee)&&(Ee=Ee[0])),Ee){ve.bindFramebuffer(O.FRAMEBUFFER,Ee);try{const Le=S.textures[pe],Ve=Le.format,tt=Le.type;S.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+pe);const Pe=gl(Le);if(Pe.__formatReadable===!1){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Pe.__typeReadable===!1){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-k&&Y>=0&&Y<=S.height-V&&O.readPixels(U,Y,k,V,le.convert(Ve),le.convert(tt),_e)}finally{const Le=ne!==null?Be.get(ne).__webglFramebuffer:null;ve.bindFramebuffer(O.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=async function(S,U,Y,k,V,_e,Ce,pe=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=Be.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ee=Ee[Ce],Array.isArray(Ee)&&(Ee=Ee[0])),Ee)if(U>=0&&U<=S.width-k&&Y>=0&&Y<=S.height-V){ve.bindFramebuffer(O.FRAMEBUFFER,Ee);const Le=S.textures[pe],Ve=Le.format,tt=Le.type;S.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+pe);const Pe=gl(Le);if(Pe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Pe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const it=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,it),O.bufferData(O.PIXEL_PACK_BUFFER,_e.byteLength,O.STREAM_READ),O.readPixels(U,Y,k,V,le.convert(Ve),le.convert(tt),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);const Mt=ne!==null?Be.get(ne).__webglFramebuffer:null;ve.bindFramebuffer(O.FRAMEBUFFER,Mt);const mt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await _f(O,mt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,it),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,_e),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(it),O.deleteSync(mt),_e}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,U=null,Y=0){const k=Math.pow(2,-Y),V=Math.floor(S.image.width*k),_e=Math.floor(S.image.height*k),Ce=U!==null?U.x:0,pe=U!==null?U.y:0;ze.setTexture2D(S,0),O.copyTexSubImage2D(O.TEXTURE_2D,Y,0,0,Ce,pe,V,_e),ve.unbindTexture()},this.copyTextureToTexture=function(S,U,Y=null,k=null,V=0,_e=0){let Ce,pe,Ee,Le,Ve,tt,Pe,it,Mt;const mt=S.isCompressedTexture?S.mipmaps[_e]:S.image;if(Y!==null)Ce=Y.max.x-Y.min.x,pe=Y.max.y-Y.min.y,Ee=Y.isBox3?Y.max.z-Y.min.z:1,Le=Y.min.x,Ve=Y.min.y,tt=Y.isBox3?Y.min.z:0;else{const at=Math.pow(2,-V);Ce=Math.floor(mt.width*at),pe=Math.floor(mt.height*at),S.isDataArrayTexture?Ee=mt.depth:S.isData3DTexture?Ee=Math.floor(mt.depth*at):Ee=1,Le=0,Ve=0,tt=0}k!==null?(Pe=k.x,it=k.y,Mt=k.z):(Pe=0,it=0,Mt=0);const pt=le.convert(U.format),Dt=le.convert(U.type);let Ie;U.isData3DTexture?(ze.setTexture3D(U,0),Ie=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(ze.setTexture2DArray(U,0),Ie=O.TEXTURE_2D_ARRAY):(ze.setTexture2D(U,0),Ie=O.TEXTURE_2D),ve.activeTexture(O.TEXTURE0),ve.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),ve.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),ve.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);const Bt=ve.getParameter(O.UNPACK_ROW_LENGTH),lt=ve.getParameter(O.UNPACK_IMAGE_HEIGHT),an=ve.getParameter(O.UNPACK_SKIP_PIXELS),Ut=ve.getParameter(O.UNPACK_SKIP_ROWS),Us=ve.getParameter(O.UNPACK_SKIP_IMAGES);ve.pixelStorei(O.UNPACK_ROW_LENGTH,mt.width),ve.pixelStorei(O.UNPACK_IMAGE_HEIGHT,mt.height),ve.pixelStorei(O.UNPACK_SKIP_PIXELS,Le),ve.pixelStorei(O.UNPACK_SKIP_ROWS,Ve),ve.pixelStorei(O.UNPACK_SKIP_IMAGES,tt);const Wi=S.isDataArrayTexture||S.isData3DTexture,on=U.isDataArrayTexture||U.isData3DTexture;if(S.isDepthTexture){const at=Be.get(S),Lt=Be.get(U),ai=Be.get(at.__renderTarget),yt=Be.get(Lt.__renderTarget);ve.bindFramebuffer(O.READ_FRAMEBUFFER,ai.__webglFramebuffer),ve.bindFramebuffer(O.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let Ct=0;Ct<Ee;Ct++)Wi&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Be.get(S).__webglTexture,V,tt+Ct),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Be.get(U).__webglTexture,_e,Mt+Ct)),O.blitFramebuffer(Le,Ve,Le+Ce,Ve+pe,Pe,it,Pe+Ce,it+pe,O.DEPTH_BUFFER_BIT,O.NEAREST);ve.bindFramebuffer(O.READ_FRAMEBUFFER,null),ve.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(V!==0||S.isRenderTargetTexture||Be.has(S)){const at=Be.get(S),Lt=Be.get(U);ve.bindFramebuffer(O.READ_FRAMEBUFFER,A),ve.bindFramebuffer(O.DRAW_FRAMEBUFFER,H);for(let ai=0;ai<Ee;ai++)Wi?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,at.__webglTexture,V,tt+ai):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,at.__webglTexture,V),on?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Lt.__webglTexture,_e,Mt+ai):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Lt.__webglTexture,_e),V!==0?O.blitFramebuffer(Le,Ve,Le+Ce,Ve+pe,Pe,it,Pe+Ce,it+pe,O.COLOR_BUFFER_BIT,O.NEAREST):on?O.copyTexSubImage3D(Ie,_e,Pe,it,Mt+ai,Le,Ve,Ce,pe):O.copyTexSubImage2D(Ie,_e,Pe,it,Le,Ve,Ce,pe);ve.bindFramebuffer(O.READ_FRAMEBUFFER,null),ve.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else on?S.isDataTexture||S.isData3DTexture?O.texSubImage3D(Ie,_e,Pe,it,Mt,Ce,pe,Ee,pt,Dt,mt.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(Ie,_e,Pe,it,Mt,Ce,pe,Ee,pt,mt.data):O.texSubImage3D(Ie,_e,Pe,it,Mt,Ce,pe,Ee,pt,Dt,mt):S.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,_e,Pe,it,Ce,pe,pt,Dt,mt.data):S.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,_e,Pe,it,mt.width,mt.height,pt,mt.data):O.texSubImage2D(O.TEXTURE_2D,_e,Pe,it,Ce,pe,pt,Dt,mt);ve.pixelStorei(O.UNPACK_ROW_LENGTH,Bt),ve.pixelStorei(O.UNPACK_IMAGE_HEIGHT,lt),ve.pixelStorei(O.UNPACK_SKIP_PIXELS,an),ve.pixelStorei(O.UNPACK_SKIP_ROWS,Ut),ve.pixelStorei(O.UNPACK_SKIP_IMAGES,Us),_e===0&&U.generateMipmaps===!0&&U.mipmapsAutoUpdate===!0&&O.generateMipmap(Ie),ve.unbindTexture()},this.initRenderTarget=function(S){Be.get(S).__webglFramebuffer===void 0&&ze.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?ze.setTextureCube(S,0):S.isData3DTexture?ze.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?ze.setTexture2DArray(S,0):ze.setTexture2D(S,0),ve.unbindTexture()},this.resetState=function(){G=0,B=0,ne=null,ve.reset(),he.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=st._getDrawingBufferColorSpace(e),t.unpackColorSpace=st._getUnpackColorSpace()}}const Qc=`precision highp float;
in vec3 position;in vec2 uv;uniform mat4 projectionMatrix,modelViewMatrix;uniform vec2 size,warpBounds;uniform bool warped;out vec2 texUV,localPoint;
void main(){texUV=uv;localPoint=position.xy*size;if(warped)localPoint.x=mix(warpBounds.x,warpBounds.y,position.x);gl_Position=projectionMatrix*modelViewMatrix*vec4(localPoint,0.,1.);}`,Wv=`precision highp float;
uniform sampler2D image,palette;uniform bool indexed,maskZero;uniform vec2 coefficients;uniform float opacity;
uniform bool warped;uniform vec4 warpEdges;uniform vec2 size;uniform int fxCount;uniform vec3 fxAdd[8],fxMul[8],fxPost[8];uniform vec2 fxColorInvert[8];in vec2 texUV,localPoint;out vec4 result;
void main(){vec2 sampleUV=texUV;if(warped){vec2 edges=mix(warpEdges.xy,warpEdges.zw,clamp(localPoint.y/size.y,0.,1.));float span=edges.y-edges.x;if(abs(span)<.00001)discard;float u=(localPoint.x-edges.x)/span;if(u<0.||u>=1.)discard;sampleUV=vec2(u,localPoint.y/size.y);}vec4 color;if(indexed){int i=int(floor(texture(image,sampleUV).r*255.+.5));if(i==0&&maskZero)discard;color=texelFetch(palette,ivec2(i,0),0);if(i==0)color.a=1.;}else{color=texture(image,sampleUV);}if(color.a<=0.)discard;
vec3 rgb=color.rgb*255.;for(int i=0;i<8;i++){if(i>=fxCount)break;float grey=dot(rgb,vec3(.299,.587,.114));rgb=mix(vec3(grey),rgb,fxColorInvert[i].x);if(fxColorInvert[i].y>.5)rgb=255.-rgb;rgb=clamp((rgb+fxAdd[i])*fxMul[i]+fxPost[i],0.,255.);}
rgb=floor(rgb+.00001)/255.;float coverage=color.a*opacity;result=vec4(rgb*coefficients.x*coverage,coverage*(1.-coefficients.y));}`,Xv=`precision highp float;uniform float ground;in vec2 texUV;out vec4 result;
void main(){vec2 p=vec2(texUV.x*960.,texUV.y*540.);vec3 color=vec3(.047,.067,.106);float h=ground-105.;if(p.y>h){float distance=p.y-h+16.;float x=(p.x-480.)*100./distance;float lines=min(abs(fract(x/80.+.5)-.5)*distance/100.,abs(fract(log(distance/16.)*3.)-.5)*distance*.18);color=mix(vec3(.105,.153,.215),color,smoothstep(.35,1.1,lines));}if(abs(p.y-ground)<.6)color=vec3(.27,.38,.33);result=vec4(color,1.);}`,qv=()=>({add:Array.from({length:8},()=>[0,0,0]),mul:Array.from({length:8},()=>[1,1,1]),post:Array.from({length:8},()=>[0,0,0]),color:Array.from({length:8},()=>[1,0])});class Yv{constructor(e,{maxTextureBytes:t=64*1024*1024,preserveDrawingBuffer:i=!1}={}){this.renderer=new Gv({canvas:e,alpha:!1,antialias:!1,powerPreference:"high-performance",preserveDrawingBuffer:i}),this.renderer.debug.onShaderError=(a,o)=>{throw Error("Sprite shader could not compile: "+a.getProgramInfoLog(o))},this.renderer.outputColorSpace=As,this.renderer.sortObjects=!1,this.renderer.setClearColor(790811,1),this.canvas=e,this.contextLost=a=>{a.preventDefault(),this.lost=!0},e.addEventListener("webglcontextlost",this.contextLost),this.limit=t,this.textureBudgetGovernor=new Pd({initialBytes:this.limit,maxBytes:t===64*ys?96*ys:this.limit}),this.textureBytes=0,this.textureBreakdown={indexed:0,palette:0,rgba:0},this.textures=new Map,this.evictedTextures=0,this.deferredTextures=0,this.slots=[],this.frames=0,this.scene=new Yf,this.camera=new Qo(0,960,0,540,-10,10),this.camera.position.z=1,this.geometry=new Ti,this.geometry.setAttribute("position",new Zt([0,0,0,1,0,0,0,1,0,1,1,0],3)),this.geometry.setAttribute("uv",new Zt([0,0,1,0,0,1,1,1],2)),this.geometry.setIndex([0,1,2,2,1,3]);const s=new Po({glslVersion:Dr,vertexShader:Qc,fragmentShader:Xv,uniforms:{size:{value:[960,540]},ground:{value:450},warped:{value:!1},warpBounds:{value:[0,0]}},side:fi,depthTest:!1,depthWrite:!1});this.grid=new ri(this.geometry,s),this.grid.frustumCulled=!1,this.scene.add(this.grid),this.upload({id:"@white",width:1,height:1,indexed:!1,pixels:new Uint8Array([255,255,255,255])});const r=new Uint8Array(256);for(let a=0;a<8;a++)for(let o=0;o<8;o++)if(o===3||a===3||Math.abs(o-3)===Math.abs(a-3)){const l=(a*8+o)*4;r.set([255,240,130,255],l)}this.upload({id:"@spark",width:8,height:8,pixels:r})}makeRoomFor(e,t=new Set){var s,r,a;const i=Cd(this.textures,this.textureBytes,e,this.limit,t);if(!i)return!1;for(const o of i){const l=this.textures.get(o);if(!l)continue;const c=((s=l.userData)==null?void 0:s.residentBytes)??((r=l.userData)==null?void 0:r.videoBytes)??0,h=(a=l.userData)==null?void 0:a.kind;l.dispose(),this.textureBytes-=c,this.textureBreakdown||(this.textureBreakdown={indexed:0,palette:0,rgba:0,video:0});const f=h==="indexed8"?"indexed":h==="rgba8"?"rgba":h==="palette"?"palette":h==="video"?"video":null;f&&(this.textureBreakdown[f]=Math.max(0,(this.textureBreakdown[f]||0)-c)),this.textures.delete(o),this.evictedTextures++}return!0}upload(e,t=new Set){if(this.textures.has(e.id))return!0;const i=e.role==="palette"||!e.indexed&&typeof e.id=="string"&&e.id.includes(":pal:"),s=i?"palette":e.indexed?"indexed8":"rgba8",r=e.pixels,a=e.width*e.height*(s==="indexed8"?1:4);if(!Number.isSafeInteger(e.width)||!Number.isSafeInteger(e.height)||e.width<1||e.height<1)throw Error("Invalid GPU asset dimensions.");if(e.width>this.renderer.capabilities.maxTextureSize||e.height>this.renderer.capabilities.maxTextureSize)throw Error("Sprite exceeds this graphics device’s texture limit.");if(!Number.isSafeInteger(a)||!(r instanceof Uint8Array)||r.length!==a)throw Error("Invalid GPU asset dimensions.");if(i&&(e.indexed||e.width!==256||e.height!==1))throw Error("A GPU palette must be a 256x1 RGBA8 texture.");if(!this.makeRoomFor(r.length,t))return this.deferredTextures++,!1;const o=new $n(r,e.width,e.height,s==="indexed8"?zr:si,Wt);return o.internalFormat=s==="indexed8"?"R8":"RGBA8",o.colorSpace=Ui,o.minFilter=o.magFilter=Tt,o.wrapS=o.wrapT=Kt,o.generateMipmaps=!1,o.flipY=!1,o.unpackAlignment=1,o.needsUpdate=!0,o.userData.residentBytes=r.length,o.userData.kind=s,this.textures.set(e.id,o),this.textureBytes+=r.length,this.textureBreakdown||(this.textureBreakdown={indexed:0,palette:0,rgba:0}),this.textureBreakdown[s==="indexed8"?"indexed":s==="palette"?"palette":"rgba"]+=r.length,!0}resolveDrawTextures(e){const t=this.textures.get(e.texture);if(!t)return null;const i=t.userData.kind;if(e.indexed){if(i!=="indexed8")return null;const s=this.textures.get(e.palette);return(s==null?void 0:s.userData.kind)==="palette"?{image:t,palette:s}:null}return i==="indexed8"||i==="palette"?null:{image:t,palette:this.textures.get("@white")}}slot(e){if(this.slots[e])return this.slots[e];const t=qv(),i=new Po({glslVersion:Dr,vertexShader:Qc,fragmentShader:Wv,uniforms:{image:{value:null},palette:{value:null},indexed:{value:!1},maskZero:{value:!0},size:{value:[1,1]},warped:{value:!1},warpEdges:{value:[0,1,0,1]},warpBounds:{value:[0,1]},coefficients:{value:[1,0]},opacity:{value:1},fxCount:{value:0},fxAdd:{value:t.add.flat()},fxMul:{value:t.mul.flat()},fxPost:{value:t.post.flat()},fxColorInvert:{value:t.color.flat()}},transparent:!0,depthTest:!1,depthWrite:!1,blending:lh,blendSrc:za,blendDst:Rr,blendEquation:Di,blendEquationAlpha:Di,blendSrcAlpha:za,blendDstAlpha:Rr});i.side=fi,i.forceSinglePass=!0;const s=new ri(this.geometry,i);return s.matrixAutoUpdate=!1,s.frustumCulled=!1,s.onBeforeRender=()=>{const r=s.userData.clip,a=this.renderer,o=this.canvas.width/960;a.setScissorTest(!!r),r&&a.setScissor(r[0]*o,(540-r[1]-r[3])*o,r[2]*o,r[3]*o),i.uniformsNeedUpdate=!0},this.scene.add(s),this.slots[e]=s,s}updateVideo(e){const t=e.bitmap;try{if(this.closed||this.lost)return!1;const i=t.width*t.height*4;if(t.width<1||t.height<1||t.width>1280||t.height>720)throw Error("Invalid stage video frame dimensions.");let s=this.textures.get(e.id);if(s&&s.userData.kind!=="video")throw Error("Stage video texture ID conflicts with an existing sprite.");const r=(s==null?void 0:s.userData.videoBytes)||0,a=new Set(this.activeTextureIds||[]);return a.add(e.id),this.makeRoomFor(Math.max(0,i-r),a)?(s||(s=new Nt,s.generateMipmaps=!1,s.wrapS=s.wrapT=Kt,s.flipY=!1,this.textures.set(e.id,s)),s.minFilter=s.magFilter=e.filter==="neighbor"?Tt:It,s.image=t,s.needsUpdate=!0,this.renderer.initTexture(s),s.userData.videoBytes=i,s.userData.kind="video",this.textureBytes+=i-r,this.textureBreakdown||(this.textureBreakdown={indexed:0,palette:0,rgba:0,video:0}),this.textureBreakdown.video=(this.textureBreakdown.video||0)+i-r,this.videoUploads=(this.videoUploads||0)+1,!0):(this.deferredVideoFrames=(this.deferredVideoFrames||0)+1,!1)}finally{t==null||t.close()}}async loadStage(e,t){var r;if(!((r=e==null?void 0:e.model)!=null&&r.path)||this.closed)return!1;const{ModelStage:i}=await Do(async()=>{const{ModelStage:a}=await import("./model-stage-DypuxApQ.js");return{ModelStage:a}},__vite__mapDeps([3,1,2]),import.meta.url);if(this.closed)return!1;const s=await i.load(e,t,this.renderer,{textureBudget:Math.min(32*1024*1024,this.limit-this.textureBytes)});return this.closed?(s==null||s.close(),!1):(this.model=s,this.textureBytes+=(s==null?void 0:s.textureBytes)||0,!!s)}render(e,{width:t=960,height:i=540,restoreAssets:s=null}={}){var h,f,d,u,m,v,g,p,M,T,E,R,b,_;if(this.closed)return;if(this.lost)throw Error("Graphics context was lost. Start the match again from your library.");(this.canvas.width!==t||this.canvas.height!==i)&&this.renderer.setSize(t,i,!1);const r=Ld(e.draws),a=r.visible,o=new Set(["@white","@spark"]);for(const y of a)y.texture&&o.add(y.texture),y.indexed&&y.palette&&o.add(y.palette);this.activeTextureIds=o;for(const y of e.assets||[])o.has(y.id)&&this.upload(y,o);let l=[...o].filter(y=>!this.textures.has(y));if(l.length&&s){for(const y of s(l)||[])o.has(y.id)&&this.upload(y,o);l=l.filter(y=>!this.textures.has(y))}for(const y of o){const N=this.textures.get(y);N&&(this.textures.delete(y),this.textures.set(y,N))}this.missingFrameTextures=l.length,this.missingPaletteDraws=0,this.grid.visible=!!e.grid,this.grid.material.uniforms.ground.value=e.ground||450;const c=a.concat((e.sparks||[]).map(y=>{const N=(12-y.age)*.3+1;return{texture:"@spark",indexed:!1,width:8,height:8,matrix:[N,0,0,N,y.x-4*N,y.y-4*N],blend:{mode:"add",source:1,destination:1},alpha:(12-y.age)/12}}));for(let y=0;y<Math.max(c.length,this.slots.length);y++){if(y>=c.length){this.slots[y].visible=!1;continue}const N=c[y],I=this.slot(y),D=I.material.uniforms;I.visible=!0,I.layers.set((N.pass??1)+1);const F=this.resolveDrawTextures(N);if(!F){N.indexed&&this.textures.has(N.texture)&&this.missingPaletteDraws++,I.visible=!1;continue}if(D.image.value=F.image,D.palette.value=F.palette,D.indexed.value=!!N.indexed,D.maskZero.value=N.mask!==!1,D.size.value[0]=N.width,D.size.value[1]=N.height,D.warped.value=!!N.warp,N.warp){for(let J=0;J<4;J++)D.warpEdges.value[J]=N.warp[J];D.warpBounds.value[0]=Math.min(...N.warp),D.warpBounds.value[1]=Math.max(...N.warp)}D.opacity.value=N.alpha??1,D.coefficients.value[0]=((h=N.blend)==null?void 0:h.source)??1,D.coefficients.value[1]=((f=N.blend)==null?void 0:f.destination)??0;const[W,A,H,G,B,ne]=N.matrix;I.matrix.set(W,H,0,B,A,G,0,ne,0,0,1,0,0,0,0,1),I.matrixWorldNeedsUpdate=!0,I.userData.clip=N.clip,I.material.blendEquation=((d=N.blend)==null?void 0:d.mode)==="subtract"?ch:Di;const q=N.palFX||[];D.fxCount.value=Math.min(8,q.length);for(let J=0;J<D.fxCount.value;J++){const ie=q[J],Te=ie.sinadd||[],Fe=Te[3]?Math.sin(2*Math.PI*(ie.age||0)/Te[3]):0;D.fxColorInvert.value[J*2]=(ie.color??256)/256,D.fxColorInvert.value[J*2+1]=ie.invertall?1:0;for(let K=0;K<3;K++)D.fxAdd.value[J*3+K]=(((u=ie.add)==null?void 0:u[K])||0)+(Te[K]||0)*Fe,D.fxMul.value[J*3+K]=(((m=ie.mul)==null?void 0:m[K])??256)/256,D.fxPost.value[J*3+K]=((v=ie.postadd)==null?void 0:v[K])||0}}if(this.renderer.setScissorTest(!1),this.model&&e.model){this.renderer.autoClear=!1,this.renderer.clear(),this.model.update(e.model);for(const y of[-1,0,1,2])y<1&&this.model.render(y),y===2&&this.model.render(1),this.camera.layers.set(y+1),this.renderer.render(this.scene,this.camera),this.renderer.setScissorTest(!1);this.renderer.autoClear=!0}else this.camera.layers.enableAll(),this.renderer.render(this.scene,this.camera);return this.renderer.setScissorTest(!1),this.frames++,this.limit=this.textureBudgetGovernor.observe({frames:this.frames,evictions:this.evictedTextures,residentBytes:this.textureBytes}),this.stats={backend:"Kenjatime Core · Three.js",frames:this.frames,draws:c.length,submittedDraws:(((g=e.draws)==null?void 0:g.length)||0)+(((p=e.sparks)==null?void 0:p.length)||0),offscreenCulledDraws:r.culled,textureBytes:this.textureBytes,textureBudgetBytes:this.limit,textureBudgetUpgrades:this.textureBudgetGovernor.upgrades,textures:this.textures.size,textureEvictions:this.evictedTextures,deferredTextures:this.deferredTextures,missingFrameTextures:this.missingFrameTextures||0,missingPaletteDraws:this.missingPaletteDraws||0,indexedTextureBytes:((M=this.textureBreakdown)==null?void 0:M.indexed)||0,paletteTextureBytes:((T=this.textureBreakdown)==null?void 0:T.palette)||0,truecolorTextureBytes:((E=this.textureBreakdown)==null?void 0:E.rgba)||0,videoTextureBytes:((R=this.textureBreakdown)==null?void 0:R.video)||0,deferredVideoFrames:this.deferredVideoFrames||0,indexedRawBytesSaved:(((b=this.textureBreakdown)==null?void 0:b.indexed)||0)*3,width:t,height:i,videoUploads:this.videoUploads||0,model:!!this.model,shadowUpdates:((_=this.model)==null?void 0:_.shadowUpdates)||0},this.stats}close(){var e,t;if(!this.closed){this.closed=!0,(e=this.model)==null||e.close(),this.canvas.removeEventListener("webglcontextlost",this.contextLost);for(const i of this.textures.values())i.dispose();for(const i of this.slots)i.material.dispose();this.grid.material.dispose(),this.geometry.dispose(),this.renderer.dispose(),this.renderer.forceContextLoss(),this.textures.clear(),(t=this.activeTextureIds)==null||t.clear()}}}const br=60,Da=1e6;class $v{constructor({maxTicks:e=12}={}){if(!Number.isInteger(e)||e<1||e>1024)throw Error("Invalid maximum simulation ticks per callback.");this.maxTicks=e,this.reset()}reset(){this.tickCount=0,this.lastRender=null,this.suspend()}suspend(){this.last=null,this.lastUs=null,this.epochUs=null,this.elapsedUs=0,this.epochTicks=0,this.speed=null,this.debt=0,this.lastRender=null}advance(e,{running:t=!0,speed:i=1}={},s=()=>{}){if(!Number.isFinite(e)||!Number.isFinite(i)||i<=0)throw Error("Invalid frame clock time or speed.");const r=Math.round(e*1e3);if(!Number.isSafeInteger(r))throw Error("Frame clock timestamp is out of range.");const a=this.lastUs===null?r:Math.max(this.lastUs,r);if(!t)return this.suspend(),this.lastUs=a,this.epochUs=a,this.speed=i,this.last=a/1e3,0;if(this.lastUs===null||this.speed!==i)return this.suspend(),this.lastUs=a,this.epochUs=a,this.speed=i,this.last=a/1e3,0;const o=a-this.lastUs;this.lastUs=a,this.last=a/1e3,this.elapsedUs+=o*i;const l=Math.floor(this.elapsedUs*br/Da),c=Math.min(this.maxTicks,Math.max(0,l-this.epochTicks));for(let h=0;h<c;h++){const f=this.epochTicks+1,d=this.epochUs+Math.ceil(f*Da/(br*i));s(d/1e3),this.epochTicks++,this.tickCount++}return this.debt=Math.max(0,this.elapsedUs*br/Da-this.epochTicks),c}renderDue(e,t=60){return this.lastRender===null||e-this.lastRender>=1e3/t-.25?(this.lastRender=e,!0):!1}}class Kv{constructor(e,t=globalThis){this.callback=e,this.host=t,this.handle=null,this.timer=!1}schedule({timer:e=!1,catchUp:t=!1,idle:i=!1}={}){this.cancel(),this.timer=e||t||i||typeof this.host.requestAnimationFrame!="function";const s=r=>{this.handle=null,this.callback(r)};this.handle=this.timer?this.host.setTimeout(()=>s(this.host.performance.now()),t?0:i?100:1e3/60):this.host.requestAnimationFrame(s)}cancel(){this.handle!==null&&(this.timer?this.host.clearTimeout(this.handle):this.host.cancelAnimationFrame(this.handle),this.handle=null)}}class Zv{constructor({minScale:e=.5,maxScale:t=1,windowMs:i=1500}={}){this.minScale=e,this.maxScale=t,this.windowMs=i,this.reset()}reset(){this.scale=this.maxScale,this.suspend()}suspend(){this.first=null,this.frames=0,this.cpuMs=0,this.lastFps=null}observe(e,t,{eligible:i=!0}={}){if(!i||!Number.isFinite(e)||!Number.isFinite(t))return this.suspend(),this.scale;if(this.first===null)return this.first=e,this.frames=1,this.cpuMs=t,this.scale;this.frames++,this.cpuMs+=t;const s=e-this.first;if(s<this.windowMs)return this.scale;const r=(this.frames-1)*1e3/Math.max(s,1),a=this.cpuMs/this.frames;return this.lastFps=r,r<42||a>18?this.scale=Math.max(this.minScale,this.scale-.1):r<53||a>15?this.scale=Math.max(this.minScale,this.scale-.07):r<57?this.scale=Math.max(this.minScale,this.scale-.03):r>=59.2&&a<11&&(this.scale=Math.min(this.maxScale,this.scale+.02)),this.scale=Math.round(this.scale*100)/100,this.first=null,this.frames=0,this.cpuMs=0,this.scale}}const Jv=60,jv=30;function eh(n,e=2){const t=Number.isFinite(n)&&n>=1,i=Number.isFinite(e)&&e>0?e:2,s=Math.max(1,Math.min(4,Math.floor(10/Math.max(.5,i))));return{backlog:t,batchLimit:s,renderFps:t?jv:Jv}}function Qv(n,e){return!Number.isFinite(e)||e<=0?Number.isFinite(n)&&n>0?n:2:(Number.isFinite(n)&&n>0?n:e)*.75+e*.25}function ex(n,e,{hidden:t=!1,paused:i=!1,dirty:s=!1,renderFps:r=60}={}){return!t&&(!i||s)&&n.renderDue(e,r)}function tx(n){let e,t,i=!1,s=!1,r=!1,a=!0,o=!1,l=!0,c=-1/0,h=1,f="auto",d,u,m,v=1,g=!0,p=!1,M=0,T=0,E=0,R=2,b=0,_=60,y=4;const N=new $v,I=[new Ml,new Ml],D=new Map,F=new Set,W=new Map,A=new Zv,H=new Map,G=new Set;function B(){var P,se;const $=e==null?void 0:e.match.stage;if(!$)return;const Me=e.match,C=((P=Me.superPause)==null?void 0:P.remaining)>0||((se=Me.pause)==null?void 0:se.remaining)>0&&Me.pause.pausebg!==0;for(const ue of $.elements)if(ue.video){const re={type:"video-control",id:ue.video.key,playing:!r&&!C&&ue.enabled&&!G.has(ue.video.key),visible:ue.visible,captureVisible:!o,epoch:$.generation||0},be=JSON.stringify(re),Ae=H.get(re.id);(Ae==null?void 0:Ae.signature)!==be&&(re.reset=Ae&&Ae.epoch!==re.epoch,H.set(re.id,{signature:be,epoch:re.epoch}),n(re))}}const ne=new Kv(Fe),q=()=>ne.schedule({timer:o||!l,catchUp:!r&&N.debt>=1,idle:r});function J($){const Me=new Float32Array($);if(Me.fill(0),m&&!r&&!p){let C=0;for(;C<Me.length/2;){let P=m.read(Math.min(2048,Me.length/2-C));if(!P&&(!g||(m.seek(0),P=m.read(Math.min(2048,Me.length/2-C)),!P)))break;Me.set(new Float32Array(m.pcm.buffer,m.pcm.byteOffset,P*2),C*2),C+=P}if(v!==1)for(let P=0;P<Me.length;P++)Me[P]*=v}d==null||d.postMessage({buffer:$},[$])}function ie(){var $,Me,C;for(const P of e.drainEvents()){if(P.type==="playsnd")try{const se=e.characters.find(Ae=>Ae.path===P.character),ue=P.common?e.commonEffects.soundPath:($=se==null?void 0:se.checks.find(Ae=>Ae.key==="sound"&&Ae.ok))==null?void 0:$.path;if(!ue){P.common&&e.issue("common-sound","Common sound requested, but the imported pack has no common.snd.");continue}D.has(ue)||D.set(ue,Du(e.files[ue]));const re=P.group??((Me=P.value)==null?void 0:Me[0]),be=P.number??((C=P.value)==null?void 0:C[1]);if(P.soundKey=ue+":"+re+","+be,W.set(P.soundKey,{path:ue,group:re,number:be}),!F.has(P.soundKey)){const Ae=D.get(ue).get(re,be);if(!Ae)continue;P.bytes=Ae.slice(),F.add(P.soundKey)}}catch(se){e.issue("sound",se.message);continue}n({type:"sound",event:P},P.bytes?[P.bytes.buffer]:[])}}function Te(){const $=e.match.entities.some(Me=>!Me.destroyed&&Me.asserted.has("nomusic"));$!==p&&(p=$,n({type:"music-suppression",value:$}))}function Fe($){if(!i)try{const Me=eh(N.debt,R);N.maxTicks=Me.batchLimit,y=Me.batchLimit;const C=performance.now();E=N.advance($,{running:!r},se=>{const ue=performance.timeOrigin+se;e.tick(I[0].sample(ue),I[1].sample(ue)),Te(),ie()}),M=performance.now()-C,T=E>0?M/E:0,E>0&&(R=Qv(R,T)),B();const P=eh(N.debt,R);if(_=P.renderFps,ex(N,$,{hidden:o,paused:r,dirty:a,renderFps:P.renderFps})){P.backlog&&b++;const se=performance.now(),ue=e.frame();t.render(ue,{width:Math.round(960*h),height:Math.round(540*h),restoreAssets:be=>e.restoreAssets(be)});const re=performance.now()-se;t.stats&&(t.stats.frameCpuSubmitMs=re),a=!1,f==="auto"&&(h=A.observe($,re,{eligible:!ue.assets.length&&!r&&!o&&l&&!P.backlog}))}$-c>=100&&(c=$,n({type:"state",state:{...e.snapshot(),paused:r,background:o,focused:l,simulationDebt:N.debt,simulationHz:br,simulationTicks:N.tickCount,simulationBacklogTicks:Math.floor(N.debt),simulationCpuMs:M,simulationTickCpuMs:T,simulationBatchTicks:E,simulationBatchLimit:y,renderTargetFps:_,renderWithBacklogCount:b,resolutionScale:h,renderQuality:f},gpu:t.stats})),q()}catch(Me){n({type:"error",message:Me.message}),we()}}async function K({files:$,selection:Me,canvas:C,sampleRate:P=48e3,quality:se="auto"}){var Ae,Re,je,We,Ge;if(f=bl(se),h=El(f),t||De(C),e=new Rd($,Me),await e.initializeScripts(),i)return;try{e.modelReady=await t.loadStage((Ae=e.match.stage)==null?void 0:Ae.definition,$)}catch(ct){i||e.issue("stage-model",ct.message)}if(i)return;let ue=0;const re=new Set;for(const ct of((Re=e.match.stage)==null?void 0:Re.elements)||[])if((je=ct.video)!=null&&je.path){const _t=re.has(ct.video.path)?null:(We=$[ct.video.path])==null?void 0:We.slice();if(_t&&(ue+=_t.length),ue>64*1024*1024){G.add(ct.video.key),e.issue("stage-video","Stage video source budget (64 MiB) exceeded.");continue}re.add(ct.video.path),n({type:"video-init",id:ct.video.key,...ct.video,bytes:_t},_t?[_t.buffer]:[])}const be=(Ge=e.match.stage)==null?void 0:Ge.definition.music;if(be!=null&&be.path&&$[be.path])if(/\.(mod|xm|it|s3m)$/i.test(be.path)){const{createModuleMusic:ct}=await Do(async()=>{const{createModuleMusic:Vt}=await import("./module-music-C2Wy91BT.js");return{createModuleMusic:Vt}},[],import.meta.url);if(i)return;const _t=await ct();if(i){_t.close();return}u=_t,m=u.open($[be.path],P),v=Math.max(0,Math.min(2,be.volume/100)),g=be.loop,n({type:"audio-init",sampleRate:P})}else{const ct=$[be.path].slice();n({type:"music",bytes:ct,path:be.path,volume:be.volume,loop:be.loop},[ct.buffer])}i||(s=!0,n({type:"ready",capabilities:e.capabilities}),q())}function me($){var Me,C,P;if(i){$.type==="video-frame"&&((Me=$.bitmap)==null||Me.close());return}if($.type==="video-frame"){try{t.updateVideo($)&&e.videoSprites.set($.id,{id:$.id,w:$.sourceWidth,h:$.sourceHeight,x:0,y:0,indexed:!1}),a=!0}catch(se){G.add($.id),e.issue("stage-video",se.message)}n({type:"video-ack",id:$.id});return}if($.type==="media-warning"){e==null||e.issue("stage-video",String($.message));return}if($.type==="visibility"){o=!!$.hidden,l=$.focused!==!1,o||(a=!0),A.suspend(),s&&B(),s&&q();return}if($.type==="release-inputs"){I.forEach(se=>se.reset());return}if($.type==="sound-request"){try{const se=W.get($.key),ue=se&&((P=(C=D.get(se.path))==null?void 0:C.get(se.group,se.number))==null?void 0:P.slice());if(!ue)throw Error("Sound is unavailable.");n({type:"sound-data",key:$.key,bytes:ue},[ue.buffer])}catch(se){n({type:"sound-data",key:$.key,error:se.message})}return}if($.type==="input"&&Array.isArray($.keys)&&I[$.side===1?1:0].record($.source||"keyboard",$.keys,$.time??performance.timeOrigin+performance.now()),$.type==="pause"&&(r=!!$.value,I.forEach(se=>se.reset()),N.suspend(),A.suspend(),a=!0,s&&q()),$.type==="presentation"){e&&e.setPresentation(Ua($.value)),a=!0,s&&q();return}$.type==="quality"&&(f=bl($.value),h=El(f),A.reset(),a=!0),$.type==="audio-port"&&(d=$.port,d.onmessage=({data:se})=>{!i&&se.buffer instanceof ArrayBuffer&&se.buffer.byteLength===8192&&J(se.buffer)},d.start()),$.type==="stop"&&we()}function we(){i||(i=!0,ne.cancel(),d==null||d.close(),u==null||u.close(),e==null||e.close(),t==null||t.close(),d=u=m=e=t=null,D.clear(),F.clear(),W.clear(),I.forEach($=>$.reset()))}function De($){if(i)throw Error("Match cancelled.");t||(t=new Yv($))}return{start:K,prepare:De,control:me,stop:we,snapshot:()=>e==null?void 0:e.snapshot(),get gpu(){return t==null?void 0:t.stats}}}const Ex=Object.freeze(Object.defineProperty({__proto__:null,createCoreRuntime:tx},Symbol.toStringTag,{value:"Module"}));export{Tc as $,dt as A,Ti as B,Ze as C,yx as D,cx as E,Lp as F,ri as G,ux as H,hx as I,kh as J,dx as K,Qn as L,px as M,zs as N,St as O,xx as P,yi as Q,$a as R,ti as S,nx as T,fx as U,rt as V,Gs as W,ii as X,ax as Y,Qo as Z,Bh as _,rx as a,ap as a0,Ir as a1,Ao as a2,Nt as a3,Yh as a4,Zo as a5,Jo as a6,st as a7,pn as a8,Ls as a9,sn as aa,Vi as ab,mx as ac,bi as ad,ni as ae,ox as af,Cp as ag,Yf as ah,Ss as ai,zl as aj,kl as ak,Bl as al,_x as am,$n as an,si as ao,ia as ap,bx as aq,tf as ar,nf as as,_r as at,Ex as au,sx as b,Sx as c,As as d,vx as e,et as f,X as g,uc as h,gx as i,Mx as j,Hi as k,lx as l,Oh as m,Oi as n,sa as o,ef as p,It as q,Tt as r,Ka as s,Kt as t,up as u,_n as v,hp as w,gp as x,fi as y,np as z};
