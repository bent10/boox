// Constants
const THEME_TOGGLER_SELECTOR = '#theme-toggler'
const THEME_SWITCHER_SELECTOR = '[data-bs-theme-switcher]'
const DARK_THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)'

/**
 * Handles theme switching functionality.
 *
 * @param selector - The selector for theme switcher buttons.
 */
export function handleThemeSwitcher(selector: string) {
  document.querySelectorAll<HTMLButtonElement>(selector).forEach(el => {
    el.addEventListener('click', () => {
      const themeName = el.dataset.bsThemeSwitcher || 'light'
      applyTheme(themeName, true)
    })
  })
}

/**
 * Sets up a listener for changes in the user's preferred color scheme.
 */
export function setupColorSchemeListener() {
  window
    .matchMedia(DARK_THEME_MEDIA_QUERY)
    .addEventListener('change', e => applyTheme(e.matches ? 'dark' : 'light'))
}

/**
 * Applies the specified theme and updates the UI.
 *
 * @param themeName - The name of the theme to apply (`'light'`, `'dark'`, or
 *   `'auto'`).
 * @param focusable - Whether to focus the theme toggler button after
 *   applying the theme.
 */
export function applyTheme(themeName: string, focusable = false) {
  const themeToggler = document.querySelector<HTMLButtonElement>(
    THEME_TOGGLER_SELECTOR
  )
  const themeSwitchers = document.querySelectorAll<HTMLElement>(
    THEME_SWITCHER_SELECTOR
  )

  themeSwitchers.forEach(el => {
    el.classList.toggle('active', el.dataset.bsThemeSwitcher === themeName)
    el.setAttribute(
      'aria-pressed',
      el.classList.contains('active') ? 'true' : 'false'
    )

    if (el.dataset.bsThemeSwitcher === themeName && themeToggler) {
      const icon = el.querySelector('svg')
      themeToggler.innerHTML = icon?.outerHTML || ''
    }
  })

  setTheme(themeName)
  setStoredTheme(themeName)

  if (focusable && themeToggler) {
    themeToggler.focus()
  }
}

/**
 * Gets the preferred theme based on user settings and system preferences.
 *
 * @returns The preferred theme name (`'light'`, `'dark'`, or
 *   `'auto'`).
 */
export function getPreferredTheme(): string {
  const storedTheme = getStoredTheme()
  if (storedTheme) {
    return storedTheme
  }

  return window.matchMedia(DARK_THEME_MEDIA_QUERY).matches ? 'dark' : 'light'
}

/**
 * Gets the stored theme from local storage.
 *
 * @returns The stored theme name or null if not found.
 */
function getStoredTheme(): string | null {
  return localStorage.getItem('theme')
}

/**
 * Sets the stored theme in local storage.
 *
 * @param theme - The theme name to store.
 */
function setStoredTheme(theme: string): void {
  localStorage.setItem('theme', theme)
}

/**
 * Sets the theme on the document element.
 *
 * @param theme - The theme name to set (`'light'`, `'dark'`, or
 *   `'auto'`).
 */
function setTheme(theme: string): void {
  if (theme === 'auto') {
    document.documentElement.setAttribute(
      'data-bs-theme',
      window.matchMedia(DARK_THEME_MEDIA_QUERY).matches ? 'dark' : 'light'
    )
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }
}
