import type { RendererObject } from 'marked'
import { cleanUrl } from './utils.js'

/**
 * Represents a custom renderer function for handling links.
 *
 * @param href The URL of the link.
 * @param title The optional title of the link.
 * @param text The alternative text for the link.
 * @returns A string representing the HTML markup for the link.
 */
export const link: RendererObject['link'] = (href, title, text) => {
  const cleanHref = cleanUrl(href)
  if (cleanHref === null) {
    return text
  }
  href = cleanHref.replace(/%7B%7B/g, '{{').replace(/%7D%7D/g, '}}')

  let link = '<a href="' + href + '"'
  if (title) {
    link += ' title="' + title + '"'
  }
  link += /^(\w+):/.test(href)
    ? ' target="_blank" rel="noopener noreferrer"'
    : ''
  link += '>' + text + '</a>'

  return link
}
