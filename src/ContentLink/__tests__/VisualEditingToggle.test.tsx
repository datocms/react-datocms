import type { Controller } from '@datocms/content-link';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  VisualEditingToggle,
  type VisualEditingToggleProps,
} from '../VisualEditingToggle/index.js';
import * as utils from '../VisualEditingToggle/utils.js';

const TOGGLE_EVENT = 'datocms:click-to-edit:toggle';

// Behaves like the real controller: every change dispatches the toggle event.
function fakeController() {
  let enabled = false;
  const set = (value: boolean) => {
    enabled = value;
    document.dispatchEvent(new CustomEvent(TOGGLE_EVENT, { detail: value }));
  };
  return {
    enableClickToEdit: jest.fn(() => set(true)),
    disableClickToEdit: jest.fn(() => set(false)),
    isClickToEditEnabled: () => enabled,
    flashAll: jest.fn(),
    // What the library does while Alt/Option is held
    simulateAlt: (value: boolean) => set(value),
  };
}

type Fake = ReturnType<typeof fakeController>;

let container: HTMLDivElement;

function render(
  controller: Fake,
  props: Partial<VisualEditingToggleProps> = {},
) {
  act(() => {
    ReactDOM.render(
      <VisualEditingToggle
        controller={controller as unknown as Controller}
        {...props}
      />,
      container,
    );
  });
}

function unmount() {
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
}

function shadow(): ShadowRoot | null {
  return (
    document.querySelector('[data-datocms-visual-editing-toggle]')
      ?.shadowRoot ?? null
  );
}

function $(selector: string): HTMLElement | null {
  return shadow()?.querySelector<HTMLElement>(selector) ?? null;
}

function click(selector: string) {
  act(() => {
    $(selector)?.click();
  });
}

function keydown(
  target: EventTarget,
  key: string,
  init: KeyboardEventInit = {},
) {
  act(() => {
    target.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, ...init }),
    );
  });
}

beforeEach(() => {
  localStorage.clear();
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmount();
  container.remove();
});

