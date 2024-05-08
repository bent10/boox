import type { Encoder } from './Encoder.js'
import type { SearchResult } from './SearchResult.js'

/**
 * Options for configuring Boox instance.
 */
export interface BooxOptions<T extends object = Dataset> {
  /**
   * The property to use as the unique identifier for each item in the dataset.
   */
  id?: keyof T

  /**
   * The dataset fields that will be indexed.
   */
  features?: Array<keyof T>

  /**
   * The dataset fields to include in the document as they are.
   */
  attributes?: Array<keyof T>

  /**
   * Configuration options for Boox model.
   */
  modelOptions?: Omit<ModelOptions, 'featureKeys'>
}

/**
 * Defines the default dataset structure; it's recommended to customize it for
 * your specific data types.
 */
export interface Dataset {
  id: string | number
  [key: string]: unknown
}

/**
 * Configuration options for Boox model.
 */
export interface ModelOptions {
  /**
   * The dataset fields that will be indexed.
   */
  featureKeys?: string[]

  /**
   * Defines a custom normalizer function to be applied to the document
   * features.
   *
   * @param input - The document feature to normalize.
   * @returns The normalized text.
   */
  normalizer?: NormalizerFn

  /**
   * Defines a custom tokenizer function to be used for tokenizing the
   * document features.
   *
   * @param input - The input to tokenize.
   * @returns An array of tokens extracted from the input.
   */
  tokenizer?: TokenizerFn

  /**
   * Defines a function to generate phonetic representations of the document
   * features.
   *
   * Providing a custom phonetic function can enhance accuracy and reduce
   * false positives.
   *
   * @param input - The input to process.
   * @returns The phonetic representation(s) of the input.
   */
  phonetic?: PhoneticFn

  /**
   * Defines a stemming function to reduce words to their root form.
   *
   * Using a custom stemming function can improve accuracy and better align
   * with specific domain needs.
   *
   * @param input - The input to stem.
   * @returns The stemmed input.
   */
  stemmer?: StemmerFn
}

/**
 * A function to normalize document features using custom logic.
 *
 * @param input - The input to normalize.
 * @returns The normalized input.
 */
export type NormalizerFn = (input: string) => string

/**
 * A function to tokenize document features into an array of tokens.
 *
 * @param input - The input to tokenize.
 * @returns An array of tokens extracted from the input.
 */
export type TokenizerFn = (input: string) => string[]

/**
 * A function to generate phonetic representations of document features.
 *
 * @param input - The input to process.
 * @returns The phonetic representation(s) of the input.
 */
export type PhoneticFn = (input: string) => string | string[]

/**
 * A function to perform stemming on document features, reducing words to
 * their root form.
 *
 * @param input - The input to stem.
 * @returns The stemmed input.
 */
export type StemmerFn = (input: string) => string

/**
 * A collection of documents referenced by unique identifiers, each containing
 * reference identifier and associated attributes.
 */
export type Documents<T extends object = Dataset> = {
  [id: string]: Document<T>
}

/**
 * A document containing reference identifier and associated attributes.
 */
export interface Document<T extends object = Dataset> {
  /**
   * The reference identifier for the document.
   */
  id: string

  /**
   * The document elaborates on the fields within the dataset.
   */
  attributes: T

  /**
   * The calculated magnitude for the document.
   */
  magnitude: number
}

/**
 * An inverted index utilized for full-text search, mapping encoded information
 * to attribute features.
 */
export interface Features {
  /**
   * Mapping of attributes to their corresponding encoded information.
   */
  [attribute: string]: Encodings
}

/**
 * Mapping of encoded information to the list of documents containing the
 * attribute.
 */
export interface Encodings {
  [encoding: string]: {
    // term frequency of an encoding token in the document
    [id: string]: number
  }
}

/**
 * The state of the Boox instance.
 */
export interface State<T extends object = Dataset> {
  /**
   * Configuration settings for the Boox instance.
   */
  configs: Pick<Required<BooxOptions<T>>, 'id' | 'features' | 'attributes'>

  /**
   * The collection of documents indexed by their references identifier.
   */
  documents: Documents<T>

  /**
   * The map of features to their respective index references.
   */
  features: Features

