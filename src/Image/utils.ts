import { useCallback, useEffect, useState } from 'react';

export const isSsr = typeof window === 'undefined';

export const isIntersectionObserverAvailable = isSsr
  ? false
  : !!window.IntersectionObserver;

export function useImageLoad(
  ref: React.RefObject<HTMLImageElement>,
  callback: (() => void) | undefined,
) {
  const [loaded, setLoaded] = useState(false);

  function handleLoad() {
    setLoaded(true);
    callback?.();
  }

  // https://stackoverflow.com/q/39777833/266535
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (ref.current.complete && ref.current.naturalWidth) {
      handleLoad();
    }
  }, []);

  return [loaded, handleLoad] as const;
}

export function useMergedRef<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return useCallback((element: T) => {
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      if (typeof ref === 'function') ref(element);
      else if (ref && typeof ref === 'object')
        (ref as React.MutableRefObject<T>).current = element;
    }
  }, refs);
}

export const absolutePositioning: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  maxWidth: 'none',
  maxHeight: 'none',
};
