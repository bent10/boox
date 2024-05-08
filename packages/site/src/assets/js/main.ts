import { handleModalKeydown, initBootstrapUI } from './bootstrap.js'
import { handleClipboard } from './clipboard.js'
import { handleSearch, handleClickedSearchResults } from './search.js'
import {
  applyTheme,
  getPreferredTheme,
  handleThemeSwitcher,
  setupColorSchemeListener
} from './theme.js'

initBootstrapUI()
handleModalKeydown('#search-modal', '/')
handleClickedSearchResults('#results', '#search-modal')

handleClipboard()

handleSearch()

applyTheme(getPreferredTheme())
handleThemeSwitcher('[data-bs-theme-switcher]')
setupColorSchemeListener()
