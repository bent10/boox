/**
 * Represents a navigation item in the application.
 */
export type NavItem = {
  text: string
  url?: string
  id?: string
  type?: string
  icon?: string | IconProps
  disabled?: boolean
  badge?: string
  info?: string
  attrs?: UnknownObject
  children?: NavItem[]
}

/**
 * Represents metadata-like information that can be associated with a
 * navigation item.
 */
export interface MetaDataLike {
  stem?: string
  url?: string
  title?: string
  [key: string]: unknown
}

/**
 * Represents properties for an icon.
 */
export interface IconProps {
  type?: string
  name?: string
  attrs?: UnknownObject
}

/**
 * Represents an object with unknown properties.
 */
export type UnknownObject = { [key: string]: unknown }

/**
 * Creates a string template for stacked navigation items based on the
 * provided data.
 *
 * @param items - An array of navigation items.
 * @param meta - The current meta data.
 * @returns A string template for stacked navigation items.
 */
export function createStackedNavItems<T extends MetaDataLike>(
  items: NavItem[],
  meta: T
) {
  let chunk = ''

  for (const item of items) {
    const isGroup = item.type === 'group'

    chunk += '<ui:nav.item>\n'

    if (isGroup) {
      chunk += createNavItemHeader(item)
    } else {
      chunk += createNavItemLink(String(meta.url), item)
    }

    if (Array.isArray(item.children)) {
      chunk += `<ui:nav`

      if (!isGroup) {
        const isExpanded = meta.url?.startsWith(String(item.url))
        chunk += item.id ? ` id="ns-${item.id}"` : ''
        chunk += ' class="collapse'
        chunk += isExpanded ? ' show' : ''
        chunk += item.icon ? ' nav-indented' : ' ms-4'
        chunk += '"'
      }

      chunk += ' vertical>\n'
      chunk += createStackedNavItems(item.children, meta)
      chunk += '</ui:nav>\n'
    }

    chunk += `</ui:nav.item>\n`
  }

  return chunk
}

/**
 * Creates a header template for a navigation item group.
 *
 * @param item - The navigation item group.
 * @returns A string template for the header of the navigation item group.
 */
function createNavItemHeader({ icon, badge, info, text, attrs = {} }: NavItem) {
  let chunk = '<h6'
  chunk += serializeAttrs('nav-header', attrs)
  chunk += '>\n'
  chunk += createNavItemInner({ badge, icon, info, text })
  chunk += '</h6>\n'

  return chunk
}

/**
 * Creates a template for a navigation item link.
 *
 * @param metaUrl - The current URL from the meta data.
 * @param item - The navigation item.
 * @returns A string template for the navigation item link.
 */
function createNavItemLink(metaUrl: string, item: NavItem) {
  const {
    url = '#',
    text,
    id,
    disabled,
    badge,
    icon,
    info,
    attrs,
    children
  } = item
  const baseAttrs: NavItem['attrs'] = {}

  const isNested = Array.isArray(children)
  const isActive = metaUrl === url
  const isExpanded = metaUrl.startsWith(url)

  if (isNested) {
    baseAttrs.className = 'nav-toggle'
    baseAttrs.href = id ? `#ns-${id}` : ''
    baseAttrs['data-bs-toggle'] = 'collapse'
    baseAttrs['aria-expanded'] = isExpanded
  } else {
    baseAttrs.href = url
  }

  baseAttrs.disabled = !!disabled
  baseAttrs.active = isActive

  let chunk = '<ui:nav.link'
  chunk += serializeAttrs('', { ...baseAttrs, ...attrs })
  chunk += '>\n'
  chunk += createNavItemInner({ badge, icon, info, text })
  chunk += `\n</ui:nav.link>\n`

  return chunk
}

/**
 * Creates the inner content template for a navigation item.
 *
 * @param icon - The icon associated with the navigation item.
 * @param badge - The badge text for the navigation item.
 * @param info - Additional information for the navigation item.
 * @param text - The text content of the navigation item.
 * @returns A string template for the inner content of the navigation item.
 */
function createNavItemInner({
  icon,
  badge,
  info,
  text
}: Pick<NavItem, 'badge' | 'icon' | 'info' | 'text'>) {
  const hasBadgeOrInfo = badge || info
  let chunk = createIcon(icon)
  chunk += text

  if (hasBadgeOrInfo) {
    chunk += '<span class="ms-auto">'
    chunk += createBadge(badge, { variant: 'success', subtle: true })
    chunk += createBadge(info, { variant: 'success', subtle: true })
    chunk += '</span>'
  }

  return chunk
}

/**
 * Creates a badge template for a navigation item.
 *
 * @param text - The text content of the badge.
 * @param attrs - Additional attributes for the badge.
 * @returns A string template for the badge of the navigation item.
 */
function createBadge(text?: string, attrs?: UnknownObject) {
  if (typeof text === 'string') {
    let badge = '</ui:badge'
    badge += serializeAttrs('me-1', attrs)
    badge += `>`
    badge += `</ui:badge>`

    return badge
  }

  return ''
}

/**
 * Creates an icon template for a navigation item.
 *
 * @param props - The properties of the icon.
 * @returns A string template for the icon of the navigation item.
 */
function createIcon(props?: string | IconProps) {
  if (typeof props === 'string') {
    return `<ui:icon name="${props}" class="me-4"></ui:icon>\n`
  }

  if (typeof props === 'object' && !Array.isArray(props)) {
    const { type = 'bi', name = '', attrs = {} } = props

    let icon = `<ui:icon.${type}`
    icon += serializeAttrs('', { name, ...attrs })
    icon += '>'
    icon += `</ui:icon.${type}>`

    return icon
  }

  return ''
}

/**
 * Serializes attributes into a string template.
 *
 * @param className - The base CSS class for the attributes.
 * @param obj - The object containing the attributes.
 * @returns A string template for the serialized attributes.
 */
function serializeAttrs(className: string, obj?: UnknownObject) {
  if (obj === null || typeof obj !== 'object') return ''

  if (Array.isArray(obj)) {
    return ' ' + obj.map(String).join(' ')
  }

  const entries = Object.entries(obj)
  let attr = entries.length ? '' : ` class="${className}"`

  for (const [key, originalValue] of entries) {
    const name = key === 'className' ? 'class' : key
    const value =
      key === 'className' ? `${className} ${originalValue}` : originalValue

    switch (value) {
      case key:
      case '':
        attr += ` ${name}`
        break
      case undefined:
      case null:
        // ignores
        break
      default:
        attr += ` ${name}="${value}"`
        break
    }
  }

  return attr
}
