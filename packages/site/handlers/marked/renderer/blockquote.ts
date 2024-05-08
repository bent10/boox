import type { RendererObject } from 'marked'

/**
 * Represents a custom renderer for blockquote elements.
 *
 * @param quote - The content of the blockquote element.
 * @returns The HTML representation of the blockquote with specified
 *   class.
 */
export const blockquote: RendererObject['blockquote'] = quote =>
  `<blockquote class="blockquote">\n${quote}</blockquote>\n`
