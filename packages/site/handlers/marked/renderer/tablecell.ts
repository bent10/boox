import type { RendererObject } from 'marked'

/**
 * Renders a table cell with optional alignment.
 *
 * @param content The content of the cell.
 * @param flags Flags indicating cell properties, such as alignment and
 *   whether it's a header cell.
 * @returns The HTML representation of the table cell.
 */
export const tablecell: RendererObject['tablecell'] = (content, flags) => {
  let align = 'text-start'

  if (flags.align === 'center') {
    align = 'text-center'
  } else if (flags.align === 'right') {
    align = 'text-end'
  }

  const type = flags.header ? 'th' : 'td'
  const openTag = flags.align ? `<${type} class="${align}">` : `<${type}>`
  return openTag + content + `</${type}>\n`
}
