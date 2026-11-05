import {defineConfig} from 'vite';

// Keep assets and the sample archive usable on GitHub Pages project URLs.
export default defineConfig({base:'./',build:{rollupOptions:{input:{lab:'index.html',arena:'arena/index.html'}}}});
