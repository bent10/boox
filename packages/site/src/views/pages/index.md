---
layout: landing.html
title: Boox - Search anything, instantly

headline: Search anything, instantly
subheadline: >-
  A lightweight, zero-dependency, customizable full-text search library for building fast and accurate search experiences in your web and Node.js applications.

features:
  - icon: fast
    title: Lightweight & Fast
    description: >-
      Experience instant search results with Boox’s optimized indexing and
      dynamic retrieval algorithms.

  - icon: modeling
    title: Accurate & Relevant
    description: >-
      Get the most relevant results with Boox’s advanced TF-IDF scoring and
      optional Vector Space Model.

  - icon: options
    title: Highly Customizable
    description: >-
      Tailor Boox to your specific needs with custom text processing,
      tokenization, and stemming options.

  - icon: advance
    title: Dynamic IDF Calculation
    description: Always up-to-date relevance scoring for search results.

  - icon: translation
    title: Multilingual Support
    description: Search seamlessly across multiple languages.

  - icon: duplicate
    title: Query Expansion
    description: Enhance search results with synonyms and related terms.

  - icon: results
    title: Personalized Ranking
    description: Customize search result rankings based on user preferences.

  - icon: data-formats
    title: User-Friendly Features
    description: >-
      Highlight search terms, track search history, and provide suggestions for a better user experience.

faqs:
  - question: What types of data can Boox handle?
    answer: >-
      Boox is primarily designed to work with plain text data. However, you can customize how Boox processes different <a href="guides/data-formats.html">Data formats</a>.

  - question: How do I improve search accuracy?
    answer: >-
      There are several ways to improve search accuracy. Refer to the <a href="guides/custom-modeling.html">Custom modeling</a> and <a href="guides/advanced-search.html">Advanced search</a> sections for more details.

  - question: How do I handle large datasets?
    answer: >-
      Save your trained data to disk or another storage mechanism with compression to avoid retraining every time. Refer to the handling <a href="guides/large-datasets.html">Large datasets</a> section for more details.

  - question: Does Boox support different languages?
    answer: >-
      Yes, Boox can be used with multiple languages by customizing stemmers and phonetic algorithms to suit the specific language requirements.

  - question: How do I integrate Boox with my application?
    answer: >-
      Refer to the <a href="examples/index.html">Integration</a>  with Other Libraries section for examples of how to integrate Boox with React, Vue.js, Svelte, Express.js, and Next.js.

  - question: I’m getting an error. What should I do?
    answer: >-
      Make sure you are using the correct API. Ensure that your dataset is in the correct format and that the id field is properly defined and make sure you are providing valid options to the Boox constructor and search methods.

  - question: Is Boox suitable for production use?
    answer: Yes! Boox is suitable for production use. However, it’s important to thoroughly test your integration and ensure that Boox meets your specific performance and reliability requirements.

  - question: How can I contribute to Boox?
    answer: We welcome contributions to Boox! If you have ideas for new features, bug fixes, or documentation improvements, please create a pull request on the Boox repository.
---
