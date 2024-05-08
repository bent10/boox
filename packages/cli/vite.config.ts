/// <reference types="vitest" />
import { defineConfig } from 'vite'
import pluginCache from 'vite-plugin-cachedir'

export default defineConfig({
  plugins: [pluginCache()],
  ssr: {
    noExternal: ['batch-me-up']
  },
  build: {
    target: 'es2022',
    ssr: 'src/index.ts'
  },
  test: {
    globals: true,
    include: ['test/*.test.ts'],
    coverage: {
      include: ['src'],
      exclude: ['src/index.ts']
    }
  }
})
