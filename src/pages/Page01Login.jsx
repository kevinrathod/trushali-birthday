import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import config from '../config/birthdayConfig.js';
import { PAGES } from '../config/pages.js';
import { useProgress } from '../context/ProgressContext.jsx';
import PageShell from '../components/PageShell.jsx';
import BowIcon from '../components/BowIcon.jsx';
import { fireConfetti } from '../utils/confetti.js';
import { sfx } from '../utils/sound.js';

const FAIL_LINES = [
  'Oops! That is not the secret password, birthday princess. 🙈',
  'Hehe, so close! Try again, the surprise is waiting. 💗',
  'Nope! Even princesses get a second try. 👑',
  'Still locked! Check the hint below. ✨',
];

const norm = (s, cs) => (cs ? s.trim() : s.trim().toLowerCase());

export default function Page01Login() {
  const { login } = useProgress();
  const navigate = useNavigate();
  const controls = useAnimationControls();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [fails, setFails] = useState(0);
  const [success, setSuccess] = useState(false);
  const timer = useRef(null);
  const c = config.credentials;

  useEffect(() => () => clearTimeout(timer.current), []);

  const submit = (e) => {
    e.preventDefault();
    if (success) return;
    const ok = norm(user, c.caseSensitive) === norm(c.username, c.caseSensitive) && norm(pass, c.caseSensitive) === norm(c.password, c.caseSensitive);
    if (!ok) {
      setError(FAIL_LINES[fails % FAIL_LINES.length]);
      setFails((n) => n + 1);
      sfx.lose();
      controls.start({ x: [0, -16, 14, -10, 7, -3, 0], rotate: [0, -2, 2, -1, 1, 0, 0], transition: { duration: 0.55 } });
      return;
    }
    setError('');
    setSuccess(true);
    // Runs inside the click/keypress, so the browser lets the music start by itself.
    window.dispatchEvent(new Event('birthday-music-start'));
    sfx.win();
    fireConfetti({ count: 120, y: 0.55 });
    timer.current = setTimeout(() => {
      login();
      navigate(PAGES[1].path);
    }, 1900);
  };

  const words = config.loginTitle.split(' ');

  return (
    <PageShell index={0} theme="dawn" hideNav floaterCount={20} className="page-login">
      <div className="login-hero">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 11, delay: 0.15 }}>
          <BowIcon className="bow-svg" />
        </motion.div>
        <h1 className="display login-title" aria-label={config.loginTitle}>
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              aria-hidden="true"
              className="word"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.12, duration: 0.5 }}
            >
              {w}&nbsp;
            </motion.span>
          ))}
        </h1>
        <p className="lead">{config.loginSubtitle}</p>
      </div>

      <motion.div animate={controls} className="glass login-card">
          <form onSubmit={submit} noValidate>
            <label className="field">
              <span>Username</span>
              <input value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" autoCapitalize="none" spellCheck="false" placeholder="Your secret name" aria-invalid={!!error} />
            </label>
            <label className="field">
              <span>Password</span>
              <span className="pw">
                <input
                  type={show ? 'text' : 'password'}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  autoComplete="current-password"
                  placeholder="The magic word"
                  aria-invalid={!!error}
                />
                <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)} aria-pressed={show} aria-label={show ? 'Hide password' : 'Show password'}>
                  <span aria-hidden="true">{show ? '🙈' : '👁️'}</span>
                </button>
              </span>
            </label>
            <p className="form-error" role="alert">{error}</p>
            {fails >= 2 && c.hint && <p className="form-hint">{c.hint}</p>}
            <button type="submit" className="btn btn-glow btn-block" disabled={success}>
              Unlock the surprise 🎀
            </button>
          </form>
      </motion.div>

      <p className="credit">Made with love by {config.brotherName} 💗</p>

      {createPortal(
        <AnimatePresence>
          {success && (
            <motion.div
              className="unlock-overlay"
              initial={{ clipPath: 'circle(0% at 50% 55%)' }}
              animate={{ clipPath: 'circle(150% at 50% 55%)' }}
              transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              role="status"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.25, 1] }} transition={{ delay: 0.5, duration: 0.7 }} className="unlock-heart" aria-hidden="true">💖</motion.div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="display">
                Opening {config.sisterName}&apos;s Little Universe…
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </PageShell>
  );
}
