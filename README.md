# react-datocms

![MIT](https://img.shields.io/npm/l/react-datocms?style=for-the-badge) ![MIT](https://img.shields.io/npm/v/react-datocms?style=for-the-badge) [![Build Status](https://img.shields.io/travis/datocms/react-datocms?style=for-the-badge)](https://travis-ci.org/datocms/react-datocms)

A set of components and utilities to work faster with [DatoCMS](https://www.datocms.com/) in React environments. Integrates seamlessy with DatoCMS's [GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api) and [Real-time Updates API](https://www.datocms.com/docs/real-time-updates-api).

<br /><br />
<a href="https://www.datocms.com/">
  <img src="https://www.datocms.com/images/full_logo.svg" height="60">
</a>
<br /><br />

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Demos](#demos)
- [Installation](#installation)
- [Live real-time updates](#live-real-time-updates)
  - [Reference](#reference)
  - [Initialization options](#initialization-options)
  - [Connection status](#connection-status)
  - [Error object](#error-object)
  - [Example](#example)
- [Progressive/responsive image](#progressiveresponsive-image)
  - [Out-of-the-box features](#out-of-the-box-features)
  - [Usage](#usage)
  - [Example](#example-1)
  - [Props](#props)
    - [The `ResponsiveImage` object](#the-responsiveimage-object)
- [Social share, SEO and Favicon meta tags](#social-share-seo-and-favicon-meta-tags)
  - [Usage](#usage-1)
  - [Example](#example-2)
- [Structured text](#structured-text)
  - [Basic usage](#basic-usage)
  - [Custom renderers for inline records, blocks, and links](#custom-renderers)
  - [Override default text rendering](#override-default-rendering-of-nodes)
  - [Props](#props-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Demos

For fully working examples take a look at our [examples directory](https://github.com/datocms/react-datocms/tree/master/examples).

Live demo: [https://react-datocms-example.netlify.com/](https://react-datocms-example.netlify.com/)

## Installation

```
npm install react-datocms
```

# Live real-time updates

`useQuerySubscription` is a React hook that you can use to implement client-side updates of the page as soon as the content changes. It uses DatoCMS's [Real-time Updates API](https://www.datocms.com/docs/real-time-updates-api/api-reference) to receive the updated query results in real-time, and is able to reconnect in case of network failures.

Live updates are great both to get instant previews of your content while editing it inside DatoCMS, or to offer real-time updates of content to your visitors (ie. news site).

- TypeScript ready;
- Compatible with vanilla React, Next.js and pretty much any other React-based solution;

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

| prop               | type                                                                                      | required           | description                                                        | default                              |
| ------------------ | ----------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------ | ------------------------------------ |
| enabled            | boolean                                                                                   | :x:                | Whether the subscription has to be performed or not                | true                                 |
| query              | string                                                                                    | :white_check_mark: | The GraphQL query to subscribe                                     |                                      |
| token              | string                                                                                    | :white_check_mark: | DatoCMS API token to use                                           |                                      |
| variables          | Object                                                                                    | :x:                | GraphQL variables for the query                                    |                                      |
| preview            | boolean                                                                                   | :x:                | If true, the Content Delivery API with draft content will be used  | false                                |
| environment        | string                                                                                    | :x:                | The name of the DatoCMS environment where to perform the query     | defaults to primary environment      |
| initialData        | Object                                                                                    | :x:                | The initial data to use on the first render                        |                                      |
| reconnectionPeriod | number                                                                                    | :x:                | In case of network errors, the period (in ms) to wait to reconnect | 1000                                 |
| fetcher            | a [fetch-like function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)       | :x:                | The fetch function to use to perform the registration query        | window.fetch                         |
| eventSourceClass   | an [EventSource-like](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) class | :x:                | The EventSource class to use to open up the SSE connection         | window.EventSource                   |
| baseUrl            | string                                                                                    | :x:                | The base URL to use to perform the query                           | `https://graphql-listen.datocms.com` |

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

# Progressive/responsive image

`<Image />` is a React component specially designed to work seamlessly with DatoCMS’s [`responsiveImage` GraphQL query](https://www.datocms.com/docs/content-delivery-api/uploads#responsive-images) that optimizes image loading for your sites.

- TypeScript ready;
- Compatible with IE11;
- CSS-in-JS ready;
- Compatible with any GraphQL library (Apollo, graphql-hooks, graphql-request, etc.);
- Usable both client and server side;
- Compatible with vanilla React, Next.js and pretty much any other React-based solution;

![](docs/image-component.gif?raw=true)

## Out-of-the-box features

- Offer WebP version of images for browsers that support the format
- Generate multiple smaller images so smartphones and tablets don’t download desktop-sized images
- Efficiently lazy load images to speed initial page load and save bandwidth
- Use either blur-up or background color techniques to show a preview of the image while it loads
- Hold the image position so your page doesn’t jump while images load

## Usage

1. Import `Image` from `react-datocms` and use it in place of the regular `<img />` tag
2. Write a GraphQL query to your DatoCMS project using the [`responsiveImage` query](https://www.datocms.com/docs/content-delivery-api/images-and-videos#responsive-images)

The GraphQL query returns multiple thumbnails with optimized compression. The `Image` component automatically sets up the “blur-up” effect as well as lazy loading of images further down the screen.

## Example

For a fully working example take a look at our [examples directory](https://github.com/datocms/react-datocms/tree/master/examples).

```js
import React from 'react';
import { Image } from 'react-datocms';

const Page = ({ data }) => (
  <div>
    <h1>{data.blogPost.title}</h1>
    <Image data={data.blogPost.cover.responsiveImage} />
  </div>
);

const query = gql`
  query {
    blogPost {
      title
      cover {
        responsiveImage(
          imgixParams: { fit: crop, w: 300, h: 300, auto: format }
        ) {
          # HTML5 src/srcset/sizes attributes
          srcSet
          webpSrcSet
          sizes
          src

          # size information (post-transformations)
          width
          height
          aspectRatio

          # SEO attributes
          alt
          title

          # background color placeholder or...
          bgColor

          # blur-up placeholder, JPEG format, base64-encoded
          base64
        }
      }
    }
  }
`;

export default withQuery(query)(Page);
```

## Props

| prop                  | type                     | required           | description                                                                                                                                                                                                                                                                                   | default           |
| --------------------- | ------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| data                  | `ResponsiveImage` object | :white_check_mark: | The actual response you get from a DatoCMS `responsiveImage` GraphQL query.                                                                                                                                                                                                                   |                   |
| className             | string                   | :x:                | Additional CSS className for root node                                                                                                                                                                                                                                                        | null              |
| style                 | CSS properties           | :x:                | Additional CSS rules to add to the root node                                                                                                                                                                                                                                                  | null              |
| pictureClassName      | string                   | :x:                | Additional CSS class for the image inside the inner `<picture />` tag                                                                                                                                                                                                                         | null              |
| pictureStyle          | CSS properties           | :x:                | Additional CSS rules to add to the image inside the inner `<picture />` tag                                                                                                                                                                                                                   | null              |
| fadeInDuration        | integer                  | :x:                | Duration (in ms) of the fade-in transition effect upoad image loading                                                                                                                                                                                                                         | 500               |
| intersectionThreshold | float                    | :x:                | Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible. | 0                 |
| intersectionMargin    | string                   | :x:                | Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections.                  | "0px 0px 0px 0px" |
| lazyLoad              | Boolean                  | :x:                | Wheter enable lazy loading or not                                                                                                                                                                                                                                                             | true              |
| explicitWidth         | Boolean                  | :x:                | Wheter the image wrapper should explicitely declare the width of the image or keep it fluid                                                                                                                                                                                                   | false             |

### The `ResponsiveImage` object

The `data` prop expects an object with the same shape as the one returned by `responsiveImage` GraphQL call. It's up to you to make a GraphQL query that will return the properties you need for a specific use of the `<Image>` component.

- The minimum required properties for `data` are: `aspectRatio`, `width`, `sizes`, `srcSet` and `src`;
- `alt` and `title`, while not mandatory, are all highly suggested, so remember to use them!
- You either want to add the `webpSrcSet` field or specify `{ auto: format }` in your `imgixParams`, to automatically use WebP images in browsers that support the format;
- If you provide both the `bgColor` and `base64` property, the latter will take precedence, so just avoiding querying both fields at the same time, it will only make the response bigger :wink:

Here's a complete recap of what `responsiveImage` offers:

| property    | type    | required           | description                                                                                     |
| ----------- | ------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| aspectRatio | float   | :white_check_mark: | The aspect ratio (width/height) of the image                                                    |
| width       | integer | :white_check_mark: | The width of the image                                                                          |
| height      | integer | :white_check_mark: | The height of the image                                                                         |
| sizes       | string  | :white_check_mark: | The HTML5 `sizes` attribute for the image                                                       |
| srcSet      | string  | :white_check_mark: | The HTML5 `srcSet` attribute for the image                                                      |
| src         | string  | :white_check_mark: | The fallback `src` attribute for the image                                                      |
| webpSrcSet  | string  | :x:                | The HTML5 `srcSet` attribute for the image in WebP format, for browsers that support the format |
| alt         | string  | :x:                | Alternate text (`alt`) for the image                                                            |
| title       | string  | :x:                | Title attribute (`title`) for the image                                                         |
| bgColor     | string  | :x:                | The background color for the image placeholder                                                  |
| base64      | string  | :x:                | A base64-encoded thumbnail to offer during image loading                                        |

# Social share, SEO and Favicon meta tags

Just like the image component, `renderMetaTags()` is a helper specially designed to work seamlessly with DatoCMS’s [`_seoMetaTags` and `faviconMetaTags` GraphQL queries](https://www.datocms.com/docs/content-delivery-api/seo) so that you can handle proper SEO in your pages with a simple one-liner.

- TypeScript ready;
- Compatible with any GraphQL library (Apollo, graphql-hooks, graphql-request, etc.);
- Usable both client and server side;
- Compatible with vanilla React, Next.js and pretty much any other React-based solution;

## Usage

`renderMetaTags()` takes an array of `Tag`s in the exact form they're returned by the following [DatoCMS GraphQL API](https://www.datocms.com/docs/content-delivery-api/seo) queries:

- `_seoMetaTags` query on any record, or
- `faviconMetaTags` on the global `_site` object.

You can `concat` multiple array of `Tag`s together and pass them to a single `renderMetaTags()` call.

## Example

For a working example take a look at our [examples directory](https://github.com/datocms/react-datocms/tree/master/examples).

```js
import React from 'react';
import { renderMetaTags } from 'react-datocms';

const Page = ({ data }) => (
  <div>
    <Helmet>{renderMetaTags(data.page.seo.concat(data.site.favicon))}</Helmet>
    <h1>{data.page.title}</h1>
  </div>
);

const query = gql`
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
`;

export default withQuery(query)(Page);
```

# Structured text

`<StructuredText />` is a React component that you can use to render the value contained inside a DatoCMS [Structured Text field type](https://www.datocms.com/docs/structured-text/dast).

## Basic usage

```js
import React from 'react';
import { StructuredText } from 'react-datocms';

const Page = ({ data }) => {
  // data.blogPost.content ->
  // {
  //   value: {
  //     schema: "dast",
  //     document: {
  //       type: "root",
  //       children: [
  //         {
  //           type: "heading",
  //           level: 1,
  //           children: [
  //             {
  //               type: "span",
  //               value: "Hello ",
  //             },
  //             {
  //               type: "span",
  //               marks: ["strong"],
  //               value: "world!",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   },
  // }

  return (
    <div>
      <h1>{data.blogPost.title}</h1>
      <StructuredText data={data.blogPost.content} />
      {/* -> <h1>Hello <strong>world!</strong></h1> */}
    </div>
  );
};

const query = gql`
  query {
    blogPost {
      title
      content {
        value
      }
    }
  }
`;

export default withQuery(query)(Page);
```

## Custom renderers

You can also pass custom renderers for special nodes (inline records, record links and blocks) as an optional parameter like so:

```js
import React from 'react';
import { StructuredText, Image } from 'react-datocms';

const Page = ({ data }) => {
  // data.blogPost.content ->
  // {
  //   value: {
  //     schema: "dast",
  //     document: {
  //       type: "root",
  //       children: [
  //         {
  //           type: "heading",
  //           level: 1,
  //           children: [
  //             { type: "span", value: "Welcome onboard " },
  //             { type: "inlineItem", item: "324321" },
  //           ],
  //         },
  //         {
  //           type: "paragraph",
  //           children: [
  //             { type: "span", value: "So happy to have " },
  //             {
  //               type: "itemLink",
  //               item: "324321",
  //               children: [
  //                 {
  //                   type: "span",
  //                   marks: ["strong"],
  //                   value: "this awesome humang being",
  //                 },
  //               ]
  //             },
  //             { type: "span", value: " in our team!" },
  //           ]
  //         },
  //         { type: "block", item: "1984559" }
  //       ],
  //     },
  //   },
  //   links: [
  //     {
  //       id: "324321",
  //       __typename: "TeamMemberRecord",
  //       firstName: "Mark",
  //       slug: "mark-smith",
  //     },
  //   ],
  //   blocks: [
  //     {
  //       id: "324321",
  //       __typename: "ImageRecord",
  //       image: {
  //         responsiveImage: { ... },
  //       },
  //     },
  //   ],
  // }

  return (
    <div>
      <h1>{data.blogPost.title}</h1>
      <StructuredText
        data={data.blogPost.content}
        renderInlineRecord={({ record }) => {
          switch (record.__typename) {
            case 'TeamMemberRecord':
              return <a href={`/team/${record.slug}`}>{record.firstName}</a>;
            default:
              return null;
          }
        }}
        renderLinkToRecord={({ record, children, transformedMeta }) => {
          switch (record.__typename) {
            case 'TeamMemberRecord':
              return (
                <a {...transformedMeta} href={`/team/${record.slug}`}>
                  {children}
                </a>
              );
            default:
              return null;
          }
        }}
        renderBlock={({ record }) => {
          switch (record.__typename) {
            case 'ImageRecord':
              return <Image data={record.image.responsiveImage} />;
            default:
              return null;
          }
        }}
      />
      {/*
        Final result:

        <h1>Welcome onboard <a href="/team/mark-smith">Mark</a></h1>
        <p>So happy to have <a href="/team/mark-smith">this awesome humang being</a> in our team!</p>
        <img src="https://www.datocms-assets.com/205/1597757278-austin-distel-wd1lrb9oeeo-unsplash.jpg" alt="Our team at work" />
      */}
    </div>
  );
};

const query = gql`
  query {
    blogPost {
      title
      content {
        value
        links {
          __typename
          ... on TeamMemberRecord {
            id
            firstName
            slug
          }
        }
        blocks {
          __typename
          ... on ImageRecord {
            id
            image {
              responsiveImage(
                imgixParams: { fit: crop, w: 300, h: 300, auto: format }
              ) {
                srcSet
                webpSrcSet
                sizes
                src
                width
                height
                aspectRatio
                alt
                title
                base64
              }
            }
          }
        }
      }
    }
  }
`;

export default withQuery(query)(Page);
```

## Override default rendering of nodes

This component automatically renders all nodes except for `inline_item`, `item_link` and `block` using a set of default rules, but you might want to customize those. For example:

For example:

- For `heading` nodes, you might want to add an anchor;
- For `code` nodes, you might want to use a custom sytax highlighting component like [`prism-react-renderer`](https://github.com/FormidableLabs/prism-react-renderer);
- Apply different logic/formatting to a node based on what its parent node is (using the `ancestors` parameter)

- For all possible node types, refer to the [list of typeguard functions defined in the main `structured-text` package](https://github.com/datocms/structured-text/tree/main/packages/utils#typescript-type-guards). The [DAST format documentation](https://www.datocms.com/docs/structured-text/dast) has additional details.

In this case, you can easily override default rendering rules with the `customRules` prop.

```jsx
import { renderRule, StructuredText } from 'react-datocms';
import { isHeading, isCode } from 'datocms-structured-text-utils';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import SyntaxHighlight from 'components/SyntaxHighlight';

<StructuredText
  data={data.blogPost.content}
  customRules={[
    
    // Add HTML anchors to heading levels for in-page navigation
    renderRule(isHeading, ({ node, children, key }) => {
      const HeadingTag = `h${node.level}`;
      const anchor = toPlainText(node)
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

      return (
        <HeadingTag key={key}>
          {children} <a id={anchor} />
          <a href={`#${anchor}`} />
        </HeadingTag>
      );
    }),
    
    // Use a custom syntax highlighter component for code blocks
    renderRule(isCode, ({ node, key }) => {
      return (
        <SyntaxHighlight
          key={key}
          code={node.code}
          language={node.language}
          linesToBeHighlighted={node.highlight}
        />
      );
    }),
    
    // Apply different formatting to top-level paragraphs
    renderRule(
      isParagraph,
      ({ adapter: { renderNode }, node, children, key, ancestors }) => {
        if (isRoot(ancestors[0])) {
          // If this paragraph node is a top-level one, give it a special class
          return renderNode('p', { key, className: 'top-level-paragraph-container-example' }, children);
        } else {
          // Proceed with default paragraph rendering...
          // return renderNode('p', { key }, children);

          // Or even completely remove the paragraph and directly render the inner children:
          return children;
        }
      }
    )
    
 
  ]}
/>;
```

Note: if you override the rules for `inline_item`, `item_link` or `block` nodes, then the `renderInlineRecord`, `renderLinkToRecord` and `renderBlock` props won't be considered!

## Props

| prop               | type                                                            | required                                              | description                                                                                      | default                                                                                                              |
| ------------------ | --------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| data               | `StructuredTextGraphQlResponse \| DastNode`                     | :white_check_mark:                                    | The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from DatoCMS |                                                                                                                      |
| renderInlineRecord | `({ record }) => ReactElement \| null`                          | Only required if document contains `inlineItem` nodes | Convert an `inlineItem` DAST node into React                                                     | `[]`                                                                                                                 |
| renderLinkToRecord | `({ record, children }) => ReactElement \| null`                | Only required if document contains `itemLink` nodes   | Convert an `itemLink` DAST node into React                                                       | `null`                                                                                                               |
| renderBlock        | `({ record }) => ReactElement \| null`                          | Only required if document contains `block` nodes      | Convert a `block` DAST node into React                                                           | `null`                                                                                                               |
| metaTransformer    | `({ node, meta }) => Object \| null`                            | :x:                                                   | Transform `link` and `itemLink` meta property into HTML props                                    | [See function](https://github.com/datocms/structured-text/blob/main/packages/generic-html-renderer/src/index.ts#L61) |
| customRules        | `Array<RenderRule>`                                             | :x:                                                   | Customize how document is converted in JSX (use `renderRule()` to generate)                      | `null`                                                                                                               |
| renderText         | `(text: string, key: string) => ReactElement \| string \| null` | :x:                                                   | Convert a simple string text into React                                                          | `(text) => text`                                                                                                     |
