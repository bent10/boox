import generateBatches from 'batch-me-up'
import { Model } from './Model.js'
import { SearchResult } from './SearchResult.js'
import type {
  BooxOptions,
  CommitSearchResultConfig,
  Dataset,
  Document,
  QueryTF,
  SearchOptions,
  SearchResultWithPagination,
  SearchResultsAdvanceOptions,
  SearchSuggestionsOptions,
  State
} from './types.js'

/**
 * A class to perform comprehensive full-text search across multiple
 * documents by combining [TF-IDF](https://en.wikipedia.org/wiki/Tf-idf) score with [inverted index](https://en.wikipedia.org/wiki/Inverted_index).
 *
 * @template T - The type of the dataset object.
 */
export default class Boox<T extends object = Dataset> {
  /**
   * Options for configuring a dataset, allowing customization of identifiers,
   * features, and attributes.
   */
  #configs: Pick<Required<BooxOptions<T>>, 'id' | 'features' | 'attributes'>

  /**
   * The search model used for indexing and searching.
   */
  #model: Model<T>

  /**
   * The dataset fields to include in the document as they are.
   */
  #attributeKeys: Array<keyof T>

  /**
   * Array to store recent search queries for search history.
   */
  #searchHistory: string[] = []

  /**
   * Object to store the frequency of search queries for popular searches.
   */
  #popularSearches: { [query: string]: number } = {}

  /**
   * Map to store search results associated with search queries.
   */
  #searchResultsCache: Map<string, SearchResult<T>[]> = new Map()

