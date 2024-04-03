import { mount } from 'enzyme';
import * as React from 'react';
import { SRCImage } from '../index.js';

const data = {
  alt: 'DatoCMS swag',
  aspectRatio: 1.7777777777777777,
  base64: 'data:image/jpeg;base64,<IMAGE-DATA>',
  height: 421,
  sizes: '(max-width: 750px) 100vw, 750px',
  src: 'https://www.datocms-assets.com/205/image.png?ar=16%3A9&fit=crop&w=750',
  srcSet:
    'https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.25&fit=crop&w=750 187w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.5&fit=crop&w=750 375w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.75&fit=crop&w=750 562w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=1&fit=crop&w=750 750w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=1.5&fit=crop&w=750 1125w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=2&fit=crop&w=750 1500w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=3&fit=crop&w=750 2250w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=4&fit=crop&w=750 3000w',
  title: 'These are awesome, we know that.',
  width: 750,
};

const minimalData = {
  base64: 'data:image/jpeg;base64,<IMAGE-DATA>',
  height: 421,
  src: 'https://www.datocms-assets.com/205/image.png?ar=16%3A9&fit=crop&w=750',
  width: 750,
};

const minimalDataWithRelativeUrl = {
  base64: 'data:image/jpeg;base64,<IMAGE-DATA>',
  height: 421,
  src: '/205/image.png?ar=16%3A9&fit=crop&w=750',
  width: 750,
};

describe('Image', () => {
  describe('full data', () => {
    it('renders correctly', () => {
      const wrapper = mount(<SRCImage data={data} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('minimal data', () => {
    it('renders correctly', () => {
      const wrapper = mount(<SRCImage data={minimalData} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('minimalDataWithRelativeUrl', () => {
    it('renders correctly', () => {
      const wrapper = mount(<SRCImage data={minimalDataWithRelativeUrl} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('passing className and/or style', () => {
    it('renders correctly', () => {
      const wrapper = mount(
        <SRCImage
          data={minimalData}
          className="class-name"
          style={{ border: '1px solid red' }}
        />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('priority=true', () => {
    it('renders correctly', () => {
      const wrapper = mount(<SRCImage data={minimalData} priority={true} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('usePlaceholder=false', () => {
    it('renders correctly', () => {
      const wrapper = mount(
        <SRCImage data={minimalData} usePlaceholder={false} />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('explicit sizes', () => {
    it('renders correctly', () => {
      const wrapper = mount(
        <SRCImage data={minimalData} sizes="(max-width: 600px) 200px, 50vw" />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
