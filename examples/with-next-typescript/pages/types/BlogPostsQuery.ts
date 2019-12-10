/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BlogPostsQuery
// ====================================================

export interface BlogPostsQuery_page_seo {
  __typename: "Tag";
  attributes: GQLMetaTagAttributes | null;
  content: string | null;
  tag: string;
}

export interface BlogPostsQuery_page {
  __typename: "BlogRecord";
  /**
   * SEO meta tags
   */
  seo: BlogPostsQuery_page_seo[];
}

export interface BlogPostsQuery_site_favicon {
  __typename: "Tag";
  attributes: GQLMetaTagAttributes | null;
  content: string | null;
  tag: string;
}

export interface BlogPostsQuery_site {
  __typename: "Site";
  favicon: BlogPostsQuery_site_favicon[];
}

export interface BlogPostsQuery_allBlogPosts_coverImage_responsiveImage {
  __typename: "ResponsiveImage";
  aspectRatio: GQLFloatType;
  height: GQLIntType;
  sizes: string;
  src: string;
  webpSrcSet: string;
  srcSet: string;
  width: GQLIntType;
  alt: string | null;
  base64: string | null;
  title: string | null;
}

export interface BlogPostsQuery_allBlogPosts_coverImage {
  __typename: "FileField";
  responsiveImage: BlogPostsQuery_allBlogPosts_coverImage_responsiveImage | null;
}

export interface BlogPostsQuery_allBlogPosts_author_avatar_responsiveImage {
  __typename: "ResponsiveImage";
  aspectRatio: GQLFloatType;
  height: GQLIntType;
  sizes: string;
  src: string;
  webpSrcSet: string;
  srcSet: string;
  width: GQLIntType;
  alt: string | null;
  base64: string | null;
  title: string | null;
}

export interface BlogPostsQuery_allBlogPosts_author_avatar {
  __typename: "FileField";
  responsiveImage: BlogPostsQuery_allBlogPosts_author_avatar_responsiveImage | null;
}

export interface BlogPostsQuery_allBlogPosts_author {
  __typename: "AuthorRecord";
  name: string | null;
  avatar: BlogPostsQuery_allBlogPosts_author_avatar | null;
}

export interface BlogPostsQuery_allBlogPosts {
  __typename: "BlogPostRecord";
  id: GQLItemId;
  slug: string | null;
  title: string | null;
  excerpt: string | null;
  coverImage: BlogPostsQuery_allBlogPosts_coverImage | null;
  author: BlogPostsQuery_allBlogPosts_author | null;
}

export interface BlogPostsQuery__allBlogPostsMeta {
  __typename: "CollectionMetadata";
  count: GQLIntType;
}

export interface BlogPostsQuery {
  /**
   * Returns the single instance record
   */
  page: BlogPostsQuery_page | null;
  /**
   * Returns the single instance record
   */
  site: BlogPostsQuery_site;
  /**
   * Returns a collection of records
   */
  allBlogPosts: BlogPostsQuery_allBlogPosts[];
  /**
   * Returns meta information regarding a record collection
   */
  _allBlogPostsMeta: BlogPostsQuery__allBlogPostsMeta;
}

export interface BlogPostsQueryVariables {
  first: GQLIntType;
  skip: GQLIntType;
}
