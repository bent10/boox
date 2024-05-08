---
title: Integration with Svelte
---

# Svelte

An example of how you can integrate Boox with Svelte:

## Project setup

Create a new Svelte project using Vite with TypeScript template:

```bash
npm create vite@latest boox-svelte --template svelte-ts
```

Now run:

```bash
cd boox-svelte && npm install
```

Install Boox and other dependencies:

```bash
npm install -D boox debounce metaphone stemmer stopword @types/stopword
```

## File structure

```text
boox-svelte
├── lib
│   ├── components
│   │   ├── Footer.svelte
│   │   ├── Search.svelte
│   │   ├── SearchInfo.svelte
│   │   ├── SearchResult.svelte
│   │   └── SearchResults.svelte
│   ├── App.svelte
│   ├── main.ts
│   └── types.ts
├── index.html
└── vite.config.ts
```

> [!TIP]
> You can remove unnecessary files from the default Vite installation.

## Code snippets

Kindly replicate the code snippets provided below:

:::code-group

```html title="index.html"
::fetch-example["svelte/index.html"]
```

```ts title="vite.config.ts"
::fetch-example["svelte/vite.config.ts"]
```

:::

**Below is the content of the `src/*` files:**

:::code-group

```svelte title="App.svelte"
::fetch-example["svelte/src/App.svelte"]
```

```ts title="main.ts"
::fetch-example["svelte/src/main.ts"]
```

```ts title="types.ts"
::fetch-example["svelte/src/types.ts"]
```

:::

**Below is the content of the `src/lib/*` files:**

:::code-group

```svelte title="Footer.svelte"
::fetch-example["svelte/src/lib/Footer.svelte"]
```

```svelte title="Search.svelte"
::fetch-example["svelte/src/lib/Search.svelte"]
```

```svelte title="SearchInfo.svelte"
::fetch-example["svelte/src/lib/SearchInfo.svelte"]
```

```svelte title="SearchResult.svelte"
::fetch-example["svelte/src/lib/SearchResult.svelte"]
```

```svelte title="SearchResults.svelte"
::fetch-example["svelte/src/lib/SearchResults.svelte"]
```

:::

## Running the app

**1. Start the development server:**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see the search app in action.

**2. Build for Production:**

```bash
npm run build
```

> [!IMPORTANT]
> Remember to consult the documentation for Boox and other libraries for more advanced usage and configuration options.
