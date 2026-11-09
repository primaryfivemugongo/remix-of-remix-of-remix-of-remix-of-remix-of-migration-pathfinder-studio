export const INSTALL_DELAY_MS = 5 * 60 * 1000;
export const INSTALLED_KEY = 'ft-app-installed';
export const BROWSING_KEY = 'ft-install-browsing-ms';
export const COOKIE_CLOSED_EVENT = 'ft-cookie-notice-closed';

export function readPreference(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function rememberInstalled() {
  try { localStorage.setItem(INSTALLED_KEY, '1'); } catch { /* storage can be disabled */ }
}

export function isInstalled() {
  return readPreference(INSTALLED_KEY) === '1' ||
    ['standalone', 'fullscreen', 'minimal-ui', 'window-controls-overlay'].some(mode =>
      window.matchMedia(`(display-mode: ${mode})`).matches) ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function supportsManualInstall() {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return ios && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);
}