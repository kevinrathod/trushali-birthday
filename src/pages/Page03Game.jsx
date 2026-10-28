import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import config from '../config/birthdayConfig.js';
import { useProgress } from '../context/ProgressContext.jsx';
import PageShell from '../components/PageShell.jsx';
import { assetUrl } from '../utils/assets.js';
import { fireConfetti } from '../utils/confetti.js';
import { shuffle } from '../utils/random.js';
import { isSoundOn, setSoundOn, sfx } from '../utils/sound.js';

const { animals, surpriseTitle, surpriseText } = config.memory;

// Shows the animal photo if the file exists, otherwise its emoji.
function AnimalFace({ animal }) {
  const [failed, setFailed] = useState(!animal.src);
  if (failed) return <span className="animal-emoji" aria-hidden="true">{animal.emoji}</span>;
  return <img className="animal-img" src={assetUrl(animal.src)} alt="" loading="lazy" draggable="false" onError={() => setFailed(true)} />;
}

const buildDeck = () => shuffle(animals.flatMap((_, i) => [{ id: `${i}a`, pair: i }, { id: `${i}b`, pair: i }]));

export default function Page03Game() {
  const { state, update, unlock } = useProgress();
  const [deck, setDeck] = useState(buildDeck);
  const [up, setUp] = useState([]); // ids currently turned over (not yet matched)
  const [matched, setMatched] = useState([]); // matched pair numbers
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [sound, setSound] = useState(isSoundOn());
  const timers = useRef([]);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const finish = (finalMoves) => {
    setWon(true);
    sfx.win();
    fireConfetti({ count: 180, y: 0.4 });
    update((s) => ({ gameWon: true, bestMoves: s.bestMoves ? Math.min(s.bestMoves, finalMoves) : finalMoves }));
    unlock(3);
  };

  const flip = (card) => {
    if (locked || won || up.includes(card.id) || matched.includes(card.pair)) return;
    sfx.pop();
    const nextUp = [...up, card.id];
    setUp(nextUp);
    if (nextUp.length < 2) return;
    const [a, b] = nextUp.map((id) => deck.find((c) => c.id === id));
    const nowMoves = moves + 1;
    setMoves(nowMoves);
    setLocked(true);
    if (a.pair === b.pair) {
      later(() => {
        const m = [...matched, a.pair];
        setMatched(m);
        setUp([]);
        setLocked(false);
        sfx.gold();
        if (m.length === animals.length) finish(nowMoves);
      }, 500);
    } else {
      later(() => {
        setUp([]);
        setLocked(false);
      }, 950);
    }
  };

  const restart = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDeck(buildDeck());
    setUp([]);
    setMatched([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
  };

  const toggleSound = () => {
    setSoundOn(!sound);
    setSound(!sound);
  };

  return (
    <PageShell
      index={2}
      theme="arcade"
      nextLabel="Continue to the letter"
      nextDisabled={!won && !state.gameWon}
      nextHint="Match all the pairs to unlock the next page."
    >
      <h1 className="display page-title">Match the Animals!</h1>
      <p className="lead">Flip two cards at a time. Find every matching pair to reveal a surprise.</p>

      <div className="memory-hud glass">
        <div className="hud-item"><span className="hud-label">Pairs</span><strong>🐾 {matched.length} / {animals.length}</strong></div>
        <div className="hud-item"><span className="hud-label">Moves</span><strong>{moves}</strong></div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={toggleSound} aria-pressed={sound}>
          {sound ? '🔊 Sound on' : '🔇 Sound off'}
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={restart}>↻ Shuffle &amp; restart</button>
      </div>

      <ul className="memory-grid" aria-label="Memory cards">
        {deck.map((card) => {
          const animal = animals[card.pair];
          const isMatched = matched.includes(card.pair);
          const faceUp = isMatched || up.includes(card.id);
          return (
            <li key={card.id}>
              <button
                type="button"
                className={`mcard${faceUp ? ' is-up' : ''}${isMatched ? ' is-matched' : ''}`}
                data-pair={card.pair}
                onClick={() => flip(card)}
                disabled={isMatched}
                aria-label={faceUp ? `${animal.name}${isMatched ? ', matched' : ''}` : 'Hidden card'}
              >
                <span className="mcard-inner">
                  <span className="mcard-face mcard-front" aria-hidden="true">🎀</span>
                  <span className="mcard-face mcard-back"><AnimalFace animal={animal} /></span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {won && (
          <motion.section className="surprise glass" role="status" initial={{ opacity: 0, y: 24, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 14 }}>
            <h2 className="display">{surpriseTitle}</h2>
            <p>{surpriseText}</p>
            <p className="mission-tip">Finished in {moves} moves</p>
          </motion.section>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
