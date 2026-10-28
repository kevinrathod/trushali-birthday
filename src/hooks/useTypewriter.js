import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useMedia.js';

// Types `text` out a couple of characters at a time. `skip()` shows everything.
export function useTypewriter(text, { start = true, onDone } = {}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const doneRef = useRef(false);
  const chars = Array.from(text); // whole characters, so emoji are never cut in half
  const total = chars.length;
  const cb = useRef(onDone);
  cb.current = onDone;

  useEffect(() => {
    if (!start) return undefined;
    if (reduced || skipped) {
      setCount(total);
      return undefined;
    }
    let i = 0;
    const id = setInterval(() => {
      i = Math.min(total, i + 2);
      setCount(i);
      if (i >= total) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [total, start, reduced, skipped]);

  const done = start && total > 0 && count >= total;
  useEffect(() => {
    if (done && !doneRef.current) {
      doneRef.current = true;
      cb.current?.();
    }
  }, [done]);

  return { shown: chars.slice(0, count).join(''), done, skip: () => setSkipped(true) };
}
