# Image components for progressive/responsive images

`<SRCImage />` and `<Image />` are React components specifically designed to work flawlessly with DatoCMS's [`responsiveImage` GraphQL query](https://www.datocms.com/docs/content-delivery-api/uploads#responsive-images) which optimizes image loading for your websites.

- TypeScript ready;
- CSS-in-JS ready;
- Usable both client and server side;
- Compatible with vanilla React, Next.js and pretty much any other React-based solution;

## Out-of-the-box features

- Offers optimized version of images for browsers that support WebP/AVIF format
- Generates multiple smaller images so smartphones and tablets don’t download desktop-sized images
- Efficiently lazy loads images to speed initial page load and save bandwidth
- Holds the image position so your page doesn’t jump while images load
- Uses either blur-up or background color techniques to show a preview of the image while it loads

![](docs/image-component.gif?raw=true)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [`<SRCImage />` vs `<Image />`](#srcimage--vs-image-)
- [Usage](#usage)
- [Example](#example)
- [`<SRCImage>` Props](#srcimage-props)
- [`<Image>` Props](#image-props)
  - [Layout mode](#layout-mode)
  - [The `ResponsiveImage` object](#the-responsiveimage-object)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Installation

```
npm install --save react-datocms
```

## `<SRCImage />` vs `<Image />`

Even though their purpose is the same, there are some significant differences between these two components. Depending on your specific needs, you can choose to use one or the other:

* `<SRCImage />` is a [React Server Component](https://nextjs.org/docs/app/building-your-application/rendering/server-components), so it can be rendered and optionally cached on the server. It doesn't create any JS footprint. It generates a single `<picture />` element and implements lazy-loading using the native [`loading="lazy"` attribute](https://web.dev/articles/browser-level-image-lazy-loading). The placeholder is set as the background to the image itself. Be careful: the placeholder is not removed when the image loads, so it's not recommended to use this component if you anticipate that the image may have an alpha channel with transparencies.
* `<Image />` is a [Client Component](https://nextjs.org/docs/app/building-your-application/rendering/client-components). Since it runs on the browser, it has the ability to set a cross-fade effect between the placeholder and the original image, but at the cost of generating more complex HTML output composed of multiple elements around the main `<picture />` element. It also implements lazy-loading through `IntersectionObserver`, which allows customization of the thresholds at which lazy loading occurs.


## Usage

1. Import `Image` or `SRCImage` from `react-datocms` and use it in place of a regular `<img />` tag
2. Write a GraphQL query to your DatoCMS project using the [`responsiveImage` query](https://www.datocms.com/docs/content-delivery-api/images-and-videos#responsive-images)

The GraphQL query returns multiple thumbnails with optimized compression. The image components automatically set up the “blur-up” effect as well as lazy loading of images further down the screen.

## Example

For a fully working example take a look at our [examples directory](https://github.com/datocms/react-datocms/tree/master/examples).

```jsx
import React from 'react';
import { Image, SRCImage } from 'react-datocms';

const Page = ({ data }) => (
  <div>
    <h1>{data.blogPost.title}</h1>
    {/* uses native loading="lazy" */}
    <SRCImage data={data.blogPost.cover.responsiveImage} />
    {/* custom lazy-loading via IntersectionObserver */}
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
          # always required
          src
          srcSet
          width
          height

          # not required, but strongly suggested!
          alt
          title

          # blur-up placeholder, JPEG format, base64-encoded, or...
          base64
          # background color placeholder
          bgColor

          # you can omit `sizes` if you explicitly pass the `sizes` prop to the image component
          sizes
        }
      }
    }
  }
`;

export default withQuery(query)(Page);
```

## `<SRCImage>` Props

| prop             | type                     | required           | description                                                                                                                                          | default                            |
| ---------------- | ------------------------ | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| data             | `ResponsiveImage` object | :white_check_mark: | The actual response you get from a DatoCMS `responsiveImage` GraphQL query                            ****                                           |                                    |
| className        | string                   | :x:                | Additional className for image                                                                                                                       | null                               |
| style            | CSS properties           | :x:                | Additional CSS rules to add to the image                                                                                                             | null                               |
| priority         | Boolean                  | :x:                | Disables lazy loading, and sets the image [fetchPriority](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority) to "high" | false                              |
| sizes            | string                   | :x:                | The HTML5 [`sizes`](https://web.dev/learn/design/responsive-images/#sizes) attribute for the image (will be used `data.sizes` as a fallback)         | undefined                          |
| usePlaceholder   | Boolean                  | :x:                | Whether the image should use a blurred image placeholder                                                                                             | true                               |
| srcSetCandidates | Array<number>            | :x:                | If `data` does not contain `srcSet`, the candidates for the `srcset` attribute of the image will be auto-generated based on these width multipliers  | [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4] |

## `<Image>` Props

| prop                  | type                                             | required           | description                                                                                                                                                                                                                                                                                   | default                            |
| --------------------- | ------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| data                  | `ResponsiveImage` object                         | :white_check_mark: | The actual response you get from a DatoCMS `responsiveImage` GraphQL query                                                                                                                                                                                                                    |                                    |
| layout                | 'intrinsic' \| 'fixed' \| 'responsive' \| 'fill' | :x:                | The layout behavior of the image as the viewport changes size                                                                                                                                                                                                                                 | "intrinsic"                        |
| fadeInDuration        | integer                                          | :x:                | Duration (in ms) of the fade-in transition effect upon image loading                                                                                                                                                                                                                          | 500                                |
| intersectionThreshold | float                                            | :x:                | Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible. | 0                                  |
| intersectionMargin    | string                                           | :x:                | Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections.                  | "0px 0px 0px 0px"                  |
| priority              | Boolean                                          | :x:                | Disables lazy loading, and sets the image [fetchPriority](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority) to "high"                                                                                                                                          | false                              |
| sizes                 | string                                           | :x:                | The HTML5 [`sizes`](https://web.dev/learn/design/responsive-images/#sizes) attribute for the image (will be used `data.sizes` as a fallback)                                                                                                                                                  | undefined                          |
| onLoad                | () => void                                       | :x:                | Function triggered when the image has finished loading                                                                                                                                                                                                                                        | undefined                          |
| usePlaceholder        | Boolean                                          | :x:                | Whether the component should use a blurred image placeholder                                                                                                                                                                                                                                  | true                               |
| srcSetCandidates      | Array<number>                                    | :x:                | If `data` does not contain `srcSet`, the candidates for the `srcset` attribute of the image will be auto-generated based on these width multipliers                                                                                                                                           | [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4] |
| className             | string                                           | :x:                | Additional CSS className for root node                                                                                                                                                                                                                                                        | null                               |
| style                 | CSS properties                                   | :x:                | Additional CSS rules to add to the root node                                                                                                                                                                                                                                                  | null                               |
| pictureClassName      | string                                           | :x:                | Additional CSS class for the image inside the inner `<picture />` tag                                                                                                                                                                                                                         | null                               |
| pictureStyle          | CSS properties                                   | :x:                | Additional CSS rules to add to the image inside the inner `<picture />` tag                                                                                                                                                                                                                   | null                               |
| placeholderClassName  | string                                           | :x:                | Additional CSS class for the placeholder image                                                                                                                                                                                                                                                | null                               |
| placeholderStyle      | CSS properties                                   | :x:                | Additional CSS rules for the placeholder image                                                                                                                                                                                                                                                | null                               |

### Layout mode

With the `layout` property, you can configure the behavior of the image as the viewport changes size:

- When `intrinsic` (default behaviour), the image will scale the dimensions down for smaller viewports, but maintain the original dimensions for larger viewports.
- When `fixed`, the image dimensions will not change as the viewport changes (no responsiveness) similar to the native `img` element.
- When `responsive`, the image will scale the dimensions down for smaller viewports and scale up for larger viewports.
- When `fill`, the image will stretch both width and height to the dimensions of the parent element, provided the parent element is relative.
  - This is usually paired with the `objectFit` and `objectPosition` properties.
  - Ensure the parent element has `position: relative` in their stylesheet.

Example for `layout="fill"` (useful also for background images):

```jsx
<div style={{ position: 'relative', width: 200, height: 500 }}>
  <Image
    data={imageData}
    layout="fill"
    objectFit="cover"
    objectPosition="50% 50%"
  />
</div>
```

### The `ResponsiveImage` object

The `data` prop expects an object with the same shape as the one returned by `responsiveImage` GraphQL call. It's up to you to make a GraphQL query that will return the properties you need for a specific use of the `<Image>` component.

- The minimum required properties for `data` are: `src`, `width` and `height`;
- `alt` and `title`, while not mandatory, are all highly suggested, so remember to use them!
- If you don't request `srcSet`, the component will auto-generate an `srcset` based on `src` + the `srcSetCandidates` prop (it can help reducing the GraphQL response size drammatically when many images are returned);
- We strongly to suggest to always specify [`{ auto: format }`](https://docs.imgix.com/apis/rendering/auto/auto#format) in your `imgixParams`, instead of requesting `webpSrcSet`, so that you can also take advantage of more performant optimizations (AVIF), without increasing GraphQL response size;
- If you request both the `bgColor` and `base64` property, the latter will take precedence, so just avoid querying both fields at the same time, as it will only make the GraphQL response bigger :wink:;
- You can avoid requesting `sizes` and directly pass a `sizes` prop to the component to reduce the GraphQL response size;

Here's a complete recap of what `responsiveImage` offers:

| property   | type    | required           | description                                                                                                                                                                                    |
| ---------- | ------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| src        | string  | :white_check_mark: | The `src` attribute for the image                                                                                                                                                              |
| width      | integer | :white_check_mark: | The width of the image                                                                                                                                                                         |
| height     | integer | :white_check_mark: | The height of the image                                                                                                                                                                        |
| alt        | string  | :x:                | Alternate text (`alt`) for the image (not required, but strongly suggested!)                                                                                                                   |
| title      | string  | :x:                | Title attribute (`title`) for the image (not required, but strongly suggested!)                                                                                                                |
| sizes      | string  | :x:                | The HTML5 `sizes` attribute for the image (omit it if you're already passing a `sizes` prop to the Image component)                                                                            |
| base64     | string  | :x:                | A base64-encoded thumbnail to offer during image loading                                                                                                                                       |
| bgColor    | string  | :x:                | The background color for the image placeholder (omit it if you're already requesting `base64`)                                                                                                 |
| srcSet     | string  | :x:                | The HTML5 `srcSet` attribute for the image (can be omitted, the Image component knows how to build it based on `src`)                                                                          |
| webpSrcSet | string  | :x:                | The HTML5 `srcSet` attribute for the image in WebP format (deprecated, it's better to use the [`auto=format`](https://docs.imgix.com/apis/rendering/auto/auto#format) Imgix transform instead) |
