# react-datocms

![MIT](https://img.shields.io/npm/l/react-datocms?style=for-the-badge) ![MIT](https://img.shields.io/npm/v/react-datocms?style=for-the-badge) [![Build Status](https://img.shields.io/travis/datocms/react-datocms?style=for-the-badge)](https://travis-ci.org/datocms/react-datocms)

A set of components and utilities to work faster with [DatoCMS](https://www.datocms.com/) in React environments. Integrates seamlessy with [DatoCMS's GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api).

- TypeScript ready;
- CSS-in-JS ready;
- Compatible with any GraphQL library (Apollo, graphql-hooks, graphql-request, etc.);
- Usable both client and server side;
- Compatible with vanilla React, Next.js and pretty much any other React-based solution;

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Demos](#demos)
- [Installation](#installation)
- [Progressive/responsive image](#progressiveresponsive-image)
  - [Out-of-the-box features](#out-of-the-box-features)
  - [Usage](#usage)
  - [Example](#example)
  - [Props](#props)
    - [The `ResponsiveImage` object](#the-responsiveimage-object)
- [Social share, SEO and Favicon meta tags](#social-share-seo-and-favicon-meta-tags)
  - [Usage](#usage-1)
  - [Example](#example-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Demos

* Pure React: [https://react-datocms-example.netlify.com/](https://react-datocms-example.netlify.com/)
* Server side rendering with Next.js: [https://with-next-typescript.stefanoverna.now.sh/](https://with-next-typescript.stefanoverna.now.sh/)

## Installation

```
npm install react-datocms
```

## Progressive/responsive image

`<Image />` is a React component specially designed to work seamlessly with DatoCMS’s [`responsiveImage` GraphQL query](https://www.datocms.com/docs/content-delivery-api/uploads#responsive-images) that optimizes image loading for your sites.

![](docs/image-component.gif?raw=true)

### Out-of-the-box features

* Offer WebP version of images for browsers that support the format
* Generate multiple smaller images so smartphones and tablets don’t download desktop-sized images
* Efficiently lazy load images to speed initial page load and save bandwidth
* Use either blur-up or background color techniques to show a preview of the image while it loads
* Hold the image position so your page doesn’t jump while images load

### Usage

1. Import `Image` from `react-datocms` and use it in place of the regular `<img />` tag
2. Write a GraphQL query to your DatoCMS project using the [`responsiveImage` query](https://www.datocms.com/docs/qualcosa)

The GraphQL query returns multiple thumbnails with optimized compression. The `Image` component automatically sets up the “blur-up” effect as well as lazy loading of images further down the screen.

### Example

For a fully working example take a look at our [examples directory](https://github.com/datocms/react-datocms/tree/master/examples).

```js
import React from "react"
import { Image } from "react-datocms"

const Page = ({ data }) => (
  <div>
    <h1>{data.blogPost.title}</h1>
    <Image data={data.blogPost.cover.responsiveImage} />
  </div>
)

const query = gql`
  query {
    blogPost {
      title
      cover {
        responsiveImage(imgixParams: { fit: crop, w: 300, h: 300, auto: format }) {

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
`

export default withQuery(query)(Page);
```

### Props

| prop                 | type                     | default           | required           | description                                                                                                                                                                                                                                                                                   |
| -------------------- | ------------------------ | ----------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data                 | `ResponsiveImage` object |                   | :white_check_mark: | The actual response you get from a DatoCMS `responsiveImage` GraphQL query.                                                                                                                                                                                                                   |
| className            | string                   | null              | :x:                | Additional CSS class of root node                                                                                                                                                                                                                                                             |
| style                | CSS properties           | null              | :x:                | Additional CSS rules to add to the root node                                                                                                                                                                                                                                                             |
| pictureClassName     | string                   | null              | :x:                | Additional CSS class for the inner `<picture />` tag                                                                                                                                                                                                                                          |
| pictureStyle         | CSS properties           | null              | :x:                | Additional CSS rules to add to the inner `<picture />` tag                                                                                                                                                                                                                                       |
| fadeInDuration       | integer                  | 500               | :x:                | Duration (in ms) of the fade-in transition effect upoad image loading                                                                                                                                                                                                                         |
| intersectionTreshold | float                    | 0                 | :x:                | Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible. |
| intersectionMargin   | string                   | "0px 0px 0px 0px" | :x:                | Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections.                  |
| lazyLoad             | Boolean                  | true              | :x:                | Wheter enable lazy loading or not                                                                                                                                                                                                                                                             |

#### The `ResponsiveImage` object

The `data` prop expects an object with the same shape as the one returned by `responsiveImage` GraphQL call. It's up to you to make a GraphQL query that will return the properties you need for a specific use of the `<Image>` component.

* The mimumum required properties for `data` are: `aspectRatio`, `width`, `sizes`, `srcSet` and `src`;
* `alt` and `title`, while not mandatory, are all highly suggested, so remember to use them!
* You either want to add the `webpSrcSet` field or specify `{ auto: format }` in your `imgixParams`, to automatically use WebP images in browsers that support the format;
* If you provide both the `bgColor` and `base64` property, the latter will take precedence, so just avoiding querying both fields at the same time, it will only make the response bigger :wink:

Here's a complete recap of what `responsiveImage` offers:

| property    | type    | required           | description                                                                                     |
| ----------- | ------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| aspectRatio | float   | :white_check_mark: | The aspect ratio (width/height) of the image                                                    |
| width       | integer | :white_check_mark: | The width of the image                                                                          |
| sizes       | string  | :white_check_mark: | The HTML5 `sizes` attribute for the image                                                       |
| srcSet      | string  | :white_check_mark: | The HTML5 `srcSet` attribute for the image                                                      |
| src         | string  | :white_check_mark: | The fallback `src` attribute for the image                                                      |
| webpSrcSet  | string  | :x:                | The HTML5 `srcSet` attribute for the image in WebP format, for browsers that support the format |
| alt         | string  | :x:                | Alternate text (`alt`) for the image                                                            |
| title       | string  | :x:                | Title attribute (`title`) for the image                                                         |
| bgColor     | string  | :x:                | The background color for the image placeholder                                                  |
| base64      | string  | :x:                | A base64-encoded thumbnail to offer during image loading                                        |

## Social share, SEO and Favicon meta tags

Just like the image component, `renderMetaTags()` is a helper specially designed to work seamlessly with DatoCMS’s [`_seoMetaTags` and `faviconMetaTags` GraphQL queries](https://www.datocms.com/docs/content-delivery-api/seo) so that you can handle proper SEO in your pages with a simple one-liner.

### Usage

`renderMetaTags()` takes an array of `Tag`s in the exact form they're returned by the following [DatoCMS GraphQL API](https://www.datocms.com/docs/content-delivery-api/seo) queries:

* `_seoMetaTags` query on any record, or
* `faviconMetaTags` on the global `_site` object.

You can `concat` multiple array of `Tag`s together and pass them to a single `renderMetaTags()` call.

### Example

For a working example take a look at our [examples directory](https://github.com/datocms/react-datocms/tree/master/examples).

```js
import React from "react"
import { renderMetaTags } from "react-datocms"

const Page = ({ data }) => (
  <div>
    <Helmet>
      {renderMetaTags(data.page.seo.concat(data.site.favicon))}
    </Helmet>
    <h1>{data.page.title}</h1>
  </div>
)

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
`

export default withQuery(query)(Page);
```
