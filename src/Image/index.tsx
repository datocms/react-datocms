'use client';

import React, {
  CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  version,
} from 'react';
import { encode } from 'universal-base64';
import { useInView } from './useInView.js';

const isSsr = typeof window === 'undefined';

const isIntersectionObserverAvailable = isSsr
  ? false
  : !!window.IntersectionObserver;

function fetchPriorityProp(
  fetchPriority?: string,
): Record<string, string | undefined> {
  const [majorStr, minorStr] = version.split('.');
  const major = parseInt(majorStr, 10);
  const minor = parseInt(minorStr, 10);
  if (major > 18 || (major === 18 && minor >= 3)) {
    // In React 18.3.0 or newer, we must use camelCase
    // prop to avoid "Warning: Invalid DOM property".
    // See https://github.com/facebook/react/pull/25927
    return { fetchPriority };
  }
  // In React 18.2.0 or older, we must use lowercase prop
  // to avoid "Warning: Invalid DOM property".
  return { fetchpriority: fetchPriority };
}

type Maybe<T> = T | null;

export type ResponsiveImageType = {
  /** A base64-encoded thumbnail to offer during image loading */
  base64?: Maybe<string>;
  /** The height of the image */
  height?: Maybe<number>;
  /** The width of the image */
  width: number;
  /** The aspect ratio (width/height) of the image */
  aspectRatio?: number;
  /** The HTML5 `sizes` attribute for the image */
  sizes?: Maybe<string>;
  /** The fallback `src` attribute for the image */
  src?: Maybe<string>;
  /** The HTML5 `srcSet` attribute for the image */
  srcSet?: Maybe<string>;
  /** The HTML5 `srcSet` attribute for the image in WebP format, for browsers that support the format */
  webpSrcSet?: Maybe<string>;
  /** The background color for the image placeholder */
  bgColor?: Maybe<string>;
  /** Alternate text (`alt`) for the image */
  alt?: Maybe<string>;
  /** Title attribute (`title`) for the image */
  title?: Maybe<string>;
};

