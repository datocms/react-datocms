import {
  ResponsiveImageType,
  StructuredTextGraphQlResponse,
  SeoTag,
  FaviconTag,
} from 'react-datocms';

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

export const query = `
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
        responsiveImage(imgixParams: { fit: crop, ar: "16:9", w: 750, auto: format }) {
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

type BlogPost = {
  id: string;
  title: string;
  excerpt: StructuredTextGraphQlResponse;
  slug: string;
  coverImage: {
    responsiveImage: ResponsiveImageType;
  };
  author: {
    name: string;
    avatar: {
      responsiveImage: ResponsiveImageType;
    };
  };
};

export type QueryResponseType = {
  page: {
    seo: SeoTag[];
  };
  site: {
    favicon: FaviconTag[];
  };
  blogPosts: BlogPost[];
};

export type QueryVariables = {
  first: number;
};
