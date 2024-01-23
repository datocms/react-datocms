import React from 'react';
import { SeoOrFaviconTag, TitleMetaLinkTag } from './types.js';

export function renderMetaTags(
  data: TitleMetaLinkTag[] | SeoOrFaviconTag[],
): JSX.Element[] {
  return data.map(({ tag, attributes, content }) => {
    let key: string[] = [tag];

    if (attributes && 'property' in attributes) {
      key.push(attributes.property);
    }

    if (attributes && 'name' in attributes) {
      key.push(attributes.name);
    }

    if (attributes && 'rel' in attributes) {
      key.push(attributes.rel);
    }

    if (attributes && 'sizes' in attributes) {
      key.push(attributes.sizes);
    }

    const Tag = tag as 'meta' | 'title' | 'link';

    return (
      <Tag key={key.join('-')} {...attributes}>
        {content}
      </Tag>
    );
  });
}
