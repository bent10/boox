---
title: Configuration
---

# Configuration

Boox provides various configuration options to tailor its behavior to your specific needs.

## BooxOptions

The `BooxOptions` interface defines the available configuration options, it can be passed to the Boox constructor when creating a new instance:

```js
interface BooxOptions<T extends object = Dataset> {
  /**
   * @default 'id'
   */
  id?: keyof T
  features?: Array<keyof T>
  attributes?: Array<keyof T>
  modelOptions?: Omit<ModelOptions, 'featureKeys'>
}
```

### `id`

This option specifies the property in your dataset objects that uniquely identifies each document. By default, Boox assumes the `id` property is used, but you can customize it if your dataset uses a different identifier.

**Example:**

```js
const boox = new Boox({
  // Use the 'customId' property as the identifier
  id: 'customId'
})
```

### `features`

This option defines which fields in your dataset objects should be indexed for full-text search. These are the fields that Boox will analyze and use to match search queries.

**Example:**

```js
const boox = new Boox({
  // Index the 'title', 'content', and 'tags' fields
  features: ['title', 'content', 'tags']
})
```

### `attributes`

This option specifies which fields in your dataset objects should be included in the document as they are, without being indexed for search. These fields can be useful for displaying additional information about the document in the search results.

**Example:**

```js
const boox = new Boox({
  // Include 'author', 'date', and 'category' fields as-is
  attributes: ['author', 'date', 'category']
})
```

### `modelOptions`

