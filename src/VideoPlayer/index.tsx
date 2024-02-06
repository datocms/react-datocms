'use client';

// This file defines a React component suitable for displaying a video player
// for video stored as assets on DatoCMS. The component is a thin wrapper around
// the [React component made available by MUX][1].
// 
// The React player written by MUX is an adapter for a web component.
//
// [1]: https://www.mux.com/player

import React, { forwardRef } from 'react';

// We use and extend Typescript types defined in the MUX player.

import type MuxPlayerElement from '@mux/mux-player';
import { type MuxPlayerProps } from '@mux/mux-player-react/.';

// React MUX player is made available in two flavours: eager and lazy. We choose
// to use the lazy version to avoid loading the web component uselessly.

import MuxPlayer from '@mux/mux-player-react/lazy';

// The core of this component is the `useVideoPlayer` hook: it takes props and
// data from DatoCMS GraphQL API and returns props as expected by the
// `<MuxPlayer />` component.

import { useVideoPlayer } from '../useVideoPlayer/index.js';

export type Maybe<T> = T | null;

// `VideoType` represents a fragment of data regarding a video as returned from
// DatoCMS GraphQL API.

export type VideoType = {
  /** Title attribute (`title`) for the video */
  title?: Maybe<string>;
  /** The height of the video */
  height?: Maybe<number>;
  /** The width of the video */
  width?: Maybe<number>;
  /** The MUX playbaack ID */
  muxPlaybackId?: Maybe<string>;
  /** The MUX playbaack ID */
  playbackId?: Maybe<string>;
  /** A data: URI containing a blurhash for the video  */
  blurUpThumb?: Maybe<string>;
};

export type VideoPlayerProp = MuxPlayerProps & {
  /** The actual response you get from a DatoCMS `video` GraphQL query */
  data?: VideoType;
};

export const VideoPlayer: (
  props: VideoPlayerProp,
) => ReturnType<typeof MuxPlayer> = forwardRef<
  MuxPlayerElement,
  VideoPlayerProp
>((props, ref) => {
  const { title, playbackId, style, placeholder, disableCookies, rest } = useVideoPlayer({
    props,
  });

  return (
    <MuxPlayer
      ref={ref}
      streamType="on-demand"
      title={title}
      disableCookies={disableCookies}
      playbackId={playbackId}
      style={style}
      placeholder={placeholder}
      {...rest}
    />
  );
});
