import { resolve } from 'path'
import { readFileSync } from 'fs'
import moo from 'moo'

const INCLUDE_TAG_REGEXP = /@include\((?:"[^"\n\r]*?"|'[^"\n\r]*?')\)/
const INCLUDE_TAG_MATCHER_REGEXP =
  /@include\((?:"([^"\n\r]*?)"|'([^"\n\r]*?)')\)/

// apply tags
// e.g. @include("../to/path")
const lexer = moo.compile({
  incluedeTag: {
    match: INCLUDE_TAG_REGEXP,
    value(text) {
      const [, src = ''] = text.match(INCLUDE_TAG_MATCHER_REGEXP) || []

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
  },
  text: moo.fallback
})

export async function applyTagsTemplate(markdown: string) {
  const tokens = lexer.reset(markdown)

  let taggedMarkdown = ''

  for (const { value } of tokens) {
    taggedMarkdown += value
  }

  return taggedMarkdown
}
