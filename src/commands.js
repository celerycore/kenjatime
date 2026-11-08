/** MUGEN CMD commands. Input is sampled once per 60 Hz simulation tick. */
const BUTTONS = ['a', 'b', 'c', 'x', 'y', 'z', 's'];
const DIRECTIONS = ['U', 'D', 'B', 'F', 'UB', 'UF', 'DB', 'DF'];
const PHYSICAL_KEYS = new Set(['U', 'D', 'L', 'R', ...BUTTONS]);
const MAX_TIME = 3600;
const MAX_SEQUENCE = 128;
const MAX_COMMANDS = 4096;

function uncomment(line) {
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if ((char === '"' || char === "'") && (!quote || quote === char)) quote = quote ? null : char;
    else if (char === ';' && !quote) return line.slice(0, i).trim();
  }
  return line.trim();
}

function unquote(value) {
  const match = value.match(/^(?:"([\s\S]*)"|'([\s\S]*)')$/);
  return match ? match[1] ?? match[2] : value;
}

function parseSymbol(source) {
  let rest = source.replace(/\s/g, '');
  if (!rest) throw Error('Empty command symbol.');
  const result = { source, strict: false, hold: false, release: false, charge: 0, tolerant: false };
  const seen = new Set();
  while (/^[>\/~$]/.test(rest)) {
    const modifier = rest[0];
    if (seen.has(modifier)) throw Error(`Repeated ${modifier} modifier in ${source}.`);
    seen.add(modifier);
    rest = rest.slice(1);
    if (modifier === '>') result.strict = true;
    if (modifier === '/') result.hold = true;
    if (modifier === '$') result.tolerant = true;
    if (modifier === '~') {
      result.release = true;
      const charge = rest.match(/^\d+/);
      if (charge) {
        result.charge = Number(charge[0]);
        if (!Number.isSafeInteger(result.charge) || result.charge > MAX_TIME) {
          throw Error(`Charge duration exceeds the ${MAX_TIME}-tick runtime limit.`);
        }
        rest = rest.slice(charge[0].length);
      }
    }
  }
  if (result.hold && result.release) throw Error(`Hold and release cannot be combined in ${source}.`);
  const parts = rest.split('+');
  if (parts.some(part => !part) || new Set(parts).size !== parts.length) {
    throw Error(`Invalid simultaneous input ${source}.`);
  }
  if (parts.length === 1 && DIRECTIONS.includes(parts[0])) {
    result.kind = 'direction';
    result.keys = parts;
    result.key = (result.tolerant ? '$' : '') + parts[0];
  } else if (parts.every(part => BUTTONS.includes(part))) {
    if (result.tolerant) throw Error(`The $ modifier is only valid on directions: ${source}.`);
    result.kind = 'button';
    result.keys = parts;
  } else if(parts.filter(part=>DIRECTIONS.includes(part)).length===1&&parts.every(part=>DIRECTIONS.includes(part)||BUTTONS.includes(part))){
    result.kind='chord';
    result.keys=parts.map(part=>DIRECTIONS.includes(part)&&result.tolerant?'$'+part:part);
  } else {
    throw Error(`Unsupported command symbol ${source}. Directions are uppercase and buttons are lowercase.`);
  }
  return result;
}

function parseSequence(source) {
  const symbols = source.split(',').map(parseSymbol);
  const sequence = [];
  for (const symbol of symbols) {
    const previous = sequence.at(-1);
    // MUGEN expands repeated directional presses to require a clean release/repress.
    if (previous?.kind === 'direction' && symbol.kind === 'direction'
      && previous.key === symbol.key && !previous.hold && !previous.release && !symbol.hold && !symbol.release) {
      sequence.push({ ...symbol, source: `>~${symbol.key}`, strict: true, release: true, charge: 0 });
      sequence.push({ ...symbol, strict: true });
    } else sequence.push(symbol);
  }
  if (sequence.length > MAX_SEQUENCE) throw Error(`Command exceeds the ${MAX_SEQUENCE}-symbol runtime limit.`);
  return sequence;
}