  /**
   * A record of popular searches and their frequencies.
   */
  popularSearches: { [query: string]: number }
}

/**
 * Options for configuring search operations.
 */
export type SearchOptions<T extends object = Dataset> = Pick<
  SearchResultOptions,
  'highlightTag'
> &
  SearchResultsAdvanceOptions<T>

/**
 * Configuration options for generating search results.
 */
export interface SearchResultOptions<T extends object = Dataset> {
  /**
   * The encoder instance.
   */
  encoder: Encoder

  /**
   * The search query.
   */
  query: string

  /**
   * The document object.
   */
  document: Document<T>

  /**
   * The HTML tag markers for keyword highlighting.
   *
   * @default ['<mark class="search-highlight">', '</mark>']
   */
  highlightTag?: [string, string]
}

/**
 * Advanced options for search result customization and enhancement.
 */
export interface SearchResultsAdvanceOptions<T extends object = Dataset> {
  /**
   * Set to `true` to enable [Vector space model](https://en.wikipedia.org/wiki/Vector_space_model). This might be slightly slower
   * than inverted index, but offers better contextual precision.
   *
   * @default false
   * @experimental
   */
  useQueryVector?: boolean

  /**
   * Defines a query expander function to expand search query by including
   * synonyms or related terms.
   *
   * @param query - The search query to expand.
   * @returns The expanded query.
   */
  queryExpander?: (query: string) => string

  /**
   * Enhances query filtering and result accuracy by considering the similarity.
   *
   * **Note:** This is an advanced feature. It requires a deep understanding of the
   * underlying algorithms and may impact the search results. Ensure thorough
   * testing before implementing in production environments.
   *
   * The return value should be a number between 0 and 1, where 0 indicates no similarity
   * and 1 indicates an exact match.
   *
   * @param query - The search query.
   * @param attributes - A map of document attributes.
   * @returns A number between 0 and 1, where 0 indicates no similarity and 1 indicates
   *   an exact match.
   */
  matchingCoefficient?: (
    this: Encoder,
    query: string,
    attributes: Document<T>['attributes']
  ) => number

  /**
   * The maximum number of search results to return.
   */
  limit?: number
}

/**
 * A query vector containing term frequency values for encoded tokens.
 */
export interface QueryTF {
  [encoding: string]: number
}

/**
 * The context of search results for a document, including keywords and their
 * context.
 */
export interface QueryContext {
  /**
   * The keywords associated with search results for a document.
   */
  keywords: Set<string>

  /**
   * The textual context surrounding the keywords in the search results for a
   * document.
   */
  text: string
}

/**
 * Search results with pagination metadata.
 */
export interface SearchResultWithPagination<T extends object = Dataset> {
  /**
   * The array of search results.
   */
  results: SearchResult<T>[]

  /**
   * The total number of search results.
   */
  totalResults: number

  /**
   * The total number of pages based on pagination.
   */
  totalPages: number

  /**
   * The current page number.
   */
  currentPage: number

  /**
   * Navigates to a specific page in the paginated results.
   *
   * @param index -
   *   The index of the page to navigate to. Can be `'first'`, `'last'`,
   *   `'prev'`, `'next'`, or a page `number`.
   * @returns The updated SearchResultWithPagination object with the
   *   new page of results.
   */
  goTo(
    index: 'first' | 'last' | 'prev' | 'next' | number
  ): SearchResultWithPagination<T>
}

/**
 * Options for configuring search suggestions.
 */
export interface SearchSuggestionsOptions {
  /**
   * threshold The minimum popularity score required for a search suggestion
   * to be returned.
   *
   * @default 1
   */
  threshold?: number

  /**
   * The maximum number of search suggestions to return.
   *
   * @default 10
   */
  limit?: number

  /**
   * A custom function used to filter search suggestions.
   *
   * @param suggestion - The search suggestion.
   * @returns A boolean indicating whether to include the suggestion.
   */
  filter?: (suggestion: string) => boolean
}

/**
 * @private
 */
export interface CommitSearchResultConfig
  extends Pick<SearchResultOptions, 'query' | 'highlightTag'> {
  id: string
  tfidf: number
  queryTFIDF: number
  useQueryVector: boolean
}
