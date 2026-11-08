// Run the existing behavioral regression corpus through the compiled backend.
// The interpreter remains an independently authored oracle for uncovered paths.
import { FighterRuntime } from "../../src/runtime.js";
import { WasmExpressions } from "../../src/core/wasm-expressions.js";
import { programExpressions } from "../../src/core/session.js";
const evaluate = FighterRuntime.prototype.evaluate,
  programs = new WeakMap();
FighterRuntime.prototype.evaluate = function (
  source,
  controller,
  typed = false,
) {
  if (!this.options.expressionEvaluator) {
    let backend = programs.get(this.program);
    if (!backend) {
      backend = new WasmExpressions(programExpressions([this.program]));
      programs.set(this.program, backend);
    }
    this.options.expressionEvaluator = (text, context) =>
      backend.evaluate(text, context);
  }
  return evaluate.call(this, source, controller, typed);
};
