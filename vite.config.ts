import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import domMarker from './vite-plugin-dom-marker'
import viteDomMaker from './vite-dom-maker-plugin';

export default defineConfig({
  plugins: [
    domMarker(),
    viteDomMaker(),
    // react()
    react({
      babel: {
        plugins: [viteDomMaker]
      }
    }),
  ],
});

