---
title: Integration with React
---

# React

To integrate Boox with a React application, you can use the `useState` and `useEffect` hooks to manage the search state and update the UI accordingly. Here's a basic example:

## Project setup

Create a new React project using Vite with TypeScript template:

```bash
npm create vite@latest boox-react -- --template react-ts
```

Now run:

```bash
cd boox-react && npm install
```

Install Boox and other dependencies:

```bash
npm install -D boox use-debounce metaphone stemmer stopword @types/stopword
```

## File structure

```text
boox-react
├── src
│   ├── components
│   │   ├── Footer.tsx
│   │   ├── Search.tsx
│   │   ├── SearchInfo.tsx
│   │   ├── SearchResult.tsx
│   │   └── SearchResults.tsx
│   ├── App.tsx
│   ├── main.tsx
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
::fetch-example["react/index.html"]
```

```ts title="vite.config.ts"
::fetch-example["react/vite.config.ts"]
```

:::

**Below is the content of the `src/*` files:**

:::code-group

```tsx title="App.tsx"
::fetch-example["react/src/App.tsx"]
```

```tsx title="main.tsx"
::fetch-example["react/src/main.tsx"]
```

```ts title="types.ts"
::fetch-example["react/src/types.ts"]
```

:::

**Below is the content of the `src/components/*` files:**

:::code-group

```tsx title="Footer.tsx"
::fetch-example["react/src/components/Footer.tsx"]
```

```tsx title="Search.tsx"
::fetch-example["react/src/components/Search.tsx"]
```

```tsx title="SearchInfo.tsx"
::fetch-example["react/src/components/SearchInfo.tsx"]
```

```tsx title="SearchResult.tsx"
::fetch-example["react/src/components/SearchResult.tsx"]
```

```tsx title="SearchResults.tsx"
::fetch-example["react/src/components/SearchResults.tsx"]
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
