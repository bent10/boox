# examples-vanilla

This example demonstrates how to build a basic search UI using Boox. We'll create a simple HTML page with a search box and display the search results dynamically.

## Project setup

Create a new Vanilla project using Vite with TypeScript template:

```bash
npm create vite@latest examples/vanilla -- --template vanilla-ts
```

Install Boox and other dependencies:

```bash
npm i && npm i -D -w examples-vanilla boox debounce metaphone stemmer stopword @types/stopword
```

## Running the app

**1. Start the development server:**

```bash
npm run dev -w examples-vanilla
```

Open [http://localhost:5173](http://localhost:5173/boox/demo/vanilla) in your browser to see the search app in action.

**2. Build for Production:**

```bash
npm run build -w examples-vanilla
```

> [!IMPORTANT]
> Remember to consult the documentation for Boox and other libraries for more advanced usage and configuration options.
