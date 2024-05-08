import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Gets the SVG content of an icon by name.
 *
 * @param name - The name of the icon.
 * @returns
 *   The SVG content of the icon. If the icon is not found, a
 *   warning message is returned.
 */
export function getIcon(name: string) {
  try {
    return readFileSync(resolve(`src/assets/icons/${name}.svg`), 'utf8')
      .replace('<svg', '<svg aria-hidden="true"')
      .replace(/currentColor/g, '{{color}}')
      .replace(/#7553fd/g, '{{accent}}')
      .replace('width="24"', `width="{{size}}"`)
      .replace('height="24"', `height="{{size}}"`)
  } catch (e) {
    return `<em>Icon <code>${name}</code> not found!</em>`
  }
}
