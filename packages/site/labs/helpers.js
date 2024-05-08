import GithubSlugger from 'github-slugger'
import { marked } from 'marked'

/**
 * @typedef {object} SplittedContent
 * @prop {string} id
 * @prop {number} depth
 * @prop {string} section
 * @prop {string} content
 *
 * @param {string} content
 * @returns {SplittedContent[]}
 */
export function splitContentByHeadings(content) {
  const slugger = new GithubSlugger()
  const tokens = marked.use({ gfm: true }).lexer(content)

  /** @type {SplittedContent[]} */
  const chunks = []
  /** @type {SplittedContent} */
  let chunk

  for (const token of tokens) {
    if (token.type === 'heading' && token.depth < 4) {
      const normalizedText = token.text
        .toLowerCase()
        .replace(/<[!\/a-z].*?>/gi, '')

      chunk = {
        id: slugger.slug(normalizedText),
        depth: token.depth,
        section: token.text,
        content: ''
      }

      chunks.push(chunk)
    } else {
      if (chunk) {
        chunk.content += token.raw
      }
    }
  }

  return chunks
}
