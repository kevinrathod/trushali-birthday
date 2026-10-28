import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderApp } from './helpers.jsx';
import { STORAGE_KEY } from '../src/context/ProgressContext.jsx';
import config from '../src/config/birthdayConfig.js';

const cards = () => [...document.querySelectorAll('.mcard')];

describe('page 3 memory matching game', () => {
  it('deals two cards for every animal', async () => {
    renderApp('/game', { loggedIn: true, unlocked: 2 });
    await screen.findByRole('heading', { name: /match the animals/i });
    const byPair = {};
    cards().forEach((c) => { byPair[c.dataset.pair] = (byPair[c.dataset.pair] || 0) + 1; });
    expect(Object.keys(byPair)).toHaveLength(config.memory.animals.length);
    expect(Object.values(byPair).every((n) => n === 2)).toBe(true);
    expect(screen.getByRole('button', { name: /continue to the letter/i })).toBeDisabled();
  });

  it('a wrong pair flips back, and a right pair stays matched', async () => {
    renderApp('/game', { loggedIn: true, unlocked: 2 });
    await screen.findByRole('heading', { name: /match the animals/i });
    const [first] = cards();
    const other = cards().find((c) => c.dataset.pair !== first.dataset.pair);
    fireEvent.click(first);
    fireEvent.click(other);
    expect(first.className).toContain('is-up');
    await waitFor(() => expect(first.className).not.toContain('is-up'), { timeout: 3000 });
    const twin = cards().find((c) => c !== first && c.dataset.pair === first.dataset.pair);
    fireEvent.click(first);
    fireEvent.click(twin);
    await waitFor(() => expect(first.className).toContain('is-matched'), { timeout: 3000 });
    expect(screen.getByText(/1 \/ 6/)).toBeTruthy();
  }, 10000);

  it('matching every pair reveals the surprise, unlocks the next page and saves it', async () => {
    renderApp('/game', { loggedIn: true, unlocked: 2 });
    await screen.findByRole('heading', { name: /match the animals/i });
    for (let pair = 0; pair < config.memory.animals.length; pair += 1) {
      const [a, b] = cards().filter((c) => c.dataset.pair === String(pair));
      fireEvent.click(a);
      fireEvent.click(b);
      await waitFor(() => expect(a.className).toContain('is-matched'), { timeout: 3000 });
    }
    expect(await screen.findByText(config.memory.surpriseTitle)).toBeTruthy();
    await waitFor(() => expect(screen.getByRole('button', { name: /continue to the letter/i })).not.toBeDisabled());
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.gameWon).toBe(true);
    expect(saved.unlocked).toBeGreaterThanOrEqual(3);
  }, 20000);

  it('restart reshuffles and clears progress; sound toggle works', async () => {
    renderApp('/game', { loggedIn: true, unlocked: 2 });
    await screen.findByRole('heading', { name: /match the animals/i });
    fireEvent.click(cards()[0]);
    fireEvent.click(screen.getByRole('button', { name: /shuffle & restart/i }));
    expect(cards().some((c) => c.className.includes('is-up'))).toBe(false);
    expect(screen.getByText(/0 \/ 6/)).toBeTruthy();
    const snd = screen.getByRole('button', { name: /sound/i });
    const before = snd.getAttribute('aria-pressed');
    fireEvent.click(snd);
    expect(snd.getAttribute('aria-pressed')).not.toBe(before);
  });
});
