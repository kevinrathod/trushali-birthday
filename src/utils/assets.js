// Turns 'assets/photos/photo-01.jpg' into a URL that works in dev and on GitHub Pages.
export function assetUrl(path = '') {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
