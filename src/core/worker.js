import { createCoreRuntime } from "./runtime.js";
const runtime = createCoreRuntime((message, transfer = []) =>
  self.postMessage(message, transfer),
);
self.onmessage = ({ data }) => {
  if (data.type === "prepare") {
    try {
      runtime.prepare(data.canvas);
      self.postMessage({ type: "renderer-ready" });
    } catch (error) {
      runtime.stop();
      self.postMessage({
        type: "renderer-unavailable",
        message: error.message,
      });
    }
    return;
  }
  if (data.type === "start")
    runtime
      .start(data)
      .catch((error) =>
        self.postMessage({ type: "error", message: error.message }),
      );
  else runtime.control(data);
};
