# react-datocms [![Build Status](https://travis-ci.org/datocms/react-datocms.svg?branch=master)](https://travis-ci.org/datocms/react-datocms)

A set of components and utilities to work faster with DatoCMS in React environments. Compatible with any GraphQL library (Apollo, graphql-hooks, graphql-request, etc.)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Demo](#demo)
- [Installation](#installation)
- [Progressive/responsive image loading](#progressiveresponsive-image-loading)
  - [Out-of-the-box features](#out-of-the-box-features)
  - [Usage](#usage)
  - [Example](#example)
- [SEO and favicons](#seo-and-favicons)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Demo

[https://react-datocms-example.netlify.com/](https://react-datocms-example.netlify.com/)

## Installation

```
npm install react-datocms
```

## Progressive/responsive image loading

`<Image />` is a React component specially designed to work seamlessly with DatoCMS’s GraphQL queries that completely optimizes image loading for your sites.

### Out-of-the-box features

* Resize large images to the size needed by your design
* Generate multiple smaller images so smartphones and tablets don’t download desktop-sized images
* Strip all unnecessary metadata and optimize JPEG and PNG compression
* Efficiently lazy load images to speed initial page load and save bandwidth
* Use the [blur-up technique](https://css-tricks.com/the-blur-up-technique-for-loading-background-images/) to show a preview of the image while it loads
* Hold the image position so your page doesn’t jump while images load

### Usage

1. Import `Image` from `react-datocms` and use it in place of the built-in `img` tag
2. Write a GraphQL query to your DatoCMS project using the [`responsiveImage` query](https://www.datocms.com/docs/qualcosa)

The GraphQL query returns multiple thumbnails with optimized compression. The `Image` component automatically sets up the “blur-up” effect as well as lazy loading of images further down the screen.

### Example

```js
import React from "react"
import { Image } from "react-datocms"

export default ({ data }) => (
  <div>
    <h1>{data.blogPost.title}</h1>
    <Image data={data.blogPost.cover.responsiveImage} />
  </div>
)

export const query = graphql`
  query {
    blogPost {
      title
      cover {
        responsiveImage(imgixParams: { fit: crop, w: 300, h: 300 }) {
          aspectRatio
          base64
          height
          sizes
          src
          srcSet
          width
          alt
          title
        }
      }
    }
  }
`
```

For a complete example take a look at our [examples directory](https://github.com/datocms/react-datocms/tree/master/examples).

## SEO and favicons


