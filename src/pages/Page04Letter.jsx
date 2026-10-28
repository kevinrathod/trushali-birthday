import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import config from '../config/birthdayConfig.js';
import { useProgress } from '../context/ProgressContext.jsx';
import PageShell from '../components/PageShell.jsx';
import Envelope from '../components/Envelope.jsx';
import Typewriter from '../components/Typewriter.jsx';
import { sfx } from '../utils/sound.js';

const L = config.letter;
const FULL_TEXT = [L.greeting, ...L.paragraphs, ...(L.signoff.length ? [L.signoff.join('\n')] : [])].join('\n\n');

export default function Page04Letter() {
  const { state } = useProgress();
  const [open, setOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [typed, setTyped] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const id = setTimeout(() => setShowLetter(true), 900);
    return () => clearTimeout(id);
  }, [open]);

  const revisit = state.unlocked > 3;

  return (
    <PageShell
      index={3}
      theme="letter"
      hideTitle
      nextLabel="Open the memory garden"
      nextDisabled={!typed && !revisit}
      nextHint={open ? 'Read the letter to the end to continue.' : 'Open the envelope to read your letter.'}
      floaterCount={20}
    >
      <h1 className="display page-title">A Letter, Just For You</h1>

      <Envelope
        open={open}
        onOpen={() => { setOpen(true); sfx.chime(); }}
        label="Open the love letter envelope"
        hint="Tap the envelope to open it"
      />

      {showLetter && (
        <motion.article
          className="letter"
          initial={{ opacity: 0, y: 40, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          aria-label="Love letter from your brother"
        >
          <Typewriter text={FULL_TEXT} onDone={() => setTyped(true)} className="letter-text" />
        </motion.article>
      )}
    </PageShell>
  );
}
