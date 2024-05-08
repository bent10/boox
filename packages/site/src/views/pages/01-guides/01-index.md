---
title: Overview
---

# Overview

Boox is a lightweight, zero-dependency full-text search library designed for both browser and Node.js. It enables you to efficiently search through multiple documents and datasets, returning relevant results based on your queries.

## What is full-text search?

Full-text search is a technique for searching through the entire text of documents, as opposed to just searching through titles or metadata. This allows you to find documents that contain specific words or phrases, regardless of where they appear in the document.

## How Boox works?

Boox uses a combination of [TF-IDF](https://en.wikipedia.org/wiki/Tf-idf) scoring and [inverted indexing](https://en.wikipedia.org/wiki/Inverted_index) to provide fast and accurate full-text search:

#### 1. TF-IDF Scoring

- **Term Frequency (TF):** Measures how often a word appears in a document.
- **Inverse Document Frequency (IDF):** Measures how important a word is across all documents.

By combining these metrics, Boox determines the relevance of each document to your search query. Words that appear frequently in a specific document but rarely in others are considered more important and contribute more to the document's relevance score.

#### 2. Inverted Indexing

Instead of scanning each document individually, Boox creates an index that maps words to the documents they appear in. This allows for lightning-fast searches, especially when dealing with large collections of documents.

### Optional: Vector Space Model

Boox also offers an optional feature called the [Vector Space Model](https://en.wikipedia.org/wiki/Vector_space_model). This model represents documents and queries as vectors in a high-dimensional space. The similarity between a document and a query is then determined by calculating the cosine similarity between their respective vectors. This approach can provide better contextual precision compared to TF-IDF, but it might be slightly slower. You can enable this feature by setting the [`useQueryVector`](./advanced-search.html#vector-space-model) option to `true` when performing a search.

## Why using Boox?

Boox's an ideal choice for a wide range of applications, including:

- **Search Engines:** Build robust search engines for websites, intranets, or document repositories.

- **Document Management Systems:** Enhance document management systems with powerful full-text search capabilities.

- **E-commerce Platforms:** Improve product search functionality on e-commerce platforms for a better user experience.

- **Knowledge Management Systems:** Facilitate knowledge discovery and information retrieval within knowledge management systems.

- **Content Management Systems:** Integrate full-text search into content management systems for easier content discovery.

- **Data Analysis and Research:** Analyze large datasets and research materials efficiently using targeted keyword searches.

These are just a few examples, and the possibilities are endless!

### Key features

- **Optimized Inverted Indexing**: Boox uses efficient techniques to build and update the inverted index, ensuring fast search performance and minimal resource overhead.

- **Dynamic IDF and Vector Calculation**: Boox continuously recalculates IDF values and document vectors to ensure that search results are always accurate and up-to-date.

- **Customizable Content Processing**: Boox allows you to customize how it processes different document formats (e.g., HTML, Markdown) to extract the relevant text for indexing and searching.

- **Tailored Tokenization and Stemming**: You can define custom rules for breaking down text into tokens (words or meaningful units) and stemming (reducing words to their root form). This can improve search accuracy for specific languages or domains.

- **Phonetic Encoding Support**: Boox supports phonetic encoding methods like Metaphone and Double Metaphone, which can help find documents even if the spelling of the search terms is slightly different.

- **Multilingual Support**: Boox can be used with multiple languages by customizing stemmers and phonetic algorithms.

- **Query Expansion**: You can expand your search queries with synonyms or related terms to improve the chances of finding relevant documents.

- **Personalized Ranking**: Boox allows you to customize how search results are ranked by taking into account factors like document freshness or user feedback.

- **User-Friendly Features**: Boox provides features like search term highlighting, search history tracking, popular searches monitoring, and search suggestions to enhance the user experience.

- **Flexible Operation Modes**: Boox supports both synchronous and asynchronous operations, giving you flexibility in how you integrate it into your application.
