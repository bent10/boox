# <img src="https://stilearning.com/boox/boox-logo.svg?v1" width="24" /> Boox

Boox is a lightweight, zero-dependency full-text search library designed for both browser and Node.js. It enables you to efficiently search through multiple documents and datasets, returning relevant results based on your queries.

## Packages

| Package               | Description                                | Version (click for changelog)                                              |
| :-------------------- | :----------------------------------------- | :------------------------------------------------------------------------- |
| [core](packages/core) | The Boox package.                          | [![npm](https://img.shields.io/npm/v/boox)](packages/core/changelog.md)    |
| [cli](packages/cli)   | CLI tool to train your datasets with Boox. | [![npm](https://img.shields.io/npm/v/boox-cli)](packages/cli/changelog.md) |

## Documentation

Go to [Boox documentation](https://stilearning.com/boox).

# Integration

Boox is designed to be flexible and can be easily integrated with other libraries and frameworks to enhance your search functionality. The key is to manage the search state and update the UI based on the search results returned by Boox. Here are some examples of how you can integrate Boox with popular tools:

- [Vanilla JavaScript](./examples/vanilla)
- [React](./examples/react)
- [Vue.js](./examples/vue)
- [Svelte](./examples/svelte)
- [Angular](./examples/angular)
- [Next.js](./examples/nextjs)
- [Express.js](./examples/express)

## Contributing

We 💛&nbsp; issues.

When committing, please conform to [the semantic-release commit standards](https://www.conventionalcommits.org/). Please install `commitizen` and the adapter globally, if you have not already.

```bash
npm i -g commitizen cz-conventional-changelog
```

Now you can use `git cz` or just `cz` instead of `git commit` when committing. You can also use `git-cz`, which is an alias for `cz`.

```bash
git add . && git cz
```

## License

![GitHub](https://img.shields.io/github/license/bent10/boox)

A project by [Stilearning](https://stilearning.com) &copy; 2024.
