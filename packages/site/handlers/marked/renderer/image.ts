import type { RendererObject } from 'marked'
import { cleanUrl } from './utils.js'

/**
 * Represents a custom renderer function for handling images.
 *
 * @param href The URL of the image.
 * @param title The optional title of the image.
 * @param text The alternative text for the image.
 * @returns A string representing the HTML markup for the image.
 */
export const image: RendererObject['image'] = (href, title, text) => {
  // Clean the URL
  const cleanHref = cleanUrl(href)
  if (cleanHref === null) {
    return text
  }

  const src = cleanHref.replace(/%7B%7B/g, '{{').replace(/%7D%7D/g, '}}')
  // Generate the HTML for the image
  let img = `<img src="${src}" class="img-fluid" alt="${text}"`
  if (title) {
    img += ` title="${title}"`
  }
  img += ' />'
  return img
}
