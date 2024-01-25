import { MuxPlayerProps } from '@mux/mux-player-react/.';
import { Maybe, VideoPlayerPropTypes } from '.';

const isCSSProperties = (obj: unknown): obj is React.CSSProperties => {
  return typeof obj === 'object' && obj !== null;
};

const doesNotWantAspectRatio = (props: VideoPlayerPropTypes) => {
  return Object.hasOwn(props, 'style') && props.style === undefined;
};

const computedTitle = (title: Maybe<string> | undefined) => title || undefined;

const computedPlaybackId = (
  muxPlaybackId: Maybe<string> | undefined,
  playbackId: Maybe<string> | undefined,
) => muxPlaybackId || playbackId || undefined;

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

export const useVideoPlayer = ({
  props,
}: {
  props: VideoPlayerPropTypes;
}): {
  title?: string;
  playbackId?: string;
  style?: React.CSSProperties;
  rest: Partial<MuxPlayerProps>;
} => {
  const { data, style, ...rest } = props;

  if (data === undefined) {
    return {
      rest,
    };
  }

  const { title, playbackId, muxPlaybackId } = data;

  return {
    title: computedTitle(title),
    playbackId: computedPlaybackId(muxPlaybackId, playbackId),
    style: computedStyle(props),
    rest,
  };
};
