import React, { useCallback, useState } from "react";
import "intersection-observer";
import { useInView } from "react-intersection-observer";

const isSsr = typeof window === "undefined";
const universalBtoa = isSsr ? (str: string) => Buffer.from(str.toString(), 'binary').toString('base64') : window.btoa;

const isIntersectionObserverAvailable = isSsr
  ? false
  : !!(window as any).IntersectionObserver;

export type ResponsiveImageType = {
  aspectRatio: number;
  base64?: string | null;
  height?: number | null;
  width: number;
  sizes?: string | null;
  src?: string | null;
  srcSet?: string | null;
  webpSrcSet?: string | null;
  bgColor?: string | null;
  alt?: string | null;
  title?: string | null;
};

type ImagePropTypes = {
  data: ResponsiveImageType;
  className?: string;
  pictureClassName?: string;
  fadeInDuration?: number;
  intersectionTreshold?: number;
  intersectionMargin?: string;
  lazyLoad?: boolean;
  style?: React.CSSProperties;
  pictureStyle?: React.CSSProperties;
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
    threshold: intersectionTreshold || 0,
    rootMargin: intersectionMargin || "0px 0px 0px 0px",
    triggerOnce: true,
  });

  const absolutePositioning: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
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

  const placeholder = (
    <div
      style={{
        backgroundImage: data.base64 ? `url(${data.base64})` : null,
        backgroundColor: data.bgColor,
        backgroundSize: "cover",
        opacity: showImage ? 0 : 1,
        transition:
          !fadeInDuration || fadeInDuration > 0
            ? `opacity ${fadeInDuration || 500}ms ${fadeInDuration || 500}ms`
            : null,
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
        <picture
          style={{
            ...absolutePositioning,
            opacity: showImage ? 1 : 0,
            transition:
              !fadeInDuration || fadeInDuration > 0
                ? `opacity ${fadeInDuration || 500}ms`
                : null,
          }}
        >
          {webpSource}
          {regularSource}
          {data.src && (
            <img
              src={data.src}
              alt={data.alt}
              title={data.title}
              onLoad={handleLoad}
              style={{ width: "100%" }}
            />
          )}
        </picture>
      )}
      <noscript>
        <picture className={pictureClassName} style={{ ...pictureStyle }}>
          {webpSource}
          {regularSource}
          {data.src && <img src={data.src} alt={data.alt} title={data.title} />}
        </picture>
      </noscript>
    </div>
  );
};
