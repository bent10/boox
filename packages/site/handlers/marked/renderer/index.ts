import type { RendererObject } from 'marked'
import { blockquote } from './blockquote.js'
import { image } from './image.js'
import { link } from './link.js'
import { table } from './table.js'
import { tablecell } from './tablecell.js'

/**
 * Custom renderer for Markdown content with Bootstrap styling.
 */
export const bootstrapRenderer: RendererObject = {
  link,
  image,
  blockquote,
  tablecell,
  table
}

export default bootstrapRenderer
