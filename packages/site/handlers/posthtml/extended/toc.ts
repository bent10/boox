import type { Heading } from '@headless-route/vite'

export interface HeadingWithChildren extends Heading {
  children?: Heading[]
}

/**
 * Generates a Table of Contents (TOC) HTML based on heading data.
 *
 * @param headings The array of heading objects.
 * @param levels The levels of headings to include.
 * @param isRoot Indicates if the current call is for the root level.
 * @returns The generated HTML for the Table of Contents.
 */
export function generateToc(
  headings: HeadingWithChildren[],
  levels: number[] = [2, 3],
  isRoot: boolean = true
) {
  if (isRoot) {
    headings = groupHeadingsByLevel(headings, levels)
  }

  let html = '<ui:nav as="ol" vertical '
  html += isRoot ? 'class="mb-0"' : 'class="my-1" type="indented"'
  html += '>'

  for (const heading of headings) {
    if (!levels.includes(heading.level)) continue

    html += '<ui:nav.item>'

    html += `<ui:nav.link href="#${heading.id}" class="py-1 fw-normal">`
    html += heading.text.replace(/\<a .*?\>|\<\/a\>/g, '')
    html += '</ui:nav.link>'

    if (heading.children) {
      html += generateToc(heading.children, levels, false)
    }

    html += '</ui:nav.item>'
  }

  html += '</ui:nav>'

  return html
}

/**
 * Groups heading data by level.
 *
 * @param headings The array of heading objects.
 * @param levels The levels of headings to include.
 * @returns The array of grouped heading objects.
 */
function groupHeadingsByLevel(
  headings: Heading[],
  levels: number[] = [2, 3]
): HeadingWithChildren[] {
  const root: HeadingWithChildren[] = []
  const stack: HeadingWithChildren[] = []

  for (const heading of headings) {
    if (!levels.includes(heading.level)) continue

    const item: HeadingWithChildren = { ...heading }

    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }

    if (stack.length > 0) {
      stack[stack.length - 1].children = stack[stack.length - 1].children || []
      stack[stack.length - 1].children?.push(item)
    } else {
      root.push(item)
    }

    stack.push(item)
  }

  return root
}
