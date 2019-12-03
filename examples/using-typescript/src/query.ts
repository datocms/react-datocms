import {
  ToMetaTagsType,
  ResponsiveImageType
} from "react-datocms";

const RESPONSIVE_IMAGE_FRAGMENT = `
  aspectRatio
  base64
  height
  sizes
  src
  srcSet
  width
  alt
  title
`;

const SEO_FRAGMENT = `
  attributes
  content
  tag
`;

export const query = `
  query AppQuery($first: IntType) {
    page: blog {
      seo: _seoMetaTags {
        ${SEO_FRAGMENT}
      }
    }

    site: _site {
      favicon: faviconMetaTags {
        ${SEO_FRAGMENT}
      }
    }

    blogPosts: allBlogPosts(first: $first, orderBy: publicationDate_DESC) {
      id
      title
      slug
      excerpt(markdown: true)
      coverImage {
        responsiveImage(imgixParams: { fit: crop, ar: "16:9", w: 750 }) {
          ${RESPONSIVE_IMAGE_FRAGMENT}
        }
      }
      author {
        name
        avatar {
          responsiveImage(imgixParams: { fit: crop, ar: "1:1", w: 40 }) {
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
  excerpt: string;
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
    seo: ToMetaTagsType;
  };
  site: {
    favicon: ToMetaTagsType;
  };
  blogPosts: BlogPost[];
};

export type QueryVariables = {
  first: number;
};