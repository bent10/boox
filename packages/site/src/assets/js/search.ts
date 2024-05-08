import { Modal } from 'bootstrap'
import Boox, { type SearchResultWithPagination } from 'boox'
import { doubleMetaphone } from 'double-metaphone'
import * as levenshtein from 'fastest-levenshtein'
import { stemmer } from 'stemmer'
import { removeStopwords } from 'stopword'
import { debounce, fetchData } from './utils.js'

/**
 * Documentation dataset object.
 */
export interface Dataset {
  id: string
  url: string
  title: string
  group: string
  section: string
  content: string
}

// Constants
const WORD_REGEX = /\b\w+\b/g
const RESULTS_PER_PAGE_MOBILE = 7
const RESULTS_PER_PAGE_DESKTOP = 10
const STATE_URL = 'https://stilearning.com/boox/docs-trained.gz?v=13'

// Boox instance
const boox = new Boox<Dataset>({
  /**
   * Configuration options for the Boox model.
   */
  modelOptions: {
    /**
     * Custom tokenizer function to split text into words and remove stopwords.
     *
     * @param input - The input text to tokenize.
     * @returns An array of tokens.
     */
    tokenizer(input) {
      const tokens = Array.from(input.match(WORD_REGEX) || [])
      return removeStopwords(tokens)
    },
    /**
     * Stemming function to reduce words to their root form.
     */
    stemmer: stemmer,
    /**
     * Phonetic encoding function using Double Metaphone.
     */
    phonetic: doubleMetaphone
  }
})

// Selectors for DOM elements
const mediaQueryList = window.matchMedia('(min-width: 576px)')
const searchModal = document.querySelector<HTMLInputElement>('#search-modal')!
const searchForm = document.querySelector<HTMLInputElement>('#search-form')!
const searchQuery = document.querySelector<HTMLInputElement>('#search-query')!
const searchResults =
  document.querySelector<HTMLInputElement>('#search-results')!
const resultsContainer = document.querySelector<HTMLInputElement>('#results')!
const resultPagination = document.querySelector<HTMLInputElement>(
  '#results-pagination'
)!

/**
 * Handles the search functionality, including fetching the search index state,
 * performing searches, and displaying results.
 */
export async function handleSearch() {
  // Fetch the search index state
  const currentState = await fetchData<Dataset>(STATE_URL)
  if (currentState) boox.currentState = currentState

  // Determine results per page based on screen size
  let resultsPerPage = mediaQueryList.matches
    ? RESULTS_PER_PAGE_DESKTOP
    : RESULTS_PER_PAGE_MOBILE

  // Event listeners for modal and media query changes
  searchModal.addEventListener('shown.bs.modal', () => searchQuery.focus())
  searchModal.addEventListener('hide.bs.modal', () => {
    searchQuery.value = ''
    searchQuery.dispatchEvent(new Event('input'))
  })
  mediaQueryList.addEventListener('change', (e: MediaQueryListEvent) => {
    resultsPerPage = e.matches
      ? RESULTS_PER_PAGE_DESKTOP
      : RESULTS_PER_PAGE_MOBILE
  })

  // Debounced search function triggered on input changes
  searchQuery.addEventListener('input', debounce(performSearch, 300))

  /**
   * Performs a search and updates the UI with the results.
   *
   * @param e - The input event object.
   */
  async function performSearch(e: Event) {
    const query = (e.target as HTMLInputElement).value

    const results = await boox.search(query, {
      limit: 70,
      highlightTag: ['<mark>', '</mark>'],
      useQueryVector: true,
      matchingCoefficient(query, attributes) {
        const { section } = attributes as unknown as Dataset

        const maxLength = Math.max(query.length, section.length)
        const distance = levenshtein.distance(query, section)
        const similarity = 1 - distance / maxLength

        return similarity
      }
    })

    const paginatedResults = Boox.paginateSearchResults<Dataset>(
      results,
      1,
      resultsPerPage
    )

    updateUIVisibility(!!paginatedResults.results.length)
    displayResults(paginatedResults)
  }
}

/**
 * Handles clicks on search results to hide a modal.
 *
 * @param resultsSelector - The selector for the search results container.
 * @param modalSelector - The selector for the modal element.
 */
export function handleClickedSearchResults(
  resultsSelector: string,
  modalSelector: string
) {
  document.querySelector(resultsSelector)?.addEventListener('click', e => {
    const target = e.target as HTMLElement
    if (isSearchResultItem(target)) {
      const modalElement = document.querySelector<HTMLElement>(modalSelector)
      if (modalElement) {
        Modal.getOrCreateInstance(modalElement).hide()
      }
    }
  })
}

/**
 * Checks if the given element is a search result item.
 *
 * @param element - The element to check.
 * @returns True if the element is a search result item, false otherwise.
 */
function isSearchResultItem(element: HTMLElement): boolean {
  return (
    element.classList.contains('list-group-item-action') ||
    !!element.parentElement?.classList.contains('list-group-item-action')
  )
}

/**
 * Displays the paginated search results in the UI.
 *
 * @param paginatedResults - The paginated search results.
 */
function displayResults(paginatedResults: SearchResultWithPagination<Dataset>) {
  resultsContainer.innerHTML = ''

  for (const result of paginatedResults.results) {
    const { url } = result.attributes
    const { text: title } = result.context('title')
    let { text: section } = result.context('section')
    const { text: kwic } = result.kwic('content', 2, true)[0] || {}

    if (!/<mark>/.test(section) && kwic) {
      section =
        '...<span class="d-inline-block overflow-hidden text-nowrap align-middle" style="max-width:80%;">' +
        kwic +
        '</span>...'
    }

    const resultElement = document.createElement('a')

    resultElement.classList.add('list-group-item', 'list-group-item-action')
    resultElement.href = url
    resultElement.innerHTML = `<h4 class="mb-1">${section}</h4>\n<p class="mb-0 opacity-75">${title}</p>`
    resultsContainer.appendChild(resultElement)
  }

  createPageResultsLinks(paginatedResults)
}

/**
 * Creates pagination links for the search results.
 *
 * @param paginatedResults - The paginated search results.
 */
function createPageResultsLinks(
  paginatedResults: SearchResultWithPagination<Dataset>
) {
  resultPagination.innerHTML = ''

  if (paginatedResults.totalPages < 2) return

  for (let i = 1; i <= paginatedResults.totalPages; i++) {
    const li = document.createElement('li')
    li.classList.add('page-item')
    if (i === paginatedResults.currentPage) {
      li.classList.add('active')
    }

    const a = document.createElement('a')
    a.classList.add('page-link', 'rounded', 'border-0')
    if (i < 10) a.classList.add('px-3')
    a.href = '#'
    a.textContent = String(i)
    a.addEventListener('click', e => {
      e.preventDefault()
      displayResults(paginatedResults.goTo(i))
    })

    li.appendChild(a)
    resultPagination.appendChild(li)
  }
}

/**
 * Updates the visibility of UI elements based on search results.
 *
 * @param hasResults - Whether there are any search results to display.
 */
function updateUIVisibility(hasResults: boolean) {
  if (hasResults) {
    searchForm.classList.remove('border-0')
    searchResults.classList.add('d-md-block')
    searchResults.classList.remove('d-md-none')
  } else {
    searchForm.classList.add('border-0')
    searchResults.classList.add('d-md-none')
    searchResults.classList.remove('d-md-block')
  }
}
