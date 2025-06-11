/* eslint-env browser */

export function getRemSize() {
  if (typeof window === 'undefined') {
    return 16; // Fallback for SSR
  }
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return rootFontSize;
}
