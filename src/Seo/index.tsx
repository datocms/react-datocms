import React from "react";

type TwitterTag = {
  attributes: {
    content: string;
    name: string;
  };
  tag: string;
  content: null;
};

type OgTag = {
  attributes: {
    content: string;
    property: string;
  };
  tag: string;
  content: null;
};

type TitleTag = {
  attributes: null;
  tag: string;
  content: string;
};

export type SeoMetaTagType = TitleTag | OgTag | TwitterTag;

export type ToMetaTagsType = SeoMetaTagType[];

export const renderMetaTags = function(data: SeoMetaTagType[]): JSX.Element[] {
  return data.map(({ tag, attributes, content }) => {
    let key: string[] = [tag];

    if (attributes && "property" in attributes) {
      key.push(attributes.property);
    }

    if (attributes && "name" in attributes) {
      key.push(attributes.name);
    }

    const Tag = (tag as 'meta' | 'title');

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

  return " " + Object.entries(attributes).map(([key, value]) => (
    `${key}="${value}"`
  )).join(" ")
}

export const renderMetaTagsToString = function(data: SeoMetaTagType[]) {
  return data.map(({ tag, attributes, content }) => {
    if (content) {
      return `<${tag}${serializeAttributes(attributes)}>${content}</${tag}>`;
    }

    return `<${tag}${serializeAttributes(attributes)} />`;
  }).join("\n");
};