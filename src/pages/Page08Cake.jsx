import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import config from '../config/birthdayConfig.js';
import { useProgress } from '../context/ProgressContext.jsx';
import PageShell from '../components/PageShell.jsx';
import Cake from '../components/Cake.jsx';
import { fireConfetti } from '../utils/confetti.js';
import { sfx } from '../utils/sound.js';

export default function Page08Cake() {
  const { state } = useProgress();
  const [lit, setLit] = useState(true);
  const [replays, setReplays] = useState(0);

  const blow = () => {
    if (!lit) return;
    setLit(false);
    sfx.chime();
    setTimeout(() => fireConfetti({ count: 190, y: 0.35 }), 350);
  };
  const replay = () => {
    setLit(true);
    setReplays((r) => r + 1);
    sfx.win();
    fireConfetti({ count: 120, y: 0.5 });
    setTimeout(() => fireConfetti({ count: 80, x: 0.2, y: 0.6, angle: -1.2, spread: 1 }), 250);
    setTimeout(() => fireConfetti({ count: 80, x: 0.8, y: 0.6, angle: -1.9, spread: 1 }), 450);
  };

  return (
    <PageShell index={7} theme="cake" nextLabel="Read my heartfelt message" nextDisabled={lit && replays === 0 && state.unlocked <= 8} nextHint="Blow out the candles and make a wish first." floaterCount={14}>
      <h1 className="display page-title">Make a Wish!</h1>
      <Cake candles={config.cakeCandles} lit={lit} onCandleClick={blow} />

      <div className="cake-actions">
        {lit ? (
          <button type="button" className="btn btn-glow btn-xl" onClick={blow}>🌬️ Blow Out the Candles</button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={replay}>🎉 Replay celebration</button>
        )}
      </div>

      <div className="cake-wish" aria-live="polite">
        <AnimatePresence>
          {!lit && (
            <motion.p className="display wish-text" initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
              {config.cakeWish}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
