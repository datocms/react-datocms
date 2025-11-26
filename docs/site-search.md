# Site Search hook

`useSiteSearch` is a React hook that you can use to render a [DatoCMS Site Search](https://www.datocms.com/docs/site-search) widget.
The hook only handles the form logic: you are in complete and full control of how your form renders down to the very last component, class or style.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Reference](#reference)
- [Initialization options](#initialization-options)
- [Returned data](#returned-data)
- [Complete example](#complete-example)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

To perform the necessary API requests, this hook requires a [DatoCMS CMA Client](https://www.datocms.com/docs/content-management-api/using-the-nodejs-clients) instance, so make sure to also add the following package to your project:

```bash
npm install --save react-datocms @datocms/cma-client-browser
```

## Reference

Import `useSiteSearch` from `react-datocms` and use it inside your components like this:

```js
import { useSiteSearch } from 'react-datocms';
import { buildClient } from '@datocms/cma-client-browser';

const client = buildClient({ apiToken: 'YOUR_API_TOKEN' });

const { state, error, data } = useSiteSearch({
  client,
  searchIndexId: '7497',
  // optional: by default fuzzy-search is not active
  fuzzySearch: true,
  // optional: you can omit it you only have one locale, or you want to find results in every locale
  initialState: { locale: 'en' },
  // optional: to configure how to present the part of page title/content that matches the query
  highlightMatch: (text, key, context) =>
    context === 'title' ? (
      <strong key={key}>{text}</strong>
    ) : (
      <mark key={key}>{text}</mark>
    ),
  // optional: defaults to 8 search results per page
  resultsPerPage: 10,
});
```

For a complete walk-through, please refer to the [DatoCMS Site Search documentation](https://www.datocms.com/docs/site-search).

## Initialization options

| prop                | type                                                               | required           | description                                                                                                                                | default                                                    |
| ------------------- | ------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| client              | CMA Client instance                                                | :white_check_mark: | [DatoCMS CMA Client](https://www.datocms.com/docs/content-management-api/using-the-nodejs-clients) instance                                |                                                            |
| searchIndexId      | string                                                             | :white_check_mark: | The [ID of the the search index](https://www.datocms.com/docs/site-search/base-integration#performing-searches) to use to find search results |                                                            |
| fuzzySearch         | boolean                                                            | :x:                | Whether fuzzy-search is active or not. When active, it will also find strings that approximately match the query provided.                 | false                                                      |
| resultsPerPage      | number                                                             | :x:                | The number of search results to show per page                                                                                              | 8                                                          |
| highlightMatch      | (match, key, context: 'title' \| 'bodyExcerpt') => React.ReactNode | :x:                | A function specifying how to highlight the part of page title/content that matches the query                                               | (text, key) => (&lt;mark key={key}&gt;{text}&lt;/mark&gt;) |
| initialState.query  | string                                                             | :x:                | Initialize the form with a specific query                                                                                                  | ''                                                         |
| initialState.locale | string                                                             | :x:                | Initialize the form starting from a specific page                                                                                          | 0                                                          |
| initialState.page   | string                                                             | :x:                | Initialize the form with a specific locale selected                                                                                        | null                                                       |

## Returned data

The hook returns an object with the following shape:

```typescript
{
  state: {
    query: string;
    setQuery: (newQuery: string) => void;
    locale: string | undefined;
    setLocale: (newLocale: string) => void;
    page: number;
    setPage: (newPage: number) => void;
  },
  error?: string,
  data?: {
    pageResults: Array<{
      id: string;
      title: React.ReactNode;
      bodyExcerpt: React.ReactNode;
      url: string;
      raw: RawSearchResult;
    }>;
    totalResults: number;
    totalPages: number;
  },
}
```

- The `state` property reflects the current state of the form (the current `query`, `page`, and `locale`), and offers a number of functions to change the state itself. As soon as the state of the form changes, a new API request is made to fetch the new search results;
- The `error` property returns a string in case of failure of any API request;
- The `data` property returns all the information regarding the current search results to present to the user;

If both `error` and `data` are `null`, it means that the current state for the form is loading, and a spinner should be shown to the end user.

## Complete example

This example uses the [`react-paginate`](https://www.npmjs.com/package/react-paginate) npm package to simplify the handling of pagination:

```jsx
import { buildClient } from '@datocms/cma-client-browser';
import ReactPaginate from 'react-paginate';
import { useSiteSearch } from 'react-datocms';
import { useState } from 'react';

const client = buildClient({ apiToken: 'YOUR_API_TOKEN' });

function App() {
  const [query, setQuery] = useState('');

  const { state, error, data } = useSiteSearch({
    client,
    initialState: { locale: 'en' },
    highlightMatch: (text, key, context) =>
      context === 'title' ? (
        <strong key={key}>{text}</strong>
      ) : (
        <mark key={key}>{text}</mark>
      ),
    searchIndexId: '7497',
    resultsPerPage: 10,
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          state.setQuery(query);
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          value={state.locale}
          onChange={(e) => {
            state.setLocale(e.target.value);
          }}
        >
          <option value="en">English</option>
          <option value="it">Italian</option>
        </select>
      </form>
      {!data && !error && <p>Loading...</p>}
      {error && <p>Error! {error}</p>}
      {data && (
        <>
          {data.pageResults.map((result) => (
            <div key={result.id}>
              <a href={result.url}>{result.title}</a>
              <div>{result.bodyExcerpt}</div>
              <div>{result.url}</div>
            </div>
          ))}
          <p>Total results: {data.totalResults}</p>
          <ReactPaginate
            pageCount={data.totalPages}
            forcePage={state.page}
            onPageChange={({ selected }) => {
              state.setPage(selected);
            }}
            activeClassName="active"
            renderOnZeroPageCount={() => null}
          />
        </>
      )}
    </div>
  );
}
```
