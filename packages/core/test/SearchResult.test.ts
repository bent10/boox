/// <reference types="vitest/globals" />

import Boox from '../src/index.js'
import { SearchResult } from '../src/SearchResult.js'
import { Encoder } from '../src/Encoder.js'

interface Doc {
  title: string
  content: string
  [key: string]: unknown
}

describe('SearchResult', () => {
  let searchResult: SearchResult<Doc>

  beforeEach(() => {
    searchResult = new SearchResult<Doc>({
      encoder: new Encoder(),
      query: 'lorem bar',
      document: {
        id: '1',
        attributes: {
          empty: '',
          title: 'Lorem Ipsum',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nLorem foo bar.'
        },
        magnitude: 1
      }
    })
  })

  it('should initialize SearchResult object correctly', () => {
    expect(searchResult.query).toBe('lorem bar')
    expect(searchResult.id).toBe('1')
    expect(searchResult.attributes).toEqual({
      empty: '',
      title: 'Lorem Ipsum',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n\nLorem foo bar.'
    })
    expect(searchResult.magnitude).toBe(1)
    expect(searchResult.score).toBe(0)
    expect(searchResult.highlightTag).toEqual([
      '<mark class="search-highlight">',
      '</mark>'
    ])
    expect(searchResult.vector).toBe(null)
  })

  it('should retrieve context for a document attribute', () => {
    const context = searchResult.context('content')

    expect(context).toEqual({
      keywords: new Set(['lorem', 'bar']),
      text: '<mark class="search-highlight">Lorem</mark> ipsum dolor sit amet, consectetur adipiscing elit.\n\n<mark class="search-highlight">Lorem</mark> foo <mark class="search-highlight">bar</mark>.'
    })
  })

  it('should retrieve context for a document attribute with specified length', () => {
    const context = searchResult.context('content', 40)

    expect(context).toEqual({
      keywords: new Set(['lorem']),
      text: '<mark class="search-highlight">Lorem</mark> ipsum dolor sit amet, consectetur'
    })
  })

  it('should retrieve context for a deep query location', () => {
    searchResult.query = 'bar'
    const context = searchResult.context('content', 40)

    expect(context).toEqual({
      keywords: new Set(['bar']),
      text: 'adipiscing elit.\n\nLorem foo <mark class="search-highlight">bar</mark>.'
    })
  })

  it('should retrieve kwic results for a document attribute', () => {
    const kwic = searchResult.kwic('content')

    expect(kwic).toMatchInlineSnapshot(`
      [
        {
          "keywords": Set {
            "lorem",
          },
          "text": "<mark class="search-highlight">Lorem</mark> ipsum dolor sit amet consectetur adipiscing elit",
        },
        {
          "keywords": Set {
            "lorem",
            "bar",
          },
          "text": "<mark class="search-highlight">Lorem</mark> ipsum dolor sit amet consectetur adipiscing elit <mark class="search-highlight">Lorem</mark> foo <mark class="search-highlight">bar</mark>",
        },
        {
          "keywords": Set {
            "lorem",
          },
          "text": "<mark class="search-highlight">Lorem</mark> ipsum dolor sit amet consectetur adipiscing elit <mark class="search-highlight">Lorem</mark>",
        },
      ]
    `)
  })

  it('should retrieve sorted kwic results for a document attribute', () => {
    const kwic = searchResult.kwic('content', 3, true)

    expect(kwic).toMatchInlineSnapshot(`
      [
        {
          "keywords": Set {
            "lorem",
            "bar",
          },
          "text": "amet consectetur adipiscing elit <mark class="search-highlight">Lorem</mark> foo <mark class="search-highlight">bar</mark>",
        },
        {
          "keywords": Set {
            "lorem",
          },
          "text": "<mark class="search-highlight">Lorem</mark> ipsum dolor sit",
        },
        {
          "keywords": Set {
            "lorem",
          },
          "text": "<mark class="search-highlight">Lorem</mark> ipsum dolor sit amet",
        },
      ]
    `)
  })

  it('should resolve missing attribute', () => {
    const context = searchResult.context('missingKey', 40)
    const kwic = searchResult.kwic('missingKey', 40)

    expect(context).toEqual({ keywords: new Set(), text: '' })
    expect(kwic).toEqual([])
  })
})

describe('SearchResultWithPagination', () => {
  let results: SearchResult<Doc>[]

  beforeEach(() => {
    results = Array.from({ length: 20 }, (_, i) => {
      return new SearchResult({
        query: 'Document',
        encoder: vi.fn() as never,
        document: {
          id: String(i) as never,
          attributes: {
            title: `Document ${i}`,
            content: 'Lorem ipsum dolor sit amet.'
          },
          magnitude: 1
        }
      })
    })
  })

  it('should navigate to the first page', () => {
    const paginatedResults = Boox.paginateSearchResults(results, 2, 5)
    const firstPageResults = paginatedResults.goTo('first')

    expect(firstPageResults.currentPage).toBe(1)
    expect(firstPageResults.results).toEqual(results.slice(0, 5))
  })

  it('should navigate to the last page', () => {
    const paginatedResults = Boox.paginateSearchResults(results, 2, 5)
    const lastPageResults = paginatedResults.goTo('last')

    expect(lastPageResults.currentPage).toBe(4)
    expect(lastPageResults.results).toEqual(results.slice(15, 20))
  })

  it('should navigate to the previous page', () => {
    const paginatedResults = Boox.paginateSearchResults(results, 3, 5)
    const prevPageResults = paginatedResults.goTo('prev')

    expect(prevPageResults.currentPage).toBe(2)
    expect(prevPageResults.results).toEqual(results.slice(5, 10))
  })

  it('should navigate to the next page', () => {
    const paginatedResults = Boox.paginateSearchResults(results, 2, 5)
    const nextPageResults = paginatedResults.goTo('next')

    expect(nextPageResults.currentPage).toBe(3)
    expect(nextPageResults.results).toEqual(results.slice(10, 15))
  })

  it('should navigate to a specific page by number', () => {
    const paginatedResults = Boox.paginateSearchResults(results, 1, 5)
    const specificPageResults = paginatedResults.goTo(3)

    expect(specificPageResults.currentPage).toBe(3)
    expect(specificPageResults.results).toEqual(results.slice(10, 15))
  })

  it('should stay on the first page when trying to go to a previous page', () => {
    const paginatedResults = Boox.paginateSearchResults(results, 1, 5)
    const firstPageResults = paginatedResults.goTo('prev')

    expect(firstPageResults.currentPage).toBe(1)
    expect(firstPageResults.results).toEqual(results.slice(0, 5))
  })

  it('should stay on the last page when trying to go to a next page', () => {
    const paginatedResults = Boox.paginateSearchResults(results, 4, 5)
    const lastPageResults = paginatedResults.goTo('next')

    expect(lastPageResults.currentPage).toBe(4)
    expect(lastPageResults.results).toEqual(results.slice(15, 20))
  })
})
