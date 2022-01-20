import { SeoLinkTag, SeoOrFaviconTag } from './types';

interface RemixHtmlMetaDescriptor {
  [name: string]: string | string[];
}

interface RemixHtmlLinkDescriptor {
  href: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  rel: string;
  media?: string;
  integrity?: string;
  hrefLang?: string;
  type?: string;
  referrerPolicy?:
    | ''
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'same-origin'
    | 'origin'
    | 'strict-origin'
    | 'origin-when-cross-origin'
    | 'strict-origin-when-cross-origin'
    | 'unsafe-url';
  sizes?: string;
  imagesrcset?: string;
  imagesizes?: string;
  as?: string;
  color?: string;
  disabled?: boolean;
  title?: string;
}

export function toRemixMeta(
  metaTags: null | SeoOrFaviconTag[],
): RemixHtmlMetaDescriptor {
  if (!metaTags) {
    return {};
  }

  return metaTags.reduce((acc, tag) => {
    if (tag.tag === 'title') {
      return tag.content ? { ...acc, title: tag.content } : acc;
    }

    if (tag.tag === 'link') {
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

export function toRemixLinks(
  metaTags: null | SeoOrFaviconTag[],
): RemixHtmlLinkDescriptor[] {
  if (!metaTags) {
    return [];
  }

  return metaTags
    .filter((tag): tag is SeoLinkTag => tag.tag === 'link')
    .map((tag) => tag.attributes);
}