/** Repeated [Command] sections and names are deliberately preserved. */
export function parseCommands(text) {
  const sections = [];
  let section;
  for (const [index, raw] of String(text).replace(/^\uFEFF|^ï»¿/, '').split(/\r?\n/).entries()) {
    const line = uncomment(raw);
    const heading = line.match(/^\[([^\]]+)\]$/);
    if (heading) {
      section = { name: heading[1].trim().toLowerCase(), line: index + 1, values: {} };
      sections.push(section);
    } else if (section) {
      const equal = line.indexOf('=');
      if (equal > 0) section.values[line.slice(0, equal).trim().toLowerCase()] = line.slice(equal + 1).trim();
    }
  }
  const diagnostics = [];
  const defaults = { time: 15, bufferTime: 1 };
  const remap = Object.fromEntries(BUTTONS.map(key => [key, key]));
  const report = (section, message, name = unquote(section.values.name ?? '')) => {
    diagnostics.push({ kind: 'command', name, line: section.line, message });
  };
  function timing(source, fallback, section, label, maximum) {
    if (source == null) return fallback;
    if (!/^[-+]?\d+$/.test(source.trim()) || !Number.isSafeInteger(Number(source))) {
      throw Error(`${label} must be an integer.`);
    }
    const value = Math.max(1, Number(source));
    if (value > maximum) {
      if (label === 'buffer.time' || label === 'command.buffer.time') return maximum;
      throw Error(`${label} exceeds the ${maximum}-tick runtime limit.`);
    }
    return value;
  }
  for (const current of sections) {
    if (current.name === 'defaults') {
      try {
        defaults.time = timing(current.values['command.time'], defaults.time, current, 'command.time', MAX_TIME);
        defaults.bufferTime = timing(current.values['command.buffer.time'], defaults.bufferTime, current, 'command.buffer.time', 30);
      } catch (error) { report(current, error.message); }
    }
    if (current.name === 'remap') {
      for (const [oldButton, value] of Object.entries(current.values)) {
        const newButton = unquote(value);
        if (!BUTTONS.includes(oldButton) || (newButton && !BUTTONS.includes(newButton))) {
          report(current, `Unsupported button remap ${oldButton} = ${value}.`);
        } else remap[oldButton] = newButton;
      }
    }
  }
  const commands = [];
  for (const current of sections) {
    if (current.name !== 'command') continue;
    if (commands.length >= MAX_COMMANDS) {
      report(current, `Command count exceeds the ${MAX_COMMANDS}-command runtime limit.`);
      break;
    }
    const { values } = current;
    const name = unquote(values.name ?? '');
    try {
      if (!name) throw Error('Command is missing its name.');
      if (!values.command) throw Error('Command is missing its input sequence.');
      const sequence = parseSequence(values.command);
      commands.push({
        name,
        command: values.command,
        sequence,
        time: timing(values.time, defaults.time, current, 'time', MAX_TIME),
        bufferTime: timing(values['buffer.time'], defaults.bufferTime, current, 'buffer.time', 30),
        line: current.line,
        holdOnly: sequence.every(symbol => symbol.hold),
      });
    } catch (error) { report(current, error.message, name); }
  }
  return { commands, defaults, remap, diagnostics };
}

function relativeKeys(raw, facing, remap) {
  const keys = new Set();
  if (raw.has('U') !== raw.has('D')) keys.add(raw.has('U') ? 'U' : 'D');
  if (raw.has('L') !== raw.has('R')) keys.add(raw.has(facing < 0 ? 'L' : 'R') ? 'F' : 'B');
  for (const key of BUTTONS) if (raw.has(key) && remap[key]) keys.add(remap[key]);
  return keys;
}

function heldPredicates(keys) {
  const held = new Set(BUTTONS.filter(key => keys.has(key)));
  const direction = (keys.has('U') ? 'U' : keys.has('D') ? 'D' : '')
    + (keys.has('B') ? 'B' : keys.has('F') ? 'F' : '');
  if (direction) held.add(direction);
  for (const token of DIRECTIONS) if ([...token].every(key => keys.has(key))) held.add('$' + token);
  return held;
}

function symbolKeys(symbol) { return symbol.kind === 'direction' ? [symbol.key] : symbol.keys; }

function matches(symbol, sample) {
  const keys = symbolKeys(symbol);
  if (symbol.hold) return keys.every(key => sample.held.has(key));
  if (symbol.release) {
    return keys.every(key => sample.released.has(key) && (sample.previousDurations.get(key) ?? 0) >= symbol.charge);
  }
  return keys.every(key => symbol.kind==='chord'&&!BUTTONS.includes(key)?sample.held.has(key):sample.pressed.has(key));
}

function signatures(symbol) {
  if (symbol.hold) return [];
  const edge = symbol.release ? 'release:' : 'press:';
  if(symbol.kind==='chord')return symbol.keys.filter(key=>BUTTONS.includes(key)||symbol.release).map(key=>edge+(BUTTONS.includes(key)?key:'direction'));
  return symbol.kind === 'direction' ? [edge + 'direction'] : symbol.keys.map(key => edge + key);
}

