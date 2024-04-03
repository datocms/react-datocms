import { useRef } from 'react';

import { VideoPlayer } from 'react-datocms';

const data = {
  muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
  title: 'Title',
  width: 1080,
  height: 1920,
  blurUpThumb:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLDhAWDhYQDg0NDhUVFg0OFxUZGBYfFiEaHysjHR0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OEA4QEC8dFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABkADgMBIgACEQEDEQH/xAAYAAEAAwEAAAAAAAAAAAAAAAADBAUGAf/EABwQAAICAgMAAAAAAAAAAAAAAAEDAAIEEQUGIf/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAIBITH/2gAMAwEAAhEDEQA/AByuKdRJlXTiXWJkfI7bkOprUJPYnAHcSzQXizNl9teCCXuB8EWckUjaf//Z',
};

export default function Video() {
  const ref = useRef();

  return (
    <>
      <div className="example" data-title="Standard behaviour">
        <VideoPlayer data={data} className="video-player" ref={ref} />
      </div>
      <div
        className="example"
        data-title="Force to be square, custom accent color"
      >
        <VideoPlayer
          data={data}
          style={{ aspectRatio: '1 / 1' }}
          accentColor="#ffff00"
        />
      </div>
      <div
        className="example"
        data-title="Forced aspect ratio, no controls, autoplay, cover"
      >
        <VideoPlayer
          data={data}
          style={{
            aspectRatio: '10 / 4',
            '--controls': 'none',
            '--media-object-fit': 'cover',
          }}
          autoPlay="muted"
          loop={true}
        />
      </div>
      <div className="example" data-title="No aspect ratio set">
        <VideoPlayer
          data={data}
          style={{ aspectRatio: undefined }}
          disableCookies={false}
          autoPlay="muted"
          loop={true}
        />
      </div>
      <div className="example" data-title="Minimum data required (playbackId)">
        <VideoPlayer
          data={{ playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY' }}
        />
      </div>
    </>
  );
}
