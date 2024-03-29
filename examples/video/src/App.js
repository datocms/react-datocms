import { useRef } from 'react';
import './App.css';

import { VideoPlayer } from 'react-datocms';

const data = {
  muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
  title: 'Title',
  width: 1080,
  height: 1920,
  blurUpThumb:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLDhAWDhYQDg0NDhUVFg0OFxUZGBYfFiEaHysjHR0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OEA4QEC8dFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABkADgMBIgACEQEDEQH/xAAYAAEAAwEAAAAAAAAAAAAAAAADBAUGAf/EABwQAAICAgMAAAAAAAAAAAAAAAEDAAIEEQUGIf/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAIBITH/2gAMAwEAAhEDEQA/AByuKdRJlXTiXWJkfI7bkOprUJPYnAHcSzQXizNl9teCCXuB8EWckUjaf//Z',
};

function App() {
  const ref = useRef();

  return (
    <div className="App">
      <p>Video examples</p>
      <hr />
      <VideoPlayer data={data} className="video-player" ref={ref} disableCookies={false} />
      <hr />
      <VideoPlayer
        data={data}
        style={{ aspectRatio: '1 / 1' }}
        accentColor="#ffff00"
      />
      <hr />
      <VideoPlayer
        data={data}
        style={{
          aspectRatio: '10 / 1',
          '--controls': 'none',
          '--media-object-fit': 'cover',
        }}
        autoPlay="muted"
      />
      <hr />
      <VideoPlayer data={data} style={{ aspectRatio: undefined }} autoPlay="muted" />
      <hr />
      <VideoPlayer
        data={{ playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY' }}
      />
    </div>
  );
}

export default App;
