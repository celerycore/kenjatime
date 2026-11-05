import { evaluateExpression, evaluateTypedExpression, splitArguments,BottomError,UnsupportedExpressionError } from './expressions.js';
import { decodeText } from './formats.js';
import { spawnPosition } from './entities.js';
import {clipboardFormat,formatClipboard,decodeQuotedText} from './debug.js';
import {forceFeedbackParameters} from './haptics.js';
import {executeExplod,updateExplods as advanceExplods} from './explods.js';
import {hitAttribute,attributeMatches as matchAttribute,filterAllows} from './hit-filters.js';
import {baseScale,spatialConstant,spatialHitVars,changeCoordinateScale} from './coordinates.js';
import {allowsHitActivation,claimHitActivation,hitSourceId,recordHitContact} from './hit-rules.js';
import {initialHitVariables,hitVariableNames,sampleRecoveryInput,advanceHitState} from './hit-state.js';
import {scaledDamage,hitPower,koVelocity} from './combat-rules.js';

// CNS sections are ordered and may repeat keys (especially trigger1).
export function parseSections(text, source = '<script>') {
  const sections = [];
  let section;
  for (const [index, raw] of String(text).replace(/^\uFEFF/, '').split(/\r?\n/).entries()) {
    let quoted = false, escaped=false, clean = '';
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (ch === '"'&&!escaped) quoted = !quoted;
      if (ch === ';' && !quoted) break;
      clean += ch;
      escaped=ch==='\\'&&!escaped;
    }
    const line = clean.trim();
    if (!line) continue;
    const header = line.match(/^\[([^\]]+)\]/);
    if (header) {
      section = { name: header[1].trim().toLowerCase(), source, line: index + 1, entries: [], values: {} };
      sections.push(section);
      continue;
    }
    // Alternate variable targets can contain comparisons inside their index.
    let eq=-1,depth=0,inString=false,slash=false;
    for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'&&!slash)inString=!inString;if(!inString){if(ch==='('||ch==='[')depth++;else if(ch===')'||ch===']')depth--;else if(ch==='='&&depth===0){eq=i;break;}}slash=ch==='\\'&&!slash;}
    if (!section || eq < 1) continue;
    const key = line.slice(0, eq).trim().toLowerCase();
    const value = line.slice(eq + 1).trim();
    section.entries.push({ key, value, line: index + 1 });
    section.values[key] = value;
  }
  return sections;
}

