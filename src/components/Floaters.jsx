import { useMemo } from 'react';
import { useIsSmall, useReducedMotion } from '../hooks/useMedia.js';
import { rand } from '../utils/random.js';

// Floating emoji "particles". Fewer on phones, nearly static when the visitor prefers reduced motion.
export default function Floaters({ items = ['💗', '✨', '🌸', '🦋', '⭐'], count = 18 }) {
  const reduced = useReducedMotion();
  const small = useIsSmall();
  const n = reduced ? Math.min(6, count) : Math.round(count * (small ? 0.55 : 1));
  const key = items.join('');

  const list = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        id: i,
        emoji: items[i % items.length],
        left: rand(2, 96),
        top: rand(8, 88),
        size: rand(16, 34),
        dur: rand(14, 28),
        delay: -rand(0, 28),
        drift: rand(-45, 45),
        opacity: rand(0.45, 0.9),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [n, key],
  );

  return (
    <div className={`floaters${reduced ? ' is-static' : ''}`} aria-hidden="true">
      {list.map((f) => (
        <span
          key={f.id}
          className="floater"
          style={{
            '--l': `${f.left}%`,
            '--t': `${f.top}%`,
            '--s': `${f.size}px`,
            '--d': `${f.dur}s`,
            '--delay': `${f.delay}s`,
            '--x': `${f.drift}px`,
            '--o': f.opacity,
          }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}
