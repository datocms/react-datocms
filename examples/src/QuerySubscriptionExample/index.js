import {
  Image,
  StructuredText,
  renderMetaTags,
  useQuerySubscription,
} from 'react-datocms';
import { Helmet } from 'react-helmet';
import './style.css';

const RESPONSIVE_IMAGE_FRAGMENT = `
  aspectRatio
  height
  sizes
  src
  webpSrcSet
  srcSet
  width
  alt
  base64
  title
`;

const META_TAGS_FRAGMENT = `
  attributes
  content
  tag
`;

const query = `
  query AppQuery($first: IntType) {
    page: blog {
      seo: _seoMetaTags {
        ${META_TAGS_FRAGMENT}
      }
    }

    site: _site {
      favicon: faviconMetaTags {
        ${META_TAGS_FRAGMENT}
      }
    }

    blogPosts: allBlogPosts(first: $first, orderBy: _firstPublishedAt_DESC) {
      id
      title
      slug
      excerpt { value }
      coverImage {
        responsiveImage(imgixParams: { w: 550, auto: format }) {
          ${RESPONSIVE_IMAGE_FRAGMENT}
        }
      }
      author {
        name
        avatar {
          responsiveImage(imgixParams: { fit: crop, ar: "1:1", w: 40, auto: format }) {
            ${RESPONSIVE_IMAGE_FRAGMENT}
          }
        }
      }
    }
  }
`;

export default function QuerySubscriptionExample() {
  const { status, error, data } = useQuerySubscription({
    query,
    variables: { first: 4 },
    token: 'faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
  });

  const metaTags = data ? [...data.page.seo, ...data.site.favicon] : [];

  const statusMessage = {
    connecting: 'Connecting to DatoCMS...',
    connected: 'Connected to DatoCMS, receiving live updates!',
    closed: 'Connection closed',
  };

  return (
    <div className="example" data-title="Full-blown example">
      <Helmet>{renderMetaTags(metaTags)}</Helmet>
      <div className="status">
        {status === 'connected' && <div className="connected-badge" />}
        {statusMessage[status]}
      </div>
      {error && (
        <div>
          <h1>Error: {error.code}</h1>
          <div>{error.message}</div>
          {error.response && (
            <pre>{JSON.stringify(error.response, null, 2)}</pre>
          )}
        </div>
      )}
      <div className="blogPosts">
        {data?.blogPosts.map((blogPost) => (
          <article key={blogPost.id} className="blogPost">
            <Image
              className="blogPost-image"
              data={blogPost.coverImage.responsiveImage}
            />
            <div className="blogPost-content">
              <h6 className="blogPost-title">
                <a
                  href={`https://www.datocms.com/blog/${blogPost.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {blogPost.title}
                </a>
              </h6>
              <div className="blogPost-excerpt">
                <StructuredText data={blogPost.excerpt} />
              </div>
              <footer className="blogPost-author">
                <Image
                  className="blogPost-author-image"
                  data={blogPost.author.avatar.responsiveImage}
                />
                Written by {blogPost.author.name}
              </footer>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
