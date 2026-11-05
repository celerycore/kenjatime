import {test} from 'node:test';
import assert from 'node:assert/strict';
import {zipSync, strToU8} from 'fflate';
import {archive} from '../src/formats.js';
import {TrainingMatch, transformedBoxes, boxesOverlap} from '../src/combat.js';
import {hitAttribute} from '../src/hit-filters.js';

function character({attack = '[0,0,40,-40]', hit = '', localcoord = '320,240', trigger = 'time = 0', air} = {}) {
  const [box = '0,0,40,-40'] = [attack.replace(/[\[\]]/g, '')];
  const files = {
    'fighter.def': `[Info]\nname = Test Fighter\nlocalcoord = ${localcoord}\n[Files]\ncns = fighter.cns\nst = fighter.cns\nanim = fighter.air\ncmd = fighter.cmd\nsprite = fighter.sff`,
    'fighter.cns': `[Data]\nlife = 1000\npower = 3000\nattack = 100\ndefence = 100\n[Size]\nxscale = 1\nyscale = 1\nground.back = 10\nground.front = 10\n[Statedef 0]\ntype = S\nmovetype = I\nphysics = N\nanim = 0\nctrl = 1\n[Statedef 200]\ntype = S\nmovetype = A\nphysics = N\nanim = 200\nctrl = 0\n[State 200, hit]\ntype = HitDef\ntrigger1 = ${trigger}\nattr = S, NA\ndamage = 100, 10\nhitflag = MAF\nguardflag = MA\npausetime = 0, 0\nground.velocity = 0, 0\nground.hittime = 10\n${hit}`,
    'fighter.air': air ?? `[Begin Action 0]\nClsn2Default: 1\nClsn2[0] = -10,-40,10,0\n0,0,0,0,-1\n[Begin Action 200]\nClsn1Default: 1\nClsn1[0] = ${box}\nClsn2Default: 1\nClsn2[0] = -10,-40,10,0\n0,0,0,0,-1`,
    'fighter.cmd': '',
    'fighter.sff': '',
  };
  return archive(zipSync(Object.fromEntries(Object.entries(files).map(([name, content]) => [name, strToU8(content)]))))[0];
}

function match(options = {}) {
  return new TrainingMatch(character(options), {pushboxes: false});
}

function attack(world, {x = -15, y = 0} = {}) {
  world.player.pos = {x, y};
  world.opponent.pos = {x: 15, y: 0};
  world.player.changeState(200);
}

test('collision transform uses facing, CNS scale and local coordinates while ignoring sprite-only AIR transforms', () => {
  const fighter = {
    character: {def: {info: {localcoord: '640,480'}}},
    program: {constants: new Map([['size.xscale', 2], ['size.yscale', .5]])},
    pos: {x: 100, y: -10}, facing: -1,
    currentFrame: {x: 3, y: 4, flip: 'HV', clsn1: [[-2, -8, 6, 12]], clsn2: []},
  };
  assert.deepEqual(transformedBoxes(fighter), [[94, -12, 102, -7]]);
  assert.deepEqual(transformedBoxes(fighter, 'clsn2'), []);
  fighter.program.constants.set('size.draw.offset.x', 2);
  fighter.program.constants.set('size.draw.offset.y', -4);
  fighter.drawOffset = {x: 5, y: 6};
  assert.deepEqual(transformedBoxes(fighter), [[98, -8, 106, -3]]);
  assert.equal(boxesOverlap([0, 0, 10, 10], [10, 0, 20, 10]), false);
});

test('distant attacks and frames without attack boxes do not cause proximity damage', () => {
  const world = match();
  world.player.changeState(200);
  for (let i = 0; i < 20; i++) world.tick();
  assert.equal(world.opponent.life, 1000);
  world.player.pos.x = world.opponent.pos.x - 25;
  world.player.changeState(0);
  world.tick();
  assert.equal(world.opponent.life, 1000);
});

test('a one-tick attack frame collides on the same AnimElem tick that activates HitDef', () => {
  const world = match({trigger: 'AnimElem = 2', air: `[Begin Action 0]\nClsn2Default: 1\nClsn2[0] = -10,-40,10,0\n0,0,0,0,-1\n[Begin Action 200]\nClsn2Default: 1\nClsn2[0] = -10,-40,10,0\n0,0,0,0,1\nClsn1: 1\nClsn1[0] = 0,-40,40,0\n0,0,0,0,1\n0,0,0,0,-1`});
  attack(world);
  assert.equal(world.tick().length, 0);
  assert.equal(world.opponent.life, 1000);
  assert.equal(world.tick().length, 1);
  assert.equal(world.opponent.life, 900);
  assert.equal(world.player.currentFrame.clsn1.length, 0);
  assert.equal(world.player.collisionFrame.clsn1.length, 1);
  assert.equal(transformedBoxes(world.player).length, 1);
});

