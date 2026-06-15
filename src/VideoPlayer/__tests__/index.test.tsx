import { mount } from 'enzyme';
import React from 'react';

// The real `@mux/mux-player-react/lazy` ships as an untransformed ESM module
// that jest can't parse, so we mock it with a tiny stand-in that simply
// reflects the props it receives. This lets us mount `<VideoPlayer />` and
// assert which props (e.g. `poster`) end up on the underlying player.
jest.mock('@mux/mux-player-react/lazy', () => {
  const react = require('react');
  return {
    __esModule: true,
    default: react.forwardRef((props: Record<string, unknown>, ref: unknown) =>
      react.createElement('mux-player', { ref, ...props }),
    ),
  };
});

import { VideoPlayer } from '../index.js';

const data = {
  muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
  title: 'Title',
  width: 1080,
  height: 1920,
  thumbnailUrl: 'https://www.datocms-assets.com/205/thumb.jpg',
};

describe('VideoPlayer', () => {
  describe('when data contains `thumbnailUrl`', () => {
    it('uses it as the player `poster`', () => {
      const wrapper = mount(<VideoPlayer data={data} />);

      expect(wrapper.find('mux-player').prop('poster')).toBe(
        'https://www.datocms-assets.com/205/thumb.jpg',
      );
    });

    describe('and a `poster` prop is also passed', () => {
      it('uses the passed `poster` instead of the thumbnail', () => {
        const wrapper = mount(
          <VideoPlayer
            data={data}
            poster="https://www.datocms-assets.com/205/custom.jpg"
          />,
        );

        expect(wrapper.find('mux-player').prop('poster')).toBe(
          'https://www.datocms-assets.com/205/custom.jpg',
        );
      });
    });
  });
});
