import React, { useState, forwardRef, useCallback, CSSProperties } from 'react';
import { useInView } from 'react-intersection-observer';
import { encode } from 'universal-base64';

const isSsr = typeof window === 'undefined';

const isIntersectionObserverAvailable = isSsr
  ? false
  : !!(window as any).IntersectionObserver;

export type ResponsiveImageType = {
  /** The aspect ratio (width/height) of the image */
  aspectRatio: number;
  /** A base64-encoded thumbnail to offer during image loading */
  base64?: string;
  /** The height of the image */
  height?: number;
  /** The width of the image */
  width: number;
  /** The HTML5 `sizes` attribute for the image */
  sizes?: string;
  /** The fallback `src` attribute for the image */
  src?: string;
  /** The HTML5 `srcSet` attribute for the image */
  srcSet?: string;
  /** The HTML5 `srcSet` attribute for the image in WebP format, for browsers that support the format */
  webpSrcSet?: string;
  /** The background color for the image placeholder */
  bgColor?: string;
  /** Alternate text (`alt`) for the image */
  alt?: string;
  /** Title attribute (`title`) for the image */
  title?: string;
};

type ImagePropTypes = {
  /** The actual response you get from a DatoCMS `responsiveImage` GraphQL query */
  data: ResponsiveImageType;
  /** Additional CSS className for root node */
  className?: string;
  /** Additional CSS class for the image inside the `<picture />` tag */
  pictureClassName?: string;
  /** Duration (in ms) of the fade-in transition effect upoad image loading */
  fadeInDuration?: number;
  /** @deprecated Use the intersectionThreshold prop */
  intersectionTreshold?: number;
  /** Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible */
  intersectionThreshold?: number;
  /** Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections */
  intersectionMargin?: string;
  /** Whether enable lazy loading or not */
  lazyLoad?: boolean;
  /** Additional CSS rules to add to the root node */
  style?: React.CSSProperties;
  /** Additional CSS rules to add to the image inside the `<picture />` tag */
  pictureStyle?: React.CSSProperties;
  /**
   * The layout behavior of the image as the viewport changes size
   *
   * Possible values:
   *
   * * `intrinsic` (default): the image will scale the dimensions down for smaller viewports, but maintain the original dimensions for larger viewports
   * * `fixed`: the image dimensions will not change as the viewport changes (no responsiveness) similar to the native img element
   * * `responsive`: the image will scale the dimensions down for smaller viewports and scale up for larger viewports
   * * `fill`: image will stretch both width and height to the dimensions of the parent element, provided the parent element is `relative`
   * */
  layout?: 'intrinsic' | 'fixed' | 'responsive' | 'fill';
  /** Defines how the image will fit into its parent container when using layout="fill" */
  objectFit?: CSSProperties['objectFit'];
  /** Defines how the image is positioned within its parent element when using layout="fill". */
  objectPosition?: CSSProperties['objectPosition'];
  /** Triggered when the image finishes loading */
  onLoad?(): void;
  /** Whether the component should use a blurred image placeholder */
  usePlaceholder?: boolean;
};

type State = {
  lazyLoad: boolean;
  inView: boolean;
  loaded: boolean;
};

const imageAddStrategy = ({ lazyLoad, inView, loaded }: State) => {
  if (!lazyLoad) {
    return true;
  }

  if (isSsr) {
    return false;
  }

  if (isIntersectionObserverAvailable) {
    return inView || loaded;
  }

  return true;
};

const imageShowStrategy = ({ lazyLoad, loaded }: State) => {
  if (!lazyLoad) {
    return true;
  }

  if (isSsr) {
    return false;
  }

  if (isIntersectionObserverAvailable) {
    return loaded;
  }

  return true;
};

export const Image = forwardRef<HTMLDivElement, ImagePropTypes>(
  (
    {
      className,
      fadeInDuration = 500,
      intersectionTreshold,
      intersectionThreshold,
      intersectionMargin,
      pictureClassName,
      lazyLoad = true,
      style,
      pictureStyle,
      layout = 'intrinsic',
      objectFit,
      objectPosition,
      data,
      onLoad,
      usePlaceholder = true,
    },
    ref,
  ) => {
    const [loaded, setLoaded] = useState(false);

    const handleLoad = () => {
      onLoad?.();
      setLoaded(true);
    };

    const [viewRef, inView] = useInView({
      threshold: intersectionThreshold || intersectionTreshold || 0,
      rootMargin: intersectionMargin || '0px 0px 0px 0px',
      triggerOnce: true,
      fallbackInView: true,
    });

    const callbackRef = useCallback(
      (_ref: HTMLDivElement) => {
        viewRef(_ref);
        if (ref) (ref as React.MutableRefObject<HTMLDivElement>).current = _ref;
      },
      [viewRef],
    );

    const absolutePositioning: React.CSSProperties = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    };

    const addImage = imageAddStrategy({
      lazyLoad,
      inView,
      loaded,
    });
    const showImage = imageShowStrategy({
      lazyLoad,
      inView,
      loaded,
    });

    const webpSource = data.webpSrcSet && (
      <source srcSet={data.webpSrcSet} sizes={data.sizes} type="image/webp" />
    );

    const regularSource = data.srcSet && (
      <source srcSet={data.srcSet} sizes={data.sizes} />
    );

    const transition =
      fadeInDuration > 0 ? `opacity ${fadeInDuration}ms` : undefined;

    const placeholder = usePlaceholder ? (
      <img
        role="presentation"
        src={data.base64}
        style={{
          backgroundColor: data.bgColor,
          opacity: showImage ? 0 : 1,
          transition,
          objectFit,
          objectPosition,
          ...absolutePositioning,
        }}
      />
    ) : null;

    const { width, aspectRatio } = data;
    const height = data.height || width / aspectRatio;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;

    const sizer =
      layout !== 'fill' ? (
        <img
          className={pictureClassName}
          style={{
            display: 'block',
            width: '100%',
          }}
          src={`data:image/svg+xml;base64,${encode(svg)}`}
          role="presentation"
        />
      ) : null;

    return (
      <div
        ref={callbackRef}
        className={className}
        style={{
          overflow: 'hidden',
          ...(layout === 'fill'
            ? absolutePositioning
            : layout === 'intrinsic'
            ? { position: 'relative', width: '100%', maxWidth: width }
            : layout === 'fixed'
            ? { position: 'relative', width }
            : { position: 'relative', width: '100%' }),
          ...style,
        }}
      >
        {sizer}
        {placeholder}
        {addImage && (
          <picture>
            {webpSource}
            {regularSource}
            {data.src && (
              <img
                src={data.src}
                alt={data.alt}
                title={data.title}
                onLoad={handleLoad}
                className={pictureClassName}
                style={{
                  opacity: showImage ? 1 : 0,
                  transition,
                  ...absolutePositioning,
                  objectFit,
                  objectPosition,
                  ...pictureStyle,
                }}
              />
            )}
          </picture>
        )}
        <noscript>
          <picture>
            {webpSource}
            {regularSource}
            {data.src && (
              <img
                src={data.src}
                alt={data.alt ?? ''}
                title={data.title}
                className={pictureClassName}
                style={{ ...absolutePositioning, ...pictureStyle }}
                loading="lazy"
              />
            )}
          </picture>
        </noscript>
      </div>
    );
  },
);
