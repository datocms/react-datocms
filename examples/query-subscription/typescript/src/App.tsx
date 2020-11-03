import React from "react";
import "./App.css";
import { Helmet } from "react-helmet";
import { Image, renderMetaTags, useQuerySubscription } from "react-datocms";
import { query, QueryResponseType, QueryVariables } from "./query";

const App: React.FC = () => {
  const { status, error, data } = useQuerySubscription<
    QueryResponseType,
    QueryVariables
  >({
    query,
    variables: { first: 10 },
    token: "faeb9172e232a75339242faafb9e56de8c8f13b735f7090964",
    enabled: false,
  });

  const metaTags = data ? data.page.seo.concat(data.site.favicon) : [];

  const statusMessage = {
    connecting: "Connecting to DatoCMS...",
    connected: "Connected to DatoCMS, receiving live updates!",
    closed: "Connection closed",
  };

  return (
    <div>
      <Helmet>{renderMetaTags(metaTags)}</Helmet>
      <div className="app">
        <div className="app-title">DatoCMS Blog</div>
        <div className="app-subtitle">
          News, tips, highlights, and other updates from the team at DatoCMS.
        </div>
        <div className="status">
          {status === "connected" && <div className="connected-badge" />}
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
        {data &&
          data.blogPosts.map((blogPost) => (
            <article key={blogPost.id} className="blogPost">
              <Image
                className="blogPost-image"
                fadeInDuration={1000}
                data={blogPost.coverImage.responsiveImage}
              />
              <h6 className="blogPost-title">
                <a
                  href={`https://www.datocms.com/blog/${blogPost.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {blogPost.title}
                </a>
              </h6>
              <div
                className="blogPost-excerpt"
                dangerouslySetInnerHTML={{ __html: blogPost.excerpt }}
              />
              <footer className="blogPost-author">
                <Image
                  className="blogPost-author-image"
                  data={blogPost.author.avatar.responsiveImage}
                />
                Written by {blogPost.author.name}
              </footer>
            </article>
          ))}
      </div>
    </div>
  );
};

export default App;
