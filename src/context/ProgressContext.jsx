import config from '../config/birthdayConfig.js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// All saved progress lives in ONE localStorage key.
export const STORAGE_KEY = 'trushali-birthday-progress-v1';

export const INITIAL = {
  loggedIn: false,
  unlocked: 0, // highest page index the visitor may open (0 = login only)
  gameWon: false, // memory game finished
  bestMoves: 0,
  discovered: [], // indexes of compliments already seen
  wish: '', // wish sealed in the gift box
};

function load(persist) {
  if (!persist) {
    // Fresh start every time: forget anything saved by an older version.
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return INITIAL;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const saved = JSON.parse(raw);
    return { ...INITIAL, ...saved };
  } catch {
    return INITIAL;
  }
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children, persist = config.saveProgress }) {
  const [state, setState] = useState(() => load(persist));

  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable (private mode) - the site still works */
    }
  }, [state, persist]);

  const update = useCallback(
    (patch) => setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) })),
    [],
  );
  const unlock = useCallback((i) => setState((s) => (s.unlocked >= i ? s : { ...s, unlocked: i })), []);
  const login = useCallback(() => setState((s) => ({ ...s, loggedIn: true, unlocked: Math.max(s.unlocked, 1) })), []);
  const reset = useCallback(
    ({ keepLogin = false } = {}) =>
      setState((s) => ({ ...INITIAL, loggedIn: keepLogin && s.loggedIn, unlocked: keepLogin && s.loggedIn ? 1 : 0 })),
    [],
  );

  const value = useMemo(() => ({ state, update, unlock, login, reset }), [state, update, unlock, login, reset]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
