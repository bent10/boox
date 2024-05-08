/**
 * @typedef {import('../types').Pokemon} Pokemon
 * @typedef {import('../types').ResponseData} ResponseData
 */

const searchQueryInput = document.querySelector('#search-query')
const resultsList = document.querySelector('#results')
const resultsLength = document.querySelector('#results-length')

/**
 * Performs a search with the current query and updates the UI.
 */
const performSearch = debounce(async () => {
  /** @type {string} */
  const query = searchQueryInput?.value || ''

  const response = await fetch(`/search?q=${query}`, { method: 'GET' })
  /** @type {ResponseData} */
  const responseData = await response.json()

  updateUI(responseData)
}, 300)

/**
 * Updates the UI with the given response data.
 *
 * @param {ResponseData} data
 */
function updateUI({ totalDocuments, totalResults, results }) {
  resultsList?.classList.toggle('d-none', !totalResults)

  if (resultsLength) {
    resultsLength.classList.toggle('d-none', !totalResults)
    resultsLength.textContent = totalResults
      ? `Found ${totalResults} of ${totalDocuments} pokemons`
      : ''
  }

  displayResults(results)
}

/**
 * Displays the search results in the results list.
 *
 * @param {Pokemon[]} results - The array of Pokemon objects.
 */
function displayResults(results) {
  if (!resultsList) return

  resultsList.innerHTML = ''

  results.forEach(result => {
    const { image_url, image_alt, hp, name, set_name, caption } = result

    const resultElement = document.createElement('a')
    resultElement.classList.add(
      'list-group-item',
      'list-group-item-action',
      'd-flex',
      'gap-3',
      'py-3'
    )
    resultElement.href = image_url
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

/**
 * Debounces a function, ensuring it is not called more frequently than the specified delay.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
function debounce(func, delay) {
  let timeoutId

  return function (...args) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this

    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      func.apply(context, args)
    }, delay)
  }
}

searchQueryInput?.addEventListener('input', performSearch)
