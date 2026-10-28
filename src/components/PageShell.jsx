import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import config from '../config/birthdayConfig.js';
import { PAGES } from '../config/pages.js';
import { useProgress } from '../context/ProgressContext.jsx';
import Floaters from './Floaters.jsx';

const THEME_FLOATERS = {
  dawn: ['💗', '✨', '🎀', '🌸'],
  dream: ['⭐', '✨', '💗', '☁️'],
  arcade: ['💗', '✨', '💖'],
  missions: ['💌', '💗', '🌷', '✨'],
  letter: ['🌸', '🌷', '🌼', '💗'],
  garden: ['🌸', '🦋', '🌷', '🌼'],
  scrap: ['⭐', '🎈', '💗', '🌼'],
  compliments: ['💗', '💖', '💕', '✨'],
  gift: ['🎁', '✨', '💗', '🎀'],
  cake: ['🎈', '✨', '🍓', '💗'],
  cinema: ['💗', '💖', '✨', '🦋'],
  night: ['💗', '✨', '🦋'],
};

// Wraps every page: themed background, progress segments, back/next controls, start-over.
export default function PageShell({
  index,
  theme = 'dawn',
  children,
  className = '',
  hideNav = false,
  hideBack = false,
  hideNext = false,
  hideTitle = false,
  nextLabel = 'Next',
  nextDisabled = false,
  nextHint = '',
  onNext,
  floaterCount = 14,
}) {
  const navigate = useNavigate();
  const { unlock, reset } = useProgress();
  const ref = useRef(null);
  const total = PAGES.length;
  const page = PAGES[index];

  useEffect(() => {
    document.title = `${page.title} · ${config.sisterName}'s Little Universe`;
    ref.current?.focus({ preventScroll: true });
  }, [page.title]);

  const goNext = () => {
    if (nextDisabled) return;
    if (onNext && onNext() === false) return;
    unlock(index + 1);
    navigate(PAGES[index + 1].path);
  };
  const goBack = () => navigate(PAGES[index - 1].path);
  const startOver = () => {
    if (window.confirm('Start the adventure again from the beginning? Your saved progress will be cleared.')) {
      navigate(PAGES[1].path);
      setTimeout(() => reset({ keepLogin: true }), 700);
    }
  };

  return (
    <motion.main
      ref={ref}
      id="main"
      tabIndex={-1}
      className={`shell ${className}`}
      data-theme={theme}
      initial={{ opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.01 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <Floaters items={THEME_FLOATERS[theme] || THEME_FLOATERS.dawn} count={floaterCount} />

      <header className="shell-top">
        <p className="shell-step">
          {hideTitle ? <span /> : <><span aria-hidden="true">{page.emoji}</span> {page.title}</>}
          <span className="shell-count">Page {index + 1} of {total}</span>
        </p>
        <div
          className="shell-bar"
          role="progressbar"
          aria-label="Adventure progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
        >
          {PAGES.map((p, i) => (
            <i key={p.path} className={i <= index ? 'on' : ''} />
          ))}
        </div>
      </header>

      <div className="stage">{children}</div>

      <footer className="shell-nav">
        {!hideNav && (
          <div className="shell-buttons">
            {!hideBack && index > 0 && (
              <button type="button" className="btn btn-ghost" onClick={goBack}>
                <span aria-hidden="true">←</span> Back
              </button>
            )}
            {!hideNext && index < total - 1 && (
              <button type="button" className="btn btn-glow" onClick={goNext} disabled={nextDisabled}>
                {nextLabel} <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        )}
        {nextDisabled && nextHint && <p className="shell-hint" role="status">{nextHint}</p>}
        {index > 0 && (
          <button type="button" className="link-btn" onClick={startOver}>
            ↺ Start the adventure over
          </button>
        )}
      </footer>
    </motion.main>
  );
}
