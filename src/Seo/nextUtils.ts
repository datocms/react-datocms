import {
  type SeoOrFaviconTag,
  type TitleMetaLinkTag,
  isAppleTouchIconAttributes,
  isFaviconAttributes,
  isOgMetaAttributes,
  isRegularMetaAttributes,
  isSeoLinkTag,
  isSeoMetaTag,
  isSeoOrFaviconTag,
} from './types.js';

export type AppleIcon = {
  sizes: string;
  url: string;
};

export type Icon = {
  rel: string;
  sizes: string;
  type: string;
  url: string;
};

export type Icons = {
  icon?: Icon[];
  apple?: AppleIcon[];
};

export type OpenGraph = {
  title?: string;
  description?: string;
  locale?: string;
  type?: string;
  siteName?: string;
  images?: OpenGraphImage[];
};

export type OpenGraphImage = {
  url: string;
  type?: string;
  width?: string;
  height?: string;
};

export type Twitter = {
  description?: string;
  title?: string;
  images?: TwitterImage[];
};

export type TwitterImage = {
  url: string;
  type?: string;
  width?: string;
  height?: string;
};

export type Metadata = {
  title?: string;
  description?: string;
  icons?: Icons;
  openGraph?: OpenGraph;
  twitter?: Twitter;
};

const camelize = (string: string) =>
  string.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

export function toNextMetadata(
  data: TitleMetaLinkTag[] | SeoOrFaviconTag[],
): Metadata {
  const metadata: Record<string, any> = {};

  data.forEach((datum) => {
    const { tag, attributes, content } = datum;

    if (tag === 'title') {
      metadata['title'] = content;
    }

    if (isSeoOrFaviconTag(datum) && isSeoMetaTag(datum)) {
      if (isOgMetaAttributes(datum.attributes)) {
        const { property, content } = datum.attributes;

        if (property.match(/^og:/)) {
          const [_, ...parts] = property.split(':');

          if (parts?.length === 1) {
            if (parts[0] === 'image') {
              metadata['openGraph'] ||= {};

              metadata['openGraph']['images'] = {
                ...metadata['openGraph']['images'],
                url: content,
              };
            } else {
              metadata['openGraph'] = {
                ...metadata['openGraph'],
                [camelize(parts[0])]: content,
              };
            }
          }

          if (parts?.length === 2) {
            if (parts[0] === 'image' && parts[1] === 'width') {
              metadata['openGraph'] ||= {};

              metadata['openGraph']['images'] = {
                ...metadata['openGraph']['images'],
                width: content,
              };
            } else if (parts[0] === 'image' && parts[1] === 'height') {
              metadata['openGraph'] ||= {};

              metadata['openGraph']['images'] = {
                ...metadata['openGraph']['images'],
                height: content,
              };
            }
          }
        }
      }

      if (isRegularMetaAttributes(datum.attributes)) {
        const { name, content } = datum.attributes;

        if (name.match(/^msapplication-/)) {
          // Ignore: already deprecated at the release of Next 13.
        } else if (name.match(/^twitter:/)) {
          const [_, ...parts] = name.split(':');

          if (parts?.length === 1) {
            metadata['twitter'] = {
              ...metadata['twitter'],
              [camelize(parts[0])]: content,
            };
          }
        } else {
          metadata[name] = content;
        }
      }
    }

    if (isSeoLinkTag(datum)) {
      if (isAppleTouchIconAttributes(datum.attributes)) {
        const { sizes, href } = datum.attributes;

        metadata['icons'] ||= {};

        metadata['icons']['apple'] = [
          ...(metadata['icons']['apple'] || []),
          { url: href, sizes },
        ];
      }

      if (isFaviconAttributes(datum.attributes)) {
        const { sizes, type, rel, href } = datum.attributes;

        metadata['icons'] ||= {};

        metadata['icons']['icon'] = [
          ...(metadata['icons']['icon'] || []),
          { url: href, sizes, type, rel },
        ];
      }
    }
  });

  return metadata;
}
