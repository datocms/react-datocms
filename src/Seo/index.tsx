import React from "react";

export type SeoMetaTagType = {
  tag: string;
  content: string | null;
  attributes: Record<string, string> | null;
};

export type ToMetaTagsType = SeoMetaTagType[];

export const renderMetaTags = function (data: SeoMetaTagType[]): JSX.Element[] {
  return data.map(({ tag, attributes, content }) => {
    let key: string[] = [tag];

    if (attributes && "property" in attributes) {
      key.push(attributes.property);
    }

    if (attributes && "name" in attributes) {
      key.push(attributes.name);
    }

    if (attributes && "rel" in attributes) {
      key.push(attributes.rel);
    }

    if (attributes && "sizes" in attributes) {
      key.push(attributes.sizes);
    }

    const Tag = tag as "meta" | "title" | "link";

    return (
      <Tag key={key.join("-")} {...attributes}>
        {content}
      </Tag>
    );
  });
};

const serializeAttributes = (attributes: Record<string, string> | null) => {
  if (!attributes) {
    return "";
  }

  const serializedAttrs = [];

  for (const key in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, key)) {
      serializedAttrs.push(`${key}="${attributes[key]}"`);
    }
  }

  return " " + serializedAttrs.join(" ");
};

export const renderMetaTagsToString = function (data: SeoMetaTagType[]) {
  return data
    .map(({ tag, attributes, content }) => {
      if (content) {
        return `<${tag}${serializeAttributes(attributes)}>${content}</${tag}>`;
      }

      return `<${tag}${serializeAttributes(attributes)} />`;
    })
    .join("\n");
};
