import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import config from '../config/birthdayConfig.js';
import { useProgress } from '../context/ProgressContext.jsx';
import PageShell from '../components/PageShell.jsx';
import GiftBox from '../components/GiftBox.jsx';
import { fireConfetti } from '../utils/confetti.js';
import { range, shuffle } from '../utils/random.js';
import { sfx } from '../utils/sound.js';

function Jar() {
  const notes = config.happinessJar;
  const deck = useRef([]);
  const [note, setNote] = useState(null);
  const [read, setRead] = useState(0);
  const pull = () => {
    if (deck.current.length === 0) deck.current = shuffle(range(notes.length));
    const [next, ...rest] = deck.current;
    deck.current = rest;
    setNote(next);
    setRead((r) => r + 1);
    sfx.chime();
  };
  return (
    <article className="gift-card glass">
      <h2>🫙 Jar of happiness</h2>
      <div className="jar" aria-hidden="true">
        <span className="jar-lid" />
        <span className="jar-glass">{['💌', '✨', '💗', '🌸', '⭐'].map((e, i) => <i key={e} style={{ '--i': i }}>{e}</i>)}</span>
      </div>
      <button type="button" className="btn" onClick={pull}>Pull out a happy note</button>
      <div className="slip" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p key={note ?? 'none'} initial={{ opacity: 0, y: 16, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0 }}>
            {note === null ? 'The jar is full of tiny notes for you.' : notes[note]}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="mission-tip">{read} note{read === 1 ? '' : 's'} read</p>
    </article>
  );
}

function Nicknames() {
  const list = config.nicknames;
  const deck = useRef([]);
  const [current, setCurrent] = useState(null);
  const [seen, setSeen] = useState([]);
  const call = () => {
    if (deck.current.length === 0) deck.current = shuffle(range(list.length).filter((i) => i !== current));
    const [next, ...rest] = deck.current;
    deck.current = rest;
    setCurrent(next);
    setSeen((s) => (s.includes(next) ? s : [...s, next]));
    sfx.pop();
    if (navigator.vibrate) navigator.vibrate(15);
    if (seen.length + 1 === list.length && !seen.includes(next)) fireConfetti({ count: 90, y: 0.7, power: 0.8 });
  };
  return (
    <article className="gift-card glass">
      <h2>💞 Nicknames</h2>
      <div className="nick-stage" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p key={current ?? 'none'} className="display nick-name" initial={{ opacity: 0, scale: 0.6, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
            {current === null ? 'Who is this? 👀' : list[current]}
          </motion.p>
        </AnimatePresence>
      </div>
      <button type="button" className="btn" onClick={call}>Call me by a nickname</button>
      <ul className="nick-chips" aria-label="Nicknames found">
        {list.map((n, i) => (
          <li key={n} className={seen.includes(i) ? 'on' : ''}>{seen.includes(i) ? n : '?'}</li>
        ))}
      </ul>
      <p className="mission-tip">{seen.length} of {list.length} nicknames found</p>
    </article>
  );
}

function Wish() {
  const { state, update } = useProgress();
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(!state.wish);
  const seal = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    update({ wish: text.trim() });
    setEditing(false);
    setText('');
    sfx.win();
    fireConfetti({ count: 70, y: 0.8, power: 0.7 });
  };
  return (
    <article className="gift-card glass">
      <h2>🌠 Birthday wish</h2>
      <p className="gift-wish">{config.giftWish}</p>
      {editing ? (
        <form onSubmit={seal} className="wish-form">
          <label className="field">
            <span>Make your own secret wish</span>
            <textarea rows="3" maxLength="140" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your wish here…" />
          </label>
          <button type="submit" className="btn" disabled={!text.trim()}>Seal my wish 💫</button>
        </form>
      ) : (
        <div className="sealed" role="status">
          <p>✨ Your sealed wish ✨</p>
          <blockquote>{state.wish}</blockquote>
          <button type="button" className="link-btn" onClick={() => { setText(state.wish); setEditing(true); }}>Change my wish</button>
        </div>
      )}
    </article>
  );
}

export default function Page07Gift() {
  const { state } = useProgress();
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const openBox = () => {
    setOpen(true);
    sfx.win();
    timer.current = setTimeout(() => {
      fireConfetti({ count: 200, y: 0.4 });
      fireConfetti({ count: 60, y: 0.4, power: 0.6 });
    }, 450);
  };

  return (
    <PageShell index={6} theme="gift" nextLabel="Go to the cake" nextDisabled={!open && state.unlocked <= 7} nextHint="Open the gift box first." floaterCount={14}>
      <h1 className="display page-title">A Gift For You</h1>
      <GiftBox open={open} onOpen={openBox} />
      {open && (
        <motion.div className="gifts" initial="hide" animate="show" variants={{ hide: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.5 } } }}>
          {[Jar, Nicknames, Wish].map((G, i) => (
            <motion.div key={i} variants={{ hide: { opacity: 0, y: 40, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}>
              <G />
            </motion.div>
          ))}
        </motion.div>
      )}
    </PageShell>
  );
}
