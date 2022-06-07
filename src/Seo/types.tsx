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
