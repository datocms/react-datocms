import { SRCImage } from 'react-datocms';

const data = {
  srcSet:
    'https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.25&w=600 150w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.5&w=600 300w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.75&w=600 450w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?w=600 600w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=1.5&w=600 900w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=2&w=600 1200w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=3&w=600 1800w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=4&w=600 2400w',
  webpSrcSet:
    'https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.25&fm=webp&w=600 150w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.5&fm=webp&w=600 300w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=0.75&fm=webp&w=600 450w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?fm=webp&w=600 600w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=1.5&fm=webp&w=600 900w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=2&fm=webp&w=600 1200w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=3&fm=webp&w=600 1800w,https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?dpr=4&fm=webp&w=600 2400w',
  sizes: '(max-width: 600px) 100vw, 600px',
  src: 'https://www.datocms-assets.com/205/1663750967-black-marker-on-notebook.jpg?w=600',
  width: 600,
  height: 401,
  aspectRatio: 1.4961101137043689,
  alt: 'black marker on notebook',
  title: null,
  bgColor: '#d1ab0f',
  base64:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBg8IExINCQ4XDhgQDQ0NFxMNDQoNFxsZGCIfFiEaHysjGh0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHQ8NHC8cFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABEAGAMBIgACEQEDEQH/xAAZAAACAwEAAAAAAAAAAAAAAAAAAwQFBgH/xAAeEAABBAEFAAAAAAAAAAAAAAAAAQIDBBEFFCMyM//EABYBAQEBAAAAAAAAAAAAAAAAAAECA//EABcRAQEBAQAAAAAAAAAAAAAAAAACEgH/2gAMAwEAAhEDEQA/AN01qCbbWozI3cRK0h3JkWMymOK3Si1bkZgBF6dEAc8OqX0fUXY8zgDwM5qIAAKf/9k=',
};

const dataWithAlpha = {
  srcSet:
    'https://www.datocms-assets.com/205/1712042152-png_transparency_demonstration_1.png?dpr=0.25&w=600 150w,https://www.datocms-assets.com/205/1712042152-png_transparency_demonstration_1.png?dpr=0.5&w=600 300w,https://www.datocms-assets.com/205/1712042152-png_transparency_demonstration_1.png?dpr=0.75&w=600 450w,https://www.datocms-assets.com/205/1712042152-png_transparency_demonstration_1.png?w=600 600w',
  webpSrcSet:
    'https://www.datocms-assets.com/205/1712042152-png_transparency_demonstration_1.png?dpr=0.25&fm=webp&w=600 150w,https://www.datocms-assets.com/205/1712042152-png_transparency_demonstration_1.png?dpr=0.5&fm=webp&w=600 300w,https://www.datocms-assets.com/205/1712042152-png_transparency_demonstration_1.png?dpr=0.75&fm=webp&w=600 450w,https://www.datocms-assets.com/205/1712042152-png_transparency_demonstration_1.png?fm=webp&w=600 600w',
  sizes: '(max-width: 600px) 100vw, 600px',
  src: 'https://www.datocms-assets.com/205/1712042152-png_transparency_demonstration_1.png?w=600',
  width: 600,
  height: 450,
  aspectRatio: 1.3333333333333333,
  alt: null,
  title: null,
  bgColor: '#3837bc',
  base64:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAC4ElEQVR42n2UXXbTQAyFpbHTtCmhFNgsO2ANbBAeOCVpEzuJ4xGfNGM75YGe3Moez9yrv1H77fsP8T8VkwRUsjSWeQZaLGuqmlvAJruamlgqyEkkNxJ2BKa+222QSsveIJ8QIrEGzBpVe2TtgW9teGI28Nyb2RG5HHt5wANJ2YWcg20VbYu3YksEBXkNnnh+SmYf+LZBaEUEfmwggh7/DxDtsxiQExZyj1+WCEJgzMXbkp57CD9C/gl8rvaJVD3y7Y6Q2JYH0YjgFcd34E8F73bAmqfJBSKCu3F0IbTtAY+3yfIz1sm/gi/gGc+3Lo5NniIi6BDYm8kWwg24B+ucQdIDeTvNNVixSq6Jytw9hSEhskoejeQN2HoUpOiBZDeS7Uqh15bN5UZwBj04Qt7mTOlrihw1gihwR3pcpHViOqnDnnkfSNFIBETuxSIHPEYH+c8QMbmQ6RMCnSXpSg201iCPNzWwHu9/JY/EcoOAR9J6ZOoiFBqBEfojxG/48wb5Hr0dOaYOXpcp/xYirfd8IZe4A0QxQPoTm7Au4mkjrfkEuRfaD3SI7OiYFw3YCx7sSmsv6YkUlYtkU9+XC1ZEfke7mpU9ahfKtOaY93XP4R3HHHt82HOo9qbVG+VXxqQtvS1THWYLDgi+Qrxh7S7WNQQ4Jic2HqHrQM9ealX6Umt7Ts+tpfoWiiWKGAVh5Yx1sg40cFxjm6+reCteODJE35d5s7ipZaHNjc03ORQWPbcD/0/o4aUwNmaBC/A00aJ69a6JW1znUK4XLbpoTFKHXeG3yRac8ejorct3WlVW4UoRoNBygLj/v0BTHtK/5E5k5inYMyHGmu9VLMc80p70vkF4DeIbgWmiVgEteRctLVarX4Q8cXZG/Fy9b2KzKAKSC7FU4kmkCEx1aH3BR63WMR1fohUmNY388Rt8kk4vpjKnYxGa0nMz7KZciSz1De7wwua5/u5vvkh6c6n0/buUtb8z6leFffMsMwAAAABJRU5ErkJggg==',
};

export default function SRCImageExamples() {
  return (
    <>
      <div
        className="example"
        data-title="Standard behaviour: scale the dimensions down for smaller viewports, but maintain the original dimensions for larger viewports"
      >
        <SRCImage data={data} />
      </div>

      <div className="example" data-title="Image with transparency">
        <SRCImage data={dataWithAlpha} />
      </div>

      <div
        className="example"
        data-title="Always take full width (scale up for larger viewports)"
      >
        <SRCImage data={data} style={{ maxWidth: 'none' }} />
      </div>

      <div
        className="example"
        data-title="Fill container (ie. to simulate background image)"
      >
        <div
          style={{ position: 'relative', maxWidth: 500, aspectRatio: '1 / 1' }}
        >
          <SRCImage
            data={data}
            style={{
              zIndex: -1,
              position: 'absolute',
              inset: 0,
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              background: 'rgba(0, 0, 0, 0.4)',
              fontSize: '2em',
              fontWeight: 'bold',
            }}
          >
            This is a title
          </div>
        </div>
      </div>
    </>
  );
}
