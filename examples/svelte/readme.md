# examples-svelte

Here's an example of how you can integrate Boox with Svelte:

## Project setup

Create a new Svelte project using Vite with TypeScript template:

```bash
npm create vite@latest examples/svelte -- --template svelte-ts
```

Install Boox and other dependencies:

```bash
npm i && npm i -D -w examples-svelte boox debounce metaphone stemmer stopword @types/stopword
```

## Run the application

**1. Start the development server:**

```bash
npm run dev -w examples-svelte
```

Open [http://localhost:5173](http://localhost:5173/boox/demo/svelte) in your browser to see the search app in action.

**2. Build for Production:**

```bash
npm run build -w examples-svelte
```

> [!IMPORTANT]
> Remember to consult the documentation for Boox and other libraries for more advanced usage and configuration options.
