'use client';

import type { Controller } from '@datocms/content-link';
import React, {
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { buildStyles } from './styles.js';
import {
  type Position,
  isInIframe,
  overlayColor,
  readBoolean,
  readPosition,
  writeBoolean,
  writePosition,
} from './utils.js';

// Dispatched on `document` by @datocms/content-link whenever click-to-edit turns on or
// off, including the temporary Alt/Option state. Not exported by the library.
const TOGGLE_EVENT = 'datocms:click-to-edit:toggle';
const DEFAULT_STORAGE_KEY = 'datocms-visual-editing-enabled';
// Minimum distance from the viewport edges.
const EDGE = 8;
const KEY_STEPS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type VisualEditingTogglePosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left';

export type VisualEditingToggleOptions = {
  /**
   * URL of your app's "disable draft mode" route. When set, the toggle shows an
   * "Exit preview" link pointing to it.
   */
  exitDraftModeUrl?: string;
  /**
   * Corner the toggle starts in (and goes back to on double-click / Home key).
   * @default 'top-right'
   */
  position?: VisualEditingTogglePosition;
  /**
   * localStorage key for the editor's on/off choice. Collapsed state and position
   * are stored under `${storageKey}-collapsed` and `${storageKey}-position`.
   * @default 'datocms-visual-editing-enabled'
   */
  storageKey?: string;
};

export type VisualEditingToggleProps = VisualEditingToggleOptions & {
  /** The Content Link controller, e.g. `useContentLink().controller` */
  controller: Controller;
  /**
   * Whether click-to-edit starts on when the editor hasn't chosen yet.
   * @default true
   */
  defaultEnabled?: boolean;
  /**
   * Start off on devices without hover (touch), like `enableClickToEdit({ hoverOnly: true })`.
   * A choice the editor made with the switch still wins.
   * @default false
   */
  hoverOnly?: boolean;
  /** Scroll to the nearest editable element when click-to-edit starts on. */
  scrollToNearestTarget?: boolean;
  /**
   * Hue (0–359) of the accent color. Pass the same hue as the controller, so the
   * toggle matches the overlays.
   * @default 17 (orange)
   */
  hue?: number;
};

/**
 * Floating toolbar that shows whether Visual Editing (click-to-edit overlays) is on,
 * and lets editors turn it on and off, highlight editable elements and, optionally,
 * exit draft mode.
 *
 * Render it only when draft mode is on. It renders nothing inside iframes, where the
 * Web Previews plugin has its own toggle. Remembers the editor's choice, collapsed
 * state and position in localStorage. Requires React 17 or later.
 *
 * Usually used through `<ContentLink toggle />`.
 */
export function VisualEditingToggle(
  props: VisualEditingToggleProps,
): ReactElement | null {
  const {
    controller,
    defaultEnabled = true,
    hoverOnly = false,
    scrollToNearestTarget = false,
    hue = 17,
    exitDraftModeUrl,
    position = 'top-right',
    storageKey = DEFAULT_STORAGE_KEY,
  } = props;

  const collapsedKey = `${storageKey}-collapsed`;
  const positionKey = `${storageKey}-position`;

  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  // null until the stored preference has been applied to the controller
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [temporary, setTemporary] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const widgetRef = useRef<HTMLDivElement>(null);
  // The editor's chosen state. Holding Alt/Option can temporarily diverge from it.
  const preferredRef = useRef(defaultEnabled);
  // Only an Alt-held divergence is "temporary": anything else (e.g. app code calling
  // enableClickToEdit) becomes the new preferred state for this page view.
  const altHeldRef = useRef(false);
  // Where the editor dropped it (top-left corner, px). null = default corner.
  const positionRef = useRef<Position | null>(null);
  const dragRef = useRef<{ offsetX: number; offsetY: number } | null>(null);
  const announcedRef = useRef<string | null>(null);

  const styles = useMemo(() => buildStyles(overlayColor(hue)), [hue]);

  const sync = useCallback(() => {
    const isEnabled = controller.isClickToEditEnabled();
    if (!altHeldRef.current) {
      preferredRef.current = isEnabled;
    }
    setEnabled(isEnabled);
    setTemporary(altHeldRef.current && isEnabled !== preferredRef.current);
  }, [controller]);

  // Keeps the widget fully on screen. Only the rendered position is clamped: the
  // saved one is kept, so it moves back when the window grows again.
  const applyPosition = useCallback(() => {
    const widget = widgetRef.current;
    if (!widget) {
      return;
    }
    const saved = positionRef.current;
    if (!saved) {
      Object.assign(widget.style, { left: '', top: '', right: '', bottom: '' });
      return;
    }
    const { width, height } = widget.getBoundingClientRect();
    const x = Math.min(
      Math.max(saved.x, EDGE),
      window.innerWidth - width - EDGE,
    );
    const y = Math.min(
      Math.max(saved.y, EDGE),
      window.innerHeight - height - EDGE,
    );
    Object.assign(widget.style, {
      left: `${x}px`,
      top: `${y}px`,
      right: 'auto',
      bottom: 'auto',
    });
  }, []);

  // Rendered position as the editor sees it, saved as the new position.
  const savePosition = useCallback(() => {
    const widget = widgetRef.current;
    if (!widget || !positionRef.current) {
      return;
    }
    const { left, top } = widget.getBoundingClientRect();
    positionRef.current = { x: left, y: top };
    writePosition(positionKey, positionRef.current);
  }, [positionKey]);

  const resetPosition = useCallback(() => {
    positionRef.current = null;
    writePosition(positionKey, null);
    applyPosition();
  }, [positionKey, applyPosition]);

  // Host element + Shadow DOM, top-level window only.
  useEffect(() => {
    if (isInIframe()) {
      return;
    }
    const host = document.createElement('div');
    host.setAttribute('data-datocms-visual-editing-toggle', '');
    const root = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);
    setShadowRoot(root);
    return () => {
      host.remove();
    };
  }, []);

  // Restore collapsed state and position.
  useEffect(() => {
    setExpanded(!readBoolean(collapsedKey, false));
    positionRef.current = readPosition(positionKey);
    applyPosition();
  }, [collapsedKey, positionKey, applyPosition]);

  // Apply the editor's stored choice whenever there's a (new) controller.
  // biome-ignore lint/correctness/useExhaustiveDependencies: defaults only apply on (re)creation
  useEffect(() => {
    if (isInIframe()) {
      return;
    }
    const canHover =
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(hover: hover)').matches;
    const preferred = readBoolean(
      storageKey,
      hoverOnly && !canHover ? false : defaultEnabled,
    );
    preferredRef.current = preferred;
    if (preferred) {
      controller.enableClickToEdit(
        scrollToNearestTarget ? { scrollToNearestTarget } : undefined,
      );
    } else {
      controller.disableClickToEdit();
    }
    sync();
  }, [controller, storageKey]);

  // Follow the controller (Alt/Option, app code) and the Alt key itself.
  useEffect(() => {
    // window + capture phase: runs before the library's own Alt handler (on
    // document), so the toggle event it dispatches already sees altHeld.
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Alt') {
        altHeldRef.current = event.type === 'keydown';
      }
    };
    const onBlur = () => {
      altHeldRef.current = false;
    };
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('keyup', onKey, true);
    window.addEventListener('blur', onBlur);
    document.addEventListener(TOGGLE_EVENT, sync);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('keyup', onKey, true);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener(TOGGLE_EVENT, sync);
    };
  }, [sync]);

  useEffect(() => {
    window.addEventListener('resize', applyPosition);
    return () => window.removeEventListener('resize', applyPosition);
  }, [applyPosition]);

  // Size changes with state (collapse, labels): re-clamp after every render.
  useIsomorphicLayoutEffect(() => {
    applyPosition();
  });

  // Announce changes to screen readers, not the initial state.
  useEffect(() => {
    if (enabled === null) {
      return;
    }
    const state = `${enabled}-${temporary}`;
    if (announcedRef.current !== null && announcedRef.current !== state) {
      setAnnouncement(
        `Visual editing ${enabled ? 'on' : 'off'}${
          temporary ? ', temporarily' : ''
        }`,
      );
    }
    announcedRef.current = state;
  }, [enabled, temporary]);

  const isOnControl = (target: EventTarget) =>
    target instanceof Element && target.closest('button, a') !== null;

  // Drag anywhere on the pill except its controls.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isOnControl(event.target)) {
      return;
    }
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }
    positionRef.current = {
      x: event.clientX - drag.offsetX,
      y: event.clientY - drag.offsetY,
    };
    applyPosition();
  };

  const onPointerUp = () => {
    if (!dragRef.current) {
      return;
    }
    dragRef.current = null;
    setDragging(false);
    savePosition();
  };

  // Listens on the pill itself: pointer capture retargets the dblclick to it.
  const onDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!isOnControl(event.target)) {
      resetPosition();
    }
  };

  // Keyboard equivalent of dragging, on the focusable grip.
  const onGripKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Home') {
      event.preventDefault();
      resetPosition();
      return;
    }
    const step = KEY_STEPS[event.key];
    const widget = widgetRef.current;
    if (!step || !widget) {
      return;
    }
    event.preventDefault();
    const distance = event.shiftKey ? 50 : 10;
    const { left, top } = widget.getBoundingClientRect();
    positionRef.current = {
      x: left + step[0] * distance,
      y: top + step[1] * distance,
    };
    applyPosition();
    savePosition();
  };

  const onSwitchClick = () => {
    const next = !controller.isClickToEditEnabled();
    preferredRef.current = next;
    writeBoolean(storageKey, next);
    if (next) {
      controller.enableClickToEdit();
    } else {
      controller.disableClickToEdit();
    }
    sync();
  };

  const onCollapseClick = () => {
    writeBoolean(collapsedKey, expanded);
    setExpanded(!expanded);
  };

  if (!shadowRoot || enabled === null) {
    return null;
  }

  const className = [
    'widget',
    ...position.split('-'),
    enabled && 'on',
    temporary && 'temp',
    dragging && 'dragging',
  ]
    .filter(Boolean)
    .join(' ');

  return createPortal(
    <>
      <style>{styles}</style>
      <div
        ref={widgetRef}
        className={className}
        role="group"
        aria-label="DatoCMS Visual Editing"
        title="Drag to move · double-click to reset position"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
      >
        <span
          className="grip"
          tabIndex={0}
          role="button"
          aria-label="Move toolbar: arrow keys, Shift for bigger steps, Home to reset"
          onKeyDown={onGripKeyDown}
        >
          ⋮⋮
        </span>
        <span className="text">
          <span className="row">
            {expanded && (
              <span className="label">{`Visual editing ${
                enabled ? 'on' : 'off'
              }`}</span>
            )}
            <button
              className="switch"
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label="Toggle Visual Editing"
              onClick={onSwitchClick}
            />
          </span>
          {expanded && (
            <span className="hint">
              {temporary
                ? 'Temporary · release ⌥ Alt to revert'
                : `Hold ⌥ Alt to ${enabled ? 'hide' : 'peek'}`}
            </span>
          )}
        </span>
        {expanded && (
          <button
            className="flash"
            type="button"
            title="Highlight all editable elements"
            disabled={!enabled}
            onClick={() => controller.flashAll(true)}
          >
            Show editable
          </button>
        )}
        {expanded && exitDraftModeUrl && (
          <a
            className="exit"
            href={exitDraftModeUrl}
            title="Exit draft mode: back to published content"
          >
            Exit preview
          </a>
        )}
        <button
          className="collapse"
          type="button"
          title={expanded ? 'Collapse' : 'Expand'}
          aria-label={expanded ? 'Collapse' : 'Expand'}
          aria-expanded={expanded}
          onClick={onCollapseClick}
        >
          {expanded ? '–' : '+'}
        </button>
        <span className="sr" aria-live="polite">
          {announcement}
        </span>
      </div>
    </>,
    shadowRoot,
  );
}
