import React, { useCallback, useState } from "react";
import "intersection-observer";
import { useInView } from "react-intersection-observer";

const isSsr = typeof window === "undefined";
const universalBtoa = isSsr
  ? (str: string) => Buffer.from(str.toString(), "binary").toString("base64")
  : window.btoa;

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
  /** Wheter enable lazy loading or not */
  lazyLoad?: boolean;
  /** Additional CSS rules to add to the root node */
  style?: React.CSSProperties;
  /** Additional CSS rules to add to the image inside the `<picture />` tag */
  pictureStyle?: React.CSSProperties;
  /** Wheter the image wrapper should explicitely declare the width of the image or keep it fluid */
  explicitWidth?: boolean;
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

export const Image: React.FC<ImagePropTypes> = function ({
  className,
  fadeInDuration,
  intersectionTreshold,
  intersectionThreshold,
  intersectionMargin,
  pictureClassName,
  lazyLoad = true,
  style,
  pictureStyle,
  explicitWidth,
  data,
}) {
  const [loaded, setLoaded] = useState<boolean>(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const [ref, inView, _entry] = useInView({
    threshold: intersectionThreshold || intersectionTreshold || 0,
    rootMargin: intersectionMargin || "0px 0px 0px 0px",
    triggerOnce: true,
  });

  const absolutePositioning: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
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
    typeof fadeInDuration === "undefined" || fadeInDuration > 0
      ? `opacity ${fadeInDuration || 500}ms ${fadeInDuration || 500}ms`
      : undefined;

  const placeholder = (
    <div
      style={{
        backgroundImage: data.base64 ? `url(${data.base64})` : undefined,
        backgroundColor: data.bgColor,
        backgroundSize: "cover",
        opacity: showImage ? 0 : 1,
        transition,
        ...absolutePositioning,
      }}
    />
  );

  const { width, aspectRatio } = data;
  const height = data.height || width / aspectRatio;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;

  const sizer = (
    <img
      className={pictureClassName}
      style={{
        display: "block",
        width: explicitWidth ? `${width}px` : "100%",
        ...pictureStyle,
      }}
      src={`data:image/svg+xml;base64,${universalBtoa(svg)}`}
      role="presentation"
    />
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: explicitWidth ? "inline-block" : "block",
        overflow: "hidden",
        ...style,
        position: "relative",
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
                ...absolutePositioning,
                ...pictureStyle,
                opacity: showImage ? 1 : 0,
                transition,
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
              alt={data.alt}
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
};
