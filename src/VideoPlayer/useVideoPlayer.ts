import { MuxPlayerProps } from '@mux/mux-player-react/.';
import { Maybe, VideoPlayerPropTypes } from '.';

const isCSSProperties = (obj: unknown): obj is React.CSSProperties => {
  return typeof obj === 'object' && obj !== null;
};

const doesNotWantAspectRatio = (props: VideoPlayerPropTypes) => {
  return Object.hasOwn(props, 'style') && props.style === undefined;
};

const computedTitle = (title: Maybe<string> | undefined) => {
  return title || undefined;
};

const computedPlaybackId = (
  muxPlaybackId: Maybe<string> | undefined,
  playbackId: Maybe<string> | undefined,
) => {
  return muxPlaybackId || playbackId || undefined;
};

const computedStyle = (props: VideoPlayerPropTypes) => {
  const { data } = props;

  if (data === undefined) {
    return {};
  }

  const { width, height } = data;

  const cssAspectRatioProperty =
    width && height
      ? {
          aspectRatio: `${width} / ${height}`,
        }
      : {};

  if (doesNotWantAspectRatio(props)) {
    return undefined;
  } else if (isCSSProperties(props.style)) {
    return {
      ...cssAspectRatioProperty,
      ...props.style,
    };
  }

  return cssAspectRatioProperty;
};

const computedPlaceholder = (blurUpThumb: Maybe<string> | undefined) => {
  return blurUpThumb || undefined;
};

type Style = MuxPlayerProps['style'];
type Title = MuxPlayerProps['title'];
type PlaybackId = MuxPlayerProps['playbackId'];
type Placeholder = MuxPlayerProps['placeholder'];
type Rest = Omit<
  MuxPlayerProps,
  'title' | 'playbackId' | 'placeholder' | 'style'
>;

type PropsForMuxPlayer = {
  style?: Style;
  title?: Title;
  playbackId?: PlaybackId;
  placeholder?: Placeholder;
  rest: Rest;
};

type UseVideoPlayerOptions = {
  props: VideoPlayerPropTypes;
};

type UseVideoPlayer = ({ props }: UseVideoPlayerOptions) => PropsForMuxPlayer;

export const useVideoPlayer: UseVideoPlayer = ({ props }) => {
  const { data, style, ...rest } = props;

  if (data === undefined) {
    return {
      rest,
    };
  }

  const { title, playbackId, muxPlaybackId, blurUpThumb } = data;

  return {
    title: computedTitle(title),
    playbackId: computedPlaybackId(muxPlaybackId, playbackId),
    style: computedStyle(props),
    placeholder: computedPlaceholder(blurUpThumb),
    rest,
  };
};
