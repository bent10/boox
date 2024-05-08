---
title: Advanced search
---

# Advanced search

Boox provides several advanced search options that allow you to fine-tune your search queries and improve the accuracy and relevance of your results. These options can be passed to the `search` and `searchSync` methods as part of the [`SearchOptions`](./configuration.html#searchresultsadvanceoptions) object.

## Vector Space Model

By default, Boox uses TF-IDF scoring and inverted indexing to determine the relevance of documents to your search query. However, you can enable the [Vector Space Model](https://en.wikipedia.org/wiki/Vector_space_model) by setting the `useQueryVector` option to `true`:

```js
const results = await boox.search('keyword', {
  useQueryVector: true
})
```

The Vector Space Model represents documents and queries as vectors in a high-dimensional space. The similarity between a document and a query is then determined by calculating the cosine similarity between their respective vectors. This approach can provide better contextual precision compared to TF-IDF, but it might be slightly slower.

> [!WARNING]
> The `useQueryVector` option is still experimental and may be subject to changes in future versions of Boox.

## Query expansion

Query expansion is a technique for expanding your search query with synonyms or related terms to improve the chances of finding relevant documents. You can define a custom query expander function and pass it to the `queryExpander` option:

```js
/**
 * @type {import('boox').SearchResultsAdvanceOptions['queryExpander']}
 */
function queryExpander(query) {
  // Your logic to expand the query (e.g., using a thesaurus or external API)
  const expandedQuery = query + ' synonyms'
  return expandedQuery
}

const results = await boox.search('keyword', {
  queryExpander: queryExpander
})
```

In this example, the `queryExpander` function appends synonyms to the original query. You can implement your own logic to retrieve synonyms or related terms from external sources.

## Matching coefficient

The `matchingCoefficient` option allows you to define a custom function to calculate the similarity between a search query and a document's attributes. This function takes the search query and document attributes as input and returns a similarity score between 0 and 1. Here's an example using the Levenshtein distance to calculate similarity:

```js
import * as levenshtein from 'fastest-levenshtein'

/**
 * @type {import('boox').SearchResultsAdvanceOptions['matchingCoefficient']}
 */
function matchingCoefficient(query, attributes) {
  const maxLength = Math.max(query.length, attributes.title.length)
  const distance = levenshtein.distance(query, attributes.title)
  const similarity = 1 - distance / maxLength
  return similarity
}

const results = await boox.search('keyword', {
  matchingCoefficient: matchingCoefficient
})
```

In this example, the `matchingCoefficient` function calculates the Levenshtein distance between the query and the document's title. The similarity score is then calculated as 1 minus the distance divided by the maximum length of the query and title. This means that documents with titles that are closer to the query will have higher similarity scores.

> [!WARNING]
> Using a custom matching coefficient function can significantly impact the search results. Make sure you understand the implications of your function and test it thoroughly before using it in production.

## Limit

The `limit` option allows you to specify the maximum number of search results to return. This can be useful for improving performance and preventing the search from returning too many results.

```js
const results = await boox.search('keyword', {
  limit: 10
})
```

In this example, the search will return at most 10 results.