  /**
   * Creates a new Boox instance.
   *
   * @param options Options for configuring the Boox instance.
   */
  constructor(options: BooxOptions<T>) {
    const {
      id = 'id' as keyof T,
      features = [],
      attributes = [],
      modelOptions
    } = options

    this.#configs = { id, features, attributes }
    this.#model = new Model<T>({
      featureKeys: features as string[],
      ...modelOptions
    })
    this.#attributeKeys = [...features, ...attributes]
  }

  /**
   * Gets the current state of the Boox instance.
   */
  get currentState(): State<T> {
    return {
      configs: this.#configs,
      documents: this.#model.documents,
      features: this.#model.features,
      popularSearches: this.#popularSearches
    }
  }

  /**
   * Sets the current state of the Boox instance.
   *
   * @param state The state to set for the Boox instance.
   */
  set currentState(newState: State<T>) {
    this.#configs = newState.configs
    this.#model.documents = newState.documents
    this.#model.features = newState.features
    this.#popularSearches = newState.popularSearches
  }

  /**
   * Adds multiple documents for indexing and search.
   *
   * @param datasets An array dataset object containing document
   *   information.
   */
  async addDocuments(datasets: T[]) {
    const batches = await generateBatches<T>(datasets)

    await Promise.all(
      batches.map(async batch => {
        await Promise.all(batch.map(dataset => this.addDocument(dataset)))
      })
    )
  }

  /**
   * Adds multiple documents for indexing and search synchronously.
   *
   * @param datasets An array dataset object containing document
   *   information.
   */
  addDocumentsSync(datasets: T[]) {
    for (const dataset of datasets) {
      this.addDocumentSync(dataset)
    }
  }

  /**
   * Adds a new document for indexing and search.
   *
   * @param dataset The dataset object containing document
   *   information.
   */
  async addDocument(dataset: T) {
    try {
      const id = String(dataset[this.#configs.id])

      if (!id || id === 'undefined') {
        throw new TypeError(
          `"${String(this.#configs.id)}" not found in dataset.`
        )
      }

      if (this.getDocument(id)) {
        throw new TypeError(
          `Document with the ID "${id}" already exists. Please use the "boox.update()" instead.`
        )
      }

      const document = <Document<T>>{ id, attributes: {}, magnitude: 0 }
      const batches = await generateBatches<keyof T>(this.#attributeKeys)

      // adds document attributes
      await Promise.all(
        batches.map(async batch => {
          await Promise.all(
            batch.map(key =>
              this.#addToDocumentAttrs(document, key, dataset[key])
            )
          )
        })
      )

      // train document and save
      this.#model.train(document)
    } catch (error) {
      console.error('Error occurred while adding document:\n', error)
    }
  }

  /**
   * Adds a new document for indexing and search synchronously.
   *
   * @param dataset The dataset object containing document
   *   information.
   */
  addDocumentSync(dataset: T) {
    try {
      const id = String(dataset[this.#configs.id])

      if (!id || id === 'undefined') {
        throw new TypeError(
          `"${String(this.#configs.id)}" not found in dataset.`
        )
      }

      if (this.getDocument(id)) {
        throw new TypeError(
          `Document with the ID "${id}" already exists. Please use the "boox.update()" instead.`
        )
      }

      const document = <Document<T>>{ id, attributes: {}, magnitude: 0 }

      // adds document attributes
      for (const key of this.#attributeKeys) {
        this.#addToDocumentAttrs(document, key, dataset[key])
      }

      // train document and save
      this.#model.train(document)
    } catch (error) {
      console.error('Error occurred while adding document:\n', error)
    }
  }

  /**
   * Retrieves the content of a document based on its reference identifier.
   *
   * @param id - The reference identifier of the document to retrieve.
   * @returns The document containing reference identifier and associated attributes, or
   *   `undefined` if the document is not found.
   */
  getDocument(id: string): Document<T> | undefined {
    return this.#model.documents[id]
  }

  /**
   * Updates an existing document with new data.
   *
   * @param dataset The dataset object containing updated document
   * information.
   */
  async updateDocument(dataset: T) {
    try {
      const id = String(dataset[this.#configs.id])

      if (!id || id === 'undefined') {
        throw new TypeError(
          `"${String(this.#configs.id)}" not found in dataset.`
        )
      }

      const document = <Document<T>>{ id, attributes: {}, magnitude: 0 }
      const batches = await generateBatches<keyof T>(this.#attributeKeys)

      // adds document attributes
      await Promise.all(
        batches.map(async batch => {
          await Promise.all(
            batch.map(key =>
              this.#addToDocumentAttrs(document, key, dataset[key])
            )
          )
        })
      )

      // update document and save
      this.#model.update(document)
    } catch (error) {
      console.error('Error occurred while updating document:\n', error)
    }
  }

  /**
   * Updates an existing document with new data synchronously.
   *
   * @param dataset The dataset object containing updated document
   *   information.
   */
  updateDocumentSync(dataset: T) {
    try {
      const id = String(dataset[this.#configs.id])

      if (!id || id === 'undefined') {
        throw new TypeError(
          `"${String(this.#configs.id)}" not found in dataset.`
        )
      }

      const document = <Document<T>>{ id, attributes: {}, magnitude: 0 }

      // adds document attributes
      for (const key of this.#attributeKeys) {
        this.#addToDocumentAttrs(document, key, dataset[key])
      }

      // update document and save
      this.#model.update(document)
    } catch (error) {
      console.error('Error occurred while updating document:\n', error)
    }
  }

  /**
   * Removes a document from the index.
   *
   * @param id The identifier of the document to remove.
   * @returns `true` if the document is successfully removed, `false`
   *   otherwise.
   */
  removeDocument(id: string) {
    const document = this.getDocument(id)

    if (!document) return false

    this.#model.remove(id)
    return true
  }

  /**
   * Searches for documents that match the given query.
   *
   * @param query The search query.
   * @param options Additional search options.
   * @returns A promise that resolves to an array of search results.
   */
  async search(query: string, options: SearchOptions<T> = {}) {
    try {
      const {
        matchingCoefficient,
        queryExpander,
        limit,
        highlightTag,
        useQueryVector
      } = options

      if (typeof queryExpander === 'function') {
        query = queryExpander(query)
      }

      const normalizedQuery = this.#model.encoder
        .normalize(query)
        .replace(/\.$/, '')

      // check if the search results are cached
      const cachedResults = this.#getSearchResultsCache(normalizedQuery)
      if (cachedResults) {
        this.#addToSearchHistory(normalizedQuery)
        return cachedResults.slice(0, limit || cachedResults.length)
      }

      const rawResults = await this.#performAsyncSearch(normalizedQuery, {
        highlightTag,
        useQueryVector
      })

      return await this.#processAsyncSearchResults(
        normalizedQuery,
        rawResults,
        {
          matchingCoefficient,
          limit
        }
      )
    } catch (error) {
      console.error('Error occurred while searching:\n', error)
      return []
    }
  }

  /**
   * Searches for documents that match the given query synchronously.
   *
   * @param query The search query.
   * @param options Additional search options.
   * @returns An array of search results.
   */
  searchSync(query: string, options: SearchOptions<T> = {}) {
    try {
      const {
        matchingCoefficient,
        queryExpander,
        limit,
        highlightTag,
        useQueryVector
      } = options

      if (typeof queryExpander === 'function') {
        query = queryExpander(query)
      }

      const normalizedQuery = this.#model.encoder
        .normalize(query)
        .replace(/\.$/, '')

      // check if the search results are cached
      const cachedResults = this.#getSearchResultsCache(normalizedQuery)
      if (cachedResults) {
        this.#addToSearchHistory(normalizedQuery)
        return cachedResults.slice(0, limit || cachedResults.length)
      }

      const rawResults = this.#performSyncSearch(normalizedQuery, {
        highlightTag,
        useQueryVector
      })

      return this.#processSyncSearchResults(normalizedQuery, rawResults, {
        matchingCoefficient,
        limit
      })
    } catch (error) {
      console.error('Error occurred while searching:\n', error)
      return []
    }
  }

  /**
   * Retrieves the recent search history.
   *
   * @param limit The maximum number of recent searches to retrieve.
   * @returns An array of recent search queries.
   */
  getSearchHistory(limit: number = 10) {
    return this.#searchHistory.slice(0, limit)
  }

  /**
   * Retrieves the popular searches sorted by frequency.
   *
   * @param limit The maximum number of popular searches to retrieve.
   * @returns An array of tuple popular search queries sorted by frequency.
   */
  getPopularSearches(limit: number = 10) {
    return Object.entries(this.#popularSearches)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
  }

  /**
   * Retrieves search suggestions based on popular queries or previously
   * searched terms.
   *
   * @param queryPrefix The prefix of the search query entered by the
   *   user.
   * @param options Additional options for retrieving search suggestions.
   * @returns An array of search query suggestions.
   */
  getSearchSuggestions(
    queryPrefix: string,
    options: SearchSuggestionsOptions = {}
  ) {
    const { threshold = 1, limit = 10, filter = () => true } = options

    const popularSearchesLength = Object.keys(this.#popularSearches).length
    const popularSearches = this.getPopularSearches(popularSearchesLength)

    return popularSearches
      .filter(
        ([suggestion, score]) =>
          suggestion.toLowerCase().startsWith(queryPrefix.toLowerCase()) &&
          score >= threshold
      )
      .map(([suggestion]) => suggestion)
      .filter(filter)
      .slice(0, limit)
  }

  /**
   * Utility method for paginating search results.
   *
   * @param results The search results to paginate.
   * @param page The current page number.
   * @param resultsPerPage The number of results per page.
   * @returns The paginated search results with pagination information and
   *   navigation function.
   */
  static paginateSearchResults<T extends object = Dataset>(
    results: SearchResult<T>[],
    page: number = 1,
    resultsPerPage: number = 10
  ): SearchResultWithPagination<T> {
    const totalResults = results.length
    const totalPages = Math.ceil(totalResults / resultsPerPage)

    const goTo = (
      index: 'first' | 'last' | 'prev' | 'next' | number
    ): SearchResultWithPagination<T> => {
      let newPage = page
      switch (index) {
        case 'first':
          newPage = 1
          break
        case 'last':
          newPage = totalPages
          break
        case 'prev':
          newPage = Math.max(1, page - 1)
          break
        case 'next':
          newPage = Math.min(totalPages, page + 1)
          break
        default:
          newPage = index
          break
      }

      return Boox.paginateSearchResults<T>(results, newPage, resultsPerPage)
    }

    const startIndex = (page - 1) * resultsPerPage
    const endIndex = startIndex + resultsPerPage
    const paginatedResults = results.slice(startIndex, endIndex)

    const currentPage: SearchResultWithPagination<T> = {
      currentPage: page,
      totalPages,
      totalResults,
      results: paginatedResults,
      goTo
    }

    Object.defineProperty(currentPage, 'goTo', {
      enumerable: false
    })

    return currentPage
  }

  /**
   * Adds attributes to the document based on the dataset.
   *
   * @param document The document to which attributes are added.
   * @param key The key of the attribute.
   * @param value The value of the attribute.
   */
  #addToDocumentAttrs(document: Document<T>, key: keyof T, value: T[keyof T]) {
    if (value) {
      document.attributes[key] = value
    }
  }

  /**
   * Performs asynchronous search operation.
   *
   * @param normalizedQuery The normalized search query.
   * @param options Additional options for the search operation.
   * @returns An array of search results.
   */
  async #performAsyncSearch(
    normalizedQuery: string,
    options: Pick<SearchOptions<T>, 'highlightTag' | 'useQueryVector'> = {}
  ) {
    const { highlightTag, useQueryVector = false } = options

    const queryEncodings = this.#model.encoder.encode(normalizedQuery)
    const queryEncodingsTF = useQueryVector
      ? this.#getQueryTF(queryEncodings)
      : {}

    const resultMap: { [id: string]: SearchResult<T> } = {}

    const batches = await generateBatches<string>(queryEncodings)

    await Promise.all(
      batches.map(async batch => {
        for (const encoding of batch) {
          const encodingTF = useQueryVector ? queryEncodingsTF[encoding] : 0

          for (const key in this.#model.features) {
            const attribute = this.#model.features[key]!
            const matchedDocs = attribute[encoding]

            if (!matchedDocs) continue

            const docIDF = this.#model.calculateIDF(encoding)

            await Promise.all(
              Object.entries(matchedDocs).map(([id, tf]) =>
                this.#commitSearchResult(resultMap, {
                  id,
                  highlightTag,
                  useQueryVector,
                  query: normalizedQuery,
                  queryTFIDF: useQueryVector ? encodingTF * docIDF : 0,
                  tfidf: tf * docIDF
                })
              )
            )
          }
        }
      })
    )

    // applies vector similarity if enabled
    if (useQueryVector) {
      for (const key in resultMap) {
        this.#assignQueryVector(resultMap[key])
      }
    }

    return Object.values(resultMap)
  }

  /**
   * Performs synchronous search operation.
   *
   * @param normalizedQuery The normalized search query.
   * @param options Additional options for the search operation.
   * @returns An array of search results.
   */
  #performSyncSearch(
    normalizedQuery: string,
    options: Pick<SearchOptions<T>, 'highlightTag' | 'useQueryVector'> = {}
  ) {
    const { highlightTag, useQueryVector = false } = options

    const queryEncodings = this.#model.encoder.encode(normalizedQuery)
    const queryEncodingsTF = useQueryVector
      ? this.#getQueryTF(queryEncodings)
      : {}

    const resultMap: { [id: string]: SearchResult<T> } = {}

    for (const encoding of queryEncodings) {
      const encodingTF = useQueryVector ? queryEncodingsTF[encoding] : 0

      for (const key in this.#model.features) {
        const attribute = this.#model.features[key]!
        const matchedDocs = attribute[encoding]

        if (matchedDocs) {
          const docIDF = this.#model.calculateIDF(encoding)

          Object.entries(matchedDocs).forEach(([id, tf]) =>
            this.#commitSearchResult(resultMap, {
              id,
              highlightTag,
              useQueryVector,
              query: normalizedQuery,
              queryTFIDF: useQueryVector ? encodingTF * docIDF : 0,
              tfidf: tf * docIDF
            })
          )
        }
      }
    }

    // applies vector similarity if enabled
    if (useQueryVector) {
      for (const key in resultMap) {
        this.#assignQueryVector(resultMap[key])
      }
    }

    return Object.values(resultMap)
  }

  /**
   * Retrieves the term frequency of query encodings.
   *
   * @param queryEncodings The encodings of the search query.
   * @returns A mapping of query encodings to their term frequency.
   */
  #getQueryTF(queryEncodings: string[]): QueryTF {
    const queryTF: QueryTF = {}
    const terms = this.#model.terms

    for (const encoding of queryEncodings) {
      if (terms.has(encoding)) {
        if (!queryTF[encoding]) {
          queryTF[encoding] = 0
        }
        queryTF[encoding] += this.#model.calculateTermFrequency(
          queryEncodings,
          encoding
        )
      }
    }

    return queryTF
  }

  /**
   * Assigns query vector to search result for vector similarity calculation.
   *
   * @param result The search result to which the query vector is
   *   assigned.
   */
  #assignQueryVector(result: SearchResult<T>) {
    if (result.vector) {
      const dotProduct = result.vector.dotProducts.reduce(
        (acc, curr) => (acc += curr),
        0
      )
      const queryMagnitude = Math.sqrt(
        result.vector.queryMagnitudeSquare.reduce(
          (acc, curr) => (acc += curr),
          0
        )
      )

      result.score = dotProduct / (queryMagnitude * result.magnitude)
    }
  }

  /**
   * Commits a search result to the result map, either updating an existing
   * result or creating a new one.
   *
   * @param resultMap The map containing search results.
   * @param options Options for committing the search result.
   */
  #commitSearchResult(
    resultMap: { [id: string]: SearchResult<T> },
    options: CommitSearchResultConfig
  ) {
    const { id, tfidf, queryTFIDF, useQueryVector, ...restOpts } = options
    let result = resultMap[id]

    if (!result) {
      result = new SearchResult<T>({
        encoder: this.#model.encoder,
        document: this.getDocument(id)!,
        ...restOpts
      })

      resultMap[id] = result
    }

    if (useQueryVector) {
      if (result.vector === null) {
        result.vector = {
          dotProducts: [],
          queryMagnitudeSquare: []
        }
      }

      result.vector.dotProducts.push(tfidf * queryTFIDF)
      result.vector.queryMagnitudeSquare.push(Math.pow(queryTFIDF, 2))
    } else {
      result.score += tfidf
    }
  }

  /**
   * Processes search results asynchronously, applying advanced similarity
   * scoring if specified in options.
   *
   * @param normalizedQuery The normalized search query.
   * @param rawResults The raw search results to process.
   * @param options Advance search result options for processing search
   *   results.
   * @returns Processed search results.
   */
  async #processAsyncSearchResults(
    normalizedQuery: string,
    rawResults: SearchResult<T>[],
    options: SearchResultsAdvanceOptions<T> = {}
  ) {
    const { matchingCoefficient, limit } = options
    let similaryResults: SearchResult<T>[] = rawResults

    // advance similarity scoring
    if (typeof matchingCoefficient === 'function') {
      const highestScore = this.#maxSearchResultsScore(rawResults)
      const batches = await generateBatches<SearchResult<T>>(rawResults)
      // reset similaryResults
      similaryResults = []

      // increases the score based on the attributes similarity
      await Promise.all(
        batches.map(async batch => {
          await Promise.all(
            batch.map(result => {
              const coefficient = matchingCoefficient.call(
                this.#model.encoder,
                result.query,
                result.attributes
              )
              if (coefficient > 0) {
                result.score += highestScore * coefficient
              }
              similaryResults.push(result)
            })
          )
        })
      )
    }

    const results = similaryResults.sort((a, b) => b.score - a.score)

    // cache search results and update search history
    this.#searchResultsCache.set(normalizedQuery, results)
    this.#addToSearchHistory(normalizedQuery)

    return limit ? results.slice(0, limit) : results
  }

  /**
   * Processes search results synchronously, applying advanced similarity
   * scoring if specified in options.
   *
   * @param normalizedQuery The normalized search query.
   * @param rawResults The raw search results to process.
   * @param options Advance search result options for processing search
   *   results.
   * @returns Processed search results.
   */
  #processSyncSearchResults(
    normalizedQuery: string,
    rawResults: SearchResult<T>[],
    options: SearchResultsAdvanceOptions<T> = {}
  ) {
    const { matchingCoefficient, limit } = options
    let similaryResults = rawResults

    // advance similarity scoring
    if (typeof matchingCoefficient === 'function') {
      const highestScore = this.#maxSearchResultsScore(rawResults)

      // increases the score based on the attributes similarity
      similaryResults = rawResults.map(result => {
        const coefficient = matchingCoefficient.call(
          this.#model.encoder,
          result.query,
          result.attributes
        )
        if (coefficient > 0) {
          result.score += highestScore * coefficient
        }
        return result
      })
    }

    const results = similaryResults.sort((a, b) => b.score - a.score)

    // cache search results and update search history
    this.#searchResultsCache.set(normalizedQuery, results)
    this.#addToSearchHistory(normalizedQuery)

    return limit ? results.slice(0, limit) : results
  }

  /**
   * Calculates the maximum score among the search results.
   *
   * @param rawResults - An array of search results.
   * @returns The maximum score among the search results.
   */
  #maxSearchResultsScore(rawResults: SearchResult<T>[]) {
    return rawResults.reduce((maxScore, { score }) => {
      return score > maxScore ? score : maxScore
    }, 0)
  }

  /**
   * Adds a new search query and its result to the search history.
   *
   * @param normalizedQuery The normalized search query.
   */
  #addToSearchHistory(normalizedQuery: string) {
    // add at the beginning
    this.#searchHistory.unshift(normalizedQuery)
    // keep only the latest 100 search queries in history
    this.#searchHistory = this.#searchHistory.slice(0, 100)

    this.#popularSearches[normalizedQuery] =
      (this.#popularSearches[normalizedQuery] || 0) + 1
  }

  /**
   * Retrieves search results cache associated with a specific query.
   *
   * @param normalizedQuery The normalized search query.
   * @returns An array of search results associated with the query.
   */
  #getSearchResultsCache(
    normalizedQuery: string
  ): SearchResult<T>[] | undefined {
    return this.#searchResultsCache.get(normalizedQuery)
  }
}

export type { SearchResult }
export type * from './types.js'
