/// <reference types="vitest/globals" />

import { readFile } from 'node:fs/promises'
import type { MockInstance } from 'vitest'
import Boox from '../src/index.js'
import { SearchResult } from '../src/SearchResult.js'

type Dataset = {
  id: string
  title: string
  content: string
  url: string
}

describe('Boox', () => {
  let boox: Boox<Dataset>
  let datasets: Dataset[]
  let errorSpy: MockInstance

  beforeEach(() => {
    datasets = [
      {
        id: '1',
        title: 'Document 1',
        content: 'Lorem ipsum dolor sit amet.',
        url: '/foo'
      },
      {
        id: '2',
        title: 'Document 2',
        content: 'Consectetur adipiscing elit.',
        url: '/bar'
      },
      {
        id: '3',
        title: 'Document 3',
        content: 'Sed do eiusmod tempor incididunt.',
        url: '/baz'
      }
    ]
    boox = new Boox<Dataset>({
      id: 'id',
      features: ['title', 'content'],
      attributes: ['url']
    })

    // mock console.error
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // restore console.error
    errorSpy.mockRestore()
  })

  it('should add a document to the index', async () => {
    await boox.addDocument(datasets[0])

    expect(boox.getDocument('1')).toMatchSnapshot()
  })

  it('should add a document to the index synchronously', () => {
    boox.addDocumentSync(datasets[0])

    expect(boox.getDocument('1')).toMatchSnapshot()
  })

  it('should update an existing document in the index', async () => {
    await boox.addDocument(datasets[0])

    const updatedDataset = {
      ...datasets[0],
      title: 'Updated Document Title',
      content: 'Updated content.'
    }
    await boox.updateDocument(updatedDataset)

    expect(boox.getDocument('1')).toMatchSnapshot()
  })

  it('should update an existing document in the index synchronously', () => {
    boox.addDocumentSync(datasets[0])

    const updatedDataset = {
      ...datasets[0],
      title: 'Updated Document Title',
      content: 'Updated content.'
    }
    boox.updateDocumentSync(updatedDataset)

    expect(boox.getDocument('1')).toMatchSnapshot()
  })

  it('should remove a document from the index', async () => {
    await boox.addDocument(datasets[0])
    const isRemoved = boox.removeDocument('1')

    expect(boox.getDocument('1')).toBeUndefined()
    expect(isRemoved).toBe(true)
  })

  it('should remove a document from the index synchronously', () => {
    boox.addDocumentSync(datasets[0])
    const isRemoved = boox.removeDocument('1')

    expect(boox.getDocument('1')).toBeUndefined()
    expect(isRemoved).toBe(true)
  })

  it('should resolve missing document removal from index', () => {
    const isRemoved = boox.removeDocument('1')

    expect(boox.getDocument('1')).toBeUndefined()
    expect(isRemoved).toBe(false)
  })

  it('should add multiple documents to the index', async () => {
    await boox.addDocuments(datasets)

    expect(boox.getDocument('1')).toMatchSnapshot()
    expect(boox.getDocument('2')).toMatchSnapshot()
    expect(boox.getDocument('3')).toMatchSnapshot()
  })

  it('should add multiple documents to the index synchronously', () => {
    boox.addDocumentsSync(datasets)

    expect(boox.getDocument('1')).toMatchSnapshot()
    expect(boox.getDocument('2')).toMatchSnapshot()
    expect(boox.getDocument('3')).toMatchSnapshot()
  })

  it('should retrieve the current state of the Boox instance', async () => {
    await boox.addDocuments(datasets)

    expect(boox.currentState).toMatchSnapshot()
  })

  it('should set the current state of the Boox instance', async () => {
    const trainedData = JSON.parse(
      await readFile('test/fixtures/dummy-state.json', 'utf8')
    )

    boox.currentState = trainedData

    expect(boox.currentState).toEqual(trainedData)
  })

  it('should search for documents based on a query', async () => {
    await boox.addDocuments(datasets)

    const results = await boox.search('lorem ipsum')

    expect(results.length).toBe(1)
    expect(results[0].id).toBe('1')
  })

  it('should search for documents based on a query synchronously', () => {
    boox.addDocumentsSync(datasets)

    const results = boox.searchSync('lorem ipsum')

    expect(results.length).toBe(1)
    expect(results[0].id).toBe('1')
  })

  it('should handle empty search results', async () => {
    const results = await boox.search('Non-existing document')

    expect(results.length).toBe(0)
  })

  it('should handle empty search results synchronously', () => {
    const results = boox.searchSync('Non-existing document')

    expect(results.length).toBe(0)
  })

  it('should search for documents with custom limit', async () => {
    await boox.addDocuments(datasets)

    const results = await boox.search('document', {
      limit: 2
    })

    expect(results.length).toBe(2)
  })

  it('should search for documents with custom limit synchronously', async () => {
    boox.addDocumentsSync(datasets)

    const results = boox.searchSync('document', {
      limit: 2
    })

    expect(results.length).toBe(2)
  })

  it('should handle search with query expander', async () => {
    await boox.addDocuments(datasets)

    const searchResults = await boox.search('lorem', {
      queryExpander: (query: string) => query.toLowerCase()
    })

    expect(searchResults.length).toBe(1)
    expect(searchResults[0].id).toBe('1')
  })

  it('should handle search with query expander synchronously', () => {
    boox.addDocumentsSync(datasets)

    const searchResults = boox.searchSync('lorem', {
      queryExpander: (query: string) => query.toLowerCase()
    })

    expect(searchResults.length).toBe(1)
  })

  it('should search for documents with vector model', async () => {
    await boox.addDocuments(datasets)

    const results = await boox.search('lorem ipsum', {
      useQueryVector: true
    })

    expect(results.length).toBe(1)
    expect(results[0].id).toBe('1')
  })

  it('should search for documents with vector model synchronously', () => {
    boox.addDocumentsSync(datasets)

    const results = boox.searchSync('lorem ipsum', {
      useQueryVector: true
    })

    expect(results.length).toBe(1)
    expect(results[0].id).toBe('1')
  })

  it('should handle searching with advanced similarity scoring', async () => {
    await boox.addDocuments(datasets)

    const results = await boox.search('document', {
      matchingCoefficient: (
        query: string,
        attributes: Record<string, unknown>
      ) => {
        if (String(attributes.title).toLowerCase().includes(query)) return 0.5
        return 0
      }
    })

    expect(results).toMatchSnapshot()
  })

  it('should handle searching with advanced similarity scoring synchronously', () => {
    boox.addDocumentsSync(datasets)

    const results = boox.searchSync('document', {
      matchingCoefficient: (
        query: string,
        attributes: Record<string, unknown>
      ) => {
        if (String(attributes.title).toLowerCase().includes(query)) return 0.5
        return 0
      }
    })

    expect(results).toMatchSnapshot()
  })

  it('should cache search results for subsequent searches', async () => {
    await boox.addDocuments(datasets)

    const results1 = await boox.search('lorem ipsum')
    const results2 = await boox.search('lorem ipsum')

    expect(results1.length).toBe(1)
    expect(results2.length).toBe(1)
    expect(results1).toEqual(results2)
  })

  it('should cache search results for subsequent searches synchronously', () => {
    boox.addDocumentsSync(datasets)

    const results1 = boox.searchSync('lorem ipsum')
    const results2 = boox.searchSync('lorem ipsum')

    expect(results1.length).toBe(1)
    expect(results2.length).toBe(1)
    expect(results1).toEqual(results2)
  })

  it('should retrieve search suggestions', async () => {
    await boox.addDocuments(datasets)

    const queries = ['document 1', 'document 2', 'document 3']
    queries.forEach(q => boox.searchSync(q))

    const suggestions = boox.getSearchSuggestions('doc')

    expect(suggestions).toEqual(['document 1', 'document 2', 'document 3'])
  })

  it('should retrieve search suggestions with threshold', async () => {
    await boox.addDocuments(datasets)

    const queries = ['document 1', 'document 3', 'document 2', 'document 3']
    queries.forEach(q => boox.searchSync(q))

    const suggestions = boox.getSearchSuggestions('doc', { threshold: 2 })

    expect(suggestions).toEqual(['document 3'])
  })

  it('should retrieve search suggestions with custom filter', async () => {
    await boox.addDocuments(datasets)

    const queries = ['document 1', 'document 3', 'document 2', 'document 3']
    queries.forEach(q => boox.searchSync(q))

    const suggestions = boox.getSearchSuggestions('doc', {
      limit: 3,
      filter(suggestion) {
        return !suggestion.includes('2')
      }
    })

    expect(suggestions).toEqual(['document 3', 'document 1'])
  })

  it('should retrieve the search history', async () => {
    await boox.search('lorem ipsum')
    boox.searchSync('dolor sit')

    const searchHistory = boox.getSearchHistory()

    expect(searchHistory).toEqual(['dolor sit', 'lorem ipsum'])
  })

  it('should retrieve the popular searches', async () => {
    await boox.search('lorem ipsum')
    boox.searchSync('lorem ipsum')
    boox.searchSync('dolor sit')

    const popularSearches = boox.getPopularSearches()

    expect(popularSearches).toEqual([
      ['lorem ipsum', 2],
      ['dolor sit', 1]
    ])
  })

  it('should paginate search results', () => {
    const results: SearchResult<{ title: string; content: string }>[] =
      Array.from({ length: 20 }, (_, i) => {
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

    const paginatedResults = Boox.paginateSearchResults(results, 2, 5)

    expect(paginatedResults.results.length).toBe(5)
    expect(paginatedResults.totalResults).toBe(20)
    expect(paginatedResults.totalPages).toBe(4)
    expect(paginatedResults.currentPage).toBe(2)
  })

  // Error handling

  it('should log an error when trying to add duplicate documents', async () => {
    await boox.addDocument(datasets[0])
    await boox.addDocument(datasets[0])

    expect(errorSpy).toHaveBeenCalledWith(
      'Error occurred while adding document:\n',
      expect.any(Error)
    )
  })

  it('should log an error when trying to add duplicate documents synchronously', () => {
    boox.addDocumentSync(datasets[0])
    boox.addDocumentSync(datasets[0])

    expect(errorSpy).toHaveBeenCalledWith(
      'Error occurred while adding document:\n',
      expect.any(Error)
    )
  })

  it('should log an error when trying to add a document with missing attributes', async () => {
    await boox.addDocument({} as never)
    expect(errorSpy).toHaveBeenCalledWith(
      'Error occurred while adding document:\n',
      expect.any(Error)
    )
    expect(boox.currentState).toEqual({
      configs: {
        id: 'id',
        features: ['title', 'content'],
        attributes: ['url']
      },
      documents: {},
      features: {},
      popularSearches: {}
    })
  })

  it('should log an error when trying to add a document with missing attributes synchronously', () => {
    boox.addDocumentSync({} as never)
    expect(errorSpy).toHaveBeenCalledWith(
      'Error occurred while adding document:\n',
      expect.any(Error)
    )
    expect(boox.currentState).toEqual({
      configs: {
        id: 'id',
        features: ['title', 'content'],
        attributes: ['url']
      },
      documents: {},
      features: {},
      popularSearches: {}
    })
  })

  it('should log an error when trying to update a document with missing attributes', async () => {
    await boox.updateDocument({} as never)

    expect(errorSpy).toHaveBeenCalledWith(
      'Error occurred while updating document:\n',
      expect.any(Error)
    )
    expect(boox.currentState).toEqual({
      configs: {
        id: 'id',
        features: ['title', 'content'],
        attributes: ['url']
      },
      documents: {},
      features: {},
      popularSearches: {}
    })
  })

  it('should log an error when trying to update a document with missing attributes synchronously', () => {
    boox.updateDocumentSync({} as never)

    expect(errorSpy).toHaveBeenCalledWith(
      'Error occurred while updating document:\n',
      expect.any(Error)
    )
    expect(boox.currentState).toEqual({
      configs: {
        id: 'id',
        features: ['title', 'content'],
        attributes: ['url']
      },
      documents: {},
      features: {},
      popularSearches: {}
    })
  })

  it('should log an error when search query expansion function throws an error', async () => {
    await boox.addDocument(datasets[0])

    const queryExpander = () => {
      throw new Error('Query expansion failed')
    }
    const results = await boox.search('lorem', { queryExpander })

    expect(errorSpy).toHaveBeenCalledWith(
      'Error occurred while searching:\n',
      expect.any(Error)
    )
    expect(results).toHaveLength(0)
  })

  it('should log an error when search query expansion function throws an error synchronously', () => {
    boox.addDocumentSync(datasets[0])

    const queryExpander = () => {
      throw new Error('Query expansion failed')
    }
    const results = boox.searchSync('lorem', { queryExpander })

    expect(errorSpy).toHaveBeenCalledWith(
      'Error occurred while searching:\n',
      expect.any(Error)
    )
    expect(results).toHaveLength(0)
  })
})
