import { MuxPlayerProps } from '@mux/mux-player-react/.';

import { Video } from '../VideoPlayer';

export type Maybe<T> = T | null;

const computedTitle = (title: Maybe<string> | undefined) => {
  return title ? { title } : undefined;
};

const computedPlaybackId = (
  muxPlaybackId: Maybe<string> | undefined,
  playbackId: Maybe<string> | undefined,
) => {
  if (!(muxPlaybackId || playbackId)) return undefined;

  return { playbackId: `${muxPlaybackId || playbackId}` };
};

const computedStyle = (
  width: Maybe<number> | undefined,
  height: Maybe<number> | undefined,
) => {
  if (!(width && height)) return undefined;

  return {
    style: {
      aspectRatio: `${width} / ${height}`,
    },
  };
};

const computedPlaceholder = (blurUpThumb: Maybe<string> | undefined) => {
  return blurUpThumb ? { placeholder: blurUpThumb } : undefined;
};

type Style = MuxPlayerProps['style'];
type Title = MuxPlayerProps['title'];
type PlaybackId = MuxPlayerProps['playbackId'];
type Placeholder = MuxPlayerProps['placeholder'];

type PropsForMuxPlayer = {
  style?: Style;
  title?: Title;
  playbackId?: PlaybackId;
  placeholder?: Placeholder;
};

type UseVideoPlayerOptions = {
  data: Video;
};

export const useVideoPlayer = ({
  data,
}: UseVideoPlayerOptions): PropsForMuxPlayer => {
  const { title, width, height, playbackId, muxPlaybackId, blurUpThumb } =
    data || {};

  if (data === undefined) return {};

  return {
    ...(computedTitle(title) || {}),
    ...(computedPlaybackId(muxPlaybackId, playbackId) || {}),
    ...(computedStyle(width, height) || {}),
    ...(computedPlaceholder(blurUpThumb) || {}),
  };
};
