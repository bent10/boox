---
title: Frequently asked questions
pagination: false
toc: false
archive: true
---

# Frequently asked questions

This section answers common questions and provides solutions to potential issues you might encounter while using Boox.

1. **What types of data can Boox handle?**

   Boox is primarily designed to work with plain text data. However, you can customize how Boox processes different data formats (e.g., HTML, Markdown, DOCX, PDF, etc.) to extract the relevant text for indexing and searching. Refer to the handling specific [Data Formats](./guides/data-formats.html) section for more details.

2. **How do I improve search accuracy?**

   There are several ways to improve search accuracy in Boox:

   - Use relevant features: Make sure you are indexing the most relevant fields in your documents.
   - Customize text processing: Use custom normalizers, tokenizers, and stemmers to tailor text processing to your specific data and domain.
   - Use phonetic encoding: Enable phonetic encoding to find documents even if the spelling of search terms is slightly different.
   - Use query expansion: Expand your search queries with synonyms or related terms.
   - Use a custom matching coefficient: Define a custom matching coefficient function to prioritize documents based on specific criteria.

3. **How do I handle large datasets?**

   Boox is designed to be efficient with large datasets, but there are additional strategies you can use:

   - Train in batches: Add documents to the Boox instance in smaller batches to reduce memory pressure.
   - Pre-process and normalize data: Remove unnecessary fields and normalize text to reduce the size of the index.
   - Serialize and persist with compression: Save the trained Boox instance to disk or another storage mechanism with compression to avoid retraining every time.
   - Use the CLI tool: Use the [`boox-cli`](https://github.com/{{repoPath}}/tree/main/packages/cli) tool for advanced dataset management and training.
   - Optimize search options: Use options like `limit`, `queryExpander`, and `matchingCoefficient` to improve performance. Refer to the handling [Large Datasets](./guides/large-datasets.html) section for more details.

4. **How do I integrate Boox with my application?**

   Boox can be integrated with various libraries and frameworks. Refer to the [Integration](./guides/integration.html) with Other Libraries section for examples of how to integrate Boox with React, Vue.js, Angular, Express.js, and Next.js.

5. **I'm getting an error. What should I do?**

   If you encounter an error while using Boox, please check the following:

   - Make sure you are using the correct API: Refer to the [API Reference](./guides/api.html) for detailed information about Boox's API.
   - Check your dataset: Ensure that your dataset is in the correct format and that the `id` field is properly defined.
   - Check your configuration options: Make sure you are providing [valid options](./guides/configuration.html) to the Boox constructor and search methods.

   If you are still having trouble, please create an issue on the [Boox repository](https://github.com/{{repoPath}}) with a detailed description of the error and your code.

6. **Is Boox suitable for production use?**

   Yes! Boox is suitable for production use. It is a lightweight and efficient library that can handle large datasets and provide fast and accurate search results. However, it's important to thoroughly test your integration and ensure that Boox meets your specific performance and reliability requirements.

7. **How can I contribute to Boox?**

   We welcome contributions to Boox! If you have ideas for new features, bug fixes, or documentation improvements, please create a pull request on the [Boox repository](https://github.com/{{repoPath}}).

We hope this FAQ section helps you get started with Boox and answers any questions you might have.
