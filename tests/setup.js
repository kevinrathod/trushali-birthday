import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom lacks several browser APIs the site relies on; stub them minimally.
window.matchMedia = window.matchMedia || ((query) => ({
  matches: false, media: query, onchange: null,
  addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; },
}));
window.scrollTo = () => {};
window.confirm = () => true;
HTMLCanvasElement.prototype.getContext = () => null;
class IO {
  constructor(cb) { this.cb = cb; }
  observe(el) { this.cb([{ isIntersecting: true, target: el, intersectionRatio: 1 }]); }
  unobserve() {} disconnect() {}
}
window.IntersectionObserver = IO;
globalThis.IntersectionObserver = IO;
HTMLMediaElement.prototype.pause = () => {};
HTMLMediaElement.prototype.play = () => Promise.reject(new Error('no media in tests'));

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.useRealTimers();
});
