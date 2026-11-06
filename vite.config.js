import {defineConfig} from 'vite';

// The pinned LZMA decoder ships as a classic-worker/CJS script. Expose its
// decoder as an ES module without replacing our archive worker's message handler.
const lzmaModule=()=>({name:'lzma-module',enforce:'pre',transform(code,id){
  if(!id.replaceAll('\\','/').endsWith('/lzma/src/lzma-d.js'))return;
  const exportLine='this.LZMA = this.LZMA_WORKER = LZMA;';if(!code.includes(exportLine))throw Error('Unexpected pinned LZMA module.');
  return code.replace('if (typeof onmessage != "undefined" && (typeof window == "undefined" || typeof window.document == "undefined")) {','if (false) {').replace(exportLine,'export default {LZMA_WORKER:LZMA};');
}});

// Keep assets and the sample archive usable on GitHub Pages project URLs.
export default defineConfig({base:'./',plugins:[lzmaModule()],build:{manifest:true,rollupOptions:{input:{lab:'index.html',arena:'arena/index.html',classic:'arena-classic/index.html',mobile:'mobile/index.html',native:'native-ui/index.html',engine:'engine/index.html'}}},worker:{format:'es',plugins:()=>[lzmaModule()]}});
