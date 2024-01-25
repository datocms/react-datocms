'use client';

import React, { forwardRef } from 'react';

import type MuxPlayerElement from '@mux/mux-player';
import MuxPlayer from '@mux/mux-player-react/lazy';
import { type MuxPlayerProps } from '@mux/mux-player-react/.';
import { useVideoPlayer } from './useVideoPlayer.js';

export type Maybe<T> = T | null;

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
};

export type VideoPlayerPropTypes = {
  /** The actual response you get from a DatoCMS `video` GraphQL query */
  data?: VideoType;
} & MuxPlayerProps;

export const VideoPlayer: (
  props: VideoPlayerPropTypes,
) => ReturnType<typeof MuxPlayer> = forwardRef<
  MuxPlayerElement,
  VideoPlayerPropTypes
>((props, ref) => {
  const { title, playbackId, style, rest } = useVideoPlayer({ props });

  return (
    <MuxPlayer
      ref={ref}
      streamType="on-demand"
      title={title}
      playbackId={playbackId}
      style={style}
      {...rest}
    />
  );
});
