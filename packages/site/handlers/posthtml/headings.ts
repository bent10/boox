import type { Heading } from '@headless-route/vite'
import GithubSlugger from 'github-slugger'
import moo from 'moo'

/**
 * Parses HTML content to extract headings and generate slug IDs for each
 * heading.
 *
 * @param content - The HTML content to parse.
 * @param headinglevels - The levels of headings to parse. Defaults to `['h2', 'h3']`.
 * @returns An object containing the extracted headings and the updated HTML content with anchor links.
 */
export function parseHtmlHeadings(
  content: string,
  headinglevels: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = ['h2', 'h3']
) {
  const slugger = new GithubSlugger()
  const headings: Heading[] = []
  const headingsPattern = `(?:${headinglevels.join('|')})`
  const tokens = moo
    .compile({
      openTag: new RegExp(`<${headingsPattern}[^>]*?>`),
      closeTag: new RegExp(`<\\/${headingsPattern}[^>]*?>`),
      text: moo.fallback
    })
    .reset(content)

  let currentId = ''
  let currentText = ''
  let updatedHtml = ''

  for (const { type, value, offset } of tokens) {
    if (type === 'openTag') {
      const tagName = value
        .slice(1, 3)
        .toLowerCase() as unknown as (typeof headinglevels)[number]

      const level = Number(tagName.slice(1))
      const textStartIndex = offset + value.length
      const textEndIndex = content.indexOf(`</${tagName}`, textStartIndex)
      const text = content.slice(textStartIndex, textEndIndex).trim()

      const normalizedText = text.toLowerCase().replace(/<[!\/a-z].*?>/gi, '')

      currentId = slugger.slug(normalizedText)
      currentText = normalizedText
      headings.push({ level, text, id: currentId })

      // update content
      updatedHtml += value.slice(0, -1)
      updatedHtml += ` id="${currentId}">`
    } else if (type === 'closeTag') {
      updatedHtml += `<a href="#${currentId}" class="self-link" aria-label="Link to this section ${currentText}"></a>`
      updatedHtml += value
    } else {
      updatedHtml += value
    }
  }

  return { headings, updatedHtml }
}
