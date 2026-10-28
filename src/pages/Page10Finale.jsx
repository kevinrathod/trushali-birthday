import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import config from '../config/birthdayConfig.js';
import { PAGES } from '../config/pages.js';
import { useProgress } from '../context/ProgressContext.jsx';
import PageShell from '../components/PageShell.jsx';
import Stars from '../components/Stars.jsx';
import Fireworks from '../components/Fireworks.jsx';
import { confettiRain } from '../utils/confetti.js';
import { sfx } from '../utils/sound.js';

const F = config.finale;
const BUTTERFLIES = [0, 1, 2, 3, 4];

export default function Page10Finale() {
  const navigate = useNavigate();
  const { reset } = useProgress();
  const [stage, setStage] = useState(0); // 0 sky, 1 line1, 2 line2, 3 celebration
  const [overlay, setOverlay] = useState(true);
  const stopRain = useRef(null);

  useEffect(() => {
    const t = [
      setTimeout(() => setStage(1), 2500),
      setTimeout(() => setStage(2), 7500),
      setTimeout(() => setStage(3), 13000),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (stage === 3) {
      sfx.win();
      stopRain.current = confettiRain(6500);
    }
    return () => stopRain.current?.();
  }, [stage]);

  const replay = () => {
    reset({ keepLogin: true });
    navigate(PAGES[1].path);
  };

  return (
    <PageShell index={9} theme="night" hideNext floaterCount={14} className="page-finale">
      <Stars count={90} />
      <div className="moon" aria-hidden="true"><i /><i /><i /></div>
      {BUTTERFLIES.map((b) => (
        <span key={b} className="butterfly" style={{ '--i': b }} aria-hidden="true">🦋</span>
      ))}
      <Fireworks />

      <div className="finale-text" aria-live="polite">
        <AnimatePresence mode="wait">
          {stage === 1 && (
            <motion.p key="l1" className="display finale-line" initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 1.4 }}>
              {F.line1}
            </motion.p>
          )}
          {stage >= 2 && (
            <motion.p key="l2" className="display finale-line" initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.4 }}>
              {F.line2}
            </motion.p>
          )}
        </AnimatePresence>
        {stage < 3 && (
          <button type="button" className="link-btn skip" onClick={() => setStage(3)}>Skip to the celebration</button>
        )}
      </div>

      <AnimatePresence>
        {stage === 3 && overlay && (
          <motion.section className="celebration" role="dialog" aria-label="Birthday celebration" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }}>
            <motion.p className="display celebration-title" initial={{ scale: 0.6 }} animate={{ scale: [0.6, 1.08, 1] }} transition={{ duration: 1.1 }}>
              {F.celebration}
            </motion.p>
            <p className="lead">{F.line1}</p>
            <div className="row">
              <button type="button" className="btn btn-glow" onClick={replay}>↻ Replay the birthday adventure</button>
              <button type="button" className="btn btn-ghost" onClick={() => setOverlay(false)}>Watch the sky a little longer</button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {stage === 3 && !overlay && (
        <div className="finale-after">
          <button type="button" className="btn btn-glow" onClick={replay}>↻ Replay the birthday adventure</button>
        </div>
      )}
    </PageShell>
  );
}