describe('VisualEditingToggle', () => {
  it('starts on by default and reflects it', () => {
    const controller = fakeController();
    render(controller);

    expect(controller.enableClickToEdit).toHaveBeenCalledTimes(1);
    expect($('.label')?.textContent).toBe('Visual editing on');
    expect($('.switch')?.getAttribute('aria-checked')).toBe('true');
    expect($('.hint')?.textContent).toBe('Hold ⌥ Alt to hide');
  });

  it('respects defaultEnabled=false', () => {
    const controller = fakeController();
    render(controller, { defaultEnabled: false });

    expect(controller.disableClickToEdit).toHaveBeenCalled();
    expect($('.label')?.textContent).toBe('Visual editing off');
    expect(($('.flash') as HTMLButtonElement).disabled).toBe(true);
  });

  it("prefers the editor's saved choice over the default", () => {
    localStorage.setItem('datocms-visual-editing-enabled', 'false');
    const controller = fakeController();
    render(controller, { defaultEnabled: true });

    expect(controller.enableClickToEdit).not.toHaveBeenCalled();
    expect($('.label')?.textContent).toBe('Visual editing off');
  });

  it('switch toggles click-to-edit, saves the choice and announces it', () => {
    const controller = fakeController();
    render(controller);
    expect($('.sr')?.textContent).toBe('');

    click('.switch');

    expect(controller.disableClickToEdit).toHaveBeenCalled();
    expect(localStorage.getItem('datocms-visual-editing-enabled')).toBe(
      'false',
    );
    expect($('.label')?.textContent).toBe('Visual editing off');
    expect($('.sr')?.textContent).toBe('Visual editing off');
  });

  it('shows the temporary Alt/Option state without changing the saved choice', () => {
    const controller = fakeController();
    render(controller);

    keydown(window, 'Alt');
    act(() => controller.simulateAlt(false));

    expect($('.label')?.textContent).toBe('Visual editing off');
    expect($('.hint')?.textContent).toBe('Temporary · release ⌥ Alt to revert');
    expect($('.sr')?.textContent).toBe('Visual editing off, temporarily');

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Alt', bubbles: true }),
      );
      controller.simulateAlt(true);
    });

    expect($('.hint')?.textContent).toBe('Hold ⌥ Alt to hide');
    expect(localStorage.getItem('datocms-visual-editing-enabled')).toBeNull();
  });

  it('treats non-Alt changes from app code as the new state', () => {
    const controller = fakeController();
    render(controller);

    act(() => controller.simulateAlt(false));

    expect($('.label')?.textContent).toBe('Visual editing off');
    expect($('.hint')?.textContent).toBe('Hold ⌥ Alt to peek');
  });

  it('flashes all editable elements', () => {
    const controller = fakeController();
    render(controller);

    click('.flash');

    expect(controller.flashAll).toHaveBeenCalledWith(true);
  });

  it('remembers the collapsed state', () => {
    render(fakeController());

    click('.collapse');

    expect($('.label')).toBeNull();
    expect($('.switch')).not.toBeNull();
    expect($('.collapse')?.getAttribute('aria-expanded')).toBe('false');
    expect(
      localStorage.getItem('datocms-visual-editing-enabled-collapsed'),
    ).toBe('true');

    unmount();
    render(fakeController());

    expect($('.label')).toBeNull();
  });

  it('shows "Exit preview" only with exitDraftModeUrl', () => {
    render(fakeController());
    expect($('.exit')).toBeNull();

    unmount();
    render(fakeController(), { exitDraftModeUrl: '/api/draft-mode/disable' });

    expect($('.exit')?.getAttribute('href')).toBe('/api/draft-mode/disable');
  });

  it('moves with arrow keys on the grip and resets with Home', () => {
    render(fakeController());
    const grip = $('.grip') as HTMLElement;

    keydown(grip, 'ArrowRight', { shiftKey: true });

    expect($('.widget')?.style.left).toBe('50px');
    expect(
      localStorage.getItem('datocms-visual-editing-enabled-position'),
    ).not.toBeNull();

    keydown(grip, 'Home');

    expect($('.widget')?.style.left).toBe('');
    expect(
      localStorage.getItem('datocms-visual-editing-enabled-position'),
    ).toBeNull();
  });

  it('keeps an off-screen saved position inside the viewport', () => {
    localStorage.setItem(
      'datocms-visual-editing-enabled-position',
      JSON.stringify({ x: 5000, y: 5000 }),
    );
    render(fakeController());

    // jsdom has no layout: the widget measures 0×0
    expect($('.widget')?.style.left).toBe(`${window.innerWidth - 8}px`);
    expect($('.widget')?.style.top).toBe(`${window.innerHeight - 8}px`);
    // the saved position is kept, for when the window grows again
    expect(
      localStorage.getItem('datocms-visual-editing-enabled-position'),
    ).toBe(JSON.stringify({ x: 5000, y: 5000 }));
  });

  describe('hoverOnly', () => {
    const original = window.matchMedia;

    beforeEach(() => {
      window.matchMedia = ((query: string) => ({
        matches: query !== '(hover: hover)',
      })) as unknown as typeof window.matchMedia;
    });

    afterEach(() => {
      window.matchMedia = original;
    });

    it('starts off on touch devices', () => {
      const controller = fakeController();
      render(controller, { hoverOnly: true });

      expect(controller.enableClickToEdit).not.toHaveBeenCalled();
      expect($('.label')?.textContent).toBe('Visual editing off');
    });

    it("still uses the editor's saved choice", () => {
      localStorage.setItem('datocms-visual-editing-enabled', 'true');
      const controller = fakeController();
      render(controller, { hoverOnly: true });

      expect(controller.enableClickToEdit).toHaveBeenCalled();
    });
  });

  it('renders nothing and leaves click-to-edit alone inside an iframe', () => {
    // Not by overriding window.parent: on Node 18, jsdom doesn't restore it properly
    const inIframe = jest.spyOn(utils, 'isInIframe').mockReturnValue(true);

    try {
      const controller = fakeController();
      render(controller);

      expect(shadow()).toBeNull();
      expect(controller.enableClickToEdit).not.toHaveBeenCalled();
      expect(controller.disableClickToEdit).not.toHaveBeenCalled();
    } finally {
      unmount();
      inIframe.mockRestore();
    }
  });

  it('removes itself on unmount', () => {
    render(fakeController());
    expect(shadow()).not.toBeNull();

    unmount();

    expect(shadow()).toBeNull();
  });
});
