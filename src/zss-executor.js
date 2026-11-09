/** Bounded ZSS control flow using the engine's own typed expression evaluator. */
const zero = Object.freeze({ value: 0, float: false });
const pausedWork = new WeakMap();

function bodies(node) {
  return [
    node.body,
    node.yes,
    node.no,
    node.fallback,
    ...(node.cases || []).map((c) => c.body),
  ].filter(Boolean);
}
function hasPausedWork(node) {
  if (pausedWork.has(node)) return pausedWork.get(node);
  // The linker only permits calls to earlier definitions, so this is a DAG.
  // Cache every subtree, avoiding repeated scans of a shared function body.
  const pending = [[node, false]];
  while (pending.length) {
    const [next, complete] = pending.pop();
    if (pausedWork.has(next)) continue;
    if (next.ignoreHitPause) {
      pausedWork.set(next, true);
      continue;
    }
    const children = [...bodies(next).flat(), ...(next.function?.body || [])];
    if (complete) {
      pausedWork.set(
        next,
        children.some((child) => pausedWork.get(child)),
      );
    } else {
      pending.push([next, true]);
      for (const child of children)
        if (!pausedWork.has(child)) pending.push([child, false]);
    }
  }
  return pausedWork.get(node);
}
function number(value) {
  if (value?.bottom) throw value.error;
  if (typeof value?.value !== "number" || !Number.isFinite(value.value))
    throw Error(
      "ZSS locals and function values currently require finite numbers.",
    );
  return value.value;
}
function same(a, b) {
  return a.float || b.float
    ? Math.fround(number(a)) === Math.fround(number(b))
    : number(a) === number(b);
}
function locals(names) {
  return new Map(names.map((name) => [name, zero]));
}

export function runZss(actor, state, owner, paused) {
  const previous = actor._zssContext,
    previousOwner = actor._scriptOwner,
    previousController = actor._executing;
  const entry = actor._entrySerial;
  const context = { owner, locals: locals(state.localNames || []), depth: 0 };
  actor._zssContext = context;
  actor._scriptOwner = owner;
  const evaluate = (source, node) => actor.evaluate(source, node, true);
  const condition = (source, node) => {
    try {
      return number(evaluate(source, node)) !== 0;
    } catch (error) {
      if (error.bottom) return false;
      throw error;
    }
  };
  const step = (node) => {
    actor._executing = node;
    if (++actor._zssSteps > 20000) {
      const error = Error("ZSS instruction budget exceeded (20,000 per tick).");
      error.zssBudget = true;
      throw error;
    }
  };
  const changed = () => actor.destroyed || actor._entrySerial !== entry;
  function call(node, inherited) {
    const fn = node.function,
      caller = actor._zssContext;
    if (!fn) throw Error(`Unknown ZSS function ${node.name}.`);
    if (caller.depth >= 32)
      throw Error("ZSS function depth limit (32) exceeded.");
    const args = node.args.map((value) => evaluate(value, node));
    const frame = {
      owner,
      locals: locals(fn.localNames),
      depth: caller.depth + 1,
    };
    args.forEach((value, index) => frame.locals.set(fn.args[index], value));
    actor._zssContext = frame;
    try {
      const signal = execute(fn.body, inherited);
      return {
        signal,
        values: fn.outputs.map((name) => frame.locals.get(name) || zero),
      };
    } finally {
      actor._zssContext = caller;
    }
  }
  function execute(nodes, inherited = false) {
    for (const node of nodes) {
      if (changed()) return "transition";
      const ignore = inherited || node.ignoreHitPause;
      if (paused && !ignore && !hasPausedWork(node)) continue;
      step(node);
      const count = actor._controllerCounts.get(node) || 0;
      if (node.persistent !== 1) {
        actor._controllerCounts.set(node, count + 1);
        if (node.persistent === 0 ? count !== 0 : count % node.persistent !== 0)
          continue;
      }
      try {
        let signal;
        if (node.kind === "controller") actor.execute(node.controller);
        else if (node.kind === "expression") evaluate(node.expression, node);
        else if (node.kind === "assign") {
          const target =
            node.target === "parent"
              ? actor.parent
              : node.target === "root"
                ? actor.root
                : actor;
          if (!target || target.destroyed) {
            const error = Error("ZSS assignment target is unavailable.");
            error.bottom = true;
            throw error;
          }
          const index =
            node.variable === "map"
              ? node.index
              : number(evaluate(node.index, node));
          const value = number(evaluate(node.value, node));
          if (node.variable === "map") target.setMap(node.index, value);
          else target.assignVariable(node.variable, [index], value);
        } else if (node.kind === "let") {
          const values = node.values.map((value) => evaluate(value, node));
          values.forEach(number);
          node.names.forEach((name, index) =>
            actor._zssContext.locals.set(name, values[index]),
          );
        } else if (node.kind === "call") {
          const result = call(node, ignore);
          signal = result.signal;
          if (!signal)
            node.outputs?.forEach((name, index) =>
              actor._zssContext.locals.set(name, result.values[index]),
            );
        } else if (node.kind === "if")
          signal = execute(
            condition(node.condition, node) ? node.yes : node.no,
            ignore,
          );
        else if (node.kind === "block") signal = execute(node.body, ignore);
        else if (node.kind === "switch") {
          const selected = evaluate(node.expression, node);
          let body = node.fallback;
          for (const candidate of node.cases)
            if (
              candidate.values.some((value) =>
                same(selected, evaluate(value, node)),
              )
            ) {
              body = candidate.body;
              break;
            }
          signal = execute(body, ignore);
        } else if (node.kind === "break" || node.kind === "continue")
          return node.kind;
        else if (node.kind === "while" || node.kind === "for") {
          let index, end, increment;
          if (node.kind === "for") {
            index = Math.trunc(number(evaluate(node.start, node)));
            end = Math.trunc(number(evaluate(node.end, node)));
            increment = Math.trunc(number(evaluate(node.step, node)));
            if (!increment) throw Error("ZSS for step cannot be zero.");
            if (node.variable)
              actor._zssContext.locals.set(node.variable, {
                value: index | 0,
                float: false,
              });
          }
          let iterations = 0;
          while (
            node.kind === "while"
              ? condition(node.condition, node)
              : increment > 0
                ? index <= end
                : index >= end
          ) {
            step(node);
            if (++iterations > 2500) {
              actor.diagnostic(
                "resource-limit",
                "ZSS loop stopped at 2,500 iterations.",
                node,
              );
              break;
            }
            const result = execute(node.body, ignore);
            if (result === "transition") return result;
            if (result === "break") break;
            if (node.kind === "for") index += increment;
            if (
              node.kind === "for" &&
              (increment > 0 ? index <= end : index >= end) &&
              node.variable
            )
              actor._zssContext.locals.set(node.variable, {
                value: index | 0,
                float: false,
              });
          }
        }
        if (signal) return signal;
      } catch (error) {
        if (error.zssBudget) throw error;
        if (!error.bottom) actor.diagnostic("zss-runtime", error.message, node);
      }
      if (changed()) return "transition";
    }
    return null;
  }
  try {
    execute(state.zssNodes);
  } catch (error) {
    actor.diagnostic(
      error.zssBudget ? "resource-limit" : "zss-runtime",
      error.message,
      actor._executing,
    );
  } finally {
    actor._zssContext = previous;
    actor._scriptOwner = previousOwner;
    actor._executing = previousController;
  }
}
