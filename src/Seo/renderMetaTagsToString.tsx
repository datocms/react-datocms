import { SeoOrFaviconTag, TitleMetaLinkTag } from './types.js';

export function renderMetaTagsToString(
  data: TitleMetaLinkTag[] | SeoOrFaviconTag[],
): string {
  return data
    .map((tag) => {
      if (tag.tag === 'title') {
        return `<title>${tag.content}</title>`;
      }

      const serializedAttrs = [];

      for (const key in tag.attributes) {
        if (Object.prototype.hasOwnProperty.call(tag.attributes, key)) {
          serializedAttrs.push(`${key}="${(tag.attributes as any)[key]}"`);
        }
      }

      return `<${tag.tag} ${serializedAttrs.join(' ')} />`;
    })
    .join('\n');
}
