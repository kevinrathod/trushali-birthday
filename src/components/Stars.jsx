import { useMemo } from 'react';
import { useIsSmall } from '../hooks/useMedia.js';
import { rand } from '../utils/random.js';

// Twinkling CSS stars. Pure decoration.
export default function Stars({ count = 60 }) {
  const small = useIsSmall();
  const n = small ? Math.round(count * 0.6) : count;
  const stars = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        top: rand(0, 100),
        size: rand(1.5, 4),
        delay: -rand(0, 6),
        dur: rand(2.5, 6),
      })),
    [n],
  );
  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s) => (
        <i
          key={s.id}
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }}
        />
      ))}
    </div>
  );
}