export type ImagePropTypes = {
  /** The actual response you get from a DatoCMS `responsiveImage` GraphQL query */
  data: ResponsiveImageType;
  /** Additional CSS className for root node */
  className?: string;
  /** Additional CSS class for the image inside the `<picture />` tag */
  pictureClassName?: string;
  /** Additional CSS class for the placeholder image */
  placeholderClassName?: string;
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
  /** Additional CSS rules to add to the placeholder image */
  placeholderStyle?: React.CSSProperties;
  /**
   * The layout behavior of the image as the viewport changes size
   *
   * Possible values:
   *
   * * `intrinsic` (default): the image will scale the dimensions down for smaller viewports, but maintain the original dimensions for larger viewports
   * * `fixed`: the image dimensions will not change as the viewport changes (no responsiveness) similar to the native img element
   * * `responsive`: the image will scale the dimensions down for smaller viewports and scale up for larger viewports
   * * `fill`: image will stretch both width and height to the dimensions of the parent element, provided the parent element is `relative`
   **/
  layout?: 'intrinsic' | 'fixed' | 'responsive' | 'fill';
  /** Defines how the image will fit into its parent container when using layout="fill" */
  objectFit?: CSSProperties['objectFit'];
  /** Defines how the image is positioned within its parent element when using layout="fill". */
  objectPosition?: CSSProperties['objectPosition'];
  /** Triggered when the image finishes loading */
  onLoad?(): void;
  /** Whether the component should use a blurred image placeholder */
  usePlaceholder?: boolean;
  /**
   * The HTML5 `sizes` attribute for the image
   *
   * Learn more about srcset and sizes:
   * -> https://web.dev/learn/design/responsive-images/#sizes
   * -> https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
   **/
  sizes?: HTMLImageElement['sizes'];
  /**
   * When true, the image will be considered high priority. Lazy loading is automatically disabled, and fetchpriority="high" is added to the image.
   * You should use the priority property on any image detected as the Largest Contentful Paint (LCP) element. It may be appropriate to have multiple priority images, as different images may be the LCP element for different viewport sizes.
   * Should only be used when the image is visible above the fold.
   **/
  priority?: boolean;
  /**
   * If `data` does not contain `srcSet`, the candidates for the `srcset` of the image will be auto-generated based on these width multipliers
   *
   * Default candidate multipliers are [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4]
   **/
  srcSetCandidates?: number[];
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

const bogusBaseUrl = 'https://example.com/';

const buildSrcSet = (
  src: string | null | undefined,
  width: number | undefined,
  candidateMultipliers: number[],
) => {
  if (!(src && width)) {
    return undefined;
  }

  return candidateMultipliers
    .map((multiplier) => {
      const url = new URL(src, bogusBaseUrl);

      if (multiplier !== 1) {
        url.searchParams.set('dpr', `${multiplier}`);
        const maxH = url.searchParams.get('max-h');
        const maxW = url.searchParams.get('max-w');
        if (maxH) {
          url.searchParams.set(
            'max-h',
            `${Math.floor(parseInt(maxH) * multiplier)}`,
          );
        }
        if (maxW) {
          url.searchParams.set(
            'max-w',
            `${Math.floor(parseInt(maxW) * multiplier)}`,
          );
        }
      }

      const finalWidth = Math.floor(width * multiplier);

      if (finalWidth < 50) {
        return null;
      }

      return `${url.toString().replace(bogusBaseUrl, '/')} ${finalWidth}w`;
    })
    .filter(Boolean)
    .join(',');
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
      lazyLoad: rawLazyLoad = true,
      style,
      pictureStyle,
      layout = 'intrinsic',
      objectFit,
      objectPosition,
      data,
      onLoad,
      usePlaceholder = true,
      priority = false,
      sizes,
      srcSetCandidates = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4],
      placeholderClassName,
      placeholderStyle,
    },
    ref,
  ) => {
    const lazyLoad = priority ? false : rawLazyLoad;

    const [loaded, setLoaded] = useState(false);

    const imageRef = useRef<HTMLImageElement>(null);

    const handleLoad = () => {
      onLoad?.();
      setLoaded(true);
    };

    // https://stackoverflow.com/q/39777833/266535
    useEffect(() => {
      if (!imageRef.current) {
        return;
      }

      if (imageRef.current.complete && imageRef.current.naturalWidth) {
        handleLoad();
      }
    }, []);

    const [viewRef, inView] = useInView({
      threshold: intersectionThreshold || intersectionTreshold || 0,
      rootMargin: intersectionMargin || '0px 0px 0px 0px',
      triggerOnce: true,
      fallbackInView: true,
    });

    const callbackRef = useCallback(
      (_ref: HTMLDivElement) => {
        viewRef(_ref);
        if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement>).current = _ref;
        }
      },
      [viewRef],
    );

    const absolutePositioning: React.CSSProperties = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      maxWidth: 'none',
      maxHeight: 'none',
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
      <source
        srcSet={data.webpSrcSet}
        sizes={sizes ?? data.sizes ?? undefined}
        type="image/webp"
      />
    );

    const regularSource = (
      <source
        srcSet={
          data.srcSet ?? buildSrcSet(data.src, data.width, srcSetCandidates)
        }
        sizes={sizes ?? data.sizes ?? undefined}
      />
    );

    const transition =
      fadeInDuration > 0 ? `opacity ${fadeInDuration}ms` : undefined;

    const placeholder =
      usePlaceholder && (data.bgColor || data.base64) ? (
        <img
          aria-hidden="true"
          alt=""
          src={data.base64 ?? undefined}
          className={placeholderClassName}
          style={{
            backgroundColor: data.bgColor ?? undefined,
            objectFit,
            objectPosition,
            transition,
            opacity: showImage ? 0 : 1,
            // During the opacity transition of the placeholder to the definitive version,
            // hardware acceleration is triggered. This results in the browser trying to render the
            // placeholder with your GPU, causing blurred edges. Solution: style the placeholder
            // so the edges overflow the container
            position: 'absolute',
            left: '-5%',
            top: '-5%',
            width: '110%',
            height: '110%',
            maxWidth: 'none',
            maxHeight: 'none',
            ...placeholderStyle,
          }}
        />
      ) : null;

    const { width, aspectRatio } = data;
    const height = data.height ?? (aspectRatio ? width / aspectRatio : 0);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;

    const sizer =
      layout !== 'fill' ? (
        <img
          className={pictureClassName}
          style={{
            display: 'block',
            width: '100%',
            ...pictureStyle,
          }}
          src={`data:image/svg+xml;base64,${encode(svg)}`}
          aria-hidden="true"
          alt=""
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
              // biome-ignore lint/a11y/useAltText: We do support the `alt` attribute
              <img
                ref={imageRef}
                src={data.src}
                alt={data.alt ?? ''}
                title={data.title ?? undefined}
                onLoad={handleLoad}
                {...fetchPriorityProp(priority ? 'high' : undefined)}
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
              // biome-ignore lint/a11y/useAltText: We do support the `alt` attribute
              <img
                src={data.src}
                alt={data.alt ?? ''}
                title={data.title ?? undefined}
                className={pictureClassName}
                style={{
                  ...absolutePositioning,
                  objectFit,
                  objectPosition,
                  ...pictureStyle,
                }}
                loading={lazyLoad ? 'lazy' : undefined}
                {...fetchPriorityProp(priority ? 'high' : undefined)}
              />
            )}
          </picture>
        </noscript>
      </div>
    );
  },
);
