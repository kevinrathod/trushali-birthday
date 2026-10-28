import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { renderApp } from './helpers.jsx';
import config from '../src/config/birthdayConfig.js';

describe('page 5 love letter', () => {
  it('opens the envelope, types the exact letter, then enables the memory garden button', async () => {
    renderApp('/letter', { loggedIn: true, unlocked: 3 });
    const next = await screen.findByRole('button', { name: /open the memory garden/i });
    expect(next).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /open the love letter envelope/i }));
    expect(await screen.findByRole('button', { name: /show the whole letter/i }, { timeout: 3000 })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /show the whole letter/i }));
    await waitFor(() => expect(screen.getByRole('button', { name: /open the memory garden/i })).not.toBeDisabled());
    const letter = screen.getByLabelText(/love letter from your brother/i);
    expect(letter.textContent).toContain('To My Sweetest Bena, 💗🎀');
    expect(letter.textContent).toContain('You are not just my sister, you are one of the sweetest blessings in my life. 🥹❤️');
    expect(letter.textContent).toContain('your brother. ❤️🫂');
    expect(letter.textContent).not.toMatch(/precious gifts|Your Brother/);
    expect(screen.queryByText(/secret love letter/i)).toBeNull();
  }, 10000);
});

describe('page 6 memory garden', () => {
  it('shows 5 placeholder frames (no invented photos) and a note about it', async () => {
    renderApp('/gallery', { loggedIn: true, unlocked: 4 });
    const items = await screen.findAllByRole('button', { name: /open photo \d+/i });
    expect(items.length).toBe(5);
    // jsdom never loads images, so simulate the browser's "file not found" event for each photo
    document.querySelectorAll('img.photo-img').forEach((img) => fireEvent.error(img));
    expect(await screen.findAllByRole('img', { name: /placeholder for photo/i })).toHaveLength(5);
    expect(screen.getByRole('note').textContent).toMatch(/waiting for photos/i);
  });

  it('opens a lightbox with previous/next, keyboard arrows and Escape', async () => {
    renderApp('/gallery', { loggedIn: true, unlocked: 4 });
    const items = await screen.findAllByRole('button', { name: /open photo \d+/i });
    fireEvent.click(items[0]);
    const dialog = await screen.findByRole('dialog', { name: /photo viewer/i });
    expect(within(dialog).getByText('1 / 5')).toBeTruthy();
    fireEvent.click(within(dialog).getByRole('button', { name: /next photo/i }));
    await waitFor(() => expect(within(dialog).getByText('2 / 5')).toBeTruthy());
    fireEvent.click(within(dialog).getByRole('button', { name: /previous photo/i }));
    fireEvent.click(within(dialog).getByRole('button', { name: /previous photo/i }));
    await waitFor(() => expect(within(dialog).getByText('5 / 5')).toBeTruthy());
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    await waitFor(() => expect(within(dialog).getByText('1 / 5')).toBeTruthy());
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /photo viewer/i })).toBeNull(), { timeout: 3000 });
    expect(config.photos.length).toBe(5);
  });

});
