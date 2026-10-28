import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App.jsx';
import { ProgressProvider } from '../src/context/ProgressContext.jsx';
import { renderApp, seed } from './helpers.jsx';
import { STORAGE_KEY } from '../src/context/ProgressContext.jsx';
import config from '../src/config/birthdayConfig.js';

const fill = (u, p) => {
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: u } });
  fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: p } });
  fireEvent.click(screen.getByRole('button', { name: /unlock the surprise/i }));
};

describe('page 1 login', () => {
  it('rejects wrong credentials with a playful message and a hint after two misses', async () => {
    renderApp('/', { loggedIn: false, unlocked: 0 });
    await screen.findByLabelText(/username/i);
    fill('butki', 'wrong');
    expect((await screen.findByRole('alert')).textContent).toMatch(/not the secret password/i);
    fill('butki', 'still wrong');
    await waitFor(() => expect(screen.getByText(config.credentials.hint)).toBeTruthy());
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).loggedIn).toBe(false);
  });

  it('toggles password visibility', async () => {
    renderApp('/', { loggedIn: false, unlocked: 0 });
    const input = await screen.findByLabelText(/^password/i);
    expect(input.type).toBe('password');
    fireEvent.click(screen.getByRole('button', { name: /show password/i }));
    expect(input.type).toBe('text');
    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(input.type).toBe('password');
  });

  it('accepts the configured credentials (case-insensitive), runs the transition, then opens the welcome page and saves progress', async () => {
    renderApp('/', { loggedIn: false, unlocked: 0 });
    await screen.findByLabelText(/username/i);
    fill('  Butki ', '2910');
    expect(await screen.findByText(/opening trushali/i)).toBeTruthy();
    expect(await screen.findByRole('heading', { name: /welcome to trushali's little universe/i }, { timeout: 5000 })).toBeTruthy();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.loggedIn).toBe(true);
    expect(saved.unlocked).toBeGreaterThanOrEqual(1);
  }, 10000);
});

describe('fresh start every time', () => {
  it('ignores old saved progress: opening any page starts at the login form, with no "welcome back" screen', async () => {
    seed({ loggedIn: true, unlocked: 9 });
    render(
      <MemoryRouter initialEntries={['/gallery']}>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByLabelText(/username/i)).toBeTruthy();
    expect(screen.queryByText(/welcome back/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /continue where i left off/i })).toBeNull();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
