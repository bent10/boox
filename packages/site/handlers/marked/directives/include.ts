import { resolve } from 'path'
import { readFileSync } from 'fs'
import type { DirectiveConfig } from 'marked-directive'

const includeFile: DirectiveConfig = {
  level: 'block',
  marker: '::',
  renderer({ text, meta }) {
    if (meta.name === 'include') {
      const src = text.trim().replace(/^['"]|['"]$/g, '')

      try {
        const resolvedPath = resolve(src)
        const content = readFileSync(resolvedPath, 'utf8')

        if (resolvedPath.endsWith('.md')) {
          return /changelog\.md$/i.test(resolvedPath)
            ? content.replace(/^#[ ]+/gm, '## ')
            : content
        }

        return content
      } catch {
        return `File Not Found: Unable to include ${src}`
      }
    }

    return false
  }
}

export default includeFile
