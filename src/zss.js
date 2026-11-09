/** Independently authored, data-only ZSS parser. No JavaScript evaluation. */
import { splitArguments, parseExpression } from "./expressions.js";

export class ZssError extends Error {
  constructor(message, source, line) {
    super(message);
    this.source = source;
    this.line = line;
  }
}

function splitTop(text, separator) {
  const out = [];
  let start = 0,
    depth = 0,
    quote = false,
    escaped = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"' && !escaped) quote = !quote;
    if (!quote) {
      if ("([".includes(c)) depth++;
      if (")]".includes(c)) depth--;
      if (!depth && c === separator) {
        out.push(text.slice(start, i).trim());
        start = i + 1;
      }
    }
    escaped = c === "\\" && !escaped;
  }
  out.push(text.slice(start).trim());
  return out;
}

class Parser {
  constructor(text, source) {
    if (text.length > 2 * 1024 * 1024)
      throw new ZssError("ZSS file exceeds 2 MiB.", source, 1);
    this.text = text.replace(/^\uFEFF/, "");
    this.source = source;
    this.at = 0;
    this.line = 1;
    this.nodes = 0;
    this.depth = 0;
    this.scope = new Set();
    this.expressions = new Set();
  }
  fail(message) {
    throw new ZssError(message, this.source, this.line);
  }
  take() {
    const c = this.text[this.at++];
    if (c === "\n") this.line++;
    return c;
  }
  skip() {
    for (;;) {
      while (/\s/.test(this.text[this.at] || "") && this.at < this.text.length)
        this.take();
      if (this.text[this.at] !== "#") return;
      while (this.at < this.text.length && this.take() !== "\n") {}
    }
  }
  word() {
    this.skip();
    const m = /^[a-z_][a-z0-9_.]*/i.exec(this.text.slice(this.at));
    if (!m) this.fail("Expected an identifier.");
    this.at += m[0].length;
    return m[0];
  }
  is(word) {
    this.skip();
    return new RegExp("^" + word + "(?![a-z0-9_.])", "i").test(
      this.text.slice(this.at),
    );
  }
  expect(c) {
    this.skip();
    if (this.take() !== c) this.fail(`Expected '${c}'.`);
  }
  read(stops) {
    let result = "",
      depth = 0,
      quote = false,
      escaped = false;
    while (this.at < this.text.length) {
      const c = this.text[this.at];
      if (
        !quote &&
        !depth &&
        stops.includes(c) &&
        !(c === ":" && this.text[this.at + 1] === "=")
      )
        break;
      if (!quote && c === "#") {
        while (this.at < this.text.length && this.take() !== "\n") {}
        result += " ";
        continue;
      }
      result += this.take();
      if (c === '"' && !escaped) quote = !quote;
      if (!quote) {
        if ("([".includes(c)) depth++;
        if (")]".includes(c) && --depth < 0)
          this.fail("Unbalanced expression.");
      }
      escaped = c === "\\" && !escaped;
    }
    if (quote || depth) this.fail("Unterminated expression.");
    return result.trim();
  }
  local(name) {
    if (!/^[a-z_][a-z0-9_]*$/i.test(name))
      this.fail("Invalid local variable name.");
    this.scope.add(name);
    if (this.scope.size > 256)
      this.fail("ZSS local-variable limit (256) exceeded.");
  }
  expr(text, validate = true) {
    if (!text || text.length > 8192)
      this.fail("Empty or oversized ZSS expression.");
    let result = "",
      quote = false,
      escaped = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (!quote && c === "$") {
        const m = /^[a-z_][a-z0-9_]*/i.exec(text.slice(i + 1));
        if (!m || !this.scope.has(m[0]))
          this.fail(`Unknown local variable near ${text.slice(i, i + 40)}.`);
        result += `zsslocal("${m[0]}")`;
        i += m[0].length;
        continue;
      }
      result += c;
      if (c === '"' && !escaped) quote = !quote;
      escaped = c === "\\" && !escaped;
    }
    if (validate)
      try {
        parseExpression(result);
      } catch (error) {
        this.fail(error.message);
      }
    this.expressions.add(result);
    return result;
  }
  parameters(text, line) {
    const entries = [],
      values = {};
    for (const part of splitTop(text, ";").filter(Boolean)) {
      const m = /^([a-z_][a-z0-9_.]*)\s*:\s*([\s\S]*)$/i.exec(part);
      if (!m) this.fail("Expected parameter: value.");
      const key = m[1].toLowerCase(),
        value = m[2].trim() ? this.expr(m[2], false) : '';
      entries.push({ key, value, line });
      values[key] = value;
    }
    return { entries, values };
  }
  block(loopDepth = 0) {
    this.expect("{");
    if (++this.depth > 64) this.fail("ZSS nesting limit (64) exceeded.");
    const body = this.statements(loopDepth, true);
    this.expect("}");
    this.depth--;
    return body;
  }
  statements(loopDepth = 0, nested = false, caseBody = false) {
    const nodes = [];
    for (;;) {
      this.skip();
      const c = this.text[this.at];
      if (c === "}" || (caseBody && (this.is("case") || this.is("default"))))
        break;
      if (this.at >= this.text.length || (!nested && c === "[")) break;
      if (c === ";") {
        this.take();
        continue;
      }
      if (++this.nodes > 20000)
        this.fail("ZSS statement limit (20,000) exceeded.");
      nodes.push(this.statement(loopDepth));
    }
    return nodes;
  }
  call(text) {
    const m = /^call\s+([a-z_][a-z0-9_]*)\s*\(([\s\S]*)\)$/i.exec(text);
    if (!m) this.fail("Invalid function call.");
    return {
      kind: "call",
      name: m[1],
      args: m[2].trim() ? splitArguments(m[2]).map((v) => this.expr(v)) : [],
    };
  }
  statement(loopDepth) {
    if (++this.depth > 64) this.fail("ZSS nesting limit (64) exceeded.");
    try {
      return this.readStatement(loopDepth);
    } finally {
      this.depth--;
    }
  }
  readStatement(loopDepth) {
    this.skip();
    const line = this.line,
      source = this.source;
    let ignoreHitPause = false,
      persistent = 1,
      modified = false;
    while (this.is("ignorehitpause") || this.is("persistent")) {
      modified = true;
      const name = this.word().toLowerCase();
      if (name === "ignorehitpause") ignoreHitPause = true;
      else {
        this.expect("(");
        const raw = this.read(")");
        this.expect(")");
        if (!/^\d+$/.test(raw) || Number(raw) > 2147483647)
          this.fail("persistent requires a nonnegative integer constant.");
        persistent = Number(raw);
      }
    }
    const base = { source, line, ignoreHitPause, persistent };
    if (this.text[this.at] === "{")
      return { ...base, kind: "block", body: this.block(loopDepth) };
    const name = this.word(),
      lower = name.toLowerCase();
    if (lower === "if") {
      const condition = this.expr(this.read("{")),
        yes = this.block(loopDepth);
      this.skip();
      let no = [];
      if (this.is("else")) {
        this.word();
        this.skip();
        no =
          this.text[this.at] === "{"
            ? this.block(loopDepth)
            : [this.statement(loopDepth)];
      }
      return { ...base, kind: "if", condition, yes, no };
    }
    if (modified)
      this.fail(
        "ignoreHitPause/persistent must prefix an if statement or a braced block.",
      );
    if (lower === "while")
      return {
        ...base,
        kind: "while",
        condition: this.expr(this.read("{")),
        body: this.block(loopDepth + 1),
      };
    if (lower === "for") {
      const parts = splitTop(this.read("{"), ";");
      if (parts.length < 2 || parts.length > 3)
        this.fail("for requires start; end; optional step.");
      let variable = null,
        start = parts[0];
      const m = /^([a-z_][a-z0-9_]*)\s*=\s*([\s\S]+)$/i.exec(start);
      if (m) {
        variable = m[1];
        this.local(variable);
        start = m[2];
      }
      return {
        ...base,
        kind: "for",
        variable,
        start: this.expr(start),
        end: this.expr(parts[1]),
        step: this.expr(parts[2] || "1"),
        body: this.block(loopDepth + 1),
      };
    }
    if (lower === "switch") {
      const expression = this.expr(this.read("{"));
      this.expect("{");
      if (++this.depth > 64) this.fail("ZSS nesting limit (64) exceeded.");
      const cases = [];
      let fallback = null;
      while (true) {
        this.skip();
        if (this.text[this.at] === "}") break;
        const label = this.word().toLowerCase();
        if (label === "case") {
          const values = splitTop(this.read(":"), ";").map((v) => this.expr(v));
          this.expect(":");
          cases.push({ values, body: this.statements(loopDepth, true, true) });
        } else if (label === "default" && !fallback) {
          this.expect(":");
          fallback = this.statements(loopDepth, true, true);
        } else this.fail("Expected case or a single default label.");
      }
      this.expect("}");
      this.depth--;
      return {
        ...base,
        kind: "switch",
        expression,
        cases,
        fallback: fallback || [],
      };
    }
    if (lower === "break" || lower === "continue") {
      if (!loopDepth) this.fail(`${lower} is only valid inside a loop.`);
      this.expect(";");
      return { ...base, kind: lower };
    }
    if (lower === "let") {
      const names = this.read("=")
        .split(",")
        .map((v) => v.trim());
      names.forEach((v) => this.local(v));
      this.expect("=");
      const value = this.read(";");
      this.expect(";");
      if (/^call\b/i.test(value))
        return { ...base, ...this.call(value), outputs: names };
      const values = splitArguments(value).map((v) => this.expr(v));
      if (names.length !== values.length)
        this.fail("Local assignment needs one value per name.");
      return { ...base, kind: "let", names, values };
    }
    if (lower === "call") {
      const value = "call " + this.read(";");
      this.expect(";");
      return { ...base, ...this.call(value) };
    }
    this.skip();
    if (this.text[this.at] === "{") {
      this.expect("{");
      const parameters = this.parameters(this.read("}"), line);
      this.expect("}");
      if (
        parameters.values.persistent !== undefined ||
        (parameters.values.ignorehitpause !== undefined && lower !== "explod")
      )
        this.fail(
          "Controller persistence/hitpause flags belong before a ZSS block.",
        );
      const entries = [
        { key: "type", value: lower, line },
        { key: "trigger1", value: "1", line },
        ...parameters.entries,
      ];
      return {
        ...base,
        kind: "controller",
        controller: {
          name: "state zss",
          source,
          line,
          type: lower,
          entries,
          values: { type: lower, trigger1: "1", ...parameters.values },
          language: "zss",
        },
      };
    }
    const statement = name + this.read(";");
    this.expect(";");
    const assignment =
      /^(?:(parent|root)\s*,\s*)?(var|fvar|sysvar|sysfvar|map)\s*\(/i.exec(
        statement,
      );
    if (assignment) {
      let at = assignment[0].length,
        depth = 1,
        quote = false,
        escaped = false;
      for (; at < statement.length; at++) {
        const c = statement[at];
        if (c === '"' && !escaped) quote = !quote;
        if (!quote) {
          if (c === "(") depth++;
          if (c === ")" && --depth === 0) break;
        }
        escaped = c === "\\" && !escaped;
      }
      const rhs = /^\s*:=\s*([\s\S]+)$/.exec(statement.slice(at + 1));
      if (depth === 0 && rhs) {
        const target = assignment[1]?.toLowerCase() || null,
          variable = assignment[2].toLowerCase(),
          index = statement.slice(assignment[0].length, at);
        return {
          ...base,
          kind: "assign",
          target,
          variable,
          index:
            variable === "map"
              ? index
                  .trim()
                  .replace(/^"(.*)"$/, "$1")
                  .toLowerCase()
              : this.expr(index),
          value: this.expr(rhs[1]),
        };
      }
    }
    return { ...base, kind: "expression", expression: this.expr(statement) };
  }
  parse() {
    const states = [],
      functions = [];
    while (this.at < this.text.length) {
      this.skip();
      if (this.at >= this.text.length) break;
      const line = this.line;
      this.expect("[");
      const text = this.read("]");
      this.expect("]");
      this.scope = new Set();
      if (/^statedef\b/i.test(text)) {
        const parts = splitTop(text, ";"),
          idExpression = this.expr(parts.shift().replace(/^statedef\s+/i, ""));
        const parameters = this.parameters(
            parts.filter(Boolean).join(";"),
            line,
          ),
          body = this.statements();
        states.push({
          source: this.source,
          line,
          name: "statedef zss",
          idExpression,
          ...parameters,
          zssNodes: body,
          localNames: [...this.scope],
          controllers: [],
        });
      } else {
        const m =
          /^function\s+([a-z_][a-z0-9_]*)\s*\(([^)]*)\)\s*(.*?)\s*$/i.exec(
            text,
          );
        if (!m) this.fail("Expected StateDef or Function header.");
        const args = m[2].trim() ? m[2].split(",").map((v) => v.trim()) : [],
          outputs = m[3]
            .replace(/^return\s+/i, "")
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
        [...args, ...outputs].forEach((v) => this.local(v));
        const body = this.statements();
        functions.push({
          source: this.source,
          line,
          name: m[1],
          args,
          outputs,
          localNames: [...this.scope],
          body,
        });
      }
    }
    return { states, functions, expressions: this.expressions };
  }
}

export function zssNodes(nodes, visit) {
  for (const node of nodes) {
    visit(node);
    for (const body of [
      node.body,
      node.yes,
      node.no,
      node.fallback,
      ...(node.cases || []).map((c) => c.body),
    ])
      if (body) zssNodes(body, visit);
  }
}

export function parseZss(text, source = "<zss>") {
  return new Parser(text, source).parse();
}
