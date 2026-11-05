import {decodeText,ini,animations,packagePath} from './formats.js';
import {parseSections} from './runtime.js';

const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const number=(v,fallback=0)=>v===undefined||v===''?fallback:Number(v);
const vector=(v,fallback=[0,0])=>v===undefined?[...fallback]:String(v).split(',').map((n,i)=>number(n.trim(),fallback[i]??0));
const words=v=>String(v??'').replace(/^"(.*)"$/,'$1');
const BG_TYPES=new Set(['normal','anim','parallax','dummy']);
const CTRL_TYPES=new Set(['null','anim','visible','enable','posset','posadd','velset','veladd','sinx','siny']);

export function stageDefinitions(files){
  const stages=[];
  for(const path of Object.keys(files).filter(p=>p.endsWith('.def'))){
    const text=decodeText(files[path]),def=ini(text);if(!def.bgdef)continue;
    try{stages.push(parseStage(path,files,text,def));}
    catch(error){stages.push({path,name:def.info?.displayname||def.info?.name||path,files,invalid:true,diagnostics:[{source:path,line:0,type:'stage',message:error.message}]});}
  }
  return stages;
}

export function parseStage(path,files,text=decodeText(files[path]),def=ini(text)){
  const diagnostics=[],report=(message,section,type='stage')=>diagnostics.push({source:path,line:section?.line||0,type,message});
  const base=path.slice(0,path.lastIndexOf('/')+1),marker=path.indexOf('/stages/'),engineRoot=marker>=0?path.slice(0,marker+1):'';
  const resolve=value=>[base,engineRoot,''].map(root=>{try{return packagePath(value,root,true);}catch{return null;}}).find(p=>p&&files[p]);
  const localcoord=vector(def.stageinfo?.localcoord,[320,240]);
  if(localcoord.length!==2||localcoord.some(v=>!Number.isFinite(v)||v<=0))throw Error('Invalid stage localcoord.');
  const coordinateScale=320/localcoord[0],c=def.camera||{},p=def.playerinfo||{},b=def.bound||{},s=def.stageinfo||{};
  const read=(values,key,fallback)=>{const n=number(values[key],fallback);if(!Number.isFinite(n))throw Error(`Invalid stage numeric value ${key}.`);return n;};
  const camera={startX:read(c,'startx',0)*coordinateScale,startY:read(c,'starty',0)*coordinateScale,
    left:read(c,'boundleft',0)*coordinateScale,right:read(c,'boundright',0)*coordinateScale,
    high:read(c,'boundhigh',-25)*coordinateScale,low:read(c,'boundlow',0)*coordinateScale,
    tension:Math.max(0,read(c,'tension',60)*coordinateScale),floorTension:read(c,'floortension',0)*coordinateScale,
    verticalFollow:clamp(read(c,'verticalfollow',.2),0,1),zoomIn:read(c,'zoomin',1),zoomOut:read(c,'zoomout',1),startZoom:read(c,'startzoom',1)};
  if(camera.left>camera.right||camera.high>camera.low||camera.zoomOut<=0||camera.zoomIn<camera.zoomOut)throw Error('Invalid stage camera bounds or zoom limits.');
  const spritePath=def.bgdef.spr?resolve(def.bgdef.spr):null;if(!spritePath)report(`Stage sprite file is missing: ${def.bgdef.spr||'(unspecified)'}`);
  const stage={path,name:def.info?.displayname||def.info?.name||path,files,def,localcoord,coordinateScale,camera,
    sprite:spritePath?{path:spritePath}:null,animations:animations(text),elements:[],controllers:[],diagnostics,
    leftBound:read(p,'leftbound',-1000)*coordinateScale,rightBound:read(p,'rightbound',1000)*coordinateScale,
    starts:[1,2].map(i=>({x:read(p,`p${i}startx`,i===1?-70:70)*coordinateScale,y:read(p,`p${i}starty`,0)*coordinateScale,facing:read(p,`p${i}facing`,i===1?1:-1)<0?-1:1})),
    screenLeft:Math.max(0,read(b,'screenleft',15)*coordinateScale),screenRight:Math.max(0,read(b,'screenright',15)*coordinateScale),
    zoffset:read(s,'zoffset',200)*coordinateScale,resetBG:read(s,'resetbg',1)!==0,autoturn:read(s,'autoturn',1)!==0,
    xscale:read(s,'xscale',1),yscale:read(s,'yscale',1),zoffsetlink:s.zoffsetlink===undefined?null:read(s,'zoffsetlink',0),
    cropHigh:Math.max(0,read(c,'cuthigh',0)*coordinateScale),cropLow:Math.max(0,read(c,'cutlow',0)*coordinateScale),
    music:{path:def.music?.bgmusic?resolve(def.music.bgmusic):null,requested:def.music?.bgmusic||'',volume:read(def.music||{},'bgmvolume',100),loop:read(def.music||{},'bgmloop',1)!==0,loopStart:read(def.music||{},'bgmloopstart',0),loopEnd:read(def.music||{},'bgmloopend',0)}};
  stage.shadow={intensity:clamp(read(def.shadow||{},'intensity',128),0,256),color:vector(def.shadow?.color,[0,0,0]),yscale:read(def.shadow||{},'yscale',.4),fade:def.shadow?.['fade.range']?vector(def.shadow['fade.range']):null};
  stage.reflection=clamp(read(def.reflection||{},'intensity',0),0,256);
  if(stage.leftBound>=stage.rightBound)throw Error('Invalid stage player bounds.');
  if(stage.music.requested&&!stage.music.path)report(`Stage music is missing: ${stage.music.requested}`);
  let group={ids:null,loop:-1};
  const known=new Set(['type','spriteno','actionno','id','layerno','start','delta','trans','alpha','mask','velocity','tile','tilespacing','positionlink','sin.x','sin.y','window','maskwindow','windowdelta','xscale','width','yscalestart','yscaledelta','scalestart','scaledelta','zoomdelta']);
  for(const section of parseSections(text,path)){
    const v=section.values;
    if(/^bgctrldef(?:\s|$)/.test(section.name))group={ids:v.ctrlid===undefined?null:vector(v.ctrlid,[]),loop:read(v,'looptime',-1)};
    else if(/^bgctrl(?:\s|$)/.test(section.name)){
      const type=words(v.type).toLowerCase();if(!CTRL_TYPES.has(type)){report(`Background controller ${type} is not implemented.`,section,'unsupported-stage-controller');continue;}
      const time=vector(v.time,[0]);
      for(const [key,value]of Object.entries(v))if(key!=='type'&&vector(value,[]).some(n=>!Number.isFinite(n)))throw Error(`Invalid background controller ${key} at line ${section.line}.`);
      stage.controllers.push({type,time:[time[0],time[1]??time[0],time[2]??-1],groupLoop:group.loop,ids:v.ctrlid===undefined?group.ids:vector(v.ctrlid,[]),values:v,line:section.line});
    }else if(/^bg(?:\s|$)/.test(section.name)){
      const type=words(v.type||'normal').toLowerCase();if(!BG_TYPES.has(type)){report(`Background type ${type} is not implemented.`,section,'unsupported-stage');continue;}
      const animated=type==='anim'||type==='parallax'&&v.actionno!==undefined,trans=words(v.trans||'default').toLowerCase();
      const element={type,animated,id:read(v,'id',0),layer:read(v,'layerno',0),start:vector(v.start),delta:vector(v.delta,[1,1]),velocity:vector(v.velocity),
        spriteno:vector(v.spriteno),anim:read(v,'actionno',0),mask:animated||read(v,'mask',['add','sub'].includes(trans)?1:0)!==0,trans,alpha:vector(v.alpha,trans==='addalpha'?[256,0]:[256,256]),
        tile:vector(v.tile),spacing:vector(v.tilespacing),link:read(v,'positionlink',0)!==0,sinX:vector(v['sin.x'],[0,0,0]),sinY:vector(v['sin.y'],[0,0,0]),
        xscale:vector(v.xscale,[1,1]),width:v.width===undefined?null:vector(v.width),yScaleStart:read(v,'yscalestart',100)/100,yScaleDelta:read(v,'yscaledelta',0)/100,
        scaleStart:vector(v.scalestart,[1,1]),scaleDelta:vector(v.scaledelta),zoomDelta:read(v,'zoomdelta',1),
        window:v.maskwindow?vector(v.maskwindow,[]):v.window?vector(v.window,[]):null,windowCentered:!!v.maskwindow,windowDelta:vector(v.windowdelta),transSpecified:v.trans!==undefined,line:section.line};
      for(const [key,value]of Object.entries(element))if(Array.isArray(value)&&value.some(n=>!Number.isFinite(n)))throw Error(`Invalid background ${key} at line ${section.line}.`);
      for(const key of ['start','delta','velocity','spriteno','alpha','tile','spacing','xscale','scaleStart','scaleDelta','windowDelta'])if(element[key].length!==2)throw Error(`Invalid background ${key} at line ${section.line}.`);
      if(element.width&&element.width.length!==2||element.window&&element.window.length!==4)throw Error(`Invalid background dimensions at line ${section.line}.`);
      if(animated&&!stage.animations.some(a=>a.id===element.anim))report(`Stage action ${element.anim} is missing.`,section);
      if(animated&&element.tile.some((mode,i)=>mode&&element.spacing[i]<=0)&&type!=='parallax')report('Animated background tiling requires positive tilespacing.',section);
      if(type==='parallax'&&v.xscale!==undefined&&(animated||element.width))throw Error(`Parallax xscale cannot be combined with width or animation at line ${section.line}.`);
      for(const key of Object.keys(v))if(!known.has(key))report(`Background parameter ${key} is not implemented.`,section,'unsupported-stage-parameter');
      stage.elements.push(element);
    }
  }
  if(stage.elements.length>2048||stage.controllers.length>4096)throw Error('Stage background/controller limit exceeded.');
  return stage;
}

