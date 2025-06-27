import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import domMarker from './vite-plugin-dom-marker'
import viteDomMaker from './vite-dom-maker-plugin';
// import swcDomMaker from './swc-dom-plugin'

export default defineConfig({
  plugins: [
    // swcDomMaker(), // 只能放在这里
    // react(),
    // domMarker(),
    // react()
    react({
      babel: {
        plugins: [viteDomMaker]
      }
    }),
  ],
});

