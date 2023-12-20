import React from "react";
import { useQuery } from "graphql-hooks";
import { Helmet } from "react-helmet";
import { renderMetaTags, renderMetaTagsToString, StructuredText } from "react-datocms";
import { query } from "./query";
import {
  SeoInspect,
  Root,
  AppTitle,
  AppSubtitle,
  BlogPost,
  BlogPostTitle,
  BlogPostImage,
  BlogPostExcerpt,
  BlogPostAuthor,
  BlogPostAuthorImage,
} from "./styles";

const App = () => {
  const { loading, error, data } = useQuery(query, {
    variables: { first: 10 }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Something bad happened</div>;

  const metaTags = data.page.seo.concat(data.site.favicon);

  return (
    <>
      <Helmet>{renderMetaTags(metaTags)}</Helmet>
      <SeoInspect>
        Look at all these juicy meta tags! ↴
        <br />
        <br />
        {renderMetaTagsToString(metaTags)}
      </SeoInspect>
      <Root>
        <AppTitle>DatoCMS Blog</AppTitle>
        <AppSubtitle>
          News, tips, highlights, and other updates from the team at DatoCMS.
        </AppSubtitle>
        {data.blogPosts.map(blogPost => (
          <BlogPost key={blogPost.id}>
            { blogPost.coverImage?.responsiveImage &&
              <BlogPostImage
                fadeInDuration={1000}
                data={blogPost.coverImage.responsiveImage}
              />
            }
            <BlogPostTitle>
              <a
                href={`https://www.datocms.com/blog/${blogPost.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {blogPost.title}
              </a>
            </BlogPostTitle>
            <BlogPostExcerpt>
              <StructuredText data={blogPost.excerpt} />
            </BlogPostExcerpt>
            <BlogPostAuthor>
              <BlogPostAuthorImage data={blogPost.author.avatar.responsiveImage} />
              Written by {blogPost.author.name}
            </BlogPostAuthor>
          </BlogPost>
        ))}
      </Root>
    </>
  );
};

export default App;
