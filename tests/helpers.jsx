import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App.jsx';
import { ProgressProvider, STORAGE_KEY } from '../src/context/ProgressContext.jsx';

export const seed = (patch) => localStorage.setItem(STORAGE_KEY, JSON.stringify({ loggedIn: true, unlocked: 11, ...patch }));

export function renderApp(path = '/', savedState) {
  if (savedState) seed(savedState);
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ProgressProvider persist>
        <App />
      </ProgressProvider>
    </MemoryRouter>,
  );
}
