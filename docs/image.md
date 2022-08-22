

# `<Image/>` component for progressive/responsive images

`<Image />` is a React component specially designed to work seamlessly with DatoCMS’s [`responsiveImage` GraphQL query](https://www.datocms.com/docs/content-delivery-api/uploads#responsive-images) that optimizes image loading for your sites.

- TypeScript ready;
- CSS-in-JS ready;
- Usable both client and server side;
- Compatible with vanilla React, Next.js and pretty much any other React-based solution;

![](docs/image-component.gif?raw=true)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Out-of-the-box features](#out-of-the-box-features)
- [Installation](#installation)
- [Intersection Observer](#intersection-observer)
- [Usage](#usage)
- [Example](#example)
- [Props](#props)
  - [Layout mode](#layout-mode)
  - [The `ResponsiveImage` object](#the-responsiveimage-object)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Out-of-the-box features

- Offers WebP version of images for browsers that support the format
- Generates multiple smaller images so smartphones and tablets don’t download desktop-sized images
- Efficiently lazy loads images to speed initial page load and save bandwidth
- Holds the image position so your page doesn’t jump while images load
- Uses either blur-up or background color techniques to show a preview of the image while it loads

## Installation

```
npm install --save react-datocms
```

## Intersection Observer

Intersection Observer is the API used to determine if the image is inside the viewport or not. [Browser support is really good](https://caniuse.com/intersectionobserver) - With Safari adding support in 12.1, all major browsers now support Intersection Observers natively.

If the IntersectionObserver object is not available, the component treats the image as it's always visible in the viewport. Feel free to add a [polyfill](https://www.npmjs.com/package/intersection-observer) so that it will also 100% work on older versions of iOS and IE11.

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

| prop                  | type                                             | required           | description                                                                                                                                                                                                                                                                                   | default           |
| --------------------- | ------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| data                  | `ResponsiveImage` object                         | :white_check_mark: | The actual response you get from a DatoCMS `responsiveImage` GraphQL query                                                                                                                                                                                                                    |                   |
| layout                | 'intrinsic' \| 'fixed' \| 'responsive' \| 'fill' | :x:                | The layout behavior of the image as the viewport changes size                                                                                                                                                                                                                                 | "intrinsic"       |
| className             | string                                           | :x:                | Additional CSS className for root node                                                                                                                                                                                                                                                        | null              |
| style                 | CSS properties                                   | :x:                | Additional CSS rules to add to the root node                                                                                                                                                                                                                                                  | null              |
| pictureClassName      | string                                           | :x:                | Additional CSS class for the image inside the inner `<picture />` tag                                                                                                                                                                                                                         | null              |
| pictureStyle          | CSS properties                                   | :x:                | Additional CSS rules to add to the image inside the inner `<picture />` tag                                                                                                                                                                                                                   | null              |
| fadeInDuration        | integer                                          | :x:                | Duration (in ms) of the fade-in transition effect upoad image loading                                                                                                                                                                                                                         | 500               |
| intersectionThreshold | float                                            | :x:                | Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible. | 0                 |
| intersectionMargin    | string                                           | :x:                | Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections.                  | "0px 0px 0px 0px" |
| lazyLoad              | Boolean                                          | :x:                | Whether enable lazy loading or not                                                                                                                                                                                                                                                            | true              |
| onLoad                | () => void                                       | :x:                | Function triggered when the image has finished loading                                                                                                                                                                                                                                        | undefined         |
| usePlaceholder        | Boolean                                          | :x:                | Whether the component should use a blurred image placeholder                                                                                                                                                                                                                                  | true              |

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
