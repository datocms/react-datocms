// biome-ignore lint/style/useImportType: wrong warning
import React, { HTMLAttributeReferrerPolicy } from 'react';
import type { ResponsiveImageType } from '../Image/index.js';
import { buildRegularSource, buildWebpSource, priorityProp } from './utils.js';

export type RSCImagePropTypes = {
  /** The actual response you get from a DatoCMS `responsiveImage` GraphQL query */
  data: ResponsiveImageType;
  /** Additional CSS className for the root <picture> tag */
  pictureClassName?: string;
  /** Additional CSS rules to add to the root <picture> tag */
  pictureStyle?: React.CSSProperties;
  /** Additional CSS className for the <img> tag */
  imgClassName?: string;
  /** Additional CSS rules to add to the <img> tag */
  imgStyle?: React.CSSProperties;
  /**
   * When true, the image will be considered high priority. Lazy loading is automatically disabled, and fetchpriority="high" is added to the image.
   * You should use the priority property on any image detected as the Largest Contentful Paint (LCP) element. It may be appropriate to have multiple priority images, as different images may be the LCP element for different viewport sizes.
   * Should only be used when the image is visible above the fold.
   **/
  priority?: boolean;
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

export function RSCImage({
  pictureClassName,
  pictureStyle,
  imgClassName,
  imgStyle,
  data,
  usePlaceholder = true,
  priority = false,
  sizes,
  srcSetCandidates = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4],
  referrerPolicy = 'no-referrer-when-downgrade',
}: RSCImagePropTypes) {
  // When no explicit `sizes` is given, default lazy images to `sizes="auto"`
  // so the browser picks the optimal `srcset` candidate from the rendered
  // width. Per the HTML spec, `auto` only engages when the `<img>` itself
  // "allows auto-sizes" (loading="lazy" AND a `sizes` starting with `auto`),
  // and a `<source>`'s `auto` only takes effect when its sibling `<img>` does
  // too — so `resolvedSizes` is applied to both the sources and the `<img>`
  // below. Skipped for `priority` (eager) images, where `auto` is invalid; the
  // `, 100vw` fallback preserves prior behavior on unsupporting browsers.
  const resolvedSizes =
    sizes ?? data.sizes ?? (priority ? undefined : 'auto, 100vw');

  const webpSource = buildWebpSource(data, resolvedSizes);
  const regularSource = buildRegularSource(
    data,
    resolvedSizes,
    srcSetCandidates,
  );

  const placeholderStyle: React.CSSProperties | undefined =
    usePlaceholder && data.base64
      ? {
          backgroundImage: `url("${data.base64}")`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '50% 50%',
          color: 'transparent',
        }
      : usePlaceholder && data.bgColor
        ? { backgroundColor: data.bgColor ?? undefined, color: 'transparent' }
        : undefined;

  const { width } = data;

  const height =
    data.height ?? Math.round(data.aspectRatio ? width / data.aspectRatio : 0);

  const sizingStyle = {
    aspectRatio: `${width} / ${height}`,
    width: '100%',
    maxWidth: `${width}px`,
    height: 'auto',
  };

  const loadingBehaviourProps = priority
    ? priorityProp(priority ? 'high' : undefined)
    : { loading: 'lazy' };

  return (
    <picture className={pictureClassName} style={pictureStyle}>
      {webpSource}
      {regularSource}
      {data.src && (
        // biome-ignore lint/a11y/useAltText: We do with alt the best we can
        <img
          src={data.src}
          alt={data.alt ?? ''}
          title={data.title ?? undefined}
          sizes={resolvedSizes}
          {...loadingBehaviourProps}
          className={imgClassName}
          style={{
            ...placeholderStyle,
            ...sizingStyle,
            ...imgStyle,
          }}
          referrerPolicy={referrerPolicy}
        />
      )}
    </picture>
  );
}

/**
 * @deprecated Use `RSCImagePropTypes` instead. `SRCImagePropTypes` is kept as an alias for backwards compatibility.
 */
export type SRCImagePropTypes = RSCImagePropTypes;

/**
 * @deprecated Use `RSCImage` instead. `SRCImage` is kept as an alias for backwards compatibility.
 */
export const SRCImage = RSCImage;
