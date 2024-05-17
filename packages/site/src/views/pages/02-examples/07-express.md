---
title: Integration with Express.js
isLastPage: true
---

# Express.js

An example of how you can build a search API endpoint using Boox and Express.js:

## Project setup

Create a new `boox-express` directory and run:

```bash
cd boox-express && npm init -y
```

Install Boox and other dependencies:

```bash
npm install -D boox express pako metaphone stemmer stopword
```

## File structure

```text
boox-express
├── public
│   ├── index.html
│   └── main.js
├── app.js
├── boox.config.js
└── pokemon-100r-trained.gz
```

> [!TIP]
> You can remove unnecessary files from the default Vite installation.

## Code snippets

Kindly replicate the code snippets provided below:

:::code-group

```js title="app.js"
::fetch-example["express/app.js"]
```

```js title="boox.config.js"
::fetch-example["express/boox.config.js"]
```

```js title="types.d.ts"
::fetch-example["express/types.d.ts"]
```

```html title="public/index.html"
::fetch-example["express/public/index.html"]
```

```js title="public/main.js"
::fetch-example["express/public/main.js"]
```

:::

## Running the app

Start the Express server:

```bash
node app.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the search interface.

> [!IMPORTANT]
> Remember to consult the documentation for Boox and other libraries for more advanced usage and configuration options.
