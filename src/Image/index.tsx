import React, { useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";

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
};

type State = {
  lazyLoad: boolean,
  isSsr: boolean,
  isIntersectionObserverAvailable: boolean,
  inView: boolean,
  loaded: boolean,
};

const imageAddStrategy = ({ lazyLoad, isSsr, isIntersectionObserverAvailable, inView, loaded }: State) => {
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
}

const imageShowStrategy = ({ lazyLoad, isSsr, isIntersectionObserverAvailable, loaded }: State) => {
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
}

export const Image: React.FC<ImagePropTypes> = function({
  className,
  fadeInDuration,
  intersectionTreshold,
  intersectionMargin,
  pictureClassName,
  lazyLoad = true,
  data
}) {
  const [loaded, setLoaded] = useState<boolean>(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const [ref, inView, _entry] = useInView({
    threshold: intersectionTreshold || 0,
    rootMargin: intersectionMargin || "0px 0px 0px 0px",
    triggerOnce: true
  });

  const isSsr = typeof window === "undefined";

  const isIntersectionObserverAvailable =
    isSsr
      ? false
      : !!(window as any).IntersectionObserver;

  const absolutePositioning: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%"
  };

  const addImage = imageAddStrategy({ lazyLoad, isSsr, isIntersectionObserverAvailable, inView, loaded });
  const showImage = imageShowStrategy({ lazyLoad, isSsr, isIntersectionObserverAvailable, inView, loaded });

  const webpSource = data.webpSrcSet && (
    <source srcSet={data.webpSrcSet} sizes={data.sizes} type="image/webp" />
  );

  const regularSource = data.srcSet && (
    <source srcSet={data.srcSet} sizes={data.sizes} />
  );

  const placeholder = <div
    style={{
      paddingTop: `${100.0 / data.aspectRatio}%`,
      backgroundImage: data.base64 ? `url(${data.base64})` : null,
      backgroundColor: data.bgColor,
      backgroundSize: "cover"
    }}
  />;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        display: "block",
        overflow: "hidden",
        maxWidth: `${data.width}px`,
      }}
    >
      {placeholder}
      {addImage && (
        <picture
          className={pictureClassName}
          style={{
            ...absolutePositioning,
            opacity: showImage ? 1 : 0,
            transition:
              !fadeInDuration || fadeInDuration > 0
                ? `opacity ${fadeInDuration || 500}ms`
                : null
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
            />
          )}
        </picture>
      )}
      <noscript>
        <picture className={pictureClassName} style={absolutePositioning}>
          {webpSource}
          {regularSource}
          {data.src && <img src={data.src} alt={data.alt} title={data.title} />}
        </picture>
      </noscript>
    </div>
  );
};
