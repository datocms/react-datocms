import * as React from "react";
import { shallow } from "enzyme";
import { renderMetaTags, renderMetaTagsToString, ToMetaTagsType } from "../index";

const metaTags: ToMetaTagsType = [
  {
    attributes: null,
    content: "A new Media Area is online! - DatoCMS",
    tag: "title"
  },
  {
    attributes: {
      property: "og:title",
      content: "A new Media Area is online!"
    },
    content: null,
    tag: "meta"
  },
  {
    attributes: {
      name: "twitter:title",
      content: "A new Media Area is online!"
    },
    content: null,
    tag: "meta"
  }
];

describe("renderMetaTags", () => {
  it("generates an array of meta tags", () => {
    const wrapper = shallow(
      <head>
        {renderMetaTags(metaTags)}
      </head>
    );

    expect(wrapper).toMatchSnapshot();
  });
});

describe("renderMetaTagsToString", () => {
  it("generates an array of meta tags", () => {
    const result = renderMetaTagsToString(metaTags);
    expect(result).toEqual([
      '<title>A new Media Area is online! - DatoCMS</title>',
      '<meta property="og:title" content="A new Media Area is online!" />',
      '<meta name="twitter:title" content="A new Media Area is online!" />',
    ].join("\n"));
  });
});
