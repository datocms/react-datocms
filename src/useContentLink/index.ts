'use client';

import { type Controller, createController } from '@datocms/content-link';
import { useCallback, useEffect, useRef } from 'react';

// Re-export types and utilities from @datocms/content-link for convenience
export type { Controller } from '@datocms/content-link';
export { decodeStega, stripStega } from '@datocms/content-link';

export type UseContentLinkOptions = {
  /**
   * Whether the controller is enabled, or an options object.
   * - Pass `true` (default): Enables the controller with stega encoding preserved (allows controller recreation)
   * - Pass `false`: Disables the controller completely
   * - Pass `{ stripStega: true }`: Enables the controller and strips stega encoding after stamping
   *
   * When stripStega is false (default): Stega encoding remains in the DOM, allowing controllers
   * to be disposed and recreated on the same page. The invisible characters don't affect display
   * but preserve the source of truth.
   *
   * When stripStega is true: Stega encoding is permanently removed from text nodes, providing
   * clean textContent for programmatic access. However, recreating a controller on the same page
   * won't detect elements since the encoding is lost.
   */
  enabled?: boolean | { stripStega: boolean };
  /** Callback when Web Previews plugin requests navigation */
  onNavigateTo?: (path: string) => void;
  /** Ref to limit scanning to this root instead of document */
  root?: React.RefObject<HTMLElement>;
};

export interface ClickToEditOptions {
  /**
   * Whether to automatically scroll to the nearest editable element if none
   * is currently visible in the viewport when click-to-edit mode is enabled.
   *
   * @default false
   */
  scrollToNearestTarget?: boolean;

  /**
   * Only enable click-to-edit on devices that support hover (i.e., non-touch devices).
   * Uses `window.matchMedia('(hover: hover)')` to detect hover capability.
   *
   * This is useful to avoid showing overlays on touch devices where they may
   * interfere with normal scrolling and tapping behavior.
   *
   * When set to `true` on a touch-only device, click-to-edit will not be
   * automatically enabled, but users can still toggle it manually using
   * the Alt/Option key.
   *
   * @default false
   */
  hoverOnly?: boolean;
}

export type UseContentLinkResult = {
  /** The controller instance, or null if disabled */
  controller: Controller | null;
  /** Enable click-to-edit overlays */
  enableClickToEdit: (options?: ClickToEditOptions) => void;
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
  // Store the callback in a ref to avoid recreating the controller when it changes
  const onNavigateToRef = useRef(onNavigateTo);

  // Keep the callback ref up to date
  useEffect(() => {
    onNavigateToRef.current = onNavigateTo;
  }, [onNavigateTo]);

  // Create/dispose controller based on enabled flag and root only
  // The onNavigateTo callback is accessed via ref, so changes don't trigger recreation
  useEffect(() => {
    // Check if controller is disabled
    const isEnabled =
      enabled === true || (typeof enabled === 'object' && enabled !== null);

    if (!isEnabled) {
      if (controllerRef.current) {
        controllerRef.current.dispose();
        controllerRef.current = null;
      }
      return;
    }

    // Extract stripStega option if enabled is an object
    const stripStega = typeof enabled === 'object' ? enabled.stripStega : false;

    const controller = createController({
      onNavigateTo: (path: string) => onNavigateToRef.current?.(path),
      root: root?.current || undefined,
      stripStega,
    });

    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, [enabled, root]);

  // Stable method references that call through to the controller
  const enableClickToEdit = useCallback((opts?: ClickToEditOptions) => {
    // If hoverOnly is true, check if the device supports hover
    if (opts?.hoverOnly) {
      const supportsHover =
        typeof window !== 'undefined' &&
        window.matchMedia('(hover: hover)').matches;
      if (!supportsHover) {
        // Don't enable click-to-edit on touch-only devices
        return;
      }
    }

    controllerRef.current?.enableClickToEdit(
      opts?.scrollToNearestTarget ? { scrollToNearestTarget: true } : undefined,
    );
  }, []);

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
