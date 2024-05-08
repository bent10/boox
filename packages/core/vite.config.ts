/// <reference types="vitest" />
import { defineConfig } from 'vite'
import pluginCache from 'vite-plugin-cachedir'
import pluginResolveUMD from 'vite-plugin-resolve-umd-format'

export default defineConfig({
  plugins: [pluginCache(), pluginResolveUMD()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Boox',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['os']
    }
  },
  test: {
    globals: true,
    include: ['test/*.test.ts'],
    coverage: {
      include: ['src'],
      exclude: ['src/types.ts']
    }
  }
})
