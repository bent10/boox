# examples-nextjs

An example of how you can integrate Boox into a Next.js application to provide server-side search functionality.

## Project setup

Create a new Next.js project:

```bash
npx create-next-app examples/nextjs
```

Install Boox and other dependencies:

```bash
npm i && npm i -w examples-nextjs -D boox debounce metaphone stemmer stopword @types/stopword
```

## Running the app

**1. Start the development server:**

```bash
npm run dev -w examples-nextjs
```

Open [http://localhost:3000](http://localhost:3000/boox/demo/nextjs) in your browser to see the search app in action.

**2. Build for Production:**

```bash
npm run build -w examples-nextjs
```

> [!IMPORTANT]
> Remember to consult the documentation for Boox and other libraries for more advanced usage and configuration options.
