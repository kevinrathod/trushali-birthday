import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderApp } from './helpers.jsx';
import config from '../src/config/birthdayConfig.js';
import { STORAGE_KEY } from '../src/context/ProgressContext.jsx';

describe('page 8 compliments', () => {
  it('never repeats a compliment until every one has appeared, and counts discoveries', async () => {
    renderApp('/compliments', { loggedIn: true, unlocked: 5, discovered: [] });
    const total = config.compliments.length;
    const heart = await screen.findByRole('button', { name: /reveal a reason/i });
    const seen = [];
    for (let i = 0; i < total; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: /reveal a reason/i }));
      await waitFor(() => expect(screen.getByText(new RegExp(`${i + 1} of ${total} discovered`))).toBeTruthy());
      const prev = seen[seen.length - 1];
      const text = await waitFor(() => {
        const t = document.querySelector('.compliment-text').textContent;
        expect(config.compliments).toContain(t);
        expect(t).not.toBe(prev);
        return t;
      });
      seen.push(text);
    }
    expect(heart).toBeTruthy();
    expect(new Set(seen).size).toBe(total);
    expect(screen.getByText(/you found every reason/i)).toBeTruthy();
  }, 30000);
});

describe('page 9 gift box', () => {
  it('opens, then each of the three gifts has a working interaction', async () => {
    renderApp('/gift', { loggedIn: true, unlocked: 6 });
    const next = await screen.findByRole('button', { name: /go to the cake/i });
    expect(next).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /open the gift box/i }));
    expect(await screen.findByRole('button', { name: /pull out a happy note/i }, { timeout: 3000 })).toBeTruthy();
    await waitFor(() => expect(screen.getByRole('button', { name: /go to the cake/i })).not.toBeDisabled());

    // jar
    fireEvent.click(screen.getByRole('button', { name: /pull out a happy note/i }));
    await waitFor(() => expect(screen.getByText('1 note read')).toBeTruthy());
    // nicknames: 7 taps find all 7, none repeated, and there is no hug gift any more
    expect(screen.queryByRole('button', { name: /send me a hug/i })).toBeNull();
    for (let i = 1; i <= config.nicknames.length; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: /call me by a nickname/i }));
      await waitFor(() => expect(screen.getByText(`${i} of ${config.nicknames.length} nicknames found`)).toBeTruthy());
    }
    expect([...document.querySelectorAll('.nick-chips li.on')].map((li) => li.textContent).sort()).toEqual([...config.nicknames].sort());
    // wish
    const seal = screen.getByRole('button', { name: /seal my wish/i });
    expect(seal).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText(/type your wish/i), { target: { value: 'More happy days' } });
    fireEvent.click(screen.getByRole('button', { name: /seal my wish/i }));
    expect(await screen.findByText('More happy days')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).wish).toBe('More happy days');
  }, 15000);
});

describe('page 10 cake', () => {
  it('blows out candles to reveal the wish and can replay the celebration', async () => {
    renderApp('/cake', { loggedIn: true, unlocked: 7 });
    const next = await screen.findByRole('button', { name: /read my heartfelt message/i });
    expect(next).toBeDisabled();
    expect(screen.getByRole('img', { name: /5 lit candles/i })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /blow out the candles/i }));
    expect(await screen.findByText('May all your sweetest wishes come true, Trushali!', {}, { timeout: 3000 })).toBeTruthy();
    expect(screen.getByRole('img', { name: /candles blown out/i })).toBeTruthy();
    await waitFor(() => expect(screen.getByRole('button', { name: /read my heartfelt message/i })).not.toBeDisabled());
    fireEvent.click(screen.getByRole('button', { name: /replay celebration/i }));
    await waitFor(() => expect(screen.getByRole('img', { name: /lit candles/i })).toBeTruthy());
    expect(screen.getByRole('button', { name: /blow out the candles/i })).toBeTruthy();
  }, 10000);
});

describe('page 11 and 12', () => {
  it('message page shows the heartfelt text and a button to the finale', async () => {
    renderApp('/message', { loggedIn: true, unlocked: 8 });
    expect(await screen.findByText(/HAPPY BIRTHDAY, MY CUTEST SISTER VANDARI/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /to the grand finale/i })).not.toBeDisabled();
    expect(document.body.textContent).toContain('meri pyari behen');
    expect(document.body.textContent).not.toMatch(/lots and lots of love/i);
    expect(document.body.textContent).not.toMatch(/may not always express my feelings/i);
    expect(document.body.textContent).not.toMatch(/TRUSHALI/);
  });

  it('finale reveals both messages, then the celebration with a working replay button', async () => {
    renderApp('/finale', { loggedIn: true, unlocked: 9 });
    expect(await screen.findByText(config.finale.line1, {}, { timeout: 6000 })).toBeTruthy();
    expect(await screen.findByText(config.finale.line2, {}, { timeout: 8000 })).toBeTruthy();
    expect(config.finale.line2).toBe('THIS LITTLE UNIVERSE WAS CREATED JUST FOR YOU. 🎀');
    expect(document.body.textContent).not.toMatch(/with all my love/i);
    fireEvent.click(await screen.findByRole('button', { name: /skip to the celebration/i }).catch(() => document.body));
    const replay = await screen.findByRole('button', { name: /replay the birthday adventure/i }, { timeout: 8000 });
    fireEvent.click(replay);
    await waitFor(() => expect(screen.getByRole('progressbar', { name: /adventure progress/i })).toHaveAttribute('aria-valuenow', '2'), { timeout: 4000 });
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.unlocked).toBe(1);
    expect(saved.gameWon).toBe(false);
  }, 30000);
});

describe('start over + navigation', () => {
  it('Next and Back buttons move through pages, and start-over resets saved progress', async () => {
    renderApp('/letter', { loggedIn: true, unlocked: 5, gameWon: true });
    expect(await screen.findByRole('button', { name: /open the memory garden/i })).not.toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(await screen.findByRole('heading', { name: /match the animals/i }, { timeout: 3000 })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /start the adventure over/i }));
    expect(await screen.findByRole('heading', { name: /welcome to trushali's little universe/i }, { timeout: 3000 })).toBeTruthy();
    await waitFor(() => expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).unlocked).toBe(1), { timeout: 3000 });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).gameWon).toBe(false);
  }, 10000);
});

describe('music player', () => {
  it('stays harmless when the mp3 is missing and explains how to add it', async () => {
    renderApp('/welcome', { loggedIn: true, unlocked: 1 });
    fireEvent.click(await screen.findByRole('button', { name: /play music/i }));
    expect((await screen.findByRole('status')).textContent).toMatch(/birthday-music\.mp3/i);
    // the rest of the site still works
    expect(screen.getByRole('button', { name: /^✨ start the adventure$/i })).toBeTruthy();
    // mute + volume controls respond
    const mute = screen.getByRole('button', { name: /mute music/i });
    fireEvent.click(mute);
    expect(mute.getAttribute('aria-pressed')).toBe('true');
    fireEvent.change(screen.getByLabelText(/music volume/i), { target: { value: '0.3' } });
    expect(screen.getByLabelText(/music volume/i).value).toBe('0.3');
  });
});
