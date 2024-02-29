# `<VideoPlayer/>` component for easy video integration.

`<VideoPlayer />` is a React component specially designed to work seamlessly with DatoCMS’s [`video` GraphQL query](https://www.datocms.com/docs/content-delivery-api/images-and-videos#videos) that optimizes video streaming for your sites.

To stream videos, DatoCMS partners with MUX, a video CDN that serves optimized streams to your users. Our component is a wrapper over MUX's video player for React. It takes care of the details for you, and this is our recommended way to serve optimal videos to your users.

## Out-of-the-box features

- Offers optimized streaming so smartphones and tablets don’t request desktop-sized videos
- Lazy loads the video component and the video to be played to speed initial page load and save bandwidth
- Holds the video position and size so your page doesn’t jump while the player loads
- Uses blur-up technique to show a placeholder of the video while it loads

## Installation

```
npm install --save react-datocms @mux/mux-player-react
```

`@mux/mux-player-react` is a [peer dependency](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies) for `react-datocms`: so you're expected to add it in your project.

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
          # required: this field identifies the video to be played
          muxPlaybackId

          # all the other fields are not required but:

          # if provided, title is displayed in the upper left corner of the video
          title

          # if provided, width and height are used to define the aspect ratio of the
          # player, so to avoid layout jumps during the rendering.
          width
          height

          # if provided, it shows a blurred placeholder for the video
          blurUpThumb

          # you can include more data here: they will be ignored by the component
        }
      }
    }
  }
`;

export default withQuery(query)(Page);
```

## Props

The `<VideoPlayer />` components supports all [the properties made
available](https://github.com/muxinc/elements/blob/main/packages/mux-player-react/REFERENCE.md)
for `<MuxPlayer />` component from `@mux/mux-player-react` package plus `data`,
which is meant to receive data directly in the shape they are provided by
DatoCMS GraphQL API.

`<Video Player />` uses the `data` prop to generate a set of props for the inner
`<MuxPlayer />`. On this topic, also see the "Advanced usage" section below.

| prop | type           | required           | description                                                      | default |
| ---- | -------------- | ------------------ | ---------------------------------------------------------------- | ------- |
| data | `Video` object | :white_check_mark: | The actual response you get from a DatoCMS `video` GraphQL query |         |

Compared to the `<MuxPlayer />`, **some prop default values are different** on `<VideoPlayer />`

- `disableCookies` is normally true, unless you explicitly set the prop to `false`
- `preload` defaults to `metadata`, for an optimal UX experience together with saved bandwidth
- the video height and width, when available in the `data` props, are used to set `{ aspectRatio: "[width] / [height]"}` for the `<MuxPlayer />`'s `style`

All the other props are forwarded to the `<MuxPlayer />` component that is used internally.

## Advanced usage: the `useVideoPlayer` hook

Even though we try our best to make the `<VideoPlayer />` suitable and easy to use for most normal use cases, there are situations where you may need to leverage the `<MuxPlayer />` directly (let's suppose you wrote your special wrapper component around the `<MuxPlayer />` and you need a bunch of props to pass). If that's the case, fill free to use the hook we provide: `useVideoPlayer`.

`useVideoPlayer` takes data coming in the shape they are produced from DatoCMS API and return props that you can pass to the `<MuxPlayer />` component. That's pretty much what the `<VideoPlayer />` does internally.

### Example

```
import { useVideoPlayer } from 'react-datocms';

const data = {
  muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
  title: 'Title',
  width: 1080,
  height: 1920,
  blurUpThumb:
    'data:image/bmp;base64,Qk0eAAAAAAAAABoAAAAMAAAAAQABAAEAGAAAAP8A',
};

// `props` is the following object:
//
//     {
//        playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
//        title: 'Title',
//        style: {
//          aspectRatio: '1080 / 1920',
//        },
//        placeholder:
//          'data:image/bmp;base64,Qk0eAAAAAAAAABoAAAAMAAAAAQABAAEAGAAAAP8A',
//      }
const props = useVideoPlayer({ data });

<MuxPlayer {...props} />
```
