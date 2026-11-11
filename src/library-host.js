import { charactersFromFiles } from "./formats.js";
import { stageDefinitions } from "./stages.js";
import {hasCommonEffects} from "./core/common-effects.js";
import { readArchiveFiles, unpackArchive } from "./uploads.js";
import { archiveVolumePlan } from "./archive-volumes.js";
import { exportArchiveVolumes } from "./archive-export.js";
import { exportFile } from "./export-file.js";
import { libraryDeadline } from "./library-recovery.js";
import {
  createStartupDiagnostics,
  browserStartupEnvironment,
} from "./startup-diagnostics.js";

let loadBuiltin,
  battle,
  creditsUrl,
  extraStages = [];
const databaseName = "kenjatime.core.library";
let corePromise,
  builtinCatalog,
  dbPromise,
  libraryUnavailable = false,
  startupReset,
  startup;
const measured = (code, work, options) =>
  startup ? startup.measure(code, work, options) : work({ note() {} });
const request = (r) =>
  libraryDeadline(
    new Promise((resolve, reject) => {
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    }),
    "The saved library did not respond. Use Reset library to start fresh.",
    8000,
    () => {
      try {
        r.transaction?.abort();
      } catch {}
    },
  );
function open() {
  if (dbPromise) return dbPromise;
  let expired = false;
  const step = startup?.begin("library-open");
  const pending = new Promise((resolve, reject) => {
    const r = indexedDB.open(databaseName, 2);
    r.onupgradeneeded = (event) => {
      if (expired) {
        r.transaction.abort();
        return;
      }
      step?.note({
        fromVersion: event.oldVersion,
        toVersion: event.newVersion,
        migrated: event.oldVersion > 0,
      });
      const db = r.result;
      if (!db.objectStoreNames.contains("packages"))
        db.createObjectStore("packages", { keyPath: "id" });
      if (!db.objectStoreNames.contains("files"))
        db.createObjectStore("files", { keyPath: "path" }).createIndex(
          "packageId",
          "packageId",
        );
      if (!db.objectStoreNames.contains("archives"))
        db.createObjectStore("archives", { keyPath: "id" });
    };
    r.onsuccess = () => {
      if (expired) {
        r.result.close();
        step?.note({ lateConnectionClosed: true });
        return;
      }
      step?.note({ databaseVersion: r.result.version });
      r.result.onversionchange = () => {
        r.result.close();
        dbPromise = null;
      };
      resolve(r.result);
    };
    r.onerror = () => reject(r.error);
    r.onblocked = () => {
      expired = true;
      reject(
        Object.assign(Error("Close other Kenjatime windows and try again."), {
          code: "library-blocked",
        }),
      );
    };
  });
  dbPromise = libraryDeadline(
    pending,
    "The saved library did not open. Use Reset library to start fresh.",
    8000,
    () => {
      expired = true;
    },
  )
    .then((db) => {
      step?.end();
      return db;
    })
    .catch((error) => {
      step?.fail(error);
      dbPromise = null;
      throw error;
    });
  return dbPromise;
}
function done(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onabort = tx.onerror = () =>
      reject(tx.error || Error("The library could not be saved."));
  });
}
async function core() {
  return (corePromise ??= measured("core-download", async (step) => {
    const files = await loadBuiltin();
    step.note({ files: Object.keys(files).length });
    return files;
  }).catch((error) => {
    corePromise = null;
    throw error;
  }));
}

