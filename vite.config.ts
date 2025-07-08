import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import vitePluginDomMaker from './vite-transform-dom-marker'
import viteDomMaker from './babel-dom-maker-plugin';
// import swcDomMaker from './swc-dom-plugin'

export default defineConfig({
  plugins: [
    // swcDomMaker(), // 只能放在这里
    // react(),
    // vitePluginDomMaker(),
    // react()
    react({
      babel: {
        plugins: [viteDomMaker]
      }
    }),
  ],
});

