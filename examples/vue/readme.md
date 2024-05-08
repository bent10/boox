# examples-vue

You can integrate Boox with a Vue.js application using computed properties and methods to manage the search state and update the UI.

## Project setup

Create a new Vue.js project using Vite with TypeScript template:

```bash
npm create vite@latest examples/vue -- --template vue-ts
```

Install Boox and other dependencies:

```bash
npm i && npm i -D -w examples-vue boox vue-debounce metaphone stemmer stopword @types/stopword
```

## Running the app

**1. Start the development server:**

```bash
npm run dev -w examples-vue
```

Open [http://localhost:5173](http://localhost:5173/boox/demo/vue) in your browser to see the search app in action.

**2. Build for Production:**

```bash
npm run build -w examples-vue
```

> [!IMPORTANT]
> Remember to consult the documentation for Boox and other libraries for more advanced usage and configuration options.
