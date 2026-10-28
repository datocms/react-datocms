export type Position = { x: number; y: number };

// Storage can be missing (SSR) or throw (private mode, blocked site data): in both
// cases the widget still works, it just doesn't remember anything.

export function readBoolean(key: string, fallback: boolean): boolean {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value === 'true';
  } catch {
    return fallback;
  }
}

export function writeBoolean(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {}
}

export function readPosition(key: string): Position | null {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || 'null');
    return value && Number.isFinite(value.x) && Number.isFinite(value.y)
      ? { x: value.x, y: value.y }
      : null;
  } catch {
    return null;
  }
}

export function writePosition(key: string, value: Position | null): void {
  try {
    if (value) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {}
}

/**
 * Same color as the Content Link overlay borders and "Open in DatoCMS" labels.
 *
 * Copied from @datocms/content-link (src/createController/clickToEdit/constants.ts),
 * which doesn't export it: the darkest-needed HSL lightness (S=100%) that keeps
 * white text at ≥3.5:1 contrast.
 */
export function overlayColor(hue: number): string {
  const hslToRgb = (h: number, l: number) => {
    const a = Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      return l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    };
    return [f(0), f(8), f(4)].map((c) => Math.round(c * 255));
  };
  const luminance = ([r, g, b]: number[]) => {
    const lin = (c: number) =>
      c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    return (
      0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255)
    );
  };

  let lo = 0;
  let hi = 0.5;
  let lightness = 0;
  while (hi - lo > 0.001) {
    const mid = (lo + hi) / 2;
    if (1.05 / (luminance(hslToRgb(hue, mid)) + 0.05) >= 3.5) {
      lightness = mid;
      lo = mid + 0.001;
    } else {
      hi = mid - 0.001;
    }
  }
  return `hsl(${hue}, 100%, ${Math.round(lightness * 100)}%)`;
}
