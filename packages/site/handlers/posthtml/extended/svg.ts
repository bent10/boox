import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Gets the SVG assets of the given path.
 *
 * @param path - The path of the svg.
 * @returns
 *   The SVG content. If the icon is not found, a warning message is returned.
 */
export function getSvg(path: string) {
  try {
    return readFileSync(resolve(`src/assets/${path}.svg`), 'utf8')
      .replace('<svg', '<svg aria-hidden="true"')
      .replace(/currentColor/g, '{{color}}')
      .replace(/#346cb0/g, '{{accent}}')
      .replace(/width="\w+"/, `width="{{size}}"`)
      .replace(/height="\w+"/, `height="{{size}}"`)
  } catch (e) {
    return `<em>Svg <code>${path}</code> not found!</em>`
  }
}
