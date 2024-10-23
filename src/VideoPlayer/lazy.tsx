import React, { Suspense, forwardRef } from "react";
import type MuxPlayerElement from "@mux/mux-player";
import type MuxPlayer from "@mux/mux-player-react/.";

import type { VideoPlayerProps } from "./index";

const LazyLoadedVideoPlayer = React.lazy(() => import("./index.js"));

type VideoPlayerType = React.ForwardRefExoticComponent<
  VideoPlayerProps & React.RefAttributes<MuxPlayerElement>
>;

export const VideoPlayer: VideoPlayerType = forwardRef<
  MuxPlayerElement,
  VideoPlayerProps
>((props: VideoPlayerProps, ref) => {
  const { className, style } = props;

  return (
    <Suspense fallback={<div className={className} style={style} />}>
      <LazyLoadedVideoPlayer {...props} ref={ref} />
    </Suspense>
  );
});

export default VideoPlayer;
