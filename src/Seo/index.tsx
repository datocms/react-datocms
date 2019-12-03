import React from "react";

type TwitterTag = {
  attributes: {
    content: string;
    name: string;
  };
  tag: "meta";
  content: null;
};

type OgTag = {
  attributes: {
    content: string;
    property: string;
  };
  tag: "meta";
  content: null;
};

type TitleTag = {
  attributes: null;
  tag: "title";
  content: string;
};

export type SeoMetaTagType = TitleTag | OgTag | TwitterTag;

export type ToMetaTagsType = SeoMetaTagType[];

export const renderMetaTags = function(data: SeoMetaTagType[]): JSX.Element[] {
  return data.map(({ tag: Tag, attributes, content }) => {
    let key: string[] = [Tag];

    if (attributes && "property" in attributes) {
      key.push(attributes.property);
    }

    if (attributes && "name" in attributes) {
      key.push(attributes.name);
    }

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