# examples-react

To integrate Boox with a React application, you can use the `useState` and `useEffect` hooks to manage the search state and update the UI accordingly.

## Project setup

Create a new React project using Vite with TypeScript template:

```bash
npm create vite@latest examples/react -- --template react-ts
```

Install Boox and other dependencies:

```bash
npm i && npm i -D -w examples-react boox use-debounce metaphone stemmer stopword @types/stopword
```

## Running the app

**1. Start the development server:**

```bash
npm run dev -w examples-react
```

Open [http://localhost:5173](http://localhost:5173/boox/demo/react) in your browser to see the search app in action.

**2. Build for Production:**

```bash
npm run build -w examples-react
```

> [!IMPORTANT]
> Remember to consult the documentation for Boox and other libraries for more advanced usage and configuration options.
