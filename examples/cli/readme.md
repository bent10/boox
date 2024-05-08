# examples-cli

**1. Training:**

```bash
npm run train -w examples-cli -- src/wikipedia-en-100r.json dist -f title text -a url
```

This command will train a Boox dataset from the `src/wikipedia-en-100r.json` file, indexing the `title` and `text` fields for search and including the `url` field as-is. The trained data will be saved as a compressed `dist/wikipedia-en-100r-trained.gz` file.

**2. Searching:**

```bash
npm run search -w examples-cli -- dist/wikipedia-en-100r-trained.gz "albert einstein" -o 2 -l 5 -k text -a title
```

This command will search the `dist/wikipedia-en-100r-trained.gz` file for documents containing the words `"albert einstein"`, starting from the second page and displaying 5 results per page.

> [!IMPORTANT]
> Remember to consult the documentation for Boox and other libraries for more advanced usage and configuration options.
