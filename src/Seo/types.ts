export interface TitleMetaLinkTag {
  /** the tag for the meta information */
  tag: string;
  /** the inner content of the meta tag */
  content?: string | null | undefined;
  /** the HTML attributes to attach to the meta tag */
  attributes?: Record<string, string> | null | undefined;
}

export interface SeoTitleTag {
  tag: 'title';
  content: string | null;
  attributes?: null;
}

export interface RegularMetaAttributes {
  name: string;
  content: string;
}

export interface OgMetaAttributes {
  property: string;
  content: string;
}

export interface SeoMetaTag {
  tag: 'meta';
  content?: null;
  attributes: RegularMetaAttributes | OgMetaAttributes;
}

export interface FaviconAttributes {
  sizes: string;
  type: string;
  rel: string;
  href: string;
}

export interface AppleTouchIconAttributes {
  sizes: string;
  rel: 'apple-touch-icon';
  href: string;
}

export interface SeoLinkTag {
  tag: 'link';
  content?: null;
  attributes: FaviconAttributes | AppleTouchIconAttributes;
}

export type SeoTag = SeoTitleTag | SeoMetaTag;
export type FaviconTag = SeoMetaTag | SeoLinkTag;
export type SeoOrFaviconTag = SeoTag | FaviconTag;

export const isSeoTitleTag = (tag: any): tag is SeoTitleTag =>
  'tag' in tag && tag.tag === 'title' && !tag.attributes;

export const isSeoTag = (tag: any): tag is SeoTag =>
  isSeoTitleTag(tag) || isSeoMetaTag(tag);

export const isFaviconAttributes = (tag: any): tag is FaviconAttributes =>
  'sizes' in tag &&
  typeof tag.sizes === 'string' &&
  'type' in tag &&
  typeof tag.type === 'string' &&
  'rel' in tag &&
  typeof tag.rel === 'string' &&
  'href' in tag &&
  typeof tag.href === 'string';

export const isAppleTouchIconAttributes = (
  tag: any,
): tag is AppleTouchIconAttributes =>
  'sizes' in tag &&
  typeof tag.sizes === 'string' &&
  'rel' in tag &&
  tag.rel === 'apple-touch-icon' &&
  'href' in tag &&
  typeof tag.href === 'string';

export const isSeoLinkTag = (tag: any): tag is SeoLinkTag =>
  'tag' in tag &&
  tag.tag === 'link' &&
  !tag.content &&
  (isFaviconAttributes(tag.attributes) ||
    isAppleTouchIconAttributes(tag.attributes));

export const isFaviconTag = (tag: any): tag is FaviconTag =>
  isSeoMetaTag(tag) || isSeoLinkTag(tag);

export const isSeoOrFaviconTag = (
  seoOrFaviconTag: TitleMetaLinkTag | SeoOrFaviconTag,
): seoOrFaviconTag is SeoOrFaviconTag =>
  isSeoTag(seoOrFaviconTag) || isFaviconTag(seoOrFaviconTag);

export const isRegularMetaAttributes = (
  attributes: RegularMetaAttributes | OgMetaAttributes,
): attributes is RegularMetaAttributes =>
  'name' in attributes && 'content' in attributes;

export const isOgMetaAttributes = (
  attributes: RegularMetaAttributes | OgMetaAttributes,
): attributes is OgMetaAttributes =>
  'property' in attributes && 'content' in attributes;

export const isSeoMetaTag = (
  seoMetaTag: SeoOrFaviconTag,
): seoMetaTag is SeoMetaTag =>
  'tag' in seoMetaTag &&
  seoMetaTag.tag === 'meta' &&
  !seoMetaTag.content &&
  (isRegularMetaAttributes(seoMetaTag.attributes) ||
    isOgMetaAttributes(seoMetaTag.attributes));
