---
title: API reference
---

# API reference

This section provides a comprehensive reference for Boox's API, including classes, methods, and properties. Each element is accompanied by clear descriptions, code examples, and parameter explanations.

Boox provides both synchronous and asynchronous methods for most operations; asynchronous methods are typically preferred, particularly when handling large datasets, to prevent blocking the main thread. Extensive customization of Boox's behavior is possible through the various options offered in [`BooxOptions`](./configuration.html#booxoptions), [`ModelOptions`](./configuration.html#modeloptions), and [`SearchOptions`](./configuration.html#searchoptions).

## Boox class

The Boox class is the main entry point for using the library. It allows you to create a search index, add documents, and perform searches.

### Constructor

```js
new Boox(options?: BooxOptions)
```

#### Parameters

- `options` (optional): An object containing configuration options for the Boox instance. See the [`BooxOptions`](./configuration.html#booxoptions) section for details.

#### Example

```js
import Boox from 'boox'

const boox = new Boox({
  features: ['title', 'content'],
  attributes: ['author', 'date']
})
```

### Methods

#### `addDocuments(datasets: Dataset[]): Promise<void>`

Adds multiple documents to the search index asynchronously.

##### Parameters

- `datasets`: An array of objects representing the documents to add. Each object should have a unique identifier specified by the `id` option in the `BooxOptions`.

##### Example

```js
const documents = [
  { id: 'doc1', title: 'First Document', content: '...' },
  { id: 'doc2', title: 'Second Document', content: '...' }
]

await boox.addDocuments(documents)
```

#### `addDocumentsSync(datasets: Dataset[]): void`

Adds multiple documents to the search index synchronously. Use this method with caution for large datasets, as it can block the main thread.

##### Parameters

- `datasets`: An array of objects representing the documents to add.

##### Example

```js
const documents = [
  { id: 'doc1', title: 'First Document', content: '...' },
  { id: 'doc2', title: 'Second Document', content: '...' }
]

boox.addDocumentsSync(documents)
```

#### `addDocument(dataset: Dataset): Promise<void>`

Adds a single document to the search index asynchronously.

##### Parameters

- `dataset`: An object representing the document to add.

##### Example

```js
const document = { id: 'doc1', title: 'First Document', content: '...' }

await boox.addDocument(document)
```

#### `addDocumentSync(dataset: Dataset): void`

Adds a single document to the search index synchronously.

##### Parameters

- `dataset`: An object representing the document to add.

##### Example

```js
const document = { id: 'doc1', title: 'First Document', content: '...' }

boox.addDocumentSync(document)
```

#### `getDocument(id: string): Document | undefined`

Retrieves a document from the search index by its identifier.

##### Parameters

- `id`: The identifier of the document to retrieve.

##### Returns

- `Document | undefined`: The document containing reference identifier and associated attributes, or `undefined` if the document is not found.

##### Example

```js
const document = boox.getDocument('doc1')
```

#### `updateDocument(dataset: Dataset): Promise<void>`

Updates an existing document in the search index asynchronously.

##### Parameters

- `dataset`: An object representing the updated document.

##### Example

```js
const updatedDoc = { id: 'doc1', title: 'Updated title', content: '...' }

await boox.updateDocument(updatedDoc)
```

#### `updateDocumentSync(dataset: Dataset): void`

Updates an existing document in the search index synchronously.

##### Parameters

- `dataset`: An object representing the updated document.

##### Example

```js
const updatedDoc = { id: 'doc1', title: 'Updated title', content: '...' }

boox.updateDocumentSync(updatedDoc)
```

#### `removeDocument(id: string): boolean`

Removes a document from the search index.

##### Parameters

- `id`: The identifier of the document to remove.

##### Returns

- `boolean`: `true` if the document is successfully removed, `false` otherwise.

##### Example

```js
const removeDoc = boox.removeDocument('doc1')
```

#### `search(query: string, options?: SearchOptions): Promise<SearchResult[]>`

Searches for documents that match the given query, asynchronously.

##### Parameters

- `query`: The search query string.
- `options` (optional): An object containing search options. See the [`SearchOptions`](./configuration.html#searchoptions) section for details.

##### Returns

- `Promise<SearchResult[]>`: A promise that resolves to an array of search results.

##### Example

```js
const results = await boox.search('keyword', { limit: 10 })
```

#### `searchSync(query: string, options?: SearchOptions): SearchResult[]`

Searches for documents that match the given query, synchronously. Use this method with caution for large datasets, as it can block the main thread.

##### Parameters

- `query`: The search query string.
- `options` (optional): An object containing search options.

##### Returns

- `SearchResult[]`: An array of recent search results.

##### Example

```js
const results = boox.searchSync('keyword', { limit: 10 })
```

#### `getSearchHistory(limit?: number): string[]`

Retrieves the recent search history.

##### Parameters

- `limit` (optional): The maximum number of recent searches to retrieve. Defaults to 10.

##### Returns

- `string[]`: An array of recent search queries.

##### Example

```js
const history = boox.getSearchHistory(20)
```

#### `getPopularSearches(limit?: number): [string, number][]`

Retrieves the popular searches sorted by frequency.

##### Parameters

- `limit` (optional): The maximum number of popular searches to retrieve. Defaults to 10.

##### Returns

- `[string, number][]`: An array of tuple popular search queries sorted by frequency.

##### Example

```js
const popularSearches = boox.getPopularSearches(15)
```

#### `getSearchSuggestions(queryPrefix: string, options?: SearchSuggestionsOptions): string[]`

Retrieves search suggestions based on popular queries or previously searched terms.

##### Parameters

- `queryPrefix`: The prefix of the search query entered by the user.
- `options` (optional): An object containing options for retrieving search suggestions. See the [`SearchSuggestionsOptions`](./configuration.html#searchsuggestionsoptions) section for details.

##### Returns

- `string[]`: An array of search query suggestions.

##### Example

```js
const suggestions = boox.getSearchSuggestions('web', { threshold: 2 })
```

### Properties

#### currentState: `State<T extends object = Dataset>`

Gets or sets the current state of the Boox instance. This property can be used to serialize and deserialize the search index for persistence.

##### Example

```js
// Get the current state
const state = boox.currentState

// Set the state (e.g., after loading from storage)
boox.currentState = state
```

## SearchResult class

The `SearchResult` class represents a single search result. It provides access to the document's information, its relevance score, and methods for accessing `context` and `kwic` results.

### Properties

- `query`: The search query that produced this result.
- `id`: The identifier of the document.
- `attributes`: The document's attributes (fields that were not indexed for search).
- `magnitude`: The document's magnitude (used for relevance scoring).
- `score`: The relevance score of the document for the given query.
- `highlightTag`: The HTML tags used for highlighting search terms.

### Methods

#### `context(key: string, contextLength?: number): QueryContext`

Retrieves the context of the specified document attribute, highlighting search terms.

##### Parameters

- `key`: The key of the document attribute to retrieve context for.
- `contextLength` (optional): The maximum length of the returned context.

##### Returns

- `QueryContext`: The context of search results for a document, including keywords and their context.

##### Example

```js
const context = result.context('content', 100)
// Highlighted text with keywords
console.log(context.text)
```

#### `kwic(key: string, contextLength?: number, isSorted?: boolean): QueryContext[]`

Retrieves keyword in context (KWIC) results for the specified document attribute.

##### Parameters

- `key`: The key of the document attribute to retrieve KWIC results for.
- `wordsAround` (optional): The number of words to retrieve before and after the keyword. Defaults to `7`.
- `isSorted` (optional): Whether to sort the results by keyword size. Defaults to `false`.

##### Returns

- `QueryContext[]`: An array of KWIC results for a document, including keywords and their context.

##### Example

```js
const kwic = result.kwic('content')
// Array of QueryContext objects with keywords and context
console.log(kwic)
```
