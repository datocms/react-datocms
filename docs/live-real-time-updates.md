# Live real-time updates

`useQuerySubscription` is a React hook that you can use to implement client-side updates of the page as soon as the content changes. It uses DatoCMS's [Real-time Updates API](https://www.datocms.com/docs/real-time-updates-api/api-reference) to receive the updated query results in real-time, and is able to reconnect in case of network failures.

Live updates are great both to get instant previews of your content while editing it inside DatoCMS, or to offer real-time updates of content to your visitors (ie. news site).

- TypeScript ready;
- Compatible with vanilla React, Next.js and pretty much any other React-based solution;

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
- [Reference](#reference)
- [Initialization options](#initialization-options)
- [Connection status](#connection-status)
- [Error object](#error-object)
- [Example](#example)
- [The `fetcher` option](#the-fetcher-option)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```
npm install --save react-datocms
```

## Reference

Import `useQuerySubscription` from `react-datocms` and use it inside your components like this:

```js
const {
  data: QueryResult | undefined,
  error: ChannelErrorData | null,
  status: ConnectionStatus,
} = useQuerySubscription(options: Options);
```

## Initialization options

| prop               | type                                                                                       | required           | description                                                        | default                              |
| ------------------ | ------------------------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------ | ------------------------------------ |
| enabled            | boolean                                                                                    | :x:                | Whether the subscription has to be performed or not                | true                                 |
| query              | string \| [`TypedDocumentNode`](https://github.com/dotansimha/graphql-typed-document-node) | :white_check_mark: | The GraphQL query to subscribe                                     |                                      |
| token              | string                                                                                     | :white_check_mark: | DatoCMS API token to use                                           |                                      |
| variables          | Object                                                                                     | :x:                | GraphQL variables for the query                                    |                                      |
| preview            | boolean                                                                                    | :x:                | If true, the Content Delivery API with draft content will be used  | false                                |
| environment        | string                                                                                     | :x:                | The name of the DatoCMS environment where to perform the query     | defaults to primary environment      |
| initialData        | Object                                                                                     | :x:                | The initial data to use on the first render                        |                                      |
| reconnectionPeriod | number                                                                                     | :x:                | In case of network errors, the period (in ms) to wait to reconnect | 1000                                 |
| fetcher            | a [fetch-like function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)        | :x:                | The fetch function to use to perform the registration query        | window.fetch                         |
| eventSourceClass   | an [EventSource-like](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) class  | :x:                | The EventSource class to use to open up the SSE connection         | window.EventSource                   |
| baseUrl            | string                                                                                     | :x:                | The base URL to use to perform the query                           | `https://graphql-listen.datocms.com` |

## Connection status

The `status` property represents the state of the server-sent events connection. It can be one of the following:

- `connecting`: the subscription channel is trying to connect
- `connected`: the channel is open, we're receiving live updates
- `closed`: the channel has been permanently closed due to a fatal error (ie. an invalid query)

## Error object

| prop     | type   | description                                             |
| -------- | ------ | ------------------------------------------------------- |
| code     | string | The code of the error (ie. `INVALID_QUERY`)             |
| message  | string | An human friendly message explaining the error          |
| response | Object | The raw response returned by the endpoint, if available |

## Example

```js
import React from 'react';
import { useQuerySubscription } from 'react-datocms';

const App: React.FC = () => {
  const { status, error, data } = useQuerySubscription({
    enabled: true,
    query: `
      query AppQuery($first: IntType) {
        allBlogPosts {
          slug
          title
        }
      }`,
    variables: { first: 10 },
    token: 'YOUR_API_TOKEN',
  });

  const statusMessage = {
    connecting: 'Connecting to DatoCMS...',
    connected: 'Connected to DatoCMS, receiving live updates!',
    closed: 'Connection closed',
  };

  return (
    <div>
      <p>Connection status: {statusMessage[status]}</p>
      {error && (
        <div>
          <h1>Error: {error.code}</h1>
          <div>{error.message}</div>
          {error.response && (
            <pre>{JSON.stringify(error.response, null, 2)}</pre>
          )}
        </div>
      )}
      {data && (
        <ul>
          {data.allBlogPosts.map((blogPost) => (
            <li key={blogPost.slug}>{blogPost.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

## The `fetcher` option

Be careful with how you define the `fetcher` option: use a function that is
defined as a `const` outside of the lexical scope where you're using
`useQuerySubscription`.

If you don't, you could have an infinite render loop, because the function looks
like new at every render of the component. For more info, see
[use-deep-compare-effect](https://github.com/kentcdodds/use-deep-compare-effect?tab=readme-ov-file#usage)
documentation.

The following example is ok:

```js
const fetcher = (baseUrl, { headers, method, body }) => {
  return fetch(baseUrl, {
    headers: {
      ...headers,
      'X-Custom-Header': "that's needed for some reason",
    },
    method,
    body,
  });
};

export default function Home() {
  const { status, error, data } = useQuerySubscription({
    fetcher,
    // Other options here
  });

  return ...
}
```

**This one is not**, because the new function that is generated every time the component is rendered triggers another render: 

```js
export default function Home() {
  const { status, error, data } = useQuerySubscription({
    fetcher: (baseUrl, { headers, method, body }) => {
      return fetch(baseUrl, {
        headers: {
          ...headers,
          'X-Custom-Header': "that's needed for some reason",
        },
        method,
        body,
      });
    },
    // Other options here
  });

  return ...
}
```
