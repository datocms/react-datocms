import ImageExamples from '../ImageExamples';
import QuerySubscriptionExample from '../QuerySubscriptionExample';
import SRCImageExamples from '../SRCImageExample';
import SiteSearchExamples from '../SiteSearchExamples';
import VideoExamples from '../VideoExamples';
import LazyVideoExamples from '../LazyVideoExamples';
import './style.css';

export default function App() {
  return (
    <>
      <nav>
        <a href="#native-image">SRCImage</a>
        <a href="#image">Image</a>
        <a href="#subscriptions">Query Subscription</a>
        <a href="#site-search">Site Search</a>
        <a href="#video">Video</a>
        <a href="#lazy-video">Lazy Video</a>
      </nav>

      <h1 id="native-image">SRCImage examples</h1>
      <SRCImageExamples />

      <h1 id="image">Image examples</h1>
      <ImageExamples />

      <h1 id="subscriptions">Query subscription example</h1>
      <QuerySubscriptionExample />

      <h1 id="site-search">Site Search example</h1>
      <SiteSearchExamples />

      <h1 id="video">Video examples</h1>
      <VideoExamples />

      <h1 id="lazy-video">Lazy Video examples</h1>
      <LazyVideoExamples />
    </>
  );
}
