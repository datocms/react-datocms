'use client';

import { type Controller, createController } from '@datocms/content-link';
import { useCallback, useEffect, useRef } from 'react';

// Re-export types and utilities from @datocms/content-link for convenience
export type { Controller } from '@datocms/content-link';
export { decodeStega, stripStega } from '@datocms/content-link';

export type UseContentLinkOptions = {
  /** Whether the controller is enabled (default: true) */
  enabled?: boolean;
  /** Callback when Web Previews plugin requests navigation */
  onNavigateTo?: (path: string) => void;
  /** Ref to limit scanning to this root instead of document */
  root?: React.RefObject<ParentNode>;
};

export type UseContentLinkResult = {
  /** The controller instance, or null if disabled */
  controller: Controller | null;
  /** Enable click-to-edit overlays */
  enableClickToEdit: (options?: { scrollToNearestTarget: boolean }) => void;
  /** Disable click-to-edit overlays */
  disableClickToEdit: () => void;
  /** Check if click-to-edit is enabled */
  isClickToEditEnabled: () => boolean;
  /** Highlight all editable elements */
  flashAll: (scrollToNearestTarget?: boolean) => void;
  /** Notify Web Previews plugin of current path */
  setCurrentPath: (path: string) => void;
};

/**
 * Hook to control the ContentLink controller for Visual Editing.
 *
 * This hook provides low-level access to the @datocms/content-link controller,
 * allowing you to programmatically control click-to-edit overlays and
 * communicate with the DatoCMS Web Previews plugin.
 *
 * @param options - Configuration options for the controller
 * @returns An object containing the controller instance and its methods
 *
 * @example
 * ```tsx
 * import { useContentLink } from 'react-datocms';
 *
 * function MyComponent() {
 *   const { enableClickToEdit, flashAll } = useContentLink({
 *     onNavigateTo: (path) => router.push(path),
 *   });
 *
 *   return (
 *     <button onClick={() => enableClickToEdit({ scrollToNearestTarget: true })}>
 *       Enable Editing
 *     </button>
 *   );
 * }
 * ```
 */
export function useContentLink(
  options: UseContentLinkOptions = {},
): UseContentLinkResult {
  const { enabled = true, onNavigateTo, root } = options;

  const controllerRef = useRef<Controller | null>(null);

  // Create/dispose controller based on enabled flag and dependencies
  useEffect(() => {
    if (!enabled) {
      if (controllerRef.current) {
        controllerRef.current.dispose();
        controllerRef.current = null;
      }
      return;
    }

    const controller = createController({
      onNavigateTo,
      root: root?.current || undefined,
    });

    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, [enabled, onNavigateTo, root]);

  // Stable method references that call through to the controller
  const enableClickToEdit = useCallback(
    (opts?: { scrollToNearestTarget: boolean }) => {
      controllerRef.current?.enableClickToEdit(opts);
    },
    [],
  );

  const disableClickToEdit = useCallback(() => {
    controllerRef.current?.disableClickToEdit();
  }, []);

  const isClickToEditEnabled = useCallback(() => {
    return controllerRef.current?.isClickToEditEnabled() ?? false;
  }, []);

  const flashAll = useCallback((scrollToNearestTarget?: boolean) => {
    controllerRef.current?.flashAll(scrollToNearestTarget);
  }, []);

  const setCurrentPath = useCallback((path: string) => {
    controllerRef.current?.setCurrentPath(path);
  }, []);

  return {
    controller: controllerRef.current,
    enableClickToEdit,
    disableClickToEdit,
    isClickToEditEnabled,
    flashAll,
    setCurrentPath,
  };
}
