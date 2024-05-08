/**
 * A Pokemon data object.
 */
export interface Pokemon {
  image_url: string
  image_alt: string
  hp: number
  name: string
  set_name: string
  caption: string
}

/**
 * The response data from a search query.
 */
export interface ResponseData {
  totalDocuments: number
  totalResults: number
  results: Pokemon[]
}
