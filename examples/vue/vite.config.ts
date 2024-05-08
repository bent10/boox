import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cacheDir from 'vite-plugin-cachedir'

export default defineConfig({
  base: '/boox/demo/vue',
  plugins: [cacheDir(), vue()],
  build: {
    rollupOptions: { external: ['os'] }
  }
})
