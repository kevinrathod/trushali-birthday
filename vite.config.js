import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes every asset path relative, so the built site works on
// GitHub Pages under ANY repository name (https://user.github.io/<repo>/)
// without editing this file. Routing uses HashRouter (#/game etc.), so
// refreshing the page on any route never causes a 404 on GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
  },
});
