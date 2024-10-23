"use client";

// This file defines a React component that easily displays a video player using
// data stored on DatoCMS and retrieved via DatoCMS GraphQL API. The component
// is a thin wrapper around the [React component made available by MUX][1].
//
// The React player written by MUX is an adapter for a web component.
//
// [1]: https://www.mux.com/player

import React, { forwardRef } from "react";

// We use and extend Typescript types defined in the MUX player.

import type MuxPlayerElement from "@mux/mux-player";
import type { MuxPlayerProps } from "@mux/mux-player-react";

// React MUX player is made available in two flavours: eager and lazy loaded. We
// choose to use the eager loading version as the default approch, but
// we also provide a lazy loading version..

import MuxPlayer from "@mux/mux-player-react";

// The core of this component is the `useVideoPlayer` hook: it takes
// data from DatoCMS GraphQL API and returns props as expected by the
// `<MuxPlayer />` component.

import { useVideoPlayer } from "../useVideoPlayer/index.js";

type Maybe<T> = T | null;
type Possibly<T> = Maybe<T> | undefined;

// `Video` represents a fragment of data regarding a video as returned from
// DatoCMS GraphQL API.

export type Video = {
  /** Title attribute (`title`) for the video */
  title?: Possibly<string>;
  /** The height of the video */
  height?: Possibly<number>;
  /** The width of the video */
  width?: Possibly<number>;
  /** The MUX playbaack ID */
  muxPlaybackId?: Possibly<string>;
  /** The MUX playbaack ID */
  playbackId?: Possibly<string>;
  /** A data: URI containing a blurhash for the video  */
  blurUpThumb?: Possibly<string>;
  /** Other data can be passed, but they have no effect on rendering the player */
  // biome-ignore lint/suspicious/noExplicitAny: we intentionally want to allow to add any other value to this video object
  [k: string]: any;
};

// The component supports [all the props][1] allowed by the `<MuxPlayer />`
// component, plus the `data` prop, explicitly meant to pass data in the shape
// returned from the DatoCMS API.
//
// [1]: https://github.com/muxinc/elements/blob/main/packages/mux-player-react/REFERENCE.md

export type VideoPlayerProps = MuxPlayerProps & {
  /** The actual response you get from a DatoCMS `video` GraphQL query */
  data?: Video;
};

type VideoPlayerType = React.ForwardRefExoticComponent<
  VideoPlayerProps & React.RefAttributes<MuxPlayerElement>
>;

export const VideoPlayer: VideoPlayerType = forwardRef<
  MuxPlayerElement,
  VideoPlayerProps
>((props: VideoPlayerProps, ref) => {
  const {
    data = {},
    disableCookies = true,
    preload = "metadata",
    style: styleFromProps,
    ...rest
  } = props;

  const {
    title,
    playbackId,
    style: styleFromHook,
    placeholder,
  } = useVideoPlayer({
    data,
  });

  const style = {
    ...styleFromHook,
    ...styleFromProps,
  };

  return (
    <MuxPlayer
      ref={ref}
      streamType="on-demand"
      preload={preload}
      title={title}
      disableCookies={disableCookies}
      playbackId={playbackId}
      style={style}
      placeholder={placeholder}
      {...rest}
    />
  );
});

export default VideoPlayer;
