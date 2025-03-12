'use client';

// biome-ignore lint/style/useImportType: wrong warning
import React, { HTMLAttributeReferrerPolicy } from 'react';
import { type CSSProperties, forwardRef, useRef } from 'react';
import {
  buildRegularSource,
  buildWebpSource,
  priorityProp,
} from '../SRCImage/utils.js';
import { useInView } from './useInView.js';
import {
  absolutePositioning,
  isIntersectionObserverAvailable,
  isSsr,
  universalBtoa,
  useImageLoad,
  useMergedRef,
} from './utils.js';

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
  /** Additional CSS class for the `<picture />` tag */
  pictureClassName?: string;
  /** Additional CSS class for the image inside the `<picture />` tag */
  imgClassName?: string;
  /** Additional CSS class for the placeholder image */
  placeholderClassName?: string;
  /** Duration (in ms) of the fade-in transition effect upon image loading */
  fadeInDuration?: number;
  /** @deprecated Use the intersectionThreshold prop */
  intersectionTreshold?: number;
  /** Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible */
  intersectionThreshold?: number;
  /** Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections */
  intersectionMargin?: string;
  /** Additional CSS rules to add to the root node */
  style?: React.CSSProperties;
  /** Additional CSS rules to add to the `<picture />` tag */
  pictureStyle?: React.CSSProperties;
  /** Additional CSS rules to add to the image inside the `<picture />` tag */
  imgStyle?: React.CSSProperties;
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
  /**
   * Defines which referrer is sent when fetching the image
   * Read more: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#referrerpolicy
   *
   * Defaults to `no-referrer-when-downgrade` to give more useful stats in DatoCMS Project Usages
   **/
  referrerPolicy?: HTMLAttributeReferrerPolicy;
};

type State = {
  priority: boolean;
  inView: boolean;
  loaded: boolean;
};

const imageAddStrategy = ({ priority, inView, loaded }: State) => {
  if (priority) {
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

const imageShowStrategy = ({ priority, loaded }: State) => {
  if (priority) {
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
      imgClassName,
      style,
      pictureStyle,
      imgStyle,
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
      referrerPolicy = 'no-referrer-when-downgrade',
    },
    ref,
  ) => {
    const imageRef = useRef<HTMLImageElement>(null);

    const [loaded, handleLoad] = useImageLoad(imageRef, onLoad);

    const [viewRef, inView] = useInView({
      threshold: intersectionThreshold || intersectionTreshold || 0,
      rootMargin: intersectionMargin || '0px 0px 0px 0px',
      triggerOnce: true,
      fallbackInView: true,
    });

    const rootRef = useMergedRef(ref, viewRef);

    const addImage = imageAddStrategy({ priority, inView, loaded });
    const showImage = imageShowStrategy({ priority, inView, loaded });

    const webpSource = buildWebpSource(data, sizes);
    const regularSource = buildRegularSource(data, sizes, srcSetCandidates);

    const transition =
      fadeInDuration > 0 ? `opacity ${fadeInDuration}ms` : undefined;

    const basePlaceholderStyle: React.CSSProperties = {
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
      height: data.base64 ? 'auto' : '110%',
      maxWidth: 'none',
      maxHeight: 'none',
      ...placeholderStyle,
    };

    const placeholder =
      usePlaceholder && data.base64 ? (
        <img
          aria-hidden="true"
          alt=""
          src={data.base64}
          className={placeholderClassName}
          style={{
            objectFit,
            objectPosition,
            ...basePlaceholderStyle,
          }}
        />
      ) : usePlaceholder && data.bgColor ? (
        <div
          className={placeholderClassName}
          style={{
            backgroundColor: data.bgColor,
            ...basePlaceholderStyle,
          }}
        />
      ) : null;

    const { width, aspectRatio } = data;
    const height = data.height ?? (aspectRatio ? width / aspectRatio : 0);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;

    const sizer =
      layout !== 'fill' ? (
        <img
          className={imgClassName}
          style={{
            display: 'block',
            width: '100%',
            ...imgStyle,
          }}
          src={`data:image/svg+xml;base64,${universalBtoa(svg)}`}
          aria-hidden="true"
          alt=""
        />
      ) : null;

    return (
      <div
        ref={rootRef}
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
          <picture className={pictureClassName} style={pictureStyle}>
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
                {...priorityProp(priority ? 'high' : undefined)}
                className={imgClassName}
                style={{
                  opacity: showImage ? 1 : 0,
                  transition,
                  ...absolutePositioning,
                  objectFit,
                  objectPosition,
                  ...imgStyle,
                }}
                referrerPolicy={referrerPolicy}
              />
            )}
          </picture>
        )}
        <noscript>
          <picture className={pictureClassName} style={pictureStyle}>
            {webpSource}
            {regularSource}
            {data.src && (
              // biome-ignore lint/a11y/useAltText: We do support the `alt` attribute
              <img
                src={data.src}
                alt={data.alt ?? ''}
                title={data.title ?? undefined}
                className={imgClassName}
                style={{
                  ...absolutePositioning,
                  objectFit,
                  objectPosition,
                  ...imgStyle,
                }}
                loading={priority ? undefined : 'lazy'}
                {...priorityProp(priority ? 'high' : undefined)}
                referrerPolicy={referrerPolicy}
              />
            )}
          </picture>
        </noscript>
      </div>
    );
  },
);
