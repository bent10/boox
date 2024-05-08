---
title: Handling specific data formats
---

# Handling specific data formats

Boox is primarily designed to work with plain text data. However, you can customize how Boox processes different data formats to extract the relevant text for indexing and searching. This section provides examples of how to handle specific data formats like HTML, Markdown, DOCX, PPTX, XLSX, ODT, ODP, ODS, PDF, etc.

## HTML

If your dataset contains HTML documents, you'll need to extract the plain text content before adding it to Boox. You can use a library like [`stophtml`](https://github.com/bent10/stophtml) to do this:

```js
import Boox from 'boox'
import stophtml from 'stophtml'

const html = `
<h1>My HTML Document</h1>

<p>This is some content with <b>important</b> text.</p>
`

// Create a Boox instance and add the document
const boox = new Boox({
  features: ['title', 'content']
})

await boox.addDocument({
  id: 'doc1',
  title: 'My HTML Document',
  content: stophtml(html)
})
```

## Markdown

Similarly, if your dataset contains Markdown documents, you can use a library like [`marked-plaintify`](https://www.npmjs.com/package/marked-plaintify) to extract the plain text content:

```js
import Boox from 'boox'
import { Marked } from 'marked'
import markedPlaintify from 'marked-plaintify'

const markdown = `
# My Markdown Document

This is some content with **important** text.
`

// Turn markdown to plaintext
const marked = new Marked({ gfm: true }).use(markedPlaintify())
const plaintext = marked.parse(markdown)

// Create a Boox instance and add the document
const boox = new Boox({
  features: ['title', 'content']
})

await boox.addDocument({
  id: 'doc1',
  title: 'My Markdown Document',
  content: plaintext
})
```

## Other data formats

You can use similar approaches to handle other data formats such as DOCX, PPTX, XLSX, ODT, ODP, ODS, PDF, etc. Utilize a library like `officeParser`, `office-text-extractor`, `word-extractor`, or something similar. The key is to extract the relevant text content from the documents before adding them to Boox.
