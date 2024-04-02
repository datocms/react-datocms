# Social share, SEO and Favicon meta tags

Just like for the [image component](./image.md) this package offers a number of utilities designed to work seamlessly with DatoCMS’s [`_seoMetaTags` and `faviconMetaTags` GraphQL queries](https://www.datocms.com/docs/content-delivery-api/seo) so that you can easily handle SEO, social shares and favicons in your pages.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Installation](#installation)
- [General usage](#general-usage)
- [`renderMetaTags()`](#rendermetatags)
- [`renderMetaTagsToString()`](#rendermetatagstostring)
- [`toRemixMeta()`](#toremixmeta)
  - [For Remix v1: `toRemixV1Meta()`](#for-remix-v1-toremixv1meta)
- [`toNextMetadata()`](#tonextmetadata)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Installation

```
npm install --save react-datocms
```

## General usage

All the utilities take an array of `SeoOrFaviconTag`s in the exact form they're returned by the following [DatoCMS GraphQL API queries](https://www.datocms.com/docs/content-delivery-api/seo):

- `_seoMetaTags` (always available on any type of record)
- `faviconMetaTags` on the global `_site` object.

```graphql
query {
  page: homepage {
    title
    seo: _seoMetaTags {
      attributes
      content
      tag
    }
  }

  site: _site {
    favicon: faviconMetaTags {
      attributes
      content
      tag
    }
  }
}
```

You can then concat those two arrays of tags and pass them togheter to the function, ie:

```js
renderMetaTags([...data.page.seo, ...data.site.favicon]);
```

## `renderMetaTags()`

This function generates React `<meta>` and `<link />` elements, so it is compatible with React packages like [`react-helmet`](https://www.npmjs.com/package/react-helmet).

For a complete example take a look at our [examples directory](https://github.com/datocms/react-datocms/tree/master/examples).

```js
import React from 'react';
import { renderMetaTags } from 'react-datocms';

function Page({ data }) {
  return (
    <div>
      <Helmet>
        {renderMetaTags([...data.page.seo, ...data.site.favicon])}
      </Helmet>
    </div>
  );
}
```

## `renderMetaTagsToString()`

This function generates an HTML string containing `<meta>` and `<link />` tags, so it can be used server-side.

```js
import { renderMetaTagsToString } from 'react-datocms';

const someMoreComplexHtml = `
  <html>
    <head>
      ${renderMetaTagsToString([...data.page.seo, ...data.site.favicon])}
    </head>
  </html>
`;
```

## `toRemixMeta()`

This function generates an array of `MetaDescriptor` objects, compatibile with the [`meta`](https://remix.run/docs/en/2.8.1/route/meta) export of the Remix framework:

```js
import type { MetaFunction } from 'remix';
import { toRemixV1Meta } from 'react-datocms';

export const meta: MetaFunction = ({ data: { post } }) => {
  return toRemixV1Meta(post.seo);
};
```

Please note that the [`links`](https://remix.run/docs/en/v1.1.1/api/conventions#links) export [doesn't receive any loader data](https://github.com/remix-run/remix/issues/32), so you cannot use it to declare favicons meta tags!

The best way to render them is using the [`meta`](https://remix.run/docs/en/2.8.1/route/meta) export as the SEO meta tags, or (even better) using `renderMetaTags` in your root component:

```jsx
import { renderMetaTags } from 'react-datocms';

export const loader = () => {
  return request({
    query: `
        {
          site: _site {
            favicon: faviconMetaTags(variants: [icon, msApplication, appleTouchIcon]) {
              ...metaTagsFragment
            }
          }
        }
        ${metaTagsFragment}
      `,
  });
};

export default function App() {
  const { site } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {renderMetaTags(site.favicon)}
      </head>
      <body>
        <Outlet />
        ...
      </body>
    </html>
  );
}
```

### For Remix v1: `toRemixV1Meta()`

If you're using Remix v1, you can use `toRemixV1Meta()` to generate an object compatible with the legacy [`meta`](https://remix.run/docs/en/v1.1.1/api/conventions#meta) export:

```js
import type { MetaFunction } from 'remix';
import { toRemixV1Meta } from 'react-datocms';

export const meta: MetaFunction = ({ data: { post } }) => {
  return toRemixV1Meta(post.seo);
};
```

## `toNextMetadata()`

This function generates a `Metadata` object, compatibile with the [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) export of the [Next](https://nextjs.org/) framework:

```js
export async function generateMetadata(): Promise<Metadata> {
  const { homepage } = await getHomepageContent()
 
  return toNextMetadata(homepage?._seoMetaTags || [])
}
```
