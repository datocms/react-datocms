


# Structured text

`<StructuredText />` is a React component that you can use to render the value contained inside a DatoCMS [Structured Text field type](https://www.datocms.com/docs/structured-text/dast).

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Custom renderers for inline records, blocks, and links](#custom-renderers-for-inline-records-blocks-and-links)
- [Override default rendering of nodes](#override-default-rendering-of-nodes)
- [Props](#props)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Installation

```
npm install --save react-datocms
```

## Basic usage

```js
import React from 'react';
import { StructuredText } from 'react-datocms';

const Page = ({ data }) => {
  // data.blogPost.content = {
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

## Custom renderers for inline records, blocks, and links

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

In this case, you can easily override default rendering rules with the `customNodeRules` and `customMarkRules` props.

```jsx
import { renderNodeRule, renderMarkRule, StructuredText } from 'react-datocms';
import { isHeading, isCode } from 'datocms-structured-text-utils';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import SyntaxHighlight from 'components/SyntaxHighlight';

<StructuredText
  data={data.blogPost.content}
  customNodeRules={[
    // Add HTML anchors to heading levels for in-page navigation
    renderNodeRule(isHeading, ({ node, children, key }) => {
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
    renderNodeRule(isCode, ({ node, key }) => {
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
    renderNodeRule(
      isParagraph,
      ({ adapter: { renderNode }, node, children, key, ancestors }) => {
        if (isRoot(ancestors[0])) {
          // If this paragraph node is a top-level one, give it a special class
          return renderNode(
            'p',
            { key, className: 'top-level-paragraph-container-example' },
            children,
          );
        } else {
          // Proceed with default paragraph rendering...
          // return renderNode('p', { key }, children);

          // Or even completely remove the paragraph and directly render the inner children:
          return <React.Fragment key={key}>{children}</React.Fragment>;
        }
      },
    ),
  ]}
  customMarkRules={[
    // convert "strong" marks into <b> tags
    renderMarkRule('strong', ({ mark, children, key }) => {
      return <b key={key}>{children}</b>;
    }),
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
| customNodeRules    | `Array<RenderRule>`                                             | :x:                                                   | Customize how nodes are converted in JSX (use `renderNodeRule()` to generate rules)              | `null`                                                                                                               |
| customMarkRules    | `Array<RenderMarkRule>`                                         | :x:                                                   | Customize how marks are converted in JSX (use `renderMarkRule()` to generate rules)              | `null`                                                                                                               |
| renderText         | `(text: string, key: string) => ReactElement \| string \| null` | :x:                                                   | Convert a simple string text into React                                                          | `(text) => text`                                                                                                     |
