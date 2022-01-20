export interface SeoTitleTag {
  tag: 'title';
  content: string | null;
  attributes?: null;
}

export interface RegularMetaAttributes {
  name: string;
  content: string;
};

export interface OgMetaAttributes {
  property: string;
  content: string;
};

export interface SeoMetaTag {
  tag: 'meta';
  content?: null;
  attributes: RegularMetaAttributes | OgMetaAttributes;
}

export interface FaviconAttributes {
  sizes: string,
  type: string,
  rel: string,
  href: string,
}

export interface AppleTouchIconAttributes {
  sizes: string,
  rel: 'apple-touch-icon',
  href: string,
}

export interface SeoLinkTag {
  tag: 'link';
  content?: null;
  attributes: FaviconAttributes | AppleTouchIconAttributes;
}

export type SeoTag = SeoTitleTag | SeoMetaTag;
export type FaviconTag = SeoMetaTag | SeoLinkTag;
export type SeoOrFaviconTag = SeoTag | FaviconTag;
