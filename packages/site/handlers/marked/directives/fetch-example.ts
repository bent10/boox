import { resolve } from 'path'
import { readFileSync } from 'fs'
import type { DirectiveConfig } from 'marked-directive'

const fetchExample: DirectiveConfig = {
  level: 'block',
  marker: '::',
  renderer({ text, meta }) {
    if (meta.name === 'fetch-example') {
      const src = text.trim().replace(/^['"]|['"]$/g, '')

      try {
        const resolvedPath = resolve('../../examples', src)
        const content = readFileSync(resolvedPath, 'utf8')

        if (/vite\.config\.[cm]?[jt]s$/.test(src)) {
          return content
            .replace("import cacheDir from 'vite-plugin-cachedir'\n", '')
            .replace(/[^\n]*?base:[^\n]+\n/, '')
            .replace(
              /(?:^\s+plugins\:\s*?\[cacheDir\(\)\],\n)|(?:cacheDir\(\)\s*?,?\s*)/m,
              ''
            )
        } else if (/next\.config\.[cm]?[jt]s$/.test(src)) {
          return content.replace(/[^\n]*?basePath:[^\n]+\n/, '')
        }

        return content
      } catch {
        return `File Not Found: Unable to locate ${src}`
      }
    }

    return false
  }
}

export default fetchExample