function physicalKeysForSymbol(symbol, sample, remap) {
  if(symbol.kind==='chord'){
    const keys=new Set();for(const key of symbol.keys){
      if(BUTTONS.includes(key)){for(const physical of BUTTONS)if(remap[physical]===key)keys.add(physical);}
      else for(const direction of key.replace('$',''))keys.add(direction==='F'?(sample.facing<0?'L':'R'):direction==='B'?(sample.facing<0?'R':'L'):direction);
    }return keys;
  }
  if (symbol.kind === 'button') {
    return new Set(BUTTONS.filter(physical => symbol.keys.includes(remap[physical])));
  }
  return new Set([...symbol.keys[0]].map(key => key === 'F' ? (sample.facing < 0 ? 'L' : 'R')
    : key === 'B' ? (sample.facing < 0 ? 'R' : 'L') : key));
}

/** Bounded, deterministic input history. Call update exactly once per engine tick. */
export class CommandBuffer {
  constructor(parsed = { commands: [] }) {
    if (typeof parsed === 'string') parsed = parseCommands(parsed);
    this.commands = parsed.commands ?? [];
    this.remap = parsed.remap ?? Object.fromEntries(BUTTONS.map(key => [key, key]));
    this.diagnostics = [...(parsed.diagnostics ?? [])];
    this.historyLimit = Math.max(1, ...this.commands.map(command => command.time + 1));
    this.reset();
  }

  reset() {
    this.tick = -1;
    this.history = [];
    this.buffered = new Map();
    this.active = new Set();
    this.previous = { raw: new Set(), held: new Set(), durations: new Map() };
  }

  update(input, facing = 1) {
    this.tick++;
    const raw = new Set([...input].filter(key => PHYSICAL_KEYS.has(key)));
    const held = heldPredicates(relativeKeys(raw, facing, this.remap));
    const previous = this.previous;
    const sample = {
      tick: this.tick, raw, facing, held,
      pressed: new Set([...held].filter(key => !previous.held.has(key))),
      released: new Set([...previous.held].filter(key => !held.has(key))),
      previousDurations: previous.durations,
      durations: new Map([...held].map(key => [key, (previous.durations.get(key) ?? 0) + 1])),
      changes: new Set([...raw, ...previous.raw].filter(key => raw.has(key) !== previous.raw.has(key))),
    };
    this.previous = sample;
    this.history.push(sample);
    if (this.history.length > this.historyLimit) this.history.shift();
    this.active = new Set();
    let budget = 250000;
    for (const command of this.commands) {
      if (command.holdOnly) {
        if (command.sequence.every(symbol => matches(symbol, sample))) this.active.add(command.name);
        continue;
      }
      const holdsValid = command.sequence.every(symbol => !symbol.hold || matches(symbol, sample));
      if (holdsValid && matches(command.sequence.at(-1), sample) && this.matchSequence(command, () => --budget >= 0)) {
        this.buffered.set(command.name, this.tick + command.bufferTime - 1);
      }
      if ((this.buffered.get(command.name) ?? -1) >= this.tick) this.active.add(command.name);
      if (budget < 0) {
        if (!this.diagnostics.some(item => item.message === 'Input matching work limit reached.')) {
          this.diagnostics.push({ kind: 'command', message: 'Input matching work limit reached.' });
        }
        break;
      }
    }
    for (const [name, expires] of this.buffered) if (expires < this.tick) this.buffered.delete(name);
    return this.active;
  }

  matchSequence(command, spend) {
    const lastIndex = this.history.length - 1;
    const earliest = this.tick - command.time;
    let cursor = lastIndex;
    let nextMatch = null;
    let sameTickEvents = new Set();
    for (let i = command.sequence.length - 1; i >= 0; i--) {
      const symbol = command.sequence[i];
      const events = signatures(symbol);
      let found = -1;
      for (let j = cursor; j >= 0 && this.history[j].tick >= earliest; j--) {
        if (!spend()) return false;
        if (j < cursor) sameTickEvents = new Set();
        if (!matches(symbol, this.history[j]) || events.some(event => sameTickEvents.has(event))) continue;
        if (nextMatch?.symbol.strict && !this.strictBetween(j, nextMatch.index, symbol, nextMatch.symbol)) continue;
        found = j;
        break;
      }
      if (found < 0) return false;
      if (found !== cursor) sameTickEvents = new Set();
      for (const event of events) sameTickEvents.add(event);
      cursor = found;
      nextMatch = { index: found, symbol };
    }
    return true;
  }

  strictBetween(previousIndex, currentIndex, previousSymbol, currentSymbol) {
    const current = this.history[currentIndex];
    const allowed = physicalKeysForSymbol(currentSymbol, current, this.remap);
    if (previousIndex === currentIndex) {
      for (const key of physicalKeysForSymbol(previousSymbol, current, this.remap)) allowed.add(key);
      return [...current.changes].every(key => allowed.has(key));
    }
    for (let i = previousIndex + 1; i < currentIndex; i++) if (this.history[i].changes.size) return false;
    return [...current.changes].every(key => allowed.has(key));
  }
}