function sine(spec,t){return spec[1]>0?spec[0]*Math.sin(2*Math.PI*t/spec[1]+(spec[2]||0)*Math.PI/180):0;}

export class StageRuntime{
  constructor(definition){if(definition.invalid)throw Error(definition.diagnostics[0].message);this.definition=definition;this.animations=new Map(definition.animations.map(a=>[a.id,a]));this.diagnostics=[...definition.diagnostics];this.reset();}
  reset({backgrounds=true}={}){
    const d=this.definition;this.camera={x:clamp(d.camera.startX,d.camera.left,d.camera.right),y:clamp(d.camera.startY,d.camera.high,d.camera.low),zoom:clamp(d.camera.startZoom,d.camera.zoomOut,d.camera.zoomIn)};
    if(backgrounds||!this.elements){this.time=0;this.elements=d.elements.map(base=>({...base,start:[...base.start],motion:[0,0],velocity:[...base.velocity],sinX:[...base.sinX],sinY:[...base.sinY],sinStartX:0,sinStartY:0,anim:base.anim,frameIndex:0,frameTime:0,visible:true,enabled:true}));}
  }
  updateCamera(players){
    const d=this.definition,c=d.camera,xPlayers=players.filter(p=>p.moveCamera?.x!==false),yPlayers=players.filter(p=>p.moveCamera?.y!==false);
    if(xPlayers.length){
      const low=Math.min(...xPlayers.map(p=>p.pos.x)),high=Math.max(...xPlayers.map(p=>p.pos.x));
      this.camera.zoom=clamp(320/Math.max(1,high-low+2*c.tension),c.zoomOut,c.zoomIn);
      const half=Math.max(1,160/this.camera.zoom-c.tension),left=high-half,right=low+half;
      this.camera.x=clamp(left<=right?clamp(this.camera.x,left,right):(low+high)/2,c.left,c.right);
    }
    if(yPlayers.length)this.camera.y=clamp(Math.min(0,Math.min(...yPlayers.map(p=>p.pos.y))+c.floorTension)*c.verticalFollow,c.high,c.low);
  }
  view(aspect=16/9){
    const d=this.definition,height=d.cropHigh+d.cropLow?320/aspect:d.localcoord[1]*d.coordinateScale,crop=Math.max(0,d.localcoord[1]*d.coordinateScale-height),weight=d.cropHigh+d.cropLow?d.cropHigh/(d.cropHigh+d.cropLow):.5;
    let ground=d.zoffset;
    if(d.zoffsetlink!==null){const index=this.elements.findIndex(e=>e.id===d.zoffsetlink);if(index>=0)ground=this.position(index).y*d.coordinateScale;}
    const groundY=ground-crop*weight,width=320/this.camera.zoom,worldHeight=height/this.camera.zoom;
    return{left:this.camera.x-width/2,right:this.camera.x+width/2,top:this.camera.y-groundY/this.camera.zoom,bottom:this.camera.y+(height-groundY)/this.camera.zoom,width,height:worldHeight,displayHeight:height,groundY,zoffset:ground,cropTop:crop*weight,zoom:this.camera.zoom};
  }
  position(index){
    let x=0,y=0,delta=[1,1],depth=0;
    for(let i=index;i>=0&&depth++<2048;i--){const e=this.elements[i];x+=e.start[0]+e.motion[0]+sine(e.sinX,this.time-e.sinStartX);y+=e.start[1]+e.motion[1]+sine(e.sinY,this.time-e.sinStartY);delta=e.delta;if(!e.link)break;}
    return{x,y,delta};
  }
  tick({paused=false}={}){
    if(paused)return;
    for(const ctrl of this.definition.controllers){
      let t=ctrl.groupLoop>0?this.time%ctrl.groupLoop:this.time;if(ctrl.time[2]>0)t%=ctrl.time[2];if(t<ctrl.time[0]||t>ctrl.time[1])continue;
      for(const e of this.elements){
        if(ctrl.ids&&!ctrl.ids.includes(e.id)&&!ctrl.ids.includes(-1))continue;const v=ctrl.values;
        if(ctrl.type==='visible')e.visible=number(v.value,1)!==0;
        else if(ctrl.type==='enable')e.enabled=number(v.value,1)!==0;
        else if(ctrl.type==='anim'){e.anim=number(v.value,0);e.frameIndex=e.frameTime=0;}
        else if(ctrl.type==='sinx'||ctrl.type==='siny'){const key=ctrl.type==='sinx'?'sinX':'sinY';e[key]=vector(v.value,[0,0,0]);e[key==='sinX'?'sinStartX':'sinStartY']=this.time;}
        else if(/^(pos|vel)(set|add)$/.test(ctrl.type))for(const [axis,key]of [['x',0],['y',1]])if(v[axis]!==undefined){const value=number(v[axis]),field=ctrl.type.startsWith('pos')?e.motion:e.velocity;if(ctrl.type.endsWith('set'))field[key]=value-(field===e.motion?e.start[key]:0);else field[key]+=value;}
      }
    }
    for(const e of this.elements)if(e.enabled){
      for(let i=0;i<2;i++)e.motion[i]+=e.velocity[i];
      e.drawFrameIndex=e.frameIndex;e.drawFrameTime=e.frameTime;
      const a=this.animations.get(e.anim),f=a?.frames[e.frameIndex];
      if(e.animated&&f&&f.ticks>=0&&++e.frameTime>=Math.max(1,f.ticks)){e.frameTime=0;if(++e.frameIndex>=a.frames.length)e.frameIndex=a.loopStart||0;}
    }
    this.time++;
  }
  frame(element){return element.animated?this.animations.get(element.anim)?.frames[element.drawFrameIndex??element.frameIndex]:{group:element.spriteno[0],number:element.spriteno[1],x:0,y:0,flip:'',ticks:-1};}
  variable(name){const [section,...keys]=String(name).toLowerCase().split('.'),value=this.definition.def[section]?.[keys.join('.')];if(value===undefined)throw Error(`StageVar ${name} is not implemented or missing.`);const n=Number(value);return Number.isFinite(n)?n:words(value);}
}
