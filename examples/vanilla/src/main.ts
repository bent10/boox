import Boox, { type SearchResult } from 'boox'
import debounce from 'debounce'
import { metaphone } from 'metaphone'
import { stemmer } from 'stemmer'
import { removeStopwords } from 'stopword'

/**
 * Interface representing a Pokemon data object.
 */
interface Pokemon {
  id: string
  image_url: string
  caption: string
  name: string
  hp: number
  set_name: string
}

const searchQueryInput =
  document.querySelector<HTMLInputElement>('#search-query')
const resultsList = document.querySelector<HTMLDivElement>('#results')
const resultsLength =
  document.querySelector<HTMLParagraphElement>('#results-length')

/**
 * The Boox instance for searching Pokemon data.
 */
const boox = new Boox<Pokemon>({
  features: ['name', 'caption', 'set_name'],
  attributes: ['hp', 'image_url'],
  modelOptions: {
    tokenizer(input) {
      // Split into words and remove stopwords
      return removeStopwords(Array.from(input.match(/\b\w+\b/g) || []))
    },
    // Use the Porter stemmer
    stemmer: stemmer,
    // Use Double Metaphone for phonetic encoding
    phonetic: metaphone
  }
})

/**
 * Fetches Pokemon data from the specified URL.
 *
 * @returns A promise that resolves to an array of Pokemon objects.
 */
async function fetchData(): Promise<Pokemon[]> {
  try {
    const response = await fetch(
      'https://stilearning.com/boox/demo/datasets/pokemon-100r.json',
      { cache: 'default' }
    )
    return await response.json()
  } catch (error) {
    throw error
  }
}

fetchData().then(async pokemons => {
  await boox.addDocuments(pokemons)
})

/**
 * Performs a search with the current query and updates the UI.
 */
const performSearch = debounce(async () => {
  const query = searchQueryInput?.value || ''

  const results = await boox.search(query)
  updateUI(results)
}, 300)

/**
 * Updates the UI with the given search results.
 *
 * @param results - The array of SearchResult objects.
 */
function updateUI(results: SearchResult<Pokemon>[]) {
  resultsList?.classList.toggle('d-none', !results.length)

  if (resultsLength) {
    resultsLength.classList.toggle('d-none', !results.length)
    resultsLength.textContent = results.length
      ? `Found ${results.length} of ${Object.keys(boox.currentState.documents).length} pokemons`
      : ''
  }

  displayResults(results)
}

/**
 * Displays the search results in the results list.
 *
 * @param results - The array of SearchResult objects.
 */
function displayResults(results: SearchResult<Pokemon>[]) {
  if (!resultsList) return

  resultsList.innerHTML = ''

  results.forEach(result => {
    const { image_url, name: image_alt, hp } = result.attributes
    const { text: name } = result.context('name')
    const { text: set_name } = result.context('set_name')
    const { text: caption } = result.context('caption', 80)

    const resultElement = document.createElement('a')
    resultElement.classList.add(
      'list-group-item',
      'list-group-item-action',
      'd-flex',
      'gap-3',
      'py-3'
    )
    resultElement.href = String(image_url)
    resultElement.target = '_blank'
    resultElement.innerHTML = `<img loading='lazy' src="${image_url}" alt="${image_alt}" width="32" height="32" class="rounded-circle flex-shrink-0">
      <div class="d-flex gap-2 w-100 justify-content-between">
        <div>
          <h6 class="mb-1">${name} – ${set_name}</h6>
          <p class="mb-0 opacity-75">${caption}...</p>
        </div>
        <small class="opacity-50 text-nowrap">HP ${hp}</small>
      </div>`
    resultsList.appendChild(resultElement)
  })
}

searchQueryInput?.addEventListener('input', performSearch)
