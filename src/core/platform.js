import { Capacitor, registerPlugin } from "@capacitor/core";
import { App } from "@capacitor/app";
import { libraryDeadline } from "../library-recovery.js";

/** Original Android shell integration; the same arena UI runs in both hosts. */
export function connectCorePlatform(startup) {
  if (!Capacitor.isNativePlatform()) return;
  const device = registerPlugin("ArenaDevice");
  let battle = { active: false, paused: true };
  const applyBattleMode = () =>
    device
      .setBattleMode({
        enabled: battle.active,
        awake: battle.active && !battle.paused,
      })
      .catch(() => {});
  const step = startup?.begin("native-info", { critical: false });
  libraryDeadline(
    device.getStartupInfo(),
    "Android startup details unavailable.",
    2000,
  )
    .then((info) => {
      startup?.platform(info);
      step?.end();
    })
    .catch((error) => step?.fail(error));
  window.addEventListener("kenjatime:battle", ({ detail }) => {
    battle = { active: !!detail.active, paused: !!detail.paused };
    applyBattleMode();
  });
  App.addListener("appStateChange", (state) => {
    if (state.isActive) applyBattleMode();
    window.dispatchEvent(
      new CustomEvent("kenjatime:app-state", {
        detail: { active: state.isActive },
      }),
    );
  });
  App.addListener("backButton", () => {
    const menu = document.querySelector(".kenjatime-battle [data-menu]");
    if (menu) menu.click();
    else App.minimizeApp();
  });
}
