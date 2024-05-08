---
title: Custom modeling
---

# Custom modeling

Boox provides several options for customizing how it processes text before indexing it. This allows you to tailor the search experience to your specific needs and improve the accuracy and relevance of search results.

## Customizing text processing

You can customize text processing using the following options in the `modelOptions` object when creating a Boox instance:

- `normalizer`: A function that takes a string as input and returns a normalized string. This function can be used to remove unwanted characters, convert text to lowercase or uppercase, or perform other normalization tasks.

- `tokenizer`: A function that takes a string as input and returns an array of tokens (words or meaningful units). You can use this to define how Boox splits text into searchable units.

- `stemmer`: A function that takes a word as input and returns its stemmed form (usually the root of the word). Stemming can help improve search accuracy by reducing words to their base form.

- `phonetic`: A function to generate phonetic representations of document features.

**Installation:**

Before using the example below, make sure to install the required libraries:

```bash
npm install -D double-metaphone stemmer stopword marked marked-plaintify
```

**Example:**

Here's an example of how to create a Boox instance with custom text processing:

```js
import Boox from 'boox'
import { doubleMetaphone } from 'double-metaphone'
import { Marked } from 'marked'
import markedPlaintify from 'marked-plaintify'
import { stemmer } from 'stemmer'
import { removeStopwords } from 'stopword'

const wordRegexp = /\b\w+\b/g
const marked = new Marked({ gfm: true }).use(markedPlaintify())

const boox = new Boox({
  features: ['title', 'content'],
  attributes: ['author', 'date'],
  modelOptions: {
    normalizer(input) {
      // Remove Markdown formatting
      return marked.parse(input)
    },
    tokenizer(input) {
      // Split into words and remove stopwords
      const tokens = Array.from(input.match(wordRegexp) || [])
      return removeStopwords(tokens)
    },
    // Use the Porter stemmer
    stemmer: stemmer,
    // Use Double Metaphone for phonetic encoding
    phonetic: doubleMetaphone
  }
})
```

In this example, the custom `normalizer` function removes Markdown formatting. The custom `tokenizer` function splits the text into words and removes common stopwords (e.g., "the", "a", "is"). The `stemmer` and `phonetic` options are used to enable stemming and phonetic encoding, respectively.

## Choosing the right customization

The best way to customize text processing in Boox depends on your specific needs and the type of data you are working with. Here are some general guidelines:

- **Normalization**: If your data contains a lot of noise or formatting (e.g., HTML tags, punctuation), normalization can help improve search accuracy.

- **Tokenization**: If your data contains compound words or phrases that should be treated as single units, you might need a custom tokenizer.

- **Stemming**: Stemming can be helpful for languages with complex morphology (e.g., English), where words can have many different forms.

- **Phonetic Encoding**: If you want to be able to find documents even if the spelling of the search terms is slightly different, phonetic encoding can be useful.

It's important to experiment with different customization options to find what works best for your data and use case.
