import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderApp } from './helpers.jsx';
import { PAGES } from '../src/config/pages.js';
import config from '../src/config/birthdayConfig.js';

describe('all ten pages exist and render', () => {
  PAGES.forEach((page, i) => {
    it(`page ${i + 1}: ${page.title} (${page.path})`, async () => {
      renderApp(page.path, { loggedIn: true, unlocked: 9 });
      await waitFor(() => expect(screen.getByRole('progressbar', { name: /adventure progress/i })).toHaveAttribute('aria-valuenow', String(i + 1)));
      expect(document.querySelector('main#main')).toBeTruthy();
    });
  });

  it('shows the exact required headings/messages', async () => {
    renderApp('/', { loggedIn: false, unlocked: 0 });
    expect(await screen.findByRole('heading', { name: 'Happiest Birthday Trushali!' })).toBeTruthy();
  });

  it('config has 5 photo slots, 7 nicknames and at least 25 unique compliments', () => {
    expect(config.photos.length).toBe(5);
    expect(config.nicknames).toEqual(['Butki', 'Vandari', 'Booni', 'Chachundri', 'Chipakali', 'Moti', 'Sibli']);
    expect(PAGES.length).toBe(10);
    expect(new Set(config.compliments).size).toBe(config.compliments.length);
    expect(config.compliments.length).toBeGreaterThanOrEqual(25);
  });
});

describe('route guards', () => {
  it('sends logged-out visitors to the login page', async () => {
    renderApp('/game', { loggedIn: false, unlocked: 0 });
    expect(await screen.findByLabelText(/username/i)).toBeTruthy();
  });

  it('does not let visitors skip ahead of their progress', async () => {
    renderApp('/finale', { loggedIn: true, unlocked: 2 });
    await waitFor(() => expect(screen.getByRole('progressbar', { name: /adventure progress/i })).toHaveAttribute('aria-valuenow', '3'));
  });

  it('unknown routes fall back to the login page', async () => {
    renderApp('/nope', { loggedIn: false, unlocked: 0 });
    expect(await screen.findByLabelText(/username/i)).toBeTruthy();
  });
});
