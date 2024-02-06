# `<VideoPlayer/>` component for easygoing videos.

`<VideoPlayer />` is a React component specially designed to work seamlessly with DatoCMS’s [`video` GraphQL query](https://www.datocms.com/docs/content-delivery-api/images-and-videos#videos) that optimizes video streaming for your sites.

## Out-of-the-box features

- Offers optimized streaming so smartphones and tablets don’t request desktop-sized videos
- Lazy loads the video component and the video to be played to speed initial page load and save bandwidth
- Holds the video position so your page doesn’t jump while the player loads
- Uses blur-up technique to show a placeholder of the video while it loads

## Installation

```
npm install --save react-datocms @mux/mux-player-react
```

`@mux/mux-player-react` is peer dependency for `react-datocms`: so you're expected to install it on your project.

## Usage

1. Import `VideoPlayer` from `react-datocms` and use it in your app
2. Write a GraphQL query to your DatoCMS project using the [`video` query](https://www.datocms.com/docs/content-delivery-api/images-and-videos#videos)

The GraphQL query returns data that the `VideoPlayer` component automatically uses to properly size the player, set up a “blur-up” placeholder as well as lazy loading the video.

## Example

For a fully working example take a look at our [examples directory](https://github.com/datocms/react-datocms/tree/master/examples).

```js
import React from 'react';
import { VideoPlayer } from 'react-datocms';

const Page = ({ data }) => (
  <div>
    <h1>{data.blogPost.title}</h1>
    <VideoPlayer data={data.blogPost.cover.video} />
  </div>
);

const query = gql`
  query {
    blogPost {
      title
      cover {
        video {
          # required: it's the field that identifies the video to be played
          muxPlaybackId

          # the following fields are not required but:

          # if provided, title is displayed in the upper left corner of the video
          title

          # if provided, width and height are used to define the aspect ratio of the
          # player, so to avoid layout jumps during the rendering.
          width
          height

          # if provided, it shows a blurred placeholder for the video
          blurUpThumb
        }
      }
    }
  }
`;

export default withQuery(query)(Page);
```

## Props

The `<VideoPlayer />` components supports all the properties made available for
`<MuxPlayer />` component from `@mux/mux-player-react` package plus `data`, that is meant to 
pass data directly in shape they are provided by DatCMS GraphQL API.

| prop | type           | required           | description                                                      | default |
| ---- | -------------- | ------------------ | ---------------------------------------------------------------- | ------- |
| data | `Video` object | :white_check_mark: | The actual response you get from a DatoCMS `video` GraphQL query |         |

Compared to the `<MuxPlayer />`, some prop default values are different on `<VideoPlayer />`

- `disableCookies` is normally true, unless you explicitly set the prop to `false`
- the video height and width, when available in the `data` props, are used to set `{ aspectRatio: "[width] / [height]"}` for the `<MuxPlayer />`'s `style`

All the other props are forwarded to the `<MuxPlayer />` component that is used internally.