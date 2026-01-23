'use client';

import { useEffect } from 'react';
import {
  type UseContentLinkOptions,
  useContentLink,
} from '../useContentLink/index.js';

export type ContentLinkProps = Omit<UseContentLinkOptions, 'enabled'> & {
  /** Current pathname to sync with Web Previews plugin */
  currentPath?: string;
  /** Enable click-to-edit on mount. Pass true for default behavior or an object with scrollToNearestTarget. If undefined, click-to-edit is disabled. */
  enableClickToEdit?: true | { scrollToNearestTarget: true };
  /** Whether to strip stega encoding from text nodes after stamping. */
  stripStega?: boolean;
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
 * @returns null - This component has no visual output
 */
export function ContentLink(props: ContentLinkProps): null {
  const {
    currentPath,
    enableClickToEdit: enableClickToEditOptions,
    stripStega,
    ...useContentLinkOptions
  } = props;

  const { enableClickToEdit, setCurrentPath } = useContentLink({
    ...useContentLinkOptions,
    enabled: stripStega !== undefined ? { stripStega } : true,
  });

  // Sync current path when it changes
  useEffect(() => {
    if (currentPath !== undefined) {
      setCurrentPath(currentPath);
    }
  }, [currentPath, setCurrentPath]);

  // Enable click-to-edit on mount if requested
  useEffect(() => {
    if (enableClickToEditOptions !== undefined) {
      enableClickToEdit(
        enableClickToEditOptions === true
          ? undefined
          : enableClickToEditOptions,
      );
    }
  }, [enableClickToEditOptions, enableClickToEdit]);

  return null;
}
