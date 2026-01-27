import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      jpg: {
        quality: 90,
      },
      jpeg: {
        quality: 90,
      },
      png: {
        quality: 90,
      },
      svg: {
        quality: 90,
      },
    })
  ],
})
