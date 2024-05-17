---
title: Handling large datasets
---

# Handling large datasets

While Boox is designed to be efficient and handle large datasets effectively, there are some additional strategies and techniques you can employ to optimize performance and memory usage when working with very large collections of documents.

## Training in batches

Instead of adding all documents to the Boox instance at once, consider training the model in smaller batches. This can help reduce memory pressure and improve performance, especially when dealing with datasets that are too large to fit comfortably in memory.
Here's an example of how to train in batches:

```js
// Adjust this depending on your dataset and memory constraints
const batchSize = 10

for (let i = 0; i < largeDataset.length; i += batchSize) {
  const batch = largeDataset.slice(i, i + batchSize)
  await boox.addDocuments(batch)
}
```

## Pre-processing and normalization

Pre-processing your data before adding it to Boox can significantly reduce the size of the index and improve search performance. Consider:

- **Removing unnecessary fields:** If your dataset contains fields that are not relevant for search, remove them before adding the documents to Boox.

- **Normalizing text:** Normalization techniques like removing punctuation, converting to lowercase, and stemming can reduce the number of unique terms in the index, making it more compact and efficient.

## Serialization and persistence with compression

If you're working with a large dataset that takes a long time to train, you might want to serialize the trained Boox instance to disk or another storage mechanism. This allows you to load the trained model quickly without having to retrain it every time.

Boox provides the `currentState` property, which allows you to get and set the state of the instance. To further reduce the size of the saved state, you can compress it using a library like [`pako`](https://www.npmjs.com/package/pako):

```js
import { gzip, ungzip } from 'pako'

// Save the trained state with compression
const state = boox.currentState
// Adjust compression level as needed
const compressedState = gzip(JSON.stringify(state), { level: 6 })
fs.writeFileSync('trained-boox-state.gz', compressedState)

// Load the trained state with decompression
const compressedState = fs.readFileSync('trained-boox-state.gz')
const state = JSON.parse(ungzip(compressedState, { to: 'string' }))
boox.currentState = state
```

## Using the CLI tool

For more advanced dataset management and training, you can use the [`boox-cli`](../cli.html) tool. This tool provides command-line options for training datasets, saving the trained state (with compression options), and performing searches.

## Optimizing search options

When performing searches on large datasets, consider using the following options to improve performance:

- `limit`: Limit the number of search results returned.

- `queryExpander`: Use a query expander function to focus the search on the most relevant terms.

- `matchingCoefficient`: Define a custom matching coefficient function to prioritize documents based on specific criteria.

Please explore the [advanced search](./advanced-search.html) for further details.
