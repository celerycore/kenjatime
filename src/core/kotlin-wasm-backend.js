/**
 * Opt-in Kotlin/Wasm adapter. The production JS CoreSession is not changed.
 * Use the generated Kotlin ESM module with its relative .wasm/import-object files.
 */
export async function loadKotlinCore(moduleUrl) {
  if (typeof moduleUrl !== "string" || !moduleUrl.trim())
    throw new TypeError("A compiled Kotlin/Wasm .mjs URL is required");
  const imported = await import(/* @vite-ignore */ moduleUrl);
  const produced = typeof imported.default === "function"
    ? await imported.default() : imported.default;
  // Kotlin toolchain output may export directly or wrap an initialized instance.
  const api = [imported, produced, produced?.exports, imported.default?.exports]
    .find(value => value && typeof value.ktCoreCreate === "function");
  if (!api) throw new Error("The Kotlin/Wasm combat functions are not exported");
  return {
    version: api.ktCoreVersion(),
    create({ player1, player2, positions, arena, round } = {}) {
      if (!player1?.name || !player2?.name)
        throw new TypeError("Both fighters need a name");
      const handle = typeof api.ktCoreCreateWithCommands === "function"
        ? api.ktCoreCreateWithCommands(
            player1.name, player2.name,
            player1.air ?? "", player2.air ?? "",
            player1.cns ?? "", player2.cns ?? "",
            player1.cmd ?? "", player2.cmd ?? "",
          )
        : api.ktCoreCreate(
            player1.name, player2.name,
            player1.air ?? "", player2.air ?? "",
            player1.cns ?? "", player2.cns ?? "",
          );
      let closed = false;
      const assertOpen = () => {
        if (closed) throw new Error("Fight released");
      };
      const setup = ({ p1 = { x: -70, y: 0 }, p2 = { x: 70, y: 0 } } = {}) => {
        assertOpen();
        if (typeof api.ktCoreSetup !== "function")
          throw new Error("Kotlin/Wasm build does not expose positional setup");
        const fixed = n => {
          if (!Number.isFinite(n) || Math.abs(n) >= 8_388_608)
            throw new RangeError("World coordinates must be finite, bounded numbers");
          return Math.trunc(n * 256);
        };
        api.ktCoreSetup(handle, fixed(p1.x), fixed(p1.y), fixed(p2.x), fixed(p2.y));
      };
      const configureArena = ({ left=-150, right=150, ground=0, pushPlayers=true, autoFaceIdle=false } = {}) => {
        assertOpen();
        if (typeof api.ktCoreConfigureArena !== "function")
          throw new Error("This Kotlin/Wasm build does not support arena simulation");
        if (![left,right,ground].every(n => Number.isSafeInteger(n) && n>=-100000 && n<=100000) || left>=right)
          throw new RangeError("Arena boundaries must be finite ordered integer pixels");
        api.ktCoreConfigureArena(handle,left,right,ground,!!pushPlayers,!!autoFaceIdle);
      };
      const enableRoundFlow = ({
        introFrames=90,roundFrames=45,fightFrames=30,koFrames=60,outroFrames=90,timerSeconds=99
      } = {}) => {
        assertOpen();
        if (typeof api.ktCoreEnableRoundFlow !== "function")
          throw new Error("This Kotlin/Wasm build does not support round sequencing");
        const values=[introFrames,roundFrames,fightFrames,koFrames,outroFrames,timerSeconds];
        if (!values.every(n => Number.isSafeInteger(n) && n>=0 && n<=3600) || timerSeconds<1)
          throw new RangeError("Round durations must be bounded integer tick counts");
        api.ktCoreEnableRoundFlow(handle,...values);
      };
      try {
        if (positions) setup(positions);
        if (arena) configureArena(arena);
        if (round) enableRoundFlow(round);
      } catch (error) {
        api.ktCoreRelease(handle);
        closed = true;
        throw error;
      }
      return {
        step(a = {}, b = {}) {
          assertOpen();
          return api.ktCoreStep(handle,
            a.directions ?? 0, a.buttons ?? "",
            b.directions ?? 0, b.buttons ?? "");
        },
        advance(a = {}, b = {}) {
          assertOpen();
          if (typeof api.ktCoreAdvance === "function")
            api.ktCoreAdvance(handle,a.directions ?? 0,a.buttons ?? "",
              b.directions ?? 0,b.buttons ?? "");
          else api.ktCoreStep(handle,a.directions ?? 0,a.buttons ?? "",
              b.directions ?? 0,b.buttons ?? "");
        },
        checksum() {
          assertOpen();
          return typeof api.ktCoreChecksum === "function"
            ? api.ktCoreChecksum(handle) : null;
        },
        snapshot(side = 0) {
          assertOpen();
          return JSON.parse(api.ktCoreSnapshot(handle, side));
        },
        contacts() {
          assertOpen();
          return typeof api.ktCoreContacts === "function"
            ? JSON.parse(api.ktCoreContacts(handle)) : [];
        },
        presentationEvents() {
          assertOpen();
          return typeof api.ktCoreEvents === "function"
            ? JSON.parse(api.ktCoreEvents(handle)) : [];
        },
        entities() {
          assertOpen();
          return typeof api.ktCoreEntities === "function"
            ? JSON.parse(api.ktCoreEntities(handle)) : { helpers: 0, projectiles: 0 };
        },
        issues() {
          assertOpen();
          return api.ktCoreIssues(handle).split("\n").filter(Boolean);
        },
        exportMacro(side = 0, name = "kenjatime_macro") {
          assertOpen();
          if (typeof api.ktCoreExportMacro !== "function")
            throw new Error("This Kotlin/Wasm build does not support input macros");
          return api.ktCoreExportMacro(handle, side, name);
        },
        sharedAssetCount() {
          assertOpen();
          return typeof api.ktCoreAssetRegistrySize === "function"
            ? api.ktCoreAssetRegistrySize() : null;
        },
        setup,
        configureArena,
        enableRoundFlow,
        roundState() {
          assertOpen();
          return typeof api.ktCoreRoundState === "function"
            ? JSON.parse(api.ktCoreRoundState(handle)) : {enabled:false};
        },
        camera() {
          assertOpen();
          return typeof api.ktCoreCamera === "function"
            ? JSON.parse(api.ktCoreCamera(handle)) : { enabled: false };
        },
        close() {
          if (!closed) {
            closed = true;
            api.ktCoreRelease(handle);
          }
        },
      };
    },
  };
}
