import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import config from '../config/birthdayConfig.js';
import { useProgress } from '../context/ProgressContext.jsx';
import PageShell from '../components/PageShell.jsx';
import HeartIcon from '../components/HeartIcon.jsx';
import { fireConfetti } from '../utils/confetti.js';
import { range, shuffle } from '../utils/random.js';
import { sfx } from '../utils/sound.js';

const LIST = config.compliments;
const TOTAL = LIST.length;

export default function Page06Compliments() {
  const { state, update } = useProgress();
  const [current, setCurrent] = useState(null);
  const [burst, setBurst] = useState(0);
  const deck = useRef([]); // shuffled indexes still to be shown in this round
  const found = state.discovered.length;
  const complete = found >= TOTAL;

  const reveal = () => {
    if (deck.current.length === 0) {
      const unseen = range(TOTAL).filter((i) => !state.discovered.includes(i));
      // Everything already seen -> start a fresh shuffled round (avoid repeating the last one right away).
      deck.current = shuffle(unseen.length ? unseen : range(TOTAL).filter((i) => i !== current));
    }
    const [next, ...rest] = deck.current;
    deck.current = rest;
    setCurrent(next);
    setBurst((b) => b + 1);
    sfx.pop();
    update((s) => (s.discovered.includes(next) ? {} : { discovered: [...s.discovered, next] }));
    if (!state.discovered.includes(next) && state.discovered.length + 1 === TOTAL) {
      fireConfetti({ count: 200 });
      sfx.win();
    }
  };

  return (
    <PageShell index={5} theme="compliments" nextLabel="Open your gift" floaterCount={16}>
      <h1 className="display page-title">Reasons You&apos;re Absolutely Amazing!</h1>
      <p className="lead">Tap the heart. Every tap reveals a brand-new reason.</p>

      <p className="chip" aria-live="polite">💗 {Math.min(found, TOTAL)} of {TOTAL} discovered</p>

      <div className="compliment-stage">
        <button type="button" className="big-heart" onClick={reveal} aria-label="Reveal a reason you are amazing">
          <motion.span key={burst} className="big-heart-inner" initial={{ scale: burst ? 0.85 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
            <HeartIcon />
          </motion.span>
        </button>

        <div className="compliment-card glass" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait">
            <motion.p
              key={current ?? 'idle'}
              className="display compliment-text"
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {current === null ? 'Tap the heart to begin ✨' : LIST[current]}
            </motion.p>
          </AnimatePresence>
        </div>
        {complete && <p className="chip gold" role="status">You found every reason! Keep tapping, there are always more. 💖</p>}
      </div>

      <ul className="collection" aria-label="Discovery progress">
        {LIST.map((_, i) => (
          <li key={i} className={state.discovered.includes(i) ? 'on' : ''} aria-hidden="true">💗</li>
        ))}
      </ul>
    </PageShell>
  );
}
