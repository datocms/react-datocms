import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { NetworkStatus } from "apollo-client";
import Head from "next/head";
import { renderMetaTags, renderMetaTagsToString } from "react-datocms";

import { withDato } from "../lib/datocms";
import BlogPost from "../components/BlogPost";
import ErrorMessage from "../components/ErrorMessage";

import {
  BlogPostsQuery,
  BlogPostsQueryVariables
} from "./types/BlogPostsQuery";

const seoMetaTagsFragment = gql`
  fragment seoMetaTagsFragment on Tag {
    attributes
    content
    tag
  }
`;

const ALL_MEMBERS_QUERY = gql`
  query BlogPostsQuery($first: IntType!, $skip: IntType!) {
    page: blog {
      seo: _seoMetaTags {
        ...seoMetaTagsFragment
      }
    }

    site: _site {
      favicon: faviconMetaTags {
        ...seoMetaTagsFragment
      }
    }

    allBlogPosts(first: $first, skip: $skip, orderBy: publicationDate_DESC) {
      ...BlogPost
    }

    _allBlogPostsMeta {
      count
    }
  }

  ${seoMetaTagsFragment}
  ${BlogPost.fragment}
`;

export const allBlogPostsQueryVars: BlogPostsQueryVariables = {
  skip: 0,
  first: 6
};

const Index: React.SFC = () => {
  const { loading, error, data, fetchMore, networkStatus } = useQuery<
    BlogPostsQuery,
    BlogPostsQueryVariables
  >(ALL_MEMBERS_QUERY, {
    variables: allBlogPostsQueryVars,
    notifyOnNetworkStatusChange: true
  });

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;

  const loadMorePosts = () => {
    fetchMore({
      variables: {
        skip: allBlogPosts.length
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          // Append the new posts results to the old one
          allBlogPosts: [
            ...previousResult.allBlogPosts,
            ...fetchMoreResult.allBlogPosts
          ]
        });
      }
    });
  };

  if (error) return <ErrorMessage message="Error loading team members!" />;
  if (loading && !loadingMorePosts) return <div>Loading...</div>;
  if (!data) return <ErrorMessage message="Error loading team members!" />;

  const { allBlogPosts, _allBlogPostsMeta, page, site } = data;
  const areMoreBlogPosts = allBlogPosts.length < _allBlogPostsMeta.count;
  const metaTags = site.favicon.concat(page ? page.seo : []);

  return (
    <div>
      <Head>{renderMetaTags(metaTags)}</Head>
      <pre className="seo-inspect">
        Look at all these juicy meta tags! ↴
        <br />
        <br />
        {renderMetaTagsToString(metaTags)}
      </pre>
      <div className="app">
        <div className="title">DatoCMS Blog</div>
        <div className="subtitle">
          News, tips, highlights, and other updates from the team at DatoCMS.
        </div>
        {allBlogPosts.map(member => (
          <BlogPost key={member.id} {...member} />
        ))}
        {areMoreBlogPosts && (
          <button
            className="more"
            onClick={() => loadMorePosts()}
            disabled={loadingMorePosts}
          >
            {loadingMorePosts ? "Loading..." : "Load more articles!"}
          </button>
        )}
      </div>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          font-size: 100%;
          font: inherit;
          vertical-align: baseline;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
            Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
          line-height: 1.5;
          color: #333;
        }
      `}</style>
      <style jsx>{`
        .app {
          max-width: 750px;
          margin: 0 auto 3em;
        }

        .title {
          font-size: 3em;
          font-weight: bold;
        }

        .subtitle {
          margin-bottom: 4em;
        }

        .more {
          background: none;
          color: inherit;
          border: none;
          padding: 0;
          font: inherit;
          cursor: pointer;
          outline: inherit;
          width: 100%;
          box-sizing: border-box;
          text-align: inherit;
        }

        .more:hover {
          text-decoration: underline;
        }

        .seo-inspect {
          background: #f5f5f5;
          border-radius: 3px;
          padding: 25px;
          overflow: auto;
          font-size: 11px;
          margin-bottom: 8em;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo,
            Courier, monospace;
        }
      `}</style>
    </div>
  );
};

export default withDato(Index);
