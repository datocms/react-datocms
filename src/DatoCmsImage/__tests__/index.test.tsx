import * as React from "react";
import { shallow } from "enzyme";
import Image from '../index';

describe("Hello, Enzyme!", () => {
  it("renders", () => {
    const wrapper = shallow(
      <Image />
    );
    expect(wrapper.find("div").html()).toMatch(/Ciao!/);
  });

  it("renders snapshots, too", () => {
    const wrapper = shallow(
      <div>
        <h1>Hello, Enzyme!</h1>
      </div>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
