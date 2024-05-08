import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import cacheDir from 'vite-plugin-cachedir'

export default defineConfig({
  base: '/boox/demo/svelte',
  plugins: [cacheDir(), svelte()],
  build: {
    rollupOptions: {
      external: ['os']
    }
  }
})
