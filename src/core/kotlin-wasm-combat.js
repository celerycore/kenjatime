/**
 * Explicit opt-in Kotlin/Wasm combat backend.
 *
 * The generated Kotlin/Wasm executable exports top-level functions. JS owns
 * the returned integer handle and must destroy it when a CoreSession closes.
 * There is no automatic switch: JS remains the default runtime until parity
 * is demonstrated against the original three supplied characters.
 */
export function adaptKotlinWasmCombatModule(module) {
  const api=module?.default && typeof module.default.createCombatKernel==='function'
    ? module.default : module;
  const functions=[
    'createCombatKernel','destroyCombatKernel','resetCombatKernel',
    'addCombatProjectile','collectCombatPairs','combatPairLeft',
    'combatPairRight','combatExaminedPairs','combatPhaseMask'
  ];
  if(functions.every(name=>typeof api?.[name]==='function')){
    return Object.freeze({
      kind:'kotlin-wasm-combat-v2',
      createProjectileKernel(maxProjectiles) {
        const handle=api.createCombatKernel(Math.max(1,maxProjectiles));
        if(!Number.isInteger(handle)||handle<=0)throw Error('Invalid Kotlin/Wasm kernel handle');
        let disposed=false;
        const current=()=>{if(disposed)throw Error('Combat kernel is disposed');return handle;};
        return {
          clear:()=>api.resetCombatKernel(current()),
          add:(x0,y0,x1,y1,team,frozen,removing)=>
            api.addCombatProjectile(current(),x0,y0,x1,y1,team,frozen,removing),
          collect:inclusive=>api.collectCombatPairs(current(),inclusive),
          left:index=>api.combatPairLeft(current(),index),
          right:index=>api.combatPairRight(current(),index),
          examinedPairs:()=>api.combatExaminedPairs(current()),
          phaseMask:(root,keyCtrl,ownsState,worldPaused,initializing,destroyed)=>
            api.combatPhaseMask(root,keyCtrl,ownsState,worldPaused,initializing,destroyed),
          dispose:()=>{if(disposed)return false;disposed=true;return api.destroyCombatKernel(handle);},
        };
      },
    });
  }

  // Supported for embedding/unit-test shims only; the compiled Wasm module
  // uses the function interface above, not an exported Kotlin class.
  const Kernel=module?.KenjatimeCombatKernel ?? module?.default?.KenjatimeCombatKernel;
  if(typeof Kernel!=='function')
    throw Error('Kotlin/Wasm module is missing the combat function ABI');
  return Object.freeze({
    kind:'kotlin-wasm-combat-test-shim',
    createProjectileKernel(maxProjectiles) {
      const kernel=new Kernel(Math.max(1,maxProjectiles));
      for(const method of ['clear','add','collect','left','right','examinedPairs','phaseMask'])
        if(typeof kernel[method]!=='function')throw Error('Missing Kotlin/Wasm ABI method: '+method);
      return kernel;
    },
  });
}

/** Load from an explicit .mjs URL produced by the Kotlin/Wasm Gradle build. */
export async function importKotlinWasmCombatBackend(moduleUrl) {
  if(typeof moduleUrl!=='string'||!moduleUrl)
    throw Error('Provide the build output .mjs module URL');
  return adaptKotlinWasmCombatModule(await import(/* @vite-ignore */ moduleUrl));
}
