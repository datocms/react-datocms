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

    blogPosts: allBlogPosts(first: $first, orderBy: publicationDate_DESC) {
      id
      title
      slug
      excerpt { value }
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