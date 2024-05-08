---
title: Integration with Vue.js
---

# Vue.js

Similarly, you can integrate Boox with a Vue.js application using computed properties and methods to manage the search state and update the UI. Here's a basic example:

## Project setup

Create a new Vue.js project using Vite with TypeScript template:

```bash
npm create vite@latest boox-vue --template vue-ts
```

Now run:

```bash
cd boox-vue && npm install
```

Install Boox and other dependencies:

```bash
npm install -D boox vue-debounce metaphone stemmer stopword @types/stopword
```

## File structure

```text
boox-vue
├── src
│   ├── components
│   │   ├── Footer.vue
│   │   ├── Search.vue
│   │   ├── SearchInfo.vue
│   │   ├── SearchResult.vue
│   │   └── SearchResults.vue
│   ├── App.vue
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
::fetch-example["vue/index.html"]
```

```ts title="vite.config.ts"
::fetch-example["vue/vite.config.ts"]
```

:::

**Below is the content of the `src/*` files:**

:::code-group

```vue title="App.vue"
::fetch-example["vue/src/App.vue"]
```

```ts title="main.ts"
::fetch-example["vue/src/main.ts"]
```

```ts title="types.ts"
::fetch-example["vue/src/types.ts"]
```

:::

**Below is the content of the `src/components/*` files:**

:::code-group

```vue title="Footer.vue"
::fetch-example["vue/src/components/Footer.vue"]
```

```vue title="Search.vue"
::fetch-example["vue/src/components/Search.vue"]
```

```vue title="SearchInfo.vue"
::fetch-example["vue/src/components/SearchInfo.vue"]
```

```vue title="SearchResult.vue"
::fetch-example["vue/src/components/SearchResult.vue"]
```

```vue title="SearchResults.vue"
::fetch-example["vue/src/components/SearchResults.vue"]
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
