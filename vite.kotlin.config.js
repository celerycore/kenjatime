import {defineConfig} from "vite";
import {resolve} from "node:path";
import {independentBuildBoundary} from "./scripts/core/build-isolation.mjs";

/** Single Kotlin/WASM combat artifact, two targets: browser and Android.
 * UI adapters are JS (DOM, graphics, archives), never simulation engines.
 */
export default defineConfig({
  base:"./",
  publicDir:false,
  plugins:[independentBuildBoundary()],
  worker:{format:"es",plugins:()=>[independentBuildBoundary()]},
  build:{
    outDir:"dist-kotlin",
    emptyOutDir:true,
    sourcemap:false,
    manifest:true,
    rollupOptions:{input:{kotlin:resolve("kotlin/index.html")}}
  }
});