test('a HitDef activation hits once, and a new activation can hit again', () => {
  const world = match();
  attack(world);
  assert.equal(world.tick().length, 1);
  assert.equal(world.opponent.life, 900);
  for (let i = 0; i < 20; i++) world.tick();
  assert.equal(world.opponent.life, 900);
  world.player.changeState(0);
  world.player.changeState(200);
  assert.equal(world.tick().length, 1);
  assert.equal(world.opponent.life, 800);
});

test('simultaneous equal-priority attacks trade from the same collision snapshot', () => {
  const world = match();
  attack(world);
  world.opponent.changeState(200);
  assert.equal(world.tick().length, 2);
  assert.equal(world.player.life, 900);
  assert.equal(world.opponent.life, 900);
});

test('priority selects the higher attack and equal Dodge prevents both contacts', () => {
  for (const [playerPriority, opponentPriority, expected] of [['3, Hit', '5, Hit', [900, 1000]], ['4, Dodge', '4, Hit', [1000, 1000]]]) {
    const world = new TrainingMatch(character({hit: `priority = ${playerPriority}`}), {opponentCharacter: character({hit: `priority = ${opponentPriority}`}), pushboxes: false});
    attack(world);
    world.opponent.changeState(200);
    world.tick();
    assert.deepEqual([world.player.life, world.opponent.life], expected);
  }
});

test('HitBy and NotHitBy reject collision without consuming the HitDef activation', () => {
  for (const [exclude, value] of [[true, 'SCA, NA'], [false, 'SCA, SA']]) {
    const world = match();
    attack(world);
    world.opponent.hitFilters[0] = {attribute:hitAttribute(value),exclude,time:4};
    for (let i = 0; i < 3; i++) world.tick();
    assert.equal(world.opponent.life, 1000);
    world.tick();
    assert.equal(world.opponent.life, 900);
  }
});

test('holding back with control guards only an allowed posture', () => {
  const world = match();
  attack(world);
  const [event] = world.tick(new Set(), new Set(['holdback']));
  assert.equal(event.guarded, true);
  assert.equal(world.opponent.life, 990);
  assert.equal(world.player.moveGuarded, 1);
  const unblockable = match({hit: 'guardflag = L'});
  attack(unblockable);
  assert.equal(unblockable.tick(new Set(), new Set(['holdback']))[0].guarded, false);
  assert.equal(unblockable.opponent.life, 900);
  const asserted = match({hit: '[State 200, unguardable]\ntype = AssertSpecial\ntrigger1 = 1\nflag = unguardable'});
  attack(asserted);
  assert.equal(asserted.tick(new Set(), new Set(['holdback']))[0].guarded, false);
  const kickButton = match();
  attack(kickButton);
  assert.equal(kickButton.tick(new Set(), new Set(['b']))[0].guarded, false);
});

test('a real collision transfers HitDef pause, knockback, hitstun and explicit power', () => {
  const world = match({hit: 'pausetime = 3, 4\nground.velocity = -3, -2\ngetpower = 80, 20\ngivepower = 50, 10'});
  attack(world);
  world.tick();
  assert.equal(world.player.hitPauseTime, 3);
  assert.equal(world.opponent.hitPauseTime, 4);
  assert.equal(!!world.opponent.ctrl, false);
  assert.equal(Math.abs(world.opponent.vel.x), 3);
  assert.equal(world.opponent.vel.y, -2);
  assert.equal(world.player.power, 80);
  assert.equal(world.opponent.power, 50);
  const position = {...world.opponent.pos};
  for (let i = 0; i < 4; i++) world.tick();
  assert.deepEqual(world.opponent.pos, position);
});

