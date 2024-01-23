import { mount } from 'enzyme';
import 'intersection-observer';
import * as React from 'react';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import { Image } from '../index.js';

const data = {
  alt: 'DatoCMS swag',
  aspectRatio: 1.7777777777777777,
  base64:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLFQoLDhgQDg0NDh0eHREYIx8lJCIrHB0dLSs7GikyKSEuKjUlKDk1MjIyHyo4PTc+PDcxPjUBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7OzsvOzs7Ozs7Ozs7Lzs7Ozs7Ozs7OzsvOzs7NTsvLy87NTU1Ly8vLzsvL//AABEIAA0AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAGBwABBP/EACEQAAEEAAYDAAAAAAAAAAAAAAEAAgMEBQYHESEiFWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwL/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIRITH/2gAMAwEAAhEDEQA/AFxLgDWTsAd1J5TGy7hEYqNAaNgECX7sjLMQAHJTEy1Zcarfia4lJMauAxqBhLY6ZlaOzDurWvUOd3jZPfCiEh4xs//Z',
  height: 421,
  sizes: '(max-width: 750px) 100vw, 750px',
  src: 'https://www.datocms-assets.com/205/image.png?ar=16%3A9&fit=crop&w=750',
  srcSet:
    'https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.25&fit=crop&w=750 187w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.5&fit=crop&w=750 375w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.75&fit=crop&w=750 562w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=1&fit=crop&w=750 750w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=1.5&fit=crop&w=750 1125w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=2&fit=crop&w=750 1500w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=3&fit=crop&w=750 2250w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=4&fit=crop&w=750 3000w',
  title: 'These are awesome, we know that.',
  width: 750,
};

const minimalData = {
  base64:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLFQoLDhgQDg0NDh0eHREYIx8lJCIrHB0dLSs7GikyKSEuKjUlKDk1MjIyHyo4PTc+PDcxPjUBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7OzsvOzs7Ozs7Ozs7Lzs7Ozs7Ozs7OzsvOzs7NTsvLy87NTU1Ly8vLzsvL//AABEIAA0AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAGBwABBP/EACEQAAEEAAYDAAAAAAAAAAAAAAEAAgMEBQYHESEiFWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwL/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIRITH/2gAMAwEAAhEDEQA/AFxLgDWTsAd1J5TGy7hEYqNAaNgECX7sjLMQAHJTEy1Zcarfia4lJMauAxqBhLY6ZlaOzDurWvUOd3jZPfCiEh4xs//Z',
  height: 421,
  src: 'https://www.datocms-assets.com/205/image.png?ar=16%3A9&fit=crop&w=750',
  width: 750,
};

const minimalDataWithRelativeUrl = {
  base64:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLFQoLDhgQDg0NDh0eHREYIx8lJCIrHB0dLSs7GikyKSEuKjUlKDk1MjIyHyo4PTc+PDcxPjUBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7OzsvOzs7Ozs7Ozs7Lzs7Ozs7Ozs7OzsvOzs7NTsvLy87NTU1Ly8vLzsvL//AABEIAA0AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAGBwABBP/EACEQAAEEAAYDAAAAAAAAAAAAAAEAAgMEBQYHESEiFWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwL/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIRITH/2gAMAwEAAhEDEQA/AFxLgDWTsAd1J5TGy7hEYqNAaNgECX7sjLMQAHJTEy1Zcarfia4lJMauAxqBhLY6ZlaOzDurWvUOd3jZPfCiEh4xs//Z',
  height: 421,
  src: '/205/image.png?ar=16%3A9&fit=crop&w=750',
  width: 750,
};

describe('Image', () => {
  // intersectionThreshold is an hack to make tests work
  // we need the library to generate a different IntersectionObserver for each test
  // otherwise the IntersectionObserver mocking won't work

  (['intrinsic', 'fixed', 'responsive', 'fill'] as const).forEach((layout) => {
    describe(`layout=${layout}`, () => {
      describe('not visible', () => {
        it('renders the blur-up thumb', () => {
          const wrapper = mount(
            <Image data={data} layout={layout} intersectionThreshold={0.1} />,
          );
          expect(wrapper).toMatchSnapshot();
        });
      });

      describe('visible', () => {
        it('renders the image', () => {
          const wrapper = mount(
            <Image data={data} layout={layout} intersectionThreshold={0.2} />,
          );
          mockAllIsIntersecting(true);
          wrapper.update();
          expect(wrapper).toMatchSnapshot();
        });

        it('renders the image (minimal data)', () => {
          const wrapper = mount(
            <Image
              data={minimalData}
              layout={layout}
              intersectionThreshold={0.2}
            />,
          );
          mockAllIsIntersecting(true);
          wrapper.update();
          expect(wrapper).toMatchSnapshot();
        });

        it('renders the image (relative URL)', () => {
          const wrapper = mount(
            <Image
              data={minimalDataWithRelativeUrl}
              layout={layout}
              intersectionThreshold={0.2}
            />,
          );
          mockAllIsIntersecting(true);
          wrapper.update();
          expect(wrapper).toMatchSnapshot();
        });

        describe('image loaded', () => {
          it('shows the image', () => {
            const wrapper = mount(
              <Image data={data} layout={layout} intersectionThreshold={0.3} />,
            );
            mockAllIsIntersecting(true);
            wrapper.update();
            wrapper.find('img').last().simulate('load');
            wrapper.update();
            expect(wrapper).toMatchSnapshot();
          });
        });
      });
    });
  });
});
