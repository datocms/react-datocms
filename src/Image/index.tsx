import React, { useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";

export type ResponsiveImageType = {
  aspectRatio: number;
  base64?: string | null;
  height: number;
  sizes: string;
  src: string;
  srcSet: string;
  width: number;
  alt?: string | null;
  title?: string | null;
};

type ImagePropTypes = {
  data: ResponsiveImageType;
  className?: string;
  fadeInDuration?: number;
  intersectionTreshold?: number;
  intersectionMargin?: string;
};

export const Image: React.FC<ImagePropTypes> = function({
  className,
  fadeInDuration,
  intersectionTreshold,
  intersectionMargin,
  data: {
    base64,
    width,
    aspectRatio,
    srcSet,
    sizes,
    alt,
    title,
    src
  }
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

  const isIntersectionObserverAvailable = typeof window !== 'undefined' ?
    !!(window as any).IntersectionObserver :
    false;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "block",
        maxWidth: `${width}px`
      }}
    >
      <div
        style={{
          paddingTop: `${100.0 / aspectRatio}%`,
          backgroundImage: base64 ? `url(${base64})` : null,
          backgroundSize: "cover"
        }}
      />
      {(inView || loaded) && (
        <img
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            opacity: loaded ? 1 : 0,
            transition:
              (!fadeInDuration || fadeInDuration > 0)
                ? `opacity ${fadeInDuration || 500}ms`
                : null
          }}
          srcSet={srcSet}
          sizes={sizes}
          src={src}
          alt={alt}
          title={title}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
};
