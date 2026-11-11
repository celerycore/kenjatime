/**
 * Opt-in Kotlin/Wasm combat backend.
 *
 * This is a plugin point, not an automatic switch: the shipped JavaScript
 * runtime remains the default. Pass a successfully loaded backend through
 * CoreSession(..., { kotlinCombatBackend: backend }) to delegate projectile
 * candidate enumeration and the extended-global scheduling mask.
 *
 * Kotlin owns the primitive candidate stage; JS still owns AIR transforms,
 * Clsn2 narrowphase, HitDef, priorities, ZSS script evaluation, pauses and
 * all presentation effects.
 */
export function adaptKotlinWasmCombatModule(module) {
  const Kernel=module?.KenjatimeCombatKernel ?? module?.default?.KenjatimeCombatKernel;
  if(typeof Kernel!=='function')
    throw Error('Kotlin/Wasm module must export KenjatimeCombatKernel');
  return Object.freeze({
    kind:'kotlin-wasm-combat-candidates-v1',
    createProjectileKernel(maxProjectiles) {
      const kernel=new Kernel(maxProjectiles);
      for(const method of ['clear','add','collect','left','right','examinedPairs','phaseMask'])
        if(typeof kernel[method]!=='function')throw Error('Missing Kotlin/Wasm ABI method: '+method);
      return kernel;
    },
  });
}

/** Caller chooses a deployed module URL; no implicit network requests. */
export async function importKotlinWasmCombatBackend(moduleUrl) {
  if(typeof moduleUrl!=='string'||!moduleUrl)
    throw Error('Provide the build output .mjs module URL');
  return adaptKotlinWasmCombatModule(await import(/* @vite-ignore */ moduleUrl));
}