This option allows you to configure the underlying search model used by Boox. You can provide custom functions for text normalization, tokenization, stemming, and phonetic encoding. Refer to the [`ModelOptions`](#modeloptions-1) section for details.

**Example:**

```js
const boox = new Boox({
  modelOptions: {
    // Custom normalizer function
    normalizer: text => text.toLowerCase().replace(/[^a-z0-9\s]/g, ''),
    // Custom tokenizer function
    tokenizer: text => text.split(/\s+/)
  }
})
```

Refer to the [custom modeling](./custom-modeling.html) section for more details on how to use these options to customize text processing in Boox.

## ModelOptions

The `ModelOptions` interface defines the options for configuring the search model:

```js
interface ModelOptions {
  /**
   * Defines a custom normalizer function to be applied to the document features.
   *
   * @param input - The document feature to normalize.
   * @returns The normalized text.
   */
  normalizer?: NormalizerFn

  /**
   * Defines a custom tokenizer function to be used for tokenizing the document features.
   *
   * @param input - The input to tokenize.
   * @returns An array of tokens extracted from the input.
   */
  tokenizer?: TokenizerFn

  /**
   * Defines a function to generate phonetic representations of the document features.
   *
   * @param input - The input to process.
   * @returns The phonetic representation(s) of the input.
   */
  phonetic?: PhoneticFn

  /**
   * Defines a stemming function to reduce words to their root form.
   *
   * @param input - The input to stem.
   * @returns The stemmed input.
   */
  stemmer?: StemmerFn
}
```

### Text processing

You can use the `normalizer`, `tokenizer`, and `stemmer` options to customize how Boox processes text before indexing it. This can be useful for:

- Removing unwanted characters or markup (e.g., HTML tags).
- Converting text to lowercase or uppercase.
- Splitting text into meaningful tokens (words or phrases).
- Reducing words to their root form (stemming).

Here are some popular libraries you can use for these tasks:

#### Normalizers:

- [`marked-plaintify`](https://www.npmjs.com/package/marked-plaintify) – A [marked](https://github.com/markedjs/marked) extension to convert Markdown to Plaintext.
- [`stophtml`](https://github.com/bent10/stophtml) – Extracts plain text from an HTML string.
- [`nomark`](https://github.com/bent10/nomark) – Transforms hypertext strings (e.g., HTML, Markdown) into plain text for natural language processing (NLP) normalization.
- [`officeparser`](https://github.com/harshankur/officeParser) – A Node.js library for parsing text from various office file formats, including `docx`, `pptx`, `xlsx`, `odt`, `odp`, `ods`, and `pdf`.

#### Tokenizers:

- [`stopword`](https://github.com/fergiemcdowall/stopword) – Allows you to strip stopwords from an input text (supports a ton of languages).
- [`natural/tokenizers`](https://naturalnode.github.io/natural/Tokenizers.html)
- [`talisman/tokenizers`](https://yomguithereal.github.io/talisman/tokenizers/)

#### Stemmers:

- [`stemmer`](https://github.com/words/stemmer) – Fast Porter stemmer implementation.
- [`lancaster-stemmer`](https://github.com/words/lancaster-stemmer) – Lancaster stemming algorithm.
- [`natural/stemmers`](https://naturalnode.github.io/natural/stemmers.html)
- [`talisman/stemmers`](https://yomguithereal.github.io/talisman/stemmers/)

### Phonetic encoding

The `phonetic` option allows you to specify a function that generates phonetic representations of words. This can be helpful for finding documents even if the spelling of the search terms is slightly different.

Here are some popular libraries for phonetic encoding:

- [`metaphone`](https://github.com/words/metaphone) – Metaphone phonetic algorithm.
- [`double-metaphone`](https://github.com/words/double-metaphone) – Double metaphone algorithm.
- [`soundex-code`](https://github.com/words/soundex-code) – Soundex phonetic algorithm.
- [`natural/phonetics`](https://naturalnode.github.io/natural/phonetics.html)
- [`talisman/phonetics`](https://yomguithereal.github.io/talisman/phonetics/)

### Similarity calculation

Boox primarily uses TF-IDF for similarity scoring. However, you can further customize how similarity is calculated using the [`matchingCoefficient`](./advanced-search.html#matching-coefficient) option in [`SearchOptions`](#searchoptions). This allows you to define a function that takes the search query and document attributes as input and returns a similarity score between 0 and 1.

Here are some libraries that can be used for similarity calculations:

- [`dice-coefficient`](https://github.com/words/dice-coefficient) – Sørensen–Dice coefficient.
- [`fastest-levenshtein`](https://github.com/ka-weihe/fastest-levenshtein) – The fastest implementation of Levenshtein distance.
- [`levenshtein-edit-distance`](https://github.com/words/levenshtein-edit-distance) – Levenshtein edit distance.

By carefully configuring [`modelOptions`](#modeloptions), you can fine-tune Boox's behavior to achieve optimal search results for your specific use case.

## SearchOptions

The `SearchOptions` interface defines options that can be passed to the `search()` and `searchSync()` methods to customize the search operation:

```ts
type SearchOptions = Pick<SearchResultOptions, 'highlightTag'> &
  SearchResultsAdvanceOptions
```

This interface combines options from [`SearchResultOptions`](#searchresultoptions) (specifically `highlightTag`) and [`SearchResultsAdvanceOptions`](#searchresultsadvanceoptions).

## SearchResultOptions

The `SearchResultOptions` interface is used to configure how search results are generated:

```ts
interface SearchResultOptions {
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
  document: Document

  /**
   * The HTML tag markers for keyword highlighting.
   *
   * @default ['<mark class="search-highlight">', '</mark>']
   */
  highlightTag?: [string, string]
}
```

The `highlightTag` option allows you to specify the HTML tags used to highlight search terms within the results.

## SearchResultsAdvanceOptions

The `SearchResultsAdvanceOptions` interface provides advanced options for customizing and enhancing search results:

```ts
interface SearchResultsAdvanceOptions {
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
    attributes: Document['attributes']
  ) => number

  /**
   * The maximum number of search results to return.
   */
  limit?: number
}
```

These options allow you to:

- Enable the Vector Space Model for potentially better contextual precision.
- Expand search queries with synonyms or related terms.
- Define a custom matching coefficient function to fine-tune similarity scoring.
- Limit the number of search results returned.

Please explore the [advanced search](./advanced-search.html) for further details on how to use these options.

## SearchSuggestionsOptions

The `SearchSuggestionsOptions` interface defines options for configuring search suggestions:

```ts
interface SearchSuggestionsOptions {
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
```

These options allow you to:

- Set a minimum popularity threshold for suggestions.
- Limit the number of suggestions returned.
- Define a custom filter function to exclude certain suggestions.
