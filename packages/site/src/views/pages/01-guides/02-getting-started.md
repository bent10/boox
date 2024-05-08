---
title: Getting started
---

# Getting started

This guide will walk you through installing and setting up Boox in both browser and Node.js, and demonstrate how to perform basic search operations.

## Installation

Boox can be installed using various methods:

### Node.js

[Install Boox](https:{{npmPath}}) using either npm or yarn:

:::code-group

```bash title="NPM"
npm install -D boox
```

```bash title="YARN"
yarn add -D boox
```

:::

### Browser

You can include Boox directly from a [CDN](https:{{jsdelivrPath}}) in your HTML file. Here are the links for different module formats:

| Type | Size            | URL                                                   |
| :--- | :-------------- | :---------------------------------------------------- |
| UMD  | `gzip: 4.13 kB` | `https://cdn.jsdelivr.net/npm/boox/dist/index.umd.js` |
| ESM  | `gzip: 7.00 kB` | `https://cdn.jsdelivr.net/npm/boox/+esm`              |
| CJS  | `gzip: 4.25 kB` | `https://cdn.jsdelivr.net/npm/boox/dist/index.cjs`    |

For example, to include the UMD version:

```html
<script src="https://cdn.jsdelivr.net/npm/boox/dist/index.umd.js"></script>
```

## Basic usage

Once Boox is installed, you can start using it to search through your data. Here's a basic example for both Node.js and browser:

### Import Boox and your dataset

Assuming we have the [`pokemon-100r.json`](https:{{demoHomepage}}/datasets/pokemon-100r.json) file.

:::code-group

```html title="Browser"
<script type="module">
  import Boox from 'https://cdn.jsdelivr.net/npm/boox/+esm'
  import debounce from 'https://cdn.jsdelivr.net/npm/debounce/+esm'
  import { metaphone } from 'https://cdn.jsdelivr.net/npm/metaphone/+esm'
  import { stemmer } from 'https://cdn.jsdelivr.net/npm/stemmer/+esm'

  // 1. Fetch data from server
  const response = await fetch('https://example.com/pokemon-100r.json', {
    cache: 'default'
  })
  const pokemons = await response.json()
</script>
```

```js title="Node.js"
import fs from 'node:fs'
import Boox from 'boox'
import debounce from 'debounce'
import { metaphone } from 'metaphone'
import { stemmer } from 'stemmer'

/** @type {Pokemon[]} */
// 1. Load data from file
const pokemons = JSON.parse(fs.readFileSync('pokemon-100r.json', 'utf8'))
```

:::

### Create a Boox instance

```js
// 2. create Boox instance
const boox = new Boox({
  features: ['name', 'caption', 'set_name'], // Fields to index
  attributes: ['hp', 'image_url'], // Fields to include as-is
  // Optional model options (e.g., custom normalizer, tokenizer, etc.)
  modelOptions: {
    stemmer: stemmer,
    phonetic: metaphone
  }
})
```

When creating a Boox instance, you can provide various options to customize its behavior. Refer to the [BooxOptions](./configuration.html#booxoptions) for a detailed explanation of all available options.

### Add documents

Use the `addDocuments()` or `addDocumentsSync()` method to add your documents to the Boox instance:

```js
// 3. Add documents (recommended: use async for large datasets)
await boox.addDocuments(pokemons)
```

### Basic queries and results

Once you've added documents, you can start searching!

#### 1. Queries

:::code-group

```js title="Single word"
const results = await boox.search('pikachu')
console.log(results)
```

```js title="Multiple words"
const results = await boox.search('grass power')
console.log(results)
```

```js title="Typing error"
const results = await boox.search('grass pwer')
console.log(results)
```

:::

This will return an array of [`SearchResult`](./api.html#searchresult-class) objects representing documents that match the query. Each [`SearchResult`](./api.html#searchresult-class) object contains information about the document, its relevance score, and methods for accessing `context` and `kwic` results.

<details>
<summary>Click to view example SearchResults:</summary>

```bash
[
  SearchResult {
    "query": "pikachu",
    "id": "det1-1",
    "attributes": {
      "name": "Bulbasaur",
      "caption": "A Basic Pokemon Card of type Grass...",
      "set_name": "Detective Pikachu",
      "hp": 60,
      "image_url": "https://images.pokemontcg.io/det1/1_hires.png"
    },
    "magnitude": 1.2458263656438366,
    "score": 2.1973311587855213,
    "highlightTag": [
      "<mark class=\"search-highlight\">",
      "</mark>"
    ],
    "vector": null
  },
  ...
]
```

</details>

#### 2. Work with results

You can use the [`context`](./search-results.html#getting-search-context) and [`kwic`](./search-results.html#keyword-in-context) methods of [`SearchResult`](./api.html#searchresult-class) objects to get more information about the search results:

```js
const results = await boox.search('grass pokemon')

// Get search history
const history = boox.getSearchHistory()
console.log(history)

// Get popular searches
const popularSearches = boox.getPopularSearches()
console.log(popularSearches)

// Get search suggestions
const suggestions = boox.getSearchSuggestions('pri')
console.log(suggestions)

// Accessing context and kwic results
for (const result of results) {
  // Get context of the 'caption' attribute with a maximum length of 80 chars
  const context = result.context('caption', 80)
  console.log(context.text) // Highlighted text with keywords

  // Get kwic results for the 'caption' attribute
  const kwic = result.kwic('caption')
  // Array of QueryContext objects with keywords and context
  console.log(kwic)
}
```

These are just basic examples. Boox offers many advanced features and customization options, which you can explore in the next sections.

## Demo

See our [basic usage example in action](https:{{demoHomepage}}/vanilla), or explore several instances of [integrating Boox with popular tools]({{env.base}}examples/index.html).
