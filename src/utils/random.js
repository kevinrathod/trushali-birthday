export const rand = (min, max) => Math.random() * (max - min) + min;
export const range = (n) => Array.from({ length: n }, (_, i) => i);
export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
