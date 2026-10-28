import React, { type ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ContentLink } from '../index.js';

const mockController = {
  enabled: false,
  enableClickToEdit: jest.fn(() => {
    mockController.enabled = true;
  }),
  disableClickToEdit: jest.fn(() => {
    mockController.enabled = false;
  }),
  isClickToEditEnabled: () => mockController.enabled,
  flashAll: jest.fn(),
  setCurrentPath: jest.fn(),
  dispose: jest.fn(),
};

jest.mock('@datocms/content-link', () => ({
  createController: jest.fn(() => mockController),
}));

let container: HTMLDivElement;

function render(element: ReactElement) {
  act(() => {
    ReactDOM.render(element, container);
  });
}

function toolbar() {
  return document.querySelector('[data-datocms-visual-editing-toggle]');
}

beforeEach(() => {
  localStorage.clear();
  mockController.enabled = false;
  jest.clearAllMocks();
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
  container.remove();
});

describe('ContentLink', () => {
  it('renders no toolbar by default', () => {
    render(<ContentLink enableClickToEdit />);

    expect(toolbar()).toBeNull();
    expect(mockController.enableClickToEdit).toHaveBeenCalledTimes(1);
  });

  it('renders the toolbar with toggle, starting from enableClickToEdit', () => {
    render(<ContentLink enableClickToEdit toggle />);

    expect(toolbar()).not.toBeNull();
    expect(mockController.enableClickToEdit).toHaveBeenCalledTimes(1);
    expect(toolbar()?.shadowRoot?.querySelector('.label')?.textContent).toBe(
      'Visual editing on',
    );
  });

  it('starts off with toggle but no enableClickToEdit', () => {
    render(<ContentLink toggle />);

    expect(mockController.enableClickToEdit).not.toHaveBeenCalled();
    expect(toolbar()?.shadowRoot?.querySelector('.label')?.textContent).toBe(
      'Visual editing off',
    );
  });

  it('passes toggle options through', () => {
    render(
      <ContentLink toggle={{ exitDraftModeUrl: '/api/draft-mode/disable' }} />,
    );

    expect(
      toolbar()?.shadowRoot?.querySelector('.exit')?.getAttribute('href'),
    ).toBe('/api/draft-mode/disable');
  });
});
