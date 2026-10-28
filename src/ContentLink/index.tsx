'use client';

import React, { type ReactElement, useEffect } from 'react';
import {
  type ClickToEditOptions,
  type UseContentLinkOptions,
  useContentLink,
} from '../useContentLink/index.js';
import {
  VisualEditingToggle,
  type VisualEditingToggleOptions,
} from './VisualEditingToggle/index.js';

export * from './VisualEditingToggle/index.js';

export type ContentLinkProps = Omit<UseContentLinkOptions, 'enabled'> & {
  /** Current pathname to sync with Web Previews plugin */
  currentPath?: string;
  /**
   * Whether to enable click-to-edit overlays on mount, or options to configure them.
   *
   * - `true`: Enable click-to-edit mode immediately
   * - `{ scrollToNearestTarget: true }`: Enable and scroll to nearest editable if none visible
   * - `{ hoverOnly: true }`: Only enable on devices with hover capability (non-touch)
   * - `false`/`undefined`: Don't enable automatically (use Alt/Option key to toggle)
   *
   * @example
   * ```tsx
   * <ContentLink enableClickToEdit={true} />
   * <ContentLink enableClickToEdit={{ scrollToNearestTarget: true }} />
   * <ContentLink enableClickToEdit={{ hoverOnly: true, scrollToNearestTarget: true }} />
   * ```
   */
  enableClickToEdit?: boolean | ClickToEditOptions;
  /** Whether to strip stega encoding from text nodes after stamping. */
  stripStega?: boolean;
  /**
   * Hue (0–359) of the overlay accent color.
   * @default 17 (orange)
   */
  hue?: number;
  /**
   * Show a floating toolbar to turn click-to-edit on/off (only render `<ContentLink />`
   * in draft mode). Pass `true`, or options such as `exitDraftModeUrl`.
   *
   * With the toolbar, `enableClickToEdit` becomes the starting state: the editor's
   * own choice is remembered (localStorage) and wins on later visits.
   *
   * @example
   * ```tsx
   * <ContentLink enableClickToEdit toggle={{ exitDraftModeUrl: '/api/draft-mode/disable' }} />
   * ```
   */
  toggle?: boolean | VisualEditingToggleOptions;
};

/**
 * ContentLink component for Visual Editing with DatoCMS.
 *
 * This component enables Visual Editing by:
 * - Detecting stega-encoded metadata in content and creating click-to-edit overlays
 * - Integrating with DatoCMS Web Previews plugin for in-editor editing
 * - Supporting Alt/Option key for temporary click-to-edit mode
 * - Providing bidirectional communication between preview and DatoCMS editor
 *
 * ## Basic Usage (Standalone Website with Click-to-Edit)
 *
 * For standalone websites with click-to-edit overlays:
 *
 * ```tsx
 * import { ContentLink } from 'react-datocms';
 *
 * function App() {
 *   return (
 *     <>
 *       <ContentLink enableClickToEdit={true} />
 *       {/* Your content with stega-encoded data *\/}
 *     </>
 *   );
 * }
 * ```
 *
 * ## Web Previews Plugin Integration (Next.js Example)
 *
 * For integration with DatoCMS Web Previews plugin, provide navigation callbacks:
 *
 * ```tsx
 * 'use client';
 * import { ContentLink } from 'react-datocms';
 * import { useRouter, usePathname } from 'next/navigation';
 *
 * export function VisualEditing() {
 *   const router = useRouter();
 *   const pathname = usePathname();
 *
 *   return (
 *     <ContentLink
 *       onNavigateTo={(path) => router.push(path)}
 *       currentPath={pathname}
 *     />
 *   );
 * }
 * ```
 *
 * ## How Visual Editing Works
 *
 * 1. **Fetch content with stega encoding**: Use the `contentLink` and `baseEditingUrl` options
 *    when fetching content from DatoCMS to embed editing metadata.
 *
 * 2. **Add ContentLink component**: Place this component in your app to scan for encoded
 *    content and create overlays.
 *
 * 3. **Enable editing**: Either set `enableClickToEdit={true}` prop or hold Alt/Option key
 *    for temporary editing mode.
 *
 * 4. **Click to edit**: Click on any content to open the DatoCMS editor at that field.
 *
 * @param props - Configuration props for ContentLink
 * @returns The Visual Editing toolbar when `toggle` is set, otherwise null
 */
export function ContentLink(props: ContentLinkProps): ReactElement | null {
  const {
    currentPath,
    enableClickToEdit: enableClickToEditOptions,
    stripStega,
    hue,
    toggle,
    ...useContentLinkOptions
  } = props;

  const { controller, enableClickToEdit, setCurrentPath } = useContentLink({
    ...useContentLinkOptions,
    enabled: stripStega !== undefined ? { stripStega } : true,
    hue,
  });

  // Sync current path when it changes
  useEffect(() => {
    if (currentPath !== undefined) {
      setCurrentPath(currentPath);
    }
  }, [currentPath, setCurrentPath]);

  // Enable click-to-edit on mount if requested (the toolbar does it itself)
  useEffect(() => {
    if (!enableClickToEditOptions || toggle) {
      return;
    }

    // Never enable click-to-edit inside an iframe
    if (typeof window === 'undefined' || window.parent !== window) {
      return;
    }

    enableClickToEdit(
      enableClickToEditOptions === true ? undefined : enableClickToEditOptions,
    );
  }, [enableClickToEditOptions, enableClickToEdit, toggle]);

  if (!toggle || !controller) {
    return null;
  }

  const clickToEditOptions =
    typeof enableClickToEditOptions === 'object'
      ? enableClickToEditOptions
      : {};

  return (
    <VisualEditingToggle
      {...(toggle === true ? {} : toggle)}
      controller={controller}
      defaultEnabled={Boolean(enableClickToEditOptions)}
      hoverOnly={clickToEditOptions.hoverOnly}
      scrollToNearestTarget={clickToEditOptions.scrollToNearestTarget}
      hue={hue}
    />
  );
}
