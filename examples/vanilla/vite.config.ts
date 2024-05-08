import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'

export default defineConfig({
  base: '/boox/demo/vanilla',
  plugins: [cacheDir()],
  build: {
    rollupOptions: {
      external: ['os']
    }
  }
})
