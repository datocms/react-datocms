// Lives inside the widget's Shadow DOM: site CSS can't reach it, and it can't
// reach the site.
export function buildStyles(accent: string): string {
  return `
    :host { all: initial; }
    .widget {
      position: fixed; z-index: 2147483647;
      cursor: grab; touch-action: none; user-select: none;
      display: flex; align-items: center; gap: 10px;
      padding: 6px 6px 6px 8px; border-radius: 6px;
      background: ${accent}; color: #fff;
      font: 600 13px/1.2 system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
      box-shadow: 0 4px 12px rgb(0 0 0 / 0.15), 0 1px 3px rgb(0 0 0 / 0.1);
    }
    .widget.top { top: 16px; }
    .widget.bottom { bottom: 16px; }
    .widget.left { left: 16px; }
    .widget.right { right: 16px; }
    .widget.dragging { cursor: grabbing; box-shadow: 0 8px 24px rgb(0 0 0 / 0.25); }
    .grip { color: rgb(255 255 255 / 0.6); font-size: 12px; letter-spacing: -2px; border-radius: 2px; }
    .grip:focus-visible { outline: 2px solid #fff; outline-offset: 2px; color: #fff; }
    .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
    .text { display: flex; flex-direction: column; gap: 3px; }
    .row { display: flex; align-items: center; gap: 8px; }
    .label { white-space: nowrap; }
    .hint { font-weight: 400; font-size: 11px; color: rgb(255 255 255 / 0.85); white-space: nowrap; }
    .temp .hint { color: #fff; font-weight: 600; }
    button, a {
      all: unset; cursor: pointer; box-sizing: border-box; white-space: nowrap;
      border-radius: 4px; transition: opacity 0.2s;
    }
    button:hover, a:hover { opacity: 0.85; }
    button:active, a:active { opacity: 0.7; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    button:focus-visible, a:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
    .flash { padding: 6px 10px; background: #fff; color: ${accent}; }
    .exit { padding: 5px 9px; border: 1px solid rgb(255 255 255 / 0.7); }
    .switch {
      position: relative; flex: none; width: 32px; height: 18px; border-radius: 18px;
      background: rgb(0 0 0 / 0.25); transition: background 0.2s;
    }
    .switch::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 14px; height: 14px; border-radius: 50%; background: #fff;
      box-shadow: 0 1px 2px rgb(0 0 0 / 0.2); transition: left 0.2s;
    }
    .on .switch { background: #fff; }
    .on .switch::after { left: 16px; background: ${accent}; }
    .collapse {
      width: 26px; height: 26px; display: grid; place-items: center;
      color: #fff; font-size: 16px; font-weight: 400;
    }
    .collapse:hover { background: rgb(0 0 0 / 0.15); opacity: 1; }
  `;
}
