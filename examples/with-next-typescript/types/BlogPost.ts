/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: BlogPost
// ====================================================

export interface BlogPost_coverImage_responsiveImage {
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

export interface BlogPost_coverImage {
  __typename: "FileField";
  responsiveImage: BlogPost_coverImage_responsiveImage | null;
}

export interface BlogPost_author_avatar_responsiveImage {
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

export interface BlogPost_author_avatar {
  __typename: "FileField";
  responsiveImage: BlogPost_author_avatar_responsiveImage | null;
}

export interface BlogPost_author {
  __typename: "AuthorRecord";
  name: string | null;
  avatar: BlogPost_author_avatar | null;
}

export interface BlogPost {
  __typename: "BlogPostRecord";
  id: GQLItemId;
  slug: string | null;
  title: string | null;
  excerpt: string | null;
  coverImage: BlogPost_coverImage | null;
  author: BlogPost_author | null;
}
