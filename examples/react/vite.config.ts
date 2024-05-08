import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cacheDir from 'vite-plugin-cachedir'

export default defineConfig({
  base: '/boox/demo/react',
  plugins: [cacheDir(), react()],
  build: {
    rollupOptions: { external: ['os'] }
  }
})
