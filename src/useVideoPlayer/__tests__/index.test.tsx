import { useVideoPlayer } from '..';

describe('useVideoPlayer', () => {
  describe('when data object', () => {
    describe('is complete', () => {
      const data = {
        muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        title: 'Title',
        width: 1080,
        height: 1920,
        blurUpThumb:
          'data:image/bmp;base64,Qk0eAAAAAAAAABoAAAAMAAAAAQABAAEAGAAAAP8A',
        thumbnailUrl: 'https://www.datocms-assets.com/205/thumb.jpg',
      };

      it('unwraps data into props ready for MUX player', () => {
        expect(useVideoPlayer({ data })).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
          title: 'Title',
          style: {
            aspectRatio: '1080 / 1920',
          },
          placeholder:
            'data:image/bmp;base64,Qk0eAAAAAAAAABoAAAAMAAAAAQABAAEAGAAAAP8A',
          poster: 'https://www.datocms-assets.com/205/thumb.jpg',
        });
      });
    });

    describe('contains `thumbnailUrl`', () => {
      const data = {
        muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        thumbnailUrl: 'https://www.datocms-assets.com/205/thumb.jpg',
      };

      it('uses it for `poster`', () => {
        expect(useVideoPlayer({ data })).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
          poster: 'https://www.datocms-assets.com/205/thumb.jpg',
        });
      });
    });

    describe('lacks of `thumbnailUrl` value', () => {
      const data = {
        muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
      };

      it('avoids adding a poster', () => {
        expect(useVideoPlayer({ data })).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        });
      });
    });

    describe('contains `muxPlaybackId`', () => {
      const data = {
        muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
      };

      it('uses it for `playbackId`', () => {
        expect(useVideoPlayer({ data })).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        });
      });
    });

    describe('contains `playbackId`', () => {
      const data = {
        playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
      };

      it('uses it for `playbackId`', () => {
        expect(useVideoPlayer({ data })).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        });
      });
    });

    describe('lacks of `width` and `height` values', () => {
      const data = {
        muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        title: 'Title',
      };

      it('avoids adding aspect ratio', () => {
        expect(useVideoPlayer({ data })).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
          title: 'Title',
        });
      });
    });

    describe('lacks of `title` value', () => {
      const data = {
        muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        width: 1080,
        height: 1920,
      };

      it('avoids adding a title', () => {
        expect(useVideoPlayer({ data })).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
          style: {
            aspectRatio: '1080 / 1920',
          },
        });
      });
    });

    describe('has other keys', () => {
      const data = {
        muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        title: 'Title',
        something: 'Else',
      };

      it('ignores them', () => {
        expect(useVideoPlayer({ data })).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
          title: 'Title',
        });
      });
    });
  });
});
