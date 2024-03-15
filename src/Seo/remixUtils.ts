import { SeoOrFaviconTag, TitleMetaLinkTag } from './types.js';

interface RemixV1HtmlMetaDescriptor {
  [name: string]: string | string[];
}

export function toRemixV1Meta(
  metaTags: null | TitleMetaLinkTag[] | SeoOrFaviconTag[],
): RemixV1HtmlMetaDescriptor {
  if (!metaTags) {
    return {};
  }

  return (metaTags as TitleMetaLinkTag[]).reduce((acc, tag) => {
    if (tag.tag === 'title') {
      return tag.content ? { ...acc, title: tag.content } : acc;
    }

    if (tag.tag === 'link') {
      return acc;
    }

    if (!tag.attributes) {
      return acc;
    }

    return {
      ...acc,
      ['property' in tag.attributes
        ? tag.attributes.property
        : tag.attributes.name]: tag.attributes.content,
    };
  }, {} as RemixV1HtmlMetaDescriptor);
}

export function toRemixMeta(
  tags: null | TitleMetaLinkTag[] | SeoOrFaviconTag[],
) {
  if (!tags) {
    return [];
  }

  return tags
    .map((x) => {
      if (x.tag === 'title' && x.content) return { title: x.content };
      return x.attributes;
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
}
