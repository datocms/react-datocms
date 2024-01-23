import { SeoOrFaviconTag, TitleMetaLinkTag } from './types.js';

interface RemixHtmlMetaDescriptor {
  [name: string]: string | string[];
}

export function toRemixMeta(
  metaTags: null | TitleMetaLinkTag[] | SeoOrFaviconTag[],
): RemixHtmlMetaDescriptor {
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
  }, {} as RemixHtmlMetaDescriptor);
}