function entries(
  files,
  prefix = "",
  packageId = null,
  packageName = "Included sample",
) {
  const characters = charactersFromFiles(files).map((c) => {
    const anim = c.checks.find((x) => x.key === "anim" && x.ok)?.path;
    return {
      id: prefix + c.path,
      name: c.def.info?.displayname || c.def.info?.name || c.path,
      author: c.def.info?.author || "",
      version: c.def.info?.versiondate || "",
      fileName: c.path.split("/").at(-1),
      packageName,
      ...(packageId ? { packageId } : {}),
      ...(c.sprite?.ok
        ? {
            sprite: prefix + c.sprite.path,
            spriteBytes: files[c.sprite.path].length,
          }
        : {}),
      ...(anim ? { anim: prefix + anim } : {}),
    };
  });
  const stages = stageDefinitions(files).map((s) => ({
    id: prefix + s.path,
    name: s.name,
    author: s.author || "",
    fileName: s.path.split("/").at(-1),
    packageName,
    ...(packageId ? { packageId } : {}),
  }));
  return { characters, stages };
}
async function packages() {
  const db = await open();
  return measured("library-read", () =>
    request(db.transaction("packages").objectStore("packages").getAll()),
  );
}
async function catalog() {
  const included = await core(),
    builtin = (builtinCatalog ??= measured("core-catalog", () => {
      const value = entries(included);
      value.stages.push(...extraStages);
      return value;
    }));
  if (libraryUnavailable)
    return {
      ...builtin,
      packages: [],
      warning:
        "Saved library unavailable. Use Reset library to start fresh. The included fighter is ready.",
    };
  let all = [];
  try {
    all = await packages();
  } catch {
    libraryUnavailable = true;
  }
  const saved = all.filter(
    (p) =>
      p &&
      typeof p.id === "string" &&
      Array.isArray(p.characters) &&
      Array.isArray(p.stages) &&
      p.characters.every((c) => c && typeof c.id === "string") &&
      p.stages.every((s) => s && typeof s.id === "string"),
  );

  startup?.metrics({
    packages: saved.length,
    characters: saved.reduce((n, p) => n + p.characters.length, 0),
    stages: saved.reduce((n, p) => n + p.stages.length, 0),
    legacyPackages: 0,
    invalidPackages: all.length - saved.length,
    knownArchiveBytes: saved.reduce(
      (n, p) => n + (Number.isFinite(p.archiveBytes) ? p.archiveBytes : 0),
      0,
    ),
    knownExpandedBytes: saved.reduce(
      (n, p) => n + (Number.isFinite(p.expandedBytes) ? p.expandedBytes : 0),
      0,
    ),
    knownFiles: saved.reduce(
      (n, p) => n + (Number.isFinite(p.fileCount) ? p.fileCount : 0),
      0,
    ),
    packagesWithoutSizes: saved.filter((p) => !Number.isFinite(p.archiveBytes))
      .length,
  });
  return {
    characters: [...builtin.characters, ...saved.flatMap((p) => p.characters)],
    stages: [...builtin.stages, ...saved.flatMap((p) => p.stages)],
    packages: [
      ...saved.map((p) => ({
        id: p.id,
        name: p.name,
        downloadable: !!p.archiveSaved,
        commonEffects: !!p.commonEffects,
      })),
    ],
    ...(libraryUnavailable || saved.length !== all.length
      ? {
          warning:
            "Some saved library data could not load. Use Reset library to start fresh. The included fighter is ready.",
        }
      : {}),
  };
}
async function pickFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "*/*";
    input.multiple = true;
    input.hidden = true;
    input.id = "engine-archive-file";
    input.onchange = () => {
      const files = Array.from(input.files || []);
      input.remove();
      resolve(files.length ? files : null);
    };
    input.oncancel = () => {
      input.remove();
      resolve(null);
    };
    document.body.append(input);
    input.click();
  });
}
async function resource(path) {
  const builtin = await core();
  if (builtin[path]) return new Blob([builtin[path]]);
  const db = await open(),
    row = await request(db.transaction("files").objectStore("files").get(path));
  if (!row) throw Error("The installed resource is missing.");
  return row.blob;
}
async function install(file, data) {
  const originals = Array.isArray(file) ? file : [file],
    plan = archiveVolumePlan(originals);
  file = originals.find((p) => p.name === plan.first);
  window.__kenjatimeNativeProgress?.(`Reading ${file.name}…`);
  const parts = await readArchiveFiles(originals, {
    onProgress: (m) => window.__kenjatimeNativeProgress?.(m),
  });
  const { files, characters, stages } = await unpackArchive(
    parts.length === 1 ? parts[0].bytes : parts,
    {
      password: data.password,
      prepareStageData: false,
      onProgress: (m) => window.__kenjatimeNativeProgress?.(m),
    },
  );
  if (data.kind === "stage" && !stages.length)
    throw Error("No stage DEF found. Choose a stage archive.");
  const commonEffects=hasCommonEffects(files);
  if (!characters.length && !stages.length && !commonEffects)
    throw Error("No character, stage, or complete fightfx AIR/SFF resource set found.");
  const id = crypto.randomUUID(),
    prefix = `imports/${id}/`,
    meta = {
      id,
      name: file.name,
      archiveSaved: true,
      archiveBytes: originals.reduce((n, p) => n + p.size, 0),
      archiveParts: originals.length,
      expandedBytes: Object.values(files).reduce((n, b) => n + b.length, 0),
      fileCount: Object.keys(files).length,
      commonEffects,
      ...entries(files, prefix, id, file.name),
    };
  const db = await open(),
    tx = db.transaction(["packages", "files", "archives"], "readwrite"),
    finished = done(tx);
  tx.objectStore("packages").put(meta);
  tx.objectStore("archives").put(
    originals.length === 1
      ? { id, name: file.name, blob: file }
      : {
          id,
          name: file.name,
          parts: originals.map((blob) => ({
            name: blob.name,
            blob,
            size: blob.size,
          })),
        },
  );
  for (const [path, bytes] of Object.entries(files))
    tx.objectStore("files").put({
      path: prefix + path,
      packageId: id,
      blob: new Blob([bytes]),
    });
  await finished;
  libraryUnavailable = false;
  return catalog();
}
export function createLibraryHost(options) {
  loadBuiltin = options.loadBuiltin;
  battle = options.battle;
  creditsUrl = options.creditsUrl;
  extraStages = options.extraStages || [];
  startup = createStartupDiagnostics({
    environment: browserStartupEnvironment(),
  });
  window.__kenjatimeStartup = startup;
  if (navigator.storage?.estimate)
    measured(
      "storage-estimate",
      (step) =>
        libraryDeadline(
          navigator.storage.estimate(),
          "Storage estimate unavailable.",
          1500,
        ).then((info) => {
          step.note({
            usageBytes: info.usage || 0,
            quotaBytes: info.quota || 0,
          });
        }),
      { critical: false },
    ).catch(() => {});
  return {
    diagnostics: startup,
    resource,
    selectionKey: "kenjatime.core.selection",
    canResetLibrary: true,
    importFile: (file, data = {}) => install(file, data),
    async request(action, data = {}) {
      if (action === "catalog") {
        const url = new URL(location.href);
        if (url.searchParams.get("reset-library") === "1") {
          url.searchParams.delete("reset-library");
          history.replaceState(history.state, "", url);
          window.__kenjatimeNativeProgress?.("Resetting your library…");
          startupReset = measured("library-reset", async () => {
            if (dbPromise) {
              try {
                (await dbPromise).close();
              } catch {}
            }
            dbPromise = null;
            await libraryDeadline(
              new Promise((yes, no) => {
                const r = indexedDB.deleteDatabase(databaseName);
                r.onsuccess = yes;
                r.onerror = () => no(r.error);
                r.onblocked = () =>
                  no(Error("Close other Core preview tabs and try again."));
              }),
              "The Core library could not be reset.",
            );
          }).then(() => {
            libraryUnavailable = false;
          });
        }
        if (startupReset) {
          const reset = startupReset;
          startupReset = null;
          await reset;
        }
        return catalog();
      }
      if (action === "pickArchive") {
        const file = await pickFile();
        if (!file) return { cancelled: true };
        return install(file, data);
      }
      if (action === "downloadArchive") {
        const db = await open(),
          row = await request(
            db
              .transaction("archives")
              .objectStore("archives")
              .get(data.packageId),
          );
        if (!row)
          throw Error(
            "The original archive was not saved by this older app version. Import it again to enable Save archive.",
          );
        if (row.parts) {
          const bytes = await exportArchiveVolumes(row.parts);
          await exportFile(
            new Blob([bytes], { type: "application/zip" }),
            row.name + "-volumes.zip",
          );
        } else await exportFile(row.blob, row.name);
        return {};
      }
      if (action === "remove") {
        if (!/^[a-f0-9-]{36}$/.test(data.packageId))
          throw Error("Unknown installed package.");
        const db = await open(),
          tx = db.transaction(["packages", "files", "archives"], "readwrite"),
          finished = done(tx);
        tx.objectStore("packages").delete(data.packageId);
        tx.objectStore("archives").delete(data.packageId);
        const r = tx
          .objectStore("files")
          .index("packageId")
          .openCursor(IDBKeyRange.only(data.packageId));
        r.onsuccess = () => {
          const c = r.result;
          if (c) {
            c.delete();
            c.continue();
          }
        };
        await finished;
        return catalog();
      }
      if (action === "launch") {
        const list = await catalog(),
          p1 = list.characters.find((c) => c.id === data.character),
          p2 = list.characters.find((c) => c.id === data.opponent),
          stage = list.stages.find((s) => s.id === data.stage);
        if (!p1 || !p2 || !stage)
          throw Error("Select installed fighters and a stage.");
        if (!["solo", "versus", "cpu", "training"].includes(data.mode))
          throw Error("Unknown play mode.");
        const fxPackage = data.fightfxPackageId
          ? (await packages()).find(p=>p.id===data.fightfxPackageId&&p.commonEffects)
          : null;
        if (data.fightfxPackageId && !fxPackage)
          throw Error("Selected common-effects package is unavailable.");
        const files = Object.fromEntries(
            Object.entries(await core()).map(([p, b]) => [p, b.slice()]),
          ),
          ids = [
            ...new Set(
              [p1.packageId, p2.packageId, stage.packageId, fxPackage?.id].filter(Boolean),
            ),
          ],
          db = ids.length ? await open() : null;
        for (const id of ids) {
          const rows = await request(
            db
              .transaction("files")
              .objectStore("files")
              .index("packageId")
              .getAll(id),
          );
          for (const row of rows)
            files[row.path] = new Uint8Array(await row.blob.arrayBuffer());
        }
        await battle({
          files,
          selection: {
            character: p1.id,
            opponent: p2.id,
            stage: stage.id,
            mode: data.mode,
            endlessRounds: data.endlessRounds === true && data.mode !== 'training',
            level: data.level || 4,
            palette: data.palette || 1,
            opponentPalette: data.opponentPalette || 1,
            // The real MUGEN/IKEMEN character-select sprites are decoded
            // locally before the match archive buffers reach the worker.
            hudPortraits: [
              { sprite: p1.sprite || null, palette: data.palette || 1 },
              { sprite: p2.sprite || null, palette: data.opponentPalette || 1 },
            ],
            effectsPackage: fxPackage ? `imports/${fxPackage.id}/` : undefined,
          },
          onProgress: (m) => window.__kenjatimeNativeProgress?.(m),
        });
        return { launching: true };
      }
      if (action === "credits") {
        window.open(creditsUrl, "_blank", "noopener");
        return {};
      }
      throw Error("Unknown app action.");
    },
  };
}
