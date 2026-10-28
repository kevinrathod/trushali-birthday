import { useEffect, useState } from 'react';

const supported = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function';

export function useMedia(query) {
  const [matches, setMatches] = useState(() => (supported() ? window.matchMedia(query).matches : false));
  useEffect(() => {
    if (!supported()) return undefined;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)');
export const useIsSmall = () => useMedia('(max-width: 640px)');
