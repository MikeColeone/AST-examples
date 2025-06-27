import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import domMarker from './vite-plugin-dom-marker'

export default defineConfig({
  plugins: [
    domMarker(),

    react(),
  ],
  //  root: './src'
    
})