const DEFAULT_CONSTANTS = {
  'data.life': 1000, 'data.power': 3000, 'data.attack': 100, 'data.defence': 100,
  'data.airjuggle': 15, 'data.liedown.time': 60, 'data.sparkno': 2, 'data.guard.sparkno': 40,
  'data.fall.defence_up':50,'data.ko.echo':0,'data.intpersistindex':60,'data.floatpersistindex':40,
  'size.xscale': 1, 'size.yscale': 1, 'size.ground.back': 15, 'size.ground.front': 16,
  'size.air.back': 12, 'size.air.front': 12, 'size.height': 60, 'size.attack.dist': 160,
  'size.proj.doscale': 0,
  'size.proj.attack.dist':90,
  'size.head.pos.x': 0, 'size.head.pos.y': -90, 'size.mid.pos.x': 0, 'size.mid.pos.y': -60,
  'size.draw.offset.x': 0, 'size.draw.offset.y': 0, 'size.shadowoffset': 0,
  'velocity.walk.fwd.x': 2.4, 'velocity.walk.back.x': -2.2,
  'velocity.run.fwd.x': 4.6, 'velocity.run.fwd.y': 0,
  'velocity.run.back.x': -4.5, 'velocity.run.back.y': -3.8,
  'velocity.jump.neu.x': 0, 'velocity.jump.neu.y': -8.4, 'velocity.jump.y': -8.4,
  'velocity.jump.fwd.x': 2.5, 'velocity.jump.back.x': -2.55,
  'velocity.runjump.fwd.x': 4, 'velocity.runjump.fwd.y': -8.1,
  'velocity.runjump.back.x': -2.55, 'velocity.runjump.back.y': -8.1,
  'velocity.airjump.neu.x': 0, 'velocity.airjump.neu.y': -8.1, 'velocity.airjump.y': -8.1,
  'velocity.airjump.fwd.x': 2.5, 'velocity.airjump.back.x': -2.55,
  'movement.yaccel': .44, 'movement.stand.friction': .85, 'movement.crouch.friction': .82,
  'movement.stand.friction.threshold': 2, 'movement.crouch.friction.threshold': .05,
  'movement.airjump.num': 1, 'movement.airjump.height': 35,
  'movement.air.gethit.trip.groundlevel':15,'movement.down.bounce.offset.x':0,'movement.down.bounce.offset.y':20,
  'movement.down.bounce.yaccel':.4,'movement.down.bounce.groundlevel':12,'movement.down.friction.threshold':.05,
};
const CONTROLLERS = new Set([
  'null', 'changestate', 'selfstate', 'changeanim', 'changeanim2', 'ctrlset', 'statetypeset',
  'velset', 'veladd', 'velmul', 'posset', 'posadd', 'posfreeze', 'gravity', 'turn',
  'varset', 'varadd', 'varmul', 'varrandom', 'varrangeset',
  'parentvarset', 'parentvaradd', 'lifeadd', 'lifeset', 'poweradd', 'powerset',
  'hitvelset', 'hitdef', 'hitby', 'nothitby', 'hitoverride',
  'sprpriority', 'width', 'screenbound', 'playerpush', 'assertspecial',
  'playsnd', 'stopsnd', 'sndpan', 'envshake', 'palfx', 'allpalfx', 'bgpalfx',
  'explod', 'modifyexplod', 'removeexplod', 'explodbindtime',
  'targetbind', 'targetfacing', 'targetlifeadd', 'targetpoweradd', 'targetvelset', 'targetveladd',
  'targetstate', 'targetdrop', 'bindtoroot', 'bindtoparent', 'bindtotarget',
  'attackmulset', 'defencemulset', 'hitadd', 'hitcount', 'hitfallset', 'hitfallvel', 'hitfallDamage'.toLowerCase(),
  'angleadd', 'angleset', 'anglemul', 'angledraw', 'offset', 'destroyself',
  'helper', 'projectile', 'pause', 'superpause', 'afterimage', 'afterimagetime', 'trans', 'movehitreset', 'attackdist', 'reversaldef', 'envcolor', 'fallenvshake', 'remappal',
  'makedust','gamemakeanim','forcefeedback','displaytoclipboard','appendtoclipboard','clearclipboard','victoryquote',
]);
export const supportedControllers = new Set(CONTROLLERS);
export const supportedTriggers = new Set(['time','stateno','prevstateno','anim','animelem','animtime','ctrl','statetype','movetype','physics','life','lifemax','power','powermax','facing','alive','gametime','hitpausetime','hitshakeover','hitover','movecontact','movehit','moveguarded','movereversed','hitcount','uniqhitcount','numhelper','numexplod','numtarget','numenemy','numpartner','ishelper','roundstate','roundno','matchno','teamside','teampower','tickspersecond','ailevel','palno','id','name','authorname','numproj','win','lose','drawgame','inguarddist','canrecover','pos x','pos y','vel x','vel y','screenpos x','screenpos y','command','const','const240p','const480p','const720p','random','animexist','selfanimexist','animelemtime','animelemno','gethitvar','playeridexist','p2name','p2life','p2stateno','p2statetype','p2movetype','p2bodydist x','p2dist x','p2bodydist y','p2dist y','hitdefattr','roundsexisted','camerapos x','camerapos y','hitfall','hitvel x','hitvel y','frontedgedist','backedgedist','frontedgebodydist','backedgebodydist','var','fvar','sysvar','sysfvar']);
supportedTriggers.add('teammode');
supportedTriggers.add('ishometeam');
for(const name of ['p1name','p3name','p4name','frontedge','backedge','const240p','const480p','const720p'])supportedTriggers.add(name);
const DELEGATED_EFFECTS = new Set(['playsnd', 'stopsnd', 'sndpan', 'envshake', 'envcolor', 'palfx', 'allpalfx', 'bgpalfx', 'afterimage', 'afterimagetime']);
const normalize = path => unquote(path).replaceAll('\\', '/').toLowerCase().replace(/^\.\//, '');
const unquote = text => String(text ?? '').replace(/^"(.*)"$/, '$1');
const decode = decodeText;
const requiredParameters=new Map();
for(const type of ['attackdist','attackmulset','changeanim','changeanim2','changestate','selfstate','ctrlset','defencemulset','hitadd','lifeadd','lifeset','playerpush','playsnd','poweradd','powerset','targetfacing','targetlifeadd','targetpoweradd','targetstate'])requiredParameters.set(type,['value']);
for(const [type,keys]of Object.entries({afterimagetime:['time'],assertspecial:['flag'],displaytoclipboard:['text'],appendtoclipboard:['text'],envshake:['time'],explod:['anim'],hitdef:['attr'],pause:['time'],reversaldef:['reversal.attr'],sndpan:['channel'],stopsnd:['channel'],trans:['trans'],varrandom:['v']}))requiredParameters.set(type,keys);
const controllerMetadata=new WeakMap();
function controllerRules(controller){
  if(controllerMetadata.has(controller))return controllerMetadata.get(controller);
  const rules={ignorehitpause:0,persistent:1,groups:new Map(),errors:[],warnings:[]};
  for(const key of requiredParameters.get(controller.type)||[])if(controller.values[key]===undefined)rules.errors.push({line:controller.line,message:`${controller.type} requires ${key}.`});
  if(['varset','varadd','varmul','parentvarset','parentvaradd'].includes(controller.type)&&!controller.entries.some(e=>/^(?:var|fvar|sysvar|sysfvar)\s*\(/.test(e.key))){
    if(controller.values.v===undefined&&controller.values.fv===undefined)rules.errors.push({line:controller.line,message:`${controller.type} requires v or fv (or alternate variable assignment syntax).`});
    if(controller.values.value===undefined)rules.errors.push({line:controller.line,message:`${controller.type} requires value.`});
  }
  if(controller.type==='varrangeset'&&controller.values.value===undefined&&controller.values.fvalue===undefined)rules.errors.push({line:controller.line,message:'VarRangeSet requires value or fvalue.'});
  if(controller.type==='sndpan'&&controller.values.pan===undefined&&controller.values.abspan===undefined)rules.errors.push({line:controller.line,message:'SndPan requires pan or abspan.'});
  for(const key of ['ignorehitpause','persistent'])if(controller.values[key]!==undefined){
    const raw=controller.values[key],value=Number(raw);
    if(!/^[+-]?\d+$/.test(raw)||!Number.isSafeInteger(value)||value< -2147483648||value>2147483647||key==='persistent'&&value<0)rules.errors.push({line:controller.entries.find(e=>e.key===key)?.line||controller.line,message:`${key} requires ${key==='persistent'?'a nonnegative':'a signed 32-bit'} integer constant; expressions are not allowed.`});
    else rules[key]=value;
  }
  for(const entry of controller.entries){const match=/^trigger([1-9]\d*)$/.exec(entry.key);if(match){const n=Number(match[1]);if(!rules.groups.has(n))rules.groups.set(n,[]);rules.groups.get(n).push(entry);}}
  if(!rules.groups.has(1))rules.errors.push({line:controller.line,message:'A state controller requires at least one trigger1.'});
  let next=1;while(rules.groups.has(next))next++;
  for(const [n,entries]of rules.groups)if(n>=next){rules.groups.delete(n);rules.warnings.push({line:entries[0].line,message:`trigger${n} is ignored because trigger${next} is missing.`});}
  controllerMetadata.set(controller,rules);return rules;
}

export function parseProgram(character, { commonText = '' } = {}) {
  const program = { states: new Map(), constants: new Map(Object.entries(DEFAULT_CONSTANTS)), quotes:new Map(), diagnostics: [], sources: [], controllerTypes: new Set() };
  const sourceTexts = [];
  if (commonText) sourceTexts.push(['<common states>', commonText]);
  const files = character.files || {};
  const base = character.path?.slice(0, character.path.lastIndexOf('/') + 1) || '';
  const lookup = value => {
    const path = normalize(value);
    const charsIndex = base.lastIndexOf('/chars/');
    const engineRoot = charsIndex < 0 ? '' : base.slice(0, charsIndex + 1);
    const checked = (character.checks || []).find(check => check.ok&&check.path&&normalize(check.value || '') === path && files[check.path]);
    return [checked?.path, base + path, path, engineRoot + 'data/' + path, 'data/' + path].find(candidate => candidate && files[candidate]);
  };
  const reference = character.def?.files || {};
  const common = reference.stcommon && lookup(reference.stcommon);
  if (common) sourceTexts.push([common, decode(files[common])]);
  else if (reference.stcommon && normalize(reference.stcommon).split('/').at(-1)!=='common1.cns') {
    program.diagnostics.push({ source: character.path, line: 0, type: 'missing-file', message: `Common state file not found: ${reference.stcommon}` });
  }
  const paths = new Set();
  for (const [key, value] of Object.entries(reference)) {
    if (!/^(cns|cmd|st\d*)$/.test(key) || !value) continue;
    const path = lookup(value);
    if (path && !paths.has(path)) { paths.add(path); sourceTexts.push([path, decode(files[path])]); }
    else if (!path) program.diagnostics.push({ source: character.path, line: 0, type: 'missing-file', message: `${key}: ${value}` });
  }
  // Support small synthetic characters and callers that supply the check list directly.
  for (const check of character.checks || []) {
    if (/^(cns|cmd|st\d*)$/.test(check.key) && check.ok && files[check.path] && !paths.has(check.path)) {
      paths.add(check.path); sourceTexts.push([check.path, decode(files[check.path])]);
    }
  }
  let nextId = 0;
  for (const [source, text] of sourceTexts) {
    program.sources.push(source);
    let current;
    for (const section of parseSections(text, source)) {
      const statedef = section.name.match(/^statedef\s+(-?\d+)\s*$/);
      if (statedef) {
        current = { id: +statedef[1], ...section, controllers: [] };
        program.states.set(current.id, current);
        const properties = new Set(['type','movetype','physics','anim','velset','ctrl','poweradd','facep2','hitdefpersist','movehitpersist','hitcountpersist','sprpriority','juggle']);
        for (const entry of section.entries) if (!properties.has(entry.key)) program.diagnostics.push({source,line:entry.line,type:'unsupported-state-parameter',message:`Statedef parameter ${entry.key} is not implemented.`});
      } else if (/^state(?:\s|$)/.test(section.name)) {
        if (!current) {
          program.diagnostics.push({ source, line: section.line, type: 'parse', message: 'State controller has no preceding Statedef.' });
          continue;
        }
        const type = unquote(section.values.type || '').toLowerCase();
        const controller = { ...section, id: ++nextId, type, state: current.id };
        current.controllers.push(controller);
        program.controllerTypes.add(type);
        const rules=controllerRules(controller);
        for(const [kind,items]of [['controller-parameter',rules.errors],['trigger-numbering',rules.warnings]])for(const item of items)program.diagnostics.push({source,line:item.line,type:kind,message:item.message});
        if (!CONTROLLERS.has(type)) program.diagnostics.push({ source, line: section.line, type: 'unsupported-controller', name: type || '(missing type)', message: `Controller ${type || '(missing type)'} is not implemented.` });
      } else if(section.name==='quotes'){
        for(const entry of section.entries){const match=/^victory(\d{1,2})$/.exec(entry.key);if(!match)continue;
          try{program.quotes.set(+match[1],decodeQuotedText(entry.value));}catch(error){program.diagnostics.push({source,line:entry.line,type:'quote',message:error.message});}
        }
      } else if (/^(data|size|velocity|movement)$/.test(section.name)) {
        for (const entry of section.entries) {
          const name = `${section.name}.${entry.key}`;
          const components = entry.value.split(',').map(value => Number(value.trim()));
          if (components.some(value => !Number.isFinite(value))) continue;
          program.constants.set(name, components.length === 1 ? components[0] : components);
          if (components.length > 1 || section.name === 'velocity') {
            program.constants.set(name + '.x', components[0]);
            if (components.length > 1) program.constants.set(name + '.y', components[1]);
          }
          if (name === 'velocity.jump.neu' && components.length > 1) program.constants.set('velocity.jump.y', components[1]);
          if (name === 'velocity.airjump.neu' && components.length > 1) program.constants.set('velocity.airjump.y', components[1]);
        }
      }
    }
  }
  return program;
}

const numeric = value => {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`Expected finite number, received ${String(value)}`);
  return number;
};
const integer = value => Math.trunc(numeric(value));
const truth = value => typeof value === 'number' && Number.isFinite(value) && value !== 0;
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

export class FighterRuntime {
  constructor(character, options = {}) {
    this.character = character;
    this.options = options;
    this.program = options.program || parseProgram(character, options);
    this.animations = new Map((character.animations || []).map(animation => [animation.id, animation]));
    this.diagnostics = [...this.program.diagnostics];
    this._diagnosticKeys = new Set(this.diagnostics.map(d => `${d.source}:${d.line}:${d.type}:${d.message}`));
    this._seed = options.seed ?? 0x1a2b3c4d;
    this.id = options.id ?? 1;
    this.name = character.def?.info?.name || 'Character';
    const local = (character.def?.info?.localcoord || '320,240').split(',').map(Number);
    this.localcoord = { x: local[0] || 320, y: local[1] || 240 };
    this.coordinateScale = 320 / this.localcoord.x;
    this.baseCoordinateScale=this.coordinateScale;
    this.world = options.world || null;
    this.parent = options.parent || null; this.root = options.root || this;
    this.helperId = options.helperId ?? 0; this.keyCtrl = options.keyCtrl ?? !this.parent;
    this.ownPal = options.ownPal ?? false; this.teamSide = options.teamSide ?? this.root.options?.teamSide ?? 1;
    this.commonAnimations = options.commonAnimations || new Map();
    this.reset();
  }

  reset() {
    this.vars = new Int32Array(60); this.fvars = new Float32Array(40);
    this.stateOwner = this; this.animationOwner = this; this.destroyed = false;
    this.coordinateScale=this.baseCoordinateScale;this._scriptOwner=null;
    this.sysvars = new Int32Array(5); this.sysfvars = new Float32Array(5);
    this.maxLife = this.constant('data.life'); this.life = this.maxLife;
    this.maxPower = this.constant('data.power'); this._power = 0;if(!this.parent)this.power = 0;
    this.pos = { x: this.options.position?.x || 0, y: this.options.position?.y || 0 };
    this.vel = { x: 0, y: 0 }; this.facing = this.options.facing === -1 ? -1 : 1;
    this.ctrl = 1; this.stateType = 'S'; this.moveType = 'I'; this.physics = 'S';
    this.stateNo = 0; this.prevStateNo = 0; this.time = 0; this.gameTime = 0;
    this.anim = 0; this.frameIndex = 0; this.frameTime = 0; this.animationTime = 0; this.animationCycleTime = 0; this.animationLooped = false; this.animationEnded = false;
    this.collisionFrame = null;this.collisionAnimationOwner=null;
    this.collisionAnimation=null;this.collisionFrameIndex=0;this.collisionFrameTime=0;
    this.hitDef = null; this.reversalDef = null; this.moveReversed = 0; this._hitSerial = 0; this.hitPauseTime = 0; this.hitTime = -1;
    this.hitId=-1;this.hitSourceId=undefined;this._spentHitDefs=new WeakSet();
    this.moveContact = 0; this.moveHit = 0; this.moveGuarded = 0; this.hitCount = 0;this.uniqHitCount=0;this.comboHits=0;this._lastHitCountTick=null;
    this.getHitVars = initialHitVariables(this);this._fallXVelocityDefined=false;this._fallDefenceMultiplier=1;this._previousInput=new Set();this.rawInput=new Set();this._fallEntry=-1; this.targets = [];this.targetHitIds=new Map(); this.helpers = []; this.explods = [];this.drawExplods=[];
    this.events = []; this.commands = new Set(); this.asserted = new Set(); this.opponent = null;
    this.attackMultiplier = 1; this.defenceMultiplier = 1;
    this.sprPriority = 0; this.angle = 0; this.drawScale = { x: 1, y: 1 }; this.drawOffset = { x: 0, y: 0 };
    this.playerPush = !this.parent; this.screenBound = !this.parent;this.moveCamera={x:!this.parent,y:!this.parent}; this.posFrozen = false;
    this.width = null; this.hitFilters=[null,null]; this.hitOverrides = new Map();
    this.bound = null; this._controllerCounts = new Map(); this._entrySerial = 0;
    this.pauseMoveTime = this.options.pauseMoveTime || 0; this.superMoveTime = this.options.superMoveTime || 0;
    this.projectileHistory = []; this.trans = null; this.angleDraw = false;
    this.juggleCost=0;this._juggleSerial=0;
    this._paletteRemaps=new Map();
    this.paletteNo=Math.max(1,Math.min(256,Math.trunc(this.options.paletteNo??this.parent?.paletteNo??1)));
    if(this.paletteNo!==1)this._paletteRemaps.set('1,1',[1,this.paletteNo]);
    this._initializing=false;
    this.aiLevel=this.parent?this.root.aiLevel:Math.max(0,Math.min(8,Math.trunc(Number.isFinite(Number(this.options.aiLevel))?Number(this.options.aiLevel):0)));
    this.clipboard='';this.victoryQuoteIndex=-1;this.victoryQuote=null;this._dustTicks=new Map();this.cornerPush=0;
    this._previousUp = false; this.airJumps = 0; this._changeCount = 0; this._executing = null;
    this.attackDist=undefined;
    this.changeState(0);
    this.events = [];
  }

  diagnostic(type, message, controller = this._executing) {
    const item = { source: controller?.source || this.character.path || '<character>', line: controller?.line || 0, type, message };
    if (controller) { item.controller = controller.type; item.state = controller.state; }
    const key = `${item.source}:${item.line}:${item.type}:${item.message}`;
    if (!this._diagnosticKeys.has(key)) {
      this._diagnosticKeys.add(key);
      this.diagnostics.push(item);
    }
    return item;
  }

  constant(name,scale=this.coordinateScale) {
    name = String(name).toLowerCase();
    if(name==='data.fall.defence_mul')return 100/(100+this.constant('data.fall.defence_up',scale));
    if (!this.program.constants.has(name)) throw new Error(`Unknown character constant: ${name}`);
    const value = this.program.constants.get(name);
    return (Array.isArray(value)?value[0]:value)*(spatialConstant(name)?this.baseCoordinateScale/scale:1);
  }

  get animation() { return (this.animationOwner || this).animations.get(this.anim); }
  get currentFrame() { return this.animation?.frames[this.frameIndex] || null; }
  get animElemTime() { return this.frameTime; }
  get animTime() {
    const frames = this.animation?.frames;
    if (!frames?.length) return 0;
    if (this.animationEnded) return 0;
    if (frames.some(frame => frame.ticks < 0)) return -1;
    return this.animationCycleTime - frames.reduce((sum, frame) => sum + Math.max(1, frame.ticks), 0);
  }
  get alive() { return this.life > 0; }
  get paletteRemaps(){return this.parent&&!this.ownPal?this.parent.paletteRemaps:this._paletteRemaps;}
  ownedHelpers() { return this.world ? this.world.entities.filter(p=>p.parent && !p.destroyed && (this===this.root?p.root===this:p.parent===this)) : this.helpers.filter(p=>!p.destroyed); }
  get power() { return this.parent ? this.root.power : this._power; }
  set power(value) { if(this.parent)this.root.power=value;else this._power=value; }

  evaluate(source, controller = this._executing, typed=false) {
    try {
      return (typed?evaluateTypedExpression:evaluateExpression)(source, {
        resolve: (name, args = [], redirect = null) => this.resolveTrigger(name, args, redirect),
        assign: (name, args, value) => this.assignVariable(name, args, value),
        onWarning: error => { if (!error.bottom) this.diagnostic('expression-warning', `${source}: ${error.message}`, controller); },
      });
    } catch (error) {
      if (!error.bottom) this.diagnostic('expression', `${source}: ${error.message}`, controller);
      throw error;
    }
  }

  variableArray(name) {
    const arrays = { var: this.vars, fvar: this.fvars, sysvar: this.sysvars, sysfvar: this.sysfvars };
    if (!arrays[name]) throw new Error(`Unsupported assignable variable: ${name}`);
    return arrays[name];
  }
  assignVariable(name, args, value) {
    const array = this.variableArray(name.toLowerCase()), index = integer(args[0]);
    if (index < 0 || index >= array.length) throw new BottomError(`${name} index out of range: ${index}`);
    array[index] = numeric(value);
    return array[index];
  }

  resolveTrigger(name, args = [], redirect = null,scale=this.coordinateScale) {
    name = name.toLowerCase();
    if (redirect) {
      let target;
      const type = redirect.name.toLowerCase();
      if (['enemynear', 'enemy', 'p2'].includes(type)) {
        const enemies = (this.world?.entities || [this.opponent]).filter(p => p && !p.destroyed && !p.parent && p.teamSide !== this.teamSide);
        if (type === 'enemynear') enemies.sort((a,b) => Math.abs(a.pos.x - this.pos.x) - Math.abs(b.pos.x - this.pos.x));
        target = enemies[Math.trunc(redirect.args[0] || 0)];
      }
      else if (type === 'root') target = this.root || this;
      else if (type === 'parent') target = this.parent;
      else if(type==='partner')target=(this.world?.entities||[]).filter(actor=>!actor.parent&&actor!==this.root&&actor.teamSide===this.teamSide)[Math.trunc(redirect.args[0]||0)];
      else if (type === 'helper') target = this.ownedHelpers().find(helper => !redirect.args.length || helper.helperId === +redirect.args[0]);
      else if (type === 'target') target = this.targets.find(t => !redirect.args.length || (this.targetHitIds.get(t.id)??t.hitId) === +redirect.args[0]);
      else if (type === 'playerid') target = this.world?.findPlayer(+redirect.args[0]) || [this, this.opponent, ...this.helpers].find(t => t?.id === +redirect.args[0]);
      else throw new Error(`Unsupported redirection: ${type}`);
      if (!target || target.destroyed) { const error = new Error(`Redirection ${type} has no matching player`); error.bottom = true; throw error; }
      return target.resolveTrigger(name,args,null,scale);
    }
    if (['var', 'fvar', 'sysvar', 'sysfvar'].includes(name)) {
      const array = this.variableArray(name), index = integer(args[0]);
      if (index < 0 || index >= array.length) throw new BottomError(`${name} index out of range: ${index}`);
      return array[index];
    }
    const other = this.opponent;
    const flow=this.world?.roundFlow,side=this.root===this.world?.player?'player':'opponent',won=!!flow?.roundWinner&&flow.roundWinner===side,lost=!!flow?.roundWinner&&flow.roundWinner!=='draw'&&!won;
    const values = {
      time: this.time, stateno: this.stateNo, prevstateno: this.prevStateNo,
      anim: this.anim, animelem: this.frameIndex + 1, animtime: this.animTime,
      ctrl: this.ctrl, statetype: this.stateType, movetype: this.moveType, physics: this.physics,
      life: this.life, lifemax: this.maxLife, power: this.power, powermax: this.maxPower,
      facing: this.facing, alive: +this.alive, gametime: this.world?.ticks??this.gameTime,
      hitpausetime: this.hitPauseTime, hitshakeover: +(this.hitPauseTime === 0), hitover: +(this.hitTime < 0),
      movecontact: this.moveContact, movehit: this.moveHit, moveguarded: this.moveGuarded,
      movereversed: this.moveReversed || 0, hitcount: this.hitCount, uniqhitcount: this.uniqHitCount,
      numhelper: this.ownedHelpers().length, numexplod: this.explods.length, numtarget: this.targets.length,
      numenemy: other ? 1 : 0, numpartner: 0, ishelper: +!!this.parent,
      roundstate: this.roundState ?? 2, roundsexisted: this.roundsExisted ?? 0, roundno: this.roundNo ?? 1, matchno: this.matchNo ?? 1, matchover:+!!this.world?.matchOver,
      teamside: this.teamSide ?? this.id, teampower: this.power, tickspersecond: 60,
      aiLevel: this.aiLevel || 0, ailevel: this.aiLevel || 0, palno: this.paletteNo || 1,
      teammode:'single',
      ishometeam:+(this.teamSide===1),
      id: this.id, name: this.name, authorname: this.character.def?.info?.author || '',
      numproj: (this.world?.projectiles || []).filter(p => p.owner === this && !p.removing && !p.removed).length, win:flow?+won:+(this.roundState === 4 && this.alive && other?.life <= 0),
      lose:flow?+lost:+(this.roundState === 4 && !this.alive), drawgame:flow?+(flow.roundWinner==='draw'):+(this.roundState === 4 && !this.alive && other?.life <= 0),
      winko:+(won&&flow.reason!=='time'),wintime:+(won&&flow.reason==='time'),winperfect:+(won&&this.life===this.maxLife),loseko:+(lost&&flow.reason!=='time'),losetime:+(lost&&flow.reason==='time'),loseperfect:+(lost&&other?.life===other?.maxLife),
      camerazoom:this.cameraZoom??1,gamewidth:(this.world?.view.width??320)/scale,gameheight:(this.world?.view.height??240)/scale,
      screenwidth:320/scale,screenheight:(this.world?.view.displayHeight??240)/scale,
      leftedge:(this.world?.view.left??-160)/scale,rightedge:(this.world?.view.right??160)/scale,topedge:(this.world?.view.top??-240)/scale,bottomedge:(this.world?.view.bottom??0)/scale,
      frontedge:(this.facing===1?this.world?.view.right??160:this.world?.view.left??-160)/scale,backedge:(this.facing===1?this.world?.view.left??-160:this.world?.view.right??160)/scale,
      inguarddist: +(!!other?.hitDef && Math.abs(other.pos.x - this.pos.x) <= (other.hitDef['guard.dist']!==undefined?other.hitDef['guard.dist']*(other.hitDef.coordinateScale??other.coordinateScale):(other.attackDist??other.constant('size.attack.dist'))*other.coordinateScale)),
      canrecover: +(!!this.getHitVars.fall&&this.getHitVars['fall.recover']!==0&&(this.getHitVars['fall.time']||0)>=(this.getHitVars['fall.recovertime']??4)), hitfall: this.getHitVars.fall || 0,
      'hitvel x': (this.getHitVars.xvel||0)*this.coordinateScale/scale,'hitvel y':(this.getHitVars.yvel||0)*this.coordinateScale/scale,
      'pos x': (this.pos.x-(this.cameraPos?.x||0)) / scale, 'pos y': this.pos.y / scale, 'vel x': this.vel.x / scale, 'vel y': this.vel.y / scale,
      'screenpos x': (this.pos.x-(this.world?.view.left??-160)) / scale, 'screenpos y': (this.pos.y-(this.world?.view.top??-240)) / scale,
      'camerapos x': (this.cameraPos?.x || 0) / scale, 'camerapos y': (this.cameraPos?.y || 0) / scale,
    };
    if (name === 'command') return +this.commands.has(String(args[0]));
    if(name==='stagevar'){if(!this.world?.stage)throw Error('StageVar requires an imported stage.');return this.world.stage.variable(args[0]);}
    if (name === 'ishelper' && args.length) return +(!!this.parent && this.helperId === +args[0]);
    if (name === 'numprojid') return (this.world?.projectiles || []).filter(p => p.owner === this && !p.removing && !p.removed && p.projId === Math.max(0,Math.trunc(+args[0]))).length;
    if (/^proj(contact|hit|guarded|cancel)time$/.test(name)) {
      const kind = name.slice(4, -4), wanted = Math.max(0,+args[0] || 0), record = this.projectileHistory.at(-1);
      return record && (!wanted || record.projId === wanted) && (kind === 'contact' ? ['hit','guarded'].includes(record.type) : record.type === kind) ? (this.world?.ticks ?? this.gameTime) - record.tick : -1;
    }
    if (/^(parentdist|rootdist) [xy]$/.test(name)) { const parent = !this.parent?null:name.startsWith('parent') ? this.parent : this.root; if (!parent||parent.destroyed||name.startsWith('parent')&&!parent.alive) { const e = Error('No live parent or root'); e.bottom = true; throw e; } const axis = name.at(-1); return (parent.pos[axis] - this.pos[axis]) * (axis === 'x' ? this.facing : 1) / scale; }
    if (name === 'const') return this.constant(args[0],scale);
    if (name === 'const240p') return numeric(args[0]) / this.coordinateScale;
    if (name === 'const480p') return numeric(args[0]) / (2*this.coordinateScale);
    if (name === 'const720p') return numeric(args[0]) / (4*this.coordinateScale);
    if (name === 'random') {
      this._seed ^= this._seed << 13; this._seed ^= this._seed >>> 17; this._seed ^= this._seed << 5;
      return (this._seed >>> 0) % 1000;
    }
    if (name === 'animexist' || name === 'selfanimexist') return +(name === 'selfanimexist' ? this : this.stateOwner).animations.has(integer(args[0]));
    if (name === 'animelemtime') {
      const index = integer(args[0]) - 1, frames = this.animation?.frames || [];
      if (index < 0 || index >= frames.length) { const error = new Error(`Animation element out of range: ${index + 1}`); error.bottom = true; throw error; }
      const before = frames.slice(0, index).reduce((sum, frame) => sum + Math.max(1, frame.ticks), 0);
      return this.animationTime - before;
    }
    if (name === 'animelemno') {
      let t = this.animationCycleTime + numeric(args[0] || 0), frames = this.animation?.frames || [];
      if (!frames.length) { const error = new Error('Animation has no elements'); error.bottom = true; throw error; }
      const durations = frames.map(frame => frame.ticks < 0 ? Infinity : Math.max(1, frame.ticks));
      const duration = durations.reduce((sum, ticks) => sum + ticks, 0);
      const loopStart = this.animation?.loopStart ?? 0;
      const introTime = durations.slice(0, loopStart).reduce((sum, ticks) => sum + ticks, 0);
      if (Number.isFinite(duration) && (this.animationLooped || this.frameIndex >= loopStart || t >= duration)) {
        const loopDuration = duration - introTime;
        t = introTime + ((t - introTime) % loopDuration + loopDuration) % loopDuration;
      } else if (t < 0) { const error = new Error('Animation offset precedes its start'); error.bottom = true; throw error; }
      for (let i = 0; i < frames.length; i++) { t -= durations[i]; if (t < 0) return i + 1; }
    }
    if (name === 'gethitvar') {
      const key = String(args[0]).toLowerCase();
      if (key === 'isbound') return +(!!this.bound && !this.bound.target.destroyed);
      if (key === 'hittime') return this.hitTime;
      if (key === 'hitshaketime') return this.hitPauseTime;
      if (key in this.getHitVars) return this.getHitVars[key]*(spatialHitVars.has(key)?this.coordinateScale/scale:1);
      if (hitVariableNames.has(key)) return 0;
      throw new Error(`Unsupported GetHitVar field: ${key}`);
    }
    if (name === 'numexplod' && args.length) return this.explods.filter(e => e.id === +args[0]).length;
    if (name === 'numhelper' && args.length) return this.ownedHelpers().filter(h => +args[0] <= 0 || h.helperId === +args[0]).length;
    if (name === 'numtarget' && args.length) return this.targets.filter(t => !t.destroyed && (+args[0] < 0 || (this.targetHitIds.get(t.id)??t.hitId) === +args[0])).length;
    if (name === 'playeridexist') return +(this.world?.findPlayer(+args[0]) || [this, other, ...this.helpers].find(p => p?.id === +args[0] && !p.destroyed) ? 1 : 0);
    if (['frontedgedist','backedgedist','frontedgebodydist','backedgebodydist'].includes(name)) {
      const front = name.startsWith('front');
      const direction = this.facing * (front ? 1 : -1);
      const boundary = direction > 0 ? (this.world?.view.right??this.options.rightBound ?? 160) : (this.world?.view.left??this.options.leftBound ?? -160);
      let distance = (direction>0?boundary-this.pos.x:this.pos.x-boundary) / scale;
      if (name.includes('body')) distance -= this.constant(`size.${this.stateType === 'A' ? 'air' : 'ground'}.${front ? 'front' : 'back'}`,scale);
      return distance;
    }
    if(name==='p1name')return this.name;
    if(['p2name','p3name','p4name'].includes(name)){
      const roots=(this.world?.entities||[this,other]).filter(actor=>actor&&!actor.destroyed&&!actor.parent);
      const actor=name==='p2name'?other:name==='p3name'?roots.find(actor=>actor!==this.root&&actor.teamSide===this.teamSide):roots.filter(actor=>actor.teamSide!==this.teamSide)[1];
      return actor?.name??{absent:true};
    }
    if(['p2life','p2stateno','p2statetype','p2movetype','p2bodydist x','p2dist x','p2bodydist y','p2dist y'].includes(name)&&!other)throw new BottomError(`${name}: P2 does not exist.`);
    if (name === 'p2life') return other.life;
    if (name === 'p2stateno') return other.stateNo;
    if (name === 'p2statetype') return other.stateType;
    if (name === 'p2movetype') return other.moveType;
    if (name === 'p2bodydist x' || name === 'p2dist x') {
      if (!other) return 0;
      let distance = (other.pos.x - this.pos.x) * this.facing / scale;
      if (name === 'p2bodydist x') distance -= this.constant(`size.${this.stateType === 'A' ? 'air' : 'ground'}.front`,scale) + other.constant(`size.${other.stateType === 'A' ? 'air' : 'ground'}.front`,scale);
      return distance;
    }
    if (name === 'p2bodydist y' || name === 'p2dist y') return other ? (other.pos.y - this.pos.y) / scale : 0;
    if (name === 'hitdefattr') {
      const requested = args.map(String).join(',').toUpperCase().split(',').map(v => v.trim());
      if (!this.hitDef) return 0;
      const [state, attack] = this.hitDef.attr.toUpperCase().split(',').map(v => v.trim());
      return +(requested[0]?.includes(state) && requested.slice(1).some(v => v === attack));
    }
    if (Object.hasOwn(values, name)) return values[name];
    throw new UnsupportedExpressionError(`Unsupported trigger: ${name}`);
  }

  parameter(source,controller=this._executing,typed=false){
    try{return this.evaluate(source,controller,typed);}
    catch(error){if(!error.bottom)throw error;this.diagnostic('parameter-bottom',`${source}: ${error.message} Parameter set to 0.`,controller);return typed?{value:0,float:false}:0;}
  }

  value(controller, key, fallback) {
    const raw = controller.values[key];
    if(raw===undefined)return fallback;
    if(key==='ignorehitpause'||key==='persistent'){const rules=controllerRules(controller);if(rules.errors.some(e=>e.message.startsWith(key)))throw Error(rules.errors.find(e=>e.message.startsWith(key)).message);return rules[key];}
    let cache=this._parameterCache?.get(controller);if(this._parameterCache&&!cache)this._parameterCache.set(controller,cache=new Map());
    if(cache?.has(key))return cache.get(key);
    const result=this.parameter(raw,controller);cache?.set(key,result);return result;
  }
  vector(controller, key, fallback = [0, 0]) {
    const raw = controller.values[key];
    if (raw === undefined) return [...fallback];
    let cache=this._parameterCache?.get(controller);if(this._parameterCache&&!cache)this._parameterCache.set(controller,cache=new Map());
    if(cache?.has(key))return [...cache.get(key)];
    const result=splitArguments(raw).map(part=>numeric(this.parameter(part,controller)));cache?.set(key,result);return result;
  }
  text(controller, key, fallback = '') { return unquote(controller.values[key] ?? fallback); }

  changeAnimation(number, element = 1, owner = this) {
    number = integer(number);
    if (!owner.animations.has(number)) {
      this.diagnostic('missing-animation', `Animation ${number} does not exist.`);
      return false;
    }
    const frames = owner.animations.get(number).frames;
    const index = clamp(integer(element) - 1, 0, Math.max(0, frames.length - 1));
    this.animationOwner = owner; this.anim = number; this.frameIndex = index; this.frameTime = 0; this.animationEnded = false;
    this.animationTime = frames.slice(0, index).reduce((sum, frame) => sum + Math.max(1, frame.ticks), 0);
    this.animationCycleTime = this.animationTime; this.animationLooped = false;
    return true;
  }

  changeState(number, ctrl, owner = this.stateOwner || this) {
    number = integer(number);
    const state = owner.program.states.get(number);
    if (!state) {
      this.diagnostic('missing-state', `State ${number} does not exist.`);
      return false;
    }
    if (++this._changeCount > 64) {
      this.diagnostic('state-loop', 'More than 64 state changes in one tick; execution stopped.');
      return false;
    }
    const old = this.stateOwner.program.states.get(this.stateNo);
    this.stateOwner = owner;
    changeCoordinateScale(this,baseScale(owner));
    this.prevStateNo = this.stateNo; this.stateNo = number; this.time = 0;
    this._entrySerial++; this._controllerCounts.clear();
    let keepHit=false,keepContact=false,keepCount=false;
    try{keepHit=truth(this.value(state,'hitdefpersist',0));keepContact=truth(this.value(state,'movehitpersist',0));keepCount=truth(this.value(state,'hitcountpersist',0));}catch{/* Keep a failed definition from preserving an old attack. */}
    if (!keepHit) { this.hitDef = null; this.reversalDef = null; }
    if (!keepContact) { this.moveContact = 0; this.moveHit = 0; this.moveGuarded = 0; this.moveReversed = 0; }
    if (!keepCount) {this.hitCount = 0;this.uniqHitCount=0;this._lastHitCountTick=null;}
    const previousMoveType = this.moveType; this.moveType = 'I'; this._executing = state;
    try {
      const stateType = this.text(state, 'type', 'S').toUpperCase();
      const physics = this.text(state, 'physics', 'N').toUpperCase();
      if (stateType !== 'U') this.stateType = stateType;
      if (physics !== 'U') this.physics = physics;
      if (state.values.movetype) { const value = this.text(state, 'movetype').toUpperCase(); this.moveType = value === 'U' ? previousMoveType : value; }
      if (state.values.ctrl !== undefined) this.ctrl = +truth(this.value(state, 'ctrl', this.ctrl));
      if (ctrl !== undefined) this.ctrl = +truth(numeric(ctrl));
      if (state.values.anim !== undefined) this.changeAnimation(this.value(state, 'anim', this.anim));
      if (state.values.velset !== undefined) {
        const [x = 0, y = 0] = this.vector(state, 'velset'); this.vel = { x: x * this.coordinateScale, y: y * this.coordinateScale };
      }
      if (state.values.sprpriority !== undefined) this.sprPriority = integer(this.value(state, 'sprpriority', 0));
      if (state.values.juggle !== undefined) {this.juggleCost=Math.max(0,integer(this.value(state,'juggle',0)));this._juggleSerial++;}
      if (state.values.poweradd !== undefined) this.power = clamp(this.power + this.value(state, 'poweradd', 0), 0, this.maxPower);
      if (truth(this.value(state, 'facep2', 0)) && this.opponent) this.facing = this.opponent.pos.x >= this.pos.x ? 1 : -1;
    } catch { /* The diagnostic includes the exact definition and expression. */ }
    this._executing = null;
    this.events.push({ type: 'state', state: number, previous: old?.id });
    return true;
  }

  shouldRun(controller, paused) {
    const rules=controllerRules(controller);if(rules.errors.length)return false;
    if (paused && !rules.ignorehitpause) return false;
    const all = controller.entries.filter(entry => entry.key === 'triggerall');
    for (const trigger of all) {
      try { if (!truth(this.evaluate(trigger.value, { ...controller, line: trigger.line }))) return false; }
      catch { return false; }
    }
    const groups = rules.groups;
    let enabled = false;
    for (const [, group] of [...groups].sort(([a], [b]) => a - b)) {
      let matches = true;
      for (const trigger of group) {
        try { if (!truth(this.evaluate(trigger.value, { ...controller, line: trigger.line }))) { matches = false; break; } }
        catch { matches = false; break; }
      }
      if (matches) { enabled = true; break; }
    }
    if (!enabled) return false;
    const persistent = rules.persistent;
    const count = this._controllerCounts.get(controller.id) || 0;
    this._controllerCounts.set(controller.id, count + 1);
    return persistent === 0 ? count === 0 : count % persistent === 0;
  }

  runState(number, paused, owner = this.stateOwner) {
    const state = owner.program.states.get(number);
    if (!state) return;
    const entry = this._entrySerial;
    for (const controller of state.controllers) {
      const previousOwner=this._scriptOwner;this._scriptOwner=owner;
      this._executing = controller;
      try { if (this.shouldRun(controller, paused)) this.execute(controller); }
      catch (error) {
        if (!this.diagnostics.some(d => d.message.includes(error.message) && d.source === controller.source)) this.diagnostic('controller', error.message, controller);
      }
      this._executing = null;this._scriptOwner=previousOwner;
      if (this.destroyed||this._entrySerial !== entry) break;
    }
  }

  automaticTransitions() {
    if (!this.ctrl || this.moveType === 'H' || !this.alive || this.stateOwner !== this || this.parent && !this.keyCtrl||this.world?.roundFlow&&this.world.roundFlow.roundState!==2) return;
    const down = this.commands.has('holddown'), up = this.commands.has('holdup');
    const moving = this.commands.has('holdfwd') || this.commands.has('holdback');
    const guarding = this.commands.has('holdback') && !this.asserted.has('noautoguard') && !!this.resolveTrigger('inguarddist');
    if (guarding && ![120, 130, 131, 132, 140].includes(this.stateNo)) {
      const forbidden = this.stateType === 'A' ? 'noairguard' : this.stateType === 'C' ? 'nocrouchguard' : 'nostandguard';
      const target = this.stateType === 'A' ? 132 : this.stateType === 'C' ? 131 : 120;
      if (!this.asserted.has(forbidden) && this.program.states.has(target)) { this.changeState(target); return; }
    }
    if (!this.asserted.has('noautoturn') &&this.world?.stage?.definition.autoturn!==false&& this.stateType !== 'A' && this.opponent && [0, 10, 11, 12, 20].includes(this.stateNo)) {
      const facing = this.opponent.pos.x >= this.pos.x ? 1 : -1;
      if (facing !== this.facing) this.facing = facing;
    }
    if (this.stateType === 'A') {
      if (up && !this._previousUp && this.airJumps < this.constant('movement.airjump.num') && -this.pos.y >= this.constant('movement.airjump.height') && this.program.states.has(45)) {
        this.airJumps++; this.changeState(45);
      }
      return;
    }
    if (up && !this.asserted.has('nojump') && this.program.states.has(40)) { this.changeState(40); return; }
    if (down && this.stateType === 'S' && !this.asserted.has('nocrouch') && this.program.states.has(10)) { this.changeState(10); return; }
    if (!down && this.stateType === 'C' && [10, 11].includes(this.stateNo) && this.program.states.has(12)) { this.changeState(12); return; }
    if (!this.asserted.has('nowalk') && this.stateType === 'S' && this.moveType === 'I') {
      if (moving && this.stateNo === 0 && this.program.states.has(20)) this.changeState(20);
      else if (!moving && this.stateNo === 20) this.changeState(0);
    }
  }

  tick({ commands = new Set(), opponent = null, paused: worldPaused = false,input=null } = {}) {
    this.events = []; this.commands = commands; this.opponent = opponent;
    sampleRecoveryInput(this,input,commands);
    if (worldPaused || this.destroyed) {if(!this.world)this.updateExplods({forceFrozen:true});this.gameTime++; return this.events; }
    this._changeCount = 0; this._executing = null;
    this.asserted = new Set(); this.posFrozen = false; this.playerPush = !this.parent; this.screenBound = !this.parent;this.moveCamera={x:!this.parent,y:!this.parent};
    this.width = null; this.drawOffset = { x: 0, y: 0 }; this.drawScale = { x: 1, y: 1 }; this.trans = null; this.angleDraw = false;
    const paused = this.hitPauseTime > 0;
    if (this.moveContact > 0 && !paused) this.moveContact++;
    if (this.moveHit > 0 && !paused) this.moveHit++;
    if (this.moveGuarded > 0 && !paused) this.moveGuarded++;
    if (this.moveReversed > 0 && !paused) this.moveReversed++;
    for(let slot=0;slot<2;slot++){const filter=this.hitFilters[slot];if(filter?.time>0&&--filter.time===0)this.hitFilters[slot]=null;}
    for (const [slot, override] of this.hitOverrides) if(override.time>0&&--override.time===0)this.hitOverrides.delete(slot);
    if (!this.parent) {
      if (this.stateOwner === this) this.runState(-3, paused, this);
      this.runState(-2, paused, this);
    }
    if (this.keyCtrl && this.stateOwner === this&&!this._initializing) this.runState(-1, paused, this.parent ? this.root : this);
    if(this.destroyed){this.gameTime++;return this.events;}
    if (!paused&&!this._initializing) this.automaticTransitions();
    if(!paused&&this.stateNo===5110&&this.time>=1&&this.alive&&(this.getHitVars.recovertime??1)<=0&&this.stateOwner.program.states.has(5120))this.changeState(5120);
    let serial;
    do { serial = this._entrySerial;
      if(this._initializing&&this.options.skipIntro&&[190,191].includes(this.stateNo))this.changeState(0,1);
      else this.runState(this.stateNo, paused);
    }
    while (serial !== this._entrySerial && this._changeCount <= 64);
    if(this.destroyed){this.gameTime++;return this.events;}
    if(!paused)this._initializing=false;
    this.collisionFrame = this.currentFrame;this.collisionAnimationOwner=this.animationOwner;
    if (paused) {advanceHitState(this,{hitPaused:true});if(!this.world)this.updateExplods({hitPaused:true});this.hitPauseTime = Math.max(0, this.hitPauseTime - 1); this.gameTime++; return this.events; }
    if (!this.posFrozen && !this.bound) {
      this.pos.x += this.vel.x * this.facing+this.cornerPush; this.pos.y += this.vel.y;
    }
    this.cornerPush*=clamp(this.constant('movement.stand.friction'),0,1);if(Math.abs(this.cornerPush)<.01)this.cornerPush=0;
    if (this.physics === 'A') {
      this.vel.y += this.constant('movement.yaccel') * this.coordinateScale;
      if (this.pos.y >= 0 && this.vel.y > 0) {
        this.pos.y = 0; this.vel.y = 0; this.airJumps = 0;
        if (this.program.states.has(52)) this.changeState(52);
      }
    } else if (this.physics === 'S' || this.physics === 'C') {
      if (![20, 100].includes(this.stateNo)) this.vel.x *= this.constant(this.physics === 'C' ? 'movement.crouch.friction' : 'movement.stand.friction');
    }
    this.updateBinding(); this.collisionFrame = this.currentFrame;this.collisionAnimationOwner=this.animationOwner; this.collisionAnimation=this.animation;this.collisionFrameIndex=this.frameIndex;this.collisionFrameTime=this.frameTime; this.advanceAnimation();if(!this.world)this.updateExplods();
    advanceHitState(this);
    this.time++; this.gameTime++;
    this._previousUp = this.commands.has('holdup');
    return this.events;
  }

  advanceAnimation() {
    const animation = this.animation, frame = this.currentFrame;
    if (!frame || frame.ticks < 0) return;
    if (this.animationEnded) this.animationEnded = false;
    this.frameTime++; this.animationTime++; this.animationCycleTime++;
    if (this.frameTime >= Math.max(1, frame.ticks)) {
      this.frameTime = 0; this.frameIndex++;
      if (this.frameIndex >= animation.frames.length) {
        this.frameIndex = animation.loopStart ?? animation.loopstart ?? 0;
        this.animationEnded = true; this.animationLooped = true;
        this.animationCycleTime = animation.frames.slice(0, this.frameIndex).reduce((sum, f) => sum + Math.max(1, f.ticks), 0);
      }
    }
  }

  execute(controller) {
    const invalid=controllerRules(controller).errors.find(error=>!error.message.includes('trigger1'));if(invalid)throw Error(invalid.message);
    const previous=this._parameterCache;this._parameterCache=new WeakMap();
    try{return this.executeController(controller);}finally{this._parameterCache=previous;}
  }

  executeController(controller) {
    const type = controller.type;
    const num = (key, fallback = 0) => numeric(this.value(controller, key, fallback));
    const int = (key, fallback = 0) => integer(this.value(controller, key, fallback));
    const vec = (key, fallback = [0, 0]) => this.vector(controller, key, fallback);
    const text = (key, fallback = '') => this.text(controller, key, fallback);
    if (!CONTROLLERS.has(type)) { this.diagnostic('unsupported-controller', `Controller ${type || '(missing type)'} is not implemented.`, controller); return; }
    if (type === 'null') return;
    if(['displaytoclipboard','appendtoclipboard','clearclipboard'].includes(type)){
      if(type==='clearclipboard'){this.clipboard='';return;}
      const format=clipboardFormat(controller.values.text||''),params=controller.values.params===undefined?[]:splitArguments(controller.values.params);
      if(params.length!==format.count)throw Error(`Clipboard format requires ${format.count} parameters, received ${params.length}.`);
      const message=formatClipboard(format,params.map(source=>this.parameter(source,controller,true)));
      this.clipboard=(type==='appendtoclipboard'&&this.clipboard?this.clipboard+'\n'+message:message).slice(-8192);return;
    }
    if(type==='victoryquote'){if(!this.parent){const index=int('value',-1);if(index!==this.victoryQuoteIndex)this.victoryQuote=null;this.victoryQuoteIndex=index;}return;}
    if(type==='forcefeedback'){this.events.push({type,...forceFeedbackParameters(controller.values)});return;}
    if(type==='gamemakeanim'||type==='makedust'){
      if(type==='makedust'){
        const spacing=int('spacing',3);if(spacing<1)throw Error('MakeDust spacing must be at least 1.');
        const previous=this._dustTicks.get(controller);
        if(previous?.entry===this._entrySerial&&this.gameTime-previous.time<spacing)return;
        this._dustTicks.set(controller,{entry:this._entrySerial,time:this.gameTime});
        this.gameAnimation(120,vec('pos'),true,0,controller);
        if(controller.values.pos2!==undefined)this.gameAnimation(120,vec('pos2'),true,0,controller);
      }else this.gameAnimation(int('value',0),vec('pos'),!!num('under'),Math.max(0,int('random')),controller);
      return;
    }
    if (type === 'changestate' || type === 'selfstate') {
      const state=int('value'),ctrl=controller.values.ctrl===undefined?undefined:num('ctrl'),anim=controller.values.anim===undefined?undefined:int('anim');
      const owner=type==='selfstate'?this:this.stateOwner;
      // The destination Statedef may replace the controller's optional animation.
      if(owner.program.states.has(state)&&anim!==undefined&&anim!==-1)this.changeAnimation(anim);
      this.changeState(state,ctrl,owner);return;
    }
    if (type === 'changeanim' || type === 'changeanim2') {
      this.changeAnimation(int('value'), int('elem', 1), type === 'changeanim2' ? this.stateOwner : this); return;
    }
    if (type === 'ctrlset') { this.ctrl = +truth(num('value')); return; }
    if (type === 'statetypeset') {
      for (const [key, field] of [['statetype', 'stateType'], ['movetype', 'moveType'], ['physics', 'physics']]) {
        if (controller.values[key] !== undefined) { const value = text(key).toUpperCase(); if (value !== 'U') this[field] = value; }
      }
      return;
    }
    if (/^(vel|pos)(set|add|mul)$/.test(type)) {
      const field = type.startsWith('vel') ? this.vel : this.pos, op = type.slice(3);
      for (const axis of ['x', 'y']) if (controller.values[axis] !== undefined) {
        const value = num(axis) * (op === 'mul' ? 1 : this.coordinateScale);
        if (op === 'set') field[axis] = value+(type==='posset'&&axis==='x'?(this.cameraPos?.x||0):0);
        else if (op === 'add') field[axis] += value * (type === 'posadd' && axis === 'x' ? this.facing : 1);
        else field[axis] *= value;
      }
      return;
    }
    if (type === 'gravity') { this.vel.y += this.constant('movement.yaccel') * this.coordinateScale; return; }
    if (type === 'turn') { this.facing *= -1; return; }
    if (type === 'posfreeze') { this.posFrozen = truth(num('value', 1)); return; }
    if (type === 'helper') {
      if (!this.world) throw Error('Helper requires a match world.');
      this.world.spawnHelper(this, this.entityParameters(controller)); return;
    }
    if (type === 'projectile') {
      if (!this.world) throw Error('Projectile requires a match world.');
      const keys = new Set(['velocity','remvelocity','accel','velmul','offset','postype','supermovetime','pausemovetime','ownpal','remappal']);
      const entries = controller.entries.filter(e => !e.key.startsWith('proj') && !e.key.startsWith('afterimage.') && !keys.has(e.key));
      const hit = this.parseHitDef({...controller, entries, values:Object.fromEntries(entries.map(e => [e.key,e.value]))});
      this.world.spawnProjectile(this, {...this.entityParameters(controller, true), hitDef:hit}); return;
    }
    if (type === 'pause' || type === 'superpause') {
      if (!this.world) throw Error(`${type} requires a match world.`);
      const spec = this.entityParameters(controller);
      spec.coordinateScale=this.coordinateScale;
      spec.type = type; spec.time ??= type === 'superpause' ? 30 : 0;
      spec.animCommon = !/^s/i.test(controller.values.anim || ''); spec.soundCommon = !/^s/i.test(controller.values.sound || '');
      this.world.requestPause(this, spec); return;
    }
    if (type === 'trans') { this.trans = {mode:text('trans','default').toLowerCase(),alpha:vec('alpha',[256,0])}; return; }
    if (type === 'movehitreset') { this.moveContact = this.moveHit = this.moveGuarded = 0; return; }
    if (type === 'attackdist') {this.attackDist=num('value');if(this.hitDef)this.hitDef['guard.dist']=this.attackDist*this.coordinateScale/(this.hitDef.coordinateScale??this.coordinateScale);return;}
    if(type==='remappal'){
      const source=vec('source',[-1,0]),dest=vec('dest',[-1,0]),key=source[0]===-1?'*':source.join(',');
      if(source[0]===-1)this.paletteRemaps.clear();
      if(dest[0]!==-1&&source.join(',')!==dest.join(',')&&!this.paletteRemaps.has(key)&&this.paletteRemaps.size>=8){this.diagnostic('resource-limit','RemapPal supports at most 8 simultaneous mappings.',controller);return;}
      if(dest[0]===-1||source.join(',')===dest.join(','))this.paletteRemaps.delete(key);else this.paletteRemaps.set(key,dest);
      return;
    }
    if (type === 'fallenvshake') {
      const time=this.getHitVars['fall.envshake.time']||0;
      if(time>0)this.events.push({type:'envshake',time,coordinateScale:this.coordinateScale,...Object.fromEntries(['ampl','freq','phase'].map(key=>[key,this.getHitVars['fall.envshake.'+key]]))});
      this.getHitVars['fall.envshake.time']=0;return;
    }
    if (['varset', 'varadd', 'varmul', 'parentvarset', 'parentvaradd'].includes(type)) {
      const target = type.startsWith('parent') ? this.parent : this;
      if (!target || target.destroyed) return;
      let assignments = controller.entries.filter(e => /^(var|fvar|sysvar|sysfvar)\s*\(/.test(e.key));
      if (!assignments.length) {
        const kind = controller.values.fv !== undefined ? 'fvar' : 'var';
        assignments = [{ key: `${kind}(${int(kind === 'fvar' ? 'fv' : 'v')})`, value: controller.values.value ?? '0' }];
      }
      for (const assignment of assignments) {
        const match = assignment.key.match(/^(var|fvar|sysvar|sysfvar)\s*\((.*)\)$/);
        if (!match) throw new Error(`Malformed variable target: ${assignment.key}`);
        const index = integer(this.parameter(match[2], controller));
        let value = numeric(this.parameter(assignment.value, controller));
        value=match[1].includes('fvar')?Math.fround(value):integer(value)|0;
        const prior = target.resolveTrigger(match[1], [index]);
        if (type.endsWith('add')) value += prior;
        if (type.endsWith('mul')) value *= prior;
        target.assignVariable(match[1], [index], value);
      }
      return;
    }
    if (type === 'varrandom') {
      const index=int('v'),range=vec('range',[0,1000]);const [lo,hi]=range.length===1?[0,integer(range[0])]:range.map(integer);
      if(lo>hi)throw Error('VarRandom range requires least_val <= greatest_val.');
      this.resolveTrigger('random');this.assignVariable('var',[index],lo+Math.floor((this._seed>>>0)/4294967296*(hi-lo+1)));return;
    }
    if (type === 'varrangeset') {
      const isFloat = controller.values.fvalue !== undefined;
      const arr = isFloat ? this.fvars : this.vars;
      const start = clamp(int('first'), 0, arr.length - 1), end = clamp(int('last', arr.length - 1), 0, arr.length - 1);
      const value=num(isFloat?'fvalue':'value');for (let i = start; i <= end; i++) this.assignVariable(isFloat ? 'fvar' : 'var', [i],value);
      return;
    }
    if (type === 'lifeadd' || type === 'lifeset') {
      let value = int('value');
      if (type === 'lifeadd') {value=-scaledDamage(-value,null,this,{absolute:!!num('absolute')});value+=this.life;}
      this.life = clamp(value, num('kill', 1) ? 0 : 1, this.maxLife); return;
    }
    if (type === 'poweradd' || type === 'powerset') { this.power = clamp(int('value') + (type === 'poweradd' ? this.power : 0), 0, this.maxPower); return; }
    if (type === 'attackmulset') { this.attackMultiplier = num('value', 1); return; }
    if (type === 'defencemulset') { this.defenceMultiplier = num('value', 1); return; }
    if (type === 'sprpriority') { this.sprPriority = int('value'); return; }
    if (type === 'screenbound') { this.screenBound = truth(num('value', 0));const [x,y]=vec('movecamera');this.moveCamera={x:!!x,y:!!y}; return; }
    if (type === 'playerpush') { this.playerPush = truth(num('value', 1)); return; }
    if (type === 'width') {
      const fallback = [this.constant('size.ground.front'), this.constant('size.ground.back')];
      const common = controller.values.value === undefined ? null : vec('value', fallback);
      const [front, back] = vec('player', common || fallback);
      this.width = { front, back, edge: controller.values.edge !== undefined ? vec('edge') : common }; return;
    }
    if (type === 'assertspecial') {
      const supported = new Set(['nowalk', 'nojump', 'nocrouch', 'noautoturn', 'invisible', 'noshadow', 'unguardable', 'noairguard', 'nostandguard', 'nocrouchguard','nojugglecheck','intro','roundnotover','timerfreeze','noko','nobardisplay','nobg','nofg']);
      for (const key of ['flag', 'flag2', 'flag3']) if (controller.values[key]) {
        const flag = text(key).toLowerCase(); this.asserted.add(flag);
        if (!supported.has(flag)) this.diagnostic('unsupported-flag', `AssertSpecial flag ${flag} is not implemented.`, controller);
      }
      return;
    }
    if (type === 'hitvelset') {
      if (num('x')) this.vel.x = (this.getHitVars.xvel || 0) * this.coordinateScale;
      if (num('y')) this.vel.y = (this.getHitVars.yvel || 0) * this.coordinateScale;
      return;
    }
    if (type === 'hitdef') { this.hitDef = null; this.reversalDef = null; this.hitDef = this.parseHitDef(controller); this.events.push({ type: 'hitdef', hitDef: this.hitDef }); return; }
    if (type === 'reversaldef') {
      this.reversalDef = null;
      if (controller.values['reversal.attr']===undefined) throw Error('ReversalDef requires reversal.attr.');
      if (!controller.values['reversal.attr'].trim()) return;
      hitAttribute(text('reversal.attr'));
      this.reversalDef = this.parseHitDef(controller); return;
    }
    if (type === 'hitby' || type === 'nothitby') {
      const keys=['value','value2'].filter(key=>controller.values[key]!==undefined);
      if(keys.length!==1)throw Error(`${type} requires exactly one of value or value2.`);
      const time=int('time',1);if(time< -1||time>360000)throw Error('Invalid hit-filter duration.');
      const attribute=hitAttribute(text(keys[0]));this.hitFilters[keys[0]==='value'?0:1]=time?{attribute,time,exclude:type==='nothitby'}:null;return;
    }
    if (type === 'hitoverride') {
      const slot=int('slot'),time=int('time',1);if(slot<0||slot>7||time< -1||time>360000)throw Error('HitOverride requires slot 0–7 and time -1 or greater.');
      if(!time||controller.values.attr?.trim()===''){this.hitOverrides.delete(slot);return;}
      if(controller.values.attr===undefined||controller.values.stateno===undefined)throw Error('HitOverride requires attr and stateno.');
      const attr=text('attr'),attribute=hitAttribute(attr);if(!time)this.hitOverrides.delete(slot);else this.hitOverrides.set(slot,{attr,attribute,stateNo:int('stateno'),time,forceAir:truth(num('forceair'))});return;
    }
    if (DELEGATED_EFFECTS.has(type)) {
      const data = this.effectParameters(controller);
      if (type === 'playsnd') {
        const [group = 0, number = 0] = Array.isArray(data.value) ? data.value : [data.value || 0, 0];
        Object.assign(data, { group, number, common: /^\s*f/i.test(controller.values.value || ''), volumeScale: data.volumescale, freqMul: data.freqmul });
      }
      this.events.push({ type, ...data,coordinateScale:this.coordinateScale, source: controller.source, line: controller.line }); return;
    }
    if (['explod', 'modifyexplod', 'removeexplod', 'explodbindtime'].includes(type)) { this.explodController(controller); return; }
    if (type.startsWith('target')) {
      const wanted = int('id', -1), targets = this.targets.filter(target => wanted === -1 || (this.targetHitIds.get(target.id)??target.hitId) === wanted);
      if (type === 'targetdrop') {
        const exclude=int('excludeid',-1),kept=exclude<0?[]:this.targets.filter(t=>(this.targetHitIds.get(t.id)??t.hitId)===exclude);
        this.targets=num('keepone',1)?kept.slice(0,1):kept;
        const live=new Set(this.targets.map(t=>t.id));for(const id of this.targetHitIds.keys())if(!live.has(id))this.targetHitIds.delete(id);return;
      }
      const value=['targetfacing','targetlifeadd','targetpoweradd','targetstate'].includes(type)?int('value'):undefined,kill=type==='targetlifeadd'?num('kill',1):1,absolute=type==='targetlifeadd'?num('absolute'):0,ctrl=type==='targetstate'&&controller.values.ctrl!==undefined?num('ctrl'):undefined;
      const bind=type==='targetbind'?{pos:vec('pos'),time:int('time',1)}:null;
      const velocity=type==='targetvelset'||type==='targetveladd'?Object.fromEntries(['x','y'].filter(axis=>controller.values[axis]!==undefined).map(axis=>[axis,num(axis)*this.coordinateScale])):null;
      for (const target of targets) {
        if (type === 'targetfacing') {if(value)target.facing=this.facing*(value<0?-1:1);}
        else if (type === 'targetlifeadd') {const amount=-scaledDamage(-value,this,target,{absolute:!!absolute});target.life=clamp(target.life+amount,kill?0:1,target.maxLife);}
        else if (type === 'targetpoweradd') target.power = clamp(target.power + value, 0, target.maxPower);
        else if (type === 'targetstate') { target.changeState(value,ctrl,this._scriptOwner||this.stateOwner); }
        else if (bind) { const [x=0,y=0]=bind.pos;target.bound={target:this,x:x*this.coordinateScale,y:y*this.coordinateScale,time:bind.time}; }
        else for (const [axis,value]of Object.entries(velocity||{}))target.vel[axis]=value+(type==='targetveladd'?target.vel[axis]:0);
      }
      return;
    }
    if (['bindtoroot', 'bindtoparent', 'bindtotarget'].includes(type)) {
      if(type!=='bindtotarget'&&!this.parent)return;
      const id=int('id',-1),target = type === 'bindtoroot' ? this.root : type === 'bindtoparent' ? this.parent : this.targets.find(target=>id<0||(this.targetHitIds.get(target.id)??target.hitId)===id);
      if (!target||target.destroyed){if(type==='bindtoparent'&&this.parent){this.bound=null;return;}throw new Error(`${type} has no matching player`);}
      let point=[0,0],x,y;
      if(type==='bindtotarget'){
        const parts=splitArguments(controller.values.pos||'0,0'),anchor=unquote(parts[2]||'foot').toLowerCase();
        if(parts.length>3||!['foot','head','mid'].includes(anchor))throw Error('BindToTarget pos requires x, y, and Foot, Head or Mid.');
        [x,y]=parts.slice(0,2).map(part=>numeric(this.evaluate(part,controller)));x??=0;y??=0;
        if(anchor!=='foot')point=['x','y'].map(axis=>target.constant(`size.${anchor}.pos.${axis}`)*target.coordinateScale);
      }else [x=0,y=0]=vec('pos');
      this.bound = { target, x: x * this.coordinateScale+point[0], y: y * this.coordinateScale+point[1], time: int('time', 1), facing: num('facing') }; return;
    }
    if (type === 'hitadd') {const amount=int('value');this.hitCount=Math.max(0,this.hitCount+amount);this.uniqHitCount=Math.max(0,this.uniqHitCount+amount);const target=this.targets.at(-1)||(this.opponent?.moveType==='H'?this.opponent:null);if(target)target.comboHits=Math.max(0,(target.comboHits||0)+amount);return;}
    if (type === 'hitcount') { this.hitCount = int('value'); return; }
    if (type === 'hitfallset') {
      if (controller.values.value !== undefined) {const flag=int('value',-1);if(flag!==-1){if(flag&&!this.getHitVars.fall)this.getHitVars['fall.time']=0;this.getHitVars.fall=+!!flag;}}
      if (controller.values.xvel !== undefined) {this.getHitVars['fall.xvel'] = num('xvel');this._fallXVelocityDefined=true;}
      if (controller.values.yvel !== undefined) this.getHitVars['fall.yvel'] = num('yvel');
      return;
    }
    if (type === 'hitfallvel') {if(this.moveType!=='H')return;if(this._fallXVelocityDefined)this.vel.x=(this.getHitVars['fall.xvel']||0)*this.coordinateScale;this.vel.y=(this.getHitVars['fall.yvel']||0)*this.coordinateScale;return;}
    if (type === 'hitfalldamage') {if(this.moveType==='H'){const damage=scaledDamage(this.getHitVars['fall.damage']||0,null,this);this.life=clamp(this.life-damage,this.life>0&&this.getHitVars['fall.kill']===0?1:0,this.maxLife);this.getHitVars['fall.damage']=0;}return;}
    if (type === 'angleadd') { this.angle += num('value'); return; }
    if (type === 'angleset') { this.angle = num('value'); return; }
    if (type === 'anglemul') { this.angle *= num('value', 1); return; }
    if (type === 'angledraw') { this.angleDraw = true; const [x = 1, y = 1] = vec('scale', [1, 1]); this.drawScale = { x, y }; if (controller.values.value) this.angle = num('value'); return; }
    if (type === 'offset') { this.drawOffset = { x: num('x') * this.coordinateScale, y: num('y') * this.coordinateScale }; return; }
    if (type === 'destroyself') {
      if (!this.parent) { this.diagnostic('unsupported-controller', 'DestroySelf is valid only for helpers.', controller); return; }
      const recursive=!!num('recursive'),removeExplods=!!num('removeexplods');
      if(this.world)this.world.destroyHelper(this,{recursive,removeExplods});else{this.destroyed=true;if(removeExplods)this.explods=this.drawExplods=[];}
      return;
    }
    this.diagnostic('unsupported-controller', `Controller ${type} is not implemented.`, controller);
  }

  selectVictoryQuote(){
    if(this.parent||this.victoryQuote!==null)return this.victoryQuote;
    const quotes=this.program.quotes;if(!quotes?.size)return null;
    const available=[...quotes.keys()],index=quotes.has(this.victoryQuoteIndex)?this.victoryQuoteIndex:available[Math.floor(this.resolveTrigger('random')/1000*available.length)];
    return this.victoryQuote=quotes.get(index);
  }

  gameAnimation(anim,offset,under,random,controller){
    if(anim<0)return;
    if(!this.commonAnimations.has(anim)){this.diagnostic('missing-animation',`Common effect animation ${anim} is unavailable. Import its fightfx resources.`,controller);return;}
    const jitter=()=>random?(this.resolveTrigger('random')/999-.5)*random:0;
    this.events.push({type:'gameanim',anim,under,common:true,facing:this.facing,pos:{x:this.pos.x+((offset[0]||0)*this.facing+jitter())*this.coordinateScale,y:this.pos.y+((offset[1]||0)+jitter())*this.coordinateScale}});
  }

  effectParameters(controller) {
    const result = {};
    const symbolic = new Set(['waveform', 'postype', 'trans', 'helpertype', 'name', 'space']);
    for (const entry of controller.entries) {
      if (/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(entry.key)) continue;
      if (symbolic.has(entry.key) && !/^-?[\d.]+$/.test(entry.value)) { result[entry.key] = unquote(entry.value); continue; }
      const parts = splitArguments(entry.value);
      const evaluated = parts.map(part => {
        // S before a sound or animation index denotes the character resource bank.
        const source = part.trim().replace(/^[sSfF](?=[\d(-])/, '');
        return this.parameter(source, controller);
      });
      result[entry.key] = evaluated.length === 1 ? evaluated[0] : evaluated;
    }
    return result;
  }

  entityParameters(controller, projectile = false) {
    const keys = new Set(['velocity','remvelocity','accel','velmul','offset','postype','supermovetime','pausemovetime','ownpal','remappal']);
    const entries = projectile ? controller.entries.filter(e => e.key.startsWith('proj') || e.key.startsWith('afterimage.') || keys.has(e.key)) : controller.entries;
    if(projectile){const known=new Set(['projid','projanim','projhitanim','projremanim','projcancelanim','projscale','projremove','projremovetime','projhits','projmisstime','projpriority','projsprpriority','projedgebound','projstagebound','projheightbound','projshadow']);
      for(const entry of entries)if(entry.key.startsWith('proj')&&!known.has(entry.key))this.diagnostic('unsupported-projectile',`Projectile parameter ${entry.key} is not implemented.`,{...controller,line:entry.line});}
    return {...this.effectParameters({...controller,entries}), source:controller.source, line:controller.line};
  }

  createHelper(spec, {id} = {}) {
    if (spec.helpertype && spec.helpertype !== 'normal') this.diagnostic('unsupported-helper', 'Player-type helpers are deprecated by MUGEN 1.1; using a normal helper.');
    const {pos,facing} = spawnPosition(this,spec);
    const program = {...this.program,constants:new Map(this.program.constants)};
    for (const [key,value] of Object.entries(spec)) if (key.startsWith('size.')) {
      const ratio=spatialConstant(key)?this.coordinateScale/this.baseCoordinateScale:1,converted=Array.isArray(value)?value.map(v=>v*ratio):value*ratio;
      program.constants.set(key,converted);
      if (Array.isArray(converted)) { program.constants.set(key+'.x',converted[0]); program.constants.set(key+'.y',converted[1]); }
    }
    const helper = new FighterRuntime(this.character, {program,commonAnimations:this.commonAnimations,world:this.world,
      id,position:pos,facing,parent:this,root:this.root,helperId:Math.trunc(spec.id||0),keyCtrl:!!spec.keyctrl,
      ownPal:!!spec.ownpal,teamSide:this.teamSide,pauseMoveTime:spec.pausemovetime||0,superMoveTime:spec.supermovetime||0});
    helper.name = spec.name || `${this.name}'s helper`; helper.opponent = this.opponent;
    if(spec.ownpal)helper._paletteRemaps=new Map(this.paletteRemaps);
    if(spec.ownpal)this.events.push({type:'palettesnapshot',target:helper});
    const known=new Set(['id','name','stateno','postype','pos','facing','helpertype','keyctrl','ownpal','pausemovetime','supermovetime','remappal','source','line']);
    for(const key of Object.keys(spec))if(!known.has(key)&&!key.startsWith('size.'))helper.diagnostic('unsupported-helper',`Helper parameter ${key} is not implemented.`);
    if (spec.ownpal&&spec.remappal && spec.remappal[0] !== -1){helper.paletteRemaps.clear();helper.paletteRemaps.set('*',spec.remappal);}
    if (!helper.changeState(spec.stateno ?? 0)) { helper.destroyed = true; return helper; }
    this.helpers.push(helper); return helper;
  }

  parseHitDef(controller) {
    const raw = controller.values;
    const hit = { serial: ++this._hitSerial,coordinateScale:this.coordinateScale,stateOwner:this._scriptOwner||this.stateOwner };
    const strings = new Set(['attr', 'reversal.attr', 'hitflag', 'guardflag', 'animtype', 'air.animtype', 'fall.animtype', 'ground.type', 'air.type', 'affectteam', 'priority']);
    for (const entry of controller.entries) {
      if (/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(entry.key)) continue;
      if(entry.key==='priority'){const [level,kind='Hit']=splitArguments(entry.value);hit.priority=[integer(this.parameter(level,controller)),unquote(kind)];continue;}
      if (strings.has(entry.key)) { hit[entry.key] = unquote(entry.value); continue; }
      try {
        const values = splitArguments(entry.value).map(part => this.parameter(part.trim().replace(/^[sSfF](?=[\d(-])/, ''), controller));
        hit[entry.key] = values.length === 1 ? values[0] : values;
      } catch { throw new Error(`HitDef parameter ${entry.key} could not be evaluated; attack disabled.`); }
    }
    const vector = (key, fallback) => Array.isArray(hit[key]) ? hit[key] : hit[key] === undefined ? [...fallback] : [hit[key], fallback[1] ?? 0];
    hit.attr = hit.attr ?? `${this.stateType}, NA`;
    hit.id=integer(hit.id??0);hit.chainid=integer(hit.chainid??-1);
    const noChain=hit.nochainid===undefined?[-1,-1]:Array.isArray(hit.nochainid)?hit.nochainid:[hit.nochainid,-1];
    if(noChain.length>2)throw Error('HitDef nochainID takes at most two IDs.');
    hit.nochainid=noChain.map(integer);hit.hitonce=hit.hitonce===undefined?+/^[SCA]\s*,\s*[NSH]T$/i.test(hit.attr):+truth(numeric(hit.hitonce));
    hit.damage = vector('damage', [0, 0]); hit.pauseTime = vector('pausetime', [0, 0]);
    hit.guardPauseTime = vector('guard.pausetime', hit.pauseTime);
    hit.groundVelocity = vector('ground.velocity', [0, 0]); hit.airVelocity = vector('air.velocity', [0, 0]);
    hit.guardVelocity = vector('guard.velocity', [hit.groundVelocity[0], 0]);
    hit.airGuardVelocity = vector('airguard.velocity', [hit.airVelocity[0] * 1.5, hit.airVelocity[1] / 2]);
    hit.guardVelocity[1]=0;
    hit['air.type']??=hit['ground.type']??'high';
    hit.forcestand??=+(hit.groundVelocity[1]!==0);
    hit['down.velocity']??=[...hit.airVelocity];hit['down.hittime']??=20;hit['down.bounce']??=0;
    hit['ground.cornerpush.veloff']??=/^A\s*,/i.test(hit.attr)?0:1.3*hit.guardVelocity[0];
    for(const key of ['air','down','guard'])hit[key+'.cornerpush.veloff']??=hit['ground.cornerpush.veloff'];
    hit['airguard.cornerpush.veloff']??=hit['guard.cornerpush.veloff'];
    hit.groundHitTime = hit['ground.hittime'] ?? 0; hit.airHitTime = hit['air.hittime'] ?? 20;
    hit.guardHitTime = hit['guard.hittime'] ?? hit.groundHitTime;
    hit['ground.slidetime']??=0;hit['guard.slidetime']??=hit.guardHitTime;
    hit['guard.ctrltime']??=hit['guard.slidetime'];hit['airguard.ctrltime']??=hit['guard.ctrltime'];
    hit.hitFlag = String(hit.hitflag ?? 'MAF').toUpperCase(); hit.guardFlag = String(hit.guardflag ?? '').toUpperCase();
    hit.fall = hit.fall ?? 0; hit.kill = hit.kill ?? 1; hit['guard.kill'] = hit['guard.kill'] ?? 1;
    hit.source = controller.source; hit.line = controller.line;
    hit.juggleCost=this.juggleCost;hit.juggleGroup=`${this.id}:${this._juggleSerial}`;
    hit.sparkCommon = !/^s/i.test(raw.sparkno || ''); hit.guardSparkCommon = !/^s/i.test(raw['guard.sparkno'] || '');
    hit.hitSoundCommon = !/^s/i.test(raw.hitsound || ''); hit.guardSoundCommon = !/^s/i.test(raw.guardsound || '');
    hit.sparkno ??= this.constant('data.sparkno'); hit['guard.sparkno'] ??= this.constant('data.guard.sparkno');
    const consumed = new Set(['attr','damage','pausetime','guard.pausetime','ground.velocity','air.velocity','guard.velocity','airguard.velocity','ground.hittime','air.hittime','guard.hittime','ground.slidetime','guard.slidetime','ground.ctrltime','guard.ctrltime','guardflag','hitflag','fall','forcenofall','kill','guard.kill','fall.kill','fall.damage','fall.xvelocity','fall.yvelocity','fall.recover','fall.recovertime','yaccel','animtype','air.animtype','ground.type','air.type','chainid','id','p1stateno','p2stateno','p2getp1state','p1facing','p1getp2facing','p2facing','p1sprpriority','p2sprpriority','numhits','getpower','givepower','priority','affectteam','guard.dist','down.velocity','down.hittime','air.fall','forcestand','air.juggle','fall.envshake.time','fall.envshake.ampl','fall.envshake.freq','fall.envshake.phase','sparkno','guard.sparkno','sparkxy','hitsound','guardsound','envshake.time','envshake.freq','envshake.ampl','envshake.phase','palfx.time','palfx.add','palfx.mul','palfx.sinadd','palfx.color','palfx.invertall']);
    for(const key of ['fall.animtype','mindist','maxdist','snap','ground.cornerpush.veloff','air.cornerpush.veloff','down.cornerpush.veloff','guard.cornerpush.veloff','airguard.cornerpush.veloff','airguard.ctrltime'])consumed.add(key);
    consumed.add('hitonce');consumed.add('nochainid');consumed.add('down.bounce');
    for (const entry of controller.entries) {
      if (/^(type|triggerall|trigger\d+|persistent|ignorehitpause)$/.test(entry.key) || consumed.has(entry.key) || entry.key === 'reversal.attr') continue;
      this.diagnostic('unsupported-hitdef-parameter', `HitDef parameter ${entry.key} is parsed but its engine behavior is not implemented.`, { ...controller, line: entry.line });
    }
    return hit;
  }

  receiveHit(hit, attacker, { guarded = false } = {}) {
    if (!this.canBeHit(hit,attacker)) return { damage: 0, guarded: false, rejected: true };
    const typeNone=!guarded&&String(hit[this.stateType==='A'?'air.type':'ground.type']??hit['ground.type']??'high').toLowerCase()==='none';
    const override=guarded?null:this.matchingHitOverride(hit);
    const foreignOwner = hit.p2getp1state === 0 ? this : hit.stateOwner||attacker;
    if (!typeNone&&!guarded && !override&&hit.p2stateno >= 0 && !foreignOwner?.program.states.has(hit.p2stateno)) {
      this.diagnostic('missing-state',`HitDef target state ${hit.p2stateno} does not exist; hit rejected.`);
      return {damage:0,guarded:false,rejected:true};
    }
    claimHitActivation(this,hit,attacker);
    const pause=guarded?hit.guardPauseTime:hit.pauseTime;
    const initialType=this.stateType,impactFacing=attacker?.facing??-this.facing,defenderFacing=this.facing;
    if(typeNone){
      // Legacy MUGEN does not apply the documented hitpause for ordinary None
      // contacts. The HitOverride interaction still needs native capture.
      recordHitContact(attacker,hit,false,{count:false});return{damage:0,guarded:false,typeNone:true,cornerPush:0};
    }
    this.explods=this.explods.filter(e=>!e.removeongethit);this.drawExplods=this.drawExplods.filter(e=>!e.removeongethit);
    const airborne = this.stateType === 'A'||!!override?.forceAir,downed=this.stateType==='L'&&!override?.forceAir,falling=airborne&&!!this.getHitVars.fall;
    const previous=this.getHitVars,inCombo=this.moveType==='H'&&!previous.guarded;
    const cornerPush=hit[(guarded?airborne?'airguard':'guard':downed?'down':airborne?'air':'ground')+'.cornerpush.veloff']||0;
    if(hit.forcestand && this.stateType==='C')this.stateType='S';
    const baseDamage = numeric(hit.damage?.[guarded ? 1 : 0] || 0);
    const damage = Math.max(0,scaledDamage(baseDamage,attacker,this));
    this.life = clamp(this.life - damage, (guarded ? hit['guard.kill'] : hit.kill) === 0 ? 1 : 0, this.maxLife);
    if (attacker && hit.p2facing) this.facing = attacker.facing * (hit.p2facing < 0 ? -1 : 1);
    if (attacker && hit.p1getp2facing) attacker.facing = this.facing * (hit.p1getp2facing < 0 ? -1 : 1);
    else if (attacker && hit.p1facing === -1) attacker.facing *= -1;
    const velocity = guarded ? (airborne ? hit.airGuardVelocity : hit.guardVelocity) : downed&&hit['down.velocity']!==undefined ? (Array.isArray(hit['down.velocity'])?hit['down.velocity']:[hit['down.velocity'],0]) : (airborne ? hit.airVelocity : hit.groundVelocity);
    const hitScale=hit.coordinateScale??attacker?.coordinateScale??this.coordinateScale,factor=hitScale/this.coordinateScale;
    let xvel = (velocity?.[0] || 0) * factor*-impactFacing*this.facing, yvel = (velocity?.[1] || 0) * factor;
    const knockout=!this.alive,boost=knockout?koVelocity(xvel,yvel,initialType,this.coordinateScale):{x:xvel,y:yvel,xadd:0,yadd:0};xvel=boost.x;yvel=boost.y;
    const time = guarded ? hit.guardHitTime : downed&&yvel===0 ? hit['down.hittime']??20 : airborne||yvel!==0 ? hit.airHitTime??20 : hit.groundHitTime??0;
    const animTypes = { light: 0, medium: 1, med:1, hard: 2, back: 3, up: 4, diagup: 5 };
    const groundTypes = { high: 1, low: 2, trip: 3, none: 0 };
    let groundType=groundTypes[String(hit['ground.type']||'high').toLowerCase()]??1;
    if(attacker&&(attacker.pos.x-this.pos.x)*defenderFacing<0&&(groundType===1||groundType===2))groundType=3-groundType;
    const airAnim=hit['air.animtype']||hit.animtype||'light',fallAnim=hit['fall.animtype']||(String(airAnim).toLowerCase()==='up'?'up':'back');
    const fall = knockout?1:guarded?0:+((!hit.forcenofall||hit.fall)&&!!previous.fall||truth(numeric(airborne?hit['air.fall']??hit.fall??0:hit.fall||0)));
    this.getHitVars = {
      animtype: animTypes[String(falling?fallAnim:airborne?airAnim:hit.animtype||'light').toLowerCase()] ?? 0,
      groundtype: groundType,
      airtype: groundTypes[String(hit['air.type'] || 'high').toLowerCase()] ?? 1,
      type:airborne?groundTypes[String(hit['air.type']||hit['ground.type']||'high').toLowerCase()]??1:groundType,
      damage, hitcount:guarded?0:(inCombo?previous.hitcount||0:0)+1,fallcount:inCombo?previous.fallcount||0:0, hitshaketime: pause?.[1] || 0,
      hittime: time, slidetime: hit[guarded ? 'guard.slidetime' : 'ground.slidetime'] ?? (guarded?time:0),
      ctrltime: (guarded&&airborne?hit['airguard.ctrltime']:undefined)??hit[guarded ? 'guard.ctrltime' : 'ground.ctrltime'] ?? time,
      xvel, yvel, yaccel: hit.yaccel === undefined ? .35 / this.coordinateScale : hit.yaccel * factor, xoff: 0, yoff: 0,
      // MUGEN's documented velocity-add getters stay zero even on a KO.
      guarded: +guarded, fall,hitid:hit.id??0,chainid:Math.max(0,hit.id??0), isbound: 0,xveladd:0,yveladd:0,zoff:0,
      recovertime:downed?Math.min(previous.recovertime??this.constant('data.liedown.time'),this.constant('data.liedown.time')):this.constant('data.liedown.time'),'fall.time':0,
      'fall.damage': hit['fall.damage'] || 0, 'fall.xvel': hit['fall.xvelocity'] === undefined ? xvel : hit['fall.xvelocity'] * factor*-impactFacing*this.facing,
      'fall.yvel': downed&&!hit['down.bounce']&&yvel!==0?0:hit['fall.yvelocity'] === undefined ? -4.5 / this.coordinateScale : hit['fall.yvelocity'] * factor, 'fall.recover': knockout?0:hit['fall.recover'] ?? 1,
      'fall.recovertime': hit['fall.recovertime'] ?? 4, 'fall.kill': hit['fall.kill'] ?? 1,
      'fall.envshake.time':hit['fall.envshake.time']||0,'fall.envshake.freq':hit['fall.envshake.freq']??60,
      'fall.envshake.ampl':hit['fall.envshake.ampl']===undefined?-4/this.coordinateScale:hit['fall.envshake.ampl']*factor,'fall.envshake.phase':hit['fall.envshake.phase']??0,
    };
    this.comboHits=guarded?0:(inCombo?this.comboHits||0:0)+Math.max(0,Math.trunc(hit.numhits??1));
    this._fallXVelocityDefined=hit['fall.xvelocity']!==undefined;
    this.hitTime = Math.max(0, time || 0); this.hitPauseTime = Math.max(0, pause?.[1] || 0);
    this.ctrl = 0; this.moveType = 'H'; this.hitId = hit.id ?? 0;
    this.hitSourceId=hitSourceId(attacker);
    this.vel = { x: 0, y: 0 };this.cornerPush=0;
    if(attacker&&!guarded){
      const scale=hitScale;
      for(const [axis,index]of [['x',0],['y',1]]){
        const direction=axis==='x'?attacker.facing:1;
        let distance=(this.pos[axis]-attacker.pos[axis])*direction/scale;
        for(const key of ['mindist','maxdist','snap'])if(hit[key]!==undefined){
          const amount=Array.isArray(hit[key])?hit[key][index]:index===0?hit[key]:undefined;if(amount===undefined)continue;
          distance=key==='mindist'?Math.max(distance,amount):key==='maxdist'?Math.min(distance,amount):amount;
        }
        this.pos[axis]=attacker.pos[axis]+distance*direction*scale;
      }
    }
    const state = override ? override.stateNo : !guarded && hit.p2stateno >= 0 ? hit.p2stateno : guarded&&!knockout ? (airborne ? 154 : this.stateType === 'C' ? 152 : 150) : downed?5080:!airborne&&this.getHitVars.groundtype===3?5070:airborne ? 5020 : this.stateType === 'C' ? 5010 : 5000;
    if (override?.forceAir) this.stateType = 'A';
    if (!this.changeState(state,undefined,!guarded && !override && hit.p2stateno >= 0 ? foreignOwner : this)) {
      this.moveType = 'H'; this.vel = { x: xvel * this.coordinateScale, y: yvel * this.coordinateScale };
      this.diagnostic('missing-hit-state', `Hit state ${state} is missing; full hit reaction cannot execute.`);
    }
    this.moveType = 'H';
    if (attacker) {
      recordHitContact(attacker,hit,guarded);
      attacker.hitPauseTime = Math.max(attacker.hitPauseTime, pause?.[0] || 0);
      if (!attacker.targets.includes(this)) attacker.targets.push(this);
      attacker.targetHitIds?.set(this.id,hit.id??0);
      const {get:getPower,give:givePower}=hitPower(hit,this.world?.combatRules);
      attacker.power = clamp(attacker.power + (getPower[guarded ? 1 : 0] || 0), 0, attacker.maxPower);
      this.power = clamp(this.power + (givePower[guarded ? 1 : 0] || 0), 0, this.maxPower);
    }
    if (attacker) {
      attacker.sprPriority = hit.p1sprpriority ?? 1; this.sprPriority = hit.p2sprpriority ?? 0;
      if (!guarded && hit.p1stateno >= 0) attacker.changeState(hit.p1stateno,undefined,hit.stateOwner||attacker.stateOwner);
    }
    this.events.push({ type: 'hit', damage, guarded, attacker: attacker?.id });
    return { damage, guarded,cornerPush };
  }

  attributeMatches(filter, attr) {
    return matchAttribute(filter,attr);
  }
  matchingHitOverride(hit){
    for(let slot=0;slot<8;slot++){const value=this.hitOverrides.get(slot);if(value?.time&&matchAttribute(value.attribute||value.attr,hit.attr))return value;}return null;
  }
  canBeHit(hit,attacker) {
    if(!allowsHitActivation(this,hit,attacker))return false;
    if (this.world?.isSuperUnhittable(this)) return false;
    for(const filter of this.hitFilters)if(filter?.time&&!filterAllows(filter,hit.attr))return false;
    const typeNone=String(hit[this.stateType==='A'?'air.type':'ground.type']??hit['ground.type']??'high').toLowerCase()==='none';
    if(!typeNone&&this.matchingHitOverride(hit)&&(hit.p1stateno>=0||hit.p2getp1state===1||hit.p2stateno>=0&&hit.p2getp1state!==0))return false;
    return !this.asserted.has('unhittable');
  }

  explodController(controller) { return executeExplod(this,controller); }
  updateExplods(context={}) { return advanceExplods(this,context); }
  updateBinding() {
    const binding = this.bound;
    if (!binding) return;
    if(binding.target.destroyed){this.bound=null;return;}
    this.pos.x = binding.target.pos.x + binding.x * binding.target.facing;
    this.pos.y = binding.target.pos.y + binding.y;
    if (binding.facing) this.facing = binding.target.facing * (binding.facing < 0 ? -1 : 1);
    if (binding.time > 0 && --binding.time === 0) this.bound = null;
  }
}
