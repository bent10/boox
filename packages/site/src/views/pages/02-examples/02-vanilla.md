---
title: Building a search UI
---

# Building a search UI

This example demonstrates how to build a basic search UI using Boox. We'll create a simple HTML page with a search box and display the search results dynamically.

## Project setup

Create a new Vanilla project using Vite with TypeScript template:

```bash
npm create vite@latest boox-vanilla -- --template vanilla-ts
```

Now run:

```bash
cd boox-vanilla && npm install
```

Install Boox and other dependencies:

```bash
npm install -D boox debounce metaphone stemmer stopword @types/stopword
```

## File structure

```text
boox-vanilla
├── src
│   └── main.tsx
├── index.html
└── vite.config.ts
```

> [!TIP]
> You can remove unnecessary files from the default Vite installation.

## Code snippets

Kindly replicate the code snippets provided below:

:::code-group

```html title="index.html"
::fetch-example["vanilla/index.html"]
```

```ts title="src/main.ts"
::fetch-example["vanilla/src/main.ts"]
```

```ts title="vite.config.ts"
::fetch-example["vanilla/vite.config.ts"]
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
