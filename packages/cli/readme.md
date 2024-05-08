# Boox CLI

A command-line interface (CLI) for training and searching [Boox](https://github.com/bent10/boox) datasets.

## Installation

Install `boox-cli` globally using npm or yarn:

```bash
npm install -g boox-cli

# Or

yarn global add boox-cli
```

## Usage

### Training

To train a Boox dataset, use the train command:

```bash
boox-cli train <source> [destination] [options]
```

- `<source>`: The path to your dataset file (JSON format).
- `[destination]`: (Optional) The path where the trained data will be saved. Defaults to the current directory.

Options:

- `-i, --id <field>`: The field in your dataset objects that uniquely identifies each document (default: `'id'`).
- `-f, --features <fields...>`: The fields to index for search (multiple fields can be specified).
- `-a, --attributes <fields...>`: The fields to include as-is without indexing (multiple fields can be specified).
- `-d, --deflate`: Compress the trained data as `.dat` file (default: `false`).
- `-c, --cwd <folder>`: The working directory (default: current directory).
- `-r, --rcname <name>`: The name of the Boox configuration file (default: `'boox'`).

Example:

```bash
boox-cli train data/products.json -f title description -a price
```

This command will train a Boox dataset from the `data/products.json` file, indexing the `title` and `description` fields for search and including the `price` field as-is. The trained data will be saved as a compressed `.gz` file.

### Searching

To search a trained Boox dataset, use the `search` command:

```bash
boox-cli search <source> <query> [options]
```

- `<source>`: The path to the trained dataset file (`.dat` or `.gz`).
- `<query>`: The search query string.

Options:

- `-o, --offset <number>`: The offset for pagination (default: `'1'`).
- `-l, --length <number>`: The number of results per page (default: `'10'`).
- `-k, --context <field>`: Display the context instead of paginated results object.
- `-a, --attrs <fields...>`: Fields to display when `--context` is provided.
- `-d, --deflate`: Assume the trained data is deflated as `.dat` file (default: `false`).
- `-c, --cwd <folder>`: The working directory (default: current directory).
- `-r, --rcname <name>`: The name of the Boox configuration file (default: `'boox'`).

Example:

```bash
boox-cli search data/products-trained.gz "shoes" -o 2 -l 20
```

This command will search the `data/products-trained.gz` dataset for documents containing the word `"shoes"`, starting from the second page and displaying 20 results per page.

## Using configuration file

You can create a Boox configuration file in your project's root directory to specify default options for the `boox-cli train` and `boox-cli search` commands:

- `.booxrc`
- `.booxrc.json`
- `.booxrc.{yaml,yml}`
- `.boox.{mjs,cjs,js}`
- `boox.config.{mjs,cjs,js}`

Before using the example below, make sure to install the required libraries:

```bash
npm install -D double-metaphone stemmer stopword marked marked-plaintify
```

Here's an example of a Boox configuration file:

```js
// boox.config.js
import { doubleMetaphone } from 'double-metaphone'
import { Marked } from 'marked'
import markedPlaintify from 'marked-plaintify'
import { stemmer } from 'stemmer'
import { removeStopwords } from 'stopword'

const marked = new Marked({ gfm: true }).use(markedPlaintify())
const wordRegexp = /\b\w+\b/g

/** @type {() => import('boox').BooxOptions} */
export default function defineBooxConfig() {
  return {
    id: 'customId',
    features: ['title', 'content', 'tags'],
    attributes: ['author', 'date'],
    modelOptions: {
      normalizer(input) {
        // Remove Markdown formatting
        return marked.parse(input)
      },
      tokenizer(input) {
        const tokens = Array.from(input.match(wordRegexp) || [])
        return removeStopwords(tokens)
      },
      stemmer: stemmer,
      phonetic: doubleMetaphone
    }
  }
}
```

The `--rcname` flag allows you to customize the name of the configuration file. For example, to use a configuration file named `my-appname.config.js`, you would run the following command:

```bash
boox-cli train src/dataset.json --rcname my-appname
```
