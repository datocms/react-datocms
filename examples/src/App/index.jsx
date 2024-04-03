import ImageExamples from '../ImageExamples';
import QuerySubscriptionExample from '../QuerySubscriptionExample';
import SRCImageExamples from '../SRCImageExample';
import SiteSearchExamples from '../SiteSearchExamples';
import VideoExamples from '../VideoExamples';
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
      </nav>

      <a id="native-image" />
      <h1>SRCImage examples</h1>
      <SRCImageExamples />

      <a id="image" />
      <h1>Image examples</h1>
      <ImageExamples />

      <a id="subscriptions" />
      <h1>Query subscription example</h1>
      <QuerySubscriptionExample />

      <a id="site-search" />
      <h1>Site Search example</h1>
      <SiteSearchExamples />

      <a id="video" />
      <h1>Video examples</h1>
      <VideoExamples />
    </>
  );
}
