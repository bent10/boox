/**
 * Cleans the given URL by encoding it.
 *
 * @param href The URL to clean.
 * @returns The cleaned URL or null if an error occurs during encoding.
 */
export function cleanUrl(href: string) {
  try {
    href = encodeURI(href).replace(/%25/g, '%')
  } catch (e) {
    return null
  }
  return href
}
