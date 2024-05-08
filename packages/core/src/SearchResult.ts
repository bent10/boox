import type { Encoder } from './Encoder.js'
import type {
  Dataset,
  Document,
  QueryContext,
  SearchResultOptions
} from './types.js'

/**
 * Represents the result of a full-text search operation, providing information
 * about the search query's impact on the document.
 */
export class SearchResult<T extends object = Dataset> {
  /**
   * The search query.
   */
  query: string

  /**
   * The reference identifier for the document.
   */
  id: Document<T>['id']

  /**
   * The document elaborates on the fields within the dataset.
   */
  attributes: Document<T>['attributes']

  /**
   * The document magnitude.
   */
  magnitude: Document<T>['magnitude']

  /**
   * The score of the search result.
   */
  score: number

  /**
   * The HTML tag markers for keyword highlighting.
   */
  highlightTag: [string, string]

  vector: {
    dotProducts: number[]
    queryMagnitudeSquare: number[]
  } | null

  /**
   * The model encoder.
   */
  #encoder: Encoder

  /**
   * Creates a new SearchResult instance.
   *
   * @param options - The configuration options for the search result.
   */
  constructor(options: SearchResultOptions<T>) {
    const {
      encoder,
      query,
      document,
      highlightTag = ['<mark class="search-highlight">', '</mark>']
    } = options

    this.#encoder = encoder

    this.query = query
    this.id = document.id
    this.attributes = document.attributes
    this.magnitude = document.magnitude
    this.score = 0
    this.highlightTag = highlightTag
    this.vector = null
  }

  /**
   * Retrieves the context of the specified document attribute.
   *
   * @param key - The key of the document attribute to retrieve context for.
   * @param contextLength - The length of the returned context.
   * @returns The context of search results for a document, including
   *   keywords and their context.
   */
  context(key: keyof T, contextLength?: number): QueryContext {
    const text = <string>this.attributes[key] || ''

    if (!contextLength) {
      contextLength = text.length
    }

    const keywords = new Set<string>()
    let chunk = ''
    let index = 0

    while (index < text.length) {
      chunk = text.slice(index, index + contextLength)
      const indices = this.#findIndices(chunk)

      indices.map(({ keyword }) => keywords.add(keyword))

      if (keywords.size) break

      index += contextLength
    }

    return {
      keywords,
      text: this.#highlightSearchTerms(chunk, keywords)
    }
  }

  /**
   * Retrieves keyword in context (KWIC) results for the specified document
   * attribute.
   *
   * @param key - The key of the document attribute to retrieve KWIC results
   *   for.
   * @param wordsAround The number of words to retrieve before and
   *   after the keyword.
   * @param isSorted - Whether to sort the results by keyword size.
   * @returns An array of KWIC results for a document, including keywords
   *   and their context.
   */
  kwic(key: keyof T, wordsAround = 7, isSorted = false) {
    const results: QueryContext[] = []
    const text = <string>this.attributes[key] || ''

    if (!text) {
      return results
    }

    const normalizedText = text
      .split(/\r\n|\r|\n/)
      .filter(line => line.trim() !== '')
      .join(' ')

    this.#findIndices(normalizedText).forEach(({ index }) => {
      const context = this.#getWordsAroundIndex(
        normalizedText,
        index,
        wordsAround
      )

      if (context) {
        const keywords = new Set(this.#extractKeywords(context))

        results.push({
          keywords,
          text: this.#highlightSearchTerms(context, keywords)
        })
      }
    })

    return isSorted
      ? results.sort((a, b) => b.keywords.size - a.keywords.size)
      : results
  }

  /**
   * Highlights search terms within the text.
   *
   * @param text - The text to highlight search terms in.
   * @returns The text with search terms highlighted.
   */
  #highlightSearchTerms(
    text: string,
    fallbackKeywords: QueryContext['keywords']
  ) {
    const escapedQuery = this.#escapeRegExp(this.query)
    const pattern =
      new RegExp(escapedQuery, 'i').test(text) || !fallbackKeywords.size
        ? escapedQuery
        : Array.from(fallbackKeywords)
            .map(k => this.#escapeRegExp(k))
            .join('|')

    const regex = new RegExp(`(${pattern})`, 'gi')
    const [openTag, closeTag] = this.highlightTag

    return text
      .replace(/^\W+/, '')
      .replace(regex, `${openTag}$1${closeTag}`)
      .trimEnd()
  }

  /**
   * Retrieves the specified number of words before and after the given index in
   * a text.
   *
   * @param text The large text.
   * @param index The index around which to retrieve words.
   * @param wordsAround The number of words to retrieve before and
   *   after the index.
   * @returns A string containing the specified number of words before and after the given index, separated by spaces.
   */
  #getWordsAroundIndex(text: string, index: number, wordsAround: number) {
    const wordBoundaryRegex =
      /(\b(?:\w|(?:&(?:[a-z0-9]+|#[0-9]{1,6}|#x[0-9a-f]{1,6});))+\b)/gi
    const words = text.match(wordBoundaryRegex)

    if (words) {
      const wordContainingIndex = words.find(
        word =>
          text.indexOf(word) <= index &&
          text.indexOf(word) + word.length >= index
      )

      if (wordContainingIndex) {
        const wordArrayIndex = words.indexOf(wordContainingIndex)

        // Calculate the start and end indices for the specified number of words before and after
        const start = Math.max(0, wordArrayIndex - wordsAround)
        const end = Math.min(words.length, wordArrayIndex + wordsAround + 1)

        return words.slice(start, end).join(' ')
      }
    }
  }

  /**
   * Finds the indices of query parts within the given text.
   *
   * @param text The text to search within.
   * @returns An array of indices where query parts are found within the text.
   */
  #findIndices(text: string) {
    const indices: Array<{ keyword: string; index: number }> = []
    const keywords = this.#extractKeywords(text)

    const textLowerCase = text.toLowerCase()
    let pointer = 0

    for (const keyword of keywords) {
      const index = textLowerCase.slice(pointer).indexOf(keyword.toLowerCase())

      if (index !== -1) {
        indices.push({ keyword, index })
        pointer = index + keyword.length
      }
    }

    return indices
  }

  /**
   * Extracts keywords from the given text that are similar to the search query.
   *
   * @param text The text to extract keywords from.
   * @returns An array of extracted keywords.
   */
  #extractKeywords(text: string): string[] {
    const qEncodings = this.#encoder.encode(this.query)
    const normalizedText = this.#encoder.normalize(text)

    return this.#encoder.tokenize(normalizedText).filter(keyword => {
      const kEncodings = this.#encoder.encode(keyword)
      return this.#areEncodingsSimilar(qEncodings, kEncodings)
    })
  }

  /**
   * Compares two encodings to check if they have at least one matching
   * element.
   *
   * @param encodings1 The first encodings to compare.
   * @param encodings2 The second encodings to compare.
   * @returns True if the encodings are similar, false otherwise.
   */
  #areEncodingsSimilar(encodings1: string[], encodings2: string[]) {
    const set = new Set(encodings1)
    for (const item of encodings2) {
      if (set.has(item)) {
        return true
      }
    }
    return false
  }

  /**
   * Escapes special characters in a string for use in a regular expression.
   *
   * @param string The string to escape.
   * @returns The escaped string.
   */
  #escapeRegExp(pattern: string) {
    return pattern.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d')
  }
}