test('hitflag prevents invalid airborne, crouching and get-hit contacts', () => {
  for (const [flags, stateType, moveType, falling] of [['H', 'C', 'I', false], ['M', 'A', 'I', false], ['MA', 'A', 'H', true], ['M+', 'S', 'I', false], ['M-', 'S', 'H', false]]) {
    const world = match({hit: `hitflag = ${flags}`});
    attack(world);
    world.opponent.stateType = stateType;
    world.opponent.moveType = moveType;
    world.opponent.getHitVars.fall = falling ? 1 : 0;
    if (stateType === 'A') world.opponent.pos.y = -10;
    world.tick();
    assert.equal(world.opponent.life, 1000, `${flags} against ${stateType}/${moveType}/fall=${falling}`);
  }
});

test('kill=false stops at one life; a lethal hit finishes and reset restores both fighters', () => {
  const safe = match({hit: 'kill = 0'});
  attack(safe);
  safe.opponent.life = 50;
  safe.tick();
  assert.equal(safe.opponent.life, 1);
  assert.equal(safe.winner, null);
  const world = match();
  attack(world);
  world.opponent.life = 50;
  world.tick();
  assert.equal(world.opponent.life, 0);
  assert.equal(world.winner, 'player');
  assert.deepEqual(world.tick(), []);
  world.reset();
  assert.equal(world.player.id, 1);
  assert.equal(world.opponent.id, 2);
  assert.equal(world.opponent.teamSide, 2);
  assert.equal(world.player.life, 1000);
  assert.equal(world.opponent.life, 1000);
  assert.equal(world.player.pos.x, -70);
  assert.equal(world.opponent.pos.x, 70);
  assert.equal(world.winner, null);
});

test('hitpause freezes contacts and simple push separation respects stage bounds', () => {
  const world = new TrainingMatch(character());
  world.player.pos.x = 145;
  world.opponent.pos.x = 149;
  world.tick();
  assert.ok(world.opponent.pos.x <= 150);
  assert.ok(world.opponent.pos.x - world.player.pos.x >= 20);
  const paused = match();
  attack(paused);
  paused.player.hitPauseTime = 2;
  paused.tick();
  paused.tick();
  assert.equal(paused.opponent.life, 1000);
  paused.tick();
  assert.equal(paused.opponent.life, 900);
});

test('Width, PlayerPush and ScreenBound control separation and edge limits', () => {
  const world = new TrainingMatch(character());
  world.player.pos.x = 0;
  world.opponent.pos.x = 5;
  world.player.width = {front: 30, back: 7, edge: [25, 4]};
  world.opponent.width = {front: 20, back: 6, edge: [2, 5]};
  world.constrainPositions();
  assert.equal(world.opponent.pos.x - world.player.pos.x, 50);
  world.player.playerPush = false;
  world.player.pos.x = 0;
  world.opponent.pos.x = 5;
  world.constrainPositions();
  assert.equal(world.player.pos.x, 0);
  assert.equal(world.opponent.pos.x, 5);
  world.player.pos.x = 150;
  world.constrainPositions();
  assert.equal(world.player.pos.x, 125);
  world.player.screenBound = false;
  world.player.pos.x = -300;
  world.constrainPositions();
  assert.equal(world.player.pos.x, -300);
});

test('Native juggle points allow two 7-point falling hits from15, reject the third, and reset after recovery',()=>{
  const source=character({hit:'fall=1'});
  source.files['fighter.cns']=new TextEncoder().encode(new TextDecoder().decode(source.files['fighter.cns']).replace('[Statedef 200]','[Statedef 200]\njuggle=7'));
  const world=new TrainingMatch(source,{pushboxes:false});attack(world);world.tick();assert.equal(world.opponent.life,900);
  world.opponent.stateType='A';world.opponent.moveType='H';world.player.changeState(200);
  assert.equal(world.tick().length,1);assert.equal(world.opponent.life,800);
  world.opponent.stateType='A';world.player.changeState(200);assert.equal(world.tick().length,0);assert.equal(world.opponent.life,800);
  world.player.changeState(0);world.opponent.changeState(0);world.tick();
  world.player.changeState(200);assert.equal(world.tick().length,1);assert.equal(world.opponent.life,700);
});

test('D-only and F-only hitflags select downed and falling opponents without requiring extra posture flags',()=>{
  const down=match({hit:'hitflag=D\ndown.velocity=-2,0\ndown.hittime=15'});attack(down);down.opponent.stateType='L';down.opponent.moveType='H';
  assert.equal(down.tick().length,1);assert.equal(down.opponent.hitTime,15);
  const falling=match({hit:'hitflag=F'});attack(falling);falling.opponent.stateType='A';falling.opponent.moveType='H';falling.opponent.getHitVars.fall=1;
  assert.equal(falling.tick().length,1);
});
