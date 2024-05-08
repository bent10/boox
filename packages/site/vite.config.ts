import { resolve } from 'node:path'
import headlessRoute from '@headless-route/vite'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'
import cacheDir from 'vite-plugin-cachedir'
import purgeCSS from 'vite-plugin-purge'
import routeHandler from './handlers'

export default defineConfig({
  root: 'src',
  base: '/boox/',
  resolve: { alias: { '~bootstrap': resolve('../../node_modules/bootstrap') } },
  build: { rollupOptions: { external: ['os'] } },
  css: { postcss: { plugins: [autoprefixer()] } },
  plugins: [
    cacheDir(),
    headlessRoute({
      dir: 'views/pages',
      extensions: ['.md'],
      dataOptions: { dir: 'data' },
      filter(file) {
        // ignore files starting with '_'
        return !file.name.startsWith('_')
      },
      handler: routeHandler
    }),
    // enable purging only in production
    purgeCSS({
      content: ['*.html', '**/*.html', '**/*.js'],
      dynamicAttributes: ['data-bs-popper'],
      safelist: {
        deep: [
          /(?:carousel\-item|collapsing|modal|offcanvas|popover|tooltip|active|fade|show|slide)/
        ]
      }
    })
  ]
})
