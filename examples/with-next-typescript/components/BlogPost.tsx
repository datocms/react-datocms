import gql from "graphql-tag";
import { Image } from "react-datocms";
import css from "styled-jsx/css";

import SFC from "../lib/SFC";
import { BlogPost as BlogPostInterface } from "../types/BlogPost";

const image = css.resolve`
  margin-bottom: 2em;
  border-radius: 3px;
`;

const authorImage = css.resolve`
  border-radius: 50%;
  margin-right: 15px;
  width: 40px;
`;

const BlogPost: SFC<BlogPostInterface> = blogPost => {
  return (
    <article className="blogPost">
      {blogPost.coverImage && blogPost.coverImage.responsiveImage && (
        <Image
          className={image.className}
          data={blogPost.coverImage.responsiveImage}
        />
      )}
      <h6 className="title">
        <a
          href={`https://www.datocms.com/blog/${blogPost.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {blogPost.title}
        </a>
      </h6>
      {blogPost.excerpt && (
        <div
          className="excerpt"
          dangerouslySetInnerHTML={{ __html: blogPost.excerpt }}
        />
      )}
      {blogPost.author && (
        <footer className="author">
          {blogPost.author.avatar && blogPost.author.avatar.responsiveImage && (
            <Image
              className={authorImage.className}
              data={blogPost.author.avatar.responsiveImage}
            />
          )}
          Written by {blogPost.author.name}
        </footer>
      )}

      <style jsx>{`
        .blogPost {
          padding-bottom: 3em;
          border-bottom: 1px solid #eee;
          margin-bottom: 3em;
        }

        .title {
          font-weight: bold;
          font-size: 1.2em;
          margin-bottom: 0.5em;
        }

        .title a {
          color: inherit;
          text-decoration: none;
        }

        .title a:hover {
          text-decoration: underline;
        }

        .excerpt {
          font-size: 0.9em;
          color: #666;
        }

        .author {
          display: flex;
          align-items: center;
          font-size: 0.9em;
          margin-top: 1.5em;
          color: #666;
        }
      `}</style>

      {image.styles}
      {authorImage.styles}
    </article>
  );
};

const responsiveImageFragment = gql`
  fragment responsiveImageFragment on ResponsiveImage {
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
  }
`;

BlogPost.fragment = gql`
  fragment BlogPost on BlogPostRecord {
    id
    slug
    title
    excerpt(markdown: true)
    coverImage {
      responsiveImage(imgixParams: { fit: crop, ar: "16:9", w: 750, fm: jpg }) {
        ...responsiveImageFragment
      }
    }
    author {
      name
      avatar {
        responsiveImage(imgixParams: { fit: crop, ar: "1:1", w: 40 }) {
          ...responsiveImageFragment
        }
      }
    }
  }

  ${responsiveImageFragment}
`;

export default BlogPost;
