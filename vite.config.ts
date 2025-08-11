import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dataTrack from './data-track'
export default defineConfig({
  plugins: [react(),
     dataTrack({
      root: process.cwd() // 可选配置
    })
  ],
})
