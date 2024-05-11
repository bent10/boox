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
- `options` (optional): An object containing options for retrieving search suggestions (see the [`SearchSuggestionsOptions`](./configuration.html#searchsuggestionsoptions)).

## Filtering

While Boox doesn't provide built-in filtering methods, you have full control over the results. You can implement your own filtering logic based on:

- Document Attributes: Filter results based on values in the `attributes` property of each `SearchResult`. For example, filter products by price range or articles by publication date.
- Relevance Score: Use the `score` property to filter out less relevant results. This is useful when you want to show only the most relevant matches.

Here's a simple example of filtering by an attribute:

```js
const filteredResults = results.filter(
  result => result.attributes.category === 'electronics'
)
```

## Pagination

When dealing with large sets of search results, presenting them all at once can overwhelm users and impact performance. Boox offers a static method, `paginateSearchResults`, to easily divide your results into manageable pages:

```js
const filteredResults = results.filter(
  result => result.attributes.category === 'electronics'
)

const paginatedResults = Boox.paginateSearchResults(filteredResults, 2, 10)
```

Let's break down the arguments:

- `results`: The array of `SearchResult` objects returned by your `boox.search()` call.
- `page`: The desired page number (starting from 1). Here, we're requesting page 2.
- `resultsPerPage`: The number of results to display on each page. Here, we're showing 10 results per page.

The `paginateSearchResults` method returns a `SearchResultWithPagination` object, which not only contains the results for the requested page but also helpful metadata:

```js
{
  currentPage: 2,        // The current page number
  totalPages: 5,         // Total number of pages based on results and resultsPerPage
  totalResults: 48,      // Total number of search results
  results: [...],        // Array of SearchResult objects for the current page
  goTo: (index) => {...} // Function to navigate to other pages
}
```

The `goTo` function allows for easy navigation:

```js
paginatedResults.goTo(3) // Go to page 3
paginatedResults.goTo('next') // Go to the next page
paginatedResults.goTo('first') // Go to the first page
```
