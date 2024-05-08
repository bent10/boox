---
title: Integration with Next.js
isLastPage: true
---

# Next.js

An example of how you can integrate Boox into a Next.js application to provide server-side search functionality.

## Project setup

Create a new Next.js project:

```bash
npx create-next-app boox-nextjs
```

Now run:

```bash
cd boox-nextjs && npm install
```

Install Boox and other dependencies:

```bash
npm install -D boox debounce metaphone stemmer stopword @types/stopword
```

## File structure

```text
boox-nextjs
└── app
    ├── components
    │   ├── Footer.tsx
    │   ├── Search.tsx
    │   ├── SearchInfo.tsx
    │   ├── SearchResult.tsx
    │   └── SearchResults.tsx
    ├── layout.tsx
    ├── page.tsx
    └── types.ts
```

> [!TIP]
> You can remove unnecessary files from the default Vite installation.

## Code snippets

Kindly replicate the code snippets provided below:

:::code-group

```js title="next.config.mjs"
::fetch-example["nextjs/next.config.mjs"]
```

:::

**Below is the content of the `app/*` files:**

:::code-group

```tsx title="layout.tsx"
::fetch-example["nextjs/app/layout.tsx"]
```

```tsx title="page.tsx"
::fetch-example["nextjs/app/page.tsx"]
```

```ts title="types.ts"
::fetch-example["nextjs/app/types.ts"]
```

:::

**Below is the content of the `app/components/*` files:**

:::code-group

```tsx title="Footer.tsx"
::fetch-example["nextjs/app/components/Footer.tsx"]
```

```tsx title="Search.tsx"
::fetch-example["nextjs/app/components/Search.tsx"]
```

```tsx title="SearchInfo.tsx"
::fetch-example["nextjs/app/components/SearchInfo.tsx"]
```

```tsx title="SearchResult.tsx"
::fetch-example["nextjs/app/components/SearchResult.tsx"]
```

```tsx title="SearchResults.tsx"
::fetch-example["nextjs/app/components/SearchResults.tsx"]
```

:::

## Running the app

**1. Start the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the search app in action.

**2. Build for Production:**

```bash
npm run build
```

> [!IMPORTANT]
> Remember to consult the documentation for Boox and other libraries for more advanced usage and configuration options.
