---
title: Working with search results
---

# Working with search results

Once you've performed a search using Boox, you'll get an array of [`SearchResult`](./api.html#searchresult-class) objects. This section explains how to work with these results effectively.

## Customizing search term highlighting

By default, Boox highlights search terms within the results using the `<mark class="search-highlight">` tag. You can customize the HTML tags used for highlighting by setting the `highlightTag` option in the [`SearchOptions`](./configuration.html#searchoptions) object:

```js
const results = await boox.search('keyword', {
  // Use bold tags for highlighting
  highlightTag: ['<b>', '</b>']
})
```

## Getting search context

The `context` method of the `SearchResult` object allows you to retrieve the context of a specific document attribute, highlighting the search terms:

```js
for (const result of results) {
  // Get context of 'content' attribute with max length 100
  const context = result.context('content', 100)

  // Highlighted text with keywords
  console.log(context.text)
}
```

The `context` method takes two arguments:

- `key`: The key of the document attribute to retrieve context for.
- `contextLength` (optional): The maximum length of the returned context.

## Keyword in context

Boox provides methods for retrieving [keyword in context](https://en.wikipedia.org/wiki/Key_Word_in_Context) (KWIC) results:

You can use the `kwic` methods of the `SearchResult` object:

```js
const kwicResults = result.kwic('content')
```

Both methods return an array of `QueryContext` objects, each containing the `keywords` and their corresponding `text`.

## Search history

Boox keeps track of recent search queries. You can access the search history using the `getSearchHistory` method:

```js
// Get up to 20 recent searches
const history = boox.getSearchHistory(20)
```

## Popular searches

Boox also monitors popular search queries. You can retrieve the popular searches sorted by frequency using the `getPopularSearches` method:

```js
// Get up to 15 popular searches
const popularSearches = boox.getPopularSearches(15)
```

## Search suggestions

You can use the `getSearchSuggestions` method to generate search suggestions based on popular queries or previously searched terms:

```js
const suggestions = boox.getSearchSuggestions('web', { threshold: 2 })
```

The `getSearchSuggestions` method takes two arguments:

- `queryPrefix`: The prefix of the search query entered by the user.
- `options` (optional): An object containing options for retrieving search suggestions (see the `SearchSuggestionsOptions` interface in the [configs reference](/configurations.html#searchsuggestionsoptions-interface)).

## Pagination and filtering

Boox provides a static method called `paginateSearchResults` to help you paginate search results:

```js
const paginatedResults = Boox.paginateSearchResults(results, 2, 10)
```

The `paginateSearchResults` method takes three arguments:

- `results`: The array of search results to paginate.
- `page`: The current page number.
- `resultsPerPage`: The number of results per page.

It returns an object containing the paginated results, total results, total pages, and current page number.

You can implement your own filtering logic to filter search results based on specific criteria. For example, you might want to filter results based on document attributes or relevance scores.
